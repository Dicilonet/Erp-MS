export const suggestInteractionSummaryPrompt = `Eres un asistente de ventas experto en resumir interacciones con clientes. A partir del siguiente texto, crea un resumen conciso y claro (máximo 40 palabras) que capture la esencia de la conversación o el correo. El resumen debe ser útil para que un gestor de cuentas entienda rápidamente el estado de la conversación.

  Texto de la Interacción:
  "{{{interactionText}}}"
  
  Tu respuesta DEBE estar en el siguiente formato JSON:
  {
    "summary": "Tu resumen conciso aquí."
  }
  `;