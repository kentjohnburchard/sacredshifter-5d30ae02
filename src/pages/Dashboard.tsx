
import React from "react";
import Layout from "@/components/Layout";
import UserDashboard from "@/components/UserDashboard";

const Dashboard: React.FC = () => {
  return (
    <Layout pageTitle="Dashboard">
      <div className="container mx-auto px-4 py-8">
        <UserDashboard />
      </div>
    </Layout>
  );
};

export default Dashboard;
