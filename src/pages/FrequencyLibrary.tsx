
import React from "react";
import Layout from "@/components/Layout";
import FrequencyLibrary from "@/components/frequency-library/FrequencyLibrary";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Library, BookmarkIcon } from "lucide-react";
import SavedFrequenciesViewer from "@/components/frequency-library/SavedFrequenciesViewer";

const FrequencyLibraryPage = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center my-8 md:my-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Frequency Library
            </span>
          </h1>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Explore sacred frequencies, each designed to align with specific chakras and healing intentions.
          </p>
        </div>
        
        <Tabs defaultValue="library" className="w-full">
          <TabsList className="mb-6 w-full max-w-md mx-auto bg-black/50 p-1">
            <TabsTrigger value="library" className="w-1/2 text-white">
              <Library className="h-4 w-4 mr-2" />
              Browse Library
            </TabsTrigger>
            <TabsTrigger value="saved" className="w-1/2 text-white">
              <BookmarkIcon className="h-4 w-4 mr-2" />
              Saved Frequencies
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="library">
            <Card className="border border-purple-500/30 bg-black/60 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <FrequencyLibrary />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="saved">
            <Card className="border border-purple-500/30 bg-black/60 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <SavedFrequenciesViewer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default FrequencyLibraryPage;
