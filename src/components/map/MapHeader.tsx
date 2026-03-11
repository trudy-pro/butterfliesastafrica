import { MapPin, X, Crosshair, Flame } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export type MapMode = "browse" | "radius" | "heatmap";

interface MapHeaderProps {
  mode: MapMode;
  onModeChange: (mode: MapMode) => void;
  onClose: () => void;
}

const MapHeader = ({ mode, onModeChange, onClose }: MapHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="absolute top-0 left-0 right-0 z-[1000] bg-card/95 backdrop-blur-sm border-b border-border px-3 py-2 sm:px-4 sm:py-3 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <MapPin className="w-4 h-4 text-primary shrink-0" />
        <h2 className="text-sm sm:text-base font-display italic text-foreground truncate">
          {t("map.title") || "Explore by Region"}
        </h2>
      </div>
      <div className="flex items-center gap-1 order-3 sm:order-none w-full sm:w-auto justify-center">
        <button
          onClick={() => onModeChange("browse")}
          className={`px-2.5 sm:px-3 py-1.5 text-xs font-body rounded-md transition-colors ${
            mode === "browse"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Browse
        </button>
        <button
          onClick={() => onModeChange("radius")}
          className={`px-2.5 sm:px-3 py-1.5 text-xs font-body rounded-md transition-colors flex items-center gap-1 ${
            mode === "radius"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Crosshair size={12} />
          Radius
        </button>
        <button
          onClick={() => onModeChange("heatmap")}
          className={`px-2.5 sm:px-3 py-1.5 text-xs font-body rounded-md transition-colors flex items-center gap-1 ${
            mode === "heatmap"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Flame size={12} />
          Hotspots
        </button>
      </div>
      <button
        onClick={onClose}
        className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors shrink-0"
      >
        <X className="w-4 h-4 text-foreground" />
      </button>
    </div>
  );
};

export default MapHeader;
