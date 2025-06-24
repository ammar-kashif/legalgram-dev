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
  type: 'text' | 'select' | 'textarea' | 'confirmation' | 'date' | 'party' | 'witness' | 'number';
  text: string;
  options?: string[];
  nextQuestionId?: Record<string, string>;
  defaultNextId?: string;
}

// Party interface (Seller/Buyer)
interface Party {
  name: string;
  cnic: string;
  address?: string;
}

// Witness interface
interface Witness {
  name: string;
  cnic: string;
}

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'state_selection': {
    id: 'state_selection',
    title: 'State Selection',
    description: 'Select the state where this Sale Agreement will be executed',
    questions: ['state'],
    nextSectionId: 'general_details'
  },
  'general_details': {
    id: 'general_details',
    title: 'General Details',
    description: 'Enter the basic details of the Sale Agreement',
    questions: ['effective_date', 'business_name', 'sale_price'],
    nextSectionId: 'seller_info'
  },
  'seller_info': {
    id: 'seller_info',
    title: 'Seller Information',
    description: 'Enter details of the party selling the business',
    questions: ['seller_info'],
    nextSectionId: 'buyer_info'
  },
  'buyer_info': {
    id: 'buyer_info',
    title: 'Buyer Information',
    description: 'Enter details of the party buying the business',
    questions: ['buyer_info'],
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
  'state': {
    id: 'state',
    type: 'select',
    text: 'Select your state:',
    options: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
    defaultNextId: 'effective_date'
  },
  'effective_date': {
    id: 'effective_date',
    type: 'date',
    text: 'Effective Date of Agreement:',
    defaultNextId: 'business_name'
  },
  'business_name': {
    id: 'business_name',
    type: 'text',
    text: 'Business Name:',
    defaultNextId: 'sale_price'
  },
  'sale_price': {
    id: 'sale_price',
    type: 'number',
    text: 'Sale Price:',
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
    text: 'Thank you for providing the information. We will generate your Sale Agreement based on your answers.',
  }
};

const SaleAgreementForm = () => {  const [currentSectionId, setCurrentSectionId] = useState<string>('state_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['state_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [seller, setSeller] = useState<Party>({ name: '', cnic: '', address: '' });
  const [buyer, setBuyer] = useState<Party>({ name: '', cnic: '', address: '' });
  const [witness1, setWitness1] = useState<Witness>({ name: '', cnic: '' });
  const [witness2, setWitness2] = useState<Witness>({ name: '', cnic: '' });
  const [effectiveDate, setEffectiveDate] = useState<Date>();
  
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
      case 'number':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Input
              id={questionId}
              type="number"
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Enter amount"
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
                    !effectiveDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {effectiveDate ? format(effectiveDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={effectiveDate}
                  onSelect={setEffectiveDate}
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
                <Label className="text-sm">CNIC</Label>
                <Input
                  value={party.cnic}
                  onChange={(e) => updateParty(partyType as 'seller' | 'buyer', 'cnic', e.target.value)}
                  placeholder="Enter CNIC number"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Address (Optional)</Label>
                <Textarea
                  value={party.address || ''}
                  onChange={(e) => updateParty(partyType as 'seller' | 'buyer', 'address', e.target.value)}
                  placeholder="Enter address"
                  className="text-black"
                  rows={2}
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
                  placeholder="Enter witness full name"
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
    if (currentSectionId === 'state_selection') {
      return answers.state;
    }
    if (currentSectionId === 'general_details') {
      return effectiveDate && answers.business_name && answers.sale_price;
    }
    if (currentSectionId === 'seller_info') {
      return seller.name && seller.cnic;
    }
    if (currentSectionId === 'buyer_info') {
      return buyer.name && buyer.cnic;
    }
    if (currentSectionId === 'witnesses') {
      return witness1.name && witness1.cnic && witness2.name && witness2.cnic;
    }
    
    // Default validation
    return true;
  };

  const generateSaleAgreementPDF = () => {
    try {
      console.log("Generating Sale Agreement PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("SALE AGREEMENT", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Introduction paragraph
      const effectiveDateStr = effectiveDate ? format(effectiveDate, 'MMMM dd, yyyy') : '_______________';
      
      const introText = `This SALE AGREEMENT ("Agreement") is made at Islamabad on this ${effectiveDateStr} ("Effective Date").`;
      
      const introLines = doc.splitTextToSize(introText, 170);
      introLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight * 1.5;
      
      // BY AND BETWEEN Section
      doc.setFont("helvetica", "bold");
      doc.text("BY AND BETWEEN", 15, y);
      y += lineHeight * 1.5;
      
      doc.setFont("helvetica", "normal");
      const party1Text = `${seller.name || '_______________'} (hereinafter referred to as the "Seller", which expression shall, where the context so admits, shall include their respective legal heirs, agents, successors-in-interest and permitted assigns);`;
      
      const party1Lines = doc.splitTextToSize(party1Text, 170);
      party1Lines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      doc.setFont("helvetica", "bold");
      doc.text("AND", 15, y);
      y += lineHeight * 1.5;
      
      doc.setFont("helvetica", "normal");
      const party2Text = `${buyer.name || '_______________'} (hereinafter referred to as the "Buyer", which expression shall, where the context so admits, shall include their respective legal heirs, agents, successors-in-interest and permitted assigns).`;
      
      const party2Lines = doc.splitTextToSize(party2Text, 170);
      party2Lines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      const collectiveText = "(The Seller and Buyers may individually be referred to as \"Party\" or collectively as \"Parties\").";
      const collectiveLines = doc.splitTextToSize(collectiveText, 170);
      collectiveLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight * 1.5;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // RECITALS Section
      doc.setFont("helvetica", "bold");
      doc.text("RECITALS", 15, y);
      y += lineHeight * 1.5;
      
      doc.setFont("helvetica", "normal");
      
      // WHEREAS clauses
      const whereas1Text = `WHEREAS, the Seller hereby warrants and represents that he is the absolute, rightful and lawful owner of business named as "${answers.business_name || '_______________'}" hereinafter referred as ("Business") plus all amenities, laboratories, pharmacies, appurtenances and/or other articles attached to the Sold Business;`;
      
      const whereas1Lines = doc.splitTextToSize(whereas1Text, 170);
      whereas1Lines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      const whereas2Text = "WHEREAS, the Seller is desirous of selling the Business to the Buyers and the Buyers is desirous of purchasing the Business, free from and/or any and all Encumbrances, mortgages, charges, liens, pledges, tenancies and or other restraints likely to impede the transfer of title from Seller to Buyers;";
      
      const whereas2Lines = doc.splitTextToSize(whereas2Text, 170);
      whereas2Lines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      const whereas3Text = "AND WHEREAS, the Parties have agreed to the terms and conditions on which the sale of Business from Seller to Buyers shall take place, and each of them wishes to reduce the same in writing.";
      
      const whereas3Lines = doc.splitTextToSize(whereas3Text, 170);
      whereas3Lines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight * 1.5;
      
      // Check if we need a new page
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 20;
      }
      
      // NOW THEREFORE Section
      doc.setFont("helvetica", "bold");
      doc.text("NOW, THEREFORE, THIS SALE DEED WITNESSTH AS FOLLOWS:", 15, y);
      y += lineHeight * 2;
      
      // THE SALE TRANSACTION
      doc.text("THE SALE TRANSACTION", 15, y);
      y += lineHeight * 1.5;
      
      doc.setFont("helvetica", "normal");
      const saleTransactionText = `The Sold Business is valued ${answers.sale_price || '_______________'} ("Sale Price") being the full and final Sale Price of the Business;`;
      
      const saleTransactionLines = doc.splitTextToSize(saleTransactionText, 170);
      saleTransactionLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      const paymentText = "The Buyers under this Sale Deed, hereby affirms that, Pursuant to this sale Agreement the Seller has made payment of Sale Price for abovementioned Business in kind vide the execution of this Sale Deed, and the Seller acknowledges the same.";
      
      const paymentLines = doc.splitTextToSize(paymentText, 170);
      paymentLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      const considerationText = "In consideration of the Sale Price paid by the Buyers to the Seller, the Seller hereby grants, conveys and assigns by way of absolute sale unto the Buyers the Sold Business.";
      
      const considerationLines = doc.splitTextToSize(considerationText, 170);
      considerationLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight * 1.5;
      
      // Check if we need a new page
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 20;
      }
      
      // REPRESENTATIONS AND WARRANTIES
      doc.setFont("helvetica", "bold");
      doc.text("REPRESENTATIONS AND WARRANTIES", 15, y);
      y += lineHeight * 1.5;
      
      doc.text("Of Seller:", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const sellerRepText = "in addition to applicable undertakings under Sale Agreement, the Seller hereby represents and warrants that:";
      
      const sellerRepLines = doc.splitTextToSize(sellerRepText, 170);
      sellerRepLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
        // Seller warranties (comprehensive)
      const warranties = [
        "The Seller has all requisite power and authority to execute and deliver the Sale Deed, and to perform its obligations under its terms and conditions;",
        "The Seller has good, valid, complete and marketable title and goodwill therein, and no one other than the Seller possesses any title, right, share or interest in or relating to the Sold Business, whether paramount, competing or otherwise, and that the Sold Business is free from all or any Encumbrances, mortgages, charges, liens, pledges, tenancies or other restraints (including the ability of the Buyers to further sell the Sold Business without any Encumbrances) whatsoever, including without limitation, claims, litigation, attachments, taxes, cesses, rates, bills for amenities or any other levy, duty or charge or dues payable to any government authority, banking or financial institution or any other person;",
        "The Seller hereby sells, transfers and conveys all of the estate, title, rights and interests free from Encumbrances in favour of the Buyers against Sale Price to be received from the Buyers;",
        "The Seller is the only owner having undisputed absolute lawful ownership-in-possession of the Sold Business;",
        "The Seller has the lawful power, authority and right to alienate, transfer, sell and convey the Sold Business fully and completely to and/or in favour of the Buyers;",
        "The Sold Business is freehold in nature and the Seller is the only lawful owner of the Sold Business hereby conveyed, sold and transferred and the Seller has not done anything or caused to be done any act or thing (covertly, overtly, directly or indirectly or through any agent or representative or anyone claiming authority on their behalf) whereby the title of the Seller in the Sold Business and/or anything in derogation of the right of the Seller to transfer the Sold Business and/or any act or thing whereby the right of the Seller to sell, transfer, assign and/or convey the Sold Business has been hindered, impaired or prejudiced in any way whatsoever;",
        "The Seller shall not claim any sort of right to or upon or in relation to the Sold Business and shall not interfere, disturb and interrupt the Sold Business;",
        "The Seller has paid or will pay up to the date of this Sale Deed, all rates, taxes, cesses, charges, dues, development charges, assessments by way of business tax or otherwise and any action, claim, loan or liability whatsoever in respect of the Sold Business due and payable to, inter alia, any Government department/agency, or any other local authority or body up to the complete satisfaction of the Buyers;",
        "The Seller hereby indemnifies and shall keep the Buyers indemnified, secured and harmless from and against all losses, claims, and demands, that may be made by the Seller or any other person/persons claiming through the Seller and/or their successor-in-interest. Any fine, penalty or liability imposed or determined by any local body or authority relating to or concerning the Sold Business up to the date of this Sale Deed shall be paid and borne by the Seller;",
        "The Seller shall, at the time of registration of this Sale Deed and thereafter, execute all such documents and papers and do every other reasonable act, deed or thing whatsoever necessary or required by the Buyers to completely and/or more perfectly and effectively secure, assign, transfer and convey the Sold Business and/or electricity, gas, telephone and water connection etc. thereon to the Buyers and shall, in this regard, sign all necessary papers/applications for mutation/transfer of the same in all Government departments/agencies or local bodies or authorities as may be required by the Buyers along with the absolute power of attorney that may be required by the Buyers:",
        "The Seller has handed over quiet, peaceful, vacant physical possession of the Sold Business to the Buyers on the date of this Sale Deed;",
        "From the date of this Sale Deed, the Buyers shall be the sole and exclusive lawful and legal owner of the Sold Business and the Buyers shall enjoy quiet and peaceful possession of the Sold Business and enjoy all its rights, appurtenances, benefits without any let, hindrance, disturbance or interruption of any kind or nature whatsoever by/from the Seller or any other person claiming through them and that the Buyers shall be at liberty to, inter alia, deal with, sell, mortgage, deal with and/or dispose of the Sold Business in any manner desired;",
        "From the date of these presents, the Buyers shall hold, occupy and possess the Sold Business and shall be the sole, absolute, rightful, lawful and exclusive owner of the Sold Business and every part thereof and shall enjoy all profits, emoluments, assessments, privileges without eviction, let, hindrance etc. made or preferred by the Seller or any other person claiming through or under trust of the Seller and that whenever asked by the Buyers or Buyers's successors or representatives, the Seller shall, do, cause, or procure to be done all acts, matters, deeds and things for better assuring and more perfectly assigning the Sold Business to the Buyers, at the cost of the Seller;",
        "The Seller has handed over to the Buyers any and all original title documents, papers and things whatsoever relating to the Business including receipts of evidencing payment of all dues, charges, cesses, rates, assessments, development charges and ground rent up to the date of registration of this Sale Deed and the Parties have executed a separate receipt in this behalf;",
        "The Seller shall always keep the Buyers secured, harmless and indemnified against all losses and detriments occasioned and or suffered by the Buyers or the Buyers's successors or representative owing to any claim, suit, objection, dispute or demand made or preferred by any person, bank, financial institution, local or municipal authority or any government institution concerning the Sold Business or any portion thereof, including pertaining to or in connection with: (a) the Sold Business; (b) sale of the Sold Business to the Buyers; and (c) the original documents of title of the Sold Business up to the date of these presents, and shall make good the same at the cost of the Seller.",
        "The Seller undertakes to have read all terms and conditions of this Sale Deed and explicitly confirms their acceptance of all terms and conditions without any reservation and or confusion."
      ];
      
      warranties.forEach((warranty, index) => {
        // Check if we need a new page
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
        
        const warrantyText = `${index + 1}. ${warranty}`;
        const warrantyLines = doc.splitTextToSize(warrantyText, 165);
        warrantyLines.forEach((line: string) => {
          doc.text(line, 20, y);
          y += lineHeight;
        });
        y += lineHeight * 0.5;
      });
      
      // Check if we need a new page for buyer warranties
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // Of Buyers
      doc.setFont("helvetica", "bold");
      doc.text("Of Buyers:", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const buyerRepText = "in addition to applicable undertakings under Sale Agreement, the Buyers hereby represents and warrants that:";
      
      const buyerRepLines = doc.splitTextToSize(buyerRepText, 170);
      buyerRepLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      const buyerWarranties = [
        "The Buyers have all requisite power and authority to execute and deliver the Sale Deed, and to perform its obligations under its terms and conditions;",
        "The Buyers shall conclude all its payments and/or obligations, whether in cash or in kind, due towards the Sale Price of the Sold Business under this Agreement;",
        "The Buyers undertakes to have read all terms and conditions of this Sale Deed and explicitly confirms their acceptance of all terms and conditions without any reservation and or confusion."
      ];
      
      buyerWarranties.forEach((warranty, index) => {
        // Check if we need a new page
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
        
        const warrantyText = `${index + 1}. ${warranty}`;
        const warrantyLines = doc.splitTextToSize(warrantyText, 165);
        warrantyLines.forEach((line: string) => {
          doc.text(line, 20, y);
          y += lineHeight;
        });
        y += lineHeight * 0.5;
      });
        y += lineHeight;
      
      // Parties' Declaration
      doc.setFont("helvetica", "normal");
      const declarationText = "The Parties do hereby declare that they signed this Sale Deed after compliance with laws of state.";
      
      const declarationLines = doc.splitTextToSize(declarationText, 170);
      declarationLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight * 2;
      
      // Governing Law
      doc.setFont("helvetica", "bold");
      doc.text("GOVERNING LAW AND JURISDICTION", 15, y);
      y += lineHeight * 1.5;
      
      doc.setFont("helvetica", "normal");
      const governingText = "This Sale Agreement shall be construed in accordance with and governed by Applicable Laws and the Parties shall ensure compliance thereof.";
      
      const governingLines = doc.splitTextToSize(governingText, 170);
      governingLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight * 2;
      
      // Check if we need a new page for signatures
      if (y > pageHeight - 120) {
        doc.addPage();
        y = 20;
      }
      
      // Witness clause
      const witnessText = "IN WITNESS WHEREOF, the Parties hereto have executed this Sale Agreement at the place and on the date hereinabove indicated.";
      
      const witnessLines = doc.splitTextToSize(witnessText, 170);
      witnessLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight * 2;
      
      // Signatures Section
      doc.setFont("helvetica", "bold");
      doc.text("SELLER:", 15, y);
      doc.text("BUYER:", 105, y);
      y += lineHeight * 2;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${seller.name || '_______________'}`, 15, y);
      doc.text(`Name: ${buyer.name || '_______________'}`, 105, y);
      y += lineHeight;
      
      doc.text(`CNIC: ${seller.cnic || '_______________'}`, 15, y);
      doc.text(`CNIC: ${buyer.cnic || '_______________'}`, 105, y);
      y += lineHeight * 3;
      
      // Witnesses
      doc.text("Witness 1", 15, y);
      doc.text("Witness 2", 105, y);
      y += lineHeight;
      
      doc.text("___________________________", 15, y);
      doc.text("___________________________", 105, y);
      y += lineHeight;
      
      doc.text(`Name: ${witness1.name || '_______________'}`, 15, y);
      doc.text(`Name: ${witness2.name || '_______________'}`, 105, y);
      y += lineHeight;
      
      doc.text(`CNIC: ${witness1.cnic || '_______________'}`, 15, y);
      doc.text(`CNIC: ${witness2.cnic || '_______________'}`, 105, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `sale_agreement_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Sale Agreement successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Sale Agreement");
      return null;
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Sale Agreement Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">General Details</h4>
              <p><strong>State:</strong> {answers.state || 'Not provided'}</p>
              <p><strong>Effective Date:</strong> {effectiveDate ? format(effectiveDate, 'dd/MM/yyyy') : 'Not provided'}</p>
              <p><strong>Business Name:</strong> {answers.business_name || 'Not provided'}</p>
              <p><strong>Sale Price:</strong> {answers.sale_price || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Seller Information</h4>
              <p><strong>Name:</strong> {seller.name || 'Not provided'}</p>
              <p><strong>CNIC:</strong> {seller.cnic || 'Not provided'}</p>
              <p><strong>Address:</strong> {seller.address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Buyer Information</h4>
              <p><strong>Name:</strong> {buyer.name || 'Not provided'}</p>
              <p><strong>CNIC:</strong> {buyer.cnic || 'Not provided'}</p>
              <p><strong>Address:</strong> {buyer.address || 'Not provided'}</p>
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
            This document will serve as your official Sale Agreement.
          </p>
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-green-600">Sale Agreement</CardTitle>
          <CardDescription>
            Review your Sale Agreement details below before generating the final document.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderFormSummary()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"            onClick={() => {
              setAnswers({});
              setSectionHistory(['state_selection']);
              setCurrentSectionId('state_selection');
              setIsComplete(false);
              setSeller({ name: '', cnic: '', address: '' });
              setBuyer({ name: '', cnic: '', address: '' });
              setWitness1({ name: '', cnic: '' });
              setWitness2({ name: '', cnic: '' });
              setEffectiveDate(undefined);
            }}
          >
            Start Over
          </Button>
          <Button 
            onClick={generateSaleAgreementPDF}
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
          <p className="text-red-500">An error occurred. Please refresh the page.</p>          <Button 
            onClick={() => {
              setCurrentSectionId('state_selection');
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

export default SaleAgreementForm;
