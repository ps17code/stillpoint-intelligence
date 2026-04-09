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
  const subGeo = useMemo(() => buildSubGeometry(subChain, subW / 2, 80), []);
  const compH = compGeo.outputNode.cy + 120;
  const subH = subGeo.outputNode.cy + 120;
  const subFirstXs = subGeo.layers[0].nodes.map(n => n.cx);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [treeExpanded, setTreeExpanded] = useState(false);
  const [soWhatOpen, setSoWhatOpen] = useState<string | null>(null);
  const toggleSoWhat = (id: string) => setSoWhatOpen(soWhatOpen === id ? null : id);
  const lc = chainsData.layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;
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
      <div style={{ padding: "18px 28px", borderBottom: "1px solid #1a1816" }}>
        <button
          onClick={() => window.history.back()}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          <span style={{ fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase" as const }}>
            <span style={{ color: warmWhite, fontWeight: 500 }}>Stillpoint</span>{" "}
            <span style={{ color: dimText }}>Intelligence</span>
          </span>
        </button>
      </div>

      {/* Page content — single column */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 32px 80px" }}>

        {/* ═══ SECTION 1: HOOK ═══ */}
        <div style={{ marginBottom: "56px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
            COMPONENT · AI INFRASTRUCTURE
          </p>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "36px",
            fontWeight: 400,
            color: warmWhite,
            margin: "0 0 16px 0",
            lineHeight: 1.2,
          }}>
            Fiber optic cable
          </h1>
          <p style={{
            fontSize: "16px",
            color: "#908880",
            lineHeight: 1.6,
            margin: 0,
          }}>
            Every AI model runs on infrastructure connected by fiber. AI datacenters consume 4–5x more fiber connections per rack than traditional compute. As hyperscale campuses scale past gigawatt power capacity, fiber demand is outpacing the supply chain&apos;s ability to deliver — and the upstream raw material that makes it all possible cannot scale.
          </p>
        </div>

        {/* ═══ SECTION 2: HOW IT'S MADE ═══ */}
        <div style={{ marginBottom: "56px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: dimText, margin: "0 0 20px 0" }}>
            HOW IT&apos;S MADE
          </p>

          <div style={{ display: "flex", gap: "12px" }}>

            {/* Card 1: GeCl₄ Conversion */}
            <div style={{
              flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                01 · GeCl₄ CONVERSION
              </p>
              <p style={{ fontSize: "11.5px", color: "#a09888", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Refined germanium powder is chemically converted into germanium tetrachloride — a volatile liquid that can be vaporized and deposited into glass to carry light.
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

            {/* Card 3: Draw & Cable Assembly */}
            <div style={{
              flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                03 · DRAW & CABLE ASSEMBLY
              </p>
              <p style={{ fontSize: "11.5px", color: "#a09888", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                The preform is heated in a draw tower and pulled into hair-thin fiber strands, coated for protection, then bundled with strength members and sheathing into finished cable.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHY IT&apos;S HARD</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Drawing and assembly are the least constrained steps. The bottleneck is upstream — you can only draw as much fiber as you have preforms. This step scales more easily than the ones before it.
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
        <div style={{ marginBottom: "56px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: dimText, margin: "0 0 20px 0" }}>
            SUPPLY TREE
          </p>
          {/* Key takeaway */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ borderLeft: "2px solid #3a6a8030", paddingLeft: 20 }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.1em", color: "#6a9ab8", margin: "0 0 10px 0" }}>KEY TAKEAWAY</p>
              <p style={{ fontSize: 12, color: "#a09888", lineHeight: 1.3, margin: 0 }}>
                <span style={{ color: "#ece8e1", fontWeight: 500 }}>~87t</span> of refined germanium enters the fiber supply chain annually — 38% of global supply. Converted to fiber-grade GeCl₄ by just 6 facilities worldwide. 4 in China, 1 in Russia, 1 in the west: Umicore, Belgium — sole supplier to the US, Europe, and Japan. ~20 preform manufacturers deposit GeCl₄ into glass. Corning holds ~40% of fiber manufacturing. Most players vertically integrated to assembly. Total output: <span style={{ color: "#ece8e1", fontWeight: 500 }}>~720M fiber strand-km/yr</span> serving datacenter, telecom, and subsea markets.
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
            <TreeMap geometry={compGeo} nodes={allNodes} layerConfig={lc} svgWidth={compW} svgHeight={compH} onNodeClick={setSelectedNode} onLayerClick={() => {}} layerPanels={{}} />
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
            {/* Full tree */}
            <div style={{ flex: 1, padding: "20px" }}>
              <TreeMap geometry={compGeo} nodes={allNodes} layerConfig={lc} svgWidth={compW} svgHeight={compH} onNodeClick={setSelectedNode} onLayerClick={() => {}} layerPanels={{}} />
              <svg viewBox={`0 0 ${subW} 80`} preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", height: "auto" }}>
                {subFirstXs.map((tx, i) => { const fx = subW / 2; return <path key={i} d={`M ${fx},0 C ${fx},40 ${tx},40 ${tx},80`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" strokeDasharray="4,3" />; })}
              </svg>
              <TreeMap geometry={subGeo} nodes={allNodes} layerConfig={lc} svgWidth={subW} svgHeight={subH} onNodeClick={setSelectedNode} onLayerClick={() => {}} layerPanels={{}} />
            </div>
          </div>
        )}

        {/* Node modal */}
        <NodeModal
          nodeKey={selectedNode}
          allNodes={allNodes}
          layers={[]}
          chainLabel="GeO₂ / GeCl₄ Supply Tree"
          onClose={() => setSelectedNode(null)}
          onNavigate={() => {}}
        />

        {/* ═══ SECTION 3: INPUT → OUTPUT ═══ */}
        <div style={{ marginBottom: "56px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: dimText, margin: "0 0 20px 0" }}>
            INPUT → OUTPUT
          </p>
          <div style={{
            display: "flex", alignItems: "center", gap: "0",
            background: cardBg, border: `1px solid ${borderColor}`,
            borderRadius: "10px", padding: "20px 24px",
          }}>
            {[
              { value: "~87t", label: "Germanium\ninput", sub: "of ~230t global supply" },
              { value: "~220t", label: "Fiber-grade\nGeCl₄ produced", sub: "after purification" },
              { value: "~24Kt", label: "Preform\nmanufactured", sub: "tonnes per year" },
              { value: "720M", label: "Fiber strand-km\nproduced", sub: "current annual output" },
            ].map((step, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" as const, position: "relative" as const }}>
                {i > 0 && (
                  <div style={{
                    position: "absolute" as const, left: "-4px", top: "50%",
                    transform: "translateY(-50%)", color: "#333", fontSize: "14px",
                  }}>→</div>
                )}
                <p style={{ fontSize: "20px", fontWeight: 500, color: warmWhite, margin: "0 0 4px 0" }}>{step.value}</p>
                <p style={{ fontSize: "10px", color: muted, lineHeight: 1.4, margin: "0 0 2px 0", whiteSpace: "pre-line" as const }}>{step.label}</p>
                <p style={{ fontSize: "9px", color: dimmer, margin: 0 }}>{step.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ SECTION 4: DEMAND PICTURE ═══ */}
        <div style={{ marginBottom: "56px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: dimText, margin: "0 0 20px 0" }}>
            DEMAND PICTURE
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              { number: "~20 GW", label: "AI datacenter capacity entering construction annually", detail: "23 GW under construction as of Sept 2025 (BNEF)", highlight: false },
              { number: "6.5M km", label: "Fiber strand-km required per GW of AI datacenter", detail: "Meta Hyperion: 2+ GW campus, 13M km of fiber (Corning)", highlight: false },
              { number: "130M km", label: "Incremental fiber demand — the supply gap", detail: "Total demand rises from 720M to ~850M km/yr", highlight: true },
            ].map((stat, i) => (
              <div key={i} style={{
                flex: 1, background: stat.highlight ? "#1c1a14" : cardBg,
                border: `1px solid ${stat.highlight ? gold + "33" : borderColor}`,
                borderRadius: "10px", padding: "16px 18px",
              }}>
                <p style={{ fontSize: "22px", fontWeight: 500, color: stat.highlight ? gold : warmWhite, margin: "0 0 6px 0" }}>{stat.number}</p>
                <p style={{ fontSize: "11px", color: "#a09888", lineHeight: 1.45, margin: "0 0 4px 0" }}>{stat.label}</p>
                <p style={{ fontSize: "10px", color: dimText, margin: 0 }}>{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ SECTION 5: SO WHAT ═══ */}
        <div style={{ marginBottom: "56px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: dimText, margin: "0 0 24px 0" }}>
            SO WHAT
          </p>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "10px", overflow: "hidden" }}>
            {([
              { id: "signals", label: "Market signals", question: "What is the price telling us?",
                bullets: ["Standard telecom fiber (G.652D) has surged 70-120% to a 7-year high. Datacenter fiber (G.657A) spiked 80% in a single month.", "Germanium metal has risen from $1,500/kg to over $7,000/kg since January 2024 \u2014 a 4.5x increase driven by demand and Chinese export controls.", "Lead times have stretched from a normal 8-12 weeks to over 60 weeks for ribbon fiber. At least one major manufacturer is sold out through 2026."],
                content: (<>
                  <div style={{ display: "flex", gap: "10px", margin: "0 0 18px 0" }}>
                    {[{ value: "70-120%", desc: "G.652D fiber price surge", sub: "~20 \u2192 35-50+ RMB/core-km" }, { value: "80%", desc: "G.657A datacenter fiber", sub: "Single month, Jan 2026" }, { value: "4.5x", desc: "Germanium metal price", sub: "$1,500 \u2192 $7,000+/kg" }, { value: "135%", desc: "Helium price increase", sub: "Draw tower coolant" }].map((s, i) => (
                      <div key={i} style={{ flex: 1 }}><p style={{ fontSize: "20px", fontWeight: 500, color: warmWhite, margin: "0 0 4px 0" }}>{s.value}</p><p style={{ fontSize: "10px", color: muted, margin: "0 0 2px 0", lineHeight: 1.35 }}>{s.desc}</p><p style={{ fontSize: "9px", color: dimmer, margin: 0 }}>{s.sub}</p></div>
                    ))}
                  </div>
                  <p style={{ fontSize: "12.5px", color: "#a09888", lineHeight: 1.7, margin: "0 0 14px 0" }}>Lead times for ribbon fiber have stretched past 60 weeks. Loose tube fiber booked into Q3 2026. Normal lead times are 8-12 weeks \u2014 last time they reached these levels was during the dot-com fiber buildout in 2000.</p>
                  <div style={{ borderLeft: `1px solid ${borderColor}`, paddingLeft: "14px", margin: "16px 0" }}>
                    <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: "15px", color: warmWhite, lineHeight: 1.5, margin: "0 0 4px 0", fontStyle: "italic" }}>{"\u201CIn my professional career I\u2019ve never seen anything like this inflationary crunch.\u201D"}</p>
                    <p style={{ fontSize: "9px", color: dimmer, margin: 0 }}>\u2014 Wendell Weeks, CEO Corning, to the Financial Times</p>
                  </div>
                  <p style={{ fontSize: "12.5px", color: "#a09888", lineHeight: 1.7, margin: "0 0 0 0" }}>Silicon tetrachloride, the bulk preform material, is up 50% (CRU). Corning reportedly stopped selling bare glass to other cable manufacturers in October 2025 to preserve supply for anchor customers.</p>
                </>)
              },
              { id: "constraints", label: "Supply constraints", question: "Why can\u2019t supply respond?",
                bullets: ["Preform deposition equipment is monopolized by a single private Austrian company \u2014 Rosendahl Nextrom. Every manufacturer is trying to expand. Backlogs are 18-24 months.", "Only one facility in the western world converts germanium to fiber-grade GeCl\u2084: Umicore in Belgium. Maximum throughput: 40-50 tonnes.", "Helium, essential for drawing fiber, is up 135% in two years.", "CRU estimates a 138M fiber-km shortfall in 2026 \u2014 a 16.7% gap."],
                content: (<>
                  <p style={{ fontSize: "11.5px", color: warmWhite, fontWeight: 500, margin: "0 0 6px 0" }}>Preform equipment</p>
                  <p style={{ fontSize: "12.5px", color: "#a09888", lineHeight: 1.7, margin: "0 0 14px 0" }}>Manufacturing lines at full utilization globally. Expanding capacity requires new deposition systems from Rosendahl Nextrom \u2014 a private Austrian company with near-monopoly on MCVD and PCVD equipment. Delivery backlogs: 18-24 months. Capacity ordered today produces fiber in 2028 at the earliest.</p>
                  <p style={{ fontSize: "11.5px", color: warmWhite, fontWeight: 500, margin: "0 0 6px 0" }}>GeCl\u2084 conversion</p>
                  <p style={{ fontSize: "12.5px", color: "#a09888", lineHeight: 1.7, margin: "0 0 14px 0" }}>Only six facilities worldwide convert germanium to fiber-grade GeCl\u2084. Four in China, one in Russia, one in the west: Umicore in Belgium. As demand scales beyond current production, germanium availability becomes a structural cap on how much fiber the world can produce.</p>
                  <p style={{ fontSize: "11.5px", color: warmWhite, fontWeight: 500, margin: "0 0 6px 0" }}>Helium</p>
                  <p style={{ fontSize: "12.5px", color: "#a09888", lineHeight: 1.7, margin: "0 0 14px 0" }}>Fiber draw towers require ultra-pure helium to cool glass strand as it\u2019s pulled. Supply disrupted by plant outages. Prices soared to $15/m\u00b3 in 2025. When constrained, producers reduce draw speeds \u2014 directly cutting global fiber output.</p>
                  <div style={{ borderLeft: `2px solid ${accent}50`, paddingLeft: "14px", margin: "16px 0" }}><p style={{ fontSize: "12px", color: "#a09888", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>CRU estimates a global fiber shortfall of ~138M fiber-km in 2026 \u2014 a 16.7% gap. New preform capacity won\u2019t come online until end of 2027 at earliest.</p></div>
                </>)
              },
              { id: "competing", label: "Competing demand", question: "Who else needs this?",
                bullets: ["The $42B US BEAD broadband program needs ~500,000 miles of fiber and is rolling out in 2026.", "Military drone systems consume 50-60M fiber-km per year \u2014 roughly 10% of global production.", "Manufacturers are cannibalizing standard telecom fiber for higher-margin datacenter fiber."],
                content: (<>
                  <p style={{ fontSize: "11.5px", color: warmWhite, fontWeight: 500, margin: "0 0 6px 0" }}>Federal broadband (BEAD)</p>
                  <p style={{ fontSize: "12.5px", color: "#a09888", lineHeight: 1.7, margin: "0 0 14px 0" }}>The $42B US BEAD program needs ~500,000 miles of fiber to connect rural America. Finally rolling out in 2026 \u2014 at the exact same time as the AI datacenter surge. Only three US vendors produce BABA-compliant glass: Corning, OFS, Prysmian. Datacenter builds have leapfrogged BEAD in the queue.</p>
                  <p style={{ fontSize: "11.5px", color: warmWhite, fontWeight: 500, margin: "0 0 6px 0" }}>Military drones</p>
                  <p style={{ fontSize: "12.5px", color: "#a09888", lineHeight: 1.7, margin: "0 0 14px 0" }}>UAV communication systems use G.657A fiber \u2014 the same type AI datacenters require. Annual drone fiber demand reached 50-60M fiber-km in 2025, approximately 10% of total global production.</p>
                  <p style={{ fontSize: "11.5px", color: warmWhite, fontWeight: 500, margin: "0 0 6px 0" }}>Capacity cannibalization</p>
                  <p style={{ fontSize: "12.5px", color: "#a09888", lineHeight: 1.7, margin: "0 0 0 0" }}>Fiber manufacturers are shifting production from standard G.652D to higher-margin G.657A for datacenters. Total output doesn\u2019t increase \u2014 it redirects. Telecom operators get squeezed.</p>
                </>)
              },
              { id: "geopolitical", label: "Geopolitical risk", question: "How could it get worse?",
                bullets: ["China placed export licensing on six germanium products in August 2023. Exports dropped 55%.", "Western buyers now pay a 3.5x premium over Chinese domestic prices.", "A reimposition of the ban would send a supply shock into an already constrained market."],
                content: (<>
                  <p style={{ fontSize: "12.5px", color: "#a09888", lineHeight: 1.7, margin: "0 0 14px 0" }}>August 2023: MOFCOM placed export licensing on six germanium products. Chinese exports dropped 55%. December 2024: China banned all germanium exports to the US. Suspended until November 2026 \u2014 but the global dual-use license requirement remains in full force.</p>
                  <div style={{ display: "flex", gap: "10px", margin: "16px 0" }}>
                    {[{ value: "~130t", desc: "Chinese Ge under export controls", sub: "Of ~230t global supply" }, { value: "3.5x", desc: "Western vs Chinese price premium", sub: "$7,000/kg vs ~$2,000/kg" }, { value: "55%", desc: "Drop in Chinese Ge exports", sub: "Following Aug 2023 controls" }].map((s, i) => (
                      <div key={i} style={{ flex: 1 }}><p style={{ fontSize: "20px", fontWeight: 500, color: warmWhite, margin: "0 0 4px 0" }}>{s.value}</p><p style={{ fontSize: "10px", color: muted, margin: "0 0 2px 0", lineHeight: 1.35 }}>{s.desc}</p><p style={{ fontSize: "9px", color: dimmer, margin: 0 }}>{s.sub}</p></div>
                    ))}
                  </div>
                  <div style={{ borderLeft: `2px solid ${accent}50`, paddingLeft: "14px", margin: "16px 0" }}><p style={{ fontSize: "12px", color: "#a09888", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>A reimposition of the US export ban in November 2026 would send a supply shock into an already constrained market. Even without a ban, the uncertainty forces western buyers to pay a premium for supply security.</p></div>
                </>)
              },
              { id: "response", label: "Supply response", question: "What\u2019s being done?",
                bullets: ["5N Plus in Canada is evaluating a germanium refining facility with decision expected November 2026.", "A DRC tailings deposit began shipping germanium concentrate to Umicore in 2024 under exclusive offtake.", "Every expansion project adds raw feedstock. None add GeCl\u2084 conversion capacity outside of Umicore."],
                content: (<>
                  {[{ name: "Umicore \u2014 EU CRM Act projects", text: "Two EU-backed initiatives to increase recovery yields and develop new recycling technologies. Process improvements at Olen \u2014 not greenfield expansion." }, { name: "5N Plus (TSX: VNP) \u2014 Canada", text: "Received $14.4M from US DoD. Evaluating broader germanium refining facility with decision expected November 2026. If approved, adds ~15-20t/yr. The single most binary catalyst for western supply independence." }, { name: "DRC / G\u00e9camines \u2192 Umicore", text: "STL\u2019s Big Hill tailings site. First concentrate exports October 2024 under exclusive Umicore offtake. Target: 30% of global germanium demand at full scale. But all material flows to Umicore for conversion." }, { name: "Kazakhstan \u2014 Pavlodar", text: "Reportedly targeting ~15t/yr germanium restart. Adds raw feedstock, not conversion capacity." }].map((item, i) => (
                    <div key={i} style={{ margin: "0 0 14px 0" }}><p style={{ fontSize: "12px", color: warmWhite, fontWeight: 500, margin: "0 0 3px 0" }}>{item.name}</p><p style={{ fontSize: "12px", color: muted, lineHeight: 1.6, margin: 0 }}>{item.text}</p></div>
                  ))}
                  <div style={{ borderLeft: `2px solid ${accent}50`, paddingLeft: "14px", margin: "16px 0" }}><p style={{ fontSize: "12px", color: "#a09888", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>Every expansion project adds raw germanium feedstock. None add GeCl\u2084 conversion capacity outside of Umicore. The conversion bottleneck concentrates further.</p></div>
                </>)
              },
              { id: "technology", label: "Technology", question: "What could change the game?",
                bullets: ["Hollow-core fiber eliminates germanium entirely. Microsoft deployed 1,280 km on Azure. But total deployment by end of 2026 is ~20,000 km against billions installed.", "PCVD deposition doubles germanium utilization efficiency. But MCVD is the dominant installed base with 25+ year equipment lifespans."],
                content: (<>
                  <p style={{ fontSize: "11.5px", color: warmWhite, fontWeight: 500, margin: "0 0 6px 0" }}>Hollow-core fiber (HCF)</p>
                  <p style={{ fontSize: "12.5px", color: "#a09888", lineHeight: 1.7, margin: "0 0 14px 0" }}>Eliminates germanium entirely \u2014 light travels through air instead of doped glass. 30% lower latency. Microsoft deployed 1,280 km across Azure with zero field failures. YOFC achieved world-record 0.040 dB/km. But total HCF deployment by end of 2026 will be ~20,000 km against billions installed. It is the structural bear case \u2014 but arrives after the supply crisis peaks.</p>
                  <p style={{ fontSize: "11.5px", color: warmWhite, fontWeight: 500, margin: "0 0 6px 0" }}>PCVD deposition</p>
                  <p style={{ fontSize: "12.5px", color: "#a09888", lineHeight: 1.7, margin: "0 0 0 0" }}>Plasma chemical vapor deposition achieves over 95% GeCl\u2084 collection efficiency versus MCVD\u2019s 40-60%. But MCVD remains the dominant installed base \u2014 hundreds of systems with 25+ year lifespans. Adoption slows demand growth; it does not reverse it.</p>
                </>)
              },
            ] as { id: string; label: string; question: string; bullets: string[]; content: React.ReactNode }[]).map((block, i) => {
              const isOpen = soWhatOpen === block.id;
              return (
                <div key={block.id}>
                  <div
                    onClick={() => toggleSoWhat(block.id)}
                    style={{ padding: "20px 24px", cursor: "pointer", borderTop: i > 0 ? `1px solid ${borderColor}` : "none", background: isOpen ? "#1e1c18" : "transparent", transition: "background 0.15s" }}
                    onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.background = "#1c1a16"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = isOpen ? "#1e1c18" : "transparent"; }}
                  >
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                        <p style={{ fontSize: "12px", color: isOpen ? warmWhite : "#a09888", fontWeight: 500, margin: 0, transition: "color 0.15s" }}>{block.label}</p>
                        <p style={{ fontSize: "11px", color: isOpen ? muted : dimText, margin: 0, fontStyle: "italic", transition: "color 0.15s" }}>{block.question}</p>
                      </div>
                      <div style={{ fontSize: "11px", color: isOpen ? "#a09888" : muted, flexShrink: 0, display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "4px", border: `1px solid ${isOpen ? "#333" : borderColor}`, transition: "all 0.15s" }}>
                        <span>{isOpen ? "Collapse" : "Expand"}</span>
                        <span style={{ transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "none", display: "inline-block", lineHeight: 1, fontSize: "12px" }}>{"\u203A"}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px", paddingLeft: "1px" }}>
                      {block.bullets.map((bullet, j) => (
                        <div key={j} style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
                          <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: dimText, flexShrink: 0, marginTop: "6px" }} />
                          <p style={{ fontSize: "11.5px", color: muted, lineHeight: 1.55, margin: 0 }}>{bullet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {isOpen && (
                    <div style={{ padding: "0 24px 24px 24px", background: "#1e1c18" }}>
                      <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: "20px" }}>
                        <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: dimText, margin: "0 0 14px 0" }}>ANALYSIS</p>
                        {block.content}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ SECTION 6: BIG PICTURE ═══ */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: dimText, margin: "0 0 20px 0" }}>
            BIG PICTURE
          </p>
          <div style={{ borderLeft: `2px solid ${gold}30`, paddingLeft: "20px" }}>
            <p style={{
              fontFamily: "'Instrument Serif', serif", fontSize: "20px",
              color: warmWhite, lineHeight: 1.45, margin: "0 0 16px 0",
            }}>
              The fiber supply chain is structurally unable to meet AI-driven demand. The companies that control the bottlenecks will capture outsized value.
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px" }}>
              {[
                { company: "Corning (GLW)", text: "Dominant fiber manufacturer. Invented Contour cable for AI workloads. $6B Meta deal. Sold out through 2026. Pricing power from constrained supply." },
                { company: "Umicore (UMI.BR)", text: "Only western GeCl₄ supplier. Exclusive DRC offtake could triple germanium throughput. Germanium upside hidden inside larger diversified company." },
                { company: "5N Plus (VNP.TSX)", text: "Canadian germanium refiner. Facility decision Nov 2026. DoD awarded $14.4M to expand wafer capacity. Binary catalyst for western supply independence." },
                { company: "Prysmian (PRY.MI)", text: "Largest cable manufacturer globally. Acquired North American preform capacity. Vertically integrated from preform to installed cable." },
              ].map((item, i) => (
                <div key={i}>
                  <p style={{ fontSize: "12px", color: warmWhite, fontWeight: 500, margin: "0 0 2px 0" }}>{item.company}</p>
                  <p style={{ fontSize: "11px", color: muted, lineHeight: 1.5, margin: 0 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
