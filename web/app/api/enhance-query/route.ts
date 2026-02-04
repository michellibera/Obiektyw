import { NextResponse } from 'next/server';
import { sendPrompt } from '@/lib/services/llm';
import { EnhanceQuerySchema } from '@/lib/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = EnhanceQuerySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          details: validation.error.flatten()
        },
        { status: 400 }
      );
    }

    const { title, snippets } = validation.data;

    const snippetText = (snippets || []).join(' ');
    const prompt = `Na podstawie tego tytułu wiadomości i kluczowych informacji, wygeneruj zwięzłe zapytanie wyszukiwania (3-7 słów po polsku), które oddaje główny temat i pomoże znaleźć tematycznie powiązane artykuły.

Tytuł: ${title}
Kluczowe informacje: ${snippetText}

Zwróć TYLKO zapytanie wyszukiwania, nic więcej.`;

    const enhancedQuery = await sendPrompt(prompt, {
      max_tokens: 50,
      temperature: 0.3
    });

    return NextResponse.json({
      success: true,
      enhancedQuery: enhancedQuery.trim().replace(/^["']|["']$/g, '')
    });
  } catch (error) {
    console.error('Error enhancing query:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
