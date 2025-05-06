
import React, { useEffect } from 'react';
import { useJourney } from '@/context/JourneyContext';
import { useLocation } from 'react-router-dom';
import DialogPrompt from './prompts/DialogPrompt';
import TooltipPrompt from './prompts/TooltipPrompt';
import ModalPrompt from './prompts/ModalPrompt';

/**
 * PromptManager is responsible for displaying the right prompts at the right time
 * It should be mounted high in the component tree (e.g., in the App.tsx or layout)
 */
const PromptManager = () => {
  const { 
    activeJourney,
    activePrompts,
    fetchPromptsForLocation,
    dismissPrompt,
    completePrompt,
    savePrompt
  } = useJourney();
  
  const location = useLocation();
  
  // Fetch prompts when location changes
  useEffect(() => {
    if (activeJourney) {
      fetchPromptsForLocation(location.pathname);
    }
  }, [location.pathname, activeJourney, fetchPromptsForLocation]);
  
  // If no active journey or no prompts, don't render anything
  if (!activeJourney || activePrompts.length === 0) {
    return null;
  }
  
  return (
    <>
      {activePrompts.map(prompt => {
        switch (prompt.display_type) {
          case 'dialog':
            return (
              <DialogPrompt
                key={prompt.id}
                prompt={prompt}
                onDismiss={() => dismissPrompt(prompt.id)}
                onComplete={() => completePrompt(prompt.id)}
                onSave={() => savePrompt(prompt.id)}
              />
            );
          case 'tooltip':
            return (
              <TooltipPrompt
                key={prompt.id}
                prompt={prompt}
                onDismiss={() => dismissPrompt(prompt.id)}
                onComplete={() => completePrompt(prompt.id)}
                onSave={() => savePrompt(prompt.id)}
              />
            );
          case 'modal':
            return (
              <ModalPrompt
                key={prompt.id}
                prompt={prompt}
                onDismiss={() => dismissPrompt(prompt.id)}
                onComplete={() => completePrompt(prompt.id)}
                onSave={() => savePrompt(prompt.id)}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default PromptManager;
