/**
 * LLM Provider Router
 * Server-side only
 */

import { env, ensureServerSide } from '../config/env';
import * as claude from './claude';
import * as azureOpenAi from './azure-openai';
import type { LlmPromptOptions, LlmProvider } from '../types/llm';

ensureServerSide();

function getProvider(): LlmProvider {
  return env.llm.provider;
}

export async function sendPrompt(
  prompt: string,
  options?: LlmPromptOptions
): Promise<string> {
  const provider = getProvider();

  switch (provider) {
    case 'azure':
      return azureOpenAi.sendPrompt(prompt, options);
    case 'anthropic':
      return claude.sendPrompt(prompt, options);
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}

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
    temperature: 0.3,
  });

  return response.trim().replace(/^["']|["']$/g, '');
}
