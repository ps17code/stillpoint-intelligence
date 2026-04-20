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
  const [activeIdea, setActiveIdea] = useState<string | null>(null);
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

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIdea(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const accent = "#81713c";
  const warmWhite = "#ece8e1";
  const muted = "#706a60";
  const dimText = "#555";
  const dimmer = "#4a4540";
  const cardBg = "#1a1816";
  const borderColor = "#252220";

  const IDEA_BRIEFS: Record<string, { name: string; ticker: string; category: string; metrics: { label: string; value: string }[]; sections: { label: string; items: { title?: string; text: string }[] }[]; disclaimer: string }> = {
    "umicore": {
      name: "Umicore",
      ticker: "UMI \u00b7 Euronext Brussels",
      category: "Refined Materials / Conversion",
      metrics: [
        { label: "Share price", value: "\u20AC17.26 (Apr 2026)" },
        { label: "Market cap", value: "~\u20AC4.1B" },
        { label: "EV", value: "~\u20AC5.5B" },
        { label: "EV/EBITDA", value: "5.74x" },
        { label: "FY25", value: "\u20AC3.6B revenue, \u20AC847M adj. EBITDA, \u20AC558M Specialty Materials revenue" },
      ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Umicore operates the only facility in the western world that produces fiber-grade germanium tetrachloride at commercial scale. GeCl\u2084 is the volatile liquid deposited into glass preforms to control the refractive index of fiber optic cable \u2014 without it, light doesn\\u2019t travel through fiber. Umicore\\u2019s Olen, Belgium plant processes approximately 40-50 tonnes of germanium per year, refining it to 8N purity and shipping the resulting GeCl\u2084 to every major western and Japanese fiber manufacturer: Corning, Prysmian, Fujikura, Sumitomo Electric, Shin-Etsu." },
          { text: "Two other western entities produce GeCl\u2084 \u2014 Teck Resources at Trail and Indium Corporation \u2014 but neither operates at the scale or purity tier required for commercial fiber. China\\u2019s export controls have made Umicore\\u2019s position structural rather than discretionary. Umicore is the chokepoint." },
          { text: "The company is a diversified materials technology group \u2014 Catalysis (\u20AC450M EBITDA), Recycling (\u20AC371M EBITDA), Specialty Materials (\u20AC108M EBITDA), and troubled Battery Materials Solutions (-\u20AC21M EBITDA). The germanium business is buried inside Specialty Materials. The market prices Umicore as a struggling battery conglomerate at 5.74x EV/EBITDA. The germanium thesis is invisible in the headline numbers." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "Three interlocking revenue channels create margins structurally wider than segment-level numbers suggest." },
          { title: "Direct GeCl\u2084 sales", text: "at prices linked to western germanium market pricing. With germanium at $8,597/kg \u2014 up from $1,340/kg in 2023 \u2014 this is the primary revenue driver." },
          { title: "Closed-loop tolling", text: "Over 50% of Umicore\\u2019s germanium input comes from recycled manufacturing scrap. The tolling fee is largely fixed regardless of spot price. When germanium surges, input cost on recycled material barely moves while output pricing follows the market. The customer cannot take scrap elsewhere \u2014 no other western facility can process it at required purity. Self-renewing revenue stream with expanding margins." },
          { title: "The China-Belgium arbitrage", text: "Stimson Center documented that in 2024, US germanium imports from China fell by ~5,900 kg while Belgian imports rose by ~6,150 kg. Germanium is being routed through Belgium, purchased under license at Chinese domestic pricing (~$2,000/kg), processed at Olen, and sold at $7,000-8,500/kg. Umicore captures the 2-3x spread." },
          { text: "Blended cost structure: ~25-35% of input exposed to spot, ~65-75% insulated. But 100% of output tracks western pricing. Every price increase widens the spread." },
          { title: "The GASIR® hedge", text: "Umicore\\u2019s proprietary chalcogenide glass reduces germanium in IR optics by 80%. Over 1.5M lenses shipped. If germanium prices rise, Umicore profits from GeCl\u2084. If IR optics substitutes away from germanium, it\\u2019s Umicore\\u2019s technology doing the substituting." },
        ] },
        { label: "Key numbers", items: [
          { title: "Specialty Materials FY25", text: "\u20AC558M revenue (+4%), \u20AC108M adj. EBITDA (+11%). Germanium revenue \\u201Cmuch higher\\u201C per management. Estimated $100-130M at FY25 pricing, potentially $345-430M+ at current elevated pricing." },
          { title: "Foundation businesses combined", text: "\u20AC929M EBITDA. Sell-side SOTP: 7-9x implies \u20AC6.5-8.4B foundation EV vs \u20AC5.5B current group EV." },
          { title: "DRC Big Hill", text: "Exclusive offtake. First concentrates Oct 2024. 30t/yr nameplate, targeting 30% of global supply. Additive to current 40-50t throughput." },
          { title: "Balance sheet", text: "\u20AC1.55B cash, \u20AC1.35B net debt, 1.60x leverage. \u20AC524M free cash flow. \u20AC0.50/share dividend (~2.9% yield)." },
        ] },
        { label: "What to watch", items: [
          { title: "Battery Materials resolution", text: "\u2014 divestiture would trigger SOTP re-rating. JM precedent at 13.3x EV/EBITDA." },
          { title: "DRC ramp-up pace", text: "\u2014 each 10t adds ~$40-50M revenue." },
          { title: "Olen capacity expansion", text: "\u2014 any announcement would be material." },
          { title: "Germanium price reversal risk", text: "\u2014 if China relaxes controls, tolling model provides partial insulation but direct revenue compresses." },
          { title: "Single-site concentration", text: "\u2014 all western GeCl\u2084 through one facility." },
        ] },
        { label: "Investment angle", items: [
          { text: "Umicore at 5.74x EV/EBITDA is the value play in the germanium chain. The market prices it as a battery conglomerate in distress. What the market misses: the foundation businesses (\u20AC929M EBITDA) are growing and cash-generative, and the germanium business is positioned at the most important chokepoint in the western supply chain." },
          { text: "The catalyst is Battery Materials resolution. If management divests or separates the division, foundation businesses get valued independently. A re-rating from 5.74x to 7-8x implies 25-40% equity upside before any germanium-specific revaluation." },
          { text: "The variant perception: most investors see a battery company with commodity exposure. The germanium angle is invisible because it\\u2019s buried inside Specialty Materials. An investor who understands the GeCl\u2084 chokepoint, the tolling arbitrage, and the DRC ramp is seeing a business the sell-side isn\\u2019t modeling correctly. Germanium revenue at current pricing could already approach the entire Specialty Materials segment total \u2014 but no analyst is publishing that estimate." },
          { text: "The \u20AC0.50/share dividend, \u20AC524M free cash flow, and 1.60x leverage provide downside cushion. Sell-side targets range \u20AC15.50-23.90. If germanium scarcity persists and Battery Materials resolves, this is the most asymmetric risk/reward in the chain." },
          { text: "Euronext Brussels-listed. Liquid for institutional investors." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Germanium Chain \u00b7 Layer: Refined Materials / Conversion Sources: Umicore FY25 Results, AlphaSense Primer, Stimson Center, Fastmarkets, sell-side research. Not investment advice.",
    },
    "5n-plus": {
      name: "5N Plus",
      ticker: "VNP \u00b7 TSX",
      category: "Refined Materials / Components",
      metrics: [
        { label: "Share price", value: "C$35.64 (Apr 2026)" },
        { label: "Market cap", value: "~C$3.2B (~US$2.3B)" },
        { label: "P/E", value: "~44x TTM" },
        { label: "Net debt/EBITDA", value: "0.54x" },
        { label: "FY25", value: "$391.1M revenue (+35%), $92.4M adj. EBITDA (+73%)" },
      ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "5N Plus is the only company in the western world that takes raw germanium and turns it into a finished space solar cell. The chain runs end to end: refined germanium metal \u2192 crystal \u2192 wafers \u2192 epitaxial III-V layers \u2192 completed multi-junction solar cell. This vertical integration lives across Montreal (refining), St. George, Utah (wafers), and Heilbronn, Germany (AZUR SPACE, cells)." },
          { text: "AZUR SPACE, acquired in 2021, has delivered over 15 million space-qualified solar cells powering 700+ missions without a failure. Its cells power Hubble, Rosetta, Mars Express, Europa Clipper, JUICE, Chandrayaan-3, and more." },
          { text: "5N Plus also supplies germanium wafers and blanks for IR optics. It sits on a parallel branch of the supply chain from Umicore \u2014 neither competes with the other. Both pull on the same constrained supply." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { title: "Space solar", text: "is the growth engine. LEO mega-constellations have shattered the old rhythm of 20-30 GEO satellites per year. AZUR, alongside Spectrolab (Boeing) and SolAero (Rocket Lab), forms a three-player western oligopoly. Capacity expanding 25-35% annually, backlog maxed out." },
          { title: "The SpaceX exception", text: "Starlink uses silicon cells, not III-V. Every other operator relies on germanium-based cells because they need maximum power per kg. For deep space, silicon isn\\u2019t viable." },
          { title: "DoD investment", text: "Two DPA Title III awards totaling $32.5M. The January 2026 award expands zone refining capacity sevenfold to 20+ tonnes/year at St. George, Utah \u2014 creating domestic germanium refining at scale." },
        ] },
        { label: "Key numbers", items: [
          { title: "FY25", text: "$391.1M revenue (+35%), $92.4M EBITDA (+73%). Net earnings $50.6M. Adjusted gross margin 33.7%." },
          { title: "Specialty Semiconductors", text: "$285.4M revenue (+41%), $70.1M EBITDA (+59%). AZUR likely $100-130M of this." },
          { title: "Backlog", text: "$394.9M \u2014 353 days of annualized revenue." },
          { title: "Balance sheet", text: "Net debt $50.3M, leverage 0.54x. Debt-free effectively. No dividend." },
          { title: "FY26 guidance", text: "$100-105M EBITDA." },
        ] },
        { label: "What to watch", items: [
          { title: "AZUR capacity execution", text: "\u2014 25% additional in 2026 on top of 30% in 2025 and 35% in 2024." },
          { title: "Silicon substitution risk", text: "\u2014 if Kuiper or others follow SpaceX\\u2019s silicon approach." },
          { title: "Feedstock dependence", text: "\u2014 5N Plus doesn\\u2019t control its own germanium supply. DoD refining investment addresses this but takes 2-3 years." },
          { title: "CEO transition", text: "\u2014 Perron assumes CEO from Jacques in May 2026." },
        ] },
        { label: "Investment angle", items: [
          { text: "The thesis is validated \u2014 the question is whether 44x earnings leaves room. 5N Plus re-rated from C$5 to C$35 in twelve months." },
          { text: "For bulls: the backlog ($395M, 353 days) provides more visibility than the multiple implies. If EBITDA reaches $130-150M by FY27, the stock trades at ~17-20x forward \u2014 reasonable for a defense-backed semiconductor business with 30%+ organic growth." },
          { text: "For bears: SpaceX proved silicon works for mega-constellations. Feedstock dependence on Teck and Chinese imports is a vulnerability. At 44x, modest deceleration triggers a drawdown." },
          { text: "TSX-listed, NASDAQ cross-listed (BMM). No dividend. For investors who believe space solar demand has years to run and germanium scarcity persists, 5N Plus is the growth vehicle. For those who prefer a better entry, the backlog means patience is viable." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Germanium Chain \u00b7 Layer: Refined Materials / Components Sources: 5N Plus FY25 Results, DoD DPA III awards, AZUR SPACE disclosures, SpaceNews. Not investment advice.",
    },
    "lightpath": {
      name: "LightPath Technologies",
      ticker: "LPTH \u00b7 NASDAQ",
      category: "Technology / Substitution",
      metrics: [
        { label: "Share price", value: "~$12.83 (Apr 2026)" },
        { label: "Market cap", value: "~$700M" },
        { label: "Q1 FY26", value: "$15.1M revenue (+79% YoY)" },
        { label: "Backlog", value: "~$90M (quadrupled from prior quarters)" },
        { label: "Q1 FY26 (Sep 30, 2025)", value: "$15.1M revenue (+79% YoY). Adjusted EBITDA: $0.4M (first positive quarter). Backlog: ~$90M, over two-thirds from systems." },
      ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "LightPath is the germanium substitution play. The company holds an exclusive license from the US Naval Research Laboratory for BlackDiamond chalcogenide glass \u2014 a material that can replace germanium in infrared optics while delivering comparable or superior performance. IR optics accounts for roughly 24% of global germanium demand." },
          { text: "LightPath has transformed from a component supplier into a vertically integrated camera and imaging systems provider. The G5 Infrared acquisition (February 2025) added cooled IR camera manufacturing. LightPath now controls: proprietary glass \u2192 lens molding \u2192 optical coatings \u2192 finished camera assembly. China\\u2019s export controls are the accelerant \u2014 every defense prime reassessing germanium supply is a potential BlackDiamond customer." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "Revenue has shifted from individual lenses (low ASPs) to complete camera systems (high ASPs). The Assemblies and Modules segment grew 436% in Q1 FY26 to $5.86M, contributing 39% of revenue." },
          { text: "Three revenue layers: BlackDiamond components sold to other manufacturers; complete G5 camera systems for military, security, and public safety; and engineering qualification contracts (F-35, Navy SPEIR, unnamed defense customer) that create multi-year production tails." },
          { text: "The F-35 program validation is the most significant \u2014 BlackDiamond optics qualified on the world\\u2019s highest-profile combat aircraft creates a reference design. The drone/UAV market is the emerging volume play, with $8M strategic investment from Ondas Holdings and Unusual Machines." },
        ] },
        { label: "Key numbers", items: [
          { title: "Q1 FY26 (Sep 30, 2025)", text: "$15.1M revenue (+79% YoY). Adjusted EBITDA: $0.4M (first positive quarter). Backlog: ~$90M, over two-thirds from systems." },
          { title: "Major orders", text: "$18.2M IR cameras for CY2026, $22.1M follow-on for CY2027, $4.8M public safety order." },
          { title: "Balance sheet", text: "$11.5M cash, $5.5M total debt, D/E 0.31. TTM free cash flow: -$9.6M." },
          { title: "FY25 full year", text: "$37.2M revenue (+17%), -$14.9M net loss." },
        ] },
        { label: "What to watch", items: [
          { title: "$40.3M combined camera order execution", text: "\u2014 delivery in CY2026-2027 determines whether the revenue ramp sustains." },
          { title: "Gross margin expansion", text: "\u2014 management targets 35-40% as camera systems scale." },
          { title: "Additional defense program qualifications", text: "\u2014 each creates a multi-year tail." },
          { title: "Germanium price reversal", text: "\u2014 if prices fall, urgency for alternatives diminishes and the thesis weakens." },
        ] },
        { label: "Investment angle", items: [
          { text: "LightPath is a micro-cap speculation on germanium substitution in defense optics. At ~$700M market cap, it\\u2019s the smallest company in the germanium ideas section. The revenue inflection is real and the backlog provides visibility, but the company is still loss-making and the profitability path is narrow." },
          { text: "The most compelling angle is the F-35 validation. Having BlackDiamond qualified on the world\\u2019s highest-profile combat aircraft creates a reference design other programs can follow. If LightPath accumulates 5-10 qualified programs over 2-3 years, the revenue base becomes sticky and defensible." },
          { text: "The drone/UAV angle is the volume play. The FPV drone thermal imaging market barely existed three years ago and is growing explosively. If LightPath captures meaningful share, the revenue potential dwarfs the current business." },
          { text: "Risk: competing against Umicore\\u2019s GASIR® (backed by a \u20AC4B conglomerate). Cash burn at -$9.6M TTM against $11.5M cash. Any execution stumble delays profitability." },
          { text: "NASDAQ-listed, liquid for a micro-cap. High beta. Suitable for risk-tolerant investors with a 2-3 year horizon. Not suitable as a core position." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Germanium Chain \u00b7 Layer: Technology / Substitution Sources: LightPath FY25 and Q1 FY26 earnings, SEC filings, defense contract announcements. Not investment advice.",
    },
    "blue-moon": {
      name: "Blue Moon Metals",
      ticker: "MOON \u00b7 TSXV / NASDAQ",
      category: "Mining / Primary Supply",
      metrics: [
        { label: "Listed", value: "TSXV: MOON / NASDAQ: BMM" },
        { label: "Stage", value: "Pre-revenue, exploration/development" },
        { label: "Key asset", value: "Apex germanium-gallium mine, Washington County, Utah" },
      ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Blue Moon acquired the Apex mine \u2014 the only site in the United States with documented history of primary germanium and gallium production. Every other western source produces germanium as a by-product. Apex is where germanium and gallium were the primary target." },
          { text: "The mine operated in the 1980s-90s under Musto Explorations and Hecla Mining as the primary US germanium producer. It shut when prices made primary mining uneconomic. At today\\u2019s $8,500+/kg, the same ore is worth 17x more per unit of contained germanium." },
          { text: "Blue Moon is building a western US \\u201Chub and spoke\\u201C platform: Apex (Ge/Ga) in Utah, Blue Moon mine (Zn/Cu/Au/Ag) in California with underground development underway, Springer metallurgical complex in Nevada for processing, and logistical connections to Teck\\u2019s Trail smelter." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "It doesn\\u2019t yet \u2014 Blue Moon is pre-revenue. The value is in the resource, strategic positioning, and institutional backing." },
          { text: "A 2018 historical estimate: 1Mt at 0.087% Ge, 0.033% Ga, 1.8% Cu, 41 g/t Ag. Contained germanium: ~870 tonnes \u2014 significant against 230t/yr global production. Grades are 10-100x higher than most deposits. In-situ value comparable to 0.5 oz/t gold ore." },
          { text: "The plan: process Apex ore at the Springer complex in Nevada, with downstream refining at Teck\\u2019s Trail smelter. Blue Moon also consolidated the surrounding Gage properties, controlling a 5+ km critical minerals belt." },
          { text: "Important caveat: historical estimates are not NI 43-101 compliant. Modern drilling, resource modeling, and technical reports required before these are bankable." },
        ] },
        { label: "Key numbers", items: [
          { title: "Resource", text: "1Mt at 0.087% Ge (historical, not NI 43-101). Contained Ge: ~870t. Hecla 1989 feasibility: 230,200t at 0.100% Ge." },
          { title: "Shareholders", text: "Oaktree Capital, Hartree Partners ($12B government stockpile partner), Teck Resources (8%), Wheaton Precious Metals, Altius Minerals, Baker Steel Resources Trust." },
          { title: "Production target", text: "2028. Pre-revenue, pre-feasibility." },
        ] },
        { label: "What to watch", items: [
          { title: "NI 43-101 resource estimate", text: "\u2014 validates the deposit." },
          { title: "Bulk sample and metallurgical test work", text: "\u2014 validates the processing. Historical recovery problems need modern solutions." },
          { title: "Blue Moon zinc mine", text: "\u2014 if it reaches production first, validates execution and provides cash flow for Apex development." },
          { title: "US policy environment", text: "\u2014 DoD investments, critical minerals executive orders, Hartree\\u2019s $12B stockpile program all create favorable backdrop." },
        ] },
        { label: "Investment angle", items: [
          { text: "Blue Moon is a pre-revenue junior miner and should be evaluated accordingly. No modern resource estimate, no feasibility study, no production timeline with engineering backing." },
          { text: "The shareholder register is the strongest signal. Oaktree, Hartree, Teck, Wheaton, Altius, Baker Steel \u2014 this institutional syndicate does not typically back junior miners without significant due diligence. Their presence suggests sophisticated capital believes the resource is real and the development path is credible. It does not guarantee success." },
          { text: "If Apex reaches production at even the historical rate of 2.5t/yr germanium, revenue at current pricing (~$22M/yr from Ge alone, plus Cu/Ga/Ag credits) would be material against the current market cap. At 5-10t/yr, revenue potential is $43-85M \u2014 transformative for a junior miner." },
          { text: "TSXV and NASDAQ dual-listed. Highly speculative. Suitable only for investors comfortable with junior mining risk who want early-stage exposure to domestic US germanium supply. Position sizing should reflect pre-revenue, pre-feasibility status." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Germanium Chain \u00b7 Layer: Mining / Primary Supply Sources: Blue Moon disclosures, Mining.com, Hecla 1989 feasibility (historical), USGS. Resource estimates historical, not NI 43-101. Not investment advice.",
    },
    "teck": {
      name: "Teck Resources",
      ticker: "TECK \u00b7 TSX / NYSE",
      category: "Primary Production / Feedstock",
      metrics: [
        { label: "Market cap", value: "~C$30B+ (major diversified miner)" },
        { label: "Germanium output", value: "8-10 tonnes/yr from Trail Operations, BC" },
        { label: "Primary business", value: "Copper and zinc mining" },
      ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Teck\\u2019s Trail Operations in British Columbia is one of only two non-Chinese facilities that produces primary germanium (the other being Chinese zinc smelters). Trail recovers germanium as a by-product during zinc concentrate processing from the Red Dog mine in Alaska." },
          { text: "Trail produces 8-10 tonnes/year. This feeds multiple downstream channels: 5N Plus for wafer production, defense contractors for military GeCl\u2084, and the broader western semiconductor supply chain. A 4-tonne expansion (to 12-14t/yr) is planned by 2027. The Anglo Teck merger commits up to C$850M to Trail critical minerals processing." },
          { text: "Teck holds 8% equity in Blue Moon Metals after vending the Apex mine \u2014 creating a pipeline from Blue Moon\\u2019s future output to Trail\\u2019s processing capability." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "Germanium is a rounding error in Teck\\u2019s financials \u2014 a by-product credit reducing Red Dog zinc unit costs. At $8,500/kg, 10 tonnes is worth $85M \u2014 not insignificant but small against Teck\\u2019s billions in copper/zinc revenue." },
          { text: "Trail has been strategically shifting toward higher-value specialty metals, with smelter profits doubling year-over-year as the company increases germanium, indium, and silver processing while reducing primary zinc throughput." },
        ] },
        { label: "Key numbers", items: [
          { text: "Trail Ge output: 8-10t/yr, expanding to 12-14t by 2027. Anglo Teck C$850M Trail investment commitment. Blue Moon equity: 8%. Red Dog mine life: to 2031." },
        ] },
        { label: "What to watch", items: [
          { title: "Anglo Teck merger", text: "\u2014 determines whether C$850M Trail investment flows." },
          { title: "Red Dog mine life", text: "\u2014 if zinc concentrates stop, germanium feedstock stops." },
          { title: "Blue Moon relationship", text: "\u2014 Apex concentrates could flow to Trail, extending throughput without new mine development." },
        ] },
        { label: "Investment angle", items: [
          { text: "Teck is not a germanium investment. At ~C$30B+ market cap, germanium is ~1% of the company\\u2019s value. No investor should buy Teck for germanium." },
          { text: "The monitoring value is high. Trail\\u2019s germanium output is a leading indicator for western primary supply. Quarterly commentary on Trail specialty metals and Red Dog mine life is essential monitoring." },
          { text: "The Blue Moon equity stake (8%) is interesting optionality \u2014 if Apex develops, Trail is the natural processing destination." },
          { text: "For investors who own Teck for copper, germanium is a free option embedded in their position." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Germanium Chain \u00b7 Layer: Primary Production / Feedstock Sources: Teck FY25 annual report, Anglo Teck merger disclosures, USGS. Not investment advice.",
    },
    "yunnan-chihong": {
      name: "Yunnan Chihong Zinc & Germanium",
      ticker: "600497 \u00b7 Shanghai",
      category: "Primary Production (China)",
      metrics: [
        { label: "Listed", value: "Shanghai Stock Exchange" },
        { label: "Parent", value: "Aluminum Corporation of China (Chinalco) \u2014 state-owned" },
        { label: "Germanium output", value: "56 tonnes/yr (2022)" },
        { label: "Capacity", value: "47.6t ingot + 60t tetrahydride + 300,000 wafers" },
        { label: "Proven Ge reserves", value: "600+ tonnes (~17% of China\\u2019s total)" },
      ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Yunnan Chihong is not an investment idea for western capital. It is the single most important entity in the global germanium market \u2014 the supply-side counterparty whose MOFCOM export licenses determine whether the western scarcity premium exists or collapses." },
          { text: "China\\u2019s largest primary germanium producer at 56t/yr. Subsidiary of state giant Chinalco. Product range covers every downstream use: ingots, GeCl\u2084, GeO\u2082, germanium tetrahydride, wafers. Proven reserves exceed 600 tonnes." },
        ] },
        { label: "How does this entity affect the rest of the chain?", items: [
          { text: "When MOFCOM issues or withholds export licenses, Yunnan Chihong\\u2019s output is a significant portion of what flows or doesn\\u2019t. The 3.5x western pricing premium exists because of the friction Chihong\\u2019s export licensing creates." },
          { text: "The bear case for every other company on this page runs through Yunnan Chihong: if China relaxes controls, exports resume, the western premium compresses, and the rationale for DRC development, Apex restart, BlackDiamond adoption, and Umicore\\u2019s arbitrage all weaken simultaneously." },
        ] },
        { label: "Key numbers", items: [
          { text: "Output: 56t/yr (2022). Capacity: 47.6t ingot, 60t tetrahydride, 300,000 wafers. Reserves: 600+t Ge. Parent: Chinalco (state-owned)." },
        ] },
        { label: "What to watch", items: [
          { title: "November 2026 ban review", text: "\u2014 the single most important event for the germanium market." },
          { title: "Chinese domestic pricing", text: "\u2014 if domestic prices rise toward $3,000-4,000/kg, internal demand is tightening." },
          { title: "Yunnan Chihong profitability", text: "\u2014 if profitable, Beijing has no incentive to relax controls." },
        ] },
        { label: "Investment angle", items: [
          { text: "Not investable for most western institutional capital. Shanghai A-share listed, state-owned, subject to Chinese capital controls, governance opacity, and the very export control regime that defines the thesis." },
          { text: "The monitoring value is very high. Yunnan Chihong\\u2019s production volume, capacity utilization, and profitability are the best indicators of Chinese domestic germanium supply-demand balance. If profitability strengthens, the current regime is sustainable. If it weakens, export control relaxation becomes more likely." },
          { text: "Chinese domestic germanium pricing (Asian Metal, Fastmarkets) is the signal to watch. Stable ~$2,000/kg suggests the 3.5x western premium exists purely from export controls, not fundamental scarcity." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Germanium Chain \u00b7 Layer: Primary Production (China) Sources: Reuters, USGS, Stimson Center, China General Administration of Customs. Not investment advice.",
    },
    "stl-gecamines": {
      name: "STL / Gécamines \u2014 Big Hill",
      ticker: "Private \u00b7 DRC",
      category: "Primary Production / New Supply",
      metrics: [
        { label: "Entity", value: "Société du Terril de Lubumbashi (STL)" },
        { label: "Ownership", value: "George Forrest International (70%) / Gécamines (30%, DRC state)" },
      ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Big Hill is 14 million tonnes of century-old copper mining slag containing 700+ tonnes of germanium. STL operates a new hydrometallurgical plant (commissioned October 2023). First germanium concentrates exported to Umicore in October 2024. Targeting 30% of global supply at full capacity (~66t/yr). Plant nameplate: ~30t/yr." },
          { text: "This is the largest new non-Chinese germanium source in development. Partnership facilitated by the Minerals Security Partnership (14-country coalition). Umicore provides extraction technology and holds exclusive long-term offtake on all output." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "Every tonne Big Hill produces ships to Olen, Belgium. No other company can buy STL\\u2019s germanium. Big Hill eases the western supply picture while concentrating the processing bottleneck further in Umicore\\u2019s hands." },
          { text: "DRC concentrates arrive under long-term partnership \u2014 likely well below western spot. This gives Umicore another source of input cost insulation, widening the spread." },
          { text: "STL is not investable. George Forrest International is private. Gécamines is DRC state-owned. The only investment vehicle for Big Hill\\u2019s germanium is Umicore." },
        ] },
        { label: "Key numbers", items: [
          { text: "Slag: 14Mt. Ge potential: 700+t. Plant nameplate: ~30t/yr. Target: 30% global supply. First export: Oct 2024. Ramp timeline: 5-15t/yr near-term, 20-30t/yr by 2028-2029." },
        ] },
        { label: "What to watch", items: [
          { title: "Ramp-up pace", text: "\u2014 directly impacts Umicore\\u2019s capacity growth trajectory." },
          { title: "DRC political risk", text: "\u2014 governance instability, resource nationalism." },
          { title: "On-site GeO\u2082 production", text: "\u2014 could change value chain dynamics if STL captures more value locally." },
          { title: "Supply paradox", text: "\u2014 at full scale, Big Hill could ease the scarcity premium that makes Umicore\\u2019s existing business exceptionally profitable." },
        ] },
        { label: "Investment angle", items: [
          { text: "Not investable directly. The only vehicle for Big Hill\\u2019s germanium is Umicore (UMI)." },
          { text: "Big Hill should be evaluated as a component of the Umicore thesis. Each tonne adds ~$4-5M in Umicore revenue. At 20-30t/yr, that\\u2019s $80-150M incremental \u2014 meaningful." },
          { text: "The paradox worth internalizing: at full scale, Big Hill meaningfully eases germanium scarcity \u2014 potentially putting downward pressure on the pricing that makes Umicore\\u2019s existing business so profitable. Whether supply additions outpace AI-driven demand growth determines the net effect." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Germanium Chain \u00b7 Layer: Primary Production / New Supply Sources: Umicore disclosures, Minerals Security Partnership, USGS. Not investment advice.",
    },
    "germanium-metal": {
      name: "Germanium Metal",
      ticker: "",
      category: "Raw Material / Commodity",
      metrics: [
        { label: "Current price", value: "~$8,597/kg (Fastmarkets, March 2026)" },
      ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Germanium metal is the raw material that feeds every other entity on this page. The price moved from $1,340/kg to $8,597/kg in three years \u2014 a supply-side dislocation from Chinese export controls on a structurally constrained market." },
          { text: "Supply runs at ~230t/yr: ~120t Chinese primary (export controlled), ~90t recycled, ~11t Russian (sanctioned). New sources (DRC, Blue Moon, Trail expansion) add tonnage over years, none resolving the constraint before 2028-2029." },
        ] },
        { label: "How does the market work?", items: [
          { text: "No futures contract, no exchange listing, no standardized benchmark. All OTC. The 3.5x spread between Chinese domestic (~$2,000/kg) and western pricing ($7,000-8,500/kg) persists because export controls prevent arbitrage. Only entities with MOFCOM licenses and western processing relationships \u2014 primarily Umicore \u2014 can bridge the gap." },
          { text: "No way to hedge germanium exposure. Fiber manufacturers, defense contractors, and solar cell producers must accept spot pricing or negotiate long-term contracts. This creates strong customer loyalty to reliable suppliers." },
          { text: "Price discovery is slow and asymmetric \u2014 informational advantages exist for participants tracking the supply chain closely." },
        ] },
        { label: "What to watch", items: [
          { title: "November 2026 ban review", text: "\u2014 the single most important event. Extension sustains thesis. Relaxation compresses it." },
          { title: "Chinese domestic pricing", text: "\u2014 rising domestic prices signal internal tightening. Stable prices suggest the premium is purely from controls." },
          { title: "Western supply additions", text: "\u2014 collectively 30-50t of potential new supply by decade\\u2019s end. Meaningful but not transformative." },
        ] },
        { label: "Investment angle", items: [
          { text: "Not directly investable without physical trading infrastructure. No futures, no ETF, no exchange. The only way to express a view on germanium pricing is through equities: Umicore (value play on price persistence), 5N Plus (growth play on downstream demand), LightPath (substitution play on price going too high)." },
          { text: "The informational edge from tracking germanium pricing is real. An opaque OTC market with slow price discovery creates advantages for participants tracking supply chain flows \u2014 which is precisely what Stillpoint Intelligence provides." },
          { text: "The November 2026 ban review is the event every germanium-linked position should be stress-tested against. An investor should answer: \\u201CIf the ban lifts and germanium reverts to $3,000/kg, which positions still work?\\u201C Umicore\\u2019s tolling model provides partial insulation. 5N Plus\\u2019s DoD funding and backlog provide demand-side protection. LightPath\\u2019s thesis weakens significantly. Blue Moon becomes uneconomic. The answers aren\\u2019t uniform \u2014 portfolio construction across these names matters more than any individual position." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Germanium Chain \u00b7 Layer: Raw Material / Commodity Sources: Fastmarkets, USGS, Stimson Center, Asian Metal. Not investment advice.",
    },
  };

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
        <p style={{ fontSize: 9, letterSpacing: "0.06em", color: "#555", margin: "0 0 8px 12px" }}>Downstream</p>
        {[
          { name: "Fiber optic cable", linked: true, href: "/input/fiber-optic-cable" },
          { name: "IR optics", linked: false, href: "" },
          { name: "Satellite solar cells", linked: false, href: "" },
          { name: "SiGe semiconductors", linked: false, href: "" },
        ].map((item, i) => (
          <div key={i} onClick={() => { if (item.linked) window.location.href = item.href; }}
            style={{ display: "flex", alignItems: "center", padding: "1px 0 1px 12px", cursor: item.linked ? "pointer" : "default" }}>
            <span style={{ fontSize: 10, color: item.linked ? "#a09888" : "#4a4540", transition: "color 0.15s" }}
              onMouseEnter={e => { if (item.linked) e.currentTarget.style.color = "#ece8e1"; }}
              onMouseLeave={e => { if (item.linked) e.currentTarget.style.color = "#a09888"; }}>
              {item.name}
            </span>
            {item.linked && <span style={{ fontSize: 10, color: "#4a4540", marginLeft: 6 }}>→</span>}
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
            <p style={{ fontSize: 20, letterSpacing: "0.1em", color: "#555", margin: "0 0 16px 0" }}>EXECUTIVE SUMMARY</p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {[
                "Trace element recovered as a byproduct of zinc smelting and coal combustion. Cannot be mined directly.",
                "Doped into glass to create the refractive index that allows fiber optic cable to carry light. Also used in infrared defense optics, satellite solar cells, and SiGe semiconductors.",
                "Global supply fixed at ~230t/yr. 83% Chinese under export licensing. One western refiner \u2014 Umicore, Belgium \u2014 processes all non-Chinese, non-Russian supply through a single facility.",
                "Price has risen from $1,500/kg to over $8,500/kg in two years. 3.5x premium between western and Chinese markets persists because export controls prevent arbitrage.",
                "Demand accelerating from AI datacenter fiber buildout, defense IR optics spending, and satellite constellation expansion. Every end market stable or growing.",
                "No near-term supply relief. Hollow-core fiber, new mine capacity, and DRC feedstock ramp all target 2027-2028 at earliest.",
                "Eight entities control the western germanium value chain. Several are positioned to capture outsized value from a supply gap driven by an AI boom.",
              ].map((point, i, arr) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                  {i < arr.length - 1 && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 7 }} />}
                  <p style={{ fontSize: 13.5, color: i === arr.length - 1 ? "#dad9d8" : "#a09888", lineHeight: 1.4, margin: 0, fontWeight: 300 }}>{point}</p>
                </div>
              ))}
            </div>
          </div>
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

        {/* DEPENDENCIES */}
        <div id="dependencies" style={{ paddingTop: 20 }}>

        <p style={{ fontSize: 20, letterSpacing: "0.06em", color: "#555", margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>DEPENDENCIES</p>

        {/* Downstream table */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", margin: "0 0 20px 0" }}>DOWNSTREAM &mdash; WHERE GERMANIUM GOES</p>
          <div style={{ display: "flex", padding: "0 0 10px 0", borderBottom: "1px solid #252220" }}>
            {[{ l: "Product", w: "25%" }, { l: "Usage", w: "10%" }, { l: "Est. value", w: "10%" }, { l: "Share", w: "10%" }, { l: "End uses", w: "34%" }, { l: "Growth", w: "10%", right: true }].map(h => (
              <p key={h.l} style={{ fontSize: 9, letterSpacing: "0.06em", color: "#4a4540", margin: 0, width: h.w, textAlign: (h as { right?: boolean }).right ? "right" as const : undefined }}>{h.l}</p>
            ))}
          </div>
          {[
            { product: "Fiber optic cable", usage: "~87t/yr", value: "~$748M", share: "38%", endUses: "AI datacenters, telecom, subsea, UAVs", growth: "Surging (+19%)", linked: true },
            { product: "IR optics", usage: "~55t/yr", value: "~$473M", share: "24%", endUses: "Thermal imaging, missile guidance", growth: "Surging (+18%)", linked: false },
            { product: "Satellite solar cells", usage: "~35t/yr", value: "~$301M", share: "15%", endUses: "Space systems, LEO constellations", growth: "Surging (+57%)", linked: false },
            { product: "SiGe semiconductors", usage: "~25t/yr", value: "~$215M", share: "11%", endUses: "5G RF, radar, electronic warfare", growth: "Stable", linked: false },
            { product: "Other", usage: "~28t/yr", value: "~$241M", share: "12%", endUses: "Catalysts, phosphors, PET", growth: "Stable", linked: false },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: "1px solid #252220", cursor: row.linked ? "pointer" : "default", transition: "background 0.15s" }}
              onMouseEnter={e => { if (row.linked) { e.currentTarget.style.background = "#1a1816"; const n = e.currentTarget.querySelector("[data-name]") as HTMLElement; if (n) n.style.color = "#ece8e1"; } }}
              onMouseLeave={e => { if (row.linked) { e.currentTarget.style.background = "transparent"; const n = e.currentTarget.querySelector("[data-name]") as HTMLElement; if (n) n.style.color = "#a09888"; } }}
              onClick={() => { if (row.linked) window.location.href = "/input/fiber-optic-cable"; }}
            >
              <div style={{ width: "25%", display: "flex", alignItems: "baseline", gap: 6 }}>
                <p data-name="" style={{ fontSize: 12, color: "#a09888", fontWeight: 500, margin: 0, transition: "color 0.15s" }}>{row.product}</p>
                {row.linked && <span style={{ fontSize: 10, color: "#4a4540" }}>&rarr;</span>}
              </div>
              <p style={{ fontSize: 11, color: "#706a60", margin: 0, width: "10%" }}>{row.usage}</p>
              <p style={{ fontSize: 11, color: "#706a60", margin: 0, width: "10%" }}>{row.value}</p>
              <p style={{ fontSize: 12, color: "#a09888", margin: 0, width: "10%" }}>{row.share}</p>
              <p style={{ fontSize: 11, color: "#706a60", margin: 0, width: "34%", lineHeight: 1.5 }}>{row.endUses}</p>
              <p style={{ fontSize: 10, fontWeight: 500, margin: 0, width: "10%", textAlign: "right" as const, color: row.growth.startsWith("Surging") ? "#8a5a4a" : row.growth.startsWith("Growing") ? "#8a7a3a" : "#4a7a4a" }}>{row.growth}</p>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: "1px solid #252220" }}>
            <p style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, margin: 0, width: "25%" }}>Total</p>
            <p style={{ fontSize: 11, color: "#ece8e1", fontWeight: 500, margin: 0, width: "10%" }}>~230t/yr</p>
            <p style={{ fontSize: 11, color: "#ece8e1", fontWeight: 500, margin: 0, width: "10%" }}>~$1.98B</p>
            <p style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, margin: 0, width: "10%" }}>100%</p>
            <p style={{ margin: 0, width: "34%" }} />
            <p style={{ fontSize: 10, color: "#ece8e1", fontWeight: 500, margin: 0, width: "10%", textAlign: "right" as const }}>~286t (+24%)</p>
          </div>
          <div style={{ paddingTop: 14, marginTop: 4 }}>
            <p style={{ fontSize: 11, color: "#706a60", lineHeight: 1.6, margin: 0 }}>Fiber optics is the dominant consumer at 38% of supply. All five end markets are stable or growing. No demand destruction pathway exists on a 2-3 year horizon. Substitution (BlackDiamond for IR, hollow-core for fiber) is real but arrives after the deficit peaks.</p>
          </div>
        </div>

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
              <p style={{ fontSize: "22px", fontWeight: 500, color: warmWhite, margin: "0 0 8px 0" }}>~286t by 2027</p>
              <p style={{ fontSize: "11.5px", color: "#a09888", margin: 0, lineHeight: 1.6 }}>
                Projected across all end markets. Fiber +19t (AI datacenters). Satellite solar +20t (LEO constellations). IR optics +10t (defense, offset by substitution). SiGe +5t (5G). Every segment growing simultaneously — no demand in decline.
              </p>
            </div>
            {/* Gap */}
            <div style={{ flex: 1, background: "#1a1810", border: `1px solid ${accent}33`, borderRadius: "10px", padding: "20px 22px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 10px 0", opacity: 0.7 }}>GAP</p>
              <p style={{ fontSize: "22px", fontWeight: 500, color: accent, margin: "0 0 8px 0" }}>~56t</p>
              <p style={{ fontSize: "11.5px", color: "#a09888", margin: 0, lineHeight: 1.6 }}>
                ~24% shortfall. At current pricing ($8,500/kg), the unmet demand represents ~$475M in germanium that doesn{"'"}t exist. Western-accessible supply covers only ~26t of this — the rest requires Chinese cooperation.
              </p>
            </div>
          </div>
        </div>

        {/* SO WHAT */}
        <div id="so-what" style={{ paddingTop: 20 }}>
        {(() => {
          const body = "#a09888";
          const analysisBg = "#141210";
          const gold = "#81713c";
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

        {/* WHERE THE MONEY IS */}
        <div id="money" style={{ marginBottom: "56px", paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>
            WHERE THE MONEY IS
          </p>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {[
              { id: "umicore", name: "Umicore", ticker: "UMI \u00b7 Euronext", category: "Chokepoint holder", line1: "Sole western GeCl\u2084 supplier for commercial fiber optics.", line2: "Exclusive DRC feedstock offtake ramping. Closed-loop recycling from fiber manufacturers creates circular barrier to entry. Major revenue upside from AI-driven fiber demand." },
              { id: "5n-plus", name: "5N Plus", ticker: "VNP \u00b7 TSX", category: "Capacity builder", line1: "Only vertically integrated western supplier from refined germanium to finished space solar cells.", line2: "Capacity expanding 25-35% annually with $395M backlog maxed out. $32.5M in DoD funding for wafer and refining expansion. FY25: revenue +35%, EBITDA +73%." },
              { id: "lightpath", name: "LightPath Technologies", ticker: "LPTH \u00b7 NASDAQ", category: "Technology", line1: "Holds exclusive license to BlackDiamond glass that replaces germanium in IR optics.", line2: "$40M camera supply deal through 2027. F-35 combat aircraft program validated. Revenue +40% last quarter. Wins when germanium gets too scarce or too expensive." },
              { id: "blue-moon", name: "Blue Moon Metals", ticker: "MOON \u00b7 TSXV / NASDAQ", category: "Capacity builder", line1: "Acquired Apex \u2014 the only past-producing primary germanium and gallium mine in the United States.", line2: "Backed by Oaktree, Hartree ($12B stockpile partner), Teck (8%), Wheaton PM, Altius. Ge grades 10-100x higher than most deposits. 1Mt resource. Production target 2028." },
              { id: "teck", name: "Teck Resources", ticker: "TECK \u00b7 TSX / NYSE", category: "Feedstock supplier", line1: "Only North American primary feedstock source of germanium, recovered as zinc by-product at Trail smelter in BC.", line2: "Feeds 5N Plus, defense contractors, and GeCl\u2084 production. 8-10t/yr output with 4t expansion by 2027. 8% stake in Blue Moon. Anglo Teck merger commits C$850M to Trail critical minerals." },
              { id: "yunnan-chihong", name: "Yunnan Chihong", ticker: "600497 \u00b7 Shanghai", category: "Market maker", line1: "China\u2019s largest germanium producer at 56t/yr output with 600+ tonnes in proven reserves.", line2: "Produces ingots, GeCl\u2084, GeO\u2082, tetrahydride, and wafers \u2014 covers every downstream use. State-controlled Chinalco subsidiary. The entity whose MOFCOM export licenses determine whether the western scarcity premium holds or collapses." },
              { id: "stl-gecamines", name: "STL / G\u00e9camines", ticker: "Private \u00b7 DRC", category: "Feedstock supplier", line1: "Largest new non-Chinese germanium source in development \u2014 14M tonnes of slag, 700+ tonnes Ge potential.", line2: "First germanium concentrates exported October 2024. Targeting 30% of global supply. Exclusive Umicore offtake \u2014 all value accrues to Umicore, not the mine." },
              { id: "germanium-metal", name: "Germanium metal", ticker: "Physical commodity", category: "Direct exposure", line1: "$1,500 \u2192 $8,500+/kg in two years on relatively fixed global supply of ~230t/yr.", line2: "Nov 2026 ban review is a binary event for the entire chain. No futures market, no exchange pricing \u2014 all OTC. 3.5x spread between Chinese domestic and western market price." },
            ].map((idea, i) => (
              <div key={idea.id} style={{ display: "flex", background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: "10px 20px", transition: "border-color 0.15s", cursor: "pointer" }}
                onClick={() => setActiveIdea(idea.id)}
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
                  <p style={{ fontSize: 12, color: "#c4bdb2", lineHeight: 1.6, margin: "0 0 4px 0", fontWeight: 500 }}>{idea.line1}</p>
                  <p style={{ fontSize: 11, color: "#a09888", lineHeight: 1.6, margin: 0 }}>{idea.line2}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RISK */}
        <div id="risk" style={{ marginBottom: 56, paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>RISK</p>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.08em", color: "#4a4540", margin: "0 0 14px 0" }}>WHAT COULD EASE SUPPLY</p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                {[
                  { risk: "China lifts export controls", assessment: "Collapses the 3.5x western premium overnight. Currently no diplomatic signal suggesting this \u2014 but the Nov 2026 suspension expiry is a binary event." },
                  { risk: "DRC ramps faster than expected", assessment: "Could add 30t/yr by 2027-2028. But all flows through Umicore for conversion \u2014 eases feedstock, doesn\u2019t break the bottleneck." },
                  { risk: "Recovery rates improve at zinc smelters", assessment: "Currently only 10% of germanium captured. Technology exists to push higher \u2014 but requires capex at smelters who treat germanium as a low-priority byproduct." },
                  { risk: "New deposits discovered or brought online", assessment: "Blue Moon Apex targeting 2028. Even in the best case, 2-3 years from decision to meaningful production. No other western deposits in pipeline." },
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
                  { risk: "AI infrastructure spending slows", assessment: "Recession, bubble correction, or model efficiency breakthroughs reducing compute needs. But fiber demand was growing 5-8% annually before AI. A slowdown reduces severity \u2014 doesn\u2019t create a surplus." },
                  { risk: "Hollow-core fiber reaches scale", assessment: "Eliminates germanium from fiber optics (38% of demand). Currently ~20,000 km deployed vs billions installed, ~1,000x the price. 2030+ risk at earliest." },
                  { risk: "Germanium replaced in IR optics", assessment: "LightPath\u2019s BlackDiamond chalcogenide glass. NDAA mandates transition by 2030. Real but multi-year \u2014 and bullish for LightPath, bearish for germanium demand." },
                  { risk: "PCVD doubles germanium efficiency", assessment: "Reduces demand per fiber-km by ~50%. But MCVD installed base has 25+ year lifespans. Slows demand growth \u2014 doesn\u2019t reverse it." },
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
            <p style={{ fontSize: 12, color: muted, lineHeight: 1.6, margin: 0 }}>None of the supply-side or demand-side risks resolve before 2027-2028. The structural constraint persists through the investable window.</p>
          </div>
        </div>

        {/* Idea brief modal */}
        {activeIdea && IDEA_BRIEFS[activeIdea] && (() => {
          const brief = IDEA_BRIEFS[activeIdea];
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
                {/* Header */}
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
                  {/* Metrics row */}
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
                </div>
                {/* Scrollable content */}
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
                  {/* Disclaimer */}
                  <div style={{ borderTop: "1px solid #252220", marginTop: 24, paddingTop: 16 }}>
                    <p style={{ fontSize: 10, color: "#4a4540", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>{brief.disclaimer}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

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
