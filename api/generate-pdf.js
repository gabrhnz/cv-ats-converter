// Vercel Serverless Function para generar PDF
// NOTA: Puppeteer no funciona bien en Vercel debido a limitaciones de Chrome
// Alternativa: Usar un servicio externo o generar PDF en el cliente

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { htmlContent } = req.body;

    if (!htmlContent) {
      return res.status(400).json({ error: 'No se proporcionó contenido HTML' });
    }

    // Validar tamaño del HTML
    if (htmlContent.length > 500000) {
      return res.status(400).json({ error: 'Contenido HTML demasiado grande' });
    }

    // Sanitizar HTML
    const sanitizedHTML = htmlContent
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

    // En Vercel, usaremos una alternativa a Puppeteer
    // Opción 1: Usar @vercel/og o similar
    // Opción 2: Generar PDF en el cliente con jsPDF
    // Opción 3: Usar servicio externo como PDFShift, HTML2PDF.app

    // Por ahora, devolvemos el HTML para que el cliente lo maneje
    res.status(200).json({ 
      message: 'PDF generation in client-side',
      htmlContent: sanitizedHTML 
    });

  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).json({ 
      error: 'Error generando PDF', 
      details: error.message 
    });
  }
}
