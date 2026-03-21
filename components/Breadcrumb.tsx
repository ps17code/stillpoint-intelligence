"use client";
import { CubeShape, SphereShape, PyramidShape, CylinderShape } from "./Shapes";

interface BreadcrumbNode {
  label: string;
  shape: "cube" | "sphere" | "pyramid" | "cylinder";
  onClick: () => void;
}

interface BreadcrumbProps {
  nodes: BreadcrumbNode[];  // 1 or 2 prior nodes to show
  visible: boolean;
}

const SHAPE_MAP = {
  cube:     CubeShape,
  sphere:   SphereShape,
  pyramid:  PyramidShape,
  cylinder: CylinderShape,
};

function BreadcrumbNode({ node }: { node: BreadcrumbNode }) {
  const ShapeComp = SHAPE_MAP[node.shape];
  return (
    <div
      onClick={node.onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        cursor: "pointer",
        opacity: 0.65,
        transition: "opacity 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "0.65")}
    >
      <div style={{
        fontFamily: "'EB Garamond', Georgia, serif",
        fontSize: 12,
        color: "var(--ink3)",
      }}>
        {node.label}
      </div>
      <ShapeComp size={22} />
    </div>
  );
}

export default function Breadcrumb({ nodes, visible }: BreadcrumbProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 28,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 150,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "all" : "none",
        transition: "opacity 0.5s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
      }}
    >
      {nodes.map((node, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {i > 0 && (
            <div style={{
              width: 1, height: 20,
              background: "var(--gold)",
              margin: "8px 0",
              opacity: 0.7,
            }} />
          )}
          <BreadcrumbNode node={node} />
        </div>
      ))}
    </div>
  );
}
