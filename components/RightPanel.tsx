"use client";
import type { PanelContent, NodeData } from "@/types";

interface RightPanelProps {
  isOpen: boolean;
  content: PanelContent | null;
  onClose: () => void;
}

function BigStats({ stats }: { stats: { val: string; key: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: "rgba(242,237,227,0.8)", borderRadius: 4, padding: 10, textAlign: "center" }}>
          <div style={{ fontSize: 18, color: "var(--ink)", lineHeight: 1, marginBottom: 4 }}>{s.val}</div>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 8, color: "var(--ink3)", letterSpacing: "0.06em" }}>{s.key}</div>
        </div>
      ))}
    </div>
  );
}

function StatsGrid({ stats }: { stats: [string, string][] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {stats.map(([k, v], i) => (
        <div key={i} style={{ background: "rgba(242,237,227,0.6)", borderRadius: 4, padding: "8px 10px" }}>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 8, color: "var(--ink3)", letterSpacing: "0.08em", marginBottom: 3 }}>{k}</div>
          <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.2 }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

export function buildNodePanelContent(key: string, node: NodeData): PanelContent {
  const sections: PanelContent["sections"] = [];
  if (node.stats?.length) {
    sections.push({ label: "Key figures", type: "bigstats" as const, stats: node.stats.map(([k, v]) => ({ val: v, key: k })) });
  }
  if (node.role) sections.push({ label: "Supply chain role", type: "prose", content: node.role });
  if (node.inv)  sections.push({ label: "Investment angle",  type: "angle", content: node.inv });
  if (node.risks?.length) sections.push({ label: "Risk flags", type: "risks", content: node.risks });
  return { context: node.type, title: key, sub: node.loc, sections };
}

export default function RightPanel({ isOpen, content, onClose }: RightPanelProps) {
  const tabChevron = (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
      <polyline points={isOpen ? "7,2 2,8 7,14" : "3,2 8,8 3,14"} stroke="#a89060" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <>
      {/* Reopen button — visible when panel is closed */}
      {!isOpen && content && (
        <button
          onClick={onClose}  // onClose is reused as toggle
          style={{
            position: "fixed", right: 0, top: "50%", transform: "translateY(-50%)",
            width: 28, height: 56,
            background: "white", border: "1px solid rgba(80,80,70,0.25)", borderRight: "none",
            borderRadius: "6px 0 0 6px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 490,
            boxShadow: "-3px 0 12px rgba(0,0,0,0.06)",
          }}
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <polyline points="7,2 2,8 7,14" stroke="#a89060" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "var(--panel-w)",
          background: "white",
          borderLeft: "1px solid rgba(80,80,70,0.25)",
          zIndex: 500,
          display: "flex", flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
          overflow: "visible",
        }}
      >
        {/* Retract tab */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", left: -32, top: "50%", transform: "translateY(-50%)",
            width: 32, height: 64,
            background: "white", border: "1px solid rgba(80,80,70,0.25)", borderRight: "none",
            borderRadius: "6px 0 0 6px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            boxShadow: "-3px 0 12px rgba(0,0,0,0.04)",
          }}
        >
          {tabChevron}
        </button>

        {/* Header */}
        {content && (
          <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid rgba(80,80,70,0.2)", flexShrink: 0 }}>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink4)", marginBottom: 8 }}>
              {content.context}
            </div>
            <div style={{ fontSize: 20, color: "var(--ink)", lineHeight: 1.2, marginBottom: 4 }}>
              {content.title}
            </div>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 9, color: "var(--ink3)", letterSpacing: "0.04em" }}>
              {content.sub}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="thin-scroll" style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {content?.sections.map((sec, si) => (
            <div key={si} style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink4)", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid rgba(80,80,70,0.2)" }}>
                {sec.label}
              </div>

              {sec.type === "bigstats" && sec.stats && <BigStats stats={sec.stats} />}

              {sec.type === "prose" && typeof sec.content === "string" && (
                <p style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.75 }}>{sec.content}</p>
              )}

              {sec.type === "risks" && Array.isArray(sec.content) && (
                <div>
                  {(sec.content as string[]).map((r, ri) => (
                    <div key={ri} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8, padding: "8px 10px", background: "rgba(140,90,42,0.05)", borderRadius: 4, borderLeft: "2px solid #c8855a" }}>
                      <div style={{ fontSize: 10, color: "#c8855a", marginTop: 2, flexShrink: 0 }}>▲</div>
                      <div style={{ fontSize: 12, color: "var(--ink2)", lineHeight: 1.55 }}>{r}</div>
                    </div>
                  ))}
                </div>
              )}

              {sec.type === "angle" && typeof sec.content === "string" && (
                <div style={{ background: "rgba(26,58,92,0.04)", borderLeft: "2px solid #5a7a9c", padding: "10px 12px", borderRadius: "0 4px 4px 0", fontSize: 12, color: "var(--ink2)", lineHeight: 1.65 }}>
                  {sec.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
