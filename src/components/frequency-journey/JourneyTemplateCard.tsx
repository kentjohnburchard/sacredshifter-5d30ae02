
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Music } from "lucide-react";
import { Link } from "react-router-dom";
import { JourneyTemplate } from "@/data/journeyTemplates";
import { motion } from "framer-motion";

interface JourneyTemplateCardProps {
  template: JourneyTemplate;
  audioMapping?: {
    audioUrl: string;
    audioFileName: string;
  };
}

const JourneyTemplateCard: React.FC<JourneyTemplateCardProps> = ({ template, audioMapping }) => {
  // Extract the first frequency value to use in the link if needed
  const firstFrequencyValue = template.frequencies[0]?.value.split(' ')[0] || '';
  
  // Now we can use audioMapping to direct to the correct audio
  const journeyLink = audioMapping
    ? `/journey/${encodeURIComponent(audioMapping.audioUrl)}`
    : `/journey/${firstFrequencyValue}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <Card 
        className="cosmic-card"
        style={{ borderTopColor: template.color || '#6b46c1' }}
      >
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white relative overflow-hidden">
          {/* Subtle cosmic shimmer overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0ic3RhciIgY3g9IjUwJSIgY3k9IjUwJSIgcj0iNTAlIiBmeD0iNTAlIiBmeT0iNTAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwLjMiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IndoaXRlIiBzdG9wLW9wYWNpdHk9IjAiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3N0YXIpIi8+PC9zdmc+')]
                opacity-30 mix-blend-overlay"></div>
          
          <CardTitle className="flex justify-between items-center relative z-10">
            <div>
              <motion.h3 
                className="text-xl font-playfair" 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {template.emoji && `${template.emoji} `}{template.title}
              </motion.h3>
              <p className="text-sm font-light mt-1 font-modern">{template.subtitle}</p>
            </div>
            <div className="flex gap-1">
              {template.chakras?.map((chakra) => (
                <motion.div
                  key={chakra}
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Badge variant="outline" className="border-white/40 text-white shimmer-hover">
                    {chakra}
                  </Badge>
                </motion.div>
              ))}
              {template.vibe && (
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Badge variant="outline" className="border-white/40 text-white shimmer-hover">
                    {template.vibe}
                  </Badge>
                </motion.div>
              )}
              {audioMapping && (
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Badge variant="outline" className="border-white/40 text-white shimmer-hover flex items-center gap-1">
                    <Music className="h-3 w-3" />
                    <span className="sr-only">Has Audio</span>
                  </Badge>
                </motion.div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-purple-700 font-playfair mb-1">Purpose</h4>
            <p className="text-sm text-gray-600 font-modern">
              {template.purpose}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-purple-700 font-playfair mb-1">Frequencies</h4>
            <ul className="space-y-1 text-sm text-gray-600 font-modern">
              {template.frequencies.map((freq, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start gap-2 shimmer-hover p-1 rounded-md"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="text-purple-500 font-medium">{freq.name} ({freq.value}):</span> 
                  <span>{freq.description}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          
          <motion.div 
            className="p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-purple-100 relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            {/* Subtle shimmer effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-purple-100/20 via-transparent to-purple-100/20 bg-[length:200%_100%]"
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
            
            <p className="text-sm italic text-gray-600 relative font-lora">
              <span className="text-3xl text-purple-300 absolute -top-3 -left-2">"</span>
              {template.valeQuote?.replace("Vale", "Kent")}
              <span className="text-3xl text-purple-300 absolute -bottom-5 -right-2">"</span>
            </p>
            <p className="text-xs text-right mt-2 text-purple-600 font-medium">— Kent</p>
          </motion.div>
          
          <div className="pt-4 flex justify-between items-center">
            {audioMapping && (
              <div className="text-xs text-purple-500 flex items-center">
                <Music className="h-3 w-3 mr-1" />
                <span className="truncate max-w-[150px]" title={audioMapping.audioFileName}>
                  {audioMapping.audioFileName.split('/').pop()}
                </span>
              </div>
            )}
            <Button 
              asChild
              className="cosmic-button ml-auto"
            >
              <Link to={journeyLink}>
                Begin Journey <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JourneyTemplateCard;
