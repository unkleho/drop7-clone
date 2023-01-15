import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import SocialMetaHead from '../components/social-meta-head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* https://favicon.io/favicon-converter/ */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SocialMetaHead
        title="Drop 7 Clone"
        description="Open source clone of Drop 7. Written in React, Next JS, XState and Framer Motion."
        imageUrl={
          'https://' +
          process.env.NEXT_PUBLIC_VERCEL_URL +
          '/social/social-card.jpg'
        }
        imageWidth={800}
        imageHeight={800}
        twitterUsername="unkleho"
      />

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
