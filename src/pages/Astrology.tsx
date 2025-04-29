
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { 
  AstrologyDashboard, 
  UserBirthDataForm,
  ZodiacSignCard,
  DailyHoroscope,
  PlanetaryTransits,
  BirthChart,
  ElementalProfile,
  NatalChartForm
} from '@/components/astrology';

const Astrology: React.FC = () => {
  const [birthDataSubmitted, setBirthDataSubmitted] = React.useState(false);
  const [dominantElement, setDominantElement] = React.useState("Fire");
  
  return (
    <Layout pageTitle="Astrology | Sacred Shifter">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300"
              style={{textShadow: '0 2px 10px rgba(139, 92, 246, 0.7)'}}>
            Astrology Portal
          </h1>
          <p className="text-lg text-center text-white mb-12 max-w-3xl mx-auto"
            style={{textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'}}>
            Explore your cosmic connections and celestial influences
          </p>
          
          <div className="space-y-12">
            {!birthDataSubmitted ? (
              <Card className="p-6 bg-black/60 border-purple-500/30">
                <h2 className="text-xl font-semibold mb-4 text-purple-100">Enter Your Birth Information</h2>
                <UserBirthDataForm onSubmit={() => setBirthDataSubmitted(true)} />
              </Card>
            ) : (
              <>
                <AstrologyDashboard />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ZodiacSignCard sign="Libra" />
                  <DailyHoroscope />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <BirthChart />
                  <ElementalProfile dominantElement={dominantElement} />
                  <PlanetaryTransits />
                </div>
                
                <Card className="p-6 bg-black/60 border-purple-500/30">
                  <h2 className="text-xl font-semibold mb-4 text-purple-100">Detailed Natal Chart</h2>
                  <NatalChartForm />
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Astrology;
