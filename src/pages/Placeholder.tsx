
import React from 'react';
import Layout from '@/components/Layout';

const Placeholder: React.FC = () => {
  return (
    <Layout 
      pageTitle="Page Under Construction"
      showNavbar={true}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-6">
          This page is under construction
        </h1>
        <p className="text-xl text-purple-200 max-w-md mb-8">
          We're working on bringing this content to you soon. Please check back later.
        </p>
        <div className="h-24 w-24 border-t-4 border-purple-500 border-solid rounded-full animate-spin"></div>
      </div>
    </Layout>
  );
};

export default Placeholder;
