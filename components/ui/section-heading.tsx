import { cn } from "@/lib/cn";

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
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
