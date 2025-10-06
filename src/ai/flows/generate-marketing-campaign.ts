'use server';
/**
 * @fileOverview An AI agent that generates a marketing campaign strategy.
 * - generateMarketingCampaign - A function to generate a campaign from user goals.
 * - MarketingCampaignInput - The input type for the campaign generation.
 * - MarketingCampaignOutput - The return type for the campaign generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const MarketingCampaignInputSchema = z.object({
  customerName: z.string().describe('The name of the client for whom the campaign is being created.'),
  businessType: z.string().describe('The type of business or sector of the client (e.g., Hotel, Restaurant, SaaS).'),
  mainGoal: z.string().describe('The primary objective of the campaign (e.g., increase bookings, attract new clients, sell a specific product).'),
  targetAudience: z.string().describe('A description of the target audience.'),
  keyProducts: z.string().describe('The key products or services to highlight in the campaign.'),
  tone: z.enum(['Profesional', 'Divertido', 'Urgente', 'Inspirador', 'Exclusivo']).describe('The desired tone for the campaign communication.'),
});
export type MarketingCampaignInput = z.infer<typeof MarketingCampaignInputSchema>;

export const MarketingCampaignOutputSchema = z.object({
  campaignTitle: z.string().describe("A catchy and creative title for the marketing campaign."),
  campaignSubtitle: z.string().describe("A brief, compelling subtitle that complements the main title."),
  summary: z.string().describe("A short paragraph summarizing the campaign's core strategy and objectives."),
  keyActions: z.array(z.object({
    action: z.string().describe("A specific, actionable marketing step."),
    description: z.string().describe("A brief explanation of why this action is important and what it entails."),
  })).describe("A list of 3 to 5 key marketing actions to execute the campaign."),
});
export type MarketingCampaignOutput = z.infer<typeof MarketingCampaignOutputSchema>;

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
        async (input) => {
            const { output } = await prompt(input);
            return output!;
        }
    );

    return generateMarketingCampaignFlow(input);
}