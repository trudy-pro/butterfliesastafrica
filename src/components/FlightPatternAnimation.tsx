import { useEffect, useRef } from "react";
import { FlightStyleInfo, FlightStyle } from "@/data/flightStyles";

interface FlightPatternAnimationProps {
  styles: FlightStyleInfo[];
}

/**
 * Attempt to draw in slow-motion the characteristic flight path
 * for each flight style. Uses a tiny canvas with a trailing dot.
 */

type PathFn = (t: number) => { x: number; y: number };

/** Each style maps to a parametric path function (t ∈ [0,1]) */
function getPathFn(style: FlightStyle, w: number, h: number): PathFn {
  const cx = w / 2;
  const cy = h / 2;
  const rx = w * 0.38;
  const ry = h * 0.28;

  switch (style) {
    case "glider":
      // Smooth, gentle sine wave — long horizontal sweeps
      return (t) => ({
        x: t * w * 0.9 + w * 0.05,
        y: cy + Math.sin(t * Math.PI * 2) * ry * 0.4,
      });

    case "soaring":
      // Upward spiral / thermal circle
      return (t) => ({
        x: cx + Math.cos(t * Math.PI * 4) * rx * (1 - t * 0.4),
        y: cy - t * h * 0.35 + Math.sin(t * Math.PI * 4) * ry * 0.3,
      });

    case "floater":
      // Gentle, lazy drift with tiny oscillations
      return (t) => ({
        x: w * 0.15 + t * w * 0.7,
        y: cy + Math.sin(t * Math.PI * 3) * ry * 0.2 + Math.cos(t * Math.PI * 7) * 3,
      });

    case "dipping":
      // Deep undulating waves
      return (t) => ({
        x: t * w * 0.9 + w * 0.05,
        y: cy + Math.sin(t * Math.PI * 4) * ry * 0.7,
      });

    case "skipper":
      // Short hops — staccato jumps with flat segments
      return (t) => {
        const seg = t * 5;
        const frac = seg % 1;
        const jump = frac < 0.4 ? Math.sin(frac / 0.4 * Math.PI) : 0;
        return {
          x: t * w * 0.9 + w * 0.05,
          y: cy - jump * ry * 0.6 + Math.floor(seg) * 2,
        };
      };

    case "fast-flyer":
      // Straight, powerful trajectory with slight vibration
      return (t) => ({
        x: t * w * 0.9 + w * 0.05,
        y: cy + Math.sin(t * Math.PI * 12) * 3 - t * h * 0.1,
      });

    case "erratic":
      // Zig-zag chaotic path
      return (t) => {
        const zigzag = ((t * 7) % 1) < 0.5 ? -1 : 1;
        return {
          x: t * w * 0.9 + w * 0.05,
          y: cy + zigzag * ry * 0.5 * Math.sin(t * Math.PI * 3),
        };
      };

    case "buzzer":
      // Tight, rapid figure-eight
      return (t) => ({
        x: cx + Math.sin(t * Math.PI * 4) * rx * 0.5,
        y: cy + Math.sin(t * Math.PI * 8) * ry * 0.35,
      });

    default:
      return (t) => ({
        x: t * w * 0.9 + w * 0.05,
        y: cy + Math.sin(t * Math.PI * 2) * ry * 0.3,
      });
  }
}

const DURATION_MS = 4000; // slow-motion
const TRAIL_LENGTH = 40;

const FlightPatternAnimation = ({ styles }: FlightPatternAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const primaryStyle = styles[0]?.style ?? "floater";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const pathFn = getPathFn(primaryStyle, w, h);
    let startTime: number | null = null;

    // Get CSS custom property values for theming
    const computedStyle = getComputedStyle(canvas);
    const primaryColor = computedStyle.getPropertyValue("--primary").trim();
    const mutedColor = computedStyle.getPropertyValue("--muted-foreground").trim();

    const dotColor = primaryColor
      ? `hsl(${primaryColor})`
      : "#8b7355";
    const trailColor = mutedColor
      ? `hsl(${mutedColor})`
      : "#999";

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = (elapsed % DURATION_MS) / DURATION_MS;

      ctx.clearRect(0, 0, w, h);

      // Draw faint full path
      ctx.beginPath();
      ctx.strokeStyle = trailColor;
      ctx.globalAlpha = 0.12;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 200; i++) {
        const pt = pathFn(i / 200);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      // Draw trail
      ctx.globalAlpha = 1;
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const trailT = t - (TRAIL_LENGTH - i) / TRAIL_LENGTH * 0.12;
        if (trailT < 0) continue;
        const pt = pathFn(trailT % 1);
        const alpha = (i / TRAIL_LENGTH) * 0.5;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.globalAlpha = alpha;
        ctx.fill();
      }

      // Draw main dot
      const pos = pathFn(t);
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.globalAlpha = 0.2;
      ctx.fill();

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animRef.current);
  }, [primaryStyle]);

  return (
    <div className="mb-6">
      <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">
        Flight Pattern
      </h3>
      <div className="rounded-sm border border-border bg-card overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: 100 }}
        />
        <div className="px-4 py-2 border-t border-border">
          <p className="text-[11px] font-body text-muted-foreground">
            <span className="text-foreground font-medium">{styles[0]?.label}</span>
            {" — "}
            {styles[0]?.shortDesc}
            {styles.length > 1 && (
              <span className="ml-1 text-muted-foreground/70">
                · also {styles.slice(1).map(s => s.label.toLowerCase()).join(", ")}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlightPatternAnimation;
