import { handleError } from '../utils/error-utils';
import { OpenAIService } from './openai-service';
import type { ToolInput } from '../tools/tool.types';
import { dbService } from './db-service';

// Feedback storage
const feedbackStore = new Map<string, { score: number; feedback?: string; originalResponse?: string }>();

// Function to provide feedback
export async function provideFeedback({ toolArgs }: ToolInput, originalResponse: string) {
  await dbService.saveScore({
    originalResponse,
    feedback: toolArgs.feedback,
    results: { id: toolArgs.responseId, score: toolArgs.score, response: originalResponse, recomendedPrompt: '' }
  });

  return true;
}

// Function to validate refined prompt quality
async function validateRefinedPrompt(originalPrompt: string, refinedPrompt: string): Promise<number> {
  try {
    const openai = OpenAIService.getInstance();
    const validation = await openai.createChatCompletion([
      {
        role: 'system',
        content: 'Compare the quality of two prompts and provide a score between 0 and 1 for the improvement, where 1 means significant improvement and 0 means no improvement or worse. Respond in JSON format with a single "score" field.'
      },
      {
        role: 'user',
        content: `Original prompt: ${originalPrompt}\nRefined prompt: ${refinedPrompt}`
      }
    ], {
      response_format: { type: 'json_object' },
      temperature: 0.3
    });

    const result = JSON.parse(validation?.choices[0].message.content || '{ "score": 0 }');
    return result.score;
  } catch (error) {
    console.error('Validation failed:', error);
    return 0;
  }
}

// Function to validate and refine prompts based on feedback
export async function validateAndRefinePrompt(toolArgs: any, originalResponse: string) {
  const feedback = feedbackStore.get(toolArgs.responseId);
  if (!feedback) {
    throw new Error('No feedback found for the given response ID');
  }

  // Only refine if score is low (below 0.5)
  if (feedback.score >= 0.5) {
    return {
      originalFeedback: feedback,
      refinementNeeded: false,
      message: 'Score is satisfactory, no refinement needed'
    };
  }

  try {
    const openai = OpenAIService.getInstance();
    // Use feedback to refine the response
    const refinementPrompt = await openai.createChatCompletion([
      {
        role: 'system',
        content: 'You are an AI assistant focused on improving responses based on user feedback. Analyze the feedback and original response, then provide an improved version.'
      },
      {
        role: 'user',
        content: `Original response: ${feedback.originalResponse}\nFeedback score: ${feedback.score}\nFeedback comment: ${feedback.feedback || 'No comment'}\nPlease provide an improved response.`
      }
    ], {
      temperature: 0.7
    });

    const refinedResponse = refinementPrompt?.choices[0].message.content || '';

    // Validate the quality of the refined response
    const qualityScore = await validateRefinedPrompt(feedback.originalResponse || '', refinedResponse);

    return {
      originalFeedback: feedback,
      refinementNeeded: true,
      refinedResponse,
      qualityScore,
      message: `Response refined with quality score: ${qualityScore}`
    };
  } catch (error) {
    handleError(error, 'Failed to refine prompt')
  }
}