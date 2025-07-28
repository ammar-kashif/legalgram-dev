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
    description: 'Select the country and state where this rent increase agreement will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'agreement_date'
  },
  'agreement_date': {
    id: 'agreement_date',
    title: 'Agreement Date',
    description: 'Enter the effective date of this rent increase agreement',
    questions: ['effective_date'],
    nextSectionId: 'landlord_info'
  },
  'landlord_info': {
    id: 'landlord_info',
    title: 'Landlord Information',
    description: 'Enter the landlord\'s contact details',
    questions: ['landlord_name', 'landlord_address', 'landlord_city_state_zip', 'landlord_email', 'landlord_phone'],
    nextSectionId: 'tenant_info'
  },
  'tenant_info': {
    id: 'tenant_info',
    title: 'Tenant Information',
    description: 'Enter the tenant\'s information',
    questions: ['tenant_name', 'premises_address'],
    nextSectionId: 'original_lease'
  },
  'original_lease': {
    id: 'original_lease',
    title: 'Original Lease Details',
    description: 'Information about the existing lease agreement',
    questions: ['original_lease_date', 'current_rent', 'current_due_day'],
    nextSectionId: 'rent_increase'
  },
  'rent_increase': {
    id: 'rent_increase',
    title: 'Rent Increase Details',
    description: 'Details about the new rent amount and terms',
    questions: ['increase_effective_date', 'new_rent_amount', 'new_due_day'],
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
    defaultNextId: 'effective_date'
  },
  'effective_date': {
    id: 'effective_date',
    type: 'date',
    text: 'Effective Date of this Rent Increase Agreement:',
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
    text: 'Landlord\'s Street Address:',
    defaultNextId: 'landlord_city_state_zip'
  },
  'landlord_city_state_zip': {
    id: 'landlord_city_state_zip',
    type: 'text',
    text: 'Landlord\'s City, State, Zip Code:',
    defaultNextId: 'landlord_email'
  },
  'landlord_email': {
    id: 'landlord_email',
    type: 'text',
    text: 'Landlord\'s Email Address (optional):',
    defaultNextId: 'landlord_phone'
  },
  'landlord_phone': {
    id: 'landlord_phone',
    type: 'text',
    text: 'Landlord\'s Phone Number:',
    defaultNextId: 'tenant_name'
  },
  'tenant_name': {
    id: 'tenant_name',
    type: 'text',
    text: 'Tenant\'s Full Legal Name(s):',
    defaultNextId: 'premises_address'
  },
  'premises_address': {
    id: 'premises_address',
    type: 'text',
    text: 'Premises Address (Street Address of the Rented Property):',
    defaultNextId: 'original_lease_date'
  },
  'original_lease_date': {
    id: 'original_lease_date',
    type: 'date',
    text: 'Original Lease Agreement Date:',
    defaultNextId: 'current_rent'
  },
  'current_rent': {
    id: 'current_rent',
    type: 'number',
    text: 'Current Monthly Rent Amount ($):',
    defaultNextId: 'current_due_day'
  },
  'current_due_day': {
    id: 'current_due_day',
    type: 'number',
    text: 'Current Rent Due Day (1-31):',
    defaultNextId: 'increase_effective_date'
  },
  'increase_effective_date': {
    id: 'increase_effective_date',
    type: 'date',
    text: 'Effective Date of Rent Increase:',
    defaultNextId: 'new_rent_amount'
  },
  'new_rent_amount': {
    id: 'new_rent_amount',
    type: 'number',
    text: 'New Monthly Rent Amount ($):',
    defaultNextId: 'new_due_day'
  },
  'new_due_day': {
    id: 'new_due_day',
    type: 'number',
    text: 'New Rent Due Day (1-31):',
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your Rent Increase Agreement based on your answers.',
  }
};

const RentIncreaseForm = () => {
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
    if (currentSectionId === 'user_info_step') {
      return (
        <UserInfoStep
          onBack={handleBack}
          onGenerate={generatePDF}
          documentType="Rent Increase Agreement"
          isGenerating={isGeneratingPDF}
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
    if (currentSectionId === 'agreement_date') {
      return answers.effective_date;
    }
    if (currentSectionId === 'landlord_info') {
      return answers.landlord_name && answers.landlord_address && answers.landlord_city_state_zip && answers.landlord_phone;
    }
    if (currentSectionId === 'tenant_info') {
      return answers.tenant_name && answers.premises_address;
    }
    if (currentSectionId === 'original_lease') {
      return answers.original_lease_date && answers.current_rent && answers.current_due_day;
    }
    if (currentSectionId === 'rent_increase') {
      return answers.increase_effective_date && answers.new_rent_amount && answers.new_due_day;
    }
    
    // Default validation
    return true;
  };

  const generateRentIncreasePDF = () => {
    try {
      console.log("Generating Rent Increase Agreement PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("RENT INCREASE AGREEMENT", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Introduction
      const effectiveDate = answers.effective_date ? format(new Date(answers.effective_date), "d") : '___';
      const effectiveMonth = answers.effective_date ? format(new Date(answers.effective_date), "MMMM") : '_______';
      const effectiveYear = answers.effective_date ? format(new Date(answers.effective_date), "yyyy") : '20__';
      
      const introText = `This Rent Increase Agreement ("Agreement") is entered into and made effective as of the ${effectiveDate} day of ${effectiveMonth}, ${effectiveYear},`;
      
      const introLines = doc.splitTextToSize(introText, 170);
      introLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      doc.setFont("helvetica", "bold");
      doc.text("By and Between:", 15, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Landlord: ${answers.landlord_name || '[Full Legal Name of Landlord]'}`, 15, y);
      y += lineHeight;
      doc.text(`Address: ${answers.landlord_address || '[Street Address]'}, ${answers.landlord_city_state_zip || '[City, State, Zip Code]'}`, 15, y);
      y += lineHeight;
      if (answers.landlord_email) {
        doc.text(`Email: ${answers.landlord_email}`, 15, y);
        y += lineHeight;
      } else {
        doc.text("Email: [Email Address] (if applicable)", 15, y);
        y += lineHeight;
      }
      doc.text(`Phone: ${answers.landlord_phone || '[Phone Number]'}`, 15, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "bold");
      doc.text("AND", 15, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Tenant: ${answers.tenant_name || '[Full Legal Name of Tenant(s)]'}`, 15, y);
      y += lineHeight;
      doc.text(`Premises Address: ${answers.premises_address || '[Street Address of the Rented Premises]'}`, 15, y);
      y += lineHeight + 5;
      
      doc.text('Collectively referred to as the "Parties."', 15, y);
      y += lineHeight + 10;
      
      // RECITALS
      doc.setFont("helvetica", "bold");
      doc.text("RECITALS", 15, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "normal");
      
      // WHEREAS clause 1
      const originalLeaseDate = answers.original_lease_date ? format(new Date(answers.original_lease_date), "MMMM d, yyyy") : '__________';
      const recital1 = `WHEREAS, the Parties entered into a Lease Agreement dated ${originalLeaseDate} (the "Lease") regarding the rental of the premises located at ${answers.premises_address || '[Full Premises Address]'} (the "Premises");`;
      
      const recital1Lines = doc.splitTextToSize(recital1, 170);
      recital1Lines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // WHEREAS clause 2
      const currentRent = answers.current_rent || '[Current Rent Amount]';
      const currentDueDay = answers.current_due_day || '___';
      const recital2 = `WHEREAS, pursuant to the Lease, the Tenant is currently paying a monthly rent of $${currentRent}, payable on or before the ${currentDueDay} day of each month;`;
      
      const recital2Lines = doc.splitTextToSize(recital2, 170);
      recital2Lines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // WHEREAS clause 3
      const recital3 = "WHEREAS, the Landlord now wishes to increase the rent, and the Tenant agrees to such increase, under the terms set forth herein;";
      
      const recital3Lines = doc.splitTextToSize(recital3, 170);
      recital3Lines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 5;
      
      // NOW THEREFORE
      const nowTherefore = "NOW, THEREFORE, in consideration of the mutual covenants contained herein, the Parties agree as follows:";
      
      const nowThereforeLines = doc.splitTextToSize(nowTherefore, 170);
      nowThereforeLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 10;
      
      // Section 1: RENT INCREASE
      doc.setFont("helvetica", "bold");
      doc.text("1. RENT INCREASE", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const increaseEffectiveDate = answers.increase_effective_date ? format(new Date(answers.increase_effective_date), "MMMM d, yyyy") : '[Effective Date]';
      const newRentAmount = answers.new_rent_amount || '[New Rent Amount]';
      const section1Text = `Effective as of ${increaseEffectiveDate}, the monthly rent due from the Tenant to the Landlord shall be increased to $${newRentAmount} per month.`;
      
      const section1Lines = doc.splitTextToSize(section1Text, 170);
      section1Lines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 10;
      
      // Section 2: PAYMENT TERMS
      doc.setFont("helvetica", "bold");
      doc.text("2. PAYMENT TERMS", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const newDueDay = answers.new_due_day || '___';
      const section2Text = `The increased rent amount shall be payable in advance on or before the ${newDueDay} day of each calendar month, in accordance with the terms of the original Lease.`;
      
      const section2Lines = doc.splitTextToSize(section2Text, 170);
      section2Lines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 10;
      
      // Section 3: NO OTHER MODIFICATIONS
      doc.setFont("helvetica", "bold");
      doc.text("3. NO OTHER MODIFICATIONS", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const section3Text = "Except as expressly amended herein, all other terms, covenants, and conditions of the original Lease shall remain in full force and effect and are hereby ratified and confirmed by the Parties.";
      
      const section3Lines = doc.splitTextToSize(section3Text, 170);
      section3Lines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 10;
      
      // Section 4: BINDING EFFECT
      doc.setFont("helvetica", "bold");
      doc.text("4. BINDING EFFECT", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const section4Text = "This Agreement shall be binding upon and inure to the benefit of the Parties hereto and their respective heirs, legal representatives, successors, and permitted assigns.";
      
      const section4Lines = doc.splitTextToSize(section4Text, 170);
      section4Lines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 10;
      
      // Section 5: ENTIRE AGREEMENT
      doc.setFont("helvetica", "bold");
      doc.text("5. ENTIRE AGREEMENT", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const section5Text = "This Agreement constitutes the entire understanding between the Parties with respect to the subject matter hereof and supersedes any prior negotiations, discussions, or agreements relating to the subject matter herein.";
      
      const section5Lines = doc.splitTextToSize(section5Text, 170);
      section5Lines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 10;
      
      // Section 6: GOVERNING LAW
      doc.setFont("helvetica", "bold");
      doc.text("6. GOVERNING LAW", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const governingState = answers.state ? getStateName(answers.country || '', answers.state) : '[Insert State]';
      const section6Text = `This Agreement shall be governed by and construed in accordance with the laws of the State of ${governingState}.`;
      
      const section6Lines = doc.splitTextToSize(section6Text, 170);
      section6Lines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 15;
      
      // Signatures
      if (y > pageHeight - 120) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFont("helvetica", "bold");
      doc.text("IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first above written.", 15, y);
      y += lineHeight + 15;
      
      doc.text("LANDLORD:", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      doc.text("Signature: ___________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Name: ______________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Date: _______________________________", 15, y);
      y += lineHeight + 15;
      
      doc.setFont("helvetica", "bold");
      doc.text("TENANT(S):", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      doc.text("Signature: ___________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Name: ______________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Date: _______________________________", 15, y);
      y += lineHeight + 10;
      
      doc.text("Signature: ___________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Name: ______________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Date: _______________________________", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `rent_increase_agreement_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Rent Increase Agreement successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Rent Increase Agreement");
      return null;
    }
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let y = 20;

      // Helper function to add text with word wrapping
      const addText = (text: string, fontSize = 11, isBold = false) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, margin, y);
        y += (lines.length * fontSize * 0.4) + 3;
      };

      const addSpace = (space = 5) => {
        y += space;
      };

      // Title
      addText("RENT INCREASE AGREEMENT", 16, true);
      addSpace();

      // Agreement date
      if (answers.effective_date) {
        const formattedDate = format(new Date(answers.effective_date), 'MMMM d, yyyy');
        addText(`This Rent Increase Agreement is entered into on ${formattedDate}.`);
      }
      addSpace();

      // Parties
      addText("PARTIES", 12, true);
      addText(`Landlord: ${answers.landlord_name || '[LANDLORD NAME]'}`);
      addText(`Address: ${answers.landlord_address || '[LANDLORD ADDRESS]'}, ${answers.landlord_city_state_zip || '[CITY, STATE ZIP]'}`);
      if (answers.landlord_email) {
        addText(`Email: ${answers.landlord_email}`);
      }
      if (answers.landlord_phone) {
        addText(`Phone: ${answers.landlord_phone}`);
      }
      addSpace();

      addText(`Tenant: ${answers.tenant_name || '[TENANT NAME]'}`);
      addText(`Premises: ${answers.premises_address || '[PREMISES ADDRESS]'}`);
      addSpace();

      // Original lease information
      addText("ORIGINAL LEASE INFORMATION", 12, true);
      if (answers.original_lease_date) {
        const originalDate = format(new Date(answers.original_lease_date), 'MMMM d, yyyy');
        addText(`Original Lease Date: ${originalDate}`);
      }
      addText(`Current Monthly Rent: $${answers.current_rent || '[CURRENT RENT]'}`);
      addText(`Current Due Day: ${answers.current_due_day || '[DUE DAY]'} of each month`);
      addSpace();

      // Rent increase details
      addText("RENT INCREASE DETAILS", 12, true);
      if (answers.increase_effective_date) {
        const increaseDate = format(new Date(answers.increase_effective_date), 'MMMM d, yyyy');
        addText(`Effective Date of Increase: ${increaseDate}`);
      }
      addText(`New Monthly Rent: $${answers.new_rent_amount || '[NEW RENT AMOUNT]'}`);
      addText(`New Due Day: ${answers.new_due_day || '[NEW DUE DAY]'} of each month`);
      addSpace();

      // Terms
      addText("TERMS AND CONDITIONS", 12, true);
      addText("1. This agreement serves as an amendment to the original lease agreement.");
      addText("2. All other terms and conditions of the original lease remain in full force and effect.");
      addText("3. This rent increase shall take effect on the date specified above.");
      addText("4. The tenant acknowledges receipt of this notice and agrees to the new rental amount.");
      addSpace();

      // Signatures
      addText("SIGNATURES", 12, true);
      addText("Landlord: _______________________ Date: _______");
      addSpace(10);
      addText("Tenant: _______________________ Date: _______");

      doc.save('rent-increase-agreement.pdf');
      toast.success("Rent Increase Agreement PDF generated successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate document");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-2 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Rent Increase Agreement Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Agreement Information</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state ? getStateName(answers.country || '', answers.state) : 'Not provided'}</p>
              <p><strong>Effective Date:</strong> {answers.effective_date ? format(new Date(answers.effective_date), 'PPP') : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Landlord Information</h4>
              <p><strong>Name:</strong> {answers.landlord_name || 'Not provided'}</p>
              <p><strong>Address:</strong> {answers.landlord_address || 'Not provided'}</p>
              <p><strong>City, State, Zip:</strong> {answers.landlord_city_state_zip || 'Not provided'}</p>
              <p><strong>Email:</strong> {answers.landlord_email || 'Not provided'}</p>
              <p><strong>Phone:</strong> {answers.landlord_phone || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Tenant Information</h4>
              <p><strong>Name:</strong> {answers.tenant_name || 'Not provided'}</p>
              <p><strong>Premises:</strong> {answers.premises_address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Rent Details</h4>
              <p><strong>Original Lease Date:</strong> {answers.original_lease_date ? format(new Date(answers.original_lease_date), 'PPP') : 'Not provided'}</p>
              <p><strong>Current Rent:</strong> ${answers.current_rent || 'Not provided'}</p>
              <p><strong>New Rent:</strong> ${answers.new_rent_amount || 'Not provided'}</p>
              <p><strong>Increase Effective:</strong> {answers.increase_effective_date ? format(new Date(answers.increase_effective_date), 'PPP') : 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Rent Increase Agreement.
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
            <CardTitle className="text-xl text-green-600">Rent Increase Agreement</CardTitle>
            <CardDescription>
              Review your Rent Increase Agreement details below before generating the final document.
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
              onClick={generateRentIncreasePDF}
            >
              Generate Rent Increase Agreement
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
                  onClick={() => navigate('/rent-increase-info')}
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Learn More About Rent Increase Agreement
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
                  Next <ArrowRight className="w-4 h-4 ml-2" />
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

export default RentIncreaseForm;
