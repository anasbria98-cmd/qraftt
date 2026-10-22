export type BillingPeriod = "monthly" | "yearly";
export type PlanId = "free" | "pro";
export type BenefitValue = string | boolean;

export const pricingBenefits = [
  { id: "types", label: "All 30 QR content types" },
  { id: "preview", label: "Live preview" },
  { id: "basic", label: "Black-and-white QR" },
  { id: "png", label: "PNG export" },
  { id: "downloads", label: "Downloads" },
  { id: "logo", label: "Add your logo" },
  { id: "colors", label: "Custom colors & gradients" },
  { id: "styling", label: "Advanced styling & eyes" },
  { id: "frames", label: "Frames" },
  { id: "patterns", label: "Patterns & shapes" },
  { id: "templates", label: "Templates" },
  { id: "svg", label: "SVG export" },
  { id: "resolution", label: "Export resolution" },
] as const;

type BenefitId = (typeof pricingBenefits)[number]["id"];

interface PricingPlan {
  id: PlanId;
  name: string;
  description: string;
  recommended: boolean;
  prices: Record<BillingPeriod, number>;
  benefits: Record<BenefitId, BenefitValue>;
  // Future server checkout should map these keys to allowlisted PayPal plan IDs.
  checkout: { provider: "paypal"; enabled: boolean; planKey: "pro" } | null;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "free", name: "Free", description: "For everyday sharing.", recommended: false,
    prices: { monthly: 0, yearly: 0 }, checkout: null,
    benefits: {
      types: true, preview: true, basic: true, png: true, downloads: "3 PNG downloads / day",
      logo: false, colors: false, styling: false, frames: false, patterns: false,
      templates: "20 original templates", svg: false, resolution: "512 × 512",
    },
  },
  {
    id: "pro", name: "Pro", description: "For growing projects.", recommended: true,
    prices: { monthly: 2, yearly: 19.99 },
    checkout: { provider: "paypal", enabled: true, planKey: "pro" },
    benefits: {
      types: true, preview: true, basic: true, png: true, downloads: "Unlimited",
      logo: true, colors: true, styling: true, frames: "30 frames", patterns: true,
      templates: "20 original + 10 Pro templates", svg: true, resolution: "Up to 2000 × 2000",
    },
  },
];

// Display-only override; the saved production prices above never change.
export function pricingDisplayAmount(plan: PricingPlan, period: BillingPeriod, localSandboxTest: boolean) {
  return localSandboxTest && plan.id === "pro" && period === "monthly" ? 1 : plan.prices[period];
}
