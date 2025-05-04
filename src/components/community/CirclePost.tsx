
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import CircleComment from './CircleComment';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, Star } from 'lucide-react';
import { useCommunity } from '@/hooks/useCommunity';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface PostProps {
  post: {
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
    postType: string;
    comments: Array<{
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
    }>;
  };
}

const CirclePost: React.FC<PostProps> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { likePost, addComment } = useCommunity();

  const toggleComments = () => {
    setShowComments(!showComments);
  };
  
  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(post.id, newComment);
      setNewComment('');
    }
  };
  
  // Get appropriate color based on contribution score
  const getContributionColor = (score: number) => {
    if (score >= 200) return 'text-amber-400 border-amber-500/40';
    if (score >= 100) return 'text-blue-400 border-blue-500/40';
    return 'text-purple-400 border-purple-500/40';
  };
  
  const contributionClass = getContributionColor(post.author.contributionScore);

  return (
    <Card className="w-full ethereal-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9 border-2 border-purple-500/30">
              <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
              <AvatarFallback className="bg-purple-900 text-purple-100">
                {post.author.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-glow-purple">{post.author.name}</h3>
                <div className={`text-xs px-2 py-0.5 border rounded-full ${contributionClass}`}>
                  ✦ {post.author.contributionScore}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(post.createdAt, { addSuffix: true })}
              </p>
            </div>
          </div>
          
          <Badge variant="outline" className="bg-purple-900/20 text-xs">
            {post.postType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="py-3">
        <p className="whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between border-t border-white/10">
        <div className="flex items-center space-x-4">
          <button 
            className="flex items-center space-x-1 text-sm hover:text-purple-300 transition"
            onClick={() => likePost(post.id)}
          >
            <Heart className="h-4 w-4" />
            <span>{post.likes}</span>
          </button>
          <button
            className="flex items-center space-x-1 text-sm hover:text-purple-300 transition"
            onClick={toggleComments}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments.length}</span>
          </button>
        </div>
        <div>
          <button className="text-sm text-purple-400 hover:text-purple-300 transition">
            <Star className="h-4 w-4" />
          </button>
        </div>
      </CardFooter>
      
      {showComments && (
        <div className="px-6 pb-4 pt-1 border-t border-white/10">
          <div className="space-y-3 mt-2">
            {post.comments.map((comment) => (
              <CircleComment key={comment.id} postId={post.id} comment={comment} />
            ))}
          </div>
          <div className="mt-3">
            <Textarea 
              className="w-full bg-black/30 border-white/10 resize-none text-sm"
              rows={2}
              placeholder="Share your insights..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <Button 
                className="btn-primary standard-mode text-sm py-1 px-3"
                onClick={handleAddComment}
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CirclePost;
