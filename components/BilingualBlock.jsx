import styles from './BilingualBlock.module.css';

export function BilingualBlock({ children, id }) {
    return <div className={styles.block} data-bilingual-block={id || undefined}>{children}</div>;
}

export function BilingualPart({ language, missing, children }) {
    return (
        <div className={styles.part} data-language={language}>
            {missing && <span className={styles.pending}>[{language === 'zh' ? '翻译待补充' : 'Translation pending'}]</span>}
            {children}
        </div>
    );
}
