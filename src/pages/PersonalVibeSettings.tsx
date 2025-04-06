
import React from "react";
import Header from "@/components/navigation/Header";
import VibeCustomizer from "@/components/personalization/VibeCustomizer";
import Watermark from "@/components/Watermark";

const PersonalVibeSettings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/30 to-purple-50/30">
      <Watermark />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <VibeCustomizer />
      </main>
    </div>
  );
};

export default PersonalVibeSettings;
