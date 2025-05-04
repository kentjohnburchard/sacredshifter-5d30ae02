
import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
  return (
    <Layout pageTitle="Admin Dashboard">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link 
            to="/admin/journey-audio-admin" 
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50"
          >
            <h3 className="text-lg font-semibold mb-2">Journey Audio Manager</h3>
            <p className="text-gray-600">
              Manage audio files for journey templates and assign them to specific journeys.
            </p>
          </Link>
          
          <Link 
            to="/admin/journey-audio-mappings" 
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50"
          >
            <h3 className="text-lg font-semibold mb-2">Journey Audio Mappings Viewer</h3>
            <p className="text-gray-600">
              View all current audio mappings between journey templates and audio files.
            </p>
          </Link>

          <Link
            to="/admin/pages"
            className="block p-6 bg-white rounded-lg border border-indigo-200 shadow-sm hover:bg-indigo-50"
          >
            <h3 className="text-lg font-semibold mb-2">Pages Admin Canvas</h3>
            <p className="text-gray-600">
              View, organize, and soon edit all pages, navigation setup, and their connections.
            </p>
          </Link>
          
          {/* New Link for Journey Manager */}
          <Link
            to="/admin/journeys"
            className="block p-6 bg-white rounded-lg border border-purple-200 shadow-sm hover:bg-purple-50"
          >
            <h3 className="text-lg font-semibold mb-2">Sacred Journey Manager</h3>
            <p className="text-gray-600">
              Manage sacred journeys, their visual effects, audio mappings, and veil access settings.
            </p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
