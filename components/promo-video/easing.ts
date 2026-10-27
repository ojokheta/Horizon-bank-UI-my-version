export type EasingFn = (t: number) => number;

export const easeInCubic: EasingFn = (t) => t * t * t;
export const easeOutCubic: EasingFn = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic: EasingFn = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeInQuart: EasingFn = (t) => t * t * t * t;
export const easeOutQuart: EasingFn = (t) => 1 - Math.pow(1 - t, 4);
export const easeInOutQuart: EasingFn = (t) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

export const easeInExpo: EasingFn = (t) =>
  t === 0 ? 0 : Math.pow(2, 10 * t - 10);
export const easeOutExpo: EasingFn = (t) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
export const easeInOutExpo: EasingFn = (t) =>
  t === 0
    ? 0
    : t === 1
    ? 1
    : t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2;

export const easeOutBack: EasingFn = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const easeInBack: EasingFn = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return c3 * t * t * t - c1 * t * t;
};

export const easeApple: EasingFn = (t) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - Math.pow(1 - t, 3) * (1 - 0.2 * t);
};

export const bezier =
  (x1: number, y1: number, x2: number, y2: number): EasingFn =>
  (t: number) => {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    const sampleCurveX = (x: number) => ((ax * x + bx) * x + cx) * x;
    const sampleCurveY = (x: number) => ((ay * x + by) * x + cy) * x;
    const sampleCurveDerivativeX = (x: number) =>
      (3 * ax * x + 2 * bx) * x + cx;
    let x = t;
    for (let i = 0; i < 8; i++) {
      const currentX = sampleCurveX(x) - t;
      if (Math.abs(currentX) < 1e-6) break;
      const derivative = sampleCurveDerivativeX(x);
      if (Math.abs(derivative) < 1e-6) break;
      x -= currentX / derivative;
    }
    return sampleCurveY(x);
  };

export const easeAppleKeynote = bezier(0.16, 1, 0.3, 1);
export const easeSmooth = bezier(0.25, 1, 0.5, 1);

export const spring =
  (stiffness = 100, damping = 12, mass = 1): EasingFn =>
  (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    const w0 = Math.sqrt(stiffness / mass);
    const alpha = damping / (2 * Math.sqrt(stiffness * mass));
    const wd = w0 * Math.sqrt(1 - alpha * alpha);
    const a = 1;
    const b = (alpha + 0) / wd;
    const scaledT = t * (5.5 / w0) * 6;
    return (
      1 -
      Math.exp(-alpha * w0 * scaledT) *
        (a * Math.cos(wd * scaledT) + b * Math.sin(wd * scaledT))
    );
  };

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const clamp = (v: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, v));

export const remap = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  easing: EasingFn = (t) => t
) => {
  const t = clamp((v - inMin) / (inMax - inMin));
  return lerp(outMin, outMax, easing(t));
};

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

export const smootherstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

export const fadeIn = (
  frame: number,
  start: number,
  duration: number,
  easing: EasingFn = easeSmooth
) => remap(frame, start, start + duration, 0, 1, easing);

export const fadeOut = (
  frame: number,
  start: number,
  duration: number,
  easing: EasingFn = easeSmooth
) => remap(frame, start, start + duration, 1, 0, easing);

export const fadeInOut = (
  frame: number,
  inStart: number,
  inDur: number,
  outStart: number,
  outDur: number,
  easing: EasingFn = easeSmooth
) => {
  if (frame < inStart) return 0;
  if (frame < inStart + inDur) return fadeIn(frame, inStart, inDur, easing);
  if (frame < outStart) return 1;
  return fadeOut(frame, outStart, outDur, easing);
};

export const stagger = (
  index: number,
  total: number,
  baseStart: number,
  perStepDelay: number,
  perStepDuration: number
) => {
  const start = baseStart + index * perStepDelay;
  const end = start + perStepDuration;
  return { start, end };
};
