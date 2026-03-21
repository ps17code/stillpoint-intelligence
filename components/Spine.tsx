"use client";
import { useState } from "react";
import { CubeShape, SphereShape, PyramidShape, CylinderShape } from "./Shapes";

const SPINE_NODES = [
  { key: "raw",  label: "Raw Material", Shape: CubeShape },
  { key: "comp", label: "Component",    Shape: SphereShape },
  { key: "sub",  label: "Subsystem",    Shape: PyramidShape },
  { key: "eu",   label: "End Use",      Shape: CylinderShape },
] as const;

interface SpineProps {
  state: "default" | "shifted" | "gone";
  selection: { raw: string | null; comp: string | null; sub: string | null; eu: string | null };
  options: {
    raw: string[];
    comp: string[];
    sub: string[];
    eu: string[];
  };
  onSelect: (level: "raw" | "comp" | "sub" | "eu", value: string) => void;
  onCubeClick: () => void;
  onSphereClick: () => void;
}

type SpineKey = "raw" | "comp" | "sub" | "eu";

export default function Spine({ state, selection, options, onSelect, onCubeClick, onSphereClick }: SpineProps) {
  const [hoveredNode, setHoveredNode] = useState<SpineKey | null>(null);

  const transform =
    state === "shifted" ? "translateY(calc(50vh - 10px))" :
    state === "gone"    ? "translateY(-200vh)" : "none";

  // Which nodes are active (have a selection upstream)
  const isActive = (key: SpineKey) => {
    if (key === "raw")  return true;
    if (key === "comp") return !!selection.raw;
    if (key === "sub")  return !!selection.comp;
    if (key === "eu")   return !!selection.sub;
    return false;
  };

  // Which nodes are hidden when shifted (subsystem + end use slide off)
  const isHiddenWhenShifted = (key: SpineKey) => key === "sub" || key === "eu";

  const getLabel = (key: SpineKey) => {
    const sel = selection[key];
    const defaults: Record<SpineKey, string> = {
      raw: "Raw Material", comp: "Component", sub: "Subsystem", eu: "End Use"
    };
    return sel || defaults[key];
  };

  const hint = selection.raw
    ? "click the cube to explore"
    : "hover a node to explore";

  return (
    <div
      id="page-spine"
      style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        transform,
        transition: "transform 0.75s cubic-bezier(0.4,0,0.2,1)",
        zIndex: 10,
      }}
    >
      {/* Title */}
      <div style={{
        position: "absolute", top: 36, left: "50%", transform: "translateX(-50%)",
        fontFamily: "'Geist Mono', monospace", fontSize: 10, fontWeight: 300,
        letterSpacing: "0.26em", color: "var(--gold2)", whiteSpace: "nowrap",
        textTransform: "uppercase",
        opacity: state === "shifted" ? 0 : 1,
        transition: "opacity 0.3s",
      }}>
        Stillpoint Intelligence
      </div>

      {/* Spine nodes */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {SPINE_NODES.map(({ key, Shape }, idx) => {
          const active = isActive(key);
          const dormant = !active;
          const hidden = state === "shifted" && isHiddenWhenShifted(key);
          const opts = options[key];
          const showMenu = hoveredNode === key && active && opts.length > 0;

          return (
            <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Spine line above (not before first) */}
              {idx > 0 && (
                <div style={{
                  width: 1, height: 30,
                  background: "var(--gold)",
                  margin: "14px 0",
                  opacity: hidden ? 0 : 0.7,
                  transition: "opacity 0.3s",
                }} />
              )}

              {/* Node */}
              <div
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  position: "relative",
                  opacity: hidden ? 0 : 1,
                  transition: "opacity 0.3s",
                  pointerEvents: hidden ? "none" : "all",
                }}
                onMouseEnter={() => { if (active) setHoveredNode(key); }}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Label */}
                <div style={{
                  fontSize: 14,
                  color: dormant ? "var(--dormant)" : "var(--ink2)",
                  marginBottom: 8,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  transition: "color 0.3s",
                }}>
                  {getLabel(key)}
                </div>

                {/* Shape */}
                <div
                  id={key === "raw" ? "raw-anchor-shape" : undefined}
                  style={{
                    width: 28, height: 22,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative",
                    cursor: dormant ? "default" : "pointer",
                    opacity: dormant ? 0.25 : 1,
                    transition: "opacity 0.3s",
                  }}
                  onClick={() => {
                    if (dormant) return;
                    if (key === "raw" && selection.raw) onCubeClick();
                    if (key === "comp" && selection.comp) onSphereClick();
                  }}
                >
                  <Shape />

                  {/* Dropdown menu */}
                  {showMenu && (
                    <div style={{
                      position: "absolute", left: 28, top: "50%", transform: "translateY(-50%)",
                      display: "flex", alignItems: "center",
                      zIndex: 100,
                    }}>
                      <div style={{ width: 28, height: 1, background: "var(--gold)", opacity: 0.7 }} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14 }}>
                        {opts.map(opt => (
                          <div
                            key={opt}
                            style={{
                              fontFamily: "'EB Garamond', Georgia, serif",
                              fontSize: 12,
                              color: selection[key] === opt ? "var(--ink)" : "var(--ink3)",
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                              letterSpacing: "0.04em",
                              lineHeight: 1,
                            }}
                            onMouseDown={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              onSelect(key, opt);
                              setHoveredNode(null);
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
                            onMouseLeave={e => (e.currentTarget.style.color = selection[key] === opt ? "var(--ink)" : "var(--ink3)")}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hint */}
      <div style={{
        position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)",
        fontFamily: "'Geist Mono', monospace", fontSize: 9, fontWeight: 300,
        letterSpacing: "0.18em",
        color: selection.raw ? "var(--gold2)" : "var(--ink4)",
        whiteSpace: "nowrap", textTransform: "uppercase",
        opacity: state === "shifted" ? 0 : 1,
        transition: "color 0.3s, opacity 0.3s",
      }}>
        {hint}
      </div>
    </div>
  );
}
