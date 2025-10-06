'use server';

import { generateFlow, runFlow } from 'genkit';
import { z } from 'zod';
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

export async function suggestInteractionSummary(
  input: z.infer<typeof InteractionSummaryInputSchema>
): Promise<z.infer<typeof InteractionSummaryOutputSchema>> {
  const flow = await generateFlow({
    name: 'suggestInteractionSummaryServerAction',
    prompt: suggestInteractionSummaryPrompt,
    inputSchema: InteractionSummaryInputSchema,
    outputSchema: InteractionSummaryOutputSchema,
  });

  return await runFlow(flow, input);
}

export async function processReceipt(
  input: z.infer<typeof ReceiptInputSchema>
): Promise<z.infer<typeof ReceiptOutputSchema>> {
  const flow = await generateFlow({
    name: 'processReceiptServerAction',
    prompt: processReceiptPrompt,
    inputSchema: ReceiptInputSchema,
    outputSchema: ReceiptOutputSchema,
  });
  
  return await runFlow(flow, input);
}

export async function generateMarketingCampaign(
  input: z.infer<typeof MarketingCampaignInputSchema>
): Promise<z.infer<typeof MarketingCampaignOutputSchema>> {
  const flow = await generateFlow({
    name: 'generateMarketingCampaignServerAction',
    prompt: generateMarketingCampaignPrompt,
    inputSchema: MarketingCampaignInputSchema,
    outputSchema: MarketingCampaignOutputSchema,
  });

  return await runFlow(flow, input);
}

export async function generateSocialMediaImage(prompt: string): Promise<string> {
    const flow = await generateFlow({
        name: 'generateSocialMediaImageServerAction',
        prompt: generateSocialMediaImagePrompt,
        inputSchema: z.string(),
        outputSchema: z.string(),
        config: {
          model: 'googleai/imagen-2',
          response: {
            format: 'dataUri',
          },
        },
    });
    
    return await runFlow(flow, prompt);
}
