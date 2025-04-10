
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

const ReferralProgram = () => {
  return (
    <Layout pageTitle="Referral Program" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Referral Program
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Share the gift of sacred frequencies with friends and earn rewards
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-purple-900/50">
            <h2 className="text-2xl font-playfair mb-4 text-purple-300">Your Referral Link</h2>
            <div className="flex gap-2 mb-6">
              <Input value="https://sacredshifter.com/r/yourusername" readOnly className="bg-black/60" />
              <Button variant="secondary">Copy</Button>
            </div>
            <div className="bg-purple-900/20 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-purple-200 mb-2">How it works:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Share your unique referral link with friends</li>
                <li>When they sign up, they get 2 weeks free premium access</li>
                <li>Once they subscribe, you earn rewards</li>
              </ol>
            </div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-purple-900/50">
            <h2 className="text-2xl font-playfair mb-4 text-purple-300">Your Rewards</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                <div>
                  <div className="text-sm text-gray-400">Referrals</div>
                  <div className="text-xl">0 friends joined</div>
                </div>
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
              
              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                <div>
                  <div className="text-sm text-gray-400">Rewards Earned</div>
                  <div className="text-xl">$0.00</div>
                </div>
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
              
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                Share on Social Media
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReferralProgram;
