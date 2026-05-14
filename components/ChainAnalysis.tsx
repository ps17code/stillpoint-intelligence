"use client";
import React from "react";

const amber = "#c87a4a";
const amberBg = "rgba(200, 122, 74, 0.06)";
const warmWhite = "#ece8e1";
const muted = "#706a60";
const dimmer = "#4a4540";
const border = "rgba(255,255,255,0.04)";
const cardBg = "rgb(22, 21, 20)";

const ELASTICITY_LEVELS: Record<string, { label: string; bars: number; color: string }> = {
  "very_low": { label: "VERY LOW", bars: 1, color: amber },
  "low": { label: "LOW", bars: 2, color: "rgba(200, 122, 74, 0.6)" },
  "medium": { label: "MEDIUM", bars: 3, color: "rgba(255,255,255,0.35)" },
  "high": { label: "HIGH", bars: 4, color: "rgba(255,255,255,0.35)" },
};

function ElasticityCell({ level }: { level: string }) {
  const el = ELASTICITY_LEVELS[level] ?? ELASTICITY_LEVELS.medium;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
      <span style={{ fontSize: 8, letterSpacing: "0.06em", color: el.color, fontFamily: "'Geist Mono', monospace" }}>{el.label}</span>
      <div style={{ display: "flex", gap: 1.5 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ width: 6, height: 3, borderRadius: 1, background: i <= el.bars ? el.color : "rgba(255,255,255,0.06)" }} />
        ))}
      </div>
    </div>
  );
}

export default function ChainAnalysis() {
  return (
    <div style={{ padding: 15, borderTop: `1px solid ${border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>

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
                  {["", "Supply 2030E", "Demand 2030E", "Gap", "Elasticity"].map((h, i) => (
                    <th key={i} style={{ textAlign: i === 0 ? "left" : "right", padding: i === 0 ? "0 8px 8px 0" : "0 8px 8px", fontSize: 7, letterSpacing: "0.08em", color: dimmer, fontWeight: 500, fontFamily: "'Geist Mono', monospace", textTransform: "uppercase", borderBottom: `1px solid ${border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Germanium", supply: "220 t/yr", demand: "450–500 t/yr", gap: "–230 t/yr", elasticity: "very_low", severe: true },
                  { name: "GeCl₄", supply: "500 t/yr", demand: "900–1,100 t/yr", gap: "–500 t/yr", elasticity: "very_low", severe: true },
                  { name: "Fiber", supply: "7B km/yr", demand: "12–15B km/yr", gap: "–6B km/yr", elasticity: "medium", severe: false },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: "8px 8px 8px 0", fontSize: 10, color: warmWhite, fontWeight: 500, borderBottom: `1px solid ${border}` }}>{row.name}</td>
                    <td style={{ padding: "8px", fontSize: 10, color: muted, textAlign: "right", fontFamily: "'Geist Mono', monospace", borderBottom: `1px solid ${border}` }}>{row.supply}</td>
                    <td style={{ padding: "8px", fontSize: 10, color: row.severe ? amber : muted, textAlign: "right", fontFamily: "'Geist Mono', monospace", fontWeight: row.severe ? 500 : 400, borderBottom: `1px solid ${border}` }}>{row.demand}</td>
                    <td style={{ padding: "8px", fontSize: 10, color: row.severe ? amber : "rgba(255,255,255,0.5)", textAlign: "right", fontFamily: "'Geist Mono', monospace", fontWeight: 500, borderBottom: `1px solid ${border}` }}>{row.gap}</td>
                    <td style={{ padding: "8px 0 8px 8px", borderBottom: `1px solid ${border}` }}><ElasticityCell level={row.elasticity} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── COLUMN 2: CONSTRAINT ANALYSIS ── */}
        <div>
          <p style={{ fontSize: 8, letterSpacing: "0.12em", color: dimmer, textTransform: "uppercase", margin: "0 0 16px 0", fontFamily: "'Geist Mono', monospace" }}>Constraint Analysis</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Card 1: Germanium */}
            <div style={{ background: cardBg, borderRadius: 4, padding: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <p style={{ fontSize: 11, color: warmWhite, fontWeight: 500, margin: 0 }}>Germanium</p>
                <span style={{ fontSize: 6, letterSpacing: "0.06em", textTransform: "uppercase", color: amber, background: amberBg, border: `0.5px solid rgba(200,122,74,0.3)`, padding: "1px 5px", borderRadius: 2, fontFamily: "'Geist Mono', monospace" }}>Structural Bottleneck</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  "Byproduct of zinc and coal mining — only a few deposits globally host commercially recoverable concentrations.",
                  "Expansion requires major capex in zinc-smelter recovery infrastructure with multi-year build timelines.",
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
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <p style={{ fontSize: 11, color: warmWhite, fontWeight: 500, margin: 0 }}>GeCl₄ Purification</p>
                <span style={{ fontSize: 6, letterSpacing: "0.06em", textTransform: "uppercase", color: amber, background: amberBg, border: `0.5px solid rgba(200,122,74,0.3)`, padding: "1px 5px", borderRadius: 2, fontFamily: "'Geist Mono', monospace" }}>Hidden Industrial Chokepoint</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  "8N+ purity refining with complex chemistry and multi-year customer qualification cycles.",
                  "Umicore (Belgium) is the only commercial-scale Western supplier serving the fiber market.",
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
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <p style={{ fontSize: 11, color: warmWhite, fontWeight: 500, margin: 0 }}>Fiber Manufacturing</p>
                <span style={{ fontSize: 6, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", padding: "1px 5px", borderRadius: 2, fontFamily: "'Geist Mono', monospace" }}>Tight Market</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  "Preform manufacturing has an 18–24 month expansion cycle and current capacity is fully booked.",
                  "New capacity coming, but AI demand grows faster — AI clusters use up to 36× more fiber than CPU racks.",
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
              "The chokepoint is GeCl₄ refining, not germanium ore. Umicore's Belgian facility is the only commercial-scale Western supplier — a single point of failure between mineral supply and AI fiber demand.",
              "Capital cannot close the gap on AI's timeline. Every layer of the chain — recovery, refining, preform manufacturing — has multi-year expansion cycles, and demand is growing faster than capacity can be added.",
              "China holds asymmetric escalation leverage. It controls 60%+ of both germanium and GeCl₄ supply and has already shown willingness to weaponize that position through targeted export controls.",
              "The investable thesis is unusually clean. Umicore is the pure-play on the chokepoint, with 5N Plus and the major fiber manufacturers as secondary positions on the same constraint.",
            ].map((insight, i) => (
              <div key={i} style={{ padding: "14px 0", borderBottom: i < 3 ? `1px solid ${border}` : "none" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                  <span style={{ fontSize: 10, color: dimmer, fontFamily: "'Geist Mono', monospace", flexShrink: 0, minWidth: 14 }}>{String(i + 1).padStart(2, "0")}</span>
                  <p style={{ fontSize: 11, color: i === 3 ? warmWhite : "rgb(160, 152, 136)", lineHeight: 1.6, margin: 0, fontWeight: i === 3 ? 500 : 400 }}>{insight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
