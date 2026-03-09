import { Minus, Plus } from "lucide-react";

interface RadiusControlsProps {
  radiusKm: number;
  hasSearchPoint: boolean;
  onRadiusChange: (fn: (r: number) => number) => void;
}

const RadiusControls = ({ radiusKm, hasSearchPoint, onRadiusChange }: RadiusControlsProps) => (
  <div className="absolute top-16 left-4 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-3 max-w-[240px]">
    <p className="text-xs font-body text-muted-foreground mb-2">
      {hasSearchPoint ? "Click map to search another area" : "Click anywhere on the map to search"}
    </p>
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs text-muted-foreground">Radius:</span>
      <button
        onClick={() => onRadiusChange((r) => Math.max(10, r - 10))}
        className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-muted/80"
      >
        <Minus size={12} />
      </button>
      <span className="text-sm font-medium text-foreground w-12 text-center">{radiusKm}km</span>
      <button
        onClick={() => onRadiusChange((r) => Math.min(200, r + 10))}
        className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-muted/80"
      >
        <Plus size={12} />
      </button>
    </div>
  </div>
);

export default RadiusControls;
