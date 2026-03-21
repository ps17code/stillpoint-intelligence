"use client";
import { useEffect, useRef } from "react";
import type { TreeGeometry, LayerGeometry } from "@/lib/treeGeometry";
import type { NodeData } from "@/types";

interface TreeMapProps {
  geometry: TreeGeometry | null;
  nodes: Record<string, NodeData>;
  onNodeHover: (key: string, svgX: number, svgY: number) => void;
  onNodeLeave: () => void;
  onNodeClick: (key: string) => void;
}

export default function TreeMap({ geometry, nodes, onNodeHover, onNodeLeave, onNodeClick }: TreeMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Clear previous tree (keep defs)
    Array.from(svg.children).forEach(c => {
      if (c.tagName !== "defs") svg.removeChild(c);
    });

    if (!geometry) {
      svg.style.pointerEvents = "none";
      return;
    }

    const NS = "http://www.w3.org/2000/svg";

    function mkEl(tag: string, attrs: Record<string, string | number>) {
      const e = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, String(v)));
      return e;
    }

    function mkLine(x1: number, y1: number, x2: number, y2: number, stroke: string, dashed = true) {
      return mkEl("line", { x1, y1, x2, y2, stroke, "stroke-width": 0.9,
        ...(dashed ? { "stroke-dasharray": "3 4" } : {}) });
    }

    function mkGroup() {
      const g = document.createElementNS(NS, "g");
      g.classList.add("t-group");
      return g;
    }

    // Build a clickable node group
    function mkNodeGroup(cx: number, cy: number, name: string, color: string, opacity: number) {
      const g = document.createElementNS(NS, "g");
      g.style.cursor = "pointer";

      // Large invisible hit area
      const hit = mkEl("circle", { cx, cy, r: 26, fill: "transparent", stroke: "none" });
      g.appendChild(hit);

      // Label
      const label = mkEl("text", {
        "font-family": "EB Garamond, Georgia, serif",
        "font-size": 13, fill: color, x: cx, y: cy - 14,
        "text-anchor": "middle", opacity,
      });
      label.textContent = name;
      g.appendChild(label);

      // Ring
      const circle = mkEl("circle", { cx, cy, r: 5.5, fill: "none", stroke: color, "stroke-width": 1.3, opacity });
      g.appendChild(circle);

      // Events
      g.addEventListener("mouseenter", () => { onNodeHover(name, cx, cy); });
      g.addEventListener("mouseleave", () => { onNodeLeave(); });
      g.addEventListener("click", (e) => {
        e.stopPropagation();
        onNodeLeave();
        onNodeClick(name);
      });

      return g;
    }

    const groups: SVGGElement[] = [];

    // Output → anchor line
    const anchorG = mkGroup();
    const { outputToAnchorLine: al } = geometry;
    anchorG.appendChild(mkLine(al.x1, al.y1, al.x2, al.y2, al.color));
    groups.push(anchorG);

    // Output node
    const outG = mkGroup();
    const { outputNode: out } = geometry;
    const nodeData = nodes[out.name];
    const outColor = geometry.layers[geometry.layers.length - 1].color.text;
    outG.appendChild(mkNodeGroup(out.cx, out.cy, out.name, outColor, 1));
    groups.push(outG);

    // Layers (from top to bottom in visual tree = bottom to top in layers array)
    // Render layers from second-to-last upward, with their edges
    for (let li = geometry.layers.length - 2; li >= 0; li--) {
      const layer = geometry.layers[li];
      const nextLayer = geometry.layers[li + 1];

      // Edges from this layer to next
      const edgesForLayer = geometry.edges.filter(e => {
        // Match edges whose y2 is within this layer's target
        const targetCY = nextLayer.cy;
        return Math.abs(e.y2 - (targetCY - 26)) < 2 &&
               layer.nodes.some(n => Math.abs(e.x1 - n.cx) < 1);
      });

      // Also catch edges going to output
      const edgesToNext = geometry.edges.filter(e => {
        const layerXs = layer.nodes.map(n => n.cx);
        return layerXs.some(x => Math.abs(e.x1 - x) < 1);
      });

      const edgeG = mkGroup();
      edgesToNext.forEach(edge => {
        edgeG.appendChild(mkLine(edge.x1, edge.y1, edge.x2, edge.y2, edge.color));
      });
      groups.push(edgeG);

      // Node group for this layer
      const nodeG = mkGroup();
      layer.nodes.forEach(n => {
        nodeG.appendChild(mkNodeGroup(n.cx, n.cy, n.name, layer.color.text, n.opacity));
      });
      groups.push(nodeG);
    }

    // Append all groups with staggered animation
    svg.style.pointerEvents = "all";
    groups.forEach((g, i) => {
      svg.appendChild(g);
      setTimeout(() => g.classList.add("show"), i * 110);
    });
  }, [geometry]);

  return (
    <svg
      ref={svgRef}
      id="tree-svg"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid meet"
      style={{
        position: "fixed", inset: 0,
        width: "100vw", height: "100vh",
        pointerEvents: "none", zIndex: 5,
      }}
    >
      <defs />
    </svg>
  );
}
