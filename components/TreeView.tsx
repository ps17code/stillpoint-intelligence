"use client";
import React, { useState, useMemo, useCallback, useRef } from "react";
import HorizontalTree from "@/components/HorizontalTree";
import AISupplyTree from "@/components/AISupplyTree";
import ChainAnalysis, { CHAIN_TAKEAWAYS, CHAIN_KEY_PLAYERS } from "@/components/ChainAnalysis";
import Globe from "@/components/Globe";
import type { GlobeHandle } from "@/components/Globe";
import NodeMap from "@/components/NodeMap";
import featuredChainsJson from "@/data/featured-chains.json";
import {
  computeCompSvgWidth,
  buildRawGeometry,
  computeRawSvgWidth,
  buildGalliumGeometry,
  computeGalliumSvgWidth,
  contentAwareSpread,
  PALETTES,
  buildChainGeometry,
  computeChainSvgWidth,
} from "@/lib/treeGeometry";
import type { ChainDefinition } from "@/lib/treeGeometry";
import chainDefsJson from "@/data/chain-definitions.json";
import chainsJson from "@/data/chains.json";
import nodesJson from "@/data/nodes.json";
import galliumChainJson from "@/data/gallium-chain.json";
import galliumNodesJson from "@/data/gallium-nodes.json";
import germaniumNodesJson from "@/data/germanium-nodes.json";
import universalNodesJson from "@/data/universal-nodes.json";
import chainPlacementsJson from "@/data/chain-placements.json";
import germaniumInputJson from "@/data/inputs/germanium.json";
import galliumInputJson from "@/data/inputs/gallium.json";
import fiberInputJson from "@/data/inputs/fiber-optic-cable.json";
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
const germaniumNodes = germaniumNodesJson as unknown as Record<string, NodeData>;
const galliumLc = (galliumChainJson as Record<string, unknown>).layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;
const chainDefs = chainDefsJson as unknown as Record<string, ChainDefinition>;

/* ── Universal node data (v5.2) ── */
type UniversalNode = {
  id: string; name: string; type: string; ticker: string | null;
  country: string | null; location_detail: string; layer: string;
  descriptor_pill: string; quantity_pill: string;
  status: string; about: string; stats: [string, string][];
  risk: string; risks: string[]; inv: string;
};
const universalNodes = universalNodesJson as unknown as Record<string, UniversalNode>;

type ChainPlacement = {
  chain_id: string; node_id: string; relevance: string; chain_specific_risk: string;
  feeds_from: string[]; feeds_into: string[];
  show_on_tree: boolean; show_in_wtmi: boolean;
  wtmi_category_tag: string | null; wtmi_display_order: number | null;
};
const chainPlacements = chainPlacementsJson as unknown as ChainPlacement[];

/** Look up a node from universal data, falling back to legacy sources */
function getUniversalNode(name: string): UniversalNode | null {
  return universalNodes[name] ?? null;
}

/** Get placements for a node across all chains */
function getNodePlacements(nodeName: string): ChainPlacement[] {
  return chainPlacements.filter(p => p.node_id === nodeName);
}

/** Get placements for a specific chain */
function getChainPlacements(chainId: string): ChainPlacement[] {
  return chainPlacements.filter(p => p.chain_id === chainId);
}

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
  resources: () => (
    <svg width="280" height="320" viewBox="0 0 280 320" fill="none">
      {/* Periodic table fragment — critical elements */}
      {[
        { x: 60, y: 60, sym: "Ge", num: "32" },
        { x: 130, y: 60, sym: "Ga", num: "31" },
        { x: 200, y: 60, sym: "Co", num: "27" },
        { x: 60, y: 130, sym: "Li", num: "3" },
        { x: 130, y: 130, sym: "Cu", num: "29" },
        { x: 200, y: 130, sym: "Ni", num: "28" },
        { x: 60, y: 200, sym: "He", num: "2" },
        { x: 130, y: 200, sym: "Sb", num: "51" },
        { x: 200, y: 200, sym: "W", num: "74" },
        { x: 130, y: 270, sym: "Nd", num: "60" },
      ].map((el, i) => (
        <g key={i}>
          <rect x={el.x - 22} y={el.y - 22} width="44" height="44" rx="3" stroke="#3a3530" strokeWidth="0.5" fill="none" />
          <text x={el.x - 16} y={el.y - 10} style={{ fontSize: "6px", fill: "#4a4540" }}>{el.num}</text>
          <text x={el.x} y={el.y + 6} textAnchor="middle" style={{ fontSize: "16px", fill: "#706a60", fontWeight: 300 }}>{el.sym}</text>
        </g>
      ))}
      {/* Connecting lines between elements */}
      <line x1="82" y1="60" x2="108" y2="60" stroke="#2a2520" strokeWidth="0.5" strokeDasharray="2 3" />
      <line x1="152" y1="60" x2="178" y2="60" stroke="#2a2520" strokeWidth="0.5" strokeDasharray="2 3" />
      <line x1="60" y1="82" x2="60" y2="108" stroke="#2a2520" strokeWidth="0.5" strokeDasharray="2 3" />
      <line x1="130" y1="82" x2="130" y2="108" stroke="#2a2520" strokeWidth="0.5" strokeDasharray="2 3" />
      <line x1="200" y1="82" x2="200" y2="108" stroke="#2a2520" strokeWidth="0.5" strokeDasharray="2 3" />
      <line x1="130" y1="222" x2="130" y2="248" stroke="#2a2520" strokeWidth="0.5" strokeDasharray="2 3" />
    </svg>
  ),
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
    id: "resources",
    name: "Global Resources",
    description: "The critical minerals and materials that underpin frontier technology. Where they come from, who controls them, and what constrains supply.",
    chainCount: "10 materials",
    comingSoon: false,
  },
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

const RESOURCES_MATERIALS: ComponentDef[] = [
  { id: "germanium", name: "Germanium", detail: "Fiber optic dopant, IR optics, satellite solar cells. 83% Chinese, export-controlled.", keyNumber: "Live", hasTree: true, comingSoon: false },
  { id: "gallium", name: "Gallium", detail: "GaN power electronics, defense radar, LEDs. 98% Chinese primary supply.", keyNumber: "Live", hasTree: true, comingSoon: false },
  { id: "cobalt", name: "Cobalt", detail: "Battery cathodes, superalloys. 70% from DRC, artisanal mining risk.", keyNumber: null, hasTree: false, comingSoon: true },
  { id: "lithium", name: "Lithium", detail: "EV batteries, grid storage. Chile/Australia/China triangle.", keyNumber: null, hasTree: false, comingSoon: true },
  { id: "rare-earths", name: "Rare Earths", detail: "Permanent magnets for EVs, wind turbines, defense. 90% Chinese processing.", keyNumber: null, hasTree: false, comingSoon: true },
  { id: "copper", name: "Copper", detail: "Power delivery, wiring, heat exchange. Every electrification pathway needs more.", keyNumber: null, hasTree: false, comingSoon: true },
  { id: "nickel", name: "Nickel", detail: "Battery cathodes, stainless steel, superalloys. Indonesia reshaping supply.", keyNumber: null, hasTree: false, comingSoon: true },
  { id: "helium", name: "Helium", detail: "Fiber draw coolant, MRI, semiconductors. Non-renewable, no substitute.", keyNumber: null, hasTree: false, comingSoon: true },
  { id: "antimony", name: "Antimony", detail: "Flame retardants, ammunition, semiconductors. 48% Chinese, export-controlled.", keyNumber: null, hasTree: false, comingSoon: true },
  { id: "tungsten", name: "Tungsten", detail: "Cutting tools, defense munitions, electrical contacts. 80% Chinese.", keyNumber: null, hasTree: false, comingSoon: true },
];

const RESOURCES_SUBSYSTEMS: Subsystem[] = [
  {
    id: "all-materials",
    name: "All Materials",
    description: "",
    componentCount: "10 materials",
    comingSoon: false,
    components: RESOURCES_MATERIALS,
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

/* ── supply-demand metrics per input ── */
const INPUT_METRICS: Record<string, { price: string; priceSub: string; supply: string; supplySub: string; demand: string; demandSub: string; gap: string; gapSub: string; status: string; statusSub: string }> = {
  germanium: { price: "$8,500/kg", priceSub: "Apr 2026", supply: "~230t/yr", supplySub: "2026", demand: "~286t", demandSub: "by 2027", gap: "~56t", gapSub: "2027", status: "Structural deficit", statusSub: "~$476M" },
  gallium: { price: "$2,269/kg", priceSub: "Apr 2026", supply: "320t/yr", supplySub: "2026", demand: "800t/yr", demandSub: "by 2028", gap: "480t/yr", gapSub: "2027", status: "Critical shortage", statusSub: "~$1.09B" },
  fiber: { price: "48 RMB/km", priceSub: "Apr 2026", supply: "720M km", supplySub: "2026", demand: "~850M km", demandSub: "by 2027", gap: "130M km", gapSub: "2027", status: "Supply constrained", statusSub: "~¥6.2B" },
};

/* ── Globe card descriptions per selectable item ── */
const GLOBE_CARD_INFO: Record<string, { title: string; description: string }> = {
  ai: { title: "AI Infrastructure", description: "End-to-end supply chain powering AI datacenters — from raw germanium deposits to hyperscale GPU clusters." },
  resources: { title: "Global Resources", description: "Critical minerals and materials that underpin frontier technology sectors — extraction, refining, and geopolitical control." },
  "Germanium": { title: "Germanium", description: "Trace element doped into glass to guide light through fiber optic cable. 83% of supply controlled by China." },
  "Gallium": { title: "Gallium", description: "Byproduct of alumina refining. Forms compound semiconductors for AI power conversion, 5G, and defense radar." },
  "Fiber optic cable": { title: "Fiber Optic Cable", description: "Physical layer connecting every AI datacenter. Demand surging as GPU clusters consume 36x more fiber than traditional servers." },
  "Connectivity": { title: "Connectivity", description: "Subsystem linking compute nodes — fiber optic cable, optical transceivers, and network switching infrastructure." },
  "AI Datacenter": { title: "AI Datacenter", description: "Hyperscale facilities housing GPU clusters. Each GW of AI capacity consumes ~6.5M strand-km of fiber." },
  "AI Datacenters": { title: "AI Datacenters", description: "Hyperscale facilities housing GPU clusters. Each GW of AI capacity consumes ~6.5M strand-km of fiber." },
};

/* ── Geographic concentration summaries ── */
const GEO_SUMMARY: Record<string, string> = {
  resources: "Frontier technology supply chains are concentrated in a small number of countries. China controls 83% of germanium, 98% of gallium refining, and dominates rare earth processing. Western alternatives are 3-5 years from meaningful scale. Geographic chokepoints exist at every tier — extraction, refining, and conversion.",
  ai: "The AI infrastructure supply chain spans 15+ countries but funnels through critical chokepoints. Germanium deposits in China feed Belgian refiners who supply American preform makers. Fiber cable is drawn in the US, China, Japan, and Europe — but all depend on a single Austrian equipment supplier.",
  germanium: "Hosted across 8 deposits — 6 in China, 1 in Russia, 1 in DRC. Mined as a byproduct of zinc and coal, then sent to refiners. Only 2 western refiners: Umicore (Belgium) and Teck Trail (Canada). 83% of primary supply is Chinese.",
  gallium: "Extracted as a byproduct at alumina refineries. ~98% of refining capacity is in China across ~20 facilities. One major non-Chinese refiner: Dowa in Japan. Four western projects announced but none at scale before 2028.",
  fiber: "Preform manufactured in 6 countries — US, China, Japan, India, Italy. Cable drawn at ~25 plants globally. Corning (US) controls ~40% of capacity. YOFC (China) is the largest by volume. Equipment monopoly: Rosendahl Nextrom (Austria).",
};

/* ── Node lists grouped by layer for right panel ── */
const INPUT_NODE_LAYERS: Record<string, { layer: string; nodes: string[] }[]> = {
  resources: [
    { layer: "Deposits & Sources", nodes: ["Lincang", "Wulantuga", "Yimin", "Huize", "Yiliang + SYGT", "Red Dog", "Spetsugli", "Big Hill", "Guinea Bauxite", "Australian Bauxite", "Chinese Domestic Bauxite", "Brazilian Bauxite", "Indonesian Bauxite"] },
    { layer: "Operations & Producers", nodes: ["Lincang Xinyuan", "Shengli Coal Group", "Yunnan Chihong", "Teck Resources", "STL / Gécamines", "Various State Operators", "Chinese Bauxite Refineries", "Alcoa / JAGA (Wagerup)", "Metlen Energy & Metals", "Rio Tinto / Indium JV"] },
    { layer: "Refiners", nodes: ["Umicore", "5N Plus", "PPM Pure Metals", "JSC Germanium", "Yunnan Chihong Refinery", "Chinese State Refiners", "Dowa Holdings", "Indium Corporation", "Vital Materials", "Zhuzhou Smelter Group"] },
  ],
  ai: [
    { layer: "Germanium — Deposits", nodes: ["Lincang", "Wulantuga", "Huize", "Red Dog", "Spetsugli", "Big Hill"] },
    { layer: "Germanium — Refiners", nodes: ["Umicore", "5N Plus", "JSC Germanium"] },
    { layer: "Fiber — Conversion", nodes: ["Umicore", "Yunnan Chihong", "Chinese State GeCl4 Plants"] },
    { layer: "Fiber — Preform", nodes: ["Corning", "YOFC", "Shin-Etsu", "Prysmian", "Sumitomo Electric"] },
    { layer: "Fiber — End Use", nodes: ["Microsoft", "Google", "Amazon", "Meta", "xAI", "Oracle"] },
  ],
  germanium: [
    { layer: "Deposits", nodes: ["Lincang", "Wulantuga", "Yimin", "Huize", "Yiliang + SYGT", "Red Dog", "Spetsugli", "Big Hill"] },
    { layer: "Host Operations", nodes: ["Lincang Xinyuan", "Shengli Coal Group", "Yunnan Chihong", "Teck Resources", "STL / Gécamines", "Various State Operators"] },
    { layer: "Refiners", nodes: ["Umicore", "5N Plus", "PPM Pure Metals", "JSC Germanium", "Yunnan Chihong Refinery", "Chinese State Refiners"] },
  ],
  gallium: [
    { layer: "Bauxite Sources", nodes: ["Guinea Bauxite", "Australian Bauxite", "Chinese Domestic Bauxite", "Brazilian Bauxite", "Indonesian Bauxite"] },
    { layer: "Alumina Refineries", nodes: ["Chinese Bauxite Refineries", "Alcoa / JAGA (Wagerup)", "Alcoa Corporation", "Metlen Energy & Metals", "Rio Tinto / Indium JV", "Korea Zinc / Crucible JV", "Nyrstar Tennessee"] },
    { layer: "Gallium Refiners", nodes: ["Dowa Holdings", "5N Plus", "Indium Corporation", "Vital Materials", "Zhuzhou Smelter Group"] },
  ],
  fiber: [
    { layer: "Chemical Conversion", nodes: ["Umicore", "Yunnan Chihong", "Chinese State GeCl4 Plants", "JSC Germanium"] },
    { layer: "Preform Manufacturers", nodes: ["Corning", "YOFC", "Shin-Etsu", "Prysmian", "Sumitomo Electric", "Fujikura"] },
    { layer: "End Use", nodes: ["Microsoft", "Google", "Amazon", "Meta", "xAI", "Oracle", "Equinix", "CoreWeave"] },
  ],
};

/* ── Map node coordinates per input ── */
const MAP_NODES: Record<string, { name: string; lat: number; lon: number; type: string; country?: string }[]> = {
  germanium: [
    { name: "Lincang", lat: 23.88, lon: 100.08, type: "Deposit", country: "China" },
    { name: "Wulantuga", lat: 44.5, lon: 116.8, type: "Deposit", country: "China" },
    { name: "Yimin", lat: 48.5, lon: 119.8, type: "Deposit", country: "China" },
    { name: "Huize", lat: 26.4, lon: 103.3, type: "Deposit", country: "China" },
    { name: "Yiliang + SYGT", lat: 27.6, lon: 104.1, type: "Deposit", country: "China" },
    { name: "Spetsugli", lat: 47.5, lon: 133.0, type: "Deposit", country: "Russia" },
    { name: "Big Hill", lat: -3.5, lon: 27.5, type: "Deposit", country: "DRC" },
    { name: "Red Dog", lat: 68.1, lon: -162.9, type: "Deposit", country: "USA" },
    { name: "Lincang Xinyuan", lat: 23.5, lon: 100.2, type: "Host Operation", country: "China" },
    { name: "Shengli Coal Group", lat: 44.8, lon: 117.0, type: "Host Operation", country: "China" },
    { name: "Yunnan Chihong", lat: 26.1, lon: 103.5, type: "Host Operation", country: "China" },
    { name: "Various State Operators", lat: 40.0, lon: 115.5, type: "Host Operation", country: "China" },
    { name: "JSC Germanium", lat: 47.0, lon: 132.5, type: "Host Operation", country: "Russia" },
    { name: "STL / Gécamines", lat: -3.8, lon: 27.8, type: "Host Operation", country: "DRC" },
    { name: "Teck Resources", lat: 49.3, lon: -120.5, type: "Host Operation", country: "Canada" },
    { name: "Umicore", lat: 51.2, lon: 5.5, type: "Refiner", country: "Belgium" },
    { name: "5N Plus", lat: 45.5, lon: -73.6, type: "Refiner", country: "Canada" },
    { name: "PPM Pure Metals", lat: 42.3, lon: -83.0, type: "Refiner", country: "Germany" },
    { name: "Yunnan Chihong Refinery", lat: 25.8, lon: 103.0, type: "Refiner", country: "China" },
    { name: "Chinese State Refiners", lat: 38.0, lon: 113.5, type: "Refiner", country: "China" },
  ],
  gallium: [
    { name: "Guinea Bauxite", lat: 11.0, lon: -12.0, type: "Bauxite Source", country: "Guinea" },
    { name: "Australian Bauxite", lat: -23.0, lon: 134.0, type: "Bauxite Source", country: "Australia" },
    { name: "Chinese Domestic Bauxite", lat: 34.0, lon: 108.0, type: "Bauxite Source", country: "China" },
    { name: "Brazilian Bauxite", lat: -2.0, lon: -55.0, type: "Bauxite Source", country: "Brazil" },
    { name: "Indonesian Bauxite", lat: 0.5, lon: 104.0, type: "Bauxite Source", country: "Indonesia" },
    { name: "Chinese Bauxite Refineries", lat: 36.0, lon: 114.0, type: "Alumina Refinery", country: "China" },
    { name: "Alcoa / JAGA (Wagerup)", lat: -33.0, lon: 116.0, type: "Alumina Refinery", country: "Australia" },
    { name: "Metlen Energy & Metals", lat: 38.0, lon: 23.7, type: "Alumina Refinery", country: "Greece" },
    { name: "Rio Tinto / Indium JV", lat: 46.8, lon: -71.2, type: "Alumina Refinery", country: "Canada" },
    { name: "Dowa Holdings", lat: 35.7, lon: 139.7, type: "Gallium Refiner", country: "Japan" },
    { name: "5N Plus", lat: 45.5, lon: -73.6, type: "Gallium Refiner", country: "Canada" },
    { name: "Indium Corporation", lat: 43.1, lon: -75.2, type: "Gallium Refiner", country: "USA" },
    { name: "Vital Materials", lat: 28.2, lon: 113.0, type: "Gallium Refiner", country: "China" },
    { name: "Zhuzhou Smelter Group", lat: 27.8, lon: 113.1, type: "Gallium Refiner", country: "China" },
  ],
  fiber: [
    { name: "Chinese State GeCl4 Plants", lat: 31.2, lon: 121.5, type: "Converter", country: "China" },
    { name: "Corning", lat: 35.8, lon: -81.3, type: "Manufacturer", country: "USA" },
    { name: "YOFC", lat: 30.6, lon: 114.3, type: "Manufacturer", country: "China" },
    { name: "Shin-Etsu", lat: 35.9, lon: 140.7, type: "Manufacturer", country: "Japan" },
    { name: "Prysmian", lat: 45.5, lon: 9.2, type: "Manufacturer", country: "Italy" },
    { name: "Sumitomo Electric", lat: 34.7, lon: 135.5, type: "Manufacturer", country: "Japan" },
    { name: "Fujikura", lat: 35.7, lon: 139.7, type: "Manufacturer", country: "Japan" },
    { name: "Microsoft", lat: 47.6, lon: -122.3, type: "Datacenter", country: "USA" },
    { name: "Google", lat: 37.4, lon: -122.0, type: "Datacenter", country: "USA" },
    { name: "Amazon", lat: 38.9, lon: -77.5, type: "Datacenter", country: "USA" },
    { name: "Meta", lat: 37.5, lon: -122.2, type: "Datacenter", country: "USA" },
    { name: "Equinix", lat: 35.7, lon: 139.8, type: "Datacenter", country: "Japan" },
    { name: "CoreWeave", lat: 40.7, lon: -74.0, type: "Datacenter", country: "USA" },
  ],
};

/* ── Map connections per input (supply chain flow direction) ── */
const MAP_CONNECTIONS: Record<string, { from: string; to: string }[]> = {
  germanium: [
    { from: "Lincang", to: "Lincang Xinyuan" }, { from: "Wulantuga", to: "Shengli Coal Group" },
    { from: "Yimin", to: "Various State Operators" }, { from: "Huize", to: "Yunnan Chihong" },
    { from: "Yiliang + SYGT", to: "Yunnan Chihong" }, { from: "Spetsugli", to: "JSC Germanium" },
    { from: "Big Hill", to: "STL / Gécamines" }, { from: "Red Dog", to: "Teck Resources" },
    { from: "Lincang Xinyuan", to: "Yunnan Chihong Refinery" }, { from: "Shengli Coal Group", to: "Chinese State Refiners" },
    { from: "Yunnan Chihong", to: "Yunnan Chihong Refinery" },
    { from: "STL / Gécamines", to: "Umicore" }, { from: "Teck Resources", to: "5N Plus" },
    { from: "Various State Operators", to: "Chinese State Refiners" },
  ],
  gallium: [
    { from: "Guinea Bauxite", to: "Chinese Bauxite Refineries" }, { from: "Australian Bauxite", to: "Alcoa / JAGA (Wagerup)" },
    { from: "Chinese Domestic Bauxite", to: "Chinese Bauxite Refineries" }, { from: "Brazilian Bauxite", to: "Chinese Bauxite Refineries" },
    { from: "Indonesian Bauxite", to: "Chinese Bauxite Refineries" },
    { from: "Chinese Bauxite Refineries", to: "Vital Materials" }, { from: "Chinese Bauxite Refineries", to: "Zhuzhou Smelter Group" },
    { from: "Alcoa / JAGA (Wagerup)", to: "Dowa Holdings" },
    { from: "Metlen Energy & Metals", to: "5N Plus" }, { from: "Rio Tinto / Indium JV", to: "Indium Corporation" },
  ],
  fiber: [
    { from: "Umicore", to: "Corning" }, { from: "Umicore", to: "Prysmian" },
    { from: "Yunnan Chihong", to: "YOFC" }, { from: "Chinese State GeCl4 Plants", to: "YOFC" },
    { from: "Corning", to: "Microsoft" }, { from: "Corning", to: "Amazon" }, { from: "Corning", to: "Meta" },
    { from: "YOFC", to: "Equinix" }, { from: "Prysmian", to: "CoreWeave" },
    { from: "Shin-Etsu", to: "Google" }, { from: "Sumitomo Electric", to: "Equinix" },
  ],
};

/* ── 12-month price history per input (monthly close, Apr 2025 → Apr 2026) ── */
const INPUT_PRICE_HISTORY: Record<string, { points: number[]; unit: string; currentPrice: string; change12m: string }> = {
  germanium: {
    points: [3200, 3600, 4100, 4800, 5200, 5500, 6000, 6400, 7100, 7600, 8100, 8500],
    unit: "$/kg", currentPrice: "$8,500", change12m: "+166%",
  },
  gallium: {
    points: [820, 900, 980, 1050, 1200, 1350, 1500, 1650, 1800, 1950, 2100, 2269],
    unit: "$/kg", currentPrice: "$2,269", change12m: "+177%",
  },
  fiber: {
    points: [20, 21, 22, 24, 26, 28, 30, 33, 36, 40, 44, 48],
    unit: "RMB/km", currentPrice: "48 RMB", change12m: "+140%",
  },
};

/* ── Price sparkline chart ── */
function PriceChart({ inputId, accent, name }: { inputId: string; accent: string; name: string }) {
  const data = INPUT_PRICE_HISTORY[inputId];
  if (!data) return null;

  const W = 200, H = 40;
  const padX = 0, padY = 6;
  const min = Math.min(...data.points);
  const max = Math.max(...data.points);
  const range = max - min || 1;

  const pts = data.points.map((v, i) => {
    const x = padX + (i / (data.points.length - 1)) * (W - padX * 2);
    const y = padY + (1 - (v - min) / range) * (H - padY * 2);
    return { x, y };
  });

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
  const areaPath = linePath + ` L ${pts[pts.length - 1].x},${H} L ${pts[0].x},${H} Z`;

  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

  return (
    <div style={{ padding: "0 0 10px 0" }}>
      <p style={{ fontSize: 10, fontWeight: 400, color: "rgb(97, 97, 97)", margin: "0 0 4px 0" }}>{name} Market Price</p>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#ece8e1", fontFamily: "'Geist Mono', monospace" }}>{data.currentPrice}</span>
          <span style={{ fontSize: 8, color: "#555", marginLeft: 4, fontFamily: "'Geist Mono', monospace" }}>{data.unit}</span>
        </div>
        <span style={{ fontSize: 10, color: accent, fontFamily: "'Geist Mono', monospace", fontWeight: 500 }}>{data.change12m}</span>
      </div>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <linearGradient id={`priceGrad-${inputId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.25" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#priceGrad-${inputId})`} />
        <path d={linePath} fill="none" stroke={accent} strokeWidth="1.5" />
        <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2" fill={accent} />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        {[0, 3, 6, 9, 11].map(i => (
          <span key={i} style={{ fontSize: 6, color: "#444", fontFamily: "'Geist Mono', monospace" }}>{months[i]}</span>
        ))}
      </div>
    </div>
  );
}

/* ── dependencies data per input ── */
type DepTable = {
  label: string;
  headers: { label: string; width: string; right?: boolean }[];
  rows: Record<string, string>[];
  totalRow?: Record<string, string>;
  summaryRows?: { label: string; values: string[] }[];
  takeaway?: string;
};
const INPUT_DEPS: Record<string, { upstream?: DepTable; downstream?: DepTable }> = {
  germanium: { downstream: (germaniumInputJson as unknown as { dependencies: { downstream: DepTable } }).dependencies.downstream },
  gallium: { downstream: (galliumInputJson as unknown as { dependencies: { downstream: DepTable } }).dependencies.downstream },
  fiber: {
    upstream: (fiberInputJson as unknown as { dependencies: { upstream: DepTable; downstream: DepTable } }).dependencies.upstream,
    downstream: (fiberInputJson as unknown as { dependencies: { upstream: DepTable; downstream: DepTable } }).dependencies.downstream,
  },
};

/* ── Investment ideas data per input ── */
type WtmiIdea = { id: string; name: string; ticker: string; category: string; line1: string };
type WtmiLayer = { label: string; ideas: WtmiIdea[] };
type WtmiBrief = { name: string; ticker: string; category: string; metrics: { label: string; value: string }[]; sections: { label: string; items: { title?: string; text: string }[] }[] };
type WtmiData = { layers: WtmiLayer[]; briefs: Record<string, WtmiBrief> };

/* ── Company logo domains for Clearbit ── */
const LOGO_DOMAINS: Record<string, string> = {
  "Umicore": "umicore.com",
  "5N Plus": "5nplus.com",
  "Teck Resources": "teck.com",
  "Blue Moon Metals": "bluemoonmetals.com",
  "LightPath Technologies": "lightpath.com",
  "Corning": "corning.com",
  "Prysmian": "prysmian.com",
  "Sumitomo Electric": "sumitomoelectric.com",
  "Shin-Etsu": "shinetsu.co.jp",
  "Fujikura": "fujikura.co.jp",
  "Alcoa Corporation": "alcoa.com",
  "Metlen Energy & Metals": "metlengroup.com",
  "Rio Tinto": "riotinto.com",
  "Korea Zinc": "koreazinc.co.kr",
  "Nyrstar": "nyrstar.com",
  "Dowa Holdings": "dowa.co.jp",
  "Indium Corporation": "indium.com",
  "Neo Performance": "neomaterials.com",
  "CommScope": "commscope.com",
  "Nexans": "nexans.com",
  "Lumentum": "lumentum.com",
  "II-VI": "coherent.com",
  "Rosendahl Nextrom": "rosendahlnextrom.com",
  "Microsoft": "microsoft.com",
  "Google": "google.com",
  "Amazon": "amazon.com",
  "Meta": "meta.com",
  "Oracle": "oracle.com",
  "Equinix": "equinix.com",
  "Digital Realty": "digitalrealty.com",
  "CoreWeave": "coreweave.com",
  "STL / Gécamines": "stl.tech",
  "Yunnan Chihong": "",
  "YOFC": "yofc.com",
};

const INPUT_WTMI: Record<string, WtmiData> = {
  germanium: (germaniumInputJson as unknown as { wtmi: WtmiData }).wtmi,
  gallium: (galliumInputJson as unknown as { wtmi: WtmiData }).wtmi,
  fiber: (fiberInputJson as unknown as { wtmi: WtmiData }).wtmi,
};

/* ── So-What / Analysis data per input ── */
type SoWhatItem = { id: string; label: string; question: string; teaser: string; analysis: { type: string; text?: string; title?: string; name?: string; desc?: string }[] };
const INPUT_SOWHAT: Record<string, SoWhatItem[]> = {
  germanium: (germaniumInputJson as unknown as { soWhat: SoWhatItem[] }).soWhat,
  gallium: (galliumInputJson as unknown as { soWhat: SoWhatItem[] }).soWhat,
  fiber: (fiberInputJson as unknown as { soWhat: SoWhatItem[] }).soWhat,
};

/* ── Dependencies table component ── */
function DependenciesTable({ inputId }: { inputId: string }) {
  const deps = INPUT_DEPS[inputId];
  const hasUpstream = !!deps?.upstream;
  const hasDownstream = !!deps?.downstream;
  const hasBoth = hasUpstream && hasDownstream;
  const [direction, setDirection] = useState<"upstream" | "downstream">(hasDownstream ? "downstream" : "upstream");

  if (!deps) return <div style={{ padding: "40px 0", color: "#4a4540", fontSize: 12 }}>No dependency data available</div>;

  const table = direction === "upstream" ? deps.upstream : deps.downstream;
  if (!table) return null;

  const headerKeys = table.headers.map(h => h.label);

  return (
    <div style={{ padding: "20px 0" }}>
      {/* Toggle */}
      {hasBoth && (
        <div style={{ display: "flex", gap: 0, marginBottom: 16, background: "#1a1816", border: "1px solid #252220", borderRadius: 8, padding: 2, width: "fit-content" }}>
          {(["upstream", "downstream"] as const).map(dir => {
            const active = direction === dir;
            return (
              <button
                key={dir}
                onClick={() => setDirection(dir)}
                style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.04em",
                  background: active ? "#252220" : "transparent",
                  color: active ? "#ece8e1" : "#555",
                  border: "none", borderRadius: 6, padding: "5px 14px",
                  cursor: "pointer", transition: "color 0.15s, background 0.15s",
                  textTransform: "capitalize",
                }}
              >
                {dir}
              </button>
            );
          })}
        </div>
      )}

      {/* Table label */}
      <p style={{ fontSize: 8, letterSpacing: "0.1em", color: "rgb(128, 120, 112)", textTransform: "uppercase" as const, margin: "0 0 12px 0", fontFamily: "'Geist Mono', monospace" }}>{table.label}</p>

      {/* Table */}
      <div style={{ overflowX: "auto", background: "rgb(22, 21, 20)", borderRadius: 6, padding: 5 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
          <thead>
            <tr>
              {table.headers.map((h, i) => (
                <th key={i} style={{
                  textAlign: h.right ? "right" : "left",
                  padding: "6px 8px",
                  fontSize: 7, letterSpacing: "0.08em", textTransform: "uppercase" as const,
                  color: "#4a4540", fontWeight: 500, fontFamily: "'Geist Mono', monospace",
                  borderBottom: `1px solid ${borderColor}`,
                  width: h.width,
                }}>{h.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri}>
                {headerKeys.map((key, ci) => {
                  const isRight = table.headers[ci]?.right;
                  return (
                    <td key={ci} style={{
                      padding: "7px 8px",
                      color: ci === 0 ? "rgb(160, 152, 136)" : bodyText,
                      fontWeight: ci === 0 ? 500 : 400,
                      textAlign: isRight ? "right" : "left",
                      borderBottom: `1px solid rgba(255,255,255,0.04)`,
                      whiteSpace: "nowrap",
                    }}>{row[key] ?? ""}</td>
                  );
                })}
              </tr>
            ))}
            {table.totalRow && (
              <tr>
                {headerKeys.map((key, ci) => {
                  const isRight = table.headers[ci]?.right;
                  return (
                    <td key={ci} style={{
                      padding: "7px 8px",
                      color: "rgb(207, 207, 207)", fontWeight: 600,
                      textAlign: isRight ? "right" : "left",
                      borderTop: `1px solid ${borderColor}`,
                    }}>{table.totalRow![key] ?? ""}</td>
                  );
                })}
              </tr>
            )}
            {table.summaryRows && table.summaryRows.map((sr, sri) => (
              <tr key={`sr-${sri}`}>
                {headerKeys.map((_, ci) => {
                  // First column: label. Remaining: values array (index ci-1)
                  if (ci === 0) {
                    return <td key={ci} style={{ padding: "7px 8px", color: "rgb(207, 207, 207)", fontWeight: 600, borderTop: sri === 0 ? `1px solid ${borderColor}` : "none" }}>{sr.label}</td>;
                  }
                  const val = sr.values[ci - 1] ?? "";
                  return <td key={ci} style={{ padding: "7px 8px", color: "rgb(207, 207, 207)", fontWeight: 600, borderTop: sri === 0 ? `1px solid ${borderColor}` : "none" }}>{val}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Takeaway moved to bottom section of center panel */}
    </div>
  );
}

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
      <p style={{ fontSize: 13, color: bodyText, lineHeight: 1.6, margin: 0, marginBottom: 20, maxWidth: "80%" }}>
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
function FiberSupplyTree({ onNodeClick, upstream, downstream, onDownstreamClick }: { onNodeClick: (name: string) => void; upstream?: { id: string; name: string; pill: string }[]; downstream?: { id: string; name: string; pill: string }[]; onDownstreamClick?: (id: string) => void }) {
  const chain = chainDefs.fiber;
  const lc = chainsData.layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;

  const svgW = useMemo(() => computeChainSvgWidth(chain), [chain]);

  const geo = useMemo(() => {
    const ancX = svgW / 2;
    const topY = 80;
    const gap = 170;
    const hasUpstream = upstream && upstream.length > 0;

    // Build base geometry from chain definition
    const baseGeo = buildChainGeometry(chain, ancX, topY + (hasUpstream ? gap : 0), gap);

    if (!hasUpstream) return baseGeo;

    // Prepend upstream layer
    const upstreamCY = topY;
    const upstreamXs = contentAwareSpread(upstream.length, ancX);
    const upstreamLayer = {
      key: "rawMaterials", label: "RAW MATERIALS", cy: upstreamCY,
      nodes: upstream.map((u, i) => ({ name: u.name, cx: upstreamXs[i], cy: upstreamCY, opacity: 1 })),
      color: { stroke: "#c8a85a", text: "#8a6820", pip: "#c8a85a" },
    };

    // Add edges from upstream germanium to first chain layer
    const firstLayer = baseGeo.layers[0];
    const EDGE_Y1 = 79;
    const EDGE_Y2 = 7;
    const upstreamEdges = firstLayer ? firstLayer.nodes.map(n => ({
      x1: upstreamXs[0], y1: upstreamCY + EDGE_Y1,
      x2: n.cx, y2: firstLayer.cy - EDGE_Y2,
      color: "#c8a85a", fromLayer: 0,
    })) : [];

    // Shift all existing edge fromLayer indices by 1
    const shiftedEdges = baseGeo.edges.map(e => ({ ...e, fromLayer: e.fromLayer + 1 }));

    return {
      layers: [upstreamLayer, ...baseGeo.layers],
      edges: [...upstreamEdges, ...shiftedEdges],
      outputNode: baseGeo.outputNode,
    };
  }, [svgW, chain, upstream]);

  return (
    <HorizontalTree geometry={geo} nodes={universalNodes as unknown as Record<string, NodeData>} layerConfig={lc} onNodeClick={onNodeClick} downstream={downstream} onDownstreamClick={onDownstreamClick} inlineNodes={useMemo(() => buildInlineNodes(chain), [chain])} accentColor="#6a9ab8" />
  );
}

/* ── Germanium supply tree (from chain-definitions) ── */
/** Build inline node data map from chain definition's supply/output nodes */
function buildInlineNodes(chain: ChainDefinition): Record<string, { quantity_pill?: string; descriptor_pill?: string; country?: string; flags?: string[] }> {
  const map: Record<string, { quantity_pill?: string; descriptor_pill?: string; country?: string; flags?: string[] }> = {};
  if (chain.supplyNodes) {
    for (const sn of chain.supplyNodes) {
      map[sn.name] = { quantity_pill: sn.quantity_pill, descriptor_pill: sn.descriptor_pill, country: sn.country };
    }
  }
  if (chain.outputNode) {
    map[chain.outputNode.name] = { quantity_pill: chain.outputNode.quantity_pill, descriptor_pill: chain.outputNode.descriptor_pill };
  }
  return map;
}

function GermaniumSupplyTree({ onNodeClick, downstream, onDownstreamClick }: { onNodeClick: (name: string) => void; downstream?: { id: string; name: string; pill: string }[]; onDownstreamClick?: (id: string) => void }) {
  const [layerZoom, setLayerZoom] = useState<Record<string, number>>({});
  const [downstreamExpanded, setDownstreamExpanded] = useState(false);
  const fullChain = chainDefs.germanium;
  const lc = chainsData.layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;

  // Which sub-group nodes map to which full nodes
  const SUB_TO_FULL: Record<string, string[]> = {
    "Non-Western Deposits (3)": ["Lincang", "Wulantuga", "Yimin", "Huize", "Spetsugli"],
    "Western Deposits (5)": ["Yiliang + SYGT", "Big Hill", "Red Dog"],
    "Non-Western Operators (3)": ["Lincang Xinyuan", "Shengli Coal Group", "Various State Operators", "Yunnan Chihong"],
    "Western Operators (4)": ["JSC Germanium", "STL / Gécamines", "Teck Resources"],
    "Non-Western Refiners (4)": ["Lincang Xinyuan Refinery", "Smaller Chinese Refiners", "Yunnan Chihong Refinery", "JSC Germanium Refinery"],
    "Western Refiners (3)": ["Umicore", "5N Plus", "PPM Pure Metals"],
  };

  // Track which specific sub-group is expanded (null = show both sub-groups)
  const [expandedSubGroup, setExpandedSubGroup] = useState<Record<string, string | null>>({});

  const chain = useMemo(() => {
    const layerKeys = ["deposits", "hostOperations", "refiners", "supplyAggregates"];

    const LAYER_DEFS: Record<string, {
      groupedNodes: string[]; groupedLabel: string;
      subNodes: string[]; subLabel: string;
      fullNodes: string[]; fullLabel: string;
    }> = {
      deposits: { groupedNodes: ["Deposits (8)"], groupedLabel: "DEPOSITS", subNodes: ["Non-Western Deposits (3)", "Western Deposits (5)"], subLabel: "DEPOSITS", fullNodes: fullChain.layers[0].nodes, fullLabel: "DEPOSITS" },
      hostOperations: { groupedNodes: ["Host Operations (7)"], groupedLabel: "HOST OPERATIONS", subNodes: ["Non-Western Operators (3)", "Western Operators (4)"], subLabel: "HOST OPERATIONS", fullNodes: fullChain.layers[1].nodes, fullLabel: "HOST OPERATIONS" },
      refiners: { groupedNodes: ["Refiners & Recyclers (7)"], groupedLabel: "REFINERS & RECYCLERS", subNodes: ["Non-Western Refiners (4)", "Western Refiners (3)"], subLabel: "REFINERS & RECYCLERS", fullNodes: fullChain.layers[2].nodes, fullLabel: "REFINERS & RECYCLERS" },
      supplyAggregates: { groupedNodes: ["Global Supply"], groupedLabel: "SUPPLY", subNodes: ["China Primary Supply", "Western Recycled Supply"], subLabel: "SUPPLY", fullNodes: fullChain.layers[3].nodes, fullLabel: "SUPPLY" },
    };

    const layers = layerKeys.map(key => {
      const zoom = layerZoom[key] ?? 0;
      const def = LAYER_DEFS[key];
      if (zoom >= 2) {
        // Check if only one sub-group is expanded
        const expSub = expandedSubGroup[key];
        if (expSub && SUB_TO_FULL[expSub]) {
          return { key, label: def.fullLabel, nodes: SUB_TO_FULL[expSub] };
        }
        return { key, label: def.fullLabel, nodes: def.fullNodes };
      }
      if (zoom === 1) return { key, label: def.subLabel, nodes: def.subNodes };
      return { key, label: def.groupedLabel, nodes: def.groupedNodes };
    });

    const edges: { from: string; to: string }[] = [];
    for (let li = 0; li < layers.length - 1; li++) {
      for (const f of layers[li].nodes) {
        for (const t of layers[li + 1].nodes) { edges.push({ from: f, to: t }); }
      }
    }

    return {
      ...fullChain,
      layers,
      edges,
      minor: [],
      supplyNodes: (layerZoom.supplyAggregates ?? 0) >= 1 ? fullChain.supplyNodes : [{ name: "Global Supply", quantity_pill: "230t/yr Ge sold", descriptor_pill: "Global", country: "" }],
      outputNode: null,
    } as unknown as ChainDefinition;
  }, [fullChain, layerZoom, expandedSubGroup]);

  const svgW = useMemo(() => computeChainSvgWidth(chain), [chain]);
  const geo = useMemo(() => buildChainGeometry(chain, svgW / 2, 80), [chain, svgW]);
  const inl = useMemo(() => {
    const base = buildInlineNodes(chain);
    base["Deposits (8)"] = { quantity_pill: "4,000t Reserves", descriptor_pill: "Zinc & coal ores" };
    base["Host Operations (7)"] = { quantity_pill: "140t/yr Ge extracted", descriptor_pill: "Primary extraction" };
    base["Refiners & Recyclers (7)"] = { quantity_pill: "230t/yr Ge refined", descriptor_pill: "Zone refining" };
    base["Global Supply"] = { quantity_pill: "230t/yr Ge sold", descriptor_pill: "Global supply" };
    base["Non-Western Deposits (3)"] = { quantity_pill: "3 deposits", descriptor_pill: "China, Russia", flags: ["cn", "ru"] };
    base["Western Deposits (5)"] = { quantity_pill: "5 deposits", descriptor_pill: "DRC, USA", flags: ["cd", "us"] };
    base["Non-Western Operators (3)"] = { quantity_pill: "~120t/yr", descriptor_pill: "State-linked", flags: ["cn", "ru"] };
    base["Western Operators (4)"] = { quantity_pill: "~20t/yr", descriptor_pill: "DRC, Canada", flags: ["cd", "ca"] };
    base["Non-Western Refiners (4)"] = { quantity_pill: "~140t/yr", descriptor_pill: "China, Russia", flags: ["cn", "ru"] };
    base["Western Refiners (3)"] = { quantity_pill: "~90t/yr", descriptor_pill: "Belgium, USA, Germany", flags: ["be", "us", "de"] };
    return base;
  }, [chain]);

  const GROUP_TO_LAYER: Record<string, string> = {
    "Deposits (8)": "deposits", "Host Operations (7)": "hostOperations",
    "Refiners & Recyclers (7)": "refiners", "Global Supply": "supplyAggregates",
    "Non-Western Deposits (3)": "deposits", "Western Deposits (5)": "deposits",
    "Non-Western Operators (3)": "hostOperations", "Western Operators (4)": "hostOperations",
    "Non-Western Refiners (4)": "refiners", "Western Refiners (3)": "refiners",
    "China Primary Supply": "supplyAggregates", "Western Recycled Supply": "supplyAggregates",
  };

  const handleNodeClick = (name: string) => {
    // Downstream grouped node
    if (name.startsWith("Downstream Demand")) {
      setDownstreamExpanded(true);
      return;
    }
    const layerKey = GROUP_TO_LAYER[name];
    if (layerKey) {
      const current = layerZoom[layerKey] ?? 0;
      if (current === 0) {
        setLayerZoom(prev => ({ ...prev, [layerKey]: 1 }));
        return;
      }
      if (current === 1 && SUB_TO_FULL[name]) {
        setLayerZoom(prev => ({ ...prev, [layerKey]: 2 }));
        setExpandedSubGroup(prev => ({ ...prev, [layerKey]: name }));
        return;
      }
    }
    onNodeClick(name);
  };

  const anyExpanded = Object.values(layerZoom).some(v => v > 0);
  const allFull = ["deposits", "hostOperations", "refiners", "supplyAggregates"].every(k => (layerZoom[k] ?? 0) >= 2 && !expandedSubGroup[k]);

  // Group node names for distinct styling
  const GROUP_NODE_NAMES = new Set([
    "Deposits (8)", "Host Operations (7)", "Refiners & Recyclers (7)", "Global Supply",
    "Non-Western Deposits (3)", "Western Deposits (5)",
    "Non-Western Operators (3)", "Western Operators (4)",
    "Non-Western Refiners (4)", "Western Refiners (3)",
    "China Primary Supply", "Western Recycled Supply",
    "Downstream Demand",
  ]);

  // Check if a name is a group node (for styling)
  const isGroupNode = (name: string) => GROUP_NODE_NAMES.has(name) || name.startsWith("Downstream Demand");

  return (
    <div>
      <HorizontalTree
        geometry={geo}
        nodes={universalNodes as unknown as Record<string, NodeData>}
        layerConfig={lc}
        onNodeClick={handleNodeClick}
        downstream={downstreamExpanded ? downstream : [{ id: "_demand_grouped", name: "Downstream Demand (" + (downstream?.length ?? 0) + ")", pill: "~286t/yr" }]}
        onDownstreamClick={downstreamExpanded ? onDownstreamClick : undefined}
        inlineNodes={inl}
        accentColor="#81713c"
        groupNodes={GROUP_NODE_NAMES}
        expandedLayers={new Set(Object.entries(layerZoom).filter(([, v]) => v > 0).map(([k]) => k))}
        onLayerBack={(layerKey) => {
          const current = layerZoom[layerKey] ?? 0;
          if (current > 0) {
            setLayerZoom(prev => ({ ...prev, [layerKey]: current - 1 }));
            setExpandedSubGroup(prev => { const next = { ...prev }; delete next[layerKey]; return next; });
          }
        }}
      />
      {!anyExpanded && (
        <p style={{ fontSize: 9, color: "#555", margin: "10px 0 0 0", fontFamily: "'Geist Mono', monospace", textAlign: "center" }}>
          Click a node to expand
        </p>
      )}
      {anyExpanded && (
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 15 }}>
          <span
            onClick={() => { setLayerZoom({}); setExpandedSubGroup({}); setDownstreamExpanded(false); }}
            style={{ fontSize: 9, color: "#81713c", cursor: "pointer", fontFamily: "'Geist Mono', monospace", transition: "opacity 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >
            ← Collapse all
          </span>
          {!allFull && (
            <span
              onClick={() => {
                setLayerZoom({ deposits: 2, hostOperations: 2, refiners: 2, supplyAggregates: 2 });
                setExpandedSubGroup({});
                setDownstreamExpanded(true);
              }}
              style={{ fontSize: 9, color: "#81713c", cursor: "pointer", fontFamily: "'Geist Mono', monospace", transition: "opacity 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              Expand full tree →
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Gallium supply tree (from chain-definitions) ── */
function GalliumSupplyTree({ onNodeClick, downstream, onDownstreamClick }: { onNodeClick: (name: string) => void; downstream?: { id: string; name: string; pill: string }[]; onDownstreamClick?: (id: string) => void }) {
  const chain = chainDefs.gallium;
  const svgW = useMemo(() => computeChainSvgWidth(chain), [chain]);
  const geo = useMemo(() => buildChainGeometry(chain, svgW / 2, 80), [chain, svgW]);
  const inl = useMemo(() => buildInlineNodes(chain), [chain]);

  return (
    <HorizontalTree geometry={geo} nodes={universalNodes as unknown as Record<string, NodeData>} layerConfig={galliumLc} onNodeClick={onNodeClick} downstream={downstream} onDownstreamClick={onDownstreamClick} inlineNodes={inl} accentColor="#7a8a6a" />
  );
}

/* ═══════════════════════════════════════════ */
/*  Path-based navigation types                */
/* ═══════════════════════════════════════════ */

export type PathEntry = {
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

/* ── AI Infrastructure Overview Tree ── */
/* ── Global Resources Overview Tree ── */
function ResourcesOverviewTree({ onNodeClick }: { onNodeClick: (id: string) => void }) {
  const geo = useMemo(() => {
    const rawMaterials = [
      "Germanium", "Gallium", "Cobalt", "Lithium", "Copper",
      "Silicon", "Rare Earths", "Helium", "Nickel", "Tin",
    ];
    const products = [
      "Fiber optic cable", "GaN power chips", "Li-ion batteries",
      "Permanent magnets", "Wiring & PCBs", "Semiconductor wafers",
      "IR optics", "Solar cells",
    ];
    const endApps = [
      "AI Datacenters", "Electric Vehicles", "Defense & Radar",
      "Telecom Networks", "Space Systems", "Grid & Energy",
    ];

    const ancX = 500;
    const gap = 170;
    const SLOT = 94;

    const spread = (count: number) => {
      if (count === 1) return [ancX];
      const total = count * SLOT;
      const start = ancX - total / 2 + SLOT / 2;
      return Array.from({ length: count }, (_, i) => start + i * SLOT);
    };

    const rmXs = spread(rawMaterials.length);
    const prodXs = spread(products.length);
    const appXs = spread(endApps.length);

    const rmCY = 80;
    const prodCY = rmCY + gap;
    const appCY = prodCY + gap;

    const edgeColor = "rgba(255,255,255,0.18)";
    const EDGE_Y1 = 79;
    const EDGE_Y2 = 7;

    // Raw materials → Products
    const rmToProd: [number, number][] = [
      [0, 0], // Germanium → Fiber
      [0, 6], // Germanium → IR optics
      [0, 7], // Germanium → Solar cells
      [1, 1], // Gallium → GaN chips
      [1, 7], // Gallium → Solar cells
      [2, 2], // Cobalt → Batteries
      [3, 2], // Lithium → Batteries
      [4, 4], // Copper → Wiring & PCBs
      [5, 5], // Silicon → Wafers
      [5, 1], // Silicon → GaN chips
      [6, 3], // Rare Earths → Magnets
      [7, 0], // Helium → Fiber
      [8, 2], // Nickel → Batteries
      [9, 4], // Tin → Wiring & PCBs
    ];

    // Products → End Applications
    const prodToApp: [number, number][] = [
      [0, 0], // Fiber → AI Datacenters
      [0, 3], // Fiber → Telecom
      [1, 0], // GaN chips → AI Datacenters
      [1, 2], // GaN chips → Defense
      [1, 1], // GaN chips → EVs
      [2, 1], // Batteries → EVs
      [2, 5], // Batteries → Grid
      [3, 1], // Magnets → EVs
      [3, 5], // Magnets → Grid (wind)
      [3, 2], // Magnets → Defense
      [4, 0], // Wiring → AI Datacenters
      [5, 0], // Wafers → AI Datacenters
      [5, 2], // Wafers → Defense
      [6, 2], // IR optics → Defense
      [7, 4], // Solar cells → Space
    ];

    const layers = [
      {
        key: "rawMaterials", label: "RAW MATERIALS", cy: rmCY,
        nodes: rawMaterials.map((n, i) => ({ name: n, cx: rmXs[i], cy: rmCY, opacity: 1 })),
        color: { stroke: "#c8a85a", text: "#8a6820", pip: "#c8a85a" },
      },
      {
        key: "products", label: "COMPONENTS & PRODUCTS", cy: prodCY,
        nodes: products.map((n, i) => ({ name: n, cx: prodXs[i], cy: prodCY, opacity: 1 })),
        color: { stroke: "#4d9ab8", text: "#1e3d52", pip: "#4d9ab8" },
      },
      {
        key: "endApps", label: "END APPLICATIONS", cy: appCY,
        nodes: endApps.map((n, i) => ({ name: n, cx: appXs[i], cy: appCY, opacity: 1 })),
        color: { stroke: "#5a4a6a", text: "#2e1e40", pip: "#5a4a6a" },
      },
    ];

    const edges = [
      ...rmToProd.map(([fi, ti]) => ({
        x1: rmXs[fi], y1: rmCY + EDGE_Y1, x2: prodXs[ti], y2: prodCY - EDGE_Y2,
        color: edgeColor, fromLayer: 0,
      })),
      ...prodToApp.map(([fi, ti]) => ({
        x1: prodXs[fi], y1: prodCY + EDGE_Y1, x2: appXs[ti], y2: appCY - EDGE_Y2,
        color: edgeColor, fromLayer: 1,
      })),
    ];

    return { layers, edges, outputNode: { name: endApps[0], cx: appXs[0], cy: appCY } };
  }, []);

  const overviewNodes = useMemo<Record<string, NodeData>>(() => {
    const items: [string, string][] = [
      ["Germanium", "Constrained"], ["Gallium", "Constrained"], ["Cobalt", "Tightening"],
      ["Lithium", "Oversupplied"], ["Copper", "Tightening"], ["Silicon", "Available"],
      ["Rare Earths", "Constrained"], ["Helium", "Constrained"], ["Nickel", "Tightening"], ["Tin", "Available"],
      ["Fiber optic cable", "Constrained"], ["GaN power chips", "Constrained"], ["Li-ion batteries", "Tightening"],
      ["Permanent magnets", "Constrained"], ["Wiring & PCBs", "Available"], ["Semiconductor wafers", "Constrained"],
      ["IR optics", "Tightening"], ["Solar cells", "Tightening"],
      ["AI Datacenters", ""], ["Electric Vehicles", ""], ["Defense & Radar", ""],
      ["Telecom Networks", ""], ["Space Systems", ""], ["Grid & Energy", ""],
    ];
    const map: Record<string, NodeData> = {};
    for (const [name, status] of items) {
      map[name] = { type: "", loc: "", stat: "", risk: "", stats: [], role: "", inv: "", risks: [], country: "", descriptor_pill: status, quantity_pill: "" } as unknown as NodeData;
    }
    return map;
  }, []);

  const overviewLc = useMemo(() => ({
    rawmaterials: { displayFields: [{ key: "descriptor_pill", label: "Status" }] },
    products: { displayFields: [{ key: "descriptor_pill", label: "Status" }] },
    endapps: { displayFields: [] },
  }), []);

  return (
    <HorizontalTree
      geometry={geo}
      nodes={overviewNodes}
      layerConfig={overviewLc}
      onNodeClick={(name) => {
        const rmIds: Record<string, string> = {
          "Germanium": "germanium", "Gallium": "gallium", "Cobalt": "cobalt",
          "Lithium": "lithium", "Copper": "copper", "Silicon": "silicon",
          "Rare Earths": "rare-earths", "Helium": "helium", "Nickel": "nickel", "Tin": "tin",
        };
        if (rmIds[name]) onNodeClick(rmIds[name]);
      }}
    />
  );
}

function AIOverviewTree({ onNodeClick }: { onNodeClick: (id: string, type: "raw-material" | "component" | "subsystem" | "end-use") => void }) {
  // Build a simple TreeGeometry for the overview
  const geo = useMemo(() => {
    const rawMaterials = [
      "Germanium", "Gallium", "Cobalt", "Lithium", "Copper",
      "Silicon", "Rare Earths", "Helium", "Nickel", "Tin",
    ];
    const components = [
      "Fiber optic cable", "Optical transceivers", "Network switches",
      "GPUs", "HBM memory", "Server boards",
      "Power transformers",
    ];
    const subsystems = ["Connectivity", "Compute", "Power", "Cooling"];
    const endUse = ["AI Datacenter"];

    const ancX = 500;
    const gap = 170;
    const SLOT = 128;

    const spread = (count: number) => {
      if (count === 1) return [ancX];
      const total = count * SLOT;
      const start = ancX - total / 2 + SLOT / 2;
      return Array.from({ length: count }, (_, i) => start + i * SLOT);
    };

    const rmXs = spread(rawMaterials.length);
    const compXs = spread(components.length);
    const subXs = spread(subsystems.length);
    const euXs = spread(endUse.length);

    const rmCY = 80;
    const compCY = rmCY + gap;
    const subCY = compCY + gap;
    const euCY = subCY + gap;

    // Edge mappings: raw materials → components
    const rmToComp: [number, number][] = [
      [0, 0], // Germanium → Fiber
      [1, 1], // Gallium → Optical transceivers
      [4, 3], // Copper → GPUs
      [4, 4], // Copper → HBM
      [4, 5], // Copper → Server boards
      [4, 6], // Copper → Power transformers
      [5, 3], // Silicon → GPUs
      [5, 4], // Silicon → HBM
      [7, 0], // Helium → Fiber
      [8, 5], // Nickel → Server boards
      [9, 5], // Tin → Server boards
      [6, 3], // Rare Earths → GPUs
      [3, 4], // Lithium → HBM (batteries/backup)
    ];

    // Components → Subsystems
    const compToSub: [number, number][] = [
      [0, 0], // Fiber → Connectivity
      [1, 0], // Transceivers → Connectivity
      [2, 0], // Switches → Connectivity
      [3, 1], // GPUs → Compute
      [4, 1], // HBM → Compute
      [5, 1], // Server boards → Compute
      [6, 2], // Transformers → Power
    ];

    // Subsystems → End Use
    const subToEU: [number, number][] = [
      [0, 0], // Connectivity → AI Datacenter
      [1, 0], // Compute → AI Datacenter
      [2, 0], // Power → AI Datacenter
      [3, 0], // Cooling → AI Datacenter
    ];

    const EDGE_Y1 = 79;
    const EDGE_Y2 = 7;
    const edgeColor = "rgba(255,255,255,0.18)";

    const layers = [
      {
        key: "rawMaterials", label: "RAW MATERIALS", cy: rmCY,
        nodes: rawMaterials.map((n, i) => ({ name: n, cx: rmXs[i], cy: rmCY, opacity: 1 })),
        color: { stroke: "#c8a85a", text: "#8a6820", pip: "#c8a85a" },
      },
      {
        key: "components", label: "COMPONENTS", cy: compCY,
        nodes: components.map((n, i) => ({ name: n, cx: compXs[i], cy: compCY, opacity: 1 })),
        color: { stroke: "#4d9ab8", text: "#1e3d52", pip: "#4d9ab8" },
      },
      {
        key: "subsystems", label: "SUBSYSTEMS", cy: subCY,
        nodes: subsystems.map((n, i) => ({ name: n, cx: subXs[i], cy: subCY, opacity: 1 })),
        color: { stroke: "#5a4a6a", text: "#2e1e40", pip: "#5a4a6a" },
      },
      {
        key: "enduse", label: "END USE", cy: euCY,
        nodes: endUse.map((n, i) => ({ name: n, cx: euXs[i], cy: euCY, opacity: 1 })),
        color: { stroke: "#c8a85a", text: "#7a6020", pip: "#c8a85a" },
      },
    ];

    const edges = [
      ...rmToComp.map(([fi, ti]) => ({
        x1: rmXs[fi], y1: rmCY + EDGE_Y1, x2: compXs[ti], y2: compCY - EDGE_Y2,
        color: edgeColor, fromLayer: 0,
      })),
      ...compToSub.map(([fi, ti]) => ({
        x1: compXs[fi], y1: compCY + EDGE_Y1, x2: subXs[ti], y2: subCY - EDGE_Y2,
        color: edgeColor, fromLayer: 1,
      })),
      ...subToEU.map(([fi, ti]) => ({
        x1: subXs[fi], y1: subCY + EDGE_Y1, x2: euXs[ti], y2: euCY - EDGE_Y2,
        color: edgeColor, fromLayer: 2,
      })),
    ];

    return { layers, edges, outputNode: { name: endUse[0], cx: euXs[0], cy: euCY } };
  }, []);

  // Build a simple node data map for display
  const overviewNodes = useMemo<Record<string, NodeData>>(() => {
    const nodeMap: Record<string, NodeData> = {};
    const items: [string, string, string][] = [
      // [name, status/pill, type]
      ["Germanium", "Constrained", "Raw Material"],
      ["Gallium", "Constrained", "Raw Material"],
      ["Cobalt", "Tightening", "Raw Material"],
      ["Lithium", "Oversupplied", "Raw Material"],
      ["Copper", "Tightening", "Raw Material"],
      ["Silicon", "Available", "Raw Material"],
      ["Rare Earths", "Constrained", "Raw Material"],
      ["Helium", "Constrained", "Raw Material"],
      ["Nickel", "Tightening", "Raw Material"],
      ["Tin", "Available", "Raw Material"],
      ["Fiber optic cable", "Constrained", "Component"],
      ["Optical transceivers", "Constrained", "Component"],
      ["Network switches", "Available", "Component"],
      ["GPUs", "Constrained", "Component"],
      ["HBM memory", "Constrained", "Component"],
      ["Server boards", "Tightening", "Component"],
      ["Power transformers", "Constrained", "Component"],
      ["Connectivity", "Constrained", "Subsystem"],
      ["Compute", "Constrained", "Subsystem"],
      ["Power", "Constrained", "Subsystem"],
      ["Cooling", "Tightening", "Subsystem"],
      ["AI Datacenter", "", "End Use"],
    ];
    for (const [name, status, type] of items) {
      nodeMap[name] = {
        type, loc: "", stat: status, risk: "", stats: [], role: "", inv: "", risks: [],
        country: "", descriptor_pill: status, quantity_pill: "",
      } as unknown as NodeData;
    }
    return nodeMap;
  }, []);

  // Simple layer config showing status as the pill
  const overviewLc = useMemo(() => ({
    rawmaterials: { displayFields: [{ key: "descriptor_pill", label: "Status" }] },
    components: { displayFields: [{ key: "descriptor_pill", label: "Status" }] },
    subsystems: { displayFields: [{ key: "descriptor_pill", label: "Status" }] },
    enduse: { displayFields: [] },
  }), []);

  // Map node names to click types
  const handleClick = useCallback((name: string) => {
    const rmIds: Record<string, string> = {
      "Germanium": "germanium", "Gallium": "gallium", "Cobalt": "cobalt",
      "Lithium": "lithium", "Copper": "copper", "Silicon": "silicon",
      "Rare Earths": "rare-earths", "Helium": "helium", "Nickel": "nickel", "Tin": "tin",
    };
    const compIds: Record<string, string> = {
      "Fiber optic cable": "fiber", "Optical transceivers": "transceivers",
      "Network switches": "switches", "GPUs": "gpu", "HBM memory": "hbm",
      "Server boards": "servers", "Power transformers": "transformers",
    };
    const subIds: Record<string, string> = {
      "Connectivity": "connectivity", "Compute": "compute", "Power": "power", "Cooling": "cooling",
    };

    if (rmIds[name]) onNodeClick(rmIds[name], "raw-material");
    else if (compIds[name]) onNodeClick(compIds[name], "component");
    else if (subIds[name]) onNodeClick(subIds[name], "subsystem");
    else onNodeClick(name.toLowerCase(), "end-use");
  }, [onNodeClick]);

  return (
    <HorizontalTree
      geometry={geo}
      nodes={overviewNodes}
      layerConfig={overviewLc}
      onNodeClick={handleClick}
    />
  );
}

export default function TreeView({ initialPath, onGoHome }: { initialPath?: PathEntry[]; onGoHome?: () => void } = {}) {
  /* ── unified path state ── */
  const [path, setPath] = useState<PathEntry[]>(() => {
    if (initialPath && initialPath.length > 0) return initialPath;
    if (typeof window === "undefined") return [];
    const params = new URLSearchParams(window.location.search);
    const treePath = params.get("path");
    if (!treePath) return [];
    // Parse path segments: "resources,germanium" or "ai,connectivity,fiber"
    const segments = treePath.split(",");
    const result: PathEntry[] = [];
    for (const seg of segments) {
      if (seg === "resources") result.push({ type: "vertical", id: "resources", name: "Global Resources" });
      else if (seg === "ai") result.push({ type: "vertical", id: "ai", name: "AI Infrastructure" });
      else if (seg === "connectivity") result.push({ type: "subsystem", id: "connectivity", name: "Connectivity" });
      else if (seg === "fiber") result.push({ type: "component", id: "fiber", name: "Fiber optic cable" });
      else if (seg === "germanium") result.push({ type: "raw-material", id: "germanium", name: "Germanium" });
      else if (seg === "gallium") result.push({ type: "raw-material", id: "gallium", name: "Gallium" });
    }
    return result;
  });
  const [animKey, setAnimKey] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("supply-tree");
  const [rightTab, setRightTab] = useState("summary");
  const [selectedTreeNode, setSelectedTreeNode] = useState<string | null>(null);
  const [selectedBriefId, setSelectedBriefId] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<{ key: string; name: string; overview: string; activity: string } | null>(null);
  const [selectedFeaturedChain, setSelectedFeaturedChain] = useState<string | null>(null);
  const [chainTreeTab, setChainTreeTab] = useState<"diagram" | "tree">("diagram");
  const [selectedSubsystem, setSelectedSubsystem] = useState<string | null>(null);
  const [selectedArchPiece, setSelectedArchPiece] = useState<string | null>(null);
  const [showChainOpportunities, setShowChainOpportunities] = useState(false);
  const [opportunityLayerFilter, setOpportunityLayerFilter] = useState<string | null>(null);
  const [selectedOpportunityBrief, setSelectedOpportunityBrief] = useState<string | null>(null);
  const [layersExpanded, setLayersExpanded] = useState(false);

  // Featured chains data
  type FeaturedChain = { id: string; title: string; status: string; teaser: string; chain_nodes: string[]; chokepoint_node_id: string; display_chain: string[]; chokepoint_display_index: number; highlight_display_index?: number; navigate_path: string[] };
  const featuredChains = ((featuredChainsJson as Record<string, unknown>).ai_infrastructure ?? []) as FeaturedChain[];
  const activeFeaturedChain = featuredChains.find(c => c.id === selectedFeaturedChain);
  // Subsystem node set for tree filtering
  const subsystemNodeSet = useMemo(() => {
    if (!selectedSubsystem || chainTreeTab !== "tree") return new Set<string>();
    const subsystemMap: Record<string, string[]> = {
      "Compute": ["compute"],
      "Connectivity": ["connectivity"],
      "Cooling": ["cooling"],
      "Power": ["power_distribution", "power_generation"],
      "Physical Structure": ["physical_structure"],
    };
    const parentKeys = subsystemMap[selectedSubsystem];
    if (!parentKeys) return new Set<string>();
    const ai = chainDefs["ai"] as unknown as { componentSubgroups?: Record<string, { parent_subsystem?: string; nodes: string[] }> };
    if (!ai?.componentSubgroups) return new Set<string>();
    const nodes = new Set<string>();
    Object.values(ai.componentSubgroups).forEach(g => {
      if (parentKeys.includes(g.parent_subsystem ?? "")) {
        g.nodes.forEach(n => nodes.add(n));
      }
    });
    return nodes;
  }, [selectedSubsystem, chainTreeTab]);

  const featuredChainNodeSet = useMemo(() => {
    if (!activeFeaturedChain) return new Set<string>();
    // Map chain node IDs to display names for tree highlighting
    const idToName: Record<string, string> = { germanium: "Germanium", germanium_glass_dopant: "Germanium Tetrachloride (GeCl4)", fiber_optic_cable: "Fiber Optic Cable", connectivity: "Connectivity", ai_datacenter: "AI Datacenter" };
    return new Set(activeFeaturedChain.chain_nodes.map(id => idToName[id] ?? id));
  }, [activeFeaturedChain]);
  const [selectedAnalysisIdx, setSelectedAnalysisIdx] = useState(0);
  const [globeFilterLayer, setGlobeFilterLayer] = useState<string | null>(null);
  const [hoveredGlobeNode, setHoveredGlobeNode] = useState<{ name: string; type: string; location: string } | null>(null);
  const [centerView, setCenterView] = useState<"globe" | "tree">("tree");
  const [globeNavTarget, setGlobeNavTarget] = useState<string | null>(null);
  const globeRef = useRef<GlobeHandle>(null);
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
    if (onGoHome) { onGoHome(); return; }
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

  /* ── get subsystem data for current vertical ── */
  const getSubsystems = () => {
    if (currentVertical?.id === "resources") return RESOURCES_SUBSYSTEMS;
    return AI_SUBSYSTEMS;
  };
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
    const baseLabels = ["All verticals", ...path.map(p => p.name)];
    // Append chain breadcrumb when a featured chain is selected
    const chainTitle = selectedFeaturedChain && activeFeaturedChain ? activeFeaturedChain.title : null;
    const labels = chainTitle ? [...baseLabels, "Chains", chainTitle] : baseLabels;

    return (
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", minHeight: 14 }}>
        {labels.map((label, i) => {
          const isLast = i === labels.length - 1;
          const clickHandler = () => {
            if (chainTitle && i >= baseLabels.length) {
              // Clicking "Chains" or chain title — deselect the chain
              setSelectedFeaturedChain(null);
              setSelectedTreeNode(null);
              setShowChainOpportunities(false);
              setSelectedOpportunityBrief(null);
              return;
            }
            if (i === 0) goHome();
            else popToIndex(i - 1);
          };
          return (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ fontSize: 10, color: dimmer }}>/</span>}
              <span
                onClick={isLast ? undefined : clickHandler}
                style={{
                  fontSize: 10,
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
          transition: "padding 0.2s ease",
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
          <div style={{ animation: "accordionEnter 200ms ease-out" }}>
            <p style={{ fontSize: 13, color: muted, margin: "8px 0 6px 0", lineHeight: 1.5, maxWidth: 480 }}>
              {description}
            </p>
            <p style={{ fontSize: 10, color: dimmer, margin: 0, fontStyle: comingSoon ? "italic" : "normal" }}>
              {comingSoon ? "Coming soon" : meta}
            </p>
          </div>
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
      <div key={animKey} style={{ display: "flex", justifyContent: "center", gap: 32, padding: "20px 0", flexWrap: "wrap" }}>
        {nodes.map((node, i) => {
          const [hov, setHov] = useState(false);
          return (
            <div
              key={node.id}
              onClick={() => { if (node.clickable) onNodeClick(node.id); }}
              onMouseEnter={() => setHov(true)}
              onMouseLeave={() => setHov(false)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                cursor: node.clickable ? "pointer" : "default",
                opacity: node.dimmed ? 0.4 : 1,
                animation: `accordionEnter 350ms ease-out forwards`,
                animationDelay: `${i * 80}ms`,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12">
                <circle cx="6" cy="6" r="4.5" fill={hov && node.clickable ? "rgba(155,168,171,0.2)" : "none"} stroke="rgba(155,168,171,0.5)" strokeWidth="1" style={{ transition: "fill 0.15s" }} />
              </svg>
              <p style={{
                fontSize: 10, fontFamily: "'EB Garamond', Georgia, serif",
                color: node.dimmed ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.82)",
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
          );
        })}
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

  /* ── render: verticals content (accordion + illustration only, no header) ── */
  function renderVerticalsContent() {
    const items = VERTICALS_DATA.map(v => ({
      name: v.name,
      description: v.description,
      meta: v.chainCount,
      comingSoon: v.comingSoon,
      illustrationId: v.id,
    }));
    const activeIllustrationId = items[expandedVertical]?.illustrationId;
    const IllusComponent = activeIllustrationId ? ILLUSTRATION_MAP[activeIllustrationId] : null;

    return (
      <div style={{ display: "flex", gap: 0, paddingTop: 20 }}>
        <div style={{ flex: "0 0 60%", maxWidth: 540 }}>
          <div key={animKey}>
            {items.map((item, i) => (
              <AccordionItem
                key={item.name}
                name={item.name}
                description={item.description}
                meta={item.meta}
                comingSoon={item.comingSoon}
                isExpanded={expandedVertical === i}
                onRowClick={() => setExpandedVertical(i)}
                onArrowClick={() => {
                  if (!VERTICALS_DATA[i].comingSoon) {
                    pushPath({ type: "vertical", id: VERTICALS_DATA[i].id, name: VERTICALS_DATA[i].name });
                  }
                }}
                index={i}
              />
            ))}
          </div>
        </div>
        <div style={{ flex: "0 0 40%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {IllusComponent && (
            <div key={activeIllustrationId} style={{ opacity: 0.5, animation: "illustrationFade 400ms ease-out forwards" }}>
              <IllusComponent />
            </div>
          )}
        </div>
      </div>
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
    const fromParam = currentVertical?.id === "resources" ? "?from=resources" : "";

    if (lastEntry.type === "vertical") {
      const vertData = VERTICALS_DATA.find(v => v.id === lastEntry.id);
      title = lastEntry.name;
      subtitle = vertData?.description ?? "";
    } else if (lastEntry.type === "subsystem") {
      const subData = getSubsystems().find(s => s.id === lastEntry.id);
      title = lastEntry.name;
      subtitle = subData?.description ?? "";
    } else if (lastEntry.type === "component") {
      const sub = currentSubsystem ? getSubsystems().find(s => s.id === currentSubsystem.id) : null;
      const comp = sub?.components.find(c => c.id === lastEntry.id);
      title = lastEntry.name;
      subtitle = comp?.detail ?? "";
      showAnalysisButton = true;
      analysisHref = `/input/${lastEntry.id === "fiber" ? "fiber-optic-cable" : lastEntry.id}${fromParam}`;
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
      analysisHref = `/input/${lastEntry.id}${fromParam}`;
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
      /* Resources vertical — full horizontal overview tree */
      if (currentVertical?.id === "resources") {
        return <ResourcesOverviewTree onNodeClick={(id) => {
          const nameMap: Record<string, string> = {
            "germanium": "Germanium", "gallium": "Gallium", "cobalt": "Cobalt",
            "lithium": "Lithium", "copper": "Copper", "silicon": "Silicon",
            "rare-earths": "Rare Earths", "helium": "Helium", "nickel": "Nickel", "tin": "Tin",
          };
          const hasTree = id === "germanium" || id === "gallium";
          if (hasTree) {
            pushPath({ type: "raw-material", id, name: nameMap[id] ?? id });
          }
        }} />;
      }

      /* AI Infrastructure — full supply tree with 185 nodes */
      if (currentVertical?.id === "ai") {
        const chainSteps = [
          { name: "Germanium", nodeId: "Germanium", img: "/chain-steps/germanium-v2.jpg", desc: "Starts as a small byproduct metal recovered from zinc and coal. Hard to scale because nobody mines it directly." },
          { name: "GeCl₄", nodeId: "Germanium Tetrachloride (GeCl4)", img: "/chain-steps/gecl4-v2.jpg", desc: "This is the hidden step. Germanium has to become ultra-pure GeCl₄ before it can be used in fiber." },
          { name: "Fiber Preform", nodeId: "Fiber Optic Cable", img: "/chain-steps/fiber-preform-v2.jpg", desc: "GeCl₄ gets deposited into glass rods that become the template for optical fiber." },
          { name: "Fiber Optic Cable", nodeId: "Fiber Optic Cable", img: "/chain-steps/fiber-optic-cable-v2.jpg", desc: "The preform gets drawn into long strands of low-loss fiber for high-bandwidth data movement." },
          { name: "AI Datacenter Connectivity", nodeId: "Connectivity", img: "/chain-steps/ai-connectivity-v2.jpg", desc: "This is where it shows up: fiber linking GPUs, switches, storage, and buildings across AI clusters." },
        ];

        const subsystemSteps = [
          { name: "Compute", img: "/subsystems/compute.jpg", desc: "GPUs, accelerators, and servers that process AI workloads." },
          { name: "Connectivity", img: "/subsystems/connectivity.jpg", desc: "Fiber, optics, and switches moving data across AI clusters." },
          { name: "Cooling", img: "/subsystems/cooling.jpg", desc: "Thermal systems removing heat from dense server racks." },
          { name: "Power", img: "/subsystems/power.jpg", desc: "Grid, transformer, switchgear, and backup power systems." },
          { name: "Physical Structure", img: "/subsystems/physical-structure.jpg", desc: "Data center shells, racks, foundations, and materials." },
        ];

        const diagramSteps = selectedFeaturedChain ? chainSteps : subsystemSteps;

        return (
          <>
          <div style={{ background: "rgb(27, 27, 27)", border: "0.1px solid rgb(36, 36, 36)", borderRadius: 5, overflow: "hidden", ...(selectedFeaturedChain ? { animation: "fadeSlideDown 0.4s ease-out" } : {}) }}>
            {/* Header row: title + toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 15px" }}>
              <p style={{ fontSize: 10, color: warmWhite, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, fontFamily: "'Geist Mono', monospace" }}>Value Chain</p>
              {showChainOpportunities ? (
                <span
                  onClick={() => setShowChainOpportunities(false)}
                  style={{ fontSize: 9, color: "#c87a4a", cursor: "pointer", transition: "color 0.15s", fontFamily: "'Geist Mono', monospace", display: "flex", alignItems: "center", gap: 4 }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#e09060"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#c87a4a"; }}
                >
                  Expand
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 4L5 7L8 4" /></svg>
                </span>
              ) : (
                <button
                  onClick={() => setChainTreeTab(chainTreeTab === "diagram" ? "tree" : "diagram")}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    fontSize: 9, fontFamily: "'Geist Mono', monospace",
                    color: warmWhite, background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4,
                    padding: "5px 10px", cursor: "pointer",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="8" y1="2" x2="8" y2="14" /><line x1="8" y1="6" x2="13" y2="3" /><line x1="8" y1="10" x2="13" y2="13" /></svg>
                  {chainTreeTab === "diagram"
                    ? `View ${selectedSubsystem ?? "AI Infrastructure"} Supply Tree`
                    : `View ${selectedSubsystem ?? "AI Infrastructure"} Diagram`
                  }
                </button>
              )}
            </div>
            {!showChainOpportunities && (
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: ((selectedArchPiece && !selectedFeaturedChain)) ? "0 15px 10px" : "0 15px 15px" }} />
            )}

            <div style={{ maxHeight: showChainOpportunities ? 0 : 800, opacity: showChainOpportunities ? 0 : 1, overflow: "hidden", transition: "max-height 0.3s ease, opacity 0.2s ease" }}>
            <div style={{ padding: "0 15px 10px" }}>
              {/* Diagram view */}
              {chainTreeTab === "diagram" && (
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${diagramSteps.length}, 1fr)`, gap: 0 }}>
                  {diagramSteps.map((step, i) => {
                    const nodeId = (step as { nodeId?: string }).nodeId;
                    const isSelected = nodeId ? selectedTreeNode === nodeId : selectedSubsystem === step.name;
                    const dotColor = "#c87a4a";
                    return (
                      <div
                        key={step.name}
                        onClick={() => { if (nodeId) { setSelectedTreeNode(nodeId); setRightTab("summary"); } else { const next = selectedSubsystem === step.name ? null : step.name; setSelectedSubsystem(next); setSelectedArchPiece(null); } }}
                        style={{ cursor: "pointer", display: "flex", flexDirection: "column", background: isSelected ? "rgb(37, 37, 37)" : "transparent", borderRadius: 5, border: isSelected ? "1px solid rgba(200, 122, 74, 0.25)" : "1px solid transparent", padding: i === 0 ? "10px 10px 12px 10px" : "10px 10px 12px", transition: "background 0.15s, border-color 0.15s" }}
                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                      >
                        {/* Name row with dot and connecting line */}
                        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
                          <p style={{ fontSize: 13, fontWeight: 500, color: "#ece8e1", margin: "0 0 0 6px", fontFamily: "'EB Garamond', Georgia, serif", whiteSpace: "nowrap", flexShrink: 0 }}>{step.name}</p>
                          {i < diagramSteps.length - 1 && (
                            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)", marginLeft: 8 }} />
                          )}
                        </div>
                        {/* Illustration — collapses when arch piece selected */}
                        <div style={{
                          width: "100%",
                          maxHeight: ((!selectedArchPiece || selectedFeaturedChain) && !showChainOpportunities) ? 90 : 0,
                          opacity: ((!selectedArchPiece || selectedFeaturedChain) && !showChainOpportunities) ? 1 : 0,
                          borderRadius: 3,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgb(36, 36, 36)",
                          marginBottom: ((!selectedArchPiece || selectedFeaturedChain) && !showChainOpportunities) ? 8 : 0,
                          transition: "max-height 0.3s ease, opacity 0.2s ease, margin-bottom 0.3s ease",
                        }}>
                          <img src={step.img} alt={step.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
                        </div>
                        {/* Description */}
                        <p style={{ fontSize: 10, color: "rgb(158, 150, 136)", lineHeight: 1.5, margin: 0 }}>{step.desc}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tree view */}
              {chainTreeTab === "tree" && (
                <AISupplyTree
                  highlightedChainNodes={featuredChainNodeSet.size > 0 ? featuredChainNodeSet : subsystemNodeSet.size > 0 ? subsystemNodeSet : undefined}
                  onNodeClick={(name) => {
                    if (selectedFeaturedChain) {
                      if (!name) { setSelectedTreeNode(null); } else { setSelectedTreeNode(name); setRightTab("summary"); }
                      return;
                    }
                    if (!name) { setSelectedTreeNode(null); } else { setSelectedTreeNode(name); setRightTab("summary"); }
                  }}
                  onGroupClick={(key, name, overview, activity) => {
                    if (selectedFeaturedChain) return;
                    if (!key) { setSelectedGroup(null); setSelectedTreeNode(null); }
                    else { setSelectedGroup({ key, name, overview, activity }); setSelectedTreeNode(null); setRightTab("summary"); }
                  }}
                  onNavigateToInput={(name) => {
                    const navMap: Record<string, PathEntry[]> = {
                      "Germanium": [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "raw-material", id: "germanium", name: "Germanium" }],
                      "Gallium": [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "raw-material", id: "gallium", name: "Gallium" }],
                      "Fiber Optic Cable": [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "subsystem", id: "connectivity", name: "Connectivity" }, { type: "component", id: "fiber", name: "Fiber optic cable" }],
                    };
                    const target = navMap[name];
                    if (target) { setPath(target); setAnimKey(k => k + 1); setSelectedTreeNode(null); setSelectedGroup(null); }
                  }}
                />
              )}
            </div>
            </div>
          </div>
          {/* Hint text — shown when no subsystem is selected */}
          {!selectedSubsystem && !selectedFeaturedChain && (
            <p style={{ fontSize: 10, color: dimText, margin: "14px 0 0", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.02em", textAlign: "center" }}>
              Select a subsystem to reveal: Signals / Chokepoints / Companies / Supply Tree
            </p>
          )}
          {/* Connectivity Architecture — shown when Connectivity is selected */}
          {(() => {
            const showArch = !selectedFeaturedChain && selectedSubsystem === "Connectivity";
            if (!showArch) return null;
            const ARCH_PIECES = [
              { id: "gpu-server", title: "GPU / Server", desc: "Generates data from AI workloads.", deps: ["GPUs", "HBM", "Boards"] },
              { id: "nic", title: "NIC / Interconnect", desc: "Moves data out of the server.", deps: ["SerDes", "PHY", "PCB"] },
              { id: "transceiver", title: "Optical Transceiver", desc: "Converts electrical into optical signals.", deps: ["Lasers", "DSPs", "SiPh"] },
              { id: "fiber", title: "Fiber Optic Cable", desc: "Carries light across the data center.", deps: ["GeCl₄", "Preforms", "Helium"] },
              { id: "tor-switch", title: "ToR Switch", desc: "Aggregates traffic from servers in a rack.", deps: ["ASICs", "Optics", "Power"] },
              { id: "spine-switch", title: "Spine Switch", desc: "Routes traffic across the cluster fabric.", deps: ["ASICs", "Optics", "NOS"] },
              { id: "campus-link", title: "Campus Link", desc: "Connects buildings, sites, and regions.", deps: ["Fiber", "Conduit", "Labor"] },
            ];

            return (
              <>
              <div style={{ animation: "fadeSlideDown 0.3s ease-out", background: "rgb(27, 27, 27)", border: "0.1px solid rgb(36, 36, 36)", borderRadius: 5, overflow: "hidden", marginTop: 10 }}>
                <div style={{ padding: "10px 15px" }}>
                  <p style={{ fontSize: 10, color: warmWhite, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, fontFamily: "'Geist Mono', monospace" }}>Connectivity Architecture</p>
                </div>
                <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 15px" }} />

                {/* Architecture pieces — horizontal connected flow with rings inside cards */}
                <div style={{ padding: "12px 15px 8px", overflowX: "auto" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 0, minWidth: "fit-content" }}>
                    {ARCH_PIECES.map((piece, pi) => {
                      const isActive = selectedArchPiece === piece.id;
                      return (
                        <div
                          key={piece.id}
                          onClick={() => setSelectedArchPiece(selectedArchPiece === piece.id ? null : piece.id)}
                          style={{
                            flex: "0 0 auto",
                            width: 130,
                            padding: "8px 10px 8px",
                            borderRadius: 5,
                            cursor: "pointer",
                            background: "transparent",
                            border: "1px solid transparent",
                          }}
                          onMouseEnter={e => {
                            const ring = e.currentTarget.querySelector("[data-ring]") as HTMLElement;
                            if (ring && !isActive) ring.style.background = "rgba(255,255,255,0.08)";
                          }}
                          onMouseLeave={e => {
                            const ring = e.currentTarget.querySelector("[data-ring]") as HTMLElement;
                            if (ring && !isActive) ring.style.background = "transparent";
                          }}
                        >
                          {/* Ring + arrow row */}
                          <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                            <div
                              data-ring=""
                              style={{
                                width: 20, height: 20, borderRadius: "50%",
                                border: `1.5px solid ${isActive ? "#c87a4a" : "rgba(255,255,255,0.15)"}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "border-color 0.15s, background 0.15s",
                                background: isActive ? "rgba(200,122,74,0.25)" : "transparent",
                                flexShrink: 0,
                              }}
                            >
                              <span style={{ fontSize: 8, color: isActive ? "#fff" : "#555", fontWeight: 500, fontFamily: "'Geist Mono', monospace" }}>{pi + 1}</span>
                            </div>
                            {pi < ARCH_PIECES.length - 1 && (
                              <div style={{ flex: 1, display: "flex", alignItems: "center", marginLeft: 4, marginRight: -10 }}>
                                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                                <svg width="6" height="6" viewBox="0 0 6 6" fill="none" style={{ flexShrink: 0 }}>
                                  <path d="M0 0.5L4 3L0 5.5" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
                                </svg>
                              </div>
                            )}
                          </div>
                          {/* Content */}
                          <p style={{ fontSize: 11, color: "rgb(236, 232, 225)", fontWeight: 400, margin: "0 0 3px 0", lineHeight: 1.3 }}>{piece.title}</p>
                          <p style={{ fontSize: 9, color: "rgb(160, 152, 136)", lineHeight: 1.3, margin: "0 0 5px 0", fontWeight: 300 }}>{piece.desc}</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                            {piece.deps.map(d => (
                              <span key={d} style={{ fontSize: 7, color: isActive ? "rgb(254, 174, 0)" : "rgb(160, 152, 136)", background: "rgba(255,255,255,0.05)", borderRadius: 3, padding: "2px 5px", fontWeight: 300 }}>{d}</span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
              {!selectedArchPiece && (
                <p style={{ fontSize: 9, color: dimText, margin: "10px 0 0", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.02em", textAlign: "center" }}>
                  Select an architecture piece to reveal signals, chokepoints, and exposed companies
                </p>
              )}
              </>
            );
          })()}

          {/* Subsystem sections — shown when no chain is selected */}
          {!selectedFeaturedChain && selectedSubsystem && (() => {
            const subsystemData: Record<string, {
              metrics: { signals: number; rawMaterials: number; intermediates: number; components: number };
              signals: { id: string; title: string; status: string; teaser: string; whyItMatters?: string; affectedNodes?: string[]; relatedCompanies?: string[] }[];
              companies: { name: string; node: string; flag: string }[];
              explore: { label: string; desc: string; icon: string; action: () => void }[];
            }> = {
              "Compute": {
                metrics: { signals: 6, rawMaterials: 14, intermediates: 18, components: 12 },
                signals: [
                  { id: "hbm_concentration", title: "HBM Memory Concentration", status: "acute", teaser: "Two companies control >95% of HBM production with 18-month lead times at full allocation.", whyItMatters: "HBM (High Bandwidth Memory) is the memory stacked directly on AI accelerators. Without it, GPUs cannot process large AI models — and only two companies in the world can make it.", affectedNodes: ["HBM Memory", "GPU Accelerators", "Server Assembly", "AI Datacenter"], relatedCompanies: ["SK Hynix", "Samsung", "Nvidia", "AMD", "Micron"] },
                  { id: "tsmc_dependency", title: "TSMC Advanced Node Dependency", status: "structural", teaser: "Every leading AI accelerator is fabricated at one company on one island.", whyItMatters: "TSMC manufactures virtually every cutting-edge AI chip at its fabs in Taiwan. A disruption there would halt global AI hardware production.", affectedNodes: ["Wafer Fabrication", "GPU Accelerators", "Custom ASICs"], relatedCompanies: ["TSMC", "Nvidia", "AMD", "Broadcom", "ASML"] },
                  { id: "cobalt_interconnect", title: "Cobalt Interconnect Bottleneck", status: "emerging", teaser: "Sub-3nm chips require cobalt wiring from a narrow DRC-to-refiner pipeline.", whyItMatters: "Cobalt replaces copper as the wiring material inside the most advanced chips. Most of it comes from the DRC, creating a single-country dependency for next-gen semiconductors.", affectedNodes: ["Cobalt Mining", "Cobalt Refining", "Wafer Fabrication"], relatedCompanies: ["TSMC", "Intel", "Samsung"] },
                  { id: "gpu_power_wall", title: "GPU Power Wall", status: "tightening", teaser: "Next-gen GPUs approaching 1000W TDP, straining power and cooling at rack level.", whyItMatters: "Each new generation of AI GPU draws more power. At 1000W per chip, racks require liquid cooling and upgraded power delivery that most facilities weren't built for.", affectedNodes: ["GPU Accelerators", "Power Distribution", "Cooling Systems"], relatedCompanies: ["Nvidia", "Vertiv", "Eaton", "CoolIT Systems"] },
                ],
                companies: [
                  { name: "Nvidia", node: "GPU Accelerators", flag: "us" },
                  { name: "AMD", node: "GPU Accelerators", flag: "us" },
                  { name: "TSMC", node: "Wafer Fabrication", flag: "tw" },
                  { name: "Samsung", node: "HBM Memory", flag: "kr" },
                  { name: "SK Hynix", node: "HBM Memory", flag: "kr" },
                  { name: "Micron", node: "DRAM", flag: "us" },
                  { name: "Intel", node: "Server CPUs", flag: "us" },
                  { name: "Broadcom", node: "Custom ASICs", flag: "us" },
                  { name: "ASML", node: "Lithography Equipment", flag: "nl" },
                  { name: "Super Micro", node: "Server Assembly", flag: "us" },
                ],
                explore: [
                  { label: "View Compute Supply Tree", desc: "Explore the full supply chain from chips to racks", icon: "tree", action: () => { setChainTreeTab("tree"); } },
                  { label: "Map Geographic Exposure", desc: "See where compute supply is concentrated", icon: "globe", action: () => {} },
                  { label: "See Company Universe", desc: "Browse all companies in this subsystem", icon: "companies", action: () => {} },
                ],
              },
              "Connectivity": {
                metrics: { signals: 5, rawMaterials: 8, intermediates: 12, components: 7 },
                signals: [
                  { id: "germanium_chokepoint", title: "The GeCl₄ Chokepoint", status: "acute", teaser: "Every kilometer of fiber depends on GeCl₄ refined almost entirely in China.", whyItMatters: "GeCl₄ (germanium tetrachloride) is the ultra-pure chemical deposited into glass to create the light-guiding core of optical fiber. Without it, no fiber optic cable can be manufactured.", affectedNodes: ["Germanium", "GeCl₄", "Fiber Optic Cable", "Connectivity", "AI Datacenter"], relatedCompanies: ["Umicore", "Corning", "Prysmian", "YOFC", "Coherent"] },
                  { id: "transceiver_shortage", title: "800G Transceiver Shortage", status: "tightening", teaser: "Silicon photonics yield issues limiting 800G production as AI demands 36x more optical links.", whyItMatters: "Transceivers convert electrical signals to light for fiber optic transmission. The 800G generation is essential for GPU-to-GPU communication in AI clusters.", affectedNodes: ["Optical Transceivers", "Network Switches", "AI Datacenter"], relatedCompanies: ["Coherent", "Lumentum", "Broadcom", "Arista Networks"] },
                  { id: "helium_supply", title: "Helium Cooling Supply Risk", status: "emerging", teaser: "Helium for fiber drawing is a non-renewable byproduct with declining US reserves.", whyItMatters: "Helium is used to cool the fiber drawing process. It cannot be synthesized — once released, it escapes Earth's atmosphere permanently.", affectedNodes: ["Fiber Optic Cable", "Fiber Preform"], relatedCompanies: ["Corning", "Prysmian", "Sumitomo Electric"] },
                  { id: "rosendahl_monopoly", title: "Preform Equipment Monopoly", status: "structural", teaser: "One company supplies all fiber preform deposition equipment with 18-24 month backlogs.", whyItMatters: "Fiber preform deposition machines are the specialized equipment that creates the glass rods from which all optical fiber is drawn. One company makes them all.", affectedNodes: ["Fiber Preform", "Fiber Optic Cable"], relatedCompanies: ["Corning", "Prysmian", "YOFC", "Sumitomo Electric"] },
                ],
                companies: [
                  { name: "Corning", node: "Fiber Optic Cable", flag: "us" },
                  { name: "Prysmian", node: "Fiber Optic Cable", flag: "it" },
                  { name: "YOFC", node: "Fiber Optic Cable", flag: "cn" },
                  { name: "Arista Networks", node: "Network Switches", flag: "us" },
                  { name: "Cisco", node: "Network Switches", flag: "us" },
                  { name: "Broadcom", node: "Switch ASICs", flag: "us" },
                  { name: "Coherent", node: "Optical Transceivers", flag: "us" },
                  { name: "Lumentum", node: "Optical Transceivers", flag: "us" },
                  { name: "Umicore", node: "GeCl₄ Refining", flag: "be" },
                  { name: "Sumitomo Electric", node: "Fiber Optic Cable", flag: "jp" },
                ],
                explore: [
                  { label: "Open GeCl₄ Chokepoint Brief", desc: "Deep analysis of the germanium-to-fiber bottleneck", icon: "doc", action: () => { setSelectedFeaturedChain("germanium_chokepoint"); setSelectedTreeNode("Germanium"); setRightTab("summary"); } },
                  { label: "View Connectivity Supply Tree", desc: "Explore the full connectivity supply chain", icon: "tree", action: () => { setChainTreeTab("tree"); } },
                  { label: "Map Geographic Exposure", desc: "See where connectivity supply is concentrated", icon: "globe", action: () => {} },
                  { label: "See Company Universe", desc: "Browse all companies in this subsystem", icon: "companies", action: () => {} },
                ],
              },
              "Cooling": {
                metrics: { signals: 4, rawMaterials: 6, intermediates: 8, components: 9 },
                signals: [
                  { id: "liquid_cooling_shift", title: "Air-to-Liquid Cooling Transition", status: "structural", teaser: "AI power density forces shift to liquid cooling, but cold plate supply can't keep up.", whyItMatters: "Liquid cooling pipes coolant directly to chips, removing far more heat than air. AI racks now exceed what air cooling can handle, making this transition mandatory.", affectedNodes: ["Liquid Cooling", "Cold Plates", "Cooling Distribution"], relatedCompanies: ["CoolIT Systems", "Vertiv", "Boyd Corporation", "Asetek"] },
                  { id: "coolant_supply", title: "Dielectric Coolant Supply", status: "emerging", teaser: "Immersion cooling needs specialty fluorinated fluids with limited global production.", whyItMatters: "Dielectric coolants are non-conductive fluids that servers can be submerged in for cooling. Only a handful of chemical companies produce them at scale.", affectedNodes: ["Immersion Cooling", "Cooling Systems"], relatedCompanies: ["ZutaCore", "3M", "Vertiv"] },
                  { id: "water_consumption", title: "Water Consumption Pressure", status: "tightening", teaser: "Cooling towers consume millions of gallons per facility, facing pushback in water-scarce regions.", whyItMatters: "Cooling towers evaporate water to reject heat. A single large datacenter can consume as much water as a small city, triggering local opposition.", affectedNodes: ["Evaporative Cooling", "HVAC Systems"], relatedCompanies: ["Munters", "Johnson Controls", "Carrier"] },
                  { id: "cold_plate_capacity", title: "Cold Plate Manufacturing Bottleneck", status: "tightening", teaser: "Three suppliers dominate direct-to-chip cold plates as demand scales with each GPU generation.", whyItMatters: "Cold plates are metal blocks with internal channels that sit directly on GPU chips to extract heat. They must be precision-machined to tight tolerances.", affectedNodes: ["Cold Plates", "Liquid Cooling", "Server Assembly"], relatedCompanies: ["Boyd Corporation", "CoolIT Systems", "Nventec"] },
                ],
                companies: [
                  { name: "Vertiv", node: "Cooling Systems", flag: "us" },
                  { name: "Schneider Electric", node: "Cooling Distribution", flag: "fr" },
                  { name: "CoolIT Systems", node: "Liquid Cooling", flag: "ca" },
                  { name: "Boyd Corporation", node: "Cold Plates", flag: "us" },
                  { name: "Nventec", node: "Thermal Solutions", flag: "tw" },
                  { name: "Asetek", node: "Liquid Cooling", flag: "dk" },
                  { name: "Munters", node: "Evaporative Cooling", flag: "se" },
                  { name: "Johnson Controls", node: "HVAC Systems", flag: "us" },
                  { name: "Carrier", node: "Chillers", flag: "us" },
                  { name: "ZutaCore", node: "Immersion Cooling", flag: "il" },
                ],
                explore: [
                  { label: "View Cooling Supply Tree", desc: "Explore cooling components from cold plates to towers", icon: "tree", action: () => { setChainTreeTab("tree"); } },
                  { label: "Map Geographic Exposure", desc: "See where cooling supply is concentrated", icon: "globe", action: () => {} },
                  { label: "See Company Universe", desc: "Browse all companies in this subsystem", icon: "companies", action: () => {} },
                ],
              },
              "Power": {
                metrics: { signals: 5, rawMaterials: 10, intermediates: 14, components: 11 },
                signals: [
                  { id: "transformer_backlog", title: "Power Transformer Backlog", status: "acute", teaser: "Large power transformers have 2-4 year lead times, gating new datacenter grid connections.", whyItMatters: "Power transformers step down high-voltage grid electricity to usable levels. They weigh hundreds of tons, take years to build, and cannot be substituted.", affectedNodes: ["Transformers", "Power Distribution", "Grid Connection"], relatedCompanies: ["ABB", "Siemens Energy", "Eaton", "GE Vernova"] },
                  { id: "grid_capacity", title: "Grid Capacity Constraints", status: "structural", teaser: "US grid interconnection queue exceeds 2,600 GW with 5+ year average wait times.", whyItMatters: "Datacenters need grid connections to receive electricity. The queue to connect new facilities now exceeds total US generation capacity.", affectedNodes: ["Grid Connection", "Power Distribution"], relatedCompanies: ["Constellation Energy", "GE Vernova", "Eaton"] },
                  { id: "nuclear_renaissance", title: "Nuclear for AI Power", status: "emerging", teaser: "Hyperscalers signing nuclear PPAs as the only carbon-free baseload at GW scale.", whyItMatters: "Nuclear plants provide constant carbon-free power at the GW scale AI datacenters need. Tech companies are now buying entire reactors.", affectedNodes: ["Nuclear Power", "Grid Connection"], relatedCompanies: ["Constellation Energy", "GE Vernova", "Bloom Energy"] },
                  { id: "busbar_copper", title: "Copper Busbar Demand Surge", status: "tightening", teaser: "AI datacenters use 3-5x more copper per MW than traditional facilities.", whyItMatters: "Busbars are thick copper conductors that distribute power inside datacenters. AI facilities need dramatically more of them per rack.", affectedNodes: ["Copper Busbars", "Power Distribution", "UPS Systems"], relatedCompanies: ["Eaton", "Schneider Electric", "ABB"] },
                ],
                companies: [
                  { name: "Eaton", node: "Power Distribution", flag: "us" },
                  { name: "Schneider Electric", node: "UPS Systems", flag: "fr" },
                  { name: "Vertiv", node: "UPS Systems", flag: "us" },
                  { name: "ABB", node: "Transformers", flag: "ch" },
                  { name: "Siemens Energy", node: "Switchgear", flag: "de" },
                  { name: "Cummins", node: "Backup Generators", flag: "us" },
                  { name: "Caterpillar", node: "Backup Generators", flag: "us" },
                  { name: "GE Vernova", node: "Gas Turbines", flag: "us" },
                  { name: "Bloom Energy", node: "Fuel Cells", flag: "us" },
                  { name: "Constellation Energy", node: "Nuclear Power", flag: "us" },
                ],
                explore: [
                  { label: "View Power Supply Tree", desc: "Trace power from grid to rack", icon: "tree", action: () => { setChainTreeTab("tree"); } },
                  { label: "Map Geographic Exposure", desc: "See where power supply is concentrated", icon: "globe", action: () => {} },
                  { label: "See Company Universe", desc: "Browse all companies in this subsystem", icon: "companies", action: () => {} },
                ],
              },
              "Physical Structure": {
                metrics: { signals: 4, rawMaterials: 7, intermediates: 5, components: 8 },
                signals: [
                  { id: "construction_timeline", title: "Construction Timeline Compression", status: "structural", teaser: "Hyperscalers demand 12-month builds vs. traditional 24-36 months, straining labor and materials.", whyItMatters: "Datacenter construction timelines are being compressed to meet AI demand. Builders face shortages of skilled labor, structural steel, and electrical components.", affectedNodes: ["Datacenter Facilities", "Structural Steel", "Modular Construction"], relatedCompanies: ["Equinix", "Digital Realty", "Compass Datacenters", "Nucor"] },
                  { id: "steel_pricing", title: "Structural Steel Price Volatility", status: "tightening", teaser: "Datacenter steel demand competes with infrastructure spending, driving price uncertainty.", whyItMatters: "Structural steel forms the skeleton of every datacenter. Competing demand from infrastructure bills and reshoring is driving prices and lead times up.", affectedNodes: ["Structural Steel", "Datacenter Facilities"], relatedCompanies: ["Nucor", "Equinix", "Digital Realty"] },
                  { id: "modular_shift", title: "Modular Datacenter Adoption", status: "emerging", teaser: "Pre-fabricated modular designs cut build time but require new supply chain relationships.", whyItMatters: "Modular datacenters are factory-built units shipped to site and assembled. They cut build time in half but shift supply chain dependencies to new manufacturers.", affectedNodes: ["Modular Construction", "Rack Infrastructure"], relatedCompanies: ["Compass Datacenters", "Vertiv", "Legrand"] },
                  { id: "permitting_delays", title: "Permitting and Zoning Delays", status: "structural", teaser: "Local opposition and environmental reviews add 6-18 months to new facility timelines.", whyItMatters: "Communities are pushing back on datacenter noise, water use, and power consumption. Permitting delays can stall billions in planned capacity.", affectedNodes: ["Datacenter Facilities"], relatedCompanies: ["Equinix", "Digital Realty", "QTS Realty", "Vantage Data Centers"] },
                ],
                companies: [
                  { name: "Equinix", node: "Datacenter Facilities", flag: "us" },
                  { name: "Digital Realty", node: "Datacenter Facilities", flag: "us" },
                  { name: "QTS Realty", node: "Datacenter Facilities", flag: "us" },
                  { name: "Vantage Data Centers", node: "Datacenter Facilities", flag: "us" },
                  { name: "EdgeConneX", node: "Datacenter Facilities", flag: "us" },
                  { name: "Compass Datacenters", node: "Modular Construction", flag: "us" },
                  { name: "Nucor", node: "Structural Steel", flag: "us" },
                  { name: "Legrand", node: "Rack Infrastructure", flag: "fr" },
                  { name: "Rittal", node: "Server Cabinets", flag: "de" },
                  { name: "Panduit", node: "Cable Management", flag: "us" },
                ],
                explore: [
                  { label: "View Structure Supply Tree", desc: "Explore physical datacenter components", icon: "tree", action: () => { setChainTreeTab("tree"); } },
                  { label: "Map Geographic Exposure", desc: "See where construction supply is concentrated", icon: "globe", action: () => {} },
                  { label: "See Company Universe", desc: "Browse all companies in this subsystem", icon: "companies", action: () => {} },
                ],
              },
            };

            const sub = subsystemData[selectedSubsystem];
            if (!sub) return null;

            // For Connectivity, gate on architecture piece selection
            if (selectedSubsystem === "Connectivity" && !selectedArchPiece) return null;

            const cardBg = "rgba(255, 255, 255, 0.02)";
            const sTitle = { fontSize: 10 as const, color: warmWhite as string, margin: "0 0 10px 0" as const, textTransform: "uppercase" as const, letterSpacing: "0.08em" as const, fontWeight: 500 as const, fontFamily: "'Geist Mono', monospace" as const };

            // Map architecture pieces to featured signals for Connectivity
            const archPieceSignalMap: Record<string, string> = {
              "fiber": "germanium_chokepoint",
              "transceiver": "transceiver_shortage",
              "tor-switch": "rosendahl_monopoly",
              "spine-switch": "rosendahl_monopoly",
              "campus-link": "helium_supply",
            };

            // Override featured signal based on arch piece for Connectivity
            let featuredSignal = sub.signals[0];
            let otherSignals = sub.signals.slice(1);
            if (selectedSubsystem === "Connectivity" && selectedArchPiece) {
              const targetId = archPieceSignalMap[selectedArchPiece];
              if (targetId) {
                const idx = sub.signals.findIndex(s => s.id === targetId);
                if (idx >= 0) {
                  featuredSignal = sub.signals[idx];
                  otherSignals = sub.signals.filter((_, i) => i !== idx);
                }
              }
            }

            // Chain path pills for GeCl₄ chokepoint
            const chainPills = featuredSignal?.id === "germanium_chokepoint"
              ? ["Germanium", "GeCl₄", "Fiber Optic", "Connectivity", "AI Datacenter"]
              : null;

            return (
              <>
              {/* Signals section card */}
              <div style={{ animation: "fadeSlideDown 0.4s ease-out 0.15s both", background: "rgb(27, 27, 27)", border: "0.1px solid rgb(36, 36, 36)", borderRadius: 5, overflow: "hidden", marginTop: 10 }}>
                {/* Header */}
                <div style={{ padding: "10px 15px" }}>
                  <p style={{ fontSize: 10, color: warmWhite, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, fontFamily: "'Geist Mono', monospace" }}>{selectedArchPiece ? (() => { const ARCH_NAMES: Record<string, string> = { "gpu-server": "GPU / Server", "nic": "NIC / Interconnect", "transceiver": "Optical Transceiver", "fiber": "Fiber Optic Cable", "tor-switch": "Top-of-Rack Switch", "spine-switch": "Spine / Fabric Switch", "campus-link": "Campus / Region Link" }; return (ARCH_NAMES[selectedArchPiece] ?? selectedSubsystem) + " Signals"; })() : "Signals"}</p>
                </div>
                <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 15px" }} />

                {/* Two-column content */}
                <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: 0, padding: "10px 15px" }}>
                  {/* Featured Signal card */}
                  <div style={{ paddingRight: 14 }}>
                    {featuredSignal ? (
                      <div
                        onClick={() => { setSelectedFeaturedChain(featuredSignal.id); setSelectedTreeNode("Germanium"); setRightTab("summary"); }}
                        style={{ background: "rgb(37, 37, 37)", borderRadius: 5, overflow: "hidden", cursor: "pointer", transition: "background 0.15s", border: "1px solid rgba(200, 122, 74, 0.25)" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgb(42, 42, 42)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgb(37, 37, 37)"; }}
                      >
                        {/* Header row: title + chain pill */}
                        <div style={{ padding: "10px 14px 0 14px", marginBottom: 5 }}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <p style={{ fontSize: 13, color: warmWhite, fontWeight: 500, margin: 0, marginRight: 20, flexShrink: 0 }}>{featuredSignal.title}</p>
                            {chainPills && (
                              <span style={{ fontSize: 8, color: "rgb(160, 152, 136)", background: "rgba(255,255,255,0.05)", borderRadius: 3, padding: "2px 8px", fontFamily: "'Geist Mono', monospace", whiteSpace: "nowrap" }}>
                                {chainPills.join(" → ")}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Two-column content */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                          {/* Left: signal details */}
                          <div style={{ padding: "8px 14px 10px 14px" }}>
                            <p style={{ fontSize: 12, color: "rgb(160, 152, 136)", lineHeight: 1.5, margin: "0 0 8px 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{featuredSignal.teaser}</p>
                            {featuredSignal.whyItMatters && (
                              <>
                              <p style={{ fontSize: 8, color: dimText, margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Geist Mono', monospace", fontWeight: 500 }}>Why it matters?</p>
                              <p style={{ fontSize: 10, color: "rgb(140, 132, 116)", lineHeight: 1.5, margin: "0 0 10px 0", fontStyle: "italic", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{featuredSignal.whyItMatters}</p>
                              </>
                            )}
                            <span style={{ fontSize: 13, color: "#c87a4a" }}>
                              Open signal brief and analysis →
                            </span>
                          </div>
                          {/* Right: key companies table */}
                          <div style={{ padding: "8px 14px 10px 14px" }}>
                            {(() => {
                              const relatedNames = new Set(featuredSignal.relatedCompanies ?? []);
                              const filtered = sub.companies.filter(c => relatedNames.has(c.name)).slice(0, 4);
                              return (
                                <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 5, overflow: "hidden" }}>
                                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                      <tr style={{ background: "rgb(54, 54, 54)" }}>
                                        <th style={{ textAlign: "left", padding: "7px 10px", fontSize: 7, letterSpacing: "0.08em", color: "rgb(159, 146, 132)", fontWeight: 500, fontFamily: "'Geist Mono', monospace", textTransform: "uppercase" }}>Company</th>
                                        <th style={{ textAlign: "left", padding: "7px 10px", fontSize: 7, letterSpacing: "0.08em", color: "rgb(159, 146, 132)", fontWeight: 500, fontFamily: "'Geist Mono', monospace", textTransform: "uppercase" }}>Supply Chain Node</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {filtered.map((c, ci) => (
                                        <tr key={c.name} style={{ borderTop: ci > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                                          <td style={{ padding: "7px 10px", fontSize: 10 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                              <img src={`https://flagcdn.com/16x12/${c.flag}.png`} alt="" style={{ width: 12, height: 9, borderRadius: 1, opacity: 0.7, flexShrink: 0 }} />
                                              <span style={{ color: warmWhite, fontWeight: 500 }}>{c.name}</span>
                                            </div>
                                          </td>
                                          <td style={{ padding: "7px 10px", fontSize: 9, color: "rgb(160, 152, 136)", fontFamily: "'Geist Mono', monospace" }}>{c.node}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ background: "rgb(37, 37, 37)", borderRadius: 5, padding: "14px 12px" }}>
                        <p style={{ fontSize: 10, color: dimText, margin: 0 }}>No featured signal for {selectedSubsystem} yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Signal list — no card style, dividers between items */}
                  <div>
                    {otherSignals.length === 0 && !featuredSignal ? (
                      <p style={{ fontSize: 10, color: dimText, margin: 0, padding: "10px 0" }}>No additional signals yet.</p>
                    ) : (
                      <>
                      <div>
                        {otherSignals.map((s, si) => (
                          <div
                            key={s.id}
                            onClick={() => { setSelectedFeaturedChain(s.id); setSelectedTreeNode("Germanium"); setRightTab("summary"); }}
                            style={{
                              paddingTop: si === 0 ? 8 : 10,
                              paddingBottom: si === otherSignals.length - 1 ? 0 : 10,
                              paddingLeft: 8,
                              paddingRight: 8,
                              cursor: "pointer",
                              borderTop: si > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                              borderRadius: 4,
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#c87a4a", flexShrink: 0 }} />
                              <p style={{ fontSize: 11, color: warmWhite, fontWeight: 500, margin: 0 }}>{s.title}</p>
                            </div>
                            <p style={{ fontSize: 9, color: "rgb(160, 152, 136)", lineHeight: 1.5, margin: 0 }}>{s.teaser}</p>
                          </div>
                        ))}
                      </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              </>
            );
          })()}

          {selectedFeaturedChain === "germanium_chokepoint" && (
            <div style={{
              marginTop: 10,
              maxHeight: showChainOpportunities ? 48 : 600,
              opacity: showChainOpportunities ? 1 : 1,
              overflow: "hidden",
              transition: "max-height 0.3s ease 0.15s",
              ...(showChainOpportunities ? {} : { animation: "fadeSlideDown 0.4s ease-out 0.2s both" }),
            }}>
              <ChainAnalysis collapsed={showChainOpportunities} onShowOpportunities={() => setShowChainOpportunities(true)} onExpand={() => { setShowChainOpportunities(false); setSelectedOpportunityBrief(null); setOpportunityLayerFilter(null); }} />
            </div>
          )}

          {showChainOpportunities && selectedFeaturedChain === "germanium_chokepoint" && (() => {
            type WtmiIdeaLocal = { id: string; name: string; ticker?: string; category: string; line1: string };
            const geWtmi = (germaniumInputJson as unknown as { wtmi: { layers: { label: string; ideas: WtmiIdeaLocal[] }[] } }).wtmi;
            const fiberWtmi = (fiberInputJson as unknown as { wtmi: { layers: { label: string; ideas: WtmiIdeaLocal[] }[] } }).wtmi;

            const allIdeas = [
              ...geWtmi.layers.flatMap(l => l.ideas),
              ...fiberWtmi.layers.flatMap(l => l.ideas),
            ];

            const FILTERS = ["Germanium Supplier", "GeCl₄ Refiner", "Fiber Preform / Cable", "Other"];
            const filterMap: Record<string, (idea: WtmiIdeaLocal) => boolean> = {
              "Germanium Supplier": (i) => ["yunnan-chihong", "blue-moon-metals"].includes(i.id) || i.category === "Feedstock supplier",
              "GeCl₄ Refiner": (i) => ["umicore", "5n-plus"].includes(i.id),
              "Fiber Preform / Cable": (i) => ["corning", "prysmian", "fujikura", "yofc", "rosendahl-nextrom"].includes(i.id),
              "Other": (i) => {
                const covered = ["yunnan-chihong", "blue-moon-metals", "umicore", "5n-plus", "corning", "prysmian", "fujikura", "yofc", "rosendahl-nextrom"];
                const isSupplier = i.category === "Feedstock supplier";
                return !covered.includes(i.id) && !isSupplier;
              },
            };

            // Determine which filter an idea belongs to
            const getIdeaFilter = (idea: WtmiIdeaLocal): string => {
              for (const f of FILTERS) { if (filterMap[f](idea)) return f; }
              return "Other";
            };

            const activeFilter = opportunityLayerFilter;
            const filteredIdeas = activeFilter && filterMap[activeFilter]
              ? allIdeas.filter(filterMap[activeFilter])
              : allIdeas;

            const cleanTicker = (t?: string) => {
              if (!t) return "Private";
              const parts = t.split("·")[0].trim();
              return parts || "Private";
            };

            const thStyle = { textAlign: "left" as const, padding: "7px 10px", fontSize: 7, letterSpacing: "0.08em", color: "rgb(159, 146, 132)", fontWeight: 500 as const, fontFamily: "'Geist Mono', monospace", textTransform: "uppercase" as const };

            // Brief data
            const geBriefs = (INPUT_WTMI.germanium?.briefs ?? {}) as Record<string, WtmiBrief>;
            const fiberBriefs = (INPUT_WTMI.fiber?.briefs ?? {}) as Record<string, WtmiBrief>;
            const selectedBrief = selectedOpportunityBrief ? (geBriefs[selectedOpportunityBrief] ?? fiberBriefs[selectedOpportunityBrief]) : null;

            return (
              <div style={{ marginTop: 10, background: "rgb(27, 27, 27)", border: "0.1px solid rgb(36, 36, 36)", borderRadius: 5, overflow: "hidden", padding: "14px 16px", display: "flex", flexDirection: "column", animation: "fadeSlideDown 0.4s ease-out 0.4s both" }}>
                <p style={{ fontSize: 10, color: warmWhite, margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, fontFamily: "'Geist Mono', monospace" }}>Chain Opportunities</p>

                {/* Layer filter pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12, flexShrink: 0 }}>
                  <span
                    onClick={() => { setOpportunityLayerFilter(null); setSelectedOpportunityBrief(null); }}
                    style={{
                      fontSize: 8, padding: "3px 8px", borderRadius: 3, cursor: "pointer",
                      background: !activeFilter ? "rgba(200,122,74,0.2)" : "rgba(255,255,255,0.04)",
                      color: !activeFilter ? "#c87a4a" : "rgb(160, 152, 136)",
                      border: !activeFilter ? "1px solid rgba(200,122,74,0.3)" : "1px solid transparent",
                      fontFamily: "'Geist Mono', monospace", transition: "all 0.15s",
                    }}
                  >All</span>
                  {FILTERS.map(label => (
                    <span
                      key={label}
                      onClick={() => { setOpportunityLayerFilter(activeFilter === label ? null : label); setSelectedOpportunityBrief(null); }}
                      style={{
                        fontSize: 8, padding: "3px 8px", borderRadius: 3, cursor: "pointer",
                        background: activeFilter === label ? "rgba(200,122,74,0.2)" : "rgba(255,255,255,0.04)",
                        color: activeFilter === label ? "#c87a4a" : "rgb(160, 152, 136)",
                        border: activeFilter === label ? "1px solid rgba(200,122,74,0.3)" : "1px solid transparent",
                        fontFamily: "'Geist Mono', monospace", transition: "all 0.15s",
                      }}
                    >{label}</span>
                  ))}
                </div>

                {/* Ideas table */}
                <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 5, overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: 400 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", flexShrink: 0 }}>
                    <colgroup>
                      <col style={{ width: "22%" }} />
                      <col style={{ width: "16%" }} />
                      <col style={{ width: "62%" }} />
                    </colgroup>
                    <thead>
                      <tr style={{ background: "rgb(38, 38, 38)" }}>
                        <th style={thStyle}>Company</th>
                        <th style={thStyle}>Category</th>
                        <th style={thStyle}>Thesis</th>
                      </tr>
                    </thead>
                  </table>
                  <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                      <colgroup>
                        <col style={{ width: "22%" }} />
                        <col style={{ width: "16%" }} />
                        <col style={{ width: "62%" }} />
                      </colgroup>
                      <tbody>
                        {filteredIdeas.map((idea, ii) => (
                          <tr
                            key={idea.id + ii}
                            onClick={() => {
                              const f = getIdeaFilter(idea);
                              setOpportunityLayerFilter(f);
                              setSelectedOpportunityBrief(idea.id);
                            }}
                            style={{ borderTop: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", transition: "background 0.15s", background: selectedOpportunityBrief === idea.id ? "rgba(200,122,74,0.08)" : "transparent" }}
                            onMouseEnter={e => { if (selectedOpportunityBrief !== idea.id) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                            onMouseLeave={e => { if (selectedOpportunityBrief !== idea.id) e.currentTarget.style.background = "transparent"; }}
                          >
                            <td style={{ padding: "8px 10px", fontSize: 11, verticalAlign: "top" }}>
                              <span style={{ color: warmWhite, fontWeight: 500 }}>{idea.name}</span>
                              <span style={{ fontSize: 8, color: "rgb(120, 112, 100)", marginLeft: 6, fontFamily: "'Geist Mono', monospace" }}>({cleanTicker(idea.ticker)})</span>
                            </td>
                            <td style={{ padding: "8px 10px", fontSize: 9, color: "#c87a4a", verticalAlign: "top", fontFamily: "'Geist Mono', monospace" }}>{idea.category}</td>
                            <td style={{ padding: "8px 10px", fontSize: 10, color: "rgb(160, 152, 136)", verticalAlign: "top", lineHeight: 1.5 }}>{idea.line1}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Selected brief — shown below table */}
                {selectedBrief && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", animation: "fadeSlideDown 0.3s ease-out" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 500, color: warmWhite, margin: 0, fontFamily: "'Instrument Serif', serif" }}>{selectedBrief.name}</h3>
                      <span style={{ fontSize: 10, color: "#555", fontFamily: "'Geist Mono', monospace" }}>{selectedBrief.ticker}</span>
                    </div>
                    <p style={{ fontSize: 10, color: "#c87a4a", margin: "0 0 10px 0", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.04em" }}>{selectedBrief.category}</p>
                    <div style={{ display: "flex", gap: 16, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      {selectedBrief.metrics.map(m => (
                        <div key={m.label}>
                          <p style={{ fontSize: 9, color: "#555", margin: "0 0 2px 0", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{m.label}</p>
                          <p style={{ fontSize: 12, color: warmWhite, margin: 0, fontWeight: 500 }}>{m.value}</p>
                        </div>
                      ))}
                    </div>
                    {selectedBrief.sections.map((sec, si) => (
                      <div key={si} style={{ marginBottom: 16 }}>
                        <p style={{ fontSize: 12, color: "rgb(158, 156, 153)", fontWeight: 500, margin: "0 0 8px 0" }}>{sec.label}</p>
                        {sec.items.map((item, ii) => (
                          <div key={ii} style={{ marginBottom: 8 }}>
                            {item.title && <p style={{ fontSize: 12, color: warmWhite, fontWeight: 500, margin: "0 0 3px 0" }}>{item.title}</p>}
                            <p style={{ fontSize: 12, color: "#807870", lineHeight: 1.6, margin: 0 }}>{item.text}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
          </>
        );
      }

      const nodes = getSubsystems().map(s => ({
        id: s.id,
        name: s.name,
        pill: s.componentCount,
        clickable: !s.comingSoon,
        dimmed: s.comingSoon,
      }));
      return (
        <NodeRow nodes={nodes} onNodeClick={(id) => {
          const sub = getSubsystems().find(s => s.id === id);
          if (sub) pushPath({ type: "subsystem", id: sub.id, name: sub.name });
        }} />
      );
    }

    if (currentLevel === "components") {
      const sub = currentSubsystem ? getSubsystems().find(s => s.id === currentSubsystem.id) : null;
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
          if (comp && comp.hasTree) {
            const isRawMaterial = id === "germanium" || id === "gallium" || id === "cobalt";
            pushPath({ type: isRawMaterial ? "raw-material" : "component", id: comp.id, name: comp.name });
          }
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
      return (
        <FiberSupplyTree
          onNodeClick={(name) => {
            // Navigate to raw material if clicked
            const nodeNav: Record<string, PathEntry[]> = {
              "Germanium": [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "subsystem", id: "connectivity", name: "Connectivity" }, { type: "component", id: "fiber", name: "Fiber optic cable" }, { type: "raw-material", id: "germanium", name: "Germanium" }],
              "Gallium": [{ type: "vertical", id: "resources", name: "Global Resources" }, { type: "raw-material", id: "gallium", name: "Gallium" }],
            };
            const navTarget = nodeNav[name];
            if (navTarget) { setPath(navTarget); setAnimKey(k => k + 1); setSelectedTreeNode(null); return; }
            setSelectedTreeNode(name);
            setRightTab("nodes");
          }}
          upstream={[
            { id: "germanium", name: "Germanium", pill: "~230t/yr" },
            { id: "helium", name: "Helium", pill: "Non-renewable" },
            { id: "silica", name: "Silica / SiCl\u2084", pill: "Up 50%" },
          ]}
          downstream={[
            { id: "ai-dc", name: "AI Datacenters", pill: "~210M km" },
            { id: "telecom", name: "Terrestrial Telecom", pill: "~290M km" },
            { id: "subsea", name: "Subsea Cables", pill: "~70M km" },
            { id: "military", name: "Military / UAV", pill: "~55M km" },
            { id: "bead", name: "BEAD Broadband", pill: "~65M km" },
          ]}
          onDownstreamClick={(id) => {
            const dsNav: Record<string, PathEntry[]> = {
              "germanium": [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "subsystem", id: "connectivity", name: "Connectivity" }, { type: "component", id: "fiber", name: "Fiber optic cable" }, { type: "raw-material", id: "germanium", name: "Germanium" }],
            };
            const target = dsNav[id];
            if (target) { setPath(target); setAnimKey(k => k + 1); setSelectedTreeNode(null); }
          }}
        />
      );
    }

    /* ── Germanium tree ── */
    if (lastEntry.type === "raw-material" && lastEntry.id === "germanium") {
      return (
        <>
          <GermaniumSupplyTree onNodeClick={(name) => {
            setSelectedTreeNode(name);
            setRightTab("nodes");
          }} downstream={[
            { id: "fiber", name: "Fiber Optic Cable", pill: "~87t/yr" },
            { id: "ir", name: "IR Optics", pill: "~55t/yr" },
            { id: "solar", name: "Satellite Solar", pill: "~35t/yr" },
            { id: "sige", name: "SiGe Chips", pill: "~25t/yr" },
          ]} onDownstreamClick={(id) => {
            const dsNav: Record<string, PathEntry[]> = {
              "fiber": [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "subsystem", id: "connectivity", name: "Connectivity" }, { type: "component", id: "fiber", name: "Fiber optic cable" }],
            };
            const target = dsNav[id];
            if (target) { setPath(target); setAnimKey(k => k + 1); setSelectedTreeNode(null); }
          }} />
        </>
      );
    }

    /* ── Gallium tree ── */
    if (lastEntry.type === "raw-material" && lastEntry.id === "gallium") {
      return (
        <>
          <GalliumSupplyTree onNodeClick={(name) => { setSelectedTreeNode(name); setRightTab("nodes"); }} downstream={[
            { id: "gan", name: "GaN Power", pill: "~110t/yr" },
            { id: "gaas", name: "GaAs Devices", pill: "~140t/yr" },
            { id: "ndfeb", name: "NdFeB Magnets", pill: "~80t/yr" },
            { id: "led", name: "LEDs", pill: "~75t/yr" },
            { id: "defense", name: "Defense Radar", pill: "~25t/yr" },
          ]} onDownstreamClick={(id) => {
            const dsNav: Record<string, PathEntry[]> = {};
            const target = dsNav[id];
            if (target) { setPath(target); setAnimKey(k => k + 1); setSelectedTreeNode(null); }
          }} />
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

  /* ── derive title/subtitle/analysisHref for unified template ── */
  const templateTitle = (() => {
    // Override with featured chain title when selected
    if (selectedFeaturedChain && currentVertical?.id === "ai" && currentLevel === "subsystems") {
      const fc = featuredChains.find(c => c.id === selectedFeaturedChain);
      if (fc) return fc.title;
    }
    if (path.length === 0) return "Explore emerging frontiers.";
    if (!lastEntry) return "";
    if (lastEntry.type === "vertical") {
      return lastEntry.name;
    }
    if (lastEntry.type === "subsystem") return lastEntry.name;
    if (lastEntry.type === "component") return lastEntry.name;
    if (lastEntry.type === "raw-material") return lastEntry.name;
    return "";
  })();

  const templateSubtitle = (() => {
    // Override with featured chain teaser when selected
    if (selectedFeaturedChain && currentVertical?.id === "ai" && currentLevel === "subsystems") {
      const fc = featuredChains.find(c => c.id === selectedFeaturedChain);
      if (fc) return fc.teaser;
    }
    if (path.length === 0) return "Trace value chains from raw material to end use \u2014 every node, every bottleneck, every player.";
    if (!lastEntry) return "";
    if (lastEntry.type === "vertical") return VERTICALS_DATA.find(v => v.id === lastEntry.id)?.description ?? "";
    if (lastEntry.type === "subsystem") return getSubsystems().find(s => s.id === lastEntry.id)?.description ?? "";
    if (lastEntry.type === "component") {
      const sub = currentSubsystem ? getSubsystems().find(s => s.id === currentSubsystem.id) : null;
      return sub?.components.find(c => c.id === lastEntry.id)?.detail ?? "";
    }
    if (lastEntry.type === "raw-material") {
      if (lastEntry.id === "germanium") return "Found as a trace element of zinc and coal, and primarily used in fiber cables as a dopant in fiber glass strands to allow it to carry light fast.";
      if (lastEntry.id === "gallium") return "Byproduct of alumina refining. Forms compound semiconductors for AI datacenter power, 5G, defense radar, and LEDs.";
      return "";
    }
    return "";
  })();

  const templateAnalysisHref = (() => {
    if (!lastEntry) return null;
    const fromParam = currentVertical?.id === "resources" ? "?from=resources" : "";
    if (lastEntry.type === "component") return `/input/${lastEntry.id === "fiber" ? "fiber-optic-cable" : lastEntry.id}${fromParam}`;
    if (lastEntry.type === "raw-material") return `/input/${lastEntry.id}${fromParam}`;
    return null;
  })();

  const templateAccent = (() => {
    if (!lastEntry) return undefined;
    if (lastEntry.type === "component") return INPUT_ACCENT[lastEntry.id];
    if (lastEntry.type === "raw-material") return INPUT_ACCENT[lastEntry.id];
    return undefined;
  })();

  /* ── main render — unified page template ── */
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", height: "100vh", background: "#141414", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 0, padding: "10px 0 0 0", height: "calc(100vh - 50px)", alignItems: "stretch" }}>

        {/* Left panel — vertical selector + layers + items */}
        {(() => {
          // Determine effective vertical: use nav target in globe view, otherwise current vertical or default "resources"
          const effectiveVertical = (centerView === "globe" && (globeNavTarget === "ai" || globeNavTarget === "resources"))
            ? globeNavTarget
            : currentVertical?.id ?? "resources";

          // Define layers and items based on effective vertical — same for globe and tree
          const layerData: { layer: string; items: string[]; globeLayer?: string }[] = (() => {
            if (effectiveVertical === "ai") {
              return [
                { layer: "Raw Materials", items: ["Germanium", "Gallium", "Indium", "Copper", "Silicon", "Lithium", "Cobalt", "Nickel", "Rare Earths", "Helium", "Neon"], globeLayer: "raw-material" },
                { layer: "Intermediates", items: ["Advanced Logic Wafers", "GaN Wafers", "GeCl₄", "NdFeB Magnets", "LFP Cells", "ABF Substrate", "CoWoS Package"], globeLayer: "component" },
                { layer: "Components", items: ["GPUs / AI Accelerators", "Fiber Optic Cable", "Optical Transceivers", "Network Switches", "HBM Stacks", "Server Boards", "Power Transformers"], globeLayer: "component" },
                { layer: "Subsystems", items: ["Compute", "Memory & Storage", "Connectivity", "Cooling", "Power Distribution", "Power Generation", "Physical Structure"], globeLayer: "subsystem" },
                { layer: "End Use", items: ["AI Datacenter"], globeLayer: "end-use" },
              ];
            }
            if (effectiveVertical === "resources") {
              return [
                { layer: "Raw Materials", items: ["Germanium", "Gallium", "Cobalt", "Lithium", "Copper", "Silicon", "Rare Earths", "Helium", "Nickel", "Tin"], globeLayer: "raw-material" },
                { layer: "Products", items: ["Fiber optic cable", "GaN power chips", "Li-ion batteries", "Permanent magnets", "Wiring & PCBs", "Semiconductor wafers", "IR optics", "Solar cells"], globeLayer: "component" },
                { layer: "End Applications", items: ["AI Datacenters", "Electric Vehicles", "Defense & Radar", "Telecom Networks", "Space Systems", "Grid & Energy"], globeLayer: "end-use" },
              ];
            }
            return [];
          })();

          const activeLayerData = layerData.find(l => l.layer === selectedLayer);

          return (
            <div style={{
              width: 150, minWidth: 150, flexShrink: 0,
              background: "#111111", borderRadius: 10,
              margin: "0 5px",
              border: "0.2px solid rgb(42, 42, 42)",
              padding: "14px 0",
              overflowY: "auto",
              display: "flex", flexDirection: "column",
              minHeight: 0,
            }}>
              {/* Verticals section */}
              <p style={{ fontSize: 7, letterSpacing: "0.1em", color: "#4a4540", textTransform: "uppercase" as const, margin: "0 12px 8px", fontFamily: "'Geist Mono', monospace" }}>Verticals</p>
              {VERTICALS_DATA.map(v => {
                const isActive = currentVertical?.id === v.id || globeNavTarget === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      if (v.comingSoon) return;
                      if (centerView === "globe") {
                        setGlobeNavTarget(v.id === globeNavTarget ? null : v.id);
                        return;
                      }
                      setPath([{ type: "vertical", id: v.id, name: v.name }]);
                      setAnimKey(k => k + 1);
                      setSelectedLayer(null);
                    }}
                    style={{
                      padding: "6px 12px",
                      cursor: v.comingSoon ? "default" : "pointer",
                      opacity: v.comingSoon ? 0.35 : 1,
                      background: isActive ? "rgba(255,255,255,0.04)" : "transparent",
                      borderLeft: isActive ? "2px solid #555" : "2px solid transparent",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => { if (!v.comingSoon && !isActive) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <p style={{ fontSize: 10, margin: 0, color: isActive ? warmWhite : "#706a60", fontWeight: isActive ? 500 : 400 }}>{v.name}</p>
                  </div>
                );
              })}

              {/* Layers section */}
              {layerData.length > 0 && (
                <>
                  <div style={{ height: 1, background: "rgb(42, 42, 42)", margin: "12px 12px" }} />
                  <p style={{ fontSize: 7, letterSpacing: "0.1em", color: "#4a4540", textTransform: "uppercase" as const, margin: "0 12px 8px", fontFamily: "'Geist Mono', monospace" }}>Layers</p>
                  {layerData.map(l => {
                    const isActive = selectedLayer === l.layer;
                    return (
                      <div
                        key={l.layer}
                        onClick={() => {
                          const nextLayer = isActive ? null : l.layer;
                          setSelectedLayer(nextLayer);
                          // Update globe filter when on globe view
                          if (centerView === "globe" && l.globeLayer) {
                            const nextGlobe = isActive ? null : l.globeLayer;
                            setGlobeFilterLayer(nextGlobe);
                            const sel = new Set<string>();
                            if (nextGlobe) sel.add(nextGlobe);
                            globeRef.current?.updateFilter({ selectedLayers: sel, activeSubType: null, activeSubParent: null });
                          }
                        }}
                        style={{
                          padding: "5px 12px",
                          cursor: "pointer",
                          background: isActive ? "rgba(255,255,255,0.04)" : "transparent",
                          borderLeft: isActive ? "2px solid #555" : "2px solid transparent",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                      >
                        <p style={{ fontSize: 10, margin: 0, color: isActive ? warmWhite : "#706a60", fontWeight: isActive ? 500 : 400 }}>{l.layer}</p>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Items section — shows items of selected layer */}
              {activeLayerData && (
                <>
                  <div style={{ height: 1, background: "rgb(42, 42, 42)", margin: "12px 12px" }} />
                  <p style={{ fontSize: 7, letterSpacing: "0.1em", color: "#4a4540", textTransform: "uppercase" as const, margin: "0 12px 8px", fontFamily: "'Geist Mono', monospace" }}>{selectedLayer}</p>
                  {activeLayerData.items.map(item => {
                    const isItemActive = globeNavTarget === item;
                    // Map item names to navigable paths for tree view
                    const itemNavMap: Record<string, PathEntry[]> = {
                      "Germanium": [{ type: "vertical", id: currentVertical?.id ?? "resources", name: currentVertical?.name ?? "Global Resources" }, { type: "raw-material", id: "germanium", name: "Germanium" }],
                      "Gallium": [{ type: "vertical", id: currentVertical?.id ?? "resources", name: currentVertical?.name ?? "Global Resources" }, { type: "raw-material", id: "gallium", name: "Gallium" }],
                      "Fiber optic cable": [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "subsystem", id: "connectivity", name: "Connectivity" }, { type: "component", id: "fiber", name: "Fiber optic cable" }],
                      "Connectivity": [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "subsystem", id: "connectivity", name: "Connectivity" }],
                    };
                    const canNavigate = centerView === "tree" && !!itemNavMap[item];
                    const isClickable = centerView === "globe" || canNavigate;
                    return (
                      <div
                        key={item}
                        onClick={() => {
                          if (centerView === "globe") {
                            setGlobeNavTarget(isItemActive ? null : item);
                          } else if (canNavigate) {
                            setPath(itemNavMap[item]);
                            setAnimKey(k => k + 1);
                            setSelectedLayer(null);
                            setSelectedTreeNode(null);
                          }
                        }}
                        style={{
                          padding: "4px 12px",
                          cursor: isClickable ? "pointer" : "default",
                          background: isItemActive ? "rgba(255,255,255,0.04)" : "transparent",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => { if (isClickable) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                        onMouseLeave={e => { if (!isItemActive) e.currentTarget.style.background = "transparent"; }}
                      >
                        <p style={{ fontSize: 9, margin: 0, color: isItemActive ? warmWhite : (canNavigate ? "#807870" : "#706a60") }}>{item}{canNavigate ? " →" : ""}</p>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          );
        })()}

        {/* Center — header + tabs + content OR globe */}
        <div style={{
          width: 1020, maxWidth: 1020, flexShrink: 0,
          background: "#111111",
          borderRadius: 10,
          overflow: "hidden",
          border: "0.2px solid rgb(42, 42, 42)",
          display: "flex", flexDirection: "column",
          position: "relative",
        }}>
          {centerView === "globe" ? (
            <>
              {/* Globe view — default landing */}
              <div style={{ padding: "16px 30px 0", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                {(() => {
                  const info = globeNavTarget ? GLOBE_CARD_INFO[globeNavTarget] : null;
                  if (info) {
                    return (
                      <div style={{
                        width: "fit-content", maxWidth: "fit-content", background: "rgba(26, 26, 26, 1)",
                        border: "0.5px solid rgba(255,255,255,0.06)",
                        borderRadius: 6, padding: "10px 14px",
                      }}>
                        <p style={{ fontSize: 16, fontWeight: 400, color: "#ece8e1", margin: "0 0 4px 0", fontFamily: "'Instrument Serif', serif" }}>{info.title}</p>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5, margin: 0 }}>{info.description}</p>
                      </div>
                    );
                  }
                  return (
                    <div style={{ width: "fit-content", maxWidth: "fit-content", padding: "10px 14px" }}>
                      <p style={{ fontSize: 16, fontWeight: 400, color: "#ece8e1", margin: "0 0 4px 0", fontFamily: "'Instrument Serif', serif" }}>{templateTitle}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5, margin: 0 }}>{templateSubtitle}</p>
                    </div>
                  );
                })()}
                {/* View toggle */}
                <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
                  <button
                    onClick={() => { setCenterView("tree"); setGlobeNavTarget(null); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: "transparent", border: "none", cursor: "pointer",
                      color: "#555", fontSize: 10, fontFamily: "'Geist Mono', monospace",
                      padding: "4px 0", transition: "color 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = warmWhite; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#555"; }}
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <line x1="8" y1="2" x2="8" y2="14" />
                      <line x1="8" y1="6" x2="13" y2="3" />
                      <line x1="8" y1="10" x2="13" y2="13" />
                    </svg>
                    Tree
                  </button>
                  <button
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: "transparent", border: "none", cursor: "default",
                      color: warmWhite, fontSize: 10, fontFamily: "'Geist Mono', monospace",
                      padding: "4px 0",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <circle cx="8" cy="8" r="6.5" />
                      <ellipse cx="8" cy="8" rx="3" ry="6.5" />
                      <line x1="1.5" y1="8" x2="14.5" y2="8" />
                    </svg>
                    Globe
                  </button>
                </div>
              </div>
              <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
                <Globe
                  ref={globeRef}
                  onHoverNode={setHoveredGlobeNode}
                  onClickNode={(name) => {
                    setSelectedTreeNode(prev => prev === name ? null : name);
                    globeRef.current?.highlightNode(selectedTreeNode === name ? null : name);
                  }}
                />
                {/* Navigate button — shown when a vertical or item is selected */}
                {globeNavTarget && (
                  <div style={{ position: "absolute", bottom: 16, right: 20, zIndex: 20 }}>
                    <button
                      onClick={() => {
                        // Map nav target to a path
                        const navMap: Record<string, PathEntry[]> = {
                          ai: [{ type: "vertical", id: "ai", name: "AI Infrastructure" }],
                          resources: [{ type: "vertical", id: "resources", name: "Global Resources" }],
                          "Germanium": [{ type: "vertical", id: "resources", name: "Global Resources" }, { type: "raw-material", id: "germanium", name: "Germanium" }],
                          "Gallium": [{ type: "vertical", id: "resources", name: "Global Resources" }, { type: "raw-material", id: "gallium", name: "Gallium" }],
                          "Fiber optic cable": [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "subsystem", id: "connectivity", name: "Connectivity" }, { type: "component", id: "fiber", name: "Fiber optic cable" }],
                          "Connectivity": [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "subsystem", id: "connectivity", name: "Connectivity" }],
                          "AI Datacenter": [{ type: "vertical", id: "ai", name: "AI Infrastructure" }],
                          "AI Datacenters": [{ type: "vertical", id: "ai", name: "AI Infrastructure" }],
                        };
                        const targetPath = navMap[globeNavTarget!];
                        if (targetPath) {
                          setPath(targetPath);
                        }
                        setCenterView("tree");
                        setAnimKey(k => k + 1);
                        setGlobeNavTarget(null);
                        setGlobeFilterLayer(null);
                        setSelectedLayer(null);
                      }}
                      style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                        color: "#ece8e1", background: "#1a1816",
                        border: "1px solid #252220", borderRadius: 8,
                        padding: "8px 18px", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 8,
                        transition: "border-color 0.15s, background 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#3a3835"; e.currentTarget.style.background = "#1e1c18"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#252220"; e.currentTarget.style.background = "#1a1816"; }}
                    >
                      View {globeNavTarget}
                      <span style={{ fontSize: 11, color: "#706a60" }}>&rarr;</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
          <>
          {/* Header area — fixed, doesn't scroll */}
          <div style={{ padding: "16px 30px 0", flexShrink: 0, position: "relative" }}>
            {renderBreadcrumb()}
            {/* View toggle — top right */}
            <div style={{ position: "absolute", top: 16, right: 30, display: "flex", gap: 12 }}>
              <button
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: "transparent", border: "none", cursor: "default",
                  color: warmWhite, fontSize: 10, fontFamily: "'Geist Mono', monospace",
                  padding: "4px 0",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="8" y1="2" x2="8" y2="14" />
                  <line x1="8" y1="6" x2="13" y2="3" />
                  <line x1="8" y1="10" x2="13" y2="13" />
                </svg>
                Tree
              </button>
              <button
                onClick={() => { setCenterView("globe"); setGlobeNavTarget(null); }}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: "transparent", border: "none", cursor: "pointer",
                  color: "#555", fontSize: 10, fontFamily: "'Geist Mono', monospace",
                  padding: "4px 0", transition: "color 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = warmWhite; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#555"; }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="8" cy="8" r="6.5" />
                  <ellipse cx="8" cy="8" rx="3" ry="6.5" />
                  <line x1="1.5" y1="8" x2="14.5" y2="8" />
                </svg>
                Globe
              </button>
            </div>
            {(() => {
              return (
                <div style={{ marginBottom: (currentVertical?.id === "ai" && currentLevel === "subsystems") ? 20 : 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                    <h1 style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontSize: 20,
                      fontWeight: 400, color: warmWhite, margin: 0,
                    }}>
                      {templateTitle}
                    </h1>
                    {selectedFeaturedChain && currentVertical?.id === "ai" && currentLevel === "subsystems" && (
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 0,
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 20, padding: "4px 12px",
                      }}>
                        {["Germanium", "GeCl₄", "Fiber Optics", "Connectivity", "AI Data Center"].map((node, ni, arr) => (
                          <span key={node} style={{ display: "inline-flex", alignItems: "center", gap: 0 }}>
                            <span style={{ fontSize: 9, color: "#a09888", fontFamily: "'Geist Mono', monospace", whiteSpace: "nowrap" }}>{node}</span>
                            {ni < arr.length - 1 && <span style={{ fontSize: 8, color: "#4a4540", margin: "0 6px" }}>→</span>}
                          </span>
                        ))}
                      </div>
                    )}
                    {templateAnalysisHref && (
                      <a href={templateAnalysisHref} style={{
                        fontSize: 10, color: "#fff", padding: "6px 14px",
                        background: templateAccent ?? "#706a60", border: "none", borderRadius: 6,
                        textDecoration: "none", transition: "opacity 0.15s", flexShrink: 0,
                      }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                      >Full analysis &rarr;</a>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: bodyText, lineHeight: 1.5, margin: 0 }}>
                    {templateSubtitle}
                  </p>
                </div>
              );
            })()}
            {/* Layer flow steps — shown on input pages above tabs */}
            {(() => {
              const isInputPage = lastEntry && (lastEntry.type === "raw-material" || lastEntry.type === "component");
              if (!isInputPage) return null;
              const accent = templateAccent ?? "#706a60";
              type LayerStep = { label: string; value: string; desc: string; context: string };
              const LAYER_FLOWS: Record<string, { steps: LayerStep[] }> = {
                germanium: { steps: [
                  { label: "Host Ore Extraction", value: "4,000t Ge Reserves", desc: "Recovered as byproduct from zinc ores, coal ash, and smelting residues.", context: "Only 8 deposits globally with high enough germanium concentration to justify extraction circuits. China operates ~83% of primary capacity." },
                  { label: "High-Purity Refining", value: "230t/yr Ge Refined", desc: "Processed into purified germanium metal or chemical feedstock.", context: "Six refineries worldwide. Only one in the west — Umicore in Belgium — produces fiber-grade GeCl₄ at commercial scale." },
                  { label: "End-Product Conversion", value: "286t/yr Demand", desc: "Converted into forms used in fiber optics, IR optics, solar cells, and semiconductors.", context: "Fiber optics, IR defense optics, satellite solar, SiGe chips, and catalysts all draw from the same fixed supply." },
                ]},
                gallium: { steps: [
                  { label: "Byproduct Source", value: "50 ppm in Bauxite", desc: "Extracted as a trace element during alumina refining from bauxite.", context: "Gallium content is uniform across all bauxite. Output is set by aluminum demand, not gallium demand." },
                  { label: "Primary Production", value: "600t/yr Extracted", desc: "Ion-exchange circuits capture gallium from alumina process streams.", context: "Only ~20 of the world's alumina refineries have gallium recovery circuits installed — almost all in China." },
                  { label: "High-Purity Refining", value: "320t/yr Refined", desc: "Purified to 99.9999%+ via zone refining and electrolytic processes.", context: "Each additional nine of purity is exponentially harder. Western refiners depend on Chinese primary feedstock." },
                ]},
                fiber: { steps: [
                  { label: "Chemical Conversion", value: "220t/yr GeCl₄", desc: "Germanium converted to GeCl₄ at 8N purity. Silica to SiCl₄. Helium purified.", context: "Only 6 facilities globally produce fiber-grade GeCl₄. Helium is a non-renewable byproduct with no substitute." },
                  { label: "Preform Manufacturing", value: "24kt/yr Preform", desc: "GeCl₄ deposited layer by layer inside silica tubes to build glass preform rods.", context: "One equipment supplier — Rosendahl Nextrom — with 18-24 month order backlogs for new deposition lines." },
                  { label: "Fiber Draw & Assembly", value: "720M km/yr Fiber", desc: "Preforms drawn into strands, coated, bundled, and sheathed into cable.", context: "Drawing capacity is not the bottleneck — preform supply is. All major lines running at full utilization." },
                ]},
              };
              const flow = LAYER_FLOWS[lastEntry.id];
              if (!flow) return null;
              // Compute a faded version of the accent color
              const accentFaded = accent.startsWith("#") ? accent + "99" : accent.replace(")", ", 0.6)").replace("rgb(", "rgba(");
              return (
                <div style={{ marginBottom: 12, background: "rgb(27, 27, 27)", borderRadius: 5, padding: "10px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ fontSize: 10, color: warmWhite, margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, fontFamily: "'Geist Mono', monospace" }}>Layers</p>
                    <span
                      onClick={() => setLayersExpanded(!layersExpanded)}
                      style={{ fontSize: 9, color: accent, cursor: "pointer", transition: "color 0.15s", fontFamily: "'Geist Mono', monospace", display: "flex", alignItems: "center", gap: 4 }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                    >
                      {layersExpanded ? "Collapse" : "Expand"}
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ transform: layersExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                        <path d="M2 4L5 7L8 4" />
                      </svg>
                    </span>
                  </div>
                  <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 0 8px 0" }} />
                  <div style={{ display: "flex", gap: 0 }}>
                    {flow.steps.map((step, si) => (
                      <div key={step.label} style={{ flex: 1, padding: "4px 12px 4px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: layersExpanded ? 4 : 0 }}>
                          <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${accent}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 7, color: accent, fontWeight: 500, fontFamily: "'Geist Mono', monospace" }}>{si + 1}</span>
                          </div>
                          <span style={{ fontSize: 11, color: warmWhite, fontWeight: 500 }}>{step.label}:</span>
                          <span style={{ fontSize: 11, color: accent, fontWeight: 500, marginLeft: 4 }}>{step.value}</span>
                        </div>
                        <p style={{ fontSize: 11, color: "rgb(160, 152, 136)", lineHeight: 1.4, margin: "5px 0 0 0" }}>{step.desc}</p>
                        {layersExpanded && (
                          <>
                            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "6px 0" }} />
                            <p style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.55)", lineHeight: 1.4, margin: 0, fontWeight: 500 }}>{step.context}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Supply tree area — fixed height normally, flex when investment ideas */}
          <div style={{
            flex: 1, minHeight: 0,
            overflowY: "auto", overflowX: "hidden",
            padding: "0 30px 20px",
          }}>
            <div style={{ background: "rgb(27, 27, 27)", borderRadius: 5, padding: "14px 16px", overflow: "hidden", ...(currentVertical?.id === "ai" && currentLevel === "subsystems" ? { background: "transparent", padding: 0 } : {}) }}>
              {/* Tabs — hidden on AI infra vertical tree */}
              {!(currentVertical?.id === "ai" && currentLevel === "subsystems") && (
                <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${borderColor}`, marginBottom: 14 }}>
                  {["Supply Tree", "Map", "Dependencies", "Analysis", "Investment Ideas"].map((tab, ti) => {
                    const tabId = tab.toLowerCase().replace(/\s+/g, "-");
                    const isActive = activeTab === tabId;
                    return (
                      <div
                        key={tabId}
                        onClick={() => setActiveTab(tabId)}
                        style={{
                          padding: ti === 0 ? "8px 12px 8px 0" : "8px 12px",
                          fontSize: 10,
                          color: isActive ? "#a09888" : "#555",
                          cursor: "pointer",
                          borderBottom: isActive ? "1.5px solid #888" : "1.5px solid transparent",
                          transition: "color 0.15s, border-color 0.15s",
                          marginBottom: -1,
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "#706a60"; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "#555"; }}
                      >
                        {tab}
                      </div>
                    );
                  })}
                </div>
              )}
            <div
              key={animKey}
              style={{
                animation: "containerOpen 350ms ease-out forwards",
                position: "relative",
                paddingBottom: 0,
              }}
            >
              {activeTab === "supply-tree" && (
                path.length === 0 ? renderVerticalsContent() : renderContainerContent()
              )}
              {activeTab === "dependencies" && lastEntry && (
                <DependenciesTable inputId={lastEntry.id} />
              )}
              {activeTab === "map" && (() => {
                const mapId = lastEntry?.id === "fiber" ? "fiber" : lastEntry?.id;
                const mapNodes = mapId ? MAP_NODES[mapId] : null;
                if (!mapNodes) return <div style={{ padding: "40px 0", color: "#4a4540", fontSize: 12 }}>Select an input to view its map.</div>;
                return (
                  <div style={{ width: "100%", height: 400 }}>
                    <NodeMap
                      nodes={mapNodes}
                      connections={mapId ? MAP_CONNECTIONS[mapId] : undefined}
                      selectedNode={selectedTreeNode}
                      onClickNode={(name) => setSelectedTreeNode(prev => prev === name ? null : name)}
                    />
                  </div>
                );
              })()}
              {activeTab === "investment-ideas" && (() => {
                const inputId = lastEntry?.id === "fiber" ? "fiber" : lastEntry?.id;
                const wtmi = inputId ? INPUT_WTMI[inputId] : null;
                if (!wtmi) return <div style={{ padding: "40px 0", color: "#4a4540", fontSize: 12 }}>Select an input to view investment ideas.</div>;

                // Show full brief if one is selected
                if (selectedBriefId && wtmi.briefs[selectedBriefId]) {
                  const brief = wtmi.briefs[selectedBriefId];
                  return (
                    <div style={{ padding: "16px", margin: "12px 0", background: "rgb(22, 21, 20)", borderRadius: 6 }}>
                      <button
                        onClick={() => setSelectedBriefId(null)}
                        style={{
                          background: "transparent", border: "none", cursor: "pointer",
                          color: "#706a60", fontSize: 9, fontFamily: "'Geist Mono', monospace",
                          padding: "0 0 12px 0", display: "flex", alignItems: "center", gap: 4,
                        }}
                      >
                        &larr; Back to ideas
                      </button>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 500, color: warmWhite, margin: 0, fontFamily: "'Instrument Serif', serif" }}>{brief.name}</h3>
                        <span style={{ fontSize: 10, color: "#555", fontFamily: "'Geist Mono', monospace" }}>{brief.ticker}</span>
                      </div>
                      <p style={{ fontSize: 10, color: templateAccent ?? "#706a60", margin: "0 0 10px 0", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.04em" }}>{brief.category}</p>
                      {/* Metrics row */}
                      <div style={{ display: "flex", gap: 16, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${borderColor}` }}>
                        {brief.metrics.map(m => (
                          <div key={m.label}>
                            <p style={{ fontSize: 9, color: "#555", margin: "0 0 2px 0", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{m.label}</p>
                            <p style={{ fontSize: 12, color: warmWhite, margin: 0, fontWeight: 500 }}>{m.value}</p>
                          </div>
                        ))}
                      </div>
                      {/* Sections */}
                      {brief.sections.map((sec, si) => (
                        <div key={si} style={{ marginBottom: 16 }}>
                          <p style={{ fontSize: 12, color: "rgb(158, 156, 153)", fontWeight: 500, margin: "0 0 8px 0" }}>{sec.label}</p>
                          {sec.items.map((item, ii) => (
                            <div key={ii} style={{ marginBottom: 8 }}>
                              {item.title && <p style={{ fontSize: 12, color: warmWhite, fontWeight: 500, margin: "0 0 3px 0" }}>{item.title}</p>}
                              <p style={{ fontSize: 12, color: "#807870", lineHeight: 1.6, margin: 0 }}>{item.text}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  );
                }

                // Ideas table
                const allIdeas = wtmi.layers.flatMap(l => l.ideas.map(idea => ({ ...idea, layer: l.label })));
                return (
                  <div style={{ padding: "12px 0" }}>
                    <div style={{ background: "rgb(22, 21, 20)", borderRadius: 6, padding: 5, overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                        <thead>
                          <tr>
                            {["Company", "Category", "Layer", "Thesis"].map((h, i) => (
                              <th key={i} style={{
                                textAlign: "left", padding: "6px 8px",
                                fontSize: 7, letterSpacing: "0.08em", textTransform: "uppercase" as const,
                                color: "#4a4540", fontWeight: 500, fontFamily: "'Geist Mono', monospace",
                                borderBottom: `1px solid ${borderColor}`,
                              }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {allIdeas.map(idea => (
                            <tr
                              key={idea.id}
                              onClick={() => setSelectedBriefId(idea.id)}
                              style={{ cursor: "pointer", transition: "background 0.15s" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                            >
                              <td style={{ padding: "7px 8px", color: "rgb(160, 152, 136)", fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.04)", whiteSpace: "nowrap" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <div style={{ width: 16, height: 16, borderRadius: 3, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    {(() => {
                                      const domain = LOGO_DOMAINS[idea.name];
                                      if (!domain) return <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect width="16" height="16" rx="3" fill="rgba(255,255,255,0.08)" /><text x="8" y="11" textAnchor="middle" fill="#555" fontSize="9" fontFamily="sans-serif">{idea.name.charAt(0)}</text></svg>;
                                      return (
                                        <img
                                          src={`https://logo.clearbit.com/${domain}`}
                                          alt=""
                                          style={{ width: 12, height: 12, borderRadius: 2 }}
                                          onError={e => {
                                            const el = e.target as HTMLImageElement;
                                            el.style.display = "none";
                                          }}
                                        />
                                      );
                                    })()}
                                  </div>
                                  {idea.name} <span style={{ color: "#555", fontWeight: 400, fontSize: 8, fontFamily: "'Geist Mono', monospace" }}>({idea.ticker})</span>
                                </div>
                              </td>
                              <td style={{ padding: "7px 8px", color: templateAccent ?? "#706a60", fontSize: 8, borderBottom: "1px solid rgba(255,255,255,0.04)", whiteSpace: "nowrap" }}>{idea.category}</td>
                              <td style={{ padding: "7px 8px", color: "#555", fontSize: 8, fontFamily: "'Geist Mono', monospace", borderBottom: "1px solid rgba(255,255,255,0.04)", whiteSpace: "nowrap" }}>{idea.layer}</td>
                              <td style={{ padding: "7px 8px", color: bodyText, fontSize: 9, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{idea.line1}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
              {activeTab === "analysis" && (() => {
                const inputId = lastEntry?.id === "fiber" ? "fiber" : lastEntry?.id;
                const soWhat = inputId ? INPUT_SOWHAT[inputId] : null;
                if (!soWhat || soWhat.length === 0) return <div style={{ padding: "40px 0", color: "#4a4540", fontSize: 12 }}>Select an input to view analysis.</div>;

                const activeSection = soWhat[selectedAnalysisIdx] ?? soWhat[0];

                return (
                  <div style={{ display: "flex", gap: 0, padding: 10, margin: "10px 0", background: "rgb(22, 21, 20)", borderRadius: 6 }}>
                    {/* Left column — section labels */}
                    <div style={{ width: 240, minWidth: 240, flexShrink: 0, borderRight: `1px solid ${borderColor}`, paddingRight: 16 }}>
                      {soWhat.map((item, i) => {
                        const isActive = i === selectedAnalysisIdx;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedAnalysisIdx(i)}
                            style={{
                              padding: "12px 12px",
                              cursor: "pointer",
                              borderBottom: `1px solid rgba(255,255,255,0.04)`,
                              borderLeft: isActive ? "2px solid #706a60" : "2px solid transparent",
                              background: isActive ? "rgba(255,255,255,0.02)" : "transparent",
                              transition: "background 0.15s, border-color 0.15s",
                            }}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.015)"; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                          >
                            <p style={{ fontSize: 12, fontWeight: isActive ? 600 : 500, color: isActive ? warmWhite : "rgb(160, 152, 136)", margin: 0 }}>{item.label}</p>
                          </div>
                        );
                      })}
                    </div>
                    {/* Right column — full analysis content */}
                    <div style={{ flex: 1, paddingLeft: 20, overflowY: "auto" }}>
                      <p style={{ fontSize: 12, color: "#706a60", margin: "0 0 12px 0", fontStyle: "italic" }}>{activeSection.question}</p>
                      {activeSection.analysis.map((block, bi) => {
                        if (block.type === "subhead") {
                          return <p key={bi} style={{ fontSize: 12, color: warmWhite, fontWeight: 600, margin: bi === 0 ? "0 0 6px 0" : "16px 0 6px 0" }}>{block.text}</p>;
                        }
                        if (block.type === "item") {
                          return (
                            <div key={bi} style={{ marginBottom: 10, paddingLeft: 10, borderLeft: "2px solid rgba(255,255,255,0.06)" }}>
                              <p style={{ fontSize: 12, color: "rgb(160, 152, 136)", fontWeight: 500, margin: "0 0 3px 0" }}>{block.name}</p>
                              <p style={{ fontSize: 12, color: "#807870", lineHeight: 1.7, margin: 0 }}>{block.desc}</p>
                            </div>
                          );
                        }
                        if (block.type === "callout") {
                          return (
                            <div key={bi} style={{ marginBottom: 12, borderLeft: "2px solid #4a4540", paddingLeft: 12 }}>
                              <p style={{ fontSize: 12, color: "#a09888", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>{block.text}</p>
                            </div>
                          );
                        }
                        // prose (default)
                        return (
                          <div key={bi} style={{ marginBottom: 12 }}>
                            {block.title && <p style={{ fontSize: 12, color: warmWhite, fontWeight: 500, margin: "0 0 4px 0" }}>{block.title}</p>}
                            <p style={{ fontSize: 12, color: "#807870", lineHeight: 1.7, margin: 0 }}>{block.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
              {activeTab !== "supply-tree" && activeTab !== "dependencies" && activeTab !== "map" && activeTab !== "investment-ideas" && activeTab !== "analysis" && (
                <div style={{ padding: "40px 0", color: "#4a4540", fontSize: 12 }}>
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/-/g, " ")} — coming soon
                </div>
              )}
            </div>
          </div>


          {/* Bottom section — key takeaways (hidden) */}
          <div style={{
            height: 0,
            flexShrink: 0,
            overflow: "hidden",
          }}>
            {(() => {
              const inputId = lastEntry?.id;

              // Map tab: show geo summary
              if (activeTab === "map") {
                const geoKey = inputId === "fiber" ? "fiber" : inputId;
                const geo = geoKey ? GEO_SUMMARY[geoKey] : null;
                if (!geo) return null;
                return (
                  <div style={{ background: "rgba(36, 32, 29, 0.28)", borderRadius: 8, padding: "14px 18px", width: "100%" }}>
                    <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: "0 0 10px 0", fontFamily: "'Geist Mono', monospace" }}>GEOGRAPHIC CONCENTRATION</p>
                    <p style={{ fontSize: 12, color: "#706a60", lineHeight: 1.5, margin: 0 }}>{geo}</p>
                  </div>
                );
              }

              // Dependencies tab: show takeaway from deps data
              if (activeTab === "dependencies" && inputId) {
                const deps = INPUT_DEPS[inputId];
                const takeaway = deps?.downstream?.takeaway ?? deps?.upstream?.takeaway;
                if (!takeaway) return null;
                return (
                  <div style={{ background: "rgba(36, 32, 29, 0.28)", borderRadius: 8, padding: "14px 18px", width: "100%" }}>
                    <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: "0 0 10px 0", fontFamily: "'Geist Mono', monospace" }}>KEY TAKEAWAY</p>
                    <p style={{ fontSize: 12, color: "#706a60", lineHeight: 1.5, margin: 0 }}>{takeaway}</p>
                  </div>
                );
              }

              // Supply tree tab (default): numbered takeaways
              let takeaways: string[] = [];
              if (inputId === "germanium") {
                takeaways = [
                  "Only 8 coal and zinc deposits in the world host germanium at high enough concentration to be commercially extracted.",
                  "83% of that supply is in China.",
                  "Two western sources exist \u2014 Big Hill is new DRC tailings refined exclusively by Umicore, and Red Dog is a declining Alaskan zinc mine expected to expire in 2031.",
                  "Outside China, Umicore and 5N Plus are the sole western supply for germanium-reliant products.",
                ];
              } else if (inputId === "gallium") {
                takeaways = [
                  "Bauxite is mined globally across five regions \u2014 Guinea, Australia, China, Brazil, and Indonesia \u2014 with ~346M tonnes produced per year.",
                  "Gallium isn\u2019t extracted at the mine \u2014 it\u2019s recovered downstream at alumina refineries, and ~98% of those refineries are in China.",
                  "Four western projects are trying to rebuild primary capacity \u2014 but none operate at scale before 2028.",
                  "Outside China, Dowa in Japan does the bulk of high-purity refining \u2014 but all depend on Chinese primary feedstock.",
                ];
              } else if (inputId === "fiber") {
                takeaways = [
                  "Three constrained inputs feed fiber production \u2014 germanium tetrachloride, silicon tetrachloride, and helium for cooling.",
                  "Only about 20 preform manufacturers globally produce doped silica rods, and lines are at full utilization.",
                  "Rosendahl Nextrom in Austria is the global monopoly on preform deposition equipment \u2014 18-24 month backlogs.",
                  "Corning controls ~40% of global fiber capacity and stopped selling bare glass to competitors in late 2025.",
                ];
              }
              if (takeaways.length === 0) return null;
              return (
                <div style={{ background: "rgba(36, 32, 29, 0.28)", borderRadius: 8, padding: "14px 18px", width: "100%" }}>
                  <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: "0 0 10px 0", fontFamily: "'Geist Mono', monospace" }}>KEY TAKEAWAYS</p>
                  {takeaways.map((text, i) => (
                    <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#555", flexShrink: 0, minWidth: 14 }}>{i + 1}.</span>
                      <p style={{ fontSize: 12, color: "#706a60", lineHeight: 1.5, margin: 0 }}>{text}</p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
          </div>
          </>
          )}
        </div>

        {/* Right panel — two sections */}
        <div style={{
          flex: 1,
          background: "#111111", borderRadius: 10,
          margin: "0 5px",
          border: "0.2px solid rgb(42, 42, 42)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Top section — geo summary / node detail (globe) + tabs */}
          <div style={{ flexShrink: 0, height: (currentVertical?.id === "ai" && currentLevel === "subsystems") ? 105 : 40, padding: (currentVertical?.id === "ai" && currentLevel === "subsystems") ? "8px 12px 0" : "16px 12px 0", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            {centerView === "tree" && (
              <div style={{ height: (currentVertical?.id === "ai" && currentLevel === "subsystems") ? 105 : 20 }} />
            )}
            {centerView === "globe" && (() => {
              // If a node is selected, show its detail card from universal data
              if (selectedTreeNode) {
                const uNode = getUniversalNode(selectedTreeNode);
                if (uNode) {
                  return (
                    <div style={{ marginBottom: 10 }}>
                      <p style={{ fontSize: 8, letterSpacing: "0.08em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: "0 0 6px 0", fontFamily: "'Geist Mono', monospace" }}>{uNode.layer}</p>
                      <div style={{ background: "rgba(36, 32, 29, 0.28)", borderRadius: 6, padding: "10px 12px" }}>
                        <p style={{ fontSize: 12, color: warmWhite, fontWeight: 500, margin: "0 0 2px 0" }}>{uNode.name}</p>
                        <p style={{ fontSize: 8, color: "#555", margin: "0 0 6px 0", fontFamily: "'Geist Mono', monospace" }}>{uNode.location_detail}</p>
                        {uNode.quantity_pill ? <p style={{ fontSize: 10, color: "#a09888", margin: "0 0 6px 0" }}>{uNode.quantity_pill}</p> : null}
                        {uNode.about ? <p style={{ fontSize: 11, color: "#807870", lineHeight: 1.5, margin: "0 0 6px 0" }}>{uNode.about}</p> : null}
                        {uNode.risk ? (
                          <div style={{ paddingTop: 6, borderTop: "1px solid rgb(45, 41, 39)" }}>
                            <p style={{ fontSize: 7, letterSpacing: "0.06em", color: "#555", margin: "0 0 3px 0", textTransform: "uppercase" as const }}>KEY RISK</p>
                            <p style={{ fontSize: 9, color: "#807870", lineHeight: 1.5, margin: 0 }}>{uNode.risk}</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                }
              }
              // Default: geo summary
              const effVert = (globeNavTarget === "ai" || globeNavTarget === "resources") ? globeNavTarget : currentVertical?.id ?? "resources";
              const rpId = globeNavTarget ? globeNavTarget.toLowerCase() : effVert;
              const geoKey = rpId === "fiber optic cable" ? "fiber" : rpId;
              const geo = GEO_SUMMARY[geoKey];
              if (!geo) return <div style={{ height: 40 }} />;
              return (
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 8, letterSpacing: "0.08em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: "0 0 10px 0", fontFamily: "'Geist Mono', monospace" }}>Geographic Concentration</p>
                  <div style={{ background: "rgba(36, 32, 29, 0.28)", borderRadius: 6, padding: "8px 10px" }}>
                    <p style={{ fontSize: 11, color: "#807870", lineHeight: 1.5, margin: 0 }}>{geo}</p>
                  </div>
                </div>
              );
            })()}
            {currentVertical?.id === "ai" && currentLevel === "subsystems" && (
              <div style={{ height: 1, background: borderColor, marginBottom: 10 }} />
            )}
            <div style={{ height: 1, background: borderColor, marginBottom: 10 }} />
          </div>

          {/* Bottom section — content based on selected tab */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px" }}>
            {/* Stillpoint View — shown on input pages */}
            {centerView === "tree" && lastEntry && (lastEntry.type === "raw-material" || lastEntry.type === "component") && (() => {
              const STILLPOINT_VIEWS: Record<string, { view: string; signalLabel: string; signalId: string }> = {
                germanium: {
                  view: "Germanium's real bottleneck is in its conversion to GeCl₄ before it can be used to make fiber. There's only one company in the west that has the capacity and capability to produce it and it controls one of the only feedstock sources of Ge available to the west.",
                  signalLabel: "GeCl₄ Chokepoint Signal Brief",
                  signalId: "germanium_chokepoint",
                },
                fiber: {
                  view: "Fiber capacity can scale with capex — but it's gated by preform supply, which is gated by GeCl₄, which is gated by germanium. The chain's weakest link isn't fiber itself, it's three layers upstream.",
                  signalLabel: "GeCl₄ Chokepoint Signal Brief",
                  signalId: "germanium_chokepoint",
                },
                gallium: {
                  view: "Gallium supply is structurally locked to aluminum industry decisions. Western refiners have no primary feedstock independence — every path runs through Chinese alumina plants.",
                  signalLabel: "",
                  signalId: "",
                },
              };
              const sv = STILLPOINT_VIEWS[lastEntry.id];
              if (!sv) return null;
              const svAccent = templateAccent ?? "#706a60";
              return (
                <div style={{ background: "rgba(255, 255, 255, 0.02)", borderRadius: 6, padding: "10px 12px", marginBottom: 10 }}>
                  <p style={{ fontSize: 11, color: "rgb(219, 219, 218)", fontWeight: 500, margin: "0 0 6px 0" }}>Stillpoint View</p>
                  <p style={{ fontSize: 11, color: "rgb(160, 152, 136)", lineHeight: 1.5, margin: 0 }}>{sv.view}</p>
                  {sv.signalLabel && (
                    <span
                      onClick={() => {
                        setPath([{ type: "vertical", id: "ai", name: "AI Infrastructure" }]);
                        setAnimKey(k => k + 1);
                        setSelectedFeaturedChain(sv.signalId);
                        setSelectedTreeNode("Germanium");
                        setRightTab("summary");
                      }}
                      style={{ fontSize: 10, color: svAccent, cursor: "pointer", transition: "opacity 0.15s", display: "inline-block", marginTop: 8 }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                    >
                      {sv.signalLabel} →
                    </span>
                  )}
                </div>
              );
            })()}
            {rightTab === "layers" && (() => {
              let layerCards: { label: string; content: string; whyHard: string; stat: string; statLabel: string }[] = [];
              const accent = templateAccent ?? "#706a60";

              if (lastEntry?.id === "germanium" || (lastEntry?.type === "raw-material" && lastEntry?.id === "germanium")) {
                layerCards = [
                  { label: "HOST ORE EXTRACTION", content: "Germanium-rich residues collect in flue dust and leach solutions during zinc smelting. Operations with specialized hydrometallurgical circuits extract it; most don\u2019t.", whyHard: "Germanium exists at 50-800 ppm in host ores. Recovery requires circuits most zinc smelters never install. China operates ~83% of primary capacity.", stat: "~140t/yr", statLabel: "primary germanium extracted" },
                  { label: "REFINING TO HIGH PURITY", content: "Crude oxide is reduced to metal, then zone-refined to 5N+ purity. For fiber optics, converted to GeCl\u2084 and purified to 8N.", whyHard: "Fiber-grade GeCl\u2084 requires parts-per-billion purity. Only 6 facilities globally: four in China, one in Russia, one in the west \u2014 Umicore.", stat: "~230t/yr", statLabel: "refined germanium" },
                  { label: "CONVERSION TO END PRODUCTS", content: "Each end product needs a different form: GeCl\u2084 for fiber, GeO\u2082 blanks for IR optics, wafers for satellite solar, SiGe substrates.", whyHard: "No single facility serves all end markets. Five distinct markets pull on the same ~230t/yr supply.", stat: "5 markets", statLabel: "competing for same supply" },
                ];
              } else if (lastEntry?.id === "gallium" || (lastEntry?.type === "raw-material" && lastEntry?.id === "gallium")) {
                layerCards = [
                  { label: "BYPRODUCT SOURCE", content: "Bauxite is mined and shipped to alumina refineries. Gallium is not extracted at this layer \u2014 it rides along at ~50 ppm.", whyHard: "Gallium content is uniform across all bauxite. Output is determined by aluminum industry decisions, not gallium demand.", stat: "~346M t/yr", statLabel: "bauxite mined globally" },
                  { label: "PRIMARY PRODUCER", content: "Bauxite is processed into alumina. Refineries with ion-exchange circuits capture gallium as a byproduct.", whyHard: "Only ~20 alumina refineries globally have gallium recovery installed, almost all in China.", stat: "~600 t/yr", statLabel: "primary gallium extracted" },
                  { label: "REFINER", content: "Crude 99.99% gallium is purified to 99.9999%+ via zone refining, vacuum distillation, and electrolytic processes.", whyHard: "Each additional nine of purity is exponentially harder. Western refiners depend on Chinese primary feedstock.", stat: "~320 t/yr", statLabel: "high-purity refined gallium" },
                ];
              } else if (lastEntry?.id === "fiber" || (lastEntry?.type === "component" && lastEntry?.id === "fiber")) {
                layerCards = [
                  { label: "CHEMICAL CONVERSION", content: "Refined germanium is converted to GeCl\u2084 at 8N purity. High-purity silica is converted to SiCl\u2084. Helium is purified for cooling.", whyHard: "Only 6 facilities globally produce fiber-grade GeCl\u2084. Helium has no substitute and trades on physical scarcity.", stat: "~220t/yr", statLabel: "fiber-grade GeCl\u2084" },
                  { label: "PREFORM MANUFACTURING", content: "GeCl\u2084 is vaporized and deposited layer by layer inside a silica tube, building a glass preform rod.", whyHard: "Only one equipment supplier \u2014 Rosendahl Nextrom. Adding a new preform line takes 18-24 months.", stat: "~24,000t/yr", statLabel: "preform produced" },
                  { label: "FIBER DRAW & ASSEMBLY", content: "Preforms are drawn into hair-thin strands at 10-20 m/s, coated, bundled, and sheathed into cable.", whyHard: "Drawing isn\u2019t the constraint \u2014 preform supply is. Helium supply is tight.", stat: "~720M km/yr", statLabel: "fiber strand produced" },
                ];
              }

              if (layerCards.length === 0) return null;

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {layerCards.map(card => (
                    <div key={card.label} style={{
                      background: "rgba(36, 32, 29, 0.28)",
                      borderRadius: 6, padding: "10px 12px",
                    }}>
                        <p style={{ fontSize: 10, letterSpacing: "0.08em", color: accent, margin: "0 0 6px 0", fontWeight: 500, textTransform: "uppercase" as const }}>{card.label}</p>
                        <p style={{ fontSize: 11, color: "#807870", lineHeight: 1.5, margin: "0 0 8px 0" }}>{card.content}</p>
                        <p style={{ fontSize: 9, letterSpacing: "0.06em", color: "#555", margin: "0 0 3px 0", textTransform: "uppercase" as const }}>WHY IT&apos;S HARD</p>
                        <p style={{ fontSize: 11, color: "#807870", lineHeight: 1.5, margin: "0 0 0 0" }}>{card.whyHard}</p>
                        <div style={{ marginTop: 8, paddingTop: 6, borderTop: "1px solid rgb(45, 41, 39)" }}>
                          <span style={{ fontSize: 11, color: warmWhite, fontWeight: 500 }}>{card.stat}</span>
                          <span style={{ fontSize: 9, color: "#555", marginLeft: 5 }}>{card.statLabel}</span>
                        </div>
                      </div>
                    ))}
                </div>
              );
            })()}

            {/* Summary tab — globe view: node list; tree view: executive summary */}
            {rightTab === "summary" && centerView === "globe" && (() => {
              const effVert2 = (globeNavTarget === "ai" || globeNavTarget === "resources") ? globeNavTarget : currentVertical?.id ?? "resources";
              const summaryId = globeNavTarget ? globeNavTarget.toLowerCase() : effVert2;
              const resolvedId = summaryId === "fiber optic cable" ? "fiber" : summaryId;
              const nodeLayers = resolvedId ? INPUT_NODE_LAYERS[resolvedId] : null;

              if (!nodeLayers) return <p style={{ fontSize: 10, color: "#555", padding: "20px 0" }}>Select an input to view its nodes.</p>;

              const getNodeData = (name: string) => universalNodes[name] ?? allNodes[name] ?? galliumNodes[name] ?? germaniumNodes[name];

              return (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {nodeLayers.map(group => (
                      <div key={group.layer}>
                        <p style={{ fontSize: 8, letterSpacing: "0.08em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: "0 0 6px 0", fontFamily: "'Geist Mono', monospace" }}>{group.layer}</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {group.nodes.map(nodeName => {
                            const nd = getNodeData(nodeName);
                            const country = (nd as unknown as Record<string, unknown>)?.country as string | undefined;
                            const isSelected = selectedTreeNode === nodeName;
                            return (
                              <div
                                key={nodeName}
                                onClick={() => {
                                  const next = isSelected ? null : nodeName;
                                  setSelectedTreeNode(next);
                                  globeRef.current?.highlightNode(next);
                                }}
                                style={{
                                  display: "flex", alignItems: "center", gap: 8,
                                  padding: "5px 8px", borderRadius: 4, cursor: "pointer",
                                  background: isSelected ? "rgba(255,255,255,0.04)" : "transparent",
                                  transition: "background 0.15s",
                                }}
                                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                              >
                                {country && (
                                  <img
                                    src={`https://flagcdn.com/16x12/${country === "China" ? "cn" : country === "USA" ? "us" : country === "Belgium" ? "be" : country === "Canada" ? "ca" : country === "Russia" ? "ru" : country === "DRC" ? "cd" : country === "Japan" ? "jp" : country === "Germany" ? "de" : country === "France" ? "fr" : country === "Italy" ? "it" : country === "Australia" ? "au" : country === "Brazil" ? "br" : country === "Indonesia" ? "id" : country === "India" ? "in" : country === "Guinea" ? "gn" : country === "South Korea" ? "kr" : country === "Austria" ? "at" : country === "Netherlands" ? "nl" : country === "UAE" ? "ae" : country === "Saudi Arabia" ? "sa" : country === "Global" ? "un" : "xx"}.png`}
                                    alt={country}
                                    style={{ width: 14, height: 10, objectFit: "cover", borderRadius: 1, opacity: 0.7 }}
                                  />
                                )}
                                <span style={{ fontSize: 10, color: isSelected ? warmWhite : "#807870", flex: 1 }}>{nodeName}</span>
                                {country && <span style={{ fontSize: 7, color: "#555", fontFamily: "'Geist Mono', monospace" }}>{country}</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}

            {rightTab === "summary" && centerView === "tree" && (() => {
              const isAITree = currentVertical?.id === "ai" && currentLevel === "subsystems";
              const STATUS_PILL: Record<string, { color: string; bg: string }> = {
                acute: { color: "#c87a4a", bg: "rgba(200, 122, 74, 0.12)" },
                structural: { color: "#c8a85a", bg: "rgba(200, 168, 90, 0.12)" },
                emerging: { color: "#6a9ab8", bg: "rgba(106, 154, 184, 0.12)" },
              };

              // Helper: render featured chain card
              const renderFeaturedChainCard = (chain: FeaturedChain) => {
                const pill = STATUS_PILL[chain.status] ?? STATUS_PILL.structural;
                const titleColor = pill.color + "bf";
                return (
                  <div
                    onClick={() => { const wasSelected = selectedFeaturedChain === chain.id; setSelectedFeaturedChain(wasSelected ? null : chain.id); setSelectedGroup(null); setSelectedTreeNode(wasSelected ? null : "Germanium"); if (!wasSelected) setRightTab("summary"); }}
                    style={{ cursor: "pointer", padding: "8px 10px", borderRadius: 4, transition: "background 0.15s", background: selectedFeaturedChain === chain.id ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.02)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = selectedFeaturedChain === chain.id ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = selectedFeaturedChain === chain.id ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.02)"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                      <p style={{ fontSize: 10, color: titleColor, fontWeight: 500, margin: 0, fontFamily: "'Geist Mono', monospace", textTransform: "uppercase" as const, letterSpacing: "0.03em" }}>{chain.title}</p>
                      <span style={{ fontSize: 7, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: pill.color, background: pill.bg, border: `0.5px solid ${pill.color}`, padding: "2px 5px", borderRadius: 3, fontFamily: "'Geist Mono', monospace", flexShrink: 0 }}>{chain.status}</span>
                    </div>
                    <p style={{ fontSize: 11, color: bodyText, lineHeight: 1.55, margin: "0 0 8px 0" }}>{chain.teaser}</p>
                    <div style={{ height: 0.5, background: "rgba(255,255,255,0.06)", margin: "0 0 8px 0" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
                      {chain.display_chain.map((nodeName, ni) => (
                        <React.Fragment key={ni}>
                          {ni > 0 && <span style={{ fontSize: 9, color: "#3a3835", margin: "0 3px" }}>→</span>}
                          <span style={{ fontSize: 10, color: ni === chain.highlight_display_index ? "rgb(208, 208, 208)" : "#706a60", fontWeight: 400 }}>{nodeName}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                );
              };

              // Helper: render sub-node summary bullets
              // chainStatusColor: when rendered inside a featured chain, use the chain's status color for takeaway border
              const PLAYER_DOMAINS: Record<string, string> = { "Umicore": "umicore.com", "5N Plus": "5nplus.com", "Corning": "corning.com", "Prysmian": "prysmian.com", "YOFC": "yofc.com", "Yunnan Chihong": "", "Dowa": "dowa.co.jp", "AXT": "axt.com", "Korea Zinc": "koreazinc.co.kr", "Nyrstar": "nyrstar.com", "Teck Resources": "teck.com", "MP Materials": "mpmaterials.com", "Lynas": "lynasrareearths.com", "Shenghe": "", "Bloom Energy": "bloomenergy.com", "TSMC": "tsmc.com", "Samsung": "samsung.com", "SK Hynix": "skhynix.com", "Nvidia": "nvidia.com", "Broadcom": "broadcom.com", "Ajinomoto": "ajinomoto.com" };

              // Render a key players card
              const renderKeyPlayersCard = (players: { name: string; layer: string }[], isChainMode?: boolean) => {
                if (players.length === 0) return null;
                return (
                  <div style={{ background: isChainMode ? "rgba(255, 255, 255, 0.02)" : "rgba(36, 32, 29, 0.28)", borderRadius: 6, padding: "10px 12px" }}>
                    <p style={{ fontSize: 11, color: "rgb(219, 219, 218)", fontWeight: 500, margin: "0 0 6px 0" }}>Key Players</p>
                    {players.map(p => {
                      const domain = PLAYER_DOMAINS[p.name];
                      return (
                        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0" }}>
                          <div style={{ width: 16, height: 16, borderRadius: 3, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {domain ? (
                              <img src={`https://logo.clearbit.com/${domain}`} alt="" style={{ width: 12, height: 12, borderRadius: 2 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            ) : (
                              <span style={{ fontSize: 8, color: "#706a60" }}>{p.name.charAt(0)}</span>
                            )}
                          </div>
                          <span style={{ fontSize: 11, color: "rgb(160, 152, 136)" }}>{p.name}</span>
                          <span style={{ fontSize: 9, color: "#706a60" }}>— {p.layer}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              };

              const renderSubNodeSummary = (nodeName: string, opts?: { chainMode?: boolean; chainStatusColor?: string }) => {
                const uNode = universalNodes[nodeName] as unknown as { ai_summary?: string[] | Record<string, string>; quantity_pill?: string } | undefined;
                if (!uNode?.ai_summary) return null;
                const allBullets = Array.isArray(uNode.ai_summary) ? uNode.ai_summary : null;
                if (!allBullets) return null;
                const isChainMode = opts?.chainMode;
                const bullets = allBullets.slice(0, -1);

                const inputPriceMap: Record<string, { price: string; change: string; supply: string; inputId: string }> = {
                  "Germanium": { price: "$8,500/kg", change: "+166%", supply: "~230 t/yr", inputId: "germanium" },
                  "Gallium": { price: "$2,269/kg", change: "+177%", supply: "~320 t/yr", inputId: "gallium" },
                  "Fiber Optic Cable": { price: "48 RMB/km", change: "+140%", supply: "~720M km/yr", inputId: "fiber" },
                  "Germanium Tetrachloride (GeCl4)": { price: "~$300/kg", change: "+200%", supply: "~500 t/yr", inputId: "germanium" },
                };
                const metrics = inputPriceMap[nodeName];
                const qtyPill = uNode.quantity_pill;
                const priceData = metrics ? INPUT_PRICE_HISTORY[metrics.inputId] : null;
                const accentColor = opts?.chainStatusColor ?? "#c87a4a";

                // Navigation map for "View X's Page" button
                const navTargets: Record<string, { label: string; path: PathEntry[] }> = {
                  "Germanium": { label: "Germanium", path: [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "raw-material", id: "germanium", name: "Germanium" }] },
                  "Gallium": { label: "Gallium", path: [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "raw-material", id: "gallium", name: "Gallium" }] },
                  "Fiber Optic Cable": { label: "Fiber Optic Cable", path: [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "subsystem", id: "connectivity", name: "Connectivity" }, { type: "component", id: "fiber", name: "Fiber optic cable" }] },
                };
                const navTarget = navTargets[nodeName];

                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {/* Node name as external header */}
                    <p style={{ fontSize: 13, color: warmWhite, fontWeight: 500, margin: 0 }}>{nodeName}</p>

                    {/* Price + chart card */}
                    {metrics && priceData && (
                      <div style={{ background: isChainMode ? "rgba(255, 255, 255, 0.02)" : "rgba(36, 32, 29, 0.28)", borderRadius: 6, padding: "10px 12px" }}>
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
                          <div>
                            <span style={{ fontSize: 16, fontWeight: 600, color: warmWhite, fontFamily: "'Geist Mono', monospace" }}>{priceData.currentPrice}</span>
                            <span style={{ fontSize: 8, color: "#555", marginLeft: 4, fontFamily: "'Geist Mono', monospace" }}>{priceData.unit}</span>
                          </div>
                          <span style={{ fontSize: 10, color: accentColor, fontFamily: "'Geist Mono', monospace", fontWeight: 500 }}>{priceData.change12m}</span>
                        </div>
                        {/* Sparkline */}
                        {(() => {
                          const W = 200, H = 35, padY = 4;
                          const min = Math.min(...priceData.points);
                          const max = Math.max(...priceData.points);
                          const range = max - min || 1;
                          const pts = priceData.points.map((v, i) => ({
                            x: (i / (priceData.points.length - 1)) * W,
                            y: padY + (1 - (v - min) / range) * (H - padY * 2),
                          }));
                          const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
                          const areaPath = linePath + ` L ${pts[pts.length - 1].x},${H} L ${pts[0].x},${H} Z`;
                          return (
                            <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
                              <defs>
                                <linearGradient id="chainPriceGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={accentColor} stopOpacity="0.2" />
                                  <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <path d={areaPath} fill="url(#chainPriceGrad)" />
                              <path d={linePath} fill="none" stroke={accentColor} strokeWidth="1.5" />
                              <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2" fill={accentColor} />
                            </svg>
                          );
                        })()}
                        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                          <div>
                            <p style={{ fontSize: 7, color: "#4a4540", margin: "0 0 1px 0", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Supply Output</p>
                            <p style={{ fontSize: 10, color: warmWhite, margin: 0, fontWeight: 500 }}>{metrics.supply}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Output for non-priced nodes */}
                    {!metrics && qtyPill && (
                      <div style={{ background: isChainMode ? "rgba(255, 255, 255, 0.02)" : "rgba(36, 32, 29, 0.28)", borderRadius: 6, padding: "10px 12px" }}>
                        <p style={{ fontSize: 7, color: "#4a4540", margin: "0 0 1px 0", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Output</p>
                        <p style={{ fontSize: 10, color: warmWhite, margin: 0, fontWeight: 500 }}>{qtyPill}</p>
                      </div>
                    )}

                    {/* Summary card */}
                    <div style={{ background: isChainMode ? "rgba(255, 255, 255, 0.02)" : "rgba(36, 32, 29, 0.28)", borderRadius: 6, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                      <p style={{ fontSize: 11, color: "rgb(219, 219, 218)", fontWeight: 500, margin: "0 0 2px 0" }}>Summary</p>
                      {bullets.map((bullet, i) => (
                        <div key={i} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 6 }} />
                          <p style={{ fontSize: 11, color: "rgb(160, 152, 136)", lineHeight: 1.5, margin: 0 }}>{bullet}</p>
                        </div>
                      ))}
                    </div>

                    {/* Navigate button */}
                    {navTarget && (
                      <button
                        onClick={() => {
                          setPath(navTarget.path);
                          setAnimKey(k => k + 1);
                          setSelectedTreeNode(null);
                          setSelectedGroup(null);
                          setSelectedFeaturedChain(null);
                        }}
                        style={{
                          background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 4, padding: "8px 14px", cursor: "pointer",
                          fontSize: 10, color: muted, transition: "border-color 0.15s, color 0.15s",
                          width: "100%",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = warmWhite; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = muted; }}
                      >
                        View {navTarget.label}&apos;s Page →
                      </button>
                    )}
                  </div>
                );
              };

              // ── Chain step panel data ──
              type ChainStepData = {
                name: string; layer: string; whyItMatters: string;
                supply: { total: string; breakdown: { source: string; share: string; pct: number }[] };
                demand: { total: string; breakdown: { segment: string; share: string }[] };
                gap: string;
                keyPlayers: { name: string; share: string; flag: string }[];
                whyCantScale: string[];
                navLabel?: string; navPath?: PathEntry[];
              };
              const CHAIN_STEP_PANELS: Record<string, ChainStepData> = {
                "Germanium": {
                  name: "Germanium", layer: "Raw Material",
                  whyItMatters: "Germanium is one of the only materials that seamlessly blends into existing silicon technology to both manipulate light and move electricity at ultra-high speeds. Without it, fiber optic cable cannot guide light.",
                  supply: { total: "~230 t/yr", breakdown: [
                    { source: "China", share: "~120t", pct: 52 }, { source: "Recycled (global)", share: "~90t", pct: 39 },
                    { source: "Russia", share: "~11t", pct: 5 }, { source: "North America", share: "~6t", pct: 4 },
                  ]},
                  demand: { total: "~286t by 2027", breakdown: [
                    { segment: "Fiber optics", share: "~87t" }, { segment: "IR defense optics", share: "~55t" },
                    { segment: "Satellite solar", share: "~35t" }, { segment: "SiGe / other", share: "~53t" },
                  ]},
                  gap: "~56t",
                  keyPlayers: [
                    { name: "Yunnan Chihong", share: "~25%", flag: "cn" },
                    { name: "Umicore", share: "~20%", flag: "be" },
                    { name: "Teck Resources", share: "~5%", flag: "ca" },
                  ],
                  whyCantScale: [
                    "Germanium is never the primary product of any mine — it's a byproduct of zinc smelting.",
                    "Even at $8,500/kg, germanium revenue is a rounding error in a zinc smelter's P&L.",
                    "Recycling is already near theoretical maximum.",
                  ],
                  navLabel: "Germanium", navPath: [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "raw-material", id: "germanium", name: "Germanium" }],
                },
                "Germanium Tetrachloride (GeCl4)": {
                  name: "GeCl₄", layer: "Intermediate / Precursor",
                  whyItMatters: "This is the hidden chokepoint. Raw germanium cannot be used in fiber — it must first be converted to ultra-pure GeCl₄ (8N purity). Only one commercial-scale western facility does this conversion.",
                  supply: { total: "~500 t/yr", breakdown: [
                    { source: "China", share: "~300t", pct: 60 }, { source: "Belgium (Umicore)", share: "~120t", pct: 24 },
                    { source: "Russia", share: "~50t", pct: 10 }, { source: "Other", share: "~30t", pct: 6 },
                  ]},
                  demand: { total: "~650t by 2027", breakdown: [
                    { segment: "Fiber optic preforms", share: "~520t" }, { segment: "IR optics (GeO₂)", share: "~80t" },
                    { segment: "SiGe / other", share: "~50t" },
                  ]},
                  gap: "~150t",
                  keyPlayers: [
                    { name: "Umicore", share: ">50% (west)", flag: "be" },
                    { name: "Chinese state plants", share: "~60% (global)", flag: "cn" },
                    { name: "5N Plus", share: "Pre-commercial", flag: "ca" },
                  ],
                  whyCantScale: [
                    "8N+ purity refining requires proprietary techniques to remove contaminants to parts-per-billion levels.",
                    "Multi-year customer qualification cycles — fiber makers won't switch suppliers without 12-24 months of testing.",
                    "Umicore's Olen plant is the only western facility at commercial scale.",
                  ],
                },
                "Fiber Optic Cable": {
                  name: "Fiber Optic Cable", layer: "Component",
                  whyItMatters: "Fiber is the physical layer that connects everything inside AI datacenters. GPU racks, storage arrays, switches, and buildings are all linked by fiber. AI clusters use up to 36x more fiber than traditional CPU server racks.",
                  supply: { total: "720M km/yr", breakdown: [
                    { source: "China (YOFC)", share: "~310M km", pct: 43 }, { source: "N. America (Corning)", share: "~220M km", pct: 31 },
                    { source: "Europe (Prysmian)", share: "~100M km", pct: 14 }, { source: "Japan / India", share: "~90M km", pct: 12 },
                  ]},
                  demand: { total: "~850M km by 2027", breakdown: [
                    { segment: "AI datacenters", share: "~255M km" }, { segment: "Telecom FTTH", share: "~340M km" },
                    { segment: "BEAD / rural broadband", share: "~85M km" }, { segment: "Subsea & enterprise", share: "~170M km" },
                  ]},
                  gap: "130M km",
                  keyPlayers: [
                    { name: "Corning", share: "~40%", flag: "us" },
                    { name: "YOFC", share: "~18%", flag: "cn" },
                    { name: "Prysmian", share: "~12%", flag: "it" },
                  ],
                  whyCantScale: [
                    "Preform manufacturing has an 18-24 month expansion cycle. Lines are at full utilization globally.",
                    "One equipment supplier — Rosendahl Nextrom (Austria) — has 18-24 month order backlogs.",
                    "Corning stopped selling bare glass fiber to other cable makers in late 2025.",
                  ],
                  navLabel: "Fiber Optic Cable", navPath: [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "subsystem", id: "connectivity", name: "Connectivity" }, { type: "component", id: "fiber", name: "Fiber optic cable" }],
                },
                "Connectivity": {
                  name: "AI Datacenter Connectivity", layer: "Subsystem",
                  whyItMatters: "Connectivity is where the fiber shows up in the real world. Inside every AI datacenter, fiber links GPU racks to switches to storage to other buildings. The networking layer determines how fast data moves between chips.",
                  supply: { total: "~$48B/yr", breakdown: [
                    { source: "North America", share: "~$22B", pct: 46 }, { source: "Asia-Pacific", share: "~$15B", pct: 31 },
                    { source: "Europe", share: "~$8B", pct: 17 }, { source: "Rest of world", share: "~$3B", pct: 6 },
                  ]},
                  demand: { total: "~$72B by 2027", breakdown: [
                    { segment: "AI datacenter networking", share: "~$32B" }, { segment: "Cloud / hyperscale", share: "~$20B" },
                    { segment: "Telecom infrastructure", share: "~$12B" }, { segment: "Enterprise", share: "~$8B" },
                  ]},
                  gap: "~$24B",
                  keyPlayers: [
                    { name: "Arista Networks", share: "~30%", flag: "us" },
                    { name: "Cisco", share: "~25%", flag: "us" },
                    { name: "Broadcom", share: "~35% (silicon)", flag: "us" },
                  ],
                  whyCantScale: [
                    "800G and 1.6T optical transceivers face silicon photonics yield issues at leading edge.",
                    "Network switch capacity (Broadcom Tomahawk, Cisco Silicon One) has 40+ week lead times.",
                  ],
                },
              };

              const renderChainStepPanel = (nodeId: string) => {
                const data = CHAIN_STEP_PANELS[nodeId];
                if (!data) return null;
                const cardBg = "rgba(255, 255, 255, 0.02)";
                const labelStyle = { fontSize: 7 as const, color: "#4a4540", margin: "0 0 1px 0" as const, fontFamily: "'Geist Mono', monospace" as const, letterSpacing: "0.06em" as const, textTransform: "uppercase" as const };
                const sectionTitle = { fontSize: 11 as const, color: "rgb(219, 219, 218)" as const, fontWeight: 500 as const, margin: "0 0 6px 0" as const };
                const bulletDot = { width: 3, height: 3, borderRadius: "50%", background: "#3a3835", flexShrink: 0 as const, marginTop: 6 };
                const bulletText = { fontSize: 10 as const, color: "rgb(160, 152, 136)" as const, lineHeight: 1.5 as const, margin: 0 as const };
                const tblRow = { fontSize: 11 as const, color: "rgb(160, 152, 136)" as const, padding: "3px 0" as const };
                const tblVal = { ...tblRow, textAlign: "right" as const, color: "#ece8e1" };

                const divider = <div style={{ height: 0.5, background: "rgba(255,255,255,0.06)", margin: "10px 0" }} />;

                // Market price data
                const priceKeyMap: Record<string, string> = { "Germanium": "germanium", "Gallium": "gallium", "Fiber Optic Cable": "fiber" };
                const priceKey = priceKeyMap[nodeId];
                const priceData = priceKey ? INPUT_PRICE_HISTORY[priceKey] : null;
                const accentForGap = templateAccent ?? "#c87a4a";

                return (
                  <div style={{ background: cardBg, borderRadius: 6, padding: "12px 12px" }}>

                    {/* Market Price */}
                    {priceData && (
                      <>
                        <p style={sectionTitle}>Market Price</p>
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
                          <div>
                            <span style={{ fontSize: 16, fontWeight: 600, color: warmWhite, fontFamily: "'Geist Mono', monospace" }}>{priceData.currentPrice}</span>
                            <span style={{ fontSize: 8, color: "#555", marginLeft: 4, fontFamily: "'Geist Mono', monospace" }}>{priceData.unit}</span>
                          </div>
                          <span style={{ fontSize: 10, color: accentForGap, fontFamily: "'Geist Mono', monospace", fontWeight: 500 }}>{priceData.change12m}</span>
                        </div>
                        {/* Sparkline */}
                        {(() => {
                          const W = 200, H = 35, padY = 4;
                          const min = Math.min(...priceData.points);
                          const max = Math.max(...priceData.points);
                          const range = max - min || 1;
                          const pts = priceData.points.map((v, i) => ({
                            x: (i / (priceData.points.length - 1)) * W,
                            y: padY + (1 - (v - min) / range) * (H - padY * 2),
                          }));
                          const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
                          const areaPath = linePath + ` L ${pts[pts.length - 1].x},${H} L ${pts[0].x},${H} Z`;
                          return (
                            <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
                              <defs>
                                <linearGradient id="rpPriceGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={accentForGap} stopOpacity="0.2" />
                                  <stop offset="100%" stopColor={accentForGap} stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <path d={areaPath} fill="url(#rpPriceGrad)" />
                              <path d={linePath} fill="none" stroke={accentForGap} strokeWidth="1.5" />
                              <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2" fill={accentForGap} />
                            </svg>
                          );
                        })()}
                        {divider}
                      </>
                    )}

                    {/* Supply */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                      <p style={sectionTitle}>Supply</p>
                      <p style={{ fontSize: 11, color: "#ece8e1", fontWeight: 600, margin: 0, fontFamily: "'Geist Mono', monospace" }}>{data.supply.total}</p>
                    </div>
                    {/* Pie chart + legend */}
                    {(() => {
                      const pieColors = [accentForGap, "#706a60", "#4a4540", "#3a3835"];
                      const R = 36, cx = 44, cy = 44, stroke = 14;
                      const circ = 2 * Math.PI * R;
                      let offset = 0;
                      return (
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <svg width={88} height={88} viewBox="0 0 88 88" style={{ flexShrink: 0 }}>
                            {data.supply.breakdown.map((s, si) => {
                              const pct = s.pct / 100;
                              const dashLen = pct * circ;
                              const dashOff = -offset;
                              offset += dashLen;
                              return (
                                <circle key={si} cx={cx} cy={cy} r={R} fill="none"
                                  stroke={pieColors[si % pieColors.length]} strokeWidth={stroke}
                                  strokeDasharray={`${dashLen} ${circ - dashLen}`}
                                  strokeDashoffset={dashOff}
                                  transform={`rotate(-90 ${cx} ${cy})`}
                                />
                              );
                            })}
                          </svg>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                            {data.supply.breakdown.map((s, si) => (
                              <div key={s.source} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ width: 6, height: 6, borderRadius: 1, background: pieColors[si % pieColors.length], flexShrink: 0 }} />
                                <span style={{ fontSize: 11, color: "rgb(160, 152, 136)", flex: 1 }}>{s.source}</span>
                                <span style={{ fontSize: 11, color: "#ece8e1", fontFamily: "'Geist Mono', monospace" }}>{s.pct}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {divider}

                    {/* Demand */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                      <p style={sectionTitle}>Demand</p>
                      <p style={{ fontSize: 11, color: "#ece8e1", fontWeight: 600, margin: 0, fontFamily: "'Geist Mono', monospace" }}>{data.demand.total}</p>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <tbody>
                        {data.demand.breakdown.map(r => (
                          <tr key={r.segment}>
                            <td style={tblRow}>{r.segment}</td>
                            <td style={tblVal}>{r.share}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 }}>
                      <p style={{ fontSize: 12, color: accentForGap, margin: 0, fontWeight: 500 }}>Gap</p>
                      <p style={{ fontSize: 11, color: accentForGap, fontWeight: 600, margin: 0, fontFamily: "'Geist Mono', monospace" }}>{data.gap}</p>
                    </div>

                    {divider}

                    {/* Key Players */}
                    <p style={sectionTitle}>Key Players</p>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <tbody>
                        {data.keyPlayers.map(p => (
                          <tr key={p.name}>
                            <td style={{ padding: "3px 0", fontSize: 11 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <img src={`https://flagcdn.com/16x12/${p.flag}.png`} alt="" style={{ width: 12, height: 9, borderRadius: 1, opacity: 0.7, flexShrink: 0 }} />
                                <span style={{ color: "rgb(160, 152, 136)", fontWeight: 500 }}>{p.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: "3px 0", fontSize: 9, color: "rgb(160, 152, 136)", textAlign: "right", fontFamily: "'Geist Mono', monospace" }}>{p.share}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Navigate button */}
                    {data.navPath && (
                      <>
                        {divider}
                        <button
                          onClick={() => {
                            setPath(data.navPath!);
                            setAnimKey(k => k + 1);
                            setSelectedTreeNode(null);
                            setSelectedGroup(null);
                            setSelectedFeaturedChain(null);
                          }}
                          style={{
                            background: "rgb(36, 36, 36)", border: "none",
                            borderRadius: 4, padding: "8px 14px", cursor: "pointer",
                            fontSize: 10, color: "#fff", transition: "opacity 0.15s",
                            width: "100%",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
                          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                        >
                          View Opportunities &rarr;
                        </button>
                      </>
                    )}
                  </div>
                );
              };

              // ── PATH 0: Chain Opportunities mode — show summary based on filter ──
              if (showChainOpportunities && selectedFeaturedChain && isAITree) {
                const filterToNode: Record<string, string> = {
                  "Germanium Supplier": "Germanium",
                  "GeCl₄ Refiner": "Germanium Tetrachloride (GeCl4)",
                  "Fiber Preform / Cable": "Fiber Optic Cable",
                };
                const targetNode = opportunityLayerFilter ? filterToNode[opportunityLayerFilter] : null;
                if (targetNode) {
                  const chainPanel = renderChainStepPanel(targetNode);
                  if (chainPanel) return chainPanel;
                  return renderSubNodeSummary(targetNode, { chainMode: true, chainStatusColor: "#c87a4a" }) ?? null;
                }
                // No filter or "Other" — show key takeaways
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ background: "rgba(255, 255, 255, 0.02)", borderRadius: 6, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                      <p style={{ fontSize: 11, color: "rgb(219, 219, 218)", fontWeight: 500, margin: "0 0 4px 0" }}>Key Takeaways</p>
                      {CHAIN_TAKEAWAYS.map((t, i) => (
                        <div key={i} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 6 }} />
                          <p style={{ fontSize: 11, color: "rgb(160, 152, 136)", lineHeight: 1.5, margin: 0 }}>{t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // ── PATH 1: Featured chain mode ──
              // Chain selected — show key takeaways + key players, or sub-node summary
              if (selectedFeaturedChain && isAITree) {
                if (selectedTreeNode) {
                  const chainPanel = renderChainStepPanel(selectedTreeNode);
                  if (chainPanel) return chainPanel;
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {renderSubNodeSummary(selectedTreeNode, { chainMode: true, chainStatusColor: (STATUS_PILL[activeFeaturedChain?.status ?? "structural"] ?? STATUS_PILL.structural).color })}
                    </div>
                  );
                }
                // No node selected — show key takeaways + key players
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ background: "rgba(255, 255, 255, 0.02)", borderRadius: 6, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                      <p style={{ fontSize: 11, color: "rgb(219, 219, 218)", fontWeight: 500, margin: "0 0 4px 0" }}>Key Takeaways</p>
                      {CHAIN_TAKEAWAYS.map((t, i) => (
                        <div key={i} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 6 }} />
                          <p style={{ fontSize: 11, color: "rgb(160, 152, 136)", lineHeight: 1.5, margin: 0 }}>{t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // ── PATH 2: Default tree mode — show subsystem or arch piece detail ──
              if (!selectedGroup && !selectedTreeNode && isAITree) {
                if (!selectedSubsystem) return null;

                // Show architecture piece detail for Connectivity
                if (selectedSubsystem === "Connectivity" && selectedArchPiece) {
                  const ARCH_PIECE_DETAIL: Record<string, {
                    title: string; layer: string; desc: string;
                    deps: { name: string; role: string }[];
                    companies: { name: string; role: string; flag: string }[];
                  }> = {
                    "gpu-server": {
                      title: "GPU / Server", layer: "Data Source",
                      desc: "The origin point of all data in the connectivity chain. GPU accelerators and server boards generate and consume AI workload traffic at rates exceeding 400 Gbps per port.",
                      deps: [
                        { name: "GPU Accelerators", role: "Generate parallel compute traffic" },
                        { name: "HBM Memory", role: "Feed data to GPU at bandwidth" },
                        { name: "Server Boards", role: "Host and power accelerators" },
                      ],
                      companies: [
                        { name: "Nvidia", role: "GPU Accelerators", flag: "us" },
                        { name: "AMD", role: "GPU Accelerators", flag: "us" },
                        { name: "Super Micro", role: "Server Assembly", flag: "us" },
                      ],
                    },
                    "nic": {
                      title: "NIC / Interconnect Card", layer: "Server I/O",
                      desc: "The bridge between the server's internal bus and the external network. Network interface cards serialize GPU data into high-speed electrical signals for handoff to optics.",
                      deps: [
                        { name: "SerDes", role: "Serialize data for transmission" },
                        { name: "PHY Chips", role: "Handle signal integrity" },
                        { name: "PCB Components", role: "Route high-speed traces" },
                      ],
                      companies: [
                        { name: "Nvidia (Mellanox)", role: "InfiniBand NICs", flag: "us" },
                        { name: "Broadcom", role: "Ethernet NICs", flag: "us" },
                        { name: "Intel", role: "Server NICs", flag: "us" },
                      ],
                    },
                    "transceiver": {
                      title: "Optical Transceiver", layer: "Electro-Optical Conversion",
                      desc: "Converts electrical signals from the NIC into light pulses for fiber transmission. The 800G generation uses silicon photonics and faces persistent yield challenges.",
                      deps: [
                        { name: "Lasers (VCSELs/EELs)", role: "Emit modulated light" },
                        { name: "DSP Chips", role: "Process signal encoding" },
                        { name: "Silicon Photonics", role: "Integrate optics on chip" },
                      ],
                      companies: [
                        { name: "Coherent", role: "800G Transceivers", flag: "us" },
                        { name: "Lumentum", role: "Optical Components", flag: "us" },
                        { name: "Broadcom", role: "DSP / PHY", flag: "us" },
                        { name: "InnoLight", role: "800G Modules", flag: "cn" },
                      ],
                    },
                    "fiber": {
                      title: "Fiber Optic Cable", layer: "Physical Transport",
                      desc: "The physical medium carrying light between all connected points. Every AI cluster depends on fiber linking GPUs to switches to storage to other buildings. Germanium-doped glass core is the critical enabler.",
                      deps: [
                        { name: "GeCl₄", role: "Dope glass for light guidance" },
                        { name: "Fiber Preforms", role: "Template glass rods for drawing" },
                        { name: "Helium Draw Towers", role: "Cool fiber during production" },
                      ],
                      companies: [
                        { name: "Corning", role: "Fiber & Preform", flag: "us" },
                        { name: "Prysmian", role: "Fiber & Cable", flag: "it" },
                        { name: "YOFC", role: "Fiber & Cable", flag: "cn" },
                        { name: "Umicore", role: "GeCl₄ Refining", flag: "be" },
                      ],
                    },
                    "tor-switch": {
                      title: "Top-of-Rack Switch", layer: "Rack Aggregation",
                      desc: "Sits atop each server rack and aggregates traffic from all servers below it. Routes data upward to the spine layer. Capacity is gated by switch ASIC bandwidth and optical port count.",
                      deps: [
                        { name: "Switch ASICs", role: "Route packets at line rate" },
                        { name: "Optical Ports", role: "Connect to transceivers" },
                        { name: "Power & Cooling", role: "Sustain high throughput" },
                      ],
                      companies: [
                        { name: "Arista Networks", role: "ToR Switches", flag: "us" },
                        { name: "Cisco", role: "Network Switches", flag: "us" },
                        { name: "Broadcom", role: "Switch ASICs", flag: "us" },
                      ],
                    },
                    "spine-switch": {
                      title: "Spine / Fabric Switch", layer: "Cluster Fabric",
                      desc: "The backbone of the AI cluster network. Spine switches connect all ToR switches in a non-blocking fabric, enabling any-to-any GPU communication at full bandwidth.",
                      deps: [
                        { name: "High-Radix ASICs", role: "Handle 51.2T+ switching" },
                        { name: "Optics & Cables", role: "Dense optical interconnect" },
                        { name: "Network OS", role: "Manage fabric routing" },
                      ],
                      companies: [
                        { name: "Arista Networks", role: "Spine Switches", flag: "us" },
                        { name: "Cisco", role: "Fabric Switches", flag: "us" },
                        { name: "Broadcom", role: "Tomahawk ASICs", flag: "us" },
                      ],
                    },
                    "campus-link": {
                      title: "Campus / Region Link", layer: "Inter-Site Transport",
                      desc: "Long-haul and metro fiber connecting datacenter buildings, campuses, and regions. Permitting, conduit access, and installation labor are the binding constraints at this layer.",
                      deps: [
                        { name: "Long-Haul Fiber", role: "Span kilometers between sites" },
                        { name: "Conduit / Rights-of-Way", role: "Physical path for cables" },
                        { name: "Permitting Labor", role: "Regulatory and install crews" },
                      ],
                      companies: [
                        { name: "Corning", role: "Long-Haul Fiber", flag: "us" },
                        { name: "Prysmian", role: "Cable Systems", flag: "it" },
                        { name: "Lumen Technologies", role: "Fiber Networks", flag: "us" },
                      ],
                    },
                  };

                  const archDetail = ARCH_PIECE_DETAIL[selectedArchPiece];
                  if (archDetail) {
                    const cardBgPanel = "rgba(255, 255, 255, 0.02)";
                    const dividerPanel = <div style={{ height: 0.5, background: "rgba(255,255,255,0.06)", margin: "10px 0" }} />;
                    return (
                      <div style={{ background: cardBgPanel, borderRadius: 6, padding: "12px 12px" }}>
                        <p style={{ fontSize: 14, color: "#ece8e1", fontWeight: 500, margin: "0 0 0 0", fontFamily: "'EB Garamond', Georgia, serif" }}>{archDetail.title}</p>

                        {dividerPanel}

                        <p style={{ fontSize: 12, color: "rgb(160, 152, 136)", lineHeight: 1.6, margin: 0 }}>{archDetail.desc}</p>

                        {dividerPanel}

                        <p style={{ fontSize: 11, color: "rgb(219, 219, 218)", fontWeight: 500, margin: "0 0 6px 0" }}>Key Inputs</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {archDetail.deps.map(d => (
                            <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#c87a4a", flexShrink: 0 }} />
                              <span style={{ fontSize: 11, color: "rgb(158, 150, 136)" }}>{d.name}</span>
                            </div>
                          ))}
                        </div>

                        {dividerPanel}

                        <p style={{ fontSize: 11, color: "rgb(219, 219, 218)", fontWeight: 500, margin: "0 0 6px 0" }}>Key Players</p>
                        {archDetail.companies.map(c => (
                          <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
                            <img src={`https://flagcdn.com/16x12/${c.flag}.png`} alt="" style={{ width: 12, height: 9, borderRadius: 1, opacity: 0.7, flexShrink: 0 }} />
                            <span style={{ fontSize: 11, color: "rgb(160, 152, 136)" }}>{c.name}</span>
                            <span style={{ fontSize: 9, color: "#706a60" }}>— {c.role}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                }

                const SUBSYSTEM_DETAIL: Record<string, {
                  name: string;
                  whyItMatters: string;
                  pieces: { name: string; role: string }[];
                  companies: { name: string; piece: string; flag: string }[];
                }> = {
                  "Compute": {
                    name: "Compute",
                    whyItMatters: "Compute is the engine of AI infrastructure. Every AI model trains and runs on GPU accelerators assembled into dense server racks — the single highest-cost and most supply-constrained layer of the stack.",
                    pieces: [
                      { name: "GPU Accelerators", role: "Process parallel AI workloads" },
                      { name: "HBM Memory", role: "High-bandwidth on-chip memory" },
                      { name: "Server CPUs", role: "Orchestrate rack-level operations" },
                      { name: "Wafer Fabrication", role: "Manufacture advanced silicon dies" },
                      { name: "Custom ASICs", role: "Purpose-built inference chips" },
                      { name: "Server Assembly", role: "Integrate chips into rack units" },
                    ],
                    companies: [
                      { name: "Nvidia", piece: "GPU Accelerators", flag: "us" },
                      { name: "AMD", piece: "GPU Accelerators", flag: "us" },
                      { name: "TSMC", piece: "Wafer Fabrication", flag: "tw" },
                      { name: "Samsung", piece: "HBM Memory", flag: "kr" },
                      { name: "SK Hynix", piece: "HBM Memory", flag: "kr" },
                      { name: "Broadcom", piece: "Custom ASICs", flag: "us" },
                      { name: "Intel", piece: "Server CPUs", flag: "us" },
                      { name: "ASML", piece: "Lithography Equipment", flag: "nl" },
                      { name: "Super Micro", piece: "Server Assembly", flag: "us" },
                    ],
                  },
                  "Connectivity": {
                    name: "Connectivity",
                    whyItMatters: "Connectivity is the nervous system of AI infrastructure. Fiber optic cable, transceivers, and network switches move data between GPUs, racks, and buildings — any bottleneck here throttles the entire cluster.",
                    pieces: [
                      { name: "Fiber Optic Cable", role: "Carry light-encoded data" },
                      { name: "Optical Transceivers", role: "Convert electrical to optical signals" },
                      { name: "Network Switches", role: "Route traffic between nodes" },
                      { name: "Switch ASICs", role: "Silicon powering switch logic" },
                      { name: "GeCl₄ Refining", role: "Ultra-pure precursor for fiber" },
                    ],
                    companies: [
                      { name: "Corning", piece: "Fiber Optic Cable", flag: "us" },
                      { name: "Prysmian", piece: "Fiber Optic Cable", flag: "it" },
                      { name: "YOFC", piece: "Fiber Optic Cable", flag: "cn" },
                      { name: "Arista Networks", piece: "Network Switches", flag: "us" },
                      { name: "Broadcom", piece: "Switch ASICs", flag: "us" },
                      { name: "Coherent", piece: "Optical Transceivers", flag: "us" },
                      { name: "Lumentum", piece: "Optical Transceivers", flag: "us" },
                      { name: "Umicore", piece: "GeCl₄ Refining", flag: "be" },
                    ],
                  },
                  "Cooling": {
                    name: "Cooling",
                    whyItMatters: "Cooling removes the enormous heat generated by AI GPU racks. As chip power density rises past 1000W per accelerator, the industry is shifting from air to liquid cooling — and the supply chain isn't ready.",
                    pieces: [
                      { name: "Cold Plates", role: "Extract heat directly from chips" },
                      { name: "Coolant Distribution Units", role: "Circulate liquid to racks" },
                      { name: "Cooling Towers", role: "Reject heat to atmosphere" },
                      { name: "Immersion Tanks", role: "Submerge servers in coolant" },
                      { name: "Chillers", role: "Refrigerate cooling loops" },
                    ],
                    companies: [
                      { name: "Vertiv", piece: "Cooling Systems", flag: "us" },
                      { name: "CoolIT Systems", piece: "Liquid Cooling", flag: "ca" },
                      { name: "Boyd Corporation", piece: "Cold Plates", flag: "us" },
                      { name: "Asetek", piece: "Liquid Cooling", flag: "dk" },
                      { name: "Schneider Electric", piece: "Cooling Distribution", flag: "fr" },
                      { name: "ZutaCore", piece: "Immersion Cooling", flag: "il" },
                      { name: "Munters", piece: "Evaporative Cooling", flag: "se" },
                    ],
                  },
                  "Power": {
                    name: "Power",
                    whyItMatters: "Power delivers electricity from the grid to every rack in the datacenter. Transformers, switchgear, UPS systems, and backup generators form a chain with multi-year lead times at nearly every link.",
                    pieces: [
                      { name: "Transformers", role: "Step down grid voltage" },
                      { name: "Switchgear", role: "Distribute and protect circuits" },
                      { name: "UPS Systems", role: "Buffer against power loss" },
                      { name: "Backup Generators", role: "Emergency diesel/gas power" },
                      { name: "Busbars", role: "Conduct power within facility" },
                    ],
                    companies: [
                      { name: "Eaton", piece: "Power Distribution", flag: "us" },
                      { name: "Schneider Electric", piece: "UPS Systems", flag: "fr" },
                      { name: "ABB", piece: "Transformers", flag: "ch" },
                      { name: "Siemens Energy", piece: "Switchgear", flag: "de" },
                      { name: "Vertiv", piece: "UPS Systems", flag: "us" },
                      { name: "GE Vernova", piece: "Gas Turbines", flag: "us" },
                      { name: "Constellation Energy", piece: "Nuclear Power", flag: "us" },
                    ],
                  },
                  "Physical Structure": {
                    name: "Physical Structure",
                    whyItMatters: "Physical structure is the foundation — the shells, racks, concrete, and steel that house everything else. Construction timelines are compressing from 36 to 12 months, straining labor and materials.",
                    pieces: [
                      { name: "Datacenter Shells", role: "Climate-controlled buildings" },
                      { name: "Structural Steel", role: "Load-bearing framework" },
                      { name: "Rack Infrastructure", role: "Mount and organize servers" },
                      { name: "Modular Units", role: "Pre-fabricated deployable pods" },
                      { name: "Foundations", role: "Reinforced concrete base" },
                    ],
                    companies: [
                      { name: "Equinix", piece: "Datacenter Facilities", flag: "us" },
                      { name: "Digital Realty", piece: "Datacenter Facilities", flag: "us" },
                      { name: "Compass Datacenters", piece: "Modular Construction", flag: "us" },
                      { name: "Nucor", piece: "Structural Steel", flag: "us" },
                      { name: "Legrand", piece: "Rack Infrastructure", flag: "fr" },
                      { name: "Rittal", piece: "Server Cabinets", flag: "de" },
                    ],
                  },
                };

                const detail = SUBSYSTEM_DETAIL[selectedSubsystem];
                if (!detail) return null;

                const cardBgPanel = "rgba(255, 255, 255, 0.02)";
                const dividerPanel = <div style={{ height: 0.5, background: "rgba(255,255,255,0.06)", margin: "10px 0" }} />;

                return (
                  <div style={{ background: cardBgPanel, borderRadius: 6, padding: "12px 12px" }}>
                    {/* Header */}
                    <p style={{ fontSize: 14, color: "#ece8e1", fontWeight: 500, margin: 0, fontFamily: "'EB Garamond', Georgia, serif" }}>{detail.name}</p>

                    {dividerPanel}

                    {/* Why It Matters */}
                    <p style={{ fontSize: 11, color: "rgb(219, 219, 218)", fontWeight: 500, margin: "0 0 6px 0" }}>Why It Matters</p>
                    <p style={{ fontSize: 12, color: "rgb(160, 152, 136)", lineHeight: 1.6, margin: 0 }}>{detail.whyItMatters}</p>

                    {dividerPanel}

                    {/* Key Inputs */}
                    <p style={{ fontSize: 11, color: "rgb(219, 219, 218)", fontWeight: 500, margin: "0 0 6px 0" }}>Key Inputs</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {detail.pieces.map(p => (
                        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#c87a4a", flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: "rgb(158, 150, 136)" }}>{p.name}</span>
                        </div>
                      ))}
                    </div>

                    {dividerPanel}

                    {/* Key Companies */}
                    <p style={{ fontSize: 11, color: "rgb(219, 219, 218)", fontWeight: 500, margin: "0 0 6px 0" }}>Key Players</p>
                    {detail.companies.map(c => (
                      <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
                        <img src={`https://flagcdn.com/16x12/${c.flag}.png`} alt="" style={{ width: 12, height: 9, borderRadius: 1, opacity: 0.7, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: "rgb(160, 152, 136)" }}>{c.name}</span>
                        <span style={{ fontSize: 9, color: "#706a60" }}>— {c.piece}</span>
                      </div>
                    ))}
                  </div>
                );
              }

              // Show group description if a group is selected on AI tree (and no sub-node is selected)
              if (selectedGroup && !selectedTreeNode && currentVertical?.id === "ai" && currentLevel === "subsystems") {
                return (
                  <div style={{ background: "rgba(36, 32, 29, 0.28)", borderRadius: 6, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 12 }}>
                    <p style={{ fontSize: 14, color: warmWhite, fontWeight: 500, margin: 0, fontFamily: "'Instrument Serif', serif" }}>{selectedGroup.name}</p>
                    {selectedGroup.overview && (
                      <div>
                        <p style={{ fontSize: 10, color: templateAccent ?? "#706a60", margin: "0 0 6px 0", letterSpacing: "0.06em", textTransform: "uppercase" as const, fontFamily: "'Geist Mono', monospace" }}>Overview</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {selectedGroup.overview.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10).map((s, i) => (
                            <div key={i} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 6 }} />
                              <p style={{ fontSize: 12, color: "rgb(158, 156, 153)", lineHeight: 1.5, margin: 0 }}>{s.trim()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedGroup.activity && (
                      <div>
                        <p style={{ fontSize: 10, color: templateAccent ?? "#706a60", margin: "0 0 6px 0", letterSpacing: "0.06em", textTransform: "uppercase" as const, fontFamily: "'Geist Mono', monospace" }}>Where The Activity Is</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {selectedGroup.activity.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10).map((s, i) => (
                            <div key={i} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 6 }} />
                              <p style={{ fontSize: 12, color: "rgb(158, 156, 153)", lineHeight: 1.5, margin: 0 }}>{s.trim()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // Sub-node with ai_summary selected on AI tree
              if (selectedTreeNode && currentVertical?.id === "ai" && currentLevel === "subsystems") {
                const uNode = universalNodes[selectedTreeNode] as unknown as { ai_summary?: string[] | Record<string, string>; ai_key_players?: string[] } | undefined;
                if (uNode?.ai_summary) {
                  const allBullets = Array.isArray(uNode.ai_summary) ? uNode.ai_summary : null;
                  if (allBullets) {
                    // Use renderSubNodeSummary for consistency (removes last bullet, adds key players)
                    return renderSubNodeSummary(selectedTreeNode) ?? null;
                  }
                  // Fallback: old object format
                  const obj = uNode.ai_summary as Record<string, string>;
                  const sectionsRaw = [
                    ["What It Is", obj.what_it_is ?? ""],
                    ["Where It Comes From", obj.where_it_comes_from ?? ""],
                    ["What It's Used For", obj.what_its_used_for ?? ""],
                    ["Supply Situation", obj.supply_situation ?? ""],
                    ["Pricing & Scale", obj.pricing_scale ?? ""],
                    ["Why It Matters", obj.why_it_matters ?? ""],
                  ] as [string, string][];
                  const sections = sectionsRaw.filter(([, v]) => v.length > 0);
                  return (
                    <div style={{ background: "rgba(36, 32, 29, 0.28)", borderRadius: 6, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
                      <p style={{ fontSize: 14, color: warmWhite, fontWeight: 500, margin: 0, fontFamily: "'Instrument Serif', serif" }}>{selectedTreeNode}</p>
                      {sections.map(([label, text]) => (
                        <div key={label}>
                          <p style={{ fontSize: 10, color: templateAccent ?? "#706a60", margin: "0 0 4px 0", letterSpacing: "0.06em", textTransform: "uppercase" as const, fontFamily: "'Geist Mono', monospace" }}>{label}</p>
                          <p style={{ fontSize: 12, color: "rgb(158, 156, 153)", lineHeight: 1.6, margin: 0 }}>{text}</p>
                        </div>
                      ))}
                    </div>
                  );
                }
              }

              // Input node selected on AI tree — show exec summary + navigate button
              if (selectedTreeNode && currentVertical?.id === "ai" && currentLevel === "subsystems") {
                const inputIds: Record<string, { id: string; label: string }> = {
                  "Germanium": { id: "germanium", label: "Germanium" },
                  "Gallium": { id: "gallium", label: "Gallium" },
                  "Fiber Optic Cable": { id: "fiber", label: "Fiber Optic Cable" },
                };
                const input = inputIds[selectedTreeNode];
                if (input) {
                  const inputBullets: Record<string, string[]> = {
                    germanium: [
                      "Trace element recovered as a byproduct of zinc smelting and coal combustion. Cannot be mined directly.",
                      "Doped into glass to create the refractive index that allows fiber optic cable to carry light. Also used in IR defense optics, satellite solar cells, and SiGe semiconductors.",
                      "Global supply fixed at ~230t/yr. 83% Chinese under export licensing. One western refiner — Umicore, Belgium.",
                      "Price has risen from $1,500/kg to over $8,500/kg in two years. 3.5x premium between western and Chinese markets.",
                    ],
                    gallium: [
                      "Trace element recovered as a byproduct of alumina refining from bauxite. Cannot be mined directly.",
                      "Forms compound semiconductors (GaAs and GaN) for AI datacenter power, 5G amplifiers, LEDs, EV chargers, and defense radar.",
                      "Global refined production is ~320 t/yr. ~290 t Chinese; ~15-30 t non-Chinese, almost entirely Japan via Dowa.",
                      "Price has risen from $298/kg to $2,269/kg since 2020. 9x spread between Chinese domestic and western markets.",
                    ],
                    fiber: [
                      "Glass strands that transmit data as pulses of light. Physical layer connecting AI datacenters, telecom, and subsea systems.",
                      "Core inputs: high-purity silica, germanium, and helium. All three are constrained simultaneously.",
                      "Global production at ~720M fiber strand-km/yr. Preform lines at full utilization. One equipment supplier with 18-24 month backlogs.",
                      "Fiber prices at 7-year highs. G.652D up 150%, G.657A up over 210%.",
                    ],
                  };
                  const bullets = inputBullets[input.id] ?? [];
                  const navMap: Record<string, PathEntry[]> = {
                    germanium: [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "raw-material", id: "germanium", name: "Germanium" }],
                    gallium: [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "raw-material", id: "gallium", name: "Gallium" }],
                    fiber: [{ type: "vertical", id: "ai", name: "AI Infrastructure" }, { type: "subsystem", id: "connectivity", name: "Connectivity" }, { type: "component", id: "fiber", name: "Fiber optic cable" }],
                  };
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ background: "rgba(36, 32, 29, 0.28)", borderRadius: 6, padding: "10px 12px" }}>
                        <p style={{ fontSize: 12, letterSpacing: "0.1em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: "0 0 10px 0", fontFamily: "'Geist Mono', monospace" }}>{input.label}</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {bullets.map((b, i) => (
                            <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 5 }} />
                              <p style={{ fontSize: 12, color: "#807870", lineHeight: 1.5, margin: 0 }}>{b}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }
              }

              // Try chain step panel design for input pages
              const summaryId = lastEntry?.id;
              const chainPanelMap: Record<string, string> = { germanium: "Germanium", gallium: "Gallium", fiber: "Fiber Optic Cable" };
              const chainPanelKey = summaryId ? chainPanelMap[summaryId] : null;
              if (chainPanelKey) {
                const panel = renderChainStepPanel(chainPanelKey);
                if (panel) return panel;
              }

              let bullets: string[] = [];
              if (summaryId === "germanium") {
                bullets = [
                  "Trace element recovered as a byproduct of zinc smelting and coal combustion. Cannot be mined directly.",
                  "Doped into glass to create the refractive index that allows fiber optic cable to carry light.",
                  "Global supply fixed at ~230t/yr. 83% Chinese under export licensing. One western refiner \u2014 Umicore.",
                  "Price has risen from $1,500/kg to over $8,500/kg in two years.",
                ];
              } else if (summaryId === "gallium") {
                bullets = [
                  "Trace element recovered as a byproduct of alumina refining from bauxite. Cannot be mined directly.",
                  "Forms compound semiconductors (GaAs and GaN) for AI datacenter power, 5G, LEDs, and defense radar.",
                  "Global refined production is ~320 t/yr. ~290 t Chinese.",
                  "Price has risen from $298/kg to $2,269/kg since 2020.",
                ];
              } else if (summaryId === "fiber") {
                bullets = [
                  "Glass strands that transmit data as pulses of light. Physical layer connecting AI datacenters, telecom, and subsea systems.",
                  "Core inputs: high-purity silica, germanium, and helium. All three are constrained simultaneously.",
                  "Global production at ~720M fiber strand-km/yr. Preform lines at full utilization. One equipment supplier with 18-24 month backlogs.",
                  "Fiber prices at 7-year highs. G.652D up 150%, G.657A up over 210%.",
                  "AI datacenter buildout is the dominant growth vector. ~20 GW entering construction annually.",
                  "Supply response is 2027-2028 at earliest. New preform capacity, DRC germanium ramp, hollow-core fiber all target same window.",
                ];
              }

              if (bullets.length === 0) return <p style={{ fontSize: 10, color: "#555", padding: "20px 0" }}>Select an input to view its executive summary.</p>;

              return (
                <div style={{ background: "rgba(36, 32, 29, 0.28)", borderRadius: 6, padding: "10px 12px" }}>
                  <p style={{ fontSize: 12, letterSpacing: "0.1em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: "0 0 10px 0", fontFamily: "'Geist Mono', monospace" }}>EXECUTIVE SUMMARY</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {bullets.map((bullet, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                        <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 5 }} />
                        <p style={{ fontSize: 12, color: "#807870", lineHeight: 1.5, margin: 0 }}>{bullet}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {rightTab === "nodes" && (() => {
              if (!selectedTreeNode) {
                return <p style={{ fontSize: 10, color: "#555", padding: "20px 0" }}>Click a node to view context</p>;
              }

              const uNode = getUniversalNode(selectedTreeNode);
              if (!uNode) {
                return (
                  <div style={{ background: "rgba(36, 32, 29, 0.28)", borderRadius: 6, padding: "10px 12px" }}>
                    <p style={{ fontSize: 12, color: warmWhite, fontWeight: 500, margin: "0 0 6px 0" }}>{selectedTreeNode}</p>
                    <p style={{ fontSize: 10, color: "#555" }}>No additional data available for this node.</p>
                  </div>
                );
              }

              const currentChainId = lastEntry?.id === "fiber" ? "fiber" : lastEntry?.id;
              const chainDef = currentChainId ? chainDefs[currentChainId] : null;
              const nodeCtx = chainDef?.nodeContext?.[selectedTreeNode] as { relevance?: string; chain_specific_risk?: string } | undefined;

              const nodeCountryCode = uNode.country ? ({"China":"cn","USA":"us","Belgium":"be","Canada":"ca","Russia":"ru","DRC":"cd","Japan":"jp","Germany":"de","France":"fr","Italy":"it","Australia":"au","Brazil":"br","Indonesia":"id","India":"in","Guinea":"gn","South Korea":"kr","Austria":"at","Netherlands":"nl","UAE":"ae","Saudi Arabia":"sa","Greece":"gr","Global":"un","Multiple":"un"} as Record<string,string>)[uNode.country] : null;

              return (
                <div style={{ background: "rgba(36, 32, 29, 0.28)", borderRadius: 6, padding: "10px 12px" }}>
                  {/* Name + ticker */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
                    <p style={{ fontSize: 14, color: warmWhite, fontWeight: 500, margin: "0 0 2px 0", fontFamily: "'Instrument Serif', serif" }}>{uNode.name}</p>
                    <span style={{ fontSize: 9, color: "#555", fontFamily: "'Geist Mono', monospace" }}>{uNode.ticker ?? "Private"}</span>
                  </div>

                  {/* Location with flag */}
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                    {nodeCountryCode && (
                      <img src={`https://flagcdn.com/16x12/${nodeCountryCode}.png`} alt={uNode.country ?? ""} style={{ width: 12, height: 9, borderRadius: 1, opacity: 0.7 }} />
                    )}
                    <p style={{ fontSize: 11, color: "#706a60", margin: 0 }}>{uNode.location_detail}</p>
                  </div>

                  {/* Type / descriptor — uppercase */}
                  <p style={{ fontSize: 10, color: templateAccent ?? "#706a60", margin: "0 0 10px 0", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>{uNode.descriptor_pill || uNode.layer}</p>

                  {/* Description as bullets (no label) */}
                  {uNode.about && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
                      {uNode.about.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10).map((sentence, i) => (
                        <div key={i} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 6 }} />
                          <p style={{ fontSize: 11, color: "rgb(158, 156, 153)", margin: 0, lineHeight: 1.5 }}>{sentence.trim()}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Key metrics — stacked vertically */}
                  {uNode.stats && uNode.stats.length > 0 && (
                    <div style={{ paddingTop: 8, borderTop: "1px solid rgb(45, 41, 39)" }}>
                      <p style={{ fontSize: 10, color: templateAccent ?? "#706a60", margin: "0 0 6px 0", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>KEY METRICS</p>
                      {uNode.stats.map(([label, value]) => (
                        <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: "#555", fontFamily: "'Geist Mono', monospace" }}>{label}</span>
                          <span style={{ fontSize: 11, color: warmWhite, fontWeight: 300, textAlign: "right" as const }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Investment brief link */}
                  {(() => {
                    const inputId = lastEntry?.id === "fiber" ? "fiber" : lastEntry?.id;
                    const wtmi = inputId ? INPUT_WTMI[inputId] : null;
                    if (!wtmi) return null;
                    const ideaMatch = wtmi.layers.flatMap(l => l.ideas).find(idea => idea.name === selectedTreeNode);
                    if (!ideaMatch || !wtmi.briefs[ideaMatch.id]) return null;
                    return (
                      <div style={{ paddingTop: 8, borderTop: "1px solid rgb(45, 41, 39)" }}>
                        <button
                          onClick={() => { setActiveTab("investment-ideas"); setSelectedBriefId(ideaMatch.id); }}
                          style={{
                            background: "transparent", border: `1px solid ${templateAccent ?? "#706a60"}`,
                            borderRadius: 4, padding: "5px 10px", cursor: "pointer",
                            fontSize: 9, color: templateAccent ?? "#706a60",
                            fontFamily: "'Geist Mono', monospace", transition: "background 0.15s",
                            width: "100%",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                        >
                          View investment brief &rarr;
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            })()}
          </div>
        </div>

      </div>

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
        @keyframes containerOpen {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
