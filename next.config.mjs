import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";


/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
    deploymentId: process.env.DEPLOYMENT_VERSION
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
