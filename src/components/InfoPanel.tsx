import { X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

// Import specimen images for each country
import burundiImg from "@/assets/specimens/appias-epaphia.jpg";
import ethiopiaImg from "@/assets/specimens/colotis-danae.jpg";
import kenyaImg from "@/assets/specimens/graphium-colonna.jpg";
import tanzaniaImg from "@/assets/specimens/charaxes-brutus.jpg";
import rwandaImg from "@/assets/specimens/graphium-policenes.jpg";
import southSudanImg from "@/assets/specimens/graphium-policenes.jpg";
import ugandaImg from "@/assets/specimens/papilio-antimachus.jpg";

interface CountryEntry {
  name: string;
  capital: string;
  speciesCount: number;
  image: string;
  headline: string;
  description: string;
}

const countries: CountryEntry[] = [
  {
    name: "BURUNDI",
    capital: "Gitega",
    speciesCount: 210,
    image: burundiImg,
    headline: "THE HEART OF AFRICA",
    description: "The heart of Africa. Burundi harbors rich Albertine Rift biodiversity with montane forests and papyrus swamps supporting unique Lepidoptera assemblages.",
  },
  {
    name: "ETHIOPIA",
    capital: "Addis Ababa",
    speciesCount: 420,
    image: ethiopiaImg,
    headline: "THE ETHIOPIAN HIGHLANDS CREATE ISOLATED SKY-ISLAND ECOSYSTEMS, DRIVING HIGH LEVELS OF ENDEMISM AMONG BUTTERFLY POPULATIONS ADAPTED TO AFROALPINE CONDITIONS",
    description: "The Ethiopian Highlands create isolated sky-island ecosystems, driving high levels of endemism among butterfly populations adapted to Afroalpine conditions.",
  },
  {
    name: "KENYA",
    capital: "Nairobi",
    speciesCount: 870,
    image: kenyaImg,
    headline: "KENYA'S DRAMATIC ELEVATION GRADIENTS — FROM INDIAN OCEAN COASTLINE TO MOUNT KENYA'S GLACIERS — CREATE EXTRAORDINARY HABITAT DIVERSITY SUPPORTING OVER 870 DOCUMENTED BUTTERFLY SPECIES",
    description: "Kenya's dramatic elevation gradients — from Indian Ocean coastline to Mount Kenya's glaciers — create extraordinary habitat diversity supporting over 870 documented butterfly species.",
  },
  {
    name: "TANZANIA",
    capital: "Dodoma",
    speciesCount: 1100,
    image: tanzaniaImg,
    headline: "TANZANIA HOSTS THE GREATEST BUTTERFLY DIVERSITY IN EAST AFRICA",
    description: "Tanzania hosts the greatest butterfly diversity in East Africa. The Eastern Arc Mountains — ancient crystalline ranges — harbor exceptional endemism, with many species found nowhere else on Earth.",
  },
  {
    name: "RWANDA",
    capital: "Kigali",
    speciesCount: 380,
    image: rwandaImg,
    headline: "THE 'LAND OF A THOUSAND HILLS' SITS AT THE INTERSECTION OF THE ALBERTINE RIFT AND CONGO BASIN, CREATING A MOSAIC OF MONTANE HABITATS RICH IN BUTTERFLY DIVERSITY",
    description: "The 'Land of a Thousand Hills' sits at the intersection of the Albertine Rift and Congo Basin, creating a mosaic of montane habitats rich in butterfly diversity.",
  },
  {
    name: "SOUTH SUDAN",
    capital: "Juba",
    speciesCount: 290,
    image: southSudanImg,
    headline: "THE SUDD — ONE OF THE WORLD'S LARGEST WETLANDS — ALONG WITH IMATONG MOUNTAINS SUPPORT POORLY DOCUMENTED BUT POTENTIALLY SIGNIFICANT BUTTERFLY POPULATIONS AT THE OVERLAP OF SUDANIAN AND EAST AFRICAN BIOREGIONS",
    description: "The Sudd — one of the world's largest wetlands — along with Imatong Mountains support poorly documented but potentially significant butterfly populations at the overlap of Sudanian and East African bioregions.",
  },
  {
    name: "UGANDA",
    capital: "Kampala",
    speciesCount: 1250,
    image: ugandaImg,
    headline: "POSITIONED WHERE THE EAST AFRICAN SAVANNA MEETS THE CONGO BASIN RAINFOREST, UGANDA SUPPORTS OVER 1,250 BUTTERFLY SPECIES — ONE OF THE HIGHEST CONCENTRATIONS ON THE CONTINENT",
    description: "Positioned where the East African savanna meets the Congo Basin rainforest, Uganda supports over 1,250 butterfly species — one of the highest concentrations on the continent.",
  },
];

interface InfoPanelProps {
  onClose: () => void;
}

const InfoPanel = ({ onClose }: InfoPanelProps) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-specimen-overlay/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg bg-background overflow-y-auto animate-slide-in">
        {/* Sticky header with close + nav */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-10 pt-10 pb-4">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-3xl font-display italic text-foreground">{t("info.title")}</h2>
            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <X size={18} />
            </button>
          </div>
          <nav className="flex flex-wrap gap-2">
            {countries.map((country) => (
              <button
                key={country.name}
                onClick={() => {
                  document.getElementById(`country-${country.name}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="text-xs font-body text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 transition-colors hover:bg-muted"
              >
                {country.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="px-10 pt-8 pb-10">
        <div className="space-y-8 font-body text-sm leading-relaxed mb-16">
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

        {/* Country sections */}
        <div className="space-y-0">
          {countries.map((country, index) => (
            <div key={country.name} id={`country-${country.name}`} className="scroll-mt-4">
              {index > 0 && <hr className="border-border my-12" />}
              <div className="space-y-4">
                {/* Large country name */}
                <h2 className="text-5xl md:text-6xl font-display font-black text-muted-foreground/30 leading-none tracking-tight uppercase">
                  {country.name}
                </h2>

                {/* Badge + capital + count */}
                <div className="flex items-center gap-3">
                  <span className="bg-foreground text-background text-xs font-bold uppercase tracking-wider px-3 py-1">
                    {country.name}
                  </span>
                  <span className="text-sm text-muted-foreground font-body">{country.capital}</span>
                  <span className="text-sm text-muted-foreground font-body">{country.speciesCount.toLocaleString()}</span>
                </div>

                {/* Butterfly image */}
                <img
                  src={country.image}
                  alt={`Representative butterfly specimen from ${country.name}`}
                  className="w-full aspect-[4/3] object-cover"
                />

                {/* Bold headline */}
                <h3 className="text-xl md:text-2xl font-display font-black text-foreground leading-tight uppercase">
                  {country.headline}
                </h3>

                {/* Description */}
                <p className="text-sm font-body text-muted-foreground leading-relaxed">
                  {country.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
