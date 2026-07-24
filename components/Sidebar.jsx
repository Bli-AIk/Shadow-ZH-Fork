"use client";

import { Link } from 'src/i18n/navigation';
import { useEffect, useRef } from 'react';
import styles from './Sidebar.module.css';
import Searchbar from 'components/Searchbar';
import { ChineseText } from './BilingualBlock';
import { useDisplayMode } from './DisplayModeProvider';
import englishMessages from '../messages/en.json';
import chineseMessages from '../messages/zh.json';

const english = englishMessages.Sidebar;
const chinese = chineseMessages.Sidebar;

function BilingualInline({ englishText, chineseText }) {
    return (
        <span className={styles.bilingualInline}>
            <span data-language="en">{englishText}</span>
            <span data-language="zh"><ChineseText>{chineseText}</ChineseText></span>
        </span>
    );
}

function SidebarContent() {
    const text = (key) => (
        <BilingualInline englishText={english[key]} chineseText={chinese[key]} />
    );
    const link = (href, key) => <Link href={href}>{text(key)}</Link>;

    return <>
        <br />
        <h3>{link('/wiki/', 'general')}</h3>
        <hr />
        <p>{text('generalDescription')}</p>
        <ul>
            <li>{link('/wiki/', 'general')}</li>
            <li>{link('/wiki/downloading', 'downloading')}</li>
            <li>{link('/wiki/playing-mods', 'playing')}</li>
            <li>{link('/wiki/glossary', 'glossary')}</li>
        </ul>
        <br />
        <h3>{link('/wiki/mod-creation', 'projectCreation')}</h3>
        <hr />
        <p>{text('projectDescription')}</p>
        <ul>
            <li>{link('/wiki/lua-tutorial', 'luaTutorial')}</li>
            <li>{link('/wiki/basics', 'basics')}</li>
            <li>{link('/wiki/creating-a-mod', 'creatingProject')}</li>
            <li>{link('/wiki/writing-text', 'writingText')}</li>
            <li>{link('/wiki/using-libraries', 'usingLibraries')}</li>
            <li>{link('/wiki/creating-an-item', 'creatingItem')}</li>
            <li>{link('/wiki/making-shops', 'creatingShop')}</li>
            <li>{link('/wiki/creating-a-spell', 'creatingSpell')}</li>
            <li>{link('/wiki/actors', 'actors')}</li>
            <li>{link('/wiki/party-members', 'partyMembers')}</li>
            <li>{link('/wiki/keybinds', 'keybinds')}</li>
            <li>{link('/wiki/releasing-mods', 'releasingProjects')}</li>
        </ul>
        <br />
        <h3>{link('/wiki/mod-creation', 'overworld')}</h3>
        <hr />
        <p>{text('overworldDescription')}</p>
        <ul>
            <li>{link('/wiki/designing-a-map', 'designingMap')}</li>
            <li>{link('/wiki/map-layers', 'mapLayers')}</li>
            <li>{link('/wiki/cutscenes', 'cutscenes')}</li>
            <li>{link('/wiki/map-properties', 'mapProperties')}</li>
            <li>{link('/wiki/using-events', 'events')}</li>
            <li>{link('/wiki/battle-areas', 'battleAreas')}</li>
            <li>{link('/wiki/world-tool', 'worldTool')}</li>
        </ul>
        <br />
        <h3>{link('/wiki/mod-creation', 'battles')}</h3>
        <hr />
        <p>{text('battleDescription')}</p>
        <ul>
            <li>{link('/wiki/battlers', 'battlers')}</li>
            <li>{link('/wiki/encounters', 'encounters')}</li>
            <li>{link('/wiki/enemy-attacks', 'enemyAttacks')}</li>
            <li>{link('/wiki/wavemaking-reference', 'wavemaking')}</li>
        </ul>
        <br />
        <h3>{link('/wiki/mod-creation#advanced-mod-creation', 'advanced')}</h3>
        <hr />
        <p>{text('advancedDescription')}</p>
        <ul>
            <li>{link('/wiki/debugging', 'debugging')}</li>
            <li>{link('/wiki/hooks', 'hooks')}</li>
            <li>{link('/wiki/ui', 'ui')}</li>
        </ul>
        <br />
        <h3>{link('/wiki/api', 'api')}</h3>
        <hr />
        <p>{text('apiDescription')}</p>
        <Link href="#top" style={{ textAlign: 'right' }}>{text('backToTop')}</Link>
    </>;
}

export default function Sidebar() {
    const sidebarRef = useRef(null);
    const { mode } = useDisplayMode();

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

    const content = <SidebarContent />;
    const toggleTitle = <h2><BilingualInline englishText={english.title} chineseText={chinese.title} /></h2>;
    const searchPlaceholder = mode === 'zh'
        ? chinese.searchPlaceholder
        : mode === 'both'
            ? `${english.searchPlaceholder} / ${chinese.searchPlaceholder}`
            : english.searchPlaceholder;
    const searchSubmit = mode === 'zh'
        ? chinese.searchSubmit
        : mode === 'both'
            ? `${english.searchSubmit} / ${chinese.searchSubmit}`
            : english.searchSubmit;

    return <>
        <div ref={sidebarRef} className={styles.sidebar}>
            {toggleTitle}
            <Searchbar id="header-search" placeholder={searchPlaceholder} submit={searchSubmit} />
            {content}
        </div>
        <div className={styles['mobile-sidebar']}>
            <Searchbar id="mobile-header-search" placeholder={searchPlaceholder} submit={searchSubmit} />
            <details>
                <summary>{toggleTitle}</summary>
                {content}
            </details>
        </div>
    </>;
}
