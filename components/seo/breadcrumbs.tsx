import Link from "next/link";
import { siteConfig } from "@/lib/site";

export interface BreadcrumbItem {
  href: string;
  label: string;
}

interface BreadcrumbsProps {
  items: ReadonlyArray<BreadcrumbItem>;
}

export function createBreadcrumbSchema(items: ReadonlyArray<BreadcrumbItem>) {
  return {
    "@id": `${siteConfig.url}${items.at(-1)?.href ?? "/"}#breadcrumb`,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      item: `${siteConfig.url}${item.href}`,
      name: item.label,
      position: index + 1,
    })),
  };
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={item.href}>
              {current ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
