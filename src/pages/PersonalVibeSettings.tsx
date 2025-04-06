
import React from "react";
import Layout from "@/components/Layout";
import VibeCustomizer from "@/components/personalization/VibeCustomizer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PersonalVibeSettings: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/dashboard" className="flex items-center text-purple-600 hover:text-purple-800 transition-colors mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
          <h1 className="text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Customize Your Vibe
          </h1>
        </div>
        <VibeCustomizer />
      </div>
    </Layout>
  );
};

export default PersonalVibeSettings;
