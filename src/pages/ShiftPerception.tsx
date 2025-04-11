import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { TrademarkedName } from "@/components/ip-protection";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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
          <AnimatedBackground colorScheme="purple" isActive={true}>
            <div></div>
          </AnimatedBackground>
        </div>

        {/* "Free access" badge */}
        <Badge variant="outline" className="absolute top-4 right-4 z-10 bg-green-100 text-green-800 border-green-200 font-medium">
          <Star className="w-3 h-3 mr-1 text-green-600" /> Free Access
        </Badge>

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
                        I wasn't born knowing I was more than human. Like most of us, I came into this world forgetting. I did what I thought you were supposed to do, follow the rules, tick the boxes, build a life that looked good from the outside.
                      </p>
                      
                      <p className="leading-relaxed">
                        And for a while, I did exactly that. I had a great job. I was doing everything "right." I told myself I was happy. But underneath it all, something didn't sit right. It felt like I was playing a role in a story that wasn't mine. Like I was showing up for a life I hadn't actually chosen.
                      </p>

                      <p className="leading-relaxed">
                        Then came the unraveling.
                        One loss after another, until the version of myself I'd built just... collapsed. All the titles, the routines, the "shoulds"—gone. What was left was silence, confusion, and the kind of darkness that strips you down to your core.
                      </p>

                      <p className="leading-relaxed">
                        And it was in that silence that something started to shift.
                      </p>

                      <p className="leading-relaxed">
                        I began noticing patterns.
                        Repeating numbers. Déjà vu. A strange sense that I was being nudged, gently, consistently by something I couldn't see. It felt like there was more going on than what I'd been taught to believe.
                      </p>

                      <p className="leading-relaxed">
                        Then one morning, I was watching random clips on YouTube, and someone started talking about Dolores Cannon. They mentioned something she said about "Chosen Ones" and a mark, an M, that sometimes shows up on the palms of people with a soul mission. They said it was rare. A sign. A soul contract.
                      </p>

                      <p className="leading-relaxed">
                        I looked down at my hands. I had that M. On both palms. It had always been there, I just never thought anything of it. I assumed everyone had it.
                      </p>

                      <p className="leading-relaxed">
                        But in that moment, something clicked. Not in a loud, dramatic way, just this quiet inner resonance, like: Oh... this means something.
                      </p>

                      <p className="leading-relaxed">
                        That was the start of remembering.
                      </p>

                      <p className="leading-relaxed">
                        Not discovering something new.
                        Just finally recognising what had always been there under the noise:
                        That I'm not just a guy trying to be spiritual.
                        I'm a soul who temporarily forgot who I really was.
                        And I know now, I'm here for something bigger.
                      </p>

                      <p className="leading-relaxed font-medium text-purple-700">
                        <TrademarkedName>Sacred Shifter</TrademarkedName> didn't come from a business idea. It came from that shift. From wanting to help others find what I found:
                        That there's more to this world than we've been told.
                        That we're not just here to survive.
                        We're here to remember.
                        And when we do, that's when everything changes.
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
                        <div className="flex items-center mt-3">
                          <Badge className="bg-purple-200 text-purple-800 mr-2">Premium</Badge>
                          <Button variant="outline" className="text-xs" onClick={() => window.location.href = '/subscription'}>
                            View Subscription
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50/80 p-4 rounded-lg border border-purple-100">
                        <h3 className="font-medium text-purple-800 mb-2">
                          <span className="inline-block bg-purple-200 p-1 rounded-full mr-2">
                            <Heart className="h-4 w-4 text-purple-600" />
                          </span>
                          Heart Center
                        </h3>
                        <p className="text-sm">Connect with your heart's wisdom and develop your emotional intelligence.</p>
                        <div className="flex items-center mt-3">
                          <Badge className="bg-green-100 text-green-800 mr-2">Free</Badge>
                          <Button variant="outline" className="text-xs" onClick={() => window.location.href = '/heart-center'}>
                            Enter Heart Center
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50/80 p-4 rounded-lg border border-purple-100">
                        <h3 className="font-medium text-purple-800 mb-2">
                          <span className="inline-block bg-purple-200 p-1 rounded-full mr-2">
                            <BookOpen className="h-4 w-4 text-purple-600" />
                          </span>
                          Hermetic Wisdom
                        </h3>
                        <p className="text-sm">Study ancient spiritual principles that reveal the interconnected nature of all things.</p>
                        <div className="flex items-center mt-3">
                          <Badge className="bg-purple-200 text-purple-800 mr-2">Premium</Badge>
                          <Button variant="outline" className="text-xs" onClick={() => window.location.href = '/subscription'}>
                            View Subscription
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50/80 p-4 rounded-lg border border-purple-100">
                        <h3 className="font-medium text-purple-800 mb-2">
                          <span className="inline-block bg-purple-200 p-1 rounded-full mr-2">
                            <Compass className="h-4 w-4 text-purple-600" />
                          </span>
                          Frequency Library
                        </h3>
                        <p className="text-sm">Experience sound healing that aligns your energy with specific frequencies.</p>
                        <div className="flex items-center mt-3">
                          <Badge className="bg-purple-200 text-purple-800 mr-2">Premium</Badge>
                          <Button variant="outline" className="text-xs" onClick={() => window.location.href = '/subscription'}>
                            View Subscription
                          </Button>
                        </div>
                      </div>
                    </div>

                    <p className="leading-relaxed text-center mt-6 italic">
                      These tools aren't separate from your journey—they're different facets of the same remembering. Explore what's available or subscribe to access all features.
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
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button 
                onClick={() => window.location.href = '/heart-center'}
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Heart className="mr-2 h-4 w-4" /> Explore Free Features
              </Button>
              <Button 
                onClick={() => window.location.href = '/subscription'}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              >
                <Sparkles className="mr-2 h-4 w-4" /> Unlock Premium Access
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ShiftPerception;
