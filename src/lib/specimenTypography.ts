import { ButterflySpecimen, Family } from "@/data/butterflies";

/**
 * Reactive typography system that maps butterfly physical characteristics
 * to variable font properties. Each specimen gets unique typographic DNA.
 *
 * Mappings:
 * - Wingspan → font-weight (larger = bolder, 300–800)
 * - Wingspan → letter-spacing (larger = wider, -0.02–0.08em)
 * - Family → font-stretch feel via letter-spacing modifier
 * - Habitat → vertical baseline shift (montane = up, coastal = down)
 * - WingShape → font-style (tailed/elongated = italic emphasis)
 */

/** Parse wingspan string like "70–80 mm" to average mm value */
function parseWingspan(ws: string): number {
  const nums = ws.match(/\d+/g);
  if (!nums || nums.length === 0) return 50;
  const values = nums.map(Number);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Normalize a value to 0–1 range */
function normalize(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

/** Family-based scale factor: delicate families get lighter treatment */
const familyScale: Record<Family, number> = {
  Lycaenidae: -0.25,    // tiny, delicate blues
  Hesperiidae: -0.15,   // small, compact skippers
  Pieridae: -0.05,      // medium, ethereal whites
  Satyrinae: 0,         // medium, earthy browns
  Nymphalidae: 0.1,     // varied, often robust
  Papilionidae: 0.25,   // large, dramatic swallowtails
};

/** Habitat altitude mapping for baseline shift */
const habitatShift: Record<string, number> = {
  "Montane Forest": 3,    // high altitude → text rises
  "Tropical Forest": 0.5, // mid-canopy
  "Woodland": 0,          // neutral
  "Savanna": -0.5,        // open lowland
  "Grassland": -1,        // low, grounded
  "Coastal": -2,          // sea level → text sinks
};

export interface SpecimenTypography {
  fontWeight: number;
  letterSpacing: string;
  baselineShift: string;
  fontStyle: string;
  /** CSS custom properties for inline use */
  style: React.CSSProperties;
  /** Descriptive class suffix for debugging */
  profile: string;
}

export function getSpecimenTypography(specimen: ButterflySpecimen): SpecimenTypography {
  const wingspan = parseWingspan(specimen.wingspan);

  // Wingspan ranges in the dataset: ~15mm (tiny lycaenids) to ~250mm (Papilio antimachus)
  const t = normalize(wingspan, 15, 200);

  // Font weight: 300 (delicate) → 800 (bold)
  const familyMod = familyScale[specimen.family] ?? 0;
  const rawWeight = 300 + t * 500 + familyMod * 200;
  const fontWeight = Math.round(Math.max(300, Math.min(800, rawWeight)) / 100) * 100;

  // Letter spacing: tight (-0.02em) for tiny → expansive (0.06em) for large
  const rawSpacing = -0.02 + t * 0.08 + familyMod * 0.02;
  const letterSpacing = `${Math.max(-0.03, Math.min(0.08, rawSpacing)).toFixed(3)}em`;

  // Baseline shift based on habitat altitude
  const shift = habitatShift[specimen.habitat] ?? 0;
  const baselineShift = `${shift}px`;

  // Font style: elongated/tailed wing shapes get italic
  const isElongated = specimen.wingShape.toLowerCase().includes("elongated") ||
    specimen.wingShape.toLowerCase().includes("tailed") ||
    specimen.wingShape.toLowerCase().includes("swallowtail");
  const fontStyle = isElongated ? "italic" : "normal";

  // Build profile description
  const weightDesc = fontWeight <= 400 ? "delicate" : fontWeight <= 600 ? "medium" : "bold";
  const profile = `${weightDesc}-${specimen.family.toLowerCase()}`;

  return {
    fontWeight,
    letterSpacing,
    baselineShift,
    fontStyle,
    style: {
      fontWeight,
      letterSpacing,
      fontStyle,
      transform: `translateY(${-shift}px)`,
      display: "inline-block",
    },
    profile,
  };
}
