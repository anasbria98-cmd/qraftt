import Link from "next/link";

export function Logo() {
  return (
    <Link className="brand" href="/" aria-label="Qraft home">
      <span className="brand-mark" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <span key={index} />
        ))}
      </span>
      <span>Qraft</span>
    </Link>
  );
}
