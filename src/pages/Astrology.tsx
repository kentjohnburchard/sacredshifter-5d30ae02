
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

// Define the proper interfaces first
interface BirthChartProps {
  data: {
    sun_sign: string;
    moon_sign: string;
    rising_sign: string;
    birth_date: string;
  }
}

interface NatalChartFormProps {
  onSubmit: (data: any) => void;
}

// Define placeholder components
const AstrologyDashboard: React.FC = () => <div>Astrology Dashboard</div>;
const UserBirthDataForm: React.FC = () => <div>User Birth Data Form</div>;
const ZodiacSignCard: React.FC<{sign: string}> = ({sign}) => <div>Zodiac Sign: {sign}</div>;
const DailyHoroscope: React.FC = () => <div>Daily Horoscope</div>;
const PlanetaryTransits: React.FC = () => <div>Planetary Transits</div>;
const ElementalProfile: React.FC<{dominantElement: string}> = ({dominantElement}) => <div>Elemental Profile: {dominantElement}</div>;

// Create proper BirthChart component with required props
const BirthChart: React.FC<BirthChartProps> = ({ data }) => {
  return (
    <div className="birth-chart">
      <h3>Birth Chart</h3>
      <p>Sun Sign: {data.sun_sign}</p>
      <p>Moon Sign: {data.moon_sign}</p>
      <p>Rising Sign: {data.rising_sign}</p>
      <p>Birth Date: {data.birth_date}</p>
    </div>
  );
};

// Create proper NatalChartForm component with required props
const NatalChartForm: React.FC<NatalChartFormProps> = ({ onSubmit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ date: "2000-01-01" });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Generate Chart</button>
    </form>
  );
};

// Main Astrology component
const Astrology: React.FC = () => {
  const [birthDataSubmitted, setBirthDataSubmitted] = React.useState(false);
  const [dominantElement, setDominantElement] = React.useState("Fire");
  const [userData, setUserData] = React.useState({
    sun_sign: "Aries",
    moon_sign: "Taurus",
    rising_sign: "Gemini",
    birth_date: "1990-01-01",
  });
  
  const handleBirthDataSubmit = (data: any) => {
    setUserData({
      ...userData,
      birth_date: data.birthDate || "1990-01-01"
    });
    setBirthDataSubmitted(true);
  };
  
  const handleNatalChartSubmit = (data: any) => {
    console.log("Generating natal chart with data:", data);
    // Process natal chart data
  };
  
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
                <UserBirthDataForm />
              </Card>
            ) : (
              <>
                <AstrologyDashboard />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ZodiacSignCard sign="Libra" />
                  <DailyHoroscope />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <BirthChart data={userData} />
                  <ElementalProfile dominantElement={dominantElement} />
                  <PlanetaryTransits />
                </div>
                
                <Card className="p-6 bg-black/60 border-purple-500/30">
                  <h2 className="text-xl font-semibold mb-4 text-purple-100">Detailed Natal Chart</h2>
                  <NatalChartForm onSubmit={handleNatalChartSubmit} />
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
