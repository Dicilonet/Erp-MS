
'use server';

/**
 * @fileOverview An AI agent that generates images from text prompts.
 * - generateSocialMediaImage - A function to generate an image for social media.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';


// This flow is simplified to a direct function call to avoid Next.js build issues
// with top-level flow definitions in "use server" files.
export async function generateSocialMediaImage(prompt: string): Promise<string> {
    if (!prompt) {
        throw new Error('Prompt is required for image generation.');
    }
    
    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: prompt,
    });
    
    if (!media || !media.url) {
        throw new Error('Image generation failed to return an image.');
    }

    return media.url;
}
