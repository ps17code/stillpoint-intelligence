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
    const ids = ["thesis", "how-its-made", "supply-tree", "dependencies", "supply-demand", "so-what", "money", "catalysts", "risk"];
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
    "axt": {
      name: "AXT, Inc.",
      ticker: "AXTI \u00b7 Nasdaq",
      category: "Manufacturing / Integration",
      metrics: [
        { label: "Market cap", value: "$4.59B" },
        { label: "Revenue", value: "~$95M" },
        { label: "EBITDA", value: "-$12.87M" },
        { label: "Price", value: "$82.41" },
        { label: "12mo", value: "+287%" },
      ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "AXT makes wafers \u2014 the thin circular discs that semiconductor chips are built on. Specifically, AXT makes the kind of wafers that silicon cannot replace: gallium arsenide for 5G phone power amplifiers, indium phosphide for the laser chips that connect GPUs inside AI datacenters, and germanium for satellite solar cells. Its Beijing facility is, by the company\u2019s account, the world\u2019s largest facility of its kind. When a 5G phone sends a signal, or when an NVIDIA GPU talks to another GPU via fiber, the underlying chip probably started its life as an AXT wafer." },
          { text: "Gallium matters to AXT because gallium arsenide and gallium-related substrates are its core product. AXT also owns joint ventures in China that purify raw gallium into the feedstock it uses, giving it cost control over its own input." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "AXT is the chokepoint where refined gallium becomes a finished product a chipmaker can actually use. Only a handful of companies globally can make gallium arsenide wafers at scale \u2014 AXT, Japan\u2019s Sumitomo Electric, Germany\u2019s Freiberger, the UK\u2019s IQE. Among these, AXT has the most capacity. It also has vertical integration advantages through its Chinese gallium purification JVs, which give it a cost structure competitors cannot easily match." },
          { text: "The catch: AXT\u2019s main facility is in Beijing, and every wafer shipped to a non-Chinese customer needs a Chinese export permit. Since the August 2023 export controls, permits have taken much longer to clear. AXT\u2019s 2025 gallium arsenide revenue was held back not by weak demand but by slow permits. The company cannot fix this \u2014 the variable is Chinese policy." },
          { text: "The indium phosphide business, by contrast, is booming. InP revenue grew 250% sequentially in Q3 2025 as AI datacenter demand for optical interconnect chips accelerated. This is the driver behind the stock\u2019s 287% gain over the past year." },
        ] },
        { label: "Key numbers", items: [
          { title: "Manufacturing footprint", text: "~300,000 sq ft Beijing facility" },
          { title: "Segment mix", text: "68% substrates, 32% raw materials" },
          { title: "Q3 2025 InP revenue growth", text: "+250% sequentially" },
          { title: "FY25 GaAs revenue run-rate", text: "~$28M (constrained by export permits)" },
          { title: "2027 capex plan", text: "$100-150M for greenfield expansion" },
        ] },
        { label: "What to watch", items: [
          { text: "Q1 2026 earnings (April 30) for InP trajectory and GaAs permit clearance rate." },
          { text: "November 2026 Chinese export control suspension expiry \u2014 reimposition caps AXT\u2019s GaAs revenue." },
          { text: "InP wafer capacity doubling plan for 2027." },
        ] },
        { label: "Investment angle", items: [
          { text: "AXT is the cleanest western-listed bet on the gallium substrate chokepoint and the AI optical infrastructure buildout. The stock has already priced in considerable optionality \u2014 market cap is $4.59B on a company with negative EBITDA. The thesis requires InP growth to continue and GaAs permits to normalize. A return to pre-2023 Chinese export conditions would collapse the premium the stock currently trades at; further tightening would shift revenue mix even more toward InP (which is less permit-sensitive because fewer Chinese alternatives exist)." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Gallium Chain \u00b7 Layer: Substrate Manufacturer. Sources: AXT SEC filings, Semiconductor Today. Not investment advice.",
    },
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
          { text: "Alcoa is one of the world\u2019s largest aluminum producers. It mines bauxite ore, refines it into alumina, and smelts alumina into aluminum \u2014 the full vertical stack. Most of its revenue comes from selling aluminum to automakers, construction firms, and packaging companies. Gallium is not currently part of that business." },
          { text: "What puts Alcoa on this page is a project announced in October 2025: at one of its Western Australian alumina refineries, Alcoa plans to bolt on equipment to extract gallium as a byproduct of aluminum production. The target is 100 tonnes per year \u2014 roughly 10% of current global gallium demand and a 10x increase in non-Chinese supply. Four sovereign governments (US, Australia, Japan, and Alcoa\u2019s home country via the JV structure) are collectively funding the project." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "If the project gets built, Alcoa becomes the single largest non-Chinese source of primary gallium \u2014 by a wide margin. The facility would extract gallium from the liquid waste stream the refinery already produces, so the incremental cost is relatively low: some ion-exchange equipment and electrolysis cells, plus a small share of ongoing energy and reagents. The economics look good because the infrastructure is already there." },
          { text: "The joint venture is called JAGA (Japan Australia Gallium Associates), formed by Japanese government-backed entities (Sojitz + JOGMEC) together with Alcoa. Australia has committed AUD 200M in concessional equity. The US government signed on in October 2025. Each government gets gallium offtake in proportion to its investment \u2014 meaning they take delivery of a share of the gallium, likely into strategic reserves or to domestic refiners." },
          { text: "For Alcoa specifically, gallium is a rounding error financially. At 100 t/yr and $1,500/kg realized pricing, gross gallium revenue would be ~$150M annually against Alcoa\u2019s ~$12B revenue base. The stock is still fundamentally an aluminum cycle bet. The gallium project is strategic positioning \u2014 Alcoa becomes the default allocation for sovereign and institutional mandates seeking western critical minerals exposure with operational backing." },
        ] },
        { label: "Key numbers", items: [
          { title: "Target gallium capacity", text: "100 t/yr (10% of global demand)" },
          { title: "Australian government commitment", text: "AUD 200M concessional equity" },
          { title: "Project location", text: "Wagerup or Pinjarra refinery, Western Australia" },
          { title: "Liquor stream used", text: "~10% of refinery flow" },
          { title: "FID status", text: "\u201CExpected by end 2025\u201D \u2014 not confirmed as of April 2026" },
          { title: "Production start target", text: "late 2026, full ramp 2028-2029" },
        ] },
        { label: "What to watch", items: [
          { text: "Final Investment Decision announcement \u2014 delay signals execution risk." },
          { text: "SPV terms (pricing mechanics, offtake ratios) once finalized." },
          { text: "Construction milestones \u2014 mining projects routinely slip 12-24 months." },
        ] },
        { label: "Investment angle", items: [
          { text: "Alcoa is aluminum cycle exposure with gallium optionality attached. For investors already comfortable with aluminum, Alcoa adds the clearest near-term path to meaningful western gallium production. For pure gallium exposure, it\u2019s too diluted \u2014 Metlen and AXT are more concentrated. The thesis surfaces in the valuation only when the project delivers tangible revenue, which is 2027-2028 at the earliest." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Gallium Chain \u00b7 Layer: Primary Producer (planned). Sources: Alcoa investor communications (October 2025), JOGMEC and Sojitz announcements. Not investment advice.",
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
          { text: "Metlen is a large Greek industrial company that makes aluminum, generates electricity, and builds infrastructure. It was called Mytilineos until 2024. Most of its revenue comes from energy and aluminum. Gallium is a new business line." },
          { text: "What puts Metlen on this page is its project at Agios Nikolaos, Greece \u2014 the same site where it has been refining bauxite into alumina for decades. In January 2025 the company committed \u20ac295.5M to add gallium extraction to the existing operation, with a target of 50 tonnes per year by 2028. In January 2026, the European Investment Bank approved \u20ac90M in financing, and the first 5 kilograms were produced \u2014 proving the company\u2019s proprietary extraction process works at industrial scale. The project is designated a Strategic Project under the EU Critical Raw Materials Act." },
          { text: "If Metlen hits its target, Europe covers its entire gallium demand domestically for the first time since 2016." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "The project works because Metlen already owns the hard parts. Gallium is extracted from the same liquid byproduct stream that already flows through the existing alumina refinery \u2014 no new mine, no new refinery, just a bolt-on extraction circuit. That gives Metlen a structural cost advantage: its gallium can compete with Chinese pricing at scale." },
          { text: "Metlen also holds the demand side. European semiconductor and defense buyers need gallium that isn\u2019t export-controlled by China. They will pay premium pricing \u2014 potentially double or triple the Chinese domestic price \u2014 for supply sovereignty. Metlen\u2019s quoted \u20ac1B export market value for the full bauxite-alumina-gallium project bakes this premium in." },
          { text: "At 50 t/yr and realized pricing around \u20ac1,800-2,000/kg, gallium would contribute \u20ac80-100M annually. That\u2019s ~1-2% of total revenue \u2014 small, but high-margin and strategic. The real long-term value is that Metlen is also expanding into scandium and germanium at the same site. If that works, Metlen becomes Europe\u2019s default critical minerals platform, and the valuation multiple expands beyond what a mature aluminum producer would command." },
        ] },
        { label: "Key numbers", items: [
          { title: "Target gallium production", text: "50 t/yr by 2028" },
          { title: "First production", text: "5 kg (January 2026)" },
          { title: "EIB financing", text: "\u20ac90M (approved January 2026)" },
          { title: "Total project investment", text: "\u20ac295.5M" },
          { title: "Current EU gallium coverage at full ramp", text: "100%" },
          { title: "Dividend yield", text: "~2.9%" },
        ] },
        { label: "What to watch", items: [
          { text: "Scale-up from 5 kg to 5-10t (2027 target) to 50t (2028) \u2014 quarterly reports will show trajectory." },
          { text: "Offtake agreements with European semiconductor manufacturers or defense primes." },
          { text: "Scandium and germanium expansion announcements \u2014 these multiply the thesis." },
        ] },
        { label: "Investment angle", items: [
          { text: "Metlen is the cleanest European exposure to the gallium chain. For investors who can access Athens or London listings, it offers a mature, dividend-paying industrial with genuine critical minerals optionality backed by EU sovereign financing. The gallium segment alone is too small to re-rate the stock, but the full platform thesis (gallium + scandium + germanium) could. Main execution risk: scaling from 5 kg to 50 t/yr is a 10,000x increase." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Gallium Chain \u00b7 Layer: Primary Producer (under construction). Sources: Metlen press releases, European Commission CRMA strategic projects list. Not investment advice.",
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
          { text: "5N Plus is a Canadian specialty metals refiner. It takes in raw materials like gallium, germanium, indium, tellurium, and bismuth and purifies them to the levels needed by semiconductor makers, solar panel manufacturers, pharmaceutical companies, and defense suppliers. The company name comes from \u201C5N\u201D \u2014 99.999% pure \u2014 the minimum purity grade it targets." },
          { text: "Its most valuable asset is AZUR SPACE, a German subsidiary that builds the germanium-based solar cells used on satellites. AZUR is the largest non-Chinese producer of space solar cells globally and has a 265-day backlog driven by LEO constellation buildouts (Starlink, OneWeb, military satellites)." },
          { text: "Gallium matters to 5N Plus, but it\u2019s smaller than germanium and AZUR. The company produces maybe 2-5 tonnes of high-purity gallium per year from Montreal \u2014 strategically relevant to North American supply, but not the main earnings driver. 5N Plus is on this page because it\u2019s the highest-quality western vehicle for broad critical-minerals exposure, of which gallium is one piece." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "Revenue comes from two segments. Specialty Semiconductors (~$285M, 73% of total) includes AZUR space solar cells, compound semiconductor wafers (CdTe for First Solar), and refined specialty metals including gallium. Performance Materials covers pharmaceutical-grade bismuth and specialty chemicals at steadier but lower-margin pricing." },
          { text: "The business runs on multi-year take-or-pay contracts. The thin-film solar customer (widely understood to be First Solar) has committed to 33% volume growth in 2025-2026 and another 25% through 2028. AZUR\u2019s 265-day backlog, combined with multiple capacity expansions (35% in 2024, 30% in 2025, another 25% planned for 2026), creates years of visible revenue. In January 2026, the US DoE granted 5N Plus $18.1M to expand germanium recycling at a Utah facility \u2014 direct US government backing." },
          { text: "Financial quality is the standout. FY25 revenue grew 35%, EBITDA grew 73%, net debt/EBITDA sits at 0.5x. This is a rare combination of growth and balance sheet discipline among critical-minerals names." },
        ] },
        { label: "Key numbers", items: [
          { title: "Specialty Semiconductors segment", text: "~$285M (73% of total revenue)" },
          { title: "Net debt / EBITDA", text: "0.5x" },
          { title: "AZUR space solar backlog", text: "265 days" },
          { title: "US DoE germanium grant", text: "$18.1M (January 2026)" },
          { title: "Estimated gallium production", text: "2-5 t/yr" },
          { title: "Dividend", text: "None (reinvestment policy)" },
        ] },
        { label: "What to watch", items: [
          { text: "Q1 2026 earnings (May 2026) \u2014 first full quarter under new CEO." },
          { text: "AZUR space solar 25% capacity lift for 2026 \u2014 execution milestone." },
          { text: "Any dedicated gallium expansion announcement \u2014 would be a catalyst given 5N Plus\u2019s existing refining capability." },
        ] },
        { label: "Investment angle", items: [
          { text: "5N Plus is the highest-quality broad critical-minerals name on public markets. The stock has run 532% over 12 months, which reflects a genuine re-rating rather than speculation \u2014 the company is growing into its multiple with real contracted revenue. For portfolios that want critical-minerals exposure with operational discipline, 5N Plus is arguably the best-scaled North American option. The caveat: gallium is a small share of the thesis. If you want concentrated gallium exposure, AXT is more direct." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Gallium Chain \u00b7 Layer: Refiner. Sources: 5N Plus investor communications, TSX filings. Not investment advice.",
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
          { text: "Dowa is a large Japanese specialty metals company, founded in 1884 as a mining operation. Today it runs four businesses: zinc and lead smelting, electronic materials, metal recycling, and metal processing. Zinc and lead make up most of the revenue. Gallium sits inside the electronic materials segment." },
          { text: "Dowa matters to the gallium chain because it is the western world\u2019s most important non-Chinese high-purity gallium refiner. When a Japanese or Korean semiconductor maker \u2014 or a US customer who wants to avoid Chinese supply risk \u2014 needs high-purity gallium, Dowa is the default supplier. After China\u2019s December 2024 US-targeted export ban, Dowa\u2019s role as a pass-through refiner for non-Chinese buyers became structurally more important." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "Dowa\u2019s gallium business works by buying low-purity gallium metal (historically from Chinese producers, secondarily from other regional sources) and refining it up to 99.9999%-plus purity \u2014 the grade needed for gallium arsenide wafers and LED production. That refining is a specialized skill that only a handful of companies globally can do at scale. Dowa holds the leading position outside China." },
          { text: "The pricing power comes from two places. First, technical capability: Dowa\u2019s purity grades meet the strictest semiconductor specifications, and few competitors can replicate this. Second, geopolitical premium: western buyers pay up for gallium that isn\u2019t routed through Chinese export controls. When the Chinese bans are active, Dowa\u2019s prices effectively float upward with the access premium." },
          { text: "The catch for investors: Dowa doesn\u2019t break out gallium revenue separately. Industry estimates put Dowa\u2019s gallium output at 10-30 t/yr \u2014 meaningful relative to global non-Chinese production (~15 t/yr total), but small relative to the company\u2019s multi-segment business. The gallium thesis is real, but it\u2019s diluted inside a zinc-lead conglomerate." },
        ] },
        { label: "Key numbers", items: [
          { title: "Estimated gallium output", text: "10-30 t/yr high-purity" },
          { title: "Global non-Chinese refining share", text: "Leading position" },
          { title: "Business segments", text: "4 (zinc-lead dominates revenue)" },
          { title: "Dividend yield", text: "~2-3%" },
        ] },
        { label: "What to watch", items: [
          { text: "Japanese government critical minerals policy \u2014 direct support would strengthen Dowa\u2019s position." },
          { text: "Sojitz/JOGMEC/JAGA Australia alignment \u2014 if Alcoa\u2019s gallium project ships to Dowa for refining, Dowa\u2019s input feedstock expands materially." },
          { text: "Metlen\u2019s European production ramp \u2014 modestly reduces Dowa\u2019s strategic pricing power once operational." },
        ] },
        { label: "Investment angle", items: [
          { text: "Dowa is a lower-volatility, higher-quality way to play the gallium chain \u2014 but it\u2019s diluted. For investors who want Japanese specialty metals exposure with real gallium optionality, Dowa fits. For pure gallium exposure, it\u2019s too diversified \u2014 gallium is a small share of a zinc-lead-dominated portfolio. The Tokyo listing also limits direct US investor access." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Gallium Chain \u00b7 Layer: Refiner. Sources: Dowa annual reports, US-Japan Critical Minerals Framework announcements. Not investment advice.",
    },
    "navitas": {
      name: "Navitas Semiconductor",
      ticker: "NVTS \u00b7 Nasdaq",
      category: "Technology / Demand Proxy",
      metrics: [
        { label: "Market cap", value: "~$1.1B" },
        { label: "Revenue", value: "$45.9M" },
        { label: "EBITDA", value: "\u2014" },
        { label: "Cash", value: "$236.9M" },
        { label: "12mo", value: "\u2014" },
      ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Navitas designs and sells power chips \u2014 the tiny components that convert electricity from one voltage to another inside every phone charger, laptop adapter, EV battery charger, and datacenter rack. The company is the only public pure-play manufacturer focused on gallium nitride (GaN) and silicon carbide (SiC), the two next-generation materials displacing traditional silicon in power conversion. Everything Navitas sells is built on gallium-based or silicon-carbide-based chips." },
          { text: "Navitas matters to the gallium thesis as the demand proxy. When GaN adoption accelerates, Navitas\u2019s volumes rise. When it slows, they fall. The company is a clean-read instrument for GaN demand growth \u2014 especially in AI datacenters, which is the fastest-growing gallium demand vector." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "In 2025, Navitas pivoted hard. Management moved the company away from low-margin consumer chargers (USB-C fast chargers, laptop adapters) and toward high-margin industrial applications (AI datacenter power, EV onboard chargers, grid infrastructure). This shift cut revenue nearly in half in 2025 \u2014 from $83M to $46M \u2014 but raised the quality of the revenue that remained. Q4 2025 was the first quarter where high-power markets contributed the majority of sales." },
          { text: "The biggest growth lever is AI datacenters. In October 2025, Navitas announced it was designed into NVIDIA\u2019s new 800V DC power architecture \u2014 the standard NVIDIA is rolling out across its AI factories. Every GW of that architecture needs thousands of Navitas chips. Navitas also signed a manufacturing partnership with GlobalFoundries to produce GaN chips inside the US starting late 2026 \u2014 meaningful for defense and datacenter customers who need domestic supply chains." },
          { text: "Semiconductor revenue takes 18-36 months to convert from design win to volume shipments. Navitas announced $450M of design wins in 2024, which should convert through 2026-2028. The $236.9M cash balance provides runway to execute without further dilution." },
        ] },
        { label: "Key numbers", items: [
          { title: "FY2025 revenue", text: "$45.9M (vs. $83.3M FY2024 \u2014 pivot-driven decline)" },
          { title: "High-power share of Q4 2025 revenue", text: ">50% for the first time" },
          { title: "GaN units shipped to date", text: "250M+" },
          { title: "2024 design wins", text: "$450M (converts 2026-2028)" },
          { title: "Q1 2026 revenue guidance", text: "$8-8.5M" },
        ] },
        { label: "What to watch", items: [
          { text: "Q1 2026 earnings (May 5) \u2014 revenue trajectory and design-win conversion rate." },
          { text: "GlobalFoundries US GaN production availability (late 2026)." },
          { text: "NVIDIA 800V HVDC adoption pace \u2014 determines datacenter revenue ramp." },
        ] },
        { label: "Investment angle", items: [
          { text: "Navitas is the highest-beta public exposure to GaN demand. For investors with conviction on AI datacenter buildout and GaN adoption curves, it\u2019s the most concentrated pure-play on public markets \u2014 no other listed company lives or dies on GaN volumes this completely. The trade-off: the stock has run well ahead of fundamentals (analyst 12-month target implies ~50% downside), the company is still loss-making, and the pivot execution is mid-flight. Exposure to Navitas is exposure to GaN demand growth, not to gallium pricing directly \u2014 higher gallium prices raise Navitas\u2019s input costs rather than benefit the company." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Gallium Chain \u00b7 Layer: Device Manufacturer. Sources: Navitas SEC filings, NVIDIA and GlobalFoundries partnership announcements. Not investment advice.",
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
          { text: "Rio Tinto is one of the world\u2019s largest diversified miners. It mines iron ore, copper, aluminum (via bauxite and alumina), lithium, and other metals across more than 30 countries. Iron ore is by far the largest revenue driver. Aluminum is the second-largest segment." },
          { text: "What puts Rio Tinto on this page is a small project at its Vaudreuil alumina refinery in Saguenay, Quebec. In May 2025, Rio Tinto and Indium Corporation announced the first successful laboratory-scale extraction of gallium from the Vaudreuil refinery\u2019s byproduct stream. In March 2026, Rio Tinto committed to advance the project to a demonstration plant with Canadian federal and Quebec provincial government support. The demo plant targets up to 3.5 tonnes per year. A later commercial facility could reach 40 t/yr \u2014 5-10% of current global production." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "Rio Tinto\u2019s gallium project works the same way Alcoa\u2019s does: bolt gallium extraction equipment onto an existing alumina refinery, capture the gallium that\u2019s already flowing through the Bayer process, sell it. The cost structure is attractive because the refinery infrastructure is already sunk." },
          { text: "Financially, gallium is immaterial to Rio Tinto. At 3.5 t/yr (demo) and $1,500/kg, the project generates ~$5M annually against Rio Tinto\u2019s $55B revenue base. Even at the 40 t/yr commercial target, gallium contributes ~$60M \u2014 a rounding error." },
          { text: "The real value is positioning. Rio Tinto is deliberately building a portfolio of critical minerals businesses (gallium, scandium, tellurium, molybdenum, lithium) that differentiate it from single-commodity miners. As sovereign and institutional capital flows toward critical minerals allocations, Rio Tinto captures that flow through its diversified exposure." },
          { text: "One structural detail worth noting: the extraction process IP is owned by Indium Corporation (Rio Tinto\u2019s US partner), not by Rio Tinto. This means Rio Tinto cannot independently scale the gallium project without Indium\u2019s continued participation \u2014 creating a technology dependency similar to Umicore\u2019s role in the germanium chain." },
        ] },
        { label: "Key numbers", items: [
          { title: "Demo plant capacity", text: "up to 3.5 t/yr" },
          { title: "Commercial-scale target", text: "40 t/yr" },
          { title: "Location", text: "Saguenay-Lac-Saint-Jean, Quebec" },
          { title: "Government backing", text: "Canadian federal + Quebec provincial" },
          { title: "First extraction", text: "May 2025; demo plant timeline: unspecified" },
        ] },
        { label: "What to watch", items: [
          { text: "Demo plant construction commissioning milestones." },
          { text: "Quebec provincial financial commitments and offtake structure." },
          { text: "Rio Tinto\u2019s broader critical minerals announcements (scandium, tellurium) \u2014 these multiply the thesis." },
        ] },
        { label: "Investment angle", items: [
          { text: "Rio Tinto is aluminum + iron ore exposure with gallium optionality on top. For investors comfortable with diversified mining exposure, it adds near-riskless gallium optionality to a balance-sheet-rich, dividend-paying (~5% yield) mega-cap. For concentrated gallium exposure, it\u2019s far too diversified \u2014 Metlen or Alcoa are better. The gallium segment will not move the stock in any meaningful way until commercial production is confirmed \u2014 a multi-year path." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Gallium Chain \u00b7 Layer: Primary Producer (demo stage). Sources: Rio Tinto press releases (May 2025, March 2026), Indium Corporation communications, Government of Canada and Quebec announcements. Not investment advice.",
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
          { text: "Korea Zinc is the world\u2019s largest non-Chinese zinc smelter, based in Seoul. Most of its revenue comes from zinc and lead refining at operations in South Korea and Australia. It also produces a range of byproduct specialty metals \u2014 indium, bismuth, tellurium, silver \u2014 at smaller volumes." },
          { text: "Korea Zinc matters to the gallium chain because of a deal announced in December 2025 called the Crucible JV. This is a $7.4B joint venture to build a new critical minerals smelter in Clarksville, Tennessee, on the site of the existing Nyrstar facility. The structure is unprecedented: the US Department of Defense takes a 40% equity stake, JPMorgan advises, and $4.7B comes from US government loans plus $210M in CHIPS Act subsidies. When completed in 2029, the facility will produce 540,000 tonnes per year of critical minerals \u2014 including zinc, lead, copper, antimony, germanium, and approximately 40 t/yr of gallium." },
          { text: "This is the single largest critical minerals processing investment in US history." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "Korea Zinc\u2019s direct economic share in the JV is modest \u2014 less than 10% of the equity. The real value is operational: Korea Zinc brings zinc smelting expertise, technology, and execution capacity. The DoD and JPMorgan bring the capital. Korea Zinc gets paid as operator and earns its share of gallium and other byproduct output." },
          { text: "At 40 t/yr of gallium and realized pricing around $1,500-2,000/kg, the gallium share alone is worth $60-80M annually \u2014 meaningful for a single byproduct, but small against Korea Zinc\u2019s $9B top line. The larger thesis is positioning: Korea Zinc becomes the US government\u2019s preferred operational partner for critical minerals processing, which creates multi-decade revenue visibility beyond any one facility. The unprecedented DoD equity stake signals that gallium and the other Crucible outputs are being treated as strategic defense assets rather than commodities." },
        ] },
        { label: "Key numbers", items: [
          { title: "Crucible JV total investment", text: "$7.4B" },
          { title: "DoD equity stake", text: "40%" },
          { title: "Korea Zinc equity stake", text: "<10%" },
          { title: "Total finished product output", text: "540,000 t/yr" },
          { title: "Gallium output", text: "~40 t/yr" },
          { title: "Site preparation: 2026; Commercial operations", text: "2029" },
        ] },
        { label: "What to watch", items: [
          { text: "Construction milestones 2026-2029 \u2014 processing projects routinely slip 12-24 months." },
          { text: "Korea Zinc ownership dispute with Young Poong Corp./MBK Partners \u2014 could affect execution capacity." },
          { text: "Whether any interim gallium recovery from Nyrstar tailings proceeds before the new smelter is ready." },
        ] },
        { label: "Investment angle", items: [
          { text: "Korea Zinc is exposure to US government-backed critical minerals infrastructure. For investors with Seoul market access and patience for a 2029 commercial start, it\u2019s a credible critical minerals allocation with rare sovereign backing. Gallium is diluted inside a broad 13-product output \u2014 for pure gallium exposure, Alcoa or Metlen are more concentrated. The main near-term risks are execution timing and Korean governance." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Gallium Chain \u00b7 Layer: Primary Producer + Refiner (planned). Sources: Korea Zinc December 2025 announcements, Crucible JV press releases, Bloomberg, Mining.com. Not investment advice.",
    },
    "chinese-primary": {
      name: "Chinese Primary Supply",
      ticker: "Aggregate \u00b7 Not listed",
      category: "Market Maker",
      metrics: [],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "This is not a single company. It is the combined output of roughly 20 Chinese alumina refineries that produce gallium as a byproduct. Some are state-owned (Chalco, Shandong Weiqiao). Some are privately held (Vital Materials, Zhuzhou Keneng). Chinese capacity grew from ~140 t/yr in 2010 to ~1,000 t/yr by 2022 and continues to expand." },
          { text: "This aggregate is on the page because it is the single most important variable in the entire gallium investment thesis. Every other entity here \u2014 AXT, Alcoa, Metlen, 5N Plus, Dowa, Navitas, Rio Tinto, Korea Zinc \u2014 derives its investability from its position relative to what China does." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "No direct value flow to western investors. Chinese primary producers are state-owned, state-affiliated, or traded only on Chinese exchanges with limited foreign access." },
          { text: "The indirect flow is what matters: Chinese policy sets both the floor and the ceiling on global gallium pricing. The floor is Chinese domestic pricing at ~$245/kg \u2014 depressed because Chinese capacity of 1,000 t/yr vastly exceeds Chinese domestic demand. The ceiling is the western retail price at ~$2,269/kg \u2014 elevated because export licensing and the December 2024 ban prevent western buyers from arbitraging down to Chinese domestic levels." },
          { text: "The 9x spread between the two prices is the entire gallium investment opportunity. If China lifts export controls, the spread collapses and every western capacity project faces margin pressure. If China tightens controls, the spread widens and every western project becomes more valuable. If controls hold steady at the current suspension (in effect until November 2026), the spread persists and western projects ramp into a market that still needs them. The overbuilt capacity is deliberate \u2014 it gives Beijing the optionality to flood or starve the global market. This is the central variable every position in the chain must stress-test against." },
        ] },
        { label: "Key numbers", items: [
          { title: "Aggregate installed capacity", text: "~1,000 t/yr" },
          { title: "Aggregate actual production", text: "~590 t/yr" },
          { title: "Utilization", text: "~59%" },
          { title: "Global share of primary supply", text: "98-99%" },
          { title: "Global share of refined supply", text: "~91%" },
          { title: "Chinese domestic price (SMM 4N, March 2026)", text: "$245/kg" },
          { title: "Western retail price (SMI, April 2026)", text: "$2,269/kg" },
          { title: "Spread", text: "9x" },
          { title: "2023 export licensing imposed", text: "August 1, 2023" },
          { title: "2024 US-targeted ban", text: "December 3, 2024" },
          { title: "Current status", text: "Suspended November 2025 through November 2026" },
        ] },
        { label: "What to watch", items: [
          { text: "November 2026 suspension expiry \u2014 binary event." },
          { text: "MOFCOM licensing behavior \u2014 whether \u201Cgeneral licenses\u201D actually clear in reasonable timeframes." },
          { text: "Chinese domestic consumption growth (NdFeB magnets, LEDs) \u2014 affects tonnage available for export." },
        ] },
        { label: "Investment angle", items: [
          { text: "Not directly investable, but unavoidable. Every portfolio with western gallium exposure is implicitly a bet on what China does in November 2026 and beyond. The relevant portfolio question isn\u2019t \u201Cdo I own Chinese gallium?\u201D but \u201Cwhich scenario \u2014 ban reimposition, ban renewal, or normalization \u2014 am I positioned for, and does my exposure survive the other two?\u201D" },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Gallium Chain \u00b7 Layer: Aggregate: Primary Producer. Sources: USGS Mineral Commodity Summaries, MOFCOM notices, SMM benchmarks, Fastmarkets. Not investment advice.",
    },
    "gallium-metal": {
      name: "Gallium metal",
      ticker: "Physical commodity",
      category: "Direct Exposure",
      metrics: [],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Gallium metal is the raw material that feeds every other entity on this page. AXT converts it into compound semiconductor wafers. Navitas builds GaN chips from it. Dowa refines it to semiconductor grade. Alcoa and Metlen are racing to produce it. China controls 98% of global supply." },
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
          { text: "Not directly investable without physical trading infrastructure. No futures contract, no ETF, no exchange-traded vehicle. The only way to express a view on gallium pricing through liquid securities is via the equities on this page \u2014 primarily AXT (substrate chokepoint), Metlen (European capacity), and 5N Plus (broad critical minerals). Physical gallium can be purchased via Strategic Metals Invest or Rotterdam warehouse channels for qualified investors." },
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
          { id: "how-its-made", label: "How it\u2019s made" },
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
        {[
          { name: "GaAs substrates & devices", linked: false, href: "" },
          { name: "GaN devices (power + RF)", linked: false, href: "" },
          { name: "LED lighting", linked: false, href: "" },
          { name: "NdFeB magnets", linked: false, href: "" },
          { name: "Defense radar & EW", linked: false, href: "" },
          { name: "Satellite solar cells", linked: false, href: "" },
        ].map((item, i) => (
          <div key={i} onClick={() => { if (item.linked) window.location.href = item.href; }}
            style={{ display: "flex", alignItems: "center", padding: "1px 0 1px 12px", cursor: item.linked ? "pointer" : "default" }}>
            <span style={{ fontSize: 10, color: item.linked ? "#a09888" : "#4a4540", transition: "color 0.15s" }}
              onMouseEnter={e => { if (item.linked) e.currentTarget.style.color = "#ece8e1"; }}
              onMouseLeave={e => { if (item.linked) e.currentTarget.style.color = "#a09888"; }}>
              {item.name}
            </span>
            {item.linked && <span style={{ fontSize: 10, color: "#4a4540", marginLeft: 6 }}>&rarr;</span>}
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
            Gallium
          </h1>
          {/* Executive summary */}
          <div style={{ background: "#1a1816", border: "1px solid #252220", borderRadius: 10, padding: "24px 28px", marginBottom: 56 }}>
            <p style={{ fontSize: 20, letterSpacing: "0.1em", color: "#555", margin: "0 0 16px 0" }}>EXECUTIVE SUMMARY</p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {[
                "Trace element recovered as a byproduct of alumina refining from bauxite, and to a lesser extent from zinc smelter residues. Cannot be mined directly. Global resources are abundant \u2014 the constraint is refining infrastructure, not geology.",
                "The largest emerging demand vector is AI datacenters. Gallium is combined with other elements to form compound semiconductors \u2014 gallium arsenide (GaAs) and gallium nitride (GaN) \u2014 which are grown as crystals or thin films, then cut or deposited onto wafers that chips are built on. For AI datacenters specifically, every gigawatt of compute capacity needs thousands of GaN power chips to convert incoming electricity down to the low voltages the GPUs actually run at \u2014 a job GaN does with roughly 30% less energy lost than silicon. Beyond AI infrastructure, the same compound semiconductors go into 5G phone amplifiers, satellite solar cells, LED lighting, EV onboard chargers, and \u2014 critically \u2014 modern military radars (active-array radars, known as AESA), where no substitute exists.",
                "Global refined production is ~320t/yr. Roughly 290t is Chinese; ~15-30t is non-Chinese, almost entirely in Japan via Dowa Holdings. China holds ~1,000t/yr of installed primary capacity running at ~59% utilization \u2014 a deliberate overhang Beijing can tighten or release. The United States has not produced primary gallium since 1987.",
                "Price has risen from $298/kg to $2,269/kg since 2020 on western retail benchmarks, with a 9x spread between Chinese domestic ($245/kg) and western markets. The spread persists because export licensing prevents arbitrage.",
                "Demand accelerating from GaN power electronics (42% CAGR), defense radar modernization, and AI datacenter 800V power conversion architecture. Every major western demand vector is stable or growing.",
                "Four concurrent western primary production projects \u2014 Alcoa/JAGA Australia (100t/yr target 2028), Metlen Greece (50t/yr 2028), Rio Tinto/Indium Quebec (40t/yr post-2028), Korea Zinc/Nyrstar Tennessee (40t/yr 2029) \u2014 collectively represent a 10x increase from current non-Chinese supply. None resolves the structural dependency before 2028.",
                "The investable surface of the gallium supply chain is the rebuild itself \u2014 substrate converters with pricing power, emerging primary producers backed by sovereign capital, and GaN device makers capturing demand downstream.",
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

            {/* Card 1: Recovery */}
            <div style={{
              flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                01 &middot; RECOVERED FROM ALUMINA REFINERIES
              </p>
              <p style={{ fontSize: "11.5px", color: "#a09888", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Gallium is never mined on its own. It exists as a trace impurity (~50 ppm) inside bauxite. Refineries install ion-exchange resins that grab gallium out of the Bayer process liquid byproduct stream and turn it into 99.99%-pure metal. A smaller volume is recovered from zinc smelter waste.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHY IT&apos;S HARD</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Only 10-15% of contained gallium is captured. You cannot increase gallium output without processing more bauxite \u2014 supply is tied to aluminum production decisions, not gallium demand signals.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHO CAN DO IT</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 0 0", flex: 1 }}>
                ~20 alumina refineries globally. Vast majority in China. Japan, South Korea, Russia, and Slovakia have small capacity. Germany, Hungary, and Kazakhstan shut down 2013-2016. US stopped producing in 1987.
              </p>
              <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #222018" }}>
                <span style={{ fontSize: "12px", color: warmWhite, fontWeight: 500 }}>~600t</span>
                <span style={{ fontSize: "9px", color: dimText, marginLeft: "6px" }}>low-purity gallium recovered annually</span>
              </div>
            </div>

            {/* Card 2: Purification */}
            <div style={{
              flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                02 &middot; PURIFIED TO SEMICONDUCTOR GRADE
              </p>
              <p style={{ fontSize: "11.5px", color: "#a09888", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                The 99.99% metal is not pure enough for semiconductors. Chipmakers need 99.9999% or better \u2014 five to six more nines. Zone refining, vacuum distillation, and electrolytic refining remove final trace impurities. LED makers need 6N. Defense radar needs 7N. Next-gen chips need 8N.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHY IT&apos;S HARD</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Every additional &ldquo;nine&rdquo; is harder than the last. Requires proprietary process knowledge that cannot be bought off the shelf. China controls both primary extraction and high-purity refining.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHO CAN DO IT</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 0 0", flex: 1 }}>
                Chinese refiners (Vital Materials, Zhuzhou) dominate. Outside China: Dowa Holdings (Japan) leads; smaller capacity at 5N Plus (Canada), Indium Corporation (USA), PPM Pure Metals (Germany).
              </p>
              <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #222018" }}>
                <span style={{ fontSize: "12px", color: warmWhite, fontWeight: 500 }}>~320t</span>
                <span style={{ fontSize: "9px", color: dimText, marginLeft: "6px" }}>high-purity refined gallium per year</span>
              </div>
            </div>

            {/* Card 3: Wafers & Chips */}
            <div style={{
              flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                03 &middot; TURNED INTO WAFERS AND CHIPS
              </p>
              <p style={{ fontSize: "11.5px", color: "#a09888", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                High-purity gallium is combined with arsenic (GaAs) or nitrogen (GaN) and grown into crystals, then sliced into wafers. Specialty chemicals (trimethylgallium, triethylgallium) are used to grow thin GaN layers during chip manufacturing.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHY IT&apos;S HARD</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Different end products need different specifications. Industry is shifting from 4-inch to 6-inch and 8-inch wafers \u2014 a transition requiring new equipment throughout the chain. Defense-grade needs ultra-low defect density.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHO CAN DO IT</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 0 0", flex: 1 }}>
                AXT (Beijing, world&apos;s largest), Sumitomo Electric, Freiberger, IQE. GaN devices: Infineon, Wolfspeed, Navitas, Qorvo, Broadcom, MACOM. LEDs: Nichia dominates.
              </p>
              <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #222018" }}>
                <span style={{ fontSize: "12px", color: warmWhite, fontWeight: 500 }}>~$26B</span>
                <span style={{ fontSize: "9px", color: dimText, marginLeft: "6px" }}>downstream semiconductor products per year</span>
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
                <span style={{ color: "#ece8e1", fontWeight: 500 }}>The western supply picture is defined not by a single chokepoint like Umicore in the germanium chain, but by the absence of meaningful western primary production.</span> Four concurrent projects \u2014 Alcoa/JAGA (Australia), Metlen (Greece), Rio Tinto/Indium (Quebec), and Korea Zinc/Nyrstar (Tennessee) \u2014 are rebuilding the western supply chain from scratch, collectively targeting <span style={{ color: "#ece8e1", fontWeight: 500 }}>~230t/yr</span> of non-Chinese capacity by 2029 against ~800t of projected 2028 global demand.
              </p>
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

          {/* Aggregate summary boxes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 16 }}>
            {[
              { name: "Chinese Primary Supply", stat: "98-99% of global primary \u00b7 91% of global refined", detail: "~590 t/yr primary; ~290 t/yr refined. Chinese domestic $245/kg vs western retail $2,269/kg \u2014 9x spread." },
              { name: "Western Refined Supply", stat: "~15-30 t/yr \u00b7 ~9% of global refined supply", detail: "Dowa (Japan), 5N Plus (Canada), Indium Corp (US). The structural gap western projects aim to close." },
              { name: "Global Supply", stat: "~320 t/yr refined \u00b7 ~600 t/yr primary", detail: "~280t gap between primary and refined reflects conversion losses. Refined is the figure that matters." },
            ].map((agg, i) => (
              <div key={i} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: "14px 18px" }}>
                <p style={{ fontSize: 12.5, color: warmWhite, fontWeight: 500, margin: "0 0 6px 0" }}>{agg.name}</p>
                <p style={{ fontSize: 10.5, color: "#a09888", margin: "0 0 6px 0", lineHeight: 1.4 }}>{agg.stat}</p>
                <p style={{ fontSize: 10, color: muted, margin: 0, lineHeight: 1.4 }}>{agg.detail}</p>
              </div>
            ))}
          </div>

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
                { label: "SUBSTRATE MANUFACTURER", ideas: [
                  { id: "axt", name: "AXT, Inc.", ticker: "AXTI \u00b7 Nasdaq", category: "Manufacturing / integration", line1: "World\u2019s largest producer of compound semiconductor wafers \u2014 the downstream chokepoint converting refined gallium into GaAs and InP substrates." },
                ] },
                { label: "DEVICE MANUFACTURER", ideas: [
                  { id: "navitas", name: "Navitas Semiconductor", ticker: "NVTS \u00b7 Nasdaq", category: "Technology", line1: "Pure-play GaN power semiconductor manufacturer \u2014 the downstream demand proxy for AI datacenter 800V power conversion and EV onboard chargers." },
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
                { date: "April 30, 2026", desc: "AXT Q1 2026 earnings release" },
                { date: "May 5, 2026", desc: "Navitas Q1 2026 earnings release" },
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
                { date: "H2 2026", desc: "GlobalFoundries US GaN manufacturing availability (Navitas partnership)" },
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
