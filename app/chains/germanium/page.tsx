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
  { name: "Deployment",    desc: "AI datacenter, broadband, submarine",      layerIdx: 3 },
];

const SECTION_IDS = ["chain-raw", "chain-comp", "chain-sub", "chain-eu"];
const NAV_HEIGHT = 36;

function scrollToLayer(layerIdx: number) {
  const el = document.getElementById(SECTION_IDS[layerIdx]);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
  window.scrollTo({ top, behavior: "smooth" });
}

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
    <div style={{ minHeight: "100vh", background: "#0F0F0E", display: "flex", flexDirection: "column" }}>

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

            {/* Body */}
            <p style={{
              ...SYS, fontSize: 13, fontWeight: 300, lineHeight: 1.85,
              color: "rgba(255,255,255,0.3)", maxWidth: 460, margin: 0,
            }}>
              {parseBody(BODY)}
            </p>
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
