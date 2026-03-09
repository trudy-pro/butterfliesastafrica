import { useMemo } from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { specimens, ButterflySpecimen, Habitat } from "@/data/butterflies";
import { ClimateZone, HabitatType, CLIMATE_LABELS } from "@/hooks/useEnvironmentProfile";

interface SuggestedSpecimensProps {
  climateZone: ClimateZone;
  habitatType: HabitatType;
  onSelect: (specimen: ButterflySpecimen) => void;
}

/** Maps climate zones to likely butterfly habitats */
const CLIMATE_HABITAT_MAP: Record<ClimateZone, Habitat[]> = {
  tropical: ["Tropical Forest", "Savanna"],
  subtropical: ["Tropical Forest", "Woodland", "Savanna"],
  temperate: ["Woodland", "Grassland", "Montane Forest"],
  arid: ["Savanna", "Grassland", "Coastal"],
  mediterranean: ["Coastal", "Woodland", "Grassland"],
  alpine: ["Montane Forest", "Grassland"],
};

/** Maps user habitat to preference weighting */
const HABITAT_PREFERENCE: Record<HabitatType, Habitat[]> = {
  balcony: ["Savanna", "Coastal"],
  suburban_garden: ["Woodland", "Grassland", "Savanna"],
  rural_farm: ["Grassland", "Savanna", "Woodland"],
  near_forest: ["Tropical Forest", "Montane Forest", "Woodland"],
  near_wetland: ["Coastal", "Tropical Forest"],
  urban_park: ["Woodland", "Grassland", "Savanna"],
};

const SuggestedSpecimens = ({ climateZone, habitatType, onSelect }: SuggestedSpecimensProps) => {
  const suggested = useMemo(() => {
    const climateHabitats = CLIMATE_HABITAT_MAP[climateZone] || [];
    const userHabitats = HABITAT_PREFERENCE[habitatType] || [];
    const combined = [...new Set([...climateHabitats, ...userHabitats])];

    // Score each specimen
    const scored = specimens.map((s) => {
      let score = 0;
      if (climateHabitats.includes(s.habitat)) score += 2;
      if (userHabitats.includes(s.habitat)) score += 1;
      // Migratory species get a small boost (more likely to visit)
      if (s.migration === "Migratory") score += 0.5;
      return { specimen: s, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((s) => s.specimen);
  }, [climateZone, habitatType]);

  if (suggested.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 pb-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Compass className="w-3.5 h-3.5 text-accent" />
        <p className="text-[10px] font-body text-muted-foreground uppercase tracking-[0.25em]">
          Likely in your area · {CLIMATE_LABELS[climateZone]}
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {suggested.map((specimen, i) => (
          <motion.button
            key={specimen.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(specimen)}
            className="shrink-0 group flex items-center gap-2.5 px-3 py-2 rounded-sm border border-border bg-card hover:bg-secondary/50 transition-colors"
          >
            <img
              src={specimen.image}
              alt={specimen.commonName}
              className="w-8 h-8 object-contain rounded-sm"
              loading="lazy"
            />
            <div className="text-left">
              <p className="text-xs font-body text-foreground group-hover:text-primary transition-colors leading-tight">
                {specimen.commonName}
              </p>
              <p className="text-[9px] font-body italic text-muted-foreground leading-tight">
                {specimen.habitat}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default SuggestedSpecimens;
