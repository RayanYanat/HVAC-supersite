"use client";
import { useEffect, useRef } from "react";

/* ─── Types ──────────────────────────────────────────────── */
type ParticleTier = "ember" | "plume" | "streak";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  opacity: number;
  life: number; maxLife: number;
  r: number; g: number; b: number;
  phase: number;
  tier: ParticleTier;
  column: number; // 0-1, attraction toward heat column
}

/* ─── Heat columns (x as fraction of width) ─────────────── */
const COLUMNS = [0.18, 0.52, 0.82];

/* ─── Color palette in RGB ───────────────────────────────── */
const PALETTE = [
  [255, 107, 26],   // brand orange
  [255, 133, 52],   // amber
  [255, 80, 10],    // deep orange
  [255, 160, 60],   // warm amber
  [196, 66, 10],    // dark ember
];

function spawnParticle(w: number, h: number, noStreak = false, noPlume = false): Particle {
  const rand = Math.random();
  const tier: ParticleTier =
    noPlume  ? "ember" :
    noStreak ? (rand < 0.35 ? "plume" : "ember") :
    rand < 0.06 ? "streak" : rand < 0.28 ? "plume" : "ember";

  const col = COLUMNS[Math.floor(Math.random() * COLUMNS.length)];
  const spread = tier === "plume" ? 0.18 : 0.09;
  const baseX = col * w + (Math.random() - 0.5) * w * spread;

  const cfg: Record<ParticleTier, { size: [number, number]; vy: [number, number]; life: [number, number] }> = {
    ember:  { size: [2, 8],     vy: [0.6, 1.6],  life: [90,  160] },
    plume:  { size: [60, 160],  vy: [0.2, 0.55], life: [220, 380] },
    streak: { size: [1, 2],     vy: [0.0, 0.1],  life: [30,  70]  },
  };
  const c = cfg[tier];
  const [r, g, b] = PALETTE[Math.floor(Math.random() * PALETTE.length)];

  return {
    x: tier === "streak" ? 0 : baseX,
    y: tier === "streak" ? Math.random() * h * 0.6 : h + 10,
    vx: tier === "streak" ? 3 + Math.random() * 5 : 0,
    vy: -(c.vy[0] + Math.random() * (c.vy[1] - c.vy[0])),
    size: c.size[0] + Math.random() * (c.size[1] - c.size[0]),
    opacity: 0, life: 0,
    maxLife: c.life[0] + Math.random() * (c.life[1] - c.life[0]),
    r, g, b,
    phase: Math.random() * Math.PI * 2,
    tier,
    column: col,
  };
}

/* ─── Component ──────────────────────────────────────────── */
export default function ThermalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf: number;
    let time = 0;
    let particles: Particle[] = [];
    const dpr      = Math.min(window.devicePixelRatio ?? 1, 2);
    const isMobile = window.innerWidth < 768;
    /* On mobile: embers only (no plumes = no large blurry blobs),
     * faster ghost-trail clear so traces feel crisp rather than hazy. */
    const ghostAlpha = isMobile ? 0.28 : 0.13;

    /* ── Setup ── */
    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    const init = () => {
      resize();
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const N = isMobile ? 30 : 110;
      particles = Array.from({ length: N }, () => {
        const p = spawnParticle(w, h, isMobile, isMobile);
        p.y = Math.random() * h;
        p.life = Math.random() * p.maxLife * 0.7;
        return p;
      });
    };

    /* ── Frame ── */
    const frame = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      time += 0.007;

      /* Ghost trail — partial clear creates motion blur / persistence.
         Higher alpha on mobile = faster clear = crisper, less hazy look. */
      ctx.fillStyle = `rgba(10,12,15,${ghostAlpha})`;
      ctx.fillRect(0, 0, w, h);

      /* Ambient pulsing glow at each heat column */
      COLUMNS.forEach((col, i) => {
        const cx = col * w;
        const cy = h * 0.72;
        const pulse = Math.sin(time * 0.8 + i * 2.1) * 0.5 + 0.5;
        const r = h * (0.45 + pulse * 0.08);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0,   `rgba(255,107,26,${0.045 + pulse * 0.03})`);
        grad.addColorStop(0.35,`rgba(196, 66,10,${0.018 + pulse * 0.012})`);
        grad.addColorStop(1,   "rgba(10,12,15,0)");
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      /* Update & draw particles */
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 1;

        if (p.life >= p.maxLife) {
          particles[i] = spawnParticle(w, h, isMobile, isMobile);
          continue;
        }

        const progress = p.life / p.maxLife;

        /* Opacity envelope */
        let env: number;
        if (progress < 0.15)      env = progress / 0.15;
        else if (progress > 0.65) env = 1 - (progress - 0.65) / 0.35;
        else                      env = 1;

        const maxAlpha =
          p.tier === "plume"  ? 0.055 :
          p.tier === "streak" ? 0.55  : 0.7;
        p.opacity = env * maxAlpha;

        if (p.opacity < 0.004) continue;

        /* Movement */
        if (p.tier === "streak") {
          p.x += p.vx;
          if (p.x > w + 50) { particles[i] = spawnParticle(w, h, isMobile, isMobile); continue; }
        } else {
          /* Column attraction + sinusoidal drift */
          const colX = p.column * w;
          const attract = (colX - p.x) * 0.0006;
          const sway = Math.sin(time * 0.9 + p.phase + p.y * 0.009) * 0.35
                     + Math.cos(time * 0.4 + p.phase * 1.4) * 0.15;
          p.vx += attract + (sway - p.vx) * 0.04;
          p.x += p.vx;
          p.y += p.vy;
          /* Subtle turbulence — increases near top */
          p.x += Math.sin(time * 2 + p.phase * 3) * 0.08 * (1 - progress);
        }

        /* Draw */
        if (p.tier === "ember") {
          /* Bright core + soft halo */
          const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          halo.addColorStop(0,   `rgba(${p.r},${p.g},${p.b},${p.opacity})`);
          halo.addColorStop(0.3, `rgba(${p.r},${p.g},${p.b},${p.opacity * 0.5})`);
          halo.addColorStop(1,   `rgba(${p.r},${p.g},${p.b},0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.fill();
          /* Solid core */
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,200,120,${p.opacity * 0.9})`;
          ctx.fill();

        } else if (p.tier === "plume") {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0,   `rgba(${p.r},${p.g},${p.b},${p.opacity})`);
          grad.addColorStop(0.5, `rgba(${p.r},${p.g},${p.b},${p.opacity * 0.3})`);
          grad.addColorStop(1,   `rgba(${p.r},${p.g},${p.b},0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

        } else {
          /* Streak — horizontal line */
          const len = 40 + Math.random() * 80;
          const grad = ctx.createLinearGradient(p.x - len, p.y, p.x, p.y);
          grad.addColorStop(0,   `rgba(${p.r},${p.g},${p.b},0)`);
          grad.addColorStop(0.6, `rgba(255,200,140,${p.opacity})`);
          grad.addColorStop(1,   `rgba(255,200,140,0)`);
          ctx.beginPath();
          ctx.moveTo(p.x - len, p.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = p.size;
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(frame);
    };

    init();
    frame();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}
