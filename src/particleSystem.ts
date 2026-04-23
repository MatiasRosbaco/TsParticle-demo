import type { PixelPosition } from './textSampler';

interface Particle {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  g: number;
  b: number;
  size: number;
}

// Physics constants
const SPRING      = 0.055;
const DAMPING     = 0.87;
const REPULSE_R   = 140;
const REPULSE_F   = 14;
const ATTRACT_R   = 200;
const ATTRACT_F   = 18;

export class ParticleSystem {
  private readonly ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouseX = -9999;
  private mouseY = -9999;
  private attracting = false;
  private rafId = 0;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d', { alpha: true })!;
    this.bindEvents();
  }

  private bindEvents() {
    const move = (cx: number, cy: number) => {
      const r = this.canvas.getBoundingClientRect();
      this.mouseX = cx - r.left;
      this.mouseY = cy - r.top;
    };
    window.addEventListener('mousemove',  e => move(e.clientX, e.clientY));
    window.addEventListener('mousedown',  () => { this.attracting = true; });
    window.addEventListener('mouseup',    () => { this.attracting = false; });
    window.addEventListener('mouseleave', () => { this.mouseX = -9999; this.mouseY = -9999; });
    window.addEventListener('touchmove',  e => { e.preventDefault(); move(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
    window.addEventListener('touchstart', e => { this.attracting = true;  move(e.touches[0].clientX, e.touches[0].clientY); });
    window.addEventListener('touchend',   () => { this.attracting = false; this.mouseX = -9999; this.mouseY = -9999; });
  }

  load(pixels: PixelPosition[]) {
    const { width: w, height: h } = this.canvas;
    this.particles = pixels.map(p => ({
      homeX: p.x, homeY: p.y,
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      r: p.r, g: p.g, b: p.b,
      size: 1.6 + Math.random() * 0.8,
    }));
  }

  private tick() {
    const mx = this.mouseX;
    const my = this.mouseY;
    const att = this.attracting;

    for (const p of this.particles) {
      // Spring toward home position
      p.vx += (p.homeX - p.x) * SPRING;
      p.vy += (p.homeY - p.y) * SPRING;

      // Mouse interaction
      const dx = p.x - mx;
      const dy = p.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      if (att && dist < ATTRACT_R) {
        const t = 1 - dist / ATTRACT_R;
        p.vx -= (dx / dist) * t * t * ATTRACT_F;
        p.vy -= (dy / dist) * t * t * ATTRACT_F;
      } else if (!att && dist < REPULSE_R) {
        const t = 1 - dist / REPULSE_R;
        p.vx += (dx / dist) * t * t * REPULSE_F;
        p.vy += (dy / dist) * t * t * REPULSE_F;
      }

      p.vx *= DAMPING;
      p.vy *= DAMPING;
      p.x  += p.vx;
      p.y  += p.vy;
    }
  }

  private draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      const ddx = p.x - p.homeX;
      const ddy = p.y - p.homeY;
      const scatter = Math.min(1, Math.sqrt(ddx * ddx + ddy * ddy) / 90);

      // Shift color toward hot-white as particle scatters
      const r = Math.round(p.r + (255 - p.r) * scatter * 0.95) | 0;
      const g = Math.round(p.g + (200 - p.g) * scatter * 0.6) | 0;
      const b = Math.round(p.b + (80  - p.b) * scatter * 0.3) | 0;
      const a = 0.7 + scatter * 0.3;

      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
    }
  }

  start() {
    const loop = () => { this.tick(); this.draw(); this.rafId = requestAnimationFrame(loop); };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    cancelAnimationFrame(this.rafId);
  }

  get mouseState(): { x: number; y: number; attracting: boolean } {
    return { x: this.mouseX, y: this.mouseY, attracting: this.attracting };
  }
}
