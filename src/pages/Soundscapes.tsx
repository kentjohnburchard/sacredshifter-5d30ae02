
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import ComingSoonBanner from "@/components/ComingSoonBanner";

const Soundscapes = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <ComingSoonBanner message="Our Soundscapes page is still being tuned with sacred frequencies." />
        
        <div className="text-center my-12">
          <h1 className="text-4xl font-light mb-4">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Sacred Soundscapes
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Immerse yourself in ambient soundscapes designed to enhance your focus, creativity, and spiritual connection.
          </p>
        </div>
        
        <Card className="mt-8 border border-gray-200 shadow-md">
          <CardContent className="p-8 text-center">
            <p className="text-xl mb-4">This page is coming soon!</p>
            <p className="text-gray-600">
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
