
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Music2, CheckSquare, Heart, Zap, Book, Stars, Library, Clock, HeartPulse } from "lucide-react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  
  // Mark that the user has seen the intro
  useEffect(() => {
    localStorage.setItem('hasSeenIntro', 'true');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 pt-36"> {/* Increased padding to prevent content from being hidden under header */}
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6">
          <div className="text-center space-y-2 mb-4 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight">
              <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500">
                Sacred Sound Healing
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-light text-base">
              Experience the ancient healing power of sacred frequencies. These sound vibrations have been used for millennia to restore harmony and balance.
            </p>
          </div>
          
          {/* Content in horizontal layout */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Introduction Card */}
            <Card className="border border-gray-200 shadow-sm overflow-hidden h-full">
              <CardContent className="p-4">
                <h3 className="text-xl font-light mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  The Sacred Science of Sound
                </h3>
                <p className="mb-2 text-gray-700 text-sm">
                  Sound healing is one of the oldest and most natural forms of healing known to man. The Egyptians used vowel sound chants in healing because they believed vowels were sacred. Tibetan monks use singing bowls, which the body's chakra system responds to.
                </p>
                <p className="text-gray-700 text-sm">
                  Experience the power of sound healing in our application, where you can listen to sacred frequencies.
                </p>
              </CardContent>
            </Card>
            
            {/* Understanding Sound Healing Card */}
            <Card className="border border-gray-200 shadow-sm overflow-hidden h-full">
              <CardContent className="p-4">
                <h3 className="text-xl font-light mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  Understanding Sound Healing
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Solfeggio Frequencies</h4>
                    <p className="text-xs text-gray-700">
                      Ancient sacred tones used in Gregorian chants, each balancing energy and healing in various ways.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Sound and Chakras</h4>
                    <p className="text-xs text-gray-700">
                      Each chakra vibrates at its own frequency. Specific frequencies restore harmony to blocked energy centers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Begin Your Journey Button Section */}
          <div className="mb-12">
            <div className="flex justify-center mb-8">
              <Button 
                size="default" 
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg shadow-md transform transition-all duration-300 hover:scale-105"
                onClick={() => navigate("/energy-check")}
              >
                <HeartPulse className="mr-2 h-4 w-4" />
                Begin Your Healing Journey
              </Button>
            </div>
          </div>
          
          {/* All App Pages Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-light text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Explore Our Sacred Healing Features
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Journey Templates */}
              <Card className="border border-purple-100 hover:border-purple-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-purple-700 flex items-center">
                    <Library className="mr-2 h-4 w-4" />
                    Healing Journeys
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Explore curated sound experiences designed for specific healing purposes like sleep, focus, and anxiety release.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/journey-templates">Explore Healing Journeys</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Energy Check */}
              <Card className="border border-blue-100 hover:border-blue-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-blue-700 flex items-center">
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Energy Check
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Assess your current energy state, set intentions, and discover frequencies that align with your needs.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/energy-check">Try Energy Check</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Alignment */}
              <Card className="border border-indigo-100 hover:border-indigo-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-indigo-700 flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    Chakra Alignment
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Balance your energy centers with precision frequency healing designed for each chakra.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/alignment">Align Your Chakras</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Intentions */}
              <Card className="border border-teal-100 hover:border-teal-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-teal-700 flex items-center">
                    <Zap className="mr-2 h-4 w-4" />
                    Intentions
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Set powerful intentions that resonate with your highest vibration and manifest your desired reality.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/intentions">Set Your Intentions</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Meditation */}
              <Card className="border border-cyan-100 hover:border-cyan-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-cyan-700 flex items-center">
                    <Music2 className="mr-2 h-4 w-4" />
                    Meditation
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Find peace and elevate your consciousness through guided meditations enhanced with sacred frequencies.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/meditation">Start Meditating</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Focus */}
              <Card className="border border-green-100 hover:border-green-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-green-700 flex items-center">
                    <Book className="mr-2 h-4 w-4" />
                    Focus
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Enhance concentration and mental clarity with sound frequencies designed to optimize brain function.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/focus">Improve Focus</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Astrology */}
              <Card className="border border-violet-100 hover:border-violet-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-violet-700 flex items-center">
                    <Stars className="mr-2 h-4 w-4" />
                    Astrology
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Explore cosmic connections and how celestial energies influence your personal frequency.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/astrology">Discover Astrology</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Soundscapes */}
              <Card className="border border-amber-100 hover:border-amber-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-amber-700 flex items-center">
                    <Library className="mr-2 h-4 w-4" />
                    Soundscapes
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Immerse yourself in ambient sound environments designed to enhance your focus, creativity, and spiritual connection.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/soundscapes">Explore Soundscapes</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Timeline */}
              <Card className="border border-rose-100 hover:border-rose-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-rose-700 flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Timeline
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Revisit your frequency journey and reconnect with moments that resonated with your energy.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/timeline">View Your Timeline</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Hermetic Principles Section */}
          <Card className="border border-gray-200 shadow-sm mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
                The Seven Hermetic Principles
              </h3>
              <p className="text-gray-600 mb-6 text-center">
                Ancient wisdom that guides our understanding of energy, consciousness, and the universe.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-700">1. Principle of Mentalism</h4>
                  <p className="text-sm text-gray-600">"THE ALL is Mind; The Universe is Mental." All existence originates in the mind of THE ALL.</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-700">2. Principle of Correspondence</h4>
                  <p className="text-sm text-gray-600">"As above, so below; as below, so above." What happens on one level of reality also happens on other levels.</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-indigo-700">3. Principle of Vibration</h4>
                  <p className="text-sm text-gray-600">"Nothing rests; everything moves; everything vibrates." All matter, energy, and thought are vibrations.</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-violet-700">4. Principle of Polarity</h4>
                  <p className="text-sm text-gray-600">"Everything is dual; everything has poles; everything has its pair of opposites." Opposites are identical in nature but different in degree.</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-pink-700">5. Principle of Rhythm</h4>
                  <p className="text-sm text-gray-600">"Everything flows, out and in; everything has its tides." All things rise and fall in a measured motion.</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-rose-700">6. Principle of Cause and Effect</h4>
                  <p className="text-sm text-gray-600">"Every Cause has its Effect; every Effect has its Cause." Nothing happens by chance; there is a causal relationship to all things.</p>
                </div>
                
                <div className="col-span-1 md:col-span-2 lg:col-span-1 space-y-2">
                  <h4 className="font-medium text-amber-700">7. Principle of Gender</h4>
                  <p className="text-sm text-gray-600">"Gender is in everything; everything has its Masculine and Feminine Principles." Gender manifests on all planes as creative energy.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Expanded Sound Healing Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Solfeggio Frequencies */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">
                  Solfeggio Frequencies
                </h3>
                <p className="text-gray-600 mb-4">
                  The Solfeggio frequencies are a set of sacred tones that were believed to be used in ancient Gregorian chants. Each frequency has a specific purpose for healing and spiritual growth.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-amber-700">396 Hz - Liberation from Fear</h4>
                    <p className="text-sm text-gray-600">Liberates you from fear and guilt, clearing negative beliefs.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-700">417 Hz - Facilitating Change</h4>
                    <p className="text-sm text-gray-600">Helps release negative energy and facilitates positive change.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700">528 Hz - Transformation and Miracles</h4>
                    <p className="text-sm text-gray-600">Known as the "Love Frequency," it repairs DNA and brings transformative changes.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-700">639 Hz - Connection and Relationships</h4>
                    <p className="text-sm text-gray-600">Enhances communication and understanding in relationships.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700">741 Hz - Awakening Intuition</h4>
                    <p className="text-sm text-gray-600">Awakens intuition and helps with problem-solving.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-indigo-700">852 Hz - Returning to Spiritual Order</h4>
                    <p className="text-sm text-gray-600">Helps return to spiritual balance and higher consciousness.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
              
            {/* Sound and Chakras */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  Sound and Chakras
                </h3>
                <p className="text-gray-600 mb-4">
                  Each of your body's energy centers (chakras) resonates with specific frequencies. When these energy centers are balanced, you experience optimal health and well-being.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-red-700">Root Chakra - 396 Hz</h4>
                    <p className="text-sm text-gray-600">Located at the base of the spine, relates to feelings of safety and grounding.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-700">Sacral Chakra - 417 Hz</h4>
                    <p className="text-sm text-gray-600">Located in the lower abdomen, relates to creativity and sexual energy.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-700">Solar Plexus Chakra - 528 Hz</h4>
                    <p className="text-sm text-gray-600">Located in the upper abdomen, relates to self-esteem and confidence.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-700">Heart Chakra - 639 Hz</h4>
                    <p className="text-sm text-gray-600">Located at the center of the chest, relates to love and compassion.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700">Throat Chakra - 741 Hz</h4>
                    <p className="text-sm text-gray-600">Located in the throat, relates to communication and self-expression.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-indigo-700">Third Eye Chakra - 852 Hz</h4>
                    <p className="text-sm text-gray-600">Located between the eyes, relates to intuition and wisdom.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-violet-700">Crown Chakra - 963 Hz</h4>
                    <p className="text-sm text-gray-600">Located at the top of the head, relates to spiritual connection and enlightenment.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="w-full py-3 text-center text-xs text-gray-500">
        <p>Sacred Shifter - Heal with the power of sound. Journey through sacred frequencies.</p>
      </footer>
    </div>
  );
};

export default Index;
