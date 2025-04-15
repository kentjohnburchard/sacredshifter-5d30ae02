
export const getColorFromScheme = (scheme: string = 'purple'): string => {
  switch (scheme) {
    case 'blue': return '#1e90ff';
    case 'pink': return '#ff69b4';
    case 'gold': return '#ffd700';
    default: return '#9370db'; // Purple default
  }
};

export const calculateAudioMetrics = (dataArray: Uint8Array): {
  average: number;
  peak: number;
} => {
  const sum = dataArray.reduce((a, b) => a + b, 0);
  const peak = Math.max(...Array.from(dataArray));
  return {
    average: sum / dataArray.length,
    peak,
  };
};
