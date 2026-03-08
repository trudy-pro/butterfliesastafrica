import { useState, useRef, useEffect, useCallback } from "react";
import { X, Upload, Camera, Loader2, LogIn, LogOut, ShieldCheck, Clock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import type { User } from "@supabase/supabase-js";

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
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IdentifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

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

        {/* Auth gate */}
        {authLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center text-center py-12 space-y-5">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <Camera size={28} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-body text-foreground mb-1">Register with us to identify butterflies</p>
              <p className="text-xs font-body text-muted-foreground">Upload a photo and our AI will analyze the species.</p>
            </div>
            <button
              onClick={handleSignIn}
              className="inline-flex items-center gap-2 px-6 py-3 bg-search-bar text-primary-foreground font-body text-sm tracking-wide rounded-lg hover:opacity-90 transition-opacity"
            >
              <LogIn size={16} />
              Register with us
            </button>
          </div>
        ) : (
          <>
            {/* Signed-in user bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <span className="text-xs font-body text-muted-foreground truncate">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1 text-xs font-body text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={12} />
                Sign out
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
          </>
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
