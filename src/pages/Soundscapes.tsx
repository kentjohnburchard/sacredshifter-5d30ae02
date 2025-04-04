
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import ComingSoonBanner from "@/components/ComingSoonBanner";

const Soundscapes = () => {
  return (
    <Layout pageTitle="Sacred Soundscapes">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <ComingSoonBanner message="Our Soundscapes page is still being tuned with sacred frequencies." />
        
        <p className="text-base text-gray-600 max-w-2xl mx-auto text-center mb-8">
          Immerse yourself in ambient soundscapes designed to enhance your focus, creativity, and spiritual connection.
        </p>
        
        <Card className="mt-8 border border-gray-200 shadow-md">
          <CardContent className="p-8 text-center">
            <p className="text-xl mb-4 font-medium">This page is coming soon!</p>
            <p className="text-gray-600 text-base">
              We're currently crafting beautiful soundscapes for you. 
              Check back soon to experience the power of ambient frequencies.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Soundscapes;
