/**
 * Claude API Service
 * Server-side only wrapper for Anthropic Claude API
 */

import { env, ensureServerSide } from '../config/env';
import type { ClaudeMessage, ClaudeRequest, ClaudeResponse } from '../types/claude';

ensureServerSide();

/**
 * Send a message to Claude API
 * @param messages - Array of messages to send
 * @param options - Optional configuration (model, max_tokens, temperature)
 * @returns Claude API response
 */
export async function sendMessage(
  messages: ClaudeMessage[],
  options?: {
    model?: string;
    max_tokens?: number;
    temperature?: number;
  }
): Promise<ClaudeResponse> {
  const request: ClaudeRequest = {
    model: options?.model || env.anthropic.model,
    max_tokens: options?.max_tokens || 1024,
    messages,
    ...(options?.temperature !== undefined && { temperature: options.temperature }),
  };

  const response = await fetch(env.anthropic.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.anthropic.apiKey,
      'anthropic-version': env.anthropic.version,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Send a simple text prompt to Claude
 * @param prompt - Text prompt to send
 * @param options - Optional configuration
 * @returns Text response from Claude
 */
export async function sendPrompt(
  prompt: string,
  options?: {
    model?: string;
    max_tokens?: number;
    temperature?: number;
  }
): Promise<string> {
  const messages: ClaudeMessage[] = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await sendMessage(messages, options);
  return response.content[0].text;
}

/**
 * Generate an enhanced search query using Claude
 * @param title - News article title
 * @param snippets - Additional context snippets
 * @returns Enhanced search query
 */
export async function generateEnhancedQuery(
  title: string,
  snippets: string[]
): Promise<string> {
  const snippetText = snippets.join(' ');

  const prompt = `Na podstawie tego tytułu wiadomości i kluczowych informacji, wygeneruj zwięzłe zapytanie wyszukiwania (3-7 słów po polsku), które oddaje główny temat.

Tytuł: ${title}
Kluczowe informacje: ${snippetText}

Zwróć TYLKO zapytanie wyszukiwania.`;

  const response = await sendPrompt(prompt, {
    max_tokens: 50,
    temperature: 0.3
  });

  return response.trim().replace(/^["']|["']$/g, '');
}
