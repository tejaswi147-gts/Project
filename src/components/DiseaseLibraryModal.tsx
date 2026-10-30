import React, { useState } from 'react';
import { X, Search, BookOpen, Bug, ShieldCheck, Thermometer, Droplets } from 'lucide-react';

interface DiseaseLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCrop: (crop: string) => void;
}

const LIBRARY_ENTRIES = [
  {
    crop: 'Tomato',
    diseases: [
      { name: 'Late Blight (Phytophthora infestans)', temp: '15–22°C', humidity: '>80%', threat: 'Fungal', note: 'Rapidly destroys green foliage and green/ripe fruit.' },
      { name: 'Early Blight (Alternaria solani)', temp: '24–29°C', humidity: '>70%', threat: 'Fungal', note: 'Concentric ring bullseye spots on lower leaves.' },
      { name: 'Bacterial Speck (Pseudomonas syringae)', temp: '18–24°C', humidity: '>85%', threat: 'Bacterial', note: 'Tiny black spots with distinct yellow chlorotic halos.' },
      { name: 'Spider Mites (Tetranychus urticae)', temp: '>30°C', humidity: '<40%', threat: 'Pest', note: 'Fine webbing under dry leaves causing leaf stippling.' },
    ],
  },
  {
    crop: 'Rice',
    diseases: [
      { name: 'Rice Blast (Magnaporthe oryzae)', temp: '20–28°C', humidity: '>85%', threat: 'Fungal', note: 'Spindle-shaped diamond lesions that snap neck nodes.' },
      { name: 'Sheath Blight (Rhizoctonia solani)', temp: '28–32°C', humidity: '>80%', threat: 'Fungal', note: 'Snake-skin blotches starting from the water surface.' },
      { name: 'Bacterial Leaf Blight (Xanthomonas oryzae)', temp: '25–34°C', humidity: '>70%', threat: 'Bacterial', note: 'Marginal wave-like leaf chlorosis with bacterial exudates.' },
    ],
  },
  {
    crop: 'Cotton',
    diseases: [
      { name: 'Bacterial Blight / Angular Leaf Spot', temp: '25–32°C', humidity: '>75%', threat: 'Bacterial', note: 'Angular leaf lesions, black arm stems, and internal boll rot.' },
      { name: 'Cotton Leaf Curl Virus (CLCuV)', temp: '>32°C', humidity: '<45%', threat: 'Viral', note: 'Transmitted by whiteflies; upward leaf curling and vein thickening.' },
      { name: 'Alternaria Leaf Spot', temp: '20–26°C', humidity: '>65%', threat: 'Fungal', note: 'Purple-edged concentric circular necrotic spots.' },
    ],
  },
  {
    crop: 'Wheat',
    diseases: [
      { name: 'Yellow (Stripe) Rust (Puccinia striiformis)', temp: '10–18°C', humidity: '>80%', threat: 'Fungal', note: 'Parallel yellow spore stripes across long flag leaves.' },
      { name: 'Fusarium Head Blight / Scab', temp: '22–28°C', humidity: '>85%', threat: 'Fungal', note: 'Bleached spikelets during flowering with pinkish mycelium.' },
      { name: 'Brown / Leaf Rust (Puccinia triticina)', temp: '18–25°C', humidity: '>70%', threat: 'Fungal', note: 'Scattered circular brown pustules on upper blade surfaces.' },
    ],
  },
  {
    crop: 'Potato',
    diseases: [
      { name: 'Late Blight (Phytophthora infestans)', temp: '16–22°C', humidity: '>80%', threat: 'Fungal', note: 'Water-soaked blotches causing total field collapse in 7 days.' },
      { name: 'Blackleg & Soft Rot (Pectobacterium)', temp: '20–28°C', humidity: '>80%', threat: 'Bacterial', note: 'Inky black basal stem rot with foul odor.' },
      { name: 'Early Blight (Alternaria solani)', temp: '24–30°C', humidity: '>65%', threat: 'Fungal', note: 'Targets stressed older foliage during tuber bulk filling.' },
    ],
  },
  {
    crop: 'Corn',
    diseases: [
      { name: 'Gray Leaf Spot (Cercospora zeae-maydis)', temp: '24–30°C', humidity: '>85%', threat: 'Fungal', note: 'Parallel rectangular lesions bounded by leaf veins.' },
      { name: 'Southern Corn Rust (Puccinia polysora)', temp: '26–32°C', humidity: '>75%', threat: 'Fungal', note: 'Small circular golden-brown pustules across leaves.' },
      { name: 'Northern Corn Leaf Blight', temp: '18–27°C', humidity: '>70%', threat: 'Fungal', note: 'Large cigar-shaped tan lesions.' },
    ],
  },
];

export const DiseaseLibraryModal: React.FC<DiseaseLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectCrop,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = LIBRARY_ENTRIES.filter(
    (entry) =>
      entry.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.diseases.some(
        (d) =>
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.threat.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full border border-neutral-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Crop Pathology &amp; Weather Sensitivity Database
              </h2>
              <p className="text-xs text-neutral-500">
                Cross-reference critical weather thresholds for common agronomic diseases.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-200">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter by crop name or pathogen (e.g. Tomato, Rice, Blight, Rust)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-neutral-500">
              No matching crops or diseases found in the library.
            </div>
          ) : (
            filtered.map((item) => (
              <div key={item.crop} className="border border-neutral-200 rounded-lg p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-neutral-900">{item.crop}</h3>
                  <button
                    onClick={() => {
                      onSelectCrop(item.crop);
                      onClose();
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                  >
                    Analyze {item.crop} &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                  {item.diseases.map((d) => (
                    <div key={d.name} className="p-2.5 rounded bg-neutral-50 border border-neutral-200/80 text-xs space-y-1">
                      <div className="font-semibold text-neutral-800">{d.name}</div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Thermometer className="w-3 h-3 text-emerald-700" />
                          {d.temp}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-emerald-700" />
                          {d.humidity}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600">{d.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-neutral-200 bg-neutral-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-100"
          >
            Close Database
          </button>
        </div>
      </div>
    </div>
  );
};
