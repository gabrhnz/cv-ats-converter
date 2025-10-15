# 🚀 Guía de Configuración Rápida

## Paso 1: Instalar Dependencias

```bash
cd cv-converter
npm install
```

## Paso 2: Configurar OpenRouter API

1. Ve a [OpenRouter](https://openrouter.ai/) y crea una cuenta
2. Obtén tu API Key desde el dashboard
3. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
4. Edita `.env` y agrega tu API Key:
   ```env
   OPENROUTER_API_KEY=sk-or-v1-tu-key-aqui
   OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
   PORT=3001
   ```

## Paso 3: Iniciar la Aplicación

```bash
npm run dev
```

Esto iniciará:
- **Frontend** en http://localhost:3000
- **Backend** en http://localhost:3001

## Paso 4: Probar

1. Abre http://localhost:3000 en tu navegador
2. Sube un CV en PDF o DOCX
3. Espera 15-30 segundos mientras la IA procesa
4. ¡Descarga tu CV en formato ATS!

## ⚠️ Problemas Comunes

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "OPENROUTER_API_KEY no está configurada"
- Asegúrate de que el archivo `.env` existe
- Verifica que la API Key es correcta
- Reinicia el servidor con `npm run dev`

### Puerto 3000 o 3001 en uso
Cambia los puertos en:
- `.env` → `PORT=3002`
- `vite.config.js` → `port: 3005`

## 📊 Costos Estimados (OpenRouter)

| Modelo | Costo por CV | Calidad |
|--------|--------------|---------|
| Claude 3.5 Sonnet | ~$0.01-0.03 | ⭐⭐⭐⭐⭐ |
| GPT-4 Turbo | ~$0.02-0.04 | ⭐⭐⭐⭐⭐ |
| Llama 3 70B | ~$0.001-0.005 | ⭐⭐⭐⭐ |

## 🎯 Siguiente Paso

¡Listo! Ahora puedes convertir CVs a formato ATS profesional.
