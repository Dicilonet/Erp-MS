
'use client';

import {genkit} from 'genkit';

// CORRECTO: El objeto `ai` se exporta sin configuración de plugins para el lado del cliente.
// La configuración se ha movido completamente a `src/ai/dev.ts` para evitar errores de compilación.
export const ai = genkit();
