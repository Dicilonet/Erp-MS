
'use server';

/**
 * @fileOverview An AI agent that generates images from text prompts.
 * - generateSocialMediaImage - A function to generate an image for social media.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate the image from.'),
});

// The output will be a string, which is the data URI of the generated image.
const GenerateImageOutputSchema = z.string();


export async function generateSocialMediaImage(prompt: string): Promise<string> {
    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: prompt,
    });
    
    if (!media || !media.url) {
        throw new Error('Image generation failed to return an image.');
    }

    return media.url;
}

const generateSocialMediaImageFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async ({ prompt }) => {
    return await generateSocialMediaImage(prompt);
  }
);
