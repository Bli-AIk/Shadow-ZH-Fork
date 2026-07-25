import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

const isGithubPages = process.env.NEXT_OUTPUT === 'export';
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'Shadow-ZH-Fork';
const basePath = isGithubPages
    ? (process.env.NEXT_PUBLIC_BASE_PATH || `/${repositoryName}`)
    : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
    output: isGithubPages ? 'export' : undefined,
    trailingSlash: isGithubPages,
    basePath,
    images: { unoptimized: true },
    env: { NEXT_PUBLIC_BASE_PATH: basePath },
    deploymentId: process.env.DEPLOYMENT_VERSION,
    webpack(config) {
        config.module.rules.push({
            test: /\.mdx$/,
            include: new URL('./content/en/wiki', import.meta.url).pathname,
            enforce: 'pre',
            use: [new URL('./src/bilingual-dependency-loader.cjs', import.meta.url).pathname],
        });

        return config;
    },
}

const withMDX = createMDX({
    options: {
        remarkPlugins: [
            'remark-gfm',
            new URL('./src/remark-bilingual.mjs', import.meta.url).pathname
        ],
        rehypePlugins: [
            'rehype-highlight'
        ],
    },
});

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

export default withNextIntl(withMDX(nextConfig));
