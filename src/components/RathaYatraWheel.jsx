import React from "react";

/**
 * Ornate rotating Ratha (Konark-style) chariot wheel.
 * Designed as a hero-section background frame for navy backgrounds.
 *
 * Lovable integration:
 *   <section className="relative overflow-hidden bg-[#1e3a6e]">
 *     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
 *       <RathaYatraWheel className="w-[140%] h-[140%] opacity-[0.18]" />
 *     </div>
 *     <div className="relative z-10"> ...hero content... </div>
 *   </section>
 *
 * Props:
 *   - className        Tailwind / CSS classes for sizing & opacity
 *   - rotationSeconds  Seconds per full revolution (default 90, calm pace)
 *   - reverse          Spin counter-clockwise
 *   - color            Primary gold tone (default brand gold #f4c96b)
 *   - accent           Inner accent (default brand navy #1e3a6e)
 */
const RathaYatraWheel = ({
  className = "",
  rotationSeconds = 90,
  reverse = false,
  color = "#f4c96b",
  accent = "#1e3a6e",
  highlight = "#f8e3a8",
  shadow = "#9c7826",
  uid = "ratha",
}) => {
  // 8 major spokes at every 45°
  const majorSpokes = Array.from({ length: 8 }, (_, i) => (
    <use key={`ms-${i}`} href={`#${uid}-major-spoke`} transform={`rotate(${i * 45})`} />
  ));

  // 8 minor spokes at every 45° offset by 22.5°
  const minorSpokes = Array.from({ length: 8 }, (_, i) => (
    <use key={`mn-${i}`} href={`#${uid}-minor-spoke`} transform={`rotate(${i * 45 + 22.5})`} />
  ));

  // 48 outer beads (every 7.5°), with a slightly larger bead every 6th position
  const outerBeads = Array.from({ length: 48 }, (_, i) => {
    const a = ((i * 360) / 48) * (Math.PI / 180);
    const big = i % 6 === 0;
    return (
      <circle
        key={`ob-${i}`}
        cx={Math.cos(a) * 478}
        cy={Math.sin(a) * 478}
        r={big ? 4 : 2.2}
        fill={color}
      />
    );
  });

  // 24 outer petal scallops
  const outerPetals = Array.from({ length: 24 }, (_, i) => (
    <g key={`op-${i}`} transform={`rotate(${i * 15})`}>
      <path
        d="M432,0 Q446,-9 460,0 Q446,9 432,0 Z"
        fill={color}
        opacity="0.9"
      />
      <circle cx="446" cy="0" r="1.2" fill={accent} />
    </g>
  ));

  // 8 hub lotus petals (oriented along the major spokes)
  const hubPetals = Array.from({ length: 8 }, (_, i) => (
    <g key={`hp-${i}`} transform={`rotate(${i * 45})`}>
      <path
        d="M28,0 Q70,-22 108,-10 Q118,0 108,10 Q70,22 28,0 Z"
        fill={color}
        opacity="0.55"
        stroke={color}
        strokeWidth="0.8"
      />
      <path
        d="M48,0 Q75,-12 100,-5 Q108,0 100,5 Q75,12 48,0 Z"
        fill="none"
        stroke={shadow}
        strokeWidth="0.6"
        opacity="0.8"
      />
    </g>
  ));

  // 8 mid lotus accents in the hub gaps (between petals)
  const hubAccents = Array.from({ length: 8 }, (_, i) => (
    <g key={`ha-${i}`} transform={`rotate(${i * 45 + 22.5})`}>
      <circle cx="95" cy="0" r="3.5" fill={color} />
      <circle cx="95" cy="0" r="1.8" fill={accent} />
    </g>
  ));

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <svg
        viewBox="-500 -500 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          animation: `${uid}-spin ${rotationSeconds}s linear infinite ${reverse ? "reverse" : ""}`,
          transformOrigin: "center",
          willChange: "transform",
        }}
      >
        <defs>
          <radialGradient id={`${uid}-hub-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={highlight} stopOpacity="1" />
            <stop offset="60%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={shadow} stopOpacity="0.2" />
          </radialGradient>

          <linearGradient id={`${uid}-spoke-grad`} x1="0" y1="-1" x2="0" y2="1">
            <stop offset="0%" stopColor={shadow} />
            <stop offset="50%" stopColor={highlight} />
            <stop offset="100%" stopColor={shadow} />
          </linearGradient>

          <radialGradient id={`${uid}-outer-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="80%" stopColor={color} stopOpacity="0" />
            <stop offset="93%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>

          {/* Major sculpted spoke */}
          <symbol id={`${uid}-major-spoke`} overflow="visible">
            {/* Tapered carved body */}
            <path
              d="M130,-16 Q200,-26 270,-30 Q345,-26 420,-18 L420,18 Q345,26 270,30 Q200,26 130,16 Z"
              fill={`url(#${uid}-spoke-grad)`}
              stroke={color}
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
            {/* Transverse carved divisions */}
            <path d="M198,-25 L198,25" stroke={accent} strokeWidth="1" opacity="0.5" />
            <path d="M342,-25 L342,25" stroke={accent} strokeWidth="1" opacity="0.5" />

            {/* Inner ornament jewel (closer to hub) */}
            <ellipse cx="162" cy="0" rx="24" ry="9" fill={accent} opacity="0.7" />
            <ellipse cx="162" cy="0" rx="22" ry="7" fill="none" stroke={color} strokeWidth="0.9" />
            <circle cx="162" cy="0" r="2.5" fill={color} />

            {/* Center medallion (mid-spoke, the eye-catcher) */}
            <circle cx="270" cy="0" r="20" fill={accent} />
            <circle cx="270" cy="0" r="20" fill="none" stroke={color} strokeWidth="1.5" />
            <circle cx="270" cy="0" r="14" fill="none" stroke={color} strokeWidth="0.6" opacity="0.6" />
            <circle cx="270" cy="0" r="6" fill={color} />
            <g stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round">
              <path d="M254,0 L286,0 M270,-16 L270,16" />
              <path d="M258,-12 L282,12 M258,12 L282,-12" opacity="0.5" />
            </g>

            {/* Outer ornament jewel (closer to rim) */}
            <ellipse cx="385" cy="0" rx="28" ry="11" fill={accent} opacity="0.7" />
            <ellipse cx="385" cy="0" rx="26" ry="9" fill="none" stroke={color} strokeWidth="0.9" />
            <circle cx="385" cy="0" r="3.5" fill={color} />

            {/* Center highlight glints */}
            <line x1="135" y1="0" x2="142" y2="0" stroke={highlight} strokeWidth="1.2" opacity="0.7" />
            <line x1="416" y1="0" x2="420" y2="0" stroke={highlight} strokeWidth="1.2" opacity="0.7" />
          </symbol>

          {/* Minor (secondary) spoke */}
          <symbol id={`${uid}-minor-spoke`} overflow="visible">
            <path
              d="M135,-6 Q270,-11 415,-7 L415,7 Q270,11 135,6 Z"
              fill={color}
              opacity="0.85"
            />
            <circle cx="275" cy="0" r="9" fill={accent} />
            <circle cx="275" cy="0" r="9" fill="none" stroke={color} strokeWidth="1.2" />
            <circle cx="275" cy="0" r="2.5" fill={color} />
            <line x1="140" y1="0" x2="262" y2="0" stroke={shadow} strokeWidth="0.5" opacity="0.5" />
            <line x1="288" y1="0" x2="412" y2="0" stroke={shadow} strokeWidth="0.5" opacity="0.5" />
          </symbol>
        </defs>

        {/* Atmospheric outer glow */}
        <circle r="500" fill={`url(#${uid}-outer-glow)`} />

        {/* Outer beaded ring */}
        {outerBeads}

        {/* Outer rim lines */}
        <circle r="468" fill="none" stroke={color} strokeWidth="1.5" opacity="0.75" />
        <circle r="455" fill="none" stroke={color} strokeWidth="0.5" opacity="0.4" />

        {/* Outer petal scallops */}
        {outerPetals}

        {/* Main rim */}
        <circle r="425" fill="none" stroke={color} strokeWidth="3" />
        <circle r="420" fill="none" stroke={color} strokeWidth="0.5" opacity="0.5" />

        {/* Spokes — minor first (behind), major on top */}
        {minorSpokes}
        {majorSpokes}

        {/* Hub outer ring */}
        <circle r="128" fill={accent} stroke={color} strokeWidth="2" />
        <circle r="123" fill="none" stroke={color} strokeWidth="0.5" opacity="0.6" />

        {/* Hub accents (small jewels between lotus petals) */}
        {hubAccents}

        {/* Hub lotus petals */}
        {hubPetals}

        {/* Inner hub circles */}
        <circle r="48" fill={`url(#${uid}-hub-glow)`} />
        <circle r="48" fill="none" stroke={color} strokeWidth="1.5" />
        <circle r="24" fill={accent} />
        <circle r="24" fill="none" stroke={color} strokeWidth="1" />
        <circle r="10" fill={color} />
        <circle r="4" fill={accent} />
      </svg>

      <style>{`
        @keyframes ${uid}-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-ratha-wheel] svg { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default RathaYatraWheel;
