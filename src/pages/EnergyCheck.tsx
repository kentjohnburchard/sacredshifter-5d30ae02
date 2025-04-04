
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { EnergyCheckTabs } from "@/components/energy-check";
import { Link } from "react-router-dom";
import { BookOpen, Stars } from "lucide-react";
import { Button } from "@/components/ui/button";

const EnergyCheck = () => {
  const [activeTab, setActiveTab] = useState("frequency");
  
  return (
    <Layout pageTitle="Energy Check-In">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <p className="text-base text-gray-600 max-w-2xl mx-auto text-center mb-2">
          Align your energy and set sacred intentions for your journey.
        </p>
        
        <div className="flex justify-center gap-4 mb-6">
          <Link to="/hermetic-wisdom">
            <Button variant="outline" className="gap-2 text-purple-600 border-purple-200 hover:bg-purple-50">
              <BookOpen className="h-4 w-4" />
              <span>Explore Hermetic Wisdom</span>
            </Button>
          </Link>
          
          <Link to="/astrology">
            <Button variant="outline" className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
              <Stars className="h-4 w-4" />
              <span>Cosmic Insights</span>
            </Button>
          </Link>
        </div>
        
        <EnergyCheckTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </Layout>
  );
};

export default EnergyCheck;
