import { DiseaseInfo, DiseasePrediction, RiskLevel, WeatherData } from '../types';

interface CropKnowledge {
  aliases: string[];
  scientificName: string;
  highHumidityDiseases: DiseaseInfo[];
  moderateWarmDiseases: DiseaseInfo[];
  hotDryDiseases: DiseaseInfo[];
  coldWetDiseases: DiseaseInfo[];
  canopyAdvice: string;
}

const CROP_DATABASE: Record<string, CropKnowledge> = {
  tomato: {
    aliases: ['tomato', 'tomatoes', 'solanum lycopersicum', 'tamatar', 'టమోటా', 'தக்காளி', 'ಟೊಮೇಟೊ', 'തക്കാളി'],
    scientificName: 'Solanum lycopersicum',
    highHumidityDiseases: [
      {
        name: 'Late Blight',
        scientificName: 'Phytophthora infestans',
        threatType: 'Fungal',
        riskScore: 88,
        typicalSymptoms: 'Water-soaked irregular dark lesions on leaves and stems with white fuzzy sporulation beneath.',
        weatherTrigger: 'Relative humidity exceeding 75% coupled with moderate temperatures (17–24°C).',
      },
      {
        name: 'Early Blight & Target Spot',
        scientificName: 'Alternaria solani',
        threatType: 'Fungal',
        riskScore: 78,
        typicalSymptoms: 'Concentric ring circular brown lesions on older foliage leading to rapid chlorosis and defoliation.',
        weatherTrigger: 'Alternating wet and dry periods with warm ambient temperatures (22–29°C).',
      },
      {
        name: 'Bacterial Speck & Canker',
        scientificName: 'Pseudomonas syringae pv. tomato',
        threatType: 'Bacterial',
        riskScore: 72,
        typicalSymptoms: 'Tiny dark punctate spots surrounded by bright yellow chlorotic halos on foliage and fruit.',
        weatherTrigger: 'Prolonged leaf wetness and high atmospheric humidity during vegetative growth.',
      },
    ],
    moderateWarmDiseases: [
      {
        name: 'Septoria Leaf Spot',
        scientificName: 'Septoria lycopersici',
        threatType: 'Fungal',
        riskScore: 62,
        typicalSymptoms: 'Numerous small circular lesions with grayish centers and dark margins on lower leaves.',
        weatherTrigger: 'Moderate warmth (20–26°C) and intermittent canopy moisture.',
      },
      {
        name: 'Fusarium Wilt',
        scientificName: 'Fusarium oxysporum',
        threatType: 'Fungal',
        riskScore: 50,
        typicalSymptoms: 'Yellowing of lower foliage often on one side of the plant, followed by vascular browning.',
        weatherTrigger: 'Warm soil temperatures combined with moderate field humidity.',
      },
    ],
    hotDryDiseases: [
      {
        name: 'Two-Spotted Spider Mites & Russet Mites',
        scientificName: 'Tetranychus urticae',
        threatType: 'Pest',
        riskScore: 84,
        typicalSymptoms: 'Fine stippling on leaf surfaces, silken webbing, bronze discoloration, and leaf drop.',
        weatherTrigger: 'High temperatures (>30°C) and low ambient relative humidity (<45%).',
      },
      {
        name: 'Tomato Blossom End Rot',
        scientificName: 'Physiological Calcium / Moisture Deficit',
        threatType: 'Physiological',
        riskScore: 70,
        typicalSymptoms: 'Depressed, dark leathery rot at the blossom end of developing fruit.',
        weatherTrigger: 'Intense transpiration and irregular soil hydration during excessive heat periods.',
      },
    ],
    coldWetDiseases: [
      {
        name: 'Botrytis Gray Mold',
        scientificName: 'Botrytis cinerea',
        threatType: 'Fungal',
        riskScore: 82,
        typicalSymptoms: 'Velvety gray fungal growth on flowers, fruit, and stem girdling cankers.',
        weatherTrigger: 'Cool temperatures (<18°C) paired with sustained relative humidity (>85%).',
      },
    ],
    canopyAdvice: 'Ensure staked vine pruning to keep lower branches 15cm off soil, preventing splash-borne inocula.',
  },

  rice: {
    aliases: ['rice', 'paddy', 'oryza sativa', 'chawal', 'dhan', 'వరి', 'ధాన్యం', 'நெல்', 'அரிசி', 'ಭತ್ತ', 'ಅಕ್ಕಿ', 'നെല്ല്', 'അരി'],
    scientificName: 'Oryza sativa',
    highHumidityDiseases: [
      {
        name: 'Rice Blast',
        scientificName: 'Magnaporthe oryzae',
        threatType: 'Fungal',
        riskScore: 92,
        typicalSymptoms: 'Spindle-shaped elliptical lesions with gray centers and brown borders on leaves and neck nodes.',
        weatherTrigger: 'High relative humidity (>85%), night dew periods >10 hours, and temperatures 20–28°C.',
      },
      {
        name: 'Sheath Blight',
        scientificName: 'Rhizoctonia solani',
        threatType: 'Fungal',
        riskScore: 86,
        typicalSymptoms: 'Greenish-gray water-soaked spots on leaf sheaths near water line, progressing to irregular blotches.',
        weatherTrigger: 'High temperatures (28–32°C) combined with excessive relative humidity (>80%) in dense tillers.',
      },
      {
        name: 'Bacterial Leaf Blight (BLB)',
        scientificName: 'Xanthomonas oryzae pv. oryzae',
        threatType: 'Bacterial',
        riskScore: 79,
        typicalSymptoms: 'Water-soaked stripes along leaf margins turning yellow-white with milky bacterial ooze beads.',
        weatherTrigger: 'Warm monsoon rainfall, high humidity, and strong canopy winds causing micro-abrasions.',
      },
    ],
    moderateWarmDiseases: [
      {
        name: 'Brown Spot',
        scientificName: 'Bipolaris oryzae',
        threatType: 'Fungal',
        riskScore: 58,
        typicalSymptoms: 'Small oval brown spots on leaves and glumes with yellow halo in nutrient-stressed soil.',
        weatherTrigger: 'Moderate temperatures and intermittent humidity cycles with potassium/silicon deficiency.',
      },
    ],
    hotDryDiseases: [
      {
        name: 'Paddy Stem Borer & Gall Midge',
        scientificName: 'Scirpophaga incertulas',
        threatType: 'Pest',
        riskScore: 68,
        typicalSymptoms: 'Dead hearts in tillering stage and whiteheads at panicle emergence.',
        weatherTrigger: 'Warm dry spells promoting moth flight and oviposition.',
      },
    ],
    coldWetDiseases: [
      {
        name: 'Narrow Brown Leaf Spot',
        scientificName: 'Cercospora janseana',
        threatType: 'Fungal',
        riskScore: 60,
        typicalSymptoms: 'Short, linear reddish-brown lesions parallel to leaf veins.',
        weatherTrigger: 'Late-season overcast skies and cool standing water conditions.',
      },
    ],
    canopyAdvice: 'Regulate standing water depth; alternate wetting and drying (AWD) helps suppress Rhizoctonia sheath blight.',
  },

  cotton: {
    aliases: ['cotton', 'gossypium', 'kapas', 'పత్తి', 'பருத்தி', 'ಹತ್ತಿ', 'പരുത്തി'],
    scientificName: 'Gossypium hirsutum',
    highHumidityDiseases: [
      {
        name: 'Bacterial Blight / Angular Leaf Spot',
        scientificName: 'Xanthomonas citri pv. malvacearum',
        threatType: 'Bacterial',
        riskScore: 85,
        typicalSymptoms: 'Angular water-soaked leaf spots bounded by veins, black arm lesions on petioles, and boll rot.',
        weatherTrigger: 'Persistent warmth (25–32°C) with ambient relative humidity above 75%.',
      },
      {
        name: 'Cotton Boll Rot Complex',
        scientificName: 'Fusarium / Colletotrichum gossypii',
        threatType: 'Fungal',
        riskScore: 80,
        typicalSymptoms: 'Soft brown decay of immature capsules and staining of inner lint fiber.',
        weatherTrigger: 'Protracted rainfall and heavy morning canopy condensation during boll opening.',
      },
    ],
    moderateWarmDiseases: [
      {
        name: 'Alternaria Macrospora Leaf Spot',
        scientificName: 'Alternaria macrospora',
        threatType: 'Fungal',
        riskScore: 64,
        typicalSymptoms: 'Circular brown spots with purple margins on cotyledons and leaves.',
        weatherTrigger: 'Warm days with morning mist and high canopy density.',
      },
    ],
    hotDryDiseases: [
      {
        name: 'Whitefly Infestation & Leaf Curl Virus (CLCuV)',
        scientificName: 'Bemisia tabaci vector',
        threatType: 'Viral',
        riskScore: 90,
        typicalSymptoms: 'Upward leaf curling, thickening of veins, enations on underside, and stunted plant height.',
        weatherTrigger: 'Prolonged hot dry spells (>33°C) accelerating whitefly vector reproductive cycles.',
      },
      {
        name: 'Cotton Aphid & Red Spider Infestation',
        scientificName: 'Aphis gossypii',
        threatType: 'Pest',
        riskScore: 75,
        typicalSymptoms: 'Honeydew secretion, sooty mold buildup, leaf crinkling, and premature senescence.',
        weatherTrigger: 'High thermal units and low atmospheric moisture.',
      },
    ],
    coldWetDiseases: [
      {
        name: 'Cotton Seedling Damping-Off',
        scientificName: 'Rhizoctonia solani / Pythium spp.',
        threatType: 'Fungal',
        riskScore: 70,
        typicalSymptoms: 'Dark sunken lesions at soil line causing collapse of young emergent seedlings.',
        weatherTrigger: 'Soil temperatures below 20°C with saturated soil beds.',
      },
    ],
    canopyAdvice: 'Avoid excessive nitrogen fertilization which generates lush succulent vegetation attractive to sucking pests.',
  },

  wheat: {
    aliases: ['wheat', 'triticum', 'gehu', 'గోధుమ', 'கோதுமை', 'ಗೋಧಿ', 'ഗോതമ്പ്'],
    scientificName: 'Triticum aestivum',
    highHumidityDiseases: [
      {
        name: 'Yellow (Stripe) Rust',
        scientificName: 'Puccinia striiformis f. sp. tritici',
        threatType: 'Fungal',
        riskScore: 89,
        typicalSymptoms: 'Parallel yellow-orange pustule stripes between leaf veins releasing powdery urediniospores.',
        weatherTrigger: 'Cool humid conditions (10–18°C) with frequent dew or light precipitation.',
      },
      {
        name: 'Fusarium Head Blight (Scab)',
        scientificName: 'Fusarium graminearum',
        threatType: 'Fungal',
        riskScore: 84,
        typicalSymptoms: 'Bleaching of spikelets, pink/orange spore masses at base of glumes, and shriveled tombstones.',
        weatherTrigger: 'Warm, humid weather (>24°C and >80% RH) during anthesis/flowering stage.',
      },
    ],
    moderateWarmDiseases: [
      {
        name: 'Brown (Leaf) Rust',
        scientificName: 'Puccinia triticina',
        threatType: 'Fungal',
        riskScore: 68,
        typicalSymptoms: 'Scattered circular reddish-brown pustules predominantly on the upper leaf surface.',
        weatherTrigger: 'Moderate temperatures (18–25°C) with at least 6 hours of surface moisture.',
      },
      {
        name: 'Powdery Mildew',
        scientificName: 'Blumeria graminis f. sp. tritici',
        threatType: 'Fungal',
        riskScore: 63,
        typicalSymptoms: 'White cottony patches across leaf blades, turning grayish-brown with tiny black cleistothecia.',
        weatherTrigger: 'Dense canopy, high relative humidity (80–90%), and mild temperatures (15–22°C).',
      },
    ],
    hotDryDiseases: [
      {
        name: 'Terminal Heat Stress & Aphid Outbreak',
        scientificName: 'Rhopalosiphum padi / Abiotic Stress',
        threatType: 'Physiological',
        riskScore: 74,
        typicalSymptoms: 'Premature forced ripening, accelerated grain filling abortion, and honeydew sticky flags.',
        weatherTrigger: 'Sudden temperature rise above 30°C coupled with dry westerly winds during milk stage.',
      },
    ],
    coldWetDiseases: [
      {
        name: 'Septoria Tritici Blotch',
        scientificName: 'Zymoseptoria tritici',
        threatType: 'Fungal',
        riskScore: 76,
        typicalSymptoms: 'Irregular necrotic blotches with visible embedded black specks (pycnidia).',
        weatherTrigger: 'Continuous cold rainy spells with persistent droplet splash.',
      },
    ],
    canopyAdvice: 'Optimize row spacing and balanced potassium fertilizer to reinforce cellular lignification against rust.',
  },

  potato: {
    aliases: ['potato', 'potatoes', 'solanum tuberosum', 'aloo', 'బంగాళాదుంప', 'ఆలూ', 'உருளைக்கிழங்கு', 'ಆಲೂಗಡ್ಡೆ', 'ഉരുളക്കിഴങ്ങ്'],
    scientificName: 'Solanum tuberosum',
    highHumidityDiseases: [
      {
        name: 'Potato Late Blight',
        scientificName: 'Phytophthora infestans',
        threatType: 'Fungal',
        riskScore: 94,
        typicalSymptoms: 'Rapidly spreading dark water-soaked lesions with white mold margins, leading to total vine collapse.',
        weatherTrigger: 'Relative humidity >80% for >10 hours with temperatures between 15°C and 22°C.',
      },
      {
        name: 'Blackleg & Bacterial Soft Rot',
        scientificName: 'Pectobacterium carotovorum',
        threatType: 'Bacterial',
        riskScore: 78,
        typicalSymptoms: 'Inky black decay of stem base, yellow wilted canopy, and foul-smelling subterranean tuber decay.',
        weatherTrigger: 'Waterlogged soil profiles and warm humid atmospheric transitions.',
      },
    ],
    moderateWarmDiseases: [
      {
        name: 'Early Blight',
        scientificName: 'Alternaria solani',
        threatType: 'Fungal',
        riskScore: 67,
        typicalSymptoms: 'Concentric ring target lesions on mature leaves, causing premature drying of foliage.',
        weatherTrigger: 'Warm days (24–28°C) with heavy morning dew cycles.',
      },
    ],
    hotDryDiseases: [
      {
        name: 'Potato Tuber Moth & Zebra Chip Psyllid',
        scientificName: 'Phthorimaea operculella',
        threatType: 'Pest',
        riskScore: 72,
        typicalSymptoms: 'Foliar leaf mines and caterpillar tunneling into exposed seed tubers during dry soil cracking.',
        weatherTrigger: 'High temperatures (>28°C) and dry crusting soil conditions.',
      },
    ],
    coldWetDiseases: [
      {
        name: 'Rhizoctonia Canker & Black Scurf',
        scientificName: 'Rhizoctonia solani',
        threatType: 'Fungal',
        riskScore: 75,
        typicalSymptoms: 'Brown sunken cankers on underground sprouts and hard black sclerotia resting on tuber skins.',
        weatherTrigger: 'Cool damp soils (<15°C) that delay sprout emergence.',
      },
    ],
    canopyAdvice: 'Maintain thorough hilling to cover growing tubers with at least 5–8cm of loose soil, shielding from spore wash.',
  },

  corn: {
    aliases: ['corn', 'maize', 'zea mays', 'makka', 'మొక్కజొన్న', 'சோளம்', 'ಮೆಕ್ಕೆಜೋಳ', 'ചോളം'],
    scientificName: 'Zea mays',
    highHumidityDiseases: [
      {
        name: 'Gray Leaf Spot',
        scientificName: 'Cercospora zeae-maydis',
        threatType: 'Fungal',
        riskScore: 86,
        typicalSymptoms: 'Rectangular tan lesions strictly bordered by parallel veins, blighting large canopy leaf areas.',
        weatherTrigger: 'Protracted periods of relative humidity >85% and warm temperatures (24–30°C).',
      },
      {
        name: 'Southern Corn Rust',
        scientificName: 'Puccinia polysora',
        threatType: 'Fungal',
        riskScore: 81,
        typicalSymptoms: 'Dense golden-brown pustules primarily covering the upper leaf surfaces.',
        weatherTrigger: 'High tropical temperatures (26–32°C) combined with high ambient humidity.',
      },
    ],
    moderateWarmDiseases: [
      {
        name: 'Northern Corn Leaf Blight',
        scientificName: 'Setosphaeria turcica',
        threatType: 'Fungal',
        riskScore: 65,
        typicalSymptoms: 'Long elliptical cigar-shaped grayish lesions measuring 2.5 to 15 cm across leaf blades.',
        weatherTrigger: 'Moderate warmth (18–27°C) with 6+ hours of continuous dew moisture.',
      },
    ],
    hotDryDiseases: [
      {
        name: 'Fall Armyworm & Corn Earworm',
        scientificName: 'Spodoptera frugiperda',
        threatType: 'Pest',
        riskScore: 82,
        typicalSymptoms: 'Extensive windowpane whorl feeding, ragged leaves, and larval boring into developing ear silks.',
        weatherTrigger: 'Dry warm spells accelerating insect life-cycle transitions.',
      },
    ],
    coldWetDiseases: [
      {
        name: 'Pythium Seedling Blight',
        scientificName: 'Pythium ultimum',
        threatType: 'Fungal',
        riskScore: 71,
        typicalSymptoms: 'Soft water-soaked radicles and seedling collapse prior to emergence.',
        weatherTrigger: 'Saturated cold soils (<13°C) immediately following early planting.',
      },
    ],
    canopyAdvice: 'Ensure crop residue management and minimum tillage rotation to minimize Cercospora inocula carryover.',
  },

  soybean: {
    aliases: ['soybean', 'soya', 'glycine max'],
    scientificName: 'Glycine max',
    highHumidityDiseases: [
      {
        name: 'Asian Soybean Rust',
        scientificName: 'Phakopsora pachyrhizi',
        threatType: 'Fungal',
        riskScore: 91,
        typicalSymptoms: 'Tiny volcanic pustules on undersides of leaves, rapid yellowing and premature severe defoliation.',
        weatherTrigger: 'Extended leaf wetness (6–10 hours) and temperatures between 18°C and 27°C.',
      },
      {
        name: 'Frogeye Leaf Spot',
        scientificName: 'Cercospora sojina',
        threatType: 'Fungal',
        riskScore: 79,
        typicalSymptoms: 'Small circular lesions with gray centers and prominent reddish-brown margins.',
        weatherTrigger: 'Warm humid weather (25–30°C) with frequent dew cycles.',
      },
    ],
    moderateWarmDiseases: [
      {
        name: 'Septoria Brown Spot',
        scientificName: 'Septoria glycines',
        threatType: 'Fungal',
        riskScore: 64,
        typicalSymptoms: 'Irregular dark brown patches on lower foliage progressing upwards after canopy closure.',
        weatherTrigger: 'Warm wet springs with splashing rain.',
      },
    ],
    hotDryDiseases: [
      {
        name: 'Soybean Red Spider Mites & Charcoal Rot',
        scientificName: 'Macrophomina phaseolina',
        threatType: 'Fungal',
        riskScore: 80,
        typicalSymptoms: 'Silver stippling from mites, gray-black discoloration inside lower stem pith with micro-sclerotia.',
        weatherTrigger: 'Severe heat stress (>32°C) combined with prolonged drought periods.',
      },
    ],
    coldWetDiseases: [
      {
        name: 'Phytophthora Root & Stem Rot',
        scientificName: 'Phytophthora sojae',
        threatType: 'Fungal',
        riskScore: 78,
        typicalSymptoms: 'Dark brown stem lesions extending several nodes above the soil line with root rot.',
        weatherTrigger: 'Saturated, poorly drained heavy clay soils following cold rains.',
      },
    ],
    canopyAdvice: 'Plant disease-tolerant varieties with specific Rps genes and avoid excessive seeding rates that inhibit airflow.',
  },
};

/**
 * Universal botanical generator for crops not explicitly hardcoded in the database
 */
function generateGenericCropPathology(cropName: string, temp: number, humidity: number): CropKnowledge {
  const capCrop = cropName.charAt(0).toUpperCase() + cropName.slice(1);
  return {
    aliases: [cropName.toLowerCase()],
    scientificName: `${capCrop} hortensis / agro-cultivar`,
    highHumidityDiseases: [
      {
        name: `${capCrop} Anthracnose & Downy Mildew Complex`,
        scientificName: `Colletotrichum / Peronospora spp.`,
        threatType: 'Fungal',
        riskScore: Math.min(94, Math.round(humidity * 0.95)),
        typicalSymptoms: `Water-soaked circular lesions on ${cropName} leaves, chlorotic discoloration, and fuzzy spore mats under canopy.`,
        weatherTrigger: `High ambient humidity (${humidity}%) and favorable thermal range for mycelial germination.`,
      },
      {
        name: `${capCrop} Bacterial Leaf Spot`,
        scientificName: `Xanthomonas campestris pv. ${cropName.toLowerCase()}`,
        threatType: 'Bacterial',
        riskScore: Math.min(88, Math.round(humidity * 0.88)),
        typicalSymptoms: `Angular necrotic lesions along leaf veins with yellow marginal chlorosis and bacterial exudate.`,
        weatherTrigger: `Moist leaf microclimate and rainfall droplet kinetic dispersal.`,
      },
    ],
    moderateWarmDiseases: [
      {
        name: `${capCrop} Alternaria Blight`,
        scientificName: `Alternaria alternata`,
        threatType: 'Fungal',
        riskScore: 65,
        typicalSymptoms: `Concentric target spots and leaf edge necrosis across intermediate ${cropName} foliage.`,
        weatherTrigger: `Moderate warmth and diurnal humidity swings.`,
      },
    ],
    hotDryDiseases: [
      {
        name: `${capCrop} Two-Spotted Spider Mites & Foliar Desiccation`,
        scientificName: `Tetranychus spp. / Abiotic stress`,
        threatType: 'Pest',
        riskScore: 78,
        typicalSymptoms: `Speckled yellowing of upper canopy, microscopic webbing, and reduced photosynthetic capacity.`,
        weatherTrigger: `Elevated ambient temperatures (${temp}°C) and dry airflow stripping boundary layer humidity.`,
      },
    ],
    coldWetDiseases: [
      {
        name: `${capCrop} Damping-Off & Collar Rot`,
        scientificName: `Pythium / Rhizoctonia complex`,
        threatType: 'Fungal',
        riskScore: 74,
        typicalSymptoms: `Basal stem discoloration and sudden wilting of emergent root crowns.`,
        weatherTrigger: `Cold soil saturated conditions slowing seedling metabolic vigor.`,
      },
    ],
    canopyAdvice: `Maintain optimal plant spacing and ensure well-drained soil structure to prevent stagnant moisture pockets.`,
  };
}

/**
 * Mock integration for Google Gemini AI API.
 * Takes the crop name and weather data, and generates a structured, simulated 3-paragraph response
 * detailing potential plant diseases triggered by those specific weather conditions and actionable precautions.
 */
export async function generateGeminiCropDiagnosis(
  cropNameInput: string,
  weather: WeatherData
): Promise<DiseasePrediction> {
  // Simulate Gemini API inference latency (950ms)
  await new Promise((resolve) => setTimeout(resolve, 950));

  const cleanCrop = cropNameInput.trim().toLowerCase();
  
  // Find match in crop database or generate realistic botanical profile
  let cropKnowledge: CropKnowledge | undefined;
  for (const key of Object.keys(CROP_DATABASE)) {
    if (CROP_DATABASE[key].aliases.some((alias) => cleanCrop.includes(alias) || alias.includes(cleanCrop))) {
      cropKnowledge = CROP_DATABASE[key];
      break;
    }
  }

  if (!cropKnowledge) {
    cropKnowledge = generateGenericCropPathology(cropNameInput.trim(), weather.temperature, weather.humidity);
  }

  const { temperature, humidity, dewPoint, windSpeed, locationName } = weather;
  const formattedCropName = cropNameInput.trim().charAt(0).toUpperCase() + cropNameInput.trim().slice(1);

  // Evaluate microclimate regime
  let activeDiseases: DiseaseInfo[] = [];
  let overallRisk: RiskLevel = 'Low';
  let riskBadgeColor = 'emerald';
  let primaryThreatCategory = 'Preventative / Nominal';

  if (humidity >= 75 && temperature >= 16 && temperature <= 28) {
    // High humidity + temperate warm = Fungal explosive conditions
    activeDiseases = cropKnowledge.highHumidityDiseases;
    overallRisk = humidity > 85 ? 'Severe' : 'High';
    primaryThreatCategory = 'Fungal Sporulation & Zoospore Dispersal';
  } else if (humidity >= 70 && temperature > 28) {
    // Warm + humid = Bacterial & High Fungal
    activeDiseases = cropKnowledge.highHumidityDiseases.concat(cropKnowledge.moderateWarmDiseases);
    overallRisk = 'High';
    primaryThreatCategory = 'Bacterial Exudation & Foliar Blight';
  } else if (temperature >= 31 && humidity < 50) {
    // Hot + dry = Pest vectors & spider mites
    activeDiseases = cropKnowledge.hotDryDiseases;
    overallRisk = temperature > 35 ? 'High' : 'Moderate';
    primaryThreatCategory = 'Mite Proliferation & Thermal Stress';
  } else if (temperature < 17 && humidity >= 70) {
    // Cold + damp = Botrytis / Damping-off / Rust
    activeDiseases = cropKnowledge.coldWetDiseases.concat(cropKnowledge.moderateWarmDiseases);
    overallRisk = humidity > 80 ? 'High' : 'Moderate';
    primaryThreatCategory = 'Cool-Damp Mycotic Infection';
  } else {
    // Moderate conditions
    activeDiseases = cropKnowledge.moderateWarmDiseases.length > 0 
      ? cropKnowledge.moderateWarmDiseases 
      : cropKnowledge.highHumidityDiseases.slice(0, 1);
    overallRisk = 'Low';
    primaryThreatCategory = 'Baseline Pathological Vigilance';
  }

  // Ensure at least 2 diseases are highlighted
  if (activeDiseases.length < 2 && cropKnowledge.highHumidityDiseases.length > 0) {
    activeDiseases.push(cropKnowledge.highHumidityDiseases[0]);
  }

  const primaryDiseaseNames = activeDiseases.map((d) => `${d.name} (${d.scientificName})`).join(' and ');
  const mainDisease = activeDiseases[0];

  // Craft 3-paragraph simulated Gemini AI response:
  // Paragraph 1: Microclimate Assessment & Disease Susceptibility
  const paragraph1_PathologySummary = `Based on real-time atmospheric readings from ${locationName} showing an ambient temperature of ${temperature}°C and a relative humidity index of ${humidity}% (with an atmospheric dew point of ${dewPoint}°C), your ${formattedCropName} plantation is currently under ${overallRisk.toUpperCase()} vulnerability to ${primaryThreatCategory.toLowerCase()}. The prevailing microclimate satisfies the critical threshold criteria for the incubation of ${primaryDiseaseNames}. Pathogen sporangia and bacterial inocula rapidly colonize the foliar canopy when prolonged relative humidity remains above ${Math.max(65, humidity - 5)}%, substantially shortening the infection cycle from latent presence to visible macroscopic tissue lesions.`;

  // Paragraph 2: Biological Infection Mechanisms & Environmental Incubation Factors
  const paragraph2_EnvironmentalTriggers = `At ${temperature}°C and ${humidity}% atmospheric moisture, the physiological boundary layer over ${formattedCropName} leaves remains saturated for extended diurnal windows. Specifically, ${mainDisease.name} spores require only 4 to 8 hours of continuous surface leaf wetness to germinate germ tubes and enter leaf stomata or micro-wounds created by wind speeds of ${windSpeed} km/h. Concurrently, high atmospheric humidity prevents rapid transpiration cooling, triggering cellular transpiration stress and softening leaf cuticle membranes. This leaves the vascular parenchyma of ${formattedCropName} vulnerable to enzymatic cell-wall degradation and accelerated pathogen proliferation across field rows.`;

  // Paragraph 3: Actionable Agronomic Precautions, Interventions & Protective Regimens
  const paragraph3_ActionablePrecautions = `To arrest disease outbreak and protect harvest yield, immediate field intervention is recommended within the next 24 to 48 hours. Farmers must avoid overhead sprinkler irrigation during late afternoon or evening hours to reduce nocturnal leaf moisture retention, switching strictly to root-zone drip or morning furrow irrigation. Apply a preventative protective spray—such as copper hydroxide/oxychloride (2.5g/L) or a bio-fungicide formulation containing Bacillus subtilis / Trichoderma viride—prior to further forecasted rain events. Conduct rigorous canopy scouting across lower plant skirts, prune yellowing senescent foliage to maximize cross-canopy aeration, and ensure drainage channels are cleared to prevent root-zone water stagnation.`;

  // Curated Actionable Bullet Points
  const bulletPrecautions: string[] = [
    `Irrigation Protocol: Discontinue overhead sprinkler irrigation immediately. Irrigate strictly via drip or early-morning ground furrow to ensure canopy drying before twilight.`,
    `Protective Spray Application: Apply a preventative broad-spectrum protective formulation (e.g. Copper Hydroxide @ 2.0g/L or Mancozeb 75% WP @ 2.5g/L) within 24 hours.`,
    `Biological Inoculation: Apply foliar spray of Bacillus subtilis (2ml/L) or Trichoderma harzianum to establish competitive antagonism against pathogenic mycelia.`,
    `Canopy Aeration & Pruning: De-sucker and trim bottom vegetative foliage within 15 cm of the soil surface to boost lateral ventilation and prevent soil-splash contamination.`,
    `Field Scouting Routine: Inspect lower and inner canopy leaves twice daily for early water-soaked lesions, necrotic rings, or velvety sporulation mats.`,
    `Soil & Nitrogen Calibration: Avoid excessive synthetic nitrate applications which cause weak succulent leaf growth; supplement with potassium silicate to harden plant cell walls.`,
  ];

  // Tailored immediate single intervention
  let immediateIntervention = `Halt overhead irrigation immediately and apply a preventative bio-fungicide spray before nightfall.`;
  if (overallRisk === 'Severe' || overallRisk === 'High') {
    immediateIntervention = `High pathogen alert: Inspect lower canopy immediately for water-soaked lesions and apply targeted protective fungicide within 24 hours.`;
  } else if (temperature >= 32) {
    immediateIntervention = `Heat & pest alert: Check underside of leaves for mite webbing; irrigate at dawn to alleviate thermal transpiration stress.`;
  }

  // Treatment recommendation
  const recommendedFungicideOrTreatment = humidity > 70 
    ? `Protective: Copper Oxychloride (50% WP @ 2.5g/L) or Azoxystrobin (23% SC @ 1ml/L) + Organic Bio-control: Bacillus subtilis spray`
    : `Organic Neem Seed Kernel Extract (5%) / Horticultural Mineral Oil for sucking pests + Potassium Bicarbonate foliar spray`;

  const irrigationGuidance = humidity > 75 
    ? `Reduce irrigation frequency by 25%. Restrict watering to 06:00–09:00 AM only. Ensure field furrows drain completely within 2 hours.`
    : `Maintain regular soil moisture via drip irrigation. Mulch root zone with organic straw to retain soil moisture without wetting canopy leaves.`;

  return {
    cropName: formattedCropName,
    overallRisk,
    primaryDiseases: activeDiseases,
    paragraph1_PathologySummary,
    paragraph2_EnvironmentalTriggers,
    paragraph3_ActionablePrecautions,
    bulletPrecautions,
    immediateIntervention,
    recommendedFungicideOrTreatment,
    irrigationGuidance,
    confidenceScore: 94,
  };
}
