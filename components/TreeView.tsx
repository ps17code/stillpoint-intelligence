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
  contentAwareSpread,
  PALETTES,
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

/* ── Connectivity illustration ── */
function ConnectivityIllustration() {
  return (
    <svg width="280" height="320" viewBox="0 0 280 320" fill="none">
      <rect x="20" y="100" width="40" height="120" rx="3" stroke="#3a3530" strokeWidth="0.75" />
      {[116,128,140,152,164,176,188,200].map(y => <line key={y} x1="28" y1={y} x2="52" y2={y} stroke="#3a3530" strokeWidth="0.5" />)}
      <circle cx="54" cy="116" r="1.5" fill="#a05a4a" opacity="0.6" /><circle cx="54" cy="128" r="1.5" fill="#4a8a55" opacity="0.6" />
      <circle cx="54" cy="140" r="1.5" fill="#4a8a55" opacity="0.6" /><circle cx="54" cy="152" r="1.5" fill="#a05a4a" opacity="0.6" />
      <circle cx="54" cy="164" r="1.5" fill="#4a8a55" opacity="0.6" /><circle cx="54" cy="176" r="1.5" fill="#9a8540" opacity="0.6" />
      <circle cx="54" cy="188" r="1.5" fill="#4a8a55" opacity="0.6" /><circle cx="54" cy="200" r="1.5" fill="#4a8a55" opacity="0.6" />
      <rect x="220" y="100" width="40" height="120" rx="3" stroke="#3a3530" strokeWidth="0.75" />
      {[116,128,140,152,164,176,188,200].map(y => <line key={y} x1="228" y1={y} x2="252" y2={y} stroke="#3a3530" strokeWidth="0.5" />)}
      <path d="M60 130 C100 130, 100 125, 140 125 C180 125, 180 130, 220 130" stroke="#4a4540" strokeWidth="0.5" />
      <path d="M60 142 C95 142, 105 138, 140 138 C175 138, 185 142, 220 142" stroke="#4a4540" strokeWidth="0.5" />
      <path d="M60 154 C100 154, 100 150, 140 150 C180 150, 180 154, 220 154" stroke="#4a4540" strokeWidth="0.5" />
      <path d="M60 166 C95 166, 105 162, 140 162 C175 162, 185 166, 220 166" stroke="#4a4540" strokeWidth="0.5" />
      <path d="M60 178 C100 178, 100 174, 140 174 C180 174, 180 178, 220 178" stroke="#4a4540" strokeWidth="0.5" />
      <path d="M60 190 C95 190, 105 186, 140 186 C175 186, 185 190, 220 190" stroke="#4a4540" strokeWidth="0.5" />
      <circle cx="95" cy="129" r="2" fill="#c9a84c" opacity="0.4"><animate attributeName="cx" values="60;220" dur="3s" repeatCount="indefinite" /></circle>
      <circle cx="160" cy="140" r="2" fill="#c9a84c" opacity="0.3"><animate attributeName="cx" values="220;60" dur="2.5s" repeatCount="indefinite" /></circle>
      <circle cx="110" cy="152" r="2" fill="#c9a84c" opacity="0.35"><animate attributeName="cx" values="60;220" dur="3.5s" repeatCount="indefinite" /></circle>
      <circle cx="180" cy="164" r="2" fill="#c9a84c" opacity="0.3"><animate attributeName="cx" values="220;60" dur="2.8s" repeatCount="indefinite" /></circle>
      <rect x="56" y="124" width="8" height="72" rx="1" stroke="#4a4540" strokeWidth="0.5" fill="#1a1816" />
      <rect x="216" y="124" width="8" height="72" rx="1" stroke="#4a4540" strokeWidth="0.5" fill="#1a1816" />
      <ellipse cx="140" cy="156" rx="12" ry="24" stroke="#3a3530" strokeWidth="0.5" strokeDasharray="2 3" fill="none" />
    </svg>
  );
}

/* ── Fiber optic cable illustration ── */
function FiberIllustration() {
  return (
    <svg width="280" height="320" viewBox="0 0 280 320" fill="none">
      <circle cx="140" cy="140" r="90" stroke="#3a3530" strokeWidth="0.75" fill="none" />
      <circle cx="140" cy="140" r="75" stroke="#2a2520" strokeWidth="0.5" strokeDasharray="3 6" fill="none" />
      {[[140,80],[192,110],[192,170],[140,200],[88,170],[88,110]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="16" stroke="#4a4540" strokeWidth="0.5" fill="#1a1816" />)}
      {[[134,76],[140,76],[146,76],[134,82],[140,82],[146,82]].map(([cx,cy],i) => <circle key={`t1-${i}`} cx={cx} cy={cy} r="2" stroke="#555" strokeWidth="0.3" fill="none" />)}
      <circle cx="140" cy="76" r="0.8" fill="#c9a84c" opacity="0.6" />
      <circle cx="134" cy="82" r="0.8" fill="#c9a84c" opacity="0.6" />
      <circle cx="140" cy="140" r="8" stroke="#3a3530" strokeWidth="0.5" fill="#161412" />
      <line x1="140" y1="235" x2="140" y2="250" stroke="#3a3530" strokeWidth="0.5" strokeDasharray="2 2" />
      <circle cx="140" cy="278" r="24" stroke="#3a3530" strokeWidth="0.5" fill="none" />
      <text x="140" y="308" textAnchor="middle" style={{ fontSize: "8px", fill: "#4a4540" }}>Coating (250&#x3BC;m)</text>
      <circle cx="140" cy="278" r="16" stroke="#4a4540" strokeWidth="0.5" fill="none" />
      <circle cx="140" cy="278" r="4" fill="#c9a84c" opacity="0.3" stroke="#c9a84c" strokeWidth="0.5" />
      <text x="176" y="282" style={{ fontSize: "7px", fill: "#c9a84c", opacity: 0.7 }}>Ge-doped core</text>
    </svg>
  );
}

/* ── Germanium illustration ── */
function GermaniumIllustration() {
  return (
    <svg width="280" height="320" viewBox="0 0 280 320" fill="none">
      <rect x="90" y="30" width="100" height="200" rx="4" stroke="#3a3530" strokeWidth="0.75" fill="none" />
      <rect x="110" y="45" width="60" height="170" rx="2" stroke="#4a4540" strokeWidth="0.5" fill="#161412" />
      <rect x="118" y="55" width="44" height="150" rx="1" fill="none" stroke="#555" strokeWidth="0.3" />
      <rect x="118" y="55" width="44" height="30" rx="1" fill="#3a3530" opacity="0.4" />
      <rect x="118" y="85" width="44" height="30" fill="#3a3530" opacity="0.3" />
      <rect x="118" y="115" width="44" height="30" fill="#3a3530" opacity="0.2" />
      <rect x="118" y="145" width="44" height="30" fill="#c9a84c" opacity="0.08" />
      <rect x="118" y="175" width="44" height="30" rx="1" fill="#c9a84c" opacity="0.15" />
      <rect x="95" y="120" width="90" height="20" rx="2" stroke="#a05a4a" strokeWidth="0.5" fill="none" opacity="0.5" />
      <rect x="118" y="122" width="44" height="16" fill="#a05a4a" opacity="0.15" />
      <line x1="80" y1="140" x2="80" y2="110" stroke="#4a4540" strokeWidth="0.5" />
      <path d="M77 114 L80 108 L83 114" stroke="#4a4540" strokeWidth="0.5" fill="none" />
      <text x="200" y="70" style={{ fontSize: "7px", fill: "#4a4540" }}>Impure</text>
      <text x="200" y="190" style={{ fontSize: "7px", fill: "#c9a84c", opacity: 0.7 }}>5N+ pure Ge</text>
      <g transform="translate(115, 248)">
        <rect x="0" y="0" width="50" height="50" stroke="#3a3530" strokeWidth="0.3" fill="none" />
        <circle cx="0" cy="0" r="3" fill="#c9a84c" opacity="0.2" stroke="#c9a84c" strokeWidth="0.3" />
        <circle cx="50" cy="0" r="3" fill="#c9a84c" opacity="0.2" stroke="#c9a84c" strokeWidth="0.3" />
        <circle cx="0" cy="50" r="3" fill="#c9a84c" opacity="0.2" stroke="#c9a84c" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="3" fill="#c9a84c" opacity="0.2" stroke="#c9a84c" strokeWidth="0.3" />
        <circle cx="25" cy="25" r="3.5" fill="#c9a84c" opacity="0.3" stroke="#c9a84c" strokeWidth="0.5" />
        <line x1="0" y1="0" x2="25" y2="25" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />
        <line x1="50" y1="0" x2="25" y2="25" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />
        <line x1="0" y1="50" x2="25" y2="25" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />
        <line x1="50" y1="50" x2="25" y2="25" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />
      </g>
      <text x="140" y="315" textAnchor="middle" style={{ fontSize: "7px", fill: "#4a4540" }}>Diamond cubic · Ge</text>
    </svg>
  );
}

/* ── Gallium illustration ── */
function GalliumIllustration() {
  return (
    <svg width="280" height="320" viewBox="0 0 280 320" fill="none">
      <rect x="60" y="50" width="160" height="140" rx="4" stroke="#3a3530" strokeWidth="0.75" fill="none" />
      <rect x="62" y="90" width="156" height="98" rx="2" fill="#252220" opacity="0.5" />
      <rect x="85" y="45" width="8" height="110" rx="1" stroke="#4a4540" strokeWidth="0.5" fill="#1a1816" />
      <text x="89" y="40" textAnchor="middle" style={{ fontSize: "7px", fill: "#4a4540" }}>+</text>
      <rect x="187" y="45" width="8" height="110" rx="1" stroke="#4a4540" strokeWidth="0.5" fill="#1a1816" />
      <text x="191" y="40" textAnchor="middle" style={{ fontSize: "7px", fill: "#4a4540" }}>{"\u2212"}</text>
      <circle cx="120" cy="110" r="1.5" fill="#7a8aaa" opacity="0.4"><animate attributeName="cx" values="95;185" dur="4s" repeatCount="indefinite" /></circle>
      <circle cx="140" cy="125" r="1.5" fill="#7a8aaa" opacity="0.3"><animate attributeName="cx" values="95;185" dur="3.2s" repeatCount="indefinite" /></circle>
      <circle cx="110" cy="140" r="1.5" fill="#7a8aaa" opacity="0.35"><animate attributeName="cx" values="95;185" dur="3.8s" repeatCount="indefinite" /></circle>
      <path d="M195 110 C198 120, 199 140, 196 155" stroke="#7a8aaa" strokeWidth="1.5" fill="none" opacity="0.4" />
      <text x="140" y="175" textAnchor="middle" style={{ fontSize: "7px", fill: "#4a4540" }}>{`Bayer liquor (NaAlO\u2082 + Ga\u00B3\u207A)`}</text>
      <line x1="89" y1="45" x2="89" y2="30" stroke="#4a4540" strokeWidth="0.5" />
      <line x1="191" y1="45" x2="191" y2="30" stroke="#4a4540" strokeWidth="0.5" />
      <line x1="89" y1="30" x2="191" y2="30" stroke="#4a4540" strokeWidth="0.5" />
      <rect x="128" y="22" width="24" height="16" rx="2" stroke="#4a4540" strokeWidth="0.5" fill="#161412" />
      <text x="140" y="33" textAnchor="middle" style={{ fontSize: "7px", fill: "#4a4540" }}>DC</text>
      <line x1="140" y1="195" x2="140" y2="215" stroke="#3a3530" strokeWidth="0.5" strokeDasharray="2 2" />
      <ellipse cx="140" cy="240" rx="50" ry="12" stroke="#4a4540" strokeWidth="0.5" fill="#161412" />
      <ellipse cx="140" cy="236" rx="50" ry="12" stroke="#4a4540" strokeWidth="0.5" fill="#1a1816" />
      {[110,120,130,140,150,160,170].map(x => <line key={x} x1={x} y1="233" x2={x} y2="239" stroke="#3a3530" strokeWidth="0.2" />)}
      <text x="140" y="265" textAnchor="middle" style={{ fontSize: "7px", fill: "#7a8aaa", opacity: 0.7 }}>{`GaAs wafer \u00b7 4\u201D`}</text>
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
  connectivity: ConnectivityIllustration,
  fiber: FiberIllustration,
  germanium: GermaniumIllustration,
  gallium: GalliumIllustration,
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
      { id: "fiber", name: "Fiber optic cable", detail: "Glass strands carrying light signals between servers, racks, and datacenters. Supply gap of 18% \u2014 preform lines at full utilization.", keyNumber: "Live", hasTree: true, comingSoon: false },
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
      <p style={{ fontSize: 13, color: bodyText, lineHeight: 1.6, margin: 0, marginBottom: 44, maxWidth: "80%" }}>
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

/* ── Reusable dashed divider with centered label ── */
function DashedDividerLabel({ label, marginTop = 20 }: { label: string; marginTop?: number }) {
  return (
    <div style={{
      width: "100%", display: "flex", alignItems: "center", gap: 16,
      margin: `${marginTop}px 0 0 0`, padding: "0 40px",
    }}>
      <div style={{ flex: 1, height: 0, borderTop: "1px dashed #3a3530" }} />
      <span style={{
        fontSize: 8, letterSpacing: "0.1em", color: "#4a4540",
        textTransform: "uppercase" as const, whiteSpace: "nowrap", padding: "0 4px",
      }}>{label}</span>
      <div style={{ flex: 1, height: 0, borderTop: "1px dashed #3a3530" }} />
    </div>
  );
}

/* ── Fiber supply tree (merged comp + sub into one continuous tree) ── */
function FiberSupplyTree({ onNodeClick }: { onNodeClick: (name: string) => void }) {
  const compChain = chainsData.COMP_DATA["GeO\u2082 / GeCl\u2084"];
  const subChain = chainsData.SUB_DATA["Fiber Optics"];
  const lc = chainsData.layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;

  const svgW = useMemo(() => {
    const widths = [
      compChain.geCl4.length * 175,
      compChain.fiberMfg.length * 175,
      subChain.assembly.length * 175,
      subChain.cableType.length * 175,
    ];
    return Math.max(1800, Math.max(...widths) + 400);
  }, [compChain, subChain]);

  const geo = useMemo(() => {
    const ancX = svgW / 2;
    const topY = 80;
    const gap = 170;

    const gecl4Xs = contentAwareSpread(compChain.geCl4.length, ancX);
    const fiberXs = contentAwareSpread(compChain.fiberMfg.length, ancX);
    const assemblyXs = contentAwareSpread(subChain.assembly.length, ancX);
    const cableXs = contentAwareSpread(subChain.cableType.length, ancX);

    const gecl4CY = topY;
    const fiberCY = topY + gap;
    const assemblyCY = topY + gap * 2;
    const cableCY = topY + gap * 3;
    const outputCY = topY + gap * 4;

    const gecl4Minor = new Set(compChain.minor.geCl4);

    const EDGE_Y1 = 79;
    const EDGE_Y2 = 7;

    const layers = [
      {
        key: "geCl4", label: "GeCl\u2084 SUPPLIERS", cy: gecl4CY,
        nodes: compChain.geCl4.map((n: string, i: number) => ({ name: n, cx: gecl4Xs[i], cy: gecl4CY, opacity: gecl4Minor.has(i) ? 0.4 : 1 })),
        color: PALETTES.geCl4,
      },
      {
        key: "fiberMfg", label: "FIBER MANUFACTURERS", cy: fiberCY,
        nodes: compChain.fiberMfg.map((n: string, i: number) => ({ name: n, cx: fiberXs[i], cy: fiberCY, opacity: 1 })),
        color: PALETTES.fiberMfg,
      },
      {
        key: "assembly", label: "ASSEMBLY", cy: assemblyCY,
        nodes: subChain.assembly.map((n: string, i: number) => ({ name: n, cx: assemblyXs[i], cy: assemblyCY, opacity: 1 })),
        color: PALETTES.assembly,
      },
      {
        key: "cableType", label: "CABLE TYPE", cy: cableCY,
        nodes: subChain.cableType.map((n: string, i: number) => ({ name: n, cx: cableXs[i], cy: cableCY, opacity: 1 })),
        color: PALETTES.cableType,
      },
      {
        key: "output", label: "OUTPUT", cy: outputCY,
        nodes: [{ name: subChain.output, cx: ancX, cy: outputCY, opacity: 1 }],
        color: PALETTES.cableType,
      },
    ];

    const edges = [
      // GeCl4 -> Fiber Mfg
      ...compChain.geCl4ToFiber.map(([fi, ti]: [number, number]) => ({
        x1: gecl4Xs[fi], y1: gecl4CY + EDGE_Y1,
        x2: fiberXs[ti], y2: fiberCY - EDGE_Y2,
        color: PALETTES.geCl4.stroke, fromLayer: 0,
      })),
      // Fiber Mfg -> Assembly (direct connections)
      ...([[0,0],[0,3],[1,1],[1,5],[2,4],[3,2],[4,2],[5,0]] as [number,number][]).map(([fi, ti]) => ({
        x1: fiberXs[fi], y1: fiberCY + EDGE_Y1,
        x2: assemblyXs[ti], y2: assemblyCY - EDGE_Y2,
        color: PALETTES.fiberMfg.stroke, fromLayer: 1,
      })),
      // Assembly -> Cable Type
      ...subChain.assToType.map(([fi, ti]: [number, number]) => ({
        x1: assemblyXs[fi], y1: assemblyCY + EDGE_Y1,
        x2: cableXs[ti], y2: cableCY - EDGE_Y2,
        color: PALETTES.assembly.stroke, fromLayer: 2,
      })),
      // Cable Type -> Output
      ...subChain.cableType.map((_: string, i: number) => ({
        x1: cableXs[i], y1: cableCY + EDGE_Y1,
        x2: ancX, y2: outputCY - EDGE_Y2,
        color: PALETTES.cableType.stroke, fromLayer: 3,
      })),
    ];

    return {
      layers,
      edges,
      outputNode: { name: subChain.output, cx: ancX, cy: outputCY },
    };
  }, [svgW, compChain, subChain]);

  const svgH = geo.outputNode.cy + 120;

  return (
    <TreeMap geometry={geo} nodes={allNodes} layerConfig={lc} svgWidth={svgW} svgHeight={svgH} onNodeClick={onNodeClick} onLayerClick={() => {}} layerPanels={{}} />
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
/*  Path-based navigation types                */
/* ═══════════════════════════════════════════ */

type PathEntry = {
  type: "vertical" | "subsystem" | "component" | "raw-material";
  id: string;
  name: string;
};

/* ═══════════════════════════════════════════ */
/*  Spine sub-components                       */
/* ═══════════════════════════════════════════ */

function SpineAncestorNode({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        cursor: "pointer",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12">
        <circle cx="6" cy="6" r="4.5" fill="none" stroke="rgba(155,168,171,0.3)" strokeWidth="1" />
      </svg>
      <p style={{
        fontSize: 10, fontFamily: "'EB Garamond', Georgia, serif",
        color: "#706a60", margin: 0, transition: "color 0.15s",
      }}
        onMouseEnter={e => (e.currentTarget.style.color = "#a09888")}
        onMouseLeave={e => (e.currentTarget.style.color = "#706a60")}
      >{name}</p>
    </div>
  );
}

function SpineDashedLine() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2px 0" }}>
      <svg width="2" height="28" viewBox="0 0 2 28">
        <line x1="1" y1="0" x2="1" y2="28" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" strokeDasharray="4,3" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*  TreeView -- main exported component        */
/* ═══════════════════════════════════════════ */

export default function TreeView() {
  /* ── unified path state ── */
  const [path, setPath] = useState<PathEntry[]>([]);
  const [animKey, setAnimKey] = useState(0);
  /* ── accordion expanded index (for verticals level only) ── */
  const [expandedVertical, setExpandedVertical] = useState<number>(() => {
    const idx = VERTICALS_DATA.findIndex(v => !v.comingSoon);
    return idx >= 0 ? idx : 0;
  });

  /* ── navigation helpers ── */
  function pushPath(entry: PathEntry) {
    setPath(prev => [...prev, entry]);
    setAnimKey(k => k + 1);

  }

  function popToIndex(index: number) {
    setPath(prev => prev.slice(0, index + 1));
    setAnimKey(k => k + 1);

  }

  function goHome() {
    setPath([]);
    setAnimKey(k => k + 1);

    setExpandedVertical(() => {
      const idx = VERTICALS_DATA.findIndex(v => !v.comingSoon);
      return idx >= 0 ? idx : 0;
    });
  }

  /* ── derive current level from path ── */
  const currentLevel: "verticals" | "subsystems" | "components" | "tree" =
    path.length === 0
      ? "verticals"
      : path[path.length - 1].type === "vertical"
        ? "subsystems"
        : path[path.length - 1].type === "subsystem"
          ? "components"
          : "tree";

  /* ── lookups from path ── */
  const currentVertical = path.find(p => p.type === "vertical");
  const currentSubsystem = path.find(p => p.type === "subsystem");
  const currentComponent = path.find(p => p.type === "component");
  const currentRawMaterial = path.find(p => p.type === "raw-material");
  const lastEntry = path.length > 0 ? path[path.length - 1] : null;

  /* ── chip data for upstream/downstream ── */
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

  /* ── render: breadcrumb ── */
  function renderBreadcrumb() {
    const labels = ["All verticals", ...path.map(p => p.name)];

    return (
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", minHeight: 16 }}>
        {labels.map((label, i) => {
          const isLast = i === labels.length - 1;
          const clickHandler = () => {
            if (i === 0) goHome();
            else popToIndex(i - 1);
          };
          return (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ fontSize: 11, color: dimmer }}>/</span>}
              <span
                onClick={isLast ? undefined : clickHandler}
                style={{
                  fontSize: 11,
                  color: isLast ? bodyText : dimmer,
                  cursor: isLast ? "default" : "pointer",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => { if (!isLast) e.currentTarget.style.color = bodyText; }}
                onMouseLeave={e => { if (!isLast) e.currentTarget.style.color = dimmer; }}
              >
                {label}
              </span>
            </React.Fragment>
          );
        })}
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
          cursor: comingSoon ? "default" : "pointer",
          animation: `accordionEnter 350ms ease-out forwards`,
          animationDelay: `${index * 60}ms`,
          opacity: 0,
        }}
        onMouseEnter={() => { setHovered(true); if (!comingSoon) onRowClick(); }}
        onMouseLeave={() => setHovered(false)}
        onClick={() => { if (!comingSoon) onArrowClick(); }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            fontSize: isExpanded ? 18 : 16,
            color: isExpanded ? warmWhite : (hovered ? bodyText : muted),
            fontWeight: isExpanded ? 500 : 400,
            transition: "color 0.15s, font-size 0.15s",
          }}>
            {name}
          </span>
          {!comingSoon && (
            <span style={{
              fontSize: 16,
              color: hovered || isExpanded ? bodyText : dimmer,
              transition: "color 0.15s",
              padding: "0 4px",
              userSelect: "none" as const,
            }}>
              &rarr;
            </span>
          )}
        </div>
        {isExpanded && (
          <>
            <p style={{ fontSize: 13, color: muted, margin: "8px 0 6px 0", lineHeight: 1.5, maxWidth: 480 }}>
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

  /* ── node row (supply-tree-style horizontal nodes) ── */
  function NodeRow({
    nodes,
    onNodeClick,
  }: {
    nodes: { id: string; name: string; pill: string; clickable: boolean; dimmed?: boolean }[];
    onNodeClick: (id: string) => void;
  }) {
    return (
      <div key={animKey} style={{ display: "flex", justifyContent: "center", gap: 32, padding: "20px 0" }}>
        {nodes.map((node, i) => (
          <div
            key={node.id}
            onClick={() => { if (node.clickable) onNodeClick(node.id); }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              cursor: node.clickable ? "pointer" : "default",
              opacity: node.dimmed ? 0.4 : 1,
              animation: `accordionEnter 350ms ease-out forwards`,
              animationDelay: `${i * 80}ms`,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="5.5" fill="none" stroke="rgba(155,168,171,0.5)" strokeWidth="1.3" />
            </svg>
            <p style={{
              fontSize: 11, fontFamily: "'EB Garamond', Georgia, serif",
              fontWeight: 600, color: node.dimmed ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.82)",
              margin: 0, textAlign: "center", whiteSpace: "nowrap",
            }}>{node.name}</p>
            {node.pill && node.pill !== "Live" && node.pill !== "Coming soon" && (
              <span style={{
                fontSize: 7, fontFamily: "'Geist Mono', monospace", letterSpacing: "0.04em",
                color: node.dimmed ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.62)",
                background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.18)",
                borderRadius: 3, padding: "2px 8px",
              }}>{node.pill}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  /* ── two-column layout wrapper (verticals level only) ── */
  function TwoColumnLayout({
    title,
    subtitle,
    titleSize,
    items,
    expandedIndex,
    onExpandItem,
    onNavigateItem,
    illustrationId,
  }: {
    title: string;
    subtitle: string;
    titleSize?: number;
    items: { name: string; description: string; meta: string; comingSoon: boolean; illustrationId?: string }[];
    expandedIndex: number;
    onExpandItem: (i: number) => void;
    onNavigateItem: (i: number) => void;
    illustrationId?: string;
  }) {
    const activeIllustrationId = items[expandedIndex]?.illustrationId ?? illustrationId;
    const IllusComponent = activeIllustrationId ? ILLUSTRATION_MAP[activeIllustrationId] : null;

    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 32px 80px", minHeight: "100vh", background: "#111" }}>
        {/* Breadcrumb */}
        {renderBreadcrumb()}

        {/* Full-width contextual header */}
        <h1 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: titleSize ?? 32,
          fontWeight: 400,
          color: warmWhite,
          margin: "0 0 8px 0",
        }}>
          {title}
        </h1>
        <p style={{
          fontSize: titleSize === 36 ? 14 : 13,
          color: muted,
          lineHeight: 1.6,
          margin: "0 0 0 0",
          maxWidth: "80%",
        }}>
          {subtitle}
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: borderColor, margin: "28px 0 28px 0" }} />

        {/* Two-column grid: accordion left, illustration right */}
        <div style={{ display: "flex", gap: 0 }}>
          {/* Left column -- accordion */}
          <div style={{ flex: "0 0 60%", maxWidth: 540 }}>
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
          {/* Right column -- illustration centered vertically */}
          <div style={{ flex: "0 0 40%", display: "flex", alignItems: "center", justifyContent: "center" }}>
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

  /* ── render: verticals (level 1 — accordion + illustration) ── */
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
        title="Explore emerging frontiers."
        subtitle="Trace value chains from raw material to end use — every node, every bottleneck, every player."
        titleSize={36}
        items={items}
        expandedIndex={expandedVertical}
        onExpandItem={setExpandedVertical}
        onNavigateItem={(i) => {
          if (!VERTICALS_DATA[i].comingSoon) {
            pushPath({ type: "vertical", id: VERTICALS_DATA[i].id, name: VERTICALS_DATA[i].name });
          }
        }}
      />
    );
  }

  /* ── contextual header derived from path ── */
  function renderContextualHeader() {
    if (!lastEntry) return null;

    let title = "";
    let subtitle = "";
    let showAnalysisButton = false;
    let analysisHref = "";
    let accent: string | undefined;

    if (lastEntry.type === "vertical") {
      const vertData = VERTICALS_DATA.find(v => v.id === lastEntry.id);
      title = lastEntry.name;
      subtitle = vertData?.description ?? "";
    } else if (lastEntry.type === "subsystem") {
      const subData = AI_SUBSYSTEMS.find(s => s.id === lastEntry.id);
      title = lastEntry.name;
      subtitle = subData?.description ?? "";
    } else if (lastEntry.type === "component") {
      const sub = currentSubsystem ? AI_SUBSYSTEMS.find(s => s.id === currentSubsystem.id) : null;
      const comp = sub?.components.find(c => c.id === lastEntry.id);
      title = lastEntry.name;
      subtitle = comp?.detail ?? "";
      showAnalysisButton = true;
      analysisHref = `/input/${lastEntry.id === "fiber" ? "fiber-optic-cable" : lastEntry.id}`;
      accent = INPUT_ACCENT[lastEntry.id];
    } else if (lastEntry.type === "raw-material") {
      title = lastEntry.name;
      if (lastEntry.id === "germanium") {
        subtitle = "Trace element doped into glass to create the refractive index that allows fiber optic cable to carry light. Also used in IR defense optics, satellite solar cells, and SiGe semiconductors.";
        accent = INPUT_ACCENT.germanium;
      } else if (lastEntry.id === "gallium") {
        subtitle = "Byproduct of alumina refining. Forms compound semiconductors (GaAs, GaN) for AI datacenter power conversion, 5G amplifiers, defense radar, and LED lighting.";
        accent = INPUT_ACCENT.gallium;
      }
      showAnalysisButton = true;
      analysisHref = `/input/${lastEntry.id}`;
    }

    if (showAnalysisButton) {
      return (
        <TreeHeader
          title={title}
          href={analysisHref}
          description={subtitle}
          accent={accent}
        />
      );
    }

    return (
      <>
        <h1 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 32, fontWeight: 400, color: warmWhite,
          margin: "0 0 8px 0",
        }}>
          {title}
        </h1>
        <p style={{ fontSize: 13, color: muted, lineHeight: 1.6, margin: 0, maxWidth: "80%" }}>
          {subtitle}
        </p>
      </>
    );
  }

  /* ── container content based on current level ── */
  function renderContainerContent() {
    if (currentLevel === "subsystems") {
      const nodes = AI_SUBSYSTEMS.map(s => ({
        id: s.id,
        name: s.name,
        pill: s.componentCount,
        clickable: !s.comingSoon,
        dimmed: s.comingSoon,
      }));
      return (
        <NodeRow nodes={nodes} onNodeClick={(id) => {
          const sub = AI_SUBSYSTEMS.find(s => s.id === id);
          if (sub) pushPath({ type: "subsystem", id: sub.id, name: sub.name });
        }} />
      );
    }

    if (currentLevel === "components") {
      const sub = currentSubsystem ? AI_SUBSYSTEMS.find(s => s.id === currentSubsystem.id) : null;
      if (!sub) return null;
      const nodes = sub.components.map(c => ({
        id: c.id,
        name: c.name,
        pill: c.keyNumber ?? "Coming soon",
        clickable: !c.comingSoon && c.hasTree,
        dimmed: c.comingSoon,
      }));
      return (
        <NodeRow nodes={nodes} onNodeClick={(id) => {
          const comp = sub.components.find(c => c.id === id);
          if (comp && comp.hasTree) pushPath({ type: "component", id: comp.id, name: comp.name });
        }} />
      );
    }

    if (currentLevel === "tree") {
      return renderTreeContent();
    }

    return null;
  }

  /* ── tree content inside the container ── */
  function renderTreeContent() {
    if (!lastEntry) return null;

    /* ── Fiber optic cable tree ── */
    if (lastEntry.type === "component" && lastEntry.id === "fiber") {
      const fiberCompW = computeCompSvgWidth(chainsData.COMP_DATA["GeO\u2082 / GeCl\u2084"]);
      return (
        <>
          {/* Raw material nodes as SVG matching tree width */}
          <svg viewBox={`0 0 ${fiberCompW} 100`} preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", height: "auto" }}>
            {/* RAW MATERIALS layer label — centered above nodes with padding */}
            <text x={fiberCompW / 2} y={12} textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize={9} letterSpacing="0.12em" fill="#4a4540">RAW MATERIALS</text>
            {[
              { x: fiberCompW / 2 - 200, name: "Germanium", clickable: true, dimmed: false },
              { x: fiberCompW / 2, name: "Helium", clickable: false, dimmed: true },
              { x: fiberCompW / 2 + 200, name: "Silica / SiCl\u2084", clickable: false, dimmed: true },
            ].map((rm, i) => (
              <g key={i}
                style={{ cursor: rm.clickable ? "pointer" : "default", opacity: rm.dimmed ? 0.4 : 1 }}
                onClick={() => {
                  if (rm.clickable) {
                    setPath([
                      { type: "vertical", id: currentVertical?.id ?? "ai", name: currentVertical?.name ?? "AI Infrastructure" },
                      { type: "raw-material", id: "germanium", name: "Germanium" },
                    ]);
                    setAnimKey(k => k + 1);
                  }
                }}
              >
                <circle cx={rm.x} cy={42} r={5.5} fill="none" stroke="rgba(155,168,171,0.5)" strokeWidth={1.3} />
                <text x={rm.x} y={64} textAnchor="middle" fontFamily="'EB Garamond', Georgia, serif" fontSize={13} fontWeight={600} fill="rgba(255,255,255,0.82)">{rm.name}</text>
                <line x1={rm.x} y1={70} x2={rm.x} y2={100} stroke="rgba(255,255,255,0.18)" strokeWidth={0.8} strokeDasharray="4,3" />
              </g>
            ))}
          </svg>

          {/* Dashed divider: RAW MATERIALS above / SUPPLY CHAIN below */}
          <DashedDividerLabel label="FIBER OPTIC SUPPLY CHAIN" marginTop={20} />

          {/* Supply tree */}
          <FiberSupplyTree onNodeClick={() => {}} />

          {/* Downstream demand */}
          <DashedDividerLabel label="DOWNSTREAM DEMAND" />
          <NodeRow nodes={[
            { id: "ai-dc", name: "AI Datacenters", pill: "~210M km", clickable: false, dimmed: false },
            { id: "telecom", name: "Terrestrial Telecom", pill: "~290M km", clickable: false, dimmed: false },
            { id: "subsea", name: "Subsea Cables", pill: "~70M km", clickable: false, dimmed: false },
            { id: "military", name: "Military / UAV", pill: "~55M km", clickable: false, dimmed: false },
            { id: "bead", name: "BEAD Broadband", pill: "~65M km", clickable: false, dimmed: false },
          ]} onNodeClick={() => {}} />
        </>
      );
    }

    /* ── Germanium tree ── */
    if (lastEntry.type === "raw-material" && lastEntry.id === "germanium") {
      return (
        <>
          <DashedDividerLabel label="GERMANIUM SUPPLY CHAIN" marginTop={0} />
          <GermaniumSupplyTree onNodeClick={() => {}} />
          <DashedDividerLabel label="DOWNSTREAM DEMAND" />
          <NodeRow nodes={[
            { id: "fiber", name: "Fiber Optic Cable", pill: "~87t/yr", clickable: true, dimmed: false },
            { id: "ir", name: "IR Optics", pill: "~55t/yr", clickable: false, dimmed: false },
            { id: "solar", name: "Satellite Solar", pill: "~35t/yr", clickable: false, dimmed: false },
            { id: "sige", name: "SiGe Chips", pill: "~25t/yr", clickable: false, dimmed: false },
          ]} onNodeClick={(id) => {
            if (id === "fiber") {
              setPath([
                { type: "vertical", id: currentVertical?.id ?? "ai", name: currentVertical?.name ?? "AI Infrastructure" },
                { type: "subsystem", id: "connectivity", name: "Connectivity" },
                { type: "component", id: "fiber", name: "Fiber optic cable" },
              ]);
              setAnimKey(k => k + 1);
            }
          }} />
        </>
      );
    }

    /* ── Gallium tree ── */
    if (lastEntry.type === "raw-material" && lastEntry.id === "gallium") {
      return (
        <>
          <DashedDividerLabel label="GALLIUM SUPPLY CHAIN" marginTop={0} />
          <GalliumSupplyTree onNodeClick={() => {}} />
          <DashedDividerLabel label="DOWNSTREAM DEMAND" />
          <NodeRow nodes={[
            { id: "gan", name: "GaN Power", pill: "~110t/yr", clickable: false, dimmed: false },
            { id: "gaas", name: "GaAs Devices", pill: "~140t/yr", clickable: false, dimmed: false },
            { id: "ndfeb", name: "NdFeB Magnets", pill: "~80t/yr", clickable: false, dimmed: false },
            { id: "led", name: "LEDs", pill: "~75t/yr", clickable: false, dimmed: false },
            { id: "defense", name: "Defense Radar", pill: "~25t/yr", clickable: false, dimmed: false },
          ]} onNodeClick={() => {}} />
        </>
      );
    }

    return (
      <div style={{ fontSize: 14, color: dimText, padding: "40px 0", textAlign: "center" }}>
        Tree view not yet available for this item.
      </div>
    );
  }

  /* ── downstream chips for tree level ── */
  function renderDownstreamChips() {
    if (!lastEntry) return null;

    if (lastEntry.type === "component" && lastEntry.id === "fiber") {
      return (
        <ChipSection
          label="Downstream"
          items={FIBER_DOWNSTREAM}
          style={{ marginTop: 40 }}
        />
      );
    }

    if (lastEntry.type === "raw-material" && lastEntry.id === "germanium") {
      return (
        <ChipSection
          label="Downstream"
          items={GERMANIUM_DOWNSTREAM_CHIPS}
          onNavigate={(id) => {
            if (id === "fiber") {
              // Navigate back to fiber: reset path to vertical > subsystem > component
              setPath([
                { type: "vertical", id: currentVertical?.id ?? "ai", name: currentVertical?.name ?? "AI Infrastructure" },
                { type: "subsystem", id: "connectivity", name: "Connectivity" },
                { type: "component", id: "fiber", name: "Fiber optic cable" },
              ]);
              setAnimKey(k => k + 1);
          
            }
          }}
          style={{ marginTop: 40 }}
        />
      );
    }

    if (lastEntry.type === "raw-material" && lastEntry.id === "gallium") {
      return (
        <ChipSection
          label="Downstream"
          items={GALLIUM_DOWNSTREAM_CHIPS}
          style={{ marginTop: 40 }}
        />
      );
    }

    return null;
  }

  /* ── main render ── */
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#111" }}>
      {path.length === 0 ? (
        /* Level 1: Vertical selector (accordion + illustration) */
        renderVerticals()
      ) : (
        /* Levels 2+: Spine + container */
        <div style={{ padding: "32px 0 80px" }}>
          {/* Header area — constrained to 900px */}
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px" }}>
            {renderBreadcrumb()}
            {renderContextualHeader()}
            <div style={{ height: 1, background: borderColor, margin: "28px 0" }} />
          </div>

          {/* Spine + container — centered on full page width */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Spine nodes */}
            {path.map((entry, i) => (
              <React.Fragment key={`spine-${i}`}>
                <SpineAncestorNode
                  name={entry.name}
                  onClick={() => {
                    if (i === 0) goHome();
                    else popToIndex(i - 1);
                  }}
                />
                <SpineDashedLine />
              </React.Fragment>
            ))}

            {/* Container */}
            <div style={{ width: currentLevel === "tree" ? "90vw" : "auto", maxWidth: currentLevel === "tree" ? 1400 : 900, padding: "0 32px" }}>
              <div
                key={animKey}
                style={{
                  background: "#1a1816",
                  borderRadius: 10,
                  padding: currentLevel === "tree" ? "32px 20px 40px" : "0 20px",
                  animation: "containerOpen 350ms ease-out forwards",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {renderContainerContent()}
              </div>
            </div>
          </div>

          {/* Downstream demand is now inside the container */}
        </div>
      )}

      {/* Fullscreen overlay (disabled) */}

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
        @keyframes containerOpen {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
