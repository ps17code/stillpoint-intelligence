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
const rawInputBg = "#161412";
const borderColor = "#252220";
const warmWhite = "#ece8e1";
const bodyText = "#a09888";
const muted = "#706a60";
const dimText = "#555";
const dimmer = "#4a4540";

const STATUS_COLORS: Record<string, string> = {
  Constrained: "#a05a4a",
  Tightening: "#9a8540",
  Available: "#4a8a55",
  Oversupplied: "#5a7a8a",
};

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

const VERTICALS = [
  { id: "ai", name: "AI Infrastructure", count: "17 chains", hasSubsystems: true },
  { id: "robotics", name: "Robotics", count: "4 chains", hasSubsystems: false },
  { id: "energy", name: "Energy Transition", count: "6 chains", hasSubsystems: false },
  { id: "uavs", name: "UAVs", count: "3 chains", hasSubsystems: false },
  { id: "space", name: "Space", count: "2 chains", hasSubsystems: false },
];

/* ── sub-components ── */

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? muted;
  return (
    <span style={{
      fontSize: 9, letterSpacing: "0.04em", fontWeight: 500,
      color: c, border: `1px solid ${c}33`,
      borderRadius: 4, padding: "2px 8px",
      textTransform: "uppercase" as const,
    }}>
      {status}
    </span>
  );
}

/* ── Fiber supply tree (with full GeCl₄ layer) ── */
function FiberSupplyTree({ onNodeClick }: { onNodeClick: (name: string) => void }) {
  const compChain = chainsData.COMP_DATA["GeO\u2082 / GeCl\u2084"];
  const subChain = chainsData.SUB_DATA["Fiber Optics"];
  const compW = useMemo(() => computeCompSvgWidth(compChain), [compChain]);
  const subW = useMemo(() => computeSubSvgWidth(subChain), [subChain]);
  // Full geometry — includes GeCl₄ suppliers layer
  const compGeo = useMemo(() => buildCompGeometry(compChain, compW / 2, 80), [compChain, compW]);
  const subGeo = useMemo(() => buildSubGeometry(subChain, subW / 2, 80), [subChain, subW]);
  const compH = compGeo.outputNode.cy + 120;
  const subH = subGeo.outputNode.cy + 120;
  const subFirstXs = subGeo.layers[0].nodes.map(n => n.cx);
  const lc = chainsData.layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;

  return (
    <div style={{ border: `1px solid ${borderColor}`, borderRadius: 10, overflow: "hidden", background: "#131210" }}>
      <TreeMap geometry={compGeo} nodes={allNodes} layerConfig={lc} svgWidth={compW} svgHeight={compH} onNodeClick={onNodeClick} onLayerClick={() => {}} layerPanels={{}} />
      {/* Bridge to sub tree */}
      <svg viewBox={`0 0 ${subW} 80`} preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", height: "auto" }}>
        {subFirstXs.map((tx, i) => {
          const fx = subW / 2;
          return <path key={i} d={`M ${fx},0 C ${fx},40 ${tx},40 ${tx},80`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={0.8} strokeDasharray="4,3" />;
        })}
      </svg>
      <TreeMap geometry={subGeo} nodes={allNodes} layerConfig={lc} svgWidth={subW} svgHeight={subH} onNodeClick={onNodeClick} onLayerClick={() => {}} layerPanels={{}} />
    </div>
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
    <div style={{ border: `1px solid ${borderColor}`, borderRadius: 10, overflow: "hidden", background: "#131210" }}>
      <TreeMap geometry={rawGeo} nodes={allNodes} layerConfig={lc} svgWidth={rawW} svgHeight={rawH} onNodeClick={onNodeClick} onLayerClick={() => {}} layerPanels={{}} />
    </div>
  );
}

/* ── Gallium supply tree ── */
function GalliumSupplyTree({ onNodeClick }: { onNodeClick: (name: string) => void }) {
  const gW = useMemo(() => computeGalliumSvgWidth(galliumChain), []);
  const gGeo = useMemo(() => buildGalliumGeometry(galliumChain, gW / 2, 80), [gW]);
  const gH = gGeo.outputNode.cy + 120;

  return (
    <div style={{ border: `1px solid ${borderColor}`, borderRadius: 10, overflow: "hidden", background: "#131210" }}>
      <TreeMap geometry={gGeo} nodes={galliumNodes} layerConfig={galliumLc} svgWidth={gW} svgHeight={gH} onNodeClick={onNodeClick} onLayerClick={() => {}} layerPanels={{}} />
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*  TreeView — main exported component        */
/* ═══════════════════════════════════════════ */

export default function TreeView() {
  const [level, setLevel] = useState<NavLevel>("verticals");
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null);
  const [selectedSubsystem, setSelectedSubsystem] = useState<string | null>(null);
  const [treeTarget, setTreeTarget] = useState<TreeTarget | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<{ label: string; level: NavLevel; vertical?: string | null; subsystem?: string | null; target?: TreeTarget | null }[]>([]);

  /* ── navigation helpers ── */
  function goVerticals() {
    setLevel("verticals");
    setSelectedVertical(null);
    setSelectedSubsystem(null);
    setTreeTarget(null);
    setBreadcrumb([]);
  }

  function goSubsystems(verticalName: string) {
    setLevel("subsystems");
    setSelectedVertical(verticalName);
    setSelectedSubsystem(null);
    setTreeTarget(null);
    setBreadcrumb([{ label: "All verticals", level: "verticals" }]);
  }

  function goComponents(subsystemName: string) {
    setLevel("components");
    setSelectedSubsystem(subsystemName);
    setTreeTarget(null);
    setBreadcrumb([
      { label: "All verticals", level: "verticals" },
      { label: selectedVertical ?? "", level: "subsystems", vertical: selectedVertical },
    ]);
  }

  function goTree(target: TreeTarget, label: string) {
    setLevel("tree");
    setTreeTarget(target);
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
      setBreadcrumb(breadcrumb.slice(0, breadcrumb.indexOf(bc)));
      return;
    }
  }

  /* ── tree config data ── */
  const FIBER_RAW_MATERIALS = [
    { name: "Germanium", status: "Constrained", detail: "Core dopant \u00b7 38% of Ge supply \u00b7 83% Chinese", navigateTo: "germanium" as string | null },
    { name: "Helium", status: "Constrained", detail: "Draw tower coolant \u00b7 Non-renewable \u00b7 Up 135%", navigateTo: null },
    { name: "Silica / SiCl\u2084", status: "Tightening", detail: "Cladding material \u00b7 Prices up 50%", navigateTo: null },
  ];

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

  /* ── render: verticals ── */
  function renderVerticals() {
    return (
      <>
        <p style={{ fontSize: 9, letterSpacing: "0.1em", color: dimmer, margin: "0 0 12px 0", textTransform: "uppercase" as const }}>VERTICALS</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {VERTICALS.map(v => (
            <div
              key={v.id}
              onClick={v.hasSubsystems ? () => goSubsystems(v.name) : undefined}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 20px", background: cardBg, border: `1px solid ${borderColor}`,
                borderRadius: 8, cursor: v.hasSubsystems ? "pointer" : "default",
                transition: "border-color 0.15s", opacity: v.hasSubsystems ? 1 : 0.5,
              }}
              onMouseEnter={e => { if (v.hasSubsystems) e.currentTarget.style.borderColor = "#333"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
            >
              <div>
                <p style={{ fontSize: 15, color: warmWhite, fontWeight: 500, margin: "0 0 2px 0" }}>{v.name}</p>
                <p style={{ fontSize: 11, color: dimmer, margin: 0 }}>{v.count}</p>
              </div>
              {v.hasSubsystems && <span style={{ fontSize: 14, color: dimmer }}>&rarr;</span>}
            </div>
          ))}
        </div>
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

  /* ── render: tree view (component or raw-material) ── */
  function renderTree() {
    if (!treeTarget) return null;

    /* ── Fiber optic cable tree ── */
    if (treeTarget.type === "component" && treeTarget.id === "fiber") {
      return (
        <>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, color: warmWhite, margin: 0 }}>Fiber optic cable</h2>
              <StatusBadge status="Constrained" />
            </div>
            <p style={{ fontSize: 11, color: dimmer, margin: "0 0 4px 0" }}>Output: ~720M strand-km/yr</p>
            <p style={{ fontSize: 13, color: bodyText, lineHeight: 1.6, margin: "8px 0 4px 0" }}>
              Glass strands carrying light signals between servers, racks, and datacenters. The physical backbone of AI infrastructure connectivity.
            </p>
            <a href="/input/fiber-optic-cable" style={{ fontSize: 11, color: muted, textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = warmWhite)}
              onMouseLeave={e => (e.currentTarget.style.color = muted)}
            >Full analysis &rarr;</a>
          </div>

          <p style={{ fontSize: 9, letterSpacing: "0.1em", color: dimmer, margin: "0 0 12px 0", textTransform: "uppercase" as const }}>RAW MATERIAL INPUTS</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 0 }}>
            {FIBER_RAW_MATERIALS.map(rm => (
              <div
                key={rm.name}
                onClick={rm.navigateTo ? () => goRawMaterial(rm.navigateTo!) : undefined}
                style={{
                  flex: "1 1 200px", maxWidth: 320,
                  padding: "12px 16px", background: rawInputBg,
                  border: `1px solid ${borderColor}`, borderRadius: 8,
                  cursor: rm.navigateTo ? "pointer" : "default",
                  transition: "border-color 0.15s",
                  opacity: rm.navigateTo ? 1 : 0.5,
                }}
                onMouseEnter={e => { if (rm.navigateTo) e.currentTarget.style.borderColor = "#333"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <p style={{ fontSize: 12, color: rm.navigateTo ? warmWhite : bodyText, fontWeight: 500, margin: 0 }}>{rm.name}</p>
                    <StatusBadge status={rm.status} />
                  </div>
                  {rm.navigateTo && <span style={{ fontSize: 10, color: dimmer }}>&rarr;</span>}
                </div>
                <p style={{ fontSize: 10, color: muted, margin: 0, lineHeight: 1.4 }}>{rm.detail}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", color: dimmer, fontSize: 11, padding: "12px 0", letterSpacing: "4px" }}>&darr; &darr; &darr;</div>

          <p style={{ fontSize: 9, letterSpacing: "0.1em", color: dimmer, margin: "0 0 12px 0", textTransform: "uppercase" as const }}>SUPPLY TREE</p>
          <FiberSupplyTree onNodeClick={() => {}} />
        </>
      );
    }

    /* ── Germanium tree ── */
    if (treeTarget.type === "raw-material" && treeTarget.id === "germanium") {
      return (
        <>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, color: warmWhite, margin: 0 }}>Germanium</h2>
              <StatusBadge status="Constrained" />
            </div>
            <p style={{ fontSize: 11, color: dimmer, margin: "0 0 4px 0" }}>Supply: ~230t/yr &middot; 83% Chinese</p>
            <p style={{ fontSize: 13, color: bodyText, lineHeight: 1.6, margin: "8px 0 4px 0" }}>
              Trace element doped into glass to create the refractive index that allows fiber optic cable to carry light. Also used in IR defense optics, satellite solar cells, and SiGe semiconductors.
            </p>
            <a href="/input/germanium" style={{ fontSize: 11, color: muted, textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = warmWhite)}
              onMouseLeave={e => (e.currentTarget.style.color = muted)}
            >Full analysis &rarr;</a>
          </div>

          <p style={{ fontSize: 9, letterSpacing: "0.1em", color: dimmer, margin: "0 0 12px 0", textTransform: "uppercase" as const }}>FEEDS INTO</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 0 }}>
            {GERMANIUM_FEEDS_INTO.map(fi => (
              <div
                key={fi.id}
                onClick={fi.hasTree && fi.id === "fiber" ? () => {
                  setTreeTarget({ type: "component", id: "fiber" });
                  setBreadcrumb([
                    { label: "All verticals", level: "verticals" },
                    { label: selectedVertical ?? "", level: "subsystems", vertical: selectedVertical },
                    ...(selectedSubsystem ? [{ label: selectedSubsystem, level: "components" as NavLevel, vertical: selectedVertical, subsystem: selectedSubsystem }] : []),
                  ]);
                } : undefined}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 20px", background: cardBg, border: `1px solid ${borderColor}`,
                  borderRadius: 8, cursor: fi.hasTree ? "pointer" : "default",
                  transition: "border-color 0.15s", opacity: fi.hasTree ? 1 : 0.5,
                }}
                onMouseEnter={e => { if (fi.hasTree) e.currentTarget.style.borderColor = "#333"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 2 }}>
                    <p style={{ fontSize: 13, color: fi.hasTree ? warmWhite : bodyText, fontWeight: 500, margin: 0 }}>{fi.name}</p>
                    <StatusBadge status={fi.status} />
                  </div>
                  <p style={{ fontSize: 11, color: muted, margin: 0 }}>{fi.detail}</p>
                </div>
                {fi.hasTree && <span style={{ fontSize: 11, color: dimmer }}>&rarr;</span>}
              </div>
            ))}
          </div>

          <p style={{ fontSize: 9, letterSpacing: "0.1em", color: dimmer, margin: "24px 0 12px 0", textTransform: "uppercase" as const }}>SUPPLY TREE</p>
          <GermaniumSupplyTree onNodeClick={() => {}} />
        </>
      );
    }

    /* ── Gallium tree ── */
    if (treeTarget.type === "raw-material" && treeTarget.id === "gallium") {
      return (
        <>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, color: warmWhite, margin: 0 }}>Gallium</h2>
              <StatusBadge status="Constrained" />
            </div>
            <p style={{ fontSize: 11, color: dimmer, margin: "0 0 4px 0" }}>Supply: ~320t/yr refined &middot; 98% Chinese primary</p>
            <p style={{ fontSize: 13, color: bodyText, lineHeight: 1.6, margin: "8px 0 4px 0" }}>
              Byproduct of alumina refining. Forms compound semiconductors (GaAs, GaN) for AI datacenter power conversion, 5G amplifiers, defense radar, and LED lighting.
            </p>
            <a href="/input/gallium" style={{ fontSize: 11, color: muted, textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = warmWhite)}
              onMouseLeave={e => (e.currentTarget.style.color = muted)}
            >Full analysis &rarr;</a>
          </div>

          <p style={{ fontSize: 9, letterSpacing: "0.1em", color: dimmer, margin: "0 0 12px 0", textTransform: "uppercase" as const }}>FEEDS INTO</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 0 }}>
            {GALLIUM_FEEDS_INTO.map(fi => (
              <div
                key={fi.id}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 20px", background: cardBg, border: `1px solid ${borderColor}`,
                  borderRadius: 8, cursor: "default", opacity: 0.5,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 2 }}>
                    <p style={{ fontSize: 13, color: bodyText, fontWeight: 500, margin: 0 }}>{fi.name}</p>
                    <StatusBadge status={fi.status} />
                  </div>
                  <p style={{ fontSize: 11, color: muted, margin: 0 }}>{fi.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 9, letterSpacing: "0.1em", color: dimmer, margin: "24px 0 12px 0", textTransform: "uppercase" as const }}>SUPPLY TREE</p>
          <GalliumSupplyTree onNodeClick={() => {}} />
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
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px 80px", minHeight: "100%" }}>
      {renderBreadcrumb()}
      {level === "verticals" && renderVerticals()}
      {level === "subsystems" && renderSubsystems()}
      {level === "components" && renderComponents()}
      {level === "tree" && renderTree()}
    </div>
  );
}
