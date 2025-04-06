
import React from "react";
import { cn } from "@/lib/utils";

type TrademarkedNameProps = {
  children: React.ReactNode;
  showSymbol?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
};

/**
 * A component that wraps branded terms and adds the trademark symbol
 */
const TrademarkedName = ({ 
  children, 
  showSymbol = true, 
  className,
  size = "md" 
}: TrademarkedNameProps) => {
  // Determine the trademark symbol size
  const symbolSizes = {
    sm: "text-[0.5em]",
    md: "text-[0.6em]",
    lg: "text-[0.65em]"
  };
  
  const symbolSize = symbolSizes[size];
  
  return (
    <span className={cn("trademarked", className)}>
      {children}
      {showSymbol && <sup className={cn("ml-[1px]", symbolSize)}>™</sup>}
    </span>
  );
};

export default TrademarkedName;
