
import React from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';

const SiteMap: React.FC = () => {
  return (
    <PageLayout title="Site Map">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Site Map</h1>

        {/* General Pages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">General Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/">
              <Button className="w-full justify-start">Home</Button>
            </Link>
            <Link to="/about">
              <Button className="w-full justify-start">About</Button>
            </Link>
            <Link to="/contact">
              <Button className="w-full justify-start">Contact</Button>
            </Link>
            <Link to="/pricing">
              <Button className="w-full justify-start">Pricing</Button>
            </Link>
            <Link to="/faq">
              <Button className="w-full justify-start">FAQ</Button>
            </Link>
            <Link to="/terms">
              <Button className="w-full justify-start">Terms of Service</Button>
            </Link>
            <Link to="/privacy">
              <Button className="w-full justify-start">Privacy Policy</Button>
            </Link>
          </div>
        </div>

        {/* Community Pages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Community Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/community">
              <Button className="w-full justify-start">Community Home</Button>
            </Link>
            <Link to="/community/forums">
              <Button className="w-full justify-start">Forums</Button>
            </Link>
            <Link to="/community/events">
              <Button className="w-full justify-start">Events</Button>
            </Link>
            <Link to="/community/groups">
              <Button className="w-full justify-start">Groups</Button>
            </Link>
            <Link to="/community/members">
              <Button className="w-full justify-start">Members</Button>
            </Link>
          </div>
        </div>

        {/* Frequency Journey Pages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Frequency Journey Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <Link to="/journey-templates">
              <Button className="w-full justify-start">Journey Templates</Button>
            </Link>
            <Link to="/frequency-library">
              <Button className="w-full justify-start">Frequency Library</Button>
            </Link>
            <Link to="/my-journeys">
              <Button className="w-full justify-start">My Journeys</Button>
            </Link>
          </div>
        </div>

        {/* Sacred Geometry Pages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Sacred Geometry Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/sacred-geometry">
              <Button className="w-full justify-start">Sacred Geometry Home</Button>
            </Link>
            <Link to="/sacred-geometry/visualizer">
              <Button className="w-full justify-start">Visualizer</Button>
            </Link>
            <Link to="/sacred-geometry/patterns">
              <Button className="w-full justify-start">Patterns</Button>
            </Link>
          </div>
        </div>

        {/* Hermetic Wisdom Pages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Hermetic Wisdom Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/hermetic-wisdom">
              <Button className="w-full justify-start">Hermetic Wisdom Home</Button>
            </Link>
            <Link to="/hermetic-wisdom/principles">
              <Button className="w-full justify-start">Principles</Button>
            </Link>
            <Link to="/hermetic-wisdom/journeys">
              <Button className="w-full justify-start">Journeys</Button>
            </Link>
          </div>
        </div>

        {/* Account Pages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Account Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/profile">
              <Button className="w-full justify-start">Profile</Button>
            </Link>
            <Link to="/settings">
              <Button className="w-full justify-start">Settings</Button>
            </Link>
            <Link to="/billing">
              <Button className="w-full justify-start">Billing</Button>
            </Link>
            <Link to="/auth/login">
              <Button className="w-full justify-start">Login</Button>
            </Link>
             <Link to="/auth/register">
              <Button className="w-full justify-start">Register</Button>
            </Link>
            <Link to="/auth/forgot-password">
              <Button className="w-full justify-start">Forgot Password</Button>
            </Link>
          </div>
        </div>

        {/* Admin Pages */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Admin Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/admin">
              <Button className="w-full justify-start">Admin Dashboard</Button>
            </Link>
            <Link to="/admin/journey-spirals">
              <Button className="w-full justify-start">Journey Spirals Admin</Button>
            </Link>
            <Link to="/admin/journey-content">
              <Button className="w-full justify-start">Journey Content Admin</Button>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SiteMap;
