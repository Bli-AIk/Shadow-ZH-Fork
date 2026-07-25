"use client";

import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Box from 'components/Box';
import styles from '../app/[locale]/wiki/search/page.module.css';
import { searchQuery } from 'src/wikisearch.js';
import SearchResultsPaginate from 'components/SearchResultsPaginate';
import Searchbar from 'components/Searchbar';

export default function SearchPageContent() {
    const locale = useLocale();
    const searchParams = useSearchParams();
    const query = searchParams.get('query') || '';
    const both = searchParams.get('view') === 'both';
    const t = useTranslations('Search');

    return (<>
        <h1 className={styles.search}>{t('title')}</h1>

        <Box>
            {query ? <div className={styles.searchbox}>
                <Searchbar placeholder={t('inputPlaceholder')} defaultValue={query} submit={t('submit')} />
                <h2>{t('resultsFor', { query })}</h2>
                <SearchResultsPaginate itemsPerPage={10} items={searchQuery(query, { locale, both })} />
            </div> : <p>{t('empty')}</p>}
        </Box>
    </>);
}
