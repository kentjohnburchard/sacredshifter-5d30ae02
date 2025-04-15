
import React from 'react';

type PrimeIconProps = {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

export const PrimeIcon: React.FC<PrimeIconProps> = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 4v16" />
      <path d="M17 4v10" />
      <path d="M7 12h10" />
      <path d="M17 20l-5-3.5 5-3.5" />
    </svg>
  );
};

export default PrimeIcon;
