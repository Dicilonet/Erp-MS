
'use server';

import { z } from 'zod';
import { genkit } from 'genkit';
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

// Función auxiliar para obtener una instancia configurada de Genkit
const getAI = () => genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: false,
});


// --- Flow para Resumen de Interacción ---
export async function suggestInteractionSummary(
  input: z.infer<typeof InteractionSummaryInputSchema>
): Promise<z.infer<typeof InteractionSummaryOutputSchema>> {
  const ai = getAI();
  const summaryFlow = ai.definePrompt({
    name: 'suggestInteractionSummaryAction',
    input: { schema: InteractionSummaryInputSchema },
    output: { schema: InteractionSummaryOutputSchema },
    prompt: suggestInteractionSummaryPrompt,
  });

  const { output } = await summaryFlow(input);
  if (!output) throw new Error('Failed to generate summary.');
  return output;
}


// --- Flow para Procesar Facturas ---
export async function processReceipt(
  input: z.infer<typeof ReceiptInputSchema>
): Promise<z.infer<typeof ReceiptOutputSchema>> {
  const ai = getAI();
  const receiptFlow = ai.definePrompt({
    name: 'processReceiptAction',
    input: { schema: ReceiptInputSchema },
    output: { schema: ReceiptOutputSchema },
    prompt: processReceiptPrompt,
  });

  const { output } = await receiptFlow(input);
  if (!output) throw new Error('Failed to process receipt.');
  return output;
}


// --- Flow para Campaña de Marketing ---
export async function generateMarketingCampaign(
  input: z.infer<typeof MarketingCampaignInputSchema>
): Promise<z.infer<typeof MarketingCampaignOutputSchema>> {
  const ai = getAI();
  const campaignFlow = ai.definePrompt({
    name: 'generateMarketingCampaignAction',
    input: { schema: MarketingCampaignInputSchema },
    output: { schema: MarketingCampaignOutputSchema },
    prompt: generateMarketingCampaignPrompt,
  });

  const { output } = await campaignFlow(input);
  if (!output) throw new Error('Failed to generate campaign.');
  return output;
}


// --- Flow para Generación de Imágenes ---
export async function generateSocialMediaImage(prompt: string): Promise<string> {
    const ai = getAI();
    const { media } = await ai.generate({
        model: 'imagen-2',
        prompt: generateSocialMediaImagePrompt.replace('{{{prompt}}}', prompt),
    });
    const url = media.url;
    if (!url) {
        throw new Error('Image generation failed to return a URL.');
    }
    return url;
}
