import { z } from 'zod';

export const PdfExportSchema = z.object({
  text: z.string().describe('The text to export to a PDF file'),
  filename: z.string().optional()
});

export const PdfExportDefinition = {
  name: 'export_pdf',
  description: 'Export content to a PDF file',
  parameters: PdfExportSchema,
};

export type PdfExportArgs = z.infer<typeof PdfExportDefinition.parameters>;