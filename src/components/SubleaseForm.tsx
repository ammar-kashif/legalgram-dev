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
import { Checkbox } from "@/components/ui/checkbox";
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
  type: 'text' | 'select' | 'textarea' | 'confirmation' | 'date' | 'number' | 'inspection';
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

// Inspection checklist items
const inspectionItems = [
  'Bathrooms', 'Carpeting', 'Ceilings', 'Closets', 'Countertops', 'Dishwasher',
  'Disposal', 'Doors', 'Fireplace', 'Lights', 'Locks', 'Refrigerator',
  'Screens', 'Stove', 'Walls', 'Windows', 'Window Coverings'
];

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'location_selection': {
    id: 'location_selection',
    title: 'Location Selection',
    description: 'Select the country and state where this sublease agreement will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'agreement_date'
  },
  'agreement_date': {
    id: 'agreement_date',
    title: 'Agreement Date',
    description: 'Enter the effective date of this sublease agreement',
    questions: ['effective_date'],
    nextSectionId: 'tenant_info'
  },
  'tenant_info': {
    id: 'tenant_info',
    title: 'Original Tenant Information',
    description: 'Information about the original tenant (sublessor)',
    questions: ['tenant_name', 'tenant_address'],
    nextSectionId: 'subtenant_info'
  },
  'subtenant_info': {
    id: 'subtenant_info',
    title: 'Subtenant Information',
    description: 'Information about the new subtenant (sublessee)',
    questions: ['subtenant_name', 'subtenant_address'],
    nextSectionId: 'original_lease'
  },
  'original_lease': {
    id: 'original_lease',
    title: 'Original Lease Details',
    description: 'Information about the prime lease agreement',
    questions: ['original_lease_date', 'landlord_name', 'landlord_address'],
    nextSectionId: 'premises_term'
  },
  'premises_term': {
    id: 'premises_term',
    title: 'Premises & Term',
    description: 'Property address and sublease term dates',
    questions: ['premises_address', 'start_date', 'end_date'],
    nextSectionId: 'payment_details'
  },
  'payment_details': {
    id: 'payment_details',
    title: 'Payment Details',
    description: 'Rent amount and payment terms',
    questions: ['monthly_rent', 'due_day', 'tenant_payment_address', 'total_amount', 'security_deposit'],
    nextSectionId: 'inspection_checklist'
  },
  'inspection_checklist': {
    id: 'inspection_checklist',
    title: 'Property Inspection',
    description: 'Residential sublease inspection checklist',
    questions: ['inspection'],
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
    text: 'Effective Date of this Sublease Agreement:',
    defaultNextId: 'tenant_name'
  },
  'tenant_name': {
    id: 'tenant_name',
    type: 'text',
    text: 'Original Tenant\'s Full Name (Sublessor):',
    defaultNextId: 'tenant_address'
  },
  'tenant_address': {
    id: 'tenant_address',
    type: 'textarea',
    text: 'Original Tenant\'s Address for Notices:',
    defaultNextId: 'subtenant_name'
  },
  'subtenant_name': {
    id: 'subtenant_name',
    type: 'text',
    text: 'Subtenant\'s Full Name (Sublessee):',
    defaultNextId: 'subtenant_address'
  },
  'subtenant_address': {
    id: 'subtenant_address',
    type: 'textarea',
    text: 'Subtenant\'s Address for Notices:',
    defaultNextId: 'original_lease_date'
  },
  'original_lease_date': {
    id: 'original_lease_date',
    type: 'date',
    text: 'Original Lease Agreement Date:',
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
    type: 'textarea',
    text: 'Landlord\'s Address for Notices:',
    defaultNextId: 'premises_address'
  },
  'premises_address': {
    id: 'premises_address',
    type: 'text',
    text: 'Premises Address (Street Address, City, State, Zip Code):',
    defaultNextId: 'start_date'
  },
  'start_date': {
    id: 'start_date',
    type: 'date',
    text: 'Sublease Start Date:',
    defaultNextId: 'end_date'
  },
  'end_date': {
    id: 'end_date',
    type: 'date',
    text: 'Sublease End Date:',
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
    defaultNextId: 'tenant_payment_address'
  },
  'tenant_payment_address': {
    id: 'tenant_payment_address',
    type: 'textarea',
    text: 'Address where rent payments should be sent to Tenant:',
    defaultNextId: 'total_amount'
  },
  'total_amount': {
    id: 'total_amount',
    type: 'number',
    text: 'Total Sublease Consideration ($):',
    defaultNextId: 'security_deposit'
  },
  'security_deposit': {
    id: 'security_deposit',
    type: 'number',
    text: 'Security Deposit Amount ($):',
    defaultNextId: 'inspection'
  },
  'inspection': {
    id: 'inspection',
    type: 'inspection',
    text: 'Property Inspection Checklist - Please review each item and note any issues:',
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your Sublease Agreement based on your answers.',
  }
};

const SubleaseForm = () => {
  const navigate = useNavigate();
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [datePickerStates, setDatePickerStates] = useState<Record<string, boolean>>({});
  const [inspectionData, setInspectionData] = useState<Record<string, { satisfactory: boolean; comments: string }>>({});
  
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

  const handleInspectionChange = (item: string, field: 'satisfactory' | 'comments', value: boolean | string) => {
    setInspectionData(prev => ({
      ...prev,
      [item]: {
        ...prev[item],
        [field]: value
      }
    }));
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
      case 'inspection':
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-3">
              {question.text}
            </Label>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              {inspectionItems.map((item) => (
                <div key={item} className="flex items-start space-x-4 p-3 bg-white rounded border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-medium text-black min-w-[120px]">{item}:</span>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${item}-yes`}
                          checked={inspectionData[item]?.satisfactory === true}
                          onCheckedChange={(checked) => 
                            handleInspectionChange(item, 'satisfactory', checked as boolean)
                          }
                        />
                        <Label htmlFor={`${item}-yes`} className="text-sm">
                          Satisfactory
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${item}-no`}
                          checked={inspectionData[item]?.satisfactory === false}
                          onCheckedChange={(checked) => 
                            handleInspectionChange(item, 'satisfactory', !checked as boolean)
                          }
                        />
                        <Label htmlFor={`${item}-no`} className="text-sm">
                          Needs Attention
                        </Label>
                      </div>
                    </div>
                    <Input
                      placeholder="Comments (optional)"
                      value={inspectionData[item]?.comments || ''}
                      onChange={(e) => handleInspectionChange(item, 'comments', e.target.value)}
                      className="text-black bg-white text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
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
          onGenerate={generateSubleasePDF}
          isGenerating={isGeneratingPDF}
          documentType="Sublease Agreement"
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
    if (currentSectionId === 'tenant_info') {
      return answers.tenant_name && answers.tenant_address;
    }
    if (currentSectionId === 'subtenant_info') {
      return answers.subtenant_name && answers.subtenant_address;
    }
    if (currentSectionId === 'original_lease') {
      return answers.original_lease_date && answers.landlord_name && answers.landlord_address;
    }
    if (currentSectionId === 'premises_term') {
      return answers.premises_address && answers.start_date && answers.end_date;
    }
    if (currentSectionId === 'payment_details') {
      return answers.monthly_rent && answers.due_day && answers.tenant_payment_address && answers.total_amount && answers.security_deposit;
    }
    if (currentSectionId === 'inspection_checklist') {
      // At least some inspection items should be checked
      return Object.keys(inspectionData).length > 0;
    }
    
    // Default validation
    return true;
  };

  const generateSubleasePDF = async (userInfo?: { name: string; email: string; phone: string }) => {
    setIsGeneratingPDF(true);
    try {
      console.log("Generating Sublease Agreement PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("SUBLEASE AGREEMENT", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Introduction
      const effectiveDate = answers.effective_date ? format(new Date(answers.effective_date), "MMMM d, yyyy") : '[Insert Date]';
      
      const introText = `This Sublease Agreement ("Agreement") is entered into and made effective as of ${effectiveDate}, by and between`;
      
      const introLines = doc.splitTextToSize(introText, 170);
      introLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      doc.text(`${answers.tenant_name || '[Insert Name]'} ("Tenant")`, 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "bold");
      doc.text("And", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      doc.text(`${answers.subtenant_name || '[Insert Name]'} ("Subtenant").`, 15, y);
      y += lineHeight + 10;
      
      // WHEREAS clauses
      doc.setFont("helvetica", "bold");
      doc.text("WHEREAS", 15, y);
      doc.setFont("helvetica", "normal");
      
      const originalLeaseDate = answers.original_lease_date ? format(new Date(answers.original_lease_date), "MMMM d, yyyy") : '[Insert Date]';
      const whereas1 = `, Tenant is the current lessee under a lease agreement dated ${originalLeaseDate}, entered into with ${answers.landlord_name || '[Insert Landlord Name]'} ("Landlord"), a copy of which is attached hereto as Exhibit A and made a part of this Agreement (the "Prime Lease");`;
      
      const whereas1Lines = doc.splitTextToSize(whereas1, 155);
      doc.text("WHEREAS", 15, y);
      whereas1Lines.forEach((line: string, index: number) => {
        if (index === 0) {
          doc.text(line, 40, y);
        } else {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 15, y);
        }
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      const whereas2 = "WHEREAS, Tenant desires to sublet the leased premises to the Subtenant, and Subtenant desires to lease the premises from the Tenant under the terms and conditions set forth herein;";
      
      const whereas2Lines = doc.splitTextToSize(whereas2, 170);
      whereas2Lines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 5;
      
      // NOW THEREFORE
      const nowTherefore = "NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:";
      
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
      
      // Helper function to add sections
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
      
      // Section 1: Premises
      addSection("1. Premises", `Tenant hereby sublets to Subtenant, and Subtenant hereby takes from Tenant, the premises located at ${answers.premises_address || '[Street Address, City, State, Zip Code]'} (the "Premises"), subject to the terms and conditions of this Agreement.`);
      
      // Section 2: Term and Possession
      const startDate = answers.start_date ? format(new Date(answers.start_date), "MMMM d, yyyy") : '[Start Date]';
      const endDate = answers.end_date ? format(new Date(answers.end_date), "MMMM d, yyyy") : '[End Date]';
      
      addSection("2. Term and Possession", `The term of this Agreement shall commence on ${startDate} and, unless earlier terminated pursuant to the provisions of this Agreement, shall continue until ${endDate}, or the termination date of the Prime Lease, whichever occurs first.\n\nShould Subtenant wish to extend the tenancy beyond the stated term, such extension shall be subject to the prior written consent of both the Landlord and Tenant and must be set forth in a separate written agreement.\n\nSubtenant shall not be held responsible for securing a replacement tenant upon termination of this Agreement.`);
      
      // Section 3: Sublease Payments
      const monthlyRent = answers.monthly_rent || '[Amount]';
      const dueDay = answers.due_day || '[Due Day]';
      const totalAmount = answers.total_amount || '[Total Amount]';
      
      addSection("3. Sublease Payments", `Subtenant shall pay to Tenant rent in the amount of $${monthlyRent} per month, due in advance on the ${dueDay} day of each calendar month. All rent payments shall be made to Tenant at ${answers.tenant_payment_address || '[Tenant Address]'}, or at another address designated in writing by the Tenant.\n\nThe total sublease consideration over the term of this Agreement shall be $${totalAmount}.`);
      
      // Section 4: Security Deposit
      const securityDeposit = answers.security_deposit || '[Amount]';
      addSection("4. Security Deposit", `Upon execution of this Agreement, Subtenant shall pay to Landlord, in trust, a security deposit of $${securityDeposit}, to be held in accordance with applicable law and to be applied toward any damages to the Premises or other defaults by the Subtenant.`);
      
      // Section 5: Notices
      addSection("5. Notices", `All notices required or permitted under this Agreement shall be in writing and shall be delivered personally or sent by certified mail, postage prepaid, to the addresses provided below or such other address as either party may provide in writing:\n\nTenant:\n${answers.tenant_name || '[Name]'}\n${answers.tenant_address || '[Address]'}\n\nSubtenant:\n${answers.subtenant_name || '[Name]'}\n${answers.subtenant_address || '[Address]'}\n\nLandlord:\n${answers.landlord_name || '[Name]'}\n${answers.landlord_address || '[Address]'}\n\nNotices shall be deemed received three (3) days after mailing.`);
      
      // Remaining sections
      const governingState = answers.state ? getStateName(answers.country || '', answers.state) : '[Insert State]';
      addSection("6. Governing Law", `This Agreement shall be governed by and construed in accordance with the laws of the State of ${governingState}.`);
      
      addSection("7. Binding Effect", "This Agreement shall be binding upon and inure to the benefit of the parties hereto and their respective heirs, legal representatives, successors, and assigns.");
      
      addSection("8. Time of Essence", "Time is of the essence with respect to each provision of this Agreement.");
      
      addSection("9. Severability", "If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. Any invalid or unenforceable provision shall be modified to the minimum extent necessary to render it valid and enforceable.");
      
      addSection("10. Estoppel Certificate", "Subtenant shall, upon request of the Landlord or Landlord's agent, execute and return an estoppel certificate within three (3) business days. Failure to comply shall be deemed acknowledgment that the certificate is true and correct and may be relied upon by prospective purchasers or lenders.");
      
      addSection("11. Entire Agreement", "This Agreement constitutes the entire understanding between the parties and supersedes all prior oral or written agreements. No modifications or amendments shall be effective unless made in writing and signed by all parties.");
      
      addSection("12. Dispute Resolution", "The parties agree to attempt in good faith to resolve any dispute arising under this Agreement through informal negotiations. If such negotiations fail, the matter shall be submitted to mediation in accordance with applicable mediation statutes. If mediation does not resolve the dispute, the parties may pursue all rights and remedies available under law.");
      
      addSection("13. Landlord's Consent", "Pursuant to the Prime Lease, Landlord's prior written consent is required for this sublease. Such consent has been obtained and is attached hereto as Exhibit B. Without this consent, this Agreement shall be null and void.");
      
      addSection("14. Incorporation of Prime Lease", 'This Agreement is subject to all terms, conditions, and covenants of the Prime Lease with the same force and effect as if each were set forth herein. The Subtenant shall be bound by all obligations of the Tenant under the Prime Lease. Where appropriate, references to "Landlord" shall mean "Tenant," "Tenant" shall mean "Subtenant," and "Lease" shall mean "Sublease."');
      
      // Signatures
      if (y > pageHeight - 120) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFont("helvetica", "bold");
      doc.text("IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.", 15, y);
      y += lineHeight + 15;
      
      doc.text("TENANT:", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      doc.text("Signature: ___________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Name: ______________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Date: _______________________________", 15, y);
      y += lineHeight + 15;
      
      doc.setFont("helvetica", "bold");
      doc.text("SUBTENANT:", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      doc.text("Signature: ___________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Name: ______________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Date: _______________________________", 15, y);
      y += lineHeight + 15;
      
      doc.setFont("helvetica", "bold");
      doc.text("LANDLORD (Consent):", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      doc.text("Signature: ___________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Name: ______________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Date: _______________________________", 15, y);
      y += lineHeight + 20;
      
      // Add new page for Exhibit C
      doc.addPage();
      y = 20;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Exhibit C – Residential Sublease Inspection Checklist", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("The Subtenant has inspected the Premises and confirms that it is in satisfactory condition, except as noted below:", 15, y);
      y += lineHeight + 10;
      
      // Table headers
      doc.setFont("helvetica", "bold");
      doc.text("Item", 15, y);
      doc.text("Satisfactory", 80, y);
      doc.text("Comments", 130, y);
      y += lineHeight + 5;
      
      // Draw header line
      doc.line(15, y, 195, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      
      // Inspection items
      inspectionItems.forEach((item) => {
        const itemData = inspectionData[item];
        const satisfactory = itemData?.satisfactory === true ? '☑ Yes ☐ No' : 
                           itemData?.satisfactory === false ? '☐ Yes ☑ No' : '☐ Yes ☐ No';
        const comments = itemData?.comments || '';
        
        doc.text(item, 15, y);
        doc.text(satisfactory, 80, y);
        
        if (comments) {
          const commentLines = doc.splitTextToSize(comments, 60);
          commentLines.forEach((line: string, index: number) => {
            doc.text(line, 130, y + (index * lineHeight));
          });
          y += Math.max(lineHeight, commentLines.length * lineHeight);
        } else {
          y += lineHeight;
        }
        
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
      });
      
      y += lineHeight + 10;
      doc.text("Date of Inspection: _____________________", 15, y);
      y += lineHeight + 10;
      doc.text("Subtenant Signature: _____________________", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `sublease_agreement_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Sublease Agreement successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Sublease Agreement");
      return null;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-2 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Sublease Agreement Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Agreement Information</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state ? getStateName(answers.country || '', answers.state) : 'Not provided'}</p>
              <p><strong>Effective Date:</strong> {answers.effective_date ? format(new Date(answers.effective_date), 'PPP') : 'Not provided'}</p>
              <p><strong>Premises:</strong> {answers.premises_address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Original Tenant</h4>
              <p><strong>Name:</strong> {answers.tenant_name || 'Not provided'}</p>
              <p><strong>Address:</strong> {answers.tenant_address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Subtenant</h4>
              <p><strong>Name:</strong> {answers.subtenant_name || 'Not provided'}</p>
              <p><strong>Address:</strong> {answers.subtenant_address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Terms & Payment</h4>
              <p><strong>Start Date:</strong> {answers.start_date ? format(new Date(answers.start_date), 'PPP') : 'Not provided'}</p>
              <p><strong>End Date:</strong> {answers.end_date ? format(new Date(answers.end_date), 'PPP') : 'Not provided'}</p>
              <p><strong>Monthly Rent:</strong> ${answers.monthly_rent || 'Not provided'}</p>
              <p><strong>Security Deposit:</strong> ${answers.security_deposit || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Sublease Agreement.
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
            <CardTitle className="text-xl text-green-600">Sublease Agreement</CardTitle>
            <CardDescription>
              Review your Sublease Agreement details below before generating the final document.
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
                setInspectionData({});
                setSectionHistory(['location_selection']);
                setCurrentSectionId('location_selection');
                setIsComplete(false);
              }}
              className="mt-2"
            >
              Start Over
            </Button>
            <Button 
              onClick={() => generateSubleasePDF()}
            >
              Generate Sublease Agreement
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
                  onClick={() => navigate('/sublease-info')}
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Learn More About Sublease Agreement
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

export default SubleaseForm;
