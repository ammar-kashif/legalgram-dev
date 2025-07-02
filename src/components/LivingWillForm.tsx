import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, Calendar as CalendarIcon, Plus, Trash2, FileText } from "lucide-react";
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
  type: 'text' | 'select' | 'radio' | 'textarea' | 'confirmation' | 'date' | 'number' | 'email' | 'phone' | 'agent' | 'physician' | 'witness';
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

// Health Care Agent interface
interface HealthCareAgent {
  name: string;
  address: string;
  phone: string;
  designation: string;
  relation: string;
}

// Physician interface
interface Physician {
  name: string;
  address: string;
  phone: string;
}

// Witness interface
interface Witness {
  name: string;
  addressLine1: string;
  addressLine2: string;
}

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'location_selection': {
    id: 'location_selection',
    title: 'Location Selection',
    description: 'Select the country and state/province where this Living Will will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'declarant'
  },
  'declarant': {
    id: 'declarant',
    title: 'Declarant Information',
    description: 'Enter information about the person making this Living Will',
    questions: ['declarant_name', 'declarant_address', 'declarant_city', 'declarant_zip'],
    nextSectionId: 'primary_agent'
  },
  'primary_agent': {
    id: 'primary_agent',
    title: 'Primary Health Care Agent',
    description: 'Designate your primary health care agent',
    questions: ['primary_agent_info'],
    nextSectionId: 'first_alternate'
  },
  'first_alternate': {
    id: 'first_alternate',
    title: 'First Alternate Agent',
    description: 'Designate your first alternate health care agent',
    questions: ['first_alternate_info'],
    nextSectionId: 'second_alternate'
  },
  'second_alternate': {
    id: 'second_alternate',
    title: 'Second Alternate Agent',
    description: 'Designate your second alternate health care agent',
    questions: ['second_alternate_info'],
    nextSectionId: 'physician'
  },  'physician': {
    id: 'physician',
    title: 'Primary Physician',
    description: 'Enter your primary physician information',
    questions: ['primary_physician_info'],
    nextSectionId: 'medical_treatment'
  },
  'medical_treatment': {
    id: 'medical_treatment',
    title: 'Medical Treatment',
    description: 'Specify your medical treatment preferences and instructions',
    questions: ['medical_treatment_preference'],
    nextSectionId: 'nutrition'
  },
  'nutrition': {
    id: 'nutrition',
    title: 'Nutrition and Hydration',
    description: 'Specify your preferences for artificial nutrition and hydration',
    questions: ['nutrition_preference'],
    nextSectionId: 'directions'
  },
  'directions': {
    id: 'directions',
    title: 'Other Directions',
    description: 'Additional medical or legal instructions/preferences',
    questions: ['other_directions'],
    nextSectionId: 'witnesses'
  },
  'witnesses': {
    id: 'witnesses',
    title: 'Witness Information',
    description: 'Enter witness information for the document',
    questions: ['witness1_info', 'witness2_info'],
    nextSectionId: 'additional_witness'
  },
  'additional_witness': {
    id: 'additional_witness',
    title: 'Additional Witness (Optional)',
    description: 'Required for residents of skilled nursing facility or if applicable',
    questions: ['additional_witness_info'],
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
    defaultNextId: 'declarant_name'
  },
  'declarant_name': {
    id: 'declarant_name',
    type: 'text',
    text: 'Declarant\'s Full Name:',
    defaultNextId: 'declarant_address'
  },
  'declarant_address': {
    id: 'declarant_address',
    type: 'text',
    text: 'Declarant\'s Address:',
    defaultNextId: 'declarant_city'
  },
  'declarant_city': {
    id: 'declarant_city',
    type: 'text',
    text: 'City:',
    defaultNextId: 'declarant_zip'
  },
  'declarant_zip': {
    id: 'declarant_zip',
    type: 'text',
    text: 'ZIP Code:',
    defaultNextId: 'primary_agent_info'
  },
  'primary_agent_info': {
    id: 'primary_agent_info',
    type: 'agent',
    text: 'Primary Health Care Agent Information:',
    defaultNextId: 'first_alternate_info'
  },
  'first_alternate_info': {
    id: 'first_alternate_info',
    type: 'agent',
    text: 'First Alternate Agent Information:',
    defaultNextId: 'second_alternate_info'
  },
  'second_alternate_info': {
    id: 'second_alternate_info',
    type: 'agent',
    text: 'Second Alternate Agent Information:',
    defaultNextId: 'primary_physician_info'
  },
  'primary_physician_info': {
    id: 'primary_physician_info',
    type: 'physician',
    text: 'Primary Physician Information:',
    defaultNextId: 'other_directions'
  },
  'other_directions': {
    id: 'other_directions',
    type: 'textarea',
    text: 'Other Directions (Additional medical or legal instructions/preferences):',
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
    defaultNextId: 'additional_witness_info'
  },  'additional_witness_info': {
    id: 'additional_witness_info',
    type: 'witness',
    text: 'Additional Witness Information (Optional):',
    defaultNextId: 'confirmation'
  },  'medical_treatment_preference': {
    id: 'medical_treatment_preference',
    type: 'radio',
    text: 'Medical Treatment Instructions - These instructions depict my commitment to decline medical treatment in the circumstances mentioned below: In the event that I am diagnosed with an incurable or irreversible physical or mental condition, from which there is no reasonable prospect of recovery, I hereby instruct my Health Agent to withhold or withdraw any medical interventions that serve solely to prolong the dying process. Such conditions shall include, but are not limited to: (a) a terminal illness; (b) a state of permanent unconsciousness; or (c) a minimally conscious state wherein I am permanently incapable of making informed decisions or communicating my preferences. I instruct that my Health Agent be confined to interventions aimed solely at ensuring my comfort and alleviating pain, including any discomfort that may result from the withholding or withdrawal of life-sustaining treatment. I acknowledge that the law does not obligate me to specify in advance the particular treatments to be limited or declined.',
    options: ['I agree to these medical treatment instructions', 'I do not agree to these medical treatment instructions'],
    defaultNextId: 'nutrition_preference'
  },
  'nutrition_preference': {
    id: 'nutrition_preference',
    type: 'radio',
    text: 'Nutrition and Hydration Preference:',
    options: ['TO RECEIVE artificially administered nutrition and hydration', 'NOT TO RECEIVE artificially administered nutrition and hydration'],
    defaultNextId: 'other_directions'
  },  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your Living Will based on your answers.',
  }
};

const LivingWillForm = () => {
  const navigate = useNavigate();
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [primaryAgent, setPrimaryAgent] = useState<HealthCareAgent>({ name: '', address: '', phone: '', designation: '', relation: '' });
  const [firstAlternate, setFirstAlternate] = useState<HealthCareAgent>({ name: '', address: '', phone: '', designation: '', relation: '' });
  const [secondAlternate, setSecondAlternate] = useState<HealthCareAgent>({ name: '', address: '', phone: '', designation: '', relation: '' });
  const [primaryPhysician, setPrimaryPhysician] = useState<Physician>({ name: '', address: '', phone: '' });
  const [witness1, setWitness1] = useState<Witness>({ name: '', addressLine1: '', addressLine2: '' });
  const [witness2, setWitness2] = useState<Witness>({ name: '', addressLine1: '', addressLine2: '' });
  const [additionalWitness, setAdditionalWitness] = useState<Witness>({ name: '', addressLine1: '', addressLine2: '' });
  
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

  const updateAgent = (type: 'primary' | 'first' | 'second', field: keyof HealthCareAgent, value: string) => {
    if (type === 'primary') {
      setPrimaryAgent({ ...primaryAgent, [field]: value });
    } else if (type === 'first') {
      setFirstAlternate({ ...firstAlternate, [field]: value });
    } else {
      setSecondAlternate({ ...secondAlternate, [field]: value });
    }
  };

  const updatePhysician = (field: keyof Physician, value: string) => {
    setPrimaryPhysician({ ...primaryPhysician, [field]: value });
  };

  const updateWitness = (type: 'witness1' | 'witness2' | 'additional', field: keyof Witness, value: string) => {
    if (type === 'witness1') {
      setWitness1({ ...witness1, [field]: value });
    } else if (type === 'witness2') {
      setWitness2({ ...witness2, [field]: value });
    } else {
      setAdditionalWitness({ ...additionalWitness, [field]: value });
    }
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
              placeholder="Enter additional directions, preferences, or instructions"
              className="mt-1 text-black w-full bg-white"
              rows={6}
            />
          </div>        );
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
        } else {
          return (
            <div className="mb-2">
              <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
                {question.text}
              </Label>
              <Select
                value={answers[questionId] || ''}
                onValueChange={(value) => handleAnswer(questionId, value)}
              >
                <SelectTrigger className="mt-1 text-black w-full bg-white">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {question.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }
      case 'radio':
        return (
          <div className="mb-2">
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
      case 'agent':
        const isFirst = questionId === 'first_alternate_info';
        const isSecond = questionId === 'second_alternate_info';
        const agent = isFirst ? firstAlternate : isSecond ? secondAlternate : primaryAgent;
        const agentType = isFirst ? 'first' : isSecond ? 'second' : 'primary';
        
        return (
          <div className="mb-2">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Name</Label>
                <Input
                  value={agent.name}
                  onChange={(e) => updateAgent(agentType as 'primary' | 'first' | 'second', 'name', e.target.value)}
                  placeholder="Enter full name"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Address</Label>
                <Input
                  value={agent.address}
                  onChange={(e) => updateAgent(agentType as 'primary' | 'first' | 'second', 'address', e.target.value)}
                  placeholder="Enter complete address"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Phone</Label>
                <Input
                  value={agent.phone}
                  onChange={(e) => updateAgent(agentType as 'primary' | 'first' | 'second', 'phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Designation</Label>
                <Input
                  value={agent.designation}
                  onChange={(e) => updateAgent(agentType as 'primary' | 'first' | 'second', 'designation', e.target.value)}
                  placeholder="Enter designation (e.g., Spouse, Adult Child, etc.)"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Relation (if any)</Label>
                <Input
                  value={agent.relation}
                  onChange={(e) => updateAgent(agentType as 'primary' | 'first' | 'second', 'relation', e.target.value)}
                  placeholder="Enter relationship to declarant"
                  className="text-black"
                />
              </div>
            </div>
          </div>
        );
      case 'physician':
        return (
          <div className="mb-2">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Name</Label>
                <Input
                  value={primaryPhysician.name}
                  onChange={(e) => updatePhysician('name', e.target.value)}
                  placeholder="Enter physician's full name"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Address</Label>
                <Input
                  value={primaryPhysician.address}
                  onChange={(e) => updatePhysician('address', e.target.value)}
                  placeholder="Enter physician's address"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Phone</Label>
                <Input
                  value={primaryPhysician.phone}
                  onChange={(e) => updatePhysician('phone', e.target.value)}
                  placeholder="Enter physician's phone number"
                  className="text-black"
                />
              </div>
            </div>
          </div>
        );
      case 'witness':
        const isWitness2 = questionId === 'witness2_info';
        const isAdditional = questionId === 'additional_witness_info';
        const witness = isWitness2 ? witness2 : isAdditional ? additionalWitness : witness1;
        const witnessType = isWitness2 ? 'witness2' : isAdditional ? 'additional' : 'witness1';
        
        return (
          <div className="mb-2">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
              {isAdditional && <span className="text-sm text-gray-500"> (Leave blank if not applicable)</span>}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Name</Label>
                <Input
                  value={witness.name}
                  onChange={(e) => updateWitness(witnessType as 'witness1' | 'witness2' | 'additional', 'name', e.target.value)}
                  placeholder="Enter witness name"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Address Line 1</Label>
                <Input
                  value={witness.addressLine1}
                  onChange={(e) => updateWitness(witnessType as 'witness1' | 'witness2' | 'additional', 'addressLine1', e.target.value)}
                  placeholder="Enter address line 1"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Address Line 2</Label>
                <Input
                  value={witness.addressLine2}
                  onChange={(e) => updateWitness(witnessType as 'witness1' | 'witness2' | 'additional', 'addressLine2', e.target.value)}
                  placeholder="Enter address line 2 (city, state, zip)"
                  className="text-black"
                />
              </div>
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
    return currentSection.questions.map(questionId => renderQuestionInput(questionId));
  };
  const canAdvance = () => {
    if (currentSectionId === 'confirmation') return true;
    
    // Special validation for different sections
    if (currentSectionId === 'location_selection') {
      return answers.country && answers.state;
    }
    if (currentSectionId === 'declarant') {
      return answers.declarant_name && answers.declarant_address && answers.declarant_city && answers.declarant_zip;
    }
    if (currentSectionId === 'primary_agent') {
      return primaryAgent.name && primaryAgent.address && primaryAgent.phone;
    }
    if (currentSectionId === 'first_alternate') {
      return firstAlternate.name && firstAlternate.address && firstAlternate.phone;
    }
    if (currentSectionId === 'second_alternate') {
      return secondAlternate.name && secondAlternate.address && secondAlternate.phone;
    }    if (currentSectionId === 'physician') {
      return primaryPhysician.name && primaryPhysician.address && primaryPhysician.phone;
    }    if (currentSectionId === 'medical_treatment') {
      return answers.medical_treatment_preference;
    }
    if (currentSectionId === 'nutrition') {
      return answers.nutrition_preference;
    }
    if (currentSectionId === 'directions') {
      // Other directions is optional, so always allow advance
      return true;
    }
    if (currentSectionId === 'witnesses') {
      return witness1.name && witness1.addressLine1 && witness2.name && witness2.addressLine1;
    }
    if (currentSectionId === 'additional_witness') {
      // Additional witness is optional, so always allow advance
      return true;
    }
    
    // Default validation
    return true;
  };  const generateLivingWillPDF = () => {
    try {
      console.log("Generating Living Will PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("LIVING WILL", 105, 20, { align: "center" });
      
      // Subtitle
      doc.setFontSize(12);
      doc.text("(Living Will Declaration)", 105, 30, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 45;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Statement of Directive
      doc.setFont("helvetica", "bold");
      doc.text("STATEMENT OF DIRECTIVE", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const selectedCountry = getCountryName(answers.country || '');
      const selectedState = getStateName(answers.country || '', answers.state || '');
      const declarantText = `I, ${answers.declarant_name || '________________'}, residing at ${answers.declarant_address || '_____________'}, ${selectedState}, ${selectedCountry}, ${answers.declarant_zip || '___________'}, being of full legal capacity and sound mind, do make this statement as a Directive to be followed in case I become permanently unable to make, or participate in making own medical decisions.`;
      
      const declarantLines = doc.splitTextToSize(declarantText, 170);
      declarantLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 5;      
      // Appointment of Health Care Agent
      doc.setFont("helvetica", "bold");
      doc.text("APPOINTMENT OF HEALTH CARE AGENT", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const agentText = "I hereby appoint the following person as my Health Care Agent (hereinafter referred as 'Health Agent') in case I become unable to make my own health care decision as mentioned in Clause 1";
      
      const agentLines = doc.splitTextToSize(agentText, 170);
      agentLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // Primary Health Care Agent
      doc.text(`Name: ${primaryAgent.name || '____________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Address: ${primaryAgent.address || '______________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Phone: ${primaryAgent.phone || '____________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Designation: ${primaryAgent.designation || '_________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Relation, if any: ${primaryAgent.relation || '________________'}`, 15, y);
      y += lineHeight + 3;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      const firstAlternateText = "In case I revoke my Health Agent authority, or if my agent is not willing or unable to undertake the responsibilities stipulated in this Living Will, I designate my First Alternate Agent:";
      const firstAlternateLines = doc.splitTextToSize(firstAlternateText, 170);
      firstAlternateLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // First Alternate Agent
      doc.setFont("helvetica", "bold");
      doc.text("First Alternate:", 15, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${firstAlternate.name || '____________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Address: ${firstAlternate.address || '______________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Phone: ${firstAlternate.phone || '____________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Designation: ${firstAlternate.designation || '_________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Relation, if any: ${firstAlternate.relation || '________________'}`, 15, y);
      y += lineHeight + 3;
      
      const secondAlternateText = "If I revoke the authority of my Health Agent of First Alternate, or neither is willing, or unable to undertake the duties stipulated in this Living Will, I designate my Second Alternate Agent:";
      const secondAlternateLines = doc.splitTextToSize(secondAlternateText, 170);
      secondAlternateLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // Second Alternate Agent
      doc.setFont("helvetica", "bold");
      doc.text("Second Alternate Agent:", 15, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${secondAlternate.name || '____________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Address: ${secondAlternate.address || '______________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Phone: ${secondAlternate.phone || '____________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Designation: ${secondAlternate.designation || '_________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Relation, if any: ${secondAlternate.relation || '________________'}`, 15, y);
      y += lineHeight + 5;
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // Medical Treatment Section
      doc.setFont("helvetica", "bold");
      doc.text("MEDICAL TREATMENT", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const medicalText = "These instructions depict my commitment to decline medical treatment in the circumstances mentioned below:";
      
      const medicalLines = doc.splitTextToSize(medicalText, 170);
      medicalLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      const medicalText1 = "In the event that I am diagnosed with an incurable or irreversible physical or mental condition, from which there is no reasonable prospect of recovery, I hereby instruct my Health Agent to withhold or withdraw any medical interventions that serve solely to prolong the dying process.";
      
      const medicalLines1 = doc.splitTextToSize(medicalText1, 170);
      medicalLines1.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      const medicalText2 = "Such conditions shall include, but are not limited to: (a) a terminal illness; (b) a state of permanent unconsciousness; or (c) a minimally conscious state wherein I am permanently incapable of making informed decisions or communicating my preferences.";
      
      const medicalLines2 = doc.splitTextToSize(medicalText2, 170);
      medicalLines2.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      const medicalText3 = "I instruct that my Health Agent be confined to interventions aimed solely at ensuring my comfort and alleviating pain, including any discomfort that may result from the withholding or withdrawal of life-sustaining treatment. I acknowledge that the law does not obligate me to specify in advance the particular treatments to be limited or declined.";
      
      const medicalLines3 = doc.splitTextToSize(medicalText3, 170);
      medicalLines3.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;      
      // Check if we need a new page
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 20;
      }
      
      // Nutrition and Hydration Section
      doc.setFont("helvetica", "bold");
      doc.text("NUTRITION AND HYDRATION", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const nutritionText = "If I have a condition state above, it is my preference TO RECEIVE artificially administered nutrition and hydration.";
      
      const nutritionLines = doc.splitTextToSize(nutritionText, 170);
      nutritionLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 5;
      
      // Primary Physician
      doc.setFont("helvetica", "bold");
      doc.text("PRIMARY PHYSICIAN", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      doc.text("I designate the following as my Primary Physician:", 15, y);
      y += lineHeight + 3;
      
      doc.text(`Name: ${primaryPhysician.name || '____________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Address: ${primaryPhysician.address || '______________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Phone: ${primaryPhysician.phone || '____________________'}`, 15, y);
      y += lineHeight + 3;
      
      const physicianText = "If a primary physician is not selected as per Clause 5, then I request that the applicable medical association rules be applied for the identification of my primary physician.";
      const physicianLines = doc.splitTextToSize(physicianText, 170);
      physicianLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 5;      
      // Other Directions
      doc.setFont("helvetica", "bold");
      doc.text("OTHER DIRECTIONS", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const otherDirectionsText = "These instructions represent the lawful exercise of my right to refuse medical treatment following the applicable laws. I intend that these directives be honoured and implemented unless I have revoked them through a subsequent written statement or by an unmistakable expression of a change in my wishes:";
      
      const otherDirectionsLines = doc.splitTextToSize(otherDirectionsText, 170);
      otherDirectionsLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Add space for additional directions
      if (answers.other_directions && answers.other_directions.trim()) {
        const directionsLines = doc.splitTextToSize(answers.other_directions, 170);
        directionsLines.forEach((line: string) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 15, y);
          y += lineHeight;
        });
        y += lineHeight;
      } else {
        // Add blank lines for manual completion
        for (let i = 0; i < 6; i++) {
          doc.text("______________________________________________________________________", 15, y);
          y += lineHeight;
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
        }
        y += lineHeight;
      }
      
      // Check if we need a new page for signatures
      if (y > pageHeight - 100) {
        doc.addPage();
        y = 20;
      }
      
      // Declarant Signature
      doc.text("Declarant Signature _____________________________________", 15, y);
      y += lineHeight + 10;
      doc.text("Date __________________", 15, y);
      y += lineHeight + 5;
      doc.text("Address _____________________________________________________________", 15, y);
      y += lineHeight;
      doc.text("____________________________________________________", 15, y);
      y += lineHeight + 10;      
      // Check if we need a new page for witnesses
      if (y > pageHeight - 120) {
        doc.addPage();
        y = 20;
      }
      
      // Statement of Witness
      doc.setFont("helvetica", "bold");
      doc.text("STATEMENT OF WITNESS:", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const witnessText = "I declare under the penalty of perjury under the applicable laws:";
      doc.text(witnessText, 15, y);
      y += lineHeight;
      
      const witnessItems = [
        "That I am over the age of eighteen (18) and competent to testify to the matters stated herein;",
        "That the Individual signed or acknowledged this advance directive in my presence;",
        "That the individual who signed or acknowledged this advance directive is personally known to me, or that his identity was proven to me through cogent evidence;",
        "That the individual appears to be of sound mind and not under any kind of duress or undue influence;",
        "That I am not the person appointed as a Health Agent by this advance directive",
        "That I am not the individual's Health Care provider, an employee of the Health Care provider, the operator of the community care facility, an employee of the an operator of a community care facility, the operator of a residential care facility for the elderly, nor an employee of an operator of a residential care facility for the elderly;"
      ];
      
      witnessItems.forEach((item) => {
        const itemLines = doc.splitTextToSize(item, 165);
        itemLines.forEach((line: string) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 20, y);
          y += lineHeight;
        });
        y += 2;
      });
      
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // Witness 1
      doc.text(`Name of Witness 1:  ${witness1.name || '___________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text("Signed _____________________________________", 15, y);
      y += lineHeight;
      doc.text("Date __________________", 120, y - lineHeight);
      y += lineHeight + 5;
      doc.text("Address _____________________________________________________________", 15, y);
      y += lineHeight;
      doc.text("____________________________________________________", 15, y);
      y += lineHeight + 10;
      
      // Witness 2
      doc.text(`Name of Witness 2: ${witness2.name || '_________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text("Signed _____________________________________", 15, y);
      y += lineHeight;
      doc.text("Date __________________", 120, y - lineHeight);
      y += lineHeight + 5;
      doc.text("Address _____________________________________________________________", 15, y);
      y += lineHeight;
      doc.text("____________________________________________________", 15, y);
      y += lineHeight + 10;
      
      // Check if we need a new page
      if (y > pageHeight - 100) {
        doc.addPage();
        y = 20;
      }
      
      // Additional Statement of Witness
      doc.setFont("helvetica", "bold");
      doc.text("ADDITIONAL STATEMENT OF WITNESS:", 15, y);
      y += lineHeight;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("At least one of the above witnesses must also sign the following declaration", 15, y);
      y += lineHeight;
      doc.text("(If you are a resident in a skilled working facility, the patient advocate or ombudsman must sign this statement)", 15, y);
      y += lineHeight + 3;
      doc.setFontSize(11);
      
      const additionalWitnessText = "I further declare under the applicable laws of perjury that I am not related to the individual executing this advance directive by blood, marriage, or adoption, and to the best of my knowledge, I am not entitled to any part of of the individual's estate upon their death under a will or operation of law";
      
      const additionalWitnessLines = doc.splitTextToSize(additionalWitnessText, 170);
      additionalWitnessLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;      });
      y += lineHeight + 5;
      
      doc.text("Witness Signature _____________________________________", 15, y);
      y += lineHeight;
      doc.text("Date __________________", 120, y - lineHeight);
      y += lineHeight + 5;
      doc.text("Address _____________________________________________________________", 15, y);
      y += lineHeight;
      doc.text("____________________________________________________", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `living_will_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Living Will successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Living Will");
      return null;
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-2 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Living Will Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Declarant Information</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state ? getStateName(answers.country || '', answers.state) : 'Not provided'}</p>
              <p><strong>Name:</strong> {answers.declarant_name || 'Not provided'}</p>
              <p><strong>Address:</strong> {answers.declarant_address || 'Not provided'}</p>
              <p><strong>City:</strong> {answers.declarant_city || 'Not provided'}</p>
              <p><strong>ZIP:</strong> {answers.declarant_zip || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Primary Health Care Agent</h4>
              <p><strong>Name:</strong> {primaryAgent.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {primaryAgent.address || 'Not provided'}</p>
              <p><strong>Phone:</strong> {primaryAgent.phone || 'Not provided'}</p>
              <p><strong>Designation:</strong> {primaryAgent.designation || 'Not provided'}</p>
              <p><strong>Relation:</strong> {primaryAgent.relation || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">First Alternate Agent</h4>
              <p><strong>Name:</strong> {firstAlternate.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {firstAlternate.address || 'Not provided'}</p>
              <p><strong>Phone:</strong> {firstAlternate.phone || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Second Alternate Agent</h4>
              <p><strong>Name:</strong> {secondAlternate.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {secondAlternate.address || 'Not provided'}</p>
              <p><strong>Phone:</strong> {secondAlternate.phone || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Primary Physician</h4>
              <p><strong>Name:</strong> {primaryPhysician.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {primaryPhysician.address || 'Not provided'}</p>
              <p><strong>Phone:</strong> {primaryPhysician.phone || 'Not provided'}</p>
            </div>
              <div>
              <h4 className="font-medium text-sm">Witnesses</h4>
              <p><strong>Witness 1:</strong> {witness1.name || 'Not provided'}</p>
              <p><strong>Witness 2:</strong> {witness2.name || 'Not provided'}</p>
              {additionalWitness.name && <p><strong>Additional:</strong> {additionalWitness.name}</p>}
            </div>
              <div>
              <h4 className="font-medium text-sm">Medical Treatment & Nutrition</h4>
              <p><strong>Medical Treatment:</strong> {answers.medical_treatment_preference || 'Not provided'}</p>
              <p><strong>Nutrition/Hydration:</strong> {answers.nutrition_preference || 'TO RECEIVE artificially administered nutrition and hydration'}</p>
            </div>
          </div>
          
          {answers.other_directions && (
            <div className="mt-2">
              <h4 className="font-medium text-sm">Other Directions</h4>
              <p className="text-sm bg-gray-50 p-2 rounded">{answers.other_directions}</p>
            </div>
          )}
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Living Will.
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
          <CardTitle className="text-xl text-green-600">Living Will</CardTitle>
          <CardDescription>
            Review your Living Will details below before generating the final document.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {renderFormSummary()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"            onClick={() => {
              setAnswers({});
              setSectionHistory(['location_selection']);
              setCurrentSectionId('location_selection');
              setIsComplete(false);
              setPrimaryAgent({ name: '', address: '', phone: '', designation: '', relation: '' });
              setFirstAlternate({ name: '', address: '', phone: '', designation: '', relation: '' });
              setSecondAlternate({ name: '', address: '', phone: '', designation: '', relation: '' });
              setPrimaryPhysician({ name: '', address: '', phone: '' });
              setWitness1({ name: '', addressLine1: '', addressLine2: '' });
              setWitness2({ name: '', addressLine1: '', addressLine2: '' });
              setAdditionalWitness({ name: '', addressLine1: '', addressLine2: '' });
            }}
          >
            Start Over
          </Button>
          <Button 
            onClick={generateLivingWillPDF}
          >
            Generate Living Will
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
          <p className="text-red-500">An error occurred. Please refresh the page.</p>          <Button 
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
                onClick={() => navigate('/living-will-info')}
                className="text-orange-600 border-orange-600 hover:bg-orange-50"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn More About Living Will
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

export default LivingWillForm;








