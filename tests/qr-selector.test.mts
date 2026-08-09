import assert from "node:assert/strict";
import test from "node:test";
import {
  qrTypeCategoryOrder,
  qrTypeOptions,
} from "../lib/qr/config.ts";

test("groups every QR type once with the priority types first", () => {
  assert.equal(qrTypeOptions.length, 32);
  assert.equal(
    new Set(qrTypeOptions.map((option) => option.value)).size,
    qrTypeOptions.length,
  );

  for (const category of qrTypeCategoryOrder) {
    assert.ok(
      qrTypeOptions.some((option) => option.category === category),
      `${category} should contain at least one QR type`,
    );
  }

  assert.deepEqual(
    qrTypeOptions
      .filter((option) => option.category === "Popular")
      .map((option) => option.value),
    [
      "url",
      "wifi",
      "whatsapp",
      "google-review",
      "menu",
      "pdf-link",
      "instagram",
      "vcard",
    ],
  );
  assert.ok(qrTypeOptions.every((option) => option.label.length <= 16));
});
