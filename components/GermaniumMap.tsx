"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

/* ═══════════════════════════════════════════════════════════════════
   GermaniumMap — D3 world map with animated supply-chain flows
   Drop into components/GermaniumMap.tsx
   ═══════════════════════════════════════════════════════════════════ */

// ── Node coordinates (same order as chains.json arrays) ───────────
const DEPOSITS = [
  { lon: 100.08, lat: 23.88 },  // 0 Lincang
  { lon: 116.8,  lat: 44.5  },  // 1 Wulantuga
  { lon: 119.8,  lat: 48.5  },  // 2 Yimin
  { lon: 103.3,  lat: 26.4  },  // 3 Huize
  { lon: 104.1,  lat: 27.6  },  // 4 Yiliang+SYGT
  { lon: 133.0,  lat: 47.5  },  // 5 Spetsugli
  { lon: 27.5,   lat: -3.5  },  // 6 Big Hill
  { lon: -162.9, lat: 68.1  },  // 7 Red Dog
];

const MINERS = [
  { lon: 100.2,  lat: 23.5  },  // 0 Lincang Xinyuan
  { lon: 117.0,  lat: 44.8  },  // 1 Shengli Coal Group
  { lon: 115.5,  lat: 40.0  },  // 2 Various State Ops
  { lon: 103.5,  lat: 26.1  },  // 3 Yunnan Chihong
  { lon: 132.5,  lat: 47.0  },  // 4 JSC Germanium
  { lon: 27.8,   lat: -3.8  },  // 5 STL / Gécamines
  { lon: -120.5, lat: 49.3  },  // 6 Teck Resources
];

const REFINERS = [
  { lon: 99.8,   lat: 24.2  },  // 0 Lincang Xinyuan Refinery
  { lon: 113.5,  lat: 38.0  },  // 1 Smaller Chinese Refiners
  { lon: 103.0,  lat: 25.8  },  // 2 Yunnan Chihong Refinery
  { lon: 132.8,  lat: 47.8  },  // 3 JSC Germanium Refinery
  { lon: 5.5,    lat: 51.2  },  // 4 Umicore
  { lon: -73.6,  lat: 45.5  },  // 5 5N Plus
  { lon: -83.0,  lat: 42.3  },  // 6 PPM Pure Metals
];

// ── Connection data (from chains.json) ────────────────────────────
const DEP_TO_MIN: [number, number][] = [
  [0,0],[1,1],[2,2],[3,3],[4,3],[5,4],[6,5],[7,6],
];
const MIN_TO_REF: [number, number][] = [
  [0,0],[1,1],[2,1],[3,2],[4,3],[5,4],[6,5],
];

// ── Colors ────────────────────────────────────────────────────────
const C = {
  land:       "#ddd9cf",
  landStroke: "#ccc8bc",
  grat:       "#d8d4c8",
  border:     "#d0ccc2",
  deposit:    "#9a7b3c",
  miner:      "#6b8f5e",
  refiner:    "#8a6b9a",
  china:      "#9a7b3c",
  legendText: "#a8a49a",
  flowDep:    "#9a7b3c",
  flowRef:    "#8a6b9a",
};

const WORLD_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ── Component ─────────────────────────────────────────────────────
export default function GermaniumMap({ showFlows = true }: { showFlows?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);

  useEffect(() => {
    if (!containerRef.current || rendered.current) return;
    rendered.current = true;

    const w = 660;
    const h = 340;

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", "100%")
      .attr("viewBox", `0 0 ${w} ${h}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const projection = d3.geoNaturalEarth1()
      .scale(126)
      .translate([w / 2, h / 2]);

    const pathGen = d3.geoPath().projection(projection);

    function pt(lon: number, lat: number): [number, number] {
      const p = projection([lon, lat]);
      return p ? [p[0], p[1]] : [0, 0];
    }

    function arcPath(x1: number, y1: number, x2: number, y2: number): string {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const bulge = Math.min(dist * 0.3, 40);
      const nx = -dy / dist;
      const ny = dx / dist;
      const cx = mx + nx * bulge;
      const cy = my + ny * bulge;
      return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
    }

    d3.json(WORLD_URL).then((world: any) => {
      const countries = topojson.feature(world, world.objects.countries) as any;
      const borders = topojson.mesh(world, world.objects.countries, (a: any, b: any) => a !== b);

      // Graticule
      svg.append("path")
        .datum(d3.geoGraticule().step([30, 30])())
        .attr("d", pathGen as any)
        .attr("fill", "none")
        .attr("stroke", C.grat)
        .attr("stroke-width", 0.2)
        .attr("stroke-dasharray", "1,2");

      // Countries
      svg.selectAll(".ge-land")
        .data(countries.features)
        .enter().append("path")
        .attr("d", pathGen as any)
        .attr("fill", C.land)
        .attr("stroke", C.landStroke)
        .attr("stroke-width", 0.3);

      // Borders
      svg.append("path")
        .datum(borders)
        .attr("d", pathGen as any)
        .attr("fill", "none")
        .attr("stroke", C.border)
        .attr("stroke-width", 0.15);

      // China zone
      const allChina = [
        ...DEPOSITS.slice(0, 5),
        ...MINERS.slice(0, 4),
        ...REFINERS.slice(0, 3),
      ];
      const ccx = d3.mean(allChina, d => projection([d.lon, d.lat])![0])!;
      const ccy = d3.mean(allChina, d => projection([d.lon, d.lat])![1])!;

      svg.append("ellipse")
        .attr("cx", ccx).attr("cy", ccy)
        .attr("rx", 52).attr("ry", 40)
        .attr("fill", C.china).attr("fill-opacity", 0.04)
        .attr("stroke", C.china).attr("stroke-opacity", 0.15)
        .attr("stroke-width", 0.5).attr("stroke-dasharray", "3 2");

      // ── Flow lines + animated dots ──────────────────────────────
      if (showFlows) {
        const flowG = svg.append("g");

        const addFlow = (
          from: { lon: number; lat: number },
          to: { lon: number; lat: number },
          color: string,
          lineOpacity: number,
          dotOpacity: number,
          duration: number,
          delay: number,
        ) => {
          const [x1, y1] = pt(from.lon, from.lat);
          const [x2, y2] = pt(to.lon, to.lat);
          const d = arcPath(x1, y1, x2, y2);

          // Static arc
          flowG.append("path")
            .attr("d", d)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 0.4)
            .attr("stroke-opacity", lineOpacity);

          // Hidden measure path
          const measure = flowG.append("path")
            .attr("d", d)
            .attr("fill", "none")
            .attr("stroke", "none")
            .node()!;

          const totalLen = measure.getTotalLength();

          // Animated dot
          const dot = flowG.append("circle")
            .attr("r", 1.5)
            .attr("fill", color)
            .attr("opacity", 0);

          function animate() {
            dot
              .attr("opacity", 0)
              .transition()
              .delay(delay)
              .duration(0)
              .attr("opacity", dotOpacity)
              .transition()
              .duration(duration)
              .ease(d3.easeLinear)
              .attrTween("cx", () => (t: number) =>
                String(measure.getPointAtLength(t * totalLen).x))
              .attrTween("cy", () => (t: number) =>
                String(measure.getPointAtLength(t * totalLen).y))
              .transition()
              .duration(300)
              .attr("opacity", 0)
              .on("end", animate);
          }
          animate();
        }

        // Deposit → Miner
        DEP_TO_MIN.forEach(([di, mi], i) => {
          addFlow(DEPOSITS[di], MINERS[mi], C.flowDep, 0.15, 0.7,
            3000 + i * 400, i * 350);
        });

        // Miner → Refiner
        MIN_TO_REF.forEach(([mi, ri], i) => {
          addFlow(MINERS[mi], REFINERS[ri], C.flowRef, 0.12, 0.6,
            3500 + i * 500, 1500 + i * 400);
        });
      }

      // ── Static nodes (on top of flows) ──────────────────────────
      function drawNodes(
        data: { lon: number; lat: number }[],
        color: string,
        r: number,
        cls: string,
      ) {
        data.forEach((d) => {
          const [x, y] = pt(d.lon, d.lat);
          svg.append("circle")
            .attr("class", `ge-pulse ${cls}-pulse`)
            .attr("cx", x).attr("cy", y).attr("r", r + 4)
            .attr("fill", color);
          svg.append("circle")
            .attr("class", cls)
            .attr("cx", x).attr("cy", y).attr("r", r)
            .attr("fill", color);
        });
      }

      drawNodes(DEPOSITS, C.deposit, 3,   "ge-dep");
      drawNodes(MINERS,   C.miner,   2.5, "ge-min");
      drawNodes(REFINERS, C.refiner, 2.5, "ge-ref");

      // ── Legend ───────────────────────────────────────────────────
      const lx = 58, ly = 210, sp = 15;
      [
        { label: "DEPOSITS", color: C.deposit, r: 3.5 },
        { label: "MINERS",   color: C.miner,   r: 3 },
        { label: "REFINERS", color: C.refiner,  r: 3 },
      ].forEach((item, i) => {
        const y = ly + i * sp;
        svg.append("circle")
          .attr("cx", lx).attr("cy", y).attr("r", item.r)
          .attr("fill", item.color);
        svg.append("text")
          .attr("x", lx + 9).attr("y", y + 3)
          .attr("font-family", "'Geist Mono', 'Courier New', monospace")
          .attr("font-size", 8)
          .attr("letter-spacing", "0.5px")
          .attr("fill", C.legendText)
          .text(item.label);
      });
    });

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        rendered.current = false;
      }
    };
  }, [showFlows]);

  return (
    <>
      <style>{`
        .ge-pulse {
          opacity: 0.15;
          animation: gePulse 3s ease-in-out infinite;
        }
        @keyframes gePulse {
          0%, 100% { opacity: 0.15; r: 7; }
          50% { opacity: 0.04; r: 12; }
        }
      `}</style>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          background: "#EDEDEA",
          borderRadius: "3px",
          padding: "12px",
          marginTop: "16px",
        }}
      />
    </>
  );
}
