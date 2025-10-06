export const processReceiptPrompt = `Analiza la siguiente imagen de una factura o ticket y extrae la información requerida en formato JSON.

  Imagen de la factura: {{media url=receiptImage}}
  
  Extrae los siguientes campos:
  - description: El nombre del comercio o la descripción principal del gasto.
  - subtotal: El importe antes de impuestos (base imponible). Si no se especifica, calcúlalo a partir del total y el IVA.
  - tax: El importe total de los impuestos (IVA).
  - total: El importe final pagado.
  - date: La fecha de la factura en formato YYYY-MM-DD.
  - category: Asigna una categoría de gasto de entre las siguientes opciones: "Software", "Marketing", "Hardware", "Oficina", "Consultoría", "Transporte", "Comida", "Otros".
  
  Si un campo no se puede determinar, devuelve un valor razonable por defecto (ej. 0 para números, string vacío para texto, fecha actual para la fecha).
  `;
