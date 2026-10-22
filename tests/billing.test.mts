import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BillingStore } from "../lib/billing/store.ts";
import { freeDesign, validateExportAccess, validatedDesign } from "../lib/qr/access.ts";

test("customer sessions persist independently of frontend entitlement state", async () => {
  const store = new BillingStore(":memory:");
  try {
    const customer = await store.createCustomer();
    assert.equal(await store.findCustomer(customer.token), customer.id);
    assert.equal(await store.findCustomer("f".repeat(64)), null);
    assert.equal((await store.entitlement(customer.id)).pro, false);
    await store.saveSubscription("I-TEST", customer.id, "P-TEST", "monthly", "APPROVAL_PENDING");
    assert.equal((await store.entitlement(customer.id)).pro, false);
    await store.updateSubscription("I-TEST", "ACTIVE");
    assert.equal((await store.entitlement(customer.id)).pro, true);
    for (const state of ["CANCELLED", "SUSPENDED", "EXPIRED", "PAYMENT_FAILED"]) {
      await store.updateSubscription("I-TEST", state);
      assert.equal((await store.entitlement(customer.id)).pro, false);
    }
  } finally { store.db.close(); }
});

test("download quota is atomic under concurrent requests", async () => {
  const store = new BillingStore(":memory:");
  try {
    const customer = await store.createCustomer();
    const results = await Promise.all(Array.from({ length: 8 }, () => store.consumeFreeDownload(customer.id)));
    assert.equal(results.filter(Boolean).length, 3);
    assert.equal((await store.entitlement(customer.id)).remaining, 0);
  } finally { store.db.close(); }
});

test("Pro identity and state survive a database restart", async () => {
  const directory = await mkdtemp(join(tmpdir(), "qraftt-billing-test-"));
  const url = `file:${join(directory, "test.db")}`;
  const first = new BillingStore(url);
  const customer = await first.createCustomer();
  await first.saveSubscription("I-TEST", customer.id, "P-TEST", "yearly", "APPROVAL_PENDING");
  await first.updateSubscription("I-TEST", "ACTIVE");
  first.db.close();
  const reopened = new BillingStore(url);
  try {
    assert.equal(await reopened.findCustomer(customer.token), customer.id);
    assert.equal((await reopened.entitlement(customer.id)).pro, true);
  } finally {
    reopened.db.close();
    await rm(directory, { recursive: true });
  }
});

test("webhook retries and older events cannot restore a revoked entitlement", async () => {
  const store = new BillingStore(":memory:");
  try {
    const { id } = await store.createCustomer();
    await store.saveSubscription("I-TEST", id, "P-TEST", "yearly", "APPROVAL_PENDING");
    await store.updateSubscription("I-TEST", "ACTIVE", undefined, { id: "WH-1", time: "2026-10-12T12:00:00Z" });
    await store.updateSubscription("I-TEST", "CANCELLED", undefined, { id: "WH-2", time: "2026-10-12T13:00:00Z" });
    await store.updateSubscription("I-TEST", "ACTIVE", undefined, { id: "WH-1", time: "2026-10-12T12:00:00Z" });
    await store.updateSubscription("I-TEST", "ACTIVE", undefined, { id: "WH-3", time: "2026-10-12T11:00:00Z" });
    assert.equal((await store.entitlement(id)).pro, false);
  } finally { store.db.close(); }
});

test("server rejects premium export requests from Free users and unsafe logos", () => {
  assert.doesNotThrow(() => validateExportAccess(false, freeDesign, "png", 512));
  assert.throws(() => validateExportAccess(false, freeDesign, "svg", 512), /Unlock Pro/);
  assert.throws(() => validateExportAccess(false, freeDesign, "png", 2000), /Unlock Pro/);
  assert.throws(() => validateExportAccess(false, { ...freeDesign, foreground: "#ff0000" }, "png", 512), /Unlock Pro/);
  assert.doesNotThrow(() => validateExportAccess(true, { ...freeDesign, foreground: "#ff0000" }, "svg", 2000));
  assert.throws(() => validatedDesign({ logoDataUrl: "https://internal.local/secret" }), /Invalid logo/);
  assert.throws(() => validatedDesign({ foreground: '"><script>' }), /Invalid color/);
});
