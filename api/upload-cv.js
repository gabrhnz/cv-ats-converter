// Vercel Serverless Function para subir CV
import formidable from 'formidable';
import fs from 'fs';
import { parseCV } from '../server/services/cvParser.js';
import { convertToATS } from '../server/services/atsConverter.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({
    maxFileSize: 10 * 1024 * 1024, // 10MB
    keepExtensions: true,
  });

  try {
    const [fields, files] = await form.parse(req);
    const file = files.cv[0];

    if (!file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    // Validar tipo de archivo
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        error: 'Solo se permiten archivos PDF, DOCX, JPG, PNG y WEBP' 
      });
    }

    console.log('Archivo recibido:', file.originalFilename);

    // Parsear el CV
    const cvText = await parseCV(file.filepath, file.mimetype);
    console.log('CV parseado, longitud:', cvText.length);

    // Convertir a formato ATS usando OpenRouter
    const atsData = await convertToATS(cvText);
    console.log('Datos ATS generados');

    // Limpiar archivo temporal
    if (fs.existsSync(file.filepath)) {
      fs.unlinkSync(file.filepath);
    }

    res.status(200).json({ success: true, data: atsData });
  } catch (error) {
    console.error('Error procesando CV:', error);
    res.status(500).json({ 
      error: 'Error procesando el CV', 
      details: error.message 
    });
  }
}
