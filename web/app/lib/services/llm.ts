/**
 * LLM Provider Router
 * Server-side only
 */

import { env, ensureServerSide } from '../config/env';
import * as claude from './claude';
import * as azureOpenAi from './azure-openai';
import type { LlmPromptOptions, LlmProvider } from '../types/llm';
import type { BraveSearchResult } from '../types/brave';
import { buildSeedDedupePrompt } from '../prompts';
import { SeedDedupeResponseSchema } from '../schemas/seedDedupe';

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

function cleanJsonLikeResponse(text: string): string {
  return text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

export async function dedupeSeedNewsResults(
  results: BraveSearchResult[]
): Promise<BraveSearchResult[]> {
  if (results.length <= 1) return results;

  const candidates = results.map((r, index) => {
    const snippet = (r.extra_snippets?.join(' ') || r.description || '').trim();

    let source = r.profile?.name || '';
    if (!source) {
      try {
        source = new URL(r.url).hostname.replace('www.', '');
      } catch {
        source = '';
      }
    }

    return {
      id: `seed_${index + 1}`,
      title: (r.title || '').trim(),
      snippet,
      source,
      url: r.url,
    };
  });

  const prompt = buildSeedDedupePrompt({ candidates });

  try {
    const response = await sendPrompt(prompt, {
      max_tokens: 800,
      temperature: 0,
    });

    const cleaned = cleanJsonLikeResponse(response);
    const parsed = SeedDedupeResponseSchema.safeParse(JSON.parse(cleaned));
    if (!parsed.success) return results;

    const keepIdsOrdered: string[] = [];
    const keepSet = new Set<string>();

    for (const id of parsed.data.keep) {
      if (typeof id !== 'string') continue;
      if (keepSet.has(id)) continue;
      keepSet.add(id);
      keepIdsOrdered.push(id);
    }

    const byId = new Map<string, BraveSearchResult>();
    results.forEach((r, i) => byId.set(`seed_${i + 1}`, r));

    const kept = keepIdsOrdered
      .map(id => byId.get(id))
      .filter((x): x is BraveSearchResult => Boolean(x));

    return kept.length > 0 ? kept : results;
  } catch {
    return results;
  }
}
