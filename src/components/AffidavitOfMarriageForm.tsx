import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, Calendar as CalendarIcon, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import CountryStateAPI from 'countries-states-cities';
import UserInfoStep from '@/components/UserInfoStep';

// Define section structure
interface Section {
  id: string;
  title: string;
  description?: string;
  questions: string[];
  nextSectionId?: string;
}

// Define the question type interface
interface Question {
  id: string;
  type: 'text' | 'textarea' | 'confirmation' | 'select' | 'date' | 'number';
  text: string;
  options?: string[];
  defaultNextId?: string;
}

// Define interfaces for the countries-states-cities data structure
interface CountryData {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  phone_code: string;
  capital: string;
  currency: string;
  native: string;
  region: string;
  subregion: string;
  emoji: string;
}

interface StateData {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  state_code: string;
}

// Country to states/provinces mapping using comprehensive database with proper ID relationships
const getAllCountries = (): CountryData[] => {
  return CountryStateAPI.getAllCountries();
};

const getStatesByCountry = (countryId: number): StateData[] => {
  return CountryStateAPI.getStatesOfCountry(countryId);
};

// Helper functions to get display names from IDs
const getCountryName = (countryId: string): string => {
  const country = CountryStateAPI.getAllCountries().find(c => c.id.toString() === countryId);
  return country?.name || `Country ID: ${countryId}`;
};

const getStateName = (countryId: string, stateId: string): string => {
  const country = CountryStateAPI.getAllCountries().find(c => c.id.toString() === countryId);
  if (!country) return `State ID: ${stateId}`;
  
  const states = CountryStateAPI.getStatesOfCountry(country.id);
  const state = states.find(s => s.id.toString() === stateId);
  return state?.name || `State ID: ${stateId}`;
};

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'location_selection': {
    id: 'location_selection',
    title: 'Jurisdiction Information',
    description: 'Select the country, state, and county where this affidavit will be executed',
    questions: ['country', 'state', 'county'],
    nextSectionId: 'applicant_info'
  },
  'applicant_info': {
    id: 'applicant_info',
    title: 'Applicant Information',
    description: 'Enter information about the person whose name change is being verified',
    questions: ['current_name', 'name_assumed_date', 'former_name', 'birth_date', 'current_address'],
    nextSectionId: 'relationship_info'
  },
  'relationship_info': {
    id: 'relationship_info',
    title: 'Affiant Relationship Information',
    description: 'Enter your relationship to the applicant and knowledge details',
    questions: ['years_known', 'known_by_current', 'known_by_former', 'relationship_to_applicant', 'reason_for_variance'],
    nextSectionId: 'affiant_info'
  },
  'affiant_info': {
    id: 'affiant_info',
    title: 'Affiant Information',
    description: 'Enter your information as the person making this affidavit',
    questions: ['affiant_name', 'affidavit_date'],
    nextSectionId: 'user_info'
  },
  'user_info': {
    id: 'user_info',
    title: 'Contact Information',
    description: 'Provide your contact information',
    questions: [],
    nextSectionId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    title: 'Confirmation',
    description: 'Review and confirm your information',
    questions: ['confirmation']
  }
};

// Define the question flow
const questions: Record<string, Question> = {
  'country': {
    id: 'country',
    type: 'select',
    text: 'Select the country where this affidavit will be executed:',
    options: [],
    defaultNextId: 'state'
  },
  'state': {
    id: 'state',
    type: 'select',
    text: 'Select the state/province where this affidavit will be executed:',
    options: [],
    defaultNextId: 'county'
  },
  'county': {
    id: 'county',
    type: 'text',
    text: 'Enter the county where this affidavit will be executed:',
    defaultNextId: 'current_name'
  },
  'current_name': {
    id: 'current_name',
    type: 'text',
    text: 'Current Name of Applicant:',
    defaultNextId: 'name_assumed_date'
  },
  'name_assumed_date': {
    id: 'name_assumed_date',
    type: 'date',
    text: 'Approximate Date Current Name Was Assumed:',
    defaultNextId: 'former_name'
  },
  'former_name': {
    id: 'former_name',
    type: 'text',
    text: 'Former Name of Applicant:',
    defaultNextId: 'birth_date'
  },
  'birth_date': {
    id: 'birth_date',
    type: 'date',
    text: 'Applicant\'s Date of Birth:',
    defaultNextId: 'current_address'
  },
  'current_address': {
    id: 'current_address',
    type: 'textarea',
    text: 'Current residential address of the Applicant:',
    defaultNextId: 'years_known'
  },
  'years_known': {
    id: 'years_known',
    type: 'number',
    text: 'Number of Years You Have Known the Applicant:',
    defaultNextId: 'known_by_current'
  },
  'known_by_current': {
    id: 'known_by_current',
    type: 'textarea',
    text: 'How the Applicant has been known by their Current Name (provide details):',
    defaultNextId: 'known_by_former'
  },
  'known_by_former': {
    id: 'known_by_former',
    type: 'textarea',
    text: 'How the Applicant has been known by their Former Name (provide details):',
    defaultNextId: 'relationship_to_applicant'
  },
  'relationship_to_applicant': {
    id: 'relationship_to_applicant',
    type: 'text',
    text: 'Your Relationship to the Applicant:',
    defaultNextId: 'reason_for_variance'
  },
  'reason_for_variance': {
    id: 'reason_for_variance',
    type: 'textarea',
    text: 'The variance in the Applicant\'s name as it appears on their birth records and the name currently in use is due to:',
    defaultNextId: 'affiant_name'
  },
  'affiant_name': {
    id: 'affiant_name',
    type: 'text',
    text: 'Affiant\'s Full Name (your name):',
    defaultNextId: 'affidavit_date'
  },
  'affidavit_date': {
    id: 'affidavit_date',
    type: 'date',
    text: 'Date of Affidavit:',
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your Affidavit of Marriage based on your answers.',
  }
};

const AffidavitOfMarriageForm = () => {
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const currentSection = sections[currentSectionId];

  const handleNext = () => {
    try {
      const nextSectionId = currentSection?.nextSectionId;
      
      if (!nextSectionId) {
        setIsComplete(true);
        return;
      }
      
      if (sections[nextSectionId]) {
        setSectionHistory([...sectionHistory, nextSectionId]);
        setCurrentSectionId(nextSectionId);
      } else {
        console.error(`Next section ${nextSectionId} does not exist`);
        toast.error("Navigation error. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  
  const handleBack = () => {
    if (sectionHistory.length > 1) {
      const newHistory = [...sectionHistory];
      newHistory.pop();
      setSectionHistory(newHistory);
      setCurrentSectionId(newHistory[newHistory.length - 1]);
    }
  };

  const generateAffidavitOfMarriagePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      console.log("Generating Affidavit of Marriage PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("AFFIDAVIT OF MARRIAGE", 105, 20, { align: "center" });
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      // Helper function to add text with line wrapping and page breaks
      const addTextWithWrap = (text: string, x: number, startY: number, maxWidth: number = 180) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        let currentY = startY;
        
        lines.forEach((line: string) => {
          if (currentY > pageHeight - 30) {
            doc.addPage();
            currentY = 20;
          }
          doc.text(line, x, currentY);
          currentY += lineHeight;
        });
        
        return currentY;
      };
      
      // Using the exact legal template text structure
      const countryName = answers.country ? getCountryName(answers.country.split('|')[0]) : '[COUNTRY]';
      const stateName = answers.state ? getStateName(answers.country?.split('|')[0] || '', answers.state.split('|')[0]) : '[STATE]';
      const countyName = answers.county || '[COUNTY]';
      
      // Header section
      doc.text(`State of ${stateName}`, 15, y);
      y += lineHeight;
      doc.text(`County of ${countyName}`, 15, y);
      y += lineHeight * 2;
      
      // Main affidavit text based on the legal template
      const affidavitText = `I, ${answers.affiant_name || '_____________________________________'}, of legal age, do hereby make this affidavit and state as follows:`;
      y = addTextWithWrap(affidavitText, 15, y);
      y += lineHeight;
      
      // Add all the content...
      const currentNameText = `1. The current name of the applicant is ${answers.current_name || '_____________________________________'}.`;
      y = addTextWithWrap(currentNameText, 15, y);
      y += lineHeight;
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `affidavit_of_marriage_${timestamp}.pdf`;
      
      doc.save(filename);
      toast.success("Affidavit of Marriage successfully generated!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Affidavit of Marriage");
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };
  
  const renderQuestionInput = (questionId: string) => {
    const question = questions[questionId];
    
    switch (question.type) {
      case 'text':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Input
              id={questionId}
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Type your answer"
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
            />
          </div>
        );
      case 'number':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Input
              id={questionId}
              type="number"
              min="0"
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Enter number of years"
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
            />
          </div>
        );
      case 'textarea':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Textarea
              id={questionId}
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Enter details"
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
              rows={3}
            />
          </div>
        );
      case 'date':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white rounded-lg shadow-sm",
                    !answers[questionId] && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {answers[questionId] ? answers[questionId] : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white rounded-lg shadow-sm">
                <Calendar
                  mode="single"
                  selected={answers[questionId] ? new Date(answers[questionId]) : undefined}
                  onSelect={(date) => handleAnswer(questionId, date ? format(date, 'yyyy-MM-dd') : '')}
                  initialFocus
                  className="p-3 pointer-events-auto bg-white rounded-lg shadow-sm"
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      case 'select':
        let options = question.options || [];
        
        if (questionId === 'country') {
          const countries = getAllCountries();
          options = countries.map(country => `${country.id}|${country.name}`);
        } else if (questionId === 'state' && answers.country) {
          const countryId = answers.country.split('|')[0];
          const states = getStatesByCountry(parseInt(countryId));
          options = states.map(state => `${state.id}|${state.name}`);
        }
        
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Select
              value={answers[questionId] || ''}
              onValueChange={(value) => {
                handleAnswer(questionId, value);
                if (questionId === 'country' && answers.state) {
                  handleAnswer('state', '');
                }
              }}
              disabled={questionId === 'state' && !answers.country}
            >
              <SelectTrigger className="mt-1 text-black w-full bg-white rounded-lg shadow-sm">
                <SelectValue placeholder={
                  questionId === 'state' && !answers.country 
                    ? "Please select a country first" 
                    : "Select an option"
                } />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-lg shadow-sm">
                {options.map((option) => {
                  const [id, name] = option.includes('|') ? option.split('|') : [option, option];
                  return (
                    <SelectItem key={id} value={option}>
                      {name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        );
      case 'confirmation':
        return (
          <div className="mt-4 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="mt-4 text-black">
              {question.text}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderSectionQuestions = () => {
    if (currentSectionId === 'user_info') {
      return (
        <UserInfoStep
          onBack={handleBack}
          onGenerate={generateAffidavitOfMarriagePDF}
          documentType="Affidavit of Marriage"
          isGenerating={isGeneratingPDF}
        />
      );
    }
    return currentSection.questions.map(questionId => renderQuestionInput(questionId));
  };

  const canAdvance = () => {
    if (currentSectionId === 'confirmation') return true;
    if (currentSectionId === 'user_info') return false;
    
    if (currentSectionId === 'location_selection') {
      return answers.country && answers.state && answers.county;
    }
    if (currentSectionId === 'applicant_info') {
      return answers.current_name && answers.name_assumed_date && answers.former_name && answers.birth_date && answers.current_address;
    }
    if (currentSectionId === 'relationship_info') {
      return answers.years_known && answers.known_by_current && answers.known_by_former && answers.relationship_to_applicant && answers.reason_for_variance;
    }
    if (currentSectionId === 'affiant_info') {
      return answers.affiant_name && answers.affidavit_date;
    }
    
    return true;
  };


  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Affidavit of Marriage Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Jurisdiction</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country.split('|')[0]) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state ? getStateName(answers.country?.split('|')[0] || '', answers.state.split('|')[0]) : 'Not provided'}</p>
              <p><strong>County:</strong> {answers.county || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Applicant Information</h4>
              <p><strong>Current Name:</strong> {answers.current_name || 'Not provided'}</p>
              <p><strong>Former Name:</strong> {answers.former_name || 'Not provided'}</p>
              <p><strong>Birth Date:</strong> {answers.birth_date || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Name Change Details</h4>
              <p><strong>Date Name Assumed:</strong> {answers.name_assumed_date || 'Not provided'}</p>
              <p><strong>Years Known:</strong> {answers.years_known || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Affiant Information</h4>
              <p><strong>Affiant Name:</strong> {answers.affiant_name || 'Not provided'}</p>
              <p><strong>Relationship:</strong> {answers.relationship_to_applicant || 'Not provided'}</p>
              <p><strong>Date:</strong> {answers.affidavit_date || 'Not provided'}</p>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-medium text-sm">Current Address</h4>
              <p>{answers.current_address || 'Not provided'}</p>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-medium text-sm">Reason for Name Variance</h4>
              <p>{answers.reason_for_variance || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Affidavit of Marriage.
          </p>
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm p-4">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-green-600">Affidavit of Marriage</CardTitle>
          <CardDescription>
            Review your affidavit details below before generating the final document.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderFormSummary()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => {
              setAnswers({});
              setSectionHistory(['location_selection']);
              setCurrentSectionId('location_selection');
              setIsComplete(false);
            }}
          >
            Start Over
          </Button>
          <Button 
            onClick={generateAffidavitOfMarriagePDF}
          >
            Generate Affidavit
          </Button>
        </CardFooter>
      </Card>
      </div>
    );
  }

  if (!currentSection) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm p-4">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <CardContent className="text-center p-4">
            <p className="text-red-500">An error occurred. Please refresh the page.</p>
            <Button 
              onClick={() => {
                setCurrentSectionId('location_selection');
                setSectionHistory(['location_selection']);
              }}
              className="mt-4"
            >
              Start Over
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm p-4">
      <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">{currentSection.title}</CardTitle>
        <CardDescription>
          {currentSection.description}
          <div className="mt-2 text-sm">
            Step {sectionHistory.length} of {Object.keys(sections).length}
          </div>
        </CardDescription>
        {/* Learn More button for first step only */}
        {currentSectionId === 'location_selection' && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => window.open('/affidavit-of-marriage-info', '_blank')}
              className="text-bright-orange-600 border-bright-orange-600 hover:bg-bright-orange-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Learn More About Affidavit of Marriage
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="text-black">
        {currentSectionId === 'user_info' ? (
          <UserInfoStep
            onBack={handleBack}
            onGenerate={generateAffidavitOfMarriagePDF}
            documentType="Affidavit of Marriage"
            isGenerating={isGeneratingPDF}
          />
        ) : (
          <div className="grid grid-cols-1 gap-y-2">
            {renderSectionQuestions()}
          </div>
        )}
      </CardContent>
      {currentSectionId !== 'user_info' && (
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={sectionHistory.length <= 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button 
            onClick={() => handleNext()}
            disabled={!canAdvance()}
          >
            {currentSectionId === 'confirmation' ? (
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
      )}
    </Card>
    </div>
  );
};

export default AffidavitOfMarriageForm;



