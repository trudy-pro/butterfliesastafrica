import { useEffect } from "react";
import { useMapEvents, useMap } from "react-leaflet";
import { Crosshair } from "lucide-react";
import L from "leaflet";

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export const butterflyIcon = new L.DivIcon({
  className: "custom-butterfly-marker",
  html: `<div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-background">
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary-foreground"><circle cx="12" cy="12" r="3"/></svg>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

export const searchIcon = new L.DivIcon({
  className: "custom-search-marker",
  html: `<div class="w-8 h-8 bg-destructive rounded-full flex items-center justify-center shadow-xl border-2 border-background animate-pulse">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-destructive-foreground"><path d="M12 2v20M2 12h20"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

/** Handles click events for radius search */
export const MapClickHandler = ({ onClick }: { onClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => onClick(e.latlng.lat, e.latlng.lng),
  });
  return null;
};

/** Invalidate map size after mount to fix tile rendering in modals */
export const MapInvalidator = () => {
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
export const LocateButton = ({ onLocate }: { onLocate: (lat: number, lng: number) => void }) => {
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
