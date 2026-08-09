import { Breadcrumbs, type BreadcrumbItem } from "@/components/seo/breadcrumbs";
import { Container } from "@/components/ui/container";

interface PageHeroProps {
  breadcrumbs: ReadonlyArray<BreadcrumbItem>;
  eyebrow: string;
  introduction: string;
  title: string;
}

export function PageHero({
  breadcrumbs,
  eyebrow,
  introduction,
  title,
}: PageHeroProps) {
  return (
    <header className="content-hero">
      <Container className="content-hero-inner">
        <Breadcrumbs items={breadcrumbs} />
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{introduction}</p>
      </Container>
    </header>
  );
}
