import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, Calendar as CalendarIcon } from "lucide-react";
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
  type: 'text' | 'select' | 'radio' | 'textarea' | 'confirmation' | 'date' | 'number' | 'party' | 'witness' | 'company';
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

// Party interface (Seller/Buyer)
interface Party {
  name: string;
  address: string;
}

// Company interface
interface Company {
  name: string;
  incorporationNumber: string;
  jurisdiction: string;
  sharesSold: string;
}

// Witness interface
interface Witness {
  name: string;
  cnic: string;
}

// Existing Shareholder interface
interface ExistingShareholder {
  name: string;
  offerLetterDate: string;
  refusalLetterDate: string;
  boardResolutionDate: string;
}

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'location_selection': {
    id: 'location_selection',
    title: 'Location Selection',
    description: 'Select the country and state/province where this Share Purchase Agreement will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'general_details'
  },
  'general_details': {
    id: 'general_details',
    title: 'General Details',
    description: 'Enter the basic details of the Share Purchase Agreement',
    questions: ['effective_date', 'agreement_location'],
    nextSectionId: 'seller_info'
  },
  'seller_info': {
    id: 'seller_info',
    title: 'Seller Information',
    description: 'Enter details of the party selling the shares',
    questions: ['seller_info'],
    nextSectionId: 'buyer_info'
  },
  'buyer_info': {
    id: 'buyer_info',
    title: 'Buyer Information',
    description: 'Enter details of the party buying the shares',
    questions: ['buyer_info'],
    nextSectionId: 'company_details'
  },
  'company_details': {
    id: 'company_details',
    title: 'Company Details',
    description: 'Enter information about the company whose shares are being transferred',
    questions: ['company_info'],
    nextSectionId: 'transaction_details'
  },
  'transaction_details': {
    id: 'transaction_details',
    title: 'Transaction Details',
    description: 'Specify the details of the share transfer',
    questions: ['share_transfer_date', 'share_certificates_delivery', 'indemnifying_party'],
    nextSectionId: 'existing_shareholder'
  },
  'existing_shareholder': {
    id: 'existing_shareholder',
    title: 'Existing Shareholder Details',
    description: 'Enter information about existing shareholder notifications',
    questions: ['existing_shareholder_info'],
    nextSectionId: 'witnesses'
  },  'witnesses': {
    id: 'witnesses',
    title: 'Witness Information',
    description: 'Enter witness information for the agreement. Witnesses are required to validate the legal execution of this agreement.',
    questions: ['witness1_info', 'witness2_info'],
    nextSectionId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    title: 'Confirmation',
    description: 'Review and confirm your information',
    questions: ['confirmation'],
    nextSectionId: 'user_info_step'
  },
  'user_info_step': {
    id: 'user_info_step',
    title: 'User Information',
    description: 'Enter your information to generate the document',
    questions: []
  }
};

// Define the question flow
const questions: Record<string, Question> = {
  'country': {
    id: 'country',
    type: 'select',
    text: 'Select the country where this Share Purchase Agreement will be executed:',
    options: [], // Will be populated dynamically from the database
    defaultNextId: 'state'
  },
  'state': {
    id: 'state',
    type: 'select',
    text: 'Select the state/province where this Share Purchase Agreement will be executed:',
    options: [], // Will be populated dynamically based on country selection
    defaultNextId: 'effective_date'
  },
  'effective_date': {
    id: 'effective_date',
    type: 'date',
    text: 'Effective Date of Agreement:',
    defaultNextId: 'agreement_location'
  },
  'agreement_location': {
    id: 'agreement_location',
    type: 'text',
    text: 'Location of Agreement Signing:',
    defaultNextId: 'seller_info'
  },
  'seller_info': {
    id: 'seller_info',
    type: 'party',
    text: 'Seller Information:',
    defaultNextId: 'buyer_info'
  },
  'buyer_info': {
    id: 'buyer_info',
    type: 'party',
    text: 'Buyer Information:',
    defaultNextId: 'company_info'
  },
  'company_info': {
    id: 'company_info',
    type: 'company',
    text: 'Company Information:',
    defaultNextId: 'share_transfer_date'
  },
  'share_transfer_date': {
    id: 'share_transfer_date',
    type: 'date',
    text: 'Effective Date of Share Transfer:',
    defaultNextId: 'share_certificates_delivery'
  },
  'share_certificates_delivery': {
    id: 'share_certificates_delivery',
    type: 'radio',
    text: 'Will share certificates and related documents be delivered?',
    options: ['Yes - All required documents will be delivered', 'No - Documents will not be delivered'],
    defaultNextId: 'indemnifying_party'
  },
  'indemnifying_party': {
    id: 'indemnifying_party',
    type: 'select',
    text: 'Select the Indemnifying Party:',
    options: ['Buyer', 'Existing Shareholder', 'Seller'],
    defaultNextId: 'existing_shareholder_info'
  },
  'existing_shareholder_info': {
    id: 'existing_shareholder_info',
    type: 'text',
    text: 'Existing Shareholder Information:',
    defaultNextId: 'witness1_info'
  },  'witness1_info': {
    id: 'witness1_info',
    type: 'witness',
    text: 'First Witness Information (Required for legal validation):',
    defaultNextId: 'witness2_info'
  },
  'witness2_info': {
    id: 'witness2_info',
    type: 'witness',
    text: 'Second Witness Information (Required for legal validation):',
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your Share Purchase Agreement based on your answers.',
  }
};

const SharePurchaseAgreementForm = () => {
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [seller, setSeller] = useState<Party>({ name: '', address: '' });
  const [buyer, setBuyer] = useState<Party>({ name: '', address: '' });
  const [company, setCompany] = useState<Company>({ name: '', incorporationNumber: '', jurisdiction: '', sharesSold: '' });
  const [existingShareholder, setExistingShareholder] = useState<ExistingShareholder>({ 
    name: '', 
    offerLetterDate: '', 
    refusalLetterDate: '', 
    boardResolutionDate: '' 
  });
  const [witness1, setWitness1] = useState<Witness>({ name: '', cnic: '' });
  const [witness2, setWitness2] = useState<Witness>({ name: '', cnic: '' });
  const [effectiveDate, setEffectiveDate] = useState<Date>();
  const [shareTransferDate, setShareTransferDate] = useState<Date>();
  
  const currentSection = sections[currentSectionId];

  const handleNext = () => {
    try {
      const nextSectionId = currentSection?.nextSectionId;
      
      if (!nextSectionId) {
        setIsComplete(true);
        return;
      }
      
      // Validate that the next section exists
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

  const updateParty = (type: 'seller' | 'buyer', field: keyof Party, value: string) => {
    if (type === 'seller') {
      setSeller({ ...seller, [field]: value });
    } else {
      setBuyer({ ...buyer, [field]: value });
    }
  };

  const updateCompany = (field: keyof Company, value: string) => {
    setCompany({ ...company, [field]: value });
  };

  const updateExistingShareholder = (field: keyof ExistingShareholder, value: string) => {
    setExistingShareholder({ ...existingShareholder, [field]: value });
  };

  const updateWitness = (type: 'witness1' | 'witness2', field: keyof Witness, value: string) => {
    if (type === 'witness1') {
      setWitness1({ ...witness1, [field]: value });
    } else {
      setWitness2({ ...witness2, [field]: value });
    }
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
              placeholder="Enter additional information"
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
              rows={4}
            />
          </div>
        );
      case 'select':
        // Get options based on question type
        let optionsToShow: Array<{value: string, label: string}> = [];
        
        if (questionId === 'country') {
          // Get all countries from the database using the new API
          const countries = getAllCountries();
          optionsToShow = countries.map(country => ({
            value: country.id.toString(),
            label: country.name
          }));
        } else if (questionId === 'state' && answers.country) {
          // Get states for the selected country using country ID
          const countryId = parseInt(answers.country);
          const states = getStatesByCountry(countryId);
          optionsToShow = states.map(state => ({
            value: state.id.toString(),
            label: state.name
          }));
        } else if (question.options) {
          // Use static options for other select questions
          optionsToShow = question.options.map(option => ({
            value: option,
            label: option
          }));
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
                // Clear state selection when country changes
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
                {optionsToShow.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'radio':
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <RadioGroup
              value={answers[questionId] || ''}
              onValueChange={(value) => handleAnswer(questionId, value)}
              className="mt-2 space-y-2 text-black"
            >
              {question.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${questionId}-${option}`} />
                  <Label htmlFor={`${questionId}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      case 'date':
        const dateValue = questionId === 'effective_date' ? effectiveDate : shareTransferDate;
        const setDateValue = questionId === 'effective_date' ? setEffectiveDate : setShareTransferDate;
        
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !dateValue && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateValue ? format(dateValue, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white rounded-lg shadow-sm">
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={setDateValue}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      case 'party':
        const isSellerInfo = questionId === 'seller_info';
        const party = isSellerInfo ? seller : buyer;
        const partyType = isSellerInfo ? 'seller' : 'buyer';
        
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Full Name</Label>
                <Input
                  value={party.name}
                  onChange={(e) => updateParty(partyType as 'seller' | 'buyer', 'name', e.target.value)}
                  placeholder="Enter full name"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Residential Address</Label>
                <Textarea
                  value={party.address}
                  onChange={(e) => updateParty(partyType as 'seller' | 'buyer', 'address', e.target.value)}
                  placeholder="Enter complete residential address"
                  className="text-black"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );
      case 'company':
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Company Name</Label>
                <Input
                  value={company.name}
                  onChange={(e) => updateCompany('name', e.target.value)}
                  placeholder="Enter company name"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Incorporation Number</Label>
                <Input
                  value={company.incorporationNumber}
                  onChange={(e) => updateCompany('incorporationNumber', e.target.value)}
                  placeholder="Enter incorporation number"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Jurisdiction / State of Incorporation</Label>
                <Input
                  value={company.jurisdiction}
                  onChange={(e) => updateCompany('jurisdiction', e.target.value)}
                  placeholder="Enter jurisdiction or state"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Number of Shares Being Sold</Label>
                <Input
                  value={company.sharesSold}
                  onChange={(e) => updateCompany('sharesSold', e.target.value)}
                  placeholder="Enter number of shares"
                  className="text-black"
                  type="number"
                />
              </div>
            </div>
          </div>
        );
      case 'witness':
        const isWitness2 = questionId === 'witness2_info';
        const witness = isWitness2 ? witness2 : witness1;
        const witnessType = isWitness2 ? 'witness2' : 'witness1';
        
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Full Name</Label>
                <Input
                  value={witness.name}
                  onChange={(e) => updateWitness(witnessType as 'witness1' | 'witness2', 'name', e.target.value)}
                  placeholder="Enter witness name"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">CNIC</Label>
                <Input
                  value={witness.cnic}
                  onChange={(e) => updateWitness(witnessType as 'witness1' | 'witness2', 'cnic', e.target.value)}
                  placeholder="Enter CNIC number"
                  className="text-black"
                />
              </div>
            </div>
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
    return currentSection.questions.map(questionId => renderQuestionInput(questionId));
  };

  const canAdvance = () => {
    if (currentSectionId === 'confirmation') return true;
      // Special validation for different sections
    if (currentSectionId === 'location_selection') {
      return answers.country && answers.state;
    }
    if (currentSectionId === 'general_details') {
      return effectiveDate && answers.agreement_location;
    }
    if (currentSectionId === 'seller_info') {
      return seller.name && seller.address;
    }
    if (currentSectionId === 'buyer_info') {
      return buyer.name && buyer.address;
    }
    if (currentSectionId === 'company_details') {
      return company.name && company.incorporationNumber && company.jurisdiction && company.sharesSold;
    }
    if (currentSectionId === 'transaction_details') {
      return shareTransferDate && answers.share_certificates_delivery && answers.indemnifying_party;
    }    if (currentSectionId === 'existing_shareholder') {
      return existingShareholder.name && existingShareholder.offerLetterDate && 
             existingShareholder.refusalLetterDate && existingShareholder.boardResolutionDate;
    }
    if (currentSectionId === 'witnesses') {
      return witness1.name && witness1.cnic && witness2.name && witness2.cnic;
    }
    
    // Default validation
    return true;
  };

  // Custom input for existing shareholder with multiple date fields
  const renderExistingShareholderInput = () => {
    return (
      <div className="mb-4">
        <Label className="block text-sm font-medium text-black mb-2">
          Existing Shareholder Information:
        </Label>
        <div className="border rounded-lg p-4 space-y-3">
          <div>
            <Label className="text-sm">Full Name of Existing Shareholder</Label>
            <Input
              value={existingShareholder.name}
              onChange={(e) => updateExistingShareholder('name', e.target.value)}
              placeholder="Enter existing shareholder name"
              className="text-black"
            />
          </div>
          <div>
            <Label className="text-sm">Date of Offer Letter Sent</Label>
            <Input
              value={existingShareholder.offerLetterDate}
              onChange={(e) => updateExistingShareholder('offerLetterDate', e.target.value)}
              placeholder="YYYY-MM-DD"
              className="text-black"
              type="date"
            />
          </div>
          <div>
            <Label className="text-sm">Date of Refusal Letter Received</Label>
            <Input
              value={existingShareholder.refusalLetterDate}
              onChange={(e) => updateExistingShareholder('refusalLetterDate', e.target.value)}
              placeholder="YYYY-MM-DD"
              className="text-black"
              type="date"
            />
          </div>
          <div>
            <Label className="text-sm">Date of Board Resolution Executed</Label>
            <Input
              value={existingShareholder.boardResolutionDate}
              onChange={(e) => updateExistingShareholder('boardResolutionDate', e.target.value)}
              placeholder="YYYY-MM-DD"
              className="text-black"
              type="date"
            />
          </div>
        </div>
      </div>
    );
  };

  // Override the existing shareholder question rendering
  const renderSectionQuestionsOverride = () => {
    if (currentSectionId === 'user_info_step') {
      return (
        <UserInfoStep
          onBack={() => setCurrentSectionId('review')}
          onGenerate={generateSharePurchaseAgreementPDF}
          isGenerating={isGeneratingPDF}
          documentType="Share Purchase Agreement"
        />
      );
    }
    
    return currentSection.questions.map(questionId => {
      if (questionId === 'existing_shareholder_info') {
        return renderExistingShareholderInput();
      }
      return renderQuestionInput(questionId);
    });
  };  const generateSharePurchaseAgreementPDF = async (userInfo?: { name: string; email: string; phone: string }) => {
    setIsGeneratingPDF(true);
    try {
      console.log("Generating Share Purchase Agreement PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("SHARE PURCHASE AGREEMENT", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Helper function to add text with automatic page breaks
      const addText = (text: string, isBold = false, fontSize = 11) => {
        if (isBold) {
          doc.setFont("helvetica", "bold");
        } else {
          doc.setFont("helvetica", "normal");
        }
        doc.setFontSize(fontSize);
        
        const lines = doc.splitTextToSize(text, 170);
        lines.forEach((line: string) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 15, y);
          y += lineHeight;
        });
        y += 3; // Extra spacing after sections
      };

      // Dynamic field values
      const effectiveDateStr = effectiveDate ? format(effectiveDate, 'MMMM dd, yyyy') : '_______________';
      const agreementLocation = answers.agreement_location || '_______________';
      const shareTransferDateStr = shareTransferDate ? format(shareTransferDate, 'MMMM dd, yyyy') : '_______________';
      const certificatesDelivery = answers.share_certificates_delivery || 'Not specified';
      const selectedCountryName = answers.country ? getCountryName(answers.country) : '_______________';
      const selectedStateName = answers.state && answers.country ? getStateName(answers.country, answers.state) : '_______________';
      
      // RECITALS
      addText("RECITALS", true, 12);
      
      addText(`WHEREAS, ${seller.name || '_______________'} ("Seller") is the owner of ${company.sharesSold || '_______________'} shares of ${company.name || '_______________'} (the "Company"), a corporation organized and existing under the laws of ${company.jurisdiction || '_______________'};`);
      
      addText(`WHEREAS, ${buyer.name || '_______________'} ("Buyer") desires to purchase from Seller the shares described herein;`);
      
      addText(`WHEREAS, the Company was incorporated on ${effectiveDateStr} under the laws of ${company.jurisdiction || '_______________'} with Incorporation Number ${company.incorporationNumber || '_______________'};`);
      
      addText(`WHEREAS, the parties wish to set forth the terms and conditions of the sale and purchase of the shares;`);
      
      addText(`NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:`);
      
      // ARTICLE I - DEFINITIONS
      addText("ARTICLE I - DEFINITIONS", true, 12);
      
      addText(`1.1 "Shares" means the ${company.sharesSold || '_______________'} shares of common stock of the Company owned by Seller.`);
      
      addText(`1.2 "Closing Date" means ${shareTransferDateStr}.`);
      
      addText(`1.3 "Purchase Price" means the total consideration to be paid by Buyer to Seller for the Shares.`);
      
      addText(`1.4 "Company" means ${company.name || '_______________'}, a corporation incorporated under the laws of ${company.jurisdiction || '_______________'}.`);
      
      // ARTICLE II - SALE AND PURCHASE OF SHARES
      addText("ARTICLE II - SALE AND PURCHASE OF SHARES", true, 12);
      
      addText(`2.1 Sale of Shares. Subject to the terms and conditions of this Agreement, Seller hereby agrees to sell, transfer, and deliver to Buyer, and Buyer hereby agrees to purchase from Seller, the Shares.`);
      
      addText(`2.2 Purchase Price. The aggregate purchase price for the Shares shall be determined by mutual agreement of the parties and shall be paid in cash at Closing.`);
      
      addText(`2.3 Closing. The closing of the purchase and sale of the Shares (the "Closing") shall take place on the Closing Date at ${agreementLocation} or such other place as the parties may mutually agree.`);
      
      // ARTICLE III - REPRESENTATIONS AND WARRANTIES OF SELLER
      addText("ARTICLE III - REPRESENTATIONS AND WARRANTIES OF SELLER", true, 12);
      
      addText(`3.1 Title to Shares. Seller has good and marketable title to the Shares, free and clear of all liens, encumbrances, and restrictions.`);
      
      addText(`3.2 Authority. Seller has full corporate power and authority to execute and deliver this Agreement and to perform its obligations hereunder.`);
      
      addText(`3.3 No Conflicts. The execution and delivery of this Agreement by Seller does not conflict with any agreement, instrument, or obligation to which Seller is a party.`);
      
      // ARTICLE IV - REPRESENTATIONS AND WARRANTIES OF BUYER
      addText("ARTICLE IV - REPRESENTATIONS AND WARRANTIES OF BUYER", true, 12);
      
      addText(`4.1 Authority. Buyer has full power and authority to execute and deliver this Agreement and to perform its obligations hereunder.`);
      
      addText(`4.2 Financial Capacity. Buyer has sufficient financial resources to pay the Purchase Price and perform its obligations under this Agreement.`);
      
      // ARTICLE V - COVENANTS
      addText("ARTICLE V - COVENANTS", true, 12);
      
      addText(`5.1 Further Assurances. Each party agrees to execute and deliver such additional documents and instruments as may be reasonably necessary to effectuate the transactions contemplated by this Agreement.`);
      
      addText(`5.2 Existing Shareholder Consent. ${existingShareholder.name || '_______________'} ("Existing Shareholder") hereby consents to this share transfer. The offer letter was sent on ${existingShareholder.offerLetterDate || '_______________'}, refusal letter received on ${existingShareholder.refusalLetterDate || '_______________'}, and board resolution executed on ${existingShareholder.boardResolutionDate || '_______________'}.`);
      
      // ARTICLE VI - CONDITIONS TO CLOSING
      addText("ARTICLE VI - CONDITIONS TO CLOSING", true, 12);
      
      addText(`6.1 Conditions to Buyer's Obligations. Buyer's obligation to purchase the Shares is subject to the following conditions:`);
      addText(`(a) The representations and warranties of Seller shall be true and correct as of the Closing Date.`);
      addText(`(b) Seller shall have performed all covenants and agreements required to be performed by it under this Agreement.`);
      
      if (certificatesDelivery.includes('Yes')) {
        addText(`(c) Seller shall deliver to Buyer the share certificates representing the Shares, duly endorsed for transfer.`);
      }
      
      addText(`6.2 Conditions to Seller's Obligations. Seller's obligation to sell the Shares is subject to the following conditions:`);
      addText(`(a) The representations and warranties of Buyer shall be true and correct as of the Closing Date.`);
      addText(`(b) Buyer shall have performed all covenants and agreements required to be performed by it under this Agreement.`);
      
      // ARTICLE VII - INDEMNIFICATION
      addText("ARTICLE VII - INDEMNIFICATION", true, 12);
      
      addText(`7.1 Indemnification. ${answers.indemnifying_party || '_______________'} shall indemnify and hold harmless the other parties from and against any and all losses, damages, liabilities, costs, and expenses arising out of or resulting from any breach of the representations, warranties, or covenants contained in this Agreement.`);
      
      // ARTICLE VIII - MISCELLANEOUS
      addText("ARTICLE VIII - MISCELLANEOUS", true, 12);
      
      addText(`8.1 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of ${selectedStateName}, ${selectedCountryName}.`);
      
      addText(`8.2 Entire Agreement. This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements and understandings.`);
      
      addText(`8.3 Amendment. This Agreement may be amended only by a written instrument signed by all parties.`);
      
      addText(`8.4 Binding Effect. This Agreement shall be binding upon and inure to the benefit of the parties and their respective heirs, successors, and assigns.`);
      
      addText(`8.5 Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original.`);
      
      // Add some space before signatures
      y += 15;
      
      // Check if we need a new page for signatures
      if (y > pageHeight - 120) {
        doc.addPage();
        y = 20;
      }
      
      // IN WITNESS WHEREOF
      addText("IN WITNESS WHEREOF, the parties have executed this Share Purchase Agreement as of the date first written above.", true);
      
      y += 10;
      
      // Signatures Section
      addText("SIGNATURES:", true, 12);
      
      // Seller signature
      doc.text("SELLER:", 15, y);
      y += lineHeight + 10;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${seller.name || '_______________'}`, 15, y);
      doc.text("Date: _________________", 110, y);
      y += lineHeight;
      doc.text(`Address: ${seller.address || '_______________'}`, 15, y);
      y += lineHeight + 15;
      
      // Buyer signature
      doc.text("BUYER:", 15, y);
      y += lineHeight + 10;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${buyer.name || '_______________'}`, 15, y);
      doc.text("Date: _________________", 110, y);
      y += lineHeight;
      doc.text(`Address: ${buyer.address || '_______________'}`, 15, y);
      y += lineHeight + 15;
      
      // Existing Shareholder signature
      doc.text("EXISTING SHAREHOLDER:", 15, y);
      y += lineHeight + 10;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${existingShareholder.name || '_______________'}`, 15, y);
      doc.text("Date: _________________", 110, y);
      y += lineHeight + 15;      // Check if we need a new page for witnesses
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // Witness signatures section with enhanced formatting
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("WITNESS ATTESTATION", 15, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      y += lineHeight + 5;
      
      addText("The undersigned witnesses hereby attest that they have witnessed the execution of this Share Purchase Agreement by all parties, and that each party has signed this Agreement voluntarily and with full understanding of its terms and conditions.");
      y += 5;
      
      // Witness 1
      doc.setFont("helvetica", "bold");
      doc.text("WITNESS 1:", 15, y);
      doc.setFont("helvetica", "normal");
      y += lineHeight + 8;
      doc.text("Signature: ____________________________", 15, y);
      y += lineHeight + 3;
      doc.text(`Print Name: ${witness1.name || '_______________'}`, 15, y);
      doc.text("Date: _________________", 110, y);
      y += lineHeight + 3;
      doc.text(`CNIC No.: ${witness1.cnic || '_______________'}`, 15, y);
      y += lineHeight + 15;
      
      // Witness 2
      doc.setFont("helvetica", "bold");
      doc.text("WITNESS 2:", 15, y);
      doc.setFont("helvetica", "normal");
      y += lineHeight + 8;
      doc.text("Signature: ____________________________", 15, y);
      y += lineHeight + 3;
      doc.text(`Print Name: ${witness2.name || '_______________'}`, 15, y);
      doc.text("Date: _________________", 110, y);
      y += lineHeight + 3;
      doc.text(`CNIC No.: ${witness2.cnic || '_______________'}`, 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `share_purchase_agreement_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Share Purchase Agreement successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Share Purchase Agreement");
      return null;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Share Purchase Agreement Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">General Details</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state && answers.country ? getStateName(answers.country, answers.state) : 'Not provided'}</p>
              <p><strong>Effective Date:</strong> {effectiveDate ? format(effectiveDate, 'dd/MM/yyyy') : 'Not provided'}</p>
              <p><strong>Location:</strong> {answers.agreement_location || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Seller Information</h4>
              <p><strong>Name:</strong> {seller.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {seller.address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Buyer Information</h4>
              <p><strong>Name:</strong> {buyer.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {buyer.address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Company Details</h4>
              <p><strong>Name:</strong> {company.name || 'Not provided'}</p>
              <p><strong>Incorporation #:</strong> {company.incorporationNumber || 'Not provided'}</p>
              <p><strong>Jurisdiction:</strong> {company.jurisdiction || 'Not provided'}</p>
              <p><strong>Shares Sold:</strong> {company.sharesSold || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Transaction Details</h4>
              <p><strong>Transfer Date:</strong> {shareTransferDate ? format(shareTransferDate, 'dd/MM/yyyy') : 'Not provided'}</p>
              <p><strong>Documents Delivery:</strong> {answers.share_certificates_delivery || 'Not specified'}</p>
              <p><strong>Indemnifying Party:</strong> {answers.indemnifying_party || 'Not specified'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Existing Shareholder</h4>
              <p><strong>Name:</strong> {existingShareholder.name || 'Not provided'}</p>
              <p><strong>Offer Letter Date:</strong> {existingShareholder.offerLetterDate || 'Not provided'}</p>
              <p><strong>Refusal Letter Date:</strong> {existingShareholder.refusalLetterDate || 'Not provided'}</p>
            </div>
              <div>
              <h4 className="font-medium text-sm">Witness Information</h4>
              <div className="space-y-2">
                <div>
                  <p><strong>Witness 1:</strong></p>
                  <p className="ml-4">Name: {witness1.name || 'Not provided'}</p>
                  <p className="ml-4">CNIC: {witness1.cnic || 'Not provided'}</p>
                </div>
                <div>
                  <p><strong>Witness 2:</strong></p>
                  <p className="ml-4">Name: {witness2.name || 'Not provided'}</p>
                  <p className="ml-4">CNIC: {witness2.cnic || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Share Purchase Agreement.
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
          <CardTitle className="text-xl text-green-600">Share Purchase Agreement</CardTitle>
          <CardDescription>
            Review your Share Purchase Agreement details below before generating the final document.
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
              setSeller({ name: '', address: '' });
              setBuyer({ name: '', address: '' });
              setCompany({ name: '', incorporationNumber: '', jurisdiction: '', sharesSold: '' });
              setExistingShareholder({ name: '', offerLetterDate: '', refusalLetterDate: '', boardResolutionDate: '' });
              setWitness1({ name: '', cnic: '' });
              setWitness2({ name: '', cnic: '' });
              setEffectiveDate(undefined);
              setShareTransferDate(undefined);
            }}
          >
            Start Over
          </Button>
          <Button 
            onClick={() => generateSharePurchaseAgreementPDF()}
          >
            Generate Agreement
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
  }

  // Safety check for currentSection
  if (!currentSection) {
    return (
    <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
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
      </CardHeader>
      <CardContent className="text-black">
        <div className="grid grid-cols-1 gap-y-2">
          {renderSectionQuestionsOverride()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {currentSectionId !== 'user_info_step' && (
          <>
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
          </>
        )}
      </CardFooter>
    </Card>
  </div>
  );
  };

export default SharePurchaseAgreementForm;







