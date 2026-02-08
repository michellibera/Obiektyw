import { createHash } from 'crypto';

export function normalizeUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    const params = url.searchParams;
    const keysToDelete: string[] = [];
    params.forEach((_value, key) => {
      if (key.toLowerCase().startsWith('utm_')) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => params.delete(key));
    url.search = params.toString();
    url.hash = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return rawUrl.trim();
  }
}

export function hashArticle(input: {
  canonicalUrl: string;
  title: string;
  snippet?: string | null;
}): string {
  const base = `${input.canonicalUrl}::${input.title}::${input.snippet ?? ''}`;
  return createHash('sha256').update(base).digest('hex');
}
