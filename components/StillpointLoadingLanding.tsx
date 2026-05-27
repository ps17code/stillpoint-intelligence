"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const statusLines = [
  "Anchoring stillpoint",
  "Resolving intelligence layer",
  "Mapping frontier systems",
  "Loading terminal",
];

export default function StillpointLoadingLanding({ onComplete }: { onComplete: () => void }) {
  const [status, setStatus] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus((current) => (current + 1) % statusLines.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  // Auto-complete after animation finishes
  useEffect(() => {
    const timer = setTimeout(onComplete, 10000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const arcs = [
    { r: 29, delay: 0.48 },
    { r: 49, delay: 0.72 },
    { r: 69, delay: 0.96 },
    { r: 89, delay: 1.2 },
    { r: 109, delay: 1.44 },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white antialiased">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_36%_50%,rgba(255,255,255,0.055),transparent_28%),radial-gradient(circle_at_60%_50%,rgba(255,255,255,0.025),transparent_34%)]" />

      <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_36%,rgba(0,0,0,0.7)_100%)]" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-8">
        <div className="flex origin-center scale-[1.5] items-center gap-[25px]">
          <motion.div
            initial={{ opacity: 0, filter: "blur(8px)", scale: 0.985 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[45px] w-[45px] overflow-hidden border border-white/[0.32] bg-black/20 shadow-[0_0_22px_rgba(255,255,255,0.025)]"
          >
            <svg
              viewBox="0 0 92 92"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <clipPath id="mark-clip">
                  <rect x="0" y="0" width="92" height="92" />
                </clipPath>

                <filter
                  id="soft-glow"
                  x="-80%"
                  y="-80%"
                  width="260%"
                  height="260%"
                >
                  <feGaussianBlur stdDeviation="2.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter
                  id="line-polish"
                  x="-30%"
                  y="-30%"
                  width="160%"
                  height="160%"
                >
                  <feGaussianBlur stdDeviation="0.18" />
                </filter>
              </defs>

              <g clipPath="url(#mark-clip)">
                {arcs.map((arc) => (
                  <motion.circle
                    key={arc.r}
                    cx="7.5"
                    cy="7.5"
                    r={arc.r}
                    fill="none"
                    stroke="rgba(255,255,255,0.72)"
                    strokeWidth="1.05"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="butt"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 0.68, 0.68] }}
                    transition={{
                      pathLength: {
                        delay: arc.delay,
                        duration: 1.45,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      opacity: {
                        delay: arc.delay,
                        duration: 1.05,
                        ease: "easeOut",
                      },
                    }}
                    style={{
                      transformOrigin: "7.5px 7.5px",
                      filter: "url(#line-polish)",
                    }}
                  />
                ))}

                <motion.circle
                  cx="5.5"
                  cy="5.5"
                  r="18"
                  fill="rgba(255,255,255,0.96)"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.82,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ transformOrigin: "5.5px 5.5px" }}
                />
              </g>
            </svg>
          </motion.div>

          <div className="flex items-center gap-[10px] pt-0">
            <motion.span
              initial={{ opacity: 0, y: 3, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: 1.85,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-sans text-[15px] font-[300] uppercase leading-none text-white/50"
              style={{
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              Stillpoint
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 3, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: 2.1,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-sans text-[15px] font-[200] uppercase leading-none text-white/[0.22]"
              style={{
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              Intelligence
            </motion.span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.45, duration: 0.9, ease: "easeOut" }}
          className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-3"
        >
          <div className="h-px w-10 overflow-hidden bg-white/10">
            <motion.div
              className="h-full w-full bg-white/35"
              animate={{ x: ["-100%", "120%"] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <motion.p
            key={status}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/25"
          >
            {statusLines[status]}
          </motion.p>
        </motion.div>
      </section>
    </main>
  );
}
