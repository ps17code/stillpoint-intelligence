"use client";
import React, { useState, useEffect, useRef } from "react";

const MONO: React.CSSProperties = { fontFamily: "'Geist Mono', 'Courier New', monospace" };
const SYS: React.CSSProperties  = { fontFamily: "Inter, -apple-system, system-ui, sans-serif" };

interface Chain {
  name: string;
  description: string;
  live: boolean;
  href: string;
  icon: React.ReactNode;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function GermaniumIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="5" width="9" height="7" rx="0.5" fill="none" stroke="rgba(196,164,108,0.3)" strokeWidth="0.5" transform="rotate(-10 7 8)"/>
      <rect x="13" y="7" width="7" height="5" rx="0.5" fill="none" stroke="rgba(196,164,108,0.2)" strokeWidth="0.5" transform="rotate(8 16 9)"/>
      <rect x="8" y="13" width="8" height="5" rx="0.5" fill="none" stroke="rgba(196,164,108,0.14)" strokeWidth="0.5" transform="rotate(-5 12 15)"/>
    </svg>
  );
}

function GalliumIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5"/>
      <line x1="7" y1="10" x2="21" y2="10" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
      <line x1="7" y1="14" x2="21" y2="14" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
      <line x1="7" y1="18" x2="21" y2="18" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
      <line x1="10" y1="6" x2="10" y2="22" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
      <line x1="14" y1="4" x2="14" y2="24" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
      <line x1="18" y1="6" x2="18" y2="22" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
      <rect x="10.5" y="10.5" width="3" height="3" fill="rgba(155,168,171,0.06)"/>
    </svg>
  );
}

function CobaltIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="7" y="5" width="14" height="18" rx="2" fill="none" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5"/>
      <rect x="10" y="3" width="8" height="2" rx="1" fill="none" stroke="rgba(155,168,171,0.08)" strokeWidth="0.5"/>
      <line x1="9" y1="9" x2="19" y2="9" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
      <line x1="9" y1="12" x2="19" y2="12" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
      <line x1="9" y1="15" x2="19" y2="15" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
      <line x1="9" y1="18" x2="19" y2="18" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
    </svg>
  );
}

function RareEarthsIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="9" y="9" width="10" height="10" rx="1" fill="none" stroke="rgba(155,168,171,0.12)" strokeWidth="0.5"/>
      <path d="M14,8 Q7,5 5,9" fill="none" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
      <path d="M14,8 Q21,5 23,9" fill="none" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
      <path d="M14,20 Q7,23 5,19" fill="none" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
      <path d="M14,20 Q21,23 23,19" fill="none" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
      <path d="M14,7 Q4,3 3,11" fill="none" stroke="rgba(155,168,171,0.04)" strokeWidth="0.5"/>
      <path d="M14,7 Q24,3 25,11" fill="none" stroke="rgba(155,168,171,0.04)" strokeWidth="0.5"/>
      <path d="M14,21 Q4,25 3,17" fill="none" stroke="rgba(155,168,171,0.04)" strokeWidth="0.5"/>
      <path d="M14,21 Q24,25 25,17" fill="none" stroke="rgba(155,168,171,0.04)" strokeWidth="0.5"/>
    </svg>
  );
}

function UraniumIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <line x1="9" y1="5" x2="9" y2="23" stroke="rgba(155,168,171,0.1)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="5" x2="14" y2="23" stroke="rgba(155,168,171,0.08)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="19" y1="5" x2="19" y2="23" stroke="rgba(155,168,171,0.06)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="7" y1="8" x2="21" y2="8" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
      <line x1="7" y1="14" x2="21" y2="14" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
      <line x1="7" y1="20" x2="21" y2="20" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
    </svg>
  );
}

function TitaniumIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <polygon points="14,4 23,9 23,19 14,24 5,19 5,9" fill="none" stroke="rgba(155,168,171,0.08)" strokeWidth="0.5"/>
      <line x1="14" y1="4" x2="14" y2="24" stroke="rgba(155,168,171,0.04)" strokeWidth="0.5"/>
      <line x1="5" y1="9" x2="23" y2="19" stroke="rgba(155,168,171,0.04)" strokeWidth="0.5"/>
      <line x1="23" y1="9" x2="5" y2="19" stroke="rgba(155,168,171,0.04)" strokeWidth="0.5"/>
    </svg>
  );
}

function CopperIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <ellipse cx="14" cy="9" rx="8" ry="3" fill="none" stroke="rgba(155,168,171,0.08)" strokeWidth="0.5"/>
      <ellipse cx="14" cy="14" rx="8" ry="3" fill="none" stroke="rgba(155,168,171,0.06)" strokeWidth="0.5"/>
      <ellipse cx="14" cy="19" rx="8" ry="3" fill="none" stroke="rgba(155,168,171,0.05)" strokeWidth="0.5"/>
      <line x1="6" y1="9" x2="6" y2="19" stroke="rgba(155,168,171,0.04)" strokeWidth="0.5"/>
      <line x1="22" y1="9" x2="22" y2="19" stroke="rgba(155,168,171,0.04)" strokeWidth="0.5"/>
    </svg>
  );
}

// ── Chain data ────────────────────────────────────────────────────────────────

const CHAINS: Chain[] = [
  {
    name: "Germanium → Fiber",
    description: "Ore to AI datacenter cable",
    live: true,
    href: "/chains/germanium",
    icon: <GermaniumIcon />,
  },
  {
    name: "Gallium → Semiconductors",
    description: "GaAs and GaN for RF and defense",
    live: false,
    href: "#",
    icon: <GalliumIcon />,
  },
  {
    name: "Cobalt → Batteries",
    description: "DRC mining to EV cathodes",
    live: false,
    href: "#",
    icon: <CobaltIcon />,
  },
  {
    name: "Rare Earths → Magnets",
    description: "Permanent magnets for EVs and wind",
    live: false,
    href: "#",
    icon: <RareEarthsIcon />,
  },
  {
    name: "Uranium → Nuclear",
    description: "Enrichment to SMR and AI power",
    live: false,
    href: "#",
    icon: <UraniumIcon />,
  },
  {
    name: "Titanium → Aerospace",
    description: "Sponge to airframe and engine parts",
    live: false,
    href: "#",
    icon: <TitaniumIcon />,
  },
  {
    name: "Copper → Grid",
    description: "Mining to power transmission",
    live: false,
    href: "#",
    icon: <CopperIcon />,
  },
];

const SHOW_SEARCH_THRESHOLD = 7;

export default function ChainDirectory() {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery]       = useState("");
  const [hoverItem, setHoverItem] = useState<number | null>(null);
  const [hoverCollapsed, setHoverCollapsed] = useState(false);
  const [hoverClose, setHoverClose] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const showSearch = CHAINS.length > SHOW_SEARCH_THRESHOLD;
  const filtered = query.trim()
    ? CHAINS.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase())
      )
    : CHAINS;

  // Collapse on outside click or Escape
  useEffect(() => {
    if (!expanded) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setExpanded(false); }
    function onClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [expanded]);

  // ── Collapsed tab ──────────────────────────────────────────────────────────
  if (!expanded) {
    return (
      <div
        ref={panelRef}
        onClick={() => setExpanded(true)}
        onMouseEnter={() => setHoverCollapsed(true)}
        onMouseLeave={() => setHoverCollapsed(false)}
        style={{
          position: "fixed", bottom: 16, right: 16, zIndex: 200,
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 18px",
          background: hoverCollapsed ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.10)",
          border: `0.5px solid ${hoverCollapsed ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.14)"}`,
          borderRadius: 8,
          cursor: "pointer",
          transition: "background 0.15s, border-color 0.15s",
        }}
      >
        {/* Stacked lines icon */}
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
          <line x1="2" y1="4"  x2="10" y2="4"  stroke="rgba(255,255,255,0.7)" strokeWidth="0.5"/>
          <line x1="2" y1="7"  x2="10" y2="7"  stroke="rgba(255,255,255,0.5)" strokeWidth="0.5"/>
          <line x1="2" y1="10" x2="10" y2="10" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5"/>
        </svg>
        {/* Label */}
        <span style={{ ...MONO, fontSize: 10, color: "rgba(255,255,255,0.85)", letterSpacing: "0.03em" }}>
          Chains
        </span>
        {/* Count badge */}
        <span style={{
          ...MONO, fontSize: 8, color: "rgba(255,255,255,0.5)",
          background: "rgba(255,255,255,0.08)",
          padding: "2px 6px", borderRadius: 4,
        }}>
          {CHAINS.length}
        </span>
      </div>
    );
  }

  // ── Expanded panel ─────────────────────────────────────────────────────────
  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed", bottom: 16, right: 16, zIndex: 200,
        width: 260,
        maxHeight: 320,
        background: "rgba(30,30,28,0.96)",
        border: "0.5px solid rgba(255,255,255,0.14)",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        animation: "chainDirIn 0.2s ease",
      }}
    >
      <style>{`
        @keyframes chainDirIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "10px 14px 8px",
        borderBottom: "0.5px solid rgba(255,255,255,0.08)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <span style={{ ...MONO, fontSize: 8, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>
          CHAINS
        </span>
        <button
          onClick={() => setExpanded(false)}
          onMouseEnter={() => setHoverClose(true)}
          onMouseLeave={() => setHoverClose(false)}
          style={{
            background: hoverClose ? "rgba(255,255,255,0.06)" : "none",
            border: "none",
            cursor: "pointer",
            ...MONO, fontSize: 11,
            color: hoverClose ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
            width: 18, height: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 4,
            padding: 0,
            transition: "color 0.15s, background 0.15s",
          }}
        >
          ✕
        </button>
      </div>

      {/* Search (only if > 7 chains) */}
      {showSearch && (
        <div style={{
          padding: "8px 14px",
          borderBottom: "0.5px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search chains..."
            style={{
              width: "100%", boxSizing: "border-box" as const,
              background: "rgba(255,255,255,0.05)",
              border: "0.5px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
              padding: "7px 10px",
              ...MONO, fontSize: 8,
              color: "rgba(255,255,255,0.6)",
              outline: "none",
            }}
          />
        </div>
      )}

      {/* Chain list */}
      <div style={{ overflowY: "auto", padding: "6px 8px" }}>
        {filtered.map((chain, i) => {
          const isHov = hoverItem === i;
          const nameColor = chain.live
            ? isHov ? "rgba(196,164,108,0.95)" : "rgba(196,164,108,0.7)"
            : isHov ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)";
          const bg = chain.live
            ? isHov ? "rgba(196,164,108,0.08)" : "rgba(196,164,108,0.03)"
            : isHov ? "rgba(255,255,255,0.06)" : "transparent";
          const arrowColor = chain.live
            ? isHov ? "rgba(196,164,108,0.5)"  : "rgba(196,164,108,0.25)"
            : isHov ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)";

          return (
            <div
              key={chain.name}
              onClick={() => { if (chain.href !== "#") window.location.href = chain.href; }}
              onMouseEnter={() => setHoverItem(i)}
              onMouseLeave={() => setHoverItem(null)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 8px",
                borderRadius: 6,
                cursor: chain.href !== "#" ? "pointer" : "default",
                background: bg,
                transition: "background 0.15s",
              }}
            >
              {/* Icon */}
              <div style={{ flexShrink: 0, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {chain.icon}
              </div>

              {/* Name + description */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  ...SYS, fontSize: 10, fontWeight: 500,
                  color: nameColor,
                  marginBottom: 1,
                  transition: "color 0.15s",
                  whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {chain.name}
                </div>
                <div style={{
                  ...MONO, fontSize: 6.5,
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {chain.description}
                </div>
              </div>

              {/* Arrow */}
              <span style={{ ...MONO, fontSize: 9, color: arrowColor, flexShrink: 0, transition: "color 0.15s" }}>
                →
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
