import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { SITE_CONFIG } from '@/lib/constants';

interface SEOHeadProps {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  twitterHandle?: string;
  hashtags?: string[];
  jsonLd?: object;
  isPost?: boolean;
  postData?: {
    slug: string;
    category: string;
    tags: string[];
    publishedAt: string;
    updatedAt?: string;
    author: string;
  };
}

export default function SEOHead({
  title,
  description = SITE_CONFIG.description,
  canonical,
  ogImage = SITE_CONFIG.ogImage,
  ogType = 'website',
  noIndex = false,
  twitterHandle = '@trendlensx',
  hashtags = [],
  jsonLd,
  isPost = false,
  postData,
}: SEOHeadProps) {
  const fullTitle = isPost ? title : `${title} | ${SITE_CONFIG.name}`;
  const siteUrl = SITE_CONFIG.url;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  // Generate hashtags for Twitter description
  const hashtagString = hashtags.length > 0 ? ` ${hashtags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ')}` : '';

  // Ensure ogImage is absolute URL
  const absoluteOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  // Generate alt text
  const generateAltText = (imageUrl: string) => {
    if (imageUrl.includes('logo')) return 'TrendLensX';
    return title;
  };

  // Default JSON-LD for homepage
  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": siteUrl,
    "name": SITE_CONFIG.name,
    "publisher": {
      "@type": "Organization",
      "name": SITE_CONFIG.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}${SITE_CONFIG.logo}`
      }
    }
  };

  // Generate JSON-LD for posts
  const generatePostJsonLd = () => {
    if (!postData) return defaultJsonLd;

    const typeMap: Record<string, string> = {
      'news': 'NewsArticle',
      'finance': 'Article',
      'technology': 'Article',
      'education': 'Article',
      'sports': 'Article',
      'lifestyle': 'Article',
      'jobs': 'Article',
      'scholarships': 'Article',
    };

    const articleType = typeMap[postData.category] || 'Article';

    return {
      "@context": "https://schema.org",
      "@type": articleType,
      "headline": title,
      "description": description,
      "image": absoluteOgImage,
      "url": canonicalUrl,
      "datePublished": postData.publishedAt,
      "dateModified": postData.updatedAt || postData.publishedAt,
      "author": {
        "@type": "Person",
        "name": postData.author
      },
      "publisher": {
        "@type": "Organization",
        "name": SITE_CONFIG.name,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}${SITE_CONFIG.logo}`
        }
      }
    };
  };

  const finalJsonLd = jsonLd || (isPost ? generatePostJsonLd() : defaultJsonLd);

  return (
    <>
      <NextSeo
        title={fullTitle}
        description={description}
        canonical={canonicalUrl}
        noindex={noIndex}
        openGraph={{
          type: ogType,
          locale: 'en_US',
          url: canonicalUrl,
          title: fullTitle,
          description,
          siteName: SITE_CONFIG.name,
          images: [
            {
              url: absoluteOgImage,
              width: 1200,
              height: 630,
              alt: generateAltText(absoluteOgImage),
            },
          ],
        }}
        twitter={{
          handle: twitterHandle,
          site: twitterHandle,
          cardType: isPost ? 'summary_large_image' : 'summary',
        }}
        additionalMetaTags={[
          {
            name: 'twitter:title',
            content: fullTitle,
          },
          {
            name: 'twitter:description',
            content: `${description}${hashtagString}`,
          },
          {
            name: 'twitter:image',
            content: absoluteOgImage,
          },
        ]}
      />
      <Head>
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(finalJsonLd),
          }}
        />
      </Head>
    </>
  );
}
