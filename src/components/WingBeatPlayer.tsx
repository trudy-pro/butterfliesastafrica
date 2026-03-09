import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Play, Square } from "lucide-react";
import { SoundProfileInfo } from "@/data/wingBeatData";

interface WingBeatPlayerProps {
  wingBeat: SoundProfileInfo;
}

/**
 * Synthesises a gentle wing-beat tone using Web Audio API
 * and shows an animated "wing-beat" visualiser.
 */
const WingBeatPlayer = ({ wingBeat }: WingBeatPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);

  const stop = useCallback(() => {
    try {
      oscRef.current?.stop();
      lfoRef.current?.stop();
    } catch { /* already stopped */ }
    ctxRef.current?.close();
    ctxRef.current = null;
    oscRef.current = null;
    lfoRef.current = null;
    gainRef.current = null;
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (playing) { stop(); return; }

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    // Main tone — soft sine at a pleasing pitch
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 220; // base pitch A3

    // LFO modulates volume at wing-beat frequency
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = wingBeat.frequencyHz;

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.4;

    const mainGain = ctx.createGain();
    mainGain.gain.value = 0.15;

    // Connect LFO → mainGain.gain to create pulsing
    lfo.connect(lfoGain);
    lfoGain.connect(mainGain.gain);

    osc.connect(mainGain);
    mainGain.connect(ctx.destination);

    osc.start();
    lfo.start();

    oscRef.current = osc;
    lfoRef.current = lfo;
    gainRef.current = mainGain;

    setPlaying(true);

    // Auto-stop after 5 seconds
    setTimeout(() => stop(), 5000);
  }, [playing, wingBeat.frequencyHz, stop]);

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = muted ? 0 : 0.15;
    }
  }, [muted]);

  // Cleanup on unmount
  useEffect(() => () => { stop(); }, [stop]);

  // Generate visualiser bars based on frequency
  const barCount = 12;
  const bars = Array.from({ length: barCount }, (_, i) => {
    const phase = (i / barCount) * Math.PI * 2;
    const baseHeight = 0.3 + 0.7 * Math.abs(Math.sin(phase));
    return baseHeight;
  });

  return (
    <div className="mb-6">
      <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">
        Wing-Beat Frequency
      </h3>

      <div className="rounded-sm border border-border bg-card p-4">
        {/* Frequency display */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-body font-semibold text-foreground tabular-nums">
              {wingBeat.frequencyHz}
            </span>
            <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">
              Hz
            </span>
          </div>
          <span className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">
            {wingBeat.frequencyLabel}
          </span>
        </div>

        {/* Visualiser */}
        <div className="flex items-end gap-[3px] h-10 mb-3">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-[1px] bg-primary/70"
              animate={playing ? {
                height: [`${h * 100}%`, `${(1 - h) * 100}%`, `${h * 100}%`],
              } : { height: `${h * 60}%` }}
              transition={playing ? {
                duration: 1 / wingBeat.frequencyHz * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.04,
              } : { duration: 0.3 }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={play}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border bg-secondary text-secondary-foreground text-xs font-body tracking-wider uppercase hover:bg-muted transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {playing ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {playing ? "Stop" : "Play tone"}
          </motion.button>

          {playing && (
            <motion.button
              onClick={() => setMuted(!muted)}
              className="p-1.5 rounded-sm border border-border text-muted-foreground hover:text-foreground transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </motion.button>
          )}
        </div>

        {/* Behavioral note */}
        <p className="text-xs font-body text-muted-foreground leading-relaxed mt-3">
          {wingBeat.note}
        </p>
      </div>
    </div>
  );
};

export default WingBeatPlayer;
