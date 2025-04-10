
import React from "react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { navItems } from "@/config/navigation";
import { Card } from "@/components/ui/card";

const SiteMap = () => {
  // Group navigation items by category
  const categories = {
    main: ["home", "dashboard", "sacred-blueprint", "shift-perception"],
    features: ["frequency-library", "heart-center", "trinity-gateway", "hermetic-wisdom", "energy-check"],
    premium: ["deity-oracle", "soul-scribe", "astral-attunement", "frequency-shift"],
    account: ["profile", "subscription", "referral"],
    info: ["about-founder", "contact"]
  };

  const getCategoryTitle = (key: string) => {
    switch (key) {
      case 'main': return 'Main Pages';
      case 'features': return 'Core Features';
      case 'premium': return 'Premium Features';
      case 'account': return 'Account & Settings';
      case 'info': return 'Information';
      default: return 'Other Pages';
    }
  };

  const getNavItemByPath = (path: string) => {
    return navItems.find(item => item.path === path || 
      path.replace(/-/g, '') === item.path.replace(/-/g, ''));
  };

  return (
    <Layout pageTitle="Site Map" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Site Map
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Navigate the complete Sacred Shifter experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categories).map(([category, paths]) => (
            <Card key={category} className="bg-black/40 border-purple-900/50 text-white p-4">
              <h2 className="text-xl font-playfair mb-3 text-purple-300">{getCategoryTitle(category)}</h2>
              <ul className="space-y-2">
                {paths.map(path => {
                  const navItem = getNavItemByPath(`/${path}`);
                  return (
                    <li key={path}>
                      <Link 
                        to={`/${path}`} 
                        className="flex items-center py-1 px-2 rounded-md hover:bg-purple-900/20 transition-colors"
                      >
                        <span className="text-purple-200">{navItem?.label || path}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SiteMap;
