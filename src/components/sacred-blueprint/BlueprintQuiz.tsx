
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { BlueprintQuizQuestion, QuizResponse } from '@/types/blueprint';
import { useAuth } from '@/context/AuthContext';
import { saveQuizResponse } from '@/utils/blueprintUtils';
import { toast } from 'sonner';

interface BlueprintQuizProps {
  onComplete: () => void;
}

const quizQuestions: BlueprintQuizQuestion[] = [
  {
    id: 'element_affinity',
    question: 'Which elemental energy resonates most deeply with your spirit?',
    type: 'multiple_choice',
    options: ['earth', 'water', 'fire', 'air']
  },
  {
    id: 'emotional_tendency',
    question: 'What emotional state do you find yourself naturally gravitating toward?',
    type: 'multiple_choice',
    options: ['peaceful contemplation', 'joyful excitement', 'empathic connection', 'transformative action']
  },
  {
    id: 'chakra_strength',
    question: 'Which energy center (chakra) feels most open and active in your life currently?',
    type: 'chakra_selection',
    options: ['root', 'sacral', 'solar', 'heart', 'throat', 'third_eye', 'crown']
  },
  {
    id: 'musical_preference',
    question: 'When listening to music, which quality moves you the most?',
    type: 'multiple_choice',
    options: ['calm and peaceful', 'joyful and bright', 'serious and deep', 'triumphant and victorious']
  },
  {
    id: 'spiritual_purpose',
    question: 'What feels like your primary spiritual purpose in this lifetime?',
    type: 'multiple_choice',
    options: ['healing others', 'creating beauty', 'speaking truth', 'teaching wisdom', 'manifesting change']
  },
  {
    id: 'resonant_tone',
    question: 'Which frequency feels most resonant with your current state of being?',
    type: 'frequency_selection',
    options: ['396Hz', '417Hz', '432Hz', '528Hz', '639Hz', '741Hz', '852Hz', '963Hz']
  }
];

export const BlueprintQuiz: React.FC<BlueprintQuizProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  const handleResponse = (response: string) => {
    setResponses({
      ...responses,
      [currentQuestion.id]: response
    });
  };

  const handleSliderChange = (value: number[]) => {
    setResponses({
      ...responses,
      [currentQuestion.id]: value[0].toString()
    });
  };

  const handleNext = async () => {
    if (!user) {
      toast.error("You must be logged in to complete the blueprint quiz");
      return;
    }

    if (currentQuestion.id in responses) {
      try {
        // Save this response to the database
        const quizResponse: QuizResponse = {
          user_id: user.id,
          question_id: currentQuestion.id,
          response: responses[currentQuestion.id],
          response_type: getResponseType(currentQuestion)
        };

        await saveQuizResponse(quizResponse);

        if (isLastQuestion) {
          setLoading(true);
          // Quiz complete, generate blueprint
          onComplete();
        } else {
          // Move to next question
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      } catch (error) {
        console.error("Error saving response:", error);
        toast.error("Unable to save your response. Please try again.");
      }
    } else {
      toast.error("Please select an answer before continuing");
    }
  };

  const getResponseType = (question: BlueprintQuizQuestion): string => {
    switch (question.id) {
      case 'element_affinity': 
        return 'element';
      case 'emotional_tendency': 
        return 'emotion';
      case 'chakra_strength': 
        return 'chakra';
      case 'musical_preference': 
        return 'music';
      case 'resonant_tone': 
        return 'frequency';
      default: 
        return question.type;
    }
  };

  const renderQuestionContent = () => {
    const question = quizQuestions[currentQuestionIndex];

    switch (question.type) {
      case 'multiple_choice':
        return (
          <RadioGroup
            value={responses[question.id] || ''}
            onValueChange={handleResponse}
            className="space-y-4 mt-6"
          >
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="capitalize">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'slider':
        return (
          <div className="space-y-4 mt-6">
            <Slider
              onValueChange={handleSliderChange}
              defaultValue={[50]}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Low</span>
              <span className="text-sm text-muted-foreground">High</span>
            </div>
          </div>
        );

      case 'chakra_selection':
        return (
          <RadioGroup
            value={responses[question.id] || ''}
            onValueChange={handleResponse}
            className="space-y-4 mt-6"
          >
            {question.options?.map((chakra) => (
              <div key={chakra} className="flex items-center space-x-2">
                <RadioGroupItem value={chakra} id={chakra} />
                <Label htmlFor={chakra} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ 
                      backgroundColor: 
                        chakra === 'root' ? '#FF0000' :
                        chakra === 'sacral' ? '#FF7F00' :
                        chakra === 'solar' ? '#FFFF00' :
                        chakra === 'heart' ? '#00FF00' :
                        chakra === 'throat' ? '#00FFFF' :
                        chakra === 'third_eye' ? '#0000FF' :
                        chakra === 'crown' ? '#8B00FF' : '#CCCCCC'
                    }}
                  />
                  {chakra.charAt(0).toUpperCase() + chakra.slice(1)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'frequency_selection':
        return (
          <RadioGroup
            value={responses[question.id] || ''}
            onValueChange={handleResponse}
            className="space-y-4 mt-6"
          >
            {question.options?.map((freq) => (
              <div key={freq} className="flex items-center space-x-2">
                <RadioGroupItem value={freq} id={freq} />
                <Label htmlFor={freq}>{freq}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Sacred Blueprint Ceremony
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm">
            <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
            <span>{Math.round((currentQuestionIndex / quizQuestions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" 
              style={{ width: `${(currentQuestionIndex / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
        {renderQuestionContent()}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleNext} 
          className="w-full"
          disabled={loading || !(currentQuestion.id in responses)}
        >
          {isLastQuestion ? 'Generate Blueprint' : 'Next Question'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlueprintQuiz;
