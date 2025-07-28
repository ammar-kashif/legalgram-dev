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
    description: 'Select the country and state where this commercial lease will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'lease_date'
  },
  'lease_date': {
    id: 'lease_date',
    title: 'Lease Date',
    description: 'Enter the date of this commercial lease agreement',
    questions: ['lease_date'],
    nextSectionId: 'parties_info'
  },
  'parties_info': {
    id: 'parties_info',
    title: 'Parties Information',
    description: 'Enter the landlord and tenant information',
    questions: ['landlord_name', 'tenant_name'],
    nextSectionId: 'premises_info'
  },
  'premises_info': {
    id: 'premises_info',
    title: 'Premises Information',
    description: 'Details about the commercial property being leased',
    questions: ['property_address'],
    nextSectionId: 'lease_terms'
  },
  'lease_terms': {
    id: 'lease_terms',
    title: 'Lease Terms',
    description: 'Basic lease terms including dates and rent',
    questions: ['start_date', 'end_date', 'monthly_rent', 'rent_due_day', 'payment_address'],
    nextSectionId: 'deposits_insurance'
  },
  'deposits_insurance': {
    id: 'deposits_insurance',
    title: 'Security Deposit & Insurance',
    description: 'Security deposit and insurance requirements',
    questions: ['security_deposit', 'insurance_amount'],
    nextSectionId: 'business_details'
  },
  'business_details': {
    id: 'business_details',
    title: 'Business & Property Details',
    description: 'Furnishings, parking, and storage information',
    questions: ['furnishings', 'parking_spaces', 'storage_area'],
    nextSectionId: 'renewal_terms'
  },
  'renewal_terms': {
    id: 'renewal_terms',
    title: 'Renewal Terms',
    description: 'Automatic renewal and termination options',
    questions: ['renewal_duration', 'renewal_notice_days', 'renewal_rent', 'renewal_period'],
    nextSectionId: 'financial_terms'
  },
  'financial_terms': {
    id: 'financial_terms',
    title: 'Financial Terms',
    description: 'Late fees, thresholds, and financial obligations',
    questions: ['threshold_amount', 'sale_notice_days', 'financial_cure_days', 'other_cure_days', 'late_fee', 'late_fee_days', 'returned_check_fee'],
    nextSectionId: 'notices_info'
  },
  'notices_info': {
    id: 'notices_info',
    title: 'Notice Information',
    description: 'Contact addresses for official notices',
    questions: ['landlord_notice_name', 'landlord_notice_address', 'landlord_notice_city', 'tenant_notice_name', 'tenant_notice_address', 'tenant_notice_city'],
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
    title: 'Contact Information',
    description: 'Provide your contact information to generate the document',
    questions: ['user_info_step'],
    nextSectionId: 'confirmation'
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
    defaultNextId: 'lease_date'
  },
  'lease_date': {
    id: 'lease_date',
    type: 'date',
    text: 'Date of this Commercial Lease Agreement:',
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
    defaultNextId: 'property_address'
  },
  'property_address': {
    id: 'property_address',
    type: 'text',
    text: 'Commercial Property Full Address (including Unit, City, State, ZIP Code):',
    defaultNextId: 'start_date'
  },
  'start_date': {
    id: 'start_date',
    type: 'date',
    text: 'Lease Start Date:',
    defaultNextId: 'end_date'
  },
  'end_date': {
    id: 'end_date',
    type: 'date',
    text: 'Lease End Date:',
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
    type: 'text',
    text: 'Rent Due Day of Month (e.g., 1st, 15th):',
    defaultNextId: 'payment_address'
  },
  'payment_address': {
    id: 'payment_address',
    type: 'text',
    text: 'Landlord\'s Payment Address:',
    defaultNextId: 'security_deposit'
  },
  'security_deposit': {
    id: 'security_deposit',
    type: 'number',
    text: 'Security Deposit Amount ($):',
    defaultNextId: 'insurance_amount'
  },
  'insurance_amount': {
    id: 'insurance_amount',
    type: 'number',
    text: 'Required Insurance Coverage Amount ($):',
    defaultNextId: 'furnishings'
  },
  'furnishings': {
    id: 'furnishings',
    type: 'textarea',
    text: 'List of Furnishings Provided by Landlord:',
    defaultNextId: 'parking_spaces'
  },
  'parking_spaces': {
    id: 'parking_spaces',
    type: 'number',
    text: 'Number of Parking Spaces:',
    defaultNextId: 'storage_area'
  },
  'storage_area': {
    id: 'storage_area',
    type: 'text',
    text: 'Description of Storage Area:',
    defaultNextId: 'renewal_duration'
  },
  'renewal_duration': {
    id: 'renewal_duration',
    type: 'text',
    text: 'Automatic Renewal Duration (e.g., one year, six months):',
    defaultNextId: 'renewal_notice_days'
  },
  'renewal_notice_days': {
    id: 'renewal_notice_days',
    type: 'number',
    text: 'Notice Required for Non-Renewal (days):',
    defaultNextId: 'renewal_rent'
  },
  'renewal_rent': {
    id: 'renewal_rent',
    type: 'number',
    text: 'Renewal Rent Amount ($):',
    defaultNextId: 'renewal_period'
  },
  'renewal_period': {
    id: 'renewal_period',
    type: 'text',
    text: 'Renewal Rent Period (e.g., month, year):',
    defaultNextId: 'threshold_amount'
  },
  'threshold_amount': {
    id: 'threshold_amount',
    type: 'number',
    text: 'Damage Repair Threshold Amount ($):',
    defaultNextId: 'sale_notice_days'
  },
  'sale_notice_days': {
    id: 'sale_notice_days',
    type: 'number',
    text: 'Notice Days for Termination Upon Sale:',
    defaultNextId: 'financial_cure_days'
  },
  'financial_cure_days': {
    id: 'financial_cure_days',
    type: 'number',
    text: 'Days to Cure Financial Default:',
    defaultNextId: 'other_cure_days'
  },
  'other_cure_days': {
    id: 'other_cure_days',
    type: 'number',
    text: 'Days to Cure Other Defaults:',
    defaultNextId: 'late_fee'
  },
  'late_fee': {
    id: 'late_fee',
    type: 'number',
    text: 'Late Payment Fee ($):',
    defaultNextId: 'late_fee_days'
  },
  'late_fee_days': {
    id: 'late_fee_days',
    type: 'number',
    text: 'Days After Due Date for Late Fee:',
    defaultNextId: 'returned_check_fee'
  },
  'returned_check_fee': {
    id: 'returned_check_fee',
    type: 'number',
    text: 'Returned Check Fee ($):',
    defaultNextId: 'landlord_notice_name'
  },
  'landlord_notice_name': {
    id: 'landlord_notice_name',
    type: 'text',
    text: 'Landlord Name for Notices:',
    defaultNextId: 'landlord_notice_address'
  },
  'landlord_notice_address': {
    id: 'landlord_notice_address',
    type: 'text',
    text: 'Landlord Address Line for Notices:',
    defaultNextId: 'landlord_notice_city'
  },
  'landlord_notice_city': {
    id: 'landlord_notice_city',
    type: 'text',
    text: 'Landlord City, State, ZIP for Notices:',
    defaultNextId: 'tenant_notice_name'
  },
  'tenant_notice_name': {
    id: 'tenant_notice_name',
    type: 'text',
    text: 'Tenant Name for Notices:',
    defaultNextId: 'tenant_notice_address'
  },
  'tenant_notice_address': {
    id: 'tenant_notice_address',
    type: 'text',
    text: 'Tenant Address Line for Notices:',
    defaultNextId: 'tenant_notice_city'
  },
  'tenant_notice_city': {
    id: 'tenant_notice_city',
    type: 'text',
    text: 'Tenant City, State, ZIP for Notices:',
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Please review all information above and click "Complete" to generate your Commercial Lease Agreement.',
    defaultNextId: ''
  }
};

const CommercialLeaseForm = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const currentSection = sections[currentSectionId];

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentSectionId === 'confirmation') {
      const nextSectionId = currentSection.nextSectionId;
      if (nextSectionId) {
        setCurrentSectionId(nextSectionId);
        setSectionHistory([...sectionHistory, nextSectionId]);
      }
      return;
    }

    if (currentSectionId === 'user_info_step') {
      setIsComplete(true);
      return;
    }

    const nextSectionId = currentSection.nextSectionId;
    if (nextSectionId) {
      setCurrentSectionId(nextSectionId);
      setSectionHistory([...sectionHistory, nextSectionId]);
    }
  };

  const handleBack = () => {
    if (sectionHistory.length > 1) {
      const newHistory = sectionHistory.slice(0, -1);
      setSectionHistory(newHistory);
      setCurrentSectionId(newHistory[newHistory.length - 1]);
    }
  };

  const renderQuestionInput = (questionId: string) => {
    const question = questions[questionId];
    if (!question) return null;

    switch (question.type) {
      case 'text':
        return (
          <div key={questionId} className="space-y-2">
            <Label htmlFor={questionId} className="text-black font-medium">
              {question.text}
            </Label>
            <Input
              id={questionId}
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              className="text-black"
              placeholder="Enter your answer..."
            />
          </div>
        );
      case 'number':
        return (
          <div key={questionId} className="space-y-2">
            <Label htmlFor={questionId} className="text-black font-medium">
              {question.text}
            </Label>
            <Input
              id={questionId}
              type="number"
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              className="text-black"
              placeholder="Enter amount..."
            />
          </div>
        );
      case 'textarea':
        return (
          <div key={questionId} className="space-y-2">
            <Label htmlFor={questionId} className="text-black font-medium">
              {question.text}
            </Label>
            <Textarea
              id={questionId}
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              className="text-black min-h-20"
              placeholder="Enter details..."
            />
          </div>
        );
      case 'date':
        return (
          <div key={questionId} className="space-y-2">
            <Label htmlFor={questionId} className="text-black font-medium">
              {question.text}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal text-black",
                    !answers[questionId] && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {answers[questionId] ? format(new Date(answers[questionId]), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={answers[questionId] ? new Date(answers[questionId]) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      handleAnswer(questionId, date.toISOString());
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
            <div key={questionId} className="space-y-2">
              <Label htmlFor={questionId} className="text-black font-medium">
                {question.text}
              </Label>
              <Select
                value={answers[questionId] || ''}
                onValueChange={(value) => {
                  handleAnswer(questionId, value);
                  // Clear state when country changes
                  if (answers.state) {
                    handleAnswer('state', '');
                  }
                }}
              >
                <SelectTrigger className="text-black">
                  <SelectValue placeholder="Select a country..." />
                </SelectTrigger>
                <SelectContent>
                  {getAllCountries().map((country) => (
                    <SelectItem key={country.id} value={`${country.id}`}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }
        
        if (questionId === 'state') {
          const countryId = answers.country;
          if (!countryId) {
            return (
              <div key={questionId} className="space-y-2">
                <Label className="text-black font-medium">
                  {question.text}
                </Label>
                <p className="text-gray-500 text-sm">Please select a country first</p>
              </div>
            );
          }
          
          const states = getStatesByCountry(parseInt(countryId));
          
          return (
            <div key={questionId} className="space-y-2">
              <Label htmlFor={questionId} className="text-black font-medium">
                {question.text}
              </Label>
              <Select
                value={answers[questionId] || ''}
                onValueChange={(value) => handleAnswer(questionId, value)}
              >
                <SelectTrigger className="text-black">
                  <SelectValue placeholder="Select a state/province..." />
                </SelectTrigger>
                <SelectContent>
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
    if (currentSectionId === 'lease_date') {
      return answers.lease_date;
    }
    if (currentSectionId === 'parties_info') {
      return answers.landlord_name && answers.tenant_name;
    }
    if (currentSectionId === 'premises_info') {
      return answers.property_address;
    }
    if (currentSectionId === 'lease_terms') {
      return answers.start_date && answers.end_date && answers.monthly_rent && answers.rent_due_day && answers.payment_address;
    }
    if (currentSectionId === 'deposits_insurance') {
      return answers.security_deposit && answers.insurance_amount;
    }
    if (currentSectionId === 'business_details') {
      return answers.parking_spaces; // Only require parking spaces as minimum
    }
    if (currentSectionId === 'renewal_terms') {
      return answers.renewal_duration && answers.renewal_notice_days && answers.renewal_rent && answers.renewal_period;
    }
    if (currentSectionId === 'financial_terms') {
      return answers.threshold_amount && answers.sale_notice_days && answers.financial_cure_days && answers.other_cure_days;
    }
    if (currentSectionId === 'notices_info') {
      return answers.landlord_notice_name && answers.landlord_notice_address && answers.landlord_notice_city && 
             answers.tenant_notice_name && answers.tenant_notice_address && answers.tenant_notice_city;
    }
    
    // Default validation
    return true;
  };

  const generateCommercialLeasePDF = () => {
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      
      // Set up the document
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("COMMERCIAL LEASE AGREEMENT", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Helper function to add sections
      const addSection = (title: string, content: string) => {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = 20;
        }
        
        if (title) {
          doc.setFont("helvetica", "bold");
          doc.text(title, 15, y);
          y += lineHeight + 3;
        }
        
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

      // Introduction
      const leaseDate = answers.lease_date ? format(new Date(answers.lease_date), "MMMM d, yyyy") : '[Insert Date]';
      const landlordName = answers.landlord_name || '[Landlord\'s Full Name]';
      const tenantName = answers.tenant_name || '[Tenant\'s Full Name]';
      
      addSection("", `This Commercial Lease Agreement ("Lease") is made and entered into as of ${leaseDate}, by and between ${landlordName}, hereinafter referred to as the "Landlord,"`);
      addSection("", "And");
      addSection("", `${tenantName}, hereinafter referred to as the "Tenant."`);

      // Section 1: Leased Premises
      const propertyAddress = answers.property_address || '[Full Address including Unit, City, State, ZIP Code]';
      addSection("1. Leased Premises", `Landlord hereby leases to Tenant the commercial premises located at ${propertyAddress} ("Premises"), in consideration of the lease payments set forth herein.`);

      // Section 2: Term
      const startDate = answers.start_date ? format(new Date(answers.start_date), "MMMM d, yyyy") : '[Start Date]';
      const endDate = answers.end_date ? format(new Date(answers.end_date), "MMMM d, yyyy") : '[End Date]';
      addSection("2. Term", `The term of this Lease shall commence on ${startDate} and shall terminate on ${endDate}, unless earlier terminated in accordance with the terms of this Lease.`);

      // Section 3: Rent
      const monthlyRent = answers.monthly_rent || '[Amount]';
      const rentDueDay = answers.rent_due_day || '[Due Day]';
      const paymentAddress = answers.payment_address || '[Landlord\'s Payment Address]';
      addSection("3. Rent", `Tenant shall pay monthly rent in the amount of $${monthlyRent}, payable in advance on or before the ${rentDueDay} of each calendar month. Payments shall be made to the Landlord at ${paymentAddress}, or at such other address as Landlord may designate in writing.`);

      // Section 4: Security Deposit
      const securityDeposit = answers.security_deposit || '[Amount]';
      addSection("4. Security Deposit", `Upon execution of this Lease, Tenant shall deposit with Landlord the sum of $${securityDeposit} as a security deposit to be held in trust and applied, if necessary, to cover damages or defaults, in accordance with applicable law.`);

      // Section 5: Possession
      addSection("5. Possession", "Tenant shall be entitled to possession of the Premises on the lease commencement date and shall surrender the Premises in good condition, ordinary wear and tear excepted, on the lease termination date, unless otherwise agreed in writing.");

      // Section 6: Exclusivity
      addSection("6. Exclusivity", "Landlord agrees not to lease any part of the property to a tenant engaged in a business that directly competes with the primary business of the Tenant, thereby granting Tenant the exclusive right to operate such business within the property.");

      // Section 7: Furnishings
      const furnishings = answers.furnishings || '[List Furnishings]';
      addSection("7. Furnishings", `The following furnishings shall be provided by the Landlord: ${furnishings}. Tenant agrees to return all such items in the same condition, reasonable wear and tear excepted, at lease termination.`);

      // Section 8: Parking and Storage
      const parkingSpaces = answers.parking_spaces || '[Number]';
      const storageArea = answers.storage_area || '[Describe Storage Area]';
      addSection("8. Parking and Storage", `Tenant shall be entitled to use ${parkingSpaces} parking space(s). Additionally, Tenant may use ${storageArea} for personal property at Tenant's own risk; Landlord shall not be liable for any loss or damage.`);

      // Section 9: Insurance
      const insuranceAmount = answers.insurance_amount || '[Amount]';
      addSection("9. Insurance", `Both Landlord and Tenant shall maintain adequate property insurance covering their respective interests in the Premises. Tenant shall also maintain commercial general liability insurance with a combined aggregate limit of not less than $${insuranceAmount}, naming Landlord as an additional insured.`);

      // Section 10: Renewal
      const renewalDuration = answers.renewal_duration || '[Renewal Duration]';
      const renewalNotice = answers.renewal_notice_days || '[Number]';
      const renewalRent = answers.renewal_rent || '[Amount]';
      const renewalPeriod = answers.renewal_period || '[Period]';
      addSection("10. Renewal", `This Lease shall automatically renew for successive terms of ${renewalDuration}, unless either party provides written notice of termination at least ${renewalNotice} days prior to the end of the current term. The rent during renewal terms shall be $${renewalRent} per ${renewalPeriod}.`);

      // Section 11: Maintenance and Utilities
      addSection("11. Maintenance and Utilities", "Landlord shall maintain the Premises in good repair and be responsible for all utilities and services associated with the Premises unless otherwise agreed.");

      // Section 12: Taxes
      addSection("12. Taxes", "Real Estate Taxes: Landlord shall be responsible for all real estate taxes.\nPersonal Property Taxes: Landlord shall also pay any personal property taxes or charges resulting from Tenant's use of the Premises.");

      // Section 13: Termination Upon Sale
      const saleNotice = answers.sale_notice_days || '[Number]';
      addSection("13. Termination Upon Sale", `Landlord may terminate this Lease upon ${saleNotice} days' written notice if the Premises is sold.`);

      // Section 14: Casualty and Condemnation
      const thresholdAmount = answers.threshold_amount || '[Threshold Amount]';
      addSection("14. Casualty and Condemnation", `If the Premises is damaged or destroyed and cannot be reasonably repaired within 60 days at a cost below $${thresholdAmount}, or if the Premises is condemned, either party may terminate this Lease upon 20 days' written notice. Rent shall be prorated and refunded for any prepaid period not used.`);

      // Section 15: Default
      const financialCureDays = answers.financial_cure_days || '[Number]';
      const otherCureDays = answers.other_cure_days || '[Number]';
      addSection("15. Default", `Tenant shall be in default if it fails to meet any obligations under this Lease. Tenant shall have ${financialCureDays} days to cure a financial default and ${otherCureDays} days to cure any other default after written notice from Landlord. Landlord may enter and repossess the Premises or cure the default and recover associated costs and reasonable attorney's fees. All sums due under this Lease are deemed additional rent.`);

      // Section 16: Late Payments
      const lateFee = answers.late_fee || '[Amount]';
      const lateFeeDays = answers.late_fee_days || '[Number]';
      addSection("16. Late Payments", `A late fee of $${lateFee} shall be assessed for any rent not paid within ${lateFeeDays} days of its due date.`);

      // Section 17: Holdover
      addSection("17. Holdover", "If Tenant retains possession of the Premises beyond the lease term without written agreement, such possession shall be deemed a holdover tenancy, and rent shall be due at the renewal rate specified in this Lease.");

      // Section 18: Cumulative Rights
      addSection("18. Cumulative Rights", "All rights and remedies provided in this Lease are cumulative and do not exclude any rights available under law.");

      // Section 19: Returned Checks
      const returnedCheckFee = answers.returned_check_fee || '[Amount]';
      addSection("19. Returned Checks", `Tenant shall be charged $${returnedCheckFee} for each check returned due to insufficient funds.`);

      // Section 20: Notices
      const landlordNoticeName = answers.landlord_notice_name || '[Name]';
      const landlordNoticeAddress = answers.landlord_notice_address || '[Address Line 1]';
      const landlordNoticeCity = answers.landlord_notice_city || '[City, State, ZIP Code]';
      const tenantNoticeName = answers.tenant_notice_name || '[Name]';
      const tenantNoticeAddress = answers.tenant_notice_address || '[Address Line 1]';
      const tenantNoticeCity = answers.tenant_notice_city || '[City, State, ZIP Code]';
      
      addSection("20. Notices", `All notices shall be in writing and delivered by certified mail, addressed as follows (or to any updated address upon written notice):\nLandlord:\n${landlordNoticeName}\n${landlordNoticeAddress}\n${landlordNoticeCity}\nTenant:\n${tenantNoticeName}\n${tenantNoticeAddress}\n${tenantNoticeCity}\nNotices shall be deemed received three (3) days after mailing.`);

      // Section 21: Governing Law
      const stateName = answers.state ? getStateName(answers.country || '', answers.state) : '[Insert State]';
      addSection("21. Governing Law", `This Lease shall be governed by and construed in accordance with the laws of the State of ${stateName}.`);

      // Remaining sections
      addSection("22. Entire Agreement", "This Lease constitutes the entire agreement between the parties and supersedes all prior discussions, representations, and understandings.");

      addSection("23. Amendments", "No modification of this Lease shall be valid unless in writing and signed by both parties.");

      addSection("24. Severability", "If any provision of this Lease is found invalid or unenforceable, the remaining provisions shall remain in full force and effect. Any invalid provision shall be modified as necessary to become enforceable to the fullest extent permitted by law.");

      addSection("25. Waiver", "Failure to enforce any provision shall not be deemed a waiver of that or any other provision.");

      addSection("26. Binding Effect", "This Lease shall bind and benefit the parties, their heirs, successors, legal representatives, and permitted assigns.");

      // Signatures
      if (y > pageHeight - 120) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFont("helvetica", "bold");
      doc.text("IN WITNESS WHEREOF, the parties have executed this Commercial Lease Agreement as of the date first above written.", 15, y);
      y += lineHeight + 15;
      
      doc.text("Landlord:", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      doc.text("Signature: ___________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Name: ______________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Date: _______________________________", 15, y);
      y += lineHeight + 15;
      
      doc.setFont("helvetica", "bold");
      doc.text("Tenant:", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      doc.text("Signature: ___________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Name: ______________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Date: _______________________________", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `commercial_lease_agreement_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Commercial Lease Agreement successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Commercial Lease Agreement");
      return null;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-2 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Commercial Lease Agreement Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Basic Information</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state ? getStateName(answers.country || '', answers.state) : 'Not provided'}</p>
              <p><strong>Lease Date:</strong> {answers.lease_date ? format(new Date(answers.lease_date), 'PPP') : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Parties</h4>
              <p><strong>Landlord:</strong> {answers.landlord_name || 'Not provided'}</p>
              <p><strong>Tenant:</strong> {answers.tenant_name || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Property & Terms</h4>
              <p><strong>Property:</strong> {answers.property_address || 'Not provided'}</p>
              <p><strong>Start Date:</strong> {answers.start_date ? format(new Date(answers.start_date), 'PPP') : 'Not provided'}</p>
              <p><strong>End Date:</strong> {answers.end_date ? format(new Date(answers.end_date), 'PPP') : 'Not provided'}</p>
              <p><strong>Monthly Rent:</strong> ${answers.monthly_rent || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Financial Terms</h4>
              <p><strong>Security Deposit:</strong> ${answers.security_deposit || 'Not provided'}</p>
              <p><strong>Insurance:</strong> ${answers.insurance_amount || 'Not provided'}</p>
              <p><strong>Late Fee:</strong> ${answers.late_fee || 'Not provided'}</p>
              <p><strong>Parking Spaces:</strong> {answers.parking_spaces || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Commercial Lease Agreement.
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
            <CardTitle className="text-xl text-green-600">Commercial Lease Agreement</CardTitle>
            <CardDescription>
              Review your Commercial Lease Agreement details below before generating the final document.
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
              onClick={() => setCurrentSectionId('user_info_step')}
            >
              Continue to Generate PDF
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Handle user info step
  if (currentSectionId === 'user_info_step') {
    return (
      <div className="bg-gray-50 py-2 min-h-0">
        <Card className="max-w-4xl mx-auto bg-white px-4 my-2 rounded-lg shadow-sm">
          <UserInfoStep
            onBack={handleBack}
            onGenerate={generateCommercialLeasePDF}
            documentType="Commercial Lease Agreement"
            isGenerating={isGeneratingPDF}
          />
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
                  onClick={() => navigate('/commercial-lease-info')}
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Learn More About Commercial Lease
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

export default CommercialLeaseForm;
