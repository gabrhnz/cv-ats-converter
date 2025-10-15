import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <h3>Procesando tu CV...</h3>
      <p>La IA está analizando y convirtiendo tu información al formato ATS</p>
      <div className="loading-steps">
        <div className="step">✓ Extrayendo texto del documento</div>
        <div className="step step-note">💡 Si es una imagen, el OCR puede tardar 30-60 segundos</div>
        <div className="step">⏳ Analizando con IA</div>
        <div className="step">⏳ Generando formato ATS</div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
