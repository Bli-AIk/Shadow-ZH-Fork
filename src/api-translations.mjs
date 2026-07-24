import fs from 'node:fs';
import path from 'node:path';

let chineseTranslations = null;

function loadChineseTranslations() {
    if (chineseTranslations) return chineseTranslations;
    const filePath = path.resolve(process.cwd(), 'content/zh/api.json');
    try {
        chineseTranslations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
        chineseTranslations = { types: {}, fields: {}, arguments: {}, returns: {}, variables: {} };
    }
    return chineseTranslations;
}

export function getApiText(locale, kind, key, fallback) {
    if (locale !== 'zh') return { text: fallback ?? '', missing: false };
    const value = loadChineseTranslations()[kind]?.[key];
    return { text: value || fallback || '', missing: !value && Boolean(fallback) };
}

export function getApiDescription(locale, typeName, fallback) {
    return getApiText(locale, 'types', typeName, fallback);
}

export function hasApiTranslation(kind, key) {
    return Boolean(loadChineseTranslations()[kind]?.[key]);
}
