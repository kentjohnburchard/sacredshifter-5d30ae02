
import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
  return (
    <Layout pageTitle="Admin Dashboard">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-white readable-text-bold">Admin Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link 
            to="/admin/journey-audio-admin" 
            className="block p-6 card-cosmic rounded-lg hover:bg-purple-900/20 transition-all duration-300"
          >
            <h3 className="text-lg font-semibold mb-2 text-white readable-text">Journey Audio Manager</h3>
            <p className="text-white/90 readable-text-light">
              Manage audio files for journey templates and assign them to specific journeys.
            </p>
          </Link>
          
          <Link 
            to="/admin/journey-audio-mappings" 
            className="block p-6 card-cosmic rounded-lg hover:bg-purple-900/20 transition-all duration-300"
          >
            <h3 className="text-lg font-semibold mb-2 text-white readable-text">Journey Audio Mappings Viewer</h3>
            <p className="text-white/90 readable-text-light">
              View all current audio mappings between journey templates and audio files.
            </p>
          </Link>

          <Link
            to="/admin/pages"
            className="block p-6 card-cosmic rounded-lg hover:bg-indigo-900/20 transition-all duration-300"
          >
            <h3 className="text-lg font-semibold mb-2 text-white readable-text">Pages Admin Canvas</h3>
            <p className="text-white/90 readable-text-light">
              View, organize, and soon edit all pages, navigation setup, and their connections.
            </p>
          </Link>
          
          <Link
            to="/admin/journeys"
            className="block p-6 card-cosmic rounded-lg hover:bg-purple-900/20 transition-all duration-300"
          >
            <h3 className="text-lg font-semibold mb-2 text-white readable-text">Sacred Journey Manager</h3>
            <p className="text-white/90 readable-text-light">
              Manage sacred journeys, their visual effects, audio mappings, and veil access settings.
            </p>
          </Link>
          
          <Link
            to="/admin/sacred-spectrum"
            className="block p-6 card-cosmic rounded-lg hover:bg-emerald-900/20 transition-all duration-300"
          >
            <h3 className="text-lg font-semibold mb-2 text-white readable-text">Sacred Spectrum Knowledge</h3>
            <p className="text-white/90 readable-text-light">
              Manage vibrational research resources, documents, and educational content.
            </p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
