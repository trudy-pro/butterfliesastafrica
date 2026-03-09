import { specimens } from "@/data/butterflies";

interface NearbyResult {
  specimenId: string;
  locality: string;
  distance: number;
}

interface ResultsPanelProps {
  nearbyResults: NearbyResult[];
  radiusKm: number;
  onSelectSpecimen: (name: string) => void;
}

const ResultsPanel = ({ nearbyResults, radiusKm, onSelectSpecimen }: ResultsPanelProps) => {
  if (nearbyResults.length === 0) {
    return (
      <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          No species recorded within {radiusKm}km of this point. Try increasing the radius or clicking closer to a known area.
        </p>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-3 max-h-[200px] overflow-y-auto">
      <p className="text-xs font-body text-primary font-semibold mb-2">
        {nearbyResults.length} species within {radiusKm}km
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
        {nearbyResults.map((r) => {
          const specimen = specimens.find((s) => s.id === r.specimenId);
          if (!specimen) return null;
          return (
            <button
              key={r.specimenId}
              onClick={() => onSelectSpecimen(specimen.commonName)}
              className="text-left px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <p className="text-xs font-body text-foreground truncate">{specimen.commonName}</p>
              <p className="text-[10px] text-muted-foreground">
                {r.locality} · {r.distance < 1 ? "<1" : Math.round(r.distance)}km
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsPanel;
