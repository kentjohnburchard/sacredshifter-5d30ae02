import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

interface ExplanationCardProps {
  section: string;
  className?: string;
}

export const ExplanationCard = ({ section, className }: ExplanationCardProps) => {
  const { liftTheVeil } = useTheme();
  
  const sectionExplanations: { [key: string]: string } = {
    mirrorPortal: "The Mirror Portal uses advanced AI to reflect your inner self. By analyzing your facial expressions and subtle cues, it provides insights into your current emotional state and offers personalized affirmations to enhance self-awareness and promote positive change.",
    soulHug: "Soul Hug is a unique feature that generates a personalized message of support and encouragement. Using advanced AI algorithms, it crafts a message tailored to your specific needs, providing comfort and inspiration to uplift your spirit.",
    heartFrequency: "Heart Frequency offers a curated selection of sound frequencies designed to resonate with your heart chakra. These frequencies promote emotional healing, reduce stress, and foster a sense of inner peace and harmony.",
    loveDashboard: "The Love Dashboard tracks your heart-centered journey and impact. It visualizes your progress in cultivating love, compassion, and positive relationships, providing insights and motivation to continue your path of personal growth.",
  };

  const explanation = sectionExplanations[section] || "No explanation available for this section.";

  return (
    <div className={cn(
      "p-4 rounded-lg bg-white/60 backdrop-blur-sm border",
      liftTheVeil ? "border-purple-400/30" : "border-gray-200",
      className
    )}>
      <p className="text-sm text-gray-700 dark:text-gray-300">{explanation}</p>
    </div>
  );
};
