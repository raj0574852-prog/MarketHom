/**
 * Intelligent SEO Keyword Generator for Blog Articles
 * Automatically extracts high-intent, relevant SEO keywords from article title, category, excerpt, and content
 * when the admin does not specify custom keywords.
 */

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing',
  'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if',
  'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s',
  'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re',
  'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
  'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s',
  'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself',
  'yourselves', 'step', 'steps', 'guide', 'ultimate', 'complete', 'simple', 'easy', 'ways', 'tips',
  'top', 'best', 'new', 'post', 'blog', 'article', 'read', 'share', 'make', 'use', 'using', 'get',
  'getting', 'way', 'need', 'know', 'see', 'look', 'take', 'come', 'think', 'also', 'just', 'like',
  'even', 'well', 'much', 'many', 'good', 'great', 'first', 'last', 'next', 'year', 'day', 'time'
]);

function cleanText(text: string): string {
  return text
    .replace(/<[^>]+>/g, ' ') // Strip HTML
    .replace(/https?:\/\/\S+/g, ' ') // Strip URLs
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ') // Keep letters, numbers, spaces, hyphens
    .replace(/\s+/g, ' ')
    .trim();
}

function extractKeyPhrases(rawText: string, maxPhrases: number = 4): string[] {
  const cleaned = cleanText(rawText).toLowerCase();
  const words = cleaned.split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
  const phrases: string[] = [];

  // Extract meaningful 2-word phrases
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i];
    const w2 = words[i + 1];
    if (!STOP_WORDS.has(w1) && !STOP_WORDS.has(w2) && w1.length > 2 && w2.length > 2) {
      phrases.push(`${w1} ${w2}`);
    }
  }

  // Extract meaningful 3-word phrases
  for (let i = 0; i < words.length - 2; i++) {
    const w1 = words[i];
    const w2 = words[i + 1];
    const w3 = words[i + 2];
    if (!STOP_WORDS.has(w1) && !STOP_WORDS.has(w2) && !STOP_WORDS.has(w3)) {
      phrases.push(`${w1} ${w2} ${w3}`);
    }
  }

  // Count frequencies
  const freqMap = new Map<string, number>();
  for (const phrase of phrases) {
    freqMap.set(phrase, (freqMap.get(phrase) || 0) + 1);
  }

  return Array.from(freqMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxPhrases)
    .map(([phrase]) => phrase);
}

export function generateAutoKeywords(input: {
  title?: string;
  category?: string;
  excerpt?: string;
  content?: string;
}): string {
  const keywordsSet = new Set<string>();

  // 1. Add Category as primary anchor keyword
  if (input.category && input.category.trim()) {
    const cat = input.category.trim().toLowerCase();
    keywordsSet.add(cat);
    // If category has multiple words (e.g. "AI SEO" or "Content Marketing"), add sub-tags
    if (cat.includes(' ')) {
      const parts = cat.split(/\s+/).filter(p => !STOP_WORDS.has(p) && p.length > 2);
      if (parts.length > 1) {
        keywordsSet.add(parts.join(' '));
      }
    }
  }

  // 2. Extract Key Phrases from Title
  if (input.title && input.title.trim()) {
    const titleClean = cleanText(input.title).toLowerCase();
    const titleWords = titleClean.split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
    
    // Add 2-word title combos
    for (let i = 0; i < titleWords.length - 1; i++) {
      const phrase = `${titleWords[i]} ${titleWords[i + 1]}`;
      keywordsSet.add(phrase);
    }

    // Add strongest single words from title (up to 2)
    for (const word of titleWords.slice(0, 3)) {
      if (word.length >= 3 && !STOP_WORDS.has(word)) {
        keywordsSet.add(word);
      }
    }
  }

  // 3. Extract Headings (H2 / H3) from Content
  if (input.content) {
    const headingMatches = input.content.matchAll(/<h[23][^>]*>(.*?)<\/h[23]>/gi);
    for (const match of headingMatches) {
      if (keywordsSet.size >= 8) break;
      const headingText = match[1];
      const headingPhrases = extractKeyPhrases(headingText, 1);
      for (const phrase of headingPhrases) {
        keywordsSet.add(phrase);
      }
    }
  }

  // 4. Extract from Excerpt or Content if we still have few keywords
  if (keywordsSet.size < 5) {
    const sourceText = input.excerpt || input.content || '';
    const contentPhrases = extractKeyPhrases(sourceText, 3);
    for (const phrase of contentPhrases) {
      keywordsSet.add(phrase);
    }
  }

  // Fallback defaults if title or content was very short
  if (keywordsSet.size === 0) {
    return 'digital marketing, seo strategy, content growth, agency insights';
  }

  // Deduplicate and limit to top 6 - 8 clean keywords
  const resultList = Array.from(keywordsSet)
    .map(k => k.trim())
    .filter(k => k.length >= 3 && !k.match(/^\d+$/))
    .slice(0, 7);

  return resultList.join(', ');
}
