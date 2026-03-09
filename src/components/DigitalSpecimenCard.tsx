import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface DigitalSpecimenCardProps {
  /** Specimen image */
  image: string;
  commonName: string;
  scientificName: string;
  archivalId: string;
  frequencyHz: number;
  flightProfile: string;
  acousticSignature: string;
  serialNumber: string;
  onPlayTone?: () => void;
}

/**
 * A collectible-style "Digital Specimen Card" — feels like a 1-of-1 archival print.
 * Features a pulsing waveform synced to wing-beat frequency.
 */
const DigitalSpecimenCard = ({
  image,
  commonName,
  scientificName,
  archivalId,
  frequencyHz,
  flightProfile,
  acousticSignature,
  serialNumber,
  onPlayTone,
}: DigitalSpecimenCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Pulsing waveform animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    let animId: number;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const t = time / 1000;

      // Draw multiple waveform layers
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        ctx.strokeStyle = `hsla(30, 10%, 15%, ${0.15 - layer * 0.04})`;
        ctx.lineWidth = 1.5 - layer * 0.4;

        for (let x = 0; x < w; x++) {
          const xNorm = x / w;
          // Modulate amplitude by wing-beat frequency
          const envelope = Math.sin(t * frequencyHz * 0.5 + layer) * 0.5 + 0.5;
          const y = h / 2 +
            Math.sin(xNorm * Math.PI * 6 + t * 2 + layer) * h * 0.3 * envelope *
            Math.sin(xNorm * Math.PI); // taper at edges

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Center pulse dot
      const pulsePhase = Math.sin(t * frequencyHz) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 3 + pulsePhase * 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(25, 30%, 45%, ${0.4 + pulsePhase * 0.4})`;
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [frequencyHz]);

  return (
    <motion.div
      className="relative w-full max-w-sm mx-auto"
      initial={{ rotateY: -15, scale: 0.9, opacity: 0 }}
      animate={{ rotateY: 0, scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ perspective: 1000 }}
    >
      <div className="relative bg-card border-2 border-border rounded-sm overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)]">
        {/* Archival header strip */}
        <div className="bg-primary px-4 py-2 flex items-center justify-between">
          <span className="text-[9px] font-body text-primary-foreground/60 uppercase tracking-[0.3em]">
            The Butterfly Archive
          </span>
          <span className="text-[9px] font-body text-primary-foreground/40 uppercase tracking-wider">
            Digital Specimen
          </span>
        </div>

        {/* Specimen image */}
        <div className="relative bg-background flex items-center justify-center py-6 px-8">
          <motion.img
            src={image}
            alt={commonName}
            className="w-48 h-auto object-contain drop-shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />

          {/* Corner archival marks */}
          <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-muted-foreground/20" />
          <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-muted-foreground/20" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-muted-foreground/20" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-muted-foreground/20" />
        </div>

        {/* Interactive waveform */}
        <div
          className="relative cursor-pointer group"
          onClick={onPlayTone}
          title="Click to hear the wing-beat sonification"
        >
          <canvas
            ref={canvasRef}
            className="w-full bg-card"
            style={{ height: 48 }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[9px] font-body text-muted-foreground uppercase tracking-wider bg-card/80 px-2 py-0.5 rounded-sm">
              ▶ Listen to {frequencyHz} Hz
            </span>
          </div>
        </div>

        {/* Specimen data */}
        <div className="p-4 border-t border-border">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3
                className="text-lg leading-tight text-foreground"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
              >
                {commonName}
              </h3>
              <p className="text-xs font-body italic text-muted-foreground">{scientificName}</p>
            </div>
            <span className="text-[10px] font-body text-muted-foreground tracking-wider bg-secondary px-2 py-0.5 rounded-sm">
              {archivalId}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
            <div>
              <p className="text-[9px] font-body text-muted-foreground uppercase tracking-wider">Frequency</p>
              <p className="text-sm font-body font-semibold text-foreground tabular-nums">{frequencyHz} Hz</p>
            </div>
            <div>
              <p className="text-[9px] font-body text-muted-foreground uppercase tracking-wider">Flight</p>
              <p className="text-xs font-body text-foreground">{flightProfile}</p>
            </div>
            <div>
              <p className="text-[9px] font-body text-muted-foreground uppercase tracking-wider">Acoustic</p>
              <p className="text-xs font-body text-foreground">{acousticSignature}</p>
            </div>
          </div>
        </div>

        {/* Serial number footer */}
        <div className="bg-secondary/50 px-4 py-2 flex items-center justify-between border-t border-border">
          <span className="text-[8px] font-body text-muted-foreground tracking-[0.2em] uppercase">
            Archival Serial
          </span>
          <span className="text-[10px] font-body text-foreground font-mono tracking-wider">
            {serialNumber}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default DigitalSpecimenCard;
