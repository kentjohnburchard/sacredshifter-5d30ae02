
import React from "react";
import Layout from "@/components/Layout";
import TimelineViewer from "@/components/timeline/TimelineViewer";

const Timeline = () => {
  return (
    <Layout pageTitle="My Frequency Timeline">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <p className="text-base text-gray-600 max-w-2xl mx-auto text-center mb-8">
          Revisit your frequency journey and reconnect with moments that resonated with your energy.
        </p>
        
        <TimelineViewer />
      </div>
    </Layout>
  );
};

export default Timeline;
