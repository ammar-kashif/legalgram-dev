import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, Calendar as CalendarIcon, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import CountryStateAPI from 'countries-states-cities';
import UserInfoStep from "@/components/UserInfoStep";

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
  type: 'text' | 'select' | 'textarea' | 'confirmation' | 'date' | 'number' | 'party' | 'witness';
  text: string;
  options?: string[];
  nextQuestionId?: Record<string, string>;
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

// Party interface (Affiant/Recipient)
interface Party {
  name: string;
  address: string;
  phone?: string;
  city?: string;
  state?: string;
}

// Gift Details interface
interface GiftDetails {
  description: string;
  relationship: string;
}

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'location_selection': {
    id: 'location_selection',
    title: 'Location Selection',
    description: 'Select the country and state/province where this Gift Affidavit will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'affiant_info'
  },
  'affiant_info': {
    id: 'affiant_info',
    title: 'Affiant Information',
    description: 'Enter details of the person making the gift (affiant)',
    questions: ['affiant_info'],
    nextSectionId: 'recipient_info'
  },
  'recipient_info': {
    id: 'recipient_info',
    title: 'Recipient Information',
    description: 'Enter details of the person receiving the gift',
    questions: ['recipient_info'],
    nextSectionId: 'gift_details'
  },
  'gift_details': {
    id: 'gift_details',
    title: 'Gift Details',
    description: 'Specify the gift description and relationship',
    questions: ['gift_description', 'relationship', 'transfer_date'],
    nextSectionId: 'transfer_details'
  },
  'transfer_details': {
    id: 'transfer_details',
    title: 'Transfer Details',
    description: 'Provide details about the transfer date and any side deals',
    questions: ['transfer_date', 'side_deals'],
    nextSectionId: 'user_info_step'
  },
  'user_info_step': {
    id: 'user_info_step',
    title: 'Contact Information',
    description: 'Provide your contact information to generate the document',
    questions: ['user_info_step'],
    nextSectionId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    title: 'Review and Confirmation',
    description: 'Review all information before generating your Gift Affidavit',
    questions: ['confirmation'],
  }
};

// Questions definition
const questions: Record<string, Question> = {
  'country': {
    id: 'country',
    type: 'select',
    text: 'In which country will this Gift Affidavit be executed?',
    options: getAllCountries().map(country => `${country.id}:${country.name}`),
    defaultNextId: 'state'
  },
  'state': {
    id: 'state',
    type: 'select',
    text: 'In which state/province will this Gift Affidavit be executed?',
    options: []
  },
  'affiant_info': {
    id: 'affiant_info',
    type: 'party',
    text: 'Enter the affiant\'s (gift giver\'s) information'
  },
  'recipient_info': {
    id: 'recipient_info',
    type: 'party',
    text: 'Enter the recipient\'s (gift receiver\'s) information'
  },
  'gift_description': {
    id: 'gift_description',
    type: 'textarea',
    text: 'Describe the gift being given (be specific about the item, amount, or property)'
  },
  'relationship': {
    id: 'relationship',
    type: 'text',
    text: 'What is your relationship to the recipient? (e.g., parent, sibling, friend, etc.)'
  },
  'transfer_date': {
    id: 'transfer_date',
    type: 'date',
    text: 'What is the date of transfer of the gift?'
  },
  'governing_jurisdiction': {
    id: 'governing_jurisdiction',
    type: 'select',
    text: 'Which jurisdiction\'s laws will govern this Gift Affidavit?',
    options: getAllCountries().map(country => `${country.id}:${country.name}`)
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Please review all the information you have provided and confirm that it is accurate.'
  }
};

const GiftAffidavitForm = () => {
  const navigate = useNavigate();
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [affiant, setAffiant] = useState<Party>({ name: '', address: '', phone: '', city: '', state: '' });
  const [recipient, setRecipient] = useState<Party>({ name: '', address: '', city: '', state: '' });
  const [giftDetails, setGiftDetails] = useState<GiftDetails>({ description: '', relationship: '' });
  const [transferDate, setTransferDate] = useState<Date>();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const currentSection = sections[currentSectionId];

  // Helper function to get available states for selected country
  const getStatesForCountry = (countryAnswer: string): string[] => {
    if (!countryAnswer) return [];
    const countryId = parseInt(countryAnswer.split(':')[0]);
    const states = getStatesByCountry(countryId);
    return states.map(state => `${state.id}:${state.name}`);
  };

  // Update state options when country is selected
  const updateStateOptions = (countryAnswer: string) => {
    const stateOptions = getStatesForCountry(countryAnswer);
    questions['state'].options = stateOptions;
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // Update state options when country changes
    if (questionId === 'country') {
      updateStateOptions(value);
      // Reset state selection when country changes
      setAnswers(prev => ({ ...prev, state: '' }));
    }
  };

  const handlePartyChange = (partyType: 'affiant' | 'recipient', field: string, value: string) => {
    if (partyType === 'affiant') {
      setAffiant(prev => ({ ...prev, [field]: value }));
    } else {
      setRecipient(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleGiftDetailsChange = (field: string, value: string) => {
    setGiftDetails(prev => ({ ...prev, [field]: value }));
  };

  const canAdvance = (): boolean => {
    const currentQuestions = currentSection.questions;
    
    for (const questionId of currentQuestions) {
      const question = questions[questionId];
      
      if (question.type === 'party') {
        if (questionId === 'affiant_info') {
          if (!affiant.name || !affiant.address || !affiant.phone) return false;
        } else if (questionId === 'recipient_info') {
          if (!recipient.name || !recipient.address) return false;
        }
      } else if (question.type === 'textarea') {
        if (questionId === 'gift_description') {
          if (!giftDetails.description) return false;
        }
      } else if (question.type === 'text') {
        if (questionId === 'relationship') {
          if (!giftDetails.relationship) return false;
        }
      } else if (question.type === 'date') {
        if (questionId === 'transfer_date') {
          if (!transferDate) return false;
        }
      } else if (question.type === 'confirmation') {
        return answers[questionId] === 'confirmed';
      } else {
        if (!answers[questionId]) return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!canAdvance()) return;

    if (currentSectionId === 'user_info_step') {
      setIsComplete(true);
      return;
    }

    const nextSectionId = currentSection.nextSectionId;
    if (nextSectionId) {
      setCurrentSectionId(nextSectionId);
      setSectionHistory(prev => [...prev, nextSectionId]);
    }
  };

  const handleBack = () => {
    if (sectionHistory.length > 1) {
      const newHistory = sectionHistory.slice(0, -1);
      setSectionHistory(newHistory);
      setCurrentSectionId(newHistory[newHistory.length - 1]);
    }
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("GIFT AFFIDAVIT", 105, 30, { align: "center" });
    
    let yPosition = 60;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Affiant statement
    doc.text(`I, ${affiant.name}, being duly sworn, do depose and say:`, 20, yPosition);
    yPosition += 20;
    
    doc.text(`That I reside at ${affiant.address}, ${affiant.city}, ${affiant.state},`, 20, yPosition);
    yPosition += 10;
    doc.text(`my telephone number is ${affiant.phone}, and I am ${giftDetails.relationship}`, 20, yPosition);
    yPosition += 10;
    doc.text(`of ${recipient.name}, ${recipient.city}, ${recipient.state}.`, 20, yPosition);
    yPosition += 20;
    
    doc.text(`That I am giving or have given ${giftDetails.description}.`, 20, yPosition);
    yPosition += 20;
    
    doc.text("3. This is an outright gift, with no repayment expected or implied either", 20, yPosition);
    yPosition += 10;
    doc.text("in the form of cash or by future services.", 20, yPosition);
    yPosition += 20;
    
    doc.text(`4. There are no side deals or other terms, conditions, understandings or`, 20, yPosition);
    yPosition += 10;
    doc.text(`agreements either verbal or written between ${recipient.name}, myself or`, 20, yPosition);
    yPosition += 10;
    doc.text("any other party concerning the Gift as identified above.", 20, yPosition);
    yPosition += 20;
    
    const formattedDate = transferDate ? format(transferDate, 'MMMM d, yyyy') : '_____________';
    doc.text(`5. That the date of transfer of the gift is ${formattedDate}.`, 20, yPosition);
    yPosition += 30;
    
    doc.text("The undersigned certifies that the information and statements in this", 20, yPosition);
    yPosition += 10;
    doc.text("affidavit are true and complete.", 20, yPosition);
    yPosition += 30;
    
    // Signature lines
    doc.text("Affiant's Name: ___________________________________", 20, yPosition);
    yPosition += 15;
    doc.text("Affiant's Signature: ________________________________", 20, yPosition);
    yPosition += 15;
    doc.text("Date: ___________________", 20, yPosition);
    yPosition += 25;
    
    // Notary section
    doc.text("Subscribed and sworn to (or affirmed) before me on this ____ day of", 20, yPosition);
    yPosition += 10;
    doc.text("______, 20__, by " + affiant.name + ",", 20, yPosition);
    yPosition += 10;
    doc.text("who is personally known to me or has provided satisfactory proof of identity.", 20, yPosition);
    yPosition += 20;
    
    doc.text("Signature of Notary Public: ___________________________", 20, yPosition);
    yPosition += 15;
    doc.text("Name of Notary Public: _______________________________", 20, yPosition);
    yPosition += 15;
    doc.text("My Commission Expires: _____________________________", 20, yPosition);
    yPosition += 15;
    doc.text("Notary Seal:", 20, yPosition);
    
    // New page for instructions
    doc.addPage();
    yPosition = 30;
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Make It Legal", 20, yPosition);
    yPosition += 20;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`This Affidavit should be signed in front of a notary public by ${affiant.name}.`, 20, yPosition);
    yPosition += 10;
    doc.text("Once signed in front of a notary, this document should be delivered to the", 20, yPosition);
    yPosition += 10;
    doc.text("appropriate court for filing.", 20, yPosition);
    yPosition += 20;
    
    doc.setFont("helvetica", "bold");
    doc.text("Copies", 20, yPosition);
    yPosition += 15;
    
    doc.setFont("helvetica", "normal");
    doc.text("The original Affidavit should be filed with the Clerk of Court or delivered", 20, yPosition);
    yPosition += 10;
    doc.text("to the requesting business.", 20, yPosition);
    yPosition += 15;
    
    doc.text("The Affiant should maintain a copy of the Affidavit. Your copy should be", 20, yPosition);
    yPosition += 10;
    doc.text("kept in a safe place.", 20, yPosition);
    yPosition += 20;
    
    doc.setFont("helvetica", "bold");
    doc.text("Additional Assistance", 20, yPosition);
    yPosition += 15;
    
    doc.setFont("helvetica", "normal");
    doc.text("If you are unsure or have questions regarding this Affidavit or need", 20, yPosition);
    yPosition += 10;
    doc.text("additional assistance with special situations or circumstances, use", 20, yPosition);
    yPosition += 10;
    doc.text("Legal Gram's Find A Lawyer search engine to find a lawyer in your area", 20, yPosition);
    yPosition += 10;
    doc.text("to assist you in this matter.", 20, yPosition);
    
    try {
      doc.save('gift-affidavit.pdf');
      toast.success("Document generated successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate document");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderSectionQuestions = () => {
    const currentQuestions = currentSection.questions;
    
    return currentQuestions.map(questionId => {
      const question = questions[questionId];
      
      if (question.type === 'select') {
        if (questionId === 'state') {
          updateStateOptions(answers['country'] || '');
        }
        
        return (
          <div key={questionId} className="space-y-2">
            <Label htmlFor={questionId} className="text-sm font-medium">{question.text}</Label>
            <Select
              value={answers[questionId] || ''}
              onValueChange={(value) => handleAnswerChange(questionId, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Please select..." />
              </SelectTrigger>
              <SelectContent>
                {(question.options || []).map((option) => {
                  const [id, name] = option.split(':');
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
      } else if (question.type === 'party') {
        const isAffiant = questionId === 'affiant_info';
        const party = isAffiant ? affiant : recipient;
        const handleChange = (field: string, value: string) => 
          handlePartyChange(isAffiant ? 'affiant' : 'recipient', field, value);
        
        return (
          <div key={questionId} className="space-y-4">
            <Label className="text-sm font-medium">{question.text}</Label>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor={`${questionId}_name`}>Full Name</Label>
                <Input
                  id={`${questionId}_name`}
                  placeholder="Enter full name"
                  value={party.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`${questionId}_address`}>Street Address</Label>
                <Input
                  id={`${questionId}_address`}
                  placeholder="Enter street address"
                  value={party.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`${questionId}_city`}>City</Label>
                  <Input
                    id={`${questionId}_city`}
                    placeholder="Enter city"
                    value={party.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`${questionId}_state`}>State/Province</Label>
                  <Input
                    id={`${questionId}_state`}
                    placeholder="Enter state/province"
                    value={party.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                  />
                </div>
              </div>
              {isAffiant && (
                <div>
                  <Label htmlFor={`${questionId}_phone`}>Phone Number</Label>
                  <Input
                    id={`${questionId}_phone`}
                    placeholder="Enter phone number"
                    value={party.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        );
      } else if (question.type === 'textarea') {
        return (
          <div key={questionId} className="space-y-2">
            <Label htmlFor={questionId} className="text-sm font-medium">{question.text}</Label>
            <Textarea
              id={questionId}
              placeholder="Enter description..."
              value={giftDetails.description}
              onChange={(e) => handleGiftDetailsChange('description', e.target.value)}
              rows={4}
            />
          </div>
        );
      } else if (question.type === 'text') {
        return (
          <div key={questionId} className="space-y-2">
            <Label htmlFor={questionId} className="text-sm font-medium">{question.text}</Label>
            <Input
              id={questionId}
              placeholder="Enter relationship..."
              value={giftDetails.relationship}
              onChange={(e) => handleGiftDetailsChange('relationship', e.target.value)}
            />
          </div>
        );
      } else if (question.type === 'date') {
        return (
          <div key={questionId} className="space-y-2">
            <Label className="text-sm font-medium">{question.text}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !transferDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {transferDate ? format(transferDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={transferDate}
                  onSelect={setTransferDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      } else if (question.type === 'confirmation') {
        return (
          <div key={questionId} className="space-y-4">
            <Label className="text-sm font-medium">{question.text}</Label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={answers[questionId] === 'confirmed'}
                  onChange={(e) => handleAnswerChange(questionId, e.target.checked ? 'confirmed' : '')}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">I confirm that all information provided is accurate and complete.</span>
              </label>
            </div>
          </div>
        );
      }
      
      return null;
    });
  };

  const renderFormSummary = () => {
    const countryName = answers.country ? getCountryName(answers.country.split(':')[0]) : '';
    const stateName = answers.state ? getStateName(answers.country?.split(':')[0] || '', answers.state.split(':')[0]) : '';
    
    return (
      <div className="space-y-4 text-sm">
        <div>
          <strong>Jurisdiction:</strong> {stateName}, {countryName}
        </div>
        <div>
          <strong>Affiant:</strong> {affiant.name}<br />
          <strong>Address:</strong> {affiant.address}, {affiant.city}, {affiant.state}<br />
          <strong>Phone:</strong> {affiant.phone}
        </div>
        <div>
          <strong>Recipient:</strong> {recipient.name}<br />
          <strong>Address:</strong> {recipient.address}, {recipient.city}, {recipient.state}
        </div>
        <div>
          <strong>Gift Description:</strong> {giftDetails.description}
        </div>
        <div>
          <strong>Relationship:</strong> {giftDetails.relationship}
        </div>
        <div>
          <strong>Transfer Date:</strong> {transferDate ? format(transferDate, 'MMMM d, yyyy') : 'Not specified'}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Gift Affidavit.
          </p>
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
    <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
      <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-green-600">Gift Affidavit</CardTitle>
          <CardDescription>
            Review your Gift Affidavit details below before generating the final document.
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
              setAffiant({ name: '', address: '', phone: '', city: '', state: '' });
              setRecipient({ name: '', address: '', city: '', state: '' });
              setGiftDetails({ description: '', relationship: '' });
              setTransferDate(undefined);
            }}
          >
            Start Over
          </Button>
          <Button onClick={generatePDF}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Generate PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
  }

  if (currentSectionId === 'user_info_step') {
    return (
      <UserInfoStep
        onBack={handleBack}
        onGenerate={generatePDF}
        documentType="Gift Affidavit"
        isGenerating={isGeneratingPDF}
      />
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
        {currentSectionId === 'location_selection' && (
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/gift-affidavit-info')}
              className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
            >
              <FileText className="w-4 h-4 mr-2" />
              Learn More About Gift Affidavits
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="text-black">
        <div className="grid grid-cols-1 gap-y-2">
          {renderSectionQuestions()}
        </div>
      </CardContent>
      {currentSectionId !== 'user_info_step' && (
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

export default GiftAffidavitForm;
