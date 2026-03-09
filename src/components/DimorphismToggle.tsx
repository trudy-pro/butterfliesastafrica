import { DimorphismInfo } from "@/data/dimorphism";
import { useLanguage } from "@/i18n/LanguageContext";

interface DimorphismToggleProps {
  dimorphism: DimorphismInfo;
  currentSex: "male" | "female";
  onToggle: (sex: "male" | "female") => void;
}

const DimorphismToggle = ({ dimorphism, currentSex, onToggle }: DimorphismToggleProps) => {
  const { t } = useLanguage();
  const info = currentSex === "male" ? dimorphism.male : dimorphism.female;

  return (
    <div className="mb-6">
      <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">
        Sexual Dimorphism
      </h3>

      {/* Toggle */}
      <div className="flex rounded-sm border border-border overflow-hidden mb-3">
        <button
          onClick={() => onToggle("male")}
          className={`flex-1 py-2 text-xs font-body tracking-wider uppercase transition-colors ${
            currentSex === "male"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          ♂ Male
        </button>
        <button
          onClick={() => onToggle("female")}
          className={`flex-1 py-2 text-xs font-body tracking-wider uppercase transition-colors ${
            currentSex === "female"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          ♀ Female
        </button>
      </div>

      {/* Description */}
      <p className="text-sm font-body text-foreground leading-relaxed mb-1">{info.description}</p>
      <p className="text-xs font-body text-muted-foreground">
        <span className="uppercase tracking-wider">Colors:</span> {info.colorNotes}
      </p>
    </div>
  );
};

export default DimorphismToggle;
