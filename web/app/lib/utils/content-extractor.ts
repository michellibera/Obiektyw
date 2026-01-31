import * as cheerio from 'cheerio';

export interface ExtractedContent {
  title: string;
  content: string;
  textContent: string;
  length: number;
}

/**
 * Extract main content from HTML using Cheerio
 */
export async function extractContent(html: string, url: string): Promise<ExtractedContent | null> {
  try {
    const $ = cheerio.load(html);

    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('header').remove();
    $('footer').remove();
    $('aside').remove();
    $('.advertisement').remove();
    $('.ads').remove();
    $('.social-share').remove();
    $('.comments').remove();
    $('[class*="cookie"]').remove();
    $('[class*="newsletter"]').remove();
    $('[class*="popup"]').remove();
    $('[id*="cookie"]').remove();

    const title = $('title').text() ||
                  $('h1').first().text() ||
                  $('meta[property="og:title"]').attr('content') ||
                  '';

    let content = '';

    const articleSelectors = [
      'article',
      '[role="main"]',
      'main',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.content',
      '#content'
    ];

    for (const selector of articleSelectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        content = element.text();
        if (content.length > 200) {
          break;
        }
      }
    }

    if (!content || content.length < 100) {
      content = $('body').text();
    }

    const textContent = content
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();

    if (!textContent || textContent.length < 100) {
      return null;
    }

    return {
      title: title.trim(),
      content: textContent,
      textContent,
      length: textContent.length
    };
  } catch (error) {
    console.error('Content extraction error:', error);
    return null;
  }
}

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 chars)
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
