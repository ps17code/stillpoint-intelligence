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
          {/* Thesis */}
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "9px", letterSpacing: "0.1em", color: "#555", margin: "0 0 8px 0" }}>THESIS</p>
            <p style={{ fontSize: "14px", color: "#ece8e1", lineHeight: 1.6, margin: 0 }}>
              Severe supply constraints across the fiber optic value chain — from raw germanium to preform equipment — are driving prices to 7-year highs and lead times past 60 weeks. The chokepoint holders, capacity builders, and technology developers positioned along this chain stand to profit from a structural deficit that cannot close before 2027.
            </p>
          </div>
          {/* Description */}
          <p style={{ fontSize: "15px", color: "#908880", lineHeight: 1.6, margin: 0 }}>
            Fiber optic cable transmits data as pulses of light through hair-thin strands of glass. It is the physical layer connecting everything inside and between AI datacenters, telecom networks, and cross-ocean subsea systems. Every GPU cluster, every cloud region, every intercontinental data route depends on fiber.
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

        {/* ═══ SUPPLY → DEMAND ═══ */}
        <div style={{ marginBottom: "56px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: dimText, margin: "0 0 20px 0" }}>
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

        {/* ═══ WHERE THE MONEY IS ═══ */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: dimText, margin: "0 0 12px 0" }}>
            WHERE THE MONEY IS
          </p>
          {([
            { label: "CHOKEPOINT HOLDERS", desc: "Pricing power today. Control the tightest nodes. No catalyst needed.", ideas: [
              { name: "Corning", tag: "GLW \u00b7 NYSE", detail: "~40% of global fiber manufacturing. Sold out through 2026. Stopped selling bare glass to competitors. $6B Meta anchor deal. Building world\u2019s largest cable plant. Inventor of Contour cable for AI workloads." },
              { name: "Umicore", tag: "UMI \u00b7 Euronext Brussels", detail: "Only western GeCl\u2084 converter. Exclusive DRC feedstock offtake. Capturing the 3.5x price arbitrage between Chinese and western germanium. Germanium upside hidden inside a diversified materials company." },
              { name: "Germanium metal", tag: "Commodity \u00b7 Physical", detail: "Structurally constrained byproduct of zinc mining. $1,500 \u2192 $7,000+/kg in 18 months. Supply fixed at ~230t, 83% Chinese under export licensing." },
              { name: "Rosendahl Nextrom", tag: "Private \u00b7 Knill Gruppe (Austria)", detail: "Near-monopoly on preform deposition equipment. Defines the capacity ceiling for the entire fiber industry. 18-24 month backlogs. Not directly investable but determines the timeline for everyone else." },
            ], startups: [] as { name: string; desc: string }[] },
            { label: "CAPACITY BUILDERS", desc: "Investing to expand supply. Value accrues on execution.", ideas: [
              { name: "5N Plus", tag: "VNP \u00b7 TSX", detail: "Canadian germanium refiner. $14.4M DoD backing. Facility decision Nov 2026. Binary catalyst: approval roughly doubles western germanium capacity in 2-3 years." },
              { name: "Prysmian", tag: "PRY \u00b7 Borsa Italiana", detail: "Largest cable manufacturer globally. Acquired North American preform capacity. Renewed Umicore GeCl\u2084 supply at premium. Also lead investor in Relativity Networks (HCF)." },
              { name: "Corning \u2014 Hickory expansion", tag: "GLW \u00b7 NYSE", detail: "World\u2019s largest optical cable plant under construction. Meta-anchored with $6B multi-year agreement. 18-24 month timeline to full production." },
            ], startups: [
              { name: "DRC / G\u00e9camines (STL)", desc: "Big Hill tailings \u2014 14M tonnes of slag. Targeting 30% of global Ge supply. Exclusive Umicore offtake. Value accrues to Umicore, not the mine." },
              { name: "Kazakhstan \u2014 Pavlodar", desc: "~15t/yr germanium restart. Adds feedstock, not conversion capacity." },
            ] },
            { label: "TECHNOLOGY", desc: "Building technology that replaces or improves the value chain. Highest risk, largest potential payoff.", ideas: [
              { name: "Hollow-core fiber ecosystem", tag: "Thematic", detail: "Eliminates germanium entirely. Light through air, not doped glass. 30% lower latency. ~1,000x current fiber price. Microsoft scaling production with Corning and Heraeus. Pre-commercial but rapidly advancing." },
              { name: "YOFC", tag: "6869 \u00b7 HKEX", detail: "China\u2019s largest fiber manufacturer. World-record 0.040 dB/km HCF in lab. Dual exposure: benefits from conventional supply tightness today while building HCF optionality long-term." },
              { name: "Multicore fiber", tag: "Thematic", detail: "4x bandwidth per strand using space division multiplexing. Doesn\u2019t reduce germanium usage per core but multiplies capacity per cable \u2014 easing the strand-km gap without proportional material increase." },
            ], startups: [
              { name: "Relativity Networks", desc: "Orlando. HCF startup. $10.7M raised (Prysmian-led seed). Manufacturing at Prysmian\u2019s Eindhoven facility." },
              { name: "Lumenisity (Microsoft)", desc: "Southampton spin-out acquired by Microsoft Dec 2022. Core HCF R&D. Achieved 0.091 dB/km." },
              { name: "Lightera (Furukawa Electric)", desc: "Global entity from Furukawa\u2019s optical fiber businesses. Developing HCF splicing tools and multicore fiber ecosystem." },
              { name: "HFCL Limited", desc: "Indian fiber manufacturer. Partnered with IIT Delhi on DoT-funded HCF research for 6G and quantum communication." },
              { name: "Heraeus Covantis", desc: "German specialty glass manufacturer. Partnered with Microsoft and Corning on industrial-scale HCF production." },
            ] },
          ] as { label: string; desc: string; ideas: { name: string; tag: string; detail: string }[]; startups: { name: string; desc: string }[] }[]).map((cat, ci) => (
            <div key={ci} style={{ paddingBottom: 32 }}>
              <div style={{ paddingBottom: 16, borderTop: ci > 0 ? `1px solid ${borderColor}` : "none", paddingTop: ci > 0 ? 28 : 0 }}>
                <p style={{ fontSize: 10, letterSpacing: "0.08em", color: warmWhite, fontWeight: 500, margin: 0 }}>{cat.label}</p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
                {cat.ideas.map((idea, ii) => (
                  <div key={ii} style={{
                    flex: cat.ideas.length <= 3 ? "1 1 0" : "1 1 calc(25% - 8px)",
                    minWidth: cat.ideas.length <= 3 ? 0 : 200,
                    background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: "16px 18px",
                  }}>
                    <p style={{ fontSize: 13, color: warmWhite, fontWeight: 500, margin: "0 0 3px 0" }}>{idea.name}</p>
                    <p style={{ fontSize: 10, color: idea.tag.includes("Private") || idea.tag.includes("Thematic") || idea.tag.includes("Commodity") ? dimmer : accent, margin: "0 0 10px 0" }}>{idea.tag}</p>
                    <p style={{ fontSize: 11, color: muted, lineHeight: 1.6, margin: 0 }}>{idea.detail}</p>
                  </div>
                ))}
              </div>
              {cat.startups.length > 0 && (
                <div style={{ marginTop: 14, paddingLeft: 2 }}>
                  <p style={{ fontSize: 9, letterSpacing: "0.06em", color: dimmer, margin: "0 0 8px 0" }}>ALSO WATCHING</p>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                    {cat.startups.map((s, si) => (
                      <div key={si} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span style={{ width: 3, height: 3, borderRadius: "50%", background: dimmer, flexShrink: 0, marginTop: 6 }} />
                        <p style={{ fontSize: 11, color: muted, lineHeight: 1.5, margin: 0 }}>
                          <span style={{ color: "#a09888", fontWeight: 500 }}>{s.name}</span>{" \u2014 "}{s.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
