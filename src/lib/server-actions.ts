
'use server';

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';

import {
  InteractionSummaryInputSchema,
  InteractionSummaryOutputSchema,
  ReceiptInputSchema,
  ReceiptOutputSchema,
  MarketingCampaignInputSchema,
  MarketingCampaignOutputSchema,
} from '@/ai/flows/schemas';
import { suggestInteractionSummaryPrompt } from '@/ai/flows/suggest-interaction-summary';
import { processReceiptPrompt } from '@/ai/flows/process-receipt';
import { generateMarketingCampaignPrompt } from '@/ai/flows/generate-marketing-campaign';
import { generateSocialMediaImagePrompt } from '@/ai/flows/generate-social-media-image';

// --- Configuración de Genkit en el servidor ---
// Esto asegura que la configuración con la API Key solo se ejecute en el servidor.
const configuredAi = ai.configure({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
});


// --- Flow para Resumen de Interacción ---
const summaryFlow = configuredAi.definePrompt({
  name: 'suggestInteractionSummaryAction',
  input: { schema: InteractionSummaryInputSchema },
  output: { schema: InteractionSummaryOutputSchema },
  prompt: suggestInteractionSummaryPrompt,
});

export async function suggestInteractionSummary(
  input: z.infer<typeof InteractionSummaryInputSchema>
): Promise<z.infer<typeof InteractionSummaryOutputSchema>> {
  const { output } = await summaryFlow(input);
  if (!output) throw new Error('Failed to generate summary.');
  return output;
}


// --- Flow para Procesar Facturas ---
const receiptFlow = configuredAi.definePrompt({
  name: 'processReceiptAction',
  input: { schema: ReceiptInputSchema },
  output: { schema: ReceiptOutputSchema },
  prompt: processReceiptPrompt,
});

export async function processReceipt(
  input: z.infer<typeof ReceiptInputSchema>
): Promise<z.infer<typeof ReceiptOutputSchema>> {
  const { output } = await receiptFlow(input);
  if (!output) throw new Error('Failed to process receipt.');
  return output;
}


// --- Flow para Campaña de Marketing ---
const campaignFlow = configuredAi.definePrompt({
  name: 'generateMarketingCampaignAction',
  input: { schema: MarketingCampaignInputSchema },
  output: { schema: MarketingCampaignOutputSchema },
  prompt: generateMarketingCampaignPrompt,
});

export async function generateMarketingCampaign(
  input: z.infer<typeof MarketingCampaignInputSchema>
): Promise<z.infer<typeof MarketingCampaignOutputSchema>> {
  const { output } = await campaignFlow(input);
  if (!output) throw new Error('Failed to generate campaign.');
  return output;
}


// --- Flow para Generación de Imágenes ---
export async function generateSocialMediaImage(prompt: string): Promise<string> {
    const { media } = await configuredAi.generate({
        model: 'googleai/imagen-2.0-latest',
        prompt: generateSocialMediaImagePrompt,
        input: prompt,
    });
    if (!media.url) {
        throw new Error('Image generation failed to return a URL.');
    }
    return media.url;
}
