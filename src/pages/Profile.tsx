
import React from "react";
import Header from "@/components/Header";
import UserProfile from "@/components/UserProfile";
import ProtectedRoute from "@/components/ProtectedRoute";

const Profile: React.FC = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50/30 to-purple-50/30 dark:from-gray-900 dark:to-purple-950">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <UserProfile />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
