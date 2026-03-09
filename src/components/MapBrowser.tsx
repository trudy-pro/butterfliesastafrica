import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { X, MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { specimens } from "@/data/butterflies";
import { useLanguage } from "@/i18n/LanguageContext";

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom butterfly icon
const butterflyIcon = new L.DivIcon({
  className: "custom-butterfly-marker",
  html: `<div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-background">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-foreground"><path d="M12 22c-4.97 0-9-2.24-9-5v-.09c0-.14.04-.27.11-.39l4.22-7.03c.14-.23.38-.38.65-.44l.02-.01a8.46 8.46 0 0 1 8 0l.02.01c.27.06.51.21.65.44l4.22 7.03c.07.12.11.25.11.39V17c0 2.76-4.03 5-9 5z"/><path d="M12 2v4"/><path d="m4.93 10.93 2.83 2.83"/><path d="m19.07 10.93-2.83 2.83"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface LocationData {
  name: string;
  lat: number;
  lng: number;
  countries: string[];
  habitats: string[];
  specimenCount: number;
}

// East African locations with coordinates
const locations: LocationData[] = [
  {
    name: "Kenya",
    lat: 0.0236,
    lng: 37.9062,
    countries: ["Kenya"],
    habitats: ["Savanna", "Forest", "Woodland"],
    specimenCount: 0,
  },
  {
    name: "Tanzania",
    lat: -6.369,
    lng: 34.8888,
    countries: ["Tanzania"],
    habitats: ["Savanna", "Forest", "Coastal"],
    specimenCount: 0,
  },
  {
    name: "Uganda",
    lat: 1.3733,
    lng: 32.2903,
    countries: ["Uganda"],
    habitats: ["Forest", "Wetland", "Montane"],
    specimenCount: 0,
  },
  {
    name: "Rwanda",
    lat: -1.9403,
    lng: 29.8739,
    countries: ["Rwanda"],
    habitats: ["Montane", "Forest"],
    specimenCount: 0,
  },
  {
    name: "Burundi",
    lat: -3.3731,
    lng: 29.9189,
    countries: ["Burundi"],
    habitats: ["Montane", "Forest"],
    specimenCount: 0,
  },
  {
    name: "Ethiopia",
    lat: 9.145,
    lng: 40.4897,
    countries: ["Ethiopia"],
    habitats: ["Highland", "Savanna", "Forest"],
    specimenCount: 0,
  },
  {
    name: "South Sudan",
    lat: 6.877,
    lng: 31.307,
    countries: ["South Sudan"],
    habitats: ["Savanna", "Wetland"],
    specimenCount: 0,
  },
  {
    name: "Democratic Republic of Congo",
    lat: -4.0383,
    lng: 21.7587,
    countries: ["DRC", "Congo"],
    habitats: ["Rainforest", "Forest"],
    specimenCount: 0,
  },
  {
    name: "Madagascar",
    lat: -18.7669,
    lng: 46.8691,
    countries: ["Madagascar"],
    habitats: ["Rainforest", "Dry Forest"],
    specimenCount: 0,
  },
];

// Calculate specimen counts for each location
const enrichedLocations = locations.map((loc) => {
  const count = specimens.filter((s) =>
    loc.countries.some((country) =>
      s.region.toLowerCase().includes(country.toLowerCase())
    )
  ).length;
  return { ...loc, specimenCount: count };
});

interface MapBrowserProps {
  onClose: () => void;
  onSelectLocation: (country: string) => void;
}

const MapBrowser = ({ onClose, onSelectLocation }: MapBrowserProps) => {
  const { t } = useLanguage();
  const mapRef = useRef<L.Map | null>(null);

  const handleLocationClick = (location: LocationData) => {
    onSelectLocation(location.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-specimen-overlay/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl h-[80vh] mx-4 bg-card rounded-lg border border-border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-[1000] bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-display italic text-foreground">
              {t("map.title") || "Explore by Region"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Map Container */}
        <div className="w-full h-full pt-16">
          <MapContainer
            center={[0, 35]}
            zoom={4}
            className="w-full h-full"
            ref={mapRef}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {enrichedLocations.map((location) => (
              <Marker
                key={location.name}
                position={[location.lat, location.lng]}
                icon={butterflyIcon}
                eventHandlers={{
                  click: () => handleLocationClick(location),
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2 min-w-[180px]">
                    <h3 className="font-display text-lg text-foreground mb-2">
                      {location.name}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Species: </span>
                        <span className="font-medium text-foreground">
                          {location.specimenCount}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Habitats: </span>
                        <span className="text-foreground">
                          {location.habitats.slice(0, 3).join(", ")}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleLocationClick(location)}
                      className="mt-3 w-full py-2 bg-primary text-primary-foreground text-sm font-body rounded hover:bg-primary/90 transition-colors"
                    >
                      View Species
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-3">
          <p className="text-xs text-muted-foreground mb-2">
            {t("map.legend") || "Click a pin to explore species"}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded-full" />
            <span className="text-xs text-foreground">Species location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapBrowser;
