
import React from 'react';
import { JourneyPrompt } from '@/context/JourneyContext';
import { X, Check, Bookmark } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface TooltipPromptProps {
  prompt: JourneyPrompt;
  onDismiss: () => void;
  onComplete: () => void;
  onSave: () => void; 
}

const TooltipPrompt: React.FC<TooltipPromptProps> = ({ 
  prompt, 
  onDismiss, 
  onComplete,
  onSave
}) => {
  return (
    <div className="absolute z-50 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-black/90 backdrop-blur-sm border border-purple-500/30 shadow-xl rounded-md p-3 max-w-xs">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-xs font-medium text-purple-200">
            Journey Hint
          </h3>
          <button 
            onClick={onDismiss}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        
        <div className="prose prose-xs prose-invert max-w-none my-1">
          <ReactMarkdown>{prompt.content}</ReactMarkdown>
        </div>
        
        <div className="flex justify-end mt-2 gap-2">
          <button 
            onClick={onSave}
            className="flex items-center gap-1 text-xs text-purple-200 hover:text-white bg-purple-800/40 hover:bg-purple-700/40 rounded px-1.5 py-0.5"
          >
            <Bookmark className="h-3 w-3" />
            Save
          </button>
          <button 
            onClick={onComplete}
            className="flex items-center gap-1 text-xs text-emerald-200 hover:text-white bg-emerald-800/40 hover:bg-emerald-700/40 rounded px-1.5 py-0.5"
          >
            <Check className="h-3 w-3" />
            Got it
          </button>
        </div>
      </div>
      <div className="w-3 h-3 bg-black/90 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1.5 border-r border-b border-purple-500/30"></div>
    </div>
  );
};

export default TooltipPrompt;
