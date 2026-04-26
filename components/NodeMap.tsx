"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

interface MapNode {
  name: string;
  lat: number;
  lon: number;
  type: string;
  country?: string;
}

interface Connection {
  from: string;
  to: string;
}

interface NodeMapProps {
  nodes: MapNode[];
  connections?: Connection[];
  onClickNode?: (name: string) => void;
  selectedNode?: string | null;
}

const LAYER_COLORS: Record<string, string> = {
  "Deposit": "#B8975A",
  "Host Operation": "#7DA06A",
  "Refiner": "#8a6b9a",
  "Aggregate": "#6a8a9a",
  "Device Manufacturer": "#9a8a6a",
  "Commodity": "#8a8a6a",
  "Converter": "#4d9ab8",
  "Manufacturer": "#90aab9",
  "Assembler": "#5A9E8F",
  "Datacenter": "#C8C4BC",
  "Telecom": "#C8C4BC",
  "Bauxite Source": "#B8975A",
  "Alumina Refinery": "#7DA06A",
  "Primary Producer": "#7DA06A",
  "Gallium Refiner": "#8a6b9a",
};

const DARK = {
  bg: "#111111",
  land: "#1e1d1b",
  landStroke: "#2a2826",
  grat: "#1a1918",
  border: "#252320",
  text: "#706a60",
};

const WORLD_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function NodeMap({ nodes, connections, onClickNode, selectedNode }: NodeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous
    d3.select(containerRef.current).selectAll("*").remove();

    const w = 900;
    const h = 420;

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", "100%")
      .attr("viewBox", `0 0 ${w} ${h}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("background", DARK.bg);

    svgRef.current = svg;

    const projection = d3.geoNaturalEarth1()
      .scale(170)
      .translate([w / 2, h / 2 + 40]);

    const pathGen = d3.geoPath().projection(projection);

    function pt(lon: number, lat: number): [number, number] {
      const p = projection([lon, lat]);
      return p ? [p[0], p[1]] : [0, 0];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    d3.json(WORLD_URL).then((world: any) => {
      const countries = topojson.feature(world, world.objects.countries) as any;
      const borders = topojson.mesh(world, world.objects.countries, (a: any, b: any) => a !== b);

      // Graticule
      svg.append("path")
        .datum(d3.geoGraticule().step([30, 30])())
        .attr("d", pathGen as never)
        .attr("fill", "none")
        .attr("stroke", DARK.grat)
        .attr("stroke-width", 0.3)
        .attr("stroke-dasharray", "1,3");

      // Countries
      svg.selectAll(".nm-land")
        .data(countries.features)
        .enter().append("path")
        .attr("d", pathGen as never)
        .attr("fill", DARK.land)
        .attr("stroke", DARK.landStroke)
        .attr("stroke-width", 0.3);

      // Borders
      svg.append("path")
        .datum(borders)
        .attr("d", pathGen as never)
        .attr("fill", "none")
        .attr("stroke", DARK.border)
        .attr("stroke-width", 0.2);

      // Connection lines with animated dots
      if (connections && connections.length > 0) {
        const connGroup = svg.append("g");
        const nodeMap = new Map(nodes.map(n => [n.name, n]));

        connections.forEach((conn, idx) => {
          const fromNode = nodeMap.get(conn.from);
          const toNode = nodeMap.get(conn.to);
          if (!fromNode || !toNode) return;

          const [x1, y1] = pt(fromNode.lon, fromNode.lat);
          const [x2, y2] = pt(toNode.lon, toNode.lat);

          // Arc path
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;
          const dx = x2 - x1;
          const dy = y2 - y1;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const bulge = Math.min(dist * 0.25, 30);
          const nx = -dy / dist;
          const ny = dx / dist;
          const cx2 = mx + nx * bulge;
          const cy2 = my + ny * bulge;
          const arcD = `M${x1},${y1} Q${cx2},${cy2} ${x2},${y2}`;

          const fromColor = LAYER_COLORS[fromNode.type] ?? "#888";

          // Line
          connGroup.append("path")
            .attr("d", arcD)
            .attr("fill", "none")
            .attr("stroke", fromColor)
            .attr("stroke-width", 0.6)
            .attr("stroke-opacity", 0.15)
            .attr("stroke-dasharray", "3,3");

          // Animated dot traveling along the path
          const dot = connGroup.append("circle")
            .attr("r", 1.5)
            .attr("fill", fromColor)
            .attr("fill-opacity", 0.6);

          // Create a hidden path for getPointAtLength
          const pathEl = connGroup.append("path")
            .attr("d", arcD)
            .attr("fill", "none")
            .attr("stroke", "none")
            .node();

          if (pathEl) {
            const totalLen = pathEl.getTotalLength();
            const duration = 3000 + (idx % 5) * 500;
            const delay = (idx * 400) % duration;

            const animateDot = () => {
              dot
                .attr("fill-opacity", 0)
                .transition()
                .delay(delay)
                .duration(0)
                .attr("fill-opacity", 0.6)
                .transition()
                .duration(duration)
                .ease(d3.easeLinear)
                .attrTween("cx", () => (t: number) => {
                  const p = pathEl!.getPointAtLength(t * totalLen);
                  return String(p.x);
                })
                .attrTween("cy", () => (t: number) => {
                  const p = pathEl!.getPointAtLength(t * totalLen);
                  return String(p.y);
                })
                .on("end", animateDot);
            };
            animateDot();
          }
        });
      }

      // Node dots
      const nodeGroup = svg.append("g");

      nodes.forEach((n) => {
        const [cx, cy] = pt(n.lon, n.lat);
        const color = LAYER_COLORS[n.type] ?? "#888";
        const isSelected = selectedNode === n.name;
        const r = isSelected ? 4.5 : 3;

        // Pulse ring for selected
        if (isSelected) {
          nodeGroup.append("circle")
            .attr("cx", cx).attr("cy", cy)
            .attr("r", 8)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 0.8)
            .attr("stroke-opacity", 0.4)
            .append("animate")
            .attr("attributeName", "r")
            .attr("from", "4").attr("to", "12")
            .attr("dur", "1.5s")
            .attr("repeatCount", "indefinite");

          nodeGroup.append("circle")
            .attr("cx", cx).attr("cy", cy)
            .attr("r", 8)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 0.8)
            .append("animate")
            .attr("attributeName", "stroke-opacity")
            .attr("from", "0.5").attr("to", "0")
            .attr("dur", "1.5s")
            .attr("repeatCount", "indefinite");
        }

        // Main dot
        const dot = nodeGroup.append("circle")
          .attr("cx", cx).attr("cy", cy)
          .attr("r", r)
          .attr("fill", color)
          .attr("fill-opacity", isSelected ? 1 : 0.7)
          .attr("stroke", isSelected ? "#fff" : color)
          .attr("stroke-width", isSelected ? 1 : 0.5)
          .attr("stroke-opacity", isSelected ? 0.6 : 0.3)
          .style("cursor", "pointer");

        // Label for selected node
        if (isSelected) {
          nodeGroup.append("text")
            .attr("x", cx).attr("y", cy - 8)
            .attr("text-anchor", "middle")
            .attr("fill", "#ece8e1")
            .attr("font-size", 7)
            .attr("font-family", "'Geist Mono', monospace")
            .text(n.name);
        }

        // Click handler
        dot.on("click", () => { onClickNode?.(n.name); });

        // Hover tooltip
        const tooltip = nodeGroup.append("g")
          .attr("opacity", 0)
          .style("pointer-events", "none");

        const tooltipBg = tooltip.append("rect")
          .attr("rx", 3).attr("ry", 3)
          .attr("fill", "rgba(20,20,18,0.92)")
          .attr("stroke", "rgba(255,255,255,0.08)")
          .attr("stroke-width", 0.5);

        const tooltipName = tooltip.append("text")
          .attr("fill", "rgba(255,255,255,0.7)")
          .attr("font-size", 8)
          .attr("font-weight", 500)
          .text(n.name);

        const tooltipType = tooltip.append("text")
          .attr("fill", color)
          .attr("font-size", 6)
          .attr("font-family", "'Geist Mono', monospace")
          .text(n.type);

        // Measure and position tooltip
        const nameWidth = (tooltipName.node()?.getComputedTextLength?.() ?? n.name.length * 5) + 16;
        const ttW = Math.max(nameWidth, 60);
        const ttH = 32;

        tooltipBg.attr("x", cx - ttW / 2).attr("y", cy - ttH - 10).attr("width", ttW).attr("height", ttH);
        tooltipName.attr("x", cx).attr("y", cy - ttH - 10 + 12).attr("text-anchor", "middle");
        tooltipType.attr("x", cx).attr("y", cy - ttH - 10 + 24).attr("text-anchor", "middle");

        dot.on("mouseenter", () => { tooltip.attr("opacity", 1); dot.attr("r", r + 1.5); });
        dot.on("mouseleave", () => { tooltip.attr("opacity", 0); dot.attr("r", r); });
      });

      // Legend
      const types = Array.from(new Set(nodes.map(n => n.type)));
      const legend = svg.append("g").attr("transform", `translate(16, ${h - types.length * 14 - 10})`);
      types.forEach((type, i) => {
        const color = LAYER_COLORS[type] ?? "#888";
        const count = nodes.filter(n => n.type === type).length;
        legend.append("circle").attr("cx", 4).attr("cy", i * 14).attr("r", 3).attr("fill", color).attr("fill-opacity", 0.7);
        legend.append("text").attr("x", 12).attr("y", i * 14 + 3).attr("fill", DARK.text).attr("font-size", 7).attr("font-family", "'Geist Mono', monospace").text(`${type} (${count})`);
      });
    }).catch(console.error);

    return () => {
      if (containerRef.current) d3.select(containerRef.current).selectAll("*").remove();
    };
  }, [nodes, connections, selectedNode, onClickNode]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
