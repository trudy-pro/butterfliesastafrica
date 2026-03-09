import { FlightStyleInfo } from "@/data/flightStyles";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FlightStyleTagProps {
  styles: FlightStyleInfo[];
}

const FlightStyleTag = ({ styles }: FlightStyleTagProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="mb-6">
      <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">
        Flight Style
      </h3>

      <div className="flex gap-2 flex-wrap mb-3">
        <TooltipProvider delayDuration={200}>
          {styles.map((s, i) => {
            const Icon = s.icon;
            const isExpanded = expandedIndex === i;
            return (
              <Tooltip key={s.style}>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setExpandedIndex(isExpanded ? null : i)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-body tracking-wider uppercase transition-colors ${
                      isExpanded
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-secondary-foreground border-border hover:bg-muted"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {s.label}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px]">
                  <p className="text-xs">{s.shortDesc}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>

      {/* Expanded field tip */}
      {expandedIndex !== null && styles[expandedIndex] && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-sm border border-border bg-card p-3"
        >
          <div className="flex items-start gap-2">
            {(() => {
              const Icon = styles[expandedIndex].icon;
              return <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />;
            })()}
            <div>
              <p className="text-xs font-body font-semibold text-foreground mb-1">
                {styles[expandedIndex].label} — Field ID Tip
              </p>
              <p className="text-xs font-body text-muted-foreground leading-relaxed">
                {styles[expandedIndex].fieldTip}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FlightStyleTag;
