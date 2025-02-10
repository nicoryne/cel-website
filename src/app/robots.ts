import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: ['/groundhog', '/darren', '/dashboard']
      }
    ],
    sitemap: 'https://cesafiesportsleague.com/sitemap.xml'
  };
}
