import { handleError } from '../utils/error-utils';
import { OpenAIService } from './openai-service';
import { toolRunner } from '../tools/toolRunner';
import type { ToolInput } from '../tools/tool.types';
import { DEFAULT_TOOLS_SYS_MSG } from '../tools/tools';
import type { ChatCompletionMessageParam } from 'openai/src/resources/index.js';

// Main function to handle chat completion with feedback and refinement
export async function handleChatCompletion({ message }: ToolInput) {
  try {
    const openai = OpenAIService.getInstance();
    const completion = await openai.createChatCompletion([
      { role: 'system', content: 'You are a helpful AI assistant.' },
      { role: 'user', content: message }
    ], {
      temperature: 0.7,
    });

    const responseId = Date.now().toString();
    const response = completion!.choices[0].message.content;

    return { responseId, response };
  } catch (error) {
    handleError(error, 'Failed to generate chat response');
  }
}

// Process user input with AI and execute appropriate tools
export async function processWithAI(messages: ChatCompletionMessageParam[], userMessage: string) {
  try {
    const openai = OpenAIService.getInstance();
    const completion = await openai.createChatCompletion(
      messages
      , undefined, DEFAULT_TOOLS_SYS_MSG);

    const message = completion!.choices[0].message;
    const toolCall = message.tool_calls?.[0];
    if (toolCall) {
      const toolName = toolCall.function.name;
      const toolParams = JSON.parse(toolCall.function.arguments);
      console.log('toolName', toolName)
      console.log('toolParams', toolParams)

      // Execute the selected tool
      const result = await toolRunner(toolCall, userMessage);
      console.log('tool result', result);
      return {
        toolUsed: toolName,
        result
      };
    }

    // If no tool was called, return the direct response
    return {
      toolUsed: 'none',
      result: message.content,
    };
  } catch (error) {
    handleError(error, 'Failed to process user input with AI');
  }
}