
import React from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import FrequencyExperiencePlayer from "@/components/frequency-library/FrequencyExperiencePlayer";

const FrequencyDetailPage = () => {
  const { frequencyId } = useParams<{ frequencyId: string }>();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-center lg:text-left bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Sacred Frequency Experience
        </h1>
        
        <p className="text-lg text-center lg:text-left mb-8 text-gray-600">
          Immerse yourself in the healing vibrations and sacred geometry of this frequency
        </p>
        
        <FrequencyExperiencePlayer />
      </div>
    </Layout>
  );
};

export default FrequencyDetailPage;
