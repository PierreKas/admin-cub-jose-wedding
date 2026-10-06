import React, { useMemo } from "react";

const PETAL_COUNT = 26;
const COLORS = ["bg-accent", "bg-beige-dark", "bg-cream"];

/**
 * Purely decorative falling-petals effect for the public invitation page -
 * `pointer-events-none` + `fixed` so it never blocks clicks/scrolling, just
 * drifts over everything. The @keyframes (`petal-fall`) live in index.css.
 * Randomized once per mount via useMemo, not re-rolled on every render.
 */
const FlowerRain = () => {
  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 8 + Math.random() * 10,
        duration: 9 + Math.random() * 8,
        delay: -Math.random() * 16,
        drift: Math.round((Math.random() - 0.5) * 160),
        color: COLORS[i % COLORS.length],
        rotate: Math.round(Math.random() * 360),
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-20" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className={`absolute top-0 rounded-tl-full rounded-br-full opacity-70 ${p.color}`}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.7,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
            "--petal-drift": `${p.drift}px`,
            "--petal-rotate": `${p.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
};

export default FlowerRain;
