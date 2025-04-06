
import React from "react";
import Header from "@/components/navigation/Header";
import VibeCustomizer from "@/components/personalization/VibeCustomizer";
import Watermark from "@/components/Watermark";
import Layout from "@/components/Layout";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PersonalVibeSettings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/30 to-purple-50/30">
      <Watermark />
      <Header />
      <main className="container mx-auto px-4 py-8 mt-12">
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
      </main>
    </div>
  );
};

export default PersonalVibeSettings;
