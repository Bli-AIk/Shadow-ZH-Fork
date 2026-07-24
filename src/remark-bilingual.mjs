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

function part(language, node, missing = false) {
    return {
        type: 'mdxJsxFlowElement',
        name: 'BilingualPart',
        attributes: [attribute('language', language), ...(missing ? [attribute('missing', 'true')] : [])],
        children: node ? [node] : [],
    };
}

function block(index, english, chinese, missing = false) {
    return {
        type: 'mdxJsxFlowElement',
        name: 'BilingualBlock',
        attributes: [attribute('id', `block-${index + 1}`)],
        children: [
            part('en', english),
            part('zh', chinese || english, missing || !chinese),
        ],
    };
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

        const englishNodes = tree.children.filter((node) => node.type !== 'mdxjsEsm');
        const chineseNodes = chineseTree?.children.filter((node) => node.type !== 'mdxjsEsm') || [];
        let chineseIndex = 0;
        let blockIndex = 0;

        tree.children = tree.children.flatMap((node) => {
            if (node.type === 'mdxjsEsm') return [node];
            const chinese = chineseNodes[chineseIndex++];
            const output = block(blockIndex++, node, chinese, !chinese);
            return [output];
        });

        for (; chineseIndex < chineseNodes.length; chineseIndex += 1) {
            tree.children.push(block(blockIndex++, null, chineseNodes[chineseIndex], false));
        }
    };
}
