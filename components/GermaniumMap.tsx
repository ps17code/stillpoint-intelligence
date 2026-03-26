import { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

// ── Node data ──────────────────────────────────────────────────────
const DEPOSITS = [
  { lon: 100.08, lat: 23.88 },  // Lincang
  { lon: 116.8,  lat: 44.5  },  // Wulantuga
  { lon: 119.8,  lat: 48.5  },  // Yimin
  { lon: 103.3,  lat: 26.4  },  // Huize
  { lon: 104.1,  lat: 27.6  },  // Yiliang+SYGT
  { lon: 133.0,  lat: 47.5  },  // Spetsugli
  { lon: 27.5,   lat: -3.5  },  // Big Hill
  { lon: -162.9, lat: 68.1  },  // Red Dog
];

const MINERS = [
  { lon: 100.2,  lat: 23.5  },  // Lincang Xinyuan
  { lon: 117.0,  lat: 44.8  },  // Shengli Coal Group
  { lon: 115.5,  lat: 40.0  },  // Various State Ops
  { lon: 103.5,  lat: 26.1  },  // Yunnan Chihong
  { lon: 132.5,  lat: 47.0  },  // JSC Germanium
  { lon: 27.8,   lat: -3.8  },  // STL / Gécamines
  { lon: -120.5, lat: 49.3  },  // Teck Resources
];

const REFINERS = [
  { lon: 99.8,   lat: 24.2  },  // Lincang Xinyuan Refinery
  { lon: 113.5,  lat: 38.0  },  // Smaller Chinese Refiners
  { lon: 103.0,  lat: 25.8  },  // Yunnan Chihong Refinery
  { lon: 132.8,  lat: 47.8  },  // JSC Germanium Refinery
  { lon: 5.5,    lat: 51.2  },  // Umicore
  { lon: -73.6,  lat: 45.5  },  // 5N Plus
  { lon: -83.0,  lat: 42.3  },  // PPM Pure Metals
];

const LEGEND = [
  { label: "DEPOSITS", cls: "ge-map-deposit", r: 3.5 },
  { label: "MINERS",   cls: "ge-map-miner",   r: 3   },
  { label: "REFINERS", cls: "ge-map-refiner",  r: 3   },
];

// ── Colors ─────────────────────────────────────────────────────────
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
};

const WORLD_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ── Component ──────────────────────────────────────────────────────
export default function GermaniumMap() {
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
      svg.selectAll(".ge-map-land")
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

      // China concentration zone
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
        .attr("fill", C.china)
        .attr("fill-opacity", 0.04)
        .attr("stroke", C.china)
        .attr("stroke-opacity", 0.15)
        .attr("stroke-width", 0.5)
        .attr("stroke-dasharray", "3 2");

      // Draw nodes
      function drawNodes(
        data: { lon: number; lat: number }[],
        color: string,
        r: number,
        cls: string,
        delayBase: number,
      ) {
        data.forEach((d, i) => {
          const [x, y] = projection([d.lon, d.lat])!;

          // Pulsing halo
          svg.append("circle")
            .attr("class", `ge-map-pulse ${cls}-pulse`)
            .attr("cx", x).attr("cy", y).attr("r", r + 4)
            .attr("fill", color)
            .style("animation-delay", `${delayBase + i * 0.3}s`);

          // Solid dot
          svg.append("circle")
            .attr("class", cls)
            .attr("cx", x).attr("cy", y).attr("r", r)
            .attr("fill", color);
        });
      }

      drawNodes(DEPOSITS, C.deposit, 3,   "ge-map-deposit", 0);
      drawNodes(MINERS,   C.miner,   2.5, "ge-map-miner",   0.15);
      drawNodes(REFINERS, C.refiner, 2.5, "ge-map-refiner",  0.25);

      // Legend — stacked vertically, left of South America
      const lx = 58;
      const ly = 215;
      const spacing = 15;

      LEGEND.forEach((item, i) => {
        const y = ly + i * spacing;
        const color = item.cls === "ge-map-deposit" ? C.deposit
                    : item.cls === "ge-map-miner"   ? C.miner
                    : C.refiner;

        svg.append("circle")
          .attr("cx", lx).attr("cy", y).attr("r", item.r)
          .attr("fill", color);

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
  }, []);

  return (
    <>
      <style>{`
        .ge-map-pulse {
          opacity: 0.15;
          animation: ge-pulse 3s ease-in-out infinite;
        }
        @keyframes ge-pulse {
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
