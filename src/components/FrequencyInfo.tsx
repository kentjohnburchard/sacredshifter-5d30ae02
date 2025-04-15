
import React from 'react';

interface FrequencyInfoProps {
  frequency: number;
  chakra?: string;
  description?: string;
}

const FrequencyInfo: React.FC<FrequencyInfoProps> = ({
  frequency,
  chakra,
  description
}) => {
  return (
    <div className="p-4 bg-purple-50 rounded-lg">
      <h3 className="text-lg font-medium text-purple-800">{frequency}Hz Frequency</h3>
      {chakra && <p className="text-sm text-purple-700 mt-1">{chakra} Chakra</p>}
      {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
    </div>
  );
};

export default FrequencyInfo;
