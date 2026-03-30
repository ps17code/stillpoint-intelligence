"use client";

import { useState } from "react";

const INSIGHT_BARS = [
  {
    key: "supply-demand",
    label: "SUPPLY CONSTRAINTS",
    teaser: "A structural shortage of raw germanium isn't a risk — it's the baseline",
    pillBg: "#EFF6FF", pillText: "#1E40AF",
  },
  {
    key: "bottlenecks",
    label: "BOTTLENECKS",
    teaser: "One facility in Belgium stands between western industry and a germanium blackout",
    pillBg: "#FEF2F2", pillText: "#991B1B",
  },
  {
    key: "geopolitical",
    label: "GEOPOLITICAL RISK",
    teaser: "China has proven it can turn germanium supply on and off at will",
    pillBg: "#FEF3C7", pillText: "#92400E",
  },
  {
    key: "catalysts",
    label: "CATALYSTS",
    teaser: "$600B in hyperscaler capex, a ticking export ban clock, and BEAD construction all converge in 2026",
    pillBg: "#ECFDF5", pillText: "#065F46",
  },
  {
    key: "emerging-tech",
    label: "EMERGING TECH",
    teaser: "AI can find zinc deposits in days — but the germanium inside still takes a decade to reach the market",
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
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>A structural shortage of raw germanium isn&apos;t a risk — it&apos;s the baseline</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '3px', background: '#EFF6FF', color: '#1E40AF', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Supply constraints</div>
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

                  {/* Takeaway */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Takeaway</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>The supply of germanium as a raw material is fundamentally fixed. It cannot be mined directly, cannot be explored for, and cannot be ramped without structural changes to the zinc and coal industries that produce it as a byproduct. Of the ~220 tonnes refined annually, over 90% originates from geopolitically constrained sources. Western-accessible supply sits at roughly 65–85 tonnes — most of it recycled — against demand that is accelerating from AI infrastructure, defense, and broadband buildout.</p>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '16px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>In the absence of a breakthrough in alternative fiber technology or a reversal of China&apos;s export restrictions, a structural shortage of germanium is not a risk scenario — it is the baseline.</strong></p>

                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>What could change this picture</div>

                    {([
                      ['China reverses export controls', "China's export restrictions are political, not geological — they can be reversed with a policy decision. Beijing has done this before: rare earth export restrictions imposed in 2010 were partially relaxed under WTO pressure by 2015. If China-US relations thaw or Beijing uses germanium access as a diplomatic bargaining chip, supply could re-open. But the precedent also shows that even temporary restrictions cause lasting supply chain restructuring — buyers who got burned don't go back."],
                      ['Demand destruction via lower-Ge fiber', "Fiber manufacturers are actively researching lower-germanium and germanium-free fiber core designs. These are not commercially viable at scale today, but sustained pricing above $2,000/kg accelerates that R&D timeline significantly. The question is whether alternatives can reach qualification and production scale before the supply gap becomes acute — a race measured in years, not months."],
                      ['Hollow-core fiber eliminates Ge entirely', "Companies like Lumenisity (acquired by Microsoft in 2022) are already deploying hollow-core fiber in specific datacenter applications. It's early, expensive, and limited to short-reach interconnects today — but if it reaches cost parity for datacenter use within 5–7 years, it could meaningfully reduce germanium demand from the largest single consumption segment. This is the most credible long-term threat to the supply thesis."],
                      ['Recycling ceiling shifts higher', "The widely cited 30% recycling share is poorly sourced and may understate what's achievable with improved recovery technology — particularly from fiber manufacturing waste streams. If the recycling share shifts from 30% to 40–50%, that adds roughly 20–40 tonnes of effective supply. It doesn't close the gap but it buys time for other solutions to mature."],
                      ['New zinc deposits yield germanium', 'Active exploration projects near Red Dog in Alaska (Anarraaq/Aktigiruq), in Namibia, and elsewhere could yield germanium-bearing zinc ores. But these are 10+ year timelines from discovery to production, and germanium content is never the target — it\'s a fortunate byproduct if it\'s there at all. Unlikely to be material before 2030, possible by 2035.'],
                    ] as [string, string][]).map(([title, body], i) => (
                      <div key={i} style={{ padding: '10px 0', borderBottom: i < 4 ? '0.5px solid #F3F4F6' : 'none' }}>
                        <div style={{ fontFamily: "Inter, sans-serif", fontSize: '12px', fontWeight: 600, color: '#1C1E21' }}>{title}</div>
                        <div style={{ fontFamily: "Inter, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, marginTop: '4px' }}>{body}</div>
                      </div>
                    ))}

                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginTop: '16px' }}><strong style={{ fontWeight: 600, color: '#1C1E21' }}>The remaining uncertainty is timing</strong> — how fast demand accelerates relative to the slow emergence of DRC primary supply, incremental recycling gains, and early-stage fiber alternatives. The structural shortage is the baseline. The variables are severity and duration.</p>
                  </div>

                  {/* Sources */}
                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: USGS Mineral Commodity Summaries 2025 (Amy C. Tolcin), USGS Minerals Yearbook 2023 — Germanium, Yunnan Chihong Zinc &amp; Germanium Co. 2023 Annual Report, RFC Ambrian Germanium Commodity Report April 2025, Umicore Integrated Annual Report 2023, Umicore EU CRM Act press release, Gécamines press release October 2024, Corning Q3 2025 earnings / John McGirr statements, STL CEO Rahul Puri statements December 2025, Argus Media Non-Ferrous Markets pricing, Light Reading January 2026, WORLD7 Integrated Assessment Model (Springer, December 2024).
                  </div>

                </div>
              </div>
            ) : activePopup === "bottlenecks" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '8px' }}>One facility in Belgium stands between western industry and a germanium blackout</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '3px', background: '#FEF2F2', color: '#991B1B', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Bottlenecks</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>

                <div style={{ padding: '0 28px 32px' }}>

                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Overview</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Supply constraints explain why germanium supply can&apos;t grow. Bottlenecks answer a different question: <strong style={{ fontWeight: 600, color: '#1C1E21' }}>where does the existing supply chain break if a single node fails?</strong> These are the physical chokepoints — places where the entire flow narrows to one facility, one company, one route, or one relationship. The germanium raw material layer has five.</p>
                  </div>

                  {([
                    {
                      num: '01',
                      title: 'Umicore — sole western refiner at scale',
                      subtitle: 'Olen, Belgium · ~40–50t/yr · >50% from recycling',
                      body: "Every meaningful volume of western germanium flows through Umicore. Their Olen facility is the only non-Chinese, non-Russian operation capable of refining germanium at 40–50 tonnes per year. They supply the majority of western optical fiber manufacturers with GeCl₄. They're also the dominant western recycler, processing several thousand tonnes of germanium-containing waste streams annually.",
                      body2: "If Olen goes offline — a regulatory issue, a fire, a feedstock disruption, a labor action — there is no alternative at comparable scale. 5N Plus and PPM Pure Metals exist but operate at roughly a third of Umicore's volume and focus on specialty products rather than bulk fiber-grade supply. Umicore is not just a major player — they are the western germanium supply chain.",
                      stat: null as string | null,
                      severity: 95,
                      severityLabel: 'Critical',
                    },
                    {
                      num: '02',
                      title: 'Yunnan Chihong — 30% of global supply from one company',
                      subtitle: 'Qujing, Yunnan Province, China · 65.9t produced in 2023 · 60t/yr capacity',
                      body: "Even inside China's dominant position, production is concentrated in two companies. Yunnan Chihong alone produced 65.9 tonnes of germanium in products in 2023 — roughly 30% of the entire world's supply from a single entity. Their Huize zinc mine is the primary feedstock source.",
                      body2: 'When Chihong announced a "deep safety system optimization project" at Huize in late 2024, their Q1 2025 zinc concentrate production dropped by 17,400 tonnes of metal content. Because germanium is a byproduct, germanium output drops in lockstep. A production decision at one Chinese company about one zinc mine ripples through nearly a third of global germanium supply.',
                      stat: 'Q1 2025 impact: zinc output down 17,400t metal content YoY' as string | null,
                      severity: 85,
                      severityLabel: 'High',
                    },
                    {
                      num: '03',
                      title: 'Red Dog → Canada → 5N Plus — single-threaded US pipeline',
                      subtitle: 'Red Dog (Alaska) → Canadian processor → 5N Plus (Montreal) · volumes undisclosed',
                      body: "The sole US germanium deposit at Red Dog, Alaska ships zinc concentrates to a Canadian processor for germanium recovery in the form of dioxide and tetrachloride. The recovered germanium flows to 5N Plus for further refining. This is a single-threaded supply chain: one mine, one export route, one processor, one refiner, across two countries.",
                      body2: "If Red Dog's output declines further (already declining, no published reserves), if the Arctic shipping route is disrupted, or if the Canadian processing arrangement changes — there is no US-origin backup. The Tennessee operation that provided a second US pathway (Nyrstar Clarksville) suspended mining operations in late 2024.",
                      stat: 'Nyrstar Tennessee: mining operations suspended late 2024' as string | null,
                      severity: 70,
                      severityLabel: 'High',
                    },
                    {
                      num: '04',
                      title: 'DRC — entire new-supply strategy in one country',
                      subtitle: 'Big Hill tailings, Lubumbashi · STL/Gécamines + Umicore · 700t+ potential',
                      body: "The entire western strategy for adding new primary germanium runs through a single partnership (Umicore-STL), a single tailings site (Big Hill, Lubumbashi), and a single country (the Democratic Republic of Congo). The DRC has well-documented challenges: mining sector governance issues, infrastructure limitations, political instability, and logistical complexity.",
                      body2: "The Minerals Security Partnership — a coalition of 14 nations plus the EU — facilitated this deal specifically because there was nothing else to facilitate. If this project stalls due to local governance, operational challenges, or a breakdown in the Umicore-STL relationship, there is no Plan B for new western primary germanium. The first concentrate shipment in October 2024 was a milestone — but one shipment is not a supply chain.",
                      stat: null as string | null,
                      severity: 65,
                      severityLabel: 'Medium',
                    },
                    {
                      num: '05',
                      title: 'Recycling feedstock access — a relationship bottleneck',
                      subtitle: 'Umicore tolling model · closed-loop scrap recovery · no open market for feedstock',
                      body: "Western germanium recycling depends on access to manufacturing scrap — IR optics machining waste, fiber production waste, solar cell wafer scrap, decommissioned military equipment. Umicore secures this feedstock through long-term tolling schemes: they sell germanium products to customers, contractually take back the production scrap, then refine and recycle it.",
                      body2: "This closed-loop model gives Umicore first access to the richest recycling feedstock in the West. A new entrant trying to compete faces a chicken-and-egg problem: you need customer relationships to access scrap, but you need recycling capacity to win customer relationships. The barrier is not technology — it's the commercial architecture that routes scrap to incumbents. There is no open spot market for germanium recycling feedstock.",
                      stat: null as string | null,
                      severity: 55,
                      severityLabel: 'Medium',
                    },
                  ]).map((bn, i) => (
                    <div key={i} style={{ marginTop: '20px', padding: '16px 18px', background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#991B1B', minWidth: '20px', fontFamily: "'Geist Mono', monospace" }}>{bn.num}</div>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '13px', fontWeight: 600, color: '#1C1E21' }}>{bn.title}</div>
                      </div>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11px', color: '#6B7280', fontStyle: 'italic', marginBottom: '10px', paddingLeft: '30px' }}>{bn.subtitle}</div>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', color: '#374151', lineHeight: 1.65, paddingLeft: '30px' }}>
                        {bn.body}
                        <br /><br />
                        <strong style={{ fontWeight: 600, color: '#1C1E21' }}>{bn.body2}</strong>
                      </div>
                      {bn.stat && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F3F4F6', borderRadius: '3px', padding: '3px 10px', margin: '8px 0 4px 30px', fontSize: '10px', color: '#1C1E21', fontWeight: 600, fontFamily: "'Geist Mono', monospace" }}>
                          {bn.stat}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '6px', margin: '12px 0 0 30px', alignItems: 'center' }}>
                        <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B7280', minWidth: '70px', fontFamily: "'Geist Mono', monospace" }}>Severity</div>
                        <div style={{ flex: 1, height: '4px', background: '#F3F4F6', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '4px', borderRadius: '2px', width: `${bn.severity}%`, background: bn.severity >= 80 ? '#DC2626' : '#F59E0B' }}></div>
                        </div>
                        <div style={{ fontSize: '9px', color: '#6B7280', minWidth: '30px', textAlign: 'right', fontFamily: "'Geist Mono', monospace" }}>{bn.severityLabel}</div>
                      </div>
                    </div>
                  ))}

                  <div style={{ background: '#FEF2F2', borderRadius: '4px', padding: '14px 16px', margin: '20px 0' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#991B1B', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>Compounding risk</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#7F1D1D', lineHeight: 1.6 }}>These bottlenecks are not independent — they compound. Umicore is the sole western refiner (bottleneck #1), AND they are the partner in the only new western primary supply project in the DRC (bottleneck #4), AND they control the dominant recycling feedstock network (bottleneck #5). <strong>A single company is the chokepoint across three of the five identified bottlenecks.</strong> Any disruption at Umicore cascades through the majority of non-Chinese germanium supply simultaneously.</p>
                  </div>

                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: USGS Mineral Commodity Summaries 2025, USGS Minerals Yearbook 2023, Yunnan Chihong Zinc &amp; Germanium Co. 2023 Annual Report &amp; Q1 2025 investor disclosures (SMM News), Umicore Integrated Annual Report 2023, Umicore EU CRM Act press release, Umicore corporate website (GeCl₄ product page, recycling services), Gécamines press release October 2024, Teck Resources 2023 Annual Report, RFC Ambrian Germanium Commodity Report April 2025.
                  </div>
                </div>
              </div>
            ) : activePopup === "geopolitical" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '8px' }}>China has proven it can turn germanium supply on and off at will</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '3px', background: '#FEF3C7', color: '#92400E', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Geopolitical risk</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>

                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Overview</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Between July 2023 and November 2025, China imposed, escalated, and then partially suspended export controls on germanium — demonstrating that <strong style={{ fontWeight: 600, color: '#1C1E21' }}>access to 93% of the world&apos;s germanium supply is a policy variable controlled by a single government</strong>. The controls were explicitly linked to US semiconductor restrictions and used as diplomatic leverage in trade negotiations. The underlying control architecture remains in place.</p>
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Policy timeline</div>
                    <div style={{ position: 'relative', margin: '16px 0', paddingLeft: '20px' }}>
                      <div style={{ position: 'absolute', left: '5px', top: '4px', bottom: '4px', width: '1px', background: '#E5E7EB' }}></div>
                      {([
                        { color: '#DC2626', date: 'July 3, 2023', title: 'China announces export controls on germanium and gallium', body: 'MOFCOM requires export licenses for germanium metal, zone-melted ingots, GeO₂, GeCl₄, and related compounds. Effective August 1. Framed as "safeguarding national security." Widely seen as retaliation for US, Dutch, and Japanese chip export restrictions.', stat: null as string | null },
                        { color: '#DC2626', date: 'August – September 2023', title: 'Exports collapse to near zero', body: 'Chinese germanium exports: 0 kg in August, 1 kg in September. For comparison, China exported 7,965 kg in July alone.', stat: '7,965 kg → 0 kg in one month' as string | null },
                        { color: '#F59E0B', date: 'September 2023 – mid 2024', title: 'Licenses granted, exports resume at reduced levels', body: 'Beijing Tongmei Xtal Technology reportedly receives first export license. Exports partially resume but Jan–Aug 2024 total is 16,700 kg — down 55% vs the same period in 2023.', stat: 'Exports down 55% in 2024 vs 2023' as string | null },
                        { color: '#DC2626', date: 'August 15, 2024', title: 'China adds antimony to export control list', body: 'The pattern extends beyond germanium and gallium. Beijing signals willingness to expand controls to additional critical minerals.', stat: null as string | null },
                        { color: '#DC2626', date: 'December 3, 2024', title: 'China bans germanium exports to the United States', body: 'MOFCOM Announcement No. 46: exports of gallium, germanium, antimony, and superhard materials to the US will not be permitted "in principle." Also bans dual-use items to US military users. Direct retaliation for expanded US semiconductor export controls.', stat: null as string | null },
                        { color: '#DC2626', date: 'October 9, 2025', title: 'Controls expand to rare earths, lithium battery materials', body: 'Six additional announcements add rare earth processing technologies, medium and heavy rare earth elements, and lithium battery components to export control lists.', stat: null as string | null },
                        { color: '#059669', date: 'November 9, 2025', title: 'China suspends the US export ban', body: 'Following a Trump-Xi meeting in Busan, MOFCOM suspends the December 2024 US ban. Suspension runs until November 27, 2026. The broader global licensing regime (August 2023) remains in force. The ban on exports to US military end-users remains active.', stat: 'Suspension expires: Nov 27, 2026' as string | null },
                      ]).map((item, i) => (
                        <div key={i} style={{ position: 'relative', padding: `0 0 ${i < 6 ? '16px' : '0'} 20px` }}>
                          <div style={{ position: 'absolute', left: '-18px', top: '5px', width: '7px', height: '7px', borderRadius: '50%', background: item.color }}></div>
                          <div style={{ fontSize: '9px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '2px', fontFamily: "'Geist Mono', monospace" }}>{item.date}</div>
                          <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', fontWeight: 600, color: '#1C1E21', marginBottom: '3px' }}>{item.title}</div>
                          <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11px', color: '#6B7280', lineHeight: 1.55 }}>{item.body}</div>
                          {item.stat && <div style={{ display: 'inline-block', background: '#F3F4F6', borderRadius: '3px', padding: '2px 8px', fontSize: '9px', fontWeight: 600, color: '#1C1E21', marginTop: '4px', fontFamily: "'Geist Mono', monospace" }}>{item.stat}</div>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#FFFBEB', borderRadius: '4px', padding: '14px 16px', margin: '20px 0' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#92400E', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>Key data point</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#78350F', lineHeight: 1.6 }}>The Stimson Center found that in 2024, germanium exports to the US fell by ~5,900 kg while exports to Belgium increased by ~6,150 kg. The combined volume to both countries remained roughly constant. This suggests <strong>third-country routing</strong> — US buyers procuring Chinese germanium through Belgium to circumvent restrictions.</p>
                  </div>

                  <hr style={{ border: 'none', borderTop: '0.5px solid #E5E7EB', margin: '24px 0' }} />

                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>What this means</div>
                    {([
                      { num: '01', title: 'Germanium is a diplomatic bargaining chip, not a permanent policy', body: 'The November 2025 suspension was explicitly linked to the broader US-China trade truce. Beijing imposed controls in retaliation for chip restrictions, then lifted them as a concession during negotiations. Germanium export policy is a function of geopolitical relations, not resource management. It can be toggled on and off.' },
                      { num: '02', title: 'The control architecture remains intact', body: 'China has suspended one element — the outright US ban. The August 2023 global licensing requirement still applies. MOFCOM still approves every germanium export. The military end-use ban remains active. China has not dismantled its control apparatus. It has paused one lever while retaining all others.' },
                      { num: '03', title: 'The suspension has an expiration date', body: 'November 27, 2026. After that, China can reimpose the full ban with a single announcement. Any company building supply chain plans around resumed Chinese exports is building on a foundation that disappears in months.' },
                      { num: '04', title: 'The damage is already done', body: "Even during licensing periods, volumes dropped 55%. Western buyers are actively building alternatives regardless of current policy. The Umicore-DRC deal, the Teck government talks, and the DoD grants all accelerated because of the controls — and they won't reverse just because the ban is temporarily lifted." },
                      { num: '05', title: 'Germanium is part of a systematic pattern', body: "China has applied export controls to germanium, gallium, antimony, graphite, rare earths, and lithium battery materials. MOFCOM has placed controls on 17 mineral commodities to date. Germanium is not an isolated case — it's a template being applied across the critical minerals landscape." },
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

                  <hr style={{ border: 'none', borderTop: '0.5px solid #E5E7EB', margin: '24px 0' }} />

                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Russia — secondary geopolitical layer</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>JSC Germanium in Russia&apos;s Far East contributes ~15t/yr capacity but western sanctions make this supply inaccessible to US and EU buyers. Russia received 25% of China&apos;s germanium exports through August 2024, suggesting a <strong style={{ fontWeight: 600, color: '#1C1E21' }}>China-Russia minerals corridor</strong> that operates outside western sanctions frameworks. This supply is effectively lost to western industry regardless of Chinese export policy.</p>
                  </div>

                  <div style={{ background: '#FEF2F2', borderRadius: '4px', padding: '14px 16px', margin: '20px 0' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#991B1B', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>Bottom line</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#7F1D1D', lineHeight: 1.6 }}>Access to 93% of the world&apos;s germanium mining output is controlled by a government that has demonstrated willingness to restrict it as geopolitical leverage. The current suspension is temporary, conditional, and expires in November 2026. The licensing architecture is permanent. <strong>Any assessment of germanium supply reliability must treat Chinese exports as a variable that can go to zero at any time — because it already has.</strong></p>
                  </div>

                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: USGS Mineral Commodity Summaries 2025, China MOFCOM Announcements No. 23 (2023), No. 46 (2024), No. 72 (2025), Stimson Center &ldquo;China&apos;s Germanium and Gallium Export Restrictions&rdquo; April 2025, ORF America &ldquo;China&apos;s Critical Mineral Export Controls&rdquo; May 2025, CNBC November 2025, Fastmarkets November 2025, Reuters November 2025, Pillsbury Law November 2025, The Oregon Group November 2025, Global Trade Alert 2023–2025.
                  </div>
                </div>
              </div>
            ) : activePopup === "catalysts" ? (
              <div style={{ padding: 0 }}>
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '8px' }}>$600B in hyperscaler capex, a ticking export ban clock, and BEAD construction all converge in 2026</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '3px', background: '#ECFDF5', color: '#065F46', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Catalysts</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>

                <div style={{ padding: '0 28px 32px' }}>
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>Overview</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Catalysts are specific, dateable events that could materially shift germanium supply-demand dynamics. Unlike structural constraints (permanent) or geopolitical risk (policy-driven), these are watchable triggers — each with a timeline and a probability. <strong style={{ fontWeight: 600, color: '#1C1E21' }}>2026 is the convergence year</strong> where multiple tightening catalysts hit simultaneously.</p>
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '3px', fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px', background: '#FEF2F2', color: '#991B1B', fontFamily: "'Geist Mono', monospace" }}>Tightening — making the shortage worse</div>

                    {([
                      { num: '01', title: 'China export ban suspension expires', date: 'Nov 27, 2026', dateColor: 'red', body: 'The single most important near-term catalyst. China suspended the US export ban as part of a trade truce following the Trump-Xi meeting in Busan. After November 27, 2026, Beijing can reimpose with a single announcement. The broader MOFCOM licensing regime remains in force. The military end-use ban remains active. This is a countdown, not a resolution.', stat: null as string | null },
                      { num: '02', title: 'Hyperscaler AI capex hits $600B+', date: '2026', dateColor: 'red', body: 'The Big Five (Amazon, Alphabet, Microsoft, Meta, Oracle) are projected to spend over $600 billion on infrastructure in 2026 — a 36% increase from 2025. ~75% ($450B) targets AI infrastructure. Amazon alone targets $200B. AI data centers require 10–36x more fiber than traditional facilities. Every dollar translates into fiber demand which translates into germanium consumption.', stat: 'Amazon $200B · Alphabet $175–185B · Meta $115–135B · Microsoft $120B+ · Oracle $50B' as string | null },
                      { num: '03', title: 'BEAD fiber construction begins at scale', date: '2026–2030', dateColor: 'amber', body: 'The $42.5B federal broadband program is transitioning from planning to construction. 32 of 56 state plans approved as of late 2025. The Trump administration shifted from fiber-first to technology-neutral in June 2025, slowing some timelines — but fiber still dominates (Louisiana: 80% fiber, Texas: $3.3B largest allocation). When BEAD ramps, it pulls on the same germanium-dependent fiber supply chain that AI datacenters are already straining.', stat: '$42.5B total · 32/56 states approved · construction starts early 2026' as string | null },
                      { num: '04', title: 'Defense stockpiling acceleration', date: 'Ongoing', dateColor: 'amber', body: 'DoD awarded $14.4M in April 2024 under the Defense Production Act for germanium wafer capacity in Utah. USGS classified germanium among the highest-risk critical minerals in the 2025 list. Further DPA funding allocations are likely. Each government purchase removes tonnes from the commercial market.', stat: null as string | null },
                      { num: '05', title: 'Controls extend to EU/Japan buyers', date: 'Plausible', dateColor: 'amber', body: 'During the licensing period, Chinese exports redirected: Belgium 33%, Germany 32%, Japan 6%. These are the remaining indirect channels for western buyers. If China-US relations deteriorate and Beijing extends restrictions, the last supply channels collapse. China has already applied controls to 17 mineral commodities — the infrastructure exists.', stat: null as string | null },
                    ]).map((cat, i) => (
                      <div key={i} style={{ padding: '16px 18px', background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: '6px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flex: 1 }}>
                            <div style={{ fontSize: '10px', fontWeight: 600, color: '#991B1B', minWidth: '18px', fontFamily: "'Geist Mono', monospace" }}>{cat.num}</div>
                            <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35 }}>{cat.title}</div>
                          </div>
                          <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.05em', padding: '3px 8px', borderRadius: '3px', whiteSpace: 'nowrap' as const, marginLeft: '8px', flexShrink: 0, fontFamily: "'Geist Mono', monospace",
                            background: cat.dateColor === 'red' ? '#FEF2F2' : '#FEF3C7',
                            color: cat.dateColor === 'red' ? '#991B1B' : '#92400E',
                          }}>{cat.date}</div>
                        </div>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, paddingLeft: '26px' }}>{cat.body}</div>
                        {cat.stat && <div style={{ display: 'inline-block', background: '#F3F4F6', borderRadius: '3px', padding: '2px 8px', fontSize: '9px', fontWeight: 600, color: '#1C1E21', marginTop: '6px', marginLeft: '26px', fontFamily: "'Geist Mono', monospace" }}>{cat.stat}</div>}
                      </div>
                    ))}
                  </div>

                  <hr style={{ border: 'none', borderTop: '0.5px solid #E5E7EB', margin: '24px 0' }} />

                  <div style={{ marginTop: '24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '3px', fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px', background: '#ECFDF5', color: '#065F46', fontFamily: "'Geist Mono', monospace" }}>Easing — could relieve pressure</div>

                    {([
                      { num: '06', title: 'DRC/Umicore reaches production scale', date: '2027–2029', dateColor: 'green', body: 'The Umicore-STL partnership at Big Hill tailings holds 700+ tonnes of Ge potential. First shipment confirmed October 2024. Facilitated by the Minerals Security Partnership (14 nations + EU). Could add 10–20t/yr of new western primary supply within 3–5 years. The most important easing catalyst — but DRC operating environment adds significant execution risk.' },
                      { num: '07', title: 'Teck Resources government-backed expansion', date: 'Timeline unclear', dateColor: 'blue', body: 'Teck in active discussions with US and Canadian governments to expand germanium recovery from zinc operations. Blue Moon Metals acquired the Apex mine in Utah from Teck — movement in western Ge production. Government backing through DPA or Canadian critical minerals programs could accelerate. Volumes and timeline undisclosed.' },
                      { num: '08', title: 'Nyrstar Clarksville $150M Ge/Ga facility', date: 'Stalled', dateColor: 'blue', body: 'Before suspending Tennessee mining operations in late 2024, Nyrstar proposed a $150M facility at their Clarksville zinc smelter to recover germanium and gallium. Would provide a second US processing pathway. Currently stalled but not dead — likely requires government funding to restart.' },
                      { num: '09', title: 'Hollow-core fiber commercialization', date: '2028–2030', dateColor: 'green', body: 'Eliminates germanium entirely — light travels through air, not germanium-doped glass. Microsoft acquired Lumenisity in 2022 and is deploying in specific datacenter applications. Still early, expensive, limited to short-reach. If it reaches cost parity for datacenter use within 5–7 years, it could reduce Ge demand from the largest consumption segment. Most credible long-term technology threat to the supply thesis.' },
                      { num: '10', title: 'China-US trade normalization', date: 'Conditional', dateColor: 'blue', body: "The November 2025 suspension proves normalization is possible. If it becomes permanent or China fully lifts the licensing regime, western-accessible supply roughly doubles overnight. However, rare earth precedent (imposed 2010, relaxed 2015) shows buyers diversify permanently. The structural damage to trust is irreversible even if the policy reverses." },
                    ]).map((cat, i) => (
                      <div key={i} style={{ padding: '16px 18px', background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: '6px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flex: 1 }}>
                            <div style={{ fontSize: '10px', fontWeight: 600, color: '#065F46', minWidth: '18px', fontFamily: "'Geist Mono', monospace" }}>{cat.num}</div>
                            <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35 }}>{cat.title}</div>
                          </div>
                          <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.05em', padding: '3px 8px', borderRadius: '3px', whiteSpace: 'nowrap' as const, marginLeft: '8px', flexShrink: 0, fontFamily: "'Geist Mono', monospace",
                            background: cat.dateColor === 'green' ? '#ECFDF5' : '#EFF6FF',
                            color: cat.dateColor === 'green' ? '#065F46' : '#1E40AF',
                          }}>{cat.date}</div>
                        </div>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6, paddingLeft: '26px' }}>{cat.body}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: '#FEF2F2', borderRadius: '4px', padding: '14px 16px', margin: '20px 0' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#991B1B', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>The convergence problem</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#7F1D1D', lineHeight: 1.6 }}>2026 is the year where multiple demand catalysts converge: $600B+ in hyperscaler AI capex, BEAD fiber construction at scale, continued defense stockpiling — all hitting a supply base fixed at 65–85 tonnes of western-accessible germanium. <strong>The easing catalysts (DRC scale-up, Teck expansion, hollow-core fiber) are all 2–5 years from material impact.</strong> The tightening happens now. The relief arrives later. The gap between them is where the shortage becomes acute.</p>
                  </div>

                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: USGS MCS 2025, USGS 2025 Critical Minerals List, CreditSights Hyperscaler Capex 2026 Estimates (Nov 2025), Futurum Group &ldquo;AI Capex 2026&rdquo; (Feb 2026), CNBC hyperscaler earnings (Feb 2026), IEEE ComSoc Technology Blog (Dec 2025), Light Reading &ldquo;BEAD 2025 in Review&rdquo; (Dec 2025), NTIA BEAD Progress Dashboard, Corning Q3 2025 earnings, STL CEO statements (Dec 2025), Fastmarkets (Nov 2025), Pillsbury Law (Nov 2025).
                  </div>
                </div>
              </div>
            ) : activePopup === "emerging-tech" ? (
              <div style={{ padding: 0 }}>
                {/* Header */}
                <div style={{ padding: '20px 28px 16px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#FAF9F7', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '17px', fontWeight: 600, color: '#1C1E21', lineHeight: 1.35, marginBottom: '10px' }}>AI can find zinc deposits in days — but the germanium inside still takes a decade to reach the market</div>
                    <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '3px', background: '#F5F3FF', color: '#5B21B6', display: 'inline-block', fontFamily: "'Geist Mono', monospace" }}>Emerging Tech</div>
                  </div>
                  <button onClick={() => setActivePopup(null)} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', borderRadius: '4px', flexShrink: 0, marginLeft: '12px', fontFamily: "'Geist Mono', monospace" }}>✕</button>
                </div>

                {/* Body */}
                <div style={{ padding: '0 28px 32px' }}>

                  {/* Framing */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6', fontFamily: "'Geist Mono', monospace" }}>The technology landscape</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '10px' }}>Four technology vectors are converging on the germanium supply problem, but they operate on fundamentally different timescales. AI-driven exploration compresses discovery from years to months. Advanced recovery extracts more germanium from existing waste streams. Recycling closes the loop on end-of-life material. And substitution gradually reduces demand. Understanding which vector can move the needle — and when — is the key analytical question.</p>
                  </div>

                  {/* Path 01: Find More */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6' }}>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', fontWeight: 700, color: '#5B21B6', letterSpacing: '0.08em' }}>01</div>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', fontFamily: "'Geist Mono', monospace" }}>Find more — AI-driven exploration</div>
                    </div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '12px' }}>AI geological models can now predict trace-metal concentrations in unmapped regions with high accuracy. KoBold Metals, BHP&apos;s Geosciences AI team, and several university groups have demonstrated that machine learning applied to geophysical survey data can identify high-germanium zinc deposits in weeks rather than the multi-year exploration timelines of traditional methods. The USGS has its own open-source models (SaTScan, GeoAI) producing prioritized exploration targets across Alaska and the American Southwest.</p>

                    {/* Player cards */}
                    {([
                      { name: 'KoBold Metals', role: 'AI-first mineral exploration', detail: 'Raised $537M. Targeting critical minerals across Africa and Americas with ML-driven geophysical models.', tag: 'Private', tagBg: '#F5F3FF', tagColor: '#5B21B6' },
                      { name: 'Teck Resources AI', role: 'Internal exploration AI', detail: 'Integrated ML into Red Dog extension drilling. Germanium-bearing zone prediction cut exploration cost by ~30%.', tag: 'TSX: TECK', tagBg: '#EFF6FF', tagColor: '#1E40AF' },
                      { name: 'USGS GeoAI', role: 'Government open-source models', detail: 'Published national-scale critical mineral potential maps in 2024. Alaska zinc–germanium corridors flagged as high-priority.', tag: 'Public resource', tagBg: '#ECFDF5', tagColor: '#065F46' },
                    ] as { name: string; role: string; detail: string; tag: string; tagBg: string; tagColor: string }[]).map((player) => (
                      <div key={player.name} style={{ background: '#FAFAFA', border: '0.5px solid #E5E7EB', borderRadius: '4px', padding: '12px 14px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', fontWeight: 600, color: '#1C1E21' }}>{player.name}</div>
                          <span style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.06em', padding: '2px 6px', borderRadius: '2px', background: player.tagBg, color: player.tagColor, fontFamily: "'Geist Mono', monospace", flexShrink: 0, marginLeft: '8px' }}>{player.tag}</span>
                        </div>
                        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>{player.role}</div>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6 }}>{player.detail}</div>
                      </div>
                    ))}

                    <div style={{ background: '#F5F3FF', borderRadius: '4px', padding: '10px 14px', marginTop: '4px' }}>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#4C1D95', lineHeight: 1.6 }}><strong style={{ fontWeight: 600 }}>Impact assessment:</strong> AI can compress discovery to 6–18 months. But discovery is only the first step. Permitting, development, and construction add 8–15 years. No AI exploration result that began today produces supply before 2035.</div>
                    </div>
                  </div>

                  {/* Path 02: Extract More */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6' }}>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', fontWeight: 700, color: '#5B21B6', letterSpacing: '0.08em' }}>02</div>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', fontFamily: "'Geist Mono', monospace" }}>Extract more — advanced recovery</div>
                    </div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '12px' }}>Current germanium recovery rates from zinc smelting are only 30–50%. Process improvements — including solvent extraction optimization, ion exchange resins, and AI-tuned hydrometallurgy — can push recovery to 60–70%. Applied across existing western smelters, this represents a potential 15–25 tonne annual increase in recoverable supply without any new mining. Fly ash from coal combustion is a second vector: it contains 50–300 ppm germanium and is currently stockpiled in massive quantities.</p>

                    {([
                      { name: 'Umicore (Hoboken)', role: 'Advanced refining, R&D leader', detail: 'Running proprietary hydrometallurgy upgrades at Hoboken. Target: push Ge recovery above 65%. Also developing SX-EW germanium circuits for copper mines.', tag: 'EBR: UMI', tagBg: '#EFF6FF', tagColor: '#1E40AF' },
                      { name: 'Freiberg Institute (TU Bergakademie)', role: 'Academic R&D on fly ash recovery', detail: 'Published 2024 paper on acidic leaching + solvent extraction from lignite fly ash. Recovery rates >72% demonstrated at bench scale. Licensing discussions underway.', tag: 'Academic', tagBg: '#F5F3FF', tagColor: '#5B21B6' },
                      { name: 'Nyrstar (Trafigura)', role: 'Zinc smelter with Ge recovery gaps', detail: 'Hobart and Clarksville smelters currently recover <40% of available germanium in feed. Process audit underway per Q3 2025 investor update.', tag: 'Private', tagBg: '#FEF3C7', tagColor: '#92400E' },
                    ] as { name: string; role: string; detail: string; tag: string; tagBg: string; tagColor: string }[]).map((player) => (
                      <div key={player.name} style={{ background: '#FAFAFA', border: '0.5px solid #E5E7EB', borderRadius: '4px', padding: '12px 14px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', fontWeight: 600, color: '#1C1E21' }}>{player.name}</div>
                          <span style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.06em', padding: '2px 6px', borderRadius: '2px', background: player.tagBg, color: player.tagColor, fontFamily: "'Geist Mono', monospace", flexShrink: 0, marginLeft: '8px' }}>{player.tag}</span>
                        </div>
                        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>{player.role}</div>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6 }}>{player.detail}</div>
                      </div>
                    ))}

                    <div style={{ background: '#F5F3FF', borderRadius: '4px', padding: '10px 14px', marginTop: '4px' }}>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#4C1D95', lineHeight: 1.6 }}><strong style={{ fontWeight: 600 }}>Impact assessment:</strong> Recovery improvements are the fastest path to incremental western supply. A 2–3 year process upgrade cycle at Umicore + Nyrstar could add 10–20 tonnes/year by 2027. Not a solution — but a meaningful bridge.</div>
                    </div>
                  </div>

                  {/* Path 03: Recycle More */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6' }}>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', fontWeight: 700, color: '#5B21B6', letterSpacing: '0.08em' }}>03</div>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', fontFamily: "'Geist Mono', monospace" }}>Recycle more — end-of-life recovery</div>
                    </div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '12px' }}>Germanium recovery from end-of-life fiber optic cable is technically feasible but logistically immature. A single transatlantic submarine cable contains 50–80 kg of germanium in its preform glass. Decommissioned cables are currently landfilled or incinerated at rates above 80% — an enormous waste of a critical material. The EU Critical Raw Materials Act (2024) has mandated end-of-life recovery targets, creating regulatory pressure for infrastructure investment. Collection rates are currently below 5%.</p>

                    {([
                      { name: 'Umicore', role: 'Precious metals recycling, Ge recovery', detail: 'Only major refiner with dedicated germanium recycling circuit. Processing Ge-bearing scrap from fiber preform production (sprouts). End-of-life cable recovery at <5%.', tag: 'EBR: UMI', tagBg: '#EFF6FF', tagColor: '#1E40AF' },
                      { name: '5N Plus', role: 'Specialty metals, developing Ge reclaim', detail: 'Recycling germanium from infrared optic scrap and semiconductor wafers. Small volumes — infrared optics represent <15% of Ge consumption.', tag: 'TSX: VNP', tagBg: '#ECFDF5', tagColor: '#065F46' },
                      { name: 'EU CRMA mandate', role: 'Regulatory driver for Ge recycling', detail: 'Sets 15% recycled content target for critical materials by 2030. Creates economic incentive for collection infrastructure investment from 2025 onward.', tag: 'Regulatory', tagBg: '#FEF3C7', tagColor: '#92400E' },
                    ] as { name: string; role: string; detail: string; tag: string; tagBg: string; tagColor: string }[]).map((player) => (
                      <div key={player.name} style={{ background: '#FAFAFA', border: '0.5px solid #E5E7EB', borderRadius: '4px', padding: '12px 14px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', fontWeight: 600, color: '#1C1E21' }}>{player.name}</div>
                          <span style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.06em', padding: '2px 6px', borderRadius: '2px', background: player.tagBg, color: player.tagColor, fontFamily: "'Geist Mono', monospace", flexShrink: 0, marginLeft: '8px' }}>{player.tag}</span>
                        </div>
                        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>{player.role}</div>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6 }}>{player.detail}</div>
                      </div>
                    ))}

                    <div style={{ background: '#F5F3FF', borderRadius: '4px', padding: '10px 14px', marginTop: '4px' }}>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#4C1D95', lineHeight: 1.6 }}><strong style={{ fontWeight: 600 }}>Impact assessment:</strong> Near-zero impact before 2028 due to collection infrastructure gaps. Post-CRMA mandate, recycling could supply 8–12% of western demand by 2030 — meaningful but not sufficient on its own.</div>
                    </div>
                  </div>

                  {/* Path 04: Replace It */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', paddingBottom: '6px', borderBottom: '0.5px solid #F3F4F6' }}>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', fontWeight: 700, color: '#5B21B6', letterSpacing: '0.08em' }}>04</div>
                      <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', fontFamily: "'Geist Mono', monospace" }}>Replace it — substitution tech</div>
                    </div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12.5px', color: '#374151', lineHeight: 1.7, marginBottom: '12px' }}>Two substitution paths are technically credible: silicon photonics (eliminating germanium in optical transceivers) and hollow-core fiber (reducing germanium in fiber preforms). Silicon photonics co-integrates optical and electronic components on a silicon chip, removing the need for discrete germanium photodetectors. Hollow-core fiber uses air-guiding photonic bandgap structures that require far less glass — and thus far less germanium — than conventional solid-core fiber.</p>

                    {([
                      { name: 'Silicon Photonics', subtitle: 'Intel, Cisco, Broadcom, GlobalFoundries', detail: 'Si-Ge photodetectors currently still require germanium — but pure silicon photodetectors are advancing. Intel\'s 2025 roadmap targets 400G transceivers with <40% of current Ge content. Full substitution is 5–8 years away for high-volume applications.', tag: 'Partial', tagBg: '#FEF3C7', tagColor: '#92400E' },
                      { name: 'Hollow-Core Fiber', subtitle: 'Lumenisity (Microsoft), OFS, NKT Photonics', detail: 'Reduces germanium per km of fiber by 60–85%. Microsoft\'s Lumenisity acquisition (2022) signals hyperscaler interest. Current cost premium of 3–5x over standard SMF limits deployment to ultra-low-latency applications. Volume production begins 2026–2027.', tag: 'Emerging', tagBg: '#F5F3FF', tagColor: '#5B21B6' },
                    ] as { name: string; subtitle: string; detail: string; tag: string; tagBg: string; tagColor: string }[]).map((player) => (
                      <div key={player.name} style={{ background: '#FAFAFA', border: '0.5px solid #E5E7EB', borderRadius: '4px', padding: '12px 14px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '12px', fontWeight: 600, color: '#1C1E21' }}>{player.name}</div>
                          <span style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.06em', padding: '2px 6px', borderRadius: '2px', background: player.tagBg, color: player.tagColor, fontFamily: "'Geist Mono', monospace", flexShrink: 0, marginLeft: '8px' }}>{player.tag}</span>
                        </div>
                        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>{player.subtitle}</div>
                        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#6B7280', lineHeight: 1.6 }}>{player.detail}</div>
                      </div>
                    ))}

                    <div style={{ background: '#F5F3FF', borderRadius: '4px', padding: '10px 14px', marginTop: '4px' }}>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#4C1D95', lineHeight: 1.6 }}><strong style={{ fontWeight: 600 }}>Impact assessment:</strong> Hollow-core fiber is the highest-conviction substitution play — volume production by 2027, with potential to reduce fiber-industry Ge demand by 30% by 2030. Silicon photonics substitution is slower, constrained by manufacturing qualification cycles at hyperscalers.</div>
                    </div>
                  </div>

                  {/* Timing gap callout */}
                  <div style={{ background: '#EDE9FE', borderRadius: '4px', padding: '14px 16px', margin: '24px 0' }}>
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#5B21B6', marginBottom: '6px', fontFamily: "'Geist Mono', monospace" }}>The timing gap</div>
                    <p style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: '11.5px', color: '#4C1D95', lineHeight: 1.6 }}>Technology solves the germanium problem — eventually. AI exploration finds new deposits in 2025–2027. Those deposits are permitted in 2030–2033 and producing in 2035–2040. Recovery improvements add 10–20 tonnes by 2027. Recycling infrastructure reaches scale by 2030. Substitution chips away at demand from 2027 onward. <strong style={{ fontWeight: 600 }}>The problem is acute from 2025–2030, before most of these vectors reach material impact.</strong> Technology is the long-run answer. Supply constraints are the near-term reality.</p>
                  </div>

                  <div style={{ fontSize: '7.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: "Inter, -apple-system, sans-serif", lineHeight: 1.5, marginTop: '20px', paddingTop: '12px', borderTop: '0.5px solid #F3F4F6' }}>
                    Sources: KoBold Metals investor materials (2024), USGS GeoAI Critical Mineral Potential Maps (2024), TU Bergakademie Freiberg fly ash recovery study (2024), EU Critical Raw Materials Act implementation guidelines (2024), Umicore Annual Report 2024, 5N Plus Q3 2025 investor update, Nyrstar operational review Q3 2025, Lumenisity / Microsoft acquisition documentation (2022), OFS hollow-core fiber technical specifications (2025), Intel Silicon Photonics roadmap presentation (OFC 2025), Broadcom 400G transceiver Ge content analysis (2024).
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
