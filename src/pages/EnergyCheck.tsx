
import React, { useState } from "react";
import Header from "@/components/Header";
import { EnergyCheckTabs } from "@/components/energy-check";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const EnergyCheck = () => {
  const [activeTab, setActiveTab] = useState("frequency");
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f8f4ff] to-white">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-8">
        <div className="text-center space-y-3 mb-8 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-lavender to-brand-amythyst">
              Energy Check-In
            </span>
          </h2>
          <p className="text-[#7510c9]/70 max-w-2xl mx-auto text-lg">
            Align your energy and set sacred intentions for your journey.
          </p>
          
          <div className="flex justify-center mt-4">
            <Link to="/hermetic-wisdom">
              <Button variant="outline" className="gap-2 text-purple-600 border-purple-200 hover:bg-purple-50">
                <BookOpen className="h-4 w-4" />
                <span>Explore Hermetic Wisdom Hub</span>
              </Button>
            </Link>
          </div>
        </div>
        
        <EnergyCheckTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
      
      <footer className="w-full py-6 text-center text-sm text-[#800080]/70">
        <p>Sacred Shifter - Elevate your frequency through intention and sound.</p>
      </footer>
    </div>
  );
};

export default EnergyCheck;
