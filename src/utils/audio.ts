class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private voiceEnabled: boolean = true;
  private voices: SpeechSynthesisVoice[] = [];
  private britishVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.initVoices();
  }

  public init() {
    if (!this.ctx) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioCtx();
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      } catch (e) {
        console.warn('AudioContext not supported', e);
      }
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        try {
          this.voices = window.speechSynthesis.getVoices();
          // Find British English voice
          this.britishVoice =
            this.voices.find(v => v.lang === 'en-GB' && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Oliver') || v.name.includes('George') || v.name.includes('Hazel') || v.name.includes('Serena'))) ||
            this.voices.find(v => v.lang === 'en-GB') ||
            this.voices.find(v => v.lang.startsWith('en')) ||
            this.voices[0] ||
            null;
        } catch (e) {
          console.warn('Error loading voices', e);
        }
      };

      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
  }

  private tone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3, detune: number = 0) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (detune !== 0) osc.detune.setValueAtTime(detune, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio error
    }
  }

  // Classic Mario Jump
  public playJump() {
    this.init();
    if (!this.soundEnabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.16);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {}
  }

  // Epic Super Vault Leap (when answering question correctly!)
  public playSuperVault() {
    this.init();
    if (!this.soundEnabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    try {
      // Ascending heroic fanfare glissando
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);

      // Chime burst
      setTimeout(() => this.playCoin(), 120);
      setTimeout(() => this.playCoin(), 240);
    } catch (e) {}
  }

  // Mario Coin Ping
  public playCoin() {
    this.init();
    if (!this.soundEnabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  // Star collection jingle
  public playStar() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.tone(freq, 0.22, 'triangle', 0.28), idx * 75);
    });
  }

  // Duolingo/Mario Correct Answer Chime
  public playCorrect() {
    const chords = [
      { f: 523.25, d: 0.15 }, // C5
      { f: 659.25, d: 0.15 }, // E5
      { f: 783.99, d: 0.15 }, // G5
      { f: 1046.5, d: 0.4 }   // C6
    ];
    chords.forEach((chord, i) => {
      setTimeout(() => this.tone(chord.f, chord.d, 'sine', 0.35), i * 90);
    });
  }

  // Wrong Answer Wobble
  public playWrong() {
    this.tone(220, 0.18, 'sawtooth', 0.25);
    setTimeout(() => this.tone(180, 0.3, 'sawtooth', 0.3), 160);
  }

  // Power Up / Unlock fanfare
  public playPowerUp() {
    const notes = [330, 392, 659, 523, 587, 784];
    notes.forEach((f, idx) => {
      setTimeout(() => this.tone(f, 0.2, 'triangle', 0.3), idx * 80);
    });
  }

  // Stage clear triumph
  public playStageClear() {
    const fanfare = [
      { f: 523.25, t: 0 },
      { f: 523.25, t: 100 },
      { f: 523.25, t: 200 },
      { f: 523.25, t: 300 },
      { f: 659.25, t: 450 },
      { f: 783.99, t: 600 },
      { f: 1046.5, t: 800 }
    ];
    fanfare.forEach(item => {
      setTimeout(() => this.tone(item.f, 0.3, 'sine', 0.35), item.t);
    });
  }

  public playPop() {
    this.tone(850, 0.08, 'sine', 0.25);
  }

  // Text-To-Speech with English (British) preference
  public speak(text: string, lang: 'en' | 'ar' = 'en', rate: number = 0.95, onEnd?: () => void) {
    if (!this.voiceEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const cleanText = text.replace(/[*_#`[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      if (lang === 'ar') {
        utterance.lang = 'ar-SA';
      } else {
        utterance.lang = 'en-GB';
        if (this.britishVoice) {
          utterance.voice = this.britishVoice;
        }
      }

      utterance.rate = rate;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      if (onEnd) {
        utterance.onend = onEnd;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error', e);
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }
}

export const soundManager = new SoundManager();
