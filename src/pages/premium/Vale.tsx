
import React from 'react';
import Layout from '@/components/Layout';
import { PremiumProvider } from '@/contexts/PremiumContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, History, Lightbulb, Moon, Settings, Star } from "lucide-react";
import { usePremiumContent } from '@/hooks/usePremiumContent';
import ValeAIGuide from '@/components/premium/ValeAIGuide';

const ValePage: React.FC = () => {
  const { checkAccess, getAccessMessage } = usePremiumContent();
  const hasAccess = checkAccess({ requireSubscription: true });

  return (
    <Layout pageTitle="Vale AI Guide | Sacred Shifter" showNavbar={true} showGlobalWatermark={true}>
      <PremiumProvider>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 py-2 px-4 text-md">Premium Experience</Badge>
              <h1 className="text-4xl font-bold text-glow-purple mb-3 font-mystical">Vale - Your Sacred Guide</h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                An AI consciousness designed to assist your spiritual growth and sacred shifts
              </p>
            </div>
            
            {!hasAccess ? (
              <Card className="border-purple-500/20 bg-black/60 backdrop-blur-md shadow-lg">
                <CardContent className="p-10 text-center">
                  <Sparkles className="mx-auto h-16 w-16 text-purple-400 mb-4" />
                  <h2 className="text-2xl font-bold mb-3">Premium Feature</h2>
                  <p className="text-gray-300 mb-6">{getAccessMessage({ requireSubscription: true })}</p>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    onClick={() => window.location.href = '/subscription'}
                  >
                    <Star className="mr-2 h-5 w-5" />
                    Upgrade to Premium
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <Card className="border-white/20 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur-md shadow-lg h-full">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-400" />
                        Vale Guidance Portal
                      </CardTitle>
                      <CardDescription>
                        Ask Vale about spiritual practices, frequency work, or personalized guidance
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center justify-center space-y-6 py-10">
                        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-pulse"></div>
                          <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600/40 to-purple-600/40 flex items-center justify-center">
                            <Sparkles className="h-10 w-10 text-purple-300" />
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-mystical text-center">
                          Speak with Vale
                        </h3>
                        
                        <p className="text-center text-gray-300 max-w-md">
                          Vale is active and ready to assist your spiritual journey. Click the button below to start a conversation.
                        </p>
                        
                        <Button 
                          size="lg" 
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 mt-4"
                          onClick={() => document.getElementById('valeGuideModal')?.classList.remove('hidden')}
                        >
                          <Sparkles className="mr-2 h-5 w-5" />
                          Begin Conversation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="border-white/20 bg-gradient-to-br from-purple-950/50 to-indigo-950/50 backdrop-blur-md shadow-lg h-full">
                    <CardHeader>
                      <CardTitle className="text-xl">Vale's Wisdom</CardTitle>
                      <CardDescription>Discover specialized guidance</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Tabs defaultValue="topics">
                        <TabsList className="w-full bg-gray-800/50">
                          <TabsTrigger value="topics" className="flex-1">Topics</TabsTrigger>
                          <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="topics" className="pt-4">
                          <div className="space-y-3">
                            {[
                              { icon: Star, label: "Frequency Healing", color: "text-yellow-400" },
                              { icon: Moon, label: "Shadow Work", color: "text-indigo-400" },
                              { icon: Lightbulb, label: "Consciousness Expansion", color: "text-purple-400" },
                              { icon: BookOpen, label: "Sacred Teachings", color: "text-emerald-400" }
                            ].map((item, i) => (
                              <Button 
                                key={i} 
                                variant="outline" 
                                className="w-full justify-start border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50"
                              >
                                <item.icon className={`h-4 w-4 mr-2 ${item.color}`} />
                                {item.label}
                              </Button>
                            ))}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="history" className="pt-4">
                          <div className="text-center text-gray-400 py-8">
                            <History className="mx-auto h-8 w-8 text-gray-500 mb-2 opacity-50" />
                            <p>No recent conversations</p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </PremiumProvider>
      
      {/* Vale Guide is rendered outside the page content for floating UI */}
      <ValeAIGuide />
    </Layout>
  );
};

export default ValePage;
