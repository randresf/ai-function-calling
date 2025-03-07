import { z } from 'zod';

export const FeedbackSchema = z.object({
  response: z.string().describe('the response that the user is providing feedback on'),
  comment: z.string().describe('users comment on the response'),
  feedback: z.string().describe('negative or positive')
});

export const FeedbackDefinition = {
  name: 'feedback',
  description: 'Provide feedback on an AI response',
  parameters: FeedbackSchema,
};

export type FeedbackArgs = z.infer<typeof FeedbackDefinition.parameters>;