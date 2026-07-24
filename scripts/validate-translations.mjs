import fs from 'node:fs';
import path from 'node:path';
import { remark } from 'remark';
import mdx from 'remark-mdx';

const root = process.cwd();
const sourceRoot = path.join(root, 'content/en/wiki');
const translationRoot = path.join(root, 'content/zh/wiki');

function parse(filePath) {
    return remark().use(mdx).parse(fs.readFileSync(filePath, 'utf8'));
}

function walk(node, callback) {
    callback(node);
    for (const child of node.children || []) walk(child, callback);
}

function signature(tree) {
    const result = {
        headings: [],
        components: [],
        code: [],
        links: [],
        media: [],
        anchors: [],
    };

    walk(tree, (node) => {
        if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
            result.components.push(node.name);
        }
        if (node.type === 'code') result.code.push(node.lang || '');
        if (node.type === 'link' && !node.url.startsWith('#')) result.links.push(node.url);
        if (node.type === 'image') result.media.push(`image:${node.url}`);
        if (node.type === 'html' && /<(?:img|video)\b/i.test(node.value)) {
            result.media.push(node.value.replace(/\s+/g, ' ').trim());
        }
        if (node.type === 'heading') {
            result.headings.push(`h${node.depth}`);
            const text = node.children?.map((child) => child.value || '').join('') || '';
            const anchor = text.match(/\[([a-z0-9][a-z0-9-]*)\]\s*$/i);
            if (anchor) result.anchors.push(anchor[1]);
        }
    });

    return result;
}

function differences(source, translation) {
    const fields = ['headings', 'components', 'code', 'links', 'media'];
    const changed = fields.filter((field) => JSON.stringify(source[field]) !== JSON.stringify(translation[field]));
    const sourceAnchors = source.anchors;
    const translationAnchors = translation.anchors;
    let translationIndex = 0;
    for (const anchor of sourceAnchors) {
        translationIndex = translationAnchors.indexOf(anchor, translationIndex);
        if (translationIndex < 0) {
            changed.push('anchors');
            break;
        }
        translationIndex += 1;
    }
    return changed;
}

const files = fs.readdirSync(sourceRoot).filter((file) => file.endsWith('.mdx')).sort();
const failures = [];
for (const file of files) {
    const sourcePath = path.join(sourceRoot, file);
    const translationPath = path.join(translationRoot, file);
    if (!fs.existsSync(translationPath)) {
        failures.push(`${file}: missing translation`);
        continue;
    }

    try {
        const changed = differences(signature(parse(sourcePath)), signature(parse(translationPath)));
        if (changed.length > 0) failures.push(`${file}: ${changed.join(', ')}`);
    } catch (error) {
        failures.push(`${file}: ${error.message}`);
    }
}

if (failures.length > 0) {
    console.error('[validate-translations] Failed:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exitCode = 1;
} else {
    console.log(`[validate-translations] ${files.length} Chinese wiki files passed.`);
}
