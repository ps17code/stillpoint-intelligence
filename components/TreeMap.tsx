"use client";
import { useEffect, useRef } from "react";
import type { TreeGeometry, LayerGeometry } from "@/lib/treeGeometry";
import type { NodeData } from "@/types";

interface DisplayField { key: string; label: string; }
interface LayerConfig { displayFields: DisplayField[]; }

interface TreeMapProps {
  geometry: TreeGeometry | null;
  nodes: Record<string, NodeData>;
  layerConfig?: Record<string, LayerConfig>;
  onNodeHover: (key: string, svgX: number, svgY: number) => void;
  onNodeLeave: () => void;
  onNodeClick: (key: string) => void;
}

const COUNTRY_COLORS: Record<string, string> = {
  "China":   "#c8a85a",
  "USA":     "#5a7a9c",
  "Japan":   "#c8855a",
  "France":  "#7a9abc",
  "Italy":   "#7a9abc",
  "Belgium": "#7a9abc",
};

export default function TreeMap({ geometry, nodes, layerConfig, onNodeHover, onNodeLeave, onNodeClick }: TreeMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

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

    function toConfigKey(layerKey: string): string {
      return layerKey.toLowerCase().replace(/\s+(\w)/g, (_: string, c: string) => c.toUpperCase());
    }

    function mkNodeGroup(
      cx: number, cy: number, name: string,
      layerKey: string, color: { text: string; stroke: string },
      nodeData?: NodeData,
    ) {
      const g = document.createElementNS(NS, "g");
      g.style.cursor = "pointer";

      const configKey = toConfigKey(layerKey);
      const fields = layerConfig?.[configKey]?.displayFields ?? [];
      const raw = nodeData as unknown as Record<string, unknown>;
      const hasFields = fields.length > 0 && nodeData;

      // Hit area
      g.appendChild(mkEl("circle", { cx, cy, r: 40, fill: "transparent", stroke: "none" }));

      if (hasFields) {
        // 1. Name
        const nameEl = mkEl("text", {
          "font-family": "'EB Garamond', Georgia, serif",
          "font-size": 13, "font-weight": 600, fill: "#2a1e0c", x: cx, y: cy - 70,
          "text-anchor": "middle",
        });
        nameEl.textContent = name;
        g.appendChild(nameEl);

        // 2. Country line (field 0 when key === "country")
        const field0 = fields[0];
        const val0 = field0 ? raw[field0.key] : undefined;
        if (val0 != null && String(val0) !== "") {
          if (field0.key === "country") {
            const country = String(val0);
            const dotColor = COUNTRY_COLORS[country] ?? "#9c8c74";
            // Center text at cx, dot flush-left of text using half-width estimate
            const dotX = cx - (country.length * 3.2) - 8;
            g.appendChild(mkEl("circle", {
              cx: dotX, cy: cy - 58,
              r: 3, fill: dotColor,
            }));
            const locEl = mkEl("text", {
              "font-family": "'Geist Mono', monospace",
              "font-size": 8, fill: "#9c8c74",
              x: cx, y: cy - 55,
              "text-anchor": "middle",
              "letter-spacing": "0.03em",
            });
            locEl.textContent = country;
            g.appendChild(locEl);
          } else {
            // Non-country field 0 — render as pill 1
            const pillW = Math.min(Math.max(String(val0).length * 5.8 + 16, 60), 160);
            g.appendChild(mkEl("rect", {
              x: cx - pillW / 2, y: cy - 48, width: pillW, height: 13, rx: 3,
              fill: color.stroke, "fill-opacity": 0.1,
              stroke: color.stroke, "stroke-opacity": 0.25, "stroke-width": 0.5,
            }));
            const t = mkEl("text", {
              "font-family": "'Geist Mono', monospace",
              "font-size": 8, fill: "#6b6458", x: cx, y: cy - 38,
              "text-anchor": "middle", "letter-spacing": "0.04em",
            });
            t.textContent = String(val0);
            g.appendChild(t);
          }
        }

        // 3 & 4. Pill fields
        const pillDefs = [
          { rectY: cy - 48, textY: cy - 38 },
          { rectY: cy - 31, textY: cy - 21 },
        ];
        const pillOffset = field0?.key === "country" ? 0 : 1;

        fields.slice(1, 3).forEach((field, idx) => {
          const val = raw[field.key];
          if (val == null || String(val) === "") return;
          const slotIdx = idx + pillOffset;
          if (slotIdx >= pillDefs.length) return;
          const { rectY, textY } = pillDefs[slotIdx];
          const pillW = Math.min(Math.max(String(val).length * 5.8 + 16, 60), 160);
          g.appendChild(mkEl("rect", {
            x: cx - pillW / 2, y: rectY, width: pillW, height: 13, rx: 3,
            fill: color.stroke, "fill-opacity": 0.1,
            stroke: color.stroke, "stroke-opacity": 0.25, "stroke-width": 0.5,
          }));
          const t = mkEl("text", {
            "font-family": "'Geist Mono', monospace",
            "font-size": 8, fill: "#6b6458", x: cx, y: textY,
            "text-anchor": "middle", "letter-spacing": "0.04em",
          });
          t.textContent = String(val);
          g.appendChild(t);
        });
      } else {
        // No display fields — compact layout
        const label = mkEl("text", {
          "font-family": "'EB Garamond', Georgia, serif",
          "font-size": 13, fill: "#2a1e0c", x: cx, y: cy - 14,
          "text-anchor": "middle",
        });
        label.textContent = name;
        g.appendChild(label);
      }

      // 5. Ring
      g.appendChild(mkEl("circle", { cx, cy, r: 5.5, fill: "none", stroke: color.stroke, "stroke-width": 1.3 }));

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

    // Output → anchor line: start from ring bottom, stop above anchor name label
    const anchorG = mkGroup();
    const { outputToAnchorLine: al } = geometry;
    anchorG.appendChild(mkLine(al.x1, al.y1, al.x2, geometry.ancY - 74, al.color));
    groups.push(anchorG);

    // Output node
    const outG = mkGroup();
    const { outputNode: out } = geometry;
    const outLayer = geometry.layers[geometry.layers.length - 1];
    outG.appendChild(mkNodeGroup(out.cx, out.cy, out.name, outLayer.key, outLayer.color, nodes[out.name]));
    groups.push(outG);

    // Layers bottom-to-top
    for (let li = geometry.layers.length - 2; li >= 0; li--) {
      const layer = geometry.layers[li];

      // Edges: y1 from geometry (fromCY+7.5), y2 stops above destination name label
      const nextLayer = geometry.layers[li + 1];
      const edgesToNext = geometry.edges.filter(e => {
        const layerXs = layer.nodes.map(n => n.cx);
        return layerXs.some(x => Math.abs(e.x1 - x) < 1);
      });

      const edgeG = mkGroup();
      edgesToNext.forEach(edge => {
        edgeG.appendChild(mkLine(edge.x1, edge.y1, edge.x2, nextLayer.cy - 74, edge.color));
      });
      groups.push(edgeG);

      const nodeG = mkGroup();
      layer.nodes.forEach(n => {
        nodeG.appendChild(mkNodeGroup(n.cx, n.cy, n.name, layer.key, layer.color, nodes[n.name]));
      });
      groups.push(nodeG);
    }

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
