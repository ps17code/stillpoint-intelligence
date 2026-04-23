"use client";
import React, { useState, useMemo } from "react";
import TreeMap from "@/components/TreeMap";
import {
  buildCompGeometry,
  buildSubGeometry,
  computeCompSvgWidth,
  computeSubSvgWidth,
  buildRawGeometry,
  computeRawSvgWidth,
  buildGalliumGeometry,
  computeGalliumSvgWidth,
} from "@/lib/treeGeometry";
import chainsJson from "@/data/chains.json";
import nodesJson from "@/data/nodes.json";
import galliumChainJson from "@/data/gallium-chain.json";
import galliumNodesJson from "@/data/gallium-nodes.json";
import type { CompChain, SubChain, RawChain, GalliumChain, NodeData } from "@/types";

/* ── data casts ── */
const chainsData = chainsJson as unknown as {
  layerConfig: Record<string, { label?: string; displayFields: { key: string; label: string }[] }>;
  RAW_DATA: Record<string, RawChain>;
  COMP_DATA: Record<string, CompChain>;
  SUB_DATA: Record<string, SubChain>;
};
const allNodes = nodesJson as unknown as Record<string, NodeData>;
const galliumChain = (galliumChainJson as Record<string, unknown>).GALLIUM_CHAIN as unknown as GalliumChain;
const galliumNodes = galliumNodesJson as unknown as Record<string, NodeData>;
const galliumLc = (galliumChainJson as Record<string, unknown>).layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;

/* ── palette ── */
const borderColor = "#252220";
const warmWhite = "#ece8e1";
const bodyText = "#a09888";
const muted = "#706a60";
const dimText = "#555";
const dimmer = "#4a4540";

/* ── types ── */
type NavLevel = "verticals" | "subsystems" | "components" | "tree";
type TreeTarget = { type: "component" | "raw-material"; id: string };

interface Subsystem {
  id: string;
  name: string;
  description: string;
  componentCount: string;
  comingSoon: boolean;
  components: ComponentDef[];
}
interface ComponentDef {
  id: string;
  name: string;
  detail: string;
  keyNumber: string | null;
  hasTree: boolean;
  comingSoon: boolean;
}

/* ── illustrations ── */

function AIInfraIllustration() {
  const S = "rgba(155,168,171,";
  const G = "rgba(196,164,108,";
  const LED_G = "rgba(100,200,140,";
  const LED_A = "rgba(196,164,108,";
  return (
    <svg viewBox="0 0 260 400" style={{ width: "100%", maxWidth: 260, height: "auto" }}>
      <line x1="40" y1="30" x2="200" y2="30" stroke={`${G}0.25)`} strokeWidth="0.5"/>
      <path d="M60,30 Q30,30 20,20" fill="none" stroke={`${G}0.3)`} strokeWidth="0.5"/>
      <path d="M70,30 Q35,28 15,14" fill="none" stroke={`${G}0.25)`} strokeWidth="0.5"/>
      <path d="M80,30 Q40,26 10,8" fill="none" stroke={`${G}0.2)`} strokeWidth="0.5"/>
      <line x1="130" y1="30" x2="130" y2="48" stroke={`${G}0.2)`} strokeWidth="0.5" strokeDasharray="2 3"/>
      <rect x="70" y="48" width="120" height="300" rx="4" fill="rgba(255,255,255,0.02)" stroke={`${S}0.35)`} strokeWidth="0.75"/>
      {[56, 60, 64].map(y => (
        <line key={y} x1="82" y1={y} x2="178" y2={y} stroke={`${S}0.12)`} strokeWidth="0.5"/>
      ))}
      {Array.from({ length: 8 }, (_, i) => {
        const y = 72 + i * 32;
        return (
          <g key={i}>
            <rect x="78" y={y} width="104" height="26" rx="2" fill="rgba(255,255,255,0.03)" stroke={`${S}0.3)`} strokeWidth="0.5"/>
            {[0, 1, 2, 3].map(j => (
              <rect key={j} x={82 + j * 22} y={y + 4} width="18" height="12" rx="1" fill="rgba(100,150,200,0.06)" stroke="rgba(100,150,200,0.2)" strokeWidth="0.5"/>
            ))}
            <circle cx="174" cy={y + 8} r="1.5" fill={`${LED_G}0.6)`}/>
            <circle cx="174" cy={y + 15} r="1.5" fill={i === 3 || i === 6 ? `${LED_A}0.5)` : `${LED_G}0.5)`}/>
            <line x1="182" y1={y + 13} x2="200" y2={y + 13} stroke={`${G}0.2)`} strokeWidth="0.5"/>
            <circle cx="200" cy={y + 13} r="1" fill={`${G}0.3)`}/>
          </g>
        );
      })}
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
      <line x1="66" y1="55" x2="66" y2="340" stroke="rgba(100,150,200,0.15)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M100,344 L100,370 Q100,380 90,380" fill="none" stroke={`${S}0.2)`} strokeWidth="0.75"/>
      <path d="M160,344 L160,370 Q160,380 170,380" fill="none" stroke={`${S}0.2)`} strokeWidth="0.75"/>
      {[110, 125, 140, 155].map((x, i) => (
        <path key={i} d={`M${x},46 Q${x + 3},36 ${x},26 Q${x - 3},16 ${x},6`} fill="none" stroke={`${S}${0.06 + i * 0.01})`} strokeWidth="0.5"/>
      ))}
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
      <line x1="80" y1="350" x2="80" y2="120" stroke={`${S}0.4)`} strokeWidth="1"/>
      <rect x="72" y="112" width="16" height="8" rx="2" fill="rgba(255,255,255,0.04)" stroke={`${S}0.4)`} strokeWidth="0.5"/>
      <circle cx="80" cy="116" r="3" fill="rgba(255,255,255,0.04)" stroke={`${S}0.45)`} strokeWidth="0.5"/>
      <circle cx="80" cy="116" r="1" fill={`${S}0.3)`}/>
      <line x1="80" y1="116" x2="80" y2="54" stroke={`${S}0.35)`} strokeWidth="0.75"/>
      <line x1="80" y1="116" x2="134" y2="147" stroke={`${S}0.35)`} strokeWidth="0.75"/>
      <line x1="80" y1="116" x2="26" y2="147" stroke={`${S}0.35)`} strokeWidth="0.75"/>
      <circle cx="80" cy="116" r="62" fill="none" stroke={`${S}0.06)`} strokeWidth="0.5" strokeDasharray="4 6"/>
      <circle cx="88" cy="112" r="1.2" fill={`${GR}0.6)`}/>
      <line x1="80" y1="350" x2="160" y2="350" stroke={`${G}0.3)`} strokeWidth="0.5"/>
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
      {[0, 1, 2].map(i => (
        <line key={`sup-${i}`} x1={162 + i * 32} y1="297" x2={162 + i * 32} y2="310" stroke={`${S}0.15)`} strokeWidth="0.5"/>
      ))}
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
      <line x1="80" y1="350" x2="172" y2="350" stroke={`${G}0.2)`} strokeWidth="0.5" strokeDasharray="3 4"/>
      <line x1="178" y1="310" x2="178" y2="320" stroke={`${G}0.2)`} strokeWidth="0.5" strokeDasharray="3 4"/>
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
      {motors.map((m, i) => (
        <line key={`arm-${i}`} x1={cx} y1={cy} x2={m.x} y2={m.y} stroke={`${S}0.5)`} strokeWidth="1"/>
      ))}
      {motors.map((m, i) => (
        <circle key={`prop-${i}`} cx={m.x} cy={m.y} r="16" fill="none" stroke={`${S}0.12)`} strokeWidth="0.5" strokeDasharray="3 4"/>
      ))}
      {motors.map((m, i) => (
        <g key={`motor-${i}`}>
          <circle cx={m.x} cy={m.y} r="5" fill="rgba(255,255,255,0.03)" stroke={`${S}0.4)`} strokeWidth="0.5"/>
          <circle cx={m.x} cy={m.y} r="1.5" fill={`${S}0.3)`}/>
        </g>
      ))}
      <rect x={cx - 20} y={cy - 10} width="40" height="20" rx="4" fill="rgba(255,255,255,0.04)" stroke={`${S}0.45)`} strokeWidth="0.75"/>
      <circle cx={cx - 16} cy={cy - 6} r="1.5" fill={`${GR}0.7)`}/>
      <circle cx={cx + 16} cy={cy - 6} r="1.5" fill={`${GR}0.7)`}/>
      <circle cx={cx - 16} cy={cy + 6} r="1.5" fill={`${G}0.5)`}/>
      <circle cx={cx + 16} cy={cy + 6} r="1.5" fill={`${G}0.5)`}/>
      <line x1={cx} y1={cy - 10} x2={cx} y2={cy - 18} stroke={`${S}0.3)`} strokeWidth="0.5"/>
      <circle cx={cx} cy={cy - 19} r="2" fill="none" stroke={`${S}0.25)`} strokeWidth="0.5"/>
      <rect x={cx - 8} y={cy + 12} width="16" height="10" rx="2" fill="rgba(255,255,255,0.03)" stroke={`${S}0.35)`} strokeWidth="0.5"/>
      <circle cx={cx} cy={cy + 17} r="3" fill="rgba(255,255,255,0.02)" stroke={`${S}0.3)`} strokeWidth="0.5"/>
      <circle cx={cx} cy={cy + 17} r="1" fill={`${S}0.25)`}/>
      <line x1={cx} y1={cy + 22} x2={cx - 30} y2={cy + 80} stroke={`${S}0.08)`} strokeWidth="0.5" strokeDasharray="3 5"/>
      <line x1={cx} y1={cy + 22} x2={cx} y2={cy + 85} stroke={`${S}0.1)`} strokeWidth="0.5" strokeDasharray="3 5"/>
      <line x1={cx} y1={cy + 22} x2={cx + 30} y2={cy + 80} stroke={`${S}0.08)`} strokeWidth="0.5" strokeDasharray="3 5"/>
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
      <ellipse cx="130" cy="360" rx="50" ry="12" fill="rgba(255,255,255,0.03)" stroke={`${S}0.35)`} strokeWidth="0.5"/>
      <rect x="112" y="336" width="36" height="24" rx="3" fill="rgba(255,255,255,0.03)" stroke={`${S}0.4)`} strokeWidth="0.5"/>
      <ellipse cx="130" cy="336" rx="18" ry="5" fill="rgba(255,255,255,0.02)" stroke={`${S}0.3)`} strokeWidth="0.5"/>
      {[0, 1, 2].map(i => (
        <circle key={i} cx={122 + i * 8} cy="352" r="1.5" fill={`${GR}0.6)`}/>
      ))}
      <rect x="122" y="260" width="16" height="76" rx="3" fill="rgba(255,255,255,0.025)" stroke={`${S}0.4)`} strokeWidth="0.5"/>
      <circle cx="130" cy="260" r="10" fill="rgba(255,255,255,0.03)" stroke={`${S}0.45)`} strokeWidth="0.75"/>
      <circle cx="130" cy="260" r="4" fill="none" stroke={`${S}0.3)`} strokeWidth="0.5"/>
      <g transform="rotate(-25 130 260)">
        <rect x="122" y="185" width="16" height="75" rx="3" fill="rgba(255,255,255,0.02)" stroke={`${S}0.35)`} strokeWidth="0.5"/>
      </g>
      <circle cx="100" cy="195" r="8" fill="rgba(255,255,255,0.025)" stroke={`${S}0.4)`} strokeWidth="0.5"/>
      <circle cx="100" cy="195" r="3" fill="none" stroke={`${S}0.25)`} strokeWidth="0.5"/>
      <g transform="rotate(15 100 195)">
        <rect x="92" y="135" width="16" height="60" rx="3" fill="rgba(255,255,255,0.02)" stroke={`${S}0.3)`} strokeWidth="0.5"/>
      </g>
      <circle cx="108" cy="130" r="6" fill="rgba(255,255,255,0.02)" stroke={`${S}0.35)`} strokeWidth="0.5"/>
      <circle cx="108" cy="130" r="2" fill={`${S}0.25)`}/>
      <line x1="108" y1="124" x2="108" y2="110" stroke={`${S}0.4)`} strokeWidth="0.75"/>
      <line x1="108" y1="110" x2="98" y2="96" stroke={`${S}0.4)`} strokeWidth="0.75"/>
      <line x1="108" y1="110" x2="118" y2="96" stroke={`${S}0.4)`} strokeWidth="0.75"/>
      <rect x="94" y="88" width="8" height="8" rx="1" fill="none" stroke={`${S}0.35)`} strokeWidth="0.5"/>
      <rect x="114" y="88" width="8" height="8" rx="1" fill="none" stroke={`${S}0.35)`} strokeWidth="0.5"/>
      <circle cx="108" cy="88" r="2.5" fill="rgba(196,164,108,0.3)"/>
      <line x1="108" y1="88" x2="104" y2="80" stroke="rgba(196,164,108,0.25)" strokeWidth="0.5"/>
      <line x1="108" y1="88" x2="115" y2="82" stroke="rgba(196,164,108,0.2)" strokeWidth="0.5"/>
      <line x1="108" y1="88" x2="108" y2="78" stroke="rgba(196,164,108,0.3)" strokeWidth="0.5"/>
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
      <path d="M130,20 L140,70 L120,70 Z" fill="rgba(255,255,255,0.03)" stroke={`${S}0.45)`} strokeWidth="0.5"/>
      <circle cx="130" cy="22" r="1" fill={`${S}0.4)`}/>
      <rect x="118" y="70" width="24" height="50" rx="2" fill="rgba(255,255,255,0.025)" stroke={`${S}0.4)`} strokeWidth="0.5"/>
      <line x1="118" y1="82" x2="142" y2="82" stroke={`${S}0.15)`} strokeWidth="0.5"/>
      <line x1="118" y1="95" x2="142" y2="95" stroke={`${S}0.12)`} strokeWidth="0.5"/>
      <line x1="118" y1="108" x2="142" y2="108" stroke={`${S}0.1)`} strokeWidth="0.5"/>
      <rect x="116" y="120" width="28" height="8" rx="1" fill="rgba(255,255,255,0.02)" stroke={`${S}0.3)`} strokeWidth="0.5"/>
      <rect x="114" y="128" width="32" height="70" rx="2" fill={`${B}0.06)`} stroke={`${S}0.4)`} strokeWidth="0.5"/>
      <text x="130" y="165" textAnchor="middle" fontFamily="monospace" fontSize="5" fill={`${B}0.2)`}>LOX</text>
      <line x1="114" y1="198" x2="146" y2="198" stroke={`${S}0.25)`} strokeWidth="0.5"/>
      <rect x="114" y="198" width="32" height="80" rx="2" fill={`${G}0.04)`} stroke={`${S}0.4)`} strokeWidth="0.5"/>
      <text x="130" y="240" textAnchor="middle" fontFamily="monospace" fontSize="5" fill={`${G}0.2)`}>RP-1</text>
      <rect x="121" y="150" width="18" height="8" rx="1" fill="none" stroke={`${S}0.12)`} strokeWidth="0.5"/>
      <rect x="100" y="265" width="12" height="8" rx="1" fill="none" stroke={`${S}0.3)`} strokeWidth="0.5"/>
      <line x1="103" y1="265" x2="103" y2="273" stroke={`${S}0.15)`} strokeWidth="0.5"/>
      <line x1="106" y1="265" x2="106" y2="273" stroke={`${S}0.15)`} strokeWidth="0.5"/>
      <line x1="109" y1="265" x2="109" y2="273" stroke={`${S}0.15)`} strokeWidth="0.5"/>
      <rect x="148" y="265" width="12" height="8" rx="1" fill="none" stroke={`${S}0.3)`} strokeWidth="0.5"/>
      <line x1="151" y1="265" x2="151" y2="273" stroke={`${S}0.15)`} strokeWidth="0.5"/>
      <line x1="154" y1="265" x2="154" y2="273" stroke={`${S}0.15)`} strokeWidth="0.5"/>
      <line x1="157" y1="265" x2="157" y2="273" stroke={`${S}0.15)`} strokeWidth="0.5"/>
      <path d="M114,278 L102,300 L114,300 Z" fill="rgba(255,255,255,0.02)" stroke={`${S}0.35)`} strokeWidth="0.5"/>
      <path d="M146,278 L158,300 L146,300 Z" fill="rgba(255,255,255,0.02)" stroke={`${S}0.35)`} strokeWidth="0.5"/>
      <path d="M120,278 Q118,290 112,310" fill="none" stroke={`${S}0.4)`} strokeWidth="0.75"/>
      <path d="M140,278 Q142,290 148,310" fill="none" stroke={`${S}0.4)`} strokeWidth="0.75"/>
      <ellipse cx="130" cy="310" rx="18" ry="4" fill="none" stroke={`${S}0.35)`} strokeWidth="0.5"/>
      <ellipse cx="130" cy="308" rx="12" ry="3" fill="none" stroke={`${S}0.25)`} strokeWidth="0.5"/>
      <path d="M130,314 Q138,340 130,380 Q122,340 130,314Z" fill={`${G}0.06)`} stroke={`${G}0.15)`} strokeWidth="0.5"/>
      <path d="M130,316 Q135,338 130,370 Q125,338 130,316Z" fill={`${G}0.1)`} stroke={`${G}0.2)`} strokeWidth="0.5"/>
      <path d="M130,318 Q133,335 130,360 Q127,335 130,318Z" fill={`${G}0.18)`} stroke={`${G}0.3)`} strokeWidth="0.5"/>
    </svg>
  );
}

/* ── illustration map ── */
const ILLUSTRATION_MAP: Record<string, () => React.JSX.Element> = {
  ai: AIInfraIllustration,
  energy: EnergyIllustration,
  uavs: UAVIllustration,
  robotics: RoboticsIllustration,
  space: SpaceIllustration,
};

/* ── vertical data ── */
interface VerticalDef {
  id: string;
  name: string;
  description: string;
  chainCount: string;
  comingSoon: boolean;
}

const VERTICALS_DATA: VerticalDef[] = [
  {
    id: "ai",
    name: "AI Infrastructure",
    description: "The complete supply chain map for AI \u2014 from the minerals in the ground to the datacenters they power.",
    chainCount: "17 chains",
    comingSoon: false,
  },
  {
    id: "energy",
    name: "Energy Transition",
    description: "Batteries, solar, wind, grid, and hydrogen \u2014 the materials and manufacturing bottlenecks shaping the pace of decarbonization.",
    chainCount: "6 chains",
    comingSoon: true,
  },
  {
    id: "uavs",
    name: "UAVs",
    description: "Sensors, propulsion, and autonomy stacks for unmanned systems.",
    chainCount: "3 chains",
    comingSoon: true,
  },
  {
    id: "robotics",
    name: "Robotics",
    description: "Motors, sensors, compute, and structure \u2014 every physical input that determines who can build robots at scale.",
    chainCount: "4 chains",
    comingSoon: true,
  },
  {
    id: "space",
    name: "Space",
    description: "Launch, power, and communications for orbital and deep space systems.",
    chainCount: "2 chains",
    comingSoon: true,
  },
];

/* ── static data ── */
const AI_SUBSYSTEMS: Subsystem[] = [
  {
    id: "connectivity",
    name: "Connectivity",
    description: "Fiber, transceivers, and switches that move data between servers, racks, and datacenters.",
    componentCount: "3 components",
    comingSoon: false,
    components: [
      { id: "fiber", name: "Fiber optic cable", detail: "Glass strands carrying light signals between servers, racks, and datacenters. Supply gap of 18% \u2014 preform lines at full utilization.", keyNumber: "720M km/yr \u00b7 18% gap", hasTree: true, comingSoon: false },
      { id: "transceivers", name: "Optical transceivers", detail: "Convert electrical signals to light. Every fiber connection needs one on each end.", keyNumber: null, hasTree: false, comingSoon: true },
      { id: "switches", name: "Network switches", detail: "Route data between servers and racks at terabit scale.", keyNumber: null, hasTree: false, comingSoon: true },
    ],
  },
  {
    id: "compute",
    name: "Compute",
    description: "GPUs, memory, and packaging that run AI training and inference.",
    componentCount: "3 components",
    comingSoon: false,
    components: [
      { id: "gpu", name: "GPUs", detail: "Parallel processors that train and run AI models.", keyNumber: null, hasTree: false, comingSoon: true },
      { id: "hbm", name: "HBM memory", detail: "High-bandwidth memory stacked on GPU packages.", keyNumber: null, hasTree: false, comingSoon: true },
      { id: "servers", name: "Server boards", detail: "PCBs connecting GPU, memory, networking, and power.", keyNumber: null, hasTree: false, comingSoon: true },
    ],
  },
  {
    id: "power",
    name: "Power",
    description: "Grid-to-rack power delivery. Transformers, switchgear, and distribution.",
    componentCount: "1 component",
    comingSoon: false,
    components: [
      { id: "transformers", name: "Power transformers", detail: "Convert grid voltage to datacenter-usable power.", keyNumber: null, hasTree: false, comingSoon: true },
    ],
  },
  {
    id: "cooling",
    name: "Cooling",
    description: "Heat rejection at chip, rack, and facility scale.",
    componentCount: "0 components",
    comingSoon: true,
    components: [],
  },
];

const STATUS_COLORS: Record<string, string> = {
  Constrained: "#a05a4a",
  Tightening: "#9a8540",
  Available: "#4a8a55",
  Oversupplied: "#5a7a8a",
};

/* ── accent colors per input ── */
const INPUT_ACCENT: Record<string, string> = {
  fiber: "#6a9ab8",
  germanium: "#81713c",
  gallium: "#7a8a6a",
};

/* ── sub-components ── */

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? muted;
  return (
    <span style={{
      fontSize: 9, letterSpacing: "0.04em", fontWeight: 500,
      color: c, border: `1px solid ${c}33`,
      borderRadius: 4, padding: "2px 8px",
      textTransform: "uppercase" as const,
      background: "transparent",
    }}>
      {status}
    </span>
  );
}

/* ── Expand button ── */
function ExpandButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute", top: 12, right: 12, zIndex: 5,
        fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: "0.04em",
        color: "#555", background: "rgba(19,18,16,0.8)", border: "1px solid #252220",
        borderRadius: 6, padding: "5px 12px", cursor: "pointer",
      }}
      onMouseEnter={e => { e.currentTarget.style.color = "#ece8e1"; e.currentTarget.style.borderColor = "#3a3835"; }}
      onMouseLeave={e => { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = "#252220"; }}
    >Expand &#8599;</button>
  );
}

/* ── Fullscreen overlay ── */
function FullscreenOverlay({
  treeName,
  onClose,
  children,
}: {
  treeName: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "#111", overflow: "auto",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 28px", borderBottom: "1px solid #252220", flexShrink: 0,
      }}>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#555" }}>
          {treeName} &middot; SUPPLY TREE
        </span>
        <button
          onClick={onClose}
          style={{
            fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: "0.04em",
            color: "#555", background: "rgba(19,18,16,0.8)", border: "1px solid #252220",
            borderRadius: 6, padding: "5px 12px", cursor: "pointer",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "#ece8e1"; e.currentTarget.style.borderColor = "#3a3835"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = "#252220"; }}
        >Close &#10005;</button>
      </div>
      <div style={{ flex: 1, padding: 20 }}>
        {children}
      </div>
    </div>
  );
}

/* ── Tree header ── */
function TreeHeader({ title, href, description, accent }: { title: string; href: string; description: string; accent?: string }) {
  const accentColor = accent ?? "#706a60";
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, color: "#ece8e1", margin: 0 }}>
          {title}
        </h2>
        <a href={href} style={{
          fontSize: 11, color: "#fff", padding: "7px 16px",
          background: accentColor, border: "none", borderRadius: 6,
          textDecoration: "none", transition: "opacity 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >Full analysis &rarr;</a>
      </div>
      <p style={{ fontSize: 13, color: bodyText, lineHeight: 1.6, margin: 0, marginBottom: 44 }}>
        {description}
      </p>
    </div>
  );
}

/* ── Upstream/Downstream chip renderer ── */
function ChipSection({
  label,
  items,
  onNavigate,
  style: wrapperStyle,
}: {
  label: string;
  items: { name: string; navigateTo: string | null; active: boolean }[];
  onNavigate?: (id: string) => void;
  style?: React.CSSProperties;
}) {
  return (
    <div style={wrapperStyle}>
      <p style={{ fontSize: 9, letterSpacing: "0.08em", color: dimmer, textTransform: "uppercase" as const, margin: "0 0 8px 0" }}>{label}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {items.map(item => (
          <span
            key={item.name}
            onClick={() => { if (item.active && item.navigateTo && onNavigate) onNavigate(item.navigateTo); }}
            style={{
              padding: "6px 14px", borderRadius: 6,
              border: `0.5px solid ${item.active ? "#333" : borderColor}`,
              fontSize: 11, color: item.active ? bodyText : muted,
              cursor: item.active ? "pointer" : "default",
              display: "flex", alignItems: "center", gap: 6,
              background: "transparent", transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={e => { if (item.active) { e.currentTarget.style.color = warmWhite; e.currentTarget.style.borderColor = "#444"; } }}
            onMouseLeave={e => { if (item.active) { e.currentTarget.style.color = bodyText; e.currentTarget.style.borderColor = "#333"; } }}
          >
            {item.name}{item.active && " \u2192"}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Fiber supply tree (with full GeCl4 layer) ── */
function FiberSupplyTree({ onNodeClick }: { onNodeClick: (name: string) => void }) {
  const compChain = chainsData.COMP_DATA["GeO\u2082 / GeCl\u2084"];
  const subChain = chainsData.SUB_DATA["Fiber Optics"];
  const compW = useMemo(() => computeCompSvgWidth(compChain), [compChain]);
  const subW = useMemo(() => computeSubSvgWidth(subChain), [subChain]);
  const compGeo = useMemo(() => buildCompGeometry(compChain, compW / 2, 80), [compChain, compW]);
  const subGeo = useMemo(() => buildSubGeometry(subChain, subW / 2, 80), [subChain, subW]);
  const compH = compGeo.outputNode.cy + 120;
  const subH = subGeo.outputNode.cy + 120;
  const subFirstXs = subGeo.layers[0].nodes.map(n => n.cx);
  const lc = chainsData.layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;

  return (
    <>
      <TreeMap geometry={compGeo} nodes={allNodes} layerConfig={lc} svgWidth={compW} svgHeight={compH} onNodeClick={onNodeClick} onLayerClick={() => {}} layerPanels={{}} />
      <svg viewBox={`0 0 ${subW} 80`} preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", height: "auto" }}>
        {subFirstXs.map((tx, i) => {
          const fx = subW / 2;
          return <path key={i} d={`M ${fx},0 C ${fx},40 ${tx},40 ${tx},80`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={0.8} strokeDasharray="4,3" />;
        })}
      </svg>
      <TreeMap geometry={subGeo} nodes={allNodes} layerConfig={lc} svgWidth={subW} svgHeight={subH} onNodeClick={onNodeClick} onLayerClick={() => {}} layerPanels={{}} />
    </>
  );
}

/* ── Germanium supply tree ── */
function GermaniumSupplyTree({ onNodeClick }: { onNodeClick: (name: string) => void }) {
  const rawChain = chainsData.RAW_DATA["Germanium"];
  const rawW = useMemo(() => computeRawSvgWidth(rawChain), [rawChain]);
  const rawGeo = useMemo(() => buildRawGeometry(rawChain, rawW / 2, 80), [rawChain, rawW]);
  const rawH = rawGeo.outputNode.cy + 120;
  const lc = chainsData.layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;

  return (
    <TreeMap geometry={rawGeo} nodes={allNodes} layerConfig={lc} svgWidth={rawW} svgHeight={rawH} onNodeClick={onNodeClick} onLayerClick={() => {}} layerPanels={{}} />
  );
}

/* ── Gallium supply tree ── */
function GalliumSupplyTree({ onNodeClick }: { onNodeClick: (name: string) => void }) {
  const gW = useMemo(() => computeGalliumSvgWidth(galliumChain), []);
  const gGeo = useMemo(() => buildGalliumGeometry(galliumChain, gW / 2, 80), [gW]);
  const gH = gGeo.outputNode.cy + 120;

  return (
    <TreeMap geometry={gGeo} nodes={galliumNodes} layerConfig={galliumLc} svgWidth={gW} svgHeight={gH} onNodeClick={onNodeClick} onLayerClick={() => {}} layerPanels={{}} />
  );
}

/* ═══════════════════════════════════════════ */
/*  TreeView -- main exported component        */
/* ═══════════════════════════════════════════ */

export default function TreeView() {
  const [level, setLevel] = useState<NavLevel>("verticals");
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null);
  const [selectedSubsystem, setSelectedSubsystem] = useState<string | null>(null);
  const [treeTarget, setTreeTarget] = useState<TreeTarget | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<{ label: string; level: NavLevel; vertical?: string | null; subsystem?: string | null; target?: TreeTarget | null }[]>([]);
  const [treeExpanded, setTreeExpanded] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  /* ── accordion expanded index per level ── */
  const [expandedVertical, setExpandedVertical] = useState<number>(() => {
    const idx = VERTICALS_DATA.findIndex(v => !v.comingSoon);
    return idx >= 0 ? idx : 0;
  });
  const [expandedSubsystem, setExpandedSubsystem] = useState<number>(() => {
    const idx = AI_SUBSYSTEMS.findIndex(s => !s.comingSoon);
    return idx >= 0 ? idx : 0;
  });
  const [expandedComponent, setExpandedComponent] = useState<number>(0);

  /* ── navigation helpers ── */
  function goVerticals() {
    setLevel("verticals");
    setSelectedVertical(null);
    setSelectedSubsystem(null);
    setTreeTarget(null);
    setBreadcrumb([]);
    setTreeExpanded(false);
    setAnimKey(k => k + 1);
    setExpandedVertical(() => {
      const idx = VERTICALS_DATA.findIndex(v => !v.comingSoon);
      return idx >= 0 ? idx : 0;
    });
  }

  function goSubsystems(verticalName: string) {
    setLevel("subsystems");
    setSelectedVertical(verticalName);
    setSelectedSubsystem(null);
    setTreeTarget(null);
    setBreadcrumb([{ label: "All verticals", level: "verticals" }]);
    setTreeExpanded(false);
    setAnimKey(k => k + 1);
    setExpandedSubsystem(() => {
      const idx = AI_SUBSYSTEMS.findIndex(s => !s.comingSoon);
      return idx >= 0 ? idx : 0;
    });
  }

  function goComponents(subsystemName: string) {
    setLevel("components");
    setSelectedSubsystem(subsystemName);
    setTreeTarget(null);
    setBreadcrumb([
      { label: "All verticals", level: "verticals" },
      { label: selectedVertical ?? "", level: "subsystems", vertical: selectedVertical },
    ]);
    setTreeExpanded(false);
    setAnimKey(k => k + 1);
    const sub = AI_SUBSYSTEMS.find(s => s.name === subsystemName);
    if (sub) {
      const idx = sub.components.findIndex(c => !c.comingSoon);
      setExpandedComponent(idx >= 0 ? idx : 0);
    }
  }

  function goTree(target: TreeTarget, _label: string) {
    setLevel("tree");
    setTreeTarget(target);
    setTreeExpanded(false);
    setBreadcrumb([
      { label: "All verticals", level: "verticals" },
      { label: selectedVertical ?? "", level: "subsystems", vertical: selectedVertical },
      ...(selectedSubsystem ? [{ label: selectedSubsystem, level: "components" as NavLevel, vertical: selectedVertical, subsystem: selectedSubsystem }] : []),
    ]);
    setAnimKey(k => k + 1);
  }

  function goRawMaterial(rawId: string) {
    const prevBreadcrumb = [...breadcrumb];
    if (treeTarget && treeTarget.type === "component") {
      const compLabel = treeTarget.id === "fiber" ? "Fiber optic cable" : treeTarget.id;
      prevBreadcrumb.push({ label: compLabel, level: "tree", vertical: selectedVertical, subsystem: selectedSubsystem, target: { ...treeTarget } });
    }
    setTreeTarget({ type: "raw-material", id: rawId });
    setLevel("tree");
    setTreeExpanded(false);
    setBreadcrumb(prevBreadcrumb);
    setAnimKey(k => k + 1);
  }

  function handleBreadcrumbClick(bc: typeof breadcrumb[0]) {
    if (bc.level === "verticals") { goVerticals(); return; }
    if (bc.level === "subsystems" && bc.vertical) { goSubsystems(bc.vertical); return; }
    if (bc.level === "components" && bc.subsystem) {
      setSelectedVertical(bc.vertical ?? null);
      goComponents(bc.subsystem);
      return;
    }
    if (bc.level === "tree" && bc.target) {
      setSelectedVertical(bc.vertical ?? null);
      setSelectedSubsystem(bc.subsystem ?? null);
      setTreeTarget(bc.target);
      setLevel("tree");
      setTreeExpanded(false);
      setBreadcrumb(breadcrumb.slice(0, breadcrumb.indexOf(bc)));
      setAnimKey(k => k + 1);
      return;
    }
  }

  /* ── render: breadcrumb ── */
  function renderBreadcrumb() {
    if (breadcrumb.length === 0 && level === "verticals") return null;
    const parts = [...breadcrumb];
    const currentLabel =
      level === "subsystems" ? selectedVertical :
      level === "components" ? selectedSubsystem :
      level === "tree" && treeTarget?.type === "component" && treeTarget.id === "fiber" ? "Fiber optic cable" :
      level === "tree" && treeTarget?.type === "raw-material" ? (treeTarget.id.charAt(0).toUpperCase() + treeTarget.id.slice(1)) :
      null;

    return (
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {parts.map((bc, i) => (
          <React.Fragment key={i}>
            <span
              onClick={() => handleBreadcrumbClick(bc)}
              style={{
                fontSize: 11, color: dimmer, cursor: "pointer", transition: "color 0.15s",
                animation: `breadcrumbEnter 300ms ease-out forwards`,
                animationDelay: `${i * 40}ms`,
                opacity: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = bodyText)}
              onMouseLeave={e => (e.currentTarget.style.color = dimmer)}
            >
              {bc.label}
            </span>
            <span style={{ fontSize: 11, color: dimmer }}>/</span>
          </React.Fragment>
        ))}
        {currentLabel && (
          <span style={{
            fontSize: 11, color: bodyText,
            animation: `breadcrumbEnter 300ms ease-out forwards`,
            animationDelay: `${parts.length * 40}ms`,
            opacity: 0,
          }}>{currentLabel}</span>
        )}
      </div>
    );
  }

  /* ── generic accordion item ── */
  function AccordionItem({
    name,
    description,
    meta,
    comingSoon,
    isExpanded,
    onRowClick,
    onArrowClick,
    index,
  }: {
    name: string;
    description: string;
    meta: string;
    comingSoon: boolean;
    isExpanded: boolean;
    onRowClick: () => void;
    onArrowClick: () => void;
    index: number;
  }) {
    const [hovered, setHovered] = useState(false);

    return (
      <div
        style={{
          padding: isExpanded ? "20px 0" : "16px 0",
          borderBottom: `1px solid ${borderColor}`,
          cursor: "pointer",
          animation: `accordionEnter 350ms ease-out forwards`,
          animationDelay: `${index * 60}ms`,
          opacity: 0,
        }}
        onClick={!isExpanded ? onRowClick : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            fontSize: isExpanded ? 18 : 16,
            color: isExpanded ? warmWhite : (hovered ? "#a09888" : muted),
            fontWeight: isExpanded ? 500 : 400,
            transition: "color 0.15s, font-size 0.15s",
          }}>
            {name}
          </span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              if (!comingSoon) onArrowClick();
            }}
            style={{
              fontSize: 16,
              color: comingSoon ? "#333" : (hovered || isExpanded ? bodyText : dimmer),
              cursor: comingSoon ? "default" : "pointer",
              transition: "color 0.15s",
              padding: "0 4px",
              userSelect: "none",
            }}
          >
            &rarr;
          </span>
        </div>
        {isExpanded && (
          <>
            <p style={{ fontSize: 13, color: muted, margin: "8px 0 6px 0", lineHeight: 1.5 }}>
              {description}
            </p>
            <p style={{ fontSize: 10, color: dimmer, margin: 0, fontStyle: comingSoon ? "italic" : "normal" }}>
              {comingSoon ? "Coming soon" : meta}
            </p>
          </>
        )}
        {!isExpanded && comingSoon && (
          <p style={{ fontSize: 10, color: dimmer, margin: "4px 0 0 0", fontStyle: "italic" }}>
            Coming soon
          </p>
        )}
      </div>
    );
  }

  /* ── two-column layout wrapper ── */
  function TwoColumnLayout({
    sectionLabel,
    items,
    expandedIndex,
    onExpandItem,
    onNavigateItem,
    illustrationId,
  }: {
    sectionLabel: string;
    items: { name: string; description: string; meta: string; comingSoon: boolean; illustrationId?: string }[];
    expandedIndex: number;
    onExpandItem: (i: number) => void;
    onNavigateItem: (i: number) => void;
    illustrationId?: string;
  }) {
    const activeIllustrationId = items[expandedIndex]?.illustrationId ?? illustrationId;
    const IllusComponent = activeIllustrationId ? ILLUSTRATION_MAP[activeIllustrationId] : null;

    return (
      <div style={{ display: "flex", gap: 0, maxWidth: 1100 }}>
        {/* Left column */}
        <div style={{ flex: "0 0 60%", maxWidth: 660 }}>
          {renderBreadcrumb()}
          <p style={{ fontSize: 9, letterSpacing: "0.1em", color: dimmer, margin: "0 0 14px 0", textTransform: "uppercase" as const }}>
            {sectionLabel}
          </p>
          <div key={animKey}>
            {items.map((item, i) => (
              <AccordionItem
                key={item.name}
                name={item.name}
                description={item.description}
                meta={item.meta}
                comingSoon={item.comingSoon}
                isExpanded={expandedIndex === i}
                onRowClick={() => onExpandItem(i)}
                onArrowClick={() => onNavigateItem(i)}
                index={i}
              />
            ))}
          </div>
        </div>
        {/* Right column — sticky illustration */}
        <div style={{ flex: "0 0 40%", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 60 }}>
          <div style={{ position: "sticky", top: 100 }}>
            {IllusComponent && (
              <div
                key={activeIllustrationId}
                style={{
                  opacity: 0.5,
                  animation: "illustrationFade 400ms ease-out forwards",
                }}
              >
                <IllusComponent />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── render: verticals ── */
  function renderVerticals() {
    const items = VERTICALS_DATA.map(v => ({
      name: v.name,
      description: v.description,
      meta: v.chainCount,
      comingSoon: v.comingSoon,
      illustrationId: v.id,
    }));

    return (
      <TwoColumnLayout
        sectionLabel="VERTICALS"
        items={items}
        expandedIndex={expandedVertical}
        onExpandItem={setExpandedVertical}
        onNavigateItem={(i) => {
          if (!VERTICALS_DATA[i].comingSoon) goSubsystems(VERTICALS_DATA[i].name);
        }}
      />
    );
  }

  /* ── render: subsystems ── */
  function renderSubsystems() {
    const items = AI_SUBSYSTEMS.map(s => ({
      name: s.name,
      description: s.description,
      meta: s.componentCount,
      comingSoon: s.comingSoon,
    }));

    return (
      <TwoColumnLayout
        sectionLabel={`SUBSYSTEMS \u00b7 ${selectedVertical?.toUpperCase() ?? ""}`}
        items={items}
        expandedIndex={expandedSubsystem}
        onExpandItem={setExpandedSubsystem}
        onNavigateItem={(i) => {
          if (!AI_SUBSYSTEMS[i].comingSoon) goComponents(AI_SUBSYSTEMS[i].name);
        }}
      />
    );
  }

  /* ── render: components ── */
  function renderComponents() {
    const sub = AI_SUBSYSTEMS.find(s => s.name === selectedSubsystem);
    if (!sub) return null;

    const items = sub.components.map(c => ({
      name: c.name,
      description: c.detail,
      meta: c.keyNumber ?? "",
      comingSoon: c.comingSoon,
    }));

    return (
      <TwoColumnLayout
        sectionLabel={`COMPONENTS \u00b7 ${selectedSubsystem?.toUpperCase() ?? ""}`}
        items={items}
        expandedIndex={expandedComponent}
        onExpandItem={setExpandedComponent}
        onNavigateItem={(i) => {
          const c = sub.components[i];
          if (!c.comingSoon && c.hasTree) goTree({ type: "component", id: c.id }, c.name);
        }}
      />
    );
  }

  /* ── chip data for upstream/downstream ── */
  const FIBER_UPSTREAM = [
    { name: "Germanium", navigateTo: "germanium", active: true },
    { name: "Helium", navigateTo: null, active: false },
    { name: "Silica / SiCl\u2084", navigateTo: null, active: false },
  ];
  const FIBER_DOWNSTREAM = [
    { name: "AI datacenters", navigateTo: null, active: false },
    { name: "Telecom", navigateTo: null, active: false },
    { name: "Subsea cables", navigateTo: null, active: false },
    { name: "Military / UAV", navigateTo: null, active: false },
    { name: "BEAD broadband", navigateTo: null, active: false },
  ];
  const GERMANIUM_DOWNSTREAM_CHIPS = [
    { name: "Fiber optic cable", navigateTo: "fiber", active: true },
    { name: "IR optics", navigateTo: null, active: false },
    { name: "Satellite solar cells", navigateTo: null, active: false },
    { name: "SiGe semiconductors", navigateTo: null, active: false },
  ];
  const GALLIUM_DOWNSTREAM_CHIPS = [
    { name: "GaN power semiconductors", navigateTo: null, active: false },
    { name: "GaAs substrates & devices", navigateTo: null, active: false },
    { name: "GaN RF and defense radar", navigateTo: null, active: false },
    { name: "LED lighting", navigateTo: null, active: false },
  ];

  /* ── render: tree view (component or raw-material) ── */
  function renderTree() {
    if (!treeTarget) return null;

    /* ── Fiber optic cable tree ── */
    if (treeTarget.type === "component" && treeTarget.id === "fiber") {
      const fiberTree = (
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: 10, overflow: "hidden", background: "#131210" }}>
          <FiberSupplyTree onNodeClick={() => {}} />
        </div>
      );

      return (
        <div key={animKey} style={{ maxWidth: 900, margin: "0 auto", animation: "treeEnter 400ms ease-out forwards" }}>
          {renderBreadcrumb()}
          <TreeHeader
            title="Fiber optic cable"
            href="/input/fiber-optic-cable"
            description="Glass strands carrying light signals between servers, racks, and datacenters. The physical backbone of AI infrastructure connectivity."
            accent={INPUT_ACCENT.fiber}
          />

          <ChipSection
            label="Upstream"
            items={FIBER_UPSTREAM}
            onNavigate={(id) => goRawMaterial(id)}
            style={{ marginBottom: 20 }}
          />

          <div style={{ position: "relative" }}>
            <ExpandButton onClick={() => setTreeExpanded(true)} />
            {fiberTree}
          </div>

          <ChipSection
            label="Downstream"
            items={FIBER_DOWNSTREAM}
            style={{ marginTop: 40 }}
          />

          {treeExpanded && (
            <FullscreenOverlay treeName="FIBER OPTIC CABLE" onClose={() => setTreeExpanded(false)}>
              {fiberTree}
            </FullscreenOverlay>
          )}
        </div>
      );
    }

    /* ── Germanium tree ── */
    if (treeTarget.type === "raw-material" && treeTarget.id === "germanium") {
      const geTree = (
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: 10, overflow: "hidden", background: "#131210" }}>
          <GermaniumSupplyTree onNodeClick={() => {}} />
        </div>
      );

      return (
        <div key={animKey} style={{ maxWidth: 900, margin: "0 auto", animation: "treeEnter 400ms ease-out forwards" }}>
          {renderBreadcrumb()}
          <TreeHeader
            title="Germanium"
            href="/input/germanium"
            description="Trace element doped into glass to create the refractive index that allows fiber optic cable to carry light. Also used in IR defense optics, satellite solar cells, and SiGe semiconductors."
            accent={INPUT_ACCENT.germanium}
          />

          <div style={{ position: "relative" }}>
            <ExpandButton onClick={() => setTreeExpanded(true)} />
            {geTree}
          </div>

          <ChipSection
            label="Downstream"
            items={GERMANIUM_DOWNSTREAM_CHIPS}
            onNavigate={(id) => {
              if (id === "fiber") {
                setTreeTarget({ type: "component", id: "fiber" });
                setTreeExpanded(false);
                setBreadcrumb([
                  { label: "All verticals", level: "verticals" },
                  { label: selectedVertical ?? "", level: "subsystems", vertical: selectedVertical },
                  ...(selectedSubsystem ? [{ label: selectedSubsystem, level: "components" as NavLevel, vertical: selectedVertical, subsystem: selectedSubsystem }] : []),
                ]);
                setAnimKey(k => k + 1);
              }
            }}
            style={{ marginTop: 40 }}
          />

          {treeExpanded && (
            <FullscreenOverlay treeName="GERMANIUM" onClose={() => setTreeExpanded(false)}>
              {geTree}
            </FullscreenOverlay>
          )}
        </div>
      );
    }

    /* ── Gallium tree ── */
    if (treeTarget.type === "raw-material" && treeTarget.id === "gallium") {
      const gaTree = (
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: 10, overflow: "hidden", background: "#131210" }}>
          <GalliumSupplyTree onNodeClick={() => {}} />
        </div>
      );

      return (
        <div key={animKey} style={{ maxWidth: 900, margin: "0 auto", animation: "treeEnter 400ms ease-out forwards" }}>
          {renderBreadcrumb()}
          <TreeHeader
            title="Gallium"
            href="/input/gallium"
            description="Byproduct of alumina refining. Forms compound semiconductors (GaAs, GaN) for AI datacenter power conversion, 5G amplifiers, defense radar, and LED lighting."
            accent={INPUT_ACCENT.gallium}
          />

          <div style={{ position: "relative" }}>
            <ExpandButton onClick={() => setTreeExpanded(true)} />
            {gaTree}
          </div>

          <ChipSection
            label="Downstream"
            items={GALLIUM_DOWNSTREAM_CHIPS}
            style={{ marginTop: 40 }}
          />

          {treeExpanded && (
            <FullscreenOverlay treeName="GALLIUM" onClose={() => setTreeExpanded(false)}>
              {gaTree}
            </FullscreenOverlay>
          )}
        </div>
      );
    }

    return (
      <div style={{ fontSize: 14, color: dimText, padding: "40px 0" }}>
        Tree view not yet available for this item.
      </div>
    );
  }

  /* ── main render ── */
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", margin: "0 auto", padding: "32px 32px 80px", minHeight: "100vh", background: "#111" }}>
      {level === "verticals" && renderVerticals()}
      {level === "subsystems" && renderSubsystems()}
      {level === "components" && renderComponents()}
      {level === "tree" && renderTree()}

      {/* Animation keyframes */}
      <style>{`
        @keyframes accordionEnter {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes illustrationFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes treeEnter {
          from { opacity: 0; transform: scale(0.99); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes breadcrumbEnter {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
