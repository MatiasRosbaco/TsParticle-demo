import './style.css';
import { initBackground } from './background';
import { ParticleSystem } from './particleSystem';
import { startCursorRing } from './cursorRing';
import { sampleTextPixels, type TextLayer } from './textSampler';

async function boot() {
  await initBackground();

  const textCanvas   = document.getElementById('text-canvas')   as HTMLCanvasElement;
  const cursorCanvas = document.getElementById('cursor-canvas') as HTMLCanvasElement;

  const resize = () => {
    textCanvas.width    = window.innerWidth;
    textCanvas.height   = window.innerHeight;
    cursorCanvas.width  = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
  };
  resize();

  // Wait for Google Fonts (Orbitron) to be ready before pixel-sampling
  await document.fonts.ready;

  const w = textCanvas.width;
  const h = textCanvas.height;

  // Responsive font sizes
  const fs1 = Math.min(170, Math.floor(w * 0.12));    // Name
  const fs2 = Math.min(46,  Math.floor(w * 0.038));   // Subtitle row 1
  const fs3 = Math.min(42,  Math.floor(w * 0.034));   // Subtitle row 2
  const fs4 = Math.min(24,  Math.floor(w * 0.02));    // Services

  const layers: TextLayer[] = [
    {
      text: 'TsParticle',
      font: `900 ${fs1}px 'Orbitron', monospace`,
      y: Math.round(h * 0.34),
      colorStops: [
        { stop: 0,    color: '#00f5ff' },
        { stop: 0.45, color: '#b44fff' },
        { stop: 1,    color: '#ff2d78' },
      ],
    },
    {
      text: 'DESARROLLADOR  ·  DIAGNÓSTICO',
      font: `700 ${fs2}px 'Orbitron', monospace`,
      y: Math.round(h * 0.525),
      colorStops: [
        { stop: 0, color: '#80deea' },
        { stop: 1, color: '#ce93d8' },
      ],
    },
    {
      text: 'MANTENIMIENTO  ·  OPTIMIZACIÓN',
      font: `700 ${fs3}px 'Orbitron', monospace`,
      y: Math.round(h * 0.615),
      colorStops: [
        { stop: 0, color: '#80cbc4' },
        { stop: 1, color: '#9575cd' },
      ],
    },
    {
      text: 'RENDIMIENTO  ·  SEGURIDAD  ·  SOLUCIONES',
      font: `400 ${fs4}px 'Orbitron', monospace`,
      y: Math.round(h * 0.705),
      colorStops: [
        { stop: 0, color: '#4fc3f7' },
        { stop: 1, color: '#a5d6a7' },
      ],
    },
  ];

  // Sampling density per layer (smaller step = more particles)
  const pixels = sampleTextPixels(layers, w, h, 4);

  const sys = new ParticleSystem(textCanvas);
  sys.load(pixels);
  sys.start();

  startCursorRing(cursorCanvas, () => sys.mouseState);

  // On resize, reload the page to re-sample at new dimensions
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => location.reload(), 400);
  });
}

boot();
