import fs from 'fs';
import PDFParser from 'pdf2json';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import sharp from 'sharp';

/**
 * Parsea un CV en formato PDF, DOCX o Imagen y extrae el texto
 */
export async function parseCV(filePath, mimeType) {
  try {
    if (mimeType === 'application/pdf') {
      return await parsePDF(filePath);
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await parseDOCX(filePath);
    } else if (mimeType.startsWith('image/')) {
      return await parseImage(filePath);
    } else {
      throw new Error('Formato de archivo no soportado');
    }
  } catch (error) {
    console.error('Error parseando CV:', error);
    throw new Error(`Error al leer el archivo: ${error.message}`);
  }
}

async function parsePDF(filePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on('pdfParser_dataError', errData => {
      reject(new Error(errData.parserError));
    });
    
    pdfParser.on('pdfParser_dataReady', pdfData => {
      try {
        // Extraer texto de todas las páginas
        let text = '';
        if (pdfData.Pages) {
          pdfData.Pages.forEach(page => {
            if (page.Texts) {
              page.Texts.forEach(textItem => {
                textItem.R.forEach(r => {
                  text += decodeURIComponent(r.T) + ' ';
                });
              });
              text += '\n';
            }
          });
        }
        resolve(text.trim());
      } catch (error) {
        reject(error);
      }
    });
    
    pdfParser.loadPDF(filePath);
  });
}

async function parseDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

async function parseImage(filePath) {
  try {
    console.log('Procesando imagen con OCR...');
    
    // Optimizar imagen para mejor OCR
    const optimizedPath = filePath + '_optimized.png';
    await sharp(filePath)
      .resize(2000, null, { // Redimensionar manteniendo aspect ratio
        withoutEnlargement: true,
        fit: 'inside'
      })
      .greyscale() // Convertir a escala de grises
      .normalize() // Normalizar contraste
      .png()
      .toFile(optimizedPath);
    
    // Ejecutar OCR con Tesseract
    const { data: { text } } = await Tesseract.recognize(
      optimizedPath,
      'spa+eng', // Español e inglés
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR progreso: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );
    
    // Limpiar archivo temporal optimizado
    if (fs.existsSync(optimizedPath)) {
      fs.unlinkSync(optimizedPath);
    }
    
    if (!text || text.trim().length < 50) {
      throw new Error('No se pudo extraer suficiente texto de la imagen. Asegúrate de que la imagen sea clara y legible.');
    }
    
    console.log(`OCR completado. Texto extraído: ${text.length} caracteres`);
    return text;
  } catch (error) {
    console.error('Error en OCR:', error);
    throw new Error(`Error procesando imagen: ${error.message}`);
  }
}
