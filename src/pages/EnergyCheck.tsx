
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { EnergyCheckTabs } from "@/components/energy-check";

const EnergyCheck = () => {
  const [activeTab, setActiveTab] = useState("frequency");
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center my-12">
          <h1 className="text-4xl font-light mb-4">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-500">
              Check-In
            </span>
          </h1>
          {/* Removed the descriptive paragraph */}
        </div>
        
        <EnergyCheckTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </Layout>
  );
};

export default EnergyCheck;
