import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { getActiveNavItems } from "@/config/navigation";
import { Separator } from "@/components/ui/separator";
import { Map } from "lucide-react";

const SiteMap = () => {
  const activeNavItems = getActiveNavItems();
  
  // Group pages by category
  const categories = {
    "Main Pages": [
      { path: "/", label: "Home" },
      { path: "/dashboard", label: "Dashboard" },
      { path: "/energy-check", label: "Energy Check" },
      { path: "/sacred-blueprint", label: "Sacred Blueprint" },
      { path: "/shift-perception", label: "Shift Your Perception" },
    ],
    "Personal Growth": [
      { path: "/heart-center", label: "Heart Center" },
      { path: "/heart-dashboard", label: "Heart Dashboard" },
      { path: "/alignment", label: "Alignment" },
      { path: "/intentions", label: "Intentions" },
      { path: "/focus", label: "Focus" },
    ],
    "Sacred Knowledge": [
      { path: "/hermetic-wisdom", label: "Hermetic Wisdom" },
      { path: "/harmonic-map", label: "Harmonic Map" },
      { path: "/astrology", label: "Astrology" },
      { path: "/trinity-gateway", label: "Trinity Gateway™" },
    ],
    "Music & Frequencies": [
      { path: "/music-library", label: "Music Library" },
      { path: "/journey-templates", label: "Journey Templates" },
    ],
    "Account & Information": [
      { path: "/profile", label: "Profile" },
      { path: "/personal-vibe", label: "My Vibe" },
      { path: "/subscription", label: "Subscription" },
      { path: "/about-founder", label: "About Founder" },
      { path: "/contact", label: "Contact" },
    ],
    "Timeline & Experience": [
      { path: "/timeline", label: "Timeline" },
      { path: "/emotion-engine", label: "Emotion Engine™" },
    ]
  };

  return (
    <Layout pageTitle="Site Map">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-2">
          <Map className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-semibold text-purple-800">Complete Site Map</h1>
        </div>
        
        <p className="text-gray-600 mb-8">
          This page provides a comprehensive overview of all the content and pages available within Sacred Shifter.
          Use this map to navigate directly to any area of interest.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(categories).map(([category, pages]) => (
            <div key={category} className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
              <h2 className="text-lg font-medium text-purple-800 mb-3">{category}</h2>
              <Separator className="mb-4 bg-purple-100" />
              <ul className="space-y-2">
                {pages.map((page) => (
                  <li key={page.path}>
                    <Link 
                      to={page.path} 
                      className="text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-2"
                    >
                      <span className="h-1.5 w-1.5 bg-purple-400 rounded-full"></span>
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-purple-50 rounded-lg border border-purple-100">
          <h2 className="text-lg font-medium text-purple-800 mb-4">Site Structure</h2>
          <div className="pl-4 border-l-2 border-purple-200">
            <ul className="space-y-4">
              <li>
                <div className="font-medium text-purple-700">Main Navigation</div>
                <div className="pl-4 mt-1 text-sm text-gray-600">
                  Accessible via the sidebar on all pages. Contains links to all main sections of the site.
                </div>
              </li>
              <li>
                <div className="font-medium text-purple-700">User Dashboard</div>
                <div className="pl-4 mt-1 text-sm text-gray-600">
                  Central hub for personalized content, recommendations, and quick access to frequently used features.
                </div>
              </li>
              <li>
                <div className="font-medium text-purple-700">Footer</div>
                <div className="pl-4 mt-1 text-sm text-gray-600">
                  Available on all pages with links to legal information, resources, and support.
                </div>
              </li>
              <li>
                <div className="font-medium text-purple-700">Account Area</div>
                <div className="pl-4 mt-1 text-sm text-gray-600">
                  Profile settings, subscription management, and personal preferences.
                </div>
              </li>
              <li>
                <div className="font-medium text-purple-700">Featured Content</div>
                <div className="pl-4 mt-1 text-sm text-gray-600">
                  Sacred Blueprint and Shift Your Perception pages offer core guidance for your spiritual journey.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SiteMap;
