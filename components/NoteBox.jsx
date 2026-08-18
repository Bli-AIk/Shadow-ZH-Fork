"use client";

import styles from './NoteBox.module.css';

const HEADERS = {
    warning: ['⚠️ Warning', '⚠️ 警告'],
    important: ['❗ Important', '❗ 重要'],
    tip: ['💡 Tip', '💡 提示'],
    note: ['ⓘ Note', 'ⓘ 注意'],
};

export default function NoteBox({ children, type = 'note', ...props }) {
    const [englishHeader, chineseHeader] = HEADERS[type] || HEADERS.note;

    return (
        <aside role="note" className={`${styles.noteBox} ${styles[type] || styles.note}`} {...props}>
            <div className={styles.content}>
                <span className={styles.header}>
                    <span data-language="en">{englishHeader}</span>
                    <span data-language="zh">{chineseHeader}</span>
                </span>
                {children}
            </div>
        </aside>
    );
}
