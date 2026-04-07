"use client";
import React, { useMemo, useState } from "react";
import TreeMap from "@/components/TreeMap";
import NodeModal from "@/components/NodeModal";
import {
  buildRawGeometry,
  buildCompGeometry,
  buildSubGeometry,
  buildEUGeometry,
  computeRawSvgWidth,
  computeCompSvgWidth,
  computeSubSvgWidth,
  computeEUSvgWidth,
} from "@/lib/treeGeometry";
import chainsJson from "@/data/chains.json";
import nodesJson from "@/data/nodes.json";
import type { RawChain, CompChain, SubChain, EUChain, NodeData } from "@/types";

const chainsData = chainsJson as unknown as {
  layerConfig: Record<string, { label?: string; displayFields: { key: string; label: string }[] }>;
  RAW_DATA: Record<string, RawChain>;
  COMP_DATA: Record<string, CompChain>;
  SUB_DATA: Record<string, SubChain>;
  EU_DATA: Record<string, EUChain>;
};

const allNodes = nodesJson as unknown as Record<string, NodeData>;
const layerConfig = chainsData.layerConfig;

const MONO: React.CSSProperties = { fontFamily: "'Geist Mono', 'Courier New', monospace" };
const GOLD = "rgba(196,164,108,";

const TOP_Y = 80;

function navigateTo(layerIdx: number) {
  const maps = [
    { raw: "Germanium",  comp: null,           sub: null,          eu: null            },
    { raw: "Germanium",  comp: "GeO₂ / GeCl₄", sub: null,          eu: null            },
    { raw: "Germanium",  comp: "GeO₂ / GeCl₄", sub: "Fiber Optics", eu: null           },
    { raw: "Germanium",  comp: "GeO₂ / GeCl₄", sub: "Fiber Optics", eu: "AI Datacenter"},
  ];
  sessionStorage.setItem("globeSelection", JSON.stringify(maps[layerIdx]));
  window.location.href = "/germanium";
}

// Fan-out connector between the output node of one tree (centered) and the
// first-layer nodes of the next tree.
function BridgeConnector({ width, fromX, toXs }: { width: number; fromX: number; toXs: number[] }) {
  const H = 80;
  return (
    <svg
      viewBox={`0 0 ${width} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      {toXs.map((tx, i) => {
        const mid = H * 0.5;
        const d = `M ${fromX},0 C ${fromX},${mid} ${tx},${mid} ${tx},${H}`;
        return (
          <path
            key={i} d={d} fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.8"
            strokeDasharray="4,3"
          />
        );
      })}
    </svg>
  );
}

// Recycling loop overlay for the comp (GeCl₄) tree section.
// Draws gold dashed arcs from each western fiber manufacturer back up to Umicore.
function RecyclingOverlay({
  svgW, svgH, geCl4Xs, fiberXs, geCl4CY, fiberCY,
}: {
  svgW: number; svgH: number;
  geCl4Xs: number[]; fiberXs: number[];
  geCl4CY: number; fiberCY: number;
}) {
  const umicoreX = geCl4Xs[0]; // index 0 = Umicore GeCl4
  const westernFiberXs = fiberXs.slice(0, 5); // skip YOFC (index 5 = Chinese)
  const labelY = (geCl4CY + fiberCY) / 2;
  const labelX = umicoreX - 300;

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
      }}
    >
      {westernFiberXs.map((fx, i) => {
        const pullX = umicoreX - 230 - i * 16;
        const d = `M ${fx},${fiberCY - 6} C ${pullX},${fiberCY - 6} ${pullX},${geCl4CY + 6} ${umicoreX},${geCl4CY + 6}`;
        return (
          <path
            key={i} d={d} fill="none"
            stroke={`${GOLD}0.18)`}
            strokeWidth="0.7"
            strokeDasharray="3,5"
          />
        );
      })}
      <text
        x={labelX} y={labelY}
        fontFamily="'Geist Mono', monospace"
        fontSize={8}
        fill={`${GOLD}0.28)`}
        textAnchor="middle"
        letterSpacing="0.08em"
        transform={`rotate(-90, ${labelX}, ${labelY})`}
      >
        WASTE RECYCLED
      </text>
    </svg>
  );
}

// Layer-specific color pairs: [tierColor (bright), nameColor (darker)]
const LAYER_COLORS: [string, string][] = [
  ["#c8a85a", "#8a6828"],   // Raw  — warm gold / dark gold
  ["#4d9ab8", "#2a6a88"],   // Comp — teal / deep teal
  ["#8a7aaa", "#4e3a6e"],   // Sub  — bright purple / deep purple
  ["#c8a85a", "#8a6828"],   // EU   — amber / dark amber
];

// Layer header: tier (left) · name (center) · explore button (right)
function LayerHeader({ tier, name, layerIdx }: { tier: string; name: string; layerIdx: number }) {
  const [hovered, setHovered] = useState(false);
  const [tierColor, nameColor] = LAYER_COLORS[layerIdx];
  return (
    <div style={{
      display: "flex", alignItems: "center",
      padding: "18px 0 12px",
      borderTop: "0.5px solid rgba(255,255,255,0.07)",
    }}>
      {/* Left: tier label */}
      <div style={{ flex: 1 }}>
        <div style={{
          ...MONO, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" as const,
          color: tierColor, whiteSpace: "nowrap" as const,
        }}>
          {tier}
        </div>
      </div>

      {/* Center: subtitle name */}
      <div style={{ flex: 1, textAlign: "center" as const }}>
        <span style={{ ...MONO, fontSize: 12, color: nameColor, letterSpacing: "0.04em" }}>
          {name}
        </span>
      </div>

      {/* Right: explore button */}
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => navigateTo(layerIdx)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            ...MONO, fontSize: 9, letterSpacing: "0.05em",
            cursor: "pointer",
            padding: "6px 14px",
            border: `0.5px solid ${hovered ? tierColor : "rgba(255,255,255,0.1)"}`,
            borderRadius: 6,
            background: hovered ? `${tierColor}18` : "rgba(255,255,255,0.03)",
            color: hovered ? tierColor : "rgba(255,255,255,0.35)",
            transition: "color 0.15s, border-color 0.15s, background 0.15s",
          }}
        >
          Explore layer →
        </button>
      </div>
    </div>
  );
}

// Context panel data
interface CtxSection { label: string; text: string }
interface CtxPanel { title: string; accent: string; sections: CtxSection[] }

const CTX_PANELS: Record<string, CtxPanel> = {
  raw: {
    title: "GERMANIUM · RAW MATERIAL",
    accent: "#c9a84c",
    sections: [
      { label: "DEPOSITS", text: "8 deposits globally. 5 in China. Germanium is a trace element in zinc ore and coal ash — recovered as a byproduct, never mined directly." },
      { label: "MINERS", text: "7 miners. Output tied to zinc and coal cycles — germanium supply can\u2019t scale independently." },
      { label: "REFINERS & RECYCLERS", text: "7 refiners produce zone-refined metal, GeO\u2082 powder, and intermediates. China controls ~83% of refined output." },
    ],
  },
  comp: {
    title: "GeO\u2082 / GeCl\u2084 · COMPONENT",
    accent: "#6a9ab8",
    sections: [
      { label: "GeCl\u2084 SUPPLIERS", text: "4 suppliers convert germanium powder into GeCl\u2084 — a volatile liquid chemical that can be vaporized and deposited into glass. Without it, light won\u2019t pass through fiber. Only one western source: Umicore." },
      { label: "FIBER MANUFACTURERS", text: "6 manufacturers produce preforms — thick glass rods with a GeCl\u2084-doped core. A single 1m preform is drawn into ~200km of fiber strand. Corning alone accounts for ~40% of global output." },
    ],
  },
  sub: {
    title: "FIBER OPTICS · SUBSYSTEM",
    accent: "#9b6fbd",
    sections: [
      { label: "ASSEMBLY", text: "8 cable assemblers bundle fiber strands into sheathed cables. Some vertically integrated from preform to cable. Subsea and long-haul require specialized armoring and amplifier integration that only a few can do." },
      { label: "CABLE TYPE", text: "Three categories — datacenter (short, high-density, up to 6,912 fibers per cable), terrestrial long-haul (hundreds of km per route), and subsea (thousands of km, 8\u201324 fiber pairs). Each has different germanium loading per km." },
    ],
  },
};

function LayerContextPanel({ panelKey }: { panelKey: string }) {
  const p = CTX_PANELS[panelKey];
  if (!p) return null;
  return (
    <div style={{
      position: "absolute", bottom: 6, right: 20,
      width: 300, background: "#1a1816",
      border: "1px solid #252220", borderRadius: 10,
      padding: "16px 20px", zIndex: 5,
    }}>
      <div style={{
        ...MONO, fontSize: 9, fontWeight: 500, letterSpacing: "0.1em",
        color: p.accent, marginBottom: 12,
      }}>
        {p.title}
      </div>
      {p.sections.map((s, i) => (
        <React.Fragment key={s.label}>
          {i > 0 && <div style={{ height: 1, background: "#222018", margin: "10px 0" }} />}
          <div style={{ ...MONO, fontSize: 9, letterSpacing: "0.08em", color: "#5a5550", marginBottom: 5 }}>
            {s.label}
          </div>
          <div style={{
            fontFamily: "Inter, -apple-system, system-ui, sans-serif",
            fontSize: 11, color: "#908880", lineHeight: 1.55,
          }}>
            {s.text}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function FullChainMap() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const rawChain  = chainsData.RAW_DATA["Germanium"];
  const compChain = chainsData.COMP_DATA["GeO₂ / GeCl₄"];
  const subChain  = chainsData.SUB_DATA["Fiber Optics"];
  const euChain   = chainsData.EU_DATA["AI Datacenter"];

  const rawW  = useMemo(() => computeRawSvgWidth(rawChain),   []);
  const compW = useMemo(() => computeCompSvgWidth(compChain), []);
  const subW  = useMemo(() => computeSubSvgWidth(subChain),   []);
  const euW   = useMemo(() => computeEUSvgWidth(euChain),     []);

  const rawGeo  = useMemo(() => buildRawGeometry(rawChain,   rawW  / 2, TOP_Y), []);
  const compGeo = useMemo(() => buildCompGeometry(compChain, compW / 2, TOP_Y), []);
  const subGeo  = useMemo(() => buildSubGeometry(subChain,   subW  / 2, TOP_Y), []);
  const euGeo   = useMemo(() => buildEUGeometry(euChain,     euW   / 2, TOP_Y), []);

  const rawH  = rawGeo.outputNode.cy  + 120;
  const compH = compGeo.outputNode.cy + 120;
  const subH  = subGeo.outputNode.cy  + 120;
  const euH   = euGeo.outputNode.cy   + 120;

  // Bridge target positions: first layer of next tree
  const compFirstXs = compGeo.layers[0].nodes.map(n => n.cx);
  const subFirstXs  = subGeo.layers[0].nodes.map(n => n.cx);
  const euFirstXs   = euGeo.layers[0].nodes.map(n => n.cx);

  // Recycling overlay positions for comp tree
  const geCl4Xs = compGeo.layers[0].nodes.map(n => n.cx);
  const fiberXs = compGeo.layers[1].nodes.map(n => n.cx);
  const geCl4CY = compGeo.layers[0].cy;
  const fiberCY = compGeo.layers[1].cy;

  const lc = layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;

  return (
    <div style={{ background: "#0A0A09" }}>

      {/* ── SECTION HEADER ──────────────────────────────────────────── */}
      <div style={{
        padding: "28px 24px 0",
        borderTop: "0.5px solid rgba(255,255,255,0.06)",
        textAlign: "center",
      }}>
        <span style={{
          ...MONO, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" as const,
          color: "rgba(255,255,255,0.16)", paddingBottom: 20, display: "inline-block",
        }}>
          Full Value Chain · Germanium → Fiber · 4 Layers · 32 Nodes
        </span>
      </div>

      {/* ── RAW MATERIAL ───────────────────────────────────────────── */}
      <div id="chain-raw" style={{ padding: "0 24px", position: "relative", paddingBottom: 10 }}>
        <LayerHeader tier="Raw Material" name="Germanium" layerIdx={0} />
        <TreeMap
          geometry={rawGeo}
          nodes={allNodes}
          layerConfig={lc}
          svgWidth={rawW}
          svgHeight={rawH}
          onNodeClick={setSelectedNode}
          onLayerClick={() => {}}
          layerPanels={{}}
        />
        <LayerContextPanel panelKey="raw" />
      </div>

      {/* Bridge Raw → Comp */}
      <div style={{ padding: "0 24px" }}>
        <BridgeConnector width={compW} fromX={compW / 2} toXs={compFirstXs} />
      </div>

      {/* ── COMPONENT ──────────────────────────────────────────────── */}
      <div id="chain-comp" style={{ padding: "0 24px", position: "relative", paddingBottom: 10 }}>
        <LayerHeader tier="Component" name="GeO₂ / GeCl₄" layerIdx={1} />
        <div style={{ position: "relative" }}>
          <TreeMap
            geometry={compGeo}
            nodes={allNodes}
            layerConfig={lc}
            svgWidth={compW}
            svgHeight={compH}
            onNodeClick={setSelectedNode}
            onLayerClick={() => {}}
            layerPanels={{}}
          />
          <RecyclingOverlay
            svgW={compW} svgH={compH}
            geCl4Xs={geCl4Xs} fiberXs={fiberXs}
            geCl4CY={geCl4CY} fiberCY={fiberCY}
          />
        </div>
        <LayerContextPanel panelKey="comp" />
      </div>

      {/* Bridge Comp → Sub */}
      <div style={{ padding: "0 24px" }}>
        <BridgeConnector width={subW} fromX={subW / 2} toXs={subFirstXs} />
      </div>

      {/* ── SUBSYSTEM ──────────────────────────────────────────────── */}
      <div id="chain-sub" style={{ padding: "0 24px", position: "relative", paddingBottom: 10 }}>
        <LayerHeader tier="Subsystem" name="Fiber Optics" layerIdx={2} />
        <TreeMap
          geometry={subGeo}
          nodes={allNodes}
          layerConfig={lc}
          svgWidth={subW}
          svgHeight={subH}
          onNodeClick={setSelectedNode}
          onLayerClick={() => {}}
          layerPanels={{}}
        />
        <LayerContextPanel panelKey="sub" />
      </div>

      {/* Bridge Sub → EU */}
      <div style={{ padding: "0 24px" }}>
        <BridgeConnector width={euW} fromX={euW / 2} toXs={euFirstXs} />
      </div>

      {/* ── END USE ────────────────────────────────────────────────── */}
      <div id="chain-eu" style={{ padding: "0 24px 80px" }}>
        <LayerHeader tier="End Use" name="AI Datacenter" layerIdx={3} />
        <TreeMap
          geometry={euGeo}
          nodes={allNodes}
          layerConfig={lc}
          svgWidth={euW}
          svgHeight={euH}
          onNodeClick={setSelectedNode}
          onLayerClick={() => {}}
          layerPanels={{}}
        />
      </div>

      {/* Node modal */}
      <NodeModal
        nodeKey={selectedNode}
        allNodes={allNodes}
        layers={[]}
        chainLabel="Germanium → Fiber Chain"
        onClose={() => setSelectedNode(null)}
        onNavigate={() => {}}
      />
    </div>
  );
}
