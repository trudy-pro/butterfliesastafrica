import { useState, useRef } from "react";
import { X, Upload, Camera, Loader2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface IdentifyResult {
  identified: boolean;
  commonName?: string | null;
  scientificName?: string | null;
  family?: string | null;
  colors?: string[];
  pattern?: string | null;
  wingShape?: string | null;
  habitat?: string | null;
  description?: string | null;
  confidence?: string;
  error?: string;
}

interface IdentifyPanelProps {
  onClose: () => void;
}

const IdentifyPanel = ({ onClose }: IdentifyPanelProps) => {
  const { t } = useLanguage();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IdentifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const analyze = async () => {
    if (!imagePreview) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("identify-butterfly", {
        body: { imageBase64: imagePreview },
      });

      if (fnError) throw new Error(fnError.message);
      setResult(data as IdentifyResult);
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImagePreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-specimen-overlay/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg bg-background overflow-y-auto p-8 animate-slide-in">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display italic text-foreground">{t("identify.title")}</h2>
            <p className="text-sm font-body text-muted-foreground mt-1">{t("identify.subtitle")}</p>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Upload area */}
        {!imagePreview && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
          >
            <Upload size={32} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-sm font-body text-foreground mb-1">{t("identify.dropzone")}</p>
            <p className="text-xs font-body text-muted-foreground">{t("identify.formats")}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>
        )}

        {/* Image preview */}
        {imagePreview && (
          <div className="space-y-4">
            <div className="relative bg-card rounded-lg overflow-hidden">
              <img src={imagePreview} alt="Uploaded butterfly" className="w-full max-h-[300px] object-contain" />
              <button
                onClick={reset}
                className="absolute top-2 right-2 p-1.5 bg-background/80 rounded-full text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {!result && !loading && (
              <button
                onClick={analyze}
                className="w-full py-3 bg-search-bar text-primary-foreground font-body text-sm tracking-wide rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Camera size={16} />
                {t("identify.analyze")}
              </button>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-8">
            <Loader2 size={28} className="animate-spin text-accent mb-3" />
            <p className="text-sm font-body text-muted-foreground">{t("identify.analyzing")}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-destructive/10 rounded-lg">
            <p className="text-sm font-body text-destructive">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 space-y-4">
            {result.identified ? (
              <>
                <div className="border-b border-border pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-display italic text-foreground">{result.commonName}</h3>
                      <p className="text-sm font-body italic text-muted-foreground">{result.scientificName}</p>
                    </div>
                    {result.confidence && (
                      <span className={`px-2 py-1 text-[10px] font-body uppercase tracking-wider rounded-sm ${
                        result.confidence === "high" ? "bg-emerald-100 text-emerald-700" :
                        result.confidence === "medium" ? "bg-amber-100 text-amber-700" :
                        "bg-secondary text-secondary-foreground"
                      }`}>
                        {result.confidence}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {result.family && <ResultRow label={t("detail.family")} value={result.family} />}
                  {result.colors && result.colors.length > 0 && (
                    <div>
                      <p className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-2">{t("detail.colorSpectrum")}</p>
                      <div className="flex gap-2 flex-wrap">
                        {result.colors.map((c) => (
                          <span key={c} className="px-3 py-1 text-xs font-body bg-secondary text-secondary-foreground rounded-sm">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.pattern && <ResultRow label={t("detail.pattern")} value={result.pattern} />}
                  {result.wingShape && <ResultRow label={t("detail.wingShape")} value={result.wingShape} />}
                  {result.habitat && <ResultRow label={t("detail.habitat")} value={result.habitat} />}
                </div>

                {result.description && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-2">{t("detail.notes")}</p>
                    <p className="text-sm font-body text-foreground leading-relaxed">{result.description}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm font-body text-muted-foreground">{t("identify.notFound")}</p>
                {result.description && (
                  <p className="text-sm font-body text-foreground mt-2">{result.description}</p>
                )}
              </div>
            )}

            <button
              onClick={reset}
              className="w-full py-3 bg-secondary text-secondary-foreground font-body text-sm tracking-wide rounded-lg hover:bg-muted transition-colors"
            >
              {t("identify.tryAnother")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ResultRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-2 border-b border-border">
    <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">{label}</span>
    <span className="text-sm font-body text-foreground text-right">{value}</span>
  </div>
);

export default IdentifyPanel;
