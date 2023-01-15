import Head from 'next/head';
import { useRouter } from 'next/router';

type Props = {
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Providing width speeds up shares of new URLs on Facebook */
  imageWidth?: number;
  /** Providing height speeds up shares of new URLs on Facebook */
  imageHeight?: number;
  baseUrl?: string;
  siteName?: string;
  type?: string;
  fbAppId?: string;
  twitterUsername?: string;
};

/**
 * Social meta tags for Next JS's Head component.
 * To use, place adjacent to (not inside) other Head components.
 * https://css-tricks.com/essential-meta-tags-social-media/#article-header-id-2
 */
const SocialMetaHead: React.FC<Props> = ({
  title,
  description = '',
  imageUrl,
  imageAlt,
  imageWidth,
  imageHeight,
  baseUrl = '',
  siteName,
  type = 'website',
  fbAppId,
  twitterUsername,
}) => {
  const router = useRouter();
  const url = `${baseUrl || ''}${router && router.asPath}`;
  const truncatedTitle = truncate(title);
  const truncatedDescription = truncate(description);
  const truncatedImageAlt = truncate(imageAlt);

  return (
    <Head>
      {/* ----------------------------------------------------------------- */}
      {/* Essential Meta Tags */}
      {/* ----------------------------------------------------------------- */}

      {truncatedTitle && (
        <meta
          property="og:title"
          content={truncatedTitle}
          key="meta-og:title"
        />
      )}

      {truncatedDescription && (
        <>
          <meta
            property="og:description"
            content={truncatedDescription}
            key="meta-og:description"
          />
          <meta name="description" content={truncatedDescription}></meta>
        </>
      )}

      {url && <meta property="og:url" content={url} key="meta-og:url" />}

      {imageUrl && (
        <meta property="og:image" content={imageUrl} key="meta-og:image" />
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Non-Essential, But Recommended */}
      {/* ----------------------------------------------------------------- */}

      {siteName && (
        <meta
          property="og:site_name"
          content={siteName}
          key="meta-og:site_name"
        />
      )}

      {imageWidth && (
        <meta
          property="og:image:width"
          content={`${imageWidth}`}
          key="meta-og:image:width"
        />
      )}

      {imageHeight && (
        <meta
          property="og:image:height"
          content={`${imageHeight}`}
          key="meta-og:image:height"
        />
      )}

      {truncatedImageAlt && (
        <meta
          name="twitter:image:alt"
          content={truncatedImageAlt}
          key="meta-twitter:image:alt"
        />
      )}

      {type && <meta property="og:type" content={type} />}

      {/* ----------------------------------------------------------------- */}
      {/* Non-Essential, But Required for analytics */}
      {/* ----------------------------------------------------------------- */}

      {fbAppId && (
        <meta property="fb:app_id" content={fbAppId} key="meta-fb:app_id" />
      )}

      {twitterUsername && (
        <meta
          name="twitter:site"
          content={twitterUsername}
          key={'meta-twitter:site'}
        />
      )}
    </Head>
  );
};

const truncate = (text: string = '', maxChars = 300) => {
  if (text && text.length > maxChars) {
    return `${text.substring(0, maxChars)}...`;
  }

  return text;
};

export default SocialMetaHead;
