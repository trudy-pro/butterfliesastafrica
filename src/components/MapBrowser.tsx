import { useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { specimens } from "@/data/butterflies";
import {
  specimenCoordinates,
  findSpecimensNearPoint,
  getDensityClusters,
  getAllSightingPoints,
} from "@/data/specimenCoordinates";
import MapHeader, { type MapMode } from "./map/MapHeader";
import RadiusControls from "./map/RadiusControls";
import ResultsPanel from "./map/ResultsPanel";
import HeatmapLegend from "./map/HeatmapLegend";
import {
  butterflyIcon,
  searchIcon,
  MapClickHandler,
  MapInvalidator,
  LocateButton,
} from "./map/MapUtils";

interface MapBrowserProps {
  onClose: () => void;
  onSelectLocation: (country: string) => void;
}

const MapBrowser = ({ onClose, onSelectLocation }: MapBrowserProps) => {
  const [mode, setMode] = useState<MapMode>("browse");
  const [searchPoint, setSearchPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState(50);
  const [nearbyResults, setNearbyResults] = useState<
    { specimenId: string; locality: string; distance: number }[]
  >([]);

  const allSightings = useMemo(() => getAllSightingPoints(), []);
  const densityClusters = useMemo(() => getDensityClusters(1.5), []);
  const maxDensity = useMemo(
    () => Math.max(...densityClusters.map((c) => c.uniqueSpecies), 1),
    [densityClusters]
  );

  const handleModeChange = useCallback((newMode: MapMode) => {
    setMode(newMode);
    if (newMode !== "radius") {
      setSearchPoint(null);
      setNearbyResults([]);
    }
  }, []);

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      if (mode !== "radius") return;
      setSearchPoint({ lat, lng });
      setNearbyResults(findSpecimensNearPoint(lat, lng, radiusKm));
    },
    [mode, radiusKm]
  );

  const handleLocate = useCallback(
    (lat: number, lng: number) => {
      setMode("radius");
      setSearchPoint({ lat, lng });
      setNearbyResults(findSpecimensNearPoint(lat, lng, radiusKm));
    },
    [radiusKm]
  );

  const handleSelectSpecimen = useCallback(
    (name: string) => {
      onSelectLocation(name);
      onClose();
    },
    [onSelectLocation, onClose]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-specimen-overlay/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl mx-4 bg-card rounded-lg border border-border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={{ height: "85vh" }}>
        <MapHeader mode={mode} onModeChange={handleModeChange} onClose={onClose} />

        <div className="w-full h-full pt-14">
          <MapContainer center={[0, 35]} zoom={4} className="w-full h-full" scrollWheelZoom={true}>
            <MapInvalidator />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {mode === "radius" && (
              <>
                <MapClickHandler onClick={handleMapClick} />
                <LocateButton onLocate={handleLocate} />
              </>
            )}

            {searchPoint && mode === "radius" && (
              <>
                <Circle
                  center={[searchPoint.lat, searchPoint.lng]}
                  radius={radiusKm * 1000}
                  pathOptions={{
                    color: "hsl(0, 84%, 60%)",
                    fillColor: "hsl(0, 84%, 60%)",
                    fillOpacity: 0.08,
                    weight: 1.5,
                    dashArray: "6 4",
                  }}
                />
                <Marker position={[searchPoint.lat, searchPoint.lng]} icon={searchIcon}>
                  <Popup>
                    <div className="p-1 text-sm">
                      <p className="font-medium">{nearbyResults.length} species within {radiusKm}km</p>
                    </div>
                  </Popup>
                </Marker>
              </>
            )}

            {mode === "browse" &&
              allSightings.map((p, i) => {
                const specimen = specimens.find((s) => s.id === p.specimenId);
                return (
                  <Marker key={`${p.specimenId}-${i}`} position={[p.lat, p.lng]} icon={butterflyIcon}>
                    <Popup>
                      <div className="p-1 min-w-[150px]">
                        <p className="font-display text-sm">{specimen?.commonName}</p>
                        <p className="text-xs text-muted-foreground italic">{specimen?.scientificName}</p>
                        <button
                          onClick={() => {
                            if (specimen) {
                              onSelectLocation(specimen.region.split(",")[0].trim());
                              onClose();
                            }
                          }}
                          className="mt-2 w-full py-1.5 bg-primary text-primary-foreground text-xs font-body rounded hover:bg-primary/90 transition-colors"
                        >
                          View Species
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            {mode === "heatmap" &&
              densityClusters.map((c, i) => {
                const intensity = c.uniqueSpecies / maxDensity;
                const radius = 20000 + intensity * 60000;
                const color =
                  intensity > 0.7 ? "hsl(0, 90%, 55%)" : intensity > 0.4 ? "hsl(30, 90%, 55%)" : "hsl(50, 90%, 55%)";
                return (
                  <Circle
                    key={i}
                    center={[c.lat, c.lng]}
                    radius={radius}
                    pathOptions={{
                      color,
                      fillColor: color,
                      fillOpacity: 0.15 + intensity * 0.35,
                      weight: 1,
                    }}
                  >
                    <Popup>
                      <div className="p-1">
                        <p className="font-medium text-sm">{c.uniqueSpecies} unique species</p>
                        <p className="text-xs text-muted-foreground">{c.count} total sightings</p>
                      </div>
                    </Popup>
                  </Circle>
                );
              })}

            {mode === "radius" &&
              nearbyResults.map((r) => {
                const coords = specimenCoordinates[r.specimenId];
                if (!coords) return null;
                return coords.map((c, ci) => (
                  <CircleMarker
                    key={`${r.specimenId}-${ci}`}
                    center={[c.lat, c.lng]}
                    radius={5}
                    pathOptions={{
                      color: "hsl(var(--primary))",
                      fillColor: "hsl(var(--primary))",
                      fillOpacity: 0.7,
                      weight: 1,
                    }}
                  />
                ));
              })}
          </MapContainer>
        </div>

        {mode === "radius" && (
          <RadiusControls
            radiusKm={radiusKm}
            hasSearchPoint={!!searchPoint}
            onRadiusChange={setRadiusKm}
          />
        )}

        {mode === "radius" && searchPoint && (
          <ResultsPanel
            nearbyResults={nearbyResults}
            radiusKm={radiusKm}
            onSelectSpecimen={handleSelectSpecimen}
          />
        )}

        {mode === "heatmap" && <HeatmapLegend />}

        {mode === "browse" && (
          <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-3">
            <p className="text-xs text-muted-foreground">Click a pin to explore species</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapBrowser;
