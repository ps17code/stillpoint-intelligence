"use client";
import { useEffect, useRef } from "react";
import type { TreeGeometry, LayerGeometry } from "@/lib/treeGeometry";
import type { NodeData, PanelContent } from "@/types";

interface DisplayField { key: string; label: string; }
interface LayerConfig { label?: string; displayFields: DisplayField[]; }

interface TreeMapProps {
  geometry: TreeGeometry | null;
  nodes: Record<string, NodeData>;
  layerConfig?: Record<string, LayerConfig>;
  svgWidth?: number;
  scrollY?: number;
  onNodeHover: (key: string, svgX: number, svgY: number) => void;
  onNodeLeave: () => void;
  onNodeClick: (key: string) => void;
  onLayerClick: (panel: PanelContent) => void;
  layerPanels: Record<string, PanelContent>;
}

const COUNTRY_COLORS: Record<string, string> = {
  "China":   "#c8a85a",
  "USA":     "#5a7a9c",
  "Japan":   "#c8855a",
  "France":  "#7a9abc",
  "Italy":   "#7a9abc",
  "Belgium": "#7a9abc",
  "Canada":  "#5a7a9c",
  "Russia":  "#8c5a5a",
  "DRC":     "#5a8c6a",
};

export default function TreeMap({ geometry, nodes, layerConfig, svgWidth = 1000, scrollY = 0, onNodeHover, onNodeLeave, onNodeClick, onLayerClick, layerPanels }: TreeMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const contentGroupRef = useRef<SVGGElement | null>(null);

  // Scroll effect: just update the transform on the content group — no DOM rebuild
  useEffect(() => {
    const g = contentGroupRef.current;
    if (!g || typeof window === "undefined") return;
    const off = (scrollY / window.innerHeight) * 1000;
    g.setAttribute("transform", `translate(0, ${-off})`);
  }, [scrollY]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Remove previous content group
    if (contentGroupRef.current) {
      try { svg.removeChild(contentGroupRef.current); } catch {}
      contentGroupRef.current = null;
    }

    if (!geometry) {
      svg.style.pointerEvents = "none";
      return;
    }

    // All tree content goes into this group so scroll transform is applied cheaply
    const contentG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    contentGroupRef.current = contentG;

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
      configKeyOverride?: string,
    ) {
      const g = document.createElementNS(NS, "g");
      g.style.cursor = "pointer";

      const configKey = configKeyOverride ?? toConfigKey(layerKey);
      const fields = layerConfig?.[configKey]?.displayFields ?? [];
      const raw = nodeData as unknown as Record<string, unknown>;
      const hasFields = fields.length > 0 && nodeData;

      // Hit area — rect covering ring + full content below
      g.appendChild(mkEl("rect", {
        x: cx - 60, y: cy - 8, width: 120, height: 80,
        fill: "transparent", stroke: "none",
      }));

      // Ring — larger for output nodes
      const isOutputNode = name === "Global Supply" || name === "Optical Fiber Strand";
      if (isOutputNode) {
        g.appendChild(mkEl("circle", { cx, cy, r: 7, fill: "none", stroke: color.stroke, "stroke-width": 1.8 }));
      } else {
        g.appendChild(mkEl("circle", { cx, cy, r: 5.5, fill: "none", stroke: color.stroke, "stroke-width": 1.3 }));
      }

      if (isOutputNode) {
        // Special typographic output format — no pills, plain stat text
        const nameEl = mkEl("text", {
          "font-family": "'EB Garamond', Georgia, serif",
          "font-size": 15, "font-weight": 600, fill: "#2a1e0c",
          x: cx, y: cy + 22, "text-anchor": "middle",
        });
        nameEl.textContent = name;
        g.appendChild(nameEl);

        const rawStats = (nodeData as unknown as { stats?: [string, string][] })?.stats ?? [];
        const stat1 = rawStats[0]?.[1];
        const stat2 = rawStats[1]?.[1];
        if (stat1) {
          const t1 = mkEl("text", {
            "font-family": "'EB Garamond', Georgia, serif",
            "font-size": 13, fill: "#2a1e0c",
            x: cx, y: cy + 40, "text-anchor": "middle",
          });
          t1.textContent = stat1;
          g.appendChild(t1);
        }
        if (stat2) {
          const t2 = mkEl("text", {
            "font-family": "'Geist Mono', monospace",
            "font-size": 11, fill: "#9c8c74",
            x: cx, y: cy + 56, "text-anchor": "middle",
          });
          t2.textContent = stat2;
          g.appendChild(t2);
        }
      } else if (hasFields) {
        const field0 = fields[0];
        const val0 = field0 ? raw[field0.key] : undefined;
        const hasCountry = field0?.key === "country" && val0 != null && String(val0) !== "";
        const noCountry  = field0?.key === "country" && (val0 == null || String(val0) === "");

        // Name: shift up slightly when no country line is shown
        const nameEl = mkEl("text", {
          "font-family": "'EB Garamond', Georgia, serif",
          "font-size": 13, "font-weight": 600, fill: "#2a1e0c",
          x: cx, y: noCountry ? cy + 20 : cy + 24, "text-anchor": "middle",
        });
        nameEl.textContent = name;
        g.appendChild(nameEl);

        // Field 0: country dot+text, or non-country pill
        if (hasCountry) {
          const country = String(val0);
          const dotColor = COUNTRY_COLORS[country] ?? "#9c8c74";
          const dotX = cx - (country.length * 3.2) - 8;
          g.appendChild(mkEl("circle", { cx: dotX, cy: cy + 35, r: 3, fill: dotColor }));
          const locEl = mkEl("text", {
            "font-family": "'Geist Mono', monospace",
            "font-size": 8, fill: "#9c8c74",
            x: cx, y: cy + 39, "text-anchor": "middle", "letter-spacing": "0.03em",
          });
          locEl.textContent = country;
          g.appendChild(locEl);
        } else if (!noCountry && val0 != null && String(val0) !== "") {
          // Non-country field 0 — pill at slot 0
          const pillW = Math.min(Math.max(String(val0).length * 5.8 + 16, 60), 160);
          g.appendChild(mkEl("rect", {
            x: cx - pillW / 2, y: cy + 30, width: pillW, height: 13, rx: 3,
            fill: color.stroke, "fill-opacity": 0.1,
            stroke: color.stroke, "stroke-opacity": 0.25, "stroke-width": 0.5,
          }));
          const t = mkEl("text", {
            "font-family": "'Geist Mono', monospace",
            "font-size": 8, fill: "#6b6458",
            x: cx, y: cy + 40, "text-anchor": "middle", "letter-spacing": "0.04em",
          });
          t.textContent = String(val0);
          g.appendChild(t);
        }

        // Pills shifted up when no country line is present (noCountry or non-country field0)
        const pillDefs = hasCountry
          ? [{ rectY: cy + 46, textY: cy + 56 }, { rectY: cy + 62, textY: cy + 72 }]
          : [{ rectY: cy + 30, textY: cy + 40 }, { rectY: cy + 46, textY: cy + 56 }];
        const pillOffset = (hasCountry || noCountry) ? 0 : 1;

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
            "font-size": 8, fill: "#6b6458",
            x: cx, y: textY, "text-anchor": "middle", "letter-spacing": "0.04em",
          });
          t.textContent = String(val);
          g.appendChild(t);
        });
      } else {
        // No display fields — compact layout, name below ring
        const label = mkEl("text", {
          "font-family": "'EB Garamond', Georgia, serif",
          "font-size": 13, "font-weight": 600, fill: "#2a1e0c",
          x: cx, y: cy + 24, "text-anchor": "middle",
        });
        label.textContent = name;
        g.appendChild(label);
      }

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

    // Shared helper: appends divider line + clickable label to any layer group
    function addDividerAndLabel(
      g: SVGGElement,
      leftNodeCX: number, leftNodeName: string,
      cy: number,
      layerKey: string, layerLabel: string,
      layerColor: { stroke: string; text: string },
      panel: PanelContent | undefined,
    ) {
      const configKey = toConfigKey(layerKey);
      const fields = layerConfig?.[configKey]?.displayFields ?? [];
      const leftNodeData = nodes[leftNodeName] as unknown as Record<string, unknown>;
      const pillTexts = fields.map(f => leftNodeData?.[f.key] ? String(leftNodeData[f.key]) : "").filter(Boolean);
      const allTexts = [leftNodeName, ...pillTexts];
      const maxTextWidth = Math.max(...allTexts.map(t => t.length * 5.8));
      const nodeLeftEdge = leftNodeCX - maxTextWidth / 2 - 8;
      const dividerX = nodeLeftEdge - 36;
      const labelX2 = nodeLeftEdge - 54;

      console.log('[TreeMap] divider layer:', layerKey, '| leftNodeCX:', leftNodeCX, '| nodeLeftEdge:', nodeLeftEdge, '| dividerX:', dividerX);

      g.appendChild(mkEl("line", {
        x1: dividerX, y1: cy - 6,
        x2: dividerX, y2: cy + 70,
        stroke: layerColor.stroke, "stroke-width": 0.5, opacity: 0.6,
      }));

      const labelG = document.createElementNS(NS, "g");
      labelG.style.cursor = "pointer";

      const labelText = mkEl("text", {
        "font-family": "Courier New, monospace",
        "font-size": 11, "font-weight": 600, "letter-spacing": "0.12em",
        fill: "#2a1e0c",
        x: labelX2, y: cy + 30,
        "text-anchor": "end",
      });
      labelText.textContent = layerLabel;
      labelG.appendChild(labelText);

      const underline = mkEl("line", {
        x1: labelX2 - (layerLabel.length * 7), y1: cy + 34,
        x2: labelX2,                            y2: cy + 34,
        stroke: layerColor.stroke, "stroke-width": 0.5, opacity: 0,
      });
      labelG.appendChild(underline);

      labelG.addEventListener("mouseenter", () => underline.setAttribute("opacity", "1"));
      labelG.addEventListener("mouseleave", () => underline.setAttribute("opacity", "0"));
      if (panel) labelG.addEventListener("click", () => onLayerClick(panel));

      g.appendChild(labelG);
    }

    // Output node (last layer — bottom of tree)
    const outG = mkGroup();
    const { outputNode: out } = geometry;
    const outLayer = geometry.layers[geometry.layers.length - 1];
    outG.appendChild(mkNodeGroup(out.cx, out.cy, out.name, outLayer.key, outLayer.color, nodes[out.name], toConfigKey(outLayer.key)));
    addDividerAndLabel(outG, out.cx, out.name, out.cy, outLayer.key, outLayer.label, outLayer.color, layerPanels[outLayer.key]);
    groups.push(outG);

    // Layers: render from bottom up so upper layers paint on top
    for (let li = geometry.layers.length - 2; li >= 0; li--) {
      const layer = geometry.layers[li];
      const nextLayer = geometry.layers[li + 1];

      const edgesToNext = geometry.edges.filter(e => e.fromLayer === li);

      // Edge departure Y depends on how many pills the layer's nodes show
      const layerConfigKey = toConfigKey(layer.key);
      const layerFields = layerConfig?.[layerConfigKey]?.displayFields ?? [];
      // Only subtract 1 when field0 is "country" (shown as dot+text, not a pill)
      const hasCountryField = layerFields[0]?.key === "country";
      const numPills = hasCountryField
        ? Math.max(0, layerFields.length - 1)
        : layerFields.length;
      const departY = layer.cy + (numPills >= 2 ? 83 : numPills === 1 ? 55 : 42);

      const edgeG = mkGroup();
      edgesToNext.forEach(edge => {
        edgeG.appendChild(mkLine(edge.x1, departY, edge.x2, nextLayer.cy - 7, edge.color));
      });
      groups.push(edgeG);

      const nodeG = mkGroup();
      layer.nodes.forEach(n => {
        const nd = nodes[n.name];
        const cfgOverride = nd?.type === "Germanium recycler" ? "recyclers"
          : (layer.key === "supplyNodes" ? "supplyNodes" : undefined);
        nodeG.appendChild(mkNodeGroup(n.cx, n.cy, n.name, layer.key, layer.color, nd, cfgOverride));
      });

      const leftNodeCX = Math.min(...layer.nodes.map(n => n.cx));
      const leftNodeName = layer.nodes.reduce((a, b) => a.cx < b.cx ? a : b).name;
      addDividerAndLabel(nodeG, leftNodeCX, leftNodeName, layer.cy, layer.key, layer.label, layer.color, layerPanels[layer.key]);

      groups.push(nodeG);
    }

    svg.style.pointerEvents = "all";
    groups.forEach((g, i) => {
      contentG.appendChild(g);
      setTimeout(() => g.classList.add("show"), i * 110);
    });
    svg.appendChild(contentG);
  }, [geometry]);

  return (
    <svg
      ref={svgRef}
      id="tree-svg"
      viewBox={`0 0 ${svgWidth} 1000`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        position: "fixed", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 5,
      }}
    >
      <defs />
    </svg>
  );
}
