
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import ComingSoonBanner from "@/components/ComingSoonBanner";

const Journeys = () => {
  return (
    <Layout pageTitle="Sound Journeys">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <ComingSoonBanner message="Our Sound Journeys page is still being fine-tuned with sacred frequencies." />
        
        <p className="text-base text-gray-600 max-w-2xl mx-auto text-center mb-8">
          Immerse yourself in transformative sound experiences designed to elevate your consciousness and align your energy.
        </p>
        
        <Card className="mt-8 border border-gray-200 shadow-md">
          <CardContent className="p-8 text-center">
            <p className="text-xl mb-4 font-medium">This page is coming soon!</p>
            <p className="text-gray-600 text-base">
              We're currently crafting beautiful sound journeys for you. 
              Check back soon to experience the power of sacred frequencies.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Journeys;
