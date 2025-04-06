
import React from "react";
import { cn } from "@/lib/utils";

type LegalFooterProps = {
  businessName?: string;
  variant?: "standard" | "compact" | "expanded";
  className?: string;
};

/**
 * A footer component that displays legal disclaimers and copyright information
 */
const LegalFooter = ({ 
  businessName = "Sacred Shifter", 
  variant = "standard",
  className
}: LegalFooterProps) => {
  const currentYear = new Date().getFullYear();
  
  // Different content based on variant
  const content = {
    standard: (
      <p className="text-xs text-center text-purple-800/70 dark:text-purple-200/70 px-4">
        <span className="font-medium">Sacred Shifter™, Sacred Blueprint™, Mirror Portal™,</span> and associated features are proprietary systems of {businessName}. 
        All designs, methods, visuals, and language are protected under intellectual property law. Unauthorized use is prohibited.<br />
        © {currentYear} {businessName}. All rights reserved.
      </p>
    ),
    compact: (
      <p className="text-[10px] text-center text-purple-800/70 dark:text-purple-200/70">
        © {currentYear} {businessName}. All rights reserved. All systems proprietary™.
      </p>
    ),
    expanded: (
      <div className="text-xs text-center text-purple-800/70 dark:text-purple-200/70 space-y-2 px-4">
        <p className="font-medium">
          Sacred Shifter™, Sacred Blueprint™, Mirror Portal™, Emotion Engine™, Reality Optimization Engine™, 
          Soul Hug™, Vibe Customizer™, Heart Frequency Playlist™, Resonance Chart™, Frequency Birth Wheel™, 
          Journey Tracker™, and all named archetypes are proprietary systems of {businessName}.
        </p>
        <p>
          All designs, methods, visuals, and language are protected under intellectual property law.
          Unauthorized use, reproduction, or adaptation is strictly prohibited.
        </p>
        <p className="font-medium">© {currentYear} {businessName}. All rights reserved.</p>
      </div>
    )
  };
  
  return (
    <div className={cn("py-4 max-w-4xl mx-auto", className)}>
      {content[variant]}
    </div>
  );
};

export default LegalFooter;
