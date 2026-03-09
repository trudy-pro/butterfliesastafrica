import { useState } from "react";
import { ButterflySpecimen } from "@/data/butterflies";
import { X, Printer, Download, Layers } from "lucide-react";
import { jsPDF } from "jspdf";
import { useLanguage } from "@/i18n/LanguageContext";
import { getSpecimenTypography } from "@/lib/specimenTypography";
import DeepZoomViewer from "@/components/DeepZoomViewer";
import SeasonalityChart from "@/components/SeasonalityChart";
import AnatomyOverlay from "@/components/AnatomyOverlay";
import DimorphismToggle from "@/components/DimorphismToggle";
import { getAnatomyHotspots } from "@/data/wingAnatomy";
import { getDimorphism } from "@/data/dimorphism";
import { getFlightStyles } from "@/data/flightStyles";
import FlightStyleTag from "@/components/FlightStyleTag";

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

  const [anatomyVisible, setAnatomyVisible] = useState(false);
  const hotspots = getAnatomyHotspots(specimen.wingShape);
  const dimorphism = getDimorphism(specimen.id);
  const [currentSex, setCurrentSex] = useState<"male" | "female">(dimorphism?.defaultSex ?? "male");
  const flightStyles = getFlightStyles(specimen.id);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html>
<html><head><title>${displayName} — Specimen</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; max-width: 700px; margin: 0 auto; padding: 40px 24px; }
  h1 { font-family: 'Fraunces', serif; font-size: 28px; margin-bottom: 4px; }
  .sci { font-style: italic; color: #666; font-size: 14px; margin-bottom: 24px; }
  .id-label { font-size: 11px; letter-spacing: 0.15em; color: #999; text-transform: uppercase; margin-bottom: 4px; }
  .section { margin-bottom: 20px; }
  .section-title { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; margin-bottom: 8px; border-bottom: 1px solid #e5e5e5; padding-bottom: 4px; }
  .row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
  .row-label { color: #888; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; }
  .row-value { text-align: right; max-width: 60%; }
  .colors { display: flex; gap: 6px; flex-wrap: wrap; }
  .color-tag { padding: 2px 10px; font-size: 12px; background: #f5f5f0; border-radius: 2px; }
  .desc { font-size: 13px; line-height: 1.7; color: #444; }
  .img-container { text-align: center; margin-bottom: 24px; }
  .img-container img { max-width: 100%; max-height: 300px; object-fit: contain; }
  @media print { body { padding: 20px 0; } }
</style></head><body>
  <div class="img-container"><img src="${specimen.image}" alt="${displayName}" /></div>
  <p class="id-label">${specimen.id.toUpperCase()}</p>
  <h1>${displayName}</h1>
  <p class="sci">${specimen.scientificName}</p>

  <div class="section">
    <p class="section-title">Taxonomic Data</p>
    <div class="row"><span class="row-label">Family</span><span class="row-value">${specimen.family}</span></div>
    <div class="row"><span class="row-label">Genus</span><span class="row-value">${specimen.genus}</span></div>
    <div class="row"><span class="row-label">Species</span><span class="row-value">${specimen.species}</span></div>
  </div>

  <div class="section">
    <p class="section-title">Geographic Distribution</p>
    <div class="row"><span class="row-label">Region</span><span class="row-value">${specimen.region}</span></div>
    <div class="row"><span class="row-label">Habitat</span><span class="row-value">${specimen.habitat}</span></div>
    <div class="row"><span class="row-label">Migration</span><span class="row-value">${specimen.migration}</span></div>
  </div>

  <div class="section">
    <p class="section-title">Color Spectrum</p>
    <div class="colors">${specimen.colors.map(c => `<span class="color-tag">${c}</span>`).join("")}</div>
  </div>

  <div class="section">
    <p class="section-title">Pattern &amp; Morphology</p>
    <div class="row"><span class="row-label">Pattern</span><span class="row-value">${specimen.pattern}</span></div>
    <div class="row"><span class="row-label">Symmetry</span><span class="row-value">${specimen.symmetry}</span></div>
    <div class="row"><span class="row-label">Wingspan</span><span class="row-value">${specimen.wingspan}</span></div>
    <div class="row"><span class="row-label">Wing Shape</span><span class="row-value">${specimen.wingShape}</span></div>
  </div>

  <div class="section">
    <p class="section-title">Evolutionary Trait</p>
    <p class="desc">${displayTrait}</p>
  </div>

  <div class="section">
    <p class="section-title">Notes</p>
    <p class="desc">${displayDesc}</p>
  </div>
</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  };

  const handleDownloadPdf = async () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pw = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentW = pw - margin * 2;
    let y = margin;

    const checkPage = (needed: number) => {
      if (y + needed > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
    };

    try {
      const res = await fetch(specimen.image);
      const blob = await res.blob();
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      checkPage(70);
      doc.addImage(dataUrl, "JPEG", margin, y, contentW, 60, undefined, "FAST");
      y += 68;
    } catch { /* skip */ }

    doc.setFontSize(8); doc.setTextColor(153);
    doc.text(specimen.id.toUpperCase(), margin, y); y += 6;
    doc.setFontSize(22); doc.setTextColor(26);
    doc.text(displayName, margin, y); y += 8;
    doc.setFontSize(11); doc.setTextColor(102);
    doc.text(specimen.scientificName, margin, y); y += 10;

    const sectionTitle = (title: string) => {
      checkPage(14); doc.setFontSize(8); doc.setTextColor(153);
      doc.text(title.toUpperCase(), margin, y); y += 2;
      doc.setDrawColor(229); doc.line(margin, y, margin + contentW, y); y += 5;
    };
    const row = (label: string, value: string) => {
      checkPage(8); doc.setFontSize(9); doc.setTextColor(136);
      doc.text(label.toUpperCase(), margin, y);
      doc.setTextColor(26);
      const lines = doc.splitTextToSize(value, contentW * 0.55);
      doc.text(lines, margin + contentW, y, { align: "right" });
      y += Math.max(lines.length * 4.5, 5) + 1;
    };
    const paragraph = (text: string) => {
      doc.setFontSize(10); doc.setTextColor(68);
      const lines = doc.splitTextToSize(text, contentW);
      checkPage(lines.length * 5);
      doc.text(lines, margin, y); y += lines.length * 5 + 4;
    };

    sectionTitle("Taxonomic Data");
    row("Family", specimen.family); row("Genus", specimen.genus); row("Species", specimen.species); y += 4;
    sectionTitle("Geographic Distribution");
    row("Region", specimen.region); row("Habitat", specimen.habitat); row("Migration", specimen.migration); y += 4;
    sectionTitle("Color Spectrum");
    doc.setFontSize(10); doc.setTextColor(26);
    doc.text(specimen.colors.join(", "), margin, y); y += 8;
    sectionTitle("Pattern & Morphology");
    row("Pattern", specimen.pattern); row("Symmetry", specimen.symmetry);
    row("Wingspan", specimen.wingspan); row("Wing Shape", specimen.wingShape); y += 4;
    sectionTitle("Evolutionary Trait"); paragraph(displayTrait);
    sectionTitle("Notes"); paragraph(displayDesc);

    doc.save(`${specimen.id}-specimen.pdf`);
  };

  return (
    <div className="fixed inset-0 z-[60] flex">
      <div className="absolute inset-0 bg-specimen-overlay/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative ml-auto w-full max-w-2xl bg-background overflow-y-auto animate-slide-in flex flex-col lg:flex-row">
        <div className="lg:w-1/2 bg-card flex items-center justify-center min-h-[300px] lg:min-h-0 relative">
          <DeepZoomViewer
            src={specimen.image}
            alt={`${displayName} specimen`}
          />
          <AnatomyOverlay hotspots={hotspots} visible={anatomyVisible} />

          <button
            onClick={() => setAnatomyVisible(!anatomyVisible)}
            className={`absolute bottom-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-body tracking-wider uppercase border transition-colors ${
              anatomyVisible
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card/90 backdrop-blur-sm text-muted-foreground border-border hover:bg-card"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Anatomy
          </button>

          {dimorphism && (
            <div className="absolute top-3 left-3 z-30 px-2 py-1 rounded-md bg-card/90 backdrop-blur-sm border border-border">
              <span className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">
                {currentSex === "male" ? "♂ Male" : "♀ Female"}
              </span>
            </div>
          )}
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
            <div className="flex items-center gap-2">
              <button onClick={handleDownloadPdf} className="p-1 text-muted-foreground hover:text-foreground transition-colors" title="Download PDF">
                <Download size={18} />
              </button>
              <button onClick={handlePrint} className="p-1 text-muted-foreground hover:text-foreground transition-colors" title="Print-friendly view">
                <Printer size={18} />
              </button>
              <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                <X size={18} />
              </button>
            </div>
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

          <SeasonalityChart specimenId={specimen.id} />

          {dimorphism && (
            <DimorphismToggle
              dimorphism={dimorphism}
              currentSex={currentSex}
              onToggle={setCurrentSex}
            />
          )}

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
