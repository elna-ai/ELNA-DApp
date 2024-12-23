import { Helmet } from 'react-helmet-async';

type MetaTagsProps = {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
};

export function MetaTags({
  title,
  description,
  keywords = '',
  author = '',
  ogTitle,
  ogDescription,
  ogImage,
}: MetaTagsProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      
      {ogTitle && <meta property="og:title" content={ogTitle || title} />}
      {ogDescription && <meta property="og:description" content={ogDescription || description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default MetaTags;
