"use client";
import React, { useState, useMemo } from "react";
import TreeMap from "@/components/TreeMap";
import { buildGalliumGeometry, computeGalliumSvgWidth } from "@/lib/treeGeometry";
import galliumChainJson from "@/data/gallium-chain.json";
import galliumNodesJson from "@/data/gallium-nodes.json";
import type { GalliumChain, NodeData } from "@/types";

export default function GalliumInputPage() {
  const [soWhatOpen, setSoWhatOpen] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("thesis");
  const [activeIdea, setActiveIdea] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const galliumChain = (galliumChainJson as Record<string, unknown>).GALLIUM_CHAIN as unknown as GalliumChain;
  const galliumNodes = galliumNodesJson as unknown as Record<string, NodeData>;
  const lc = (galliumChainJson as Record<string, unknown>).layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;
  const galliumW = useMemo(() => computeGalliumSvgWidth(galliumChain), [galliumChain]);
  const galliumGeo = useMemo(() => buildGalliumGeometry(galliumChain, galliumW / 2, 80), [galliumChain, galliumW]);
  const galliumH = galliumGeo.outputNode.cy + 120;

  // Scroll spy
  React.useEffect(() => {
    const ids = ["thesis", "supply-tree", "dependencies", "supply-demand", "so-what", "money", "catalysts", "risk"];
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

  const accent = "#7a8a6a";
  const warmWhite = "#ece8e1";
  const muted = "#706a60";
  const dimText = "#555";
  const dimmer = "#4a4540";
  const cardBg = "#1a1816";
  const borderColor = "#252220";

  const IDEA_BRIEFS: Record<string, { name: string; ticker: string; category: string; metrics: { label: string; value: string }[]; sections: { label: string; items: { title?: string; text: string }[] }[]; disclaimer: string }> = {
    "alcoa": {
      name: "Alcoa Corporation",
      ticker: "AA \u00b7 NYSE",
      category: "Capacity Builder",
      metrics: [
        { label: "Market cap", value: "~$10B" },
        { label: "Revenue", value: "~$12B" },
        { label: "EBITDA", value: "~$1.5B" },
        { label: "Price", value: "~$40" },
        { label: "12mo", value: "+15%" },
      ],
      sections: [
      { label: "What is this and why does it matter here?", items: [
        { text: "Alcoa is one of the world\'s largest aluminum producers, vertically integrated across the full upstream stack \u2014 bauxite mining, alumina refining, and aluminum smelting. The company operates major bauxite mines in Australia, Brazil, and Guinea; alumina refineries across multiple continents; and aluminum smelters in North America, Europe, and Australia. The bulk of revenue comes from primary aluminum sales to automakers, construction firms, packaging companies, and industrial buyers. Gallium has historically not been part of the business." },
        { text: "What puts Alcoa on this page is a project announced in October 2025 that materially repositions the company in the western critical minerals supply story: Alcoa committed to building a gallium recovery facility at one of its Western Australian alumina refineries, targeting 100 tonnes per year of primary gallium output. That single facility, if executed, would produce approximately 10% of current global gallium demand and represent a roughly 10x increase in total non-Chinese primary gallium supply. The project is structured as a four-government joint venture \u2014 Japanese government-backed entities, the Australian government, the US government, and Alcoa as the operator \u2014 with each government party receiving gallium offtake in proportion to its investment." },
        { text: "The strategic significance is twofold. First, it inserts Alcoa into the gallium chain as the largest single non-Chinese capacity-builder before any of the other three western projects (Metlen, Rio Tinto/Indium Corp, Korea Zinc/Crucible) reach FID. Second, it establishes a model \u2014 sovereign-backed offtake of byproduct critical minerals from existing alumina refineries \u2014 that other Alcoa refineries could replicate if the first facility succeeds." },
      ] },
      { label: "How does value flow through this entity?", items: [
        { text: "Alcoa\'s gallium business, if the project gets built, captures value through several mechanisms beyond simple commodity production:" },
      ] },
      { label: "Investment angle", items: [
        { text: "The thesis on Alcoa is aluminum-cycle exposure with gallium optionality attached, where the gallium optionality is currently undervalued because the project is pre-FID. For investors already comfortable with the aluminum cycle, Alcoa offers the clearest near-term path to meaningful western gallium production at the lowest incremental cost basis. The 100 t/yr target alone represents the largest single non-Chinese gallium capacity addition planned, and the sovereign-backed structure de-risks demand." },
        { text: "The variant perception that would make Alcoa undervalued: the market is treating the JAGA project as a small line item in an aluminum cyclical, but the strategic optionality across Alcoa\'s broader refinery network \u2014 and the precedent JAGA sets for future sovereign critical minerals partnerships \u2014 could compound over multiple projects. If Alcoa announces a second refinery facility within 18 months of first production at Wagerup/Pinjarra, the market re-rates the company from \"aluminum cyclical\" to \"western critical minerals platform.\"" },
        { text: "The bear case is execution risk plus aluminum exposure. Mining projects slip; the JAGA timeline is already tight. If first production slips to 2028, the gallium contribution won\'t materialize before the 2026-2027 western supply tightness window \u2014 by which time other projects (Metlen, Rio Tinto, Korea Zinc) may have caught up. And in the near term, an aluminum cycle downturn would compress Alcoa\'s valuation regardless of gallium progress." },
        { text: "For investors already positioned, the monitoring question is whether the JAGA FID happens in 2026 and whether the joint venture announces a second-facility intent within 18 months of that. If both happen, the gallium thesis on Alcoa transitions from optionality to material contributor." },
      ] },
    ],
      disclaimer: "Disclaimer: Stillpoint Intelligence \u00b7 Gallium Chain \u00b7 Layer: Primary Producer (planned). Sources: Alcoa investor communications (October 2025), JOGMEC and Sojitz announcements, Australian government project commitments (2024). Not investment advice.",
    },
    "metlen": {
      name: "Metlen Energy & Metals",
      ticker: "MYTIL \u00b7 Athens Stock Exchange",
      category: "Capacity Builder",
      metrics: [
        { label: "Market cap", value: "\u20ac5.03B" },
        { label: "Revenue", value: "\u20ac5.68B" },
        { label: "EBITDA", value: "~\u20ac900M" },
        { label: "Price", value: "~\u20ac48" },
        { label: "12mo", value: "+53%" },
      ],
      sections: [
      { label: "What is this and why does it matter here?", items: [
        { text: "Metlen Energy & Metals is a large Greek industrial conglomerate operating across three primary segments: power generation and electricity trading (the largest by EBITDA), metals (aluminum and bauxite-alumina production), and infrastructure construction. The company was renamed from Mytilineos in 2024 to reflect its expanded European footprint and a planned dual listing in London. It runs Greece\'s largest power plant fleet, operates an integrated bauxite-alumina-aluminum complex at Agios Nikolaos, and increasingly positions itself as a European industrial platform with critical minerals optionality." },
        { text: "What puts Metlen on this page is the gallium recovery project at Agios Nikolaos \u2014 the same site where the company has been refining bauxite into alumina for decades. In January 2025, Metlen committed \u20AC295.5M to add gallium extraction to the existing operation, targeting 50 tonnes per year of primary gallium output by 2028. In January 2026, the project crossed two important thresholds: the European Investment Bank approved \u20AC90M in financing, and the facility produced its first 5 kilograms of gallium \u2014 proving Metlen\'s proprietary extraction process works at industrial scale. The project is designated a Strategic Project under the EU Critical Raw Materials Act, which provides regulatory fast-tracking and access to EU strategic financing." },
        { text: "The strategic significance is that if Metlen reaches its 50 t/yr target, Europe covers its entire current gallium demand domestically for the first time since 2016, when the last European primary gallium producer (Hungary) closed. That makes Metlen the European version of what JAGA represents for the Pacific \u2014 sovereign-backed primary production rebuilding domestic critical minerals capacity." },
      ] },
      { label: "How does value flow through this entity?", items: [
        { text: "Metlen captures value through several distinct channels:" },
      ] },
      { label: "Investment angle", items: [
        { text: "Metlen is the cleanest European listed exposure to the gallium chain rebuild, and structurally the most concentrated of the four western primary production projects. For investors who can access Athens or London listings, Metlen offers a mature dividend-paying industrial business with genuine critical minerals optionality backed by EU sovereign financing \u2014 at a valuation that reflects energy and aluminum cyclicality more than the strategic optionality." },
        { text: "The variant perception that would make Metlen undervalued: the market is pricing Metlen as a Greek industrial conglomerate, but the platform value of being the only EU primary gallium producer with EU strategic financing \u2014 and the optionality on scandium and germanium expansion \u2014 could compound into a multi-metal critical minerals re-rating. If by 2028 Metlen has 50 t/yr gallium operating plus scandium FID plus EU strategic offtake contracts in place, the equity transitions to a different category of business than today." },
        { text: "The bear case is execution risk plus aluminum-cycle exposure plus liquidity. Scaling from 5 kg to 50 t/yr is genuinely difficult \u2014 proprietary processes that work at lab and pilot scale routinely struggle at full commercial output. If Metlen slips to 2029 or beyond, the gallium contribution misses the 2026-2028 western tightness window, weakening the strategic premium thesis. The Athens listing has limited US institutional liquidity; the London dual listing helps but Metlen is not yet a default name in critical-minerals-themed mandates." },
        { text: "For investors already positioned, the monitoring questions are: does the 2027 production target hit ~5-10 t/yr; do offtake agreements emerge with named European or US buyers; and does Metlen announce scandium or germanium FID within 24 months of gallium ramp? Two of three would re-rate the equity meaningfully." },
      ] },
    ],
      disclaimer: "Disclaimer: Stillpoint Intelligence \u00b7 Gallium Chain \u00b7 Layer: Primary Producer (under construction). Sources: Metlen press releases, European Commission CRMA strategic projects list, EIB project disclosures (January 2026). Not investment advice.",
    },
    "5n-plus": {
      name: "5N Plus",
      ticker: "VNP \u00b7 TSX",
      category: "Pure-play Refiner",
      metrics: [
        { label: "Market cap", value: "C$3.13B" },
        { label: "Revenue", value: "$391M" },
        { label: "EBITDA", value: "$92.4M" },
        { label: "Price", value: "C$34.77" },
        { label: "12mo", value: "+532%" },
      ],
      sections: [
      { label: "What is this and why does it matter here?", items: [
        { text: "5N Plus is a Canadian specialty metals refiner headquartered in Montreal, with operations spanning North America and Europe. The business model is to take in raw materials \u2014 gallium, germanium, indium, tellurium, bismuth, antimony \u2014 and purify them to the high-purity grades semiconductor manufacturers, photovoltaic producers, pharmaceutical companies, and defense suppliers require. The company name comes from \"5N\" \u2014 99.999% pure \u2014 the minimum purity grade it targets, with several products reaching 7N or higher. The business operates across two segments: Specialty Semiconductors (the larger and higher-margin segment) and Performance Materials (steadier industrial and pharmaceutical specialty chemicals)." },
        { text: "The company\'s most valuable asset is AZUR SPACE, a German subsidiary that produces germanium-based multi-junction solar cells for satellites. AZUR is the largest non-Chinese producer of space-grade photovoltaics globally, with a 265-day order backlog driven by LEO constellation buildouts (Starlink, Kuiper, OneWeb, military satellite programs). The space solar business is structurally separate from terrestrial photovoltaics and commands premium pricing because the qualification cycle for satellite components takes years and there are few qualified suppliers globally." },
        { text: "What puts 5N Plus on the gallium chain page is its position as one of three meaningful western high-purity gallium refiners \u2014 alongside Dowa in Japan and Indium Corporation in the US. 5N Plus produces an estimated 2-5 tonnes per year of high-purity gallium from its Montreal facility, which is small relative to global non-Chinese gallium output (~15-30 t/yr) but strategically important as the only Canadian source of refined gallium and a qualified supplier to North American defense and semiconductor customers. More importantly, 5N Plus is positioned as the highest-quality western critical minerals platform \u2014 gallium is one piece of a portfolio that includes germanium, tellurium, and indium, all of which face their own bifurcated supply pictures with western shortage premiums." },
      ] },
      { label: "How does value flow through this entity?", items: [
        { text: "5N Plus captures value through several distinct channels:" },
      ] },
      { label: "Investment angle", items: [
        { text: "5N Plus is the highest-quality western critical minerals name on public markets, and gallium is a small but strategic piece of the thesis. For portfolios that want broad critical minerals exposure with operational discipline, multi-year contracted revenue, sovereign backing, and a credible balance sheet, 5N Plus is arguably the best-scaled North American option in the category. The +532% trailing 12-month run reflects a genuine re-rating from specialty refiner to platform, not speculative excess." },
        { text: "The variant perception that would make 5N Plus undervalued: the market is pricing it primarily on AZUR space solar and the First Solar CdTe relationship \u2014 both of which are genuine value drivers \u2014 but the optionality on gallium-specific refining capacity expansion (driven by JAGA or other primary production coming online) and the broader cross-chain critical minerals platform value are likely underpriced. If 5N Plus announces dedicated gallium capacity expansion with sovereign backing or signs additional multi-year contracts, the platform multiple expands further." },
        { text: "The bear case is valuation and execution. The +532% run has compressed forward multiples; any miss on AZUR ramp, First Solar volume, or government-backed project execution would compress the equity sharply. Gallium itself is too small to support the multiple if AZUR space solar disappoints. New CEO transition adds execution risk through 2026. And the Tokyo-listed Dowa is structurally a more concentrated chokepoint play in gallium specifically \u2014 for pure gallium exposure, 5N Plus is too diversified." },
        { text: "For investors already positioned, the monitoring questions are: does AZUR hit the 25% capacity lift on schedule; does 5N Plus announce gallium-specific capacity expansion within 12 months; and does the Utah germanium recycling project ramp successfully? Two of three would sustain the platform thesis through 2026-2027." },
      ] },
    ],
      disclaimer: "Disclaimer: Stillpoint Intelligence \u00b7 Gallium Chain \u00b7 Layer: Refiner. Sources: 5N Plus investor communications, TSX filings, US Department of Energy critical minerals announcements. Not investment advice.",
    },
    "dowa": {
      name: "Dowa Holdings",
      ticker: "5714.T \u00b7 Tokyo",
      category: "Chokepoint Holder",
      metrics: [
        { label: "Market cap", value: "~\u00a5800B" },
        { label: "Revenue", value: "~\u00a5850B" },
        { label: "EBITDA", value: "\u2014" },
        { label: "Price", value: "~\u00a511,000" },
        { label: "12mo", value: "\u2014" },
      ],
      sections: [
      { label: "What is this and why does it matter here?", items: [
        { text: "Dowa Holdings is a large Japanese specialty metals company, founded in 1884 as a mining operation and today operating across four primary business segments: zinc and lead smelting (the legacy and largest revenue contributor), electronic materials (where gallium and other specialty refined metals reside), metal recycling, and metal processing. The company runs major zinc smelters in Japan, electronic materials operations in multiple Japanese sites and Southeast Asia, and a network of metal recycling facilities that have positioned Dowa as one of the world\'s leading recyclers of specialty metals from electronic waste. Group revenue runs ~¥850B (~$5.8B USD) against a ~$5.5B market cap, with margins driven by zinc treatment charges, electronic materials pricing premiums, and recycling spreads." },
        { text: "What puts Dowa on this page \u2014 and at the top of the gallium WTMI ordering \u2014 is its role as the structural western chokepoint in high-purity gallium refining. Outside China, only a handful of companies can produce 6N (99.9999%) and higher purity gallium at the volumes and quality grades that semiconductor and defense customers require. Dowa is the leading supplier in this category. When a Japanese, Korean, Taiwanese, or US semiconductor maker needs gallium that isn\'t routed through Chinese export licensing, Dowa is the default supplier. After China\'s December 2024 US-targeted export ban specifically, Dowa\'s role as a pass-through refiner for non-Chinese buyers became structurally more important \u2014 and remains so as long as Chinese export controls are in place." },
        { text: "The strategic significance is that Dowa is the western refining chokepoint that the four primary-production projects (Alcoa, Metlen, Rio Tinto/Indium, Korea Zinc/Crucible) ultimately depend on for downstream purification. Even as new western primary capacity comes online, the high-purity refining step remains concentrated in Dowa and a small number of secondary refiners (5N Plus in Canada, Indium Corporation in the US, PPM Pure Metals in Germany). The chain rebuild thesis assumes Dowa continues to operate at scale; if it does, Dowa captures a structural premium throughout the rebuild." },
      ] },
      { label: "How does value flow through this entity?", items: [
        { text: "Dowa\'s gallium economics flow through several distinct mechanisms:" },
      ] },
      { label: "Investment angle", items: [
        { text: "Dowa is the structural western chokepoint in high-purity gallium refining and the lowest-volatility, highest-quality way to play the gallium chain rebuild. For investors who want Japanese specialty metals exposure with genuine gallium optionality embedded inside an investment-grade balance sheet, Dowa is the cleanest equity vehicle outside the four capacity builders. The dividend yield (~2-3%) provides income while the chain rebuild plays out over 2026-2029." },
        { text: "The variant perception that would make Dowa undervalued: the market is pricing it as a Japanese zinc-lead conglomerate with electronic materials optionality, but Dowa\'s position as the only at-scale non-Chinese gallium refiner \u2014 combined with its recycling scale and Japanese government strategic alignment \u2014 could re-rate Dowa as the structural western critical minerals refiner of choice. If JAGA gallium ships to Dowa for downstream refining and Japanese government procurement formalizes Dowa\'s strategic role, the equity transitions from cyclical zinc producer to platform refiner." },
        { text: "The bear case is that Dowa\'s gallium contribution is too small inside a zinc-dominated business to drive equity re-rating, even in tight markets. Gallium revenue at full premium pricing is less than 1% of group revenue. Zinc cycle dominates near-term earnings; Tokyo listing limits institutional flow; and competing western refiners (5N Plus, Indium Corporation, PPM Pure Metals) plus new primary producers entering refining could compress Dowa\'s pricing power over 2028-2030. The structural premium is real but bounded." },
        { text: "For investors already positioned, the monitoring questions are: does JAGA gallium ship to Dowa rather than alternative refiners; does Japanese government policy formalize Dowa\'s strategic role; and does Dowa expand high-purity refining capacity in the next 24 months? Two of three would meaningfully change the equity story." },
      ] },
    ],
      disclaimer: "Disclaimer: Stillpoint Intelligence \u00b7 Gallium Chain \u00b7 Layer: Refiner. Sources: Dowa annual reports, US-Japan Critical Minerals Framework announcements, METI and JOGMEC disclosures. Not investment advice.",
    },
    "rio-tinto": {
      name: "Rio Tinto",
      ticker: "RIO \u00b7 NYSE / LSE / ASX",
      category: "Feedstock Supplier",
      metrics: [
        { label: "Market cap", value: "~$110B" },
        { label: "Revenue", value: "~$55B" },
        { label: "EBITDA", value: "~$22B" },
        { label: "Price", value: "~$70" },
        { label: "12mo", value: "+8%" },
      ],
      sections: [
      { label: "What is this and why does it matter here?", items: [
        { text: "Rio Tinto is one of the world\'s largest diversified mining companies, with operations spanning iron ore, copper, aluminum (via bauxite mining and alumina refining), lithium, titanium, borates, diamonds, and increasingly a portfolio of critical minerals byproduct projects. The company operates major mines and refineries across more than 30 countries, with revenue dominated by iron ore (Pilbara operations in Western Australia, Iron Ore Company of Canada) and aluminum (the legacy Alcan business acquired in 2007, including operations in Quebec, BC, Iceland, and Australia). Rio Tinto is one of the world\'s most balance-sheet-rich miners, with a longstanding dividend policy (~5% yield) and consistent free cash flow generation across the iron ore cycle." },
        { text: "What puts Rio Tinto on this page is a small but strategically positioned project at its Vaudreuil alumina refinery in Saguenay, Quebec. In May 2025, Rio Tinto and Indium Corporation announced the first successful laboratory-scale extraction of gallium from the Vaudreuil refinery\'s Bayer process byproduct stream \u2014 a proof-of-concept that the gallium recovery economics work in a Canadian operating context. In March 2026, Rio Tinto formally committed to advance the project to a demonstration plant phase with Canadian federal and Quebec provincial government support. The demo plant targets up to 3.5 tonnes per year of primary gallium output. A subsequent commercial-scale facility, if approved, could reach 40 t/yr \u2014 representing approximately 5-10% of current global gallium production from a single Canadian site." },
        { text: "The strategic significance is twofold. First, the project would be the only North American primary gallium producer of meaningful scale, addressing US Defense Production Act objectives around domestic critical minerals capacity. Second, Rio Tinto is using the Vaudreuil project as part of a broader portfolio play, building exposure to multiple byproduct critical minerals (gallium, scandium, tellurium, molybdenum) from existing operations to differentiate its equity story from pure iron ore exposure." },
      ] },
      { label: "How does value flow through this entity?", items: [
        { text: "Rio Tinto\'s gallium economics follow the same template as Alcoa and Metlen \u2014 bolt gallium recovery onto an existing alumina refinery, capture the gallium that already flows through the Bayer process, sell it at premium western pricing. But the value flow specifics for Rio Tinto differ in important ways:" },
      ] },
      { label: "Investment angle", items: [
        { text: "Rio Tinto offers iron ore and aluminum cycle exposure with gallium optionality attached as a small piece of a broader critical minerals portfolio re-rating thesis. For investors who want diversified mining exposure with sovereign-backed critical minerals optionality at the lowest single-project risk, Rio Tinto is the most balance-sheet-secure of the four western primary production projects." },
        { text: "The variant perception that would make Rio Tinto undervalued: the market is pricing it as \"iron ore mega-cap with mining diversification,\" but the cumulative critical minerals portfolio (gallium at Vaudreuil + scandium evaluation + tellurium + lithium at Jadar/Rincon) could re-rate Rio Tinto as a diversified critical minerals platform if multiple projects reach commercial scale in 2028-2030. That re-rating wouldn\'t show in any single project\'s economics; it would show in the multiple investors apply to the company." },
        { text: "The bear case is that gallium is too small to matter and the broader critical minerals portfolio takes too long. At 40 t/yr × $1,500/kg, gallium is 0.1-0.2% of revenue. Even with scandium, tellurium, and lithium added, critical minerals as a portfolio category may not exceed 5% of group revenue before 2030. Iron ore remains the dominant driver, and an iron ore demand correction would compress the equity regardless of critical minerals progress. The Indium IP dependency also caps Rio Tinto\'s ability to scale gallium independently \u2014 partnership risk is real." },
        { text: "For investors already positioned, the monitoring questions are: does the Vaudreuil demo plant complete commissioning on time; does a commercial-scale FID get announced; and how does the broader critical minerals portfolio (scandium, tellurium, lithium) progress in parallel? Rio Tinto\'s gallium contribution becomes material only if the portfolio thesis aggregates across multiple projects." },
      ] },
    ],
      disclaimer: "Disclaimer: Stillpoint Intelligence \u00b7 Gallium Chain \u00b7 Layer: Primary Producer (demo stage). Sources: Rio Tinto press releases (May 2025, March 2026), Indium Corporation communications, Government of Canada and Quebec announcements, Rio Tinto annual reports. Not investment advice.",
    },
    "korea-zinc": {
      name: "Korea Zinc",
      ticker: "010130.KS \u00b7 Seoul",
      category: "Market Maker",
      metrics: [
        { label: "Market cap", value: "~$15B" },
        { label: "Revenue", value: "~$9B" },
        { label: "EBITDA", value: "\u2014" },
        { label: "Price", value: "~\u20a91M" },
        { label: "12mo", value: "\u2014" },
      ],
      sections: [
      { label: "What is this and why does it matter here?", items: [
        { text: "Korea Zinc is the world\'s largest non-Chinese zinc smelter, headquartered in Seoul with operations in South Korea and Australia. The company\'s core business is the refining of zinc and lead from imported concentrates, but its capability extends across a broad range of byproduct specialty metals \u2014 indium, bismuth, tellurium, silver, antimony \u2014 produced at smaller volumes through integrated metallurgical processing. Group revenue runs ~$9B against a $15B market cap, with margins driven by zinc treatment charges, byproduct credits, and metals-trading exposure. The company is in the middle of a high-profile ownership dispute with Young Poong Corporation and MBK Partners that has been the dominant share-price driver throughout 2024-2025." },
        { text: "What puts Korea Zinc on this page is the Crucible JV announced in December 2025: a $7.4B joint venture to build a new integrated critical minerals smelter in Clarksville, Tennessee, on the site of the existing Nyrstar facility. The structure is unprecedented in scale and form. The US Department of Defense takes a 40% equity stake \u2014 the largest direct DoD equity investment in critical minerals processing in modern history. JPMorgan acts as financial adviser and lead arranger. Approximately $4.7B comes from US government loans (DoD-anchored), and $210M in CHIPS Act subsidies cover specific equipment categories. Korea Zinc holds an operating role with a less-than-10% equity stake. When completed in 2029, the facility will produce 540,000 tonnes per year of critical minerals output \u2014 including zinc, lead, copper, antimony, germanium, indium, tellurium, and approximately 40 t/yr of primary gallium recovered from the zinc concentrate stream." },
        { text: "The strategic significance is that Crucible represents a categorical shift in how the US treats critical minerals processing: DoD equity rather than offtake contracts, integrated multi-metal output rather than single-commodity capacity, and an existing US site (Nyrstar Clarksville) rather than greenfield development. For the gallium chain specifically, Crucible would be one of two North American primary gallium sources alongside Rio Tinto\'s Vaudreuil project \u2014 and at 40 t/yr, the largest single source." },
      ] },
      { label: "How does value flow through this entity?", items: [
        { text: "Korea Zinc\'s value capture from Crucible is structurally different from a typical operator role:" },
      ] },
      { label: "Investment angle", items: [
        { text: "Korea Zinc offers exposure to US government-backed critical minerals infrastructure through a unique JV structure with limited direct equity capture but significant strategic positioning value. For investors with Seoul market access and patience for a 2029 commercial start, Korea Zinc is one of the most credible critical minerals allocations available \u2014 backed by the largest direct DoD equity stake in critical minerals processing in modern history." },
        { text: "The variant perception that would make Korea Zinc undervalued: the market is pricing it as a Korean zinc smelter with governance overhang, but the platform value of being the DoD\'s preferred operational partner for US critical minerals processing \u2014 combined with multi-product Crucible output across germanium, antimony, gallium, indium, and tellurium \u2014 could re-rate Korea Zinc as a strategic infrastructure operator rather than a cyclical metals refiner. If Crucible commissions on time and a second US DoD-backed facility is announced before 2030, the equity transitions from cyclical to platform." },
        { text: "The bear case is execution timing plus governance plus diluted gallium exposure. Crucible doesn\'t commission until 2029, by which time the western tightness window for gallium (2026-2028) will largely have passed. The Korea Zinc ownership dispute remains unresolved and could materially impair execution. And gallium itself is a small line in a 13-product facility \u2014 for pure gallium exposure, Alcoa or Metlen are more concentrated. The structural risks that warrant the strategic premium also create real downside if any single one materializes." },
        { text: "For investors already positioned, the monitoring questions are: does the Korea Zinc ownership dispute resolve cleanly; do Crucible construction milestones hit on time; and does Korea Zinc announce a second US DoD-backed JV within 24 months of first Crucible production? Any combination of two of three would re-rate the equity meaningfully." },
      ] },
    ],
      disclaimer: "Disclaimer: Stillpoint Intelligence \u00b7 Gallium Chain \u00b7 Layer: Primary Producer + Refiner (planned). Sources: Korea Zinc December 2025 announcements, Crucible JV press releases, US Department of Defense critical minerals disclosures, JPMorgan project finance materials, Bloomberg, Mining.com. Not investment advice.",
    },
    "chinese-primary": {
      name: "Chinese Primary Supply",
      ticker: "Aggregate \u00b7 Not listed",
      category: "Market Maker",
      metrics: [],
      sections: [
      { label: "What is this and why does it matter here?", items: [
        { text: "Chinese Primary Supply is not a single company. It is the aggregate output of approximately 20 Chinese alumina refineries that recover gallium as a byproduct of aluminum production from bauxite, plus a small number of secondary recovery operations. The mix includes state-owned operators (Chinalco / Aluminum Corporation of China, Shandong Weiqiao Pioneering Group, China Hongqiao Group, China Power Investment), privately held specialty processors (Vital Materials, Zhuzhou Keneng Materials, Beijing Jiya Semiconductor Material), and integrated zinc-aluminum smelting operations that have added gallium recovery circuits over the past two decades. The aggregate is geographically concentrated in Shandong, Henan, Yunnan, and Inner Mongolia provinces, where alumina refining infrastructure clusters around bauxite supply chains." },
        { text: "Chinese capacity grew from approximately 140 t/yr in 2010 to roughly 1,000 t/yr installed capacity by 2022, and continues to expand. Actual production runs at approximately 590 t/yr \u2014 meaning utilization is around 59%, with substantial idle capacity that can be brought online or held back as policy dictates. The deliberate overhang is the structural fact: China holds enough capacity to flood the global market or to constrain it, and Beijing\'s policy choices determine which scenario plays out at any given moment." },
        { text: "This aggregate sits on the gallium chain page despite not being directly investable because it is the single most important variable in the entire gallium investment thesis. Every other entity covered on this page \u2014 Alcoa, Metlen, Rio Tinto, Korea Zinc, Dowa, 5N Plus \u2014 derives its investability from its position relative to what China does with the 1,000 t/yr capacity it controls. A portfolio manager forming a view on western gallium projects without modeling Chinese supply scenarios is missing the central variable. The aggregate is here as a tracking artifact, not as an investment vehicle." },
      ] },
      { label: "How does value flow through this entity?", items: [
        { text: "There is no direct value flow to western investors. Chinese primary gallium producers are state-owned, state-affiliated, or traded only on Chinese A-share or Hong Kong exchanges with limited foreign institutional access. Chalco trades in Hong Kong and Shanghai with limited US access; Hongqiao trades in Hong Kong; Weiqiao operates partially through Hong Kong listings but gallium is buried inside aluminum-dominated revenue. None of the named entities offer a clean Chinese gallium pure-play available to non-Chinese institutional investors." },
        { text: "The indirect value flow \u2014 and the entire reason the aggregate matters \u2014 is that Chinese policy sets both the floor and the ceiling on global gallium pricing, and every western position must be modeled against a Chinese supply scenario:" },
      ] },
      { label: "Investment angle", items: [
        { text: "Chinese Primary Supply is not directly investable for western institutional capital, but it is unavoidable. Every portfolio with western gallium exposure is implicitly a bet on what China does in November 2026 and beyond. The relevant portfolio question isn\'t \"do I own Chinese gallium?\" \u2014 that\'s not really available \u2014 but \"which scenario am I positioned for, and does my exposure survive the other two?\"" },
        { text: "The variant perception worth holding: most investor framing treats Chinese supply as a binary \"ban yes/ban no\" question, but the more accurate framing is structural. The Chinese capacity overhang of ~400 t/yr idle production is permanent strategic optionality for Beijing regardless of any specific policy decision. Even if controls relax in November 2026, Beijing retains the ability to reimpose them at any time, which means the western premium has a structural floor below the Chinese domestic price but above what a fully liberalized global market would clear at. Investors who treat the November 2026 expiry as the single binary event miss the longer-running structural asymmetry." },
        { text: "The \"bear case\" for western positions in the chain is that China relaxes controls more aggressively than expected, possibly as part of a broader US-China trade deal or as a strategic concession. In this scenario, western retail pricing compresses, Western capacity projects face margin pressure, and several may delay FID or scale back. Dowa retains technical capability but loses the geopolitical premium. 5N Plus retains its diversified platform but the gallium contribution shrinks. The chain rebuild thesis weakens but doesn\'t disappear." },
        { text: "For investors already positioned across the western gallium chain, the monitoring question is: how does my portfolio perform in each of the three Chinese supply scenarios? Reimposition is bullish for everyone; renewal is bullish for capacity builders and refiners; relaxation is bearish for capacity builders but neutral-to-modestly-bearish for refiners. A portfolio that survives all three scenarios is properly hedged; a portfolio that requires reimposition to work is implicitly a directional China-policy trade." },
      ] },
      { label: "What is this and why does it matter here?", items: [
        { text: "Dowa Holdings is a large Japanese specialty metals company, founded in 1884 as a mining operation and today operating across four primary business segments: zinc and lead smelting (the legacy and largest revenue contributor), electronic materials (where gallium and other specialty refined metals reside), metal recycling, and metal processing. The company runs major zinc smelters in Japan, electronic materials operations in multiple Japanese sites and Southeast Asia, and a network of metal recycling facilities that have positioned Dowa as one of the world\'s leading recyclers of specialty metals from electronic waste. Group revenue runs ~¥850B (~$5.8B USD) against a ~$5.5B market cap, with margins driven by zinc treatment charges, electronic materials pricing premiums, and recycling spreads." },
        { text: "What puts Dowa on this page \u2014 and at the top of the gallium WTMI ordering \u2014 is its role as the structural western chokepoint in high-purity gallium refining. Outside China, only a handful of companies can produce 6N (99.9999%) and higher purity gallium at the volumes and quality grades that semiconductor and defense customers require. Dowa is the leading supplier in this category. When a Japanese, Korean, Taiwanese, or US semiconductor maker needs gallium that isn\'t routed through Chinese export licensing, Dowa is the default supplier. After China\'s December 2024 US-targeted export ban specifically, Dowa\'s role as a pass-through refiner for non-Chinese buyers became structurally more important \u2014 and remains so as long as Chinese export controls are in place." },
        { text: "The strategic significance is that Dowa is the western refining chokepoint that the four primary-production projects (Alcoa, Metlen, Rio Tinto/Indium, Korea Zinc/Crucible) ultimately depend on for downstream purification. Even as new western primary capacity comes online, the high-purity refining step remains concentrated in Dowa and a small number of secondary refiners (5N Plus in Canada, Indium Corporation in the US, PPM Pure Metals in Germany). The chain rebuild thesis assumes Dowa continues to operate at scale; if it does, Dowa captures a structural premium throughout the rebuild." },
      ] },
      { label: "How does value flow through this entity?", items: [
        { text: "Dowa\'s gallium economics flow through several distinct mechanisms:" },
      ] },
      { label: "Investment angle", items: [
        { text: "Dowa is the structural western chokepoint in high-purity gallium refining and the lowest-volatility, highest-quality way to play the gallium chain rebuild. For investors who want Japanese specialty metals exposure with genuine gallium optionality embedded inside an investment-grade balance sheet, Dowa is the cleanest equity vehicle outside the four capacity builders. The dividend yield (~2-3%) provides income while the chain rebuild plays out over 2026-2029." },
        { text: "The variant perception that would make Dowa undervalued: the market is pricing it as a Japanese zinc-lead conglomerate with electronic materials optionality, but Dowa\'s position as the only at-scale non-Chinese gallium refiner \u2014 combined with its recycling scale and Japanese government strategic alignment \u2014 could re-rate Dowa as the structural western critical minerals refiner of choice. If JAGA gallium ships to Dowa for downstream refining and Japanese government procurement formalizes Dowa\'s strategic role, the equity transitions from cyclical zinc producer to platform refiner." },
        { text: "The bear case is that Dowa\'s gallium contribution is too small inside a zinc-dominated business to drive equity re-rating, even in tight markets. Gallium revenue at full premium pricing is less than 1% of group revenue. Zinc cycle dominates near-term earnings; Tokyo listing limits institutional flow; and competing western refiners (5N Plus, Indium Corporation, PPM Pure Metals) plus new primary producers entering refining could compress Dowa\'s pricing power over 2028-2030. The structural premium is real but bounded." },
        { text: "For investors already positioned, the monitoring questions are: does JAGA gallium ship to Dowa rather than alternative refiners; does Japanese government policy formalize Dowa\'s strategic role; and does Dowa expand high-purity refining capacity in the next 24 months? Two of three would meaningfully change the equity story." },
      ] },
      { label: "What is this and why does it matter here?", items: [
        { text: "5N Plus is a Canadian specialty metals refiner headquartered in Montreal, with operations spanning North America and Europe. The business model is to take in raw materials \u2014 gallium, germanium, indium, tellurium, bismuth, antimony \u2014 and purify them to the high-purity grades semiconductor manufacturers, photovoltaic producers, pharmaceutical companies, and defense suppliers require. The company name comes from \"5N\" \u2014 99.999% pure \u2014 the minimum purity grade it targets, with several products reaching 7N or higher. The business operates across two segments: Specialty Semiconductors (the larger and higher-margin segment) and Performance Materials (steadier industrial and pharmaceutical specialty chemicals)." },
        { text: "The company\'s most valuable asset is AZUR SPACE, a German subsidiary that produces germanium-based multi-junction solar cells for satellites. AZUR is the largest non-Chinese producer of space-grade photovoltaics globally, with a 265-day order backlog driven by LEO constellation buildouts (Starlink, Kuiper, OneWeb, military satellite programs). The space solar business is structurally separate from terrestrial photovoltaics and commands premium pricing because the qualification cycle for satellite components takes years and there are few qualified suppliers globally." },
        { text: "What puts 5N Plus on the gallium chain page is its position as one of three meaningful western high-purity gallium refiners \u2014 alongside Dowa in Japan and Indium Corporation in the US. 5N Plus produces an estimated 2-5 tonnes per year of high-purity gallium from its Montreal facility, which is small relative to global non-Chinese gallium output (~15-30 t/yr) but strategically important as the only Canadian source of refined gallium and a qualified supplier to North American defense and semiconductor customers. More importantly, 5N Plus is positioned as the highest-quality western critical minerals platform \u2014 gallium is one piece of a portfolio that includes germanium, tellurium, and indium, all of which face their own bifurcated supply pictures with western shortage premiums." },
      ] },
      { label: "How does value flow through this entity?", items: [
        { text: "5N Plus captures value through several distinct channels:" },
      ] },
      { label: "Investment angle", items: [
        { text: "5N Plus is the highest-quality western critical minerals name on public markets, and gallium is a small but strategic piece of the thesis. For portfolios that want broad critical minerals exposure with operational discipline, multi-year contracted revenue, sovereign backing, and a credible balance sheet, 5N Plus is arguably the best-scaled North American option in the category. The +532% trailing 12-month run reflects a genuine re-rating from specialty refiner to platform, not speculative excess." },
        { text: "The variant perception that would make 5N Plus undervalued: the market is pricing it primarily on AZUR space solar and the First Solar CdTe relationship \u2014 both of which are genuine value drivers \u2014 but the optionality on gallium-specific refining capacity expansion (driven by JAGA or other primary production coming online) and the broader cross-chain critical minerals platform value are likely underpriced. If 5N Plus announces dedicated gallium capacity expansion with sovereign backing or signs additional multi-year contracts, the platform multiple expands further." },
        { text: "The bear case is valuation and execution. The +532% run has compressed forward multiples; any miss on AZUR ramp, First Solar volume, or government-backed project execution would compress the equity sharply. Gallium itself is too small to support the multiple if AZUR space solar disappoints. New CEO transition adds execution risk through 2026. And the Tokyo-listed Dowa is structurally a more concentrated chokepoint play in gallium specifically \u2014 for pure gallium exposure, 5N Plus is too diversified." },
        { text: "For investors already positioned, the monitoring questions are: does AZUR hit the 25% capacity lift on schedule; does 5N Plus announce gallium-specific capacity expansion within 12 months; and does the Utah germanium recycling project ramp successfully? Two of three would sustain the platform thesis through 2026-2027." },
      ] },
    ],
      disclaimer: "Disclaimer: Stillpoint Intelligence \u00b7 Gallium Chain \u00b7 Layer: Aggregate: Primary Producer. Sources: USGS Mineral Commodity Summaries, MOFCOM notices and trade enforcement announcements, SMM benchmarks, SMI benchmarks, Fastmarkets, Chinese provincial industrial planning disclosures. Not investment advice.",
    },
    "gallium-metal": {
      name: "Gallium metal",
      ticker: "Physical commodity",
      category: "Direct Exposure",
      metrics: [],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Gallium metal is the raw material that feeds every other entity on this page. Dowa refines it to semiconductor grade. Alcoa and Metlen are racing to produce it. China controls 98% of global supply." },
          { text: "The western retail price has moved from approximately $298/kg at the start of 2020 to $2,269/kg as of April 2026 \u2014 a 7.6x increase. Most of that move occurred after August 2023, when China implemented export licensing, with a further acceleration after the December 2024 US-targeted ban." },
          { text: "The Chinese domestic 4N spot price, by contrast, sits at ~$245/kg on the SMM benchmark \u2014 creating a 9x spread that persists because export controls prevent arbitrage. Western buyers pay a \u201Csecurity premium\u201D that reflects not material scarcity but access scarcity." },
        ] },
        { label: "How does the market work?", items: [
          { text: "Gallium is one of the most opaque commodity markets in existence. There is no futures contract, no exchange listing, no standardized benchmark. All transactions are OTC, negotiated bilaterally between producers and consumers, with reference prices published by Fastmarkets, Asian Metal, and Shanghai Metal Market (SMM) based on trade reports rather than binding market prices." },
          { text: "The opacity creates three dynamics relevant to the investment thesis. First, price discovery is asymmetric and slow \u2014 major supply disruptions or policy changes take weeks to fully reflect in transaction prices. Second, no hedging mechanism exists. Buyers accept spot exposure, negotiate long-term contracts, or stockpile inventory. Third, the lack of futures trading removes a standard channel for expressing a view on gallium pricing through liquid instruments \u2014 exposure must be intermediated through equities." },
        ] },
        { label: "What to watch", items: [
          { text: "The November 2026 ban suspension expiry is the single most important event for the gallium market. Reimposition would return the western supply picture to December 2024 conditions, widening the price spread and re-strengthening every western supply thesis. Extension of the suspension or full normalization would compress the spread and pressure the economics of emerging western capacity projects." },
          { text: "Every investment position in the gallium chain should be stress-tested against both outcomes." },
        ] },
        { label: "Investment angle", items: [
          { text: "Not directly investable without physical trading infrastructure. No futures contract, no ETF, no exchange-traded vehicle. The only way to express a view on gallium pricing through liquid securities is via the equities on this page \u2014 primarily Metlen (European capacity), Dowa (refining chokepoint), and 5N Plus (broad critical minerals). Physical gallium can be purchased via Strategic Metals Invest or Rotterdam warehouse channels for qualified investors." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Gallium Chain \u00b7 Layer: Raw Material / Commodity. Sources: Fastmarkets, USGS Mineral Commodity Summaries, SMM benchmarks, Strategic Metals Invest. Not investment advice.",
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
          { id: "supply-tree", label: "Supply tree" },
          { id: "dependencies", label: "Dependencies" },
          { id: "supply-demand", label: "Supply \u2192 Demand" },
          { id: "so-what", label: "So what" },
          { id: "money", label: "Where the money is" },
          { id: "catalysts", label: "Catalysts" },
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
        {/* TODO: link to downstream chain pages when they exist */}
        {[
          { name: "Compound semiconductor wafers (GaAs, InP)", desc: "AXT, Sumitomo Electric, Freiberger, IQE" },
          { name: "GaN power semiconductors", desc: "Navitas, Infineon/GaN Systems, Innoscience, EPC, Transphorm" },
          { name: "GaN RF and defense radar", desc: "Wolfspeed, Qorvo, MACOM, NXP" },
          { name: "LED lighting", desc: "Nichia, Samsung LED, Seoul Semiconductor, OSRAM" },
          { name: "NdFeB permanent magnets", desc: "Chinese magnet producers" },
          { name: "Satellite solar cells", desc: "5N Plus AZUR Space, Spectrolab, CESI" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column" as const, padding: "2px 0 2px 12px" }}>
            <span style={{ fontSize: 10, color: "#4a4540" }}>{item.name}</span>
          </div>
        ))}
      </nav>

      {/* Page content — single column */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 32px 80px" }}>

        {/* ═══ BREADCRUMB + HEADER ═══ */}
        {(() => {
          const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
          const from = params?.get("from");
          const crumbs = from === "resources"
            ? [{ label: "All verticals", href: "/" }, { label: "Global Resources", href: "/" }]
            : [{ label: "All verticals", href: "/" }, { label: "AI Infrastructure", href: "/" }, { label: "Raw Materials", href: "/" }];
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, flexWrap: "wrap" as const }}>
              {crumbs.map((bc, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {i > 0 && <span style={{ fontSize: 11, color: "#4a4540" }}>/</span>}
                  <span onClick={() => { window.location.href = bc.href; }} style={{ fontSize: 11, color: "#4a4540", cursor: "pointer", transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#a09888")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#4a4540")}
                  >{bc.label}</span>
                </span>
              ))}
              <span style={{ fontSize: 11, color: "#4a4540" }}>/</span>
              <span style={{ fontSize: 11, color: "#a09888" }}>Gallium</span>
            </div>
          );
        })()}

        {/* SECTION 1: HOOK */}
        <div id="thesis" style={{ marginBottom: "56px" }}>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "28px",
            fontWeight: 400,
            color: warmWhite,
            margin: "0 0 24px 0",
            lineHeight: 1.2,
          }}>
            Gallium
          </h1>
          {/* Executive summary */}
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 20, letterSpacing: "0.1em", color: "#555", margin: "0 0 16px 0" }}>EXECUTIVE SUMMARY</p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {[
                "Trace element recovered as a byproduct of alumina refining from bauxite, and to a lesser extent from zinc smelter residues. Cannot be mined directly. Global resources are abundant \u2014 the constraint is refining infrastructure, not geology.",
                "Forms compound semiconductors (GaAs and GaN) that are grown onto wafers and used as the foundation for chips. Found in AI datacenter power conversion, 5G amplifiers, LEDs, EV chargers, satellite solar cells, and AESA defense radar.",
                "Global refined production is ~320 t/yr. Roughly 290 t is Chinese; ~15-30 t is non-Chinese, almost entirely Japan via Dowa Holdings. China holds ~1,000 t/yr of installed capacity running at ~59% utilization \u2014 a deliberate overhang Beijing can tighten or release.",
                "Price has risen from $298/kg to $2,269/kg since 2020 on western retail benchmarks, with a 9x spread between Chinese domestic ($245/kg) and western markets. The spread persists because export licensing prevents arbitrage.",
                "Demand accelerating from GaN power electronics (42% CAGR), defense radar modernization, and AI datacenter 800V power conversion architecture. Every major western demand vector is stable or growing.",
                "Four concurrent western primary production projects collectively target ~230 t/yr by 2029, a ~10x increase from current non-Chinese supply. None resolves the structural dependency before 2028.",
                "The investable surface of the gallium supply chain is the rebuild itself \u2014 emerging primary producers backed by sovereign capital, and refiners with pricing power in the non-Chinese supply gap.",
              ].map((point, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 7 }} />
                  <p style={{ fontSize: 13.5, color: "#a09888", lineHeight: 1.4, margin: 0, fontWeight: 300 }}>{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SUPPLY TREE */}
        <div id="supply-tree" style={{ marginBottom: "56px", paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>
            SUPPLY TREE
          </p>
          {/* Key Takeaways card — above the tree */}
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "10px", padding: "24px 28px", marginBottom: 32 }}>
            <p style={{ fontSize: "9px", letterSpacing: "0.1em", color: dimText, margin: "0 0 10px 0" }}>KEY TAKEAWAYS</p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 0 }}>
              {[
                "Bauxite is mined globally across five regions \u2014 Guinea, Australia, China, Brazil, and Indonesia \u2014 with ~346M tonnes produced per year.",
                "Gallium isn\u2019t extracted at the mine \u2014 it\u2019s recovered downstream at alumina refineries that have ion-exchange recovery circuits installed, and ~98% of those refineries are in China.",
                "Four western projects are trying to rebuild primary capacity \u2014 Alcoa/JAGA in Australia, Metlen in Greece, Rio Tinto in Quebec, Korea Zinc/Crucible in Tennessee \u2014 but none operate at scale before 2028.",
                "Outside China, Dowa in Japan does the bulk of high-purity refining, with smaller capacity at 5N Plus in Canada and Indium Corporation in the US \u2014 but all of them depend on Chinese primary feedstock to operate.",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, color: "#706a60", flexShrink: 0, minWidth: 16 }}>{i + 1}.</span>
                  <p style={{ fontSize: 12.5, color: "#a09888", lineHeight: 1.6, margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Supply tree visualization */}
          <div style={{ border: `1px solid ${borderColor}`, borderRadius: "10px", overflow: "hidden", background: "#131210" }}>
            <TreeMap
              geometry={galliumGeo}
              nodes={galliumNodes}
              layerConfig={lc}
              svgWidth={galliumW}
              svgHeight={galliumH}
              onNodeClick={setSelectedNode}
              onLayerClick={() => {}}
              layerPanels={{}}
            />
          </div>

          {/* How it's made cards — below the tree */}
          <div style={{ display: "flex", gap: "12px", marginTop: 32 }}>

            {/* Card 1: Byproduct Source */}
            <div style={{
              flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                BYPRODUCT SOURCE
              </p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Bauxite is mined and shipped to alumina refineries worldwide. Gallium is not extracted at this layer &mdash; it rides along inside the bauxite at ~50 ppm as the ore moves downstream.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHY IT&apos;S HARD</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 0 0", flex: 1 }}>
                Gallium content is uniform across essentially all bauxite globally. You cannot &ldquo;find better bauxite&rdquo; for gallium. Output is determined by aluminum industry decisions, not gallium demand &mdash; which is why gallium supply cannot scale independently of aluminum.
              </p>
              <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #222018" }}>
                <span style={{ fontSize: "12px", color: warmWhite, fontWeight: 500 }}>~346M t/yr</span>
                <span style={{ fontSize: "9px", color: dimText, marginLeft: "6px" }}>bauxite mined globally</span>
              </div>
            </div>

            {/* Card 2: Primary Producer */}
            <div style={{
              flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                PRIMARY PRODUCER
              </p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Bauxite is processed into alumina for aluminum production. Refineries with ion-exchange circuits installed capture the dissolved gallium as a byproduct. Refineries without that equipment discard it as waste.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHY IT&apos;S HARD</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 0 0", flex: 1 }}>
                Only ~20 alumina refineries globally have gallium recovery installed, almost all in China. Recovery captures only 10-15% of gallium in the bauxite stream. Western projects must solve the economics that shut down Germany, Hungary, and Kazakhstan between 2013 and 2016.
              </p>
              <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #222018" }}>
                <span style={{ fontSize: "12px", color: warmWhite, fontWeight: 500 }}>~600 t/yr</span>
                <span style={{ fontSize: "9px", color: dimText, marginLeft: "6px" }}>primary gallium extracted globally</span>
              </div>
            </div>

            {/* Card 3: Refiner */}
            <div style={{
              flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                REFINER
              </p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Crude 99.99% gallium is purified to 99.9999%+ via zone refining, vacuum distillation, and electrolytic processes. Different end uses need different grades &mdash; LEDs need 6N, defense radar needs 7N, next-generation chips need 8N.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHY IT&apos;S HARD</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 0 0", flex: 1 }}>
                Each additional &ldquo;nine&rdquo; of purity is exponentially harder than the last. Removing the final parts per billion of iron, copper, and zinc requires proprietary process knowledge. Western refiners (Dowa, 5N Plus) depend on Chinese primary feedstock to operate.
              </p>
              <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #222018" }}>
                <span style={{ fontSize: "12px", color: warmWhite, fontWeight: 500 }}>~320 t/yr</span>
                <span style={{ fontSize: "9px", color: dimText, marginLeft: "6px" }}>high-purity refined gallium produced globally</span>
              </div>
            </div>

          </div>

          {/* Aggregate nodes now render inline on the tree — no separate summary cards needed */}

          {/* Node detail modal */}
          {selectedNode && galliumNodes[selectedNode] && (() => {
            const node = galliumNodes[selectedNode];
            return (
              <div
                onClick={() => setSelectedNode(null)}
                style={{
                  position: "fixed", inset: 0, zIndex: 200,
                  background: "rgba(0,0,0,0.6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    width: 560, maxHeight: "75vh", background: "rgb(36, 36, 36)",
                    border: "1px solid #252220", borderRadius: 12,
                    display: "flex", flexDirection: "column" as const,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ padding: "24px 28px 20px", flexShrink: 0, borderBottom: "1px solid #252220" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ fontSize: 9, letterSpacing: "0.1em", color: accent, margin: "0 0 8px 0", textTransform: "uppercase" as const }}>{node.type}</p>
                        <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: "#ece8e1", margin: "0 0 4px 0", fontWeight: 400 }}>{selectedNode}</p>
                        <p style={{ fontSize: 11, color: "#706a60", margin: 0 }}>{node.loc}</p>
                      </div>
                      <button
                        onClick={() => setSelectedNode(null)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: 18, padding: "0 0 0 12px", lineHeight: 1 }}
                      >{"\u2715"}</button>
                    </div>
                    <div style={{ display: "flex", marginTop: 16, gap: 0, borderTop: "1px solid #252220", paddingTop: 14, flexWrap: "wrap" as const }}>
                      {node.stats.map((s, si) => (
                        <div key={si} style={{ flex: "1 1 25%", minWidth: 100, display: "flex", flexDirection: "column" as const, gap: 4, borderLeft: si > 0 ? "1px solid #252220" : "none", paddingLeft: si > 0 ? 14 : 0, paddingBottom: 8 }}>
                          <span style={{ fontSize: 9, letterSpacing: "0.1em", color: "#555", textTransform: "uppercase" as const }}>{s[0]}</span>
                          <span style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500 }}>{s[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto" as const, padding: "24px 28px" }}>
                    <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "#555", margin: "0 0 10px 0", textTransform: "uppercase" as const }}>Role in chain</p>
                    <p style={{ fontSize: 13, color: "#c4bdb2", lineHeight: 1.7, margin: "0 0 20px 0" }}>{node.role}</p>
                    <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "#555", margin: "0 0 10px 0", textTransform: "uppercase" as const }}>Investment relevance</p>
                    <p style={{ fontSize: 13, color: "#c4bdb2", lineHeight: 1.7, margin: "0 0 20px 0" }}>{node.inv}</p>
                    <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "#555", margin: "0 0 10px 0", textTransform: "uppercase" as const }}>Key risk</p>
                    <p style={{ fontSize: 12, color: "#8a5a4a", margin: 0 }}>{node.risk}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* DEPENDENCIES */}
        <div id="dependencies" style={{ paddingTop: 20 }}>

        <p style={{ fontSize: 20, letterSpacing: "0.06em", color: "#555", margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>DEPENDENCIES</p>

        {/* Downstream table */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", margin: "0 0 20px 0" }}>DOWNSTREAM &mdash; WHERE GALLIUM GOES</p>
          <div style={{ display: "flex", padding: "0 0 10px 0", borderBottom: "1px solid #252220" }}>
            {[{ l: "Product", w: "25%" }, { l: "Usage", w: "10%" }, { l: "Est. value (gallium @ $1,750/kg)", w: "10%" }, { l: "Share", w: "10%" }, { l: "End uses", w: "34%" }, { l: "Growth", w: "10%", right: true }].map(h => (
              <p key={h.l} style={{ fontSize: 9, letterSpacing: "0.06em", color: "#4a4540", margin: 0, width: h.w, textAlign: (h as { right?: boolean }).right ? "right" as const : undefined }}>{h.l}</p>
            ))}
          </div>
          {[
            { product: "GaAs substrates & devices", usage: "~140t/yr", value: "~$245M", share: "31%", endUses: "5G RF handsets, LEDs, satellite solar cells, laser diodes", growth: "Growing (+8%)" },
            { product: "GaN devices (power + RF)", usage: "~110t/yr", value: "~$193M", share: "24%", endUses: "AI datacenter 800V, EV chargers, 5G base stations, defense radar", growth: "Surging (+42%)" },
            { product: "NdFeB magnets (dopant)", usage: "~80t/yr", value: "~$140M", share: "18%", endUses: "EV traction motors, wind turbines, consumer electronics", growth: "Growing (+15%)" },
            { product: "LED lighting", usage: "~75t/yr", value: "~$131M", share: "17%", endUses: "General lighting, automotive, display backlighting", growth: "Stable (+2%)" },
            { product: "Defense radar & EW", usage: "~25t/yr", value: "~$44M", share: "5%", endUses: "AN/SPY-6, LTAMDS, Patriot, F-35, G/ATOR", growth: "Surging (+35%)" },
            { product: "Satellite solar cells", usage: "~12t/yr", value: "~$21M", share: "3%", endUses: "LEO constellations, deep space", growth: "Surging (+57%)" },
            { product: "Other", usage: "~8t/yr", value: "~$14M", share: "2%", endUses: "Specialty applications", growth: "Stable" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: "1px solid #252220" }}>
              <div style={{ width: "25%", display: "flex", alignItems: "baseline", gap: 6 }}>
                <p data-name="" style={{ fontSize: 12, color: "#a09888", fontWeight: 500, margin: 0, transition: "color 0.15s" }}>{row.product}</p>
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
            <p style={{ fontSize: 11, color: "#ece8e1", fontWeight: 500, margin: 0, width: "10%" }}>~450t/yr</p>
            <p style={{ fontSize: 11, color: "#ece8e1", fontWeight: 500, margin: 0, width: "10%" }}>~$788M</p>
            <p style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, margin: 0, width: "10%" }}>100%</p>
            <p style={{ margin: 0, width: "34%" }} />
            <p style={{ fontSize: 10, color: "#ece8e1", fontWeight: 500, margin: 0, width: "10%", textAlign: "right" as const }}>~800t (+78%)</p>
          </div>
          <div style={{ paddingTop: 14, marginTop: 4 }}>
            <p style={{ fontSize: 10.5, color: "#706a60", lineHeight: 1.6, margin: "0 0 14px 0", fontStyle: "italic" }}>Est. value column reflects the value of gallium metal itself consumed in each end use, priced at ~$1,750/kg (western retail blended average, April 2026). This understates the strategic importance of gallium &mdash; the downstream semiconductor products built on it represent billions of dollars of enabled value &mdash; but reflects the actual market for the raw material.</p>
            <p style={{ fontSize: 11, color: "#706a60", lineHeight: 1.6, margin: 0 }}>GaN power and defense applications are the two demand vectors with no substitutes and inelastic pricing. Together they represent ~29% of current demand and effectively all of the demand growth through 2028. The LED and NdFeB segments are large but mature; GaAs is growing incrementally on 5G handset replacement cycles.</p>
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
              <p style={{ fontSize: "22px", fontWeight: 500, color: warmWhite, margin: "0 0 8px 0" }}>320 t/yr</p>
              <p style={{ fontSize: "11.5px", color: "#a09888", margin: 0, lineHeight: 1.6 }}>
                Refined supply is ~320t/yr &mdash; 290t Chinese, 15-30t non-Chinese. Primary supply cannot scale independently of aluminum production, and refining capacity outside China would take 3-5 years to build meaningfully.
              </p>
            </div>
            {/* Demand */}
            <div style={{ flex: 1, background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "10px", padding: "20px 22px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: dimText, margin: "0 0 10px 0" }}>DEMAND</p>
              <p style={{ fontSize: "22px", fontWeight: 500, color: warmWhite, margin: "0 0 8px 0" }}>800 t/yr by 2028</p>
              <p style={{ fontSize: "11.5px", color: "#a09888", margin: 0, lineHeight: 1.6 }}>
                Up from ~450t in 2024. Majority of growth comes from GaN power electronics (+42% CAGR) and defense radar. See Dependencies table for the full demand breakdown.
              </p>
            </div>
            {/* Gap */}
            <div style={{ flex: 1, background: "#1a1810", border: `1px solid ${accent}33`, borderRadius: "10px", padding: "20px 22px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 10px 0", opacity: 0.7 }}>GAP</p>
              <p style={{ fontSize: "22px", fontWeight: 500, color: accent, margin: "0 0 8px 0" }}>480 t/yr</p>
              <p style={{ fontSize: "11.5px", color: "#a09888", margin: 0, lineHeight: 1.6 }}>
                Shortfall by 2028. The constraint is refining infrastructure and policy, not geological scarcity &mdash; global gallium resources exceed 600,000 tonnes. Four announced western projects add ~230 t/yr by 2029, meaningfully narrowing but not closing the gap.
              </p>
            </div>
          </div>
        </div>

        {/* SO WHAT */}
        <div id="so-what" style={{ paddingTop: 20 }}>
        {(() => {
          const body = "#a09888";
          const analysisBg = "#141210";
          const gold = "#7a8a6a";
          const soWhatBlocks: { id: string; label: string; question: string; teaser: string; analysis: { type: string; text?: string; author?: string; name?: string; desc?: string }[] }[] = [
            { id: "signals", label: "Market signals", question: "What is the price telling us?", teaser: "Western retail price has risen 7.6x in five years because supply is structurally constrained, not because the market is speculative.", analysis: [
                { type: "prose", text: "Gallium is one of the most opaque commodity markets in existence. There is no futures contract, no exchange listing, no standardized benchmark. All transactions are OTC, negotiated bilaterally between producers and consumers, with reference prices published by Fastmarkets, Asian Metal, and Shanghai Metal Market (SMM) based on trade reports rather than binding market prices." },
                { type: "prose", text: "The western retail price for 99.99% gallium has moved from approximately $298/kg at the start of 2020 to $2,269/kg as of April 17, 2026 \u2014 an increase of 661%. Most of that move occurred after August 2023, when China implemented export licensing, with a further acceleration after the December 2024 US-targeted ban. Price gained 83% in 2025 alone and a further 32% year-to-date through April 2026." },
                { type: "prose", text: "The Chinese domestic 4N spot price sits at ~$245/kg on the SMM benchmark \u2014 below the 2022 peak of $510/kg. This anomaly reveals the structural bifurcation: Chinese domestic capacity (~1,000 t/yr) vastly exceeds Chinese domestic consumption, producing chronic oversupply that suppresses domestic pricing. The 9x spread between Chinese domestic and western retail persists because export controls prevent arbitrage." },
                { type: "callout", text: "The opacity creates three dynamics: price discovery is asymmetric and slow, no hedging mechanism exists, and the lack of futures trading removes a standard channel for expressing a view on gallium pricing \u2014 exposure must be intermediated through equities." },
              ] },
            { id: "constraints", label: "Supply constraints", question: "Why can\u2019t supply respond?", teaser: "New western production sites won\u2019t be online until 2029 and all meaningful refining infrastructure is currently in China.", analysis: [
                { type: "prose", text: "Gallium production faces four compounding constraints that prevent rapid supply response even under strong price signals." },
                { type: "subhead", text: "Byproduct dependency" },
                { type: "prose", text: "Gallium exists at ~50 ppm in bauxite and at trace concentrations in zinc ores. It cannot be mined directly; it must be recovered from the liquor streams of alumina refineries or from zinc smelter residues. This fundamentally ties gallium output to aluminum and zinc production rates." },
                { type: "subhead", text: "Low recovery yields" },
                { type: "prose", text: "Only ~10-15% of contained gallium is actually captured during the Bayer process. Improving recovery requires capital investment at refineries that treat gallium as an incidental byproduct." },
                { type: "subhead", text: "Refining capacity concentration" },
                { type: "prose", text: "Global high-purity refining capacity sits at ~340 t/yr, of which ~290 t/yr is Chinese. Non-Chinese refining is ~15-30 t/yr, dominated by Dowa Holdings. Adding a new refinery requires ~3-5 years and specialized process IP." },
                { type: "subhead", text: "Primary production infrastructure lag" },
                { type: "prose", text: "The four announced western primary production projects collectively target ~230 t/yr by 2029. Even if all four succeed on schedule, the first meaningful tonnage does not hit the market until 2027-2028." },
                { type: "callout", text: "None of these constraints resolves before the November 2026 Chinese ban suspension expiry." },
              ] },
            { id: "competing", label: "Competing demand", question: "Who else needs this?", teaser: "Every major demand vector is growing or stable, and the largest \u2014 GaN power electronics \u2014 is accelerating at 42% annually.", analysis: [
                { type: "subhead", text: "AI datacenters" },
                { type: "prose", text: "GaN power chips do the voltage conversion with roughly 30% less energy lost and in a fraction of the physical space. NVIDIA is standardizing on 800V power architecture across its next generation of AI factories, and GaN chips are the default choice. This demand vector barely existed two years ago." },
                { type: "subhead", text: "Defense radar and electronic warfare" },
                { type: "prose", text: "Modern military radars \u2014 AN/SPY-6, LTAMDS, Patriot, G/ATOR, F-35 \u2014 all use GaN chips. The USGS states explicitly: no substitute exists. Defense procurement is funded by government budgets, not commercial pricing, which makes this segment completely insensitive to gallium price moves." },
                { type: "subhead", text: "EV onboard chargers" },
                { type: "prose", text: "This segment is growing at ~73% CAGR as automakers migrate from 400V to 800V vehicle architectures, where GaN\u2019s efficiency advantages over silicon become decisive." },
                { type: "subhead", text: "NdFeB permanent magnets" },
                { type: "prose", text: "Gallium\u2019s largest consumption channel inside China. Added at 0.1-0.2% to the magnet alloy used in EV motors and wind turbines. Chinese NdFeB output is growing ~15% annually." },
                { type: "callout", text: "Four of the five major end uses are growing structurally. The fifth (LEDs) is stable. There is no scenario where gallium demand softens materially unless AI infrastructure, defense spending, EV adoption, and wind/EV motor production all reverse simultaneously." },
              ] },
            { id: "geopolitical", label: "Geopolitical risk", question: "How could it get worse?", teaser: "China controls 99% of primary supply and has already demonstrated willingness to weaponize it \u2014 the November 2026 export ban expiry is a binary event.", analysis: [
                { type: "prose", text: "On July 3, 2023, China\u2019s Ministry of Commerce announced export controls on gallium and germanium, effective August 1. Chinese gallium exports dropped 63.5% year-over-year in the remainder of 2023." },
                { type: "prose", text: "On December 3, 2024, China escalated to a targeted ban on exports of gallium, germanium, antimony, and superhard materials to the United States \u2014 framed as response to the December 2 US BIS addition of 140 entities to the Entity List." },
                { type: "prose", text: "On November 7-9, 2025, MOFCOM formally suspended the December 2024 licensing/review restrictions on gallium, germanium, antimony, and graphite until November 2026. General licenses are now available for exports to US end users. The military end-use ban remains in force." },
                { type: "subhead", text: "November 2026: binary event" },
                { type: "prose", text: "The November 2026 expiry is the single most important dated event in this market. Reimposition of the ban would return the western supply picture to December 2024 conditions. Extension of the suspension or full normalization would compress the spread and pressure western capacity project economics. Every investment position should be stress-tested against both outcomes." },
                { type: "callout", text: "Even the best-case scenario does not eliminate the structural premium. The military end-use ban remains in force, and Chinese capacity overhang means Beijing retains the optionality to tighten again at any time." },
              ] },
            { id: "response", label: "Supply response", question: "What\u2019s being done?", teaser: "Four western production projects are underway and collectively target 230t/yr by 2029, but none resolves the gap before 2028.", analysis: [
                { type: "item", name: "Alcoa / JAGA \u2014 Western Australia (100 t/yr)", desc: "US, Australian, and Japanese governments joining a special purpose vehicle. Australia committed AUD 200M in concessional equity. FID \u201Cexpected by end 2025\u201D but not yet publicly confirmed. Production start targeted late 2026 with ramp to 100 t/yr by 2028-2029. Would be the single largest non-Chinese gallium production facility globally." },
                { type: "item", name: "Metlen Energy \u2014 Greece (50 t/yr)", desc: "FID taken January 2025 on a \u20ac295.5M project. First production of 5 kg achieved January 2026. Targets 50 t/yr by 2028 \u2014 sufficient to fully cover EU demand. EU Critical Raw Materials Act Strategic Project. \u20ac90M EIB financing approved January 2026." },
                { type: "item", name: "Rio Tinto / Indium \u2014 Quebec (40 t/yr)", desc: "Successful laboratory-scale extraction May 2025. Demo plant targets up to 3.5 t/yr with Canadian government support. Commercial conversion targets 40 t/yr, post-2028. Process IP owned by Indium Corporation." },
                { type: "item", name: "Korea Zinc / Crucible JV \u2014 Tennessee (40 t/yr)", desc: "$7.4B investment with DoD holding 40% equity stake. JPMorgan-advised, $4.7B in US government loans plus $210M CHIPS Act subsidies. Replaces existing Nyrstar smelter. Commercial operations 2029. Unprecedented DoD equity stake signals gallium is a strategic defense asset." },
                { type: "callout", text: "If all four projects execute on schedule, western primary capacity approaches 230 t/yr by 2029 \u2014 meaningful for access independence but still less than one-third of projected 2028 global demand. Chinese capacity remains dominant." },
              ] },
            { id: "technology", label: "Technology", question: "What could change the game?", teaser: "No commercial substitute exists for GaN in defense or high-performance power electronics, and the closest alternatives are at least a decade away from displacement scale.", analysis: [
                { type: "prose", text: "Silicon-based CMOS power amplifiers compete with GaAs in low-end cellular handsets but cannot replace GaAs in 5G/6G premium handsets. Indium phosphide (InP) substitutes for GaAs in specific laser diode applications but does not substitute for GaN in RF or power applications. Silicon carbide (SiC) is complementary to GaN \u2014 SiC dominates >1200V, GaN dominates <650V." },
                { type: "subhead", text: "Defense \u2014 no substitute" },
                { type: "prose", text: "For defense radar and electronic warfare applications, no substitute exists. GaN\u2019s combination of power density, frequency capability, and thermal performance is structurally superior. The DoD has funded GaN-on-SiC manufacturing through DARPA programs since 2002, and every current US military AESA radar deployment uses GaN modules." },
                { type: "subhead", text: "Recovery improvements" },
                { type: "prose", text: "Ion-exchange resin technology could lift bauxite-liquor capture rates from 10-15% to 20-25%, raising theoretical supply meaningfully. But this requires capital at refineries that treat gallium as ancillary revenue, and even at doubled yields the incremental tonnage takes years to reach the market." },
                { type: "subhead", text: "Recycling" },
                { type: "prose", text: "Substantial new scrap from GaAs device manufacturing is recycled at Indium Corporation\u2019s New York facility. Old-scrap recycling from end-of-life consumer devices is effectively zero because gallium concentrations are too low to recover economically." },
                { type: "callout", text: "The substitution and efficiency technologies all arrive after the investable window. The near-term picture is determined by policy (November 2026 suspension) and by primary supply execution (Alcoa FID, Metlen scale-up)." },
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
            {(() => {
              const layers: { label: string; ideas: { id: string; name: string; ticker: string; category: string; line1: string }[] }[] = [
                { label: "PRIMARY PRODUCER", ideas: [
                  { id: "alcoa", name: "Alcoa Corporation", ticker: "AA \u00b7 NYSE", category: "Capacity builder", line1: "Operator of the announced 100 t/yr Wagerup gallium project \u2014 the single largest non-Chinese primary production facility in development." },
                  { id: "metlen", name: "Metlen Energy & Metals", ticker: "MYTIL \u00b7 Athens Stock Exchange", category: "Capacity builder", line1: "Europe\u2019s first industrial gallium producer \u2014 50 t/yr by 2028 fully covers EU demand." },
                  { id: "rio-tinto", name: "Rio Tinto", ticker: "RIO \u00b7 NYSE / LSE / ASX", category: "Feedstock supplier", line1: "Global aluminum producer with a demonstration gallium plant at Vaudreuil, Quebec \u2014 optionality on North American primary supply." },
                  { id: "korea-zinc", name: "Korea Zinc", ticker: "010130.KS \u00b7 Seoul", category: "Market maker", line1: "Anchor of the $7.4B Crucible JV with the US Department of Defense holding a 40% equity stake." },
                  { id: "chinese-primary", name: "Chinese Primary Supply", ticker: "Aggregate", category: "Market maker", line1: "98% of global primary production; the entity whose MOFCOM export licensing determines whether the western scarcity premium holds." },
                ] },
                { label: "REFINER", ideas: [
                  { id: "dowa", name: "Dowa Holdings", ticker: "5714.T \u00b7 Tokyo", category: "Chokepoint holder", line1: "Leading non-Chinese high-purity gallium refiner \u2014 the de facto western pipeline for GaAs wafer supply." },
                  { id: "5n-plus", name: "5N Plus", ticker: "VNP \u00b7 TSX", category: "Pure-play", line1: "Canadian specialty semiconductor refiner with multi-metal exposure \u2014 the most direct western investment vehicle for critical minerals refining." },
                ] },
                { label: "DIRECT EXPOSURE", ideas: [
                  { id: "gallium-metal", name: "Gallium metal", ticker: "Physical commodity", category: "Direct exposure", line1: "No futures contract, no ETF, no exchange pricing. Western retail price up 7.6x since 2020 on bifurcated market structure." },
                ] },
              ];
              return layers.map((layer, li) => (
                <React.Fragment key={layer.label}>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: dimText, margin: li === 0 ? "0 0 8px 0" : "24px 0 8px 0" }}>{layer.label}</p>
                  {layer.ideas.map((idea) => (
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
                        <p style={{ fontSize: 12, color: "#c4bdb2", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{idea.line1}</p>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ));
            })()}
          </div>

        </div>

        {/* CATALYSTS */}
        <div id="catalysts" style={{ marginBottom: 56, paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>CATALYSTS</p>

          {/* Near-term */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.08em", color: accent, margin: "0 0 14px 0", fontWeight: 500 }}>NEAR-TERM (NEXT 6 MONTHS)</p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {[
                { date: "May 6, 2026", desc: "5N Plus Q1 2026 earnings release" },
                { date: "Q2 2026", desc: "Alcoa / JAGA Final Investment Decision confirmation" },
                { date: "Q2-Q3 2026", desc: "Metlen production milestones toward 5-10t target" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 12.5, color: warmWhite, fontWeight: 500, flexShrink: 0 }}>{item.date}</span>
                  <span style={{ fontSize: 12.5, color: dimmer }}>&mdash;</span>
                  <span style={{ fontSize: 12.5, color: muted }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Medium-term */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.08em", color: accent, margin: "0 0 14px 0", fontWeight: 500 }}>MEDIUM-TERM (6-12 MONTHS)</p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {[
                { date: "H2 2026", desc: "Alcoa / JAGA construction progress toward initial production" },
                { date: "November 27, 2026", desc: "Chinese export ban suspension expires (binary catalyst)" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 12.5, color: warmWhite, fontWeight: 500, flexShrink: 0 }}>{item.date}</span>
                  <span style={{ fontSize: 12.5, color: dimmer }}>&mdash;</span>
                  <span style={{ fontSize: 12.5, color: muted }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Long-term */}
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.08em", color: accent, margin: "0 0 14px 0", fontWeight: 500 }}>LONG-TERM (12+ MONTHS)</p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {[
                { date: "2027-2028", desc: "Metlen ramp to 50 t/yr" },
                { date: "2027-2028", desc: "Alcoa Wagerup ramp to 100 t/yr" },
                { date: "2029", desc: "Korea Zinc / Crucible JV commercial operations begin" },
                { date: "2029+", desc: "Rio Tinto / Indium Quebec commercial-scale conversion" },
                { date: "Ongoing", desc: "US-China trade policy cycles" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 12.5, color: warmWhite, fontWeight: 500, flexShrink: 0 }}>{item.date}</span>
                  <span style={{ fontSize: 12.5, color: dimmer }}>&mdash;</span>
                  <span style={{ fontSize: 12.5, color: muted }}>{item.desc}</span>
                </div>
              ))}
            </div>
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
                  { risk: "China extends the suspension or lifts controls entirely", assessment: "Would collapse the 9x western premium rapidly. The November 2025 trade truce demonstrated that Beijing can unwind controls when strategic calculus shifts. Base case is suspension renewal; risk of full normalization remains real." },
                  { risk: "Alcoa Wagerup reaches production on schedule", assessment: "100 t/yr non-Chinese supply hitting the market in late 2026 would materially improve western access. FID not yet publicly confirmed; any slippage pushes this out to 2027 or beyond." },
                  { risk: "Metlen scales from 5 kg to 50 t/yr without execution slippage", assessment: "The 10,000x scale-up is technically aggressive. If delivered on schedule, fully covers EU demand and reduces European pricing premium." },
                  { risk: "Recovery rates at alumina refineries improve industry-wide", assessment: "Ion-exchange technology could push bauxite-liquor yields from 10-15% to 20-25%. Requires capital investment at refineries that don\u2019t prioritize gallium. Timeline 3-5 years." },
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
                  { risk: "AI infrastructure spending decelerates", assessment: "The GaN power demand story is heavily weighted to AI datacenter 800V HVDC build-out. A correction in AI capex would slow the 42% CAGR and reduce near-term pressure. Defense demand persists independently." },
                  { risk: "EV penetration growth slows", assessment: "EV onboard chargers projected to grow at 73% CAGR. A durable deceleration would slow GaN power device demand and the NdFeB magnet dopant channel." },
                  { risk: "GaN-on-Si migration reduces gallium intensity per device", assessment: "Industry shift from 6-inch GaN-on-SiC to 8-inch GaN-on-Si improves wafer economics and could reduce gallium usage per device. Slows demand growth but does not reverse it." },
                  { risk: "Broader semiconductor cycle correction", assessment: "GaAs handset RF demand tracks global smartphone sales. A multi-year smartphone downturn would reduce GaAs substrate demand and new-scrap recycling feedstock simultaneously." },
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
            <p style={{ fontSize: 12, color: muted, lineHeight: 1.6, margin: 0 }}>The central risk resolves in November 2026 when the Chinese ban suspension expires. Until then, western supply remains structurally short and western pricing holds. After November 2026, the market bifurcates based on policy outcome &mdash; a path-dependent variable that no investor can independently forecast but that every linked position must be stress-tested against.</p>
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
