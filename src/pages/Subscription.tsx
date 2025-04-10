
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const Subscription = () => {
  return (
    <Layout pageTitle="Subscription" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Sacred Shifter Subscription
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Unlock the full potential of your spiritual journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <Card className="bg-black/40 border-purple-900/50 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-playfair">Free Access</CardTitle>
              <CardDescription className="text-gray-300">
                Begin your journey
              </CardDescription>
              <div className="text-2xl font-bold mt-2">$0</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {["Heart Center", "Shift Perception", "Site Map"].map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Current Plan</Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-400/30 text-white transform scale-105">
            <CardHeader>
              <CardTitle className="text-xl font-playfair">Sacred Explorer</CardTitle>
              <CardDescription className="text-purple-200">
                Most popular choice
              </CardDescription>
              <div className="text-2xl font-bold mt-2">$19.99<span className="text-sm font-normal">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "All Free Features",
                  "Sacred Blueprint™", 
                  "Frequency Library",
                  "Hermetic Wisdom",
                  "Journey Templates",
                  "Energy Check",
                  "Trinity Gateway™"
                ].map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-purple-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Subscribe Now</Button>
            </CardFooter>
          </Card>

          {/* Ultimate Plan */}
          <Card className="bg-black/40 border-purple-900/50 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-playfair">Sacred Shifter</CardTitle>
              <CardDescription className="text-gray-300">
                Complete experience
              </CardDescription>
              <div className="text-2xl font-bold mt-2">$39.99<span className="text-sm font-normal">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "All Explorer Features",
                  "Frequency Shift™",
                  "Soul Scribe™",
                  "Deity Oracle™",
                  "Astral Attunement™", 
                  "1-on-1 Guidance Session", 
                  "Priority Support"
                ].map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-indigo-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Upgrade</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Subscription;
