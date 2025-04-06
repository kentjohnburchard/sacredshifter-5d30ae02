
import React from "react";
import { cn } from "@/lib/utils";

type ShareOverlayProps = {
  productName?: string; 
  businessName?: string;
  className?: string;
  opacity?: "light" | "medium" | "dark";
};

/**
 * An overlay component for shareable content that includes IP protection text
 */
const ShareOverlay = ({
  productName = "Sacred Blueprint™",
  businessName = "Sacred Shifter™",
  className,
  opacity = "light"
}: ShareOverlayProps) => {
  // Opacity mapping
  const opacityClasses = {
    light: "bg-white/20 text-purple-900/60",
    medium: "bg-white/30 text-purple-900/70",
    dark: "bg-white/40 text-purple-900/80"
  };
  
  return (
    <div className={cn(
      "absolute bottom-0 left-0 right-0 py-2 px-4 text-center text-[10px]",
      opacityClasses[opacity],
      className
    )}>
      This {productName} was generated using proprietary vibrational tech from {businessName}. All rights reserved.
    </div>
  );
};

export default ShareOverlay;
