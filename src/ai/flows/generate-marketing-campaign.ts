'use server';

// Este archivo ahora solo exporta el texto del prompt, no una definición de Genkit.
export const generateMarketingCampaignPrompt = `Eres un estratega de marketing experto. Basado en la siguiente información sobre el negocio de un cliente, genera una estrategia de campaña concisa.

  - Nombre del Cliente: {{{customerName}}}
  - Tipo de Negocio: {{{businessType}}}
  - Objetivo Principal: {{{mainGoal}}}
  - Público Objetivo: {{{targetAudience}}}
  - Productos/Servicios Clave: {{{keyProducts}}}
  - Tono de la campaña: {{{tone}}}
  
  Tu respuesta DEBE estar en el siguiente formato JSON:
  
  - campaignTitle: Un título pegadizo y potente para la campaña (máx. 10 palabras).
  - campaignSubtitle: Un subtítulo que complemente el título (máx. 15 palabras).
  - summary: Un resumen de la estrategia general en 2-3 frases.
  - keyActions: Un array de 3 a 5 acciones clave concretas. Cada acción debe tener un campo "action" (la acción, ej: "Campaña de Email Marketing") y un campo "description" (una explicación breve de la acción).
  `;
