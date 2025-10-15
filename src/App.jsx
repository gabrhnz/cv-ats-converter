import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import CVPreview from './components/CVPreview';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const [atsData, setAtsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    setAtsData(null);

    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error procesando el CV');
      }

      setAtsData(result.data);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAtsData(null);
    setError(null);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="app-header no-print">
          <h1>🎯 Conversor de CV a Formato ATS</h1>
          <p>Sube tu CV y conviértelo automáticamente a un formato optimizado para sistemas ATS</p>
        </header>

        {!atsData && !loading && (
          <FileUpload onFileUpload={handleFileUpload} />
        )}

        {loading && <LoadingSpinner />}

        {error && (
          <div className="error-message no-print">
            <h3>❌ Error</h3>
            <p>{error}</p>
            <button onClick={handleReset} className="btn-secondary">
              Intentar de nuevo
            </button>
          </div>
        )}

        {atsData && !loading && (
          <CVPreview data={atsData} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

export default App;
