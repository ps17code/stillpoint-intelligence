"use client";
import { useParams } from "next/navigation";
import InputPageTemplate from "@/components/InputPageTemplate";

import germaniumData from "@/data/inputs/germanium.json";
import galliumData from "@/data/inputs/gallium.json";
import fiberData from "@/data/inputs/fiber-optic-cable.json";
import type { InputPageData } from "@/lib/input-data";

const DATA_MAP: Record<string, InputPageData> = {
  "germanium": germaniumData as unknown as InputPageData,
  "gallium": galliumData as unknown as InputPageData,
  "fiber-optic-cable": fiberData as unknown as InputPageData,
};

export default function InputPage() {
  const params = useParams();
  const slug = params.slug as string;
  const data = DATA_MAP[slug];

  if (!data) return <div style={{ color: "#ece8e1", padding: 40, fontFamily: "'DM Sans', sans-serif" }}>Input not found</div>;

  return <InputPageTemplate data={data} />;
}
