
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useCommunity } from '@/hooks/useCommunity';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';

interface CommentProps {
  postId: string;
  comment: {
    id: string;
    author: {
      id: string;
      name: string;
      avatarUrl?: string;
      contributionScore: number;
    };
    content: string;
    createdAt: Date;
    replies: Array<{
      id: string;
      author: {
        id: string;
        name: string;
        avatarUrl?: string;
        contributionScore: number;
      };
      content: string;
      createdAt: Date;
    }>;
  };
}

const CircleComment: React.FC<CommentProps> = ({ postId, comment }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const { addReply } = useCommunity();
  
  const handleAddReply = () => {
    if (replyContent.trim()) {
      addReply(postId, comment.id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };
  
  // Get appropriate color based on contribution score
  const getContributionColor = (score: number) => {
    if (score >= 200) return 'text-amber-400 border-amber-500/40';
    if (score >= 100) return 'text-blue-400 border-blue-500/40';
    return 'text-purple-400 border-purple-500/40';
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <div className="flex-shrink-0">
          <Avatar className="h-6 w-6 mt-1">
            <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
            <AvatarFallback className="bg-purple-900 text-purple-100 text-xs">
              {comment.author.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <div className="bg-black/30 rounded-lg p-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-glow-purple">{comment.author.name}</span>
              <div className={`text-xs px-1.5 py-0.5 border rounded-full ${getContributionColor(comment.author.contributionScore)}`}>
                ✦ {comment.author.contributionScore}
              </div>
            </div>
            <span className="mt-1 block">{comment.content}</span>
          </div>
          <div className="flex items-center ml-2 mt-1 space-x-4">
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </p>
            <button 
              onClick={() => setShowReplyForm(!showReplyForm)} 
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center space-x-1"
            >
              <MessageSquare className="h-3 w-3" />
              <span>Reply</span>
            </button>
          </div>
          
          {/* Nested Replies */}
          {comment.replies.length > 0 && (
            <div className="ml-6 mt-2 space-y-2 pl-2 border-l-2 border-purple-500/20">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex space-x-2">
                  <div className="flex-shrink-0">
                    <Avatar className="h-5 w-5 mt-1">
                      <AvatarImage src={reply.author.avatarUrl} alt={reply.author.name} />
                      <AvatarFallback className="bg-purple-900 text-purple-100 text-xs">
                        {reply.author.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <div className="bg-black/20 rounded-lg p-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-glow-purple">{reply.author.name}</span>
                        <div className={`text-xs px-1 py-0 border rounded-full ${getContributionColor(reply.author.contributionScore)}`}>
                          ✦ {reply.author.contributionScore}
                        </div>
                      </div>
                      <span className="mt-1 block">{reply.content}</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-2 mt-0.5">
                      {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-2">
              <Textarea
                className="w-full bg-black/20 border-white/10 text-sm resize-none"
                rows={1}
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="flex justify-end mt-1 space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowReplyForm(false)}
                  className="text-xs h-7 px-2"
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleAddReply} 
                  className="bg-purple-600/80 hover:bg-purple-600 text-xs h-7 px-2"
                >
                  Reply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CircleComment;
