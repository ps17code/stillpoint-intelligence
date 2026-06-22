"use client";
import React from "react";

const INTER = "Inter, -apple-system, sans-serif";
const MONO = "'Geist Mono', monospace";

export default function ExplorerPlaceholder({ title, message, onBack }: { title: string; message: string; onBack: () => void }) {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#161414", position: "relative", overflow: "hidden" }}>
      <button
        onClick={onBack}
        style={{ position: "absolute", top: 18, left: 18, display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 12px", cursor: "pointer", color: "rgba(255,255,255,0.55)", fontFamily: MONO, fontSize: 10, transition: "border-color 0.15s, color 0.15s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#ece8e1"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        Back
      </button>

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="5" cy="6" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="12" cy="12" r="2.4" /><circle cx="5.5" cy="19" r="2" /><circle cx="18.5" cy="19" r="2" />
          <line x1="6.5" y1="7" x2="11" y2="11.5" /><line x1="17.5" y1="6" x2="12.6" y2="11" /><line x1="7" y1="17.5" x2="11.5" y2="13" /><line x1="17" y1="17.5" x2="13" y2="13.5" />
        </svg>
        <p style={{ fontFamily: INTER, fontSize: 18, fontWeight: 300, color: "#ece8e1", margin: 0 }}>{title}</p>
        <p style={{ fontFamily: INTER, fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.4)", margin: 0, maxWidth: 360, textAlign: "center", lineHeight: 1.5 }}>{message}</p>
      </div>
    </div>
  );
}
