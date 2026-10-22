// Local visual fixtures only. No auth bypass, app route, API, credentials or database access.
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { componentFixture } from "../tests/helpers/render-component.mjs";
const { DashboardShell } = componentFixture("components/account/dashboard-shell.tsx");
const { SubscriptionCard } = componentFixture("components/account/subscription-card.tsx");
const { StorageCard } = componentFixture("components/account/storage-card.tsx");
const { BillingPlans } = componentFixture("components/account/billing-plans.tsx");
const root = new URL("../", import.meta.url);
const styles = readFileSync(new URL("components/account/dashboard.module.css", root), "utf8").replace(/:global\(([^)]+)\)/g, "$1");
const globalStyles = readFileSync(new URL("app/globals.css", root), "utf8").replace(/@import[^;]+;/g, "").replace(/@theme inline\s*\{[^}]*\}/g, "");
createServer((request, response) => {
  if (["/mobile-free", "/mobile-pro", "/tablet", "/mobile-login"].includes(request.url)) {
    const width = request.url === "/tablet" ? 820 : 390;
    const path = request.url === "/mobile-login" ? "http://localhost:3000/login" : request.url === "/mobile-free" ? "/free" : "/pro";
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(`<!doctype html><html><head><meta charset="utf-8"><title>Responsive visual fixture</title></head><body style="margin:0;background:#e5ebe7;padding:20px"><iframe title="${width}px responsive dashboard fixture" src="${path}" style="width:${width}px;height:850px;border:0;background:white"></iframe></body></html>`);
    return;
  }
  if (!["/free", "/pro"].includes(request.url) || request.method !== "GET") { response.writeHead(404); response.end(); return; }
  const pro = request.url === "/pro";
  const account = { access: { pro, status: pro ? "ACTIVE" : "FREE", remaining: 3 }, subscription: pro ? { id: "I-VISUAL-FIXTURE", billing_interval: "monthly", current_period_end: null } : null };
  const h = React.createElement;
  const content = h(DashboardShell, { email: "visual-fixture@example.test", pro },
    h("div", { className: "pageHeading" }, h("p", { className: "eyebrow" }, "Local visual test · not account data"), h("h1", null, "Payment & Subscription"), h("p", null, "See your membership, explore your options, and keep billing in view.")),
    h(SubscriptionCard, account), h(StorageCard), h(BillingPlans, { pro }),
    h("section", { className: "card" }, h("h2", null, "Payment history"), h("div", { className: "empty" }, h("h3", null, "No payment records to display"), h("p", null, "Visual fixture only. No payment or account has been created."))));
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
  response.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Local dashboard visual fixture</title><style>${globalStyles}\n${styles}</style></head><body>${renderToStaticMarkup(content)}</body></html>`);
}).listen(4318, "127.0.0.1", () => console.log("Render-only dashboard fixtures: http://127.0.0.1:4318/free and /pro"));
