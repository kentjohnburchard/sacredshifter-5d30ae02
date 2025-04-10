
import React, { useState } from 'react';
import SacredFlowerOfLife from '@/components/sacred-geometry/shapes/SacredFlowerOfLife';
import MetatronsCube from '@/components/sacred-geometry/shapes/MetatronsCube';
import Merkaba from '@/components/sacred-geometry/shapes/Merkaba';
import Torus from '@/components/sacred-geometry/shapes/Torus';
import TreeOfLife from '@/components/sacred-geometry/shapes/TreeOfLife';
import SriYantra from '@/components/sacred-geometry/shapes/SriYantra';
import VesicaPiscis from '@/components/sacred-geometry/shapes/VesicaPiscis';
import StarfieldBackground from '@/components/sacred-geometry/StarfieldBackground';

const geometryComponents = {
  'Flower of Life': <SacredFlowerOfLife />,
  "Metatron's Cube": <MetatronsCube />,
  'Merkaba': <Merkaba />,
  'Torus': <Torus />,
  'Tree of Life': <TreeOfLife />,
  'Sri Yantra': <SriYantra />,
  'Vesica Piscis': <VesicaPiscis />,
};

const SacredShifterLanding = () => {
  const [selectedShape, setSelectedShape] = useState("Flower of Life");

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <StarfieldBackground />

      {/* Top Navigation */}
      <nav className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 space-y-4">
        {['Home', 'Sound Journeys', 'Experiences', 'Frequencies', 'My Journey'].map((label) => (
          <a key={label} href={`#${label.toLowerCase().replace(/ /g, '-')}`} className="block text-sm text-white hover:text-purple-300 transition">
            {label}
          </a>
        ))}
      </nav>

      <header className="text-center pt-24 relative z-10">
        <img src="/lovable-uploads/b9b4b625-472c-484e-a49a-41aaf4f604a5.png" alt="Sacred Shifter Logo" className="mx-auto w-48 opacity-80 mix-blend-screen" />
        <h1 className="sr-only">Sacred Shifter</h1>
        <p className="text-lg mt-4 max-w-xl mx-auto text-gray-300">
          Explore frequency-based healing, sacred geometry, and consciousness expansion in this interdimensional portal
        </p>
      </header>

      {/* Shape Selector */}
      <div className="flex justify-center gap-2 mt-8 flex-wrap z-10 relative">
        {Object.keys(geometryComponents).map((shape) => (
          <button
            key={shape}
            onClick={() => setSelectedShape(shape)}
            className={`px-4 py-2 rounded-md font-medium border transition-all duration-300 ${
              selectedShape === shape
                ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
            }`}
          >
            {shape}
          </button>
        ))}
      </div>

      {/* Geometry Visualizer */}
      <div className="mt-6 px-4 z-10 relative">
        <div className="rounded-lg overflow-hidden border border-purple-900 shadow-xl">
          {geometryComponents[selectedShape]}
        </div>
      </div>

      {/* Experience Grid */}
      <section id="experiences" className="mt-16 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto z-10 relative">
        {[
          { title: 'Sound Healing', description: 'Frequency-based sound healing journeys' },
          { title: 'Meditation', description: 'Guided meditations with sacred frequencies' },
          { title: 'Heart Center', description: 'Open and balance your heart chakra' },
          { title: 'Manifestation', description: 'Focus your energy to manifest intentions' },
          { title: 'Astrology', description: 'Discover your cosmic blueprint' },
          { title: 'Hermetic Wisdom', description: 'Ancient wisdom for modern consciousness' },
        ].map(({ title, description }) => (
          <div
            key={title}
            className="bg-gradient-to-br from-black via-gray-900 to-gray-800 rounded-2xl p-6 text-white border border-purple-600 shadow-md hover:shadow-2xl transition"
          >
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-300">{description}</p>
            <a href={`#${title.toLowerCase().replace(/ /g, '-')}`} className="mt-4 block text-indigo-300 hover:text-indigo-400 transition">Explore →</a>
          </div>
        ))}
      </section>

      {/* Footer Player */}
      <footer className="mt-24 pb-10 text-center z-10 relative">
        <audio autoPlay loop className="mx-auto mb-2">
          <source src="/audio/528hz-heart.mp3" type="audio/mpeg" />
        </audio>
        <p className="text-sm text-purple-400">528Hz - Heart Chakra</p>
        <div className="mt-2 text-xs text-gray-500">
          Sound Journeys • Experiences • Frequencies • My Journey
        </div>
      </footer>
    </div>
  );
};

export default SacredShifterLanding;
