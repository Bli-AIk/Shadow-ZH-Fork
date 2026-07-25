"use client";

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'src/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useDisplayMode } from './DisplayModeProvider';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
    const t = useTranslations('Common');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { mode, setMode } = useDisplayMode();
    const [open, setOpen] = useState(false);
    const controlRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;

        const closeOnOutsideClick = (event) => {
            if (!controlRef.current?.contains(event.target)) setOpen(false);
        };
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
                controlRef.current?.querySelector('button')?.focus();
            }
        };

        document.addEventListener('pointerdown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('pointerdown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [open]);

    const onChange = (nextMode) => {
        setMode(nextMode);
        setOpen(false);

        if (nextMode === 'both') {
            const params = new URLSearchParams(searchParams.toString());
            params.set('view', 'both');
            router.replace(`${pathname}?${params.toString()}`);
        } else {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('view');
            const query = params.toString();
            router.replace(`${pathname}${query ? `?${query}` : ''}`, { locale: nextMode });
        }
    };

    return (
        <div ref={controlRef} className={styles.control}>
            <button
                type="button"
                className={styles.trigger}
                aria-label={t('language')}
                aria-haspopup="menu"
                aria-expanded={open}
                title={t('language')}
                onClick={() => setOpen((current) => !current)}
            >
                <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M4.3 7.5h15.4M4.3 16.5h15.4" />
                    <path d="M12 3c2.4 2.5 3.7 5.5 3.7 9S14.4 18.5 12 21M12 3c-2.4 2.5-3.7 5.5-3.7 9s1.3 6.5 3.7 9" />
                </svg>
            </button>
            {open && (
                <div className={styles.menu} role="menu" aria-label={t('language')}>
                    <button type="button" role="menuitem" className={mode === 'en' ? styles.active : ''} onClick={() => onChange('en')}>
                        {t('english')}
                    </button>
                    <button type="button" role="menuitem" className={mode === 'zh' ? styles.active : ''} onClick={() => onChange('zh')}>
                        {t('chinese')}
                    </button>
                    <button type="button" role="menuitem" className={mode === 'both' ? styles.active : ''} onClick={() => onChange('both')}>
                        {t('bilingual')}
                    </button>
                </div>
            )}
        </div>
    );
}
