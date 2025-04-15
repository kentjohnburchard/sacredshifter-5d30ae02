
import React from "react";
import Footer from "@/components/navigation/Footer";
import SacredAudioPlayer from "@/components/audio/SacredAudioPlayer";
import Sidebar from "@/components/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  theme?: string;
  useBlueWaveBackground?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle, theme, useBlueWaveBackground }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-purple-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow ml-0 sm:ml-20">{children}</main>
      </div>
      <Footer />
      
      {/* The global audio player component */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <SacredAudioPlayer />
      </div>
    </div>
  );
};

export default Layout;
