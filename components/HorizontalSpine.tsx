"use client";
import { useState, useRef } from "react";
import type { AppState } from "@/types";

interface HorizontalSpineProps {
  selection: { raw: string | null; comp: string | null; sub: string | null; eu: string | null };
  activeState: AppState;
  options: { raw: string[]; comp: string[]; sub: string[]; eu: string[] };
  onSelect: (level: "raw" | "comp" | "sub" | "eu", value: string) => void;
  onNodeClick: (level: "raw" | "comp" | "sub" | "eu") => void;
  onHome: () => void;
}

type Level = "raw" | "comp" | "sub" | "eu";

const LEVELS: { key: Level; defaultLabel: string; activeStateIdx: number }[] = [
  { key: "raw",  defaultLabel: "Germanium", activeStateIdx: 1 },
  { key: "comp", defaultLabel: "Component",  activeStateIdx: 2 },
  { key: "sub",  defaultLabel: "Subsystem",  activeStateIdx: 3 },
  { key: "eu",   defaultLabel: "End use",    activeStateIdx: 4 },
];

export default function HorizontalSpine({
  selection, activeState, options, onSelect, onNodeClick, onHome,
}: HorizontalSpineProps) {
  const [hoveredNode, setHoveredNode] = useState<Level | null>(null);
  const hideTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  function scheduleHide(level: Level) {
    hideTimers.current[level] = setTimeout(() => {
      setHoveredNode(prev => prev === level ? null : prev);
    }, 150);
  }

  function cancelHide(level: Level) {
    clearTimeout(hideTimers.current[level]);
  }

  function isActive(level: Level): boolean {
    return activeState === LEVELS.find(l => l.key === level)!.activeStateIdx;
  }

  function isDormant(level: Level): boolean {
    if (level === "raw")  return false;
    if (level === "comp") return !selection.raw;
    if (level === "sub")  return !selection.comp;
    if (level === "eu")   return !selection.sub;
    return true;
  }

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 52,
        background: "#000000",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center",
        zIndex: 50,
        padding: "0 24px",
      }}
    >
      {/* Left: brand name */}
      <button
        onClick={onHome}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <span style={{ fontFamily: "'DM Sans', Inter, -apple-system, sans-serif", fontSize: "11px", fontWeight: 300, letterSpacing: "0.04em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>Stillpoint</span>
        <span style={{ display: "inline-block", width: "5px" }} />
        <span style={{ fontFamily: "'DM Sans', Inter, -apple-system, sans-serif", fontSize: "11px", fontWeight: 200, letterSpacing: "0.04em", color: "rgba(255,255,255,0.30)", textTransform: "uppercase" }}>Intelligence</span>
      </button>

      {/* Center: chain steps */}
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        {LEVELS.map((lvl, idx) => {
          const active = isActive(lvl.key);
          const dormant = isDormant(lvl.key);
          const label = selection[lvl.key] || lvl.defaultLabel;
          const hasOptions = options[lvl.key].length > 0 && !dormant;
          const showDropdown = hoveredNode === lvl.key && hasOptions;

          return (
            <div key={lvl.key} style={{ display: "flex", alignItems: "center" }}>
              {/* Dot separator */}
              {idx > 0 && (
                <div style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.25)",
                  margin: "0 10px",
                  flexShrink: 0,
                }} />
              )}

              {/* Step */}
              <div
                style={{
                  position: "relative",
                  cursor: dormant ? "default" : "pointer",
                  padding: "4px 0",
                }}
                onMouseEnter={() => {
                  cancelHide(lvl.key);
                  if (hasOptions) setHoveredNode(lvl.key);
                }}
                onMouseLeave={() => scheduleHide(lvl.key)}
                onClick={() => {
                  if (!dormant && selection[lvl.key]) onNodeClick(lvl.key);
                }}
              >
                <span style={{
                  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize: "10.5px",
                  color: active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                  whiteSpace: "nowrap" as const,
                  lineHeight: 1,
                  borderBottom: active ? "1px solid rgba(255,255,255,0.5)" : "none",
                  paddingBottom: active ? "1px" : "0",
                }}>
                  {label}
                </span>

                {/* Dropdown */}
                {showDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      left: 0,
                      background: "#111111",
                      border: "0.5px solid rgba(255,255,255,0.12)",
                      borderRadius: 4,
                      padding: "4px 0",
                      minWidth: 160,
                      zIndex: 100,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                    }}
                    onMouseEnter={() => cancelHide(lvl.key)}
                    onMouseLeave={() => scheduleHide(lvl.key)}
                  >
                    {options[lvl.key].map(opt => (
                      <div
                        key={opt}
                        style={{
                          padding: "7px 14px",
                          fontFamily: "Inter, -apple-system, sans-serif",
                          fontSize: 11,
                          color: selection[lvl.key] === opt ? "#FFFFFF" : "rgba(255,255,255,0.6)",
                          fontWeight: selection[lvl.key] === opt ? 600 : 400,
                          cursor: "pointer",
                          transition: "background 0.12s, color 0.12s",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                          e.currentTarget.style.color = "#FFFFFF";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = selection[lvl.key] === opt ? "#FFFFFF" : "rgba(255,255,255,0.6)";
                        }}
                        onMouseDown={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          onSelect(lvl.key, opt);
                          setHoveredNode(null);
                        }}
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

      {/* Right: spacer to balance brand */}
      <div style={{ flex: 1 }} />
    </div>
  );
}
