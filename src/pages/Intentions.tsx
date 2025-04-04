
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import IntentionSettingSection from "@/components/IntentionSettingSection";

const Intentions = () => {
  return (
    <Layout pageTitle="Intention Setting">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <ComingSoonBanner message="Our Intention Setting tools are aligning with the universe's frequency." />
        
        <p className="text-base text-gray-600 max-w-2xl mx-auto text-center mb-8">
          Set powerful intentions that resonate with your highest vibration and manifest your desired reality.
        </p>
        
        <IntentionSettingSection />
      </div>
    </Layout>
  );
};

export default Intentions;
