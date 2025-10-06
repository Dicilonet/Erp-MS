'use server';
import { config } from 'dotenv';
config();

import { configureGenkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// CORRECTO: La configuración de plugins se mueve aquí, al entorno de solo servidor.
configureGenkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: false,
});
