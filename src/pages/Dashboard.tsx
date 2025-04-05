
import React from "react";
import Header from "@/components/Header";
import UserDashboard from "@/components/UserDashboard";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/30 to-purple-50/30 dark:from-gray-900 dark:to-purple-950">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <UserDashboard />
      </main>
    </div>
  );
};

export default Dashboard;
