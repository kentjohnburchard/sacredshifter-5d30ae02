
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface Question {
  id: string;
  question: string;
  options: string[];
}

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

const SacredBlueprintCreator: React.FC = () => {
  const { liftTheVeil } = useTheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  
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
    <div className="space-y-6">
      {!showResults ? (
        <Card className="bg-black/30 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Sparkles className={`h-5 w-5 ${liftTheVeil ? 'text-pink-500' : 'text-purple-500'}`} />
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardTitle>
            <CardDescription className="text-gray-300">
              Select the option that resonates most with your inner truth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-white mb-6">{currentQuestion.question}</p>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    liftTheVeil 
                      ? 'border-pink-500/30 hover:border-pink-500 hover:bg-pink-900/20' 
                      : 'border-purple-500/30 hover:border-purple-500 hover:bg-purple-900/20'
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="ghost" 
              onClick={resetQuiz} 
              disabled={currentQuestionIndex === 0}
              className="text-gray-400"
            >
              Reset
            </Button>
            
            <div className="flex items-center space-x-1">
              {questions.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentQuestionIndex 
                      ? (liftTheVeil ? 'bg-pink-500' : 'bg-purple-500')
                      : index < currentQuestionIndex
                      ? 'bg-gray-300'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </CardFooter>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card className={`border ${
            liftTheVeil ? 'border-pink-500/30 bg-pink-950/20' : 'border-purple-500/30 bg-purple-950/20'
          } backdrop-blur-sm`}>
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Sparkles className={`h-5 w-5 ${liftTheVeil ? 'text-pink-500' : 'text-purple-500'}`} />
                Your Sacred Blueprint
              </CardTitle>
              <CardDescription className="text-gray-300">
                The cosmic encoding of your soul's purpose
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-black/40 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Primary Energy:</div>
                <div className="text-white">{answers["energy-type"]}</div>
              </div>
              
              <div className="p-3 bg-black/40 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Emotional Pattern:</div>
                <div className="text-white">{answers["emotional-pattern"]}</div>
              </div>
              
              <div className="p-3 bg-black/40 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Core Spiritual Gift:</div>
                <div className="text-white">{answers["spiritual-gift"]}</div>
              </div>
              
              <div className="p-3 bg-black/40 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Soul Purpose:</div>
                <div className="text-white">{answers["life-purpose"]}</div>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`p-4 rounded-lg text-sm italic ${
                  liftTheVeil ? 'bg-pink-900/20 text-pink-200' : 'bg-purple-900/20 text-purple-200'
                }`}
              >
                This unique combination forms your Sacred Blueprint, revealing the divine design of your
                soul's journey. You resonate with a specific vibrational signature that contributes
                to the universal harmony.
              </motion.div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={resetQuiz} className="text-gray-400">
                Start Over
              </Button>
              <Button className={liftTheVeil ? 'bg-pink-700 hover:bg-pink-800' : 'bg-purple-700 hover:bg-purple-800'}>
                Save Blueprint
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default SacredBlueprintCreator;
