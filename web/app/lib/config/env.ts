/**
 * Environment Configuration
 * Server-side only - validates and exports environment variables
 */

function getEnvVariable(key: string, required: boolean = true): string {
  const value = process.env[key];

  if (!value && required) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value || '';
}

export const env = {
  anthropic: {
    apiKey: getEnvVariable('ANTHROPIC_API_KEY'),
    apiUrl: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-5-sonnet-20241022',
    version: '2023-06-01',
  },
  brave: {
    apiKey: getEnvVariable('BRAVE_API_KEY'),
    webSearchUrl: 'https://api.search.brave.com/res/v1/web/search',
    newsSearchUrl: 'https://api.search.brave.com/res/v1/news/search',
  },
} as const;

// Type guard to ensure env is only used on server
export function ensureServerSide() {
  if (typeof window !== 'undefined') {
    throw new Error('This module can only be used on the server side');
  }
}
