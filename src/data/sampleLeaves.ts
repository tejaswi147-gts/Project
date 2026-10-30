import { HarvestReadinessAnalysis } from '../types';

export interface SampleLeaf {
  id: string;
  name: string;
  crop: string;
  disease: string;
  threatType: 'Fungal' | 'Bacterial' | 'Viral' | 'Healthy';
  severity: string;
  description: string;
  svgDataUri: string;
  box: {
    top: number;
    left: number;
    width: number;
    height: number;
    label: string;
  };
  harvestReadiness?: HarvestReadinessAnalysis;
}

// Helper to create botanical leaf SVG as data URI
function createLeafSvg(
  bgColor: string,
  leafColor: string,
  spotColor: string,
  haloColor: string,
  diseaseType: 'late_blight' | 'early_blight' | 'gray_spot' | 'rice_blast' | 'healthy'
): string {
  let spotsSvg = '';

  if (diseaseType === 'late_blight') {
    spotsSvg = `
      <!-- Late Blight irregular water-soaked dark lesions -->
      <path d="M140,110 Q165,95 190,115 Q210,135 195,160 Q170,180 145,155 Q125,130 140,110 Z" fill="${spotColor}" opacity="0.9" />
      <path d="M135,105 Q165,90 195,110 Q215,135 200,165 Q170,185 140,160 Q120,130 135,105 Z" fill="none" stroke="${haloColor}" stroke-width="6" opacity="0.6" />
      <circle cx="160" cy="135" r="14" fill="#2d2219" opacity="0.8" />
      <circle cx="215" cy="175" r="18" fill="${spotColor}" opacity="0.85" />
      <circle cx="215" cy="175" r="23" fill="none" stroke="${haloColor}" stroke-width="4" opacity="0.5" />
      <circle cx="120" cy="180" r="12" fill="${spotColor}" opacity="0.75" />
    `;
  } else if (diseaseType === 'early_blight') {
    spotsSvg = `
      <!-- Early Blight concentric rings target spot -->
      <circle cx="150" cy="130" r="32" fill="${haloColor}" opacity="0.5" />
      <circle cx="150" cy="130" r="24" fill="${spotColor}" opacity="0.9" />
      <circle cx="150" cy="130" r="18" fill="none" stroke="#2a1a10" stroke-width="3" />
      <circle cx="150" cy="130" r="11" fill="none" stroke="#4a3020" stroke-width="3" />
      <circle cx="150" cy="130" r="5" fill="#1e1005" />
      
      <circle cx="205" cy="165" r="22" fill="${haloColor}" opacity="0.5" />
      <circle cx="205" cy="165" r="16" fill="${spotColor}" opacity="0.85" />
      <circle cx="205" cy="165" r="9" fill="none" stroke="#2a1a10" stroke-width="2" />
    `;
  } else if (diseaseType === 'gray_spot') {
    spotsSvg = `
      <!-- Corn Gray Leaf Spot rectangular vein-delimited lesions -->
      <rect x="135" y="90" width="35" height="75" rx="3" fill="${spotColor}" opacity="0.9" />
      <rect x="132" y="87" width="41" height="81" rx="4" fill="none" stroke="${haloColor}" stroke-width="3" opacity="0.6" />
      <rect x="180" y="120" width="28" height="55" rx="2" fill="${spotColor}" opacity="0.85" />
      <rect x="110" y="130" width="22" height="40" rx="2" fill="${spotColor}" opacity="0.75" />
    `;
  } else if (diseaseType === 'rice_blast') {
    spotsSvg = `
      <!-- Rice Blast spindle-shaped elliptical lesions -->
      <ellipse cx="155" cy="120" rx="38" ry="14" transform="rotate(-30 155 120)" fill="${spotColor}" opacity="0.9" />
      <ellipse cx="155" cy="120" rx="42" ry="17" transform="rotate(-30 155 120)" fill="none" stroke="${haloColor}" stroke-width="4" opacity="0.6" />
      <ellipse cx="155" cy="120" rx="20" ry="7" transform="rotate(-30 155 120)" fill="#737373" />
      
      <ellipse cx="195" cy="160" rx="26" ry="10" transform="rotate(-25 195 160)" fill="${spotColor}" opacity="0.85" />
      <ellipse cx="195" cy="160" rx="14" ry="5" transform="rotate(-25 195 160)" fill="#737373" />
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="320" height="240">
    <rect width="320" height="240" fill="${bgColor}"/>
    <g transform="translate(10, 0)">
      <!-- Leaf Outline -->
      <path d="M60,190 C70,120 120,40 250,50 C260,140 180,210 60,190 Z" fill="${leafColor}" stroke="#1f4e28" stroke-width="2"/>
      <!-- Main Central Vein -->
      <path d="M60,190 Q150,135 250,50" fill="none" stroke="#2d6e38" stroke-width="3" stroke-linecap="round"/>
      <!-- Secondary Veins -->
      <path d="M100,165 Q140,160 180,180" fill="none" stroke="#2d6e38" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M130,145 Q170,125 210,140" fill="none" stroke="#2d6e38" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M165,120 Q190,95 230,105" fill="none" stroke="#2d6e38" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M100,165 Q110,130 120,100" fill="none" stroke="#2d6e38" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M130,145 Q150,105 170,75" fill="none" stroke="#2d6e38" stroke-width="1.5" stroke-linecap="round"/>
      ${spotsSvg}
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Helper to create botanical fruit / crop SVG as data URI
function createProduceSvg(
  type: 'ripe_tomato' | 'golden_paddy' | 'ripe_pepper' | 'breaker_tomato'
): string {
  let inner = '';
  if (type === 'ripe_tomato') {
    inner = `
      <!-- Deep Red Ripe Tomato with green calyx -->
      <radialGradient id="tomGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#ff5252" />
        <stop offset="60%" stop-color="#d32f2f" />
        <stop offset="100%" stop-color="#8b0000" />
      </radialGradient>
      <circle cx="160" cy="135" r="70" fill="url(#tomGrad)" stroke="#5c0000" stroke-width="2" />
      <!-- Calyx star -->
      <path d="M160,65 L165,50 L168,65 L180,55 L172,70 L188,72 L172,78 L182,90 L168,82 L160,95 L152,82 L138,90 L148,78 L132,72 L148,70 L140,55 L152,65 Z" fill="#2e7d32" stroke="#1b5e20" stroke-width="1.5" />
      <path d="M160,50 Q158,35 152,25" fill="none" stroke="#1b5e20" stroke-width="5" stroke-linecap="round" />
      <!-- Glossy highlight -->
      <ellipse cx="135" cy="105" rx="16" ry="10" transform="rotate(-30 135 105)" fill="#ffffff" opacity="0.35" />
    `;
  } else if (type === 'golden_paddy') {
    inner = `
      <!-- Golden ripe rice panicle drooping -->
      <path d="M60,200 Q120,160 170,110 Q210,70 250,55" fill="none" stroke="#795548" stroke-width="3" />
      <!-- Golden Grains -->
      ${Array.from({ length: 16 }).map((_, i) => {
        const x = 90 + i * 9;
        const y = 175 - i * 7 + (i % 2 === 0 ? 12 : -10);
        return `<ellipse cx="${x}" cy="${y}" rx="8" ry="4" transform="rotate(${20 + i * 2} ${x} ${y})" fill="#fbc02d" stroke="#f57f17" stroke-width="1.5" />`;
      }).join('')}
      <!-- Drooping tip -->
      <path d="M220,70 Q240,65 260,85 Q255,105 240,115" fill="none" stroke="#fbc02d" stroke-width="2.5" />
    `;
  } else if (type === 'breaker_tomato') {
    inner = `
      <!-- Breaker stage tomato: orange-yellow transitioning to pink -->
      <radialGradient id="breakerGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#ffb74d" />
        <stop offset="50%" stop-color="#ff7043" />
        <stop offset="100%" stop-color="#7cb342" />
      </radialGradient>
      <circle cx="160" cy="135" r="68" fill="url(#breakerGrad)" stroke="#558b2f" stroke-width="2" />
      <!-- Calyx -->
      <path d="M160,67 L165,52 L168,67 L180,57 L172,72 L188,74 L172,80 L182,92 L168,84 L160,97 L152,84 L138,92 L148,80 L132,74 L148,72 L140,57 L152,67 Z" fill="#388e3c" stroke="#1b5e20" stroke-width="1.5" />
      <path d="M160,52 Q158,37 152,27" fill="none" stroke="#1b5e20" stroke-width="5" stroke-linecap="round" />
      <ellipse cx="135" cy="105" rx="14" ry="8" transform="rotate(-30 135 105)" fill="#ffffff" opacity="0.3" />
    `;
  } else {
    inner = `
      <!-- Shiny green/red Bell Pepper -->
      <path d="M120,90 Q160,80 200,90 Q225,130 210,185 Q160,205 110,185 Q95,130 120,90 Z" fill="#2e7d32" stroke="#1b5e20" stroke-width="2" />
      <path d="M160,90 Q155,70 160,50" fill="none" stroke="#1b5e20" stroke-width="6" stroke-linecap="round" />
      <ellipse cx="140" cy="120" rx="15" ry="30" transform="rotate(-15 140 120)" fill="#4caf50" opacity="0.6" />
      <ellipse cx="145" cy="110" rx="8" ry="16" transform="rotate(-15 145 110)" fill="#ffffff" opacity="0.35" />
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="320" height="240">
    <rect width="320" height="240" fill="#141c16"/>
    ${inner}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'sample-ripe-tomato',
    name: 'Ripe Vine Tomato (Peak Harvest)',
    crop: 'Tomato',
    disease: 'Optimal Harvest Stage (Healthy)',
    threatType: 'Healthy',
    severity: 'Harvest Readiness: 96% Mature',
    description: 'Uniform deep-red gloss, closed blossom scar, firm elasticity, abscission zone reflexed.',
    svgDataUri: createProduceSvg('ripe_tomato'),
    box: { top: 22, left: 24, width: 52, height: 55, label: 'Ready to Harvest (96% Mature)' },
    harvestReadiness: {
      isReady: true,
      readinessScore: 96,
      maturityStage: 'Optimal Harvest Stage (Peak Commercial Ripe)',
      estimatedHarvestWindow: 'Ready to harvest today / next 24–48 hours',
      bestTimeOfDay: '06:30 AM – 09:30 AM (after dew evaporates; cool pulp prevents skin rupture)',
      visualSignsObserved: [
        '95%+ uniform crimson-red coloration with no green shoulders',
        'Calyx lobes reflexed outwards, pedicel ready to snap cleanly',
        'Smooth skin sheen with firm turgid fruit wall pressure',
      ],
      harvestTechnique: 'Grip fruit gently and snap upward at the natural stem knuckle (abscission node) or snip with clean hand shears.',
      postHarvestCare: 'Transfer immediately to shaded plastic crates at 14–18°C. Do not stack more than 2 layers deep to avoid bruising.',
    },
  },
  {
    id: 'sample-golden-rice',
    name: 'Golden Paddy Rice (Harvest Ready)',
    crop: 'Rice',
    disease: 'Optimal Harvest Stage (Healthy Panicles)',
    threatType: 'Healthy',
    severity: 'Harvest Readiness: 91% Mature',
    description: '85% panicle grains turned golden amber, moisture ~21%, firm chalk-free kernels.',
    svgDataUri: createProduceSvg('golden_paddy'),
    box: { top: 25, left: 20, width: 60, height: 50, label: 'Harvest Ready Panicle (91%)' },
    harvestReadiness: {
      isReady: true,
      readinessScore: 91,
      maturityStage: 'Golden Grain Maturity (Peak Field Readiness)',
      estimatedHarvestWindow: 'Harvest within next 2–4 days (before grain shattering)',
      bestTimeOfDay: '09:00 AM – 01:00 PM (after morning dew dries fully to prevent thresher clogging)',
      visualSignsObserved: [
        'Over 85% of grains on the main panicle have turned straw yellow / golden',
        'Flag leaf showing natural senescent drying at tip',
        'Grains in the lower third are hard and dough stage is complete',
      ],
      harvestTechnique: 'Cut stalks 10–15 cm above ground using serrated sickles or align combine reel for minimal shatter loss.',
      postHarvestCare: 'Thresh within 24 hours. Sun-dry on clean tarpaulins until moisture reaches safe 13–14% storage threshold.',
    },
  },
  {
    id: 'sample-breaker-tomato',
    name: 'Tomato (Breaker Stage - Turning)',
    crop: 'Tomato',
    disease: 'Intermediate Maturity Stage',
    threatType: 'Healthy',
    severity: 'Harvest Readiness: 65% Mature',
    description: 'Color break on blossom end (first 20% pink/orange blush), ideal for long-distance transit.',
    svgDataUri: createProduceSvg('breaker_tomato'),
    box: { top: 24, left: 26, width: 48, height: 50, label: 'Breaker Stage (Harvest in 3–5 days)' },
    harvestReadiness: {
      isReady: false,
      readinessScore: 65,
      maturityStage: 'Breaker / Turning Stage',
      estimatedHarvestWindow: 'Harvest in 3–5 days for local eating, OR pick now for distant wholesale shipping',
      bestTimeOfDay: 'Early morning (07:00 AM – 09:30 AM)',
      visualSignsObserved: [
        'Noticeable pink/tannish-yellow break across 15–30% of the blossom end',
        'Internal seed locules fully gelled',
        'Pulp still extremely firm, resistant to transport vibration',
      ],
      harvestTechnique: 'Snip carefully leaving 0.5 cm stem intact to prevent calyx puncture during crate stacking.',
      postHarvestCare: 'Store in well-ventilated ripening rooms at 18–21°C. Ethylene will complete uniform ripening naturally.',
    },
  },
  {
    id: 'sample-tomato-late-blight',
    name: 'Tomato Foliar Late Blight',
    crop: 'Tomato',
    disease: 'Late Blight (Phytophthora infestans)',
    threatType: 'Fungal',
    severity: 'Severe (38% damaged)',
    description: 'Dark water-soaked necrotic lesions with chlorotic yellow halo and decaying tips.',
    svgDataUri: createLeafSvg('#18241b', '#387346', '#3b2518', '#b8a635', 'late_blight'),
    box: { top: 25, left: 32, width: 42, height: 44, label: 'Late Blight Lesion (96.4%)' },
    harvestReadiness: {
      isReady: false,
      readinessScore: 40,
      maturityStage: 'Diseased Foliage / Vegetative Stress',
      estimatedHarvestWindow: 'Emergency sanitize: salvage mature green/breaker fruit now before rot spreads',
      bestTimeOfDay: 'Dry mid-morning; never harvest while foliage is wet with dew',
      visualSignsObserved: [
        'Severe necrotic lesions across photosynthetic leaf area',
        'Fungal sporulation threatening green fruit clusters',
      ],
      harvestTechnique: 'Pick healthy mature fruit separately; do not mix spotted fruit with healthy market produce.',
      postHarvestCare: 'Wash harvested fruit in 50ppm chlorinated water, dry rapidly, and isolate in cool storage.',
    },
  },
  {
    id: 'sample-tomato-early-blight',
    name: 'Tomato Early Blight Target Spot',
    crop: 'Tomato',
    disease: 'Early Blight (Alternaria solani)',
    threatType: 'Fungal',
    severity: 'Moderate (22% damaged)',
    description: 'Distinct concentric ring brown lesions with chlorotic yellow surrounding borders.',
    svgDataUri: createLeafSvg('#1c231e', '#3f7c4e', '#452b1b', '#d4c03b', 'early_blight'),
    box: { top: 32, left: 30, width: 38, height: 38, label: 'Alternaria Bullseye (94.1%)' },
    harvestReadiness: {
      isReady: true,
      readinessScore: 78,
      maturityStage: 'Late Fruiting Stage with Foliar Senescence',
      estimatedHarvestWindow: 'Harvest ripe clusters within 48 hours; prune diseased lower skirt leaves',
      bestTimeOfDay: '07:30 AM – 10:00 AM after leaf wetness dissipates',
      visualSignsObserved: [
        'Upper fruit trusses reaching full size and color',
        'Lower leaves showing premature defoliation from Alternaria target spots',
      ],
      harvestTechnique: 'Clip mature red/pink fruit; avoid contact with infected ground leaves.',
      postHarvestCare: 'Cure in shaded, well-ventilated crates. Remove all cull fruit from the field.',
    },
  },
  {
    id: 'sample-rice-blast',
    name: 'Rice Spindle Blast Leaf',
    crop: 'Rice',
    disease: 'Rice Blast (Magnaporthe oryzae)',
    threatType: 'Fungal',
    severity: 'High (32% damaged)',
    description: 'Diamond / spindle-shaped lesions with gray centers and dark brown borders.',
    svgDataUri: createLeafSvg('#162118', '#387844', '#423326', '#b09f41', 'rice_blast'),
    box: { top: 28, left: 25, width: 52, height: 32, label: 'Spindle Blast Lesion (96.8%)' },
    harvestReadiness: {
      isReady: false,
      readinessScore: 55,
      maturityStage: 'Panicle Heading / Milk Stage (Infected)',
      estimatedHarvestWindow: 'Wait 10–14 days for grain fill; apply protective bio-fungicide immediately',
      bestTimeOfDay: 'Inspect in morning; plan final harvest once moisture drops below 22%',
      visualSignsObserved: [
        'Spindle blast lesions on flag leaves reducing grain photosynthate transfer',
        'Grains still in milky-dough stage',
      ],
      harvestTechnique: 'Ensure clean threshing equipment to prevent carryover of fungal conidia.',
      postHarvestCare: 'Dry thoroughly to 13% moisture to arrest fungal reproduction in storage bags.',
    },
  },
  {
    id: 'sample-corn-gray-spot',
    name: 'Corn Gray Leaf Spot',
    crop: 'Corn',
    disease: 'Gray Leaf Spot',
    threatType: 'Fungal',
    severity: 'Moderate (26% damaged)',
    description: 'Vein-delimited parallel rectangular tan necrotic lesions across leaf blades.',
    svgDataUri: createLeafSvg('#19221a', '#4a824e', '#544636', '#c9b967', 'gray_spot'),
    box: { top: 22, left: 28, width: 46, height: 38, label: 'Rectangular Vein Blight (95.0%)' },
    harvestReadiness: {
      isReady: true,
      readinessScore: 88,
      maturityStage: 'Black Layer / Kernel Dent Maturity',
      estimatedHarvestWindow: 'Harvest in 5–8 days for grain; harvest sweet corn now',
      bestTimeOfDay: 'Mid-morning once dew has evaporated from the husk silks',
      visualSignsObserved: [
        'Husks turning papery tan and dry',
        'Kernel milk line has receded past 75%, black abscission layer forming',
      ],
      harvestTechnique: 'Snap ear firmly downward and twist or adjust combine snouts.',
      postHarvestCare: 'Store dry at 14% moisture in pest-proof cribs or aerated bins.',
    },
  },
  {
    id: 'sample-healthy-pepper',
    name: 'Healthy Pepper Specimen',
    crop: 'Pepper',
    disease: 'Healthy Specimen (No Pathogen)',
    threatType: 'Healthy',
    severity: 'Harvest Readiness: 94% Mature',
    description: 'Vibrant green chlorophyll distribution, thick fruit walls, waxy cuticle shine.',
    svgDataUri: createProduceSvg('ripe_pepper'),
    box: { top: 20, left: 20, width: 60, height: 60, label: 'Harvest Ready Pepper (94%)' },
    harvestReadiness: {
      isReady: true,
      readinessScore: 94,
      maturityStage: 'Peak Commercial Firmness & Color',
      estimatedHarvestWindow: 'Ready to harvest today / next 48 hours',
      bestTimeOfDay: '07:00 AM – 10:00 AM before afternoon field heat builds up',
      visualSignsObserved: [
        'Fruit reached full size with thick, firm pericarp walls',
        'Glossy deep sheen and firm resistance when squeezed gently',
        'Pedicel green and easily accessible for scissor cutting',
      ],
      harvestTechnique: 'Cut with clean secateurs leaving 1–2 cm stem attached; pulling by hand can tear plant branches.',
      postHarvestCare: 'Pre-cool to 10–12°C. Maintain high relative humidity (90–95%) to prevent fruit shriveling.',
    },
  },
];
