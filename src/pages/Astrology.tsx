
import React from "react";
import Layout from "@/components/Layout";
import AstrologyPage from "@/components/astrology/AstrologyPage";

const Astrology = () => {
  return (
    <Layout pageTitle="Astrology">
      <div className="py-4">
        <AstrologyPage />
      </div>
    </Layout>
  );
};

export default Astrology;
