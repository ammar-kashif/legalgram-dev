import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, Calendar as CalendarIcon, Plus, Trash2, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { format, parse } from "date-fns";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import CountryStateAPI from 'countries-states-cities';
import UserInfoStep from "./UserInfoStep";

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

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'location_selection': {
    id: 'location_selection',
    title: 'Location Selection',
    description: 'Select the country and state/province where this contract will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'header'
  },
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
    questions: ['confirmation'],
    nextSectionId: 'user_info'
  },
  'user_info': {
    id: 'user_info',
    title: 'Contact Information',
    description: 'Enter your contact information to generate the document',
    questions: []
  }
};

// Define the question flow
const questions: Record<string, Question> = {
  'country': {
    id: 'country',
    type: 'select',
    text: 'Select the country where this contract will be executed:',
    options: [], // Will be populated dynamically from the database
    defaultNextId: 'state'
  },
  'state': {
    id: 'state',
    type: 'select',
    text: 'Select the state/province where this contract will be executed:',
    options: [], // Will be populated dynamically based on country selection
    defaultNextId: 'place_of_signing'
  },
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
    text: 'Governing Country/State:',
    options: [], // Will be populated dynamically from the database
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
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [items, setItems] = useState<Item[]>([{ description: '', quantity: '', unitPrice: '', totalPrice: '' }]);
  const [buyer, setBuyer] = useState<Party>({ name: '', type: '', stateCountry: '', address: '' });
  const [seller, setSeller] = useState<Party>({ name: '', type: '', stateCountry: '', address: '' });
  
  const currentSection = sections[currentSectionId];

  const handleNext = () => {
    try {
      if (currentSectionId === 'confirmation') {
        setCurrentSectionId('user_info');
        setSectionHistory([...sectionHistory, 'user_info']);
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
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
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
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
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
              <PopoverContent className="w-auto p-0 bg-white rounded-lg shadow-sm">
                <Calendar
                  mode="single"
                  selected={answers[questionId] ? new Date(answers[questionId]) : undefined}
                  onSelect={(date) => handleAnswer(questionId, date ? format(date, 'yyyy-MM-dd') : '')}
                  initialFocus
                  className="p-3 pointer-events-auto bg-white rounded-lg shadow-sm"
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      case 'select':
        // Get options based on question type
        let optionsToShow: Array<{value: string, label: string}> = [];
        
        if (questionId === 'country') {
          // Get all countries from the database using the new API
          const countries = getAllCountries();
          optionsToShow = countries.map(country => ({
            value: country.id.toString(),
            label: country.name
          }));
        } else if (questionId === 'state' && answers.country) {
          // Get states for the selected country using country ID
          const countryId = parseInt(answers.country);
          const states = getStatesByCountry(countryId);
          optionsToShow = states.map(state => ({
            value: state.id.toString(),
            label: state.name
          }));
        } else if (questionId === 'governing_state') {
          // For governing state, show all countries as options
          const countries = getAllCountries();
          optionsToShow = countries.map(country => ({
            value: country.id.toString(),
            label: country.name
          }));
        } else if (question.options) {
          // Use static options for other select questions
          optionsToShow = question.options.map(option => ({
            value: option,
            label: option
          }));
        }
        
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Select 
              value={answers[questionId] || ''} 
              onValueChange={(value) => {
                handleAnswer(questionId, value);
                // Clear state selection when country changes
                if (questionId === 'country' && answers.state) {
                  handleAnswer('state', '');
                }
              }}
              disabled={questionId === 'state' && !answers.country}
            >
              <SelectTrigger className="mt-1 text-black w-full bg-white rounded-lg shadow-sm">
                <SelectValue placeholder={
                  questionId === 'state' && !answers.country 
                    ? "Please select a country first" 
                    : "Select an option"
                } />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-lg shadow-sm">
                {optionsToShow.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
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
                  className="text-black bg-white rounded-lg shadow-sm"
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
                  <SelectContent className="bg-white rounded-lg shadow-sm">
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
    if (currentSectionId === 'location_selection') {
      return answers.country && answers.state;
    }
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
      const headerText = `This General Contract for Products (the "Agreement") is made at ${answers.place_of_signing || '_______________'} in ${answers.state && answers.country ? getStateName(answers.country, answers.state) + ', ' + getCountryName(answers.country) : '[location]'} and entered into on ${answers.contract_date || '________________'} [Date],`;
      
      const headerLines = doc.splitTextToSize(headerText, 170);
      headerLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // BY AND BETWEEN section
      doc.setFont("helvetica", "bold");
      doc.text("BY AND BETWEEN", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const buyerSection = `----${buyer.name || '[Name of Buyer]'}, a ${buyer.type || '[corporation/individual/partnership/LLC]'} organized and existing under the laws of ${buyer.stateCountry || '[State/Country]'}, with its principal place of business located at ${buyer.address || '[Insert Address]'} (hereinafter referred to as the "Buyer"),`;
      
      const buyerLines = doc.splitTextToSize(buyerSection, 170);
      buyerLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "bold");
      doc.text("AND", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const sellerSection = `${seller.name || '[Full Legal Name of Seller]'}, a ${seller.type || '[corporation/individual/partnership/LLC]'} organized and existing under the laws of ${seller.stateCountry || '[State/Country]'}, with its principal place of business located at ${seller.address || '[Insert Address]'} (hereinafter referred to as the "Seller").`;
      
      const sellerLines = doc.splitTextToSize(sellerSection, 170);
      sellerLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      const partiesText = `The Buyer and Seller may be referred to individually as a "Party" and collectively as the "Parties."`;
      doc.text(partiesText, 15, y);
      y += lineHeight + 3;
      
      // WHEREAS clauses
      const whereas1 = "WHEREAS, the Seller is engaged in the business of manufacturing, distributing, or selling certain goods;";
      const whereas1Lines = doc.splitTextToSize(whereas1, 170);
      whereas1Lines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      const whereas2 = "WHEREAS, the Buyer desires to purchase certain goods from the Seller under the terms and conditions set forth in this Agreement;";
      const whereas2Lines = doc.splitTextToSize(whereas2, 170);
      whereas2Lines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      const nowTherefore = "NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:";
      const nowThereforeLines = doc.splitTextToSize(nowTherefore, 170);
      nowThereforeLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 5;      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // 1. Items Purchased
      doc.setFont("helvetica", "bold");
      doc.text("1. Items Purchased", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const itemsIntroText = `The Buyer agrees to purchase, and the Seller agrees to sell and deliver, the following goods ("Goods") under the terms of this Contract:`;
      
      const itemsIntroLines = doc.splitTextToSize(itemsIntroText, 170);
      itemsIntroLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // Table headers
      doc.setFont("helvetica", "bold");
      doc.text("Item Description", 15, y);
      doc.text("Quantity", 80, y);
      doc.text("Unit Price", 120, y);
      doc.text("Total Price", 160, y);
      y += lineHeight;
      
      // Table line
      doc.line(15, y, 190, y);
      y += 3;
      
      doc.setFont("helvetica", "normal");
      items.forEach((item, index) => {
        if (item.description.trim()) {
          const itemDesc = item.description || `[Insert Item ${index + 1}]`;
          const qty = item.quantity || '[Qty]';
          const unitPrice = item.unitPrice || '[Price]';
          const totalPrice = item.totalPrice || '[Total]';
          
          doc.text(itemDesc.substring(0, 25), 15, y);
          doc.text(qty, 80, y);
          doc.text(`$${unitPrice}`, 120, y);
          doc.text(`$${totalPrice}`, 160, y);
          y += lineHeight;
        }
      });
      
      // If no items, show placeholder rows
      if (items.length === 0 || !items.some(item => item.description.trim())) {
        doc.text("[Insert Item 1]", 15, y);
        doc.text("[Qty]", 80, y);
        doc.text("[Price]", 120, y);
        doc.text("[Total]", 160, y);
        y += lineHeight;
        
        doc.text("[Insert Item 2]", 15, y);
        doc.text("[Qty]", 80, y);
        doc.text("[Price]", 120, y);
        doc.text("[Total]", 160, y);
        y += lineHeight;
      }
      
      y += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text(`Total Contract Price: $${calculateTotalContractPrice() || '[Insert Total Amount]'}`, 15, y);
      y += lineHeight + 5;      
      // 2. Payment Terms
      doc.setFont("helvetica", "bold");
      doc.text("2. Payment Terms", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      doc.text("Payment shall be made as follows:", 15, y);
      y += lineHeight;
      
      const depositText = `Deposit: $${answers.deposit_amount || '[Amount or %]'} due upon execution of this Contract.`;
      doc.text(depositText, 15, y);
      y += lineHeight;
      
      const balanceText = `Remaining Balance: Due within ${answers.payment_due_period || '[Insert Number]'} days of delivery and acceptance of the Goods.`;
      doc.text(balanceText, 15, y);
      y += lineHeight;
      
      const paymentMethodText = `Payments shall be made by ${answers.payment_method || '[Insert Method – bank transfer, check, etc.]'}, to the account designated in writing by the Seller.`;
      const paymentMethodLines = doc.splitTextToSize(paymentMethodText, 170);
      paymentMethodLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      
      const latePaymentText = `Late payments shall incur interest at the rate of ${answers.late_payment_rate || '[Insert %]'}% per month or the maximum rate permitted by law.`;
      const latePaymentLines = doc.splitTextToSize(latePaymentText, 170);
      latePaymentLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // 3. Delivery Terms
      doc.setFont("helvetica", "bold");
      doc.text("3. Delivery Terms", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Delivery Location: ${answers.delivery_location || '[Insert Delivery Address or Location]'}`, 15, y);
      y += lineHeight;
      doc.text(`Delivery Deadline: No later than ${answers.delivery_deadline || '[Insert Date]'}`, 15, y);
      y += lineHeight;
      doc.text(`Shipping Method: ${answers.shipping_method || '[Insert Shipping Terms, e.g., FOB, CIF, etc.]'}`, 15, y);
      y += lineHeight;
      doc.text(`Shipping Costs: To be paid by ${answers.shipping_costs || '[Buyer/Seller]'}`, 15, y);
      y += lineHeight;
      
      const notificationText = "The Seller shall notify the Buyer of the shipment details, including expected delivery date and carrier tracking information.";
      const notificationLines = doc.splitTextToSize(notificationText, 170);
      notificationLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // 4. Inspection and Acceptance
      doc.setFont("helvetica", "bold");
      doc.text("4. Inspection and Acceptance", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const inspectionText1 = `The Buyer shall inspect the Goods within ${answers.inspection_period || '[Insert Number]'} business days after delivery. If the Goods fail to conform to the specifications set forth herein, the Buyer must notify the Seller in writing. Failure to do so shall constitute acceptance.`;
      
      const inspectionLines1 = doc.splitTextToSize(inspectionText1, 170);
      inspectionLines1.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      
      const inspectionText2 = "The Seller shall promptly correct or replace any nonconforming Goods at no additional cost to the Buyer.";
      const inspectionLines2 = doc.splitTextToSize(inspectionText2, 170);
      inspectionLines2.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // 5. Title and Risk of Loss
      doc.setFont("helvetica", "bold");
      doc.text("5. Title and Risk of Loss", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      doc.text("Title to and risk of loss for the Goods shall pass to the Buyer upon:", 15, y);
      y += lineHeight;
      doc.text("☐ Delivery to Buyer's specified address", 15, y);
      y += lineHeight;
      doc.text("☐ Transfer to the carrier (FOB Origin)", 15, y);
      y += lineHeight;
      doc.text("(Select appropriate option or define custom terms.)", 15, y);
      y += lineHeight + 3;      
      // 6. Warranties
      doc.setFont("helvetica", "bold");
      doc.text("6. Warranties", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      doc.text("The Seller represents and warrants that:", 15, y);
      y += lineHeight;
      doc.text("• Goods are free from material defects in design, material, and workmanship.", 15, y);
      y += lineHeight;
      doc.text("• Goods conform to the specifications, drawings, or samples provided.", 15, y);
      y += lineHeight;
      doc.text("• Goods are merchantable and fit for their intended purpose.", 15, y);
      y += lineHeight;
      doc.text("• Goods are free from any liens, claims, or encumbrances.", 15, y);
      y += lineHeight;
      doc.text(`Warranty period: ${answers.warranty_period || '[Insert Number]'} months from the date of delivery.`, 15, y);
      y += lineHeight + 3;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // 7. Limitation of Liability
      doc.setFont("helvetica", "bold");
      doc.text("7. Limitation of Liability", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const limitationText = "Except for liability arising from gross negligence or willful misconduct, neither party shall be liable for indirect, incidental, consequential, special, or punitive damages, including lost profits or revenues, arising out of or related to this Contract.";
      
      const limitationLines = doc.splitTextToSize(limitationText, 170);
      limitationLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // 8. Indemnification
      doc.setFont("helvetica", "bold");
      doc.text("8. Indemnification", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const indemnificationText = "Each party agrees to indemnify, defend, and hold harmless the other party from and against any third-party claims, damages, liabilities, or expenses (including reasonable attorney's fees) arising out of or related to:";
      
      const indemnificationLines = doc.splitTextToSize(indemnificationText, 170);
      indemnificationLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      
      doc.text("• Breach of this Contract", 15, y);
      y += lineHeight;
      doc.text("• Negligent or willful misconduct", 15, y);
      y += lineHeight;
      doc.text("• Infringement of intellectual property rights", 15, y);
      y += lineHeight + 3;
      
      // 9. Force Majeure
      doc.setFont("helvetica", "bold");
      doc.text("9. Force Majeure", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const forceMajeureText1 = "Neither party shall be liable for delays or failures in performance resulting from causes beyond its reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, pandemics, government orders, labor strikes, or failure of suppliers.";
      
      const forceMajeureLines1 = doc.splitTextToSize(forceMajeureText1, 170);
      forceMajeureLines1.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      
      const forceMajeureText2 = "In the event of such a delay, the affected party must promptly notify the other party and make reasonable efforts to resume performance.";
      const forceMajeureLines2 = doc.splitTextToSize(forceMajeureText2, 170);
      forceMajeureLines2.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;      
      // 10. Confidentiality
      doc.setFont("helvetica", "bold");
      doc.text("10. Confidentiality", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const confidentialityText1 = "Both parties agree to maintain in strict confidence all proprietary and confidential information exchanged under this Contract, and to use such information solely for the purposes of fulfilling their obligations hereunder.";
      
      const confidentialityLines1 = doc.splitTextToSize(confidentialityText1, 170);
      confidentialityLines1.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      
      const confidentialityText2 = `This clause shall survive the termination of this Contract for a period of ${answers.confidentiality_duration || '[Insert Number]'} years.`;
      doc.text(confidentialityText2, 15, y);
      y += lineHeight + 3;
      
      // 11. Termination
      doc.setFont("helvetica", "bold");
      doc.text("11. Termination", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      doc.text("This Contract may be terminated:", 15, y);
      y += lineHeight;
      doc.text("• By mutual written consent of both Parties", 15, y);
      y += lineHeight;
      
      const terminationText1 = `• By either party, with ${answers.termination_notice_period || '[Insert Number]'} days' written notice, for any material breach not cured within ${answers.cure_period || '[Insert Number]'} days of written notice`;
      const terminationLines1 = doc.splitTextToSize(terminationText1, 165);
      terminationLines1.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      
      const terminationText2 = `• If performance is prevented due to a force majeure event exceeding ${answers.force_majeure_period || '[Insert Number]'} days`;
      const terminationLines2 = doc.splitTextToSize(terminationText2, 165);
      terminationLines2.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      
      const terminationText3 = "Upon termination, the Seller shall refund any unearned amounts, and both parties shall return any confidential materials.";
      const terminationLines3 = doc.splitTextToSize(terminationText3, 170);
      terminationLines3.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // Check if we need a new page
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // 12. Governing Law and Jurisdiction
      doc.setFont("helvetica", "bold");
      doc.text("12. Governing Law and Jurisdiction", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const governingText1 = `This Contract shall be governed by and construed in accordance with the laws of ${answers.governing_state ? getCountryName(answers.governing_state) : '[Insert State/Country]'}.`;
      const governingLines1 = doc.splitTextToSize(governingText1, 170);
      governingLines1.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      
      const governingText2 = `Any disputes shall be resolved exclusively in the state or federal courts located in ${answers.governing_jurisdiction || '[Insert Jurisdiction]'}, and both parties hereby consent to personal jurisdiction therein.`;
      const governingLines2 = doc.splitTextToSize(governingText2, 170);
      governingLines2.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;      });
      y += lineHeight + 3;
      
      // 13. Dispute Resolution
      doc.setFont("helvetica", "bold");
      doc.text("13. Dispute Resolution", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      doc.text("Before initiating any court action, the parties agree to attempt resolution through:", 15, y);
      y += lineHeight;
      doc.text("• Negotiation: A good faith effort for at least 15 days", 15, y);
      y += lineHeight;
      doc.text("• Mediation: If negotiation fails", 15, y);
      y += lineHeight;
      const disputeText = `• Arbitration (optional): Binding arbitration under ${answers.arbitration_rules || '[Insert Rules, e.g., AAA]'}`;
      const disputeLines = doc.splitTextToSize(disputeText, 165);
      disputeLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // 14. Assignment
      doc.setFont("helvetica", "bold");
      doc.text("14. Assignment", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const assignmentText = "Neither party may assign or transfer this Contract or its obligations without prior written consent of the other party, except to an affiliate or successor in interest.";
      const assignmentLines = doc.splitTextToSize(assignmentText, 170);
      assignmentLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // Check if we need a new page
      if (y > pageHeight - 100) {
        doc.addPage();
        y = 20;
      }
      
      // 15. Entire Agreement
      doc.setFont("helvetica", "bold");
      doc.text("15. Entire Agreement", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const entireText = "This Contract constitutes the full and final understanding between the Parties regarding the subject matter herein and supersedes all prior negotiations, discussions, and agreements.";
      const entireLines = doc.splitTextToSize(entireText, 170);
      entireLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // 16. Amendments
      doc.setFont("helvetica", "bold");
      doc.text("16. Amendments", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const amendmentText = "No change or modification to this Contract shall be valid unless in writing and signed by both Parties.";
      const amendmentLines = doc.splitTextToSize(amendmentText, 170);
      amendmentLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // 17. Severability
      doc.setFont("helvetica", "bold");
      doc.text("17. Severability", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const severabilityText = "If any provision of this Contract is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.";
      const severabilityLines = doc.splitTextToSize(severabilityText, 170);
      severabilityLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // 18. Waiver
      doc.setFont("helvetica", "bold");
      doc.text("18. Waiver", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const waiverText = "The failure of either party to enforce any provision shall not be deemed a waiver of future enforcement of that or any other provision.";
      const waiverLines = doc.splitTextToSize(waiverText, 170);
      waiverLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 3;
      
      // 19. Counterparts and Electronic Signatures
      doc.setFont("helvetica", "bold");
      doc.text("19. Counterparts and Electronic Signatures", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      const counterpartText = "This Contract may be executed in counterparts, each of which shall be deemed an original. A signed copy transmitted electronically or via e-signature shall be deemed valid and binding.";
      const counterpartLines = doc.splitTextToSize(counterpartText, 170);
      counterpartLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 5;      
      // Check if we need a new page for signatures
      if (y > pageHeight - 100) {
        doc.addPage();
        y = 20;
      }
      
      // Signatures
      doc.setFont("helvetica", "bold");
      doc.text("Signatures", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      doc.text("IN WITNESS WHEREOF, the parties hereto have executed this General Contract for Products as of the date first above written.", 15, y);
      y += lineHeight + 10;
      
      // The Buyer
      doc.setFont("helvetica", "bold");
      doc.text("The Buyer", 15, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "normal");
      doc.text("Signature: _______________________________", 15, y);
      y += lineHeight + 2;
      doc.text(`Name: ${buyer.name || '___________________________________'}`, 15, y);
      y += lineHeight + 2;
      doc.text("Title: ____________________________________", 15, y);
      y += lineHeight + 2;
      doc.text("Date: ____________________________________", 15, y);
      y += lineHeight + 10;
      
      // The Seller
      doc.setFont("helvetica", "bold");
      doc.text("The Seller", 15, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "normal");
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
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state && answers.country ? getStateName(answers.country, answers.state) : 'Not provided'}</p>
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
    <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
      <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
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
              setSectionHistory(['location_selection']);
              setCurrentSectionId('location_selection');
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
    <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
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
          <div className="mt-2">
            <Button
              variant="outline"
              onClick={() => window.open('/general-contract-info', '_blank')}
              className="text-bright-orange-600 border-bright-orange-600 hover:bg-bright-orange-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Learn More About General Contract for Products
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

export default GeneralContractForm;







