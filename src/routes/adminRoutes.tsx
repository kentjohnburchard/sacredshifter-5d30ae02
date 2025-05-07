
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const AdminDashboard = () => (
  <PageLayout title="Admin Dashboard">
    <div className="container mx-auto p-4">
      <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6">
        <h1 className="text-xl font-bold mb-4 text-white">Sacred Shifter Admin</h1>
        <p className="text-gray-300 mb-6">
          This area is for administrative functions and is only available in development mode.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-black/50 border border-purple-500/30 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2 text-white">Journey Management</h2>
            <p className="text-gray-400 text-sm mb-4">Create, edit, and manage sacred journeys</p>
            <Button asChild className="w-full">
              <Link to="/admin/journeys">Manage Journeys</Link>
            </Button>
          </div>
          
          <div className="bg-black/50 border border-purple-500/30 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2 text-white">Soundscapes</h2>
            <p className="text-gray-400 text-sm mb-4">Manage audio content for journeys</p>
            <Button asChild className="w-full">
              <Link to="/admin/soundscapes">Manage Soundscapes</Link>
            </Button>
          </div>
          
          <div className="bg-black/50 border border-purple-500/30 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2 text-white">Visuals</h2>
            <p className="text-gray-400 text-sm mb-4">Customize journey visualizations</p>
            <Button asChild className="w-full">
              <Link to="/admin/visuals">Manage Visuals</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
);

const JourneyAdmin = () => (
  <PageLayout title="Journey Administration">
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/admin">
            <Home className="h-4 w-4 mr-2" />
            Back to Admin
          </Link>
        </Button>
      </div>
      
      <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6">
        <h1 className="text-xl font-bold mb-4 text-white">Journey Management</h1>
        <p className="text-gray-400 mb-6">
          Create, edit, and manage the sacred journey content in the system.
        </p>
        
        <div className="bg-black/70 border border-purple-500/30 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2 text-white">Create Journey</h2>
          <p className="text-gray-400 text-sm mb-4">
            Add a new journey to the system
          </p>
          <Button>Create New Journey</Button>
        </div>
        
        <div className="bg-black/70 border border-purple-500/30 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2 text-white">Journey List</h2>
          <p className="text-gray-400 text-sm mb-4">
            Edit existing journey content
          </p>
          <div className="text-center text-gray-400 py-8">
            Journey list will appear here
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
);

const SoundscapeAdmin = () => (
  <PageLayout title="Soundscape Administration">
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/admin">
            <Home className="h-4 w-4 mr-2" />
            Back to Admin
          </Link>
        </Button>
      </div>
      
      <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6">
        <h1 className="text-xl font-bold mb-4 text-white">Soundscape Management</h1>
        <p className="text-gray-400 mb-6">
          Upload and manage soundscapes for journeys.
        </p>
        
        <div className="text-center text-gray-400 py-8">
          Soundscape management interface will appear here
        </div>
      </div>
    </div>
  </PageLayout>
);

const VisualsAdmin = () => (
  <PageLayout title="Visuals Administration">
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/admin">
            <Home className="h-4 w-4 mr-2" />
            Back to Admin
          </Link>
        </Button>
      </div>
      
      <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6">
        <h1 className="text-xl font-bold mb-4 text-white">Visuals Management</h1>
        <p className="text-gray-400 mb-6">
          Customize the visual components of journeys.
        </p>
        
        <div className="text-center text-gray-400 py-8">
          Visual editor interface will appear here
        </div>
      </div>
    </div>
  </PageLayout>
);

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="journeys" element={<JourneyAdmin />} />
      <Route path="soundscapes" element={<SoundscapeAdmin />} />
      <Route path="visuals" element={<VisualsAdmin />} />
    </Routes>
  );
};

export default AdminRoutes;
