import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const site = (process.env.SITE_URL || 'https://www.brasseyutz.fr').replace(/\/$/, '');
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/connexion', '/api'] }],
    sitemap: site + '/sitemap.xml',
  };
}
