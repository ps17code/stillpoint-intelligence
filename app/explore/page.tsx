"use client";
import React, { useState } from "react";

const MONO: React.CSSProperties = { fontFamily: "'Geist Mono', 'Courier New', monospace" };
const SYS: React.CSSProperties = { fontFamily: "Inter, -apple-system, system-ui, sans-serif" };

/* ─── Vertical data ─── */
interface Vertical {
  name: string;
  description: string;
  href: string;
  live: boolean;
}

const VERTICALS: Vertical[] = [
  {
    name: "AI Infrastructure",
    description:
      "The complete supply chain map for AI — from the minerals in the ground to the datacenters they power. Where the constraints are, who controls them, and what breaks first.",
    href: "/",
    live: true,
  },
  {
    name: "Energy Transition",
    description:
      "Batteries, solar, wind, grid, and hydrogen — the materials and manufacturing bottlenecks shaping the pace of decarbonization.",
    href: "#",
    live: false,
  },
  {
    name: "UAVs",
    description:
      "Sensors, propulsion, communications, and autonomy — the supply chains behind commercial and defense drone systems.",
    href: "#",
    live: false,
  },
  {
    name: "Robotics",
    description:
      "Motors, sensors, compute, and structure — every physical input that determines who can build robots at scale and who can\u2019t.",
    href: "#",
    live: false,
  },
  {
    name: "Space",
    description:
      "Launch vehicles, satellites, and ground systems — from carbon fiber to cryogenics to the optics that connect constellations.",
    href: "#",
    live: false,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   ILLUSTRATIONS
   ───────────────────────────────────────────────────────────────────────────── */

function AIInfraIllustration() {
  const S = "rgba(155,168,171,"; // structural
  const G = "rgba(196,164,108,"; // gold/fiber accent
  const LED_G = "rgba(100,200,140,"; // green LEDs
  const LED_A = "rgba(196,164,108,"; // amber LEDs
  return (
    <svg viewBox="0 0 260 400" style={{ width: "100%", maxWidth: 260, height: "auto" }}>
      {/* Fiber tray */}
      <line x1="40" y1="30" x2="200" y2="30" stroke={`${G}0.25)`} strokeWidth="0.5"/>
      <path d="M60,30 Q30,30 20,20" fill="none" stroke={`${G}0.3)`} strokeWidth="0.5"/>
      <path d="M70,30 Q35,28 15,14" fill="none" stroke={`${G}0.25)`} strokeWidth="0.5"/>
      <path d="M80,30 Q40,26 10,8" fill="none" stroke={`${G}0.2)`} strokeWidth="0.5"/>
      {/* Drop line into rack */}
      <line x1="130" y1="30" x2="130" y2="48" stroke={`${G}0.2)`} strokeWidth="0.5" strokeDasharray="2 3"/>

      {/* Main rack frame */}
      <rect x="70" y="48" width="120" height="300" rx="4" fill="rgba(255,255,255,0.02)" stroke={`${S}0.35)`} strokeWidth="0.75"/>

      {/* Top vents */}
      {[56, 60, 64].map(y => (
        <line key={y} x1="82" y1={y} x2="178" y2={y} stroke={`${S}0.12)`} strokeWidth="0.5"/>
      ))}

      {/* 8 server units */}
      {Array.from({ length: 8 }, (_, i) => {
        const y = 72 + i * 32;
        return (
          <g key={i}>
            <rect x="78" y={y} width="104" height="26" rx="2" fill="rgba(255,255,255,0.03)" stroke={`${S}0.3)`} strokeWidth="0.5"/>
            {/* GPU modules */}
            {[0, 1, 2, 3].map(j => (
              <rect key={j} x={82 + j * 22} y={y + 4} width="18" height="12" rx="1" fill="rgba(100,150,200,0.06)" stroke="rgba(100,150,200,0.2)" strokeWidth="0.5"/>
            ))}
            {/* LEDs */}
            <circle cx="174" cy={y + 8} r="1.5" fill={`${LED_G}0.6)`}/>
            <circle cx="174" cy={y + 15} r="1.5" fill={i === 3 || i === 6 ? `${LED_A}0.5)` : `${LED_G}0.5)`}/>
            {/* Fiber out right */}
            <line x1="182" y1={y + 13} x2="200" y2={y + 13} stroke={`${G}0.2)`} strokeWidth="0.5"/>
            <circle cx="200" cy={y + 13} r="1" fill={`${G}0.3)`}/>
          </g>
        );
      })}

      {/* Dual PSUs */}
      {[0, 1].map(i => {
        const x = 80 + i * 52;
        return (
          <g key={i}>
            <rect x={x} y="330" width="44" height="14" rx="1.5" fill="rgba(255,255,255,0.025)" stroke={`${S}0.25)`} strokeWidth="0.5"/>
            <line x1={x + 6} y1="334" x2={x + 38} y2="334" stroke={`${S}0.1)`} strokeWidth="0.5"/>
            <line x1={x + 6} y1="338" x2={x + 38} y2="338" stroke={`${S}0.1)`} strokeWidth="0.5"/>
            <circle cx={x + 38} cy="336" r="1.2" fill={`${LED_G}0.5)`}/>
          </g>
        );
      })}

      {/* Cooling pipe left */}
      <line x1="66" y1="55" x2="66" y2="340" stroke="rgba(100,150,200,0.15)" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Power cables out bottom */}
      <path d="M100,344 L100,370 Q100,380 90,380" fill="none" stroke={`${S}0.2)`} strokeWidth="0.75"/>
      <path d="M160,344 L160,370 Q160,380 170,380" fill="none" stroke={`${S}0.2)`} strokeWidth="0.75"/>

      {/* Heat shimmer */}
      {[110, 125, 140, 155].map((x, i) => (
        <path key={i} d={`M${x},46 Q${x + 3},36 ${x},26 Q${x - 3},16 ${x},6`} fill="none" stroke={`${S}${0.06 + i * 0.01})`} strokeWidth="0.5"/>
      ))}

      {/* Floor */}
      <line x1="40" y1="352" x2="220" y2="352" stroke={`${S}0.1)`} strokeWidth="0.5"/>
    </svg>
  );
}

function EnergyIllustration() {
  const S = "rgba(155,168,171,";
  const G = "rgba(196,164,108,";
  const B = "rgba(100,150,200,";
  const GR = "rgba(100,200,140,";
  return (
    <svg viewBox="0 0 260 400" style={{ width: "100%", maxWidth: 260, height: "auto" }}>
      {/* Wind turbine tower */}
      <line x1="80" y1="350" x2="80" y2="120" stroke={`${S}0.4)`} strokeWidth="1"/>
      {/* Nacelle */}
      <rect x="72" y="112" width="16" height="8" rx="2" fill="rgba(255,255,255,0.04)" stroke={`${S}0.4)`} strokeWidth="0.5"/>
      {/* Hub */}
      <circle cx="80" cy="116" r="3" fill="rgba(255,255,255,0.04)" stroke={`${S}0.45)`} strokeWidth="0.5"/>
      <circle cx="80" cy="116" r="1" fill={`${S}0.3)`}/>
      {/* Blades */}
      <line x1="80" y1="116" x2="80" y2="54" stroke={`${S}0.35)`} strokeWidth="0.75"/>
      <line x1="80" y1="116" x2="134" y2="147" stroke={`${S}0.35)`} strokeWidth="0.75"/>
      <line x1="80" y1="116" x2="26" y2="147" stroke={`${S}0.35)`} strokeWidth="0.75"/>
      {/* Blade sweep */}
      <circle cx="80" cy="116" r="62" fill="none" stroke={`${S}0.06)`} strokeWidth="0.5" strokeDasharray="4 6"/>
      {/* Status light */}
      <circle cx="88" cy="112" r="1.2" fill={`${GR}0.6)`}/>
      {/* Power line from base */}
      <line x1="80" y1="350" x2="160" y2="350" stroke={`${G}0.3)`} strokeWidth="0.5"/>

      {/* Solar panels */}
      {[0, 1, 2].map(i => (
        <g key={`r1-${i}`} transform={`rotate(-12 ${160 + i * 32} 270)`}>
          <rect x={148 + i * 32} y="263" width="28" height="14" rx="1" fill={`${B}0.1)`} stroke={`${B}0.3)`} strokeWidth="0.5"/>
          <line x1={148 + i * 32} y1="269" x2={176 + i * 32} y2="269" stroke={`${B}0.15)`} strokeWidth="0.5"/>
          <line x1={148 + i * 32} y1="273" x2={176 + i * 32} y2="273" stroke={`${B}0.15)`} strokeWidth="0.5"/>
        </g>
      ))}
      {[0, 1, 2].map(i => (
        <g key={`r2-${i}`} transform={`rotate(-12 ${160 + i * 32} 290)`}>
          <rect x={148 + i * 32} y="283" width="28" height="14" rx="1" fill={`${B}0.08)`} stroke={`${B}0.25)`} strokeWidth="0.5"/>
          <line x1={148 + i * 32} y1="289" x2={176 + i * 32} y2="289" stroke={`${B}0.12)`} strokeWidth="0.5"/>
        </g>
      ))}
      {/* Panel supports */}
      {[0, 1, 2].map(i => (
        <line key={`sup-${i}`} x1={162 + i * 32} y1="297" x2={162 + i * 32} y2="310" stroke={`${S}0.15)`} strokeWidth="0.5"/>
      ))}

      {/* Batteries */}
      {[0, 1].map(i => {
        const x = 150 + i * 52;
        return (
          <g key={`bat-${i}`}>
            <rect x={x} y="320" width="45" height="65" rx="4" fill={`${GR}0.04)`} stroke={`${GR}0.25)`} strokeWidth="0.5"/>
            <rect x={x + 16} y="316" width="13" height="4" rx="1.5" fill="none" stroke={`${GR}0.2)`} strokeWidth="0.5"/>
            {[0, 1, 2, 3, 4].map(j => (
              <line key={j} x1={x + 6} y1={328 + j * 10} x2={x + 39} y2={328 + j * 10} stroke={`${GR}0.1)`} strokeWidth="0.5"/>
            ))}
            {[0, 1, 2].map(j => (
              <circle key={j} cx={x + 12 + j * 8} cy="324" r="1.2" fill={`${GR}0.5)`}/>
            ))}
          </g>
        );
      })}

      {/* Connections */}
      <line x1="80" y1="350" x2="172" y2="350" stroke={`${G}0.2)`} strokeWidth="0.5" strokeDasharray="3 4"/>
      <line x1="178" y1="310" x2="178" y2="320" stroke={`${G}0.2)`} strokeWidth="0.5" strokeDasharray="3 4"/>
      {/* Output cables */}
      <path d="M172,385 L172,395 Q172,400 162,400" fill="none" stroke={`${S}0.2)`} strokeWidth="0.5"/>
      <path d="M224,385 L224,395 Q224,400 234,400" fill="none" stroke={`${S}0.2)`} strokeWidth="0.5"/>
    </svg>
  );
}

function UAVIllustration() {
  const S = "rgba(155,168,171,";
  const G = "rgba(196,164,108,";
  const GR = "rgba(100,200,140,";
  const cx = 130, cy = 190;
  const armLen = 55;
  const angles = [(-135), (-45), (45), (135)].map(a => (a * Math.PI) / 180);
  const motors = angles.map(a => ({ x: cx + Math.cos(a) * armLen, y: cy + Math.sin(a) * armLen }));
  return (
    <svg viewBox="0 0 260 400" style={{ width: "100%", maxWidth: 260, height: "auto" }}>
      {/* Arms */}
      {motors.map((m, i) => (
        <line key={`arm-${i}`} x1={cx} y1={cy} x2={m.x} y2={m.y} stroke={`${S}0.5)`} strokeWidth="1"/>
      ))}
      {/* Propeller arcs */}
      {motors.map((m, i) => (
        <circle key={`prop-${i}`} cx={m.x} cy={m.y} r="16" fill="none" stroke={`${S}0.12)`} strokeWidth="0.5" strokeDasharray="3 4"/>
      ))}
      {/* Motors */}
      {motors.map((m, i) => (
        <g key={`motor-${i}`}>
          <circle cx={m.x} cy={m.y} r="5" fill="rgba(255,255,255,0.03)" stroke={`${S}0.4)`} strokeWidth="0.5"/>
          <circle cx={m.x} cy={m.y} r="1.5" fill={`${S}0.3)`}/>
        </g>
      ))}
      {/* Body */}
      <rect x={cx - 20} y={cy - 10} width="40" height="20" rx="4" fill="rgba(255,255,255,0.04)" stroke={`${S}0.45)`} strokeWidth="0.75"/>
      {/* Nav LEDs */}
      <circle cx={cx - 16} cy={cy - 6} r="1.5" fill={`${GR}0.7)`}/>
      <circle cx={cx + 16} cy={cy - 6} r="1.5" fill={`${GR}0.7)`}/>
      <circle cx={cx - 16} cy={cy + 6} r="1.5" fill={`${G}0.5)`}/>
      <circle cx={cx + 16} cy={cy + 6} r="1.5" fill={`${G}0.5)`}/>
      {/* GPS antenna */}
      <line x1={cx} y1={cy - 10} x2={cx} y2={cy - 18} stroke={`${S}0.3)`} strokeWidth="0.5"/>
      <circle cx={cx} cy={cy - 19} r="2" fill="none" stroke={`${S}0.25)`} strokeWidth="0.5"/>
      {/* Camera pod */}
      <rect x={cx - 8} y={cy + 12} width="16" height="10" rx="2" fill="rgba(255,255,255,0.03)" stroke={`${S}0.35)`} strokeWidth="0.5"/>
      <circle cx={cx} cy={cy + 17} r="3" fill="rgba(255,255,255,0.02)" stroke={`${S}0.3)`} strokeWidth="0.5"/>
      <circle cx={cx} cy={cy + 17} r="1" fill={`${S}0.25)`}/>
      {/* Scan lines */}
      <line x1={cx} y1={cy + 22} x2={cx - 30} y2={cy + 80} stroke={`${S}0.08)`} strokeWidth="0.5" strokeDasharray="3 5"/>
      <line x1={cx} y1={cy + 22} x2={cx} y2={cy + 85} stroke={`${S}0.1)`} strokeWidth="0.5" strokeDasharray="3 5"/>
      <line x1={cx} y1={cy + 22} x2={cx + 30} y2={cy + 80} stroke={`${S}0.08)`} strokeWidth="0.5" strokeDasharray="3 5"/>
      {/* Landing gear */}
      <line x1={cx - 12} y1={cy + 10} x2={cx - 22} y2={cy + 30} stroke={`${S}0.25)`} strokeWidth="0.5"/>
      <line x1={cx + 12} y1={cy + 10} x2={cx + 22} y2={cy + 30} stroke={`${S}0.25)`} strokeWidth="0.5"/>
      <line x1={cx - 28} y1={cy + 30} x2={cx + 28} y2={cy + 30} stroke={`${S}0.2)`} strokeWidth="0.5"/>
    </svg>
  );
}

function RoboticsIllustration() {
  const S = "rgba(155,168,171,";
  const GR = "rgba(100,200,140,";
  return (
    <svg viewBox="0 0 260 400" style={{ width: "100%", maxWidth: 260, height: "auto" }}>
      {/* Base plate */}
      <ellipse cx="130" cy="360" rx="50" ry="12" fill="rgba(255,255,255,0.03)" stroke={`${S}0.35)`} strokeWidth="0.5"/>
      {/* Base turret */}
      <rect x="112" y="336" width="36" height="24" rx="3" fill="rgba(255,255,255,0.03)" stroke={`${S}0.4)`} strokeWidth="0.5"/>
      {/* Rotation ring */}
      <ellipse cx="130" cy="336" rx="18" ry="5" fill="rgba(255,255,255,0.02)" stroke={`${S}0.3)`} strokeWidth="0.5"/>
      {/* Status LEDs on base */}
      {[0, 1, 2].map(i => (
        <circle key={i} cx={122 + i * 8} cy="352" r="1.5" fill={`${GR}0.6)`}/>
      ))}

      {/* Segment 1 (shoulder → elbow) */}
      <rect x="122" y="260" width="16" height="76" rx="3" fill="rgba(255,255,255,0.025)" stroke={`${S}0.4)`} strokeWidth="0.5"/>
      {/* Joint 1 (shoulder) */}
      <circle cx="130" cy="260" r="10" fill="rgba(255,255,255,0.03)" stroke={`${S}0.45)`} strokeWidth="0.75"/>
      <circle cx="130" cy="260" r="4" fill="none" stroke={`${S}0.3)`} strokeWidth="0.5"/>

      {/* Segment 2 (upper arm, angled) */}
      <g transform="rotate(-25 130 260)">
        <rect x="122" y="185" width="16" height="75" rx="3" fill="rgba(255,255,255,0.02)" stroke={`${S}0.35)`} strokeWidth="0.5"/>
      </g>
      {/* Joint 2 (elbow) */}
      <circle cx="100" cy="195" r="8" fill="rgba(255,255,255,0.025)" stroke={`${S}0.4)`} strokeWidth="0.5"/>
      <circle cx="100" cy="195" r="3" fill="none" stroke={`${S}0.25)`} strokeWidth="0.5"/>

      {/* Segment 3 (forearm, angled back) */}
      <g transform="rotate(15 100 195)">
        <rect x="92" y="135" width="16" height="60" rx="3" fill="rgba(255,255,255,0.02)" stroke={`${S}0.3)`} strokeWidth="0.5"/>
      </g>
      {/* Joint 3 (wrist) */}
      <circle cx="108" cy="130" r="6" fill="rgba(255,255,255,0.02)" stroke={`${S}0.35)`} strokeWidth="0.5"/>
      <circle cx="108" cy="130" r="2" fill={`${S}0.25)`}/>

      {/* Gripper */}
      <line x1="108" y1="124" x2="108" y2="110" stroke={`${S}0.4)`} strokeWidth="0.75"/>
      <line x1="108" y1="110" x2="98" y2="96" stroke={`${S}0.4)`} strokeWidth="0.75"/>
      <line x1="108" y1="110" x2="118" y2="96" stroke={`${S}0.4)`} strokeWidth="0.75"/>
      <rect x="94" y="88" width="8" height="8" rx="1" fill="none" stroke={`${S}0.35)`} strokeWidth="0.5"/>
      <rect x="114" y="88" width="8" height="8" rx="1" fill="none" stroke={`${S}0.35)`} strokeWidth="0.5"/>

      {/* Welding sparks */}
      <circle cx="108" cy="88" r="2.5" fill="rgba(196,164,108,0.3)"/>
      <line x1="108" y1="88" x2="104" y2="80" stroke="rgba(196,164,108,0.25)" strokeWidth="0.5"/>
      <line x1="108" y1="88" x2="115" y2="82" stroke="rgba(196,164,108,0.2)" strokeWidth="0.5"/>
      <line x1="108" y1="88" x2="108" y2="78" stroke="rgba(196,164,108,0.3)" strokeWidth="0.5"/>

      {/* Cable along arm */}
      <path d="M130,340 L130,260 Q120,230 100,195 Q104,165 108,130" fill="none" stroke={`${S}0.12)`} strokeWidth="0.5" strokeDasharray="3 4"/>
    </svg>
  );
}

function SpaceIllustration() {
  const S = "rgba(155,168,171,";
  const G = "rgba(196,164,108,";
  const B = "rgba(100,150,200,";
  return (
    <svg viewBox="0 0 260 400" style={{ width: "100%", maxWidth: 260, height: "auto" }}>
      {/* Nose cone */}
      <path d="M130,20 L140,70 L120,70 Z" fill="rgba(255,255,255,0.03)" stroke={`${S}0.45)`} strokeWidth="0.5"/>
      <circle cx="130" cy="22" r="1" fill={`${S}0.4)`}/>
      {/* Payload fairing */}
      <rect x="118" y="70" width="24" height="50" rx="2" fill="rgba(255,255,255,0.025)" stroke={`${S}0.4)`} strokeWidth="0.5"/>
      <line x1="118" y1="82" x2="142" y2="82" stroke={`${S}0.15)`} strokeWidth="0.5"/>
      <line x1="118" y1="95" x2="142" y2="95" stroke={`${S}0.12)`} strokeWidth="0.5"/>
      <line x1="118" y1="108" x2="142" y2="108" stroke={`${S}0.1)`} strokeWidth="0.5"/>
      {/* Interstage */}
      <rect x="116" y="120" width="28" height="8" rx="1" fill="rgba(255,255,255,0.02)" stroke={`${S}0.3)`} strokeWidth="0.5"/>
      {/* First stage — LOX tank (blue tint) */}
      <rect x="114" y="128" width="32" height="70" rx="2" fill={`${B}0.06)`} stroke={`${S}0.4)`} strokeWidth="0.5"/>
      <text x="130" y="165" textAnchor="middle" fontFamily="monospace" fontSize="5" fill={`${B}0.2)`}>LOX</text>
      {/* Divider */}
      <line x1="114" y1="198" x2="146" y2="198" stroke={`${S}0.25)`} strokeWidth="0.5"/>
      {/* Fuel tank (gold tint) */}
      <rect x="114" y="198" width="32" height="80" rx="2" fill={`${G}0.04)`} stroke={`${S}0.4)`} strokeWidth="0.5"/>
      <text x="130" y="240" textAnchor="middle" fontFamily="monospace" fontSize="5" fill={`${G}0.2)`}>RP-1</text>
      {/* Logo area */}
      <rect x="121" y="150" width="18" height="8" rx="1" fill="none" stroke={`${S}0.12)`} strokeWidth="0.5"/>
      {/* Grid fins */}
      <rect x="100" y="265" width="12" height="8" rx="1" fill="none" stroke={`${S}0.3)`} strokeWidth="0.5"/>
      <line x1="103" y1="265" x2="103" y2="273" stroke={`${S}0.15)`} strokeWidth="0.5"/>
      <line x1="106" y1="265" x2="106" y2="273" stroke={`${S}0.15)`} strokeWidth="0.5"/>
      <line x1="109" y1="265" x2="109" y2="273" stroke={`${S}0.15)`} strokeWidth="0.5"/>
      <rect x="148" y="265" width="12" height="8" rx="1" fill="none" stroke={`${S}0.3)`} strokeWidth="0.5"/>
      <line x1="151" y1="265" x2="151" y2="273" stroke={`${S}0.15)`} strokeWidth="0.5"/>
      <line x1="154" y1="265" x2="154" y2="273" stroke={`${S}0.15)`} strokeWidth="0.5"/>
      <line x1="157" y1="265" x2="157" y2="273" stroke={`${S}0.15)`} strokeWidth="0.5"/>
      {/* Side fins */}
      <path d="M114,278 L102,300 L114,300 Z" fill="rgba(255,255,255,0.02)" stroke={`${S}0.35)`} strokeWidth="0.5"/>
      <path d="M146,278 L158,300 L146,300 Z" fill="rgba(255,255,255,0.02)" stroke={`${S}0.35)`} strokeWidth="0.5"/>
      {/* Engine bell */}
      <path d="M120,278 Q118,290 112,310" fill="none" stroke={`${S}0.4)`} strokeWidth="0.75"/>
      <path d="M140,278 Q142,290 148,310" fill="none" stroke={`${S}0.4)`} strokeWidth="0.75"/>
      <ellipse cx="130" cy="310" rx="18" ry="4" fill="none" stroke={`${S}0.35)`} strokeWidth="0.5"/>
      <ellipse cx="130" cy="308" rx="12" ry="3" fill="none" stroke={`${S}0.25)`} strokeWidth="0.5"/>
      {/* Exhaust plume */}
      <path d="M130,314 Q138,340 130,380 Q122,340 130,314Z" fill={`${G}0.06)`} stroke={`${G}0.15)`} strokeWidth="0.5"/>
      <path d="M130,316 Q135,338 130,370 Q125,338 130,316Z" fill={`${G}0.1)`} stroke={`${G}0.2)`} strokeWidth="0.5"/>
      <path d="M130,318 Q133,335 130,360 Q127,335 130,318Z" fill={`${G}0.18)`} stroke={`${G}0.3)`} strokeWidth="0.5"/>
    </svg>
  );
}

function DefaultIllustration() {
  return (
    <svg viewBox="0 0 320 380" style={{ width: "100%", maxWidth: 320, height: "auto" }}>
      <defs>
        <filter id="gl" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glW" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <style>{`
          @keyframes fd { to { stroke-dashoffset: -14; } }
          @keyframes spD { 0%,100% { opacity:.6; } 50% { opacity:1; } }
          .fl { stroke-dasharray: 3 5; animation: fd 2.5s linear infinite; }
          .spD { animation: spD 3s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* LAYER 1: RAW MATERIALS */}
      <line x1="30" y1="55" x2="280" y2="55" stroke="#e2b84a" strokeWidth="0.6" opacity="0.35"/>
      {[
        { cx: 42, r: 4 }, { cx: 82, r: 4.5 }, { cx: 118, r: 3.5 }, { cx: 155, r: 5 },
        { cx: 192, r: 4 }, { cx: 232, r: 4.5 }, { cx: 268, r: 3.5 },
      ].map(({ cx, r }) => (
        <g key={cx}>
          <circle cx={cx} cy={30} r={r + 3.5} fill="none" stroke="#e2b84a" strokeWidth="0.4" opacity="0.25"/>
          <circle cx={cx} cy={30} r={r} fill="#1c1810" stroke="#e2b84a" strokeWidth="1" opacity="0.85"/>
          <line x1={cx} y1={30 + r} x2={cx} y2={55} stroke="#e2b84a" strokeWidth="0.6" opacity="0.35"/>
          <circle cx={cx} cy={30} r={1.3} fill="#e2b84a" opacity="1" className="spD"/>
        </g>
      ))}
      <text x="305" y="32" fill="#4a4a4a" fontSize="6" fontFamily="'DM Sans',sans-serif" textAnchor="end" letterSpacing="0.1em">RAW</text>
      <text x="305" y="39" fill="#4a4a4a" fontSize="6" fontFamily="'DM Sans',sans-serif" textAnchor="end" letterSpacing="0.1em">MATERIAL</text>

      {/* Drops to components */}
      {[82, 155, 228].map(x => (
        <line key={x} x1={x} y1={55} x2={x} y2={95} stroke="#e2b84a" strokeWidth="0.7" opacity="0.3" className="fl"/>
      ))}

      {/* LAYER 2: COMPONENTS */}
      {[{ x: 65, y: 100, cx: 82, cy: 107 }, { x: 138, y: 98, cx: 155, cy: 105 }, { x: 211, y: 101, cx: 228, cy: 108 }].map(p => (
        <g key={p.cx}>
          <rect x={p.x} y={p.y} width={34} height={14} rx={7} fill="#161a20" stroke="#7eb4d8" strokeWidth="0.9" opacity="0.8"/>
          <line x1={p.cx - 9} y1={p.cy} x2={p.cx + 9} y2={p.cy} stroke="#7eb4d8" strokeWidth="0.4" opacity="0.45"/>
          <circle cx={p.cx} cy={p.cy} r={1.3} fill="#7eb4d8" opacity="0.9" className="spD"/>
        </g>
      ))}
      <text x="305" y="108" fill="#4a4a4a" fontSize="6" fontFamily="'DM Sans',sans-serif" textAnchor="end" letterSpacing="0.1em">COMPONENT</text>

      {/* Converging to chokepoint */}
      <path d="M82,116 C82,145 155,145 155,162" fill="none" stroke="#7eb4d8" strokeWidth="0.7" opacity="0.35" className="fl"/>
      <path d="M155,114 C155,140 155,140 155,162" fill="none" stroke="#7eb4d8" strokeWidth="0.7" opacity="0.35" className="fl"/>
      <path d="M228,117 C228,145 155,145 155,162" fill="none" stroke="#7eb4d8" strokeWidth="0.7" opacity="0.35" className="fl"/>

      {/* CHOKEPOINT */}
      <circle cx="155" cy="185" r="20" fill="none" stroke="#e2b84a" strokeWidth="0.4" opacity="0.15">
        <animate attributeName="r" values="18;22;18" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.15;0.35;0.15" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="155" cy="185" r="14" fill="none" stroke="#e2b84a" strokeWidth="0.5" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.45;0.2" dur="3s" repeatCount="indefinite" begin="0.4s"/>
      </circle>
      <circle cx="155" cy="185" r="10" fill="#e2b84a" opacity="0.06" filter="url(#glW)"/>
      <g filter="url(#gl)">
        <rect x="144" y="174" width="22" height="22" rx="2.5" fill="#1c1810" stroke="#e2b84a" strokeWidth="1.2" transform="rotate(45 155 185)" opacity="1"/>
      </g>
      <circle cx="155" cy="185" r="2.8" fill="#e2b84a" opacity="1" filter="url(#gl)"/>
      <line x1="172" y1="185" x2="192" y2="185" stroke="#e2b84a" strokeWidth="0.5" opacity="0.4"/>
      <circle cx="192" cy="185" r="0.8" fill="#e2b84a" opacity="0.5"/>
      <text x="197" y="183" fill="#e2b84a" fontSize="6" fontFamily="'DM Sans',sans-serif" opacity="0.65" letterSpacing="0.08em">CHOKEPOINT</text>
      <text x="197" y="190.5" fill="#e2b84a" fontSize="5" fontFamily="'DM Sans',sans-serif" opacity="0.35">Single source dependency</text>

      {/* Fan out to subsystems */}
      <path d="M155,202 C155,226 68,226 68,250" fill="none" stroke="#e2b84a" strokeWidth="0.7" opacity="0.3" className="fl"/>
      <path d="M155,202 C155,226 155,226 155,248" fill="none" stroke="#e2b84a" strokeWidth="0.7" opacity="0.3" className="fl"/>
      <path d="M155,202 C155,226 242,226 242,252" fill="none" stroke="#e2b84a" strokeWidth="0.7" opacity="0.3" className="fl"/>

      {/* LAYER 3: SUBSYSTEMS */}
      {[{ x: 54, y: 254, cx: 68, cy: 264 }, { x: 141, y: 252, cx: 155, cy: 262 }, { x: 228, y: 256, cx: 242, cy: 266 }].map(p => (
        <g key={p.cx} opacity="0.75">
          <rect x={p.x} y={p.y} width={28} height={20} rx={2.5} fill="#141c1a" stroke="#5cd4c8" strokeWidth="0.8"/>
          {[0, 7.5, 15].map((dx, j) => (
            <g key={j}>
              <rect x={p.x + 5 + dx} y={p.y + 4.5} width={4.5} height={3.5} rx={0.5} fill="#5cd4c8" opacity={0.1 + j * 0.04}/>
              <rect x={p.x + 5 + dx} y={p.y + 12} width={4.5} height={3.5} rx={0.5} fill="#5cd4c8" opacity={0.14 + j * 0.04}/>
            </g>
          ))}
          <circle cx={p.cx} cy={p.cy} r={1.2} fill="#5cd4c8" opacity="0.8" className="spD"/>
        </g>
      ))}
      <text x="305" y="265" fill="#4a4a4a" fontSize="6" fontFamily="'DM Sans',sans-serif" textAnchor="end" letterSpacing="0.1em">SUBSYSTEM</text>

      {/* Bus to end use */}
      <line x1="22" y1="310" x2="288" y2="310" stroke="#5cd4c8" strokeWidth="0.5" opacity="0.2"/>
      {[68, 155, 242].map(x => (
        <line key={x} x1={x} y1={x === 155 ? 275 : x === 68 ? 276 : 278} x2={x} y2={310} stroke="#5cd4c8" strokeWidth="0.6" opacity="0.2" className="fl"/>
      ))}
      {[40, 100, 155, 210, 270].map(x => (
        <line key={x} x1={x} y1={310} x2={x} y2={325} stroke="#7acc8e" strokeWidth="0.5" opacity="0.2"/>
      ))}

      {/* LAYER 4: END USE */}
      {/* Server rack */}
      <g opacity="0.7">
        <rect x="29" y="327" width="22" height="28" rx="2" fill="#141c18" stroke="#7acc8e" strokeWidth="0.7"/>
        {[330.5, 336.5, 342.5, 348.5].map(y => (
          <g key={y}><rect x="32" y={y} width="13" height="3.8" rx="0.8" fill="#7acc8e" opacity="0.12"/><circle cx="42" cy={y + 2} r="0.6" fill="#7acc8e" opacity="0.6"/></g>
        ))}
      </g>
      {/* Network hub */}
      <g opacity="0.7">
        <circle cx="100" cy="341" r="10" fill="#141c18" stroke="#7acc8e" strokeWidth="0.7"/>
        {[{x:106,y:335},{x:109.5,y:341},{x:106,y:347},{x:94,y:347},{x:90.5,y:341}].map((p,i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1" fill="#7acc8e" opacity="0.4"/>
        ))}
        <circle cx="100" cy="341" r="1" fill="#7acc8e" opacity="0.7"/>
      </g>
      {/* Chip */}
      <g opacity="0.7">
        <rect x="143" y="330" width="24" height="22" rx="2" fill="#141c18" stroke="#7acc8e" strokeWidth="0.7"/>
        <rect x="148" y="335" width="14" height="12" rx="1" fill="none" stroke="#7acc8e" strokeWidth="0.35" opacity="0.35"/>
        {[149, 154, 159].map(x => (<g key={x}><line x1={x} y1={330} x2={x} y2={327} stroke="#7acc8e" strokeWidth="0.4" opacity="0.4"/><line x1={x} y1={352} x2={x} y2={355} stroke="#7acc8e" strokeWidth="0.4" opacity="0.4"/></g>))}
        <circle cx="155" cy="341" r="1" fill="#7acc8e" opacity="0.6"/>
      </g>
      {/* Antenna */}
      <g opacity="0.7">
        <line x1="210" y1="330" x2="210" y2="355" stroke="#7acc8e" strokeWidth="0.8"/>
        <line x1="203" y1="355" x2="217" y2="355" stroke="#7acc8e" strokeWidth="0.5"/>
        <path d="M204,335 Q210,330 216,335" fill="none" stroke="#7acc8e" strokeWidth="0.5" opacity="0.55"/>
        <path d="M201,339 Q210,332 219,339" fill="none" stroke="#7acc8e" strokeWidth="0.4" opacity="0.35"/>
        <circle cx="210" cy="331" r="1.5" fill="#7acc8e" opacity="0.5"/>
      </g>
      {/* Satellite */}
      <g opacity="0.7">
        <rect x="263" y="336" width="14" height="9" rx="1.5" fill="#141c18" stroke="#7acc8e" strokeWidth="0.6"/>
        <line x1="263" y1="340.5" x2="257" y2="340.5" stroke="#7acc8e" strokeWidth="0.5"/>
        <line x1="277" y1="340.5" x2="283" y2="340.5" stroke="#7acc8e" strokeWidth="0.5"/>
        <rect x="253" y="336" width="5" height="9" rx="0.5" fill="#7acc8e" opacity="0.1" stroke="#7acc8e" strokeWidth="0.3"/>
        <rect x="282" y="336" width="5" height="9" rx="0.5" fill="#7acc8e" opacity="0.1" stroke="#7acc8e" strokeWidth="0.3"/>
      </g>
      <text x="305" y="343" fill="#4a4a4a" fontSize="6" fontFamily="'DM Sans',sans-serif" textAnchor="end" letterSpacing="0.1em">END USE</text>
    </svg>
  );
}

const ILLUSTRATIONS = [AIInfraIllustration, EnergyIllustration, UAVIllustration, RoboticsIllustration, SpaceIllustration];

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */

export default function ExplorePage() {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const isHovering = hovered !== null;
  const Illus = isHovering ? ILLUSTRATIONS[selected] : DefaultIllustration;

  return (
    <div style={{ minHeight: "100vh", background: "#050504", display: "flex", flexDirection: "column" }}>
      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <div style={{
        height: 42, background: "#030302",
        borderBottom: "0.5px solid rgba(255,255,255,0.03)",
        display: "flex", alignItems: "center", padding: "0 28px",
        flexShrink: 0,
      }}>
        <span style={{ ...SYS, fontSize: 11, fontWeight: 300, letterSpacing: "0.06em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" as const }}>Stillpoint</span>
        <span style={{ display: "inline-block", width: 5 }}/>
        <span style={{ ...SYS, fontSize: 11, fontWeight: 200, letterSpacing: "0.06em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase" as const }}>Intelligence</span>
      </div>

      {/* ── MAIN ────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 40px" }}>
        {/* Unified container */}
        <div style={{
          maxWidth: 700, width: "100%",
          background: "rgba(19,19,19,0.5)",
          border: "1px solid #1e1e1e",
          borderRadius: 16,
          padding: "40px 48px",
        }}>
          {/* Headline */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Garamond, serif",
            fontSize: 42, fontWeight: 500, lineHeight: 1.2,
            letterSpacing: "-0.01em",
            color: "#e8e4df",
            margin: 0, marginBottom: 8,
          }}>
            Explore emerging frontiers.
          </h1>
          {/* Subheadline */}
          <p style={{
            fontFamily: "'Cormorant Garamond', Garamond, serif",
            fontSize: 18, fontWeight: 400, lineHeight: 1.5,
            color: "#555",
            margin: 0, maxWidth: 560,
          }}>
            Trace value chains from raw material to end use — every node, every bottleneck, every player.
          </p>

          {/* Two-column: selector + illustration */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {/* Left: vertical selector */}
            <div style={{ width: 320, flexShrink: 0 }}>

          {VERTICALS.map((v, i) => {
            const isHov = hovered === i;
            return (
              <div
                key={v.name}
                onClick={() => { if (v.live && v.href !== "#") window.location.href = v.href; }}
                onMouseEnter={() => { setHovered(i); setSelected(i); }}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: "14px 0 18px",
                  borderBottom: "0.5px solid rgba(255,255,255,0.04)",
                  borderTop: i === 0 ? "0.5px solid rgba(255,255,255,0.04)" : undefined,
                  cursor: v.live ? "pointer" : "default",
                  transition: "all 0.2s",
                }}
              >
                {/* Name row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    ...SYS, fontSize: 15,
                    fontWeight: isHov ? 500 : 400,
                    color: isHov ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.2)",
                    transition: "color 0.2s",
                  }}>
                    {v.name}
                  </span>
                  <span style={{
                    ...MONO, fontSize: 11,
                    color: isHov ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                    transition: "color 0.2s",
                  }}>
                    →
                  </span>
                </div>
                {/* Description (on hover) */}
                {isHov && (
                  <div style={{
                    ...SYS, fontSize: 10, color: "rgba(255,255,255,0.15)", lineHeight: 1.7,
                    marginTop: 8, maxWidth: 300,
                    animation: "exploreDescIn 0.2s ease",
                  }}>
                    {v.description}
                    {!v.live && (
                      <span style={{ ...MONO, fontSize: 7, color: "rgba(255,255,255,0.08)", marginLeft: 6 }}>Coming soon</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: illustration */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div key={isHovering ? `sector-${selected}` : "default"} style={{ animation: "exploreIllusIn 0.3s ease", maxWidth: isHovering ? 220 : 280, width: "100%", transition: "max-width 0.3s ease" }}>
            <Illus />
          </div>
        </div>
          </div>{/* end two-column */}
        </div>{/* end unified container */}
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <div style={{
        height: 28, background: "#030302",
        borderTop: "0.5px solid rgba(255,255,255,0.025)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", flexShrink: 0,
      }}>
        <span style={{ ...MONO, fontSize: 7, color: "rgba(255,255,255,0.06)" }}>
          Stillpoint Intelligence · Proprietary
        </span>
        <span style={{ ...MONO, fontSize: 7, color: "rgba(255,255,255,0.06)" }}>
          5 verticals
        </span>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes exploreDescIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes exploreIllusIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
