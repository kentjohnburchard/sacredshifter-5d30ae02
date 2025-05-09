
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

interface PlaceholderProps {
  name?: string;
}

export default function Placeholder({ name = "Page" }: PlaceholderProps) {
  const params = useParams();
  const slug = params.slug || params.journeySlug;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950/20 to-black flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-lg p-8 max-w-md">
        <h1 className="text-3xl font-bold text-white mb-2">
          {name === "Journey" && slug ? `Journey: ${slug}` : name}
        </h1>
        <p className="text-purple-100/70 mb-6">
          This page is under construction but still sacred ✨
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/journeys">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Journeys
            </Button>
          </Link>
          <Link to="/">
            <Button className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
