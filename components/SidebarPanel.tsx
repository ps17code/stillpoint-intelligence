"use client";
import { useState } from "react";

const INSIGHT_BARS = [
  // raw material layer (chainState === 1)
  { key: "supply-demand", label: "SUPPLY / DEMAND", teaser: "A structural shortage of raw germanium isn't a risk — it's the baseline", color: "#1E40AF" },
  { key: "bottlenecks",   label: "BOTTLENECKS",     teaser: "One facility in Belgium stands between western industry and a germanium blackout", color: "#991B1B" },
  { key: "geopolitical",  label: "GEOPOLITICAL",    teaser: "China has proven it can turn germanium supply on and off at will", color: "#92400E" },
  { key: "catalysts",     label: "CATALYSTS",       teaser: "$600B in hyperscaler capex and BEAD construction converge in 2026", color: "#065F46" },
  { key: "emerging-tech", label: "EMERGING TECH",   teaser: "AI can find zinc deposits in days — but germanium inside takes a decade to reach market", color: "#5B21B6" },
  { key: "major-companies", label: "COMPANIES",     teaser: "Four companies define the western germanium chain", color: "#155E75" },
  { key: "investment-ideas", label: "INVESTMENT",   teaser: "Companies and positions across the germanium supply thesis", color: "#9D174D" },
];

const COMPONENT_INSIGHT_BARS = [
  { key: "comp-supply-demand", label: "SUPPLY / DEMAND", teaser: "A chemical compound most investors have never heard of sits between germanium and every fiber strand on earth", color: "#1E40AF" },
  { key: "comp-bottlenecks",   label: "BOTTLENECKS",     teaser: "The component layer has five chokepoints — and three of them run through the same company", color: "#991B1B" },
  { key: "comp-geopolitical",  label: "GEOPOLITICAL",    teaser: "The export controls were designed for the component layer — GeO₂ and GeCl₄ were named specifically, not caught incidentally", color: "#92400E" },
  { key: "comp-catalysts",     label: "CATALYSTS",       teaser: "Five tightening forces converge on GeCl₄ supply before any easing catalyst can reach market scale", color: "#065F46" },
  { key: "comp-emerging-tech", label: "EMERGING TECH",   teaser: "Four technology vectors could reshape the component layer, but none reaches meaningful scale before the supply crisis peaks", color: "#5B21B6" },
  { key: "comp-major-companies", label: "COMPANIES",     teaser: "The component layer is defined by one supplier, one dominant consumer, and four manufacturers racing to expand capacity they cannot build fast enough", color: "#155E75" },
  { key: "comp-investment-ideas", label: "INVESTMENT",   teaser: "Three public companies capture the component-layer bottleneck, one private bet hedges it, and one binary date reprices the entire chain", color: "#9D174D" },
];

const SUBSYSTEM_INSIGHT_BARS = [
  { key: "sub-supply-demand",    label: "SUPPLY / DEMAND", teaser: "The world needs 60 new submarine cable systems this decade — and only three companies can build the wet plant that makes them work", color: "#1E40AF" },
  { key: "sub-bottlenecks",      label: "BOTTLENECKS",     teaser: "SubCom, ASN, and NEC control the wet-plant oligopoly — and their order books are full through 2027", color: "#991B1B" },
  { key: "sub-geopolitical",     label: "GEOPOLITICAL",    teaser: "The Baltic Sea cable cuts prove that submarine infrastructure is a target — and HMN Technologies' exclusion reshapes the competitive map", color: "#92400E" },
  { key: "sub-catalysts",        label: "CATALYSTS",       teaser: "Meta's $10B+ Waterworth, Google's 30+ cable investments, and $42.5B in BEAD funding converge on a subsystem layer already running at capacity", color: "#065F46" },
  { key: "sub-emerging-tech",    label: "EMERGING TECH",   teaser: "Space-division multiplexing, open cable systems, and 1.6T coherent optics are rewriting submarine cable economics — but hollow-core fiber could eliminate the germanium dependency entirely", color: "#5B21B6" },
  { key: "sub-major-companies",  label: "COMPANIES",       teaser: "Prysmian's €16–17B backlog and 8-vessel fleet make it the subsystem layer's dominant integrated player — but the real pricing power sits with SubCom's wet-plant monopoly in the US", color: "#155E75" },
  { key: "sub-investment-ideas", label: "INVESTMENT",      teaser: "Prysmian's integrated model, Dycom's labor moat, and cable vessel scarcity offer three entry points — but the real asymmetry is SubCom's eventual IPO", color: "#9D174D" },
];

const END_USE_INSIGHT_BARS = [
  { key: "eu-supply-demand",    label: "SUPPLY / DEMAND", teaser: "68 GW of datacenter power needed by 2027 — and 4–7 year grid interconnection queues mean most of it won't arrive in time", color: "#1E40AF" },
  { key: "eu-bottlenecks",      label: "BOTTLENECKS",     teaser: "Northern Virginia's 1.5 GW incident exposed what happens when datacenter demand hits grid limits — and Turner Construction's 37% backlog share reveals a single-contractor dependency few investors track", color: "#991B1B" },
  { key: "eu-geopolitical",     label: "GEOPOLITICAL",    teaser: "NVIDIA's Blackwell chips are entirely export-controlled, G42 is spending $15.2B with Microsoft, and data sovereignty laws are fragmenting the global datacenter market into regulatory islands", color: "#92400E" },
  { key: "eu-catalysts",        label: "CATALYSTS",       teaser: "$660–690B in 2026 hyperscaler capex, the 1.6T transceiver supercycle, Stargate's $500B commitment, and political backlash against datacenter power create the end-use layer's most volatile catalyst stack in a decade", color: "#065F46" },
  { key: "eu-emerging-tech",    label: "EMERGING TECH",   teaser: "Co-packaged optics, Microsoft's MOSAIC MicroLED interconnects, nuclear SMRs, and liquid cooling are rewriting datacenter architecture from the photon to the watt", color: "#5B21B6" },
  { key: "eu-major-companies",  label: "COMPANIES",       teaser: "Equinix doubling capacity by 2029, Digital Realty's 11.7M sq ft Digital Dulles campus, Turner's $16B datacenter backlog, and Vertiv's $15B cooling pipeline define the end-use layer's physical reality", color: "#155E75" },
  { key: "eu-investment-ideas", label: "INVESTMENT",      teaser: "Long Equinix/DLR for the REIT backbone, long Vertiv for the cooling supercycle, long Constellation for nuclear datacenter power — and short power-constrained operators without secured supply agreements", color: "#9D174D" },
];

const SECTION_HDR: React.CSSProperties = {
  fontFamily: "'Geist Mono', 'Courier New', monospace",
  fontSize: 15,
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#8A8880",
  borderBottom: "0.5px solid #B8B4AC",
  paddingBottom: 6,
};

export default function SidebarPanel({ chainState }: { chainState?: number }) {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const bars = chainState === 2 ? COMPONENT_INSIGHT_BARS : chainState === 3 ? SUBSYSTEM_INSIGHT_BARS : chainState === 4 ? END_USE_INSIGHT_BARS : INSIGHT_BARS;

  const activeBarIdx = activePopup ? bars.findIndex(b => b.key === activePopup) : -1;
  const prevKey = activeBarIdx > 0 ? bars[activeBarIdx - 1].key : null;
  const nextKey = activeBarIdx < bars.length - 1 ? bars[activeBarIdx + 1].key : null;

  return (
    <>
      <div style={{ padding: "16px 14px 24px" }}>

        {/* ── Market data ─────────────────────────────────────────── */}
        <style>{`@keyframes sp-blink { 0%,100%{opacity:1} 50%{opacity:0.15} }`}</style>
        <div style={{ ...SECTION_HDR, marginBottom: 20, display: "flex", alignItems: "center", gap: 7 }}>
          <span>Market Data</span>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7DA06A", animation: "sp-blink 2s ease-in-out infinite", flexShrink: 0 }} />
        </div>

        {/* Ge metal price card */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
            {/* Left: data */}
            <div style={{ flexShrink: 0 }}>
              <div style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: 6, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 3 }}>Ge Metal Spot Price</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 2 }}>
                <span style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: 17, fontWeight: 600, color: "#1C1E21", letterSpacing: "-0.4px", lineHeight: 1 }}>$8,597</span>
                <span style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: 8, fontWeight: 600, color: "#3B6D11" }}>+202%</span>
              </div>
              <div style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: 5, color: "#B0ADA6", letterSpacing: "0.05em" }}>per kg · Fastmarkets Mar 2026</div>
            </div>
            {/* Right: sparkline fills remaining width */}
            <div style={{ flex: 1, minWidth: 0, marginLeft: 8, height: 44, alignSelf: "flex-end" }}>
              <svg width="100%" height="100%" viewBox="0 0 72 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="spk-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B6D11" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#3B6D11" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,37 L5,36 L10,35 L15,35 L20,36 L25,35 L30,34 L35,31 L40,27 L45,22 L50,18 L55,14 L60,11 L65,10 L72,9" fill="none" stroke="#3B6D11" strokeWidth="0.8" />
                <path d="M0,37 L5,36 L10,35 L15,35 L20,36 L25,35 L30,34 L35,31 L40,27 L45,22 L50,18 L55,14 L60,11 L65,10 L72,9 L72,40 L0,40 Z" fill="url(#spk-fill)" />
              </svg>
            </div>
          </div>
        </div>


        {/* ── Core Analysis ───────────────────────────────────────── */}
        <div style={{ ...SECTION_HDR, marginTop: 20, marginBottom: 10 }}>Core Analysis</div>

        <div>
          {bars.map((bar, i) => (
            <div
              key={bar.key}
              onClick={() => setActivePopup(bar.key)}
              style={{
                padding: "9px 6px",
                cursor: "pointer",
                borderBottom: i < bars.length - 1 ? "0.5px solid #E8E5DE" : "none",
                transition: "background 0.15s ease",
                borderRadius: 3,
                margin: "0 -6px",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                const title = e.currentTarget.querySelector<HTMLElement>("[data-title]");
                if (title) title.style.color = "#000";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                const title = e.currentTarget.querySelector<HTMLElement>("[data-title]");
                if (title) title.style.color = "#2C2B28";
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div data-title style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 13, fontWeight: 500, color: "#2C2B28", lineHeight: 1.4, marginBottom: 10, transition: "color 0.1s" }}>
                  {bar.teaser}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: "9px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: bar.color }}>
                    {bar.label}
                  </span>
                  <span style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: "9px", color: "#C8C4BC" }}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup overlay */}
      {activePopup && (
        <div
          onClick={() => setActivePopup(null)}
          style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 20px 32px" }}
        >
          <div style={{ position: "absolute", inset: 0, background: "rgba(20,18,15,0.55)", backdropFilter: "blur(3px)" }} />
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: "relative", display: "flex", alignItems: "center", gap: 14, width: "100%", maxWidth: 760 }}
          >
            {/* Prev button */}
            <button
              onClick={() => prevKey && setActivePopup(prevKey)}
              disabled={!prevKey}
              style={{ flexShrink: 0, width: 38, height: 38, borderRadius: "50%", border: "0.5px solid rgba(255,255,255,0.18)", background: prevKey ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.03)", cursor: prevKey ? "pointer" : "default", color: prevKey ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.18)", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Geist Mono', monospace", transition: "background 0.15s" }}
            >←</button>
            <div style={{ flex: 1, minWidth: 0, background: "#FAF9F7", border: "0.5px solid rgba(80,80,70,0.2)", borderRadius: 6, maxHeight: "80vh", overflowY: "auto" as const }}>
            {activePopup === "supply-demand" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>A structural shortage of raw germanium isn&apos;t a risk — it&apos;s the baseline</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#EFF6FF', color: '#1E40AF', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Supply constraints</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>The resource</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Germanium is never mined on its own. It exists only as a trace impurity in zinc ores and lignite coal deposits, typically at concentrations of 50–800 parts per million. The &quot;germanium deposits&quot; mapped in this platform are actually zinc mines and coal mines where the germanium concentration happens to be high enough to justify recovering it during processing. In zinc operations, germanium concentrates in the residues and flue dust during smelting. In coal operations, it accumulates in the fly ash after combustion. The primary product is always zinc or energy — germanium is captured from the waste stream.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>There is no such thing as a germanium mine.</strong> Even if germanium prices triple, nobody opens a new mine for it. The supply response is limited to increasing recovery rates at existing zinc smelters and coal plants — an incremental improvement, not a step-change.</p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Global deposit inventory</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Known deposits contain an estimated <strong style={{ fontWeight: 600, color: '#1C1E21' }}>8,000–10,000 tonnes</strong> of germanium across 8 major sites globally. Reserve data is limited — the USGS states it is &quot;not widely reported at a mine or country level and thus difficult to quantify.&quot; Five deposits are in China, representing ~7,200 tonnes or roughly 73% of identified resources.</p>
                    <table style={{ width: '100%', borderCollapse: 'collapse' as const, margin: '12px 0', fontSize: '11px' }}>
                      <thead>
                        <tr>
                          {['Deposit', 'Country', 'Type', 'Ge content', 'Status'].map(h => (
                            <th key={h} style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9CA3AF', textAlign: 'left' as const, padding: '6px 8px', borderBottom: '0.5px solid #E5E7EB', fontFamily: "'Geist Mono', monospace" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {([
                          ['Lincang', 'China', 'Lignite coal', '>1,000t', 'Export controlled', 'red'],
                          ['Wulantuga', 'China', 'Lignite coal', '~1,600t', 'Export controlled', 'red'],
                          ['Yimin', 'China', 'Lignite coal', '~4,000t', 'Export controlled', 'red'],
                          ['Huize', 'China', 'Zinc ore', '443t resources', 'Export controlled', 'red'],
                          ['Yiliang + SYGT', 'China', 'Zinc ore', '186t proven', 'Export controlled', 'red'],
                          ['Spetsugli', 'Russia', 'Coal', '~1,015t', 'Sanctioned', 'amber'],
                          ['Big Hill', 'DRC', 'Tailings', '700t+ potential', 'Ramping', 'green'],
                          ['Red Dog', 'USA', 'Zinc ore', 'Not published', 'Declining', 'amber'],
                        ] as [string, string, string, string, string, string][]).map(([name, country, type, ge, status, tagColor], i) => (
                          <tr key={i}>
                            <td style={{ padding: '7px 8px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "Inter, sans-serif", color: '#374151', fontSize: '11px' }}>{name}</td>
                            <td style={{ padding: '7px 8px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "Inter, sans-serif", color: '#374151', fontSize: '11px' }}>{country}</td>
                            <td style={{ padding: '7px 8px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace", color: '#374151', fontSize: '10px' }}>{type}</td>
                            <td style={{ padding: '7px 8px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace", color: '#374151', fontSize: '10px' }}>{ge}</td>
                            <td style={{ padding: '7px 8px', borderBottom: '0.5px solid #F3F4F6' }}>
                              <span style={{ fontSize: '8px', padding: '2px 6px', borderRadius: '2px', fontWeight: 600, letterSpacing: '0.03em', display: 'inline-block', fontFamily: "'Geist Mono', monospace", background: tagColor === 'red' ? '#FEF2F2' : tagColor === 'amber' ? '#FEF3C7' : '#ECFDF5', color: tagColor === 'red' ? '#991B1B' : tagColor === 'amber' ? '#92400E' : '#065F46' }}>{status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Including Russia (sanctioned), <strong style={{ fontWeight: 600, color: '#1C1E21' }}>83% of known germanium resources are geopolitically constrained</strong>. The DRC deposit (Big Hill) shipped its first germanium concentrates to Umicore in Belgium in October 2024, but is years from meaningful scale. Red Dog in Alaska — the sole US source — is in decline with no published reserve extension.</p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Annual supply waterfall</div>
                    <div style={{ display: 'flex', gap: '8px', margin: '14px 0' }}>
                      {([['~220t/yr', 'Total refined + recycled', false], ['~65–85t', 'Western-accessible', false], ['93%', 'China share of mining', true]] as [string, string, boolean][]).map(([num, label, isRed], i) => (
                        <div key={i} style={{ flex: 1, background: '#F3F4F6', borderRadius: '4px', padding: '10px 12px' }}>
                          <div style={{ fontSize: '16px', fontWeight: 600, color: isRed ? '#991B1B' : '#1C1E21', letterSpacing: '-0.3px', fontFamily: "'Geist Mono', monospace" }}>{num}</div>
                          <div style={{ fontSize: '7.5px', color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginTop: '2px', fontFamily: "'Geist Mono', monospace" }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: '12.5px', fontWeight: 600, color: '#1C1E21', marginTop: '4px', marginBottom: '8px' }}>Primary mining: ~130–140t/yr</p>
                    {([
                      ['China (Yunnan Chihong, Lincang Xinyuan, Shengli, state ops)', '~130t', 100, '#DC2626', 0.65],
                      ['Russia — JSC Germanium (sanctioned)', '~15t', 11, '#DC2626', 0.45],
                      ['DRC — STL/Gécamines (first shipment Oct 2024)', '<5t', 3, '#059669', 1],
                      ['USA/Canada — Teck Resources (undisclosed)', 'small', 2, '#059669', 1],
                    ] as [string, string, number, string, number][]).map(([label, val, pct, color, opacity], i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '0.5px solid #F3F4F6' }}>
                        <div style={{ fontSize: '11px', color: '#374151', flex: 1, fontFamily: "Inter, sans-serif" }}>{label}</div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#1C1E21', minWidth: '70px', textAlign: 'right' as const, fontFamily: "'Geist Mono', monospace" }}>{val}</div>
                        <div style={{ width: '100px', height: '5px', background: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '5px', borderRadius: '3px', width: `${pct}%`, background: color, opacity }}></div>
                        </div>
                      </div>
                    ))}
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: '12.5px', fontWeight: 600, color: '#1C1E21', marginTop: '16px', marginBottom: '8px' }}>Recycled supply: ~60–70t/yr (~30% of global total)</p>
                    {([
                      ['Umicore (Belgium + US operations)', '~40–50t', 70, '#2563A0'],
                      ['5N Plus (Canada)', '~15–20t est.', 25, '#2563A0'],
                      ['PPM Pure Metals (Germany)', '~10–15t est.', 18, '#2563A0'],
                    ] as [string, string, number, string][]).map(([label, val, pct, color], i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '0.5px solid #F3F4F6' }}>
                        <div style={{ fontSize: '11px', color: '#374151', flex: 1, fontFamily: "Inter, sans-serif" }}>{label}</div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#1C1E21', minWidth: '70px', textAlign: 'right' as const, fontFamily: "'Geist Mono', monospace" }}>{val}</div>
                        <div style={{ width: '100px', height: '5px', background: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '5px', borderRadius: '3px', width: `${pct}%`, background: color }}></div>
                        </div>
                      </div>
                    ))}
                    <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '8px', fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>Umicore sources {'>'}50% of its germanium from recycled manufacturing scrap and waste streams. Neither 5N Plus nor PPM disclose germanium-specific production volumes — figures are analyst estimates.</p>
                    <div style={{ background: '#F0F9FF', borderRadius: '4px', padding: '12px 14px', margin: '12px 0' }}>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#155E75', marginBottom: '4px', fontFamily: "'Geist Mono', monospace" }}>Key data point</div>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: '11px', color: '#164E63', lineHeight: 1.55 }}>China&apos;s exports of germanium metal decreased <strong>55%</strong> in Jan–Aug 2024 vs the same period in 2023, falling to just 16,700 kg. In December 2024, China banned all germanium exports to the United States. <em>— USGS MCS 2025</em></p>
                    </div>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>What&apos;s actually accessible to western buyers</div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>After subtracting geopolitically constrained supply, <strong style={{ fontWeight: 600, color: '#1C1E21' }}>reliable western-accessible supply is approximately 65–85 tonnes per year</strong>. The majority of this is recycled material, not primary production.</p>
                  </div>
                  <div style={{ background: '#FEF2F2', borderRadius: '4px', padding: '16px 18px', margin: '16px 0' }}>
                    <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#991B1B', marginBottom: '8px', fontFamily: "'Geist Mono', monospace" }}>The gap</div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: '12px', color: '#7F1D1D', lineHeight: 1.6, marginBottom: '8px' }}>Fiber optics alone — the single largest end use at 35–44% of global consumption — requires roughly <strong>77–97 tonnes</strong> of germanium per year. Reliable western supply (~65–85t) barely covers this single application. AI-focused data centers require <strong>10–36x more fiber</strong> than traditional facilities. There is <strong>no futures market</strong> for germanium. No strategic government stockpile. No viable substitute in fiber optic manufacturing.</p>
                  </div>
                  <hr style={{ border: 'none', borderTop: '0.5px solid #E5E7EB', margin: '24px 0' }} />
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>9 structural constraints on supply growth</div>
                    {([
                      ['01', 'Byproduct dependency', "Germanium production is governed by zinc prices and coal policy — not germanium demand. If a zinc mine closes because zinc becomes uneconomic, germanium supply drops to zero from that source regardless of how expensive germanium gets."],
                      ['02', 'Cannot explore for germanium', "Geological exploration doesn't work for germanium. You can't survey for it — you have to find a zinc or coal deposit and hope it contains recoverable trace germanium at 50–800 ppm."],
                      ['03', 'Decade-long lead times', 'Even if a new germanium-bearing zinc deposit were found tomorrow, the timeline from discovery to permitting to mine construction to first germanium recovery is 10–15 years minimum.'],
                      ['04', 'Low recovery yields', 'Only about 10% of germanium flowing through zinc smelters and coal plants is actually captured. Source metal streams contain ~12,000 tonnes of Ge per year globally, but actual production is only ~220 tonnes.'],
                      ['05', 'Shrinking deposit base', "Red Dog in Alaska — the only US germanium source — is in decline. Nyrstar's Tennessee zinc mine suspended operations in late 2024. No western replacement deposits have been identified."],
                      ['06', 'Coal decarbonization headwinds', "China's three largest germanium deposits (Lincang, Wulantuga, Yimin) are lignite coal operations. Climate policy could curtail output independent of germanium market fundamentals."],
                      ['07', 'Recycling has a structural ceiling', 'Fiber optics — the largest end use — consumes germanium non-recoverably. The Ge is doped into the glass core during manufacturing and cannot be extracted from deployed cable.'],
                      ['08', 'Western recycling is an oligopoly', 'Umicore dominates through scale and tolling schemes giving first access to scrap. The barrier is feedstock access, not technology.'],
                      ['09', 'China can tighten further at any time', "The Aug 2023 export licensing and Dec 2024 US ban are templates. Extension to EU and Japanese buyers is plausible. There is no diplomatic mechanism guaranteeing continued access."],
                    ] as [string, string, string][]).map(([num, title, body], i) => (
                      <div key={i} style={{ padding: '10px 0', borderBottom: i < 8 ? '0.5px solid #F3F4F6' : 'none' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                          <div style={{ fontSize: '9px', color: '#9CA3AF', minWidth: '18px', fontFamily: "'Geist Mono', monospace" }}>{num}</div>
                          <div style={{ fontFamily: "Inter, sans-serif", fontSize: '12px', fontWeight: 600, color: '#1C1E21' }}>{title}</div>
                        </div>
                        <div style={{ fontFamily: "Inter, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginTop: '4px', paddingLeft: '26px' }}>{body}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Takeaway</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>The supply of germanium as a raw material is fundamentally fixed. Western-accessible supply sits at roughly 65–85 tonnes — most of it recycled — against demand that is accelerating from AI infrastructure, defense, and broadband buildout.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '16px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>In the absence of a breakthrough in alternative fiber technology or a reversal of China&apos;s export restrictions, a structural shortage of germanium is not a risk scenario — it is the baseline.</strong></p>
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: USGS Mineral Commodity Summaries 2025, USGS Minerals Yearbook 2023, Yunnan Chihong 2023 Annual Report, RFC Ambrian Germanium Report April 2025, Umicore Annual Report 2023, Gécamines press release October 2024, Corning Q3 2025 earnings, WORLD7 Integrated Assessment Model (December 2024).
                  </div>
                </div>
              </div>
            ) : activePopup === "bottlenecks" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '8px' }}>One facility in Belgium stands between western industry and a germanium blackout</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#FEF2F2', color: '#991B1B', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Bottlenecks</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Overview</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Supply constraints explain why germanium supply can&apos;t grow. Bottlenecks answer a different question: <strong style={{ fontWeight: 600, color: '#1C1E21' }}>where does the existing supply chain break if a single node fails?</strong> The germanium raw material layer has five chokepoints.</p>
                  </div>
                  {([
                    { num: '01', title: 'Umicore — sole western refiner at scale', subtitle: 'Olen, Belgium · ~40–50t/yr · >50% from recycling', body: "Every meaningful volume of western germanium flows through Umicore. Their Olen facility is the only non-Chinese, non-Russian operation capable of refining germanium at 40–50 tonnes per year. They supply the majority of western optical fiber manufacturers with GeCl₄.", body2: "If Olen goes offline — a regulatory issue, a fire, a feedstock disruption, a labor action — there is no alternative at comparable scale. Umicore is not just a major player — they are the western germanium supply chain.", stat: null as string | null, severity: 95, severityLabel: 'Critical' },
                    { num: '02', title: 'Yunnan Chihong — 30% of global supply from one company', subtitle: 'Qujing, Yunnan Province, China · 65.9t produced in 2023 · 60t/yr capacity', body: "Yunnan Chihong alone produced 65.9 tonnes of germanium in 2023 — roughly 30% of the entire world's supply from a single entity.", body2: 'When Chihong announced a safety optimization project at Huize in late 2024, Q1 2025 zinc output dropped 17,400 tonnes. Because germanium is a byproduct, germanium output drops in lockstep.', stat: 'Q1 2025 impact: zinc output down 17,400t metal content YoY' as string | null, severity: 85, severityLabel: 'High' },
                    { num: '03', title: 'Red Dog → Canada → 5N Plus — single-threaded US pipeline', subtitle: 'Red Dog (Alaska) → Canadian processor → 5N Plus (Montreal)', body: "The sole US germanium deposit at Red Dog ships zinc concentrates to a Canadian processor, then to 5N Plus. This is a single-threaded supply chain: one mine, one export route, one processor, one refiner, across two countries.", body2: "The Tennessee operation that provided a second US pathway (Nyrstar Clarksville) suspended mining operations in late 2024.", stat: 'Nyrstar Tennessee: mining operations suspended late 2024' as string | null, severity: 70, severityLabel: 'High' },
                    { num: '04', title: 'DRC — entire new-supply strategy in one country', subtitle: 'Big Hill tailings, Lubumbashi · STL/Gécamines + Umicore · 700t+ potential', body: "The entire western strategy for adding new primary germanium runs through a single partnership (Umicore-STL), a single tailings site (Big Hill), and a single country (the DRC).", body2: "If this project stalls due to local governance, operational challenges, or a breakdown in the Umicore-STL relationship, there is no Plan B for new western primary germanium.", stat: null as string | null, severity: 65, severityLabel: 'Medium' },
                    { num: '05', title: 'Recycling feedstock access — a relationship bottleneck', subtitle: 'Umicore tolling model · closed-loop scrap recovery', body: "Western germanium recycling depends on access to manufacturing scrap. Umicore secures this feedstock through long-term tolling schemes — they sell germanium products, contractually take back production scrap, then recycle it.", body2: "A new entrant faces a chicken-and-egg problem: you need customer relationships to access scrap, but you need recycling capacity to win customer relationships. There is no open spot market for germanium recycling feedstock.", stat: null as string | null, severity: 55, severityLabel: 'Medium' },
                  ]).map((bn, i) => (
                    <div key={i} style={{ marginTop: '20px', padding: '16px 18px', background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#991B1B', minWidth: '20px', fontFamily: "'Geist Mono', monospace" }}>{bn.num}</div>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '13px', fontWeight: 600, color: '#1C1E21' }}>{bn.title}</div>
                      </div>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11px', color: '#6B7280', fontStyle: 'italic', marginBottom: '10px', paddingLeft: '30px' }}>{bn.subtitle}</div>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.65, paddingLeft: '30px' }}>
                        {bn.body}<br /><br />
                        <strong style={{ fontWeight: 600, color: '#1C1E21' }}>{bn.body2}</strong>
                      </div>
                      {bn.stat && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F3F4F6', borderRadius: '3px', padding: '3px 10px', margin: '8px 0 4px 30px', fontSize: '10px', color: '#1C1E21', fontWeight: 600, fontFamily: "'Geist Mono', monospace" }}>{bn.stat}</div>}
                      <div style={{ display: 'flex', gap: '6px', margin: '12px 0 0 30px', alignItems: 'center' }}>
                        <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: '#6B7280', minWidth: '70px', fontFamily: "'Geist Mono', monospace" }}>Severity</div>
                        <div style={{ flex: 1, height: '4px', background: '#F3F4F6', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '4px', borderRadius: '2px', width: `${bn.severity}%`, background: bn.severity >= 80 ? '#DC2626' : '#F59E0B' }}></div>
                        </div>
                        <div style={{ fontSize: '9px', color: '#6B7280', minWidth: '30px', textAlign: 'right' as const, fontFamily: "'Geist Mono', monospace" }}>{bn.severityLabel}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ background: '#FEF2F2', borderRadius: '4px', padding: '14px 16px', margin: '20px 0' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#991B1B', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>Compounding risk</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#7F1D1D', lineHeight: 1.6 }}>Umicore is the sole western refiner (bottleneck #1), AND the DRC feedstock partner (#4), AND the dominant recycling feedstock controller (#5). <strong>A single company is the chokepoint across three of the five identified bottlenecks.</strong></p>
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: USGS MCS 2025, Yunnan Chihong 2023 Annual Report & Q1 2025 disclosures, Umicore Annual Report 2023, Gécamines press release October 2024, Teck Resources 2023 Annual Report, RFC Ambrian April 2025.
                  </div>
                </div>
              </div>
            ) : activePopup === "geopolitical" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '8px' }}>China has proven it can turn germanium supply on and off at will</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#FEF3C7', color: '#92400E', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Geopolitical risk</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Overview</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Between July 2023 and November 2025, China imposed, escalated, and then partially suspended export controls on germanium — demonstrating that <strong style={{ fontWeight: 600, color: '#1C1E21' }}>access to 93% of the world&apos;s germanium supply is a policy variable controlled by a single government</strong>. The controls were explicitly linked to US semiconductor restrictions.</p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Policy timeline</div>
                    <div style={{ position: 'relative', margin: '16px 0', paddingLeft: '20px' }}>
                      <div style={{ position: 'absolute', left: '5px', top: '4px', bottom: '4px', width: '1px', background: '#E5E7EB' }}></div>
                      {([
                        { color: '#DC2626', date: 'July 3, 2023', title: 'China announces export controls on germanium and gallium', body: 'MOFCOM requires export licenses for germanium metal, zone-melted ingots, GeO₂, GeCl₄, and related compounds. Effective August 1. Widely seen as retaliation for US, Dutch, and Japanese chip export restrictions.', stat: null as string | null },
                        { color: '#DC2626', date: 'August – September 2023', title: 'Exports collapse to near zero', body: 'Chinese germanium exports: 0 kg in August, 1 kg in September. For comparison, China exported 7,965 kg in July alone.', stat: '7,965 kg → 0 kg in one month' as string | null },
                        { color: '#F59E0B', date: 'September 2023 – mid 2024', title: 'Licenses granted, exports resume at reduced levels', body: 'Exports partially resume but Jan–Aug 2024 total is 16,700 kg — down 55% vs the same period in 2023.', stat: 'Exports down 55% in 2024 vs 2023' as string | null },
                        { color: '#DC2626', date: 'December 3, 2024', title: 'China bans germanium exports to the United States', body: 'MOFCOM Announcement No. 46: exports of gallium, germanium, antimony, and superhard materials to the US will not be permitted "in principle." Direct retaliation for expanded US semiconductor export controls.', stat: null as string | null },
                        { color: '#059669', date: 'November 9, 2025', title: 'China suspends the US export ban', body: 'Following a Trump-Xi meeting in Busan, MOFCOM suspends the December 2024 US ban. Suspension runs until November 27, 2026. The broader global licensing regime remains in force.', stat: 'Suspension expires: Nov 27, 2026' as string | null },
                      ]).map((item, i) => (
                        <div key={i} style={{ position: 'relative', padding: `0 0 ${i < 4 ? '16px' : '0'} 20px` }}>
                          <div style={{ position: 'absolute', left: '-18px', top: '5px', width: '7px', height: '7px', borderRadius: '50%', background: item.color }}></div>
                          <div style={{ fontSize: '9px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: '2px', fontFamily: "'Geist Mono', monospace" }}>{item.date}</div>
                          <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', fontWeight: 600, color: '#1C1E21', marginBottom: '3px' }}>{item.title}</div>
                          <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11px', color: '#6B7280', lineHeight: 1.55 }}>{item.body}</div>
                          {item.stat && <div style={{ display: 'inline-block', background: '#F3F4F6', borderRadius: '3px', padding: '2px 8px', fontSize: '9px', fontWeight: 600, color: '#1C1E21', marginTop: '4px', fontFamily: "'Geist Mono', monospace" }}>{item.stat}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: '#FFFBEB', borderRadius: '4px', padding: '14px 16px', margin: '20px 0' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#92400E', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>Key data point</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#78350F', lineHeight: 1.6 }}>The Stimson Center found that in 2024, germanium exports to the US fell by ~5,900 kg while exports to Belgium increased by ~6,150 kg — suggesting <strong>third-country routing</strong> through Belgium to circumvent restrictions.</p>
                  </div>
                  <hr style={{ border: 'none', borderTop: '0.5px solid #E5E7EB', margin: '24px 0' }} />
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>What this means</div>
                    {([
                      { num: '01', title: 'Germanium is a diplomatic bargaining chip, not a permanent policy', body: 'The November 2025 suspension was explicitly linked to the broader US-China trade truce. Germanium export policy is a function of geopolitical relations, not resource management. It can be toggled on and off.' },
                      { num: '02', title: 'The control architecture remains intact', body: 'China has suspended one element — the outright US ban. The August 2023 global licensing requirement still applies. MOFCOM still approves every germanium export. China has not dismantled its control apparatus.' },
                      { num: '03', title: 'The suspension has an expiration date', body: 'November 27, 2026. After that, China can reimpose the full ban with a single announcement. Any company building supply chain plans around resumed Chinese exports is building on a foundation that disappears in months.' },
                      { num: '04', title: 'The damage is already done', body: "Even during licensing periods, volumes dropped 55%. Western buyers are actively building alternatives regardless of current policy. The Umicore-DRC deal, the Teck government talks, and the DoD grants all accelerated because of the controls — and they won't reverse just because the ban is temporarily lifted." },
                      { num: '05', title: 'Germanium is part of a systematic pattern', body: "China has applied export controls to germanium, gallium, antimony, graphite, rare earths, and lithium battery materials. MOFCOM has placed controls on 17 mineral commodities to date." },
                    ]).map((item, i) => (
                      <div key={i} style={{ padding: '14px 16px', background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: '6px', marginTop: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 600, color: '#92400E', minWidth: '18px', fontFamily: "'Geist Mono', monospace" }}>{item.num}</div>
                          <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', fontWeight: 600, color: '#1C1E21' }}>{item.title}</div>
                        </div>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, paddingLeft: '26px' }}>{item.body}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#FEF2F2', borderRadius: '4px', padding: '14px 16px', margin: '20px 0' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#991B1B', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>Bottom line</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#7F1D1D', lineHeight: 1.6 }}>Access to 93% of the world&apos;s germanium mining output is controlled by a government that has demonstrated willingness to restrict it as geopolitical leverage. The current suspension is temporary, conditional, and expires in November 2026. <strong>Any assessment of germanium supply reliability must treat Chinese exports as a variable that can go to zero at any time — because it already has.</strong></p>
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: USGS MCS 2025, China MOFCOM Announcements No. 23 (2023), No. 46 (2024), No. 72 (2025), Stimson Center April 2025, ORF America May 2025, CNBC November 2025, Fastmarkets November 2025.
                  </div>
                </div>
              </div>
            ) : activePopup === "catalysts" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '8px' }}>$600B in hyperscaler capex, a ticking export ban clock, and BEAD construction all converge in 2026</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#ECFDF5', color: '#065F46', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Catalysts</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Overview</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Catalysts are specific, dateable events that could materially shift germanium supply-demand dynamics. <strong style={{ fontWeight: 600, color: '#1C1E21' }}>2026 is the convergence year</strong> where multiple tightening catalysts hit simultaneously.</p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '3px', fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '14px', background: '#FEF2F2', color: '#991B1B', fontFamily: "'Geist Mono', monospace" }}>Tightening — making the shortage worse</div>
                    {([
                      { num: '01', title: 'China export ban suspension expires', date: 'Nov 27, 2026', dateColor: 'red', body: 'The single most important near-term catalyst. After November 27, 2026, Beijing can reimpose with a single announcement. The broader MOFCOM licensing regime remains in force. This is a countdown, not a resolution.', stat: null as string | null },
                      { num: '02', title: 'Hyperscaler AI capex hits $600B+', date: '2026', dateColor: 'red', body: 'The Big Five are projected to spend over $600B on infrastructure in 2026, a 36% increase from 2025. AI data centers require 10–36x more fiber than traditional facilities. Every dollar translates into fiber demand which translates into germanium consumption.', stat: 'Amazon $200B · Alphabet $175–185B · Meta $115–135B · Microsoft $120B+' as string | null },
                      { num: '03', title: 'BEAD fiber construction begins at scale', date: '2026–2030', dateColor: 'amber', body: 'The $42.5B federal broadband program is transitioning from planning to construction. When BEAD ramps, it pulls on the same germanium-dependent fiber supply chain that AI datacenters are already straining.', stat: '$42.5B total · 32/56 states approved' as string | null },
                      { num: '04', title: 'Defense stockpiling acceleration', date: 'Ongoing', dateColor: 'amber', body: 'DoD awarded $14.4M in April 2024 under the Defense Production Act for germanium wafer capacity. USGS classified germanium among the highest-risk critical minerals in 2025. Further DPA funding allocations are likely.', stat: null as string | null },
                      { num: '05', title: 'Controls extend to EU/Japan buyers', date: 'Plausible', dateColor: 'amber', body: 'During the licensing period, Chinese exports redirected: Belgium 33%, Germany 32%, Japan 6%. If China extends restrictions, the last supply channels for western buyers collapse.', stat: null as string | null },
                    ]).map((cat, i) => (
                      <div key={i} style={{ padding: '16px 18px', background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: '6px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flex: 1 }}>
                            <div style={{ fontSize: '10px', fontWeight: 600, color: '#991B1B', minWidth: '18px', fontFamily: "'Geist Mono', monospace" }}>{cat.num}</div>
                            <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35 }}>{cat.title}</div>
                          </div>
                          <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.05em', padding: '3px 8px', borderRadius: '3px', whiteSpace: 'nowrap' as const, marginLeft: '8px', flexShrink: 0, fontFamily: "'Geist Mono', monospace", background: cat.dateColor === 'red' ? '#FEF2F2' : '#FEF3C7', color: cat.dateColor === 'red' ? '#991B1B' : '#92400E' }}>{cat.date}</div>
                        </div>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, paddingLeft: '26px' }}>{cat.body}</div>
                        {cat.stat && <div style={{ display: 'inline-block', background: '#F3F4F6', borderRadius: '3px', padding: '2px 8px', fontSize: '9px', fontWeight: 600, color: '#1C1E21', marginTop: '6px', marginLeft: '26px', fontFamily: "'Geist Mono', monospace" }}>{cat.stat}</div>}
                      </div>
                    ))}
                  </div>
                  <hr style={{ border: 'none', borderTop: '0.5px solid #E5E7EB', margin: '24px 0' }} />
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '3px', fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '14px', background: '#ECFDF5', color: '#065F46', fontFamily: "'Geist Mono', monospace" }}>Easing — could relieve pressure</div>
                    {([
                      { num: '06', title: 'DRC/Umicore reaches production scale', date: '2027–2029', dateColor: 'green', body: 'The Umicore-STL partnership at Big Hill tailings holds 700+ tonnes of Ge potential. Could add 10–20t/yr of new western primary supply within 3–5 years. The most important easing catalyst — but DRC operating environment adds significant execution risk.' },
                      { num: '07', title: 'Teck Resources government-backed expansion', date: 'Timeline unclear', dateColor: 'blue', body: 'Teck in active discussions with US and Canadian governments to expand germanium recovery from zinc operations. Government backing through DPA or Canadian critical minerals programs could accelerate.' },
                      { num: '08', title: 'Nyrstar Clarksville $150M Ge/Ga facility', date: 'Stalled', dateColor: 'blue', body: 'Before suspending Tennessee mining operations in late 2024, Nyrstar proposed a $150M facility to recover germanium and gallium. Currently stalled — likely requires government funding to restart.' },
                      { num: '09', title: 'Hollow-core fiber commercialization', date: '2028–2030', dateColor: 'green', body: 'Eliminates germanium entirely — light travels through air, not germanium-doped glass. Microsoft acquired Lumenisity in 2022 and is deploying in specific datacenter applications. Most credible long-term technology threat to the supply thesis.' },
                      { num: '10', title: 'China-US trade normalization', date: 'Conditional', dateColor: 'blue', body: "The November 2025 suspension proves normalization is possible. If China fully lifts the licensing regime, western-accessible supply roughly doubles overnight. However, rare earth precedent shows buyers diversify permanently." },
                    ]).map((cat, i) => (
                      <div key={i} style={{ padding: '16px 18px', background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: '6px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flex: 1 }}>
                            <div style={{ fontSize: '10px', fontWeight: 600, color: '#065F46', minWidth: '18px', fontFamily: "'Geist Mono', monospace" }}>{cat.num}</div>
                            <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35 }}>{cat.title}</div>
                          </div>
                          <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.05em', padding: '3px 8px', borderRadius: '3px', whiteSpace: 'nowrap' as const, marginLeft: '8px', flexShrink: 0, fontFamily: "'Geist Mono', monospace", background: cat.dateColor === 'green' ? '#ECFDF5' : '#EFF6FF', color: cat.dateColor === 'green' ? '#065F46' : '#1E40AF' }}>{cat.date}</div>
                        </div>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, paddingLeft: '26px' }}>{cat.body}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#FEF2F2', borderRadius: '4px', padding: '14px 16px', margin: '20px 0' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#991B1B', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>The convergence problem</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#7F1D1D', lineHeight: 1.6 }}>2026 is the year where multiple demand catalysts converge — all hitting a supply base fixed at 65–85 tonnes of western-accessible germanium. <strong>The easing catalysts are all 2–5 years from material impact.</strong> The tightening happens now. The relief arrives later.</p>
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: USGS MCS 2025, CreditSights Hyperscaler Capex 2026 Estimates, Futurum Group AI Capex 2026, NTIA BEAD Progress Dashboard, Corning Q3 2025 earnings, Fastmarkets November 2025.
                  </div>
                </div>
              </div>
            ) : activePopup === "emerging-tech" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>AI can find zinc deposits in days — but the germanium inside still takes a decade to reach the market</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#F5F3FF', color: '#5B21B6', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Emerging Tech</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>The technology landscape</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Four technology vectors are converging on the germanium supply problem, but they operate on fundamentally different timescales. AI-driven exploration compresses discovery. Advanced recovery extracts more germanium from existing waste streams. Recycling closes the loop. And substitution gradually reduces demand.</p>
                  </div>
                  {([
                    { num: '01', label: 'Find more — AI-driven exploration', body: 'AI geological models can now predict trace-metal concentrations in unmapped regions with high accuracy. KoBold Metals, BHP\'s Geosciences AI team, and USGS GeoAI have demonstrated that ML applied to geophysical data can identify high-germanium zinc deposits in weeks rather than years.', players: [{ name: 'KoBold Metals', role: 'AI-first mineral exploration', detail: 'Raised $537M. Targeting critical minerals across Africa and Americas with ML-driven geophysical models.', tag: 'Private', tagBg: '#F5F3FF', tagColor: '#5B21B6' }, { name: 'USGS GeoAI', role: 'Government open-source models', detail: 'Published national-scale critical mineral potential maps in 2024. Alaska zinc–germanium corridors flagged as high-priority.', tag: 'Public resource', tagBg: '#ECFDF5', tagColor: '#065F46' }], impact: 'AI can compress discovery to 6–18 months. But discovery is only the first step. Permitting, development, and construction add 8–15 years. No AI exploration result that began today produces supply before 2035.' },
                    { num: '02', label: 'Extract more — advanced recovery', body: 'Current germanium recovery rates from zinc smelting are only 30–50%. Process improvements — including solvent extraction optimization and AI-tuned hydrometallurgy — can push recovery to 60–70%. Applied across existing western smelters, this represents a potential 15–25 tonne annual increase without new mining.', players: [{ name: 'Umicore (Hoboken)', role: 'Advanced refining, R&D leader', detail: 'Running proprietary hydrometallurgy upgrades at Hoboken. Target: push Ge recovery above 65%.', tag: 'EBR: UMI', tagBg: '#EFF6FF', tagColor: '#1E40AF' }, { name: 'Nyrstar (Trafigura)', role: 'Zinc smelter with Ge recovery gaps', detail: 'Hobart and Clarksville smelters currently recover <40% of available germanium in feed. Process audit underway per Q3 2025.', tag: 'Private', tagBg: '#FEF3C7', tagColor: '#92400E' }], impact: 'Recovery improvements are the fastest path to incremental western supply. A 2–3 year process upgrade cycle could add 10–20 tonnes/year by 2027. Not a solution — but a meaningful bridge.' },
                    { num: '03', label: 'Recycle more — end-of-life recovery', body: 'Germanium recovery from end-of-life fiber optic cable is technically feasible but logistically immature. A single transatlantic submarine cable contains 50–80 kg of germanium. Decommissioned cables are currently landfilled or incinerated at rates above 80%. The EU Critical Raw Materials Act (2024) has mandated end-of-life recovery targets.', players: [{ name: 'Umicore', role: 'Precious metals recycling, Ge recovery', detail: 'Only major refiner with dedicated germanium recycling circuit. End-of-life cable recovery at <5%.', tag: 'EBR: UMI', tagBg: '#EFF6FF', tagColor: '#1E40AF' }, { name: 'EU CRMA mandate', role: 'Regulatory driver for Ge recycling', detail: 'Sets 15% recycled content target for critical materials by 2030.', tag: 'Regulatory', tagBg: '#FEF3C7', tagColor: '#92400E' }], impact: 'Near-zero impact before 2028 due to collection infrastructure gaps. Post-CRMA mandate, recycling could supply 8–12% of western demand by 2030.' },
                    { num: '04', label: 'Replace it — substitution tech', body: 'Two substitution paths are technically credible: silicon photonics (eliminating germanium in optical transceivers) and hollow-core fiber (reducing germanium in fiber preforms by 60–85%). Hollow-core fiber uses air-guiding structures that require far less glass — and thus far less germanium.', players: [{ name: 'Silicon Photonics', role: 'Intel, Cisco, Broadcom, GlobalFoundries', detail: 'Pure silicon photodetectors advancing but full substitution is 5–8 years away for high-volume applications.', tag: 'Partial', tagBg: '#FEF3C7', tagColor: '#92400E' }, { name: 'Hollow-Core Fiber', role: 'Lumenisity (Microsoft), OFS, NKT Photonics', detail: 'Reduces germanium per km by 60–85%. Current cost premium 3–5x over standard SMF. Volume production begins 2026–2027.', tag: 'Emerging', tagBg: '#F5F3FF', tagColor: '#5B21B6' }], impact: 'Hollow-core fiber is the highest-conviction substitution play — volume production by 2027, with potential to reduce fiber-industry Ge demand by 30% by 2030.' },
                  ]).map((path, pi) => (
                    <div key={pi} style={{ marginTop: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6' }}>
                        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', fontWeight: 700, color: '#5B21B6', letterSpacing: '0.08em' }}>{path.num}</div>
                        <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', fontFamily: "'Geist Mono', monospace" }}>{path.label}</div>
                      </div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '12px' }}>{path.body}</p>
                      {path.players.map((player, i) => (
                        <div key={i} style={{ background: '#FAFAFA', border: '0.5px solid #E5E7EB', borderRadius: '4px', padding: '12px 14px', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                            <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', fontWeight: 600, color: '#1C1E21' }}>{player.name}</div>
                            <span style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.06em', padding: '2px 6px', borderRadius: '2px', background: player.tagBg, color: player.tagColor, fontFamily: "'Geist Mono', monospace", flexShrink: 0, marginLeft: '8px' }}>{player.tag}</span>
                          </div>
                          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>{player.role}</div>
                          <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6 }}>{player.detail}</div>
                        </div>
                      ))}
                      <div style={{ background: '#F5F3FF', borderRadius: '4px', padding: '10px 14px', marginTop: '4px' }}>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#4C1D95', lineHeight: 1.6 }}><strong style={{ fontWeight: 600 }}>Impact assessment:</strong> {path.impact}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ background: '#EDE9FE', borderRadius: '4px', padding: '14px 16px', margin: '24px 0' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#5B21B6', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>The timing gap</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#4C1D95', lineHeight: 1.6 }}>AI exploration finds new deposits in 2025–2027. Those deposits are permitted in 2030–2033 and producing in 2035–2040. Recovery improvements add 10–20 tonnes by 2027. Recycling infrastructure reaches scale by 2030. <strong style={{ fontWeight: 600 }}>The problem is acute from 2025–2030, before most of these vectors reach material impact.</strong></p>
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: KoBold Metals investor materials (2024), USGS GeoAI Critical Mineral Potential Maps (2024), EU Critical Raw Materials Act (2024), Umicore Annual Report 2024, Lumenisity/Microsoft acquisition (2022), Intel Silicon Photonics roadmap (OFC 2025).
                  </div>
                </div>
              </div>
            ) : activePopup === "major-companies" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '8px' }}>Four companies define the western germanium chain — here&apos;s how each one operates</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#EFF6FF', color: '#1E40AF', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Major companies</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Overview</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>These are the companies that appear repeatedly across the germanium supply chain analysis — as miners, refiners, recyclers, and processors. Each profile covers what the company does, its financial scale, and specifically why it matters to the germanium picture.</p>
                  </div>
                  {([
                    {
                      name: 'Umicore', ticker: 'XBRU: UMI',
                      sub: 'Brussels, Belgium · Founded 1805 · ~11,000 employees · Materials technology',
                      stats: [['€3.9B', 'Market cap'], ['€3.6B', 'FY25 Revenue'], ['€847M', 'FY25 Adj. EBITDA'], ['€16–17', 'Share price'], ['€7–22', '52-wk range']] as [string, string][],
                      whatTheyDo: 'Umicore operates across four business groups: Catalysis (€1.67B revenue — automotive emissions control catalysts), Recycling (€947M — precious metals recovery), Specialty Materials (€558M — germanium, cobalt, metal deposition), and Battery Materials (currently undergoing strategic reset). CEO Bart Sap (since May 2024) launched the "CORE" strategy in March 2025, refocusing on cash generation from foundation businesses.',
                      geRelevance: ['Umicore is the sole western germanium refiner operating at scale — their Olen, Belgium facility processes an estimated 40–50 tonnes/yr. They supply the majority of western fiber manufacturers with ultra-high-purity GeCl₄. Over 50% of their germanium comes from recycling via closed-loop tolling schemes.', 'In May 2024, they signed a long-term feedstock agreement with STL/Gécamines in the DRC to recover germanium from copper mine tailings — the most important new western primary source in decades, facilitated by the Minerals Security Partnership (14 nations + EU). Both germanium-related EU CRM Act projects belong to Umicore.'],
                      whyMatters: 'Umicore appears across 3 of 5 identified bottlenecks: sole western refiner (#1), DRC feedstock partner (#4), and dominant recycling feedstock controller (#5). Any disruption at Umicore cascades through the majority of non-Chinese germanium supply simultaneously.',
                    },
                    {
                      name: '5N Plus', ticker: 'TSX: VNP',
                      sub: 'Montreal, Canada · Founded 2000 · 849 employees · Specialty semiconductors & performance materials',
                      stats: [['C$2.5–2.8B', 'Market cap'], ['$391M', 'FY25 Revenue'], ['$50.6M', 'FY25 Earnings'], ['+245%', 'Earnings YoY'], ['$31.94', 'Avg analyst target']] as [string, string][],
                      whatTheyDo: 'Two business segments: Specialty Semiconductors (wafers for space solar and advanced electronics) and Performance Materials (semiconductor compounds for terrestrial applications). Added to S&P/TSX Composite in December 2025. Six analysts rate Strong Buy.',
                      geRelevance: ['5N Plus is the most direct publicly traded exposure to the germanium thesis. US government has funded their germanium capacity twice: $14.4M from DoD in April 2024 and $18.1M in January 2026, both targeting the St. George, Utah facility.', 'FY 2025: revenue $391M (+35%), earnings $50.6M (+245%). The government funding is specifically for germanium and gallium wafer production under the Defense Production Act. Their St. George facility is 23 km from Blue Moon\'s Apex mine.'],
                      whyMatters: 'The most directly investable public company in the western germanium chain. Has received direct DoD funding twice, is growing rapidly, and is geographically positioned to toll-process output from the incoming Apex mine. The key question is whether the 5x re-rating already prices in the thesis.',
                    },
                    {
                      name: 'Yunnan Chihong', ticker: 'SHE: 600497',
                      sub: 'Qujing, Yunnan, China · Vertically integrated zinc-germanium · Not accessible to western investors',
                      stats: [['65.9t', '2023 Ge output'], ['60t/yr', 'Ge capacity'], ['289,800t', '2024 Zn concentrate'], ['~30%', 'Share of global Ge'], ['32Mt+', 'Zn resources']] as [string, string][],
                      whatTheyDo: 'Yunnan Chihong is a fully vertically integrated zinc-germanium company — the only major producer where germanium is in the company name. Operations span geological exploration, mining, beneficiation, smelting, chemical engineering, deep processing, and R&D.',
                      geRelevance: ['In 2023, Yunnan Chihong produced 65,922 kg (65.9 tonnes) of germanium in products — an 18% increase YoY. This represents approximately 30% of the entire world\'s germanium supply from a single entity. Products include germanium metal, GeO₂, GeCl₄ for fiber optics, germanium substrates for solar cells, and germanium lenses for IR optics.', 'In late 2024, the company began a "deep safety system optimization project" at Huize mine. Q1 2025 zinc concentrate production fell a further 17,400 tonnes. Because germanium is a zinc byproduct, every tonne of reduced zinc output directly reduces germanium supply.'],
                      whyMatters: 'Yunnan Chihong is not investable for most western investors (Shanghai A-share). But it is the single most important company in the global germanium supply chain. Monitoring Chihong\'s quarterly zinc output is one of the most reliable leading indicators of global germanium supply.',
                    },
                    {
                      name: 'Teck Resources', ticker: 'TSX: TECK.B / NYSE: TECK',
                      sub: 'Vancouver, Canada · ~12,000 employees · Diversified mining (copper, zinc)',
                      stats: [['C$30B+', 'Market cap'], ['Undisclosed', 'Ge volumes'], ['Red Dog, AK', 'Sole US Ge source'], ['Declining', 'Ge deposit status'], ['In talks', 'Govt Ge expansion']] as [string, string][],
                      whatTheyDo: 'Canada\'s largest diversified mining company, operating across copper and zinc after selling its steelmaking coal business to Glencore for ~$7.3B in 2024. The company is primarily a copper story — their massive QB2 project in Chile is the growth driver. Zinc operations center on Red Dog in Alaska and the Trail smelter complex in British Columbia.',
                      geRelevance: ['Red Dog in northwest Alaska is the sole US deposit where germanium is recovered. Zinc concentrates containing trace germanium are shipped to a Canadian processing facility where germanium is recovered as dioxide and tetrachloride. Teck does not disclose germanium volumes and does not mention it in financial reporting. Germanium is financially immaterial to a C$30B+ company.', 'Red Dog\'s output is declining with no published reserve life extension. Teck recently sold the Apex mine in Utah to Blue Moon Metals, which plans to develop it specifically for germanium and gallium — suggesting Teck is shedding rather than investing in germanium-adjacent assets. However, the company is reported to be in active discussions with US and Canadian governments about expanding germanium recovery.'],
                      whyMatters: 'Teck controls the most strategically important germanium asset in North America but has no business incentive to develop it — germanium is immaterial to their financials. The pace of any germanium expansion will be driven by government policy and funding, not Teck\'s capital allocation priorities.',
                    },
                  ] as { name: string; ticker: string; sub: string; stats: [string, string][]; whatTheyDo: string; geRelevance: string[]; whyMatters: string }[]).map((co, idx) => (
                    <div key={idx} style={{ marginTop: '24px', border: '0.5px solid #E5E7EB', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ padding: '14px 16px', background: '#FAFAFA', borderBottom: '0.5px solid #F3F4F6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '14px', fontWeight: 600, color: '#1C1E21' }}>{co.name}</div>
                          <div style={{ fontSize: '9px', fontWeight: 600, color: '#2563A0', background: '#EFF6FF', padding: '2px 8px', borderRadius: '3px', fontFamily: "'Geist Mono', monospace" }}>{co.ticker}</div>
                        </div>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '10px', color: '#9CA3AF' }}>{co.sub}</div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', padding: '10px 16px', borderBottom: '0.5px solid #F3F4F6', background: '#fff' }}>
                        {co.stats.map(([val, label], si) => (
                          <div key={si} style={{ flex: 1, minWidth: '90px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1C1E21', fontFamily: "'Geist Mono', monospace" }}>{val}</div>
                            <div style={{ fontSize: '7px', color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginTop: '1px', fontFamily: "'Geist Mono', monospace" }}>{label}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: '14px 16px', background: '#fff' }}>
                        <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>What the company does</div>
                        <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: '8px' }}>{co.whatTheyDo}</p>
                        <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#9CA3AF', margin: '14px 0 6px', fontFamily: "'Geist Mono', monospace" }}>Germanium relevance</div>
                        {co.geRelevance.map((para, pi) => (
                          <p key={pi} style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: '8px' }}>{para}</p>
                        ))}
                        <div style={{ margin: '12px 0 0', padding: '10px 12px', borderRadius: '4px', background: '#EFF6FF' }}>
                          <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#1E40AF', marginBottom: '3px', fontFamily: "'Geist Mono', monospace" }}>Why this company matters</div>
                          <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '10.5px', color: '#1E3A5F', lineHeight: 1.5 }}>{co.whyMatters}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: Umicore FY 2025 results, 5N Plus FY 2025 results & govt grants, Yunnan Chihong 2023 Annual Report, Teck Resources 2023 Annual Report, USGS MCS 2025, Fastmarkets (Blue Moon/Apex acquisition Nov 2025).
                  </div>
                </div>
              </div>
            ) : activePopup === "investment-ideas" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '8px' }}>Companies and positions to watch across the germanium supply thesis</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#FEF3C7', color: '#92400E', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Investment ideas</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '12px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Overview</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.75, marginBottom: '12px' }}>The following are companies, technologies, and positions that connect directly to the germanium supply dynamics analyzed in the preceding insights. The point isn&apos;t to recommend any specific action — it&apos;s to map where value could accrue if the supply thesis plays out as the data suggests.</p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '12px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Public companies</div>
                    {([
                      { name: 'Umicore', meta: 'XBRU: UMI · €3.9B market cap · ~€16/share · 52-wk: €7–22', body: 'Umicore is the bottleneck through which virtually all western germanium flows. The angle most investors miss is the arbitrage. Chinese domestic germanium trades at ~$2,000/kg. Western germanium trades at $7,000–8,000+/kg. That\'s a 4x spread, and it exists because China\'s export controls have severed the normal price convergence mechanism. Umicore sits at the endpoint of the China → Belgium routing channel — taking in material at prices closer to the Chinese level, processing it in Olen, and selling ultra-high-purity GeCl₄ at western prices.', body2: 'This likely explains why the Electro-Optic Materials unit showed "significant earnings growth" in 2025 even as the broader Specialty Materials segment grew only 4%. The germanium margins may be 40–50%+ in the current environment. None of this is visible in their reporting — Umicore bundles germanium with cobalt and metal deposition. The stock trades on group-level sentiment where the battery materials writedown dominates. <strong>The germanium upside is real but hidden inside a complex company at a depressed valuation.</strong>' },
                      { name: '5N Plus', meta: 'TSX: VNP · C$2.5–2.8B market cap · ~C$28/share · 52-wk: C$4.90–31.78', body: 'The most direct publicly traded exposure to the germanium thesis. FY 2025 revenue $391M (+35%), earnings $50.6M (+245%), EPS beating estimates by 100%+ consistently. The US government has funded their germanium capacity twice: $14.4M from DoD in April 2024 and $18.1M in January 2026, both targeting the St. George, Utah facility. Added to the S&P/TSX Composite in December 2025.', body2: 'The question is whether the 5x re-rating already prices in the thesis. <strong>The next leg depends on whether 5N Plus can expand beyond space solar cell substrates into larger germanium markets</strong>: fiber optics–grade materials, broader defense applications, or toll processing for Blue Moon\'s Apex mine output, which is located 23 km from their St. George facility. That proximity is not accidental.' },
                      { name: 'Blue Moon Metals', meta: 'TSXV: MOON / NASDAQ: BMM · Pre-revenue · Production target 2028', body: 'Every other western germanium source is a zinc mine byproduct — production is tethered to zinc economics, not germanium demand. Blue Moon is building something structurally different: a mine where germanium and gallium are primary targets. They acquired the past-producing Apex mine in Utah from Teck (completed March 2026). Apex was the primary US germanium and gallium producer in the 1980s–90s.', body2: 'The shareholder base signals institutional seriousness: Oaktree Capital, Hartree Partners, Teck (8% stake), Wheaton Precious Metals, Altius Minerals, Baker Steel. <strong>If Apex reaches production in 2028, it becomes the first dedicated germanium mine in the western hemisphere during a structural shortage.</strong> Very early stage — pure optionality with meaningful execution risk.' },
                      { name: 'LightPath Technologies', meta: 'NASDAQ: LPTH · ~$660–750M market cap · ~$11/share · 345 employees', body: 'LightPath\'s CEO has stated the strategy explicitly: "convert the market\'s Germanium supply chain angst into BlackDiamond-based camera sales." Their proprietary BlackDiamond chalcogenide glass replaces germanium in IR optics — the second-largest end use at ~30% of consumption. Revenue scaling fast: FQ2 2026 was $16.4M (+120% YoY), gross margin 37%, backlog $97.8M.', body2: 'The structural tailwind is the FY 2026 NDAA, which mandates eliminating reliance on optical glass from certain foreign nations by January 1, 2030. <strong>Still unprofitable on a net basis but rapidly scaling toward breakeven. The germanium shortage is literally their business model</strong> — the longer it persists, the faster defense procurement shifts permanently to their materials.' },
                    ] as { name: string; meta: string; body: string; body2: string }[]).map((co, i) => (
                      <div key={i} style={{ marginTop: '20px' }}>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '13.5px', fontWeight: 600, color: '#1C1E21', marginBottom: '2px' }}>{co.name}</div>
                        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9px', color: '#9CA3AF', marginBottom: '10px' }}>{co.meta}</div>
                        <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>{co.body}</p>
                        <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }} dangerouslySetInnerHTML={{ __html: co.body2 }} />
                        {i < 3 && <hr style={{ border: 'none', borderTop: '0.5px solid #F3F4F6', margin: '20px 0 0' }} />}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '28px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '12px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Physical germanium</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.75, marginBottom: '12px' }}>Germanium has no futures market, no exchange-traded pricing mechanism, and no strategic government stockpile equivalent. All pricing is OTC. GeO₂ went from $940/kg in January 2024 to $7,000–8,600/kg by March 2026. A 4x spread persists between Chinese domestic (~$2,000/kg) and western pricing because export controls prevent arbitrage.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.75, marginBottom: '12px' }}>The November 27, 2026 expiration of China&apos;s ban suspension is a binary optionality event. If reimposed, western prices likely spike further. <strong style={{ fontWeight: 600, color: '#1C1E21' }}>Physical accumulation of GeO₂ or germanium metal is the most direct commodity play but requires storage capability, sourcing relationships, and tolerance for illiquidity.</strong></p>
                  </div>
                  <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '10.5px', color: '#9CA3AF', fontStyle: 'italic', lineHeight: 1.5, marginTop: '24px', padding: '12px 14px', background: '#F9FAFB', borderRadius: '4px' }}>
                    This analysis identifies areas of potential interest based on supply chain research. It is not a recommendation to buy, sell, or hold any security or commodity. All investments carry risk. Conduct independent due diligence before making any investment decisions.
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: Umicore FY 2025 results, Stimson Center (Apr 2025), 5N Plus FY 2025 results & govt grants, Blue Moon Metals press releases (Feb–Mar 2026), LightPath Technologies SEC filings & FQ1–FQ2 2026 results, NDAA FY2026, KoBold Metals Series C (Jan 2025), Argus Media / Strategic Metals Invest pricing.
                  </div>
                </div>
              </div>
            ) : activePopup === "comp-supply-demand" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>A chemical compound most investors have never heard of sits between germanium and every fiber strand on earth</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#EFF6FF', color: '#1E40AF', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Supply constraints</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>

                  {/* Takeaway */}
                  <div style={{ marginTop: '20px', padding: '14px 14px', background: 'rgba(30,64,175,0.03)', borderLeft: '2px solid #1E40AF', borderRadius: '0 3px 3px 0' }}>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#1e3a5f', lineHeight: 1.7, margin: 0 }}>87 tonnes of germanium enters this layer annually. After conversion losses, purification losses, and deposition losses, roughly 23–34 tonnes ends up embedded in fiber — the rest is captured and recycled through a single company. The entire western supply of the chemical that enables fiber optics flows through one facility in Belgium, fewer than 20 companies can turn it into preforms, and every one of them is running at full capacity. This layer doesn&apos;t just transmit the germanium shortage downstream — it amplifies it.</p>
                  </div>

                  {/* What GeCl₄ is and why it matters */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>What GeCl₄ is and why it matters</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>About 35–44% of the world&apos;s refined germanium — roughly 87 tonnes per year — is allocated to fiber optic production. The rest goes to IR optics, solar cells, semiconductors, and other applications.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>But germanium can&apos;t go directly into fiber. Refined germanium arrives as metal ingots or germanium dioxide powder — solid materials. Fiber manufacturing works with gases. The germanium must first be converted into germanium tetrachloride (GeCl₄) — a volatile liquid that can be vaporized and precisely metered into glass deposition systems.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>GeCl₄ is what makes fiber optic cable work. It controls how light travels through the glass. Without it, fiber is just a strand of silica. With it, the fiber carries the internet. <strong style={{ fontWeight: 600, color: '#1C1E21' }}>There is no substitute for standard single-mode fiber</strong> — the type that carries 99%+ of the world&apos;s data today.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: 0 }}>This component layer has two stages: the suppliers who convert germanium into ultra-pure GeCl₄, and the manufacturers who use that GeCl₄ to make fiber preforms and draw them into fiber strands.</p>
                  </div>

                  {/* Layer 1 — GeCl₄ suppliers */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '12px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Layer 1 — GeCl₄ suppliers</div>

                    {/* SVG: Layer 1 process flow */}
                    <svg viewBox="0 0 460 150" style={{ width: '100%', display: 'block', marginBottom: '14px' }}>
                      <defs>
                        <marker id="arrCSL1" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                          <path d="M0,0 L0,5 L5,2.5 z" fill="#9CA3AF"/>
                        </marker>
                      </defs>
                      {/* Box 1: GeO₂ powder */}
                      <rect x="0" y="12" width="88" height="44" rx="3" fill="#FFFBEB" stroke="#D97706" strokeWidth="0.75"/>
                      <text x="44" y="29" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="7.5" fontWeight="600" fill="#92400E">GeO₂ powder</text>
                      <text x="44" y="44" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="7" fill="#92400E">87 tonnes/yr</text>
                      {/* Arrow 1 + HCl */}
                      <line x1="89" y1="34" x2="118" y2="34" stroke="#9CA3AF" strokeWidth="1" markerEnd="url(#arrCSL1)"/>
                      <text x="103" y="30" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="6.5" fill="#9CA3AF">+ HCl</text>
                      {/* Box 2: Chlorination */}
                      <rect x="122" y="12" width="88" height="44" rx="3" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="0.75"/>
                      <text x="166" y="29" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="7.5" fontWeight="600" fill="#374151">Chlorination</text>
                      <text x="166" y="44" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="7" fill="#6B7280">Acid dissolution</text>
                      {/* Arrow 2 */}
                      <line x1="211" y1="34" x2="240" y2="34" stroke="#9CA3AF" strokeWidth="1" markerEnd="url(#arrCSL1)"/>
                      {/* Box 3: Distillation */}
                      <rect x="244" y="12" width="88" height="44" rx="3" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="0.75"/>
                      <text x="288" y="29" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="7.5" fontWeight="600" fill="#374151">Distillation</text>
                      <text x="288" y="44" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="7" fill="#6B7280">Quartz towers, 6N+</text>
                      {/* Arrow 3 */}
                      <line x1="333" y1="34" x2="362" y2="34" stroke="#9CA3AF" strokeWidth="1" markerEnd="url(#arrCSL1)"/>
                      {/* Box 4: 6N+ GeCl₄ */}
                      <rect x="366" y="12" width="92" height="44" rx="3" fill="#ECFDF5" stroke="#059669" strokeWidth="0.75"/>
                      <text x="412" y="29" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="7.5" fontWeight="600" fill="#065F46">6N+ GeCl₄</text>
                      <text x="412" y="44" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="7" fill="#065F46">~57t Ge equiv.</text>
                      {/* Dashed loss lines */}
                      <line x1="166" y1="57" x2="224" y2="76" stroke="#DC2626" strokeWidth="0.75" strokeDasharray="3,2"/>
                      <line x1="288" y1="57" x2="234" y2="76" stroke="#DC2626" strokeWidth="0.75" strokeDasharray="3,2"/>
                      {/* Loss box */}
                      <rect x="162" y="76" width="136" height="22" rx="3" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="0.75"/>
                      <text x="230" y="91" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="7.5" fontWeight="600" fill="#991B1B">~35% lost in purification</text>
                      {/* Footer note */}
                      <rect x="0" y="108" width="458" height="36" rx="3" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="0.5"/>
                      <text x="8" y="122" fontFamily="Inter,sans-serif" fontSize="7" fill="#6B7280">Lost in byproducts, waste fractions, arsenic removal. Much recoverable — recycled back to Umicore.</text>
                      <text x="8" y="136" fontFamily="Inter,sans-serif" fontSize="7" fill="#6B7280">Fewer than 6 facilities globally. Only Umicore serves the west at scale. Arsenic removal is the binding technical challenge.</text>
                    </svg>

                    {([
                      ['What they do:', 'These facilities take refined GeO₂ powder, dissolve it in acid to produce crude GeCl₄ liquid, then distill it repeatedly in quartz towers until it reaches 99.9999% purity (6N+). This extreme purity is non-negotiable — a single part-per-billion of the wrong impurity can ruin fiber performance.'],
                      ['Why so few can do it:', "The purification process requires specialized quartz distillation towers, proprietary temperature control techniques, and decades of accumulated process knowledge. The hardest technical challenge is removing arsenic, which behaves chemically similar to germanium and doesn't separate easily during distillation. There's no way to buy this capability off the shelf — new entrants need years of process development even after building the physical plant."],
                      ['How much is lost:', 'The chlorination and purification process loses approximately 35% of the germanium input. Of the ~87 tonnes of germanium allocated to fiber annually, roughly 57 tonnes worth of GeCl₄ emerges from this stage. The remaining ~30 tonnes is lost in chemical byproducts, waste fractions, and discarded distillation cuts — though much of this waste is recoverable through recycling.'],
                    ] as [string, string][]).map(([label, body], i) => (
                      <p key={i} style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>{label}</strong> {body}</p>
                    ))}
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>Who does it:</strong> Fewer than six facilities globally produce fiber-grade GeCl₄. <strong style={{ fontWeight: 600, color: '#1C1E21' }}>Umicore</strong> (Olen, Belgium) is the sole western supplier at scale. Chinese producers include <strong style={{ fontWeight: 600, color: '#1C1E21' }}>Yunnan Chihong</strong> (30t/yr dedicated GeCl₄ line), <strong style={{ fontWeight: 600, color: '#1C1E21' }}>Nanjing Germanium</strong>, and <strong style={{ fontWeight: 600, color: '#1C1E21' }}>GRINM</strong>. Russia&apos;s JSC Germanium is sanctioned. 5N Plus in Canada is expanding under DoD funding but doesn&apos;t yet produce GeCl₄ at meaningful volume.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: 0 }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>Output:</strong> Approximately 57 tonnes of germanium equivalent reaches fiber manufacturers as ultra-pure GeCl₄ annually (~168 tonnes in GeCl₄ weight terms). The GeCl₄ market for fiber optics is estimated at $92M–$500M annually depending on the source — a wide range reflecting how opaque this market is.</p>
                  </div>

                  {/* Layer 2 — Fiber preform manufacturers */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '12px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Layer 2 — Fiber preform manufacturers</div>

                    {/* SVG: Layer 2 process flow */}
                    <svg viewBox="0 0 460 196" style={{ width: '100%', display: 'block', marginBottom: '14px' }}>
                      <defs>
                        <marker id="arrCSL2" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                          <path d="M0,0 L0,5 L5,2.5 z" fill="#9CA3AF"/>
                        </marker>
                      </defs>

                      {/* Sub-process A label */}
                      <text x="0" y="9" fontFamily="Geist Mono,monospace" fontSize="6.5" fontWeight="600" fill="#9CA3AF" letterSpacing="1">PREFORM DEPOSITION</text>

                      {/* Box 1: GeCl₄ liq */}
                      <rect x="0" y="14" width="76" height="40" rx="3" fill="#ECFDF5" stroke="#059669" strokeWidth="0.75"/>
                      <text x="38" y="30" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="7" fontWeight="600" fill="#065F46">GeCl₄ liq.</text>
                      <text x="38" y="44" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="6.5" fill="#065F46">Ultra-pure 6N+</text>
                      <line x1="77" y1="34" x2="100" y2="34" stroke="#9CA3AF" strokeWidth="1" markerEnd="url(#arrCSL2)"/>

                      {/* Box 2: Vaporize */}
                      <rect x="104" y="14" width="68" height="40" rx="3" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="0.75"/>
                      <text x="138" y="30" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="7" fontWeight="600" fill="#374151">Vaporize</text>
                      <text x="138" y="44" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="6.5" fill="#6B7280">Liquid → gas</text>
                      <line x1="173" y1="34" x2="196" y2="34" stroke="#9CA3AF" strokeWidth="1" markerEnd="url(#arrCSL2)"/>

                      {/* Box 3: Deposit */}
                      <rect x="200" y="14" width="76" height="40" rx="3" fill="#FFFBEB" stroke="#D97706" strokeWidth="0.75"/>
                      <text x="238" y="30" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="7" fontWeight="600" fill="#92400E">Deposit</text>
                      <text x="238" y="44" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="6.5" fill="#92400E">~2,000°C layers</text>
                      <line x1="277" y1="34" x2="300" y2="34" stroke="#9CA3AF" strokeWidth="1" markerEnd="url(#arrCSL2)"/>

                      {/* Box 4: Collapse */}
                      <rect x="304" y="14" width="68" height="40" rx="3" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="0.75"/>
                      <text x="338" y="30" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="7" fontWeight="600" fill="#5B21B6">Collapse</text>
                      <text x="338" y="44" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="6.5" fill="#5B21B6">Solid glass rod</text>
                      <line x1="373" y1="34" x2="396" y2="34" stroke="#9CA3AF" strokeWidth="1" markerEnd="url(#arrCSL2)"/>

                      {/* Box 5: Preform */}
                      <rect x="400" y="14" width="58" height="40" rx="3" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="0.75"/>
                      <text x="429" y="30" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="7" fontWeight="600" fill="#5B21B6">Preform</text>
                      <text x="429" y="44" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="6.5" fill="#5B21B6">~1m glass rod</text>

                      {/* Dashed loss from Deposit */}
                      <line x1="238" y1="55" x2="238" y2="70" stroke="#DC2626" strokeWidth="0.75" strokeDasharray="3,2"/>
                      <rect x="183" y="70" width="110" height="20" rx="3" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="0.75"/>
                      <text x="238" y="83" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="7" fontWeight="600" fill="#991B1B">40–60% lost (MCVD)</text>

                      {/* Recycle note */}
                      <text x="0" y="103" fontFamily="Inter,sans-serif" fontSize="7" fill="#6B7280">Undeposited GeCl₄ captured from exhaust (&gt;95%) → recycled back upstream to Umicore</text>

                      {/* Sub-process B container */}
                      <rect x="0" y="112" width="458" height="78" rx="4" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="0.5"/>
                      <text x="8" y="124" fontFamily="Geist Mono,monospace" fontSize="6.5" fontWeight="600" fill="#9CA3AF" letterSpacing="1">FIBER DRAWING</text>

                      {/* Preform box */}
                      <rect x="8" y="130" width="60" height="26" rx="2" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="0.75"/>
                      <text x="38" y="147" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="6.5" fontWeight="600" fill="#5B21B6">Preform</text>
                      <line x1="69" y1="143" x2="93" y2="143" stroke="#9CA3AF" strokeWidth="1" markerEnd="url(#arrCSL2)"/>
                      <text x="81" y="139" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="6" fill="#9CA3AF">~2000°C</text>

                      {/* Draw tower box */}
                      <rect x="97" y="130" width="80" height="26" rx="2" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="0.75"/>
                      <text x="137" y="143" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="6.5" fontWeight="600" fill="#374151">Draw tower</text>
                      <text x="137" y="152" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="5.5" fill="#6B7280">10–20 m/s</text>
                      <line x1="178" y1="143" x2="200" y2="143" stroke="#9CA3AF" strokeWidth="1" markerEnd="url(#arrCSL2)"/>

                      {/* 125μm fiber box */}
                      <rect x="204" y="130" width="88" height="26" rx="2" fill="#ECFDF5" stroke="#059669" strokeWidth="0.75"/>
                      <text x="248" y="143" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="6.5" fontWeight="600" fill="#065F46">125μm fiber</text>
                      <text x="248" y="152" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="5.5" fill="#065F46">thinner than hair</text>
                      <line x1="293" y1="143" x2="315" y2="143" stroke="#9CA3AF" strokeWidth="1" markerEnd="url(#arrCSL2)"/>

                      {/* Spool box */}
                      <rect x="319" y="130" width="72" height="26" rx="2" fill="#ECFDF5" stroke="#059669" strokeWidth="0.75"/>
                      <text x="355" y="143" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="6.5" fontWeight="600" fill="#065F46">Spool</text>
                      <text x="355" y="152" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="5.5" fill="#065F46">250+ km/preform</text>

                      {/* Cross-section note */}
                      <text x="8" y="178" fontFamily="Inter,sans-serif" fontSize="6.5" fill="#9CA3AF">Cross-section shrinks ~1,000× → length extends ~1,000×. All internal structure scales down perfectly.</text>
                    </svg>

                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>What they do:</strong> These companies turn ultra-pure GeCl₄ into the glass rods (preforms) that become fiber strands. GeCl₄ arrives as a liquid. It&apos;s vaporized and fed as a gas into a hollow glass tube spinning on a lathe. A flame moves along the outside of the tube, heating it to about 2,000°C. Where the heat hits, the gas inside reacts and deposits a thin layer of germanium-doped glass on the inner wall. The flame passes back and forth dozens or hundreds of times, building up layers. Then the heat cranks up further and the hollow tube collapses into a solid glass rod — that&apos;s the preform.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>The preform then goes into the top of a tall vertical furnace called a draw tower. The bottom tip melts and a thin strand of glass drops downward — that strand is the fiber, about 125 micrometers wide (thinner than a human hair). As the strand pulls down at 10–20 meters per second, the preform slowly feeds in from the top and gets consumed. The entire preform stretches into a continuous fiber strand because the cross-section shrinks by roughly 1,000x, extending the length proportionally. All the internal structure — the germanium-doped core, the cladding around it — scales down perfectly.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>Why there are more players but capacity is still tight:</strong> About 20 companies globally make preforms, compared to fewer than 6 for GeCl₄. The reason is that preform manufacturing uses established equipment platforms that can be purchased. But the equipment comes from a very concentrated supplier base — <strong style={{ fontWeight: 600, color: '#1C1E21' }}>Rosendahl Nextrom</strong> in Austria dominates with hundreds of systems in 73+ countries. When every manufacturer tries to expand at once, equipment delivery backlogs stack up. A new preform line takes 18–24 months minimum from order to first production.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>How much is lost:</strong> In the most common deposition process (MCVD), only 40–60% of the GeCl₄ gas actually deposits into the glass. The rest flows through and out the other end. Of the ~57 tonnes of germanium equivalent entering this stage, only 23–34 tonnes ends up embedded in fiber. Manufacturers capture over 95% of the waste and send it back upstream — mostly to Umicore — for recycling. About 20% of germanium at advanced facilities comes from reclaimed preform waste. <strong style={{ fontWeight: 600, color: '#1C1E21' }}>Over half of Umicore&apos;s germanium input comes from their customers&apos; waste.</strong></p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>Who does it:</strong> The top three — <strong style={{ fontWeight: 600, color: '#1C1E21' }}>YOFC</strong> (3,500 tonnes/year preform capacity, the world&apos;s largest), <strong style={{ fontWeight: 600, color: '#1C1E21' }}>Corning</strong>, and <strong style={{ fontWeight: 600, color: '#1C1E21' }}>Prysmian</strong> — control over 40% of global capacity. The preform market was valued at roughly $2.9 billion in 2024. Global fiber strand output exceeds 1 billion fiber-km per year, with China producing about 60%.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: 0 }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>Why they can&apos;t scale faster:</strong> Every manufacturer is running at 95–100% utilization. Corning is building a $170–268M expansion in Hickory, NC. Shin-Etsu is investing ¥18B in preform expansion. But these take years. And every new preform line increases demand for GeCl₄, which increases demand for germanium. <strong style={{ fontWeight: 600, color: '#1C1E21' }}>Expanding at this layer tightens the layer above it.</strong></p>
                  </div>

                  {/* Germanium-to-fiber conversion model */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Germanium-to-fiber conversion model</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '12px' }}>Based on USGS germanium allocation (~87 tonnes/year to fiber) and global fiber strand production (~1 billion fiber-km/year), both 2024–2025 data:</p>
                    <table style={{ width: '100%', borderCollapse: 'collapse' as const, margin: '0 0 12px', fontSize: '11px' }}>
                      <thead>
                        <tr>
                          {['Stage', 'Input', 'Loss', 'Output', 'Per fiber-km'].map(h => (
                            <th key={h} style={{ fontSize: '7.5px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#9CA3AF', textAlign: 'left' as const, padding: '6px 8px', background: '#F9FAFB', borderBottom: '0.5px solid #E5E7EB', fontFamily: "'Geist Mono', monospace" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {([
                          ['Germanium allocated to fiber', '87t/yr', '—', '87t Ge', '0.087g Ge'],
                          ['Chlorination & purification', '87t Ge', '~35%', '~57t Ge as GeCl₄ (~168t GeCl₄)', '0.057g Ge'],
                          ['Deposition into preform', '~57t Ge', '40–60%', '~23–34t Ge embedded', '0.023–0.034g Ge'],
                          ['Recycling recovery', '~53–64t lost', '>95% captured', '~50–61t returned to Umicore', '—'],
                          ['Net permanently lost', '—', '—', '~3–5t/yr', '~0.003–0.005g Ge'],
                        ] as [string,string,string,string,string][]).map(([stage, input, loss, output, perKm], i) => (
                          <tr key={i} style={{ background: i % 2 === 1 ? '#FAFAF8' : 'white' }}>
                            <td style={{ padding: '7px 8px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "Inter, sans-serif", color: '#374151', fontSize: '11px' }}>{stage}</td>
                            <td style={{ padding: '7px 8px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace", color: '#374151', fontSize: '10px', whiteSpace: 'nowrap' as const }}>{input}</td>
                            <td style={{ padding: '7px 8px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace", color: '#9CA3AF', fontSize: '10px', whiteSpace: 'nowrap' as const }}>{loss}</td>
                            <td style={{ padding: '7px 8px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace", color: '#1C1E21', fontSize: '10px' }}>{output}</td>
                            <td style={{ padding: '7px 8px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace", color: '#374151', fontSize: '10px', whiteSpace: 'nowrap' as const }}>{perKm}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Each kilometer of fiber strand requires approximately 0.09 grams of germanium input — of which roughly a third ends up embedded in the glass and most of the rest is captured and recycled.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>The demand projection:</strong> If annual fiber deployment doubles to 1.3–1.4 billion fiber-km by 2030, germanium input for fiber alone would need ~120–130 tonnes — over half of total global production, up from 35–44% today.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11px', color: '#9CA3AF', lineHeight: 1.6, marginBottom: 0, fontStyle: 'italic' }}>Confidence: INFERRED — calculated from aggregate USGS and industry data. Loss rates from peer-reviewed sources. Actual values vary by manufacturer and process type.</p>
                  </div>

                  {/* Core constraints */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Core constraints</div>
                    {([
                      ['The facility constraint.', "Fewer than six facilities on earth can produce 6N+ GeCl₄. Only one serves the west at scale. Building new capacity takes 3–5 years and requires process knowledge that can't be purchased."],
                      ['The recycling monopoly.', 'Over 50% of germanium flowing through this layer is waste sent to Umicore for reprocessing. They are simultaneously the primary supplier and the sole recycler at scale. If their recycling capacity is constrained, the entire loop tightens. The dependency is circular with no alternative.'],
                      ['The yield cascade.', 'From germanium entering this layer to germanium embedded in fiber: roughly 25–40% survives. The loss rate is dictated by physics unchanged since 1974.'],
                      ['The input competition.', 'Only 35–44% of global germanium goes to fiber. IR optics, solar, semiconductors, and defense compete for the same 220-tonne pool.'],
                      ['The scaling timeline.', 'New GeCl₄ capacity: 3–5 years. New preform lines: 18–24 months. Neither can respond quickly to surges. And expanding downstream tightens supply upstream.'],
                    ] as [string, string][]).map(([title, body], i) => (
                      <div key={i} style={{ marginBottom: '12px' }}>
                        <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, margin: 0 }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>{title}</strong> {body}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: USGS Mineral Commodity Summaries 2024–2025; Umicore Germanium Solutions; IEEE Xplore — Germanium Chemistry in MCVD; Grand View Research — Fiber Optic Preform Market; Amanda Van Dyke — The Germanium Chokepoint; Rosendahl Nextrom.
                  </div>
                </div>
              </div>
            ) : activePopup === "comp-bottlenecks" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>The component layer has five chokepoints — and three of them run through the same company</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#FEF2F2', color: '#991B1B', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Bottlenecks</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  {([
                    ['Umicore — sole western GeCl₄ producer', '95% — Critical', 'Olen, Belgium · ~35% global GeCl₄ share · >50% from recycled feed', 'Every western fiber preform manufacturer — Corning, Prysmian, Sumitomo, Fujikura — sources ultrapure GeCl₄ from Umicore. Their Olen facility is the only non-Chinese, non-Russian operation producing 6N+ purity GeCl₄ at volumes sufficient to supply the western fiber industry. If Olen experiences any disruption, there is no western alternative at comparable scale or purity. The next-largest non-Chinese producer (5N Plus in Canada) has meaningful output not expected before 2027–2028.'],
                    ['Rosendahl Nextrom — preform equipment near-monopoly', '80% — High', 'Austria (KNILL Gruppe) · Hundreds of MCVD units since 1990 · Projects in 73+ countries', 'The OFC 12 MCVD system is described as "the most widely used MCVD system in the industry." A surge in simultaneous expansion orders (which the current demand environment is producing) creates equipment delivery backlogs that extend capacity ramps beyond the inherent process timeline. Privately held — the bottleneck is invisible until it manifests as delayed expansions at Corning or Prysmian.'],
                    ['6N+ purification — arsenic removal as binding constraint', '75% — High', '~5–6 facilities globally · Multi-stage quartz distillation · Arsenic co-distillation problem', 'AsCl₃ boils at 130°C vs. GeCl₄ at 83.1°C — close enough to require specialized extraction with quartz stills and repeated fractional distillation. Only ~5–6 facilities globally can produce 6N+ GeCl₄. Of these, only Umicore is accessible to western fiber manufacturers. Even if more raw germanium became available tomorrow, converting it to fiber-grade GeCl₄ would take years of facility construction.'],
                    ['Preform manufacturing concentration — top 3 control >40%', '70% — High', 'YOFC (3,500 t/a) · Corning · Prysmian · 18–24 month expansion cycle', 'All preform lines globally are running at 95–100% utilization. The 18–24 month expansion timeline is irreducible — it reflects the physics of commissioning MCVD/OVD/VAD systems. Every new preform line commissioned increases GeCl₄ demand: the preform bottleneck and GeCl₄ bottleneck are coupled, creating a feedback loop where capacity relief at one layer immediately becomes demand pressure at the other.'],
                    ['Military demand priority — high-purity preforms redirected', '60% — Medium', 'G.657A1 at $22/km · G.657A2 at $35/km · Military orders given priority allocation', 'Fiber-guided munitions (FPV drones consuming 10–40 km of single-mode fiber per flight) have created a new demand category pulling from the same preform pool as commercial fiber. Russia\'s fiber procurement alone jumped from <1% to 10.5% of global fiber demand in 2025. Defense procurement operates outside commercial supply-demand equilibrium — it is not price-sensitive.'],
                  ] as [string, string, string, string][]).map(([title, severity, meta, body], i) => (
                    <div key={i} style={{ marginTop: '24px' }}>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '6px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Bottleneck {String(i + 1).padStart(2, '0')}</div>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '13px', fontWeight: 600, color: '#1C1E21', marginBottom: '3px' }}>{title}</div>
                      <div style={{ display: 'flex', gap: 6, marginBottom: '8px', flexWrap: 'wrap' as const }}>
                        <span style={{ fontSize: '7.5px', padding: '2px 7px', borderRadius: '3px', fontWeight: 600, fontFamily: "'Geist Mono', monospace", background: i === 0 ? '#FEF2F2' : i < 3 ? '#FEF3C7' : '#F3F4F6', color: i === 0 ? '#991B1B' : i < 3 ? '#92400E' : '#6B7280' }}>{severity}</span>
                        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '7.5px', color: '#9CA3AF' }}>{meta}</span>
                      </div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, marginBottom: 0 }}>{body}</p>
                    </div>
                  ))}
                  <div style={{ marginTop: '24px', padding: '12px 14px', background: '#FEF2F2', borderRadius: '4px', border: '0.5px solid rgba(153,27,27,0.12)' }}>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#6B3A3A', lineHeight: 1.65, margin: 0 }}>Umicore is the sole western GeCl₄ producer (Bottleneck #1), AND depends on preform manufacturers&apos; scrap for recycled feed (coupled to #4), AND supplies GeCl₄ to the same manufacturers whose military-priority production reduces Umicore&apos;s recycling feedstock (#5). <strong style={{ fontWeight: 600 }}>A single company sits at the intersection of three of the five identified bottlenecks.</strong></p>
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: Umicore Germanium Solutions, Rosendahl Nextrom Product Documentation, Credence Research Optical Fiber Preform Equipment Market, Grand View Research Fiber Optic Preform Market Share, Commmesh 2026 Fiber Price Analysis.
                  </div>
                </div>
              </div>
            ) : activePopup === "comp-geopolitical" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>The export controls were designed for the component layer — GeO₂ and GeCl₄ were named specifically, not caught incidentally</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#FEF3C7', color: '#92400E', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Geopolitical risk</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>The six controlled items</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>When MOFCOM announced export controls in July 2023, <strong style={{ fontWeight: 600, color: '#1C1E21' }}>six specific germanium products were individually enumerated</strong> — and GeO₂ and GeCl₄ were both explicitly named. This was not an oversight. China designed the controls to target the component layer directly, recognizing that controlling chemical intermediates is more strategically effective than controlling the metal alone.</p>
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4, margin: '12px 0' }}>
                      {['Metal germanium', 'Zone-melted germanium ingots', 'Phosphorus germanium zinc (GeZnP)', 'Germanium epitaxial growth substrates', 'Germanium dioxide (GeO₂) — HS 2825.60', 'Germanium tetrachloride (GeCl₄) — dual-use export control'].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '5px 8px', background: i >= 4 ? 'rgba(146,64,14,0.05)' : '#F9FAFB', borderRadius: 3, border: i >= 4 ? '0.5px solid rgba(146,64,14,0.15)' : '0.5px solid #F3F4F6' }}>
                          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', color: i >= 4 ? '#92400E' : '#9CA3AF', minWidth: 12, fontWeight: 600 }}>{String(i + 1).padStart(2, '0')}</span>
                          <span style={{ fontFamily: "Inter, sans-serif", fontSize: '11.5px', color: i >= 4 ? '#92400E' : '#374151', fontWeight: i >= 4 ? 600 : 400 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, marginTop: '10px' }}>GeO₂ and GeCl₄ are classified under separate HS codes from germanium metal. A company importing germanium metal and converting it to GeCl₄ domestically does not bypass the controls — <strong style={{ fontWeight: 600, color: '#1C1E21' }}>the finished compound is itself a controlled item requiring a separate MOFCOM license for export.</strong></p>
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Component-level impact is more severe than raw material controls</div>
                    {([
                      ['01 — GeCl₄ has fewer substitution pathways than germanium metal.', 'Raw germanium has multiple end uses (IR optics, solar, electronics, fiber). GeCl₄ is purpose-built for fiber preform manufacturing. Controlling GeCl₄ directly targets the fiber optic supply chain with surgical precision.'],
                      ['02 — Licensing approval is slower for dual-use chemicals.', 'GeCl₄ is classified as a dual-use chemical compound, requiring end-user documentation and intended-use verification from MOFCOM. Each application is reviewed independently. The licensing process introduces unpredictable 4–8 week delays that prevent reliable supply planning for preform manufacturers operating on 18–24 month production horizons.'],
                      ['03 — Third-country routing is harder for processed chemicals.', 'Chinese germanium exports to Belgium increased ~224% in 2024 relative to 2022, suggesting third-country routing of germanium metal. But GeCl₄ re-export is technically riskier: the compound carries specific chemical identification that can be traced to its origin, and the licensing system requires end-use documentation that creates paper trails.'],
                    ] as [string, string][]).map(([title, body], i) => (
                      <div key={i} style={{ marginBottom: '12px' }}>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', fontWeight: 600, color: '#1C1E21', marginBottom: '4px' }}>{title}</div>
                        <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, margin: 0 }}>{body}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>China&apos;s domestic GeCl₄ producers</div>
                    {([
                      ['Yunnan Chihong Zinc & Germanium (600497)', 'State-owned subsidiary of Chinalco. Produced 65.9t of germanium products in 2023, operates a dedicated 30t/yr GeCl₄ production line for optical fiber applications. This single production line represents a meaningful fraction of global ultrapure GeCl₄ supply.'],
                      ['China Germanium (Nanjing)', 'Located in Nanjing Lishui Economic Development Zone. 25t/yr germanium ingot capacity, 15t/yr GeO₂. Produces GeCl₄ for fiber optic and infrared applications. Export-dependent company now subject to mandatory MOFCOM licensing.'],
                      ['GRINM / Vital Materials', 'State-linked germanium processor serving domestic supply chain. Capacity undisclosed.'],
                    ] as [string, string][]).map(([name, body], i) => (
                      <div key={i} style={{ marginBottom: '12px', padding: '8px 10px', background: '#F9FAFB', borderRadius: 3, border: '0.5px solid #F3F4F6' }}>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', fontWeight: 600, color: '#1C1E21', marginBottom: '4px' }}>{name}</div>
                        <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#374151', lineHeight: 1.65, margin: 0 }}>{body}</p>
                      </div>
                    ))}
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, marginTop: '10px' }}>Chinese fiber manufacturers (YOFC, Hengtong, FiberHome) access GeCl₄ from these domestic producers through a parallel supply chain that is <strong style={{ fontWeight: 600, color: '#1C1E21' }}>completely insulated from export controls.</strong></p>
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Impact on western fiber manufacturers</div>
                    {([
                      ['Supply disruption:', 'Companies using Chinese-sourced GeCl₄ face unpredictable licensing approval timelines. MOFCOM reviews each application independently, creating planning uncertainty incompatible with the 18–24 month preform production cycles that fiber manufacturers operate on.'],
                      ['Cost premium:', 'Secondary sourcing from Umicore (the only non-Chinese option at scale) adds 15–25% cost premiums relative to pre-control Chinese pricing. Germanium metal prices climbed 200% from January 2024 to February 2026, and GeCl₄ pricing followed.'],
                      ['Contractual lock-in:', "Prysmian's 2025 renewal of its Umicore supply agreement signals that western manufacturers see no near-term alternative to single-source dependency. They are contractually codifying the bottleneck rather than diversifying away from it."],
                      ["YOFC's structural advantage:", 'Chinese fiber manufacturers source GeCl₄ domestically — completely insulated from the very restrictions they impose on western competitors. This is not a temporary trade disruption — it is a permanent structural cost and availability advantage.'],
                    ] as [string, string][]).map(([label, body], i) => (
                      <div key={i} style={{ marginBottom: '10px' }}>
                        <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, margin: 0 }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>{label}</strong> {body}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>The November 2025 suspension</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Following a Trump-Xi meeting in Busan, MOFCOM suspended the full US export ban (Announcement No. 46, December 2024) effective November 9, 2025. The suspension runs until <strong style={{ fontWeight: 600, color: '#1C1E21' }}>November 27, 2026</strong>. The global dual-use export licensing requirement (August 2023) remains in full force regardless. Military end-user restrictions remain fully in effect. MOFCOM retains discretion to grant or deny individual export licenses.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>The suspension provides partial relief for civilian fiber manufacturers but does not eliminate the licensing bottleneck. Every GeCl₄ shipment still requires MOFCOM approval with end-use documentation. <strong style={{ fontWeight: 600, color: '#1C1E21' }}>The control architecture remains intact, and China retains the ability to reimpose the full ban after November 27, 2026 with a single announcement.</strong></p>
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Enforcement escalation</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>May 2025:</strong> China launched a coordinated interagency crackdown on transshipment and smuggling involving 10+ central ministries. Belgium and other conduit countries were explicitly targeted in enforcement messaging.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>Long-arm jurisdiction:</strong> The December 2024 ban invoked &quot;long-arm jurisdiction&quot; provisions — any organization globally violating the rules faces legal consequences. This is designed to prevent third-country processors from re-exporting Chinese-origin GeCl₄ to US end users.</p>
                  </div>

                  <div style={{ marginTop: '16px', padding: '12px 14px', background: 'rgba(146,64,14,0.04)', borderRadius: '4px', border: '0.5px solid rgba(146,64,14,0.15)' }}>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#92400E', lineHeight: 1.65, margin: 0 }}>China designed the controls specifically to include GeO₂ and GeCl₄ as named items, controls them under stricter dual-use chemical licensing than raw metal, and Chinese fiber manufacturers operate in a parallel supply chain immune to the restrictions they impose on western competitors. <strong style={{ fontWeight: 600 }}>The November 2025 suspension is a diplomatic gesture, not a structural resolution.</strong></p>
                  </div>

                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: MOFCOM Regular Press Conference July 6, 2023; IEA Policy Database — China Germanium/Gallium Export Controls; USGS Mineral Commodity Summaries 2024 and 2025; Stimson Center — China&apos;s Germanium and Gallium Export Restrictions (2025); CNBC — China Suspends Ban on Exports of Gallium, Germanium, Antimony to US (November 9, 2025); Fastmarkets Germanium Pricing Data; Winston &amp; Strawn Global Trade Analysis; Light Reading — &apos;Perfect Storm&apos; in Fiber Supply (2025); Cabling Installation &amp; Maintenance — Prysmian-Umicore Partnership (2025).
                  </div>
                </div>
              </div>
            ) : activePopup === "comp-catalysts" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>Five tightening forces converge on GeCl₄ supply before any easing catalyst can reach market scale</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#ECFDF5', color: '#065F46', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Catalysts</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Tightening catalysts</div>
                    {([
                      ['China export ban suspension expires: Nov 27, 2026', 'Binary event for GeCl₄ supply', 'MOFCOM can reimpose the full ban with a single announcement — no legislative process, no warning period. The broader global licensing requirement (August 2023) remains in force regardless. Markets will begin pricing this risk 3–6 months in advance. The May–August 2026 window is when germanium and fiber pricing will reflect probability-weighted ban reimposition.'],
                      ['Hyperscaler AI capex drives GeCl₄ to structural limits', '36x fiber multiplier per AI datacenter rack', 'AI-focused datacenters require approximately 36 times more fiber than traditional CPU-based racks. Five hyperscalers will spend $660–690B on infrastructure in 2026: Amazon ($200B), Google ($175–185B), Microsoft (~$120B), Meta ($115–135B), Oracle ($50B). Every dollar of AI infrastructure spend generates downstream fiber demand → more cable → more preforms → more GeCl₄ → more germanium.'],
                      ['BEAD program fiber deployment begins', '$42.45B federal broadband pulling from same GeCl₄ pool', '53 states and territories have received NTIA approval; peak construction runs 2026–2030. BEAD deployments drive sustained demand for standard G.652.D fiber, competing directly with AI infrastructure for limited preform capacity. The US government is simultaneously connecting rural homes and building AI infrastructure — from a supply chain already sold out through 2026.'],
                      ['New preform capacity commitments increase GeCl₄ demand', 'Every new preform line is a new GeCl₄ consumer', 'Corning\'s Hickory, NC expansion ($170–268M, announced October 2025) creates the world\'s largest fiber-optic cable plant. Shin-Etsu announced ¥18B capital investment for preform expansion. Each new preform line commissioned increases demand for GeCl₄. Capacity expansion at the preform layer is demand expansion at the GeCl₄ layer.'],
                    ] as [string, string, string][]).map(([title, impact, body], i) => (
                      <div key={i} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: i < 3 ? '0.5px solid #F3F4F6' : 'none' }}>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', fontWeight: 600, color: '#1C1E21', marginBottom: '3px' }}>{title}</div>
                        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', color: '#065F46', marginBottom: '8px' }}>{impact}</div>
                        <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, margin: 0 }}>{body}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Key dates</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' as const, margin: '8px 0', fontSize: '11px' }}>
                      <thead>
                        <tr>
                          {['Date', 'Event', 'GeCl₄ impact'].map(h => (
                            <th key={h} style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9CA3AF', textAlign: 'left' as const, padding: '6px 8px', borderBottom: '0.5px solid #E5E7EB', fontFamily: "'Geist Mono', monospace" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {([
                          ['H1 2026', 'BEAD groundbreakings; Corning Hickory expansion', 'Fiber demand spike; GeCl₄ demand increases'],
                          ['Nov 27, 2026', 'China ban suspension expires', 'Binary risk event for GeCl₄ availability'],
                          ['2027', 'Stade restart (40t/yr); 5N Plus ramping', 'Incremental non-Chinese supply (~55t combined)'],
                          ['2028–2029', '5N Plus at scale; DRC contributing to Umicore', 'More meaningful supply relief'],
                        ] as [string, string, string][]).map(([date, event, impact], i) => (
                          <tr key={i}>
                            <td style={{ padding: '7px 8px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace", color: date === 'Nov 27, 2026' ? '#991B1B' : '#374151', fontSize: '10px', whiteSpace: 'nowrap' as const, fontWeight: date === 'Nov 27, 2026' ? 600 : 400 }}>{date}</td>
                            <td style={{ padding: '7px 8px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "Inter, sans-serif", color: '#374151', fontSize: '11px' }}>{event}</td>
                            <td style={{ padding: '7px 8px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "Inter, sans-serif", color: '#6B7280', fontSize: '10.5px' }}>{impact}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Easing catalysts</div>
                    {([
                      ['Umicore EU-backed capacity expansion', '2026–2028 · Incremental, not transformative', 'The European Commission selected two Umicore germanium projects in February 2026: (a) process innovation to increase germanium recovery yields, and (b) new recycling technologies for complex waste streams. EU support includes streamlined permitting and dedicated finance access. These are process improvement projects, not new greenfield capacity. Incremental yield gains of 5–15% are meaningful but do not resolve the structural supply-demand gap.'],
                      ['5N Plus DoD-funded expansion', 'Meaningful output 2027–2029 · Up to 20t/yr at full scale', 'DoD awarded 5N Plus $18.1M in DPA Title III funds (December 2025) for St. George, Utah facility expansion. Target: up to 20 metric tonnes of high-purity germanium per year from industrial residues over 48 months. Very little revenue impact in 2026; benefits beginning in 2027 but more meaningful in 2028–2029 due to installation and ramp timelines.'],
                      ['DRC germanium reaching conversion stage', '2025–2028 · Concentrates flowing to Umicore for refining', 'Gécamines subsidiary STL began exporting germanium concentrates from Lubumbashi in October 2024 to Umicore for processing. DRC\'s hydrometallurgical plant should enable DRC to supply up to 30% of world\'s germanium demand at full scale. But conversion to GeCl₄ happens at Umicore in Belgium — DRC adds raw feed but does not add GeCl₄ conversion capacity. The DRC story eases the germanium metal bottleneck but reinforces the Umicore component-layer bottleneck.'],
                      ['Hollow-core fiber commercialization', 'Niche deployments 2026 · Meaningful market share 2028–2030', 'Microsoft achieved 1,280 km deployed HCF with zero field failures (0.091 dB/km loss), targeting 15,000 km by late 2026. YOFC achieved world-record 0.040 dB/km attenuation. HCF uses air rather than germanium-doped glass, eliminating germanium from the fiber layer. But near-term impact is limited — HCF deployments in 2026–2027 remain niche (~20,000 km total vs. billions km global installed base).'],
                      ['Non-Chinese recycling and refining capacity', '2026–2027 · Combined ~55t/yr vs. 170t needed to replace China', "Germany's Stade refinery plans to restart by 2027, adding 40t/yr. Kazakhstan's Padvolar refinery targets 15t/yr from H2 2026. Combined with existing western recyclers, this adds meaningful but insufficient volume to close the supply gap."],
                    ] as [string, string, string][]).map(([title, timeline, body], i) => (
                      <div key={i} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: i < 4 ? '0.5px solid #F3F4F6' : 'none' }}>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', fontWeight: 600, color: '#1C1E21', marginBottom: '3px' }}>{title}</div>
                        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', color: '#9CA3AF', marginBottom: '8px' }}>{timeline}</div>
                        <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, margin: 0 }}>{body}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '16px', padding: '12px 14px', background: '#F9FAFB', borderRadius: '4px' }}>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.65, margin: 0 }}>The tightening catalysts hit in 2026. The easing catalysts arrive in 2027–2029. <strong style={{ fontWeight: 600, color: '#1C1E21' }}>The gap between demand acceleration and supply response is 12–24 months — and it is during this window that GeCl₄ availability will determine which fiber manufacturers can produce and which cannot.</strong></p>
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: MOFCOM Export Ban Suspension Announcement November 2025; Fastmarkets Germanium Pricing; CNBC — China Suspends Ban (November 9, 2025); IEEE ComSoc Technology Blog — Fiber Demand 2026; MIT Technology Review — Hyperscale AI Data Centers 2026; NTIA BEAD Progress Dashboard; Corning News Release — Hickory Expansion; Umicore Newsroom — EU Project Selection February 2026; Umicore Full Year Results 2025; 5N Plus Q4 Earnings Call 2025; Semiconductor Today — 5N Plus DPA Award; Gécamines Press Release October 2024; Tom&apos;s Hardware — Microsoft HCF Deployment; Data Center Dynamics — Relativity-Prysmian Partnership.
                  </div>
                </div>
              </div>
            ) : activePopup === "comp-emerging-tech" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>Four technology vectors could reshape the component layer, but none reaches meaningful scale before the supply crisis peaks</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#EDE9FE', color: '#5B21B6', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Emerging tech</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  {([
                    ['Replace it: hollow-core fiber', 'Commercial deployments begun · Meaningful market share 2028–2030', 'Hollow-core fiber (HCF) is the only technology that eliminates germanium from the supply chain entirely — light travels through air rather than germanium-doped glass. Microsoft deployed 1,280 km across Azure with zero field failures (0.091 dB/km loss), targeting 15,000 km by late 2026. YOFC achieved a world-record 0.040 dB/km in lab conditions and 91.2 km single preform drawing. But total HCF deployment by end 2026 will be approximately 20,000 km against billions km of global installed base. HCF is the structural bear case for germanium demand — but it arrives after the supply crisis peaks.', 'bear'],
                    ['Use less: advanced deposition efficiency', 'PCVD technology available · Incremental adoption underway', 'MCVD (most widely deployed) achieves 40–60% GeCl₄-to-GeO₂ conversion efficiency. PCVD approaches 100% deposition efficiency through plasma-assisted heterogeneous deposition. Switching from MCVD to PCVD approximately doubles germanium utilization efficiency — but MCVD remains the dominant installed base globally, and equipment replacement cycles are measured in decades. Efficiency improvements slow the rate of demand growth; they do not reverse it.', 'neutral'],
                    ['Substitute the dopant: fluorine and phosphorus', 'Niche applications only · Not viable for standard telecom fiber', 'Fluorine doping creates depressed refractive index (suitable for cladding only, not core). Phosphorus serves Raman applications but is unsuitable for standard telecom core doping. The fundamental refractive index requirement for conventional fiber makes germanium extremely difficult to displace broadly. Total alternative dopant displacement: <10% of germanium consumption in telecoms by 2030.', 'neutral'],
                    ['Co-packaged optics: does NOT reduce fiber demand', 'CPO market $470M → $603M (2025→2026, CAGR 29.7%) · Net effect: increases germanium demand', 'CPO enables higher bandwidth density within datacenters but does not reduce total fiber consumption. AI datacenter buildout demands vastly exceed fiber supply regardless of transceiver technology. CPO actually accelerates fiber deployment by improving datacenter economics. Expected net germanium demand growth from CPO deployment: +8–12% through 2030. The technology that appears to reduce fiber-per-link increases total fiber deployed by making more datacenters economically viable.', 'bull'],
                  ] as [string, string, string, string][]).map(([title, status, body, dir], i) => (
                    <div key={i} style={{ marginTop: '24px', paddingBottom: '20px', borderBottom: i < 3 ? '0.5px solid #F3F4F6' : 'none' }}>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>Vector {String(i + 1).padStart(2, '0')}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: '6px' }}>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '13px', fontWeight: 600, color: '#1C1E21' }}>{title}</div>
                        <span style={{ fontSize: '7.5px', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Geist Mono', monospace", flexShrink: 0, fontWeight: 600, background: dir === 'bear' ? '#EDE9FE' : dir === 'bull' ? '#FEF2F2' : '#F3F4F6', color: dir === 'bear' ? '#5B21B6' : dir === 'bull' ? '#991B1B' : '#6B7280' }}>{dir === 'bear' ? 'Ge- bear' : dir === 'bull' ? 'Ge+ bull' : 'neutral'}</span>
                      </div>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', color: '#9CA3AF', marginBottom: '8px' }}>{status}</div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, margin: 0 }}>{body}</p>
                    </div>
                  ))}
                  <div style={{ marginTop: '20px', padding: '12px 14px', background: '#F9FAFB', borderRadius: '4px' }}>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.65, margin: 0 }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>The technologies that could save the supply chain don&apos;t arrive in time to prevent the shortage. The technologies that arrive in time don&apos;t save enough supply to matter.</strong></p>
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: YOFC Hollow-Core Fiber Press Releases; Microsoft Blog — Lumenisity Acquisition; Data Center Dynamics — Microsoft HCF Deployment; IEEE Xplore — Germanium Recovery from Optical Fiber Manufacturing; Grand View Research — Silicon Photonics Market.
                  </div>
                </div>
              </div>
            ) : activePopup === "comp-major-companies" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>Six companies define the germanium-to-fiber conversion layer — and the relationships between them reveal who actually controls supply</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#ECFEFF', color: '#155E75', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Major companies</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '20px', padding: '14px 14px', background: 'rgba(30,64,175,0.03)', borderLeft: '2px solid #1E40AF', borderRadius: '0 3px 3px 0' }}>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#1e3a5f', lineHeight: 1.7, margin: 0 }}>This layer is defined by asymmetric dependency. ~20 fiber manufacturers depend on fewer than six GeCl₄ suppliers — and in the west, that collapses to one company: Umicore. The recycling loop that returns over 50% of germanium back into the system runs through the same company. Chinese manufacturers operate on an entirely separate domestic supply chain at structurally lower cost.</p>
                  </div>
                  {([
                    {
                      name: 'Umicore',
                      ticker: 'XBRU: UMI',
                      sub: 'Brussels, Belgium · Founded 1805 · ~11,000 employees · Materials technology',
                      stats: [['€3.9B', 'Market cap'], ['€558M', 'FY25 Specialty Materials Rev'], ['€108M', 'FY25 Adj. EBITDA (SM)'], ['€16–17', 'Share price'], ['€7–22', '52-wk range']] as [string, string][],
                      whatTheyDo: 'Umicore operates across four business groups: Catalysis (€1.67B revenue — automotive emissions control), Recycling (€947M — precious metals recovery), Specialty Materials (€558M — germanium, cobalt, metal deposition), and Battery Materials (undergoing strategic reset). CEO Bart Sap launched the "CORE" strategy in March 2025, refocusing on cash generation from foundation businesses. Group revenue (excluding metal) reached €3.6B in 2025.',
                      geRelevance: [
                        'Umicore is the sole western GeCl₄ supplier at commercial fiber scale — their Olen, Belgium facility produces 8N purity (99.999999%) germanium tetrachloride and supplies the majority of the world\'s non-Chinese fiber manufacturers including Corning, Prysmian, Fujikura, Sumitomo, and Shin-Etsu. Over 50% of their germanium input comes from recycled manufacturing waste sent back by these same customers via closed-loop tolling agreements. They are simultaneously supplier and sole recycler — a circular dependency with no western alternative.',
                        'In March 2025, the EU Commission selected two Umicore germanium projects (GePETO and ReGAIN) as the only germanium-related projects under the Critical Raw Materials Act, granting streamlined permitting and access to EU funding. They also hold the exclusive offtake partnership with STL/Gécamines for DRC germanium concentrates — the only new primary western germanium source in decades.',
                      ],
                      whyMatters: 'Umicore occupies a position with no parallel in any other critical mineral supply chain. They are the sole western GeCl₄ supplier at scale, the sole western germanium recycler at scale, and the exclusive recipient of the only new western primary germanium source (DRC). Any disruption at Olen cascades through the majority of non-Chinese fiber production simultaneously. Chinese export controls are structurally beneficial to Umicore — they force western buyers to Olen at any price.',
                    },
                    {
                      name: 'Corning',
                      ticker: 'NYSE: GLW',
                      sub: 'Corning, NY, USA · Founded 1851 · ~61,000 employees · Materials science',
                      stats: [['~$36B', 'Market cap'], ['$1.65B', "Q3'25 Optical Comms Rev"], ['33%', 'Q3 YoY growth'], ['~$47', 'Share price'], ['$33–55', '52-wk range']] as [string, string][],
                      whatTheyDo: 'Corning invented the first low-loss optical fiber in 1970 and has dominated the fiber industry ever since. They operate across five segments: Optical Communications (fiber, cable, connectivity), Display Technologies, Specialty Materials, Environmental Technologies, and Life Sciences. Optical Communications is the growth engine — Q3 2025 revenue hit $1.65B (+33% YoY) with enterprise sales surging 58% on AI network demand. Their Springboard plan targets $11B in cumulative revenue opportunities through 2028.',
                      geRelevance: [
                        'Corning is the single largest non-Chinese consumer of fiber-grade germanium. They source GeCl₄ from Umicore under long-term supply agreements and use the proprietary OVD (Outside Vapor Deposition) process — which they invented — to produce preforms with higher deposition efficiency than standard MCVD. They operate two fiber manufacturing plants (Wilmington, Concord NC) and five cable plants across North Carolina.',
                        'In January 2026, Meta signed a multiyear agreement worth up to $6 billion for Corning to supply fiber, cable, and connectivity for AI data centers — equal to Corning\'s entire 2025 optical-communications revenue from a single customer. Ground was broken on the Hickory, NC cable manufacturing expansion in March 2026, with Meta as anchor customer. Corning also developed Contour — a smaller, denser cable designed specifically for AI, addressing the fact that Nvidia Blackwell 72-GPU racks require 16x more fiber than traditional cloud racks.',
                      ],
                      whyMatters: "Corning passes through germanium cost increases via fiber pricing and benefits from capacity-constrained pricing power — running at near-100% utilization with multi-year backlogs. The Meta $6B deal locks in demand at premium rates. But Corning's ability to fulfill orders is ultimately constrained by GeCl₄ supply from Umicore. Every new preform line Corning builds increases demand on the GeCl₄ layer above it.",
                    },
                    {
                      name: 'Prysmian',
                      ticker: 'BIT: PRY',
                      sub: 'Milan, Italy · Founded 2005 (Pirelli Cables spinoff) · ~30,000 employees · Cable systems',
                      stats: [['~€17B', 'Market cap'], ['€16B+', 'FY24 revenue'], ['$115M+', 'US optical capex'], ['~€65', 'Share price'], ['€48–72', '52-wk range']] as [string, string][],
                      whatTheyDo: "Prysmian is the world's largest cable company — energy cables, telecom cables, and submarine cable systems. Their acquisition of Encore Wire expanded their North American footprint and exposure to US electrification demand. The company covers the full cable value chain from preform manufacturing through to finished cable products for telecom, energy, and submarine applications.",
                      geRelevance: [
                        "Prysmian's Umicore relationship is the most publicly documented GeCl₄ supply arrangement in the industry. In 2020, they formalized a long-term supply AND recycling partnership explicitly targeting '100% sustainable germanium' through closed-loop recycling. Prysmian sends manufacturing waste back to Umicore, which reprocesses it into GeCl₄ and sells it back. This is the template for how the western germanium circular economy works.",
                        "Prysmian acquired a North American preform facility to control the critical preform-to-fiber step rather than depending on third-party suppliers. They're investing $115M+ across US facilities (including Jackson, TN) to expand optical cable capacity for BEAD broadband and AI data center demand.",
                      ],
                      whyMatters: "Prysmian demonstrates how the Umicore dependency works in practice — a formalized recycling loop where manufacturer waste becomes tomorrow's input. Their vertical integration from preform to cable reduces fragility vs competitors who buy preforms from third parties. But the GeCl₄ supply still flows through Umicore, and Prysmian's fiber revenue is diluted within a much larger energy and submarine cable business.",
                    },
                    {
                      name: 'Fujikura',
                      ticker: 'TYO: 5803',
                      sub: 'Tokyo, Japan · Founded 1885 · ~55,000 employees · Electrical & optical cables',
                      stats: [['~¥2.5T', 'Market cap'], ['¥979B', 'FY25 revenue'], ['22.5%', 'YoY growth'], ['~¥7,000', 'Share price'], ['¥2,500–8,000', '52-wk range']] as [string, string][],
                      whatTheyDo: 'Fujikura developed the world\'s first optical fiber in 1959 and has evolved from silk and insulated wire manufacturing into a global fiber optics leader. Revenue segments include Information Technology (optical fiber, cables, telecom components), Electronics (PCBs, connectors), Automotive (wiring harnesses), and Energy (power cables). Over 50% of revenue now comes from the United States, followed by Japan (23%) and Europe (11%). Approximately 75% of optical fiber output is exported.',
                      geRelevance: [
                        "Fujikura sources GeCl₄ primarily from Umicore, shipping it from Belgium to Japan. Pre-2023, Japanese manufacturers also imported germanium products from China (Japan received ~8% of China's germanium exports). MOFCOM controls have made Chinese supply unreliable, increasing Fujikura's dependence on Umicore.",
                        "Fujikura's stock surged 160% in 2025 — vastly outperforming the Nikkei 225 (+22%) — as AI data center demand accelerated. FY2025 revenue hit ¥979B (+22.5%), operating profit surged 68% in Q1 FY2026, and dividends reached a record ¥190/share. They're investing ¥45B in a new Japanese plant for optical fiber and high-tech materials capacity. 3-year net income CAGR: 32.58%.",
                      ],
                      whyMatters: 'Fujikura is the closest pure-play on the germanium-to-fiber thesis among major publicly traded companies. Revenue is overwhelmingly fiber/cable, customers include Google/Alphabet, and the stock price is highly correlated to AI infrastructure spending. But their GeCl₄ supply is entirely dependent on Umicore — no domestic Japanese GeCl₄ production exists. If Umicore supply tightens, Fujikura has fewer alternatives than Corning or Prysmian.',
                    },
                    {
                      name: 'YOFC — Yangtze Optical Fibre and Cable',
                      ticker: 'HKEX: 6869',
                      sub: 'Wuhan, China · Founded 1988 · ~10,000 employees · Fiber optic manufacturer',
                      stats: [['~HK$18B', 'Market cap'], ['3,500t/yr', 'Preform capacity'], ['~60%', 'China fiber share'], ['HK$18', 'Share price'], ['HK$10–22', '52-wk range']] as [string, string][],
                      whatTheyDo: 'YOFC is the world\'s largest optical fiber preform manufacturer by capacity and China\'s dominant fiber and cable producer. They are vertically integrated from preform manufacturing through fiber drawing to finished cable. YOFC holds joint ventures with Shin-Etsu Chemical (Japan) for advanced preform technology and has production bases across China.',
                      geRelevance: [
                        'YOFC operates on an entirely separate supply chain from western manufacturers. Their GeCl₄ comes from Chinese domestic sources — Yunnan Chihong (30t/yr dedicated GeCl₄ line), Nanjing Germanium, and state chemical plants — at controlled domestic pricing completely insulated from MOFCOM export controls and global germanium price surges. This creates a permanent structural cost advantage: when Corning pays Umicore spot-market prices for GeCl₄, YOFC pays Chinese domestic rates. Chinese manufacturers can undercut western rivals by 15–20% on fiber cable pricing.',
                        'YOFC is also the leader in hollow-core fiber (HCF) development — the technology that eliminates germanium from fiber entirely. In late 2023, they began commercial HCF production at scale and demonstrated a world-record 0.040 dB/km attenuation. In July 2024, YOFC and ZTE demonstrated the first real-time 1.2Tb/s single-wavelength transport over 20km of HCF.',
                      ],
                      whyMatters: 'YOFC represents the other side of the germanium thesis. While western companies benefit from germanium scarcity (pricing power, supply security premiums), YOFC benefits from germanium abundance (domestic supply at controlled prices). They\'re also developing the technology — hollow-core fiber — that could eventually eliminate germanium from fiber entirely. YOFC is simultaneously the low-cost producer in a germanium-constrained market AND the developer of the germanium-free alternative.',
                    },
                  ] as { name: string; ticker: string; sub: string; stats: [string, string][]; whatTheyDo: string; geRelevance: string[]; whyMatters: string }[]).map((co, idx) => (
                    <div key={idx} style={{ marginTop: '24px', border: '0.5px solid #E5E7EB', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ padding: '14px 16px', background: '#FAFAFA', borderBottom: '0.5px solid #F3F4F6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '14px', fontWeight: 600, color: '#1C1E21' }}>{co.name}</div>
                          <div style={{ fontSize: '9px', fontWeight: 600, color: '#2563A0', background: '#EFF6FF', padding: '2px 8px', borderRadius: '3px', fontFamily: "'Geist Mono', monospace" }}>{co.ticker}</div>
                        </div>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '10px', color: '#9CA3AF' }}>{co.sub}</div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', padding: '10px 16px', borderBottom: '0.5px solid #F3F4F6', background: '#fff' }}>
                        {co.stats.map(([val, label], si) => (
                          <div key={si} style={{ flex: 1, minWidth: '90px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1C1E21', fontFamily: "'Geist Mono', monospace" }}>{val}</div>
                            <div style={{ fontSize: '7px', color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginTop: '1px', fontFamily: "'Geist Mono', monospace" }}>{label}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: '14px 16px', background: '#fff' }}>
                        <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>What the company does</div>
                        <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: '8px' }}>{co.whatTheyDo}</p>
                        <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#9CA3AF', margin: '14px 0 6px', fontFamily: "'Geist Mono', monospace" }}>GeCl₄ relevance</div>
                        {co.geRelevance.map((para, pi) => (
                          <p key={pi} style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: '8px' }}>{para}</p>
                        ))}
                        <div style={{ margin: '12px 0 0', padding: '10px 12px', borderRadius: '4px', background: '#EFF6FF' }}>
                          <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#1E40AF', marginBottom: '3px', fontFamily: "'Geist Mono', monospace" }}>Why this company matters</div>
                          <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '10.5px', color: '#1E3A5F', lineHeight: 1.5 }}>{co.whyMatters}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: Umicore Full Year Results 2025; Corning-Meta $6B agreement (Jan 2026); Corning Hickory groundbreaking (Mar 2026); Prysmian-Umicore partnership (Oct 2020); Fujikura FY2025 earnings; YOFC HCF press releases; USGS Minerals Yearbook 2023; Stimson Center (2025).
                  </div>
                </div>
              </div>
            ) : activePopup === "comp-investment-ideas" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>Four positions across the GeCl₄ supply chain — from monopoly pricing to germanium obsolescence</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#FEF3C7', color: '#92400E', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Investment ideas</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '20px', padding: '14px 14px', background: 'rgba(30,64,175,0.03)', borderLeft: '2px solid #1E40AF', borderRadius: '0 3px 3px 0' }}>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#1e3a5f', lineHeight: 1.7, margin: 0 }}>The ideas at this layer fall into two camps: those that benefit from germanium scarcity getting worse, and those that benefit from germanium becoming irrelevant. Umicore sits at the center of the scarcity thesis with an asymmetric cost structure the market hasn&apos;t fully recognized. YOFC is positioned on both sides — low-cost germanium producer AND the leader in hollow-core fiber that eliminates germanium entirely. Corning and Prysmian are the established beneficiaries but are increasingly priced for the thesis to play out as expected. And hollow-core fiber represents the long-term structural disruption to every germanium-dependent position in this chain.</p>
                  </div>

                  {/* Card 1: Umicore */}
                  <div style={{ marginTop: '24px', border: '0.5px solid #E5E7EB', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', background: '#FAFAFA', borderBottom: '0.5px solid #F3F4F6' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '14px', fontWeight: 600, color: '#1C1E21' }}>Umicore</div>
                        <div style={{ fontSize: '9px', fontWeight: 600, color: '#2563A0', background: '#EFF6FF', padding: '2px 8px', borderRadius: '3px', fontFamily: "'Geist Mono', monospace" }}>XBRU: UMI</div>
                      </div>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '10px', color: '#9CA3AF' }}>The mispriced monopoly</div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', padding: '10px 16px', borderBottom: '0.5px solid #F3F4F6', background: '#fff' }}>
                      {([['€3.9B', 'Market cap'], ['€558M', 'FY25 Spec. Materials Rev'], ['€108M', 'FY25 SM EBITDA (+11%)'], ['€16–17', 'Share price'], ['€7–22', '52-wk range']] as [string, string][]).map(([val, label], si) => (
                        <div key={si} style={{ flex: 1, minWidth: '90px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1C1E21', fontFamily: "'Geist Mono', monospace" }}>{val}</div>
                          <div style={{ fontSize: '7px', color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginTop: '1px', fontFamily: "'Geist Mono', monospace" }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: '14px 16px', background: '#fff' }}>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>The case</div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: '8px' }}>Umicore is the only company in the west vertically integrated from germanium refining through recycling to GeCl₄ production. They hold exclusive offtake on the only new western primary germanium source — the DRC Big Hill project, where STL&apos;s hydrometallurgical plant has a 30 tonne/year capacity, with potential to supply up to 30% of global germanium demand at full ramp. They supply the majority of western and Japanese fiber manufacturers with the highest-purity GeCl₄ in the industry (8N — 99.999999%). They are the sole recycler of the manufacturing waste those same customers generate. If China enforces export controls past November 2026, Umicore becomes the single gateway for germanium supply to the entire western fiber optic industry.</p>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: '8px' }}>The stock has been beaten down by the battery materials slump — from €60 in 2021 to the €16 range today. But the core foundation businesses are growing: Specialty Materials revenue hit €558M in 2025 (+4% YoY), EBITDA grew 11% to €108M, driven specifically by what management described as &quot;significant earnings growth in Electro-Optic Materials, fueled by strong demand.&quot; The EU Commission selected two Umicore germanium projects (GePETO and ReGAIN) as the only germanium-related projects under the Critical Raw Materials Act.</p>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: '8px' }}>The margin structure is asymmetric. Over 50% of Umicore&apos;s germanium input comes from recycled manufacturing scrap under tolling agreements. In tolling, the fiber manufacturer sends waste back to Umicore, who charges a processing fee and returns refined GeCl₄. The processing fee is largely fixed regardless of germanium spot price. So when germanium surges from $1,340/kg to $8,597/kg, Umicore&apos;s cost on recycled input barely moves while their output pricing follows the market. Roughly 25–35% of input cost tracks spot while 100% of output pricing tracks spot. Every price increase widens the spread.</p>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#9CA3AF', margin: '14px 0 8px', fontFamily: "'Geist Mono', monospace" }}>The hidden revenue shift</div>
                      <div style={{ overflowX: 'auto' as const, marginBottom: '10px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: '10px', fontFamily: "Inter, -apple-system, sans-serif" }}>
                          <thead>
                            <tr style={{ background: '#F9FAFB' }}>
                              {(['Scenario', 'Ge input', 'GeCl₄ output', 'GeCl₄ price', 'Est. revenue', '% Spec. Materials', '% Group rev'] as string[]).map((h, hi) => (
                                <th key={hi} style={{ padding: '6px 8px', textAlign: 'left' as const, fontSize: '7px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#6B7280', border: '0.5px solid #E5E7EB', fontFamily: "'Geist Mono', monospace", whiteSpace: 'nowrap' as const }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {([
                              ['2025 base', '45t', '~86t', '$1,260/kg', '~$108M', '~18%', '~2.8%'],
                              ['Current capacity, elevated price', '45t', '~86t', '$5,000/kg', '~$430M', '~72%', '~11%'],
                              ['DRC ramp, elevated price', '75t', '~145t', '$5,000/kg', '~$725M', '>100%', '~19%'],
                            ] as string[][]).map((row, ri) => (
                              <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                                {row.map((cell, ci) => (
                                  <td key={ci} style={{ padding: '6px 8px', border: '0.5px solid #E5E7EB', color: ci === 0 ? '#1C1E21' : '#374151', fontWeight: ci === 0 ? 500 : 400, verticalAlign: 'top' as const, whiteSpace: ci > 0 ? 'nowrap' as const : 'normal' as const, fontFamily: ci > 0 ? "'Geist Mono', monospace" : "Inter, -apple-system, sans-serif", fontSize: ci > 0 ? '10px' : '11px' }}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: '6px' }}>If DRC ramps to capacity and germanium prices hold near 2026 levels, a product that&apos;s currently ~3% of group revenue could reach ~15–20% within 2–3 years on capacity expansion and price appreciation alone. And the margin profile on the recycled portion — over half of input — is significantly better than the revenue line suggests because input costs are decoupled from spot.</p>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '10px', color: '#9CA3AF', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '12px' }}>GeCl₄ pricing inferred from germanium spot movement, not observed directly. Umicore&apos;s contracts are a mix of spot, hedged, and tolling. Not all germanium input goes to GeCl₄. Confidence: LOW-MEDIUM on revenue projections, HIGH on structural positioning.</p>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#9CA3AF', margin: '14px 0 6px', fontFamily: "'Geist Mono', monospace" }}>The risks</div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: 0 }}>Hollow-core fiber adoption post-2028 structurally reduces GeCl₄ demand — the single biggest long-term risk to every germanium position. Single-facility concentration at Olen — any disruption halts western supply. Conglomerate structure may never give germanium proper market recognition. If China permanently lifts export controls, germanium prices fall and the recycling spread compresses. DRC ramp execution risk — political instability, logistics, processing quality. Battery Materials restructuring continues to weigh on overall group sentiment.</p>
                    </div>
                  </div>

                  {/* Card 2: YOFC */}
                  <div style={{ marginTop: '24px', border: '0.5px solid #E5E7EB', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', background: '#FAFAFA', borderBottom: '0.5px solid #F3F4F6' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '14px', fontWeight: 600, color: '#1C1E21' }}>YOFC — Yangtze Optical Fibre and Cable</div>
                        <div style={{ fontSize: '9px', fontWeight: 600, color: '#2563A0', background: '#EFF6FF', padding: '2px 8px', borderRadius: '3px', fontFamily: "'Geist Mono', monospace" }}>HKEX: 6869</div>
                      </div>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '10px', color: '#9CA3AF' }}>Both sides of the trade</div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', padding: '10px 16px', borderBottom: '0.5px solid #F3F4F6', background: '#fff' }}>
                      {([['~HK$18B', 'Market cap'], ['3,500t/yr', 'Preform capacity'], ['100+', 'Export countries'], ['12%', 'Global fiber share'], ['$5B', '2025 Rev (proj.)']] as [string, string][]).map(([val, label], si) => (
                        <div key={si} style={{ flex: 1, minWidth: '90px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1C1E21', fontFamily: "'Geist Mono', monospace" }}>{val}</div>
                          <div style={{ fontSize: '7px', color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginTop: '1px', fontFamily: "'Geist Mono', monospace" }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: '14px 16px', background: '#fff' }}>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>The case</div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: '8px' }}>Every other position at this layer picks a side: germanium scarcity gets worse, or germanium becomes irrelevant. YOFC doesn&apos;t have to choose. They are the world&apos;s largest preform manufacturer (3,500t/yr), sourcing GeCl₄ domestically from Yunnan Chihong and Chinese state plants at controlled prices completely insulated from MOFCOM export controls. When Corning pays Umicore elevated spot-linked prices for GeCl₄, YOFC pays domestic rates. Chinese fiber manufacturers undercut western rivals by 15–20% on cable pricing — a structural cost advantage, not a cyclical one.</p>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: '8px' }}>YOFC is also the global leader in hollow-core fiber — the technology that eliminates germanium from fiber entirely. They achieved world-record 0.040 dB/km HCF attenuation, began commercial production in late 2023, and demonstrated 1.2Tb/s single-wavelength transport over HCF with ZTE in July 2024. At ECOC 2025, YOFC presented attenuation data over 733 km of production HCF. If HCF achieves meaningful market share by 2028–2030, YOFC will have developed the replacement while profiting from the incumbent technology.</p>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: '8px' }}>The demand picture extends beyond China&apos;s domestic market. YOFC exports to 100+ countries with international plants in Mexico, Indonesia, South Africa, Brazil, and Poland. China&apos;s fiber optic exports surged 112% in 2023, driven by Belt and Road infrastructure across Southeast Asia, Africa, and Latin America. Fiber demand is global — not just a US/Europe story.</p>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: '8px' }}>China&apos;s domestic AI ambitions provide additional demand support. Chinese tech giants (Alibaba, Tencent, ByteDance, Baidu) committed $84 billion to AI infrastructure by 2027 — a 60% jump from 2025. Goldman Sachs estimates $70B+ in annual Chinese AI data center spending. The &quot;Eastern Data Western Computing&quot; program channels capacity to renewable-rich western provinces. China&apos;s hyperscale data center market is growing at 31% CAGR to $39B by 2031.</p>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#9CA3AF', margin: '14px 0 6px', fontFamily: "'Geist Mono', monospace" }}>The risks</div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: 0 }}>HKEX listing creates governance and transparency concerns — essentially uninvestable for some allocators. US-China tensions could trigger sanctions or restrict YOFC&apos;s access to western markets. Chinese domestic data center market shows signs of overbuilding — over 500 projects announced in 2023–2024 but many operate at 20–30% utilization. SMIC&apos;s chairman publicly warned that rushed AI capacity could remain idle. HCF commercial deployment at scale remains 2–4 years away. If domestic AI demand disappoints, YOFC&apos;s cost advantage doesn&apos;t compensate for weak pricing.</p>
                    </div>
                  </div>

                  {/* Card 3: Corning & Prysmian */}
                  <div style={{ marginTop: '24px', border: '0.5px solid #E5E7EB', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', background: '#FAFAFA', borderBottom: '0.5px solid #F3F4F6' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '14px', fontWeight: 600, color: '#1C1E21' }}>Corning &amp; Prysmian</div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <div style={{ fontSize: '9px', fontWeight: 600, color: '#2563A0', background: '#EFF6FF', padding: '2px 8px', borderRadius: '3px', fontFamily: "'Geist Mono', monospace" }}>NYSE: GLW</div>
                          <div style={{ fontSize: '9px', fontWeight: 600, color: '#2563A0', background: '#EFF6FF', padding: '2px 8px', borderRadius: '3px', fontFamily: "'Geist Mono', monospace" }}>BIT: PRY</div>
                        </div>
                      </div>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '10px', color: '#9CA3AF' }}>The known beneficiaries</div>
                    </div>
                    <div style={{ padding: '14px 16px', background: '#fff' }}>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '8px', fontFamily: "'Geist Mono', monospace" }}>The case</div>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Corning</div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: '8px' }}>Corning invented low-loss optical fiber in 1970 and has dominated the western fiber market ever since. Their proprietary OVD process produces larger preforms with higher deposition efficiency. In January 2026, Meta signed a multiyear agreement worth up to $6 billion — the largest single fiber supply deal ever announced. Under the agreement, Corning supplies optical fiber, cable, and connectivity for Meta&apos;s AI data center buildout. Construction on the Hickory, NC expansion broke ground in late March 2026 — when complete it will be one of the largest cable manufacturing facilities in the United States. Corning also developed Contour — a smaller, denser cable designed for AI data centers, addressing the fact that Nvidia Blackwell 72-GPU racks require 16x more fiber than traditional cloud racks. Optical communications revenue hit $1.65B in Q3 2025 (+33% YoY), enterprise sales surged 58%. Springboard plan upgraded to $11B through 2028.</p>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '6px', marginTop: '14px' }}>Prysmian</div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: '8px' }}>Prysmian is the world&apos;s largest cable company. In 2020, they formalized a long-term GeCl₄ supply and recycling partnership with Umicore targeting &apos;100% sustainable germanium&apos; through closed-loop recycling — the operational template for how the western germanium circular economy functions. Prysmian acquired a North American preform facility to vertically integrate the preform-to-fiber step. They invested $115M+ in US optical cable capacity across multiple facilities including Jackson, Tennessee. The Encore Wire acquisition expanded their North American footprint. In July 2025, Prysmian invested in Relativity Networks — an HCF startup — signaling they&apos;re hedging against the germanium-doped fiber thesis.</p>
                      <div style={{ margin: '12px 0 0', padding: '10px 12px', borderRadius: '4px', background: '#EFF6FF' }}>
                        <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#1E40AF', marginBottom: '3px', fontFamily: "'Geist Mono', monospace" }}>Why these are watching positions</div>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '10.5px', color: '#1E3A5F', lineHeight: 1.5 }}>Corning&apos;s stock has nearly tripled from mid-2024 levels (~$16 to ~$47). The AI fiber thesis is increasingly consensus. The risk/reward has shifted — there is more downside exposure to an AI capex pause or germanium supply constraint than remaining upside from demand acceleration that is already expected and contracted. Corning carries dot-com scar tissue — the stock multiplied 8x in 1997–2000 before losing 90% in the crash. Any GeCl₄ supply disruption that physically limits output — even with Meta&apos;s $6B committed — would create a divergence where Umicore strengthens while Corning weakens.</div>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Hollow-core fiber */}
                  <div style={{ marginTop: '24px', border: '0.5px solid #E5E7EB', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', background: '#FAFAFA', borderBottom: '0.5px solid #F3F4F6' }}>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '14px', fontWeight: 600, color: '#1C1E21', marginBottom: '6px' }}>Hollow-core fiber</div>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '10px', color: '#9CA3AF' }}>The germanium extinction thesis</div>
                    </div>
                    <div style={{ padding: '14px 16px', background: '#fff' }}>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>The case</div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: '8px' }}>Hollow-core fiber eliminates germanium from the fiber core entirely. Light propagates through air instead of germanium-doped glass — 47% faster transmission, 33% lower latency, broader spectrum, fewer repeaters, lower power consumption. If HCF reaches meaningful adoption in datacenter interconnects by 2028–2030, the entire germanium-for-fiber thesis weakens.</p>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: '8px' }}>HCF is no longer theoretical. Microsoft deployed over 1,280 km of live HCF in Azure with zero field failures. Their team measured 0.091 dB/km — the lowest operational loss ever recorded. In September 2025, Microsoft announced industrial-scale production with Corning (North Carolina) and Heraeus (Europe/US). Microsoft&apos;s goal is 15,000 km by late 2026 — over 75% of all global HCF. AWS has also signaled demand for more HCF than currently exists.</p>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#9CA3AF', margin: '14px 0 8px', fontFamily: "'Geist Mono', monospace" }}>What&apos;s limiting deployment</div>
                      {([
                        ['Manufacturing precision', 'HCF uses a "stack-and-draw" process requiring precise control of a nested anti-resonant tube structure. 50 years behind conventional fiber in manufacturing optimization.'],
                        ['Splicing', '0.3–0.6 dB loss per splice vs <0.05 dB for standard fiber. Air holes collapse if fusion arc is too hot.'],
                        ['Cost', 'Significantly above standard fiber. Cost-sensitive deployment estimated for 2028–2030 at $1–2/m target.'],
                        ['Standards', 'No ITU-T recommendations. No certified installation procedures. Field training not broadly available.'],
                        ['Ecosystem', 'Existing transceivers work but need retuning. Specialized connectors and handling required. VIAVI launched first certified HCF testing platform in early 2026.'],
                      ] as [string, string][]).map(([title, body], li) => (
                        <div key={li} style={{ marginBottom: '6px', padding: '8px 10px', background: '#F9FAFB', borderRadius: '3px', border: '0.5px solid #F3F4F6' }}>
                          <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '10.5px', fontWeight: 600, color: '#374151', marginBottom: '2px' }}>{title}</div>
                          <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '10.5px', color: '#6B7280', lineHeight: 1.5 }}>{body}</div>
                        </div>
                      ))}
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#9CA3AF', margin: '14px 0 6px', fontFamily: "'Geist Mono', monospace" }}>Can new players enter</div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: '8px' }}>Microsoft owns the key DNANF manufacturing IP and is selectively licensing to Corning and Heraeus. YOFC developed independently and is the only commercial-scale producer outside Microsoft&apos;s ecosystem. A new entrant would need to license from Microsoft/Southampton, develop independently (years of R&amp;D), or license from YOFC (geopolitically complex for western companies). Prysmian&apos;s Relativity Networks investment suggests a startup path. The barriers are high — the stack-and-draw process requires precision that takes years to master.</p>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#9CA3AF', margin: '14px 0 6px', fontFamily: "'Geist Mono', monospace" }}>The timeline</div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginBottom: 0 }}>Current global HCF deployment is measured in thousands of km against billions installed and ~700M km deployed annually. Even with Microsoft&apos;s 15,000 km target, HCF is a fraction of 1% of annual fiber deployment. The germanium supply crisis peaks in 2026–2028. HCF cannot relieve it in that window. This is a 3–5 year structural thesis, not a near-term catalyst.</p>
                    </div>
                  </div>

                  {/* Binary Event */}
                  <div style={{ marginTop: '28px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '12px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>The binary event: November 27, 2026</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Every position at this layer is affected by a single date. China&apos;s MOFCOM export ban suspension expires November 27, 2026. Markets will begin pricing the probability of reimposition 3–6 months in advance.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>If China reimpose the ban:</strong> Umicore becomes the sole western germanium gateway. GeCl₄ prices surge further. Corning and Prysmian face supply constraints. YOFC&apos;s domestic cost advantage widens. HCF urgency accelerates.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>If China extends or lifts controls:</strong> Germanium prices moderate. Umicore&apos;s recycling spread compresses. Western manufacturers regain Chinese supply access. YOFC&apos;s cost advantage narrows. HCF urgency diminishes.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, marginBottom: 0 }}>The structural shortage of preform capacity and AI/BEAD demand persists through 2027–2028 independent of what China decides. But the magnitude of the germanium premium — and therefore the magnitude of every position described above — depends heavily on this single policy decision.</p>
                  </div>

                  <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '10.5px', color: '#9CA3AF', fontStyle: 'italic', lineHeight: 1.5, marginTop: '24px', padding: '12px 14px', background: '#F9FAFB', borderRadius: '4px' }}>
                    This section presents objective analysis of market dynamics and company positioning. It does not constitute financial advice or a recommendation to buy, sell, or hold any security. All projections are estimates based on publicly available data and involve significant uncertainty.
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: Umicore Full Year Results 2025; Umicore EU CRM Act project selection (March 2025); Umicore-STL partnership (May 2024); Corning-Meta $6B agreement (January 2026); Corning Hickory groundbreaking (March 2026); Corning Q3 2025 earnings; Prysmian-Umicore partnership (October 2020); Prysmian Relativity Networks investment (July 2025); YOFC annual reports and HCF press releases; Goldman Sachs China AI forecast; Microsoft Azure HCF blog (September 2025); Fiber Broadband Association (April 2026); USGS Minerals Yearbook 2023; Stimson Center (2025).
                  </div>
                </div>
              </div>
            ) : activePopup === "sub-supply-demand" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>Cable manufacturing capacity, vessel availability, and repeater production define a subsystem layer where physical constraints outweigh financial ones</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#EFF6FF', color: '#1E40AF', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Supply constraints</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Submarine cable manufacturing</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>The global submarine cable market reached $32.8 billion in 2026, driven by hyperscaler demand for intercontinental bandwidth. Approximately 60 new submarine cable systems are planned or under construction globally through 2030. The three integrated manufacturers — SubCom, ASN (Alcatel Submarine Networks), and NEC — control more than 60% of wet-plant revenue and operate the only facilities capable of manufacturing repeatered submarine cable systems at scale.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Total submarine cable manufacturing capacity is approximately 100,000–120,000 km/year. Against planned deployments requiring 400,000+ km through 2030, the pipeline is saturated. <strong style={{ fontWeight: 600, color: '#1C1E21' }}>Lead times for turnkey submarine cable systems have stretched to 3–4 years from contract to ready-for-service</strong>, compared with 18–24 months historically.</p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Repeater and cable laying vessel constraints</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>EDFA repeaters are the highest-value components in submarine cable systems — a single transoceanic system may require 100+ repeaters at $500K–1M+ each. Repeater order books at SubCom and ASN are filled through 2027. Branching unit lead times have extended to 18–24 months.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Of approximately 60 cable laying vessels (CLVs) globally, only 15–20 are rated for deep-water transoceanic work. ~66% of the fleet will reach end-of-life by 2040 without replacement. <strong style={{ fontWeight: 600, color: '#1C1E21' }}>Vessel day rates have increased 40–60% since 2023</strong>. Weather windows restrict laying seasons to approximately 200 operational days per year in the North Atlantic — a constraint immune to capital.</p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Terrestrial deployment</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>The US alone requires an estimated 213.3 million additional fiber miles by 2029. Single-mode fiber prices surged more than 500% between January 2025 and early 2026, with G.657A2 fiber reaching $35/km. The binding constraint has shifted from cable availability to installation capacity — trained splicing crews, conduit access, and permitting.</p>
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: Prysmian FY2024 Results; SubCom Corporate Overview; TeleGeography Submarine Cable Map; Light Reading — Fiber Supply Threatens US Broadband Targets; NTIA BEAD Progress Dashboard.
                  </div>
                </div>
              </div>
            ) : activePopup === "sub-bottlenecks" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>Three chokepoints define the subsystem layer: wet-plant integration, cable laying vessel scheduling, and landing station permitting create irreducible lead times</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#FEF2F2', color: '#991B1B', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Bottlenecks</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  {([
                    ['Wet-plant oligopoly', 'SubCom (US) · ASN (France) · NEC (Japan) · Combined >60% of wet-plant revenue', 'SubCom, ASN, and NEC are the only facilities capable of manufacturing repeatered submarine cable systems at scale. The barrier to entry is extreme — submarine repeaters must operate for 25+ years at ocean-floor pressures without maintenance access. No new entrant has broken into the repeatered cable market in over two decades. Repeater order books at all three manufacturers are committed through 2027. The practical implication: a hyperscaler placing a new transoceanic cable order today will wait 3–4 years for ready-for-service delivery.'],
                    ['Cable laying vessel scheduling', 'Fleet booking 12–18 months advance · Only 15–20 deep-water rated vessels globally', 'Even when cable is manufactured and repeaters are ready, installation requires booking vessel time 12–18 months in advance. A single weather delay pushes vessel availability for subsequent projects. The dual-use nature of many CLVs — capable of both telecom and offshore wind installation — creates competition for vessel time between two surging sectors. Prysmian has responded by building the industry\'s largest private CLV fleet (8 vessels by 2028), removing capacity from the open market.'],
                    ['Landing station permitting', 'US: 18–36 months · EU: 12–24 months · NEPA + CZMA sequential approval', 'Every submarine cable requires terrestrial landing stations where subsea fiber transitions to terrestrial networks. US permitting involves coastal environmental reviews (NEPA, CZMA), FCC submarine cable landing license, and local government approvals. Virginia Beach serves as the US landing point for more than a dozen transatlantic cables — a single permitting moratorium would affect multiple systems simultaneously.'],
                    ['Terrestrial installation labor', 'Fiber splicers: 2–3 years to train · Workforce depleted in 2020–2022 downturn', 'Trained fiber splicing crews are the scarcest resource in the US deployment chain. Municipal permitting varies dramatically by jurisdiction — from weeks in rural areas to 12+ months in dense urban environments. As BEAD funding flows into construction in 2026, competition for qualified crews intensifies.'],
                  ] as [string, string, string][]).map(([title, meta, body], i) => (
                    <div key={i} style={{ marginTop: '24px', paddingBottom: '20px', borderBottom: i < 3 ? '0.5px solid #F3F4F6' : 'none' }}>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>Bottleneck {String(i + 1).padStart(2, '0')}</div>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '13px', fontWeight: 600, color: '#1C1E21', marginBottom: '4px' }}>{title}</div>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', color: '#9CA3AF', marginBottom: '8px' }}>{meta}</div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, margin: 0 }}>{body}</p>
                    </div>
                  ))}
                  <div style={{ marginTop: '20px', padding: '12px 14px', background: '#FEF2F2', borderRadius: '4px', border: '0.5px solid rgba(153,27,27,0.12)' }}>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#6B3A3A', lineHeight: 1.65, margin: 0 }}>The bottlenecks interact multiplicatively: a 3-month permitting delay pushes vessel scheduling, which cascades to the next project. <strong style={{ fontWeight: 600 }}>Companies that control these bottleneck assets hold structural pricing power that persists regardless of demand fluctuations.</strong></p>
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: TeleGeography — Submarine Cable Industry Analysis; SubCom Corporate Capabilities; ASN / French Government Nationalization 2024; Prysmian FY2024 Results; FCC Submarine Cable Landing License Process.
                  </div>
                </div>
              </div>
            ) : activePopup === "sub-geopolitical" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>State ownership of submarine cable manufacturers, deliberate cable sabotage, and the bifurcation of the global cable network into western and Chinese spheres define the subsystem layer&apos;s geopolitical risk</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#FEF3C7', color: '#92400E', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Geopolitical risk</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>HMN Technologies and market bifurcation</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>HMN Technologies (formerly Huawei Marine Networks) held ~23% of the global submarine cable market by length installed. Despite the restructuring to remove the Huawei name, western governments and hyperscalers have systematically excluded HMN from new cable projects on national security grounds. The 2020 Team Telecom recommendation against the Pacific Light Cable Network set the precedent.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>This exclusion has <strong style={{ fontWeight: 600, color: '#1C1E21' }}>bifurcated the global submarine cable network into two parallel supply chains.</strong> Western-funded systems use SubCom, ASN, or NEC exclusively. Chinese and Belt and Road systems use HMN and Hengtong. The PEACE cable (25,000 km) connects Pakistan, East Africa, and Europe — HMN&apos;s largest repeatered project.</p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Baltic Sea sabotage and France nationalizes ASN</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Since 2022, at least 10 submarine cable and pipeline incidents have occurred in the Baltic Sea. The October 2023 damage to the Balticconnector gas pipeline and Estonia-Finland telecom cable within 24 hours demonstrated the vulnerability of co-located submarine infrastructure. NATO launched a Maritime Centre for the Security of Critical Undersea Infrastructure in response.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>In March 2024, France completed the acquisition of ASN from Nokia for ~€350 million — explicitly framed as a national security decision. Under state ownership, ASN&apos;s project selection may increasingly reflect French and EU strategic priorities rather than purely commercial considerations. <strong style={{ fontWeight: 600, color: '#1C1E21' }}>Cable repair operations require the same specialized CLVs needed for new installation, meaning every sabotage event compounds the vessel scheduling bottleneck.</strong></p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>US government influence on SubCom</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>SubCom (acquired by Cerberus Capital in 2018 for ~$325M) is the only US-owned manufacturer of repeatered submarine cable systems. The US government uses diplomatic channels to steer cable contracts toward SubCom — particularly in the Indo-Pacific. Cable route selection has become a geopolitical exercise: cables avoid the South China Sea, Taiwan Strait, and Red Sea, and landing stations in Djibouti, Singapore, and Guam are subject to increasing government oversight.</p>
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: HMN Technologies Market Share Data; TeleGeography Submarine Cable Analysis; French Government — ASN Acquisition March 2024; US FCC Team Telecom — PLCN Decision; Reuters — Baltic Sea Cable Incidents; NATO Maritime Centre for Critical Undersea Infrastructure.
                  </div>
                </div>
              </div>
            ) : activePopup === "sub-catalysts" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>Hyperscaler submarine cable commitments, BEAD terrestrial deployment, military fiber demand, and nine new cable laying vessels create demand acceleration the subsystem layer cannot absorb before 2028</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#ECFDF5', color: '#065F46', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Catalysts</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Hyperscaler submarine cable investment</div>
                    <div style={{ display: 'flex', gap: '8px', margin: '12px 0' }}>
                      {([['$10B+', 'Meta Waterworth (50,000 km)', false], ['30+', 'Google cable investments', false], ['$50B+', 'Hyperscaler pipeline through 2030', true]] as [string, string, boolean][]).map(([num, label, isGreen], i) => (
                        <div key={i} style={{ flex: 1, background: '#F3F4F6', borderRadius: '4px', padding: '10px 12px' }}>
                          <div style={{ fontSize: '16px', fontWeight: 600, color: isGreen ? '#065F46' : '#1C1E21', letterSpacing: '-0.3px', fontFamily: "'Geist Mono', monospace" }}>{num}</div>
                          <div style={{ fontSize: '7.5px', color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginTop: '2px', fontFamily: "'Geist Mono', monospace" }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Meta&apos;s Project Waterworth (~50,000 km, $10B+) represents approximately 40–50% of one year&apos;s global submarine cable manufacturing capacity — a single project. Google has invested in 30+ cable systems including sole ownership of Curie, Dunant, Equiano, Firmina, and Umoja. The aggregate hyperscaler submarine cable pipeline exceeds $50 billion in committed and planned investment through 2030.</p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>BEAD + military + offshore wind convergence</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>The $42.5B BEAD program enters peak construction in 2026, requiring 213.3 million additional fiber miles — BABA-compliant, concentrating demand on Corning, Prysmian North American operations, and OFS. Military fiber demand (fiber-guided munitions, DAS monitoring cables, shipboard networks) accounts for an estimated 10.5% of global fiber consumption in 2025. Offshore wind (~30 GW under construction in Europe alone) competes for the same CLV time, factory capacity, and installation crews as submarine telecom cables.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>Nine CLV newbuilds are scheduled for delivery by end 2026.</strong> The net effect is to reduce (not eliminate) the vessel scheduling bottleneck — more simultaneous installation projects, but still insufficient to prevent scheduling conflicts through 2028.</p>
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: Meta Project Waterworth Disclosures; Google Submarine Cable Investment Portfolio; Prysmian FY2024 Results; NTIA BEAD Progress Dashboard March 2026; TeleGeography Submarine Cable Database; Leonardo da Vinci CLV Technical Specifications.
                  </div>
                </div>
              </div>
            ) : activePopup === "sub-emerging-tech" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>Five technology shifts are reshaping the subsystem layer: SDM multi-core fiber, open cable architectures, 800G-to-1.6T coherent optics, distributed acoustic sensing, and next-generation cable laying vessel designs</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#EDE9FE', color: '#5B21B6', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Emerging tech</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  {([
                    ['Space-division multiplexing (SDM)', 'Google Dunant: 250 Tbps / 12 fiber pairs · 4-core commercial systems expected 2028–2029', 'SDM uses multiple cores within a single fiber to multiply transmission capacity without proportional increases in cable diameter or power consumption. NEC demonstrated 20-core multi-core fiber transmission at 319 Tb/s per fiber in laboratory conditions. SDM requires new repeater designs that amplify multiple spatial modes simultaneously — creating an engineering advantage for manufacturers that have invested in SDM repeater development. Germanium implication: SDM multi-core fiber may increase germanium consumption per km, but if SDM reduces total systems deployed, the net demand effect is ambiguous.', 'neutral'],
                    ['Open cable architectures', 'TIP OCS specification · Meta, Google, Microsoft consortium · Enables terminal upgrades without replacing submarine plant', 'Open Cable Systems decouple wet-plant (cable + repeaters) from terminal equipment, allowing owners to select best-in-class components and upgrade as coherent technology advances (400G → 800G → 1.6T) without touching subsea components. This shifts value from integrated system suppliers toward component specialists — coherent optics vendors (Ciena, Infinera/Nokia, Acacia/Cisco) gain direct access to submarine terminal equipment previously controlled by cable manufacturers.', 'neutral'],
                    ['800G and 1.6T coherent optics', 'Doubles throughput of existing cables without subsea changes · 1.6T submarine grade: commercial by 2027–2028', 'Upgrading terminal equipment from 400G to 800G doubles the throughput of an existing cable system. 1.6T transceivers for submarine use require advances in DSP, forward error correction, and nonlinear compensation expected by 2027–2028. For terrestrial networks, 800G/1.6T drives demand for higher-quality single-mode fiber with tighter specifications — higher germanium content per km.', 'bull'],
                    ['Distributed Acoustic Sensing (DAS)', 'NATO-promoted post-Baltic sabotage · Dedicated sensing fibers per cable system', 'DAS uses standard optical fiber as a continuous acoustic sensor, detecting anchor strikes, trawling, and sabotage attempts in real time with ~1 meter spatial resolution. Following Baltic Sea incidents, DAS monitoring has moved from experimental to mandatory for new cable systems in sensitive corridors. DAS requires dedicated fiber pairs per cable — increasing the fiber count per system and adding manufacturing complexity. Creates new revenue: monitoring data sold to governments and naval forces.', 'bull'],
                  ] as [string, string, string, string][]).map(([title, status, body, dir], i) => (
                    <div key={i} style={{ marginTop: '24px', paddingBottom: '20px', borderBottom: i < 3 ? '0.5px solid #F3F4F6' : 'none' }}>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>Vector {String(i + 1).padStart(2, '0')}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: '5px' }}>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '13px', fontWeight: 600, color: '#1C1E21' }}>{title}</div>
                        <span style={{ fontSize: '7.5px', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Geist Mono', monospace", flexShrink: 0, fontWeight: 600, background: dir === 'bull' ? '#ECFDF5' : '#F3F4F6', color: dir === 'bull' ? '#065F46' : '#6B7280' }}>{dir === 'bull' ? 'Ge+ demand' : 'ambiguous'}</span>
                      </div>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', color: '#9CA3AF', marginBottom: '8px' }}>{status}</div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, margin: 0 }}>{body}</p>
                    </div>
                  ))}
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: Google Dunant Cable Specs; NEC Multi-Core Fiber Demonstration; Telecom Infra Project OCS Specification; Ciena 800G Coherent Optics; NATO — DAS for Submarine Cable Protection; TeleGeography Submarine Cable Technology Trends.
                  </div>
                </div>
              </div>
            ) : activePopup === "sub-major-companies" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>Six companies control the subsystem layer: Prysmian (integrated cable-to-vessel), SubCom (US wet-plant), ASN (French state-owned), NEC (Trans-Pacific), Dycom (terrestrial deployment), and the excluded HMN Technologies (Belt and Road)</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#ECFEFF', color: '#155E75', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Major companies</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  {([
                    ['Prysmian Group', 'Borsa Italiana: PRY · Market cap ~€31B · Revenue €17.1B (FY2024) · Submarine backlog €16–17B · Fleet: 8 CLVs by 2028', 'World\'s largest cable company by revenue and the only player with full vertical integration from fiber preform manufacturing through cable production to vessel-based installation. The Leonardo da Vinci (170m, 10,000-tonne cable capacity, DP3 positioning) commissioned 2024. The Arco Felice (Naples) factory is the world\'s largest submarine cable factory. The €16–17B submarine backlog provides revenue visibility through 2028+.'],
                    ['SubCom', 'Private (Cerberus Capital) · Acquired 2018 for ~$325M · Headquarters: Newington, NH · ~1,800 employees', 'The only US-owned manufacturer of repeatered submarine cable systems. This unique position makes it the de facto supplier for US government-affiliated projects and cables landing on US territory. SubCom manufactured the MAREA cable (Microsoft-Meta), the Dunant cable (Google), and numerous high-profile systems. Its US ownership and security clearances make it irreplaceable for defense-adjacent projects. Cerberus\'s acquisition at $325M looks like one of the most successful PE deals in telecom infrastructure — replacement value today would be multiples of that price.'],
                    ['ASN (Alcatel Submarine Networks)', 'French government owned (acquired from Nokia, March 2024, ~€350M) · Calais factory · ~2,000 employees', 'Nationalization transformed ASN from a Nokia division into a sovereign industrial asset managed for strategic capability. Under state ownership, ASN is expanding its Calais factory and investing in SDM-capable next-generation repeater technology. Historically the leading supplier for cables connecting Europe to Africa and the Middle East. State ownership provides capital access and strategic patience that commercial competitors cannot match.'],
                    ['Dycom Industries', 'NYSE: DY · Market cap ~$17B · Revenue $5.55B (FY2026) · Backlog $9.54B · FY2027 guidance $6.85–7.15B', 'Largest specialty contractor for terrestrial fiber optic cable deployment in North America. Does not manufacture cable — installs it. Customers include AT&T, Lumen, Charter, Comcast, and hyperscalers. The $9.54B backlog (up 29% YoY) reflects convergence of BEAD, hyperscaler campus deployment, and 5G fiber backhaul. Competitive advantage is workforce scale — approximately 15,000 employees across 49 states. The largest pool of trained fiber installation labor in North America.'],
                  ] as [string, string, string][]).map(([name, meta, body], i) => (
                    <div key={i} style={{ marginTop: '20px', paddingBottom: i < 3 ? '20px' : 0, borderBottom: i < 3 ? '0.5px solid #F3F4F6' : 'none' }}>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '13.5px', fontWeight: 600, color: '#1C1E21', marginBottom: '2px' }}>{name}</div>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9px', color: '#9CA3AF', marginBottom: '10px' }}>{meta}</div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, margin: 0 }}>{body}</p>
                    </div>
                  ))}
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: Prysmian FY2024 Annual Report; SubCom Corporate Overview and Project History; ASN / French Government Acquisition March 2024; NEC Submarine Networks Division; Dycom Industries FY2026 10-K; TeleGeography Submarine Cable Database.
                  </div>
                </div>
              </div>
            ) : activePopup === "sub-investment-ideas" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>Long Prysmian for integrated capacity, long Dycom for terrestrial deployment, watch for SubCom IPO as the decade&apos;s highest-conviction submarine infrastructure event</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#FDF2F8', color: '#9D174D', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Investment ideas</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Public companies — long positions</div>
                    {([
                      ['Prysmian (BIT: PRY)', '~€31B market cap · 1.8x revenue · €16–17B submarine backlog through 2028+', 'The only company with integrated submarine cable manufacturing, fiber preform production, and a captive CLV fleet. The backlog provides revenue visibility through 2028+. The Leonardo da Vinci and fleet expansion to 8 vessels eliminate vessel scheduling risk that constrains competitors. Submarine cables are the highest-margin segment (~15–20% EBITDA vs. 10–12% for terrestrial cables).', 'Execution risk on simultaneous mega-projects. Offshore wind margin pressure if energy transition slows. Italian corporate governance complexity.'],
                      ['Dycom Industries (NYSE: DY)', '~$17B market cap · 3x revenue · $9.54B backlog (29% YoY growth)', 'Pure-play beneficiary of terrestrial fiber deployment acceleration. Labor moat — the largest trained fiber installation workforce in North America — is the scarcest resource in the deployment chain. Multi-year demand visibility from BEAD supports premium multiple.', 'BEAD program delays (political or administrative). Customer concentration (AT&T historically 20%+ of revenue). Weather and seasonal construction variability.'],
                    ] as [string, string, string, string][]).map(([name, meta, bull, risk], i) => (
                      <div key={i} style={{ marginTop: '18px', paddingBottom: '18px', borderBottom: i < 1 ? '0.5px solid #F3F4F6' : 'none' }}>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '13.5px', fontWeight: 600, color: '#1C1E21', marginBottom: '2px' }}>{name}</div>
                        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9px', color: '#9CA3AF', marginBottom: '8px' }}>{meta}</div>
                        <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, marginBottom: '8px' }}><strong style={{ fontWeight: 600, color: '#065F46' }}>Thesis:</strong> {bull}</p>
                        <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, marginBottom: 0 }}><strong style={{ fontWeight: 600, color: '#991B1B' }}>Risks:</strong> {risk}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>SubCom IPO watch — the decade&apos;s highest-conviction event</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Cerberus Capital acquired SubCom in 2018 for ~$325 million. SubCom is now the sole US manufacturer of repeatered submarine cable systems with order books filled through 2027 and strategic importance to the US government. <strong style={{ fontWeight: 600, color: '#1C1E21' }}>A Cerberus exit via IPO would likely value SubCom at $5–10 billion</strong> based on comparable multiples — a 15–30x return on the 2018 acquisition.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Cerberus typically holds investments for 5–7 years — the 2018 acquisition puts an exit in the 2025–2027 window. Monitor SEC filings for S-1 registration. Risk: Cerberus may pursue strategic sale (to a defense prime like L3Harris or Leidos) rather than IPO, limiting public market access.</p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Coherent optics — terminal upgrade cycle</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Open cable architectures enable terminal equipment upgrades independent of wet-plant changes. The transition from 400G → 800G → 1.6T wavelengths on existing cables creates recurring revenue for coherent optics vendors. Key companies: <strong style={{ fontWeight: 600, color: '#1C1E21' }}>Ciena (NYSE: CIEN)</strong> — WaveLogic transponders for multiple submarine systems. Nokia-Infinera and Cisco-Acacia for submarine-grade DSP technology.</p>
                  </div>
                  <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '10.5px', color: '#9CA3AF', fontStyle: 'italic', lineHeight: 1.5, marginTop: '24px', padding: '12px 14px', background: '#F9FAFB', borderRadius: '4px' }}>
                    This analysis identifies companies positioned to benefit from structural supply chain dynamics. It does not constitute investment advice. Conduct independent due diligence before making any investment decisions.
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: Prysmian FY2024 Annual Report; Dycom Industries FY2026 10-K; SubCom / Cerberus Acquisition 2018; Ciena WaveLogic Documentation; TeleGeography Submarine Cable Market Analysis; NTIA BEAD Program Tracker.
                  </div>
                </div>
              </div>

            ) : activePopup === "eu-supply-demand" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>Power delivery, construction labor, GPU allocation, and cooling equipment define four simultaneous supply constraints throttling the $660B+ hyperscaler buildout</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#EFF6FF', color: '#1E40AF', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Supply constraints</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Power — the binding constraint</div>
                    <div style={{ display: 'flex', gap: '8px', margin: '12px 0' }}>
                      {([['68 GW', 'Datacenter power needed by 2027', true], ['4–7 yrs', 'Average grid interconnection queue', true], ['$64B', 'Projects blocked by power constraints', false]] as [string, string, boolean][]).map(([num, label, isRed], i) => (
                        <div key={i} style={{ flex: 1, background: '#F3F4F6', borderRadius: '4px', padding: '10px 12px' }}>
                          <div style={{ fontSize: '16px', fontWeight: 600, color: isRed ? '#991B1B' : '#1C1E21', letterSpacing: '-0.3px', fontFamily: "'Geist Mono', monospace" }}>{num}</div>
                          <div style={{ fontSize: '7.5px', color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginTop: '2px', fontFamily: "'Geist Mono', monospace" }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Grid interconnection queues in the US averaged 4–7 years as of early 2026 — meaning a datacenter applying for grid connection today would not receive power until 2030–2033. Hyperscaler datacenter campuses now routinely require 500 MW–2 GW of power. An estimated <strong style={{ fontWeight: 600, color: '#1C1E21' }}>$64 billion in datacenter projects are currently blocked by power availability or permitting constraints.</strong> Transformer lead times have extended to 128–210 weeks for large power transformers (345 kV+).</p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Construction labor, GPU, and cooling</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>The datacenter construction workforce faces a structural deficit of approximately <strong style={{ fontWeight: 600, color: '#1C1E21' }}>439,000 workers</strong> across the US as of 2026 — most acute in electrical workers qualified for medium- and high-voltage systems. NVIDIA holds 77–92% of the AI accelerator market with the Blackwell architecture; demand exceeds supply through at least mid-2026. TSMC&apos;s CoWoS advanced packaging capacity has been the binding production constraint for Blackwell shipments.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>AI training workloads generate heat densities of 50–100+ kW per rack (vs. 10–15 kW for traditional workloads). <strong style={{ fontWeight: 600, color: '#1C1E21' }}>83% of datacenter operators reported inability to source liquid cooling equipment locally.</strong> Lead times for enterprise-grade liquid cooling systems have extended to 6–12 months.</p>
                  </div>
                  <div style={{ marginTop: '24px', padding: '12px 14px', background: '#F9FAFB', borderRadius: '4px' }}>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.65, margin: 0 }}>The end-use layer&apos;s supply constraints are multiplicative. Power, construction labor, GPU allocation, and cooling must all converge simultaneously for a datacenter to generate revenue. A shortfall in any single dimension idles the investment in all others.</p>
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: McKinsey — Datacenter Power Demand Forecast; CBRE — US Datacenter Market Report 2026; NVIDIA FY2026 Earnings; TSMC CoWoS Capacity Analysis; Vertiv Investor Presentations; GridStrategies — US Interconnection Queue Analysis.
                  </div>
                </div>
              </div>
            ) : activePopup === "eu-bottlenecks" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>Grid interconnection queues, construction contractor concentration, NVIDIA GPU allocation, and cooling infrastructure gaps create four compounding bottlenecks where each delay cascades through the entire deployment timeline</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#FEF2F2', color: '#991B1B', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Bottlenecks</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  {([
                    ['Grid interconnection and power infrastructure', 'PJM queue >5 years · 2,600 GW queued nationally · Only 15–20% will be built', 'Northern Virginia illustrates the bottleneck in extreme form. Loudoun County alone hosts 300+ datacenter facilities consuming ~4.5 GW. A 1.5 GW grid disturbance in 2024 triggered emergency load-shedding affecting multiple hyperscaler campuses. The bottleneck is now driving datacenter location decisions to Columbus (Ohio), Salt Lake City, and Nordic countries. Behind-the-meter generation has emerged as a workaround — Amazon acquired the Susquehanna nuclear-adjacent campus ($650M), Microsoft contracted TMI Unit 1 restart, Google signed the first corporate SMR PPA with Kairos Power.'],
                    ['Construction contractor concentration', 'Turner Construction: $44.3B backlog, 37% datacenter ($16B) · $9B datacenter revenue', 'Turner Construction is the dominant datacenter construction contractor — its datacenter practice has grown from a specialty group to its largest market segment. If Turner experiences labor disputes or safety incidents, a disproportionate share of the industry pipeline is affected. The construction bottleneck is most acute for high-voltage electrical workers and precision liquid cooling installers. Modular construction (Compass Datacenters, EdgeConneX, DataBank) reduces on-site labor by 30–40%, but introduces its own supply chain constraints.'],
                    ['NVIDIA GPU allocation and AI silicon supply', '77–92% market share · TSMC CoWoS packaging as rate limiter · AI Diffusion Rule adds geopolitical dimension', 'NVIDIA\'s allocation model for Blackwell-generation GPUs (B100, B200, GB200 NVL72) prioritizes large customers based on volume commitments. TSMC\'s CoWoS advanced packaging has been the production-rate limiter through early 2026. The GPU allocation bottleneck interacts with power and construction timelines — misalignment in either direction (GPUs before datacenter, or datacenter before GPUs) represents idle capital. Alternative AI silicon (AMD MI300X, Google TPUs) provides partial relief but does not eliminate the NVIDIA dependency.'],
                    ['Cooling infrastructure for high-density AI workloads', 'Vertiv: $15B backlog · Liquid cooling market $6.65B → $29.46B by 2033 · 83% cannot source locally', 'AI training clusters require 50–100+ kW per rack vs. 10–15 kW for traditional workloads — a 5–10x increase that conventional air cooling cannot address. Three liquid cooling approaches compete: direct-to-chip (current standard for GB200 NVL72), rear-door heat exchangers, and immersion cooling. Total industry manufacturing capacity is insufficient for projected deployment rates. The cooling bottleneck is compounded by a skills gap — installing liquid cooling requires plumbing expertise that most datacenter operations teams lack.'],
                  ] as [string, string, string][]).map(([title, meta, body], i) => (
                    <div key={i} style={{ marginTop: '24px', paddingBottom: '20px', borderBottom: i < 3 ? '0.5px solid #F3F4F6' : 'none' }}>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>Bottleneck {String(i + 1).padStart(2, '0')}</div>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '13px', fontWeight: 600, color: '#1C1E21', marginBottom: '4px' }}>{title}</div>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', color: '#9CA3AF', marginBottom: '8px' }}>{meta}</div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, margin: 0 }}>{body}</p>
                    </div>
                  ))}
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: PJM Interconnection Queue Statistics; CBRE — US Datacenter Market Report 2026; Turner Construction Backlog; NVIDIA Blackwell Production Updates; TSMC CoWoS Analysis; Vertiv FY2025 Presentations; McKinsey — Datacenter Labor Analysis.
                  </div>
                </div>
              </div>
            ) : activePopup === "eu-geopolitical" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>GPU export controls, sovereign AI infrastructure investments, data sovereignty regulation, and the AUKUS datacenter cooperation framework are reshaping where datacenters can be built, who can operate them, and what workloads they can run</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#FEF3C7', color: '#92400E', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Geopolitical risk</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>NVIDIA export controls and the AI Diffusion Rule</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>The US AI Diffusion Rule (effective May 2025) established a three-tier country classification for AI chip exports. Tier 1 (close allies) face minimal restrictions. Tier 2 (most of the world) face annual compute caps. Tier 3 (China, Russia, embargoed nations) face near-total prohibition. <strong style={{ fontWeight: 600, color: '#1C1E21' }}>NVIDIA&apos;s Blackwell architecture — B100, B200, GB200 NVL72 — is entirely controlled for export. No Blackwell variant is authorized for Tier 3.</strong> This makes GPU allocation implicitly geopolitical: every chip shipped to Tier 1/2 is unavailable for any other destination.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>China is building a domestically sourced AI infrastructure stack (Huawei Ascend, Biren Technology, Cambricon) limited to approximately 2 generations behind NVIDIA&apos;s frontier by EUV lithography availability. China&apos;s domestic datacenter market is expected to exceed 40 GW by 2030, using domestically manufactured fiber (YOFC, Hengtong) — creating a parallel demand stream for germanium-doped fiber entirely outside western supply chain visibility.</p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Sovereign AI and Gulf state investment</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>The UAE&apos;s G42 (Mubadala-backed) committed $15.2 billion with Microsoft for datacenter infrastructure — requiring G42 to divest its Chinese technology relationships (including Huawei equipment) as a condition of US government approval. Saudi Arabia&apos;s $5 billion DataVolt project in NEOM is powered by renewables. India&apos;s DPDP Act drives datacenter investment in Mumbai, Chennai, and Hyderabad; the market is projected to grow from 1.3 GW to 3+ GW by 2028.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Data sovereignty laws are fragmenting the global datacenter market into regulatory islands where data must be stored within national borders. EU GDPR, India&apos;s DPDP Act, and emerging regulations in Indonesia, Brazil, and Nigeria mean a hyperscaler cannot serve 50 countries from 5 mega-datacenters — <strong style={{ fontWeight: 600, color: '#1C1E21' }}>it needs presence in 30+ jurisdictions, each with local power, construction, and connectivity requirements.</strong> This multiplies the end-use layer&apos;s demand for fiber connectivity across every regulated market.</p>
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: US Bureau of Industry and Security — AI Diffusion Rule (May 2025); NVIDIA Blackwell Export Control Classification; G42-Microsoft Partnership ($15.2B); NEOM DataVolt Documentation; EU AI Act; India DPDP Act 2023; China &quot;East Data, West Computation&quot; Initiative; CBRE Global Datacenter Market Report 2026.
                  </div>
                </div>
              </div>
            ) : activePopup === "eu-catalysts" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>Five catalysts are converging: hyperscaler capex acceleration, the 1.6T optical transceiver ramp, Stargate and sovereign mega-projects, political and environmental backlash, and the near-edge inference shift that may redistribute demand away from centralized hyperscale</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#ECFDF5', color: '#065F46', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Catalysts</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>2026 hyperscaler capex — $660–690B</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' as const, margin: '8px 0 12px', fontSize: '11px' }}>
                      <thead>
                        <tr>{['Company', '2026 Capex', 'Key driver'].map(h => <th key={h} style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9CA3AF', textAlign: 'left' as const, padding: '6px 8px', borderBottom: '0.5px solid #E5E7EB', fontFamily: "'Geist Mono', monospace" }}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {([['Amazon (AWS)', '$200B+', 'New regions + AI training'], ['Google', '$175–185B', 'Cloud + submarine cables + TPU v5p'], ['Microsoft', '~$120B', 'Azure + nuclear power PPAs'], ['Meta', '$115–135B', 'Llama training + $6B Corning fiber + Waterworth'], ['Oracle', '$50B', 'Stargate partner + OCI expansion']] as [string,string,string][]).map(([name, cap, driver], i) => (
                          <tr key={i}><td style={{ padding: '7px 8px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "Inter, sans-serif", color: '#374151', fontSize: '11px', fontWeight: 500 }}>{name}</td><td style={{ padding: '7px 8px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace", color: '#065F46', fontSize: '10px', fontWeight: 600 }}>{cap}</td><td style={{ padding: '7px 8px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "Inter, sans-serif", color: '#6B7280', fontSize: '10.5px' }}>{driver}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Stargate + 1.6T supercycle + political backlash</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>Stargate:</strong> $500 billion commitment across 7 US sites (OpenAI, SoftBank, Oracle). The Abilene, Texas site is the initial deployment. Parallel sovereign mega-projects include Saudi Arabia&apos;s $100B AI initiative, UAE G42-Microsoft&apos;s $15.2B partnership, and India&apos;s IndiaAI program (10,000+ GPU national capacity).</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>1.6T transceiver supercycle:</strong> 1.6T transceivers began commercial sampling in late 2025 and ramp through 2026. Higher-speed transceivers require tighter fiber specifications → more precise germanium doping → demand pull on the upstream supply chain. A single 100,000-GPU training cluster may require thousands of km of intra-campus fiber at 1.6T speeds.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}><strong style={{ fontWeight: 600, color: '#92400E' }}>Political backlash (demand constraint):</strong> Datacenters are projected to consume 6–9% of US electricity by 2030. Local opposition has led to moratoriums in Dublin, Amsterdam, and Singapore. Water consumption, land use, and tax incentive backlash are creating regulatory constraints that limit where new capacity can be deployed — concentrating investment in favorable jurisdictions and pushing operators toward behind-the-meter nuclear power.</p>
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: Amazon/Google/Meta/Microsoft FY2025–2026 Capex Guidance; Stargate Initiative Announcement; OFC 2026 — 1.6T Transceiver Demonstrations; G42-Microsoft $15.2B Partnership; IEA — Datacenter Energy Consumption Projections; CBRE — Edge Datacenter Market Report.
                  </div>
                </div>
              </div>
            ) : activePopup === "eu-emerging-tech" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>Co-packaged optics, 1.6T–3.2T transceivers, liquid-to-immersion cooling evolution, Microsoft MOSAIC MicroLED interconnects, and nuclear SMRs represent five technology shifts reshaping end-use layer infrastructure by 2030</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#EDE9FE', color: '#5B21B6', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Emerging tech</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  {([
                    ['Co-packaged optics (CPO)', 'NVIDIA Spectrum-X targets 3.2T · Broadcom Tomahawk 5 · Production H2 2026', 'CPO integrates optical engines directly onto the switch ASIC package, eliminating pluggable transceivers as separate components. CPO reduces discrete transceiver modules (which use germanium photodetectors), but increases total optical interconnect bandwidth per switch — each CPO-enabled switch drives more fiber connections at higher speeds. Net effect: more fiber deployed per unit of compute. A datacenter using CPO may need only 2 switch tiers vs. 3, but at proportionally higher bandwidth and fiber count per link.', '+Ge demand'],
                    ['1.6T and 3.2T optical transceivers', '1.6T commercial sampling late 2025 · 3.2T laboratory demos exist · Volume ramp 2026', 'Each transceiver speed generation requires fiber with tighter attenuation specifications → more precise germanium doping profiles → higher-purity GeCl₄ input. The fiber-to-germanium linkage strengthens with each speed generation. 3.2T (expected 2028–2029) will require even tighter fiber specs, potentially driving demand for specialty fiber grades with premium germanium content.', '+Ge demand'],
                    ['Liquid cooling evolution', 'Market $6.65B → $29.46B by 2033 · Direct-to-chip → immersion · Vertiv $15B backlog', 'Three liquid cooling approaches compete: direct-to-chip (current GB200 NVL72 standard), rear-door heat exchangers, and immersion cooling (submerging entire servers in dielectric fluid for 100+ kW rack densities). Two-phase immersion offers highest efficiency but faces fluid supply issues (3M Novec discontinued). The liquid cooling transition enables higher rack densities that concentrate fiber connections — more compute per building means more fiber per unit area of campus.', 'neutral'],
                    ['Microsoft MOSAIC MicroLED interconnects', 'Board-level optical interconnects · Production readiness target late 2027', 'MOSAIC (Micro-Optical Semiconductor Architecture for Interconnect Computing) uses MicroLED arrays to replace copper traces with light at centimeter-scale distances — extending optical interconnects from the current ~3m minimum down to board level. MOSAIC uses III-V semiconductors (not germanium) for MicroLED emitters, but receivers may use germanium photodetectors. More broadly, every level where optics replaces copper increases total datacenter fiber consumption.', 'neutral'],
                    ['Nuclear SMRs for dedicated datacenter power', 'Microsoft/Constellation: TMI Unit 1 restart 2027 · Amazon/Talen: Susquehanna nuclear adjacent', 'Dedicated nuclear power bypasses the 4–7 year grid interconnection queue — the most binding constraint on datacenter deployment. If nuclear SMRs achieve commercial deployment at scale (2030+), they unlock datacenter capacity in locations currently constrained by grid availability, fundamentally changing hyperscale geography. Current commitments: Microsoft (TMI restart, 820 MW), Amazon (Susquehanna adjacent campus), Google (Kairos Power SMR PPA, first reactor 2030).', 'neutral'],
                  ] as [string, string, string, string][]).map(([title, status, body, dir], i) => (
                    <div key={i} style={{ marginTop: '24px', paddingBottom: '20px', borderBottom: i < 4 ? '0.5px solid #F3F4F6' : 'none' }}>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>Vector {String(i + 1).padStart(2, '0')}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: '5px' }}>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '13px', fontWeight: 600, color: '#1C1E21' }}>{title}</div>
                        <span style={{ fontSize: '7.5px', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Geist Mono', monospace", flexShrink: 0, fontWeight: 600, background: dir === '+Ge demand' ? '#ECFDF5' : '#F3F4F6', color: dir === '+Ge demand' ? '#065F46' : '#6B7280' }}>{dir}</span>
                      </div>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', color: '#9CA3AF', marginBottom: '8px' }}>{status}</div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, margin: 0 }}>{body}</p>
                    </div>
                  ))}
                  <div style={{ marginTop: '20px', padding: '12px 14px', background: '#F9FAFB', borderRadius: '4px' }}>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.65, margin: 0 }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>Every technology trend at the end-use layer increases the fiber intensity of AI infrastructure.</strong> More compute requires more bandwidth, which requires more fiber, which requires more germanium-doped preforms.</p>
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: NVIDIA Spectrum-X CPO Announcements; OFC 2026 Transceiver Demonstrations; Vertiv Product Portfolio; Microsoft MOSAIC Research Publications; Constellation Energy — TMI Restart Agreement; Google-Kairos Power PPA; Amazon-Talen Energy Acquisition.
                  </div>
                </div>
              </div>
            ) : activePopup === "eu-major-companies" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>Seven companies control the end-use layer&apos;s critical infrastructure: Equinix and Digital Realty (colocation/wholesale), Dycom (fiber deployment), Turner Construction (datacenter construction), Vertiv (cooling and power), Corning (fiber manufacturing), and Oracle (Stargate and sovereign cloud)</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#ECFEFF', color: '#155E75', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Major companies</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  {([
                    ['Equinix', 'NASDAQ: EQIX · Market cap ~$85B · 260+ datacenters in 72 metro markets · 500,000+ cross-connects', 'World\'s largest datacenter REIT. Doubling datacenter capacity by 2029 through organic development and xScale joint ventures (partnerships with sovereign wealth funds for hyperscale builds). The interconnection network effect is its primary moat — no competitor matches its geographic breadth or customer density. The xScale program provides hyperscale exposure while preserving the core interconnection business.'],
                    ['Digital Realty', 'NYSE: DLR · Market cap ~$55B · 300+ datacenters in 50+ metros · Digital Dulles campus: 11.7M sq ft', 'World\'s largest wholesale datacenter provider. Digital Dulles in Northern Virginia is among the largest datacenter campuses in the world. Powered shell delivery — pre-built buildings with utility power and cooling that hyperscaler tenants complete with IT equipment — reduces deployment timelines vs. build-to-suit. Wholesale lease rates have increased 15–25% YoY in constrained markets (Northern Virginia, Silicon Valley, Dublin).'],
                    ['Vertiv Holdings', 'NYSE: VRT · Market cap ~$45B · Revenue ~$8B · Backlog ~$15B · UPS + thermal + power distribution', 'Leading provider of critical infrastructure for datacenters. The $15B backlog reflects the AI-driven surge in thermal management demand. Liquid cooling product line — direct-to-chip systems designed for NVIDIA GB200 NVL72 racks — positions Vertiv at the intersection of AI compute and datacenter infrastructure. The transition from air to liquid cooling represents a generational product cycle that increases Vertiv\'s content per rack from ~$5,000 (UPS + air) to $10,000+ (UPS + liquid + thermal management).'],
                    ['Turner Construction', 'Private (HOCHTIEF/ACS subsidiary) · Backlog $44.3B total, 37% datacenter ($16B+) · ~$9B datacenter revenue', 'Largest commercial builder in the US and dominant datacenter construction contractor. Managing 10+ simultaneous datacenter projects across multiple states, each requiring 500+ workers, precision mechanical/electrical systems. Competitive advantage is execution at scale and union labor relationships. Single-contractor risk: DPR, Holder, and Fortis Construction compete at smaller scale.'],
                    ['Oracle Corporation', 'NYSE: ORCL · Market cap ~$350B · OCI cloud revenue $25B+ annualized (+50% YoY) · 147+ active datacenters', 'Oracle\'s Stargate infrastructure partner role (alongside OpenAI and SoftBank) positions it at the center of the largest datacenter investment commitment in history. OCI has differentiated on price-performance for AI workloads, winning customers that find AWS/Azure/GCP pricing prohibitive. Oracle\'s datacenter expansion — from 40 regions to 147+ in 3 years — demonstrates construction velocity that exceeds larger competitors.'],
                  ] as [string, string, string][]).map(([name, meta, body], i) => (
                    <div key={i} style={{ marginTop: '20px', paddingBottom: i < 4 ? '20px' : 0, borderBottom: i < 4 ? '0.5px solid #F3F4F6' : 'none' }}>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '13.5px', fontWeight: 600, color: '#1C1E21', marginBottom: '2px' }}>{name}</div>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9px', color: '#9CA3AF', marginBottom: '10px' }}>{meta}</div>
                      <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, margin: 0 }}>{body}</p>
                    </div>
                  ))}
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: Equinix FY2025 Earnings; Digital Realty FY2025 Earnings; Turner Construction Backlog; Vertiv FY2025 Earnings; Oracle Cloud Infrastructure Expansion and Stargate Partnership; Dycom Industries FY2026 10-K; CBRE US Datacenter Market Report 2026.
                  </div>
                </div>
              </div>
            ) : activePopup === "eu-investment-ideas" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>Six investment ideas spanning datacenter REITs, fiber deployment, critical infrastructure, nuclear power, optical components, and short positions in power-constrained operators</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#FDF2F8', color: '#9D174D', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Investment ideas</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>
                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Long positions</div>
                    {([
                      ['Equinix (EQIX) + Digital Realty (DLR)', 'EQIX ~$85B · DLR ~$55B · Network effect + land bank moats', 'Equinix and Digital Realty control the largest portfolios of datacenter-ready real estate in the world. In an environment where new capacity takes 3–5 years to develop, existing leasable capacity commands premium pricing. Equinix\'s xScale program provides hyperscale exposure while preserving the interconnection business. DLR\'s Digital Dulles land bank positions it for the largest hyperscaler deals; wholesale lease rates have increased 15–25% YoY in constrained markets.', 'Rising interest rates (REITs are rate-sensitive). Power availability constraints limiting new development starts. Political backlash (moratoriums, tax incentive clawbacks).'],
                      ['Vertiv Holdings (VRT)', '~$45B market cap · $15B backlog · 5.5x revenue · 25–30x forward earnings', 'Best pure-play on the datacenter infrastructure supercycle. The $15B backlog provides multi-year revenue visibility. Transition from air to liquid cooling is a generational product cycle increasing Vertiv\'s content per rack from ~$5K to $10K+. Margin expansion as higher-content liquid cooling systems carry premium pricing. Global manufacturing and service operations.', 'Execution risk on the liquid cooling ramp. Competition from CoolIT, Asetek, and vertically integrated hyperscaler cooling designs. Valuation prices in significant growth acceleration.'],
                      ['Constellation Energy (CEG)', '~$75B market cap · 21.5 GW nuclear fleet · TMI restart PPA: ~$100–110/MWh', 'Largest nuclear power operator in the US. Microsoft-Three Mile Island restart agreement established a paradigm for dedicated nuclear datacenter power — long-term PPAs at ~2x wholesale power prices. If 5–10 GW of the fleet can be contracted under datacenter PPAs, incremental revenue would justify a significantly higher valuation. Bipartisan nuclear energy legislation and hyperscaler 24/7 carbon-free energy commitments are tailwinds.', 'NRC regulatory risk (TMI restart is unprecedented). Construction cost overruns. Political risk — nuclear remains controversial in some states.'],
                      ['Corning (GLW)', '~$40B market cap · ~$14B revenue · $6B Meta agreement', 'BABA-compliant manufacturing base positions it as primary beneficiary of converging datacenter fiber demand and BEAD deployment. Technology leadership in low-loss and bend-insensitive fiber creates premium pricing. $6B Meta agreement provides unprecedented revenue visibility for the optical segment.', 'Germanium supply constraints limiting preform production. Chinese fiber competition in non-BABA markets. HCF technology risk — if HCF reaches commercial scale it eliminates germanium from the fiber value chain.'],
                    ] as [string, string, string, string][]).map(([name, meta, bull, risk], i) => (
                      <div key={i} style={{ marginTop: '18px', paddingBottom: '18px', borderBottom: i < 3 ? '0.5px solid #F3F4F6' : 'none' }}>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '13.5px', fontWeight: 600, color: '#1C1E21', marginBottom: '2px' }}>{name}</div>
                        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9px', color: '#9CA3AF', marginBottom: '8px' }}>{meta}</div>
                        <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, marginBottom: '8px' }}><strong style={{ fontWeight: 600, color: '#065F46' }}>Thesis:</strong> {bull}</p>
                        <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.7, marginBottom: 0 }}><strong style={{ fontWeight: 600, color: '#991B1B' }}>Risks:</strong> {risk}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Short: power-constrained operators</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Datacenter operators and developers without secured power (executed grid connection or behind-the-meter generation) or long-term fiber supply agreements face existential risk. Indicators to watch: power contract status (executed vs. applied), grid interconnection queue position, fiber supply agreements (long-term vs. spot), BABA compliance, balance sheet leverage. Small and mid-cap datacenter developers without utility relationships, international operators in constrained markets (Ireland, Singapore), and SPAC-era companies with speculative demand projections are most exposed.</p>
                  </div>
                  <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '10.5px', color: '#9CA3AF', fontStyle: 'italic', lineHeight: 1.5, marginTop: '24px', padding: '12px 14px', background: '#F9FAFB', borderRadius: '4px' }}>
                    This analysis identifies companies positioned to benefit from structural supply chain dynamics. It does not constitute investment advice. The common risk across all long positions is demand cyclicality — if hyperscaler capex growth slows, the supply-demand imbalance that drives pricing power today could narrow by 2029.
                  </div>
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: Equinix Investor Day; Digital Realty FY2025 Earnings; Vertiv FY2025 Earnings; Constellation Energy — TMI Restart Agreement; Corning FY2025 Earnings and Meta $6B Agreement; Oracle Stargate Partnership; Goldman Sachs — Datacenter Infrastructure Investment Outlook.
                  </div>
                </div>
              </div>
            ) : null}
            </div>{/* end modal card */}
            {/* Next button */}
            <button
              onClick={() => nextKey && setActivePopup(nextKey)}
              disabled={!nextKey}
              style={{ flexShrink: 0, width: 38, height: 38, borderRadius: "50%", border: "0.5px solid rgba(255,255,255,0.18)", background: nextKey ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.03)", cursor: nextKey ? "pointer" : "default", color: nextKey ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.18)", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Geist Mono', monospace", transition: "background 0.15s" }}
            >→</button>
          </div>
        </div>
      )}
    </>
  );
}
