import styles from './Navbar.module.css';
import { Link } from 'src/i18n/navigation';
import NewTab from 'components/NewTab';
import LanguageSwitcher from 'components/LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { sitePath } from 'src/site-path';

export function Item({ href, newTab, text, icon }) {
    const Component = newTab ? NewTab : Link;
    const url = `url("${sitePath(`/navbar/${icon}.png`)}")`;
    return <Component href={href} className={styles.item} title={text}>
        <div className={styles.item_text}>{text}</div>
        <div className={styles.item_icon} style={{ WebkitMaskImage: url, maskImage: url }}></div>
    </Component>;
}

export default function Navbar() {
    const t = useTranslations('Common');

    return <div id="wiki-navbar" className={styles.navbar}>
        <div className={styles.navbar_inner}>
            <Item href="/" text={t('home')} icon="home" />
            <Item href="/wiki" text={t('wiki')} icon="wiki" />
            <Item href="https://github.com/KristalTeam/Kristal/" newTab text={t('source')} icon="source" />
            <Item href="/wiki/downloading" text={t('downloads')} icon="download" />
            <Item href="https://discord.gg/8ZGuKXJE2C" newTab text={t('discord')} icon="discord" />
            <LanguageSwitcher />
        </div>
    </div>;
}
