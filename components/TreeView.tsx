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
const muted = "#706a60";
const dimText = "#555";

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
  status: "Constrained" | "Tightening" | "Available" | "Oversupplied";
  components: ComponentDef[];
}
interface ComponentDef {
  id: string;
  name: string;
  status: "Constrained" | "Tightening" | "Available" | "Oversupplied";
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
  { id: "ai", name: "AI Infrastructure", hasSubsystems: true },
  { id: "robotics", name: "Robotics", hasSubsystems: false },
  { id: "energy", name: "Energy Transition", hasSubsystems: false },
  { id: "uavs", name: "UAVs", hasSubsystems: false },
  { id: "space", name: "Space", hasSubsystems: false },
];

/* ── sub-components ── */

function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{
      fontSize: 10, letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif",
      color: STATUS_COLORS[status] ?? muted, border: `1px solid ${STATUS_COLORS[status] ?? muted}`,
      borderRadius: 4, padding: "2px 8px", textTransform: "uppercase" as const,
    }}>
      {status}
    </span>
  );
}

/* ── Fiber supply tree ── */
function FiberSupplyTree({ onNodeClick }: { onNodeClick: (name: string) => void }) {
  const compChain = chainsData.COMP_DATA["GeO\u2082 / GeCl\u2084"];
  const subChain = chainsData.SUB_DATA["Fiber Optics"];
  const compW = useMemo(() => computeCompSvgWidth(compChain), [compChain]);
  const subW = useMemo(() => computeSubSvgWidth(subChain), [subChain]);
  const compGeoCompact = useMemo(() => {
    const full = buildCompGeometry(compChain, compW / 2, 80);
    const gap = full.layers[1].cy - full.layers[0].cy;
    return {
      layers: full.layers.slice(1).map(l => ({ ...l, cy: l.cy - gap, nodes: l.nodes.map(n => ({ ...n, cy: n.cy - gap })) })),
      edges: full.edges.filter(e => e.fromLayer >= 1).map(e => ({ ...e, fromLayer: e.fromLayer - 1, y1: e.y1 - gap, y2: e.y2 - gap })),
      outputNode: { ...full.outputNode, cy: full.outputNode.cy - gap },
    };
  }, [compChain, compW]);
  const subGeo = useMemo(() => buildSubGeometry(subChain, subW / 2, 80), [subChain, subW]);
  const compHCompact = compGeoCompact.outputNode.cy + 120;
  const subH = subGeo.outputNode.cy + 120;
  const fiberMfgXs = compGeoCompact.layers[0].nodes.map(n => n.cx);
  const subFirstXs = subGeo.layers[0].nodes.map(n => n.cx);
  const lc = chainsData.layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;

  return (
    <div style={{ border: `1px solid ${borderColor}`, borderRadius: 10, overflow: "hidden", background: "#131210" }}>
      {/* Fan-out bridge to fiber mfg nodes */}
      <svg viewBox={`0 0 ${compW} 80`} preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", height: "auto" }}>
        {fiberMfgXs.map((tx, i) => {
          const fx = compW / 2;
          return <path key={i} d={`M ${fx},0 C ${fx},40 ${tx},40 ${tx},80`} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={0.8} strokeDasharray="4,3" />;
        })}
      </svg>
      <TreeMap geometry={compGeoCompact} nodes={allNodes} layerConfig={lc} svgWidth={compW} svgHeight={compHCompact} onNodeClick={onNodeClick} onLayerClick={() => {}} layerPanels={{}} />
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

  function goRawMaterial(rawId: string, rawName: string) {
    const prevBreadcrumb = [...breadcrumb];
    if (treeTarget && treeTarget.type === "component") {
      // add current component tree to breadcrumb
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
    { id: "germanium", name: "Germanium", status: "Constrained", navigateTo: "germanium" as string | null },
    { id: "helium", name: "Helium", status: "Constrained", navigateTo: null },
    { id: "silica", name: "Silica / SiCl\u2084", status: "Tightening", navigateTo: null },
  ];

  const GERMANIUM_FEEDS_INTO = [
    { id: "fiber", name: "Fiber optic cable", hasTree: true },
    { id: "ir-optics", name: "IR optics", hasTree: false },
    { id: "sat-solar", name: "Satellite solar cells", hasTree: false },
    { id: "sige", name: "SiGe semiconductors", hasTree: false },
  ];

  const GALLIUM_FEEDS_INTO = [
    { id: "fiber", name: "Fiber optic cable", hasTree: true },
    { id: "led", name: "LEDs & laser diodes", hasTree: false },
    { id: "gan", name: "GaN power electronics", hasTree: false },
    { id: "5g", name: "5G RF chips", hasTree: false },
  ];

  /* ── card base style ── */
  const cardStyle: React.CSSProperties = {
    background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 8,
    padding: "18px 22px", cursor: "pointer", transition: "border-color 0.15s",
  };

  /* ── section label ── */
  function SectionLabel({ text }: { text: string }) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.12em", color: muted, textTransform: "uppercase" as const, marginBottom: 12 }}>
        {text}
      </div>
    );
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
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {parts.map((bc, i) => (
          <React.Fragment key={i}>
            <span
              onClick={() => handleBreadcrumbClick(bc)}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: dimText, cursor: "pointer", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = warmWhite)}
              onMouseLeave={e => (e.currentTarget.style.color = dimText)}
            >
              {bc.label}
            </span>
            <span style={{ color: "#333", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>/</span>
          </React.Fragment>
        ))}
        {currentLabel && (
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: warmWhite }}>{currentLabel}</span>
        )}
      </div>
    );
  }

  /* ── render: verticals ── */
  function renderVerticals() {
    return (
      <>
        <SectionLabel text="Verticals" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {VERTICALS.map(v => (
            <div
              key={v.id}
              onClick={v.hasSubsystems ? () => goSubsystems(v.name) : undefined}
              style={{
                ...cardStyle,
                opacity: v.hasSubsystems ? 1 : 0.5,
                cursor: v.hasSubsystems ? "pointer" : "default",
              }}
              onMouseEnter={e => { if (v.hasSubsystems) e.currentTarget.style.borderColor = "#333"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
            >
              <div style={{ fontFamily: "var(--font-garamond, 'EB Garamond', serif)", fontSize: 20, color: warmWhite }}>{v.name}</div>
              {!v.hasSubsystems && (
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: dimText, marginTop: 4 }}>Coming soon</div>
              )}
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
        <SectionLabel text="Subsystems" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {AI_SUBSYSTEMS.map(s => {
            const clickable = s.components.length > 0;
            return (
              <div
                key={s.id}
                onClick={clickable ? () => goComponents(s.name) : undefined}
                style={{
                  ...cardStyle,
                  opacity: clickable ? 1 : 0.6,
                  cursor: clickable ? "pointer" : "default",
                }}
                onMouseEnter={e => { if (clickable) e.currentTarget.style.borderColor = "#333"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "var(--font-garamond, 'EB Garamond', serif)", fontSize: 20, color: warmWhite }}>{s.name}</span>
                  <StatusBadge status={s.status} />
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: dimText, marginTop: 4 }}>
                  {s.components.length} component{s.components.length !== 1 ? "s" : ""}
                </div>
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
        <SectionLabel text="Components" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sub.components.map(c => (
            <div
              key={c.id}
              onClick={c.hasTree ? () => goTree({ type: "component", id: c.id }, c.name) : undefined}
              style={{
                ...cardStyle,
                opacity: c.hasTree ? 1 : 0.5,
                cursor: c.hasTree ? "pointer" : "default",
              }}
              onMouseEnter={e => { if (c.hasTree) e.currentTarget.style.borderColor = "#333"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "var(--font-garamond, 'EB Garamond', serif)", fontSize: 20, color: warmWhite }}>{c.name}</span>
                <StatusBadge status={c.status} />
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: dimText, marginTop: 4 }}>{c.detail}</div>
            </div>
          ))}
        </div>
      </>
    );
  }

  /* ── render: tree view (component or raw-material) ── */
  function renderTree() {
    if (!treeTarget) return null;

    if (treeTarget.type === "component" && treeTarget.id === "fiber") {
      return (
        <>
          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <span style={{ fontFamily: "'Instrument Serif', 'EB Garamond', serif", fontSize: 28, color: warmWhite }}>Fiber optic cable</span>
              <StatusBadge status="Constrained" />
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: dimText }}>
              Glass strands carrying light signals. Physical backbone of datacenter connectivity.
            </div>
            <a href="/input/fiber-optic-cable" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#6a9ab8", textDecoration: "none", marginTop: 8, display: "inline-block" }}>
              Full analysis &rarr;
            </a>
          </div>

          {/* Raw material inputs */}
          <SectionLabel text="Raw material inputs" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {FIBER_RAW_MATERIALS.map(rm => (
              <div
                key={rm.id}
                onClick={rm.navigateTo ? () => goRawMaterial(rm.navigateTo!, rm.name) : undefined}
                style={{
                  ...cardStyle,
                  opacity: rm.navigateTo ? 1 : 0.5,
                  cursor: rm.navigateTo ? "pointer" : "default",
                }}
                onMouseEnter={e => { if (rm.navigateTo) e.currentTarget.style.borderColor = "#333"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "var(--font-garamond, 'EB Garamond', serif)", fontSize: 18, color: warmWhite }}>{rm.name}</span>
                  <StatusBadge status={rm.status} />
                </div>
              </div>
            ))}
          </div>

          {/* Down arrows */}
          <div style={{ textAlign: "center", color: "#333", fontSize: 18, letterSpacing: "0.3em", marginBottom: 20 }}>&darr; &darr; &darr;</div>

          {/* Supply tree */}
          <SectionLabel text="Supply tree" />
          <FiberSupplyTree onNodeClick={() => {}} />
        </>
      );
    }

    if (treeTarget.type === "raw-material" && treeTarget.id === "germanium") {
      return (
        <>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <span style={{ fontFamily: "'Instrument Serif', 'EB Garamond', serif", fontSize: 28, color: warmWhite }}>Germanium</span>
              <StatusBadge status="Constrained" />
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: dimText }}>
              Critical raw material for fiber optic cable manufacturing. China controls 60%+ of global supply.
            </div>
            <a href="/input/germanium" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#6a9ab8", textDecoration: "none", marginTop: 8, display: "inline-block" }}>
              Full analysis &rarr;
            </a>
          </div>

          <SectionLabel text="Feeds into" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {GERMANIUM_FEEDS_INTO.map(fi => (
              <div
                key={fi.id}
                onClick={fi.hasTree && fi.id === "fiber" ? () => {
                  // Navigate back to fiber component tree
                  setTreeTarget({ type: "component", id: "fiber" });
                  setBreadcrumb([
                    { label: "All verticals", level: "verticals" },
                    { label: selectedVertical ?? "", level: "subsystems", vertical: selectedVertical },
                    ...(selectedSubsystem ? [{ label: selectedSubsystem, level: "components" as NavLevel, vertical: selectedVertical, subsystem: selectedSubsystem }] : []),
                  ]);
                } : undefined}
                style={{
                  ...cardStyle,
                  opacity: fi.hasTree ? 1 : 0.5,
                  cursor: fi.hasTree ? "pointer" : "default",
                }}
                onMouseEnter={e => { if (fi.hasTree) e.currentTarget.style.borderColor = "#333"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
              >
                <span style={{ fontFamily: "var(--font-garamond, 'EB Garamond', serif)", fontSize: 18, color: warmWhite }}>{fi.name}</span>
              </div>
            ))}
          </div>

          <SectionLabel text="Supply tree" />
          <GermaniumSupplyTree onNodeClick={() => {}} />
        </>
      );
    }

    if (treeTarget.type === "raw-material" && treeTarget.id === "gallium") {
      return (
        <>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <span style={{ fontFamily: "'Instrument Serif', 'EB Garamond', serif", fontSize: 28, color: warmWhite }}>Gallium</span>
              <StatusBadge status="Constrained" />
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: dimText }}>
              Critical material for GaN power electronics and compound semiconductors.
            </div>
            <a href="/input/gallium" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#6a9ab8", textDecoration: "none", marginTop: 8, display: "inline-block" }}>
              Full analysis &rarr;
            </a>
          </div>

          <SectionLabel text="Feeds into" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {GALLIUM_FEEDS_INTO.map(fi => (
              <div
                key={fi.id}
                style={{
                  ...cardStyle,
                  opacity: fi.hasTree ? 1 : 0.5,
                  cursor: "default",
                }}
              >
                <span style={{ fontFamily: "var(--font-garamond, 'EB Garamond', serif)", fontSize: 18, color: warmWhite }}>{fi.name}</span>
              </div>
            ))}
          </div>

          <SectionLabel text="Supply tree" />
          <GalliumSupplyTree onNodeClick={() => {}} />
        </>
      );
    }

    // Fallback for unknown targets
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: dimText, padding: "40px 0" }}>
        Tree view not yet available for this item.
      </div>
    );
  }

  /* ── main render ── */
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 28px", minHeight: "100%" }}>
      {renderBreadcrumb()}
      {level === "verticals" && renderVerticals()}
      {level === "subsystems" && renderSubsystems()}
      {level === "components" && renderComponents()}
      {level === "tree" && renderTree()}
    </div>
  );
}
