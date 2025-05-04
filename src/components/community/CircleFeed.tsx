
import React, { useState, useEffect } from 'react';
import CirclePost from './CirclePost';
import { useCommunity } from '@/hooks/useCommunity';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NewPostModal from './NewPostModal';

const CircleFeed: React.FC = () => {
  const { posts, loading } = useCommunity();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  
  // Show floating button when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto relative pb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-glow-purple">Sacred Circle Feed</h2>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="btn-primary standard-mode"
        >
          New Post
        </Button>
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
      
      {/* Floating New Post button that appears on scroll */}
      <div 
        className={`fixed bottom-8 right-8 z-30 transition-all transform duration-300 ${
          showFloatingButton ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="rounded-full h-14 w-14 flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:shadow-xl"
          aria-label="Create new post"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </Button>
      </div>
      
      {/* New Post Modal */}
      <NewPostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default CircleFeed;
