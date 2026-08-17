import Link from "next/link";
import { Container } from "@/components/ui/container";

type UseCaseKind =
  | "restaurant"
  | "business"
  | "wifi"
  | "events"
  | "reviews"
  | "social"
  | "payments"
  | "files";

const useCases = [
  {
    description: "Share menus and ordering pages from tables, counters, and windows.",
    href: "/menu-qr-code-generator",
    kind: "restaurant",
    title: "Restaurants & Cafes",
  },
  {
    description: "Turn introductions into saved contact details with a polished vCard.",
    href: "/vcard-qr-code-generator",
    kind: "business",
    title: "Business",
  },
  {
    description: "Help guests join the right network without typing a long password.",
    href: "/wifi-qr-code-generator",
    kind: "wifi",
    title: "WiFi",
  },
  {
    description: "Place event details directly into a compatible calendar invitation.",
    href: "/calendar-qr-code-generator",
    kind: "events",
    title: "Events",
  },
  {
    description: "Send customers to your official Google review destination after a visit.",
    href: "/google-review-qr-code-generator",
    kind: "reviews",
    title: "Reviews",
  },
  {
    description: "Make profiles and social destinations easier to discover and follow.",
    href: "/instagram-qr-code-generator",
    kind: "social",
    title: "Social Media",
  },
  {
    description: "Open a verified PayPal destination while payment stays with PayPal.",
    href: "/paypal-qr-code-generator",
    kind: "payments",
    title: "Payments",
  },
  {
    description: "Connect print and screens to a public PDF that you already host.",
    href: "/pdf-qr-code-generator",
    kind: "files",
    title: "Files",
  },
] as const satisfies readonly {
  description: string;
  href: string;
  kind: UseCaseKind;
  title: string;
}[];

const qrDots = [
  [0, 0], [1, 0], [4, 0], [5, 0], [0, 1], [2, 1], [4, 1], [1, 2],
  [2, 2], [3, 2], [5, 2], [0, 3], [3, 3], [4, 3], [1, 4], [2, 4],
  [5, 4], [0, 5], [2, 5], [3, 5], [4, 5],
] as const;

function MiniQr({ size = 60, x, y }: { size?: number; x: number; y: number }) {
  const unit = size / 7;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className="use-svg-paper" height={size} rx={size * 0.12} width={size} />
      {qrDots.map(([column, row], index) => (
        <rect
          className={index % 5 === 0 ? "use-svg-mint" : "use-svg-dark"}
          height={unit * 0.72}
          key={`${column}-${row}`}
          rx={unit * 0.14}
          width={unit * 0.72}
          x={unit * (0.65 + column)}
          y={unit * (0.65 + row)}
        />
      ))}
    </g>
  );
}

function UseCaseArtwork({ kind }: { kind: UseCaseKind }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 360 210">
      <circle className="use-svg-glow" cx="180" cy="105" r="88" />

      {kind === "restaurant" ? (
        <>
          <path className="use-svg-dark" d="M74 66h212l-17-28H91L74 66Z" />
          <path className="use-svg-mint" d="M91 38h30l-8 28H74l17-28Zm60 0h30l-1 28h-38l9-28Zm60 0h30l14 28h-38l-6-28Z" />
          <rect className="use-svg-panel" height="108" rx="12" width="184" x="88" y="66" />
          <path className="use-svg-line" d="M111 174v-42h49v42m42 0V96h45v78" />
          <circle className="use-svg-mint-soft" cx="135" cy="116" r="23" />
          <path className="use-svg-accent-line" d="M120 116h30m-15-15v30" />
          <MiniQr size={54} x={197} y={105} />
          <path className="use-svg-dark-stroke" d="M58 181h244" />
        </>
      ) : null}

      {kind === "business" ? (
        <>
          <rect className="use-svg-card" height="126" rx="18" width="238" x="61" y="43" />
          <rect className="use-svg-dark" height="126" rx="18" width="74" x="61" y="43" />
          <circle className="use-svg-mint" cx="98" cy="82" r="18" />
          <path className="use-svg-paper-fill" d="M78 128c3-18 13-27 20-27s17 9 20 27H78Z" />
          <rect className="use-svg-dark" height="9" rx="4.5" width="73" x="155" y="66" />
          <rect className="use-svg-muted" height="7" rx="3.5" width="99" x="155" y="86" />
          <rect className="use-svg-muted" height="7" rx="3.5" width="72" x="155" y="103" />
          <MiniQr size={48} x={235} y={108} />
          <path className="use-svg-accent-line" d="M150 143h62" />
        </>
      ) : null}

      {kind === "wifi" ? (
        <>
          <rect className="use-svg-card" height="112" rx="22" width="84" x="214" y="61" />
          <rect className="use-svg-dark" height="92" rx="16" width="64" x="224" y="71" />
          <MiniQr size={50} x={231} y={84} />
          <path className="use-svg-dark-stroke" d="M78 155h103" />
          <rect className="use-svg-panel" height="31" rx="11" width="112" x="73" y="126" />
          <circle className="use-svg-mint" cx="99" cy="141" r="5" />
          <circle className="use-svg-mint" cx="116" cy="141" r="5" />
          <path className="use-svg-accent-line" d="M85 126 76 90m97 36 9-36" />
          <path className="use-svg-accent-line" d="M98 92c22-21 45-21 67 0m-55 12c14-12 29-12 43 0m-29 13c5-4 10-4 15 0" />
        </>
      ) : null}

      {kind === "events" ? (
        <>
          <path className="use-svg-card" d="M70 55h220v114H70V55Zm0 26h220" />
          <rect className="use-svg-dark" height="34" rx="12" width="220" x="70" y="55" />
          <path className="use-svg-paper-stroke" d="M107 45v21m116-21v21" />
          <text className="use-svg-date" x="98" y="133">24</text>
          <rect className="use-svg-muted" height="8" rx="4" width="59" x="154" y="105" />
          <rect className="use-svg-muted" height="8" rx="4" width="43" x="154" y="123" />
          <MiniQr size={46} x={230} y={103} />
          <circle className="use-svg-mint" cx="54" cy="61" r="5" />
          <circle className="use-svg-mint" cx="306" cy="114" r="5" />
          <path className="use-svg-accent-line" d="m52 97 12 5-10 8m252-48-10 8 11 5" />
        </>
      ) : null}

      {kind === "reviews" ? (
        <>
          <path className="use-svg-card" d="M72 52h216a16 16 0 0 1 16 16v86a16 16 0 0 1-16 16H171l-30 22 5-22H72a16 16 0 0 1-16-16V68a16 16 0 0 1 16-16Z" />
          {[92, 126, 160, 194, 228].map((x) => (
            <path className="use-svg-star" d={`m${x} 82 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2 5-10Z`} key={x} />
          ))}
          <rect className="use-svg-muted" height="8" rx="4" width="103" x="88" y="128" />
          <rect className="use-svg-muted" height="8" rx="4" width="77" x="88" y="146" />
          <MiniQr size={50} x={226} y={111} />
        </>
      ) : null}

      {kind === "social" ? (
        <>
          <rect className="use-svg-card" height="146" rx="25" width="96" x="132" y="32" />
          <rect className="use-svg-dark" height="126" rx="18" width="78" x="141" y="42" />
          <circle className="use-svg-mint" cx="180" cy="72" r="15" />
          <rect className="use-svg-paper-fill" height="8" rx="4" width="42" x="159" y="96" />
          <MiniQr size={47} x={157} y={112} />
          <circle className="use-svg-panel" cx="103" cy="79" r="25" />
          <path className="use-svg-mint" d="M103 91c-16-9-19-20-10-25 6-3 10 1 10 5 1-4 5-8 11-5 9 5 5 16-11 25Z" />
          <circle className="use-svg-panel" cx="257" cy="126" r="25" />
          <path className="use-svg-accent-line" d="M247 125h20m-10-10v20" />
        </>
      ) : null}

      {kind === "payments" ? (
        <>
          <rect className="use-svg-card" height="120" rx="18" width="206" x="78" y="53" />
          <rect className="use-svg-dark" height="28" rx="14" width="206" x="78" y="53" />
          <MiniQr size={66} x={96} y={91} />
          <rect className="use-svg-muted" height="9" rx="4.5" width="73" x="184" y="101" />
          <rect className="use-svg-mint" height="28" rx="9" width="76" x="184" y="124" />
          <path className="use-svg-dark-stroke" d="M207 138h30" />
          <circle className="use-svg-mint-soft" cx="66" cy="146" r="27" />
          <text className="use-svg-currency" x="57" y="154">$</text>
          <path className="use-svg-accent-line" d="M284 93h17m-8-8 8 8-8 8" />
        </>
      ) : null}

      {kind === "files" ? (
        <>
          <path className="use-svg-muted-file" d="M91 55h118l37 37v84H91V55Z" />
          <path className="use-svg-card" d="M113 38h118l37 37v101H113V38Z" />
          <path className="use-svg-mint-soft" d="M231 38v37h37" />
          <rect className="use-svg-dark" height="10" rx="5" width="71" x="137" y="76" />
          <rect className="use-svg-muted" height="8" rx="4" width="83" x="137" y="98" />
          <rect className="use-svg-muted" height="8" rx="4" width="56" x="137" y="116" />
          <MiniQr size={49} x={199} y={116} />
          <circle className="use-svg-dark" cx="100" cy="163" r="25" />
          <path className="use-svg-download" d="M100 150v17m0 0-7-7m7 7 7-7m-15 13h16" />
        </>
      ) : null}
    </svg>
  );
}

export function UseCaseGallery() {
  return (
    <section className="section use-case-section" id="formats">
      <Container className="use-case-container">
        <div className="use-case-heading">
          <p className="eyebrow">Built for everyday moments</p>
          <h2>One QR toolkit, made for the ways you share</h2>
          <p>
            Choose a practical starting point, then tailor the content and design
            inside the same free Qraftt workspace.
          </p>
        </div>
        <div className="use-case-grid">
          {useCases.map(({ description, href, kind, title }) => (
            <Link className="use-case-card" href={href} key={kind}>
              <div className="use-case-artwork">
                <UseCaseArtwork kind={kind} />
              </div>
              <div className="use-case-copy">
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <span aria-hidden="true" className="use-case-arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
