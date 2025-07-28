import { useState } from "react";
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
  type: 'text' | 'textarea' | 'confirmation' | 'date' | 'party' | 'witness' | 'agent' | 'notary' | 'select';
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

// Party interface (Declarant)
interface Party {
  name: string;
  address: string;
}

// Agent interface
interface Agent {
  name: string;
  address: string;
  phone: string;
  email: string;
}

// Witness interface
interface Witness {
  name: string;
  address: string;
}

// Notary interface
interface NotaryInfo {
  acknowledgmentDate: string;
  expirationDate: string;
}

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'location_selection': {
    id: 'location_selection',
    title: 'Location Selection',
    description: 'Select the country and state/province where this power of attorney will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'declarant_info'
  },
  'declarant_info': {
    id: 'declarant_info',
    title: 'Declarant Information',
    description: 'Enter your details as the person granting the power of attorney',
    questions: ['declarant_info'],
    nextSectionId: 'agent_info'
  },
  'agent_info': {
    id: 'agent_info',
    title: 'Agent Information',
    description: 'Enter details of your primary attorney-in-fact',
    questions: ['agent_info'],
    nextSectionId: 'alternate_agent_info'
  },
  'alternate_agent_info': {
    id: 'alternate_agent_info',
    title: 'Alternate Agent Information',
    description: 'Enter details of your alternate or successor agent',
    questions: ['alternate_agent_info'],
    nextSectionId: 'execution_details'
  },
  'execution_details': {
    id: 'execution_details',
    title: 'Execution Details',
    description: 'Specify the date of execution',
    questions: ['execution_date'],
    nextSectionId: 'witnesses'
  },
  'witnesses': {
    id: 'witnesses',
    title: 'Witness Information',
    description: 'Enter witness information for the power of attorney',
    questions: ['witness1_info', 'witness2_info'],
    nextSectionId: 'notary_info'
  },
  'notary_info': {
    id: 'notary_info',
    title: 'Notary Information',
    description: 'Enter notarization details',
    questions: ['notary_info'],
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
    text: 'Select the country where this power of attorney will be executed:',
    options: [], // Will be populated dynamically from the database
    defaultNextId: 'state'
  },
  'state': {
    id: 'state',
    type: 'select',
    text: 'Select the state/province where this power of attorney will be executed:',
    options: [], // Will be populated dynamically based on country selection
    defaultNextId: 'declarant_info'
  },
  'declarant_info': {
    id: 'declarant_info',
    type: 'party',
    text: 'Declarant Information:',
    defaultNextId: 'agent_info'
  },
  'agent_info': {
    id: 'agent_info',
    type: 'agent',
    text: 'Agent (Attorney-in-Fact) Information:',
    defaultNextId: 'alternate_agent_info'
  },
  'alternate_agent_info': {
    id: 'alternate_agent_info',
    type: 'agent',
    text: 'Alternate Agent Information:',
    defaultNextId: 'execution_date'
  },
  'execution_date': {
    id: 'execution_date',
    type: 'date',
    text: 'Date of Execution:',
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
    defaultNextId: 'notary_info'
  },
  'notary_info': {
    id: 'notary_info',
    type: 'notary',
    text: 'Notary Information:',
    defaultNextId: 'user_info_step'
  },
  'user_info_step': {
    id: 'user_info_step',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your General Power of Attorney based on your answers.',
  }
};

const GeneralPowerOfAttorneyForm = () => {
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [declarant, setDeclarant] = useState<Party>({ name: '', address: '' });
  const [agent, setAgent] = useState<Agent>({ name: '', address: '', phone: '', email: '' });
  const [alternateAgent, setAlternateAgent] = useState<Agent>({ name: '', address: '', phone: '', email: '' });
  const [witness1, setWitness1] = useState<Witness>({ name: '', address: '' });
  const [witness2, setWitness2] = useState<Witness>({ name: '', address: '' });
  const [notaryInfo, setNotaryInfo] = useState<NotaryInfo>({ acknowledgmentDate: '', expirationDate: '' });
  const [executionDate, setExecutionDate] = useState<Date>();
  
  const currentSection = sections[currentSectionId];

  const handleNext = () => {
    try {
      const nextSectionId = currentSection?.nextSectionId;
      
      if (!nextSectionId) {
        setShowUserInfo(true);
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

  const updateParty = (field: keyof Party, value: string) => {
    setDeclarant({ ...declarant, [field]: value });
  };

  const updateAgent = (type: 'agent' | 'alternate_agent', field: keyof Agent, value: string) => {
    if (type === 'agent') {
      setAgent({ ...agent, [field]: value });
    } else {
      setAlternateAgent({ ...alternateAgent, [field]: value });
    }
  };

  const updateWitness = (type: 'witness1' | 'witness2', field: keyof Witness, value: string) => {
    if (type === 'witness1') {
      setWitness1({ ...witness1, [field]: value });
    } else {
      setWitness2({ ...witness2, [field]: value });
    }
  };

  const updateNotaryInfo = (field: keyof NotaryInfo, value: string) => {
    setNotaryInfo({ ...notaryInfo, [field]: value });
  };
  
  const renderQuestionInput = (questionId: string) => {
    const question = questions[questionId];
    
    switch (question.type) {
      case 'date':
        return (
          <div className="mb-2">
            <Label className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !executionDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {executionDate ? format(executionDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white">
                <Calendar
                  mode="single"
                  selected={executionDate}
                  onSelect={setExecutionDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      case 'party':
        return (
          <div className="mb-2">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Full Name</Label>
                <Input
                  value={declarant.name}
                  onChange={(e) => updateParty('name', e.target.value)}
                  placeholder="Enter your full legal name"
                  className="text-black bg-white"
                />
              </div>
              <div>
                <Label className="text-sm">Residential Address</Label>
                <Textarea
                  value={declarant.address}
                  onChange={(e) => updateParty('address', e.target.value)}
                  placeholder="Enter your complete residential address"
                  className="text-black bg-white"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );
      case 'agent':
        const isMainAgent = questionId === 'agent_info';
        const agentData = isMainAgent ? agent : alternateAgent;
        const agentType = isMainAgent ? 'agent' : 'alternate_agent';
        
        return (
          <div className="mb-2">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Full Name</Label>
                <Input
                  value={agentData.name}
                  onChange={(e) => updateAgent(agentType as 'agent' | 'alternate_agent', 'name', e.target.value)}
                  placeholder="Enter agent's full name"
                  className="text-black bg-white"
                />
              </div>
              <div>
                <Label className="text-sm">Address</Label>
                <Textarea
                  value={agentData.address}
                  onChange={(e) => updateAgent(agentType as 'agent' | 'alternate_agent', 'address', e.target.value)}
                  placeholder="Enter agent's complete address"
                  className="text-black bg-white"
                  rows={3}
                />
              </div>
              <div>
                <Label className="text-sm">Phone Number</Label>
                <Input
                  value={agentData.phone}
                  onChange={(e) => updateAgent(agentType as 'agent' | 'alternate_agent', 'phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="text-black bg-white"
                />
              </div>
              <div>
                <Label className="text-sm">Email Address</Label>
                <Input
                  value={agentData.email}
                  onChange={(e) => updateAgent(agentType as 'agent' | 'alternate_agent', 'email', e.target.value)}
                  placeholder="Enter email address"
                  className="text-black bg-white"
                  type="email"
                />
              </div>
            </div>
          </div>
        );
      case 'witness':
        const isWitness2 = questionId === 'witness2_info';
        const witness = isWitness2 ? witness2 : witness1;
        const witnessType = isWitness2 ? 'witness2' : 'witness1';
        
        return (
          <div className="mb-2">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Full Legal Name</Label>
                <Input
                  value={witness.name}
                  onChange={(e) => updateWitness(witnessType as 'witness1' | 'witness2', 'name', e.target.value)}
                  placeholder="Enter witness full legal name"
                  className="text-black bg-white"
                />
              </div>
              <div>
                <Label className="text-sm">Address</Label>
                <Textarea
                  value={witness.address}
                  onChange={(e) => updateWitness(witnessType as 'witness1' | 'witness2', 'address', e.target.value)}
                  placeholder="Enter witness address"
                  className="text-black bg-white"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );
      case 'notary':
        return (
          <div className="mb-2">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Date of Acknowledgment</Label>
                <Input
                  value={notaryInfo.acknowledgmentDate}
                  onChange={(e) => updateNotaryInfo('acknowledgmentDate', e.target.value)}
                  placeholder="YYYY-MM-DD"
                  className="text-black bg-white"
                  type="date"
                />
              </div>
              <div>
                <Label className="text-sm">Notary Commission Expiration Date</Label>
                <Input
                  value={notaryInfo.expirationDate}
                  onChange={(e) => updateNotaryInfo('expirationDate', e.target.value)}
                  placeholder="YYYY-MM-DD"
                  className="text-black bg-white"
                  type="date"
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
          <div className="mb-2">
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
              <SelectTrigger className="mt-1 text-black w-full bg-white">
                <SelectValue placeholder={
                  questionId === 'state' && !answers.country 
                    ? "Please select a country first" 
                    : "Select an option"
                } />
              </SelectTrigger>
              <SelectContent className="bg-white">
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
    if (currentSectionId === 'declarant_info') {
      return declarant.name && declarant.address;
    }
    if (currentSectionId === 'agent_info') {
      return agent.name && agent.address && agent.phone && agent.email;
    }
    if (currentSectionId === 'alternate_agent_info') {
      return alternateAgent.name && alternateAgent.address && alternateAgent.phone && alternateAgent.email;
    }
    if (currentSectionId === 'execution_details') {
      return executionDate;
    }
    if (currentSectionId === 'witnesses') {
      return witness1.name && witness1.address && witness2.name && witness2.address;
    }
    if (currentSectionId === 'notary_info') {
      return notaryInfo.acknowledgmentDate && notaryInfo.expirationDate;
    }
    
    // Default validation
    return true;
  };

  const generateGeneralPowerOfAttorneyPDF = () => {
    setIsGeneratingPDF(true);
    try {
      console.log("Generating General Power of Attorney PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("General Power of Attorney", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Introduction paragraph
      const executionDateStr = executionDate ? format(executionDate, 'MMMM dd, yyyy') : '_______________';
      
      const introText = `I, ${declarant.name || '_______________'} ("Declarant"), residing at ${declarant.address || '_______________'} hereby appoint ${agent.name || '_______________'} ("Agent") of ${agent.address || '_______________'}, as my attorney-in-fact ("Agent") to exercise the powers and discretions described below.`;
      
      const introLines = doc.splitTextToSize(introText, 170);
      introLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Alternate Agent Section
      doc.setFont("helvetica", "normal");
      const alternateAgentText = `If the Agent is unable or unwilling to serve for any reason, I appoint ${alternateAgent.name || '_______________'} ("Alternate Agent"), of ${alternateAgent.address || '_______________'}, as my alternate or successor Agent, as the case may be to serve with the same powers and discretions.`;
      
      const alternateAgentLines = doc.splitTextToSize(alternateAgentText, 170);
      alternateAgentLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Governing Law Statement (add before powers section)
      const countryName = answers.country ? getCountryName(answers.country) : '_______________';
      const stateName = answers.state && answers.country ? getStateName(answers.country, answers.state) : '_______________';
      
      const governingLawText = `This Power of Attorney shall be governed by the laws of ${countryName}${answers.state ? ', ' + stateName : ''}.`;
      
      const governingLawLines = doc.splitTextToSize(governingLawText, 170);
      governingLawLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Powers Section
      doc.setFont("helvetica", "bold");
      doc.text("Powers and Authority.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const powersIntroText = `My Agent shall have full power and authority to act on my behalf. This power and authority shall authorize my Agent to manage and conduct all of my affairs and to exercise all of my legal rights and powers, including all rights and powers that I may acquire in the future. My Agent's powers shall include, but not be limited to, the power to:`;
      
      const powersIntroLines = doc.splitTextToSize(powersIntroText, 170);
      powersIntroLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 20;
      }
      
      // Specific Powers List
      const powers = [
        "Open, maintain or close bank accounts (including, but not limited to, checking accounts, savings accounts, and certificates of deposit), brokerage accounts, retirement plan accounts, and other similar accounts with financial institutions.",
        "Sell, exchange, buy, invest, or reinvest any assets or property owned by me. Such assets or property may include income producing or non-income producing assets and property.",
        "Purchase and/or maintain insurance and annuity contracts, including life insurance upon my life or the life of any other appropriate person.",
        "Take any and all legal steps necessary to collect any amount or debt owed to me, or to settle any claim, whether made against me or asserted on my behalf against any other person or entity.",
        "Enter into binding contracts on my behalf.",
        "Exercise all stock rights on my behalf as my proxy, including all rights with respect to stocks, bonds, debentures, commodities, options or other investments.",
        "Maintain and/or operate any business that I may own.",
        "Employ professional and business assistance, as may be appropriate, including attorneys, accountants, and real estate agents, for my personal or business affairs.",
        "Sell, convey, lease, mortgage, manage, insure, improve, repair, or perform any other act with respect to any of my property (now owned or later acquired) including, but not limited to, real estate and real estate rights (including the right to remove tenants and to recover possession). This includes the right to sell or encumber any homestead that I now own or may own in the future.",
        "Prepare, sign, and file documents with any governmental body or agency, including, but not limited to, authorization to make gifts from my assets to members of my family and to such other persons or charitable organizations with whom I have an established pattern of giving, to file state and federal gift tax returns, and to file a tax election to split gifts with my spouse, if any."
      ];
      
      powers.forEach((power, index) => {
        // Check if we need a new page
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
        
        const powerText = `${index + 1}. ${power}`;
        const powerLines = doc.splitTextToSize(powerText, 170);
        powerLines.forEach((line: string) => {
          doc.text(line, 15, y);
          y += lineHeight;
        });
        y += lineHeight * 0.5;
      });
      
      // Check if we need a new page for signatures
      if (y > pageHeight - 120) {
        doc.addPage();
        y = 20;
      }
      
      y += lineHeight;
      
      // Date and Signature Section
      doc.setFont("helvetica", "bold");
      doc.text("Execution.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${executionDateStr}`, 15, y);
      y += lineHeight + 10;
      
      // Declarant signature
      doc.text("Declarant (signature):", 15, y);
      y += lineHeight + 5;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${declarant.name || '_______________'} (Printed Name)`, 15, y);
      y += lineHeight + 10;
      
      // Agent contact info
      doc.text(`Agent (phone / email): ${agent.phone || '_______________'} / ${agent.email || '_______________'}`, 15, y);
      y += lineHeight + 5;
      doc.text(`Alternate Agent (phone / email): ${alternateAgent.phone || '_______________'} / ${alternateAgent.email || '_______________'}`, 15, y);
      y += lineHeight + 10;
      
      // Witness Section
      doc.setFont("helvetica", "bold");
      doc.text("Witnesses.", 15, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "normal");
      
      // Witness 1
      doc.text("Witness #1:", 15, y);
      y += lineHeight + 5;
      doc.text("Signature: ____________________________", 15, y);
      y += lineHeight;
      doc.text(`Full Legal Name: ${witness1.name || '_______________'}`, 15, y);
      y += lineHeight;
      doc.text(`Address: ${witness1.address || '_______________'}`, 15, y);
      y += lineHeight + 8;
      
      // Witness 2
      doc.text("Witness #2:", 15, y);
      y += lineHeight + 5;
      doc.text("Signature: ____________________________", 15, y);
      y += lineHeight;
      doc.text(`Full Legal Name: ${witness2.name || '_______________'}`, 15, y);
      y += lineHeight;
      doc.text(`Address: ${witness2.address || '_______________'}`, 15, y);
      y += lineHeight + 10;
      
      // Check if we need a new page for notary
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // Notary Section
      doc.setFont("helvetica", "bold");
      doc.text("Notary Acknowledgment.", 15, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "normal");
      const acknowledgmentDateStr = notaryInfo.acknowledgmentDate || '_______________';
      const expirationDateStr = notaryInfo.expirationDate || '_______________';
      
      const notaryText = `The foregoing instrument was acknowledged before me on ${acknowledgmentDateStr}, by ${declarant.name || '_______________'}, who is personally known to me or who has produced identification.`;
      
      const notaryLines = doc.splitTextToSize(notaryText, 170);
      notaryLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 5;
      
      doc.text("Signature of Notary taking acknowledgment:", 15, y);
      y += lineHeight + 5;
      doc.text("____________________________", 15, y);
      y += lineHeight + 5;
      doc.text(`Date of Expiration: ${expirationDateStr}`, 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `general_power_of_attorney_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("General Power of Attorney successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate General Power of Attorney");
      return null;
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  const renderFormSummary = () => {
    return (
      <div className="space-y-2 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">General Power of Attorney Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">General Information</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state && answers.country ? getStateName(answers.country, answers.state) : 'Not provided'}</p>
              <p><strong>Execution Date:</strong> {executionDate ? format(executionDate, 'dd/MM/yyyy') : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Declarant Information</h4>
              <p><strong>Name:</strong> {declarant.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {declarant.address || 'Not provided'}</p>
            </div>
              <div>
              <h4 className="font-medium text-sm">Agent Information</h4>
              <p><strong>Name:</strong> {agent.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {agent.address || 'Not provided'}</p>
              <p><strong>Phone:</strong> {agent.phone || 'Not provided'}</p>
              <p><strong>Email:</strong> {agent.email || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Alternate Agent Information</h4>
              <p><strong>Name:</strong> {alternateAgent.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {alternateAgent.address || 'Not provided'}</p>
              <p><strong>Phone:</strong> {alternateAgent.phone || 'Not provided'}</p>
              <p><strong>Email:</strong> {alternateAgent.email || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Execution Details</h4>
              <p><strong>Date of Execution:</strong> {executionDate ? format(executionDate, 'dd/MM/yyyy') : 'Not provided'}</p>
              <p><strong>Governing Law:</strong> {answers.country ? getCountryName(answers.country) + (answers.state ? ', ' + getStateName(answers.country, answers.state) : '') : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Witness Information</h4>
              <p><strong>Witness 1:</strong> {witness1.name || 'Not provided'}</p>
              <p><strong>Witness 2:</strong> {witness2.name || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Notary Information</h4>
              <p><strong>Acknowledgment Date:</strong> {notaryInfo.acknowledgmentDate || 'Not provided'}</p>
              <p><strong>Commission Expiration:</strong> {notaryInfo.expirationDate || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official General Power of Attorney.
          </p>
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
    <div className="bg-gray-50 min-h-0">
      <Card className="max-w-4xl mx-auto bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-green-600">General Power of Attorney</CardTitle>
          <CardDescription>
            Review your General Power of Attorney details below before generating the final document.
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
              setDeclarant({ name: '', address: '' });
              setAgent({ name: '', address: '', phone: '', email: '' });
              setAlternateAgent({ name: '', address: '', phone: '', email: '' });
              setWitness1({ name: '', address: '' });
              setWitness2({ name: '', address: '' });
              setNotaryInfo({ acknowledgmentDate: '', expirationDate: '' });
              setExecutionDate(undefined);
            }}
          >
            Start Over
          </Button>
          <Button 
            onClick={generateGeneralPowerOfAttorneyPDF}
          >
            Generate Power of Attorney
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
  }

  // Safety check for currentSection
  if (!currentSection) {
    return (
    <div className="bg-gray-50 min-h-0">
      <Card className="max-w-4xl mx-auto bg-white">
        <CardContent className="text-center p-4">
          <p className="text-red-500">An error occurred. Please refresh the page.</p>
          <Button 
            onClick={() => {              setCurrentSectionId('location_selection');
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

  if (currentSectionId === 'user_info_step') {
    return (
      <UserInfoStep
        onBack={handleBack}
        onGenerate={generateGeneralPowerOfAttorneyPDF}
        documentType="General Power of Attorney"
        isGenerating={isGeneratingPDF}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-0">
      <Card className="max-w-4xl mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-xl">{currentSection.title}</CardTitle>
        <CardDescription>
          {currentSection.description}
          <div className="mt-2 text-sm">
            Step {sectionHistory.length} of {Object.keys(sections).length}
          </div>
        </CardDescription>
        {currentSectionId === 'location_selection' && (
          <div className="mt-2">
            <Button
              variant="outline"
              onClick={() => window.open('/general-power-of-attorney-info', '_blank')}
              className="text-orange-600 border-orange-600 hover:bg-orange-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Learn More About General Power of Attorney
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

export default GeneralPowerOfAttorneyForm;








