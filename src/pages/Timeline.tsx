
import React from "react";
import Layout from "@/components/Layout";
import TimelineViewer from "@/components/timeline/TimelineViewer";

const Timeline = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center my-12">
          <h1 className="text-4xl font-light mb-4">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-500">
              Frequency Timeline
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Review your frequency journey and revisit moments that resonated with you.
          </p>
        </div>
        
        <TimelineViewer />
      </div>
    </Layout>
  );
};

export default Timeline;
