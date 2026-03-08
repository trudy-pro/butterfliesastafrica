import { useState, useMemo, useRef, useEffect } from "react";
import { specimens } from "@/data/butterflies";
import { ChevronDown } from "lucide-react";

type SearchCategory = "all" | "species" | "families" | "regions" | "habitats" | "patterns" | "colors";

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  activeCategory: SearchCategory;
  onCategoryChange: (cat: SearchCategory) => void;
}

const SearchBar = ({ query, onQueryChange, activeCategory, onCategoryChange }: SearchBarProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const families = new Set<string>();
    const regions = new Set<string>();
    const habitats = new Set<string>();
    const patterns = new Set<string>();
    const colors = new Set<string>();

    specimens.forEach((s) => {
      families.add(s.family);
      s.region.split(", ").forEach((c) => regions.add(c.trim()));
      habitats.add(s.habitat);
      patterns.add(s.pattern);
      s.colors.forEach((c) => colors.add(c));
    });

    return {
      all: specimens.length,
      species: specimens.length,
      families: families.size,
      regions: regions.size,
      habitats: habitats.size,
      patterns: patterns.size,
      colors: colors.size,
    };
  }, []);

  const categories: { key: SearchCategory; label: string; count: number }[] = [
    { key: "all", label: "Everything", count: counts.all },
    { key: "species", label: "Species", count: counts.species },
    { key: "families", label: "Families", count: counts.families },
    { key: "regions", label: "Regions", count: counts.regions },
    { key: "habitats", label: "Habitats", count: counts.habitats },
    { key: "patterns", label: "Patterns", count: counts.patterns },
    { key: "colors", label: "Colors", count: counts.colors },
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

  const activeLabel = categories.find((c) => c.key === activeCategory)?.label ?? "Everything";

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
            <div className="absolute top-full left-0 mt-1 z-50 min-w-[220px] bg-card border border-border rounded-lg shadow-lg overflow-hidden">
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
          placeholder="Search..."
          className="flex-1 px-5 py-4 rounded-lg border-none font-body text-xl text-foreground bg-background outline-none placeholder:text-muted-foreground"
        />

        {/* Language badge */}
        <div className="w-11 h-11 rounded-full bg-background border-2 border-search-bar flex items-center justify-center font-body font-bold text-sm text-foreground shrink-0">
          en
        </div>
      </div>

      {/* Categories row */}
      <div className="flex flex-wrap justify-between mt-3 gap-y-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onCategoryChange(cat.key)}
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
