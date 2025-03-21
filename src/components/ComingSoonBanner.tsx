
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ComingSoonBannerProps {
  message?: string;
}

const ComingSoonBanner: React.FC<ComingSoonBannerProps> = ({ 
  message = "Our Sacred Sound Healing platform is evolving! New features coming soon."
}) => {
  return (
    <Alert 
      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-md mb-8 animate-fade-in"
    >
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="text-lg font-bold">Coming Soon!</AlertTitle>
      <AlertDescription className="text-white/90">
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default ComingSoonBanner;
