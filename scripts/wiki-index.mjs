import path from 'node:path';
import fs from 'node:fs';
import { TYPES } from '../src/docparser.mjs';
import sanitizeHtml from 'sanitize-html';
import { remark } from 'remark';
import mdx from 'remark-mdx';
import strip from 'remark-mdx-to-plain-text';
import lunr from 'lunr';

const FILE_ROOT = path.resolve(process.cwd(), 'content');
const DATA_ROOT = path.resolve(process.cwd(), 'app/data');
const BOOST = Object.freeze({ ARTICLE: 3, API_TYPE: 2, API_FIELD: 1, TITLE: 4, DESCRIPTION: 2, CONTENT: 1 });

function readJson(filePath, fallback) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
        return fallback;
    }
}

function extractMetadata(body) {
    const get = (key) => {
        const match = body.match(new RegExp(`${key}:\\s*['"]((?:\\\\.|[^'"])*)['"]`));
        return match ? match[1].replaceAll("\\'", "'") : '';
    };
    return { title: get('title'), description: get('description') };
}

function plainText(body) {
    const source = body
        .replace(/export\s+const\s+metadata\s*=\s*{[\s\S]*?}\s*/g, '')
        .split('\n')
        .map((line) => {
            if (line.startsWith('#')) return line.replace(/(?<!# )\[[\w-]*\]/g, '');
            if (line.startsWith('import ') || line.startsWith('export ')) return '';
            return line;
        })
        .join('\n');

    return sanitizeHtml(String(remark().use(mdx).use(strip).processSync(source)), { allowedTags: [] });
}

function articleSource(locale, slug) {
    const file = path.join(FILE_ROOT, locale, 'wiki', `${slug}.mdx`);
    if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8');
    return fs.readFileSync(path.join(FILE_ROOT, 'en', 'wiki', `${slug}.mdx`), 'utf8');
}

function articleMetadata(locale, slug, source, messages) {
    const fallback = extractMetadata(source);
    return messages?.ArticleMetadata?.[slug] ?? fallback;
}

function apiTranslation(translations, kind, name, fallback) {
    return translations?.[kind]?.[name] || fallback;
}

function apiCorpus(locale, messages) {
    const translations = readJson(path.join(FILE_ROOT, locale, 'api.json'), {});
    const apiType = [];
    const apiField = [];

    for (const type of TYPES) {
        let text = '';
        if (type.fields) {
            for (const field of type.fields) {
                const key = `${type.name}.${field.name}`;
                const desc = field.desc ?? field.rawdesc ?? '';
                const translated = apiTranslation(translations, 'fields', key, desc);
                apiField.push({
                    id: JSON.stringify({ route: `/wiki/api/${type.name}#${field.name}`, title: `${type.name}.${field.name}`, description: `(API: ${field.type.replace('set', '').replace('doc.', '')}) ${translated}` }),
                    title: `${type.name}.${field.name}`,
                    description: `(API: ${field.type.replace('set', '').replace('doc.', '')}) ${translated}`,
                    content: `${type.name}.${field.name} ${translated}`,
                    boost: BOOST.API_FIELD,
                });
                text += ` | ${field.name} ${translated}`;
            }
        }

        const desc = type.desc ?? type.rawdesc ?? '';
        const translated = apiTranslation(translations, 'types', type.name, desc);
        apiType.push({
            id: JSON.stringify({ route: `/wiki/api/${type.name}`, title: type.name, description: `(API: ${type.type.replace('set', '')}) ${translated}` }),
            title: type.name,
            description: `(API: ${type.type.replace('set', '')}) ${translated}`,
            content: `${type.name} ${text}`,
            boost: BOOST.API_TYPE,
        });
    }

    return apiType.concat(apiField);
}

function buildIndex(locale, messages) {
    const sourceRoot = path.join(FILE_ROOT, 'en', 'wiki');
    const slugs = fs.readdirSync(sourceRoot)
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => file.slice(0, -4))
        .sort();

    const articles = slugs.map((slug) => {
        const source = articleSource(locale, slug);
        const metadata = articleMetadata(locale, slug, fs.readFileSync(path.join(sourceRoot, `${slug}.mdx`), 'utf8'), messages);
        return {
            id: JSON.stringify({ route: `/wiki/${slug}`, title: metadata.title || '[NO TITLE]', description: metadata.description || '[NO DESCRIPTION]' }),
            title: metadata.title || '[NO TITLE]',
            description: metadata.description || '[NO DESCRIPTION]',
            content: plainText(source),
            boost: BOOST.ARTICLE,
        };
    });

    const corpus = articles.concat(apiCorpus(locale, messages));
    const index = lunr(function () {
        this.ref('id');
        this.field('title', { boost: BOOST.TITLE });
        this.field('description', { boost: BOOST.DESCRIPTION });
        this.field('content', { boost: BOOST.CONTENT });
        corpus.forEach((doc) => this.add(doc, doc.boost));
    });

    fs.mkdirSync(DATA_ROOT, { recursive: true });
    fs.writeFileSync(path.join(DATA_ROOT, `wiki-index.${locale}.json`), JSON.stringify(index, null, 4));
    return corpus.length;
}

const enMessages = readJson(path.join(process.cwd(), 'messages/en.json'), {});
const zhMessages = readJson(path.join(process.cwd(), 'messages/zh.json'), {});
console.log('[wiki-index] Generating language-specific search indexes...');
console.log(`[wiki-index] en: ${buildIndex('en', enMessages)} documents`);
console.log(`[wiki-index] zh: ${buildIndex('zh', zhMessages)} documents`);
fs.copyFileSync(path.join(DATA_ROOT, 'wiki-index.en.json'), path.join(DATA_ROOT, 'wiki-index.json'));
console.log('[wiki-index] Done.');
