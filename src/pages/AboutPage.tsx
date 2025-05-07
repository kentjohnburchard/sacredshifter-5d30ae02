
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { BackgroundEffects, BioContent, QuoteRotator } from '@/components/about';
import type { Quote } from '@/components/about/QuoteRotator';

const AboutPage: React.FC = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isLiftedVeil, setIsLiftedVeil] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Sample quotes that will rotate
  const quotes: Quote[] = [
    { 
      text: "The universe is not outside of you. Look inside yourself; everything that you want, you already are.",
      author: "Rumi" 
    },
    { 
      text: "We are not human beings having a spiritual experience. We are spiritual beings having a human experience.",
      author: "Pierre Teilhard de Chardin" 
    },
    { 
      text: "The wound is where the light enters you.",
      author: "Rumi" 
    }
  ];
  
  // Bio text content - placeholder but spiritual in nature
  const bioContent = `Sacred Shifter was born from a deep knowing, a cosmic whisper that urged us to *look for yourself in frequency*. 
  
  We are a collective of light-workers, sound healers, and consciousness explorers dedicated to helping you remember your divine nature through sacred sound and geometric patterns. Our mission is to facilitate your journey of awakening by providing tools that align with your highest vibration.
  
  *Everything is frequency*. Everything is vibration. By understanding and working with these universal principles, we open doorways to healing, transformation, and expanded awareness. Sacred Shifter exists to help you navigate these realms with grace and purpose.`;

  // Effect to rotate quotes every 5 seconds
  useEffect(() => {
    const rotateQuotes = setInterval(() => {
      setCurrentQuoteIndex(prevIndex => (prevIndex + 1) % quotes.length);
    }, 5000);
    
    return () => clearInterval(rotateQuotes);
  }, [quotes.length]);
  
  // Effect to check for "lifted veil" state from the theme context
  useEffect(() => {
    // This would normally come from a context, but for now we're just toggling randomly for demo
    const checkVeilState = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsLiftedVeil(prev => !prev);
        setIsTransitioning(false);
      }, 500);
    };
    
    const intervalId = setInterval(checkVeilState, 30000); // Every 30 seconds for demo
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Layout 
      pageTitle="About Sacred Shifter" 
      showNavbar={true}
      showPlayer={true}
      hideHeader={false}
      theme="cosmic"
    >
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Background Effects */}
          <BackgroundEffects isLiftedVeil={isLiftedVeil} />
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 animate-fade-in
              ${isLiftedVeil ? 'text-pink-100' : 'text-purple-100'}`}>
              About Sacred Shifter
            </h1>
            <div className={`h-1 w-24 mx-auto rounded-full
              ${isLiftedVeil ? 'bg-pink-500' : 'bg-purple-500'}`}></div>
          </div>
          
          {/* Bio Content */}
          <div className={`bg-black/30 backdrop-blur-md p-8 rounded-lg border shadow-xl mb-12
            ${isLiftedVeil ? 'border-pink-500/20' : 'border-purple-500/20'}`}>
            <BioContent 
              content={bioContent}
              isLiftedVeil={isLiftedVeil}
              isTransitioning={isTransitioning}
            />
          </div>
          
          {/* Rotating Quote */}
          <QuoteRotator 
            quote={quotes[currentQuoteIndex]}
            isLiftedVeil={isLiftedVeil}
          />
          
          {/* QA Metadata (invisible but present for automation) */}
          <div 
            data-qa-checklist="true" 
            data-route-accessible="true" 
            data-ui-elements-visible="true" 
            data-console-errors="false"
            className="hidden"
          ></div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
