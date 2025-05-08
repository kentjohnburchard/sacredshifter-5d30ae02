import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Export PostType for use in other components
export type PostType = 'Insight' | 'Question' | 'Experience' | 'Meditation' | 'Sound Healing' | 'General';

interface CommunityUser {
  id: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  badges: string[];
  level: number;
  isOnline: boolean;
  lastSeen?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

interface Conversation {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  isOnline: boolean;
}

// Define post and comment interfaces
interface CommentReply {
  id: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
    contributionScore: number;
  };
  content: string;
  createdAt: Date;
}

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
    contributionScore: number;
  };
  content: string;
  createdAt: Date;
  replies: CommentReply[];
}

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
    contributionScore: number;
  };
  content: string;
  createdAt: Date;
  likes: number;
  postType: PostType;
  comments: Comment[];
}

interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  contributionScore: number;
  badges: Array<{ id: string; name: string }>;
  circles: Array<{ id: string; name: string; memberCount: number }>;
}

interface CommunityContextType {
  users: CommunityUser[];
  onlineUsers: CommunityUser[];
  conversations: Conversation[];
  currentChat: {
    user: CommunityUser | null;
    messages: ChatMessage[];
  };
  loading: boolean;
  sendMessage: (recipientId: string, content: string) => Promise<void>;
  startConversation: (userId: string) => void;
  addContact: (userId: string) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  bookmarkContact: (userId: string) => Promise<void>;
  inviteUser: (email: string) => Promise<void>;
  contactSupport: (message: string) => Promise<void>;
  postTypes: string[];
  posts: Post[];
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  addReply: (postId: string, commentId: string, content: string) => void;
  getUserProfile: (userId?: string) => UserProfile | null;
  createNewPost: (content: string, postType: PostType) => void;
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
  const [users, setUsers] = useState<CommunityUser[]>([
    {
      id: '1',
      displayName: 'Sacred Explorer',
      bio: 'Seeking truth through sound and sacred geometry',
      badges: ['Frequency Adept', 'Journey Initiate'],
      level: 3,
      isOnline: true,
    },
    {
      id: '2',
      displayName: 'Cosmic Guide',
      avatarUrl: '/symbols/lotus.svg',
      badges: ['Meditation Master', 'Frequency Healer'],
      level: 5,
      isOnline: true,
    },
    {
      id: '3',
      displayName: 'Light Seeker',
      badges: ['Heart Chakra Aligned', 'Sound Healer'],
      level: 2,
      isOnline: false,
      lastSeen: '2 hours ago'
    }
  ]);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      userId: '2',
      displayName: 'Cosmic Guide',
      avatarUrl: '/symbols/lotus.svg',
      unreadCount: 2,
      lastMessage: 'Have you tried the 528Hz healing frequency?',
      lastMessageTime: '10:30 AM',
      isOnline: true
    },
    {
      userId: '3',
      displayName: 'Light Seeker',
      unreadCount: 0,
      lastMessage: 'The heart chakra journey was transformative!',
      lastMessageTime: 'Yesterday',
      isOnline: false
    }
  ]);

  const [currentChat, setCurrentChat] = useState<{
    user: CommunityUser | null;
    messages: ChatMessage[];
  }>({
    user: null,
    messages: []
  });

  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<CommunityUser[]>([]);
  const [postTypes] = useState<string[]>(['Insight', 'Question', 'Experience', 'Meditation', 'Sound Healing']);

  // Add mock posts data
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        id: '1',
        name: 'Sacred Explorer',
        contributionScore: 85
      },
      content: 'Just experienced the 528Hz healing frequency journey. The cellular restoration was profound!',
      createdAt: new Date(Date.now() - 3600000),
      likes: 12,
      postType: 'Experience',
      comments: [
        {
          id: '101',
          author: {
            id: '2',
            name: 'Cosmic Guide',
            avatarUrl: '/symbols/lotus.svg',
            contributionScore: 245
          },
          content: 'The Solfeggio frequencies are amazing for healing. Have you tried 639Hz for heart chakra opening?',
          createdAt: new Date(Date.now() - 3000000),
          replies: []
        }
      ]
    },
    {
      id: '2',
      author: {
        id: '2',
        name: 'Cosmic Guide',
        avatarUrl: '/symbols/lotus.svg',
        contributionScore: 245
      },
      content: 'Question for the circle: What meditation techniques have helped you connect with your higher self?',
      createdAt: new Date(Date.now() - 86400000),
      likes: 8,
      postType: 'Question',
      comments: []
    }
  ]);

  // Add profile data
  const mockProfiles: Record<string, UserProfile> = {
    'current': {
      id: '1',
      name: 'Sacred Explorer',
      bio: 'Seeking truth through sound and sacred geometry',
      contributionScore: 85,
      badges: [
        { id: '1', name: 'Frequency Adept' },
        { id: '2', name: 'Journey Initiate' }
      ],
      circles: [
        { id: '1', name: 'Sound Healers', memberCount: 24 },
        { id: '2', name: 'Sacred Geometry Explorers', memberCount: 42 }
      ]
    },
    '2': {
      id: '2',
      name: 'Cosmic Guide',
      avatarUrl: '/symbols/lotus.svg',
      bio: 'Guiding others through the cosmic journeys of consciousness',
      contributionScore: 245,
      badges: [
        { id: '3', name: 'Meditation Master' },
        { id: '4', name: 'Frequency Healer' }
      ],
      circles: [
        { id: '1', name: 'Sound Healers', memberCount: 24 },
        { id: '3', name: 'Ascension Guides', memberCount: 18 }
      ]
    }
  };

  // Effect to handle real-time presence
  useEffect(() => {
    // Filter online users
    const online = users.filter(user => user.isOnline);
    setOnlineUsers(online);

    // Setup Supabase real-time presence channel
    const setupRealTimePresence = async () => {
      try {
        // This would be implemented with Supabase Realtime
        // For now, just using the mocked data
        console.log('Setting up real-time presence');
      } catch (error) {
        console.error('Error setting up real-time presence:', error);
      }
    };

    setupRealTimePresence();
  }, [users]);

  const startConversation = (userId: string) => {
    setLoading(true);
    try {
      const user = users.find(u => u.id === userId) || null;
      
      // Mock messages for the demo
      const messages: ChatMessage[] = [
        {
          id: '1',
          senderId: userId,
          recipientId: '1', // Current user
          content: 'Hi there! How is your spiritual journey going?',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          read: true
        },
        {
          id: '2',
          senderId: '1', // Current user
          recipientId: userId,
          content: 'It\'s going well! I\'ve been exploring frequency healing lately.',
          createdAt: new Date(Date.now() - 3500000).toISOString(),
          read: true
        }
      ];
      
      setCurrentChat({
        user,
        messages
      });
      
      // Mark conversation as read
      setConversations(prev => 
        prev.map(conv => conv.userId === userId ? { ...conv, unreadCount: 0 } : conv)
      );
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (recipientId: string, content: string) => {
    setLoading(true);
    try {
      // Create a new message
      const newMessage: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        senderId: '1', // Current user ID
        recipientId,
        content,
        createdAt: new Date().toISOString(),
        read: false
      };
      
      // Add to current chat
      setCurrentChat(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }));
      
      // Update conversation list
      setConversations(prev => {
        const existing = prev.find(c => c.userId === recipientId);
        if (existing) {
          return prev.map(c => 
            c.userId === recipientId 
              ? { ...c, lastMessage: content, lastMessageTime: 'Just now' } 
              : c
          );
        } else {
          const user = users.find(u => u.id === recipientId);
          if (user) {
            return [...prev, {
              userId: recipientId,
              displayName: user.displayName,
              avatarUrl: user.avatarUrl,
              unreadCount: 0,
              lastMessage: content,
              lastMessageTime: 'Just now',
              isOnline: user.isOnline
            }];
          }
          return prev;
        }
      });

      // In a real app, we'd send this to Supabase
      console.log('Message sent:', newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (userId: string) => {
    try {
      console.log('Adding contact:', userId);
      // Implementation would call Supabase to add contact
      // For now, just log
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const blockUser = async (userId: string) => {
    try {
      console.log('Blocking user:', userId);
      // Implementation would call Supabase to block user
      // For now, just log
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const bookmarkContact = async (userId: string) => {
    try {
      console.log('Bookmarking contact:', userId);
      // Implementation would call Supabase to bookmark contact
      // For now, just log
    } catch (error) {
      console.error('Error bookmarking contact:', error);
    }
  };

  const inviteUser = async (email: string) => {
    try {
      console.log('Inviting user:', email);
      // Implementation would call Supabase to send invitation
      // For now, just log
    } catch (error) {
      console.error('Error inviting user:', error);
    }
  };

  const contactSupport = async (message: string) => {
    try {
      console.log('Contacting support:', message);
      // Implementation would send email to contact@sacredshifter.com
      // For now, just log
    } catch (error) {
      console.error('Error contacting support:', error);
    }
  };

  const likePost = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const addComment = (postId: string, content: string) => {
    if (!content.trim()) return;
    
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 11),
      author: {
        id: '1', // Current user
        name: 'Sacred Explorer',
        contributionScore: 85
      },
      content,
      createdAt: new Date(),
      replies: []
    };
    
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, newComment] } 
          : post
      )
    );
  };

  const addReply = (postId: string, commentId: string, content: string) => {
    if (!content.trim()) return;
    
    const newReply: CommentReply = {
      id: Math.random().toString(36).substring(2, 11),
      author: {
        id: '1', // Current user
        name: 'Sacred Explorer',
        contributionScore: 85
      },
      content,
      createdAt: new Date()
    };
    
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? {
              ...post,
              comments: post.comments.map(comment => 
                comment.id === commentId 
                  ? { ...comment, replies: [...comment.replies, newReply] } 
                  : comment
              )
            } 
          : post
      )
    );
  };

  const getUserProfile = (userId?: string) => {
    if (!userId) return mockProfiles['current'];
    return mockProfiles[userId] || null;
  };

  const createNewPost = (content: string, postType: PostType) => {
    if (!content.trim()) return;
    
    const newPost: Post = {
      id: Math.random().toString(36).substring(2, 11),
      author: {
        id: '1', // Current user
        name: 'Sacred Explorer',
        contributionScore: 85
      },
      content,
      createdAt: new Date(),
      likes: 0,
      postType,
      comments: []
    };
    
    setPosts(prev => [newPost, ...prev]);
  };

  const value: CommunityContextType = {
    users,
    onlineUsers,
    conversations,
    currentChat,
    loading,
    sendMessage,
    startConversation,
    addContact,
    blockUser,
    bookmarkContact,
    inviteUser,
    contactSupport,
    postTypes,
    posts,
    likePost,
    addComment,
    addReply,
    getUserProfile,
    createNewPost
  };

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
};
