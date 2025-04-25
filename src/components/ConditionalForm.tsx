
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle } from "lucide-react";

// Define the question type interface
interface Question {
  id: string;
  type: 'text' | 'select' | 'radio' | 'textarea' | 'confirmation';
  text: string;
  options?: string[];
  nextQuestionId?: Record<string, string>;
  defaultNextId?: string;
}

// Define the question flow
const questions: Record<string, Question> = {
  'start': {
    id: 'start',
    type: 'select',
    text: 'What type of legal document do you need help with?',
    options: ['Business Contract', 'Estate Planning', 'Real Estate', 'Family Law'],
    defaultNextId: 'purpose'
  },
  'purpose': {
    id: 'purpose',
    type: 'textarea',
    text: 'Please briefly describe your purpose for this document:',
    defaultNextId: 'parties'
  },
  'parties': {
    id: 'parties',
    type: 'radio',
    text: 'How many parties will be involved in this document?',
    options: ['One party', 'Two parties', 'Three or more parties'],
    nextQuestionId: {
      'One party': 'party_details_single',
      'Two parties': 'party_details_multiple',
      'Three or more parties': 'party_details_multiple'
    }
  },
  'party_details_single': {
    id: 'party_details_single',
    type: 'text',
    text: 'Please enter your full legal name:',
    defaultNextId: 'timeline'
  },
  'party_details_multiple': {
    id: 'party_details_multiple',
    type: 'textarea',
    text: 'Please enter the names of all parties involved (one per line):',
    defaultNextId: 'timeline'
  },
  'timeline': {
    id: 'timeline',
    type: 'select',
    text: 'When do you need this document to be effective?',
    options: ['Immediately', 'On a specific future date', 'Upon signing by all parties'],
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. Based on your answers, we can create a customized legal document for you.',
  }
};

const ConditionalForm = () => {
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('start');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionHistory, setQuestionHistory] = useState<string[]>(['start']);
  const [isComplete, setIsComplete] = useState(false);
  
  const currentQuestion = questions[currentQuestionId];
  
  const handleNext = (nextId?: string) => {
    if (!nextId && currentQuestion.type === 'confirmation') {
      setIsComplete(true);
      return;
    }
    
    const nextQuestionId = nextId || 
      (answers[currentQuestion.id] && currentQuestion.nextQuestionId?.[answers[currentQuestion.id]]) || 
      currentQuestion.defaultNextId || '';
    
    if (nextQuestionId) {
      setQuestionHistory([...questionHistory, nextQuestionId]);
      setCurrentQuestionId(nextQuestionId);
    }
  };
  
  const handleBack = () => {
    if (questionHistory.length > 1) {
      const newHistory = [...questionHistory];
      newHistory.pop();
      setQuestionHistory(newHistory);
      setCurrentQuestionId(newHistory[newHistory.length - 1]);
    }
  };
  
  const handleAnswer = (answer: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer
    });
  };
  
  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case 'text':
        return (
          <Input
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer"
            className="mt-2"
          />
        );
      case 'select':
        return (
          <Select 
            value={answers[currentQuestion.id] || ''} 
            onValueChange={handleAnswer}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {currentQuestion.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'radio':
        return (
          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={handleAnswer}
            className="mt-4 space-y-3"
          >
            {currentQuestion.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'textarea':
        return (
          <Textarea
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer"
            className="mt-2"
            rows={4}
          />
        );
      case 'confirmation':
        return (
          <div className="mt-4 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="mt-4 text-rocket-gray-700 dark:text-rocket-gray-300">
              We will generate your document based on the information you provided.
            </p>
          </div>
        );
      default:
        return null;
    }
  };
  
  const canAdvance = () => {
    if (currentQuestion.type === 'confirmation') return true;
    return !!answers[currentQuestion.id];
  };

  if (isComplete) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-green-600">Document Ready!</CardTitle>
          <CardDescription>
            Your custom legal document has been created based on your answers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="mt-2 font-medium text-green-800 dark:text-green-300">
              Document successfully generated
            </p>
          </div>
          
          <div className="border rounded-lg p-4 mt-4">
            <h4 className="font-medium mb-2">Document Summary:</h4>
            <ul className="space-y-2">
              <li><strong>Type:</strong> {answers['start']}</li>
              <li><strong>Purpose:</strong> {answers['purpose']}</li>
              <li><strong>Parties:</strong> {answers['parties']}</li>
              <li><strong>Timeline:</strong> {answers['timeline']}</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => {
              setAnswers({});
              setQuestionHistory(['start']);
              setCurrentQuestionId('start');
              setIsComplete(false);
            }}
          >
            Start Over
          </Button>
          <Button className="bg-rocket-blue-500">
            Download Document
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
        <CardDescription>
          Step {questionHistory.length} of {Object.keys(questions).length - 1}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderQuestionInput()}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleBack}
          disabled={questionHistory.length <= 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button 
          onClick={() => handleNext()}
          disabled={!canAdvance()}
          className="bg-rocket-blue-500"
        >
          {currentQuestion.type === 'confirmation' ? (
            <>
              Complete <Send className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConditionalForm;
