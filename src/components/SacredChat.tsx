import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Users, UserPlus, Bookmark, UserMinus, UserCheck, Mail, PhoneCall, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/context/ThemeContext";
import { useCommunity } from "@/contexts/CommunityContext";
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';

const SacredChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'online' | 'support'>('chats');
  const [messageText, setMessageText] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [expanded, setExpanded] = useState(true);
  const { liftTheVeil } = useTheme();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    onlineUsers, 
    conversations, 
    currentChat, 
    sendMessage, 
    startConversation,
    addContact,
    blockUser,
    bookmarkContact,
    inviteUser,
    contactSupport
  } = useCommunity();
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChat.messages]);
  
  const handleOpenChat = () => {
    setIsOpen(true);
  };
  
  const handleCloseChat = () => {
    setIsOpen(false);
  };
  
  const handleSendMessage = () => {
    if (!messageText.trim() || !currentChat.user) return;
    
    sendMessage(currentChat.user.id, messageText);
    setMessageText('');
  };

  const handleSendSupport = () => {
    if (!supportMessage.trim()) return;
    
    contactSupport(supportMessage);
    toast.success("Support message sent to contact@sacredshifter.com");
    setSupportMessage('');
  };

  const handleSendInvite = () => {
    if (!inviteEmail.trim()) return;
    
    inviteUser(inviteEmail);
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddContact = (userId: string) => {
    addContact(userId);
    toast.success("Contact added to your Sacred Circle");
  };

  const handleBlockUser = (userId: string) => {
    blockUser(userId);
    toast.success("User has been blocked");
  };

  const handleBookmarkContact = (userId: string) => {
    bookmarkContact(userId);
    toast.success("Contact bookmarked for easy access");
  };
  
  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Role-based access control check
  const hasAccess = !!user; // In a real app, would check for specific roles

  if (!hasAccess) {
    return null; // Don't render anything if user doesn't have access
  }
  
  return (
    <div className="fixed right-6 bottom-24 z-50">
      {/* Chat Bubble Button with notification */}
      {!isOpen && (
        <div className="relative">
          <Button 
            size="lg" 
            className={`rounded-full shadow-lg p-4 ${
              liftTheVeil 
                ? 'bg-pink-600 hover:bg-pink-700' 
                : 'bg-purple-600 hover:bg-purple-700'
            } transition-all duration-300 hover:scale-105`}
            onClick={handleOpenChat}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Sacred Circle</span>
          </Button>
          {conversations.reduce((total, conv) => total + conv.unreadCount, 0) > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
              {conversations.reduce((total, conv) => total + conv.unreadCount, 0)}
            </div>
          )}
        </div>
      )}
      
      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`max-w-md p-0 overflow-hidden max-h-[80vh] ${
          liftTheVeil ? 'border-pink-500/20' : 'border-purple-500/20'
        }`}>
          <DialogHeader className={`p-4 ${
            liftTheVeil ? 'bg-black/80 border-b border-pink-500/20' : 'bg-black/80 border-b border-purple-500/20'
          }`}>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-white">Sacred Circle</DialogTitle>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setExpanded(!expanded)} 
                  className="text-gray-400 hover:text-white"
                >
                  {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCloseChat} 
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {expanded && (
            <div className="flex flex-col h-[500px]">
              <Tabs defaultValue="chats" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="chats">Conversations</TabsTrigger>
                  <TabsTrigger value="online">Online ({onlineUsers.length})</TabsTrigger>
                  <TabsTrigger value="support">Support</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chats" className="flex-1 overflow-hidden">
                  {!currentChat.user ? (
                    <div className="flex flex-col h-[400px]">
                      <div className="p-4 flex-1 overflow-y-auto bg-black/60">
                        {conversations.length > 0 ? (
                          <div className="space-y-2">
                            {conversations.map((conversation) => (
                              <div 
                                key={conversation.userId}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer"
                                onClick={() => startConversation(conversation.userId)}
                              >
                                <Avatar>
                                  <AvatarImage src={conversation.avatarUrl} />
                                  <AvatarFallback className="bg-gradient-to-br from-purple-600/30 to-indigo-600/30">
                                    {getInitials(conversation.displayName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-white truncate">{conversation.displayName}</p>
                                    <span className="text-xs text-gray-400">{conversation.lastMessageTime}</span>
                                  </div>
                                  <p className="text-xs text-gray-300 truncate">{conversation.lastMessage}</p>
                                </div>
                                {conversation.unreadCount > 0 && (
                                  <Badge className="bg-purple-600">{conversation.unreadCount}</Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <MessageSquare className="h-12 w-12 text-gray-500 mb-2" />
                            <p className="text-gray-300 mb-2">No conversations yet</p>
                            <p className="text-gray-400 text-sm">Start by connecting with others in the Sacred Circle</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-[400px]">
                      {/* Chat header */}
                      <div className="p-3 border-b border-gray-800 bg-black/70 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost"
                            size="icon"
                            onClick={() => startConversation("")}
                            className="text-gray-400 hover:text-white"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={currentChat.user.avatarUrl} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-600/30 to-indigo-600/30">
                              {getInitials(currentChat.user.displayName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-white">{currentChat.user.displayName}</p>
                            <div className="flex items-center">
                              <span className={`inline-block h-2 w-2 rounded-full mr-1 ${currentChat.user.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                              <span className="text-xs text-gray-400">{currentChat.user.isOnline ? 'Online' : 'Offline'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleAddContact(currentChat.user!.id)} 
                            title="Add Friend"
                            className="text-gray-400 hover:text-white"
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleBookmarkContact(currentChat.user!.id)} 
                            title="Bookmark"
                            className="text-gray-400 hover:text-white"
                          >
                            <Bookmark className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleBlockUser(currentChat.user!.id)} 
                            title="Block"
                            className="text-gray-400 hover:text-white"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Chat messages */}
                      <div className="flex-1 overflow-y-auto p-4 bg-black/60">
                        <div className="space-y-3">
                          {currentChat.messages.map((message) => {
                            const isSelf = message.senderId === '1'; // Assuming current user id is '1'
                            return (
                              <div 
                                key={message.id} 
                                className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
                              >
                                {!isSelf && (
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={currentChat.user?.avatarUrl} />
                                    <AvatarFallback className="bg-gradient-to-br from-purple-600/30 to-indigo-600/30">
                                      {getInitials(currentChat.user?.displayName)}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div className={`max-w-[70%] p-3 rounded-lg ${
                                  isSelf 
                                    ? (liftTheVeil ? 'bg-pink-700/60' : 'bg-purple-700/60')  
                                    : 'bg-gray-800/60'
                                }`}>
                                  <p className="text-sm text-white">{message.content}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(message.createdAt).toLocaleTimeString([], {
                                      hour: '2-digit', 
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>
                      
                      {/* Message input */}
                      <div className="p-3 border-t border-gray-800 bg-black/80">
                        <div className="flex space-x-2">
                          <Textarea
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="min-h-[60px] resize-none bg-gray-900 border-gray-700"
                          />
                          <Button 
                            onClick={handleSendMessage}
                            className={liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}
                            disabled={!messageText.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="online" className="flex-1 overflow-hidden">
                  <div className="flex flex-col h-[400px]">
                    <div className="p-4 flex-1 overflow-y-auto bg-black/60">
                      {onlineUsers.length > 0 ? (
                        <div className="space-y-2">
                          {onlineUsers.map((user) => (
                            <div 
                              key={user.id}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer"
                              onClick={() => startConversation(user.id)}
                            >
                              <Avatar>
                                <AvatarImage src={user.avatarUrl} />
                                <AvatarFallback className="bg-gradient-to-br from-purple-600/30 to-indigo-600/30">
                                  {getInitials(user.displayName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-white">{user.displayName}</p>
                                  <div className="ml-2 flex">
                                    {user.badges.slice(0, 1).map((badge, i) => (
                                      <Badge key={i} variant="outline" className="ml-1 text-xs bg-purple-900/50">
                                        {badge}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                                  <span className="text-xs text-green-400">Online</span>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-gray-400 hover:text-white" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddContact(user.id);
                                }}
                                title="Add Friend"
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <Users className="h-12 w-12 text-gray-500 mb-2" />
                          <p className="text-gray-300 mb-2">No users online</p>
                          <p className="text-gray-400 text-sm">Check back later or invite friends</p>
                        </div>
                      )}
                    </div>

                    {/* Invite section */}
                    <div className="p-3 border-t border-gray-800 bg-black/80">
                      <p className="text-sm text-gray-300 mb-2">Invite someone to Sacred Circle</p>
                      <div className="flex space-x-2">
                        <Input
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="Enter email address"
                          className="bg-gray-900 border-gray-700"
                        />
                        <Button 
                          onClick={handleSendInvite}
                          className={liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}
                          disabled={!inviteEmail.trim()}
                        >
                          Invite
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="support" className="flex-1 overflow-hidden">
                  <div className="flex flex-col h-[400px]">
                    <div className="p-4 flex-1 overflow-y-auto bg-black/60">
                      <div className="flex flex-col items-center text-center mb-6 p-4">
                        <div className="mb-4 p-3 rounded-full bg-purple-900/30">
                          <Mail className="h-8 w-8 text-purple-300" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Support</h3>
                        <p className="text-gray-300 text-sm mb-4">
                          Contact the Sacred Shifter team for support with your spiritual journey
                        </p>
                        <div className="w-full flex justify-center space-x-4 mb-6">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center space-x-1 border-purple-500/30"
                            onClick={() => window.location.href = 'mailto:contact@sacredshifter.com'}
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            <span>Email</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center space-x-1 border-purple-500/30"
                          >
                            <PhoneCall className="h-4 w-4 mr-1" />
                            <span>Call</span>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/30 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-medium text-gray-200 mb-1">Send a message</h4>
                        <p className="text-xs text-gray-400 mb-3">
                          The Sacred Shifter team will respond to your message within 24 hours
                        </p>
                        <Textarea
                          value={supportMessage}
                          onChange={(e) => setSupportMessage(e.target.value)}
                          placeholder="Describe your question or issue..."
                          className="min-h-[100px] resize-none bg-gray-900 border-gray-700 mb-3"
                        />
                        <Button 
                          onClick={handleSendSupport}
                          className={`w-full ${liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                          disabled={!supportMessage.trim()}
                        >
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SacredChat;
