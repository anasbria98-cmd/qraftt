const paths: Record<string, string> = {
  dashboard: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  qr: "M3 3h6v6H3z M15 3h6v6h-6z M3 15h6v6H3z M15 15h2v2h-2z M19 19h2v2h-2z M20 13v3 M13 20v-3",
  statistics: "M4 20V12h3v8 M10 20V7h3v13 M16 20V3h3v17",
  import: "M12 15V3 M7 8l5-5 5 5 M4 14v6h16v-6",
  archive: "M3 4h18v5H3z M5 9v11h14V9 M10 13h4",
  domain: "M3 12h18 M12 3c6 5 6 13 0 18 M12 3c-6 5-6 13 0 18 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18",
  api: "M8 6l-6 6 6 6 M16 6l6 6-6 6 M14 3l-4 18",
  profile: "M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0 M4 21v-3c0-5 16-5 16 0v3",
  billing: "M3 5h18v14H3z M3 10h18 M6 15h4",
  support: "M4 14V10a8 8 0 0 1 16 0v4 M3 12h4v7H3z M17 12h4v7h-4z M18 19v2h-6",
  faq: "M4 3h16v18H4z M8 8h8 M8 12h8 M8 16h5",
  logout: "M10 3H4v18h6 M14 8l5 4-5 4 M8 12h11",
};
export function DashboardIcon({ name }: { name: string }) {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] ?? paths.dashboard} /></svg>;
}
