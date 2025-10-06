'use server';
/**
 * @fileOverview An AI agent that processes receipt images.
 *
 * - processReceipt - A function that handles the receipt processing.
 * - ProcessReceiptInput - The input type for the processReceipt function.
 * - ProcessReceiptOutput - The return type for the processReceipt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessReceiptInputSchema = z.object({
  receiptImage: z
    .string()
    .describe(
      "An image of a receipt or invoice, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ProcessReceiptInput = z.infer<typeof ProcessReceiptInputSchema>;

const ProcessReceiptOutputSchema = z.object({
    description: z.string().describe('A brief, suitable description of the item or service purchased, likely the vendor or main product name.'),
    subtotal: z.number().describe('The subtotal amount before taxes.'),
    tax: z.number().describe('The tax amount (e.g., IVA, VAT).'),
    total: z.number().describe('The final total amount of the transaction.'),
    category: z.enum(['Software', 'Marketing', 'Hardware', 'Oficina', 'Consultoría', 'Transporte', 'Comida', 'Otros']).describe('The most likely category for this expense.'),
    date: z.string().describe('The date of the transaction in YYYY-MM-DD format.'),
});
export type ProcessReceiptOutput = z.infer<typeof ProcessReceiptOutputSchema>;

export async function processReceipt(input: ProcessReceiptInput): Promise<ProcessReceiptOutput> {
  return processReceiptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processReceiptPrompt',
  input: {schema: ProcessReceiptInputSchema},
  output: {schema: ProcessReceiptOutputSchema},
  prompt: `You are an expert accountant AI. Analyze the following receipt image and extract the key information. The currency is EUR.

Your tasks:
1. Identify the vendor or the primary product/service to create a short, clear description for the expense.
2. Extract the subtotal (amount before tax), the tax amount (VAT/IVA), and the total amount. If only the total and one other value is present, calculate the missing one. If only the total is available, assume it includes a 21% VAT and calculate the subtotal and tax.
3. Determine the most appropriate expense category from the allowed options.
4. Find the transaction date and format it as YYYY-MM-DD.

Receipt Image: {{media url=receiptImage}}`,
});

const processReceiptFlow = ai.defineFlow(
  {
    name: 'processReceiptFlow',
    inputSchema: ProcessReceiptInputSchema,
    outputSchema: ProcessReceiptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
