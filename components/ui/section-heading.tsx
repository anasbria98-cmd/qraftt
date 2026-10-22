import { cn } from "@/lib/cn";
import { T } from "@/components/i18n/language-provider";

interface SectionHeadingProps {
  align?: "left" | "center";
  className?: string;
  description?: string;
  eyebrow: string;
  title: string;
}

export function SectionHeading({
  align = "left",
  className,
  description,
  eyebrow,
  title,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "section-heading",
        align === "center" && "section-heading-centered",
        className,
      )}
    >
      <p className="eyebrow"><T text={eyebrow} /></p>
      <h2><T text={title} /></h2>
      {description ? <p><T text={description} /></p> : null}
    </div>
  );
}
