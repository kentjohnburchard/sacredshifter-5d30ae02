
import React from "react";
import Layout from "@/components/Layout";
import AboutSacredShifterComponent from "@/components/AboutSacredShifter";

const AboutSacredShifter: React.FC = () => {
  return (
    <Layout pageTitle="About Sacred Shifter" theme="cosmic">
      <div className="container mx-auto px-4 py-8">
        <AboutSacredShifterComponent />
      </div>
    </Layout>
  );
};

export default AboutSacredShifter;
