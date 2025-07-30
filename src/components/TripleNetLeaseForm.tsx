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
    description: 'Select the country and state where this triple net lease will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'lease_date'
  },
  'lease_date': {
    id: 'lease_date',
    title: 'Lease Date',
    description: 'Enter the date of this triple net lease agreement',
    questions: ['lease_date'],
    nextSectionId: 'parties_info'
  },
  'parties_info': {
    id: 'parties_info',
    title: 'Parties Information',
    description: 'Enter the landlord and tenant information with addresses',
    questions: ['landlord_name', 'landlord_address', 'tenant_name', 'tenant_address'],
    nextSectionId: 'premises_info'
  },
  'premises_info': {
    id: 'premises_info',
    title: 'Premises Information',
    description: 'Details about the property being leased',
    questions: ['property_address'],
    nextSectionId: 'lease_terms'
  },
  'lease_terms': {
    id: 'lease_terms',
    title: 'Lease Terms',
    description: 'Basic lease terms including dates and rent',
    questions: ['start_date', 'end_date', 'monthly_rent', 'payment_address'],
    nextSectionId: 'deposits_insurance'
  },
  'deposits_insurance': {
    id: 'deposits_insurance',
    title: 'Security Deposit & Insurance',
    description: 'Security deposit and insurance requirements',
    questions: ['security_deposit', 'casualty_insurance', 'liability_insurance'],
    nextSectionId: 'termination_terms'
  },
  'termination_terms': {
    id: 'termination_terms',
    title: 'Termination Terms',
    description: 'Termination notice periods and fees',
    questions: ['landlord_sale_notice_days', 'tenant_termination_notice_days', 'termination_fee_months'],
    nextSectionId: 'default_terms'
  },
  'default_terms': {
    id: 'default_terms',
    title: 'Default Terms',
    description: 'Default cure periods',
    questions: ['default_cure_days'],
    nextSectionId: 'notices_info'
  },
  'notices_info': {
    id: 'notices_info',
    title: 'Notice Information',
    description: 'Contact addresses for official notices',
    questions: ['landlord_notice_name', 'landlord_notice_address', 'tenant_notice_name', 'tenant_notice_address'],
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
    text: 'Date of this Triple Net Lease Agreement:',
    defaultNextId: 'landlord_name'
  },
  'landlord_name': {
    id: 'landlord_name',
    type: 'text',
    text: 'Landlord\'s Full Legal Name:',
    defaultNextId: 'landlord_address'
  },
  'landlord_address': {
    id: 'landlord_address',
    type: 'text',
    text: 'Landlord\'s Mailing Address:',
    defaultNextId: 'tenant_name'
  },
  'tenant_name': {
    id: 'tenant_name',
    type: 'text',
    text: 'Tenant\'s Full Legal Name:',
    defaultNextId: 'tenant_address'
  },
  'tenant_address': {
    id: 'tenant_address',
    type: 'text',
    text: 'Tenant\'s Mailing Address:',
    defaultNextId: 'property_address'
  },
  'property_address': {
    id: 'property_address',
    type: 'text',
    text: 'Property Full Address (real property, building, and improvements):',
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
    text: 'Monthly Base Rent Amount ($):',
    defaultNextId: 'payment_address'
  },
  'payment_address': {
    id: 'payment_address',
    type: 'text',
    text: 'Rent Payment Address:',
    defaultNextId: 'security_deposit'
  },
  'security_deposit': {
    id: 'security_deposit',
    type: 'number',
    text: 'Security Deposit Amount ($):',
    defaultNextId: 'casualty_insurance'
  },
  'casualty_insurance': {
    id: 'casualty_insurance',
    type: 'number',
    text: 'Required Casualty Insurance Coverage Amount ($):',
    defaultNextId: 'liability_insurance'
  },
  'liability_insurance': {
    id: 'liability_insurance',
    type: 'number',
    text: 'Required General Liability Insurance Amount ($):',
    defaultNextId: 'landlord_sale_notice_days'
  },
  'landlord_sale_notice_days': {
    id: 'landlord_sale_notice_days',
    type: 'number',
    text: 'Landlord Notice Days for Termination on Sale:',
    defaultNextId: 'tenant_termination_notice_days'
  },
  'tenant_termination_notice_days': {
    id: 'tenant_termination_notice_days',
    type: 'number',
    text: 'Tenant Termination Notice Days:',
    defaultNextId: 'termination_fee_months'
  },
  'termination_fee_months': {
    id: 'termination_fee_months',
    type: 'number',
    text: 'Tenant Termination Fee (Number of Months\' Rent):',
    defaultNextId: 'default_cure_days'
  },
  'default_cure_days': {
    id: 'default_cure_days',
    type: 'number',
    text: 'Days to Cure Default After Written Notice:',
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
    text: 'Landlord Address for Notices:',
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
    text: 'Tenant Address for Notices:',
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Please review all information above and click "Complete" to generate your Triple Net Lease Agreement.',
    defaultNextId: ''
  }
};

const TripleNetLeaseForm = () => {
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
    if (currentSectionId === 'user_info_step') {
      return (
        <UserInfoStep
        onBack={handleBack}
        onGenerate={generateTripleNetLeasePDF}
        isGenerating={isGeneratingPDF}
          documentType="Triple Net Lease Agreement"
        />
      );
    }
    
    return currentSection.questions.map(questionId => renderQuestionInput(questionId));
  };

  const canAdvance = () => {
    if (currentSectionId === 'confirmation') return true;
    if (currentSectionId === 'user_info_step') return false; // Handled by UserInfoStep component
    
    // Special validation for different sections
    if (currentSectionId === 'location_selection') {
      return answers.country && answers.state;
    }
    if (currentSectionId === 'lease_date') {
      return answers.lease_date;
    }
    if (currentSectionId === 'parties_info') {
      return answers.landlord_name && answers.landlord_address && answers.tenant_name && answers.tenant_address;
    }
    if (currentSectionId === 'premises_info') {
      return answers.property_address;
    }
    if (currentSectionId === 'lease_terms') {
      return answers.start_date && answers.end_date && answers.monthly_rent && answers.payment_address;
    }
    if (currentSectionId === 'deposits_insurance') {
      return answers.security_deposit && answers.casualty_insurance && answers.liability_insurance;
    }
    if (currentSectionId === 'termination_terms') {
      return answers.landlord_sale_notice_days && answers.tenant_termination_notice_days && answers.termination_fee_months;
    }
    if (currentSectionId === 'default_terms') {
      return answers.default_cure_days;
    }
    if (currentSectionId === 'notices_info') {
      return answers.landlord_notice_name && answers.landlord_notice_address && 
             answers.tenant_notice_name && answers.tenant_notice_address;
    }
    
    // Default validation
    return true;
  };

  const generateTripleNetLeasePDF = async (userInfo?: { name: string; email: string; phone: string }) => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF();
      
      // Set up the document
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("TRIPLE NET LEASE AGREEMENT", 105, 20, { align: "center" });
      
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

      // Introduction using exact template text
      const leaseDate = answers.lease_date ? format(new Date(answers.lease_date), "MMMM d, yyyy") : '[Insert Date]';
      const landlordName = answers.landlord_name || '[Insert Landlord\'s Full Legal Name]';
      const landlordAddress = answers.landlord_address || '[Insert Landlord\'s Address]';
      const tenantName = answers.tenant_name || '[Insert Tenant\'s Full Legal Name]';
      const tenantAddress = answers.tenant_address || '[Insert Tenant\'s Address]';
      
      addSection("", `This Triple Net Lease Agreement (\"Agreement\" or \"Lease\") is made and entered into as of ${leaseDate}, by and between ${landlordName}, whose mailing address is ${landlordAddress} (hereinafter referred to as the \"Landlord\"),`);
      addSection("", "And");
      addSection("", `${tenantName}, whose mailing address is ${tenantAddress} (hereinafter referred to as the \"Tenant\"). The Landlord and the Tenant may collectively be referred to as the \"Parties\" and individually as a \"Party.\"`);

      // Section 1: Premises
      const propertyAddress = answers.property_address || '[Insert Full Property Address]';
      addSection("1. Premises", `The Landlord hereby leases to the Tenant, and the Tenant hereby leases from the Landlord, the real property, building, and improvements located at ${propertyAddress} (the \"Premises\"), subject to the terms and conditions set forth herein.`);

      // Section 2: Term
      const startDate = answers.start_date ? format(new Date(answers.start_date), "MMMM d, yyyy") : '[Insert Start Date]';
      const endDate = answers.end_date ? format(new Date(answers.end_date), "MMMM d, yyyy") : '[Insert End Date]';
      addSection("2. Term", `The term of this Lease shall commence on ${startDate} and shall continue through ${endDate} (the \"Term\"), unless sooner terminated pursuant to the provisions herein. Either Party may terminate this Lease by providing at least thirty (30) days' prior written notice, which must coincide with the end of a calendar month.`);

      // Section 3: Triple Net Lease
      addSection("3. Triple Net Lease", "This Lease is a Triple Net Lease, meaning the Tenant shall be solely responsible for all expenses associated with the Premises, including but not limited to: real estate taxes, property insurance, repairs and maintenance, utilities, common area maintenance (CAM), and any other costs associated with the operation, use, or occupancy of the Premises. It is the intention of the Parties that the Landlord shall have no obligation to incur any expenses related to the Premises during the Term of this Lease.");

      // Section 4: Rent
      const monthlyRent = answers.monthly_rent || '[Insert Amount]';
      const paymentAddress = answers.payment_address || '[Insert Payment Address]';
      addSection("4. Rent", `The Tenant agrees to pay to the Landlord monthly base rent in the amount of $${monthlyRent}, payable in advance on or before the first (1st) day of each calendar month. Rent shall be payable at ${paymentAddress} or at such other address as the Landlord may designate in writing.`);

      // Section 5: Additional Charges (Estimated Payments)
      addSection("5. Additional Charges (Estimated Payments)", "In addition to base rent, the Tenant shall pay estimated monthly charges for: real estate taxes, insurance premiums, and maintenance costs (including landscaping, parking lot repairs, etc.). These estimated amounts will be determined and updated by the Landlord from time to time and billed monthly with the rent. Actual expenses shall be reconciled quarterly, and any overpayment or underpayment shall be refunded or invoiced accordingly.");

      // Section 6: Security Deposit
      const securityDeposit = answers.security_deposit || '[Insert Amount]';
      addSection("6. Security Deposit", `Upon execution of this Lease, the Tenant shall deposit with the Landlord the sum of $${securityDeposit} as a Security Deposit, to be held by the Landlord as security for the faithful performance of all terms and obligations of this Lease. The Security Deposit shall be returned to the Tenant at the expiration of the Lease, less any lawful deductions.`);

      // Section 7: Possession and Condition
      addSection("7. Possession and Condition", "Tenant shall take possession of the Premises on the commencement date. Upon expiration or earlier termination of this Lease, the Tenant shall vacate and surrender the Premises in good order, condition, and repair, broom-cleaned and free of all personal property and debris, reasonable wear and tear excepted.");

      // Section 8: Alterations and Improvements
      addSection("8. Alterations and Improvements", "The Tenant shall not make any alterations, additions, or improvements to the Premises without the prior written consent of the Landlord, which shall not be unreasonably withheld. All such work shall comply with all applicable laws and shall be conducted at the Tenant's sole cost and expense.");

      // Section 9: Insurance
      const casualtyInsurance = answers.casualty_insurance || '[Insert Amount]';
      const liabilityInsurance = answers.liability_insurance || '[Insert Amount]';
      addSection("9. Insurance", `Tenant shall, at its own expense, maintain: (a) casualty insurance covering the Premises in an amount not less than $${casualtyInsurance}; and (b) general liability insurance with a combined single limit of at least $${liabilityInsurance}. Landlord shall be named as an additional insured on all such policies. Tenant shall deliver certificates of insurance to the Landlord as proof of coverage and shall ensure that Landlord receives at least thirty (30) days' notice prior to any cancellation or material change in coverage.`);

      // Section 10: Maintenance and Utilities
      addSection("10. Maintenance and Utilities", "The Tenant shall, at its sole expense, keep and maintain the Premises (including all structural components, systems, and exterior areas) in good order and repair throughout the Term. Tenant shall also be responsible for and shall pay all charges for water, sewer, electricity, gas, telephone, trash collection, and any other utilities or services used or consumed at the Premises.");

      // Section 11: Taxes
      addSection("11. Taxes", "Tenant shall pay all real property taxes and personal property taxes levied against the Premises or arising from its use thereof. Tenant may contest any such taxes, at its own expense, provided such contest does not subject the Premises to lien or forfeiture.");

      // Section 12: Termination
      const landlordSaleNotice = answers.landlord_sale_notice_days || '[Insert Days]';
      const tenantTerminationNotice = answers.tenant_termination_notice_days || '[Insert Days]';
      const terminationFeeMonths = answers.termination_fee_months || '[Insert Number]';
      addSection("12. Termination", `(a) Landlord Termination on Sale: Landlord may terminate this Lease upon ${landlordSaleNotice} days' written notice in the event of sale of the Premises. (b) Tenant Termination: Tenant may terminate the Lease by providing ${tenantTerminationNotice} days' prior written notice and paying a termination fee equal to ${terminationFeeMonths} months' rent.`);

      // Section 13: Casualty or Condemnation
      addSection("13. Casualty or Condemnation", "If the Premises are partially or totally damaged by fire or other casualty such that Tenant's use is materially impaired and the damage cannot be repaired within sixty (60) days, either Party may terminate the Lease upon twenty (20) days' written notice. Any rent paid in advance shall be prorated and refunded accordingly.");

      // Section 14: Default and Remedies
      const defaultCureDays = answers.default_cure_days || '[Insert Days]';
      addSection("14. Default and Remedies", `Tenant shall be in default if it fails to perform any obligation under this Lease and does not cure such failure within ${defaultCureDays} days of written notice from Landlord. Upon default, Landlord may terminate this Lease and take possession of the Premises, and pursue all legal and equitable remedies available at law or equity.`);

      // Section 15: Indemnification
      addSection("15. Indemnification", "Tenant shall indemnify, defend, and hold harmless the Landlord from and against any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from Tenant's occupancy, use, or maintenance of the Premises, except those caused by the Landlord's willful misconduct or negligence.");

      // Section 16: Hazardous Materials
      addSection("16. Hazardous Materials", "Tenant shall not bring, store, use, or dispose of any hazardous materials on the Premises except those reasonably required for its business operations and in full compliance with all applicable environmental laws and regulations. Tenant shall promptly remediate any spills or releases caused by it or its agents and shall indemnify Landlord for all related liabilities.");

      // Section 17: Dispute Resolution
      addSection("17. Dispute Resolution", "The Parties agree to first attempt to resolve any dispute arising from this Lease through good faith negotiations. If resolution is not reached within thirty (30) days, the Parties agree to submit the dispute to binding arbitration in accordance with the rules of the American Arbitration Association. If arbitration is not available or fails, either Party may pursue legal remedies available under applicable law.");

      // Section 18: Assignment and Subletting
      addSection("18. Assignment and Subletting", "Tenant shall not assign this Lease or sublease all or any portion of the Premises without the prior written consent of the Landlord, which consent shall not be unreasonably withheld, conditioned, or delayed. Any attempted assignment or subletting without such consent shall be void and constitute a material breach of this Lease.");

      // Section 19: Notices
      const landlordNoticeName = answers.landlord_notice_name || '[Insert Landlord Name]';
      const landlordNoticeAddress = answers.landlord_notice_address || '[Insert Address]';
      const tenantNoticeName = answers.tenant_notice_name || '[Insert Tenant Name]';
      const tenantNoticeAddress = answers.tenant_notice_address || '[Insert Address]';
      
      addSection("19. Notices", `All notices required or permitted under this Lease shall be in writing and shall be delivered personally, sent by certified mail (return receipt requested), or sent by a nationally recognized overnight courier service to the addresses listed below, or such other addresses as either Party may designate in writing:\n\nLandlord:\n${landlordNoticeName}\n${landlordNoticeAddress}\n\nTenant:\n${tenantNoticeName}\n${tenantNoticeAddress}\n\nNotices shall be deemed received upon actual receipt or three (3) days after mailing, whichever occurs first.`);

      // Section 20: Governing Law
      const stateName = answers.state ? getStateName(answers.country || '', answers.state) : '[Insert State]';
      addSection("20. Governing Law", `This Lease shall be governed by and construed in accordance with the laws of the State of ${stateName}, without regard to its conflict of laws principles.`);

      // Section 21: Entire Agreement
      addSection("21. Entire Agreement", "This Lease, together with any exhibits attached hereto and incorporated herein by reference, constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior agreements, understandings, negotiations, and discussions, whether oral or written, of the Parties.");

      // Section 22: Amendment
      addSection("22. Amendment", "This Lease may only be amended, modified, or supplemented by a written agreement signed by both Parties. No oral modifications shall be binding on either Party.");

      // Section 23: Severability
      addSection("23. Severability", "If any provision of this Lease is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect, and the invalid provision shall be deemed modified to the extent necessary to make it valid and enforceable.");

      // Section 24: Waiver
      addSection("24. Waiver", "No waiver of any term, condition, or breach of this Lease shall be deemed to constitute a waiver of any other term, condition, or breach, whether of the same or different nature. Any waiver must be in writing and signed by the Party against whom the waiver is sought to be enforced.");

      // Section 25: Binding Effect
      addSection("25. Binding Effect", "This Lease shall be binding upon and shall inure to the benefit of the Parties and their respective heirs, successors, legal representatives, and permitted assigns.");

      // Section 26: Time is of the Essence
      addSection("26. Time is of the Essence", "Time is of the essence with respect to all obligations of the Parties under this Lease.");

      // Section 27: Counterparts
      addSection("27. Counterparts", "This Lease may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument. Electronic signatures shall be deemed to have the same legal effect as original signatures.");

      // Signatures
      if (y > pageHeight - 120) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFont("helvetica", "bold");
      doc.text("IN WITNESS WHEREOF, the Parties have executed this Triple Net Lease Agreement as of the date first above written.", 15, y);
      y += lineHeight + 15;
      
      doc.text("LANDLORD:", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      doc.text("Signature: ___________________________", 15, y);
      y += lineHeight + 5;
      doc.text(`Name: ${landlordName}`, 15, y);
      y += lineHeight + 5;
      doc.text("Date: ___________________", 15, y);
      y += lineHeight + 15;
      
      doc.setFont("helvetica", "bold");
      doc.text("TENANT:", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      doc.text("Signature: ___________________________", 15, y);
      y += lineHeight + 5;
      doc.text(`Name: ${tenantName}`, 15, y);
      y += lineHeight + 5;
      doc.text("Date: ___________________", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `triple_net_lease_agreement_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Triple Net Lease Agreement successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Triple Net Lease Agreement");
      return null;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-2 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Triple Net Lease Agreement Summary</h3>
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
              <p><strong>Casualty Insurance:</strong> ${answers.casualty_insurance || 'Not provided'}</p>
              <p><strong>Liability Insurance:</strong> ${answers.liability_insurance || 'Not provided'}</p>
              <p><strong>Default Cure Days:</strong> {answers.default_cure_days || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Triple Net Lease Agreement.
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
            <CardTitle className="text-xl text-green-600">Triple Net Lease Agreement</CardTitle>
            <CardDescription>
              Review your Triple Net Lease Agreement details below before generating the final document.
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
              onClick={() => generateTripleNetLeasePDF()}
>
              Generate Triple Net Lease Agreement
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
                  onClick={() => navigate('/triple-net-lease-info')}
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Learn More About Triple Net Lease
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

export default TripleNetLeaseForm;
