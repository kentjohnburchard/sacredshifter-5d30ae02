
import React, { useState } from "react";
import Layout from "@/components/Layout";
import MusicForm from "@/components/MusicForm";
import GenerationHistory from "@/components/GenerationHistory";
import UserCreditsDisplay from "@/components/UserCreditsDisplay";
import SubscriptionPromotion from "@/components/SubscriptionPromotion";
import { useAuth } from "@/context/AuthContext";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MusicGeneration = () => {
  const [activeTab, setActiveTab] = useState<string>("create");
  const { user } = useAuth();
  const { userCredits, loading } = useUserSubscription();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light mb-4">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Sacred Sound Creation
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate healing music infused with sacred frequencies to elevate your consciousness and align your energy.
          </p>
        </div>

        {user && (
          <div className="mb-6">
            <UserCreditsDisplay credits={userCredits?.balance ?? null} isLoading={loading} />
          </div>
        )}

        {/* Display subscription promotion for logged-in users */}
        {user && (
          <SubscriptionPromotion compact={true} />
        )}

        <Tabs defaultValue="create" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="history">Your Creations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <MusicForm />
          </TabsContent>
          
          <TabsContent value="history">
            <GenerationHistory />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MusicGeneration;
