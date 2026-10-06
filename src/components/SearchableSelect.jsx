import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

/**
 * Small searchable dropdown - a button showing the current selection that
 * opens a panel with a search box and a filtered, clickable option list.
 * `value === ""` means "no filter" and renders as `allLabel`; any other
 * value should match one of `options`' `value`s (callers can use whatever
 * sentinel they like for special entries, e.g. "Sans Table").
 */
const SearchableSelect = ({ value, onChange, options, allLabel = "Tous", placeholder = "Rechercher..." }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase()),
  );

  const currentLabel = value === "" ? allLabel : options.find((o) => o.value === value)?.label || allLabel;

  const select = (v) => {
    onChange(v);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-between gap-2 min-w-[11rem] rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
          value
            ? "border-chocolate text-chocolate bg-chocolate/5"
            : "border-beige-dark text-secondary/70 bg-cream hover:border-chocolate/50"
        }`}
      >
        <span className="truncate">{currentLabel}</span>
        <ChevronDown className="w-4 h-4 shrink-0" />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-64 bg-cream rounded-xl shadow-xl border border-beige-dark/60 overflow-hidden">
          <div className="relative p-2 border-b border-beige-dark/60">
            <Search className="w-4 h-4 text-secondary/40 absolute left-5 top-1/2 -translate-y-1/2" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-lg border border-beige-dark bg-beige/40 pl-8 pr-3 py-1.5 text-sm text-secondary outline-none focus:border-chocolate"
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            <button
              type="button"
              onClick={() => select("")}
              className={`w-full flex items-center justify-between gap-2 px-4 py-2 text-sm text-left hover:bg-beige ${
                value === "" ? "text-chocolate font-semibold" : "text-secondary"
              }`}
            >
              {allLabel}
              {value === "" && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
            {filteredOptions.map((o) => (
              <button
                type="button"
                key={o.value}
                onClick={() => select(o.value)}
                className={`w-full flex items-center justify-between gap-2 px-4 py-2 text-sm text-left hover:bg-beige ${
                  value === o.value ? "text-chocolate font-semibold" : "text-secondary"
                }`}
              >
                <span className="truncate">{o.label}</span>
                {value === o.value && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <p className="px-4 py-3 text-xs text-secondary/50 text-center">Aucun résultat</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
