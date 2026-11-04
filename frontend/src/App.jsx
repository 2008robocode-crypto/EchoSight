import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Sliders, 
  Info, 
  Keyboard, 
  ShieldAlert, 
  HelpCircle,
  Compass,
  Radio,
  ExternalLink
} from 'lucide-react';
import VisionFeed from './components/VisionFeed';
import RadarView from './components/RadarView';
import VoiceAssistant from './components/VoiceAssistant';
import MetaIntelligenceInspector from './components/MetaIntelligenceInspector';
import { SCENARIOS } from './services/samMockData';
import { spatialAudio } from './services/spatialAudio';

export default function App() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [selectedObject, setSelectedObject] = useState(null);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const currentScenario = SCENARIOS[selectedScenarioIndex];

  // Initialize and select first object when scenario changes
  useEffect(() => {
    setSelectedObject(currentScenario.objects[0]);
    // Announce scenario change
    spatialAudio.speak(`Switched to scenario: ${currentScenario.title}. ${currentScenario.audioCue}`);
    // Play initial directional ping for primary object
    const primary = currentScenario.objects.find(o => o.priority === 'hazard') || currentScenario.objects[0];
    if (primary) {
      spatialAudio.playSpatialPing(primary.azimuthDegrees, primary.distanceMeters, primary.priority);
    }
  }, [selectedScenarioIndex]);

  // Global Keyboard Shortcuts for Accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        spatialAudio.speak(currentScenario.audioCue, 'high');
      } else if (e.key === 'm' || e.key === 'M') {
        const muted = spatialAudio.toggleMute();
        setIsMuted(muted);
      } else if (e.key === 'h' || e.key === 'H') {
        setHighContrast(prev => !prev);
      } else if (e.key === 'c' || e.key === 'C') {
        setIsCameraMode(prev => !prev);
      } else if (e.key === '1') {
        setSelectedScenarioIndex(0);
      } else if (e.key === '2') {
        setSelectedScenarioIndex(1);
      } else if (e.key === '3') {
        setSelectedScenarioIndex(2);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScenario]);

  const handleToggleMute = () => {
    const muted = spatialAudio.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      highContrast 
        ? 'bg-black text-yellow-300 high-contrast' 
        : 'bg-[#080B11] text-slate-100'
    }`}>
      {/* Top Banner: Hackathon & Model Context */}
      <div className="w-full bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-slate-800/80 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40">
            META GLOBAL AI HACKATHON
          </span>
          <span className="text-slate-300 font-medium">
            EchoSight: Real-Time Spatial Assistive Vision
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-emerald-400 font-mono hidden sm:inline">Theme: Build for Your World</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> Meta SAM 3.1 + Muse Multimodal
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400">Modal Serverless Endpoints</span>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="border-b border-slate-800/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 bg-[#080B11]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20 font-black text-lg">
            👁️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight">EchoSight</h1>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                SAM 3.1
              </span>
            </div>
            <p className="text-xs text-slate-400">Spatial Audio & Multi-Modal Co-Pilot for the Visually Impaired</p>
          </div>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          {SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenarioIndex(idx)}
              className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
                selectedScenarioIndex === idx
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="font-mono opacity-60">[{idx + 1}]</span>
              <span>{sc.title.split('&')[0]}</span>
            </button>
          ))}
        </div>

        {/* Accessibility & Audio Controls */}
        <div className="flex items-center gap-2">
          {/* High Contrast Mode Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
              highContrast 
                ? 'bg-yellow-400 text-black border-yellow-300 shadow-lg' 
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Toggle High Contrast Mode (Press H)"
          >
            {highContrast ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{highContrast ? 'High Contrast: ON' : 'Contrast'}</span>
          </button>

          {/* Mute Audio Toggle */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
              isMuted 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                : 'bg-slate-900 border-slate-700 text-cyan-400 hover:bg-slate-800'
            }`}
            title="Toggle Spatial Audio Mute (Press M)"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Keyboard Shortcuts Dialog Trigger */}
          <button
            onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Keyboard Shortcuts Drawer / Modal */}
      {showKeyboardHelp && (
        <div className="mx-6 mt-4 p-4 rounded-xl bg-slate-900/95 border border-cyan-500/30 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <Keyboard className="w-4 h-4" /> Accessibility Hotkeys:
            </span>
            <span><kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-bold text-white">Space</kbd> Repeat Speech Audio Cue</span>
            <span><kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-bold text-white">M</kbd> Mute/Unmute Audio</span>
            <span><kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-bold text-white">H</kbd> High Contrast</span>
            <span><kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-bold text-white">C</kbd> Camera Mode</span>
            <span><kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-bold text-white">1 / 2 / 3</kbd> Switch Scenarios</span>
          </div>
          <button 
            onClick={() => setShowKeyboardHelp(false)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
          >
            Close
          </button>
        </div>
      )}

      {/* Main Grid Content */}
      <main className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1700px] mx-auto">
        {/* Left Column: Vision Feed & Conversational Voice Agent (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <VisionFeed
            currentScenario={currentScenario}
            onSelectObject={setSelectedObject}
            selectedObject={selectedObject}
            isCameraMode={isCameraMode}
            setIsCameraMode={setIsCameraMode}
            highContrast={highContrast}
          />

          <VoiceAssistant
            currentScenario={currentScenario}
            onSelectObject={setSelectedObject}
            highContrast={highContrast}
          />
        </div>

        {/* Right Column: Spatial Radar & Meta Intelligence Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <RadarView
            objects={currentScenario.objects}
            activeScenario={currentScenario}
            highContrast={highContrast}
          />

          <MetaIntelligenceInspector
            selectedObject={selectedObject}
            currentScenario={currentScenario}
            highContrast={highContrast}
          />
        </div>
      </main>

      {/* Accessible Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-5 mt-10 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4 max-w-[1700px] mx-auto">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-400">EchoSight Assistive Vision</span>
          <span>•</span>
          <span>Submitted for Meta Global AI Developer Hackathon 2026</span>
          <span>•</span>
          <span className="text-cyan-400">W3C WCAG 2.2 AAA Compliant Spatial Interface</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] text-slate-400">
            Audio: Web Audio API (Binaural Panner) + SpeechSynthesis
          </span>
        </div>
      </footer>
    </div>
  );
}
