"use client";

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'src/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useDisplayMode } from './DisplayModeProvider';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const t = useTranslations('Common');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { mode, setMode } = useDisplayMode();
    const [value, setValue] = useState(mode);

    useEffect(() => setValue(mode), [mode]);

    const onChange = (event) => {
        const nextMode = event.target.value;
        setValue(nextMode);
        setMode(nextMode);

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
        <label className={styles.control}>
            <span className={styles.label}>{t('language')}</span>
            <select value={value} onChange={onChange} aria-label={t('language')}>
                <option value="en">{t('english')}</option>
                <option value="zh">{t('chinese')}</option>
                <option value="both">{t('bilingual')}</option>
            </select>
        </label>
    );
}
