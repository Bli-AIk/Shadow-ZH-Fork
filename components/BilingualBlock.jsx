import { cloneElement, isValidElement } from 'react';
import styles from './BilingualBlock.module.css';

const CJK_RUN = /[\u2e80-\u2fff\u3000-\u303f\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\ufe30-\ufe4f]/;

function spaceChineseText(value, keyPrefix) {
    return value.split(/([\u2e80-\u2fff\u3000-\u303f\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\ufe30-\ufe4f]+)/g).map((segment, index) => {
        if (!segment) return null;
        return (
            <span key={`${keyPrefix}-${index}`} className={CJK_RUN.test(segment) ? styles.cjk : styles.latin}>
                {segment}
            </span>
        );
    });
}

function applyChineseSpacing(node, keyPrefix = 'zh-node') {
    if (typeof node === 'string') return spaceChineseText(node, keyPrefix);
    if (Array.isArray(node)) {
        return node.map((child, index) => {
            const childKey = `${keyPrefix}-${index}`;
            const transformed = applyChineseSpacing(child, childKey);
            if (isValidElement(transformed) && transformed.key == null) {
                return cloneElement(transformed, { key: childKey });
            }
            return transformed;
        });
    }
    if (!isValidElement(node)) return node;

    const elementName = typeof node.type === 'string' ? node.type : null;
    if (elementName === 'code' || elementName === 'pre' || node.props.children == null) return node;

    return cloneElement(node, { children: applyChineseSpacing(node.props.children, `${keyPrefix}-children`) });
}

export function BilingualBlock({ children, id }) {
    return <div className={styles.block} data-bilingual-block={id || undefined}>{children}</div>;
}

export function BilingualPart({ language, missing, children }) {
    return (
        <div className={styles.part} data-language={language}>
            {missing && <span className={styles.pending}>[{language === 'zh' ? '翻译待补充' : 'Translation pending'}]</span>}
            {language === 'zh' ? applyChineseSpacing(children) : children}
        </div>
    );
}
