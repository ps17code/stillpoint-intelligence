"use client";
import { SphereShape, PyramidShape, CylinderShape } from "./Shapes";

interface AnchorNode {
  label: string;
  shape: "sphere" | "pyramid" | "cylinder";
  dormant?: boolean;
  onClick?: () => void;
}

interface AnchorSpineProps {
  id: string;
  topPx: number;          // pixel position for top of this spine
  visible: boolean;
  nodes: AnchorNode[];    // [current, next?] — next is dormant
}

const SHAPE_MAP = {
  sphere:   SphereShape,
  pyramid:  PyramidShape,
  cylinder: CylinderShape,
};

export default function AnchorSpine({ id, topPx, visible, nodes }: AnchorSpineProps) {
  return (
    <div
      id={id}
      style={{
        position: "fixed",
        top: topPx,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 10,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "all" : "none",
        transition: "opacity 0.5s ease",
      }}
    >
      {nodes.map((node, i) => {
        const ShapeComp = SHAPE_MAP[node.shape];
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Spine line between nodes */}
            {i > 0 && (
              <div style={{
                width: 1, height: 30,
                background: "var(--gold)",
                margin: "14px 0",
                opacity: 0.7,
              }} />
            )}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: node.dormant ? 0.25 : 1,
              cursor: node.dormant ? "default" : "pointer",
              transition: "opacity 0.3s",
            }}
              onClick={!node.dormant ? node.onClick : undefined}
            >
              <div style={{
                fontSize: 14,
                color: node.dormant ? "var(--dormant)" : "var(--ink2)",
                marginBottom: 8,
                textAlign: "center",
                whiteSpace: "nowrap",
              }}>
                {node.label}
              </div>
              <ShapeComp />
            </div>
          </div>
        );
      })}
    </div>
  );
}
