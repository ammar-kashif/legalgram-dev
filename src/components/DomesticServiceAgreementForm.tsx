import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, Calendar as CalendarIcon } from "lucide-react";
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
  type: 'text' | 'textarea' | 'confirmation' | 'date' | 'number' | 'party' | 'witness' | 'money';
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

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
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
    questions: ['confirmation']
  }
};

// Define the question flow
const questions: Record<string, Question> = {
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
  const [currentSectionId, setCurrentSectionId] = useState<string>('general_details');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['general_details']);
  const [isComplete, setIsComplete] = useState(false);
  const [master, setMaster] = useState<Master>({ name: '', address: '', cnic: '' });
  const [servant, setServant] = useState<Servant>({ name: '', relationshipField: '', address: '', cnic: '' });
  const [witness1, setWitness1] = useState<Witness>({ name: '', cnic: '' });
  const [witness2, setWitness2] = useState<Witness>({ name: '', cnic: '' });
  const [agreementDate, setAgreementDate] = useState<Date>();
  
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
              className="mt-1 text-black w-full"
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
              className="mt-1 text-black w-full"
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
              <PopoverContent className="w-auto p-0">
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
                    className="text-black"
                  />
                </div>
                <div>
                  <Label className="text-sm">Full Residential Address (Master)</Label>
                  <Textarea
                    value={master.address}
                    onChange={(e) => updateMaster('address', e.target.value)}
                    placeholder="Enter complete residential address"
                    className="text-black"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-sm">CNIC No. (Master)</Label>
                  <Input
                    value={master.cnic}
                    onChange={(e) => updateMaster('cnic', e.target.value)}
                    placeholder="Enter CNIC number (e.g., 12345-6789012-3)"
                    className="text-black"
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
                    className="text-black"
                  />
                </div>
                <div>
                  <Label className="text-sm">Relationship Field (son/daughter/wife of)</Label>
                  <Input
                    value={servant.relationshipField}
                    onChange={(e) => updateServant('relationshipField', e.target.value)}
                    placeholder="e.g., son of John Smith"
                    className="text-black"
                  />
                </div>
                <div>
                  <Label className="text-sm">Full Residential Address (Servant)</Label>
                  <Textarea
                    value={servant.address}
                    onChange={(e) => updateServant('address', e.target.value)}
                    placeholder="Enter complete residential address"
                    className="text-black"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-sm">CNIC No. (Servant)</Label>
                  <Input
                    value={servant.cnic}
                    onChange={(e) => updateServant('cnic', e.target.value)}
                    placeholder="Enter CNIC number (e.g., 12345-6789012-3)"
                    className="text-black"
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
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">CNIC No.</Label>
                <Input
                  value={witness.cnic}
                  onChange={(e) => updateWitness(witnessType as 'witness1' | 'witness2', 'cnic', e.target.value)}
                  placeholder="Enter CNIC number (e.g., 12345-6789012-3)"
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
  };

  const generateDomesticServiceAgreementPDF = () => {
    try {
      console.log("Generating Domestic Service Agreement PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Domestic Service Agreement", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Introduction paragraph
      const agreementDateStr = agreementDate ? format(agreementDate, 'MMMM dd, yyyy') : '_______________';
      const agreementCity = answers.agreement_city || '_______________';
      
      const introText = `This Domestic Service Agreement ("Agreement") is entered into on ${agreementDateStr}, in the city of ${agreementCity}, by and between ${master.name || '_______________'} ("Master") and ${servant.name || '_______________'}, ${servant.relationshipField || '_______________'} ("Servant").`;
      
      const introLines = doc.splitTextToSize(introText, 170);
      introLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Master Information Section
      doc.setFont("helvetica", "bold");
      doc.text("Master (Employer) Information.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const masterInfoText = `The Master hereby agrees to employ the Servant under the terms specified in this Agreement. Master's details: Name: ${master.name || '_______________'}, CNIC: ${master.cnic || '_______________'}, Address: ${master.address || '_______________________________________________'}.`;
      
      const masterInfoLines = doc.splitTextToSize(masterInfoText, 170);
      masterInfoLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Servant Information Section
      doc.setFont("helvetica", "bold");
      doc.text("Servant (Employee) Information.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const servantInfoText = `The Servant hereby agrees to work for the Master according to the terms specified in this Agreement. Servant's details: Name: ${servant.name || '_______________'}, Relationship: ${servant.relationshipField || '_______________'}, CNIC: ${servant.cnic || '_______________'}, Address: ${servant.address || '_______________________________________________'}.`;
      
      const servantInfoLines = doc.splitTextToSize(servantInfoText, 170);
      servantInfoLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Employment Details Section
      doc.setFont("helvetica", "bold");
      doc.text("Employment Details.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const employmentText = `The place of employment shall be the Master's residence at ${master.address || '_______________________________________________'}. The Servant agrees to perform household duties as may be assigned by the Master from time to time, including but not limited to cleaning, cooking, and general domestic work.`;
      
      const employmentLines = doc.splitTextToSize(employmentText, 170);
      employmentLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // Remuneration Section
      doc.setFont("helvetica", "bold");
      doc.text("Remuneration.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const remunerationText = `The Master agrees to pay the Servant a monthly salary of Rs. ${answers.monthly_salary || '_______________'}. The salary shall be paid on the 5th of each month. This compensation covers all regular domestic duties as assigned.`;
      
      const remunerationLines = doc.splitTextToSize(remunerationText, 170);
      remunerationLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Duration and Termination Section
      doc.setFont("helvetica", "bold");
      doc.text("Duration and Termination.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const durationText = "This Agreement shall remain in effect for a period of 2 years from the date of signing, unless terminated earlier by either party. Either party may terminate this Agreement by giving 30 days written notice to the other party, or payment of 30 days salary in lieu of notice.";
      
      const durationLines = doc.splitTextToSize(durationText, 170);
      durationLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // General Terms Section
      doc.setFont("helvetica", "bold");
      doc.text("General Terms.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const generalText = "The Servant agrees to maintain confidentiality regarding the Master's personal and family matters. The Master agrees to provide a safe working environment and treat the Servant with dignity and respect. Both parties agree to comply with all applicable labor laws and regulations.";
      
      const generalLines = doc.splitTextToSize(generalText, 170);
      generalLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // Witness Section
      doc.setFont("helvetica", "bold");
      doc.text("Witnesses.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const witnessText = `The following witnesses attest to the execution of this Agreement: ${witness1.name || '_______________'} (CNIC: ${witness1.cnic || '_______________'}) and ${witness2.name || '_______________'} (CNIC: ${witness2.cnic || '_______________'}).`;
      
      const witnessLines = doc.splitTextToSize(witnessText, 170);
      witnessLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 10;
      
      // Check if we need a new page for signatures
      if (y > pageHeight - 140) {
        doc.addPage();
        y = 20;
      }
      
      // Signatures Section
      doc.setFont("helvetica", "bold");
      doc.text("Signatures.", 15, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "normal");
      
      // Master signature
      doc.text("The Master:", 15, y);
      y += lineHeight + 5;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${master.name || '_______________'} (Printed Name)`, 15, y);
      y += lineHeight;
      doc.text(`CNIC: ${master.cnic || '_______________'}`, 15, y);
      y += lineHeight + 8;
      
      // Servant signature
      doc.text("The Servant:", 15, y);
      y += lineHeight + 5;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${servant.name || '_______________'} (Printed Name)`, 15, y);
      y += lineHeight;
      doc.text(`CNIC: ${servant.cnic || '_______________'}`, 15, y);
      y += lineHeight + 8;
      
      // Witness signatures
      doc.text("Witness 1:", 15, y);
      y += lineHeight + 5;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${witness1.name || '_______________'} (Printed Name)`, 15, y);
      y += lineHeight;
      doc.text(`CNIC: ${witness1.cnic || '_______________'}`, 15, y);
      y += lineHeight + 5;
      
      doc.text("Witness 2:", 15, y);
      y += lineHeight + 5;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${witness2.name || '_______________'} (Printed Name)`, 15, y);
      y += lineHeight;
      doc.text(`CNIC: ${witness2.cnic || '_______________'}`, 15, y);
      
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
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Domestic Service Agreement Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">General Details</h4>
              <p><strong>Agreement Date:</strong> {agreementDate ? format(agreementDate, 'dd/MM/yyyy') : 'Not provided'}</p>
              <p><strong>City:</strong> {answers.agreement_city || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Master Information</h4>
              <p><strong>Name:</strong> {master.name || 'Not provided'}</p>
              <p><strong>CNIC:</strong> {master.cnic || 'Not provided'}</p>
              <p><strong>Address:</strong> {master.address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Servant Information</h4>
              <p><strong>Name:</strong> {servant.name || 'Not provided'}</p>
              <p><strong>Relationship:</strong> {servant.relationshipField || 'Not provided'}</p>
              <p><strong>CNIC:</strong> {servant.cnic || 'Not provided'}</p>
              <p><strong>Address:</strong> {servant.address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Employment Details</h4>
              <p><strong>Monthly Salary:</strong> Rs. {answers.monthly_salary || 'Not provided'}</p>
              <p><strong>Payment Date:</strong> 5th of each month</p>
              <p><strong>Duration:</strong> 2 years from signing date</p>
              <p><strong>Notice Period:</strong> 30 days</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Place of Employment</h4>
              <p><strong>Location:</strong> {master.address || 'Same as Master\'s Address'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Witnesses</h4>
              <p><strong>Witness 1:</strong> {witness1.name || 'Not provided'} (CNIC: {witness1.cnic || 'Not provided'})</p>
              <p><strong>Witness 2:</strong> {witness2.name || 'Not provided'} (CNIC: {witness2.cnic || 'Not provided'})</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Domestic Service Agreement.
          </p>
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
      <Card className="max-w-4xl mx-auto">
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
              setSectionHistory(['general_details']);
              setCurrentSectionId('general_details');
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
              setCurrentSectionId('general_details');
              setSectionHistory(['general_details']);
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

export default DomesticServiceAgreementForm;
