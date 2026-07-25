import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";


/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
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
