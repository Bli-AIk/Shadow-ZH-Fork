import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { articleSlugs, loadArticle } from 'src/wiki-content.mjs';

export const dynamicParams = false;

export function generateStaticParams() {
    return articleSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
    const { locale, slug } = await params;
    const article = await loadArticle(slug);
    if (!article) notFound();

    const t = await getTranslations({ locale, namespace: 'ArticleMetadata' });
    const fallback = article.metadata || {};
    return {
        title: t.has(`${slug}.title`) ? t(`${slug}.title`) : fallback.title,
        description: t.has(`${slug}.description`) ? t(`${slug}.description`) : fallback.description,
    };
}

export default async function ArticlePage({ params }) {
    const { slug } = await params;
    const article = await loadArticle(slug);
    if (!article) notFound();

    const Article = article.default;
    return <Article />;
}
