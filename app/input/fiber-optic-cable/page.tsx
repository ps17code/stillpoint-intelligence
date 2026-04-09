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
        {(() => {
          const body = "#a09888";
          const analysisBg = "#141210";
          const blue = "#6a9ab8";
          const soWhatBlocks: { id: string; label: string; question: string; teaser: string; analysis: { type: string; text?: string; author?: string; name?: string; desc?: string }[] }[] = [
            { id: "signals", label: "Market signals", question: "What is the price telling us?", teaser: "Fiber prices at 7-year high. Germanium up 4.5x since Jan 2024. Lead times past 60 weeks. At least one major manufacturer sold out through 2026.",
              analysis: [
                { type: "prose", text: "The fiber optic supply chain is exhibiting classic shortage pricing across every major input simultaneously \u2014 a pattern not seen since the telecom buildout of 2000. Standard telecom fiber (G.652D) has surged from approximately 20 RMB per core-km to 35-50+ RMB, a 70-120% increase representing a 7-year high." },
                { type: "prose", text: "Datacenter-grade fiber (G.657A) has seen even steeper gains \u2014 surging from over 30 yuan per fiber-km to more than 50 yuan per fiber-km in a single month. Germanium metal prices have risen from $1,500/kg in January 2024 to over $7,000/kg \u2014 a 4.5x increase. Helium, essential as a coolant in fiber draw towers, has increased 135% over two years." },
                { type: "prose", text: "Lead times tell the operational story. Ribbon fiber has stretched past 60 weeks from order to delivery. Normal lead times are 8-12 weeks. At least one major fiber manufacturer has sold all of its inventory through 2026." },
                { type: "quote", text: "In my professional career I\u2019ve never seen anything like this inflationary crunch.", author: "Wendell Weeks, CEO of Corning \u2014 the world\u2019s largest fiber producer \u2014 to the Financial Times" },
                { type: "prose", text: "Corning reportedly stopped selling bare glass fiber to other cable manufacturers in October 2025 to preserve supply for anchor customers. Globally, fiber optic cable prices have climbed from a 2021 low of $3.70 per fibre-km to $6.30 \u2014 a 70% increase." },
              ] },
            { id: "constraints", label: "Supply constraints", question: "Why can\u2019t supply respond?", teaser: "Three independent bottlenecks \u2014 preform equipment, GeCl\u2084 conversion, helium. CRU estimates 138M fiber-km shortfall in 2026. New capacity won\u2019t arrive until end of 2027.",
              analysis: [
                { type: "subhead", text: "Preform manufacturing equipment" },
                { type: "prose", text: "The global preform manufacturing base is operating at full utilization. Nearly all preform deposition systems worldwide are manufactured by a single company: Rosendahl Nextrom, a private Austrian firm. Every major fiber manufacturer is now attempting to expand simultaneously. Delivery backlogs of 18-24 months. Capacity ordered today will not produce fiber until 2028." },
                { type: "prose", text: "Corning broke ground on the Hickory project in North Carolina \u2014 anchored by a $6 billion multi-year supply agreement with Meta." },
                { type: "subhead", text: "GeCl\u2084 conversion capacity" },
                { type: "prose", text: "Only six facilities in the world convert germanium to fiber-grade GeCl\u2084 at 8N purity. Four in China, one in Russia, one in the west: Umicore in Olen, Belgium. Maximum facility capacity: 40-50 tonnes. As new germanium sources come online, Umicore\u2019s conversion capacity becomes the new ceiling." },
                { type: "prose", text: "This creates a paradox: the more successful western germanium diversification becomes, the more concentrated the downstream conversion bottleneck gets." },
                { type: "subhead", text: "Helium supply" },
                { type: "prose", text: "Drawing fiber requires ultra-pure helium as a coolant. Supply disrupted by plant outages in Russia and the US. Prices soared to $15/m\u00b3 in 2025. When constrained, producers reduce draw speeds \u2014 directly cutting global fiber output." },
                { type: "callout", text: "CRU estimates the global fiber shortfall will reach approximately 138 million fiber-km in 2026 \u2014 a shortfall rate of 16.7%. New preform capacity won\u2019t reach commercialization until end of 2027. Industry consensus: tight supply persists 2-3 years minimum." },
              ] },
            { id: "competing", label: "Competing demand", question: "Who else needs this?", teaser: "AI datacenters, $42B federal broadband, military drones \u2014 all competing for the same fiber. Manufacturers cannibalizing telecom production for higher-margin datacenter fiber.",
              analysis: [
                { type: "subhead", text: "Federal broadband (BEAD)" },
                { type: "prose", text: "The $42B US BEAD program needs ~500,000 miles of fiber. Finally rolling out in 2026 \u2014 at the exact same time as the AI datacenter surge. Only three US vendors produce BABA-compliant glass: Corning, OFS, Prysmian. Datacenter builds have leapfrogged BEAD in the manufacturing queue." },
                { type: "subhead", text: "Military drone systems" },
                { type: "prose", text: "UAV communication systems use G.657A fiber \u2014 the exact same type AI datacenters need. Annual drone fiber demand reached 50-60M fiber-km in 2025, approximately 10% of total global production. Defense-grade procurement competing directly with commercial hyperscaler orders." },
                { type: "subhead", text: "Capacity cannibalization" },
                { type: "prose", text: "Fiber manufacturers are shifting production from standard G.652D to higher-margin G.657A for datacenters and drones. Total output doesn\u2019t increase \u2014 it redirects. Hyperscalers spent $416B on infrastructure in 2025 vs flat-to-declining telco capex. Whoever pays more gets served first." },
              ] },
            { id: "geopolitical", label: "Geopolitical risk", question: "How could it get worse?", teaser: "China controls 83% of germanium under export licensing. US ban suspended until Nov 2026. Western buyers paying 3.5x premium. Reimposition = supply shock.",
              analysis: [
                { type: "prose", text: "In August 2023, MOFCOM placed export licensing requirements on six germanium products. Chinese germanium exports dropped approximately 55%. In December 2024, China banned all germanium exports to the US. Suspended until November 2026 \u2014 but the global dual-use license requirement remains in full force." },
                { type: "prose", text: "Western germanium now trades at ~$7,000/kg versus Chinese domestic ~$2,000/kg \u2014 a 3.5x premium. The export licensing regime has severed the arbitrage mechanism." },
                { type: "prose", text: "Prysmian renewed its Umicore supply agreement in 2025, accepting a significant premium for supply security. Umicore, positioned between Chinese supply and western demand, captures the spread." },
                { type: "callout", text: "The November 2026 deadline represents a binary risk event for the entire supply chain. A reimposition would send an immediate supply shock through an already constrained market." },
              ] },
            { id: "response", label: "Supply response", question: "What\u2019s being done?", teaser: "DRC ramping to Umicore. 5N Plus facility decision Nov 2026. All projects add feedstock \u2014 none add GeCl\u2084 conversion outside Umicore. Bottleneck concentrates further.",
              analysis: [
                { type: "item", name: "Umicore \u2014 EU Critical Raw Materials Act", desc: "Two EU-backed projects: increased germanium recovery yields and new recycling technologies. Process improvements at Olen \u2014 not greenfield expansion." },
                { type: "item", name: "5N Plus (TSX: VNP) \u2014 St. George, Utah", desc: "Received $14.4M from US DoD. Evaluating broader germanium refining facility, decision expected November 2026. If approved, adds ~15-20t/yr. The single most binary catalyst for western supply independence." },
                { type: "item", name: "DRC / G\u00e9camines \u2192 Umicore", desc: "STL\u2019s Big Hill tailings \u2014 14 million tonnes of century-old slag. First germanium concentrate exports October 2024 under exclusive Umicore offtake. Target: 30% of global demand at full scale. But all material flows to Umicore for GeCl\u2084 conversion." },
                { type: "item", name: "Kazakhstan \u2014 Pavlodar", desc: "Targeting ~15t/yr germanium restart. Adds raw feedstock, not conversion capacity." },
                { type: "item", name: "PPM Pure Metals \u2014 Langelsheim, Germany", desc: "Acquired by China\u2019s Vital Materials in December 2020. Not independent western capacity." },
                { type: "callout", text: "Every expansion project adds raw germanium feedstock. None add GeCl\u2084 conversion capacity outside of Umicore\u2019s single facility. The feedstock constraint eases over time. The conversion bottleneck concentrates further." },
              ] },
            { id: "technology", label: "Technology", question: "What could change the game?", teaser: "Hollow-core fiber eliminates germanium entirely. Microsoft deploying. ~20,000 km by end 2026 vs billions installed. Arrives after the crisis peaks.",
              analysis: [
                { type: "subhead", text: "Hollow-core fiber (HCF)" },
                { type: "prose", text: "Eliminates germanium entirely \u2014 light travels through air instead of doped glass. 30% lower latency. Microsoft deployed 1,280 km across Azure with zero field failures (0.091 dB/km loss), targeting 15,000 km by late 2026. YOFC achieved world-record 0.040 dB/km." },
                { type: "prose", text: "But total HCF deployment by end of 2026 will be ~20,000 km against billions installed. Trades at ~1,000x the price of standard G.652D. It is the structural bear case for germanium demand on a 5-10 year horizon, not a near-term solution." },
                { type: "subhead", text: "PCVD deposition technology" },
                { type: "prose", text: "Achieves over 95% GeCl\u2084 collection efficiency versus MCVD\u2019s 40-60%. Also manufactured by Rosendahl Nextrom. But MCVD remains the dominant installed base \u2014 hundreds of systems with 25+ year lifespans. Adoption slows demand growth; it does not reverse it." },
              ] },
          ];
          return (
            <div style={{ marginBottom: "56px" }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: dimText, margin: "0 0 24px 0" }}>SO WHAT</p>
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
