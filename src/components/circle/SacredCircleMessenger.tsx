import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, ChevronDown, ChevronUp, User, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getChakraColor } from '@/types/chakras';
import { useLightbearerProgress } from '@/hooks/useLightbearerProgress';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  created_at: string;
  read: boolean;
  sender?: {
    display_name?: string;
    avatar_url?: string;
    light_level?: number;
  };
}

interface Contact {
  id: string;
  display_name?: string;
  avatar_url?: string;
  light_level?: number;
  online?: boolean;
  last_seen?: string;
  unread_count?: number;
}

const SacredCircleMessenger: React.FC = () => {
  const { user } = useAuth();
  const { stats } = useLightbearerProgress();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Divine Support contact
  const divineSupport: Contact = {
    id: 'divine-support',
    display_name: 'Divine Support',
    avatar_url: '/symbols/lotus.svg',
    light_level: 12,
    online: true
  };

  // Initial setup
  useEffect(() => {
    if (user) {
      fetchContacts();
      // Always add divine support
      setContacts(prevContacts => {
        if (!prevContacts.find(c => c.id === divineSupport.id)) {
          return [...prevContacts, divineSupport];
        }
        return prevContacts;
      });
    }
  }, [user]);

  // Fetch contacts from profiles
  const fetchContacts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // In a real app, this would fetch user's contacts
      // For now, we'll add some sample contacts
      setContacts([
        {
          id: 'user-1',
          display_name: 'Sophia Light',
          avatar_url: '',
          light_level: 5,
          online: true,
          unread_count: 2
        },
        {
          id: 'user-2',
          display_name: 'Marcus Aurelius',
          avatar_url: '',
          light_level: 7,
          online: false,
          last_seen: '2 hours ago'
        },
        divineSupport
      ]);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for the active contact
  useEffect(() => {
    if (user && activeContact) {
      fetchMessages();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('sacred-messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `recipient_id=eq.${user.id}`
          },
          (payload) => {
            const newMessage = payload.new as Message;
            if (newMessage.sender_id === activeContact.id) {
              setMessages(prev => [...prev, newMessage]);
              scrollToBottom();
            } else {
              // Update unread count for other contacts
              updateUnreadCount(newMessage.sender_id);
            }
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, activeContact]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!user || !activeContact) return;
    
    // For demo, generate sample messages based on contact
    const sampleMessages = generateSampleMessages();
    setMessages(sampleMessages);
    scrollToBottom();
  };

  const generateSampleMessages = () => {
    if (!user || !activeContact) return [];
    
    // Sample messages for demo purposes
    if (activeContact.id === 'divine-support') {
      return [
        {
          id: '1',
          sender_id: 'divine-support',
          recipient_id: user.id,
          message: 'Welcome to Sacred Shifter! How can we assist your spiritual journey today?',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          read: true,
          sender: {
            display_name: 'Divine Support',
            avatar_url: '/symbols/lotus.svg',
            light_level: 12
          }
        }
      ];
    }
    
    return [
      {
        id: '1',
        sender_id: activeContact.id,
        recipient_id: user.id,
        message: `I found the Harmonic Consciousness journey truly transformative. Have you tried it?`,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        read: true,
        sender: {
          display_name: activeContact.display_name,
          avatar_url: activeContact.avatar_url,
          light_level: activeContact.light_level
        }
      },
      {
        id: '2',
        sender_id: user.id,
        recipient_id: activeContact.id,
        message: "Not yet! I've been focused on the Heart chakra alignments lately.",
        created_at: new Date(Date.now() - 3500000).toISOString(),
        read: true
      }
    ];
  };

  const updateUnreadCount = (senderId: string) => {
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === senderId
          ? { ...contact, unread_count: (contact.unread_count || 0) + 1 }
          : contact
      )
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !activeContact) return;
    
    const message: Omit<Message, 'id'> = {
      sender_id: user.id,
      recipient_id: activeContact.id,
      message: newMessage,
      created_at: new Date().toISOString(),
      read: false
    };

    // For the demo, we'll just add it to the local state
    setMessages([...messages, { ...message, id: Date.now().toString() }]);
    setNewMessage('');
    scrollToBottom();
    
    // In a real app, we'd save to Supabase:
    // const { error } = await supabase.from('messages').insert(message);
  };

  const handleContactClick = (contact: Contact) => {
    setActiveContact(contact);
    // Mark messages as read
    setContacts(prevContacts => 
      prevContacts.map(c => 
        c.id === contact.id ? { ...c, unread_count: 0 } : c
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full shadow-lg hover:shadow-xl"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {contacts.reduce((sum, contact) => sum + (contact.unread_count || 0), 0) > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {contacts.reduce((sum, contact) => sum + (contact.unread_count || 0), 0)}
            </span>
          )}
        </motion.button>
      )}

      {/* Messenger panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 500 }}
            animate={{ opacity: 1, y: 0, height: isExpanded ? 500 : 60 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-gray-900/95 backdrop-blur-md border border-purple-500/30 rounded-lg shadow-2xl overflow-hidden flex flex-col"
            style={{ width: '330px' }}
          >
            {/* Header */}
            <div className="p-3 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-purple-900/50 to-indigo-900/50">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-purple-300" />
                <h3 className="font-medium text-white">Sacred Circle</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 hover:bg-gray-700/50 rounded"
                >
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-700/50 rounded"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Expanded content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-1 overflow-hidden"
                >
                  {!activeContact ? (
                    <div className="w-full p-2 overflow-auto">
                      <div className="mb-2 px-2">
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Connections</h4>
                      </div>
                      <div className="space-y-1">
                        {contacts.map((contact) => (
                          <div
                            key={contact.id}
                            onClick={() => handleContactClick(contact)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-800/50 rounded-md cursor-pointer transition-colors"
                          >
                            <div className="relative">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={contact.avatar_url} alt={contact.display_name} />
                                <AvatarFallback className="bg-gradient-to-br from-purple-600/30 to-indigo-600/30">
                                  {getInitials(contact.display_name)}
                                </AvatarFallback>
                              </Avatar>
                              {contact.online && (
                                <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-400 rounded-full border border-gray-900"></span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-200">{contact.display_name}</span>
                                {contact.unread_count ? (
                                  <Badge variant="outline" className="bg-purple-600/80 border-none text-white text-xs">
                                    {contact.unread_count}
                                  </Badge>
                                ) : null}
                              </div>
                              <div className="flex items-center">
                                {contact.light_level && (
                                  <span className="text-xs text-gray-400 flex items-center">
                                    <Star className="h-3 w-3 text-yellow-400 mr-1" />
                                    Level {contact.light_level}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col w-full">
                      {/* Active chat header */}
                      <div className="p-2 border-b border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveContact(null)}
                            className="p-1 hover:bg-gray-700/50 rounded"
                          >
                            <ChevronDown size={16} />
                          </button>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={activeContact.avatar_url} alt={activeContact.display_name} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-600/30 to-indigo-600/30">
                              {getInitials(activeContact.display_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-sm font-medium text-gray-200">{activeContact.display_name}</span>
                            <div className="flex items-center">
                              {activeContact.online ? (
                                <span className="text-xs text-green-400">Online</span>
                              ) : (
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" /> {activeContact.last_seen || 'Offline'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Messages */}
                      <div className="flex-1 overflow-auto p-3 space-y-3">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            {message.sender_id !== user?.id && (
                              <Avatar className="h-6 w-6 mr-2 mt-1">
                                <AvatarImage src={message.sender?.avatar_url} />
                                <AvatarFallback className="bg-gradient-to-br from-purple-600/30 to-indigo-600/30 text-xs">
                                  {getInitials(message.sender?.display_name)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`max-w-[80%] px-3 py-2 rounded-lg ${
                                message.sender_id === user?.id
                                  ? 'bg-purple-600/30 text-white'
                                  : 'bg-gray-800/80 text-gray-200'
                              }`}
                            >
                              <p className="text-sm">{message.message}</p>
                              <span className="text-[10px] text-gray-400 mt-1 block text-right">
                                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                      
                      {/* Input area */}
                      <div className="p-3 border-t border-gray-800 flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Type a message..."
                          className="bg-gray-800/50 border-gray-700 text-white"
                        />
                        <Button
                          size="icon"
                          onClick={handleSendMessage}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Send size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SacredCircleMessenger;
