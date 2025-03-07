
import { handleError } from '../utils/error-utils';
import { OpenAIService } from './openai-service';
import type { ToolInput } from '../tools/tool.types';

export async function searchImage({ toolArgs }: ToolInput) {
  try {
    const openai = OpenAIService.getInstance();
    const response = await openai.generateImage(toolArgs.prompt);
    if (!response) {
      throw new Error();
    }
    return response[0].url;
  } catch (error) {
    handleError(error, 'Image generation failed');
  }
}