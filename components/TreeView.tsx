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
const cardBg = "#1a1816";
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
  status: string;
  components: ComponentDef[];
}
interface ComponentDef {
  id: string;
  name: string;
  status: string;
  detail: string;
  hasTree: boolean;
}

/* ── vertical data (explore-page style) ── */
interface VerticalDef {
  id: string;
  name: string;
  description: string;
  live: boolean;
}

const VERTICALS_DATA: VerticalDef[] = [
  {
    id: "ai",
    name: "AI Infrastructure",
    description: "The complete supply chain map for AI \u2014 from the minerals in the ground to the datacenters they power.",
    live: true,
  },
  {
    id: "energy",
    name: "Energy Transition",
    description: "Batteries, solar, wind, grid, and hydrogen \u2014 the materials and manufacturing bottlenecks shaping the pace of decarbonization.",
    live: false,
  },
  {
    id: "uavs",
    name: "UAVs",
    description: "Sensors, propulsion, communications, and autonomy \u2014 the supply chains behind commercial and defense drone systems.",
    live: false,
  },
  {
    id: "robotics",
    name: "Robotics",
    description: "Motors, sensors, compute, and structure \u2014 every physical input that determines who can build robots at scale.",
    live: false,
  },
  {
    id: "space",
    name: "Space",
    description: "Launch vehicles, satellites, and ground systems \u2014 from carbon fiber to cryogenics to the optics that connect constellations.",
    live: false,
  },
];

/* ── static data ── */
const AI_SUBSYSTEMS: Subsystem[] = [
  {
    id: "connectivity", name: "Connectivity", status: "Constrained", components: [
      { id: "fiber", name: "Fiber optic cable", status: "Constrained", detail: "Glass strands carrying light signals. Physical backbone of datacenter connectivity.", hasTree: true },
      { id: "transceivers", name: "Optical transceivers", status: "Constrained", detail: "Convert electrical signals to light. Every fiber connection needs one on each end.", hasTree: false },
      { id: "switches", name: "Network switches", status: "Available", detail: "Route data between servers and racks at terabit scale.", hasTree: false },
    ],
  },
  {
    id: "compute", name: "Compute", status: "Constrained", components: [
      { id: "gpu", name: "GPUs", status: "Constrained", detail: "Parallel processors that train and run AI models.", hasTree: false },
      { id: "hbm", name: "HBM memory", status: "Constrained", detail: "High-bandwidth memory stacked on GPU packages.", hasTree: false },
      { id: "servers", name: "Server boards", status: "Tightening", detail: "PCBs connecting GPU, memory, networking, and power.", hasTree: false },
    ],
  },
  {
    id: "power", name: "Power", status: "Constrained", components: [
      { id: "transformers", name: "Power transformers", status: "Constrained", detail: "Convert grid voltage to datacenter-usable power.", hasTree: false },
    ],
  },
  { id: "cooling", name: "Cooling", status: "Tightening", components: [] },
];

const STATUS_COLORS: Record<string, string> = {
  Constrained: "#a05a4a",
  Tightening: "#9a8540",
  Available: "#4a8a55",
  Oversupplied: "#5a7a8a",
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
function TreeHeader({ title, href, description }: { title: string; href: string; description: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, color: "#ece8e1", margin: 0 }}>
          {title}
        </h2>
        <a href={href} style={{
          fontSize: 11, color: "#706a60", padding: "7px 16px",
          border: "1px solid #252220", borderRadius: 6, textDecoration: "none",
          transition: "border-color 0.15s, color 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#ece8e1"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#252220"; e.currentTarget.style.color = "#706a60"; }}
        >Full analysis &rarr;</a>
      </div>
      <p style={{ fontSize: 13, color: bodyText, lineHeight: 1.6, margin: 0 }}>
        {description}
      </p>
    </div>
  );
}

/* ── Raw materials SVG layer for Fiber page ── */
function RawMaterialsSVGLayer({
  compW,
  onGermaniumClick,
}: {
  compW: number;
  onGermaniumClick: () => void;
}) {
  const svgH = 100;
  const nodeY = 40;
  const bottomY = svgH - 5;
  const cx1 = compW / 2 - 200; // Germanium
  const cx2 = compW / 2;       // Helium
  const cx3 = compW / 2 + 200; // Silica

  return (
    <div style={{ position: "relative", marginBottom: 0 }}>
      <div style={{
        position: "absolute", left: 12, top: nodeY - 6,
        fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: "0.1em",
        color: dimmer, textTransform: "uppercase" as const,
        writingMode: "horizontal-tb",
      }}>
        RAW MATERIALS
      </div>
      <svg
        viewBox={`0 0 ${compW} ${svgH}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block", width: "100%", height: "auto" }}
      >
        {/* Germanium node — navigable */}
        <g style={{ cursor: "pointer" }} onClick={onGermaniumClick}>
          <circle cx={cx1} cy={nodeY} r={5.5} fill="none" stroke="rgba(155,168,171,0.5)" strokeWidth={1} />
          <text x={cx1} y={nodeY + 22} textAnchor="middle" fill={warmWhite} fontSize={13} fontFamily="'EB Garamond', serif">
            Germanium
          </text>
          {/* Line down to GeCl4 layer */}
          <line x1={cx1} y1={nodeY + 6} x2={cx1} y2={bottomY} stroke="rgba(255,255,255,0.12)" strokeWidth={0.8} strokeDasharray="4,3" />
        </g>

        {/* Helium node — non-navigable */}
        <g style={{ opacity: 0.6 }}>
          <circle cx={cx2} cy={nodeY} r={5.5} fill="none" stroke="rgba(155,168,171,0.5)" strokeWidth={1} />
          <text x={cx2} y={nodeY + 22} textAnchor="middle" fill={warmWhite} fontSize={13} fontFamily="'EB Garamond', serif">
            Helium
          </text>
          {/* Line down to fiber mfg (skips GeCl4 — goes all the way to bottom) */}
          <line x1={cx2} y1={nodeY + 6} x2={cx2} y2={bottomY} stroke="rgba(255,255,255,0.12)" strokeWidth={0.8} strokeDasharray="4,3" />
        </g>

        {/* Silica/SiCl4 node — non-navigable */}
        <g style={{ opacity: 0.6 }}>
          <circle cx={cx3} cy={nodeY} r={5.5} fill="none" stroke="rgba(155,168,171,0.5)" strokeWidth={1} />
          <text x={cx3} y={nodeY + 22} textAnchor="middle" fill={warmWhite} fontSize={13} fontFamily="'EB Garamond', serif">
            {"Silica / SiCl\u2084"}
          </text>
          {/* Line down to fiber mfg (skips GeCl4) */}
          <line x1={cx3} y1={nodeY + 6} x2={cx3} y2={bottomY} stroke="rgba(255,255,255,0.12)" strokeWidth={0.8} strokeDasharray="4,3" />
        </g>
      </svg>
    </div>
  );
}

/* ── Fiber supply tree (with full GeCl4 layer) ── */
function FiberSupplyTree({ onNodeClick }: { onNodeClick: (name: string) => void }) {
  const compChain = chainsData.COMP_DATA["GeO\u2082 / GeCl\u2084"];
  const subChain = chainsData.SUB_DATA["Fiber Optics"];
  const compW = useMemo(() => computeCompSvgWidth(compChain), [compChain]);
  const subW = useMemo(() => computeSubSvgWidth(subChain), [subChain]);
  // Full geometry — includes GeCl4 suppliers layer
  const compGeo = useMemo(() => buildCompGeometry(compChain, compW / 2, 80), [compChain, compW]);
  const subGeo = useMemo(() => buildSubGeometry(subChain, subW / 2, 80), [subChain, subW]);
  const compH = compGeo.outputNode.cy + 120;
  const subH = subGeo.outputNode.cy + 120;
  const subFirstXs = subGeo.layers[0].nodes.map(n => n.cx);
  const lc = chainsData.layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;

  return (
    <>
      <TreeMap geometry={compGeo} nodes={allNodes} layerConfig={lc} svgWidth={compW} svgHeight={compH} onNodeClick={onNodeClick} onLayerClick={() => {}} layerPanels={{}} />
      {/* Bridge to sub tree */}
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
  const [hoveredVertical, setHoveredVertical] = useState<number | null>(null);
  const [treeExpanded, setTreeExpanded] = useState(false);

  /* ── navigation helpers ── */
  function goVerticals() {
    setLevel("verticals");
    setSelectedVertical(null);
    setSelectedSubsystem(null);
    setTreeTarget(null);
    setBreadcrumb([]);
    setTreeExpanded(false);
  }

  function goSubsystems(verticalName: string) {
    setLevel("subsystems");
    setSelectedVertical(verticalName);
    setSelectedSubsystem(null);
    setTreeTarget(null);
    setBreadcrumb([{ label: "All verticals", level: "verticals" }]);
    setTreeExpanded(false);
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
      return;
    }
  }

  /* ── tree config data ── */
  const GERMANIUM_FEEDS_INTO = [
    { id: "fiber", name: "Fiber optic cable", status: "Constrained", detail: "Glass strands carrying light signals. Physical backbone of datacenter connectivity.", hasTree: true },
    { id: "ir-optics", name: "IR optics", status: "Tightening", detail: "Thermal imaging lenses for defense, surveillance, automotive.", hasTree: false },
    { id: "sat-solar", name: "Satellite solar cells", status: "Tightening", detail: "III-V multi-junction cells on germanium substrates for space power.", hasTree: false },
    { id: "sige", name: "SiGe semiconductors", status: "Available", detail: "5G RF, radar, electronic warfare chips.", hasTree: false },
  ];

  const GALLIUM_FEEDS_INTO = [
    { id: "gan-power", name: "GaN power semiconductors", status: "Constrained", detail: "AI datacenter 800V HVDC, EV onboard chargers.", hasTree: false },
    { id: "gaas", name: "GaAs substrates & devices", status: "Tightening", detail: "5G RF handsets, LEDs, satellite solar cells, laser diodes.", hasTree: false },
    { id: "defense", name: "GaN RF and defense radar", status: "Constrained", detail: "AN/SPY-6, LTAMDS, Patriot, F-35 APG-81.", hasTree: false },
    { id: "led", name: "LED lighting", status: "Available", detail: "General lighting, automotive, display backlighting.", hasTree: false },
  ];

  // Compute compW for the raw materials SVG layer (fiber page)
  const fiberCompChain = chainsData.COMP_DATA["GeO\u2082 / GeCl\u2084"];
  const fiberCompW = useMemo(() => computeCompSvgWidth(fiberCompChain), [fiberCompChain]);

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
              style={{ fontSize: 11, color: dimmer, cursor: "pointer", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = bodyText)}
              onMouseLeave={e => (e.currentTarget.style.color = dimmer)}
            >
              {bc.label}
            </span>
            <span style={{ fontSize: 11, color: dimmer }}>/</span>
          </React.Fragment>
        ))}
        {currentLabel && (
          <span style={{ fontSize: 11, color: bodyText }}>{currentLabel}</span>
        )}
      </div>
    );
  }

  /* ── render: verticals (explore-page style accordion) ── */
  function renderVerticals() {
    return (
      <>
        <p style={{ fontSize: 9, letterSpacing: "0.1em", color: dimmer, margin: "0 0 0 0", textTransform: "uppercase" as const }}>VERTICALS</p>
        <div>
          {VERTICALS_DATA.map((v, i) => {
            const isActive = hoveredVertical === i || (hoveredVertical === null && i === 0);
            return (
              <div
                key={v.id}
                onClick={v.live ? () => goSubsystems(v.name) : undefined}
                onMouseEnter={() => setHoveredVertical(i)}
                onMouseLeave={() => setHoveredVertical(null)}
                style={{
                  padding: i === 0 ? "28px 0 16px 0" : "16px 0",
                  borderBottom: "1px solid #1e1c1a",
                  cursor: v.live ? "pointer" : "default",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 15,
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? warmWhite : "#6a6560",
                      transition: "color 0.2s, font-weight 0.2s",
                    }}>
                      {v.name}
                    </span>
                    {isActive && (
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#5a5550", lineHeight: 1.55,
                        marginTop: 10, maxWidth: 500,
                        animation: "tvDescIn 0.3s ease",
                      }}>
                        {v.description}
                        {!v.live && (
                          <span style={{ fontStyle: "italic", fontSize: 10, color: "#444", marginLeft: 6 }}>Coming soon</span>
                        )}
                      </div>
                    )}
                  </div>
                  <span style={{
                    fontFamily: "'Geist Mono', monospace", fontSize: 16, flexShrink: 0,
                    color: isActive ? "#555" : "#333",
                    transition: "color 0.2s",
                  }}>
                    &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <style>{`@keyframes tvDescIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      </>
    );
  }

  /* ── render: subsystems ── */
  function renderSubsystems() {
    return (
      <>
        <p style={{ fontSize: 9, letterSpacing: "0.1em", color: dimmer, margin: "0 0 12px 0", textTransform: "uppercase" as const }}>SUBSYSTEMS &middot; {selectedVertical?.toUpperCase()}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {AI_SUBSYSTEMS.map(s => {
            const clickable = s.components.length > 0;
            return (
              <div
                key={s.id}
                onClick={clickable ? () => goComponents(s.name) : undefined}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 20px", background: cardBg, border: `1px solid ${borderColor}`,
                  borderRadius: 8, cursor: clickable ? "pointer" : "default",
                  transition: "border-color 0.15s", opacity: clickable ? 1 : 0.5,
                }}
                onMouseEnter={e => { if (clickable) e.currentTarget.style.borderColor = "#333"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 2 }}>
                    <p style={{ fontSize: 14, color: warmWhite, fontWeight: 500, margin: 0 }}>{s.name}</p>
                    <StatusBadge status={s.status} />
                  </div>
                  <p style={{ fontSize: 11, color: dimmer, margin: 0 }}>{s.components.length} component{s.components.length !== 1 ? "s" : ""}</p>
                </div>
                {clickable && <span style={{ fontSize: 14, color: dimmer }}>&rarr;</span>}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  /* ── render: components ── */
  function renderComponents() {
    const sub = AI_SUBSYSTEMS.find(s => s.name === selectedSubsystem);
    if (!sub) return null;
    return (
      <>
        <p style={{ fontSize: 9, letterSpacing: "0.1em", color: dimmer, margin: "0 0 12px 0", textTransform: "uppercase" as const }}>COMPONENTS &middot; {selectedSubsystem?.toUpperCase()}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sub.components.map(c => (
            <div
              key={c.id}
              onClick={c.hasTree ? () => goTree({ type: "component", id: c.id }, c.name) : undefined}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 20px", background: cardBg, border: `1px solid ${borderColor}`,
                borderRadius: 8, cursor: c.hasTree ? "pointer" : "default",
                transition: "border-color 0.15s", opacity: c.hasTree ? 1 : 0.5,
              }}
              onMouseEnter={e => { if (c.hasTree) e.currentTarget.style.borderColor = "#333"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 2 }}>
                  <p style={{ fontSize: 14, color: warmWhite, fontWeight: 500, margin: 0 }}>{c.name}</p>
                  <StatusBadge status={c.status} />
                </div>
                <p style={{ fontSize: 11, color: muted, margin: 0 }}>{c.detail}</p>
              </div>
              {c.hasTree && <span style={{ fontSize: 11, color: dimmer }}>View tree &rarr;</span>}
            </div>
          ))}
        </div>
      </>
    );
  }

  /* ── render: "feeds into" cards ── */
  function renderFeedsInto(items: typeof GERMANIUM_FEEDS_INTO, onNavigate?: (id: string) => void) {
    return (
      <>
        <p style={{ fontSize: 9, letterSpacing: "0.1em", color: dimmer, margin: "24px 0 12px 0", textTransform: "uppercase" as const }}>FEEDS INTO</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {items.map(fi => {
            const navigable = fi.hasTree && onNavigate;
            return (
              <div
                key={fi.id}
                onClick={navigable ? () => onNavigate!(fi.id) : undefined}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 20px", background: cardBg, border: `1px solid ${borderColor}`,
                  borderRadius: 8, cursor: navigable ? "pointer" : "default",
                  transition: "border-color 0.15s", opacity: fi.hasTree ? 1 : 0.5,
                }}
                onMouseEnter={e => { if (navigable) e.currentTarget.style.borderColor = "#333"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 2 }}>
                    <p style={{ fontSize: 13, color: fi.hasTree ? warmWhite : bodyText, fontWeight: 500, margin: 0 }}>{fi.name}</p>
                    <StatusBadge status={fi.status} />
                  </div>
                  <p style={{ fontSize: 11, color: muted, margin: 0 }}>{fi.detail}</p>
                </div>
                {navigable && <span style={{ fontSize: 11, color: dimmer }}>&rarr;</span>}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  /* ── render: tree view (component or raw-material) ── */
  function renderTree() {
    if (!treeTarget) return null;

    /* ── Fiber optic cable tree ── */
    if (treeTarget.type === "component" && treeTarget.id === "fiber") {
      const fiberTree = (
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: 10, overflow: "hidden", background: "#131210" }}>
          <RawMaterialsSVGLayer compW={fiberCompW} onGermaniumClick={() => goRawMaterial("germanium")} />
          <FiberSupplyTree onNodeClick={() => {}} />
        </div>
      );

      return (
        <>
          <TreeHeader
            title="Fiber optic cable"
            href="/input/fiber-optic-cable"
            description="Glass strands carrying light signals between servers, racks, and datacenters. The physical backbone of AI infrastructure connectivity."
          />

          <div style={{ position: "relative" }}>
            <ExpandButton onClick={() => setTreeExpanded(true)} />
            {fiberTree}
          </div>

          {treeExpanded && (
            <FullscreenOverlay treeName="FIBER OPTIC CABLE" onClose={() => setTreeExpanded(false)}>
              {fiberTree}
            </FullscreenOverlay>
          )}
        </>
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
        <>
          <TreeHeader
            title="Germanium"
            href="/input/germanium"
            description="Trace element doped into glass to create the refractive index that allows fiber optic cable to carry light. Also used in IR defense optics, satellite solar cells, and SiGe semiconductors."
          />

          <div style={{ position: "relative" }}>
            <ExpandButton onClick={() => setTreeExpanded(true)} />
            {geTree}
          </div>

          {renderFeedsInto(GERMANIUM_FEEDS_INTO, (id) => {
            if (id === "fiber") {
              setTreeTarget({ type: "component", id: "fiber" });
              setTreeExpanded(false);
              setBreadcrumb([
                { label: "All verticals", level: "verticals" },
                { label: selectedVertical ?? "", level: "subsystems", vertical: selectedVertical },
                ...(selectedSubsystem ? [{ label: selectedSubsystem, level: "components" as NavLevel, vertical: selectedVertical, subsystem: selectedSubsystem }] : []),
              ]);
            }
          })}

          {treeExpanded && (
            <FullscreenOverlay treeName="GERMANIUM" onClose={() => setTreeExpanded(false)}>
              {geTree}
            </FullscreenOverlay>
          )}
        </>
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
        <>
          <TreeHeader
            title="Gallium"
            href="/input/gallium"
            description="Byproduct of alumina refining. Forms compound semiconductors (GaAs, GaN) for AI datacenter power conversion, 5G amplifiers, defense radar, and LED lighting."
          />

          <div style={{ position: "relative" }}>
            <ExpandButton onClick={() => setTreeExpanded(true)} />
            {gaTree}
          </div>

          {renderFeedsInto(GALLIUM_FEEDS_INTO)}

          {treeExpanded && (
            <FullscreenOverlay treeName="GALLIUM" onClose={() => setTreeExpanded(false)}>
              {gaTree}
            </FullscreenOverlay>
          )}
        </>
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
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px 80px", minHeight: "100vh", background: "#111" }}>
      {renderBreadcrumb()}
      {level === "verticals" && renderVerticals()}
      {level === "subsystems" && renderSubsystems()}
      {level === "components" && renderComponents()}
      {level === "tree" && renderTree()}
    </div>
  );
}
