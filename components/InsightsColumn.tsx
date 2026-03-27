"use client";

import { useState } from "react";

const INSIGHT_BARS = [
  { key: "supply-demand", label: "SUPPLY / DEMAND GAP", teaser: "~80t western-accessible vs ~325t projected demand by 2026" },
  { key: "bottlenecks", label: "BOTTLENECKS", teaser: "Single-source refining, 17% recycling ceiling, Red Dog closure" },
  { key: "geopolitical", label: "GEOPOLITICAL RISK", teaser: "China export controls, US ban, sanctions on Russian supply" },
  { key: "catalysts", label: "CATALYSTS", teaser: "BEAD fiber buildout, defense stockpiling, DRC ramp-up" },
  { key: "emerging-tech", label: "EMERGING TECH", teaser: "Fly ash recovery, silicon photonics, hollow-core fiber" },
  { key: "deals-capital", label: "DEALS & CAPITAL", teaser: "Umicore-STL offtake, DoD $14.4M grant, Teck govt talks" },
  { key: "major-companies", label: "MAJOR COMPANIES", teaser: "Corning, Umicore, Teck, Yunnan Chihong, 5N Plus" },
  { key: "investment-ideas", label: "INVESTMENT IDEAS", teaser: "6 positions across the chain from mining to end-use" },
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
          <div style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#1a1a14", textAlign: "center" as const, padding: "14px 16px 10px", borderBottom: "0.5px solid rgba(80,80,70,0.15)" }}>
            Key insights
          </div>
          {INSIGHT_BARS.map((bar, i) => (
            <div
              key={bar.key}
              onClick={() => setActivePopup(bar.key)}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(154,123,60,0.03)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              style={{ padding: "13px 16px", cursor: "pointer", borderBottom: i < INSIGHT_BARS.length - 1 ? "0.5px solid rgba(80,80,70,0.1)" : "none", transition: "background 0.15s" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#5a5647" }}>{bar.label}</div>
                  <div style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)", fontSize: "8.5px", color: "#a8a49a", marginTop: "2px", letterSpacing: "0.02em", lineHeight: 1.4 }}>{bar.teaser}</div>
                </div>
                <span style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)", fontSize: "10px", color: "#c8c4b8", marginLeft: "8px", marginTop: "1px" }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup overlay */}
      {activePopup && (
        <div onClick={() => setActivePopup(null)} style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(90,86,71,0.3)", backdropFilter: "blur(2px)" }} />
          <div onClick={e => e.stopPropagation()} style={{ position: "relative", background: "#FAF8F4", border: "0.5px solid rgba(80,80,70,0.2)", borderRadius: "6px", width: "90%", maxWidth: "520px", maxHeight: "80vh", overflowY: "auto" as const, padding: "28px 28px 24px" }}>
            <button onClick={() => setActivePopup(null)} style={{ position: "absolute", top: "12px", right: "14px", background: "none", border: "none", fontSize: "14px", color: "#a8a49a", cursor: "pointer", fontFamily: "var(--font-mono, 'Courier New', monospace)", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "3px" }}>✕</button>
            <div style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#9a7b3c", fontWeight: 600, marginBottom: "16px" }}>
              {INSIGHT_BARS.find(b => b.key === activePopup)?.label}
            </div>
            <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "14px", color: "#888880", fontStyle: "italic", lineHeight: 1.6 }}>
              Analysis content for this insight will be populated here.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
