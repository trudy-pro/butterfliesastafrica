import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, useMapEvents, useMap } from "react-leaflet";
import { X, MapPin, Crosshair, Flame, Minus, Plus } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { specimens } from "@/data/butterflies";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  specimenCoordinates,
  findSpecimensNearPoint,
  getDensityClusters,
  getAllSightingPoints,
} from "@/data/specimenCoordinates";

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const butterflyIcon = new L.DivIcon({
  className: "custom-butterfly-marker",
  html: `<div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-background">
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary-foreground"><circle cx="12" cy="12" r="3"/></svg>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const searchIcon = new L.DivIcon({
  className: "custom-search-marker",
  html: `<div class="w-8 h-8 bg-destructive rounded-full flex items-center justify-center shadow-xl border-2 border-background animate-pulse">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-destructive-foreground"><path d="M12 2v20M2 12h20"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface MapBrowserProps {
  onClose: () => void;
  onSelectLocation: (country: string) => void;
}

type MapMode = "browse" | "radius" | "heatmap";

/** Handles click events for radius search */
const MapClickHandler = ({ onClick }: { onClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => onClick(e.latlng.lat, e.latlng.lng),
  });
  return null;
};

/** Invalidate map size after mount to fix tile rendering in modals */
const MapInvalidator = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

/** GPS locate button component */
const LocateButton = ({ onLocate }: { onLocate: (lat: number, lng: number) => void }) => {
  const map = useMap();
  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 10 });
    map.on("locationfound", (e) => {
      onLocate(e.latlng.lat, e.latlng.lng);
    });
  };
  return (
    <button
      onClick={handleLocate}
      className="absolute top-20 right-3 z-[1000] bg-card border border-border rounded-lg p-2 shadow-md hover:bg-muted transition-colors"
      title="Use my location"
    >
      <Crosshair size={16} className="text-foreground" />
    </button>
  );
};

const MapBrowser = ({ onClose, onSelectLocation }: MapBrowserProps) => {
  const { t } = useLanguage();
  const mapRef = useRef<L.Map | null>(null);
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

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      if (mode !== "radius") return;
      setSearchPoint({ lat, lng });
      const results = findSpecimensNearPoint(lat, lng, radiusKm);
      setNearbyResults(results);
    },
    [mode, radiusKm]
  );

  const handleLocate = useCallback(
    (lat: number, lng: number) => {
      setMode("radius");
      setSearchPoint({ lat, lng });
      const results = findSpecimensNearPoint(lat, lng, radiusKm);
      setNearbyResults(results);
    },
    [radiusKm]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-specimen-overlay/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl mx-4 bg-card rounded-lg border border-border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={{ height: "85vh" }}>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-[1000] bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h2 className="text-base font-display italic text-foreground">
              {t("map.title") || "Explore by Region"}
            </h2>
          </div>
          {/* Mode toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setMode("browse"); setSearchPoint(null); setNearbyResults([]); }}
              className={`px-3 py-1.5 text-xs font-body rounded-md transition-colors ${
                mode === "browse"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => setMode("radius")}
              className={`px-3 py-1.5 text-xs font-body rounded-md transition-colors flex items-center gap-1 ${
                mode === "radius"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Crosshair size={12} />
              Radius
            </button>
            <button
              onClick={() => { setMode("heatmap"); setSearchPoint(null); setNearbyResults([]); }}
              className={`px-3 py-1.5 text-xs font-body rounded-md transition-colors flex items-center gap-1 ${
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
            className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Map */}
        <div className="w-full h-full pt-14">
          <MapContainer
            center={[0, 35]}
            zoom={4}
            className="w-full h-full"
            ref={mapRef}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Radius mode: click handler + GPS */}
            {mode === "radius" && (
              <>
                <MapClickHandler onClick={handleMapClick} />
                <LocateButton onLocate={handleLocate} />
              </>
            )}

            {/* Search point + radius circle */}
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

            {/* Browse mode: sighting markers */}
            {mode === "browse" &&
              allSightings.map((p, i) => {
                const specimen = specimens.find((s) => s.id === p.specimenId);
                return (
                  <Marker
                    key={`${p.specimenId}-${i}`}
                    position={[p.lat, p.lng]}
                    icon={butterflyIcon}
                  >
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

            {/* Heatmap mode: density circles */}
            {mode === "heatmap" &&
              densityClusters.map((c, i) => {
                const intensity = c.uniqueSpecies / maxDensity;
                const radius = 20000 + intensity * 60000;
                return (
                  <Circle
                    key={i}
                    center={[c.lat, c.lng]}
                    radius={radius}
                    pathOptions={{
                      color: intensity > 0.7
                        ? "hsl(0, 90%, 55%)"
                        : intensity > 0.4
                          ? "hsl(30, 90%, 55%)"
                          : "hsl(50, 90%, 55%)",
                      fillColor: intensity > 0.7
                        ? "hsl(0, 90%, 55%)"
                        : intensity > 0.4
                          ? "hsl(30, 90%, 55%)"
                          : "hsl(50, 90%, 55%)",
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

            {/* Radius mode: matched sighting dots */}
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

        {/* Radius controls */}
        {mode === "radius" && (
          <div className="absolute top-16 left-4 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-3 max-w-[240px]">
            <p className="text-xs font-body text-muted-foreground mb-2">
              {searchPoint ? "Click map to search another area" : "Click anywhere on the map to search"}
            </p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground">Radius:</span>
              <button
                onClick={() => setRadiusKm((r) => Math.max(10, r - 10))}
                className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-muted/80"
              >
                <Minus size={12} />
              </button>
              <span className="text-sm font-medium text-foreground w-12 text-center">{radiusKm}km</span>
              <button
                onClick={() => setRadiusKm((r) => Math.min(200, r + 10))}
                className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-muted/80"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Radius results panel */}
        {mode === "radius" && searchPoint && nearbyResults.length > 0 && (
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
                    onClick={() => {
                      onSelectLocation(specimen.commonName);
                      onClose();
                    }}
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
        )}

        {mode === "radius" && searchPoint && nearbyResults.length === 0 && (
          <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-3 text-center">
            <p className="text-xs text-muted-foreground">No species recorded within {radiusKm}km of this point. Try increasing the radius or clicking closer to a known area.</p>
          </div>
        )}

        {/* Legend for heatmap */}
        {mode === "heatmap" && (
          <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-3">
            <p className="text-xs font-body text-foreground font-semibold mb-2">Biodiversity Hotspots</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(0, 90%, 55%)" }} />
                <span className="text-[10px] text-muted-foreground">High</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(30, 90%, 55%)" }} />
                <span className="text-[10px] text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(50, 90%, 55%)" }} />
                <span className="text-[10px] text-muted-foreground">Low</span>
              </div>
            </div>
          </div>
        )}

        {/* Browse legend */}
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
