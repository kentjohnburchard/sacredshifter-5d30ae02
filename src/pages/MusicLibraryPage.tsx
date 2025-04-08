
import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import MusicLibrary from "./MusicLibrary";

const MusicLibraryPage = () => {
  // Add debugging
  useEffect(() => {
    console.log('MusicLibraryPage mounted');
    setTimeout(() => {
      const footerElement = document.querySelector('footer');
      if (footerElement) {
        console.log('Footer in MusicLibraryPage:', {
          position: footerElement.getBoundingClientRect(),
          isVisible: footerElement.getBoundingClientRect().top < window.innerHeight
        });
      } else {
        console.log('Footer not found in MusicLibraryPage');
      }
    }, 1000);
  }, []);

  return (
    <Layout pageTitle="Sacred Sound Library">
      <div className="pb-16">
        <MusicLibrary />
      </div>
    </Layout>
  );
};

export default MusicLibraryPage;
