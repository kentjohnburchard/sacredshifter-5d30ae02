
import React from "react";
import Layout from "@/components/Layout";
import MusicLibrary from "./MusicLibrary";

const MusicLibraryPage = () => {
  return (
    <Layout pageTitle="Sacred Sound Library">
      <div className="pb-36">
        <MusicLibrary />
      </div>
    </Layout>
  );
};

export default MusicLibraryPage;
