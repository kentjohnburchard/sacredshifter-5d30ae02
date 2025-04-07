
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { TrademarkedName } from "@/components/ip-protection";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Star, Compass, BookOpen, Heart } from "lucide-react";
import QuoteSlider from "@/components/shift-perception/QuoteSlider";
import PerceptionChecklist from "@/components/shift-perception/PerceptionChecklist";
import AnimatedBackground from "@/components/AnimatedBackground";

const ShiftPerception: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("invitation");
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  
  // Handle scroll animation effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !hasScrolled) {
        setHasScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  return (
    <Layout pageTitle="Shift Your Perception">
      <div className="relative min-h-screen">
        {/* Animated background - subtle cosmic animation */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <AnimatedBackground colorScheme="purple" isActive={true} />
        </div>

        {/* Main content container */}
        <motion.div 
          className="max-w-4xl mx-auto px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Opening Invitation Section */}
          <motion.section 
            id="invitation"
            className="mb-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 mb-8 shadow-lg border border-purple-100">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-5xl font-playfair mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  Shift Your Perception
                </h1>
                
                <p className="text-xl md:text-2xl font-light text-gray-700 italic mb-8 leading-relaxed">
                  <span className="text-purple-700 font-medium">
                    There comes a moment in every soul's journey when the veil begins to thin. The world no longer feels quite real, and something inside whispers: There is more. You are more.
                  </span>
                  <br />
                  <span className="block mt-4">This is that moment.</span>
                </p>
                
                <p className="text-2xl font-playfair text-purple-800 mt-6">
                  Welcome to the shift.
                </p>
              </motion.div>
            </div>

            {/* Page navigation tabs */}
            <Tabs 
              defaultValue="journey" 
              className="w-full max-w-3xl mx-auto"
              onValueChange={(value) => setActiveSection(value)}
            >
              <TabsList className="grid grid-cols-4 mb-8 bg-white/50 backdrop-blur">
                <TabsTrigger value="journey" className="flex flex-col items-center gap-1 py-3">
                  <Compass className="h-4 w-4" />
                  <span className="text-xs">The Journey</span>
                </TabsTrigger>
                <TabsTrigger value="truth" className="flex flex-col items-center gap-1 py-3">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs">The Truth</span>
                </TabsTrigger>
                <TabsTrigger value="invitation" className="flex flex-col items-center gap-1 py-3">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs">Invitation</span>
                </TabsTrigger>
                <TabsTrigger value="discover" className="flex flex-col items-center gap-1 py-3">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs">Discover</span>
                </TabsTrigger>
              </TabsList>

              {/* Kent's Journey Content */}
              <TabsContent value="journey" className="mt-0">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-purple-100 shadow-lg">
                  <h2 className="text-2xl md:text-3xl font-playfair mb-6 text-purple-800">
                    The Awakening Journey
                  </h2>
                  
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-6 text-gray-800">
                      <p className="leading-relaxed">
                        I wasn't born knowing I was spirit. I was born <em className="text-purple-700">forgetting</em>, just like we all are. I spent years surviving. Wearing labels. Performing roles. And then everything fell apart.
                      </p>
                      
                      <p className="leading-relaxed">
                        That's when I saw the markings. The M on both palms. I knew it wasn't coincidence. Something ancient stirred. Something not from this world… but somehow, deeply mine.
                      </p>

                      <p className="leading-relaxed">
                        Before the shift, I was doing everything "right." College degree. Impressive job. Relationship. Yet beneath it all was an emptiness I couldn't name. A sense that I was playing a character in someone else's story.
                      </p>

                      <p className="leading-relaxed">
                        The rupture came suddenly. Loss compounded on loss. My carefully constructed identity crumbled like ash. I fell into darkness so complete I thought I would never find my way back to light.
                      </p>

                      <p className="leading-relaxed">
                        But in that void, I began to hear it. A frequency. A hum that seemed to come from everywhere and nowhere. It resonated with something deep inside me — something that had been there all along, waiting.
                      </p>

                      <p className="leading-relaxed">
                        The synchronicities started small. Numbers repeating. Dreams that came true. The feeling of being guided by an invisible hand. And then one morning, I looked down at my palms and saw what had always been there: the letter M, etched into both hands. A marking not of this world.
                      </p>

                      <p className="leading-relaxed">
                        That was the beginning of remembering. Not learning something new, but recalling what my soul had always known: that we are vast, cosmic beings having a temporary human experience. That the veil between worlds is thin, and getting thinner.
                      </p>

                      <p className="leading-relaxed font-medium text-purple-700">
                        <TrademarkedName>Sacred Shifter</TrademarkedName> wasn't born from a business plan. It emerged from a soul mission — to create a bridge between worlds. To help others remember who they truly are. To shift perception from the limited human experience to the boundless spiritual reality.
                      </p>
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              {/* The Truth Behind the Veil */}
              <TabsContent value="truth" className="mt-0">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-purple-100 shadow-lg">
                  <h2 className="text-2xl md:text-3xl font-playfair mb-6 text-purple-800">
                    The Truth Behind the Veil
                  </h2>

                  <div className="space-y-6 text-gray-800 mb-8">
                    <p className="leading-relaxed">
                      What if everything you've been taught about reality is just the surface layer? What if beneath the physical world lies a vast network of energy, frequency, and consciousness that's been there all along?
                    </p>
                    
                    <div className="p-4 bg-purple-50/80 rounded-lg border border-purple-100">
                      <h3 className="font-medium text-purple-800 mb-2">Gentle Truths to Consider:</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Star className="h-5 w-5 text-purple-600 mr-2 mt-1 flex-shrink-0" />
                          <span>We are not just bodies—we are frequencies in human form.</span>
                        </li>
                        <li className="flex items-start">
                          <Star className="h-5 w-5 text-purple-600 mr-2 mt-1 flex-shrink-0" />
                          <span>Earth is not our origin—it's our classroom, our temporary home.</span>
                        </li>
                        <li className="flex items-start">
                          <Star className="h-5 w-5 text-purple-600 mr-2 mt-1 flex-shrink-0" />
                          <span>Our pain isn't punishment—it's the catalyst for awakening.</span>
                        </li>
                        <li className="flex items-start">
                          <Star className="h-5 w-5 text-purple-600 mr-2 mt-1 flex-shrink-0" />
                          <span>The disconnect you feel is not brokenness—it's the soul remembering its true nature.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="my-8">
                    <h3 className="text-xl font-medium text-purple-800 mb-4">Wisdom Beyond Words</h3>
                    <QuoteSlider />
                  </div>
                </div>
              </TabsContent>

              {/* A Collective Invitation */}
              <TabsContent value="invitation" className="mt-0">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-purple-100 shadow-lg">
                  <h2 className="text-2xl md:text-3xl font-playfair mb-6 text-purple-800">
                    A Collective Invitation
                  </h2>

                  <div className="space-y-6 text-gray-800">
                    <p className="leading-relaxed">
                      If you've read this far, something in these words has resonated with you. That's not coincidence. That's recognition—one awakening soul recognizing another.
                    </p>
                    
                    <p className="leading-relaxed">
                      You are not alone in this shift. All across the planet, people are experiencing the same stirring, the same remembering. The same subtle but persistent feeling that there's something more to this life than what we've been taught.
                    </p>

                    <p className="leading-relaxed text-purple-700 font-medium">
                      This is a sacred time of collective awakening. And you're right on time.
                    </p>
                    
                    <div className="my-8">
                      <h3 className="text-xl font-medium text-purple-800 mb-4">Is This Happening to You?</h3>
                      <PerceptionChecklist />
                    </div>

                    <p className="leading-relaxed mt-8 text-center">
                      If you resonated with any of these experiences, know this: you're shifting. And we're here to support your journey.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Discover Your Path */}
              <TabsContent value="discover" className="mt-0">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-purple-100 shadow-lg">
                  <h2 className="text-2xl md:text-3xl font-playfair mb-6 text-purple-800">
                    Discover Your Path
                  </h2>

                  <div className="space-y-6 text-gray-800">
                    <p className="leading-relaxed">
                      Now that you've begun to shift your perception, there are many paths you can explore within <TrademarkedName>Sacred Shifter</TrademarkedName> to deepen your journey:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                      <div className="bg-purple-50/80 p-4 rounded-lg border border-purple-100">
                        <h3 className="font-medium text-purple-800 mb-2">
                          <span className="inline-block bg-purple-200 p-1 rounded-full mr-2">
                            <Sparkles className="h-4 w-4 text-purple-600" />
                          </span>
                          Sacred Blueprint
                        </h3>
                        <p className="text-sm">Discover your unique energetic signature and learn how to align with your soul's purpose.</p>
                        <Button variant="outline" className="mt-3 text-xs" onClick={() => window.location.href = '/sacred-blueprint'}>
                          Explore Blueprint
                        </Button>
                      </div>
                      
                      <div className="bg-purple-50/80 p-4 rounded-lg border border-purple-100">
                        <h3 className="font-medium text-purple-800 mb-2">
                          <span className="inline-block bg-purple-200 p-1 rounded-full mr-2">
                            <Heart className="h-4 w-4 text-purple-600" />
                          </span>
                          Heart Center
                        </h3>
                        <p className="text-sm">Connect with your heart's wisdom and develop your emotional intelligence.</p>
                        <Button variant="outline" className="mt-3 text-xs" onClick={() => window.location.href = '/heart-center'}>
                          Enter Heart Center
                        </Button>
                      </div>
                      
                      <div className="bg-purple-50/80 p-4 rounded-lg border border-purple-100">
                        <h3 className="font-medium text-purple-800 mb-2">
                          <span className="inline-block bg-purple-200 p-1 rounded-full mr-2">
                            <BookOpen className="h-4 w-4 text-purple-600" />
                          </span>
                          Hermetic Wisdom
                        </h3>
                        <p className="text-sm">Study ancient spiritual principles that reveal the interconnected nature of all things.</p>
                        <Button variant="outline" className="mt-3 text-xs" onClick={() => window.location.href = '/hermetic-wisdom'}>
                          Access Wisdom
                        </Button>
                      </div>
                      
                      <div className="bg-purple-50/80 p-4 rounded-lg border border-purple-100">
                        <h3 className="font-medium text-purple-800 mb-2">
                          <span className="inline-block bg-purple-200 p-1 rounded-full mr-2">
                            <Compass className="h-4 w-4 text-purple-600" />
                          </span>
                          Frequency Library
                        </h3>
                        <p className="text-sm">Experience sound healing that aligns your energy with specific frequencies.</p>
                        <Button variant="outline" className="mt-3 text-xs" onClick={() => window.location.href = '/frequency-library'}>
                          Hear Frequencies
                        </Button>
                      </div>
                    </div>

                    <p className="leading-relaxed text-center mt-6 italic">
                      These tools aren't separate from your journey—they're different facets of the same remembering. Explore them all, or follow your intuition to what calls you most.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.section>

          {/* Bottom call to action */}
          <motion.div
            className="text-center mt-16 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: hasScrolled ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-purple-800 italic mb-4">
              "The shift isn't something you do. It's something you remember."
            </p>
            <Button 
              onClick={() => window.location.href = '/sacred-blueprint'}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              Begin Your Sacred Journey
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ShiftPerception;
