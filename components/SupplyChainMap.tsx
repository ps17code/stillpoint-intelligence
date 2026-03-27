"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

export interface SupplyChainMapProps {
  chainState: 1 | 2 | 3 | 4;
  rawSelection?: string;
  compSelection?: string;
  subSelection?: string;
  euSelection?: string;
}

type Pt = { lon: number; lat: number };
type Layer = { label: string; color: string; nodes: Pt[]; radius?: number };
type Conn = [number, number];
type Flow = { from: number; to: number; connections: Conn[] };

// ── State 1: Germanium Raw Material ─────────────────────────────────────────
const S1_LAYERS: Layer[] = [
  { label: "Deposits", color: "#9a7b3c", radius: 3, nodes: [
    {lon:100.08,lat:23.88},{lon:116.8,lat:44.5},{lon:119.8,lat:48.5},{lon:103.3,lat:26.4},
    {lon:104.1,lat:27.6},{lon:133.0,lat:47.5},{lon:27.5,lat:-3.5},{lon:-162.9,lat:68.1},
  ]},
  { label: "Miners",   color: "#6b8f5e", radius: 2.5, nodes: [
    {lon:100.2,lat:23.5},{lon:117.0,lat:44.8},{lon:115.5,lat:40.0},{lon:103.5,lat:26.1},
    {lon:132.5,lat:47.0},{lon:27.8,lat:-3.8},{lon:-120.5,lat:49.3},
  ]},
  { label: "Refiners",  color: "#8a6b9a", radius: 2.5, nodes: [
    {lon:99.8,lat:24.2},{lon:113.5,lat:38.0},{lon:103.0,lat:25.8},{lon:132.8,lat:47.8},
    {lon:5.5,lat:51.2},{lon:-73.6,lat:45.5},{lon:-83.0,lat:42.3},
  ]},
];
const S1_FLOWS: Flow[] = [
  { from: 0, to: 1, connections: [[0,0],[1,1],[2,2],[3,3],[4,3],[5,4],[6,5],[7,6]] },
  { from: 1, to: 2, connections: [[0,0],[1,1],[2,1],[3,2],[4,3],[5,4],[6,5]] },
];

// ── State 2: Component ───────────────────────────────────────────────────────
const S2_LAYERS: Layer[] = [
  { label: "GeCl₄ Suppliers",    color: "#9a7b3c", radius: 3, nodes: [
    {lon:5.5,lat:51.2},{lon:103.0,lat:25.8},{lon:113.5,lat:38.0},{lon:132.8,lat:47.8},
  ]},
  { label: "Fiber Manufacturers", color: "#5a7a9c", radius: 2.5, nodes: [
    {lon:-77.0,lat:42.4},{lon:11.25,lat:43.77},{lon:139.7,lat:35.7},
    {lon:136.9,lat:35.2},{lon:136.0,lat:35.0},{lon:117.0,lat:30.5},
  ]},
];
const S2_FLOWS: Flow[] = [
  { from: 0, to: 1, connections: [[0,0],[0,1],[0,2],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5],[3,3]] },
];

// ── State 3: Subsystem ───────────────────────────────────────────────────────
const S3_LAYERS: Layer[] = [
  { label: "Cable Assemblers", color: "#5a7a9c", radius: 3, nodes: [
    {lon:-77.0,lat:42.4},{lon:11.25,lat:43.77},{lon:136.9,lat:35.2},{lon:-80.8,lat:35.2},
    {lon:-81.0,lat:34.0},{lon:2.35,lat:48.86},{lon:-73.0,lat:41.0},{lon:139.7,lat:35.7},
  ]},
  { label: "Cable Types", color: "#9a7b3c", radius: 2.5, nodes: [
    {lon:-95.0,lat:38.0},{lon:10.0,lat:50.0},{lon:-30.0,lat:30.0},
  ]},
];
const S3_FLOWS: Flow[] = [
  { from: 0, to: 1, connections: [[0,0],[0,1],[1,0],[1,1],[2,0],[2,1],[3,0],[3,1],[4,0],[4,1],[5,2],[6,2],[7,2]] },
];

// ── State 4: End Use ─────────────────────────────────────────────────────────
const S4_LAYERS: Layer[] = [
  { label: "Installers", color: "#6b8f5e", radius: 2.5, nodes: [
    {lon:-80.2,lat:26.1},{lon:-84.4,lat:33.7},{lon:-111.9,lat:40.7},{lon:-80.0,lat:40.4},{lon:-95.0,lat:37.0},
  ]},
  { label: "Developers", color: "#5a7a9c", radius: 2.5, nodes: [
    {lon:-73.9,lat:40.7},{lon:-93.3,lat:45.0},{lon:-122.4,lat:37.8},{lon:-84.5,lat:34.0},{lon:-95.0,lat:38.0},
  ]},
  { label: "Owners",     color: "#9a7b3c", radius: 3, nodes: [
    {lon:-122.3,lat:47.6},{lon:-122.1,lat:47.7},{lon:-122.0,lat:37.4},{lon:-122.2,lat:37.5},
    {lon:-96.8,lat:32.8},{lon:-74.0,lat:40.7},{lon:54.4,lat:24.5},{lon:39.2,lat:21.5},
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

export default function SupplyChainMap({ chainState, rawSelection }: SupplyChainMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

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

    // Graticule
    svg.append("path")
      .datum(d3.geoGraticule()())
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#d8d4c8")
      .attr("stroke-width", 0.3);

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
              .attr("stroke-opacity", 0.13);

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
            dot.setAttribute("fill-opacity", "0.65");
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

        // Nodes (pulsing halo + solid dot)
        for (let li = 0; li < layers.length; li++) {
          const layer = layers[li];
          const r = layer.radius ?? 2.5;
          for (let ni = 0; ni < layer.nodes.length; ni++) {
            const [x, y] = pt(layer.nodes[ni].lon, layer.nodes[ni].lat);
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

            // Solid dot
            svg.append("circle")
              .attr("cx", x).attr("cy", y)
              .attr("r", r)
              .attr("fill", layer.color)
              .attr("fill-opacity", 0.85);
          }
        }

        // Legend (bottom-left)
        const legendX = 14;
        const legendY = 280;
        for (let i = 0; i < layers.length; i++) {
          svg.append("circle")
            .attr("cx", legendX + 4).attr("cy", legendY + i * 16)
            .attr("r", 3).attr("fill", layers[i].color).attr("fill-opacity", 0.85);
          svg.append("text")
            .attr("x", legendX + 12).attr("y", legendY + i * 16 + 4)
            .attr("font-family", "Courier New, monospace")
            .attr("font-size", 7).attr("letter-spacing", "0.08em")
            .attr("fill", "#888880")
            .text(layers[i].label.toUpperCase());
        }
      })
      .catch(console.error);

    return () => { svg.selectAll("*").remove(); };
  }, [chainState, rawSelection]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      data-map-container
      style={{ width: "100%", height: MAP_H, background: "#EDEDEA", borderRadius: 6, display: "block", marginTop: 16 }}
    />
  );
}
