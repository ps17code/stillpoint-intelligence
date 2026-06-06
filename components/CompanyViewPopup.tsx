"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import germaniumInputJson from "@/data/inputs/germanium.json";

/* Renamed section headers for the investment brief (by order) */
const BRIEF_SECTION_TITLES = ["Why it matters", "How value flows", "Key numbers", "What to watch", "Investment angle"];

type WtmiBrief = {
  name: string; ticker: string; category: string;
  metrics: { label: string; value: string }[];
  sections: { label: string; items: { title?: string; text: string }[] }[];
  disclaimer?: string;
};
const UMICORE_BRIEF = (germaniumInputJson as unknown as { wtmi: { briefs: Record<string, WtmiBrief> } }).wtmi.briefs.umicore;

const MONO = "'Geist Mono', monospace";
const SERIF = "'EB Garamond', Georgia, serif";
const warmWhite = "#ece8e1";
const dimText = "rgb(160, 152, 136)";
const borderColor = "rgba(255,255,255,0.06)";
const cardBg = "rgb(30, 30, 30)";
const accent = "#c87a4a";
const groupBg = "rgb(42, 38, 34)";
const lineColor = "rgba(200,200,200,0.15)";
const COMPANY = "Umicore";

type BusinessGroup = { name: string; active: boolean; outputs: string[] };

const BUSINESS_GROUPS: BusinessGroup[] = [
  { name: "Specialty Metals", active: true, outputs: ["GeCl₄", "Germanium Products", "Cobalt Compounds", "Nickel Compounds", "Zinc Chemicals", "Electroplating Chemistry", "Copper Plating Chemistry", "PVD Materials"] },
  { name: "Battery Materials", active: false, outputs: [] },
  { name: "Catalysis", active: false, outputs: [] },
  { name: "Recycling", active: false, outputs: [] },
];

const UPSTREAM = [
  { name: "Primary Supply", role: "Source", inputs: ["Germanium", "Cobalt", "Nickel", "Zinc", "Precious Metals", "Copper / Deposition Feedstocks"] },
  { name: "Byproduct Recovery", role: "Source", inputs: ["Germanium", "Zinc"] },
  { name: "Recycled Streams", role: "Source", inputs: ["Germanium", "Cobalt", "Nickel", "Zinc", "Precious Metals"] },
  { name: "Market Chemical Supply", role: "Source", inputs: ["Copper / Deposition Feedstocks", "Organic Chemical Feedstocks"] },
  { name: "Internal Umicore Streams", role: "Source", inputs: ["Cobalt", "Nickel", "Precious Metals", "Copper / Deposition Feedstocks"] },
];

const ALL_INPUTS = [
  { name: "Germanium", role: "Raw Material" },
  { name: "Cobalt", role: "Raw Material" },
  { name: "Nickel", role: "Raw Material" },
  { name: "Zinc", role: "Raw Material" },
  { name: "Precious Metals", role: "Raw Material" },
  { name: "Copper / Deposition Feedstocks", role: "Raw Material" },
  { name: "Organic Chemical Feedstocks", role: "Raw Material" },
];

const ALL_OUTPUTS = [
  { name: "GeCl₄", role: "Chemical Intermediate", group: "Specialty Metals" },
  { name: "Germanium Products", role: "Refined Material", group: "Specialty Metals" },
  { name: "Cobalt Compounds", role: "Chemical Intermediate", group: "Specialty Metals" },
  { name: "Nickel Compounds", role: "Chemical Intermediate", group: "Specialty Metals" },
  { name: "Zinc Chemicals", role: "Chemical Intermediate", group: "Specialty Metals" },
  { name: "Electroplating Chemistry", role: "Process Chemistry", group: "Specialty Metals" },
  { name: "Copper Plating Chemistry", role: "Process Chemistry", group: "Specialty Metals" },
  { name: "PVD Materials", role: "Deposition Material", group: "Specialty Metals" },
];

const OUTPUT_TO_DOWNSTREAM: Record<string, string[]> = {
  "GeCl₄": ["Fiber Optic Cable", "IR Optics"],
  "Germanium Products": ["IR Optics", "Solar Cells", "Semiconductor Materials"],
  "Cobalt Compounds": ["Battery Cells", "Pigments / Ceramics"],
  "Nickel Compounds": ["Battery Cells", "Rubber Products"],
  "Zinc Chemicals": ["Rubber Products", "Pigments / Ceramics"],
  "Electroplating Chemistry": ["Electronics Plating"],
  "Copper Plating Chemistry": ["Semiconductor Packaging"],
  "PVD Materials": ["Optical Thin Films"],
};

// Which input materials each output is refined from (the path through Umicore)
const OUTPUT_TO_INPUTS: Record<string, string[]> = {
  "GeCl₄": ["Germanium"],
  "Germanium Products": ["Germanium"],
  "Cobalt Compounds": ["Cobalt"],
  "Nickel Compounds": ["Nickel"],
  "Zinc Chemicals": ["Zinc"],
  "Electroplating Chemistry": ["Precious Metals", "Organic Chemical Feedstocks"],
  "Copper Plating Chemistry": ["Copper / Deposition Feedstocks", "Organic Chemical Feedstocks"],
  "PVD Materials": ["Precious Metals", "Copper / Deposition Feedstocks"],
};

const ALL_DOWNSTREAM = [
  { name: "Fiber Optic Cable", role: "Component" },
  { name: "IR Optics", role: "Component" },
  { name: "Solar Cells", role: "Component" },
  { name: "Semiconductor Materials", role: "Intermediate" },
  { name: "Battery Cells", role: "Component" },
  { name: "Pigments / Ceramics", role: "End Product" },
  { name: "Rubber Products", role: "End Product" },
  { name: "Electronics Plating", role: "Process" },
  { name: "Optical Thin Films", role: "Component" },
  { name: "Semiconductor Packaging", role: "Process" },
];

// What each component ends up in (the end product / market)
const DOWNSTREAM_TO_ENDPRODUCT: Record<string, string> = {
  "Fiber Optic Cable": "AI Data Center",
  "IR Optics": "Defense Systems",
  "Solar Cells": "Satellites",
  "Semiconductor Materials": "Semiconductors",
  "Battery Cells": "Electric Vehicles",
  "Pigments / Ceramics": "Coatings",
  "Rubber Products": "Tires",
  "Electronics Plating": "Electronics",
  "Optical Thin Films": "Optical Systems",
  "Semiconductor Packaging": "Chip Packaging",
};

const RELATED_SIGNALS = ["The GeCl₄ Chokepoint", "Germanium Feedstock Constraint", "Western Redundancy Gap"];

type ActiveNode = { layer: string; name: string } | null;

/* Full dependency map (upstream → downstream) for the active node. Umicore is the hub. */
function computeHighlight(active: ActiveNode, visibleOutputs: typeof ALL_OUTPUTS, visibleDownstream: typeof ALL_DOWNSTREAM): Set<string> | null {
  if (!active) return null;
  const set = new Set<string>();
  set.add(active.name);
  set.add(COMPANY);
  if (active.layer === "umicore") {
    UPSTREAM.forEach(u => set.add(u.name));
    ALL_INPUTS.forEach(n => set.add(n.name));
    visibleOutputs.forEach(o => set.add(o.name));
    visibleDownstream.forEach(d => { set.add(d.name); const ep = DOWNSTREAM_TO_ENDPRODUCT[d.name]; if (ep) set.add(ep); });
    return set;
  }

  // Build the directed graph: source → raw material → intermediate → component → end product
  const isInput = (n: string) => ALL_INPUTS.some(ai => ai.name === n);
  const visDown = new Set(visibleDownstream.map(d => d.name));
  const fwd = new Map<string, string[]>();
  const rev = new Map<string, string[]>();
  const addEdge = (a: string, b: string) => {
    (fwd.get(a) ?? fwd.set(a, []).get(a)!).push(b);
    (rev.get(b) ?? rev.set(b, []).get(b)!).push(a);
  };
  UPSTREAM.forEach(u => u.inputs.forEach(inp => { if (isInput(inp)) addEdge(u.name, inp); }));
  visibleOutputs.forEach(o => (OUTPUT_TO_INPUTS[o.name] ?? []).forEach(inp => { if (isInput(inp)) addEdge(inp, o.name); }));
  visibleOutputs.forEach(o => (OUTPUT_TO_DOWNSTREAM[o.name] ?? []).forEach(d => { if (visDown.has(d)) addEdge(o.name, d); }));
  visibleDownstream.forEach(d => { const ep = DOWNSTREAM_TO_ENDPRODUCT[d.name]; if (ep) addEdge(d.name, ep); });

  // Walk both directions from the active node to capture its whole chain
  const walk = (adj: Map<string, string[]>) => {
    const stack = [active.name];
    while (stack.length) {
      const cur = stack.pop()!;
      (adj.get(cur) ?? []).forEach(n => { if (!set.has(n)) { set.add(n); stack.push(n); } });
    }
  };
  walk(fwd);
  walk(rev);
  return set;
}

/* ── Node Card ── */
function TreeNode({ name, role, highlighted, dimmed, selected, clickable, nodeRef, onHoverIn, onHoverOut, onSelect }: {
  name: string; role: string; highlighted?: boolean; dimmed?: boolean; selected?: boolean; clickable?: boolean;
  nodeRef?: React.Ref<HTMLDivElement>;
  onHoverIn?: () => void; onHoverOut?: () => void; onSelect?: () => void;
}) {
  const lit = highlighted || selected;
  return (
    <div
      ref={nodeRef}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
      onClick={clickable && onSelect ? (e) => { e.stopPropagation(); onSelect(); } : undefined}
      style={{
        padding: "5px 8px", background: lit ? groupBg : cardBg,
        border: selected ? `1px solid ${accent}` : lit ? `1px solid ${accent}55` : `1px solid rgb(45, 41, 39)`,
        borderRadius: 4, width: "100%", boxSizing: "border-box",
        cursor: clickable ? "pointer" : "default",
        transition: "border-color 0.15s, opacity 0.15s, background 0.15s",
        opacity: dimmed ? 0.3 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <p style={{ fontSize: 10, fontWeight: 500, color: lit ? warmWhite : dimText, margin: 0, lineHeight: 1.2, fontFamily: SERIF }}>{name}</p>
        {clickable && <span style={{ fontSize: 8, color: "#555" }}>→</span>}
      </div>
      <p style={{ fontSize: 7, color: "#555", margin: "1px 0 0 0", fontFamily: MONO, letterSpacing: "0.04em", textTransform: "uppercase" }}>{role}</p>
    </div>
  );
}

type Edge = { fromRef: React.RefObject<HTMLDivElement | null>; toRef: React.RefObject<HTMLDivElement | null>; from: string; to: string };

/* ── SVG Edge Lines ── */
function EdgeLines({ edges, containerRef, highlightSet }: { edges: Edge[]; containerRef: React.RefObject<HTMLDivElement | null>; highlightSet: Set<string> | null }) {
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; from: string; to: string }[]>([]);

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const box = containerRef.current.getBoundingClientRect();
    const newLines: { x1: number; y1: number; x2: number; y2: number; from: string; to: string }[] = [];
    for (const e of edges) {
      const from = e.fromRef.current;
      const to = e.toRef.current;
      if (!from || !to) continue;
      const fb = from.getBoundingClientRect();
      const tb = to.getBoundingClientRect();
      newLines.push({
        x1: fb.right - box.left,
        y1: fb.top + fb.height / 2 - box.top,
        x2: tb.left - box.left,
        y2: tb.top + tb.height / 2 - box.top,
        from: e.from, to: e.to,
      });
    }
    setLines(newLines);
  }, [edges, containerRef]);

  useEffect(() => {
    measure();
    const timer = setTimeout(measure, 100);
    return () => clearTimeout(timer);
  }, [measure]);

  if (lines.length === 0) return null;
  const active = highlightSet != null;

  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }} width="100%" height="100%">
      {lines.map((l, i) => {
        const midX = (l.x1 + l.x2) / 2;
        const lit = active && highlightSet!.has(l.from) && highlightSet!.has(l.to);
        const stroke = active ? (lit ? accent : "rgba(200,200,200,0.04)") : lineColor;
        return (
          <g key={i}>
            <circle cx={l.x1} cy={l.y1} r="1.5" fill={stroke} />
            <path d={`M ${l.x1} ${l.y1} C ${midX} ${l.y1}, ${midX} ${l.y2}, ${l.x2} ${l.y2}`} fill="none" stroke={stroke} strokeWidth={lit ? 1.5 : 1} strokeDasharray={lit ? undefined : "3 3"} />
          </g>
        );
      })}
    </svg>
  );
}

/* ── Main Popup ── */
export default function CompanyViewPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedGroup, setSelectedGroup] = useState("Specialty Metals");
  const [hoveredNode, setHoveredNode] = useState<ActiveNode>(null);
  const [selectedNode, setSelectedNode] = useState<ActiveNode>(null);
  const [treeTab, setTreeTab] = useState<"overview" | "supply" | "brief">("overview");
  const treeRef = useRef<HTMLDivElement>(null);
  const umicoreRef = useRef<HTMLDivElement>(null);

  // Refs for edge connections
  const upstreamRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
  const inputRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
  const outputRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
  const downstreamRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
  const endProductRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});

  // Ensure refs exist
  const getRef = (map: React.MutableRefObject<Record<string, React.RefObject<HTMLDivElement | null>>>, key: string) => {
    if (!map.current[key]) map.current[key] = React.createRef<HTMLDivElement>();
    return map.current[key];
  };

  if (!isOpen) return null;

  const activeGroup = BUSINESS_GROUPS.find(g => g.name === selectedGroup);
  const visibleOutputs = activeGroup?.active ? ALL_OUTPUTS.filter(o => o.group === selectedGroup) : [];
  const visibleDownstreamNames = new Set<string>();
  visibleOutputs.forEach(o => { (OUTPUT_TO_DOWNSTREAM[o.name] ?? []).forEach(d => visibleDownstreamNames.add(d)); });
  const visibleDownstream = ALL_DOWNSTREAM.filter(d => visibleDownstreamNames.has(d.name));
  const visibleEndProducts: string[] = [];
  visibleDownstream.forEach(d => { const ep = DOWNSTREAM_TO_ENDPRODUCT[d.name]; if (ep && !visibleEndProducts.includes(ep)) visibleEndProducts.push(ep); });

  const activeNode = hoveredNode ?? selectedNode;
  const highlightSet = computeHighlight(activeNode, visibleOutputs, visibleDownstream);
  const isActive = highlightSet != null;
  const nodeState = (layer: string, name: string, defaultHi = false) => ({
    highlighted: isActive ? highlightSet!.has(name) : defaultHi,
    dimmed: isActive ? !highlightSet!.has(name) : false,
    selected: selectedNode?.layer === layer && selectedNode?.name === name,
  });
  const hover = (layer: string, name: string) => () => setHoveredNode({ layer, name });
  const clearHover = () => setHoveredNode(null);
  const toggleSelect = (layer: string, name: string) => () =>
    setSelectedNode(prev => prev && prev.layer === layer && prev.name === name ? null : { layer, name });

  // Build edges
  const upInputEdges: Edge[] = UPSTREAM.flatMap(u =>
    u.inputs.filter(inp => ALL_INPUTS.some(ai => ai.name === inp)).map(inp => ({
      fromRef: getRef(upstreamRefs, u.name), toRef: getRef(inputRefs, inp), from: u.name, to: inp,
    }))
  );
  const inputUmicoreEdges: Edge[] = ALL_INPUTS.map(n => ({
    fromRef: getRef(inputRefs, n.name), toRef: umicoreRef, from: n.name, to: COMPANY,
  }));
  const umicoreOutputEdges: Edge[] = visibleOutputs.map(o => ({
    fromRef: umicoreRef, toRef: getRef(outputRefs, o.name), from: COMPANY, to: o.name,
  }));
  const outDownEdges: Edge[] = visibleOutputs.flatMap(o =>
    (OUTPUT_TO_DOWNSTREAM[o.name] ?? []).filter(d => visibleDownstreamNames.has(d)).map(d => ({
      fromRef: getRef(outputRefs, o.name), toRef: getRef(downstreamRefs, d), from: o.name, to: d,
    }))
  );
  const downEndEdges: Edge[] = visibleDownstream.map(d => {
    const ep = DOWNSTREAM_TO_ENDPRODUCT[d.name];
    return ep ? { fromRef: getRef(downstreamRefs, d.name), toRef: getRef(endProductRefs, ep), from: d.name, to: ep } : null;
  }).filter((e): e is Edge => e != null);
  const allEdges = [...upInputEdges, ...inputUmicoreEdges, ...umicoreOutputEdges, ...outDownEdges, ...downEndEdges];

  // Umicore hub visual state
  const umiIn = isActive ? highlightSet!.has(COMPANY) : true;
  const umiSelected = selectedNode?.layer === "umicore";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }} />
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", width: "94%", maxWidth: 1280, maxHeight: "88vh", background: "#141414", border: "1px solid rgb(42, 42, 42)", borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column", animation: "fadeSlideDown 0.3s ease-out" }}>

        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 4, zIndex: 10, transition: "color 0.15s" }} onMouseEnter={e => { e.currentTarget.style.color = warmWhite; }} onMouseLeave={e => { e.currentTarget.style.color = "#555"; }}>&times;</button>

        {/* Header */}
        <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
          <p style={{ fontSize: 7, color: "#555", margin: "0 0 4px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>Company Node</p>
          <h2 style={{ fontSize: 22, fontWeight: 400, color: warmWhite, margin: "0 0 12px 0" }}>Umicore (UMI)</h2>
          <div style={{ height: 1, background: borderColor }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 24px" }}>
          {/* Tab row */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {([["overview", "Overview"], ["supply", "Supply Tree"], ["brief", "Investment Brief"]] as const).map(([k, label]) => (
              <button key={k} onClick={() => setTreeTab(k)} style={{ fontSize: 9, fontFamily: MONO, letterSpacing: "0.04em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 4, cursor: "pointer", border: treeTab === k ? `1px solid ${accent}55` : "1px solid rgba(255,255,255,0.08)", background: treeTab === k ? "rgba(200,122,74,0.12)" : "transparent", color: treeTab === k ? accent : dimText, transition: "all 0.15s" }}>{label}</button>
            ))}
          </div>

          {treeTab === "overview" && (
          <>
          <div style={{ display: "flex", gap: 16, alignItems: "stretch", marginBottom: 18 }}>
            {/* Overview summary card */}
            <div style={{ flex: 1, minWidth: 0, border: `1px solid ${borderColor}`, borderRadius: 6, padding: "14px 16px", background: "rgb(24,24,24)" }}>
              <p style={{ fontSize: 9, color: "rgb(219, 219, 218)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: MONO, fontWeight: 500, margin: "0 0 10px 0" }}>Overview</p>
              <p style={{ fontSize: 12, color: "rgb(172, 172, 172)", lineHeight: 1.65, margin: "0 0 10px 0" }}>Umicore is a Belgian materials technology and recycling group, headquartered in Brussels with roots dating to 1805. It operates globally, with major manufacturing and recycling sites across Europe, North America, and Asia, and trades on Euronext Brussels under the ticker UMI. The business is organized around four groups — Catalysis, Battery Materials, Specialty Materials, and Recycling — spanning automotive emission-control catalysts, battery cathode materials, germanium and specialty chemistries, and metals recovery. The majority of revenue comes from its Recycling segment, which processes complex waste streams to recover precious and specialty metals.</p>
              <p style={{ fontSize: 12, color: "rgb(172, 172, 172)", lineHeight: 1.65, margin: "0 0 10px 0" }}>Its defining advantage is a closed-loop model: Umicore sources, refines, transforms, and then recycles metals, with recovered material from end-of-life products and industrial residues feeding back into its own upstream supply. This vertical integration across metallurgy and chemistry lets it capture value at multiple points in the same metal&apos;s lifecycle and reduces dependence on primary raw-material sourcing — a structural edge in a world of tightening critical-material supply.</p>
              <p style={{ fontSize: 12, color: "rgb(172, 172, 172)", lineHeight: 1.65, margin: 0 }}>On strategy, Umicore launched its CORE strategy in 2025, prioritizing capital discipline, cash generation, and operational efficiency across its foundation businesses (Catalysis, Recycling, and Specialty Materials), while working to restore value in battery materials amid weaker-than-expected EV demand. Financially, the company guided full-year 2026 adjusted EBITDA toward roughly €1 billion, with a strong first quarter driven by Catalysis and a favorable metal-price environment; Specialty Materials is expected to carry top-line momentum on the back of solid demand for its germanium products. The foundation businesses are doing the heavy lifting while battery materials stabilizes.</p>
            </div>
            {/* Right: stock chart + key metrics */}
            <div style={{ flex: "0 0 300px", display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Stock chart card — placeholder until live data API */}
              <div style={{ border: `1px solid ${borderColor}`, borderRadius: 6, padding: "12px 14px", background: "rgb(24,24,24)" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 9, color: "rgb(219, 219, 218)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: MONO, fontWeight: 500 }}>Stock</span>
                  <span style={{ fontSize: 9, color: "#5f9a5f", fontFamily: MONO }}>+131% 12mo</span>
                </div>
                <svg viewBox="0 0 200 56" preserveAspectRatio="none" style={{ width: "100%", height: 56, display: "block" }}>
                  <defs><linearGradient id="umiSpark" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(200,122,74,0.25)" /><stop offset="100%" stopColor="rgba(200,122,74,0)" /></linearGradient></defs>
                  <path d="M0,48 L25,44 L50,46 L75,38 L100,40 L125,28 L150,22 L175,14 L200,8 L200,56 L0,56 Z" fill="url(#umiSpark)" stroke="none" />
                  <path d="M0,48 L25,44 L50,46 L75,38 L100,40 L125,28 L150,22 L175,14 L200,8" fill="none" stroke={accent} strokeWidth="1.5" />
                </svg>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 14, color: warmWhite, fontWeight: 500 }}>€17.26</span>
                  <span style={{ fontSize: 8, color: "#555", fontFamily: MONO }}>Live data coming soon</span>
                </div>
              </div>
              {/* Key metrics card */}
              <div style={{ border: `1px solid ${borderColor}`, borderRadius: 6, padding: "12px 14px", background: "rgb(24,24,24)" }}>
                <p style={{ fontSize: 9, color: "rgb(219, 219, 218)", margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: MONO, fontWeight: 500 }}>Key Metrics</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {UMICORE_BRIEF.metrics.map(m => (
                    <div key={m.label} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 10, color: "#706a60", fontFamily: MONO }}>{m.label}</span>
                      <span style={{ fontSize: 11, color: warmWhite, fontWeight: 500 }}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          </>
          )}

          {treeTab === "supply" && (
          <>
          <div style={{ border: `1px solid ${borderColor}`, borderRadius: 6, padding: "12px 14px", background: "rgb(24,24,24)", marginBottom: 12 }}>
            <p style={{ fontSize: 12, color: "rgb(172, 172, 172)", lineHeight: 1.6, margin: 0 }}>Umicore sits at the conversion layer of this chain — refining germanium-bearing feedstock and recycled scrap into fiber-grade GeCl₄ and specialty intermediates, then supplying the downstream component makers. As the sole western GeCl₄ producer, it is the chokepoint between raw material and finished fiber.</p>
          </div>
          <div style={{ border: `1px solid ${borderColor}`, borderRadius: 6, padding: "14px 16px", background: "rgb(24,24,24)" }}>
          <div ref={treeRef} onClick={() => setSelectedNode(null)} style={{ position: "relative", display: "flex", gap: 40, overflowX: "auto", paddingBottom: 8 }}>
                <EdgeLines edges={allEdges} containerRef={treeRef} highlightSet={highlightSet} />

                {/* Source */}
                <Col label="SOURCE">
                  {UPSTREAM.map(u => {
                    const st = nodeState("upstream", u.name);
                    return <TreeNode key={u.name} name={u.name} role={u.role} clickable nodeRef={getRef(upstreamRefs, u.name)} {...st} onHoverIn={hover("upstream", u.name)} onHoverOut={clearHover} onSelect={toggleSelect("upstream", u.name)} />;
                  })}
                </Col>

                {/* Raw materials */}
                <Col label="RAW MATERIALS">
                  {ALL_INPUTS.map(n => {
                    const st = nodeState("input", n.name);
                    return <TreeNode key={n.name} name={n.name} role={n.role} clickable nodeRef={getRef(inputRefs, n.name)} {...st} onHoverIn={hover("input", n.name)} onHoverOut={clearHover} onSelect={toggleSelect("input", n.name)} />;
                  })}
                </Col>

                {/* Company */}
                <div style={{ flex: "0 0 auto", width: 165, display: "flex", flexDirection: "column", gap: 5, position: "relative", zIndex: 1 }}>
                  <p style={{ fontSize: 7, color: "#555", margin: "0 0 3px 0", fontFamily: MONO, letterSpacing: "0.06em", textTransform: "uppercase" }}>Company</p>
                  <div
                    ref={umicoreRef}
                    onMouseEnter={hover("umicore", COMPANY)}
                    onMouseLeave={clearHover}
                    onClick={(e) => { e.stopPropagation(); toggleSelect("umicore", COMPANY)(); }}
                    style={{ padding: "6px 8px", background: groupBg, border: umiSelected ? `1px solid ${accent}` : `1px solid ${accent}40`, borderRadius: 4, cursor: "pointer", opacity: umiIn ? 1 : 0.3, transition: "opacity 0.15s, border-color 0.15s" }}
                  >
                    <p style={{ fontSize: 11, fontWeight: 500, color: warmWhite, margin: "0 0 4px 0", fontFamily: SERIF }}>Umicore</p>
                    <p style={{ fontSize: 7, color: "#555", margin: "0 0 6px 0", fontFamily: MONO, letterSpacing: "0.04em", textTransform: "uppercase" }}>Business Segments</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {BUSINESS_GROUPS.map(g => (
                        <div key={g.name} onClick={(e) => { e.stopPropagation(); if (g.active) setSelectedGroup(g.name); }} style={{ padding: "3px 6px", borderRadius: 3, background: selectedGroup === g.name ? "rgba(200,122,74,0.12)" : "rgba(255,255,255,0.02)", border: selectedGroup === g.name ? `1px solid ${accent}30` : "1px solid transparent", cursor: g.active ? "pointer" : "default", opacity: g.active ? 1 : 0.35, transition: "background 0.15s" }}>
                          <p style={{ fontSize: 9, color: selectedGroup === g.name ? accent : dimText, margin: 0, fontWeight: selectedGroup === g.name ? 500 : 400 }}>{g.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Intermediate */}
                <Col label="INTERMEDIATE">
                  {visibleOutputs.length > 0 ? visibleOutputs.map(o => {
                    const st = nodeState("output", o.name, o.name === "GeCl₄");
                    return <TreeNode key={o.name} name={o.name} role={o.role} clickable nodeRef={getRef(outputRefs, o.name)} {...st} onHoverIn={hover("output", o.name)} onHoverOut={clearHover} onSelect={toggleSelect("output", o.name)} />;
                  }) : <p style={{ fontSize: 9, color: "#555", margin: 0, fontStyle: "italic" }}>Select a segment</p>}
                </Col>

                {/* Component */}
                <Col label="COMPONENT">
                  {visibleDownstream.length > 0 ? visibleDownstream.map(d => {
                    const st = nodeState("downstream", d.name);
                    return <TreeNode key={d.name} name={d.name} role={d.role} clickable nodeRef={getRef(downstreamRefs, d.name)} {...st} onHoverIn={hover("downstream", d.name)} onHoverOut={clearHover} onSelect={toggleSelect("downstream", d.name)} />;
                  }) : <p style={{ fontSize: 9, color: "#555", margin: 0, fontStyle: "italic" }}>—</p>}
                </Col>

                {/* End Product */}
                <Col label="END PRODUCT">
                  {visibleEndProducts.length > 0 ? visibleEndProducts.map(ep => {
                    const st = nodeState("endproduct", ep);
                    return <TreeNode key={ep} name={ep} role="End Market" clickable nodeRef={getRef(endProductRefs, ep)} {...st} onHoverIn={hover("endproduct", ep)} onHoverOut={clearHover} onSelect={toggleSelect("endproduct", ep)} />;
                  }) : <p style={{ fontSize: 9, color: "#555", margin: 0, fontStyle: "italic" }}>—</p>}
                </Col>
              </div>
          </div>
          </>
          )}

          {/* Investment Brief tab — flowing paragraphs under 5 section headers */}
          {treeTab === "brief" && UMICORE_BRIEF && (
            <>
            {/* Stillpoint View */}
            <div style={{ border: `1px solid ${borderColor}`, borderRadius: 6, padding: "16px 18px", background: "rgb(34, 34, 34)", marginBottom: 14 }}>
              <p style={{ fontSize: 12, color: "rgb(219, 219, 218)", fontWeight: 500, margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: 6 }}>
                <img src="/stillpoint-icon.png" alt="" style={{ width: 14, height: 14, borderRadius: 2, opacity: 0.85 }} />Stillpoint View
              </p>
              <p style={{ fontSize: 12, color: "rgb(172, 172, 172)", lineHeight: 1.65, margin: "0 0 10px 0" }}>Umicore sits at the intersection of the two things I want exposure to: irreplaceable chokepoint positions and diversified critical-materials refining. The GeCl₄ position is the anchor — the sole western source of fiber-grade germanium tetrachloride, with no substitute at the volumes the industry requires. But that chokepoint is one node in a much broader footprint. Umicore refines a wide set of critical materials feeding sectors that aren&apos;t going anywhere — catalysis, electronics, optics, batteries (see supply tree). Demand for these inputs compounds with electrification, connectivity, and reshoring. It doesn&apos;t evaporate.</p>
              <p style={{ fontSize: 12, color: "rgb(172, 172, 172)", lineHeight: 1.65, margin: "0 0 10px 0" }}>The recycling loop is the part the market underrates. Umicore doesn&apos;t just refine — it recovers, closing the loop on its own feedstock and insulating margins from spot volatility. That&apos;s a structural moat, not a cyclical one, and it&apos;s exactly the kind of self-renewing position I want to own.</p>
              <p style={{ fontSize: 12, color: "rgb(172, 172, 172)", lineHeight: 1.65, margin: "0 0 10px 0" }}>On battery materials — where the market has punished the stock hardest — I take the contrarian side. The division is depressed because passenger-EV demand softened, but I think the demand base is about to broaden well beyond cars. Drones and robotics are scaling into real volume, and both draw on the same cathode chemistry. Separately, I expect the Iran war to accelerate EV adoption across oil-dependent economies looking to cut exposure to fuel-price and supply shocks. If either plays out, battery materials flips from drag to tailwind — and in the meantime the foundation businesses pay me to wait.</p>
              <p style={{ fontSize: 12, color: "rgb(172, 172, 172)", lineHeight: 1.65, margin: 0 }}>I hold a position here. What I&apos;m watching: battery materials resolution (divestiture or stabilization), sustained germanium momentum, and the DRC volume ramp confirming the throughput story.</p>
            </div>
            <div style={{ border: `1px solid ${borderColor}`, borderRadius: 6, padding: "16px 18px", background: "rgb(24,24,24)" }}>
              {UMICORE_BRIEF.sections.map((sec, si) => (
                <div key={si} style={{ marginBottom: 18 }}>
                  <p style={{ fontSize: 13, color: warmWhite, fontWeight: 400, margin: "0 0 8px 0" }}>{BRIEF_SECTION_TITLES[si] ?? sec.label}</p>
                  {sec.items.map((item, ii) => (
                    <p key={ii} style={{ fontSize: 12, color: "rgb(172, 172, 172)", lineHeight: 1.65, margin: "0 0 10px 0" }}>{item.text}</p>
                  ))}
                </div>
              ))}
              {UMICORE_BRIEF.disclaimer && <p style={{ fontSize: 9, color: "#555", lineHeight: 1.5, margin: "4px 0 0 0", fontStyle: "italic" }}>{UMICORE_BRIEF.disclaimer}</p>}
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Col({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ flex: "0 0 auto", width: 160, display: "flex", flexDirection: "column", gap: 5, position: "relative", zIndex: 1 }}>
      <p style={{ fontSize: 7, color: "#555", margin: "0 0 3px 0", fontFamily: MONO, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</p>
      {children}
    </div>
  );
}
