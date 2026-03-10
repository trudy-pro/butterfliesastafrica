import { MONTH_LABELS, getCurrentMonth, getFlightActivity } from "@/data/flightPeriods";
import { specimens } from "@/data/butterflies";
import { motion } from "framer-motion";
import { Calendar, X } from "lucide-react";
import { useState, useMemo } from "react";

interface MonthScrubberProps {
  previewMonth: number | null;
  onMonthChange: (month: number | null) => void;
}

const MonthScrubber = ({ previewMonth, onMonthChange }: MonthScrubberProps) => {
  const [open, setOpen] = useState(false);
  const currentMonth = getCurrentMonth();
  const activeMonth = previewMonth ?? currentMonth;

  const counts = useMemo(() => {
    let active = 0, low = 0, dormant = 0;
    for (const s of specimens) {
      const v = getFlightActivity(s.id)[activeMonth];
      if (v >= 0.5) active++;
      else if (v >= 0.2) low++;
      else dormant++;
    }
    return { active, low, dormant };
  }, [activeMonth]);

  if (!open) {
    return (
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-md border border-border bg-card/90 backdrop-blur-sm text-[10px] md:text-[11px] font-body uppercase tracking-wider text-muted-foreground hover:bg-card transition-colors"
        >
          <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
          {MONTH_LABELS[activeMonth]}
          {previewMonth !== null && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[9px]">Preview</span>
          )}
        </button>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-body uppercase tracking-wider">
          <span className="text-foreground">{counts.active} active</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{counts.low} low</span>
          {counts.dormant > 0 && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground/50">{counts.dormant} dormant</span>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-border bg-card/95 backdrop-blur-md shadow-lg"
      >
        {MONTH_LABELS.map((label, i) => {
          const isCurrent = i === currentMonth;
          const isActive = i === activeMonth;
          return (
            <button
              key={label}
              onClick={() => onMonthChange(i === currentMonth ? null : i)}
              className={`relative w-7 h-7 rounded-md text-[10px] font-body font-medium tracking-wide transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isCurrent
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              title={`${label}${isCurrent ? " (now)" : ""}`}
            >
              {label.charAt(0)}
              {isCurrent && !isActive && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
        <button
          onClick={() => { onMonthChange(null); setOpen(false); }}
          className="ml-1 w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Reset to current month"
        >
          <X className="w-3 h-3" />
        </button>
      </motion.div>
      <div className="flex items-center gap-2 text-[10px] font-body uppercase tracking-wider">
        <span className="text-foreground">{counts.active} active</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{counts.low} low</span>
        {counts.dormant > 0 && (
          <>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground/50">{counts.dormant} dormant</span>
          </>
        )}
      </div>
    </div>
  );
};

export default MonthScrubber;
