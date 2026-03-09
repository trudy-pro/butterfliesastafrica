/**
 * Expanded Sound Profile data for African butterfly specimens.
 * Includes wing-beat frequency, acoustic texture, habitat ambiance,
 * and wing-clap characteristics for immersive audio experience.
 */

import { getFlightStyles } from "./flightStyles";
import { specimens } from "./butterflies";

export type AcousticTexture =
  | "satin-like"
  | "dry-parchment"
  | "rhythmic-pulsing"
  | "papery-flutter"
  | "velvet-hum"
  | "crisp-snap"
  | "soft-whisper"
  | "buzzing-vibrato";

export type HabitatAmbiance =
  | "tropical-rainforest"
  | "savanna-grassland"
  | "montane-forest"
  | "coastal-scrub"
  | "woodland-edge"
  | "alpine-meadow"
  | "riverine-gallery"
  | "dry-bushveld";

export interface WingClapProfile {
  /** Intensity of the wing clap: how audible the "boom" is */
  intensity: "subtle" | "moderate" | "pronounced";
  /** Description of the deformation pattern */
  deformation: string;
  /** Synthesized bass frequency for the clap sound */
  clapFreqHz: number;
}

export interface SoundProfileInfo {
  /** Wing-beat frequency in Hz */
  frequencyHz: number;
  /** Descriptive frequency label */
  frequencyLabel: string;
  /** Acoustic texture descriptor */
  acousticTexture: AcousticTexture;
  /** Human-readable texture label */
  textureLabel: string;
  /** Texture description */
  textureDesc: string;
  /** Habitat ambiance type */
  ambiance: HabitatAmbiance;
  /** Human-readable ambiance label */
  ambianceLabel: string;
  /** Ambiance description */
  ambianceDesc: string;
  /** Wing-clap profile */
  wingClap: WingClapProfile;
  /** Behavioral note */
  note: string;
}

// ── Frequency computation ──

const styleRanges: Record<string, [number, number]> = {
  glider: [5, 10],
  soaring: [4, 8],
  floater: [8, 14],
  dipping: [10, 16],
  "fast-flyer": [18, 30],
  skipper: [25, 40],
  buzzer: [30, 50],
  erratic: [15, 25],
};

function parseWingspan(ws: string): number {
  const nums = ws.match(/\d+/g);
  if (!nums || nums.length === 0) return 70;
  const values = nums.map(Number);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function computeFrequency(style: string, wingspanStr: string): number {
  const range = styleRanges[style] ?? [10, 20];
  const ws = parseWingspan(wingspanStr);
  const t = Math.max(0, Math.min(1, (150 - ws) / 130));
  return Math.round((range[0] + t * (range[1] - range[0])) * 10) / 10;
}

function getFrequencyLabel(hz: number): string {
  if (hz < 8) return "Very slow — thermal glider";
  if (hz < 14) return "Slow — leisurely cruiser";
  if (hz < 20) return "Moderate — steady flapper";
  if (hz < 30) return "Fast — rapid wingbeats";
  return "Very fast — buzzing flight";
}

// ── Acoustic texture mapping ──

const textureMap: Record<string, { texture: AcousticTexture; label: string; desc: string }> = {
  glider: {
    texture: "satin-like",
    label: "Satin-like",
    desc: "Smooth, silken whoosh with barely perceptible wingbeats. The sound of air parting gently around broad, flat wings.",
  },
  soaring: {
    texture: "soft-whisper",
    label: "Soft Whisper",
    desc: "Near-silent flight with faint thermal updraft resonance. Wings held wide produce a barely audible hiss.",
  },
  floater: {
    texture: "velvet-hum",
    label: "Velvet Hum",
    desc: "A gentle, continuous drone like velvet being drawn through still air. Unhurried and meditative.",
  },
  dipping: {
    texture: "rhythmic-pulsing",
    label: "Rhythmic Pulsing",
    desc: "Rise-and-fall cadence creates a wave-like acoustic pattern. Each dip produces a soft 'whump' at the nadir.",
  },
  "fast-flyer": {
    texture: "crisp-snap",
    label: "Crisp Snap",
    desc: "Sharp, percussive wingbeats cut through the air like tiny claps. Power and precision in every stroke.",
  },
  skipper: {
    texture: "dry-parchment",
    label: "Dry / Parchment",
    desc: "Papery, rapid rustling like dry leaves in wind. Quick bursts punctuated by sudden silence.",
  },
  buzzer: {
    texture: "buzzing-vibrato",
    label: "Buzzing Vibrato",
    desc: "Insistent, bee-like drone with a high-frequency vibrato. Wing membranes blur into a resonant haze.",
  },
  erratic: {
    texture: "papery-flutter",
    label: "Papery Flutter",
    desc: "Irregular, chaotic rustling — like a page caught in gusting wind. No two wingbeats sound alike.",
  },
};

// ── Habitat ambiance mapping ──

const habitatAmbianceMap: Record<string, { ambiance: HabitatAmbiance; label: string; desc: string }> = {
  "Tropical Forest": {
    ambiance: "tropical-rainforest",
    label: "Tropical Rainforest",
    desc: "Dense canopy drip, cicada chorus, distant hornbill calls. Heavy humidity saturates every sound with a warm reverb.",
  },
  "Savanna": {
    ambiance: "savanna-grassland",
    label: "Savanna Grassland",
    desc: "Dry grass rustling in hot wind, distant thunder, weaver bird chatter. Open sky amplifies every wing flutter.",
  },
  "Montane Forest": {
    ambiance: "montane-forest",
    label: "Montane Cloud Forest",
    desc: "Cool mist dripping from moss, turaco calls echoing through bamboo. Sound travels differently in thin mountain air.",
  },
  "Woodland": {
    ambiance: "woodland-edge",
    label: "Woodland Edge",
    desc: "Dappled light acoustics — birdsong filtering through scattered trees, dry leaf litter crunching underfoot.",
  },
  "Coastal": {
    ambiance: "coastal-scrub",
    label: "Coastal Scrub",
    desc: "Salt wind through low bushes, distant surf rhythm, tern cries. Crisp maritime air carries sound sharply.",
  },
  "Grassland": {
    ambiance: "savanna-grassland",
    label: "Open Grassland",
    desc: "Wind sweeping across endless grass, cricket stridulation, sky-lark trills. The butterfly's wingbeats are the loudest thing nearby.",
  },
  "Forest": {
    ambiance: "tropical-rainforest",
    label: "Lowland Forest",
    desc: "Leaf litter rustling, canopy bird calls, tree frog peeping at dusk. A cathedral of green absorbing all sound.",
  },
  "Riverine": {
    ambiance: "riverine-gallery",
    label: "Riverine Gallery",
    desc: "Water tumbling over stones, reed warbler song, dragonfly wing hum. Cool, moist air beside flowing water.",
  },
  "Alpine": {
    ambiance: "alpine-meadow",
    label: "Alpine Meadow",
    desc: "Thin mountain wind whistling past rocks, marmot calls, silence so deep you hear your own heartbeat.",
  },
  "Bushveld": {
    ambiance: "dry-bushveld",
    label: "Dry Bushveld",
    desc: "Thorn scrub crackling in heat, go-away bird alarm, heat shimmer creating acoustic mirages.",
  },
};

function getAmbiance(habitat: string) {
  // Try exact match first, then partial
  if (habitatAmbianceMap[habitat]) return habitatAmbianceMap[habitat];
  for (const [key, val] of Object.entries(habitatAmbianceMap)) {
    if (habitat.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return habitatAmbianceMap["Woodland"]; // fallback
}

// ── Wing clap profile ──

function getWingClap(style: string, wingspanMm: number): WingClapProfile {
  const large = wingspanMm > 80;
  const fast = ["fast-flyer", "skipper", "buzzer"].includes(style);

  if (large && fast) {
    return {
      intensity: "pronounced",
      deformation: "Deep concave flex at apex — wings fully invert before explosive downstroke. Audible 'clap-and-fling' mechanism.",
      clapFreqHz: 55,
    };
  }
  if (large) {
    return {
      intensity: "moderate",
      deformation: "Gentle bowing at wing tips — broad surfaces create a soft pressure wave on each upstroke meeting.",
      clapFreqHz: 70,
    };
  }
  if (fast) {
    return {
      intensity: "moderate",
      deformation: "Rapid micro-claps — wings barely touch before springing apart. Creates staccato percussive bursts.",
      clapFreqHz: 90,
    };
  }
  return {
    intensity: "subtle",
    deformation: "Minimal apex contact — wings approach but rarely fully clap. A soft, breathy 'puff' at each stroke apex.",
    clapFreqHz: 110,
  };
}

// ── Main export ──

const soundProfileCache: Record<string, SoundProfileInfo> = {};

export function getSoundProfile(specimenId: string): SoundProfileInfo {
  if (soundProfileCache[specimenId]) return soundProfileCache[specimenId];

  const specimen = specimens.find(s => s.id === specimenId);
  const styles = getFlightStyles(specimenId);
  const primaryStyle = styles[0]?.style ?? "floater";
  const wingspanStr = specimen?.wingspan ?? "60 – 80 mm";
  const wingspanMm = parseWingspan(wingspanStr);
  const habitat = specimen?.habitat ?? "Woodland";

  const hz = computeFrequency(primaryStyle, wingspanStr);
  const texture = textureMap[primaryStyle] ?? textureMap["floater"];
  const ambiance = getAmbiance(habitat);
  const wingClap = getWingClap(primaryStyle, wingspanMm);

  const info: SoundProfileInfo = {
    frequencyHz: hz,
    frequencyLabel: getFrequencyLabel(hz),
    acousticTexture: texture.texture,
    textureLabel: texture.label,
    textureDesc: texture.desc,
    ambiance: ambiance.ambiance,
    ambianceLabel: ambiance.label,
    ambianceDesc: ambiance.desc,
    wingClap,
    note: styles.length > 1
      ? `Primary: ${styles[0].label} (${hz} Hz). Also exhibits ${styles.slice(1).map(s => s.label.toLowerCase()).join(", ")} flight.`
      : `${styles[0]?.label ?? "Standard"} flight at ~${hz} beats/sec.`,
  };

  soundProfileCache[specimenId] = info;
  return info;
}

// Re-export for backward compat
export type { SoundProfileInfo as WingBeatInfo };
export function getWingBeatInfo(specimenId: string): SoundProfileInfo {
  return getSoundProfile(specimenId);
}
