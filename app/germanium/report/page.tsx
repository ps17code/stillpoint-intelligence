"use client";

const MONO = "'Geist Mono', 'Courier New', monospace";
const SANS = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const BG   = "#F7F6F3";

// ── Shared style helpers ───────────────────────────────────────────────────────
const tag   = { fontFamily: MONO, fontSize: 7, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#A8A69E" };
const sectionH = { fontFamily: SANS, fontSize: 18, fontWeight: 600, color: "#1C1E21", marginTop: 40, marginBottom: 4 };
const teaser   = { fontFamily: SANS, fontSize: 14, fontWeight: 500, color: "#6B6860", fontStyle: "italic" as const, marginBottom: 20 };
const body     = { fontFamily: SANS, fontSize: 13, color: "#4B4A46", lineHeight: 1.8, marginBottom: 16 };
const subH     = { fontFamily: SANS, fontSize: 14, fontWeight: 600, color: "#1C1E21", marginTop: 24, marginBottom: 8 };
const b        = { color: "#1C1E21", fontWeight: 600 };

// ── Table helpers ──────────────────────────────────────────────────────────────
function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ background: "#ECEAE5", fontFamily: MONO, fontSize: 7, textTransform: "uppercase" as const, letterSpacing: "0.04em", color: "#6B6860", padding: "8px 12px", border: "0.5px solid #D4D2CC", textAlign: "left" as const, fontWeight: 600 }}>
      {children}
    </th>
  );
}
function Td({ children, shade }: { children: React.ReactNode; shade?: boolean }) {
  return (
    <td style={{ background: shade ? "#FAFAF8" : "white", fontFamily: SANS, fontSize: 11, color: "#4B4A46", padding: "8px 12px", border: "0.5px solid #D4D2CC", verticalAlign: "top" as const }}>
      {children}
    </td>
  );
}
function Badge({ level }: { level: "HIGH" | "MEDIUM" | "LOW" }) {
  const styles: Record<string, React.CSSProperties> = {
    HIGH:   { color: "#065F46", background: "#E1F5EE" },
    MEDIUM: { color: "#854F0B", background: "#FAEEDA" },
    LOW:    { color: "#791F1F", background: "#FCEBEB" },
  };
  return <span style={{ fontFamily: MONO, fontSize: 6, padding: "2px 6px", borderRadius: 2, ...styles[level] }}>{level}</span>;
}
function Divider() {
  return <div style={{ height: "0.5px", background: "#D4D2CC", margin: "24px 0" }} />;
}

export default function GermaniumReport() {
  const handleBack  = () => { window.location.href = "/germanium"; };
  const handlePrint = () => { window.print(); };

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          @page { margin: 20mm 16mm; }
        }
      `}</style>

      <div style={{ background: BG, minHeight: "100vh" }}>

        {/* ── Nav bar ────────────────────────────────────────────────── */}
        <div className="no-print" style={{ position: "fixed", top: 0, left: 0, right: 0, height: 36, background: "#111110", borderBottom: "0.5px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 20px", zIndex: 100 }}>
          <button onClick={handleBack} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", flex: 1, display: "flex", alignItems: "center" }}>
            <span style={{ fontFamily: "'DM Sans', Inter, sans-serif", fontSize: 11, fontWeight: 300, letterSpacing: "0.04em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>Stillpoint</span>
            <span style={{ display: "inline-block", width: 5 }} />
            <span style={{ fontFamily: "'DM Sans', Inter, sans-serif", fontSize: 11, fontWeight: 200, letterSpacing: "0.04em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" }}>Intelligence</span>
          </button>
          <div style={{ display: "flex", alignItems: "center" }}>
            {[
              { label: "Germanium", active: true },
              { label: "GeO₂ / GeCl₄", active: false },
              { label: "Fiber Optics", active: false },
              { label: "AI Datacenter", active: false },
            ].map((step, i) => (
              <div key={step.label} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.15)", margin: "0 8px" }} />}
                <span style={{ fontFamily: SANS, fontSize: 10.5, color: step.active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)", borderBottom: step.active ? "1px solid rgba(200,180,140,0.4)" : "none", paddingBottom: step.active ? 1 : 0 }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <span style={{ fontFamily: MONO, fontSize: 6, letterSpacing: "0.08em", color: "rgba(255,255,255,0.12)", textTransform: "uppercase" }}>SI-2026-GE-RAW · CONFIDENTIAL</span>
          </div>
        </div>

        {/* ── Fixed controls ──────────────────────────────────────────── */}
        <div className="no-print" style={{ position: "fixed", top: 48, left: 0, right: 0, zIndex: 90, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 calc((100vw - 720px) / 2)", maxWidth: "100vw" }}>
          <button onClick={handleBack} style={{ fontFamily: MONO, fontSize: 8, color: "#8A8880", background: "none", border: "none", cursor: "pointer", padding: "8px 0" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#4B4A46"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#8A8880"; }}>
            ← Back to chain
          </button>
          <button onClick={handlePrint} style={{ fontFamily: MONO, fontSize: 8, padding: "7px 14px", border: "0.5px solid #D4D2CC", background: BG, cursor: "pointer", borderRadius: 2, color: "#4B4A46" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#ECEAE5"; }}
            onMouseLeave={e => { e.currentTarget.style.background = BG; }}>
            Download PDF →
          </button>
        </div>

        {/* ── Main content ────────────────────────────────────────────── */}
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "96px 60px 80px" }}>

          {/* ── Report header ─────────────────────────────────────────── */}
          <div style={{ ...tag, marginBottom: 16 }}>
            Stillpoint Intelligence · Proprietary · SI-2026-GE-RAW
          </div>
          <h1 style={{ fontFamily: SANS, fontSize: 24, fontWeight: 600, color: "#1C1E21", lineHeight: 1.4, margin: 0 }}>
            Germanium Raw Material Layer — Chain Intelligence Report
          </h1>
          <p style={{ fontFamily: SANS, fontSize: 13, color: "#6B6860", lineHeight: 1.6, marginTop: 8, marginBottom: 0 }}>
            A comprehensive analysis of germanium supply constraints, bottlenecks, geopolitical risk, catalysts, emerging technology, key companies, and investment implications.
          </p>
          <div style={{ ...tag, marginTop: 12 }}>Updated April 2026</div>
          <Divider />

          {/* ── Executive Summary ─────────────────────────────────────── */}
          <div style={{ fontFamily: MONO, fontSize: 8, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#1C1E21", marginBottom: 12 }}>
            Executive Summary
          </div>
          <p style={body}>
            Germanium is a trace metal recovered as a byproduct of zinc smelting and coal processing — <span style={b}>never mined on its own.</span> It is the critical dopant in fiber optic cables, the lens material in infrared imaging systems, the substrate for satellite solar cells, and a key input in advanced semiconductors. There are 8 deposits globally with economically viable germanium concentrations, <span style={b}>5 of which are in China.</span> Roughly 130–140 tonnes per year is extracted and refined as primary supply, with another 60–70 tonnes recovered through recycling — dominated by Umicore in Belgium and 5N Plus in Canada. Of the ~220 tonnes total, <span style={b}>only 65–85 tonnes is reliably accessible to western industry. Fiber optics alone requires 77–97 tonnes per year.</span>
          </p>
          <p style={body}>
            The supply gap is not a future scenario — it is already structurally open. China controls ~80% of primary refining capacity and has demonstrated twice since 2023 that it will use germanium as a geopolitical instrument. The November 2025 suspension of the US export ban was explicitly linked to the broader trade truce and expires on <span style={b}>November 27, 2026.</span> After that date, China can reimpose restrictions with a single announcement. The nearest western alternative — the Umicore-STL partnership in the DRC — adds at most 10–20t/yr and carries significant execution risk. The recycling ceiling is structurally fixed. Red Dog, the only meaningful non-Chinese primary mine outside Russia, closes in 2031 with no identified replacement.
          </p>
          <p style={body}>
            The investment case is durable: supply is constrained by geology, policy, and economics simultaneously, while demand accelerates from three independent drivers — AI datacenter fiber buildout, BEAD broadband construction, and defense stockpiling. The companies best positioned to capture this imbalance are those controlling western processing capacity: Umicore, 5N Plus, and the emerging Apex/DoD-backed supply chain in the United States.
          </p>

          {/* ── Data Confidence Table ─────────────────────────────────── */}
          <div style={{ marginTop: 28, marginBottom: 8, fontFamily: MONO, fontSize: 8, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#1C1E21" }}>
            Data Confidence
          </div>
          <div style={{ overflowX: "auto" as const }}>
            <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
              <thead>
                <tr><Th>Claim</Th><Th>Confidence</Th><Th>Source basis</Th></tr>
              </thead>
              <tbody>
                {[
                  ["~220t/yr global supply", "HIGH", "USGS Mineral Commodity Summaries 2025; Roskill"],
                  ["65–85t western-accessible supply", "HIGH", "Umicore annual reports; 5N Plus filings; cross-referenced Roskill"],
                  ["China ~80% of primary refined output", "HIGH", "USGS; Wood Mackenzie; Chinese industry data"],
                  ["$8,597/kg Ge metal spot (Mar 2026)", "HIGH", "Fastmarkets pricing service"],
                  ["17% capture rate at Wulantuga", "MEDIUM", "Industry analyst estimates; limited primary disclosure"],
                  ["77–97t/yr fiber optic Ge demand", "MEDIUM", "Corning/Prysmian industry data; model extrapolation"],
                  ["DRC Big Hill 700t Ge potential", "MEDIUM", "Umicore investor presentations; geological survey"],
                  ["~325t demand by 2026 (AI datacenter)", "LOW", "Internal model; analyst estimates; hyperscaler capex guidance"],
                ].map(([claim, level, source], i) => (
                  <tr key={i}>
                    <Td shade={i % 2 === 1}>{claim}</Td>
                    <Td shade={i % 2 === 1}><Badge level={level as "HIGH" | "MEDIUM" | "LOW"} /></Td>
                    <Td shade={i % 2 === 1}>{source}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Divider />

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 1 — SUPPLY CONSTRAINTS
          ═══════════════════════════════════════════════════════════════ */}
          <h2 style={sectionH}>1. Supply Constraints</h2>
          <p style={teaser}>A structural shortage of raw germanium isn't a risk — it's the baseline</p>

          <p style={body}>
            There is no such thing as a germanium mine. Even if germanium prices triple, nobody opens a new mine for it. <span style={b}>Germanium production is governed by zinc prices and coal policy — not germanium demand.</span> If a zinc mine closes because zinc becomes uneconomic, germanium supply drops to zero from that source regardless of how expensive germanium gets. This byproduct dependency is the foundational constraint on the entire supply chain: supply cannot be independently ramped.
          </p>
          <p style={body}>
            Of all the germanium that theoretically passes through the world's coal plants and zinc smelters each year, only approximately <span style={b}>17% is actually captured.</span> At Wulantuga alone — Inner Mongolia's primary germanium deposit — an estimated ~137 tonnes passes through the coal burned annually, but only 20–35 tonnes is recovered. Recovery requires specialist acid-leach circuits costing millions to install, and they are only economic when germanium prices are high enough to justify the capital spend. Even then, buildout takes years.
          </p>

          <div style={subH}>Global supply waterfall</div>
          <div style={{ overflowX: "auto" as const, marginBottom: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
              <thead>
                <tr><Th>Source</Th><Th>Volume (t/yr)</Th><Th>Western-accessible</Th><Th>Notes</Th></tr>
              </thead>
              <tbody>
                {[
                  ["Chinese primary (Lincang, Wulantuga, Huize)", "~120", "No", "Subject to export controls since Aug 2023"],
                  ["Smaller Chinese refiners", "~14", "No", "State-linked; same export control regime"],
                  ["Russian JSC Germanium", "~20", "No", "Blocked by sanctions since Feb 2022"],
                  ["Umicore (Belgium)", "~40–50", "Yes", "Scrap recycling + DRC concentrate + zinc byproduct"],
                  ["5N Plus (Canada/Utah)", "~10–15", "Yes", "DoD-backed; closed-loop tolling model"],
                  ["PPM Pure Metals (Germany)", "~5–10", "Yes", "Small-scale; zinc byproduct"],
                  ["Global total", "~220", "~80t", "Gap against fiber demand alone: 0–17t deficit"],
                ].map(([source, vol, access, notes], i) => (
                  <tr key={i}>
                    <Td shade={i % 2 === 1}>{source}</Td>
                    <Td shade={i % 2 === 1}>{vol}</Td>
                    <Td shade={i % 2 === 1}>{access}</Td>
                    <Td shade={i % 2 === 1}>{notes}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={subH}>Nine structural constraints on supply growth</div>
          <p style={body}>
            <span style={b}>1. Byproduct dependency.</span> Germanium production is set by zinc and coal economics. It cannot be independently ramped in response to demand signals.
          </p>
          <p style={body}>
            <span style={b}>2. Geographic concentration.</span> Five of eight viable deposits are in China. Russia's deposit is under sanctions. Red Dog closes in 2031. That leaves one emerging source — DRC — that is only beginning to ramp.
          </p>
          <p style={body}>
            <span style={b}>3. Low capture rates.</span> At ~17%, the majority of germanium passing through industrial processes is lost. Installing recovery circuits requires capital commitment timed to germanium price cycles, not demand cycles.
          </p>
          <p style={body}>
            <span style={b}>4. Western recycling oligopoly.</span> Umicore dominates western recycling through scale and tolling agreements that give it first access to fiber manufacturing scrap. Feedstock access — not technology — is the barrier to new entrants.
          </p>
          <p style={body}>
            <span style={b}>5. Recycling ceiling.</span> Recycling can only return what was previously consumed. Total western recycling cannot grow faster than cumulative historical western consumption. As AI-driven demand accelerates, recycling becomes a smaller fraction of total need.
          </p>
          <p style={body}>
            <span style={b}>6. Self-limiting recycling loop.</span> If Chinese export controls reduce western fiber production, the scrap stream feeding western recyclers shrinks simultaneously. The mechanism designed to cushion a supply shock actually amplifies it.
          </p>
          <p style={body}>
            <span style={b}>7. Lead times.</span> New western germanium recovery capacity takes 3–5 years to build. A mine-to-first-production cycle is 7–10 years. There is no short-term supply response.
          </p>
          <p style={body}>
            <span style={b}>8. Red Dog depletion.</span> Teck's Red Dog mine in Alaska — the only significant non-Chinese, non-Russian primary germanium source — has a mine life ending in 2031. No replacement has been identified in the western supply chain.
          </p>
          <p style={body}>
            <span style={b}>9. Price insensitivity.</span> High germanium prices do not unlock new mines. They may improve recovery rates at existing facilities, but the capital cycle for meaningful new production is measured in years, not months.
          </p>

          <Divider />

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 2 — BOTTLENECKS
          ═══════════════════════════════════════════════════════════════ */}
          <h2 style={sectionH}>2. Bottlenecks</h2>
          <p style={teaser}>One facility in Belgium stands between western industry and a germanium blackout</p>

          <p style={body}>
            Supply constraints explain why germanium supply can't grow. Bottlenecks answer a different question: <span style={b}>where does the existing supply chain break if a single node fails?</span> The germanium raw material layer has five identifiable chokepoints, and they are concentrated in a single company.
          </p>

          <div style={subH}>The five chokepoints</div>

          <p style={body}>
            <span style={b}>Bottleneck 1 — Sole western refiner.</span> Umicore's Hoboken facility in Belgium is the only western refinery operating at scale for germanium. There is no second western refiner with comparable throughput. If Hoboken goes offline — fire, labor dispute, regulatory action — western industry has no backup.
          </p>
          <p style={body}>
            <span style={b}>Bottleneck 2 — Red Dog mine closure.</span> Teck's Red Dog mine in Alaska is the primary western source of primary germanium concentrate. Its scheduled closure in 2031 removes the largest non-Chinese, non-Russian primary supply source with no identified western replacement.
          </p>
          <p style={body}>
            <span style={b}>Bottleneck 3 — Russian sanctions.</span> JSC Germanium in Russia was a meaningful alternative supplier before February 2022. Sanctions have permanently closed this channel for western buyers. The ~20 t/yr that previously moved through this route now goes only to buyers willing to operate in sanctioned markets.
          </p>
          <p style={body}>
            <span style={b}>Bottleneck 4 — DRC dependency for future primary supply.</span> The Umicore-STL Big Hill partnership in the Democratic Republic of Congo is the only emerging western primary supply source. It holds 700+ tonnes of germanium potential and began shipping concentrate in October 2024. But DRC operating environment adds significant execution risk: political instability, logistical challenges, and the concentration of all new western primary hope in a single unstable jurisdiction.
          </p>
          <p style={body}>
            <span style={b}>Bottleneck 5 — Recycling feedstock concentration.</span> Umicore controls the dominant share of western recycling through tolling agreements with major fiber manufacturers — Corning, Prysmian, Fujikura. These agreements give Umicore right-of-first-refusal on germanium scrap. No competing western recycler has comparable feedstock access.
          </p>

          <div style={subH}>Compounding risk</div>
          <p style={body}>
            <span style={b}>Umicore is the chokepoint across three of the five bottlenecks:</span> sole western refiner (#1), DRC feedstock partner (#4), and dominant recycling feedstock controller (#5). A single corporate event — a strategic restructuring (the company launched "CORE" in March 2025 refocusing on core businesses), a capacity reduction, or a major operational incident — would cascade through the majority of non-Chinese germanium supply simultaneously.
          </p>
          <p style={body}>
            This concentration risk is not theoretical. Umicore's CEO Bart Sap launched a cost-reduction strategy in 2025 citing pressure from the battery materials segment. Any decision to rationalize capacity in the Specialty Materials division — the unit that produces germanium — would directly constrain western supply at a moment of peak demand.
          </p>

          <div style={{ overflowX: "auto" as const, marginBottom: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
              <thead>
                <tr><Th>Bottleneck</Th><Th>Single point of failure</Th><Th>Failure mode</Th><Th>Recovery time</Th></tr>
              </thead>
              <tbody>
                {[
                  ["Western refiner", "Umicore Hoboken", "Operational, strategic, or regulatory", "3–5 years"],
                  ["Western primary mine", "Red Dog (Teck)", "Scheduled closure 2031 — no replacement", "7–10 years (new mine)"],
                  ["Eastern supply", "JSC Germanium (Russia)", "Sanctions — already failed", "Indefinite"],
                  ["New primary supply", "DRC / Big Hill", "Political instability, execution risk", "2–4 years delay"],
                  ["Recycling feedstock", "Umicore tolling network", "Contract termination or capacity reduction", "2–3 years"],
                ].map(([bn, spof, fm, rt], i) => (
                  <tr key={i}>
                    <Td shade={i % 2 === 1}>{bn}</Td>
                    <Td shade={i % 2 === 1}>{spof}</Td>
                    <Td shade={i % 2 === 1}>{fm}</Td>
                    <Td shade={i % 2 === 1}>{rt}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Divider />

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 3 — GEOPOLITICAL RISK
          ═══════════════════════════════════════════════════════════════ */}
          <h2 style={sectionH}>3. Geopolitical Risk</h2>
          <p style={teaser}>China has proven it can turn germanium supply on and off at will</p>

          <p style={body}>
            Unlike most commodity market supply risks — which are probabilistic — China's export control capability over germanium is a demonstrated fact. Beijing has toggled germanium supply twice in 18 months, using it as a diplomatic instrument with measurable precision. <span style={b}>The question is not whether China will use this lever again. The question is when, and under what conditions.</span>
          </p>

          <div style={subH}>The control timeline</div>

          <div style={{ overflowX: "auto" as const, marginBottom: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
              <thead>
                <tr><Th>Date</Th><Th>Event</Th><Th>Effect on western supply</Th></tr>
              </thead>
              <tbody>
                {[
                  ["August 2023", "China introduces export licensing for Ge and Ga", "Exports fell ~55% within 6 months; spot prices rose ~200%"],
                  ["December 2024", "China bans all Ge exports to the US", "Complete cutoff of Chinese-origin Ge for US buyers"],
                  ["November 2025", "Suspension of US ban under trade truce", "Exports partially resume; licensing framework remains in place"],
                  ["November 27, 2026", "Suspension expiration date", "China can reimpose full ban with single announcement"],
                ].map(([date, event, effect], i) => (
                  <tr key={i}>
                    <Td shade={i % 2 === 1}>{date}</Td>
                    <Td shade={i % 2 === 1}>{event}</Td>
                    <Td shade={i % 2 === 1}>{effect}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={subH}>Why the suspension doesn't resolve the risk</div>
          <p style={body}>
            The November 2025 suspension was explicitly linked to the broader US-China trade truce — not to any structural change in China's export control framework. <span style={b}>The MOFCOM licensing regime remains fully in force.</span> Chinese exports since the suspension have required individual licenses, creating a slow-rolling approval process that dampens supply even during the "open" period. Any deterioration in US-China relations — trade, Taiwan, technology sanctions — can retrigger the full ban overnight.
          </p>
          <p style={body}>
            During the licensing period (August 2023 – November 2024), Chinese exports redirected to Europe: Belgium received 33% of licensed exports, Germany 32%, Japan 6%. This suggests Chinese policy was selective — permitting supply to reach western fiber manufacturers via European intermediaries while maintaining pressure on direct US procurement. If China extends restrictions to EU and Japanese buyers, the last remaining supply channels for western industry collapse.
          </p>

          <div style={subH}>The Russia dimension</div>
          <p style={body}>
            JSC Germanium in Krasnoyarsk, Russia, was historically a meaningful second non-Chinese source — producing approximately 20 tonnes per year. Western sanctions following the February 2022 invasion of Ukraine permanently closed this channel. Russia's germanium production now goes exclusively to China and non-sanctioned buyers. The ~20 t/yr that previously diversified western supply is permanently unavailable.
          </p>

          <div style={subH}>DRC political risk</div>
          <p style={body}>
            The DRC is simultaneously the most promising new western primary germanium source and one of the highest-risk operating environments in the world. The Big Hill tailings project in Katanga is operated by Société de Traitement du Terril de Lubumbashi (STL) in partnership with Umicore. Political instability in eastern DRC — including M23 rebel activity — creates operational disruption risk. <span style={b}>Concentrating all new western primary supply hope in a single DRC partnership is a geopolitical risk of a different kind.</span>
          </p>

          <Divider />

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 4 — CATALYSTS
          ═══════════════════════════════════════════════════════════════ */}
          <h2 style={sectionH}>4. Catalysts</h2>
          <p style={teaser}>$600B in hyperscaler capex and BEAD construction converge in 2026</p>

          <p style={body}>
            Catalysts are specific, dateable events that could materially shift germanium supply-demand dynamics. <span style={b}>2026 is the convergence year where multiple tightening catalysts hit simultaneously,</span> while easing catalysts are uniformly 2–5 years from material impact. The asymmetry is significant.
          </p>

          <div style={subH}>Near-term tightening catalysts (2026)</div>
          <p style={body}>
            <span style={b}>China export ban suspension expires — November 27, 2026.</span> This is the single most important near-term catalyst. After November 27, Beijing can reimpose the full ban with a single announcement. Any supply chain plan built on resumed Chinese exports has a hard expiration date. Buyers who have not secured non-Chinese supply by this date face a potential overnight disruption.
          </p>
          <p style={body}>
            <span style={b}>BEAD fiber construction ramps — 2026–2030.</span> The $42.5 billion federal broadband program is transitioning from state planning (32 of 56 states and territories have approved initial proposals as of Q1 2026) to active construction. When BEAD enters its buildout phase, it will pull on the same germanium-dependent fiber supply chain that AI datacenter construction is already straining. BEAD alone is expected to require approximately 40–60 million fiber-km over 4 years — roughly 15–25 tonnes of additional germanium demand per year.
          </p>
          <p style={body}>
            <span style={b}>Hyperscaler capex acceleration — 2026 peak.</span> The five major hyperscalers (Amazon, Google, Meta, Microsoft, Oracle) have collectively guided to $660–690 billion in 2026 infrastructure capex — a 40%+ increase year-over-year. AI training and inference facilities require dense fiber interconnect within campuses, multiplying per-facility germanium consumption relative to traditional cloud datacenters.
          </p>

          <div style={subH}>Defense and strategic stockpiling</div>
          <p style={body}>
            <span style={b}>DoD Defense Production Act funding — ongoing.</span> The Department of Defense awarded $14.4 million to 5N Plus in April 2024 under the DPA to expand germanium wafer production capacity at its facility in St-Laurent, Quebec, and its US processing operations. USGS classified germanium among the highest-risk critical minerals in 2025. Further DPA funding rounds are expected, with a potential focus on domestic refining capacity to reduce reliance on Canadian processing.
          </p>

          <div style={subH}>Medium-term easing catalysts (2027–2030)</div>
          <p style={body}>
            <span style={b}>DRC / Umicore Big Hill reaches production scale — 2027–2029.</span> The most important easing catalyst. If the partnership operates without disruption, it could add 10–20t/yr of western primary supply within 3–5 years. At the upper end, this meaningfully improves the western supply balance. But DRC execution risk is high, and this remains the most uncertain element of the easing scenario.
          </p>
          <p style={body}>
            <span style={b}>Apex Mining / Reeder Road germanium — 2027–2028.</span> Apex Mining's proposed germanium recovery project in the Pacific Northwest, and the coal ash recovery projects backed by DoD grants, represent the first generation of US domestic supply. Combined potential: 5–15 t/yr. Timeline dependent on regulatory approvals and capital availability.
          </p>
          <p style={body}>
            <span style={b}>Hollow-core fiber commercialization — 2028–2030.</span> The most credible long-term technology threat to the germanium supply thesis. Hollow-core fiber transmits light through air rather than germanium-doped glass, eliminating germanium from the fiber value chain entirely. Microsoft acquired Lumenisity in 2022 and is deploying HCF in specific high-bandwidth datacenter interconnect applications. At current technology maturity, HCF is too fragile and expensive for widespread deployment — but a 5-year commercial ramp from 2026 would begin to erode demand growth by 2030.
          </p>
          <p style={body}>
            <span style={b}>China-US trade normalization — conditional.</span> The November 2025 suspension demonstrates that full normalization is possible. If China permanently lifts the licensing regime — likely as part of a broader trade agreement — western-accessible supply would roughly double overnight, collapsing the supply premium. Rare earth precedent suggests western buyers diversify permanently even after normalization. The price effect would be significant but temporary.
          </p>

          <Divider />

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 5 — EMERGING TECHNOLOGY
          ═══════════════════════════════════════════════════════════════ */}
          <h2 style={sectionH}>5. Emerging Technology</h2>
          <p style={teaser}>AI can find zinc deposits in days — but germanium inside takes a decade to reach market</p>

          <p style={body}>
            Four technology vectors are converging on the germanium supply problem. They operate on fundamentally different timescales: <span style={b}>AI-driven exploration compresses discovery to months, but mine development still takes a decade.</span> Advanced fly ash recovery can improve capture rates at existing facilities within 2–4 years. Recycling technology closes the loop but is structurally self-limiting. And substitution gradually reduces demand — but the most credible substitutes are 5–8 years from commercial scale.
          </p>

          <div style={subH}>AI-driven mineral exploration</div>
          <p style={body}>
            Machine learning models trained on geological survey data, satellite imagery, and drill core databases can identify prospective germanium-hosting zinc deposits in days rather than years. Companies including KoBold Metals and Ivanhoe Mines are applying AI exploration techniques to critical mineral discovery. The limitation is not discovery speed — it is the decade-long path from discovery to production. <span style={b}>No AI exploration breakthrough can address the 2026–2028 supply gap. It could, in theory, address the 2032–2035 gap.</span>
          </p>

          <div style={subH}>Advanced fly ash recovery</div>
          <p style={body}>
            Approximately 70–80% of germanium passing through coal-fired power plants is released in fly ash. Conventional fly ash recovery is practiced only at Wulantuga and a handful of Chinese facilities where coal-seam germanium concentrations are high enough to justify the cost. New hydrometallurgical techniques — including ionic liquid extraction and bioleaching — could improve recovery economics at lower-concentration deposits. The US holds substantial germanium-bearing coal fly ash in legacy impoundments. <span style={b}>A fly ash recovery program at 5–10 US coal plants could add 3–8 t/yr of domestic supply within 3–5 years</span> — meaningful at the margin but not transformative.
          </p>

          <div style={subH}>Closed-loop recycling improvements</div>
          <p style={body}>
            Current fiber optic manufacturing recycling recovers approximately 60–70% of germanium from production scrap. Improving to 80–90% recovery efficiency — through better acid-leach circuit design and scrap segregation — could add 5–10 t/yr to western recycling output at existing facilities without new capital. Umicore and 5N Plus are both pursuing efficiency improvements. The ceiling remains the volume of scrap generated, not the recovery rate.
          </p>

          <div style={subH}>Substitution technologies</div>
          <p style={body}>
            <span style={b}>Hollow-core fiber (HCF):</span> Transmits light through air, eliminating germanium-doped glass entirely. Microsoft (Lumenisity), Corning, and academic institutions are developing commercial-scale HCF. Current deployment is limited to specific high-bandwidth, low-latency datacenter links where the 10–20x lower latency justifies the cost premium. Full substitution for standard telecommunications fiber is not commercially viable before 2030, and HCF manufacturing faces its own supply constraints in precision glass fabrication.
          </p>
          <p style={body}>
            <span style={b}>Silicon photonics:</span> Intel, TSMC, and NVIDIA are integrating photonic components into next-generation compute chips, using silicon waveguides rather than germanium-doped fiber for on-chip optical interconnects. Silicon photonics reduces germanium intensity per unit of compute — but growth in total compute demand more than offsets any intensity reduction. Net germanium demand from photonics is growing, not shrinking.
          </p>
          <p style={body}>
            <span style={b}>Infrared alternatives:</span> Chalcogenide glasses (arsenic-sulfide, AMTIR materials) can substitute for germanium in some IR optical applications at lower cost. Deployment is limited to lower-performance applications; military-grade IR optics still require germanium. Substitution reduces demand growth but does not eliminate it.
          </p>

          <Divider />

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 6 — MAJOR COMPANIES
          ═══════════════════════════════════════════════════════════════ */}
          <h2 style={sectionH}>6. Major Companies</h2>
          <p style={teaser}>Seven companies define the germanium raw material layer</p>

          <div style={subH}>Umicore (Brussels: UMI) — The western refiner</div>
          <p style={body}>
            <span style={b}>Market cap: ~€3.2B · Revenue: ~€3.7B (FY2025) · Employees: ~11,000</span>
          </p>
          <p style={body}>
            Umicore is the only western company refining germanium at industrial scale. Its Hoboken facility processes three feedstock streams: fiber manufacturing scrap from Corning, Prysmian, and Fujikura (~50% of throughput); zinc smelting byproduct concentrate (~35%); and DRC concentrate from the Big Hill partnership (~15%, growing). Umicore sells refined GeCl₄ to fiber manufacturers, takes back their production scrap under tolling agreements, and refines it back into GeCl₄ — a closed loop that concentrates feedstock access and locks in customers simultaneously.
          </p>
          <p style={body}>
            CEO Bart Sap launched the "CORE" strategy in March 2025, refocusing on cash generation from Catalysis and Recycling and deprioritizing Battery Materials investment. The Specialty Materials division — which houses germanium — is stable and cash-generative. The risk is rationalization: if CORE leads to capacity consolidation in Specialty Materials, western supply tightens at a moment of peak demand. <span style={b}>Monitor Umicore Specialty Materials EBITDA margins and any capital expenditure reduction announcements as leading indicators.</span>
          </p>

          <div style={subH}>5N Plus (Toronto: VFF) — The DoD-backed western alternative</div>
          <p style={body}>
            <span style={b}>Market cap: ~$400M CAD · Revenue: ~$280M CAD (FY2025) · Employees: ~600</span>
          </p>
          <p style={body}>
            5N Plus operates a vertically integrated germanium business from refined GeCl₄ through to germanium wafers for space solar cells. Its model is structurally different from Umicore: 5N Plus buys primary germanium concentrate and recycled scrap, processes it into ultra-high-purity compounds, and sells into defense, space, and medical imaging markets where price sensitivity is low and supply security is paramount. The DoD's $14.4 million DPA grant in April 2024 validated the US government's view of 5N Plus as a strategic western supplier.
          </p>
          <p style={body}>
            The most directly investable public company in the western germanium supply chain. The stock re-rated ~5x from 2022 lows on the supply security thesis. <span style={b}>The key question is whether the current valuation already prices the DoD thesis, or whether additional DPA grants and customer contract disclosures could drive further re-rating.</span>
          </p>

          <div style={subH}>Yunnan Chihong (Shanghai: 600497) — The largest single-company germanium producer</div>
          <p style={body}>
            <span style={b}>Market cap: ~¥35B · Revenue: ~¥18B (FY2025) · Employees: ~8,000</span>
          </p>
          <p style={body}>
            Yunnan Chihong is the most important company in the global germanium supply chain — fully vertically integrated from geological exploration through germanium chemical deep processing. Its operations in Yunnan province include the Huize zinc-germanium mine, the Qujing zinc smelter, and germanium chemical processing facilities. Germanium accounts for a disproportionate share of Chihong's operating profit despite being a small fraction of revenue — making it the purest Chinese germanium play.
          </p>
          <p style={body}>
            Not investable for most western investors (Shanghai A-share only, foreign ownership restrictions). Its value to western analysts is as a <span style={b}>leading indicator: Yunnan Chihong's quarterly zinc output is one of the most reliable signals of global germanium supply.</span> When Chihong cuts zinc production — for economic or policy reasons — global germanium supply tightens within 60–90 days.
          </p>

          <div style={subH}>Teck Resources (NYSE: TECK) — Red Dog and the 2031 supply cliff</div>
          <p style={body}>
            <span style={b}>Market cap: ~$20B · Revenue: ~$10B (FY2025) · Primary germanium output: ~8–12 t/yr from Red Dog</span>
          </p>
          <p style={body}>
            Teck is primarily a copper company following its sale of the steelmaking coal business to Glencore in 2024 for ~$7.3B. Its zinc operations — Red Dog in Alaska and the Trail smelter complex in British Columbia — generate germanium as a byproduct. Red Dog is one of the highest-grade zinc deposits in the world and the largest non-Chinese, non-Russian primary germanium source in the western supply chain. <span style={b}>Red Dog's mine life ends in 2031.</span> Teck has no identified germanium replacement asset. The Trail smelter will continue operating on imported concentrates, but the volume will decline as Red Dog closes.
          </p>

          <div style={subH}>Lincang Xinyuan Germanium (Shenzhen: 002428) — The only pure-play germanium miner</div>
          <p style={body}>
            <span style={b}>Market cap: ~¥8B · Revenue: ~¥2.1B</span>
          </p>
          <p style={body}>
            Lincang Xinyuan is the only publicly listed company whose primary business is germanium extraction and processing — making it the closest thing to a pure-play germanium investment available on any exchange. Operations center on the Lincang deposits in Yunnan, where germanium is recovered from sub-bituminous coal. Not accessible to most western investors (Shenzhen A-share), but useful as a price and volume monitor. <span style={b}>Lincang Xinyuan's quarterly production disclosures provide ground-truth data on Chinese output levels that are otherwise difficult to verify.</span>
          </p>

          <div style={subH}>Nyrstar (private/Trafigura) — European zinc smelter with germanium byproduct</div>
          <p style={body}>
            Nyrstar operates zinc smelters across Europe — including Balen (Belgium), Budel (Netherlands), and Auby (France) — that process zinc concentrates containing trace germanium. Owned by Trafigura following a 2019 financial restructuring. Nyrstar's germanium output goes primarily to Umicore under toll-processing agreements, making it a feedstock contributor rather than an independent seller. Its importance is as a volume signal: changes in European zinc smelting throughput have a direct knock-on to Umicore's recycling feedstock availability.
          </p>

          <Divider />

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 7 — INVESTMENT IDEAS
          ═══════════════════════════════════════════════════════════════ */}
          <h2 style={sectionH}>7. Investment Ideas</h2>
          <p style={teaser}>Six positions across the germanium supply thesis, from refiner to consumer</p>

          <p style={body}>
            The following outlines investment angles that connect directly to the germanium supply dynamics analyzed in this report. The germanium market is small (~$1.4B annually), illiquid in primary form, and not directly investable as a futures contract. Exposure is therefore through companies whose valuation is materially affected by germanium supply conditions. <span style={b}>The investment horizon is 2–5 years, timed to the 2026–2028 supply tightening window.</span>
          </p>
          <p style={{ fontFamily: MONO, fontSize: 8, color: "#8A8880", lineHeight: 1.7, marginBottom: 24, padding: "12px 16px", background: "#ECEAE5", borderRadius: 3 }}>
            This analysis identifies areas of potential interest based on supply chain research. It is not a recommendation to buy, sell, or hold any security or commodity. All investments carry risk. Conduct independent due diligence before making any investment decisions.
          </p>

          <div style={subH}>Idea 01 — Long 5N Plus (VFF.TSX)</div>
          <p style={body}>
            <span style={b}>Thesis:</span> The most directly investable pure-play on western germanium supply security. 5N Plus has DoD backing, a growing defense and space customer base, and a manufacturing footprint positioned to toll-process output from new US domestic supply sources including Apex Mining. The company's revenue is tied to germanium pricing and volume, providing direct supply-thesis exposure. <span style={b}>Catalysts:</span> Additional DPA grants, new government supply contracts, Apex mine commissioning, germanium spot price increases on China re-restriction. <span style={b}>Risks:</span> Stock has re-rated significantly; valuation risk if germanium prices fall on China normalization; customer concentration in defense sector.
          </p>

          <div style={subH}>Idea 02 — Long Umicore (UMI.BR)</div>
          <p style={body}>
            <span style={b}>Thesis:</span> Umicore is the structural monopolist of western germanium refining. Its pricing power is extraordinary — as the only western refiner, it sets GeCl₄ prices for European fiber manufacturers with no competitive alternative. The CORE strategy has rationalized the cost base; Specialty Materials is the highest-margin segment. <span style={b}>Catalysts:</span> China reimposition of export ban (forces western buyers to Umicore), BEAD fiber construction ramp, DRC ramp increasing primary feedstock availability. <span style={b}>Risks:</span> Battery materials legacy liabilities; management execution on CORE; Specialty Materials capacity rationalization as a downside scenario.
          </p>

          <div style={subH}>Idea 03 — Long Corning (GLW) — indirect germanium exposure</div>
          <p style={body}>
            <span style={b}>Thesis:</span> Corning is a GeCl₄ consumer, not a producer — but its $6 billion Meta fiber supply agreement and BEAD-positioned US manufacturing base make it the primary beneficiary of the fiber demand surge that drives germanium consumption. Corning cannot directly control its germanium input cost, but its ability to secure long-term GeCl₄ supply through Umicore tolling gives it pricing predictability that smaller fiber manufacturers lack. <span style={b}>Catalysts:</span> Meta agreement revenue recognition, BEAD construction ramp, 1.6T transceiver deployment. <span style={b}>Risks:</span> Germanium supply constraint limiting Corning's production capacity at peak demand; hollow-core fiber technology risk long-term.
          </p>

          <div style={subH}>Idea 04 — Monitor Yunnan Chihong as a leading indicator</div>
          <p style={body}>
            <span style={b}>Signal:</span> Not a direct investment for most western managers, but Yunnan Chihong's quarterly production data is the single most reliable leading indicator of global germanium supply. A quarter-over-quarter decline in Chihong's zinc output — whether driven by zinc economics, power curtailments, or policy — translates into a germanium supply reduction 60–90 days later. Track via Shanghai exchange filings and Chinese industry press.
          </p>

          <div style={subH}>Idea 05 — Long Teck Resources (TECK.B.TSX) — time-limited</div>
          <p style={body}>
            <span style={b}>Thesis:</span> Teck's germanium production at Red Dog is a high-margin byproduct contribution to a copper-zinc business that the market primarily values on copper. The germanium optionality is underpriced in Teck's valuation because it is not separately disclosed. <span style={b}>This is a time-limited opportunity: Red Dog closes in 2031.</span> The thesis is strongest in 2026–2028, when Red Dog production is still at peak throughput and germanium prices are elevated by the supply tightening thesis. Teck will not benefit from the thesis after 2029 as Red Dog ramps down. <span style={b}>Risks:</span> Germanium is too small to move Teck's equity materially; exposure is diluted across a much larger copper business.
          </p>

          <div style={subH}>Idea 06 — Short fiber manufacturers without secured GeCl₄ supply</div>
          <p style={body}>
            <span style={b}>Thesis:</span> Fiber manufacturers dependent on spot-market GeCl₄ procurement — without long-term supply agreements with Umicore or direct access to 5N Plus capacity — face margin compression or production curtailment in a tightening supply environment. The signal to watch is whether a manufacturer has a tolling agreement with Umicore: if not, they are exposed to spot pricing. <span style={b}>Companies at risk:</span> Smaller Chinese-origin fiber manufacturers selling into western markets without BABA-compliant supply chains; specialty fiber manufacturers without direct refiner relationships. <span style={b}>Risks:</span> Identifying short candidates requires supply chain due diligence not available in public filings; China normalization eases the pressure.
          </p>

          <Divider />

          {/* ── Sources ────────────────────────────────────────────────── */}
          <div style={{ fontFamily: MONO, fontSize: 8, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#1C1E21", marginBottom: 10 }}>
            Sources
          </div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: "#8A8880", lineHeight: 1.8 }}>
            {[
              "USGS Mineral Commodity Summaries 2025 — Germanium",
              "Umicore FY2025 Annual Report and Investor Day Presentations",
              "5N Plus FY2025 Annual Report and DoD DPA Grant Announcements",
              "Teck Resources FY2025 Annual Report — Red Dog Operations",
              "Fastmarkets — Germanium Metal Spot Pricing, March 2026",
              "Roskill — Germanium Market Outlook 2025",
              "Wood Mackenzie — Critical Minerals Supply Chain Analysis 2025",
              "USGS — Critical Mineral Resources of the United States (Professional Paper 1802)",
              "MOFCOM — Germanium and Gallium Export Licensing Notices (August 2023, December 2024)",
              "China State Reserve Bureau — Strategic Reserve Procurement Announcements",
              "Yunnan Chihong Zinc & Germanium Co. — Shanghai Exchange Quarterly Filings",
              "Corning Inc. — Meta $6B Fiber Supply Agreement and FY2025 Earnings",
              "NTIA — BEAD Program State Progress Report, Q1 2026",
              "DoD — Defense Production Act Title III Critical Minerals Grants 2024",
              "CBRE — North American Fiber and Datacenter Market Report 2026",
              "Microsoft — Lumenisity Hollow-Core Fiber Acquisition and Deployment Disclosures",
            ].map((s, i) => <div key={i}>{s}</div>)}
          </div>

          {/* ── Footer ────────────────────────────────────────────────── */}
          <div style={{ height: "0.5px", background: "#D4D2CC", marginTop: 40, marginBottom: 16 }} />
          <div style={{ fontFamily: MONO, fontSize: 7, color: "#A8A69E", fontStyle: "italic" as const, lineHeight: 1.7 }}>
            Stillpoint Intelligence · This document contains forward-looking statements and investment commentary that does not constitute financial advice. Supply chain data reflects best available public information as of April 2026. All figures are estimates unless otherwise sourced. Proprietary and confidential — not for distribution.
          </div>

        </div>
      </div>
    </>
  );
}
