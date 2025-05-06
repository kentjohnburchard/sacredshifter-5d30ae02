
import React from 'react';
import { JourneyPrompt } from '@/context/JourneyContext';
import { X, Check, Bookmark } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ModalPromptProps {
  prompt: JourneyPrompt;
  onDismiss: () => void;
  onComplete: () => void;
  onSave: () => void;
}

const ModalPrompt: React.FC<ModalPromptProps> = ({ 
  prompt, 
  onDismiss, 
  onComplete, 
  onSave 
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
      <div className="bg-gradient-to-br from-purple-950 to-indigo-950 border border-purple-500/30 shadow-xl rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-purple-100">
            {prompt.journey_id.replace('journey_', '').replace(/_/g, ' ')}
          </h3>
          <button 
            onClick={onDismiss}
            className="text-gray-400 hover:text-white rounded-full bg-purple-900/50 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="prose prose-invert max-w-none my-4">
          <ReactMarkdown>{prompt.content}</ReactMarkdown>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onSave}
            className="flex items-center gap-2 text-sm text-purple-200 hover:text-white bg-purple-800/50 hover:bg-purple-700/50 rounded-md px-3 py-2"
          >
            <Bookmark className="h-4 w-4" />
            Save for Later
          </button>
          <button 
            onClick={onComplete}
            className="flex items-center gap-2 text-sm text-emerald-200 hover:text-white bg-emerald-800/50 hover:bg-emerald-700/50 rounded-md px-3 py-2"
          >
            <Check className="h-4 w-4" />
            Continue Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPrompt;
