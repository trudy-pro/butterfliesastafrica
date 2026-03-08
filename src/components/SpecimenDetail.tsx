import { ButterflySpecimen } from "@/data/butterflies";
import { X } from "lucide-react";

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
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-specimen-overlay/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative ml-auto w-full max-w-2xl bg-background overflow-y-auto animate-slide-in flex flex-col lg:flex-row">
        {/* Image section */}
        <div className="lg:w-1/2 bg-card flex items-center justify-center p-8">
          <img
            src={specimen.image}
            alt={`${specimen.commonName} specimen`}
            className="w-full max-w-[280px] object-contain"
          />
        </div>

        {/* Info section */}
        <div className="lg:w-1/2 p-8 overflow-y-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs font-body text-muted-foreground tracking-widest mb-1">{specimen.id.toUpperCase()}</p>
              <h2 className="text-2xl font-display italic text-foreground leading-tight">{specimen.commonName}</h2>
              <p className="text-sm font-body italic text-muted-foreground mt-1">{specimen.scientificName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">Taxonomic Classification</h3>
            <DetailRow label="Family" value={specimen.family} />
            <DetailRow label="Genus" value={specimen.genus} />
            <DetailRow label="Species" value={specimen.species} />
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">Geographic Origin & Habitat</h3>
            <DetailRow label="Region" value={specimen.region} />
            <DetailRow label="Habitat" value={specimen.habitat} />
            <DetailRow label="Migration" value={specimen.migration} />
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">Wing Color Spectrum</h3>
            <div className="flex gap-2 flex-wrap">
              {specimen.colors.map((c) => (
                <span key={c} className="px-3 py-1 text-xs font-body bg-secondary text-secondary-foreground rounded-sm">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">Pattern Geometry & Symmetry</h3>
            <DetailRow label="Pattern" value={specimen.pattern} />
            <DetailRow label="Symmetry" value={specimen.symmetry} />
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">Morphological Measurements</h3>
            <DetailRow label="Wingspan" value={specimen.wingspan} />
            <DetailRow label="Wing Shape" value={specimen.wingShape} />
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">Evolutionary Trait</h3>
            <p className="text-sm font-body text-foreground leading-relaxed">{specimen.evolutionaryTrait}</p>
          </div>

          <div>
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">Notes</h3>
            <p className="text-sm font-body text-muted-foreground leading-relaxed">{specimen.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecimenDetail;
