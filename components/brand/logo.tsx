import Link from "next/link";

export function Logo() {
  return (
    <Link className="brand" href="/" aria-label="Qraftt home">
      <svg aria-hidden="true" className="brand-mark" viewBox="0 0 48 48">
        <path d="M4 18V8a4 4 0 0 1 4-4h10" />
        <path d="M30 4h10a4 4 0 0 1 4 4v10" />
        <path className="brand-mark-accent" d="M44 30v10a4 4 0 0 1-4 4H30" />
        <path className="brand-mark-accent" d="M18 44H8a4 4 0 0 1-4-4V30" />
        <rect height="9" rx="2" width="9" x="13" y="13" />
        <rect height="9" rx="2" width="9" x="27" y="13" />
        <rect className="brand-mark-accent" height="9" rx="2" width="9" x="13" y="27" />
        <rect className="brand-mark-accent" height="9" rx="2" width="9" x="27" y="27" />
      </svg>
      <span className="brand-wordmark" translate="no">Qraftt</span>
    </Link>
  );
}
