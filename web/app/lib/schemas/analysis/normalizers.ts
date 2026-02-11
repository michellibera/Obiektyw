// Funkcje normalizacji dla schematów Zod

export function splitCommaList(value: string): string[] {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

export function normalizeEnumInput(value: unknown): string | unknown {
  if (typeof value !== 'string') return value;
  return value.trim();
}

function removeDiacritics(str: string): string {
  return str
    .replace(/ą/g, 'a')
    .replace(/ć/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ł/g, 'l')
    .replace(/ń/g, 'n')
    .replace(/ó/g, 'o')
    .replace(/ś/g, 's')
    .replace(/ż/g, 'z')
    .replace(/ź/g, 'z');
}

export function normalizeTechniqueCategory(value: unknown): unknown {
  const input = normalizeEnumInput(value);
  if (typeof input !== 'string') return input;

  const normalized = removeDiacritics(input.toLowerCase())
    .replace(/\s+/g, '_')
    .replace(/-/g, '_');

  if (normalized === 'blad_logiczny' || normalized === 'bladlogiczny') {
    return 'błąd_logiczny';
  }
  if (normalized === 'narracyjna') return 'narracyjna';
  if (normalized === 'atak') return 'atak';
  if (normalized === 'emocjonalna') return 'emocjonalna';

  return input;
}

export function normalizeSeverity(value: unknown): unknown {
  const input = normalizeEnumInput(value);
  if (typeof input !== 'string') return input;

  const normalized = removeDiacritics(input.toLowerCase());

  if (normalized === 'srednia') return 'średnia';
  if (normalized === 'niska') return 'niska';
  if (normalized === 'wysoka') return 'wysoka';

  return input;
}

export function normalizeRelevanceScore(value: unknown): unknown {
  const input = normalizeEnumInput(value);
  if (typeof input !== 'string') return input;

  const normalized = removeDiacritics(input.toLowerCase());

  if (normalized === 'pelny') return 'pełny';
  if (normalized === 'czesciowy') return 'częściowy';
  if (normalized === 'brak') return 'brak';

  return input;
}

export function normalizePoliticalCategory(value: unknown): unknown {
  const input = normalizeEnumInput(value);
  if (typeof input !== 'string') return input;

  const normalized = removeDiacritics(input.toLowerCase())
    .replace(/\s+/g, '_')
    .replace(/-/g, '_');

  const allowed = new Set([
    'skrajna_lewica',
    'lewica',
    'centrolewica',
    'centrum',
    'centroprawica',
    'prawica',
    'skrajna_prawica',
    'neutralny',
  ]);

  if (allowed.has(normalized)) return normalized;
  return input;
}

export function normalizeNumericString(value: unknown): unknown {
  if (typeof value === 'string') {
    const parsed = Number(value.replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : value;
  }
  return value;
}

export function normalizeConfidence(value: unknown): unknown {
  if (typeof value === 'string') {
    const parsed = Number(value.replace(',', '.'));
    if (Number.isFinite(parsed)) {
      return parsed <= 1 && parsed >= 0 ? parsed * 100 : parsed;
    }
    return value;
  }
  if (typeof value === 'number') {
    return value <= 1 && value >= 0 ? value * 100 : value;
  }
  return value;
}
