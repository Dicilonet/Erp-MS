'use server';
/**
 * @fileOverview An AI agent that generates a marketing campaign strategy.
 * - generateMarketingCampaign - A function to generate a campaign from user goals.
 */

import { ai } from '@/ai/genkit';
import { MarketingCampaignInputSchema, MarketingCampaignOutputSchema, type MarketingCampaignInput, type MarketingCampaignOutput } from './schemas';

export async function generateMarketingCampaign(input: MarketingCampaignInput): Promise<MarketingCampaignOutput> {
  const prompt = ai.definePrompt({
    name: 'generateMarketingCampaignPrompt',
    input: { schema: MarketingCampaignInputSchema },
    output: { schema: MarketingCampaignOutputSchema },
    prompt: `Act as an expert marketing strategist. Based on the following information, generate a complete and creative marketing campaign strategy for the client. The output must be structured, professional, and ready to be presented.

    Client Information:
    - Client Name: {{customerName}}
    - Business Type: {{businessType}}
    - Main Goal: {{mainGoal}}
    - Target Audience: {{targetAudience}}
    - Key Products/Services: {{keyProducts}}
    - Desired Tone: {{tone}}

    Your task is to generate a campaign with a catchy title, a subtitle, a strategic summary, and a list of 3-5 concrete key actions with brief descriptions.
    `,
  });

  const generateMarketingCampaignFlow = ai.defineFlow(
      {
          name: 'generateMarketingCampaignFlow',
          inputSchema: MarketingCampaignInputSchema,
          outputSchema: MarketingCampaignOutputSchema,
      },
      async (flowInput) => {
          const { output } = await prompt(flowInput);
          return output!;
      }
  );

  return generateMarketingCampaignFlow(input);
}
