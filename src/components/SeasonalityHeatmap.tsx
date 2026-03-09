import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { specimens } from "@/data/butterflies";
import { getFlightActivity, MONTH_LABELS, getCurrentMonth } from "@/data/flightPeriods";

interface SeasonalityHeatmapProps {
  onClose: () => void;
  onSelectSpecimen?: (specimenId: string) => void;
}

const SeasonalityHeatmap = ({ onClose, onSelectSpecimen }: SeasonalityHeatmapProps) => {
  const currentMonth = getCurrentMonth();
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const data = useMemo(() => {
    return specimens.map((s) => ({
      id: s.id,
      name: s.commonName,
      activity: getFlightActivity(s.id),
    }));
  }, []);

  const getColor = (value: number): string => {
    if (value >= 0.8) return "hsl(var(--primary))";
    if (value >= 0.6) return "hsl(var(--primary) / 0.7)";
    if (value >= 0.4) return "hsl(var(--primary) / 0.4)";
    if (value >= 0.2) return "hsl(var(--primary) / 0.2)";
    return "hsl(var(--muted) / 0.5)";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-[95vw] max-w-5xl max-h-[85vh] bg-card border border-border rounded-lg shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-display text-foreground">Seasonality Heatmap</h2>
            <p className="text-xs font-body text-muted-foreground mt-0.5">
              Flight activity across all species · East Africa
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-6 py-2 border-b border-border">
          <span className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">Activity</span>
          {[
            { label: "Peak", min: 0.8 },
            { label: "High", min: 0.6 },
            { label: "Medium", min: 0.4 },
            { label: "Low", min: 0.2 },
            { label: "Absent", min: 0 },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-[2px]"
                style={{ backgroundColor: getColor(l.min) }}
              />
              <span className="text-[9px] font-body text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex-1 overflow-auto px-6 py-3">
          {/* Month headers */}
          <div className="flex sticky top-0 bg-card z-10 pb-1">
            <div className="w-44 shrink-0" />
            {MONTH_LABELS.map((m, i) => (
              <div
                key={m}
                className={`flex-1 text-center text-[10px] font-body ${
                  i === currentMonth
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {m}
              </div>
            ))}
          </div>

          {/* Rows */}
          {data.map((row, ri) => (
            <div
              key={row.id}
              className="flex items-center group hover:bg-muted/30 rounded-sm transition-colors cursor-pointer"
              onClick={() => onSelectSpecimen?.(row.id)}
            >
              <div className="w-44 shrink-0 pr-3 py-[3px]">
                <span className="text-[11px] font-body text-foreground truncate block">
                  {row.name}
                </span>
              </div>
              {row.activity.map((val, ci) => {
                const isHovered =
                  hoveredCell?.row === ri && hoveredCell?.col === ci;
                return (
                  <div
                    key={ci}
                    className="flex-1 px-[1px] py-[2px]"
                    onMouseEnter={() => setHoveredCell({ row: ri, col: ci })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <div
                      className={`w-full h-5 rounded-[2px] transition-all duration-150 ${
                        ci === currentMonth ? "ring-1 ring-primary/50" : ""
                      } ${isHovered ? "ring-2 ring-foreground/30 scale-110" : ""}`}
                      style={{ backgroundColor: getColor(val) }}
                      title={`${row.name} · ${MONTH_LABELS[ci]}: ${Math.round(val * 100)}%`}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SeasonalityHeatmap;
