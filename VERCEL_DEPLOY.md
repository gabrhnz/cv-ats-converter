# 🚀 Guía de Despliegue en Vercel

## 📋 Preparación

### 1. Instalar Vercel CLI (Opcional)
```bash
npm install -g vercel
```

### 2. Crear cuenta en Vercel
- Ve a [vercel.com](https://vercel.com)
- Regístrate con GitHub, GitLab o email

---

## 🔧 Configuración Previa

### Variables de Entorno Requeridas

En Vercel Dashboard → Settings → Environment Variables, agrega:

```
OPENROUTER_API_KEY=sk-or-v1-tu-key-aqui
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
NODE_ENV=production
```

---

## 📦 Método 1: Despliegue desde GitHub (Recomendado)

### Paso 1: Subir a GitHub

```bash
cd "/Users/gabriel/mary cv/cv-converter"

# Inicializar git si no existe
git init

# Agregar archivos
git add .

# Commit
git commit -m "Initial commit - CV to ATS Converter"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/cv-ats-converter.git
git branch -M main
git push -u origin main
```

### Paso 2: Importar en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Click en "Import Git Repository"
3. Selecciona tu repositorio de GitHub
4. Configura:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Agrega las variables de entorno:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_MODEL`
   - `NODE_ENV=production`

6. Click en "Deploy"

---

## 🚀 Método 2: Despliegue con Vercel CLI

```bash
# Login en Vercel
vercel login

# Desplegar
vercel

# Seguir las instrucciones:
# - Set up and deploy? Yes
# - Which scope? Tu cuenta
# - Link to existing project? No
# - Project name? cv-ats-converter
# - Directory? ./
# - Override settings? No

# Desplegar a producción
vercel --prod
```

---

## ⚠️ Limitaciones de Vercel

### 1. **Puppeteer (PDF Generation)**
- ❌ Puppeteer NO funciona bien en Vercel (Chrome headless limitado)
- ✅ **Solución**: Generar PDF en el cliente con `jsPDF` o `html2pdf.js`

### 2. **Tesseract.js (OCR)**
- ⚠️ Puede ser lento en serverless (30-60s)
- ✅ Funciona pero requiere timeout aumentado (60s)

### 3. **Tamaño de Archivos**
- Límite: 10MB (ya configurado)
- Timeout: 60s máximo en plan gratuito

---

## 🔄 Alternativas para PDF

### Opción A: Generar PDF en el Cliente

Instalar en el frontend:
```bash
npm install jspdf html2canvas
```

Modificar `CVPreview.jsx`:
```javascript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const handleDownloadPDF = async () => {
  const element = cvRef.current;
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'letter');
  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(`${data.nombre}_CV_ATS.pdf`);
};
```

### Opción B: Usar Servicio Externo

Servicios de PDF como:
- [PDFShift](https://pdfshift.io/)
- [HTML2PDF.app](https://html2pdf.app/)
- [Doppio](https://doppio.sh/)

---

## 🎨 Editar UI con v0

### Paso 1: Acceder a v0.dev

1. Ve a [v0.dev](https://v0.dev)
2. Login con tu cuenta de Vercel

### Paso 2: Crear Componente

Puedes pedirle a v0 que genere componentes como:

```
"Crea un componente de carga de archivos con drag & drop 
para CVs en PDF, DOCX e imágenes. Debe tener:
- Área de drag and drop
- Botón de selección de archivo
- Vista previa del archivo seleccionado
- Indicador de progreso
- Estilo moderno con Tailwind CSS"
```

### Paso 3: Integrar Componentes

1. v0 generará el código React + Tailwind
2. Copia el componente a tu proyecto
3. Reemplaza los componentes existentes
4. Ajusta la lógica de negocio

### Componentes Sugeridos para Mejorar

1. **FileUpload**: Drag & drop más visual
2. **LoadingSpinner**: Animación más moderna
3. **CVPreview**: Cards con mejor diseño
4. **Header**: Navbar con logo y navegación

---

## 📊 Después del Despliegue

### Verificar Funcionalidad

1. **Upload de PDF/DOCX**: ✅ Debe funcionar
2. **Upload de Imágenes (OCR)**: ⚠️ Puede ser lento (60s)
3. **Conversión con IA**: ✅ Debe funcionar
4. **Descarga PDF**: ⚠️ Requiere implementación cliente

### Monitoreo

- **Logs**: Vercel Dashboard → Deployments → Logs
- **Analytics**: Vercel Dashboard → Analytics
- **Errors**: Vercel Dashboard → Monitoring

---

## 🔐 Seguridad en Producción

### Variables de Entorno

✅ Ya configuradas en Vercel Dashboard

### CORS

Actualizar en `vercel.json` si es necesario:
```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "https://tu-dominio.vercel.app" }
      ]
    }
  ]
}
```

### Rate Limiting

Vercel tiene rate limiting automático, pero puedes agregar más:
- Usar Vercel Edge Config
- Implementar Redis con Upstash

---

## 🎯 Dominio Personalizado

### Agregar Dominio

1. Vercel Dashboard → Settings → Domains
2. Agregar dominio: `cv-converter.tudominio.com`
3. Configurar DNS según instrucciones
4. Esperar propagación (5-10 minutos)

---

## 📝 Checklist de Despliegue

- [ ] Código subido a GitHub
- [ ] Variables de entorno configuradas en Vercel
- [ ] Build exitoso en Vercel
- [ ] Probar upload de PDF
- [ ] Probar upload de DOCX
- [ ] Probar upload de imagen (OCR)
- [ ] Probar conversión con IA
- [ ] Implementar generación de PDF (cliente o servicio)
- [ ] Configurar dominio personalizado (opcional)
- [ ] Monitorear logs y errores

---

## 🐛 Troubleshooting

### Error: "Function timeout"
- Aumentar timeout en `vercel.json` (máx 60s en plan gratuito)
- Optimizar procesamiento de imágenes

### Error: "Module not found"
- Verificar que todas las dependencias estén en `package.json`
- Ejecutar `npm install` localmente

### Error: "API Key not found"
- Verificar variables de entorno en Vercel Dashboard
- Re-desplegar después de agregar variables

### OCR muy lento
- Es normal en serverless (30-60s)
- Considerar servicio dedicado para OCR
- Mostrar mejor feedback al usuario

---

## 💰 Costos

### Vercel (Plan Hobby - Gratis)
- ✅ 100GB bandwidth/mes
- ✅ Serverless functions ilimitadas
- ✅ 100 deployments/día
- ⚠️ 60s timeout máximo

### OpenRouter API
- Depende del uso
- Claude 3.5 Sonnet: ~$0.01-0.03 por CV
- Configurar límites en OpenRouter Dashboard

---

## 🚀 Próximos Pasos

1. **Desplegar en Vercel**
2. **Probar funcionalidad**
3. **Editar UI con v0.dev**
4. **Implementar PDF en cliente**
5. **Agregar analytics**
6. **Optimizar performance**

---

**¿Listo para desplegar?** Ejecuta:

```bash
vercel
```

O sube a GitHub y conecta con Vercel Dashboard.

---

**Última Actualización**: 14 de Octubre, 2025  
**Versión**: 1.1.0 (Vercel Ready)
