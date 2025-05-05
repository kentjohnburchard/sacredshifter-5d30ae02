import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from './lib/queryClient';
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

// Create a client instance outside component for persistence
const queryClient = createQueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default Root;
