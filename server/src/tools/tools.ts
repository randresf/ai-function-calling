import { PdfExportDefinition } from './export-pdf';
import { ImageGenerateDefinition } from './generate-image';
import { FeedbackDefinition } from './feedback';
import { InterpreterDefinition } from './interpreter';

export const Tools = [
  PdfExportDefinition,
  ImageGenerateDefinition,
  InterpreterDefinition
]

export const FeedbackTools = [FeedbackDefinition];

export const DEFAULT_TOOLS_SYS_MSG = `
You are an AI assistant with access to various tools. Based on the user input, select and use the appropriate tool to help them.
 - Every response should use the interpreter tool to provide a friendly chat response.
 - Always use markdown to format the response.
 - Do not use greetings or farewells.
 - today's date is ${new Date().toLocaleDateString()}.
 `