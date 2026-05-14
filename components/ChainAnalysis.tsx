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
  "Teck Resources": "teck.com", "STL / Gécamines": "stl.tech", "PPM Pure Metals": "",
  "Shin-Etsu": "shinetsu.co.jp", "Sumitomo Electric": "sumitomoelectric.com",
};

const COUNTRY_FLAGS: Record<string, string> = {
  "Umicore": "be", "5N Plus": "ca", "Corning": "us", "Prysmian": "it",
  "YOFC": "cn", "Yunnan Chihong": "cn", "Teck Resources": "ca",
  "STL / Gécamines": "cd", "PPM Pure Metals": "de",
  "Shin-Etsu": "jp", "Sumitomo Electric": "jp",
};

export default function ChainAnalysis() {
  const [activeTab, setActiveTab] = useState<"supply-demand" | "key-players">("supply-demand");

  return (
    <div style={{ background: "rgb(26, 27, 26)", borderRadius: 5, overflow: "hidden", minHeight: 280 }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${border}`, padding: "0 15px" }}>
        {([
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

      <div style={{ padding: 15 }}>
        {/* ── TAB 1: SUPPLY DEMAND ANALYSIS ── */}
        {activeTab === "supply-demand" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <p style={{ fontSize: 13, color: warmWhite, fontWeight: 400, margin: "10px 0 10px 0" }}>
                How much supply do we need and why can't we fill the gap?
              </p>
              <p style={{ fontSize: 11, color: muted, lineHeight: 1.6, margin: "0 0 20px 0" }}>
                All three layers face structural deficits by 2030 — germanium and GeCl₄ are severely constrained, fiber is tight but expandable.
              </p>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Layer", "Supply 2030E", "Demand 2030E", "Gap"].map((h, i) => (
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
        )}

        {/* ── TAB 2: KEY PLAYERS ── */}
        {activeTab === "key-players" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { layer: "Germanium", players: [
                { name: "Yunnan Chihong", desc: "Largest single primary germanium producer globally. Shanghai-listed, state-affiliated." },
                { name: "Umicore", desc: "Western chokepoint — sole commercial GeCl₄ refiner outside China. Also the primary Ge recycler." },
                { name: "Teck Resources", desc: "North America's only commercial germanium feedstock via Red Dog zinc mine. Declining toward 2031." },
              ]},
              { layer: "GeCl₄ Refining", players: [
                { name: "Umicore", desc: "Olen, Belgium facility is the structural chokepoint. Processes ~40-50t Ge/yr, >50% from recycled scrap." },
                { name: "5N Plus", desc: "Second Western Ge refiner. Expanding Utah facility under $18M DOE grant. Pre-commercial on fiber-grade GeCl₄." },
                { name: "PPM Pure Metals", desc: "Europe's second Ge refiner. Smaller scale, focused on IR optics and SiGe markets rather than fiber." },
              ]},
              { layer: "Fiber Manufacturing", players: [
                { name: "Corning", desc: "~40% of Western fiber capacity. Meta signed $6B deal. Running at 95-100% utilization." },
                { name: "Prysmian", desc: "World's largest cable company. 27 plants globally. Expanding for AI datacenter demand." },
                { name: "YOFC", desc: "China's largest fiber producer by volume. Key supplier to domestic AI datacenter buildout." },
              ]},
            ].map((group, gi) => (
              <div key={gi}>
                <p style={{ fontSize: 8, letterSpacing: "0.08em", color: dimmer, textTransform: "uppercase", margin: "0 0 6px 0", fontFamily: "'Geist Mono', monospace" }}>{group.layer}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {group.players.map((player, pi) => {
                    const flag = COUNTRY_FLAGS[player.name];
                    return (
                      <div key={pi} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", background: "rgb(36, 36, 36)", borderRadius: 4 }}>
                        {flag && <img src={`https://flagcdn.com/16x12/${flag}.png`} alt="" style={{ width: 12, height: 9, borderRadius: 1, opacity: 0.7, flexShrink: 0 }} />}
                        <span style={{ fontSize: 11, color: warmWhite, fontWeight: 500, flexShrink: 0, minWidth: 110 }}>{player.name}</span>
                        <p style={{ fontSize: 10, color: numColor, margin: 0, lineHeight: 1.4 }}>{player.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
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
