import { X } from "lucide-react";

interface InfoPanelProps {
  onClose: () => void;
}

const InfoPanel = ({ onClose }: InfoPanelProps) => {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-specimen-overlay/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg bg-background overflow-y-auto p-10 animate-slide-in">
        <div className="flex items-start justify-between mb-10">
          <h2 className="text-3xl font-display italic text-foreground">About</h2>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-8 font-body text-sm leading-relaxed">
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Mission</h3>
            <p className="text-foreground">
              An archive dedicated to exploring natural selection in Color, Pattern, Shape, and Form — documenting butterfly species across East Africa. This project combines scientific research, specimen preservation, and public exhibition.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Natural Selection & Variation</h3>
            <p className="text-foreground">
              Butterflies display diverse colors, patterns, and wing shapes due to environmental pressures. Key influences include predation, climate, vegetation, and mimicry. The archive organizes species by both taxonomy and visual evolutionary traits.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Spatial Organization</h3>
            <ul className="space-y-3 text-foreground">
              <li>
                <span className="font-medium">Collection & Preservation Zone</span> — Climate-controlled storage for specimens.
              </li>
              <li>
                <span className="font-medium">Comparative Study Zone</span> — Research area for analyzing color, wing shapes, patterns, and forms.
              </li>
              <li>
                <span className="font-medium">Interpretation & Exhibition Zone</span> — Public displays explaining evolutionary processes.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Documentation</h3>
            <p className="text-foreground">
              Each specimen is documented with taxonomic classification, geographic origin and habitat, wing color spectrum, pattern geometry and symmetry, and morphological measurements. Physical specimens are supported by digital scanning and databases.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Purpose</h3>
            <p className="text-foreground">
              The archive acts as both a scientific repository and an educational space. Storage and displays encourage visual comparison between species. The project reveals how natural selection shapes biodiversity in East Africa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
