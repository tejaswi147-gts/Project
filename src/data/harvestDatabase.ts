export interface HarvestStage {
  stage: string;
  desc: string;
  bestFor: string;
  status: 'immature' | 'optimal' | 'ripe' | 'overripe';
}

export interface CropHarvestGuide {
  id: string;
  name: string;
  category: 'Fruit' | 'Vegetable' | 'Grain' | 'Cash Crop';
  names: {
    en: string;
    te: string;
    ta: string;
    kn: string;
    ml: string;
    hi: string;
  };
  duration: string;
  idealTimeOfDay: string;
  idealWeatherWindow: string;
  weatherWarning: string;
  optimalGrainMoisture?: string;
  visualSigns: string[];
  tactileSigns: string[];
  harvestStages: HarvestStage[];
  postHarvestTips: string;
  storageConditions: string;
}

export const HARVEST_DATABASE: CropHarvestGuide[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    category: 'Vegetable',
    names: {
      en: 'Tomato',
      te: 'టమోటా',
      ta: 'தக்காளி',
      kn: 'ಟೊಮೇಟೊ',
      ml: 'തക്കാളി',
      hi: 'टमाटर',
    },
    duration: '60–85 days after transplanting (repeats every 4–5 days)',
    idealTimeOfDay: 'Early morning (06:30–09:30 AM) after dew dries, or late afternoon',
    idealWeatherWindow: 'Dry weather with moderate ambient temperature (18–26°C)',
    weatherWarning: 'Never harvest wet tomatoes after heavy rain; moisture trapped under the calyx triggers rapid Rhizopus soft rot within 24 hours.',
    visualSigns: [
      'Breaker stage: Star-shaped yellow/pink blush developing at the blossom end.',
      'Turning stage: 10% to 30% of surface showing vibrant pink or red color.',
      'Calyx (green cap) separates cleanly without snapping the stem.',
    ],
    tactileSigns: [
      'Fruit yields slightly to gentle thumb pressure (not rock hard, not mushy).',
      'Skin develops a smooth, waxy sheen rather than dull green.',
    ],
    harvestStages: [
      { stage: 'Mature Green', desc: 'Full size, jelly inside seed cavity, no pink blush', bestFor: 'Export / 7+ days transit', status: 'immature' },
      { stage: 'Breaker / Pink', desc: '10–30% pink blush at blossom tip', bestFor: 'Distant wholesale markets (3–5 days)', status: 'optimal' },
      { stage: 'Table Ripe', desc: '60–90% rich red, firm flesh', bestFor: 'Local markets & immediate consumption', status: 'ripe' },
      { stage: 'Overripe', desc: 'Deep dark red, soft flesh with splitting risk', bestFor: 'Processing / Puree only', status: 'overripe' },
    ],
    postHarvestTips: 'Harvest with stalks attached using gentle twist-and-lift motion; avoid stacking more than 3 crates high to prevent bottom fruit bruising.',
    storageConditions: '12–15°C at 85–90% RH for breaker tomatoes; never refrigerate below 10°C to preserve aroma and prevent chilling injury.',
  },

  {
    id: 'rice',
    name: 'Rice / Paddy',
    category: 'Grain',
    names: {
      en: 'Rice / Paddy',
      te: 'వరి / ధాన్యం',
      ta: 'நெல்',
      kn: 'ಭತ್ತ',
      ml: 'നെല്ല്',
      hi: 'धान / चावल',
    },
    duration: '110–145 days after sowing (30–35 days after flowering)',
    idealTimeOfDay: 'Mid-morning (09:30 AM to 03:00 PM) once dew has completely evaporated',
    idealWeatherWindow: 'Clear sunny days with low humidity (<60%) to prevent grain moisture re-absorption',
    weatherWarning: 'Harvest immediately if cyclonic rain is forecasted; standing mature paddy lodges easily and seeds germinate inside wet panicles.',
    optimalGrainMoisture: '20–22% at harvest, dry immediately to 12–14% for safe storage',
    visualSigns: [
      '80% to 85% of panicle grains turn golden yellow or straw colored.',
      'Upper panicle grains are hard and flinty; lowest 2–3 grains in soft dough stage.',
      'Flag leaves start yellowing and drying from tips downward.',
    ],
    tactileSigns: [
      'Grain cracks with a sharp crisp snap between teeth, indicating moisture <22%.',
      'Panicles droop heavily towards the ground under grain weight.',
    ],
    harvestStages: [
      { stage: 'Dough Stage', desc: 'Milky center turns firm but dents under thumbnail', bestFor: 'Too early; leads to chalky broken grains', status: 'immature' },
      { stage: 'Golden Ripe', desc: '80–85% golden grains, moisture 20–22%', bestFor: 'Ideal harvest window for combine/manual reaping', status: 'optimal' },
      { stage: 'Dead Ripe', desc: '100% dry, straw completely brown', bestFor: 'High shattering loss, grain crack during milling', status: 'overripe' },
    ],
    postHarvestTips: 'Thresh within 24 hours of cutting; sun-dry on clean tarpaulins for 2–3 days until moisture drops below 14% to prevent aflatoxin mold.',
    storageConditions: 'Dry airtight storage at <14% grain moisture, sealed in hermetic bags (PICS bags) or galvanized bins.',
  },

  {
    id: 'mango',
    name: 'Mango',
    category: 'Fruit',
    names: {
      en: 'Mango',
      te: 'మామిడి',
      ta: 'மாம்பழம்',
      kn: 'ಮಾವಿನಹಣ್ಣು',
      ml: 'മാമ്പഴം',
      hi: 'आम',
    },
    duration: '100–135 days after fruit set (varietal dependent)',
    idealTimeOfDay: 'Early morning (06:00–10:00 AM) to minimize latex spurting and sap burn',
    idealWeatherWindow: 'Dry sunny weather; avoid harvesting during damp or foggy mornings',
    weatherWarning: 'Sap flow is twice as acidic and corrosive during cloudy/humid days; harvest with 1cm pedicel intact to avoid sap rot.',
    visualSigns: [
      'Shoulders of the fruit rise above the stem attachment point (pedicel dip).',
      'Skin color turns from dull flat green to lighter yellowish-olive with white bloom/powder.',
      'Lenticels (skin dots) become prominent and change from white to brownish-red.',
    ],
    tactileSigns: [
      'Specific gravity test: Mature mangoes sink when immersed in water (sp. gr. > 1.01).',
      'Flesh near seed turns pale yellow upon test cut.',
    ],
    harvestStages: [
      { stage: 'Tapka Stage', desc: '1–2 naturally ripened fruits drop on the ground', bestFor: 'Sign that whole tree is ready for harvest', status: 'optimal' },
      { stage: 'Mature Hard Green', desc: 'Shoulders raised, pulp yellowing at seed', bestFor: 'Commercial harvest, distant transport & controlled ripening', status: 'optimal' },
      { stage: 'Tree Ripe', desc: 'Yellow color on tree, soft to touch', bestFor: 'Immediate local eating; cannot survive transport', status: 'ripe' },
    ],
    postHarvestTips: 'Use mango harvesters with nylon collection bags and shears; de-sap immediately on tilted wash racks to prevent sap burn blemishes.',
    storageConditions: 'Ripen at 20–24°C; store ripe fruit at 10–12°C with 85–90% RH. Never store below 8°C (causes chilling injury and skin browning).',
  },

  {
    id: 'banana',
    name: 'Banana',
    category: 'Fruit',
    names: {
      en: 'Banana',
      te: 'అరటి',
      ta: 'வாழை',
      kn: 'ಬಾಳೆಹಣ್ಣು',
      ml: 'വാഴപ്പഴം',
      hi: 'केला',
    },
    duration: '90–120 days after flower emergence (shooting)',
    idealTimeOfDay: 'Morning before noon',
    idealWeatherWindow: 'Dry day; avoid harvesting in waterlogged conditions',
    weatherWarning: 'High ambient heat during harvest (>35°C) triggers premature finger drop and pulp boiling inside peel.',
    visualSigns: [
      'Angles on individual fingers disappear; fingers become plump and round in cross-section.',
      'Drying of top leaves (flag leaf dry, 3–4 functional leaves remaining).',
      'Floral remnants (perianth flower tips) at finger ends fall off easily with light touch.',
    ],
    tactileSigns: [
      'Fruit fingers feel heavy and full with no sharp ribs.',
      'Pulp is firm and pale cream when snapped.',
    ],
    harvestStages: [
      { stage: '3/4 Full Maturity', desc: 'Angles slightly visible, compact bunch', bestFor: 'Long distance export (shipment > 10 days)', status: 'immature' },
      { stage: 'Full Mature Green', desc: 'Ribs rounded, plump smooth fingers', bestFor: 'Domestic markets (2–4 days travel)', status: 'optimal' },
      { stage: 'Tree Yellow', desc: 'Fingers turning yellow on plant', bestFor: 'Splits open, attracts birds & fruit bats', status: 'overripe' },
    ],
    postHarvestTips: 'Cut bunch with 30cm stalk for easy lifting; wrap in foam padding and de-hand in clean water with 0.1% alum to coagulate latex.',
    storageConditions: 'Store green bunches at 13–14°C at 90–95% RH. Ripen using ethylene gas (100 ppm) at 16–18°C.',
  },

  {
    id: 'cotton',
    name: 'Cotton',
    category: 'Cash Crop',
    names: {
      en: 'Cotton',
      te: 'పత్తి',
      ta: 'பருத்தி',
      kn: 'ಹತ್ತಿ',
      ml: 'പരുത്തി',
      hi: 'कपास',
    },
    duration: '150–180 days after sowing (multiple pickings every 15–20 days)',
    idealTimeOfDay: 'Mid-morning (10:00 AM to 03:00 PM) after morning dew has completely evaporated',
    idealWeatherWindow: 'Warm sunny weather; never pick during foggy or cloudy mornings',
    weatherWarning: 'Picking cotton with morning dew causes yellow lint staining, fungal boll rot, and severe market price deductions.',
    optimalGrainMoisture: 'Lint moisture must be <8% during bagging',
    visualSigns: [
      'Bolls burst open fully and white fluffy lint is exposed.',
      'Boll burr (bracts) dry, brown and curled back.',
      'Lint pulls out smoothly without sticking to carpel walls.',
    ],
    tactileSigns: [
      'Lint feels dry, fluffy, and springy between fingers.',
      'No stickiness from aphids or whitefly honeydew.',
    ],
    harvestStages: [
      { stage: 'First Picking', desc: 'Bottom 40% bolls fully open', bestFor: 'Highest quality long-staple fiber', status: 'optimal' },
      { stage: 'Second Picking', desc: 'Middle canopy bolls open (15 days later)', bestFor: 'Good bulk yield', status: 'optimal' },
      { stage: 'Late Gleaning', desc: 'Top small bolls', bestFor: 'Lower grade fiber, mix separately', status: 'ripe' },
    ],
    postHarvestTips: 'Pick strictly in clean cotton bags; avoid polypropylene sacks which contaminate spinning mills with plastic shreds.',
    storageConditions: 'Store in dry ventilated sheds on raised wooden pallets; keep away from damp soil floors to avoid yellow moisture staining.',
  },

  {
    id: 'chilli',
    name: 'Chilli / Pepper',
    category: 'Vegetable',
    names: {
      en: 'Chilli / Pepper',
      te: 'మిరప',
      ta: 'மிளகாய்',
      kn: 'ಮೆಣಸಿನಕಾಯಿ',
      ml: 'മുളക്',
      hi: 'मिर्च',
    },
    duration: 'Green chilli: 70–80 days; Red ripe dry chilli: 110–130 days',
    idealTimeOfDay: 'Morning hours',
    idealWeatherWindow: 'Dry sunny days, especially critical for sun-drying red ripe pods',
    weatherWarning: 'Rain during drying stage causes severe anthracnose pod rot (fruit dieback) and bleaching of red capsaicin pigments.',
    visualSigns: [
      'Green harvest: Pods reach full size with thick shiny waxy skin and pungent aroma.',
      'Red dry harvest: 100% deep crimson red color across entire pod with no green streaks.',
    ],
    tactileSigns: [
      'Green pods snap crisply when bent.',
      'Sun-dried red pods rattle seeds inside when shaken.',
    ],
    harvestStages: [
      { stage: 'Green Plump', desc: 'Full length, dark glossy green, firm', bestFor: 'Fresh culinary vegetable market', status: 'optimal' },
      { stage: 'Deep Red Ripe', desc: 'Uniform crimson red, succulent', bestFor: 'Drying into whole red chillies / paprika powder', status: 'optimal' },
    ],
    postHarvestTips: 'Pluck with stalk intact to avoid skin tearing at fruit cap; spread red chillies on concrete drying yards or polythene sheets for 8–10 days.',
    storageConditions: 'Dried chillies at <10% moisture packed in polythene-lined gunny bags in cool dry godowns at 10–12°C.',
  },

  {
    id: 'potato',
    name: 'Potato',
    category: 'Vegetable',
    names: {
      en: 'Potato',
      te: 'బంగాళాదుంప / ఆలూ',
      ta: 'உருளைக்கிழங்கு',
      kn: 'ಆಲೂಗಡ್ಡೆ',
      ml: 'ഉരുളക്കിഴങ്ങ്',
      hi: 'आलू',
    },
    duration: '80–120 days after planting (haulm cutting 10–12 days prior to digging)',
    idealTimeOfDay: 'Morning before soil becomes hot (07:00–11:00 AM)',
    idealWeatherWindow: 'Dry soil conditions; avoid digging in wet saturated soil',
    weatherWarning: 'Digging tubers in wet soil coats them in damp clay, promoting bacterial soft rot (Erwinia) during transit.',
    visualSigns: [
      'Vines and foliage turn yellow, collapse and dry out naturally.',
      'De-haulming: Cut vines 10–14 days prior to digging to allow tuber skin to harden (curing).',
      'Skin does not feather or peel off under thumb rubbing test.',
    ],
    tactileSigns: [
      'Tuber skin is tough, firm, and fully set.',
      'Clean separation from stolon root attachments.',
    ],
    harvestStages: [
      { stage: 'Early New Potato', desc: 'Thin peeling skin, high moisture', bestFor: 'Immediate cooking (cannot store)', status: 'immature' },
      { stage: 'Cured Ware Potato', desc: 'Skin thickened after 10 days de-haulming', bestFor: 'Commercial storage & long-distance transport', status: 'optimal' },
    ],
    postHarvestTips: 'Cure harvested potatoes in heaps covered with straw in a dark ventilated room for 10–15 days to heal minor harvest skin abrasions.',
    storageConditions: 'Cured potatoes store at 10–12°C with 90% RH for table consumption, or 4°C for seed potatoes (prevent light exposure to stop solanine greening).',
  },

  {
    id: 'corn',
    name: 'Corn / Maize',
    category: 'Grain',
    names: {
      en: 'Corn / Maize',
      te: 'మొక్కజొన్న',
      ta: 'சோளம்',
      kn: 'ಮೆಕ್ಕೆಜೋಳ',
      ml: 'ചോളം',
      hi: 'मक्का',
    },
    duration: 'Sweet corn: 75–85 days; Grain maize: 100–120 days',
    idealTimeOfDay: 'Sweet corn: Dawn / early morning (sugar converts to starch in afternoon heat). Grain: Afternoon',
    idealWeatherWindow: 'Dry clear days',
    weatherWarning: 'Harvesting grain corn above 25% moisture promotes Aspergillus ear rot and dangerous aflatoxin contamination.',
    optimalGrainMoisture: 'Sweet corn: 75% moisture (milky). Grain: 18–20% moisture at harvest.',
    visualSigns: [
      'Silks at ear tip turn dark brown, dry and crinkled.',
      'Husk leaves fade from green to light papery straw color.',
      'Grain kernel: Black layer forms at the tip of the kernel where it attaches to the cob.',
    ],
    tactileSigns: [
      'Sweet corn thumbnail test: Punctured kernel squirts milky sap (clear = immature; dough = overmature).',
      'Grain maize: Ear tips are full, blunt, and firm to the touch.',
    ],
    harvestStages: [
      { stage: 'Milk Stage', desc: 'Kernels squirt sweet milky liquid', bestFor: 'Fresh sweet corn cobs & roasting', status: 'optimal' },
      { stage: 'Dough Stage', desc: 'Pasty interior, sugar converting to starch', bestFor: 'Processing / canned kernels', status: 'ripe' },
      { stage: 'Black Layer Stage', desc: 'Hard dented kernels, black abscission line', bestFor: 'Grain maize harvest, livestock feed & cornmeal', status: 'optimal' },
    ],
    postHarvestTips: 'For sweet corn, hydro-cool immediately to remove field heat and refrigerate. For grain maize, shell and sun-dry to 13% moisture.',
    storageConditions: 'Grain maize at <13.5% moisture in clean aerated silos with grain protectants.',
  },

  {
    id: 'onion',
    name: 'Onion',
    category: 'Vegetable',
    names: {
      en: 'Onion',
      te: 'ఉల్లిపాయ',
      ta: 'வெங்காயம்',
      kn: 'ಈರುಳ್ಳಿ',
      ml: 'സവാള / ഉള്ളി',
      hi: 'प्याज',
    },
    duration: '110–150 days from transplanting',
    idealTimeOfDay: 'Morning',
    idealWeatherWindow: 'Dry sunny weather with zero rainfall for 2 weeks prior to harvest',
    weatherWarning: 'Rain before or during harvest leads to neck rot and fungal smudge; bulbs must not be pulled when soil is mud-logged.',
    visualSigns: [
      'Neck fall: 50% to 75% of the tops naturally bend over and fall flat to the ground.',
      'Outer bulb scales develop characteristic papery dry skin and uniform varietal color.',
      'Foliage starts yellowing from tips downward.',
    ],
    tactileSigns: [
      'Neck of the bulb feels soft and pliable, not thick and rigid.',
      'Roots begin to dry up and release easily from the soil.',
    ],
    harvestStages: [
      { stage: '25% Neck Fall', desc: 'First few plants lodging', bestFor: 'Too early; thick necks lead to storage rotting', status: 'immature' },
      { stage: '50–75% Neck Fall', desc: 'Most foliage toppled, necks thin', bestFor: 'Ideal harvest window for long-term storage', status: 'optimal' },
      { stage: '100% Dead Dry', desc: 'Foliage crisp brown on ground', bestFor: 'Sunburn damage & secondary rooting if damp', status: 'overripe' },
    ],
    postHarvestTips: 'Windrow in the field for 3–5 days with foliage covering bulbs to prevent sun-scald. Clip tops leaving 2.5cm neck to prevent decay entry.',
    storageConditions: 'Store in well-ventilated slatted wooden racks at 25–30°C with 65–70% RH (avoid high humidity which triggers sprouting).',
  },

  {
    id: 'sugarcane',
    name: 'Sugarcane',
    category: 'Cash Crop',
    names: {
      en: 'Sugarcane',
      te: 'చెరకు',
      ta: 'கரும்பு',
      kn: 'ಕಬ್ಬು',
      ml: 'കരിമ്പ്',
      hi: 'गन्ना',
    },
    duration: '10–14 months depending on plant or ratoon crop',
    idealTimeOfDay: 'Cool morning',
    idealWeatherWindow: 'Dry, bright cool winter weather (promotes sucrose accumulation)',
    weatherWarning: 'Irrigating or receiving heavy rain within 15 days of cutting drops brix sugar content by 3–4%.',
    visualSigns: [
      'Leaves turn yellow, dry out and drop off leaving clean mature stalk nodes.',
      'Cane stalk turns hard, brittle, and rings with metallic chime when struck.',
      'Eye buds at nodes are plump and firm.',
    ],
    tactileSigns: [
      'Hand refractometer brix reading: 18° to 21° Brix across top, middle, and bottom cane segments.',
      'Brix ratio of top to bottom exceeds 0.9, indicating uniform stalk maturity.',
    ],
    harvestStages: [
      { stage: 'Peak Sucrose', desc: 'Brix reading >19%, bottom & top sugar balanced', bestFor: 'Milling & jaggery (gur) extraction', status: 'optimal' },
      { stage: 'Overmature / Flowering', desc: 'Tassel / arrow flower emerges', bestFor: 'Pithy interior; sugar starts inverting to starch', status: 'overripe' },
    ],
    postHarvestTips: 'Cut close to ground level (highest sucrose concentration is in bottom 30cm); crush within 24–48 hours to prevent sugar inversion.',
    storageConditions: 'Send to sugar mill within 24 hours of cutting.',
  },
];
