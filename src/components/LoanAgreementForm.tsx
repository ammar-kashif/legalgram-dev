import { useState } from "react";
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
  type: 'text' | 'select' | 'textarea' | 'confirmation' | 'date' | 'number' | 'party' | 'witness' | 'money';
  text: string;
  options?: string[];
  nextQuestionId?: Record<string, string>;
  defaultNextId?: string;
}

// Party interface (Borrower/Lender)
interface Party {
  name: string;
  address: string;
}

// Witness interface
interface Witness {
  name: string;
}

// Loan Details interface
interface LoanDetails {
  amount: string;
  purpose: string;
  installmentFrequency: string;
  installmentAmount: string;
}

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'general_details': {
    id: 'general_details',
    title: 'General Details',
    description: 'Enter the basic details of the Loan Agreement',
    questions: ['agreement_date'],
    nextSectionId: 'borrower_info'
  },
  'borrower_info': {
    id: 'borrower_info',
    title: 'Borrower Information',
    description: 'Enter details of the party borrowing the money',
    questions: ['borrower_info'],
    nextSectionId: 'lender_info'
  },
  'lender_info': {
    id: 'lender_info',
    title: 'Lender Information',
    description: 'Enter details of the party lending the money',
    questions: ['lender_info'],
    nextSectionId: 'loan_terms'
  },
  'loan_terms': {
    id: 'loan_terms',
    title: 'Loan Terms',
    description: 'Specify the loan amount, purpose, and due date',
    questions: ['loan_amount', 'loan_purpose', 'loan_due_date'],
    nextSectionId: 'repayment_terms'
  },
  'repayment_terms': {
    id: 'repayment_terms',
    title: 'Repayment Terms',
    description: 'Define the repayment schedule and installment details',
    questions: ['installment_frequency', 'installment_amount', 'installment_start_date'],
    nextSectionId: 'governing_law'
  },
  'governing_law': {
    id: 'governing_law',
    title: 'Governing Law',
    description: 'Specify the jurisdiction that will govern this agreement',
    questions: ['governing_jurisdiction'],
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
    text: 'Agreement Date:',
    defaultNextId: 'borrower_info'
  },
  'borrower_info': {
    id: 'borrower_info',
    type: 'party',
    text: 'Borrower Information:',
    defaultNextId: 'lender_info'
  },
  'lender_info': {
    id: 'lender_info',
    type: 'party',
    text: 'Lender Information:',
    defaultNextId: 'loan_amount'
  },
  'loan_amount': {
    id: 'loan_amount',
    type: 'money',
    text: 'Loan Amount (Borrowed Money):',
    defaultNextId: 'loan_purpose'
  },
  'loan_purpose': {
    id: 'loan_purpose',
    type: 'textarea',
    text: 'Purpose of Loan:',
    defaultNextId: 'loan_due_date'
  },
  'loan_due_date': {
    id: 'loan_due_date',
    type: 'date',
    text: 'Loan Due Date:',
    defaultNextId: 'installment_frequency'
  },
  'installment_frequency': {
    id: 'installment_frequency',
    type: 'select',
    text: 'Installment Frequency:',
    options: ['Monthly', 'Quarterly', 'Semi-annually', 'Annually', 'One-time payment'],
    defaultNextId: 'installment_amount'
  },
  'installment_amount': {
    id: 'installment_amount',
    type: 'money',
    text: 'Installment Amount:',
    defaultNextId: 'installment_start_date'
  },
  'installment_start_date': {
    id: 'installment_start_date',
    type: 'date',
    text: 'Installment Start Date:',
    defaultNextId: 'governing_jurisdiction'
  },
  'governing_jurisdiction': {
    id: 'governing_jurisdiction',
    type: 'text',
    text: 'Governing Law Jurisdiction (State/Country):',
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
    text: 'Thank you for providing the information. We will generate your Loan Agreement based on your answers.',
  }
};

const LoanAgreementForm = () => {
  const [currentSectionId, setCurrentSectionId] = useState<string>('general_details');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['general_details']);
  const [isComplete, setIsComplete] = useState(false);
  const [borrower, setBorrower] = useState<Party>({ name: '', address: '' });
  const [lender, setLender] = useState<Party>({ name: '', address: '' });
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({ 
    amount: '', 
    purpose: '', 
    installmentFrequency: '', 
    installmentAmount: '' 
  });
  const [witness1, setWitness1] = useState<Witness>({ name: '' });
  const [witness2, setWitness2] = useState<Witness>({ name: '' });
  const [agreementDate, setAgreementDate] = useState<Date>();
  const [loanDueDate, setLoanDueDate] = useState<Date>();
  const [installmentStartDate, setInstallmentStartDate] = useState<Date>();
  
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

  const updateParty = (type: 'borrower' | 'lender', field: keyof Party, value: string) => {
    if (type === 'borrower') {
      setBorrower({ ...borrower, [field]: value });
    } else {
      setLender({ ...lender, [field]: value });
    }
  };

  const updateLoanDetails = (field: keyof LoanDetails, value: string) => {
    setLoanDetails({ ...loanDetails, [field]: value });
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
              value={questionId === 'loan_purpose' ? loanDetails.purpose : answers[questionId] || ''}
              onChange={(e) => {
                if (questionId === 'loan_purpose') {
                  updateLoanDetails('purpose', e.target.value);
                } else {
                  handleAnswer(questionId, e.target.value);
                }
              }}
              placeholder="Enter the purpose of the loan"
              className="mt-1 text-black w-full"
              rows={4}
            />
          </div>
        );
      case 'select':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Select
              value={questionId === 'installment_frequency' ? loanDetails.installmentFrequency : answers[questionId] || ''}
              onValueChange={(value) => {
                if (questionId === 'installment_frequency') {
                  updateLoanDetails('installmentFrequency', value);
                } else {
                  handleAnswer(questionId, value);
                }
              }}
            >
              <SelectTrigger className="mt-1 text-black w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'date':
        let dateValue: Date | undefined;
        let setDateValue: (date: Date | undefined) => void;
        
        if (questionId === 'agreement_date') {
          dateValue = agreementDate;
          setDateValue = setAgreementDate;
        } else if (questionId === 'loan_due_date') {
          dateValue = loanDueDate;
          setDateValue = setLoanDueDate;
        } else if (questionId === 'installment_start_date') {
          dateValue = installmentStartDate;
          setDateValue = setInstallmentStartDate;
        }
        
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
                    !dateValue && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateValue ? format(dateValue, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={setDateValue}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
              value={questionId === 'loan_amount' ? loanDetails.amount : 
                     questionId === 'installment_amount' ? loanDetails.installmentAmount : 
                     answers[questionId] || ''}
              onChange={(e) => {
                if (questionId === 'loan_amount') {
                  updateLoanDetails('amount', e.target.value);
                } else if (questionId === 'installment_amount') {
                  updateLoanDetails('installmentAmount', e.target.value);
                } else {
                  handleAnswer(questionId, e.target.value);
                }
              }}
              placeholder="Enter amount (e.g., 10000)"
              className="mt-1 text-black w-full"
              type="number"
              min="0"
              step="0.01"
            />
          </div>
        );
      case 'party':
        const isBorrowerInfo = questionId === 'borrower_info';
        const party = isBorrowerInfo ? borrower : lender;
        const partyType = isBorrowerInfo ? 'borrower' : 'lender';
        
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Full Name</Label>
                <Input
                  value={party.name}
                  onChange={(e) => updateParty(partyType as 'borrower' | 'lender', 'name', e.target.value)}
                  placeholder="Enter full name"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Address</Label>
                <Textarea
                  value={party.address}
                  onChange={(e) => updateParty(partyType as 'borrower' | 'lender', 'address', e.target.value)}
                  placeholder="Enter complete address"
                  className="text-black"
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
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Full Name</Label>
                <Input
                  value={witness.name}
                  onChange={(e) => updateWitness(witnessType as 'witness1' | 'witness2', 'name', e.target.value)}
                  placeholder="Enter witness name"
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
      return agreementDate;
    }
    if (currentSectionId === 'borrower_info') {
      return borrower.name && borrower.address;
    }
    if (currentSectionId === 'lender_info') {
      return lender.name && lender.address;
    }
    if (currentSectionId === 'loan_terms') {
      return loanDetails.amount && loanDetails.purpose && loanDueDate;
    }
    if (currentSectionId === 'repayment_terms') {
      return loanDetails.installmentFrequency && loanDetails.installmentAmount && installmentStartDate;
    }
    if (currentSectionId === 'governing_law') {
      return answers.governing_jurisdiction;
    }
    if (currentSectionId === 'witnesses') {
      return witness1.name && witness2.name;
    }
    
    // Default validation
    return true;
  };

  const generateLoanAgreementPDF = () => {
    try {
      console.log("Generating Loan Agreement PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Loan Agreement", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Introduction paragraph
      const agreementDateStr = agreementDate ? format(agreementDate, 'MMMM dd, yyyy') : '_______________';
      
      const introText = `This Loan Agreement ("Agreement") is entered into on ${agreementDateStr}, by and between ${lender.name || '_______________'} ("Lender") and ${borrower.name || '_______________'} ("Borrower").`;
      
      const introLines = doc.splitTextToSize(introText, 170);
      introLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Lender Information Section
      doc.setFont("helvetica", "bold");
      doc.text("Lender Information.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const lenderInfoText = `The Lender hereby agrees to lend money to the Borrower under the terms specified in this Agreement. Lender's details: Name: ${lender.name || '_______________'}, Address: ${lender.address || '_______________________________________________'}.`;
      
      const lenderInfoLines = doc.splitTextToSize(lenderInfoText, 170);
      lenderInfoLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Borrower Information Section
      doc.setFont("helvetica", "bold");
      doc.text("Borrower Information.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const borrowerInfoText = `The Borrower hereby agrees to borrow money from the Lender and repay it according to the terms specified in this Agreement. Borrower's details: Name: ${borrower.name || '_______________'}, Address: ${borrower.address || '_______________________________________________'}.`;
      
      const borrowerInfoLines = doc.splitTextToSize(borrowerInfoText, 170);
      borrowerInfoLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Loan Details Section
      doc.setFont("helvetica", "bold");
      doc.text("Loan Details.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const loanDueDateStr = loanDueDate ? format(loanDueDate, 'MMMM dd, yyyy') : '_______________';
      const loanDetailsText = `The Lender agrees to loan the Borrower the sum of $${loanDetails.amount || '_______________'} (the "Loan Amount"). The purpose of this loan is: ${loanDetails.purpose || '_______________________________________________'}. The full amount of the loan shall be due and payable on ${loanDueDateStr}.`;
      
      const loanDetailsLines = doc.splitTextToSize(loanDetailsText, 170);
      loanDetailsLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 20;
      }
      
      // Repayment Terms Section
      doc.setFont("helvetica", "bold");
      doc.text("Repayment Terms.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const installmentStartDateStr = installmentStartDate ? format(installmentStartDate, 'MMMM dd, yyyy') : '_______________';
      let repaymentText = `The Borrower agrees to repay the loan according to the following schedule: `;
      
      if (loanDetails.installmentFrequency === 'One-time payment') {
        repaymentText += `The entire loan amount shall be repaid in one lump sum on the due date specified above.`;
      } else {
        repaymentText += `${loanDetails.installmentFrequency || '_______________'} installments of $${loanDetails.installmentAmount || '_______________'} each, beginning on ${installmentStartDateStr}.`;
      }
      
      const repaymentLines = doc.splitTextToSize(repaymentText, 170);
      repaymentLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Interest and Late Fees Section
      doc.setFont("helvetica", "bold");
      doc.text("Interest and Late Fees.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const interestText = "This loan shall bear no interest unless specifically agreed upon in writing by both parties. In the event of late payment, additional fees may apply as mutually agreed by the parties.";
      
      const interestLines = doc.splitTextToSize(interestText, 170);
      interestLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Default Section
      doc.setFont("helvetica", "bold");
      doc.text("Default.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const defaultText = "If the Borrower fails to make any payment when due under this Agreement, the Borrower shall be in default. Upon default, the entire unpaid balance of the loan shall become immediately due and payable.";
      
      const defaultLines = doc.splitTextToSize(defaultText, 170);
      defaultLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Governing Law Section
      doc.setFont("helvetica", "bold");
      doc.text("Governing Law.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const governingText = `This Agreement shall be governed by and construed in accordance with the laws of ${answers.governing_jurisdiction || '_______________'}.`;
      
      const governingLines = doc.splitTextToSize(governingText, 170);
      governingLines.forEach((line: string) => {
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
      const witnessText = `The following witnesses attest to the execution of this Agreement: ${witness1.name || '_______________'} and ${witness2.name || '_______________'}.`;
      
      const witnessLines = doc.splitTextToSize(witnessText, 170);
      witnessLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 10;
      
      // Check if we need a new page for signatures
      if (y > pageHeight - 120) {
        doc.addPage();
        y = 20;
      }
      
      // Signatures Section
      doc.setFont("helvetica", "bold");
      doc.text("Signatures.", 15, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "normal");
      
      // Borrower signature
      doc.text("The Borrower:", 15, y);
      y += lineHeight + 5;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${borrower.name || '_______________'} (Printed Name)`, 15, y);
      y += lineHeight;
      doc.text("Date: _________________", 15, y);
      y += lineHeight + 8;
      
      // Lender signature
      doc.text("The Lender:", 15, y);
      y += lineHeight + 5;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${lender.name || '_______________'} (Printed Name)`, 15, y);
      y += lineHeight;
      doc.text("Date: _________________", 15, y);
      y += lineHeight + 8;
      
      // Witness signatures
      doc.text("Witness 1:", 15, y);
      y += lineHeight + 5;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${witness1.name || '_______________'} (Printed Name)`, 15, y);
      y += lineHeight + 5;
      
      doc.text("Witness 2:", 15, y);
      y += lineHeight + 5;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${witness2.name || '_______________'} (Printed Name)`, 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `loan_agreement_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Loan Agreement successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Loan Agreement");
      return null;
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Loan Agreement Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">General Details</h4>
              <p><strong>Agreement Date:</strong> {agreementDate ? format(agreementDate, 'dd/MM/yyyy') : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Borrower Information</h4>
              <p><strong>Name:</strong> {borrower.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {borrower.address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Lender Information</h4>
              <p><strong>Name:</strong> {lender.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {lender.address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Loan Details</h4>
              <p><strong>Amount:</strong> ${loanDetails.amount || 'Not provided'}</p>
              <p><strong>Purpose:</strong> {loanDetails.purpose || 'Not provided'}</p>
              <p><strong>Due Date:</strong> {loanDueDate ? format(loanDueDate, 'dd/MM/yyyy') : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Repayment Terms</h4>
              <p><strong>Frequency:</strong> {loanDetails.installmentFrequency || 'Not specified'}</p>
              <p><strong>Installment Amount:</strong> ${loanDetails.installmentAmount || 'Not provided'}</p>
              <p><strong>Start Date:</strong> {installmentStartDate ? format(installmentStartDate, 'dd/MM/yyyy') : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Governing Law</h4>
              <p><strong>Jurisdiction:</strong> {answers.governing_jurisdiction || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Witnesses</h4>
              <p><strong>Witness 1:</strong> {witness1.name || 'Not provided'}</p>
              <p><strong>Witness 2:</strong> {witness2.name || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Loan Agreement.
          </p>
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-green-600">Loan Agreement</CardTitle>
          <CardDescription>
            Review your Loan Agreement details below before generating the final document.
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
              setBorrower({ name: '', address: '' });
              setLender({ name: '', address: '' });
              setLoanDetails({ amount: '', purpose: '', installmentFrequency: '', installmentAmount: '' });
              setWitness1({ name: '' });
              setWitness2({ name: '' });
              setAgreementDate(undefined);
              setLoanDueDate(undefined);
              setInstallmentStartDate(undefined);
            }}
          >
            Start Over
          </Button>
          <Button 
            onClick={generateLoanAgreementPDF}
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

export default LoanAgreementForm;
