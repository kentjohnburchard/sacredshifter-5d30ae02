
import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const SacredChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to Sacred Chat. How may I assist you on your journey today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [messageText, setMessageText] = useState('');
  const { liftTheVeil } = useTheme();
  
  const handleOpenChat = () => {
    setIsOpen(true);
  };
  
  const handleCloseChat = () => {
    setIsOpen(false);
  };
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessageText('');
    
    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: "Thank you for reaching out. The Sacred Circle is a space of connection and transformation. How can I support you in your journey today?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <>
      {/* Chat Bubble Button */}
      <div className="fixed right-6 bottom-24 z-50">
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
          <span className="sr-only">Sacred Chat</span>
        </Button>
      </div>
      
      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`max-w-md p-0 overflow-hidden max-h-[80vh] ${
          liftTheVeil ? 'border-pink-500/20' : 'border-purple-500/20'
        }`}>
          <DialogHeader className={`p-4 ${
            liftTheVeil ? 'bg-black/80 border-b border-pink-500/20' : 'bg-black/80 border-b border-purple-500/20'
          }`}>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-white">Sacred Circle Chat</DialogTitle>
              <Button variant="ghost" size="icon" onClick={handleCloseChat} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex flex-col h-[50vh]">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-black/60">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser 
                        ? (liftTheVeil ? 'bg-pink-700/60' : 'bg-purple-700/60') 
                        : 'bg-gray-800/60'
                    }`}>
                      <p className="text-sm text-white">{message.text}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Message Input */}
            <div className={`p-4 border-t ${
              liftTheVeil ? 'border-pink-500/20 bg-black/80' : 'border-purple-500/20 bg-black/80'
            }`}>
              <div className="flex space-x-2">
                <Textarea 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="min-h-[60px] resize-none bg-gray-900 border-gray-700 focus:border-purple-500"
                />
                <Button 
                  onClick={handleSendMessage}
                  className={liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SacredChat;
