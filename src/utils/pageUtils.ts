
export const getThemeClasses = (theme?: string): string => {
  switch (theme) {
    case 'cosmic':
      return 'bg-gradient-to-br from-indigo-900/40 via-black to-purple-900/40';
    case 'heart':
      return 'bg-gradient-to-br from-pink-900/40 via-black to-rose-900/40';
    case 'earth':
      return 'bg-gradient-to-br from-green-900/40 via-black to-emerald-900/40';
    case 'water':
      return 'bg-gradient-to-br from-blue-900/40 via-black to-cyan-900/40';
    case 'fire':
      return 'bg-gradient-to-br from-orange-900/40 via-black to-red-900/40';
    case 'air':
      return 'bg-gradient-to-br from-sky-900/40 via-black to-cyan-900/40';
    case 'violet':
      return 'bg-gradient-to-br from-violet-900/40 via-black to-purple-900/40';
    default:
      return 'bg-gradient-to-br from-purple-900/40 via-black to-blue-900/40';
  }
};

export const getChakraColor = (chakra?: string): string => {
  switch (chakra?.toLowerCase()) {
    case 'root':
      return 'red';
    case 'sacral':
      return 'orange';
    case 'solar plexus':
      return 'yellow';
    case 'heart':
      return 'green';
    case 'throat':
      return 'blue';
    case 'third eye':
      return 'indigo';
    case 'crown':
      return 'violet';
    case 'transpersonal':
      return 'purple';
    default:
      return 'purple';
  }
};

export const getChakraGradient = (chakra?: string): string => {
  switch (chakra?.toLowerCase()) {
    case 'root':
      return 'bg-gradient-to-br from-red-900/40 via-black to-red-900/20';
    case 'sacral':
      return 'bg-gradient-to-br from-orange-900/40 via-black to-orange-900/20';
    case 'solar plexus':
      return 'bg-gradient-to-br from-yellow-900/40 via-black to-yellow-900/20';
    case 'heart':
      return 'bg-gradient-to-br from-green-900/40 via-black to-green-900/20';
    case 'throat':
      return 'bg-gradient-to-br from-blue-900/40 via-black to-blue-900/20';
    case 'third eye':
      return 'bg-gradient-to-br from-indigo-900/40 via-black to-indigo-900/20';
    case 'crown':
      return 'bg-gradient-to-br from-violet-900/40 via-black to-violet-900/20';
    case 'transpersonal':
      return 'bg-gradient-to-br from-purple-900/40 via-black to-purple-900/20';
    default:
      return 'bg-gradient-to-br from-purple-900/40 via-black to-blue-900/20';
  }
};
