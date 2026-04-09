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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 0 20px 0" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: dimText, margin: 0 }}>
              SUPPLY TREE
            </p>
            <button
              onClick={() => setTreeExpanded(true)}
              style={{
                fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: "0.04em",
                color: "#555", background: "none", border: `1px solid ${borderColor}`,
                borderRadius: 6, padding: "5px 12px", cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = warmWhite; e.currentTarget.style.borderColor = "#3a3835"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = borderColor; }}
            >
              Expand ↗
            </button>
          </div>
          <div style={{ border: `1px solid ${borderColor}`, borderRadius: "10px", overflow: "hidden", background: "#131210" }}>
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

        {/* ═══ SECTION 5: SO WHAT — INSIGHT CARDS ═══ */}
        <div style={{ marginBottom: "56px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: dimText, margin: "0 0 20px 0" }}>
            SO WHAT
          </p>
          <div style={{
            display: "flex", gap: "12px", overflowX: "auto" as const,
            paddingBottom: "8px",
          }}>
            {[
              { label: "SUPPLY DEFICIT", color: gold, text: "AI datacenter demand for fiber is growing faster than supply can ramp. Germanium — the key input — is a byproduct of zinc mining and structurally cannot scale. Global supply is ~230t/yr. It is already fully allocated." },
              { label: "CAPACITY BOTTLENECK", color: "#e07a5f", text: "Preform manufacturing lines are at full utilization globally. Only one company produces the deposition equipment needed to add new lines. Expansion takes 18–24 months minimum. Fiber lead times have gone from 8–12 weeks to over a year." },
              { label: "SINGLE SOURCE RISK", color: accent, text: "Umicore in Belgium is the only western supplier of fiber-grade GeCl₄. China controls 83% of germanium supply under export licensing. Russia\u2019s 5% is sanctioned. The entire western fiber supply chain runs through one facility in Olen." },
              { label: "PRICE SIGNAL", color: gold, text: "Germanium prices have doubled since China\u2019s export controls. Standard telecom fiber (G.652.D) is up 30%+ since early 2025. Specialty fiber for AI datacenters has surged 80% in a single month." },
              { label: "CATALYST", color: "#5bbf6a", text: "DRC/G\u00e9camines targeting 30% of world germanium supply from Big Hill tailings — exclusive offtake to Umicore. 5N Plus facility decision expected November 2026. Together these could triple western germanium capacity by end of decade." },
              { label: "DISRUPTION", color: "#9b6fbd", text: "Hollow-core fiber eliminates germanium entirely — light travels through air, not doped glass. 30% lower latency. Microsoft deploying on UK routes. Still pre-scale but being actively developed for datacenter interconnect." },
            ].map((card, i) => (
              <div key={i} style={{
                width: "220px", flexShrink: 0, background: cardBg,
                border: `1px solid ${borderColor}`, borderRadius: "10px", padding: "14px 16px",
              }}>
                <p style={{ fontSize: "9px", letterSpacing: "0.1em", color: card.color, margin: "0 0 8px 0", fontWeight: 500 }}>{card.label}</p>
                <p style={{ fontSize: "11px", color: "#a09888", lineHeight: 1.55, margin: 0 }}>{card.text}</p>
              </div>
            ))}
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
