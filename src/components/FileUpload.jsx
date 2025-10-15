import React, { useState, useRef } from 'react';
import './FileUpload.css';

function FileUpload({ onFileUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];
    
    if (!validTypes.includes(file.type)) {
      alert('Por favor sube un archivo PDF, DOCX, JPG, PNG o WEBP');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es muy grande. Máximo 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container">
      <div
        className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="file-input"
          accept=".pdf,.docx,.jpg,.jpeg,.png,.webp"
          onChange={handleChange}
        />

        <div className="drop-zone-content">
          <div className="upload-icon">📄</div>
          <h3>Arrastra tu CV aquí</h3>
          <p>o</p>
          <button onClick={handleButtonClick} className="btn-browse">
            Seleccionar archivo
          </button>
          <p className="file-info">Formatos aceptados: PDF, DOCX, JPG, PNG, WEBP (máx. 10MB)</p>
        </div>
      </div>

      {selectedFile && (
        <div className="file-selected">
          <div className="file-info-box">
            <span className="file-icon">✓</span>
            <div className="file-details">
              <p className="file-name">{selectedFile.name}</p>
              <p className="file-size">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button onClick={handleUpload} className="btn-upload">
            Convertir a ATS →
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
