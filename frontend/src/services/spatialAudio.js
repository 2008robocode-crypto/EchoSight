// Spatial Audio & Speech Engine for EchoSight

class SpatialAudioEngine {
  constructor() {
    this.ctx = null;
    this.speechSynth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.isMuted = false;
    this.lastSpokenText = '';
    this.lastSpokenTime = 0;
    this.speechRate = 1.15; // slightly faster for quick reaction
    this.activeVoice = null;

    if (this.speechSynth) {
      this.initVoice();
      if (this.speechSynth.onvoiceschanged !== undefined) {
        this.speechSynth.onvoiceschanged = () => this.initVoice();
      }
    }
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  initVoice() {
    if (!this.speechSynth) return;
    const voices = this.speechSynth.getVoices();
    // Prefer clear English voice
    this.activeVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David')) && v.lang.startsWith('en')) || voices.find(v => v.lang.startsWith('en')) || voices[0];
  }

  /**
   * Play directional binaural sound for detected obstacle
   * @param {number} azimuthDegrees - -90 (far left) to 0 (center) to +90 (far right)
   * @param {number} distanceMeters - 0.5 to 10 meters
   * @param {'hazard'|'caution'|'info'} level
   */
  playSpatialPing(azimuthDegrees = 0, distanceMeters = 2, level = 'caution') {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pan: map -90..+90 to -1..+1
      const panVal = Math.max(-1, Math.min(1, azimuthDegrees / 90));
      let panner;
      if (this.ctx.createStereoPanner) {
        panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(panVal, now);
      } else {
        // fallback
        panner = this.ctx.createGain();
      }

      // Pitch based on hazard & distance (closer = higher pitch)
      let baseFreq = level === 'hazard' ? 880 : level === 'caution' ? 520 : 380;
      // Distance factor: 0.5m -> +200Hz, 5m -> 0Hz
      const distanceModifier = Math.max(0, (5 - distanceMeters) * 60);
      osc.frequency.setValueAtTime(baseFreq + distanceModifier, now);

      if (level === 'hazard') {
        osc.type = 'sawtooth';
        // Double pulse for urgency
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.35, now + 0.16);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.18);
      }

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.ctx.destination);

      // Trigger haptic vibration if supported
      this.triggerHaptic(level === 'hazard' ? [150, 50, 150] : [70]);
    } catch (e) {
      console.warn('Audio ping error:', e);
    }
  }

  triggerHaptic(pattern = [80]) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  /**
   * Speak guidance using speech synthesis
   * @param {string} text - text to speak
   * @param {'high'|'normal'} priority - high cancels ongoing speech
   */
  speak(text, priority = 'normal') {
    if (this.isMuted || !this.speechSynth) return;

    const now = Date.now();
    // Prevent repetitive loops if same text within 3 seconds
    if (text === this.lastSpokenText && now - this.lastSpokenTime < 3500) {
      return;
    }

    if (priority === 'high') {
      this.speechSynth.cancel();
    } else if (this.speechSynth.speaking) {
      return; // Don't interrupt unless high priority
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.activeVoice) utterance.voice = this.activeVoice;
    utterance.rate = this.speechRate;
    utterance.pitch = priority === 'high' ? 1.15 : 1.0;

    this.lastSpokenText = text;
    this.lastSpokenTime = now;

    this.speechSynth.speak(utterance);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.speechSynth) {
      this.speechSynth.cancel();
    }
    return this.isMuted;
  }
}

export const spatialAudio = new SpatialAudioEngine();
