
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Tag, Calendar, Sparkles } from 'lucide-react';
import JourneysList from '@/components/journey/JourneysList';

const JourneysDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <Layout pageTitle="Sacred Journeys Directory">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Sacred Journeys</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore guided journeys for personal transformation, healing, and expansion of consciousness
          </p>
        </div>
        
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search journeys by title or tags..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" className="w-full mb-8">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Journeys</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="chakras">By Chakra</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Tag className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Duration
              </Button>
            </div>
          </div>
          
          <TabsContent value="all">
            <JourneysList filter={searchQuery} />
          </TabsContent>
          
          <TabsContent value="featured">
            <div className="mb-6">
              <div className="flex gap-2 mb-4 items-center">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h2 className="text-xl font-semibold">Featured Journeys</h2>
              </div>
              <JourneysList filter="featured" />
            </div>
          </TabsContent>
          
          <TabsContent value="recent">
            <JourneysList filter="" maxItems={6} />
          </TabsContent>
          
          <TabsContent value="chakras">
            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-semibold mb-4">Root Chakra</h3>
                <JourneysList filter="root" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Heart Chakra</h3>
                <JourneysList filter="heart" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Crown Chakra</h3>
                <JourneysList filter="crown" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default JourneysDirectory;
