"use client";
import React, { useState } from "react";

const amber = "#c87a4a";
const amberBg = "rgba(200, 122, 74, 0.06)";
const warmWhite = "#ece8e1";
const muted = "#706a60";
const dimmer = "#4a4540";
const numColor = "rgb(160, 152, 136)";
const border = "rgba(255,255,255,0.04)";
const tabInactive = "#555";

const PLAYER_DOMAINS: Record<string, string> = {
  "Umicore": "umicore.com", "5N Plus": "5nplus.com", "Corning": "corning.com",
  "Prysmian": "prysmian.com", "YOFC": "yofc.com", "Yunnan Chihong": "",
};

export default function ChainAnalysis() {
  const [activeTab, setActiveTab] = useState<"takeaways" | "supply-demand" | "key-players">("takeaways");

  return (
    <div style={{ background: "rgb(26, 27, 26)", borderRadius: 5, overflow: "hidden" }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${border}`, padding: "0 15px" }}>
        {([
          { id: "takeaways", label: "Key Takeaways" },
          { id: "supply-demand", label: "Supply Demand Analysis" },
          { id: "key-players", label: "Key Players" },
        ] as const).map((tab, ti) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: ti === 0 ? "10px 14px 10px 0" : "10px 14px",
                fontSize: 9,
                color: isActive ? warmWhite : tabInactive,
                cursor: "pointer",
                borderBottom: isActive ? `1.5px solid ${warmWhite}` : "1.5px solid transparent",
                transition: "color 0.15s, border-color 0.15s",
                marginBottom: -1,
                fontFamily: "'Geist Mono', monospace",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = muted; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = tabInactive; }}
            >
              {tab.label}
            </div>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ padding: 15 }}>

        {/* ── TAB 1: KEY TAKEAWAYS ── */}
        {activeTab === "takeaways" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {CHAIN_TAKEAWAYS.map((t, i) => (
              <div key={i} style={{ background: "rgb(36, 36, 36)", borderRadius: 4, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 9, color: dimmer, fontFamily: "'Geist Mono', monospace" }}>{String(i + 1).padStart(2, "0")}</span>
                <p style={{ fontSize: 11, color: numColor, lineHeight: 1.6, margin: 0 }}>{t}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 2: SUPPLY DEMAND ANALYSIS ── */}
        {activeTab === "supply-demand" && (
          <div>
            <p style={{ fontSize: 13, color: warmWhite, fontWeight: 400, margin: "0 0 6px 0", fontFamily: "'Instrument Serif', serif" }}>
              How much supply do we need and why can't we fill the gap?
            </p>
            <p style={{ fontSize: 11, color: muted, lineHeight: 1.6, margin: "0 0 16px 0" }}>
              All three layers face structural deficits by 2030 — germanium and GeCl₄ are severely constrained, fiber is tight but expandable.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Supply/Demand Table */}
              <div>
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

              {/* Constraint Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {[
                  { name: "Germanium", tag: "Structural Bottleneck", tagColor: amber, bullets: [
                    "Byproduct of zinc and coal mining — only a few deposits globally host commercially recoverable concentrations.",
                    "Expansion requires major capex in zinc-smelter recovery infrastructure with multi-year build timelines.",
                  ]},
                  { name: "GeCl₄ Purification", tag: "Hidden Industrial Chokepoint", tagColor: amber, bullets: [
                    "8N+ purity refining with complex chemistry and multi-year customer qualification cycles.",
                    "Umicore (Belgium) is the only commercial-scale Western supplier serving the fiber market.",
                  ]},
                  { name: "Fiber Manufacturing", tag: "Tight Market", tagColor: "rgba(255,255,255,0.4)", bullets: [
                    "Preform manufacturing has an 18–24 month expansion cycle and current capacity is fully booked.",
                    "New capacity coming, but AI demand grows faster — AI clusters use up to 36× more fiber than CPU racks.",
                  ]},
                ].map((card, ci) => (
                  <div key={ci} style={{ background: "rgb(36, 36, 36)", borderRadius: 4, padding: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <p style={{ fontSize: 11, color: warmWhite, fontWeight: 500, margin: 0 }}>{card.name}</p>
                      <span style={{ fontSize: 6, letterSpacing: "0.06em", textTransform: "uppercase", color: card.tagColor, background: card.tagColor === amber ? amberBg : "rgba(255,255,255,0.04)", border: `0.5px solid ${card.tagColor === amber ? "rgba(200,122,74,0.3)" : "rgba(255,255,255,0.1)"}`, padding: "1px 5px", borderRadius: 2, fontFamily: "'Geist Mono', monospace" }}>{card.tag}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {card.bullets.map((b, bi) => (
                        <div key={bi} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                          <span style={{ width: 2, height: 2, borderRadius: "50%", background: "#3a3835", flexShrink: 0, marginTop: 5 }} />
                          <p style={{ fontSize: 10, color: numColor, lineHeight: 1.4, margin: 0, whiteSpace: "nowrap" }}>{b}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: KEY PLAYERS ── */}
        {activeTab === "key-players" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { name: "Umicore", layer: "GeCl₄ Refining", desc: "Sole Western commercial-scale GeCl₄ supplier. Olen, Belgium facility is the structural chokepoint." },
              { name: "Yunnan Chihong", layer: "Germanium Mining", desc: "Largest single primary germanium producer globally. Shanghai-listed, state-affiliated." },
              { name: "Corning", layer: "Fiber Manufacturing", desc: "~40% of Western fiber capacity. Meta signed a $6B multiyear agreement in January 2026." },
              { name: "5N Plus", layer: "Germanium Refining", desc: "Second Western germanium refiner. AZUR Space subsidiary makes satellite solar cells from Ge wafers." },
              { name: "Prysmian", layer: "Fiber Manufacturing", desc: "World's largest cable company. 27 plants globally, expanding capacity for AI datacenter demand." },
              { name: "YOFC", layer: "Fiber Manufacturing", desc: "China's largest fiber producer by volume. Key supplier to domestic AI datacenter buildout." },
            ].map((player, i) => {
              const domain = PLAYER_DOMAINS[player.name];
              return (
                <div key={i} style={{ background: "rgb(36, 36, 36)", borderRadius: 4, padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 3, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {domain ? (
                        <img src={`https://logo.clearbit.com/${domain}`} alt="" style={{ width: 14, height: 14, borderRadius: 2 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <span style={{ fontSize: 9, color: "#706a60" }}>{player.name.charAt(0)}</span>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: warmWhite, fontWeight: 500 }}>{player.name}</span>
                  </div>
                  <p style={{ fontSize: 8, color: amber, margin: "0 0 4px 0", letterSpacing: "0.04em", textTransform: "uppercase", fontFamily: "'Geist Mono', monospace" }}>{player.layer}</p>
                  <p style={{ fontSize: 10, color: numColor, lineHeight: 1.5, margin: 0 }}>{player.desc}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export const CHAIN_TAKEAWAYS = [
  "The chokepoint is GeCl₄ refining, not germanium ore. Umicore's Belgian facility is the only commercial-scale Western supplier — a single point of failure between mineral supply and AI fiber demand.",
  "Capital cannot close the gap on AI's timeline. Recovery, refining, and preform manufacturing all have multi-year expansion cycles, and demand is growing faster than capacity can be added.",
  "China holds asymmetric escalation leverage. Controls 60%+ of both germanium and GeCl₄ supply and has weaponized that position through targeted export controls.",
];

export const CHAIN_KEY_PLAYERS = ["Umicore", "5N Plus", "Corning", "Yunnan Chihong"];
