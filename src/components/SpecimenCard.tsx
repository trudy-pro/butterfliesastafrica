import { ButterflySpecimen } from "@/data/butterflies";
import { useLanguage } from "@/i18n/LanguageContext";
import { getFlightActivity, getCurrentMonth } from "@/data/flightPeriods";
import { useMemo } from "react";

interface SpecimenCardProps {
  specimen: ButterflySpecimen;
  onClick: (specimen: ButterflySpecimen) => void;
  index: number;
  monthOverride?: number | null;
}

const SpecimenCard = ({ specimen, onClick, index, monthOverride }: SpecimenCardProps) => {
  const { tSpecimen } = useLanguage();
  const displayName = tSpecimen(specimen.id, "commonName") ?? specimen.commonName;
  

  const seasonalState = useMemo(() => {
    const activity = getFlightActivity(specimen.id);
    const month = monthOverride ?? getCurrentMonth();
    const value = activity[month];
    if (value >= 0.5) return "active" as const;
    if (value >= 0.2) return "low" as const;
    return "dormant" as const;
  }, [specimen.id, monthOverride]);

  const isDormant = seasonalState === "dormant";
  const isLow = seasonalState === "low";

  return (
    <button
      onClick={() => onClick(specimen)}
      className="group relative block w-full text-left focus:outline-none opacity-0 animate-fade-in"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="relative overflow-hidden bg-card rounded-sm">
        <img
          src={specimen.image}
          alt={`${displayName} (${specimen.scientificName}) specimen`}
          className={`w-full aspect-[3/4] object-cover transition-all duration-500 group-hover:scale-105 ${
            isDormant
              ? "grayscale opacity-30 group-hover:grayscale-[0.5] group-hover:opacity-60"
              : isLow
              ? "grayscale-[0.6] opacity-60 group-hover:grayscale-[0.2] group-hover:opacity-90"
              : ""
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-specimen-overlay/0 group-hover:bg-specimen-overlay/10 transition-colors duration-300" />

        {isDormant && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="text-2xl font-bold tracking-wide text-center leading-tight px-4"
              style={{
                fontFamily: "'Fraunces', serif",
                WebkitTextStroke: "1px hsl(var(--foreground) / 0.15)",
                color: "transparent",
              }}
            >
              {displayName}
            </span>
          </div>
        )}
      </div>

      <div className="mt-2 px-0.5">
        <p className={`text-xs font-body tracking-wide ${isDormant ? "text-muted-foreground/40" : "text-muted-foreground"}`}>
          {specimen.id.toUpperCase()}
        </p>
        <p
          className={`text-sm mt-0.5 leading-tight ${isDormant ? "text-muted-foreground/50" : isLow ? "text-muted-foreground" : "text-foreground"}`}
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: typo.fontWeight,
            letterSpacing: typo.letterSpacing,
            fontStyle: typo.fontStyle,
            transform: typo.style.transform,
            display: "inline-block",
          }}
        >
          {displayName}
        </p>
        <p className={`text-xs font-body italic mt-0.5 ${isDormant ? "text-muted-foreground/30" : "text-muted-foreground"}`}>
          {specimen.scientificName}
        </p>

        {isDormant && (
          <p className="text-[10px] font-body uppercase tracking-widest text-muted-foreground/40 mt-1">
            Dormant
          </p>
        )}
        {isLow && (
          <p className="text-[10px] font-body uppercase tracking-widest text-muted-foreground/60 mt-1">
            Low activity
          </p>
        )}
      </div>
    </button>
  );
};

export default SpecimenCard;
