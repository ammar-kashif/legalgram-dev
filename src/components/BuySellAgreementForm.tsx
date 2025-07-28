import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, Calendar as CalendarIcon, FileText, Plus, Trash2 } from "lucide-react";
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
  type: 'text' | 'select' | 'textarea' | 'confirmation' | 'date' | 'number' | 'owner-list';
  text: string;
  options?: string[];
  nextQuestionId?: Record<string, string>;
  defaultNextId?: string;
}

// Define owner interface
interface Owner {
  name: string;
  percentage: string;
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
    description: 'Select the state where this agreement will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'agreement_date'
  },
  'agreement_date': {
    id: 'agreement_date',
    title: 'Agreement Date',
    description: 'Enter the date of this Buy-Sell Agreement',
    questions: ['agreement_date'],
    nextSectionId: 'company_info'
  },
  'company_info': {
    id: 'company_info',
    title: 'Company Information',
    description: 'Details about the company and owners',
    questions: ['company_name', 'owners_list'],
    nextSectionId: 'retirement_terms'
  },
  'retirement_terms': {
    id: 'retirement_terms',
    title: 'Retirement Terms',
    description: 'Early retirement provisions',
    questions: ['early_retirement_age', 'early_retirement_penalty'],
    nextSectionId: 'amendment_terms'
  },
  'amendment_terms': {
    id: 'amendment_terms',
    title: 'Amendment Terms',
    description: 'Requirements for amending this agreement',
    questions: ['amendment_percentage'],
    nextSectionId: 'company_representative'
  },
  'company_representative': {
    id: 'company_representative',
    title: 'Company Representative',
    description: 'Authorized representative to execute this agreement',
    questions: ['company_rep_name', 'company_rep_title'],
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
    text: 'Select your country:',
    options: getAllCountries().map(country => `${country.id}|${country.name}`),
    defaultNextId: 'state'
  },
  'state': {
    id: 'state',
    type: 'select',
    text: 'Select the state where this agreement will be executed:',
    options: [], // Will be populated dynamically
    defaultNextId: 'agreement_date'
  },
  'agreement_date': {
    id: 'agreement_date',
    type: 'date',
    text: 'Date of this Buy-Sell Agreement:',
    defaultNextId: 'company_name'
  },
  'company_name': {
    id: 'company_name',
    type: 'text',
    text: 'Company Name:',
    defaultNextId: 'owners_list'
  },
  'owners_list': {
    id: 'owners_list',
    type: 'owner-list',
    text: 'List of Owners and Their Ownership Percentages:',
    defaultNextId: 'early_retirement_age'
  },
  'early_retirement_age': {
    id: 'early_retirement_age',
    type: 'number',
    text: 'Early Retirement Age Threshold:',
    defaultNextId: 'early_retirement_penalty'
  },
  'early_retirement_penalty': {
    id: 'early_retirement_penalty',
    type: 'number',
    text: 'Early Retirement Penalty Percentage (%):',
    defaultNextId: 'amendment_percentage'
  },
  'amendment_percentage': {
    id: 'amendment_percentage',
    type: 'number',
    text: 'Percentage Required to Amend Agreement (%):',
    defaultNextId: 'company_rep_name'
  },
  'company_rep_name': {
    id: 'company_rep_name',
    type: 'text',
    text: 'Company Representative Name:',
    defaultNextId: 'company_rep_title'
  },
  'company_rep_title': {
    id: 'company_rep_title',
    type: 'text',
    text: 'Company Representative Title:',
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Please review all information above and click "Complete" to generate your Buy-Sell Agreement.',
    defaultNextId: ''
  }
};

const BuySellAgreementForm = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [owners, setOwners] = useState<Owner[]>([{ name: '', percentage: '' }]);
  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const currentSection = sections[currentSectionId];

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentSectionId === 'confirmation') {
      const nextSectionId = currentSection.nextSectionId;
      if (nextSectionId) {
        setCurrentSectionId(nextSectionId);
        setSectionHistory([...sectionHistory, nextSectionId]);
      }
      return;
    }


    const nextSectionId = currentSection.nextSectionId;
    if (nextSectionId) {
      setCurrentSectionId(nextSectionId);
      setSectionHistory([...sectionHistory, nextSectionId]);
    }
  };

  const handleBack = () => {
    if (sectionHistory.length > 1) {
      const newHistory = sectionHistory.slice(0, -1);
      setSectionHistory(newHistory);
      setCurrentSectionId(newHistory[newHistory.length - 1]);
    }
  };

  const addOwner = () => {
    setOwners([...owners, { name: '', percentage: '' }]);
  };

  const removeOwner = (index: number) => {
    if (owners.length > 1) {
      setOwners(owners.filter((_, i) => i !== index));
    }
  };

  const updateOwner = (index: number, field: 'name' | 'percentage', value: string) => {
    const newOwners = [...owners];
    newOwners[index][field] = value;
    setOwners(newOwners);
  };

  const renderQuestionInput = (questionId: string) => {
    const question = questions[questionId];
    if (!question) return null;

    switch (question.type) {
      case 'text':
        return (
          <div key={questionId} className="space-y-2">
            <Label htmlFor={questionId} className="text-black font-medium">
              {question.text}
            </Label>
            <Input
              id={questionId}
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              className="text-black"
              placeholder="Enter your answer..."
            />
          </div>
        );
      case 'number':
        return (
          <div key={questionId} className="space-y-2">
            <Label htmlFor={questionId} className="text-black font-medium">
              {question.text}
            </Label>
            <Input
              id={questionId}
              type="number"
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              className="text-black"
              placeholder="Enter number..."
            />
          </div>
        );
      case 'owner-list':
        return (
          <div key={questionId} className="space-y-4">
            <Label className="text-black font-medium">
              {question.text}
            </Label>
            {owners.map((owner, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor={`owner-name-${index}`} className="text-sm text-gray-600">
                    Owner Name
                  </Label>
                  <Input
                    id={`owner-name-${index}`}
                    value={owner.name}
                    onChange={(e) => updateOwner(index, 'name', e.target.value)}
                    placeholder="Owner Name"
                    className="text-black"
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor={`owner-percentage-${index}`} className="text-sm text-gray-600">
                    Ownership %
                  </Label>
                  <Input
                    id={`owner-percentage-${index}`}
                    type="number"
                    value={owner.percentage}
                    onChange={(e) => updateOwner(index, 'percentage', e.target.value)}
                    placeholder="0"
                    className="text-black"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeOwner(index)}
                  disabled={owners.length === 1}
                  className="mb-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addOwner}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Owner
            </Button>
          </div>
        );
      case 'date':
        return (
          <div key={questionId} className="space-y-2">
            <Label htmlFor={questionId} className="text-black font-medium">
              {question.text}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal text-black",
                    !answers[questionId] && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {answers[questionId] ? format(new Date(answers[questionId]), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={answers[questionId] ? new Date(answers[questionId]) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      handleAnswer(questionId, date.toISOString());
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      case 'select':
        if (questionId === 'country') {
          return (
            <div key={questionId} className="space-y-2">
              <Label htmlFor={questionId} className="text-black font-medium">
                {question.text}
              </Label>
              <Select
                value={answers[questionId] || ''}
                onValueChange={(value) => {
                  handleAnswer(questionId, value);
                  // Clear state when country changes
                  if (answers.state) {
                    handleAnswer('state', '');
                  }
                }}
              >
                <SelectTrigger className="text-black">
                  <SelectValue placeholder="Select a country..." />
                </SelectTrigger>
                <SelectContent>
                  {getAllCountries().map((country) => (
                    <SelectItem key={country.id} value={`${country.id}`}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }
        
        if (questionId === 'state') {
          const countryId = answers.country;
          if (!countryId) {
            return (
              <div key={questionId} className="space-y-2">
                <Label className="text-black font-medium">
                  {question.text}
                </Label>
                <p className="text-gray-500 text-sm">Please select a country first</p>
              </div>
            );
          }
          
          const states = getStatesByCountry(parseInt(countryId));
          
          return (
            <div key={questionId} className="space-y-2">
              <Label htmlFor={questionId} className="text-black font-medium">
                {question.text}
              </Label>
              <Select
                value={answers[questionId] || ''}
                onValueChange={(value) => handleAnswer(questionId, value)}
              >
                <SelectTrigger className="text-black">
                  <SelectValue placeholder="Select a state/province..." />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={`${state.id}`}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }
        break;
      case 'confirmation':
        return (
          <div className="mt-2 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="mt-2 text-black">
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
    if (currentSectionId === 'agreement_date') {
      return answers.agreement_date;
    }
    if (currentSectionId === 'company_info') {
      return answers.company_name && owners.every(owner => owner.name && owner.percentage);
    }
    if (currentSectionId === 'retirement_terms') {
      return answers.early_retirement_age && answers.early_retirement_penalty;
    }
    if (currentSectionId === 'amendment_terms') {
      return answers.amendment_percentage;
    }
    if (currentSectionId === 'company_representative') {
      return answers.company_rep_name && answers.company_rep_title;
    }
    
    // Default validation
    return true;
  };

  const generateBuySellAgreementPDF = () => {
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      
      // Set up the document
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Buy-Sell Agreement", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Helper function to add sections
      const addSection = (title: string, content: string) => {
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 20;
      }

      // Heading
      if (title) {
        doc.setFont("helvetica", "bold");
        doc.text(title, 15, y);
        y += lineHeight;
      }

      // Content (optional)
      if (content.trim() !== "") {
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(content, 170);
        lines.forEach(line => {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 15, y);
          y += lineHeight;
        });
        // only add the extra gap when there's actual content
        y += lineHeight;
      }
    };

      // Get form values
      const agreementDate = answers.agreement_date ? format(new Date(answers.agreement_date), "do 'day of' MMMM, yyyy") : '___ day of _______, 20__';
      const companyName = answers.company_name || '__________________';
      const stateName = answers.state ? getStateName(answers.country || '', answers.state) : '____________________';
      const earlyRetirementAge = answers.early_retirement_age || '______';
      const earlyRetirementPenalty = answers.early_retirement_penalty || '______';
      const amendmentPercentage = answers.amendment_percentage || '____';
      const companyRepName = answers.company_rep_name || '______________________';
      const companyRepTitle = answers.company_rep_title || '______________________';

      // Introduction
      addSection("", `This Buy-Sell Agreement ("Agreement") is made and entered into as of the ${agreementDate}, by and among ${companyName} ("Company"), and the individuals listed in Schedule A (each, an "Owner" and collectively, the "Owners").`);
      
      addSection("", "The Owners collectively own all issued and outstanding ownership units of the Company (the \"Units\"). In order to protect their mutual interests and promote the continued success of the Company, the parties agree as follows:");

      // Section 1: Restrictions on Transfer
      addSection("1. Restrictions on Transfer", "");
      addSection("1.1 General Restrictions", "No Owner may sell, assign, transfer, pledge, or otherwise dispose of any Units now owned or hereafter acquired, except as expressly allowed by this Agreement or with the written consent of the Company and all other Owners. Any transfer not in accordance with this Agreement shall be void and unenforceable.");
      addSection("1.2 Permitted Transfers", "Permitted transfers include:\nTransfers to a revocable or irrevocable trust established by the Owner for estate or tax planning;\nTransfers approved by unanimous written consent of all other Owners.");

      // Section 2: Voluntary Sale by Owner
      addSection("2. Voluntary Sale by Owner", "");
      addSection("2.1 Notice Requirement", "Any Owner who intends to sell or transfer Units must first give written notice (\"Sale Notice\") to the Company and other Owners, specifying the number of Units, the proposed price, and the identity of the proposed transferee.");
      addSection("2.2 Right of First Refusal", "Upon receipt of the Sale Notice, the other Owners shall have thirty (30) days to elect to purchase the Offered Units in proportion to their ownership percentages.");
      addSection("2.3 Sale to Third Parties", "If the other Owners do not purchase all Offered Units, the Seller may sell the remaining Units to the third party on terms not more favorable than those stated in the Sale Notice, and only if the third party agrees in writing to be bound by this Agreement.");

      // Section 3: Involuntary Transfers
      addSection("3. Involuntary Transfers", "");
      addSection("3.1 Triggering Events", "If an Owner becomes subject to an involuntary transfer (including but not limited to bankruptcy, divorce, levy, garnishment, or legal judgment), such Owner must notify the Company. The Company and/or the other Owners shall have the right to purchase the affected Units.");
      addSection("3.2 Exercise Period", "The Company and Owners shall have thirty (30) days from the date of such notice to elect to purchase the Units under the terms outlined in this Agreement.");

      // Section 4: Termination of Employment
      addSection("4. Termination of Employment", "");
      addSection("4.1 Sale Requirement", "If an Owner who is also an employee (\"Employee-Owner\") ceases employment with the Company for any reason, such Owner shall offer to sell all Units held to the Company or other Owners, under the same terms as voluntary sales.");
      addSection("4.2 Disability Clause", "An Employee-Owner shall be deemed \"disabled\" if unable to perform their job responsibilities for more than ninety (90) consecutive days or one hundred twenty (120) cumulative days within any twelve-month period.");
      addSection("4.3 Early Retirement Penalty", `If an Employee-Owner retires before the age of ${earlyRetirementAge} or fails to provide at least five (5) years' written notice of intent to retire, the Purchase Price may be reduced by ${earlyRetirementPenalty} percent (${earlyRetirementPenalty}%).`);

      // Section 5: Death of an Owner
      addSection("5. Death of an Owner", "");
      addSection("5.1 Required Offer", "Upon death of an Owner, the deceased Owner's Personal Representative shall be deemed to have offered the Units for sale to the Company and remaining Owners under this Agreement.");
      addSection("5.2 Purchase Election", "The Company or Owners may elect to purchase the deceased Owner's Units within thirty (30) days of notice from the estate.");

      // Section 6: Purchase Price Determination
      addSection("6. Purchase Price Determination", "");
      addSection("6.1 Purchase Price Formula", "The \"Purchase Price\" shall be calculated based on the most recent book value as of the last day of the month prior to the triggering event, or fair market value as determined by an independent CPA, if applicable.");
      addSection("6.2 CPA Appraisal", "If necessary, an independent Certified Public Accountant selected by mutual agreement shall appraise the Company and determine the fair value. The CPA's determination shall be binding unless materially incorrect.");
      addSection("6.3 Cost of Valuation", "All valuation fees shall be paid by the Company, unless otherwise agreed.");

      // Section 7: Payment Terms
      addSection("7. Payment Terms", "");
      addSection("7.1 Standard Terms", "Unless otherwise agreed in writing:\nTen percent (10%) of the Purchase Price shall be paid in cash at closing;\nThe balance shall be paid in equal monthly installments over a five (5) year period;\nInterest shall accrue on unpaid balances at the Wall Street Journal Prime Rate;\nPrepayment may be made without penalty.");
      addSection("7.2 Default Rate", "If any payment is missed, the unpaid balance shall accrue interest at a default rate of twelve percent (12%) per annum.");

      // Section 8: Closing of Purchase
      addSection("8. Closing of Purchase", "");
      addSection("8.1 Closing Conditions", "Closing shall occur within thirty (30) days of notice of election to purchase. At closing:\nThe Seller shall deliver endorsed certificates (if applicable) and all necessary documents;\nThe Buyer(s) shall provide payment as outlined above.");
      addSection("8.2 Power of Attorney", "Each Owner appoints the Company Secretary as attorney-in-fact to execute documents on their behalf in the event they are unable to attend the closing.");

      // Section 9: Endorsement of Certificates
      const currentDateFormatted = answers.agreement_date ? format(new Date(answers.agreement_date), "MMMM d, yyyy") : '___________';
      addSection("9. Endorsement of Certificates", `Each Owner shall cause any certificates evidencing Units to include the following restrictive legend:\n\"The Units represented by this certificate are subject to restrictions on transfer under a Buy-Sell Agreement dated ${currentDateFormatted}, a copy of which is on file with the Company.\"`);

      // Section 10: Life Insurance
      addSection("10. Life Insurance", "");
      addSection("10.1 Policies Required", "The Company and/or Owners may obtain life insurance policies on the lives of each Owner. The proceeds may be used to fund purchases under this Agreement.");
      addSection("10.2 Premium Responsibility", "Premiums shall be paid by the policyholder. If a policy is not maintained, the Company or another Owner may pay it and be reimbursed.");

      // Section 11: Termination and Amendment
      addSection("11. Termination and Amendment", "");
      addSection("11.1 Termination", "This Agreement shall terminate upon:\nDissolution or bankruptcy of the Company;\nUnanimous written agreement of all Owners.");
      addSection("11.2 Amendment", `This Agreement may only be amended by written consent of Owners holding at least ${amendmentPercentage} percent (${amendmentPercentage}%) of all outstanding Units.`);

      // Section 12: Continuing Effect
      addSection("12. Continuing Effect", "All provisions of this Agreement shall remain in effect and shall be binding on any successors, heirs, or assigns of any Owner. No transfer of Units shall be valid unless the transferee agrees in writing to be bound by this Agreement.");

      // Section 13: Miscellaneous
      addSection("13. Miscellaneous", "");
      addSection("13.1 Tax Status Protection", "If the Company has elected S Corporation status, no Owner may transfer Units in a way that jeopardizes such status. Any transfer in violation shall be void.");
      addSection("13.2 Governing Law", `This Agreement shall be governed by the laws of the State of ${stateName}.`);
      addSection("13.3 Severability", "If any provision of this Agreement is held invalid or unenforceable, all remaining provisions shall remain in full force.");
      addSection("13.4 Notices", "All notices must be in writing and delivered personally or via certified mail to the last known address of the recipient.");
      addSection("13.5 Specific Performance", "Each party acknowledges that monetary damages may not be adequate and agrees that equitable remedies such as injunction or specific performance may be enforced.");
      addSection("13.6 Entire Agreement", "This Agreement represents the full agreement between the parties and supersedes all prior agreements, whether oral or written.");
      addSection("13.7 Spousal Acknowledgment", "Spouses of all Owners shall sign this Agreement acknowledging its binding effect, even if they are not Owners themselves.");

      // Section 14: Execution
      addSection("14. Execution", `This Agreement shall become effective upon execution by all Owners listed in Schedule A and their respective spouses, and by ${companyRepName}, on behalf of the Company.`);

      // Signatures
      if (y > pageHeight - 120) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFont("helvetica", "bold");
      doc.text("IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.", 15, y);
      y += lineHeight + 15;
      
      // Owner signatures table
      doc.text("Owner Name", 15, y);
      doc.text("Signature", 70, y);
      doc.text("Date", 130, y);
      y += lineHeight + 5;
      
      owners.forEach(() => {
        doc.setFont("helvetica", "normal");
        doc.text("__________", 15, y);
        doc.text("__________", 70, y);
        doc.text("_____", 130, y);
        y += lineHeight + 3;
      });
      
      y += lineHeight + 5;
      
      // Spouse signatures
      doc.setFont("helvetica", "bold");
      doc.text("Spouse Name", 15, y);
      doc.text("Signature", 70, y);
      doc.text("Date", 130, y);
      y += lineHeight + 5;
      
      owners.forEach(() => {
        doc.setFont("helvetica", "normal");
        doc.text("____________", 15, y);
        doc.text("____________", 70, y);
        doc.text("______", 130, y);
        y += lineHeight + 3;
      });
      
      y += lineHeight + 10;
      
      // Company Representative
      doc.setFont("helvetica", "bold");
      doc.text("Company Representative:", 15, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${companyRepName}`, 15, y);
      y += lineHeight + 5;
      doc.text(`Title: ${companyRepTitle}`, 15, y);
      y += lineHeight + 5;
      doc.text("Signature: __________________", 15, y);
      y += lineHeight + 5;
      doc.text("Date: ______________________", 15, y);
      y += lineHeight + 15;
      
      // Schedules
      doc.setFont("helvetica", "bold");
      doc.text("Schedule A: List of Owners", 15, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "normal");
      owners.forEach((owner, index) => {
        doc.text(`${index + 1}. ${owner.name || '[Name]'} - ${owner.percentage || '[%]'}% ownership`, 15, y);
        y += lineHeight;
      });
      
      y += lineHeight + 5;
      doc.setFont("helvetica", "bold");
      doc.text("Schedule B: Valuation Methodology", 15, y);
      y += lineHeight + 5;
      doc.setFont("helvetica", "normal");
      doc.text("(Attach book value formula or CPA instructions)", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `buy_sell_agreement_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Buy-Sell Agreement successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Buy-Sell Agreement");
      return null;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-2 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Buy-Sell Agreement Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Basic Information</h4>
              <p><strong>Company:</strong> {answers.company_name || 'Not provided'}</p>
              <p><strong>State:</strong> {answers.state ? getStateName(answers.country || '', answers.state) : 'Not provided'}</p>
              <p><strong>Agreement Date:</strong> {answers.agreement_date ? format(new Date(answers.agreement_date), 'PPP') : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Agreement Terms</h4>
              <p><strong>Early Retirement Age:</strong> {answers.early_retirement_age || 'Not provided'}</p>
              <p><strong>Early Retirement Penalty:</strong> {answers.early_retirement_penalty || 'Not provided'}%</p>
              <p><strong>Amendment Percentage:</strong> {answers.amendment_percentage || 'Not provided'}%</p>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-medium text-sm">Owners</h4>
              {owners.map((owner, index) => (
                <p key={index}><strong>{index + 1}:</strong> {owner.name || 'Not provided'} - {owner.percentage || 'Not provided'}%</p>
              ))}
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Company Representative</h4>
              <p><strong>Name:</strong> {answers.company_rep_name || 'Not provided'}</p>
              <p><strong>Title:</strong> {answers.company_rep_title || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Buy-Sell Agreement.
          </p>
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
      <div className="bg-gray-50 py-2 min-h-0">
        <Card className="max-w-4xl mx-auto bg-white px-4 my-2 rounded-lg shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-600">Buy-Sell Agreement</CardTitle>
            <CardDescription>
              Review your Buy-Sell Agreement details below before generating the final document.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {renderFormSummary()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => {
                setAnswers({});
                setOwners([{ name: '', percentage: '' }]);
                setSectionHistory(['location_selection']);
                setCurrentSectionId('location_selection');
                setIsComplete(false);
              }}
              className="mt-2"
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
      <div className="bg-gray-50 py-2 min-h-0">
        <Card className="max-w-4xl mx-auto bg-white px-4 my-2 rounded-lg shadow-sm">
          <UserInfoStep
            onBack={handleBack}
            onGenerate={generateBuySellAgreementPDF}
            documentType="Buy-Sell Agreement"
            isGenerating={isGeneratingPDF}
          />
        </Card>
      </div>
    );
  }

  // Safety check for currentSection
  if (!currentSection) {
    return (
      <div className="bg-gray-50 py-2 min-h-0">
        <Card className="max-w-4xl mx-auto bg-white px-4 my-2 rounded-lg shadow-sm">
          <CardContent className="text-center p-4">
            <p className="text-red-500">An error occurred. Please refresh the page.</p>
            <Button 
              onClick={() => {
                setCurrentSectionId('location_selection');
                setSectionHistory(['location_selection']);
              }}
              className="mt-2"
            >
              Start Over
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-2 min-h-0">
      <Card className="max-w-4xl mx-auto bg-white px-4 my-2 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">{currentSection.title}</CardTitle>
          <CardDescription>
            {currentSection.description}
            {currentSectionId === 'location_selection' && (
              <div className="mt-3 flex left-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/buy-sell-agreement-info')}
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Learn More About Buy-Sell Agreements
                </Button>
              </div>
            )}
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
    </div>
  );
};

export default BuySellAgreementForm;
