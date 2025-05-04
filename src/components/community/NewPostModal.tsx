
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useCommunity } from '@/hooks/useCommunity';
import type { PostType } from '@/contexts/CommunityContext';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('General');
  const { createNewPost, postTypes } = useCommunity();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content.trim()) {
      createNewPost(content, postType);
      setContent('');
      setPostType('General');
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="ethereal-card max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center text-glow-purple">Share Your Sacred Wisdom</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Type of Contribution</label>
            <Select value={postType} onValueChange={(value: PostType) => setPostType(value)}>
              <SelectTrigger className="bg-black/30 border-purple-500/30 focus:ring-purple-500/30">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-purple-500/30">
                {postTypes.map(type => (
                  <SelectItem key={type} value={type} className="text-gray-200 focus:bg-purple-700/30 focus:text-white">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Your Message</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your insights, experiences, or questions with the Sacred Circle..."
              className="h-40 bg-black/30 border-purple-500/30 focus:border-purple-500 resize-none"
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-purple-500/30 hover:bg-purple-500/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Share with Circle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewPostModal;
