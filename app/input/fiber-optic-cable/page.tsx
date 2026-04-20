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
  const [activeIdea, setActiveIdea] = useState<string | null>(null);
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

  const IDEA_BRIEFS: Record<string, { name: string; ticker: string; category: string; metrics: { label: string; value: string }[]; sections: { label: string; items: { title?: string; text: string }[] }[]; disclaimer: string }> = {
    "corning": {
      name: "Corning",
      ticker: "GLW \u00b7 NYSE",
      category: "Manufacturing / Integration",
          metrics: [
      { label: "Market cap", value: "$141B" },
      { label: "Revenue", value: "$16.4B" },
      { label: "EBITDA", value: "$3.7B" },
      { label: "Price", value: "$164" },
      { label: "12mo", value: "+311%" },
    ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Corning invented low-loss optical fiber in 1970 and today controls approximately 40% of global fiber manufacturing capacity \u2014 the single largest share of any company. It is the dominant western producer of optical fiber, cable, and connectivity hardware, and the largest non-Chinese consumer of fiber-grade germanium tetrachloride. When Umicore ships GeCl\u2084 from Olen, a disproportionate share goes to Corning." },
          { text: "Corning is both the demand anchor and a chokepoint in the fiber supply chain. As a demand anchor, its purchasing decisions define the volume of GeCl\u2084 consumed in western fiber production. As a chokepoint, its decision in late 2025 to stop selling bare glass fiber to other cable manufacturers \u2014 reserving supply for its own anchor customers \u2014 directly constrained supply to the rest of the industry. When Corning rations output, the entire western fiber market tightens." },
          { text: "The company operates across five segments \u2014 Optical Communications, Display, Specialty Materials, Automotive, and Life Sciences \u2014 but Optical Communications is the growth engine and the reason the stock has quadrupled from its 2024 lows. The segment generated $6.3B in FY25 revenue, up 35% year-over-year, with net income surging 71% to $1B. Enterprise sales (datacenter connectivity) grew 61%. This is a company being reshaped by AI infrastructure demand in real time." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "Corning\\u2019s fiber business is vertically integrated from preform to finished cable, but the value creation has shifted decisively toward high-density datacenter products. Three dynamics drive the economics:" },
          { title: "Product mix shift", text: "Corning is cannibalizing standard G.652D telecom fiber production to prioritize higher-margin G.657A datacenter fiber and its proprietary Contour cable \u2014 a high-density design that delivers better optical performance in roughly half the space with significantly reduced installation costs. AI datacenter racks require 36x more fiber than traditional CPU racks. Corning\\u2019s new products are designed specifically for this density, which gives them pricing power and market share gains against competitors using older designs." },
          { title: "Customer lockup", text: "The $6B multi-year supply agreement with Meta represents a structural shift in how fiber capacity gets allocated. Hyperscalers are now co-investing in manufacturing infrastructure, effectively reserving capacity years in advance. Corning is building the world\\u2019s largest optical cable manufacturing plant in Hickory, North Carolina, anchored by this deal. Customer prepayments and long-term commitments are funding the capex, de-risking the expansion and locking in revenue." },
          { title: "Pricing power from structural shortage", text: "Fiber prices have climbed from a 2021 low of $3.70 per fiber-km to $6.30 \u2014 a 70% increase. Datacenter-grade fiber has surged even more. Corning\\u2019s CEO has acknowledged being \\u201Cquite tight\\u201C on supply relative to demand. When the industry leader is sold out, everyone downstream pays more." },
          { text: "Corning\\u2019s Springboard plan \u2014 originally targeting $4B in incremental annualized sales and 20% operating margins by 2026 \u2014 was achieved a full year ahead of schedule. The company has now upgraded to an $11B incremental sales target by 2028, driven primarily by Optical Communications expansion." },
        ] },
        { label: "Key numbers", items: [
          { title: "FY25 group", text: "$16.4B revenue (+13%), $2.52 core EPS (+29%), 20.2% operating margin (target achieved one year early), $1.72B free cash flow (nearly doubled from $880M in 2023). GAAP net income $1.59B vs $506M in 2024." },
          { title: "Optical Communications FY25", text: "$6.3B revenue (+35%), $1B net income (+71%), 18% net income margin. Q4 alone: $1.7B revenue (+24%), $305M net income (+57%). Enterprise sales (datacenter) grew 61% for the full year." },
          { title: "FY26 outlook", text: "Q1 guided at $4.2-4.3B revenue (~+15% YoY), EPS $0.66-0.70 (+26%). Capex increasing to ~$1.7B (from $1.3B in FY25), focused on optical capacity expansion. Springboard upgraded to $11B incremental annualized sales by 2028." },
          { title: "Valuation", text: "~$141B market cap, ~90x TTM P/E, ~53x forward P/E. Stock up ~310% over the past year. All-time high of $176.75 reached April 10, 2026. 11 analysts with Buy consensus." },
          { title: "Balance sheet", text: "$1.52B cash, $7.63B long-term debt. $2.69B operating cash flow in FY25. Dividend $1.12/share (~0.7% yield). Share buybacks resumed." },
        ] },
        { label: "What to watch", items: [
          { title: "Hickory mega-plant execution", text: "The North Carolina facility anchored by the Meta deal will be the world\\u2019s largest optical cable manufacturing plant. Construction timeline and ramp-up pace directly determine how much additional capacity enters the market." },
          { title: "GeCl\u2084 supply as the binding constraint", text: "Corning can build cable plants, but it can only produce fiber if it has GeCl\u2084. Its dependency on Umicore for fiber-grade germanium tetrachloride is the single most important supply chain vulnerability. If Umicore\\u2019s Olen facility has a disruption, or if DRC feedstock ramp underperforms, Corning\\u2019s expansion plans hit a ceiling that no amount of capital can override." },
          { title: "Hollow-core fiber as a long-term disruption", text: "Corning\\u2019s entire fiber business depends on germanium-doped glass. Hollow-core fiber eliminates germanium entirely. Microsoft is deploying it on Azure. If HCF reaches commercial viability at scale within 5-10 years, Corning faces a technology transition \u2014 or must acquire/develop HCF capability." },
          { title: "China revenue exposure", text: "Corning generates $1B+ annually from China. Escalating US-China tensions or retaliatory measures could impact this revenue stream." },
        ] },
        { label: "Investment angle", items: [
          { text: "The thesis is largely priced in. At ~$141B market cap and ~90x TTM earnings, the stock has quadrupled in a year and reflects strong conviction in the AI fiber buildout. The question for new capital isn\\u2019t whether the demand story is real \u2014 it demonstrably is \u2014 but whether there\\u2019s incremental demand the market hasn\\u2019t yet modeled." },
          { text: "Three areas where the market may be underpricing: First, the BEAD program ($42B federal broadband) is entering deployment phase in 2026 and competes for the same BABA-compliant fiber. If BEAD demand layers on top of datacenter demand rather than substituting for it, total fiber pull-through could exceed consensus. Second, military drone fiber demand (~50-60M km/yr of G.657A) is growing rapidly and not well-modeled by sell-side analysts. Third, the Springboard upgrade to $11B incremental sales by 2028 implies a growth trajectory steeper than the current multiple suggests." },
          { text: "The variant perception that would make Corning a sell: if datacenter capex cycles down even temporarily, the stock compresses violently from these levels. JPMorgan\\u2019s recent downgrade to Neutral on valuation reflects this concern. Corning is a strong business at a full price. The entry point matters more than the thesis." },
          { text: "For investors already positioned, the key monitoring question is whether Corning\\u2019s GeCl\u2084 supply from Umicore is sufficient to support the capacity expansion. If Corning announces an alternative GeCl\u2084 source or a germanium supply agreement outside Umicore, that would be a significant de-risking event." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Fiber Optic Cable Chain \u00b7 Layer: Manufacturing / Integration Sources: Corning FY25 earnings release (Jan 2026), SEC filings, CRU fiber market data, analyst coverage. Not investment advice.",
    },
    "prysmian": {
      name: "Prysmian",
      ticker: "PRY \u00b7 Borsa Italiana",
      category: "Manufacturing / Cable Systems",
          metrics: [
      { label: "Market cap", value: "€28B" },
      { label: "Revenue", value: "€19.7B" },
      { label: "EBITDA", value: "€2.4B" },
      { label: "Price", value: "~€100" },
      { label: "12mo", value: "+57%" },
    ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Prysmian is the world\\u2019s largest cable company \u2014 not just fiber, but energy cables, subsea power systems, and industrial wiring across 109 production sites worldwide. In the fiber optic supply chain, Prysmian holds approximately 15% of global fiber market share and is vertically integrated from preform manufacturing through finished cable installation. Where Corning dominates in the US and in fiber manufacturing, Prysmian dominates in cable systems \u2014 particularly subsea and high-voltage transmission." },
          { text: "For the fiber optic layer specifically, Prysmian matters for three reasons. First, it is one of the largest cable customers for GeCl\u2084 supply \u2014 Prysmian renewed its Umicore supply agreement in 2025 at a significant premium, accepting higher costs for supply security. Second, its Digital Solutions segment (optical cable and connectivity) is growing rapidly, with adjusted EBITDA nearly doubling in Q4 2025. Third, Prysmian is the lead investor in Relativity Networks, a hollow-core fiber startup \u2014 positioning it across both the conventional supply tightness and the next-generation substitution thesis simultaneously." },
          { text: "The company completed the acquisition of Encore Wire (US low-voltage building wire) and Channell (fiber connectivity accessories) in 2024-2025, and sold its stake in YOFC for a \u20AC346M gain \u2014 reducing Chinese exposure while generating cash." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "Prysmian\\u2019s revenue is dominated by energy cables. Digital Solutions (optical cable and connectivity) contributed approximately \u20AC1.6B in FY25 revenue and \u20AC244M in adjusted EBITDA \u2014 roughly 10% of group EBITDA. The fiber business is important but not dominant." },
          { text: "However, the fiber business is where the margin inflection is happening. Digital Solutions adjusted EBITDA nearly doubled in Q4 2025 to \u20AC75M (from \u20AC40M), with the margin jumping to 18.3% from 13.2%. This reflects both pricing power from fiber supply tightness and the Channell acquisition contribution." },
          { text: "The Transmission segment is Prysmian\\u2019s star performer: \u20AC3.26B revenue (+28.7% organic), Q4 margin hitting 20.9%, and a \u20AC17B backlog providing multi-year visibility. Subsea cable demand is being driven by offshore wind and \u2014 increasingly \u2014 private subsea cable systems funded by AI hyperscalers who are building their own intercontinental fiber routes." },
          { text: "Prysmian\\u2019s structural advantage is that it operates across both power and data transmission. As AI datacenters drive demand for both power cables (to feed the racks) and fiber cables (to connect them), Prysmian captures revenue on both sides." },
        ] },
        { label: "Key numbers", items: [
          { title: "FY25", text: "\u20AC19.65B revenue (+5.4% organic), \u20AC2.40B adjusted EBITDA (+24%), 14.2% margin. Net income \u20AC1.27B (+74%). Free cash flow \u20AC1.17B at 50% EBITDA conversion." },
          { title: "Digital Solutions FY25", text: "~\u20AC1.6B revenue, \u20AC244M EBITDA. Q4 margin reached 18.3%. Organic growth +8.4% in Q4." },
          { title: "Transmission FY25", text: "\u20AC3.26B revenue (+28.7% organic). Q4 margin 20.9% \u2014 hitting 2028 targets three years early. Backlog \u20AC17B." },
          { title: "FY26 guidance", text: "Adjusted EBITDA \u20AC2,625-2,775M. Free cash flow \u20AC1,300-1,400M." },
          { title: "2028 targets", text: "Adjusted EBITDA \u20AC2.95-3.15B, free cash flow \u20AC1.5-1.7B, EPS CAGR 15-19%." },
          { title: "Valuation", text: "~\u20AC28B market cap, ~22x trailing earnings. Dividend \u20AC0.90 (+13%). EBITDA grew at 22.6% CAGR from 2021-2025." },
        ] },
        { label: "What to watch", items: [
          { title: "US listing", text: "Prysmian has signaled interest in a US stock listing, potentially in 2026. A dual listing would improve liquidity and likely trigger a re-rating." },
          { title: "Digital Solutions margin trajectory", text: "Whether the Q4 margin jump to 18.3% sustains through 2026 determines how much the fiber business contributes to group earnings growth." },
          { title: "Relativity Networks and HCF", text: "Prysmian is the lead investor and manufacturing partner (production lines in its Netherlands plant). A hedge \u2014 profiting from conventional tightness today while positioning for HCF." },
          { title: "Subsea cable demand", text: "~40 new submarine systems entering service in 2026, the most active year in history. Private systems funded by AI hyperscalers represent a structural demand shift." },
          { title: "GeCl\u2084 supply dependency", text: "Like Corning, Prysmian depends on Umicore. The premium supply agreement renewal confirms germanium supply security as a strategic priority." },
        ] },
        { label: "Investment angle", items: [
          { text: "Prysmian is the more diversified, less expensive way to play the same fiber thesis as Corning, with added subsea and energy cable optionality. At ~22x trailing earnings, it trades at a meaningful discount to Corning\\u2019s ~90x \u2014 reflecting the Italian listing, energy cable exposure, and the market\\u2019s tendency to value it as a cable manufacturer rather than an infrastructure platform." },
          { text: "The most interesting near-term catalyst is the potential US listing in 2026. If Prysmian dual-lists on NYSE, it gains access to US institutional capital that currently finds the Italian listing operationally difficult. This alone could trigger a re-rating." },
          { text: "The Relativity Networks investment provides technology optionality at minimal capital risk. If HCF takes off, Prysmian has a seat at the table. If it doesn\\u2019t, the investment is immaterial. This is the hedge-both-sides position \u2014 profiting from conventional fiber scarcity today while positioning for substitution." },
          { text: "The subsea exposure is the differentiated angle Corning doesn\\u2019t offer. Private submarine cables funded by hyperscalers are a structural demand shift with multi-year project timelines." },
          { text: "Risk: energy cable segments dominate earnings and are driven by different fundamentals (offshore wind, grid expansion). A downturn in European infrastructure spending could weigh on the stock even if fiber performs well." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Fiber Optic Cable Chain \u00b7 Layer: Manufacturing / Cable Systems Sources: Prysmian FY25 results (Feb 2026), quarterly earnings calls, analyst coverage. Not investment advice.",
    },
    "fujikura": {
      name: "Fujikura",
      ticker: "5803 \u00b7 TSE",
      category: "Manufacturing / Pure-Play",
          metrics: [
      { label: "Market cap", value: "¥9.3T" },
      { label: "Revenue", value: "¥979B" },
      { label: "EBITDA", value: "¥206B" },
      { label: "Price", value: "¥27,630" },
      { label: "12mo", value: "+155%" },
    ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Fujikura is the closest thing to a pure-play on AI-driven fiber demand among listed equities. The Japanese industrial company \u2014 which developed the world\\u2019s first optical fiber in 1959 \u2014 generates over 50% of its revenue from the United States and exports approximately 75% of its optical fiber output. Its Information Technology segment is the primary growth driver, with datacenter application sales projected to grow 1.6x year-over-year in FY26." },
          { text: "Fujikura matters in the fiber supply chain for a specific structural reason: it is entirely dependent on Umicore for its GeCl\u2084 supply. Japan has no domestic fiber-grade germanium tetrachloride production. When China\\u2019s export controls constricted germanium flow, Japanese fiber manufacturers had no fallback \u2014 their supply runs through Belgium. This makes Fujikura a direct expression of the Umicore chokepoint thesis." },
          { text: "The company also owns AFL, a major US cable assembler based in South Carolina, providing fully domestic BABA-compliant fiber cable for government and defense programs." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "Fujikura operates across Information Technology (fiber optics), Electronics (PCBs, connectors), Automotive (wiring harnesses), and Energy (power cables). The AI fiber thesis lives in Information Technology, which has been the dominant growth driver." },
          { text: "The company\\u2019s competitive position comes from advanced connector and optical component technology \u2014 fusion splicers and high-density ferrules that command premium pricing in datacenter builds. Fujikura announced in March 2026 that it will triple optical fiber output for the US market to meet AI infrastructure demand." },
          { text: "The balance sheet is clean \u2014 debt-free with growing cash reserves. Dividend raised 82% to \u00A5100 per share with a 30% payout ratio. A 6-for-1 stock split was announced in February 2026." },
        ] },
        { label: "Key numbers", items: [
          { title: "FY25 (ended March 2025)", text: "\u00A5979B revenue (+22.5%). Over 50% of sales in the US." },
          { title: "FY26 forecast", text: "EPS \u00A5469 (+40%). Datacenter telecom sales 1.6x YoY. Dividend raised to \u00A5190/share." },
          { title: "Market cap", text: "~\u00A59.3T (~$62B). P/E ~38x. All-time high \u00A55,644 reached April 10, 2026." },
          { title: "AFL subsidiary", text: "Major US cable assembler, BABA-compliant, serves utility, datacenter, and defense markets." },
        ] },
        { label: "What to watch", items: [
          { title: "US capacity tripling", text: "The March 2026 announcement requires preform expansion, draw tower investment, and \u2014 critically \u2014 secured GeCl\u2084 supply from Umicore." },
          { title: "Umicore dependency", text: "Fujikura has no alternative GeCl\u2084 source. If Umicore prioritizes larger customers or faces a disruption, Fujikura\\u2019s output ceiling drops first." },
          { title: "Yen exposure", text: "Over 50% of revenue is US-denominated but the stock trades in yen. Currency movements can amplify or dampen returns." },
        ] },
        { label: "Investment angle", items: [
          { text: "Fujikura is the purest listed proxy for the AI fiber demand thesis. If you believe the datacenter buildout accelerates and want single-stock exposure, Fujikura is the most direct vehicle." },
          { text: "The variant perception: the market is pricing Fujikura\\u2019s growth but may be underpricing the GeCl\u2084 supply risk. Fujikura is entirely dependent on Umicore \u2014 no domestic Japanese alternative exists. If Umicore prioritizes larger customers (Corning) or faces a supply disruption, Fujikura\\u2019s output ceiling drops before anyone else\\u2019s. An investor long Fujikura should also be monitoring Umicore\\u2019s germanium throughput closely." },
          { text: "The AFL subsidiary provides back-door US defense and BEAD exposure that\\u2019s currently underappreciated in Fujikura\\u2019s valuation. As the BEAD program deploys and defense drone fiber demand grows, AFL becomes a meaningful contributor." },
          { text: "Accessibility: TSE-listed in yen. 6-for-1 stock split announced February 2026 to improve accessibility. Currency risk is real \u2014 over 50% USD-denominated revenue priced in yen." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Fiber Optic Cable Chain \u00b7 Layer: Manufacturing / Pure-Play Sources: Fujikura FY25 results, analyst coverage. Not investment advice.",
    },
    "rosendahl-nextrom": {
      name: "Rosendahl Nextrom",
      ticker: "Private \u00b7 Knill Gruppe, Austria",
      category: "Equipment / Chokepoint",
          metrics: [],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Rosendahl Nextrom manufactures virtually all of the preform deposition equipment used by every major fiber optic manufacturer in the world. Their MCVD, PCVD, OVD, and VAD systems are the machines that build fiber preforms \u2014 the glass rods from which optical fiber is drawn. Without Nextrom equipment, you cannot make preforms. Without preforms, you cannot make fiber." },
          { text: "This makes Rosendahl Nextrom the hidden chokepoint in the fiber supply chain. Every major fiber manufacturer \u2014 Corning, Prysmian, Fujikura, Sumitomo, YOFC, Shin-Etsu \u2014 uses Nextrom systems. When all of them attempt to expand simultaneously, they compete for delivery slots from the same single supplier. The result: 18-24 month backlogs. Capacity ordered today will not produce fiber until 2028 at the earliest." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "Equipment sales (multi-million dollar capital equipment) plus lifecycle services \u2014 installation, calibration, maintenance, and spare parts over the 25+ year lifespan of each system. Hundreds of systems delivered since 1990." },
          { text: "The company also manufactures the OFC 11 PCVD system, which achieves over 95% GeCl\u2084 collection efficiency versus MCVD\\u2019s 40-60% \u2014 effectively doubling germanium utilization per fiber-km. Widespread PCVD adoption would slow germanium demand growth, but MCVD remains the dominant installed base with replacement cycles measured in decades." },
          { text: "Rosendahl Nextrom also markets helium recovery systems to fiber producers \u2014 addressing two of the three independent bottlenecks in fiber production (preform equipment and helium recovery), while GeCl\u2084 conversion remains Umicore\\u2019s domain." },
        ] },
        { label: "Key numbers", items: [
          { text: "Delivery backlog: 18-24 months for new deposition systems. Installed base: hundreds of systems since 1990. System lifespan: 25+ years. PCVD efficiency: 95%+ GeCl\u2084 collection vs 40-60% for MCVD. Parent company Knill Gruppe: family-owned since 1712, ~800 employees. Recent acquisition: WINDAK Group (cable packaging equipment), February 2026." },
        ] },
        { label: "What to watch", items: [
          { title: "Backlog duration", text: "\u2014 the best leading indicator for when the fiber supply gap closes." },
          { title: "PCVD adoption rate", text: "\u2014 signals whether the industry is prioritizing germanium efficiency, which would ease the Umicore bottleneck." },
          { title: "Potential strategic transactions", text: "\u2014 a private monopoly supplier to a booming industry is a natural acquisition target." },
          { title: "Alternative equipment suppliers", text: "\u2014 any emergence of a credible second source for preform deposition equipment would be structurally significant. None has emerged to date." },
        ] },
        { label: "Investment angle", items: [
          { text: "Not directly investable. Rosendahl Nextrom is wholly owned by Knill Gruppe, a private Austrian family-owned industrial group established in 1712. No public equity, no bond offering, no indication of IPO plans." },
          { text: "The indirect investment angle runs through the entities that benefit from Nextrom\\u2019s bottleneck. Every fiber manufacturer whose expansion is constrained by 18-24 month delivery backlogs \u2014 Corning, Prysmian, Fujikura \u2014 experiences pricing power and margin expansion precisely because supply can\\u2019t grow fast enough. If you\\u2019re long Corning or Prysmian, you\\u2019re implicitly long the Nextrom bottleneck." },
          { text: "No credible competitor for preform deposition equipment exists. Hundreds of installed systems since 1990 create switching costs and decades of service revenue. The monopoly appears durable." },
          { text: "The acquisition question: if Corning, Prysmian, or private equity were to acquire Rosendahl Nextrom, the acquirer would control the capacity expansion timeline for every competitor. Knill Gruppe recently acquired WINDAK Group (February 2026), suggesting the family is in expansion mode rather than exit mode \u2014 but every family business has a price. Worth monitoring for any signals of strategic interest." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Fiber Optic Cable Chain \u00b7 Layer: Equipment / Chokepoint Sources: CRU fiber market analysis, Rosendahl Nextrom product specifications, CB Insights, Swagelok case study. Not investment advice.",
    },
    "yofc": {
      name: "YOFC",
      ticker: "6869 \u00b7 HKEX",
      category: "Manufacturing (China)",
          metrics: [
      { label: "Market cap", value: "HK$18B" },
      { label: "Revenue", value: "HK$17.7B" },
      { label: "EBITDA", value: "—" },
      { label: "Price", value: "~HK$23" },
      { label: "12mo", value: "+85%" },
    ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "YOFC is China\\u2019s largest and the world\\u2019s most prolific fiber optic manufacturer by preform capacity. With 3,500 tonnes/year, YOFC dwarfs any individual western manufacturer. It supplies approximately 30% of China Mobile\\u2019s fiber needs and exports to over 100 countries with plants in Mexico, Indonesia, South Africa, Brazil, and Poland." },
          { text: "YOFC is the Chinese structural counterparty in the fiber chain \u2014 like Yunnan Chihong in the germanium chain. Its capacity decisions, pricing behavior, and technology development set the terms for global fiber supply." },
          { text: "What makes YOFC uniquely interesting is its hollow-core fiber development. YOFC achieved the world-record 0.040 dB/km attenuation for HCF in lab conditions and drew 91.2 km from a single HCF preform. It is simultaneously the world\\u2019s largest consumer of germanium-doped preform technology and the most advanced developer of the technology that replaces it." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "YOFC benefits from China\\u2019s domestic germanium access \u2014 Chinese fiber manufacturers source GeCl\u2084 at domestic pricing (~$2,000/kg equivalent), not the western premium ($7,000-8,500/kg). This structural cost advantage persists as long as export controls do." },
          { text: "YOFC\\u2019s HCF development is the most strategically significant technology program in the fiber optic industry. If HCF reaches commercial production scale at YOFC, it would give China\\u2019s largest manufacturer a product that eliminates germanium dependency entirely \u2014 potentially leapfrogging the western supply chain constraint." },
          { text: "Prysmian recently sold its YOFC stake for \u20AC346M \u2014 a notable de-risking of Chinese exposure by one of the world\\u2019s largest cable companies." },
        ] },
        { label: "Key numbers", items: [
          { text: "Preform capacity: 3,500t/yr \u2014 world\\u2019s largest. Exports to 100+ countries. Plants in 5 countries. China Mobile supply: ~30% of their fiber needs. HCF records: 0.040 dB/km (world record), 91.2 km single preform draw. Market cap: ~HK$18B." },
        ] },
        { label: "What to watch", items: [
          { title: "HCF commercialization timeline", text: "\u2014 the single most important technology watch for the entire fiber supply chain." },
          { title: "Geopolitical risk", text: "\u2014 JVs with Corning and Shin-Etsu create IP transfer concerns under increasing regulatory scrutiny." },
          { title: "Chinese export controls cutting both ways", text: "\u2014 controls benefit YOFC on cost but could eventually constrain even domestic producers if internal demand absorbs more supply." },
        ] },
        { label: "Investment angle", items: [
          { text: "YOFC trades on the Hong Kong Exchange (6869.HK), providing more accessibility than mainland A-shares but still carrying significant governance and geopolitical risk. Chinese state influence on operations, pricing, and technology transfer is a real concern for western institutional investors." },
          { text: "The monitoring value of YOFC exceeds its investment value for most western capital. Tracking YOFC\\u2019s capacity decisions, pricing behavior, and HCF development provides essential intelligence for understanding the fiber supply chain \u2014 its actions affect Corning\\u2019s competitive position, Umicore\\u2019s demand outlook, and the entire germanium thesis." },
          { text: "If an investor were to hold YOFC despite the risks, the thesis would be: domestic Chinese GeCl\u2084 at $2,000/kg gives YOFC a structural cost advantage over every western competitor paying $7,000-8,500/kg. The HCF world record adds technology optionality." },
          { text: "The bear case: Chinese fiber overcapacity has historically depressed global pricing. If YOFC seeks export growth via its international plants, it could pressure western manufacturers on price. Prysmian\\u2019s sale of its YOFC stake \u2014 a de-risking decision by one of the world\\u2019s largest cable companies \u2014 should inform any western investor\\u2019s assessment." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Fiber Optic Cable Chain \u00b7 Layer: Manufacturing (China) Sources: YOFC corporate disclosures, CRU fiber market data, Prysmian YOFC stake sale disclosures. Not investment advice.",
    },
    "hollow-core-fiber": {
      name: "Hollow-Core Fiber Ecosystem",
      ticker: "Thematic",
      category: "Technology / Substitution",
          metrics: [],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Hollow-core fiber is the structural bear case for germanium demand in fiber optics. Instead of guiding light through a germanium-doped glass core, HCF transmits light through air enclosed within a microstructured cladding. This eliminates germanium from the manufacturing process entirely. Light travels approximately 30% faster through air than glass, delivering a latency advantage for AI training synchronization, high-frequency trading, and real-time inference." },
          { text: "Microsoft deployed first at scale through its Lumenisity acquisition. Azure has 1,280 km deployed with zero field failures. Target: 15,000 km by late 2026. Relativity Networks ($10.7M raised, Prysmian as lead investor and manufacturing partner) is building HCF production lines in Prysmian\\u2019s Netherlands plant with an unnamed hyperscaler (likely AWS) that \\u201Cwants pretty much everything they can make.\\u201C YOFC holds the lab performance record (0.040 dB/km, 91.2 km single preform draw). Additional developers include Lightera (formerly OFS, Furukawa subsidiary) and Hengtong Optic-Electric." },
          { text: "Total global HCF deployment by end 2026 will be approximately 20,000 km \u2014 against billions installed. HCF at ~1,000x standard fiber price is a specialty product today, not a mass-market replacement. It arrives after the current supply crisis peaks." },
        ] },
        { label: "How does this affect the rest of the chain?", items: [
          { text: "On a 2-3 year horizon, HCF is irrelevant to the supply-demand balance. On a 5-10 year horizon, it is the most important technology development in the fiber industry. If HCF reaches cost parity with conventional fiber, it would eliminate 38% of global germanium demand (the fiber optics share) \u2014 a bear case for Umicore\\u2019s GeCl\u2084 business, germanium pricing, and every entity whose value depends on germanium scarcity in fiber." },
          { text: "The transition dynamics: even at cost parity, replacing billions of km of installed fiber takes decades. New builds shift first. The adoption curve is slow-then-fast." },
        ] },
        { label: "What to watch", items: [
          { title: "Microsoft Azure milestones", text: "\u2014 15,000 km target by late 2026. If achieved with zero failures, proves field-deployability at scale." },
          { title: "Cost trajectory", text: "\u2014 at 1,000x it\\u2019s specialty. At 10x it\\u2019s viable for premium applications. At 2-3x it starts displacing conventional fiber. At parity it triggers industry-wide transition." },
          { title: "Corning\\u2019s response", text: "\u2014 Corning has not publicly announced an HCF program. Silence is either strategic patience or strategic denial. If Corning begins acquiring HCF technology, the disruption timeline is shorter than assumed." },
        ] },
        { label: "Investment angle", items: [
          { text: "The investable vehicles for the HCF thesis are limited but identifiable:" },
          { title: "Prysmian (PRY)", text: "is the most accessible. Lead investor in Relativity Networks and manufacturing partner. Captures HCF upside while profiting from conventional scarcity today. The hedge-both-sides position." },
          { title: "Microsoft (MSFT)", text: "owns Lumenisity and is deploying at scale. HCF is a rounding error in Microsoft\\u2019s $3T market cap, but it signals where the largest cloud platform sees fiber technology heading." },
          { title: "Relativity Networks", text: "is private \u2014 $10.7M raised, Prysmian as lead. An unnamed hyperscaler (likely AWS based on reporting) is a confirmed customer. Not investable unless you\\u2019re in the venture ecosystem, but the company to track for commercialization signals." },
          { title: "YOFC (6869.HK)", text: "holds the lab performance record and has the manufacturing scale to commercialize if cost reaches the right point. Chinese-listed with all associated risks." },
          { title: "Lightera (formerly OFS)", text: "and **Hengtong Optic-Electric** are additional developers with less visibility." },
          { text: "The key question isn\\u2019t whether HCF works \u2014 Microsoft has proved that. The question is when it gets cheap enough. Track the price-per-km from Relativity Networks\\u2019 production partnership with Prysmian \u2014 that number tells you the timeline. Relativity\\u2019s CEO has stated the goal is to scale from tens of thousands of km to hundreds of thousands of km over the next few years. If they hit that, the cost curve bends fast." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Fiber Optic Cable Chain \u00b7 Layer: Technology / Substitution Sources: Microsoft Azure deployment data, Relativity Networks fundraising disclosures, Prysmian partnership announcement, YOFC OFC presentations, Fierce Network reporting. Not investment advice.",
    },
    "helium": {
      name: "Helium",
      ticker: "Physical Input",
      category: "Raw Material / Constrained Input",
          metrics: [],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Helium is the third independent bottleneck in the fiber optic supply chain \u2014 alongside preform equipment (Rosendahl Nextrom) and GeCl\u2084 conversion (Umicore). Drawing fiber from a preform requires ultra-pure helium as a coolant: the glass strand exits the 2,000°C furnace at 10-20 meters per second and must be rapidly cooled. There is no commercially viable substitute. No other gas has the necessary combination of thermal conductivity, inertness, and low molecular weight." },
          { text: "Global helium supply has been disrupted by plant outages in Russia and the United States. The US Federal Helium Reserve is nearing depletion. Prices soared to ~$15/m³ in 2025. Fiber manufacturers compete for helium with semiconductor fabs, MRI systems, space launch, and scientific research." },
          { text: "Helium cannot be manufactured. It cannot be recycled in most applications. Once vented to atmosphere, it is lost permanently." },
        ] },
        { label: "How does this affect the rest of the chain?", items: [
          { text: "Helium\\u2019s impact on fiber production is real but less binding than the other two bottlenecks. A manufacturer can run a draw tower with reduced helium flow (slower speeds, potentially lower quality), but cannot run without GeCl\u2084 or preforms. Helium is a rate-limiting input \u2014 it slows production rather than stopping it." },
          { text: "However, in a market at full utilization, even a 5-10% throughput reduction translates to millions of fiber-km of lost output. Rosendahl Nextrom now actively markets helium recovery systems ($500K-2M per system) \u2014 the fact that this is now a standard product, not a specialty option, indicates the shortage has changed fiber production economics permanently." },
        ] },
        { label: "What to watch", items: [
          { title: "Qatar North Field expansion", text: "\u2014 expected to add significant helium supply by 2027-2028." },
          { title: "Namibia helium projects", text: "\u2014 greenfield exploration-stage, uncertain timelines but represent the most significant new non-Qatar, non-US sources." },
          { title: "US Federal Helium Reserve depletion", text: "\u2014 removes a historical buffer, making future supply disruptions more volatile." },
          { title: "Helium recovery adoption", text: "\u2014 reduces net consumption per fiber-km, easing the constraint without new supply." },
        ] },
        { label: "Investment angle", items: [
          { text: "Not directly investable as a commodity. No futures market, no ETF, no exchange. The major producers \u2014 ExxonMobil, Qatar Energy, Linde (LIN), Air Liquide (AI.PA), Air Products (APD) \u2014 are massive diversified companies where helium is a minor revenue line. Buying Linde for helium exposure is like buying Teck for germanium exposure." },
          { text: "The more interesting angle is indirect: helium scarcity improves the competitive position of fiber manufacturers who have secured supply or installed recovery systems. Manufacturers with recovery capability run at higher utilization, producing more fiber from the same preform input. This is a subtle but real competitive advantage \u2014 worth tracking in manufacturer capex disclosures, though rarely public." },
          { text: "For the fiber supply chain thesis, helium is the least investable but most underappreciated of the three bottlenecks. Most fiber analysts focus on preform equipment and germanium. Helium rarely appears in sell-side models. That analytical gap creates potential informational advantage for investors tracking the full supply chain \u2014 which is precisely the value Stillpoint Intelligence provides." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Fiber Optic Cable Chain \u00b7 Layer: Raw Material / Constrained Input Sources: CRU helium market data, USGS Mineral Commodity Summaries, Rosendahl Nextrom product specifications. Not investment advice.",
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
            {[{ l: "Input", w: "25%" }, { l: "Per km", w: "14%" }, { l: "% of cost (base)", w: "18%" }, { l: "Price trend", w: "14%" }, { l: "Form", w: "40%" }, { l: "Status", w: "14%", right: true }].map(h => (
              <p key={h.l} style={{ fontSize: 9, letterSpacing: "0.06em", color: "#4a4540", margin: 0, width: h.w, textAlign: (h as {right?: boolean}).right ? "right" as const : undefined }}>{h.l}</p>
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
              <p style={{ fontSize: 11, color: "#a09888", margin: 0, width: "14%" }}>{row.perKm}</p>
              <p style={{ fontSize: 11, color: "#a09888", margin: 0, width: "18%" }}>{row.share}</p>
              <p style={{ fontSize: 11, color: "#a09888", margin: 0, width: "14%" }}>{row.trend}</p>
              <p style={{ fontSize: 11, color: "#706a60", margin: 0, width: "40%" }}>{row.form}</p>
              <p style={{ fontSize: 11, fontWeight: 500, margin: 0, width: "14%", textAlign: "right" as const, color: row.status === "Constrained" ? "#8a5a4a" : row.status === "Tightening" ? "#8a7a3a" : row.status === "Available" ? "#4a7a4a" : "#4a4540" }}>{row.status}</p>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: "1px solid #252220" }}>
            <p style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, margin: 0, width: "25%" }}>Production cost / km</p>
            <p style={{ margin: 0, width: "14%" }} />
            <p style={{ fontSize: 11, color: "#ece8e1", fontWeight: 500, margin: 0, width: "18%" }}>~$5.50</p>
            <p style={{ fontSize: 11, color: "#ece8e1", fontWeight: 500, margin: 0, width: "14%" }}>~$8.50</p>
            <p style={{ margin: 0, width: "40%" }} /><p style={{ margin: 0, width: "14%" }} />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", padding: "12px 0" }}>
            <p style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, margin: 0, width: "25%" }}>Market price / km (G.657A)</p>
            <p style={{ margin: 0, width: "14%" }} />
            <p style={{ fontSize: 11, color: "#ece8e1", fontWeight: 500, margin: 0, width: "18%" }}>~$7–8</p>
            <p style={{ fontSize: 11, color: "#ece8e1", fontWeight: 500, margin: 0, width: "14%" }}>~$22–28</p>
            <p style={{ margin: 0, width: "40%" }} /><p style={{ margin: 0, width: "14%" }} />
          </div>
          <div style={{ borderTop: "1px solid #252220", paddingTop: 14, marginTop: 4 }}>
            <p style={{ fontSize: 11, color: "#706a60", lineHeight: 1.6, margin: 0 }}>Three inputs are constrained simultaneously — germanium, SiCl₄, and helium — representing ~30% of baseline production cost. Their combined price surges have pushed estimated production cost up ~55%. But G.657A datacenter-grade fiber prices have surged over 210%, as AI datacenter and military drone demand compete for the same production lines.</p>
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
            { use: "AI datacenters", fiberType: "G.657A", demand: "~210M km", price: "~$25", value: "~$5.3B", share: "30%", driver: "GPU cluster interconnect, DCI", status: "Surging (+62%)" },
            { use: "Terrestrial telecom", fiberType: "G.652D", demand: "~290M km", price: "~$15", value: "~$4.4B", share: "25%", driver: "FTTH, 5G backhaul, metro", status: "Stable" },
            { use: "Subsea cables", fiberType: "G.654E", demand: "~70M km", price: "~$75", value: "~$5.3B", share: "30%", driver: "Intercontinental capacity", status: "Growing" },
            { use: "Military / UAV", fiberType: "G.657A", demand: "~55M km", price: "~$25", value: "~$1.4B", share: "8%", driver: "Drone communication systems", status: "Surging" },
            { use: "BEAD broadband", fiberType: "G.652D", demand: "~65M km", price: "~$15", value: "~$1.0B", share: "5%", driver: "Federal rural program, $42B", status: "Ramping" },
            { use: "Other", fiberType: "Mixed", demand: "~30M km", price: "~$18", value: "~$0.5B", share: "2%", driver: "Enterprise, industrial, sensing", status: "Stable" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: "1px solid #252220" }}>
              <p style={{ fontSize: 12, color: "#a09888", fontWeight: 500, margin: 0, width: "20%" }}>{row.use}</p>
              <p style={{ fontSize: 11, color: "#706a60", margin: 0, width: "10%" }}>{row.fiberType}</p>
              <p style={{ fontSize: 11, color: "#a09888", margin: 0, width: "10%" }}>{row.demand}</p>
              <p style={{ fontSize: 11, color: "#a09888", margin: 0, width: "10%" }}>{row.price}</p>
              <p style={{ fontSize: 11, color: "#a09888", margin: 0, width: "10%" }}>{row.value}</p>
              <p style={{ fontSize: 11, color: "#a09888", margin: 0, width: "10%" }}>{row.share}</p>
              <p style={{ fontSize: 11, color: "#706a60", margin: 0, width: "20%", lineHeight: 1.5 }}>{row.driver}</p>
              <p style={{ fontSize: 11, fontWeight: 500, margin: 0, width: "10%", textAlign: "right" as const, color: row.status.startsWith("Surging") ? "#8a5a4a" : row.status === "Growing" || row.status === "Ramping" ? "#8a7a3a" : "#4a7a4a" }}>{row.status}</p>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: "1px solid #252220" }}>
            <p style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, margin: 0, width: "20%" }}>Total</p>
            <p style={{ margin: 0, width: "10%" }} />
            <p style={{ fontSize: 11, color: "#ece8e1", fontWeight: 500, margin: 0, width: "10%" }}>~720M km</p>
            <p style={{ margin: 0, width: "10%" }} />
            <p style={{ fontSize: 11, color: "#ece8e1", fontWeight: 500, margin: 0, width: "10%" }}>~$17.9B</p>
            <p style={{ fontSize: 11, color: "#ece8e1", fontWeight: 500, margin: 0, width: "10%" }}>100%</p>
            <p style={{ margin: 0, width: "20%" }} /><p style={{ fontSize: 11, color: "#ece8e1", fontWeight: 500, margin: 0, width: "10%", textAlign: "right" as const }}>850M+ km (+18%)</p>
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
              { id: "corning", name: "Corning", ticker: "GLW \u00b7 NYSE", category: "Chokepoint holder", line1: "~40% of global fiber manufacturing capacity. Inventor of Contour cable for AI datacenter workloads.", line2: "Sold out through 2026. Stopped selling bare glass to competitors. $6B Meta anchor deal. Building world\u2019s largest cable plant in Hickory, NC. Pricing power from structural shortage." },
              { id: "prysmian", name: "Prysmian", ticker: "PRY \u00b7 Borsa Italiana", category: "Capacity builder", line1: "Largest cable manufacturer globally. Vertically integrated from preform to installed cable.", line2: "Acquired North American preform capacity. Renewed Umicore GeCl\u2084 supply at premium. Lead investor in Relativity Networks (HCF startup). Positioned across conventional tightness and next-gen optionality." },
              { id: "fujikura", name: "Fujikura", ticker: "5803 \u00b7 TSE", category: "Pure-play", line1: "Closest thing to a pure-play on AI-driven fiber demand. Over 50% of revenue from the US.", line2: "Tripling optical fiber output for US market. Entirely dependent on Umicore for GeCl\u2084. Debt-free. Stock +155% in 2025. AFL subsidiary provides BABA-compliant US cable for defense and BEAD." },
              { id: "rosendahl-nextrom", name: "Rosendahl Nextrom", ticker: "Private \u00b7 Knill Gruppe (Austria)", category: "Chokepoint holder", line1: "Near-monopoly on preform deposition equipment \u2014 MCVD, PCVD, OVD, VAD systems.", line2: "Defines the capacity ceiling for the entire fiber industry. 18-24 month delivery backlogs. Hundreds of systems delivered since 1990. Not directly investable but determines the timeline for everyone else." },
              { id: "yofc", name: "YOFC", ticker: "6869 \u00b7 HKEX", category: "Technology", line1: "China\u2019s largest fiber manufacturer. World-record 0.040 dB/km hollow-core fiber in lab.", line2: "3,500t/yr preform capacity. Dual exposure: benefits from conventional supply tightness today while building HCF optionality. 91.2 km drawn from a single preform. Also developing multicore fiber." },
              { id: "hollow-core-fiber", name: "Hollow-core fiber ecosystem", ticker: "Thematic", category: "Technology", line1: "Eliminates germanium from fiber entirely. Light through air, not doped glass. 30% lower latency.", line2: "Microsoft deploying on Azure (1,280 km, zero failures). Relativity Networks ($10.7M raised, Prysmian-backed). Lumenisity (Microsoft acquisition). ~1,000x current fiber price. Pre-commercial but rapidly advancing." },
              { id: "helium", name: "Helium", ticker: "Physical input", category: "Constrained input", line1: "Third independent bottleneck in fiber production. No substitute. Cannot be manufactured or recycled.", line2: "Price +135% over two years. US Federal Helium Reserve nearing depletion. Fiber manufacturers competing with semiconductor fabs, MRI systems, and space launch for supply." },
            ].map((idea, i) => (
              <div key={idea.id} style={{ display: "flex", background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: "18px 22px", transition: "border-color 0.15s", cursor: IDEA_BRIEFS[idea.id] ? "pointer" : "default" }}
                onClick={() => { if (IDEA_BRIEFS[idea.id]) setActiveIdea(idea.id); }}
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

      </div>
    </div>
  );
}
