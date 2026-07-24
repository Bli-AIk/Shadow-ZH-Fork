import lunr from 'lunr';
import enData from '@/app/data/wiki-index.en.json';
import zhData from '@/app/data/wiki-index.zh.json';

const STRING_MAX_SIZE = 80;
const indexes = {
    en: lunr.Index.load(enData),
    zh: lunr.Index.load(zhData),
};

function trimResult(raw) {
    const result = JSON.parse(raw.ref);
    result.title = result.title.length > STRING_MAX_SIZE - 3 ? `${result.title.substring(0, STRING_MAX_SIZE - 3)}...` : result.title;
    result.description = result.description.length > STRING_MAX_SIZE - 3 ? `${result.description.substring(0, STRING_MAX_SIZE - 3)}...` : result.description;
    return result;
}

export function searchQuery(query, { locale = 'en', both = false } = {}) {
    if (typeof query !== 'string' || query.length === 0) return [];

    const locales = both ? ['en', 'zh'] : [locale === 'zh' ? 'zh' : 'en'];
    const seenRoutes = new Set();
    return locales.flatMap((currentLocale) => indexes[currentLocale].search(query)
        .map(trimResult)
        .filter((result) => {
            if (seenRoutes.has(result.route)) return false;
            seenRoutes.add(result.route);
            return true;
        }));
}
