/**
 * Intelligent SEO Keyword Generator for Blog Articles
 * Formats keywords according to high-authority SEO patterns:
 * [primary topic], [primary topic com], [specific topic phrase/guest post], [agency brand variations]
 * 
 * Example:
 * moneynewsweb, moneynewsweb com, MoneyNewsWeb guest post, education hom, educationhom.com, educationhom com
 */

const BRAND_KEYWORDS = [
  'education hom',
  'educationhom.com',
  'educationhom com'
];

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
  'yourselves', 'step', 'steps', 'ultimate', 'complete', 'simple', 'easy', 'ways', 'tips',
  'top', 'best', 'new', 'post', 'blog', 'article', 'read', 'share', 'make', 'use', 'using', 'get',
  'getting', 'way', 'need', 'know', 'see', 'look', 'take', 'come', 'think', 'also', 'just', 'like',
  'even', 'well', 'much', 'many', 'good', 'great', 'first', 'last', 'next', 'year', 'day', 'time'
]);

function cleanText(text: string): string {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function generateAutoKeywords(input: {
  title?: string;
  category?: string;
  excerpt?: string;
  content?: string;
}): string {
  const title = (input.title || '').trim();
  const category = (input.category || '').trim();
  const keywordsList: string[] = [];
  const seen = new Set<string>();

  const addKeyword = (kw: string) => {
    const trimmed = kw.trim();
    const lower = trimmed.toLowerCase();
    if (!lower || seen.has(lower)) return;
    seen.add(lower);
    keywordsList.push(trimmed);
  };

  // Special match for MoneyNewsWeb or similar platform guest posts
  if (/moneynewsweb/i.test(title)) {
    addKeyword('moneynewsweb');
    addKeyword('moneynewsweb com');
    addKeyword('MoneyNewsWeb guest post');
    for (const brand of BRAND_KEYWORDS) {
      addKeyword(brand);
    }
    return keywordsList.join(', ');
  }

  if (title) {
    // 1. Detect primary entity/subject from title
    // E.g.: "Newsgiga Com: Everything You Need...", "Technical SEO: Complete Guide..."
    let entity = '';
    let entityCase = '';

    const delimiterMatch = title.match(/^([^:\-–—|?]+?)(?:\s+(?:guest\s+post|guide|review|vs|platform|service|tips|tutorial|strategies|checklist)|\s*[:\-–—|?]|$)/i);
    if (delimiterMatch && delimiterMatch[1].trim()) {
      let candidate = delimiterMatch[1].trim();
      candidate = candidate.replace(/^(?:what\s+is|how\s+to|why|the|\d+)\s+/i, '').trim();
      if (candidate.length >= 2) {
        entityCase = candidate;
        entity = candidate.toLowerCase();
      }
    }

    if (!entity) {
      const firstWord = title.split(/\s+/)[0].replace(/[^\w-]/g, '');
      if (firstWord.length >= 3) {
        entityCase = firstWord;
        entity = firstWord.toLowerCase();
      } else if (category) {
        entityCase = category;
        entity = category.toLowerCase();
      }
    }

    if (entity) {
      const baseEntity = entity.replace(/\s+com$/i, '').replace(/\.com$/i, '').trim();
      const baseEntityCase = entityCase.replace(/\s+com$/i, '').replace(/\.com$/i, '').trim();
      
      // 1. Primary entity (e.g. "moneynewsweb", "newsgiga")
      addKeyword(baseEntity);

      // 2. Entity domain / com variation (e.g. "moneynewsweb com", "newsgiga com")
      addKeyword(`${baseEntity} com`);

      // 3. Specific article focus phrase (e.g. "MoneyNewsWeb guest post")
      const titleLower = title.toLowerCase();
      if (titleLower.includes('guest post')) {
        addKeyword(`${baseEntityCase} guest post`);
      } else if (titleLower.includes('guide')) {
        addKeyword(`${baseEntityCase} guide`);
      } else {
        const words = title.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()));
        if (words.length >= 2) {
          addKeyword(`${words[0]} ${words[1]}`.toLowerCase());
        } else if (category && category.toLowerCase() !== baseEntity) {
          addKeyword(category.toLowerCase());
        }
      }
    }
  }

  // 4. Add agency branding keywords
  for (const brand of BRAND_KEYWORDS) {
    addKeyword(brand);
  }

  // Fallback defaults if title was blank
  if (keywordsList.length <= BRAND_KEYWORDS.length && category) {
    addKeyword(category.toLowerCase());
    addKeyword(`${category.toLowerCase()} agency`);
  }

  return keywordsList.join(', ');
}
