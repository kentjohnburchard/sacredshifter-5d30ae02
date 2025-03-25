
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import ChakraAlignmentSection from "@/components/ChakraAlignmentSection";

const Alignment = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <ComingSoonBanner message="Our Chakra Alignment tools are being energetically calibrated for your journey." />
        
        <div className="text-center my-12">
          <h1 className="text-4xl font-light mb-4">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Chakra Alignment
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Balance your energy centers with precision frequency healing designed for each chakra.
          </p>
        </div>
        
        <ChakraAlignmentSection />
      </div>
    </Layout>
  );
};

export default Alignment;
