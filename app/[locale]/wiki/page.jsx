import Box from 'components/Box'
import styles from './page.module.css'
import { Link } from 'src/i18n/navigation'
import NewTab from "components/NewTab"
import { getTranslations } from 'next-intl/server'
import { BilingualBlock, BilingualPart } from 'components/BilingualBlock'
import { sitePath } from 'src/site-path'

export default async function Page({ params }) {
    const { locale } = await params
    const en = await getTranslations({ locale: 'en', namespace: 'WikiHome' })
    const zh = await getTranslations({ locale: 'zh', namespace: 'WikiHome' })

    return <>
        <h1 className={styles.logo}>
            <picture className={styles.logo}>
                <img src={sitePath('/title_logo_shadow.png')} alt="Kristal" />
            </picture>
        </h1>

        <Box>
            <BilingualBlock>
                <BilingualPart language="en" key="en">
                    <p>{en.rich('intro', {
                        strong: (chunks) => <b>{chunks}</b>,
                        love: (chunks) => <NewTab href="https://love2d.org/">{chunks}</NewTab>,
                    })}</p>
                </BilingualPart>
                <BilingualPart language="zh" key="zh">
                    <p>{zh.rich('intro', {
                        strong: (chunks) => <b>{chunks}</b>,
                        love: (chunks) => <NewTab href="https://love2d.org/">{chunks}</NewTab>,
                    })}</p>
                </BilingualPart>
            </BilingualBlock>
        </Box>

        <Box>
            <BilingualBlock>
                <BilingualPart language="en" key="en"><h2>{en('gettingStarted')}</h2></BilingualPart>
                <BilingualPart language="zh" key="zh"><h2>{zh('gettingStarted')}</h2></BilingualPart>
            </BilingualBlock>
            <hr/>
            <BilingualBlock>
                <BilingualPart language="en" key="en">
                    <p>{en.rich('gettingStartedText', {
                        strong: (chunks) => <b>{chunks}</b>,
                        download: (chunks) => <Link href="/wiki/downloading">{chunks}</Link>,
                    })}</p>
                </BilingualPart>
                <BilingualPart language="zh" key="zh">
                    <p>{zh.rich('gettingStartedText', {
                        strong: (chunks) => <b>{chunks}</b>,
                        download: (chunks) => <Link href="/wiki/downloading">{chunks}</Link>,
                    })}</p>
                </BilingualPart>
            </BilingualBlock>
        </Box>

        <Box>
            <BilingualBlock>
                <BilingualPart language="en" key="en"><h2>{en('contributing')}</h2></BilingualPart>
                <BilingualPart language="zh" key="zh"><h2>{zh('contributing')}</h2></BilingualPart>
            </BilingualBlock>
            <hr/>
            <BilingualBlock>
                <BilingualPart language="en" key="en">
                    <p>{en.rich('contributingText', {
                        strong: (chunks) => <strong>{chunks}</strong>,
                        repository: (chunks) => <NewTab href="https://github.com/KristalTeam/Shadow">{chunks}</NewTab>,
                        kristal: (chunks) => <NewTab href="https://github.com/KristalTeam/Kristal">{chunks}</NewTab>,
                    })}</p>
                </BilingualPart>
                <BilingualPart language="zh" key="zh">
                    <p>{zh.rich('contributingText', {
                        strong: (chunks) => <strong>{chunks}</strong>,
                        repository: (chunks) => <NewTab href="https://github.com/KristalTeam/Shadow">{chunks}</NewTab>,
                        kristal: (chunks) => <NewTab href="https://github.com/KristalTeam/Kristal">{chunks}</NewTab>,
                    })}</p>
                </BilingualPart>
            </BilingualBlock>
        </Box>
    </>
}
