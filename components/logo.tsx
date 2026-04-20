import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export function Logo({ className, showTagline = false }: LogoProps) {
  return (
    <div className={cn("flex flex-col items-start leading-none", className)}>
      <div className="flex items-center tracking-tighter">
        <span className="text-xl font-black text-foreground">CA</span>
        <span className="text-xl font-black text-primary ml-1">MENTOR</span>
      </div>
      {showTagline && (
        <span className="text-[10px] font-medium text-foreground/80 mt-0.5 whitespace-nowrap">
          You Won't Have to Study Again
        </span>
      )}
    </div>
  );
}
