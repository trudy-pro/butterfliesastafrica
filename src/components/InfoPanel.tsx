import { X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface InfoPanelProps {
  onClose: () => void;
}

const InfoPanel = ({ onClose }: InfoPanelProps) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-specimen-overlay/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg bg-background overflow-y-auto p-10 animate-slide-in">
        <div className="flex items-start justify-between mb-10">
          <h2 className="text-3xl font-display italic text-foreground">{t("info.title")}</h2>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-8 font-body text-sm leading-relaxed">
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("info.mission")}</h3>
            <p className="text-foreground">{t("info.missionText")}</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("info.variation")}</h3>
            <p className="text-foreground">{t("info.variationText")}</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("info.spatial")}</h3>
            <ul className="space-y-3 text-foreground">
              <li><span className="font-medium">{t("info.collection")}</span> — {t("info.collectionDesc")}</li>
              <li><span className="font-medium">{t("info.comparative")}</span> — {t("info.comparativeDesc")}</li>
              <li><span className="font-medium">{t("info.interpretation")}</span> — {t("info.interpretationDesc")}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("info.documentation")}</h3>
            <p className="text-foreground">{t("info.documentationText")}</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("info.purpose")}</h3>
            <p className="text-foreground">{t("info.purposeText")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
