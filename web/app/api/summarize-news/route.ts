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

    const prompt = `Na podstawie poniższych artykułów, wygeneruj:
1. Zwięzły tytuł newsa (max 100 znaków) - podsumowujący główny temat
2. Streszczenie w 3-5 zdaniach po polsku

Wytyczne:
- Tytuł powinien być chwytliwy, konkretny i obiektywny
- Streszczenie powinno przedstawić główny temat, kontekst i najważniejsze fakty
- Być obiektywne i zrównoważone, bez opinii ani ocen wartościujących

${articlesContent}

Zwróć odpowiedź w formacie JSON:
{
  "title": "tytuł newsa",
  "summary": "streszczenie w 3-5 zdaniach"
}

WAŻNE: Zwróć TYLKO poprawny JSON, bez żadnych dodatkowych słów, nagłówków ani formatowania markdown.`;

    const response = await sendPrompt(prompt, {
      max_tokens: 600,
      temperature: 0.5
    });

    // Parse JSON response
    let parsedResponse;
    try {
      // Remove potential markdown code blocks
      const cleanedResponse = response.trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      // Fallback: treat as plain text summary
      console.error('Failed to parse JSON response, using fallback:', parseError);
      parsedResponse = {
        title: articles[0]?.title || 'Wiadomość',
        summary: response.trim()
      };
    }

    return NextResponse.json({
      success: true,
      title: parsedResponse.title || '',
      summary: parsedResponse.summary || ''
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
