import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
import { zodFunction } from 'openai/helpers/zod';
import { handleError } from '../utils/error-utils';
import type { ChatCompletionCreateParams, ImageGenerateParams } from 'openai/resources';
import { Tools } from '../tools/tools';
import type { ChatCompletionMessageParam } from 'openai/src/resources/index.js';

// Load environment variables
dotenv.config();

export class OpenAIService {
  private static instance: OpenAIService;
  private client: OpenAI;

  private constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public async createChatCompletion(messages: ChatCompletionMessageParam[], options?: Partial<ChatCompletionCreateParams>, systemMsg?: string) {
    const tools = Tools as any[]
    try {
      return await this.client.chat.completions.create({
        model: options?.model || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemMsg || 'you are a helpful assistant'
          },
          ...messages
        ],
        temperature: options?.temperature || 0.7,
        tool_choice: 'auto',
        parallel_tool_calls: false,
        tools: tools.map((tool) => zodFunction(tool)),
      });
    } catch (error) {
      handleError(error, 'Chat completion failed');
    }
  }

  public async generateImage(prompt: string, options?: ImageGenerateParams) {
    try {
      const response = await this.client.images.generate({
        model: options?.model || 'dall-e-3',
        prompt,
        n: options?.n || 1,
        size: options?.size || '1024x1024',
        response_format: 'url'
      });

      return response.data;
    } catch (error) {
      handleError(error, 'Image generation failed');
    }
  }
}