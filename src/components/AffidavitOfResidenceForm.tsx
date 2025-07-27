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
import UserInfoStep from "./UserInfoStep";

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
  type: 'text' | 'textarea' | 'confirmation' | 'select' | 'date' | 'number' | 'radio';
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
    description: 'Select the country and state where this affidavit will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'person_status'
  },
  'person_status': {
    id: 'person_status',
    title: 'Person Status',
    description: 'Specify whether the person this affidavit concerns is alive or deceased',
    questions: ['person_status'],
    nextSectionId: 'affiant_info'
  },
  'affiant_info': {
    id: 'affiant_info',
    title: 'Affiant Information',
    description: 'Enter your information as the person making this affidavit',
    questions: ['affiant_name', 'affiant_address', 'county'],
    nextSectionId: 'residence_details'
  },
  'residence_details': {
    id: 'residence_details',
    title: 'Residence Details',
    description: 'Provide residence information',
    questions: [], // Will be populated dynamically based on person_status
    nextSectionId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    title: 'Confirmation',
    description: 'Review and confirm your information',
    questions: ['confirmation'],
    nextSectionId: 'user_info'
  },
  'user_info': {
    id: 'user_info',
    title: 'Contact Information',
    description: 'Enter your contact information to generate the document',
    questions: []
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
    defaultNextId: 'person_status'
  },
  'person_status': {
    id: 'person_status',
    type: 'radio',
    text: 'Is the person this affidavit concerns alive or deceased?',
    options: ['alive', 'deceased'],
    defaultNextId: 'affiant_info'
  },
  'county': {
    id: 'county',
    type: 'text',
    text: 'Enter the county:',
    defaultNextId: 'affiant_name'
  },
  'affiant_name': {
    id: 'affiant_name',
    type: 'text',
    text: 'Your Full Name (Affiant):',
    defaultNextId: 'affiant_address'
  },
  'affiant_address': {
    id: 'affiant_address',
    type: 'textarea',
    text: 'Your Current Address:',
    defaultNextId: 'residence_details'
  },
  // For living person
  'residence_years': {
    id: 'residence_years',
    type: 'number',
    text: 'How many years have you resided at the current address?',
    defaultNextId: 'household_members'
  },
  'household_members': {
    id: 'household_members',
    type: 'textarea',
    text: 'List the names of individuals who reside with you at the above address:',
    defaultNextId: 'affidavit_date'
  },
  // For deceased person
  'deceased_name': {
    id: 'deceased_name',
    type: 'text',
    text: 'Full Name of the Deceased Person:',
    defaultNextId: 'death_date'
  },
  'death_date': {
    id: 'death_date',
    type: 'date',
    text: 'Date of Death:',
    defaultNextId: 'deceased_address'
  },
  'deceased_address': {
    id: 'deceased_address',
    type: 'textarea',
    text: 'Legal Residence Address of the Deceased at Time of Death:',
    defaultNextId: 'residence_duration'
  },
  'residence_duration': {
    id: 'residence_duration',
    type: 'text',
    text: 'How long was the deceased a resident of this state prior to death?',
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
    text: 'Thank you for providing the information. We will generate your Affidavit of Residence based on your answers.',
  }
};

const AffidavitOfResidenceForm = () => {
  const navigate = useNavigate();
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const currentSection = sections[currentSectionId];

  // Update residence_details questions based on person_status
  const updateResidenceDetailsQuestions = () => {
    if (answers.person_status === 'alive') {
      sections.residence_details.questions = ['residence_years', 'household_members', 'affidavit_date'];
    } else if (answers.person_status === 'deceased') {
      sections.residence_details.questions = ['deceased_name', 'death_date', 'deceased_address', 'residence_duration', 'affidavit_date'];
    }
  };

  const handleNext = () => {
    try {
      if (currentSectionId === 'confirmation') {
        const nextSectionId = currentSection?.nextSectionId;
        if (nextSectionId) {
          setSectionHistory([...sectionHistory, nextSectionId]);
          setCurrentSectionId(nextSectionId);
        }
        return;
      }

      const nextSectionId = currentSection?.nextSectionId;
      
      if (!nextSectionId) {
        setIsComplete(true);
        return;
      }
      
      // Update residence details questions before moving to that section
      if (nextSectionId === 'residence_details') {
        updateResidenceDetailsQuestions();
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
              placeholder="Enter number"
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
                    "w-full justify-start text-left font-normal",
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
      case 'radio':
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="space-y-2">
              {question.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${questionId}_${option}`}
                    name={questionId}
                    value={option}
                    checked={answers[questionId] === option}
                    onChange={(e) => handleAnswer(questionId, e.target.value)}
                    className="text-primary"
                  />
                  <Label htmlFor={`${questionId}_${option}`} className="text-black capitalize">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
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
    // Update questions for residence_details section if needed
    if (currentSectionId === 'residence_details') {
      updateResidenceDetailsQuestions();
    }
    
    return currentSection.questions.map(questionId => renderQuestionInput(questionId));
  };

  const canAdvance = () => {
    if (currentSectionId === 'confirmation') return true;
    
    if (currentSectionId === 'location_selection') {
      return answers.country && answers.state;
    }
    if (currentSectionId === 'person_status') {
      return answers.person_status;
    }
    if (currentSectionId === 'affiant_info') {
      return answers.affiant_name && answers.affiant_address && answers.county;
    }
    if (currentSectionId === 'residence_details') {
      if (answers.person_status === 'alive') {
        return answers.residence_years && answers.household_members && answers.affidavit_date;
      } else if (answers.person_status === 'deceased') {
        return answers.deceased_name && answers.death_date && answers.deceased_address && answers.residence_duration && answers.affidavit_date;
      }
    }
    
    return true;
  };

  const generateAffidavitOfResidencePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      console.log("Generating Affidavit of Residence PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("AFFIDAVIT OF RESIDENCE", 105, 20, { align: "center" });
      
      let y = 40;
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
      
      const countryName = answers.country ? getCountryName(answers.country.split('|')[0]) : '[COUNTRY]';
      const stateName = answers.state ? getStateName(answers.country?.split('|')[0] || '', answers.state.split('|')[0]) : '[STATE]';
      const countyName = answers.county || '[COUNTY]';
      
      if (answers.person_status === 'alive') {
        // Affidavit for Living Person
        const openingText = `I, ${answers.affiant_name || '_______'}, being of lawful age and a resident at ${answers.affiant_address || '_________________'} in ${countyName}, do on oath and under penalties of perjury, depose and say:`;
        y = addTextWithWrap(openingText, 15, y);
        y += lineHeight * 1.5;
        
        const residenceText = `I have resided in ${countyName}, state ${stateName} for ${answers.residence_years || '_____'} years.`;
        y = addTextWithWrap(residenceText, 15, y);
        y += lineHeight * 1.5;
        
        const purposeText = "I made this affidavit for no improper use.";
        y = addTextWithWrap(purposeText, 15, y);
        y += lineHeight * 1.5;
        
        const householdText = `The following individuals reside with me at the above address: ${answers.household_members || '_________________'}`;
        y = addTextWithWrap(householdText, 15, y);
        y += lineHeight * 1.5;
        
      } else {
        // Affidavit for Deceased Person
        const openingText = `I, ${answers.affiant_name || '_______'}, being of lawful age and a resident at ${answers.affiant_address || '_________________'} in ${countyName}, do on oath and under penalties of perjury, depose and say:`;
        y = addTextWithWrap(openingText, 15, y);
        y += lineHeight * 1.5;
        
        const deceasedName = answers.deceased_name || '_______________________';
        const deathDate = answers.death_date ? format(new Date(answers.death_date), 'MMMM dd, yyyy') : '_________________';
        
        const estateText = `That I am a disinterested party in the estate of ${deceasedName} who died on ${deathDate}. At the time of death ${deceasedName}'s legal residence was at ${answers.deceased_address || '_______________'}, ${countyName} County and ${deceasedName} was a resident of state of ${stateName} for ${answers.residence_duration || '___________________'} prior to death, and was not the resident of any other state at the time of death.`;
        y = addTextWithWrap(estateText, 15, y);
        y += lineHeight * 1.5;
      }
      
      // Certification statement
      const certificationText = `I certify under penalty of perjury under ${stateName} law that I know the contents of this Affidavit signed by me and that the statements are true and correct.`;
      y = addTextWithWrap(certificationText, 15, y);
      y += lineHeight * 2;
      
      // Signature section
      doc.text("_________________________________", 15, y);
      y += lineHeight;
      doc.text(`${answers.affiant_name || '[AFFIANT NAME]'}`, 15, y);
      y += lineHeight;
      doc.text("Affiant", 15, y);
      y += lineHeight * 2;
      
      const affidavitDate = answers.affidavit_date ? format(new Date(answers.affidavit_date), 'MMMM dd, yyyy') : '_____________________';
      doc.text(`Date: ${affidavitDate}`, 15, y);
      y += lineHeight * 2;
      
      // State and Country section
      doc.text(`STATE OF ${stateName.toUpperCase()}, COUNTRY OF ${countryName.toUpperCase()}`, 15, y);
      y += lineHeight * 2;
      
      // Notary section
      doc.text("_________________________________", 15, y);
      y += lineHeight;
      doc.text("Notary Public", 15, y);
      y += lineHeight * 3;
      
      // Add instructional page
      doc.addPage();
      y = 20;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Make It Legal", 15, y);
      y += lineHeight * 2;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      const notaryInstructions = `This Affidavit should be signed in front of a notary public by ${answers.affiant_name || '[AFFIANT NAME]'}.`;
      y = addTextWithWrap(notaryInstructions, 15, y);
      y += lineHeight;
      
      const filingInstructions = "Once signed in front of a notary, this document should be delivered to the appropriate court for filing.";
      y = addTextWithWrap(filingInstructions, 15, y);
      y += lineHeight * 1.5;
      
      doc.setFont("helvetica", "bold");
      doc.text("Copies", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const copiesText = "The original Affidavit should be filed with the Clerk of Court or delivered to the requesting business. The Affiant should maintain a copy of the Affidavit. Your copy should be kept in a safe place. If you signed a paper copy of your document, you can use Legal Gram to store and share it. Safe and secure in your Legal Gram File Manager, you can access it any time from any computer, as well as share it for future reference.";
      y = addTextWithWrap(copiesText, 15, y);
      y += lineHeight * 1.5;
      
      doc.setFont("helvetica", "bold");
      doc.text("Additional Assistance", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const assistanceText = "If you are unsure or have questions regarding this Affidavit or need additional assistance with special situations or circumstances, use Legal Gram's Find A Lawyer search engine to find a lawyer in your area to assist you in this matter.";
      y = addTextWithWrap(assistanceText, 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const personType = answers.person_status === 'alive' ? 'living' : 'deceased';
      const filename = `affidavit_of_residence_${personType}_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Affidavit of Residence successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Affidavit of Residence");
      return null;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (currentSectionId === 'user_info') {
    return (
      <UserInfoStep
        onBack={handleBack}
        onGenerate={generateAffidavitOfResidencePDF}
        documentType="Affidavit of Residence"
        isGenerating={isGeneratingPDF}
      />
    );
  }

  if (isComplete) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-green-800">Affidavit of Residence Complete!</CardTitle>
          <CardDescription>
            Your document has been generated successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Button 
            onClick={generateAffidavitOfResidencePDF}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={isGeneratingPDF}
          >
            <FileText className="w-4 h-4 mr-2" />
            {isGeneratingPDF ? "Generating..." : "Download PDF"}
          </Button>
          <div>
            <Button 
              variant="outline" 
              onClick={() => {
                setCurrentSectionId('location_selection');
                setSectionHistory(['location_selection']);
                setAnswers({});
                setIsComplete(false);
              }}
            >
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentSection) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
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
    );
  }

  return (
    <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
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
                onClick={() => window.open('/affidavit-of-residence-info', '_blank')}
                className="text-bright-orange-600 border-bright-orange-600 hover:bg-bright-orange-50"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn More About Affidavit of Residence
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="text-black">
          <div className="grid grid-cols-1 gap-y-2">
            {renderSectionQuestions()}
          </div>
        </CardContent>
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
      </Card>
    </div>
  );
};

export default AffidavitOfResidenceForm;