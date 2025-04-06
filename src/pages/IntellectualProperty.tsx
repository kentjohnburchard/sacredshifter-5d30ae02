
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrademarkedName, LegalFooter } from "@/components/ip-protection";
import { motion } from "framer-motion";
import { Shield, Mail, Sparkles } from "lucide-react";

const IntellectualPropertyPage: React.FC = () => {
  return (
    <Layout pageTitle="Our Sacred IP">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-3xl mx-auto bg-white/60 backdrop-blur-sm border-purple-100">
            <CardHeader className="border-b border-purple-100">
              <CardTitle className="flex items-center gap-2 text-center justify-center">
                <Shield className="h-5 w-5 text-purple-600" />
                Our Sacred Intellectual Property
                <Sparkles className="h-5 w-5 text-purple-600" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <section className="prose prose-purple max-w-none">
                <p className="text-center text-lg mb-6">
                  We create with intention, integrity, and energetic alignment.
                </p>
                
                <p>
                  <TrademarkedName>Sacred Shifter</TrademarkedName> and all of its core technologies—including the <TrademarkedName>Sacred Blueprint</TrademarkedName>, <TrademarkedName>Emotion Engine</TrademarkedName>, and <TrademarkedName>Mirror Portal</TrademarkedName>—are 
                  original works developed by Sacred Shifter. These tools represent years of visioning, healing, design, and development.
                </p>
                
                <p>
                  All systems, archetypes, UI designs, and copy are protected under copyright and trademark law, and are not to be copied, reproduced, or rebranded without explicit written consent.
                </p>
                
                <blockquote className="border-l-4 border-purple-300 pl-4 italic">
                  We welcome collaboration, but not duplication.
                </blockquote>
                
                <p className="text-center">
                  Thank you for respecting the sanctity of the work.
                </p>
                
                <div className="bg-purple-50 p-4 rounded-lg mt-8 flex items-center justify-center gap-3">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <p className="m-0">
                    To report infringement or inquire about licensing, please contact{" "}
                    <a href="mailto:ip@sacredshifter.com" className="text-purple-600 hover:text-purple-800">
                      ip@sacredshifter.com
                    </a>
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
          
          <div className="mt-8">
            <LegalFooter variant="expanded" />
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default IntellectualPropertyPage;
