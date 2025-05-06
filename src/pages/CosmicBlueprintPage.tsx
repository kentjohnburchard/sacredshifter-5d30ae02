
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useCosmicBlueprint } from '@/hooks/useCosmicBlueprint';
import { DNAStrandStatus, StarseedResonanceType } from '@/types/cosmic-blueprint';
import { toast } from 'sonner';
import DNAOverlayPanel from '@/components/cosmic-blueprint/DNAOverlayPanel';
import CosmicBlueprintProfile from '@/components/cosmic-blueprint/CosmicBlueprintProfile';
import EnergeticAlignmentScore from '@/components/cosmic-blueprint/EnergeticAlignmentScore';
import CosmicRecommendationsPanel from '@/components/cosmic-blueprint/CosmicRecommendationsPanel';
import EarthRealmResonancePanel from '@/components/cosmic-blueprint/EarthRealmResonancePanel';
import { useLightbearerProgress } from '@/hooks/useLightbearerProgress';

const CosmicBlueprintPage: React.FC = () => {
  const { user } = useAuth();
  const { stats: lightbearerStats } = useLightbearerProgress();
  const { 
    loading, 
    blueprint, 
    alignmentMetrics,
    recommendations,
    calculatingAlignment,
    recalculateAlignment,
    updateDNAStrands,
    updateStarseedResonance
  } = useCosmicBlueprint();
  
  const handleUpdateStrand = async (index: number, active: boolean) => {
    if (!blueprint) return;
    
    const newStatus = [...blueprint.dna_strand_status];
    newStatus[index] = active;
    
    const success = await updateDNAStrands(newStatus);
    if (success) {
      toast.success(`DNA Strand ${index + 1} ${active ? 'activated' : 'deactivated'}`);
    } else {
      toast.error('Failed to update DNA strand');
    }
  };
  
  const handleUpdateResonance = async (resonance: StarseedResonanceType[]) => {
    if (!blueprint) return;
    
    const success = await updateStarseedResonance(resonance);
    if (success) {
      toast.success(`Starseed resonance updated to ${resonance[0]}`);
    } else {
      toast.error('Failed to update starseed resonance');
    }
  };
  
  const handleRecalculateAlignment = async () => {
    await recalculateAlignment();
    toast.success('Energetic alignment recalculated');
  };
  
  return (
    <Layout pageTitle="Cosmic Blueprint | Sacred Shifter">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
              Your Cosmic Blueprint
            </h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Explore your multidimensional identity, DNA activation, and sacred energetic signature
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* DNA Visualization Panel */}
              <DNAOverlayPanel 
                dnaStrandStatus={blueprint?.dna_strand_status || Array(12).fill(false)}
                onUpdateStrand={handleUpdateStrand}
                lightbearerLevel={lightbearerStats?.lightbearer_level}
              />
              
              {/* Cosmic Blueprint Profile */}
              <CosmicBlueprintProfile 
                blueprint={blueprint} 
                loading={loading}
                onUpdateResonance={handleUpdateResonance}
              />
              
              {/* Earth Realm Resonance */}
              <EarthRealmResonancePanel 
                alignmentScore={blueprint?.energetic_alignment_score || 0}
              />
            </div>
            
            {/* Right column */}
            <div className="space-y-6">
              {/* Energetic Alignment Score */}
              <EnergeticAlignmentScore 
                metrics={alignmentMetrics}
                loading={loading}
                onRecalculate={handleRecalculateAlignment}
                calculating={calculatingAlignment}
                resonantSignature={blueprint?.resonant_signature}
              />
              
              {/* Cosmic Recommendations */}
              <CosmicRecommendationsPanel 
                recommendations={recommendations}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CosmicBlueprintPage;
