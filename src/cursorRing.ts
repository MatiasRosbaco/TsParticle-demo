// Draws the influence-radius ring that follows the mouse cursor.
export function startCursorRing(
  canvas: HTMLCanvasElement,
  getState: () => { x: number; y: number; attracting: boolean },
) {
  const ctx = canvas.getContext('2d')!;

  const REPULSE_R = 140;
  const ATTRACT_R = 200;

  let rafId = 0;

  const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { x, y, attracting } = getState();

    if (x < 0 || x > canvas.width) { rafId = requestAnimationFrame(loop); return; }

    const radius = attracting ? ATTRACT_R : REPULSE_R;
    const color  = attracting ? '0,245,255' : '255,80,120';

    // Outer ring
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${color},0.18)`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Inner dot
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = attracting ? 'rgba(0,245,255,0.8)' : 'rgba(255,100,140,0.8)';
    ctx.fill();

    // Radial gradient fill inside ring (very subtle)
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0,   `rgba(${color},0.04)`);
    grad.addColorStop(0.7, `rgba(${color},0.01)`);
    grad.addColorStop(1,   `rgba(${color},0)`);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    rafId = requestAnimationFrame(loop);
  };

  rafId = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(rafId);
}
