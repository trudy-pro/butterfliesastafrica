import { Wind, Zap, Feather, Bird, Waves, ArrowUpDown, RotateCcw, Rocket } from "lucide-react";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

export type FlightStyle =
  | "glider"
  | "skipper"
  | "fast-flyer"
  | "floater"
  | "dipping"
  | "erratic"
  | "soaring"
  | "buzzer";

export interface FlightStyleInfo {
  style: FlightStyle;
  label: string;
  shortDesc: string;
  fieldTip: string;
  icon: ComponentType<LucideProps>;
}

const flightStyles: Record<FlightStyle, FlightStyleInfo> = {
  glider: {
    style: "glider",
    label: "Glider",
    shortDesc: "Long, smooth glides with few wingbeats",
    fieldTip: "Look for wide, flat wings held open while coasting. Often seen soaring along forest edges or over canopy.",
    icon: Feather,
  },
  skipper: {
    style: "skipper",
    label: "Skipper",
    shortDesc: "Rapid, darting hops close to vegetation",
    fieldTip: "Quick bursts with sudden stops on leaves. Typically low to the ground — follow the bouncing movement pattern.",
    icon: Zap,
  },
  "fast-flyer": {
    style: "fast-flyer",
    label: "Fast Flyer",
    shortDesc: "Powerful, direct flight at high speed",
    fieldTip: "Difficult to follow — flies in straight lines with rapid wingbeats. Best spotted when feeding or basking.",
    icon: Rocket,
  },
  floater: {
    style: "floater",
    label: "Floater",
    shortDesc: "Lazy, buoyant flight with gentle wingbeats",
    fieldTip: "Drifts slowly through clearings. Easy to approach when flying — often pauses mid-air briefly.",
    icon: Wind,
  },
  dipping: {
    style: "dipping",
    label: "Dipping",
    shortDesc: "Undulating, wave-like flight path",
    fieldTip: "Rises and dips rhythmically. Track the 'bounce' pattern — predictable landing spots at the bottom of each dip.",
    icon: Waves,
  },
  erratic: {
    style: "erratic",
    label: "Erratic",
    shortDesc: "Unpredictable, zig-zagging flight",
    fieldTip: "Almost impossible to follow in flight — wait for it to land. Often a predator-evasion strategy.",
    icon: ArrowUpDown,
  },
  soaring: {
    style: "soaring",
    label: "Soaring",
    shortDesc: "High-altitude thermal riding with minimal effort",
    fieldTip: "Uses thermals to gain height. Often seen circling upward on warm afternoons. Bring binoculars.",
    icon: Bird,
  },
  buzzer: {
    style: "buzzer",
    label: "Buzzer",
    shortDesc: "Rapid, bee-like buzzing flight",
    fieldTip: "Easily mistaken for a large bee or moth. Very fast wingbeats — look for the characteristic vibration blur.",
    icon: RotateCcw,
  },
};

/** Maps specimen ID → flight style(s). Most have one primary style. */
const specimenFlightMap: Record<string, FlightStyle[]> = {
  "dc-001": ["floater"],           // African Monarch — lazy, gliding flight
  "pd-002": ["glider"],            // African Swallowtail — soars with tails
  "ga-003": ["fast-flyer"],        // Large Striped Swordtail — powerful direct
  "ba-004": ["dipping"],           // Bush Brown — low undulating
  "cb-005": ["fast-flyer", "glider"], // White-barred Emperor — fast then glides
  "hm-006": ["floater"],           // Diadem — lazy buoyant
  "jo-007": ["erratic", "skipper"], // Blue Pansy — darting territorial
  "aa-008": ["floater"],           // Small Orange Acraea — slow, deliberate
  "cd-009": ["fast-flyer"],        // Crimson Tip — rapid direct
  "po-010": ["dipping"],           // Gaudy Commodore — undulating
  "eh-011": ["floater"],           // Common Grass Yellow — slow gentle
  "pn-012": ["fast-flyer"],        // Green-banded Swallowtail — powerful
  "bau-013": ["floater", "dipping"], // Pioneer White — slow undulating
  "cc-014": ["fast-flyer", "soaring"], // Giant Charaxes — powerful soaring
  "sp-015": ["glider"],            // Mother-of-Pearl — graceful gliding
  "cs-016": ["fast-flyer"],        // Blood-red Cymothoe — rapid forest canopy
  "pde-017": ["glider"],           // Citrus Swallowtail — soaring glider
  "cf-018": ["floater"],           // African Emigrant — slow buoyant
  "an-019": ["floater", "glider"], // Friar — slow gliding
  "gp-020": ["fast-flyer"],        // Common Swordtail — very fast
  "en-021": ["fast-flyer"],        // Gold-banded Forester — rapid canopy
  "ma-022": ["floater"],           // Common Dotted Border — gentle
  "pp-023": ["erratic"],           // Common Leopard — zigzag territorial
  "vc-024": ["glider", "soaring"], // Painted Lady — migratory soaring
  "cv-025": ["fast-flyer", "glider"], // Pearl Charaxes — fast then glides
  "po-026": ["fast-flyer"],        // Emperor Swallowtail — powerful
  "az-027": ["floater"],           // Large Spotted Acraea — slow warning
  "cj-028": ["fast-flyer", "soaring"], // Two-tailed Pasha — powerful thermals
  "ns-029": ["glider"],            // Common Sailer — smooth sailing
  "ce-030": ["fast-flyer"],        // Topaz Arab — rapid
  "lp-031": ["skipper"],           // Common Zebra Blue — quick darting
  "dp-032": ["glider", "soaring"], // Monarch — classic migratory glider
  "pa-033": ["soaring", "glider"], // African Giant Swallowtail — soars high
  "ca-034": ["fast-flyer"],        // Green-veined Charaxes — fast
  "pm-035": ["fast-flyer"],        // Mechow's Swallowtail — powerful
  "eh-036": ["fast-flyer"],        // Large Forest Euphaedra — rapid forest
  "ae-037": ["floater"],           // Common Acraea — slow gentle
  "cc-038": ["floater"],           // Cream-banded Swallowtail — slow
  "gc-039": ["fast-flyer"],        // Mamba Swordtail — very fast
  "pl-040": ["glider"],            // False Plain Tiger — mimicry glider
  "ci-041": ["fast-flyer"],        // Violet-tip — rapid
  "bi-042": ["dipping"],           // Joker — undulating low
  "st-043": ["glider"],            // Mother-of-Pearl — gentle glide
  "cp-044": ["fast-flyer"],        // Two-tailed Charaxes — powerful
  "jh-045": ["erratic"],           // Yellow Pansy — territorial darting
  "ae-046": ["floater"],           // Broad-bordered Grass Yellow — gentle
  "hd-047": ["dipping", "erratic"], // Guinea Fowl — low erratic
  "ec-048": ["fast-flyer"],        // Common Pearl Charaxes — fast
  "at-049": ["skipper"],           // Common Ciliate Blue — tiny darting
  "ad-050": ["skipper"],           // Pallid Blue — small quick
  "ml-051": ["dipping", "erratic"], // Evening Brown — crepuscular dipping
  "cd-052": ["fast-flyer"],        // Flame-bordered Charaxes — rapid
  "ac-053": ["skipper"],           // Collin's Scarce Copper — quick
  "av-054": ["floater"],           // Speckled Acraea — slow warning
  "ms-055": ["skipper", "fast-flyer"], // Common Fig Blue — rapid darting
  "st-056": ["buzzer"],            // Elfin Skipper — bee-like buzz
  "pa-057": ["erratic"],           // Large Leopard — zigzag
  "mg-058": ["floater"],           // Gabela Dotted Border — gentle
  "bo-059": ["dipping"],           // Small Bush Brown — low undulating
  "ar-060": ["skipper"],           // Pea Blue — quick darting
  "ac-061": ["buzzer"],            // Striped Policeman — rapid buzz
  "js-062": ["erratic"],           // Little Commodore — darting
  "pc-063": ["fast-flyer"],        // Constantine's Swallowtail — powerful
  "cp-064": ["fast-flyer"],        // Purple Tip — rapid direct
  "ap-065": ["floater"],           // Speckled Acraea — slow
  "ce-066": ["fast-flyer"],        // Demon Charaxes — aggressive fast
  "bc-067": ["floater"],           // African Common White — gentle
  "nn-068": ["glider"],            // Common Sailer — smooth
  "eb-069": ["fast-flyer"],        // Barombina Forester — rapid canopy
};

export function getFlightStyles(specimenId: string): FlightStyleInfo[] {
  const styles = specimenFlightMap[specimenId] ?? ["floater"];
  return styles.map(s => flightStyles[s]);
}
