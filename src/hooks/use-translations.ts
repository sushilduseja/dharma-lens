import { useCallback, useState, useEffect } from 'react';
import type { Locale } from '@/i18n/config';

type Messages = Record<string, any>;

const getNestedValue = (obj: Messages, path: string[]): string => {
  const value = path.reduce((acc, key) => acc?.[key], obj);
  return typeof value === 'string' ? value : '';
};

export function useTranslations(locale: Locale, initialMessages?: Messages) {
  const [messages, setMessages] = useState<Messages | null>(initialMessages || null);
  const [loading, setLoading] = useState(!initialMessages);

  useEffect(() => {
    if (initialMessages) return;
    let isMounted = true;
    const loadMessages = async () => {
      setLoading(true);
      try {
        const messages = await import(`@/i18n/messages/${locale}.json`);
        if (isMounted) setMessages(messages.default);
      } catch (error) {
        console.error(`Failed to load messages for locale ${locale}:`, error);
        // Fallback to English
        const fallbackMessages = await import('@/i18n/messages/en.json');
        if (isMounted) setMessages(fallbackMessages.default);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadMessages();
    return () => { isMounted = false; };
  }, [locale, initialMessages]);

  const t = useCallback((key: string): string => {
    if (!messages) return '';
    const value = getNestedValue(messages, key.split('.'));
    return value || key;
  }, [messages]);

  return { t, loading };
}
