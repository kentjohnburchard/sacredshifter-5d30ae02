
import React from "react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SacredGeometryVisualizer } from "@/components/sacred-geometry";

const SiteMap: React.FC = () => {
  return (
    <Layout pageTitle="Site Map">
      <div className="container mx-auto px-4 py-8 relative">
        <div className="absolute -z-10 inset-0 pointer-events-none">
          <SacredGeometryVisualizer 
            defaultShape="flower-of-life"
            size="xl"
            showControls={false}
          />
        </div>
        
        <h1 className="text-3xl font-bold mb-6 text-center">Sacred Shifter - Site Map</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="backdrop-blur-sm bg-white/70">
            <CardHeader>
              <CardTitle>Main Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><Link to="/" className="text-purple-600 hover:underline">Home</Link></li>
                <li><Link to="/welcome" className="text-purple-600 hover:underline">Welcome</Link></li>
                <li><Link to="/dashboard" className="text-purple-600 hover:underline">Cosmic Dashboard (with Sacred Visualizer)</Link></li>
                <li><Link to="/landing" className="text-purple-600 hover:underline">Sacred Shifter Landing</Link></li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/70">
            <CardHeader>
              <CardTitle>Journey Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><Link to="/journey-templates" className="text-purple-600 hover:underline">Journey Templates</Link></li>
                <li><Link to="/meditations" className="text-purple-600 hover:underline">Meditations</Link></li>
                <li><Link to="/frequency-shifting" className="text-purple-600 hover:underline">Frequency Shifting</Link></li>
                <li><Link to="/hermetic-principles" className="text-purple-600 hover:underline">Hermetic Principles</Link></li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/70">
            <CardHeader>
              <CardTitle>Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><Link to="/admin" className="text-purple-600 hover:underline">Admin Dashboard</Link></li>
                <li><Link to="/admin/journey-audio-admin" className="text-purple-600 hover:underline">Journey Audio Admin</Link></li>
                <li><Link to="/admin/journey-audio-mappings" className="text-purple-600 hover:underline">Journey Audio Mappings</Link></li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 italic">Click on any link above to navigate to that page</p>
          <Link to="/dashboard" className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            Go to Cosmic Dashboard with Visualizer
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default SiteMap;
