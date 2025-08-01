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
  type: 'text' | 'textarea' | 'confirmation' | 'date' | 'person' | 'witness' | 'select';
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

// Person interface (Executant, Attorney)
interface Person {
  name: string;
  address: string;
  signature?: string;
}

// Witness interface
interface Witness {
  name: string;
  address: string;
  nicNo: string;
}

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'location_selection': {
    id: 'location_selection',
    title: 'Location Selection',
    description: 'Select the country and state/province where this power of attorney will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'executant_info'
  },
  'executant_info': {
    id: 'executant_info',
    title: 'Executant Information',
    description: 'Enter details of the person granting the special power of attorney',
    questions: ['executant_info'],
    nextSectionId: 'attorney_info'
  },
  'attorney_info': {
    id: 'attorney_info',
    title: 'Special Attorney Information',
    description: 'Enter details of the person being appointed as special attorney',
    questions: ['attorney_info'],
    nextSectionId: 'matter_details'
  },
  'matter_details': {
    id: 'matter_details',
    title: 'Matter Details',
    description: 'Specify the legal matter or case details',
    questions: ['court_matter'],
    nextSectionId: 'execution'
  },
  'execution': {
    id: 'execution',
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
    text: 'Select the country where this power of attorney will be executed:',
    options: getAllCountries().map(country => `${country.id}|${country.name}`),
    defaultNextId: 'state'
  },
  'state': {
    id: 'state',
    type: 'select',
    text: 'Select the state/province where this power of attorney will be executed:',
    options: [], // Will be populated dynamically based on country selection
    defaultNextId: 'executant_info'
  },
  'executant_info': {
    id: 'executant_info',
    type: 'person',
    text: 'Executant Information:',
    defaultNextId: 'attorney_info'
  },
  'attorney_info': {
    id: 'attorney_info',
    type: 'person',
    text: 'Special Attorney Information:',
    defaultNextId: 'court_matter'
  },
  'court_matter': {
    id: 'court_matter',
    type: 'textarea',
    text: 'Legal Matter/Court Case Details:',
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
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your Special Power of Attorney based on your answers.',
  }
};

const SpecialPowerOfAttorneyForm = () => {
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [executant, setExecutant] = useState<Person>({ name: '', address: '', signature: '' });
  const [attorney, setAttorney] = useState<Person>({ name: '', address: '', signature: '' });
  const [witness1, setWitness1] = useState<Witness>({ name: '', address: '', nicNo: '' });
  const [witness2, setWitness2] = useState<Witness>({ name: '', address: '', nicNo: '' });
  const [executionDate, setExecutionDate] = useState<Date>();
  
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

  const updatePerson = (type: 'executant' | 'attorney', field: keyof Person, value: string) => {
    if (type === 'executant') {
      setExecutant({ ...executant, [field]: value });
    } else {
      setAttorney({ ...attorney, [field]: value });
    }
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
              placeholder="Enter the legal matter, court case details, or specific purpose for this power of attorney"
              className="mt-1 text-black w-full bg-white"
              rows={4}
            />
          </div>
        );
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
      case 'person':
        const isExecutantInfo = questionId === 'executant_info';
        const person = isExecutantInfo ? executant : attorney;
        const personType = isExecutantInfo ? 'executant' : 'attorney';
        
        return (
          <div className="mb-2">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Full Name</Label>
                <Input
                  value={person.name}
                  onChange={(e) => updatePerson(personType as 'executant' | 'attorney', 'name', e.target.value)}
                  placeholder="Enter full name"
                  className="text-black bg-white"
                />
              </div>
              <div>
                <Label className="text-sm">Address</Label>
                <Textarea
                  value={person.address}
                  onChange={(e) => updatePerson(personType as 'executant' | 'attorney', 'address', e.target.value)}
                  placeholder="Enter complete address"
                  className="text-black bg-white"
                  rows={3}
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
                <Label className="text-sm">Full Name</Label>
                <Input
                  value={witness.name}
                  onChange={(e) => updateWitness(witnessType as 'witness1' | 'witness2', 'name', e.target.value)}
                  placeholder="Enter witness full name"
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
                  rows={2}
                />
              </div>
              <div>
                <Label className="text-sm">NIC Number</Label>
                <Input
                  value={witness.nicNo}
                  onChange={(e) => updateWitness(witnessType as 'witness1' | 'witness2', 'nicNo', e.target.value)}
                  placeholder="Enter NIC number"
                  className="text-black bg-white"
                />
              </div>            </div>
          </div>
        );
      case 'select':
        let options = question.options || [];
        
        // Handle dynamic state options based on country selection
        if (questionId === 'state' && answers.country) {
          const countryId = answers.country.split('|')[0];
          const states = getStatesByCountry(parseInt(countryId));
          options = states.map(state => `${state.id}|${state.name}`);
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
                // Reset state when country changes
                if (questionId === 'country' && answers.state) {
                  handleAnswer('state', '');
                }
              }}
            >
              <SelectTrigger className="mt-1 text-black w-full bg-white">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-white">
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
          onBack={() => setCurrentSectionId('review')}
          onGenerate={generateSpecialPowerOfAttorneyPDF}
          isGenerating={isGeneratingPDF}
          documentType="Special Power of Attorney"
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
    if (currentSectionId === 'executant_info') {
      return executant.name && executant.address;
    }
    if (currentSectionId === 'attorney_info') {
      return attorney.name && attorney.address;
    }
    if (currentSectionId === 'matter_details') {
      return answers.court_matter;
    }
    if (currentSectionId === 'execution') {
      return executionDate;
    }
    if (currentSectionId === 'witnesses') {
      return witness1.name && witness1.address && witness1.nicNo && witness2.name && witness2.address && witness2.nicNo;
    }
    
    // Default validation
    return true;
  };

  const generateSpecialPowerOfAttorneyPDF = async (userInfo?: { name: string; email: string; phone: string }) => {
    setIsGeneratingPDF(true);
    try {
      console.log("Generating Special Power of Attorney PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("SPECIAL POWER OF ATTORNEY", 105, 20, { align: "center" });
      
      // Jurisdiction line
      const countryName = answers.country ? getCountryName(answers.country.split('|')[0]) : '';
      const stateName = answers.state ? getStateName(answers.country?.split('|')[0] || '', answers.state.split('|')[0]) : '';
      let jurisdictionText = '';
      if (countryName && stateName) {
        jurisdictionText = `(Under the laws of ${stateName}, ${countryName})`;
      } else if (countryName) {
        jurisdictionText = `(Under the laws of ${countryName})`;
      }
      
      if (jurisdictionText) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(jurisdictionText, 105, 27, { align: "center" });
      }
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = jurisdictionText ? 40 : 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Opening clause
      doc.setFont("helvetica", "bold");
      doc.text("KNOW ALL MEN BY THESE PRESENTS", 15, y);
      y += lineHeight * 1.5;
      
      // Introduction paragraph
      doc.setFont("helvetica", "normal");
      const introText = `THAT I, ${executant.name || '_______________'} do hereby appoint, constitute and nominate ${attorney.name || '_______________'} as my Special Attorney to do the following acts, deeds, things and matters in: ${answers.court_matter || '_______________'}`;
      
      const introLines = doc.splitTextToSize(introText, 170);
      introLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Powers and Authorities
      doc.setFont("helvetica", "bold");
      doc.text("Powers and Authorities:", 15, y);
      y += lineHeight * 1.5;
      
      doc.setFont("helvetica", "normal");
      
      // Power 1
      const power1Text = "1. To appear and act on my behalf in all Courts in the matter of " + (answers.court_matter || '_______________') + ".";
      const power1Lines = doc.splitTextToSize(power1Text, 165);
      power1Lines.forEach((line: string) => {
        doc.text(line, 20, y);
        y += lineHeight;
      });
      y += lineHeight * 0.5;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // Power 2
      const power2Text = "2. To submit criminal complaints, application and other documentation before concerned forum (if required) and to get registered the cases and peruse the same as per requirement.";
      const power2Lines = doc.splitTextToSize(power2Text, 165);
      power2Lines.forEach((line: string) => {
        doc.text(line, 20, y);
        y += lineHeight;
      });
      y += lineHeight * 0.5;
      
      // Power 3
      const power3Text = "3. To engage any advocate, file suits, reach compromise, respond and take necessary actions against any or all claims. To initiate, commence, carry on or defend all actions and other legal proceedings.";
      const power3Lines = doc.splitTextToSize(power3Text, 165);
      power3Lines.forEach((line: string) => {
        doc.text(line, 20, y);
        y += lineHeight;
      });
      y += lineHeight * 0.5;
      
      // Check if we need a new page
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 20;
      }
      
      // Power 4
      const power4Text = "4. To sign and verify plaints, written statements, replies, petitions of claims and objections, memorandum of appeal and petitions and applications of all kinds and to file them in any court or office.";
      const power4Lines = doc.splitTextToSize(power4Text, 165);
      power4Lines.forEach((line: string) => {
        doc.text(line, 20, y);
        y += lineHeight;
      });
      y += lineHeight * 0.5;
      
      // Power 5
      const power5Text = "5. To obtain court fee or stamp duty and to obtain refund of stamp duty or repayment of court fees. To apply to courts and offices for copies of documents and papers. To apply for the inspection of and to inspect records. To accept service of any summon, notice or writ issued by any court or officer against me.";
      const power5Lines = doc.splitTextToSize(power5Text, 165);
      power5Lines.forEach((line: string) => {
        doc.text(line, 20, y);
        y += lineHeight;
      });
      y += lineHeight * 0.5;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // Power 6
      const power6Text = "6. Specially to do each and every thing requisite for all the purposes stated above and the purposes which are omitted and are to be done on my part.";
      const power6Lines = doc.splitTextToSize(power6Text, 165);
      power6Lines.forEach((line: string) => {
        doc.text(line, 20, y);
        y += lineHeight;
      });
      y += lineHeight * 0.5;
      
      // Power 7
      const power7Text = "7. All the acts, deeds, matters and things done by the said Special Power of Attorney shall be construed as having been done by me and I do hereby agree to ratify and confirm the same.";
      const power7Lines = doc.splitTextToSize(power7Text, 165);
      power7Lines.forEach((line: string) => {
        doc.text(line, 20, y);
        y += lineHeight;
      });
      y += lineHeight * 0.5;
      
      // Power 8
      const power8Text = "8. That this Special Power of Attorney is made by me without any undue influence or coercion and in full knowledge of the facts and consequences of the same.";
      const power8Lines = doc.splitTextToSize(power8Text, 165);
      power8Lines.forEach((line: string) => {
        doc.text(line, 20, y);
        y += lineHeight;
      });
      y += lineHeight * 1.5;
      
      // Check if we need a new page for signatures
      if (y > pageHeight - 120) {
        doc.addPage();
        y = 20;
      }
      
      // Execution clause
      const executionDateStr = executionDate ? format(executionDate, 'MMMM dd, yyyy') : '_______________';
      const executionText = `WHEREOF I have put my hands to this Deed of Special Power of Attorney on ${executionDateStr}.`;
      
      const executionLines = doc.splitTextToSize(executionText, 170);
      executionLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight * 2;
      
      // Signatures Section
      doc.setFont("helvetica", "bold");
      doc.text("Signatures:", 15, y);
      y += lineHeight * 1.5;
      
      doc.setFont("helvetica", "normal");
      
      // Executant signature
      doc.text("Signature of Executant:", 15, y);
      y += lineHeight + 5;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${executant.name || '_______________'}`, 15, y);
      y += lineHeight * 2;
      
      // Attorney specimen signature
      doc.text("Specimen Signature of Attorney:", 15, y);
      y += lineHeight + 5;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${attorney.name || '_______________'}`, 15, y);
      y += lineHeight * 2;
      
      // Check if we need a new page for witnesses
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // Witnesses Section
      doc.setFont("helvetica", "bold");
      doc.text("Witnesses:", 15, y);
      y += lineHeight * 1.5;
      
      doc.setFont("helvetica", "normal");
      
      // Witness 1
      doc.text("Witness No. 1", 15, y);
      doc.text("Witness No. 2", 105, y);
      y += lineHeight + 5;
      
      doc.text("____________________________", 15, y);
      doc.text("____________________________", 105, y);
      y += lineHeight;
      
      doc.text(`Name: ${witness1.name || '_______________'}`, 15, y);
      doc.text(`Name: ${witness2.name || '_______________'}`, 105, y);
      y += lineHeight;
      
      // Witness addresses (split into multiple lines if needed)
      const witness1Address = witness1.address || '_______________';
      const witness2Address = witness2.address || '_______________';
      
      doc.text("Address:", 15, y);
      doc.text("Address:", 105, y);
      y += lineHeight;
      
      const witness1AddressLines = doc.splitTextToSize(witness1Address, 80);
      const witness2AddressLines = doc.splitTextToSize(witness2Address, 80);
      
      const maxAddressLines = Math.max(witness1AddressLines.length, witness2AddressLines.length);
      
      for (let i = 0; i < maxAddressLines; i++) {
        if (i < witness1AddressLines.length) {
          doc.text(witness1AddressLines[i], 15, y);
        }
        if (i < witness2AddressLines.length) {
          doc.text(witness2AddressLines[i], 105, y);
        }
        y += lineHeight;
      }
      
      y += lineHeight;
      
      doc.text(`NIC No. ${witness1.nicNo || '_______________'}`, 15, y);
      doc.text(`NIC No. ${witness2.nicNo || '_______________'}`, 105, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `special_power_of_attorney_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Special Power of Attorney successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Special Power of Attorney");
      return null;
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  const renderFormSummary = () => {
    return (
      <div className="space-y-2 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Special Power of Attorney Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">General Information</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country.split('|')[0]) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state ? getStateName(answers.country?.split('|')[0] || '', answers.state.split('|')[0]) : 'Not provided'}</p>
              <p><strong>Execution Date:</strong> {executionDate ? format(executionDate, 'dd/MM/yyyy') : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Executant Information</h4>
              <p><strong>Name:</strong> {executant.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {executant.address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Special Attorney Information</h4>
              <p><strong>Name:</strong> {attorney.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {attorney.address || 'Not provided'}</p>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-medium text-sm">Legal Matter Details</h4>
              <p><strong>Court Matter:</strong> {answers.court_matter || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Execution Details</h4>
              <p><strong>Date:</strong> {executionDate ? format(executionDate, 'dd/MM/yyyy') : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Witness 1</h4>
              <p><strong>Name:</strong> {witness1.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {witness1.address || 'Not provided'}</p>
              <p><strong>NIC:</strong> {witness1.nicNo || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Witness 2</h4>
              <p><strong>Name:</strong> {witness2.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {witness2.address || 'Not provided'}</p>
              <p><strong>NIC:</strong> {witness2.nicNo || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Special Power of Attorney.
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
          <CardTitle className="text-xl text-green-600">Special Power of Attorney</CardTitle>
          <CardDescription>
            Review your Special Power of Attorney details below before generating the final document.
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
              setExecutant({ name: '', address: '', signature: '' });
              setAttorney({ name: '', address: '', signature: '' });
              setWitness1({ name: '', address: '', nicNo: '' });
              setWitness2({ name: '', address: '', nicNo: '' });
              setExecutionDate(undefined);
            }}
          >
            Start Over
          </Button>
          <Button 
            onClick={() => generateSpecialPowerOfAttorneyPDF()}
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
        {/* Learn More button for first step only */}
        {currentSectionId === 'location_selection' && (
          <div className="mt-2">
            <Button 
              variant="outline" 
              onClick={() => window.open('/special-power-of-attorney-info', '_blank')}
              className="text-bright-orange-600 border-bright-orange-600 hover:bg-bright-orange-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Learn More About Special Power of Attorney
            </Button>
          </div>
        )}
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

export default SpecialPowerOfAttorneyForm;








