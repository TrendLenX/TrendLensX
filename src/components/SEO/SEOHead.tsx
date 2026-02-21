import { NextSeo } from 'next-seo';
import { SITE_CONFIG } from '@/lib/constants';

interface SEOHeadProps {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  twitterHandle?: string;
}

export default function SEOHead({
  title,
  description = SITE_CONFIG.description,
  canonical,
  ogImage = SITE_CONFIG.ogImage || '/logo1.png',
  ogType = 'website',
  noIndex = false,
  twitterHandle = '@trendlensx',
}: SEOHeadProps) {
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;
  const siteUrl = SITE_CONFIG.url;

  return (
    <NextSeo
      title={fullTitle}
      description={description}
      canonical={canonical ? `${siteUrl}${canonical}` : undefined}
      noindex={noIndex}
      openGraph={{
        type: ogType,
        locale: 'en_US',
        url: canonical ? `${siteUrl}${canonical}` : siteUrl,
        title: fullTitle,
        description,
        siteName: SITE_CONFIG.name,
        images: [
          {
            url: ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }}
      twitter={{
        handle: twitterHandle,
        site: twitterHandle,
        cardType: 'summary_large_image',
      }}
    />
  );
}
