
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface CommentProps {
  comment: {
    id: string;
    author: {
      id: string;
      name: string;
      avatarUrl?: string;
    };
    content: string;
    createdAt: Date;
  };
}

const CircleComment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div className="flex space-x-2">
      <Avatar className="h-6 w-6 mt-1">
        <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
        <AvatarFallback className="bg-purple-900 text-purple-100 text-xs">
          {comment.author.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-black/30 rounded-lg p-2 text-sm">
          <span className="font-medium text-glow-purple mr-2">{comment.author.name}</span>
          <span>{comment.content}</span>
        </div>
        <p className="text-xs text-muted-foreground ml-2 mt-1">
          {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default CircleComment;
