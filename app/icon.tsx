import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#fbfaf6",
          borderRadius: 15,
          color: "#073f33",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <svg height="50" viewBox="0 0 48 48" width="50">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4">
            <path d="M4 18V8a4 4 0 0 1 4-4h10" />
            <path d="M30 4h10a4 4 0 0 1 4 4v10" />
            <path d="M44 30v10a4 4 0 0 1-4 4H30" stroke="#63c7a0" />
            <path d="M18 44H8a4 4 0 0 1-4-4V30" stroke="#63c7a0" />
          </g>
          <rect fill="#073f33" height="9" rx="2" width="9" x="13" y="13" />
          <rect fill="#073f33" height="9" rx="2" width="9" x="27" y="13" />
          <rect fill="#63c7a0" height="9" rx="2" width="9" x="13" y="27" />
          <rect fill="#63c7a0" height="9" rx="2" width="9" x="27" y="27" />
        </svg>
      </div>
    ),
    size,
  );
}
