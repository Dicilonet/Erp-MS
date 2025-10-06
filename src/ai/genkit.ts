import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';

config();

// CORRECTO: El objeto `ai` se exporta sin configuración de plugins para el lado del cliente.
export const ai = genkit();
