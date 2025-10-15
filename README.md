# 🎯 Conversor de CV a Formato ATS

Aplicación web que convierte automáticamente CVs (PDF/DOCX) a un formato optimizado para sistemas ATS (Applicant Tracking System) usando inteligencia artificial a través de OpenRouter API.

## ✨ Características

- 📤 **Carga de archivos**: Sube CVs en formato PDF, DOCX o imágenes (JPG, PNG, WEBP)
- 🔍 **OCR Inteligente**: Extrae texto de imágenes usando Tesseract.js con optimización automática
- 🤖 **IA Inteligente**: Usa OpenRouter API (Claude, GPT-4, etc.) para extraer y estructurar información
- 📄 **Formato ATS Profesional**: Genera CVs optimizados para sistemas de seguimiento de candidatos
- 💾 **Descarga PDF**: Exporta el CV convertido en formato PDF de alta calidad
- 🎨 **Interfaz Moderna**: UI intuitiva y responsive con React
- ⚡ **Procesamiento Rápido**: Conversión en segundos (OCR puede tardar 30-60s)

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+ instalado
- Cuenta en [OpenRouter](https://openrouter.ai/) con API Key

### Pasos

1. **Clonar o navegar al proyecto**
   ```bash
   cd cv-converter
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```bash
   cp .env.example .env
   ```
   
   Edita `.env` y agrega tu API Key de OpenRouter:
   ```env
   OPENROUTER_API_KEY=tu_api_key_aqui
   OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
   PORT=3001
   ```

4. **Iniciar la aplicación**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 📖 Uso

1. **Sube tu CV**: Arrastra o selecciona un archivo PDF, DOCX o imagen (JPG/PNG/WEBP)
2. **Espera el procesamiento**: 
   - PDF/DOCX: 15-30 segundos
   - Imágenes con OCR: 30-60 segundos
3. **Revisa el resultado**: Visualiza tu CV en formato ATS
4. **Descarga**: Guarda el PDF optimizado

### 💡 Consejos para Imágenes
- Usa imágenes claras y bien iluminadas
- Asegúrate de que el texto sea legible
- Evita fondos con texturas o patrones
- Resolución recomendada: 1500px de ancho mínimo

## 🛠️ Tecnologías

### Frontend
- **React 18**: Framework UI
- **Vite**: Build tool rápido
- **CSS Modules**: Estilos componetizados

### Backend
- **Express**: Servidor Node.js
- **Helmet.js**: Seguridad HTTP headers
- **Multer**: Manejo de archivos
- **pdf2json**: Extracción de texto de PDFs
- **mammoth**: Extracción de texto de DOCX
- **Tesseract.js**: OCR para imágenes (español e inglés)
- **Sharp**: Optimización de imágenes para OCR
- **Puppeteer**: Generación de PDFs
- **OpenRouter API**: Procesamiento con IA

## 📁 Estructura del Proyecto

```
cv-converter/
├── server/
│   ├── index.js              # Servidor Express
│   └── services/
│       ├── cvParser.js       # Parser de PDF/DOCX/Imágenes
│       ├── atsConverter.js   # Conversión con IA
│       └── pdfGenerator.js   # Generador de PDFs
├── src/
│   ├── components/
│   │   ├── FileUpload.jsx    # Componente de carga
│   │   ├── LoadingSpinner.jsx # Indicador de carga
│   │   └── CVPreview.jsx     # Vista previa del CV
│   ├── App.jsx               # Componente principal
│   └── main.jsx              # Punto de entrada
├── package.json
├── .env.example
└── README.md
```

## 🔧 Configuración Avanzada

### Modelos de IA Disponibles

Puedes cambiar el modelo en `.env`:

```env
# Claude (recomendado para español)
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# GPT-4
OPENROUTER_MODEL=openai/gpt-4-turbo

# Llama 3
OPENROUTER_MODEL=meta-llama/llama-3-70b-instruct
```

### Límites de Archivos

Por defecto, el límite es 10MB. Para cambiarlo, edita `server/index.js`:

```javascript
limits: { fileSize: 20 * 1024 * 1024 } // 20MB
```

## 🐛 Solución de Problemas

### Error: "OPENROUTER_API_KEY no está configurada"
- Verifica que el archivo `.env` existe en la raíz
- Asegúrate de que la variable está correctamente escrita
- Reinicia el servidor después de modificar `.env`

### Error al parsear PDF
- Algunos PDFs escaneados no son legibles (necesitan OCR)
- Intenta convertir el PDF a DOCX primero

### Error de memoria con Puppeteer
- Reduce el tamaño del CV
- Aumenta la memoria disponible para Node.js:
  ```bash
  NODE_OPTIONS="--max-old-space-size=4096" npm run dev
  ```

## 📝 API Endpoints

### POST `/api/upload-cv`
Sube y procesa un CV

**Request:**
- `Content-Type`: `multipart/form-data`
- `cv`: Archivo PDF o DOCX

**Response:**
```json
{
  "success": true,
  "data": {
    "nombre": "Juan Pérez",
    "titulo": "Desarrollador Full Stack",
    "contacto": {...},
    "resumen": "...",
    "experiencia": [...],
    "educacion": [...],
    "competencias": "..."
  }
}
```

### POST `/api/generate-pdf`
Genera un PDF del CV

**Request:**
```json
{
  "htmlContent": "<html>...</html>"
}
```

**Response:** Archivo PDF binario

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Créditos

- Template ATS basado en mejores prácticas de RRHH
- Powered by [OpenRouter](https://openrouter.ai/)
- Iconos: Unicode Emoji

## 📧 Contacto

Para preguntas o sugerencias, abre un issue en el repositorio.

---

**Nota**: Esta aplicación requiere una API Key de OpenRouter. Los costos dependen del modelo y uso. Consulta [precios de OpenRouter](https://openrouter.ai/docs#models).
