import type { ChatCompletionMessageToolCall } from 'openai/resources';
import { exportToPdf } from '../services/pdf-service';
import { searchImage } from '../services/image-service';
import { interpretMessage } from '../services/interpreter-service';
import { PdfExportDefinition } from './export-pdf';
import { ImageGenerateDefinition } from './generate-image';
import { InterpreterDefinition } from './interpreter';

// Main function to orchestrate all tools
export async function toolRunner(toolCall: ChatCompletionMessageToolCall, message: string) {
  const toolName = toolCall.function.name;
  const input = {
    message,
    toolArgs: JSON.parse(toolCall.function.arguments ?? '{}')
  }
  switch (toolName) {
    case PdfExportDefinition.name:
      return exportToPdf(input);

    case ImageGenerateDefinition.name:
      return searchImage(input);
    case InterpreterDefinition.name:
      return interpretMessage(input);

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}