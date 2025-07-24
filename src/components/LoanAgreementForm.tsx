import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, Calendar as CalendarIcon, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  type: 'text' | 'select' | 'textarea' | 'confirmation' | 'date' | 'number' | 'party' | 'witness' | 'money';
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
  'location_selection': {
    id: 'location_selection',
    title: 'Location Selection',
    description: 'Select the country and state/province where this Loan Agreement will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'general_details'
  },
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
    questions: ['confirmation'],
    nextSectionId: 'user_info'
  },
  'user_info': {
    id: 'user_info',
    title: 'Contact Information',
    description: 'Enter your contact information for document generation',
    questions: []
  }
};

// Define the question flow
const questions: Record<string, Question> = {
  'country': {
    id: 'country',
    type: 'select',
    text: 'Select the country where this Loan Agreement will be executed:',
    options: [], // Will be populated dynamically from the database
    defaultNextId: 'state'
  },
  'state': {
    id: 'state',
    type: 'select',
    text: 'Select the state/province where this Loan Agreement will be executed:',
    options: [], // Will be populated dynamically based on country selection
    defaultNextId: 'agreement_date'
  },
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
  const navigate = useNavigate();
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
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
      if (currentSectionId === 'confirmation') {
        const nextSectionId = currentSection?.nextSectionId;
        if (nextSectionId && sections[nextSectionId]) {
          setSectionHistory([...sectionHistory, nextSectionId]);
          setCurrentSectionId(nextSectionId);
        }
        return;
      }

      if (currentSectionId === 'user_info') {
        setIsComplete(true);
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
              value={questionId === 'loan_purpose' ? loanDetails.purpose : answers[questionId] || ''}
              onChange={(e) => {
                if (questionId === 'loan_purpose') {
                  updateLoanDetails('purpose', e.target.value);
                } else {
                  handleAnswer(questionId, e.target.value);
                }
              }}
              placeholder="Enter the purpose of the loan"
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
              rows={4}
            />
          </div>
        );
      case 'select':
        if (questionId === 'country') {
          return (
            <div className="mb-4">
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
                <SelectTrigger className="mt-1 text-black w-full bg-white rounded-lg shadow-sm">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-lg shadow-sm">
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
            <div className="mb-4">
              <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
                {question.text}
              </Label>
              <Select
                value={answers[questionId] || ''}
                onValueChange={(value) => handleAnswer(questionId, value)}
                disabled={!selectedCountryId}
              >
                <SelectTrigger className="mt-1 text-black w-full bg-white rounded-lg shadow-sm">
                  <SelectValue placeholder={selectedCountryId ? "Select a state/province" : "Select a country first"} />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-lg shadow-sm">
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
                <SelectTrigger className="mt-1 text-black w-full bg-white rounded-lg shadow-sm">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-lg shadow-sm">
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
              <PopoverContent className="w-auto p-0 bg-white rounded-lg shadow-sm">
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
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
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
    if (currentSectionId === 'location_selection') {
      return answers.country && answers.state;
    }
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
    setIsGeneratingPDF(true);
    
    try {
      console.log("Generating Loan Agreement PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("LOAN AGREEMENT", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Helper function to add text with automatic page breaks
      const addText = (text: string, isBold = false, fontSize = 11) => {
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
          doc.text(line, 15, y);
          y += lineHeight;
        });
        y += 3; // Extra spacing after sections
      };

      // Dynamic field values
      const agreementDateStr = agreementDate ? format(agreementDate, 'MMMM dd, yyyy') : '_______________';
      const loanDueDateStr = loanDueDate ? format(loanDueDate, 'MMMM dd, yyyy') : '_______________';
      const installmentStartDateStr = installmentStartDate ? format(installmentStartDate, 'MMMM dd, yyyy') : '_______________';
      
      // THE PARTIES
      addText("THE PARTIES.", true, 12);
      
      addText(`This Loan Agreement ("Agreement") made on ${agreementDateStr} is between:`);
      
      addText(`Borrower: ${borrower.name || '[BORROWER\'S NAME]'} with address of ${borrower.address || '[ADDRESS]'} ("Borrower") and agrees to borrow money from:`);
      
      addText(`Lender: ${lender.name || '[LENDER\'S NAME]'} with address of ${lender.address || '[ADDRESS]'} and agrees to lend money to the Borrower under the following terms:`);
      
      // LOAN AMOUNT
      addText("LOAN AMOUNT.", true, 12);
      
      addText(`The total amount of money being borrowed from the Lender to the Borrower is $${loanDetails.amount || '[INSERT AMOUNT]'} ("Borrowed Money").`);
      
      // TERM
      addText("TERM.", true, 12);
      
      addText(`The total amount of the Borrowed Money, shall be due and payable till ${loanDueDateStr} ("Due Date")`);
      
      // PURPOSE OF LOAN
      addText("PURPOSE OF LOAN", true, 12);
      
      addText("The Loan Amount shall be used by the Borrower for the following purpose:");
      addText(`${loanDetails.purpose || '[Briefly describe the purpose]'}`);
      
      // PAYMENTS
      addText("PAYMENTS.", true, 12);
      
      let paymentText = '';
      if (loanDetails.installmentFrequency === 'One-time payment') {
        paymentText = `The Borrower shall repay the entire Loan Amount in one lump sum payment on the Due Date specified above.`;
      } else {
        paymentText = `The Borrower shall repay the Loan in ${loanDetails.installmentFrequency || '[Quarterly]'} installments of $${loanDetails.installmentAmount || '[Installment Amount]'} starting from ${installmentStartDateStr} until full payment is made.`;
      }
      
      addText(paymentText);
      addText("All payments shall be made in bank transfer to the Lender's designated account, details of which will be provided separately in writing.");
      
      // GOVERNING LAW
      addText("GOVERNING LAW.", true, 12);
      
      addText(`This Agreement shall be construed and governed by the laws located in ${answers.country ? getCountryName(answers.country) + (answers.state ? ', ' + getStateName(answers.country, answers.state) : '') : answers.governing_jurisdiction || 'the state'} ("Governing Law") and if not fulfilled will be punished under the laws of ${answers.country ? getCountryName(answers.country) + (answers.state ? ', ' + getStateName(answers.country, answers.state) : '') : answers.governing_jurisdiction || 'state'}.`);
      
      // SUCCESSORS
      addText("SUCCESSORS.", true, 12);
      
      addText("All of the foregoing is the promise of Borrower and shall bind Borrower and Borrower's successors, heirs, and assigns; provided, however, that Lender may not assign any of its rights or delegate any of its obligations hereunder without the prior written consent of the holder of this Agreement.");
      
      // EVENTS OF DEFAULT
      addText("EVENTS OF DEFAULT", true, 12);
      
      addText("The Borrower shall be considered in default under this Agreement if:");
      addText("• Fails to repay the Loan Amount or any installment by the Due Date;");
      addText("• Uses the funds for purposes other than agreed;");
      addText("• Becomes insolvent or is declared bankrupt.");
      
      addText("In the event of default:");
      addText("• The entire outstanding amount shall become immediately due and payable;");
      addText("• The Lender shall have the right to pursue legal remedies to recover the amount, including legal costs and damages.");
      
      // ENTIRE AGREEMENT
      addText("ENTIRE AGREEMENT.", true, 12);
      
      addText("This Agreement contains all the terms agreed to by the parties relating to its subject matter. This Agreement replaces all previous discussions, understandings, and oral agreements. The Borrower and Lender agree to the terms and conditions and shall be bound until the Borrowed Amount is repaid in full.");
      
      // NOTICES
      addText("NOTICES", true, 12);
      
      addText("Any notice under this Agreement shall be in writing and delivered personally, by courier, or by registered mail to the addresses of the Parties mentioned above.");
      
      // Add some space before signatures
      y += 15;
      
      // Check if we need a new page for signatures
      if (y > pageHeight - 150) {
        doc.addPage();
        y = 20;
      }
      
      // IN WITNESS WHEREOF
      addText("IN WITNESS WHEREOF, Borrower and Lender have executed this Agreement as of the day and year first above written.", true);
      
      y += 10;
      
      // SIGNATURES
      addText("SIGNATURES:", true, 12);
      
      // Borrower signature
      doc.text("Borrower's Signature: _____________________", 15, y);
      doc.text("Date: _____________", 130, y);
      y += lineHeight + 5;
      doc.text(`Name: ${borrower.name || '_____________________'}`, 15, y);
      y += lineHeight + 15;
      
      // Lender signature
      doc.text("Lender's Signature: _____________________", 15, y);
      doc.text("Date: _____________", 130, y);
      y += lineHeight + 5;
      doc.text(`Name: ${lender.name || '_____________________'}`, 15, y);
      y += lineHeight + 15;
      
      // Witness signatures
      doc.text("Witness No.1", 15, y);
      y += lineHeight + 5;
      doc.text(`Name and signature: ${witness1.name || '_____________________'}`, 15, y);
      y += lineHeight + 10;
      
      doc.text("Witness No.2", 15, y);
      y += lineHeight + 5;
      doc.text(`Name and signature: ${witness2.name || '_____________________'}`, 15, y);
      
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
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Loan Agreement Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Location Information</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state && answers.country ? getStateName(answers.country, answers.state) : 'Not provided'}</p>
            </div>
            
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
              <p><strong>Primary Jurisdiction:</strong> {answers.country ? getCountryName(answers.country) + (answers.state ? ', ' + getStateName(answers.country, answers.state) : '') : 'Not provided'}</p>
              {answers.governing_jurisdiction && <p><strong>Additional Jurisdiction:</strong> {answers.governing_jurisdiction}</p>}
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
    <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
      <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
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
              setSectionHistory(['location_selection']);
              setCurrentSectionId('location_selection');
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
            onClick={() => setCurrentSectionId('user_info')}
          >
            Continue to Generate PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
  }

  // Handle user info step
  if (currentSectionId === 'user_info') {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm p-4">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <UserInfoStep
            onBack={handleBack}
            onGenerate={generateLoanAgreementPDF}
            documentType="Loan Agreement"
            isGenerating={isGeneratingPDF}
          />
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
    <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm p-4">
      <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">{currentSection.title}</CardTitle>
        <CardDescription>
          {currentSection.description}
          <div className="mt-2 text-sm">
            Step {sectionHistory.length} of {Object.keys(sections).length}
          </div>
        </CardDescription>
        {currentSectionId === 'location_selection' && (
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/loan-agreement-info')}
              className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
            >
              <FileText className="w-4 h-4 mr-2" />
              Learn More About Loan Agreements
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

export default LoanAgreementForm;






