
// Date utility functions for moon phases and cosmic timestamps

// Get moon phase based on date
export const getMoonPhase = (date: Date) => {
  // Simple algorithmic approximation of moon phases
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Approximate moon age calculation (0-29 days)
  // This is a simple algorithm for demonstration purposes
  const c = Math.floor(365.25 * year);
  const e = Math.floor(30.6 * month + 0.5);
  const jd = c + e + day - 694039.09; // Julian day
  const moonAge = (jd % 29.53); // Moon age in days (0-29.53)
  
  // Determine moon phase based on age
  if (moonAge < 1.84) {
    return { name: "New Moon", icon: "🌑" };
  } else if (moonAge < 5.53) {
    return { name: "Waxing Crescent", icon: "🌒" };
  } else if (moonAge < 9.22) {
    return { name: "First Quarter", icon: "🌓" };
  } else if (moonAge < 12.91) {
    return { name: "Waxing Gibbous", icon: "🌔" };
  } else if (moonAge < 16.61) {
    return { name: "Full Moon", icon: "🌕" };
  } else if (moonAge < 20.30) {
    return { name: "Waning Gibbous", icon: "🌖" };
  } else if (moonAge < 23.99) {
    return { name: "Last Quarter", icon: "🌗" };
  } else if (moonAge < 27.68) {
    return { name: "Waning Crescent", icon: "🌘" };
  } else {
    return { name: "New Moon", icon: "🌑" };
  }
};

// Get zodiac sign based on date
export const getZodiacSign = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return "Aquarius";
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return "Pisces";
  } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return "Aries";
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return "Taurus";
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return "Gemini";
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return "Cancer";
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return "Leo";
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return "Virgo";
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return "Libra";
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return "Scorpio";
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return "Sagittarius";
  } else {
    return "Capricorn";
  }
};

// Format cosmic timestamp
export const formatCosmicTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  
  // Get local time string
  const timeString = date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  // Get date string
  const dateString = date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return `${dateString} at ${timeString}`;
};
