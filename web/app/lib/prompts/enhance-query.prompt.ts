export interface EnhanceQueryPromptInput {
  title: string;
  snippets?: string[];
}

export function buildEnhanceQueryPrompt(input: EnhanceQueryPromptInput): string {
  const { title, snippets } = input;
  const snippetText = (snippets || []).join(' ');

  return `Na podstawie tego tytułu wiadomości i kluczowych informacji, wygeneruj zwięzłe zapytanie wyszukiwania (3-7 słów po polsku), które oddaje główny temat i pomoże znaleźć tematycznie powiązane artykuły.

Tytuł: ${title}
Kluczowe informacje: ${snippetText}

Zwróć TYLKO zapytanie wyszukiwania, nic więcej.`;
}
