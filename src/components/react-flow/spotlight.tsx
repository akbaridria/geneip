"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { createContext, useContext, useState } from "react";

interface SpotlightContextProps {
  spotlightActive: boolean;
  setSpotlightActive: (active: boolean) => void;
}

const SpotlightContext = createContext<SpotlightContextProps>({
  spotlightActive: false,
  setSpotlightActive: () => {},
});

export function Spotlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [spotlightActive, setSpotlightActive] = useState(false);

  return (
    <SpotlightContext.Provider value={{ spotlightActive, setSpotlightActive }}>
      <div
        className={cn("relative flex items-center justify-center", className)}
        onMouseEnter={() => setSpotlightActive(true)}
        onMouseLeave={() => setSpotlightActive(false)}
      >
        {children}
      </div>
    </SpotlightContext.Provider>
  );
}

export function SpotlightCard({
  children,
  className,
  onClick,
  onMouseMove,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseMove?: (e: React.MouseEvent) => void;
}) {
  const { spotlightActive } = useContext(SpotlightContext);

  return (
    <div
      className={cn(
        "relative h-full w-full rounded-xl border border-white/[0.08] bg-card p-0 transition-all",
        spotlightActive &&
          "border-white/[0.2] shadow-[0_0_30px_1px_rgba(var(--primary-rgb),0.3)]",
        className
      )}
      style={{
        background: spotlightActive
          ? "radial-gradient(800px circle at var(--x) var(--y), rgba(var(--primary-rgb),0.1), transparent 40%)"
          : "",
      }}
      onClick={onClick}
      onMouseMove={(e) => {
        if (!onMouseMove) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        e.currentTarget.style.setProperty("--x", `${x}px`);
        e.currentTarget.style.setProperty("--y", `${y}px`);

        onMouseMove(e);
      }}
    >
      {children}
    </div>
  );
}
