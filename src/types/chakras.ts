
export type ChakraName = 'Root' | 'Sacral' | 'Solar Plexus' | 'Heart' | 'Throat' | 'Third Eye' | 'Crown';

export type ChakraInfo = {
  name: ChakraName;
  color: string;
  frequency: number;
  element: string;
  location: string;
};

export const chakraData: Record<ChakraName, ChakraInfo> = {
  'Root': {
    name: 'Root',
    color: '#FF0000',
    frequency: 396,
    element: 'Earth',
    location: 'Base of spine'
  },
  'Sacral': {
    name: 'Sacral',
    color: '#FF7F00',
    frequency: 417,
    element: 'Water',
    location: 'Lower abdomen'
  },
  'Solar Plexus': {
    name: 'Solar Plexus',
    color: '#FFFF00',
    frequency: 528,
    element: 'Fire',
    location: 'Upper abdomen'
  },
  'Heart': {
    name: 'Heart',
    color: '#00FF00',
    frequency: 639,
    element: 'Air',
    location: 'Center of chest'
  },
  'Throat': {
    name: 'Throat',
    color: '#0000FF',
    frequency: 741,
    element: 'Ether',
    location: 'Throat'
  },
  'Third Eye': {
    name: 'Third Eye',
    color: '#4B0082',
    frequency: 852,
    element: 'Light',
    location: 'Forehead'
  },
  'Crown': {
    name: 'Crown',
    color: '#8B00FF',
    frequency: 963,
    element: 'Cosmic Energy',
    location: 'Top of head'
  }
};

export function getChakraColor(chakraName: ChakraName): string {
  // Default mapping for chakra colors that works well with Tailwind's color palette
  const chakraColorMap: Record<ChakraName, string> = {
    'Root': '#ef4444',       // red-500
    'Sacral': '#f97316',     // orange-500
    'Solar Plexus': '#eab308', // yellow-500
    'Heart': '#22c55e',      // green-500
    'Throat': '#3b82f6',     // blue-500
    'Third Eye': '#6366f1',  // indigo-500
    'Crown': '#a855f7',      // purple-500
  };

  return chakraColorMap[chakraName] || '#a855f7'; // Default to purple if not found
}
