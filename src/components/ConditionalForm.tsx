
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
  type: 'text' | 'select' | 'radio' | 'textarea' | 'confirmation' | 'date' | 'number' | 'email' | 'phone';
  text: string;
  options?: string[];
  nextQuestionId?: Record<string, string>;
  defaultNextId?: string;
}

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'state_selection': {
    id: 'state_selection',
    title: 'State Selection',
    description: 'Select the state where this agreement will be executed',
    questions: ['state'],
    nextSectionId: 'parties'
  },
  'parties': {
    id: 'parties',
    title: 'Parties Information',
    description: 'Enter information about the landlord and tenant',
    questions: ['start', 'tenant_name', 'tenant_address', 'tenant_phone', 'tenant_email'],
    nextSectionId: 'property'
  },
  'property': {
    id: 'property',
    title: 'Property Information',
    description: 'Enter details about the property being leased',
    questions: ['property_address', 'property_city', 'property_zip'],
    nextSectionId: 'lease_terms'
  },
  'lease_terms': {
    id: 'lease_terms',
    title: 'Lease Terms',
    description: 'Define the terms of the lease agreement',
    questions: ['lease_start', 'lease_end', 'rent_amount', 'payment_method', 'security_deposit'],
    nextSectionId: 'landlord_info'
  },
  'landlord_info': {
    id: 'landlord_info',
    title: 'Landlord Information',
    description: 'Provide contact information for the landlord',
    questions: ['landlord_address', 'landlord_phone', 'landlord_email'],
    nextSectionId: 'keys_access'
  },
  'keys_access': {
    id: 'keys_access',
    title: 'Keys and Access',
    description: 'Details about property access',
    questions: ['house_keys', 'mailbox_keys', 'key_replacement_fee', 'lockout_fee'],
    nextSectionId: 'occupancy'
  },
  'occupancy': {
    id: 'occupancy',
    title: 'Occupancy Details',
    description: 'Rules regarding guests and occupancy',
    questions: ['max_guests', 'max_guest_days', 'early_termination_days'],
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
    defaultNextId: 'start'
  },
  'start': {
    id: 'start',
    type: 'text',
    text: 'Landlord\'s full legal name:',
    defaultNextId: 'tenant_name'
  },
  'tenant_name': {
    id: 'tenant_name',
    type: 'text',
    text: 'Tenant\'s full legal name:',
    defaultNextId: 'property_address'
  },
  'property_address': {
    id: 'property_address',
    type: 'text',
    text: 'Street address of the leased property:',
    defaultNextId: 'property_city'
  },
  'property_city': {
    id: 'property_city',
    type: 'text',
    text: 'City where the property is located:',
    defaultNextId: 'property_zip'
  },
  'property_zip': {
    id: 'property_zip',
    type: 'text',
    text: 'ZIP code of the property:',
    defaultNextId: 'lease_start'
  },
  'lease_start': {
    id: 'lease_start',
    type: 'date',
    text: 'Lease start date:',
    defaultNextId: 'lease_end'
  },
  'lease_end': {
    id: 'lease_end',
    type: 'date',
    text: 'Lease end date:',
    defaultNextId: 'rent_amount'
  },
  'rent_amount': {
    id: 'rent_amount',
    type: 'number',
    text: 'Monthly rent amount ($):',
    defaultNextId: 'payment_method'
  },
  'payment_method': {
    id: 'payment_method',
    type: 'text',
    text: 'Payment method(s) accepted:',
    defaultNextId: 'landlord_address'
  },
  'landlord_address': {
    id: 'landlord_address',
    type: 'textarea',
    text: 'Landlord\'s full address for payments and notices:',
    defaultNextId: 'landlord_phone'
  },
  'landlord_phone': {
    id: 'landlord_phone',
    type: 'phone',
    text: 'Landlord\'s phone number:',
    defaultNextId: 'landlord_email'
  },
  'landlord_email': {
    id: 'landlord_email',
    type: 'email',
    text: 'Landlord\'s email address:',
    defaultNextId: 'security_deposit'
  },
  'security_deposit': {
    id: 'security_deposit',
    type: 'number',
    text: 'Security deposit amount ($):',
    defaultNextId: 'house_keys'
  },
  'house_keys': {
    id: 'house_keys',
    type: 'number',
    text: 'Number of keys to the property:',
    defaultNextId: 'mailbox_keys'
  },
  'mailbox_keys': {
    id: 'mailbox_keys',
    type: 'number',
    text: 'Number of mailbox keys:',
    defaultNextId: 'key_replacement_fee'
  },
  'key_replacement_fee': {
    id: 'key_replacement_fee',
    type: 'number',
    text: 'Fee for replacing lost keys ($):',
    defaultNextId: 'lockout_fee'
  },
  'lockout_fee': {
    id: 'lockout_fee',
    type: 'number',
    text: 'Lockout fee ($):',
    defaultNextId: 'max_guests'
  },
  'max_guests': {
    id: 'max_guests',
    type: 'number',
    text: 'Maximum number of guests allowed:',
    defaultNextId: 'max_guest_days'
  },
  'max_guest_days': {
    id: 'max_guest_days',
    type: 'number',
    text: 'Maximum days guests may stay:',
    defaultNextId: 'early_termination_days'
  },
  'early_termination_days': {
    id: 'early_termination_days',
    type: 'number',
    text: 'Days\' notice required for early termination:',
    defaultNextId: 'tenant_address'
  },
  'tenant_address': {
    id: 'tenant_address',
    type: 'textarea',
    text: 'Tenant\'s current address for notices:',
    defaultNextId: 'tenant_phone'
  },
  'tenant_phone': {
    id: 'tenant_phone',
    type: 'phone',
    text: 'Tenant\'s phone number:',
    defaultNextId: 'tenant_email'
  },
  'tenant_email': {
    id: 'tenant_email',
    type: 'email',
    text: 'Tenant\'s email address:',
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your Arkansas Lease Agreement based on your answers.',
  }
};

const ConditionalForm = () => {  const [currentSectionId, setCurrentSectionId] = useState<string>('state_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['state_selection']);
  const [isComplete, setIsComplete] = useState(false);
  
  const currentSection = sections[currentSectionId];
  
  const handleNext = () => {
    const nextSectionId = currentSection.nextSectionId;
    
    if (!nextSectionId) {
      setIsComplete(true);
      return;
    }
    
    if (nextSectionId) {
      setSectionHistory([...sectionHistory, nextSectionId]);
      setCurrentSectionId(nextSectionId);
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
      case 'email':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Input
              id={questionId}
              type="email"
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Enter email address"
              className="mt-1 text-black w-full"
            />
          </div>
        );
      case 'phone':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Input
              id={questionId}
              type="tel"
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Enter phone number"
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
    
    // Special validation for state selection
    if (currentSectionId === 'state_selection') {
      return answers.state;
    }
    
    // Check if all required fields in the current section have answers
    const requiredQuestions = currentSection.questions;
    return requiredQuestions.every(questionId => !!answers[questionId]);
  };

  const generateLeaseAgreementPDF = () => {
    try {
      console.log("Generating PDF document...");
      const doc = new jsPDF();
      
      // Set font styles
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Arkansas Lease Agreement", 105, 20, { align: "center" });
      
      // Reset to normal font for the body
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      // Starting position for content
      let y = 30;
      const lineHeight = 6;
      
      // Insert the template with form values
      const currentDate = format(new Date(), 'yyyy-MM-dd');
      
      let leaseContent = `This Lease Agreement ("Lease") is entered into on ${currentDate}, by and between ${answers.start || '________'} ("Landlord"), and ${answers.tenant_name || '________'} ("Tenant").

Leased Property.
The Landlord hereby leases to the Tenant the located at ${answers.property_address || '________'}, ${answers.property_city || '________'}, Arkansas ${answers.property_zip || '________'} ("Leased Property").

Term.
This Lease shall be for a fixed term, starting on ${answers.lease_start || '________'} ("Start Date") and ending on ${answers.lease_end || '________'} ("Termination Date"). The Tenant will be entitled to possession of the Leased Property beginning on the Start Date and shall maintain possession of the Leased Property until the Termination Date unless terminated through approved methods outlined in this Lease or under Arkansas law.

Rent.
The Tenant agrees to pay to the Landlord as rent for the use and occupancy of the Leased Property the sum of $${answers.rent_amount || '________'} due on the first day of each month ("Rent").
The Rent shall be paid by the following method(s): ${answers.payment_method || '________'}
The Rent shall be payable to the Landlord, located at ${answers.landlord_address || '________'}.
The Landlord can be reached by phone at ${answers.landlord_phone || '________'} or by email at ${answers.landlord_email || '________'}.
If any payment is returned for non-sufficient funds or because the Tenant stops payments, then, after that, the Landlord may, in writing, require the Tenant to pay future Rent payments by cash, cashier's check, or money order.

Security Deposit.
At the time of the signing of this Lease, the Tenant shall pay to the Landlord, in trust, a security deposit of $${answers.security_deposit || '________'} to be held and disbursed for the Tenant damages to the Leased Property or other defaults under this Lease (if any) as provided by law.`;

      // Split the text to fit the page width
      const splitText = doc.splitTextToSize(leaseContent, 180);
      doc.text(splitText, 15, y);
      
      // Update the Y position after the main content
      y += splitText.length * lineHeight;
      
      // Check if we need a new page
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      // Add the legal text from the template
      let legalText = `
(2) However, the money may be applied to the payment of accrued unpaid Rent and any damages which the Landlord has suffered by reason of the Tenant's non-compliance with the Lease, all as itemized by the Landlord in a written notice delivered to the Tenant, together with the remainder of the amount due sixty (60) days after termination of the tenancy and delivery of possession by the Tenant.
(b)(1) The Landlord shall be deemed to have complied with subsection (a) of this section by mailing via first class mail the written notice and any payment required to the last known address of the Tenant.
(2) If the letter containing the payment is returned to the Landlord and if the Landlord is unable to locate the Tenant after reasonable effort, then the payment shall become the property of the Landlord one hundred eighty (180) days from the date the payment was mailed.
 
Default.
The Tenant will be in default of this Lease if the Tenant fails to comply with any material provisions of this Lease by which the Tenant is bound. Subject to any governing provisions of law to the contrary, if the Tenant fails to cure any financial obligation (or any other obligation) after written notice of such default is provided by the Landlord to the Tenant, the Landlord may elect to cure such default and the cost of such action will be added to the Tenant's financial obligations under this Lease. All sums of money or charges required to be paid by the Tenant under this Lease will be additional rent, whether or not such sums or charges are designated as "additional rent." The rights provided by this Paragraph are cumulative in nature and are in addition to any other rights afforded by law.`;

      const splitLegalText = doc.splitTextToSize(legalText, 180);
      doc.text(splitLegalText, 15, y);
      
      y += splitLegalText.length * lineHeight + 10;
      
      // Check if we need a new page
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      // Add the keys section
      let keysSection = `
Keys.
The Tenant will be given ${answers.house_keys || '________'} key(s) to the Leased Property and ${answers.mailbox_keys || '________'} mailbox key(s). If the Tenant misplaces a key or does not return all keys following the Termination Date, the Tenant will be charged $${answers.key_replacement_fee || '________'}.
If the Tenant becomes locked out of the Leased Property, the Tenant will be charged $${answers.lockout_fee || '________'} to regain entry.

Occupancy of Leased Property.
Except as stated otherwise in this Paragraph, only those individuals identified in this Lease as the "Tenant" (including their minor children) may reside in the Leased Property. The individuals identified as the "Tenant" shall sign this Lease. It is explicitly understood that this Lease is between the Landlord and each Tenant signatory individually and jointly. If any one signatory defaults, the remaining signatories are collectively responsible for timely Rent payment and all other terms of this Lease. The Tenant may have up to ${answers.max_guests || '________'} guests on the Leased Property at any one time. A "guest" shall be considered anyone who is invited by the Tenant to be present at the Leased Property, and who is also not included in the Lease. The Tenant may not have guests on the Leased Property for more than ${answers.max_guest_days || '________'} days. No other person shall be permitted to occupy the Leased Property except with the prior written approval of the Landlord.`;
      
      const splitKeysText = doc.splitTextToSize(keysSection, 180);
      doc.text(splitKeysText, 15, y);
      
      y += splitKeysText.length * lineHeight + 10;
      
      // Check if we need another new page
      if (y > 230) {
        doc.addPage();
        y = 20;
      }
      
      // Add early termination section
      let earlyTerminationSection = `
Early Termination Clause.
The Tenant may, upon ${answers.early_termination_days || '________'} days' written notice to the Landlord, terminate this Lease provided that the Tenant pays a termination charge equal to $0.00 or the maximum allowable by law, whichever is less. Termination will be effective as of the last day of the calendar month following the end of the ${answers.early_termination_days || '________'} day notice period. The termination charge will be in addition to all Rent due up to the termination day.`;
      
      const splitTerminationText = doc.splitTextToSize(earlyTerminationSection, 180);
      doc.text(splitTerminationText, 15, y);
      
      y += splitTerminationText.length * lineHeight + 15;
      
      // Check if we need a new page for signatures
      if (y > 230) {
        doc.addPage();
        y = 20;
      }

      // Add occupancy section from template
      let noticesSection = `
Notices.
The Landlord:
${answers.landlord_address || '________'}
Phone: ${answers.landlord_phone || '________'}
Email: ${answers.landlord_email || '________'}

The Tenant:
${answers.tenant_address || '________'}
Phone: ${answers.tenant_phone || '________'}
Email: ${answers.tenant_email || '________'}`;

      const splitNoticesText = doc.splitTextToSize(noticesSection, 180);
      doc.text(splitNoticesText, 15, y);
      
      y += splitNoticesText.length * lineHeight + 15;
      
      // Add a new page for signatures
      doc.addPage();
      y = 20;
      
      // Add the signatures section
      doc.text("The Landlord:", 15, y);
      y += lineHeight * 2;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${answers.start || '________'} (Printed Name)`, 15, y);
      
      y += lineHeight * 2;
      
      doc.text("The Tenant:", 15, y);
      y += lineHeight * 2;
      doc.text("____________________________", 15, y);
      y += lineHeight;
      doc.text(`${answers.tenant_name || '________'} (Printed Name)`, 15, y);
      
      y += lineHeight * 2;
      
      doc.text("Date: _________________", 15, y);
      
      // Add another page for inspection checklist
      doc.addPage();
      y = 20;
      
      doc.setFont("helvetica", "bold");
      doc.text("Residential Lease Inspection Checklist", 105, y, { align: "center" });
      y += lineHeight * 2;
      
      doc.setFont("helvetica", "normal");
      doc.text("The Tenant has inspected the Leased Property and states that it is in satisfactory condition, free of defects, except as noted below:", 15, y);
      y += lineHeight * 2;
      
      // Table headers
      doc.text("ITEM", 15, y);
      doc.text("SATISFACTORY", 100, y);
      doc.text("COMMENTS", 150, y);
      y += lineHeight;
      
      // Sample inspection items
      const inspectionItems = [
        "Bathrooms", "Carpeting", "Ceilings", "Closets", "Countertops",
        "Dishwasher", "Disposal", "Doors", "Walls", "Windows", 
        "Window coverings"
      ];
      
      inspectionItems.forEach(item => {
        doc.text(item, 15, y);
        doc.text("________", 100, y);
        doc.text("________________________", 150, y);
        y += lineHeight;
      });
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `lease_agreement_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Lease agreement successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate lease agreement");
      return null;
    }
  };
  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Lease Agreement Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">General Information</h4>
              <p><strong>State:</strong> {answers.state || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Parties</h4>
              <p><strong>Landlord:</strong> {answers.start || 'Not provided'}</p>
              <p><strong>Tenant:</strong> {answers.tenant_name || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Property</h4>
              <p>{answers.property_address || 'Address not provided'}</p>
              <p>{answers.property_city || 'City not provided'}, {answers.state || 'State not provided'} {answers.property_zip || 'ZIP not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Term</h4>
              <p><strong>Start:</strong> {answers.lease_start || 'Not provided'}</p>
              <p><strong>End:</strong> {answers.lease_end || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Payment</h4>
              <p><strong>Monthly Rent:</strong> ${answers.rent_amount || 'Not provided'}</p>
              <p><strong>Security Deposit:</strong> ${answers.security_deposit || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Landlord Contact</h4>
              <p>{answers.landlord_phone || 'Phone not provided'}</p>
              <p>{answers.landlord_email || 'Email not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Tenant Contact</h4>
              <p>{answers.tenant_phone || 'Phone not provided'}</p>
              <p>{answers.tenant_email || 'Email not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Keys</h4>
              <p><strong>House:</strong> {answers.house_keys || 'Not specified'} | <strong>Mailbox:</strong> {answers.mailbox_keys || 'Not specified'}</p>
              <p><strong>Key Fee:</strong> ${answers.key_replacement_fee || 'Not specified'} | <strong>Lockout Fee:</strong> ${answers.lockout_fee || 'Not specified'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Early Termination</h4>
              <p><strong>Notice Required:</strong> {answers.early_termination_days || 'Not specified'} days</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Arkansas Lease Agreement.
          </p>
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-green-600">Arkansas Lease Agreement</CardTitle>
          <CardDescription>
            Review your lease agreement details below before generating the final document.
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
            }}
          >
            Start Over
          </Button>
          <Button 
            onClick={generateLeaseAgreementPDF}
          >
            Generate Lease Agreement
          </Button>
        </CardFooter>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
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

export default ConditionalForm;
