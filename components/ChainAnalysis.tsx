"use client";
import React from "react";

const amber = "#c87a4a";
const amberMuted = "rgba(200, 122, 74, 0.6)";
const amberBg = "rgba(200, 122, 74, 0.06)";
const warmWhite = "#ece8e1";
const muted = "#706a60";
const dimmer = "#4a4540";
const border = "rgba(255,255,255,0.04)";
const cardBg = "rgb(22, 21, 20)";

const ELASTICITY_LEVELS: Record<string, { label: string; bars: number }> = {
  "very_low": { label: "VERY LOW", bars: 1 },
  "low": { label: "LOW", bars: 2 },
  "medium": { label: "MEDIUM", bars: 3 },
  "high": { label: "HIGH", bars: 4 },
};

function ElasticityIndicator({ level }: { level: string }) {
  const el = ELASTICITY_LEVELS[level] ?? ELASTICITY_LEVELS.medium;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
      <span style={{ fontSize: 7, letterSpacing: "0.08em", color: el.bars <= 1 ? amber : muted, fontFamily: "'Geist Mono', monospace" }}>{el.label}</span>
      <div style={{ display: "flex", gap: 2 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ width: 8, height: 3, borderRadius: 1, background: i <= el.bars ? (el.bars <= 1 ? amber : el.bars <= 2 ? amberMuted : "rgba(255,255,255,0.15)") : "rgba(255,255,255,0.06)" }} />
        ))}
      </div>
    </div>
  );
}

export default function ChainAnalysis() {
  return (
    <div style={{ padding: "40px 0 20px", borderTop: `1px solid ${border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 30 }}>

        {/* ── COLUMN 1: CHAIN ANALYSIS ── */}
        <div>
          <p style={{ fontSize: 8, letterSpacing: "0.12em", color: dimmer, textTransform: "uppercase", margin: "0 0 16px 0", fontFamily: "'Geist Mono', monospace" }}>Chain Analysis</p>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <h3 style={{ fontSize: 16, color: warmWhite, fontWeight: 400, margin: 0, fontFamily: "'Instrument Serif', serif" }}>
              Germanium → GeCl₄ → Fiber
            </h3>
            <span style={{ fontSize: 7, letterSpacing: "0.06em", textTransform: "uppercase", color: amber, background: amberBg, border: `0.5px solid ${amber}`, padding: "2px 6px", borderRadius: 2, fontFamily: "'Geist Mono', monospace" }}>Critical Chokepoint</span>
          </div>

          <p style={{ fontSize: 11, color: muted, lineHeight: 1.6, margin: "0 0 24px 0" }}>
            AI datacenter connectivity demand is colliding with structurally constrained upstream germanium supply.
          </p>

          {/* Supply/Demand Table */}
          <div style={{ background: cardBg, borderRadius: 4, padding: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "0 8px 8px 0", fontSize: 7, letterSpacing: "0.08em", color: dimmer, fontWeight: 500, fontFamily: "'Geist Mono', monospace", textTransform: "uppercase", borderBottom: `1px solid ${border}` }}></th>
                  <th style={{ textAlign: "right", padding: "0 8px 8px", fontSize: 7, letterSpacing: "0.08em", color: dimmer, fontWeight: 500, fontFamily: "'Geist Mono', monospace", textTransform: "uppercase", borderBottom: `1px solid ${border}` }}>Supply 2030E</th>
                  <th style={{ textAlign: "right", padding: "0 8px 8px", fontSize: 7, letterSpacing: "0.08em", color: dimmer, fontWeight: 500, fontFamily: "'Geist Mono', monospace", textTransform: "uppercase", borderBottom: `1px solid ${border}` }}>Demand 2030E</th>
                  <th style={{ textAlign: "right", padding: "0 8px 8px", fontSize: 7, letterSpacing: "0.08em", color: dimmer, fontWeight: 500, fontFamily: "'Geist Mono', monospace", textTransform: "uppercase", borderBottom: `1px solid ${border}` }}>Elasticity</th>
                  <th style={{ textAlign: "right", padding: "0 0 8px 8px", fontSize: 7, letterSpacing: "0.08em", color: dimmer, fontWeight: 500, fontFamily: "'Geist Mono', monospace", textTransform: "uppercase", borderBottom: `1px solid ${border}` }}>Constraint</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Germanium", supply: "220 t/yr", demand: "450–500 t/yr", elasticity: "Very Low", constraint: "Severe", severe: true },
                  { name: "GeCl₄", supply: "500 t/yr", demand: "900–1,100 t/yr", elasticity: "Very Low", constraint: "Severe", severe: true },
                  { name: "Fiber", supply: "7B km/yr", demand: "12–15B km/yr", elasticity: "Medium", constraint: "Tight", severe: false },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: "8px 8px 8px 0", fontSize: 10, color: warmWhite, fontWeight: 500, borderBottom: `1px solid ${border}` }}>{row.name}</td>
                    <td style={{ padding: "8px", fontSize: 10, color: muted, textAlign: "right", fontFamily: "'Geist Mono', monospace", borderBottom: `1px solid ${border}` }}>{row.supply}</td>
                    <td style={{ padding: "8px", fontSize: 10, color: row.severe ? amber : muted, textAlign: "right", fontFamily: "'Geist Mono', monospace", fontWeight: row.severe ? 500 : 400, borderBottom: `1px solid ${border}` }}>{row.demand}</td>
                    <td style={{ padding: "8px", fontSize: 9, color: row.severe ? amber : muted, textAlign: "right", fontFamily: "'Geist Mono', monospace", borderBottom: `1px solid ${border}` }}>{row.elasticity}</td>
                    <td style={{ padding: "8px 0 8px 8px", fontSize: 9, color: row.severe ? amber : "rgba(255,255,255,0.5)", textAlign: "right", fontFamily: "'Geist Mono', monospace", fontWeight: 500, borderBottom: `1px solid ${border}` }}>{row.constraint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: 7, color: "#3a3835", margin: "10px 0 0 0", fontFamily: "'Geist Mono', monospace" }}>Sources: trade data, company filings, industry estimates</p>
          </div>
        </div>

        {/* ── COLUMN 2: CONSTRAINT ANALYSIS ── */}
        <div>
          <p style={{ fontSize: 8, letterSpacing: "0.12em", color: dimmer, textTransform: "uppercase", margin: "0 0 16px 0", fontFamily: "'Geist Mono', monospace" }}>Constraint Analysis</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Card 1: Germanium */}
            <div style={{ background: cardBg, borderRadius: 4, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <p style={{ fontSize: 11, color: warmWhite, fontWeight: 500, margin: 0 }}>Germanium</p>
                    <span style={{ fontSize: 6, letterSpacing: "0.06em", textTransform: "uppercase", color: amber, background: amberBg, border: `0.5px solid rgba(200,122,74,0.3)`, padding: "1px 5px", borderRadius: 2, fontFamily: "'Geist Mono', monospace" }}>Structural Bottleneck</span>
                  </div>
                </div>
                <ElasticityIndicator level="very_low" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  "Recovered primarily as a zinc smelting byproduct",
                  "Supply cannot rapidly respond to price signals",
                  "China controls majority refining capacity",
                  "New supply requires long-cycle upstream investment",
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                    <span style={{ width: 2, height: 2, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 5 }} />
                    <p style={{ fontSize: 10, color: "rgb(160, 152, 136)", lineHeight: 1.5, margin: 0 }}>{b}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: GeCl4 */}
            <div style={{ background: cardBg, borderRadius: 4, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <p style={{ fontSize: 11, color: warmWhite, fontWeight: 500, margin: 0 }}>GeCl₄ Purification</p>
                    <span style={{ fontSize: 6, letterSpacing: "0.06em", textTransform: "uppercase", color: amber, background: amberBg, border: `0.5px solid rgba(200,122,74,0.3)`, padding: "1px 5px", borderRadius: 2, fontFamily: "'Geist Mono', monospace" }}>Hidden Industrial Chokepoint</span>
                  </div>
                </div>
                <ElasticityIndicator level="very_low" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  "Ultra-high purity requirements (8N+)",
                  "Very limited Western production base",
                  "Qualification cycles are long and vendor-specific",
                  "Difficult tacit manufacturing expertise",
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                    <span style={{ width: 2, height: 2, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 5 }} />
                    <p style={{ fontSize: 10, color: "rgb(160, 152, 136)", lineHeight: 1.5, margin: 0 }}>{b}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Fiber */}
            <div style={{ background: cardBg, borderRadius: 4, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <p style={{ fontSize: 11, color: warmWhite, fontWeight: 500, margin: 0 }}>Fiber Manufacturing</p>
                    <span style={{ fontSize: 6, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", padding: "1px 5px", borderRadius: 2, fontFamily: "'Geist Mono', monospace" }}>Tight Market</span>
                  </div>
                </div>
                <ElasticityIndicator level="medium" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  "Capacity currently overbooked through 2027",
                  "Expansion projects underway at Corning, Prysmian, YOFC",
                  "High capex but scalable over 18–24 month cycles",
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                    <span style={{ width: 2, height: 2, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 5 }} />
                    <p style={{ fontSize: 10, color: "rgb(160, 152, 136)", lineHeight: 1.5, margin: 0 }}>{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── COLUMN 3: KEY TAKEAWAYS ── */}
        <div>
          <p style={{ fontSize: 8, letterSpacing: "0.12em", color: dimmer, textTransform: "uppercase", margin: "0 0 16px 0", fontFamily: "'Geist Mono', monospace" }}>Key Takeaways</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              "At current AI infrastructure trajectories, the chain faces a major supply deficit by 2030.",
              "The structural constraints sit upstream at germanium and GeCl₄ — not at fiber assembly itself.",
              "Fiber manufacturing can scale with capital deployment. Germanium extraction cannot.",
              "This creates a hidden strategic dependency for AI datacenter connectivity.",
            ].map((insight, i) => (
              <div key={i} style={{ padding: "14px 0", borderBottom: i < 3 ? `1px solid ${border}` : "none" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                  <span style={{ fontSize: 10, color: dimmer, fontFamily: "'Geist Mono', monospace", flexShrink: 0, minWidth: 14 }}>{String(i + 1).padStart(2, "0")}</span>
                  <p style={{ fontSize: 11, color: i === 3 ? warmWhite : "rgb(160, 152, 136)", lineHeight: 1.6, margin: 0, fontWeight: i === 3 ? 500 : 400 }}>{insight}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <button
              style={{
                background: "transparent",
                border: `1px solid rgba(255,255,255,0.08)`,
                borderRadius: 3,
                padding: "10px 18px",
                cursor: "pointer",
                fontSize: 10,
                color: muted,
                fontFamily: "'Geist Mono', monospace",
                letterSpacing: "0.03em",
                transition: "border-color 0.15s, color 0.15s",
                width: "100%",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = warmWhite; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = muted; }}
            >
              Explore Mitigation Paths →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
