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
    description: 'Select the country and state where this lease renewal agreement will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'agreement_details'
  },
  'agreement_details': {
    id: 'agreement_details',
    title: 'Agreement Details',
    description: 'Enter the basic information about the lease renewal agreement',
    questions: ['effective_date', 'original_lease_date', 'expiration_date'],
    nextSectionId: 'landlord_info'
  },
  'landlord_info': {
    id: 'landlord_info',
    title: 'Landlord Information',
    description: 'Enter the landlord details',
    questions: ['landlord_name', 'landlord_address'],
    nextSectionId: 'tenant_info'
  },
  'tenant_info': {
    id: 'tenant_info',
    title: 'Tenant Information',
    description: 'Enter the tenant details',
    questions: ['tenant_name'],
    nextSectionId: 'property_info'
  },
  'property_info': {
    id: 'property_info',
    title: 'Property Information',
    description: 'Enter details about the leased property',
    questions: ['property_address', 'property_city', 'property_zip'],
    nextSectionId: 'renewal_terms'
  },
  'renewal_terms': {
    id: 'renewal_terms',
    title: 'Renewal Terms',
    description: 'Specify the renewal terms and conditions',
    questions: ['renewal_months', 'start_date', 'end_date', 'monthly_rent', 'due_day'],
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
    text: 'Effective Date of Renewal Agreement:',
    defaultNextId: 'original_lease_date'
  },
  'original_lease_date': {
    id: 'original_lease_date',
    type: 'date',
    text: 'Original Lease Date:',
    defaultNextId: 'expiration_date'
  },
  'expiration_date': {
    id: 'expiration_date',
    type: 'date',
    text: 'Original Lease Expiration Date:',
    defaultNextId: 'landlord_name'
  },
  'landlord_name': {
    id: 'landlord_name',
    type: 'text',
    text: 'Landlord\'s Full Name:',
    defaultNextId: 'landlord_address'
  },
  'landlord_address': {
    id: 'landlord_address',
    type: 'text',
    text: 'Landlord\'s Address:',
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
    text: 'Property Street Address:',
    defaultNextId: 'property_city'
  },
  'property_city': {
    id: 'property_city',
    type: 'text',
    text: 'Property City:',
    defaultNextId: 'property_zip'
  },
  'property_zip': {
    id: 'property_zip',
    type: 'text',
    text: 'Property ZIP Code:',
    defaultNextId: 'renewal_months'
  },
  'renewal_months': {
    id: 'renewal_months',
    type: 'number',
    text: 'Renewal Term (number of months):',
    defaultNextId: 'start_date'
  },
  'start_date': {
    id: 'start_date',
    type: 'date',
    text: 'Renewal Start Date:',
    defaultNextId: 'end_date'
  },
  'end_date': {
    id: 'end_date',
    type: 'date',
    text: 'Renewal End Date:',
    defaultNextId: 'monthly_rent'
  },
  'monthly_rent': {
    id: 'monthly_rent',
    type: 'number',
    text: 'Monthly Rent Amount ($):',
    defaultNextId: 'due_day'
  },
  'due_day': {
    id: 'due_day',
    type: 'number',
    text: 'Day of month rent is due (1-31):',
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your Lease Renewal Agreement based on your answers.',
  }
};

const LeaseRenewalForm = () => {
  const navigate = useNavigate();
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [datePickerStates, setDatePickerStates] = useState<Record<string, boolean>>({});
  
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
    if (currentSectionId === 'agreement_details') {
      return answers.effective_date && answers.original_lease_date && answers.expiration_date;
    }
    if (currentSectionId === 'landlord_info') {
      return answers.landlord_name && answers.landlord_address;
    }
    if (currentSectionId === 'tenant_info') {
      return answers.tenant_name;
    }
    if (currentSectionId === 'property_info') {
      return answers.property_address && answers.property_city && answers.property_zip;
    }
    if (currentSectionId === 'renewal_terms') {
      return answers.renewal_months && answers.start_date && answers.end_date && answers.monthly_rent && answers.due_day;
    }
    
    // Default validation
    return true;
  };

  const generateLeaseRenewalPDF = () => {
    try {
      console.log("Generating Lease Renewal Agreement PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("LEASE RENEWAL AGREEMENT", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Introduction
      const effectiveDate = answers.effective_date ? format(new Date(answers.effective_date), "MMMM d, yyyy") : '________________';
      const introText = `This Lease Renewal Agreement ("Renewal Agreement") is made and entered into as of ${effectiveDate} (the "Effective Date") by and between`;
      
      const introLines = doc.splitTextToSize(introText, 170);
      introLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Landlord info
      doc.text(`${answers.landlord_name || '________________________'}, residing at ${answers.landlord_address || '________________________'} ("Landlord"),`, 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "bold");
      doc.text("And", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      doc.text(`${answers.tenant_name || '________________________'} ("Tenant").`, 15, y);
      y += lineHeight + 10;
      
      // Section 1: Leased Property
      doc.setFont("helvetica", "bold");
      doc.text("1. Leased Property", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const selectedCountry = getCountryName(answers.country || '');
      const selectedState = getStateName(answers.country || '', answers.state || '');
      const propertyText = `The Landlord hereby leases to the Tenant the residential property located at ${answers.property_address || '________________________'}, ${answers.property_city || '__________'}, ${selectedState}, ${answers.property_zip || '__________'} (the "Premises").`;
      
      const propertyLines = doc.splitTextToSize(propertyText, 170);
      propertyLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 5;
      
      // Section 2: Original Lease
      doc.setFont("helvetica", "bold");
      doc.text("2. Original Lease", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const originalLeaseDate = answers.original_lease_date ? format(new Date(answers.original_lease_date), "MMMM d, yyyy") : '________________';
      const expirationDate = answers.expiration_date ? format(new Date(answers.expiration_date), "MMMM d, yyyy") : '________________';
      const originalLeaseText = `The parties previously entered into a lease agreement dated ${originalLeaseDate} for the Premises (the "Original Lease"), which is set to expire on ${expirationDate}. A copy of the Original Lease is attached hereto as Exhibit A and incorporated by reference.`;
      
      const originalLeaseLines = doc.splitTextToSize(originalLeaseText, 170);
      originalLeaseLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 5;
      
      // Section 3: Renewal and Modification
      doc.setFont("helvetica", "bold");
      doc.text("3. Renewal and Modification", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      doc.text("The parties now wish to extend the term of the Original Lease and agree to amend it as follows:", 15, y);
      y += lineHeight + 5;
      
      // a. Renewal Term
      doc.setFont("helvetica", "bold");
      doc.text("a. Renewal Term", 20, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const startDate = answers.start_date ? format(new Date(answers.start_date), "MMMM d, yyyy") : '________________';
      const endDate = answers.end_date ? format(new Date(answers.end_date), "MMMM d, yyyy") : '________________';
      const renewalTermText = `The lease is hereby extended for an additional period of ${answers.renewal_months || '____'} months (the "Renewal Term"), beginning on ${startDate} and ending on ${endDate}.`;
      
      const renewalTermLines = doc.splitTextToSize(renewalTermText, 165);
      renewalTermLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += lineHeight;
      });
      y += lineHeight + 5;
      
      // b. Rent
      doc.setFont("helvetica", "bold");
      doc.text("b. Rent", 20, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const rentText = `The monthly rent during the Renewal Term shall be $${answers.monthly_rent || '________'}, payable in advance on or before the ${answers.due_day || '__'} day of each calendar month.`;
      
      const rentLines = doc.splitTextToSize(rentText, 165);
      rentLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += lineHeight;
      });
      y += lineHeight + 10;
      
      // Section 4: Continued Effect of Original Lease
      doc.setFont("helvetica", "bold");
      doc.text("4. Continued Effect of Original Lease", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const continuedEffectText = "Except as expressly modified by this Renewal Agreement, all other terms, covenants, and conditions of the Original Lease shall remain unchanged and in full force and effect during the Renewal Term.";
      
      const continuedEffectLines = doc.splitTextToSize(continuedEffectText, 170);
      continuedEffectLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 10;
      
      // Section 5: Entire Agreement
      doc.setFont("helvetica", "bold");
      doc.text("5. Entire Agreement", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const entireAgreementText = "This Renewal Agreement, together with the Original Lease, constitutes the entire understanding between the parties with respect to the Premises and supersedes all prior agreements or understandings, whether oral or written, relating to the subject matter hereof.";
      
      const entireAgreementLines = doc.splitTextToSize(entireAgreementText, 170);
      entireAgreementLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 10;
      
      // Section 6: Execution
      doc.setFont("helvetica", "bold");
      doc.text("6. Execution", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const executionText = "This Renewal Agreement may be executed in counterparts and shall be effective as of the Effective Date upon execution by both parties.";
      
      const executionLines = doc.splitTextToSize(executionText, 170);
      executionLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 15;
      
      // Check if we need a new page for signatures
      if (y > pageHeight - 100) {
        doc.addPage();
        y = 20;
      }
      
      // Signatures
      doc.setFont("helvetica", "bold");
      doc.text("IN WITNESS WHEREOF, the parties have executed this Lease Renewal Agreement as of the date set forth below.", 15, y);
      y += lineHeight + 15;
      
      doc.setFont("helvetica", "bold");
      doc.text("LANDLORD:", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      doc.text("Signature: ___________________________", 15, y);
      y += lineHeight + 5;
      doc.text(`Name: ${answers.landlord_name || '______________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text("Date: _______________________________", 15, y);
      y += lineHeight + 15;
      
      doc.setFont("helvetica", "bold");
      doc.text("TENANT:", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      doc.text("Signature: ___________________________", 15, y);
      y += lineHeight + 5;
      doc.text(`Name: ${answers.tenant_name || '______________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text("Date: _______________________________", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `lease_renewal_agreement_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Lease Renewal Agreement successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Lease Renewal Agreement");
      return null;
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-2 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Lease Renewal Agreement Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Location</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state ? getStateName(answers.country || '', answers.state) : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Agreement Details</h4>
              <p><strong>Effective Date:</strong> {answers.effective_date ? format(new Date(answers.effective_date), 'PPP') : 'Not provided'}</p>
              <p><strong>Original Lease Date:</strong> {answers.original_lease_date ? format(new Date(answers.original_lease_date), 'PPP') : 'Not provided'}</p>
              <p><strong>Expiration Date:</strong> {answers.expiration_date ? format(new Date(answers.expiration_date), 'PPP') : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Landlord Information</h4>
              <p><strong>Name:</strong> {answers.landlord_name || 'Not provided'}</p>
              <p><strong>Address:</strong> {answers.landlord_address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Tenant Information</h4>
              <p><strong>Name:</strong> {answers.tenant_name || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Property Information</h4>
              <p><strong>Address:</strong> {answers.property_address || 'Not provided'}</p>
              <p><strong>City:</strong> {answers.property_city || 'Not provided'}</p>
              <p><strong>ZIP:</strong> {answers.property_zip || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Renewal Terms</h4>
              <p><strong>Renewal Period:</strong> {answers.renewal_months || 'Not provided'} months</p>
              <p><strong>Start Date:</strong> {answers.start_date ? format(new Date(answers.start_date), 'PPP') : 'Not provided'}</p>
              <p><strong>End Date:</strong> {answers.end_date ? format(new Date(answers.end_date), 'PPP') : 'Not provided'}</p>
              <p><strong>Monthly Rent:</strong> ${answers.monthly_rent || 'Not provided'}</p>
              <p><strong>Due Day:</strong> {answers.due_day || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Lease Renewal Agreement.
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
            <CardTitle className="text-xl text-green-600">Lease Renewal Agreement</CardTitle>
            <CardDescription>
              Review your Lease Renewal Agreement details below before generating the final document.
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
              onClick={generateLeaseRenewalPDF}
            >
              Generate Lease Renewal Agreement
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
                  onClick={() => navigate('/lease-renewal-info')}
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Learn More About Lease Renewal Agreement
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

export default LeaseRenewalForm;
