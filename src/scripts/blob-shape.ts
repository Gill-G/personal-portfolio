/*
 * Blob geometry, shared by the build (static project art) and the browser (the
 * animated hero blob).
 *
 * How it works: place N points around a circle, push each one in or out a little
 * (the "wobble"), then join them with a smooth closed curve. Changing the wobble
 * over time makes the shape morph.
 */

const SIZE = 200; // Every blob is drawn in a 200 x 200 SVG viewBox.
const CENTER = SIZE / 2;

type Point = [number, number];

/** Joins points into a smooth closed SVG path (Catmull-Rom converted to Bezier curves). */
function smoothClosedPath(points: Point[]): string {
  const n = points.length;
  let d = `M${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`;

  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];

    // Control points pull the curve toward its neighbours so there are no corners.
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }

  return `${d} Z`;
}

/**
 * Returns the blob's SVG path at a moment in time.
 * @param seed  Any number. Different seeds give different shapes.
 * @param time  Seconds. Keep it at 0 for a static shape.
 */
export function blobPath(seed: number, time = 0, points = 8): string {
  const radius = SIZE * 0.36;
  const coords: Point[] = [];

  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    // Two sine waves at different speeds give a slow, organic, never-repeating wobble.
    const wobble =
      0.14 * Math.sin(time * 0.55 + i * 1.7 + seed) +
      0.08 * Math.sin(time * 0.9 + i * 2.9 + seed * 2.3);
    const r = radius * (1 + wobble);
    coords.push([CENTER + Math.cos(angle) * r, CENTER + Math.sin(angle) * r]);
  }

  return smoothClosedPath(coords);
}
