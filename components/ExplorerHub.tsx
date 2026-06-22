"use client";
import React from "react";

const INTER = "Inter, -apple-system, sans-serif";
const MONO = "'Geist Mono', monospace";
const accent = "#c87a4a";

const VerticalIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 L21 7.5 L12 12 L3 7.5 Z" />
    <path d="M3 12 L12 16.5 L21 12" />
    <path d="M3 16.5 L12 21 L21 16.5" />
  </svg>
);

const NodeIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6.5" y1="7" x2="11" y2="11.5" />
    <line x1="17.5" y1="6" x2="12.5" y2="11" />
    <line x1="7" y1="17.5" x2="11.5" y2="13" />
    <line x1="17" y1="17.5" x2="13" y2="13.5" />
    <circle cx="5" cy="6" r="2.2" />
    <circle cx="19" cy="5" r="2.2" />
    <circle cx="12" cy="12" r="2.6" />
    <circle cx="5.5" cy="19" r="2.2" />
    <circle cx="18.5" cy="19" r="2.2" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="12" cy="12" r="9" />
    <ellipse cx="12" cy="12" rx="4" ry="9" />
    <line x1="3" y1="12" x2="21" y2="12" />
  </svg>
);

export default function ExplorerHub({ onVertical, onNode, onGlobal }: { onVertical: () => void; onNode: () => void; onGlobal: () => void }) {
  const cards: { key: string; title: string; desc: string; icon: React.ReactNode; onClick: () => void }[] = [
    { key: "vertical", title: "Vertical Explorer", desc: "Trace supply chains by frontier technology sector.", icon: <VerticalIcon />, onClick: onVertical },
    { key: "node", title: "Node Explorer", desc: "Explore every company, asset, and material as a connected graph.", icon: <NodeIcon />, onClick: onNode },
    { key: "global", title: "Global Explorer", desc: "See the supply network mapped geographically.", icon: <GlobeIcon />, onClick: onGlobal },
  ];

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#161414", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <p style={{ fontFamily: INTER, fontSize: 11, fontWeight: 300, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: "0 0 14px 0" }}>Stillpoint Intelligence</p>
      <h1 style={{ fontFamily: INTER, fontSize: 26, fontWeight: 300, color: "#ece8e1", margin: "0 0 40px 0", letterSpacing: "0.01em" }}>Choose an explorer</h1>

      <div style={{ display: "flex", gap: 16 }}>
        {cards.map(c => (
          <button
            key={c.key}
            onClick={c.onClick}
            style={{
              width: 230, textAlign: "left", cursor: "pointer",
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10, padding: "22px 20px 24px",
              display: "flex", flexDirection: "column", gap: 12,
              transition: "background 0.18s, border-color 0.18s, transform 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,122,74,0.06)"; e.currentTarget.style.borderColor = "rgba(200,122,74,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <span style={{ color: accent }}>{c.icon}</span>
            <span style={{ fontFamily: INTER, fontSize: 15, fontWeight: 400, color: "#ece8e1" }}>{c.title}</span>
            <span style={{ fontFamily: INTER, fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{c.desc}</span>
            <span style={{ marginTop: 4, fontFamily: MONO, fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase", color: accent, display: "flex", alignItems: "center", gap: 5 }}>
              Open
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
