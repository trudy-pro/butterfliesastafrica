import { useMemo, useState } from "react";
import { X, Search } from "lucide-react";
import { motion } from "framer-motion";
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
  const [query, setQuery] = useState("");

  const sections = useMemo(() => {
    const result: { title: string; items: { name: string; count: number }[] }[] = [];

    const countBy = (fn: (s: typeof specimens[0]) => boolean) =>
      specimens.filter(fn).length;

    if (category === "species" || category === "all") {
      const species = [...new Set(specimens.map((s) => s.commonName))].sort();
      result.push({ title: t("search.species"), items: species.map((v) => ({ name: v, count: countBy((s) => s.commonName === v) })) });
    }
    if (category === "families" || category === "all") {
      const families = [...new Set(specimens.map((s) => s.family))].sort();
      result.push({ title: t("search.families"), items: families.map((v) => ({ name: v, count: countBy((s) => s.family === v) })) });
    }
    if (category === "regions" || category === "all") {
      const countries = ["Burundi", "Kenya", "Rwanda", "South Sudan", "Tanzania", "Uganda"];
      result.push({ title: t("search.regions"), items: countries.map((v) => ({ name: v, count: countBy((s) => s.region.toLowerCase().includes(v.toLowerCase())) })).filter((item) => item.count > 0) });
    }
    if (category === "habitats" || category === "all") {
      const habitats = [...new Set(specimens.map((s) => s.habitat))].sort();
      result.push({ title: t("search.habitats"), items: habitats.map((v) => ({ name: v, count: countBy((s) => s.habitat === v) })) });
    }
    if (category === "patterns" || category === "all") {
      const patterns = [...new Set(specimens.map((s) => s.pattern))].sort();
      result.push({ title: t("search.patterns"), items: patterns.map((v) => ({ name: v, count: countBy((s) => s.pattern === v) })) });
    }
    if (category === "colors" || category === "all") {
      const colors = [...new Set(specimens.flatMap((s) => s.colors))].sort();
      result.push({ title: t("search.colors"), items: colors.map((v) => ({ name: v, count: countBy((s) => s.colors.includes(v as any)) })) });
    }
    if (category === "wingShapes" || category === "all") {
      const wingShapes = [...new Set(specimens.map((s) => s.wingShape))].sort();
      result.push({ title: t("search.wingShapes"), items: wingShapes.map((v) => ({ name: v, count: countBy((s) => s.wingShape === v) })) });
    }

    return result;
  }, [category, t]);

  const filteredSections = useMemo(() => {
    if (!query.trim()) return sections;
    const q = query.toLowerCase();
    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.name.toLowerCase().includes(q)),
      }))
      .filter((section) => section.items.length > 0);
  }, [sections, query]);

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

  // Group items by first letter for alphabetical navigation
  const getLetterGroups = (items: { name: string; count: number }[]) => {
    const groups: Record<string, { name: string; count: number }[]> = {};
    items.forEach((item) => {
      const letter = item.name[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(item);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-background"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between px-8 py-6 border-b border-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-lg font-display text-foreground">
          {category === "all" ? t("search.everything") : t(`search.${category}`)}
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>
      </motion.div>

      {/* Search */}
      <div className="px-8 pt-6 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder") || "Search..."}
            className="w-full pl-10 pr-4 py-2.5 text-sm font-body bg-secondary text-foreground rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
            autoFocus
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        {filteredSections.map((section, sectionIdx) => {
          const cat = categoryForItem(section.title);

          return (
            <motion.div
              key={section.title}
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + sectionIdx * 0.05 }}
            >
              {/* Table header */}
              <div className="flex items-center border-b-2 border-primary px-2 py-2 mb-0">
                <span className="flex-1 text-xs font-body text-muted-foreground uppercase tracking-widest">
                  Name / Title ↓
                </span>
                <span className="text-xs font-body text-muted-foreground uppercase tracking-widest w-40 text-right">
                  {section.title}
                </span>
              </div>

              {/* Table rows */}
              <div className="divide-y divide-border">
                {section.items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => { onSelect(cat, item.name); onClose(); }}
                    className="flex items-center w-full px-2 py-2.5 text-left hover:bg-secondary/60 transition-colors cursor-pointer group"
                  >
                    <span className="flex-1 text-sm font-body text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </span>
                    <span className="text-sm font-body text-muted-foreground w-40 text-right">
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          );
        })}

        {filteredSections.length === 0 && (
          <p className="text-sm font-body text-muted-foreground text-center py-12">No results found.</p>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryBrowseModal;
