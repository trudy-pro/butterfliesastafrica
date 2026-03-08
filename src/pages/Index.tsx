import { useState, useMemo } from "react";
import { specimens, ButterflySpecimen, WingColor, WingPattern, WingShape, Habitat, Migration, Family } from "@/data/butterflies";
import SpecimenCard from "@/components/SpecimenCard";
import SpecimenDetail from "@/components/SpecimenDetail";
import FilterPanel, { FilterState } from "@/components/FilterPanel";
import InfoPanel from "@/components/InfoPanel";
import ComparisonView from "@/components/ComparisonView";
import SearchBar from "@/components/SearchBar";

const Index = () => {
  const [selectedSpecimen, setSelectedSpecimen] = useState<ButterflySpecimen | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    color: null,
    pattern: null,
    wingShape: null,
    habitat: null,
    migration: null,
    family: null,
  });

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return specimens.filter((s) => {
      if (filters.color && !s.colors.includes(filters.color)) return false;
      if (filters.pattern && s.pattern !== filters.pattern) return false;
      if (filters.wingShape && s.wingShape !== filters.wingShape) return false;
      if (filters.habitat && s.habitat !== filters.habitat) return false;
      if (filters.migration && s.migration !== filters.migration) return false;
      if (filters.family && s.family !== filters.family) return false;
      if (q) {
        const haystack = `${s.commonName} ${s.scientificName} ${s.region} ${s.family} ${s.genus}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [filters, searchQuery]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="text-center pt-16 pb-8 px-6">
        <h1 className="text-4xl md:text-5xl font-display italic text-foreground mb-4">
          Lepidoptera East Africa
        </h1>
        <p className="max-w-xl mx-auto text-sm font-body text-muted-foreground leading-relaxed mb-8">
          An archive exploring natural selection in Color, Pattern, Shape, and Form — documenting butterfly species across East Africa.
        </p>
        <SearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          totalSpecimens={specimens.length}
          filteredCount={filtered.length}
        />
      </header>

      {/* Toolbar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(true)}
              className="text-sm font-body text-foreground hover:text-muted-foreground transition-colors flex items-center gap-2"
            >
              Filter
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] bg-filter-active text-filter-active-fg rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <span className="text-xs font-body text-muted-foreground">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCompare(true)}
              className="text-sm font-body text-foreground hover:text-muted-foreground transition-colors"
            >
              Compare
            </button>
            <button
              onClick={() => setShowInfo(true)}
              className="text-sm font-body text-foreground hover:text-muted-foreground transition-colors"
            >
              Info
            </button>
          </div>
        </div>
      </div>

      {/* Specimen Grid */}
      <main className="px-3 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm font-body text-muted-foreground">No specimens match the current filters.</p>
            <button
              onClick={() => setFilters({ color: null, pattern: null, wingShape: null, habitat: null, migration: null, family: null })}
              className="mt-4 text-sm font-body text-foreground underline hover:text-muted-foreground transition-colors"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
            {filtered.map((specimen, i) => (
              <SpecimenCard
                key={specimen.id}
                specimen={specimen}
                onClick={setSelectedSpecimen}
                index={i}
              />
            ))}
          </div>
        )}
      </main>

      {/* Panels */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
      {selectedSpecimen && (
        <SpecimenDetail
          specimen={selectedSpecimen}
          onClose={() => setSelectedSpecimen(null)}
          onCompare={(s) => { setSelectedSpecimen(null); setShowCompare(true); }}
        />
      )}
      {showInfo && <InfoPanel onClose={() => setShowInfo(false)} />}
      {showCompare && (
        <ComparisonView
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
};

export default Index;
