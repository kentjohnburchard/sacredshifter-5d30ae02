
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const JoinSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section id="join" className="relative z-10 py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Background sacred geometry */}
          <div className="absolute inset-0 -z-10 opacity-20">
            <svg viewBox="0 0 500 500" className="w-full h-full">
              <circle cx="250" cy="250" r="100" stroke="white" strokeWidth="1" fill="none" />
              <circle cx="250" cy="250" r="150" stroke="white" strokeWidth="1" fill="none" />
              <path d="M250 100 L400 250 L250 400 L100 250 Z" stroke="white" strokeWidth="1" fill="none" />
            </svg>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-light mb-6 text-white">
            Ready to Begin Your <span className="text-purple-400 font-medium">Sacred Journey</span>?
          </h2>
          
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Join thousands of spiritual seekers who have transformed their lives through
            sacred frequencies, meditation, and conscious community.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
              onClick={() => navigate('/auth')}
            >
              Begin Your Journey
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              onClick={() => navigate('/about-founder')}
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JoinSection;
