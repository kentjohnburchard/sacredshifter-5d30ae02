
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-purple-950 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-indigo-600">404</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
          Oops! This page doesn't exist in our frequency
        </p>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          The page you're looking for couldn't be found. It might have been moved or doesn't exist.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
            <Link to="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
