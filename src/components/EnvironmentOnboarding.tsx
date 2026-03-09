import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, TreePine, Leaf } from "lucide-react";
import {
  ClimateZone,
  HabitatType,
  CLIMATE_LABELS,
  HABITAT_LABELS,
  getMigrationSeason,
} from "@/hooks/useEnvironmentProfile";

interface EnvironmentOnboardingProps {
  onComplete: (climate: ClimateZone, habitat: HabitatType) => void;
}

const CLIMATE_ICONS: Record<ClimateZone, string> = {
  tropical: "🌴",
  subtropical: "🌺",
  temperate: "🌿",
  arid: "🏜️",
  mediterranean: "🫒",
  alpine: "🏔️",
};

const HABITAT_ICONS: Record<HabitatType, string> = {
  balcony: "🏙️",
  suburban_garden: "🏡",
  rural_farm: "🌾",
  near_forest: "🌲",
  near_wetland: "🌊",
  urban_park: "🌳",
};

const EnvironmentOnboarding = ({ onComplete }: EnvironmentOnboardingProps) => {
  const [step, setStep] = useState<"climate" | "habitat">("climate");
  const [selectedClimate, setSelectedClimate] = useState<ClimateZone | null>(null);

  const season = getMigrationSeason();

  return (
    <motion.div
      key="environment"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -30, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center"
    >
      <p className="text-[10px] font-body text-primary-foreground/40 uppercase tracking-[0.4em] mb-4">
        🌍 Geographical Profile
      </p>

      {step === "climate" ? (
        <>
          <h2
            className="text-2xl text-primary-foreground mb-2"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Your Eco-Region
          </h2>
          <p className="text-xs font-body text-primary-foreground/50 mb-6 max-w-sm mx-auto">
            Select your climate zone so we can suggest which species from the archive you're most likely to encounter.
          </p>

          <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
            {(Object.keys(CLIMATE_LABELS) as ClimateZone[]).map((key, i) => (
              <motion.button
                key={key}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  setSelectedClimate(key);
                  setStep("habitat");
                }}
                className="flex items-center gap-2 p-3 rounded-sm border border-primary-foreground/10 bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors text-left"
              >
                <span className="text-lg">{CLIMATE_ICONS[key]}</span>
                <span className="text-xs font-body text-primary-foreground">
                  {CLIMATE_LABELS[key]}
                </span>
              </motion.button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2
            className="text-2xl text-primary-foreground mb-2"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Your Habitat
          </h2>
          <p className="text-xs font-body text-primary-foreground/50 mb-6 max-w-sm mx-auto">
            Where do you observe? This helps us tailor your migration alerts.
          </p>

          <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
            {(Object.keys(HABITAT_LABELS) as HabitatType[]).map((key, i) => (
              <motion.button
                key={key}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onComplete(selectedClimate!, key)}
                className="flex items-center gap-2 p-3 rounded-sm border border-primary-foreground/10 bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors text-left"
              >
                <span className="text-lg">{HABITAT_ICONS[key]}</span>
                <span className="text-xs font-body text-primary-foreground">
                  {HABITAT_LABELS[key]}
                </span>
              </motion.button>
            ))}
          </div>

          <button
            onClick={() => setStep("climate")}
            className="mt-4 text-[10px] font-body text-primary-foreground/40 uppercase tracking-wider hover:text-primary-foreground/60 transition-colors"
          >
            ← Change climate zone
          </button>
        </>
      )}

      {/* Season tag */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-primary-foreground/5 border border-primary-foreground/10"
      >
        <Leaf className="w-3 h-3 text-primary-foreground/50" />
        <span className="text-[10px] font-body text-primary-foreground/60 uppercase tracking-wider">
          Joined during {season}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default EnvironmentOnboarding;
