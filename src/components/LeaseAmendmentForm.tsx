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
    description: 'Select the country and state where this lease amendment will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'amendment_date'
  },
  'amendment_date': {
    id: 'amendment_date',
    title: 'Amendment Date',
    description: 'Enter the date of this lease amendment',
    questions: ['amendment_date'],
    nextSectionId: 'parties_info'
  },
  'parties_info': {
    id: 'parties_info',
    title: 'Parties Information',
    description: 'Enter the landlord and tenant information',
    questions: ['landlord_name', 'tenant_name'],
    nextSectionId: 'original_lease'
  },
  'original_lease': {
    id: 'original_lease',
    title: 'Original Lease Details',
    description: 'Information about the original lease agreement',
    questions: ['original_lease_date', 'property_address', 'property_city', 'property_county'],
    nextSectionId: 'amendments'
  },
  'amendments': {
    id: 'amendments',
    title: 'Amendment Details',
    description: 'Specify the changes being made to the lease',
    questions: ['amendment_details', 'recording_county_state'],
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
    defaultNextId: 'amendment_date'
  },
  'amendment_date': {
    id: 'amendment_date',
    type: 'date',
    text: 'Date of this Lease Amendment:',
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
    defaultNextId: 'original_lease_date'
  },
  'original_lease_date': {
    id: 'original_lease_date',
    type: 'date',
    text: 'Original Lease Agreement Date:',
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
    text: 'Property City, State, ZIP Code:',
    defaultNextId: 'property_county'
  },
  'property_county': {
    id: 'property_county',
    type: 'text',
    text: 'Property County:',
    defaultNextId: 'amendment_details'
  },
  'amendment_details': {
    id: 'amendment_details',
    type: 'textarea',
    text: 'Specific Amendment Details (e.g., updated rent amount, extension of lease term, modified utility responsibilities, etc.):',
    defaultNextId: 'recording_county_state'
  },
  'recording_county_state': {
    id: 'recording_county_state',
    type: 'text',
    text: 'County and State for Recording (if applicable):',
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your Lease Amendment based on your answers.',
  }
};

const LeaseAmendmentForm = () => {
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
              placeholder="Describe the specific changes being made to the lease"
              className="mt-1 text-black w-full bg-white"
              rows={4}
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
    if (currentSectionId === 'amendment_date') {
      return answers.amendment_date;
    }
    if (currentSectionId === 'parties_info') {
      return answers.landlord_name && answers.tenant_name;
    }
    if (currentSectionId === 'original_lease') {
      return answers.original_lease_date && answers.property_address && answers.property_city && answers.property_county;
    }
    if (currentSectionId === 'amendments') {
      return answers.amendment_details;
    }
    
    // Default validation
    return true;
  };

  const generateLeaseAmendmentPDF = () => {
    try {
      console.log("Generating Lease Amendment PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("LEASE AMENDMENT", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Introduction
      const amendmentDate = answers.amendment_date ? format(new Date(answers.amendment_date), "MMMM d, yyyy") : '[Insert Date]';
      
      const introText = `This Lease Amendment ("Amendment") is made and entered into on ${amendmentDate}, by and between ${answers.landlord_name || '[Landlord\'s Full Name]'} ("Landlord")`;
      
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
      doc.text(`${answers.tenant_name || '[Tenant\'s Full Name]'} ("Tenant") (collectively referred to as the "Parties").`, 15, y);
      y += lineHeight + 10;
      
      // Background
      doc.setFont("helvetica", "bold");
      doc.text("Background", 15, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "normal");
      const originalLeaseDate = answers.original_lease_date ? format(new Date(answers.original_lease_date), "MMMM d, yyyy") : '[Insert Original Lease Date]';
      const propertyAddress = `${answers.property_address || '[Street Address]'}, ${answers.property_city || '[City, State, ZIP Code]'}`;
      
      const backgroundText1 = `The Parties previously entered into a Lease Agreement dated ${originalLeaseDate} (the "Lease"), under which the Tenant leased from the Landlord the property located at ${propertyAddress}, as further described in the Lease.`;
      
      const backgroundLines1 = doc.splitTextToSize(backgroundText1, 170);
      backgroundLines1.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      const backgroundText2 = "The Parties now wish to amend the Lease under the terms set forth in this Amendment.";
      
      const backgroundLines2 = doc.splitTextToSize(backgroundText2, 170);
      backgroundLines2.forEach((line: string) => {
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
      
      // Section 1: Confirmation of Existing Lease
      addSection("1. Confirmation of Existing Lease", "The Parties acknowledge that the Lease is currently valid and in full effect and that neither party is in breach or default of any of its terms.");
      
      // Section 2: Amendments
      const amendmentDetails = answers.amendment_details || '[Insert specific amendment(s) here, e.g., updated rent amount, extension of lease term, modified utility responsibilities, etc.]';
      addSection("2. Amendments", `The Lease is hereby amended as follows:\n\n${amendmentDetails}`);
      
      // Section 3: Remaining Provisions Unaffected
      addSection("3. Remaining Provisions Unaffected", "Except as expressly amended in this Agreement, all other terms, covenants, and provisions of the original Lease shall remain unchanged and in full force and effect. The Parties reaffirm their agreement to the Lease, as modified by this Amendment.");
      
      // Section 4: Recordation (Optional)
      const recordingLocation = answers.recording_county_state || '[Insert County and State]';
      addSection("4. Recordation (Optional)", `This Amendment may be recorded at the discretion of either party. Alternatively, the Parties may prepare and execute a short-form memorandum of this Amendment to be recorded in the Register's Office of ${recordingLocation}.`);
      
      // Section 5: Conflict
      addSection("5. Conflict", "If any provision in this Amendment conflicts with any term or condition of the original Lease, the terms of this Amendment shall prevail and control.");
      
      // Section 6: Binding Effect
      addSection("6. Binding Effect", "This Amendment shall be binding upon and shall inure to the benefit of the Parties and their respective successors and assigns. However, nothing in this clause shall be construed to permit assignment of the Lease by the Tenant unless otherwise authorized by the original Lease.");
      
      // Signatures
      if (y > pageHeight - 100) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFont("helvetica", "bold");
      doc.text("IN WITNESS WHEREOF, the Parties have executed this Lease Amendment as of the date first written above.", 15, y);
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
      doc.text("TENANT:", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      doc.text("Signature: ___________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Name: ______________________________", 15, y);
      y += lineHeight + 5;
      doc.text("Date: _______________________________", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `lease_amendment_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Lease Amendment successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Lease Amendment");
      return null;
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-2 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Lease Amendment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Amendment Information</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state ? getStateName(answers.country || '', answers.state) : 'Not provided'}</p>
              <p><strong>Amendment Date:</strong> {answers.amendment_date ? format(new Date(answers.amendment_date), 'PPP') : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Parties</h4>
              <p><strong>Landlord:</strong> {answers.landlord_name || 'Not provided'}</p>
              <p><strong>Tenant:</strong> {answers.tenant_name || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Original Lease</h4>
              <p><strong>Lease Date:</strong> {answers.original_lease_date ? format(new Date(answers.original_lease_date), 'PPP') : 'Not provided'}</p>
              <p><strong>Property:</strong> {answers.property_address || 'Not provided'}</p>
              <p><strong>City:</strong> {answers.property_city || 'Not provided'}</p>
              <p><strong>County:</strong> {answers.property_county || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Amendment Details</h4>
              <p><strong>Changes:</strong> {answers.amendment_details ? (answers.amendment_details.length > 100 ? answers.amendment_details.substring(0, 100) + "..." : answers.amendment_details) : 'Not provided'}</p>
              <p><strong>Recording Location:</strong> {answers.recording_county_state || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Lease Amendment.
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
            <CardTitle className="text-xl text-green-600">Lease Amendment</CardTitle>
            <CardDescription>
              Review your Lease Amendment details below before generating the final document.
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
              onClick={generateLeaseAmendmentPDF}
            >
              Generate Lease Amendment
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
                  onClick={() => navigate('/lease-amendment-info')}
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Learn More About Lease Amendment
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

export default LeaseAmendmentForm;
