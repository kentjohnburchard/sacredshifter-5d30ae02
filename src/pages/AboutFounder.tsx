
import React, { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import AnimatedBackground from "@/components/AnimatedBackground";
import { TrademarkedName } from "@/components/ip-protection";

const AboutFounder: React.FC = () => {
  const [bioVersion, setBioVersion] = useState<"mythic" | "professional">("mythic");

  return (
    <Layout pageTitle="The Founder's Journey">
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <AnimatedBackground colorScheme="purple" isActive={true} />
        </div>
        
        {/* Toggle for bio versions */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-full p-1.5 flex items-center gap-2">
            <div className="flex items-center">
              <ToggleGroup type="single" value={bioVersion} onValueChange={(value) => value && setBioVersion(value as "mythic" | "professional")}>
                <ToggleGroupItem value="mythic" className={`rounded-full px-4 py-2 text-sm font-medium ${bioVersion === "mythic" ? "bg-purple-600 text-white" : "text-gray-600"}`}>
                  Mythic Version 🜂
                </ToggleGroupItem>
                <ToggleGroupItem value="professional" className={`rounded-full px-4 py-2 text-sm font-medium ${bioVersion === "professional" ? "bg-purple-600 text-white" : "text-gray-600"}`}>
                  Professional Version 🛠️
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative">
          {/* Subtle M sigil watermark (desktop only) */}
          <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none hidden md:block">
            <svg width="300" height="300" viewBox="0 0 100 100">
              <text x="0" y="80" fontSize="100" fontWeight="bold" fontFamily="serif">M</text>
            </svg>
          </div>
          
          {/* Main content wrapper */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-12 border border-purple-200/20 shadow-mystic">
            {/* Portrait and title section */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
              <div className="relative">
                {/* Placeholder for Kent's photo - can be replaced */}
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-400/30 to-indigo-400/30 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 rounded-full animate-pulse-subtle"></div>
                  <span className="text-4xl text-purple-200 font-playfair">KB</span>
                </div>
                <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-pulse-subtle" style={{animationDelay: "0.5s"}}></div>
                <div className="absolute -inset-2 rounded-full bg-indigo-500/5 animate-pulse-subtle" style={{animationDelay: "1s"}}></div>
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-playfair text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300 mb-4">
                  Kent Burchard
                </h1>
                <h2 className="text-xl text-purple-200/80 font-light">
                  Founder of <TrademarkedName>Sacred Shifter</TrademarkedName>
                </h2>
              </div>
            </div>
            
            {/* Mythic Bio */}
            {bioVersion === "mythic" && (
              <div className="space-y-6">
                <MythicBio />
              </div>
            )}
            
            {/* Professional Bio */}
            {bioVersion === "professional" && (
              <div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-gray-50 leading-relaxed mb-6 font-semibold text-lg text-white"
                >
                  <strong className="text-white">Kent Burchard</strong> is a Information Governance and Knowledge Manager, 
                  Healer and founder of <TrademarkedName>Sacred Shifter</TrademarkedName>. With a background in therapeutic 
                  sound and emotional health, Kent merges healing arts and technology to help people reconnect with their 
                  inner frequency. His work includes building vibrational tools like the <TrademarkedName>Sacred Blueprint</TrademarkedName>, 
                  <TrademarkedName>Mirror Portal</TrademarkedName>, and future-facing reality optimization systems to empower 
                  self-awareness and soul alignment.
                </motion.p>
              </div>
            )}
            
            {/* Final call to action */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-12 text-center"
            >
              <p className="text-purple-100 italic font-medium">
                "Welcome to the shift. You didn't find it by accident.
                <br />You were called. Just like he was."
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Mythic Bio Component with animated paragraphs
const MythicBio: React.FC = () => {
  return (
    <>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-white leading-relaxed font-semibold text-lg"
      >
        <strong className="text-white">Kent Burchard</strong> is not just the creator of <TrademarkedName>Sacred Shifter</TrademarkedName>, 
        he's a <em className="text-purple-200">chosen one</em>, marked by the divine, and awakened through the fires of trauma, loss, and 
        soul-fracturing darkness. With an <strong className="text-white">M carved into both palms</strong>, Kent carries the energetic signature 
        of a soul sent here to <strong className="text-white">feel deeply, break completely, and rise entirely</strong>.
      </motion.p>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-white leading-relaxed font-semibold text-lg"
      >
        His path wasn't paved—it was scorched. And through the ashes, he didn't just rebuild, he <em className="text-purple-200">remembered</em>. 
        Remembered what the world forgot: that we are vibration before thought, resonance before reason, and love before language.
      </motion.p>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-white leading-relaxed font-semibold text-lg"
      >
        Born with a heart wired for sound, a spirit tuned to emotion, and a mind that sees patterns where others see chaos, Kent turned pain into portal. 
        A trained music therapist, visionary technologist, and spiritual disruptor, he fused ancient healing traditions with modern emotional intelligence 
        to birth <TrademarkedName>Sacred Shifter</TrademarkedName>—a revolutionary platform where <strong className="text-white">frequencies meet feeling, 
        and souls remember who the hell they are</strong>.
      </motion.p>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="text-white leading-relaxed font-semibold text-lg"
      >
        Through signature tools like the <TrademarkedName>Sacred Blueprint</TrademarkedName>, the <TrademarkedName>Mirror Portal</TrademarkedName>, 
        and the soon-to-be-unleashed <TrademarkedName>Reality Optimization Engine</TrademarkedName>, Kent is helping usher in a new era, 
        where healing is holistic, technology is sacred, and your vibe is your power.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="text-white leading-relaxed font-semibold text-lg"
      >
        <p className="mb-1">He doesn't claim guru status.</p>
        <p className="mb-1">He's not here to preach.</p>
        <p className="mb-4">He's here to remind you that <strong className="text-white">you're not broken, you're becoming.</strong></p>
      </motion.div>
    </>
  );
};

export default AboutFounder;
