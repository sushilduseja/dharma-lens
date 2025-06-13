import React from 'react';
import { getLocale } from '@/i18n/config';
import DharmalensClient from './DharmalensClient';

export default async function DharmalensPage({
  params,
}: {
  params: { lang: string }
}) {
  const lang = getLocale(params.lang);
  let messages = {};
  try {
    messages = (await import(`@/i18n/messages/${lang}.json`)).default;
  } catch {
    messages = (await import('@/i18n/messages/en.json')).default;
  }
  return <DharmalensClient lang={lang} messages={messages} />;
}
