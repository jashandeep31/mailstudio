import { Button } from "@repo/ui/components/button";
import { ArrowUpRight, Plus } from "lucide-react";
import React from "react";

type BrandKit = {
  id: string;
  name: string;
  tagline: string;
  industry: string;
  colors: {
    label: string;
    hex: string;
  }[];
  voice: string;
};

const brandKits: BrandKit[] = [
  {
    id: "studiopulse",
    name: "Studio Pulse",
    tagline: "Creative production powerhouse",
    industry: "Media",
    voice: "Bold · Confident · Avant garde",
    colors: [
      { label: "Primary", hex: "#FF6B3D" },
      { label: "Accent", hex: "#0D3B66" },
      { label: "Neutral", hex: "#F4EDE4" },
    ],
  },
  {
    id: "northern",
    name: "Northern Grove",
    tagline: "Eco-first DTC homeware",
    industry: "Lifestyle",
    voice: "Warm · Organic · Trustworthy",
    colors: [
      { label: "Primary", hex: "#2F5233" },
      { label: "Accent", hex: "#7ED957" },
      { label: "Neutral", hex: "#FAF7F2" },
    ],
  },
  {
    id: "lumen",
    name: "Lumen Labs",
    tagline: "Precision biotech accelerator",
    industry: "Healthcare",
    voice: "Clinical · Assured · Bright",
    colors: [
      { label: "Primary", hex: "#1D3557" },
      { label: "Accent", hex: "#A8DADC" },
      { label: "Neutral", hex: "#F1FAEE" },
    ],
  },
  {
    id: "orbit",
    name: "Orbit Fintech",
    tagline: "Personal wealth autopilot",
    industry: "Finance",
    voice: "Sleek · Insightful · Calm",
    colors: [
      { label: "Primary", hex: "#635BFF" },
      { label: "Accent", hex: "#FFC857" },
      { label: "Neutral", hex: "#F7F7FF" },
    ],
  },
];

export default function page() {
  return (
    <section className="space-y-8 px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm font-medium tracking-[0.28em] uppercase">
            Brandkits
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Craft consistent brand stories
          </h1>
          <p className="text-muted-foreground">
            Keep palettes, typography, and tone in sync for every template you
            ship.
          </p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Add brand kit
        </Button>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {brandKits.map((kit) => (
          <article
            key={kit.id}
            className="group border-border/60 bg-background/70 hover:border-primary/40 hover:ring-primary/20 flex flex-col justify-between rounded-3xl border p-5 shadow-sm ring-1 ring-transparent transition hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                    {kit.industry}
                  </p>
                  <h2 className="text-xl font-semibold">{kit.name}</h2>
                  <p className="text-muted-foreground text-sm">{kit.tagline}</p>
                </div>
                <Button size="icon" variant="ghost" className="rounded-full">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                  Palette
                </p>
                <div className="flex gap-3">
                  {kit.colors.map((color) => (
                    <div key={color.hex} className="space-y-1">
                      <div
                        className="h-16 w-16 rounded-2xl border border-white/20 shadow-inner"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="text-muted-foreground text-[11px] font-medium">
                        <p>{color.label}</p>
                        <p className="font-mono uppercase">{color.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-muted-foreground/30 text-muted-foreground mt-6 rounded-2xl border border-dashed p-4 text-sm">
              <p className="text-foreground font-medium">Voice & tone</p>
              <p>{kit.voice}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
