"use client";
import React, { useMemo, useState } from "react";
import TreeMap from "@/components/TreeMap";
import NodeModal from "@/components/NodeModal";
import { buildCompGeometry, buildSubGeometry, computeCompSvgWidth, computeSubSvgWidth } from "@/lib/treeGeometry";
import chainsJson from "@/data/chains.json";
import nodesJson from "@/data/nodes.json";
import type { CompChain, SubChain, NodeData } from "@/types";

const chainsData = chainsJson as unknown as {
  layerConfig: Record<string, { label?: string; displayFields: { key: string; label: string }[] }>;
  COMP_DATA: Record<string, CompChain>;
  SUB_DATA: Record<string, SubChain>;
};
const allNodes = nodesJson as unknown as Record<string, NodeData>;

export default function FiberOpticInputPage() {
  const compChain = chainsData.COMP_DATA["GeO₂ / GeCl₄"];
  const subChain = chainsData.SUB_DATA["Fiber Optics"];
  const compW = useMemo(() => computeCompSvgWidth(compChain), []);
  const subW = useMemo(() => computeSubSvgWidth(subChain), []);
  const compGeo = useMemo(() => buildCompGeometry(compChain, compW / 2, 80), []);
  // Compact geometry: skip GeCl₄ layer, start fiber mfg at top
  const compGeoCompact = useMemo(() => {
    const full = buildCompGeometry(compChain, compW / 2, 80);
    // Shift layers 1+ up by removing layer 0 (GeCl₄) and adjusting cy
    const shift = full.layers[0].cy; // 80
    const gap = full.layers[1].cy - full.layers[0].cy; // 170
    return {
      layers: full.layers.slice(1).map(l => ({ ...l, cy: l.cy - gap, nodes: l.nodes.map(n => ({ ...n, cy: n.cy - gap })) })),
      edges: full.edges.filter(e => e.fromLayer >= 1).map(e => ({ ...e, fromLayer: e.fromLayer - 1, y1: e.y1 - gap, y2: e.y2 - gap })),
      outputNode: { ...full.outputNode, cy: full.outputNode.cy - gap },
    };
  }, []);
  const subGeo = useMemo(() => buildSubGeometry(subChain, subW / 2, 80), []);
  const compH = compGeo.outputNode.cy + 120;
  const compHCompact = compGeoCompact.outputNode.cy + 120;
  const fiberMfgXs = compGeoCompact.layers[0].nodes.map(n => n.cx);
  const catNodes = [
    { x: compW / 2 - 300, label: "GeCl\u2084", sub: "4 suppliers", clickable: true, targets: [0, 1, 2, 3, 4, 5] },
    { x: compW / 2, label: "Helium", sub: "4 sources", clickable: false, targets: [0, 1, 2, 3, 4, 5] },
    { x: compW / 2 + 300, label: "Silica / SiCl\u2084", sub: "4 suppliers", clickable: false, targets: [0, 1, 2, 3, 4, 5] },
  ];
  const subH = subGeo.outputNode.cy + 120;
  const subFirstXs = subGeo.layers[0].nodes.map(n => n.cx);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [treeExpanded, setTreeExpanded] = useState(false);
  const [expandedInput, setExpandedInput] = useState<string | null>(null);
  const [soWhatOpen, setSoWhatOpen] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("thesis");
  const lc = chainsData.layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;

  // Scroll spy
  React.useEffect(() => {
    const ids = ["thesis", "how-its-made", "supply-tree", "dependencies", "supply-demand", "so-what", "money", "risk"];
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
  const accent = "#6a9ab8";
  const gold = "#c9a84c";
  const warmWhite = "#ece8e1";
  const muted = "#706a60";
  const dimText = "#555";
  const dimmer = "#4a4540";
  const cardBg = "#1a1816";
  const borderColor = "#252220";

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
          { id: "how-its-made", label: "How it\u2019s made" },
          { id: "supply-tree", label: "Supply tree" },
          { id: "dependencies", label: "Dependencies" },
          { id: "supply-demand", label: "Supply \u2192 Demand" },
          { id: "so-what", label: "So what" },
          { id: "money", label: "Where the money is" },
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
        <p style={{ fontSize: 9, letterSpacing: "0.06em", color: "#555", margin: "0 0 8px 12px" }}>Upstream</p>
        {[
          { name: "Germanium", linked: true, href: "/input/germanium" },
          { name: "Silicon tetrachloride", linked: false, href: "" },
          { name: "Helium", linked: false, href: "" },
        ].map((item, i) => (
          <div key={`u${i}`} onClick={() => { if (item.linked) window.location.href = item.href; }}
            style={{ display: "flex", alignItems: "center", padding: "1px 0 1px 12px", cursor: item.linked ? "pointer" : "default" }}>
            <span style={{ fontSize: 10, color: item.linked ? "#a09888" : "#4a4540", transition: "color 0.15s" }}
              onMouseEnter={e => { if (item.linked) e.currentTarget.style.color = "#ece8e1"; }}
              onMouseLeave={e => { if (item.linked) e.currentTarget.style.color = "#a09888"; }}>
              {item.name}
            </span>
            {item.linked && <span style={{ fontSize: 10, color: "#4a4540", marginLeft: 6 }}>→</span>}
          </div>
        ))}
        <p style={{ fontSize: 9, letterSpacing: "0.06em", color: "#555", margin: "16px 0 8px 12px" }}>Downstream</p>
        {[
          { name: "AI datacenters" },
          { name: "Subsea cables" },
          { name: "Military / UAV" },
        ].map((item, i) => (
          <div key={`d${i}`} style={{ display: "flex", alignItems: "center", padding: "1px 0 1px 12px" }}>
            <span style={{ fontSize: 10, color: "#4a4540" }}>{item.name}</span>
          </div>
        ))}
      </nav>

      {/* Page content — single column */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 32px 80px" }}>

        {/* ═══ SECTION 1: HOOK ═══ */}
        <div id="thesis" style={{ marginBottom: "56px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
            COMPONENT · AI INFRASTRUCTURE
          </p>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "36px",
            fontWeight: 400,
            color: warmWhite,
            margin: "0 0 46px 0",
            lineHeight: 1.2,
          }}>
            Fiber optic cable
          </h1>
          {/* Executive summary */}
          <div style={{ background: "#1a1816", border: "1px solid #252220", borderRadius: 10, padding: "24px 28px", marginBottom: 56 }}>
            <p style={{ fontSize: 20, letterSpacing: "0.1em", color: "#555", margin: "0 0 16px 0" }}>EXECUTIVE SUMMARY</p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {[
                "Fiber optics are glass strands that transmit data as pulses of light. They serve as the physical layer connecting everything inside and between AI datacenters, telecom networks, and cross-ocean subsea systems.",
                "The core inputs are high-purity silica, germanium, and helium. Silica glass forms the fiber body. Germanium is used as a dopant to create the refractive index gradient that guides light through the core. Helium \u2014 for which there is no substitute \u2014 cools the glass during the fiber drawing process. Without these three materials, there is no fiber.",
                "Supply is constrained. Global production sits at ~720M fiber strand-km/yr. Preform lines are at full utilization. One equipment supplier \u2014 Rosendahl Nextrom \u2014 carries 18-24 month backlogs. Prices are at 7-year highs.",
                "Driven by AI. ~20 GW of AI datacenter capacity is entering construction annually. Each GW requires ~6.5M fiber strand-km. A 130M km supply gap cannot close before 2027.",
                "New preform capacity, DRC germanium ramp, and hollow-core fiber all target 2027-2028. Supply constraints persist through at least 2027.",
                "The suppliers of germanium tetrachloride, fiber preform manufacturers, and proprietary equipment suppliers positioned at chokepoints will capture most of the value at this layer.",
              ].map((point, i, arr) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                  {i < arr.length - 1 && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 7 }} />}
                  <p style={{ fontSize: 13.5, color: i === arr.length - 1 ? "#dad9d8" : "#a09888", lineHeight: 1.4, margin: 0, fontWeight: 300 }}>{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ SECTION 2: HOW IT'S MADE ═══ */}
        <div id="how-its-made" style={{ marginBottom: "56px", paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>
            HOW IT&apos;S MADE
          </p>

          <div style={{ display: "flex", gap: "12px" }}>

            {/* Card 1: Raw Material Inputs */}
            <div style={{
              flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                01 · RAW MATERIAL INPUTS
              </p>
              <p style={{ fontSize: "11.5px", color: "#a09888", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Refined germanium is chemically converted into germanium tetrachloride (GeCl₄) — the dopant that creates the refractive index gradient in the fiber core. High-purity silica (SiCl₄) forms the glass body itself. Both require extreme purity levels measured in parts per billion.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHY IT&apos;S HARD</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Fiber-grade GeCl₄ requires ultra-high purity — specifically removing arsenic contamination. This demands proprietary techniques and specialized equipment that can&apos;t be purchased off the shelf.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHO CAN DO IT</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 0 0", flex: 1 }}>
                Only 6 facilities worldwide produce fiber-grade GeCl₄. 4 are in China, 1 in Russia, and 1 in the west — a single site in Belgium.
              </p>
              <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #222018" }}>
                <span style={{ fontSize: "12px", color: warmWhite, fontWeight: 500 }}>~220t</span>
                <span style={{ fontSize: "9px", color: dimText, marginLeft: "6px" }}>GeCl₄ produced annually</span>
              </div>
            </div>

            {/* Card 2: Preform Manufacturing */}
            <div style={{
              flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                02 · PREFORM MANUFACTURING
              </p>
              <p style={{ fontSize: "11.5px", color: "#a09888", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                GeCl₄ is vaporized and deposited layer by layer inside a silica tube, building up a glass preform rod with a germanium-doped core. This step determines the optical properties of the final fiber.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHY IT&apos;S HARD</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                The process itself is well understood — nearly 20 manufacturers produce preforms globally. The constraint is equipment. Only one company makes the deposition systems. Adding a new line takes 18–24 months.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHO CAN DO IT</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 0 0", flex: 1 }}>
                ~20 preform manufacturers globally. Most are vertically integrated — they also draw fiber and assemble cable. Lines running at full utilization.
              </p>
              <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #222018" }}>
                <span style={{ fontSize: "12px", color: warmWhite, fontWeight: 500 }}>~24,000t</span>
                <span style={{ fontSize: "9px", color: dimText, marginLeft: "6px" }}>preform produced annually</span>
              </div>
            </div>

            {/* Card 3: Fiber Draw & Cable Assembly */}
            <div style={{
              flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                03 · FIBER DRAW & CABLE ASSEMBLY
              </p>
              <p style={{ fontSize: "11.5px", color: "#a09888", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                The preform is heated in a draw tower and pulled into hair-thin fiber strands, coated for protection, then bundled with strength members and sheathed into finished cable. Helium gas is used to cool the fiber during drawing — there is no substitute.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHY IT&apos;S HARD</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Drawing and assembly are the least constrained steps. The bottleneck is upstream — you can only draw as much fiber as you have preforms. Helium supply is tight, with a third of global production disrupted by conflict in the Middle East.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHO CAN DO IT</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 0 0", flex: 1 }}>
                Most of the ~20 preform manufacturers plus ~10 dedicated cable assemblers who buy fiber strand and bundle it into finished products.
              </p>
              <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #222018" }}>
                <span style={{ fontSize: "12px", color: warmWhite, fontWeight: 500 }}>~720M</span>
                <span style={{ fontSize: "9px", color: dimText, marginLeft: "6px" }}>fiber strand-km produced annually</span>
              </div>
            </div>

          </div>
        </div>

        {/* ═══ SUPPLY TREE ═══ */}
        <div id="supply-tree" style={{ marginBottom: "56px", paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>
            SUPPLY TREE
          </p>
          {/* Key takeaway */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ borderLeft: "2px solid #3a6a8030", paddingLeft: 20 }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.1em", color: "#6a9ab8", margin: "0 0 10px 0" }}>KEY TAKEAWAY</p>
              <p style={{ fontSize: 13, color: "#a09888", lineHeight: 1.3, margin: 0 }}>
                Three critical inputs feed fiber production: germanium tetrachloride as the core dopant, silicon tetrachloride as the glass substrate, and helium for cooling during fiber draw. GeCl₄ is the most constrained — <span style={{ color: "#ece8e1", fontWeight: 500 }}>~87t</span> of refined germanium enters the fiber supply chain annually, converted by just 6 facilities worldwide. Corning holds ~40% of fiber manufacturing. Total output: <span style={{ color: "#ece8e1", fontWeight: 500 }}>~720M fiber strand-km/yr</span> serving datacenter, telecom, and subsea markets.
              </p>
            </div>
          </div>
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
            {/* Input category nodes — shown when GeCl₄ not expanded */}
            {expandedInput !== "gecl4" && (
              <div style={{ paddingTop: 20 }}>
                <svg viewBox={`0 0 ${compW} 140`} preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", height: "auto" }}>
                  {/* INPUTS label above nodes */}
                  <text x={compW / 2} y={16} textAnchor="middle" fontFamily="'Courier New', monospace" fontSize={11} fontWeight={600} letterSpacing="0.12em" fill="rgba(255,255,255,0.35)">INPUTS</text>
                  {/* Three category nodes */}
                  {[
                    { x: compW / 2 - 180, label: "GeCl\u2084", sub: "4 suppliers", clickable: true },
                    { x: compW / 2, label: "Helium", sub: "4 sources", clickable: false },
                    { x: compW / 2 + 180, label: "Silica / SiCl\u2084", sub: "4 suppliers", clickable: false },
                  ].map((cat, i) => {
                    const y1 = 95; const y2 = 140; const midY = (y1 + y2) / 2;
                    const cx2 = compW / 2;
                    return (
                    <g key={i}
                      style={{ cursor: cat.clickable ? "pointer" : "default" }}
                      onClick={() => { if (cat.clickable) setExpandedInput("gecl4"); }}
                    >
                      {/* Ring */}
                      <circle cx={cat.x} cy={48} r={5.5} fill="none" stroke="rgba(155,168,171,0.5)" strokeWidth={1.3} />
                      {/* Label */}
                      <text x={cat.x} y={72} textAnchor="middle" fontFamily="'EB Garamond', Georgia, serif" fontSize={13} fontWeight={600} fill="rgba(255,255,255,0.82)">{cat.label}</text>
                      <text x={cat.x} y={88} textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize={8} fill="rgba(255,255,255,0.35)">{cat.sub}</text>
                      {/* Connecting line converging to center */}
                      <path d={`M ${cat.x},${y1} C ${cat.x},${midY} ${cx2},${midY} ${cx2},${y2}`} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={0.8} strokeDasharray="4,3" />
                    </g>
                    );
                  })}
                </svg>
              </div>
            )}

            {/* Full comp tree with GeCl₄ suppliers — shown when expanded */}
            {expandedInput === "gecl4" && (
              <>
                <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
                  <button onClick={() => setExpandedInput(null)} style={{ fontFamily: "'Geist Mono', monospace", fontSize: 8, color: "#555", background: "none", border: `1px solid ${borderColor}`, borderRadius: 4, padding: "3px 10px", cursor: "pointer" }}>
                    Collapse GeCl₄ suppliers ↑
                  </button>
                </div>
                <TreeMap geometry={compGeo} nodes={allNodes} layerConfig={lc} svgWidth={compW} svgHeight={compH} onNodeClick={setSelectedNode} onLayerClick={() => {}} layerPanels={{}} />
              </>
            )}

            {/* Fan-out bridge from convergence point to fiber mfg nodes */}
            {expandedInput !== "gecl4" && (
              <svg viewBox={`0 0 ${compW} 80`} preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", height: "auto" }}>
                {fiberMfgXs.map((tx, i) => {
                  const fx = compW / 2;
                  return <path key={i} d={`M ${fx},0 C ${fx},40 ${tx},40 ${tx},80`} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={0.8} strokeDasharray="4,3" />;
                })}
              </svg>
            )}
            {/* Compact tree (fiber mfg + output only) — shown when collapsed */}
            {expandedInput !== "gecl4" && (
              <TreeMap geometry={compGeoCompact} nodes={allNodes} layerConfig={lc} svgWidth={compW} svgHeight={compHCompact} onNodeClick={setSelectedNode} onLayerClick={() => {}} layerPanels={{}} />
            )}

            <svg viewBox={`0 0 ${subW} 80`} preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", height: "auto" }}>
              {subFirstXs.map((tx, i) => { const fx = subW / 2; return <path key={i} d={`M ${fx},0 C ${fx},40 ${tx},40 ${tx},80`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" strokeDasharray="4,3" />; })}
            </svg>
            <TreeMap geometry={subGeo} nodes={allNodes} layerConfig={lc} svgWidth={subW} svgHeight={subH} onNodeClick={setSelectedNode} onLayerClick={() => {}} layerPanels={{}} />
          </div>
        </div>

        {/* ═══ FULLSCREEN SUPPLY TREE OVERLAY ═══ */}
        {treeExpanded && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "#111", overflow: "auto",
            display: "flex", flexDirection: "column" as const,
          }}>
            {/* Header bar */}
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
            {/* Full tree with category nodes */}
            <div style={{ flex: 1, padding: "20px" }}>
              {/* Input category nodes */}
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
                    <button onClick={() => setExpandedInput(null)} style={{ fontFamily: "'Geist Mono', monospace", fontSize: 8, color: "#555", background: "none", border: `1px solid ${borderColor}`, borderRadius: 4, padding: "3px 10px", cursor: "pointer" }}>Collapse GeCl₄ suppliers ↑</button>
                  </div>
                  <TreeMap geometry={compGeo} nodes={allNodes} layerConfig={lc} svgWidth={compW} svgHeight={compH} onNodeClick={setSelectedNode} onLayerClick={() => {}} layerPanels={{}} />
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
                <TreeMap geometry={compGeoCompact} nodes={allNodes} layerConfig={lc} svgWidth={compW} svgHeight={compHCompact} onNodeClick={setSelectedNode} onLayerClick={() => {}} layerPanels={{}} />
              )}
              <svg viewBox={`0 0 ${subW} 80`} preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", height: "auto" }}>
                {subFirstXs.map((tx, i) => { const fx = subW / 2; return <path key={i} d={`M ${fx},0 C ${fx},40 ${tx},40 ${tx},80`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" strokeDasharray="4,3" />; })}
              </svg>
              <TreeMap geometry={subGeo} nodes={allNodes} layerConfig={lc} svgWidth={subW} svgHeight={subH} onNodeClick={setSelectedNode} onLayerClick={() => {}} layerPanels={{}} />
            </div>
          </div>
        )}

        {/* ═══ DEPENDENCIES ═══ */}
        <div id="dependencies" style={{ paddingTop: 20 }}>

        <p style={{ fontSize: 20, letterSpacing: "0.06em", color: "#555", margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>DEPENDENCIES</p>

        {/* Upstream table */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", margin: "0 0 20px 0" }}>UPSTREAM — WHAT GOES INTO FIBER</p>
          <div style={{ display: "flex", padding: "0 0 10px 0", borderBottom: "1px solid #252220" }}>
            {[{ l: "Input", w: "25%" }, { l: "Per km", w: "14%" }, { l: "% of cost (base)", w: "18%" }, { l: "Price trend", w: "14%" }, { l: "Form", w: "40%" }, { l: "Status", w: "14%" }].map(h => (
              <p key={h.l} style={{ fontSize: 9, letterSpacing: "0.06em", color: "#4a4540", margin: 0, width: h.w }}>{h.l}</p>
            ))}
          </div>
          {[
            { input: "Germanium", form: "Converted to GeCl₄ to guide light through core", perKm: "0.12g", share: "~10%", trend: "↑ 4.5x", status: "Constrained", linked: true },
            { input: "Silicon tetrachloride", form: "Deposited as the glass fiber itself", perKm: "~8g", share: "~15%", trend: "↑ 2x", status: "Tightening", linked: false },
            { input: "Helium", form: "Cools fiber during drawing, no substitute", perKm: "~0.5L", share: "~5%", trend: "↑ 4x", status: "Constrained", linked: false },
            { input: "Silica substrate", form: "Base glass tube the fiber is built on", perKm: "—", share: "~25%", trend: "Stable", status: "Available", linked: false },
            { input: "UV coating", form: "Protective coating applied after draw", perKm: "~0.3g", share: "~3%", trend: "Stable", status: "Available", linked: false },
            { input: "Energy", form: "Powers the draw tower furnace", perKm: "~0.5 kWh", share: "~7%", trend: "Stable", status: "Available", linked: false },
            { input: "Labor + overhead", form: "—", perKm: "—", share: "~35%", trend: "—", status: "—", linked: false },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: "1px solid #252220", cursor: row.linked ? "pointer" : "default", transition: "background 0.15s" }}
              onMouseEnter={e => { if (row.linked) { e.currentTarget.style.background = "#1a1816"; const n = e.currentTarget.querySelector("[data-name]") as HTMLElement; if (n) n.style.color = "#ece8e1"; } }}
              onMouseLeave={e => { if (row.linked) { e.currentTarget.style.background = "transparent"; const n = e.currentTarget.querySelector("[data-name]") as HTMLElement; if (n) n.style.color = "#a09888"; } }}
              onClick={() => { if (row.linked) window.location.href = "/input/germanium"; }}
            >
              <div style={{ width: "25%", display: "flex", alignItems: "baseline", gap: 6 }}>
                <p data-name="" style={{ fontSize: 12, color: "#a09888", fontWeight: 500, margin: 0, transition: "color 0.15s" }}>{row.input}</p>
                {row.linked && <span style={{ fontSize: 10, color: "#4a4540" }}>→</span>}
              </div>
              <p style={{ fontSize: 12, color: "#a09888", margin: 0, width: "14%" }}>{row.perKm}</p>
              <p style={{ fontSize: 12, color: "#a09888", margin: 0, width: "18%" }}>{row.share}</p>
              <p style={{ fontSize: 11, color: "#a09888", margin: 0, width: "14%" }}>{row.trend}</p>
              <p style={{ fontSize: 11, color: "#706a60", margin: 0, width: "40%" }}>{row.form}</p>
              <p style={{ fontSize: 10, fontWeight: 500, margin: 0, width: "14%", color: row.status === "Constrained" ? "#8a5a4a" : row.status === "Tightening" ? "#8a7a3a" : row.status === "Available" ? "#4a7a4a" : "#4a4540" }}>{row.status}</p>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: "1px solid #252220" }}>
            <p style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, margin: 0, width: "25%" }}>Production cost / km</p>
            <p style={{ margin: 0, width: "14%" }} />
            <p style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, margin: 0, width: "18%" }}>~$3.50</p>
            <p style={{ fontSize: 11, color: "#ece8e1", fontWeight: 500, margin: 0, width: "14%" }}>~$5</p>
            <p style={{ margin: 0, width: "40%" }} /><p style={{ margin: 0, width: "14%" }} />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", padding: "12px 0" }}>
            <p style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, margin: 0, width: "25%" }}>Market price / km (G.652D)</p>
            <p style={{ margin: 0, width: "14%" }} />
            <p style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, margin: 0, width: "18%" }}>~$5–6</p>
            <p style={{ fontSize: 11, color: "#ece8e1", fontWeight: 500, margin: 0, width: "14%" }}>~$12–17</p>
            <p style={{ margin: 0, width: "40%" }} /><p style={{ margin: 0, width: "14%" }} />
          </div>
          <div style={{ borderTop: "1px solid #252220", paddingTop: 14, marginTop: 4 }}>
            <p style={{ fontSize: 11, color: "#706a60", lineHeight: 1.6, margin: 0 }}>Three inputs are constrained simultaneously — germanium, SiCl₄, and helium — representing ~30% of baseline production cost. Their combined price surges have pushed estimated production cost up ~40%. But G.652D market prices have surged over 150%, reflecting demand shock from AI datacenters and military drone programs layered on top of input cost inflation.</p>
          </div>
        </div>

        {/* Downstream table */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", margin: "0 0 20px 0" }}>DOWNSTREAM — WHERE FIBER GOES</p>
          <div style={{ display: "flex", padding: "0 0 10px 0", borderBottom: "1px solid #252220" }}>
            {[{ l: "End use", w: "20%" }, { l: "Fiber type", w: "10%" }, { l: "Demand", w: "10%" }, { l: "Price/km", w: "10%" }, { l: "Est. value", w: "10%" }, { l: "Share", w: "10%" }, { l: "Driver", w: "20%" }, { l: "Status", w: "10%", right: true }].map(h => (
              <p key={h.l} style={{ fontSize: 9, letterSpacing: "0.06em", color: "#4a4540", margin: 0, width: h.w, textAlign: (h as {right?: boolean}).right ? "right" as const : undefined }}>{h.l}</p>
            ))}
          </div>
          {[
            { use: "AI datacenters", fiberType: "G.657A", demand: "~210M km", price: "~$25", value: "~$5.3B", share: "30%", driver: "GPU cluster interconnect, DCI", status: "Surging" },
            { use: "Terrestrial telecom", fiberType: "G.652D", demand: "~290M km", price: "~$15", value: "~$4.4B", share: "25%", driver: "FTTH, 5G backhaul, metro", status: "Stable" },
            { use: "Subsea cables", fiberType: "G.654E", demand: "~70M km", price: "~$75", value: "~$5.3B", share: "30%", driver: "Intercontinental capacity", status: "Growing" },
            { use: "Military / UAV", fiberType: "G.657A", demand: "~55M km", price: "~$25", value: "~$1.4B", share: "8%", driver: "Drone communication systems", status: "Surging" },
            { use: "BEAD broadband", fiberType: "G.652D", demand: "~65M km", price: "~$15", value: "~$1.0B", share: "5%", driver: "Federal rural program, $42B", status: "Ramping" },
            { use: "Other", fiberType: "Mixed", demand: "~30M km", price: "~$18", value: "~$0.5B", share: "2%", driver: "Enterprise, industrial, sensing", status: "Stable" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: "1px solid #252220" }}>
              <p style={{ fontSize: 12, color: "#a09888", fontWeight: 500, margin: 0, width: "20%" }}>{row.use}</p>
              <p style={{ fontSize: 11, color: "#706a60", margin: 0, width: "10%" }}>{row.fiberType}</p>
              <p style={{ fontSize: 12, color: "#a09888", margin: 0, width: "10%" }}>{row.demand}</p>
              <p style={{ fontSize: 12, color: "#a09888", margin: 0, width: "10%" }}>{row.price}</p>
              <p style={{ fontSize: 12, color: "#a09888", margin: 0, width: "10%" }}>{row.value}</p>
              <p style={{ fontSize: 12, color: "#a09888", margin: 0, width: "10%" }}>{row.share}</p>
              <p style={{ fontSize: 11, color: "#706a60", margin: 0, width: "20%", lineHeight: 1.5 }}>{row.driver}</p>
              <p style={{ fontSize: 10, fontWeight: 500, margin: 0, width: "10%", textAlign: "right" as const, color: row.status === "Surging" ? "#8a5a4a" : row.status === "Growing" || row.status === "Ramping" ? "#8a7a3a" : "#4a7a4a" }}>{row.status}</p>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: "1px solid #252220" }}>
            <p style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, margin: 0, width: "20%" }}>Total</p>
            <p style={{ margin: 0, width: "10%" }} />
            <p style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, margin: 0, width: "10%" }}>~720M km</p>
            <p style={{ margin: 0, width: "10%" }} />
            <p style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, margin: 0, width: "10%" }}>~$17.9B</p>
            <p style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, margin: 0, width: "10%" }}>100%</p>
            <p style={{ margin: 0, width: "20%" }} /><p style={{ margin: 0, width: "10%" }} />
          </div>
          <div style={{ borderTop: "1px solid #252220", paddingTop: 14, marginTop: 4 }}>
            <p style={{ fontSize: 11, color: "#706a60", lineHeight: 1.6, margin: 0 }}>Measured by volume, terrestrial telecom still dominates at 40%. Measured by value, AI datacenters and subsea cables each account for ~30% — the premium fiber segments now capture most of the revenue. AI datacenters and military drones both consume G.657A fiber, competing for the same production lines. Manufacturers are cannibalizing G.652D telecom output for higher-margin G.657A, squeezing telecom operators and the BEAD program simultaneously.</p>
          </div>
        </div>

        </div>

        {/* ═══ SUPPLY → DEMAND ═══ */}
        <div id="supply-demand" style={{ marginBottom: "56px", paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>
            SUPPLY → DEMAND
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            {/* Supply */}
            <div style={{ flex: 1, background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "10px", padding: "20px 22px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: dimText, margin: "0 0 10px 0" }}>SUPPLY</p>
              <p style={{ fontSize: "22px", fontWeight: 500, color: warmWhite, margin: "0 0 8px 0" }}>720M km</p>
              <p style={{ fontSize: "11.5px", color: "#a09888", margin: 0, lineHeight: 1.6 }}>
                Global annual fiber strand production. 87t germanium → 220t GeCl₄ → 24Kt preform → 720M strand-km. Preform lines at full utilization. One equipment supplier. Expansion cycle: 18-24 months.
              </p>
            </div>
            {/* Demand */}
            <div style={{ flex: 1, background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "10px", padding: "20px 22px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: dimText, margin: "0 0 10px 0" }}>DEMAND</p>
              <p style={{ fontSize: "22px", fontWeight: 500, color: warmWhite, margin: "0 0 8px 0" }}>~850M km</p>
              <p style={{ fontSize: "11.5px", color: "#a09888", margin: 0, lineHeight: 1.6 }}>
                Projected by 2027. Datacenter share of fiber demand rising from 5% to 30% (CRU). ~20 GW of AI capacity entering construction annually, each GW consuming ~6.5M strand-km. Compounded by $42B BEAD program and 50-60M km/yr drone demand.
              </p>
            </div>
            {/* Gap */}
            <div style={{ flex: 1, background: "#161a1e", border: `1px solid ${accent}33`, borderRadius: "10px", padding: "20px 22px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 10px 0", opacity: 0.7 }}>GAP</p>
              <p style={{ fontSize: "22px", fontWeight: 500, color: accent, margin: "0 0 8px 0" }}>130M km</p>
              <p style={{ fontSize: "11.5px", color: "#a09888", margin: 0, lineHeight: 1.6 }}>
                18% shortfall. Requires ~16t additional germanium from a supply fixed at ~230t and already fully allocated. New preform capacity won&apos;t arrive until end of 2027. CRU estimates the deficit widens before it narrows.
              </p>
            </div>
          </div>
        </div>

        {/* ═══ SECTION 5: SO WHAT ═══ */}
        <div id="so-what" style={{ paddingTop: 20 }}>
        {(() => {
          const body = "#a09888";
          const analysisBg = "#141210";
          const blue = "#6a9ab8";
          const soWhatBlocks: { id: string; label: string; question: string; teaser: string; analysis: { type: string; text?: string; author?: string; name?: string; desc?: string }[] }[] = [
            { id: "signals", label: "Market signals", question: "What is the price telling us?", teaser: "Fiber prices at 7-year high. Germanium up 4.5x since Jan 2024. Lead times past 60 weeks. At least one major manufacturer sold out through 2026.", analysis: [
                { type: "prose", text: "The fiber optic supply chain is exhibiting classic shortage pricing across every major input simultaneously \u2014 a pattern not seen since the telecom buildout of 2000. Standard telecom fiber (G.652D) has surged from approximately 20 RMB per core-km to 35-50+ RMB, a 70-120% increase representing a 7-year high. This is not a localized or transient spike. CRU data shows Chinese G.652D bare-fibre prices advanced more than 80% between November 2025 and January 2026 alone, with actual transactions occurring in the 40-50 yuan range." },
                { type: "prose", text: "Datacenter-grade fiber (G.657A), the bend-insensitive variant deployed in AI GPU clusters and military drone communication systems, has seen even steeper gains \u2014 surging from over 30 yuan per fiber-km to more than 50 yuan per fiber-km in a single month. G.654.E ultra-low-loss long-haul fiber and OM5 high-bandwidth multimode fiber command 20-30% premiums on top of already elevated prices. Hollow-core fiber trades at approximately 1,000x the price of standard G.652D, reflecting both its scarcity and its premium performance characteristics." },
                { type: "prose", text: "Upstream, the raw material picture is equally strained. Germanium metal prices have risen from $1,500/kg in January 2024 to over $7,000/kg in international markets \u2014 a 4.5x increase driven by the convergence of rising industrial demand and Chinese export controls. Helium, essential as a coolant in fiber draw towers, has increased 135% over two years following plant outages in Russia and the United States. Silicon tetrachloride, the bulk material in preform manufacturing, is up approximately 50% according to CRU." },
                { type: "prose", text: "Lead times tell the operational story. Ribbon fiber, the primary format for datacenter cabling, has stretched past 60 weeks from order to delivery. Loose tube fiber, used in outdoor infrastructure and FTTH deployments, is booked into Q3 2026. Normal lead times for the industry are 8-12 weeks \u2014 even during periods of moderate tightness they rarely exceed 15-20 weeks. The current levels are comparable only to the dot-com fiber buildout of 2000. At least one major fiber manufacturer has sold all of its inventory through the entirety of 2026." },
                { type: "quote", text: "In my professional career I\u2019ve never seen anything like this inflationary crunch.", author: "Wendell Weeks, CEO of Corning \u2014 the world\u2019s largest fiber producer \u2014 to the Financial Times" },
                { type: "prose", text: "Corning\u2019s actions confirm the severity: by October 2025, the company reportedly stopped selling bare glass fiber to other cable manufacturers in order to preserve supply for its own anchor customers. CEO Wendell Weeks declined to comment directly but acknowledged that \u201Cdemand for our products relative to our supply puts us in a situation where we are quite tight.\u201D Globally, fiber optic cable prices have climbed from a 2021 low of $3.70 per fibre-km to $6.30 \u2014 a 70% increase \u2014 with the steepest rises in Europe, India, and China." },
              ] },
            { id: "constraints", label: "Supply constraints", question: "Why can\u2019t supply respond?", teaser: "Three independent bottlenecks \u2014 preform equipment, GeCl\u2084 conversion, helium. CRU estimates 138M fiber-km shortfall in 2026. New capacity won\u2019t arrive until end of 2027.", analysis: [
                { type: "subhead", text: "Preform manufacturing equipment" },
                { type: "prose", text: "The global preform manufacturing base is operating at full utilization. Expanding capacity is not a matter of capital \u2014 it is a matter of equipment availability. Nearly all preform deposition systems worldwide are manufactured by a single company: Rosendahl Nextrom, a private Austrian firm headquartered in Vantaa, Finland, operating as part of the Knill Gruppe industrial group (established 1712). Nextrom produces the MCVD, PCVD, OVD, and VAD systems that every major fiber manufacturer depends on." },
                { type: "prose", text: "Every major fiber manufacturer is now attempting to expand simultaneously. The result is delivery backlogs of 18-24 months for new deposition equipment. Capacity ordered today will not produce fiber until 2028 at the earliest. This is not a problem that can be solved by spending more \u2014 there is a single supplier, and their production throughput is the physical ceiling on how fast the industry can grow." },
                { type: "prose", text: "Corning, the market leader with approximately 40% of global fiber manufacturing capacity, has responded by breaking ground on the Hickory project in North Carolina \u2014 what will be the world\u2019s largest optical cable manufacturing plant. The project is anchored by a $6 billion multi-year supply agreement with Meta. This represents a structural shift: hyperscalers are now co-investing in manufacturing infrastructure alongside producers, effectively reserving capacity years in advance." },
                { type: "subhead", text: "GeCl\u2084 conversion capacity" },
                { type: "prose", text: "Even if preform equipment constraints were resolved, the supply chain faces a deeper structural limitation: the conversion of raw germanium into fiber-grade GeCl\u2084. Only six facilities in the world perform this conversion at 8N purity. Four are in China, one is in Russia (JSC Germanium, allocated to military use), and one is in the west: Umicore\u2019s facility in Olen, Belgium." },
                { type: "prose", text: "Umicore\u2019s maximum facility capacity is estimated at 40-50 tonnes of germanium throughput per year. Current throughput is lower \u2014 approximately 16-18 tonnes \u2014 constrained by feedstock availability. As new germanium sources come online, Umicore\u2019s conversion capacity becomes the new ceiling." },
                { type: "prose", text: "This creates a paradox: the more successful western germanium supply diversification becomes, the more concentrated the downstream conversion bottleneck gets. Every new feedstock source that routes through Umicore strengthens Umicore\u2019s position as the single point of failure in the western fiber supply chain." },
                { type: "subhead", text: "Helium supply" },
                { type: "prose", text: "The third independent constraint operates at the fiber draw stage. Drawing fiber from a preform requires ultra-pure helium as a coolant \u2014 the glass strand must be rapidly cooled as it exits the 2,000\u00b0C furnace at speeds of 10-20 meters per second. There is no commercially viable substitute." },
                { type: "prose", text: "Global helium supply has been disrupted by plant outages in Russia and the United States. Helium spot prices soared to $15 per cubic meter in 2025, and the US Federal Helium Reserve is nearing depletion. Rosendahl Nextrom now actively markets helium recovery systems to fiber producers \u2014 a product that only exists because the shortage has become severe enough to justify the capital cost." },
                { type: "callout", text: "CRU estimates the global fiber shortfall will reach approximately 138 million fiber-km in 2026 \u2014 a shortfall rate of 16.7%. This gap is expected to widen in 2027. New preform capacity initiated in 2025 will not reach commercialization until end of 2027 at the earliest. Industry consensus: the price uptrend will persist through at least 2026-2027, with the full bull cycle spanning 2 to 3 years." },
              ] },
            { id: "competing", label: "Competing demand", question: "Who else needs this?", teaser: "AI datacenters, $42B federal broadband, military drones \u2014 all competing for the same fiber. Manufacturers cannibalizing telecom production for higher-margin datacenter fiber.", analysis: [
                { type: "subhead", text: "Federal broadband (BEAD)" },
                { type: "prose", text: "The US Broadband Equity, Access and Deployment program represents a $42 billion federal initiative to extend high-speed internet to rural and underserved communities. After years of delays, BEAD is finally entering its deployment phase in 2026. States are projecting to deploy just under 500,000 miles of fiber." },
                { type: "prose", text: "The timing could not be worse for fiber availability. Because BEAD was delayed so long, the AI datacenter buildout leapfrogged it in the manufacturing queue. Only three US vendors manufacture BABA-compliant glass: Corning, OFS, and Prysmian \u2014 the same factories serving Meta, Microsoft, and Amazon. The fiber shortage directly threatens a flagship federal broadband program." },
                { type: "subhead", text: "Military drone systems" },
                { type: "prose", text: "An often-overlooked source of fiber demand: UAV and drone communication systems require G.657A bend-insensitive fiber \u2014 the exact same fiber type AI datacenters need. Annual drone fiber demand reached 50-60 million fiber-km in 2025, approximately 10% of total global production. This is defense-grade procurement with national security priority, competing directly with commercial hyperscaler orders." },
                { type: "subhead", text: "Capacity cannibalization" },
                { type: "prose", text: "Perhaps the most underappreciated dynamic: fiber manufacturers are actively shifting production from standard G.652D telecom fiber to higher-margin G.657A datacenter and drone fiber. This does not increase total output \u2014 it redirects it." },
                { type: "prose", text: "Traditional telecom operators are getting squeezed from both sides: paying higher prices and waiting longer. Hyperscalers spent $416 billion on infrastructure in 2025, while global telecom capex is expected to decline 2% in 2026 (Dell\u2019Oro Group). In a supply-constrained market, whoever pays more gets served first." },
              ] },
            { id: "geopolitical", label: "Geopolitical risk", question: "How could it get worse?", teaser: "China controls 83% of germanium under export licensing. US ban suspended until Nov 2026. Western buyers paying 3.5x premium. Reimposition = supply shock.", analysis: [
                { type: "prose", text: "In August 2023, MOFCOM placed export licensing requirements on six germanium products. Chinese exports dropped approximately 55%. In December 2024, China banned all germanium exports to the United States. Suspended until November 2026, but the global dual-use license requirement remains in full force." },
                { type: "prose", text: "Western germanium now trades at approximately $7,000/kg versus Chinese domestic ~$2,000/kg \u2014 a 3.5x premium. The export licensing regime has severed the arbitrage mechanism: you cannot freely move germanium out of China, so the price divergence persists indefinitely." },
                { type: "prose", text: "Stimson Center analysis reveals: US germanium imports from China dropped by ~5,900 kg while Belgian imports rose by ~6,150 kg. Germanium is being routed through Belgium \u2014 processed by Umicore, then sold onward at international prices. Umicore captures the arbitrage spread." },
                { type: "prose", text: "Prysmian renewed its Umicore supply agreement in 2025, accepting a significant premium for supply security \u2014 a rational response to the new reality." },
                { type: "callout", text: "The November 2026 deadline represents a binary risk event. A reimposition of the US export ban \u2014 or further tightening to restrict flows to Belgium \u2014 would send an immediate supply shock through an already constrained market. Even without a ban, the persistent uncertainty functions as a de facto tax on western buyers." },
              ] },
            { id: "response", label: "Supply response", question: "What\u2019s being done?", teaser: "DRC ramping to Umicore. 5N Plus facility decision Nov 2026. All projects add feedstock \u2014 none add GeCl\u2084 conversion outside Umicore. Bottleneck concentrates further.", analysis: [
                { type: "item", name: "Umicore \u2014 EU Critical Raw Materials Act", desc: "Two EU-backed strategic projects: one focused on increasing germanium recovery yields, the other on new recycling technologies for complex waste. Meaningful process improvements \u2014 but optimization of an existing facility, not greenfield expansion. They improve Umicore\u2019s position without breaking the single-source dependency." },
                { type: "item", name: "5N Plus (TSX: VNP) \u2014 St. George, Utah", desc: "Received $14.4 million from US DoD under the Defense Production Act. Separately evaluating a broader germanium refining facility, decision expected November 2026. If approved, adds ~15-20 tonnes/yr \u2014 meaningful against current western supply of ~26 tonnes. The single most binary catalyst for western germanium supply independence." },
                { type: "item", name: "DRC / G\u00e9camines \u2014 Big Hill tailings (exclusive to Umicore)", desc: "STL operates the Big Hill site in Lubumbashi \u2014 14 million tonnes of century-old slag. First germanium concentrate exports October 2024 under exclusive Umicore offtake. Target: 30% of global germanium demand at full scale (~66 tonnes/yr). The most important new primary source of non-Chinese germanium in decades \u2014 but critically, all material flows to Umicore for GeCl\u2084 conversion." },
                { type: "item", name: "Kazakhstan \u2014 Pavlodar", desc: "Targeting ~15 tonnes/yr germanium restart. Adds raw feedstock, not conversion capacity." },
                { type: "item", name: "PPM Pure Metals \u2014 Langelsheim, Germany", desc: "Acquired by China\u2019s Vital Materials in December 2020. Now operates as Vital Pure Metal Solutions GmbH. Not independent western capacity \u2014 Chinese-owned and Chinese-controlled." },
                { type: "callout", text: "Every expansion project adds raw germanium feedstock. None add GeCl\u2084 conversion capacity outside of Umicore\u2019s single facility in Belgium. The feedstock constraint eases gradually. The conversion bottleneck concentrates further. Umicore\u2019s position strengthens with every tonne of new feedstock that has nowhere else to go." },
              ] },
            { id: "technology", label: "Technology", question: "What could change the game?", teaser: "Hollow-core fiber eliminates germanium entirely. Microsoft deploying. ~20,000 km by end 2026 vs billions installed. Arrives after the crisis peaks.", analysis: [
                { type: "subhead", text: "Hollow-core fiber (HCF)" },
                { type: "prose", text: "Hollow-core fiber represents the most fundamental potential disruption: it eliminates germanium from the manufacturing process entirely. Light travels through air enclosed within a microstructured cladding, approximately 30% faster than through glass. For latency-sensitive applications like HFT, AI training synchronization, and real-time inference, this performance advantage is significant." },
                { type: "prose", text: "Microsoft has deployed 1,280 km across Azure with zero field failures and 0.091 dB/km attenuation. Target: 15,000 km by late 2026. YOFC achieved world-record 0.040 dB/km in lab conditions and 91.2 km from a single preform draw." },
                { type: "prose", text: "However, total global HCF deployment by end of 2026 will be approximately 20,000 km \u2014 against billions of km installed and ~720 million fiber strand-km of annual production. HCF trades at ~1,000x the price of standard G.652D. It is a structural bear case for germanium demand on a 5-10 year horizon, not a near-term solution." },
                { type: "subhead", text: "PCVD deposition technology" },
                { type: "prose", text: "PCVD achieves over 95% GeCl\u2084 collection efficiency versus MCVD\u2019s 40-60%, approximately doubling effective germanium utilization per fiber-km. Also manufactured by Rosendahl Nextrom (OFC 11 system) \u2014 the same company that controls the MCVD bottleneck." },
                { type: "prose", text: "However, MCVD remains the dominant installed base with hundreds of systems and 25+ year lifespans. Equipment replacement cycles are measured in decades. Widespread PCVD adoption would slow germanium demand growth \u2014 it would not eliminate the dependency or reverse the current supply deficit." },
              ] },
          ];
          return (
            <div style={{ marginBottom: "56px" }}>
              <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>SO WHAT</p>
              <div style={{ display: "flex", flexDirection: "column" as const }}>
                {soWhatBlocks.map((block, i) => {
                  const isOpen = soWhatOpen === block.id;
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
                            if (item.type === "quote") return (<div key={j} style={{ borderLeft: `1px solid ${borderColor}`, paddingLeft: 16, margin: "20px 0" }}><p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 16, color: warmWhite, lineHeight: 1.5, margin: "0 0 6px 0", fontStyle: "italic" }}>{"\u201C"}{item.text}{"\u201D"}</p><p style={{ fontSize: 10, color: dimmer, margin: 0 }}>\u2014 {item.author}</p></div>);
                            if (item.type === "callout") return (<div key={j} style={{ borderLeft: `2px solid ${blue}50`, paddingLeft: 16, margin: "20px 0 0 0" }}><p style={{ fontSize: 12.5, color: body, lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{item.text}</p></div>);
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
          );
        })()}
        </div>

        {/* ═══ WHERE THE MONEY IS ═══ */}
        <div id="money" style={{ marginBottom: "40px", paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>
            WHERE THE MONEY IS
          </p>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {[
              { name: "Corning", ticker: "GLW \u00b7 NYSE", category: "Chokepoint holder", line1: "~40% of global fiber manufacturing capacity. Inventor of Contour cable for AI datacenter workloads.", line2: "Sold out through 2026. Stopped selling bare glass to competitors. $6B Meta anchor deal. Building world\u2019s largest cable plant in Hickory, NC. Pricing power from structural shortage." },
              { name: "Umicore", ticker: "UMI \u00b7 Euronext", category: "Chokepoint holder", line1: "Only western GeCl\u2084 converter. Sole supplier to every western and Japanese fiber manufacturer.", line2: "Exclusive DRC feedstock offtake. Capturing 3.5x arbitrage between Chinese and western germanium. Recycling monopoly through closed-loop tolling. Germanium upside hidden inside \u20ac3.9B diversified company." },
              { name: "5N Plus", ticker: "VNP \u00b7 TSX", category: "Capacity builder", line1: "Canadian germanium refiner with $14.4M DoD backing. Facility decision November 2026.", line2: "Approval roughly doubles western germanium capacity in 2-3 years. ~$300M market cap. The single most binary catalyst for western supply independence." },
              { name: "Prysmian", ticker: "PRY \u00b7 Borsa Italiana", category: "Capacity builder", line1: "Largest cable manufacturer globally. Vertically integrated from preform to installed cable.", line2: "Acquired North American preform capacity. Renewed Umicore GeCl\u2084 supply at premium. Lead investor in Relativity Networks (HCF startup). Positioned across conventional tightness and next-gen optionality." },
              { name: "Rosendahl Nextrom", ticker: "Private \u00b7 Knill Gruppe (Austria)", category: "Chokepoint holder", line1: "Near-monopoly on preform deposition equipment \u2014 MCVD, PCVD, OVD, VAD systems.", line2: "Defines the capacity ceiling for the entire fiber industry. 18-24 month delivery backlogs. Hundreds of systems delivered since 1990. Not directly investable but determines the timeline for everyone else." },
              { name: "YOFC", ticker: "6869 \u00b7 HKEX", category: "Technology", line1: "China\u2019s largest fiber manufacturer. World-record 0.040 dB/km hollow-core fiber in lab.", line2: "3,500t/yr preform capacity. Dual exposure: benefits from conventional supply tightness today while building HCF optionality. 91.2 km drawn from a single preform. Also developing multicore fiber." },
              { name: "Hollow-core fiber ecosystem", ticker: "Thematic", category: "Technology", line1: "Eliminates germanium from fiber entirely. Light through air, not doped glass. 30% lower latency.", line2: "Microsoft deploying on Azure (1,280 km, zero failures). Relativity Networks ($10.7M raised, Prysmian-backed). Lumenisity (Microsoft acquisition). ~1,000x current fiber price. Pre-commercial but rapidly advancing." },
              { name: "Germanium metal", ticker: "Physical commodity", category: "Direct exposure", line1: "$1,500 \u2192 $7,000+/kg in 18 months. Supply fixed at ~230t, 83% Chinese under export licensing.", line2: "No futures market. All OTC. 3.5x spread between Chinese domestic and western pricing persists because export controls prevent arbitrage. Nov 2026 ban expiry is binary event." },
            ].map((idea, i) => (
              <div key={i} style={{ display: "flex", background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: "18px 22px", transition: "border-color 0.15s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#333"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
              >
                <div style={{ width: 180, flexShrink: 0, paddingRight: 20, display: "flex", flexDirection: "column" as const, justifyContent: "center" }}>
                  <p style={{ fontSize: 13.5, color: warmWhite, fontWeight: 500, margin: "0 0 3px 0" }}>{idea.name}</p>
                  <p style={{ fontSize: 10.5, color: muted, margin: "0 0 6px 0", letterSpacing: "0.02em" }}>{idea.ticker}</p>
                  <p style={{ fontSize: 9, color: dimText, letterSpacing: "0.06em", margin: 0, textTransform: "uppercase" as const }}>{idea.category}</p>
                </div>
                <div style={{ width: 1, background: "#2a2620", flexShrink: 0, marginRight: 20 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, justifyContent: "center" }}>
                  <p style={{ fontSize: 12.5, color: "#c4bdb2", lineHeight: 1.6, margin: "0 0 4px 0", fontWeight: 500 }}>{idea.line1}</p>
                  <p style={{ fontSize: 12, color: "#a09888", lineHeight: 1.6, margin: 0 }}>{idea.line2}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
        {/* ═══ RISK ═══ */}
        <div id="risk" style={{ marginBottom: 56, paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>RISK</p>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.08em", color: "#4a4540", margin: "0 0 14px 0" }}>WHAT COULD EASE SUPPLY</p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                {[
                  { risk: "Preform capacity expansion arrives", assessment: "New lines ordered now won\u2019t produce until 2028. Rosendahl Nextrom backlogs at 18-24 months. But when capacity does arrive, supply pressure eases." },
                  { risk: "Germanium supply increases", assessment: "DRC ramp, 5N Plus facility, improved recovery \u2014 all add feedstock. But GeCl\u2084 conversion remains bottlenecked at Umicore." },
                  { risk: "China lifts germanium export controls", assessment: "Would reduce input costs for western fiber manufacturers. But preform equipment and helium constraints remain independent bottlenecks." },
                  { risk: "Helium supply stabilizes", assessment: "Qatar North Field and Namibia projects expected 2027-2028. Would remove one of three compounding constraints on draw tower throughput." },
                ].map((item, i) => (
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
                {[
                  { risk: "AI infrastructure spending slows", assessment: "Datacenter share of fiber demand rising from 5% to 30%. A correction reduces the growth rate but telecom, BEAD, and defense demand persist independently." },
                  { risk: "Hollow-core fiber reaches scale", assessment: "Eliminates germanium dependency entirely. Microsoft deploying. But ~20,000 km vs billions installed, ~1,000x standard fiber price. 2030+ risk." },
                  { risk: "Capacity cannibalization reverses", assessment: "If datacenter demand softens, manufacturers shift back to G.652D telecom fiber. Eases telecom shortage but signals broader demand weakness." },
                  { risk: "BEAD program delayed further", assessment: "Reduces near-term demand for BABA-compliant fiber. But frees capacity for datacenter builds \u2014 net neutral for total fiber demand." },
                ].map((item, i) => (
                  <div key={i}>
                    <p style={{ fontSize: 12.5, color: warmWhite, fontWeight: 500, margin: "0 0 4px 0" }}>{item.risk}</p>
                    <p style={{ fontSize: 11.5, color: muted, lineHeight: 1.6, margin: 0 }}>{item.assessment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: 16, marginTop: 20 }}>
            <p style={{ fontSize: 12, color: muted, lineHeight: 1.6, margin: 0 }}>Three independent bottlenecks \u2014 preform equipment, GeCl\u2084 conversion, and helium \u2014 must all ease simultaneously for supply to normalize. None resolve before 2027.</p>
          </div>
        </div>

        {/* Node modal */}
        <NodeModal
          nodeKey={selectedNode}
          allNodes={allNodes}
          layers={[]}
          chainLabel="GeO₂ / GeCl₄ Supply Tree"
          onClose={() => setSelectedNode(null)}
          onNavigate={() => {}}
        />

      </div>
    </div>
  );
}
