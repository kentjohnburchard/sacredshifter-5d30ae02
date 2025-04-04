
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import ChakraAlignmentSection from "@/components/ChakraAlignmentSection";

const Alignment = () => {
  return (
    <Layout pageTitle="Chakra Alignment">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <ComingSoonBanner message="Our Chakra Alignment tools are being energetically calibrated for your journey." />
        
        <p className="text-base text-gray-600 max-w-2xl mx-auto text-center mb-8">
          Balance your energy centers with precision frequency healing designed for each chakra.
        </p>
        
        <ChakraAlignmentSection />
      </div>
    </Layout>
  );
};

export default Alignment;
