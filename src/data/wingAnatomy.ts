import { WingShape } from "@/data/butterflies";

export interface AnatomyHotspot {
  id: string;
  label: string;
  description: string;
  /** Position as percentage of image width/height */
  x: number;
  y: number;
}

const baseHotspots: AnatomyHotspot[] = [
  { id: "apex", label: "Apex", x: 20, y: 15, description: "The tip of the forewing — often the most pointed region and site of apical markings." },
  { id: "costa", label: "Costa", x: 30, y: 12, description: "The leading (anterior) edge of the wing, strengthened by veins for flight stability." },
  { id: "discal-cell", label: "Discal Cell", x: 35, y: 35, description: "The central closed cell of the wing, bounded by veins. Key for species identification." },
  { id: "submarginal", label: "Submarginal Band", x: 18, y: 40, description: "A band of markings running parallel to, but inside, the wing margin." },
  { id: "tornus", label: "Tornus", x: 25, y: 65, description: "The posterior angle of the wing where the outer and inner margins meet." },
  { id: "dorsum", label: "Dorsum", x: 42, y: 60, description: "The inner (posterior) margin of the wing, closest to the body." },
  { id: "hindwing-ocellus", label: "Hindwing Ocellus", x: 60, y: 55, description: "Eyespot markings on the hindwing used to deflect predator attacks away from the body." },
  { id: "termen", label: "Termen", x: 15, y: 50, description: "The outer margin of the wing between the apex and tornus." },
  { id: "basal-area", label: "Basal Area", x: 48, y: 30, description: "The area closest to the body where the wing attaches — often darker or densely scaled." },
  { id: "hindwing-tail", label: "Hindwing Tail", x: 65, y: 75, description: "An elongated projection of the hindwing, characteristic of swallowtails and some lycaenids." },
];

/** Extra or adjusted hotspots for specific wing shapes */
const shapeOverrides: Partial<Record<WingShape, AnatomyHotspot[]>> = {
  "Tailed Swallowtail": [
    { id: "sword-tail", label: "Sword Tail", x: 62, y: 82, description: "Elongated tail-like projection of the hindwing, a hallmark of Papilionidae." },
  ],
  "Elongated Swordtail": [
    { id: "sword-extension", label: "Sword Extension", x: 58, y: 85, description: "Dramatically elongated hindwing tail used as a predator deflection lure." },
  ],
  "Small Tailed": [
    { id: "filament-tail", label: "Filament Tail", x: 60, y: 78, description: "A delicate thread-like tail typical of hairstreaks, mimicking an antenna to confuse predators." },
  ],
  "Broad Scalloped": [
    { id: "scalloped-edge", label: "Scalloped Edge", x: 16, y: 55, description: "Wavy, scalloped wing margin that aids in leaf mimicry and camouflage." },
  ],
  "Falcate (Sickle-shaped)": [
    { id: "falcate-tip", label: "Falcate Tip", x: 14, y: 20, description: "Hooked or sickle-shaped forewing tip that improves aerodynamic manoeuvrability." },
  ],
};

export function getAnatomyHotspots(wingShape: WingShape): AnatomyHotspot[] {
  const extras = shapeOverrides[wingShape] ?? [];
  // Filter out hindwing tail for shapes that don't have one
  const hasTail = wingShape.toLowerCase().includes("tail") || wingShape.toLowerCase().includes("swallowtail");
  const base = hasTail ? baseHotspots : baseHotspots.filter(h => h.id !== "hindwing-tail");
  return [...base, ...extras];
}
