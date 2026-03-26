"use client";
import React, { useEffect } from "react";
import LayerBrief from "./LayerBrief";

interface BriefParagraph { layer: string; summary?: string; text: string; }
interface BriefStat { num: string; label: string; color?: string; }

interface BriefModalProps {
  isOpen: boolean;
  title: string;
  paragraphs: BriefParagraph[];
  stats: BriefStat[];
  onClose: () => void;
}

export default function BriefModal({ isOpen, title, paragraphs, stats, onClose }: BriefModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(26,26,20,0.3)",
        zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white",
          border: "0.5px solid rgba(80,80,70,0.16)",
          borderRadius: 7,
          width: 700,
          maxHeight: "82vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "14px 22px 12px",
          borderBottom: "0.5px solid rgba(80,80,70,0.09)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{
            fontFamily: "Courier New, monospace",
            fontSize: 8, letterSpacing: "0.16em",
            textTransform: "uppercase" as const,
            color: "#aaaaa0",
          }}>
            Layer Brief · {title}
          </div>
          <button
            onClick={onClose}
            style={{
              width: 22, height: 22,
              border: "0.5px solid rgba(80,80,70,0.14)",
              borderRadius: 4, background: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Courier New, monospace", fontSize: 12, color: "#888880",
            }}
          >×</button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px 28px 28px" }}>
          <LayerBrief paragraphs={paragraphs} stats={stats} />
        </div>
      </div>
    </div>
  );
}
