
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

const AccountPage = () => {
  return (
    <PageLayout title="My Account">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">My Sacred Account</h1>
        <p>Your spiritual journey and account details will appear here.</p>
      </div>
    </PageLayout>
  );
};

export default AccountPage;
