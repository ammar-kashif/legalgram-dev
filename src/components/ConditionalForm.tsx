
import { useState } from "react";
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
  type: 'text' | 'select' | 'radio' | 'textarea' | 'confirmation' | 'date' | 'number' | 'email' | 'phone';
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
    description: 'Select the country and state/province where this lease agreement will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'parties'
  },
  'parties': {
    id: 'parties',
    title: 'Parties Information',
    description: 'Enter information about the landlord and tenant',
    questions: ['start', 'tenant_name', 'tenant_address', 'tenant_phone', 'tenant_email'],
    nextSectionId: 'property'
  },
  'property': {
    id: 'property',
    title: 'Property Information',
    description: 'Enter details about the property being leased',
    questions: ['property_address', 'property_city', 'property_zip'],
    nextSectionId: 'lease_terms'
  },
  'lease_terms': {
    id: 'lease_terms',
    title: 'Lease Terms',
    description: 'Define the terms of the lease agreement',
    questions: ['lease_start', 'lease_end', 'rent_amount', 'payment_method', 'security_deposit'],
    nextSectionId: 'landlord_info'
  },
  'landlord_info': {
    id: 'landlord_info',
    title: 'Landlord Information',
    description: 'Provide contact information for the landlord',
    questions: ['landlord_address', 'landlord_phone', 'landlord_email'],
    nextSectionId: 'keys_access'
  },
  'keys_access': {
    id: 'keys_access',
    title: 'Keys and Access',
    description: 'Details about property access',
    questions: ['house_keys', 'mailbox_keys', 'key_replacement_fee', 'lockout_fee'],
    nextSectionId: 'occupancy'
  },
  'occupancy': {
    id: 'occupancy',
    title: 'Occupancy Details',
    description: 'Rules regarding guests and occupancy',
    questions: ['max_guests', 'max_guest_days', 'early_termination_days'],
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
    text: 'Select the country where this lease agreement will be executed:',
    options: [], // Will be populated dynamically from the database
    defaultNextId: 'state'
  },
  'state': {
    id: 'state',
    type: 'select',
    text: 'Select the state/province where this lease agreement will be executed:',
    options: [], // Will be populated dynamically based on country selection
    defaultNextId: 'start'
  },
  'start': {
    id: 'start',
    type: 'text',
    text: 'Landlord\'s full legal name:',
    defaultNextId: 'tenant_name'
  },
  'tenant_name': {
    id: 'tenant_name',
    type: 'text',
    text: 'Tenant\'s full legal name:',
    defaultNextId: 'property_address'
  },
  'property_address': {
    id: 'property_address',
    type: 'text',
    text: 'Street address of the leased property:',
    defaultNextId: 'property_city'
  },
  'property_city': {
    id: 'property_city',
    type: 'text',
    text: 'City where the property is located:',
    defaultNextId: 'property_zip'
  },
  'property_zip': {
    id: 'property_zip',
    type: 'text',
    text: 'ZIP code of the property:',
    defaultNextId: 'lease_start'
  },
  'lease_start': {
    id: 'lease_start',
    type: 'date',
    text: 'Lease start date:',
    defaultNextId: 'lease_end'
  },
  'lease_end': {
    id: 'lease_end',
    type: 'date',
    text: 'Lease end date:',
    defaultNextId: 'rent_amount'
  },
  'rent_amount': {
    id: 'rent_amount',
    type: 'number',
    text: 'Monthly rent amount ($):',
    defaultNextId: 'payment_method'
  },
  'payment_method': {
    id: 'payment_method',
    type: 'text',
    text: 'Payment method(s) accepted:',
    defaultNextId: 'landlord_address'
  },
  'landlord_address': {
    id: 'landlord_address',
    type: 'textarea',
    text: 'Landlord\'s full address for payments and notices:',
    defaultNextId: 'landlord_phone'
  },
  'landlord_phone': {
    id: 'landlord_phone',
    type: 'phone',
    text: 'Landlord\'s phone number:',
    defaultNextId: 'landlord_email'
  },
  'landlord_email': {
    id: 'landlord_email',
    type: 'email',
    text: 'Landlord\'s email address:',
    defaultNextId: 'security_deposit'
  },
  'security_deposit': {
    id: 'security_deposit',
    type: 'number',
    text: 'Security deposit amount ($):',
    defaultNextId: 'house_keys'
  },
  'house_keys': {
    id: 'house_keys',
    type: 'number',
    text: 'Number of keys to the property:',
    defaultNextId: 'mailbox_keys'
  },
  'mailbox_keys': {
    id: 'mailbox_keys',
    type: 'number',
    text: 'Number of mailbox keys:',
    defaultNextId: 'key_replacement_fee'
  },
  'key_replacement_fee': {
    id: 'key_replacement_fee',
    type: 'number',
    text: 'Fee for replacing lost keys ($):',
    defaultNextId: 'lockout_fee'
  },
  'lockout_fee': {
    id: 'lockout_fee',
    type: 'number',
    text: 'Lockout fee ($):',
    defaultNextId: 'max_guests'
  },
  'max_guests': {
    id: 'max_guests',
    type: 'number',
    text: 'Maximum number of guests allowed:',
    defaultNextId: 'max_guest_days'
  },
  'max_guest_days': {
    id: 'max_guest_days',
    type: 'number',
    text: 'Maximum days guests may stay:',
    defaultNextId: 'early_termination_days'
  },
  'early_termination_days': {
    id: 'early_termination_days',
    type: 'number',
    text: 'Days\' notice required for early termination:',
    defaultNextId: 'tenant_address'
  },
  'tenant_address': {
    id: 'tenant_address',
    type: 'textarea',
    text: 'Tenant\'s current address for notices:',
    defaultNextId: 'tenant_phone'
  },
  'tenant_phone': {
    id: 'tenant_phone',
    type: 'phone',
    text: 'Tenant\'s phone number:',
    defaultNextId: 'tenant_email'
  },
  'tenant_email': {
    id: 'tenant_email',
    type: 'email',
    text: 'Tenant\'s email address:',
    defaultNextId: 'confirmation'
  },  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your complete Lease Agreement based on your answers.',
  }
};

const ConditionalForm = () => {  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const currentSection = sections[currentSectionId];
  
  const handleNext = () => {
    const nextSectionId = currentSection.nextSectionId;
    
    if (!nextSectionId) {
      setIsComplete(true);
      return;
    }
    
    if (nextSectionId) {
      setSectionHistory([...sectionHistory, nextSectionId]);
      setCurrentSectionId(nextSectionId);
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
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Enter a number"
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
            />
          </div>
        );
      case 'email':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Input
              id={questionId}
              type="email"
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Enter email address"
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
            />
          </div>
        );
      case 'phone':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Input
              id={questionId}
              type="tel"
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Enter phone number"
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
              rows={3}
            />
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
    
    // Special validation for location selection
    if (currentSectionId === 'location_selection') {
      return answers.country && answers.state;
    }
    
    // Check if all required fields in the current section have answers
    const requiredQuestions = currentSection.questions;
    return requiredQuestions.every(questionId => !!answers[questionId]);
  };
  const generateLeaseAgreementPDF = () => {
    setIsGeneratingPDF(true);
    try {
      console.log("Generating PDF document...");
      const doc = new jsPDF();
      
      // Set font styles
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Lease Agreement", 105, 20, { align: "center" });
      
      // Reset to normal font for the body
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      
      // Starting position for content
      let y = 35;
      const lineHeight = 5;
      const pageHeight = 280;
      
      // Insert the complete template with form values
      const currentDate = format(new Date(), 'yyyy-MM-dd');
      
      const fullLeaseContent = `This Lease Agreement ("Lease") is entered into on ${currentDate}, by and between ${answers.start || '________'} ("Landlord"), and ${answers.tenant_name || '________'} ("Tenant").

Leased Property.
The Landlord hereby leases to the Tenant the located at ${answers.property_address || '________'}, ${answers.property_city || '________'}, ${answers.state && answers.country ? getStateName(answers.country, answers.state) : 'State'} ${answers.property_zip || '________'} ("Leased Property").

Term.
This Lease shall be for a fixed term, starting on ${answers.lease_start || '________'} ("Start Date") and ending on ${answers.lease_end || '________'} ("Termination Date"). The Tenant will be entitled to possession of the Leased Property beginning on the Start Date and shall maintain possession of the Leased Property until the Termination Date unless terminated through approved methods outlined in this Lease or under applicable law.

Rent.
The Tenant agrees to pay to the Landlord as rent for the use and occupancy of the Leased Property the sum of $${answers.rent_amount || '________'} due on the first day of each month ("Rent").
The Rent shall be paid by the following method(s): ${answers.payment_method || '________'}
The Rent shall be payable to the Landlord, located at ${answers.landlord_address || '________'}.
The Landlord can be reached by phone at ${answers.landlord_phone || '________'} or by email at ${answers.landlord_email || '________'}.
If any payment is returned for non-sufficient funds or because the Tenant stops payments, then, after that, the Landlord may, in writing, require the Tenant to pay future Rent payments by cash, cashier's check, or money order.

Security Deposit.
At the time of the signing of this Lease, the Tenant shall pay to the Landlord, in trust, a security deposit of $${answers.security_deposit || '________'} to be held and disbursed for the Tenant damages to the Leased Property or other defaults under this Lease (if any) as provided by law.

(2) However, the money may be applied to the payment of accrued unpaid Rent and any damages which the Landlord has suffered by reason of the Tenant's non-compliance with the Lease, all as itemized by the Landlord in a written notice delivered to the Tenant, together with the remainder of the amount due sixty (60) days after termination of the tenancy and delivery of possession by the Tenant.
(b)(1) The Landlord shall be deemed to have complied with subsection (a) of this section by mailing via first class mail the written notice and any payment required to the last known address of the Tenant.
(2) If the letter containing the payment is returned to the Landlord and if the Landlord is unable to locate the Tenant after reasonable effort, then the payment shall become the property of the Landlord one hundred eighty (180) days from the date the payment was mailed.

Default.
The Tenant will be in default of this Lease if the Tenant fails to comply with any material provisions of this Lease by which the Tenant is bound. Subject to any governing provisions of law to the contrary, if the Tenant fails to cure any financial obligation (or any other obligation) after written notice of such default is provided by the Landlord to the Tenant, the Landlord may elect to cure such default and the cost of such action will be added to the Tenant's financial obligations under this Lease. All sums of money or charges required to be paid by the Tenant under this Lease will be additional rent, whether or not such sums or charges are designated as "additional rent." The rights provided by this Paragraph are cumulative in nature and are in addition to any other rights afforded by law.

Utilities.
The Tenant agrees to pay all charges for all utilities, including electricity, internet, cable, gas, water, garbage disposal, and telephones, used in or on the Leased Property during the term of this Lease. The Tenant shall make payments for these utilities directly to the utility companies. The Tenant also agrees to comply with any environmental, waste management, recycling, energy conservation, or water conservation programs implemented by the Landlord.

Separate Gas Meter.
The Landlord does provide a separate gas meter for the Leased Property so that the Tenant's meter measures only the gas service to the Leased Property.

Separate Electric Meter.
The Landlord does provide a separate electric meter for the Leased Property so that the Tenant's meter measures only the electric service to the Leased Property.

Keys.
The Tenant will be given ${answers.house_keys || '________'} key(s) to the Leased Property and ${answers.mailbox_keys || '________'} mailbox key(s). If the Tenant misplaces a key or does not return all keys following the Termination Date, the Tenant will be charged $${answers.key_replacement_fee || '________'}. The Tenant is not permitted to change any lock or place additional locking devices on any door of the Leased Property without the Landlord's approval. If allowed, the Tenant must provide the Landlord with keys to any changed lock immediately upon installation.
If the Tenant becomes locked out of the Leased Property, the Tenant will be charged $${answers.lockout_fee || '________'} to regain entry.

Occupancy of Leased Property.
Except as stated otherwise in this Paragraph, only those individuals identified in this Lease as the "Tenant" (including their minor children) may reside in the Leased Property. The individuals identified as the "Tenant" shall sign this Lease. It is explicitly understood that this Lease is between the Landlord and each Tenant signatory individually and jointly. If any one signatory defaults, the remaining signatories are collectively responsible for timely Rent payment and all other terms of this Lease. The Tenant may have up to ${answers.max_guests || '________'} guests on the Leased Property at any one time. A "guest" shall be considered anyone who is invited by the Tenant to be present at the Leased Property, and who is also not included in the Lease. The Tenant may not have guests on the Leased Property for more than ${answers.max_guest_days || '________'} days. No other person shall be permitted to occupy the Leased Property except with the prior written approval of the Landlord.

Use of Leased Property.
No retail, commercial, or professional use of the Leased Property is allowed unless the Tenant receives prior written consent of the Landlord and such use conforms to applicable zoning laws. In such a case, the Landlord may require the Tenant to obtain liability insurance for the benefit of the Landlord. The Landlord reserves the right to refuse to consent to such use in its sole and absolute discretion.
The Tenant is required to obtain the Landlord's approval in writing before bringing pets onto the Leased Property or allowing pets to reside there.
The Tenant must ensure that no actions or activities in or around the Leased Property obstruct or interfere with the rights of neighboring occupants, causing them harm or annoyance, or utilize the Leased Property for improper, illegal, or objectionable purposes. Additionally, the Tenant must prevent or refrain from creating or allowing any nuisances on the Leased Property, or engaging in any activities that may lead to increased insurance rates, affect fire insurance coverage, or result in the cancellation of any insurance policies for the Leased Property or its content.
Use of the roof and/or the fire escapes by the Tenant and/or guests is limited to emergency use only. No other use is permitted, including but not limited to, the placement of personal property.

Assigning or Subletting.
The Tenant may not do any of the following without the Landlord's prior written consent:
(1) assign this Lease;
(2) sublet all or any part of the Leased Property;
(3) allow any person to use the Leased Property other than those uses specified in the Use of Leased Property Paragraph above.
Unless the Tenant has obtained the Landlord's prior written consent to assign or sublease, any unapproved assignment or subletting may be deemed invalid by the Landlord, and the Tenant shall continue to remain responsible for all the terms and conditions of this Lease.

Common Areas.
The Tenant shall have the non-exclusive right to use the entrances, lobbies, accessways, hallways, stairways, elevators, sidewalks, driveways, parking areas, landscaped areas, and other areas of the Leased Property that are designated for the non-exclusive common use of the Tenant and their guests ("Common Areas"). The Tenant shall use the Common Areas in accordance with any rules or notices the Landlord sets forth from time to time. The Tenant shall be responsible for...

Property Maintenance.
The Landlord shall have the responsibility to maintain the Leased Property in reasonably good repair at all times and perform all repairs reasonably necessary to satisfy any implied warranty of habitability. Except in an emergency, the Tenant is hereby informed that any property maintenance issue, repair requests, or concerns should be reported to the Landlord at ${answers.landlord_phone || '________'} or ${answers.landlord_email || '________'}. A repair request will be deemed permission for entry into the Leased Property by the Landlord or their agents to perform such maintenance or repairs. The Tenant may not place any unreasonable restrictions upon the Landlord or the Landlord's agents' access or entry. The Landlord shall have the expectation that the Leased Property is in a safe and habitable condition upon entry.
The Tenant acknowledges that the Leased Property from time to time may require renovations or repairs to keep them in good condition and repair and that such work may result in temporary loss of use of portions of the Leased Property and may inconvenience the Tenant. The Tenant agrees that any such loss shall not constitute a reduction in housing services or otherwise warrant a reduction in Rent. Further, subject to local law, the Tenant agrees, upon request of the Landlord, to temporarily vacate the Leased Property for a reasonable period, to allow for fumigation (or other methods) to control wood-destroying pests or organisms, or other repairs to the Leased Property. The Tenant agrees to comply with all instructions and requirements necessary to prepare the Leased Property to accommodate pest control, fumigation or other work, including bagging or storage of food and medicine and removal of perishables and valuables. The Tenant shall only be entitled to a credit of rent equal to the per diem rent for the period of time the Tenant is required to vacate the Leased Property.
The Tenant further agrees to cooperate in any efforts undertaken by the Landlord to rid the Leased Property of pests of any kind. Failure of the Tenant to cooperate may be deemed an obstruction of the free use of property so as to interfere with the comfortable enjoyment of life or property thereby constituting a nuisance.
The Tenant shall properly use, operate, and safeguard the Leased Property, including if applicable, any landscaping, furniture, furnishings, and appliances, and all mechanical, electrical, gas, and plumbing fixtures, and keep them and the Leased Property clean, sanitary, and well ventilated. The Tenant shall be responsible for checking and maintaining all smoke detectors. The Tenant shall immediately notify the Landlord, in writing, of any problem, malfunction, or damage. The Tenant shall be charged for all repairs or replacements caused by the Tenant, pets, or guests of the Tenant, excluding ordinary wear and tear. The Tenant shall be charged for all damage to the Leased Property as a result of failure to report a problem in a timely manner. The Tenant shall be charged for repair of drain blockages or stoppages, unless caused by defective plumbing parts or the roots invading sewer lines.

Pets.
No pets, dogs, cats, birds, fish, or other animals shall be allowed on the Leased Property, even temporarily or with a visiting guest. As required by law, service animals are the only exception to this rule. If a pet has been in the Tenant's apartment, even temporarily, the Tenant may be charged for cleaning, de-fleaing, deodorizing, or shampooing any portion of the Leased Property at the discretion of the Landlord.

Stray pets shall not be kept or fed in or about the Leased Property. They can be dangerous and the Landlord must be notified immediately of any stray pets in or about the Leased Property.

Notices.
Notices under this Lease shall not be deemed valid unless given or served in writing and forwarded by mail, postage pre-paid, addressed to the party at the appropriate address set forth below. Such addresses may be changed from time to time by either party by providing notice as set forth below. Notices mailed in accordance with these Provisions shall be deemed received on the third day after posting.

The Landlord:
${answers.landlord_address || '________'}
Phone: ${answers.landlord_phone || '________'}
Email: ${answers.landlord_email || '________'}

The Tenant:
${answers.tenant_address || '________'}
Phone: ${answers.tenant_phone || '________'}
Email: ${answers.tenant_email || '________'}

Military Termination Clause.
In the event the Tenant is, or hereafter becomes, a member of the United States Armed Forces on extended active duty and hereafter the Tenant receives permanent change of station orders to depart from the area where the Leased Property is located; is relieved from active duty, retired or separated from the military; or is ordered into military housing, the Tenant may terminate this Lease upon giving 30 days' written notice to the Landlord. The Tenant shall also provide to the Landlord a copy of the official orders or a letter signed by the Tenant's commanding officer reflecting the change that warrants termination under this clause. The Tenant will pay pro-rated Rent for any days they occupy the dwelling past the first day of the month. The security deposit will be promptly returned to the Tenant, provided there are no damages to the Leased Property.

Early Termination Clause.
The Tenant may, upon ${answers.early_termination_days || '________'} days' written notice to the Landlord, terminate this Lease provided that the Tenant pays a termination charge equal to $0.00 or the maximum allowable by law, whichever is less. Termination will be effective as of the last day of the calendar month following the end of the ${answers.early_termination_days || '________'} day notice period. The termination charge will be in addition to all Rent due up to the termination day.

Governing Law.
This Lease shall be constructed in accordance with the laws of the ${answers.country ? getCountryName(answers.country) + (answers.state ? ', State of ' + getStateName(answers.country, answers.state) : '') : 'Country and State as specified'}.

Severability.
If any portion of this Lease shall be held to be invalid or unenforceable for any reason, the remaining provisions shall continue to be valid and enforceable. If a court finds that any provision of this Lease is invalid or unenforceable, but that by limiting such provision it would become valid and enforceable, then such provision shall be deemed to be written, construed, and enforced as so limited. The failure of either party to enforce any provisions of this Lease shall not be construed as a waiver or limitation of that party's right to subsequently enforce and comply with strict compliance with every provision of this Lease.

Estoppel Certificate.
The Tenant shall execute and return a tenant estoppel certificate delivered to the Tenant by the Landlord or the Landlord's agent within 3 days after its receipt. Failure to comply with this requirement shall be deemed the Tenant's acknowledgment that the estoppel certificate is true and correct, and may be relied upon by a lender or purchaser.

Attorney's Fees.
If either party to this Lease initiates a legal action or proceeding arising from or relating to this Lease, the party that prevails in such action or proceeding shall be entitled to receive, in addition to any other remedies granted, reasonable attorney's fees, costs, and expenses incurred in the action or proceeding. This Provision also covers the recovery of expert witness fees, if applicable.

Binding on Heirs and Successors.
The Provisions of this Lease shall be binding upon and inure to the benefit of both parties and their respective legal representatives, successors, and assigns.

Time of Essence.
Time is of the essence with respect to the execution of this Lease.

Full Lease.
This Lease contains the entire agreement of the parties and there are no other promises, conditions, understandings or other agreements, whether oral or written, relating to the subject matter of this Lease. This Lease may be modified or amended in writing, if the writing is signed by the party obligated under the amendment.

Asbestos.
The Landlord is unaware of any asbestos-containing construction materials or any prior reports assessing their presence. Additionally, the Landlord has no knowledge of any potential carcinogens within the Leased Property.`;

      // Split the text to fit the page and add to document
      const splitText = doc.splitTextToSize(fullLeaseContent, 180);
      
      // Add content with proper page breaks
      for (let i = 0; i < splitText.length; i++) {
        if (y > pageHeight) {
          doc.addPage();
          y = 20;
        }
        doc.text(splitText[i], 15, y);
        y += lineHeight;
      }
      
      // Add signatures section on new page
      doc.addPage();
      y = 20;
      
      doc.setFont("helvetica", "normal");
      doc.text("The Landlord:", 15, y);
      y += lineHeight * 3;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text("(Signature)", 15, y);
      y += lineHeight;
      doc.text(`${answers.start || '________'} (Printed Name)`, 15, y);
      
      y += lineHeight * 3;
      
      doc.text("The Tenant:", 15, y);
      y += lineHeight * 3;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text("(Signature)", 15, y);
      y += lineHeight;
      doc.text(`${answers.tenant_name || '________'} (Printed Name)`, 15, y);
      
      y += lineHeight * 3;
      
      doc.text("The Tenant:", 15, y);
      y += lineHeight * 3;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text("(Signature)", 15, y);
      y += lineHeight;
      doc.text(`${answers.tenant_name || '________'} (Printed Name)`, 15, y);
      
      y += lineHeight * 3;
      doc.text("Date: _________________", 15, y);
      
      y += lineHeight * 3;
      doc.setFont("helvetica", "bold");
      doc.text("Receipt", 15, y);
      doc.setFont("helvetica", "normal");
      y += lineHeight * 2;
      doc.text(`By signing above the Landlord hereby acknowledges receipt and the Tenant acknowledges the payment of the following:`, 15, y);
      y += lineHeight;
      doc.text(`Security Deposit: $${answers.security_deposit || '________'}`, 15, y);
      
      // Add inspection checklist on new page
      doc.addPage();
      y = 20;
      
      doc.setFont("helvetica", "bold");
      doc.text("Residential Lease Inspection Checklist", 105, y, { align: "center" });
      y += lineHeight * 2;
      
      doc.setFont("helvetica", "normal");
      const splitInspectionText = doc.splitTextToSize("The Tenant has inspected the Leased Property and states that it is in satisfactory condition, free of defects, except as noted below:", 180);
      doc.text(splitInspectionText, 15, y);
      y += splitInspectionText.length * lineHeight + lineHeight;
      
      // Table headers
      doc.text("ITEM", 15, y);
      doc.text("SATISFACTORY", 80, y);
      doc.text("COMMENTS", 130, y);
      y += lineHeight;
      
      // Inspection items
      const inspectionItems = [
        "Bathrooms", "Carpeting", "Ceilings", "Closets", "Countertops",
        "Dishwasher", "Disposal", "Doors", "Fireplace", "Lights",
        "Walls", "Windows", "Window coverings"
      ];
      
      inspectionItems.forEach(item => {
        doc.text(item, 15, y);
        doc.text("________", 80, y);
        doc.text("______________________", 130, y);
        y += lineHeight;
      });
      
      // Add blank lines for additional items
      for (let i = 0; i < 2; i++) {
        doc.text("_____________", 15, y);
        doc.text("________", 80, y);
        doc.text("______________________", 130, y);
        y += lineHeight;
      }
      
      y += lineHeight * 2;
      doc.text("Date: _________________", 15, y);
      
      y += lineHeight * 3;
      doc.text("The Tenant:", 15, y);
      y += lineHeight * 3;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text("(Signature)", 15, y);
      y += lineHeight;
      doc.text("Date: ___________________", 15, y);
      y += lineHeight;
      doc.text(`${answers.tenant_name || '________'} (Printed Name)`, 15, y);
      
      // Add lead-based paint disclosure on new page
      doc.addPage();
      y = 20;
      
      doc.setFont("helvetica", "bold");
      doc.text("Disclosure of Information on Lead-Based Paint or Lead-Based Hazards", 105, y, { align: "center" });
      y += lineHeight * 2;
      
      doc.setFont("helvetica", "bold");
      doc.text("Lead Warning Statement:", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const leadWarningText = "Housing built before 1978 may contain lead-based paint. Lead from paint, paint chips, and dust can pose health hazards if not managed properly. Lead exposure is especially harmful to young children and pregnant women. Before renting pre-1978 housing, landlords must disclose the presence of known lead-based paint and/or lead-based paint hazards in the dwelling. The Tenant must also receive a federally approved pamphlet on lead poisoning prevention.";
      const splitLeadText = doc.splitTextToSize(leadWarningText, 180);
      doc.text(splitLeadText, 15, y);
      y += splitLeadText.length * lineHeight + lineHeight;
      
      doc.setFont("helvetica", "bold");
      doc.text("Landlord's Disclosure:", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      doc.text("Because the Leased Property was built after 1978, the lead-based paint disclosure is not required under applicable law.", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `lease_agreement_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Complete Lease Agreement successfully generated with all sections and disclosures!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate lease agreement");
      return null;
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Lease Agreement Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">General Information</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state && answers.country ? getStateName(answers.country, answers.state) : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Parties</h4>
              <p><strong>Landlord:</strong> {answers.start || 'Not provided'}</p>
              <p><strong>Tenant:</strong> {answers.tenant_name || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Property</h4>
              <p>{answers.property_address || 'Address not provided'}</p>
              <p>{answers.property_city || 'City not provided'}, {answers.state && answers.country ? getStateName(answers.country, answers.state) : 'State not provided'} {answers.property_zip || 'ZIP not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Term</h4>
              <p><strong>Start:</strong> {answers.lease_start || 'Not provided'}</p>
              <p><strong>End:</strong> {answers.lease_end || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Payment</h4>
              <p><strong>Monthly Rent:</strong> ${answers.rent_amount || 'Not provided'}</p>
              <p><strong>Security Deposit:</strong> ${answers.security_deposit || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Landlord Contact</h4>
              <p>{answers.landlord_phone || 'Phone not provided'}</p>
              <p>{answers.landlord_email || 'Email not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Tenant Contact</h4>
              <p>{answers.tenant_phone || 'Phone not provided'}</p>
              <p>{answers.tenant_email || 'Email not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Keys</h4>
              <p><strong>House:</strong> {answers.house_keys || 'Not specified'} | <strong>Mailbox:</strong> {answers.mailbox_keys || 'Not specified'}</p>
              <p><strong>Key Fee:</strong> ${answers.key_replacement_fee || 'Not specified'} | <strong>Lockout Fee:</strong> ${answers.lockout_fee || 'Not specified'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Early Termination</h4>
              <p><strong>Notice Required:</strong> {answers.early_termination_days || 'Not specified'} days</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Lease Agreement.
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
          <CardTitle className="text-xl text-green-600">Lease Agreement</CardTitle>
          <CardDescription>
            Review your lease agreement details below before generating the final document.
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
            onClick={generateLeaseAgreementPDF}
          >
            Generate Lease Agreement
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
        onGenerate={generateLeaseAgreementPDF}
        documentType="Lease Agreement"
        isGenerating={isGeneratingPDF}
      />
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
              onClick={() => window.open('/lease-agreement-info', '_blank')}
              className="text-bright-orange-600 border-bright-orange-600 hover:bg-bright-orange-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Learn More About Lease Agreements
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="text-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
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

export default ConditionalForm;






