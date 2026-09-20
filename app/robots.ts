import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/generate', '/settings', '/library', '/billing', '/onboarding'],
    },
    sitemap: 'https://draftly-pink.vercel.app/sitemap.xml',
  }
}
