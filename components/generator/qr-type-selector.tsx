"use client";

import { useMemo, useState } from "react";
import { QrTypeIcon } from "@/components/generator/qr-type-icon";
import {
  qrTypeCategoryOrder,
  qrTypeOptions,
  type QrTypeOption,
} from "@/lib/qr/config";
import type { QrType } from "@/lib/qr/types";

interface QrTypeSelectorProps {
  onSelect: (type: QrType) => void;
  selectedType: QrType;
}

const brandTypes = new Set<QrType>([
  "whatsapp",
  "instagram",
  "youtube",
  "facebook",
  "telegram",
  "tiktok",
  "spotify",
  "discord",
  "reddit",
  "snapchat",
]);

function matchesSearch(option: QrTypeOption, search: string) {
  const terms = [
    option.label,
    option.value,
    option.category,
    ...(option.keywords ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return terms.includes(search);
}

export function QrTypeSelector({
  onSelect,
  selectedType,
}: QrTypeSelectorProps) {
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const visibleOptions = useMemo(
    () =>
      search
        ? qrTypeOptions.filter((option) => matchesSearch(option, search))
        : qrTypeOptions,
    [search],
  );
  const visibleValues = new Set(visibleOptions.map((option) => option.value));
  const fallbackFocusType = visibleOptions[0]?.value;
  const selectedOption = qrTypeOptions.find(
    (option) => option.value === selectedType,
  );

  function handleTabKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentType: QrType,
  ) {
    const currentIndex = visibleOptions.findIndex(
      (option) => option.value === currentType,
    );
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % visibleOptions.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex =
        (currentIndex - 1 + visibleOptions.length) % visibleOptions.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = visibleOptions.length - 1;
    }

    if (nextIndex === null || !visibleOptions[nextIndex]) return;
    event.preventDefault();
    const nextType = visibleOptions[nextIndex].value;
    onSelect(nextType);
    document.getElementById(`generator-tab-${nextType}`)?.focus();
  }

  return (
    <div className="qr-type-selector">
      <div className="qr-type-search">
        <label htmlFor="qr-type-search">Find a QR type</label>
        <div className="qr-type-search-field">
          <span aria-hidden="true">⌕</span>
          <input
            autoComplete="off"
            id="qr-type-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search URL, social, PDF…"
            type="search"
            value={query}
          />
        </div>
        <span aria-live="polite" className="qr-type-result-count">
          {visibleOptions.length} {visibleOptions.length === 1 ? "type" : "types"}
        </span>
      </div>

      <div
        aria-label="QR code type"
        aria-orientation="horizontal"
        className="qr-type-tablist"
        role="tablist"
      >
        {!visibleValues.has(selectedType) ? (
          <span className="visually-hidden" id={`generator-tab-${selectedType}`}>
            Selected QR type: {selectedOption?.label ?? selectedType}
          </span>
        ) : null}
        {qrTypeCategoryOrder.map((category) => {
          const options = visibleOptions.filter(
            (option) => option.category === category,
          );
          if (!options.length) return null;

          return (
            <section
              className={
                category === "Popular"
                  ? "qr-type-category is-popular"
                  : "qr-type-category"
              }
              key={category}
              role="presentation"
            >
              <div className="qr-type-category-heading">
                <h3>{category}</h3>
                {category === "Popular" && !search ? <span>Most used</span> : null}
              </div>
              <div className="qr-type-grid">
                {options.map((option) => {
                  const selected = selectedType === option.value;
                  const focusable = selected
                    ? true
                    : !visibleValues.has(selectedType) &&
                      fallbackFocusType === option.value;

                  return (
                    <button
                      aria-controls="generator-fields-panel"
                      aria-selected={selected}
                      className={selected ? "is-selected" : undefined}
                      id={`generator-tab-${option.value}`}
                      key={option.value}
                      onClick={() => onSelect(option.value)}
                      onKeyDown={(event) =>
                        handleTabKeyDown(event, option.value)
                      }
                      role="tab"
                      tabIndex={focusable ? 0 : -1}
                      type="button"
                    >
                      <span
                        className={
                          brandTypes.has(option.value)
                            ? `qr-type-icon-wrap is-brand qr-type-brand-${option.value}`
                            : "qr-type-icon-wrap"
                        }
                      >
                        <QrTypeIcon type={option.value} />
                      </span>
                      <span aria-hidden="true" className="qr-type-card-action">
                        →
                      </span>
                      <span className="qr-type-card-copy">
                        <span className="qr-type-card-label">{option.label}</span>
                        <span className="qr-type-card-meta">
                          {selected
                            ? "Selected"
                            : category === "Popular"
                              ? "Popular format"
                              : "QR format"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {!visibleOptions.length ? (
        <p className="qr-type-empty">
          No QR types match “{query.trim()}”. Try a format such as URL, PDF, or
          social.
        </p>
      ) : null}
    </div>
  );
}
