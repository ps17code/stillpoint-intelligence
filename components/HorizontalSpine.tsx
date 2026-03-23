"use client";
import { useState, useRef } from "react";
import { CubeShape, SphereShape, PyramidShape, CylinderShape } from "./Shapes";
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
  { key: "raw",  defaultLabel: "Raw Material", activeStateIdx: 1 },
  { key: "comp", defaultLabel: "Component",    activeStateIdx: 2 },
  { key: "sub",  defaultLabel: "Subsystem",    activeStateIdx: 3 },
  { key: "eu",   defaultLabel: "End Use",      activeStateIdx: 4 },
];

function ShapeForLevel({ level, size }: { level: Level; size: number }) {
  if (level === "raw")  return <CubeShape     size={size} />;
  if (level === "comp") return <SphereShape   size={size} />;
  if (level === "sub")  return <PyramidShape  size={size} />;
  return                       <CylinderShape size={size} />;
}

const SHAPE_SIZES: Record<Level, number> = {
  raw:  22,
  comp: 20,
  sub:  22,
  eu:   22,
};

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
    if (level === "raw")  return false; // always navigable
    if (level === "comp") return !selection.raw;
    if (level === "sub")  return !selection.comp;
    if (level === "eu")   return !selection.sub;
    return true;
  }

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 68,
        background: "#f2ede3",
        borderBottom: "0.5px solid rgba(192,176,128,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 50,
        padding: "0 48px",
      }}
    >
      {/* Home button */}
      <button
        onClick={onHome}
        style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.2em",
          color: "var(--gold2)",
          textTransform: "uppercase",
          cursor: "pointer",
          border: "none",
          background: "none",
          marginRight: 32,
          transition: "color 0.3s",
          flexShrink: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "#2a1e0c")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--gold2)")}
      >
        ← home
      </button>

      {/* Nodes with connectors */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {LEVELS.map((lvl, idx) => {
          const active = isActive(lvl.key);
          const dormant = isDormant(lvl.key);
          const label = selection[lvl.key] || lvl.defaultLabel;
          const hasOptions = options[lvl.key].length > 0 && !dormant;
          const showDropdown = hoveredNode === lvl.key && hasOptions;

          return (
            <div key={lvl.key} style={{ display: "flex", alignItems: "center" }}>
              {/* Connector line before (skip first) */}
              {idx > 0 && (
                <div style={{
                  width: 60, height: 1,
                  background: "rgba(192,176,128,0.4)",
                  flexShrink: 0,
                }} />
              )}

              {/* Node */}
              <div
                style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 5,
                  position: "relative",
                  cursor: dormant ? "default" : "pointer",
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
                {/* Label */}
                <div style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: 12,
                  color: (active || !dormant) ? "#2a1e0c" : "#c8bc9a",
                  whiteSpace: "nowrap",
                  transition: "color 0.3s",
                }}>
                  {label}
                </div>

                {/* Shape */}
                <div style={{ opacity: dormant ? 0.25 : 1, transition: "opacity 0.3s" }}>
                  <ShapeForLevel level={lvl.key} size={SHAPE_SIZES[lvl.key]} />
                </div>

                {/* Active indicator dot */}
                {active && (
                  <div style={{
                    width: 4, height: 4, borderRadius: "50%",
                    background: "#c8a85a", marginTop: 3,
                  }} />
                )}

                {/* Dropdown */}
                {showDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "white",
                      border: "0.5px solid rgba(192,176,128,0.3)",
                      borderRadius: 6,
                      padding: "6px 0",
                      minWidth: 160,
                      zIndex: 100,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                    }}
                    onMouseEnter={() => cancelHide(lvl.key)}
                    onMouseLeave={() => scheduleHide(lvl.key)}
                  >
                    {options[lvl.key].map(opt => (
                      <div
                        key={opt}
                        style={{
                          padding: "7px 16px",
                          fontFamily: "'EB Garamond', Georgia, serif",
                          fontSize: 13,
                          color: selection[lvl.key] === opt ? "#2a1e0c" : "#6b6458",
                          fontWeight: selection[lvl.key] === opt ? 500 : 400,
                          cursor: "pointer",
                          transition: "background 0.15s, color 0.15s",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "rgba(192,176,128,0.08)";
                          e.currentTarget.style.color = "#2a1e0c";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = selection[lvl.key] === opt ? "#2a1e0c" : "#6b6458";
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
