'use server';

/**
 * @fileOverview An AI agent that suggests summaries of client interactions.
 *
 * - suggestInteractionSummary - A function that suggests summaries of client interactions.
 * - SuggestInteractionSummaryInput - The input type for the suggestInteractionSummary function.
 * - SuggestInteractionSummaryOutput - The return type for the suggestInteractionSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInteractionSummaryInputSchema = z.object({
  interactionText: z
    .string()
    .describe('The text of the client interaction to summarize.'),
});
export type SuggestInteractionSummaryInput = z.infer<
  typeof SuggestInteractionSummaryInputSchema
>;

const SuggestInteractionSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A suggested summary of the client interaction.'),
});
export type SuggestInteractionSummaryOutput = z.infer<
  typeof SuggestInteractionSummaryOutputSchema
>;

export async function suggestInteractionSummary(
  input: SuggestInteractionSummaryInput
): Promise<SuggestInteractionSummaryOutput> {
  return suggestInteractionSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestInteractionSummaryPrompt',
  input: {schema: SuggestInteractionSummaryInputSchema},
  output: {schema: SuggestInteractionSummaryOutputSchema},
  prompt: `You are an expert assistant that can summarize client interactions.  Please provide a short, concise summary of the following interaction:  {{interactionText}}`,
});

const suggestInteractionSummaryFlow = ai.defineFlow(
  {
    name: 'suggestInteractionSummaryFlow',
    inputSchema: SuggestInteractionSummaryInputSchema,
    outputSchema: SuggestInteractionSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
