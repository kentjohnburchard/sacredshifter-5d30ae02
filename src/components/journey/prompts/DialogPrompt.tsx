
import React from 'react';
import { JourneyPrompt } from '@/types/journey';
import { X, Check, Bookmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

interface DialogPromptProps {
  prompt: JourneyPrompt;
  onDismiss: () => void;
  onComplete: () => void;
  onSave: () => void;
}

const DialogPrompt: React.FC<DialogPromptProps> = ({ 
  prompt, 
  onDismiss, 
  onComplete, 
  onSave 
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5">
      <Card className="w-80 bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-sm border border-purple-500/30 shadow-xl">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-purple-200">
              {prompt.journey_id.replace('journey_', '').replace(/_/g, ' ').toUpperCase()}
            </h3>
            <button 
              onClick={onDismiss}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="prose prose-sm prose-invert max-w-none my-2">
            <ReactMarkdown>{prompt.content}</ReactMarkdown>
          </div>
          
          <div className="flex justify-end gap-2 mt-3">
            <button 
              onClick={onSave}
              className="flex items-center gap-1 text-xs text-purple-200 hover:text-white bg-purple-800/50 hover:bg-purple-700/50 rounded-md px-2 py-1.5"
            >
              <Bookmark className="h-3.5 w-3.5" />
              Save
            </button>
            <button 
              onClick={onComplete}
              className="flex items-center gap-1 text-xs text-emerald-200 hover:text-white bg-emerald-800/50 hover:bg-emerald-700/50 rounded-md px-2 py-1.5"
            >
              <Check className="h-3.5 w-3.5" />
              Got it
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DialogPrompt;
