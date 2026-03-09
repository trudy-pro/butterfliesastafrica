/**
 * Wing-beat frequency data for African butterfly specimens.
 * Frequencies in Hz — derived from flight style and body size.
 * Smaller/faster species beat faster; large gliders beat slower.
 */

export interface WingBeatInfo {
  /** Wing-beat frequency in Hz */
  frequencyHz: number;
  /** Descriptive label */
  label: string;
  /** Brief behavioral note about wing-beat pattern */
  note: string;
}

/**
 * Maps flight style → typical frequency range.
 * We use specimen wingspan to fine-tune within the range.
 */
const styleRanges: Record<string, [number, number]> = {
  glider:      [5, 10],
  soaring:     [4, 8],
  floater:     [8, 14],
  dipping:     [10, 16],
  "fast-flyer": [18, 30],
  skipper:     [25, 40],
  buzzer:      [30, 50],
  erratic:     [15, 25],
};

/** Parse wingspan string like "60 – 90 mm" → midpoint in mm */
function parseWingspan(ws: string): number {
  const nums = ws.match(/\d+/g);
  if (!nums || nums.length === 0) return 70;
  const values = nums.map(Number);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Smaller wingspan → higher frequency within the style's range */
function computeFrequency(style: string, wingspanStr: string): number {
  const range = styleRanges[style] ?? [10, 20];
  const ws = parseWingspan(wingspanStr);
  // Normalize wingspan: 20mm → 1.0 (fast), 150mm → 0.0 (slow)
  const t = Math.max(0, Math.min(1, (150 - ws) / 130));
  const hz = range[0] + t * (range[1] - range[0]);
  return Math.round(hz * 10) / 10;
}

function getLabel(hz: number): string {
  if (hz < 8) return "Very slow — thermal glider";
  if (hz < 14) return "Slow — leisurely cruiser";
  if (hz < 20) return "Moderate — steady flapper";
  if (hz < 30) return "Fast — rapid wingbeats";
  return "Very fast — buzzing flight";
}

import { getFlightStyles } from "./flightStyles";
import { specimens } from "./butterflies";

/** Pre-computed wing-beat data keyed by specimen ID */
const wingBeatCache: Record<string, WingBeatInfo> = {};

export function getWingBeatInfo(specimenId: string): WingBeatInfo {
  if (wingBeatCache[specimenId]) return wingBeatCache[specimenId];

  const specimen = specimens.find(s => s.id === specimenId);
  const styles = getFlightStyles(specimenId);
  const primaryStyle = styles[0]?.style ?? "floater";
  const wingspan = specimen?.wingspan ?? "60 – 80 mm";

  const hz = computeFrequency(primaryStyle, wingspan);
  const info: WingBeatInfo = {
    frequencyHz: hz,
    label: getLabel(hz),
    note: styles.length > 1
      ? `Primary: ${styles[0].label} (${hz} Hz). Also exhibits ${styles.slice(1).map(s => s.label.toLowerCase()).join(", ")} flight.`
      : `${styles[0]?.label ?? "Standard"} flight at ~${hz} beats/sec.`,
  };

  wingBeatCache[specimenId] = info;
  return info;
}
