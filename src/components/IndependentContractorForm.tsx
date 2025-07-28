import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, Calendar as CalendarIcon, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { format, parse } from "date-fns";
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
  type: 'text' | 'select' | 'radio' | 'textarea' | 'confirmation' | 'date' | 'number' | 'email' | 'phone' | 'party';
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

// Party interface (for company and contractor)
interface Party {
  name: string;
  address: string;
}

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'location_selection': {
    id: 'location_selection',
    title: 'Location Selection',
    description: 'Select the country and state/province where this Independent Contractor Agreement will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'header'
  },
  'header': {
    id: 'header',
    title: 'Agreement Header',
    description: 'Enter basic agreement information',
    questions: ['place_of_signing', 'agreement_date'],
    nextSectionId: 'parties'
  },
  'parties': {
    id: 'parties',
    title: 'Parties Information',
    description: 'Enter information about company and contractor',
    questions: ['company_info', 'contractor_info'],
    nextSectionId: 'services'
  },
  'services': {
    id: 'services',
    title: 'Scope of Services',
    description: 'Define the services to be provided',
    questions: ['services_description'],
    nextSectionId: 'term'
  },
  'term': {
    id: 'term',
    title: 'Term of Agreement',
    description: 'Specify the duration of the contract',
    questions: ['start_date', 'end_date'],
    nextSectionId: 'termination'
  },
  'termination': {
    id: 'termination',
    title: 'Termination',
    description: 'Define termination conditions',
    questions: ['termination_notice_days'],
    nextSectionId: 'payment'
  },
  'payment': {
    id: 'payment',
    title: 'Payment for Services',
    description: 'Define payment terms and rates',
    questions: ['payment_amount_rate', 'payment_period'],
    nextSectionId: 'non_solicitation'
  },
  'non_solicitation': {
    id: 'non_solicitation',
    title: 'Non-Solicitation',
    description: 'Define non-solicitation terms',
    questions: ['non_solicitation_duration'],
    nextSectionId: 'dispute_resolution'
  },
  'dispute_resolution': {
    id: 'dispute_resolution',
    title: 'Dispute Resolution',
    description: 'Define dispute resolution method',
    questions: ['arbitration_rules_body', 'arbitration_location'],
    nextSectionId: 'governing_law'
  },
  'governing_law': {
    id: 'governing_law',
    title: 'Governing Law',
    description: 'Specify applicable law and jurisdiction',
    questions: ['governing_country', 'governing_state', 'governing_jurisdiction'],
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
    text: 'Select the country where this Independent Contractor Agreement will be executed:',
    options: [], // Will be populated dynamically from the database
    defaultNextId: 'state'
  },
  'state': {
    id: 'state',
    type: 'select',
    text: 'Select the state/province where this Independent Contractor Agreement will be executed:',
    options: [], // Will be populated dynamically based on country selection
    defaultNextId: 'place_of_signing'
  },
  'place_of_signing': {
    id: 'place_of_signing',
    type: 'text',
    text: 'Place of Agreement Signing:',
    defaultNextId: 'agreement_date'
  },
  'agreement_date': {
    id: 'agreement_date',
    type: 'date',
    text: 'Date of Agreement:',
    defaultNextId: 'company_info'
  },
  'company_info': {
    id: 'company_info',
    type: 'party',
    text: 'Company Information (1st Party):',
    defaultNextId: 'contractor_info'
  },
  'contractor_info': {
    id: 'contractor_info',
    type: 'party',
    text: 'Contractor Information (2nd Party):',
    defaultNextId: 'services_description'
  },
  'services_description': {
    id: 'services_description',
    type: 'textarea',
    text: 'Services Description:',
    defaultNextId: 'start_date'
  },
  'start_date': {
    id: 'start_date',
    type: 'date',
    text: 'Start Date:',
    defaultNextId: 'end_date'
  },
  'end_date': {
    id: 'end_date',
    type: 'date',
    text: 'End Date:',
    defaultNextId: 'termination_notice_days'
  },
  'termination_notice_days': {
    id: 'termination_notice_days',
    type: 'number',
    text: 'Days\' Notice for Termination:',
    defaultNextId: 'payment_amount_rate'
  },
  'payment_amount_rate': {
    id: 'payment_amount_rate',
    type: 'text',
    text: 'Total Amount or Rate (e.g., $5000, $50/hour, $1000/week):',
    defaultNextId: 'payment_period'
  },
  'payment_period': {
    id: 'payment_period',
    type: 'number',
    text: 'Payment Period After Invoice (Number of Days):',
    defaultNextId: 'non_solicitation_duration'
  },
  'non_solicitation_duration': {
    id: 'non_solicitation_duration',
    type: 'select',
    text: 'Non-solicitation Duration After Termination:',
    options: ['3 months', '6 months', '1 year', '2 years', 'Other'],
    defaultNextId: 'arbitration_rules_body'
  },
  'arbitration_rules_body': {
    id: 'arbitration_rules_body',
    type: 'select',
    text: 'Arbitration Rules Body:',
    options: ['American Arbitration Association', 'JAMS', 'Local Arbitration Body', 'Other'],
    defaultNextId: 'arbitration_location'
  },
  'arbitration_location': {
    id: 'arbitration_location',
    type: 'text',
    text: 'Arbitration Location (City, State):',
    defaultNextId: 'governing_state'
  },
  'governing_country': {
    id: 'governing_country',
    type: 'select',
    text: 'Country for Governing Law:',
    options: [], // Will be populated dynamically from the database
    defaultNextId: 'governing_state'
  },
  'governing_state': {
    id: 'governing_state',
    type: 'select',
    text: 'State/Province for Governing Law:',
    options: [], // Will be populated dynamically based on country selection
    defaultNextId: 'governing_jurisdiction'
  },
  'governing_jurisdiction': {
    id: 'governing_jurisdiction',
    type: 'text',
    text: 'Governing Law Jurisdiction:',
    defaultNextId: 'user_info_step'
  },
  'user_info_step': {
    id: 'user_info_step',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your Independent Contractor Agreement based on your answers.',
  }
};

const IndependentContractorForm = () => {
  const navigate = useNavigate();
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [company, setCompany] = useState<Party>({ name: '', address: '' });
  const [contractor, setContractor] = useState<Party>({ name: '', address: '' });
  
  const currentSection = sections[currentSectionId];

  const handleNext = () => {
    try {
      const nextSectionId = currentSection?.nextSectionId;
      
      if (!nextSectionId) {
        setShowUserInfo(true);
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

  const updateParty = (partyType: 'company' | 'contractor', field: keyof Party, value: string) => {
    if (partyType === 'company') {
      setCompany({ ...company, [field]: value });
    } else {
      setContractor({ ...contractor, [field]: value });
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
      case 'number':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Input
              id={questionId}
              type="number"
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Enter a number"
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
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
      case 'select':
        // Get options based on question type
        let optionsToShow: Array<{value: string, label: string}> = [];
        
        if (questionId === 'country' || questionId === 'governing_country') {
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
        } else if (questionId === 'governing_state' && answers.governing_country) {
          // Get states for the selected governing country using country ID
          const countryId = parseInt(answers.governing_country);
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
                if (questionId === 'governing_country' && answers.governing_state) {
                  handleAnswer('governing_state', '');
                }
              }}
              disabled={
                (questionId === 'state' && !answers.country) ||
                (questionId === 'governing_state' && !answers.governing_country)
              }
            >
              <SelectTrigger className="mt-1 text-black w-full bg-white rounded-lg shadow-sm">
                <SelectValue placeholder={
                  (questionId === 'state' && !answers.country) ||
                  (questionId === 'governing_state' && !answers.governing_country)
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
              placeholder="Type your answer"
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
              rows={4}
            />
          </div>
        );
      case 'party':
        const isContractorInfo = questionId === 'contractor_info';
        const party = isContractorInfo ? contractor : company;
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">{isContractorInfo ? 'Contractor Name:' : 'Company Name:'}</Label>
                <Input
                  value={party.name}
                  onChange={(e) => updateParty(isContractorInfo ? 'contractor' : 'company', 'name', e.target.value)}
                  placeholder={`Enter ${isContractorInfo ? 'contractor' : 'company'} name`}
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">{isContractorInfo ? 'Contractor Address:' : 'Company Address:'}</Label>
                <Textarea
                  value={party.address}
                  onChange={(e) => updateParty(isContractorInfo ? 'contractor' : 'company', 'address', e.target.value)}
                  placeholder="Enter complete address"
                  className="text-black"
                  rows={2}
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
    console.log("Current section:", currentSectionId, "Questions:", currentSection?.questions);
    return currentSection.questions.map(questionId => renderQuestionInput(questionId));
  };
  const canAdvance = () => {
    if (currentSectionId === 'confirmation') return true;
    
    // Special validation for dynamic sections
    if (currentSectionId === 'location_selection') {
      return answers.country && answers.state;
    }
    if (currentSectionId === 'header') {
      return answers.place_of_signing && answers.agreement_date;
    }
    if (currentSectionId === 'parties') {
      return company.name && company.address && contractor.name && contractor.address;
    }
    if (currentSectionId === 'governing_law') {
      return answers.governing_country && answers.governing_state && answers.governing_jurisdiction;
    }
    
    // Check if all required fields in the current section have answers
    return currentSection.questions.every(questionId => {
      const question = questions[questionId];
      if (question?.options?.includes('None')) {
        return true; // Optional field
      }
      return !!answers[questionId];
    });
  };

  const generateIndependentContractorPDF = () => {
    setIsGeneratingPDF(true);
    try {
      console.log("Generating Independent Contractor Agreement PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Independent Contractor Agreement", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Agreement Header
      doc.setFont("helvetica", "normal");
      const headerText = `This Independent Contractor Agreement ("Agreement") is entered into on ${answers.agreement_date || '____ day of ___________, 20__'}, at ${answers.place_of_signing || '_______________'}, by and between ${company.name || '_______________'} ("Company"), and ${contractor.name || '_______________'} ("Contractor").`;
      
      const headerLines = doc.splitTextToSize(headerText, 170);
      headerLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Company Information
      doc.setFont("helvetica", "bold");
      doc.text("Company Information.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Company Name: ${company.name || '_______________'}`, 15, y);
      y += lineHeight;
      const companyAddressLines = doc.splitTextToSize(`Company Address: ${company.address || '_______________'}`, 170);
      companyAddressLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Contractor Information
      doc.setFont("helvetica", "bold");
      doc.text("Contractor Information.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Contractor Name: ${contractor.name || '_______________'}`, 15, y);
      y += lineHeight;
      const contractorAddressLines = doc.splitTextToSize(`Contractor Address: ${contractor.address || '_______________'}`, 170);
      contractorAddressLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // 1. Scope of Services
      doc.setFont("helvetica", "bold");
      doc.text("1. Scope of Services.", 15, y);
      y += lineHeight + 2;
      
      doc.setFont("helvetica", "normal");
      const servicesText = `The Contractor agrees to provide the following services: ${answers.services_description || '_______________'}. The Contractor shall perform these services in a professional and workmanlike manner in accordance with the highest standards of the Contractor's profession.`;
      
      const servicesLines = doc.splitTextToSize(servicesText, 170);
      servicesLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // 3. Term
      doc.setFont("helvetica", "bold");
      doc.text("3. Term.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const termText = `This Agreement shall commence on ${answers.start_date || '_______________'} and shall continue until ${answers.end_date || '_______________'}, unless terminated earlier in accordance with the provisions herein.`;
      
      const termLines = doc.splitTextToSize(termText, 170);
      termLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // 4. Termination
      doc.setFont("helvetica", "bold");
      doc.text("4. Termination.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const terminationText = `Either party may terminate this Agreement at any time by providing ${answers.termination_notice_days || '___'} days' written notice to the other party. Upon termination, the Contractor shall be compensated for all services performed up to the date of termination.`;
      
      const terminationLines = doc.splitTextToSize(terminationText, 170);
      terminationLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // 5. Payment for Services
      doc.setFont("helvetica", "bold");
      doc.text("5. Payment for Services.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const paymentText = `In consideration for the services provided, the Company shall pay the Contractor ${answers.payment_amount_rate || '_______________'}. Payment shall be made within ${answers.payment_period || '___'} days after receipt of an invoice from the Contractor.`;
      
      const paymentLines = doc.splitTextToSize(paymentText, 170);      paymentLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // 6. Expenses
      doc.setFont("helvetica", "bold");
      doc.text("6. Expenses.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const expensesText = "Unless otherwise agreed in writing, the Contractor shall be responsible for all expenses incurred while performing services under this Agreement, including but not limited to travel, materials, tools, and communication costs.";
      
      const expensesLines = doc.splitTextToSize(expensesText, 170);
      expensesLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // 7. Independent Contractor Status
      doc.setFont("helvetica", "bold");
      doc.text("7. Independent Contractor Status.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const statusText = "The Contractor is an independent contractor, not an employee of the Company. The Contractor shall have no authority to enter into contracts or agreements on behalf of the Company or otherwise bind the Company in any manner.";
      
      const statusLines = doc.splitTextToSize(statusText, 170);
      statusLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // 8. Taxes
      doc.setFont("helvetica", "bold");
      doc.text("8. Taxes.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const taxesText = "The Contractor agrees to report and pay all federal, state, and local taxes, contributions, and other liabilities related to payments received under this Agreement, including income tax, Social Security, and self-employment taxes.";
      
      const taxesLines = doc.splitTextToSize(taxesText, 170);
      taxesLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // 9. Subcontracting
      doc.setFont("helvetica", "bold");
      doc.text("9. Subcontracting.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const subcontractingText = "The Contractor may not assign, delegate, or subcontract any obligations under this Agreement without prior written consent from the Company.";
      
      const subcontractingLines = doc.splitTextToSize(subcontractingText, 170);
      subcontractingLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // 10. Ownership of Work Product
      doc.setFont("helvetica", "bold");
      doc.text("10. Ownership of Work Product.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const ownershipText = `All materials, documents, inventions, reports, and intellectual property created by the Contractor under this Agreement shall be the sole property of the Company. The Contractor assigns all rights, title, and interest in such work to the Company. Any and all works created or produced by the Contractor in connection with the Services under this Agreement shall be considered "work made for hire" and the exclusive property of the Company.`;
      
      const ownershipLines = doc.splitTextToSize(ownershipText, 170);
      ownershipLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // 11. Confidentiality
      doc.setFont("helvetica", "bold");
      doc.text("11. Confidentiality.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const confidentialityText = "The Contractor agrees not to disclose or use any proprietary or confidential information obtained while providing Services for the Company. This clause shall survive the termination of this Agreement.";
      
      const confidentialityLines = doc.splitTextToSize(confidentialityText, 170);
      confidentialityLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // 12. Non-Solicitation
      doc.setFont("helvetica", "bold");
      doc.text("12. Non-Solicitation.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const nonSolicitationText = `The Contractor agrees that for a period of ${answers.non_solicitation_duration || '_______________'} following the termination of this Agreement, the Contractor will not directly or indirectly solicit, induce, recruit, or encourage any employee of the Company to leave their employment.`;
      
      const nonSolicitationLines = doc.splitTextToSize(nonSolicitationText, 170);
      nonSolicitationLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // 15. Dispute Resolution
      doc.setFont("helvetica", "bold");
      doc.text("15. Dispute Resolution.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const disputeText = `Any dispute arising out of or relating to this Agreement shall be resolved through binding arbitration in accordance with the rules of the ${answers.arbitration_rules_body || '_______________'}. The arbitration shall take place in ${answers.arbitration_location || '_______________'}.`;
      
      const disputeLines = doc.splitTextToSize(disputeText, 170);      disputeLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // 13. Indemnification
      doc.setFont("helvetica", "bold");
      doc.text("13. Indemnification.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const indemnificationText = "The Contractor shall indemnify, defend, and hold harmless the Company, its officers, agents, and employees from and against any and all claims, losses, damages, liabilities, penalties, or expenses (including attorneys' fees) arising from or in connection with the performance of the Services.";
      
      const indemnificationLines = doc.splitTextToSize(indemnificationText, 170);
      indemnificationLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // 14. Insurance
      doc.setFont("helvetica", "bold");
      doc.text("14. Insurance.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const insuranceText = "The Contractor agrees to maintain adequate insurance coverage, including general liability and, if applicable, professional liability insurance, during the term of this Agreement. The Contractor shall provide proof of insurance upon request.";
      
      const insuranceLines = doc.splitTextToSize(insuranceText, 170);
      insuranceLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // 16. Governing Law
      doc.setFont("helvetica", "bold");
      doc.text("16. Governing Law.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const governingCountryName = answers.governing_country ? getCountryName(answers.governing_country) : '_______________';
      const governingStateName = answers.governing_state && answers.governing_country ? getStateName(answers.governing_country, answers.governing_state) : '_______________';
      
      const governingText = `This Agreement shall be governed by and construed in accordance with the laws of ${governingCountryName}${answers.governing_state ? ', ' + governingStateName : ''}. The jurisdiction for any legal proceedings shall be ${answers.governing_jurisdiction || '_______________'}.`;
      
      const governingLines = doc.splitTextToSize(governingText, 170);      governingLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // 17. Severability
      doc.setFont("helvetica", "bold");
      doc.text("17. Severability.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const severabilityText = "If any provision of this Agreement is determined to be invalid or unenforceable, the remainder of the Agreement shall remain in full force and effect.";
      
      const severabilityLines = doc.splitTextToSize(severabilityText, 170);
      severabilityLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Force Majeure
      doc.setFont("helvetica", "bold");
      doc.text("Force Majeure.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const forceMajeureText = "If either Party fails to fulfil its obligations hereunder when such failure is due to an act of God, or other circumstances beyond its reasonable control, including but not limited to fire, flood, civil commotion, protests, riot, war (declared and undeclared), revolution, or embargoes, then said failure shall not be considered a default of obligations hereunder for the duration of such event, and for such time thereafter as is reasonable to enable the affected Party or Parties to resume performance under this Agreement, provided however, that in no event shall such time extend for a period of more than ten business days.";
      
      const forceMajeureLines = doc.splitTextToSize(forceMajeureText, 170);
      forceMajeureLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // 18. Entire Agreement
      doc.setFont("helvetica", "bold");
      doc.text("18. Entire Agreement.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const entireAgreementText = "This document constitutes the entire agreement between the parties. It supersedes any prior understandings, agreements, or representations, written or oral, regarding the subject matter hereof.";
      
      const entireAgreementLines = doc.splitTextToSize(entireAgreementText, 170);
      entireAgreementLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // 19. Amendments
      doc.setFont("helvetica", "bold");
      doc.text("19. Amendments.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const amendmentsText = "Any changes or amendments to this Agreement must be made in writing and signed by both parties.";
      
      const amendmentsLines = doc.splitTextToSize(amendmentsText, 170);
      amendmentsLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight * 2;
      
      // Check if we need a new page for signatures
      if (y > pageHeight - 100) {
        doc.addPage();
        y = 20;
      }
      
      // 20. Signatures
      doc.setFont("helvetica", "bold");
      doc.text("20. Signatures.", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      
      // Company signature
      doc.text("The Company:", 15, y);
      y += lineHeight + 5;
      doc.text("Signature: ____________________________", 15, y);
      y += lineHeight + 2;
      doc.text(`Name: ${company.name || '_______________________________'}`, 15, y);
      y += lineHeight + 2;
      doc.text("Title: _______________________________", 15, y);
      y += lineHeight + 2;
      doc.text("Date: _______________________________", 15, y);
      y += lineHeight + 15;
      
      // Contractor signature
      doc.text("The Contractor:", 15, y);
      y += lineHeight + 5;
      doc.text("Signature: ____________________________", 15, y);
      y += lineHeight + 2;
      doc.text(`Name: ${contractor.name || '_______________________________'}`, 15, y);
      y += lineHeight + 2;
      doc.text("Date: _______________________________", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `independent_contractor_agreement_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Independent Contractor Agreement successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Independent Contractor Agreement");
      return null;
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Independent Contractor Agreement Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Agreement Details</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state && answers.country ? getStateName(answers.country, answers.state) : 'Not provided'}</p>
              <p><strong>Place:</strong> {answers.place_of_signing || 'Not provided'}</p>
              <p><strong>Date:</strong> {answers.agreement_date || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Company</h4>
              <p><strong>Name:</strong> {company.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {company.address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Contractor</h4>
              <p><strong>Name:</strong> {contractor.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {contractor.address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Services</h4>
              <p><strong>Description:</strong> {answers.services_description ? `${answers.services_description.substring(0, 50)}...` : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Term</h4>
              <p><strong>Start:</strong> {answers.start_date || 'Not provided'}</p>
              <p><strong>End:</strong> {answers.end_date || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Payment</h4>
              <p><strong>Amount/Rate:</strong> {answers.payment_amount_rate || 'Not provided'}</p>
              <p><strong>Payment Period:</strong> {answers.payment_period || 'Not provided'} days</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Termination</h4>
              <p><strong>Notice Period:</strong> {answers.termination_notice_days || 'Not provided'} days</p>
              <p><strong>Non-solicitation:</strong> {answers.non_solicitation_duration || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Legal Terms</h4>
              <p><strong>Governing Law:</strong> {answers.governing_country ? getCountryName(answers.governing_country) + (answers.governing_state ? ', ' + getStateName(answers.governing_country, answers.governing_state) : '') : 'Not provided'}</p>
              <p><strong>Arbitration:</strong> {answers.arbitration_rules_body || 'Not provided'}</p>
              <p><strong>Location:</strong> {answers.arbitration_location || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Independent Contractor Agreement.
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
          <CardTitle className="text-xl text-green-600">Independent Contractor Agreement</CardTitle>
          <CardDescription>
            Review your agreement details below before generating the final document.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderFormSummary()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"            onClick={() => {
              setAnswers({});
              setSectionHistory(['location_selection']);
              setCurrentSectionId('location_selection');
              setIsComplete(false);
              setCompany({ name: '', address: '' });
              setContractor({ name: '', address: '' });
            }}
          >
            Start Over
          </Button>
          <Button 
            onClick={generateIndependentContractorPDF}
          >
            Generate Agreement
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
        onGenerate={generateIndependentContractorPDF}
        documentType="Independent Contractor Agreement"
        isGenerating={isGeneratingPDF}
      />
    );
  }

  // Safety check for currentSection
  if (!currentSection) {
    return (
    <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
      <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        <CardContent className="text-center p-4">
          <p className="text-red-500">An error occurred. Please refresh the page.</p>          <Button 
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
          {currentSectionId === 'location_selection' && (
            <div className="mt-3 flex left-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/independent-contractor-info')}
                className="text-orange-600 border-orange-600 hover:bg-orange-50"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn More About Independent Contractor Agreement
              </Button>
            </div>
          )}
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

export default IndependentContractorForm;







