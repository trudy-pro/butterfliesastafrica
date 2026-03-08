import { ButterflySpecimen } from "@/data/butterflies";
import { useLanguage } from "@/i18n/LanguageContext";

interface SpecimenCardProps {
  specimen: ButterflySpecimen;
  onClick: (specimen: ButterflySpecimen) => void;
  index: number;
}

const SpecimenCard = ({ specimen, onClick, index }: SpecimenCardProps) => {
  const { tSpecimen } = useLanguage();
  const displayName = tSpecimen(specimen.id, "commonName") ?? specimen.commonName;

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
          className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-specimen-overlay/0 group-hover:bg-specimen-overlay/10 transition-colors duration-300" />
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-xs font-body text-muted-foreground tracking-wide">{specimen.id.toUpperCase()}</p>
        <p className="text-sm font-body text-foreground mt-0.5 leading-tight">{displayName}</p>
        <p className="text-xs font-body italic text-muted-foreground mt-0.5">{specimen.scientificName}</p>
      </div>
    </button>
  );
};

export default SpecimenCard;
