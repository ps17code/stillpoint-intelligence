"use client";
import React, { useMemo, useState } from "react";
import TreeMap from "@/components/TreeMap";
import NodeModal from "@/components/NodeModal";
import { buildGermaniumGeometry, computeGermaniumSvgWidth } from "@/lib/treeGeometry";
import germaniumChainJson from "@/data/germanium-chain.json";
import germaniumNodesJson from "@/data/germanium-nodes.json";
import type { GermaniumChain, NodeData } from "@/types";

const chainData = germaniumChainJson as unknown as {
  layerConfig: Record<string, { displayFields: { key: string; label: string }[] }>;
  GERMANIUM_CHAIN: GermaniumChain;
};
const allNodes = germaniumNodesJson as unknown as Record<string, NodeData>;

export default function GermaniumInputPage() {
  const geChain = chainData.GERMANIUM_CHAIN;
  const rawW = useMemo(() => computeGermaniumSvgWidth(geChain), []);
  const rawGeo = useMemo(() => buildGermaniumGeometry(geChain, rawW / 2, 80), []);
  const rawH = rawGeo.outputNode.cy + 120;
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [treeExpanded, setTreeExpanded] = useState(false);
  const [soWhatOpen, setSoWhatOpen] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("thesis");
  const [activeIdea, setActiveIdea] = useState<string | null>(null);
  const lc = chainData.layerConfig as Record<string, { displayFields: { key: string; label: string }[] }>;

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
      { label: "Market cap", value: "€4.1B" },
      { label: "Revenue", value: "€3.6B" },
      { label: "EBITDA", value: "€847M" },
      { label: "Price", value: "€17.26" },
      { label: "12mo", value: "+131%" },
    ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Umicore operates the only facility in the western world that produces fiber-grade germanium tetrachloride at commercial scale. GeCl\u2084 is the volatile liquid deposited into glass preforms to control the refractive index of fiber optic cable \u2014 without it, light doesn’t travel through fiber. Umicore’s Olen, Belgium plant processes approximately 40-50 tonnes of germanium per year, refining it to 8N purity (99.999999%) and shipping the resulting GeCl\u2084 to every major western and Japanese fiber manufacturer: Corning, Prysmian, Fujikura, Sumitomo Electric, Shin-Etsu." },
          { text: "Two other western entities produce GeCl\u2084 \u2014 Teck Resources at Trail, BC and Indium Corporation \u2014 but neither operates at the scale or purity tier required for commercial fiber. Teck’s output is defense-oriented. Indium Corporation is military-grade niche. 5N Plus, despite its germanium refining expertise, does not produce GeCl\u2084 at all \u2014 it serves space solar and IR optics, an entirely different branch of the supply chain." },
          { text: "China’s export controls (licensing regime from August 2023, outright US ban from December 2024) have made Umicore’s position structural rather than discretionary. There is no alternative western source for fiber-grade GeCl\u2084 at the volumes the industry requires. Umicore is the chokepoint." },
          { text: "The company is a diversified materials technology group \u2014 Catalysis (\u20AC450M EBITDA), Recycling (\u20AC371M EBITDA), Specialty Materials (\u20AC108M EBITDA), and the troubled Battery Materials Solutions division (-\u20AC21M EBITDA). The germanium business is buried inside Specialty Materials alongside cobalt and metal deposition. The market prices Umicore as a struggling battery conglomerate at 5.74x EV/EBITDA. The germanium thesis is invisible in the headline numbers." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "Three interlocking revenue channels create margins that are structurally wider than the segment-level numbers suggest." },
          { title: "Direct GeCl\u2084 sales", text: "Umicore sells fiber-grade GeCl\u2084 to preform manufacturers at prices linked to western germanium market pricing. With germanium at $8,597/kg \u2014 up from $1,340/kg in early 2023 \u2014 this is the primary revenue driver. But input costs don’t track spot symmetrically, because of the second channel." },
          { title: "Closed-loop tolling", text: "Fiber manufacturing wastes a large fraction of the germanium deposited during preform fabrication. Umicore contractually recovers this manufacturing scrap from its customers, recycles it at Olen, and sells it back as fresh GeCl\u2084. Over 50% of Umicore’s germanium input comes from recycled scrap through these arrangements. The tolling fee is a processing charge \u2014 largely fixed regardless of germanium spot price. When germanium surges from $1,340 to $8,597, Umicore’s cost on the recycled half barely moves while output pricing follows the market. The customer cannot take their scrap elsewhere because no other western facility can process it at the required purity. This creates a recurring, self-renewing revenue stream with expanding margins in a rising price environment." },
          { title: "The China-Belgium arbitrage", text: "The Stimson Center documented that in 2024, US germanium imports from China fell by ~5,900 kg while Belgian imports from China rose by ~6,150 kg \u2014 the combined volume staying essentially constant. Germanium is being routed through Belgium, purchased from licensed Chinese exporters at prices closer to the Chinese domestic level (~$2,000/kg), processed at Olen, and sold into western markets at $7,000-8,500/kg. Umicore is the natural and likely the only entity positioned to execute this flow. Even at $3,000-4,000/kg input cost (reflecting license premiums and transport), the spread to western output pricing is 2-3x." },
          { text: "The blended cost structure is asymmetric: roughly 25-35% of input is exposed to spot pricing (primary feedstock, Chinese imports), while 65-75% is insulated (recycled tolling scrap, internal process recovery). But 100% of output pricing tracks western market levels. Every price increase widens the spread." },
          { title: "The GASIR® hedge", text: "Umicore simultaneously developed GASIR® chalcogenide glass, which reduces germanium consumption in IR optics by 80%. IR optics is germanium’s second-largest end use. With over 1.5 million iDLC-coated GASIR® lenses shipped worldwide \u2014 BMW night vision, firefighting, security, medical \u2014 this technology is already at production scale. If germanium prices rise, Umicore profits from GeCl\u2084 sales. If germanium demand in IR optics faces substitution pressure, it’s Umicore’s own technology doing the substituting. Either direction, Umicore captures value." },
        ] },
        { label: "Key numbers", items: [
          { title: "Specialty Materials FY25", text: "\u20AC558M revenue (+4% YoY), \u20AC108M adj. EBITDA (+11%), 19.4% margin. Management described “significant earnings growth in Electro-Optic Materials, fueled by strong demand“ and germanium solutions revenue as “much higher.“ The segment’s EBITDA growth was driven specifically by germanium \u2014 with Metal Deposition Solutions slightly declining." },
          { title: "Germanium revenue estimate", text: "Umicore doesn’t break it out. Working from ~45 tonnes input, ~86 tonnes GeCl\u2084 output, and estimated pricing, the germanium business likely generates $100-130M at FY25 pricing. At current elevated pricing ($4,000-5,000/kg GeCl\u2084 equivalent), this could already be $345-430M \u2014 approaching the entire Specialty Materials segment. With DRC ramp adding volume, the germanium business alone could reach $500-700M annually by 2028." },
          { title: "EBITDA margins on germanium", text: "are almost certainly above the 19.4% segment average. The tolling/recycling cost structure on 50%+ of input suggests 35-45% EBITDA margins on the recycled portion. Blended across all germanium activity: likely 25-35%." },
          { title: "Foundation businesses combined", text: "\u20AC929M EBITDA (Catalysis \u20AC450M + Recycling \u20AC371M + Specialty Materials \u20AC108M). Sell-side SOTP valuations apply 7-9x to these individually, implying \u20AC6.5-8.4B in foundation EV \u2014 against a current group EV of \u20AC5.5B." },
          { title: "DRC Big Hill", text: "Exclusive offtake on all germanium from the 14M-tonne slag heap. First concentrates shipped October 2024. 30t/yr plant nameplate, targeting 30% of global supply. Additive to current 40-50t throughput \u2014 potentially taking Umicore to 60-80+ tonnes." },
          { title: "Balance sheet", text: "\u20AC1.55B gross cash, \u20AC1.35B net debt, 1.60x leverage. \u20AC524M free operating cash flow in FY25. \u20AC1.1B in undrawn credit facilities. \u20AC0.50/share dividend floor (~2.9% yield)." },
          { title: "FY26 guidance", text: "Management expects “sustained top-line momentum in Specialty Materials, underpinned by good demand for germanium products.“ First time management has explicitly named germanium as a forward demand driver." },
        ] },
        { label: "What to watch", items: [
          { title: "Battery Materials resolution", text: "The \u20AC1.6B impairment and shift to “value recovery“ mode raise the real possibility of divestiture. CFRA Research has flagged this as a potential outcome. Kepler Cheuvreux identifies it as a “major upside risk“ that could fundamentally alter the valuation framework. If Battery Materials is sold or separated, the foundation businesses get valued on their own merits. Johnson Matthey’s Catalyst Technologies divestiture at 13.3x EV/EBITDA provides the precedent multiple. A re-rating from 5.74x to 7-8x on foundation businesses implies 25-40% equity upside before any germanium-specific revaluation. This is the most likely near-term catalyst." },
          { title: "DRC ramp-up pace", text: "Each incremental 10 tonnes of germanium throughput at current pricing adds an estimated $40-50M in revenue. Whether Big Hill reaches 15-20t/yr by 2027 or takes longer directly impacts the growth trajectory. The hydrometallurgical extraction of germanium from century-old slag is technically complex and the DRC imposes operational realities." },
          { title: "EU CRM Act germanium projects", text: "Both EU-selected germanium projects under the Critical Raw Materials Act \u2014 GePETO and ReGAIN \u2014 are Umicore-led. No other company holds a germanium CRM Act project. These grant streamlined permitting and EU funding access for expanding germanium recycling capacity." },
          { title: "Olen capacity expansion", text: "Any announcement on expanding the Olen facility’s germanium processing capacity would be material. Currently ~40-50t/yr input \u2014 if DRC volumes ramp as planned, Umicore may need to invest in additional processing capability." },
          { title: "Germanium price reversal risk", text: "If China relaxes export controls, germanium could revert toward $2,000-3,000/kg. The tolling model provides partial insulation (recycling fee income is price-independent), but direct GeCl\u2084 revenue compresses. At $2,000/kg, the germanium business returns to pre-2023 levels and becomes a steady but unexciting contributor." },
          { title: "Single-site concentration", text: "Virtually all western GeCl\u2084 supply runs through one facility in Olen. A fire, environmental incident, or prolonged shutdown would disrupt the entire western fiber supply chain simultaneously. There is no backup." },
        ] },
        { label: "Investment angle", items: [
          { text: "Umicore at 5.74x EV/EBITDA is the value play in the germanium chain. The market prices it as a battery conglomerate in distress. What the market misses: the foundation businesses (\u20AC929M EBITDA) are growing, cash-generative, and \u2014 in the case of germanium \u2014 positioned at the most important chokepoint in the western supply chain." },
          { text: "The catalyst is Battery Materials resolution. If management divests or separates the division, foundation businesses get valued independently. Johnson Matthey’s Catalyst Technologies divestiture at 13.3x EV/EBITDA provides the precedent. A re-rating from 5.74x to 7-8x on foundation businesses implies 25-40% equity upside before any germanium-specific revaluation. CFRA, Kepler Cheuvreux, and Deutsche Bank have all flagged divestiture as a possibility." },
          { text: "The variant perception: most investors who look at Umicore see a battery company with commodity exposure. The germanium angle is invisible in the financials because it’s buried inside Specialty Materials alongside cobalt and metal deposition. An investor who understands the GeCl\u2084 chokepoint, the tolling arbitrage, and the DRC ramp is seeing a business the sell-side isn’t modeling correctly. The germanium revenue at current pricing could already be approaching the entire Specialty Materials segment total \u2014 but no analyst is publishing that estimate." },
          { text: "The \u20AC0.50/share dividend (~2.9% yield), \u20AC524M free cash flow, and 1.60x leverage provide downside cushion. The stock trades near the low end of sell-side targets (\u20AC15.50-23.90 range). If you believe germanium scarcity persists and Battery Materials resolves, this is the most asymmetric risk/reward in the chain. If germanium prices collapse and Battery Materials continues to drag, the downside is limited by the foundation business floor." },
          { text: "Euronext Brussels-listed. Liquid for institutional investors. No ADR, but accessible through European brokerage channels." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Germanium Chain \u00b7 Layer: Refined Materials / Conversion Sources: Umicore FY25 Results (Feb 2026), AlphaSense Company Primer (Apr 2026), Stimson Center (Apr 2025), Fastmarkets, sell-side research (Deutsche Bank, Equita, KBC Securities, Kepler Cheuvreux, CFRA, Jefferies, Degroof Petercam, Auerbach Grayson, ING). Revenue estimates are Stillpoint Intelligence proprietary calculations. Not investment advice.",
    },
    "5n-plus": {
      name: "5N Plus",
      ticker: "VNP \u00b7 TSX",
      category: "Refined Materials / Components",
          metrics: [
      { label: "Market cap", value: "C$3.2B" },
      { label: "Revenue", value: "$391M" },
      { label: "EBITDA", value: "$92.4M" },
      { label: "Price", value: "C$35.64" },
      { label: "12mo", value: "+596%" },
    ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "5N Plus is the only company in the western world that takes raw germanium and turns it into a finished space solar cell. The chain runs end to end: refined germanium metal \u2192 zone-refined crystal \u2192 sliced wafers \u2192 epitaxial III-V semiconductor layers \u2192 completed multi-junction solar cell. This vertical integration lives across three sites \u2014 Montreal (refining), St. George, Utah (wafer production), and Heilbronn, Germany (AZUR SPACE, solar cell manufacturing)." },
          { text: "AZUR SPACE Solar Power, acquired in 2021 for \u20AC73-79M, is the structural heart of the thesis. Founded in 1964, AZUR has delivered over 15 million space-qualified solar cells powering more than 700 missions \u2014 Hubble, Rosetta, Mars Express, Europa Clipper, JUICE, Galileo, Meteosat, Chandrayaan-3 \u2014 without a single failure or anomaly. Its cells power satellites in every Earth orbit and spacecraft from Mercury to Jupiter." },
          { text: "5N Plus also supplies germanium wafers and blanks for IR optics \u2014 thermal imaging lenses for military drones, targeting systems, and soldier-worn equipment. This is a separate market from Umicore’s fiber optics business. The two companies sit on parallel branches of the germanium supply chain: Umicore converts germanium to GeCl\u2084 for fiber; 5N Plus converts germanium to wafers and cells for space and defense. Neither competes with the other. Both pull on the same constrained global supply." },
          { text: "The second segment, Performance Materials ($105.7M revenue, 42.4% gross margin), produces bismuth-based pharmaceutical ingredients, specialty chemicals, and engineered powders \u2014 no germanium exposure, but provides cash flow diversification and margin stability." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { title: "Space solar \u2014 the growth engine", text: "The satellite industry was built around 20-30 large geostationary satellites per year, each needing a few thousand III-V multi-junction cells on germanium substrates. LEO mega-constellations have shattered that rhythm. OneWeb, Amazon Kuiper, Telesat Lightspeed, Space Development Agency military mesh networks \u2014 these programs require equivalent cell area output every two to three weeks, not every year. AZUR, alongside Spectrolab (Boeing) and SolAero (Rocket Lab), forms a three-player western oligopoly supplying this demand." },
          { text: "AZUR’s specific relationships include a ten-year exclusive teaming arrangement with Sierra Space for DreamChaser spacecraft solar technology, multi-year supply agreements with SSL/Maxar, and confirmed deliveries for India’s Chandrayaan-3 lunar mission. Capacity expansion has been aggressive: +35% in 2024, +30% in 2025, +25% announced for 2026 \u2014 each time leveraging available onsite space at Heilbronn with limited new capital investment. Even with this expansion, the backlog is maxed out." },
          { title: "The SpaceX exception", text: "Starlink \u2014 over 10,000 satellites \u2014 uses silicon solar cells, not III-V germanium-based cells. SpaceX deliberately chose cheaper, more abundant silicon and compensated for lower efficiency by making panels larger. This only works because SpaceX controls its own launch costs. Every other constellation operator continues to rely on III-V cells on germanium substrates because they need maximum power per kilogram. For missions beyond LEO (deep space, lunar, Mars), silicon is not viable \u2014 radiation degradation makes germanium-based cells the only option." },
          { title: "IR optics and defense", text: "Germanium blanks and finished optics for thermal imaging \u2014 every LWIR camera requires a germanium lens. Steady, price-insensitive demand driven by defense procurement cycles. The DoD is explicitly funding 5N Plus’s expansion to secure this supply chain domestically." },
          { title: "The DoD investment", text: "Two separate DPA Title III awards totaling $32.5M. The April 2024 award ($14.4M) funds wafer manufacturing upgrades at St. George, Utah for space-qualified germanium substrates. The January 2026 award ($18.1M) is more significant: it expands zone refining capacity for germanium metal sevenfold \u2014 from roughly 3 tonnes to over 20 tonnes annually. This creates domestic refining capacity at scale and reduces dependence on imported feedstock. At 20+ tonnes/year, 5N Plus could become a germanium metal supplier to third parties, not just an internal consumer. The DoD framed this as addressing “a capability bottleneck that affects some of our most critical weapons platforms across all the military Services.“" },
        ] },
        { label: "Key numbers", items: [
          { title: "FY25 (full year ended December 31, 2025)", text: "Revenue $391.1M (+35% YoY). Adjusted EBITDA $92.4M (+73%), exceeding guidance. Net earnings $50.6M, up from $14.7M. Adjusted gross margin $131.8M at 33.7% of sales." },
          { title: "Specialty Semiconductors segment", text: "$285.4M revenue (+41%), $70.1M EBITDA (+59%), 30.8% gross margin. This contains all germanium-linked revenue \u2014 AZUR cells, germanium wafers, IR substrates, plus CdTe thin-film solar compounds. AZUR likely contributes $100-130M based on pre-acquisition revenue of \u20AC50M+ and cumulative 90%+ capacity expansion since 2021." },
          { title: "Backlog", text: "$394.9M representing 353 days of annualized revenue \u2014 essentially a full year of visibility already booked. Backlog increased 42 days sequentially in Q4 2025. Over two-thirds of bookings are in Specialty Semiconductors." },
          { title: "Balance sheet", text: "Net debt collapsed from $100.1M to $50.3M. Leverage at 0.54x \u2014 essentially clean. No dividend (reinvesting in growth)." },
          { title: "FY26 guidance", text: "$100-105M adjusted EBITDA, with higher contribution in second half. Revenue growth expected to outpace EBITDA growth due to rising input and operating costs." },
          { title: "Germanium-linked revenue estimate", text: "AZUR $100-130M, wafers and IR optics $30-50M, total $130-180M \u2014 roughly one-third of the company. By 2029-2030, if AZUR capacity expansion continues and DoD refining ramps, germanium-linked revenue could reach $350-490M \u2014 potentially half or more of the company." },
          { title: "Valuation", text: "C$3.2B market cap at 44x trailing earnings. Stock up ~600% in twelve months. At $130-150M EBITDA in FY27 (which capacity trajectory supports), the current valuation represents ~17-20x forward EBITDA \u2014 expensive for a materials company, potentially reasonable for a vertically integrated semiconductor business with defense backing and 30%+ organic growth." },
        ] },
        { label: "What to watch", items: [
          { title: "AZUR capacity execution", text: "The company has announced 25% additional capacity for 2026 on top of 30% in 2025 and 35% in 2024. Each expansion must bring equipment online, qualify new production lines, and deliver at AZUR’s zero-failure quality standard. A production stumble or quality issue \u2014 even a single satellite power system failure \u2014 would be material to the thesis and the backlog." },
          { title: "Silicon substitution risk", text: "SpaceX proved mega-constellations can run on silicon. If Amazon’s Kuiper or future operators follow that approach as launch costs fall with Starship and New Glenn, AZUR’s addressable market narrows to defense, science, GEO, and deep space \u2014 still substantial, but not the hypergrowth story. Watch for Kuiper’s solar cell technology selection as a signal." },
          { title: "Feedstock security", text: "5N Plus doesn’t control its own germanium supply the way Umicore does. Input comes from Teck (Trail by-product), recycled streams, and Chinese imports under export controls. The $18.1M DoD refining award addresses this by building 20t/yr domestic capacity, but that takes 2-3 years to reach full scale. A supply disruption at Teck or tightening of Chinese licenses could constrain input in the interim." },
          { title: "CEO transition", text: "Richard Perron was appointed President effective November 2025 and assumes CEO role from Gervais Jacques in May 2026. Jacques becomes Executive Chairman. Watch for strategic continuity \u2014 the AZUR acquisition and capacity expansion strategy was Jacques’ vision." },
          { title: "Valuation compression risk", text: "At 44x trailing earnings and 600% stock appreciation in twelve months, any execution stumble triggers a sharp correction. The backlog provides cushion, but the multiple leaves minimal margin for error. The stock is priced for the company 5N Plus is becoming, not the company it was twelve months ago." },
          { title: "Constellation demand duration", text: "The $395M backlog says at least two more years of visibility. The question is whether space solar follows the trajectory of terrestrial solar \u2014 a multi-decade buildout that consistently exceeded forecasts \u2014 or whether silicon substitution and launch cost reductions cap the III-V market earlier. For the germanium thesis, 5N Plus and Umicore are complementary positions: Umicore captures fiber optics value, 5N Plus captures space solar and defense value. Together they cover three of the four major germanium end markets." },
        ] },
        { label: "Investment angle", items: [
          { text: "The thesis is validated \u2014 the question is whether 44x earnings leaves any room. 5N Plus has re-rated from C$5 to C$35 in twelve months. The market has recognized the AZUR SPACE transformation, the DoD funding, and the satellite constellation demand wave. Buying at these levels means paying for the future, not the present." },
          { text: "The variant perception for bulls: the backlog ($395M, 353 days of revenue) provides more forward visibility than the multiple implies. If EBITDA reaches $130-150M by FY27 \u2014 which the 25-35% annual capacity expansion trajectory supports \u2014 the stock trades at roughly 17-20x forward EBITDA, which is reasonable for a defense-backed semiconductor business with 30%+ organic growth. The comparison isn’t other materials companies \u2014 it’s defense-adjacent semiconductor businesses, which trade at similar or higher multiples." },
          { text: "The variant perception for bears: SpaceX proved you can build a mega-constellation on silicon solar cells. If Kuiper or other operators follow suit, AZUR’s addressable market narrows. The DoD refining investment takes 2-3 years to reach capacity. Feedstock dependence on Teck and Chinese imports is a real vulnerability. And at 44x, even modest deceleration could trigger a significant drawdown." },
          { text: "The CEO transition (Jacques to Perron, May 2026) is a governance watch \u2014 the AZUR strategy was Jacques’ vision. Strategic continuity post-transition matters." },
          { text: "TSX-listed, increasingly liquid. NASDAQ cross-listing (BMM) provides US investor access. No dividend \u2014 all cash reinvested in growth. For investors who believe the space solar demand wave has years to run and germanium scarcity persists, 5N Plus is the growth vehicle. For those who prefer to wait for a better entry, the backlog means the company isn’t going anywhere \u2014 patience is a viable strategy." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Germanium Chain \u00b7 Layer: Refined Materials / Components Sources: 5N Plus FY25 Results (Feb 2026), DoD DPA Title III awards (Apr 2024, Jan 2026), AZUR SPACE corporate disclosures, SpaceNews, QYResearch. Revenue projections are Stillpoint Intelligence estimates. Not investment advice.",
    },
    "lightpath": {
      name: "LightPath Technologies",
      ticker: "LPTH \u00b7 NASDAQ",
      category: "Technology / Substitution",
          metrics: [
      { label: "Market cap", value: "$700M" },
      { label: "Revenue", value: "$37.2M" },
      { label: "EBITDA", value: "-$7.7M" },
      { label: "Price", value: "$12.83" },
      { label: "12mo", value: "+285%" },
    ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "LightPath is the germanium substitution play. The company holds an exclusive license from the US Naval Research Laboratory for BlackDiamond chalcogenide glass \u2014 a proprietary material that can replace germanium in infrared optics while delivering comparable or superior performance. IR optics accounts for roughly 24% of global germanium demand. Every thermal camera in military service \u2014 drones, targeting pods, armored vehicle sights, soldier helmet-mounted systems \u2014 traditionally requires a germanium lens. LightPath’s BlackDiamond technology makes that germanium optional." },
          { text: "The company has transformed over the past two years from a small infrared component supplier into a vertically integrated camera and imaging systems provider. The acquisition of G5 Infrared (closed February 2025) added high-end cooled infrared camera manufacturing capability. LightPath now controls the full stack: proprietary glass formulation, lens molding, optical coatings, and finished camera assembly. This is the same vertical integration logic that makes 5N Plus and Umicore structurally interesting \u2014 but applied to the demand destruction side of the germanium equation rather than the supply side." },
          { text: "The strategic position is unusual: LightPath benefits from germanium scarcity (which drives customers toward germanium-free alternatives) while also benefiting from defense spending growth (which drives thermal imaging demand regardless of material choice). China’s export controls are the accelerant \u2014 every defense prime reassessing their germanium supply chain is a potential BlackDiamond customer." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "LightPath’s business model has shifted from selling individual lenses and optical components (low ASPs, commodity pricing) to selling complete infrared camera systems and imaging assemblies (high ASPs, system-level margins). This transition is visible in the numbers: the Assemblies and Modules segment grew 436% in Q1 FY2026 to $5.86M, contributing 39% of total revenue. Average selling prices have increased by orders of magnitude as the company moves up the value chain." },
          { text: "The revenue streams now include three layers. First, BlackDiamond glass and germanium-free optical components sold to defense primes and other camera manufacturers who are redesigning their systems away from germanium dependency. Second, complete infrared camera systems \u2014 the G5 product line includes cooled and uncooled cameras for military, security, public safety, and industrial applications. The MANTIS broadband/multispectral camera at ~$30,000 per unit targets mid-tier defense and public safety markets. Third, engineering development and qualification contracts \u2014 the $2.2M L3Harris order for the Navy’s SPEIR program and the $4.8M initial qualification order from a new defense customer represent the front end of multi-year production programs where qualification leads to volume orders." },
          { text: "The F-35 contract is the most significant validation. LightPath supplies BlackDiamond-based IR optics for the F-35’s threat detection and situational awareness system. This is the world’s highest-profile combat aircraft program. Having germanium-free optics qualified on the F-35 creates a reference design that other defense programs can follow \u2014 reducing the qualification risk that normally slows adoption of new materials in defense applications." },
          { text: "The drone/UAV market is the emerging volume play. The $8M strategic investment from Ondas Holdings and Unusual Machines (drone and drone component companies) was specifically to support LightPath’s expansion into uncooled infrared solutions for FPV drones and autonomous systems. This market barely existed three years ago \u2014 the proliferation of drone warfare in Ukraine and the Middle East has created explosive demand for compact, affordable thermal imaging on small platforms." },
        ] },
        { label: "Key numbers", items: [
          { text: "Q1 FY2026 (quarter ended September 30, 2025) showed the inflection: $15.1M revenue, up 79% year-over-year. Adjusted EBITDA turned positive for the first time at $0.4M, compared to a -$0.2M loss in the prior year quarter. The backlog surged to approximately $90M \u2014 quadrupling from previous quarters \u2014 with over two-thirds from systems and subsystems rather than components." },
          { text: "Major orders in the pipeline: $18.2M IR camera purchase order for delivery in calendar year 2026, plus a $22.1M follow-on for calendar year 2027, from a single global technology customer. A $4.9M order for cooled infrared cameras. A $4.8M public safety order. Combined with the G5 acquisition (which generated $15M+ in calendar year 2024 revenue), management projects the combined companies will generate $51M in revenue in the twelve months following the acquisition close." },
          { text: "The company carries $11.5M in cash, $5.5M in total debt, and a low D/E ratio of 0.31. The balance sheet is clean but cash burn remains meaningful at -$9.6M TTM free cash flow. This is an investment-phase company \u2014 the question is whether the backlog converts to cash flow before the cash position becomes a constraint." },
          { text: "Market cap sits at roughly $700M against TTM revenue of $37.2M and TTM net loss of -$14.9M. This is priced for the inflection, not for current profitability." },
        ] },
        { label: "What to watch", items: [
          { text: "The $40.3M combined camera order ($18.2M + $22.1M) from the unnamed global technology customer represents the single largest commercial commitment in LightPath’s history. Delivery execution in CY2026-2027 will determine whether the company can sustain the revenue ramp and reach sustained profitability." },
          { text: "The path to profitability runs through gross margin expansion. Management targets 35-40% gross margins as camera systems scale. Q1 FY2026 showed the first positive adjusted EBITDA \u2014 whether this holds and expands over the next 2-3 quarters will signal whether the business model transition is working." },
          { text: "Defense qualification cycles are the long game. Each new program that qualifies BlackDiamond as a germanium replacement creates a multi-year production tail. The F-35, Navy SPEIR, and the unnamed defense customer represent three separate programs in various stages of qualification. Watch for additional program wins \u2014 each one validates the substitution thesis and de-risks the revenue base." },
          { text: "The competitive landscape matters. Umicore’s GASIR® is the primary alternative germanium-reduction technology for IR optics, and Umicore has far more resources and market presence. GASIR® reduces germanium content by 80% rather than eliminating it entirely \u2014 different approach, same customer problem. The two technologies may coexist (BlackDiamond for full germanium elimination in defense, GASIR® for cost reduction in high-volume automotive), but LightPath needs to establish its beachhead in defense before GASIR® or other alternatives expand into the same programs." },
          { text: "If germanium prices fall \u2014 whether from relaxed Chinese export controls, successful DRC ramp-up, or demand destruction \u2014 the urgency to adopt germanium-free alternatives diminishes. LightPath’s thesis is strongest in a sustained scarcity environment. A return to $2,000/kg germanium would remove much of the supply chain motivation that is currently driving BlackDiamond adoption." },
        ] },
        { label: "Investment angle", items: [
          { text: "LightPath is a micro-cap speculation on germanium substitution in defense optics. At ~$700M market cap, it’s the smallest company in the germanium ideas section by a wide margin. The revenue inflection is real ($15.1M quarterly, +79% YoY) and the backlog ($90M) provides visibility, but the company is still loss-making on a TTM basis and the path to sustained profitability is narrow." },
          { text: "The most compelling investment angle is the F-35 program validation. Having BlackDiamond optics qualified on the world’s highest-profile combat aircraft creates a reference design that other defense programs can follow. Each new program qualification creates a multi-year production tail. If LightPath accumulates 5-10 qualified programs over the next 2-3 years, the revenue base becomes sticky and defensible." },
          { text: "The drone/UAV angle is the volume play. The $8M investment from Ondas Holdings and Unusual Machines targets uncooled IR solutions for FPV drones \u2014 a market that barely existed three years ago and is growing explosively with the proliferation of drone warfare. If LightPath captures meaningful share of the drone thermal imaging market, the revenue potential dwarfs the current defense component business." },
          { text: "The risk is straightforward: this is a pre-profit company competing against Umicore’s GASIR® (backed by a \u20AC4B conglomerate) and established germanium optics suppliers. The BlackDiamond license from the Naval Research Laboratory is exclusive, which provides IP protection, but LightPath needs to execute on manufacturing scale, customer qualification, and cost reduction simultaneously. Any stumble delays the profitability inflection and extends the cash burn." },
          { text: "NASDAQ-listed, liquid for a micro-cap. High beta \u2014 the stock moves aggressively on news. Suitable for risk-tolerant investors with a 2-3 year horizon who believe germanium scarcity accelerates defense adoption of germanium-free alternatives. Not suitable as a core position." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Germanium Chain \u00b7 Layer: Technology / Substitution Sources: LightPath FY25 and Q1 FY26 earnings releases, SEC filings, defense contract announcements, analyst coverage. Not investment advice.",
    },
    "blue-moon": {
      name: "Blue Moon Metals",
      ticker: "MOON \u00b7 TSXV / NASDAQ",
      category: "Mining / Primary Supply",
          metrics: [
      { label: "Market cap", value: "C$885M" },
      { label: "Revenue", value: "Pre-revenue" },
      { label: "EBITDA", value: "—" },
      { label: "Price", value: "C$11.63" },
      { label: "12mo", value: "+336%" },
    ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Blue Moon Metals acquired the Apex mine \u2014 the only site in the United States with a documented history of primary germanium and gallium production. Every other western germanium source produces it as a by-product of zinc smelting (Teck), recycling (Umicore), or slag processing (STL/DRC). Apex is the only deposit where germanium and gallium were the primary target minerals." },
          { text: "The mine operated in the mid-1980s under Musto Explorations and again in the 1990s under Hecla Mining, when it was the primary US producer of both germanium and gallium. It shut down when germanium prices made primary mining uneconomic. At today’s $8,500+/kg, the economics are fundamentally different \u2014 the same ore that couldn’t justify extraction at $500/kg is now potentially worth 17x more per unit of contained germanium." },
          { text: "Blue Moon is not just a single-mine story. The company is building a western US “hub and spoke“ critical minerals platform: the Apex mine (germanium/gallium) in Utah, the Blue Moon mine (zinc/copper/gold/silver) in California with underground development underway, the Springer metallurgical complex and tungsten mine in Nevada for processing capacity, and logistical connections to Teck’s Trail Operations smelter in BC. The Apex acquisition adds germanium and gallium to a portfolio that already covers zinc, copper, tungsten \u2014 all USGS-listed critical minerals." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "It doesn’t yet \u2014 Blue Moon is pre-revenue and pre-production. The value today is entirely in the resource, the strategic positioning, and the institutional backing." },
          { text: "The Apex deposit sits in a series of breccia pipes (collapsed geological structures) that concentrate germanium and gallium at grades 10-100x higher than most comparable deposits worldwide. A 2018 historical estimate by Ken Krahulec put the resource at 1 million tonnes grading 0.087% germanium, 0.033% gallium, 1.8% copper, and 41 g/t silver. The in-situ value per tonne is comparable to 0.5 oz/t gold ore at current metal prices. That 1Mt resource contains roughly 870 tonnes of germanium \u2014 significant against a global annual production of ~230 tonnes." },
          { text: "At Apex’s historical peak production rate, the mine yielded approximately 2.6 tonnes of germanium per year from 10,270 tonnes of ore. At $8,500/kg, 2.6 tonnes of germanium alone would generate roughly $22M annually \u2014 before copper, gallium, and silver credits. If modern mining and processing techniques could scale throughput to 5-10 tonnes of germanium per year, the revenue potential reaches $43-85M from germanium alone. But these are theoretical numbers \u2014 no modern feasibility study exists yet." },
          { text: "The plan is to process Apex ore at the Springer metallurgical complex in Nevada, which Blue Moon acquired in February 2026. Springer has existing tailings management, water systems, and permits \u2014 significantly reducing the capital and permitting timeline compared to a greenfield facility. Teck’s Trail smelter provides downstream refining capability for the concentrates." },
          { text: "Important caveat: the historical resource estimates are not compliant with current NI 43-101 standards. Blue Moon needs to complete modern drilling, updated geological modeling, metallurgical test work, and a new technical report before these numbers can be treated as bankable reserves. The company is in the data compilation and underground re-entry permitting phase. A bulk sample program will be needed to validate the metallurgy." },
        ] },
        { label: "Key numbers", items: [
          { text: "The resource: 1Mt at 0.087% Ge, 0.033% Ga, 1.8% Cu, 41 g/t Ag (historical, not NI 43-101 compliant). Contained germanium: ~870 tonnes. Contained gallium: ~330 tonnes. Hecla’s 1989 feasibility study reported a narrower reserve of 230,200 tonnes at 0.100% Ge, 0.046% Ga, and 1.6% Cu." },
          { text: "The shareholder base: Oaktree Capital Management, Hartree Partners (partner with the US government on a $12B critical metals stockpile program), Teck Resources (8% equity from the Apex transaction), Wheaton Precious Metals, Altius Minerals, Baker Steel Resources Trust, and LNS. This is a seriously credentialed institutional syndicate for a junior miner. Teck’s involvement is particularly notable \u2014 they vended the mine for equity rather than cash, signaling belief in the project’s development potential and aligning Blue Moon’s output with Trail’s processing capability." },
          { text: "Blue Moon also recently acquired the surrounding Gage properties from Liberty Gold, consolidating control of a 5+ kilometer critical minerals belt containing five historic mines and over 20 previously identified prospects." },
        ] },
        { label: "What to watch", items: [
          { text: "The NI 43-101 resource estimate is the first real milestone. Until Blue Moon completes modern drilling and publishes a compliant resource, the Apex numbers remain historical indicators, not bankable reserves. This work is expected to begin in 2026." },
          { text: "Underground re-entry and bulk sampling will test whether the 1980s/90s metallurgical challenges can be solved with modern techniques. Historical accounts document recovery problems during the Hecla era. The metallurgy of extracting germanium from breccia pipe ore is complex \u2014 this isn’t a simple heap leach operation." },
          { text: "The 2028 production target is aggressive for a project that only changed hands in March 2026 and lacks a modern feasibility study. Watch for whether the timeline holds or slips \u2014 each quarter of delay increases the risk that germanium prices normalize before Apex reaches production." },
          { text: "The Blue Moon mine in California (the company’s namesake project) is further along \u2014 underground decline development is underway with first production also targeted for 2028. If the zinc/copper mine reaches production first, it validates the team’s execution capability and provides cash flow to support Apex development. If it doesn’t, the company remains entirely dependent on equity financing." },
          { text: "The US policy environment is the tailwind. The DoD’s DPA Title III investments in 5N Plus, Hartree’s $12B government stockpile partnership, and the broader critical minerals executive orders all create a favorable backdrop for domestic germanium development. Whether Apex can attract similar government support \u2014 and whether that support comes with de-risking capital \u2014 could materially change the project economics." },
        ] },
        { label: "Investment angle", items: [
          { text: "Blue Moon is a pre-revenue junior miner and should be evaluated accordingly. The Apex mine is strategically significant \u2014 the only US primary germanium source \u2014 but there is no modern resource estimate, no feasibility study, and no production timeline with engineering backing. The 2028 production target is aspirational." },
          { text: "The shareholder register is the strongest signal. Oaktree Capital, Hartree Partners ($12B government stockpile partner), Teck Resources (8%), Wheaton Precious Metals, Altius Minerals, Baker Steel Resources Trust \u2014 this is an institutional syndicate that does not typically back junior miners without significant due diligence. Their collective presence suggests that sophisticated capital believes the Apex resource is real and the path to development is credible. It does not guarantee success." },
          { text: "The investment angle for risk-tolerant capital: if Apex reaches production at even the historical rate of 2.5t/yr germanium, the revenue at current pricing (~$22M/yr from germanium alone, plus copper, gallium, silver credits) would be material against Blue Moon’s current market cap. If modern mining techniques achieve 5-10t/yr, the revenue potential is $43-85M from germanium \u2014 transformative for a junior miner." },
          { text: "The milestones to watch: NI 43-101 compliant resource estimate (validates the deposit), underground bulk sample and metallurgical test work (validates the processing), and the Blue Moon zinc mine in California reaching production first (validates the team’s execution capability and provides cash flow to support Apex development)." },
          { text: "TSXV and NASDAQ dual-listed. Highly speculative. Suitable only for investors comfortable with junior mining risk who want early-stage exposure to domestic US germanium supply development. Position sizing should reflect the pre-revenue, pre-feasibility status." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Germanium Chain \u00b7 Layer: Mining / Primary Supply Sources: Blue Moon corporate disclosures, Mining.com, Hecla Mining 1989 feasibility study (historical), USGS Germanium Deposits database, Teck corporate disclosures. Resource estimates are historical and not NI 43-101 compliant. Not investment advice.",
    },
    "teck": {
      name: "Teck Resources",
      ticker: "TECK \u00b7 TSX / NYSE",
      category: "Primary Production / Feedstock",
          metrics: [
      { label: "Market cap", value: "C$30B+" },
      { label: "Revenue", value: "C$14.5B" },
      { label: "EBITDA", value: "C$5.2B" },
      { label: "Price", value: "~C$65" },
      { label: "12mo", value: "+18%" },
    ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Teck’s Trail Operations in British Columbia is one of only two non-Chinese facilities in the world that produces primary germanium (the other being Chinese zinc smelters). Trail recovers germanium as a by-product during zinc concentrate processing \u2014 the germanium arrives embedded in zinc ore from Teck’s Red Dog mine in Alaska, one of the world’s largest zinc operations, and is extracted from flue dust and leach residues during smelting." },
          { text: "Trail produces 8-10 tonnes of germanium per year. That’s a small number in isolation, but it represents a meaningful share of western primary supply. This germanium feeds multiple downstream channels: 5N Plus uses Trail-sourced germanium as feedstock for wafer production, defense contractors source GeCl\u2084 produced at Trail for military fiber optics, and Trail’s germanium refining capability connects to the broader western semiconductor supply chain. The 5-year supply deal Teck signed with a US defense contractor in 2023 confirms the strategic value of this output." },
          { text: "Teck also holds an 8% equity stake in Blue Moon Metals after vending the Apex germanium mine in March 2026. This creates a potential future pipeline: if Blue Moon restarts Apex, the concentrates could flow to Trail for downstream processing \u2014 extending Teck’s germanium throughput without requiring additional zinc mine development." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "Germanium is a rounding error in Teck’s financial statements. The company generates billions in revenue from copper and zinc \u2014 germanium appears only as a “by-product credit“ that reduces the net cash unit cost of zinc production at Red Dog. In FY2025, higher by-product revenues from silver and germanium contributed to Red Dog’s net cash unit costs declining from $0.39/lb to $0.33/lb. That’s the extent of germanium’s visibility in Teck’s reporting." },
          { text: "But that by-product framing understates the strategic value. At $8,500/kg, 10 tonnes of germanium is worth $85M \u2014 not insignificant even for a company of Teck’s scale. And Trail has been deliberately shifting its product mix toward higher-value specialty metals: profits at the Trail smelter doubled year-over-year in a recent quarter as Teck increased processing of germanium, indium, and silver while reducing primary zinc throughput in an unfavorable smelter market." },
          { text: "The Anglo Teck merger (pending) commits up to C$850M in capital investments to sustain and enhance critical minerals processing at Trail, including the potential expansion of germanium and other strategic metals production. A 4-tonne expansion (bringing total capacity to 12-14 tonnes/year) is planned by 2027. This would represent a roughly 40% increase in western primary germanium supply \u2014 material at the margin, though still small relative to China’s 120+ tonne annual output." },
        ] },
        { label: "What to watch", items: [
          { text: "The Anglo Teck merger and the C$850M Trail investment commitment. If the merger completes and the capital flows, Trail’s germanium capacity expansion becomes a near-certainty. If the merger encounters regulatory obstacles or is restructured, the germanium expansion timeline could slip." },
          { text: "Red Dog mine life extension. Red Dog is the source of the zinc concentrates that carry germanium to Trail. If Red Dog’s mine life is extended (as currently planned), Trail’s germanium feedstock is secured for decades. If Red Dog winds down without replacement, Trail’s germanium output declines with it \u2014 unless alternative zinc concentrate sources carry comparable germanium grades." },
          { text: "The Blue Moon relationship. Teck took 8% equity in Blue Moon rather than cash for the Apex mine \u2014 a clear signal of strategic interest. If Apex reaches development, Trail is the natural processing destination. This could add 2-5+ tonnes of additional germanium throughput to Trail’s capacity without requiring Teck to develop new mine supply." },
          { text: "Teck will never be a germanium investment. The metal will always be a by-product that improves zinc economics at the margin. But for anyone mapping the western germanium supply chain, Trail is a load-bearing wall \u2014 the only North American facility producing primary germanium at scale, and the processing hub that connects upstream mining to downstream refiners and manufacturers." },
        ] },
        { label: "Investment angle", items: [
          { text: "Teck is not a germanium investment. It is a copper and zinc major where germanium appears as a by-product credit. At ~C$30B+ market cap, germanium revenue (roughly $85M at current prices) is approximately 1% of the company’s value. No investor should buy Teck for germanium exposure." },
          { text: "The monitoring value is high. Trail’s germanium output (8-10t/yr, expanding to 12-14t) is a leading indicator for western primary supply availability. Trail’s shift toward higher-value specialty metals processing (germanium, indium, silver) signals that by-product economics are improving. The Anglo Teck merger and C$850M Trail investment commitment directly affect germanium capacity expansion timelines." },
          { text: "The Blue Moon equity stake (8%) is an interesting optionality. If Apex reaches development, Trail is the natural processing destination \u2014 extending Teck’s germanium throughput without new mine development. This is worth watching but not worth paying for in Teck’s current valuation." },
          { text: "For investors who own Teck for the copper thesis, germanium is a free option embedded in their position. For those mapping the supply chain, Teck’s quarterly commentary on Trail specialty metals and Red Dog mine life is essential monitoring." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Germanium Chain \u00b7 Layer: Primary Production / Feedstock Sources: Teck FY2025 annual report, Anglo Teck merger disclosures, USGS Mineral Commodity Summaries 2025, Mordor Intelligence germanium market report. Not investment advice.",
    },
    "yunnan-chihong": {
      name: "Yunnan Chihong Zinc & Germanium",
      ticker: "600497 \u00b7 Shanghai",
      category: "Primary Production (China)",
          metrics: [
      { label: "Market cap", value: "CNY 39.3B" },
      { label: "Revenue", value: "CNY 22.3B" },
      { label: "EBITDA", value: "—" },
      { label: "Price", value: "CNY 7.80" },
      { label: "12mo", value: "+42%" },
    ],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Yunnan Chihong is not an investment idea for western capital. It’s the single most important entity in the global germanium market \u2014 the supply-side counterparty whose actions determine whether the western scarcity premium exists or collapses." },
          { text: "As China’s largest primary germanium producer, Yunnan Chihong operates at the center of the export control architecture that defines the entire germanium investment thesis. When MOFCOM issues or withholds germanium export licenses, Yunnan Chihong’s output is a significant portion of what flows or doesn’t. The company produced 56 metric tonnes of germanium products in 2022, with capacity for 47.6 tonnes of germanium ingot, 60 tonnes of germanium tetrahydride (used in 5G infrastructure), and 300,000 germanium wafers for solar cells annually." },
          { text: "The company is a subsidiary of Chinalco (Aluminum Corporation of China), one of China’s largest state-owned enterprises. Its germanium operations are integrated with massive zinc and lead smelting in Yunnan Province \u2014 germanium is recovered from zinc processing residues using proprietary hydrometallurgical extraction methods. Proven germanium resources linked to the company’s lead-zinc ores exceed 600 metric tonnes, accounting for roughly 17% of China’s total proven reserves." },
        ] },
        { label: "How does this entity affect the rest of the chain?", items: [
          { text: "Yunnan Chihong’s product range covers every major germanium end use: refined metal ingots for substrate production, germanium tetrachloride for fiber optics, germanium dioxide for catalyst and optical applications, germanium tetrahydride for semiconductor deposition, and finished wafers for solar cells. This breadth means that Chinese export controls don’t just affect one downstream market \u2014 they constrain supply across the entire germanium value chain simultaneously." },
          { text: "The export control mechanism works through MOFCOM licensing. Since August 2023, any Chinese company exporting germanium must obtain an individual export license specifying the end user, end use, and quantity. In December 2024, exports of germanium and gallium to the United States were banned outright. Yunnan Chihong and other Chinese producers can still export to non-US destinations under license, but the licensing process introduces uncertainty, delay, and the ever-present risk of denial." },
          { text: "The Stimson Center’s trade data analysis showed that in 2024, while US imports from China dropped by ~5,900 kg, Belgian imports from China rose by ~6,150 kg \u2014 suggesting rerouting through Belgium (likely through Umicore) rather than a true reduction in Chinese supply reaching western markets. But the flow now passes through an additional chokepoint (MOFCOM licensing + Umicore processing), and the 3.5x price spread between Chinese domestic pricing (~$2,000/kg) and western market pricing ($7,000-8,500/kg) reflects the friction, risk, and intermediation costs of that rerouting." },
          { text: "The bear case for every other company on this page runs through Yunnan Chihong: if China relaxes export controls \u2014 whether as a trade negotiation concession, a strategic recalculation, or simply because domestic demand absorbs less than expected \u2014 Yunnan Chihong’s exports resume at pre-2023 levels, the western pricing premium compresses, and the economic rationale for DRC development, Apex mine restart, BlackDiamond adoption, and Umicore’s arbitrage margins all weaken simultaneously." },
        ] },
        { label: "What to watch", items: [
          { text: "The November 2026 ban review. China’s export ban on germanium and gallium to the United States has an implicit review timeline. Whether the ban is extended, expanded, partially relaxed, or used as a bargaining chip in broader trade negotiations is the single most important variable for the germanium market. An extension sustains the thesis. A relaxation compresses it." },
          { text: "Chinese domestic germanium demand. If China’s own fiber optic buildout, 5G infrastructure deployment, and semiconductor industry absorb an increasing share of domestic production, less germanium is available for export even if controls are relaxed. Watch Chinese domestic germanium pricing as a signal \u2014 if domestic prices rise toward international levels, it indicates tightening internal supply." },
          { text: "Yunnan Chihong’s financial health. The company reported a net loss of 62.4 million yuan in 2022 when germanium was cheap and demand was weak. The export controls have since transformed the pricing environment. Profitability improvements at Yunnan Chihong would indicate that the current pricing regime is sustainable from the Chinese side \u2014 they have little incentive to lobby for relaxation if the business is finally profitable." },
        ] },
        { label: "Investment angle", items: [
          { text: "Not investable for most western institutional capital. Shanghai A-share listed (600497.SH), state-owned subsidiary of Chinalco, subject to Chinese capital controls, governance opacity, and the very export control regime that defines the germanium thesis. Buying Yunnan Chihong is effectively betting that Chinese germanium export controls will benefit domestic producers \u2014 which they do, but the stock’s accessibility and governance make it impractical for most western funds." },
          { text: "The monitoring value is very high. Yunnan Chihong’s production volume, capacity utilization, and profitability are the best indicators of Chinese domestic germanium supply-demand balance. If the company reports strengthening profitability, it suggests the current pricing regime is sustainable from China’s perspective \u2014 Beijing has no incentive to relax controls on a profitable industry. If profitability weakens, it could signal Chinese domestic oversupply, which would increase the probability of export control relaxation." },
          { text: "Chinese domestic germanium pricing trends (available from Asian Metal and other services) are the signal to watch. If domestic prices rise toward $3,000-4,000/kg, it indicates internal tightening. If they remain at ~$2,000/kg, it suggests Chinese supply exceeds domestic demand \u2014 meaning the 3.5x western premium exists purely because of export controls, not fundamental scarcity." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Germanium Chain \u00b7 Layer: Primary Production (China) Sources: Reuters, USGS Mineral Commodity Summaries 2025, Stimson Center, China General Administration of Customs data, Chinalco corporate disclosures. Not investment advice.",
    },
    "stl-gecamines": {
      name: "STL / Gécamines \u2014 Big Hill",
      ticker: "Private \u00b7 DRC",
      category: "Primary Production / New Supply",
          metrics: [],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "The Big Hill slag heap in Lubumbashi is the accumulated waste from over a century of copper mining in the DRC \u2014 14 million tonnes of metallurgical slag containing an estimated 700+ tonnes of germanium. STL, a joint venture between Belgian-Congolese industrial group George Forrest International and DRC state mining company Gécamines, operates a new hydrometallurgical plant at the site commissioned in October 2023." },
          { text: "The first batch of germanium concentrates was exported to Umicore in Belgium in October 2024. The stated ambition is to supply up to 30% of global germanium demand \u2014 roughly 66 tonnes per year at current production levels. The plant’s nameplate capacity is approximately 30 tonnes per year of germanium concentrates, though ramp-up from a standing start will be gradual." },
          { text: "This is the largest new non-Chinese germanium source being developed anywhere in the world. The partnership was facilitated by the Minerals Security Partnership, a 14-country coalition focused on diversifying critical mineral supply chains. Umicore provides the proprietary extraction technology and has exclusive long-term offtake rights to all germanium produced at the site." },
        ] },
        { label: "How does value flow through this entity?", items: [
          { text: "The critical structural point is that STL’s germanium output does not create a new independent supply source \u2014 it reinforces Umicore’s position as the western germanium hub. Every tonne Big Hill produces ships to Olen, Belgium for processing by Umicore. No other company can buy STL’s germanium. This means Big Hill eases the overall western supply picture while simultaneously concentrating the processing bottleneck further in Umicore’s hands." },
          { text: "For Umicore, the DRC supply is additive to existing capacity. Umicore currently processes approximately 40-50 tonnes of germanium per year from a mix of recycled scrap (50%+), primary feedstock from zinc smelters, and other sources. As Big Hill ramps \u2014 realistically 5-15 tonnes/year near-term, potentially 20-30 tonnes/year by 2028-2029 \u2014 Umicore’s total throughput could reach 60-80+ tonnes. At current western pricing, each incremental 10 tonnes of germanium input translates to an estimated $40-50M in additional revenue." },
          { text: "The DRC supply also changes Umicore’s cost structure. Big Hill concentrates arrive under a long-term partnership agreement \u2014 likely at a negotiated price that is well below western spot. This gives Umicore another source of input cost insulation on top of its existing tolling/recycling arrangements, further widening the spread between input costs and output pricing." },
          { text: "STL itself is not investable. George Forrest International is a private Belgian-Congolese conglomerate. Gécamines is DRC state-owned. There is no public equity vehicle that provides direct exposure to Big Hill’s germanium output. The only way to participate in this value creation is through Umicore \u2014 which is precisely why Big Hill belongs in the Umicore investment thesis rather than as a standalone opportunity." },
        ] },
        { label: "What to watch", items: [
          { text: "Ramp-up pace. The hydrometallurgical extraction of germanium from century-old copper slag is technically complex. The plant is new, the metallurgy is novel at this scale, and DRC operational realities impose logistical constraints. Whether Big Hill reaches 15-20 tonnes/year by 2027 or takes longer will directly impact Umicore’s capacity growth trajectory and, by extension, western germanium supply." },
          { text: "DRC political and operational risk. The Democratic Republic of Congo carries well-documented risks: governance instability, infrastructure limitations, artisanal mining conflicts, and periodic resource nationalism. Gécamines’ 30% ownership provides government alignment but also exposes the project to potential policy shifts \u2014 tax increases, royalty renegotiations, or offtake reallocation demands." },
          { text: "The potential for on-site GeO\u2082 production. STL has discussed the possibility of developing a germanium dioxide production plant at Big Hill itself in the medium term. If this happens, it could change the value chain dynamics \u2014 shipping refined GeO\u2082 rather than raw concentrates would capture more value locally and potentially reduce Umicore’s processing margin. Watch for announcements about on-site processing capability expansion." },
          { text: "Impact on western supply balance. If Big Hill reaches its 30% of global supply ambition, it fundamentally changes the germanium scarcity narrative. Adding 60+ tonnes/year of non-Chinese supply to a 230-tonne global market would meaningfully ease the constraint \u2014 potentially putting downward pressure on the very pricing that makes Umicore’s germanium business so profitable. The paradox: Umicore’s most important growth project could, at full scale, reduce the scarcity premium that makes its existing business exceptionally profitable." },
        ] },
        { label: "Investment angle", items: [
          { text: "Not investable directly. George Forrest International is private. Gécamines is DRC state-owned. The only investment vehicle for Big Hill’s germanium is Umicore (UMI), which holds the exclusive offtake." },
          { text: "Big Hill should be evaluated as a component of the Umicore thesis, not as a standalone opportunity. Each tonne STL produces strengthens Umicore’s supply position and potentially adds $4-5M in revenue. If STL reaches 20-30t/yr by 2028-2029, that’s $80-150M of incremental revenue flowing exclusively to Umicore." },
          { text: "The paradox worth internalizing: at full scale (60+ tonnes/yr, 30% of global supply), Big Hill would meaningfully ease the germanium scarcity that makes Umicore’s existing business so profitable. The supply addition is bullish for Umicore’s volume but potentially bearish for the scarcity premium on its pricing. The net effect depends on whether DRC volume adds at a rate faster or slower than AI-driven fiber demand grows. If demand outpaces supply, both volume and pricing improve. If supply catches up, volume grows but margins compress. The timing matters." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Germanium Chain \u00b7 Layer: Primary Production / New Supply Sources: Umicore corporate disclosures, Minerals Security Partnership, STL/Gécamines press releases, USGS Mineral Commodity Summaries 2025. Not investment advice.",
    },
    "germanium-metal": {
      name: "Germanium Metal",
      ticker: "",
      category: "Raw Material / Commodity",
          metrics: [],
      sections: [
        { label: "What is this and why does it matter here?", items: [
          { text: "Germanium metal is the raw material that feeds every other entity on this page. Umicore converts it to GeCl\u2084 for fiber optics. 5N Plus grows it into wafers for space solar cells. LightPath exists because it’s too expensive. Blue Moon wants to mine it. Teck produces it as a by-product. Yunnan Chihong controls most of the global supply. STL is extracting it from a century-old slag heap. The price of germanium metal is the fundamental variable that determines the economics of the entire chain." },
          { text: "The price moved from approximately $1,340/kg in early 2023 to $8,597/kg by March 2026 \u2014 a roughly 6.4x increase in three years. This is not a demand-driven commodity supercycle. It is a supply-side dislocation caused by Chinese export controls layered on top of a structurally constrained market." },
          { text: "Global germanium supply runs at approximately 230 tonnes per year. Of that, roughly 120 tonnes comes from Chinese primary production (mainly as a zinc smelting by-product in Yunnan Province), ~90 tonnes from global recycling, and ~11 tonnes from Russia (effectively sanctioned and inaccessible to western buyers). New supply sources \u2014 the DRC Big Hill project, Blue Moon’s Apex mine, expanded Trail capacity \u2014 will add tonnage over the coming years, but none at a scale or timeline that fundamentally resolves the constraint before 2028-2029 at the earliest." },
        ] },
        { label: "How does the market work?", items: [
          { text: "Germanium is one of the most opaque commodity markets in existence. There is no futures contract, no exchange listing, no standardized benchmark. All transactions are OTC (over-the-counter), negotiated bilaterally between producers and consumers. Published prices from Fastmarkets, Asian Metal, and other services are reference indicators based on trade reports \u2014 not binding market prices." },
          { text: "This opacity creates three dynamics that matter for the supply chain thesis." },
          { text: "First, the 3.5x price spread between Chinese domestic pricing (~$2,000/kg) and western market pricing ($7,000-8,500/kg) persists because there is no arbitrage mechanism to close it. The export controls create a hard barrier between the two markets. The only entities that can bridge the gap are those with MOFCOM export licenses and western processing relationships \u2014 primarily Umicore, which appears to be capturing a significant portion of this spread by sourcing Chinese germanium under license and selling refined products at western prices." },
          { text: "Second, the lack of a futures market means there is no way to hedge germanium exposure. Fiber optic manufacturers, defense contractors, and solar cell producers must either accept spot price exposure, negotiate long-term supply contracts (which Umicore offers through its metals management services), or stockpile physical inventory. This creates strong customer loyalty to reliable suppliers \u2014 once you have a tolling arrangement with Umicore or a supply contract with 5N Plus, switching costs are high." },
          { text: "Third, price discovery is slow and asymmetric. In liquid commodity markets, information is priced in within minutes. In germanium, a major supply disruption or policy change can take weeks to fully reflect in transaction prices. This creates potential informational advantages for participants who track the supply chain closely \u2014 which is precisely what Stillpoint Intelligence is designed to provide." },
        ] },
        { label: "What to watch", items: [
          { text: "The November 2026 ban review is the single most important event for the germanium market. China’s December 2024 outright ban on germanium and gallium exports to the United States operates within a broader export control framework that is periodically reviewed. If the ban is extended or expanded to additional countries, the western scarcity premium intensifies and every company on this page benefits (except Yunnan Chihong, which is constrained). If the ban is relaxed \u2014 even partially \u2014 the pricing premium compresses and the urgency behind western supply chain diversification diminishes." },
          { text: "The direction of Chinese domestic pricing signals internal supply-demand balance. If Chinese domestic germanium prices rise toward $3,000-4,000/kg, it indicates that China’s own consumption (fiber buildout, 5G, defense) is absorbing more of the available supply, reducing the material available for export even if controls are lifted. Stable or declining Chinese domestic prices would suggest surplus capacity that could flood the western market if restrictions ease." },
          { text: "Western supply additions are cumulative but slow. Teck’s 4-tonne expansion (2027), Big Hill’s gradual ramp (5-15t near-term, 20-30t by 2028-2029), 5N Plus’s DoD-funded refining expansion (20t/yr capacity, 2-3 years), and Blue Moon’s Apex restart (2028+ if successful) collectively represent 30-50 tonnes of potential new western supply by the end of the decade. Against a 230-tonne global market, that’s meaningful but not transformative \u2014 it shifts the western supply picture from “entirely dependent on Chinese exports“ to “partially self-sufficient with concentrated processing through Umicore and Teck.“" },
          { text: "The germanium price at $8,500/kg is not a stable equilibrium \u2014 it’s a scarcity premium that exists because of a specific policy regime. The investment question for the entire chain is whether that regime persists long enough for western supply alternatives to scale, and whether those alternatives can sustain themselves if the regime eventually changes." },
        ] },
        { label: "Investment angle", items: [
          { text: "Not directly investable without physical trading infrastructure. No futures contract, no ETF, no exchange-traded vehicle. The only way to express a view on germanium pricing through liquid securities is via the equities on this page \u2014 primarily Umicore (value play on price persistence), 5N Plus (growth play on downstream demand), and LightPath (substitution play on price going too high)." },
          { text: "The informational edge from tracking germanium pricing is real. Germanium is an opaque OTC market where price discovery is slow. A fund manager who knows that the western price has moved before it’s reflected in published benchmarks has a trading advantage on the equities that are sensitive to it. This is where supply chain intelligence \u2014 understanding who is buying, who is selling, what MOFCOM is licensing \u2014 translates into actionable insight for public equity positioning." },
          { text: "The November 2026 ban review is the event that every germanium-linked position should be stress-tested against. An investor should be able to answer: “If the ban is lifted and germanium reverts to $3,000/kg, which of my positions still work?“ Umicore’s tolling model and GASIR® hedge provide partial insulation. 5N Plus’s DoD funding and AZUR backlog provide demand-side protection. LightPath’s thesis weakens significantly. Blue Moon becomes uneconomic. The answers aren’t uniform \u2014 which is why the portfolio construction across these names matters more than any individual position." },
        ] },
      ],
      disclaimer: "Stillpoint Intelligence \u00b7 Germanium Chain \u00b7 Layer: Raw Material / Commodity Sources: Fastmarkets, USGS Mineral Commodity Summaries 2025, Stimson Center, China General Administration of Customs, Asian Metal. Not investment advice.",
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
        {[
          { name: "Fiber optic cable", linked: true, href: "/input/fiber-optic-cable" },
          { name: "IR defense optics", linked: false, href: "" },
          { name: "Satellite solar cells", linked: false, href: "" },
          { name: "SiGe semiconductors", linked: false, href: "" },
          { name: "PET polymer catalysts", linked: false, href: "" },
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

        {/* ═══ BREADCRUMB + HEADER ═══ */}
        {(() => {
          const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
          const from = params?.get("from");
          const crumbs = from === "resources"
            ? [{ label: "All verticals", href: "/" }, { label: "Global Resources", href: "/" }]
            : [{ label: "All verticals", href: "/" }, { label: "AI Infrastructure", href: "/" }, { label: "Connectivity", href: "/" }, { label: "Fiber optic cable", href: "/input/fiber-optic-cable" }];
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
              <span style={{ fontSize: 11, color: "#a09888" }}>Germanium</span>
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
            Germanium
          </h1>
          {/* Executive summary */}
          <div style={{ marginBottom: 56 }}>
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
                "Only 8 coal and zinc deposits in the world host germanium at high enough concentration to be commercially extracted.",
                "83% of that supply is in China.",
                "Two western sources exist \u2014 Big Hill is new DRC tailings refined exclusively by Umicore, and Red Dog is a declining Alaskan zinc mine expected to expire in 2031.",
                "Outside China, Umicore and 5N Plus are the sole western supply for germanium-reliant products.",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, color: "#706a60", flexShrink: 0, minWidth: 16 }}>{i + 1}.</span>
                  <p style={{ fontSize: 12.5, color: "#a09888", lineHeight: 1.6, margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Supply tree visualization */}
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

          {/* How it's made cards — below the tree */}
          <div style={{ display: "flex", gap: "12px", marginTop: 32 }}>

            {/* Card 1: Host Ore Extraction */}
            <div style={{
              flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                HOST ORE EXTRACTION
              </p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Germanium-rich residues collect in flue dust and leach solutions during zinc smelting. Operations with specialized hydrometallurgical circuits extract it; most don&apos;t. A smaller volume comes from germanium-hosted coal operations in Yunnan and Inner Mongolia.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHY IT&apos;S HARD</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 0 0", flex: 1 }}>
                Germanium exists at 50-800 ppm in host ores. Recovery requires hydrometallurgical circuits that most zinc smelters never install. Production cannot scale independently of zinc economics. Around 10 zinc smelters worldwide recover germanium; China operates ~83% of primary capacity.
              </p>
              <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #222018" }}>
                <span style={{ fontSize: "12px", color: warmWhite, fontWeight: 500 }}>~140t/yr</span>
                <span style={{ fontSize: "9px", color: dimText, marginLeft: "6px" }}>primary germanium extracted globally</span>
              </div>
            </div>

            {/* Card 2: Refining to High Purity */}
            <div style={{
              flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                REFINING TO HIGH PURITY
              </p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Crude oxide is reduced to metal, then zone-refined to 5N+ purity. For fiber optics, it&apos;s converted to GeCl&#8324; and purified to 8N. For IR optics, it&apos;s cast as GeO&#8322; blanks. For satellite solar, it&apos;s grown into single-crystal wafers.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHY IT&apos;S HARD</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 0 0", flex: 1 }}>
                Fiber-grade GeCl&#8324; requires removing arsenic and trace contaminants to parts-per-billion levels using proprietary techniques. Zone refining is slow and energy-intensive. Only 6 facilities globally produce fiber-grade GeCl&#8324;: four in China, one in Russia, one in the west &mdash; Umicore in Olen, Belgium.
              </p>
              <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #222018" }}>
                <span style={{ fontSize: "12px", color: warmWhite, fontWeight: 500 }}>~230t/yr</span>
                <span style={{ fontSize: "9px", color: dimText, marginLeft: "6px" }}>refined germanium produced globally</span>
              </div>
            </div>

            {/* Card 3: Conversion to End Products */}
            <div style={{
              flex: 1, background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column" as const,
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.08em", color: accent, margin: "0 0 12px 0", fontWeight: 500 }}>
                CONVERSION TO END PRODUCTS
              </p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                Each end product needs a different form: GeCl&#8324; for fiber, GeO&#8322; blanks for IR optics, single-crystal wafers for satellite solar, SiGe substrates for semiconductors.
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: dimText, margin: "0 0 4px 0" }}>WHY IT&apos;S HARD</p>
              <p style={{ fontSize: "10.5px", color: "#807870", lineHeight: 1.55, margin: "0 0 0 0", flex: 1 }}>
                No single facility serves all end markets &mdash; each conversion path is bespoke. Umicore handles GeCl&#8324; and IR optics. AXT and Chinese firms handle solar wafers. IQE and GlobalFoundries handle SiGe. Five distinct end markets pull on the same ~230t/yr supply.
              </p>
              <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #222018" }}>
                <span style={{ fontSize: "12px", color: warmWhite, fontWeight: 500 }}>5 markets</span>
                <span style={{ fontSize: "9px", color: dimText, marginLeft: "6px" }}>competing for the same ~230t/yr supply</span>
              </div>
            </div>

          </div>

          {/* Nodes pointer */}
          <p style={{ fontSize: 11, color: "#706a60", lineHeight: 1.6, margin: "20px 0 0 0" }}>
            Click any node on the tree to see its full intelligence profile &mdash; location, key metrics, risk factors, and supply chain role.
          </p>
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
            { id: "signals", label: "Market signals", question: "What is the price telling us?", teaser: "The 5.7x price rise and persistent 3.5-4x China/west spread are telling us that export licensing has broken the physical market into two disconnected pools where arbitrage is illegal.", analysis: [
                { type: "prose", text: "Germanium prices have risen from approximately $1,500/kg in early 2024 to over $8,500/kg in international markets \u2014 a 5.7x increase in two years. This is not a speculative bubble: germanium has no futures market, no ETF, no derivatives. The price is set by physical transactions between a small number of producers and consumers." },
                { type: "prose", text: "The spread between Chinese domestic and western international prices has reached 3.5-4x. Chinese producers sell domestically at ~$2,000-2,500/kg while western buyers pay $7,000-8,500/kg. This arbitrage exists because MOFCOM export licensing prevents free flow of material. The spread is a direct measure of the geopolitical premium." },
                { type: "prose", text: "The November 2026 ban expiry is the single most important near-term catalyst. If the US export ban is reimposed or expanded to cover Belgian re-exports, the western price could spike further. If it lapses, prices may moderate \u2014 but the dual-use licensing regime remains in force regardless, maintaining structural friction." },
                { type: "callout", text: "There is no way to short germanium. No futures, no options, no ETF. The only way to express a view is through equities (Umicore, 5N Plus, Yunnan Chihong) or physical accumulation. This illiquidity amplifies price moves in both directions." },
              ] },
            { id: "constraints", label: "Supply constraints", question: "Why can\u2019t supply respond?", teaser: "Supply cannot respond because germanium is never a mine\u2019s primary product \u2014 output is set by zinc smelter economics, and even at $8,500/kg the germanium revenue is a rounding error in zinc P&Ls.", analysis: [
                { type: "prose", text: "Germanium is never the primary product of any mine. It exists at 50-800 parts per million inside zinc ores and coal fly ash. Global production is a function of zinc smelting volume, not germanium demand. When germanium prices rise, zinc miners cannot simply \u201Cproduce more germanium\u201D \u2014 they would need to smelt more zinc, which requires zinc prices to justify the economics." },
                { type: "prose", text: "Primary production is approximately 120 tonnes per year from Chinese zinc smelters and coal operations. Recycling contributes approximately 90 tonnes, primarily from fiber optic scrap, IR lens rework, and electronic waste. Russian production (~11t) is effectively unavailable to western buyers due to sanctions." },
                { type: "prose", text: "The recycling channel is already operating near theoretical maximum recovery rates. Umicore recovers >50% of its germanium input from recycled sources. Incremental gains are possible but the recycling pool is fundamentally limited by the volume of germanium-containing products reaching end-of-life." },
                { type: "subhead", text: "The byproduct trap" },
                { type: "prose", text: "This is the core structural issue: germanium supply is inelastic to germanium price. Even at $8,500/kg, no zinc smelter will increase throughput for the germanium alone \u2014 the economics don\u2019t work. A zinc smelter processing 200,000 tonnes of concentrate might recover 5-10 tonnes of germanium. At $8,500/kg that\u2019s $42-85M of revenue against a zinc operation generating $500M+. The germanium is a rounding error in the zinc P&L." },
                { type: "callout", text: "The only way to meaningfully increase germanium supply is to find new primary sources (like the DRC tailings) or to reduce demand through substitution. Neither happens quickly. The DRC ramp to Umicore is the most significant new source in decades, and it routes through a single western refiner." },
              ] },
            { id: "competing", label: "Competing demand", question: "Who else needs germanium?", teaser: "Five distinct end markets (fiber, IR defense, satellite solar, SiGe semiconductors, PET catalyst) all pull on the same fixed ~230t/yr pool with no meaningful demand destruction visible in any of them.", analysis: [
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
            { id: "geopolitical", label: "Geopolitical risk", question: "How could it get worse?", teaser: "It gets worse if the November 2026 US-targeted ban suspension lapses and China reimposes full controls \u2014 western buyers would lose access to the ~120t/yr of Chinese primary supply that reaches them via third-country re-exports today.", analysis: [
                { type: "prose", text: "In August 2023, China\u2019s Ministry of Commerce placed export licensing requirements on six germanium products. Chinese germanium exports dropped approximately 55% within months. In December 2024, China banned all germanium exports to the United States \u2014 suspended until November 2026, but the global dual-use license requirement remains in full force." },
                { type: "prose", text: "The licensing regime has created a two-tier market. Chinese domestic germanium trades at ~$2,000-2,500/kg. Western international prices exceed $7,000-8,500/kg. The spread reflects the cost of routing material through approved channels \u2014 primarily Belgian processing via Umicore." },
                { type: "prose", text: "Stimson Center analysis shows US germanium imports from China dropped by ~5,900 kg while Belgian imports rose by ~6,150 kg in the same period. The material is being re-routed, not eliminated. Umicore captures the arbitrage spread on every kilogram." },
                { type: "subhead", text: "November 2026: binary event" },
                { type: "prose", text: "The suspended US export ban expires in November 2026. Three scenarios: (1) Ban lapses \u2014 some price relief but dual-use licensing remains. (2) Ban reimposed \u2014 western prices spike further. (3) Ban expanded to cover Belgian re-exports \u2014 severe supply shock to the entire western fiber and defense supply chain." },
                { type: "callout", text: "Even the best-case scenario (ban lapsing) does not eliminate the structural premium. The dual-use licensing regime remains in force. Every western buyer must apply for and receive Chinese government approval for each germanium shipment. This is a permanent friction cost, not a temporary disruption." },
              ] },
            { id: "response", label: "Supply response", question: "What\u2019s being done?", teaser: "Three western supply responses are underway \u2014 DRC tailings feeding Umicore, Teck\u2019s Red Dog zinc expansion, and Blue Moon Metals\u2019 Idaho mine restart \u2014 but they collectively add ~30-50 t/yr of primary feedstock and none of them resolves Umicore\u2019s single-facility refining chokepoint.", analysis: [
                { type: "item", name: "DRC / G\u00e9camines \u2014 Big Hill tailings (exclusive to Umicore)", desc: "STL operates the Big Hill site in Lubumbashi \u2014 14 million tonnes of century-old slag containing 700+ tonnes of germanium. First concentrate exports October 2024 under exclusive Umicore offtake. Target: 30% of global germanium demand at full scale. The most important new primary source of non-Chinese germanium in decades." },
                { type: "item", name: "5N Plus (TSX: VNP) \u2014 St. George, Utah", desc: "Received $14.4 million from US DoD under the Defense Production Act. Evaluating a broader germanium refining facility with decision expected November 2026. If approved, adds ~15-20 tonnes/yr \u2014 meaningful against current western supply of ~26 tonnes. The single most binary catalyst for western germanium supply independence." },
                { type: "item", name: "Blue Moon Metals \u2014 Apex mine, Utah", desc: "Acquired from Teck Resources in March 2026. Historic germanium producer. Would be the first dedicated US germanium mine if it reaches production, targeted for ~2028. Early stage but strategically significant." },
                { type: "item", name: "Kazakhstan \u2014 Pavlodar restart", desc: "Targeting ~15 tonnes/yr germanium production restart. Adds raw feedstock to global supply, not western conversion capacity." },
                { type: "callout", text: "Every expansion project adds raw germanium feedstock. The DRC is the most significant. But all western material routes through Umicore for refining. 5N Plus is the only project that would add independent western refining capacity. Its November 2026 decision is the single most important catalyst for breaking the Umicore single-source dependency." },
              ] },
            { id: "technology", label: "Technology", question: "What could replace germanium?", teaser: "Replacement technologies exist in every end market (BlackDiamond glass for IR, hollow-core fiber for telecom, InGaP for solar, SiC for RF) but each one is partial, slow, and commercially unproven at the scale that would displace germanium demand before 2030.", analysis: [
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

          {(() => {
            const layers: { label: string; ideas: { id: string; name: string; ticker: string; category: string; line1: string }[] }[] = [
              { label: "HOST OPERATION + PRIMARY PRODUCER", ideas: [
                { id: "yunnan-chihong", name: "Yunnan Chihong", ticker: "600497 \u00b7 Shanghai", category: "Market maker", line1: "China\u2019s largest germanium producer at 56t/yr output with 600+ tonnes in proven reserves." },
                { id: "teck", name: "Teck Resources", ticker: "TECK \u00b7 TSX / NYSE", category: "Feedstock supplier", line1: "Only North American primary feedstock source of germanium, recovered as zinc by-product at Trail smelter in BC." },
                { id: "stl-gecamines", name: "STL / G\u00e9camines", ticker: "Private \u00b7 DRC", category: "Feedstock supplier", line1: "Largest new non-Chinese germanium source in development \u2014 14M tonnes of slag, 700+ tonnes Ge potential." },
                { id: "blue-moon", name: "Blue Moon Metals", ticker: "MOON \u00b7 TSXV / NASDAQ", category: "Capacity builder", line1: "Acquired Apex \u2014 the only past-producing primary germanium and gallium mine in the United States." },
              ]},
              { label: "REFINER", ideas: [
                { id: "umicore", name: "Umicore", ticker: "UMI \u00b7 Euronext", category: "Chokepoint holder", line1: "Sole western GeCl\u2084 supplier for commercial fiber optics." },
                { id: "5n-plus", name: "5N Plus", ticker: "VNP \u00b7 TSX", category: "Capacity builder", line1: "Only vertically integrated western supplier from refined germanium to finished space solar cells." },
              ]},
              { label: "NON-TREE", ideas: [
                { id: "lightpath", name: "LightPath Technologies", ticker: "LPTH \u00b7 NASDAQ", category: "Technology", line1: "Holds exclusive license to BlackDiamond glass that replaces germanium in IR optics." },
                { id: "germanium-metal", name: "Germanium metal", ticker: "Physical commodity", category: "Direct exposure", line1: "$1,500 \u2192 $8,500+/kg in two years on relatively fixed global supply of ~230t/yr." },
              ]},
            ];
            return (
              <div style={{ display: "flex", flexDirection: "column" as const }}>
                {layers.map((layer, li) => (
                  <React.Fragment key={layer.label}>
                    <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: dimText, margin: li === 0 ? "0 0 8px 0" : "24px 0 8px 0" }}>{layer.label}</p>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                      {layer.ideas.map(idea => (
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
                          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                            <p style={{ fontSize: 12, color: "#c4bdb2", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{idea.line1}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            );
          })()}

        </div>

        {/* CATALYSTS */}
        <div id="catalysts" style={{ marginBottom: 56, paddingTop: 20 }}>
          <p style={{ fontSize: 20, letterSpacing: "0.06em", color: dimText, margin: 0, marginBottom: 24, paddingBottom: 10, borderBottom: "0.5px solid #555" }}>CATALYSTS</p>

          {/* Near-term */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.08em", color: accent, margin: "0 0 14px 0", fontWeight: 500 }}>NEAR-TERM (NEXT 6 MONTHS)</p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {[
                { date: "May-June 2026", desc: "Umicore Q1 2026 earnings" },
                { date: "June 2026", desc: "5N Plus fiber-grade GeCl\u2084 commercial qualification update" },
                { date: "July 2026", desc: "Teck Resources Q2 2026 earnings" },
                { date: "August 2026", desc: "Three-year anniversary of MOFCOM germanium export licensing" },
                { date: "October 2026", desc: "Yunnan Chihong H2 2026 production guidance" },
                { date: "October 2026", desc: "LightPath Technologies Q1 FY27 earnings" },
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
                { date: "November 27, 2026", desc: "US-targeted Chinese export ban suspension expiry (binary catalyst)" },
                { date: "Q1 2027", desc: "Blue Moon Metals Idaho restart FID" },
                { date: "Q1 2027", desc: "STL/G\u00e9camines DRC tailings full-rate production" },
                { date: "Q2 2027", desc: "Corning hollow-core fiber commercial volumes" },
                { date: "Q3 2027", desc: "Teck Red Dog 2026 annual germanium production disclosure" },
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
                { date: "2028", desc: "Blue Moon Idaho first germanium concentrate" },
                { date: "2028", desc: "Hollow-core fiber share reaches 5-10%" },
                { date: "2028-2029", desc: "US DPA Title III investments in domestic germanium capacity" },
                { date: "2030", desc: "Chinese primary germanium capacity expected to expand" },
                { date: "2030+", desc: "BlackDiamond-2 IR optics reach commercial scale" },
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
