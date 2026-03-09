import { MONTH_LABELS, getCurrentMonth } from "@/data/flightPeriods";
import { motion } from "framer-motion";
import { Calendar, X } from "lucide-react";
import { useState } from "react";

interface MonthScrubberProps {
  previewMonth: number | null;
  onMonthChange: (month: number | null) => void;
}

const MonthScrubber = ({ previewMonth, onMonthChange }: MonthScrubberProps) => {
  const [open, setOpen] = useState(false);
  const currentMonth = getCurrentMonth();
  const activeMonth = previewMonth ?? currentMonth;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card/90 backdrop-blur-sm text-[11px] font-body uppercase tracking-wider text-muted-foreground hover:bg-card transition-colors"
      >
        <Calendar className="w-3.5 h-3.5" />
        {MONTH_LABELS[activeMonth]}
        {previewMonth !== null && (
          <span className="ml-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[9px]">Preview</span>
        )}
      </button>
    );
  }

  return (
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
  );
};

export default MonthScrubber;
