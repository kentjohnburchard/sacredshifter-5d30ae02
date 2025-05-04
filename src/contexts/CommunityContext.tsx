
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
  contributionScore: number; // Added contribution score
}

interface Reply {
  id: string;
  author: Author;
  content: string;
  createdAt: Date;
}

interface Comment {
  id: string;
  author: Author;
  content: string;
  createdAt: Date;
  replies: Reply[]; // Added support for nested replies
}

export type PostType = 'Insight' | 'Dream Log' | 'Frequency Share' | 'Ritual Reflection' | 'General';

interface Post {
  id: string;
  author: Author;
  content: string;
  createdAt: Date;
  likes: number;
  comments: Comment[];
  postType: PostType; // Added post type
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
  contributionScore: number; // Added contribution score
  badges: Badge[];
  circles: Circle[];
}

interface CommunityContextType {
  posts: Post[];
  loading: boolean;
  postTypes: PostType[];
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  addReply: (postId: string, commentId: string, content: string) => void;
  getUserProfile: (userId?: string) => UserProfile | null;
  createNewPost: (content: string, postType: PostType) => void;
}

// Create context
const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

// Sample data for initial state
const samplePosts: Post[] = [
  {
    id: '1',
    author: { 
      id: 'user1', 
      name: 'Sophia Clarity',
      contributionScore: 128 // Added contribution score
    },
    content: 'Today I connected with the frequency of compassion during my meditation. How has your sacred practice been evolving?',
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    likes: 5,
    postType: 'Ritual Reflection', // Added post type
    comments: [
      {
        id: 'comment1',
        author: { 
          id: 'user2', 
          name: 'Aiden Light',
          contributionScore: 95 // Added contribution score
        },
        content: 'Beautiful insight, Sophia! My practice has been focused on grounding lately.',
        createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
        replies: [
          {
            id: 'reply1',
            author: { 
              id: 'user1', 
              name: 'Sophia Clarity',
              contributionScore: 128 // Added contribution score
            },
            content: 'Grounding is so important. Have you tried working with 7.83Hz Earth frequency?',
            createdAt: new Date(Date.now() - 1600000), // 26 minutes ago
          }
        ]
      }
    ]
  },
  {
    id: '2',
    author: { 
      id: 'user3', 
      name: 'Luna Wisdom',
      contributionScore: 215 // Added contribution score
    },
    content: 'Just discovered the power of 432 Hz frequency. Has anyone incorporated this into their healing journey?',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    likes: 12,
    postType: 'Frequency Share', // Added post type
    comments: []
  }
];

const sampleProfile: UserProfile = {
  id: 'user1',
  name: 'Sophia Clarity',
  bio: 'Seeker of truth and cosmic wisdom. Walking the sacred path of consciousness expansion.',
  contributionScore: 128, // Added contribution score
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
  
  const postTypes: PostType[] = ['Insight', 'Dream Log', 'Frequency Share', 'Ritual Reflection', 'General'];

  const likePost = useCallback((postId: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
    
    // Increase contribution score for post author
    const post = posts.find(p => p.id === postId);
    if (post) {
      profiles[post.author.id] = {
        ...profiles[post.author.id],
        contributionScore: (profiles[post.author.id]?.contributionScore || 0) + 1
      };
    }
  }, [posts, profiles]);

  const addComment = useCallback((postId: string, content: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: `comment-${Date.now()}`,
            author: { 
              id: 'user1', 
              name: 'Sophia Clarity', 
              contributionScore: profiles['user1']?.contributionScore || 0 
            }, // Default to current user
            content,
            createdAt: new Date(),
            replies: []
          };
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );
    
    // Increase contribution score for commenting
    profiles['user1'] = {
      ...profiles['user1'],
      contributionScore: (profiles['user1']?.contributionScore || 0) + 3
    };
  }, [profiles]);

  const addReply = useCallback((postId: string, commentId: string, content: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === postId) {
          const updatedComments = post.comments.map(comment => {
            if (comment.id === commentId) {
              const newReply: Reply = {
                id: `reply-${Date.now()}`,
                author: { 
                  id: 'user1', 
                  name: 'Sophia Clarity',
                  contributionScore: profiles['user1']?.contributionScore || 0 
                },
                content,
                createdAt: new Date()
              };
              return { ...comment, replies: [...comment.replies, newReply] };
            }
            return comment;
          });
          return { ...post, comments: updatedComments };
        }
        return post;
      })
    );
    
    // Increase contribution score for replying
    profiles['user1'] = {
      ...profiles['user1'],
      contributionScore: (profiles['user1']?.contributionScore || 0) + 2
    };
  }, [profiles]);

  const getUserProfile = useCallback((userId?: string) => {
    // If no userId provided, return the current user's profile
    const defaultUserId = 'user1'; // Assume current user is user1
    const targetUserId = userId || defaultUserId;
    return profiles[targetUserId] || null;
  }, [profiles]);

  const createNewPost = useCallback((content: string, postType: PostType) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: { 
        id: 'user1', 
        name: 'Sophia Clarity',
        contributionScore: profiles['user1']?.contributionScore || 0 
      },
      content,
      createdAt: new Date(),
      likes: 0,
      postType,
      comments: []
    };
    
    setPosts(currentPosts => [newPost, ...currentPosts]);
    
    // Increase contribution score for creating a post
    profiles['user1'] = {
      ...profiles['user1'],
      contributionScore: (profiles['user1']?.contributionScore || 0) + 5
    };
  }, [profiles]);

  const value = {
    posts,
    loading,
    postTypes,
    likePost,
    addComment,
    addReply,
    getUserProfile,
    createNewPost
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
