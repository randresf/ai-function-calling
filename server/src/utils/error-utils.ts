// Error handling utility functions

/**
 * Handles errors consistently across the application
 * @param error - The error to handle
 * @param msg - Optional custom error message
 * @throws Error with formatted message
 */
export const handleError = (error: any, msg: string = 'An unknown error occurred') => {
  if (error instanceof Error) {
    throw new Error(`${msg}: ${error.message}`);
  } else {
    throw new Error(`Error: ${msg}`);
  }
};