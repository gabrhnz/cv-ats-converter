import axios from 'axios';

/**
 * Convierte el texto del CV a formato ATS estructurado usando OpenRouter API
 */
export async function convertToATS(cvText) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY no está configurada');
  }

  // Limitar longitud del texto del CV para evitar ataques de inyección
  const sanitizedCVText = cvText.slice(0, 50000); // Máximo 50k caracteres
  
  const prompt = `Eres un experto en recursos humanos especializado en sistemas ATS (Applicant Tracking System).

Analiza el siguiente CV y extrae la información en formato JSON estructurado. Debes ser preciso y mantener toda la información relevante.

FORMATO DE SALIDA REQUERIDO (JSON):
{
  "nombre": "Nombre completo",
  "titulo": "Título profesional principal",
  "contacto": {
    "telefono": "Teléfono",
    "email": "Email",
    "ubicacion": "Ciudad, País",
    "linkedin": "Usuario de LinkedIn (sin URL completa)"
  },
  "resumen": "Resumen profesional de 3-4 líneas destacando experiencia, especialización y habilidades clave",
  "experiencia": [
    {
      "puesto": "Título del puesto",
      "empresa": "Nombre de la empresa",
      "periodo": "Mes Año – Mes Año",
      "logros": [
        "Logro 1 con métricas si están disponibles",
        "Logro 2 enfocado en resultados"
      ]
    }
  ],
  "educacion": [
    {
      "titulo": "Título obtenido",
      "institucion": "Nombre de la institución",
      "periodo": "Año o período",
      "estado": "COMPLETADO/EN CURSO (opcional)"
    }
  ],
  "competencias": "Lista de competencias separadas por |"
}

INSTRUCCIONES CRÍTICAS:
- SIEMPRE extrae TODOS los datos de contacto: teléfono, email, ubicación, LinkedIn
- Si no encuentras algún dato de contacto, busca más cuidadosamente en el CV
- Mantén el idioma original del CV (español o inglés)
- Convierte logros en formato orientado a resultados con métricas cuando sea posible
- Sé preciso con fechas y nombres
- El resumen debe ser de 4-5 líneas para llenar bien el espacio
- Cada experiencia debe tener 3-4 logros detallados (no solo 2)
- Los logros deben ser descriptivos y específicos, no solo una línea corta
- Expande los logros con contexto, tecnologías usadas, y resultados cuando estén disponibles
- Las competencias deben incluir todas las relevantes encontradas (12-15 competencias)
- Si el CV tiene poca información, expande los logros con más detalles técnicos
- Objetivo: llenar al menos 60-70% de una página Letter con contenido relevante

CV A ANALIZAR:
${sanitizedCVText}

Responde ÚNICAMENTE con el JSON, sin texto adicional.`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3001',
          'X-Title': 'CV to ATS Converter'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Extraer JSON del contenido (por si viene con markdown)
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/g, '');
    }

    const atsData = JSON.parse(jsonStr);
    
    // Validar estructura básica
    if (!atsData.nombre || !atsData.contacto) {
      throw new Error('La respuesta de la IA no tiene la estructura esperada');
    }

    return atsData;
  } catch (error) {
    console.error('Error llamando a OpenRouter:', error.response?.data || error.message);
    throw new Error(`Error procesando con IA: ${error.message}`);
  }
}
