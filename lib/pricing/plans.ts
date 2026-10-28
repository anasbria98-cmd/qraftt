export type BillingPeriod = "monthly" | "yearly";
export type PlanId = "free";
export type BenefitValue = string | boolean;

export const pricingBenefits = [
  { id: "types", label: "All 30 QR content types" },
  { id: "preview", label: "Live preview" },
  { id: "basic", label: "Black-and-white QR" },
  { id: "png", label: "PNG export" },
  { id: "jpg", label: "JPG export" },
  { id: "downloads", label: "Downloads" },
  { id: "logo", label: "Add your logo" },
  { id: "colors", label: "Custom colors & gradients" },
  { id: "styling", label: "Advanced styling & eyes" },
  { id: "frames", label: "Frames" },
  { id: "patterns", label: "Patterns & shapes" },
  { id: "templates", label: "Templates" },
  { id: "svg", label: "SVG export" },
  { id: "pdf", label: "Printable PDF export" },
  { id: "eps", label: "Vector EPS export" },
  { id: "resolution", label: "Export resolution" },
  { id: "saved", label: "Saved QR codes" },
  { id: "storage", label: "Dashboard storage" },
] as const;

type BenefitId = (typeof pricingBenefits)[number]["id"];

interface PricingPlan {
  id: PlanId;
  name: string;
  description: string;
  recommended: boolean;
  prices: Record<BillingPeriod, number>;
  benefits: Record<BenefitId, BenefitValue>;
  checkout: null;
}

export const pricingPlans: PricingPlan[] = [{
  id: "free", name: "Free", description: "Every QR tool, free for everyone.", recommended: false,
  prices: { monthly: 0, yearly: 0 }, checkout: null,
  benefits: { types: true, preview: true, basic: true, png: true, jpg: true, downloads: "Unlimited", logo: true, colors: true, styling: true, frames: "All frames", patterns: true, templates: "All templates", svg: true, pdf: true, eps: true, resolution: "Up to 2000 × 2000", saved: "100 QR codes", storage: "250 MB" },
}];
export function planBenefits(plan: PricingPlan, period: BillingPeriod) { void period; return plan.benefits; }
export function pricingDisplayAmount(plan: PricingPlan, period: BillingPeriod, historicalTest: boolean) { void historicalTest; return plan.prices[period]; }
