import { useState } from "react";
import { ButterflySpecimen, specimens } from "@/data/butterflies";
import { X, ArrowLeftRight } from "lucide-react";

interface ComparisonViewProps {
  onClose: () => void;
  initialSpecimen?: ButterflySpecimen | null;
}

const SlotPicker = ({
  label,
  selected,
  onSelect,
  excludeId,
}: {
  label: string;
  selected: ButterflySpecimen | null;
  onSelect: (s: ButterflySpecimen) => void;
  excludeId?: string;
}) => {
  const [picking, setPicking] = useState(false);

  if (picking) {
    return (
      <div className="flex-1 overflow-y-auto bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground">Select {label}</p>
          <button onClick={() => setPicking(false)} className="text-xs font-body text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {specimens
            .filter((s) => s.id !== excludeId)
            .map((s) => (
              <button
                key={s.id}
                onClick={() => { onSelect(s); setPicking(false); }}
                className="group text-left"
              >
                <img src={s.image} alt={s.commonName} className="w-full aspect-[3/4] object-cover rounded-sm bg-background group-hover:opacity-80 transition-opacity" />
                <p className="text-[10px] font-body text-muted-foreground mt-1 truncate">{s.commonName}</p>
              </button>
            ))}
        </div>
      </div>
    );
  }

  if (!selected) {
    return (
      <button
        onClick={() => setPicking(true)}
        className="flex-1 flex flex-col items-center justify-center bg-card border border-dashed border-border rounded-sm min-h-[300px] hover:bg-secondary/50 transition-colors"
      >
        <span className="text-3xl text-muted-foreground/30 mb-3">+</span>
        <span className="text-sm font-body text-muted-foreground">Select {label}</span>
      </button>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-card rounded-sm overflow-hidden">
      <div className="relative flex items-center justify-center p-6 bg-background flex-shrink-0">
        <img src={selected.image} alt={selected.commonName} className="max-h-[250px] object-contain" />
        <button
          onClick={() => setPicking(true)}
          className="absolute top-3 right-3 text-[10px] font-body text-muted-foreground hover:text-foreground bg-card/80 px-2 py-1 rounded-sm transition-colors"
        >
          Change
        </button>
      </div>
      <div className="p-4 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-body text-muted-foreground tracking-widest">{selected.id.toUpperCase()}</p>
        <h3 className="text-lg font-display italic text-foreground">{selected.commonName}</h3>
        <p className="text-xs font-body italic text-muted-foreground mb-3">{selected.scientificName}</p>
        <ComparisonRow label="Family" value={selected.family} />
        <ComparisonRow label="Habitat" value={selected.habitat} />
        <ComparisonRow label="Region" value={selected.region} />
        <ComparisonRow label="Migration" value={selected.migration} />
        <ComparisonRow label="Colors" value={selected.colors.join(", ")} />
        <ComparisonRow label="Pattern" value={selected.pattern} />
        <ComparisonRow label="Wing Shape" value={selected.wingShape} />
        <ComparisonRow label="Symmetry" value={selected.symmetry} />
        <ComparisonRow label="Wingspan" value={selected.wingspan} />
        <div className="pt-2">
          <p className="text-[10px] font-body uppercase tracking-[0.15em] text-muted-foreground mb-1">Evolutionary Trait</p>
          <p className="text-xs font-body text-foreground leading-relaxed">{selected.evolutionaryTrait}</p>
        </div>
      </div>
    </div>
  );
};

const ComparisonRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-1.5 border-b border-border">
    <span className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">{label}</span>
    <span className="text-xs font-body text-foreground text-right max-w-[65%]">{value}</span>
  </div>
);

const ComparisonView = ({ onClose, initialSpecimen }: ComparisonViewProps) => {
  const [specimenA, setSpecimenA] = useState<ButterflySpecimen | null>(initialSpecimen ?? null);
  const [specimenB, setSpecimenB] = useState<ButterflySpecimen | null>(null);

  const swap = () => {
    setSpecimenA(specimenB);
    setSpecimenB(specimenA);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
        <h2 className="text-xl font-display italic text-foreground flex items-center gap-3">
          <ArrowLeftRight size={18} className="text-muted-foreground" />
          Compare Specimens
        </h2>
        <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Comparison body */}
      <div className="flex-1 flex gap-3 p-4 overflow-hidden min-h-0">
        <SlotPicker label="Specimen A" selected={specimenA} onSelect={setSpecimenA} excludeId={specimenB?.id} />

        {/* Swap button */}
        {specimenA && specimenB && (
          <div className="flex items-center">
            <button
              onClick={swap}
              className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
              title="Swap specimens"
            >
              <ArrowLeftRight size={14} />
            </button>
          </div>
        )}

        <SlotPicker label="Specimen B" selected={specimenB} onSelect={setSpecimenB} excludeId={specimenA?.id} />
      </div>
    </div>
  );
};

export default ComparisonView;
