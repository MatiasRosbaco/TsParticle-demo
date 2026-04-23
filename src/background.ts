import { tsParticles } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

export async function initBackground(): Promise<void> {
  await loadSlim(tsParticles);

  await tsParticles.load({
    id: 'bg-particles',
    options: {
      background: { color: { value: '#00000f' } },
      fpsLimit: 60,
      particles: {
        number: { value: 90, density: { enable: true } },
        color: { value: ['#ffffff', '#4fc3f7', '#ce93d8', '#80cbc4'] },
        opacity: {
          value: { min: 0.02, max: 0.18 },
          animation: { enable: true, speed: 0.4, sync: false },
        },
        size: { value: { min: 0.4, max: 2.2 } },
        move: {
          enable: true,
          speed: 0.18,
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'out' },
        },
        links: {
          enable: true,
          distance: 220,
          color: '#4fc3f7',
          opacity: 0.04,
          width: 0.5,
        },
      },
      interactivity: {
        detectsOn: 'window',
        events: { onHover: { enable: false }, onClick: { enable: false } },
      },
      detectRetina: true,
    },
  });
}
