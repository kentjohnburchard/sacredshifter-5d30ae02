import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CommunityPost {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
}

interface CommunityProfile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  badges: string[];
  level: number;
}

interface CommunityContextType {
  posts: CommunityPost[];
  userProfile: CommunityProfile | null;
  loading: boolean;
  createPost: (content: string) => Promise<void>;
  getUserProfile: () => CommunityProfile | null;
  postTypes: string[];
  likePost: (postId: string) => void;
  addComment: (postId: string, comment: string) => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

interface CommunityProviderProps {
  children: ReactNode;
}

export const CommunityProvider: React.FC<CommunityProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      userId: '1',
      content: 'Just completed a powerful meditation session with the 528Hz frequency. Feeling absolutely harmonized!',
      createdAt: '2023-08-01T12:34:56Z',
      likes: 12,
      comments: 3,
    },
    {
      id: '2',
      userId: '2',
      content: "Has anyone tried the heart chakra activation journey? I'm experiencing some profound shifts after my session yesterday.",
      createdAt: '2023-08-02T10:22:33Z',
      likes: 8,
      comments: 5,
    },
  ]);

  const [userProfile, setUserProfile] = useState<CommunityProfile | null>({
    id: '1',
    userId: '1',
    displayName: 'Sacred Explorer',
    bio: 'Seeking truth through sound and sacred geometry',
    badges: ['Frequency Adept', 'Journey Initiate'],
    level: 3,
  });

  const [loading, setLoading] = useState(false);
  const [postTypes] = useState<string[]>(['Insight', 'Question', 'Experience', 'Meditation', 'Sound Healing']);

  const createPost = async (content: string) => {
    setLoading(true);
    try {
      const newPost: CommunityPost = {
        id: Math.random().toString(36).substring(2, 9),
        userId: '1',
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
      };
      setPosts([newPost, ...posts]);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserProfile = () => userProfile;

  const likePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const addComment = (postId: string, comment: string) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, comments: post.comments + 1 } : post
    ));
  };

  const value: CommunityContextType = {
    posts,
    userProfile,
    loading,
    createPost,
    getUserProfile,
    postTypes,
    likePost,
    addComment,
  };

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
};
