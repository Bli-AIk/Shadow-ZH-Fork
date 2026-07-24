import Box from 'components/Box'
import styles from './page.module.css'
import { Link } from 'src/i18n/navigation'
import NewTab from "components/NewTab"
import { useTranslations } from 'next-intl'

export default function Page() {
    const t = useTranslations('WikiHome')

    return <>
        <h1 className={styles.logo}>
            <picture className={styles.logo}>
                <img src="title_logo_shadow.png" alt="Kristal" />
            </picture>
        </h1>

        <Box>
            <p>
                {t.rich('intro', {
                    strong: (chunks) => <b>{chunks}</b>,
                    love: (chunks) => <NewTab href="https://love2d.org/">{chunks}</NewTab>,
                })}
            </p>
        </Box>

        <Box>
            <h2>{t('gettingStarted')}</h2>
            <hr/>
            <p>
                {t.rich('gettingStartedText', {
                    strong: (chunks) => <b>{chunks}</b>,
                    download: (chunks) => <Link href="/wiki/downloading">{chunks}</Link>,
                })}
            </p>
        </Box>

        <Box>
            <h2>{t('contributing')}</h2>
            <hr/>

            <p>
                {t.rich('contributingText', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                    repository: (chunks) => <NewTab href="https://github.com/KristalTeam/Shadow">{chunks}</NewTab>,
                    kristal: (chunks) => <NewTab href="https://github.com/KristalTeam/Kristal">{chunks}</NewTab>,
                })}
            </p>
        </Box>
    </>
}
