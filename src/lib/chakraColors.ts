
/**
 * Returns a color scheme based on the provided chakra
 * @param chakras Array of chakras to determine color scheme from
 * @returns Color scheme object or string
 */
export function getChakraColorScheme(chakras: string[] = []) {
  // If no chakras provided, return default colors
  if (!chakras || chakras.length === 0) {
    return {
      primary: '#9370db',   // Purple
      secondary: '#6a5acd', // Slateblue
      tertiary: '#9932cc',  // Darkorchid
      accent: '#e0b0ff',    // Mauve
      background: '#2d1b4e'  // Dark purple
    };
  }
  
  // Use the first chakra in the array to determine color scheme
  const primaryChakra = chakras[0].toLowerCase();
  
  switch (primaryChakra) {
    case 'root':
      return {
        primary: '#ff0000',    // Red
        secondary: '#8b0000',  // Dark red
        tertiary: '#ff4500',   // Orangered
        accent: '#ff6347',     // Tomato
        background: '#3d0c0c'  // Dark maroon
      };
      
    case 'sacral':
      return {
        primary: '#ff7f00',    // Orange
        secondary: '#ff8c00',  // Darkorange
        tertiary: '#ffa500',   // Orange
        accent: '#ffd700',     // Gold
        background: '#3d2210'  // Dark orange-brown
      };
      
    case 'solar plexus':
      return {
        primary: '#ffff00',    // Yellow
        secondary: '#ffd700',  // Gold
        tertiary: '#daa520',   // Goldenrod
        accent: '#f0e68c',     // Khaki
        background: '#3d3d10'  // Dark olive
      };
      
    case 'heart':
      return {
        primary: '#00ff00',    // Green
        secondary: '#32cd32',  // Limegreen
        tertiary: '#008000',   // Green
        accent: '#98fb98',     // Palegreen
        background: '#0f3d0f'  // Dark green
      };
      
    case 'throat':
      return {
        primary: '#00ffff',    // Cyan
        secondary: '#00bfff',  // Deepskyblue
        tertiary: '#1e90ff',   // Dodgerblue
        accent: '#87ceeb',     // Skyblue
        background: '#0f3d3d'  // Dark teal
      };
      
    case 'third eye':
      return {
        primary: '#0000ff',    // Blue
        secondary: '#000080',  // Navy
        tertiary: '#4169e1',   // Royalblue
        accent: '#6495ed',     // Cornflowerblue
        background: '#0f0f3d'  // Dark blue
      };
      
    case 'crown':
      return {
        primary: '#8a2be2',    // Blueviolet
        secondary: '#9370db',  // Mediumpurple
        tertiary: '#9932cc',   // Darkorchid
        accent: '#ba55d3',     // Mediumorchid
        background: '#2d1b4e'  // Dark purple
      };
      
    default:
      // If chakra name not recognized, return purple theme
      return {
        primary: '#9370db',    // Purple
        secondary: '#6a5acd',  // Slateblue
        tertiary: '#9932cc',   // Darkorchid
        accent: '#e0b0ff',     // Mauve
        background: '#2d1b4e'  // Dark purple
      };
  }
}

/**
 * Gets just the primary color for a chakra
 * @param chakra Chakra name
 * @returns Primary color hex code
 */
export function getChakraColor(chakra: string): string {
  const scheme = getChakraColorScheme([chakra]);
  return typeof scheme === 'string' ? scheme : scheme.primary;
}

/**
 * Maps chakras to their corresponding colors
 */
export const chakraColorMap: Record<string, string> = {
  'root': '#ff0000',
  'sacral': '#ff7f00',
  'solar plexus': '#ffff00',
  'heart': '#00ff00',
  'throat': '#00ffff',
  'third eye': '#0000ff',
  'crown': '#8a2be2',
};
