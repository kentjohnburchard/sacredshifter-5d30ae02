
import React from "react";
import Layout from "@/components/Layout";
import { UserCircle, Heart, Star, Sparkles } from "lucide-react";

const AboutFounder = () => {
  return (
    <Layout pageTitle="About the Founder">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 dark:bg-gray-800/90 shadow-lg rounded-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-300 to-indigo-500 flex items-center justify-center">
                <UserCircle className="w-32 h-32 text-white" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  Meet Our Founder
                </h1>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  The Sacred Shifter platform was founded with a vision to help people elevate their consciousness through 
                  the powerful combination of sacred sound frequencies and intentional practices.
                </p>
                
                <p className="text-gray-600 dark:text-gray-300">
                  With over a decade of experience in sound healing, meditation, and consciousness research, 
                  our founder created this space as a sanctuary for those seeking to shift their perception 
                  and align with their highest potential.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 dark:bg-gray-800/90 shadow-lg rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-700 dark:text-purple-400">
              The Journey to Sacred Shifter
            </h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="mt-1">
                  <Heart className="h-8 w-8 text-pink-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Personal Awakening</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    After experiencing the profound effects of specific sound frequencies on personal healing, 
                    our founder committed to creating a platform that would make these powerful tools accessible to everyone.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="mt-1">
                  <Star className="h-8 w-8 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Research & Development</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Years were spent researching ancient wisdom traditions, modern sound healing techniques, and 
                    the intersection of consciousness and quantum physics to develop our unique approach.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="mt-1">
                  <Sparkles className="h-8 w-8 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Vision & Mission</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Sacred Shifter was born from a vision of a world where more people have access to tools that elevate consciousness, 
                    foster connection with higher self, and create ripples of positive change throughout humanity.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-600 dark:text-gray-300 italic">
                "My deepest wish is for each person who uses Sacred Shifter to discover their own innate capacity for 
                transformation and to remember the magnificent beings they truly are."
              </p>
              <p className="mt-4 font-medium text-purple-700 dark:text-purple-400">— Founder, Sacred Shifter</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutFounder;
