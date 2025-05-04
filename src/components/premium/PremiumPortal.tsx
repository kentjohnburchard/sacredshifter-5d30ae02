
import React from 'react';
import { usePremium } from '@/hooks/usePremium';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

const PremiumPortal: React.FC = () => {
  const { experiences, loading } = usePremium();
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-glow-pink">The Ascended Path</h1>
        <p className="text-lg mt-2 text-white/80">
          Welcome to your premium journey through sacred dimensions
        </p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-72 ethereal-card animate-pulse">
              <div className="h-full flex items-center justify-center">
                <p className="text-glow-light">Materializing sacred experiences...</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((experience) => (
            <Card key={experience.id} className="ethereal-card overflow-hidden veil-mode">
              <div 
                className="h-40 bg-cover bg-center" 
                style={{ backgroundImage: `url(${experience.imageUrl})` }}
              />
              <CardHeader className="pb-2">
                <h3 className="text-xl font-semibold text-glow-pink">{experience.title}</h3>
              </CardHeader>
              <CardContent className="py-2">
                <p className="line-clamp-2 text-sm">{experience.description}</p>
              </CardContent>
              <CardFooter className="pt-2 border-t border-white/10">
                <button className="w-full btn-primary veil-mode">
                  Begin Experience
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PremiumPortal;
