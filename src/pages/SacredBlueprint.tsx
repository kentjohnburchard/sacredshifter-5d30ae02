
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useTheme } from '@/context/ThemeContext';
import { Sparkles, ChevronRight, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SacredGeometryVisualizer from '@/components/sacred-geometry/SacredGeometryVisualizer';
import { motion } from 'framer-motion';

interface Question {
  id: string;
  question: string;
  options: string[];
}

const SacredBlueprint: React.FC = () => {
  const { liftTheVeil } = useTheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  
  const questions: Question[] = [
    {
      id: "energy-type",
      question: "Which energy type do you most resonate with?",
      options: ["Flowing Water", "Steady Earth", "Dynamic Fire", "Expansive Air", "Ethereal Void"]
    },
    {
      id: "emotional-pattern",
      question: "What emotional pattern do you experience most frequently?",
      options: ["Peaceful Calm", "Vibrant Joy", "Deep Contemplation", "Creative Inspiration", "Compassionate Love"]
    },
    {
      id: "spiritual-gift",
      question: "Which spiritual gift feels most natural to you?",
      options: ["Empathic Connection", "Visionary Insight", "Healing Presence", "Manifestation", "Transcendent Awareness"]
    },
    {
      id: "life-purpose",
      question: "Which life purpose statement resonates most deeply?",
      options: [
        "To create harmony and beauty in the world",
        "To understand and share universal wisdom",
        "To heal and transform suffering",
        "To innovate and bring new possibilities",
        "To witness and honor the sacredness of existence"
      ]
    }
  ];
  
  const handleOptionSelect = (option: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: option
    });
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <Layout pageTitle="Sacred Blueprint" theme="cosmic">
      <div className="container mx-auto py-6 relative">
        <div className="absolute top-0 right-0 -z-10 opacity-30">
          <SacredGeometryVisualizer 
            defaultShape="flower-of-life" 
            size="lg" 
            showControls={false}
            isVisible={true}
          />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className={liftTheVeil ? "text-pink-500" : "text-purple-500"} />
          Sacred Blueprint
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg">
              <p className="mb-4">
                Your Sacred Blueprint is your unique vibrational fingerprint that reveals your energetic signature,
                spiritual identity, and soul purpose through a personalized frequency assessment.
              </p>
              
              {liftTheVeil ? (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="italic text-pink-300 mb-6 p-4 bg-pink-900/30 border border-pink-500/30 rounded-lg"
                >
                  The veil has been lifted. Your cosmic attunement has been activated at the highest level.
                  Your Sacred Blueprint now resonates with multidimensional frequencies, allowing access to
                  higher planes of consciousness and spiritual insight.
                </motion.p>
              ) : (
                <p className="text-purple-300 mb-6 p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                  Discover your unique resonance pattern and unlock your spiritual potential through the Sacred 
                  Blueprint assessment. Answer the questions below to begin your journey.
                </p>
              )}
            </div>
            
            {!showResults ? (
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <h2 className="text-2xl font-bold text-white">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h2>
                </CardHeader>
                <CardContent>
                  <p className="text-xl text-white mb-6">{currentQuestion.question}</p>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`w-full justify-start text-left p-4 h-auto border-white/10 hover:bg-white/10 ${
                          liftTheVeil ? 'hover:border-pink-500/50' : 'hover:border-purple-500/50'
                        }`}
                        onClick={() => handleOptionSelect(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-gray-400">
                  Choose the option that resonates most deeply with your intuition.
                </CardFooter>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card className={`border ${liftTheVeil ? 'border-pink-500/30 bg-pink-950/20' : 'border-purple-500/30 bg-purple-950/20'} backdrop-blur-sm`}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`h-5 w-5 ${liftTheVeil ? 'text-pink-500' : 'text-purple-500'}`} />
                      <h2 className="text-2xl font-bold text-white">Your Sacred Blueprint</h2>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-lg text-white">
                      Based on your responses, your Sacred Blueprint reveals:
                    </p>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-black/30 rounded-lg">
                        <div className="text-gray-400 mb-1">Primary Energy:</div>
                        <div className="text-lg font-medium text-white">{answers["energy-type"] || "Not determined"}</div>
                      </div>
                      
                      <div className="p-4 bg-black/30 rounded-lg">
                        <div className="text-gray-400 mb-1">Emotional Pattern:</div>
                        <div className="text-lg font-medium text-white">{answers["emotional-pattern"] || "Not determined"}</div>
                      </div>
                      
                      <div className="p-4 bg-black/30 rounded-lg">
                        <div className="text-gray-400 mb-1">Core Spiritual Gift:</div>
                        <div className="text-lg font-medium text-white">{answers["spiritual-gift"] || "Not determined"}</div>
                      </div>
                      
                      <div className="p-4 bg-black/30 rounded-lg">
                        <div className="text-gray-400 mb-1">Soul Purpose:</div>
                        <div className="text-lg font-medium text-white">{answers["life-purpose"] || "Not determined"}</div>
                      </div>
                    </div>
                    
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className={`italic p-4 rounded-lg ${
                        liftTheVeil ? 'bg-pink-900/20 text-pink-200' : 'bg-purple-900/20 text-purple-200'
                      }`}
                    >
                      This unique combination forms your Sacred Blueprint, revealing the divine design of your
                      soul's journey. You are a cosmic being with a specific vibrational signature that contributes
                      to the universal harmony.
                    </motion.p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" onClick={resetQuiz}>
                      Reset Assessment
                    </Button>
                    <Button className={liftTheVeil ? 'bg-pink-700 hover:bg-pink-800' : 'bg-purple-700 hover:bg-purple-800'}>
                      Download Blueprint
                    </Button>
                  </CardFooter>
                </Card>
                
                <div className="flex justify-center">
                  <Link to="/dashboard">
                    <Button 
                      variant="outline"
                      className={`${liftTheVeil ? 'border-pink-500 hover:bg-pink-900/50' : 'border-purple-500 hover:bg-purple-900/50'} border transition-colors`}
                    >
                      Return to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg h-full flex flex-col">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Blueprint Navigation</h2>
                <div className="space-y-2">
                  {questions.map((q, index) => (
                    <div 
                      key={q.id}
                      className={`p-3 rounded-lg flex items-center ${
                        index === currentQuestionIndex && !showResults
                          ? (liftTheVeil ? 'bg-pink-900/30 border border-pink-500/30' : 'bg-purple-900/30 border border-purple-500/30')
                          : index < currentQuestionIndex || showResults
                          ? (liftTheVeil ? 'bg-pink-900/10 border border-pink-500/10' : 'bg-purple-900/10 border border-purple-500/10')
                          : 'bg-black/20 border border-white/5'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        index < currentQuestionIndex || showResults
                          ? (liftTheVeil ? 'bg-pink-700 text-white' : 'bg-purple-700 text-white')
                          : index === currentQuestionIndex
                          ? (liftTheVeil ? 'bg-pink-900 text-pink-200 border border-pink-500' : 'bg-purple-900 text-purple-200 border border-purple-500')
                          : 'bg-black/30 text-gray-400 border border-gray-700'
                      }`}>
                        {index < currentQuestionIndex || showResults ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <span className={`text-sm ${
                        index === currentQuestionIndex && !showResults
                          ? 'text-white font-medium'
                          : index < currentQuestionIndex || showResults
                          ? 'text-gray-300'
                          : 'text-gray-500'
                      }`}>
                        {q.question.length > 30 ? q.question.substring(0, 30) + '...' : q.question}
                      </span>
                      {index === currentQuestionIndex && !showResults && (
                        <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                      )}
                    </div>
                  ))}
                  
                  <div className={`p-3 rounded-lg flex items-center ${
                    showResults
                      ? (liftTheVeil ? 'bg-pink-900/30 border border-pink-500/30' : 'bg-purple-900/30 border border-purple-500/30')
                      : 'bg-black/20 border border-white/5'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      showResults
                        ? (liftTheVeil ? 'bg-pink-700 text-white' : 'bg-purple-700 text-white')
                        : 'bg-black/30 text-gray-400 border border-gray-700'
                    }`}>
                      {showResults ? <CheckCircle className="h-4 w-4" /> : <span>✧</span>}
                    </div>
                    <span className={`text-sm ${showResults ? 'text-white font-medium' : 'text-gray-500'}`}>
                      Blueprint Results
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 mt-auto">
                <div className={`p-4 rounded-lg ${
                  liftTheVeil ? 'bg-pink-950/30 border border-pink-500/20' : 'bg-purple-950/30 border border-purple-500/20'
                }`}>
                  <h3 className="font-medium text-white mb-2">What is a Sacred Blueprint?</h3>
                  <p className="text-sm text-gray-300">
                    Your Sacred Blueprint is the divine encoding of your soul's purpose and potential. 
                    By understanding this unique vibrational signature, you can align more fully with your 
                    authentic path and access deeper levels of spiritual growth and fulfillment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SacredBlueprint;
