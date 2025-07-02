import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  type: 'text' | 'textarea' | 'confirmation' | 'date' | 'number' | 'party' | 'money' | 'property' | 'notice' | 'select' | 'business';
  text: string;
  options?: string[];
  nextQuestionId?: Record<string, string>;
  defaultNextId?: string;
}

// Party interface (First Party/Second Party)
interface Party {
  name: string;
  address: string;
}

// Business Details interface
interface BusinessDetails {
  projectName: string;
  projectDescription: string;
  salesCommissionRate: string;
  constructionTimeframe: string;
  deductionAmount: string;
  penaltyAmount: string;
  companyName: string;
}

// Notice Information interface
interface NoticeInfo {
  address: string;
  phone: string;
  email: string;
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
    title: 'Location Selection',
    description: 'Select the country and state/province where this business agreement will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'general_details'
  },
  'general_details': {
    id: 'general_details',
    title: 'General Agreement Details',
    description: 'Enter the basic details of the Business Agreement',
    questions: ['agreement_date', 'location_signing'],
    nextSectionId: 'first_party_info'
  },
  'first_party_info': {
    id: 'first_party_info',
    title: 'First Party Information',
    description: 'Enter details of the first party (business owner)',
    questions: ['first_party_info'],
    nextSectionId: 'second_party_info'
  },
  'second_party_info': {
    id: 'second_party_info',
    title: 'Second Party Information',
    description: 'Enter details of the second party (marketing partner)',
    questions: ['second_party_info'],
    nextSectionId: 'business_details'
  },
  'business_details': {
    id: 'business_details',
    title: 'Business Project Details',
    description: 'Specify the business project and commercial terms',
    questions: ['business_info'],
    nextSectionId: 'notice_info'
  },
  'notice_info': {
    id: 'notice_info',
    title: 'Contact Information',
    description: 'Enter contact information for both parties',
    questions: ['first_party_notice_info', 'second_party_notice_info'],
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
    text: 'Select the country where this business agreement will be executed:',
    options: [], // Will be populated dynamically from the database
    defaultNextId: 'state'
  },
  'state': {
    id: 'state',
    type: 'select',
    text: 'Select the state/province where this business agreement will be executed:',
    options: [], // Will be populated dynamically based on country selection
    defaultNextId: 'agreement_date'
  },
  'agreement_date': {
    id: 'agreement_date',
    type: 'date',
    text: 'Date of Business Agreement:',
    defaultNextId: 'location_signing'
  },
  'location_signing': {
    id: 'location_signing',
    type: 'text',
    text: 'Location of Signing:',
    defaultNextId: 'first_party_info'
  },
  'first_party_info': {
    id: 'first_party_info',
    type: 'party',
    text: 'First Party (Business Owner) Information:',
    defaultNextId: 'second_party_info'
  },
  'second_party_info': {
    id: 'second_party_info',
    type: 'party',
    text: 'Second Party (Marketing Partner) Information:',
    defaultNextId: 'business_info'
  },
  'business_info': {
    id: 'business_info',
    type: 'business',
    text: 'Business Project Details:',
    defaultNextId: 'first_party_notice_info'
  },
  'first_party_notice_info': {
    id: 'first_party_notice_info',
    type: 'notice',
    text: 'First Party Contact Information:',
    defaultNextId: 'second_party_notice_info'
  },
  'second_party_notice_info': {
    id: 'second_party_notice_info',
    type: 'notice',
    text: 'Second Party Contact Information:',
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your Business Agreement based on your answers.',
  }
};

const BusinessAgreementForm = () => {
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [firstParty, setFirstParty] = useState<Party>({ name: '', address: '' });
  const [secondParty, setSecondParty] = useState<Party>({ name: '', address: '' });
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({ 
    projectName: '', 
    projectDescription: '', 
    salesCommissionRate: '',
    constructionTimeframe: '',
    deductionAmount: '',
    penaltyAmount: '',
    companyName: ''
  });
  const [firstPartyNotice, setFirstPartyNotice] = useState<NoticeInfo>({ address: '', phone: '', email: '' });
  const [secondPartyNotice, setSecondPartyNotice] = useState<NoticeInfo>({ address: '', phone: '', email: '' });
  const [agreementDate, setAgreementDate] = useState<Date>();
  
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
  
  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const updateParty = (type: 'first' | 'second', field: keyof Party, value: string) => {
    if (type === 'first') {
      setFirstParty({ ...firstParty, [field]: value });
    } else {
      setSecondParty({ ...secondParty, [field]: value });
    }
  };

  const updateBusinessDetails = (field: keyof BusinessDetails, value: string) => {
    setBusinessDetails({ ...businessDetails, [field]: value });
  };

  const updateNoticeInfo = (type: 'first' | 'second', field: keyof NoticeInfo, value: string) => {
    if (type === 'first') {
      setFirstPartyNotice({ ...firstPartyNotice, [field]: value });
    } else {
      setSecondPartyNotice({ ...secondPartyNotice, [field]: value });
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
              className="mt-1 text-black w-full bg-white"
            />
          </div>
        );
      case 'date':
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
                    !agreementDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {agreementDate ? format(agreementDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white">
                <Calendar
                  mode="single"
                  selected={agreementDate}
                  onSelect={setAgreementDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      case 'party':
        const isFirstParty = questionId === 'first_party_info';
        const party = isFirstParty ? firstParty : secondParty;
        const partyType = isFirstParty ? 'first' : 'second';
        
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
                  onChange={(e) => updateParty(partyType as 'first' | 'second', 'name', e.target.value)}
                  placeholder="Enter full name"
                  className="text-black bg-white"
                />
              </div>
              <div>
                <Label className="text-sm">Address</Label>
                <Textarea
                  value={party.address}
                  onChange={(e) => updateParty(partyType as 'first' | 'second', 'address', e.target.value)}
                  placeholder="Enter complete address"
                  className="text-black bg-white"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );
      case 'business':
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Project Name</Label>
                <Input
                  value={businessDetails.projectName}
                  onChange={(e) => updateBusinessDetails('projectName', e.target.value)}
                  placeholder="Enter project name"
                  className="text-black bg-white"
                />
              </div>
              <div>
                <Label className="text-sm">Project Description</Label>
                <Textarea
                  value={businessDetails.projectDescription}
                  onChange={(e) => updateBusinessDetails('projectDescription', e.target.value)}
                  placeholder="Detailed description of the project"
                  className="text-black bg-white"
                  rows={4}
                />
              </div>
              <div>
                <Label className="text-sm">Sales Commission Rate (%)</Label>
                <Input
                  value={businessDetails.salesCommissionRate}
                  onChange={(e) => updateBusinessDetails('salesCommissionRate', e.target.value)}
                  placeholder="Enter commission percentage"
                  className="text-black bg-white"
                  type="number"
                />
              </div>
              <div>
                <Label className="text-sm">Construction Timeframe</Label>
                <Input
                  value={businessDetails.constructionTimeframe}
                  onChange={(e) => updateBusinessDetails('constructionTimeframe', e.target.value)}
                  placeholder="e.g., 24 months"
                  className="text-black bg-white"
                />
              </div>
              <div>
                <Label className="text-sm">Deduction Amount from Second Party's Share</Label>
                <Input
                  value={businessDetails.deductionAmount}
                  onChange={(e) => updateBusinessDetails('deductionAmount', e.target.value)}
                  placeholder="Enter amount"
                  className="text-black bg-white"
                />
              </div>
              <div>
                <Label className="text-sm">Penalty Amount (if agreement is terminated)</Label>
                <Input
                  value={businessDetails.penaltyAmount}
                  onChange={(e) => updateBusinessDetails('penaltyAmount', e.target.value)}
                  placeholder="Enter penalty amount"
                  className="text-black bg-white"
                />
              </div>
              <div>
                <Label className="text-sm">Company Name</Label>
                <Input
                  value={businessDetails.companyName}
                  onChange={(e) => updateBusinessDetails('companyName', e.target.value)}
                  placeholder="Enter company name"
                  className="text-black bg-white"
                />
              </div>
            </div>
          </div>
        );
      case 'notice':
        const isFirstPartyNotice = questionId === 'first_party_notice_info';
        const noticeInfo = isFirstPartyNotice ? firstPartyNotice : secondPartyNotice;
        const noticeType = isFirstPartyNotice ? 'first' : 'second';
        
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Address for Notice</Label>
                <Textarea
                  value={noticeInfo.address}
                  onChange={(e) => updateNoticeInfo(noticeType as 'first' | 'second', 'address', e.target.value)}
                  placeholder="Enter complete address for notices"
                  className="text-black bg-white"
                  rows={3}
                />
              </div>
              <div>
                <Label className="text-sm">Phone Number</Label>
                <Input
                  value={noticeInfo.phone}
                  onChange={(e) => updateNoticeInfo(noticeType as 'first' | 'second', 'phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="text-black bg-white"
                />
              </div>
              <div>
                <Label className="text-sm">Email Address</Label>
                <Input
                  value={noticeInfo.email}
                  onChange={(e) => updateNoticeInfo(noticeType as 'first' | 'second', 'email', e.target.value)}
                  placeholder="Enter email address"
                  className="text-black bg-white"
                  type="email"
                />
              </div>
            </div>
          </div>
        );
      case 'select':
        let optionsToShow: Array<{value: string, label: string}> = [];
        
        if (questionId === 'country') {
          const countries = getAllCountries();
          optionsToShow = countries.map(country => ({
            value: country.id.toString(),
            label: country.name
          }));
        } else if (questionId === 'state' && answers.country) {
          const countryId = parseInt(answers.country);
          const states = getStatesByCountry(countryId);
          optionsToShow = states.map(state => ({
            value: state.id.toString(),
            label: state.name
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
                if (questionId === 'country' && answers.state) {
                  handleAnswer('state', '');
                }
              }}
              disabled={questionId === 'state' && !answers.country}
            >
              <SelectTrigger className="mt-1 text-black w-full bg-white">
                <SelectValue placeholder={
                  questionId === 'state' && !answers.country 
                    ? "Please select a country first" 
                    : "Select an option"
                } />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {optionsToShow.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
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
    return currentSection.questions.map(questionId => renderQuestionInput(questionId));
  };

  const canAdvance = () => {
    if (currentSectionId === 'confirmation') return true;
    
    if (currentSectionId === 'location_selection') {
      return answers.country && answers.state;
    }
    if (currentSectionId === 'general_details') {
      return agreementDate && (answers.location_signing || answers.location_signing === '');
    }
    if (currentSectionId === 'first_party_info') {
      return firstParty.name && firstParty.address;
    }
    if (currentSectionId === 'second_party_info') {
      return secondParty.name && secondParty.address;
    }
    if (currentSectionId === 'business_details') {
      return businessDetails.projectName && businessDetails.projectDescription && 
             businessDetails.salesCommissionRate && businessDetails.constructionTimeframe;
    }
    if (currentSectionId === 'notice_info') {
      return firstPartyNotice.address && firstPartyNotice.phone && firstPartyNotice.email && 
             secondPartyNotice.address && secondPartyNotice.phone && secondPartyNotice.email;
    }
    
    return true;
  };

  const generateBusinessAgreementPDF = () => {
    try {
      console.log("Generating Business Agreement PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("BUSINESS AGREEMENT", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Helper function to add text with automatic page breaks
      const addText = (text: string, isBold = false, fontSize = 11, indent = 15) => {
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
          doc.text(line, indent, y);
          y += lineHeight;
        });
        y += 3;
      };

      // Dynamic field values
      const agreementDateStr = agreementDate ? format(agreementDate, 'MMMM dd, yyyy') : '_______________';
      const locationSigning = answers.location_signing || 'City';
      
      // Agreement Header
      addText(`THIS BUSINESS AGREEMENT IS MADE on this ${agreementDateStr}, between:`);
      
      // Parties
      addText(`"${firstParty.name || 'FIRST PARTY'}" (hereinafter referred to as the "1st party", which expression shall, where the context so admits, include their respective legal heirs, successors-in-interest, and permitted assigns);`);
      
      addText("And");
      
      addText(`"${secondParty.name || 'SECOND PARTY'}" (hereinafter referred to as the "2nd party", which expression shall, where the context so admits, include their respective legal heirs, successors-in-interest, and permitted assigns);`);
      
      // Main Agreement Text
      addText("WHEREAS both the parties hereby with their own free consent agree to initiate the business through this agreement upon the following terms and conditions:", true);
      
      addText(`That the first party is the owner of a project namely ${businessDetails.projectName || '[PROJECT NAME]'} and this business agreement is being executed in relation to this aforementioned project.`);
      
      addText(`That all the exclusive rights pertaining to marketing and sales of the subject matter project are exclusively associated with second party, however first party is allowed to sale any part thereof subject to deduction of ${businessDetails.deductionAmount || '[AMOUNT]'} from the second party's rebate/share.`);
      
      addText("That the second party during marketing will perform duties such as Digital Marketing, Print Media, Outdoor Marketing, Bill Boards, TVC Ads.");
      
      addText("That the second party will develop a complete marketing campaign and will generate revenue for the project from the market.");
      
      addText("That the second party is bound to accommodate the investors/clients/parties associated with the first party.");
      
      addText("That there shall be a meeting between the Board of Directors (BoD) after every ten days, whereby the development of the project will be discussed.");
      
      addText("That all the transactions between the first and the second party shall only be done through banking channel.");
      
      addText("That the amount of taxes applicable upon the respected shares in business of both the parties shall be paid to the Government by the respective parties themselves and none of the parties to the current agreement will deduct such taxes from the payable amount of the other party.");
      
      addText(`That the second party will utilize all the necessary measures to sell ${businessDetails.projectDescription || '[PROJECT DETAILS]'}`);
      
      addText("That all the mega events will be arranged and executed with the mutual consent of both the parties to the current agreement.");
      
      addText("That the sample of the documentation required to sell the project units will be drafted with mutual consent of both the parties.");
      
      addText(`That the second party will charge an amount ${businessDetails.salesCommissionRate || '[PERCENTAGE]'}% of the total amount of units sold and the relevant document to execute/transfer.`);
      
      addText("That the second party is at its free will to acquire/book/hold any unit of the said project (also in lieu of its due payment, moreover the first party shall have no objection to it).");
      
      addText(`That for the purposes of Development, Extension in area ${businessDetails.projectDescription || '[BUSINESS DETAIL]'} the first party is duly bound to consult the second party and proceed in a manner as arrived with mutual consent.`);
      
      addText(`That both the parties are bound to fulfill their respective commitments with respect to investments, however (in case) if first party ends this business agreement with second party then in that instance the first party is under an obligation that he shall fulfill all the commitments with all the clients/investors of the second party, moreover the first party shall be bound to pay to the second party, a sum of amount equivalent to ${businessDetails.penaltyAmount || '[AMOUNT]'} of all the sales made by the second party since the date of execution of this agreement to such date of violation. Similarly, if second party puts an end to this business agreement with first party then the first party is empowered to deduct an amount equivalent to ${businessDetails.penaltyAmount || '[AMOUNT]'} of the pending payments w.r.t to the sale commission of the units sold.`);
      
      addText("That the second party exclusively has all the rights to delegate 'Sales Rights' to other agents in the market and the second party is empowered to plan strategies/rules for sales of subject property and is bound to produce/achieve good results of sale, however the first party will not advertise any marketing papers etc. in the market on his own as all the rights to advertise the sale of subject units are reserved with the second party.");
      
      addText("That the term of this business agreement is agreed to be for such time period till such time the sale (Booking) of all the units of said property is complete, moreover both the parties agree that the terms and conditions of this business agreement are also applicable to the legal heirs of both parties and all the legal heirs of both parties are duly bound to abide by the same.");
      
      addText("That the first party is duly bound to ensure that the subject land (shall be free from any kind of lien, mortgage, pledge, loan including any kind of disputes (what-so-ever) and in case any dispute regarding such land arises (in future) then it is expressly declared by both the parties that any such responsibility arising out of any such discrepancy/omission/commission shall be the sole responsibility of the first party and no burden/responsibility shall be imposed on the second party in any manner what-so-ever. Moreover, it is stated for the removal of any doubt that in case of any inquiry/investigation by any government department/authority relating to any such issues of the land, the sole responsibility is on the first party only, and no allegation/burden/penalty or responsibility of and such proceeding shall apply on the second party. First party will provide all the approval documents of all concerning authorities within 4 months of signing of this agreement.");
      
      addText("That the first party will provide all the relevant documents of the subject land including the 2D & 3D drawings to the second party, moreover the first party hereby ensures the second party that the development work on the subject matter project will not be stopped/halted. Furthermore, the first party ensures the second party that the size of the subject units (being sold to the clients) will be exact (at the time of possession) as per the drawings provided.");
      
      addText(`That all the payments of authorities and Government taxes what-so-ever shall be paid by the first party, moreover the development of the subject property is the sole responsibility of the first party who shall complete the construction of subject property within a time period of ${businessDetails.constructionTimeframe || '[TIME PERIOD]'} starting from the date of execution of this agreement.`);
      
      addText("Second party will ensure that all the payments are being submitted in the bank account.");
      
      addText("That the first party hereby ensures the second party that the quality of construction will strictly adhere to the standards as agreed/provided to the second party. Otherwise, second party has a right to takeover the construction contract and proceed the further construction work.");
      
      addText(`Every transaction will be done via bank account. ${businessDetails.companyName || '[COMPANY NAME]'} will transfer the proportional land to the customer's name at the time of possession.`);
      
      addText(`That both the parties have read and understood the above terms and conditions and with their own free consent and will have set their respective hands on this business agreement on ${agreementDateStr} in the presence of witnesses.`);
      
      // Add some space before signatures
      y += 15;
      
      // Check if we need a new page for signatures
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // SIGNATURES
      addText("Signature & Thumb Impression:", true, 12);
      
      // Store the starting Y position for signatures
      const signatureStartY = y;
      
      // First party signature (left side)
      doc.text("FIRST PARTY", 15, y);
      y += lineHeight + 10;
      doc.text("............................", 15, y);
      y += lineHeight * 2;
      doc.text(`Name: ${firstParty.name || '[FIRST PARTY NAME]'}`, 15, y);
      y += lineHeight;
      doc.text(`Date: ${agreementDateStr}`, 15, y);
      
      // Second party signature (right side)
      let secondPartyY = signatureStartY;
      doc.text("SECOND PARTY", 120, secondPartyY);
      secondPartyY += lineHeight + 10;
      doc.text("......................................", 120, secondPartyY);
      secondPartyY += lineHeight * 2;
      doc.text(`Name: ${secondParty.name || '[SECOND PARTY NAME]'}`, 120, secondPartyY);
      secondPartyY += lineHeight;
      doc.text(`Date: ${agreementDateStr}`, 120, secondPartyY);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `business_agreement_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Business Agreement successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Business Agreement");
      return null;
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Business Agreement Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Agreement Details</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state && answers.country ? getStateName(answers.country, answers.state) : 'Not provided'}</p>
              <p><strong>Agreement Date:</strong> {agreementDate ? format(agreementDate, 'dd/MM/yyyy') : 'Not provided'}</p>
              <p><strong>Location of Signing:</strong> {answers.location_signing || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">First Party Information</h4>
              <p><strong>Name:</strong> {firstParty.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {firstParty.address || 'Not provided'}</p>
              <p><strong>Contact:</strong> {firstPartyNotice.email || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Second Party Information</h4>
              <p><strong>Name:</strong> {secondParty.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {secondParty.address || 'Not provided'}</p>
              <p><strong>Contact:</strong> {secondPartyNotice.email || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Business Project</h4>
              <p><strong>Project Name:</strong> {businessDetails.projectName || 'Not provided'}</p>
              <p><strong>Commission Rate:</strong> {businessDetails.salesCommissionRate || 'Not provided'}%</p>
              <p><strong>Construction Time:</strong> {businessDetails.constructionTimeframe || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
    <div className="min-h-screen bg-white">
      <Card className="max-w-4xl mx-auto bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-green-600">Business Agreement</CardTitle>
          <CardDescription>
            Review your Business Agreement details below before generating the final document.
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
              setFirstParty({ name: '', address: '' });
              setSecondParty({ name: '', address: '' });
              setBusinessDetails({ 
                projectName: '', 
                projectDescription: '', 
                salesCommissionRate: '',
                constructionTimeframe: '',
                deductionAmount: '',
                penaltyAmount: '',
                companyName: ''
              });
              setFirstPartyNotice({ address: '', phone: '', email: '' });
              setSecondPartyNotice({ address: '', phone: '', email: '' });
              setAgreementDate(undefined);
            }}
          >
            Start Over
          </Button>
          <Button 
            onClick={generateBusinessAgreementPDF}
          >
            Generate Agreement
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
  }


  if (!currentSection) {
    return (
    <div className="min-h-screen bg-white">
      <Card className="max-w-4xl mx-auto bg-white">
        <CardContent className="text-center p-8">
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
    <div className="min-h-screen bg-white">
      <Card className="max-w-4xl mx-auto bg-white">
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
}


export default BusinessAgreementForm;







