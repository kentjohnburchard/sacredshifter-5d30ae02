
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import IntentionSettingSection from "@/components/IntentionSettingSection";

const Intentions = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <ComingSoonBanner message="Our Intention Setting tools are aligning with the universe's frequency." />
        
        <div className="text-center my-12">
          <h1 className="text-4xl font-light mb-4">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-500">
              Intention Setting
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Set powerful intentions that resonate with your highest vibration and manifest your desired reality.
          </p>
        </div>
        
        <IntentionSettingSection />
      </div>
    </Layout>
  );
};

export default Intentions;
