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

// Clickable layer-tier header separator
function LayerHeader({
  tier, name, layerIdx,
  hovered, onHover, onLeave,
}: {
  tier: string; name: string; layerIdx: number;
  hovered: boolean; onHover: () => void; onLeave: () => void;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "18px 0 12px",
      borderTop: "0.5px solid rgba(255,255,255,0.07)",
    }}>
      <div style={{
        ...MONO, fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase" as const,
        color: "rgba(255,255,255,0.22)", whiteSpace: "nowrap" as const,
      }}>
        {tier}
      </div>
      <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.05)" }} />
      <span style={{
        ...MONO, fontSize: 8, color: "rgba(255,255,255,0.28)",
        letterSpacing: "0.04em",
      }}>
        {name}
      </span>
      <div
        onClick={() => navigateTo(layerIdx)}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
      >
        <span style={{
          ...MONO, fontSize: 7, letterSpacing: "0.04em",
          color: hovered ? `${GOLD}0.7)` : "rgba(255,255,255,0.18)",
          transition: "color 0.15s",
        }}>
          Explore layer
        </span>
        <span style={{
          ...MONO, fontSize: 10,
          color: hovered ? `${GOLD}0.5)` : "rgba(255,255,255,0.10)",
          transition: "color 0.15s",
        }}>
          →
        </span>
      </div>
    </div>
  );
}

export default function FullChainMap() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredHeader, setHoveredHeader] = useState<number | null>(null);

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
      }}>
        <span style={{
          ...MONO, fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase" as const,
          color: "rgba(255,255,255,0.16)",
        }}>
          Full Value Chain · Germanium → Fiber · 4 Layers · 32 Nodes
        </span>
      </div>

      {/* ── RAW MATERIAL ───────────────────────────────────────────── */}
      <div id="chain-raw" style={{ padding: "0 24px" }}>
        <LayerHeader
          tier="Raw Material" name="Germanium" layerIdx={0}
          hovered={hoveredHeader === 0}
          onHover={() => setHoveredHeader(0)}
          onLeave={() => setHoveredHeader(null)}
        />
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
      </div>

      {/* Bridge Raw → Comp */}
      <div style={{ padding: "0 24px" }}>
        <BridgeConnector width={compW} fromX={compW / 2} toXs={compFirstXs} />
      </div>

      {/* ── COMPONENT ──────────────────────────────────────────────── */}
      <div id="chain-comp" style={{ padding: "0 24px" }}>
        <LayerHeader
          tier="Component" name="GeO₂ / GeCl₄" layerIdx={1}
          hovered={hoveredHeader === 1}
          onHover={() => setHoveredHeader(1)}
          onLeave={() => setHoveredHeader(null)}
        />
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
      </div>

      {/* Bridge Comp → Sub */}
      <div style={{ padding: "0 24px" }}>
        <BridgeConnector width={subW} fromX={subW / 2} toXs={subFirstXs} />
      </div>

      {/* ── SUBSYSTEM ──────────────────────────────────────────────── */}
      <div id="chain-sub" style={{ padding: "0 24px" }}>
        <LayerHeader
          tier="Subsystem" name="Fiber Optics" layerIdx={2}
          hovered={hoveredHeader === 2}
          onHover={() => setHoveredHeader(2)}
          onLeave={() => setHoveredHeader(null)}
        />
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
      </div>

      {/* Bridge Sub → EU */}
      <div style={{ padding: "0 24px" }}>
        <BridgeConnector width={euW} fromX={euW / 2} toXs={euFirstXs} />
      </div>

      {/* ── END USE ────────────────────────────────────────────────── */}
      <div id="chain-eu" style={{ padding: "0 24px 80px" }}>
        <LayerHeader
          tier="End Use" name="AI Datacenter" layerIdx={3}
          hovered={hoveredHeader === 3}
          onHover={() => setHoveredHeader(3)}
          onLeave={() => setHoveredHeader(null)}
        />
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
