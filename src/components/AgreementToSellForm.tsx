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
  type: 'text' | 'textarea' | 'confirmation' | 'date' | 'number' | 'party' | 'money' | 'property' | 'notice';
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

// Property Details interface
interface PropertyDetails {
  description: string;
  scheduleNumber: string;
}

// Sale Price interface
interface SalePrice {
  numerical: string;
  worded: string;
}

// Notice Information interface
interface NoticeInfo {
  address: string;
  phone: string;
  email: string;
}

// Arbitration Details interface
interface ArbitrationDetails {
  jurisdiction: string;
  arbitratorName: string;
  umpireName: string;
}

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'general_details': {
    id: 'general_details',
    title: 'General Agreement Details',
    description: 'Enter the basic details of the Agreement to Sell',
    questions: ['agreement_date', 'location_signing', 'date_signing'],
    nextSectionId: 'seller_info'
  },
  'seller_info': {
    id: 'seller_info',
    title: 'Seller Information',
    description: 'Enter details of the party selling the property',
    questions: ['seller_info'],
    nextSectionId: 'buyer_info'
  },
  'buyer_info': {
    id: 'buyer_info',
    title: 'Buyer Information',
    description: 'Enter details of the party buying the property',
    questions: ['buyer_info'],
    nextSectionId: 'property_details'
  },
  'property_details': {
    id: 'property_details',
    title: 'Property Details',
    description: 'Specify the property being sold',
    questions: ['property_info'],
    nextSectionId: 'sale_price'
  },
  'sale_price': {
    id: 'sale_price',
    title: 'Sale Price',
    description: 'Enter the sale price in numerical and worded format',
    questions: ['sale_price_info'],
    nextSectionId: 'project_details'
  },
  'project_details': {
    id: 'project_details',
    title: 'Project/Construction Details',
    description: 'Enter project-related information (optional)',
    questions: ['end_investment_period'],
    nextSectionId: 'governing_details'
  },
  'governing_details': {
    id: 'governing_details',
    title: 'Governing Details',
    description: 'Specify jurisdiction and arbitration details',
    questions: ['arbitration_info'],
    nextSectionId: 'notice_info'
  },
  'notice_info': {
    id: 'notice_info',
    title: 'Notice Information',
    description: 'Enter contact information for both parties',
    questions: ['seller_notice_info', 'buyer_notice_info'],
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
    text: 'Date of Agreement (Effective Date):',
    defaultNextId: 'location_signing'
  },
  'location_signing': {
    id: 'location_signing',
    type: 'text',
    text: 'Location of Signing:',
    defaultNextId: 'date_signing'
  },
  'date_signing': {
    id: 'date_signing',
    type: 'date',
    text: 'Date of Signing (for possession timeline reference):',
    defaultNextId: 'seller_info'
  },
  'seller_info': {
    id: 'seller_info',
    type: 'party',
    text: 'Seller (Party 1) Information:',
    defaultNextId: 'buyer_info'
  },
  'buyer_info': {
    id: 'buyer_info',
    type: 'party',
    text: 'Buyer (Party 2) Information:',
    defaultNextId: 'property_info'
  },
  'property_info': {
    id: 'property_info',
    type: 'property',
    text: 'Property Details:',
    defaultNextId: 'sale_price_info'
  },
  'sale_price_info': {
    id: 'sale_price_info',
    type: 'money',
    text: 'Sale Price Details:',
    defaultNextId: 'end_investment_period'
  },
  'end_investment_period': {
    id: 'end_investment_period',
    type: 'date',
    text: 'End of Investment Period (for construction completion):',
    defaultNextId: 'arbitration_info'
  },
  'arbitration_info': {
    id: 'arbitration_info',
    type: 'text',
    text: 'Governing Details:',
    defaultNextId: 'seller_notice_info'
  },
  'seller_notice_info': {
    id: 'seller_notice_info',
    type: 'notice',
    text: 'Seller Notice Information:',
    defaultNextId: 'buyer_notice_info'
  },
  'buyer_notice_info': {
    id: 'buyer_notice_info',
    type: 'notice',
    text: 'Buyer Notice Information:',
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your Agreement to Sell based on your answers.',
  }
};

const AgreementToSellForm = () => {
  const [currentSectionId, setCurrentSectionId] = useState<string>('general_details');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['general_details']);
  const [isComplete, setIsComplete] = useState(false);
  const [seller, setSeller] = useState<Party>({ name: '', address: '' });
  const [buyer, setBuyer] = useState<Party>({ name: '', address: '' });
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({ description: '', scheduleNumber: '' });
  const [salePrice, setSalePrice] = useState<SalePrice>({ numerical: '', worded: '' });
  const [sellerNotice, setSellerNotice] = useState<NoticeInfo>({ address: '', phone: '', email: '' });
  const [buyerNotice, setBuyerNotice] = useState<NoticeInfo>({ address: '', phone: '', email: '' });
  const [arbitrationDetails, setArbitrationDetails] = useState<ArbitrationDetails>({ 
    jurisdiction: '', 
    arbitratorName: '', 
    umpireName: '' 
  });
  const [agreementDate, setAgreementDate] = useState<Date>();
  const [signingDate, setSigningDate] = useState<Date>();
  const [investmentEndDate, setInvestmentEndDate] = useState<Date>();
  
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

  const updatePropertyDetails = (field: keyof PropertyDetails, value: string) => {
    setPropertyDetails({ ...propertyDetails, [field]: value });
  };

  const updateSalePrice = (field: keyof SalePrice, value: string) => {
    setSalePrice({ ...salePrice, [field]: value });
  };

  const updateNoticeInfo = (type: 'seller' | 'buyer', field: keyof NoticeInfo, value: string) => {
    if (type === 'seller') {
      setSellerNotice({ ...sellerNotice, [field]: value });
    } else {
      setBuyerNotice({ ...buyerNotice, [field]: value });
    }
  };

  const updateArbitrationDetails = (field: keyof ArbitrationDetails, value: string) => {
    setArbitrationDetails({ ...arbitrationDetails, [field]: value });
  };
  
  const renderQuestionInput = (questionId: string) => {
    const question = questions[questionId];
    
    switch (question.type) {
      case 'text':
        if (questionId === 'location_signing') {
          return (
            <div className="mb-4">
              <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
                {question.text}
              </Label>
              <Input
                id={questionId}
                value={answers[questionId] || 'Islamabad'}
                onChange={(e) => handleAnswer(questionId, e.target.value)}
                placeholder="Location of signing (default: Islamabad)"
                className="mt-1 text-black w-full"
              />
            </div>
          );
        }
        
        if (questionId === 'arbitration_info') {
          return (
            <div className="mb-4">
              <Label className="block text-sm font-medium text-black mb-2">
                {question.text}
              </Label>
              <div className="border rounded-lg p-4 space-y-3">
                <div>
                  <Label className="text-sm">Jurisdiction / Governing Law Location</Label>
                  <Input
                    value={arbitrationDetails.jurisdiction}
                    onChange={(e) => updateArbitrationDetails('jurisdiction', e.target.value)}
                    placeholder="Enter jurisdiction (e.g., Islamabad, Pakistan)"
                    className="text-black"
                  />
                </div>
                <div>
                  <Label className="text-sm">Arbitrator Name (optional)</Label>
                  <Input
                    value={arbitrationDetails.arbitratorName}
                    onChange={(e) => updateArbitrationDetails('arbitratorName', e.target.value)}
                    placeholder="Enter arbitrator name if agreed in advance"
                    className="text-black"
                  />
                </div>
                <div>
                  <Label className="text-sm">Umpire Name (optional)</Label>
                  <Input
                    value={arbitrationDetails.umpireName}
                    onChange={(e) => updateArbitrationDetails('umpireName', e.target.value)}
                    placeholder="Enter umpire name if agreed in advance"
                    className="text-black"
                  />
                </div>
              </div>
            </div>
          );
        }
        
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
      case 'date':
        let dateValue: Date | undefined;
        let setDateValue: (date: Date | undefined) => void;
        let isOptional = false;
        
        if (questionId === 'agreement_date') {
          dateValue = agreementDate;
          setDateValue = setAgreementDate;
        } else if (questionId === 'date_signing') {
          dateValue = signingDate;
          setDateValue = setSigningDate;
        } else if (questionId === 'end_investment_period') {
          dateValue = investmentEndDate;
          setDateValue = setInvestmentEndDate;
          isOptional = true;
        }
        
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-1">
              {question.text} {isOptional && <span className="text-gray-500">(Optional)</span>}
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
      case 'property':
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Description of Demised Property</Label>
                <Textarea
                  value={propertyDetails.description}
                  onChange={(e) => updatePropertyDetails('description', e.target.value)}
                  placeholder="Enter detailed description of the property"
                  className="text-black"
                  rows={4}
                />
              </div>
              <div>
                <Label className="text-sm">Schedule Number for Documents</Label>
                <Input
                  value={propertyDetails.scheduleNumber}
                  onChange={(e) => updatePropertyDetails('scheduleNumber', e.target.value)}
                  placeholder="Enter schedule number"
                  className="text-black"
                />
              </div>
            </div>
          </div>
        );
      case 'money':
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Sale Price (Numerical Figure)</Label>
                <Input
                  value={salePrice.numerical}
                  onChange={(e) => updateSalePrice('numerical', e.target.value)}
                  placeholder="Enter amount (e.g., 5000000)"
                  className="text-black"
                  type="number"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label className="text-sm">Sale Price (Worded Figure)</Label>
                <Input
                  value={salePrice.worded}
                  onChange={(e) => updateSalePrice('worded', e.target.value)}
                  placeholder="Enter amount in words (e.g., Five Million Rupees)"
                  className="text-black"
                />
              </div>
            </div>
          </div>
        );
      case 'notice':
        const isSellerNotice = questionId === 'seller_notice_info';
        const noticeInfo = isSellerNotice ? sellerNotice : buyerNotice;
        const noticeType = isSellerNotice ? 'seller' : 'buyer';
        
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Address for Notice</Label>
                <Textarea
                  value={noticeInfo.address}
                  onChange={(e) => updateNoticeInfo(noticeType as 'seller' | 'buyer', 'address', e.target.value)}
                  placeholder="Enter complete address for notices"
                  className="text-black"
                  rows={3}
                />
              </div>
              <div>
                <Label className="text-sm">Phone Number</Label>
                <Input
                  value={noticeInfo.phone}
                  onChange={(e) => updateNoticeInfo(noticeType as 'seller' | 'buyer', 'phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Email Address</Label>
                <Input
                  value={noticeInfo.email}
                  onChange={(e) => updateNoticeInfo(noticeType as 'seller' | 'buyer', 'email', e.target.value)}
                  placeholder="Enter email address"
                  className="text-black"
                  type="email"
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
      return agreementDate && answers.location_signing && signingDate;
    }
    if (currentSectionId === 'seller_info') {
      return seller.name && seller.address;
    }
    if (currentSectionId === 'buyer_info') {
      return buyer.name && buyer.address;
    }
    if (currentSectionId === 'property_details') {
      return propertyDetails.description && propertyDetails.scheduleNumber;
    }
    if (currentSectionId === 'sale_price') {
      return salePrice.numerical && salePrice.worded;
    }
    if (currentSectionId === 'project_details') {
      return true; // Investment end date is optional
    }
    if (currentSectionId === 'governing_details') {
      return arbitrationDetails.jurisdiction; // Only jurisdiction is required
    }
    if (currentSectionId === 'notice_info') {
      return sellerNotice.address && sellerNotice.phone && sellerNotice.email && 
             buyerNotice.address && buyerNotice.phone && buyerNotice.email;
    }
    
    // Default validation
    return true;
  };

  const generateAgreementToSellPDF = () => {
    try {
      console.log("Generating Agreement to Sell PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Agreement to Sell", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Introduction paragraph
      const agreementDateStr = agreementDate ? format(agreementDate, 'MMMM dd, yyyy') : '_______________';
      const locationSigning = answers.location_signing || 'Islamabad';
      
      const introText = `This Agreement to Sell ("Agreement") is entered into on ${agreementDateStr}, at ${locationSigning}, by and between ${seller.name || '_______________'} ("Seller") and ${buyer.name || '_______________'} ("Buyer").`;
      
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
      const sellerInfoText = `The Seller hereby agrees to sell the property as specified in this Agreement. Seller's details: Name: ${seller.name || '_______________'}, Residential Address: ${seller.address || '_______________________________________________'}.`;
      
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
      const buyerInfoText = `The Buyer hereby agrees to purchase the property as specified in this Agreement. Buyer's details: Name: ${buyer.name || '_______________'}, Residential Address: ${buyer.address || '_______________________________________________'}.`;
      
      const buyerInfoLines = doc.splitTextToSize(buyerInfoText, 170);
      buyerInfoLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Property Details Section
      doc.setFont("helvetica", "bold");
      doc.text("Property Details.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const propertyText = `The property being sold under this Agreement is described as follows: ${propertyDetails.description || '_______________________________________________'}. The Schedule Number for related documents is: ${propertyDetails.scheduleNumber || '_______________'}.`;
      
      const propertyLines = doc.splitTextToSize(propertyText, 170);
      propertyLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 20;
      }
      
      // Sale Price Section
      doc.setFont("helvetica", "bold");
      doc.text("Sale Price and Payment Terms.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const salePriceText = `The agreed sale price for the property is Rs. ${salePrice.numerical || '_______________'} (${salePrice.worded || '_______________'}). The Buyer agrees to pay this amount according to the terms specified in this Agreement.`;
      
      const salePriceLines = doc.splitTextToSize(salePriceText, 170);
      salePriceLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Transfer and Possession Section
      doc.setFont("helvetica", "bold");
      doc.text("Transfer and Possession.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const signingDateStr = signingDate ? format(signingDate, 'MMMM dd, yyyy') : '_______________';
      const transferText = `The possession of the property shall be delivered within 2 years from the date of signing (${signingDateStr}). The delivery timeline for vacant possession is fixed at 2 years from the signing date.`;
      
      const transferLines = doc.splitTextToSize(transferText, 170);
      transferLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Financial Obligations Section
      doc.setFont("helvetica", "bold");
      doc.text("Financial Obligations.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const financialText = `The responsibility for utility bills shall be transferred to the Buyer upon execution of the Sale Deed. Stamp duty and registration fees shall be paid by the Buyer. All other financial obligations shall be as mutually agreed by the parties.`;
      
      const financialLines = doc.splitTextToSize(financialText, 170);
      financialLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Project/Construction Details (if applicable)
      if (investmentEndDate) {
        doc.setFont("helvetica", "bold");
        doc.text("Project and Construction Details.", 15, y);
        y += lineHeight;
        
        doc.setFont("helvetica", "normal");
        const investmentEndStr = format(investmentEndDate, 'MMMM dd, yyyy');
        const projectText = `The end of investment period for construction completion is set for ${investmentEndStr}. All construction and development work shall be completed by this date.`;
        
        const projectLines = doc.splitTextToSize(projectText, 170);
        projectLines.forEach((line: string) => {
          doc.text(line, 15, y);
          y += lineHeight;
        });
        y += lineHeight;
      }
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // Governing Law and Arbitration Section
      doc.setFont("helvetica", "bold");
      doc.text("Governing Law and Arbitration.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      let governingText = `This Agreement shall be governed by and construed in accordance with the laws of ${arbitrationDetails.jurisdiction || '_______________'}. `;
      
      if (arbitrationDetails.arbitratorName || arbitrationDetails.umpireName) {
        governingText += `In case of disputes, the matter shall be referred to arbitration. `;
        if (arbitrationDetails.arbitratorName) {
          governingText += `The appointed Arbitrator is ${arbitrationDetails.arbitratorName}. `;
        }
        if (arbitrationDetails.umpireName) {
          governingText += `The appointed Umpire is ${arbitrationDetails.umpireName}. `;
        }
      } else {
        governingText += `Any disputes arising from this Agreement shall be resolved through appropriate legal channels in the specified jurisdiction.`;
      }
      
      const governingLines = doc.splitTextToSize(governingText, 170);
      governingLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Notice Information Section
      doc.setFont("helvetica", "bold");
      doc.text("Notice Information.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const noticeText = `All notices and communications under this Agreement shall be sent to the following addresses: For Seller - Address: ${sellerNotice.address || '_______________'}, Phone: ${sellerNotice.phone || '_______________'}, Email: ${sellerNotice.email || '_______________'}. For Buyer - Address: ${buyerNotice.address || '_______________'}, Phone: ${buyerNotice.phone || '_______________'}, Email: ${buyerNotice.email || '_______________'}.`;
      
      const noticeLines = doc.splitTextToSize(noticeText, 170);
      noticeLines.forEach((line: string) => {
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
      y += lineHeight;
      doc.text("Date: _________________", 15, y);
      y += lineHeight + 8;
      
      // Buyer signature
      doc.text("The Buyer:", 15, y);
      y += lineHeight + 5;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${buyer.name || '_______________'} (Printed Name)`, 15, y);
      y += lineHeight;
      doc.text("Date: _________________", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `agreement_to_sell_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Agreement to Sell successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Agreement to Sell");
      return null;
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Agreement to Sell Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">General Details</h4>
              <p><strong>Agreement Date:</strong> {agreementDate ? format(agreementDate, 'dd/MM/yyyy') : 'Not provided'}</p>
              <p><strong>Location of Signing:</strong> {answers.location_signing || 'Not provided'}</p>
              <p><strong>Date of Signing:</strong> {signingDate ? format(signingDate, 'dd/MM/yyyy') : 'Not provided'}</p>
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
              <h4 className="font-medium text-sm">Property Details</h4>
              <p><strong>Description:</strong> {propertyDetails.description || 'Not provided'}</p>
              <p><strong>Schedule Number:</strong> {propertyDetails.scheduleNumber || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Sale Price</h4>
              <p><strong>Numerical:</strong> Rs. {salePrice.numerical || 'Not provided'}</p>
              <p><strong>In Words:</strong> {salePrice.worded || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Project Details</h4>
              <p><strong>Investment End Date:</strong> {investmentEndDate ? format(investmentEndDate, 'dd/MM/yyyy') : 'Not specified'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Governing Details</h4>
              <p><strong>Jurisdiction:</strong> {arbitrationDetails.jurisdiction || 'Not provided'}</p>
              <p><strong>Arbitrator:</strong> {arbitrationDetails.arbitratorName || 'Not specified'}</p>
              <p><strong>Umpire:</strong> {arbitrationDetails.umpireName || 'Not specified'}</p>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-medium text-sm">Notice Information</h4>
              <p><strong>Seller Contact:</strong> {sellerNotice.email || 'Not provided'} / {sellerNotice.phone || 'Not provided'}</p>
              <p><strong>Buyer Contact:</strong> {buyerNotice.email || 'Not provided'} / {buyerNotice.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Agreement to Sell.
          </p>
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-green-600">Agreement to Sell</CardTitle>
          <CardDescription>
            Review your Agreement to Sell details below before generating the final document.
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
              setPropertyDetails({ description: '', scheduleNumber: '' });
              setSalePrice({ numerical: '', worded: '' });
              setSellerNotice({ address: '', phone: '', email: '' });
              setBuyerNotice({ address: '', phone: '', email: '' });
              setArbitrationDetails({ jurisdiction: '', arbitratorName: '', umpireName: '' });
              setAgreementDate(undefined);
              setSigningDate(undefined);
              setInvestmentEndDate(undefined);
            }}
          >
            Start Over
          </Button>
          <Button 
            onClick={generateAgreementToSellPDF}
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

export default AgreementToSellForm;
