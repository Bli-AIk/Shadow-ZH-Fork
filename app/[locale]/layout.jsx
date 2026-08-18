import '../globals.css';
import styles from './layout.module.css';
import Navbar from 'components/Navbar';
import NextTopLoader from 'nextjs-toploader';
import NewTab from 'components/NewTab';
import SyncStatus from 'components/SyncStatus';
import DisplayModeProvider from 'components/DisplayModeProvider';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { routing } from 'src/i18n/routing';
import { sitePath } from 'src/site-path';

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
    metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
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
  const fontFaceCss = `
    @font-face { font-family: '8bitOperatorPlus-Bold'; src: url("${sitePath('/8bitOperatorPlus-Bold.woff')}") format("woff"); font-weight: normal; font-style: normal; }
    @font-face { font-family: '8bitOperatorPlus-Regular'; src: url("${sitePath('/8bitOperatorPlus-Regular.woff')}") format("woff"); font-weight: normal; font-style: normal; }
    @font-face { font-family: 'KristalZhMain'; src: url("${sitePath('/kristal-main-zh.ttf')}") format("truetype"); font-weight: normal; font-style: normal; }
    @font-face { font-family: 'KristalZhFallback'; src: url("${sitePath('/kristal-zh-main-fallback.ttf')}") format("truetype"); font-weight: normal; font-style: normal; }
  `;
  const bodyStyle = {
    background: `no-repeat center / auto 100% url("${sitePath('/background.apng')}"), linear-gradient(to bottom, black 94.2%, #00328e 94.2%)`,
    backgroundAttachment: 'fixed',
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <style>{fontFaceCss}</style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css" />
      </head>
      <body style={bodyStyle}>
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
                <SyncStatus />
              </footer>
            </DisplayModeProvider>
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
