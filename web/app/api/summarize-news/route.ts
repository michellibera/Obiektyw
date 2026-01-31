import { NextResponse } from 'next/server';
import { sendPrompt } from '@/lib/services/claude';

interface Article {
  title: string;
  content: string;
  url: string;
}

export async function POST(request: Request) {
  try {
    const { articles } = await request.json();

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Articles array is required' },
        { status: 400 }
      );
    }

    const articlesContent = articles
      .map((article: Article, index: number) => {
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
