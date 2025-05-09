
import React from 'react';
import { useParams } from 'react-router-dom';
import JourneyExperiencePlayer from '@/components/journey/JourneyExperiencePlayer';
import { JourneyProvider } from '@/context/JourneyContext';

const JourneyExperiencePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  return (
    <JourneyProvider>
      <JourneyExperiencePlayer />
    </JourneyProvider>
  );
};

export default JourneyExperiencePage;
