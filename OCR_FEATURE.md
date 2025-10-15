# 🔍 Funcionalidad OCR - Soporte de Imágenes

## ✨ Nueva Característica Agregada

La aplicación ahora soporta **CVs en formato de imagen** usando tecnología OCR (Reconocimiento Óptico de Caracteres).

---

## 📸 Formatos de Imagen Soportados

- ✅ **JPG / JPEG**
- ✅ **PNG**
- ✅ **WEBP**

Límite de tamaño: **10MB** (igual que PDF/DOCX)

---

## 🛠️ Tecnología Implementada

### Tesseract.js
- Motor OCR de código abierto
- Soporte para **español e inglés** simultáneamente
- Precisión optimizada con preprocesamiento de imagen

### Sharp
- Optimización automática de imágenes antes del OCR
- Conversión a escala de grises
- Normalización de contraste
- Redimensionamiento inteligente (máx. 2000px)

---

## ⚙️ Proceso de OCR

1. **Carga de imagen**: Usuario sube JPG/PNG/WEBP
2. **Optimización**: Sharp procesa la imagen:
   - Redimensiona a 2000px (mantiene aspect ratio)
   - Convierte a escala de grises
   - Normaliza contraste
3. **OCR**: Tesseract.js extrae el texto:
   - Idiomas: Español + Inglés
   - Progreso visible en consola
4. **Validación**: Verifica que se extrajo suficiente texto (mín. 50 caracteres)
5. **Conversión ATS**: El texto extraído se procesa igual que PDF/DOCX

---

## ⏱️ Tiempos de Procesamiento

| Formato | Tiempo Estimado |
|---------|-----------------|
| PDF | 10-20 segundos |
| DOCX | 10-20 segundos |
| **Imagen (OCR)** | **30-60 segundos** |

**Nota**: El OCR es más lento porque debe:
1. Optimizar la imagen
2. Analizar píxeles
3. Reconocer caracteres
4. Construir texto

---

## 💡 Mejores Prácticas para Imágenes

### ✅ Recomendaciones

- **Iluminación**: Usa imágenes bien iluminadas, sin sombras
- **Resolución**: Mínimo 1500px de ancho para mejor precisión
- **Claridad**: Texto nítido y enfocado
- **Fondo**: Preferiblemente blanco o claro, sin texturas
- **Orientación**: Imagen derecha (no rotada)
- **Formato**: Preferir PNG sobre JPG para texto

### ❌ Evitar

- Imágenes borrosas o desenfocadas
- Fondos con patrones o texturas
- Texto muy pequeño (< 10pt)
- Imágenes con mucho ruido
- Capturas de pantalla de baja calidad
- Fotos tomadas con ángulo

---

## 🔧 Configuración Técnica

### Dependencias Agregadas

```json
{
  "tesseract.js": "^5.x",
  "sharp": "^0.33.x"
}
```

### Archivos Modificados

1. **`server/services/cvParser.js`**
   - Función `parseImage()` agregada
   - Soporte para MIME types de imagen
   - Optimización con Sharp
   - OCR con Tesseract

2. **`server/index.js`**
   - MIME types de imagen en Multer
   - Mensaje de error actualizado

3. **`src/components/FileUpload.jsx`**
   - Accept de imágenes en input
   - Validación de tipos de imagen
   - Mensaje actualizado

4. **`src/components/LoadingSpinner.jsx`**
   - Nota sobre tiempo de OCR

---

## 📊 Precisión del OCR

### Factores que Afectan la Precisión

| Factor | Impacto | Solución |
|--------|---------|----------|
| Calidad de imagen | Alto | Usar imágenes de alta resolución |
| Iluminación | Alto | Escanear con buena luz |
| Tipo de fuente | Medio | Fuentes estándar (Arial, Times) |
| Tamaño de texto | Medio | Texto > 10pt |
| Idioma | Bajo | Soporta español e inglés |

### Precisión Esperada

- **Imágenes óptimas**: 95-99% de precisión
- **Imágenes buenas**: 85-95% de precisión
- **Imágenes regulares**: 70-85% de precisión
- **Imágenes malas**: < 70% (puede fallar)

---

## 🐛 Solución de Problemas

### Error: "No se pudo extraer suficiente texto"

**Causas**:
- Imagen de muy baja calidad
- Texto demasiado pequeño
- Imagen borrosa o desenfocada

**Soluciones**:
1. Usar una imagen de mayor resolución
2. Escanear el documento en lugar de fotografiarlo
3. Asegurar buena iluminación
4. Convertir a PDF si es posible

### OCR Muy Lento (> 2 minutos)

**Causas**:
- Imagen muy grande (> 5MB)
- Múltiples páginas en una imagen

**Soluciones**:
1. Reducir tamaño de imagen antes de subir
2. Subir solo una página a la vez
3. Usar formato PDF para múltiples páginas

### Texto Extraído Incorrecto

**Causas**:
- Fuente decorativa o manuscrita
- Fondo con textura
- Bajo contraste

**Soluciones**:
1. Aumentar contraste de la imagen
2. Convertir a escala de grises antes de subir
3. Usar PDF en lugar de imagen

---

## 📈 Mejoras Futuras

### Posibles Optimizaciones

- [ ] Soporte para múltiples páginas
- [ ] Detección automática de orientación
- [ ] Corrección de perspectiva
- [ ] Remoción de ruido avanzada
- [ ] Soporte para más idiomas
- [ ] Pre-visualización del texto extraído
- [ ] Edición manual del texto OCR

---

## 🔒 Consideraciones de Seguridad

### Archivos Temporales

- ✅ Imágenes optimizadas se eliminan automáticamente
- ✅ Archivos originales se eliminan después del procesamiento
- ✅ No se almacenan imágenes en el servidor

### Límites

- ✅ Tamaño máximo: 10MB
- ✅ Rate limiting: 10 solicitudes/minuto
- ✅ Validación de MIME type
- ✅ Nombres de archivo aleatorios

---

## 📝 Ejemplo de Uso

### Código del Parser

```javascript
// Detecta automáticamente el tipo de archivo
if (mimeType.startsWith('image/')) {
  return await parseImage(filePath);
}

// Optimiza y procesa con OCR
async function parseImage(filePath) {
  // 1. Optimizar imagen
  await sharp(filePath)
    .resize(2000, null)
    .greyscale()
    .normalize()
    .png()
    .toFile(optimizedPath);
  
  // 2. Ejecutar OCR
  const { data: { text } } = await Tesseract.recognize(
    optimizedPath,
    'spa+eng'
  );
  
  return text;
}
```

---

## 🎯 Casos de Uso

### Ideal Para:
- ✅ Escaneos de CVs físicos
- ✅ Capturas de pantalla de CVs digitales
- ✅ Fotos de documentos impresos
- ✅ PDFs convertidos a imagen

### No Recomendado Para:
- ❌ Texto manuscrito
- ❌ Imágenes con watermarks
- ❌ Documentos con fondo oscuro
- ❌ Múltiples columnas complejas

---

## 📞 Soporte

Si tienes problemas con el OCR:

1. Verifica la calidad de la imagen
2. Intenta con formato PDF si está disponible
3. Revisa los logs del servidor para detalles
4. Consulta la sección de solución de problemas

---

**Última Actualización**: 14 de Octubre, 2025  
**Versión**: 1.1.0 (OCR Feature)
