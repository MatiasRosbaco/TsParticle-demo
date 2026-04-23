export interface PixelPosition {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
}

export interface TextLayer {
  text: string;
  font: string;
  y: number;
  colorStops: Array<{ stop: number; color: string }>;
}

export function sampleTextPixels(
  layers: TextLayer[],
  width: number,
  height: number,
  step: number,
): PixelPosition[] {
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const ctx = off.getContext('2d')!;

  for (const layer of layers) {
    ctx.save();
    ctx.font = layer.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const metrics = ctx.measureText(layer.text);
    const hw = metrics.width / 2;
    const cx = width / 2;

    const grad = ctx.createLinearGradient(cx - hw, layer.y, cx + hw, layer.y);
    for (const s of layer.colorStops) grad.addColorStop(s.stop, s.color);

    ctx.fillStyle = grad;
    ctx.fillText(layer.text, cx, layer.y);
    ctx.restore();
  }

  const { data } = ctx.getImageData(0, 0, width, height);
  const out: PixelPosition[] = [];

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * 4;
      if (data[i + 3] > 100) {
        out.push({ x, y, r: data[i], g: data[i + 1], b: data[i + 2] });
      }
    }
  }

  return out;
}
