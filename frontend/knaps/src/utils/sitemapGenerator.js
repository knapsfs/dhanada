/**
 * Dynamic XML Sitemap Generator for KNAPS (https://knaps.in)
 * Compliant with Sitemaps.org 0.9 schema standard.
 *
 * Merges all indexable static routes with dynamic Frappe blog posts.
 */

import { PAGE_SEO, SITE_DOMAIN } from '../components/seo/seoConfig';

export const STATIC_SITEMAP_ROUTES = [
  // Core Corporate Pages
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/products', priority: '0.9', changefreq: 'weekly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },

  // Wealth & Investment Products
  { path: '/mutual-funds', priority: '0.9', changefreq: 'weekly' },
  { path: '/sif', priority: '0.9', changefreq: 'weekly' },
  { path: '/products/nps', priority: '0.9', changefreq: 'weekly' },
  { path: '/products/post-office-small-savings-schemes', priority: '0.8', changefreq: 'monthly' },
  { path: '/products/fixed-income-products', priority: '0.8', changefreq: 'monthly' },

  // Insurance Solutions
  { path: '/products/life-insurance', priority: '0.8', changefreq: 'monthly' },
  { path: '/products/health-insurance', priority: '0.8', changefreq: 'monthly' },
  { path: '/products/general-insurance', priority: '0.8', changefreq: 'monthly' },

  // Financial Planning Calculators
  { path: '/calculators/sip', priority: '0.8', changefreq: 'monthly' },
  { path: '/calculators/step-up-sip', priority: '0.8', changefreq: 'monthly' },
  { path: '/calculators/swp', priority: '0.8', changefreq: 'monthly' },
  { path: '/calculators/lumpsum', priority: '0.8', changefreq: 'monthly' },
  { path: '/calculators/retirement', priority: '0.8', changefreq: 'monthly' },
  { path: '/calculators/future-value', priority: '0.8', changefreq: 'monthly' },
  { path: '/calculators/sip-lumpsum', priority: '0.8', changefreq: 'monthly' },

  // Knowledge & Editorial Center
  { path: '/blogs', priority: '0.9', changefreq: 'daily' },
  { path: '/author', priority: '0.7', changefreq: 'monthly' },

  // Compliance & Regulatory (Indexed for E-E-A-T and transparency)
  { path: '/regulatory-disclosures', priority: '0.7', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms-and-conditions', priority: '0.5', changefreq: 'yearly' }
];

/**
 * Builds standard XML sitemap string from static routes + dynamic blog posts
 * @param {Array} blogPosts - Array of published blog posts from Frappe
 * @returns {string} XML Sitemap
 */
export function generateSitemapXml(blogPosts = []) {
  const today = new Date().toISOString().split('T')[0];

  const staticUrls = STATIC_SITEMAP_ROUTES.map(route => `  <url>
    <loc>${SITE_DOMAIN}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n');

  const blogUrls = blogPosts.map(post => {
    const rawDate = post.published_on || post.creation || post.modified;
    let lastmod = today;
    if (rawDate) {
      try {
        lastmod = new Date(rawDate).toISOString().split('T')[0];
      } catch {
        lastmod = today;
      }
    }
    const cleanRoute = post.route ? (post.route.startsWith('/') ? post.route : `/${post.route}`) : `/blogs/${post.name || post.slug}`;
    return `  <url>
    <loc>${SITE_DOMAIN}${cleanRoute}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Core Static & Product Pages -->
${staticUrls}

  <!-- Published Dynamic Frappe Articles & Guides -->
${blogUrls}

</urlset>`;
}

