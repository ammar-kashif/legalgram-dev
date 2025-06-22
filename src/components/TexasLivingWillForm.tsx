import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
  type: 'text' | 'select' | 'radio' | 'textarea' | 'confirmation' | 'date' | 'number' | 'email' | 'phone' | 'agent' | 'witness';
  text: string;
  options?: string[];
  nextQuestionId?: Record<string, string>;
  defaultNextId?: string;
}

// Health Care Agent interface
interface HealthCareAgent {
  name: string;
  address: string;
  phone: string;
  designation: string;
  relation: string;
}

// Witness interface
interface Witness {
  name: string;
  addressLine1: string;
  addressLine2: string;
}

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'declarant': {
    id: 'declarant',
    title: 'Declarant Information',
    description: 'Enter information about the person making this Living Will',
    questions: ['declarant_name', 'declarant_address_line1', 'declarant_address_line2'],
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
    nextSectionId: 'nutrition'
  },
  'nutrition': {
    id: 'nutrition',
    title: 'Nutrition and Hydration',
    description: 'Specify your preferences for artificially administered nutrition and hydration',
    questions: ['nutrition_preference'],
    nextSectionId: 'other_directions'
  },
  'other_directions': {
    id: 'other_directions',
    title: 'Other Directions',
    description: 'Additional instructions or preferences (optional)',
    questions: ['other_directions_text'],
    nextSectionId: 'witnesses'
  },
  'witnesses': {
    id: 'witnesses',
    title: 'Witness Information',
    description: 'Enter witness information for the document',
    questions: ['witness1_info', 'witness2_info'],
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
  'declarant_name': {
    id: 'declarant_name',
    type: 'text',
    text: 'Declarant\'s Full Name:',
    defaultNextId: 'declarant_address_line1'
  },
  'declarant_address_line1': {
    id: 'declarant_address_line1',
    type: 'text',
    text: 'Address (Line 1):',
    defaultNextId: 'declarant_address_line2'
  },
  'declarant_address_line2': {
    id: 'declarant_address_line2',
    type: 'text',
    text: 'Address (Line 2 - City/State/ZIP):',
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
    defaultNextId: 'nutrition_preference'
  },
  'nutrition_preference': {
    id: 'nutrition_preference',
    type: 'radio',
    text: 'Nutrition and Hydration Preference:',
    options: ['TO RECEIVE artificially administered nutrition and hydration', 'NOT TO RECEIVE artificially administered nutrition and hydration'],
    defaultNextId: 'other_directions_text'
  },
  'other_directions_text': {
    id: 'other_directions_text',
    type: 'textarea',
    text: 'Other Directions (Optional additional instructions):',
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
    text: 'Thank you for providing the information. We will generate your Texas Living Will based on your answers.',
  }
};

const TexasLivingWillForm = () => {
  const [currentSectionId, setCurrentSectionId] = useState<string>('declarant');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['declarant']);
  const [isComplete, setIsComplete] = useState(false);
  const [primaryAgent, setPrimaryAgent] = useState<HealthCareAgent>({ name: '', address: '', phone: '', designation: '', relation: '' });
  const [firstAlternate, setFirstAlternate] = useState<HealthCareAgent>({ name: '', address: '', phone: '', designation: '', relation: '' });
  const [secondAlternate, setSecondAlternate] = useState<HealthCareAgent>({ name: '', address: '', phone: '', designation: '', relation: '' });
  const [witness1, setWitness1] = useState<Witness>({ name: '', addressLine1: '', addressLine2: '' });
  const [witness2, setWitness2] = useState<Witness>({ name: '', addressLine1: '', addressLine2: '' });
  
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
              className="mt-1 text-black w-full"
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
              placeholder="Enter additional directions, preferences, or instructions"
              className="mt-1 text-black w-full"
              rows={4}
            />
          </div>
        );
      case 'radio':
        return (
          <div className="mb-4">
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
          <div className="mb-4">
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
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Address (Line 1)</Label>
                <Input
                  value={witness.addressLine1}
                  onChange={(e) => updateWitness(witnessType as 'witness1' | 'witness2', 'addressLine1', e.target.value)}
                  placeholder="Enter address line 1"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Address (Line 2)</Label>
                <Input
                  value={witness.addressLine2}
                  onChange={(e) => updateWitness(witnessType as 'witness1' | 'witness2', 'addressLine2', e.target.value)}
                  placeholder="Enter address line 2 (city, state, zip)"
                  className="text-black"
                />
              </div>
            </div>
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
    if (currentSectionId === 'declarant') {
      return answers.declarant_name && answers.declarant_address_line1 && answers.declarant_address_line2;
    }
    if (currentSectionId === 'primary_agent') {
      return primaryAgent.name && primaryAgent.address && primaryAgent.phone;
    }
    if (currentSectionId === 'first_alternate') {
      return firstAlternate.name && firstAlternate.address && firstAlternate.phone;
    }
    if (currentSectionId === 'second_alternate') {
      return secondAlternate.name && secondAlternate.address && secondAlternate.phone;
    }
    if (currentSectionId === 'nutrition') {
      return answers.nutrition_preference;
    }
    if (currentSectionId === 'other_directions') {
      // Other directions is optional, so always allow advance
      return true;
    }
    if (currentSectionId === 'witnesses') {
      return witness1.name && witness1.addressLine1 && witness2.name && witness2.addressLine1;
    }
    
    // Default validation
    return true;
  };

  const generateTexasLivingWillPDF = () => {
    try {
      console.log("Generating Texas Living Will PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("LIVING WILL", 105, 20, { align: "center" });
      doc.setFontSize(12);
      doc.text("(Texas Health and Safety Code §166.033)", 105, 28, { align: "center" });
      
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
      const declarantText = `I, ${answers.declarant_name || '________________'}, being of sound mind, willfully and voluntarily make known my desires that my dying shall not be artificially prolonged under the circumstances set forth below, and I hereby declare:`;
      
      const declarantLines = doc.splitTextToSize(declarantText, 170);
      declarantLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      doc.text(`Declarant's Address:`, 15, y);
      y += lineHeight;
      doc.text(`Line 1: ${answers.declarant_address_line1 || '_____________'}`, 15, y);
      y += lineHeight;
      doc.text(`Line 2: ${answers.declarant_address_line2 || '____________________________________________________'}`, 15, y);
      y += lineHeight + 5;
      
      // Appointment of Health Care Agent
      doc.setFont("helvetica", "bold");
      doc.text("APPOINTMENT OF HEALTH CARE AGENT", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const agentText = "I hereby appoint the following person as my agent to make health care decisions for me:";
      doc.text(agentText, 15, y);
      y += lineHeight + 3;
      
      // Primary Health Care Agent
      doc.setFont("helvetica", "bold");
      doc.text("Primary Health Care Agent:", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${primaryAgent.name || '____________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Address: ${primaryAgent.address || '______________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Phone: ${primaryAgent.phone || '____________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Designation: ${primaryAgent.designation || '_________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Relation (if any): ${primaryAgent.relation || '________________'}`, 15, y);
      y += lineHeight + 3;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // First Alternate Agent
      doc.setFont("helvetica", "bold");
      doc.text("First Alternate Agent:", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${firstAlternate.name || '____________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Address: ${firstAlternate.address || '______________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Phone: ${firstAlternate.phone || '____________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Designation: ${firstAlternate.designation || '_________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Relation (if any): ${firstAlternate.relation || '________________'}`, 15, y);
      y += lineHeight + 3;
      
      // Second Alternate Agent
      doc.setFont("helvetica", "bold");
      doc.text("Second Alternate Agent:", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${secondAlternate.name || '____________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Address: ${secondAlternate.address || '______________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Phone: ${secondAlternate.phone || '____________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Designation: ${secondAlternate.designation || '_________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Relation (if any): ${secondAlternate.relation || '________________'}`, 15, y);
      y += lineHeight + 5;
      
      // Check if we need a new page
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 20;
      }
      
      // Medical Treatment
      doc.setFont("helvetica", "bold");
      doc.text("MEDICAL TREATMENT", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const medicalText = "If I become incapable of giving informed consent, I direct my health care providers and others involved in my care to withdraw or withhold life-prolonging procedures under the circumstances I have indicated below by checking the appropriate lines. In making these decisions, I intend my agent to make decisions as I would make them under the circumstances if I had retained my capacity.";
      
      const medicalLines = doc.splitTextToSize(medicalText, 170);
      medicalLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // Nutrition and Hydration
      doc.setFont("helvetica", "bold");
      doc.text("NUTRITION AND HYDRATION", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const nutritionText = `I direct that I be given artificially administered nutrition and hydration, even if the effort to sustain life is futile or excessively burdensome to me.`;
      
      if (answers.nutrition_preference) {
        const selectedPreference = answers.nutrition_preference;
        doc.text(`☑ ${selectedPreference}`, 15, y);
      } else {
        doc.text(`☐ TO RECEIVE artificially administered nutrition and hydration`, 15, y);
        y += lineHeight;
        doc.text(`☐ NOT TO RECEIVE artificially administered nutrition and hydration`, 15, y);
      }
      y += lineHeight + 5;
      
      // Check if we need a new page
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 20;
      }
      
      // Other Directions
      doc.setFont("helvetica", "bold");
      doc.text("OTHER DIRECTIONS", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      if (answers.other_directions_text && answers.other_directions_text.trim()) {
        const directionsLines = doc.splitTextToSize(answers.other_directions_text, 170);
        directionsLines.forEach((line: string) => {
          // Check if we need a new page
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 15, y);
          y += lineHeight;
        });
      } else {
        doc.text("(This section is left blank to be filled in manually.)", 15, y);
        y += lineHeight;
      }
      y += lineHeight + 5;
      
      // Check if we need a new page for signatures
      if (y > pageHeight - 100) {
        doc.addPage();
        y = 20;
      }
      
      // Declarant Signature
      doc.setFont("helvetica", "bold");
      doc.text("DECLARANT SIGNATURE", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      doc.text("Declarant Signature: _____________________________________", 15, y);
      y += lineHeight + 3;
      doc.text("Date: __________________", 15, y);
      y += lineHeight + 3;
      
      doc.text("Declarant Address:", 15, y);
      y += lineHeight;
      doc.text(`Line 1: ${answers.declarant_address_line1 || '_____________________________________________________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Line 2: ${answers.declarant_address_line2 || '____________________________________________________'}`, 15, y);
      y += lineHeight + 10;
      
      // Check if we need a new page for witnesses
      if (y > pageHeight - 120) {
        doc.addPage();
        y = 20;
      }
      
      // Witnesses' Statement
      doc.setFont("helvetica", "bold");
      doc.text("WITNESSES' STATEMENT", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const witnessText = "The declarant has been personally known to me and I believe him or her to be of sound mind. I did not sign the declarant's signature above for or at the direction of the declarant. I am not a parent, spouse, or child of the declarant. I am not entitled to any portion of the declarant's estate or directly financially responsible for the declarant's medical care.";
      
      const witnessLines = doc.splitTextToSize(witnessText, 170);
      witnessLines.forEach((line: string) => {
        // Check if we need a new page
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // Witness 1
      doc.setFont("helvetica", "bold");
      doc.text("Witness 1", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${witness1.name || '___________________________'}`, 15, y);
      y += lineHeight;
      doc.text("Signature: _____________________________________", 15, y);
      y += lineHeight;
      doc.text("Date: __________________", 15, y);
      y += lineHeight;
      doc.text("Address:", 15, y);
      y += lineHeight;
      doc.text(`Line 1: ${witness1.addressLine1 || '_____________________________________________________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Line 2: ${witness1.addressLine2 || '____________________________________________________'}`, 15, y);
      y += lineHeight + 5;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // Witness 2
      doc.setFont("helvetica", "bold");
      doc.text("Witness 2", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${witness2.name || '___________________________'}`, 15, y);
      y += lineHeight;
      doc.text("Signature: _____________________________________", 15, y);
      y += lineHeight;
      doc.text("Date: __________________", 15, y);
      y += lineHeight;
      doc.text("Address:", 15, y);
      y += lineHeight;
      doc.text(`Line 1: ${witness2.addressLine1 || '_____________________________________________________________'}`, 15, y);
      y += lineHeight;
      doc.text(`Line 2: ${witness2.addressLine2 || '____________________________________________________'}`, 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `texas_living_will_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Texas Living Will successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Texas Living Will");
      return null;
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Texas Living Will Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Declarant Information</h4>
              <p><strong>Name:</strong> {answers.declarant_name || 'Not provided'}</p>
              <p><strong>Address Line 1:</strong> {answers.declarant_address_line1 || 'Not provided'}</p>
              <p><strong>Address Line 2:</strong> {answers.declarant_address_line2 || 'Not provided'}</p>
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
              <h4 className="font-medium text-sm">Nutrition and Hydration</h4>
              <p><strong>Preference:</strong> {answers.nutrition_preference || 'Not specified'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Witnesses</h4>
              <p><strong>Witness 1:</strong> {witness1.name || 'Not provided'}</p>
              <p><strong>Witness 2:</strong> {witness2.name || 'Not provided'}</p>
            </div>
          </div>
          
          {answers.other_directions_text && (
            <div className="mt-4">
              <h4 className="font-medium text-sm">Other Directions</h4>
              <p className="text-sm bg-gray-50 p-2 rounded">{answers.other_directions_text}</p>
            </div>
          )}
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Texas Living Will.
          </p>
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-green-600">Texas Living Will</CardTitle>
          <CardDescription>
            Review your Living Will details below before generating the final document.
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
              setSectionHistory(['declarant']);
              setCurrentSectionId('declarant');
              setIsComplete(false);
              setPrimaryAgent({ name: '', address: '', phone: '', designation: '', relation: '' });
              setFirstAlternate({ name: '', address: '', phone: '', designation: '', relation: '' });
              setSecondAlternate({ name: '', address: '', phone: '', designation: '', relation: '' });
              setWitness1({ name: '', addressLine1: '', addressLine2: '' });
              setWitness2({ name: '', addressLine1: '', addressLine2: '' });
            }}
          >
            Start Over
          </Button>
          <Button 
            onClick={generateTexasLivingWillPDF}
          >
            Generate Living Will
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Safety check for currentSection
  if (!currentSection) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="text-center p-8">
          <p className="text-red-500">An error occurred. Please refresh the page.</p>
          <Button 
            onClick={() => {
              setCurrentSectionId('declarant');
              setSectionHistory(['declarant']);
            }}
            className="mt-4"
          >
            Start Over
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
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
  );
};

export default TexasLivingWillForm;
