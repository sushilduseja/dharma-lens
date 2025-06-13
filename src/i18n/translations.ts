import type { Locale } from './config';

const categories: Record<string, Record<Locale, string>> = {
  'self-perception': {
    en: 'Self-Perception & Worthiness',
    hi: 'आत्म-धारणा और योग्यता',
    pa: 'ਸਵੈ-ਧਾਰਨਾ ਅਤੇ ਯੋਗਤਾ',
    bho: 'आत्म-धारणा आ योग्यता'
  },
  'emotional-challenges': {
    en: 'Emotional Challenges',
    hi: 'भावनात्मक चुनौतियां',
    pa: 'ਭਾਵਨਾਤਮਕ ਚੁਣੌਤੀਆਂ',
    bho: 'भावनात्मक चुनौतियां'
  },
  'relationships-connection': {
    en: 'Relationships & Connection',
    hi: 'रिश्ते और संबंध',
    pa: 'ਰਿਸ਼ਤੇ ਅਤੇ ਜੁੜਾਵ',
    bho: 'रिश्ता आ जुड़ाव'
  },
  'life-path-purpose': {
    en: 'Life Path & Purpose',
    hi: 'जीवन मार्ग और उद्देश्य',
    pa: 'ਜੀਵਨ ਮਾਰਗ ਅਤੇ ਉਦੇਸ਼',
    bho: 'जीवन पथ आ उद्देश्य'
  },
  'attachment-letting-go': {
    en: 'Attachment & Letting Go',
    hi: 'आसक्ति और छोड़ना',
    pa: 'ਮੋਹ ਅਤੇ ਛੱਡਣਾ',
    bho: 'मोह आ छोड़े के'
  }
};

export function getCategoryTranslation(categoryId: string, locale: Locale): string {
  return categories[categoryId]?.[locale] || categories[categoryId]?.en || categoryId;
}
