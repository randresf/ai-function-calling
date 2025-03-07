import { z } from 'zod';

export const ImageGenerateSchema = z.object({
  prompt: z.string(),
});

export const ImageGenerateDefinition = {
  name: 'generate_image',
  description: 'generates image using difusion model',
  parameters: ImageGenerateSchema,
};

export type GenerateImageArgs = z.infer<typeof ImageGenerateDefinition.parameters>;
