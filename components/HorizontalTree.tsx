"use client";
import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import type { TreeGeometry } from "@/lib/treeGeometry";
import type { NodeData } from "@/types";

/* ── Country dot colors ── */
const COUNTRY_COLORS: Record<string, string> = {
  "China": "#c8a85a", "USA": "#5a7a9c", "Japan": "#c8855a",
  "France": "#7a9abc", "Italy": "#7a9abc", "Belgium": "#7a9abc",
  "Canada": "#5a7a9c", "Russia": "#8c5a5a", "DRC": "#5a8c6a",
  "UAE": "#5a8c6a", "Saudi Arabia": "#5a8c6a",
  "Guinea": "#5a8c6a", "Australia": "#5a9c7a", "Brazil": "#6a9c5a",
  "Indonesia": "#6a8c7a", "Greece": "#7a9abc", "Germany": "#7a9abc",
  "South Korea": "#5a7a9c", "Global": "#888880", "Multiple": "#888880",
};

/* ── Layout constants (scaled 90%) ── */
const CARD_WIDTH = 115;
const CARD_GAP = 7;
const COLUMN_GAP = 42;

/* ── Types ── */
interface HorizontalTreeProps {
  geometry: TreeGeometry;
  nodes: Record<string, NodeData>;
  layerConfig: Record<string, { displayFields: { key: string; label: string }[] }>;
  onNodeClick?: (name: string) => void;
  /** Optional downstream demand items rendered as a final column */
  downstream?: { id: string; name: string; pill: string }[];
}

/* ── Individual node card ── */
function NodeCard({
  name,
  nodeData,
  displayFields,
  opacity,
  highlighted,
  dimmedByHover,
  onClick,
  onHover,
  onLeave,
  cardRef,
}: {
  name: string;
  nodeData: NodeData | undefined;
  displayFields: { key: string; label: string }[];
  opacity: number;
  highlighted?: boolean;
  dimmedByHover?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  onLeave?: () => void;
  cardRef?: React.Ref<HTMLDivElement>;
}) {
  const raw = nodeData as unknown as Record<string, unknown>;
  const field0 = displayFields[0];
  const val0 = field0 ? raw?.[field0.key] : undefined;
  const hasCountry = field0?.key === "country" && val0 != null && String(val0) !== "";
  const country = hasCountry ? String(val0) : "";
  const dotColor = COUNTRY_COLORS[country] || "#888";

  // Pill fields (same as vertical TreeMap)
  const pills: string[] = [];
  const pillFields = hasCountry ? displayFields.slice(1, 3) : displayFields.slice(0, 2);
  for (const f of pillFields) {
    const v = raw?.[f.key];
    if (v != null && String(v) !== "") pills.push(String(v));
  }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        padding: "7px 10px",
        background: highlighted ? "rgb(42, 38, 35)" : "rgb(36, 32, 29)",
        border: highlighted ? "1px solid rgb(60, 56, 52)" : "1px solid rgb(45, 41, 39)",
        borderRadius: 5,
        minWidth: 100,
        maxWidth: CARD_WIDTH,
        width: CARD_WIDTH,
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 0.15s, opacity 0.15s, background 0.15s",
        opacity: dimmedByHover ? 0.25 : opacity,
        boxSizing: "border-box",
      }}
    >
      {/* Name */}
      <p style={{
        fontSize: 9, fontWeight: 600, color: "#ece8e1",
        margin: 0, lineHeight: 1.2, marginBottom: hasCountry ? 2 : 3,
        fontFamily: "'EB Garamond', Georgia, serif",
      }}>{name}</p>
      {/* Country dot + label */}
      {hasCountry && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
          <p style={{ fontSize: 6, color: "#706a60", margin: 0, fontFamily: "'Geist Mono', monospace", letterSpacing: "0.03em" }}>{country}</p>
        </div>
      )}
      {/* Pills — same data as vertical tree */}
      {pills.map((pill, i) => (
        <p key={i} style={{ fontSize: 6, color: "rgba(255,255,255,0.62)", margin: "2px 0 0 0", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.04em" }}>{pill}</p>
      ))}
    </div>
  );
}

function toConfigKey(layerKey: string): string {
  return layerKey.toLowerCase().replace(/\s+(\w)/g, (_: string, c: string) => c.toUpperCase());
}

/* ── Main component ── */
export default function HorizontalTree({
  geometry,
  nodes,
  layerConfig,
  onNodeClick,
  downstream,
}: HorizontalTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [lines, setLines] = useState<{ d: string; color: string; fromName: string; toName: string }[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  /* Build adjacency set for hover highlighting */
  const connectedNodes = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const edge of geometry.edges) {
      const fromLayer = geometry.layers[edge.fromLayer];
      const toLayer = geometry.layers[edge.fromLayer + 1];
      if (!fromLayer || !toLayer) continue;
      const fromNode = fromLayer.nodes.find(n => Math.abs(n.cx - edge.x1) < 1);
      const toNode = toLayer.nodes.find(n => Math.abs(n.cx - edge.x2) < 1);
      if (!fromNode || !toNode) continue;
      if (!map.has(fromNode.name)) map.set(fromNode.name, new Set());
      if (!map.has(toNode.name)) map.set(toNode.name, new Set());
      map.get(fromNode.name)!.add(toNode.name);
      map.get(toNode.name)!.add(fromNode.name);
    }
    return map;
  }, [geometry]);

  /* Build a lookup: for each edge, we need source node name -> target node name.
     Edges reference layer indices and node indices via x-coords.
     We map edges through geometry layers to find actual node names. */

  const buildNodeKey = useCallback((layerIdx: number, nodeIdx: number) => {
    const layer = geometry.layers[layerIdx];
    if (!layer) return null;
    return layer.nodes[nodeIdx]?.name ?? null;
  }, [geometry]);

  /* Measure card DOM positions and draw bezier connections */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Small delay to let the DOM settle after render
    const raf = requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect();
      const newLines: { d: string; color: string; fromName: string; toName: string }[] = [];

      // Build a reverse lookup: for each layer, map cx -> node index
      for (const edge of geometry.edges) {
        const fromLayerIdx = edge.fromLayer;
        const toLayerIdx = fromLayerIdx + 1;
        const fromLayer = geometry.layers[fromLayerIdx];
        const toLayer = geometry.layers[toLayerIdx];
        if (!fromLayer || !toLayer) continue;

        // Find source node by matching cx
        const fromNode = fromLayer.nodes.find((n) => Math.abs(n.cx - edge.x1) < 1);
        // Find target node by matching cx
        const toNode = toLayer.nodes.find((n) => Math.abs(n.cx - edge.x2) < 1);
        if (!fromNode || !toNode) continue;

        const fromKey = `layer-${fromLayerIdx}-${fromNode.name}`;
        const toKey = `layer-${toLayerIdx}-${toNode.name}`;
        const fromEl = cardRefs.current.get(fromKey);
        const toEl = cardRefs.current.get(toKey);
        if (!fromEl || !toEl) continue;

        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const fromX = fromRect.right - containerRect.left;
        const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
        const toX = toRect.left - containerRect.left;
        const toY = toRect.top + toRect.height / 2 - containerRect.top;
        const midX = (fromX + toX) / 2;

        newLines.push({
          d: `M ${fromX},${fromY} C ${midX},${fromY} ${midX},${toY} ${toX},${toY}`,
          color: edge.color,
          fromName: fromNode.name,
          toName: toNode.name,
        });
      }

      // Also draw edges from last layer to output node
      const lastLayerIdx = geometry.layers.length - 1;
      const lastLayer = geometry.layers[lastLayerIdx];
      if (lastLayer) {
        // Check if last layer itself is the output
        const isLastLayerOutput = lastLayer.nodes.length === 1 && lastLayer.nodes[0].name === geometry.outputNode.name;
        if (!isLastLayerOutput) {
          // Draw edges from last layer nodes to the output node
          for (const node of lastLayer.nodes) {
            const fromKey = `layer-${lastLayerIdx}-${node.name}`;
            const toKey = "output-node";
            const fromEl = cardRefs.current.get(fromKey);
            const toEl = cardRefs.current.get(toKey);
            if (!fromEl || !toEl) continue;

            const fromRect = fromEl.getBoundingClientRect();
            const toRect = toEl.getBoundingClientRect();

            const fromX = fromRect.right - containerRect.left;
            const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
            const toX = toRect.left - containerRect.left;
            const toY = toRect.top + toRect.height / 2 - containerRect.top;
            const midX = (fromX + toX) / 2;

            newLines.push({
              d: `M ${fromX},${fromY} C ${midX},${fromY} ${midX},${toY} ${toX},${toY}`,
              color: lastLayer.color.stroke,
              fromName: node.name,
              toName: geometry.outputNode.name,
            });
          }
        }
      }

      setSvgSize({ w: container.scrollWidth, h: container.scrollHeight });
      setLines(newLines);
    });

    return () => cancelAnimationFrame(raf);
  }, [geometry, buildNodeKey]);

  /* Determine if the output node is already in the last layer */
  const lastLayer = geometry.layers[geometry.layers.length - 1];
  const outputInLastLayer =
    lastLayer &&
    lastLayer.nodes.length === 1 &&
    lastLayer.nodes[0].name === geometry.outputNode.name;

  /* Columns: layers + (optionally) output + (optionally) downstream */
  const columns: {
    key: string;
    label: string;
    nodes: { name: string; opacity: number; refKey: string }[];
  }[] = geometry.layers.map((layer, li) => ({
    key: layer.key,
    label: layer.label,
    nodes: layer.nodes.map((n) => ({
      name: n.name,
      opacity: n.opacity,
      refKey: `layer-${li}-${n.name}`,
    })),
  }));

  if (!outputInLastLayer) {
    columns.push({
      key: "output",
      label: "OUTPUT",
      nodes: [
        {
          name: geometry.outputNode.name,
          opacity: 1,
          refKey: "output-node",
        },
      ],
    });
  }

  if (downstream && downstream.length > 0) {
    columns.push({
      key: "downstream",
      label: "DOWNSTREAM DEMAND",
      nodes: downstream.map((d) => ({
        name: d.name,
        opacity: 1,
        refKey: `downstream-${d.id}`,
      })),
    });
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "flex",
        gap: COLUMN_GAP,
        padding: "28px 0",
        overflowX: "auto",
        overflowY: "visible",
        maxWidth: "100%",
        margin: "0 auto",
      }}
    >
      {/* Columns */}
      {columns.map((col) => (
        <div
          key={col.key}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: CARD_GAP,
            minWidth: CARD_WIDTH,
            flexShrink: 0,
          }}
        >
          {/* Layer label */}
          <p
            style={{
              fontSize: 6,
              letterSpacing: "0.1em",
              color: "#4a4540",
              textTransform: "uppercase",
              margin: "0 0 5px 0",
              fontFamily: "'Geist Mono', monospace",
              whiteSpace: "nowrap",
            }}
          >
            {col.label}
          </p>
          {/* Node cards */}
          {col.nodes.map((node) => {
            // For downstream items, render a simpler pill card
            if (col.key === "downstream") {
              const dsItem = downstream?.find((d) => d.name === node.name);
              return (
                <div
                  key={node.name}
                  ref={(el) => {
                    if (el) cardRefs.current.set(node.refKey, el);
                  }}
                  style={{
                    padding: "7px 10px",
                    background: "rgb(36, 32, 29)",
                    border: "1px solid rgb(45, 41, 39)",
                    borderRadius: 5,
                    minWidth: 100,
                    maxWidth: CARD_WIDTH,
                    width: CARD_WIDTH,
                    boxSizing: "border-box",
                  }}
                >
                  <p
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: "#ece8e1",
                      margin: 0,
                      lineHeight: 1.2,
                      fontFamily: "'EB Garamond', Georgia, serif",
                    }}
                  >
                    {node.name}
                  </p>
                  {dsItem?.pill && (
                    <p
                      style={{
                        fontSize: 6,
                        color: "#555",
                        margin: "3px 0 0 0",
                        fontFamily: "'Geist Mono', monospace",
                      }}
                    >
                      {dsItem.pill}
                    </p>
                  )}
                </div>
              );
            }

            const configKey = toConfigKey(col.key);
            const fields = layerConfig?.[configKey]?.displayFields ?? [];
            const isHighlighted = hoveredNode === node.name || (hoveredNode != null && connectedNodes.get(hoveredNode)?.has(node.name));
            const isDimmed = hoveredNode != null && !isHighlighted;
            return (
              <NodeCard
                key={node.name}
                name={node.name}
                nodeData={nodes[node.name]}
                displayFields={fields}
                opacity={node.opacity}
                highlighted={!!isHighlighted}
                dimmedByHover={isDimmed}
                onClick={onNodeClick ? () => onNodeClick(node.name) : undefined}
                onHover={() => setHoveredNode(node.name)}
                onLeave={() => setHoveredNode(null)}
                cardRef={(el: HTMLDivElement | null) => {
                  if (el) cardRefs.current.set(node.refKey, el);
                }}
              />
            );
          })}
        </div>
      ))}

      {/* SVG overlay for connection lines */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: svgSize.w || "100%",
          height: svgSize.h || "100%",
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        {lines.map((line, i) => {
          const lineHighlighted = hoveredNode != null && (line.fromName === hoveredNode || line.toName === hoveredNode);
          const lineDimmed = hoveredNode != null && !lineHighlighted;
          return (
            <path
              key={i}
              d={line.d}
              fill="none"
              stroke={lineHighlighted ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.18)"}
              strokeWidth={lineHighlighted ? "1.2" : "0.8"}
              strokeDasharray="4,3"
              style={{ opacity: lineDimmed ? 0.15 : 1, transition: "opacity 0.15s, stroke 0.15s, stroke-width 0.15s" }}
            />
          );
        })}
      </svg>
    </div>
  );
}
