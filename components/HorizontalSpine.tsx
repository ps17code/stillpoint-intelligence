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

const LEVELS: { key: Level; defaultLabel: string; activeStateIdx: number; num: string }[] = [
  { key: "raw",  defaultLabel: "Raw Material", activeStateIdx: 1, num: "01" },
  { key: "comp", defaultLabel: "Component",    activeStateIdx: 2, num: "02" },
  { key: "sub",  defaultLabel: "Subsystem",    activeStateIdx: 3, num: "03" },
  { key: "eu",   defaultLabel: "End Use",      activeStateIdx: 4, num: "04" },
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
      {/* Home button */}
      <button
        onClick={onHome}
        style={{
          fontFamily: "'Geist Mono', 'Courier New', monospace",
          fontSize: 9,
          letterSpacing: "0.15em",
          color: "#6B7280",
          textTransform: "uppercase",
          cursor: "pointer",
          border: "none",
          background: "none",
          marginRight: 28,
          transition: "color 0.2s",
          flexShrink: 0,
          padding: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "#9CA3AF")}
        onMouseLeave={e => (e.currentTarget.style.color = "#6B7280")}
      >
        ← home
      </button>

      {/* Nodes with separators — centered */}
      <div style={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "center" }}>
        {LEVELS.map((lvl, idx) => {
          const active = isActive(lvl.key);
          const dormant = isDormant(lvl.key);
          const label = selection[lvl.key] || lvl.defaultLabel;
          const hasOptions = options[lvl.key].length > 0 && !dormant;
          const showDropdown = hoveredNode === lvl.key && hasOptions;

          const itemOpacity = dormant && !active ? 0.5 : 1;
          const itemWeight = active ? 700 : 400;

          return (
            <div key={lvl.key} style={{ display: "flex", alignItems: "center" }}>
              {/* Separator */}
              {idx > 0 && (
                <span style={{
                  fontFamily: "'Geist Mono', 'Courier New', monospace",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.3)",
                  margin: "0 10px",
                  userSelect: "none",
                }}>
                  →
                </span>
              )}

              {/* Node */}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  position: "relative",
                  cursor: dormant ? "default" : "pointer",
                  padding: "4px 0",
                  opacity: itemOpacity,
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
                {/* Step number */}
                <span style={{
                  fontFamily: "'Geist Mono', 'Courier New', monospace",
                  fontSize: 8,
                  color: "#FFFFFF",
                  fontWeight: itemWeight,
                  letterSpacing: "0.05em",
                  lineHeight: 1,
                }}>
                  {lvl.num}
                </span>

                {/* Label */}
                <span style={{
                  fontFamily: "'Geist Mono', 'Courier New', monospace",
                  fontSize: 10,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  fontWeight: itemWeight,
                  whiteSpace: "nowrap",
                  lineHeight: 1,
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
                          fontFamily: "'Geist Mono', 'Courier New', monospace",
                          fontSize: 10,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: selection[lvl.key] === opt ? "#FFFFFF" : "rgba(255,255,255,0.6)",
                          fontWeight: selection[lvl.key] === opt ? 700 : 400,
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
    </div>
  );
}
