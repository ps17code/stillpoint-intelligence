"use client";
import { useState } from "react";
import FullChainMap from "@/components/FullChainMap";

const MONO: React.CSSProperties = { fontFamily: "'Geist Mono', 'Courier New', monospace" };
const SYS: React.CSSProperties  = { fontFamily: "Inter, -apple-system, system-ui, sans-serif" };

// rgba prefix for each layer's tree color (no closing paren)
const CARD_PREFIXES = [
  "rgba(200,168,90,",   // Raw   — warm gold
  "rgba(77,154,184,",   // Comp  — teal
  "rgba(138,122,170,",  // Sub   — purple
  "rgba(200,168,90,",   // EU    — amber
];
const DIM = "rgba(155,168,171,";

function navigateTo(layerIdx: number) {
  const maps = [
    { raw: "Germanium",         comp: null,            sub: null,           eu: null             },
    { raw: "Germanium",         comp: "GeO₂ / GeCl₄", sub: null,           eu: null             },
    { raw: "Germanium",         comp: "GeO₂ / GeCl₄", sub: "Fiber Optics", eu: null             },
    { raw: "Germanium",         comp: "GeO₂ / GeCl₄", sub: "Fiber Optics", eu: "AI Datacenter"  },
  ];
  sessionStorage.setItem("globeSelection", JSON.stringify(maps[layerIdx]));
  window.location.href = "/germanium";
}

function parseBody(text: string) {
  const parts = text.split(/(<bold>[\s\S]*?<\/bold>)/g);
  return parts.map((p, i) =>
    p.startsWith("<bold>") ? (
      <span key={i} style={{ color: "rgba(255,255,255,0.58)", fontWeight: 400 }}>{p.slice(6, -7)}</span>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

const BODY = `Copper can't move data fast enough for AI. Fiber can — but only because germanium doped into the glass core creates the waveguide that carries light. Without it, fiber is just glass. <bold>China controls 60% of global germanium production</bold> and has banned exports to the United States. The west has one major refiner, one recycler, and one new raw source — <bold>all the same company</bold>. AI datacenter buildouts have created a step change in fiber demand — a single GPU rack now requires 16x more fiber than traditional infrastructure — and the supply chain that was already constrained cannot scale fast enough to meet it.`;

interface Card {
  name: string;
  desc: string;
  icon: React.ReactNode;
}

function OreIcon({ prefix }: { prefix: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="6" y="9" width="10" height="9" rx="0.5" stroke={`${prefix}0.2)`} strokeWidth="0.5" transform="rotate(-10 11 13)"/>
      <rect x="17" y="11" width="8" height="7" rx="0.5" stroke={`${prefix}0.14)`} strokeWidth="0.5" transform="rotate(8 21 14)"/>
      <rect x="11" y="19" width="9" height="7" rx="0.5" stroke={`${prefix}0.1)`} strokeWidth="0.5" transform="rotate(-5 15 22)"/>
    </svg>
  );
}

function ChemIcon({ prefix }: { prefix: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <line x1="18" y1="4" x2="18" y2="11" stroke={`${prefix}0.2)`} strokeWidth="0.5"/>
      <line x1="13" y1="4" x2="13" y2="11" stroke={`${prefix}0.2)`} strokeWidth="0.5"/>
      <rect x="10" y="11" width="12" height="19" rx="2" stroke={`${prefix}0.3)`} strokeWidth="0.5"/>
      <circle cx="14" cy="20" r="0.8" fill={`${prefix}0.25)`}/>
      <circle cx="17" cy="17" r="0.6" fill={`${prefix}0.2)`}/>
      <circle cx="15" cy="24" r="0.7" fill={`${prefix}0.18)`}/>
      <circle cx="19" cy="22" r="0.5" fill={`${prefix}0.2)`}/>
      <circle cx="16" cy="14" r="0.5" fill={`${prefix}0.15)`}/>
      <path d="M13,18 Q16,16 19,18" stroke={`${prefix}0.12)`} strokeWidth="0.5"/>
      <path d="M12.5,21 Q16,19 19.5,21" stroke={`${prefix}0.1)`} strokeWidth="0.5"/>
    </svg>
  );
}

function FiberIcon({ prefix }: { prefix: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="14" stroke={`${prefix}0.08)`} strokeWidth="0.5"/>
      <circle cx="18" cy="18" r="9"  stroke={`${prefix}0.06)`} strokeWidth="0.5"/>
      <circle cx="18" cy="18" r="2.5" fill={`${prefix}0.12)`}/>
      <circle cx="18" cy="18" r="2.5" stroke={`${prefix}0.18)`} strokeWidth="0.5"/>
    </svg>
  );
}

function PulseIcon({ prefix }: { prefix: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <line x1="4" y1="18" x2="32" y2="18" stroke={`${prefix}0.12)`} strokeWidth="0.5"/>
      <circle cx="8"  cy="18" r="3"   fill={`${prefix}0.10)`}/>
      <circle cx="15" cy="18" r="2.2" fill={`${prefix}0.07)`}/>
      <circle cx="21" cy="18" r="1.6" fill={`${prefix}0.05)`}/>
      <circle cx="26" cy="18" r="1"   fill={`${prefix}0.03)`}/>
    </svg>
  );
}

const CARDS_META = [
  { name: "Germanium",     desc: "Coal and zinc ore to refined powder",      layerIdx: 0 },
  { name: "GeO₂ / GeCl₄", desc: "Chemical conversion for fiber doping",     layerIdx: 1 },
  { name: "Fiber cable",   desc: "Strand to cable assembly",                 layerIdx: 2 },
  { name: "Deployed cable", desc: "Datacenter, terrestrial, subsea",           layerIdx: 3 },
];

const SECTION_IDS = ["chain-raw", "chain-comp", "chain-sub", "chain-eu"];
const NAV_HEIGHT = 36;

function scrollToLayer(layerIdx: number) {
  const el = document.getElementById(SECTION_IDS[layerIdx]);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
  window.scrollTo({ top, behavior: "smooth" });
}

const COMPANY_LINKS: Record<string, string> = {
  "Corning": "/input/fiber-optic-cable#corning",
  "Umicore": "/input/fiber-optic-cable#umicore",
  "Germanium": "/input/germanium",
  "Rosendahl Nextrom": "/input/fiber-optic-cable#rosendahl-nextrom",
  "5N Plus": "/input/fiber-optic-cable#5n-plus",
  "Prysmian": "/input/fiber-optic-cable#prysmian",
  "DRC / G\u00e9camines": "/input/germanium#drc-gecamines",
  "Hollow-core fiber": "/input/fiber-optic-cable#hcf",
  "YOFC": "/input/fiber-optic-cable#yofc",
  "Relativity Networks": "/input/fiber-optic-cable#relativity-networks",
};

export default function GermaniumChainPage() {
  const [hovered, setHovered]         = useState<number | null>(null);
  const [hoverExplore, setHoverExplore] = useState(false);

  function icon(i: number, prefix: string) {
    if (i === 0) return <OreIcon prefix={prefix} />;
    if (i === 1) return <ChemIcon prefix={prefix} />;
    if (i === 2) return <FiberIcon prefix={prefix} />;
    return <PulseIcon prefix={prefix} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0F0F0E", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 36,
        background: "#111110",
        borderBottom: "0.5px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center",
        zIndex: 100, padding: "0 20px",
      }}>
        <button
          onClick={() => { window.location.href = "/"; }}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <span style={{ ...SYS, fontSize: 11, fontWeight: 300, letterSpacing: "0.04em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>Stillpoint</span>
          <span style={{ display: "inline-block", width: 5 }} />
          <span style={{ ...SYS, fontSize: 11, fontWeight: 200, letterSpacing: "0.04em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" }}>Intelligence</span>
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ ...MONO, fontSize: 8, color: "rgba(255,255,255,0.14)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Germanium → Fiber Chain
        </span>
      </div>

      {/* ── MAIN ────────────────────────────────────────────────────── */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center",
        paddingTop: 36, paddingBottom: 28,
      }}>
        <div style={{ display: "flex", width: "100%", maxWidth: 1100, margin: "0 auto" }}>

          {/* LEFT: thesis */}
          <div style={{
            flex: 1, maxWidth: 680,
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "60px 20px 60px 56px",
          }}>
            {/* Chain label */}
            <div style={{
              ...MONO, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase",
              color: "rgba(155,168,171,0.3)", marginBottom: 20,
            }}>
              Germanium → Fiber Chain
            </div>

            {/* Headline */}
            <div style={{
              ...SYS, fontSize: 26, fontWeight: 500, lineHeight: 1.4,
              letterSpacing: "-0.3px", color: "rgba(255,255,255,0.9)",
              maxWidth: 480, marginBottom: 22,
            }}>
              Every AI model runs on infrastructure connected by fiber optic cable. Every fiber optic cable depends on germanium.
            </div>

            {/* Chain thesis */}
            <div style={{ marginTop: 32 }}>
              <p style={{ fontSize: 9, letterSpacing: "0.1em", color: "#555", margin: "0 0 8px 0" }}>CHAIN THESIS</p>
              <p style={{ ...SYS, fontSize: 14, color: "#ece8e1", lineHeight: 1.65, margin: 0, maxWidth: 480 }}>
                The germanium-to-fiber chain is constrained at three independent points: raw material supply (83% Chinese, under export licensing), chemical conversion (one western facility), and preform equipment (one supplier, 18-24 month backlogs). The constraints compound at each layer. The structural deficit cannot close before 2027.
              </p>
            </div>
          </div>

          {/* RIGHT: layer cards */}
          <div style={{
            width: 340, flexShrink: 0,
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "48px 36px 0 0",
          }}>
            {CARDS_META.map((card, i) => {
              const isHovered = hovered === i;
              const cp = CARD_PREFIXES[i];
              const prefix = isHovered ? cp : DIM;

              const bg        = isHovered ? `${cp}0.07)` : "rgba(255,255,255,0.015)";
              const border    = isHovered ? `0.5px solid ${cp}0.3)` : "0.5px solid rgba(255,255,255,0.04)";
              const nameColor = isHovered ? `${cp}0.9)` : "rgba(255,255,255,0.4)";
              const descColor = isHovered ? `${cp}0.35)` : "rgba(255,255,255,0.12)";
              const arrowColor = isHovered ? `${cp}0.5)` : "rgba(255,255,255,0.06)";

              return (
                <div key={card.name}>
                  {i > 0 && (
                    <div style={{
                      width: "0.5px", height: 20,
                      background: "rgba(255,255,255,0.08)",
                      margin: "0 auto",
                    }} />
                  )}
                  <div
                    onClick={() => scrollToLayer(card.layerIdx)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "12px 16px",
                      background: bg,
                      border,
                      borderRadius: 10,
                      cursor: "pointer",
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                  >
                    {/* Icon */}
                    <div style={{ width: 36, height: 36, flexShrink: 0 }}>
                      {icon(i, prefix)}
                    </div>

                    {/* Name + desc */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...SYS, fontSize: 12, fontWeight: 500, color: nameColor, transition: "color 0.15s" }}>
                        {card.name}
                      </div>
                      <div style={{ ...MONO, fontSize: 8, color: descColor, marginTop: 3, transition: "color 0.15s" }}>
                        {card.desc}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div style={{ ...MONO, fontSize: 13, color: arrowColor, flexShrink: 0, transition: "color 0.15s" }}>
                      ↓
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Explore full chain */}
            <div
              onClick={() => navigateTo(0)}
              onMouseEnter={() => setHoverExplore(true)}
              onMouseLeave={() => setHoverExplore(false)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                marginTop: 12, padding: "14px 0",
                cursor: "pointer",
              }}
            >
              <span style={{
                ...MONO, fontSize: 9, letterSpacing: "0.04em",
                color: hoverExplore ? "rgba(200,168,90,0.6)" : "rgba(255,255,255,0.2)",
                transition: "color 0.15s",
              }}>
                Explore full chain
              </span>
              <span style={{
                ...MONO, fontSize: 12,
                color: hoverExplore ? "rgba(200,168,90,0.4)" : "rgba(255,255,255,0.08)",
                transition: "color 0.15s",
              }}>
                →
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── NEW SECTIONS ───────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 56px 0" }}>

        {/* Supply → Demand */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", margin: "0 0 20px 0" }}>SUPPLY → DEMAND</p>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, background: "#1a1816", border: "1px solid #252220", borderRadius: 10, padding: "20px 22px" }}>
              <p style={{ fontSize: 9, letterSpacing: "0.08em", color: "#555", margin: "0 0 10px 0" }}>SUPPLY</p>
              <p style={{ ...SYS, fontSize: 22, fontWeight: 500, color: "#ece8e1", margin: "0 0 8px 0" }}>~230t / yr</p>
              <p style={{ ...SYS, fontSize: 11.5, color: "#706a60", lineHeight: 1.6, margin: 0 }}>Global germanium supply. Byproduct of zinc and coal — cannot scale independently. ~130t Chinese (export controlled), ~11t Russian (sanctioned), ~26t western accessible.</p>
            </div>
            <div style={{ flex: 1, background: "#1a1816", border: "1px solid #252220", borderRadius: 10, padding: "20px 22px" }}>
              <p style={{ fontSize: 9, letterSpacing: "0.08em", color: "#555", margin: "0 0 10px 0" }}>DEMAND</p>
              <p style={{ ...SYS, fontSize: 22, fontWeight: 500, color: "#ece8e1", margin: "0 0 8px 0" }}>~246t / yr</p>
              <p style={{ ...SYS, fontSize: 11.5, color: "#706a60", lineHeight: 1.6, margin: 0 }}>Projected by 2027. Fiber optics (~40%), IR optics (~25%), electronics/solar (~20%), defense (~15%). Fiber demand alone requires ~103t at current growth rates.</p>
            </div>
            <div style={{ flex: 1, background: "#161a1e", border: "1px solid rgba(106,154,184,0.2)", borderRadius: 10, padding: "20px 22px" }}>
              <p style={{ fontSize: 9, letterSpacing: "0.08em", color: "#6a9ab8", margin: "0 0 10px 0", opacity: 0.7 }}>GAP</p>
              <p style={{ ...SYS, fontSize: 22, fontWeight: 500, color: "#6a9ab8", margin: "0 0 8px 0" }}>~16t</p>
              <p style={{ ...SYS, fontSize: 11.5, color: "#706a60", lineHeight: 1.6, margin: 0 }}>Shortfall driven by fiber demand alone. Translates to 130M fiber strand-km that cannot be produced. Western-accessible supply of ~26t cannot cover the gap without Chinese cooperation.</p>
            </div>
          </div>
        </div>

        {/* Key Catalysts */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", margin: "0 0 20px 0" }}>KEY CATALYSTS</p>
          <div style={{ background: "#1a1816", border: "1px solid #252220", borderRadius: 10, padding: "24px 28px" }}>
            <div style={{ position: "relative" as const, marginBottom: 8 }}>
              <div style={{ position: "absolute" as const, top: 8, left: 0, right: 0, height: 1, background: "#252220" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {[
                  { date: "Q4 2026", label: "5N Plus facility decision", highlight: true },
                  { date: "NOV 2026", label: "China US export ban deadline", highlight: true },
                  { date: "2027", label: "Corning Hickory ramp begins", highlight: false },
                  { date: "2027", label: "DRC germanium ramp target", highlight: false },
                  { date: "2027-28", label: "New preform capacity online", highlight: false },
                  { date: "2028+", label: "HCF cost curve viability", highlight: false },
                ].map((event, i) => (
                  <div key={i} style={{ textAlign: "center" as const, position: "relative" as const, flex: 1 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: event.highlight ? "#6a9ab8" : "#555", margin: "4px auto 12px", position: "relative" as const, zIndex: 1 }} />
                    <p style={{ fontSize: 9, letterSpacing: "0.06em", color: event.highlight ? "#ece8e1" : "#555", fontWeight: 500, margin: "0 0 4px 0" }}>{event.date}</p>
                    <p style={{ fontSize: 10, color: event.highlight ? "#a09888" : "#4a4540", lineHeight: 1.4, margin: 0 }}>{event.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Where The Money Is */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", margin: "0 0 20px 0" }}>WHERE THE MONEY IS</p>
          <div style={{ display: "flex", flexDirection: "column" as const }}>
            {([
              { tier: "CHOKEPOINT HOLDERS", items: [
                { name: "Corning", tag: "GLW", desc: "40% fiber market share. Sold out through 2026." },
                { name: "Umicore", tag: "UMI.BR", desc: "Sole western GeCl\u2084 converter. 3.5x price arbitrage." },
                { name: "Germanium", tag: "Commodity", desc: "$1,500 \u2192 $7,000+/kg. Supply fixed at ~230t." },
                { name: "Rosendahl Nextrom", tag: "Private", desc: "Preform equipment monopoly. 18-24mo backlogs." },
              ]},
              { tier: "CAPACITY BUILDERS", items: [
                { name: "5N Plus", tag: "VNP.TSX", desc: "Facility decision Nov 2026. Binary catalyst." },
                { name: "Prysmian", tag: "PRY.MI", desc: "Largest cable company. Vertically integrated." },
                { name: "DRC / G\u00e9camines", tag: "Offtake", desc: "30% Ge supply target. Exclusive to Umicore." },
              ]},
              { tier: "TECHNOLOGY", items: [
                { name: "Hollow-core fiber", tag: "Thematic", desc: "Eliminates germanium. Microsoft deploying on Azure." },
                { name: "YOFC", tag: "6869.HK", desc: "World-record HCF in lab. Dual conventional + HCF exposure." },
                { name: "Relativity Networks", tag: "Startup", desc: "$10.7M raised. Manufacturing with Prysmian." },
              ]},
            ] as { tier: string; items: { name: string; tag: string; desc: string }[] }[]).map((tier, ti) => (
              <div key={ti}>
                {ti > 0 && <div style={{ borderTop: "1px solid #252220", margin: "12px 0" }} />}
                <p style={{ fontSize: 9, letterSpacing: "0.08em", color: "#555", margin: "0 0 8px 0" }}>{tier.tier}</p>
                {tier.items.map((item, ii) => (
                  <div key={ii} style={{ display: "flex", alignItems: "baseline", gap: 8, padding: "5px 0" }}>
                    <a href={COMPANY_LINKS[item.name] || "#"} style={{ fontSize: 12, color: "#ece8e1", fontWeight: 500, textDecoration: "none", margin: 0, minWidth: 140, flexShrink: 0, cursor: "pointer" }} onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }} onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}>{item.name}</a>
                    <p style={{ fontSize: 10, color: ["Private", "Commodity", "Thematic", "Startup", "Offtake"].includes(item.tag) ? "#4a4540" : "#6a9ab8", margin: 0, minWidth: 60, flexShrink: 0 }}>{item.tag}</p>
                    <p style={{ ...SYS, fontSize: 11, color: "#706a60", margin: 0 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            ))}
            <div style={{ borderTop: "1px solid #252220", marginTop: 16, paddingTop: 16, display: "flex", gap: 12 }}>
              <a href="/input/germanium" style={{ ...MONO, fontSize: 11, color: "#6a9ab8", textDecoration: "none", padding: "6px 14px", borderRadius: 5, border: "1px solid #252220" }}>Germanium → full analysis</a>
              <a href="/input/fiber-optic-cable" style={{ ...MONO, fontSize: 11, color: "#6a9ab8", textDecoration: "none", padding: "6px 14px", borderRadius: 5, border: "1px solid #252220" }}>Fiber optic cable → full analysis</a>
            </div>
          </div>
        </div>

      </div>

      {/* ── FULL CHAIN MAP ───────────────────────────────────────────── */}
      <FullChainMap />

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <div style={{
        height: 28, background: "#0A0A09",
        borderTop: "0.5px solid rgba(255,255,255,0.03)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", flexShrink: 0,
      }}>
        <span style={{ ...MONO, fontSize: 7, color: "rgba(255,255,255,0.06)" }}>
          Stillpoint Intelligence · Proprietary · Not for distribution
        </span>
        <span style={{ ...MONO, fontSize: 7, color: "rgba(255,255,255,0.06)" }}>
          4 layers · 32 nodes · Updated Apr 2026
        </span>
      </div>

    </div>
  );
}
