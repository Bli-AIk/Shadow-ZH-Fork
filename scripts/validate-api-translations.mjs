import fs from 'node:fs';
import path from 'node:path';
import { TYPES } from '../src/docparser.mjs';

const translationPath = path.resolve(process.cwd(), 'content/zh/api.json');
const translations = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
const missing = [];

for (const type of TYPES) {
    const typeDescription = type.desc ?? type.rawdesc ?? '';
    if (typeDescription && !translations.types?.[type.name]) missing.push(`types.${type.name}`);
    for (const field of type.fields || []) {
        const description = field.desc ?? field.rawdesc ?? '';
        const key = `${type.name}.${field.name}`;
        if (description && !translations.fields?.[key]) missing.push(`fields.${key}`);
    }
}

if (missing.length > 0) {
    console.error(`[validate-api-translations] Missing ${missing.length} translations.`);
    missing.slice(0, 40).forEach((key) => console.error(`- ${key}`));
    if (missing.length > 40) console.error(`- ... and ${missing.length - 40} more`);
    process.exitCode = 1;
} else {
    console.log('[validate-api-translations] All API descriptions are translated.');
}
