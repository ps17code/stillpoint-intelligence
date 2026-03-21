"use client";

// Reusable SVG shapes for spine and anchor nodes

export function CubeShape({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.79} viewBox="0 0 28 22" fill="none">
      <defs>
        <linearGradient id="ct" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e4d8b8" /><stop offset="100%" stopColor="#bfaa78" />
        </linearGradient>
        <linearGradient id="cf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a89060" /><stop offset="100%" stopColor="#7a6840" />
        </linearGradient>
        <linearGradient id="cs" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8c7a50" /><stop offset="100%" stopColor="#6a5a34" />
        </linearGradient>
      </defs>
      <polygon points="0,6 0,18 14,22 14,10" fill="url(#cf)" />
      <polygon points="14,10 14,22 28,18 28,6" fill="url(#cs)" />
      <polygon points="0,6 14,0 28,6 14,10" fill="url(#ct)" />
      <line x1="0" y1="6" x2="14" y2="0" stroke="rgba(255,255,255,0.45)" strokeWidth="0.7" />
      <line x1="14" y1="0" x2="28" y2="6" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
    </svg>
  );
}

export function SphereShape({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 26 22" fill="none">
      <defs>
        <radialGradient id="sg" cx="36%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#ece0c4" />
          <stop offset="42%" stopColor="#b8a46c" />
          <stop offset="100%" stopColor="#5c5030" />
        </radialGradient>
      </defs>
      <circle cx="13" cy="11" r="11" fill="url(#sg)" />
      <ellipse cx="8" cy="6" rx="4" ry="3" fill="rgba(255,255,255,0.26)" transform="rotate(-15,8,6)" />
      <path d="M 13 0 A 11 11 0 0 1 24 11 A 11 11 0 0 1 13 22 A 11 11 0 0 0 13 0 Z" fill="rgba(0,0,0,0.09)" />
    </svg>
  );
}

export function PyramidShape({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.79} viewBox="0 0 28 22" fill="none">
      <defs>
        <linearGradient id="pf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#caba88" /><stop offset="100%" stopColor="#7a6840" />
        </linearGradient>
        <linearGradient id="pl" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#8c7a50" /><stop offset="100%" stopColor="#5c4e2c" />
        </linearGradient>
        <linearGradient id="pr" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a89060" /><stop offset="100%" stopColor="#caba88" />
        </linearGradient>
      </defs>
      <ellipse cx="14" cy="19" rx="14" ry="3" fill="#7a6840" />
      <polygon points="0,19 14,0 14,22" fill="url(#pl)" />
      <polygon points="28,19 14,0 14,22" fill="url(#pr)" />
      <polygon points="0,19 28,19 14,0" fill="url(#pf)" />
      <circle cx="14" cy="0" r="0.8" fill="rgba(255,255,255,0.45)" />
    </svg>
  );
}

export function CylinderShape({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.79} viewBox="0 0 28 22" fill="none">
      <defs>
        <linearGradient id="cy" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6a5a34" />
          <stop offset="20%" stopColor="#a89060" />
          <stop offset="58%" stopColor="#caba88" />
          <stop offset="82%" stopColor="#a89060" />
          <stop offset="100%" stopColor="#7a6840" />
        </linearGradient>
      </defs>
      <rect x="0" y="3" width="28" height="16" fill="url(#cy)" />
      <rect x="0" y="3" width="4" height="16" fill="rgba(0,0,0,0.10)" />
      <rect x="24" y="3" width="4" height="16" fill="rgba(0,0,0,0.06)" />
      <ellipse cx="14" cy="19" rx="14" ry="4" fill="#7a6840" />
      <ellipse cx="14" cy="3" rx="14" ry="4" fill="#d8c898" />
      <ellipse cx="11" cy="2" rx="6" ry="1.8" fill="rgba(255,255,255,0.22)" transform="rotate(-8,11,2)" />
    </svg>
  );
}
