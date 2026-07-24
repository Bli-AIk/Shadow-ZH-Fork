import Box from 'components/Box'
import styles from './page.module.css'
import { searchQuery } from 'src/wikisearch.js'
import SearchResultsPaginate from 'components/SearchResultsPaginate'
import Searchbar from 'components/Searchbar'
import { getTranslations } from 'next-intl/server'

export default async function Page({params, searchParams}) {
    const { locale } = await params;
    const { query, view } = await searchParams;
    const both = view === 'both';
    const t = await getTranslations('Search');

    return (<>
        <h1 className={styles.search}>{t('title')}</h1>

        <Box>
        {
            query ? <div className={styles.searchbox}>
                <Searchbar placeholder={t('inputPlaceholder')} defaultValue={query} submit={t('submit')} />
                <h2>{t('resultsFor', { query })}</h2>
                <SearchResultsPaginate itemsPerPage={10} items={searchQuery(query, { locale, both })}/>
            </div> : <>
                <p>
                    {t('empty')}
                </p>
            </>
        }
        </Box>
    </>)
}
