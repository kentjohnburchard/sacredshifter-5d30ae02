
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
        
        <h1 className="text-3xl font-bold mb-6 text-center">Sacred Shifter - Complete Site Map</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70">
            <CardHeader>
              <CardTitle>Main Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><Link to="/" className="text-purple-600 dark:text-purple-400 hover:underline">Home</Link></li>
                <li><Link to="/dashboard" className="text-purple-600 dark:text-purple-400 hover:underline">Cosmic Dashboard</Link></li>
                <li><Link to="/auth" className="text-purple-600 dark:text-purple-400 hover:underline">Login/Register</Link></li>
                <li><Link to="/profile" className="text-purple-600 dark:text-purple-400 hover:underline">User Profile</Link></li>
                <li><Link to="/about" className="text-purple-600 dark:text-purple-400 hover:underline">About Founder</Link></li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70">
            <CardHeader>
              <CardTitle>Journey & Frequency Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><Link to="/journey-templates" className="text-purple-600 dark:text-purple-400 hover:underline">Journey Templates</Link></li>
                <li><Link to="/journeys" className="text-purple-600 dark:text-purple-400 hover:underline">My Journeys</Link></li>
                <li><Link to="/frequencies" className="text-purple-600 dark:text-purple-400 hover:underline">Frequency Library</Link></li>
                <li><Link to="/frequency-shift" className="text-purple-600 dark:text-purple-400 hover:underline">Frequency Shifting</Link></li>
                <li><Link to="/meditation" className="text-purple-600 dark:text-purple-400 hover:underline">Meditation</Link></li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70">
            <CardHeader>
              <CardTitle>Admin & Management</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><Link to="/admin" className="text-purple-600 dark:text-purple-400 hover:underline">Admin Dashboard</Link></li>
                <li><Link to="/admin/journey-audio-admin" className="text-purple-600 dark:text-purple-400 hover:underline">Journey Audio Admin</Link></li>
                <li><Link to="/admin/journey-audio-mappings" className="text-purple-600 dark:text-purple-400 hover:underline">Journey Audio Mappings</Link></li>
                <li><Link to="/admin/frequency-admin" className="text-purple-600 dark:text-purple-400 hover:underline">Frequency Admin</Link></li>
                <li><Link to="/admin/user-management" className="text-purple-600 dark:text-purple-400 hover:underline">User Management</Link></li>
              </ul>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70">
            <CardHeader>
              <CardTitle>Educational Content</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><Link to="/hermetic" className="text-purple-600 dark:text-purple-400 hover:underline">Hermetic Wisdom</Link></li>
                <li><Link to="/sacred-geometry" className="text-purple-600 dark:text-purple-400 hover:underline">Sacred Geometry</Link></li>
                <li><Link to="/frequency-education" className="text-purple-600 dark:text-purple-400 hover:underline">Frequency Education</Link></li>
                <li><Link to="/chakras" className="text-purple-600 dark:text-purple-400 hover:underline">Chakra System</Link></li>
                <li><Link to="/resources" className="text-purple-600 dark:text-purple-400 hover:underline">Resources</Link></li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70">
            <CardHeader>
              <CardTitle>Special Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><Link to="/trinity-gateway" className="text-purple-600 dark:text-purple-400 hover:underline">Trinity Gateway</Link></li>
                <li><Link to="/cosmic-connection" className="text-purple-600 dark:text-purple-400 hover:underline">Cosmic Connection</Link></li>
                <li><Link to="/dna-activation" className="text-purple-600 dark:text-purple-400 hover:underline">DNA Activation</Link></li>
                <li><Link to="/quantum-healing" className="text-purple-600 dark:text-purple-400 hover:underline">Quantum Healing</Link></li>
                <li><Link to="/cosmic-visualizer" className="text-purple-600 dark:text-purple-400 hover:underline">Cosmic Visualizer Tool</Link></li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70">
            <CardHeader>
              <CardTitle>Settings & Support</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><Link to="/settings" className="text-purple-600 dark:text-purple-400 hover:underline">Account Settings</Link></li>
                <li><Link to="/support" className="text-purple-600 dark:text-purple-400 hover:underline">Support</Link></li>
                <li><Link to="/faq" className="text-purple-600 dark:text-purple-400 hover:underline">FAQ</Link></li>
                <li><Link to="/contact" className="text-purple-600 dark:text-purple-400 hover:underline">Contact Us</Link></li>
                <li><Link to="/terms" className="text-purple-600 dark:text-purple-400 hover:underline">Terms & Privacy</Link></li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-400 italic">All site pages are accessible through this sitemap</p>
          <Link to="/dashboard" className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default SiteMap;
