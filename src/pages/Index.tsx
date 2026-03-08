import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { specimens, ButterflySpecimen, WingColor, WingPattern, WingShape, Habitat, Migration, Family } from "@/data/butterflies";
import SpecimenCard from "@/components/SpecimenCard";
import SpecimenDetail from "@/components/SpecimenDetail";
import FilterPanel, { FilterState } from "@/components/FilterPanel";
import InfoPanel from "@/components/InfoPanel";
import ComparisonView from "@/components/ComparisonView";
import SearchBar, { SearchCategory } from "@/components/SearchBar";
import IdentifyPanel from "@/components/IdentifyPanel";
import CategoryBrowseModal from "@/components/CategoryBrowseModal";
import { useLanguage } from "@/i18n/LanguageContext";

const ScrollableGrid = ({ filtered, onSelect }: { filtered: ButterflySpecimen[]; onSelect: (s: ButterflySpecimen) => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); scroll("left"); }
      else if (e.key === "ArrowRight") { e.preventDefault(); scroll("right"); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scroll]);

  return (
    <div className="relative group/scroll">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-md flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-card"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-md flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-card"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-foreground" />
        </button>
      )}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="overflow-x-auto scrollbar-hide px-3 scroll-smooth"
      >
        <div className="grid grid-rows-2 grid-flow-col gap-2 auto-cols-[140px] sm:auto-cols-[160px] md:auto-cols-[180px]">
          {filtered.map((specimen, i) => (
            <SpecimenCard
              key={specimen.id}
              specimen={specimen}
              onClick={onSelect}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const { t } = useLanguage();
  const [selectedSpecimen, setSelectedSpecimen] = useState<ButterflySpecimen | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showIdentify, setShowIdentify] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState<SearchCategory>("all");
  const [browseCategory, setBrowseCategory] = useState<SearchCategory | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    color: null,
    pattern: null,
    wingShape: null,
    habitat: null,
    migration: null,
    family: null,
    country: null,
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
      if (filters.country && !s.region.toLowerCase().includes(filters.country.toLowerCase())) return false;
      if (q) {
        let haystack = "";
        switch (searchCategory) {
          case "species":
            haystack = `${s.commonName} ${s.scientificName}`.toLowerCase();
            break;
          case "families":
            haystack = `${s.family} ${s.genus}`.toLowerCase();
            break;
          case "regions":
            haystack = s.region.toLowerCase();
            break;
          case "habitats":
            haystack = s.habitat.toLowerCase();
            break;
          case "patterns":
            haystack = s.pattern.toLowerCase();
            break;
          case "colors":
            haystack = s.colors.join(" ").toLowerCase();
            break;
          case "wingShapes":
            haystack = s.wingShape.toLowerCase();
            break;
          default:
            haystack = `${s.commonName} ${s.scientificName} ${s.region} ${s.family} ${s.genus} ${s.habitat} ${s.pattern} ${s.colors.join(" ")} ${s.wingShape}`.toLowerCase();
        }
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [filters, searchQuery, searchCategory]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="pt-12 pb-4 px-6">
        <p className="text-sm font-body text-primary tracking-wide mb-1">
          {t("header.subtitle")}
        </p>
        <h1 className="text-4xl md:text-6xl font-display text-foreground leading-tight whitespace-pre-line">
          {t("header.title")}
        </h1>
      </header>

      {/* Toolbar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-end px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowIdentify(true)}
              className="text-sm font-body text-foreground hover:text-muted-foreground transition-colors flex items-center gap-1"
            >
              <Camera size={14} />
              {t("toolbar.identify")}
            </button>
            <button
              onClick={() => setShowCompare(true)}
              className="text-sm font-body text-foreground hover:text-muted-foreground transition-colors"
            >
              {t("toolbar.compare")}
            </button>
            <button
              onClick={() => setShowInfo(true)}
              className="text-sm font-body text-foreground hover:text-muted-foreground transition-colors"
            >
              {t("toolbar.info")}
            </button>
          </div>
        </div>
      </div>

      {/* Specimen Grid */}
      <main className="flex-1 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20 px-3">
            <p className="text-sm font-body text-muted-foreground">{t("empty.noMatch")}</p>
            <button
              onClick={() => setFilters({ color: null, pattern: null, wingShape: null, habitat: null, migration: null, family: null, country: null })}
              className="mt-4 text-sm font-body text-foreground underline hover:text-muted-foreground transition-colors"
            >
              {t("empty.reset")}
            </button>
          </div>
        ) : (
          <ScrollableGrid filtered={filtered} onSelect={setSelectedSpecimen} />
        )}
      </main>

      {/* Search Bar — fixed at bottom */}
      <div className="sticky bottom-0 z-40 bg-background/90 backdrop-blur-md border-t border-border py-4">
        <SearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          activeCategory={searchCategory}
          onCategoryChange={setSearchCategory}
          onCategoryBrowse={(cat) => setBrowseCategory(cat)}
        />
      </div>

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
      {showCompare && <ComparisonView onClose={() => setShowCompare(false)} />}
      {showIdentify && <IdentifyPanel onClose={() => setShowIdentify(false)} />}
      <AnimatePresence>
        {browseCategory && (
          <CategoryBrowseModal
            category={browseCategory}
            onClose={() => setBrowseCategory(null)}
            onSelect={(cat, value) => {
              setSearchCategory(cat);
              setSearchQuery(value);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
