import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  SITE_DOMAIN,
  COMPANY_INFO,
  getCanonicalUrl,
  PAGE_SEO
} from "./seoConfig";

/**
 * Helper to match an active pathname to its PAGE_SEO entry in seoConfig.js
 */
export function getSeoForPath(pathname) {
  if (!pathname) return PAGE_SEO.home;
  const clean = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  for (const key of Object.keys(PAGE_SEO)) {
    const item = PAGE_SEO[key];
    const itemPath = (item.canonicalPath || "").replace(/\/+$/, "") || "/";
    if (itemPath === clean) return item;
  }
  // Route prefixes for dynamic sections
  if (clean.startsWith("/blogs")) return PAGE_SEO.blogs;
  if (clean.startsWith("/calculators/sip-calculator")) return PAGE_SEO.sipCalculator;
  if (clean.startsWith("/calculators/step-up-sip-calculator")) return PAGE_SEO.stepUpSipCalculator;
  if (clean.startsWith("/calculators/swp-calculator")) return PAGE_SEO.swpCalculator;
  if (clean.startsWith("/calculators/retirement-planning-calculator")) return PAGE_SEO.retirementCalculator;
  if (clean.startsWith("/calculators/marriage-planning-calculator")) return PAGE_SEO.marriageCalculator;
  if (clean.startsWith("/calculators/education-planning-calculator")) return PAGE_SEO.educationCalculator;
  if (clean.startsWith("/calculators")) return PAGE_SEO.calculators;
  return PAGE_SEO.home;
}

/**
 * Clean Head Manager Component for KNAPS
 *
 * Automatically pulls metadata from src/components/seo/seoConfig.js:
 * 1. Checks `pageKey` (e.g. pageKey="mutualFunds") or matches current URL path against PAGE_SEO.
 * 2. Any explicit props passed (<SEO title="..." />) will override the config defaults.
 * 3. Updates document.title, description, keywords, canonical link, OG, Twitter, and JSON-LD schema.
 * 4. Returns null to eliminate React 19 virtual DOM reconciliation conflicts.
 */
export default function SEO({
  pageKey,
  title,
  description,
  canonicalUrl,
  canonicalPath,
  keywords,
  primaryKeyword,
  secondaryKeywords,
  ogType,
  ogImage,
  ogImageAlt,
  robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  publishedTime,
  modifiedTime,
  author,
  section,
  schema,
  breadcrumbs = []
}) {
  const location = useLocation();
  const currentPath = canonicalPath || location?.pathname || "/";

  // 1. Automatically find configuration from seoConfig.js
  const pageConfig = (pageKey && PAGE_SEO[pageKey]) || getSeoForPath(currentPath);

  // 2. Determine active canonical URL
  const activeCanonical = canonicalUrl || getCanonicalUrl(canonicalPath || pageConfig?.canonicalPath || location.pathname);

  // 3. Determine title & description: Explicit prop takes priority; otherwise uses seoConfig.js
  const rawTitle = title || pageConfig?.title || PAGE_SEO.home.title;
  const finalTitle = rawTitle.includes("KNAPS") ? rawTitle : `${rawTitle} | KNAPS`;

  const finalDescription = description || pageConfig?.description || PAGE_SEO.home.description;

  // 4. Image defaults
  const finalOgImage = ogImage || COMPANY_INFO.defaultOgImage;
  const finalOgImageAlt = ogImageAlt || COMPANY_INFO.defaultOgImageAlt;

  // 5. Assemble keywords: Prop takes priority, otherwise uses seoConfig.js
  let rawKeywords = keywords;
  if (!rawKeywords && (primaryKeyword || secondaryKeywords)) {
    rawKeywords = [
      primaryKeyword,
      ...(Array.isArray(secondaryKeywords) ? secondaryKeywords : secondaryKeywords ? [secondaryKeywords] : [])
    ].filter(Boolean);
  }
  if (!rawKeywords && pageConfig?.keywords) {
    rawKeywords = pageConfig.keywords;
  } else if (!rawKeywords && (pageConfig?.primaryKeyword || pageConfig?.secondaryKeywords)) {
    rawKeywords = [
      pageConfig.primaryKeyword,
      ...(Array.isArray(pageConfig.secondaryKeywords) ? pageConfig.secondaryKeywords : pageConfig.secondaryKeywords ? [pageConfig.secondaryKeywords] : [])
    ].filter(Boolean);
  }

  const keywordsStr = Array.isArray(rawKeywords)
    ? rawKeywords.filter(Boolean).join(", ")
    : (rawKeywords || "");

  const finalOgType = ogType || pageConfig?.ogType || "website";

  // 5. Build JSON-LD schema
  const schemaGraph = [];
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemaGraph.push({
      "@type": "BreadcrumbList",
      "@id": `${activeCanonical}#breadcrumb`,
      "itemListElement": breadcrumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": crumb.name,
        "item": crumb.url ? (crumb.url.startsWith("http") ? crumb.url : `${SITE_DOMAIN}${crumb.url}`) : activeCanonical
      }))
    });
  }

  if (schema) {
    if (Array.isArray(schema)) {
      schemaGraph.push(...schema);
    } else {
      schemaGraph.push(schema);
    }
  } else if (finalOgType === "article") {
    schemaGraph.push({
      "@type": "BlogPosting",
      "@id": `${activeCanonical}#article`,
      "headline": finalTitle,
      "description": finalDescription,
      "image": [finalOgImage],
      "datePublished": publishedTime || new Date().toISOString(),
      "dateModified": modifiedTime || publishedTime || new Date().toISOString(),
      "author": {
        "@type": "Person",
        "name": author || "KNAPS Advisory Team",
        "url": `${SITE_DOMAIN}/author`
      },
      "publisher": {
        "@type": "Organization",
        "name": COMPANY_INFO.name,
        "url": SITE_DOMAIN,
        "logo": {
          "@type": "ImageObject",
          "url": COMPANY_INFO.defaultOgImage
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": activeCanonical
      }
    });
  } else {
    schemaGraph.push({
      "@type": "WebPage",
      "@id": `${activeCanonical}#webpage`,
      "url": activeCanonical,
      "name": finalTitle,
      "description": finalDescription,
      "isPartOf": {
        "@type": "WebSite",
        "@id": `${SITE_DOMAIN}/#website`,
        "name": COMPANY_INFO.shortName,
        "url": SITE_DOMAIN
      },
      "inLanguage": "en-IN"
    });
  }

  const jsonLdString = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": schemaGraph
  });

  // Client-Side DOM Synchronization Hook
  useEffect(() => {
    // 1. Page Title
    document.title = finalTitle;

    // Helper to safely set or create a <meta> tag
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // 2. Primary Meta Tags
    setMetaTag("name", "description", finalDescription);
    setMetaTag("name", "robots", robots);
    if (keywordsStr) {
      setMetaTag("name", "keywords", keywordsStr);
    }

    // 3. Canonical Link: Synchronize and eliminate ANY duplicate canonical tags
    const canonicals = document.querySelectorAll('link[rel="canonical"]');
    if (canonicals.length > 0) {
      canonicals[0].setAttribute("href", activeCanonical);
      for (let i = 1; i < canonicals.length; i++) {
        canonicals[i].remove();
      }
    } else {
      const canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      canonicalEl.setAttribute("href", activeCanonical);
      document.head.appendChild(canonicalEl);
    }

    // 4. Open Graph Meta Tags
    setMetaTag("property", "og:site_name", COMPANY_INFO.shortName);
    setMetaTag("property", "og:type", finalOgType);
    setMetaTag("property", "og:title", finalTitle);
    setMetaTag("property", "og:description", finalDescription);
    setMetaTag("property", "og:url", activeCanonical);
    setMetaTag("property", "og:image", finalOgImage);
    setMetaTag("property", "og:image:alt", finalOgImageAlt);
    setMetaTag("property", "og:locale", "en_IN");

    // 5. Twitter / X Card Meta Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", finalTitle);
    setMetaTag("name", "twitter:description", finalDescription);
    setMetaTag("name", "twitter:image", finalOgImage);

    // 6. Schema.org JSON-LD Script
    let schemaScript = document.getElementById("knaps-dynamic-schema");
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = "knaps-dynamic-schema";
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = jsonLdString;
  }, [
    finalTitle,
    finalDescription,
    activeCanonical,
    robots,
    keywordsStr,
    finalOgType,
    finalOgImage,
    finalOgImageAlt,
    publishedTime,
    modifiedTime,
    author,
    section,
    jsonLdString
  ]);

  // Return null so React virtual DOM does not conflict with direct DOM mutations,
  // fixing the 2-clicks navigation issue completely.
  return null;
}
