"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";

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

const OVERVIEW_TEXT = [
  "In the GeCl₄ chain, Umicore matters less as a diversified materials company and more as a specialized conversion node. Its Electro-Optic Materials business connects germanium-bearing feedstock and recycled streams to ultra-pure GeCl₄, which then feeds fiber preform production and ultimately optical fiber for AI data center connectivity.",
  "The key question is whether GeCl₄ capacity can scale with AI-driven fiber demand. Fiber manufacturers can add equipment and draw capacity, but GeCl₄ depends on constrained germanium feedstock and specialized refining capability. That places Umicore near a critical Western chokepoint in the germanium-to-fiber chain.",
];

const RELATED_SIGNALS = ["The GeCl₄ Chokepoint", "Germanium Feedstock Constraint", "Western Redundancy Gap"];

type ActiveNode = { layer: string; name: string } | null;

/* Which nodes light up when `active` is hovered/selected. Umicore is the hub. */
function computeHighlight(active: ActiveNode, visibleOutputs: typeof ALL_OUTPUTS, visibleDownstream: typeof ALL_DOWNSTREAM): Set<string> | null {
  if (!active) return null;
  const set = new Set<string>();
  set.add(active.name);
  set.add(COMPANY);
  if (active.layer === "umicore") {
    UPSTREAM.forEach(u => set.add(u.name));
    ALL_INPUTS.forEach(n => set.add(n.name));
    visibleOutputs.forEach(o => set.add(o.name));
    visibleDownstream.forEach(d => set.add(d.name));
    return set;
  }
  if (active.layer === "upstream") {
    const u = UPSTREAM.find(x => x.name === active.name);
    u?.inputs.forEach(inp => { if (ALL_INPUTS.some(ai => ai.name === inp)) set.add(inp); });
  } else if (active.layer === "input") {
    UPSTREAM.filter(u => u.inputs.includes(active.name)).forEach(u => set.add(u.name));
  } else if (active.layer === "output") {
    (OUTPUT_TO_DOWNSTREAM[active.name] ?? []).forEach(d => { if (visibleDownstream.some(vd => vd.name === d)) set.add(d); });
  } else if (active.layer === "downstream") {
    visibleOutputs.forEach(o => { if ((OUTPUT_TO_DOWNSTREAM[o.name] ?? []).includes(active.name)) set.add(o.name); });
  }
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
  const treeRef = useRef<HTMLDivElement>(null);
  const umicoreRef = useRef<HTMLDivElement>(null);

  // Refs for edge connections
  const upstreamRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
  const inputRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
  const outputRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
  const downstreamRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});

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

  // Chains the company participates in (one per output → its downstream destinations)
  const companyChains = visibleOutputs.map(o => ({ name: o.name, downstream: (OUTPUT_TO_DOWNSTREAM[o.name] ?? []).join(" · "), seed: o.name }));

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
  const allEdges = [...upInputEdges, ...inputUmicoreEdges, ...umicoreOutputEdges, ...outDownEdges];

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
          <h2 style={{ fontSize: 22, fontWeight: 400, color: warmWhite, margin: "0 0 6px 0", fontFamily: SERIF }}>Umicore</h2>
          <p style={{ fontSize: 12, color: dimText, lineHeight: 1.5, margin: "0 0 16px 0", maxWidth: 700 }}>Specialty materials and refining company connecting germanium-bearing feedstock to fiber-grade GeCl&#x2084; and downstream optical fiber chains.</p>
          <div style={{ height: 1, background: borderColor }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 24px" }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            {/* Left: chains the company is part of */}
            <div style={{ flex: "0 0 188px", border: `1px solid ${borderColor}`, borderRadius: 6, padding: "12px 12px 14px", background: "rgb(24,24,24)" }}>
              <p style={{ fontSize: 9, color: "rgb(219, 219, 218)", margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: MONO, fontWeight: 500 }}>Chains ({companyChains.length})</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {companyChains.map(c => {
                  const sel = selectedNode?.layer === "output" && selectedNode?.name === c.seed;
                  return (
                    <div
                      key={c.seed}
                      onMouseEnter={hover("output", c.seed)}
                      onMouseLeave={clearHover}
                      onClick={(e) => { e.stopPropagation(); toggleSelect("output", c.seed)(); }}
                      style={{ padding: "6px 8px", borderRadius: 4, cursor: "pointer", background: sel ? "rgba(200,122,74,0.12)" : "rgba(255,255,255,0.02)", border: sel ? `1px solid ${accent}55` : "1px solid transparent", transition: "background 0.15s, border-color 0.15s" }}
                    >
                      <p style={{ fontSize: 10, color: sel ? accent : warmWhite, margin: 0, fontWeight: 500, fontFamily: SERIF }}>{c.name}</p>
                      {c.downstream && <p style={{ fontSize: 8, color: "#6c6c6c", margin: "2px 0 0 0", fontFamily: MONO, letterSpacing: "0.02em" }}>{c.downstream}</p>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: supply tree */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 10, color: warmWhite, margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, fontFamily: MONO }}>Supply Chain Position</p>

              <div ref={treeRef} onClick={() => setSelectedNode(null)} style={{ position: "relative", display: "flex", gap: 40, overflowX: "auto", paddingBottom: 8 }}>
                <EdgeLines edges={allEdges} containerRef={treeRef} highlightSet={highlightSet} />

                {/* Upstream */}
                <Col label="UPSTREAM">
                  {UPSTREAM.map(u => {
                    const st = nodeState("upstream", u.name);
                    return <TreeNode key={u.name} name={u.name} role={u.role} clickable nodeRef={getRef(upstreamRefs, u.name)} {...st} onHoverIn={hover("upstream", u.name)} onHoverOut={clearHover} onSelect={toggleSelect("upstream", u.name)} />;
                  })}
                </Col>

                {/* Input */}
                <Col label="INPUT">
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

                {/* Output */}
                <Col label="OUTPUT">
                  {visibleOutputs.length > 0 ? visibleOutputs.map(o => {
                    const st = nodeState("output", o.name, o.name === "GeCl₄");
                    return <TreeNode key={o.name} name={o.name} role={o.role} clickable nodeRef={getRef(outputRefs, o.name)} {...st} onHoverIn={hover("output", o.name)} onHoverOut={clearHover} onSelect={toggleSelect("output", o.name)} />;
                  }) : <p style={{ fontSize: 9, color: "#555", margin: 0, fontStyle: "italic" }}>Select a segment</p>}
                </Col>

                {/* Downstream */}
                <Col label="DOWNSTREAM">
                  {visibleDownstream.length > 0 ? visibleDownstream.map(d => {
                    const st = nodeState("downstream", d.name);
                    return <TreeNode key={d.name} name={d.name} role={d.role} clickable nodeRef={getRef(downstreamRefs, d.name)} {...st} onHoverIn={hover("downstream", d.name)} onHoverOut={clearHover} onSelect={toggleSelect("downstream", d.name)} />;
                  }) : <p style={{ fontSize: 9, color: "#555", margin: 0, fontStyle: "italic" }}>—</p>}
                </Col>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: borderColor, margin: "16px 0" }} />

          {/* Stillpoint View */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <img src="/stillpoint-icon.png" alt="" style={{ width: 14, height: 14, borderRadius: 2, opacity: 0.85 }} />
            <p style={{ fontSize: 12, color: "rgb(219, 219, 218)", fontWeight: 500, margin: 0 }}>Stillpoint View</p>
          </div>
          {OVERVIEW_TEXT.map((p, i) => <p key={i} style={{ fontSize: 12, color: dimText, lineHeight: 1.6, margin: i === 0 ? "0 0 8px 0" : "0", maxWidth: 800 }}>{p}</p>)}

          <div style={{ height: 1, background: borderColor, margin: "16px 0" }} />

          {/* Related Signals */}
          <p style={{ fontSize: 9, color: "rgb(219, 219, 218)", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: MONO, fontWeight: 500 }}>Related Signals</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {RELATED_SIGNALS.map(sig => (
              <div key={sig} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#555", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: dimText }}>{sig}</span>
              </div>
            ))}
          </div>
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
