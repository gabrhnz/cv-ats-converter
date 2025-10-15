import React, { useRef } from 'react';
import './CVPreview.css';

function CVPreview({ data, onReset }) {
  const cvRef = useRef(null);

  const handleDownloadPDF = async () => {
    try {
      const htmlContent = cvRef.current.innerHTML;
      
      // Crear el HTML completo con estilos
      const fullHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - ${data.nombre}</title>
    <style>
        @page {
            margin: 0;
            size: letter;
        }
        body { 
            margin: 0; 
            padding: 0;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .container {
            max-width: 850px;
            margin: 0 auto;
            background: white;
            padding: 40px 50px;
        }
        .header {
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 4px;
            color: #000;
            text-transform: uppercase;
        }
        .header .subtitle {
            font-size: 11px;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #000;
            font-weight: 400;
            margin-bottom: 10px;
        }
        .header-line {
            height: 2px;
            background: #000;
            margin: 10px 0 12px 0;
        }
        .contact {
            font-size: 10px;
            color: #000;
            margin-bottom: 20px;
        }
        .section {
            margin-bottom: 18px;
        }
        .section-header {
            display: flex;
            margin-bottom: 12px;
        }
        .section-title {
            width: 150px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #000;
            flex-shrink: 0;
        }
        .section-content {
            flex: 1;
            padding-left: 22px;
            border-left: 1px solid #000;
        }
        .summary-text {
            font-size: 10px;
            line-height: 1.6;
            color: #000;
            text-align: justify;
        }
        .job {
            margin-bottom: 16px;
        }
        .job-title {
            font-size: 10px;
            font-weight: 700;
            color: #000;
            margin-bottom: 2px;
        }
        .job-company {
            font-size: 9px;
            color: #000;
            margin-bottom: 4px;
        }
        .job-company a {
            color: #000;
            text-decoration: underline;
        }
        .job ul {
            list-style: none;
            padding-left: 0;
        }
        .job ul li {
            font-size: 9px;
            line-height: 1.5;
            color: #000;
            margin-bottom: 4px;
            padding-left: 12px;
            position: relative;
        }
        .job ul li:before {
            content: "•";
            position: absolute;
            left: 0;
            font-weight: bold;
        }
        .education-item {
            margin-bottom: 10px;
        }
        .education-title {
            font-size: 9.5px;
            font-weight: 400;
            color: #000;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }
        .education-detail {
            font-size: 9px;
            color: #000;
        }
        .competencies {
            font-size: 9px;
            line-height: 1.5;
            color: #000;
        }
        .section-divider {
            height: 1px;
            background: #000;
            margin: 12px 0;
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ htmlContent: fullHTML })
      });

      if (!response.ok) {
        throw new Error('Error generando PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.nombre.replace(/\s+/g, '_')}_CV_ATS.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error descargando PDF:', error);
      alert('Error al generar el PDF. Intenta de nuevo.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cv-preview-wrapper">
      <div className="preview-actions no-print">
        <button onClick={onReset} className="btn-back">
          ← Subir otro CV
        </button>
        <div className="action-buttons">
          <button onClick={handlePrint} className="btn-print">
            🖨️ Imprimir
          </button>
          <button onClick={handleDownloadPDF} className="btn-download">
            📥 Descargar PDF
          </button>
        </div>
      </div>

      <div ref={cvRef} className="cv-ats-container">
        <div className="header">
          <h1>{data.nombre}</h1>
          <div className="subtitle">{data.titulo}</div>
          <div className="header-line"></div>
          <div className="contact">
            {data.contacto.telefono && `${data.contacto.telefono} | `}
            {data.contacto.email && `${data.contacto.email} | `}
            {data.contacto.ubicacion && `${data.contacto.ubicacion}`}
            {data.contacto.linkedin && ` | LinkedIn: ${data.contacto.linkedin}`}
          </div>
        </div>

        {data.resumen && (
          <>
            <div className="section">
              <div className="section-header">
                <div className="section-title">RESUMEN<br />PROFESIONAL</div>
                <div className="section-content">
                  <p className="summary-text">{data.resumen}</p>
                </div>
              </div>
            </div>
            <div className="section-divider"></div>
          </>
        )}

        {data.experiencia && data.experiencia.length > 0 && (
          <>
            <div className="section">
              <div className="section-header">
                <div className="section-title">EXPERIENCIA<br />PROFESIONAL</div>
                <div className="section-content">
                  {data.experiencia.map((exp, index) => (
                    <div key={index} className="job">
                      <div className="job-title">{exp.puesto}</div>
                      <div className="job-company">
                        <a href="#">{exp.empresa}</a> | {exp.periodo}
                      </div>
                      {exp.logros && exp.logros.length > 0 && (
                        <ul>
                          {exp.logros.map((logro, i) => (
                            <li key={i}>{logro}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="section-divider"></div>
          </>
        )}

        {data.educacion && data.educacion.length > 0 && (
          <>
            <div className="section">
              <div className="section-header">
                <div className="section-title">EDUCACIÓN</div>
                <div className="section-content">
                  {data.educacion.map((edu, index) => (
                    <div key={index} className="education-item">
                      <div className="education-title">{edu.titulo}</div>
                      <div className="education-detail">
                        {edu.institucion}
                        {edu.periodo && ` | ${edu.periodo}`}
                        {edu.estado && ` | ${edu.estado}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="section-divider"></div>
          </>
        )}

        {data.competencias && (
          <div className="section">
            <div className="section-header">
              <div className="section-title">COMPETENCIAS<br />CLAVE</div>
              <div className="section-content">
                <div className="competencies">{data.competencias}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CVPreview;
