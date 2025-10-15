# 🔧 Troubleshooting - CV to ATS Converter

## 🐛 Error: "The string did not match the expected pattern"

### Causa
Este error ocurre cuando la IA (OpenRouter) devuelve una respuesta que no es JSON válido o no tiene la estructura esperada.

### Soluciones Implementadas

1. **Mejor parsing de JSON** ✅
   - Detecta y remueve bloques markdown (```json)
   - Busca JSON en el contenido con regex
   - Manejo de errores más específico

2. **Logging mejorado** ✅
   - Muestra los primeros 500 caracteres de la respuesta
   - Log de errores de parsing
   - Mensajes de error más descriptivos

3. **Validación de estructura** ✅
   - Verifica que existan `nombre` y `contacto`
   - Valida antes de devolver al frontend

### Cómo Verificar

1. **Ver logs en Vercel**:
   ```bash
   # Ir a Vercel Dashboard
   https://vercel.com/portfolios-projects-268c19b4/cv-converter
   
   # Click en el deployment más reciente
   # Click en "Functions" → "api/upload-cv"
   # Ver logs en tiempo real
   ```

2. **Probar localmente**:
   ```bash
   npm run dev
   # Subir un CV
   # Ver logs en la terminal
   ```

### Posibles Causas

1. **API Key inválida**
   - Verifica que la nueva API key esté en Vercel
   - Error: `401 Unauthorized`

2. **Rate limit excedido**
   - Demasiadas solicitudes
   - Error: `429 Too Many Requests`

3. **Modelo no disponible**
   - El modelo `anthropic/claude-3.5-sonnet` no está disponible
   - Cambiar a otro modelo

4. **Respuesta de IA inválida**
   - La IA no devolvió JSON
   - Prompt necesita ajustes

---

## 🔍 Debugging Paso a Paso

### 1. Verificar Variables de Entorno

```bash
# En Vercel Dashboard
Settings → Environment Variables

Verificar:
✅ OPENROUTER_API_KEY = sk-or-v1-...
✅ OPENROUTER_MODEL = anthropic/claude-3.5-sonnet
✅ NODE_ENV = production
```

### 2. Ver Logs de Deployment

```bash
# Ir a:
https://vercel.com/portfolios-projects-268c19b4/cv-converter

# Click en el deployment más reciente
# Ver "Build Logs" para errores de compilación
# Ver "Functions" para errores de runtime
```

### 3. Probar API Directamente

```bash
# Probar que la API key funciona
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer TU-API-KEY"

# Debería devolver lista de modelos disponibles
```

### 4. Verificar Serverless Function

```bash
# La función debe estar en:
/api/upload-cv.js

# Vercel la detecta automáticamente
# Debe aparecer en Dashboard → Functions
```

---

## 🚨 Errores Comunes

### Error 1: "API Key inválida"

**Síntoma**: Error 401 en logs

**Solución**:
1. Generar nueva API key en OpenRouter
2. Actualizar en Vercel
3. Redesplegar

### Error 2: "Module not found"

**Síntoma**: Error al importar módulos

**Solución**:
```bash
# Verificar que todas las dependencias estén en package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Error 3: "Function timeout"

**Síntoma**: La función tarda más de 60s

**Solución**:
- OCR puede tardar mucho
- Optimizar imagen antes de OCR
- Considerar servicio dedicado para OCR

### Error 4: "JSON parse error"

**Síntoma**: "The string did not match the expected pattern"

**Solución**:
- Ya implementado mejor parsing
- Ver logs para ver qué devolvió la IA
- Ajustar prompt si es necesario

---

## 📊 Verificar Estado del Sistema

### Checklist

- [ ] Vercel deployment exitoso (verde)
- [ ] Variables de entorno configuradas
- [ ] API key de OpenRouter válida
- [ ] Serverless functions detectadas
- [ ] Build sin errores
- [ ] Logs sin errores 401/429

### Comandos Útiles

```bash
# Ver deployments
vercel ls

# Ver info del proyecto
vercel inspect

# Ver logs (necesita deployment ID)
vercel logs DEPLOYMENT_URL

# Redesplegar
vercel --prod
```

---

## 🔄 Si Nada Funciona

### Plan B: Rollback

```bash
# Ver deployments anteriores
vercel ls

# Promover un deployment anterior
# En Vercel Dashboard → Deployments
# Click en deployment que funcionaba
# Click "Promote to Production"
```

### Plan C: Debugging Local

```bash
# Correr localmente
npm run dev

# Probar con un CV
# Ver logs en terminal
# Identificar el error exacto
```

---

## 📝 Logs Importantes

### Qué Buscar en Logs

1. **"Respuesta de IA (primeros 500 chars)"**
   - Muestra qué devolvió OpenRouter
   - Debe ser JSON válido

2. **"Error parseando JSON"**
   - Muestra el string que intentó parsear
   - Identifica el problema

3. **"API Key inválida"**
   - Problema de autenticación
   - Actualizar API key

4. **"Estructura inválida"**
   - El JSON no tiene nombre/contacto
   - Problema con el prompt

---

## 🎯 Próximos Pasos

Si el error persiste después de los fixes:

1. **Verificar logs en Vercel** (más importante)
2. **Probar localmente** para aislar el problema
3. **Verificar API key** en OpenRouter dashboard
4. **Cambiar modelo** si Claude no funciona
5. **Simplificar prompt** si la IA no responde bien

---

## 💡 Tips

- **Siempre ver logs primero** antes de hacer cambios
- **Probar localmente** para debugging más rápido
- **Un cambio a la vez** para identificar qué funciona
- **Guardar deployments que funcionan** para rollback

---

**Última Actualización**: 14 de Octubre, 2025  
**Estado**: Debugging en progreso
