import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnatomyHotspot } from "@/data/wingAnatomy";

interface AnatomyOverlayProps {
  hotspots: AnatomyHotspot[];
  visible: boolean;
}

const AnatomyOverlay = ({ hotspots, visible }: AnatomyOverlayProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {hotspots.map((spot, i) => {
        const isActive = activeId === spot.id;
        return (
          <div
            key={spot.id}
            className="absolute pointer-events-auto"
            style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: "translate(-50%, -50%)" }}
            onMouseEnter={() => setActiveId(spot.id)}
            onMouseLeave={() => setActiveId(null)}
          >
            {/* Pulsing dot */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 20 }}
              className="relative flex items-center justify-center"
            >
              <span className="absolute w-5 h-5 rounded-full bg-primary/20 animate-ping" />
              <span className="relative w-2.5 h-2.5 rounded-full bg-primary border border-primary-foreground shadow-sm cursor-pointer" />
            </motion.div>

            {/* Tooltip */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-30 w-52 p-2.5 rounded-md border bg-popover text-popover-foreground shadow-lg"
                  style={{
                    left: spot.x > 50 ? "auto" : "calc(100% + 8px)",
                    right: spot.x > 50 ? "calc(100% + 8px)" : "auto",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <p className="text-xs font-semibold font-body tracking-wide uppercase text-foreground mb-1">{spot.label}</p>
                  <p className="text-[11px] font-body leading-relaxed text-muted-foreground">{spot.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default AnatomyOverlay;
