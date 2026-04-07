"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

const MONO: React.CSSProperties = { fontFamily: "'Geist Mono', 'Courier New', monospace" };
const SYS: React.CSSProperties = { fontFamily: "Inter, -apple-system, system-ui, sans-serif" };

type PanelState = "collapsed" | "step1" | "step2";
type SlideDir = "left" | "right" | "none";

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
    name: "Connectivity",
    dot: "rgba(100,200,140,0.35)",
    count: "3 chains",
    chains: [
      { name: "Germanium → Fiber", desc: "Ore to AI datacenter cable", live: true, href: "/chains/germanium", icon: <GermaniumIcon /> },
      { name: "Copper → Interconnects", desc: "Power distribution cabling", live: false, href: "#", icon: <CoilIcon /> },
      { name: "Indium → Transceivers", desc: "Optical network modules", live: false, href: "#", icon: <TransceiverIcon /> },
    ],
  },
  {
    name: "Power",
    dot: "rgba(196,164,108,0.35)",
    count: "5 chains",
    chains: [
      { name: "Uranium → Nuclear", desc: "SMR and grid-scale power", live: false, href: "#", icon: <AtomIcon /> },
      { name: "Silicon → Solar", desc: "Panels and utility farms", live: false, href: "#", icon: <SolarIcon /> },
      { name: "Rare Earths → Wind", desc: "Turbine generators", live: false, href: "#", icon: <TurbineIcon /> },
      { name: "Copper → Grid", desc: "Transformers and transmission", live: false, href: "#", icon: <StackedEllipseIcon /> },
      { name: "Lithium → Backup", desc: "UPS battery systems", live: false, href: "#", icon: <BatteryIcon /> },
    ],
  },
  {
    name: "Compute",
    dot: "rgba(100,150,200,0.35)",
    count: "4 chains",
    chains: [
      { name: "Gallium → Chips", desc: "GaN power electronics", live: false, href: "#", icon: <NestedDiamondIcon /> },
      { name: "Neon → Lithography", desc: "EUV laser gas", live: false, href: "#", icon: <ConcentricCircleIcon /> },
      { name: "Tantalum → Capacitors", desc: "Server board components", live: false, href: "#", icon: <CapacitorIcon /> },
      { name: "Cobalt → HBM", desc: "High bandwidth memory", live: false, href: "#", icon: <StackedRectIcon /> },
    ],
  },
  {
    name: "Cooling",
    dot: "rgba(100,180,210,0.35)",
    count: "3 chains",
    chains: [
      { name: "Water → Cooling", desc: "Datacenter cooling systems", live: false, href: "#", icon: <DropletIcon /> },
      { name: "Aluminum → Heat Sinks", desc: "Thermal management", live: false, href: "#", icon: <FinIcon /> },
      { name: "Fluorine → Refrigerants", desc: "Chiller systems", live: false, href: "#", icon: <CircleWaveIcon /> },
    ],
  },
  {
    name: "Physical",
    dot: "rgba(155,168,171,0.25)",
    count: "2 chains",
    chains: [
      { name: "Steel → Structure", desc: "Datacenter frame and racking", live: false, href: "#", icon: <IBeamIcon /> },
      { name: "Concrete → Foundation", desc: "Slab and structure base", live: false, href: "#", icon: <LayeredRectIcon /> },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function ChainDirectory() {
  const [panel, setPanel] = useState<PanelState>("collapsed");
  const [domainIdx, setDomainIdx] = useState<number>(0);
  const [slideDir, setSlideDir] = useState<SlideDir>("none");
  const [hoverCollapsed, setHoverCollapsed] = useState(false);
  const [hoverClose, setHoverClose] = useState(false);
  const [hoverDomain, setHoverDomain] = useState<number | null>(null);
  const [hoverChain, setHoverChain] = useState<number | null>(null);
  const [hoverBack, setHoverBack] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const collapse = useCallback(() => {
    setPanel("collapsed");
    setSlideDir("none");
    setHoverClose(false);
    setHoverDomain(null);
    setHoverChain(null);
    setHoverBack(false);
  }, []);

  // Outside click
  useEffect(() => {
    if (panel === "collapsed") return;
    function onClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        collapse();
      }
    }
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [panel, collapse]);

  // Escape key
  useEffect(() => {
    if (panel === "collapsed") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") collapse();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel, collapse]);

  const goStep2 = (idx: number) => {
    setDomainIdx(idx);
    setSlideDir("left");
    setHoverDomain(null);
    setHoverChain(null);
    setPanel("step2");
  };

  const goStep1 = () => {
    setSlideDir("right");
    setHoverChain(null);
    setHoverBack(false);
    setPanel("step1");
  };

  // ── Collapsed ───────────────────────────────────────────────────────────────
  if (panel === "collapsed") {
    return (
      <div
        ref={panelRef}
        onClick={() => { setPanel("step1"); setSlideDir("none"); }}
        onMouseEnter={() => setHoverCollapsed(true)}
        onMouseLeave={() => setHoverCollapsed(false)}
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "7px 12px",
          background: hoverCollapsed ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.025)",
          border: `0.5px solid ${hoverCollapsed ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)"}`,
          borderRadius: 7,
          cursor: "pointer",
          transition: "background 0.15s, border-color 0.15s",
        }}
      >
        {/* Stacked lines icon */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1.5, flexShrink: 0 }}>
          <div style={{ width: 10, height: 0.5, background: "rgba(255,255,255,0.12)" }} />
          <div style={{ width: 7, height: 0.5, background: "rgba(255,255,255,0.12)" }} />
          <div style={{ width: 5, height: 0.5, background: "rgba(255,255,255,0.12)" }} />
        </div>
        {/* Label */}
        <span style={{ ...MONO, fontSize: 8, color: "rgba(255,255,255,0.2)", letterSpacing: "0.03em" }}>
          Chains
        </span>
        {/* Badge */}
        <span style={{
          ...MONO,
          fontSize: 7,
          color: "rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.025)",
          padding: "1px 5px",
          borderRadius: 3,
        }}>
          47
        </span>
      </div>
    );
  }

  // ── Keyframes ───────────────────────────────────────────────────────────────
  const keyframes = `
    @keyframes cdPanelIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes cdSlideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes cdSlideInLeft {
      from { opacity: 0; transform: translateX(-20px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `;

  const contentAnim =
    slideDir === "left"
      ? "cdSlideInRight 0.2s ease"
      : slideDir === "right"
        ? "cdSlideInLeft 0.2s ease"
        : "none";

  const selectedDomain = DOMAINS[domainIdx];

  // ── Expanded panel ──────────────────────────────────────────────────────────
  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        bottom: 14,
        right: 14,
        zIndex: 200,
        width: 240,
        maxHeight: 320,
        background: "rgba(12,12,11,0.97)",
        border: "0.5px solid rgba(255,255,255,0.05)",
        borderRadius: 9,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        animation: "cdPanelIn 0.2s ease",
      }}
    >
      <style>{keyframes}</style>

      {/* ── STEP 1: Domain picker ──────────────────────────────────────────── */}
      {panel === "step1" && (
        <>
          {/* Header */}
          <div style={{
            padding: "9px 12px 7px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <span style={{ ...MONO, fontSize: 7, color: "rgba(255,255,255,0.12)", letterSpacing: "0.06em" }}>
              CHAINS
            </span>
            <button
              onClick={collapse}
              onMouseEnter={() => setHoverClose(true)}
              onMouseLeave={() => setHoverClose(false)}
              style={{
                background: hoverClose ? "rgba(255,255,255,0.06)" : "none",
                border: "none",
                cursor: "pointer",
                ...MONO,
                fontSize: 9,
                color: hoverClose ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)",
                width: 16,
                height: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 3,
                padding: 0,
                transition: "color 0.15s, background 0.15s",
              }}
            >
              ✕
            </button>
          </div>

          {/* Domain list */}
          <div style={{ overflowY: "auto", padding: "4px 6px", animation: contentAnim }}>
            {DOMAINS.map((domain, i) => {
              const isHov = hoverDomain === i;
              return (
                <div
                  key={domain.name}
                  onClick={() => goStep2(i)}
                  onMouseEnter={() => setHoverDomain(i)}
                  onMouseLeave={() => setHoverDomain(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 8px",
                    borderRadius: 6,
                    cursor: "pointer",
                    background: isHov ? "rgba(255,255,255,0.02)" : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  {/* Color dot */}
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: domain.dot,
                    flexShrink: 0,
                  }} />
                  {/* Name */}
                  <span style={{
                    ...SYS,
                    fontSize: 10,
                    fontWeight: 500,
                    color: isHov ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)",
                    flex: 1,
                    transition: "color 0.15s",
                  }}>
                    {domain.name}
                  </span>
                  {/* Count */}
                  <span style={{
                    ...MONO,
                    fontSize: 7,
                    color: "rgba(255,255,255,0.06)",
                    flexShrink: 0,
                  }}>
                    {domain.count}
                  </span>
                  {/* Arrow */}
                  <span style={{
                    ...MONO,
                    fontSize: 9,
                    color: isHov ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
                    flexShrink: 0,
                    transition: "color 0.15s",
                  }}>
                    →
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── STEP 2: Chain list ─────────────────────────────────────────────── */}
      {panel === "step2" && selectedDomain && (
        <>
          {/* Header */}
          <div style={{
            padding: "9px 12px 7px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}>
            <button
              onClick={goStep1}
              onMouseEnter={() => setHoverBack(true)}
              onMouseLeave={() => setHoverBack(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                ...MONO,
                fontSize: 9,
                color: hoverBack ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                padding: 0,
                display: "flex",
                alignItems: "center",
                transition: "color 0.15s",
              }}
            >
              ←
            </button>
            <span style={{
              ...MONO,
              fontSize: 7,
              color: "rgba(255,255,255,0.12)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              flex: 1,
            }}>
              {selectedDomain.name}
            </span>
            <button
              onClick={collapse}
              onMouseEnter={() => setHoverClose(true)}
              onMouseLeave={() => setHoverClose(false)}
              style={{
                background: hoverClose ? "rgba(255,255,255,0.06)" : "none",
                border: "none",
                cursor: "pointer",
                ...MONO,
                fontSize: 9,
                color: hoverClose ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)",
                width: 16,
                height: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 3,
                padding: 0,
                transition: "color 0.15s, background 0.15s",
              }}
            >
              ✕
            </button>
          </div>

          {/* Chain list */}
          <div style={{ overflowY: "auto", padding: "4px 6px", animation: contentAnim }}>
            {selectedDomain.chains.map((chain, i) => {
              const isHov = hoverChain === i;
              const isLive = chain.live;

              const bg = isLive
                ? isHov ? "rgba(196,164,108,0.03)" : "rgba(196,164,108,0.015)"
                : isHov ? "rgba(255,255,255,0.02)" : "transparent";
              const nameColor = isLive
                ? isHov ? "rgba(196,164,108,0.7)" : "rgba(196,164,108,0.45)"
                : isHov ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.22)";
              const arrowColor = isLive
                ? isHov ? "rgba(196,164,108,0.2)" : "rgba(196,164,108,0.04)"
                : isHov ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)";

              return (
                <div
                  key={chain.name}
                  onClick={() => { if (chain.href !== "#") window.location.href = chain.href; }}
                  onMouseEnter={() => setHoverChain(i)}
                  onMouseLeave={() => setHoverChain(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "8px 8px",
                    borderRadius: 6,
                    cursor: chain.href !== "#" ? "pointer" : "default",
                    background: bg,
                    transition: "background 0.15s",
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    flexShrink: 0,
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {chain.icon}
                  </div>

                  {/* Name + desc */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      ...SYS,
                      fontSize: 9.5,
                      fontWeight: 500,
                      color: nameColor,
                      marginBottom: 1,
                      transition: "color 0.15s",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {chain.name}
                    </div>
                    <div style={{
                      ...MONO,
                      fontSize: 6.5,
                      color: "rgba(255,255,255,0.06)",
                      letterSpacing: "0.02em",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {chain.desc}
                    </div>
                  </div>

                  {/* Arrow */}
                  <span style={{
                    ...MONO,
                    fontSize: 8,
                    color: arrowColor,
                    flexShrink: 0,
                    transition: "color 0.15s",
                  }}>
                    →
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
