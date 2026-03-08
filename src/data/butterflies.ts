import danausChrysippus from "@/assets/specimens/danaus-chrysippus.jpg";
import papilioDardanus from "@/assets/specimens/papilio-dardanus.jpg";
import graphiumAntheus from "@/assets/specimens/graphium-antheus.jpg";
import bicyclusAnynana from "@/assets/specimens/bicyclus-anynana.jpg";
import charaxesBrutus from "@/assets/specimens/charaxes-brutus.jpg";
import hypolimnasMisippus from "@/assets/specimens/hypolimnas-misippus.jpg";
import junoniaOenone from "@/assets/specimens/junonia-oenone.jpg";
import acraeaAcerata from "@/assets/specimens/acraea-acerata.jpg";
import colotisDanae from "@/assets/specimens/colotis-danae.jpg";
import precisOctavia from "@/assets/specimens/precis-octavia.jpg";
import euremaHecabe from "@/assets/specimens/eurema-hecabe.jpg";
import papilioNireus from "@/assets/specimens/papilio-nireus.jpg";
import belenoisAurota from "@/assets/specimens/belenois-aurota.jpg";
import charaxesCastor from "@/assets/specimens/charaxes-castor.jpg";
import salamisParhassus from "@/assets/specimens/salamis-parhassus.jpg";
import cymothoeSangaris from "@/assets/specimens/cymothoe-sangaris.jpg";

export type WingShape = "Rounded" | "Elongated" | "Tailed" | "Angular" | "Broad";
export type WingPattern = "Solid" | "Striped" | "Spotted" | "Eyespot" | "Banded" | "Veined" | "Mottled";
export type WingColor = "Orange" | "Yellow" | "Green" | "Blue" | "Red" | "Brown" | "Black" | "White" | "Iridescent";
export type Habitat = "Savanna" | "Montane Forest" | "Coastal" | "Woodland" | "Grassland" | "Tropical Forest";
export type Migration = "Migratory" | "Resident" | "Seasonal";
export type Family = "Nymphalidae" | "Papilionidae" | "Pieridae" | "Lycaenidae" | "Satyrinae";

export interface ButterflySpecimen {
  id: string;
  commonName: string;
  scientificName: string;
  family: Family;
  genus: string;
  species: string;
  image: string;
  colors: WingColor[];
  pattern: WingPattern;
  wingShape: WingShape;
  habitat: Habitat;
  region: string;
  migration: Migration;
  wingspan: string;
  symmetry: string;
  evolutionaryTrait: string;
  description: string;
}

export const specimens: ButterflySpecimen[] = [
  {
    id: "dc-001",
    commonName: "African Monarch",
    scientificName: "Danaus chrysippus",
    family: "Nymphalidae",
    genus: "Danaus",
    species: "chrysippus",
    image: danausChrysippus,
    colors: ["Orange", "Black"],
    pattern: "Solid",
    wingShape: "Rounded",
    habitat: "Savanna",
    region: "Kenya, Tanzania, Uganda",
    migration: "Migratory",
    wingspan: "70–80 mm",
    symmetry: "Bilateral, high",
    evolutionaryTrait: "Müllerian mimicry — toxic coloration warns predators",
    description: "One of Africa's most widespread butterflies. Its bright orange coloration signals toxicity acquired from milkweed host plants. A key species in mimicry studies."
  },
  {
    id: "pd-002",
    commonName: "African Swallowtail",
    scientificName: "Papilio dardanus",
    family: "Papilionidae",
    genus: "Papilio",
    species: "dardanus",
    image: papilioDardanus,
    colors: ["Yellow", "Black"],
    pattern: "Banded",
    wingShape: "Tailed",
    habitat: "Tropical Forest",
    region: "Kenya, Tanzania, Ethiopia",
    migration: "Resident",
    wingspan: "85–100 mm",
    symmetry: "Bilateral, moderate",
    evolutionaryTrait: "Female-limited polymorphism — females mimic toxic species",
    description: "Exhibits extraordinary female polymorphism. Males maintain consistent yellow-black pattern while females evolve diverse forms mimicking unpalatable species."
  },
  {
    id: "ga-003",
    commonName: "Large Striped Swordtail",
    scientificName: "Graphium antheus",
    family: "Papilionidae",
    genus: "Graphium",
    species: "antheus",
    image: graphiumAntheus,
    colors: ["Green", "Black"],
    pattern: "Striped",
    wingShape: "Tailed",
    habitat: "Tropical Forest",
    region: "Tanzania, Kenya, Uganda",
    migration: "Resident",
    wingspan: "70–90 mm",
    symmetry: "Bilateral, high",
    evolutionaryTrait: "Cryptic coloration — green bands match forest canopy light",
    description: "A swift forest flyer with striking green-and-black stripes. The sword-like tail extensions may serve as false antennae to confuse predators."
  },
  {
    id: "ba-004",
    commonName: "Squinting Bush Brown",
    scientificName: "Bicyclus anynana",
    family: "Satyrinae",
    genus: "Bicyclus",
    species: "anynana",
    image: bicyclusAnynana,
    colors: ["Brown", "Orange"],
    pattern: "Eyespot",
    wingShape: "Rounded",
    habitat: "Woodland",
    region: "Kenya, Tanzania, Mozambique",
    migration: "Resident",
    wingspan: "35–45 mm",
    symmetry: "Bilateral, variable",
    evolutionaryTrait: "Seasonal polyphenism — wet/dry season forms differ in eyespot size",
    description: "A model organism for studying phenotypic plasticity. Wet season forms have large eyespots for predator deflection; dry season forms are cryptic."
  },
  {
    id: "cb-005",
    commonName: "White-barred Emperor",
    scientificName: "Charaxes brutus",
    family: "Nymphalidae",
    genus: "Charaxes",
    species: "brutus",
    image: charaxesBrutus,
    colors: ["Orange", "White", "Brown"],
    pattern: "Banded",
    wingShape: "Angular",
    habitat: "Tropical Forest",
    region: "Uganda, Kenya, Tanzania",
    migration: "Resident",
    wingspan: "70–85 mm",
    symmetry: "Bilateral, high",
    evolutionaryTrait: "Robust wing form — adapted for powerful territorial flight",
    description: "A large, powerful flyer found in forest canopies. The white bar across dark wings is thought to function in species recognition and territorial display."
  },
  {
    id: "hm-006",
    commonName: "Diadem",
    scientificName: "Hypolimnas misippus",
    family: "Nymphalidae",
    genus: "Hypolimnas",
    species: "misippus",
    image: hypolimnasMisippus,
    colors: ["Black", "White", "Iridescent"],
    pattern: "Spotted",
    wingShape: "Broad",
    habitat: "Savanna",
    region: "Kenya, Tanzania, Uganda",
    migration: "Migratory",
    wingspan: "60–80 mm",
    symmetry: "Bilateral, high",
    evolutionaryTrait: "Batesian mimicry — female mimics toxic Danaus chrysippus",
    description: "Males display iridescent black-and-white patterns, while females are polymorphic mimics of the toxic African Monarch. A textbook example of Batesian mimicry."
  },
  {
    id: "jo-007",
    commonName: "Blue Pansy",
    scientificName: "Junonia oenone",
    family: "Nymphalidae",
    genus: "Junonia",
    species: "oenone",
    image: junoniaOenone,
    colors: ["Blue", "Brown"],
    pattern: "Eyespot",
    wingShape: "Rounded",
    habitat: "Grassland",
    region: "Tanzania, Kenya, Rwanda",
    migration: "Seasonal",
    wingspan: "45–55 mm",
    symmetry: "Bilateral, high",
    evolutionaryTrait: "Structural coloration — blue from wing scale nanostructure",
    description: "Vivid blue coloring produced by light-refracting nanostructures rather than pigment. Eyespots deflect predator attacks away from the body."
  },
  {
    id: "aa-008",
    commonName: "Small Orange Acraea",
    scientificName: "Acraea acerata",
    family: "Nymphalidae",
    genus: "Acraea",
    species: "acerata",
    image: acraeaAcerata,
    colors: ["Orange"],
    pattern: "Veined",
    wingShape: "Elongated",
    habitat: "Savanna",
    region: "Kenya, Uganda, Ethiopia",
    migration: "Seasonal",
    wingspan: "40–50 mm",
    symmetry: "Bilateral, high",
    evolutionaryTrait: "Aposematic coloration — bright orange warns of toxicity",
    description: "Translucent orange wings with dark veins create a distinctive appearance. Chemical defenses acquired from larval host plants make it unpalatable."
  },
  {
    id: "cd-009",
    commonName: "Crimson Tip",
    scientificName: "Colotis danae",
    family: "Pieridae",
    genus: "Colotis",
    species: "danae",
    image: colotisDanae,
    colors: ["White", "Red"],
    pattern: "Spotted",
    wingShape: "Rounded",
    habitat: "Savanna",
    region: "Kenya, Tanzania, Somalia",
    migration: "Seasonal",
    wingspan: "35–45 mm",
    symmetry: "Bilateral, moderate",
    evolutionaryTrait: "Sexual dimorphism — males have brighter crimson tips",
    description: "Delicate white wings tipped with crimson. Males display brighter markings for mate attraction, demonstrating sexual selection in wing coloration."
  },
  {
    id: "po-010",
    commonName: "Gaudy Commodore",
    scientificName: "Precis octavia",
    family: "Nymphalidae",
    genus: "Precis",
    species: "octavia",
    image: precisOctavia,
    colors: ["Red", "Blue", "Black"],
    pattern: "Mottled",
    wingShape: "Angular",
    habitat: "Montane Forest",
    region: "Kenya, Tanzania, Ethiopia",
    migration: "Seasonal",
    wingspan: "45–55 mm",
    symmetry: "Bilateral, complex",
    evolutionaryTrait: "Seasonal polyphenism — dramatic color change between wet/dry forms",
    description: "One of the most striking examples of seasonal polyphenism. Wet season form is vivid red-blue; dry season form is muted leaf-like brown."
  },
  {
    id: "eh-011",
    commonName: "Common Grass Yellow",
    scientificName: "Eurema hecabe",
    family: "Pieridae",
    genus: "Eurema",
    species: "hecabe",
    image: euremaHecabe,
    colors: ["Yellow"],
    pattern: "Solid",
    wingShape: "Rounded",
    habitat: "Grassland",
    region: "Kenya, Tanzania, Uganda",
    migration: "Migratory",
    wingspan: "35–45 mm",
    symmetry: "Bilateral, high",
    evolutionaryTrait: "UV reflectance — wing patterns visible to butterflies but not humans",
    description: "Appears uniformly yellow to humans, but UV patterns visible to other butterflies serve in mate recognition and species identification."
  },
  {
    id: "pn-012",
    commonName: "Narrow Green-banded Swallowtail",
    scientificName: "Papilio nireus",
    family: "Papilionidae",
    genus: "Papilio",
    species: "nireus",
    image: papilioNireus,
    colors: ["Green", "Black"],
    pattern: "Banded",
    wingShape: "Tailed",
    habitat: "Tropical Forest",
    region: "Kenya, Tanzania, Uganda",
    migration: "Resident",
    wingspan: "80–90 mm",
    symmetry: "Bilateral, high",
    evolutionaryTrait: "Structural coloration — iridescent green from photonic crystals",
    description: "The brilliant green band is produced by photonic crystal structures in wing scales. This iridescence shifts with viewing angle, a product of millions of years of evolution."
  },
  {
    id: "bau-013",
    commonName: "Pioneer White",
    scientificName: "Belenois aurota",
    family: "Pieridae",
    genus: "Belenois",
    species: "aurota",
    image: belenoisAurota,
    colors: ["White", "Black"],
    pattern: "Veined",
    wingShape: "Broad",
    habitat: "Savanna",
    region: "Kenya, Tanzania, Ethiopia",
    migration: "Migratory",
    wingspan: "40–55 mm",
    symmetry: "Bilateral, high",
    evolutionaryTrait: "Mass migration — one of Africa's great butterfly migrations",
    description: "Forms massive migratory swarms across East Africa. Wing venation pattern aids in thermoregulation during long-distance flights."
  },
  {
    id: "cc-014",
    commonName: "Giant Charaxes",
    scientificName: "Charaxes castor",
    family: "Nymphalidae",
    genus: "Charaxes",
    species: "castor",
    image: charaxesCastor,
    colors: ["Brown", "Orange"],
    pattern: "Banded",
    wingShape: "Tailed",
    habitat: "Woodland",
    region: "Uganda, Tanzania, Kenya",
    migration: "Resident",
    wingspan: "80–100 mm",
    symmetry: "Bilateral, moderate",
    evolutionaryTrait: "Large body size — adapted for aggressive aerial territorial defense",
    description: "One of Africa's largest butterflies. Powerful flight and large body size evolved for territorial defense and long-range dispersal through woodland habitats."
  },
  {
    id: "sp-015",
    commonName: "Forest Mother-of-Pearl",
    scientificName: "Salamis parhassus",
    family: "Nymphalidae",
    genus: "Salamis",
    species: "parhassus",
    image: salamisParhassus,
    colors: ["White", "Iridescent"],
    pattern: "Veined",
    wingShape: "Broad",
    habitat: "Montane Forest",
    region: "Kenya, Tanzania, Rwanda",
    migration: "Resident",
    wingspan: "65–80 mm",
    symmetry: "Bilateral, high",
    evolutionaryTrait: "Pearlescent iridescence — structural color from thin-film interference",
    description: "Wings shimmer with pearlescent iridescence created by thin-film interference in wing scales. Underside mimics a dead leaf for camouflage."
  },
  {
    id: "cs-016",
    commonName: "Blood-red Glider",
    scientificName: "Cymothoe sangaris",
    family: "Nymphalidae",
    genus: "Cymothoe",
    species: "sangaris",
    image: cymothoeSangaris,
    colors: ["Red"],
    pattern: "Solid",
    wingShape: "Broad",
    habitat: "Tropical Forest",
    region: "Uganda, Tanzania",
    migration: "Resident",
    wingspan: "55–70 mm",
    symmetry: "Bilateral, high",
    evolutionaryTrait: "Sexual dichromatism — males vivid red, females cryptic brown",
    description: "Males display vivid blood-red wings for mate attraction, while females are camouflaged brown. One of the most sexually dichromatic African butterflies."
  }
];

export const filterCategories = {
  colors: ["Orange", "Yellow", "Green", "Blue", "Red", "Brown", "Black", "White", "Iridescent"] as WingColor[],
  patterns: ["Solid", "Striped", "Spotted", "Eyespot", "Banded", "Veined", "Mottled"] as WingPattern[],
  wingShapes: ["Rounded", "Elongated", "Tailed", "Angular", "Broad"] as WingShape[],
  habitats: ["Savanna", "Montane Forest", "Coastal", "Woodland", "Grassland", "Tropical Forest"] as Habitat[],
  migrations: ["Migratory", "Resident", "Seasonal"] as Migration[],
  families: ["Nymphalidae", "Papilionidae", "Pieridae", "Satyrinae"] as Family[],
};
