"use client";
import React, { useMemo, useState } from "react";
import TreeMap from "@/components/TreeMap";
import NodeModal from "@/components/NodeModal";
import { buildRawGeometry, computeRawSvgWidth } from "@/lib/treeGeometry";
import chainsJson from "@/data/chains.json";
import nodesJson from "@/data/nodes.json";
import type { RawChain, NodeData } from "@/types";

const chainsData = chainsJson as unknown as {
  layerConfig: Record<string, { label?: string; displayFields: { key: string; label: string }[] }>;
  RAW_DATA: Record<string, RawChain>;
};
const allNodes = nodesJson as unknown as Record<string, NodeData>;

export default function GermaniumInputPage() {
  const rawChain = chainsData.RAW_DATA["Germanium"];
  const rawW = useMemo(() => computeRawSvgWidth(rawChain), []);
  const rawGeo = useMemo(() => buildRawGeometry(rawChain, rawW / 2, 80), []);
  const rawH = rawGeo.outputNode.cy + 120;
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [treeExpanded, setTreeExpanded] = useState(false);
  const [soWhatOpen, setSoWhatOpen] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("thesis");
  const lc = chainsData.layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;

  // Scroll spy
  React.useEffect(() => {
    const ids = ["thesis", "money", "supply-demand", "so-what", "how-its-made", "dependencies", "supply-tree"];
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

  const accent = "#c9a84c";
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

      {/* Table of contents — fixed left */}
      <nav style={{
        position: "fixed", top: 120, left: 32, zIndex: 10,
        display: "flex", flexDirection: "column" as const, gap: 12,
      }}>
        <style>{`@media (max-width: 1399px) { .toc-nav { display: none !important; } }`}</style>
        {[
          { id: "thesis", label: "Thesis" },
          { id: "money", label: "Where the money is" },
          { id: "supply-demand", label: "Supply \u2192 Demand" },
          { id: "so-what", label: "So what" },
          { id: "how-its-made", label: "How it\u2019s made" },
          { id: "dependencies", label: "Dependencies" },
          { id: "supply-tree", label: "Supply tree" },
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
      </nav>

      {/* Page content — single column */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 32px 80px" }}>

        {/* SECTION 1: HOOK */}
        <div id="thesis" style={{ marginBottom: "56px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
            RAW MATERIAL &middot; AI INFRASTRUCTURE
          </p>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "36px",
            fontWeight: 400,
            color: warmWhite,
            margin: "0 0 46px 0",
            lineHeight: 1.2,
          }}>
            Germanium
          </h1>
          {/* Executive summary */}
          <div style={{ background: "#1a1816", border: "1px solid #252220", borderRadius: 10, padding: "24px 28px", marginBottom: 56 }}>
            <p style={{ fontSize: 9, letterSpacing: "0.1em", color: "#555", margin: "0 0 16px 0" }}>EXECUTIVE SUMMARY</p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
              {[
                "Trace element recovered as a byproduct of zinc smelting and coal combustion. Cannot be mined directly.",
                "Doped into glass to create the refractive index that allows fiber optic cable to carry light. Also used in infrared defense optics, satellite solar cells, and SiGe semiconductors.",
                "Global supply fixed at ~230t/yr. 83% Chinese under export licensing. One western refiner \u2014 Umicore, Belgium \u2014 processes all non-Chinese, non-Russian supply through a single facility.",
                "Price has risen from $1,500/kg to over $8,500/kg in two years. 3.5x premium between western and Chinese markets persists because export controls prevent arbitrage.",
                "Demand accelerating from AI datacenter fiber buildout, defense IR optics spending, and satellite constellation expansion. Every end market stable or growing.",
                "No near-term supply relief. Hollow-core fiber, new mine capacity, and DRC feedstock ramp all target 2027-2028 at earliest.",
                "Umicore, 5N Plus, LightPath Technologies, and Blue Moon Metals are the primary names positioned across the chokepoint, capacity expansion, and substitution layers of this chain.",
              ].map((point, i, arr) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: i === arr.length - 1 ? "#6a9ab8" : "#3a3835", flexShrink: 0, marginTop: 7 }} />
                  <p style={{ fontSize: 13.5, color: i === arr.length - 1 ? "#ece8e1" : "#a09888", lineHeight: 1.65, margin: 0, fontWeight: i === arr.length - 1 ? 500 : 400 }}>{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WHERE THE MONEY IS */}
        <div id="money" style={{ marginBottom: "40px", paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>
            WHERE THE MONEY IS
          </p>
          {([
            { label: "CHOKEPOINT HOLDERS", desc: "Pricing power today. Control the tightest nodes. No catalyst needed.", ideas: [
              { name: "Umicore", tag: "UMI.BR", detail: "Sole western germanium refiner at scale. Olen, Belgium. >50% from recycled scrap. Exclusive DRC offtake. Capturing 3.5x price arbitrage. Germanium upside hidden inside \u20AC3.9B diversified company." },
              { name: "Germanium metal", tag: "Commodity \u00b7 Physical", detail: "$1,500 \u2192 $8,500+/kg in two years. 4x spread between Chinese and western markets. No futures market. Nov 2026 ban expiry is binary event." },
              { name: "Yunnan Chihong", tag: "600497.SH", detail: "China\u2019s largest Ge producer. ~66t/yr. State-owned Chinalco subsidiary. Domestic pricing creates 15-20% structural cost advantage for Chinese fiber manufacturers." },
            ], startups: [] as { name: string; desc: string }[] },
            { label: "CAPACITY BUILDERS", desc: "Investing to expand supply. Value accrues on execution.", ideas: [
              { name: "5N Plus", tag: "VNP \u00b7 TSX", detail: "Canadian germanium refiner. $14.4M DoD backing. Facility decision Nov 2026. Approval roughly doubles western capacity. Binary catalyst." },
              { name: "DRC / G\u00e9camines", tag: "Offtake", detail: "Big Hill tailings. 14M tonnes of slag. 700+ tonnes Ge potential. Target: 30% of global supply. Exclusive Umicore offtake." },
            ], startups: [] as { name: string; desc: string }[] },
            { label: "TECHNOLOGY", desc: "Building technology that replaces or improves the value chain. Highest risk, largest potential payoff.", ideas: [
              { name: "LightPath Technologies", tag: "LPTH \u00b7 NASDAQ", detail: "BlackDiamond chalcogenide glass replaces germanium in IR optics. FQ2 2026 revenue $16.4M (+120% YoY). NDAA mandates eliminating foreign optical glass by Jan 2030." },
              { name: "Blue Moon Metals", tag: "MOON \u00b7 TSXV", detail: "Acquired Apex mine in Utah from Teck (March 2026). First dedicated US germanium mine if it reaches production ~2028." },
              { name: "KoBold Metals", tag: "Private", detail: "AI-driven mineral exploration. $537M Series C. Could find new deposits but 10-15 year timeline." },
            ], startups: [
              { name: "Indium Corporation", desc: "US-based germanium recycler. Smaller scale than Umicore." },
              { name: "Teck Resources (TECK)", desc: "Red Dog mine in Alaska. Only US germanium source. Declining deposit." },
            ] },
          ] as { label: string; desc: string; ideas: { name: string; tag: string; detail: string }[]; startups: { name: string; desc: string }[] }[]).map((cat, ci) => (
            <div key={ci} style={{ paddingBottom: 32 }}>
              <div style={{ paddingBottom: 16, borderTop: ci > 0 ? `1px solid ${borderColor}` : "none", paddingTop: ci > 0 ? 28 : 0 }}>
                <p style={{ fontSize: 10, letterSpacing: "0.08em", color: warmWhite, fontWeight: 500, margin: 0 }}>{cat.label}</p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
                {cat.ideas.map((idea, ii) => (
                  <div key={ii} id={idea.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")} style={{
                    flex: cat.ideas.length <= 3 ? "1 1 0" : "1 1 calc(25% - 8px)",
                    minWidth: cat.ideas.length <= 3 ? 0 : 200,
                    background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: "16px 18px",
                  }}>
                    <p style={{ fontSize: 13, color: warmWhite, fontWeight: 500, margin: "0 0 3px 0" }}>{idea.name}</p>
                    <p style={{ fontSize: 10, color: idea.tag.includes("Private") || idea.tag.includes("Thematic") || idea.tag.includes("Commodity") || idea.tag.includes("Offtake") ? dimmer : accent, margin: "0 0 10px 0" }}>{idea.tag}</p>
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

        {/* SUPPLY -> DEMAND */}
        <div id="supply-demand" style={{ marginBottom: "56px", paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>
            SUPPLY &rarr; DEMAND
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            {/* Supply */}
            <div style={{ flex: 1, background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "10px", padding: "20px 22px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: dimText, margin: "0 0 10px 0" }}>SUPPLY</p>
              <p style={{ fontSize: "22px", fontWeight: 500, color: warmWhite, margin: "0 0 8px 0" }}>~230t/yr</p>
              <p style={{ fontSize: "11.5px", color: "#a09888", margin: 0, lineHeight: 1.6 }}>
                Global germanium supply. ~120t Chinese primary (export controlled), ~90t global recycled, ~11t Russian (sanctioned). Byproduct of zinc and coal &mdash; cannot scale independently.
              </p>
            </div>
            {/* Demand */}
            <div style={{ flex: 1, background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "10px", padding: "20px 22px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: dimText, margin: "0 0 10px 0" }}>DEMAND</p>
              <p style={{ fontSize: "22px", fontWeight: 500, color: warmWhite, margin: "0 0 8px 0" }}>~246t/yr</p>
              <p style={{ fontSize: "11.5px", color: "#a09888", margin: 0, lineHeight: 1.6 }}>
                Projected. Fiber optics (~87t, 38%), IR optics (~55t, 24%), satellite solar (~35t, 15%), SiGe semiconductors (~25t, 11%), other (~28t, 12%). Every end market stable or growing.
              </p>
            </div>
            {/* Gap */}
            <div style={{ flex: 1, background: "#1a1810", border: `1px solid ${accent}33`, borderRadius: "10px", padding: "20px 22px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 10px 0", opacity: 0.7 }}>GAP</p>
              <p style={{ fontSize: "22px", fontWeight: 500, color: accent, margin: "0 0 8px 0" }}>~16t</p>
              <p style={{ fontSize: "11.5px", color: "#a09888", margin: 0, lineHeight: 1.6 }}>
                Shortfall from fiber demand growth alone. Western-accessible supply of ~26t cannot cover the gap without Chinese cooperation.
              </p>
            </div>
          </div>
        </div>

        {/* SO WHAT */}
        <div id="so-what" style={{ paddingTop: 20 }}>
        {(() => {
          const body = "#a09888";
          const analysisBg = "#141210";
          const gold = "#c9a84c";
          const soWhatBlocks: { id: string; label: string; question: string; teaser: string; analysis: { type: string; text?: string; author?: string; name?: string; desc?: string }[] }[] = [
            { id: "signals", label: "Market signals", question: "What is the price telling us?", teaser: "$1,500 \u2192 $8,500+/kg in two years. 4x spread between Chinese and western markets. No futures market. Physical commodity with no hedging mechanism.", analysis: [
                { type: "prose", text: "Germanium prices have risen from approximately $1,500/kg in early 2024 to over $8,500/kg in international markets \u2014 a 5.7x increase in two years. This is not a speculative bubble: germanium has no futures market, no ETF, no derivatives. The price is set by physical transactions between a small number of producers and consumers." },
                { type: "prose", text: "The spread between Chinese domestic and western international prices has reached 3.5-4x. Chinese producers sell domestically at ~$2,000-2,500/kg while western buyers pay $7,000-8,500/kg. This arbitrage exists because MOFCOM export licensing prevents free flow of material. The spread is a direct measure of the geopolitical premium." },
                { type: "prose", text: "The November 2026 ban expiry is the single most important near-term catalyst. If the US export ban is reimposed or expanded to cover Belgian re-exports, the western price could spike further. If it lapses, prices may moderate \u2014 but the dual-use licensing regime remains in force regardless, maintaining structural friction." },
                { type: "callout", text: "There is no way to short germanium. No futures, no options, no ETF. The only way to express a view is through equities (Umicore, 5N Plus, Yunnan Chihong) or physical accumulation. This illiquidity amplifies price moves in both directions." },
              ] },
            { id: "constraints", label: "Supply constraints", question: "Why can\u2019t supply respond?", teaser: "Zinc byproduct. Can\u2019t mine it directly. Global production tied to zinc smelting economics. Recycling at ~90t/yr already near maximum recovery rates.", analysis: [
                { type: "prose", text: "Germanium is never the primary product of any mine. It exists at 50-800 parts per million inside zinc ores and coal fly ash. Global production is a function of zinc smelting volume, not germanium demand. When germanium prices rise, zinc miners cannot simply \u201Cproduce more germanium\u201D \u2014 they would need to smelt more zinc, which requires zinc prices to justify the economics." },
                { type: "prose", text: "Primary production is approximately 120 tonnes per year from Chinese zinc smelters and coal operations. Recycling contributes approximately 90 tonnes, primarily from fiber optic scrap, IR lens rework, and electronic waste. Russian production (~11t) is effectively unavailable to western buyers due to sanctions." },
                { type: "prose", text: "The recycling channel is already operating near theoretical maximum recovery rates. Umicore recovers >50% of its germanium input from recycled sources. Incremental gains are possible but the recycling pool is fundamentally limited by the volume of germanium-containing products reaching end-of-life." },
                { type: "subhead", text: "The byproduct trap" },
                { type: "prose", text: "This is the core structural issue: germanium supply is inelastic to germanium price. Even at $8,500/kg, no zinc smelter will increase throughput for the germanium alone \u2014 the economics don\u2019t work. A zinc smelter processing 200,000 tonnes of concentrate might recover 5-10 tonnes of germanium. At $8,500/kg that\u2019s $42-85M of revenue against a zinc operation generating $500M+. The germanium is a rounding error in the zinc P&L." },
                { type: "callout", text: "The only way to meaningfully increase germanium supply is to find new primary sources (like the DRC tailings) or to reduce demand through substitution. Neither happens quickly. The DRC ramp to Umicore is the most significant new source in decades, and it routes through a single western refiner." },
              ] },
            { id: "competing", label: "Competing demand", question: "Who else needs germanium?", teaser: "Fiber optics takes 38% but IR defense, satellite solar, SiGe chips all need it. Every end market stable or growing. No demand destruction in sight.", analysis: [
                { type: "subhead", text: "Fiber optics (~87t, 38%)" },
                { type: "prose", text: "The largest single consumer. Germanium-doped glass creates the refractive index gradient that allows fiber to carry light. The AI datacenter buildout is driving unprecedented fiber demand \u2014 CRU projects a 138M fiber-km shortfall in 2026. Every strand-km of fiber requires germanium." },
                { type: "subhead", text: "IR optics (~55t, 24%)" },
                { type: "prose", text: "Germanium is transparent to infrared wavelengths (2-14 \u03BCm), making it the standard lens material for thermal imaging cameras, FLIR systems, and missile guidance optics. Defense demand is growing with drone proliferation and modernization programs. NDAA mandates are pushing DoD away from Chinese-sourced optical glass." },
                { type: "subhead", text: "Satellite solar cells (~35t, 15%)" },
                { type: "prose", text: "Multi-junction solar cells for space applications use germanium wafers as the substrate. LEO constellation buildouts (Starlink, Kuiper, OneWeb) are driving volume growth. Each satellite requires germanium-based solar panels for power generation." },
                { type: "subhead", text: "SiGe semiconductors (~25t, 11%)" },
                { type: "prose", text: "Silicon-germanium alloys are used in high-frequency RF chips for 5G, radar, and electronic warfare applications. IBM\u2019s SiGe technology powers high-performance analog and mixed-signal devices. Demand is stable with growth tied to 5G infrastructure rollout." },
                { type: "callout", text: "The critical insight: there is no declining end market. Fiber is surging, IR defense is growing, satellite solar is growing, SiGe is stable. Total demand can only increase from current levels. Supply cannot respond proportionally. The deficit is structural." },
              ] },
            { id: "geopolitical", label: "Geopolitical risk", question: "How could it get worse?", teaser: "China controls 83%. MOFCOM licensing since Aug 2023. US ban suspended until Nov 2026. Western buyers paying 3.5x premium. Reimposition = supply shock.", analysis: [
                { type: "prose", text: "In August 2023, China\u2019s Ministry of Commerce placed export licensing requirements on six germanium products. Chinese germanium exports dropped approximately 55% within months. In December 2024, China banned all germanium exports to the United States \u2014 suspended until November 2026, but the global dual-use license requirement remains in full force." },
                { type: "prose", text: "The licensing regime has created a two-tier market. Chinese domestic germanium trades at ~$2,000-2,500/kg. Western international prices exceed $7,000-8,500/kg. The spread reflects the cost of routing material through approved channels \u2014 primarily Belgian processing via Umicore." },
                { type: "prose", text: "Stimson Center analysis shows US germanium imports from China dropped by ~5,900 kg while Belgian imports rose by ~6,150 kg in the same period. The material is being re-routed, not eliminated. Umicore captures the arbitrage spread on every kilogram." },
                { type: "subhead", text: "November 2026: binary event" },
                { type: "prose", text: "The suspended US export ban expires in November 2026. Three scenarios: (1) Ban lapses \u2014 some price relief but dual-use licensing remains. (2) Ban reimposed \u2014 western prices spike further. (3) Ban expanded to cover Belgian re-exports \u2014 severe supply shock to the entire western fiber and defense supply chain." },
                { type: "callout", text: "Even the best-case scenario (ban lapsing) does not eliminate the structural premium. The dual-use licensing regime remains in force. Every western buyer must apply for and receive Chinese government approval for each germanium shipment. This is a permanent friction cost, not a temporary disruption." },
              ] },
            { id: "response", label: "Supply response", question: "What\u2019s being done?", teaser: "DRC ramping to Umicore. 5N Plus decision Nov 2026. All projects add feedstock but western conversion remains single-source.", analysis: [
                { type: "item", name: "DRC / G\u00e9camines \u2014 Big Hill tailings (exclusive to Umicore)", desc: "STL operates the Big Hill site in Lubumbashi \u2014 14 million tonnes of century-old slag containing 700+ tonnes of germanium. First concentrate exports October 2024 under exclusive Umicore offtake. Target: 30% of global germanium demand at full scale. The most important new primary source of non-Chinese germanium in decades." },
                { type: "item", name: "5N Plus (TSX: VNP) \u2014 St. George, Utah", desc: "Received $14.4 million from US DoD under the Defense Production Act. Evaluating a broader germanium refining facility with decision expected November 2026. If approved, adds ~15-20 tonnes/yr \u2014 meaningful against current western supply of ~26 tonnes. The single most binary catalyst for western germanium supply independence." },
                { type: "item", name: "Blue Moon Metals \u2014 Apex mine, Utah", desc: "Acquired from Teck Resources in March 2026. Historic germanium producer. Would be the first dedicated US germanium mine if it reaches production, targeted for ~2028. Early stage but strategically significant." },
                { type: "item", name: "Kazakhstan \u2014 Pavlodar restart", desc: "Targeting ~15 tonnes/yr germanium production restart. Adds raw feedstock to global supply, not western conversion capacity." },
                { type: "callout", text: "Every expansion project adds raw germanium feedstock. The DRC is the most significant. But all western material routes through Umicore for refining. 5N Plus is the only project that would add independent western refining capacity. Its November 2026 decision is the single most important catalyst for breaking the Umicore single-source dependency." },
              ] },
            { id: "technology", label: "Technology", question: "What could replace germanium?", teaser: "BlackDiamond glass replacing Ge in IR optics. Hollow-core fiber eliminates Ge in telecom. But substitution is partial and slow.", analysis: [
                { type: "subhead", text: "IR optics substitution \u2014 LightPath Technologies" },
                { type: "prose", text: "LightPath\u2019s BlackDiamond chalcogenide glass is a direct germanium replacement for infrared optics applications. FQ2 2026 revenue reached $16.4M, up 120% year-over-year, driven by defense contracts. The NDAA mandates eliminating foreign-sourced optical glass from US defense systems by January 2030, creating a regulatory tailwind." },
                { type: "prose", text: "BlackDiamond is lighter, moldable (vs. germanium which must be diamond-turned), and does not rely on Chinese supply chains. For defense IR applications, substitution is actively underway. However, IR optics represent only 24% of germanium demand. Even full substitution in this segment would reduce total demand by ~55 tonnes \u2014 meaningful but not sufficient to close the deficit." },
                { type: "subhead", text: "Hollow-core fiber \u2014 eliminating germanium from telecom" },
                { type: "prose", text: "Hollow-core fiber transmits light through air rather than germanium-doped glass. Microsoft has deployed 1,280 km across Azure with zero field failures. Total global HCF deployment by end of 2026 will be approximately 20,000 km \u2014 against billions of km installed. HCF trades at ~1,000x the price of standard fiber." },
                { type: "prose", text: "HCF is a structural bear case for germanium demand on a 5-10 year horizon. It is not a near-term solution. Fiber optics consumes 38% of germanium supply. Even a 10% HCF penetration of new fiber deployment would reduce germanium demand by only ~9 tonnes." },
                { type: "callout", text: "Substitution is real but slow. BlackDiamond addresses IR optics (24% of demand). Hollow-core fiber addresses telecom (38% of demand). Neither reaches meaningful scale before 2028-2030. The germanium deficit persists through the substitution timeline." },
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
                            if (item.type === "quote") return (<div key={j} style={{ borderLeft: `1px solid ${borderColor}`, paddingLeft: 16, margin: "20px 0" }}><p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 16, color: warmWhite, lineHeight: 1.5, margin: "0 0 6px 0", fontStyle: "italic" }}>{"\u201C"}{item.text}{"\u201D"}</p><p style={{ fontSize: 10, color: dimmer, margin: 0 }}>&mdash; {item.author}</p></div>);
                            if (item.type === "callout") return (<div key={j} style={{ borderLeft: `2px solid ${gold}50`, paddingLeft: 16, margin: "20px 0 0 0" }}><p style={{ fontSize: 12.5, color: body, lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{item.text}</p></div>);
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

        {/* HOW IT'S MADE */}
        <div id="how-its-made" style={{ marginBottom: "56px", paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>
            HOW IT&apos;S MADE
          </p>

          <div style={{ display: "flex", gap: "12px" }}>

            {/* Card 1: Extraction */}
            <div style={{
              flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                01 &middot; EXTRACTION FROM HOST ORE
              </p>
              <p style={{ fontSize: "11.5px", color: "#a09888", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Germanium is recovered as a byproduct of zinc smelting and coal combustion. Zinc concentrate is roasted and leached; germanium-rich residues are collected from flue dust and leach solutions.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHY IT&apos;S HARD</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Germanium exists at 50-800 ppm in host ores. Recovery requires specialized hydrometallurgical circuits that most zinc smelters don&apos;t install. Production cannot scale independently of zinc economics.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHO CAN DO IT</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 0 0", flex: 1 }}>
                ~10 zinc smelters worldwide recover germanium. China dominates with ~83% of primary production. DRC tailings represent a new non-smelter source via Umicore offtake.
              </p>
              <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #222018" }}>
                <span style={{ fontSize: "12px", color: warmWhite, fontWeight: 500 }}>~140t</span>
                <span style={{ fontSize: "9px", color: dimText, marginLeft: "6px" }}>primary germanium extracted annually</span>
              </div>
            </div>

            {/* Card 2: Refining */}
            <div style={{
              flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                02 &middot; REFINING TO HIGH PURITY
              </p>
              <p style={{ fontSize: "11.5px", color: "#a09888", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Crude germanium dioxide is reduced to metal, then purified through zone refining to 5N+ (99.999%) purity. For fiber optics, it is converted to GeCl&#8324; and further purified to 8N (99.999999%).
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHY IT&apos;S HARD</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Fiber-grade GeCl&#8324; requires removing arsenic and other trace contaminants to parts-per-billion levels. Proprietary techniques that cannot be purchased off the shelf. Zone refining is energy-intensive and slow.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHO CAN DO IT</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 0 0", flex: 1 }}>
                Only 6 facilities produce fiber-grade GeCl&#8324;. 4 in China, 1 in Russia, 1 in the west: Umicore in Olen, Belgium. 5N Plus could become the second western refiner.
              </p>
              <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #222018" }}>
                <span style={{ fontSize: "12px", color: warmWhite, fontWeight: 500 }}>~230t</span>
                <span style={{ fontSize: "9px", color: dimText, marginLeft: "6px" }}>refined germanium produced annually (primary + recycled)</span>
              </div>
            </div>

            {/* Card 3: Conversion to end products */}
            <div style={{
              flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                03 &middot; CONVERSION TO END PRODUCTS
              </p>
              <p style={{ fontSize: "11.5px", color: "#a09888", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Refined germanium is converted into application-specific forms: GeCl&#8324; for fiber optic preforms, GeO&#8322; blanks for IR optics, single-crystal wafers for satellite solar cells, and SiGe substrates for semiconductors.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHY IT&apos;S HARD</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Each end product requires different purity levels and crystal structures. Fiber-grade GeCl&#8324; needs 8N purity. IR blanks need specific optical homogeneity. Solar wafers need precise crystal orientation. No single facility serves all markets.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHO CAN DO IT</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 0 0", flex: 1 }}>
                Specialized converters for each application. Umicore (GeCl&#8324;), Umicore + Chinese firms (IR blanks), AXT and others (solar wafers), IQE and GlobalFoundries (SiGe substrates).
              </p>
              <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #222018" }}>
                <span style={{ fontSize: "12px", color: warmWhite, fontWeight: 500 }}>5 markets</span>
                <span style={{ fontSize: "9px", color: dimText, marginLeft: "6px" }}>competing for the same ~230t supply</span>
              </div>
            </div>

          </div>
        </div>

        {/* DEPENDENCIES */}
        <div id="dependencies" style={{ paddingTop: 20 }}>

        <p style={{ fontSize: 20, letterSpacing: "0.06em", color: "#555", margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>DEPENDENCIES</p>

        {/* Downstream table */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", margin: "0 0 20px 0" }}>DOWNSTREAM &mdash; WHERE GERMANIUM GOES</p>
          <div style={{ display: "flex", padding: "0 0 10px 0", borderBottom: "1px solid #252220" }}>
            {[{ l: "Product", w: "18%" }, { l: "Usage", w: "13%" }, { l: "Share", w: "10%" }, { l: "End uses", w: "24%" }, { l: "Growth", w: "12%", right: true }].map(h => (
              <p key={h.l} style={{ fontSize: 9, letterSpacing: "0.06em", color: "#4a4540", margin: 0, width: h.w, textAlign: (h as { right?: boolean }).right ? "right" as const : undefined }}>{h.l}</p>
            ))}
          </div>
          {[
            { product: "Fiber optic cable", usage: "~87t/yr", share: "38%", endUses: "AI datacenters, telecom, subsea, UAVs", growth: "Surging", linked: true },
            { product: "IR optics", usage: "~55t/yr", share: "24%", endUses: "Thermal imaging, missile guidance", growth: "Growing", linked: false },
            { product: "Satellite solar cells", usage: "~35t/yr", share: "15%", endUses: "Space systems, LEO constellations", growth: "Growing", linked: false },
            { product: "SiGe semiconductors", usage: "~25t/yr", share: "11%", endUses: "5G RF, radar, electronic warfare", growth: "Stable", linked: false },
            { product: "Other", usage: "~28t/yr", share: "12%", endUses: "Catalysts, phosphors, PET", growth: "Stable", linked: false },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: "1px solid #252220", cursor: row.linked ? "pointer" : "default", transition: "background 0.15s" }}
              onMouseEnter={e => { if (row.linked) { e.currentTarget.style.background = "#1a1816"; const n = e.currentTarget.querySelector("[data-name]") as HTMLElement; if (n) n.style.color = "#ece8e1"; } }}
              onMouseLeave={e => { if (row.linked) { e.currentTarget.style.background = "transparent"; const n = e.currentTarget.querySelector("[data-name]") as HTMLElement; if (n) n.style.color = "#a09888"; } }}
              onClick={() => { if (row.linked) window.location.href = "/input/fiber-optic-cable"; }}
            >
              <div style={{ width: "18%", display: "flex", alignItems: "baseline", gap: 6 }}>
                <p data-name="" style={{ fontSize: 12, color: "#a09888", fontWeight: 500, margin: 0, transition: "color 0.15s" }}>{row.product}</p>
                {row.linked && <span style={{ fontSize: 10, color: "#4a4540" }}>&rarr;</span>}
              </div>
              <p style={{ fontSize: 11, color: "#706a60", margin: 0, width: "13%" }}>{row.usage}</p>
              <p style={{ fontSize: 12, color: "#a09888", margin: 0, width: "10%" }}>{row.share}</p>
              <p style={{ fontSize: 11, color: "#706a60", margin: 0, width: "24%", lineHeight: 1.5 }}>{row.endUses}</p>
              <p style={{ fontSize: 10, fontWeight: 500, margin: 0, width: "12%", textAlign: "right" as const, color: row.growth === "Surging" ? "#8a5a4a" : row.growth === "Growing" ? "#8a7a3a" : "#4a7a4a" }}>{row.growth}</p>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: "1px solid #252220" }}>
            <p style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, margin: 0, width: "18%" }}>Total</p>
            <p style={{ fontSize: 11, color: "#706a60", margin: 0, width: "13%" }}>~230t/yr</p>
            <p style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, margin: 0, width: "10%" }}>100%</p>
            <p style={{ fontSize: 11, color: "#706a60", margin: 0, width: "24%" }}>Every segment stable or growing</p>
            <p style={{ margin: 0, width: "12%" }} />
          </div>
          <div style={{ paddingTop: 14, marginTop: 4 }}>
            <p style={{ fontSize: 11, color: "#706a60", lineHeight: 1.6, margin: 0 }}>Fiber optics is the dominant consumer at 38% of supply. All five end markets are stable or growing. No demand destruction pathway exists on a 2-3 year horizon. Substitution (BlackDiamond for IR, hollow-core for fiber) is real but arrives after the deficit peaks.</p>
          </div>
        </div>

        </div>

        {/* SUPPLY TREE */}
        <div id="supply-tree" style={{ marginBottom: "56px", paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>
            SUPPLY TREE
          </p>
          {/* Key takeaway */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ borderLeft: `2px solid ${accent}30`, paddingLeft: 20 }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.1em", color: accent, margin: "0 0 10px 0" }}>KEY TAKEAWAY</p>
              <p style={{ fontSize: 13, color: "#a09888", lineHeight: 1.3, margin: 0 }}>
                <span style={{ color: "#ece8e1", fontWeight: 500 }}>~230t</span> of germanium enters the global supply chain annually. ~120t from Chinese zinc smelters and coal operations (export controlled since Aug 2023). ~90t from recycling (near maximum recovery). ~11t from Russia (sanctioned). Deposits in Yunnan, Inner Mongolia, DRC tailings, and Alaska feed into ~10 smelter-refiners. Umicore in Belgium is the sole western refiner at scale. All material converges to <span style={{ color: "#ece8e1", fontWeight: 500 }}>5 competing end markets</span> with no demand declining.
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
              Expand &#8599;
            </button>
            <TreeMap geometry={rawGeo} nodes={allNodes} layerConfig={lc} svgWidth={rawW} svgHeight={rawH} onNodeClick={setSelectedNode} onLayerClick={() => {}} layerPanels={{}} />
          </div>
        </div>

        {/* FULLSCREEN SUPPLY TREE OVERLAY */}
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
            {/* Full tree */}
            <div style={{ flex: 1, padding: "20px" }}>
              <TreeMap geometry={rawGeo} nodes={allNodes} layerConfig={lc} svgWidth={rawW} svgHeight={rawH} onNodeClick={setSelectedNode} onLayerClick={() => {}} layerPanels={{}} />
            </div>
          </div>
        )}

        {/* Node modal */}
        <NodeModal
          nodeKey={selectedNode}
          allNodes={allNodes}
          layers={[]}
          chainLabel="Germanium Supply Tree"
          onClose={() => setSelectedNode(null)}
          onNavigate={() => {}}
        />

      </div>
    </div>
  );
}
