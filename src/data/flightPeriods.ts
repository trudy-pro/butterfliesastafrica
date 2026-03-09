/**
 * Flight period data for East African butterflies.
 * Values 0–1 represent relative abundance per month (0 = absent, 1 = peak).
 * Based on East African bimodal rainfall: long rains Mar–May, short rains Oct–Dec.
 * Index 0 = January, 11 = December.
 */
export type FlightActivity = [number, number, number, number, number, number, number, number, number, number, number, number];

// Utility month labels
export const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Returns the current month index (0-based).
 */
export const getCurrentMonth = () => new Date().getMonth();

/**
 * Check if a specimen is in peak flight (activity >= 0.6) for a given month.
 */
export const isInPeakFlight = (activity: FlightActivity, month: number): boolean => {
  return activity[month] >= 0.6;
};

/**
 * Flight periods keyed by specimen id.
 * Activity patterns reflect:
 * - Migratory species: broad peaks around rainy seasons
 * - Resident forest species: year-round with slight peaks
 * - Seasonal species: bimodal peaks following rains
 * - Savanna species: peak in wet seasons, low in dry (Jun–Sep)
 */
export const flightPeriods: Record<string, FlightActivity> = {
  // dc-001 African Monarch – migratory, savanna, year-round with wet-season peaks
  "dc-001": [0.5, 0.6, 0.8, 1.0, 0.9, 0.4, 0.3, 0.3, 0.4, 0.7, 0.9, 0.7],
  // pd-002 African Swallowtail – resident, forest, year-round
  "pd-002": [0.6, 0.6, 0.7, 0.8, 0.8, 0.5, 0.5, 0.5, 0.6, 0.7, 0.8, 0.7],
  // ga-003 Large Striped Swordtail – resident, forest
  "ga-003": [0.5, 0.6, 0.7, 0.9, 0.8, 0.4, 0.4, 0.4, 0.5, 0.7, 0.8, 0.6],
  // ba-004 Squinting Bush Brown – resident, woodland, seasonal polyphenism
  "ba-004": [0.4, 0.5, 0.7, 0.9, 1.0, 0.5, 0.3, 0.3, 0.4, 0.7, 0.9, 0.6],
  // cb-005 White-barred Emperor – resident, forest
  "cb-005": [0.5, 0.5, 0.6, 0.8, 0.7, 0.5, 0.5, 0.5, 0.6, 0.7, 0.7, 0.6],
  // hm-006 Diadem – migratory, savanna
  "hm-006": [0.4, 0.5, 0.7, 0.9, 0.9, 0.3, 0.2, 0.3, 0.5, 0.8, 1.0, 0.6],
  // jo-007 Blue Pansy – seasonal, grassland
  "jo-007": [0.3, 0.4, 0.7, 0.9, 0.8, 0.3, 0.2, 0.3, 0.5, 0.8, 0.9, 0.5],
  // aa-008 Small Orange Acraea – seasonal, savanna
  "aa-008": [0.4, 0.5, 0.8, 1.0, 0.9, 0.3, 0.2, 0.2, 0.4, 0.7, 0.9, 0.6],
  // cd-009 Crimson Tip – seasonal, savanna
  "cd-009": [0.3, 0.4, 0.6, 0.8, 0.7, 0.2, 0.1, 0.2, 0.4, 0.7, 0.8, 0.5],
  // po-010 Gaudy Commodore – seasonal, montane
  "po-010": [0.4, 0.5, 0.7, 0.9, 0.8, 0.4, 0.3, 0.3, 0.5, 0.7, 0.8, 0.5],
  // eh-011 Common Grass Yellow – resident, grassland, year-round
  "eh-011": [0.6, 0.7, 0.8, 0.9, 0.9, 0.5, 0.4, 0.5, 0.6, 0.8, 0.9, 0.7],
  // pn-012 Narrow Green-banded Swallowtail – resident, forest
  "pn-012": [0.5, 0.6, 0.7, 0.8, 0.8, 0.5, 0.4, 0.5, 0.6, 0.7, 0.8, 0.6],
  // bau-013 Pioneer White – migratory, savanna
  "bau-013": [0.4, 0.5, 0.7, 0.9, 0.8, 0.3, 0.3, 0.3, 0.5, 0.7, 0.9, 0.6],
  // cc-014 Giant Charaxes – resident, forest
  "cc-014": [0.5, 0.5, 0.6, 0.7, 0.7, 0.5, 0.5, 0.5, 0.6, 0.6, 0.7, 0.5],
  // sp-015 Forest Mother-of-Pearl – resident, montane
  "sp-015": [0.5, 0.6, 0.7, 0.8, 0.8, 0.5, 0.4, 0.5, 0.6, 0.7, 0.8, 0.6],
  // cs-016 Blood-red Glider – resident, forest
  "cs-016": [0.5, 0.6, 0.7, 0.8, 0.7, 0.5, 0.4, 0.4, 0.5, 0.7, 0.7, 0.6],
  // pdm-017 Citrus Swallowtail – resident, woodland
  "pdm-017": [0.5, 0.6, 0.8, 0.9, 0.9, 0.4, 0.3, 0.4, 0.5, 0.8, 0.9, 0.7],
  // cf-018 African Migrant – migratory, savanna
  "cf-018": [0.3, 0.5, 0.7, 0.9, 1.0, 0.4, 0.2, 0.3, 0.5, 0.8, 1.0, 0.5],
  // an-019 Friar – resident, forest
  "an-019": [0.6, 0.6, 0.7, 0.8, 0.7, 0.5, 0.5, 0.5, 0.6, 0.7, 0.7, 0.6],
  // gp-020 Small Striped Swordtail – resident, forest
  "gp-020": [0.5, 0.5, 0.7, 0.8, 0.8, 0.4, 0.4, 0.4, 0.5, 0.7, 0.8, 0.6],
  // en-021 Gold-banded Forester – resident, forest
  "en-021": [0.5, 0.6, 0.7, 0.8, 0.7, 0.5, 0.5, 0.5, 0.6, 0.7, 0.7, 0.6],
  // ma-022 Common Dotted Border – seasonal, woodland
  "ma-022": [0.4, 0.5, 0.7, 0.9, 0.8, 0.3, 0.2, 0.3, 0.5, 0.8, 0.9, 0.6],
  // pp-023 Common Leopard – seasonal, savanna
  "pp-023": [0.5, 0.6, 0.8, 0.9, 0.9, 0.4, 0.3, 0.3, 0.5, 0.8, 0.9, 0.6],
  // vc-024 Painted Lady – migratory, cosmopolitan
  "vc-024": [0.4, 0.5, 0.7, 0.8, 0.8, 0.5, 0.4, 0.4, 0.6, 0.8, 0.9, 0.6],
  // cv-025 Pearl Charaxes – resident, forest
  "cv-025": [0.5, 0.5, 0.6, 0.7, 0.7, 0.5, 0.5, 0.5, 0.6, 0.7, 0.7, 0.6],
  // poph-026 Emperor Swallowtail – resident, forest
  "poph-026": [0.4, 0.5, 0.7, 0.8, 0.8, 0.4, 0.4, 0.4, 0.5, 0.7, 0.8, 0.5],
  // az-027 Large Spotted Acraea – seasonal, woodland
  "az-027": [0.4, 0.5, 0.8, 1.0, 0.9, 0.3, 0.2, 0.3, 0.4, 0.7, 0.9, 0.6],
  // cj-028 Two-tailed Pasha – seasonal, coastal
  "cj-028": [0.5, 0.6, 0.7, 0.8, 0.7, 0.4, 0.3, 0.4, 0.5, 0.7, 0.8, 0.6],
  // ns-029 Malagasy Sailor – resident, forest
  "ns-029": [0.5, 0.6, 0.7, 0.8, 0.7, 0.5, 0.5, 0.5, 0.6, 0.7, 0.7, 0.6],
  // ce-030 Smoky Orange Tip – seasonal, savanna
  "ce-030": [0.3, 0.4, 0.6, 0.8, 0.7, 0.2, 0.1, 0.2, 0.3, 0.6, 0.8, 0.5],
  // lp-031 Common Zebra Blue – seasonal, woodland
  "lp-031": [0.5, 0.6, 0.8, 0.9, 0.8, 0.4, 0.3, 0.4, 0.5, 0.7, 0.9, 0.6],
  // dp-032 Monarch – migratory, cosmopolitan
  "dp-032": [0.4, 0.5, 0.7, 0.8, 0.8, 0.4, 0.3, 0.4, 0.5, 0.7, 0.8, 0.5],
  // pa-033 African Giant Swallowtail – resident, forest
  "pa-033": [0.4, 0.5, 0.6, 0.8, 0.7, 0.5, 0.4, 0.5, 0.5, 0.6, 0.7, 0.5],
  // ca-034 Bushveld Charaxes – seasonal, savanna
  "ca-034": [0.4, 0.5, 0.7, 0.9, 0.8, 0.3, 0.3, 0.3, 0.5, 0.7, 0.8, 0.5],
  // pm-035 Green-banded Swallowtail – resident, forest
  "pm-035": [0.5, 0.5, 0.6, 0.7, 0.7, 0.5, 0.5, 0.5, 0.6, 0.7, 0.7, 0.6],
  // eh-036 Large Green Forester – resident, forest
  "eh-036": [0.5, 0.6, 0.7, 0.8, 0.7, 0.5, 0.5, 0.5, 0.6, 0.7, 0.8, 0.6],
  // ae-037 Common Acraea – seasonal, grassland
  "ae-037": [0.5, 0.6, 0.8, 1.0, 0.9, 0.4, 0.3, 0.3, 0.5, 0.8, 0.9, 0.6],
  // cc-038 Cream-banded Glider – resident, forest
  "cc-038": [0.5, 0.6, 0.7, 0.8, 0.7, 0.5, 0.5, 0.5, 0.5, 0.7, 0.7, 0.6],
  // gc-039 Mamba Swordtail – resident, montane
  "gc-039": [0.4, 0.5, 0.6, 0.8, 0.7, 0.4, 0.4, 0.4, 0.5, 0.7, 0.8, 0.5],
  // pl-040 False Acraea – resident, forest
  "pl-040": [0.5, 0.6, 0.7, 0.8, 0.8, 0.5, 0.5, 0.5, 0.6, 0.7, 0.8, 0.6],
  // ci-041 Violet Tip – seasonal, savanna
  "ci-041": [0.3, 0.4, 0.7, 0.9, 0.8, 0.2, 0.1, 0.2, 0.4, 0.7, 0.9, 0.5],
  // bi-042 Spotted Joker – seasonal, savanna
  "bi-042": [0.4, 0.5, 0.7, 0.9, 0.8, 0.3, 0.2, 0.3, 0.5, 0.7, 0.9, 0.5],
  // st-043 Blue-green Nymph – resident, montane
  "st-043": [0.5, 0.6, 0.7, 0.8, 0.8, 0.5, 0.5, 0.5, 0.6, 0.7, 0.8, 0.6],
  // cp-044 Flame-bordered Emperor – resident, forest
  "cp-044": [0.5, 0.5, 0.6, 0.7, 0.7, 0.5, 0.5, 0.5, 0.6, 0.7, 0.7, 0.6],
  // jh-045 Yellow Pansy – seasonal, grassland
  "jh-045": [0.3, 0.4, 0.7, 0.9, 0.8, 0.3, 0.2, 0.2, 0.4, 0.7, 0.9, 0.5],
  // ap-046 African Albatross – seasonal, woodland
  "ap-046": [0.4, 0.5, 0.7, 0.9, 0.8, 0.3, 0.2, 0.3, 0.5, 0.7, 0.9, 0.6],
  // hd-047 Guinea Fowl Butterfly – seasonal, savanna
  "hd-047": [0.4, 0.5, 0.7, 0.9, 0.8, 0.3, 0.2, 0.3, 0.5, 0.8, 0.9, 0.6],
  // ec-048 Smooth-palped Blue Forester – resident, forest
  "ec-048": [0.5, 0.6, 0.7, 0.8, 0.7, 0.5, 0.5, 0.5, 0.6, 0.7, 0.7, 0.6],
  // at-049 Common Scarlet – seasonal, savanna
  "at-049": [0.4, 0.5, 0.7, 0.9, 0.8, 0.3, 0.2, 0.3, 0.4, 0.7, 0.8, 0.5],
  // ml-051 Common Evening Brown – resident, woodland
  "ml-051": [0.6, 0.6, 0.7, 0.8, 0.8, 0.5, 0.5, 0.5, 0.6, 0.7, 0.8, 0.6],
  // ad-052 Common Hairtail – seasonal, woodland
  "ad-052": [0.4, 0.5, 0.7, 0.9, 0.8, 0.3, 0.3, 0.3, 0.5, 0.7, 0.9, 0.6],
  // cd-053 Druce's Charaxes – resident, montane
  "cd-053": [0.5, 0.5, 0.6, 0.7, 0.7, 0.5, 0.5, 0.5, 0.6, 0.7, 0.7, 0.6],
  // ac-054 Collins' Ash Blue – seasonal, grassland
  "ac-054": [0.3, 0.4, 0.6, 0.8, 0.7, 0.3, 0.2, 0.3, 0.4, 0.7, 0.8, 0.5],
  // av-055 Congo Glasswing Acraea – resident, forest
  "av-055": [0.5, 0.6, 0.7, 0.8, 0.7, 0.5, 0.5, 0.5, 0.6, 0.7, 0.7, 0.6],
  // ms-056 Common Fig-tree Blue – seasonal, woodland
  "ms-056": [0.4, 0.5, 0.7, 0.9, 0.8, 0.3, 0.3, 0.3, 0.5, 0.7, 0.8, 0.5],
  // st-057 Elfin Skipper – seasonal, grassland
  "st-057": [0.3, 0.4, 0.6, 0.8, 0.7, 0.3, 0.2, 0.2, 0.4, 0.6, 0.8, 0.5],
  // pa-058 Darker Commodore – seasonal, savanna
  "pa-058": [0.4, 0.5, 0.7, 0.9, 0.8, 0.3, 0.2, 0.3, 0.5, 0.8, 0.9, 0.5],
  // mg-059 Gabela Dotted Border – resident, montane
  "mg-059": [0.5, 0.5, 0.6, 0.7, 0.7, 0.5, 0.5, 0.5, 0.6, 0.7, 0.7, 0.6],
  // bo-060 Ochre Bush Brown – resident, woodland
  "bo-060": [0.5, 0.6, 0.7, 0.8, 0.8, 0.5, 0.4, 0.4, 0.5, 0.7, 0.8, 0.6],
  // ar-061 Red-ringed Hairtail – seasonal, woodland
  "ar-061": [0.4, 0.5, 0.7, 0.9, 0.8, 0.3, 0.2, 0.3, 0.5, 0.7, 0.8, 0.5],
  // ac-062 Canopus Skipper – seasonal, grassland
  "ac-062": [0.3, 0.4, 0.6, 0.8, 0.7, 0.2, 0.2, 0.2, 0.4, 0.6, 0.8, 0.4],
  // js-063 Little Commodore – seasonal, savanna
  "js-063": [0.4, 0.5, 0.7, 0.9, 0.8, 0.3, 0.2, 0.3, 0.5, 0.7, 0.9, 0.5],
  // pc-064 Constantine's Swallowtail – resident, montane
  "pc-064": [0.4, 0.5, 0.6, 0.8, 0.7, 0.4, 0.4, 0.4, 0.5, 0.7, 0.8, 0.5],
  // cpro-065 Red Tip – seasonal, savanna
  "cpro-065": [0.3, 0.4, 0.6, 0.8, 0.7, 0.2, 0.1, 0.2, 0.3, 0.6, 0.8, 0.4],
  // ap-066 Montane Acraea – seasonal, montane
  "ap-066": [0.4, 0.5, 0.7, 0.8, 0.8, 0.4, 0.3, 0.3, 0.5, 0.7, 0.8, 0.5],
  // ce-067 Demon Charaxes – resident, forest
  "ce-067": [0.5, 0.5, 0.6, 0.7, 0.7, 0.5, 0.5, 0.5, 0.6, 0.7, 0.7, 0.6],
  // bc-068 Calypso White – migratory, woodland
  "bc-068": [0.3, 0.5, 0.7, 0.9, 1.0, 0.4, 0.2, 0.3, 0.5, 0.8, 0.9, 0.5],
  // nn-069 Spot Sailor – resident, forest
  "nn-069": [0.5, 0.6, 0.7, 0.8, 0.7, 0.5, 0.5, 0.5, 0.6, 0.7, 0.7, 0.6],
  // eb-070 Barombe Nymph – resident, forest
  "eb-070": [0.5, 0.6, 0.7, 0.8, 0.7, 0.5, 0.5, 0.5, 0.6, 0.7, 0.7, 0.6],
  // phan-050 Pharmacophagus antenor (if exists)
  "phan-050": [0.5, 0.6, 0.7, 0.8, 0.8, 0.5, 0.5, 0.5, 0.6, 0.7, 0.8, 0.6],
};

/**
 * Get flight activity for a specimen, with a fallback default.
 */
export const getFlightActivity = (specimenId: string): FlightActivity => {
  return flightPeriods[specimenId] ?? [0.5, 0.5, 0.6, 0.7, 0.7, 0.5, 0.4, 0.4, 0.5, 0.6, 0.7, 0.5];
};
