import NewTab from 'components/NewTab';
import { getTranslations } from 'next-intl/server';
import { BilingualBlock, BilingualPart } from 'components/BilingualBlock';
import upstreamSync from 'src/upstream-sync.json';

const COMMIT_URL = (sha) => `https://github.com/KristalTeam/Shadow/commit/${sha}`;

function short(sha) {
    return typeof sha === 'string' ? sha.slice(0, 7) : '';
}

export default async function SyncStatus() {
    const en = await getTranslations({ locale: 'en', namespace: 'SyncStatus' });
    const zh = await getTranslations({ locale: 'zh', namespace: 'SyncStatus' });

    const { alignedCommit, upstreamHead, behindDocs } = upstreamSync;
    const unknown = typeof behindDocs !== 'number' || behindDocs < 0;
    const inSync = !unknown && upstreamHead.startsWith(alignedCommit);

    const status = unknown
        ? { color: '#aaaaaa', key: 'unknown' }
        : inSync
            ? { color: '#00ff40', key: 'inSync' }
            : { color: '#ffcc00', key: 'outdated', n: behindDocs };

    const statusLine = (t) => (
        <>
            {t('docsAlignedTo')} <NewTab href={COMMIT_URL(alignedCommit)}>{short(alignedCommit)}</NewTab>
            {' · '}
            {t('upstreamLatest')} <NewTab href={COMMIT_URL(upstreamHead)}>{short(upstreamHead)}</NewTab>
            {' · '}
            <span style={{ color: status.color }}>
                {status.key === 'outdated' ? t('outdated', { n: status.n }) : t(status.key)}
            </span>
            {' · '}
            {t('checkedDaily')}
        </>
    );

    return (
        <p style={{ marginTop: '0.75rem', marginBottom: 0, fontSize: '0.9em', color: '#bbbbbb' }}>
            <BilingualBlock>
                <BilingualPart language="en">{statusLine(en)}</BilingualPart>
                <BilingualPart language="zh">{statusLine(zh)}</BilingualPart>
            </BilingualBlock>
        </p>
    );
}
