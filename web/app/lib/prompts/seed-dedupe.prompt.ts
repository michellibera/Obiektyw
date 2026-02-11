export interface SeedDedupeCandidate {
  id: string;
  title: string;
  snippet: string;
  source: string;
  url: string;
}

export interface SeedDedupePromptInput {
  candidates: SeedDedupeCandidate[];
}

export function buildSeedDedupePrompt(input: SeedDedupePromptInput): string {
  const candidatesJson = JSON.stringify(input.candidates, null, 2);

  return `Jesteś asystentem do deduplikacji tematycznej newsów.

DANE WEJŚCIOWE (JSON):
${candidatesJson}

ZADANIE:
Wybierz po JEDNYM artykule na temat/historię (unikalne wydarzenie/ogłoszenie/sprawa).
Usuń duplikaty tematyczne: jeśli dwa (lub więcej) wpisy opisują tę samą historię, zostaw tylko jeden.

ZASADY:
- Jeśli nie masz pewności, że to ten sam temat, ZOSTAW oba.
- Ten sam temat może pojawić się w różnych źródłach.
- Wybierając reprezentanta, preferuj: bardziej konkretny tytuł, bardziej informacyjny snippet, mniej clickbaitowy opis.

FORMAT ODPOWIEDZI (zwróć TYLKO poprawny JSON):
{
  "keep": ["seed_1", "seed_5"]
}

W polu keep zwróć listę ID artykułów, które mają zostać (bez duplikatów), najlepiej w kolejności od najbardziej reprezentatywnego do najmniej.`;
}
