"use client";
import { useEffect, useRef } from "react";
import type { NodeData } from "@/types";

interface TooltipProps {
  nodeKey: string | null;
  nodeData: NodeData | null;
  svgX: number;
  svgY: number;
  onDeepDive: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function Tooltip({ nodeKey, nodeData, svgX, svgY, onDeepDive, onMouseEnter, onMouseLeave }: TooltipProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Compute pixel position from SVG coordinates
  const getPosition = () => {
    if (typeof window === "undefined") return { left: 0, top: 0 };
    const TW = 224, TH = 230;
    const px = (svgX / 1000) * window.innerWidth;
    const py = (svgY / 1000) * window.innerHeight;
    let left = px + 20;
    let top  = py - TH / 2;
    if (left + TW > window.innerWidth  - 20) left = px - TW - 16;
    if (top < 20) top = 20;
    if (top + TH > window.innerHeight - 20) top = window.innerHeight - TH - 20;
    return { left, top };
  };

  const visible = !!nodeKey && !!nodeData;
  const { left, top } = getPosition();

  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "fixed",
        left, top,
        width: 224,
        background: "white",
        border: "1px solid rgba(192,176,128,0.3)",
        borderRadius: 6,
        padding: "14px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "all" : "none",
        transition: "opacity 0.12s ease",
        zIndex: 400,
      }}
    >
      {nodeData && (
        <>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink4)", marginBottom: 6 }}>
            {nodeData.type}
          </div>
          <div style={{ fontSize: 15, color: "var(--ink)", marginBottom: 3, lineHeight: 1.2 }}>
            {nodeKey}
          </div>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 9, color: "var(--ink3)", marginBottom: 10, letterSpacing: "0.04em" }}>
            {nodeData.loc}
          </div>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: "var(--ink2)", background: "rgba(192,176,128,0.1)", borderRadius: 3, padding: "4px 8px", marginBottom: 8, display: "inline-block" }}>
            {nodeData.stat}
          </div>
          <div style={{ fontSize: 11, color: "#8c5a2a", lineHeight: 1.5, paddingTop: 8, borderTop: "1px solid rgba(192,176,128,0.2)", marginTop: 4 }}>
            {nodeData.risk}
          </div>
          <button
            onClick={onDeepDive}
            style={{ display: "block", width: "100%", marginTop: 12, padding: "7px 0", textAlign: "center", fontFamily: "'Geist Mono',monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold2)", background: "none", border: "1px solid rgba(192,176,128,0.4)", borderRadius: 3, cursor: "pointer" }}
          >
            Deep dive →
          </button>
        </>
      )}
    </div>
  );
}
