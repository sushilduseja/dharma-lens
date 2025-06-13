import { ReactNode } from 'react';
import { getLocale } from '@/i18n/config';
import { headers } from 'next/headers';

// Validate params at build time
export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'hi' }, { lang: 'bho' }, { lang: 'pa' }];
}

// Generate metadata with proper error handling
export async function generateMetadata({ params }: { params: { lang: string } }) {
  // Await params to ensure it's properly resolved
  const resolvedParams = await Promise.resolve(params);
  const locale = getLocale(resolvedParams.lang);

  try {
    const messages = await import(`@/i18n/messages/${locale}.json`);
    return {
      title: {
        default: messages.default.site?.title || 'Divya Drishti',
        template: `%s | ${messages.default.site?.title || 'Divya Drishti'}`,
      },
      description:
        messages.default.site?.description ||
        'Personalized spiritual insight and guidance from Divine Vision.',
      alternates: {
        canonical: '/',
        languages: {
          en: '/en',
          hi: '/hi',
          bho: '/bho',
          pa: '/pa',
        },
      },
    };
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}`, error);
    return {
      title: 'Divya Drishti',
      description: 'Personalized spiritual insight and guidance from Divine Vision.',
    };
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  // Await params here as well for consistency
  const resolvedParams = await Promise.resolve(params);
  const locale = getLocale(resolvedParams.lang);

  return <>{children}</>;
}
