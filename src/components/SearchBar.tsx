import { useState, useMemo } from "react";
import { specimens, ButterflySpecimen } from "@/data/butterflies";
import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  totalSpecimens: number;
  filteredCount: number;
}

const SearchBar = ({ query, onQueryChange, totalSpecimens, filteredCount }: SearchBarProps) => {
  // Compute category counts from all specimens
  const stats = useMemo(() => {
    const countries = new Set<string>();
    const families = new Set<string>();
    const habitats = new Set<string>();

    specimens.forEach((s) => {
      s.region.split(", ").forEach((c) => countries.add(c.trim()));
      families.add(s.family);
      habitats.add(s.habitat);
    });

    return {
      species: specimens.length,
      countries: countries.size,
      families: families.size,
      habitats: habitats.size,
    };
  }, []);

  const categories = [
    { label: "Species", count: stats.species },
    { label: "Countries", count: stats.countries },
    { label: "Families", count: stats.families },
    { label: "Habitats", count: stats.habitats },
  ];

  return (
    <div className="w-full">
      {/* Search input */}
      <div className="flex items-stretch border-2 border-border rounded-lg overflow-hidden bg-card max-w-3xl mx-auto">
        <div className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-body text-sm tracking-wide whitespace-nowrap rounded-lg">
          <Search size={16} />
          Lepidoptera Archive
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by name, scientific name, or country…"
          className="flex-1 px-5 py-3 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {/* Category counters */}
      <div className="flex items-center justify-center gap-0 mt-6 max-w-3xl mx-auto">
        {categories.map((cat, i) => (
          <div
            key={cat.label}
            className={`flex-1 text-center py-3 ${i < categories.length - 1 ? "border-r border-border" : ""}`}
          >
            <p className="text-2xl md:text-3xl font-display italic text-foreground">{cat.count}</p>
            <p className="text-[10px] font-body uppercase tracking-[0.2em] text-muted-foreground mt-1">{cat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
