"use client";

import { useState } from "react";

const INSIGHT_BARS = [
  {
    key: "supply-demand",
    label: "SUPPLY / DEMAND GAP",
    teaser: "210 ton supply gap by 2030",
    pillBg: "#EFF6FF", pillText: "#1E40AF",
  },
  {
    key: "bottlenecks",
    label: "BOTTLENECKS",
    teaser: "Single-source refining, 17% recycling ceiling, Red Dog closure",
    pillBg: "#FEF2F2", pillText: "#991B1B",
  },
  {
    key: "geopolitical",
    label: "GEOPOLITICAL RISK",
    teaser: "China export controls, US ban, sanctions on Russian supply",
    pillBg: "#FEF3C7", pillText: "#92400E",
  },
  {
    key: "catalysts",
    label: "CATALYSTS",
    teaser: "BEAD fiber buildout, defense stockpiling, DRC ramp-up",
    pillBg: "#ECFDF5", pillText: "#065F46",
  },
  {
    key: "emerging-tech",
    label: "EMERGING TECH",
    teaser: "Fly ash recovery, silicon photonics, hollow-core fiber",
    pillBg: "#F5F3FF", pillText: "#5B21B6",
  },
  {
    key: "deals-capital",
    label: "DEALS & CAPITAL",
    teaser: "Umicore-STL offtake, DoD $14.4M grant, Teck govt talks",
    pillBg: "#FFF7ED", pillText: "#9A3412",
  },
  {
    key: "major-companies",
    label: "MAJOR COMPANIES",
    teaser: "Corning, Umicore, Teck, Yunnan Chihong, 5N Plus",
    pillBg: "#F0F9FF", pillText: "#155E75",
  },
  {
    key: "investment-ideas",
    label: "INVESTMENT IDEAS",
    teaser: "6 positions across the chain from mining to end-use",
    pillBg: "#FDF2F8", pillText: "#9D174D",
  },
];

export default function InsightsColumn() {
  const [activePopup, setActivePopup] = useState<string | null>(null);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Stat cards */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: 1, padding: "10px 12px 6px", border: "0.5px solid rgba(80,80,70,0.2)", borderRadius: "4px", background: "white" }}>
            <div style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)", fontSize: "7px", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#a8a49a", marginBottom: "3px" }}>GeO₂ spot price</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
              <span style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)", fontSize: "14px", fontWeight: 600, color: "#5a5647", letterSpacing: "-0.3px" }}>$2,840/kg</span>
              <span style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)", fontSize: "8px", fontWeight: 600, color: "#9a7b3c" }}>+202%</span>
            </div>
            <svg width="100%" viewBox="0 0 200 32" preserveAspectRatio="none" style={{ marginTop: "4px" }}>
              <path d="M0,28 L12,27 L24,26 L36,25 L48,27 L60,28 L72,27 L84,26 L96,25 L108,23 L120,20 L126,16 L132,12 L140,17 L150,12 L160,8 L168,4 L174,6 L180,4 L186,3 L192,2 L200,1" fill="none" stroke="#9a7b3c" strokeWidth="1.5" />
              <path d="M0,28 L12,27 L24,26 L36,25 L48,27 L60,28 L72,27 L84,26 L96,25 L108,23 L120,20 L126,16 L132,12 L140,17 L150,12 L160,8 L168,4 L174,6 L180,4 L186,3 L192,2 L200,1 L200,32 L0,32 Z" fill="#9a7b3c" opacity="0.07" />
            </svg>
          </div>
          <div style={{ flex: 1, padding: "10px 12px 6px", border: "0.5px solid rgba(80,80,70,0.2)", borderRadius: "4px", background: "white" }}>
            <div style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)", fontSize: "7px", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#a8a49a", marginBottom: "3px" }}>Western supply</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
              <span style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)", fontSize: "14px", fontWeight: 600, color: "#5a5647", letterSpacing: "-0.3px" }}>~80t/yr</span>
              <span style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)", fontSize: "8px", fontWeight: 600, color: "#b85450" }}>-24%</span>
            </div>
            <svg width="100%" viewBox="0 0 200 32" preserveAspectRatio="none" style={{ marginTop: "4px" }}>
              <path d="M0,4 L12,4 L24,5 L36,5 L48,6 L60,6 L72,7 L84,8 L96,9 L108,10 L120,12 L132,15 L144,19 L156,22 L168,25 L180,28 L192,29 L200,30" fill="none" stroke="#b85450" strokeWidth="1.5" />
              <path d="M0,4 L12,4 L24,5 L36,5 L48,6 L60,6 L72,7 L84,8 L96,9 L108,10 L120,12 L132,15 L144,19 L156,22 L168,25 L180,28 L192,29 L200,30 L200,32 L0,32 Z" fill="#b85450" opacity="0.07" />
            </svg>
          </div>
        </div>

        {/* Insight bars */}
        <div data-insights-container style={{ background: "white", border: "0.5px solid rgba(80,80,70,0.2)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "rgb(136,136,128)", textAlign: "center" as const, padding: "14px 16px 10px", borderBottom: "0.5px solid rgba(80,80,70,0.15)" }}>
            Key insights
          </div>
          {INSIGHT_BARS.map((bar, i) => (
            <div
              key={bar.key}
              onClick={() => setActivePopup(bar.key)}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(154,123,60,0.03)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              style={{ padding: "11px 16px", cursor: "pointer", borderBottom: i < INSIGHT_BARS.length - 1 ? "0.5px solid rgba(80,80,70,0.1)" : "none", transition: "background 0.15s" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#1C1E21",
                    lineHeight: 1.4,
                    marginBottom: "6px",
                  }}>
                    {bar.teaser}
                  </div>
                  <div>
                    <span style={{
                      display: "inline-block",
                      background: bar.pillBg,
                      color: bar.pillText,
                      fontFamily: "var(--font-mono, 'Courier New', monospace)",
                      fontSize: "7.5px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase" as const,
                      padding: "3px 8px",
                      borderRadius: "3px",
                    }}>
                      {bar.label}
                    </span>
                  </div>
                </div>
                <span style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)", fontSize: "10px", color: "#c8c4b8", marginLeft: "8px", marginTop: "2px", flexShrink: 0 }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup overlay */}
      {activePopup && (
        <div onClick={() => setActivePopup(null)} style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 0 32px" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(90,86,71,0.3)", backdropFilter: "blur(2px)" }} />
          <div onClick={e => e.stopPropagation()} style={{ position: "relative", background: "#FAF9F7", border: "0.5px solid rgba(80,80,70,0.2)", borderRadius: "6px", width: "90%", maxWidth: "680px", maxHeight: "80vh", overflowY: "auto" as const, padding: 0 }}>

            {activePopup === "supply-demand" ? (
              <div style={{ padding: 0 }}>
                {/* Header */}
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '3px', background: '#EFF6FF', color: '#1E40AF', display: 'inline-block', marginBottom: '8px', fontFamily: "'Geist Mono', monospace" }}>Supply / demand gap</div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35 }}>Germanium supply cannot meet accelerating demand — and the constraints are structural, not cyclical</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>

                {/* Body */}
                <div style={{ padding: '0 28px 32px' }}>

                  {/* The Resource */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>The resource</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Germanium is never mined on its own. It exists only as a trace impurity in zinc ores and lignite coal deposits, typically at concentrations of 50–800 parts per million. The "germanium deposits" mapped in this platform are actually zinc mines and coal mines where the germanium concentration happens to be high enough to justify recovering it during processing. In zinc operations, germanium concentrates in the residues and flue dust during smelting. In coal operations, it accumulates in the fly ash after combustion. The primary product is always zinc or energy — germanium is captured from the waste stream.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>There is no such thing as a germanium mine.</strong> Even if germanium prices triple, nobody opens a new mine for it. The supply response is limited to increasing recovery rates at existing zinc smelters and coal plants — an incremental improvement, not a step-change.</p>
                  </div>

                  {/* Global Deposit Inventory */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Global deposit inventory</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Known deposits contain an estimated <strong style={{ fontWeight: 600, color: '#1C1E21' }}>8,000–10,000 tonnes</strong> of germanium across 8 major sites globally. Reserve data is limited — the USGS states it is "not widely reported at a mine or country level and thus difficult to quantify." Five deposits are in China, representing ~7,200 tonnes or roughly 73% of identified resources.</p>

                    <table style={{ width: '100%', borderCollapse: 'collapse', margin: '12px 0', fontSize: '11px' }}>
                      <thead>
                        <tr>
                          {['Deposit', 'Country', 'Type', 'Ge content', 'Status'].map(h => (
                            <th key={h} style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9CA3AF', textAlign: 'left', padding: '6px 8px', borderBottom: '0.5px solid #E5E7EB', fontFamily: "'Geist Mono', monospace" }}>{h}</th>
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
                              <span style={{ fontSize: '8px', padding: '2px 6px', borderRadius: '2px', fontWeight: 600, letterSpacing: '0.03em', display: 'inline-block', fontFamily: "'Geist Mono', monospace",
                                background: tagColor === 'red' ? '#FEF2F2' : tagColor === 'amber' ? '#FEF3C7' : '#ECFDF5',
                                color: tagColor === 'red' ? '#991B1B' : tagColor === 'amber' ? '#92400E' : '#065F46',
                              }}>{status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Including Russia (sanctioned), <strong style={{ fontWeight: 600, color: '#1C1E21' }}>83% of known germanium resources are geopolitically constrained</strong>. The DRC deposit (Big Hill) shipped its first germanium concentrates to Umicore in Belgium in October 2024, but is years from meaningful scale. Red Dog in Alaska — the sole US source — is in decline with no published reserve extension.</p>
                  </div>

                  {/* Annual Supply Waterfall */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Annual supply waterfall</div>

                    <div style={{ display: 'flex', gap: '8px', margin: '14px 0' }}>
                      {([
                        ['~220t/yr', 'Total refined + recycled', false],
                        ['~65–85t', 'Western-accessible', false],
                        ['93%', 'China share of mining', true],
                      ] as [string, string, boolean][]).map(([num, label, isRed], i) => (
                        <div key={i} style={{ flex: 1, background: '#F3F4F6', borderRadius: '4px', padding: '10px 12px' }}>
                          <div style={{ fontSize: '16px', fontWeight: 600, color: isRed ? '#991B1B' : '#1C1E21', letterSpacing: '-0.3px', fontFamily: "'Geist Mono', monospace" }}>{num}</div>
                          <div style={{ fontSize: '7.5px', color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '2px', fontFamily: "'Geist Mono', monospace" }}>{label}</div>
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
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#1C1E21', minWidth: '70px', textAlign: 'right', fontFamily: "'Geist Mono', monospace" }}>{val}</div>
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
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#1C1E21', minWidth: '70px', textAlign: 'right', fontFamily: "'Geist Mono', monospace" }}>{val}</div>
                        <div style={{ width: '100px', height: '5px', background: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '5px', borderRadius: '3px', width: `${pct}%`, background: color }}></div>
                        </div>
                      </div>
                    ))}

                    <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '8px', fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>Umicore sources {'>'}50% of its germanium from recycled manufacturing scrap and waste streams. Neither 5N Plus nor PPM disclose germanium-specific production volumes — figures are analyst estimates. Recycling sources include IR optics machining waste, decommissioned military equipment, fiber optic manufacturing scrap, solar cell wafer scrap, and semiconductor waste.</p>

                    <div style={{ background: '#F0F9FF', borderRadius: '4px', padding: '12px 14px', margin: '12px 0' }}>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#155E75', marginBottom: '4px', fontFamily: "'Geist Mono', monospace" }}>Key data point</div>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: '11px', color: '#164E63', lineHeight: 1.55 }}>China&apos;s exports of germanium metal decreased <strong>55%</strong> in Jan–Aug 2024 vs the same period in 2023, falling to just 16,700 kg. In December 2024, China banned all germanium exports to the United States. Remaining Chinese exports went to Belgium (33%), Germany (32%), Russia (25%), and Japan (6%). <em>— USGS MCS 2025</em></p>
                    </div>
                  </div>

                  {/* Western accessible */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>What&apos;s actually accessible to western buyers</div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>After subtracting geopolitically constrained supply — China&apos;s ~130t (export controlled, US ban), Russia&apos;s ~15t (sanctioned), and the declining US deposit — <strong style={{ fontWeight: 600, color: '#1C1E21' }}>reliable western-accessible supply is approximately 65–85 tonnes per year</strong>. The majority of this is recycled material, not primary production.</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>The DRC upside is real but distant. The Umicore-STL partnership (signed May 2024, facilitated by the Minerals Security Partnership of 14 countries + EU) targets germanium recovery from 700+ tonnes of potential in Big Hill tailings in Lubumbashi. First shipment confirmed October 2024. But scaling tailings recovery to meaningful volumes (10–20t/yr) typically takes 3–5 years. This is the single most important new western primary source in decades.</p>
                  </div>

                  {/* Gap box */}
                  <div style={{ background: '#FEF2F2', borderRadius: '4px', padding: '16px 18px', margin: '16px 0' }}>
                    <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#991B1B', marginBottom: '8px', fontFamily: "'Geist Mono', monospace" }}>The gap</div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: '12px', color: '#7F1D1D', lineHeight: 1.6, marginBottom: '8px' }}>Fiber optics alone — the single largest end use at 35–44% of global consumption — requires roughly <strong>77–97 tonnes</strong> of germanium per year. Reliable western supply (~65–85t) barely covers this single application. This leaves <strong>zero</strong> for IR optics, satellite solar cells, semiconductors, radiation detectors, and defense.</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: '12px', color: '#7F1D1D', lineHeight: 1.6, marginBottom: '8px' }}>AI-focused data centers require <strong>10–36x more fiber</strong> than traditional facilities. Corning&apos;s enterprise sales grew 58% YoY in Q3 2025. At least one major fiber manufacturer has sold all inventory through 2026. The US needs to add 213 million fiber miles by 2029.</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: '12px', color: '#7F1D1D', lineHeight: 1.6 }}>There is <strong>no futures market</strong> for germanium. No strategic government stockpile. No viable substitute in fiber optic manufacturing. GeO₂: $940/kg → $2,125/kg in 9 months.</p>
                  </div>

                  <hr style={{ border: 'none', borderTop: '0.5px solid #E5E7EB', margin: '24px 0' }} />

                  {/* 9 Constraints */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>9 structural constraints on supply growth</div>

                    {([
                      ['01', 'Byproduct dependency', "Germanium production is governed by zinc prices and coal policy — not germanium demand. If a zinc mine closes because zinc becomes uneconomic, germanium supply drops to zero from that source regardless of how expensive germanium gets. The entire supply is a passenger in someone else's vehicle."],
                      ['02', 'Cannot explore for germanium', "Geological exploration doesn't work for germanium. You can't survey for it — you have to find a zinc or coal deposit and hope it contains recoverable trace germanium at 50–800 ppm. There is no geological survey team in the world whose mandate is \"find germanium.\""],
                      ['03', 'Decade-long lead times', 'Even if a new germanium-bearing zinc deposit were found tomorrow, the timeline from discovery to permitting to mine construction to first zinc production to germanium recovery from smelter residues is 10–15 years minimum.'],
                      ['04', 'Low recovery yields', 'Only about 10% of germanium flowing through zinc smelters and coal plants is actually captured. Source metal streams contain ~12,000 tonnes of Ge per year globally, but actual production is only ~220 tonnes — about 2%. Upgrading recovery infrastructure requires sustained high prices to justify capex.'],
                      ['05', 'Shrinking deposit base', "Red Dog in Alaska — the only US germanium source — is in decline. Nyrstar's Tennessee zinc mine suspended operations in late 2024. No western replacement deposits have been identified. The count of active sites is going down."],
                      ['06', 'Coal decarbonization headwinds', "China's three largest germanium deposits (Lincang, Wulantuga, Yimin) are lignite coal operations. Climate policy and China's own coal reduction targets could curtail output independent of germanium market fundamentals."],
                      ['07', 'Recycling has a structural ceiling', 'Fiber optics — the largest end use — consumes germanium non-recoverably. The Ge is doped into the glass core during manufacturing and cannot be extracted from deployed cable. Recycling can only recirculate existing material. It cannot add new supply.'],
                      ['08', 'Western recycling is an oligopoly', 'Umicore dominates through scale, single-site integration in Olen (Belgium), and tolling schemes giving first access to scrap. Others recycle (5N Plus, PPM, Novotech) but none at comparable volume. The barrier is feedstock access, not technology.'],
                      ['09', 'China can tighten further at any time', "The Aug 2023 export licensing and Dec 2024 US ban are templates. China's MOFCOM has placed controls on 17 mineral commodities. Extension to EU and Japanese buyers is plausible. There is no diplomatic mechanism guaranteeing continued access."],
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

                  {/* Sources */}
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: USGS Mineral Commodity Summaries 2025 (Amy C. Tolcin), USGS Minerals Yearbook 2023 — Germanium, Yunnan Chihong Zinc &amp; Germanium Co. 2023 Annual Report, RFC Ambrian Germanium Commodity Report April 2025, Umicore Integrated Annual Report 2023, Umicore EU CRM Act press release, Gécamines press release October 2024, Corning Q3 2025 earnings / John McGirr statements, STL CEO Rahul Puri statements December 2025, Argus Media Non-Ferrous Markets pricing, Light Reading January 2026, WORLD7 Integrated Assessment Model (Springer, December 2024).
                  </div>

                </div>
              </div>
            ) : (
              /* Placeholder for all other insights */
              <div style={{ padding: "28px 28px 24px" }}>
                <button onClick={() => setActivePopup(null)} style={{ position: "absolute", top: "12px", right: "14px", background: "none", border: "none", fontSize: "14px", color: "#a8a49a", cursor: "pointer", fontFamily: "var(--font-mono, 'Courier New', monospace)", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "3px" }}>✕</button>
                {(() => {
                  const bar = INSIGHT_BARS.find(b => b.key === activePopup);
                  return bar ? (
                    <>
                      <div style={{ marginBottom: "16px" }}>
                        <span style={{ display: "inline-block", background: bar.pillBg, color: bar.pillText, fontFamily: "var(--font-mono, 'Courier New', monospace)", fontSize: "8px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "4px 10px", borderRadius: "3px" }}>
                          {bar.label}
                        </span>
                      </div>
                      <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "14px", color: "#888880", fontStyle: "italic", lineHeight: 1.6 }}>
                        Analysis content for this insight will be populated here.
                      </div>
                    </>
                  ) : null;
                })()}
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
