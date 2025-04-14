
import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import SacredAudioPlayer from "@/components/audio/SacredAudioPlayer";
import { useGlobalAudioPlayer } from "@/hooks/useGlobalAudioPlayer";
import Sidebar from "@/components/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  theme?: string;
  useBlueWaveBackground?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle, theme, useBlueWaveBackground }) => {
  // Use the global audio player to ensure the audio continues across route changes
  const { isPlaying } = useGlobalAudioPlayer();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-purple-50">
      <Navbar />
      <div className="flex flex-grow pt-16">
        <Sidebar />
        <main className="flex-grow ml-0 sm:ml-20">{children}</main>
      </div>
      <Footer />
      
      {/* The sacred audio player is rendered only once here */}
      <SacredAudioPlayer />
    </div>
  );
};

export default Layout;
