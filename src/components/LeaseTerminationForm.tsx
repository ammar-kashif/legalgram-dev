import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    description: 'Select the country and state where this lease termination agreement will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'parties_info'
  },
  'parties_info': {
    id: 'parties_info',
    title: 'Parties Information',
    description: 'Enter the landlord and tenant details',
    questions: ['landlord_name', 'landlord_city_state', 'tenant_name'],
    nextSectionId: 'original_lease_info'
  },
  'original_lease_info': {
    id: 'original_lease_info',
    title: 'Original Lease Information',
    description: 'Enter details about the original lease agreement',
    questions: ['original_lease_date', 'property_street', 'property_city', 'property_state', 'property_zip'],
    nextSectionId: 'termination_details'
  },
  'termination_details': {
    id: 'termination_details',
    title: 'Termination Details',
    description: 'Specify the termination date and forwarding address',
    questions: ['termination_date', 'forwarding_name', 'forwarding_street', 'forwarding_city', 'forwarding_state', 'forwarding_zip'],
    nextSectionId: 'user_info'
  },
  'user_info': {
    id: 'user_info',
    title: 'Contact Information',
    description: 'Provide your contact information to generate the document',
    questions: ['user_info_step']
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
    defaultNextId: 'landlord_name'
  },
  'landlord_name': {
    id: 'landlord_name',
    type: 'text',
    text: 'Landlord\'s Full Name:',
    defaultNextId: 'landlord_city_state'
  },
  'landlord_city_state': {
    id: 'landlord_city_state',
    type: 'text',
    text: 'Landlord\'s City, State:',
    defaultNextId: 'tenant_name'
  },
  'tenant_name': {
    id: 'tenant_name',
    type: 'text',
    text: 'Tenant\'s Full Name:',
    defaultNextId: 'original_lease_date'
  },
  'original_lease_date': {
    id: 'original_lease_date',
    type: 'date',
    text: 'Date of Original Lease:',
    defaultNextId: 'property_street'
  },
  'property_street': {
    id: 'property_street',
    type: 'text',
    text: 'Property Street Address:',
    defaultNextId: 'property_city'
  },
  'property_city': {
    id: 'property_city',
    type: 'text',
    text: 'Property City:',
    defaultNextId: 'property_state'
  },
  'property_state': {
    id: 'property_state',
    type: 'text',
    text: 'Property State:',
    defaultNextId: 'property_zip'
  },
  'property_zip': {
    id: 'property_zip',
    type: 'text',
    text: 'Property ZIP Code:',
    defaultNextId: 'termination_date'
  },
  'termination_date': {
    id: 'termination_date',
    type: 'date',
    text: 'Date of Termination:',
    defaultNextId: 'forwarding_name'
  },
  'forwarding_name': {
    id: 'forwarding_name',
    type: 'text',
    text: 'Tenant Name (for forwarding address):',
    defaultNextId: 'forwarding_street'
  },
  'forwarding_street': {
    id: 'forwarding_street',
    type: 'text',
    text: 'Forwarding Street Address:',
    defaultNextId: 'forwarding_city'
  },
  'forwarding_city': {
    id: 'forwarding_city',
    type: 'text',
    text: 'Forwarding City:',
    defaultNextId: 'forwarding_state'
  },
  'forwarding_state': {
    id: 'forwarding_state',
    type: 'text',
    text: 'Forwarding State:',
    defaultNextId: 'forwarding_zip'
  },
  'forwarding_zip': {
    id: 'forwarding_zip',
    type: 'text',
    text: 'Forwarding ZIP Code:',
    defaultNextId: 'confirmation'
  },
  'user_info_step': {
    id: 'user_info_step',
    type: 'confirmation',
    text: 'Please provide your contact information to generate your document.',
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your Agreement to Terminate Lease based on your answers.',
  }
};

const LeaseTerminationForm = () => {
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
        if (questionId === 'user_info_step') {
          return (
            <UserInfoStep
              onBack={handleBack}
              onGenerate={generateLeaseTerminationPDF}
              documentType="Lease Termination Agreement"
              isGenerating={isGeneratingPDF}
            />
          );
        }
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
    if (currentSectionId === 'parties_info') {
      return answers.landlord_name && answers.landlord_city_state && answers.tenant_name;
    }
    if (currentSectionId === 'original_lease_info') {
      return answers.original_lease_date && answers.property_street && answers.property_city && answers.property_state && answers.property_zip;
    }
    if (currentSectionId === 'termination_details') {
      return answers.termination_date && answers.forwarding_name && answers.forwarding_street && answers.forwarding_city && answers.forwarding_state && answers.forwarding_zip;
    }
    
    // Default validation
    return true;
  };

  const generateLeaseTerminationPDF = () => {
    try {
      setIsGeneratingPDF(true);
      console.log("Generating Agreement to Terminate Lease PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("AGREEMENT TO TERMINATE LEASE", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Introduction
      const introText = `This Agreement to Terminate Lease ("Agreement") is entered into by and between ${answers.landlord_name || '[Landlord\'s Full Name]'} ("Landlord")`;
      
      const introLines = doc.splitTextToSize(introText, 170);
      introLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      doc.setFont("helvetica", "bold");
      doc.text("And", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const originalLeaseDate = answers.original_lease_date ? format(new Date(answers.original_lease_date), "MMMM d, yyyy") : '[Date of Original Lease]';
      doc.text(`${answers.tenant_name || '[Tenant\'s Full Name]'} ("Tenant"), who previously executed a Lease Agreement dated ${originalLeaseDate}, pertaining to the real property located at ${answers.property_street || '[Street Address]'}, ${answers.property_city || '[City]'}, ${answers.property_state || '[State]'}, ${answers.property_zip || '[Zip Code]'} (the "Premises").`, 15, y);
      y += lineHeight * 3 + 5;
      
      doc.setFont("helvetica", "bold");
      doc.text("WHEREAS,", 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(" the parties now mutually desire to terminate the aforementioned Lease Agreement;", 50, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "bold");
      doc.text("NOW, THEREFORE,", 15, y);
      doc.setFont("helvetica", "normal");
      const nowThereforeText = " in consideration of the mutual promises and covenants contained herein, and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:";
      
      const nowThereforeLines = doc.splitTextToSize(nowThereforeText, 120);
      nowThereforeLines.forEach((line: string, index: number) => {
        if (index === 0) {
          doc.text(line, 80, y);
        } else {
          doc.text(line, 15, y);
        }
        y += lineHeight;
      });
      y += lineHeight + 5;
      
      // Section 1: Termination Date
      doc.setFont("helvetica", "bold");
      doc.text("1. Termination Date", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const terminationDate = answers.termination_date ? format(new Date(answers.termination_date), "MMMM d, yyyy") : '[Date of Termination]';
      const terminationText = `The Lease Agreement shall be terminated effective as of ${terminationDate} (the "Termination Date"). As of the Termination Date, all rights, obligations, and responsibilities of the parties under the Lease Agreement shall cease and be of no further force or effect, except as otherwise provided herein.`;
      
      const terminationLines = doc.splitTextToSize(terminationText, 170);
      terminationLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 5;
      
      // Section 2: Survival of Provisions
      doc.setFont("helvetica", "bold");
      doc.text("2. Survival of Provisions", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const survivalText = "Notwithstanding the termination of the Lease, any provisions of the original Lease Agreement that by their nature are intended to survive termination, including but not limited to indemnification, liability for damages, and remedies for default, shall remain in full force and effect, subject to the revised Termination Date.";
      
      const survivalLines = doc.splitTextToSize(survivalText, 170);
      survivalLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 5;
      
      // Section 3: Forwarding Address
      doc.setFont("helvetica", "bold");
      doc.text("3. Forwarding Address", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      doc.text("Tenant designates the following address as their forwarding address for purposes of receiving any correspondence, including the return of any security deposit or other legal notices required by law:", 15, y);
      y += lineHeight * 2 + 5;
      
      doc.text(`${answers.forwarding_name || '[Tenant Name]'}`, 15, y);
      y += lineHeight + 3;
      doc.text(`${answers.forwarding_street || '[Street Address]'}`, 15, y);
      y += lineHeight + 3;
      doc.text(`${answers.forwarding_city || '[City]'}, ${answers.forwarding_state || '[State]'} ${answers.forwarding_zip || '[Zip Code]'}`, 15, y);
      y += lineHeight + 10;
      
      // Section 4: Execution
      doc.setFont("helvetica", "bold");
      doc.text("4. Execution", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const executionText = "This Agreement shall be deemed effective upon execution by both parties. This Agreement may be executed in counterparts, and electronic signatures shall have the same force and effect as original signatures.";
      
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
      doc.text("IN WITNESS WHEREOF, the parties have executed this Agreement as of the dates written below.", 15, y);
      y += lineHeight + 15;
      
      doc.setFont("helvetica", "bold");
      doc.text("LANDLORD:", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      doc.text("Signature: ___________________________", 15, y);
      y += lineHeight + 5;
      doc.text(`Name: ${answers.landlord_name || '______________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text(`Location: ${answers.landlord_city_state || '______________________________'}`, 15, y);
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
      const filename = `agreement_to_terminate_lease_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Agreement to Terminate Lease successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Agreement to Terminate Lease");
      return null;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-2 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Agreement to Terminate Lease Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Location</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state ? getStateName(answers.country || '', answers.state) : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Parties</h4>
              <p><strong>Landlord:</strong> {answers.landlord_name || 'Not provided'}</p>
              <p><strong>Landlord Location:</strong> {answers.landlord_city_state || 'Not provided'}</p>
              <p><strong>Tenant:</strong> {answers.tenant_name || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Original Lease</h4>
              <p><strong>Original Lease Date:</strong> {answers.original_lease_date ? format(new Date(answers.original_lease_date), 'PPP') : 'Not provided'}</p>
              <p><strong>Property Address:</strong> {answers.property_street || 'Not provided'}</p>
              <p><strong>City, State, ZIP:</strong> {`${answers.property_city || ''}, ${answers.property_state || ''} ${answers.property_zip || ''}`.trim() || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Termination Details</h4>
              <p><strong>Termination Date:</strong> {answers.termination_date ? format(new Date(answers.termination_date), 'PPP') : 'Not provided'}</p>
              <p><strong>Forwarding Address:</strong></p>
              <p className="ml-2">{answers.forwarding_name || 'Not provided'}</p>
              <p className="ml-2">{answers.forwarding_street || 'Not provided'}</p>
              <p className="ml-2">{`${answers.forwarding_city || ''}, ${answers.forwarding_state || ''} ${answers.forwarding_zip || ''}`.trim() || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Agreement to Terminate Lease.
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
            <CardTitle className="text-xl text-green-600">Agreement to Terminate Lease</CardTitle>
            <CardDescription>
              Review your Agreement to Terminate Lease details below before generating the final document.
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
              onClick={generateLeaseTerminationPDF}
            >
              Generate Agreement to Terminate Lease
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
                  onClick={() => navigate('/lease-termination-info')}
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Learn More About Agreement to Terminate Lease
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
            {currentSectionId === 'user_info' ? (
              renderQuestionInput('user_info_step')
            ) : (
              renderSectionQuestions()
            )}
          </div>
        </CardContent>
        {currentSectionId !== 'user_info' && (
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

export default LeaseTerminationForm;
