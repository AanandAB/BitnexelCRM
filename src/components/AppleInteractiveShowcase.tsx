import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Cpu, 
  Globe, 
  Monitor, 
  Smartphone, 
  Laptop, 
  Volume2, 
  VolumeX, 
  RotateCw, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Activity, 
  ArrowRight,
  CheckCircle2,
  Maximize2,
  Sliders,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { RouteType } from '../types';

export type ShowcaseMode = 'display' | 'silicon' | 'network';
export type DeviceViewport = 'desktop' | 'laptop' | 'mobile';

interface AppleInteractiveShowcaseProps {
  onNavigate: (route: RouteType) => void;
  onSelectDiscipline?: (discipline: 'website' | 'software' | 'webapp') => void;
}

// Crisp Apple-like subtle chime sound engine
class AppleSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = false;

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playChime(freq = 640) {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.08);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // AudioContext fallback
    }
  }
}

export const AppleInteractiveShowcase: React.FC<AppleInteractiveShowcaseProps> = ({
  onNavigate,
  onSelectDiscipline
}) => {
  const [activeMode, setActiveMode] = useState<ShowcaseMode>('display');
  const [deviceViewport, setDeviceViewport] = useState<DeviceViewport>('desktop');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  
  // Display Interactive Demo state
  const [demoDarkMode, setDemoDarkMode] = useState<boolean>(true);
  const [demoMetricTab, setDemoMetricTab] = useState<'latency' | 'throughput' | 'cache'>('latency');
  const [isSimulatingLoad, setIsSimulatingLoad] = useState<boolean>(false);
  const [simulatedPings, setSimulatedPings] = useState<number[]>([18, 14, 19, 15, 12, 16, 13, 11, 14]);

  // Silicon Engine Interactive state
  const [chipClock, setChipClock] = useState<number>(4.8); // GHz
  const [chipLayer, setChipLayer] = useState<'package' | 'silicon' | 'mesh'>('package');
  const [chipLoadPercent, setChipLoadPercent] = useState<number>(34);

  // Network Mesh state
  const [activeRegion, setActiveRegion] = useState<string>('us-east');
  const [pingResult, setPingResult] = useState<{ city: string; ms: number; status: string }>({
    city: 'New York (Edge PoP #01)',
    ms: 12,
    status: 'Optimal Direct Routing'
  });

  const soundRef = useRef<AppleSoundEngine | null>(null);

  useEffect(() => {
    soundRef.current = new AppleSoundEngine();
  }, []);

  const toggleSound = () => {
    if (!soundRef.current) return;
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundRef.current.enabled = next;
    if (next) {
      soundRef.current.init();
      soundRef.current.playChime(780);
    }
  };

  const triggerChime = (freq = 640) => {
    if (soundRef.current && soundEnabled) {
      soundRef.current.playChime(freq);
    }
  };

  // Run benchmark test on interactive display
  const runLiveBenchmark = () => {
    triggerChime(880);
    setIsSimulatingLoad(true);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      const nextPing = Math.floor(9 + Math.random() * 8);
      setSimulatedPings(prev => [...prev.slice(1), nextPing]);
      if (count > 6) {
        clearInterval(interval);
        setIsSimulatingLoad(false);
      }
    }, 140);
  };

  const globalRegions = [
    { id: 'us-east', name: 'New York', region: 'North America', latency: 12, cache: '99.9%', coords: 'top-[34%] left-[28%]' },
    { id: 'us-west', name: 'San Francisco', region: 'Silicon Valley', latency: 14, cache: '99.8%', coords: 'top-[36%] left-[16%]' },
    { id: 'eu-west', name: 'Frankfurt', region: 'Europe Central', latency: 18, cache: '99.9%', coords: 'top-[30%] left-[51%]' },
    { id: 'me-east', name: 'Dubai', region: 'Middle East Hub', latency: 26, cache: '99.7%', coords: 'top-[42%] left-[64%]' },
    { id: 'ap-south', name: 'Mumbai', region: 'South Asia', latency: 29, cache: '99.6%', coords: 'top-[46%] left-[69%]' },
    { id: 'ap-east', name: 'Tokyo', region: 'East Asia', latency: 22, cache: '99.9%', coords: 'top-[36%] left-[84%]' },
    { id: 'ap-southeast', name: 'Singapore', region: 'Southeast Asia', latency: 24, cache: '99.8%', coords: 'top-[54%] left-[76%]' },
    { id: 'au-east', name: 'Sydney', region: 'Oceania', latency: 38, cache: '99.5%', coords: 'top-[74%] left-[87%]' },
  ];

  return (
    <div className="w-full relative space-y-6">
      {/* Top Segmented Mode Bar - Apple Pro Style */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-[#161617]/90 border border-white/[0.08] backdrop-blur-2xl shadow-xl">
        {/* Apple Segmented Pills */}
        <div className="flex items-center p-1 rounded-full bg-[#000000]/60 border border-white/[0.08] w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => {
              setActiveMode('display');
              triggerChime(520);
              onSelectDiscipline?.('website');
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              activeMode === 'display'
                ? 'bg-[#0071e3] text-white shadow-sm'
                : 'text-[#86868b] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Liquid Retina Flagship</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('silicon');
              triggerChime(640);
              onSelectDiscipline?.('software');
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              activeMode === 'silicon'
                ? 'bg-[#0071e3] text-white shadow-sm'
                : 'text-[#86868b] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>B1 Apex Silicon Engine</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('network');
              triggerChime(760);
              onSelectDiscipline?.('webapp');
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              activeMode === 'network'
                ? 'bg-[#0071e3] text-white shadow-sm'
                : 'text-[#86868b] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>310+ Global Edge Mesh</span>
          </button>
        </div>

        {/* Auxiliary Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          {activeMode === 'display' && (
            <div className="flex items-center p-0.5 rounded-lg bg-[#000000]/60 border border-white/[0.08]">
              <button
                onClick={() => { setDeviceViewport('desktop'); triggerChime(540); }}
                title="5K Studio Display View"
                className={`p-1.5 rounded-md transition-colors ${deviceViewport === 'desktop' ? 'bg-white/10 text-white' : 'text-[#86868b] hover:text-white'}`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { setDeviceViewport('laptop'); triggerChime(560); }}
                title="MacBook Pro 16 View"
                className={`p-1.5 rounded-md transition-colors ${deviceViewport === 'laptop' ? 'bg-white/10 text-white' : 'text-[#86868b] hover:text-white'}`}
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { setDeviceViewport('mobile'); triggerChime(580); }}
                title="iPhone 16 Pro View"
                className={`p-1.5 rounded-md transition-colors ${deviceViewport === 'mobile' ? 'bg-white/10 text-white' : 'text-[#86868b] hover:text-white'}`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={toggleSound}
            className={`p-2 rounded-full border transition-all ${
              soundEnabled 
                ? 'bg-[#0071e3]/20 border-[#0071e3] text-[#2997ff]' 
                : 'bg-white/[0.04] border-white/[0.08] text-[#86868b] hover:text-white'
            }`}
            title={soundEnabled ? 'Acoustic feedback enabled' : 'Enable acoustic feedback'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Showcase Stage Area */}
      <div className="relative min-h-[500px] sm:min-h-[560px] lg:min-h-[600px] rounded-[24px] bg-[#000000] border border-white/[0.08] overflow-hidden flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 shadow-2xl">
        
        {/* Subtle Apple Ambient Studio Lighting */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-radial from-[#0071e3]/15 to-transparent blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#000000] to-transparent pointer-events-none" />
        </div>

        {/* MODE 1: Liquid Retina Flagship Display Stage */}
        {activeMode === 'display' && (
          <motion.div
            key="display-stage"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center z-10 space-y-6"
          >
            {/* The Hardware Mockup Frame */}
            <div 
              className={`w-full transition-all duration-500 ease-out flex flex-col items-center ${
                deviceViewport === 'desktop' 
                  ? 'max-w-4xl' 
                  : deviceViewport === 'laptop' 
                    ? 'max-w-3xl' 
                    : 'max-w-[340px]'
              }`}
            >
              {/* Outer Metallic Chassis */}
              <div className="w-full rounded-[20px] bg-gradient-to-b from-[#2c2c2e] via-[#1c1c1e] to-[#0c0c0e] p-2.5 sm:p-3.5 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] border border-white/[0.12] relative group">
                
                {/* Camera / Sensor Island */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#000000] border border-white/[0.08] z-30">
                  <span className="w-2 h-2 rounded-full bg-[#1c1c1e] border border-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                </div>

                {/* Inner Screen Bezel */}
                <div className="w-full rounded-[14px] overflow-hidden bg-[#0a0a0c] border border-black relative">
                  
                  {/* Glass Glare Reflection Line */}
                  <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none z-20" />

                  {/* Browser / System Header Bar */}
                  <div className="px-3.5 py-2.5 bg-[#161617] border-b border-white/[0.06] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#000000]/70 border border-white/[0.08] text-[11px] text-[#86868b] font-mono max-w-[240px] truncate">
                      <span className="text-[#2997ff]">https://</span>
                      <span className="text-white">flagship.bitnexel.com</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        120 FPS
                      </span>
                    </div>
                  </div>

                  {/* Interactive Screen Content */}
                  <div className={`p-4 sm:p-6 transition-colors duration-300 ${demoDarkMode ? 'bg-[#0c0d12] text-white' : 'bg-[#f5f5f7] text-[#1d1d1f]'}`}>
                    
                    {/* Screen Hero inside Demo */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#2997ff] font-semibold">
                            PRODIGY ENGINE V4
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                            LIVE RUNTIME
                          </span>
                        </div>
                        <h4 className={`text-lg sm:text-xl font-display font-semibold mt-0.5 ${demoDarkMode ? 'text-white' : 'text-[#1d1d1f]'}`}>
                          Sub-30ms Global Interactive Canvas
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setDemoDarkMode(!demoDarkMode); triggerChime(600); }}
                          className={`px-3 py-1.5 rounded-full text-xs font-normal border transition-all ${
                            demoDarkMode 
                              ? 'bg-white/[0.08] border-white/[0.12] text-white hover:bg-white/[0.14]' 
                              : 'bg-black/[0.06] border-black/[0.1] text-[#1d1d1f] hover:bg-black/[0.1]'
                          }`}
                        >
                          {demoDarkMode ? 'Light Surface' : 'Dark Surface'}
                        </button>

                        <button
                          onClick={runLiveBenchmark}
                          disabled={isSimulatingLoad}
                          className="apple-btn-primary text-xs py-1 px-3"
                        >
                          <Zap className="w-3 h-3 text-white" />
                          <span>{isSimulatingLoad ? 'Pinging...' : 'Stress P99'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Metric Visualizer Graph */}
                    <div className="pt-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className={demoDarkMode ? 'text-[#86868b]' : 'text-slate-500'}>
                          REAL-TIME LATENCY (MS)
                        </span>
                        <span className="text-emerald-400 font-semibold">
                          Current: {simulatedPings[simulatedPings.length - 1]}ms P99
                        </span>
                      </div>

                      {/* Interactive latency histogram */}
                      <div className="h-16 flex items-end gap-1.5 pt-2 px-1">
                        {simulatedPings.map((val, idx) => {
                          const heightPct = Math.min(100, Math.max(20, (val / 30) * 100));
                          return (
                            <div 
                              key={idx} 
                              className="flex-1 rounded-t transition-all duration-300 relative group cursor-pointer"
                              style={{ height: `${heightPct}%` }}
                              onClick={() => triggerChime(400 + val * 20)}
                            >
                              <div className={`w-full h-full rounded-t transition-colors ${
                                idx === simulatedPings.length - 1 
                                  ? 'bg-[#0071e3]' 
                                  : demoDarkMode ? 'bg-white/20 group-hover:bg-[#2997ff]' : 'bg-black/20 group-hover:bg-[#0071e3]'
                              }`} />
                              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-1 rounded">
                                {val}ms
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Interactive Component Hotspots */}
                      <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                        <div 
                          onClick={() => { setActiveHotspot('webgl'); triggerChime(620); }}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            activeHotspot === 'webgl'
                              ? 'bg-[#0071e3]/20 border-[#0071e3] text-white'
                              : demoDarkMode ? 'bg-white/[0.03] border-white/[0.06] text-[#86868b] hover:text-white' : 'bg-white border-black/5 text-slate-700'
                          }`}
                        >
                          <div className="font-semibold text-white">120 FPS Metal / WebGL</div>
                          <div className="text-[10px] text-[#86868b] mt-0.5">Hardware canvas loop</div>
                        </div>

                        <div 
                          onClick={() => { setActiveHotspot('wasm'); triggerChime(660); }}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            activeHotspot === 'wasm'
                              ? 'bg-[#0071e3]/20 border-[#0071e3] text-white'
                              : demoDarkMode ? 'bg-white/[0.03] border-white/[0.06] text-[#86868b] hover:text-white' : 'bg-white border-black/5 text-slate-700'
                          }`}
                        >
                          <div className="font-semibold text-white">Zero WASM Cold Start</div>
                          <div className="text-[10px] text-[#86868b] mt-0.5">Sub-millisecond init</div>
                        </div>

                        <div 
                          onClick={() => { setActiveHotspot('bundle'); triggerChime(700); }}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            activeHotspot === 'bundle'
                              ? 'bg-[#0071e3]/20 border-[#0071e3] text-white'
                              : demoDarkMode ? 'bg-white/[0.03] border-white/[0.06] text-[#86868b] hover:text-white' : 'bg-white border-black/5 text-slate-700'
                          }`}
                        >
                          <div className="font-semibold text-white">42KB Core Payload</div>
                          <div className="text-[10px] text-[#86868b] mt-0.5">Zero runtime bloat</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stand for Studio Display */}
                {deviceViewport === 'desktop' && (
                  <div className="w-28 h-6 mx-auto bg-gradient-to-b from-[#1c1c1e] to-[#0e0e10] border-x border-b border-white/10 rounded-b-lg shadow-md -mb-6 relative z-0" />
                )}
              </div>
            </div>

            {/* Inspection details callout */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#86868b] pt-4 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                CORE WEB VITALS: 100 / 100 / 100
              </span>
              <span className="text-white/20">|</span>
              <span>GLOBAL CDN HIT RATIO: 99.8%</span>
              <span className="text-white/20">|</span>
              <span className="text-[#2997ff]">ZERO RENDER BLOCKING ASSETS</span>
            </div>
          </motion.div>
        )}

        {/* MODE 2: B1 Apex Silicon Engine (Micro-Architecture Package) */}
        {activeMode === 'silicon' && (
          <motion.div
            key="silicon-stage"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center z-10 space-y-8"
          >
            {/* Silicon Package Visual */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-[32px] p-4 bg-gradient-to-br from-[#272729] via-[#1a1a1c] to-[#0e0e10] border border-white/[0.14] shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex items-center justify-center group">
              
              {/* Gold PCB Substrate Pins Around Border */}
              <div className="absolute inset-1 rounded-[28px] border border-amber-500/20 pointer-events-none" />
              <div className="absolute -inset-1 border border-dashed border-amber-500/10 rounded-[34px] pointer-events-none" />

              {/* Silicon Package Center Layer */}
              <div className="w-full h-full rounded-[24px] bg-[#121214] border border-white/[0.1] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                
                {/* Circuit Traces Pattern */}
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none" 
                  style={{
                    backgroundImage: `radial-gradient(#2997ff 1px, transparent 1px), radial-gradient(#0071e3 1px, #121214 1px)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px'
                  }} 
                />

                {/* Pulsing Core Indicator */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0071e3] to-[#004b99] p-0.5 shadow-lg shadow-[#0071e3]/40 flex items-center justify-center relative z-10 animate-pulse">
                  <Cpu className="w-8 h-8 text-white" />
                </div>

                {/* Laser Engraved Typography */}
                <div className="text-center mt-4 space-y-1 relative z-10">
                  <div className="text-[11px] font-mono tracking-widest text-[#2997ff] uppercase font-bold">
                    BITNEXEL B1 APEX
                  </div>
                  <div className="text-xs text-[#86868b] font-mono">
                    3nm Custom Execution Kernel
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400">
                    {chipClock.toFixed(1)} GHz · {chipLoadPercent}% Load
                  </div>
                </div>

                {/* Microscopic Corner Marks */}
                <span className="absolute top-3 left-3 text-[9px] font-mono text-white/30">PIN_01</span>
                <span className="absolute bottom-3 right-3 text-[9px] font-mono text-white/30">REV_4.2</span>
              </div>
            </div>

            {/* Interactive Silicon Frequency Slider */}
            <div className="w-full max-w-lg p-5 rounded-2xl bg-[#161617]/90 border border-white/[0.08] backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#86868b] font-mono uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-[#2997ff]" />
                  Simulate Clock Frequency & Throughput
                </span>
                <span className="text-white font-mono font-bold">
                  {chipClock.toFixed(1)} GHz / {(chipClock * 22).toFixed(0)}k req/s
                </span>
              </div>

              <input
                type="range"
                min="2.4"
                max="5.8"
                step="0.1"
                value={chipClock}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setChipClock(val);
                  setChipLoadPercent(Math.round((val / 5.8) * 100));
                  triggerChime(400 + val * 80);
                }}
                className="w-full accent-[#0071e3] h-2 bg-white/[0.1] rounded-lg cursor-pointer"
              />

              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-[#86868b] text-[10px]">P99 Latency</div>
                  <div className="text-emerald-400 font-bold mt-0.5">
                    {Math.max(6, Math.round(38 - chipClock * 4.5))}ms
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-[#86868b] text-[10px]">Memory Bus</div>
                  <div className="text-white font-bold mt-0.5">800 GB/s</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-[#86868b] text-[10px]">Concurrency</div>
                  <div className="text-[#2997ff] font-bold mt-0.5">100,000+</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* MODE 3: Global Edge Constellation Stage */}
        {activeMode === 'network' && (
          <motion.div
            key="network-stage"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center z-10 space-y-6"
          >
            {/* Interactive World Map Canvas */}
            <div className="w-full max-w-4xl h-72 sm:h-80 rounded-2xl bg-[#0c0d12] border border-white/[0.1] p-6 relative overflow-hidden flex items-center justify-center">
              
              {/* World Grid Matrix */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
                }}
              />

              {/* Orbital Lines */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full opacity-30">
                  <path d="M 150 120 Q 300 80 480 110 T 750 140" fill="none" stroke="#2997ff" strokeWidth="1.5" strokeDasharray="4 4" />
                  <path d="M 220 160 Q 420 200 650 180" fill="none" stroke="#0071e3" strokeWidth="1" strokeDasharray="6 6" />
                </svg>
              </div>

              {/* Edge Node Points */}
              {globalRegions.map((node) => {
                const isSelected = activeRegion === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => {
                      setActiveRegion(node.id);
                      setPingResult({
                        city: `${node.name} (${node.region})`,
                        ms: node.latency,
                        status: 'Optimal Direct Edge Hop'
                      });
                      triggerChime(500 + node.latency * 15);
                    }}
                    className={`absolute ${node.coords} transform -translate-x-1/2 -translate-y-1/2 p-2 group transition-transform z-20 hover:scale-125 focus:outline-none`}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className={`w-3.5 h-3.5 rounded-full transition-all ${
                        isSelected 
                          ? 'bg-[#0071e3] ring-4 ring-[#2997ff]/40 shadow-lg shadow-[#0071e3]' 
                          : 'bg-white/40 group-hover:bg-[#2997ff]'
                      }`} />
                      <span className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono whitespace-nowrap px-1.5 py-0.5 rounded transition-colors ${
                        isSelected ? 'bg-white text-black font-semibold' : 'bg-black/80 text-[#86868b] group-hover:text-white'
                      }`}>
                        {node.name} · {node.latency}ms
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Node Status Panel */}
            <div className="w-full max-w-xl p-4 sm:p-5 rounded-2xl bg-[#161617]/90 border border-white/[0.08] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">
                    {pingResult.city}
                  </div>
                  <div className="text-[#86868b] text-[11px]">
                    {pingResult.status}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[#86868b] text-[10px] block">ROUTING LATENCY</span>
                  <span className="text-base font-bold text-emerald-400">{pingResult.ms}ms</span>
                </div>
                <button
                  onClick={() => onNavigate('contact')}
                  className="apple-btn-primary text-xs py-1.5 px-3"
                >
                  <span>Deploy Region</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};
