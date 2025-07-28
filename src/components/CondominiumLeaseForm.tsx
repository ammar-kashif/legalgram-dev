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
  type: 'text' | 'select' | 'textarea' | 'confirmation' | 'date' | 'number';
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

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'location_selection': {
    id: 'location_selection',
    title: 'Location Selection',
    description: 'Select the country and state where this condominium lease agreement will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'basic_info'
  },
  'basic_info': {
    id: 'basic_info',
    title: 'Basic Information',
    description: 'Enter the basic lease agreement details',
    questions: ['effective_date', 'landlord_name', 'tenant_name', 'premises_address'],
    nextSectionId: 'lease_terms'
  },
  'lease_terms': {
    id: 'lease_terms',
    title: 'Lease Terms',
    description: 'Define the lease period and rental terms',
    questions: ['commencement_date', 'termination_date', 'monthly_rent', 'rent_due_day', 'security_deposit'],
    nextSectionId: 'management_contact'
  },
  'management_contact': {
    id: 'management_contact',
    title: 'Management & Contact',
    description: 'Property management and contact information',
    questions: ['property_manager', 'manager_contact', 'manager_address'],
    nextSectionId: 'occupancy_rules'
  },
  'occupancy_rules': {
    id: 'occupancy_rules',
    title: 'Occupancy Rules',
    description: 'Set occupancy limits and guest policies',
    questions: ['max_occupants', 'guest_consecutive_days', 'guest_annual_days', 'num_keys', 'num_mailbox_keys'],
    nextSectionId: 'policies_fees'
  },
  'policies_fees': {
    id: 'policies_fees',
    title: 'Policies & Fees',
    description: 'Set various policies and associated fees',
    questions: ['key_replacement_fee', 'lockout_fee', 'returned_check_fee', 'early_termination_fee', 'early_termination_days'],
    nextSectionId: 'property_details'
  },
  'property_details': {
    id: 'property_details',
    title: 'Property Details',
    description: 'Furnishings, utilities, and property specifics',
    questions: ['furnishings', 'landlord_utilities', 'sale_notice_days', 'repair_cost_limit'],
    nextSectionId: 'addresses'
  },
  'addresses': {
    id: 'addresses',
    title: 'Contact Addresses',
    description: 'Landlord and tenant addresses for notices',
    questions: ['landlord_address', 'landlord_city_state', 'tenant_address', 'tenant_city_state'],
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
    text: 'Select your country:',
    options: getAllCountries().map(country => `${country.id}|${country.name}`),
    defaultNextId: 'state'
  },
  'state': {
    id: 'state',
    type: 'select',
    text: 'Select your state/province:',
    options: [], // Will be populated dynamically
    defaultNextId: 'effective_date'
  },
  'effective_date': {
    id: 'effective_date',
    type: 'date',
    text: 'Effective Date of the Lease Agreement:',
    defaultNextId: 'landlord_name'
  },
  'landlord_name': {
    id: 'landlord_name',
    type: 'text',
    text: 'Landlord\'s Full Name:',
    defaultNextId: 'tenant_name'
  },
  'tenant_name': {
    id: 'tenant_name',
    type: 'text',
    text: 'Tenant\'s Full Name:',
    defaultNextId: 'premises_address'
  },
  'premises_address': {
    id: 'premises_address',
    type: 'text',
    text: 'Condominium Unit Address (Premises):',
    defaultNextId: 'commencement_date'
  },
  'commencement_date': {
    id: 'commencement_date',
    type: 'date',
    text: 'Lease Commencement Date:',
    defaultNextId: 'termination_date'
  },
  'termination_date': {
    id: 'termination_date',
    type: 'date',
    text: 'Lease Termination Date:',
    defaultNextId: 'monthly_rent'
  },
  'monthly_rent': {
    id: 'monthly_rent',
    type: 'number',
    text: 'Monthly Rent Amount ($):',
    defaultNextId: 'rent_due_day'
  },
  'rent_due_day': {
    id: 'rent_due_day',
    type: 'number',
    text: 'Day of month rent is due (1-31):',
    defaultNextId: 'security_deposit'
  },
  'security_deposit': {
    id: 'security_deposit',
    type: 'number',
    text: 'Security Deposit Amount ($):',
    defaultNextId: 'property_manager'
  },
  'property_manager': {
    id: 'property_manager',
    type: 'text',
    text: 'Property Manager Name:',
    defaultNextId: 'manager_contact'
  },
  'manager_contact': {
    id: 'manager_contact',
    type: 'text',
    text: 'Property Manager Contact Information:',
    defaultNextId: 'manager_address'
  },
  'manager_address': {
    id: 'manager_address',
    type: 'text',
    text: 'Property Manager Address:',
    defaultNextId: 'max_occupants'
  },
  'max_occupants': {
    id: 'max_occupants',
    type: 'number',
    text: 'Maximum number of occupants:',
    defaultNextId: 'guest_consecutive_days'
  },
  'guest_consecutive_days': {
    id: 'guest_consecutive_days',
    type: 'number',
    text: 'Maximum consecutive days for guests:',
    defaultNextId: 'guest_annual_days'
  },
  'guest_annual_days': {
    id: 'guest_annual_days',
    type: 'number',
    text: 'Maximum total days annually for guests:',
    defaultNextId: 'num_keys'
  },
  'num_keys': {
    id: 'num_keys',
    type: 'number',
    text: 'Number of keys provided to tenant:',
    defaultNextId: 'num_mailbox_keys'
  },
  'num_mailbox_keys': {
    id: 'num_mailbox_keys',
    type: 'number',
    text: 'Number of mailbox keys provided:',
    defaultNextId: 'key_replacement_fee'
  },
  'key_replacement_fee': {
    id: 'key_replacement_fee',
    type: 'number',
    text: 'Key replacement fee ($):',
    defaultNextId: 'lockout_fee'
  },
  'lockout_fee': {
    id: 'lockout_fee',
    type: 'number',
    text: 'Lockout assistance fee ($):',
    defaultNextId: 'returned_check_fee'
  },
  'returned_check_fee': {
    id: 'returned_check_fee',
    type: 'number',
    text: 'Returned check fee ($):',
    defaultNextId: 'early_termination_fee'
  },
  'early_termination_fee': {
    id: 'early_termination_fee',
    type: 'number',
    text: 'Early termination fee ($):',
    defaultNextId: 'early_termination_days'
  },
  'early_termination_days': {
    id: 'early_termination_days',
    type: 'number',
    text: 'Early termination notice required (days):',
    defaultNextId: 'furnishings'
  },
  'furnishings': {
    id: 'furnishings',
    type: 'textarea',
    text: 'Furnishings and appliances provided by landlord:',
    defaultNextId: 'landlord_utilities'
  },
  'landlord_utilities': {
    id: 'landlord_utilities',
    type: 'textarea',
    text: 'Utilities and services landlord is responsible for:',
    defaultNextId: 'sale_notice_days'
  },
  'sale_notice_days': {
    id: 'sale_notice_days',
    type: 'number',
    text: 'Days notice for termination on sale:',
    defaultNextId: 'repair_cost_limit'
  },
  'repair_cost_limit': {
    id: 'repair_cost_limit',
    type: 'number',
    text: 'Repair cost limit for destruction clause ($):',
    defaultNextId: 'landlord_address'
  },
  'landlord_address': {
    id: 'landlord_address',
    type: 'text',
    text: 'Landlord Address for Notices:',
    defaultNextId: 'landlord_city_state'
  },
  'landlord_city_state': {
    id: 'landlord_city_state',
    type: 'text',
    text: 'Landlord City, State:',
    defaultNextId: 'tenant_address'
  },
  'tenant_address': {
    id: 'tenant_address',
    type: 'text',
    text: 'Tenant Address for Notices:',
    defaultNextId: 'tenant_city_state'
  },
  'tenant_city_state': {
    id: 'tenant_city_state',
    type: 'text',
    text: 'Tenant City, State:',
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your Condominium Lease Agreement based on your answers.',
  }
};

const CondominiumLeaseForm = () => {
  const navigate = useNavigate();
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [datePickerStates, setDatePickerStates] = useState<Record<string, boolean>>({});
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
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

  const setDatePickerOpen = (questionId: string, isOpen: boolean) => {
    setDatePickerStates({
      ...datePickerStates,
      [questionId]: isOpen
    });
  };
  
  const renderQuestionInput = (questionId: string) => {
    const question = questions[questionId];
    
    switch (question.type) {
      case 'text':
        return (
          <div className="mb-2">
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
      case 'number':
        return (
          <div className="mb-2">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Input
              id={questionId}
              type="number"
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Enter number"
              className="mt-1 text-black w-full bg-white"
            />
          </div>
        );
      case 'textarea':
        return (
          <div className="mb-2">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Textarea
              id={questionId}
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Type your answer"
              className="mt-1 text-black w-full bg-white"
              rows={3}
            />
          </div>
        );
      case 'date':
        return (
          <div className="mb-2">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Popover 
              open={datePickerStates[questionId] || false} 
              onOpenChange={(open) => setDatePickerOpen(questionId, open)}
            >
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1 text-black bg-white",
                    !answers[questionId] && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {answers[questionId] ? format(new Date(answers[questionId]), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={answers[questionId] ? new Date(answers[questionId]) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      handleAnswer(questionId, date.toISOString());
                      setDatePickerOpen(questionId, false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      case 'select':
        if (questionId === 'country') {
          return (
            <div className="mb-2">
              <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
                {question.text}
              </Label>
              <Select
                value={answers[questionId] || ''}
                onValueChange={(value) => {
                  handleAnswer(questionId, value);
                  // Reset state when country changes
                  if (answers.state) {
                    handleAnswer('state', '');
                  }
                }}
              >
                <SelectTrigger className="mt-1 text-black w-full bg-white">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {getAllCountries().map((country) => (
                    <SelectItem key={country.id} value={`${country.id}`}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        } else if (questionId === 'state') {
          const selectedCountryId = answers.country;
          const states = selectedCountryId ? getStatesByCountry(parseInt(selectedCountryId)) : [];
          
          return (
            <div className="mb-2">
              <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
                {question.text}
              </Label>
              <Select
                value={answers[questionId] || ''}
                onValueChange={(value) => handleAnswer(questionId, value)}
                disabled={!selectedCountryId}
              >
                <SelectTrigger className="mt-1 text-black w-full bg-white">
                  <SelectValue placeholder={selectedCountryId ? "Select a state/province" : "Select a country first"} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {states.map((state) => (
                    <SelectItem key={state.id} value={`${state.id}`}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }
        break;
      case 'confirmation':
        return (
          <div className="mt-2 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="mt-2 text-black">
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
    if (currentSectionId === 'basic_info') {
      return answers.effective_date && answers.landlord_name && answers.tenant_name && answers.premises_address;
    }
    if (currentSectionId === 'lease_terms') {
      return answers.commencement_date && answers.termination_date && answers.monthly_rent && answers.rent_due_day && answers.security_deposit;
    }
    if (currentSectionId === 'management_contact') {
      return answers.property_manager && answers.manager_contact && answers.manager_address;
    }
    if (currentSectionId === 'occupancy_rules') {
      return answers.max_occupants && answers.guest_consecutive_days && answers.guest_annual_days && answers.num_keys && answers.num_mailbox_keys;
    }
    if (currentSectionId === 'policies_fees') {
      return answers.key_replacement_fee && answers.lockout_fee && answers.returned_check_fee && answers.early_termination_fee && answers.early_termination_days;
    }
    if (currentSectionId === 'property_details') {
      return answers.furnishings && answers.landlord_utilities && answers.sale_notice_days && answers.repair_cost_limit;
    }
    if (currentSectionId === 'addresses') {
      return answers.landlord_address && answers.landlord_city_state && answers.tenant_address && answers.tenant_city_state;
    }
    
    // Default validation
    return true;
  };

  const generateCondominiumLeasePDF = () => {
    setIsGeneratingPDF(true);
    try {
      console.log("Generating Condominium Lease Agreement PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("CONDOMINIUM LEASE AGREEMENT", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Introduction
      const effectiveDate = answers.effective_date ? format(new Date(answers.effective_date), "MMMM d, yyyy") : '__________';
      const introText = `This Condominium Lease Agreement (the "Agreement") is entered into on ${effectiveDate} (the "Effective Date"),`;
      
      const introLines = doc.splitTextToSize(introText, 170);
      introLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      doc.setFont("helvetica", "bold");
      doc.text("By and Between", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      doc.text(`${answers.landlord_name || '__________'} (the "Landlord") and ${answers.tenant_name || '__________'} (the "Tenant"), collectively referred to as the "Parties."`, 15, y);
      y += lineHeight * 2 + 5;
      
      doc.text("For and in consideration of the mutual covenants and conditions set forth herein, the Parties hereby agree as follows:", 15, y);
      y += lineHeight + 10;
      
      // Section 1: PREMISES
      doc.setFont("helvetica", "bold");
      doc.text("1. PREMISES", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const premisesText = `Landlord hereby leases to Tenant the condominium unit located at ${answers.premises_address || '__________'} (the "Premises"), together with any common elements, improvements, or fixtures expressly stated herein. No additional portion of the building (the "Building") is included unless otherwise agreed upon in writing.`;
      
      const premisesLines = doc.splitTextToSize(premisesText, 170);
      premisesLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 5;
      
      // Section 2: TERM
      doc.setFont("helvetica", "bold");
      doc.text("2. TERM", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const commencementDate = answers.commencement_date ? format(new Date(answers.commencement_date), "MMMM d, yyyy") : '__________';
      const terminationDate = answers.termination_date ? format(new Date(answers.termination_date), "MMMM d, yyyy") : '__________';
      const termText = `The lease term shall commence on ${commencementDate} (the "Commencement Date") and terminate on ${terminationDate}. Thereafter, the lease shall continue on a month-to-month basis under the same terms and conditions unless otherwise modified by law or written agreement.`;
      
      const termLines = doc.splitTextToSize(termText, 170);
      termLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      const termConditionsText = `Tenant shall vacate the Premises upon lease termination unless: (i) A written extension or renewal is executed; (ii) Required by rent control legislation; or (iii) Landlord accepts Rent post-term, thereby establishing a month-to-month tenancy, terminable by either party with thirty (30) days' prior written notice.`;
      
      const termConditionsLines = doc.splitTextToSize(termConditionsText, 170);
      termConditionsLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 5;
      
      // Section 3: MANAGEMENT
      doc.setFont("helvetica", "bold");
      doc.text("3. MANAGEMENT", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const managementText = `Tenant is notified that ${answers.property_manager || '__________'} is the designated property manager. Any concerns or communications may be directed to ${answers.manager_contact || '__________'} at ${answers.manager_address || '__________'}.`;
      
      const managementLines = doc.splitTextToSize(managementText, 170);
      managementLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 10;
      
      // Section 4: RENT
      doc.setFont("helvetica", "bold");
      doc.text("4. RENT", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      doc.text('"Rent" includes all monetary obligations except for the Security Deposit.', 15, y);
      y += lineHeight + 3;
      
      const rentText = `(a) Tenant shall remit monthly rent in the amount of $${answers.monthly_rent || '0.00'}, due in advance on the ${answers.rent_due_day || '___'} day of each calendar month. Rent is deemed delinquent if not received by the following day.`;
      
      const rentLines = doc.splitTextToSize(rentText, 170);
      rentLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      const paymentText = "(b) Accepted payment method(s): __________. In the event of a returned payment: (i) Landlord may require cash payments for three consecutive months; and (ii) All future rent must be made via money order or cashier's check.";
      
      const paymentLines = doc.splitTextToSize(paymentText, 170);
      paymentLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 10;
      
      // Continue with more sections...
      // Section 5: SECURITY DEPOSIT
      doc.setFont("helvetica", "bold");
      doc.text("5. SECURITY DEPOSIT", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const securityText = `Tenant shall deposit with Landlord the sum of $${answers.security_deposit || '0.00'} as a Security Deposit to secure faithful performance under this Agreement. Said deposit shall be governed by applicable statutes.`;
      
      const securityLines = doc.splitTextToSize(securityText, 170);
      securityLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 5;
      
      // Add remaining sections (abbreviated for space)
      const addSection = (title: string, content: string) => {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFont("helvetica", "bold");
        doc.text(title, 15, y);
        y += lineHeight + 3;
        
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(content, 170);
        lines.forEach((line: string) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 15, y);
          y += lineHeight;
        });
        y += lineHeight + 5;
      };
      
      addSection("6. POSSESSION", "Tenant shall receive possession on the Commencement Date and shall surrender possession upon lease termination, removing all personal belongings and restoring the Premises to original condition, less reasonable wear and tear.");
      
      addSection("7. OCCUPANTS", `No more than ${answers.max_occupants || '0'} person(s) may reside at the Premises without prior written consent from the Landlord. This lease shall bind all signatories regardless of occupancy status. Guest Limitations: Guests may not remain more than ${answers.guest_consecutive_days || '0'} consecutive days or more than ${answers.guest_annual_days || '0'} total days annually. No more than two guests per bedroom are allowed at any time. Longer stays require written consent.`);
      
      addSection("8. FURNISHINGS", `The following furnishings and/or appliances shall be provided by Landlord: ${answers.furnishings || '__________'}. Tenant shall return all such items in original condition, ordinary wear and tear excepted.`);
      
      addSection("9. DAMAGES", "The following items, if damaged, shall incur the following charges: Item: ________ Charge: $________");
      
      addSection("10. KEYS", `Tenant shall receive ${answers.num_keys || '0'} key(s) to the Premises and ${answers.num_mailbox_keys || '0'} mailbox key(s). A $${answers.key_replacement_fee || '0.00'} charge applies for unreturned keys. Lock changes require prior approval and duplicate keys must be furnished to Landlord.`);
      
      addSection("11. LOCKOUT", `Tenant shall pay $${answers.lockout_fee || '0.00'} for lockout assistance.`);
      
      addSection("12. SMOKING", "Smoking is strictly prohibited within or around the Premises, including common areas. Violations constitute a breach, subjecting Tenant to legal remedies including eviction.");
      
      addSection("13. STORAGE", "No exterior storage is included or authorized under this Agreement.");
      
      addSection("14. PARKING", "No parking rights are conferred by this Lease.");
      
      addSection("15. MAINTENANCE", "Landlord shall maintain the Premises in good repair and in accordance with applicable habitability standards. Except in emergencies, maintenance requests must be submitted in writing.");
      
      addSection("16. UTILITIES & SERVICES", `Landlord Responsibilities: ${answers.landlord_utilities || '__________'}\nTenant Responsibilities: Electricity, Water & Sewer, Gas, Heating, Trash Removal, Telephone, Cable, Internet`);
      
      addSection("17. TAXES", "Real Estate Taxes: Landlord's responsibility. Personal Property Taxes: Landlord shall pay any such taxes attributable to Tenant's use of the Premises.");
      
      addSection("18. INSURANCE", "Both parties shall maintain appropriate insurance coverage for their respective property and liabilities.");
      
      addSection("19. RETURNED PAYMENTS", `Each returned check incurs a $${answers.returned_check_fee || '0.00'} fee. Repeated occurrences are subject to Lease default provisions.`);
      
      addSection("20. DEFAULT", "Tenant shall be in default upon any lease breach. A 5-day cure period shall apply to financial defaults and 10 days for non-monetary defaults. Cured defaults shall include all related legal and administrative costs.");
      
      addSection("21. TERMINATION ON SALE", `Landlord may terminate the Lease with ${answers.sale_notice_days || '____'} days' written notice in the event of a bona fide sale of the Premises.`);
      
      addSection("22. EARLY TERMINATION", `Tenant may terminate with ${answers.early_termination_days || '0'} days' written notice and payment of a $${answers.early_termination_fee || '0.00'} early termination fee, subject to local law.`);
      
      addSection("23. MILITARY TERMINATION", "Tenant in active military service may terminate upon thirty (30) days' written notice, along with a copy of deployment or relocation orders.");
      
      addSection("24. DESTRUCTION OR CONDEMNATION", `If the Premises become uninhabitable and cannot be repaired within 60 days or cost exceeds $${answers.repair_cost_limit || '0.00'}, the Lease shall terminate, and rent shall abate accordingly.`);
      
      addSection("25. HABITABILITY", "Tenant affirms the Premises are habitable upon occupancy. If the condition materially changes, Tenant must notify Landlord promptly.");
      
      addSection("26. HOLDOVER", "Any holdover beyond the lease term shall create a month-to-month tenancy at the most recent rent amount.");
      
      addSection("27. CUMULATIVE RIGHTS", "All rights under this Agreement are cumulative and non-exclusive unless otherwise mandated by law.");
      
      addSection("28. IMPROVEMENTS", "Tenant shall not alter or improve the Premises without Landlord's prior written consent. Any approved alterations must be removed or restored at lease-end, as directed by Landlord.");
      
      addSection("29. LANDLORD ACCESS", "With reasonable notice, Landlord may enter the Premises for inspections, maintenance, or showing. Consent shall not be unreasonably withheld. Emergency access is permitted without notice.");
      
      addSection("30. INDEMNIFICATION", "Tenant agrees to indemnify and hold harmless Landlord against claims or losses arising from Tenant's use or occupancy, except where due to Landlord's gross negligence.");
      
      addSection("31. ACCOMMODATION", "Landlord shall provide reasonable accommodations for tenants with disabilities in accordance with applicable laws.");
      
      addSection("32. HAZARDOUS MATERIALS", "Tenant shall not store or use dangerous or flammable materials on the Premises without prior consent and proof of insurance.");
      
      addSection("33. LEGAL COMPLIANCE", "Tenant shall comply with all federal, state, and local laws, regulations, and codes.");
      
      addSection("34. MECHANIC'S LIENS", "Tenant shall not allow mechanic's or materialman's liens on the Premises. Tenant shall notify all vendors in advance that liens are not permitted.");
      
      addSection("35. SUBORDINATION", "This Lease is subordinate to all current and future mortgages on the Premises.");
      
      addSection("36. ASSIGNMENT & SUBLETTING", "Assignment or subletting is strictly prohibited unless otherwise permitted in writing by Landlord.");
      
      addSection("37. NOTICES", `Landlord Address:\n${answers.landlord_address || '__________'}\n${answers.landlord_city_state || '__________'}\n\nTenant Address:\n${answers.tenant_address || '__________'}\n${answers.tenant_city_state || '__________'}\n\nNotice shall be deemed received three (3) days after mailing.`);
      
      addSection("38. GOVERNING LAW", `This Agreement shall be governed by the laws of the State of ${answers.state ? getStateName(answers.country || '', answers.state) : '__________'}.`);
      
      addSection("39. ENTIRE AGREEMENT", "This document contains the entire agreement between the Parties and supersedes all prior understandings.");
      
      addSection("40. SEVERABILITY; WAIVER", "Invalid provisions shall be severed without affecting enforceability of the remainder. Failure to enforce shall not constitute waiver.");
      
      addSection("41. TIME IS OF THE ESSENCE", "Time is a material term of this Agreement.");
      
      addSection("42. ESTOPPEL CERTIFICATE", "Tenant shall return a signed estoppel certificate within three (3) days of request. Failure to do so constitutes agreement with the certificate's contents.");
      
      addSection("43. TENANT REPRESENTATIONS", "Tenant affirms that all information in the rental application is accurate and authorizes verification by Landlord.");
      
      addSection("44. BINDING EFFECT", "This Lease shall bind and benefit the Parties and their respective heirs, successors, and assigns.");
      
      addSection("45. DISPUTE RESOLUTION", "Disputes shall first be addressed through good-faith negotiation. If unresolved, the matter shall proceed to mediation. If still unresolved, parties may pursue all legal remedies available.");
      
      // Signatures
      if (y > pageHeight - 100) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFont("helvetica", "bold");
      doc.text("IN WITNESS WHEREOF, the parties hereto have executed this Lease Agreement as of the dates set forth below:", 15, y);
      y += lineHeight + 15;
      
      doc.text("LANDLORD:", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      doc.text("By: ______________________", 15, y);
      y += lineHeight + 5;
      doc.text("Date: ______________________", 15, y);
      y += lineHeight + 15;
      
      doc.setFont("helvetica", "bold");
      doc.text("TENANT:", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      doc.text("By: ______________________", 15, y);
      y += lineHeight + 5;
      doc.text("Date: ______________________", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `condominium_lease_agreement_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Condominium Lease Agreement successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Condominium Lease Agreement");
      return null;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-2 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Condominium Lease Agreement Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Basic Information</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state ? getStateName(answers.country || '', answers.state) : 'Not provided'}</p>
              <p><strong>Effective Date:</strong> {answers.effective_date ? format(new Date(answers.effective_date), 'PPP') : 'Not provided'}</p>
              <p><strong>Landlord:</strong> {answers.landlord_name || 'Not provided'}</p>
              <p><strong>Tenant:</strong> {answers.tenant_name || 'Not provided'}</p>
              <p><strong>Premises:</strong> {answers.premises_address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Lease Terms</h4>
              <p><strong>Start Date:</strong> {answers.commencement_date ? format(new Date(answers.commencement_date), 'PPP') : 'Not provided'}</p>
              <p><strong>End Date:</strong> {answers.termination_date ? format(new Date(answers.termination_date), 'PPP') : 'Not provided'}</p>
              <p><strong>Monthly Rent:</strong> ${answers.monthly_rent || 'Not provided'}</p>
              <p><strong>Due Day:</strong> {answers.rent_due_day || 'Not provided'}</p>
              <p><strong>Security Deposit:</strong> ${answers.security_deposit || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Management</h4>
              <p><strong>Property Manager:</strong> {answers.property_manager || 'Not provided'}</p>
              <p><strong>Contact:</strong> {answers.manager_contact || 'Not provided'}</p>
              <p><strong>Address:</strong> {answers.manager_address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Occupancy & Policies</h4>
              <p><strong>Max Occupants:</strong> {answers.max_occupants || 'Not provided'}</p>
              <p><strong>Guest Limits:</strong> {answers.guest_consecutive_days || 'Not provided'} consecutive days</p>
              <p><strong>Keys Provided:</strong> {answers.num_keys || 'Not provided'}</p>
              <p><strong>Key Replacement Fee:</strong> ${answers.key_replacement_fee || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Condominium Lease Agreement.
          </p>
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
      <div className="bg-gray-50 py-2 min-h-0">
        <Card className="max-w-4xl mx-auto bg-white px-4 my-2 rounded-lg shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-600">Condominium Lease Agreement</CardTitle>
            <CardDescription>
              Review your Condominium Lease Agreement details below before generating the final document.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
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
              className="mt-2"
            >
              Start Over
            </Button>
            <Button 
              onClick={generateCondominiumLeasePDF}
            >
              Generate Condominium Lease Agreement
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Safety check for currentSection
  if (!currentSection) {
    return (
      <div className="bg-gray-50 py-2 min-h-0">
        <Card className="max-w-4xl mx-auto bg-white px-4 my-2 rounded-lg shadow-sm">
          <CardContent className="text-center p-4">
            <p className="text-red-500">An error occurred. Please refresh the page.</p>
            <Button 
              onClick={() => {
                setCurrentSectionId('location_selection');
                setSectionHistory(['location_selection']);
              }}
              className="mt-2"
            >
              Start Over
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // In the render logic, render UserInfoStep for user_info_step section
  if (currentSectionId === 'user_info_step') {
    return (
      <UserInfoStep
        onBack={handleBack}
        onGenerate={generateCondominiumLeasePDF}
        documentType="Condominium Lease Agreement"
        isGenerating={isGeneratingPDF}
      />
    );
  }

  return (
    <div className="bg-gray-50 py-2 min-h-0">
      <Card className="max-w-4xl mx-auto bg-white px-4 my-2 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">{currentSection.title}</CardTitle>
          <CardDescription>
            {currentSection.description}
            {currentSectionId === 'location_selection' && (
              <div className="mt-3 flex left-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/condominium-lease-info')}
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Learn More About Condominium Lease Agreement
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

export default CondominiumLeaseForm;
