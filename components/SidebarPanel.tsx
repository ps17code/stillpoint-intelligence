"use client";
import { useState } from "react";

const INSIGHT_BARS = [
  { key: "supply-demand", label: "SUPPLY / DEMAND", teaser: "A structural shortage of raw germanium isn't a risk — it's the baseline", color: "#1E40AF" },
  { key: "bottlenecks",   label: "BOTTLENECKS",     teaser: "One facility in Belgium stands between western industry and a germanium blackout", color: "#991B1B" },
  { key: "geopolitical",  label: "GEOPOLITICAL",    teaser: "China has proven it can turn germanium supply on and off at will", color: "#92400E" },
  { key: "catalysts",     label: "CATALYSTS",       teaser: "$600B in hyperscaler capex and BEAD construction converge in 2026", color: "#065F46" },
  { key: "emerging-tech", label: "EMERGING TECH",   teaser: "AI can find zinc deposits in days — but germanium inside takes a decade to reach market", color: "#5B21B6" },
  { key: "major-companies", label: "COMPANIES",     teaser: "Four companies define the western germanium chain", color: "#155E75" },
  { key: "investment-ideas", label: "INVESTMENT",   teaser: "Companies and positions across the germanium supply thesis", color: "#9D174D" },
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

export default function SidebarPanel() {
  const [activePopup, setActivePopup] = useState<string | null>(null);

  return (
    <>
      <div style={{ padding: "16px 14px 24px" }}>

        {/* ── Market data ─────────────────────────────────────────── */}
        <style>{`@keyframes sp-blink { 0%,100%{opacity:1} 50%{opacity:0.15} }`}</style>
        <div style={{ ...SECTION_HDR, marginBottom: 20, display: "flex", alignItems: "center", gap: 7 }}>
          <span>Market Data</span>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7DA06A", animation: "sp-blink 2s ease-in-out infinite", flexShrink: 0 }} />
        </div>

        {/* GeO₂ price card */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            {/* Left: data */}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: 6, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 3 }}>GeO₂ spot price</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 2 }}>
                <span style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: 17, fontWeight: 600, color: "#1C1E21", letterSpacing: "-0.4px", lineHeight: 1 }}>$2,840</span>
                <span style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: 8, fontWeight: 600, color: "#3B6D11" }}>+202%</span>
              </div>
              <div style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: 5, color: "#B0ADA6", letterSpacing: "0.05em" }}>per kg · Fastmarkets Mar 2026</div>
            </div>
            {/* Right: sparkline */}
            <svg width="72" height="32" viewBox="0 0 72 32" style={{ flexShrink: 0, marginTop: 2 }}>
              <defs>
                <linearGradient id="spk-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B6D11" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#3B6D11" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,29 L5,28 L10,27 L15,27 L20,28 L25,27 L30,26 L35,23 L40,19 L45,14 L50,10 L55,6 L60,3 L65,2 L72,1" fill="none" stroke="#3B6D11" strokeWidth="0.8" />
              <path d="M0,29 L5,28 L10,27 L15,27 L20,28 L25,27 L30,26 L35,23 L40,19 L45,14 L50,10 L55,6 L60,3 L65,2 L72,1 L72,32 L0,32 Z" fill="url(#spk-fill)" />
            </svg>
          </div>
        </div>


        {/* ── Core Analysis ───────────────────────────────────────── */}
        <div style={{ ...SECTION_HDR, marginTop: 20, marginBottom: 10 }}>Core Analysis</div>

        <div>
          {INSIGHT_BARS.map((bar, i) => (
            <div
              key={bar.key}
              onClick={() => setActivePopup(bar.key)}
              style={{
                padding: "9px 0",
                cursor: "pointer",
                borderBottom: i < INSIGHT_BARS.length - 1 ? "0.5px solid #E8E5DE" : "none",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => {
                const title = e.currentTarget.querySelector<HTMLElement>("[data-title]");
                if (title) title.style.color = "#000";
              }}
              onMouseLeave={e => {
                const title = e.currentTarget.querySelector<HTMLElement>("[data-title]");
                if (title) title.style.color = "#2C2B28";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div data-title style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 13, fontWeight: 500, color: "#2C2B28", lineHeight: 1.4, marginBottom: 3, transition: "color 0.1s" }}>
                    {bar.teaser}
                  </div>
                  <span style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: "5.5px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: bar.color }}>
                    {bar.label}
                  </span>
                </div>
                <span style={{ fontSize: 9, color: "#C8C4BC", flexShrink: 0, marginTop: 1 }}>→</span>
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
            style={{ position: "relative", background: "#FAF9F7", border: "0.5px solid rgba(80,80,70,0.2)", borderRadius: 6, width: "100%", maxWidth: 680, maxHeight: "80vh", overflowY: "auto" as const }}
          >
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
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
