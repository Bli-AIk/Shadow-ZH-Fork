"use client";

import { Link } from 'src/i18n/navigation';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import styles from './Sidebar.module.css';
import Searchbar from 'components/Searchbar';

function SidebarContent({ t }) {
    return <>
        <br />
        <h3><Link href="/wiki/">{t('general')}</Link></h3>
        <hr />
        <p>{t('generalDescription')}</p>
        <ul>
            <li><Link href="/wiki/">{t('general')}</Link></li>
            <li><Link href="/wiki/downloading">{t('downloading')}</Link></li>
            <li><Link href="/wiki/playing-mods">{t('playing')}</Link></li>
            <li><Link href="/wiki/glossary">{t('glossary')}</Link></li>
        </ul>
        <br />
        <h3><Link href="/wiki/mod-creation">{t('projectCreation')}</Link></h3>
        <hr />
        <p>{t('projectDescription')}</p>
        <ul>
            <li><Link href="/wiki/lua-tutorial">{t('luaTutorial')}</Link></li>
            <li><Link href="/wiki/basics">{t('basics')}</Link></li>
            <li><Link href="/wiki/creating-a-mod">{t('creatingProject')}</Link></li>
            <li><Link href="/wiki/writing-text">{t('writingText')}</Link></li>
            <li><Link href="/wiki/using-libraries">{t('usingLibraries')}</Link></li>
            <li><Link href="/wiki/creating-an-item">{t('creatingItem')}</Link></li>
            <li><Link href="/wiki/making-shops">{t('creatingShop')}</Link></li>
            <li><Link href="/wiki/creating-a-spell">{t('creatingSpell')}</Link></li>
            <li><Link href="/wiki/actors">{t('actors')}</Link></li>
            <li><Link href="/wiki/party-members">{t('partyMembers')}</Link></li>
            <li><Link href="/wiki/keybinds">{t('keybinds')}</Link></li>
            <li><Link href="/wiki/releasing-mods">{t('releasingProjects')}</Link></li>
        </ul>
        <br />
        <h3><Link href="/wiki/mod-creation">{t('overworld')}</Link></h3>
        <hr />
        <p>{t('overworldDescription')}</p>
        <ul>
            <li><Link href="/wiki/designing-a-map">{t('designingMap')}</Link></li>
            <li><Link href="/wiki/map-layers">{t('mapLayers')}</Link></li>
            <li><Link href="/wiki/cutscenes">{t('cutscenes')}</Link></li>
            <li><Link href="/wiki/map-properties">{t('mapProperties')}</Link></li>
            <li><Link href="/wiki/using-events">{t('events')}</Link></li>
            <li><Link href="/wiki/battle-areas">{t('battleAreas')}</Link></li>
            <li><Link href="/wiki/world-tool">{t('worldTool')}</Link></li>
        </ul>
        <br />
        <h3><Link href="/wiki/mod-creation">{t('battles')}</Link></h3>
        <hr />
        <p>{t('battleDescription')}</p>
        <ul>
            <li><Link href="/wiki/battlers">{t('battlers')}</Link></li>
            <li><Link href="/wiki/encounters">{t('encounters')}</Link></li>
            <li><Link href="/wiki/enemy-attacks">{t('enemyAttacks')}</Link></li>
            <li><Link href="/wiki/wavemaking-reference">{t('wavemaking')}</Link></li>
        </ul>
        <br />
        <h3><Link href="/wiki/mod-creation#advanced-mod-creation">{t('advanced')}</Link></h3>
        <hr />
        <p>{t('advancedDescription')}</p>
        <ul>
            <li><Link href="/wiki/debugging">{t('debugging')}</Link></li>
            <li><Link href="/wiki/hooks">{t('hooks')}</Link></li>
            <li><Link href="/wiki/ui">{t('ui')}</Link></li>
        </ul>
        <br />
        <h3><Link href="/wiki/api">{t('api')}</Link></h3>
        <hr />
        <p>{t('apiDescription')}</p>
        <Link href="#top" style={{ textAlign: 'right' }}>{t('backToTop')}</Link>
    </>;
}

export default function Sidebar() {
    const sidebarRef = useRef(null);
    const t = useTranslations('Sidebar');

    useEffect(() => {
        const sidebarEl = sidebarRef.current;
        if (!sidebarEl) return;

        const navbarEl = document.getElementById('wiki-navbar');
        const updateSidebarOffset = () => {
            if (!navbarEl) {
                sidebarEl.style.setProperty('--sidebar-offset', '0px');
                return;
            }
            const navbarRect = navbarEl.getBoundingClientRect();
            sidebarEl.style.setProperty('--sidebar-offset', `${Math.max(0, navbarRect.bottom)}px`);
        };

        let raf = null;
        const scheduleUpdate = () => {
            if (raf !== null) return;
            raf = requestAnimationFrame(() => {
                raf = null;
                updateSidebarOffset();
            });
        };

        updateSidebarOffset();
        window.addEventListener('scroll', scheduleUpdate, { passive: true });
        window.addEventListener('resize', scheduleUpdate);
        return () => {
            if (raf !== null) cancelAnimationFrame(raf);
            window.removeEventListener('scroll', scheduleUpdate);
            window.removeEventListener('resize', scheduleUpdate);
        };
    }, []);

    const content = <SidebarContent t={t} />;
    const toggleTitle = <h2>{t('title')}</h2>;

    return <>
        <div ref={sidebarRef} className={styles.sidebar}>
            {toggleTitle}
            <Searchbar id="header-search" placeholder={t('searchPlaceholder')} submit={t('searchSubmit')} />
            {content}
        </div>
        <div className={styles['mobile-sidebar']}>
            <Searchbar id="mobile-header-search" placeholder={t('searchPlaceholder')} submit={t('searchSubmit')} />
            <details>
                <summary>{toggleTitle}</summary>
                {content}
            </details>
        </div>
    </>;
}
