"use client";

interface InsightsSectionProps {
  top: number;
}

function SectionDivider({ label, first = false }: { label: string; first?: boolean }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 20,
      marginTop: first ? 0 : 44,
      marginBottom: 28,
    }}>
      <div style={{ flex: 1, height: "0.5px", background: "rgba(192,176,128,0.3)" }} />
      <span style={{
        fontFamily: "Courier New, monospace",
        fontSize: 8,
        letterSpacing: "0.2em",
        textTransform: "uppercase" as const,
        color: "#9c8c74",
      }}>{label}</span>
      <div style={{ flex: 1, height: "0.5px", background: "rgba(192,176,128,0.3)" }} />
    </div>
  );
}

const INSIGHTS: { num: string; label: string; text: string }[] = [
  {
    num: "01",
    label: "Capture rate ceiling",
    text: "Only 7–17% of germanium passing through coal combustion is actually extracted — the rest is lost to slag. Supply is not constrained by deposit size but by industrial process efficiency. You cannot build a germanium mine. You can only burn more coal and recover more of what escapes.",
  },
  {
    num: "02",
    label: "China controls extraction",
    text: "Five of eight known active deposits are Chinese. All three active coal-hosted deposits are in China or sanctioned Russia. China controls ~83% of primary refining capacity. Export licensing has been active since August 2023 — and a full export ban on germanium to the US was imposed in December 2024.",
  },
  {
    num: "03",
    label: "Western supply is three companies",
    text: "Strip out China and Russia. Western accessible germanium supply is Umicore, 5N Plus, and PPM Pure Metals — combined estimated output ~75t/yr against global demand of ~220t/yr. The gap is structurally unbridgeable in the near term regardless of price.",
  },
  {
    num: "04",
    label: "The recycling trap",
    text: "Western recyclers feed primarily on fiber optic manufacturing scrap from Corning, Prysmian, and Fujikura. If Chinese export controls reduce fiber production, the scrap stream feeding western recyclers shrinks simultaneously. The western buffer partially collapses under the exact conditions it exists to protect against.",
  },
  {
    num: "05",
    label: "Red Dog supply cliff",
    text: "The world's largest zinc-germanium operation closes in 2031. No replacement has been identified. The US government's response — partnering with 5N Plus on domestic wafer capacity — addresses downstream processing but not upstream feed. After 2031, 5N Plus depends entirely on imported germanium concentrate.",
  },
  {
    num: "06",
    label: "DRC is the long game",
    text: "Big Hill tailings contain 700+ tonnes of germanium — $2B+ at current prices — and could supply 30% of global demand when fully ramped. But first shipment reached Umicore in October 2024. Realistic supply contribution before 2028 is marginal. This is a structural story, not a near-term supply fix.",
  },
  {
    num: "07",
    label: "Price is the only release valve",
    text: "Germanium rose 124% from China's export control announcement to the October 2024 peak — and a full US export ban followed in December 2024. At $2,900/kg+ the economics of alternative extraction are becoming viable. Further disruption triggers a price dislocation that eventually makes alternatives bankable — but with a 5–7 year supply response lag.",
  },
];

const CONNECTIONS: { title: string; text: string }[] = [
  {
    title: "Corning funds Umicore's supply security",
    text: "Corning's fiber manufacturing generates the germanium scrap that is Umicore's primary recycled feed. Every kilometer of fiber drawn creates waste germanium that flows to Hoboken. Corning's AI datacenter capex cycle directly drives Umicore's recycled supply volume. These two companies are invisibly coupled across two layers of the supply chain — one in the component layer, one in the raw material layer.",
  },
  {
    title: "AI infrastructure buildout tightens its own supply chain",
    text: "Hyperscalers committing $250B+ in datacenter capex in 2025 drive fiber demand, which drives germanium demand, which tightens supply already constrained by Chinese export controls. AI is simultaneously the largest demand driver and the most exposed end user to a germanium supply shock. The companies building AI infrastructure are inadvertently accelerating the constraint they depend on.",
  },
  {
    title: "China's export controls are structurally bullish for Umicore",
    text: "Umicore sources zero germanium from China. Every tonne China restricts forces western buyers to source from Umicore instead — increasing demand for its output, improving pricing power, and validating its supply diversification strategy. Chinese export controls are structurally the best thing that could happen to Umicore's market position.",
  },
  {
    title: "Russia sanctions quietly removed 9% of global supply in 2022",
    text: "JSC Germanium historically exported 80%+ of its ~20t/yr output to western markets. Post-2022 sanctions cut that off entirely — ~20t/yr removed from western accessible supply with no announcement and almost no media coverage. The germanium supply shock began before China's export controls. Western markets have operated with structurally reduced supply since early 2022.",
  },
];

const TECHNOLOGIES: { title: string; meta: string; text: string }[] = [
  {
    title: "High-efficiency fly ash extraction",
    meta: "Anactisis · Virginia Tech / Phinix · Army SBIR + DOE funded · TRL 3–4 · Timeline 5–7 years",
    text: "Current western extraction yields only 7–17% of available germanium from fly ash. Lab results demonstrate 90%+ recovery is achievable with optimized hydrometallurgical processes. Western coal power plant waste ash contains meaningful germanium — but at ~15 ppm vs 850 ppm at Lincang, processing volumes required are 50x higher. Anactisis (Army SBIR, Penn State) and Virginia Tech (DOE/Rio Tinto) are the most advanced US efforts. If scaled, this unlocks domestic germanium from existing waste streams without new deposits.",
  },
  {
    title: "Copper and bauxite byproduct recovery",
    meta: "Missouri S&T · Rio Tinto grant $875K · TRL 2–3 · Timeline 7–10 years",
    text: "Germanium occurs in copper refinery anode slimes and bauxite processing liquor — both currently discarded. Missouri S&T demonstrated extraction from copper waste streams using chemical dissolution, backed by an $875K Rio Tinto grant. If adopted at scale by major copper refiners (Aurubis, Codelco, Glencore), this could add 20–40t/yr of western supply from existing industrial infrastructure. Requires no new mines — only retrofits to existing refinery operations.",
  },
  {
    title: "US DoD as demand anchor — the investment enabler",
    meta: "Pentagon $540M+ critical minerals · EO 14241 · DPA Title III · Active 2025",
    text: "The Pentagon has invested $540M+ in US critical mineral projects and Executive Order 14241 authorizes DoD to directly facilitate private capital into domestic mineral production. DPA Title III funds have already gone to germanium wafer production at 5N Plus. This government backstop creates a guaranteed demand floor that makes domestic germanium economics viable independent of Chinese price manipulation — historically the primary barrier to private investment. The DoD is the template for any future domestic entrant.",
  },
];

type CardVariant = "opp" | "risk" | "drc";
const CARDS: { variant: CardVariant; ticker: string; name: string; desc: string }[] = [
  {
    variant: "opp",
    ticker: "UMI · Euronext Brussels",
    name: "Umicore",
    desc: "Western germanium supply hub. Exclusive DRC offtake, EU Critical Raw Materials Act backing, >50% recycled feed. The only western company whose germanium position structurally improves as China tightens export controls.",
  },
  {
    variant: "opp",
    ticker: "VNP · TSX",
    name: "5N Plus",
    desc: "US DoD strategic partner. Utah germanium wafer facility backed by defense contracts and DPA Title III funding. Most direct investment vehicle for US germanium supply independence. Contracted defense revenue de-risks the model through the Red Dog transition.",
  },
  {
    variant: "opp",
    ticker: "TECK · NYSE / TSX",
    name: "Teck Resources",
    desc: "Indirect germanium exposure via Red Dog through 2031. Primary thesis is copper. Germanium byproduct provides asymmetric upside on further price spikes. Post-Anglo American merger, future of Red Dog operations unclear.",
  },
  {
    variant: "risk",
    ticker: "Full US ban · December 2024",
    name: "China export controls",
    desc: "Escalated from licensing (Aug 2023) to a full export ban to the US (Dec 2024). USGS estimates a full dual gallium-germanium ban could shave $3.4B from US GDP. No western supply response possible within 3 years at current scale.",
  },
  {
    variant: "risk",
    ticker: "Mine closes 2031",
    name: "Red Dog supply cliff",
    desc: "One of the only non-Chinese zinc-germanium sources closes in 2031 with no replacement identified. Removes ~5–10t/yr from western supply. Slow-moving and likely underpriced by markets given the 5-year horizon.",
  },
  {
    variant: "drc",
    ticker: "Ramping 2024–2028",
    name: "DRC Big Hill ramp",
    desc: "700+ t Ge in Lubumbashi tailings. Exclusive Umicore offtake. If ramped to full capacity, structurally transforms the non-Chinese supply picture. Play via Umicore. DRC state ownership and unproven ramp timeline are the primary risks.",
  },
];

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

export default function InsightsSection({ top }: InsightsSectionProps) {
  return (
    <div style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      padding: "48px 48px",
      background: "#f2ede3",
      zIndex: 10,
      display: "flex",
      justifyContent: "center",
    }}>
    <div style={{ maxWidth: 780, width: "100%" }}>

      {/* SECTION 1 — KEY INSIGHTS */}
      <SectionDivider label="Key Insights" first />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {INSIGHTS.map(({ num, label, text }) => (
          <div key={num} style={{
            background: "white",
            border: "0.5px solid rgba(192,176,128,0.3)",
            borderRadius: 6,
            padding: "14px 20px",
            display: "flex",
            alignItems: "baseline",
            gap: 20,
          }}>
            <span style={{
              fontFamily: "Courier New, monospace",
              fontSize: 9,
              color: "#c8bc9a",
              width: 18,
              flexShrink: 0,
            }}>{num}</span>
            <span style={{
              fontFamily: "Courier New, monospace",
              fontSize: 8.5,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "#a89060",
              width: 180,
              flexShrink: 0,
            }}>{label}</span>
            <span style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 13,
              color: "#4a3e2e",
              lineHeight: 1.65,
            }}>{text}</span>
          </div>
        ))}
      </div>

      {/* SECTION 2 — CHAIN CONNECTIONS */}
      <SectionDivider label="Chain Connections" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {CONNECTIONS.map(({ title, text }) => (
          <div key={title} style={{
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
              <div style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#2a1e0c",
                marginBottom: 5,
              }}>{title}</div>
              <div style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: 13,
                color: "#4a3e2e",
                lineHeight: 1.65,
                fontStyle: "italic",
              }}>{text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 3 — EMERGING SUPPLY TECHNOLOGIES */}
      <SectionDivider label="Emerging Supply Technologies" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {TECHNOLOGIES.map(({ title, meta, text }) => (
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
              <div style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#2a1e0c",
                marginBottom: 3,
              }}>{title}</div>
              <div style={{
                fontFamily: "Courier New, monospace",
                fontSize: 7.5,
                color: "#9c8c74",
                letterSpacing: "0.06em",
                textTransform: "uppercase" as const,
                marginBottom: 6,
              }}>{meta}</div>
              <div style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: 13,
                color: "#4a3e2e",
                lineHeight: 1.65,
              }}>{text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 4 — INVESTMENT ANGLES */}
      <SectionDivider label="Investment Angles" />
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 8,
      }}>
        {CARDS.map(({ variant, ticker, name, desc }) => (
          <div key={name} style={{
            background: "white",
            border: "0.5px solid rgba(192,176,128,0.3)",
            borderLeft: `2px solid ${CARD_BORDER[variant]}`,
            borderRadius: 6,
            padding: "16px 18px",
          }}>
            <div style={{
              fontFamily: "Courier New, monospace",
              fontSize: 7.5,
              textTransform: "uppercase" as const,
              letterSpacing: "0.1em",
              color: "#9c8c74",
              marginBottom: 4,
            }}>{CARD_TYPE_LABEL[variant]}</div>
            <div style={{
              fontFamily: "Courier New, monospace",
              fontSize: 8,
              color: "#9c8c74",
              marginBottom: 4,
            }}>{ticker}</div>
            <div style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 14,
              fontWeight: 600,
              color: "#2a1e0c",
              marginBottom: 6,
            }}>{name}</div>
            <div style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 12,
              color: "#6b6458",
              lineHeight: 1.6,
            }}>{desc}</div>
          </div>
        ))}
      </div>

    </div>
    </div>
  );
}
