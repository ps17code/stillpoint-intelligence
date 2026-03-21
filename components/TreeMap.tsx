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

const FLAGS: Record<string, string> = {
  "China": "🇨🇳", "USA": "🇺🇸", "Japan": "🇯🇵",
  "Italy": "🇮🇹", "France": "🇫🇷",
};

export default function TreeMap({ geometry, nodes, layerConfig, onNodeHover, onNodeLeave, onNodeClick }: TreeMapProps) {
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

    // Convert layer key ("CABLE TYPE") to layerConfig key ("cableType")
    function toConfigKey(layerKey: string): string {
      return layerKey.toLowerCase().replace(/\s+(\w)/g, (_: string, c: string) => c.toUpperCase());
    }

    // Estimate SVG-unit width of a string at given font-size (monospace approximation)
    function estimateWidth(text: string, fontSize: number): number {
      return text.length * fontSize * 0.62 + 10;
    }

    // Build a pill badge (colored rect + text)
    function mkPill(cx: number, y: number, text: string, strokeColor: string, opacity: number) {
      const frag = document.createElementNS(NS, "g");
      const w = estimateWidth(text, 8);
      const rx = 3, h = 11;
      const rect = mkEl("rect", {
        x: cx - w / 2, y: y - 8.5,
        width: w, height: h, rx,
        fill: strokeColor, "fill-opacity": 0.1,
        stroke: strokeColor, "stroke-opacity": 0.3, "stroke-width": 0.5,
      });
      const t = mkEl("text", {
        "font-family": "'Geist Mono', monospace",
        "font-size": 8, fill: "#6b6458", x: cx, y,
        "text-anchor": "middle", opacity,
        "letter-spacing": "0.04em",
      });
      t.textContent = text;
      frag.appendChild(rect);
      frag.appendChild(t);
      return frag;
    }

    // Format location line: "🇨🇳 China · Yunnan Province"
    function formatLocation(country: string, loc: string): string {
      const flag = FLAGS[country] ?? "";
      const parts = loc ? loc.split(",") : [];
      const region = parts[0]?.trim() ?? "";
      const showRegion = region && region.toLowerCase() !== country.toLowerCase();
      return `${flag ? flag + " " : ""}${country}${showRegion ? " · " + region : ""}`;
    }

    // Build a clickable node group with optional display field pills
    function mkNodeGroup(
      cx: number, cy: number, name: string,
      layerKey: string, color: { text: string; stroke: string }, opacity: number,
      nodeData?: NodeData,
    ) {
      const g = document.createElementNS(NS, "g");
      g.style.cursor = "pointer";

      const configKey = toConfigKey(layerKey);
      const fields = layerConfig?.[configKey]?.displayFields ?? [];
      const raw = nodeData as unknown as Record<string, unknown>;
      const hasFields = fields.length > 0 && nodeData;

      // Large invisible hit area
      const hitR = hasFields ? 36 : 26;
      const hit = mkEl("circle", { cx, cy, r: hitR, fill: "transparent", stroke: "none" });
      g.appendChild(hit);

      if (hasFields) {
        // Name — fixed dark color
        const nameEl = mkEl("text", {
          "font-family": "'EB Garamond', Georgia, serif",
          "font-size": 13, fill: "#2a1e0c", x: cx, y: cy - 52,
          "text-anchor": "middle", opacity,
        });
        nameEl.textContent = name;
        g.appendChild(nameEl);

        // Field 0: location line or plain pill
        const field0 = fields[0];
        const val0 = field0 ? raw[field0.key] : undefined;
        if (val0 != null) {
          if (field0.key === "country") {
            // Location line: flag + country · region
            const locText = formatLocation(String(val0), nodeData!.loc ?? "");
            const locEl = mkEl("text", {
              "font-family": "'Geist Mono', monospace",
              "font-size": 9, fill: "#9c8c74", x: cx, y: cy - 40,
              "text-anchor": "middle", opacity,
              "letter-spacing": "0.03em",
            });
            locEl.textContent = locText;
            g.appendChild(locEl);
          } else {
            // Non-country first field — badge pill
            g.appendChild(mkPill(cx, cy - 40, String(val0), color.stroke, opacity));
          }
        }

        // Fields 1 and 2: badge pills
        const pillY = [cy - 29, cy - 19];
        fields.slice(1, 3).forEach((field, idx) => {
          const val = raw[field.key];
          if (val == null) return;
          g.appendChild(mkPill(cx, pillY[idx], String(val), color.stroke, opacity));
        });
      } else {
        // No display fields — original compact layout
        const label = mkEl("text", {
          "font-family": "'EB Garamond', Georgia, serif",
          "font-size": 13, fill: "#2a1e0c", x: cx, y: cy - 14,
          "text-anchor": "middle", opacity,
        });
        label.textContent = name;
        g.appendChild(label);
      }

      // Ring — layer stroke color
      const circle = mkEl("circle", { cx, cy, r: 5.5, fill: "none", stroke: color.stroke, "stroke-width": 1.3, opacity });
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

    // Output → anchor line: stop 70 SVG units above anchor
    const anchorG = mkGroup();
    const { outputToAnchorLine: al } = geometry;
    anchorG.appendChild(mkLine(al.x1, al.y1, al.x2, al.y2 - 70, al.color));
    groups.push(anchorG);

    // Output node
    const outG = mkGroup();
    const { outputNode: out } = geometry;
    const outLayer = geometry.layers[geometry.layers.length - 1];
    outG.appendChild(mkNodeGroup(out.cx, out.cy, out.name, outLayer.key, outLayer.color, 1, nodes[out.name]));
    groups.push(outG);

    // Layers (from top to bottom in visual tree = bottom to top in layers array)
    for (let li = geometry.layers.length - 2; li >= 0; li--) {
      const layer = geometry.layers[li];

      // Edges: offset y2 up by 39 so lines stop at targetCY - 65 (was targetCY - 26)
      const edgesToNext = geometry.edges.filter(e => {
        const layerXs = layer.nodes.map(n => n.cx);
        return layerXs.some(x => Math.abs(e.x1 - x) < 1);
      });

      const edgeG = mkGroup();
      edgesToNext.forEach(edge => {
        edgeG.appendChild(mkLine(edge.x1, edge.y1, edge.x2, edge.y2 - 39, edge.color));
      });
      groups.push(edgeG);

      // Node group for this layer
      const nodeG = mkGroup();
      layer.nodes.forEach(n => {
        nodeG.appendChild(mkNodeGroup(n.cx, n.cy, n.name, layer.key, layer.color, n.opacity, nodes[n.name]));
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
