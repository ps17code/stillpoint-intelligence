"use client";
import React, { useEffect } from "react";
import type { NodeData } from "@/types";
import type { LayerGeometry } from "@/lib/treeGeometry";

interface NodeModalProps {
  nodeKey: string | null;
  allNodes: Record<string, NodeData>;
  layers: LayerGeometry[];
  chainLabel: string;
  onClose: () => void;
  onNavigate: (key: string) => void;
}

function BoldText({ text }: { text: string }) {
  const parts = text.split(/(<b>[\s\S]*?<\/b>)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("<b>") && part.endsWith("</b>") ? (
          <strong key={i} style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
            {part.slice(3, -4)}
          </strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

function BodySection({ text }: { text: string }) {
  const paragraphs = text.split("\n\n");
  return (
    <div>
      {paragraphs.map((para, i) => (
        <p
          key={i}
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.7,
            margin: i > 0 ? "10px 0 0 0" : "0",
          }}
        >
          <BoldText text={para} />
        </p>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "'Courier New', monospace",
      fontSize: 7,
      fontWeight: 500,
      textTransform: "uppercase" as const,
      letterSpacing: "0.06em",
      color: "rgba(255,255,255,0.3)",
      paddingBottom: 6,
      borderBottom: "0.5px solid rgba(255,255,255,0.06)",
      marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

export default function NodeModal({
  nodeKey, allNodes, onClose,
}: NodeModalProps) {
  const node = nodeKey
    ? (allNodes[nodeKey] as unknown as NodeData & Record<string, unknown>)
    : null;

  useEffect(() => {
    if (!nodeKey) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [nodeKey, onClose]);

  useEffect(() => {
    document.body.style.overflow = nodeKey ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [nodeKey]);

  if (!nodeKey || !node) return null;

  const raw = node as Record<string, unknown>;
  const stats = (node.stats ?? []) as [string, string][];
  const displayName = raw.displayName as string | undefined;
  const ticker = raw.ticker as string | undefined;
  const rawMeta = raw.meta as string | undefined;
  const meta = rawMeta?.replace(/ · Founded \d+/g, "");
  const geclRelevance = raw.geclRelevance as string | undefined;
  const isOutputNode = node.type === "Output node";

  const MONO: React.CSSProperties = { fontFamily: "'Courier New', monospace" };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#1C1E21",
          borderRadius: 12,
          width: 500,
          maxHeight: "80vh",
          overflowY: "auto",
          position: "relative",
        }}
      >

        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <div style={{
          padding: "18px 20px 14px",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: meta ? 5 : 0,
          }}>
            {/* Name + ticker inline */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
              <span style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontSize: 17,
                fontWeight: 500,
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.3,
              }}>
                {displayName ?? nodeKey}
              </span>
              {ticker && (
                <span style={{
                  ...MONO,
                  fontSize: 9,
                  color: "rgba(155,168,171,0.6)",
                  border: "0.5px solid rgba(155,168,171,0.15)",
                  padding: "3px 8px",
                  borderRadius: 6,
                  whiteSpace: "nowrap" as const,
                }}>
                  {ticker}
                </span>
              )}
            </div>
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                ...MONO,
                fontSize: 12,
                color: "rgba(255,255,255,0.15)",
                padding: 0,
                lineHeight: 1,
                flexShrink: 0,
                marginTop: 3,
              }}
            >✕</button>
          </div>
          {meta && (
            <div style={{ ...MONO, fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
              {meta}
            </div>
          )}
        </div>

        {/* ── STATS ROW ─────────────────────────────────────────────── */}
        {stats.length > 0 && (
          <div style={{ padding: "12px 20px 14px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
              gap: 1,
              background: "rgba(255,255,255,0.04)",
              borderRadius: 6,
              overflow: "hidden",
            }}>
              {stats.slice(0, 4).map(([label, value], i) => (
                <div key={i} style={{ background: "#1C1E21", padding: "10px 12px" }}>
                  <div style={{
                    ...MONO,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.8)",
                    marginBottom: 3,
                    lineHeight: 1.2,
                  }}>
                    {value}
                  </div>
                  <div style={{
                    ...MONO,
                    fontSize: 6.5,
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.04em",
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BODY ──────────────────────────────────────────────────── */}
        <div style={{ padding: "16px 20px 20px" }}>
          {node.role && node.role !== "" && (
            <div style={{ marginBottom: 14 }}>
              <SectionLabel>
                {isOutputNode ? "What it is" : "What the company does"}
              </SectionLabel>
              <BodySection text={node.role} />
            </div>
          )}
          {geclRelevance && geclRelevance !== "" && (
            <div>
              <SectionLabel>
                {isOutputNode ? "Layer output" : "GeCl\u2084 relevance"}
              </SectionLabel>
              <BodySection text={geclRelevance} />
            </div>
          )}
          {!geclRelevance && node.inv && node.inv !== "" && (
            <div>
              <SectionLabel>Investment angle</SectionLabel>
              <BodySection text={node.inv} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
