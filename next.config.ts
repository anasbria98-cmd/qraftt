import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // PDFKit resolves font metrics and its color profile from disk at runtime.
  // Keep its native paths intact and include those assets in serverless traces.
  serverExternalPackages: ["pdfkit", "svg-to-pdfkit"],
  outputFileTracingIncludes: {
    "/api/qr/render": ["./node_modules/pdfkit/js/data/**/*", "./public/images/free-frames/*.png"],
  },
};

export default nextConfig;
