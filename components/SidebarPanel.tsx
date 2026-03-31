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
            {(() => {
              const bar = INSIGHT_BARS.find(b => b.key === activePopup);
              if (!bar) return null;
              return (
                <div style={{ padding: 0 }}>
                  <div style={{ padding: "20px 28px 16px", borderBottom: "0.5px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "sticky", top: 0, background: "#FAF9F7", zIndex: 2 }}>
                    <div>
                      <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 17, fontWeight: 600, color: "#1C1E21", lineHeight: 1.35, marginBottom: 8 }}>{bar.teaser}</div>
                      <div style={{ fontSize: 7, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "3px 8px", borderRadius: 3, background: "#F5F5F5", color: bar.color, display: "inline-block", fontFamily: "'Geist Mono', monospace" }}>{bar.label}</div>
                    </div>
                    <button onClick={() => setActivePopup(null)} style={{ fontSize: 16, color: "#9CA3AF", cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "none", borderRadius: 4, flexShrink: 0, marginLeft: 12, fontFamily: "'Geist Mono', monospace" }}>✕</button>
                  </div>
                  <div style={{ padding: "24px 28px 32px", fontFamily: "'EB Garamond', Georgia, serif", fontSize: 14, color: "#888880", fontStyle: "italic", lineHeight: 1.6 }}>
                    Analysis content for this insight will be populated here.
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
}
