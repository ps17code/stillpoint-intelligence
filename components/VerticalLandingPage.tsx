"use client";
import React from "react";

type VerticalId =
  | "ai-infrastructure"
  | "energy-transition"
  | "robotics"
  | "uavs"
  | "space"
  | "defense";

type Vertical = {
  id: VerticalId;
  label: string;
  icon: React.ReactNode;
};

type VerticalLandingPageProps = {
  onSelect?: (vertical: VerticalId) => void;
};

function CardShell({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative flex h-[190px] w-full flex-col items-start justify-between rounded-[14px] border border-white/[0.08] bg-[#0B0B0C]/90 p-6 text-left transition-all duration-300 hover:-translate-y-[2px] hover:border-white/[0.16] hover:bg-[#101012] focus:outline-none focus:ring-1 focus:ring-white/20"
    >
      <div className="absolute inset-0 rounded-[14px] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_42%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10 flex h-full w-full flex-col justify-between">{children}</div>
    </button>
  );
}

function AIIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10" fill="none">
      <rect x="16" y="16" width="32" height="32" rx="4" stroke="rgba(255,255,255,0.72)" strokeWidth="1.4" />
      <rect x="24" y="24" width="16" height="16" rx="2" stroke="rgba(255,255,255,0.42)" strokeWidth="1.2" />
      <path d="M32 10v6M32 48v6M10 32h6M48 32h6M18 18l4 4M42 42l4 4M46 18l-4 4M18 46l4-4" stroke="rgba(255,255,255,0.42)" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function EnergyIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10" fill="none">
      <path d="M32 12L22 24h20L32 12Z" stroke="rgba(255,255,255,0.72)" strokeWidth="1.4" />
      <path d="M26 24l-4 28M38 24l4 28M20 36h24M18 48h28" stroke="rgba(255,255,255,0.42)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M34 26l-6 10h5l-3 8 8-11h-5l1-7Z" stroke="rgba(255,255,255,0.52)" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function RoboticsIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10" fill="none">
      <circle cx="20" cy="44" r="4" stroke="rgba(255,255,255,0.72)" strokeWidth="1.4" />
      <circle cx="28" cy="30" r="3.5" stroke="rgba(255,255,255,0.52)" strokeWidth="1.2" />
      <circle cx="40" cy="22" r="3.5" stroke="rgba(255,255,255,0.52)" strokeWidth="1.2" />
      <path d="M23 41l3-8 10-6 8 8M40 22l8-4M44 18h8M52 18v8M52 26l-6-2" stroke="rgba(255,255,255,0.72)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UAVIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10" fill="none">
      <circle cx="20" cy="20" r="6" stroke="rgba(255,255,255,0.52)" strokeWidth="1.2" />
      <circle cx="44" cy="20" r="6" stroke="rgba(255,255,255,0.52)" strokeWidth="1.2" />
      <circle cx="20" cy="44" r="6" stroke="rgba(255,255,255,0.52)" strokeWidth="1.2" />
      <circle cx="44" cy="44" r="6" stroke="rgba(255,255,255,0.52)" strokeWidth="1.2" />
      <circle cx="32" cy="32" r="4" stroke="rgba(255,255,255,0.72)" strokeWidth="1.3" />
      <path d="M24 24l16 16M40 24L24 40" stroke="rgba(255,255,255,0.42)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function SpaceIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10" fill="none">
      <path d="M24 34l16-16 6 6-16 16-10 4 4-10Z" stroke="rgba(255,255,255,0.72)" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M38 20l6-6M22 42l-4 8M18 18h4M48 46h4M14 30h6" stroke="rgba(255,255,255,0.42)" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="46" cy="18" r="2" stroke="rgba(255,255,255,0.52)" strokeWidth="1.2" />
    </svg>
  );
}

function DefenseIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10" fill="none">
      <path d="M32 14l16 6v12c0 10-7 16-16 20-9-4-16-10-16-20V20l16-6Z" stroke="rgba(255,255,255,0.72)" strokeWidth="1.3" />
      <path d="M24 32h16M32 24v16" stroke="rgba(255,255,255,0.42)" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="32" cy="32" r="10" stroke="rgba(255,255,255,0.28)" strokeWidth="1.1" />
    </svg>
  );
}

function VerticalCard({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <CardShell onClick={onClick}>
      <div className="text-white/75">{icon}</div>
      <div className="pt-8">
        <div
          className="text-[12px] font-[300] uppercase leading-none text-white/[0.72]"
          style={{
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </div>
      </div>
    </CardShell>
  );
}

export type { VerticalId };

export default function VerticalLandingPage({
  onSelect,
}: VerticalLandingPageProps) {
  const verticals: Vertical[] = [
    { id: "ai-infrastructure", label: "AI Infrastructure", icon: <AIIcon /> },
    { id: "energy-transition", label: "Energy Transition", icon: <EnergyIcon /> },
    { id: "robotics", label: "Robotics", icon: <RoboticsIcon /> },
    { id: "uavs", label: "UAVs", icon: <UAVIcon /> },
    { id: "space", label: "Space", icon: <SpaceIcon /> },
    { id: "defense", label: "Defense", icon: <DefenseIcon /> },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070708] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.03),transparent_28%)]" />
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_52%,rgba(0,0,0,0.55)_100%)]" />

      <header className="relative z-10 border-b border-white/[0.06] px-5 py-4">
        <div className="text-[11px] uppercase" style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", letterSpacing: "0.04em", fontWeight: 300 }}>
          <span className="text-white/50">Stillpoint</span>
          <span className="ml-2 text-white/[0.22]" style={{ fontWeight: 200 }}>Intelligence</span>
        </div>
      </header>

      <section className="relative z-10 flex min-h-[calc(100vh-53px)] items-center justify-center px-8 py-12">
        <div className="w-full max-w-[980px]">
          <div className="mb-8">
            <div
              className="text-[11px] uppercase text-white/[0.28]"
              style={{
                fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                letterSpacing: "0.08em",
                fontWeight: 300,
              }}
            >
              Select Vertical
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {verticals.map((vertical) => (
              <VerticalCard
                key={vertical.id}
                label={vertical.label}
                icon={vertical.icon}
                onClick={() => onSelect?.(vertical.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
