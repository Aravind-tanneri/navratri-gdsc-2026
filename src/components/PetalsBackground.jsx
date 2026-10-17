import React, { useMemo } from "react";

export const PetalsBackground = () => {
  // Generate 18 subtle petals with varied positions, delays and sizes
  const petals = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${(i * 5.5 + Math.random() * 3) % 96}%`,
      animationDuration: `${7 + (i % 6) * 1.5}s`,
      animationDelay: `${(i * 0.45).toFixed(1)}s`,
      size: 16 + (i % 4) * 5,
      color: i % 2 === 0 ? "#f59e0b" : "#f97316", // Marigold & saffron tones
      opacity: 0.25 + (i % 3) * 0.15,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: p.left,
            top: "-30px",
            animation: `petal-fall ${p.animationDuration} linear infinite`,
            animationDelay: p.animationDelay,
            opacity: p.opacity,
          }}
        >
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform rotate-12"
          >
            {/* Delicate marigold petal shape */}
            <path
              d="M12 2C8 6 4 11 4 15C4 19.4183 7.58172 22 12 22C16.4183 22 20 19.4183 20 15C20 11 16 6 12 2Z"
              fill={p.color}
            />
            <path
              d="M12 4C10 8 8 12 8 15"
              stroke="#fef08a"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
