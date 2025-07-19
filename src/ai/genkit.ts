/**
 * @fileoverview This file initializes the Genkit AI framework and configures the Gemini model.
 * It exports a single `ai` object that is used throughout the application to interact with the AI models.
 */
'use server';

import { genkit, AIService, Tool, defineSchema } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Initialize Genkit with the Google AI plugin.
// This allows the application to use Google's AI models like Gemini.
export const ai = genkit({
  plugins: [
    googleAI({
      // The API key is automatically sourced from the GOOGLE_API_KEY or GOOGLE_GENAI_API_KEY environment variables.
    }),
  ],
  // Log level for debugging. Can be 'debug', 'info', 'warn', or 'error'.
  logLevel: 'debug',
  // Disables telemetry to prevent sending usage data.
  enableTelemetry: false,
});
