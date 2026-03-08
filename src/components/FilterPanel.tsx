import { filterCategories, WingColor, WingPattern, WingShape, Habitat, Migration, Family } from "@/data/butterflies";

interface FilterState {
  color: WingColor | null;
  pattern: WingPattern | null;
  wingShape: WingShape | null;
  habitat: Habitat | null;
  migration: Migration | null;
  family: Family | null;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose: () => void;
}

const colorSwatches: Record<string, string> = {
  Orange: "bg-orange-400",
  Yellow: "bg-yellow-300",
  Green: "bg-emerald-500",
  Blue: "bg-blue-500",
  Red: "bg-red-500",
  Brown: "bg-amber-800",
  Black: "bg-neutral-900",
  White: "bg-white border border-border",
  Iridescent: "bg-gradient-to-r from-pink-300 via-cyan-300 to-emerald-300",
};

const FilterSection = ({
  title,
  items,
  activeItem,
  onSelect,
  showSwatch,
}: {
  title: string;
  items: string[];
  activeItem: string | null;
  onSelect: (item: string | null) => void;
  showSwatch?: boolean;
}) => (
  <div className="mb-8">
    <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-4">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(activeItem === item ? null : item)}
          className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-body rounded-sm transition-all duration-200 ${
            activeItem === item
              ? "bg-filter-active text-filter-active-fg"
              : "bg-filter-bg text-foreground hover:bg-secondary"
          }`}
        >
          {showSwatch && (
            <span className={`w-3 h-3 rounded-full ${colorSwatches[item] || "bg-muted"}`} />
          )}
          {item}
        </button>
      ))}
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 text-sm font-body rounded-sm transition-all duration-200 ${
          activeItem === null
            ? "bg-filter-active text-filter-active-fg"
            : "bg-filter-bg text-foreground hover:bg-secondary"
        }`}
      >
        All
      </button>
    </div>
  </div>
);

const FilterPanel = ({ filters, onFilterChange, onClose }: FilterPanelProps) => {
  const handleReset = () => {
    onFilterChange({
      color: null,
      pattern: null,
      wingShape: null,
      habitat: null,
      migration: null,
      family: null,
    });
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-specimen-overlay/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-background border-r border-border overflow-y-auto p-8 animate-slide-in">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-display italic text-foreground">Filter</h2>
          <div className="flex items-center gap-4">
            {activeCount > 0 && (
              <button
                onClick={handleReset}
                className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
              >
                Reset
              </button>
            )}
            <button
              onClick={onClose}
              className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <FilterSection
          title="Wing Color"
          items={filterCategories.colors}
          activeItem={filters.color}
          onSelect={(v) => onFilterChange({ ...filters, color: v as WingColor | null })}
          showSwatch
        />
        <FilterSection
          title="Wing Pattern"
          items={filterCategories.patterns}
          activeItem={filters.pattern}
          onSelect={(v) => onFilterChange({ ...filters, pattern: v as WingPattern | null })}
        />
        <FilterSection
          title="Wing Shape"
          items={filterCategories.wingShapes}
          activeItem={filters.wingShape}
          onSelect={(v) => onFilterChange({ ...filters, wingShape: v as WingShape | null })}
        />
        <FilterSection
          title="Habitat"
          items={filterCategories.habitats}
          activeItem={filters.habitat}
          onSelect={(v) => onFilterChange({ ...filters, habitat: v as Habitat | null })}
        />
        <FilterSection
          title="Migration"
          items={filterCategories.migrations}
          activeItem={filters.migration}
          onSelect={(v) => onFilterChange({ ...filters, migration: v as Migration | null })}
        />
        <FilterSection
          title="Family"
          items={filterCategories.families}
          activeItem={filters.family}
          onSelect={(v) => onFilterChange({ ...filters, family: v as Family | null })}
        />

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-filter-active text-filter-active-fg font-body text-sm tracking-wide rounded-sm hover:opacity-90 transition-opacity"
        >
          View Results
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
export type { FilterState };
