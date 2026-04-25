"use client";
import React, { useMemo, useState } from "react";
import type { InputPageData, DependencyRow } from "@/lib/input-data";

/* ── Tree renderers (per-page tree visualisation) ── */
import TreeMap from "@/components/TreeMap";
import NodeModal from "@/components/NodeModal";
import {
  buildGermaniumGeometry, computeGermaniumSvgWidth,
  buildGalliumGeometry, computeGalliumSvgWidth,
  buildCompGeometry, buildSubGeometry,
  computeCompSvgWidth, computeSubSvgWidth,
} from "@/lib/treeGeometry";
import germaniumChainJson from "@/data/germanium-chain.json";
import germaniumNodesJson from "@/data/germanium-nodes.json";
import galliumChainJson from "@/data/gallium-chain.json";
import galliumNodesJson from "@/data/gallium-nodes.json";
import chainsJson from "@/data/chains.json";
import nodesJson from "@/data/nodes.json";
import type {
  GermaniumChain, GalliumChain, CompChain, SubChain, NodeData,
} from "@/types";

/* ═══════════════════════════════════════════════════
   TREE COMPONENTS — one per treeComponentId
   ═══════════════════════════════════════════════════ */

function GermaniumTree({ onNodeClick, treeExpanded, setTreeExpanded, warmWhite, borderColor, dimText }: {
  onNodeClick: (k: string) => void;
  treeExpanded: boolean;
  setTreeExpanded: (v: boolean) => void;
  warmWhite: string; borderColor: string; dimText: string;
}) {
  const chainData = germaniumChainJson as unknown as {
    layerConfig: Record<string, { displayFields: { key: string; label: string }[] }>;
    GERMANIUM_CHAIN: GermaniumChain;
  };
  const allNodes = germaniumNodesJson as unknown as Record<string, NodeData>;
  const geChain = chainData.GERMANIUM_CHAIN;
  const rawW = useMemo(() => computeGermaniumSvgWidth(geChain), [geChain]);
  const rawGeo = useMemo(() => buildGermaniumGeometry(geChain, rawW / 2, 80), [geChain, rawW]);
  const rawH = rawGeo.outputNode.cy + 120;
  const lc = chainData.layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;

  return (
    <>
      <div style={{ border: `1px solid ${borderColor}`, borderRadius: "10px", overflow: "hidden", background: "#131210", position: "relative" as const }}>
        <button
          onClick={() => setTreeExpanded(true)}
          style={{
            position: "absolute" as const, top: 12, right: 12, zIndex: 5,
            fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: "0.04em",
            color: "#555", background: "rgba(19,18,16,0.8)", border: `1px solid ${borderColor}`,
            borderRadius: 6, padding: "5px 12px", cursor: "pointer",
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = warmWhite; e.currentTarget.style.borderColor = "#3a3835"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = borderColor; }}
        >
          Expand &#8599;
        </button>
        <TreeMap geometry={rawGeo} nodes={allNodes} layerConfig={lc} svgWidth={rawW} svgHeight={rawH} onNodeClick={onNodeClick} onLayerClick={() => {}} layerPanels={{}} />
      </div>
      {treeExpanded && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "#111", overflow: "auto",
          display: "flex", flexDirection: "column" as const,
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 28px", borderBottom: `1px solid ${borderColor}`, flexShrink: 0,
          }}>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: dimText }}>
              GERMANIUM &middot; SUPPLY TREE
            </span>
            <button
              onClick={() => setTreeExpanded(false)}
              style={{
                fontFamily: "'Geist Mono', monospace", fontSize: 9,
                color: "#555", background: "none", border: `1px solid ${borderColor}`,
                borderRadius: 6, padding: "5px 12px", cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = warmWhite; e.currentTarget.style.borderColor = "#3a3835"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = borderColor; }}
            >
              Close &#10005;
            </button>
          </div>
          <div style={{ flex: 1, padding: "20px" }}>
            <TreeMap geometry={rawGeo} nodes={allNodes} layerConfig={lc} svgWidth={rawW} svgHeight={rawH} onNodeClick={onNodeClick} onLayerClick={() => {}} layerPanels={{}} />
          </div>
        </div>
      )}
    </>
  );
}

function GalliumTree({ onNodeClick }: {
  onNodeClick: (k: string) => void;
}) {
  const galliumChain = (galliumChainJson as Record<string, unknown>).GALLIUM_CHAIN as unknown as GalliumChain;
  const galliumNodes = galliumNodesJson as unknown as Record<string, NodeData>;
  const lc = (galliumChainJson as Record<string, unknown>).layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;
  const galliumW = useMemo(() => computeGalliumSvgWidth(galliumChain), [galliumChain]);
  const galliumGeo = useMemo(() => buildGalliumGeometry(galliumChain, galliumW / 2, 80), [galliumChain, galliumW]);
  const galliumH = galliumGeo.outputNode.cy + 120;

  return (
    <div style={{ border: "1px solid #252220", borderRadius: "10px", overflow: "hidden", background: "#131210" }}>
      <TreeMap
        geometry={galliumGeo}
        nodes={galliumNodes}
        layerConfig={lc}
        svgWidth={galliumW}
        svgHeight={galliumH}
        onNodeClick={onNodeClick}
        onLayerClick={() => {}}
        layerPanels={{}}
      />
    </div>
  );
}

function FiberTree({ onNodeClick, treeExpanded, setTreeExpanded, warmWhite, borderColor, dimText }: {
  onNodeClick: (k: string) => void;
  treeExpanded: boolean;
  setTreeExpanded: (v: boolean) => void;
  warmWhite: string; borderColor: string; dimText: string;
}) {
  const chainsData = chainsJson as unknown as {
    layerConfig: Record<string, { label?: string; displayFields: { key: string; label: string }[] }>;
    COMP_DATA: Record<string, CompChain>;
    SUB_DATA: Record<string, SubChain>;
  };
  const allNodes = nodesJson as unknown as Record<string, NodeData>;
  const compChain = chainsData.COMP_DATA["GeO₂ / GeCl₄"];
  const subChain = chainsData.SUB_DATA["Fiber Optics"];
  const compW = useMemo(() => computeCompSvgWidth(compChain), [compChain]);
  const subW = useMemo(() => computeSubSvgWidth(subChain), [subChain]);
  const compGeo = useMemo(() => buildCompGeometry(compChain, compW / 2, 80), [compChain, compW]);
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
  const compH = compGeo.outputNode.cy + 120;
  const compHCompact = compGeoCompact.outputNode.cy + 120;
  const fiberMfgXs = compGeoCompact.layers[0].nodes.map(n => n.cx);
  const subH = subGeo.outputNode.cy + 120;
  const subFirstXs = subGeo.layers[0].nodes.map(n => n.cx);
  const lc = chainsData.layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;
  const [expandedInput, setExpandedInput] = useState<string | null>(null);

  const renderTreeContent = () => (
    <>
      {expandedInput !== "gecl4" && (
        <div style={{ paddingTop: 20 }}>
          <svg viewBox={`0 0 ${compW} 140`} preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", height: "auto" }}>
            <text x={compW / 2} y={16} textAnchor="middle" fontFamily="'Courier New', monospace" fontSize={11} fontWeight={600} letterSpacing="0.12em" fill="rgba(255,255,255,0.35)">INPUTS</text>
            {[
              { x: compW / 2 - 180, label: "GeCl\u2084", sub: "4 suppliers", clickable: true },
              { x: compW / 2, label: "Helium", sub: "4 sources", clickable: false },
              { x: compW / 2 + 180, label: "Silica / SiCl\u2084", sub: "4 suppliers", clickable: false },
            ].map((cat, i) => {
              const y1 = 95; const y2 = 140; const midY = (y1 + y2) / 2;
              const cx2 = compW / 2;
              return (
                <g key={i} style={{ cursor: cat.clickable ? "pointer" : "default" }} onClick={() => { if (cat.clickable) setExpandedInput("gecl4"); }}>
                  <circle cx={cat.x} cy={48} r={5.5} fill="none" stroke="rgba(155,168,171,0.5)" strokeWidth={1.3} />
                  <text x={cat.x} y={72} textAnchor="middle" fontFamily="'EB Garamond', Georgia, serif" fontSize={13} fontWeight={600} fill="rgba(255,255,255,0.82)">{cat.label}</text>
                  <text x={cat.x} y={88} textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize={8} fill="rgba(255,255,255,0.35)">{cat.sub}</text>
                  <path d={`M ${cat.x},${y1} C ${cat.x},${midY} ${cx2},${midY} ${cx2},${y2}`} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={0.8} strokeDasharray="4,3" />
                </g>
              );
            })}
          </svg>
        </div>
      )}
      {expandedInput === "gecl4" && (
        <>
          <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
            <button onClick={() => setExpandedInput(null)} style={{ fontFamily: "'Geist Mono', monospace", fontSize: 8, color: "#555", background: "none", border: `1px solid ${borderColor}`, borderRadius: 4, padding: "3px 10px", cursor: "pointer" }}>
              Collapse GeCl₄ suppliers ↑
            </button>
          </div>
          <TreeMap geometry={compGeo} nodes={allNodes} layerConfig={lc} svgWidth={compW} svgHeight={compH} onNodeClick={onNodeClick} onLayerClick={() => {}} layerPanels={{}} />
        </>
      )}
      {expandedInput !== "gecl4" && (
        <svg viewBox={`0 0 ${compW} 80`} preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", height: "auto" }}>
          {fiberMfgXs.map((tx, i) => {
            const fx = compW / 2;
            return <path key={i} d={`M ${fx},0 C ${fx},40 ${tx},40 ${tx},80`} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={0.8} strokeDasharray="4,3" />;
          })}
        </svg>
      )}
      {expandedInput !== "gecl4" && (
        <TreeMap geometry={compGeoCompact} nodes={allNodes} layerConfig={lc} svgWidth={compW} svgHeight={compHCompact} onNodeClick={onNodeClick} onLayerClick={() => {}} layerPanels={{}} />
      )}
      <svg viewBox={`0 0 ${subW} 80`} preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", height: "auto" }}>
        {subFirstXs.map((tx, i) => { const fx = subW / 2; return <path key={i} d={`M ${fx},0 C ${fx},40 ${tx},40 ${tx},80`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" strokeDasharray="4,3" />; })}
      </svg>
      <TreeMap geometry={subGeo} nodes={allNodes} layerConfig={lc} svgWidth={subW} svgHeight={subH} onNodeClick={onNodeClick} onLayerClick={() => {}} layerPanels={{}} />
    </>
  );

  return (
    <>
      <div style={{ border: `1px solid ${borderColor}`, borderRadius: "10px", overflow: "hidden", background: "#131210", position: "relative" as const }}>
        <button
          onClick={() => setTreeExpanded(true)}
          style={{
            position: "absolute" as const, top: 12, right: 12, zIndex: 5,
            fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: "0.04em",
            color: "#555", background: "rgba(19,18,16,0.8)", border: `1px solid ${borderColor}`,
            borderRadius: 6, padding: "5px 12px", cursor: "pointer",
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = warmWhite; e.currentTarget.style.borderColor = "#3a3835"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = borderColor; }}
        >
          Expand ↗
        </button>
        {renderTreeContent()}
      </div>
      {treeExpanded && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "#111", overflow: "auto",
          display: "flex", flexDirection: "column" as const,
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 28px", borderBottom: `1px solid ${borderColor}`, flexShrink: 0,
          }}>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: dimText }}>
              FIBER OPTIC CABLE · SUPPLY TREE
            </span>
            <button
              onClick={() => setTreeExpanded(false)}
              style={{
                fontFamily: "'Geist Mono', monospace", fontSize: 9,
                color: "#555", background: "none", border: `1px solid ${borderColor}`,
                borderRadius: 6, padding: "5px 12px", cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = warmWhite; e.currentTarget.style.borderColor = "#3a3835"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = borderColor; }}
            >
              Close ✕
            </button>
          </div>
          <div style={{ flex: 1, padding: "20px" }}>
            {renderTreeContent()}
          </div>
        </div>
      )}
    </>
  );
}

/* Gallium has its own inline node modal */
function GalliumNodeModal({ selectedNode, setSelectedNode, accent }: {
  selectedNode: string | null;
  setSelectedNode: (v: string | null) => void;
  accent: string;
}) {
  const galliumNodes = galliumNodesJson as unknown as Record<string, NodeData>;
  if (!selectedNode || !galliumNodes[selectedNode]) return null;
  const node = galliumNodes[selectedNode];
  return (
    <div
      onClick={() => setSelectedNode(null)}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 560, maxHeight: "75vh", background: "rgb(36, 36, 36)",
          border: "1px solid #252220", borderRadius: 12,
          display: "flex", flexDirection: "column" as const,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "24px 28px 20px", flexShrink: 0, borderBottom: "1px solid #252220" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: 9, letterSpacing: "0.1em", color: accent, margin: "0 0 8px 0", textTransform: "uppercase" as const }}>{node.type}</p>
              <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: "#ece8e1", margin: "0 0 4px 0", fontWeight: 400 }}>{selectedNode}</p>
              <p style={{ fontSize: 11, color: "#706a60", margin: 0 }}>{node.loc}</p>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: 18, padding: "0 0 0 12px", lineHeight: 1 }}
            >{"\u2715"}</button>
          </div>
          <div style={{ display: "flex", marginTop: 16, gap: 0, borderTop: "1px solid #252220", paddingTop: 14, flexWrap: "wrap" as const }}>
            {node.stats.map((s: [string, string], si: number) => (
              <div key={si} style={{ flex: "1 1 25%", minWidth: 100, display: "flex", flexDirection: "column" as const, gap: 4, borderLeft: si > 0 ? "1px solid #252220" : "none", paddingLeft: si > 0 ? 14 : 0, paddingBottom: 8 }}>
                <span style={{ fontSize: 9, letterSpacing: "0.1em", color: "#555", textTransform: "uppercase" as const }}>{s[0]}</span>
                <span style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500 }}>{s[1]}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" as const, padding: "24px 28px" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "#555", margin: "0 0 10px 0", textTransform: "uppercase" as const }}>Role in chain</p>
          <p style={{ fontSize: 13, color: "#c4bdb2", lineHeight: 1.7, margin: "0 0 20px 0" }}>{node.role}</p>
          <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "#555", margin: "0 0 10px 0", textTransform: "uppercase" as const }}>Investment relevance</p>
          <p style={{ fontSize: 13, color: "#c4bdb2", lineHeight: 1.7, margin: "0 0 20px 0" }}>{node.inv}</p>
          <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "#555", margin: "0 0 10px 0", textTransform: "uppercase" as const }}>Key risk</p>
          <p style={{ fontSize: 12, color: "#8a5a4a", margin: 0 }}>{node.risk}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN TEMPLATE
   ═══════════════════════════════════════════════════ */

export default function InputPageTemplate({ data }: { data: InputPageData }) {
  const [soWhatOpen, setSoWhatOpen] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("thesis");
  const [activeIdea, setActiveIdea] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [treeExpanded, setTreeExpanded] = useState(false);

  const accent = data.accent;
  const calloutAccent = data.calloutAccent ?? accent;
  const warmWhite = "#ece8e1";
  const muted = "#706a60";
  const dimText = "#555";
  const dimmer = "#4a4540";
  const cardBg = "#1a1816";
  const borderColor = "#252220";

  // Scroll spy
  React.useEffect(() => {
    const ids = ["thesis", "supply-tree", "dependencies", "supply-demand", "so-what", "money", "catalysts", "risk"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIdea(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* ── breadcrumbs (dynamic from URL param) ── */
  const crumbs = (() => {
    if (typeof window === "undefined") return data.breadcrumbs.default;
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    if (from === "resources" && data.breadcrumbs.resources) return data.breadcrumbs.resources;
    return data.breadcrumbs.default;
  })();

  /* ── node modal helper for germanium / fiber (which use NodeModal component) ── */
  const allNodesForModal = data.treeComponentId === "fiber"
    ? (nodesJson as unknown as Record<string, NodeData>)
    : data.treeComponentId === "germanium"
      ? (germaniumNodesJson as unknown as Record<string, NodeData>)
      : null;
  const chainLabelForModal = data.treeComponentId === "fiber"
    ? "GeO₂ / GeCl₄ Supply Tree"
    : data.treeComponentId === "germanium"
      ? "Germanium Supply Tree"
      : "";

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      background: "#111",
      fontFamily: "'DM Sans', sans-serif",
      color: "#908880",
    }}>
      {/* Header */}
      <div style={{
        height: 42, flexShrink: 0,
        background: "#131210", borderBottom: "1px solid #252220",
        display: "flex", alignItems: "center", paddingLeft: 16,
      }}>
        <button onClick={() => window.history.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center" }}>
          <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 11, fontWeight: 300, letterSpacing: "0.04em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.5)" }}>Stillpoint</span>
          <span style={{ width: 5, display: "inline-block" }} />
          <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 11, fontWeight: 200, letterSpacing: "0.04em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.22)" }}>Intelligence</span>
        </button>
      </div>

      {/* Table of contents — fixed left */}
      <nav style={{
        position: "fixed", top: 120, left: 32, zIndex: 10,
        display: "flex", flexDirection: "column" as const, gap: 12,
      }}>
        <style>{`@media (max-width: 1399px) { .toc-nav { display: none !important; } }`}</style>
        {[
          { id: "thesis", label: "Thesis" },
          { id: "supply-tree", label: "Supply tree" },
          { id: "dependencies", label: "Dependencies" },
          { id: "supply-demand", label: "Supply \u2192 Demand" },
          { id: "so-what", label: "So what" },
          { id: "money", label: "Where the money is" },
          { id: "catalysts", label: "Catalysts" },
          { id: "risk", label: "Risk" },
        ].map((s) => (
          <div
            key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="toc-nav"
            style={{
              display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
            }}
          >
            <div style={{
              width: 2, height: 14,
              background: activeSection === s.id ? "#555" : "transparent",
              borderRadius: 1, transition: "background 0.2s",
            }} />
            <span style={{
              fontSize: 10, letterSpacing: "0.04em",
              color: activeSection === s.id ? "#ece8e1" : "#3a3835",
              transition: "color 0.2s",
            }}>
              {s.label}
            </span>
          </div>
        ))}
        {/* Connected inputs */}
        <div style={{ height: 1, background: "#252220", margin: "20px 0 24px 12px", width: 100 }} />
        {data.connectedInputs.upstream && data.connectedInputs.upstream.length > 0 && (
          <>
            <p style={{ fontSize: 9, letterSpacing: "0.06em", color: "#555", margin: "0 0 8px 12px" }}>Upstream</p>
            {data.connectedInputs.upstream.map((item, i) => (
              <div key={`u${i}`} onClick={() => { if (item.linked) window.location.href = item.href; }}
                style={{ display: "flex", alignItems: "center", padding: "1px 0 1px 12px", cursor: item.linked ? "pointer" : "default" }}>
                <span style={{ fontSize: 10, color: item.linked ? "#a09888" : "#4a4540", transition: "color 0.15s" }}
                  onMouseEnter={e => { if (item.linked) e.currentTarget.style.color = "#ece8e1"; }}
                  onMouseLeave={e => { if (item.linked) e.currentTarget.style.color = "#a09888"; }}>
                  {item.name}
                </span>
                {item.linked && <span style={{ fontSize: 10, color: "#4a4540", marginLeft: 6 }}>&rarr;</span>}
              </div>
            ))}
          </>
        )}
        {data.connectedInputs.downstream && data.connectedInputs.downstream.length > 0 && (
          <>
            <p style={{ fontSize: 9, letterSpacing: "0.06em", color: "#555", margin: data.connectedInputs.upstream ? "16px 0 8px 12px" : "0 0 8px 12px" }}>Downstream</p>
            {data.connectedInputs.downstream.map((item, i) => (
              <div key={`d${i}`} onClick={() => { if (item.linked) window.location.href = item.href; }}
                style={{ display: "flex", alignItems: "center", padding: "1px 0 1px 12px", cursor: item.linked ? "pointer" : "default" }}>
                <span style={{ fontSize: 10, color: item.linked ? "#a09888" : "#4a4540", transition: "color 0.15s" }}
                  onMouseEnter={e => { if (item.linked) e.currentTarget.style.color = "#ece8e1"; }}
                  onMouseLeave={e => { if (item.linked) e.currentTarget.style.color = "#a09888"; }}>
                  {item.name}
                </span>
                {item.linked && <span style={{ fontSize: 10, color: "#4a4540", marginLeft: 6 }}>&rarr;</span>}
              </div>
            ))}
          </>
        )}
      </nav>

      {/* Page content — single column */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 32px 80px" }}>

        {/* BREADCRUMB */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, flexWrap: "wrap" as const }}>
          {crumbs.map((bc, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {i > 0 && <span style={{ fontSize: 11, color: "#4a4540" }}>/</span>}
              <span onClick={() => { window.location.href = bc.href; }} style={{ fontSize: 11, color: "#4a4540", cursor: "pointer", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#a09888")}
                onMouseLeave={e => (e.currentTarget.style.color = "#4a4540")}
              >{bc.label}</span>
            </span>
          ))}
          <span style={{ fontSize: 11, color: "#4a4540" }}>/</span>
          <span style={{ fontSize: 11, color: "#a09888" }}>{data.title}</span>
        </div>

        {/* THESIS / EXEC SUMMARY */}
        <div id="thesis" style={{ marginBottom: "56px" }}>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "28px",
            fontWeight: 400,
            color: warmWhite,
            margin: "0 0 24px 0",
            lineHeight: 1.2,
          }}>
            {data.title}
          </h1>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 20, letterSpacing: "0.1em", color: "#555", margin: "0 0 16px 0" }}>EXECUTIVE SUMMARY</p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {data.execSummary.bullets.map((point, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 7 }} />
                  <p style={{ fontSize: 13.5, color: "#a09888", lineHeight: 1.4, margin: 0, fontWeight: 300 }}>{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SUPPLY TREE */}
        <div id="supply-tree" style={{ marginBottom: "56px", paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>
            SUPPLY TREE
          </p>
          {/* Key Takeaways */}
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "10px", padding: "24px 28px", marginBottom: 32 }}>
            <p style={{ fontSize: "9px", letterSpacing: "0.1em", color: dimText, margin: "0 0 10px 0" }}>KEY TAKEAWAYS</p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 0 }}>
              {data.supplyTree.keyTakeaways.map((text, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, color: "#706a60", flexShrink: 0, minWidth: 16 }}>{i + 1}.</span>
                  <p style={{ fontSize: 12.5, color: "#a09888", lineHeight: 1.6, margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tree visualization */}
          {data.treeComponentId === "germanium" && (
            <GermaniumTree onNodeClick={setSelectedNode} treeExpanded={treeExpanded} setTreeExpanded={setTreeExpanded} warmWhite={warmWhite} borderColor={borderColor} dimText={dimText} />
          )}
          {data.treeComponentId === "gallium" && (
            <GalliumTree onNodeClick={setSelectedNode} />
          )}
          {data.treeComponentId === "fiber" && (
            <FiberTree onNodeClick={setSelectedNode} treeExpanded={treeExpanded} setTreeExpanded={setTreeExpanded} warmWhite={warmWhite} borderColor={borderColor} dimText={dimText} />
          )}

          {/* How It's Made cards */}
          <div style={{ display: "flex", gap: "12px", marginTop: 32 }}>
            {data.supplyTree.howItsMade.map((card, i) => (
              <div key={i} style={{
                flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
                borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
              }}>
                <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                  {card.label}
                </p>
                <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 14px 0" }}
                  dangerouslySetInnerHTML={{ __html: card.content }}
                />
                <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHY IT&apos;S HARD</p>
                <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 0 0", flex: 1 }}
                  dangerouslySetInnerHTML={{ __html: card.whyItsHard }}
                />
                <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #222018" }}>
                  <span style={{ fontSize: "12px", color: warmWhite, fontWeight: 500 }}>{card.statValue}</span>
                  <span style={{ fontSize: "9px", color: dimText, marginLeft: "6px" }}>{card.statLabel}</span>
                </div>
              </div>
            ))}
          </div>

          {data.supplyTree.treeFooterText && (
            <p style={{ fontSize: 11, color: "#706a60", lineHeight: 1.6, margin: "20px 0 0 0" }}
              dangerouslySetInnerHTML={{ __html: data.supplyTree.treeFooterText }}
            />
          )}
        </div>

        {/* Gallium inline node modal */}
        {data.treeComponentId === "gallium" && (
          <GalliumNodeModal selectedNode={selectedNode} setSelectedNode={setSelectedNode} accent={accent} />
        )}

        {/* DEPENDENCIES */}
        <div id="dependencies" style={{ paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: "#555", margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>DEPENDENCIES</p>

          {/* Upstream table */}
          {data.dependencies.upstream && (
            <div style={{ marginBottom: 48 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", margin: "0 0 20px 0" }}>{data.dependencies.upstream.label}</p>
              <div style={{ display: "flex", padding: "0 0 10px 0", borderBottom: "1px solid #252220" }}>
                {data.dependencies.upstream.headers.map(h => (
                  <p key={h.label} style={{ fontSize: 9, letterSpacing: "0.06em", color: "#4a4540", margin: 0, width: h.width, textAlign: h.right ? "right" as const : undefined }}>{h.label}</p>
                ))}
              </div>
              {data.dependencies.upstream.rows.map((row, i) => {
                const keys = data.dependencies.upstream!.headers.map(h => h.label);
                const firstKey = keys[0];
                const isLinked = row.linked === true || row.linked === "true";
                return (
                  <div key={i} style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: "1px solid #252220", cursor: isLinked ? "pointer" : "default", transition: "background 0.15s" }}
                    onMouseEnter={e => { if (isLinked) { e.currentTarget.style.background = "#1a1816"; const n = e.currentTarget.querySelector("[data-name]") as HTMLElement; if (n) n.style.color = "#ece8e1"; } }}
                    onMouseLeave={e => { if (isLinked) { e.currentTarget.style.background = "transparent"; const n = e.currentTarget.querySelector("[data-name]") as HTMLElement; if (n) n.style.color = "#a09888"; } }}
                    onClick={() => { if (isLinked && row.href) window.location.href = row.href as string; }}
                  >
                    {data.dependencies.upstream!.headers.map((h, hi) => {
                      const val = row[h.label] as string || "";
                      if (hi === 0) {
                        return (
                          <div key={h.label} style={{ width: h.width, display: "flex", alignItems: "baseline", gap: 6 }}>
                            <p data-name="" style={{ fontSize: 12, color: "#a09888", fontWeight: 500, margin: 0, transition: "color 0.15s" }}>{val}</p>
                            {isLinked && <span style={{ fontSize: 10, color: "#4a4540" }}>→</span>}
                          </div>
                        );
                      }
                      const lastHeader = data.dependencies.upstream!.headers[data.dependencies.upstream!.headers.length - 1];
                      const isStatus = h.label === lastHeader.label && lastHeader.right;
                      if (isStatus) {
                        return (
                          <p key={h.label} style={{ fontSize: 11, fontWeight: 500, margin: 0, width: h.width, textAlign: h.right ? "right" as const : undefined, color: val.startsWith("Constrained") || val.startsWith("Surging") ? "#8a5a4a" : val.startsWith("Tightening") || val.startsWith("Growing") || val.startsWith("Ramping") ? "#8a7a3a" : val.startsWith("Available") || val.startsWith("Stable") ? "#4a7a4a" : "#4a4540" }}>{val}</p>
                        );
                      }
                      return (
                        <p key={h.label} style={{ fontSize: 11, color: h.label === firstKey ? "#a09888" : "#706a60", margin: 0, width: h.width, lineHeight: 1.5 }}>{val}</p>
                      );
                    })}
                  </div>
                );
              })}
              {data.dependencies.upstream.summaryRows?.map((sr, i) => (
                <div key={`sr${i}`} style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: i === 0 ? "1px solid #252220" : undefined }}>
                  <p style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, margin: 0, width: data.dependencies.upstream!.headers[0].width }}>{sr.label}</p>
                  {sr.values.map((v, vi) => (
                    <p key={vi} style={{ fontSize: 11, color: "#ece8e1", fontWeight: 500, margin: 0, width: data.dependencies.upstream!.headers[vi + 1]?.width || "auto" }}>{v}</p>
                  ))}
                </div>
              ))}
              <div style={{ borderTop: "1px solid #252220", paddingTop: 14, marginTop: 4 }}>
                <p style={{ fontSize: 11, color: "#706a60", lineHeight: 1.6, margin: 0 }}>{data.dependencies.upstream.takeaway}</p>
              </div>
            </div>
          )}

          {/* Downstream table */}
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", margin: "0 0 20px 0" }}>{data.dependencies.downstream.label}</p>
            <div style={{ display: "flex", padding: "0 0 10px 0", borderBottom: "1px solid #252220" }}>
              {data.dependencies.downstream.headers.map(h => (
                <p key={h.label} style={{ fontSize: 9, letterSpacing: "0.06em", color: "#4a4540", margin: 0, width: h.width, textAlign: h.right ? "right" as const : undefined }}>{h.label}</p>
              ))}
            </div>
            {data.dependencies.downstream.rows.map((row, i) => {
              const keys = data.dependencies.downstream.headers.map(h => h.label);
              const firstKey = keys[0];
              const isLinked = row.linked === true || row.linked === "true";
              return (
                <div key={i} style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: "1px solid #252220", cursor: isLinked ? "pointer" : "default", transition: "background 0.15s" }}
                  onMouseEnter={e => { if (isLinked) { e.currentTarget.style.background = "#1a1816"; const n = e.currentTarget.querySelector("[data-name]") as HTMLElement; if (n) n.style.color = "#ece8e1"; } }}
                  onMouseLeave={e => { if (isLinked) { e.currentTarget.style.background = "transparent"; const n = e.currentTarget.querySelector("[data-name]") as HTMLElement; if (n) n.style.color = "#a09888"; } }}
                  onClick={() => { if (isLinked && row.href) window.location.href = row.href as string; }}
                >
                  {data.dependencies.downstream.headers.map((h, hi) => {
                    const val = row[h.label] as string || "";
                    if (hi === 0) {
                      return (
                        <div key={h.label} style={{ width: h.width, display: "flex", alignItems: "baseline", gap: 6 }}>
                          <p data-name="" style={{ fontSize: 12, color: "#a09888", fontWeight: 500, margin: 0, transition: "color 0.15s" }}>{val}</p>
                          {isLinked && <span style={{ fontSize: 10, color: "#4a4540" }}>&rarr;</span>}
                        </div>
                      );
                    }
                    const lastHeader = data.dependencies.downstream.headers[data.dependencies.downstream.headers.length - 1];
                    const isStatus = h.label === lastHeader.label && lastHeader.right;
                    if (isStatus) {
                      return (
                        <p key={h.label} style={{ fontSize: 10, fontWeight: 500, margin: 0, width: h.width, textAlign: h.right ? "right" as const : undefined, color: val.startsWith("Surging") ? "#8a5a4a" : val.startsWith("Growing") || val.startsWith("Ramping") ? "#8a7a3a" : val.startsWith("Stable") ? "#4a7a4a" : "#4a4540" }}>{val}</p>
                      );
                    }
                    return (
                      <p key={h.label} style={{ fontSize: 11, color: h.label === firstKey ? "#a09888" : "#706a60", margin: 0, width: h.width, lineHeight: 1.5 }}>{val}</p>
                    );
                  })}
                </div>
              );
            })}
            {data.dependencies.downstream.totalRow && (
              <div style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: "1px solid #252220" }}>
                {data.dependencies.downstream.headers.map((h) => {
                  const val = (data.dependencies.downstream.totalRow as DependencyRow)[h.label] as string || "";
                  return (
                    <p key={h.label} style={{ fontSize: val ? 11 : undefined, color: val ? "#ece8e1" : undefined, fontWeight: val ? 500 : undefined, margin: 0, width: h.width, textAlign: h.right ? "right" as const : undefined }}>{val}</p>
                  );
                })}
              </div>
            )}
            {data.dependencies.downstream.note && (
              <div style={{ paddingTop: 14, marginTop: 4 }}>
                <p style={{ fontSize: 10.5, color: "#706a60", lineHeight: 1.6, margin: "0 0 14px 0", fontStyle: "italic" }}>{data.dependencies.downstream.note}</p>
              </div>
            )}
            <div style={{ paddingTop: data.dependencies.downstream.note ? 0 : 14, marginTop: data.dependencies.downstream.note ? 0 : 4 }}>
              <p style={{ fontSize: 11, color: "#706a60", lineHeight: 1.6, margin: 0 }}>{data.dependencies.downstream.takeaway}</p>
            </div>
          </div>
        </div>

        {/* SUPPLY → DEMAND */}
        <div id="supply-demand" style={{ marginBottom: "56px", paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>
            SUPPLY &rarr; DEMAND
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1, background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "10px", padding: "20px 22px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: dimText, margin: "0 0 10px 0" }}>SUPPLY</p>
              <p style={{ fontSize: "22px", fontWeight: 500, color: warmWhite, margin: "0 0 8px 0" }}>{data.supplyDemand.supply.value}</p>
              <p style={{ fontSize: "11.5px", color: "#a09888", margin: 0, lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: data.supplyDemand.supply.analysis }}
              />
            </div>
            <div style={{ flex: 1, background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "10px", padding: "20px 22px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: dimText, margin: "0 0 10px 0" }}>DEMAND</p>
              <p style={{ fontSize: "22px", fontWeight: 500, color: warmWhite, margin: "0 0 8px 0" }}>{data.supplyDemand.demand.value}</p>
              <p style={{ fontSize: "11.5px", color: "#a09888", margin: 0, lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: data.supplyDemand.demand.analysis }}
              />
            </div>
            <div style={{ flex: 1, background: data.treeComponentId === "fiber" ? "#161a1e" : "#1a1810", border: `1px solid ${accent}33`, borderRadius: "10px", padding: "20px 22px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 10px 0", opacity: 0.7 }}>GAP</p>
              <p style={{ fontSize: "22px", fontWeight: 500, color: accent, margin: "0 0 8px 0" }}>{data.supplyDemand.gap.value}</p>
              <p style={{ fontSize: "11.5px", color: "#a09888", margin: 0, lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: data.supplyDemand.gap.analysis }}
              />
            </div>
          </div>
        </div>

        {/* SO WHAT */}
        <div id="so-what" style={{ paddingTop: 20 }}>
          <div style={{ marginBottom: "56px" }}>
            <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>SO WHAT</p>
            <div style={{ display: "flex", flexDirection: "column" as const }}>
              {data.soWhat.map((block, i) => {
                const isOpen = soWhatOpen === block.id;
                const body = "#a09888";
                const analysisBg = "#141210";
                return (
                  <div key={block.id}>
                    <div
                      onClick={() => setSoWhatOpen(isOpen ? null : block.id)}
                      style={{ display: "flex", alignItems: "stretch", cursor: "pointer", padding: "20px 0", borderTop: i > 0 ? `1px solid ${borderColor}` : "none" }}
                    >
                      <div style={{ minWidth: 180, maxWidth: 180, display: "flex", flexDirection: "column" as const, justifyContent: "center", gap: 4, paddingRight: 20, flexShrink: 0 }}>
                        <p style={{ fontSize: 12, color: isOpen ? warmWhite : body, fontWeight: 500, margin: 0, lineHeight: 1.3, transition: "color 0.15s" }}>{block.label}</p>
                        <p style={{ fontSize: 11, color: isOpen ? muted : dimText, margin: 0, fontStyle: "italic", lineHeight: 1.3, transition: "color 0.15s" }}>{block.question}</p>
                      </div>
                      <div style={{ width: 1, background: borderColor, flexShrink: 0, alignSelf: "stretch" }} />
                      <div style={{ flex: 1, paddingLeft: 20, display: "flex", alignItems: "center" }}>
                        <p style={{ fontSize: 12, color: muted, lineHeight: 1.6, margin: 0 }}>{block.teaser}</p>
                      </div>
                      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", marginLeft: 16 }}>
                        <span style={{ fontSize: 14, color: isOpen ? body : "#444", transition: "transform 0.2s, color 0.15s", transform: isOpen ? "rotate(90deg)" : "none", display: "inline-block", lineHeight: 1 }}>{"\u203A"}</span>
                      </div>
                    </div>
                    {isOpen && (
                      <div style={{ background: analysisBg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: "28px 32px", marginBottom: 8, marginTop: -4 }}>
                        <p style={{ fontSize: 9, letterSpacing: "0.1em", color: dimText, margin: "0 0 20px 0" }}>ANALYSIS</p>
                        {block.analysis.map((item, j) => {
                          if (item.type === "prose") return <p key={j} style={{ fontSize: 13, color: body, lineHeight: 1.75, margin: "0 0 16px 0" }}>{item.text}</p>;
                          if (item.type === "subhead") return <p key={j} style={{ fontSize: 12, color: warmWhite, fontWeight: 500, margin: j === 0 ? "0 0 10px 0" : "24px 0 10px 0" }}>{item.text}</p>;
                          if (item.type === "quote") return (<div key={j} style={{ borderLeft: `1px solid ${borderColor}`, paddingLeft: 16, margin: "20px 0" }}><p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 16, color: warmWhite, lineHeight: 1.5, margin: "0 0 6px 0", fontStyle: "italic" }}>{"\u201C"}{item.text}{"\u201D"}</p><p style={{ fontSize: 10, color: dimmer, margin: 0 }}>&mdash; {item.author}</p></div>);
                          if (item.type === "callout") return (<div key={j} style={{ borderLeft: `2px solid ${calloutAccent}50`, paddingLeft: 16, margin: "20px 0 0 0" }}><p style={{ fontSize: 12.5, color: body, lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{item.text}</p></div>);
                          if (item.type === "item") return (<div key={j} style={{ margin: j === 0 ? "0 0 18px 0" : "18px 0" }}><p style={{ fontSize: 12.5, color: warmWhite, fontWeight: 500, margin: "0 0 4px 0" }}>{item.name}</p><p style={{ fontSize: 12.5, color: muted, lineHeight: 1.7, margin: 0 }}>{item.desc}</p></div>);
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{ borderTop: `1px solid ${borderColor}` }} />
            </div>
          </div>
        </div>

        {/* WHERE THE MONEY IS */}
        <div id="money" style={{ marginBottom: "56px", paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>
            WHERE THE MONEY IS
          </p>
          <div style={{ display: "flex", flexDirection: "column" as const }}>
            {data.wtmi.layers.map((layer, li) => (
              <React.Fragment key={layer.label}>
                <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: dimText, margin: li === 0 ? "0 0 8px 0" : "24px 0 8px 0" }}>{layer.label}</p>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                  {layer.ideas.map(idea => (
                    <div key={idea.id} style={{ display: "flex", background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: "10px 20px", transition: "border-color 0.15s", cursor: data.wtmi.briefs[idea.id] ? "pointer" : "default" }}
                      onClick={() => { if (data.wtmi.briefs[idea.id]) setActiveIdea(idea.id); }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#333"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
                    >
                      <div style={{ width: 180, flexShrink: 0, paddingRight: 20, display: "flex", flexDirection: "column" as const, justifyContent: "center" }}>
                        <p style={{ fontSize: 13.5, color: warmWhite, fontWeight: 500, margin: "0 0 3px 0" }}>{idea.name}</p>
                        <p style={{ fontSize: 10.5, color: muted, margin: "0 0 6px 0", letterSpacing: "0.02em" }}>{idea.ticker}</p>
                        <p style={{ fontSize: 9, color: dimText, letterSpacing: "0.06em", margin: 0, textTransform: "uppercase" as const }}>{idea.category}</p>
                      </div>
                      <div style={{ width: 1, background: "#2a2620", flexShrink: 0, marginRight: 20 }} />
                      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                        <p style={{ fontSize: 12, color: "#c4bdb2", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{idea.line1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* CATALYSTS */}
        <div id="catalysts" style={{ marginBottom: 56, paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>CATALYSTS</p>
          {[
            { label: "NEAR-TERM (NEXT 6 MONTHS)", items: data.catalysts.nearTerm },
            { label: "MEDIUM-TERM (6-12 MONTHS)", items: data.catalysts.mediumTerm },
            { label: "LONG-TERM (12+ MONTHS)", items: data.catalysts.longTerm },
          ].map((group, gi) => (
            <div key={gi} style={{ marginBottom: gi < 2 ? 28 : 0 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.08em", color: accent, margin: "0 0 14px 0", fontWeight: 500 }}>{group.label}</p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                {group.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: 12.5, color: warmWhite, fontWeight: 500, flexShrink: 0 }}>{item.date}</span>
                    <span style={{ fontSize: 12.5, color: dimmer }}>&mdash;</span>
                    <span style={{ fontSize: 12.5, color: muted }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* RISK */}
        <div id="risk" style={{ marginBottom: 56, paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>RISK</p>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.08em", color: "#4a4540", margin: "0 0 14px 0" }}>WHAT COULD EASE SUPPLY</p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                {data.risk.easeSupply.map((item, i) => (
                  <div key={i}>
                    <p style={{ fontSize: 12.5, color: warmWhite, fontWeight: 500, margin: "0 0 4px 0" }}>{item.risk}</p>
                    <p style={{ fontSize: 11.5, color: muted, lineHeight: 1.6, margin: 0 }}>{item.assessment}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ width: 1, background: borderColor, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.08em", color: "#4a4540", margin: "0 0 14px 0" }}>WHAT COULD SOFTEN DEMAND</p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                {data.risk.softenDemand.map((item, i) => (
                  <div key={i}>
                    <p style={{ fontSize: 12.5, color: warmWhite, fontWeight: 500, margin: "0 0 4px 0" }}>{item.risk}</p>
                    <p style={{ fontSize: 11.5, color: muted, lineHeight: 1.6, margin: 0 }}>{item.assessment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: 16, marginTop: 20 }}>
            <p style={{ fontSize: 12, color: muted, lineHeight: 1.6, margin: 0 }} dangerouslySetInnerHTML={{ __html: data.risk.bottomLine }} />
          </div>
        </div>

        {/* Node modal (germanium / fiber) */}
        {allNodesForModal && (
          <NodeModal
            nodeKey={selectedNode}
            allNodes={allNodesForModal}
            layers={[]}
            chainLabel={chainLabelForModal}
            onClose={() => setSelectedNode(null)}
            onNavigate={() => {}}
          />
        )}

        {/* Idea brief modal */}
        {activeIdea && data.wtmi.briefs[activeIdea] && (() => {
          const brief = data.wtmi.briefs[activeIdea];
          return (
            <div
              onClick={() => setActiveIdea(null)}
              style={{
                position: "fixed", inset: 0, zIndex: 200,
                background: "rgba(0,0,0,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  width: 720, maxHeight: "85vh", background: "rgb(36, 36, 36)",
                  border: "1px solid #252220", borderRadius: 12,
                  display: "flex", flexDirection: "column" as const,
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "24px 28px 20px", flexShrink: 0, borderBottom: "1px solid #252220" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: 9, letterSpacing: "0.1em", color: "#555", margin: "0 0 8px 0", textTransform: "uppercase" as const }}>{brief.category}</p>
                      <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, color: "#ece8e1", margin: "0 0 4px 0", fontWeight: 400 }}>{brief.name}</p>
                      <p style={{ fontSize: 11, color: "#706a60", margin: 0 }}>{brief.ticker}</p>
                    </div>
                    <button
                      onClick={() => setActiveIdea(null)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "#555", fontSize: 18, padding: "0 0 0 12px", lineHeight: 1,
                      }}
                    >
                      {"\u2715"}
                    </button>
                  </div>
                  {brief.metrics.length > 0 && (
                    <div style={{
                      display: "flex", marginTop: 20, gap: 0,
                      borderTop: "1px solid #252220", paddingTop: 14,
                    }}>
                      {brief.metrics.map((m, mi) => (
                        <div key={mi} style={{
                          flex: 1, display: "flex", flexDirection: "column" as const, gap: 4,
                          borderLeft: mi > 0 ? "1px solid #252220" : "none",
                          paddingLeft: mi > 0 ? 16 : 0,
                        }}>
                          <span style={{ fontSize: 9, letterSpacing: "0.1em", color: "#555", textTransform: "uppercase" as const }}>{m.label}</span>
                          <span style={{ fontSize: 13, color: "#ece8e1", fontWeight: 500 }}>{m.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, overflowY: "auto" as const, padding: "24px 28px" }}>
                  {brief.sections.map((section, si) => (
                    <div key={si} style={{ marginBottom: si < brief.sections.length - 1 ? 28 : 0 }}>
                      <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "#555", margin: "0 0 14px 0", textTransform: "uppercase" as const }}>{section.label}</p>
                      {section.items.map((item, ii) => (
                        item.title ? (
                          <div key={ii} style={{ marginBottom: 14 }}>
                            <p style={{ fontSize: 12.5, color: "#ece8e1", fontWeight: 500, margin: "0 0 3px 0" }}>{item.title}</p>
                            <p style={{ fontSize: 12.5, color: "#a09888", lineHeight: 1.65, margin: 0 }}>{item.text}</p>
                          </div>
                        ) : (
                          <p key={ii} style={{ fontSize: 13, color: "#c4bdb2", lineHeight: 1.7, margin: ii < section.items.length - 1 ? "0 0 14px 0" : "0" }}>{item.text}</p>
                        )
                      ))}
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid #252220", marginTop: 24, paddingTop: 16 }}>
                    <p style={{ fontSize: 10, color: "#4a4540", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>{brief.disclaimer}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
