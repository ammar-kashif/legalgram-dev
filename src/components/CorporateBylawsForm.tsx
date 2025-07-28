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
    description: 'Select the state where this corporation is incorporated',
    questions: ['country', 'state'],
    nextSectionId: 'corporation_info'
  },
  'corporation_info': {
    id: 'corporation_info',
    title: 'Corporation Information',
    description: 'Basic corporation details and registered office',
    questions: ['corporation_name', 'registered_office'],
    nextSectionId: 'directors_info'
  },
  'directors_info': {
    id: 'directors_info',
    title: 'Board of Directors',
    description: 'Director configuration and terms',
    questions: ['number_of_directors', 'director_term_years'],
    nextSectionId: 'adoption_date'
  },
  'adoption_date': {
    id: 'adoption_date',
    title: 'Bylaws Adoption',
    description: 'Date when bylaws are adopted by the Board of Directors',
    questions: ['adoption_date'],
    nextSectionId: 'secretary_info'
  },
  'secretary_info': {
    id: 'secretary_info',
    title: 'Secretary Information',
    description: 'Corporate Secretary details for certification',
    questions: ['secretary_name'],
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
    text: 'Select the state of incorporation:',
    options: [], // Will be populated dynamically
    defaultNextId: 'corporation_name'
  },
  'corporation_name': {
    id: 'corporation_name',
    type: 'text',
    text: 'Corporation Name:',
    defaultNextId: 'registered_office'
  },
  'registered_office': {
    id: 'registered_office',
    type: 'text',
    text: 'Registered Office Address:',
    defaultNextId: 'number_of_directors'
  },
  'number_of_directors': {
    id: 'number_of_directors',
    type: 'number',
    text: 'Number of Directors on the Board:',
    defaultNextId: 'director_term_years'
  },
  'director_term_years': {
    id: 'director_term_years',
    type: 'number',
    text: 'Director Term Length (years):',
    defaultNextId: 'adoption_date'
  },
  'adoption_date': {
    id: 'adoption_date',
    type: 'date',
    text: 'Date of Bylaws Adoption by Board of Directors:',
    defaultNextId: 'secretary_name'
  },
  'secretary_name': {
    id: 'secretary_name',
    type: 'text',
    text: 'Corporate Secretary Name:',
    defaultNextId: 'user_info_step'
  },
  'user_info_step': {
    id: 'user_info_step',
    type: 'confirmation',
    text: 'Please review all information above and click "Complete" to generate your Corporate Bylaws.',
    defaultNextId: ''
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Please review all information above and click "Complete" to generate your Corporate Bylaws.',
    defaultNextId: ''
  }
};

const CorporateBylawsForm = () => {
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
              placeholder="Enter number..."
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
    if (currentSectionId === 'corporation_info') {
      return answers.corporation_name && answers.registered_office;
    }
    if (currentSectionId === 'directors_info') {
      return answers.number_of_directors && answers.director_term_years;
    }
    if (currentSectionId === 'adoption_date') {
      return answers.adoption_date;
    }
    if (currentSectionId === 'secretary_info') {
      return answers.secretary_name;
    }
    if (currentSectionId === 'user_info_step') {
      return answers.user_info_step;
    }
    
    // Default validation
    return true;
  };

  const generateCorporateBylawsPDF = () => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF();
      
      // Set up the document
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      const corporationName = answers.corporation_name || '[_______]';
      doc.text(`Bylaws of ${corporationName}`, 105, 20, { align: "center" });
      
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

      // Get form values
      const registeredOffice = answers.registered_office || '____________________';
      const stateName = answers.state ? getStateName(answers.country || '', answers.state) : '____________________';
      const numberOfDirectors = answers.number_of_directors || '[_______]';
      const directorTermYears = answers.director_term_years || '[_______]';
      const adoptionDate = answers.adoption_date ? format(new Date(answers.adoption_date), "MMMM d, yyyy") : '______________';
      const secretaryName = answers.secretary_name || '___________________';

      // Offices Section
      addSection("Offices", "");
      addSection("Registered Office.", `The registered office of ${corporationName} (the \"Corporation\") shall be at ${registeredOffice}.`);
      addSection("Offices.", `The Corporation may also have offices at such other places both within and without ${stateName} as the Board of Directors may from time to time determine and the Corporation may require.`);

      // Shareholders Section
      addSection("Shareholders", "");
      addSection("Annual Meeting.", "An annual meeting shall be held for shareholders. The purpose of this meeting is for electing directors and for the transaction of other business that may come before the shareholders.");
      addSection("Special Meetings.", "Special meetings of the shareholders may be requested by the President, the Board of Directors, or the holders of at least one-tenth of all the shares entitled to vote at the meeting.");
      addSection("Notice.", "Written or printed notice stating the place, date, and time of the meeting shall be provided not less than ten nor more than sixty days before the date of the meeting. Notice may be delivered personally, by mail, or electronically, by or at the direction of the President, the Secretary, or other persons calling the meeting.");
      addSection("Waiver of Notice.", "A shareholder may waive notice of any meeting before, during, or after it is held.");
      addSection("Record Date.", "The Board of Directors may fix a record date for determining shareholders entitled to notice of or to vote at a meeting.");
      addSection("Quorum.", "A majority of the shares entitled to vote, represented in person or by proxy, shall constitute a quorum.");
      addSection("Proxies.", "A shareholder may vote in person or by proxy executed in writing.");
      addSection("Action Without Meeting.", "Any action required to be taken at a meeting of shareholders may be taken without a meeting if written consent, setting forth the action taken, is signed by all shareholders entitled to vote.");
      addSection("Informal Action.", "Any action taken at a meeting which was not properly called or noticed is valid if all shareholders entitled to vote were present or waived notice.");

      // Directors Section
      addSection("Directors", "");
      addSection("Number of Directors.", `The Corporation shall be managed by a Board of Directors of ${numberOfDirectors} director(s).`);
      addSection("Election and Term of Office.", `The directors shall be elected at the annual shareholders' meeting. Each director shall serve a term of ${directorTermYears} year(s) and until a successor is elected and qualified.`);
      addSection("Regular Meeting.", "A regular meeting of the directors shall be held without notice, immediately after and at the same place as the annual shareholders' meeting.");
      addSection("Special Meeting.", "Special meetings may be requested by the President, Vice President, Secretary, or any two directors by providing notice at least two days before the meeting.");
      addSection("Notice.", "Notice of any special meeting shall be given at least two days in advance, either personally or electronically.");
      addSection("Waiver of Notice.", "A director may waive notice of any meeting either before, during, or after the meeting.");
      addSection("Quorum.", "A majority of the directors shall constitute a quorum.");
      addSection("Action Without Meeting.", "Any action required or permitted to be taken at a meeting of directors may be taken without a meeting if all directors consent in writing.");
      addSection("Informal Action.", "Any action taken at a meeting not properly called or noticed is valid if all directors are present or waive notice.");
      addSection("Removal.", "A director may be removed, with or without cause, by a majority vote of shareholders.");
      addSection("Vacancies.", "Any vacancy occurring in the Board of Directors may be filled by the remaining directors.");
      addSection("Compensation.", "Directors may be paid expenses for attendance at meetings and a fixed sum or stated salary as determined by resolution of the Board.");

      // Officers Section
      addSection("Officers", "");
      addSection("Number of Officers.", "The Officers of the Corporation shall be a President, a Treasurer, and a Secretary. Two or more of these may be held by one person. Although the above Officers are designated, the Board of Directors may elect and appoint other Officers as they deem necessary.");
      addSection("President (Chairman).", "The President shall be the chief executive officer of the Corporation and shall supervise the conduct of all the business and affairs of the Corporation and such duties as usually are vested in such position and such as may be prescribed by the Board of Directors and/or the Bylaws.");
      addSection("Secretary.", "The Secretary shall give Notice of all meetings of the Board of Directors and Shareholders, keep minutes of such meetings, and be custodian of the Corporate Records. The Secretary shall maintain the Corporation's minute book and shall maintain all filings and records for the Corporation.");
      addSection("Treasurer.", "The Treasurer shall be the principal financial officer responsible for the financial affairs of the Corporation generally, and shall keep an accurate accounting of the finances of the Corporation, and shall render financial statements of the Corporation from time to time, as required by the Board of Directors.");
      addSection("Duties and terms of Office.", "The Officers shall be elected annually by the Board of Directors at the annual meeting. Each Officer shall hold office until a successor is elected, or until he or she resigns or is removed from office by the Board of Directors.");
      addSection("Removal of Officers.", "Any Officer may be removed by the Board of Directors at any time, with or without cause.");
      addSection("Vacancies.", "A vacancy in any office may be filled by the Board of Directors for the unexpired portion of the term.");

      // Corporate Seal, Execution of Documents Section
      addSection("Corporate Seal, Execution of Documents", "The Corporation shall not have a corporate seal. All instruments that are executed on behalf of the Corporation that are acknowledged by law to be under seal, including deeds, bonds, mortgages, and contracts, shall not be executed under seal. All instruments executed on behalf of the Corporation shall be signed by the President, Treasurer, or Secretary unless otherwise specified by the Board of Directors.");

      // Amendment to Bylaws Section
      addSection("Amendment to Bylaws", "These Bylaws may be amended, altered, or repealed by a majority of the Board of Directors then in office, or by a majority of a quorum of the shareholders at any annual or special meeting. Any such changes shall be made in writing and placed in the Corporation's minute book.");

      // Indemnification of Officers Section
      addSection("Indemnification of Officers", "Any Officer or agent who is made a party to litigation or other proceeding by reason of his or her position with the Corporation shall be indemnified by the Corporation to the fullest extent authorized by law, provided he or she acted in good faith and in a manner reasonably believed to be in the best interest of the Corporation.");

      // Stock Certificates Section
      addSection("Stock Certificates", "The Corporation may issue shares of the Corporation's stock in certificated or uncertificated form. Within a reasonable time after the issue or transfer of uncertificated stock, the Corporation shall send the shareholder a written statement containing the information required by law to be on certificates.");

      // Distributions Section
      addSection("Distributions", "The Corporation may, from time to time, declare and pay dividends or make distributions upon its capital stock, subject to the provisions of the Articles of Incorporation and applicable law.");

      // Certificate Section
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text("Certificate", 15, y);
      y += lineHeight + 10;

      doc.setFont("helvetica", "normal");
      doc.text(`The undersigned, Secretary of the Corporation, hereby certifies that the foregoing is a true and correct copy of the bylaws of the above-named Corporation, duly adopted by the Board of Directors on ${adoptionDate}.`, 15, y);
      y += lineHeight * 4 + 10;

      doc.text(`Secretary: ${secretaryName}`, 15, y);
      y += lineHeight + 5;
      doc.text("Date: ________________", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `corporate_bylaws_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Corporate Bylaws successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Corporate Bylaws");
      return null;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-2 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Corporate Bylaws Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Corporation Information</h4>
              <p><strong>Corporation Name:</strong> {answers.corporation_name || 'Not provided'}</p>
              <p><strong>Registered Office:</strong> {answers.registered_office || 'Not provided'}</p>
              <p><strong>State:</strong> {answers.state ? getStateName(answers.country || '', answers.state) : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Board Structure</h4>
              <p><strong>Number of Directors:</strong> {answers.number_of_directors || 'Not provided'}</p>
              <p><strong>Director Term:</strong> {answers.director_term_years || 'Not provided'} year(s)</p>
              <p><strong>Adoption Date:</strong> {answers.adoption_date ? format(new Date(answers.adoption_date), 'PPP') : 'Not provided'}</p>
              <p><strong>Secretary:</strong> {answers.secretary_name || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Corporate Bylaws.
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
            <CardTitle className="text-xl text-green-600">Corporate Bylaws</CardTitle>
            <CardDescription>
              Review your Corporate Bylaws details below before generating the final document.
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
              onClick={generateCorporateBylawsPDF}
            >
              Generate Corporate Bylaws
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
        onGenerate={generateCorporateBylawsPDF}
        documentType="Corporate Bylaws"
        isGenerating={isGeneratingPDF}
      />
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
                  onClick={() => navigate('/corporate-bylaws-info')}
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Learn More About Corporate Bylaws
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

export default CorporateBylawsForm;
