
import React from "react";
import Layout from "@/components/Layout";
import FrequencyLibrary from "@/components/frequency-library/FrequencyLibrary";

const FrequencyLibraryPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-center lg:text-left bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Frequency Library
        </h1>
        
        <p className="text-lg text-center lg:text-left mb-8 text-gray-600">
          Explore our collection of healing frequencies for chakra alignment and spiritual transformation.
        </p>
        
        <FrequencyLibrary />
      </div>
    </Layout>
  );
};

export default FrequencyLibraryPage;
