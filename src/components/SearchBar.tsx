import { useState, useMemo, useRef, useEffect } from "react";
import { specimens } from "@/data/butterflies";
import { Search, ChevronDown } from "lucide-react";

type SearchCategory = "all" | "species" | "taxonomy" | "geography";

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  totalSpecimens: number;
  filteredCount: number;
  activeCategory?: SearchCategory;
  onCategoryChange?: (cat: SearchCategory) => void;
}

const SearchBar = ({
  query,
  onQueryChange,
  totalSpecimens,
  filteredCount,
  activeCategory = "all",
  onCategoryChange,
}: SearchBarProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Compute counts
  const counts = useMemo(() => {
    const families = new Set<string>();
    const genera = new Set<string>();
    const regions = new Set<string>();
    const countries = new Set<string>();

    specimens.forEach((s) => {
      families.add(s.family);
      genera.add(s.genus);
      s.region.split(", ").forEach((c) => countries.add(c.trim()));
      regions.add(s.region);
    });

    return {
      all: specimens.length,
      species: specimens.length,
      taxonomy: families.size + genera.size,
      geography: countries.size,
    };
  }, []);

  const categories: { key: SearchCategory; label: string; count: number }[] = [
    { key: "all", label: "Everything", count: counts.all },
    { key: "species", label: "Species", count: counts.species },
    { key: "taxonomy", label: "Taxonomy", count: counts.taxonomy },
    { key: "geography", label: "Geography", count: counts.geography },
  ];

  const activeLabel = categories.find((c) => c.key === activeCategory)?.label ?? "Everything";

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Search input with dropdown */}
      <div className="flex items-stretch border border-border rounded overflow-hidden bg-card">
        {/* Dropdown trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-body text-sm tracking-wide whitespace-nowrap h-full hover:opacity-90 transition-opacity"
          >
            {activeLabel}
            <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1 z-50 min-w-[220px] bg-card border border-border rounded shadow-lg overflow-hidden">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    onCategoryChange?.(cat.key);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left font-body text-sm transition-colors hover:bg-secondary ${
                    activeCategory === cat.key
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{cat.count.toLocaleString()}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search input */}
        <div className="flex-1 flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by name, scientific name, or country…"
            className="flex-1 px-5 py-3 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <div className="pr-4">
            <Search size={16} className="text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Category tabs row */}
      <div className="flex items-center gap-0 mt-4 border-b border-border">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onCategoryChange?.(cat.key)}
            className={`flex items-center gap-2 px-4 py-2.5 font-body text-sm transition-colors border-b-2 -mb-px ${
              activeCategory === cat.key
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{cat.label}</span>
            <span className={`text-xs tabular-nums ${activeCategory === cat.key ? "text-foreground" : "text-muted-foreground"}`}>
              {cat.count.toLocaleString()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
