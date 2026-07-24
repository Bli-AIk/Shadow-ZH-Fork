import fs from 'node:fs';
import path from 'node:path';
import { remark } from 'remark';
import mdx from 'remark-mdx';

function attribute(name, value) {
    return {
        type: 'mdxJsxAttribute',
        name,
        value: String(value),
    };
}

function part(language, node, key, missing = false) {
    return {
        type: 'mdxJsxFlowElement',
        name: 'BilingualPart',
        attributes: [attribute('key', key), attribute('language', language), ...(missing ? [attribute('missing', 'true')] : [])],
        children: node ? [node] : [],
    };
}

function block(index, english, chinese, missing = false) {
    return {
        type: 'mdxJsxFlowElement',
        name: 'BilingualBlock',
        attributes: [attribute('key', `bilingual-block-${index + 1}`), attribute('id', `block-${index + 1}`)],
        children: [
            part('en', english, `bilingual-block-${index + 1}-en`),
            part('zh', chinese || english, `bilingual-block-${index + 1}-zh`, missing || !chinese),
        ],
    };
}

const MERGEABLE_TYPES = new Set([
    'blockquote',
    'list',
    'listItem',
    'table',
    'tableRow',
    'tableCell',
]);

function addKey(node, key) {
    const attributes = node.attributes || [];
    if (attributes.some((item) => item.name === 'key')) return node;
    return { ...node, attributes: [...attributes, attribute('key', key)] };
}

function stripPositions(value) {
    if (Array.isArray(value)) return value.map(stripPositions);
    if (!value || typeof value !== 'object') return value;

    return Object.fromEntries(
        Object.entries(value)
            .filter(([key]) => key !== 'position')
            .map(([key, item]) => [key, stripPositions(item)])
    );
}

function isSameNode(english, chinese) {
    return JSON.stringify(stripPositions(english)) === JSON.stringify(stripPositions(chinese));
}

function canMerge(english, chinese) {
    if (!english || !chinese || english.type !== chinese.type) return false;
    if (!Array.isArray(english.children) || !Array.isArray(chinese.children)) return false;

    if (english.type === 'mdxJsxFlowElement') {
        return english.name === chinese.name;
    }

    return MERGEABLE_TYPES.has(english.type);
}

function translationPath(filePath) {
    const relative = path.relative(path.resolve(process.cwd(), 'content/en/wiki'), filePath);
    return path.resolve(process.cwd(), 'content/zh/wiki', relative);
}

export default function remarkBilingual() {
    return function transform(tree, file) {
        if (!file.path || !file.path.includes(`${path.sep}content${path.sep}en${path.sep}wiki${path.sep}`)) {
            return;
        }

        const zhPath = translationPath(file.path);
        let chineseTree = null;
        if (fs.existsSync(zhPath)) {
            chineseTree = remark().use(mdx).parse(fs.readFileSync(zhPath, 'utf8'));
        }

        const chineseNodes = chineseTree?.children.filter((node) => node.type !== 'mdxjsEsm') || [];
        let chineseIndex = 0;
        let blockIndex = 0;

        function mergeChildren(englishChildren, chineseChildren, parentKey) {
            const length = Math.max(englishChildren.length, chineseChildren.length);
            const result = [];

            for (let index = 0; index < length; index += 1) {
                result.push(mergeNode(
                    englishChildren[index],
                    chineseChildren[index],
                    `${parentKey}-${index}`
                ));
            }

            return result;
        }

        function mergeNode(english, chinese, key) {
            if (!english || !chinese) {
                const output = block(blockIndex++, english, chinese, !chinese);
                return output;
            }

            if (canMerge(english, chinese)) {
                return addKey({
                    ...english,
                    children: mergeChildren(english.children, chinese.children, `${key}-children`),
                }, key);
            }

            if (isSameNode(english, chinese)) return addKey(english, key);
            return block(blockIndex++, english, chinese, false);
        }

        tree.children = tree.children.flatMap((node) => {
            if (node.type === 'mdxjsEsm') return [node];
            const chinese = chineseNodes[chineseIndex++];
            return [mergeNode(node, chinese, `bilingual-node-${chineseIndex - 1}`)];
        });

        for (; chineseIndex < chineseNodes.length; chineseIndex += 1) {
            tree.children.push(mergeNode(null, chineseNodes[chineseIndex], `bilingual-node-${chineseIndex}`));
        }
    };
}
