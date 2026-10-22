import { siteConfig } from "../site.ts";

export const schemaIds = {
  organization: `${siteConfig.url}/#organization`,
  website: `${siteConfig.url}/#website`,
} as const;

export const schemaReferences = {
  organization: { "@id": schemaIds.organization },
  website: { "@id": schemaIds.website },
} as const;

export const organizationSchema = {
  "@id": schemaIds.organization,
  "@type": "Organization",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@qraftt.com",
    url: `${siteConfig.url}/contact`,
  },
  logo: {
    "@type": "ImageObject",
    contentUrl: `${siteConfig.url}/icon`,
    height: 64,
    url: `${siteConfig.url}/icon`,
    width: 64,
  },
  name: siteConfig.name,
  url: siteConfig.url,
} as const;

export const websiteSchema = {
  "@id": schemaIds.website,
  "@type": "WebSite",
  description: siteConfig.description,
  name: siteConfig.name,
  publisher: schemaReferences.organization,
  url: siteConfig.url,
} as const;

export function createWebPageSchemaConnections() {
  return {
    about: [schemaReferences.organization],
    isPartOf: schemaReferences.website,
    publisher: schemaReferences.organization,
  } as const;
}

export function createPageMainEntityReferences(pageUrl: string) {
  return {
    faqPage: { "@id": `${pageUrl}#faq` },
    howTo: { "@id": `${pageUrl}#howto` },
  } as const;
}
