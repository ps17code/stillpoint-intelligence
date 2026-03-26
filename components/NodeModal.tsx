"use client";
import React, { useEffect } from "react";
import type { NodeData } from "@/types";
import type { LayerGeometry } from "@/lib/treeGeometry";

interface FlowSource {
  pct?: string;
  name: string;
  note?: string;
  tag?: string;
  trend?: string;
}

interface FlowSell {
  name: string;
  product?: string;
  tag?: string;
}

interface NodeModalProps {
  nodeKey: string | null;
  allNodes: Record<string, NodeData>;
  layers: LayerGeometry[];
  chainLabel: string;
  onClose: () => void;
  onNavigate: (key: string) => void;
}

export default function NodeModal({
  nodeKey, allNodes, layers, chainLabel, onClose, onNavigate,
}: NodeModalProps) {
  const node = nodeKey ? (allNodes[nodeKey] as unknown as (NodeData & Record<string, unknown>)) : null;

  const currentLayer = layers.find(l => l.nodes.some(n => n.name === nodeKey));
  const layerNodes = currentLayer?.nodes ?? [];
  const nodeIdx = layerNodes.findIndex(n => n.name === nodeKey);
  const prevNode = nodeIdx > 0 ? layerNodes[nodeIdx - 1] : null;
  const nextNode = nodeIdx < layerNodes.length - 1 ? layerNodes[nodeIdx + 1] : null;

  // Keyboard close
  useEffect(() => {
    if (!nodeKey) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [nodeKey, onClose]);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = nodeKey ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [nodeKey]);

  if (!nodeKey || !node) return null;

  const raw = node as Record<string, unknown>;
  const sources = raw.sources as FlowSource[] | undefined;
  const sells   = raw.sells   as FlowSell[]   | undefined;
  const hasFlow = (sources && sources.length > 0) || (sells && sells.length > 0);
  const stats   = node.stats as [string, string][];

  // Truncate breadcrumb parts for display
  const layerLabel  = currentLayer?.label ?? "";

  const MONO: React.CSSProperties = { fontFamily: "Courier New, monospace" };
  const SERIF: React.CSSProperties = { fontFamily: "'EB Garamond', Georgia, serif" };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(26,26,20,0.3)",
        zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white",
          border: "0.5px solid rgba(80,80,70,0.16)",
          borderRadius: 7,
          width: 560,
          maxHeight: "80vh",
          overflowY: "auto",
          position: "relative",
        }}
      >

        {/* ── A) HEADER ───────────────────────────────────────────────── */}
        <div style={{
          padding: "16px 18px 14px",
          borderBottom: "0.5px solid rgba(80,80,70,0.09)",
        }}>
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 12, right: 12,
              width: 22, height: 22,
              border: "0.5px solid rgba(80,80,70,0.14)",
              borderRadius: 4, background: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              ...MONO, fontSize: 12, color: "#888880",
            }}
          >×</button>

          {/* Breadcrumb */}
          <div style={{
            ...MONO, fontSize: 7.5, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "#aaaaa0", marginBottom: 6,
          }}>
            {[chainLabel, layerLabel, node.type].filter(Boolean).join(" · ")}
          </div>

          {/* Name */}
          <div style={{
            ...SERIF, fontSize: 21, color: "#1a1a14",
            marginBottom: 8, paddingRight: 32,
          }}>
            {nodeKey}
          </div>

          {/* Pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            {raw.country && String(raw.country) !== "" && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, ...MONO, fontSize: 7.5, color: "#888880" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#c8a85a", display: "inline-block" }} />
                {String(raw.country)}
                {node.loc && node.loc !== "" && (
                  <span style={{ color: "#aaaaa0" }}> · {node.loc}</span>
                )}
              </span>
            )}
            {raw.outputVolume && (
              <Pill>{String(raw.outputVolume)}</Pill>
            )}
            {(raw.ticker || raw.ownership) && !raw.outputVolume && (
              <Pill>{String(raw.ticker || raw.ownership)}</Pill>
            )}
          </div>
        </div>

        {/* ── B) FLOW SECTION ─────────────────────────────────────────── */}
        {hasFlow && (
          <div style={{
            borderBottom: "0.5px solid rgba(80,80,70,0.09)",
            background: "#fafaf8",
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
          }}>
            {/* Sources from */}
            <div style={{ padding: "12px 14px" }}>
              <FlowLabel>Sources from</FlowLabel>
              {sources?.map((s, i) => (
                <div key={i} style={{ marginBottom: 7 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, flexWrap: "wrap" }}>
                    {s.pct && (
                      <span style={{ ...MONO, fontSize: 8, color: "#c8a85a", minWidth: 28 }}>{s.pct}</span>
                    )}
                    <span style={{ ...SERIF, fontSize: 12, color: "#1a1a14" }}>{s.name}</span>
                    {s.tag === "closed-loop" && <SlateTag>closed loop</SlateTag>}
                  </div>
                  {s.note && (
                    <div style={{ ...MONO, fontSize: 7.5, color: "#aaaaa0", marginTop: 1, marginLeft: s.pct ? 33 : 0 }}>
                      {s.note}{s.trend === "up" && <span style={{ color: "#5a8c6a", marginLeft: 4 }}>↑</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Center node */}
            <div style={{
              padding: "12px 10px", minWidth: 110,
              borderLeft: "0.5px solid rgba(80,80,70,0.09)",
              borderRight: "0.5px solid rgba(80,80,70,0.09)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ ...SERIF, fontSize: 12, color: "#1a1a14", textAlign: "center", marginBottom: 3 }}>{nodeKey}</div>
              <div style={{ ...MONO, fontSize: 7, color: "#aaaaa0", textTransform: "uppercase", textAlign: "center", marginBottom: 8 }}>{node.type}</div>
              <div style={{ fontSize: 14, color: "#888880", marginBottom: 8 }}>↓</div>
              <div style={{ ...MONO, fontSize: 7, color: "#aaaaa0", textTransform: "uppercase", textAlign: "center" }}>{node.stat}</div>
            </div>

            {/* Sells to */}
            <div style={{ padding: "12px 14px" }}>
              <FlowLabel>Sells to</FlowLabel>
              {sells?.map((s, i) => (
                <div key={i} style={{ marginBottom: 7 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, flexWrap: "wrap" }}>
                    <span style={{ ...SERIF, fontSize: 12, color: "#1a1a14" }}>{s.name}</span>
                    {s.tag === "also-sources-from" && <SlateTag>also sources from</SlateTag>}
                  </div>
                  {s.product && (
                    <div style={{ ...MONO, fontSize: 7.5, color: "#aaaaa0", marginTop: 1 }}>{s.product}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── C) STATS ROW ────────────────────────────────────────────── */}
        {stats.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
            borderBottom: "0.5px solid rgba(80,80,70,0.09)",
          }}>
            {stats.slice(0, 4).map(([key, value], i) => {
              const isPositive = value.includes("+") || /\bup\b/i.test(value);
              return (
                <div key={i} style={{
                  padding: "10px 14px",
                  borderRight: i < Math.min(stats.length, 4) - 1
                    ? "0.5px solid rgba(80,80,70,0.07)" : "none",
                }}>
                  <div style={{ ...MONO, fontSize: 7, textTransform: "uppercase", letterSpacing: "0.1em", color: "#aaaaa0", marginBottom: 3 }}>{key}</div>
                  <div style={{ ...SERIF, fontSize: 13, color: isPositive ? "#5a8c6a" : "#1a1a14" }}>{value}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── D) BODY ─────────────────────────────────────────────────── */}
        <div style={{ padding: "14px 18px" }}>
          {node.role && node.role !== "" && (
            <div style={{ marginBottom: 12 }}>
              <SectionLabel>Role in chain</SectionLabel>
              <div style={{ ...SERIF, fontSize: 13, color: "#3a3a32", lineHeight: 1.7 }}>{node.role}</div>
            </div>
          )}
          {node.inv && node.inv !== "" && (
            <div style={{ marginBottom: 12 }}>
              <SectionLabel>Investment angle</SectionLabel>
              <div style={{ ...SERIF, fontSize: 13, color: "#3a3a32", lineHeight: 1.7 }}>{node.inv}</div>
            </div>
          )}
          {node.risks && node.risks.length > 0 && (
            <div style={{
              background: "rgba(138,48,48,0.04)",
              border: "0.5px solid rgba(138,48,48,0.1)",
              borderRadius: 4, padding: "8px 11px",
            }}>
              <span style={{ ...MONO, fontSize: 9, color: "#8a3030", marginRight: 6 }}>!</span>
              <span style={{ ...SERIF, fontSize: 12, color: "#6b3a3a", lineHeight: 1.55 }}>
                {node.risks.join(" · ")}
              </span>
            </div>
          )}
        </div>

        {/* ── E) FOOTER ───────────────────────────────────────────────── */}
        <div style={{
          borderTop: "0.5px solid rgba(80,80,70,0.09)",
          padding: "9px 18px",
          background: "#fafaf8",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ ...MONO, fontSize: 7.5, color: "#aaaaa0" }}>
            {node.type}
            {(raw.ticker || raw.ownership) ? ` · ${String(raw.ticker || raw.ownership)}` : ""}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <NavBtn disabled={!prevNode} onClick={() => prevNode && onNavigate(prevNode.name)}>← prev</NavBtn>
            <NavBtn disabled={!nextNode} onClick={() => nextNode && onNavigate(nextNode.name)}>next →</NavBtn>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Small reusable sub-components ─────────────────────────────────────────────

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "Courier New, monospace",
      fontSize: 7.5, color: "#888880",
      background: "rgba(80,80,70,0.06)",
      border: "0.5px solid rgba(80,80,70,0.15)",
      borderRadius: 3, padding: "2px 6px",
    }}>{children}</span>
  );
}

function FlowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "Courier New, monospace",
      fontSize: 7, letterSpacing: "0.12em",
      textTransform: "uppercase", color: "#aaaaa0", marginBottom: 8,
    }}>{children}</div>
  );
}

function SlateTag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "Courier New, monospace",
      fontSize: 6.5, color: "#5a7a9c",
      background: "rgba(90,122,156,0.08)",
      border: "0.5px solid rgba(90,122,156,0.2)",
      borderRadius: 3, padding: "1px 4px",
    }}>{children}</span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "Courier New, monospace",
      fontSize: 7, textTransform: "uppercase",
      letterSpacing: "0.1em", color: "#aaaaa0", marginBottom: 5,
    }}>{children}</div>
  );
}

function NavBtn({ children, disabled, onClick }: { children: React.ReactNode; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: "Courier New, monospace",
        fontSize: 7.5,
        border: "0.5px solid rgba(80,80,70,0.2)",
        borderRadius: 3, padding: "3px 9px",
        background: "none",
        cursor: disabled ? "default" : "pointer",
        color: disabled ? "#aaaaa0" : "#3a3a32",
      }}
    >{children}</button>
  );
}
