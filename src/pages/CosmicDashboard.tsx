
import React from "react";
import Layout from "@/components/Layout";
import AboutSacredShifter from "@/components/AboutSacredShifter";

const CosmicDashboard: React.FC = () => {
  return (
    <Layout pageTitle="Home" theme="cosmic">
      <div className="container mx-auto px-4 py-8">
        <AboutSacredShifter />
      </div>
    </Layout>
  );
};

export default CosmicDashboard;
