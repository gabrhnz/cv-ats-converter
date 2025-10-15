import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { parseCV } from './services/cvParser.js';
import { convertToATS } from './services/atsConverter.js';
import { generatePDF } from './services/pdfGenerator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de seguridad
// Helmet.js - Protección de headers HTTP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' })); // Limitar tamaño de JSON
app.use(express.static(path.join(__dirname, '../dist')));

// Rate limiting simple (en producción usar express-rate-limit)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minuto
const MAX_REQUESTS = 10;

app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }
  
  const requests = requestCounts.get(ip).filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (requests.length >= MAX_REQUESTS) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' });
  }
  
  requests.push(now);
  requestCounts.set(ip, requests);
  next();
});

// Configurar multer para subir archivos con nombres seguros
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generar nombre de archivo seguro con hash aleatorio
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomName}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF, DOCX, JPG, PNG y WEBP'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Crear directorio de uploads si no existe
import fs from 'fs';
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Rutas
app.post('/api/upload-cv', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    console.log('Archivo recibido:', req.file.originalname);

    // 1. Parsear el CV
    const cvText = await parseCV(req.file.path, req.file.mimetype);
    console.log('CV parseado, longitud:', cvText.length);

    // 2. Convertir a formato ATS usando OpenRouter
    const atsData = await convertToATS(cvText);
    console.log('Datos ATS generados');

    // 3. Limpiar archivo temporal
    fs.unlinkSync(req.file.path);

    res.json({ success: true, data: atsData });
  } catch (error) {
    console.error('Error procesando CV:', error);
    
    // Limpiar archivo si existe
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      error: 'Error procesando el CV', 
      details: error.message 
    });
  }
});

app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { htmlContent } = req.body;
    
    if (!htmlContent) {
      return res.status(400).json({ error: 'No se proporcionó contenido HTML' });
    }

    // Validar tamaño del HTML
    if (htmlContent.length > 500000) { // 500KB
      return res.status(400).json({ error: 'Contenido HTML demasiado grande' });
    }

    // Sanitizar: remover scripts potencialmente peligrosos
    const sanitizedHTML = htmlContent
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

    const pdfBuffer = await generatePDF(sanitizedHTML);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cv-ats.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).json({ 
      error: 'Error generando PDF', 
      details: error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 OpenRouter API configurada: ${process.env.OPENROUTER_API_KEY ? '✓' : '✗'}`);
});
