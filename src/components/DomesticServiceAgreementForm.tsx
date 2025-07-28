import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, Calendar as CalendarIcon } from "lucide-react";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
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
  type: 'text' | 'textarea' | 'confirmation' | 'date' | 'number' | 'party' | 'witness' | 'money' | 'select';
  text: string;
  options?: string[];
  nextQuestionId?: Record<string, string>;
  defaultNextId?: string;
}

// Master interface
interface Master {
  name: string;
  address: string;
  cnic: string;
}

// Servant interface
interface Servant {
  name: string;
  relationshipField: string;
  address: string;
  cnic: string;
}

// Witness interface
interface Witness {
  name: string;
  cnic: string;
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
    description: 'Select the country and state/province where this agreement will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'general_details'
  },
  'general_details': {
    id: 'general_details',
    title: 'General Details',
    description: 'Enter the basic details of the Domestic Service Agreement',
    questions: ['agreement_date', 'agreement_city'],
    nextSectionId: 'master_info'
  },
  'master_info': {
    id: 'master_info',
    title: 'Master Information',
    description: 'Enter details of the employer (Master)',
    questions: ['master_info'],
    nextSectionId: 'servant_info'
  },
  'servant_info': {
    id: 'servant_info',
    title: 'Servant Information',
    description: 'Enter details of the employee (Servant)',
    questions: ['servant_info'],
    nextSectionId: 'employment_details'
  },
  'employment_details': {
    id: 'employment_details',
    title: 'Employment Details',
    description: 'Specify employment location and compensation',
    questions: ['monthly_salary'],
    nextSectionId: 'witnesses'
  },
  'witnesses': {
    id: 'witnesses',
    title: 'Witness Information',
    description: 'Enter witness information for the agreement',
    questions: ['witness1_info', 'witness2_info'],
    nextSectionId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    title: 'Confirmation',
    description: 'Review and confirm your information',
    questions: ['confirmation'],
    nextSectionId: 'user_info'
  },
  'user_info': {
    id: 'user_info',
    title: 'Contact Information',
    description: 'Enter your contact information to generate the document',
    questions: []
  }
};

// Define the question flow
const questions: Record<string, Question> = {
  'country': {
    id: 'country',
    type: 'select',
    text: 'Select the country where this agreement will be executed:',
    options: [], // Will be populated dynamically from the database
    defaultNextId: 'state'
  },
  'state': {
    id: 'state',
    type: 'select',
    text: 'Select the state/province where this agreement will be executed:',
    options: [], // Will be populated dynamically based on country selection
    defaultNextId: 'agreement_date'
  },
  'agreement_date': {
    id: 'agreement_date',
    type: 'date',
    text: 'Date of Agreement:',
    defaultNextId: 'agreement_city'
  },
  'agreement_city': {
    id: 'agreement_city',
    type: 'text',
    text: 'City of Agreement:',
    defaultNextId: 'master_info'
  },
  'master_info': {
    id: 'master_info',
    type: 'party',
    text: 'Master (Employer) Information:',
    defaultNextId: 'servant_info'
  },
  'servant_info': {
    id: 'servant_info',
    type: 'party',
    text: 'Servant (Employee) Information:',
    defaultNextId: 'monthly_salary'
  },
  'monthly_salary': {
    id: 'monthly_salary',
    type: 'money',
    text: 'Monthly Salary / Compensation Amount:',
    defaultNextId: 'witness1_info'
  },
  'witness1_info': {
    id: 'witness1_info',
    type: 'witness',
    text: 'Witness 1 Information:',
    defaultNextId: 'witness2_info'
  },
  'witness2_info': {
    id: 'witness2_info',
    type: 'witness',
    text: 'Witness 2 Information:',
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your Domestic Service Agreement based on your answers.',
  }
};

const DomesticServiceAgreementForm = () => {
  const navigate = useNavigate();
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [master, setMaster] = useState<Master>({ name: '', address: '', cnic: '' });
  const [servant, setServant] = useState<Servant>({ name: '', relationshipField: '', address: '', cnic: '' });
  const [witness1, setWitness1] = useState<Witness>({ name: '', cnic: '' });
  const [witness2, setWitness2] = useState<Witness>({ name: '', cnic: '' });
  const [agreementDate, setAgreementDate] = useState<Date>();
  
  const currentSection = sections[currentSectionId];

  const handleNext = () => {
    try {
      if (currentSectionId === 'confirmation') {
        const nextSectionId = currentSection?.nextSectionId;
        if (nextSectionId) {
          setSectionHistory([...sectionHistory, nextSectionId]);
          setCurrentSectionId(nextSectionId);
        }
        return;
      }

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

  const updateMaster = (field: keyof Master, value: string) => {
    setMaster({ ...master, [field]: value });
  };

  const updateServant = (field: keyof Servant, value: string) => {
    setServant({ ...servant, [field]: value });
  };

  const updateWitness = (type: 'witness1' | 'witness2', field: keyof Witness, value: string) => {
    if (type === 'witness1') {
      setWitness1({ ...witness1, [field]: value });
    } else {
      setWitness2({ ...witness2, [field]: value });
    }
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
      case 'money':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Input
              id={questionId}
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Enter amount (e.g., 25000)"
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
              type="number"
              min="0"
              step="0.01"
            />
          </div>
        );
      case 'date':
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !agreementDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {agreementDate ? format(agreementDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white rounded-lg shadow-sm">
                <Calendar
                  mode="single"
                  selected={agreementDate}
                  onSelect={setAgreementDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      case 'party':
        const isMasterInfo = questionId === 'master_info';
        
        if (isMasterInfo) {
          return (
            <div className="mb-4">
              <Label className="block text-sm font-medium text-black mb-2">
                {question.text}
              </Label>
              <div className="border rounded-lg p-4 space-y-3">
                <div>
                  <Label className="text-sm">Name of Master</Label>
                  <Input
                    value={master.name}
                    onChange={(e) => updateMaster('name', e.target.value)}
                    placeholder="Enter master's full name"
                    className="text-black bg-white rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm">Full Residential Address (Master)</Label>
                  <Textarea
                    value={master.address}
                    onChange={(e) => updateMaster('address', e.target.value)}
                    placeholder="Enter complete residential address"
                    className="text-black bg-white rounded-lg shadow-sm"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-sm">CNIC No. (Master)</Label>
                  <Input
                    value={master.cnic}
                    onChange={(e) => updateMaster('cnic', e.target.value)}
                    placeholder="Enter CNIC number (e.g., 12345-6789012-3)"
                    className="text-black bg-white rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="mb-4">
              <Label className="block text-sm font-medium text-black mb-2">
                {question.text}
              </Label>
              <div className="border rounded-lg p-4 space-y-3">
                <div>
                  <Label className="text-sm">Name of Servant</Label>
                  <Input
                    value={servant.name}
                    onChange={(e) => updateServant('name', e.target.value)}
                    placeholder="Enter servant's full name"
                    className="text-black bg-white rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm">Relationship Field (son/daughter/wife of)</Label>
                  <Input
                    value={servant.relationshipField}
                    onChange={(e) => updateServant('relationshipField', e.target.value)}
                    placeholder="e.g., son of John Smith"
                    className="text-black bg-white rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm">Full Residential Address (Servant)</Label>
                  <Textarea
                    value={servant.address}
                    onChange={(e) => updateServant('address', e.target.value)}
                    placeholder="Enter complete residential address"
                    className="text-black bg-white rounded-lg shadow-sm"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-sm">CNIC No. (Servant)</Label>
                  <Input
                    value={servant.cnic}
                    onChange={(e) => updateServant('cnic', e.target.value)}
                    placeholder="Enter CNIC number (e.g., 12345-6789012-3)"
                    className="text-black bg-white rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>
          );
        }
      case 'witness':
        const isWitness2 = questionId === 'witness2_info';
        const witness = isWitness2 ? witness2 : witness1;
        const witnessType = isWitness2 ? 'witness2' : 'witness1';
        
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Name</Label>
                <Input
                  value={witness.name}
                  onChange={(e) => updateWitness(witnessType as 'witness1' | 'witness2', 'name', e.target.value)}
                  placeholder="Enter witness name"
                  className="text-black bg-white rounded-lg shadow-sm"
                />
              </div>
              <div>
                <Label className="text-sm">CNIC No.</Label>
                <Input
                  value={witness.cnic}
                  onChange={(e) => updateWitness(witnessType as 'witness1' | 'witness2', 'cnic', e.target.value)}
                  placeholder="Enter CNIC number (e.g., 12345-6789012-3)"
                  className="text-black bg-white rounded-lg shadow-sm"
                />
              </div>            </div>
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
    
    // Special validation for different sections
    if (currentSectionId === 'location_selection') {
      return answers.country && answers.state;
    }
    if (currentSectionId === 'general_details') {
      return agreementDate && answers.agreement_city;
    }
    if (currentSectionId === 'master_info') {
      return master.name && master.address && master.cnic;
    }
    if (currentSectionId === 'servant_info') {
      return servant.name && servant.relationshipField && servant.address && servant.cnic;
    }
    if (currentSectionId === 'employment_details') {
      return answers.monthly_salary;
    }
    if (currentSectionId === 'witnesses') {
      return witness1.name && witness1.cnic && witness2.name && witness2.cnic;
    }
    
    // Default validation
    return true;
  };  const generateDomesticServiceAgreementPDF = () => {
    try {
      console.log("Generating Domestic Service Agreement PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("DOMESTIC SERVICE AGREEMENT", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Helper function to add text with automatic page breaks
      const addText = (text: string, isBold = false, fontSize = 11, indent = 15) => {
        if (isBold) {
          doc.setFont("helvetica", "bold");
        } else {
          doc.setFont("helvetica", "normal");
        }
        doc.setFontSize(fontSize);
        
        const lines = doc.splitTextToSize(text, 170);
        lines.forEach((line: string) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, indent, y);
          y += lineHeight;
        });
        y += 3; // Extra spacing after sections
      };

      // Dynamic field values
      const agreementDateStr = agreementDate ? format(agreementDate, 'MMMM dd, yyyy') : '_______________';
      const agreementCity = answers.agreement_city || 'Islamabad';
      
      // Agreement Introduction
      addText(`This Agreement is made on this ${agreementDateStr}, at ${agreementCity}, by and between:`);
      
      addText(`${master.name || '[MASTER NAME]'}, residing at ${master.address || '[MASTER FULL RESIDENTIAL ADDRESS]'}, CNIC No. ${master.cnic || '[MASTER CNIC]'}, hereinafter referred to as the "MASTER",`);
      
      addText("AND", true, 11, 105);
      
      addText(`${servant.name || '[SERVANT NAME]'}, ${servant.relationshipField || 'son/daughter/wife of [RELATION]'}, residing at ${servant.address || '[SERVANT FULL RESIDENTIAL ADDRESS]'}, CNIC No. ${servant.cnic || '[SERVANT CNIC]'}, hereinafter referred to as the "SERVANT"`);
      
      addText(`Collectively referred to as the "PARTIES".`);
      
      // WHEREAS clauses
      addText("WHEREAS:", true, 12);
      addText("A. The Master requires domestic services at his/her residence and wishes to engage the services of the Servant on the terms and conditions hereinafter set forth;", false, 11, 20);
      addText("B. The Servant is willing to provide domestic services to the Master in accordance with the terms and conditions set forth in this Agreement;", false, 11, 20);
      addText("C. Both parties desire to set forth their respective rights, duties, and obligations in a written agreement;", false, 11, 20);
      
      addText("NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:", true);
      
      // 1. PURPOSE OF THE AGREEMENT
      addText("1. PURPOSE OF THE AGREEMENT", true, 12);
      addText("1.1 The Master hereby engages the Servant as a domestic worker to perform household duties and services as specified in this Agreement.", false, 11, 20);
      addText("1.2 The Servant agrees to provide domestic services with diligence, care, and professionalism in accordance with the terms and conditions set forth herein.", false, 11, 20);
      addText("1.3 In consideration of the services provided, the Master shall provide accommodation within the premises and compensation as detailed in this Agreement.", false, 11, 20);
      
      // 2. PLACE OF EMPLOYMENT
      addText("2. PLACE OF EMPLOYMENT", true, 12);
      addText("2.1 The primary place of employment shall be the Master's residence located at:", false, 11, 20);
      addText(`${master.address || '[MASTER FULL RESIDENTIAL ADDRESS]'}`, false, 11, 25);
      addText("2.2 The Servant may be required to perform services at other locations as reasonably directed by the Master, provided such locations are within reasonable proximity to the primary residence.", false, 11, 20);
      
      // 3. DUTIES AND RESPONSIBILITIES
      addText("3. DUTIES AND RESPONSIBILITIES OF THE SERVANT", true, 12);
      addText("3.1 The Servant shall perform the following duties with diligence and care:", false, 11, 20);
      addText("a) General cleaning and maintenance of the residence including but not limited to sweeping, mopping, dusting, and organizing;", false, 11, 25);
      addText("b) Washing, drying, and ironing of clothes and household linens;", false, 11, 25);
      addText("c) Washing dishes, utensils, and kitchen equipment;", false, 11, 25);
      addText("d) Cooking meals and food preparation as directed by the Master;", false, 11, 25);
      addText("e) Care and assistance for elderly family members, if applicable;", false, 11, 25);
      addText("f) Grocery shopping and running errands as instructed by the Master;", false, 11, 25);
      addText("g) Basic gardening and outdoor maintenance tasks;", false, 11, 25);
      addText("h) Any other reasonable domestic tasks assigned by the Master that are within the scope of domestic services;", false, 11, 25);
      addText("3.2 The Servant shall perform all duties with honesty, integrity, and respect for the Master's property and privacy.", false, 11, 20);
      addText("3.3 The Servant shall maintain the highest standards of cleanliness and hygiene in the performance of duties.", false, 11, 20);
      
      // 4. CODE OF CONDUCT
      addText("4. CODE OF CONDUCT", true, 12);
      addText("The Servant hereby agrees to abide by the following code of conduct:", false, 11, 15);
      addText("4.1 Maintain discipline, honesty, loyalty, and confidentiality in all matters pertaining to the household and family;", false, 11, 20);
      addText("4.2 Refrain from inviting or allowing any guest, visitor, or outsider to enter the premises without the prior written consent of the Master;", false, 11, 20);
      addText("4.3 Exercise reasonable care to prevent damage to the Master's property and refrain from engaging in any unlawful, illegal, or criminal activity;", false, 11, 20);
      addText("4.4 Not allow entry into the premises of any individual, including family members, who is involved in, charged with, or suspected of any criminal activity;", false, 11, 20);
      addText("4.5 Obtain prior permission from the Master before leaving the premises during working hours or for extended periods;", false, 11, 20);
      addText("4.6 Behave respectfully and courteously towards the Master and all family members at all times;", false, 11, 20);
      addText("4.7 Refrain from any form of misconduct, misbehavior, insubordination, or disrespectful conduct;", false, 11, 20);
      addText("4.8 Not use the Master's residential address for any personal purpose, including correspondence, legal documentation, or as proof of residence;", false, 11, 20);
      addText("4.9 Maintain strict confidentiality regarding all family matters, financial information, and personal affairs of the Master;", false, 11, 20);
      addText("4.10 Report any suspicious activities or security concerns to the Master immediately.", false, 11, 20);
      
      // 5. REMUNERATION AND BENEFITS
      addText("5. REMUNERATION AND BENEFITS", true, 12);
      addText(`5.1 The Master shall pay the Servant a monthly compensation package of ${answers.monthly_salary || '[AMOUNT]'} (${answers.monthly_salary || '[AMOUNT]'}/- only).`, false, 11, 20);
      addText("5.2 Payment shall be made on or before the 5th day of each calendar month for the preceding month's services.", false, 11, 20);
      addText("5.3 The compensation package includes:", false, 11, 20);
      addText("a) Monthly salary as specified above;", false, 11, 25);
      addText("b) Accommodation within a designated portion of the residence;", false, 11, 25);
      addText("c) Utilities including electricity and gas for the designated accommodation;", false, 11, 25);
      addText("d) Basic food and meals during working hours;", false, 11, 25);
      addText("5.4 Any additional benefits or bonuses shall be at the sole discretion of the Master.", false, 11, 20);
      addText("5.5 Deductions may be made from salary for damages caused by negligence or misconduct, subject to mutual agreement or legal requirements.", false, 11, 20);
      
      // 6. WORKING HOURS AND SCHEDULE
      addText("6. WORKING HOURS AND SCHEDULE", true, 12);
      addText("6.1 The Servant's standard working hours shall be from 7:00 AM to 7:00 PM, Monday through Sunday, with reasonable breaks for meals and rest.", false, 11, 20);
      addText("6.2 The Servant shall be entitled to one (1) full day off per week, to be mutually agreed upon by both parties.", false, 11, 20);
      addText("6.3 Overtime work may be required during special occasions, events, or emergencies, with reasonable additional compensation or time off in lieu.", false, 11, 20);
      addText("6.4 The Master shall provide reasonable notice for any changes to the regular schedule.", false, 11, 20);
      
      // 7. PROHIBITED CONDUCT
      addText("7. PROHIBITED CONDUCT", true, 12);
      addText("The following actions are strictly prohibited and may result in immediate termination of this Agreement:", false, 11, 15);
      addText("7.1 Theft, misuse, or unauthorized use of the Master's belongings, property, or assets;", false, 11, 20);
      addText("7.2 Physical violence, verbal abuse, or threatening behavior towards any member of the household;", false, 11, 20);
      addText("7.3 Use, possession, or being under the influence of alcohol, drugs, or other intoxicating substances on the premises;", false, 11, 20);
      addText("7.4 Bringing unauthorized persons onto the premises without prior permission;", false, 11, 20);
      addText("7.5 Misrepresentation of identity, use of false documents, or providing false information;", false, 11, 20);
      addText("7.6 Negligent or intentional damage to property or belongings;", false, 11, 20);
      addText("7.7 Disclosure of confidential information about the household or family;", false, 11, 20);
      addText("7.8 Engaging in any illegal or criminal activity on or off the premises;", false, 11, 20);
      addText("7.9 Insubordination or refusal to perform assigned duties without reasonable cause.", false, 11, 20);
      
      // 8. DURATION AND TERMINATION
      addText("8. DURATION AND TERMINATION", true, 12);
      addText("8.1 This Agreement shall commence on the date of execution and shall remain in effect for a period of two (2) years from the date of signing.", false, 11, 20);
      addText("8.2 This Agreement may be renewed for additional periods upon mutual written consent of both parties.", false, 11, 20);
      addText("8.3 Either party may terminate this Agreement by providing thirty (30) days written notice to the other party, or by payment of salary in lieu of notice.", false, 11, 20);
      addText("8.4 The Master reserves the right to terminate this Agreement immediately without notice in case of:", false, 11, 20);
      addText("a) Serious misconduct or breach of the code of conduct;", false, 11, 25);
      addText("b) Breach of trust or confidentiality;", false, 11, 25);
      addText("c) Violation of any material term or condition of this Agreement;", false, 11, 25);
      addText("d) Criminal activity or behavior that endangers the safety of the household;", false, 11, 25);
      addText("8.5 Upon termination, the Servant shall return all property belonging to the Master and vacate the premises within seven (7) days.", false, 11, 20);
      addText("8.6 All accrued but unpaid compensation shall be settled within seven (7) days of termination, subject to any lawful deductions.", false, 11, 20);
      
      // 9. HEALTH AND SAFETY
      addText("9. HEALTH AND SAFETY", true, 12);
      addText("9.1 The Servant shall maintain good health and inform the Master of any contagious illness or medical condition that may affect work performance.", false, 11, 20);
      addText("9.2 The Master shall provide a safe working environment and necessary safety equipment where applicable.", false, 11, 20);
      addText("9.3 The Servant shall follow all safety procedures and use protective equipment as directed.", false, 11, 20);
      addText("9.4 In case of work-related injury, the Master shall provide necessary medical assistance, and both parties shall comply with applicable labor laws.", false, 11, 20);
      
      // 10. MISCELLANEOUS PROVISIONS
      addText("10. MISCELLANEOUS PROVISIONS", true, 12);
      addText("10.1 This Agreement constitutes the entire understanding between the parties and supersedes all prior agreements, understandings, or negotiations.", false, 11, 20);
      addText("10.2 Any modification or amendment to this Agreement must be in writing and signed by both parties.", false, 11, 20);
      addText("10.3 If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.", false, 11, 20);
      addText(`10.4 This Agreement shall be governed by and construed in accordance with the laws of ${answers.country ? getCountryName(answers.country) : 'the applicable jurisdiction'}.`, false, 11, 20);
      addText(`10.5 Any disputes arising from this Agreement shall be resolved through negotiation, mediation, or, if necessary, through the competent courts of ${answers.country ? getCountryName(answers.country) : 'the applicable jurisdiction'}.`, false, 11, 20);
      addText("10.6 Both parties acknowledge that they have read, understood, and voluntarily entered into this Agreement.", false, 11, 20);
      
      // 11. ACKNOWLEDGMENT
      addText("11. ACKNOWLEDGMENT", true, 12);
      addText("The Servant acknowledges that:", false, 11, 15);
      addText("11.1 He/she has read, understood, and voluntarily agreed to all terms and conditions of this Agreement;", false, 11, 20);
      addText("11.2 He/she has received a copy of this Agreement for his/her records;", false, 11, 20);
      addText("11.3 He/she understands the consequences of breach of this Agreement;", false, 11, 20);
      addText("11.4 He/she enters into this Agreement without any coercion, duress, or undue influence;", false, 11, 20);
      addText("11.5 All information provided is true and accurate to the best of his/her knowledge.", false, 11, 20);
      
      // Add some space before signatures
      y += 15;
      
      // Check if we need a new page for signatures
      if (y > pageHeight - 200) {
        doc.addPage();
        y = 20;
      }
      
      // IN WITNESS WHEREOF
      addText("IN WITNESS WHEREOF, the parties hereto have executed this Domestic Service Agreement on the day, month, and year first written above in the presence of the undersigned witnesses.", true);
      
      y += 10;
      
      // SIGNATURES
      addText("SIGNATURES:", true, 12);
      
      // Master signature
      addText("MASTER (EMPLOYER):", true, 11);
      y += 5;
      doc.text(`Name: ${master.name || '____________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text("Signature: _________________________", 15, y);
      y += lineHeight + 5;
      doc.text(`Date: ${agreementDateStr}`, 15, y);
      y += lineHeight + 5;
      doc.text(`CNIC No.: ${master.cnic || '____________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text(`Address: ${master.address || '____________________________'}`, 15, y);
      y += lineHeight + 15;
      
      // Servant signature
      addText("SERVANT (EMPLOYEE):", true, 11);
      y += 5;
      doc.text(`Name: ${servant.name || '____________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text("Signature: _________________________", 15, y);
      y += lineHeight + 5;
      doc.text(`Date: ${agreementDateStr}`, 15, y);
      y += lineHeight + 5;
      doc.text(`CNIC No.: ${servant.cnic || '____________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text(`Address: ${servant.address || '____________________________'}`, 15, y);
      y += lineHeight + 15;
      
      // Witness signatures
      addText("WITNESSES:", true, 11);
      y += 5;
      
      doc.text("Witness 1:", 15, y);
      y += lineHeight + 5;
      doc.text(`Name: ${witness1.name || '__________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text("Signature: _______________________", 15, y);
      y += lineHeight + 5;
      doc.text(`Date: ${agreementDateStr}`, 15, y);
      y += lineHeight + 5;
      doc.text(`CNIC No.: ${witness1.cnic || '__________________________'}`, 15, y);
      y += lineHeight + 15;
      
      doc.text("Witness 2:", 15, y);
      y += lineHeight + 5;
      doc.text(`Name: ${witness2.name || '__________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text("Signature: _______________________", 15, y);
      y += lineHeight + 5;
      doc.text(`Date: ${agreementDateStr}`, 15, y);
      y += lineHeight + 5;
      doc.text(`CNIC No.: ${witness2.cnic || '__________________________'}`, 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `domestic_service_agreement_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Domestic Service Agreement successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Domestic Service Agreement");
      return null;
    }
  };  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Comprehensive Domestic Service Agreement Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">General Details</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state && answers.country ? getStateName(answers.country, answers.state) : 'Not provided'}</p>
              <p><strong>Agreement Date:</strong> {agreementDate ? format(agreementDate, 'dd/MM/yyyy') : 'Not provided'}</p>
              <p><strong>City:</strong> {answers.agreement_city || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Master (Employer) Information</h4>
              <p><strong>Name:</strong> {master.name || 'Not provided'}</p>
              <p><strong>CNIC:</strong> {master.cnic || 'Not provided'}</p>
              <p><strong>Address:</strong> {master.address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Servant (Employee) Information</h4>
              <p><strong>Name:</strong> {servant.name || 'Not provided'}</p>
              <p><strong>Relationship:</strong> {servant.relationshipField || 'Not provided'}</p>
              <p><strong>CNIC:</strong> {servant.cnic || 'Not provided'}</p>
              <p><strong>Address:</strong> {servant.address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Employment Terms</h4>
              <p><strong>Monthly Salary:</strong> {answers.monthly_salary || 'Not provided'}</p>
              <p><strong>Payment Date:</strong> 5th of each month</p>
              <p><strong>Duration:</strong> 2 years from signing date</p>
              <p><strong>Notice Period:</strong> 30 days or payment in lieu</p>
              <p><strong>Working Hours:</strong> 7:00 AM to 7:00 PM daily</p>
              <p><strong>Weekly Off:</strong> 1 full day (to be mutually agreed)</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Benefits Included</h4>
              <p><strong>Accommodation:</strong> Designated portion of residence</p>
              <p><strong>Utilities:</strong> Electricity and gas included</p>
              <p><strong>Meals:</strong> Basic food during working hours</p>
              <p><strong>Location:</strong> {master.address || 'Same as Master\'s Address'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Witness Information</h4>
              <p><strong>Witness 1:</strong> {witness1.name || 'Not provided'} (CNIC: {witness1.cnic || 'Not provided'})</p>
              <p><strong>Witness 2:</strong> {witness2.name || 'Not provided'} (CNIC: {witness2.cnic || 'Not provided'})</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Key Agreement Features:</h4>
            <ul className="text-sm space-y-1">
              <li>• Comprehensive 11-section legal agreement with detailed terms</li>
              <li>• Complete duties and responsibilities specification</li>
              <li>• Detailed code of conduct and prohibited activities</li>
              <li>• Health and safety provisions</li>
              <li>• Clear termination and notice procedures</li>
              <li>• Legal compliance with applicable domestic service laws</li>
              <li>• Professional witness attestation</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This comprehensive agreement will serve as your official Domestic Service Agreement with 
            full legal terms, conditions, and protections for both parties.
          </p>
        </div>
      </div>
    );
  };

  // Show UserInfoStep after confirmation
  if (currentSectionId === 'user_info') {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-600">Domestic Service Agreement</CardTitle>
            <CardDescription>
              Enter your contact information to generate your document
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserInfoStep
              onBack={handleBack}
              onGenerate={generateDomesticServiceAgreementPDF}
              documentType="Domestic Service Agreement"
              isGenerating={isGeneratingPDF}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-600">Domestic Service Agreement</CardTitle>
            <CardDescription>
              Review your Domestic Service Agreement details below before generating the final document.
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
                setMaster({ name: '', address: '', cnic: '' });
                setServant({ name: '', relationshipField: '', address: '', cnic: '' });
                setWitness1({ name: '', cnic: '' });
                setWitness2({ name: '', cnic: '' });
                setAgreementDate(undefined);
              }}
            >
              Start Over
            </Button>
            <Button 
              onClick={generateDomesticServiceAgreementPDF}
            >
              Generate Agreement
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Safety check for currentSection
  if (!currentSection) {
    return (
    <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
      <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        <CardContent className="text-center p-4">
          <p className="text-red-500">An error occurred. Please refresh the page.</p>          <Button 
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

export default DomesticServiceAgreementForm;







