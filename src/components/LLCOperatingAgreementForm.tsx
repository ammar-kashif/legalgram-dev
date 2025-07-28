import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, Plus, Minus, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { toast } from "sonner";
import CountryStateAPI from 'countries-states-cities';
import UserInfoStep from "./UserInfoStep";

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
  type: 'text' | 'textarea' | 'confirmation' | 'select' | 'members' | 'number';
  text: string;
  options?: string[];
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

// Member interface
interface Member {
  name: string;
  percentage: string;
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
    description: 'Select the country and state/province where this LLC will be formed',
    questions: ['country', 'state'],
    nextSectionId: 'company_info'
  },
  'company_info': {
    id: 'company_info',
    title: 'Company Information',
    description: 'Enter basic information about the LLC',
    questions: ['company_name', 'business_purpose'],
    nextSectionId: 'members_info'
  },
  'members_info': {
    id: 'members_info',
    title: 'Members Information',
    description: 'Add the members and their ownership percentages',
    questions: ['members'],
    nextSectionId: 'fiscal_info'
  },
  'fiscal_info': {
    id: 'fiscal_info',
    title: 'Fiscal Information',
    description: 'Set the fiscal year and other administrative details',
    questions: ['fiscal_year_end'],
    nextSectionId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    title: 'Confirmation',
    description: 'Review and confirm your information',
    questions: ['confirmation']
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
    text: 'Select the country where this LLC will be formed:',
    options: [],
    defaultNextId: 'state'
  },
  'state': {
    id: 'state',
    type: 'select',
    text: 'Select the state/province where this LLC will be formed:',
    options: [],
    defaultNextId: 'company_name'
  },
  'company_name': {
    id: 'company_name',
    type: 'text',
    text: 'LLC Company Name:',
    defaultNextId: 'business_purpose'
  },
  'business_purpose': {
    id: 'business_purpose',
    type: 'textarea',
    text: 'Business Purpose (describe the primary business activities):',
    defaultNextId: 'members'
  },
  'members': {
    id: 'members',
    type: 'members',
    text: 'LLC Members and Ownership Percentages:',
    defaultNextId: 'fiscal_year_end'
  },
  'fiscal_year_end': {
    id: 'fiscal_year_end',
    type: 'select',
    text: 'Fiscal Year End Month:',
    options: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your LLC Operating Agreement based on your answers.',
  },
  'user_info_step': {
    id: 'user_info_step',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your LLC Operating Agreement based on your answers.',
  }
};

const LLCOperatingAgreementForm = () => {
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [members, setMembers] = useState<Member[]>([{ name: '', percentage: '' }]);
  
  const currentSection = sections[currentSectionId];

  const handleNext = () => {
    try {
      const nextSectionId = currentSection?.nextSectionId;
      
      if (!nextSectionId) {
        setShowUserInfo(true);
        return;
      }
      
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

  const addMember = () => {
    setMembers([...members, { name: '', percentage: '' }]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      const newMembers = members.filter((_, i) => i !== index);
      setMembers(newMembers);
    }
  };

  const updateMember = (index: number, field: keyof Member, value: string) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
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
              placeholder="Enter company name"
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
            />
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
              placeholder="Describe the primary business activities of the LLC"
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
              rows={4}
            />
          </div>
        );
      case 'members':
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="space-y-3">
              {members.map((member, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Member {index + 1}</h4>
                    {members.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMember(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Full Name</Label>
                      <Input
                        value={member.name}
                        onChange={(e) => updateMember(index, 'name', e.target.value)}
                        placeholder="Enter member's full name"
                        className="text-black bg-white rounded-lg shadow-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Ownership Percentage (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={member.percentage}
                        onChange={(e) => updateMember(index, 'percentage', e.target.value)}
                        placeholder="Enter percentage"
                        className="text-black bg-white rounded-lg shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addMember}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>
        );
      case 'select':
        let options = question.options || [];
        
        if (questionId === 'country') {
          const countries = getAllCountries();
          options = countries.map(country => `${country.id}|${country.name}`);
        } else if (questionId === 'state' && answers.country) {
          const countryId = answers.country.split('|')[0];
          const states = getStatesByCountry(parseInt(countryId));
          options = states.map(state => `${state.id}|${state.name}`);
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
                {options.map((option) => {
                  const [id, name] = option.includes('|') ? option.split('|') : [option, option];
                  return (
                    <SelectItem key={id} value={option}>
                      {name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
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
    
    if (currentSectionId === 'location_selection') {
      return answers.country && answers.state;
    }
    if (currentSectionId === 'company_info') {
      return answers.company_name && answers.business_purpose;
    }
    if (currentSectionId === 'members_info') {
      return members.every(member => member.name && member.percentage);
    }
    if (currentSectionId === 'fiscal_info') {
      return answers.fiscal_year_end;
    }
    
    return true;
  };

  const generateLLCOperatingAgreementPDF = () => {
    setIsGeneratingPDF(true);
    try {
      console.log("Generating LLC Operating Agreement PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("LLC OPERATING AGREEMENT:", 105, 20, { align: "center" });
      
      // Subtitle
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.text("A Limited Liability Company", 105, 28, { align: "center" });
      
      // Jurisdiction line
      const countryName = answers.country ? getCountryName(answers.country.split('|')[0]) : '';
      const stateName = answers.state ? getStateName(answers.country?.split('|')[0] || '', answers.state.split('|')[0]) : '';
      
      let y = 40;
      const lineHeight = 6;
      const pageHeight = 280;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      // Opening paragraph
      const openingText = `This Operating Agreement ("Agreement") of ${answers.company_name || '[COMPANY NAME]'} ("Company"), is executed and agreed to, for good and valuable consideration, by the undersigned members (individually, "Member" or collectively, "Members").`;
      
      const openingLines = doc.splitTextToSize(openingText, 180);
      openingLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Formation Section
      doc.setFont("helvetica", "bold");
      doc.text("Formation", 15, y);
      y += lineHeight * 1.5;
      
      doc.setFont("helvetica", "normal");
      
      // State of Formation
      doc.setFont("helvetica", "bold");
      doc.text("(a) State of Formation.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const formationText = `This Agreement is for ${answers.company_name || '[COMPANY NAME]'} a manager-managed limited liability company formed under and pursuant to ${stateName && countryName ? `${stateName}, ${countryName}` : '[STATE/COUNTRY]'} law.`;
      const formationLines = doc.splitTextToSize(formationText, 165);
      formationLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Operating Agreement Controls
      doc.setFont("helvetica", "bold");
      doc.text("(b) Operating Agreement Controls.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const controlsText = "To the extent that the rights or obligations of the Members, or the Company under provisions of this Agreement differ from what they would be under state law absent such a provision, this Agreement, to the extent permitted under state law, shall control.";
      const controlsLines = doc.splitTextToSize(controlsText, 165);
      controlsLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 20;
      }
      
      // Principal Office
      doc.setFont("helvetica", "bold");
      doc.text("(c) Principal Office.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const principalOfficeText = "The Company's principal office will be as set out in the Company's Articles of Organization or other filing on record with the Secretary of State, or such other location as shall be selected from time to time by the Members.";
      const principalOfficeLines = doc.splitTextToSize(principalOfficeText, 165);
      principalOfficeLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Registered Agent and Office
      doc.setFont("helvetica", "bold");
      doc.text("(d) Registered Agent and Office.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const registeredAgentText = "The name of the Company's registered agent for service of process and the address of the Company's registered office will be as specified in the Company's Articles of Organization or any subsequent filings with the Secretary of State. If this information changes, the Company will promptly file a statement of change with the Secretary of State according to applicable law.";
      const registeredAgentLines = doc.splitTextToSize(registeredAgentText, 165);
      registeredAgentLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // No State Law Partnership
      doc.setFont("helvetica", "bold");
      doc.text("(e) No State Law Partnership.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const partnershipText = "No provisions of this Agreement shall be deemed or construed to constitute a partnership (including, without limitation, a limited partnership) or joint venture, or any Member a partner or joint venturer of or with any other Member, for any purposes other than federal and state tax purposes.";
      const partnershipLines = doc.splitTextToSize(partnershipText, 165);
      partnershipLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight * 1.5;
      
      // Check if we need a new page
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 20;
      }
      
      // Purposes and Powers Section
      doc.setFont("helvetica", "bold");
      doc.text("Purposes and Powers", 15, y);
      y += lineHeight * 1.5;
      
      // Purpose
      doc.setFont("helvetica", "bold");
      doc.text("(a) Purpose.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const purposeText = `The Company is created for the following business purpose: ${answers.business_purpose || '[INSERT PURPOSE]'}`;
      const purposeLines = doc.splitTextToSize(purposeText, 165);
      purposeLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Powers
      doc.setFont("helvetica", "bold");
      doc.text("(b) Powers.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const powersText = "The Company shall have all of the powers of a limited liability company set forth under state law.";
      const powersLines = doc.splitTextToSize(powersText, 165);
      powersLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Duration
      doc.setFont("helvetica", "bold");
      doc.text("(c) Duration.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const durationText = `The Company's term shall commence upon the filing of Articles of Organization and all other such necessary materials with ${stateName || '[STATE]'}. The Company will operate until terminated as outlined in this Agreement unless: (i) A majority of the Members vote to dissolve the Company; (ii) No Member of the Company exists unless the business of the Company is continued in a manner permitted by state law; (iii) It becomes unlawful for any Member or the Company to continue in business; (iv) A judicial decree is entered that dissolves the Company; or (v) Any other event results in the dissolution of the Company under federal or ${stateName || '[STATE]'} law.`;
      const durationLines = doc.splitTextToSize(durationText, 165);
      durationLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight * 1.5;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // Members Section
      doc.setFont("helvetica", "bold");
      doc.text("Members", 15, y);
      y += lineHeight * 1.5;
      
      // Members list
      doc.setFont("helvetica", "bold");
      doc.text("(a) Members.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const membersIntroText = "The Members of the Company and their membership interest at the time of adoption of this Agreement are as follows:";
      const membersIntroLines = doc.splitTextToSize(membersIntroText, 165);
      membersIntroLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // List members
      members.forEach((member, index) => {
        const memberText = `${index + 1}. ${member.name || '[MEMBER NAME]'} - ${member.percentage || '[PERCENTAGE]'}%`;
        doc.text(memberText, 20, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Continue with more sections... (truncated for brevity)
      // Add remaining sections like Initial Contribution, Member Voting, etc.
      
      // Fiscal Year section
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFont("helvetica", "bold");
      doc.text("Accounting and Distributions", 15, y);
      y += lineHeight * 1.5;
      
      doc.setFont("helvetica", "bold");
      doc.text("Fiscal Year:", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const fiscalYearText = `The Company's fiscal year shall end on the last day of ${answers.fiscal_year_end || '[INSERT MONTH]'}.`;
      const fiscalYearLines = doc.splitTextToSize(fiscalYearText, 165);
      fiscalYearLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      
      // Add signature section
      doc.addPage();
      y = 20;
      
      doc.setFont("helvetica", "bold");
      doc.text("Signatures:", 15, y);
      y += lineHeight * 2;
      
      doc.setFont("helvetica", "normal");
      
      // Add signature lines for each member
      members.forEach((member, index) => {
        doc.text(`Member ${index + 1}:`, 15, y);
        y += lineHeight + 5;
        doc.text("____________________________", 15, y);
        y += lineHeight;
        doc.text(`${member.name || '[MEMBER NAME]'} (Printed Name)`, 15, y);
        y += lineHeight;
        doc.text("Date: ___________________", 15, y);
        y += lineHeight * 2;
      });
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `llc_operating_agreement_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("LLC Operating Agreement successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate LLC Operating Agreement");
      return null;
    }
  };

  const renderFormSummary = () => {
    const totalPercentage = members.reduce((sum, member) => sum + parseFloat(member.percentage || '0'), 0);
    
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">LLC Operating Agreement Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Formation Location</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country.split('|')[0]) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state ? getStateName(answers.country?.split('|')[0] || '', answers.state.split('|')[0]) : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Company Information</h4>
              <p><strong>Company Name:</strong> {answers.company_name || 'Not provided'}</p>
              <p><strong>Fiscal Year End:</strong> {answers.fiscal_year_end || 'Not provided'}</p>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-medium text-sm">Business Purpose</h4>
              <p>{answers.business_purpose || 'Not provided'}</p>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-medium text-sm">Members</h4>
              {members.map((member, index) => (
                <div key={index} className="mb-2">
                  <p><strong>{member.name || `Member ${index + 1}`}:</strong> {member.percentage || '0'}%</p>
                </div>
              ))}
              <p className="mt-2 text-sm text-gray-600">
                <strong>Total Ownership:</strong> {totalPercentage}%
                {totalPercentage !== 100 && (
                  <span className="text-red-500 ml-2">
                    (Warning: Total should equal 100%)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official LLC Operating Agreement.
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
          <CardTitle className="text-xl text-green-600">LLC Operating Agreement</CardTitle>
          <CardDescription>
            Review your LLC Operating Agreement details below before generating the final document.
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
              setMembers([{ name: '', percentage: '' }]);
            }}
          >
            Start Over
          </Button>
          <Button 
            onClick={generateLLCOperatingAgreementPDF}
          >
            Generate Operating Agreement
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
        onGenerate={generateLLCOperatingAgreementPDF}
        documentType="LLC Operating Agreement"
        isGenerating={isGeneratingPDF}
      />
    );
  }

  if (!currentSection) {
    return (
    <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
      <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        <CardContent className="text-center p-4">
          <p className="text-red-500">An error occurred. Please refresh the page.</p>
          <Button 
            onClick={() => {
              setCurrentSectionId('location_selection');
              setSectionHistory(['location_selection']);
            }}
            className="mt-4"
          >
            Start Over
          </Button>
        </CardContent>
      </Card>
    </div>
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
              onClick={() => window.open('/llc-operating-agreement-info', '_blank')}
              className="text-bright-orange-600 border-bright-orange-600 hover:bg-bright-orange-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Learn More About LLC Operating Agreements
            </Button>
          </div>
        )}
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

export default LLCOperatingAgreementForm;







