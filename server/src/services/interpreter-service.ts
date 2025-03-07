import type { ToolInput } from '../tools/tool.types';
import { handleError } from '../utils/error-utils';
import { OpenAIService } from './openai-service';

export async function interpretMessage({ toolArgs }: ToolInput) {
  const unFormattedMessage = toolArgs.result;
  try {
    const openai = OpenAIService.getInstance();
    const result = await openai.createChatCompletion([
      {
        role: 'user',
        content: `i used the tool ${toolArgs.toolName} with the following result: ${toolArgs.result}. Please format the message`
      }
    ],
      undefined,
      'you are a helpful interpreter of tools responses. You should format the message using markdown syntax. do not use greetings or farewells'
    );
    console.log(result?.choices[0].message);
    return result?.choices[0].message.content ?? unFormattedMessage;
    ;
  } catch (error) {
    handleError(error, 'Message interpretation failed');
    return unFormattedMessage;
  }
}