import { Helmet } from 'react-helmet';

type MetaTagsProps = {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
//   twitterCard?: string;
//   twitterSite?: string;
//   twitterCreator?: string;
};

export function MetaTags({
  title,
  description,
  keywords = '',
  author = '',
  ogTitle,
  ogDescription,
  ogImage,
//   twitterCard = 'summary_large_image',
//   twitterSite,
//   twitterCreator,
}: MetaTagsProps) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      
      {/* Open Graph / Facebook Meta Tags */}
      {ogTitle && <meta property="og:title" content={ogTitle || title} />}
      {ogDescription && <meta property="og:description" content={ogDescription || description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content="website" />

      {/* Twitter Meta Tags */}
      {/* {twitterCard && <meta name="twitter:card" content={twitterCard} />}
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />} */}
    </Helmet>
  );
};

export default MetaTags;
