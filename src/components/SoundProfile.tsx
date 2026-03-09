import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2, VolumeX, Play, Square,
  Wind, TreePine, Waves as WavesIcon, Headphones,
} from "lucide-react";
import { SoundProfileInfo } from "@/data/wingBeatData";

interface SoundProfileProps {
  soundProfile: SoundProfileInfo;
}

// ── Audio Synthesis Helpers ──

function createWingBeatAudio(ctx: AudioContext, hz: number): { osc: OscillatorNode; lfo: OscillatorNode; gain: GainNode } {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 220;

  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = hz;

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.4;

  const gain = ctx.createGain();
  gain.gain.value = 0.12;

  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  osc.connect(gain);

  return { osc, lfo, gain };
}

function createAmbianceAudio(ctx: AudioContext, type: string): { source: AudioBufferSourceNode; gain: GainNode } {
  // Generate ambient noise shaped by habitat type
  const sampleRate = ctx.sampleRate;
  const duration = 6;
  const buffer = ctx.createBuffer(2, sampleRate * duration, sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      let sample = (Math.random() * 2 - 1) * 0.3;

      switch (type) {
        case "tropical-rainforest":
          // Dense, warm noise with slow modulation + dripping
          sample *= 0.5 + 0.3 * Math.sin(t * 0.7 + ch);
          sample += Math.sin(t * 1200 * (1 + 0.3 * Math.sin(t * 3))) * 0.02 * Math.max(0, Math.sin(t * 2.5));
          break;
        case "savanna-grassland":
          // Dry, rustling with wind gusts
          sample *= 0.3 + 0.4 * Math.abs(Math.sin(t * 0.4));
          sample += Math.sin(t * 800) * 0.01 * Math.max(0, Math.sin(t * 1.2));
          break;
        case "montane-forest":
          // Cool, sparse with echo
          sample *= 0.2 + 0.2 * Math.sin(t * 0.3);
          sample += Math.sin(t * 600 + Math.sin(t * 0.5) * 200) * 0.015;
          break;
        case "coastal-scrub":
          // Rhythmic surf-like waves
          sample *= 0.3 + 0.5 * Math.abs(Math.sin(t * 0.15 * Math.PI));
          break;
        case "alpine-meadow":
          // Thin wind, very sparse
          sample *= 0.15 + 0.2 * Math.sin(t * 0.2);
          break;
        case "riverine-gallery":
          // Water tumbling
          sample *= 0.4 + 0.3 * Math.sin(t * 1.5);
          sample += Math.sin(t * 400 + Math.random() * 100) * 0.02;
          break;
        default:
          // Woodland — birdsong-like
          sample *= 0.25 + 0.2 * Math.sin(t * 0.5);
          sample += Math.sin(t * 2000 * (1 + Math.sin(t * 4))) * 0.008 * Math.max(0, Math.sin(t * 1.8));
      }
      data[i] = sample;
    }
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const gain = ctx.createGain();
  gain.gain.value = 0.08;
  source.connect(gain);

  return { source, gain };
}

function playWingClap(ctx: AudioContext, clapFreqHz: number, intensity: string) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = clapFreqHz;

  const gain = ctx.createGain();
  const vol = intensity === "pronounced" ? 0.35 : intensity === "moderate" ? 0.2 : 0.1;
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.4);
}

// ── Component ──

type ActiveLayer = "wingbeat" | "ambiance" | "wingclap";

const SoundProfile = ({ soundProfile }: SoundProfileProps) => {
  const [activeLayers, setActiveLayers] = useState<Set<ActiveLayer>>(new Set());
  const [muted, setMuted] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const ctxRef = useRef<AudioContext | null>(null);
  const wingbeatRef = useRef<{ osc: OscillatorNode; lfo: OscillatorNode; gain: GainNode } | null>(null);
  const ambianceRef = useRef<{ source: AudioBufferSourceNode; gain: GainNode } | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getOrCreateCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      master.gain.value = muted ? 0 : 1;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterGainRef.current = master;
    }
    return ctxRef.current;
  }, [muted]);

  const stopAll = useCallback(() => {
    if (autoStopRef.current) clearTimeout(autoStopRef.current);
    try { wingbeatRef.current?.osc.stop(); wingbeatRef.current?.lfo.stop(); } catch { /* */ }
    try { ambianceRef.current?.source.stop(); } catch { /* */ }
    wingbeatRef.current = null;
    ambianceRef.current = null;
    try { ctxRef.current?.close(); } catch { /* */ }
    ctxRef.current = null;
    masterGainRef.current = null;
    setActiveLayers(new Set());
  }, []);

  const toggleLayer = useCallback((layer: ActiveLayer) => {
    const newLayers = new Set(activeLayers);

    if (layer === "wingclap") {
      // Wing clap is a one-shot
      const ctx = getOrCreateCtx();
      playWingClap(ctx, soundProfile.wingClap.clapFreqHz, soundProfile.wingClap.intensity);
      return;
    }

    if (newLayers.has(layer)) {
      // Stop this layer
      if (layer === "wingbeat") {
        try { wingbeatRef.current?.osc.stop(); wingbeatRef.current?.lfo.stop(); } catch { /* */ }
        wingbeatRef.current = null;
      }
      if (layer === "ambiance") {
        try { ambianceRef.current?.source.stop(); } catch { /* */ }
        ambianceRef.current = null;
      }
      newLayers.delete(layer);

      if (newLayers.size === 0) {
        stopAll();
        return;
      }
    } else {
      // Start this layer
      const ctx = getOrCreateCtx();
      const master = masterGainRef.current!;

      if (layer === "wingbeat" && !wingbeatRef.current) {
        const wb = createWingBeatAudio(ctx, soundProfile.frequencyHz);
        wb.gain.connect(master);
        wb.osc.start();
        wb.lfo.start();
        wingbeatRef.current = wb;
      }

      if (layer === "ambiance" && !ambianceRef.current) {
        const amb = createAmbianceAudio(ctx, soundProfile.ambiance);
        amb.gain.connect(master);
        amb.source.start();
        ambianceRef.current = amb;
      }

      newLayers.add(layer);
    }

    setActiveLayers(newLayers);

    // Auto-stop after 8 seconds
    if (autoStopRef.current) clearTimeout(autoStopRef.current);
    autoStopRef.current = setTimeout(() => stopAll(), 8000);
  }, [activeLayers, soundProfile, getOrCreateCtx, stopAll]);

  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = muted ? 0 : 1;
    }
  }, [muted]);

  useEffect(() => () => { stopAll(); }, [stopAll]);

  const isPlaying = activeLayers.size > 0;

  const barCount = 16;
  const bars = Array.from({ length: barCount }, (_, i) => {
    const phase = (i / barCount) * Math.PI * 2;
    return 0.2 + 0.8 * Math.abs(Math.sin(phase + 0.5));
  });

  const sections = [
    {
      key: "texture",
      label: "Acoustic Texture",
      value: soundProfile.textureLabel,
      desc: soundProfile.textureDesc,
      icon: "〰",
    },
    {
      key: "ambiance",
      label: "Habitat Ambiance",
      value: soundProfile.ambianceLabel,
      desc: soundProfile.ambianceDesc,
      icon: "🌿",
    },
    {
      key: "wingclap",
      label: "Wing-Clap Profile",
      value: `${soundProfile.wingClap.intensity.charAt(0).toUpperCase() + soundProfile.wingClap.intensity.slice(1)} (${soundProfile.wingClap.clapFreqHz} Hz bass)`,
      desc: soundProfile.wingClap.deformation,
      icon: "👏",
    },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">
        Sound Profile
      </h3>

      <div className="rounded-sm border border-border bg-card overflow-hidden">
        {/* Frequency header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-body font-semibold text-foreground tabular-nums">
                {soundProfile.frequencyHz}
              </span>
              <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">
                Hz
              </span>
            </div>
            <span className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">
              {soundProfile.frequencyLabel}
            </span>
          </div>

          {/* Visualiser */}
          <div className="flex items-end gap-[2px] h-8 mb-3">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-[1px] bg-primary/60"
                animate={isPlaying ? {
                  height: [`${h * 100}%`, `${(1 - h) * 100}%`, `${h * 100}%`],
                } : { height: `${h * 50}%` }}
                transition={isPlaying ? {
                  duration: 1 / soundProfile.frequencyHz * 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.03,
                } : { duration: 0.3 }}
              />
            ))}
          </div>

          {/* Audio layer controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <motion.button
              onClick={() => toggleLayer("wingbeat")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-body tracking-wider uppercase transition-colors ${
                activeLayers.has("wingbeat")
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-secondary-foreground border-border hover:bg-muted"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {activeLayers.has("wingbeat") ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              Wing-beat
            </motion.button>

            <motion.button
              onClick={() => toggleLayer("ambiance")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-body tracking-wider uppercase transition-colors ${
                activeLayers.has("ambiance")
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-secondary-foreground border-border hover:bg-muted"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <TreePine className="w-3 h-3" />
              Ambiance
            </motion.button>

            <motion.button
              onClick={() => toggleLayer("wingclap")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border bg-secondary text-secondary-foreground text-xs font-body tracking-wider uppercase hover:bg-muted transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Wind className="w-3 h-3" />
              Wing Clap
            </motion.button>

            {isPlaying && (
              <>
                <motion.button
                  onClick={() => setMuted(!muted)}
                  className="p-1.5 rounded-sm border border-border text-muted-foreground hover:text-foreground transition-colors"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </motion.button>

                <motion.button
                  onClick={stopAll}
                  className="p-1.5 rounded-sm border border-border text-muted-foreground hover:text-foreground transition-colors"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Square className="w-3.5 h-3.5" />
                </motion.button>
              </>
            )}
          </div>

          <p className="text-xs font-body text-muted-foreground leading-relaxed mt-3">
            {soundProfile.note}
          </p>
        </div>

        {/* Metadata sections */}
        {sections.map((section) => (
          <div key={section.key} className="border-b border-border last:border-0">
            <button
              onClick={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{section.icon}</span>
                <span className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">
                  {section.label}
                </span>
              </div>
              <span className="text-xs font-body text-foreground font-medium">
                {section.value}
              </span>
            </button>

            <AnimatePresence>
              {expandedSection === section.key && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-3 text-xs font-body text-muted-foreground leading-relaxed">
                    {section.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoundProfile;
