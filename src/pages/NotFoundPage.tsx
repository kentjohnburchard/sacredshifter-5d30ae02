
import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <Layout pageTitle="Page Not Found">
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Page not found</p>
        <Link to="/" className="text-blue-400 hover:text-blue-300 underline">
          Return to home
        </Link>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
