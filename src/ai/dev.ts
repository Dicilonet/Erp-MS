import { config } from 'dotenv';
config();

import { configureGenkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// CORRECTO: La configuración de plugins se mueve aquí, al entorno de solo servidor.
configureGenkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});


import '@/ai/flows/suggest-interaction-summary.ts';
import '@/ai/flows/process-receipt.ts';
import '@/ai/flows/generate-social-media-image.ts';
import '@/ai/flows/generate-marketing-campaign.ts';
