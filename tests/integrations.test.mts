import assert from "node:assert/strict";
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
