import type { AppProps } from 'next/app';
import Head from 'next/head';
import { DefaultSeo } from 'next-seo';
import { Analytics } from '@vercel/analytics/next';
import Layout from '@/components/Layout/Layout';
import { SITE_CONFIG } from '@/lib/constants';
import '@/styles/globals.css';
import { UserProvider } from '@/context/UserContext'; // new context provider

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Head>
        <link rel="icon" href={SITE_CONFIG.favicon} />
      </Head>
      <DefaultSeo
        titleTemplate={`%s | ${SITE_CONFIG.name}`}
        defaultTitle={SITE_CONFIG.name}
        description={SITE_CONFIG.description}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: SITE_CONFIG.url,
          siteName: SITE_CONFIG.name,
        }}
        twitter={{
          handle: '@trendlensx',
          site: '@trendlensx',
          cardType: 'summary_large_image',
        }}
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Analytics />
    </UserProvider>
  );
}