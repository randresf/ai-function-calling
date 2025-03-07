import { z } from 'zod';

export const InterpreterSchema = z.object({
  toolName: z.string().describe('The tool that was used'),
  result: z.string().describe('The result of the previous tool'),
});

export const InterpreterDefinition = {
  name: 'interpreter',
  description: 'Generate a friendly chat response from a LLM interaction with a tool, do not include the tool name in the response. Format correctly for markdown.',
  parameters: InterpreterSchema,
};

export type InterpreterArgs = z.infer<typeof InterpreterDefinition.parameters>;