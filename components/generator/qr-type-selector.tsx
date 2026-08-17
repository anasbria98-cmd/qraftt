"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QrTypeIcon } from "@/components/generator/qr-type-icon";
import {
  featuredQrTypes,
  qrTypeCategoryOrder,
  qrTypeOptions,
  type QrTypeOption,
} from "@/lib/qr/config";
import type { QrType } from "@/lib/qr/types";

interface QrTypeSelectorProps {
  onSelect: (type: QrType) => void;
  selectedType: QrType;
  showSelectedSummary?: boolean;
}

const brandTypes = new Set<QrType>([
  "whatsapp",
  "google-review",
  "instagram",
  "youtube",
  "facebook",
  "telegram",
  "tiktok",
  "linkedin",
  "spotify",
  "discord",
  "snapchat",
  "google-docs",
  "google-forms",
  "amazon",
  "app-store",
  "paypal",
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

function iconClass(type: QrType) {
  return brandTypes.has(type)
    ? `qr-type-icon-wrap is-brand qr-type-brand-${type}`
    : "qr-type-icon-wrap";
}

export function QrTypeSelector({
  onSelect,
  selectedType,
  showSelectedSummary = true,
}: QrTypeSelectorProps) {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const viewAllButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const search = query.trim().toLowerCase();
  const visibleOptions = useMemo(
    () =>
      search
        ? qrTypeOptions.filter((option) => matchesSearch(option, search))
        : qrTypeOptions,
    [search],
  );
  const featuredOptions = useMemo(
    () =>
      featuredQrTypes
        .map((type) => qrTypeOptions.find((option) => option.value === type))
        .filter((option): option is QrTypeOption => Boolean(option)),
    [],
  );
  const visibleValues = new Set(visibleOptions.map((option) => option.value));
  const fallbackFocusType = visibleOptions[0]?.value;
  const selectedOption = qrTypeOptions.find(
    (option) => option.value === selectedType,
  );

  useEffect(() => {
    if (!catalogOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => searchInputRef.current?.focus());

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCatalogOpen(false);
        window.requestAnimationFrame(() => viewAllButtonRef.current?.focus());
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [catalogOpen]);

  function closeCatalog(focusTarget: "generator" | "trigger") {
    setCatalogOpen(false);
    window.requestAnimationFrame(() => {
      if (focusTarget === "generator") {
        document.getElementById("generator-fields-panel")?.focus();
      } else {
        viewAllButtonRef.current?.focus();
      }
    });
  }

  function selectFromCatalog(type: QrType) {
    onSelect(type);
    setQuery("");
    closeCatalog("generator");
  }

  function handleCatalogKeyDown(
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
    document
      .getElementById(`catalog-qr-type-${visibleOptions[nextIndex].value}`)
      ?.focus();
  }

  return (
    <div className="qr-type-selector">
      <span className="visually-hidden" id="generator-selected-type-label">
        {selectedOption?.label ?? selectedType} QR code content
      </span>

      {showSelectedSummary ? (
        <div aria-live="polite" className="selected-qr-type">
          <span className={iconClass(selectedType)}>
            <QrTypeIcon type={selectedType} />
          </span>
          <div>
            <span>Selected QR type</span>
            <strong>{selectedOption?.label ?? selectedType}</strong>
            <small>{selectedOption?.category ?? "QR format"}</small>
          </div>
        </div>
      ) : null}

      <section className="popular-type-panel" aria-labelledby="popular-types-heading">
        <div className="popular-type-heading">
          <div>
            <p>Start creating</p>
            <h2 id="popular-types-heading">Popular QR types</h2>
          </div>
          <span>{selectedOption?.label ?? selectedType} selected</span>
        </div>
        <div className="popular-type-scroll">
          {featuredOptions.map((option) => {
            const selected = selectedType === option.value;
            return (
              <button
                aria-controls="generator-fields-panel"
                aria-pressed={selected}
                className={selected ? "popular-type-card is-selected" : "popular-type-card"}
                key={option.value}
                onClick={() => onSelect(option.value)}
                type="button"
              >
                <span className={iconClass(option.value)}>
                  <QrTypeIcon type={option.value} />
                </span>
                <span>{option.label}</span>
              </button>
            );
          })}
          <button
            aria-expanded={catalogOpen}
            aria-haspopup="dialog"
            className="popular-type-card view-all-types-button"
            onClick={() => setCatalogOpen(true)}
            ref={viewAllButtonRef}
            type="button"
          >
            <span aria-hidden="true" className="view-all-icon">+</span>
            <span>View All</span>
          </button>
        </div>
      </section>

      {catalogOpen ? (
        <div
          className="qr-type-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeCatalog("trigger");
          }}
        >
          <div
            aria-labelledby="all-qr-types-title"
            aria-modal="true"
            className="qr-type-modal"
            ref={dialogRef}
            role="dialog"
          >
            <div className="qr-type-modal-heading">
              <div>
                <p>Choose a format</p>
                <h2 id="all-qr-types-title">All 30 QR types</h2>
              </div>
              <button
                aria-label="Close QR type catalog"
                className="qr-type-modal-close"
                onClick={() => closeCatalog("trigger")}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="qr-type-catalog" id="qr-type-catalog">
              <div className="qr-type-search">
                <label htmlFor="qr-type-search">Find a QR type</label>
                <div className="qr-type-search-field">
                  <span aria-hidden="true">⌕</span>
                  <input
                    autoComplete="off"
                    id="qr-type-search"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search URL, social, PDF…"
                    ref={searchInputRef}
                    type="search"
                    value={query}
                  />
                </div>
                <span aria-live="polite" className="qr-type-result-count">
                  {visibleOptions.length}{" "}
                  {visibleOptions.length === 1 ? "type" : "types"}
                </span>
              </div>

              <div
                aria-label="All QR code types"
                aria-orientation="horizontal"
                className="qr-type-tablist"
                role="tablist"
              >
                {qrTypeCategoryOrder.map((category) => {
                  const options = visibleOptions.filter(
                    (option) => option.category === category,
                  );
                  if (!options.length) return null;

                  return (
                    <section className="qr-type-category" key={category} role="presentation">
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
                              id={`catalog-qr-type-${option.value}`}
                              key={option.value}
                              onClick={() => selectFromCatalog(option.value)}
                              onKeyDown={(event) =>
                                handleCatalogKeyDown(event, option.value)
                              }
                              role="tab"
                              tabIndex={focusable ? 0 : -1}
                              type="button"
                            >
                              <span className={iconClass(option.value)}>
                                <QrTypeIcon type={option.value} />
                              </span>
                              <span aria-hidden="true" className="qr-type-card-action">
                                →
                              </span>
                              <span className="qr-type-card-copy">
                                <span className="qr-type-card-label">{option.label}</span>
                                <span className="qr-type-card-meta">
                                  {selected ? "Selected" : "QR format"}
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
                  No QR types match “{query.trim()}”. Try URL, PDF, or social.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
