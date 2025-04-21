
import React from "react";

interface ToneInfoCardProps {
  frequency: number;
  chakra: string;
  color: string;
  archetype: string;
  description: string;
  isPlaying?: boolean;
}
const ToneInfoCard: React.FC<ToneInfoCardProps> = ({
  frequency,
  chakra,
  color,
  archetype,
  description,
  isPlaying = false,
}) => {
  return (
    <div
      className={`p-4 rounded-lg transition-all shadow-xl mb-3 border-2`}
      style={{
        borderColor: color,
        boxShadow: isPlaying
          ? `0 0 18px 2px ${color},0 0 64px 8px ${color}33`
          : `0 0 6px 1px ${color}55`,
        background: isPlaying
          ? `linear-gradient(120deg, ${color}22 10%, #232044 100%)`
          : "#18152a",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-lg font-bold"
          style={{
            color,
            textShadow: isPlaying ? `0 0 6px ${color}` : undefined,
            letterSpacing: "1.5px"
          }}
        >
          {frequency} Hz
        </span>
        <span
          className="text-xs uppercase tracking-wider rounded px-2 py-1 font-semibold"
          style={{
            background: color,
            color: "#fff",
            filter: "brightness(0.90)",
            boxShadow: isPlaying
              ? `0 0 10px 2px ${color},0 0 32px 10px ${color}66`
              : undefined,
          }}
        >
          {chakra}
        </span>
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span
          className="block w-3 h-3 rounded-full animate-pulse"
          style={{
            background: color,
            boxShadow: isPlaying ? `0 0 16px 4px ${color}` : undefined,
            opacity: isPlaying ? 1 : 0.75,
          }}
          aria-label={`Chakra color: ${chakra}`}
        />
        <span className="text-md font-playfair font-semibold" style={{ color }}>{archetype}</span>
      </div>
      <div className="text-sm opacity-90 text-white mb-1">{description}</div>
      {isPlaying && (
        <div className="mt-1 text-xs text-yellow-300 animate-pulse font-semibold">
          Vibrational Alignment Active
        </div>
      )}
    </div>
  );
};

export default ToneInfoCard;
