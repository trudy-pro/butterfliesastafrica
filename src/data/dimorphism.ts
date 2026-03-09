export interface DimorphismInfo {
  specimenId: string;
  hasDimorphism: boolean;
  defaultSex: "male" | "female";
  male: { description: string; colorNotes: string };
  female: { description: string; colorNotes: string };
}

const dimorphismData: DimorphismInfo[] = [
  {
    specimenId: "pd-002",
    hasDimorphism: true,
    defaultSex: "male",
    male: { description: "Deep black background with bold yellow and cream markings. Hindwing tails prominent.", colorNotes: "Black, Yellow, Cream" },
    female: { description: "Highly polymorphic — multiple mimicry forms exist (hippocoon, cenea, trophonius). Females may resemble toxic Amauris or Danaus species.", colorNotes: "Variable: White, Orange, Black depending on morph" },
  },
  {
    specimenId: "hm-006",
    hasDimorphism: true,
    defaultSex: "male",
    male: { description: "Jet black upperside with large white patches edged in iridescent purple-blue.", colorNotes: "Black, White, Iridescent purple" },
    female: { description: "Orange-brown with black markings — a convincing mimic of the toxic African Monarch (Danaus chrysippus).", colorNotes: "Orange, Black, White" },
  },
  {
    specimenId: "dc-001",
    hasDimorphism: true,
    defaultSex: "male",
    male: { description: "Bright orange with black borders and white-spotted wing tips. A distinct black androconial patch on the hindwing.", colorNotes: "Orange, Black, White" },
    female: { description: "Similar to male but lacks the androconial patch on the hindwing. Slightly paler orange in some populations.", colorNotes: "Orange, Black, White (paler)" },
  },
  {
    specimenId: "cs-016",
    hasDimorphism: true,
    defaultSex: "male",
    male: { description: "Vivid blood-red upperside with a narrow black border along the outer margins.", colorNotes: "Red, Black" },
    female: { description: "Wider black borders and more muted red-brown coloration. Some populations show darker suffusion.", colorNotes: "Red-brown, Black" },
  },
  {
    specimenId: "cf-018",
    hasDimorphism: true,
    defaultSex: "male",
    male: { description: "Uniform lemon-white to greenish-white. Clean unmarked uppersides.", colorNotes: "White, Pale green" },
    female: { description: "Broader orange-yellow marginal spots. Some females show a distinctive salmon-pink flush.", colorNotes: "White, Orange-yellow, Pink" },
  },
  {
    specimenId: "cb-005",
    hasDimorphism: true,
    defaultSex: "male",
    male: { description: "Deep blue-black upperside with vivid turquoise-blue marginal band on hindwing.", colorNotes: "Black, Blue, Green" },
    female: { description: "Brown background with broader, paler blue marginal band. Less intense iridescence.", colorNotes: "Brown, Pale blue" },
  },
  {
    specimenId: "en-021",
    hasDimorphism: true,
    defaultSex: "male",
    male: { description: "Rich tawny-orange upperside with black forewing tips and scattered spots.", colorNotes: "Orange, Black" },
    female: { description: "Olive-brown to dark brown with more extensive black patterning. Underside richer in detail.", colorNotes: "Brown, Black, Olive" },
  },
  {
    specimenId: "eh-036",
    hasDimorphism: true,
    defaultSex: "male",
    male: { description: "Brilliant orange with a defined black forewing band.", colorNotes: "Orange, Black" },
    female: { description: "Deep chocolate-brown with blue-white apical band. Strikingly different from male.", colorNotes: "Brown, Blue-white" },
  },
  {
    specimenId: "ba-013",
    hasDimorphism: true,
    defaultSex: "male",
    male: { description: "White upperside with crisp black wingtips and orange flush at forewing base.", colorNotes: "White, Black, Orange" },
    female: { description: "More heavily patterned with broader black borders. Some females show yellow rather than white ground colour.", colorNotes: "White/Yellow, Black" },
  },
  {
    specimenId: "vc-024",
    hasDimorphism: true,
    defaultSex: "female",
    male: { description: "Similar to female but slightly more vivid orange with smaller white apical spots.", colorNotes: "Orange, Black, White" },
    female: { description: "Classic Painted Lady — salmon-orange with black-and-white patterned forewing tips.", colorNotes: "Orange, Black, White" },
  },
];

export function getDimorphism(specimenId: string): DimorphismInfo | undefined {
  return dimorphismData.find(d => d.specimenId === specimenId);
}
