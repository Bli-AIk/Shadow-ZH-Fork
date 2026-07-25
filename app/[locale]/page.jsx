import styles from './page.module.css'
import Box from "components/Box"
import NewTab from "components/NewTab"
import { Link } from "src/i18n/navigation"
import { getTranslations } from 'next-intl/server'
import { BilingualBlock, BilingualPart, ChineseText } from 'components/BilingualBlock'

export default async function Home({ params }) {
    const { locale } = await params
    const en = await getTranslations({ locale: 'en', namespace: 'Home' })
    const zh = await getTranslations({ locale: 'zh', namespace: 'Home' })

    const mods = [
        {
            title: "#th Sanctuary",
            titleZh: "第井圣域",
            description: "WORLDS ENTER COLLISION. THE KNIGHT IS TO NO FAULT. Join the fun gang in a liminal exploration reminiscient to Yume Nikki & Mario 64 B3313 crossed over with Dark Worlds!",
            image: "/screenshots/nthsanctuary.png",
            page: "https://gamejolt.com/games/nth_sanctum/1018037",
            author: "Ralszor & Project Sanctum Team",
            author_link: "https://www.youtube.com/@Ralszor"
        },
        {
            title: "DELTARUNE: Frostveil",
            titleZh: "三角符文：冰封帷幕",
            description: "A take on Chapter 5's Weird Route. Explore a new Dark World, find unique weapons and armors to try and defeat the Awakened Frostmancer, Noelle.",
            image: "/screenshots/frostveil.png",
            page: "https://gamejolt.com/games/deltarune_frostveil/1058015",
            author: "Duskkii",
            author_link: "https://www.youtube.com/@Tsuska"
        },
        {
            title: "Plugged Dream",
            description: "The gaming console. The dusty screen. And HE, asking for one last challenge, like in the old days. Gaining the power from the wires, RAMB became stronger. Now, will you be able to defeat him?",
            image: "/screenshots/pluggeddream.png",
            page: "https://gamejolt.com/games/pluggeddream/1019739",
            author: "Funkin's Garbage",
            author_link: "https://www.youtube.com/@funkygarb"
        },
        {
            title: "Deltarune: UZUMAKI",
            titleZh: "三角符文：漩涡",
            description: "Join the DELTA WARRIORS in a journey to break the endless cycle, and free everyone from their fate. In this fangame, you can play small snippets of Deltarune: UZUMAKI's hypothetical Chapters 3 to 7. The Demo is currently in development, so please have patience!",
            image: "/screenshots/uzumaki.png",
            page: "https://deltaruneuzumaki.neocities.org/",
            author: "RazFraz, Emily Ember Ignatus Bunnington & Team Raspberry",
            author_link: "https://www.youtube.com/@RazFraz"
        },
        {
            title: "No Words Spoken",
            titleZh: "不发一言",
            description: "Two roads lie ahead for Kris—and they can’t hear your voice anymore. All they know is this: they will not walk either path as a puppet, and you are the last thread left to cut.",
            image: "/screenshots/nowordsspoken.png",
            page: "https://gamebanana.com/mods/642559",
            author: "AcousticJamm",
            author_link: "https://rootapp.gg/ACuv93NxigqCycHYi4-m1g"
        },
        {
            title: "Godhome",
            titleZh: "神居",
            description: "Take your place amongst the Gods. 40+ boss fights, challenge modes, and a unique ending. Contains major spoilers for Hollow Knight.",
            image: "/screenshots/godhome.png",
            page: "https://gamebanana.com/mods/376524",
            author: "Vitellary",
            author_link: null
        },
        {
            title: "Deoxynn",
            description: "Alexa Greene, a victim of something terrible, starts her adventure through the world of Europa. Will she make new friends and keep sane, or will she succumb to her insanity? The choice is yours.",
            image: "/screenshots/deoxynn.png",
            page: "https://gamebanana.com/mods/434334",
            author: "AcousticJamm",
            author_link: "https://rootapp.gg/ACuv93NxigqCycHYi4-m1g"
        },
        {
            title: "Frozen Heart",
            titleZh: "冰封之心",
            description: "The end of the Snowgrave Route seen from another place. While Kris gets torn to pieces by a bootleg Mettaton NEO, Susie has to face Noelle, lost in the trance of the Thorn Ring, before she freezes her to death! And who knows, maybe the situation can get even worse than that?",
            image: "/screenshots/frozen_heart.png",
            page: "https://gamejolt.com/games/frozen-heart/659908",
            author: "Simbel",
            author_link: "https://www.youtube.com/@Simbel"
        },
        {
            title: "Deltamon",
            description: "Explore the vast region that Kris calls home as you aid them in becoming champion! Your rivals Susie, Noelle and Berdly join alongside you to see and catch over 200+ pokémon from Kanto to Paldea!",
            image: "/screenshots/deltamon.png",
            page: "https://gamejolt.com/games/Deltamon/946082",
            author: "Riverstar",
            author_link: null
        },
        {
            title: "Deltarune: Missing Light",
            description: "Traverse through different worlds and realities, and save the multiverse from being consumed by darkness and anomalies!",
            image: "/screenshots/deltarune_missing_light.png",
            page: "https://gamejolt.com/games/missinglight/799416",
            author: "DiamondBor",
            author_link: "https://www.youtube.com/channel/UCs76CI1gJeWx77sSTCCbICA"
        }
    ]

    return (
        <>
            <h1 className={styles.logo}>
                <picture>
                    <img src="title_logo_shadow.png" alt="Kristal" />
                </picture>
            </h1>

            <section className={styles.section}>
                <Box>
                    <BilingualBlock>
                        <BilingualPart language="en" key="en"><h2 className={styles.header}>{en('aboutTitle')}</h2></BilingualPart>
                        <BilingualPart language="zh" key="zh"><h2 className={styles.header}>{zh('aboutTitle')}</h2></BilingualPart>
                    </BilingualBlock>
                    <BilingualBlock>
                        <BilingualPart language="en" key="en">
                            <p>{en.rich('about', {
                                deltarune: (chunks) => <NewTab href="https://deltarune.com/">{chunks}</NewTab>,
                                love: (chunks) => <NewTab href="https://love2d.org/">{chunks}</NewTab>,
                                strong: (chunks) => <b>{chunks}</b>,
                            })}</p>
                        </BilingualPart>
                        <BilingualPart language="zh" key="zh">
                            <p>{zh.rich('about', {
                                deltarune: (chunks) => <NewTab href="https://deltarune.com/">{chunks}</NewTab>,
                                love: (chunks) => <NewTab href="https://love2d.org/">{chunks}</NewTab>,
                                strong: (chunks) => <b>{chunks}</b>,
                            })}</p>
                        </BilingualPart>
                    </BilingualBlock>
                </Box>

                <Box>
                    <BilingualBlock>
                        <BilingualPart language="en" key="en"><h2 className={styles.header}>{en('useTitle')}</h2></BilingualPart>
                        <BilingualPart language="zh" key="zh"><h2 className={styles.header}>{zh('useTitle')}</h2></BilingualPart>
                    </BilingualBlock>
                    <BilingualBlock>
                        <BilingualPart language="en" key="en">
                            <p>{en.rich('use', {
                                wiki: (chunks) => <Link href="/wiki/">{chunks}</Link>,
                                tutorial: (chunks) => <Link href="/wiki/lua-tutorial">{chunks}</Link>,
                                strong: (chunks) => <b>{chunks}</b>,
                            })}</p>
                        </BilingualPart>
                        <BilingualPart language="zh" key="zh">
                            <p>{zh.rich('use', {
                                wiki: (chunks) => <Link href="/wiki/">{chunks}</Link>,
                                tutorial: (chunks) => <Link href="/wiki/lua-tutorial">{chunks}</Link>,
                                strong: (chunks) => <b>{chunks}</b>,
                            })}</p>
                        </BilingualPart>
                    </BilingualBlock>
                </Box>

                <Box>
                    <BilingualBlock>
                        <BilingualPart language="en" key="en"><h2 className={styles.header}>{en('helpTitle')}</h2></BilingualPart>
                        <BilingualPart language="zh" key="zh"><h2 className={styles.header}>{zh('helpTitle')}</h2></BilingualPart>
                    </BilingualBlock>
                    <BilingualBlock>
                        <BilingualPart language="en" key="en">
                            <p>{en.rich('help', {
                                strong: (chunks) => <b>{chunks}</b>,
                                source: (chunks) => <NewTab href="https://github.com/KristalTeam/Kristal">{chunks}</NewTab>,
                            })}</p>
                        </BilingualPart>
                        <BilingualPart language="zh" key="zh">
                            <p>{zh.rich('help', {
                                strong: (chunks) => <b>{chunks}</b>,
                                source: (chunks) => <NewTab href="https://github.com/KristalTeam/Kristal">{chunks}</NewTab>,
                            })}</p>
                        </BilingualPart>
                    </BilingualBlock>
                </Box>

                <Box>
                    <BilingualBlock>
                        <BilingualPart language="en" key="en"><h2 className={styles.header}>{en('screenshotsTitle')}</h2></BilingualPart>
                        <BilingualPart language="zh" key="zh"><h2 className={styles.header}>{zh('screenshotsTitle')}</h2></BilingualPart>
                    </BilingualBlock>
                    <br/>
                    <div className={styles.screenshots}>
                    {
                        mods.map((mod, index) => {
                            return <div key={mod.title}>
                                <img
                                    className={styles.screenshot}
                                    src={mod.image}
                                    alt={en('screenshotAlt', { title: mod.title })}
                                    width={640}
                                    height={480}
                                />
                                <div className={styles.screenshot_info}>
                                    <NewTab href={mod.page} className={styles.screenshot_title}>
                                        {mod.title}
                                        {mod.titleZh && <span data-language="zh">（<ChineseText>{mod.titleZh}</ChineseText>）</span>}
                                    </NewTab>
                                    <BilingualBlock>
                                        <BilingualPart language="en" key="en">
                                            <span className={styles.screenshot_author}>{en('by')} {
                                                (mod.author_link !== null) ? <NewTab href={mod.author_link}>{mod.author}</NewTab> : mod.author
                                            }</span>
                                        </BilingualPart>
                                        <BilingualPart language="zh" key="zh">
                                            <span className={styles.screenshot_author}>{zh('by')} {
                                                (mod.author_link !== null) ? <NewTab href={mod.author_link}>{mod.author}</NewTab> : mod.author
                                            }</span>
                                        </BilingualPart>
                                    </BilingualBlock>
                                    <BilingualBlock>
                                        <BilingualPart language="en" key="en"><p className={styles.screenshot_description}>{en(`mods.${index}.description`)}</p></BilingualPart>
                                        <BilingualPart language="zh" key="zh"><p className={styles.screenshot_description}>{zh(`mods.${index}.description`)}</p></BilingualPart>
                                    </BilingualBlock>
                                </div>
                            </div>
                        })
                    }
                    </div>
                </Box>
            </section>
        </>
    )
}
