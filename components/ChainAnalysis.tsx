"use client";
import React from "react";

const amber = "#c87a4a";
const amberBg = "rgba(200, 122, 74, 0.06)";
const warmWhite = "#ece8e1";
const muted = "#706a60";
const dimmer = "#4a4540";
const numColor = "rgb(160, 152, 136)";
const border = "rgba(255,255,255,0.04)";

const LOGO_DOMAINS: Record<string, string> = {
  "Umicore": "umicore.com", "5N Plus": "5nplus.com", "Corning": "corning.com",
  "Prysmian": "prysmian.com", "Yunnan Chihong": "", "YOFC": "yofc.com",
};

function CompanyRow({ name }: { name: string }) {
  const domain = LOGO_DOMAINS[name];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
      <div style={{ width: 14, height: 14, borderRadius: 3, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {domain ? (
          <img src={`https://logo.clearbit.com/${domain}`} alt="" style={{ width: 10, height: 10, borderRadius: 2 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <span style={{ fontSize: 7, color: "#555" }}>{name.charAt(0)}</span>
        )}
      </div>
      <span style={{ fontSize: 10, color: numColor }}>{name}</span>
    </div>
  );
}

export default function ChainAnalysis() {
  return (
    <div style={{ padding: 15, background: "rgb(26, 27, 26)", borderRadius: 5 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* ── COLUMN 1: SUPPLY/DEMAND TABLE ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <h3 style={{ fontSize: 14, color: warmWhite, fontWeight: 400, margin: 0, fontFamily: "'Instrument Serif', serif" }}>
              Germanium → GeCl₄ → Fiber
            </h3>
            <span style={{ fontSize: 7, letterSpacing: "0.06em", textTransform: "uppercase", color: amber, background: amberBg, border: `0.5px solid ${amber}`, padding: "2px 6px", borderRadius: 2, fontFamily: "'Geist Mono', monospace" }}>Critical Chokepoint</span>
          </div>

          <p style={{ fontSize: 11, color: muted, lineHeight: 1.6, margin: "0 0 16px 0" }}>
            AI datacenter connectivity demand is colliding with structurally constrained upstream germanium supply.
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["", "Supply 2030E", "Demand 2030E", "Gap"].map((h, i) => (
                  <th key={i} style={{ textAlign: i === 0 ? "left" : "right", padding: i === 0 ? "0 8px 8px 0" : "0 8px 8px", fontSize: 7, letterSpacing: "0.08em", color: dimmer, fontWeight: 500, fontFamily: "'Geist Mono', monospace", textTransform: "uppercase", borderBottom: `1px solid ${border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Germanium", supply: "220 t/yr", demand: "450–500 t/yr", gap: "–230 t/yr" },
                { name: "GeCl₄", supply: "500 t/yr", demand: "900–1,100 t/yr", gap: "–500 t/yr" },
                { name: "Fiber", supply: "7B km/yr", demand: "12–15B km/yr", gap: "–6B km/yr" },
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: "8px 8px 8px 0", fontSize: 10, color: warmWhite, fontWeight: 500, borderBottom: `1px solid ${border}` }}>{row.name}</td>
                  <td style={{ padding: "8px", fontSize: 10, color: numColor, textAlign: "right", fontFamily: "'Geist Mono', monospace", borderBottom: `1px solid ${border}` }}>{row.supply}</td>
                  <td style={{ padding: "8px", fontSize: 10, color: numColor, textAlign: "right", fontFamily: "'Geist Mono', monospace", borderBottom: `1px solid ${border}` }}>{row.demand}</td>
                  <td style={{ padding: "8px 0 8px 8px", fontSize: 10, color: amber, textAlign: "right", fontFamily: "'Geist Mono', monospace", fontWeight: 500, borderBottom: `1px solid ${border}` }}>{row.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── COLUMN 2: CONSTRAINT ANALYSIS ── */}
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {/* Card 1: Germanium */}
            <div style={{ background: "rgb(36, 36, 36)", borderRadius: 4, padding: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <p style={{ fontSize: 11, color: warmWhite, fontWeight: 500, margin: 0 }}>Germanium</p>
                <span style={{ fontSize: 6, letterSpacing: "0.06em", textTransform: "uppercase", color: amber, background: amberBg, border: `0.5px solid rgba(200,122,74,0.3)`, padding: "1px 5px", borderRadius: 2, fontFamily: "'Geist Mono', monospace" }}>Structural Bottleneck</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {[
                  "Byproduct of zinc and coal mining — only a few deposits globally host commercially recoverable concentrations.",
                  "Expansion requires major capex in zinc-smelter recovery infrastructure with multi-year build timelines.",
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                    <span style={{ width: 2, height: 2, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 5 }} />
                    <p style={{ fontSize: 10, color: numColor, lineHeight: 1.4, margin: 0, whiteSpace: "nowrap" }}>{b}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: GeCl4 */}
            <div style={{ background: "rgb(36, 36, 36)", borderRadius: 4, padding: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <p style={{ fontSize: 11, color: warmWhite, fontWeight: 500, margin: 0 }}>GeCl₄ Purification</p>
                <span style={{ fontSize: 6, letterSpacing: "0.06em", textTransform: "uppercase", color: amber, background: amberBg, border: `0.5px solid rgba(200,122,74,0.3)`, padding: "1px 5px", borderRadius: 2, fontFamily: "'Geist Mono', monospace" }}>Hidden Industrial Chokepoint</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {[
                  "8N+ purity refining with complex chemistry and multi-year customer qualification cycles.",
                  "Umicore (Belgium) is the only commercial-scale Western supplier serving the fiber market.",
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                    <span style={{ width: 2, height: 2, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 5 }} />
                    <p style={{ fontSize: 10, color: numColor, lineHeight: 1.4, margin: 0, whiteSpace: "nowrap" }}>{b}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Fiber */}
            <div style={{ background: "rgb(36, 36, 36)", borderRadius: 4, padding: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <p style={{ fontSize: 11, color: warmWhite, fontWeight: 500, margin: 0 }}>Fiber Manufacturing</p>
                <span style={{ fontSize: 6, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", padding: "1px 5px", borderRadius: 2, fontFamily: "'Geist Mono', monospace" }}>Tight Market</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {[
                  "Preform manufacturing has an 18–24 month expansion cycle and current capacity is fully booked.",
                  "New capacity coming, but AI demand grows faster — AI clusters use up to 36× more fiber than CPU racks.",
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                    <span style={{ width: 2, height: 2, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 5 }} />
                    <p style={{ fontSize: 10, color: numColor, lineHeight: 1.4, margin: 0, whiteSpace: "nowrap" }}>{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Key takeaways for the featured chain — rendered in the right panel (without last point) */
export const CHAIN_TAKEAWAYS = [
  "The chokepoint is GeCl₄ refining, not germanium ore. Umicore's Belgian facility is the only commercial-scale Western supplier — a single point of failure between mineral supply and AI fiber demand.",
  "Capital cannot close the gap on AI's timeline. Every layer of the chain — recovery, refining, preform manufacturing — has multi-year expansion cycles, and demand is growing faster than capacity can be added.",
  "China holds asymmetric escalation leverage. It controls 60%+ of both germanium and GeCl₄ supply and has already shown willingness to weaponize that position through targeted export controls.",
];

/** Key players for the featured chain */
export const CHAIN_KEY_PLAYERS = ["Umicore", "5N Plus", "Corning", "Yunnan Chihong"];
