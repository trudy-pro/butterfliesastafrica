/**
 * Specimen sighting coordinates across East Africa.
 * Each specimen has multiple sighting points for spatial queries.
 * Coordinates represent realistic sighting locations within each species' range.
 */
export interface SightingPoint {
  lat: number;
  lng: number;
  locality: string;
}

export const specimenCoordinates: Record<string, SightingPoint[]> = {
  "dc-001": [ // African Monarch
    { lat: -1.286, lng: 36.817, locality: "Nairobi NP" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: 0.347, lng: 32.582, locality: "Kampala" },
    { lat: -4.044, lng: 39.669, locality: "Mombasa" },
    { lat: -6.802, lng: 39.278, locality: "Dar es Salaam" },
  ],
  "pd-002": [ // African Swallowtail
    { lat: -0.091, lng: 34.768, locality: "Kakamega Forest" },
    { lat: -5.109, lng: 38.761, locality: "Usambara Mtns" },
    { lat: 7.046, lng: 38.476, locality: "Bale Mtns" },
    { lat: -1.050, lng: 37.074, locality: "Thika" },
  ],
  "ga-003": [ // Large Striped Swordtail
    { lat: -5.109, lng: 38.761, locality: "East Usambara" },
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: 0.462, lng: 30.212, locality: "Bwindi" },
    { lat: -6.168, lng: 35.757, locality: "Udzungwa" },
  ],
  "ba-004": [ // Squinting Bush Brown
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -4.311, lng: 38.568, locality: "Shimba Hills" },
    { lat: -8.014, lng: 31.613, locality: "Mahale" },
  ],
  "cb-005": [ // White-barred Emperor
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -5.109, lng: 38.761, locality: "E. Usambara" },
    { lat: 0.462, lng: 30.212, locality: "Bwindi" },
    { lat: -6.168, lng: 35.757, locality: "Udzungwa" },
  ],
  "hm-006": [ // Diadem
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -6.802, lng: 39.278, locality: "Dar es Salaam" },
    { lat: 0.347, lng: 32.582, locality: "Kampala" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: -4.044, lng: 39.669, locality: "Mombasa" },
  ],
  "jo-007": [ // Blue Pansy
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.372, lng: 36.694, locality: "Arusha NP" },
    { lat: 0.347, lng: 32.582, locality: "Kampala" },
    { lat: -6.802, lng: 39.278, locality: "Dar es Salaam" },
  ],
  "aa-008": [ // Small Orange Acraea
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: -2.334, lng: 34.807, locality: "Serengeti" },
    { lat: -0.352, lng: 36.069, locality: "Nakuru" },
  ],
  "cd-009": [ // Crimson Tip
    { lat: -2.334, lng: 34.807, locality: "Serengeti" },
    { lat: 0.532, lng: 35.271, locality: "Eldoret" },
    { lat: -4.050, lng: 39.666, locality: "Coastal Kenya" },
    { lat: -9.310, lng: 34.765, locality: "Lake Malawi" },
  ],
  "po-010": [ // Gaudy Commodore
    { lat: -3.070, lng: 37.356, locality: "Kilimanjaro" },
    { lat: -2.597, lng: 29.526, locality: "Nyungwe" },
    { lat: 7.046, lng: 38.476, locality: "Bale" },
    { lat: -1.967, lng: 29.874, locality: "Volcanoes NP" },
  ],
  "eh-011": [ // Common Grass Yellow
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: 0.347, lng: 32.582, locality: "Kampala" },
    { lat: -6.802, lng: 39.278, locality: "Dar es Salaam" },
    { lat: -4.044, lng: 39.669, locality: "Mombasa" },
  ],
  "pn-012": [ // Narrow Green-banded Swallowtail
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
    { lat: 0.462, lng: 30.212, locality: "Bwindi" },
  ],
  "bau-013": [ // Pioneer White
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -2.334, lng: 34.807, locality: "Serengeti" },
    { lat: -6.802, lng: 39.278, locality: "Dar es Salaam" },
    { lat: 0.347, lng: 32.582, locality: "Kampala" },
  ],
  "cc-014": [ // Giant Charaxes
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
    { lat: -6.168, lng: 35.757, locality: "Udzungwa" },
  ],
  "sp-015": [ // Forest Mother-of-Pearl
    { lat: -3.070, lng: 37.356, locality: "Kilimanjaro" },
    { lat: -2.597, lng: 29.526, locality: "Nyungwe" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
  ],
  "cs-016": [ // Blood-red Glider
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: 0.462, lng: 30.212, locality: "Bwindi" },
    { lat: -1.578, lng: 29.225, locality: "Kahuzi-Biega" },
  ],
  "pdm-017": [ // Citrus Swallowtail
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: 0.347, lng: 32.582, locality: "Kampala" },
    { lat: -4.044, lng: 39.669, locality: "Mombasa" },
  ],
  "cf-018": [ // African Migrant
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -2.334, lng: 34.807, locality: "Serengeti" },
    { lat: -6.802, lng: 39.278, locality: "Dar es Salaam" },
    { lat: 0.532, lng: 35.271, locality: "Eldoret" },
  ],
  "an-019": [ // Friar
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
    { lat: 0.462, lng: 30.212, locality: "Bwindi" },
  ],
  "gp-020": [ // Small Striped Swordtail
    { lat: -5.109, lng: 38.761, locality: "E. Usambara" },
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -6.168, lng: 35.757, locality: "Udzungwa" },
  ],
  "en-021": [ // Gold-banded Forester
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: 0.462, lng: 30.212, locality: "Bwindi" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
  ],
  "ma-022": [ // Common Dotted Border
    { lat: -3.070, lng: 37.356, locality: "Kilimanjaro" },
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: 0.347, lng: 32.582, locality: "Kampala" },
  ],
  "pp-023": [ // Common Leopard
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: -4.044, lng: 39.669, locality: "Mombasa" },
    { lat: -6.802, lng: 39.278, locality: "Dar es Salaam" },
  ],
  "vc-024": [ // Painted Lady
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: 9.005, lng: 38.763, locality: "Addis Ababa" },
    { lat: -18.919, lng: 47.523, locality: "Antananarivo" },
    { lat: 0.347, lng: 32.582, locality: "Kampala" },
  ],
  "cv-025": [ // Pearl Charaxes
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
    { lat: 0.462, lng: 30.212, locality: "Bwindi" },
  ],
  "poph-026": [ // Emperor Swallowtail
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -3.070, lng: 37.356, locality: "Kilimanjaro" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
  ],
  "az-027": [ // Large Spotted Acraea
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: 0.347, lng: 32.582, locality: "Kampala" },
    { lat: -2.334, lng: 34.807, locality: "Serengeti" },
  ],
  "cj-028": [ // Two-tailed Pasha
    { lat: -4.044, lng: 39.669, locality: "Mombasa" },
    { lat: -6.802, lng: 39.278, locality: "Dar coast" },
    { lat: -4.311, lng: 38.568, locality: "Shimba Hills" },
  ],
  "ns-029": [ // Malagasy Sailor
    { lat: -18.919, lng: 47.523, locality: "Antananarivo" },
    { lat: -15.717, lng: 46.317, locality: "Mahajanga" },
    { lat: -21.453, lng: 47.086, locality: "Ranomafana" },
  ],
  "ce-030": [ // Smoky Orange Tip
    { lat: -2.334, lng: 34.807, locality: "Serengeti" },
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: 0.532, lng: 35.271, locality: "Eldoret" },
  ],
  "lp-031": [ // Common Zebra Blue
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: 0.347, lng: 32.582, locality: "Kampala" },
    { lat: -4.044, lng: 39.669, locality: "Mombasa" },
  ],
  "dp-032": [ // Monarch
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -4.044, lng: 39.669, locality: "Mombasa" },
    { lat: -6.802, lng: 39.278, locality: "Dar es Salaam" },
  ],
  "pa-033": [ // African Giant Swallowtail
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: 0.462, lng: 30.212, locality: "Bwindi" },
    { lat: -1.578, lng: 29.225, locality: "Kahuzi-Biega" },
  ],
  "ca-034": [ // Bushveld Charaxes
    { lat: -2.334, lng: 34.807, locality: "Serengeti" },
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
  ],
  "pm-035": [ // Green-banded Swallowtail
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: 0.462, lng: 30.212, locality: "Bwindi" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
  ],
  "eh-036": [ // Large Green Forester
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
    { lat: -6.168, lng: 35.757, locality: "Udzungwa" },
  ],
  "ae-037": [ // Common Acraea
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: 0.347, lng: 32.582, locality: "Kampala" },
    { lat: -6.802, lng: 39.278, locality: "Dar es Salaam" },
  ],
  "cc-038": [ // Cream-banded Glider
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: 0.462, lng: 30.212, locality: "Bwindi" },
    { lat: -1.578, lng: 29.225, locality: "Kahuzi-Biega" },
  ],
  "gc-039": [ // Mamba Swordtail
    { lat: -3.070, lng: 37.356, locality: "Kilimanjaro" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
    { lat: -2.597, lng: 29.526, locality: "Nyungwe" },
  ],
  "pl-040": [ // False Acraea
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
    { lat: 0.462, lng: 30.212, locality: "Bwindi" },
  ],
  "ci-041": [ // Violet Tip
    { lat: -2.334, lng: 34.807, locality: "Serengeti" },
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
  ],
  "bi-042": [ // Spotted Joker
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: -2.334, lng: 34.807, locality: "Serengeti" },
  ],
  "st-043": [ // Blue-green Nymph
    { lat: -3.070, lng: 37.356, locality: "Kilimanjaro" },
    { lat: -2.597, lng: 29.526, locality: "Nyungwe" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
  ],
  "cp-044": [ // Flame-bordered Emperor
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
    { lat: -6.168, lng: 35.757, locality: "Udzungwa" },
  ],
  "jh-045": [ // Yellow Pansy
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: 0.347, lng: 32.582, locality: "Kampala" },
  ],
  "ap-046": [ // African Albatross
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: 0.347, lng: 32.582, locality: "Kampala" },
  ],
  "hd-047": [ // Guinea Fowl Butterfly
    { lat: -2.334, lng: 34.807, locality: "Serengeti" },
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: 0.347, lng: 32.582, locality: "Kampala" },
  ],
  "ec-048": [ // Smooth-palped Blue Forester
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: 0.462, lng: 30.212, locality: "Bwindi" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
  ],
  "at-049": [ // Common Scarlet
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: -2.334, lng: 34.807, locality: "Serengeti" },
  ],
  "phan-050": [ // Pharmacophagus antenor
    { lat: -18.919, lng: 47.523, locality: "Antananarivo" },
    { lat: -21.453, lng: 47.086, locality: "Ranomafana" },
    { lat: -12.280, lng: 49.292, locality: "Andasibe" },
  ],
  "ml-051": [ // Common Evening Brown
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
    { lat: 0.347, lng: 32.582, locality: "Kampala" },
  ],
  "ad-052": [ // Common Hairtail
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
  ],
  "cd-053": [ // Druce's Charaxes
    { lat: -3.070, lng: 37.356, locality: "Kilimanjaro" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
    { lat: -2.597, lng: 29.526, locality: "Nyungwe" },
  ],
  "ac-054": [ // Collins' Ash Blue
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: 0.347, lng: 32.582, locality: "Kampala" },
  ],
  "av-055": [ // Congo Glasswing Acraea
    { lat: 0.462, lng: 30.212, locality: "Bwindi" },
    { lat: -1.578, lng: 29.225, locality: "Kahuzi-Biega" },
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
  ],
  "ms-056": [ // Common Fig-tree Blue
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -4.044, lng: 39.669, locality: "Mombasa" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
  ],
  "st-057": [ // Elfin Skipper
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: 0.532, lng: 35.271, locality: "Eldoret" },
  ],
  "pa-058": [ // Darker Commodore
    { lat: -2.334, lng: 34.807, locality: "Serengeti" },
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -6.802, lng: 39.278, locality: "Dar es Salaam" },
  ],
  "mg-059": [ // Gabela Dotted Border
    { lat: -3.070, lng: 37.356, locality: "Kilimanjaro" },
    { lat: -2.597, lng: 29.526, locality: "Nyungwe" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
  ],
  "bo-060": [ // Ochre Bush Brown
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
  ],
  "ar-061": [ // Red-ringed Hairtail
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
  ],
  "ac-062": [ // Canopus Skipper
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
    { lat: 0.532, lng: 35.271, locality: "Eldoret" },
  ],
  "js-063": [ // Little Commodore
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: -2.334, lng: 34.807, locality: "Serengeti" },
    { lat: -3.386, lng: 36.682, locality: "Arusha" },
  ],
  "pc-064": [ // Constantine's Swallowtail
    { lat: -3.070, lng: 37.356, locality: "Kilimanjaro" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
    { lat: -2.597, lng: 29.526, locality: "Nyungwe" },
  ],
  "cpro-065": [ // Red Tip
    { lat: -2.334, lng: 34.807, locality: "Serengeti" },
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: 0.532, lng: 35.271, locality: "Eldoret" },
  ],
  "ap-066": [ // Montane Acraea
    { lat: -3.070, lng: 37.356, locality: "Kilimanjaro" },
    { lat: -2.597, lng: 29.526, locality: "Nyungwe" },
    { lat: 7.046, lng: 38.476, locality: "Bale" },
  ],
  "ce-067": [ // Demon Charaxes
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
    { lat: 0.462, lng: 30.212, locality: "Bwindi" },
  ],
  "bc-068": [ // Calypso White
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -1.286, lng: 36.817, locality: "Nairobi" },
    { lat: 0.347, lng: 32.582, locality: "Kampala" },
  ],
  "nn-069": [ // Spot Sailor
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
    { lat: 0.462, lng: 30.212, locality: "Bwindi" },
  ],
  "eb-070": [ // Barombe Nymph
    { lat: -0.091, lng: 34.768, locality: "Kakamega" },
    { lat: -5.109, lng: 38.761, locality: "Usambara" },
    { lat: -6.168, lng: 35.757, locality: "Udzungwa" },
  ],
};

/**
 * Calculate distance between two points in km (Haversine formula).
 */
export const haversineDistance = (
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * Find all specimen IDs with at least one sighting within `radiusKm` of a point.
 */
export const findSpecimensNearPoint = (
  lat: number, lng: number, radiusKm: number = 10
): { specimenId: string; locality: string; distance: number }[] => {
  const results: { specimenId: string; locality: string; distance: number }[] = [];
  for (const [specimenId, sightings] of Object.entries(specimenCoordinates)) {
    for (const s of sightings) {
      const d = haversineDistance(lat, lng, s.lat, s.lng);
      if (d <= radiusKm) {
        results.push({ specimenId, locality: s.locality, distance: d });
        break; // one match per specimen is enough
      }
    }
  }
  return results.sort((a, b) => a.distance - b.distance);
};

/**
 * Get all sighting points flattened for heatmap rendering.
 */
export const getAllSightingPoints = (): { lat: number; lng: number; specimenId: string }[] => {
  const points: { lat: number; lng: number; specimenId: string }[] = [];
  for (const [specimenId, sightings] of Object.entries(specimenCoordinates)) {
    for (const s of sightings) {
      points.push({ lat: s.lat, lng: s.lng, specimenId });
    }
  }
  return points;
};

/**
 * Get density grid for heatmap visualization.
 * Returns clusters of points with species counts.
 */
export const getDensityClusters = (gridSizeDeg: number = 1): {
  lat: number; lng: number; count: number; uniqueSpecies: number
}[] => {
  const allPoints = getAllSightingPoints();
  const grid: Record<string, { lats: number[]; lngs: number[]; species: Set<string> }> = {};
  
  for (const p of allPoints) {
    const key = `${Math.floor(p.lat / gridSizeDeg)}_${Math.floor(p.lng / gridSizeDeg)}`;
    if (!grid[key]) grid[key] = { lats: [], lngs: [], species: new Set() };
    grid[key].lats.push(p.lat);
    grid[key].lngs.push(p.lng);
    grid[key].species.add(p.specimenId);
  }

  return Object.values(grid).map((g) => ({
    lat: g.lats.reduce((a, b) => a + b, 0) / g.lats.length,
    lng: g.lngs.reduce((a, b) => a + b, 0) / g.lngs.length,
    count: g.lats.length,
    uniqueSpecies: g.species.size,
  }));
};
