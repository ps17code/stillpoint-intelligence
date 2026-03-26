"use client";
import React from "react";

interface BriefParagraph { layer: string; text: string; }
interface BriefStat { num: string; label: string; color?: string; }

interface LayerBriefProps {
  paragraphs: BriefParagraph[];
  stats: BriefStat[];
}

const STAT_COLORS: Record<string, string> = {
  red:   "#8a3030",
  amber: "#7a5a10",
  slate: "#3a5a7a",
};

export default function LayerBrief({ paragraphs, stats }: LayerBriefProps) {
  return (
    <div style={{ padding: "32px 52px 36px", background: "white" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        {/* Paragraphs */}
        {paragraphs.map((p, i) => (
          <div key={i} style={{ marginBottom: i < paragraphs.length - 1 ? 22 : 16 }}>
            {/* Layer label with flanking lines */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
            }}>
              <div style={{ flex: 1, height: "0.5px", background: "rgba(80,80,70,0.12)" }} />
              <span style={{
                fontFamily: "Courier New, monospace",
                fontSize: 7.5, letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color: "#aaaaa0",
                whiteSpace: "nowrap" as const,
              }}>{p.layer}</span>
              <div style={{ flex: 1, height: "0.5px", background: "rgba(80,80,70,0.12)" }} />
            </div>

            {/* Body text */}
            <div style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 14, color: "#3a3a32",
              lineHeight: 1.8,
            }}>{p.text}</div>
          </div>
        ))}

        {/* Stats row */}
        {stats.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            gap: 8,
            marginTop: 8,
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                background: "#F2F2F0",
                border: "0.5px solid rgba(80,80,70,0.1)",
                borderRadius: 5,
                padding: "12px 14px",
                textAlign: "center" as const,
              }}>
                <div style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: 19,
                  color: s.color ? (STAT_COLORS[s.color] ?? "#1a1a14") : "#1a1a14",
                  lineHeight: 1.1,
                  marginBottom: 5,
                }}>{s.num}</div>
                <div style={{
                  fontFamily: "Courier New, monospace",
                  fontSize: 7, letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  color: "#aaaaa0",
                  lineHeight: 1.4,
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
