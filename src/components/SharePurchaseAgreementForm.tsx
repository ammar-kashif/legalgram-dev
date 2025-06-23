import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  type: 'text' | 'select' | 'radio' | 'textarea' | 'confirmation' | 'date' | 'number' | 'party' | 'witness' | 'company';
  text: string;
  options?: string[];
  nextQuestionId?: Record<string, string>;
  defaultNextId?: string;
}

// Party interface (Seller/Buyer)
interface Party {
  name: string;
  address: string;
}

// Company interface
interface Company {
  name: string;
  incorporationNumber: string;
  jurisdiction: string;
  sharesSold: string;
}

// Witness interface
interface Witness {
  name: string;
  cnic: string;
}

// Existing Shareholder interface
interface ExistingShareholder {
  name: string;
  offerLetterDate: string;
  refusalLetterDate: string;
  boardResolutionDate: string;
}

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'general_details': {
    id: 'general_details',
    title: 'General Details',
    description: 'Enter the basic details of the Share Purchase Agreement',
    questions: ['effective_date', 'agreement_location'],
    nextSectionId: 'seller_info'
  },
  'seller_info': {
    id: 'seller_info',
    title: 'Seller Information',
    description: 'Enter details of the party selling the shares',
    questions: ['seller_info'],
    nextSectionId: 'buyer_info'
  },
  'buyer_info': {
    id: 'buyer_info',
    title: 'Buyer Information',
    description: 'Enter details of the party buying the shares',
    questions: ['buyer_info'],
    nextSectionId: 'company_details'
  },
  'company_details': {
    id: 'company_details',
    title: 'Company Details',
    description: 'Enter information about the company whose shares are being transferred',
    questions: ['company_info'],
    nextSectionId: 'transaction_details'
  },
  'transaction_details': {
    id: 'transaction_details',
    title: 'Transaction Details',
    description: 'Specify the details of the share transfer',
    questions: ['share_transfer_date', 'share_certificates_delivery', 'indemnifying_party'],
    nextSectionId: 'existing_shareholder'
  },
  'existing_shareholder': {
    id: 'existing_shareholder',
    title: 'Existing Shareholder Details',
    description: 'Enter information about existing shareholder notifications',
    questions: ['existing_shareholder_info'],
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
  'effective_date': {
    id: 'effective_date',
    type: 'date',
    text: 'Effective Date of Agreement:',
    defaultNextId: 'agreement_location'
  },
  'agreement_location': {
    id: 'agreement_location',
    type: 'text',
    text: 'Location of Agreement Signing:',
    defaultNextId: 'seller_info'
  },
  'seller_info': {
    id: 'seller_info',
    type: 'party',
    text: 'Seller Information:',
    defaultNextId: 'buyer_info'
  },
  'buyer_info': {
    id: 'buyer_info',
    type: 'party',
    text: 'Buyer Information:',
    defaultNextId: 'company_info'
  },
  'company_info': {
    id: 'company_info',
    type: 'company',
    text: 'Company Information:',
    defaultNextId: 'share_transfer_date'
  },
  'share_transfer_date': {
    id: 'share_transfer_date',
    type: 'date',
    text: 'Effective Date of Share Transfer:',
    defaultNextId: 'share_certificates_delivery'
  },
  'share_certificates_delivery': {
    id: 'share_certificates_delivery',
    type: 'radio',
    text: 'Will share certificates and related documents be delivered?',
    options: ['Yes - All required documents will be delivered', 'No - Documents will not be delivered'],
    defaultNextId: 'indemnifying_party'
  },
  'indemnifying_party': {
    id: 'indemnifying_party',
    type: 'select',
    text: 'Select the Indemnifying Party:',
    options: ['Buyer', 'Existing Shareholder', 'Seller'],
    defaultNextId: 'existing_shareholder_info'
  },
  'existing_shareholder_info': {
    id: 'existing_shareholder_info',
    type: 'text',
    text: 'Existing Shareholder Information:',
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
    text: 'Thank you for providing the information. We will generate your Share Purchase Agreement based on your answers.',
  }
};

const SharePurchaseAgreementForm = () => {
  const [currentSectionId, setCurrentSectionId] = useState<string>('general_details');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['general_details']);
  const [isComplete, setIsComplete] = useState(false);
  const [seller, setSeller] = useState<Party>({ name: '', address: '' });
  const [buyer, setBuyer] = useState<Party>({ name: '', address: '' });
  const [company, setCompany] = useState<Company>({ name: '', incorporationNumber: '', jurisdiction: '', sharesSold: '' });
  const [existingShareholder, setExistingShareholder] = useState<ExistingShareholder>({ 
    name: '', 
    offerLetterDate: '', 
    refusalLetterDate: '', 
    boardResolutionDate: '' 
  });
  const [witness1, setWitness1] = useState<Witness>({ name: '', cnic: '' });
  const [witness2, setWitness2] = useState<Witness>({ name: '', cnic: '' });
  const [effectiveDate, setEffectiveDate] = useState<Date>();
  const [shareTransferDate, setShareTransferDate] = useState<Date>();
  
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

  const updateParty = (type: 'seller' | 'buyer', field: keyof Party, value: string) => {
    if (type === 'seller') {
      setSeller({ ...seller, [field]: value });
    } else {
      setBuyer({ ...buyer, [field]: value });
    }
  };

  const updateCompany = (field: keyof Company, value: string) => {
    setCompany({ ...company, [field]: value });
  };

  const updateExistingShareholder = (field: keyof ExistingShareholder, value: string) => {
    setExistingShareholder({ ...existingShareholder, [field]: value });
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
              placeholder="Enter additional information"
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
              value={answers[questionId] || ''}
              onValueChange={(value) => handleAnswer(questionId, value)}
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
      case 'date':
        const dateValue = questionId === 'effective_date' ? effectiveDate : shareTransferDate;
        const setDateValue = questionId === 'effective_date' ? setEffectiveDate : setShareTransferDate;
        
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
      case 'party':
        const isSellerInfo = questionId === 'seller_info';
        const party = isSellerInfo ? seller : buyer;
        const partyType = isSellerInfo ? 'seller' : 'buyer';
        
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
                  onChange={(e) => updateParty(partyType as 'seller' | 'buyer', 'name', e.target.value)}
                  placeholder="Enter full name"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Residential Address</Label>
                <Textarea
                  value={party.address}
                  onChange={(e) => updateParty(partyType as 'seller' | 'buyer', 'address', e.target.value)}
                  placeholder="Enter complete residential address"
                  className="text-black"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );
      case 'company':
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Company Name</Label>
                <Input
                  value={company.name}
                  onChange={(e) => updateCompany('name', e.target.value)}
                  placeholder="Enter company name"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Incorporation Number</Label>
                <Input
                  value={company.incorporationNumber}
                  onChange={(e) => updateCompany('incorporationNumber', e.target.value)}
                  placeholder="Enter incorporation number"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Jurisdiction / State of Incorporation</Label>
                <Input
                  value={company.jurisdiction}
                  onChange={(e) => updateCompany('jurisdiction', e.target.value)}
                  placeholder="Enter jurisdiction or state"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Number of Shares Being Sold</Label>
                <Input
                  value={company.sharesSold}
                  onChange={(e) => updateCompany('sharesSold', e.target.value)}
                  placeholder="Enter number of shares"
                  className="text-black"
                  type="number"
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
              <div>
                <Label className="text-sm">CNIC</Label>
                <Input
                  value={witness.cnic}
                  onChange={(e) => updateWitness(witnessType as 'witness1' | 'witness2', 'cnic', e.target.value)}
                  placeholder="Enter CNIC number"
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
      return effectiveDate && answers.agreement_location;
    }
    if (currentSectionId === 'seller_info') {
      return seller.name && seller.address;
    }
    if (currentSectionId === 'buyer_info') {
      return buyer.name && buyer.address;
    }
    if (currentSectionId === 'company_details') {
      return company.name && company.incorporationNumber && company.jurisdiction && company.sharesSold;
    }
    if (currentSectionId === 'transaction_details') {
      return shareTransferDate && answers.share_certificates_delivery && answers.indemnifying_party;
    }    if (currentSectionId === 'existing_shareholder') {
      return existingShareholder.name && existingShareholder.offerLetterDate && 
             existingShareholder.refusalLetterDate && existingShareholder.boardResolutionDate;
    }
    if (currentSectionId === 'witnesses') {
      return witness1.name && witness1.cnic && witness2.name && witness2.cnic;
    }
    
    // Default validation
    return true;
  };

  // Custom input for existing shareholder with multiple date fields
  const renderExistingShareholderInput = () => {
    return (
      <div className="mb-4">
        <Label className="block text-sm font-medium text-black mb-2">
          Existing Shareholder Information:
        </Label>
        <div className="border rounded-lg p-4 space-y-3">
          <div>
            <Label className="text-sm">Full Name of Existing Shareholder</Label>
            <Input
              value={existingShareholder.name}
              onChange={(e) => updateExistingShareholder('name', e.target.value)}
              placeholder="Enter existing shareholder name"
              className="text-black"
            />
          </div>
          <div>
            <Label className="text-sm">Date of Offer Letter Sent</Label>
            <Input
              value={existingShareholder.offerLetterDate}
              onChange={(e) => updateExistingShareholder('offerLetterDate', e.target.value)}
              placeholder="YYYY-MM-DD"
              className="text-black"
              type="date"
            />
          </div>
          <div>
            <Label className="text-sm">Date of Refusal Letter Received</Label>
            <Input
              value={existingShareholder.refusalLetterDate}
              onChange={(e) => updateExistingShareholder('refusalLetterDate', e.target.value)}
              placeholder="YYYY-MM-DD"
              className="text-black"
              type="date"
            />
          </div>
          <div>
            <Label className="text-sm">Date of Board Resolution Executed</Label>
            <Input
              value={existingShareholder.boardResolutionDate}
              onChange={(e) => updateExistingShareholder('boardResolutionDate', e.target.value)}
              placeholder="YYYY-MM-DD"
              className="text-black"
              type="date"
            />
          </div>
        </div>
      </div>
    );
  };

  // Override the existing shareholder question rendering
  const renderSectionQuestionsOverride = () => {
    return currentSection.questions.map(questionId => {
      if (questionId === 'existing_shareholder_info') {
        return renderExistingShareholderInput();
      }
      return renderQuestionInput(questionId);
    });
  };
  const generateSharePurchaseAgreementPDF = () => {
    try {
      console.log("Generating Share Purchase Agreement PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Share Purchase Agreement", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Introduction paragraph (similar to Child Care form style)
      const currentDate = format(new Date(), 'yyyy-MM-dd');
      const effectiveDateStr = effectiveDate ? format(effectiveDate, 'MMMM dd, yyyy') : '_______________';
      const agreementLocation = answers.agreement_location || '_______________';
      
      const introText = `This Share Purchase Agreement ("Agreement") is entered into on ${effectiveDateStr}, at ${agreementLocation}, by and between ${seller.name || '_______________'} ("Seller"), ${buyer.name || '_______________'} ("Buyer"), and ${existingShareholder.name || '_______________'} ("Existing Shareholder").`;
      
      const introLines = doc.splitTextToSize(introText, 170);
      introLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Seller Information Section
      doc.setFont("helvetica", "bold");
      doc.text("Seller Information.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const sellerInfoText = `The Seller hereby agrees to sell and transfer the shares as specified in this Agreement. Seller's details: Name: ${seller.name || '_______________'}, Address: ${seller.address || '_______________________________________________'}.`;
      
      const sellerInfoLines = doc.splitTextToSize(sellerInfoText, 170);
      sellerInfoLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Buyer Information Section
      doc.setFont("helvetica", "bold");
      doc.text("Buyer Information.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const buyerInfoText = `The Buyer hereby agrees to purchase the shares as specified in this Agreement. Buyer's details: Name: ${buyer.name || '_______________'}, Address: ${buyer.address || '_______________________________________________'}.`;
      
      const buyerInfoLines = doc.splitTextToSize(buyerInfoText, 170);
      buyerInfoLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Company and Share Details Section
      doc.setFont("helvetica", "bold");
      doc.text("Company and Share Details.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const shareTransferDateStr = shareTransferDate ? format(shareTransferDate, 'MMMM dd, yyyy') : '_______________';
      const companyDetailsText = `This Agreement pertains to the sale and purchase of shares in ${company.name || '_______________'} (Incorporation Number: ${company.incorporationNumber || '_______________'}), incorporated under the laws of ${company.jurisdiction || '_______________'}. The transaction involves ${company.sharesSold || '_______________'} ordinary shares, with the effective date of share transfer being ${shareTransferDateStr}.`;
      
      const companyDetailsLines = doc.splitTextToSize(companyDetailsText, 170);
      companyDetailsLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 20;
      }
      
      // Transaction Terms Section
      doc.setFont("helvetica", "bold");
      doc.text("Transaction Terms.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const certificatesDelivery = answers.share_certificates_delivery || 'Not specified';
      let transactionText = "The shares being transferred are ordinary shares of the Company. ";
      
      if (certificatesDelivery.includes('Yes')) {
        transactionText += "The following documents shall be delivered as part of this transaction: share certificates, transfer deeds, and board resolutions. ";
      } else {
        transactionText += "The delivery of share certificates and related documents shall be as mutually agreed by the parties. ";
      }
      
      const transactionLines = doc.splitTextToSize(transactionText, 170);
      transactionLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Existing Shareholder Consent Section
      doc.setFont("helvetica", "bold");
      doc.text("Existing Shareholder Consent.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const consentText = `The Existing Shareholder, ${existingShareholder.name || '_______________'}, hereby consents to this share transfer. The offer letter was sent on ${existingShareholder.offerLetterDate || '_______________'}, refusal letter received on ${existingShareholder.refusalLetterDate || '_______________'}, and board resolution executed on ${existingShareholder.boardResolutionDate || '_______________'}.`;
      
      const consentLines = doc.splitTextToSize(consentText, 170);
      consentLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Indemnification Section
      doc.setFont("helvetica", "bold");
      doc.text("Indemnification.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const indemnificationText = `The indemnifying party for this transaction shall be ${answers.indemnifying_party || '_______________'}, who agrees to hold harmless the other parties from any claims, damages, or liabilities arising from this share purchase transaction.`;
      
      const indemnificationLines = doc.splitTextToSize(indemnificationText, 170);
      indemnificationLines.forEach((line: string) => {
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
      if (y > pageHeight - 100) {
        doc.addPage();
        y = 20;
      }
      
      // Signatures Section
      doc.setFont("helvetica", "bold");
      doc.text("Signatures.", 15, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "normal");
      
      // Seller signature
      doc.text("The Seller:", 15, y);
      y += lineHeight + 5;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${seller.name || '_______________'} (Printed Name)`, 15, y);
      y += lineHeight + 5;
      
      // Buyer signature
      doc.text("The Buyer:", 15, y);
      y += lineHeight + 5;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${buyer.name || '_______________'} (Printed Name)`, 15, y);
      y += lineHeight + 5;
      
      // Existing Shareholder signature
      doc.text("The Existing Shareholder:", 15, y);
      y += lineHeight + 5;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${existingShareholder.name || '_______________'} (Printed Name)`, 15, y);
      y += lineHeight + 5;
      
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
      y += lineHeight + 5;
      
      doc.text("Date: _________________", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `share_purchase_agreement_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Share Purchase Agreement successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Share Purchase Agreement");
      return null;
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Share Purchase Agreement Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">General Details</h4>
              <p><strong>Effective Date:</strong> {effectiveDate ? format(effectiveDate, 'dd/MM/yyyy') : 'Not provided'}</p>
              <p><strong>Location:</strong> {answers.agreement_location || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Seller Information</h4>
              <p><strong>Name:</strong> {seller.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {seller.address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Buyer Information</h4>
              <p><strong>Name:</strong> {buyer.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {buyer.address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Company Details</h4>
              <p><strong>Name:</strong> {company.name || 'Not provided'}</p>
              <p><strong>Incorporation #:</strong> {company.incorporationNumber || 'Not provided'}</p>
              <p><strong>Jurisdiction:</strong> {company.jurisdiction || 'Not provided'}</p>
              <p><strong>Shares Sold:</strong> {company.sharesSold || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Transaction Details</h4>
              <p><strong>Transfer Date:</strong> {shareTransferDate ? format(shareTransferDate, 'dd/MM/yyyy') : 'Not provided'}</p>
              <p><strong>Documents Delivery:</strong> {answers.share_certificates_delivery || 'Not specified'}</p>
              <p><strong>Indemnifying Party:</strong> {answers.indemnifying_party || 'Not specified'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Existing Shareholder</h4>
              <p><strong>Name:</strong> {existingShareholder.name || 'Not provided'}</p>
              <p><strong>Offer Letter Date:</strong> {existingShareholder.offerLetterDate || 'Not provided'}</p>
              <p><strong>Refusal Letter Date:</strong> {existingShareholder.refusalLetterDate || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Witnesses</h4>
              <p><strong>Witness 1:</strong> {witness1.name || 'Not provided'} ({witness1.cnic || 'CNIC not provided'})</p>
              <p><strong>Witness 2:</strong> {witness2.name || 'Not provided'} ({witness2.cnic || 'CNIC not provided'})</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Share Purchase Agreement.
          </p>
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-green-600">Share Purchase Agreement</CardTitle>
          <CardDescription>
            Review your Share Purchase Agreement details below before generating the final document.
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
              setSeller({ name: '', address: '' });
              setBuyer({ name: '', address: '' });
              setCompany({ name: '', incorporationNumber: '', jurisdiction: '', sharesSold: '' });
              setExistingShareholder({ name: '', offerLetterDate: '', refusalLetterDate: '', boardResolutionDate: '' });
              setWitness1({ name: '', cnic: '' });
              setWitness2({ name: '', cnic: '' });
              setEffectiveDate(undefined);
              setShareTransferDate(undefined);
            }}
          >
            Start Over
          </Button>
          <Button 
            onClick={generateSharePurchaseAgreementPDF}
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
          {renderSectionQuestionsOverride()}
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

export default SharePurchaseAgreementForm;
