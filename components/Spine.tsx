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
  onPyramidClick: () => void;
  onCylinderClick: () => void;
}

type SpineKey = "raw" | "comp" | "sub" | "eu";

export default function Spine({ state, selection, options, onSelect, onCubeClick, onSphereClick, onPyramidClick, onCylinderClick }: SpineProps) {
  const [hoveredNode, setHoveredNode] = useState<SpineKey | null>(null);

  const transform =
    state === "shifted" ? "translateY(calc(10vh + 510px))" :
    state === "gone"    ? "translateY(200vh)" : "none";

  // Which nodes are hidden when shifted — only cube (raw) stays visible
  const isHiddenWhenShifted = (key: SpineKey) => key !== "raw";

  const getLabel = (key: SpineKey) => {
    const sel = selection[key];
    const defaults: Record<SpineKey, string> = {
      raw: "Raw Material", comp: "Component", sub: "Subsystem", eu: "End Use"
    };
    return sel || defaults[key];
  };

  const hasAnySelection = !!(selection.raw || selection.comp || selection.sub || selection.eu);
  const hint = hasAnySelection ? "click a node to explore" : "hover a node to explore";

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
          const hidden = state === "shifted" && isHiddenWhenShifted(key);

          // In shifted state, the raw node visually shows the comp node (next level)
          const displayShifted = state === "shifted" && key === "raw";
          const displayKey: SpineKey = displayShifted ? "comp" : key;
          const DisplayShape = displayShifted ? SphereShape : Shape;
          const displayLabel = getLabel(displayKey);
          const isSelected = !!selection[displayKey];
          const isHovered = hoveredNode === key;
          const displayOpts = options[displayKey];
          const showMenu = isHovered && displayOpts.length > 0;

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
                onMouseEnter={() => setHoveredNode(key)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Label */}
                <div style={{
                  fontSize: 14,
                  color: (isSelected || isHovered) ? "var(--ink2)" : "var(--dormant)",
                  marginBottom: 8,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  transition: "color 0.3s",
                }}>
                  {displayLabel}
                </div>

                {/* Shape */}
                <div
                  id={key === "raw" ? "raw-anchor-shape" : undefined}
                  style={{
                    width: 28, height: 22,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative",
                    cursor: "pointer",
                    opacity: isHovered ? 1 : isSelected ? 0.9 : 0.55,
                    transition: "opacity 0.3s",
                  }}
                  onClick={() => {
                    if (displayKey === "raw"  && selection.raw)  onCubeClick();
                    if (displayKey === "comp" && selection.comp) onSphereClick();
                    if (displayKey === "sub"  && selection.sub)  onPyramidClick();
                    if (displayKey === "eu"   && selection.eu)   onCylinderClick();
                  }}
                >
                  <DisplayShape />

                  {/* Dropdown menu */}
                  {showMenu && (
                    <div style={{
                      position: "absolute", left: 28, top: "50%", transform: "translateY(-50%)",
                      display: "flex", alignItems: "center",
                      zIndex: 100,
                    }}>
                      <div style={{ width: 28, height: 1, background: "var(--gold)", opacity: 0.7 }} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14 }}>
                        {displayOpts.map(opt => (
                          <div
                            key={opt}
                            style={{
                              fontFamily: "'EB Garamond', Georgia, serif",
                              fontSize: 12,
                              color: selection[displayKey] === opt ? "var(--ink)" : "var(--ink3)",
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                              letterSpacing: "0.04em",
                              lineHeight: 1,
                            }}
                            onMouseDown={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              onSelect(displayKey, opt);
                              setHoveredNode(null);
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
                            onMouseLeave={e => (e.currentTarget.style.color = selection[displayKey] === opt ? "var(--ink)" : "var(--ink3)")}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selection dot */}
                <div style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: "var(--gold2)",
                  marginTop: 6,
                  opacity: isSelected ? 1 : 0,
                  transition: "opacity 0.3s",
                }} />
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
        color: hasAnySelection ? "var(--gold2)" : "var(--ink4)",
        whiteSpace: "nowrap", textTransform: "uppercase",
        opacity: state === "shifted" ? 0 : 1,
        transition: "color 0.3s, opacity 0.3s",
      }}>
        {hint}
      </div>
    </div>
  );
}
