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
import { format, parse } from "date-fns";
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
  type: 'text' | 'select' | 'radio' | 'textarea' | 'confirmation' | 'date' | 'number' | 'email' | 'phone' | 'items' | 'party';
  text: string;
  options?: string[];
  nextQuestionId?: Record<string, string>;
  defaultNextId?: string;
}

// Item interface
interface Item {
  description: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
}

// Party interface (for buyer and seller)
interface Party {
  name: string;
  type: string;
  stateCountry: string;
  address: string;
}

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'header': {
    id: 'header',
    title: 'Contract Header',
    description: 'Enter basic contract information',
    questions: ['place_of_signing', 'contract_date'],
    nextSectionId: 'parties'
  },
  'parties': {
    id: 'parties',
    title: 'Parties Information',
    description: 'Enter information about buyer and seller',
    questions: ['buyer_info', 'seller_info'],
    nextSectionId: 'items'
  },
  'items': {
    id: 'items',
    title: 'Items Purchased',
    description: 'Specify the products being purchased',
    questions: ['items_info'],
    nextSectionId: 'payment'
  },
  'payment': {
    id: 'payment',
    title: 'Payment Terms',
    description: 'Define payment conditions',
    questions: ['deposit_amount', 'payment_due_period', 'payment_method', 'late_payment_rate'],
    nextSectionId: 'delivery'
  },
  'delivery': {
    id: 'delivery',
    title: 'Delivery Terms',
    description: 'Specify delivery arrangements',
    questions: ['delivery_location', 'delivery_deadline', 'shipping_method', 'shipping_costs'],
    nextSectionId: 'inspection'
  },
  'inspection': {
    id: 'inspection',
    title: 'Inspection and Acceptance',
    description: 'Define inspection terms',
    questions: ['inspection_period'],
    nextSectionId: 'title_risk'
  },
  'title_risk': {
    id: 'title_risk',
    title: 'Title and Risk of Loss',
    description: 'Specify when title transfers',
    questions: ['title_transfer_terms'],
    nextSectionId: 'warranties'
  },
  'warranties': {
    id: 'warranties',
    title: 'Warranties',
    description: 'Define warranty terms',
    questions: ['warranty_period'],
    nextSectionId: 'confidentiality'
  },
  'confidentiality': {
    id: 'confidentiality',
    title: 'Confidentiality',
    description: 'Confidentiality agreement terms',
    questions: ['confidentiality_duration'],
    nextSectionId: 'termination'
  },
  'termination': {
    id: 'termination',
    title: 'Termination',
    description: 'Define termination conditions',
    questions: ['termination_notice_period', 'cure_period', 'force_majeure_period'],
    nextSectionId: 'governing_law'
  },
  'governing_law': {
    id: 'governing_law',
    title: 'Governing Law and Jurisdiction',
    description: 'Specify applicable law and jurisdiction',
    questions: ['governing_state', 'jurisdiction_location'],
    nextSectionId: 'dispute_resolution'
  },
  'dispute_resolution': {
    id: 'dispute_resolution',
    title: 'Dispute Resolution',
    description: 'Define dispute resolution method',
    questions: ['arbitration_rules'],
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
  'place_of_signing': {
    id: 'place_of_signing',
    type: 'text',
    text: 'Place of Contract Signing:',
    defaultNextId: 'contract_date'
  },
  'contract_date': {
    id: 'contract_date',
    type: 'date',
    text: 'Date of Contract:',
    defaultNextId: 'buyer_info'
  },
  'buyer_info': {
    id: 'buyer_info',
    type: 'party',
    text: 'Buyer Information:',
    defaultNextId: 'seller_info'
  },
  'seller_info': {
    id: 'seller_info',
    type: 'party',
    text: 'Seller Information:',
    defaultNextId: 'items_info'
  },
  'items_info': {
    id: 'items_info',
    type: 'items',
    text: 'Items Purchased:',
    defaultNextId: 'deposit_amount'
  },
  'deposit_amount': {
    id: 'deposit_amount',
    type: 'text',
    text: 'Deposit Amount or Percentage:',
    defaultNextId: 'payment_due_period'
  },
  'payment_due_period': {
    id: 'payment_due_period',
    type: 'number',
    text: 'Payment Due Period (days):',
    defaultNextId: 'payment_method'
  },
  'payment_method': {
    id: 'payment_method',
    type: 'select',
    text: 'Payment Method:',
    options: ['Bank Transfer', 'Check', 'Credit Card', 'Cash', 'Wire Transfer', 'ACH Transfer', 'Other'],
    defaultNextId: 'late_payment_rate'
  },
  'late_payment_rate': {
    id: 'late_payment_rate',
    type: 'number',
    text: 'Late Payment Interest Rate (% per month):',
    defaultNextId: 'delivery_location'
  },
  'delivery_location': {
    id: 'delivery_location',
    type: 'textarea',
    text: 'Delivery Location:',
    defaultNextId: 'delivery_deadline'
  },
  'delivery_deadline': {
    id: 'delivery_deadline',
    type: 'date',
    text: 'Delivery Deadline:',
    defaultNextId: 'shipping_method'
  },
  'shipping_method': {
    id: 'shipping_method',
    type: 'select',
    text: 'Shipping Method:',
    options: ['FOB Origin', 'FOB Destination', 'CIF', 'CIP', 'DDP', 'EXW', 'FCA', 'Other'],
    defaultNextId: 'shipping_costs'
  },
  'shipping_costs': {
    id: 'shipping_costs',
    type: 'radio',
    text: 'Shipping Costs Paid By:',
    options: ['Buyer', 'Seller'],
    defaultNextId: 'inspection_period'
  },
  'inspection_period': {
    id: 'inspection_period',
    type: 'number',
    text: 'Inspection Period After Delivery (business days):',
    defaultNextId: 'title_transfer_terms'
  },
  'title_transfer_terms': {
    id: 'title_transfer_terms',
    type: 'radio',
    text: 'Title and Risk of Loss Transfer:',
    options: ['Delivery to Buyer\'s specified address', 'Transfer to the carrier (FOB Origin)', 'Custom terms'],
    defaultNextId: 'warranty_period'
  },
  'warranty_period': {
    id: 'warranty_period',
    type: 'number',
    text: 'Warranty Period (months):',
    defaultNextId: 'confidentiality_duration'
  },
  'confidentiality_duration': {
    id: 'confidentiality_duration',
    type: 'number',
    text: 'Duration Confidentiality Survives Termination (years):',
    defaultNextId: 'termination_notice_period'
  },
  'termination_notice_period': {
    id: 'termination_notice_period',
    type: 'number',
    text: 'Notice Period for Termination (days):',
    defaultNextId: 'cure_period'
  },
  'cure_period': {
    id: 'cure_period',
    type: 'number',
    text: 'Cure Period for Material Breach (days):',
    defaultNextId: 'force_majeure_period'
  },
  'force_majeure_period': {
    id: 'force_majeure_period',
    type: 'number',
    text: 'Force Majeure Duration to Trigger Termination (days):',
    defaultNextId: 'governing_state'
  },
  'governing_state': {
    id: 'governing_state',
    type: 'select',
    text: 'Governing State/Country:',
    options: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Canada', 'United Kingdom', 'Other'],
    defaultNextId: 'jurisdiction_location'
  },
  'jurisdiction_location': {
    id: 'jurisdiction_location',
    type: 'text',
    text: 'Jurisdiction Location:',
    defaultNextId: 'arbitration_rules'
  },
  'arbitration_rules': {
    id: 'arbitration_rules',
    type: 'select',
    text: 'Arbitration Rules (if applicable):',
    options: ['None', 'American Arbitration Association (AAA)', 'JAMS', 'International Chamber of Commerce (ICC)', 'Other'],
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your General Contract for Products based on your answers.',
  }
};

const GeneralContractForm = () => {
  const [currentSectionId, setCurrentSectionId] = useState<string>('header');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['header']);
  const [isComplete, setIsComplete] = useState(false);
  const [items, setItems] = useState<Item[]>([{ description: '', quantity: '', unitPrice: '', totalPrice: '' }]);
  const [buyer, setBuyer] = useState<Party>({ name: '', type: '', stateCountry: '', address: '' });
  const [seller, setSeller] = useState<Party>({ name: '', type: '', stateCountry: '', address: '' });
  
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

  const addItem = () => {
    setItems([...items, { description: '', quantity: '', unitPrice: '', totalPrice: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof Item, value: string) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    
    // Auto-calculate total price when quantity or unit price changes
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(field === 'quantity' ? value : updatedItems[index].quantity) || 0;
      const unitPrice = parseFloat(field === 'unitPrice' ? value : updatedItems[index].unitPrice) || 0;
      updatedItems[index].totalPrice = (quantity * unitPrice).toFixed(2);
    }
    
    setItems(updatedItems);
  };

  const updateParty = (partyType: 'buyer' | 'seller', field: keyof Party, value: string) => {
    if (partyType === 'buyer') {
      setBuyer({ ...buyer, [field]: value });
    } else {
      setSeller({ ...seller, [field]: value });
    }
  };

  const calculateTotalContractPrice = () => {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.totalPrice) || 0);
    }, 0).toFixed(2);
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
              placeholder="Enter a number"
              className="mt-1 text-black w-full"
            />
          </div>
        );
      case 'date':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !answers[questionId] && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {answers[questionId] ? answers[questionId] : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={answers[questionId] ? new Date(answers[questionId]) : undefined}
                  onSelect={(date) => handleAnswer(questionId, date ? format(date, 'yyyy-MM-dd') : '')}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
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
              placeholder="Type your answer"
              className="mt-1 text-black w-full"
              rows={3}
            />
          </div>
        );
      case 'party':
        const isSellerInfo = questionId === 'seller_info';
        const party = isSellerInfo ? seller : buyer;
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm">Name:</Label>
                <Input
                  value={party.name}
                  onChange={(e) => updateParty(isSellerInfo ? 'seller' : 'buyer', 'name', e.target.value)}
                  placeholder="Enter full legal name"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Type:</Label>
                <Select 
                  value={party.type} 
                  onValueChange={(value) => updateParty(isSellerInfo ? 'seller' : 'buyer', 'type', value)}
                >
                  <SelectTrigger className="text-black">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corporation">Corporation</SelectItem>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Partnership">Partnership</SelectItem>
                    <SelectItem value="LLC">LLC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">State/Country of Organization:</Label>
                <Input
                  value={party.stateCountry}
                  onChange={(e) => updateParty(isSellerInfo ? 'seller' : 'buyer', 'stateCountry', e.target.value)}
                  placeholder="Enter state or country"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Principal Business Address:</Label>
                <Textarea
                  value={party.address}
                  onChange={(e) => updateParty(isSellerInfo ? 'seller' : 'buyer', 'address', e.target.value)}
                  placeholder="Enter complete address"
                  className="text-black"
                  rows={2}
                />
              </div>
            </div>
          </div>
        );
      case 'items':
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm">Description:</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Enter item description"
                      className="text-black"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <Label className="text-sm">Quantity:</Label>
                      <Input
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        placeholder="Enter quantity"
                        className="text-black"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Unit Price ($):</Label>
                      <Input
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                        placeholder="Enter unit price"
                        className="text-black"
                        type="number"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Total Price ($):</Label>
                      <Input
                        value={item.totalPrice}
                        readOnly
                        className="text-black bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Item
              </Button>
              <div className="border-t pt-2">
                <div className="text-right font-semibold">
                  Total Contract Price: ${calculateTotalContractPrice()}
                </div>
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
    console.log("Current section:", currentSectionId, "Questions:", currentSection?.questions);
    return currentSection.questions.map(questionId => renderQuestionInput(questionId));
  };

  const canAdvance = () => {
    if (currentSectionId === 'confirmation') return true;
    
    // Special validation for dynamic sections
    if (currentSectionId === 'header') {
      return answers.place_of_signing && answers.contract_date;
    }
    if (currentSectionId === 'parties') {
      return buyer.name && buyer.type && buyer.stateCountry && buyer.address && 
             seller.name && seller.type && seller.stateCountry && seller.address;
    }
    if (currentSectionId === 'items') {
      return items.some(item => item.description.trim() && item.quantity && item.unitPrice);
    }
    
    // Check if all required fields in the current section have answers
    return currentSection.questions.every(questionId => {
      const question = questions[questionId];
      if (question?.options?.includes('None')) {
        return true; // Optional field
      }
      return !!answers[questionId];
    });
  };

  const generateGeneralContractPDF = () => {
    try {
      console.log("Generating General Contract for Products PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("General Contract for Products", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Contract Header
      doc.setFont("helvetica", "normal");
      const headerText = `This General Contract for Products ("Contract") is entered into on ${answers.contract_date || '____ day of ___________, 20__'}, at ${answers.place_of_signing || '_______________'}, by and between ${buyer.name || '_______________'} ("Buyer"), and ${seller.name || '_______________'} ("Seller").`;
      
      const headerLines = doc.splitTextToSize(headerText, 170);
      headerLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Buyer Information
      doc.setFont("helvetica", "bold");
      doc.text("Buyer Information.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${buyer.name || '_______________'}`, 15, y);
      y += lineHeight;
      doc.text(`Type: ${buyer.type || '_______________'}`, 15, y);
      y += lineHeight;
      doc.text(`State/Country of Organization: ${buyer.stateCountry || '_______________'}`, 15, y);
      y += lineHeight;
      const buyerAddressLines = doc.splitTextToSize(`Principal Business Address: ${buyer.address || '_______________'}`, 170);
      buyerAddressLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Seller Information
      doc.setFont("helvetica", "bold");
      doc.text("Seller Information.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${seller.name || '_______________'}`, 15, y);
      y += lineHeight;
      doc.text(`Type: ${seller.type || '_______________'}`, 15, y);
      y += lineHeight;
      doc.text(`State/Country of Organization: ${seller.stateCountry || '_______________'}`, 15, y);
      y += lineHeight;
      const sellerAddressLines = doc.splitTextToSize(`Principal Business Address: ${seller.address || '_______________'}`, 170);
      sellerAddressLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // Items Purchased
      doc.setFont("helvetica", "bold");
      doc.text("1. Items Purchased.", 15, y);
      y += lineHeight + 2;
      
      doc.setFont("helvetica", "normal");
      doc.text("The Seller agrees to sell and the Buyer agrees to purchase the following items:", 15, y);
      y += lineHeight + 2;
      
      items.forEach((item, index) => {
        if (item.description.trim()) {
          doc.text(`Item ${index + 1}: ${item.description}`, 15, y);
          y += lineHeight;
          doc.text(`Quantity: ${item.quantity || '___'}, Unit Price: $${item.unitPrice || '___'}, Total: $${item.totalPrice || '___'}`, 15, y);
          y += lineHeight + 2;
        }
      });
      
      doc.setFont("helvetica", "bold");
      doc.text(`Total Contract Price: $${calculateTotalContractPrice()}`, 15, y);
      y += lineHeight + 5;
      
      // Payment Terms
      doc.setFont("helvetica", "bold");
      doc.text("2. Payment Terms.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const paymentText = `The Buyer shall pay a deposit of ${answers.deposit_amount || '_______________'} upon signing this Contract. The remaining balance shall be paid within ${answers.payment_due_period || '___'} days via ${answers.payment_method || '_______________'}. Late payments shall incur interest at ${answers.late_payment_rate || '___'}% per month.`;
      
      const paymentLines = doc.splitTextToSize(paymentText, 170);
      paymentLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // Delivery Terms
      doc.setFont("helvetica", "bold");
      doc.text("3. Delivery Terms.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const deliveryText = `The Seller shall deliver the items to ${answers.delivery_location || '_______________'} by ${answers.delivery_deadline || '_______________'} using ${answers.shipping_method || '_______________'} shipping terms. Shipping costs shall be paid by the ${answers.shipping_costs || '_______________'}.`;
      
      const deliveryLines = doc.splitTextToSize(deliveryText, 170);
      deliveryLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Inspection and Acceptance
      doc.setFont("helvetica", "bold");
      doc.text("4. Inspection and Acceptance.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const inspectionText = `The Buyer shall have ${answers.inspection_period || '___'} business days after delivery to inspect the items and notify the Seller of any defects or non-conformities.`;
      
      const inspectionLines = doc.splitTextToSize(inspectionText, 170);
      inspectionLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Title and Risk of Loss
      doc.setFont("helvetica", "bold");
      doc.text("5. Title and Risk of Loss.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const titleText = `Title and risk of loss shall transfer to the Buyer upon ${answers.title_transfer_terms || '_______________'}.`;
      
      const titleLines = doc.splitTextToSize(titleText, 170);
      titleLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Warranties
      doc.setFont("helvetica", "bold");
      doc.text("6. Warranties.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const warrantyText = `The Seller warrants that the items shall be free from defects in materials and workmanship for a period of ${answers.warranty_period || '___'} months from the date of delivery.`;
      
      const warrantyLines = doc.splitTextToSize(warrantyText, 170);
      warrantyLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // Confidentiality
      doc.setFont("helvetica", "bold");
      doc.text("10. Confidentiality.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const confidentialityText = `The parties agree to maintain confidentiality of proprietary information for ${answers.confidentiality_duration || '___'} years after termination of this Contract.`;
      
      const confidentialityLines = doc.splitTextToSize(confidentialityText, 170);
      confidentialityLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Termination
      doc.setFont("helvetica", "bold");
      doc.text("11. Termination.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const terminationText = `Either party may terminate this Contract with ${answers.termination_notice_period || '___'} days written notice. Material breaches must be cured within ${answers.cure_period || '___'} days. Force majeure events lasting ${answers.force_majeure_period || '___'} days may trigger termination.`;
      
      const terminationLines = doc.splitTextToSize(terminationText, 170);
      terminationLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Governing Law
      doc.setFont("helvetica", "bold");
      doc.text("12. Governing Law and Jurisdiction.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const governingText = `This Contract shall be governed by the laws of ${answers.governing_state || '_______________'} and any disputes shall be resolved in ${answers.jurisdiction_location || '_______________'}.`;
      
      const governingLines = doc.splitTextToSize(governingText, 170);
      governingLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Dispute Resolution
      if (answers.arbitration_rules && answers.arbitration_rules !== 'None') {
        doc.setFont("helvetica", "bold");
        doc.text("13. Dispute Resolution.", 15, y);
        y += lineHeight;
        
        doc.setFont("helvetica", "normal");
        const disputeText = `Any disputes arising under this Contract shall be resolved through arbitration under the rules of ${answers.arbitration_rules}.`;
        
        const disputeLines = doc.splitTextToSize(disputeText, 170);
        disputeLines.forEach((line: string) => {
          doc.text(line, 15, y);
          y += lineHeight;
        });
        y += lineHeight;
      }
      
      // Check if we need a new page for signatures
      if (y > pageHeight - 100) {
        doc.addPage();
        y = 20;
      }
      
      // Signatures
      doc.setFont("helvetica", "bold");
      doc.text("Signatures.", 15, y);
      y += lineHeight + 10;
      
      doc.setFont("helvetica", "normal");
      
      // Buyer signature
      doc.text("The Buyer:", 15, y);
      y += lineHeight + 5;
      doc.text("Signature: _______________________________", 15, y);
      y += lineHeight + 2;
      doc.text(`Name: ${buyer.name || '___________________________________'}`, 15, y);
      y += lineHeight + 2;
      doc.text("Title: ____________________________________", 15, y);
      y += lineHeight + 2;
      doc.text("Date: ____________________________________", 15, y);
      y += lineHeight + 10;
      
      // Seller signature
      doc.text("The Seller:", 15, y);
      y += lineHeight + 5;
      doc.text("Signature: _______________________________", 15, y);
      y += lineHeight + 2;
      doc.text(`Name: ${seller.name || '___________________________________'}`, 15, y);
      y += lineHeight + 2;
      doc.text("Title: ____________________________________", 15, y);
      y += lineHeight + 2;
      doc.text("Date: ____________________________________", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `general_contract_products_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("General Contract for Products successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate General Contract for Products");
      return null;
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">General Contract for Products Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Contract Details</h4>
              <p><strong>Place:</strong> {answers.place_of_signing || 'Not provided'}</p>
              <p><strong>Date:</strong> {answers.contract_date || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Buyer</h4>
              <p><strong>Name:</strong> {buyer.name || 'Not provided'}</p>
              <p><strong>Type:</strong> {buyer.type || 'Not provided'}</p>
              <p><strong>State/Country:</strong> {buyer.stateCountry || 'Not provided'}</p>
              <p><strong>Address:</strong> {buyer.address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Seller</h4>
              <p><strong>Name:</strong> {seller.name || 'Not provided'}</p>
              <p><strong>Type:</strong> {seller.type || 'Not provided'}</p>
              <p><strong>State/Country:</strong> {seller.stateCountry || 'Not provided'}</p>
              <p><strong>Address:</strong> {seller.address || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Items & Pricing</h4>
              <p><strong>Items:</strong> {items.filter(i => i.description.trim()).length} item(s)</p>
              <p><strong>Total Price:</strong> ${calculateTotalContractPrice()}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Payment Terms</h4>
              <p><strong>Deposit:</strong> {answers.deposit_amount || 'Not provided'}</p>
              <p><strong>Due Period:</strong> {answers.payment_due_period || 'Not provided'} days</p>
              <p><strong>Method:</strong> {answers.payment_method || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Delivery</h4>
              <p><strong>Location:</strong> {answers.delivery_location || 'Not provided'}</p>
              <p><strong>Deadline:</strong> {answers.delivery_deadline || 'Not provided'}</p>
              <p><strong>Method:</strong> {answers.shipping_method || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Legal Terms</h4>
              <p><strong>Governing Law:</strong> {answers.governing_state || 'Not provided'}</p>
              <p><strong>Jurisdiction:</strong> {answers.jurisdiction_location || 'Not provided'}</p>
              <p><strong>Warranty:</strong> {answers.warranty_period || 'Not provided'} months</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official General Contract for Products.
          </p>
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-green-600">General Contract for Products</CardTitle>
          <CardDescription>
            Review your contract details below before generating the final document.
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
              setSectionHistory(['header']);
              setCurrentSectionId('header');
              setIsComplete(false);
              setItems([{ description: '', quantity: '', unitPrice: '', totalPrice: '' }]);
              setBuyer({ name: '', type: '', stateCountry: '', address: '' });
              setSeller({ name: '', type: '', stateCountry: '', address: '' });
            }}
          >
            Start Over
          </Button>
          <Button 
            onClick={generateGeneralContractPDF}
          >
            Generate Contract
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
              setCurrentSectionId('header');
              setSectionHistory(['header']);
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

export default GeneralContractForm;
