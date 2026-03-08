import { useState, useMemo, useRef, useEffect } from "react";
import { specimens } from "@/data/butterflies";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

type SearchCategory = "all" | "species" | "families" | "habitats" | "patterns" | "colors" | "wingShapes";

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  activeCategory: SearchCategory;
  onCategoryChange: (cat: SearchCategory) => void;
  onCategoryBrowse?: (cat: SearchCategory) => void;
}

const SearchBar = ({ query, onQueryChange, activeCategory, onCategoryChange, onCategoryBrowse }: SearchBarProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLanguage();

  const total = useMemo(() => specimens.length, []);

    const total = specimens.length;
    return {
      all: total,
      species: total,
      families: total,
      habitats: total,
      patterns: total,
      colors: total,
      wingShapes: total,
    };
  }, []);

  const categories: { key: SearchCategory; label: string; count: number }[] = [
    { key: "all", label: t("search.everything"), count: counts.all },
    { key: "species", label: t("search.species"), count: counts.species },
    { key: "families", label: t("search.families"), count: counts.families },
    { key: "habitats", label: t("search.habitats"), count: counts.habitats },
    { key: "patterns", label: t("search.patterns"), count: counts.patterns },
    { key: "colors", label: t("search.colors"), count: counts.colors },
    { key: "wingShapes", label: t("search.wingShapes"), count: counts.wingShapes },
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeLabel = categories.find((c) => c.key === activeCategory)?.label ?? t("search.everything");

  const toggleLang = () => setLang(lang === "en" ? "de" : "en");

  return (
    <div className="w-[90%] mx-auto">
      {/* Search bar */}
      <div className="flex items-center bg-search-bar p-3 rounded-xl gap-3">
        {/* Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 bg-search-bar-btn text-primary-foreground px-5 py-3.5 rounded-lg font-body text-lg cursor-pointer border-none whitespace-nowrap hover:opacity-90 transition-opacity"
          >
            {activeLabel}
            <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute bottom-full left-0 mb-1 z-50 min-w-[220px] bg-card border border-border rounded-lg shadow-lg overflow-hidden">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => { onCategoryChange(cat.key); setDropdownOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left font-body text-sm transition-colors hover:bg-secondary ${
                    activeCategory === cat.key ? "bg-secondary text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="font-semibold">{cat.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t("search.placeholder")}
          className="flex-1 px-5 py-4 rounded-lg border-none font-body text-xl text-foreground bg-background outline-none placeholder:text-muted-foreground"
        />

        {/* Language toggle */}
        <button
          onClick={toggleLang}
          className="w-11 h-11 rounded-full bg-background border-2 border-search-bar flex items-center justify-center font-body font-bold text-sm text-foreground shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
        >
          {lang}
        </button>
      </div>

      {/* Categories row */}
      <div className="flex flex-wrap justify-between mt-3 gap-y-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              onCategoryChange(cat.key);
              if (cat.key !== "all" && onCategoryBrowse) {
                onCategoryBrowse(cat.key);
              }
            }}
            className={`mr-4 last:mr-0 font-body text-sm transition-colors cursor-pointer bg-transparent border-none text-left ${
              activeCategory === cat.key ? "text-foreground font-medium" : "text-search-cat"
            }`}
          >
            {cat.label}{" "}
            <strong className="block font-semibold">{cat.count.toLocaleString()}</strong>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
export type { SearchCategory };
