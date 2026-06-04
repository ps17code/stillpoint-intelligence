"use client";
import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import type { TreeGeometry } from "@/lib/treeGeometry";
import type { NodeData } from "@/types";
import universalNodesJson from "@/data/universal-nodes.json";
const uNodes = universalNodesJson as unknown as Record<string, { quantity_pill?: string; country?: string }>;

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

/* ── Layout constants ── */
const CARD_WIDTH = 94;
const CARD_GAP = 5;
const COLUMN_GAP = 34;

/* ── Types ── */
interface HorizontalTreeProps {
  geometry: TreeGeometry;
  nodes: Record<string, NodeData>;
  layerConfig: Record<string, { displayFields: { key: string; label: string }[] }>;
  onNodeClick?: (name: string) => void;
  /** Optional downstream demand items rendered as a final column */
  downstream?: { id: string; name: string; pill: string }[];
  onDownstreamClick?: (id: string) => void;
  /** Inline chain-specific nodes (supply aggregates, output) not in universal data */
  inlineNodes?: Record<string, { quantity_pill?: string; descriptor_pill?: string; country?: string; flags?: string[] }>;
  /** Accent color for the input (used for idea dots) */
  accentColor?: string;
  /** Set of node names that are group/summary nodes (styled differently) */
  groupNodes?: Set<string>;
  /** Callback when user clicks back on a layer; receives layer key */
  onLayerBack?: (layerKey: string) => void;
  /** Set of layer keys that are expanded (show back button) */
  expandedLayers?: Set<string>;
}

/* ── Country code mapping for flag icons ── */
const COUNTRY_CODES: Record<string, string> = {
  "China": "cn", "USA": "us", "Belgium": "be", "Canada": "ca", "Russia": "ru",
  "DRC": "cd", "Japan": "jp", "Germany": "de", "France": "fr", "Italy": "it",
  "Australia": "au", "Brazil": "br", "Indonesia": "id", "India": "in",
  "Guinea": "gn", "South Korea": "kr", "Austria": "at", "Netherlands": "nl",
  "UAE": "ae", "Saudi Arabia": "sa", "Greece": "gr", "Global": "un", "Multiple": "un",
};

/* ── Nodes with investment briefs ── */
const IDEA_NODES = new Set([
  "Umicore", "5N Plus", "Teck Resources", "STL / Gécamines", "Blue Moon Metals",
  "LightPath Technologies", "Yunnan Chihong", "Corning", "YOFC", "Prysmian",
  "Fujikura", "Sumitomo Electric", "Shin-Etsu", "Alcoa Corporation",
  "Metlen Energy & Metals", "Rio Tinto / Indium JV", "Korea Zinc / Crucible JV",
  "Dowa Holdings", "CommScope",
]);
const IDEA_DOT_COLOR = "#6a9ab8";

/* ── Individual node card ── */
function NodeCard({
  name,
  nodeData,
  displayFields,
  opacity,
  highlighted,
  dimmedByHover,
  isActiveNode,
  onClick,
  onHover,
  onLeave,
  cardRef,
  inlineNodeData,
  accentColor,
  isGroup,
}: {
  name: string;
  nodeData: NodeData | undefined;
  displayFields: { key: string; label: string }[];
  opacity: number;
  highlighted?: boolean;
  isActiveNode?: boolean;
  dimmedByHover?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  onLeave?: () => void;
  cardRef?: React.Ref<HTMLDivElement>;
  inlineNodeData?: { quantity_pill?: string; descriptor_pill?: string; country?: string; flags?: string[] };
  accentColor?: string;
  isGroup?: boolean;
}) {
  const raw = nodeData as unknown as Record<string, unknown>;
  const inl = inlineNodeData;
  const country = String(raw?.["country"] ?? inl?.country ?? "");
  const hasCountry = country !== "";
  const countryCode = COUNTRY_CODES[country] || "";
  const hasIdea = IDEA_NODES.has(name);

  // Output line — only quantity_pill, check inline data first
  const qtyVal = inl?.quantity_pill ?? raw?.["quantity_pill"];
  const outputLine = qtyVal != null && String(qtyVal) !== "" ? String(qtyVal) : "";

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        padding: "5px 8px",
        background: isActiveNode ? "rgba(200, 122, 74, 0.18)" : highlighted ? "rgba(200, 122, 74, 0.1)" : isGroup ? "rgb(42, 38, 34)" : "rgb(36, 32, 29)",
        border: isActiveNode ? "1px solid #c87a4a" : highlighted ? "1px solid rgba(200, 122, 74, 0.5)" : isGroup ? "1px solid rgb(60, 55, 48)" : "1px solid rgb(45, 41, 39)",
        borderRadius: 4,
        width: "100%",
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 0.15s, opacity 0.15s, background 0.15s",
        opacity: dimmedByHover ? 0.25 : opacity,
        boxSizing: "border-box",
        position: "relative" as const,
      }}
    >
      {/* Investment idea dot — marks nodes in the opportunities / investment idea list */}
      {hasIdea && (() => {
        const BRIGHT: Record<string, string> = { "#81713c": "#c8a85a", "#6a9ab8": "#8ec4e8", "#7a8a6a": "#a8c890" };
        const dotColor = BRIGHT[accentColor ?? ""] ?? accentColor ?? IDEA_DOT_COLOR;
        return (
          <div style={{
            position: "absolute", left: -5, top: "50%", transform: "translateY(-50%)",
            width: 8, height: 8, borderRadius: "50%", background: dotColor,
            border: "1px solid rgb(36, 32, 29)",
            boxShadow: `0 0 4px ${dotColor}`,
          }} />
        );
      })()}
      {/* Name */}
      <p style={{
        fontSize: 10, fontWeight: 600, color: "#ece8e1",
        margin: 0, lineHeight: 1.2, marginBottom: 4,
        fontFamily: "'EB Garamond', Georgia, serif",
        whiteSpace: "nowrap",
      }}>{name}</p>
      {/* Flags row — multiple flags for group nodes */}
      {inl?.flags && inl.flags.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: outputLine ? 4 : 0 }}>
          {inl.flags.map((f, fi) => (
            <img key={fi} src={`https://flagcdn.com/16x12/${f}.png`} alt="" style={{ width: 10, height: 7, objectFit: "cover", borderRadius: 1, opacity: 0.7 }} />
          ))}
        </div>
      )}
      {/* Flag + country — single country */}
      {!inl?.flags && hasCountry && (
        <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: outputLine ? 4 : 0 }}>
          {countryCode && (
            <img
              src={`https://flagcdn.com/16x12/${countryCode}.png`}
              alt={country}
              style={{ width: 9, height: 6, objectFit: "cover", borderRadius: 1, opacity: 0.7 }}
            />
          )}
          <p style={{ fontSize: 7, color: "#706a60", margin: 0, fontFamily: "'Geist Mono', monospace", letterSpacing: "0.03em", whiteSpace: "nowrap" }}>{country}</p>
        </div>
      )}
      {/* Output line */}
      {outputLine && (
        <p style={{ fontSize: 8, color: "rgba(255,255,255,0.55)", margin: 0, fontFamily: "'Geist Mono', monospace", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{outputLine}</p>
      )}
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
  onDownstreamClick,
  inlineNodes,
  accentColor,
  groupNodes,
  onLayerBack,
  expandedLayers,
}: HorizontalTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [lines, setLines] = useState<{ d: string; color: string; fromName: string; toName: string; fromX: number; fromY: number }[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [clickedNode, setClickedNode] = useState<string | null>(null);
  const activeNode = clickedNode ?? hoveredNode;

  /* Dependency chain for the active node — only its upstream ancestors and downstream
     descendants (directed), so hovering a node lights the path it actually depends on /
     feeds, not every node reachable through shared hubs. */
  const highlightSet = useMemo(() => {
    if (!activeNode) return null;
    const fwd = new Map<string, string[]>();
    const rev = new Map<string, string[]>();
    for (const l of lines) {
      (fwd.get(l.fromName) ?? fwd.set(l.fromName, []).get(l.fromName)!).push(l.toName);
      (rev.get(l.toName) ?? rev.set(l.toName, []).get(l.toName)!).push(l.fromName);
    }
    const set = new Set<string>([activeNode]);
    const walk = (adj: Map<string, string[]>) => {
      const stack = [activeNode];
      while (stack.length) {
        const cur = stack.pop()!;
        (adj.get(cur) ?? []).forEach(n => { if (!set.has(n)) { set.add(n); stack.push(n); } });
      }
    };
    walk(fwd);
    walk(rev);
    return set;
  }, [activeNode, lines]);

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
      const newLines: { d: string; color: string; fromName: string; toName: string; fromX: number; fromY: number }[] = [];

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
          fromX, fromY,
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
              fromX, fromY,
            });
          }
        }
      }

      // Draw edges from output node (or last layer single node) to downstream
      if (downstream && downstream.length > 0) {
        // Find the output element
        const ll = geometry.layers[geometry.layers.length - 1];
        const outInLast = ll && ll.nodes.length === 1 && ll.nodes[0].name === geometry.outputNode.name;
        const outputKey = outInLast ? `layer-${geometry.layers.length - 1}-${geometry.outputNode.name}` : "output-node";
        const outputEl = cardRefs.current.get(outputKey);
        if (outputEl) {
          for (const ds of downstream) {
            const dsKey = `downstream-${ds.id}`;
            const dsEl = cardRefs.current.get(dsKey);
            if (!dsEl) continue;

            const fromRect = outputEl.getBoundingClientRect();
            const toRect = dsEl.getBoundingClientRect();

            const fromX = fromRect.right - containerRect.left;
            const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
            const toX = toRect.left - containerRect.left;
            const toY = toRect.top + toRect.height / 2 - containerRect.top;
            const midX = (fromX + toX) / 2;

            newLines.push({
              d: `M ${fromX},${fromY} C ${midX},${fromY} ${midX},${toY} ${toX},${toY}`,
              color: "rgba(255,255,255,0.25)",
              fromName: geometry.outputNode.name,
              toName: ds.name,
              fromX, fromY,
            });
          }
        }
      }

      setSvgSize({ w: container.scrollWidth, h: container.scrollHeight });
      setLines(newLines);
    });

    return () => cancelAnimationFrame(raf);
  }, [geometry, buildNodeKey, downstream]);

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
        padding: "0",
        overflow: "visible",
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
            flexShrink: 0,
          }}
        >
          {/* Layer label */}
          <p
            style={{
              fontSize: 6,
              letterSpacing: "0.1em",
              color: "rgb(158, 156, 153)",
              textTransform: "uppercase",
              margin: "0 0 4px 0",
              fontFamily: "'Geist Mono', monospace",
              whiteSpace: "nowrap",
            }}
          >
            {col.label}
            {onLayerBack && expandedLayers?.has(col.key) && (
              <span
                onClick={(e) => { e.stopPropagation(); onLayerBack(col.key); }}
                style={{ marginLeft: 6, fontSize: 7, color: "#81713c", cursor: "pointer", fontWeight: 400, textTransform: "none" as const, letterSpacing: "0" }}
              >
                ← back
              </span>
            )}
          </p>
          {/* Node cards */}
          {col.nodes.map((node) => {
            // For downstream items, render a simpler pill card
            if (col.key === "downstream") {
              const dsItem = downstream?.find((d) => d.name === node.name);
              const isGroupDs = groupNodes?.has(node.name) || node.name.startsWith("Downstream Demand");
              const dsClickable = isGroupDs ? !!onNodeClick : (!!onDownstreamClick && !!dsItem);
              return (
                <div
                  key={node.name}
                  ref={(el) => {
                    if (el) cardRefs.current.set(node.refKey, el);
                  }}
                  onClick={() => {
                    if (isGroupDs && onNodeClick) { onNodeClick(node.name); }
                    else if (dsClickable && dsItem && onDownstreamClick) { onDownstreamClick(dsItem.id); }
                  }}
                  style={{
                    padding: "5px 8px",
                    background: isGroupDs ? "rgb(42, 38, 34)" : "rgb(36, 32, 29)",
                    border: isGroupDs ? "1px solid rgb(60, 55, 48)" : "1px solid rgb(45, 41, 39)",
                    borderRadius: 4,
                    width: "100%",
                    boxSizing: "border-box",
                    cursor: dsClickable ? "pointer" : "default",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={e => { if (dsClickable) e.currentTarget.style.borderColor = "rgb(60, 56, 52)"; }}
                  onMouseLeave={e => { if (dsClickable) e.currentTarget.style.borderColor = isGroupDs ? "rgb(60, 55, 48)" : "rgb(45, 41, 39)"; }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#ece8e1",
                      margin: "0 0 4px 0",
                      lineHeight: 1.2,
                      fontFamily: "'EB Garamond', Georgia, serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {node.name}
                  </p>
                  {dsItem?.pill && (
                    <p
                      style={{
                        fontSize: 8,
                        color: "rgba(255, 255, 255, 0.55)",
                        margin: 0,
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
            const isActive = activeNode === node.name;
            const inChain = highlightSet?.has(node.name) ?? false;
            const isHighlighted = highlightSet != null && inChain;
            const isDimmed = highlightSet != null && !inChain;
            return (
              <NodeCard
                key={node.name}
                name={node.name}
                nodeData={nodes[node.name]}
                displayFields={fields}
                opacity={node.opacity}
                highlighted={isHighlighted}
                isActiveNode={isActive}
                dimmedByHover={isDimmed}
                isGroup={groupNodes?.has(node.name)}
                onClick={onNodeClick ? () => {
                  setClickedNode(prev => prev === node.name ? null : node.name);
                  onNodeClick(node.name);
                } : undefined}
                onHover={() => setHoveredNode(node.name)}
                onLeave={() => setHoveredNode(null)}
                cardRef={(el: HTMLDivElement | null) => {
                  if (el) cardRefs.current.set(node.refKey, el);
                }}
                inlineNodeData={inlineNodes?.[node.name]}
                accentColor={accentColor}
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
          const lineHighlighted = highlightSet != null && highlightSet.has(line.fromName) && highlightSet.has(line.toName);
          const lineDimmed = highlightSet != null && !lineHighlighted;
          return (
            <g key={i} style={{ opacity: lineDimmed ? 0.12 : 1, transition: "opacity 0.15s" }}>
              <circle
                cx={line.fromX}
                cy={line.fromY}
                r="1.5"
                fill={lineHighlighted ? "#c87a4a" : "rgba(200,200,200,0.4)"}
                style={{ transition: "fill 0.15s" }}
              />
              <path
                d={line.d}
                fill="none"
                stroke={lineHighlighted ? "#c87a4a" : "rgba(255,255,255,0.18)"}
                strokeWidth={lineHighlighted ? "1.6" : "0.8"}
                strokeDasharray={lineHighlighted ? undefined : "4,3"}
                style={{ transition: "stroke 0.15s, stroke-width 0.15s" }}
              />
            </g>
          );
        })}
      </svg>

    </div>
  );
}
