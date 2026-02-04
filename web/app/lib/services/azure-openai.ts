/**
 * Azure OpenAI (Foundry) Service
 * Server-side only wrapper using OpenAI SDK
 */

import OpenAI from 'openai';
import { env, ensureServerSide } from '../config/env';
import type { LlmPromptOptions } from '../types/llm';

ensureServerSide();

function normalizeEndpoint(endpoint: string): string {
  return endpoint.replace(/\/+$/, '');
}

function getClient(): OpenAI {
  const baseURL = `${normalizeEndpoint(env.azure.endpoint)}/models`;

  return new OpenAI({
    apiKey: env.azure.apiKey,
    baseURL,
    defaultQuery: {
      'api-version': env.azure.apiVersion,
    },
    defaultHeaders: {
      'api-key': env.azure.apiKey,
    },
  });
}

/**
 * Send a simple text prompt to Azure OpenAI
 */
export async function sendPrompt(
  prompt: string,
  options?: LlmPromptOptions
): Promise<string> {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: options?.model || env.azure.deployment,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: options?.max_tokens ?? 1024,
    ...(options?.temperature !== undefined && { temperature: options.temperature }),
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Azure OpenAI returned an empty response');
  }

  return content;
}
