"use client";
import React from "react";

type VerticalId = "ai-infrastructure" | "energy-transition" | "robotics" | "uavs" | "space" | "defense";

type Vertical = {
  id: VerticalId;
  label: string;
  img: string;
};

const verticals: Vertical[] = [
  { id: "ai-infrastructure", label: "AI Infrastructure", img: "/verticals/ai-infrastructure.png" },
  { id: "energy-transition", label: "Energy Transition", img: "/verticals/energy-transition.png" },
  { id: "robotics", label: "Robotics", img: "/verticals/robotics.png" },
  { id: "uavs", label: "UAVs", img: "/verticals/uavs.png" },
  { id: "space", label: "Space", img: "/verticals/space.png" },
  { id: "defense", label: "Defense", img: "/verticals/defense.png" },
];

function VerticalCard({ label, img, onClick }: { label: string; img: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex h-[210px] w-full flex-col items-center justify-center overflow-hidden rounded-[10px] border border-white/[0.06] bg-[#0B0B0C]/90 text-center transition-all duration-300 hover:-translate-y-[2px] hover:border-white/[0.14] hover:bg-[#101012] focus:outline-none"
    >
      <div className="absolute inset-0 rounded-[10px] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.03),transparent_42%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src={img} alt={label} className="h-[120px] w-[120px] object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-95" />
        <span
          className="text-[11px] font-[300] uppercase leading-none text-white/50 transition-colors duration-300 group-hover:text-white/70"
          style={{
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </span>
      </div>
    </button>
  );
}

export default function VerticalLandingPage({ onSelect }: { onSelect?: (id: VerticalId) => void }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070708] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_36%_50%,rgba(255,255,255,0.03),transparent_28%)]" />
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_52%,rgba(0,0,0,0.55)_100%)]" />

      <header className="relative z-10 border-b border-white/[0.06] px-5 py-4">
        <div className="flex items-center">
          <span
            className="text-[11px] font-[300] uppercase text-white/50"
            style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", letterSpacing: "0.04em" }}
          >
            Stillpoint
          </span>
          <span className="inline-block w-[5px]" />
          <span
            className="text-[11px] font-[200] uppercase text-white/[0.22]"
            style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", letterSpacing: "0.04em" }}
          >
            Intelligence
          </span>
        </div>
      </header>

      <section className="relative z-10 flex min-h-[calc(100vh-53px)] items-center justify-center px-8 py-12">
        <div className="w-full max-w-[880px]">
          <div className="mb-8">
            <span
              className="text-[10px] font-[300] uppercase text-white/25"
              style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", letterSpacing: "0.1em" }}
            >
              Select Vertical
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {verticals.map((v) => (
              <VerticalCard
                key={v.id}
                label={v.label}
                img={v.img}
                onClick={() => onSelect?.(v.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
