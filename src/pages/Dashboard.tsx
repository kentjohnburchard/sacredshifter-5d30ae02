
import React from "react";
import UserDashboard from "@/components/UserDashboard";
import Layout from "@/components/Layout";

const Dashboard: React.FC = () => {
  return (
    <Layout pageTitle="Soul Journey Dashboard">
      <UserDashboard />
    </Layout>
  );
};

export default Dashboard;
