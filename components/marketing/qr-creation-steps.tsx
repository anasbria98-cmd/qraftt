import { Container } from "@/components/ui/container";

const qrModules = [
  [3, 0], [5, 0], [3, 1], [4, 1], [6, 1], [0, 3], [2, 3], [4, 3], [5, 3],
  [1, 4], [3, 4], [6, 4], [0, 5], [2, 5], [4, 5], [5, 5], [1, 6], [3, 6],
  [5, 6], [6, 6],
] as const;

function QrGlyph({ scale = 1, x, y }: { scale?: number; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect className="step-svg-qr-bg" height="70" rx="7" width="70" />
      {[
        [6, 6],
        [46, 6],
        [6, 46],
      ].map(([finderX, finderY]) => (
        <g key={`${finderX}-${finderY}`}>
          <rect
            className="step-svg-dark"
            height="18"
            rx="3"
            width="18"
            x={finderX}
            y={finderY}
          />
          <rect
            className="step-svg-qr-bg"
            height="10"
            rx="1.5"
            width="10"
            x={finderX + 4}
            y={finderY + 4}
          />
          <rect
            className="step-svg-mint-strong"
            height="5"
            rx="1"
            width="5"
            x={finderX + 6.5}
            y={finderY + 6.5}
          />
        </g>
      ))}
      {qrModules.map(([column, row], index) => (
        <rect
          className={index % 4 === 0 ? "step-svg-mint-strong" : "step-svg-dark"}
          height="5"
          key={`${column}-${row}`}
          rx="1"
          width="5"
          x={7 + column * 8}
          y={7 + row * 8}
        />
      ))}
    </g>
  );
}

function ChooseTypeIllustration() {
  return (
    <svg aria-hidden="true" viewBox="0 0 360 220">
      <rect className="step-svg-panel" height="176" rx="18" width="300" x="30" y="22" />
      <path className="step-svg-line" d="M30 53h300" />
      <circle className="step-svg-mint" cx="48" cy="38" r="4" />
      <circle className="step-svg-soft" cx="61" cy="38" r="4" />
      <circle className="step-svg-soft" cx="74" cy="38" r="4" />
      <rect className="step-svg-soft" height="9" rx="4.5" width="62" x="90" y="34" />
      {[
        [48, 70, "link"],
        [118, 70, "wifi"],
        [188, 70, "chat"],
        [258, 70, "file"],
        [48, 132, "image"],
        [118, 132, "text"],
        [188, 132, "social"],
        [258, 132, "form"],
      ].map(([x, y, type], index) => (
        <g key={String(type)}>
          <rect
            className={index === 1 ? "step-svg-selected" : "step-svg-card"}
            height="50"
            rx="10"
            width="54"
            x={Number(x)}
            y={Number(y)}
          />
          <rect
            className={index === 1 ? "step-svg-dark" : "step-svg-mint"}
            height="17"
            rx="5"
            width="17"
            x={Number(x) + 8}
            y={Number(y) + 8}
          />
          <rect className="step-svg-soft" height="5" rx="2.5" width="28" x={Number(x) + 8} y={Number(y) + 32} />
        </g>
      ))}
      <path className="step-svg-accent-line" d="M137 76v-8h8M145 113h-8v-8" />
      <circle className="step-svg-dark" cx="165" cy="118" r="8" />
      <path className="step-svg-pointer" d="m160 111 3 15 4-5 6 2-13-12Z" />
    </svg>
  );
}

function AddContentIllustration() {
  return (
    <svg aria-hidden="true" viewBox="0 0 360 220">
      <rect className="step-svg-panel" height="176" rx="18" width="300" x="30" y="22" />
      <path className="step-svg-line" d="M30 53h300" />
      <circle className="step-svg-mint" cx="48" cy="38" r="4" />
      <circle className="step-svg-soft" cx="61" cy="38" r="4" />
      <circle className="step-svg-soft" cx="74" cy="38" r="4" />
      <rect className="step-svg-soft" height="8" rx="4" width="80" x="48" y="70" />
      <rect className="step-svg-input" height="38" rx="9" width="184" x="48" y="86" />
      <circle className="step-svg-mint" cx="64" cy="105" r="6" />
      <path className="step-svg-accent-line" d="M61 105h6M64 102v6" />
      <text className="step-svg-text" x="78" y="109">https://qraftt.com</text>
      <rect className="step-svg-dark" height="34" rx="9" width="92" x="48" y="137" />
      <text className="step-svg-button-text" x="75" y="158">Generate</text>
      <path className="step-svg-accent-line" d="M150 154h31m0 0-8-7m8 7-8 7" />
      <circle className="step-svg-progress" cx="254" cy="120" r="47" />
      <path className="step-svg-progress-active" d="M254 73a47 47 0 0 1 45 34" />
      <QrGlyph scale={0.72} x={229} y={95} />
      <path className="step-svg-accent-line" d="M282 73h10v10M226 166h-10v-10" />
    </svg>
  );
}

function CustomizeIllustration() {
  return (
    <svg aria-hidden="true" viewBox="0 0 360 220">
      <rect className="step-svg-panel" height="176" rx="18" width="300" x="30" y="22" />
      <path className="step-svg-line" d="M30 53h300" />
      <circle className="step-svg-mint" cx="48" cy="38" r="4" />
      <circle className="step-svg-soft" cx="61" cy="38" r="4" />
      <circle className="step-svg-soft" cx="74" cy="38" r="4" />
      <rect className="step-svg-soft" height="8" rx="4" width="66" x="48" y="72" />
      <circle className="step-svg-dark" cx="57" cy="99" r="9" />
      <circle className="step-svg-mint-strong" cx="82" cy="99" r="9" />
      <circle className="step-svg-mint" cx="107" cy="99" r="9" />
      <path className="step-svg-line" d="M48 128h78" />
      <circle className="step-svg-dark" cx="92" cy="128" r="7" />
      <rect className="step-svg-card" height="36" rx="9" width="78" x="48" y="146" />
      <path className="step-svg-accent-line" d="M62 158h11v11H62zM82 163h28" />
      <rect className="step-svg-frame" height="118" rx="18" width="132" x="168" y="68" />
      <rect className="step-svg-dark" height="19" rx="9.5" width="70" x="199" y="60" />
      <text className="step-svg-button-text" x="213" y="73">SCAN ME</text>
      <QrGlyph scale={1.15} x={194} y={88} />
      <circle className="step-svg-dark" cx="290" cy="177" r="22" />
      <path className="step-svg-download" d="M290 166v14m0 0-6-6m6 6 6-6m-13 12h14" />
    </svg>
  );
}

const steps = [
  { Illustration: ChooseTypeIllustration, label: "Step 1", title: "Choose Your QR Type" },
  { Illustration: AddContentIllustration, label: "Step 2", title: "Add Your Content" },
  { Illustration: CustomizeIllustration, label: "Step 3", title: "Customize & Download" },
] as const;

export function QrCreationSteps() {
  return (
    <section className="section qr-steps-section" id="how-it-works">
      <Container>
        <div className="qr-steps-heading">
          <p className="eyebrow">Simple from start to finish</p>
          <h2>Create Your QR Code in 3 Simple Steps</h2>
        </div>
        <ol className="qr-steps-grid">
          {steps.map(({ Illustration, label, title }) => (
            <li className="qr-step-card" key={label}>
              <div className="qr-step-illustration">
                <Illustration />
              </div>
              <div className="qr-step-copy">
                <span>{label}</span>
                <h3>{title}</h3>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
