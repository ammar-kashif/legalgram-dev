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
  type: 'text' | 'textarea' | 'confirmation' | 'date' | 'number' | 'party' | 'money' | 'property' | 'notice' | 'select';
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
  'state_selection': {
    id: 'state_selection',
    title: 'State Selection',
    description: 'Select the state where this agreement will be executed',
    questions: ['state'],
    nextSectionId: 'general_details'
  },
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
  'state': {
    id: 'state',
    type: 'select',
    text: 'Select the state where this agreement will be executed:',
    options: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
      'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
      'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
      'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
      'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ],
    defaultNextId: 'agreement_date'
  },
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

const AgreementToSellForm = () => {  const [currentSectionId, setCurrentSectionId] = useState<string>('state_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['state_selection']);
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
              </div>            </div>
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
    if (currentSectionId === 'state_selection') {
      return answers.state;
    }
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
      doc.text("AGREEMENT TO SELL", 105, 20, { align: "center" });
      
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
      const locationSigning = answers.location_signing || 'Islamabad';
      const signingDateStr = signingDate ? format(signingDate, 'MMMM dd, yyyy') : '_______________';
      const investmentEndStr = investmentEndDate ? format(investmentEndDate, 'MMMM dd, yyyy') : '_______________';
      
      // Agreement Header
      addText(`This AGREEMENT TO SELL ("Agreement") is made at ${locationSigning} on this ${agreementDateStr} ("Effective Date").`);
      
      // Parties Section
      addText("BY AND BETWEEN", true, 12);
      
      addText(`${seller.name || '[SELLER NAME]'}, residing at ${seller.address || '[SELLER FULL RESIDENTIAL ADDRESS]'}, hereinafter referred to as the "Seller", which expression shall, where the context so admits, shall include their respective legal heirs, agents, successors-in-interest and permitted assigns);`);
      
      addText("AND", true, 11, 105);
      
      addText(`${buyer.name || '[BUYER NAME]'}, residing at ${buyer.address || '[BUYER FULL RESIDENTIAL ADDRESS]'} (hereinafter referred to as the "Buyer", which expression shall, where the context so admits, shall include their respective legal heirs, agents, successors-in-interest and permitted assigns).`);
      
      addText(`(The Seller and Buyer may individually be referred to as "Party" or collectively as "Parties").`);
      
      // RECITALS Section
      addText("RECITALS", true, 12);
      
      addText(`WHEREAS, the Seller hereby warrants and represents that it is the absolute, rightful and lawful title holder/owner of the ${propertyDetails.description || '[PROPERTY DETAILS]'}.`);
      
      addText(`WHEREAS, the Seller is desirous of selling the commercial property, as identified as ("Demised Property") to the Buyer and the Buyer is desirous of purchasing Demised Property, free from all and/or any liens, charges, mortgages, claims, disputes, litigation and/or any other restraints likely to impede the transfer of title from the Seller to the Buyer, (including but not limited to the ability of the Buyer to further sell the Demised Property) of whatsoever nature relating thereto or its antecedents ("Encumbrances");`);
      
      addText(`AND WHEREAS, the Parties have agreed to the terms and conditions on which the sale and transfer of the Demised Property through the Seller to the Buyer shall take place, and each of them wishes to reduce the same in writing.`);
      
      addText("NOW, THEREFORE, THIS AGREEMENT WITNESSETH AS FOLLOWS:", true);
      
      // ARTICLE 1 - THE TRANSACTION
      addText("ARTICLE 1", true, 12);
      addText("THE TRANSACTION", true, 12);
      
      addText("Subject to Terms and Conditions of this Agreement, the Seller agrees to sell the Demised Property to the Buyer, together with the full and complete rights of ownership to the Demised Property, free from any and/or all Encumbrances and together with all other rights, interests, liberties, easements, privileges, appendages and appurtenances whatsoever relating to the Demised Property or belonging thereto or in any way appertaining to or usually held, used, occupied or enjoyed or reputed to belong to or be appurtenant to the Demised Property or any part thereof, and the Buyer agrees to purchase the same, subject to the Terms and Conditions herein.");
      
      addText(`The total value of the Demised Property, as mutually decided between the Parties is Rs. ${salePrice.numerical || '[NUMERICAL AMOUNT]'}/- (${salePrice.worded || '[WORDED AMOUNT]'}) which constitutes the Sale Price for the Demised Property.`);
      
      addText("The Seller affirms that they have duly received the Sale Price for the Demised Property and the Seller shall:");
      
      addText("a) Hand over peaceful vacant possession of the Demised Property to the Buyer within two (02) years from the date of Signing of Agreement;", false, 11, 20);
      addText("b) Execute a sale deed for the transfer of title of the Demised Property in the Buyer's name;", false, 11, 20);
      addText(`c) Hand over all documents/things relating to the Demised Property as specified in Schedule ${propertyDetails.scheduleNumber || '[SCHEDULE NUMBER]'} hereto;`, false, 11, 20);
      
      addText("The Seller shall be responsible for any and/or all charges, dues, claims, and demands, including utility bills (including but not limited to electricity, gas, water and telephone) in respect of the Demised Property up to the date of executing a sale deed in pursuant to this Agreement, and the Seller confirms that no such dues remain outstanding or unpaid. Upon execution of the sale deed, the Buyer shall be wholly responsible for payment of all charges and bills for utilities as furnished to the Demised Property.");
      
      addText("All taxes, charges, stamp duty and dues in respect of the transfer of the Demised Property shall be on account of the Buyer.");
      
      // ARTICLE 2 - REPRESENTATIONS AND WARRANTIES
      addText("ARTICLE 2", true, 12);
      addText("REPRESENTATIONS AND WARRANTIES", true, 12);
      
      // Of Seller
      addText("Of Seller:", true, 11);
      addText("The Seller, by Signing the Agreement, hereby represents and warrants that:");
      
      addText("2.1 The Seller has all requisite power and authority to execute and deliver the Agreement and to perform its obligations under the Terms and Conditions of Agreement. The execution, delivery and performance of this Agreement and the consummation of The Transaction by the Seller have been duly authorised upon necessary action on the part of Seller;", false, 11, 20);
      
      addText("2.2 The Seller represents that it is duly incorporated, validly existing and in good standing under the laws of state, and has all requisite power and authority to conduct its business as presently conducted;", false, 11, 20);
      
      addText("2.3 The Seller is the lawful beneficiary of the Sale Price mentioned herein and hold no pending claims against any party with regard to the same;", false, 11, 20);
      
      addText("2.4 The Seller has not indulged in any activities that may render/expose the Buyer in/to any litigation, civil or criminal proceedings before any court or tribunal, and no such proceedings are pending or threatened against the Seller;", false, 11, 20);
      
      addText(`2.5 The Seller shall complete construction of the Demised Property by ${investmentEndStr};`, false, 11, 20);
      
      addText("2.6 The Seller shall from, and after Effective Date, defend and promptly indemnify and hold harmless the Buyer against for and in respect of and pay any and all losses, claims, demands, punitive damages, expenses, causes of action, judgement and/or costs suffered, sustained, incurred or required to be paid by any such party arising out of any acts including but not limited to:", false, 11, 20);
      
      addText("a) Any breach of any representation, warranty, covenant or agreement with any third-party contained in the Agreement or any requisite documentation and certification;", false, 11, 25);
      addText("b) Any other taxes or any liability which, prior to the Effective Date, the Seller was accountable for;", false, 11, 25);
      addText("c) All operations and actions of the Seller before and after the Effective Date; and", false, 11, 25);
      addText("d) Any and all Applicable Laws and compliance thereof.", false, 11, 25);
      
      addText("2.7 The Seller shall not delay any act and shall do so within fourteen (14) days from the date of Signing or when any requisite act is no longer contingent on any act of Buyer;", false, 11, 20);
      
      addText("2.8 The Seller shall be responsible to ensure security arrangements and yearly maintenance of the Demised Property on notified service charges after completion and transfer of the Demised Property to the Buyer;", false, 11, 20);
      
      addText("2.9 In a situation, where the Project gets cancelled or discontinued for any unforeseen reason, the Seller shall be bound to return the full amounts as received towards Sale Price, to the Buyer, without any deduction or administrative charge paid by the Buyer;", false, 11, 20);
      
      addText("2.10 The Seller undertakes to have read all Terms and Conditions of this Agreement and explicitly confirms their acceptance of all Terms and Conditions of this Agreement without any reservation and or confusion.", false, 11, 20);
      
      // Of Buyer
      addText("Of Buyer:", true, 11);
      addText("The Buyer, by Signing the Agreement, hereby represents and warrants that:");
      
      addText("2.11 The Buyer acknowledges that as the Project is on-going construction, the Demised Property shall remain non-transferable and possession shall not be handed over even after reception of Sale Price by Seller;", false, 11, 20);
      
      addText("2.12 The Buyer shall not sell or transfer the Demised Property without taking an NOC from the Seller in order to avoid unauthorised/unfair use of the Demised Property;", false, 11, 20);
      
      addText("2.13 The Buyer shall not carry out any unreasonable additions or alterations involving structural/elevation changes in the Demised Property or cause unreasonable disturbance to neighbours by making changes within the Demised Property's structure;", false, 11, 20);
      
      addText("2.14 The Buyer may request the Seller to use any special/specific materials/fittings within the Demised Property for their specific need, and such request shall be made in advance in order to ensure feasibility for the Seller. Costs resulting from such requests shall be paid for by the Buyer;", false, 11, 20);
      
      addText("2.15 The Buyer shall enjoy all the rights to the Demised Property as per its covered area only, whereas, the rooftop, lawns, footpaths, passages and rest of the space of Project shall remain property of the Seller and the Buyer shall not construct/carry out any encroachment of any sort anywhere within the Project;", false, 11, 20);
      
      addText("2.16 The Buyer undertakes to have read all Terms and Conditions of this Agreement and explicitly confirms their acceptance of all Terms and Conditions of this Agreement without any reservation and or confusion.", false, 11, 20);
      
      // ARTICLE 3 - CONFIDENTIAL INFORMATION
      addText("ARTICLE 3", true, 12);
      addText("CONFIDENTIAL INFORMATION", true, 12);
      
      addText("During and after the execution of this Agreement, the Parties hereby agree to retain the Confidential Information in strict confidence, to protect the security, integrity and confidentiality of such information and to not permit unauthorised access, use, disclosure, publication or dissemination of Confidential Information except in conformity with this Agreement.");
      
      // ARTICLE 4 - STAMP AND REGISTRATION
      addText("ARTICLE 4", true, 12);
      addText("STAMP AND REGISTRATION", true, 12);
      
      addText("This Agreement shall be stamped and duly registered. The Buyer shall be responsible to pay the Stamp Duty and Registration Fee. The Seller shall extend full cooperation in completing the Signing, Stamping and Registration formalities.");
      
      // ARTICLE 5 - GOVERNING LAW AND JURISDICTION
      addText("ARTICLE 5", true, 12);
      addText("GOVERNING LAW AND JURISDICTION", true, 12);
      
      addText(`This Agreement shall be construed in accordance with and governed by the laws of ${arbitrationDetails.jurisdiction || '[JURISDICTION]'} and the Parties shall ensure compliance thereof.`);
      
      // ARTICLE 6 - DISPUTE RESOLUTION
      addText("ARTICLE 6", true, 12);
      addText("DISPUTE RESOLUTION", true, 12);
      
      addText("Any difference and/or disputes arising between the Parties involving the Agreements or any part thereof shall first be settled amicably in the spirit of goodwill and mutual accommodation, which, if not possible within fifteen (15) days from thereof, then the matter shall be settled by reference to Arbitration which shall precede any court action.");
      
      addText("If the Parties cannot agree on the appointment of a sole Arbitrator, then each Party shall appoint one Arbitrator. In the event of disagreement between such Arbitrators, the matters shall be referred to an Umpire, appointed by the Arbitrators, whose decision shall be final and binding upon the Parties.");
      
      // ARTICLE 7 - FORCE MAJEURE
      addText("ARTICLE 7", true, 12);
      addText("FORCE MAJEURE", true, 12);
      
      addText("In case of any Force Majeure Event, the affected Party shall notify the other via a Notice within forty-eight (48) hours describing the Force Majeure Event in reasonable detail and the obligations affected by such event along with a preliminary estimate of delay which shall affect the execution of any such obligations.");
      
      // ARTICLE 8 - NOTICE
      addText("ARTICLE 8", true, 12);
      addText("NOTICE", true, 12);
      
      addText("Wherever, by the terms of this Agreement, notice, demand or other communication shall or may be given to either Party, the same shall be in writing and addressed to such Party at its address, cellular number and/or e-mail address set forth, or to such other address or addresses as shall from time to time be designated by written notice by such Party to the other.");
      
      // Notice Details
      addText("Seller Contact Information:", true, 11);
      addText(`Address: ${sellerNotice.address || '[SELLER ADDRESS]'}`, false, 11, 20);
      addText(`Phone: ${sellerNotice.phone || '[SELLER PHONE]'}`, false, 11, 20);
      addText(`Email: ${sellerNotice.email || '[SELLER EMAIL]'}`, false, 11, 20);
      
      addText("Buyer Contact Information:", true, 11);
      addText(`Address: ${buyerNotice.address || '[BUYER ADDRESS]'}`, false, 11, 20);
      addText(`Phone: ${buyerNotice.phone || '[BUYER PHONE]'}`, false, 11, 20);
      addText(`Email: ${buyerNotice.email || '[BUYER EMAIL]'}`, false, 11, 20);
      
      // ARTICLE 9 - SEVERABILITY
      addText("ARTICLE 9", true, 12);
      addText("SEVERABILITY", true, 12);
      
      addText("In the event that any provision of this Agreement is found to be void and unenforceable by a court of competent jurisdiction, then the remaining provisions shall remain in force in accordance with the Parties' intentions.");
      
      // Add some space before signatures
      y += 15;
      
      // Check if we need a new page for signatures
      if (y > pageHeight - 120) {
        doc.addPage();
        y = 20;
      }
      
      // IN WITNESS WHEREOF
      addText("IN WITNESS WHEREOF, the Parties hereto have executed this Agreement at the place and on the date hereinabove indicated.", true);
      
      y += 10;
      
      // SIGNATURES
      addText("SIGNATURES:", true, 12);
      
      // Seller signature
      doc.text("On Behalf of Seller:", 15, y);
      y += lineHeight + 10;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`Name: ${seller.name || '[SELLER NAME]'}`, 15, y);
      y += lineHeight;
      doc.text("Designation: ____________________", 15, y);
      y += lineHeight;
      doc.text(`Date: ${agreementDateStr}`, 15, y);
      y += lineHeight + 15;
      
      // Buyer signature (right aligned)
      let buyerY = y - (lineHeight * 5 + 15); // Align with seller signature
      doc.text("Buyer:", 120, buyerY);
      buyerY += lineHeight + 10;
      doc.text("____________________________", 120, buyerY);
      buyerY += lineHeight;
      doc.text(`Name: ${buyer.name || '[BUYER NAME]'}`, 120, buyerY);
      buyerY += lineHeight;
      doc.text("Signature", 120, buyerY);
      buyerY += lineHeight;
      doc.text(`Date: ${agreementDateStr}`, 120, buyerY);
      
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
  };  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Comprehensive Agreement to Sell Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Agreement Details</h4>
              <p><strong>State:</strong> {answers.state || 'Not provided'}</p>
              <p><strong>Effective Date:</strong> {agreementDate ? format(agreementDate, 'dd/MM/yyyy') : 'Not provided'}</p>
              <p><strong>Location of Signing:</strong> {answers.location_signing || 'Not provided'}</p>
              <p><strong>Signing Reference Date:</strong> {signingDate ? format(signingDate, 'dd/MM/yyyy') : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Seller Information</h4>
              <p><strong>Name:</strong> {seller.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {seller.address || 'Not provided'}</p>
              <p><strong>Notice Contact:</strong> {sellerNotice.email || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Buyer Information</h4>
              <p><strong>Name:</strong> {buyer.name || 'Not provided'}</p>
              <p><strong>Address:</strong> {buyer.address || 'Not provided'}</p>
              <p><strong>Notice Contact:</strong> {buyerNotice.email || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Demised Property</h4>
              <p><strong>Description:</strong> {propertyDetails.description || 'Not provided'}</p>
              <p><strong>Schedule Number:</strong> {propertyDetails.scheduleNumber || 'Not provided'}</p>
              <p><strong>Status:</strong> Free from all encumbrances</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Financial Terms</h4>
              <p><strong>Sale Price:</strong> Rs. {salePrice.numerical || 'Not provided'}</p>
              <p><strong>In Words:</strong> {salePrice.worded || 'Not provided'}</p>
              <p><strong>Payment Status:</strong> Received by Seller</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Key Timelines</h4>
              <p><strong>Possession Delivery:</strong> Within 2 years from signing</p>
              <p><strong>Construction Completion:</strong> {investmentEndDate ? format(investmentEndDate, 'dd/MM/yyyy') : 'Not specified'}</p>
              <p><strong>Dispute Resolution:</strong> 15 days amicable, then arbitration</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Legal Framework</h4>
              <p><strong>Governing Jurisdiction:</strong> {arbitrationDetails.jurisdiction || 'Not provided'}</p>
              <p><strong>Arbitrator:</strong> {arbitrationDetails.arbitratorName || 'To be appointed'}</p>
              <p><strong>Umpire:</strong> {arbitrationDetails.umpireName || 'To be appointed if needed'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Responsibilities</h4>
              <p><strong>Stamp Duty & Registration:</strong> Buyer's responsibility</p>
              <p><strong>Utility Bills (pre-sale):</strong> Seller's responsibility</p>
              <p><strong>Utility Bills (post-sale):</strong> Buyer's responsibility</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Comprehensive Agreement Features:</h4>
            <ul className="text-sm space-y-1">
              <li>• Complete 9-article legal structure with detailed terms</li>
              <li>• Comprehensive representations and warranties for both parties</li>
              <li>• Detailed construction and project completion provisions</li>
              <li>• Confidentiality and non-disclosure clauses</li>
              <li>• Force majeure and dispute resolution mechanisms</li>
              <li>• Full legal compliance with property transfer laws</li>
              <li>• Professional stamp duty and registration requirements</li>
            </ul>
          </div>
        </div>
          <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This comprehensive agreement will serve as your official Agreement to Sell with 
            complete legal protections, warranties, and transfer procedures for both parties.
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
            onClick={() => {              setCurrentSectionId('state_selection');
              setSectionHistory(['state_selection']);
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
