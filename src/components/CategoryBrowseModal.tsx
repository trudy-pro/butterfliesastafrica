import { useMemo } from "react";
import { X } from "lucide-react";
import { specimens } from "@/data/butterflies";
import { useLanguage } from "@/i18n/LanguageContext";
import type { SearchCategory } from "@/components/SearchBar";

interface CategoryBrowseModalProps {
  category: SearchCategory;
  onClose: () => void;
  onSelect: (category: SearchCategory, value: string) => void;
}

const CategoryBrowseModal = ({ category, onClose, onSelect }: CategoryBrowseModalProps) => {
  const { t } = useLanguage();

  const sections = useMemo(() => {
    const result: { title: string; items: string[] }[] = [];

    if (category === "species" || category === "all") {
      const species = [...new Set(specimens.map((s) => s.commonName))].sort();
      result.push({ title: t("search.species"), items: species });
    }
    if (category === "families" || category === "all") {
      const families = [...new Set(specimens.map((s) => s.family))].sort();
      result.push({ title: t("search.families"), items: families });
    }
    if (category === "regions" || category === "all") {
      const regions = [...new Set(specimens.flatMap((s) => s.region.split(", ").map((r) => r.trim())))].sort();
      result.push({ title: t("search.regions"), items: regions });
    }
    if (category === "habitats" || category === "all") {
      const habitats = [...new Set(specimens.map((s) => s.habitat))].sort();
      result.push({ title: t("search.habitats"), items: habitats });
    }
    if (category === "patterns" || category === "all") {
      const patterns = [...new Set(specimens.map((s) => s.pattern))].sort();
      result.push({ title: t("search.patterns"), items: patterns });
    }
    if (category === "colors" || category === "all") {
      const colors = [...new Set(specimens.flatMap((s) => s.colors))].sort();
      result.push({ title: t("search.colors"), items: colors });
    }
    if (category === "wingShapes" || category === "all") {
      const wingShapes = [...new Set(specimens.map((s) => s.wingShape))].sort();
      result.push({ title: t("search.wingShapes"), items: wingShapes });
    }

    return result;
  }, [category, t]);

  const categoryForItem = (sectionTitle: string): SearchCategory => {
    if (sectionTitle === t("search.species")) return "species";
    if (sectionTitle === t("search.families")) return "families";
    if (sectionTitle === t("search.regions")) return "regions";
    if (sectionTitle === t("search.habitats")) return "habitats";
    if (sectionTitle === t("search.patterns")) return "patterns";
    if (sectionTitle === t("search.colors")) return "colors";
    if (sectionTitle === t("search.wingShapes")) return "wingShapes";
    return "all";
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-border">
        <h2 className="text-lg font-display text-foreground">
          {category === "all" ? t("search.everything") : t(`search.${category}`)}
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className={`grid gap-12 ${sections.length > 1 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"}`}>
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-body font-medium text-muted-foreground uppercase tracking-widest mb-4">
                {section.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {section.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      onSelect(categoryForItem(section.title), item);
                      onClose();
                    }}
                    className="px-3.5 py-2 text-sm font-body text-foreground bg-background border border-border rounded-md hover:bg-secondary transition-colors cursor-pointer uppercase tracking-wide"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBrowseModal;
