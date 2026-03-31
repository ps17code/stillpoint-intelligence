"use client";
import { useState, useRef } from "react";
import type { AppState } from "@/types";

type Level = "raw" | "comp" | "sub" | "eu";

const LEVELS: { key: Level; defaultLabel: string; activeStateIdx: number }[] = [
  { key: "raw",  defaultLabel: "Germanium", activeStateIdx: 1 },
  { key: "comp", defaultLabel: "Component",  activeStateIdx: 2 },
  { key: "sub",  defaultLabel: "Subsystem",  activeStateIdx: 3 },
  { key: "eu",   defaultLabel: "End use",    activeStateIdx: 4 },
];

interface TopBarV2Props {
  selection: { raw: string | null; comp: string | null; sub: string | null; eu: string | null };
  activeState: AppState;
  options: { raw: string[]; comp: string[]; sub: string[]; eu: string[] };
  onSelect: (level: Level, value: string) => void;
  onNodeClick: (level: Level) => void;
  onHome: () => void;
  docId?: string;
}

export default function TopBarV2({
  selection, activeState, options, onSelect, onNodeClick, onHome,
  docId = "GE-RAW-001 · CONFIDENTIAL",
}: TopBarV2Props) {
  const [hoveredNode, setHoveredNode] = useState<Level | null>(null);
  const hideTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  function scheduleHide(level: Level) {
    hideTimers.current[level] = setTimeout(() => {
      setHoveredNode(prev => prev === level ? null : prev);
    }, 150);
  }
  function cancelHide(level: Level) { clearTimeout(hideTimers.current[level]); }

  function isActive(level: Level) {
    return activeState === LEVELS.find(l => l.key === level)!.activeStateIdx;
  }
  function isDormant(level: Level) {
    if (level === "raw")  return false;
    if (level === "comp") return !selection.raw;
    if (level === "sub")  return !selection.comp;
    if (level === "eu")   return !selection.sub;
    return true;
  }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 36,
      background: "#111110",
      borderBottom: "0.5px solid rgba(255,255,255,0.06)",
      display: "flex", alignItems: "center",
      zIndex: 100,
      padding: "0 20px",
      gap: 0,
    }}>
      {/* Left: brand */}
      <button
        onClick={onHome}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", flex: 1, display: "flex", alignItems: "center" }}
      >
        <span style={{ fontFamily: "'DM Sans', Inter, -apple-system, sans-serif", fontSize: 11, fontWeight: 300, letterSpacing: "0.04em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>Stillpoint</span>
        <span style={{ display: "inline-block", width: 5 }} />
        <span style={{ fontFamily: "'DM Sans', Inter, -apple-system, sans-serif", fontSize: 11, fontWeight: 200, letterSpacing: "0.04em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" }}>Intelligence</span>
      </button>

      {/* Center: chain steps */}
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0, gap: 0 }}>
        {LEVELS.map((lvl, idx) => {
          const active = isActive(lvl.key);
          const dormant = isDormant(lvl.key);
          const label = selection[lvl.key] || lvl.defaultLabel;
          const hasOptions = options[lvl.key].length > 0 && !dormant;
          const showDropdown = hoveredNode === lvl.key && hasOptions;

          return (
            <div key={lvl.key} style={{ display: "flex", alignItems: "center" }}>
              {idx > 0 && (
                <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.15)", margin: "0 8px", flexShrink: 0 }} />
              )}
              <div
                style={{ position: "relative", cursor: dormant ? "default" : "pointer", padding: "4px 0" }}
                onMouseEnter={() => { cancelHide(lvl.key); if (hasOptions) setHoveredNode(lvl.key); }}
                onMouseLeave={() => scheduleHide(lvl.key)}
                onClick={() => { if (!dormant && selection[lvl.key]) onNodeClick(lvl.key); }}
              >
                <span style={{
                  fontFamily: "Inter, -apple-system, sans-serif",
                  fontSize: 10.5,
                  color: active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
                  whiteSpace: "nowrap" as const,
                  lineHeight: 1,
                  borderBottom: active ? "1px solid rgba(200,180,140,0.4)" : "none",
                  paddingBottom: active ? 1 : 0,
                }}>
                  {label}
                </span>

                {showDropdown && (
                  <div
                    style={{
                      position: "absolute", top: "calc(100% + 8px)", left: 0,
                      background: "#1A1917",
                      border: "0.5px solid rgba(255,255,255,0.1)",
                      borderRadius: 4,
                      padding: "4px 0",
                      minWidth: 160,
                      zIndex: 200,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                    }}
                    onMouseEnter={() => cancelHide(lvl.key)}
                    onMouseLeave={() => scheduleHide(lvl.key)}
                  >
                    {options[lvl.key].map(opt => (
                      <div
                        key={opt}
                        style={{
                          padding: "6px 14px",
                          fontFamily: "Inter, -apple-system, sans-serif",
                          fontSize: 11,
                          color: selection[lvl.key] === opt ? "#FFFFFF" : "rgba(255,255,255,0.55)",
                          fontWeight: selection[lvl.key] === opt ? 500 : 400,
                          cursor: "pointer",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = selection[lvl.key] === opt ? "#fff" : "rgba(255,255,255,0.55)"; }}
                        onMouseDown={e => { e.preventDefault(); e.stopPropagation(); onSelect(lvl.key, opt); setHoveredNode(null); }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right: doc ID */}
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <span style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: 6, letterSpacing: "0.08em", color: "rgba(255,255,255,0.12)", textTransform: "uppercase", userSelect: "none" as const }}>
          {docId}
        </span>
      </div>
    </div>
  );
}
