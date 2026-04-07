"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

const MONO: React.CSSProperties = { fontFamily: "'Geist Mono', 'Courier New', monospace" };
const SYS: React.CSSProperties = { fontFamily: "Inter, -apple-system, system-ui, sans-serif" };

interface Chain {
  name: string;
  desc: string;
  live: boolean;
  href: string;
  icon: React.ReactNode;
}

interface Domain {
  name: string;
  dot: string;
  count: string;
  chains: Chain[];
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const GermaniumIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="2" y="4" width="8" height="6" rx="0.5" fill="none" stroke="rgba(196,164,108,0.3)" strokeWidth="0.5" transform="rotate(-8 6 7)" />
    <rect x="11" y="5" width="6" height="5" rx="0.5" fill="none" stroke="rgba(196,164,108,0.2)" strokeWidth="0.5" transform="rotate(5 14 7)" />
    <rect x="7" y="11" width="7" height="4" rx="0.5" fill="none" stroke="rgba(196,164,108,0.15)" strokeWidth="0.5" />
  </svg>
);
const CoilIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <ellipse cx="12" cy="7" rx="7" ry="2.5" fill="none" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5" />
    <ellipse cx="12" cy="12" rx="7" ry="2.5" fill="none" stroke="rgba(155,168,171,0.09)" strokeWidth="0.5" />
    <ellipse cx="12" cy="17" rx="7" ry="2.5" fill="none" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5" />
    <line x1="5" y1="7" x2="5" y2="17" stroke="rgba(155,168,171,0.05)" strokeWidth="0.5" />
    <line x1="19" y1="7" x2="19" y2="17" stroke="rgba(155,168,171,0.05)" strokeWidth="0.5" />
  </svg>
);
const TransceiverIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="4" y="7" width="16" height="10" rx="1" fill="none" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5" />
    <circle cx="16" cy="12" r="2.5" fill="none" stroke="rgba(155,168,171,0.09)" strokeWidth="0.5" />
  </svg>
);
const AtomIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <ellipse cx="12" cy="12" rx="9" ry="4" fill="none" stroke="rgba(155,168,171,0.1)" strokeWidth="0.5" transform="rotate(0 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="4" fill="none" stroke="rgba(155,168,171,0.08)" strokeWidth="0.5" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="4" fill="none" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5" transform="rotate(120 12 12)" />
    <circle cx="12" cy="12" r="1.5" fill="rgba(155,168,171,0.1)" />
  </svg>
);
const SolarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="4" y="6" width="16" height="12" rx="0.5" fill="none" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5" transform="rotate(-10 12 12)" />
    <line x1="4" y1="10" x2="20" y2="10" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5" transform="rotate(-10 12 12)" />
    <line x1="4" y1="14" x2="20" y2="14" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5" transform="rotate(-10 12 12)" />
    <line x1="10" y1="6" x2="10" y2="18" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5" transform="rotate(-10 12 12)" />
    <line x1="14" y1="6" x2="14" y2="18" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5" transform="rotate(-10 12 12)" />
  </svg>
);
const TurbineIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="1.5" fill="rgba(155,168,171,0.1)" />
    <line x1="12" y1="12" x2="12" y2="3" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5" />
    <line x1="12" y1="12" x2="4" y2="18" stroke="rgba(155,168,171,0.1)" strokeWidth="0.5" />
    <line x1="12" y1="12" x2="20" y2="18" stroke="rgba(155,168,171,0.08)" strokeWidth="0.5" />
  </svg>
);
const StackedEllipseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <ellipse cx="12" cy="8" rx="7" ry="3" fill="none" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5" />
    <ellipse cx="12" cy="12" rx="7" ry="3" fill="none" stroke="rgba(155,168,171,0.09)" strokeWidth="0.5" />
    <ellipse cx="12" cy="16" rx="7" ry="3" fill="none" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5" />
  </svg>
);
const BatteryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="5" y="7" width="14" height="10" rx="1" fill="none" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5" />
    <rect x="19" y="10" width="2" height="4" rx="0.5" fill="none" stroke="rgba(155,168,171,0.08)" strokeWidth="0.5" />
    <line x1="8" y1="10" x2="8" y2="14" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5" />
    <line x1="11" y1="10" x2="11" y2="14" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5" />
  </svg>
);
const NestedDiamondIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="6" y="6" width="12" height="12" rx="0.5" fill="none" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5" transform="rotate(45 12 12)" />
    <rect x="8.5" y="8.5" width="7" height="7" rx="0.5" fill="none" stroke="rgba(155,168,171,0.08)" strokeWidth="0.5" transform="rotate(45 12 12)" />
  </svg>
);
const ConcentricCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5" />
    <circle cx="12" cy="12" r="6" fill="none" stroke="rgba(155,168,171,0.09)" strokeWidth="0.5" />
    <circle cx="12" cy="12" r="3" fill="none" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5" />
  </svg>
);
const CapacitorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="6" y="5" width="12" height="14" rx="1" fill="none" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5" />
    <line x1="9" y1="8" x2="9" y2="16" stroke="rgba(155,168,171,0.08)" strokeWidth="0.5" />
    <line x1="12" y1="8" x2="12" y2="16" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5" />
    <line x1="15" y1="8" x2="15" y2="16" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5" />
  </svg>
);
const StackedRectIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="5" y="5" width="14" height="3" rx="0.5" fill="none" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5" />
    <rect x="5" y="10" width="14" height="3" rx="0.5" fill="none" stroke="rgba(155,168,171,0.09)" strokeWidth="0.5" />
    <rect x="5" y="15" width="14" height="3" rx="0.5" fill="none" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5" />
  </svg>
);
const DropletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M12 4 C12 4 6 12 6 15.5 C6 18.8 8.7 21 12 21 C15.3 21 18 18.8 18 15.5 C18 12 12 4 12 4Z" fill="none" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5" />
  </svg>
);
const FinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="4" y="18" width="16" height="2" rx="0.5" fill="none" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5" />
    <line x1="6" y1="18" x2="6" y2="6" stroke="rgba(155,168,171,0.1)" strokeWidth="0.5" />
    <line x1="9" y1="18" x2="9" y2="6" stroke="rgba(155,168,171,0.08)" strokeWidth="0.5" />
    <line x1="12" y1="18" x2="12" y2="6" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5" />
    <line x1="15" y1="18" x2="15" y2="6" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5" />
    <line x1="18" y1="18" x2="18" y2="6" stroke="rgba(155,168,171,0.05)" strokeWidth="0.5" />
  </svg>
);
const CircleWaveIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8" fill="none" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5" />
    <path d="M6 12 Q9 9 12 12 Q15 15 18 12" fill="none" stroke="rgba(155,168,171,0.08)" strokeWidth="0.5" />
  </svg>
);
const IBeamIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <line x1="4" y1="6" x2="20" y2="6" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5" />
    <line x1="4" y1="18" x2="20" y2="18" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5" />
    <line x1="12" y1="6" x2="12" y2="18" stroke="rgba(155,168,171,0.1)" strokeWidth="0.5" />
    <line x1="8" y1="12" x2="16" y2="12" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5" />
    <line x1="6" y1="6" x2="6" y2="18" stroke="rgba(155,168,171,0.05)" strokeWidth="0.5" />
    <line x1="18" y1="6" x2="18" y2="18" stroke="rgba(155,168,171,0.05)" strokeWidth="0.5" />
  </svg>
);
const LayeredRectIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="4" y="14" width="16" height="6" rx="0.5" fill="none" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5" />
    <rect x="5" y="10" width="14" height="4" rx="0.5" fill="none" stroke="rgba(155,168,171,0.08)" strokeWidth="0.5" />
    <rect x="6" y="6" width="12" height="4" rx="0.5" fill="none" stroke="rgba(155,168,171,0.05)" strokeWidth="0.5" />
  </svg>
);

// ── Domain + Chain data ───────────────────────────────────────────────────────

const DOMAINS: Domain[] = [
  {
    name: "Connectivity", dot: "rgba(100,200,140,0.35)", count: "3 chains",
    chains: [
      { name: "Germanium → Fiber", desc: "Ore to AI datacenter cable", live: true, href: "/chains/germanium", icon: <GermaniumIcon /> },
      { name: "Copper → Interconnects", desc: "Power distribution cabling", live: false, href: "#", icon: <CoilIcon /> },
      { name: "Indium → Transceivers", desc: "Optical network modules", live: false, href: "#", icon: <TransceiverIcon /> },
    ],
  },
  {
    name: "Power", dot: "rgba(196,164,108,0.35)", count: "5 chains",
    chains: [
      { name: "Uranium → Nuclear", desc: "SMR and grid-scale power", live: false, href: "#", icon: <AtomIcon /> },
      { name: "Silicon → Solar", desc: "Panels and utility farms", live: false, href: "#", icon: <SolarIcon /> },
      { name: "Rare Earths → Wind", desc: "Turbine generators", live: false, href: "#", icon: <TurbineIcon /> },
      { name: "Copper → Grid", desc: "Transformers and transmission", live: false, href: "#", icon: <StackedEllipseIcon /> },
      { name: "Lithium → Backup", desc: "UPS battery systems", live: false, href: "#", icon: <BatteryIcon /> },
    ],
  },
  {
    name: "Compute", dot: "rgba(100,150,200,0.35)", count: "4 chains",
    chains: [
      { name: "Gallium → Chips", desc: "GaN power electronics", live: false, href: "#", icon: <NestedDiamondIcon /> },
      { name: "Neon → Lithography", desc: "EUV laser gas", live: false, href: "#", icon: <ConcentricCircleIcon /> },
      { name: "Tantalum → Capacitors", desc: "Server board components", live: false, href: "#", icon: <CapacitorIcon /> },
      { name: "Cobalt → HBM", desc: "High bandwidth memory", live: false, href: "#", icon: <StackedRectIcon /> },
    ],
  },
  {
    name: "Cooling", dot: "rgba(100,180,210,0.35)", count: "3 chains",
    chains: [
      { name: "Water → Cooling", desc: "Datacenter cooling systems", live: false, href: "#", icon: <DropletIcon /> },
      { name: "Aluminum → Heat Sinks", desc: "Thermal management", live: false, href: "#", icon: <FinIcon /> },
      { name: "Fluorine → Refrigerants", desc: "Chiller systems", live: false, href: "#", icon: <CircleWaveIcon /> },
    ],
  },
  {
    name: "Physical", dot: "rgba(155,168,171,0.25)", count: "2 chains",
    chains: [
      { name: "Steel → Structure", desc: "Datacenter frame and racking", live: false, href: "#", icon: <IBeamIcon /> },
      { name: "Concrete → Foundation", desc: "Slab and structure base", live: false, href: "#", icon: <LayeredRectIcon /> },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

const PANEL_W = 280;

export default function ChainDirectory() {
  const [open, setOpen] = useState(true);
  const [expandedDomain, setExpandedDomain] = useState<number | null>(null);
  const [hoverCollapsed, setHoverCollapsed] = useState(false);
  const [hoverClose, setHoverClose] = useState(false);
  const [hoverDomain, setHoverDomain] = useState<number | null>(null);
  const [hoverChain, setHoverChain] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const collapse = useCallback(() => {
    setOpen(false);
    setExpandedDomain(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) collapse();
    }
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open, collapse]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") collapse(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, collapse]);

  // ── Collapsed ───────────────────────────────────────────────────────────────
  if (!open) {
    return (
      <div
        ref={panelRef}
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHoverCollapsed(true)}
        onMouseLeave={() => setHoverCollapsed(false)}
        style={{
          position: "fixed", bottom: 14, right: 14, zIndex: 200,
          width: PANEL_W, boxSizing: "border-box",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "10px 14px",
          background: hoverCollapsed ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
          border: `0.5px solid ${hoverCollapsed ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 9, cursor: "pointer",
          transition: "background 0.15s, border-color 0.15s",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 1.5, flexShrink: 0 }}>
          <div style={{ width: 11, height: 0.5, background: "rgba(255,255,255,0.6)" }} />
          <div style={{ width: 8, height: 0.5, background: "rgba(255,255,255,0.6)" }} />
          <div style={{ width: 5, height: 0.5, background: "rgba(255,255,255,0.6)" }} />
        </div>
        <span style={{ ...MONO, fontSize: 10, color: "rgba(255,255,255,0.75)", letterSpacing: "0.03em" }}>Chains</span>
        <span style={{ ...MONO, fontSize: 8, color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: 3 }}>17</span>
      </div>
    );
  }

  // ── Expanded (single panel with accordion domains) ──────────────────────────
  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed", bottom: 14, right: 14, zIndex: 200,
        width: PANEL_W, maxHeight: 400,
        background: "rgba(12,12,11,0.97)",
        border: "0.5px solid rgba(255,255,255,0.19)",
        borderRadius: 9, overflow: "hidden",
        display: "flex", flexDirection: "column",
        animation: "cdPanelIn 0.2s ease",
      }}
    >
      <style>{`
        @keyframes cdPanelIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cdChainIn { from { opacity:0; } to { opacity:1; } }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "9px 12px 7px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0, borderBottom: "0.5px solid rgba(255,255,255,0.05)",
      }}>
        <span style={{ ...MONO, fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>CHAINS</span>
        <button
          onClick={collapse}
          onMouseEnter={() => setHoverClose(true)}
          onMouseLeave={() => setHoverClose(false)}
          style={{
            background: hoverClose ? "rgba(255,255,255,0.06)" : "none",
            border: "none", cursor: "pointer", ...MONO, fontSize: 9,
            color: hoverClose ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)",
            width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 3, padding: 0, transition: "color 0.15s, background 0.15s",
          }}
        >✕</button>
      </div>

      {/* Domain list with inline chain accordions */}
      <div style={{ overflowY: "auto", padding: "4px 6px" }}>
        {DOMAINS.map((domain, di) => {
          const isExp = expandedDomain === di;
          const isHov = hoverDomain === di;
          return (
            <div key={domain.name}>
              <div
                onClick={() => setExpandedDomain(isExp ? null : di)}
                onMouseEnter={() => setHoverDomain(di)}
                onMouseLeave={() => setHoverDomain(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 8px", borderRadius: 6, cursor: "pointer",
                  background: isExp ? "rgba(255,255,255,0.02)" : isHov ? "rgba(255,255,255,0.015)" : "transparent",
                  transition: "background 0.15s",
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: domain.dot, flexShrink: 0 }} />
                <span style={{
                  ...SYS, fontSize: 10, fontWeight: 500, flex: 1,
                  color: isExp ? "rgba(255,255,255,0.65)" : isHov ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.48)",
                  transition: "color 0.15s",
                }}>{domain.name}</span>
                <span style={{ ...MONO, fontSize: 7, color: "rgba(255,255,255,0.48)", flexShrink: 0 }}>{domain.count}</span>
                <span style={{
                  ...MONO, fontSize: 9, flexShrink: 0,
                  color: isExp ? "rgba(255,255,255,0.15)" : isHov ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
                  transition: "color 0.15s",
                }}>{isExp ? "↓" : "→"}</span>
              </div>

              {isExp && (
                <div style={{ padding: "2px 0 6px 24px", animation: "cdChainIn 0.15s ease" }}>
                  {domain.chains.map((chain) => {
                    const ck = `${di}-${chain.name}`;
                    const isChHov = hoverChain === ck;
                    const isLive = chain.live;
                    const bg = isLive
                      ? isChHov ? "rgba(196,164,108,0.03)" : "rgba(196,164,108,0.015)"
                      : isChHov ? "rgba(255,255,255,0.02)" : "transparent";
                    const nc = isLive
                      ? isChHov ? "rgba(196,164,108,0.7)" : "rgba(196,164,108,0.45)"
                      : isChHov ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.22)";
                    const ac = isLive
                      ? isChHov ? "rgba(196,164,108,0.2)" : "rgba(196,164,108,0.04)"
                      : isChHov ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)";
                    return (
                      <div
                        key={chain.name}
                        onClick={(e) => { e.stopPropagation(); if (chain.href !== "#") window.location.href = chain.href; }}
                        onMouseEnter={() => setHoverChain(ck)}
                        onMouseLeave={() => setHoverChain(null)}
                        style={{
                          display: "flex", alignItems: "center", gap: 9,
                          padding: "7px 8px", borderRadius: 6,
                          cursor: chain.href !== "#" ? "pointer" : "default",
                          background: bg, transition: "background 0.15s",
                        }}
                      >
                        <div style={{ flexShrink: 0, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {chain.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ ...SYS, fontSize: 9.5, fontWeight: 500, color: nc, marginBottom: 1, transition: "color 0.15s" }}>{chain.name}</div>
                          <div style={{ ...MONO, fontSize: 6.5, color: "rgba(255,255,255,0.06)" }}>{chain.desc}</div>
                        </div>
                        <span style={{ ...MONO, fontSize: 8, color: ac, flexShrink: 0, transition: "color 0.15s" }}>→</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
