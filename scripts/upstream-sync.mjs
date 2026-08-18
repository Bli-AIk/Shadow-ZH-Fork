// 构建期脚本：fetch 上游 Shadow 仓库，计算中文文档落后的程度，写入 src/upstream-sync.json。
// 页脚 SyncStatus 组件读取该文件展示"对齐哈希 / 上游哈希 / 是否过时"。
//
// 数据源：仓库根 sync-state.json（手动同步时更新 lastSyncedUpstreamCommit）。
// 失败时优雅降级：仍写入文件（upstreamHead = alignedCommit，behind 置 -1），
// 页面据此显示"未知"，不阻断构建。
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const STATE_PATH = path.join(ROOT, 'sync-state.json');
const OUTPUT_PATH = path.join(ROOT, 'src', 'upstream-sync.json');

// 与 sync-check.yml 保持一致的文档相关路径
const DOC_PATHS = [
    'app/wiki',
    'public/wiki',
    'components',
    'app/layout.jsx',
    'app/providers.jsx',
    'mdx-components.js',
];

function run(cmd, args) {
    return execFileSync(cmd, args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).trim();
}

function today() {
    return new Date().toISOString().slice(0, 10);
}

function short(sha) {
    return sha ? sha.slice(0, 7) : '';
}

function writeOutput(data) {
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    console.log(`[upstream-sync] wrote ${path.relative(ROOT, OUTPUT_PATH)}`);
    console.log(`[upstream-sync] aligned=${data.alignedCommit} upstream=${data.upstreamHead} behindDocs=${data.behindDocs}`);
}

let state;
try {
    state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
} catch (error) {
    console.error(`[upstream-sync] failed to read ${STATE_PATH}: ${error.message}`);
    process.exit(0);
}

const alignedCommit = state.lastSyncedUpstreamCommit;
const upstreamUrl = state.upstream?.url;
const upstreamBranch = state.upstream?.branch;

if (!alignedCommit || !upstreamUrl || !upstreamBranch) {
    console.error('[upstream-sync] sync-state.json is missing required fields, skipping');
    process.exit(0);
}

const fallback = {
    alignedCommit,
    upstreamHead: alignedCommit,
    checkedAt: today(),
    behindTotal: -1,
    behindDocs: -1,
    changedPages: -1,
    addedPages: -1,
};

try {
    // 拉取上游分支，结果放入 FETCH_HEAD（公开仓库，匿名即可）
    run('git', ['fetch', '--quiet', upstreamUrl, upstreamBranch]);
    const upstreamHead = run('git', ['rev-parse', 'FETCH_HEAD']);

    const behindTotal = Number(run('git', ['rev-list', '--count', `${alignedCommit}..FETCH_HEAD`]));
    const behindDocs = run('git', ['log', '--oneline', `${alignedCommit}..FETCH_HEAD`, '--', ...DOC_PATHS])
        .split('\n')
        .filter(Boolean).length;
    const changedPages = run('git', ['diff', '--name-only', alignedCommit, 'FETCH_HEAD', '--', 'app/wiki/*/page.mdx'])
        .split('\n')
        .filter(Boolean).length;
    const addedPages = run('git', ['diff', '--name-status', '--diff-filter=A', alignedCommit, 'FETCH_HEAD', '--', 'app/wiki/*/page.mdx'])
        .split('\n')
        .filter(Boolean).length;

    writeOutput({
        alignedCommit,
        upstreamHead,
        checkedAt: today(),
        behindTotal,
        behindDocs,
        changedPages,
        addedPages,
    });
} catch (error) {
    console.warn(`[upstream-sync] upstream fetch failed (${error.message}), writing fallback`);
    writeOutput(fallback);
}
