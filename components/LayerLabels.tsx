"use client";
import type { LayerGeometry } from "@/lib/treeGeometry";
import type { PanelContent } from "@/types";

interface LayerLabelsProps {
  layers: LayerGeometry[];
  visible: boolean;
  viewportHeight: number;
  onLayerClick: (panel: PanelContent) => void;
  layerPanels: Record<string, PanelContent>;
}

export default function LayerLabels({ layers, visible, viewportHeight, onLayerClick, layerPanels }: LayerLabelsProps) {
  return (
    <div
      style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: 110,
        pointerEvents: visible ? "all" : "none",
        zIndex: 200,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    >
      {/* Vertical divider line */}
      <div style={{
        position: "absolute", right: 0, top: 60, bottom: 60,
        width: 1, background: "var(--gold)", opacity: 0.5,
      }} />

      {layers.map((layer) => {
        // Convert SVG cy (0-1000) to viewport px
        const labelPxY = ((layer.cy - 14) / 1000) * viewportHeight;
        const panel = layerPanels[layer.key];

        return (
          <div
            key={layer.key}
            onClick={() => panel && onLayerClick(panel)}
            style={{
              position: "absolute",
              right: 14,
              top: labelPxY,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: panel ? "pointer" : "default",
              padding: "4px 0",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <div style={{ width: 5, height: 5, background: layer.color.pip, flexShrink: 0 }} />
            <div style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 8,
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
              color: layer.color.text,
            }}>
              {layer.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
