import styles from './layout.module.css'
import Sidebar from 'components/Sidebar';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: t('wikiTitle'),
    description: t('wikiDescription'),
  };
}

export default function RootLayout({children}) {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
          {children}
      </main>
    </div>
  )
}
