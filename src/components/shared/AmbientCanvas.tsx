"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vy: number; vx: number;
  size: number;
  life: number; maxLife: number;
  phase: number;
}

function clamp(v: number, lo: number, hi: number) { return Math.min(Math.max(v, lo), hi); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * clamp(t, 0, 1); }

function spawn(vw: number, vh: number, mobile = false): Particle {
  return {
    x:       Math.random() * vw,
    y:       vh + 40,
    vy:      -(0.03 + Math.random() * 0.10),
    vx:      0,
    // Mobile: smaller blobs (60–160px) to cut radial-gradient fill cost.
    // Desktop: full (150–410px) for rich atmospheric depth.
    size:    mobile ? (60 + Math.random() * 100) : (150 + Math.random() * 260),
    life:    0,
    maxLife: 700 + Math.random() * 600,
    phase:   Math.random() * Math.PI * 2,
  };
}

export default function AmbientCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf: number;
    let time = 0;

    // Mobile gets fewer, smaller particles to stay within GPU budget.
    // DPR is intentionally ignored — soft particle blobs don't need
    // retina resolution, and drawing at logical pixels is a free
    // performance win on high-DPR mobile screens.
    const isMobile = window.innerWidth < 768;
    const N        = isMobile ? 8 : 26;

    let particles: Particle[] = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    particles = Array.from({ length: N }, () => {
      const p = spawn(window.innerWidth, window.innerHeight, isMobile);
      p.y    = Math.random() * window.innerHeight;
      p.life = Math.random() * p.maxLife * 0.6;
      return p;
    });

    const frame = () => {
      time += 0.003;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const maxScroll = Math.max(1, document.body.scrollHeight - vh);
      const ratio     = clamp(window.scrollY / maxScroll, 0, 1);

      const r = Math.round(lerp(255, 56,  ratio));
      const g = Math.round(lerp(107, 189, ratio));
      const b = Math.round(lerp(26,  248, ratio));

      ctx.fillStyle = "rgba(10,12,15,0.055)";
      ctx.fillRect(0, 0, vw, vh);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 1;

        if (p.life >= p.maxLife || p.y < -p.size) {
          particles[i] = spawn(vw, vh, isMobile);
          continue;
        }

        p.vx = Math.sin(time * 0.3 + p.phase + p.y * 0.003) * 0.38;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -p.size)     p.x = vw + p.size;
        if (p.x > vw + p.size) p.x = -p.size;

        const prog  = p.life / p.maxLife;
        const env   = prog < 0.12 ? prog / 0.12 : prog > 0.72 ? 1 - (prog - 0.72) / 0.28 : 1;
        const alpha = env * 0.10;

        if (alpha < 0.004) continue;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0,    `rgba(${r},${g},${b},${alpha})`);
        grad.addColorStop(0.42, `rgba(${r},${g},${b},${alpha * 0.3})`);
        grad.addColorStop(1,    `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };

    frame();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden
    />
  );
}
