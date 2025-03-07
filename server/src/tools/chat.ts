import { z } from 'zod';

export const ChatSchema = z.object({
  message: z.string().describe('The user message to respond to')
});

export const ChatDefinition = {
  name: 'chat',
  description: 'Generate a chat response to user input',
  parameters: ChatSchema,
};

export type ChatArgs = z.infer<typeof ChatDefinition.parameters>;