import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, HelpCircle } from 'lucide-react';
import { spatialAudio } from '../services/spatialAudio';

export default function VoiceAssistant({ currentScenario, onSelectObject, highContrast = false }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('Voice assistant ready. Say "Find keys", "What is ahead?", or "Read scene".');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase();
        setTranscript(text);
        processVoiceCommand(text);
      };

      rec.onerror = (e) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, [currentScenario]);

  const toggleListen = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const processVoiceCommand = (cmd) => {
    let response = '';

    if (cmd.includes('key') || cmd.includes('keys')) {
      const keys = currentScenario.objects.find(o => o.label.toLowerCase().includes('key'));
      if (keys) {
        onSelectObject(keys);
        spatialAudio.playSpatialPing(keys.azimuthDegrees, keys.distanceMeters, 'target');
        response = `Found your keys at ${keys.clockDirection}, ${keys.distanceMeters} meters away on the table.`;
      } else {
        response = 'I do not see keys in the current field of view. Try panning your camera slowly to the right.';
      }
    } else if (cmd.includes('medicine') || cmd.includes('prescription') || cmd.includes('bottle') || cmd.includes('pill')) {
      const med = currentScenario.objects.find(o => o.label.toLowerCase().includes('prescription') || o.label.toLowerCase().includes('medication'));
      if (med) {
        onSelectObject(med);
        spatialAudio.playSpatialPing(med.azimuthDegrees, med.distanceMeters, 'target');
        response = `Found prescription medication at ${med.clockDirection}, ${med.distanceMeters} meters. Label reads Atorvastatin 20 milligrams.`;
      } else {
        response = 'No medicine bottle detected in immediate view.';
      }
    } else if (cmd.includes('hazard') || cmd.includes('danger') || cmd.includes('stairs') || cmd.includes('curb') || cmd.includes('fall')) {
      const hazard = currentScenario.objects.find(o => o.priority === 'hazard');
      if (hazard) {
        onSelectObject(hazard);
        spatialAudio.playSpatialPing(hazard.azimuthDegrees, hazard.distanceMeters, 'hazard');
        response = `Attention: ${hazard.label} detected at ${hazard.clockDirection}, only ${hazard.distanceMeters} meters away. Stop or proceed with cane.`;
      } else {
        response = 'Clear path directly ahead. No immediate critical hazards detected.';
      }
    } else if (cmd.includes('door') || cmd.includes('exit')) {
      const door = currentScenario.objects.find(o => o.label.toLowerCase().includes('door') || o.label.toLowerCase().includes('exit'));
      if (door) {
        onSelectObject(door);
        spatialAudio.playSpatialPing(door.azimuthDegrees, door.distanceMeters, 'info');
        response = `Automatic exit door is at 12 o'clock, approximately ${door.distanceMeters} meters ahead.`;
      } else {
        response = 'No exit doorway identified in current frame.';
      }
    } else {
      // General scene summary via Meta Muse
      response = currentScenario.audioCue;
      const primary = currentScenario.objects[0];
      if (primary) {
        spatialAudio.playSpatialPing(primary.azimuthDegrees, primary.distanceMeters, primary.priority);
      }
    }

    setLastResponse(response);
    spatialAudio.speak(response, 'high');
  };

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      highContrast 
        ? 'bg-black border-yellow-400 text-yellow-300' 
        : 'bg-[#0E131F]/90 border-slate-800/80 shadow-2xl backdrop-blur-md'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase">Conversational Voice Agent</h3>
            <p className="text-[11px] text-slate-400">Powered by Meta Muse Multimodal Dialogue</p>
          </div>
        </div>

        <button
          onClick={toggleListen}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition transform active:scale-95 ${
            isListening 
              ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30' 
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          {isListening ? 'Listening...' : 'Push to Talk'}
        </button>
      </div>

      {/* Transcript & Response Area */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
        {transcript && (
          <div className="flex items-start gap-2 text-cyan-300 font-mono">
            <span className="font-bold text-slate-500 uppercase text-[10px]">User:</span>
            <span>"{transcript}"</span>
          </div>
        )}
        <div className="flex items-start gap-2 text-slate-200">
          <span className="font-bold text-emerald-400 uppercase text-[10px] shrink-0 pt-0.5">Echo:</span>
          <p className="leading-relaxed">{lastResponse}</p>
        </div>
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="mt-3 flex flex-wrap gap-1.5 items-center">
        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" /> Quick Prompts:
        </span>
        {[
          'Where are my keys?',
          'What is ahead?',
          'Are there stairs?',
          'Find medication'
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => {
              setTranscript(prompt);
              processVoiceCommand(prompt.toLowerCase());
            }}
            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700/60 transition"
          >
            "{prompt}"
          </button>
        ))}
      </div>
    </div>
  );
}
