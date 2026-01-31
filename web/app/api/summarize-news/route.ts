import { NextResponse } from 'next/server';
import { sendPrompt } from '@/lib/services/claude';
import { SummarizeNewsSchema, type SummarizeNewsInput } from '@/lib/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = SummarizeNewsSchema.safeParse(body);

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

    const { articles } = validation.data;

    const articlesContent = articles
      .map((article, index: number) => {
        const prefix = index === 0 ? 'Główny artykuł' : `Powiązany artykuł ${index}`;
        return `${prefix}: "${article.title}"\n\nTreść:\n${article.content}`;
      })
      .join('\n\n---\n\n');

    const prompt = `Na podstawie poniższych artykułów, napisz zwięzłe streszczenie tematu w 3-5 zdaniach po polsku. Streszczenie powinno:
- Przedstawić główny temat i kontekst
- Zawierać najważniejsze fakty z różnych źródeł
- Być obiektywne i zrównoważone
- Nie zawierać opinii ani ocen wartościujących

${articlesContent}

Zwróć TYLKO streszczenie (3-5 zdań), bez nagłówków ani dodatkowych informacji.`;

    const summary = await sendPrompt(prompt, {
      max_tokens: 500,
      temperature: 0.5
    });

    return NextResponse.json({
      success: true,
      summary: summary.trim()
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
