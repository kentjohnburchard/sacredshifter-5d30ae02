
import React, { useState } from 'react';
import { Calendar, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isPrime } from '@/utils/primeCalculations';

interface FrequencyProfile {
  primaryFrequency: number;
  secondaryFrequencies: number[];
  numerologicalSum: number;
  primeFactors: number[];
  personalYear: number;
}

const BirthdateAnalysis: React.FC = () => {
  const [birthdate, setBirthdate] = useState<string>('');
  const [profile, setProfile] = useState<FrequencyProfile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Handle birthdate input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthdate(e.target.value);
  };
  
  // Analyze the birthdate
  const analyzeBirthdate = () => {
    if (!birthdate) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      try {
        const date = new Date(birthdate);
        if (isNaN(date.getTime())) throw new Error('Invalid date');
        
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        
        // Calculate numerological sum of birthdate
        const sumDigits = (num: number): number => {
          return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        };
        
        const reducedDay = sumDigits(day);
        const reducedMonth = sumDigits(month);
        const reducedYear = sumDigits(year);
        
        const sum = reducedDay + reducedMonth + reducedYear;
        
        // Reduce to single digit unless it's a "master number" (11, 22)
        let finalSum = sum;
        if (sum > 9 && sum !== 11 && sum !== 22) {
          finalSum = sumDigits(sum);
        }
        
        // Extract prime factors
        const primeFactors = extractPrimeFactors(finalSum);
        
        // Map to frequencies
        const primaryFrequency = calculatePrimaryFrequency(finalSum, primeFactors);
        const secondaryFrequencies = calculateSecondaryFrequencies(day, month, finalSum);
        
        // Calculate personal year
        const currentYear = new Date().getFullYear();
        const personalYear = sumDigits(day + month + currentYear);
        
        setProfile({
          primaryFrequency,
          secondaryFrequencies,
          numerologicalSum: finalSum,
          primeFactors,
          personalYear
        });
        
        setIsAnalyzing(false);
      } catch (error) {
        console.error("Error analyzing birthdate:", error);
        setIsAnalyzing(false);
      }
    }, 1500);
  };
  
  // Extract prime factors from a number
  const extractPrimeFactors = (num: number): number[] => {
    const factors: number[] = [];
    const primeFactors: number[] = [];
    
    // Special case for life path numbers
    if (num === 11 || num === 22) {
      primeFactors.push(11);
      return primeFactors;
    }
    
    // Get all factors
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) {
        factors.push(i);
      }
    }
    
    // Filter for prime factors
    factors.forEach(factor => {
      if (isPrime(factor)) {
        primeFactors.push(factor);
      }
    });
    
    return primeFactors;
  };
  
  // Calculate primary frequency based on numerological sum and prime factors
  const calculatePrimaryFrequency = (sum: number, primeFactors: number[]): number => {
    // Map life path numbers to specific frequencies
    const lifePathFrequencies: Record<number, number> = {
      1: 272, // Individual leadership
      2: 417, // Harmony and balance
      3: 528, // Creative expression
      4: 396, // Stability and foundation
      5: 639, // Freedom and change
      6: 741, // Nurturing and responsibility
      7: 852, // Spiritual insight
      8: 963, // Material abundance
      9: 174, // Humanitarian service
      11: 304, // Intuitive mastery
      22: 432, // Master builder
    };
    
    return lifePathFrequencies[sum] || 528; // Default to 528Hz if no match
  };
  
  // Calculate secondary frequencies based on birth components
  const calculateSecondaryFrequencies = (day: number, month: number, sum: number): number[] => {
    const frequencies = [];
    
    // Add a frequency based on birth day
    if (day <= 31) {
      frequencies.push(220 + day); // 221-251 Hz range
    }
    
    // Add a frequency based on birth month
    if (month <= 12) {
      frequencies.push(400 + (month * 20)); // 420-640 Hz range
    }
    
    // Add a third frequency based on life path
    if (sum === 1 || sum === 4 || sum === 7) {
      frequencies.push(396); // Earth element group
    } else if (sum === 2 || sum === 5 || sum === 8) {
      frequencies.push(417); // Water element group
    } else {
      frequencies.push(528); // Air/fire element group
    }
    
    return frequencies;
  };
  
  // Get chakra association for a frequency
  const getChakraForFrequency = (freq: number): string => {
    if (freq < 280) return "Root";
    if (freq < 320) return "Sacral";
    if (freq < 400) return "Solar Plexus";
    if (freq < 500) return "Heart";
    if (freq < 600) return "Throat";
    if (freq < 700) return "Third Eye";
    return "Crown";
  };
  
  // Get color for chakra
  const getChakraColor = (chakra: string): string => {
    switch(chakra) {
      case "Root": return "from-red-600 to-red-400";
      case "Sacral": return "from-orange-600 to-orange-400";
      case "Solar Plexus": return "from-yellow-500 to-amber-400";
      case "Heart": return "from-green-600 to-green-400";
      case "Throat": return "from-blue-600 to-blue-400";
      case "Third Eye": return "from-indigo-600 to-indigo-400";
      case "Crown": return "from-violet-600 to-violet-400";
      default: return "from-purple-600 to-purple-400";
    }
  };
  
  // Get affirmation for frequency
  const getAffirmation = (freq: number): string => {
    const affirmations: Record<number, string> = {
      272: "I express my creativity freely and authentically.",
      304: "I claim my path. I lead with truth.",
      396: "I am grounded, safe, and secure.",
      417: "I release the past and flow with change.",
      432: "I am in harmony with the universe.",
      528: "My heart is open to giving and receiving love.",
      639: "I express my truth with clarity and confidence.",
      741: "I am connected to divine wisdom.",
      852: "I am aligned with my highest spiritual purpose.",
      963: "I am one with the cosmic consciousness.",
    };
    
    return affirmations[freq] || "I am aligned with my highest vibrational frequency.";
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-playfair text-amber-200">Birthdate Resonance Mapping</h2>
        <p className="text-purple-200">Discover your personal frequency profile based on your birthdate</p>
      </div>
      
      <div className="max-w-md mx-auto mb-8">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="birthdate" className="block mb-2 text-sm font-medium text-purple-200">
              Enter your birthdate
            </label>
            <input
              type="date"
              id="birthdate"
              value={birthdate}
              onChange={handleInputChange}
              className="w-full p-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
          </div>
          
          <div className="flex items-end">
            <Button
              onClick={analyzeBirthdate}
              disabled={!birthdate || isAnalyzing}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              {isAnalyzing ? (
                <>
                  <Circle className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Results Display */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Frequency Card */}
          <div className="col-span-1 md:col-span-2">
            <div className={`bg-gradient-to-r ${getChakraColor(getChakraForFrequency(profile.primaryFrequency))} rounded-lg p-5 shadow-lg`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-medium">Your Primary Frequency</h3>
                <span className="text-2xl font-bold">{profile.primaryFrequency} Hz</span>
              </div>
              
              <div className="flex items-center mb-3">
                <div className="h-3 w-3 rounded-full bg-white mr-2"></div>
                <span>{getChakraForFrequency(profile.primaryFrequency)} Chakra Resonance</span>
              </div>
              
              <p className="italic text-lg mb-3 font-playfair">
                "{getAffirmation(profile.primaryFrequency)}"
              </p>
              
              <div className="bg-black/20 p-3 rounded">
                <p className="text-sm">
                  Life Path Number: <span className="font-bold">{profile.numerologicalSum}</span>
                  <br />
                  Personal Year: <span className="font-bold">{profile.personalYear}</span>
                </p>
              </div>
              
              <div className="mt-3 flex justify-center">
                <div className="h-20 w-20 relative">
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
                  <div className="absolute inset-2 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute inset-4 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Secondary Frequencies */}
          <div className="bg-gray-800/40 rounded-lg p-5">
            <h3 className="text-lg font-medium mb-3">Secondary Resonances</h3>
            
            <ul className="space-y-3">
              {profile.secondaryFrequencies.map((freq, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${getChakraColor(getChakraForFrequency(freq))} mr-2`}></div>
                    <span>{freq} Hz</span>
                  </div>
                  <span className="text-sm opacity-75">{getChakraForFrequency(freq)}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Prime Factors Analysis */}
          <div className="bg-gray-800/40 rounded-lg p-5">
            <h3 className="text-lg font-medium mb-3">Prime Number Influences</h3>
            
            <div className="space-y-3">
              {profile.primeFactors.map((prime, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-600/30 text-amber-200 flex items-center justify-center font-bold mr-3">
                    {prime}
                  </div>
                  <div>
                    <p className="text-sm">
                      {prime === 2 && "Balance & Duality"}
                      {prime === 3 && "Creative Expression"}
                      {prime === 5 && "Freedom & Change"}
                      {prime === 7 && "Spiritual Insight"}
                      {prime === 11 && "Intuitive Mastery"}
                      {prime === 13 && "Transformation"}
                      {prime === 17 && "Intuition & The Seer"}
                      {prime === 19 && "Leadership & Will"}
                      {prime === 23 && "Truth-seeking"}
                      {prime === 29 && "Self-Discovery"}
                      {prime === 31 && "Creative Expansion"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Empty state for no profile */}
      {!profile && !isAnalyzing && (
        <div className="text-center p-10">
          <div className="opacity-50">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-purple-300" />
            <p>Enter your birthdate to see your vibrational frequencies</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdateAnalysis;
