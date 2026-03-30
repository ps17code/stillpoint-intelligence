"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

export interface SupplyChainMapProps {
  chainState: 1 | 2 | 3 | 4;
  rawSelection?: string;
  compSelection?: string;
  subSelection?: string;
  euSelection?: string;
  /** When true, SVG fills its container (position absolute inset 0) instead of fixed 380px height */
  fillContainer?: boolean;
}

type Pt = { lon: number; lat: number; name: string; loc: string };
type Layer = { label: string; color: string; nodes: Pt[]; radius?: number };
type Conn = [number, number];
type Flow = { from: number; to: number; connections: Conn[] };

// ── State 1: Germanium Raw Material ─────────────────────────────────────────
const S1_LAYERS: Layer[] = [
  { label: "Deposits", color: "#B8975A", radius: 3, nodes: [
    { lon:100.08, lat:23.88, name: "Yunnan Deposit",       loc: "Yunnan, China" },
    { lon:116.8,  lat:44.5,  name: "Inner Mongolia Deposit", loc: "Inner Mongolia, China" },
    { lon:119.8,  lat:48.5,  name: "Heilongjiang Deposit", loc: "Heilongjiang, China" },
    { lon:103.3,  lat:26.4,  name: "Guizhou Deposit",      loc: "Guizhou, China" },
    { lon:104.1,  lat:27.6,  name: "Sichuan Deposit",      loc: "Sichuan, China" },
    { lon:133.0,  lat:47.5,  name: "Jilin Deposit",        loc: "Jilin, China" },
    { lon:27.5,   lat:-3.5,  name: "Kipushi Deposit",      loc: "DRC" },
    { lon:-162.9, lat:68.1,  name: "Red Dog Deposit",      loc: "Alaska, USA" },
  ]},
  { label: "Miners", color: "#7DA06A", radius: 2.5, nodes: [
    { lon:100.2,  lat:23.5,  name: "Yunnan Chihong",       loc: "Yunnan, China" },
    { lon:117.0,  lat:44.8,  name: "Inner Mongolia Miner", loc: "Inner Mongolia, China" },
    { lon:115.5,  lat:40.0,  name: "Hebei Miner",          loc: "Hebei, China" },
    { lon:103.5,  lat:26.1,  name: "Guizhou Miner",        loc: "Guizhou, China" },
    { lon:132.5,  lat:47.0,  name: "Jilin Miner",          loc: "Jilin, China" },
    { lon:27.8,   lat:-3.8,  name: "Glencore Kipushi",     loc: "DRC" },
    { lon:-120.5, lat:49.3,  name: "Teck Resources",       loc: "British Columbia, Canada" },
  ]},
  { label: "Refiners", color: "#A07DAA", radius: 2.5, nodes: [
    { lon:99.8,   lat:24.2,  name: "Yunnan Refinery",      loc: "Yunnan, China" },
    { lon:113.5,  lat:38.0,  name: "Hebei Refinery",       loc: "Hebei, China" },
    { lon:103.0,  lat:25.8,  name: "Chihong Refinery",     loc: "Yunnan, China" },
    { lon:132.8,  lat:47.8,  name: "Jilin Refinery",       loc: "Jilin, China" },
    { lon:5.5,    lat:51.2,  name: "Umicore",               loc: "Olen, Belgium" },
    { lon:-73.6,  lat:45.5,  name: "5N Plus",               loc: "Montreal, Canada" },
    { lon:-83.0,  lat:42.3,  name: "Indium Corp.",          loc: "Detroit, USA" },
  ]},
];
const S1_FLOWS: Flow[] = [
  { from: 0, to: 1, connections: [[0,0],[1,1],[2,2],[3,3],[4,3],[5,4],[6,5],[7,6]] },
  { from: 1, to: 2, connections: [[0,0],[1,1],[2,1],[3,2],[4,3],[5,4],[6,5]] },
];

// ── State 2: Component ───────────────────────────────────────────────────────
const S2_LAYERS: Layer[] = [
  { label: "GeCl₄ Suppliers",    color: "#9a7b3c", radius: 3, nodes: [
    { lon:5.5,   lat:51.2, name: "Umicore",          loc: "Olen, Belgium" },
    { lon:103.0, lat:25.8, name: "Chihong Supplier", loc: "Yunnan, China" },
    { lon:113.5, lat:38.0, name: "Hebei Supplier",   loc: "Hebei, China" },
    { lon:132.8, lat:47.8, name: "Jilin Supplier",   loc: "Jilin, China" },
  ]},
  { label: "Fiber Manufacturers", color: "#5a7a9c", radius: 2.5, nodes: [
    { lon:-77.0,  lat:42.4, name: "Corning",       loc: "New York, USA" },
    { lon:11.25,  lat:43.77,name: "Prysmian",      loc: "Florence, Italy" },
    { lon:139.7,  lat:35.7, name: "Fujikura",      loc: "Tokyo, Japan" },
    { lon:136.9,  lat:35.2, name: "Sumitomo",      loc: "Osaka, Japan" },
    { lon:136.0,  lat:35.0, name: "OFS Furukawa",  loc: "Aichi, Japan" },
    { lon:117.0,  lat:30.5, name: "YOFC",          loc: "Wuhan, China" },
  ]},
];
const S2_FLOWS: Flow[] = [
  { from: 0, to: 1, connections: [[0,0],[0,1],[0,2],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5],[3,3]] },
];

// ── State 3: Subsystem ───────────────────────────────────────────────────────
const S3_LAYERS: Layer[] = [
  { label: "Cable Assemblers", color: "#5a7a9c", radius: 3, nodes: [
    { lon:-77.0,  lat:42.4, name: "Corning",          loc: "New York, USA" },
    { lon:11.25,  lat:43.77,name: "Prysmian",         loc: "Florence, Italy" },
    { lon:136.9,  lat:35.2, name: "Sumitomo",         loc: "Osaka, Japan" },
    { lon:-80.8,  lat:35.2, name: "CommScope",        loc: "North Carolina, USA" },
    { lon:-81.0,  lat:34.0, name: "OFS",              loc: "South Carolina, USA" },
    { lon:2.35,   lat:48.86,name: "Nexans",           loc: "Paris, France" },
    { lon:-73.0,  lat:41.0, name: "AFL Telecom",      loc: "Connecticut, USA" },
    { lon:139.7,  lat:35.7, name: "Fujikura",         loc: "Tokyo, Japan" },
  ]},
  { label: "Cable Types", color: "#9a7b3c", radius: 2.5, nodes: [
    { lon:-95.0, lat:38.0, name: "Terrestrial Routes", loc: "North America" },
    { lon:10.0,  lat:50.0, name: "Terrestrial Routes", loc: "Europe" },
    { lon:-30.0, lat:30.0, name: "Subsea Routes",      loc: "Atlantic" },
  ]},
];
const S3_FLOWS: Flow[] = [
  { from: 0, to: 1, connections: [[0,0],[0,1],[1,0],[1,1],[2,0],[2,1],[3,0],[3,1],[4,0],[4,1],[5,2],[6,2],[7,2]] },
];

// ── State 4: End Use ─────────────────────────────────────────────────────────
const S4_LAYERS: Layer[] = [
  { label: "Installers", color: "#6ECF7A", radius: 2.5, nodes: [
    { lon:-80.2,  lat:26.1, name: "MasTec",     loc: "Florida, USA" },
    { lon:-84.4,  lat:33.7, name: "Dycom",      loc: "Georgia, USA" },
    { lon:-111.9, lat:40.7, name: "Anixter",    loc: "Utah, USA" },
    { lon:-80.0,  lat:40.4, name: "FS Networks", loc: "Pennsylvania, USA" },
    { lon:-95.0,  lat:37.0, name: "Black Box",  loc: "Kansas, USA" },
  ]},
  { label: "Developers", color: "#5a7a9c", radius: 2.5, nodes: [
    { lon:-73.9,  lat:40.7, name: "Equinix",    loc: "New York, USA" },
    { lon:-93.3,  lat:45.0, name: "CyrusOne",   loc: "Minnesota, USA" },
    { lon:-122.4, lat:37.8, name: "Digital Realty", loc: "San Francisco, USA" },
    { lon:-84.5,  lat:34.0, name: "QTS",        loc: "Georgia, USA" },
    { lon:-95.0,  lat:38.0, name: "Iron Mountain", loc: "Kansas, USA" },
  ]},
  { label: "Owners", color: "#9a7b3c", radius: 3, nodes: [
    { lon:-122.3, lat:47.6, name: "Microsoft",  loc: "Seattle, USA" },
    { lon:-122.1, lat:47.7, name: "Amazon",     loc: "Seattle, USA" },
    { lon:-122.0, lat:37.4, name: "Google",     loc: "Mountain View, USA" },
    { lon:-122.2, lat:37.5, name: "Meta",       loc: "Menlo Park, USA" },
    { lon:-96.8,  lat:32.8, name: "AT&T",       loc: "Dallas, USA" },
    { lon:-74.0,  lat:40.7, name: "Verizon",    loc: "New York, USA" },
    { lon:54.4,   lat:24.5, name: "STC",        loc: "Abu Dhabi, UAE" },
    { lon:39.2,   lat:21.5, name: "Mobily",     loc: "Riyadh, Saudi Arabia" },
  ]},
];
const S4_FLOWS: Flow[] = [
  {
    from: 0, to: 1,
    connections: S4_LAYERS[0].nodes.flatMap((_, i) => S4_LAYERS[1].nodes.map((_, j): Conn => [i, j])),
  },
  {
    from: 1, to: 2,
    connections: S4_LAYERS[1].nodes.flatMap((_, i) => S4_LAYERS[2].nodes.map((_, j): Conn => [i, j])),
  },
];

function getConfig(chainState: 1|2|3|4, rawSelection?: string) {
  if (chainState === 1) {
    if (rawSelection !== "Germanium") return null;
    return { layers: S1_LAYERS, flows: S1_FLOWS, showEllipse: true };
  }
  if (chainState === 2) return { layers: S2_LAYERS, flows: S2_FLOWS, showEllipse: false };
  if (chainState === 3) return { layers: S3_LAYERS, flows: S3_FLOWS, showEllipse: false };
  return { layers: S4_LAYERS, flows: S4_FLOWS, showEllipse: false };
}

const MAP_W = 700;
const MAP_H = 380;

type TooltipInfo = { name: string; loc: string; type: string; color: string } | null;

export default function SupplyChainMap({ chainState, rawSelection, fillContainer }: SupplyChainMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipInfo>(null);

  useEffect(() => {
    const config = getConfig(chainState, rawSelection);
    if (!config || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { layers, flows, showEllipse } = config;
    const el = svgRef.current;

    const proj = d3.geoNaturalEarth1().scale(132).translate([MAP_W / 2, MAP_H / 2 + 15]);
    const path = d3.geoPath().projection(proj);
    const pt = (lon: number, lat: number): [number, number] => proj([lon, lat]) ?? [0, 0];

    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(r => r.json())
      .then((world: Topology) => {
        if (!svgRef.current) return;

        // Land + borders
        svg.append("path")
          .datum(topojson.feature(world, (world.objects as Record<string, GeometryCollection>).land))
          .attr("d", path)
          .attr("fill", "#ddd9cf");

        svg.append("path")
          .datum(topojson.mesh(world, (world.objects as Record<string, GeometryCollection>).countries, (a, b) => a !== b))
          .attr("d", path)
          .attr("fill", "none")
          .attr("stroke", "#d0ccc2")
          .attr("stroke-width", 0.4);

        // China concentration ellipse (state 1 only)
        if (showEllipse) {
          const [ecx, ecy] = pt(107, 37);
          svg.append("ellipse")
            .attr("cx", ecx).attr("cy", ecy)
            .attr("rx", 72).attr("ry", 45)
            .attr("fill", "rgba(180,140,60,0.04)")
            .attr("stroke", "rgba(180,140,60,0.18)")
            .attr("stroke-width", 0.7)
            .attr("stroke-dasharray", "3,3");
          svg.append("text")
            .attr("x", ecx + 74).attr("y", ecy - 46)
            .attr("font-family", "Courier New, monospace")
            .attr("font-size", 6).attr("letter-spacing", "0.1em")
            .attr("fill", "rgba(154,123,60,0.6)").attr("text-anchor", "start")
            .text("CHINA CONCENTRATION");
        }

        // Flow arcs
        const arcPath = (x1: number, y1: number, x2: number, y2: number) => {
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.2;
          return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
        };

        let dotIdx = 0;
        for (const flow of flows) {
          const fromL = layers[flow.from];
          const toL   = layers[flow.to];
          for (const [fi, ti] of flow.connections) {
            const [x1, y1] = pt(fromL.nodes[fi].lon, fromL.nodes[fi].lat);
            const [x2, y2] = pt(toL.nodes[ti].lon,   toL.nodes[ti].lat);
            const d = arcPath(x1, y1, x2, y2);
            const dur   = 2200 + (dotIdx % 5) * 300;
            const delay = (dotIdx * 400) % 3000;

            // Static arc line
            svg.append("path")
              .attr("d", d).attr("fill", "none")
              .attr("stroke", fromL.color).attr("stroke-width", 0.7)
              .attr("stroke-opacity", 0.18);

            // Hidden path for animateMotion reference
            const pathId = `scm-p-${chainState}-${dotIdx}`;
            const hiddenPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            hiddenPath.setAttribute("id", pathId);
            hiddenPath.setAttribute("d", d);
            hiddenPath.setAttribute("fill", "none");
            hiddenPath.setAttribute("stroke", "none");
            el.appendChild(hiddenPath);

            // Animated dot
            const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            dot.setAttribute("r", "1.8");
            dot.setAttribute("fill", fromL.color);
            dot.setAttribute("fill-opacity", "0.75");
            const anim = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
            anim.setAttribute("dur", `${dur}ms`);
            anim.setAttribute("begin", `${delay}ms`);
            anim.setAttribute("repeatCount", "indefinite");
            anim.setAttribute("calcMode", "linear");
            const mpath = document.createElementNS("http://www.w3.org/2000/svg", "mpath");
            mpath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#${pathId}`);
            anim.appendChild(mpath);
            dot.appendChild(anim);
            el.appendChild(dot);

            dotIdx++;
          }
        }

        // Nodes (pulsing halo + solid dot + hover interaction)
        for (let li = 0; li < layers.length; li++) {
          const layer = layers[li];
          const r = layer.radius ?? 2.5;
          for (let ni = 0; ni < layer.nodes.length; ni++) {
            const node = layer.nodes[ni];
            const [x, y] = pt(node.lon, node.lat);
            const haloDur = `${2000 + ni * 200}ms`;
            const haloBegin = `${ni * 300}ms`;

            // Halo
            const halo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            halo.setAttribute("cx", String(x)); halo.setAttribute("cy", String(y));
            halo.setAttribute("r", "0");
            halo.setAttribute("fill", "none");
            halo.setAttribute("stroke", layer.color); halo.setAttribute("stroke-width", "0.8");
            const ar = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            ar.setAttribute("attributeName", "r"); ar.setAttribute("values", "0;12");
            ar.setAttribute("dur", haloDur); ar.setAttribute("begin", haloBegin);
            ar.setAttribute("repeatCount", "indefinite");
            const ao = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            ao.setAttribute("attributeName", "stroke-opacity"); ao.setAttribute("values", "0.4;0");
            ao.setAttribute("dur", haloDur); ao.setAttribute("begin", haloBegin);
            ao.setAttribute("repeatCount", "indefinite");
            halo.appendChild(ar); halo.appendChild(ao);
            el.appendChild(halo);

            // Solid dot with hover area
            const solidDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            solidDot.setAttribute("cx", String(x)); solidDot.setAttribute("cy", String(y));
            solidDot.setAttribute("r", String(r));
            solidDot.setAttribute("fill", layer.color);
            solidDot.setAttribute("fill-opacity", "0.9");
            solidDot.setAttribute("style", "cursor: pointer;");
            el.appendChild(solidDot);

            // Invisible hit area (larger)
            const hit = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            hit.setAttribute("cx", String(x)); hit.setAttribute("cy", String(y));
            hit.setAttribute("r", "8");
            hit.setAttribute("fill", "transparent");
            hit.setAttribute("style", "cursor: pointer;");
            hit.addEventListener("mouseenter", () => {
              setTooltip({ name: node.name, loc: node.loc, type: layer.label, color: layer.color });
            });
            hit.addEventListener("mouseleave", () => {
              setTooltip(null);
            });
            el.appendChild(hit);
          }
        }

        // Legend removed — sub-layers overlay in page.tsx serves as legend
      })
      .catch(console.error);

    return () => { svg.selectAll("*").remove(); };
  }, [chainState, rawSelection]);

  if (fillContainer) {
    return (
      <div style={{ position: "absolute", inset: 0 }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          preserveAspectRatio="xMidYMid slice"
          data-map-container
          style={{ width: "100%", height: "100%", background: "#3A3835", display: "block" }}
        />
        {tooltip && (
          <div style={{
            position: "absolute", bottom: 12, right: 12,
            background: "rgba(0,0,0,0.82)",
            borderRadius: 4,
            padding: "7px 11px",
            pointerEvents: "none",
            zIndex: 10,
          }}>
            <div style={{ fontFamily: "Courier New, monospace", fontSize: 10, fontWeight: 600, color: "white", marginBottom: 2 }}>{tooltip.name}</div>
            <div style={{ fontFamily: "Courier New, monospace", fontSize: 8, color: "rgba(255,255,255,0.55)", marginBottom: 2 }}>{tooltip.loc}</div>
            <div style={{ fontFamily: "Courier New, monospace", fontSize: 7, color: tooltip.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{tooltip.type}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", marginTop: 16 }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        data-map-container
        style={{ width: "100%", height: MAP_H, background: "rgb(99,99,95)", borderRadius: 6, display: "block" }}
      />
      {tooltip && (
        <div style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          background: "rgba(0,0,0,0.85)",
          borderRadius: 4,
          padding: "8px 12px",
          pointerEvents: "none",
          zIndex: 10,
        }}>
          <div style={{ fontFamily: "Courier New, monospace", fontSize: 11, fontWeight: 600, color: "white", marginBottom: 2 }}>
            {tooltip.name}
          </div>
          <div style={{ fontFamily: "Courier New, monospace", fontSize: 9, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>
            {tooltip.loc}
          </div>
          <div style={{ fontFamily: "Courier New, monospace", fontSize: 8, color: tooltip.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {tooltip.type}
          </div>
        </div>
      )}
    </div>
  );
}
