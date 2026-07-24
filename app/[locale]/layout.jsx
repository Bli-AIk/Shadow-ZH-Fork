import '../globals.css';
import styles from './layout.module.css';
import Navbar from 'components/Navbar';
import NextTopLoader from 'nextjs-toploader';
import NewTab from 'components/NewTab';
import DisplayModeProvider from 'components/DisplayModeProvider';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { routing } from 'src/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: t('title'),
    description: t('description'),
    metadataBase: process.env.BASE_URL ? new URL(process.env.BASE_URL) : undefined,
    openGraph: {
      url: '/',
      images: [{
        url: '/square_logo.png',
        width: 512,
        height: 512,
        alt: 'Kristal Logo',
      }],
    },
    twitter: { card: 'summary' },
  };
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations('Common');

  return (
    <html lang={locale}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Suspense fallback={null}>
            <DisplayModeProvider locale={locale}>
              <NextTopLoader color="#00FFFF" />
              <Navbar />
              <main className={styles.main}>{children}</main>
              <footer className={styles.footer}>
                <NewTab href="https://deltarune.com/">{t('footerDeltarune')}</NewTab> by Toby Fox.<br />
                {t('footerDesignedBy')} <NewTab href="https://nyako.dev/">NyakoFox</NewTab>.<br />
                {t('footerCopyright')}
              </footer>
            </DisplayModeProvider>
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
