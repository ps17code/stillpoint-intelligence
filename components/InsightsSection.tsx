"use client";
import React from "react";

interface InsightsSectionProps {
  top: number;
  chainState: number;
}


// ─── RAW MATERIAL DATA ────────────────────────────────────────────────────────

const RAW_INSIGHTS: { num: string; label: string; text: string }[] = [
  { num: "01", label: "Capture rate ceiling", text: "Only 7–17% of germanium passing through coal combustion is actually extracted — the rest is lost to slag. Supply is not constrained by deposit size but by industrial process efficiency. You cannot build a germanium mine. You can only burn more coal and recover more of what escapes." },
  { num: "02", label: "China controls extraction", text: "Five of eight known active deposits are Chinese. All three active coal-hosted deposits are in China or sanctioned Russia. China controls ~83% of primary refining capacity. Export licensing has been active since August 2023 — and a full export ban on germanium to the US was imposed in December 2024." },
  { num: "03", label: "Western supply is three companies", text: "Strip out China and Russia. Western accessible germanium supply is Umicore, 5N Plus, and PPM Pure Metals — combined estimated output ~75t/yr against global demand of ~220t/yr. The gap is structurally unbridgeable in the near term regardless of price." },
  { num: "04", label: "The recycling trap", text: "Western recyclers feed primarily on fiber optic manufacturing scrap from Corning, Prysmian, and Fujikura. If Chinese export controls reduce fiber production, the scrap stream feeding western recyclers shrinks simultaneously. The western buffer partially collapses under the exact conditions it exists to protect against." },
  { num: "05", label: "Red Dog supply cliff", text: "The world's largest zinc-germanium operation closes in 2031. No replacement has been identified. The US government's response — partnering with 5N Plus on domestic wafer capacity — addresses downstream processing but not upstream feed. After 2031, 5N Plus depends entirely on imported germanium concentrate." },
  { num: "06", label: "DRC is the long game", text: "Big Hill tailings contain 700+ tonnes of germanium — $2B+ at current prices — and could supply 30% of global demand when fully ramped. But first shipment reached Umicore in October 2024. Realistic supply contribution before 2028 is marginal. This is a structural story, not a near-term supply fix." },
  { num: "07", label: "Price is the only release valve", text: "Germanium rose 124% from China's export control announcement to the October 2024 peak — and a full US export ban followed in December 2024. At $2,900/kg+ the economics of alternative extraction are becoming viable. Further disruption triggers a price dislocation that eventually makes alternatives bankable — but with a 5–7 year supply response lag." },
];

const RAW_CONNECTIONS: { title: string; text: string }[] = [
  { title: "Corning funds Umicore's supply security", text: "Corning's fiber manufacturing generates the germanium scrap that is Umicore's primary recycled feed. Every kilometer of fiber drawn creates waste germanium that flows to Hoboken. Corning's AI datacenter capex cycle directly drives Umicore's recycled supply volume. These two companies are invisibly coupled across two layers of the supply chain — one in the component layer, one in the raw material layer." },
  { title: "AI infrastructure buildout tightens its own supply chain", text: "Hyperscalers committing $250B+ in datacenter capex in 2025 drive fiber demand, which drives germanium demand, which tightens supply already constrained by Chinese export controls. AI is simultaneously the largest demand driver and the most exposed end user to a germanium supply shock. The companies building AI infrastructure are inadvertently accelerating the constraint they depend on." },
  { title: "China's export controls are structurally bullish for Umicore", text: "Umicore sources zero germanium from China. Every tonne China restricts forces western buyers to source from Umicore instead — increasing demand for its output, improving pricing power, and validating its supply diversification strategy. Chinese export controls are structurally the best thing that could happen to Umicore's market position." },
  { title: "Russia sanctions quietly removed 9% of global supply in 2022", text: "JSC Germanium historically exported 80%+ of its ~20t/yr output to western markets. Post-2022 sanctions cut that off entirely — ~20t/yr removed from western accessible supply with no announcement and almost no media coverage. The germanium supply shock began before China's export controls. Western markets have operated with structurally reduced supply since early 2022." },
];

const RAW_TECHNOLOGIES: { title: string; meta: string; text: string }[] = [
  { title: "High-efficiency fly ash extraction", meta: "Anactisis · Virginia Tech / Phinix · Army SBIR + DOE funded · TRL 3–4 · Timeline 5–7 years", text: "Current western extraction yields only 7–17% of available germanium from fly ash. Lab results demonstrate 90%+ recovery is achievable with optimized hydrometallurgical processes. Western coal power plant waste ash contains meaningful germanium — but at ~15 ppm vs 850 ppm at Lincang, processing volumes required are 50x higher. Anactisis (Army SBIR, Penn State) and Virginia Tech (DOE/Rio Tinto) are the most advanced US efforts. If scaled, this unlocks domestic germanium from existing waste streams without new deposits." },
  { title: "Copper and bauxite byproduct recovery", meta: "Missouri S&T · Rio Tinto grant $875K · TRL 2–3 · Timeline 7–10 years", text: "Germanium occurs in copper refinery anode slimes and bauxite processing liquor — both currently discarded. Missouri S&T demonstrated extraction from copper waste streams using chemical dissolution, backed by an $875K Rio Tinto grant. If adopted at scale by major copper refiners (Aurubis, Codelco, Glencore), this could add 20–40t/yr of western supply from existing industrial infrastructure. Requires no new mines — only retrofits to existing refinery operations." },
  { title: "US DoD as demand anchor — the investment enabler", meta: "Pentagon $540M+ critical minerals · EO 14241 · DPA Title III · Active 2025", text: "The Pentagon has invested $540M+ in US critical mineral projects and Executive Order 14241 authorizes DoD to directly facilitate private capital into domestic mineral production. DPA Title III funds have already gone to germanium wafer production at 5N Plus. This government backstop creates a guaranteed demand floor that makes domestic germanium economics viable independent of Chinese price manipulation — historically the primary barrier to private investment. The DoD is the template for any future domestic entrant." },
];

type CardVariant = "opp" | "risk" | "drc";
const RAW_CARDS: { variant: CardVariant; ticker: string; name: string; desc: string }[] = [
  { variant: "opp", ticker: "UMI · Euronext Brussels", name: "Umicore", desc: "Western germanium supply hub. Exclusive DRC offtake, EU Critical Raw Materials Act backing, >50% recycled feed. The only western company whose germanium position structurally improves as China tightens export controls." },
  { variant: "opp", ticker: "VNP · TSX", name: "5N Plus", desc: "US DoD strategic partner. Utah germanium wafer facility backed by defense contracts and DPA Title III funding. Most direct investment vehicle for US germanium supply independence. Contracted defense revenue de-risks the model through the Red Dog transition." },
  { variant: "opp", ticker: "TECK · NYSE / TSX", name: "Teck Resources", desc: "Indirect germanium exposure via Red Dog through 2031. Primary thesis is copper. Germanium byproduct provides asymmetric upside on further price spikes. Post-Anglo American merger, future of Red Dog operations unclear." },
  { variant: "risk", ticker: "Full US ban · December 2024", name: "China export controls", desc: "Escalated from licensing (Aug 2023) to a full export ban to the US (Dec 2024). USGS estimates a full dual gallium-germanium ban could shave $3.4B from US GDP. No western supply response possible within 3 years at current scale." },
  { variant: "risk", ticker: "Mine closes 2031", name: "Red Dog supply cliff", desc: "One of the only non-Chinese zinc-germanium sources closes in 2031 with no replacement identified. Removes ~5–10t/yr from western supply. Slow-moving and likely underpriced by markets given the 5-year horizon." },
  { variant: "drc", ticker: "Ramping 2024–2028", name: "DRC Big Hill ramp", desc: "700+ t Ge in Lubumbashi tailings. Exclusive Umicore offtake. If ramped to full capacity, structurally transforms the non-Chinese supply picture. Play via Umicore. DRC state ownership and unproven ramp timeline are the primary risks." },
];

// ─── COMPONENT LAYER DATA ─────────────────────────────────────────────────────

const COMP_INSIGHTS: { num: string; label: string; text: string }[] = [
  { num: "01", label: "The fiber famine is happening now", text: "Single-mode fiber prices surged over 500% from January 2025 to early 2026. At least one major US glass manufacturer has sold all fiber inventory through year-end 2026. Global preform lines are running at 100% capacity. This is not a future risk — it is the current market condition." },
  { num: "02", label: "The preform bottleneck is irreducible", text: "Expanding preform capacity takes 18–24 months — a structural lag that cannot be compressed. Even with capital committed today, new capacity cannot reach market before late 2027. The bottleneck is not demand, not investment intent, not technology. It is glass chemistry and time." },
  { num: "03", label: "Germanium price tripled in 14 months", text: "Germanium rose from $2,839/kg in January 2024 to $8,597/kg in February 2026 — a 200% increase. Fiber prices followed with a 70%+ surge. The two markets are coupled: germanium constraints directly limit preform production, which directly limits fiber output. One bottleneck amplifies the other." },
  { num: "04", label: "Fiber demand is structurally different from anything before", text: "AI datacenter fiber demand is projected to grow from less than 5% of global consumption in 2024 to 35% by 2027. This layers on top of telecom, FTTH, 5G, and UAV military fiber — every segment growing simultaneously, pulling from the same preform capacity pool." },
  { num: "05", label: "YOFC's domestic GeCl₄ access is a structural advantage", text: "Chinese fiber manufacturers source GeCl₄ from Yunnan Chihong and domestic state chemical plants — completely insulated from export controls. Western manufacturers source from Umicore under export licensing uncertainty. YOFC and Chinese peers operate in a parallel supply chain immune to the constraints affecting Corning and Prysmian." },
  { num: "06", label: "Meta's Corning deal resized the market", text: "Meta's $6 billion agreement with Corning for AI datacenter cabling equals Corning's entire 2025 optical communications revenue — from a single customer, for a single application. When hyperscalers lock in supply at this scale, smaller buyers are left competing for residual capacity. Long-term contracts are becoming the only reliable supply mechanism." },
  { num: "07", label: "The bottleneck compounds across every layer", text: "Germanium supply constrains GeCl₄ production, which constrains preform manufacturing, which constrains fiber drawing, which constrains cable output. Each layer has its own capacity ceiling and its own 18–24 month expansion lag. A shortage at any layer propagates through every layer below it. There is no slack anywhere in the chain." },
];

const COMP_CONNECTIONS: { title: string; text: string; watch: string }[] = [
  { title: "Umicore is the GeCl₄ chokepoint for western fiber manufacturers", text: "Corning, Prysmian, Fujikura, and Sumitomo all source ultrapure GeCl₄ from Umicore. With Chinese GeCl₄ under export controls and JSC Germanium sanctioned, Umicore is the only western supplier at meaningful scale. Every western fiber manufacturer's production schedule is directly constrained by Umicore's output. Umicore's capacity is not a commodity input — it is a strategic bottleneck.", watch: "Umicore GeCl₄ capacity expansion announcements as a leading indicator for western fiber supply relief." },
  { title: "Long-term contracts are replacing spot markets — locking in winners and losers", text: "Meta locked in Corning. Lumen locked in Corning. Hyperscalers with capital and foresight are securing supply years in advance. Smaller telecom operators and enterprise buyers are being pushed to spot markets where prices are 150–500% higher and availability is measured in days. The fiber supply chain is bifurcating into contracted hyperscalers and everyone else.", watch: "Multi-year supply agreement announcements between hyperscalers and fiber manufacturers as signals of who controls the constrained supply." },
  { title: "Military UAV fiber demand emerged as a new structural consumer overnight", text: "Fiber-guided drones consume 10–40 km of single-mode fiber per flight — and the fiber is disposable. Russia's procurement alone jumped from less than 1% to 10.5% of global fiber demand in 2025. This entirely new demand category was not in any supply chain model 24 months ago. It is pulling directly from the same G.657A2 pool as AI datacenters.", watch: "Defense procurement signals and UAV program scale as an increasingly significant non-civilian driver of fiber and germanium demand." },
  { title: "Corning's enterprise revenue is the most real-time signal of AI infrastructure spend", text: "Corning's enterprise fiber sales grew 58% YoY in Q3 2025 and Q1 2025 optical-communications revenue rose 46% YoY to $1.36B. Corning reports quarterly and its fiber segment revenue is the most granular public data point on AI infrastructure fiber consumption. It leads hyperscaler capex spend by 6–12 months because Corning ships before the racks are installed.", watch: "Corning optical-communications quarterly revenue as the highest-quality public leading indicator for AI datacenter fiber consumption." },
];

const COMP_CARDS: { ticker: string; name: string; desc: string }[] = [
  { ticker: "GLW · NYSE", name: "Corning", desc: "The largest western fiber manufacturer, running at 100% capacity with hyperscaler demand locked in years ahead. Meta's $6B supply agreement equals Corning's entire 2025 optical-communications revenue from a single customer. Enterprise fiber sales grew 58% YoY in Q3 2025. Corning's quarterly optical revenue is the highest-quality public leading indicator for AI infrastructure spend — it ships before the racks are installed." },
  { ticker: "PRY · Borsa Italiana", name: "Prysmian", desc: "The world's largest fiber cable manufacturer by volume — 30M+ km/yr across 27 plants — at full capacity with no relief before late 2027. Exposed to AI datacenter demand, submarine cable buildout, and 5G backhaul simultaneously. European GeCl₄ supply constrained by the same export control dynamics as all western fiber manufacturers, making upstream supply agreements a strategic differentiator." },
  { ticker: "UMI · Euronext Brussels", name: "Umicore", desc: "The sole western GeCl₄ supplier at meaningful scale — Corning, Prysmian, Fujikura, and Sumitomo all depend on Umicore for ultrapure GeCl₄. With germanium up 200% since January 2024 and Chinese supply under export controls, Umicore's pricing power has structurally increased. Every western fiber manufacturer's production schedule is directly constrained by Umicore's output capacity." },
  { ticker: "Structural · not cyclical", name: "Fiber supply crisis 2026", desc: "Global preform lines are running at 100% capacity. Single-mode fiber prices have surged over 500% since January 2025. At least one major US glass manufacturer has sold all inventory through year-end 2026. New capacity cannot arrive before late 2027 regardless of investment committed today. The shortage is structural — every demand category (AI, telecom, 5G, UAV military) is growing simultaneously from the same constrained preform pool." },
  { ticker: "November 27, 2026 · binary event", name: "China GeCl₄ ban expiry", desc: "China suspended its full germanium export ban to the US following the Trump-Xi trade truce, but licensing controls remain active and the military end-user ban is fully in force. The suspension expires November 27, 2026. Beijing can reimpose the full ban at any time after that date with no notice. Every western fiber manufacturer's supply chain planning is implicitly conditional on this date." },
  { ticker: "YOFC · Sumitomo · long-horizon", name: "Hollow-core fiber", desc: "Hollow-core fiber uses air — not germanium-doped glass — as the transmission medium, delivering 30% latency reduction and eliminating germanium dependency from the fiber layer entirely. YOFC reached commercial-scale production in November 2023. If hollow-core achieves cost parity with standard single-mode fiber, it is the bear case for the entire upstream germanium supply chain — structurally removing the largest single demand source over a 5–10 year horizon." },
];

// ─── SUBSYSTEM LAYER DATA ─────────────────────────────────────────────────────

const SUB_INSIGHTS: { num: string; label: string; text: string }[] = [
  { num: "01", label: "Hyperscalers own the ocean floor", text: "Google is part or sole owner of ~33 submarine cables. Meta owns ~15. Microsoft 5. Amazon 4. A decade ago hyperscalers consumed 10% of submarine capacity — today they control 71%. The shift from renting to owning is complete. Every new major cable system is being built by, for, or funded by a hyperscaler." },
  { num: "02", label: "Meta's Waterworth is the largest cable ever built", text: "Meta's Project Waterworth will span 50,000 km across five continents at an estimated cost of $10B+ — the longest submarine cable in history. It will be Meta's first fully privately owned cable, used exclusively for internal traffic. The longest cable on earth will be owned by a single Silicon Valley company." },
  { num: "03", label: "60 new submarine systems planned through 2027", text: "Around 60 new submarine cable systems are planned for completion through 2027 — the most concentrated period of subsea infrastructure investment in history. 2026 alone sees ~40 new systems entering service worth ~$6B in construction. The bottleneck is no longer capital — it is cable ship availability and the germanium-containing fiber to fill the cable." },
  { num: "04", label: "Datacenter cable is a different product from telecom cable", text: "AI datacenters require cables with 96 to 6,912 fibers — orders of magnitude denser than traditional telecom cable. GPU cluster interconnects need runs measured in meters with fiber counts in the thousands. Cable assemblers tooled for 5G and FTTH are not equipped for this density without significant retooling, adding another capacity constraint on top of the preform shortage." },
  { num: "05", label: "SubCom and Alcatel SN are now strategic national assets", text: "France transferred Alcatel Submarine Networks to state ownership — explicitly treating submarine cable manufacturing as critical national infrastructure. The US government directs strategically sensitive projects to SubCom, the only US-owned turnkey submarine cable supplier with its own installation vessels. The privatization of the internet's physical layer is triggering a nationalization response from western governments." },
  { num: "06", label: "The cable ship fleet is the invisible bottleneck", text: "Maintaining and expanding the submarine cable network requires specialized cable laying vessels — fewer than 60 operational globally. Replacing the aging fleet and adding capacity requires ~$3B and 20 new ships. Without additional vessels, the 60-system pipeline through 2027 cannot be physically installed on schedule regardless of how much cable is manufactured." },
  { num: "07", label: "One route-km of cable contains 144 fiber-km of strand", text: "The conversion between component and subsystem layers is the key to understanding the supply chain math. A standard 144-fiber terrestrial cable contains 144 fiber-km of strand per route-km of cable. At ~3–4M route-km of new cable per year, that implies ~500M fiber-km of strand consumption annually — exactly matching the component layer's output capacity. There is no buffer. Every strand produced gets deployed." },
];

const SUB_CONNECTIONS: { title: string; text: string; watch: string }[] = [
  { title: "Meta's $10B cable is Prysmian and SubCom's order book — not an abstraction", text: "When Meta announces a $10B submarine cable, that capital flows directly to Prysmian for cable manufacturing and SubCom or Alcatel for installation. A single hyperscaler project of this scale represents multiple years of a cable manufacturer's submarine capacity. The hyperscaler's infrastructure decision is the cable assembler's production plan — they are the same decision separated by 18 months.", watch: "Meta, Google, Microsoft, and Amazon infrastructure announcements as direct forward indicators for Prysmian and SubCom revenue." },
  { title: "The datacenter cable shortage is pulling resources from telecom FTTH", text: "Cable assemblers operating at 100% capacity cannot simultaneously serve AI datacenter orders and FTTH rollout programs. As hyperscalers lock in multi-year supply agreements, telecom operators building fiber-to-the-home networks are being pushed down the queue. AI infrastructure buildout is directly competing with broadband access deployment for the same manufacturing slots.", watch: "FTTH deployment data from AT&T and Verizon as a proxy for how much capacity hyperscalers are absorbing from the common cable assembly pool." },
  { title: "Chinese cable manufacturers are building strategic leverage through Belt and Road", text: "HMN Technologies (formerly Huawei Marine) and Hengtong are building submarine cable systems across Africa, Southeast Asia, and the Middle East at prices western suppliers cannot match. Nations choosing Chinese submarine cable infrastructure embed Chinese access to their communications backbone for the 25-year operational life of the cable. The geopolitical implications are identical to 5G tower decisions — but underwater and largely invisible.", watch: "HMN Technologies and Hengtong project announcements in strategically sensitive regions as indicators of Chinese infrastructure influence expansion." },
  { title: "Microsoft's 120,000 miles of private fiber is the AI WAN nobody is talking about", text: "Microsoft has deployed 120,000 miles of dedicated fiber for its AI Wide Area Network — a private global network larger than most national telecom operators' entire fiber footprint. It carries traffic between Azure datacenters for AI training and inference. Microsoft is one of the largest single consumers of fiber optic cable on earth without appearing in any cable operator rankings.", watch: "Microsoft Azure datacenter expansion announcements as a leading indicator for private fiber WAN deployment demand." },
];

const SUB_CARDS: { ticker: string; name: string; desc: string }[] = [
  { ticker: "PRY · Borsa Italiana", name: "Prysmian", desc: "The world's largest cable manufacturer sits at the intersection of every major demand driver — AI datacenter cable, submarine systems, FTTH, and 5G backhaul — all growing simultaneously against 100% capacity utilization. Prysmian's 2024 North American preform acquisition insulates it from GeCl₄ spot market volatility that smaller assemblers cannot hedge. The submarine cable pipeline through 2027 represents years of locked order backlog." },
  { ticker: "GLW · NYSE", name: "Corning", desc: "Corning's cable assembly division benefits from the same AI demand surge as its fiber manufacturing division — vertically integrated from strand to finished cable. The Meta $6B deal covers both fiber and cable. Enterprise cable sales grew 58% YoY in Q3 2025. Quarterly optical-communications revenue remains the highest-quality public real-time signal for AI infrastructure deployment pace." },
  { ticker: "Private · Cerberus Capital", name: "SubCom", desc: "The only US-owned submarine cable supplier with integrated installation vessels — a vertical integration that is increasingly valuable as national security scrutiny of Chinese competitors (HMN Technologies) intensifies. US government preference for SubCom on strategically sensitive projects is structural. The 40-system 2026 pipeline and Waterworth-scale projects represent a multi-year order backlog. No public investment vehicle — private equity owned." },
  { ticker: "French state · post-Nokia", name: "Alcatel Submarine Networks", desc: "ASN's transfer to French state ownership signals Europe's recognition of submarine cable infrastructure as strategic national security — equivalent to defense assets. Benefits from government-backed financing and preferential treatment in European and allied-nation cable competitions. One of three companies controlling over 60% of global submarine wet-plant revenue. No direct public investment vehicle." },
  { ticker: "DY · NYSE", name: "Dycom Industries", desc: "The largest US fiber optic network construction contractor — it installs the cable that Corning and Prysmian manufacture. As deployment contractor for AT&T, Verizon, and increasingly hyperscalers building private fiber networks, Dycom captures the labor-intensive installation phase. Full-year 2025 revenues grew 12.6% to $4.7B. Hyperscaler private fiber programs are a growing revenue contributor alongside traditional FTTH contracts." },
  { ticker: "Chinese state-linked · formerly Huawei Marine", name: "HMN Technologies risk", desc: "HMN Technologies is expanding submarine cable presence across Africa, Southeast Asia, and the Middle East at prices western suppliers cannot match. Nations choosing HMN embed Chinese access to communications infrastructure for 25-year cable lifespans. US and allied governments increasingly block HMN from strategically sensitive projects — but its Belt and Road pipeline continues growing in markets outside western influence." },
];

// ─── SHARED STYLES ────────────────────────────────────────────────────────────

const CARD_BORDER: Record<CardVariant, string> = {
  opp:  "#5a7a9c",
  risk: "#c8855a",
  drc:  "#5a8c6a",
};

const CARD_TYPE_LABEL: Record<CardVariant, string> = {
  opp:  "Opportunity",
  risk: "Risk",
  drc:  "Watch",
};

function InsightBox({ num, label, text }: { num: string; label: string; text: string }) {
  return (
    <div style={{
      background: "white",
      border: "0.5px solid rgba(192,176,128,0.3)",
      borderRadius: 6,
      padding: "14px 20px",
      display: "flex",
      alignItems: "baseline",
      gap: 20,
    }}>
      <span style={{ fontFamily: "Courier New, monospace", fontSize: 9, color: "#c8bc9a", width: 18, flexShrink: 0 }}>{num}</span>
      <span style={{ fontFamily: "Courier New, monospace", fontSize: 8.5, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#a89060", width: 180, flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 13, color: "#4a3e2e", lineHeight: 1.65 }}>{text}</span>
    </div>
  );
}

function ConnectionBox({ title, text }: { title: string; text: string }) {
  return (
    <div style={{
      background: "white",
      border: "0.5px solid rgba(192,176,128,0.3)",
      borderLeft: "2px solid rgba(192,176,128,0.45)",
      borderRadius: 6,
      padding: "14px 20px",
      display: "flex",
      gap: 16,
      alignItems: "baseline",
    }}>
      <span style={{ fontSize: 11, color: "#c8a85a", flexShrink: 0 }}>→</span>
      <div>
        <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 13, fontWeight: 600, color: "#2a1e0c", marginBottom: 5 }}>{title}</div>
        <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 13, color: "#4a3e2e", lineHeight: 1.65, fontStyle: "italic" }}>{text}</div>
      </div>
    </div>
  );
}

function WatchConnectionBox({ title, text, watch }: { title: string; text: string; watch: string }) {
  return (
    <div style={{
      background: "white",
      border: "0.5px solid rgba(192,176,128,0.3)",
      borderLeft: "2px solid rgba(192,176,128,0.45)",
      borderRadius: 6,
      padding: "14px 20px",
      display: "flex",
      gap: 16,
      alignItems: "baseline",
    }}>
      <span style={{ fontSize: 11, color: "#c8a85a", flexShrink: 0 }}>→</span>
      <div>
        <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 13, fontWeight: 600, color: "#2a1e0c", marginBottom: 5 }}>{title}</div>
        <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 13, color: "#4a3e2e", lineHeight: 1.65, fontStyle: "italic", marginBottom: 8 }}>{text}</div>
        <div style={{ fontFamily: "Courier New, monospace", fontSize: 7.5, color: "#9c8c74", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Watch → {watch}</div>
      </div>
    </div>
  );
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

function SectionHeader({ label, subtitle, isOpen, onToggle }: {
  label: string; subtitle: string; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "#e9e4da"}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "#f0ece2"}
      style={{
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        padding: "22px 48px",
        cursor: "pointer",
        background: "#f0ece2",
        position: "relative" as const,
        gap: "6px",
        borderBottom: "0.5px solid rgba(160,140,100,0.15)",
        transition: "background 0.15s ease",
        userSelect: "none" as const,
      }}
    >
      <div style={{
        position: "absolute" as const,
        right: "48px",
        top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "var(--font-mono, 'Courier New', monospace)",
        fontSize: "13px",
        color: "rgba(160,140,100,0.6)",
      }}>
        {isOpen ? "×" : "+"}
      </div>
      <div style={{
        fontFamily: "var(--font-mono, 'Courier New', monospace)",
        fontSize: "11px",
        fontWeight: "600",
        letterSpacing: "0.18em",
        textTransform: "uppercase" as const,
        color: "#2a1e0c",
        textAlign: "center",
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "var(--font-mono, 'Courier New', monospace)",
        fontSize: "8.5px",
        color: "#8a7a62",
        letterSpacing: "0.05em",
        textAlign: "center",
      }}>
        {subtitle}
      </div>
    </div>
  );
}

function Hero({ num, label }: { num: string; label: string }) {
  return (
    <div style={{ textAlign: "center", paddingBottom: "28px", borderBottom: "0.5px solid rgba(160,140,100,0.15)", marginBottom: "24px" }}>
      <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 56, fontWeight: 500, color: "#2a1e0c", lineHeight: 1, letterSpacing: "-1px" }}>{num}</div>
      <div style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)", fontSize: "10px", letterSpacing: "0.12em", color: "#8a7a62", maxWidth: 420, margin: "12px auto 0", lineHeight: 1.6 }}>{label}</div>
    </div>
  );
}

export default function InsightsSection({ top, chainState }: InsightsSectionProps) {
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    insights: false, connections: false, emerging: false, investment: false,
  });

  React.useEffect(() => {
    setOpenSections({ insights: false, connections: false, emerging: false, investment: false });
  }, [chainState]);

  const toggle = (key: string) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      background: "#f0ece2",
      borderTop: "0.5px solid rgba(160,140,100,0.15)",
      borderBottom: "0.5px solid rgba(160,140,100,0.2)",
      zIndex: 10,
    }}>

      {/* ── RAW MATERIAL INSIGHTS ─────────────────────────────────────────── */}
      {chainState === 1 && (
        <>
          <SectionHeader label="Key insights" subtitle="7 findings" isOpen={openSections.insights} onToggle={() => toggle("insights")} />
          {openSections.insights && (
            <div style={{ background: "white", padding: "24px 48px 32px", borderBottom: "0.5px solid rgba(160,140,100,0.15)" }}>
              <div style={{ maxWidth: 780, margin: "0 auto" }}>
                <Hero num="−270t" label="estimated annual germanium shortfall by 2030 — projected demand ~490t against supply capped at ~220t, with no new primary sources coming online at scale" />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {RAW_INSIGHTS.map(item => <InsightBox key={item.num} {...item} />)}
                </div>
              </div>
            </div>
          )}

          <SectionHeader label="Chain connections" subtitle="4 connections" isOpen={openSections.connections} onToggle={() => toggle("connections")} />
          {openSections.connections && (
            <div style={{ background: "white", padding: "24px 48px 32px", borderBottom: "0.5px solid rgba(160,140,100,0.15)" }}>
              <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: 8 }}>
                {RAW_CONNECTIONS.map(item => <ConnectionBox key={item.title} {...item} />)}
              </div>
            </div>
          )}

          <SectionHeader label="Emerging supply technologies" subtitle="3 technologies" isOpen={openSections.emerging} onToggle={() => toggle("emerging")} />
          {openSections.emerging && (
            <div style={{ background: "white", padding: "24px 48px 32px", borderBottom: "0.5px solid rgba(160,140,100,0.15)" }}>
              <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: 8 }}>
                {RAW_TECHNOLOGIES.map(({ title, meta, text }) => (
                  <div key={title} style={{
                    background: "white",
                    border: "0.5px solid rgba(192,176,128,0.3)",
                    borderLeft: "2px solid #5a8c6a",
                    borderRadius: 6,
                    padding: "14px 20px",
                    display: "flex",
                    gap: 16,
                    alignItems: "baseline",
                  }}>
                    <span style={{ fontSize: 11, color: "#5a8c6a", flexShrink: 0 }}>◈</span>
                    <div>
                      <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 13, fontWeight: 600, color: "#2a1e0c", marginBottom: 3 }}>{title}</div>
                      <div style={{ fontFamily: "Courier New, monospace", fontSize: 7.5, color: "#9c8c74", letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 6 }}>{meta}</div>
                      <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 13, color: "#4a3e2e", lineHeight: 1.65 }}>{text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <SectionHeader label="Investment angles" subtitle="6 angles" isOpen={openSections.investment} onToggle={() => toggle("investment")} />
          {openSections.investment && (
            <div style={{ background: "white", padding: "24px 48px 32px", borderBottom: "0.5px solid rgba(160,140,100,0.15)" }}>
              <div style={{ maxWidth: 780, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {RAW_CARDS.map(({ variant, ticker, name, desc }) => (
                  <div key={name} style={{
                    background: "white",
                    border: "0.5px solid rgba(192,176,128,0.3)",
                    borderLeft: `2px solid ${CARD_BORDER[variant]}`,
                    borderRadius: 6,
                    padding: "16px 18px",
                  }}>
                    <div style={{ fontFamily: "Courier New, monospace", fontSize: 7.5, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#9c8c74", marginBottom: 4 }}>{CARD_TYPE_LABEL[variant]}</div>
                    <div style={{ fontFamily: "Courier New, monospace", fontSize: 8, color: "#9c8c74", marginBottom: 4 }}>{ticker}</div>
                    <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 14, fontWeight: 600, color: "#2a1e0c", marginBottom: 6 }}>{name}</div>
                    <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 12, color: "#6b6458", lineHeight: 1.6 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── COMPONENT LAYER INSIGHTS ──────────────────────────────────────── */}
      {chainState === 2 && (
        <>
          <SectionHeader label="Key insights" subtitle="7 findings" isOpen={openSections.insights} onToggle={() => toggle("insights")} />
          {openSections.insights && (
            <div style={{ background: "white", padding: "24px 48px 32px", borderBottom: "0.5px solid rgba(160,140,100,0.15)" }}>
              <div style={{ maxWidth: 780, margin: "0 auto" }}>
                <Hero num="36×" label="more fiber required in an AI GPU rack than a traditional CPU rack — against a supply chain running at 100% capacity with an 18–24 month expansion lag" />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {COMP_INSIGHTS.map(item => <InsightBox key={item.num} {...item} />)}
                </div>
              </div>
            </div>
          )}

          <SectionHeader label="Chain connections" subtitle="4 connections" isOpen={openSections.connections} onToggle={() => toggle("connections")} />
          {openSections.connections && (
            <div style={{ background: "white", padding: "24px 48px 32px", borderBottom: "0.5px solid rgba(160,140,100,0.15)" }}>
              <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: 8 }}>
                {COMP_CONNECTIONS.map(item => <WatchConnectionBox key={item.title} {...item} />)}
              </div>
            </div>
          )}

          <SectionHeader label="Investment angles" subtitle="6 angles" isOpen={openSections.investment} onToggle={() => toggle("investment")} />
          {openSections.investment && (
            <div style={{ background: "white", padding: "24px 48px 32px", borderBottom: "0.5px solid rgba(160,140,100,0.15)" }}>
              <div style={{ maxWidth: 780, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {COMP_CARDS.map(({ ticker, name, desc }) => (
                  <div key={name} style={{
                    background: "white",
                    border: "0.5px solid rgba(192,176,128,0.3)",
                    borderLeft: "2px solid #5a7a9c",
                    borderRadius: 6,
                    padding: "16px 18px",
                  }}>
                    <div style={{ fontFamily: "Courier New, monospace", fontSize: 8, color: "#9c8c74", marginBottom: 4 }}>{ticker}</div>
                    <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 14, fontWeight: 600, color: "#2a1e0c", marginBottom: 8 }}>{name}</div>
                    <div style={{ fontFamily: "Courier New, monospace", fontSize: 7.5, height: "0.5px", background: "rgba(192,176,128,0.3)", marginBottom: 8 }} />
                    <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 12, color: "#6b6458", lineHeight: 1.6 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── SUBSYSTEM LAYER INSIGHTS ──────────────────────────────────────── */}
      {chainState === 3 && (
        <>
          <SectionHeader label="Key insights" subtitle="7 findings" isOpen={openSections.insights} onToggle={() => toggle("insights")} />
          {openSections.insights && (
            <div style={{ background: "white", padding: "24px 48px 32px", borderBottom: "0.5px solid rgba(160,140,100,0.15)" }}>
              <div style={{ maxWidth: 780, margin: "0 auto" }}>
                <Hero num="100%" label="global fiber optic preform lines are running at full capacity — at least one major US manufacturer has sold all inventory through 2026, with no new capacity possible before late 2027" />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {SUB_INSIGHTS.map(item => <InsightBox key={item.num} {...item} />)}
                </div>
              </div>
            </div>
          )}

          <SectionHeader label="Chain connections" subtitle="4 connections" isOpen={openSections.connections} onToggle={() => toggle("connections")} />
          {openSections.connections && (
            <div style={{ background: "white", padding: "24px 48px 32px", borderBottom: "0.5px solid rgba(160,140,100,0.15)" }}>
              <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: 8 }}>
                {SUB_CONNECTIONS.map(item => <WatchConnectionBox key={item.title} {...item} />)}
              </div>
            </div>
          )}

          <SectionHeader label="Investment angles" subtitle="6 angles" isOpen={openSections.investment} onToggle={() => toggle("investment")} />
          {openSections.investment && (
            <div style={{ background: "white", padding: "24px 48px 32px", borderBottom: "0.5px solid rgba(160,140,100,0.15)" }}>
              <div style={{ maxWidth: 780, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {SUB_CARDS.map(({ ticker, name, desc }) => (
                  <div key={name} style={{
                    background: "white",
                    border: "0.5px solid rgba(192,176,128,0.3)",
                    borderLeft: "2px solid #5a7a9c",
                    borderRadius: 6,
                    padding: "16px 18px",
                  }}>
                    <div style={{ fontFamily: "Courier New, monospace", fontSize: 8, color: "#9c8c74", marginBottom: 4 }}>{ticker}</div>
                    <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 14, fontWeight: 600, color: "#2a1e0c", marginBottom: 8 }}>{name}</div>
                    <div style={{ fontFamily: "Courier New, monospace", fontSize: 7.5, height: "0.5px", background: "rgba(192,176,128,0.3)", marginBottom: 8 }} />
                    <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 12, color: "#6b6458", lineHeight: 1.6 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
