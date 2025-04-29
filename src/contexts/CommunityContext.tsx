
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface Comment {
  id: string;
  author: Author;
  content: string;
  createdAt: Date;
}

interface Post {
  id: string;
  author: Author;
  content: string;
  createdAt: Date;
  likes: number;
  comments: Comment[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
}

interface Circle {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  badges: Badge[];
  circles: Circle[];
}

interface CommunityContextType {
  posts: Post[];
  loading: boolean;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  getUserProfile: (userId?: string) => UserProfile | null;
}

// Create context
const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

// Sample data for initial state
const samplePosts: Post[] = [
  {
    id: '1',
    author: { id: 'user1', name: 'Sophia Clarity' },
    content: 'Today I connected with the frequency of compassion during my meditation. How has your sacred practice been evolving?',
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    likes: 5,
    comments: [
      {
        id: 'comment1',
        author: { id: 'user2', name: 'Aiden Light' },
        content: 'Beautiful insight, Sophia! My practice has been focused on grounding lately.',
        createdAt: new Date(Date.now() - 1800000) // 30 minutes ago
      }
    ]
  },
  {
    id: '2',
    author: { id: 'user3', name: 'Luna Wisdom' },
    content: 'Just discovered the power of 432 Hz frequency. Has anyone incorporated this into their healing journey?',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    likes: 12,
    comments: []
  }
];

const sampleProfile: UserProfile = {
  id: 'user1',
  name: 'Sophia Clarity',
  bio: 'Seeker of truth and cosmic wisdom. Walking the sacred path of consciousness expansion.',
  badges: [
    { id: 'badge1', name: 'Meditation Guide', description: 'Completed 30-day meditation challenge' },
    { id: 'badge2', name: 'Sacred Geometer', description: 'Created 5 sacred geometry patterns' }
  ],
  circles: [
    { id: 'circle1', name: 'Frequency Healing', description: 'Explore sound healing frequencies', memberCount: 128 },
    { id: 'circle2', name: 'Sacred Geometry', description: 'Divine patterns of creation', memberCount: 92 }
  ]
};

// Provider component
export const CommunityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [loading, setLoading] = useState(false);
  const [profiles] = useState<Record<string, UserProfile>>({
    user1: sampleProfile
  });

  const likePost = useCallback((postId: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  }, []);

  const addComment = useCallback((postId: string, content: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: `comment-${Date.now()}`,
            author: { id: 'user1', name: 'Sophia Clarity' }, // Default to current user
            content,
            createdAt: new Date()
          };
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );
  }, []);

  const getUserProfile = useCallback((userId?: string) => {
    // If no userId provided, return the current user's profile
    const defaultUserId = 'user1'; // Assume current user is user1
    const targetUserId = userId || defaultUserId;
    return profiles[targetUserId] || null;
  }, [profiles]);

  const value = {
    posts,
    loading,
    likePost,
    addComment,
    getUserProfile
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};

// Custom hook
export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};
