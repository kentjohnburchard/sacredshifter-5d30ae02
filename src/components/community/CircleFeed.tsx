
import React from 'react';
import CirclePost from './CirclePost';
import { useCommunity } from '@/hooks/useCommunity';
import { Card } from '@/components/ui/card';

const CircleFeed: React.FC = () => {
  const { posts, loading } = useCommunity();
  
  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-glow-purple">Sacred Circle Feed</h2>
        <button className="btn-primary standard-mode">New Post</button>
      </div>
      
      {loading ? (
        <Card className="p-6 text-center ethereal-card">
          <div className="animate-pulse">
            <p className="text-glow-light">Connecting to the collective consciousness...</p>
          </div>
        </Card>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <CirclePost key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center ethereal-card">
          <p className="text-glow-light mb-4">The Sacred Circle awaits your first contribution.</p>
          <p className="text-sm text-gray-300">Share your wisdom and connect with others on the path.</p>
        </Card>
      )}
    </div>
  );
};

export default CircleFeed;
