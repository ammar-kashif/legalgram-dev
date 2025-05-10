
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle } from "lucide-react";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { toast } from "sonner";

// Define the question type interface
interface Question {
  id: string;
  type: 'text' | 'select' | 'radio' | 'textarea' | 'confirmation';
  text: string;
  options?: string[];
  nextQuestionId?: Record<string, string>;
  defaultNextId?: string;
}

// Define the question flow
const questions: Record<string, Question> = {
  'start': {
    id: 'start',
    type: 'text',
    text: 'Please enter the landlord\'s full legal name:',
    defaultNextId: 'tenant_name'
  },
  'tenant_name': {
    id: 'tenant_name',
    type: 'text',
    text: 'Please enter the tenant\'s full legal name:',
    defaultNextId: 'property_address'
  },
  'property_address': {
    id: 'property_address',
    type: 'text',
    text: 'What is the street address of the leased property?',
    defaultNextId: 'property_city'
  },
  'property_city': {
    id: 'property_city',
    type: 'text',
    text: 'In which city is the property located?',
    defaultNextId: 'property_zip'
  },
  'property_zip': {
    id: 'property_zip',
    type: 'text',
    text: 'What is the ZIP code of the property?',
    defaultNextId: 'lease_start'
  },
  'lease_start': {
    id: 'lease_start',
    type: 'text',
    text: 'When will the lease start? (YYYY-MM-DD)',
    defaultNextId: 'lease_end'
  },
  'lease_end': {
    id: 'lease_end',
    type: 'text',
    text: 'When will the lease end? (YYYY-MM-DD)',
    defaultNextId: 'rent_amount'
  },
  'rent_amount': {
    id: 'rent_amount',
    type: 'text',
    text: 'What is the monthly rent amount?',
    defaultNextId: 'payment_method'
  },
  'payment_method': {
    id: 'payment_method',
    type: 'text',
    text: 'What payment method(s) will be accepted?',
    defaultNextId: 'landlord_address'
  },
  'landlord_address': {
    id: 'landlord_address',
    type: 'textarea',
    text: 'What is the landlord\'s full address for payments and notices?',
    defaultNextId: 'landlord_phone'
  },
  'landlord_phone': {
    id: 'landlord_phone',
    type: 'text',
    text: 'What is the landlord\'s phone number?',
    defaultNextId: 'landlord_email'
  },
  'landlord_email': {
    id: 'landlord_email',
    type: 'text',
    text: 'What is the landlord\'s email address?',
    defaultNextId: 'security_deposit'
  },
  'security_deposit': {
    id: 'security_deposit',
    type: 'text',
    text: 'What is the security deposit amount?',
    defaultNextId: 'house_keys'
  },
  'house_keys': {
    id: 'house_keys',
    type: 'text',
    text: 'How many keys to the property will be provided?',
    defaultNextId: 'mailbox_keys'
  },
  'mailbox_keys': {
    id: 'mailbox_keys',
    type: 'text',
    text: 'How many mailbox keys will be provided?',
    defaultNextId: 'key_replacement_fee'
  },
  'key_replacement_fee': {
    id: 'key_replacement_fee',
    type: 'text',
    text: 'What is the fee for replacing lost keys?',
    defaultNextId: 'lockout_fee'
  },
  'lockout_fee': {
    id: 'lockout_fee',
    type: 'text',
    text: 'What is the lockout fee?',
    defaultNextId: 'max_guests'
  },
  'max_guests': {
    id: 'max_guests',
    type: 'text',
    text: 'What is the maximum number of guests allowed at one time?',
    defaultNextId: 'max_guest_days'
  },
  'max_guest_days': {
    id: 'max_guest_days',
    type: 'text',
    text: 'What is the maximum number of days guests may stay?',
    defaultNextId: 'early_termination_days'
  },
  'early_termination_days': {
    id: 'early_termination_days',
    type: 'text',
    text: 'How many days\' notice is required for early termination?',
    defaultNextId: 'tenant_address'
  },
  'tenant_address': {
    id: 'tenant_address',
    type: 'textarea',
    text: 'What is the tenant\'s current address for notices?',
    defaultNextId: 'tenant_phone'
  },
  'tenant_phone': {
    id: 'tenant_phone',
    type: 'text',
    text: 'What is the tenant\'s phone number?',
    defaultNextId: 'tenant_email'
  },
  'tenant_email': {
    id: 'tenant_email',
    type: 'text',
    text: 'What is the tenant\'s email address?',
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your Arkansas Lease Agreement based on your answers.',
  }
};

const ConditionalForm = () => {
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('start');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionHistory, setQuestionHistory] = useState<string[]>(['start']);
  const [isComplete, setIsComplete] = useState(false);
  
  const currentQuestion = questions[currentQuestionId];
  
  const handleNext = (nextId?: string) => {
    if (!nextId && currentQuestion.type === 'confirmation') {
      setIsComplete(true);
      return;
    }
    
    const nextQuestionId = nextId || 
      (answers[currentQuestion.id] && currentQuestion.nextQuestionId?.[answers[currentQuestion.id]]) || 
      currentQuestion.defaultNextId || '';
    
    if (nextQuestionId) {
      setQuestionHistory([...questionHistory, nextQuestionId]);
      setCurrentQuestionId(nextQuestionId);
    }
  };
  
  const handleBack = () => {
    if (questionHistory.length > 1) {
      const newHistory = [...questionHistory];
      newHistory.pop();
      setQuestionHistory(newHistory);
      setCurrentQuestionId(newHistory[newHistory.length - 1]);
    }
  };
  
  const handleAnswer = (answer: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer
    });
  };
  
  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case 'text':
        return (
          <Input
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer"
            className="mt-2 text-black"
          />
        );
      case 'select':
        return (
          <Select 
            value={answers[currentQuestion.id] || ''} 
            onValueChange={handleAnswer}
          >
            <SelectTrigger className="mt-2 text-black">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {currentQuestion.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'radio':
        return (
          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={handleAnswer}
            className="mt-4 space-y-3 text-black"
          >
            {currentQuestion.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'textarea':
        return (
          <Textarea
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer"
            className="mt-2 text-black"
            rows={4}
          />
        );
      case 'confirmation':
        return (
          <div className="mt-4 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="mt-4 text-rocket-gray-700 dark:text-rocket-gray-300">
              We will generate your document based on the information you provided.
            </p>
          </div>
        );
      default:
        return null;
    }
  };
  
  const canAdvance = () => {
    if (currentQuestion.type === 'confirmation') return true;
    return !!answers[currentQuestion.id];
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
      y += splitText.length * lineHeight + 10;
      
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
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Lease Agreement Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Parties</h4>
              <p><strong>Landlord:</strong> {answers.start || 'Not provided'}</p>
              <p><strong>Tenant:</strong> {answers.tenant_name || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Property</h4>
              <p>{answers.property_address || 'Address not provided'}</p>
              <p>{answers.property_city || 'City not provided'}, AR {answers.property_zip || 'ZIP not provided'}</p>
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
      <Card className="max-w-xl mx-auto">
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
            variant="outline"
            onClick={() => {
              setAnswers({});
              setQuestionHistory(['start']);
              setCurrentQuestionId('start');
              setIsComplete(false);
            }}
          >
            Start Over
          </Button>
          <Button 
            onClick={generateLeaseAgreementPDF}
            className="bg-rocket-blue-500"
          >
            Generate Lease Agreement
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
        <CardDescription>
          Step {questionHistory.length} of {Object.keys(questions).length - 1}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderQuestionInput()}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleBack}
          disabled={questionHistory.length <= 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button 
          onClick={() => handleNext()}
          disabled={!canAdvance()}
        >
          {currentQuestion.type === 'confirmation' ? (
            <>
              Complete <Send className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Next <ArrowRight className="w-4 h-4 ml-2 text-black" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConditionalForm;
