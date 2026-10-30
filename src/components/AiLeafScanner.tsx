import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  RefreshCw, 
  SwitchCamera, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  Leaf, 
  Scan, 
  Eye, 
  EyeOff, 
  Info,
  Bug,
  Droplet,
  ShieldCheck, 
  Check, 
  Copy, 
  ChevronRight,
  CalendarCheck,
  Clock,
  Layers,
  ThermometerSun,
  Sun,
  ArrowUpRight,
  Package
} from 'lucide-react';
import { SAMPLE_LEAVES, SampleLeaf } from '../data/sampleLeaves';
import { diagnoseCropLeafImage } from '../services/visionService';
import { VisionDiagnosis, WeatherData } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface AiLeafScannerProps {
  onCorrelateWeather?: (crop: string) => void;
  onNavigateToHarvest?: (cropName?: string) => void;
  currentWeather: WeatherData | null;
}

export const AiLeafScanner: React.FC<AiLeafScannerProps> = ({
  onCorrelateWeather,
  onNavigateToHarvest,
  currentWeather,
}) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'upload' | 'camera' | 'samples'>('upload');
  const [selectedCropHint, setSelectedCropHint] = useState<string>('Auto-detect');
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_LEAVES[0].svgDataUri);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [diagnosis, setDiagnosis] = useState<VisionDiagnosis | null>(null);
  const [showBoundingBox, setShowBoundingBox] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState<boolean>(false);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeAnalysisView, setActiveAnalysisView] = useState<'harvest' | 'disease'>('harvest');

  // Camera stream refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop camera when switching mode or unmounting
  useEffect(() => {
    if (mode !== 'camera') {
      stopCamera();
    } else {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [mode, isFrontCamera]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser or environment.');
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera error:', err);
      let errorMsg = 'Unable to access camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera permission was denied. Please allow camera permissions in your browser or use Photo Upload.';
      } else if (err.name === 'NotFoundError') {
        errorMsg = 'No camera found on this device. Please use Photo Upload or Sample Leaves.';
      }
      setCameraError(errorMsg);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert('Camera feed is still initializing. Please wait a moment.');
      return;
    }

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setSelectedImage(dataUrl);
      stopCamera();
      setMode('upload');
      runDiagnosis(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setSelectedImage(dataUrl);
      runDiagnosis(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: SampleLeaf) => {
    setSelectedImage(sample.svgDataUri);
    setSelectedCropHint(sample.crop);
    runDiagnosis(sample.svgDataUri, sample.crop);
  };

  const runDiagnosis = async (imageSrc: string, cropHintOverride?: string) => {
    setIsScanning(true);
    setDiagnosis(null);
    try {
      const result = await diagnoseCropLeafImage(imageSrc, cropHintOverride || selectedCropHint);
      setDiagnosis(result);
      // Auto-focus on harvest tab if specimen is ripe/harvest-ready or healthy produce
      if (result.harvestReadiness?.isReady || result.isHealthy) {
        setActiveAnalysisView('harvest');
      } else {
        setActiveAnalysisView('disease');
      }
    } catch (err) {
      console.error('Vision diagnosis failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleCopyReport = () => {
    if (!diagnosis) return;
    const harvestText = diagnosis.harvestReadiness ? `
--- HARVEST READINESS & TIMING ---
Readiness Verdict: ${diagnosis.harvestReadiness.isReady ? 'Ready to Harvest Now' : 'Developing / Wait to Pick'} (${diagnosis.harvestReadiness.readinessScore}% Mature)
Maturity Stage: ${diagnosis.harvestReadiness.maturityStage}
Optimal Harvest Window: ${diagnosis.harvestReadiness.estimatedHarvestWindow}
Best Time of Day: ${diagnosis.harvestReadiness.bestTimeOfDay}
Visual Cues Observed: ${diagnosis.harvestReadiness.visualSignsObserved.join(', ')}
Harvest Technique: ${diagnosis.harvestReadiness.harvestTechnique}
Post-Harvest Care: ${diagnosis.harvestReadiness.postHarvestCare}
` : '';

    const text = `AgriMind AI - Crop Vision & Harvest Diagnostics
Date: ${diagnosis.analyzedAt}
Specimen Crop: ${diagnosis.cropName}
Condition: ${diagnosis.diseaseName} (${diagnosis.scientificName})
Pathogen Threat: ${diagnosis.threatType}
Confidence: ${diagnosis.confidence}%
Severity: ${diagnosis.severity}
Symptoms: ${diagnosis.symptoms}
Causes: ${diagnosis.causes}
Organic Remedy: ${diagnosis.organicTreatment}
Chemical Treatment: ${diagnosis.chemicalTreatment}
${harvestText}
Preventative Measures:
${diagnosis.preventativeSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  // Perform initial demo diagnosis on load
  useEffect(() => {
    if (selectedImage && !diagnosis && !isScanning) {
      runDiagnosis(selectedImage, 'Tomato');
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Title & Modes Header */}
      <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                <Scan className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                {t.visionScannerTitle}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Capture or upload any crop, fruit, vegetable, or leaf to detect diseases AND determine exact harvest timing from the image.
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg self-start md:self-auto">
            <button
              onClick={() => setMode('upload')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                mode === 'upload' ? 'bg-white text-emerald-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t.uploadPhotoTab}</span>
            </button>

            <button
              onClick={() => setMode('camera')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                mode === 'camera' ? 'bg-white text-emerald-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{t.liveCameraTab}</span>
            </button>

            <button
              onClick={() => setMode('samples')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                mode === 'samples' ? 'bg-white text-emerald-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.sampleLeavesTab} &amp; Harvest Samples</span>
            </button>
          </div>
        </div>

        {/* Crop Hint Selector */}
        <div className="pt-4 flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold text-neutral-700">{t.cropFocusLabel}</span>
          {['Auto-detect', 'Tomato', 'Rice', 'Mango', 'Potato', 'Corn', 'Cotton', 'Wheat', 'Pepper'].map((crop) => (
            <button
              key={crop}
              onClick={() => {
                setSelectedCropHint(crop);
                if (selectedImage) runDiagnosis(selectedImage, crop);
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                selectedCropHint === crop
                  ? 'bg-emerald-800 text-white font-medium'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Work Area: Upload, Camera, or Samples */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Input & Live Viewfinder (Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 sm:p-5">
            {/* Mode 1: Photo Upload */}
            {mode === 'upload' && (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-emerald-600 bg-emerald-50/50'
                      : 'border-neutral-300 hover:border-emerald-600 bg-neutral-50/60 hover:bg-emerald-50/20'
                  }`}
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-neutral-900">
                    Click to select or drag fruit, vegetable, or leaf photo here
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Upload produce photo to get exact harvest readiness &amp; disease diagnosis.
                  </p>
                  <button
                    type="button"
                    className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-md shadow-xs pointer-events-none"
                  >
                    Select Photo File
                  </button>
                </div>
              </div>
            )}

            {/* Mode 2: Live Camera Viewfinder */}
            {mode === 'camera' && (
              <div className="space-y-4">
                {cameraError ? (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center space-y-3">
                    <AlertCircle className="w-8 h-8 mx-auto text-rose-600" />
                    <div className="text-sm font-bold text-rose-900">Camera Notice</div>
                    <p className="text-xs text-rose-700 max-w-sm mx-auto">{cameraError}</p>
                    <button
                      onClick={() => setMode('upload')}
                      className="px-4 py-2 bg-rose-700 text-white text-xs font-semibold rounded-md hover:bg-rose-800 cursor-pointer"
                    >
                      Switch to File Upload
                    </button>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className="w-full h-full object-cover"
                    />

                    {/* Reticle targeting viewfinder */}
                    <div className="absolute inset-8 border border-white/50 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                      <div className="flex justify-between">
                        <span className="w-4 h-4 border-t-2 border-l-2 border-emerald-400"></span>
                        <span className="w-4 h-4 border-t-2 border-r-2 border-emerald-400"></span>
                      </div>
                      <div className="text-center text-[11px] text-white/90 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs mx-auto">
                        Center crop, fruit, or leaf in frame
                      </div>
                      <div className="flex justify-between">
                        <span className="w-4 h-4 border-b-2 border-l-2 border-emerald-400"></span>
                        <span className="w-4 h-4 border-b-2 border-r-2 border-emerald-400"></span>
                      </div>
                    </div>

                    {/* Camera Controls Overlay */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
                      <button
                        onClick={() => setIsFrontCamera(!isFrontCamera)}
                        className="p-2.5 rounded-full bg-neutral-900/80 text-white hover:bg-black transition-colors cursor-pointer"
                        title="Flip Camera"
                      >
                        <SwitchCamera className="w-4 h-4" />
                      </button>

                      <button
                        onClick={handleCaptureSnapshot}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-2 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Capture Photo</span>
                      </button>

                      <div className="w-9"></div>
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            {/* Mode 3: Curated Sample Produce & Leaves Gallery */}
            {mode === 'samples' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                  Select a Benchmark Specimen (Harvest &amp; Disease):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
                  {SAMPLE_LEAVES.map((sample) => (
                    <div
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        selectedImage === sample.svgDataUri
                          ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <img
                        src={sample.svgDataUri}
                        alt={sample.name}
                        className="w-full h-24 object-contain rounded bg-neutral-950 mb-2 p-1"
                      />
                      <div className="font-bold text-xs text-neutral-900 truncate">{sample.name}</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5 truncate">{sample.severity}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Current Loaded Image with Detection Bounding Box */}
          {selectedImage && (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-200">
                <span className="font-semibold text-neutral-800">Scanned Crop Specimen</span>
                {diagnosis && (
                  <button
                    onClick={() => setShowBoundingBox(!showBoundingBox)}
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-800 hover:underline cursor-pointer"
                  >
                    {showBoundingBox ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showBoundingBox ? 'Hide AI Bounding Box' : 'Show AI Bounding Box'}</span>
                  </button>
                )}
              </div>

              {/* Image Frame with Scanning Laser / Bounding Box Overlay */}
              <div className="relative rounded-lg overflow-hidden bg-neutral-950 aspect-4/3 flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Scanned Crop Produce"
                  className="w-full h-full object-contain"
                />

                {/* Laser Scanning Animation */}
                {isScanning && (
                  <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-2xs flex flex-col items-center justify-center">
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse shadow-lg shadow-emerald-500/50"></div>
                    <div className="bg-neutral-900/90 text-white text-xs px-4 py-2 rounded-full border border-emerald-500/40 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                      <span>Inspecting ripeness, maturity cues &amp; foliar health...</span>
                    </div>
                  </div>
                )}

                {/* Detected Lesion / Fruit Bounding Box Overlay */}
                {!isScanning && diagnosis && diagnosis.box && showBoundingBox && (
                  <div
                    style={{
                      position: 'absolute',
                      top: `${diagnosis.box.top}%`,
                      left: `${diagnosis.box.left}%`,
                      width: `${diagnosis.box.width}%`,
                      height: `${diagnosis.box.height}%`,
                    }}
                    className={`border-2 rounded border-dashed pointer-events-none animate-pulse ${
                      diagnosis.harvestReadiness?.isReady 
                        ? 'border-emerald-400 bg-emerald-400/10' 
                        : diagnosis.isHealthy 
                        ? 'border-emerald-400 bg-emerald-400/10' 
                        : 'border-rose-400 bg-rose-400/10'
                    }`}
                  >
                    <span className="absolute -top-6 left-0 bg-neutral-900/90 text-white text-[10px] font-mono px-2 py-0.5 rounded whitespace-nowrap shadow-sm border border-neutral-700">
                      {diagnosis.box.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <span>Specimen: {diagnosis ? diagnosis.cropName : selectedCropHint}</span>
                <button
                  onClick={() => runDiagnosis(selectedImage)}
                  disabled={isScanning}
                  className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-medium cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>Re-scan Specimen</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Analysis & Harvest Timing Dashboard (Span 7) */}
        <div className="lg:col-span-7">
          {isScanning && (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 text-center space-y-4 animate-pulse">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <div className="text-base font-bold text-neutral-800">
                  {t.runningVisionDiagnostics}
                </div>
                <p className="text-xs text-neutral-500">
                  Inspecting skin coloration, shoulder expansion, cuticle gloss, and cellular pathology...
                </p>
              </div>
              <div className="h-2 w-48 bg-neutral-200 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full w-2/3 animate-pulse"></div>
              </div>
            </div>
          )}

          {!isScanning && diagnosis && (
            <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Dual View Segmented Switcher (Harvest Timing vs Disease Analysis) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
                <div>
                  <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">
                    {diagnosis.cropName}: {activeAnalysisView === 'harvest' ? t.imageHarvestTimeTitle : diagnosis.diseaseName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                    <span>{diagnosis.scientificName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{diagnosis.analyzedAt}</span>
                  </div>
                </div>

                {/* View Switcher Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => setActiveAnalysisView('harvest')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeAnalysisView === 'harvest'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-neutral-700 hover:text-neutral-950'
                    }`}
                  >
                    <CalendarCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{t.viewHarvestTiming}</span>
                  </button>

                  <button
                    onClick={() => setActiveAnalysisView('disease')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeAnalysisView === 'disease'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-neutral-700 hover:text-neutral-950'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{t.viewDiseaseAnalysis}</span>
                  </button>

                  <button
                    onClick={handleCopyReport}
                    className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/70 rounded transition-colors cursor-pointer"
                    title={copiedReport ? t.reportCopiedBtn : t.copyReportBtn}
                  >
                    {copiedReport ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* ======================================================== */}
              {/* VIEW 1: HARVEST TIMING & RIPENESS INSPECTION (PRIMARY)   */}
              {/* ======================================================== */}
              {activeAnalysisView === 'harvest' && diagnosis.harvestReadiness && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Hero Verdict Banner */}
                  <div className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    diagnosis.harvestReadiness.isReady
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        diagnosis.harvestReadiness.isReady ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                      }`}>
                        {diagnosis.harvestReadiness.isReady ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Clock className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            diagnosis.harvestReadiness.isReady ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                          }`}>
                            {diagnosis.harvestReadiness.isReady ? t.readyToHarvestBadge : t.notReadyBadge}
                          </span>
                          <span className="text-xs text-neutral-500 font-mono">
                            {t.readinessScoreLabel}: <strong className="text-neutral-900">{diagnosis.harvestReadiness.readinessScore}%</strong>
                          </span>
                        </div>
                        <div className="text-base sm:text-lg font-black mt-1 leading-snug">
                          {diagnosis.harvestReadiness.estimatedHarvestWindow}
                        </div>
                        <div className="text-xs text-neutral-600 mt-0.5">
                          {diagnosis.harvestReadiness.maturityStage}
                        </div>
                      </div>
                    </div>

                    {onNavigateToHarvest && (
                      <button
                        onClick={() => onNavigateToHarvest(diagnosis.cropName)}
                        className="px-3.5 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-xs cursor-pointer"
                      >
                        <span>{t.openInHarvestAdvisorBtn}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                    )}
                  </div>

                  {/* Readiness Progress Bar */}
                  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                      <span>Harvest Readiness / Ripeness Gauge</span>
                      <span className="font-mono text-emerald-800 text-sm font-bold">
                        {diagnosis.harvestReadiness.readinessScore}% / 100%
                      </span>
                    </div>
                    <div className="h-3 w-full bg-neutral-200 rounded-full overflow-hidden p-0.5">
                      <div
                        style={{ width: `${diagnosis.harvestReadiness.readinessScore}%` }}
                        className={`h-full rounded-full transition-all duration-700 ${
                          diagnosis.harvestReadiness.readinessScore >= 85
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-700'
                            : diagnosis.harvestReadiness.readinessScore >= 60
                            ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                            : 'bg-gradient-to-r from-blue-400 to-blue-600'
                        }`}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
                      <span>Immature Vegetative</span>
                      <span>Breaker / Color Turning</span>
                      <span>Peak Market Harvest</span>
                    </div>
                  </div>

                  {/* 2 Primary Harvest Guidance Cards: Time of Day & Technique */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-wide">
                        <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{t.recommendedHarvestTimeOfDay}</span>
                      </div>
                      <p className="text-xs text-neutral-800 font-medium leading-relaxed">
                        {diagnosis.harvestReadiness.bestTimeOfDay}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-wide">
                        <Package className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{t.harvestTechniqueLabel}</span>
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed">
                        {diagnosis.harvestReadiness.harvestTechnique}
                      </p>
                    </div>
                  </div>

                  {/* Visual Maturity Signs Observed in this Photo */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-emerald-700" />
                      <span>{t.visualMaturityCuesDetected}</span>
                    </div>
                    <div className="space-y-2">
                      {diagnosis.harvestReadiness.visualSignsObserved.map((sign, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border border-neutral-200 bg-white text-xs flex items-start gap-2.5 text-neutral-800 shadow-2xs"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span className="leading-relaxed font-medium">{sign}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Post-Harvest Handling & Storage */}
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      <Layers className="w-4 h-4 text-emerald-700" />
                      <span>{t.postHarvestCare}</span>
                    </div>
                    <p className="text-xs text-emerald-900 leading-relaxed">
                      {diagnosis.harvestReadiness.postHarvestCare}
                    </p>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW 2: PATHOLOGY & DISEASE DETAILS                      */}
              {/* ======================================================== */}
              {activeAnalysisView === 'disease' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Top Status & Confidence */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                      <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-1">
                        {t.visionConfidence}
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
                          {diagnosis.confidence.toFixed(1)}
                        </span>
                        <span className="text-lg font-bold text-neutral-500">%</span>
                      </div>
                      <div className="mt-2 text-[11px] text-neutral-600">
                        Engine: <span className="font-mono">{diagnosis.engineUsed || 'Gemini Vision'}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                      <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-1">
                        {t.foliarSeverityAssessment}
                      </div>
                      <div className="text-base font-bold text-neutral-900">
                        {diagnosis.severity}
                      </div>
                      <div className="mt-2 h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            diagnosis.isHealthy ? 'bg-emerald-500 w-1' : 'bg-rose-600 w-2/3'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Symptoms Identified on this Leaf */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      {t.observedSymptomsTitle}
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                      {diagnosis.symptoms}
                    </p>
                  </div>

                  {/* Environmental Causes */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      {t.environmentalCausesTitle}
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      {diagnosis.causes}
                    </p>
                  </div>

                  {/* Dual Treatment Protocol: Organic vs Chemical */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>{t.organicRemedyTitle}</span>
                      </div>
                      <p className="text-xs text-emerald-900 leading-relaxed">
                        {diagnosis.organicTreatment}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 uppercase tracking-wider">
                        <Bug className="w-4 h-4 text-amber-700" />
                        <span>{t.chemicalRemedyTitle}</span>
                      </div>
                      <p className="text-xs text-amber-900 leading-relaxed">
                        {diagnosis.chemicalTreatment}
                      </p>
                    </div>
                  </div>

                  {/* Actionable Preventative Checklist */}
                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      {t.preventativeProtocolTitle}
                    </div>
                    <div className="space-y-2">
                      {diagnosis.preventativeSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border border-neutral-200 bg-white text-xs flex items-start gap-2.5 text-neutral-800"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Weather Correlation Banner */}
              {onCorrelateWeather && currentWeather && (
                <div className="p-4 rounded-lg bg-neutral-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      {t.correlateWeatherTitle}
                    </div>
                    <p className="text-xs text-neutral-300">
                      {t.correlateWeatherDesc} ({currentWeather.temperature}°C, {currentWeather.humidity}% RH).
                    </p>
                  </div>
                  <button
                    onClick={() => onCorrelateWeather(diagnosis.cropName)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{t.runWeatherRiskBtn}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
