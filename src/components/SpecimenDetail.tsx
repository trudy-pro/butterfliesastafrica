import { ButterflySpecimen } from "@/data/butterflies";
import { X, Printer } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { getSpecimenTypography } from "@/lib/specimenTypography";
import DeepZoomViewer from "@/components/DeepZoomViewer";

interface SpecimenDetailProps {
  specimen: ButterflySpecimen;
  onClose: () => void;
  onCompare?: (specimen: ButterflySpecimen) => void;
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-2 border-b border-border">
    <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">{label}</span>
    <span className="text-sm font-body text-foreground text-right max-w-[60%]">{value}</span>
  </div>
);

const SpecimenDetail = ({ specimen, onClose, onCompare }: SpecimenDetailProps) => {
  const { t, tSpecimen } = useLanguage();
  const displayName = tSpecimen(specimen.id, "commonName") ?? specimen.commonName;
  const displayDesc = tSpecimen(specimen.id, "description") ?? specimen.description;
  const displayTrait = tSpecimen(specimen.id, "evolutionaryTrait") ?? specimen.evolutionaryTrait;
  const typo = getSpecimenTypography(specimen);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-specimen-overlay/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative ml-auto w-full max-w-2xl bg-background overflow-y-auto animate-slide-in flex flex-col lg:flex-row">
        <div className="lg:w-1/2 bg-card flex items-center justify-center min-h-[300px] lg:min-h-0">
          <DeepZoomViewer
            src={specimen.image}
            alt={`${displayName} specimen`}
          />
        </div>

        <div className="lg:w-1/2 p-8 overflow-y-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs font-body text-muted-foreground tracking-widest mb-1">{specimen.id.toUpperCase()}</p>
              <h2
                className="text-2xl leading-tight"
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
              </h2>
              <p className="text-sm font-body italic text-muted-foreground mt-1">{specimen.scientificName}</p>
            </div>
            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("detail.taxonomic")}</h3>
            <DetailRow label={t("detail.family")} value={specimen.family} />
            <DetailRow label={t("detail.genus")} value={specimen.genus} />
            <DetailRow label={t("detail.species")} value={specimen.species} />
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("detail.geographic")}</h3>
            <DetailRow label={t("detail.region")} value={specimen.region} />
            <DetailRow label={t("detail.habitat")} value={t(`habitat.${specimen.habitat}`)} />
            <DetailRow label={t("detail.migration")} value={t(`migration.${specimen.migration}`)} />
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("detail.colorSpectrum")}</h3>
            <div className="flex gap-2 flex-wrap">
              {specimen.colors.map((c) => (
                <span key={c} className="px-3 py-1 text-xs font-body bg-secondary text-secondary-foreground rounded-sm">
                  {t(`color.${c}`)}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("detail.patternGeometry")}</h3>
            <DetailRow label={t("detail.pattern")} value={t(`pattern.${specimen.pattern}`)} />
            <DetailRow label={t("detail.symmetry")} value={specimen.symmetry} />
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("detail.morphological")}</h3>
            <DetailRow label={t("detail.wingspan")} value={specimen.wingspan} />
            <DetailRow label={t("detail.wingShape")} value={t(`wingShape.${specimen.wingShape}`)} />
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("detail.evolutionaryTrait")}</h3>
            <p className="text-sm font-body text-foreground leading-relaxed">{displayTrait}</p>
          </div>

          <div>
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("detail.notes")}</h3>
            <p className="text-sm font-body text-muted-foreground leading-relaxed">{displayDesc}</p>
          </div>

          {onCompare && (
            <button
              onClick={() => onCompare(specimen)}
              className="w-full mt-4 py-3 bg-secondary text-secondary-foreground font-body text-sm tracking-wide rounded-sm hover:bg-muted transition-colors"
            >
              {t("detail.compare")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecimenDetail;
