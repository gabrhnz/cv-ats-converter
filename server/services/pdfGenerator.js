import puppeteer from 'puppeteer';

/**
 * Genera un PDF a partir de contenido HTML
 */
export async function generatePDF(htmlContent) {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    });

    return pdfBuffer;
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
