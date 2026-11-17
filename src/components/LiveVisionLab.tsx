import React, { useRef, useEffect, useState } from 'react';
import { analyzeCanvasPixels, drawGradCamOverlay, VisionMetrics } from '../engines/computerVisionEngine';
import { Upload, Eye, Layers, Sliders, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

const PRESET_IMAGES = [
  {
    id: 'pneumonia',
    label: 'Chest X-Ray: Lobar Consolidation',
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=700&q=80',
    defaultX: 62,
    defaultY: 68
  },
  {
    id: 'cardiomegaly',
    label: 'Chest Radiograph: Cardiomegaly / Congestion',
    url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=700&q=80',
    defaultX: 52,
    defaultY: 60
  },
  {
    id: 'melanoma',
    label: 'Dermoscopy: Asymmetric Pigmented Lesion',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80',
    defaultX: 48,
    defaultY: 52
  }
];

export const LiveVisionLab: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('pneumonia');
  const [imageUrl, setImageUrl] = useState<string>(PRESET_IMAGES[0].url);
  const [focusX, setFocusX] = useState<number>(PRESET_IMAGES[0].defaultX);
  const [focusY, setFocusY] = useState<number>(PRESET_IMAGES[0].defaultY);
  const [radiusScale, setRadiusScale] = useState<number>(1.0);
  const [showGradCam, setShowGradCam] = useState<boolean>(true);
  const [colormap, setColormap] = useState<'thermal' | 'turbo'>('thermal');
  const [metrics, setMetrics] = useState<VisionMetrics | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  // Load and render image on canvas
  const processImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      canvas.width = 540;
      canvas.height = 540;

      // Draw base image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Compute mathematical pixel metrics
      const computedMetrics = analyzeCanvasPixels(ctx, canvas.width, canvas.height, focusX, focusY);
      setMetrics(computedMetrics);

      // Draw Grad-CAM overlay if enabled
      if (showGradCam) {
        drawGradCamOverlay(canvas, focusX, focusY, radiusScale, colormap);
      }
    };
    imgElementRef.current = img;
  };

  useEffect(() => {
    processImage();
  }, [imageUrl, focusX, focusY, radiusScale, showGradCam, colormap]);

  // Click on canvas to focus Grad-CAM attention
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = Math.round((x / rect.width) * 100);
    const yPct = Math.round((y / rect.height) * 100);

    setFocusX(xPct);
    setFocusY(yPct);
  };

  // Custom File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setFocusX(50);
      setFocusY(50);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Editorial Header */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Computer Vision & Explainable AI (XAI)
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
              Interactive Pixel-Level Vision & Dynamic Grad-CAM Canvas
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, maxWidth: '750px' }}>
              Click anywhere directly on the medical scan to shift the activation center, upload your own radiograph, or adjust the kernel spread. The engine recomputes Shannon tissue entropy, Sobel gradients, and focal consolidation density live.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label
              htmlFor="upload-scan"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#0284c7', color: '#ffffff', borderRadius: '6px', fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <Upload size={15} /> Upload Custom Scan
            </label>
            <input
              id="upload-scan"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Main Vision Workspace Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left: Interactive Canvas */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Preset Selector */}
          <div style={{ width: '100%', display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto' }}>
            {PRESET_IMAGES.map(preset => (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset.id);
                  setImageUrl(preset.url);
                  setFocusX(preset.defaultX);
                  setFocusY(preset.defaultY);
                }}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: imageUrl === preset.url ? '1px solid #0284c7' : '1px solid #e2e8f0',
                  background: imageUrl === preset.url ? '#f0f9ff' : '#f8fafc',
                  color: imageUrl === preset.url ? '#0369a1' : '#475569',
                  whiteSpace: 'nowrap'
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Canvas Container */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '480px', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '2px solid #0f172a', background: '#000000', cursor: 'crosshair', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              style={{ width: '100%', height: '100%', display: 'block' }}
            />
            <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: 'rgba(15,23,42,0.85)', color: '#f8fafc', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', pointerEvents: 'none' }}>
              Focus: X {focusX}%, Y {focusY}% (Click to reposition)
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', textAlign: 'center' }}>
            💡 Tip: Click on any anatomical zone above to redirect model attention and re-analyze local tissue density.
          </p>
        </div>

        {/* Right: Controls & Real Mathematical Pixel Analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Controls Panel */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sliders size={16} color="#0284c7" />
              Grad-CAM Parameters & Saliency Colormap
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155' }}>Overlay Saliency Heatmap:</span>
                <button
                  onClick={() => setShowGradCam(!showGradCam)}
                  style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', border: '1px solid #cbd5e1', background: showGradCam ? '#0284c7' : '#f8fafc', color: showGradCam ? '#ffffff' : '#64748b' }}
                >
                  {showGradCam ? 'ON (Active)' : 'OFF (Raw Scan)'}
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', marginBottom: '0.2rem' }}>
                  <span>Activation Radius Scale:</span>
                  <strong>{radiusScale.toFixed(2)}x</strong>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={radiusScale}
                  onChange={e => setRadiusScale(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155' }}>Colormap:</span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => setColormap('thermal')}
                    style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', border: colormap === 'thermal' ? '1px solid #0284c7' : '1px solid #e2e8f0', background: colormap === 'thermal' ? '#f0f9ff' : '#ffffff', color: colormap === 'thermal' ? '#0369a1' : '#64748b' }}
                  >
                    Thermal (Jet)
                  </button>
                  <button
                    onClick={() => setColormap('turbo')}
                    style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', border: colormap === 'turbo' ? '1px solid #0284c7' : '1px solid #e2e8f0', background: colormap === 'turbo' ? '#f0f9ff' : '#ffffff', color: colormap === 'turbo' ? '#0369a1' : '#64748b' }}
                  >
                    Turbo (Bio)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Pixel Analysis Metrics */}
          {metrics && (
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                Mathematical Pixel Analysis (Real Convolutional & Statistical Metrics)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontWeight: 600 }}>SHANNON ENTROPY</span>
                  <strong style={{ fontSize: '1.25rem', color: '#0f172a' }}>{metrics.shannonEntropy}</strong>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>bits/pixel (tissue density)</span>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontWeight: 600 }}>SOBEL EDGE GRADIENT</span>
                  <strong style={{ fontSize: '1.25rem', color: '#0f172a' }}>{metrics.sobelEdgeDensity}</strong>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>high-frequency density</span>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontWeight: 600 }}>FOCAL CONSOLIDATION</span>
                  <strong style={{ fontSize: '1.25rem', color: metrics.focalConsolidationIndex > 1.2 ? '#dc2626' : '#059669' }}>
                    {metrics.focalConsolidationIndex}x
                  </strong>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>relative opacity ratio</span>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontWeight: 600 }}>MEAN INTENSITY</span>
                  <strong style={{ fontSize: '1.25rem', color: '#0f172a' }}>{metrics.meanIntensity}</strong>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>8-bit luminance</span>
                </div>

              </div>

              {/* Dynamic Anomalies Detected from Pixels */}
              <div>
                <h4 style={{ fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Dynamic Anomaly Detections Computed from Image Array:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {metrics.detectedAnomalies.map((anomaly, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.75rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                      <span style={{ color: '#0f172a', fontWeight: 600 }}>{anomaly.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '3px', background: anomaly.severity === 'Severe' ? '#fef2f2' : '#f0fdf4', color: anomaly.severity === 'Severe' ? '#dc2626' : '#15803d', fontWeight: 600 }}>
                          {anomaly.severity}
                        </span>
                        <strong style={{ color: '#0284c7' }}>{(anomaly.score * 100).toFixed(0)}%</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

