
import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import SacredAudioPlayer from "@/components/audio/SacredAudioPlayer";
import { useGlobalAudioPlayer } from "@/hooks/useGlobalAudioPlayer";

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
      <main className="flex-grow">{children}</main>
      <Footer />
      
      {/* The sacred audio player is rendered only once here */}
      <SacredAudioPlayer />
    </div>
  );
};

export default Layout;
