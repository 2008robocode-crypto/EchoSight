import React, { useState } from 'react';
import { Cpu, Terminal, Zap, CheckCircle2, ChevronRight, Activity, Server } from 'lucide-react';
import { META_MODEL_SPECS } from '../services/samMockData';

export default function MetaIntelligenceInspector({ selectedObject, currentScenario, highContrast = false }) {
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'rawJson' | 'specs'

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      highContrast 
        ? 'bg-black border-yellow-400 text-yellow-300' 
        : 'bg-[#0E131F]/90 border-slate-800/80 shadow-2xl backdrop-blur-md'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase flex items-center gap-1.5">
              Meta AI Neural Inspector
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                SAM 3.1 + Muse
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Zero-shot segmentation & spatial reasoning telemetry</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-2.5 py-1 rounded-md transition ${activeTab === 'pipeline' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
          >
            Pipeline
          </button>
          <button
            onClick={() => setActiveTab('rawJson')}
            className={`px-2.5 py-1 rounded-md transition ${activeTab === 'rawJson' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
          >
            Payload JSON
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-2.5 py-1 rounded-md transition ${activeTab === 'specs' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
          >
            Model Specs
          </button>
        </div>
      </div>

      {/* Tab 1: Live Pipeline Reasoning */}
      {activeTab === 'pipeline' && (
        <div className="space-y-3">
          {/* Active Target Banner */}
          {selectedObject ? (
            <div className="p-3 rounded-xl bg-slate-950/70 border border-indigo-500/30">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  Selected: {selectedObject.label}
                </span>
                <span className="font-mono text-cyan-400 text-[11px]">
                  IoU Conf: {(selectedObject.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                <strong className="text-indigo-300 font-mono text-[10px] uppercase block mb-1">
                  Meta Muse Multimodal CoT Reasoning:
                </strong>
                "{selectedObject.museReasoning}"
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] font-mono">
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="text-slate-500 block">Distance</span>
                  <span className="text-emerald-400 font-bold">{selectedObject.distanceMeters}m</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="text-slate-500 block">Clock Bearing</span>
                  <span className="text-amber-400 font-bold">{selectedObject.clockDirection}</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="text-slate-500 block">Elevation</span>
                  <span className="text-cyan-400 font-bold">{selectedObject.elevation}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-center text-xs text-slate-400">
              Select or hover any bounding box or radar beacon to inspect SAM 3.1 segmentation mask & Muse reasoning chain.
            </div>
          )}

          {/* Real-time Telemetry Metrics */}
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" /> Vision FPS
              </span>
              <span className="text-cyan-400 font-bold">28.4</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Latency
              </span>
              <span className="text-amber-400 font-bold">142ms</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                <Server className="w-3 h-3 text-emerald-400" /> Host
              </span>
              <span className="text-emerald-400 font-bold">Modal A10G</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Raw JSON Payload */}
      {activeTab === 'rawJson' && (
        <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-56 leading-relaxed">
          {JSON.stringify(selectedObject || currentScenario.objects, null, 2)}
        </pre>
      )}

      {/* Tab 3: Model Architecture Specs */}
      {activeTab === 'specs' && (
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2 font-mono">
          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">Zero-Shot Vision:</span>
            <span className="text-indigo-400 font-bold">{META_MODEL_SPECS.visionModel}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">Multimodal Agent:</span>
            <span className="text-cyan-400 font-bold">{META_MODEL_SPECS.reasoningModel}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">Development Agent:</span>
            <span className="text-emerald-400 font-bold">{META_MODEL_SPECS.codingAgent}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Inference Partners:</span>
            <span className="text-amber-400 font-bold">Modal + Fireworks / Baseten</span>
          </div>
        </div>
      )}
    </div>
  );
}
