import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  normalizeAdSenseClientId,
  normalizeAdSenseSlotId,
  normalizeGoogleAnalyticsId,
} from "../lib/integrations.ts";

test("accepts only supported Google integration identifiers", () => {
  assert.equal(normalizeGoogleAnalyticsId(" g-ab12cd34 "), "G-AB12CD34");
  assert.equal(normalizeGoogleAnalyticsId("UA-123-4"), null);
  assert.equal(normalizeGoogleAnalyticsId("G-ABC<script>"), null);

  assert.equal(
    normalizeAdSenseClientId(" CA-PUB-1234567890123456 "),
    "ca-pub-1234567890123456",
  );
  assert.equal(normalizeAdSenseClientId("pub-123456"), null);
  assert.equal(normalizeAdSenseClientId("ca-pub-not-a-number"), null);

  assert.equal(normalizeAdSenseSlotId(" 1234567890 "), "1234567890");
  assert.equal(normalizeAdSenseSlotId("slot-123"), null);
});

test("mounts Vercel Web Analytics once in the root layout", async () => {
  const [layoutSource, packageSource] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  const packageJson = JSON.parse(packageSource) as {
    dependencies?: Record<string, string>;
  };

  assert.match(
    layoutSource,
    /import \{ Analytics \} from "@vercel\/analytics\/next";/,
  );
  assert.equal(layoutSource.match(/<Analytics \/>/g)?.length, 1);
  assert.match(packageJson.dependencies?.["@vercel/analytics"] ?? "", /^\^2\./);
});

test("loads one global GA4 tag with Consent Mode defaults before it runs", async () => {
  const [layoutSource, consentProviderSource] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../components/privacy/consent-provider.tsx", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(layoutSource, /id="qraft-google-consent-default"/);
  assert.match(layoutSource, /analytics_storage: 'denied'/);
  assert.match(layoutSource, /ad_storage: 'denied'/);
  assert.match(layoutSource, /ad_user_data: 'denied'/);
  assert.match(layoutSource, /ad_personalization: 'denied'/);
  assert.equal(layoutSource.match(/id="qraft-google-analytics"/g)?.length, 1);
  assert.doesNotMatch(consentProviderSource, /qraft-google-analytics/);
  assert.match(consentProviderSource, /updateGoogleConsent\(choice\)/);
});
