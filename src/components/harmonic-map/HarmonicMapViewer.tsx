import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  harmonicIntervals, 
  harmonicSequenceCategories, 
  teslaThreeSixNine,
  HarmonicInterval 
} from '@/data/harmonicSequence';
import { hermeticPrinciples } from '@/data/hermeticPrinciples';
import { HelpCircle, Info } from 'lucide-react';
import HarmonicIntervalTonePlayer from './HarmonicIntervalTonePlayer';

export const HarmonicMapViewer: React.FC = () => {
  const [selectedInterval, setSelectedInterval] = useState<HarmonicInterval | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Map of the Harmonic Sequence
        </h1>
        <p className="text-gray-600">
          Explore the sacred geometry of sound and its relationship to Hermetic principles and Tesla's 3-6-9
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/5 relative">
          <div className="aspect-square relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                viewBox="0 0 500 500" 
                className="w-full h-full"
              >
                {[5, 4, 3, 2, 1].map((ring, idx) => (
                  <circle 
                    key={`circle-${ring}`}
                    cx="250" 
                    cy="250" 
                    r={40 + (ring * 40)} 
                    fill="none" 
                    stroke={`rgba(148, 130, 238, ${0.1 + idx * 0.1})`}
                    strokeWidth="1"
                    className="transition-all duration-300"
                  />
                ))}

                <circle 
                  cx="250" 
                  cy="250" 
                  r="20" 
                  fill="#8B5CF6" 
                  className="animate-pulse"
                />
                
                {harmonicIntervals.map((interval, index) => {
                  const ring = Math.ceil((index + 1) / 4);
                  const segmentAngle = ((index % 4) * 90) + (ring * 15);
                  const radius = 40 + (ring * 40);
                  const x = 250 + radius * Math.cos(segmentAngle * Math.PI / 180);
                  const y = 250 + radius * Math.sin(segmentAngle * Math.PI / 180);
                  
                  const isHovered = hoveredId === interval.id;
                  const isSelected = selectedInterval?.id === interval.id;
                  
                  return (
                    <g key={interval.id}>
                      <line 
                        x1="250" 
                        y1="250" 
                        x2={x} 
                        y2={y} 
                        stroke={isHovered || isSelected ? interval.color : `rgba(148, 130, 238, 0.3)`}
                        strokeWidth={isHovered || isSelected ? "3" : "1"}
                        className="transition-all duration-300"
                      />
                      
                      <text 
                        x={x + (x > 250 ? 15 : -15)} 
                        y={y + (y > 250 ? 15 : -15)} 
                        textAnchor={x > 250 ? "start" : "end"}
                        fill={isHovered || isSelected ? interval.color : "#666"}
                        fontSize="10"
                        className="transition-all duration-300 font-medium"
                      >
                        {interval.ratio} {interval.name}
                      </text>
                      
                      <circle 
                        cx={x} 
                        cy={y} 
                        r={isHovered || isSelected ? 12 : 8} 
                        fill={interval.color}
                        stroke={isHovered || isSelected ? "white" : "none"}
                        strokeWidth="2"
                        className="transition-all duration-300 cursor-pointer hover:scale-125"
                        onClick={() => setSelectedInterval(interval)}
                        onMouseEnter={() => setHoveredId(interval.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      />
                      
                      <text 
                        x={x} 
                        y={y} 
                        textAnchor="middle" 
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="8"
                        className="pointer-events-none"
                      >
                        {interval.hertz}
                      </text>
                    </g>
                  );
                })}
                
                {teslaThreeSixNine.principles.map((principle) => {
                  const interval = harmonicIntervals.find(i => principle.frequencies.includes(i.hertz as number));
                  if (!interval) return null;
                  
                  const index = harmonicIntervals.findIndex(i => i.id === interval.id);
                  const ring = Math.ceil((index + 1) / 4);
                  const segmentAngle = ((index % 4) * 90) + (ring * 15);
                  const radius = 40 + (ring * 40);
                  const x = 250 + radius * Math.cos(segmentAngle * Math.PI / 180);
                  const y = 250 + radius * Math.sin(segmentAngle * Math.PI / 180);
                  
                  return (
                    <g key={`tesla-${principle.number}`}>
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="20" 
                        fill="none"
                        stroke="gold"
                        strokeWidth="2"
                        strokeDasharray="5,3"
                        className="animate-pulse pointer-events-none"
                      />
                      <text 
                        x={x} 
                        y={y - 25} 
                        textAnchor="middle" 
                        fill="gold"
                        fontSize="14"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {principle.number}
                      </text>
                    </g>
                  );
                })}

                <text 
                  x="250" 
                  y="480" 
                  textAnchor="middle" 
                  fill="#666"
                  fontSize="8"
                >
                  Inspired by the Map of the Harmonic Sequence
                </text>
              </svg>
              
              <img 
                src="/lovable-uploads/09d5c002-7d5b-48cd-b5f5-77dc788b1781.png" 
                alt="Map of the Harmonic Sequence" 
                className="absolute top-0 left-0 w-full h-full object-contain opacity-10 pointer-events-none"
              />
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-amber-400 mb-1"></div>
              <span className="text-center">Tesla's 3-6-9</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 border-2 border-purple-500 mb-1"></div>
              <span className="text-center">Hermetic Principles</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 mb-1"></div>
              <span className="text-center">Frequency Points</span>
            </div>
          </div>
        </div>

        <div className="lg:w-2/5">
          {selectedInterval ? (
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedInterval.name} ({selectedInterval.ratio})</span>
                  <span className="text-lg font-normal text-gray-600">{selectedInterval.hertz}Hz</span>
                </CardTitle>
                <CardDescription>
                  {selectedInterval.note && <span className="mr-2">Note: {selectedInterval.note}</span>}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p>{selectedInterval.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                    Hermetic Principle
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="ml-1 text-gray-400 hover:text-purple-500">
                          <HelpCircle size={14} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium">
                            {hermeticPrinciples[selectedInterval.hermeticPrinciple].name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {hermeticPrinciples[selectedInterval.hermeticPrinciple].principle}
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </h3>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: hermeticPrinciples[selectedInterval.hermeticPrinciple].color }}
                    ></div>
                    <p>{hermeticPrinciples[selectedInterval.hermeticPrinciple].name}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                    Tesla's 3-6-9 Significance
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="ml-1 text-gray-400 hover:text-amber-500">
                          <Info size={14} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium">Tesla's 3-6-9 Principle</h4>
                          <p className="text-sm text-gray-600">
                            "If you only knew the magnificence of the 3, 6 and 9, then you would have a key to the universe."
                            - Nikola Tesla
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </h3>
                  <p>{selectedInterval.teslaSignificance}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Healing Properties</h3>
                  <ul className="list-disc list-inside pl-2 space-y-1">
                    {selectedInterval.healingProperties.map((property, index) => (
                      <li key={index} className="text-sm">{property}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Listen to Frequency</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">{selectedInterval.hertz} Hz</span>
                      <span className="text-gray-500 text-xs ml-1">Pure Tone</span>
                    </div>
                    <HarmonicIntervalTonePlayer 
                      baseFrequency={selectedInterval.hertz as number}
                      ratio="1:1"
                      intervalName={selectedInterval.name}
                      color={selectedInterval.color}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 flex justify-between">
                <button 
                  onClick={() => setSelectedInterval(null)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Close
                </button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Harmonic Sequence & Sacred Geometry</CardTitle>
                <CardDescription>
                  Select a point on the map to explore its harmonic properties
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium mb-2 text-purple-800">Tesla's 3-6-9 Principle</h3>
                  <p className="text-sm">
                    "If you only knew the magnificence of the 3, 6 and 9, then you would have a key to the universe."
                    - Nikola Tesla
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {teslaThreeSixNine.principles.map(principle => (
                      <div key={principle.number} className="bg-white p-2 rounded border border-purple-100">
                        <div className="text-xl font-bold text-amber-500">{principle.number}</div>
                        <div className="text-xs font-medium">{principle.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Harmonic Categories</h3>
                  {harmonicSequenceCategories.map(category => (
                    <div key={category.id} className="mb-2">
                      <h4 className="text-sm font-medium">{category.name}</h4>
                      <p className="text-xs text-gray-600">{category.description}</p>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">How to Use This Map</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Click on any point to view detailed information</li>
                    <li>Explore the relationship between frequencies and Hermetic principles</li>
                    <li>Notice how Tesla's 3-6-9 principle is highlighted in gold</li>
                    <li>Understand how harmonic intervals relate to healing properties</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HarmonicMapViewer;
