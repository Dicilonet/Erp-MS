'use server';

import {
  generateMarketingCampaign as generateMarketingCampaignFlow,
} from '@/ai/flows/generate-marketing-campaign';
import {
  generateSocialMediaImage as generateSocialMediaImageFlow,
} from '@/ai/flows/generate-social-media-image';
import {
  processReceipt as processReceiptFlow,
} from '@/ai/flows/process-receipt';
import type {
  MarketingCampaignInput,
  MarketingCampaignOutput,
} from '@/ai/flows/schemas';
import {
  suggestInteractionSummary as suggestInteractionSummaryFlow,
} from '@/ai/flows/suggest-interaction-summary';
import type {
  ProcessReceiptInput,
  ProcessReceiptOutput,
  SuggestInteractionSummaryInput,
  SuggestInteractionSummaryOutput,
} from '@/ai/flows/types';

/**
 * Executes the `suggestInteractionSummary` flow.
 */
export async function suggestInteractionSummary(
  input: SuggestInteractionSummaryInput
): Promise<SuggestInteractionSummaryOutput> {
  return await suggestInteractionSummaryFlow(input);
}

/**
 * Executes the `processReceipt` flow.
 */
export async function processReceipt(
  input: ProcessReceiptInput
): Promise<ProcessReceiptOutput> {
  return await processReceiptFlow(input);
}

/**
 * Executes the `generateSocialMediaImage` flow.
 */
export async function generateSocialMediaImage(
  prompt: string
): Promise<string> {
  return await generateSocialMediaImageFlow(prompt);
}

/**
 * Executes the `generateMarketingCampaign` flow.
 */
export async function generateMarketingCampaign(
  input: MarketingCampaignInput
): Promise<MarketingCampaignOutput> {
  return await generateMarketingCampaignFlow(input);
}
