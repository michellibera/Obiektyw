import { NextResponse } from 'next/server';
import { sendPrompt } from '@/lib/services/llm';
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

    const { articles, searchPhrase } = validation.data;
    const currentDate = new Date().toISOString();

    const articlesJson = JSON.stringify(
      articles.map((article, index) => ({
        id: `article_${index + 1}`,
        title: article.title,
        source: new URL(article.url).hostname.replace('www.', ''),
        url: article.url,
        date: currentDate,
        content: article.content
      })),
      null,
      2
    );

    const prompt = `Jesteś ekspertem analizy mediów i komunikacji politycznej w kontekście polskiego krajobrazu medialnego.

DANE WEJŚCIOWE:
Fraza: "${searchPhrase || 'nieustawiona'}"
Data: ${currentDate}
Artykuły: ${articlesJson}

ZADANIE:

CZĘŚĆ 1 - GLOBALNE PODSUMOWANIE wszystkich artykułów:
- title: zwięzły tytuł max 100 znaków podsumowujący główny temat
- summary: obiektywne streszczenie 3-5 zdań z głównym tematem, kontekstem i faktami

CZĘŚĆ 2 - SZCZEGÓŁOWA ANALIZA każdego artykułu:

1. Ocena powiązania z frazą:
pełny - artykuł całkowicie o temacie
częściowy - artykuł porusza temat ale zawiera inne wątki
brak - nie związany (pomiń w analizie, dodaj do excluded_articles)

2. Streszczenie artykułu:
main_events - krótkie hasła oddzielone przecinkami opisujące wydarzenia
key_participants - krótkie hasła oddzielone przecinkami z osobami/instytucjami
conclusions - wnioski w 2-3 zdaniach

3. Orientacja polityczna:
Kategorie: skrajna_lewica, lewica, centrolewica, centrum, centroprawica, prawica, skrajna_prawica, neutralny
Dla rzetelnych bez stronniczości: neutralny i neutrality_bonus: true

4. Wskaźnik kreowania narracji 0-100:
bias (waga 0.4) - faworyzowanie strony
sensationalism (waga 0.3) - język wyolbrzymiający/emocjonalny
fact_deviation (waga 0.3) - proporcja opinii do faktów
Skala: 0-15 rzetelne, 16-35 lekkie nachylenie, 36-55 kreowanie narracji, 56-75 manipulacja, 76-100 propaganda

5. Techniki manipulacji - tylko wyraźne z cytatem:
NARRACYJNE: T01-Framing, T02-Cherry-picking, T03-Omission, T04-Sensacjonalizm, T05-Loaded language, T06-False balance, T07-Whataboutism
ATAK: T08-Ad hominem, T09-Straw man, T10-Guilt by association, T11-Labeling
EMOCJONALNE: T12-Apel do strachu, T13-Apel do oburzenia, T14-Apel do współczucia, T15-Apel do dumy/wstydu
LOGICZNE: L01-False dichotomy, L02-Slippery slope, L03-Post hoc, L04-Hasty generalization, L05-Circular reasoning, L06-Appeal to authority, L07-Bandwagon, L08-Non sequitur

6. Statystyki agregowane

FORMAT JSON:
{
  "title": "string",
  "summary": "string",
  "analysis": {
    "search_phrase": "string",
    "analysis_date": "string",
    "total_articles": number,
    "analyzed_articles": number,
    "excluded_articles": [{"id": "string", "title": "string", "reason": "string"}],
    "articles": [{
      "id": "string",
      "title": "string",
      "source": "string",
      "url": "string",
      "date": "string",
      "relevance": {"score": "pełny|częściowy|brak", "note": "string"},
      "summary": {"main_events": "string hasła oddzielone przecinkami", "key_participants": "string hasła oddzielone przecinkami", "conclusions": "string 2-3 zdania"},
      "political_orientation": {"category": "string", "confidence": number, "justification": "string", "neutrality_bonus": boolean},
      "narrative_creation_index": {
        "total_score": number,
        "components": {
          "bias": {"score": number, "weight": 0.4, "note": "string"},
          "sensationalism": {"score": number, "weight": 0.3, "note": "string"},
          "fact_deviation": {"score": number, "weight": 0.3, "note": "string"}
        },
        "interpretation": "string"
      },
      "manipulation_analysis": {
        "techniques_found": number,
        "techniques": [{"id": "string", "name": "string", "category": "narracyjna|atak|emocjonalna|błąd_logiczny", "quote": "string", "explanation": "string", "severity": "niska|średnia|wysoka"}],
        "overall_assessment": "string"
      },
      "metadata": {"word_count": number, "analysis_notes": "string"}
    }],
    "aggregate_statistics": {
      "avg_narrative_index": number,
      "political_distribution": {"skrajna_lewica": number, "lewica": number, "centrolewica": number, "centrum": number, "centroprawica": number, "prawica": number, "skrajna_prawica": number, "neutralny": number},
      "most_common_techniques": [{"id": "string", "name": "string", "count": number}],
      "sources_reliability_ranking": [{"source": "string", "avg_narrative_index": number, "neutrality_score": number}]
    }
  }
}

Zwróć TYLKO poprawny JSON bez dodatkowych słów ani formatowania markdown.`;

    const response = await sendPrompt(prompt, {
      max_tokens: 16000,
      temperature: 0.3
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
        summary: response.trim(),
        analysis: null
      };
    }

    return NextResponse.json({
      success: true,
      title: parsedResponse.title || '',
      summary: parsedResponse.summary || '',
      analysis: parsedResponse.analysis || null
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
