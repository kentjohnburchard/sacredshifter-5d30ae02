
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

const Admin: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to the new consolidated admin dashboard
    navigate('/admin/insights');
  }, [navigate]);

  return (
    <Layout pageTitle="Admin Dashboard">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-white readable-text-bold">Redirecting to Admin Dashboard...</h1>
        <div className="flex justify-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-500 rounded-full"></div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
