
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Sparkles, Star, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const LandingPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-indigo-950">
      <div className="relative isolate overflow-hidden pt-14">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_30%,rgba(120,79,255,0.15),rgba(0,0,0,0))]"></div>
        </div>
        
        {/* Navigation */}
        <header className="absolute inset-x-0 top-0 z-10">
          <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5 flex items-center">
                <span className="text-xl font-bold text-white">Sacred<span className="text-indigo-400">Shifter</span></span>
              </a>
            </div>
            <div className="flex lg:hidden">
              <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400">
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              <a href="#features" className="text-sm font-semibold leading-6 text-white">Features</a>
              <a href="#testimonials" className="text-sm font-semibold leading-6 text-white">Testimonials</a>
              <a href="#pricing" className="text-sm font-semibold leading-6 text-white">Pricing</a>
              <a href="#about" className="text-sm font-semibold leading-6 text-white">About</a>
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              {user ? (
                <Link to="/dashboard" className="text-sm font-semibold leading-6 text-white">
                  Dashboard <span aria-hidden="true">&rarr;</span>
                </Link>
              ) : (
                <Link to="/auth" className="text-sm font-semibold leading-6 text-white">
                  Log in <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
            </div>
          </nav>
        </header>

        <main>
          {/* Hero section */}
          <div className="relative px-6 lg:px-8">
            <div className="mx-auto max-w-3xl pt-32 pb-32 sm:pt-48 sm:pb-40">
              <div>
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                  <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-white/10">
                    <span className="text-gray-300">
                      <Sparkles className="inline-block h-4 w-4 mr-1 text-indigo-400" />
                      Begin your spiritual journey today
                    </span>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-center sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-300">
                    Elevate Your Consciousness
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-300 text-center">
                    Sacred Shifter is your companion on the journey of spiritual awakening,
                    offering tools for meditation, frequency healing, and conscious expansion.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                      to={user ? "/dashboard" : "/auth"}
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {user ? "Enter Sacred Space" : "Begin Your Journey"}
                    </Link>
                    <a href="#learn-more" className="text-sm font-semibold leading-6 text-white">
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature section */}
          <div id="features" className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:text-center">
                <h2 className="text-base font-semibold leading-7 text-indigo-400">Expand Your Awareness</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Tools For Your Spiritual Evolution
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  Sacred Shifter offers a suite of transformational tools designed to elevate your consciousness
                  and help you connect with your higher self.
                </p>
              </div>
              <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                  {[
                    {
                      name: 'Frequency Healing',
                      description: 'Experience the healing power of sacred frequencies calibrated to restore harmony to your energetic body.',
                      icon: <Sparkles className="h-6 w-6 text-indigo-400" aria-hidden="true" />
                    },
                    {
                      name: 'Meditation Library',
                      description: 'Access guided meditations designed to deepen your practice and expand your consciousness.',
                      icon: <Moon className="h-6 w-6 text-indigo-400" aria-hidden="true" />
                    },
                    {
                      name: 'Spiritual Community',
                      description: 'Connect with like-minded souls on the path of awakening in our Sacred Circle community.',
                      icon: <Star className="h-6 w-6 text-indigo-400" aria-hidden="true" />
                    },
                    {
                      name: 'Consciousness Tracking',
                      description: 'Monitor your spiritual growth with our Lightbearer progression system and timeline tools.',
                      icon: <Sparkles className="h-6 w-6 text-indigo-400" aria-hidden="true" />
                    }
                  ].map((feature) => (
                    <div key={feature.name} className="relative pl-16">
                      <dt className="text-base font-semibold leading-7 text-white">
                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
                          {feature.icon}
                        </div>
                        {feature.name}
                      </dt>
                      <dd className="mt-2 text-base leading-7 text-gray-300">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </main>

        {/* Simple footer */}
        <footer className="bg-black/30 mt-32">
          <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
            <div className="mt-8 md:order-1 md:mt-0">
              <p className="text-center text-xs leading-5 text-gray-400">
                &copy; 2025 Sacred Shifter. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
