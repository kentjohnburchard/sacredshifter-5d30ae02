
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { NatalChartResponse } from "@/utils/astro.types";
import { Sparkles, Sun, Moon, Sunrise, PieChart, Planets } from "lucide-react";

interface NatalChartDisplayProps {
  chartData: NatalChartResponse;
  isLoading?: boolean;
}

export const NatalChartDisplay: React.FC<NatalChartDisplayProps> = ({ 
  chartData, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  const getElementColor = (element: string) => {
    switch (element) {
      case 'fire': return 'bg-red-500';
      case 'earth': return 'bg-green-500';
      case 'air': return 'bg-blue-300';
      case 'water': return 'bg-blue-600';
      default: return 'bg-gray-500';
    }
  };

  const getModalityColor = (modality: string) => {
    switch (modality) {
      case 'cardinal': return 'bg-purple-500';
      case 'fixed': return 'bg-amber-500';
      case 'mutable': return 'bg-teal-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getElementDescription = (dominant: string) => {
    switch (dominant) {
      case 'fire': return 'You possess a passionate, energetic, and intuitive nature with a drive to create and inspire.';
      case 'earth': return 'You embody practicality, stability, and resilience with a grounded approach to life.';
      case 'air': return 'Your intellectual, communicative, and social qualities help you connect ideas and people.';
      case 'water': return 'Your emotional depth, intuition, and empathetic nature allow you to feel deeply and connect with others.';
      default: return 'Your cosmic energies are balanced across the elements.';
    }
  };

  // Find dominant element
  const dominantElement = Object.entries(chartData.elements).reduce(
    (max, [element, value]) => (value > max.value ? { element, value } : max),
    { element: '', value: 0 }
  ).element;

  return (
    <div className="space-y-8 mt-6">
      {/* Sun, Moon, Rising Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden border-yellow-200 dark:border-yellow-900/20 backdrop-blur-sm bg-white/80 dark:bg-black/40">
            <CardHeader className="bg-gradient-to-r from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/30 dark:to-amber-950/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  Sun Sign
                </CardTitle>
                <span className="text-lg font-medium text-amber-600 dark:text-amber-400">
                  {chartData.sun_sign}
                </span>
              </div>
              <CardDescription>Your core identity and ego</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm">
                As a {chartData.sun_sign}, your essential nature is {' '}
                {chartData.sun_sign === 'Aries' && 'bold, pioneering, and energetic.'}
                {chartData.sun_sign === 'Taurus' && 'steady, practical, and sensual.'}
                {chartData.sun_sign === 'Gemini' && 'curious, adaptable, and communicative.'}
                {chartData.sun_sign === 'Cancer' && 'nurturing, intuitive, and protective.'}
                {chartData.sun_sign === 'Leo' && 'creative, confident, and generous.'}
                {chartData.sun_sign === 'Virgo' && 'analytical, detail-oriented, and practical.'}
                {chartData.sun_sign === 'Libra' && 'harmonious, diplomatic, and partnership-focused.'}
                {chartData.sun_sign === 'Scorpio' && 'intense, transformative, and deep.'}
                {chartData.sun_sign === 'Sagittarius' && 'adventurous, philosophical, and freedom-loving.'}
                {chartData.sun_sign === 'Capricorn' && 'disciplined, responsible, and ambitious.'}
                {chartData.sun_sign === 'Aquarius' && 'innovative, humanitarian, and independent.'}
                {chartData.sun_sign === 'Pisces' && 'compassionate, intuitive, and dreamy.'}
                {chartData.sun_sign === 'Unknown' && 'yet to be fully revealed.'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden border-indigo-200 dark:border-indigo-900/20 backdrop-blur-sm bg-white/80 dark:bg-black/40">
            <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Moon className="h-5 w-5 text-indigo-500" />
                  Moon Sign
                </CardTitle>
                <span className="text-lg font-medium text-indigo-600 dark:text-indigo-400">
                  {chartData.moon_sign}
                </span>
              </div>
              <CardDescription>Your emotional landscape</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm">
                Your {chartData.moon_sign} Moon reveals an emotional style that is {' '}
                {chartData.moon_sign === 'Aries' && 'impulsive, direct, and passionate.'}
                {chartData.moon_sign === 'Taurus' && 'steady, sensual, and security-focused.'}
                {chartData.moon_sign === 'Gemini' && 'expressive, changeable, and intellectually-driven.'}
                {chartData.moon_sign === 'Cancer' && 'deeply feeling, nurturing, and nostalgic.'}
                {chartData.moon_sign === 'Leo' && 'warm, dramatic, and in need of acknowledgment.'}
                {chartData.moon_sign === 'Virgo' && 'analytical, perfectionistic, and service-oriented.'}
                {chartData.moon_sign === 'Libra' && 'harmony-seeking, balanced, and relationship-focused.'}
                {chartData.moon_sign === 'Scorpio' && 'intense, private, and transformative.'}
                {chartData.moon_sign === 'Sagittarius' && 'optimistic, freedom-seeking, and expansive.'}
                {chartData.moon_sign === 'Capricorn' && 'reserved, structured, and achievement-oriented.'}
                {chartData.moon_sign === 'Aquarius' && 'detached, unusual, and community-focused.'}
                {chartData.moon_sign === 'Pisces' && 'sensitive, empathic, and boundary-dissolving.'}
                {chartData.moon_sign === 'Unknown' && 'complex and multifaceted.'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden border-teal-200 dark:border-teal-900/20 backdrop-blur-sm bg-white/80 dark:bg-black/40">
            <CardHeader className="bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-teal-950/30 dark:to-cyan-950/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sunrise className="h-5 w-5 text-teal-500" />
                  Rising Sign
                </CardTitle>
                <span className="text-lg font-medium text-teal-600 dark:text-teal-400">
                  {chartData.rising_sign}
                </span>
              </div>
              <CardDescription>Your outward persona</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm">
                With {chartData.rising_sign} Rising, you appear to others as {' '}
                {chartData.rising_sign === 'Aries' && 'assertive, energetic, and direct.'}
                {chartData.rising_sign === 'Taurus' && 'steady, sensual, and reliable.'}
                {chartData.rising_sign === 'Gemini' && 'talkative, curious, and youthful.'}
                {chartData.rising_sign === 'Cancer' && 'nurturing, protective, and approachable.'}
                {chartData.rising_sign === 'Leo' && 'confident, charismatic, and expressive.'}
                {chartData.rising_sign === 'Virgo' && 'precise, helpful, and analytical.'}
                {chartData.rising_sign === 'Libra' && 'charming, diplomatic, and socially graceful.'}
                {chartData.rising_sign === 'Scorpio' && 'intense, mysterious, and penetrating.'}
                {chartData.rising_sign === 'Sagittarius' && 'adventurous, optimistic, and straightforward.'}
                {chartData.rising_sign === 'Capricorn' && 'reserved, dignified, and responsible.'}
                {chartData.rising_sign === 'Aquarius' && 'unique, progressive, and somewhat detached.'}
                {chartData.rising_sign === 'Pisces' && 'gentle, dreamy, and somewhat elusive.'}
                {chartData.rising_sign === 'Unknown' && 'multifaceted and adaptable.'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Elements and Modalities Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Elements Chart */}
          <Card className="overflow-hidden border-purple-100 dark:border-purple-900/20 backdrop-blur-sm bg-white/80 dark:bg-black/40">
            <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-500" />
                Your Elemental Alignment
              </CardTitle>
              <CardDescription>
                The cosmic building blocks of your chart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(chartData.elements).map(([element, value]) => (
                  <div key={element} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{element}</span>
                      <span>{value} planets</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getElementColor(element)}`}
                        style={{ width: `${(value / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 border border-purple-100 dark:border-purple-800/30 rounded-lg bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                  <span>Your Dominant Element: <span className="capitalize font-medium">{dominantElement}</span></span>
                </h4>
                <p className="text-sm">{getElementDescription(dominantElement)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Modalities Chart */}
          <Card className="overflow-hidden border-blue-100 dark:border-blue-900/20 backdrop-blur-sm bg-white/80 dark:bg-black/40">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <CardTitle className="flex items-center gap-2">
                <Planets className="h-5 w-5 text-blue-500" />
                Your Cosmic Modalities
              </CardTitle>
              <CardDescription>
                How you initiate and respond to life's energies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(chartData.modalities).map(([modality, value]) => (
                  <div key={modality} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{modality}</span>
                      <span>{value} planets</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getModalityColor(modality)}`}
                        style={{ width: `${(value / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/30 text-center">
                  <h5 className="text-xs font-medium text-purple-800 dark:text-purple-300">Cardinal</h5>
                  <p className="text-xs mt-1">Initiating action</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/30 text-center">
                  <h5 className="text-xs font-medium text-amber-800 dark:text-amber-300">Fixed</h5>
                  <p className="text-xs mt-1">Stabilizing energy</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/40 dark:to-teal-900/30 text-center">
                  <h5 className="text-xs font-medium text-teal-800 dark:text-teal-300">Mutable</h5>
                  <p className="text-xs mt-1">Adaptable flow</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Chart SVG Display */}
      {chartData.chart_svg_url && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Card className="overflow-hidden border-purple-100 dark:border-purple-900/20 backdrop-blur-sm bg-white/80 dark:bg-black/40">
            <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <CardTitle>Your Natal Chart</CardTitle>
              <CardDescription>
                Planetary placements at your moment of birth
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-4">
              <img 
                src={chartData.chart_svg_url} 
                alt="Natal Chart" 
                className="max-w-full h-auto rounded-lg"
              />
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Dominant Planets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="overflow-hidden border-blue-100 dark:border-blue-900/20 backdrop-blur-sm bg-white/80 dark:bg-black/40">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Dominant Planetary Influences
            </CardTitle>
            <CardDescription>
              The celestial bodies that most strongly shape your essence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 justify-center">
              {chartData.dominant_planets.length > 0 ? (
                chartData.dominant_planets.map((planet) => (
                  <div key={planet} className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {planet}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 italic">Planetary data unavailable</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
