"use client";
import React from "react";

type VerticalId = "ai-infrastructure" | "energy-transition" | "robotics" | "uavs" | "space" | "defense";

type Vertical = {
  id: VerticalId;
  label: string;
  img: string;
  active: boolean;
};

const verticals: Vertical[] = [
  { id: "ai-infrastructure", label: "AI Infrastructure", img: "/verticals/ai-infrastructure.png", active: true },
  { id: "energy-transition", label: "Energy Transition", img: "/verticals/energy-transition.png", active: false },
  { id: "robotics", label: "Robotics", img: "/verticals/robotics.png", active: false },
  { id: "uavs", label: "UAVs", img: "/verticals/uavs.png", active: false },
  { id: "space", label: "Space", img: "/verticals/space.png", active: false },
  { id: "defense", label: "Defense", img: "/verticals/defense.png", active: false },
];

function VerticalCard({ label, img, active, onClick }: { label: string; img: string; active: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col overflow-hidden rounded-[10px] border transition-all duration-300 focus:outline-none ${
        active
          ? "border-white/[0.06] hover:-translate-y-[2px] hover:border-white/[0.15]"
          : "border-white/[0.04] opacity-40 hover:opacity-60"
      }`}
    >
      <img
        src={img}
        alt={label}
        className={`w-full h-auto block transition-all duration-300 ${
          active
            ? "brightness-[1.2] group-hover:brightness-[1.4]"
            : "brightness-[0.7]"
        }`}
      />
      <div className="px-4 pt-1 pb-2 flex items-center gap-[6px]">
        <span
          className={`text-[10px] font-[300] uppercase tracking-[0.08em] transition-colors duration-300 ${
            active
              ? "text-white/50 group-hover:text-white/80"
              : "text-white/30"
          }`}
          style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
          {label}
        </span>
        {active && (
          <span className="relative flex h-[6px] w-[6px]">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-green-500" />
          </span>
        )}
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
        <div className="w-full max-w-[600px]">
          <div className="mb-8 text-center">
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
                active={v.active}
                onClick={() => onSelect?.(v.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
