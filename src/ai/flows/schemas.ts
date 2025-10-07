
import { z } from 'zod';

// Esquema para la generación de campañas de marketing
export const MarketingCampaignInputSchema = z.object({
  customerName: z.string(),
  businessType: z.string(),
  mainGoal: z.string(),
  targetAudience: z.string(),
  keyProducts: z.string(),
  tone: z.enum(['Profesional', 'Divertido', 'Urgente', 'Inspirador', 'Exclusivo']),
});
export type MarketingCampaignInput = z.infer<typeof MarketingCampaignInputSchema>;

export const MarketingCampaignOutputSchema = z.object({
  campaignTitle: z.string(),
  campaignSubtitle: z.string(),
  summary: z.string(),
  keyActions: z.array(z.object({
    action: z.string(),
    description: z.string(),
  })),
});
export type MarketingCampaignOutput = z.infer<typeof MarketingCampaignOutputSchema>;


// Esquema para el resumen de interacciones
export const InteractionSummaryInputSchema = z.object({
    interactionText: z.string(),
});
export type InteractionSummaryInput = z.infer<typeof InteractionSummaryInputSchema>;

export const InteractionSummaryOutputSchema = z.object({
    summary: z.string(),
});
export type InteractionSummaryOutput = z.infer<typeof InteractionSummaryOutputSchema>;

// Esquema para el procesamiento de facturas
export const ReceiptInputSchema = z.object({
  receiptImage: z.string(), // Se espera un Data URI
});
export type ReceiptInput = z.infer<typeof ReceiptInputSchema>;

export const ReceiptOutputSchema = z.object({
  description: z.string(),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  date: z.string(),
  category: z.string(),
});
export type ReceiptOutput = z.infer<typeof ReceiptOutputSchema>;
