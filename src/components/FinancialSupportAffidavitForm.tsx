import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, Calendar as CalendarIcon, FileText, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
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
  type: 'text' | 'select' | 'textarea' | 'confirmation' | 'date' | 'number' | 'party' | 'income' | 'deductions' | 'expenses' | 'debts' | 'assets';
  text: string;
  options?: string[];
  nextQuestionId?: Record<string, string>;
  defaultNextId?: string;
}

// Define interfaces for data structures
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

interface IncomeSource {
  source: string;
  description: string;
  income: string;
}

interface Deduction {
  type: string;
  amount: string;
}

interface Expense {
  expense: string;
  description: string;
  averageCost: string;
}

interface Debt {
  lender: string;
  description: string;
  totalDebt: string;
  monthlyPayment: string;
}

interface Asset {
  asset: string;
  description: string;
  value: string;
}

interface Party {
  name: string;
  address: string;
  phone?: string;
  city?: string;
  state?: string;
}

// Helper functions
const getAllCountries = (): CountryData[] => {
  return CountryStateAPI.getAllCountries();
};

const getStatesByCountry = (countryId: number): StateData[] => {
  return CountryStateAPI.getStatesOfCountry(countryId);
};

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

// Sections definition
const sections: Record<string, Section> = {
  'location_selection': {
    id: 'location_selection',
    title: 'Location Selection',
    description: 'Select the country and state/province where this Affidavit of Financial Support will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'affiant_info'
  },
  'affiant_info': {
    id: 'affiant_info',
    title: 'Affiant Information',
    description: 'Enter details of the person making the affidavit (affiant)',
    questions: ['affiant_info', 'employment_status'],
    nextSectionId: 'income_info'
  },
  'income_info': {
    id: 'income_info',
    title: 'Income Information',
    description: 'Enter details about gross monthly income from all sources',
    questions: ['income_sources'],
    nextSectionId: 'deductions_info'
  },
  'deductions_info': {
    id: 'deductions_info',
    title: 'Monthly Deductions',
    description: 'Enter details about monthly deductions from income',
    questions: ['deductions'],
    nextSectionId: 'expenses_info'
  },
  'expenses_info': {
    id: 'expenses_info',
    title: 'Monthly Expenses',
    description: 'Enter details about average monthly household expenses',
    questions: ['expenses'],
    nextSectionId: 'debts_info'
  },
  'debts_info': {
    id: 'debts_info',
    title: 'Debts Information',
    description: 'Enter details about current debts and monthly payments',
    questions: ['debts'],
    nextSectionId: 'assets_info'
  },
  'assets_info': {
    id: 'assets_info',
    title: 'Assets Information',
    description: 'Enter details about assets owned',
    questions: ['assets'],
    nextSectionId: 'governing_law'
  },
  'governing_law': {
    id: 'governing_law',
    title: 'Governing Law',
    description: 'Specify the jurisdiction that will govern this affidavit',
    questions: ['governing_jurisdiction'],
    nextSectionId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    title: 'Review and Confirmation',
    description: 'Review all information before generating your Affidavit of Financial Support',
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

// Questions definition
const questions: Record<string, Question> = {
  'country': {
    id: 'country',
    type: 'select',
    text: 'In which country will this Affidavit of Financial Support be executed?',
    options: getAllCountries().map(country => `${country.id}:${country.name}`),
    defaultNextId: 'state'
  },
  'state': {
    id: 'state',
    type: 'select',
    text: 'In which state/province will this Affidavit of Financial Support be executed?',
    options: []
  },
  'affiant_info': {
    id: 'affiant_info',
    type: 'party',
    text: 'Enter the affiant\'s information'
  },
  'employment_status': {
    id: 'employment_status',
    type: 'select',
    text: 'What is your current employment status?',
    options: ['Employed', 'Unemployed', 'Self-employed', 'Retired', 'Student', 'Other']
  },
  'income_sources': {
    id: 'income_sources',
    type: 'income',
    text: 'Enter all sources of gross monthly income'
  },
  'deductions': {
    id: 'deductions',
    type: 'deductions',
    text: 'Enter your monthly deductions'
  },
  'expenses': {
    id: 'expenses',
    type: 'expenses',
    text: 'Enter your average monthly household expenses'
  },
  'debts': {
    id: 'debts',
    type: 'debts',
    text: 'Enter information about your current debts'
  },
  'assets': {
    id: 'assets',
    type: 'assets',
    text: 'Enter information about assets you own'
  },
  'governing_jurisdiction': {
    id: 'governing_jurisdiction',
    type: 'select',
    text: 'Which jurisdiction\'s laws will govern this Affidavit of Financial Support?',
    options: getAllCountries().map(country => `${country.id}:${country.name}`)
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Please review all the information you have provided and confirm that it is accurate.'
  }
};

const FinancialSupportAffidavitForm = () => {
  const navigate = useNavigate();
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [affiant, setAffiant] = useState<Party>({ name: '', address: '', phone: '', city: '', state: '' });
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([{ source: '', description: '', income: '' }]);
  const [deductions, setDeductions] = useState<Deduction[]>([
    { type: 'Federal, State, and Local income tax', amount: '' },
    { type: 'FICA or self-employment taxes', amount: '' },
    { type: 'Medicare payments', amount: '' },
    { type: 'Mandatory union dues', amount: '' },
    { type: 'Mandatory retirement payments', amount: '' },
    { type: 'Health insurance payments', amount: '' },
    { type: 'Child Support', amount: '' },
    { type: 'Alimony', amount: '' }
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([{ expense: '', description: '', averageCost: '' }]);
  const [debts, setDebts] = useState<Debt[]>([{ lender: '', description: '', totalDebt: '', monthlyPayment: '' }]);
  const [assets, setAssets] = useState<Asset[]>([{ asset: '', description: '', value: '' }]);
  
  const currentSection = sections[currentSectionId];

  // Helper function to get available states for selected country
  const getStatesForCountry = (countryAnswer: string): string[] => {
    if (!countryAnswer) return [];
    const countryId = parseInt(countryAnswer.split(':')[0]);
    const states = getStatesByCountry(countryId);
    return states.map(state => `${state.id}:${state.name}`);
  };

  // Update state options when country is selected
  const updateStateOptions = (countryAnswer: string) => {
    const stateOptions = getStatesForCountry(countryAnswer);
    questions['state'].options = stateOptions;
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // Update state options when country changes
    if (questionId === 'country') {
      updateStateOptions(value);
      // Reset state selection when country changes
      setAnswers(prev => ({ ...prev, state: '' }));
    }
  };

  const handlePartyChange = (field: string, value: string) => {
    setAffiant(prev => ({ ...prev, [field]: value }));
  };

  const canAdvance = (): boolean => {
    const currentQuestions = currentSection.questions;
    
    for (const questionId of currentQuestions) {
      const question = questions[questionId];
      
      if (question.type === 'party') {
        if (!affiant.name || !affiant.address) return false;
      } else if (question.type === 'income') {
        if (incomeSources.length === 0 || !incomeSources[0].source) return false;
      } else if (question.type === 'deductions') {
        // For deductions, check if at least one deduction has an amount
        const hasAnyDeduction = deductions.some(deduction => deduction.amount && parseFloat(deduction.amount) > 0);
        if (!hasAnyDeduction) return false;
      } else if (question.type === 'expenses') {
        // For expenses, check if at least one expense is filled
        const hasAnyExpense = expenses.some(expense => expense.expense && expense.averageCost && parseFloat(expense.averageCost) > 0);
        if (!hasAnyExpense) return false;
      } else if (question.type === 'debts') {
        // For debts, check if at least one debt is filled
        const hasAnyDebt = debts.some(debt => debt.lender && debt.totalDebt && parseFloat(debt.totalDebt) > 0);
        if (!hasAnyDebt) return false;
      } else if (question.type === 'assets') {
        // For assets, check if at least one asset is filled
        const hasAnyAsset = assets.some(asset => asset.asset && asset.value && parseFloat(asset.value) > 0);
        if (!hasAnyAsset) return false;
      } else if (question.type === 'confirmation') {
        return answers[questionId] === 'confirmed';
      } else if (questionId === 'state') {
        // Special handling for state - only require if country is selected and states are available
        const countrySelected = answers['country'];
        if (countrySelected) {
          const stateOptions = getStatesForCountry(countrySelected);
          // If there are no states for the country, don't require state selection
          if (stateOptions.length > 0 && !answers[questionId]) return false;
          // If there are no states, this passes validation
        } else {
          // If no country is selected yet, can't validate state
          return false;
        }
      } else {
        if (!answers[questionId]) return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!canAdvance()) return;

    if (currentSectionId === 'confirmation') {
      const nextSectionId = currentSection.nextSectionId;
      if (nextSectionId) {
        setCurrentSectionId(nextSectionId);
        setSectionHistory(prev => [...prev, nextSectionId]);
      }
      return;
    }

    const nextSectionId = currentSection.nextSectionId;
    if (nextSectionId) {
      setCurrentSectionId(nextSectionId);
      setSectionHistory(prev => [...prev, nextSectionId]);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (sectionHistory.length > 1) {
      const newHistory = sectionHistory.slice(0, -1);
      setSectionHistory(newHistory);
      setCurrentSectionId(newHistory[newHistory.length - 1]);
    }
  };

  const calculateTotals = () => {
    const totalIncome = incomeSources.reduce((sum, income) => sum + (parseFloat(income.income) || 0), 0);
    const totalDeductions = deductions.reduce((sum, deduction) => sum + (parseFloat(deduction.amount) || 0), 0);
    const netIncome = totalIncome - totalDeductions;
    const totalExpenses = expenses.reduce((sum, expense) => sum + (parseFloat(expense.averageCost) || 0), 0);
    const totalAssets = assets.reduce((sum, asset) => sum + (parseFloat(asset.value) || 0), 0);
    
    return { totalIncome, totalDeductions, netIncome, totalExpenses, totalAssets };
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    const doc = new jsPDF();
    const { totalIncome, totalDeductions, netIncome, totalExpenses, totalAssets } = calculateTotals();
    
    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("AFFIDAVIT OF FINANCIAL SUPPORT", 105, 30, { align: "center" });
    
    let yPosition = 60;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Affiant statement
    doc.text(`I, ${affiant.name}, being duly sworn, do depose and say:`, 20, yPosition);
    yPosition += 15;
    
    const employmentStatus = answers.employment_status || 'Not specified';
    if (employmentStatus === 'Unemployed') {
      doc.text(`I am unemployed.`, 20, yPosition);
    } else {
      doc.text(`I am currently ${employmentStatus.toLowerCase()}.`, 20, yPosition);
    }
    yPosition += 20;
    
    // Income Sources
    doc.setFont("helvetica", "bold");
    doc.text("1. Gross Monthly Income from All Sources:", 20, yPosition);
    yPosition += 15;
    
    doc.setFont("helvetica", "normal");
    incomeSources.forEach((income) => {
      if (income.source) {
        doc.text(`Source: ${income.source}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Description: ${income.description}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Income: $${income.income}`, 20, yPosition);
        yPosition += 15;
      }
    });
    
    // Monthly Deductions
    doc.setFont("helvetica", "bold");
    doc.text("2. Total Present Monthly Deductions:", 20, yPosition);
    yPosition += 15;
    
    doc.setFont("helvetica", "normal");
    deductions.forEach((deduction) => {
      if (deduction.amount) {
        doc.text(`• ${deduction.type}: $${deduction.amount}`, 20, yPosition);
        yPosition += 10;
      }
    });
    yPosition += 10;
    
    doc.setFont("helvetica", "bold");
    doc.text(`Present Net Monthly Income: $${netIncome.toFixed(2)}`, 20, yPosition);
    yPosition += 20;
    
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Monthly Expenses
    doc.text("Average Monthly Expenses:", 20, yPosition);
    yPosition += 15;
    
    doc.setFont("helvetica", "normal");
    expenses.forEach((expense) => {
      if (expense.expense) {
        doc.text(`Expense: ${expense.expense}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Description: ${expense.description}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Average Cost: $${expense.averageCost}`, 20, yPosition);
        yPosition += 15;
      }
    });
    
    // Debts
    if (debts.some(debt => debt.lender)) {
      doc.setFont("helvetica", "bold");
      doc.text("Debts:", 20, yPosition);
      yPosition += 15;
      
      doc.setFont("helvetica", "normal");
      debts.forEach((debt) => {
        if (debt.lender) {
          doc.text(`Lender: ${debt.lender}`, 20, yPosition);
          yPosition += 10;
          doc.text(`Description: ${debt.description}`, 20, yPosition);
          yPosition += 10;
          doc.text(`Total Debt: $${debt.totalDebt}`, 20, yPosition);
          yPosition += 10;
          doc.text(`Monthly Payment: $${debt.monthlyPayment}`, 20, yPosition);
          yPosition += 15;
        }
      });
    }
    
    // Assets
    if (assets.some(asset => asset.asset)) {
      doc.setFont("helvetica", "bold");
      doc.text("Assets Owned:", 20, yPosition);
      yPosition += 15;
      
      doc.setFont("helvetica", "normal");
      assets.forEach((asset) => {
        if (asset.asset) {
          doc.text(`Asset: ${asset.asset}`, 20, yPosition);
          yPosition += 10;
          doc.text(`Description: ${asset.description}`, 20, yPosition);
          yPosition += 10;
          doc.text(`Value: $${asset.value}`, 20, yPosition);
          yPosition += 15;
        }
      });
    }
    
    // Summary
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFont("helvetica", "bold");
    doc.text("Summary:", 20, yPosition);
    yPosition += 15;
    
    doc.setFont("helvetica", "normal");
    doc.text(`Total Present Net Monthly Income: $${netIncome.toFixed(2)}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Total Monthly Expenses: $${totalExpenses.toFixed(2)}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Total Assets: $${totalAssets.toFixed(2)}`, 20, yPosition);
    yPosition += 20;
    
    doc.text("The undersigned certifies that the information and statements in this", 20, yPosition);
    yPosition += 10;
    doc.text("affidavit are true and complete.", 20, yPosition);
    yPosition += 30;
    
    // Signature lines
    doc.text("Affiant's Name: ___________________________________", 20, yPosition);
    yPosition += 15;
    doc.text("Affiant's Signature: ________________________________", 20, yPosition);
    yPosition += 15;
    doc.text("Date: ___________________", 20, yPosition);
    yPosition += 25;
    
    // Notary section
    doc.text("Subscribed and sworn to (or affirmed) before me on this ____ day of", 20, yPosition);
    yPosition += 10;
    doc.text("______, 2025, by " + affiant.name + ",", 20, yPosition);
    yPosition += 10;
    doc.text("who is personally known to me or has provided satisfactory proof of identity.", 20, yPosition);
    yPosition += 20;
    
    doc.text("Signature of Notary Public: ___________________________", 20, yPosition);
    yPosition += 15;
    doc.text("Name of Notary Public: _______________________________", 20, yPosition);
    yPosition += 15;
    doc.text("My Commission Expires: _____________________________", 20, yPosition);
    yPosition += 15;
    doc.text("Notary Seal:", 20, yPosition);
    
    // New page for instructions
    doc.addPage();
    yPosition = 30;
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Make It Legal", 20, yPosition);
    yPosition += 20;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`This Affidavit should be signed in front of a notary public by ${affiant.name}.`, 20, yPosition);
    yPosition += 10;
    doc.text("Once signed in front of a notary, this document should be delivered to the", 20, yPosition);
    yPosition += 10;
    doc.text("appropriate court for filing.", 20, yPosition);
    yPosition += 20;
    
    doc.setFont("helvetica", "bold");
    doc.text("Copies", 20, yPosition);
    yPosition += 15;
    
    doc.setFont("helvetica", "normal");
    doc.text("The original Affidavit should be filed with the Clerk of Court or delivered", 20, yPosition);
    yPosition += 10;
    doc.text("to the requesting business.", 20, yPosition);
    yPosition += 15;
    
    doc.text("The Affiant should maintain a copy of the Affidavit. Your copy should be", 20, yPosition);
    yPosition += 10;
    doc.text("kept in a safe place.", 20, yPosition);
    yPosition += 20;
    
    doc.setFont("helvetica", "bold");
    doc.text("Additional Assistance", 20, yPosition);
    yPosition += 15;
    
    doc.setFont("helvetica", "normal");
    doc.text("If you are unsure or have questions regarding this Affidavit or need", 20, yPosition);
    yPosition += 10;
    doc.text("additional assistance with special situations or circumstances, use", 20, yPosition);
    yPosition += 10;
    doc.text("Legal Gram's Find A Lawyer search engine to find a lawyer in your area", 20, yPosition);
    yPosition += 10;
    doc.text("to assist you in this matter.", 20, yPosition);
    
    doc.save('affidavit-of-financial-support.pdf');
    toast.success("Affidavit of Financial Support PDF generated successfully!");
  };

  const renderSectionQuestions = () => {
    const currentQuestions = currentSection.questions;
    
    return currentQuestions.map(questionId => {
      const question = questions[questionId];
      
      if (question.type === 'select') {
        if (questionId === 'state') {
          updateStateOptions(answers['country'] || '');
        }
        
        return (
          <div key={questionId} className="space-y-2">
            <Label htmlFor={questionId} className="text-sm font-medium">{question.text}</Label>
            <Select
              value={answers[questionId] || ''}
              onValueChange={(value) => handleAnswerChange(questionId, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Please select..." />
              </SelectTrigger>
              <SelectContent>
                {(question.options || []).map((option) => {
                  // Handle options with "id:name" format (like countries/states) vs plain strings (like employment status)
                  if (option.includes(':')) {
                    const [id, name] = option.split(':');
                    return (
                      <SelectItem key={id} value={option}>
                        {name}
                      </SelectItem>
                    );
                  } else {
                    // For simple string options like employment status
                    return (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    );
                  }
                })}
              </SelectContent>
            </Select>
          </div>
        );
      } else if (question.type === 'party') {
        return (
          <div key={questionId} className="space-y-4">
            <Label className="text-sm font-medium">{question.text}</Label>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor={`${questionId}_name`}>Full Name</Label>
                <Input
                  id={`${questionId}_name`}
                  placeholder="Enter full name"
                  value={affiant.name}
                  onChange={(e) => handlePartyChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`${questionId}_address`}>Street Address</Label>
                <Input
                  id={`${questionId}_address`}
                  placeholder="Enter street address"
                  value={affiant.address}
                  onChange={(e) => handlePartyChange('address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`${questionId}_city`}>City</Label>
                  <Input
                    id={`${questionId}_city`}
                    placeholder="Enter city"
                    value={affiant.city}
                    onChange={(e) => handlePartyChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`${questionId}_state`}>State/Province</Label>
                  <Input
                    id={`${questionId}_state`}
                    placeholder="Enter state/province"
                    value={affiant.state}
                    onChange={(e) => handlePartyChange('state', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`${questionId}_phone`}>Phone Number</Label>
                <Input
                  id={`${questionId}_phone`}
                  placeholder="Enter phone number"
                  value={affiant.phone}
                  onChange={(e) => handlePartyChange('phone', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      } else if (question.type === 'income') {
        return (
          <div key={questionId} className="space-y-4">
            <Label className="text-sm font-medium">{question.text}</Label>
            {incomeSources.map((income, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Income Source {index + 1}</h4>
                  {incomeSources.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newIncomeSources = incomeSources.filter((_, i) => i !== index);
                        setIncomeSources(newIncomeSources);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Source</Label>
                    <Input
                      placeholder="e.g., Employment, Business"
                      value={income.source}
                      onChange={(e) => {
                        const newIncomeSources = [...incomeSources];
                        newIncomeSources[index].source = e.target.value;
                        setIncomeSources(newIncomeSources);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      placeholder="Detailed description"
                      value={income.description}
                      onChange={(e) => {
                        const newIncomeSources = [...incomeSources];
                        newIncomeSources[index].description = e.target.value;
                        setIncomeSources(newIncomeSources);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Monthly Income</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={income.income}
                      onChange={(e) => {
                        const newIncomeSources = [...incomeSources];
                        newIncomeSources[index].income = e.target.value;
                        setIncomeSources(newIncomeSources);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setIncomeSources([...incomeSources, { source: '', description: '', income: '' }])}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Income Source
            </Button>
          </div>
        );
      } else if (question.type === 'deductions') {
        return (
          <div key={questionId} className="space-y-4">
            <Label className="text-sm font-medium">{question.text}</Label>
            <div className="space-y-3">
              {deductions.map((deduction, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Label className="flex-1">{deduction.type}:</Label>
                  <div className="w-32">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={deduction.amount}
                      onChange={(e) => {
                        const newDeductions = [...deductions];
                        newDeductions[index].amount = e.target.value;
                        setDeductions(newDeductions);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      } else if (question.type === 'expenses') {
        return (
          <div key={questionId} className="space-y-4">
            <Label className="text-sm font-medium">{question.text}</Label>
            {expenses.map((expense, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Expense {index + 1}</h4>
                  {expenses.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newExpenses = expenses.filter((_, i) => i !== index);
                        setExpenses(newExpenses);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Expense</Label>
                    <Input
                      placeholder="e.g., Rent, Food, Utilities"
                      value={expense.expense}
                      onChange={(e) => {
                        const newExpenses = [...expenses];
                        newExpenses[index].expense = e.target.value;
                        setExpenses(newExpenses);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      placeholder="Additional details"
                      value={expense.description}
                      onChange={(e) => {
                        const newExpenses = [...expenses];
                        newExpenses[index].description = e.target.value;
                        setExpenses(newExpenses);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Average Cost</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={expense.averageCost}
                      onChange={(e) => {
                        const newExpenses = [...expenses];
                        newExpenses[index].averageCost = e.target.value;
                        setExpenses(newExpenses);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setExpenses([...expenses, { expense: '', description: '', averageCost: '' }])}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        );
      } else if (question.type === 'debts') {
        return (
          <div key={questionId} className="space-y-4">
            <Label className="text-sm font-medium">{question.text}</Label>
            {debts.map((debt, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Debt {index + 1}</h4>
                  {debts.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDebts = debts.filter((_, i) => i !== index);
                        setDebts(newDebts);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Lender</Label>
                    <Input
                      placeholder="Name of lender/creditor"
                      value={debt.lender}
                      onChange={(e) => {
                        const newDebts = [...debts];
                        newDebts[index].lender = e.target.value;
                        setDebts(newDebts);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      placeholder="Type of debt"
                      value={debt.description}
                      onChange={(e) => {
                        const newDebts = [...debts];
                        newDebts[index].description = e.target.value;
                        setDebts(newDebts);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Total Debt</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={debt.totalDebt}
                      onChange={(e) => {
                        const newDebts = [...debts];
                        newDebts[index].totalDebt = e.target.value;
                        setDebts(newDebts);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Monthly Payment</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={debt.monthlyPayment}
                      onChange={(e) => {
                        const newDebts = [...debts];
                        newDebts[index].monthlyPayment = e.target.value;
                        setDebts(newDebts);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setDebts([...debts, { lender: '', description: '', totalDebt: '', monthlyPayment: '' }])}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Debt
            </Button>
          </div>
        );
      } else if (question.type === 'assets') {
        return (
          <div key={questionId} className="space-y-4">
            <Label className="text-sm font-medium">{question.text}</Label>
            {assets.map((asset, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Asset {index + 1}</h4>
                  {assets.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newAssets = assets.filter((_, i) => i !== index);
                        setAssets(newAssets);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Asset</Label>
                    <Input
                      placeholder="e.g., House, Car, Savings"
                      value={asset.asset}
                      onChange={(e) => {
                        const newAssets = [...assets];
                        newAssets[index].asset = e.target.value;
                        setAssets(newAssets);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      placeholder="Additional details"
                      value={asset.description}
                      onChange={(e) => {
                        const newAssets = [...assets];
                        newAssets[index].description = e.target.value;
                        setAssets(newAssets);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Value</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={asset.value}
                      onChange={(e) => {
                        const newAssets = [...assets];
                        newAssets[index].value = e.target.value;
                        setAssets(newAssets);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setAssets([...assets, { asset: '', description: '', value: '' }])}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </div>
        );
      } else if (question.type === 'confirmation') {
        return (
          <div key={questionId} className="space-y-4">
            <Label className="text-sm font-medium">{question.text}</Label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={answers[questionId] === 'confirmed'}
                  onChange={(e) => handleAnswerChange(questionId, e.target.checked ? 'confirmed' : '')}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">I confirm that all information provided is accurate and complete.</span>
              </label>
            </div>
          </div>
        );
      }
      
      return null;
    });
  };

  const renderFormSummary = () => {
    const countryName = answers.country ? getCountryName(answers.country.split(':')[0]) : '';
    const stateName = answers.state ? getStateName(answers.country?.split(':')[0] || '', answers.state.split(':')[0]) : '';
    const { totalIncome, totalDeductions, netIncome, totalExpenses, totalAssets } = calculateTotals();
    
    return (
      <div className="space-y-4 text-sm">
        <div>
          <strong>Jurisdiction:</strong> {stateName}, {countryName}
        </div>
        <div>
          <strong>Affiant:</strong> {affiant.name}<br />
          <strong>Address:</strong> {affiant.address}, {affiant.city}, {affiant.state}<br />
          <strong>Phone:</strong> {affiant.phone}<br />
          <strong>Employment Status:</strong> {answers.employment_status || 'Not specified'}
        </div>
        <div>
          <strong>Financial Summary:</strong><br />
          Gross Monthly Income: ${totalIncome.toFixed(2)}<br />
          Total Deductions: ${totalDeductions.toFixed(2)}<br />
          Net Monthly Income: ${netIncome.toFixed(2)}<br />
          Total Monthly Expenses: ${totalExpenses.toFixed(2)}<br />
          Total Assets: ${totalAssets.toFixed(2)}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Affidavit of Financial Support.
          </p>
        </div>
      </div>
    );
  };

  if (currentSectionId === 'user_info') {
    return (
      <UserInfoStep
        onBack={handleBack}
        onGenerate={generatePDF}
        documentType="Affidavit of Financial Support"
        isGenerating={isGeneratingPDF}
      />
    );
  }

  if (isComplete) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-green-800">Affidavit Complete!</CardTitle>
          <CardDescription>
            Your Affidavit of Financial Support has been completed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Button 
            onClick={generatePDF}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={isGeneratingPDF}
          >
            <FileText className="w-4 h-4 mr-2" />
            {isGeneratingPDF ? "Generating..." : "Download PDF"}
          </Button>
          <div>
            <Button 
              variant="outline" 
              onClick={() => {
                setCurrentSectionId('location_selection');
                setSectionHistory(['location_selection']);
                setAnswers({});
                setAffiant({ name: '', address: '', phone: '', city: '', state: '' });
                setIncomeSources([{ source: '', description: '', income: '' }]);
                setDeductions([
                  { type: 'Federal, State, and Local income tax', amount: '' },
                  { type: 'FICA or self-employment taxes', amount: '' },
                  { type: 'Medicare payments', amount: '' },
                  { type: 'Mandatory union dues', amount: '' },
                  { type: 'Mandatory retirement payments', amount: '' },
                  { type: 'Health insurance payments', amount: '' },
                  { type: 'Child Support', amount: '' },
                  { type: 'Alimony', amount: '' }
                ]);
                setExpenses([{ expense: '', description: '', averageCost: '' }]);
                setDebts([{ lender: '', description: '', totalDebt: '', monthlyPayment: '' }]);
                setAssets([{ asset: '', description: '', value: '' }]);
                setIsComplete(false);
              }}
            >
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
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
              onClick={() => navigate('/financial-support-affidavit-info')}
              className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
            >
              <FileText className="w-4 h-4 mr-2" />
              Learn More About Financial Support Affidavits
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

export default FinancialSupportAffidavitForm;
