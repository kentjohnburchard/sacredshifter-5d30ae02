
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
          <h1 className="text-4xl font-light mb-4">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Frequency Library
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore sacred frequencies, each designed to align with specific chakras and healing intentions.
          </p>
        </div>
        
        <Tabs defaultValue="library" className="w-full">
          <TabsList className="mb-6 w-full max-w-md mx-auto">
            <TabsTrigger value="library" className="w-1/2">
              <Library className="h-4 w-4 mr-2" />
              Browse Library
            </TabsTrigger>
            <TabsTrigger value="saved" className="w-1/2">
              <BookmarkIcon className="h-4 w-4 mr-2" />
              Saved Frequencies
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="library">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <FrequencyLibrary />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="saved">
            <Card className="border border-gray-200 shadow-sm">
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
