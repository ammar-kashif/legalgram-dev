import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import CountryStateAPI from 'countries-states-cities';
import UserInfoStep from "@/components/UserInfoStep";

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

interface NDAData {
  country: string;
  state: string;
  effectiveDate: string;
  disclosingPartyName: string;
  disclosingPartyAddress: string;
  recipientName: string;
  recipientAddress: string;
  terminationDate: string;
  earlyTerminationDays: string;
  nonCircumventionDuration: string;
  governingLaw: string;
  disclosingSignatoryName: string;
  disclosingSignatoryTitle: string;
  recipientSignatoryName: string;
  recipientSignatoryTitle: string;
}

const NDAForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formData, setFormData] = useState<NDAData>({
    country: '',
    state: '',
    effectiveDate: '',
    disclosingPartyName: '',
    disclosingPartyAddress: '',
    recipientName: '',
    recipientAddress: '',
    terminationDate: '',
    earlyTerminationDays: '',
    nonCircumventionDuration: '',
    governingLaw: '',
    disclosingSignatoryName: '',
    disclosingSignatoryTitle: '',
    recipientSignatoryName: '',
    recipientSignatoryTitle: ''
  });

  const handleInputChange = (field: keyof NDAData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset state when country changes
    if (field === 'country') {
      setFormData(prev => ({ ...prev, state: '' }));
    }
  };

  // Helper function to get available states for selected country
  const getStatesForCountry = (countryAnswer: string): string[] => {
    if (!countryAnswer) return [];
    const countryId = parseInt(countryAnswer.split(':')[0]);
    const states = getStatesByCountry(countryId);
    return states.map(state => `${state.id}:${state.name}`);
  };

  const canAdvance = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.country && formData.state && formData.effectiveDate && formData.disclosingPartyName && formData.disclosingPartyAddress);
      case 2:
        return !!(formData.recipientName && formData.recipientAddress && formData.terminationDate && formData.earlyTerminationDays);
      case 3:
        return !!(formData.nonCircumventionDuration && formData.governingLaw);
      case 4:
        return !!(formData.disclosingSignatoryName && formData.disclosingSignatoryTitle && formData.recipientSignatoryName && formData.recipientSignatoryTitle);
      case 5:
        return true; // User info step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canAdvance()) return;

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    const doc = new jsPDF();
    const lineHeight = 4; // reduced line height for tighter spacing
    
    // Get proper names for display
    const countryName = formData.country ? getCountryName(formData.country.split(':')[0]) : '';
    const stateName = formData.state ? getStateName(formData.country?.split(':')[0] || '', formData.state.split(':')[0]) : '';
    
    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("NON-DISCLOSURE AGREEMENT", 105, 20, { align: "center" });
    
    let yPosition = 40;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    // Introduction
    const introText = `This Non-Disclosure Agreement ("Agreement") is entered into and made effective as of ${formData.effectiveDate} ("Effective Date"), by and between ${formData.disclosingPartyName}, having its address at ${formData.disclosingPartyAddress} ("Disclosing Party"), and ${formData.recipientName}, having its address at ${formData.recipientAddress} ("Recipient").`;
    const introLines = doc.splitTextToSize(introText, 170);
    doc.text(introLines, 20, yPosition);
    yPosition += introLines.length * lineHeight + 10;

    const purposeText = `The Disclosing Party intends to disclose certain confidential and proprietary information to the Recipient, and the Recipient agrees to maintain the confidentiality of such information under the terms and conditions set forth herein. Accordingly, the parties hereby agree as follows:`;
    const purposeLines = doc.splitTextToSize(purposeText, 170);
    doc.text(purposeLines, 20, yPosition);
    yPosition += purposeLines.length * lineHeight + 15;

    // Section 1: Confidential Information
    doc.setFont("helvetica", "bold");
    doc.text("1. Confidential Information", 20, yPosition);
    yPosition += 8;
    
    doc.setFont("helvetica", "normal");
    const section1Text = `"Confidential Information" shall mean any and all non-public, proprietary, or confidential data or information disclosed, whether directly or indirectly, by the Disclosing Party to the Recipient in any form—oral, written, visual, or otherwise—including but not limited to trade secrets, business plans, technical data, financial information, customer information, and any other data or material disclosed on or after the Effective Date.`;
    const section1Lines = doc.splitTextToSize(section1Text, 170);
    doc.text(section1Lines, 20, yPosition);
    yPosition += section1Lines.length * lineHeight + 10;

    // Section 2: Term
    doc.setFont("helvetica", "bold");
    doc.text("2. Term", 20, yPosition);
    yPosition += 8;
    
    doc.setFont("helvetica", "normal");
    const section2Text = `This Agreement shall commence on the Effective Date and shall continue in effect until ${formData.terminationDate} ("Termination Date"), unless earlier terminated in accordance with the Termination clause below. The Termination Date may be extended only by mutual written agreement of the parties. The Recipient shall maintain the confidentiality of all Confidential Information disclosed during the term of this Agreement both throughout the term and indefinitely thereafter.`;
    const section2Lines = doc.splitTextToSize(section2Text, 170);
    doc.text(section2Lines, 20, yPosition);
    yPosition += section2Lines.length * lineHeight + 10;

    // Check if we need a new page
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }

    // Section 3: Termination
    doc.setFont("helvetica", "bold");
    doc.text("3. Termination", 20, yPosition);
    yPosition += 8;
    
    doc.setFont("helvetica", "normal");
    const section3Text = `Either party may terminate this Agreement prior to the Termination Date, with or without cause, by providing ${formData.earlyTerminationDays} days' written notice to the other party ("Early Termination"). Upon such termination, the Recipient shall remain bound by the confidentiality obligations set forth herein with respect to all Confidential Information received prior to the termination, indefinitely.`;
    const section3Lines = doc.splitTextToSize(section3Text, 170);
    doc.text(section3Lines, 20, yPosition);
    yPosition += section3Lines.length * lineHeight + 10;

    // Section 4-17 (existing and new sections)
    const sections = [
      {
        title: "4. Protection of Confidential Information",
        content: `The Recipient acknowledges that the Confidential Information is a valuable and unique asset developed through significant investment of time, effort, and resources by the Disclosing Party. In consideration of the disclosure of such information, the Recipient agrees as follows: (a) Non-Disclosure. The Recipient shall hold the Confidential Information in strict confidence and shall not disclose it to any third party without the prior written consent of the Disclosing Party. (b) Non-Copying/Modification. The Recipient shall not copy, reproduce, or modify any Confidential Information without the express prior written consent of the Disclosing Party. (c) Unauthorized Use. The Recipient shall promptly notify the Disclosing Party upon becoming aware of any unauthorized use or disclosure of Confidential Information. (d) Disclosure to Employees. Confidential Information may only be disclosed to employees of the Recipient on a strict need-to-know basis, and such employees shall, at the request of the Disclosing Party, be required to execute a non-disclosure agreement with terms substantially similar to those contained herein.`
      },
      {
        title: "5. Exceptions",
        content: `Confidential Information shall not include information that: (i) Is or becomes publicly known through no fault of the Recipient; (ii) Is received lawfully by the Recipient from a third party without a duty of confidentiality; (iii) Is independently developed by the Recipient without use of the Confidential Information; (iv) Is disclosed pursuant to legal or regulatory obligation; or (v) Is expressly agreed in writing by both parties not to be confidential.`
      },
      {
        title: "6. Unauthorized Disclosure – Injunctive Relief",
        content: `The Recipient acknowledges that any unauthorized disclosure or threatened disclosure of Confidential Information may result in irreparable harm to the Disclosing Party, for which monetary damages may be inadequate. Accordingly, the Disclosing Party shall be entitled to seek injunctive or equitable relief in addition to any other remedies available at law.`
      },
      {
        title: "7. Whistleblower Protection",
        content: `In accordance with the Defend Trade Secrets Act, the Recipient shall not be held criminally or civilly liable for disclosure of a trade secret: (i) Made in confidence to a government official or attorney for the purpose of reporting a legal violation; or (ii) Made in a court filing under seal.`
      },
      {
        title: "8. Non-Circumvention",
        content: `For a period of ${formData.nonCircumventionDuration || '[insert duration]'} from the Effective Date, the Recipient agrees not to circumvent or attempt to circumvent the Disclosing Party by initiating or engaging in any business transactions with contacts or opportunities introduced by the Disclosing Party, without the Disclosing Party's prior written consent. In the event of a breach, the Disclosing Party shall be entitled to commissions, profits, or other compensation it would have received but for the circumvention.`
      },
      {
        title: "9. Return or Destruction of Confidential Information",
        content: `Upon termination of this Agreement or upon written request by the Disclosing Party, the Recipient shall promptly return or permanently destroy all Confidential Information, including all copies, summaries, notes, or derivations thereof, and shall certify in writing that all such materials have been returned or destroyed.`
      },
      {
        title: "10. No Obligation to Transact",
        content: `Nothing in this Agreement shall be construed to obligate either party to enter into any business arrangement, transaction, or contract. This Agreement does not create any agency, partnership, or joint venture between the parties.`
      },
      {
        title: "11. No Warranty",
        content: `All Confidential Information is provided “as is.” The Disclosing Party makes no representations or warranties, express or implied, regarding the accuracy, completeness, merchantability, fitness for a particular purpose, or non-infringement of the Confidential Information.`
      },
      {
        title: "12. Limited License",
        content: `This Agreement grants the Recipient no ownership or intellectual property rights in or to the Confidential Information, except for the limited purpose of internal evaluation or as otherwise permitted herein. All intellectual property rights shall remain the exclusive property of the Disclosing Party.`
      },
      {
        title: "13. Indemnification",
        content: `The Recipient shall indemnify and hold harmless the Disclosing Party from and against any and all claims, liabilities, losses, costs, and expenses (including reasonable attorneys’ fees) resulting from any breach of this Agreement by the Recipient or its employees, agents, or representatives.`
      },
      {
        title: "14. Attorney’s Fees",
        content: `In the event of any litigation, arbitration, or other legal proceeding arising from or relating to this Agreement, the prevailing party shall be entitled to recover its reasonable attorneys’ fees and costs, in addition to any other relief to which it may be entitled.`
      },
      {
        title: "15. Entire Agreement",
        content: `This Agreement constitutes the entire understanding between the parties concerning the subject matter hereof and supersedes all prior and contemporaneous communications, agreements, or understandings, whether oral or written. Any amendments or modifications to this Agreement must be in writing and signed by both parties.`
      },
      {
        title: "16. Amendment",
        content: `This Agreement may be modified, amended, or supplemented only if the changes are made in writing and signed by both parties.`
      },
      {
        title: "17. Governing Law",
        content: `This Agreement shall be governed by the laws of ${stateName}, ${countryName}.`
      },
      {
        title: "18. Signatories",
        content: `This Agreement shall be executed by ${formData.disclosingSignatoryName || '______'}, on behalf of ${formData.disclosingPartyName || '______'} and ${formData.recipientSignatoryName || '______'} and delivered in the manner prescribed by law as of the date first written above.`
      }
    ];

    sections.forEach(section => {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFont("helvetica", "bold");
      doc.text(section.title, 20, yPosition);
      yPosition += 8;
      
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(section.content, 170);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * lineHeight + 10;
    });

    // Signature section
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.text("SIGNATURES", 20, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    doc.text("Disclosing Party:", 20, yPosition);
    yPosition += 10;
    doc.text(`Name: ${formData.disclosingSignatoryName}`, 20, yPosition);
    yPosition += 10;
    doc.text("Signature: _______________________", 20, yPosition);
    yPosition += 10;
    doc.text(`Title: ${formData.disclosingSignatoryTitle}`, 20, yPosition);
    yPosition += 10;
    doc.text("Date: ___________________________", 20, yPosition);
    yPosition += 30;

    doc.text("Recipient:", 20, yPosition);
    yPosition += 10;
    doc.text(`Name: ${formData.recipientSignatoryName}`, 20, yPosition);
    yPosition += 10;
    doc.text("Signature: _______________________", 20, yPosition);
    yPosition += 10;
    doc.text(`Title: ${formData.recipientSignatoryTitle}`, 20, yPosition);
    yPosition += 10;
    doc.text("Date: ___________________________", 20, yPosition);
    
    doc.save('non-disclosure-agreement.pdf');
    toast.success("Non-Disclosure Agreement PDF generated successfully!");
    setIsGeneratingPDF(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country || ''}
                  onValueChange={(value) => handleInputChange('country', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllCountries().map((country) => (
                      <SelectItem key={country.id} value={`${country.id}:${country.name}`}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Select
                  value={formData.state || ''}
                  onValueChange={(value) => handleInputChange('state', value)}
                  disabled={!formData.country}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state/province..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatesForCountry(formData.country).map((stateOption) => {
                      const [id, name] = stateOption.split(':');
                      return (
                        <SelectItem key={id} value={stateOption}>
                          {name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="effectiveDate">Effective Date</Label>
              <Input
                id="effectiveDate"
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                placeholder="Select effective date"
              />
            </div>
            <div>
              <Label htmlFor="disclosingPartyName">Disclosing Party Name</Label>
              <Input
                id="disclosingPartyName"
                value={formData.disclosingPartyName}
                onChange={(e) => handleInputChange('disclosingPartyName', e.target.value)}
                placeholder="Enter name of disclosing party"
              />
            </div>
            <div>
              <Label htmlFor="disclosingPartyAddress">Disclosing Party Address</Label>
              <Textarea
                id="disclosingPartyAddress"
                value={formData.disclosingPartyAddress}
                onChange={(e) => handleInputChange('disclosingPartyAddress', e.target.value)}
                placeholder="Enter complete address of disclosing party"
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) => handleInputChange('recipientName', e.target.value)}
                placeholder="Enter name of recipient"
              />
            </div>
            <div>
              <Label htmlFor="recipientAddress">Recipient Address</Label>
              <Textarea
                id="recipientAddress"
                value={formData.recipientAddress}
                onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
                placeholder="Enter complete address of recipient"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="terminationDate">Termination Date</Label>
              <Input
                id="terminationDate"
                type="date"
                value={formData.terminationDate}
                onChange={(e) => handleInputChange('terminationDate', e.target.value)}
                placeholder="Select termination date"
              />
            </div>
            <div>
              <Label htmlFor="earlyTerminationDays">Early Termination Notice (Days)</Label>
              <Input
                id="earlyTerminationDays"
                type="number"
                value={formData.earlyTerminationDays}
                onChange={(e) => handleInputChange('earlyTerminationDays', e.target.value)}
                placeholder="Enter number of days for early termination notice"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="nonCircumventionDuration">Non-Circumvention Duration</Label>
              <Input
                id="nonCircumventionDuration"
                value={formData.nonCircumventionDuration}
                onChange={(e) => handleInputChange('nonCircumventionDuration', e.target.value)}
                placeholder="e.g., 2 years, 18 months"
              />
            </div>
            <div>
              <Label htmlFor="governingLaw">Governing Law</Label>
              <Input
                id="governingLaw"
                value={formData.governingLaw}
                onChange={(e) => handleInputChange('governingLaw', e.target.value)}
                placeholder="Enter jurisdiction for governing law"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Signatory Information</h3>
            <div className="space-y-4">
              <h4 className="font-medium">Disclosing Party Signatory</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="disclosingSignatoryName">Name</Label>
                  <Input
                    id="disclosingSignatoryName"
                    value={formData.disclosingSignatoryName}
                    onChange={(e) => handleInputChange('disclosingSignatoryName', e.target.value)}
                    placeholder="Enter signatory name"
                  />
                </div>
                <div>
                  <Label htmlFor="disclosingSignatoryTitle">Title</Label>
                  <Input
                    id="disclosingSignatoryTitle"
                    value={formData.disclosingSignatoryTitle}
                    onChange={(e) => handleInputChange('disclosingSignatoryTitle', e.target.value)}
                    placeholder="Enter signatory title"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Recipient Signatory</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipientSignatoryName">Name</Label>
                  <Input
                    id="recipientSignatoryName"
                    value={formData.recipientSignatoryName}
                    onChange={(e) => handleInputChange('recipientSignatoryName', e.target.value)}
                    placeholder="Enter signatory name"
                  />
                </div>
                <div>
                  <Label htmlFor="recipientSignatoryTitle">Title</Label>
                  <Input
                    id="recipientSignatoryTitle"
                    value={formData.recipientSignatoryTitle}
                    onChange={(e) => handleInputChange('recipientSignatoryTitle', e.target.value)}
                    placeholder="Enter signatory title"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <UserInfoStep
            onBack={handleBack}
            onGenerate={generatePDF}
            documentType="Non-Disclosure Agreement"
            isGenerating={isGeneratingPDF}
          />
        );

      default:
        return null;
    }
  };

  const renderFormSummary = () => {
    const countryName = formData.country ? getCountryName(formData.country.split(':')[0]) : '';
    const stateName = formData.state ? getStateName(formData.country?.split(':')[0] || '', formData.state.split(':')[0]) : '';
    
    return (
      <div className="space-y-4 text-sm">
        <div>
          <strong>Location:</strong><br />
          Country: {countryName}<br />
          State: {stateName}
        </div>
        <div>
          <strong>Agreement Details:</strong><br />
          Effective Date: {formData.effectiveDate}<br />
          Termination Date: {formData.terminationDate}<br />
          Early Termination Notice: {formData.earlyTerminationDays} days
        </div>
        <div>
          <strong>Disclosing Party:</strong><br />
          Name: {formData.disclosingPartyName}<br />
          Address: {formData.disclosingPartyAddress}<br />
          Signatory: {formData.disclosingSignatoryName} ({formData.disclosingSignatoryTitle})
        </div>
        <div>
          <strong>Recipient:</strong><br />
          Name: {formData.recipientName}<br />
          Address: {formData.recipientAddress}<br />
          Signatory: {formData.recipientSignatoryName} ({formData.recipientSignatoryTitle})
        </div>
        <div>
          <strong>Additional Terms:</strong><br />
          Non-Circumvention Duration: {formData.nonCircumventionDuration}<br />
          Governing Law: {formData.governingLaw}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Non-Disclosure Agreement.
          </p>
        </div>
      </div>
    );
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Location & Disclosing Party";
      case 2:
        return "Recipient & Terms";
      case 3:
        return "Legal Terms";
      case 4:
        return "Signatories";
      case 5:
        return "Contact Information";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Select your location and enter disclosing party details";
      case 2:
        return "Provide recipient information and agreement terms";
      case 3:
        return "Define legal terms and governing law";
      case 4:
        return "Enter signatory information for both parties";
      case 5:
        return "Provide your contact information to generate the document";
      default:
        return "";
    }
  };

  if (isComplete) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-600">Non-Disclosure Agreement</CardTitle>
            <CardDescription>
              Review your Non-Disclosure Agreement details below before generating the final document.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderFormSummary()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => {
                setCurrentStep(1);
                setIsComplete(false);
                setFormData({
                  country: '',
                  state: '',
                  effectiveDate: '',
                  disclosingPartyName: '',
                  disclosingPartyAddress: '',
                  recipientName: '',
                  recipientAddress: '',
                  terminationDate: '',
                  earlyTerminationDays: '',
                  nonCircumventionDuration: '',
                  governingLaw: '',
                  disclosingSignatoryName: '',
                  disclosingSignatoryTitle: '',
                  recipientSignatoryName: '',
                  recipientSignatoryTitle: ''
                });
              }}
            >
              Start Over
            </Button>
            <Button onClick={generatePDF}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm p-4">
      <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">{getStepTitle()}</CardTitle>
          <CardDescription>
            {getStepDescription()}
            <div className="mt-2 text-sm">
              Step {currentStep} of 5
            </div>
          </CardDescription>
          {currentStep === 1 && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/nda-info')}
                className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn More About NDAs
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="text-black">
          {renderStepContent()}
        </CardContent>
        {currentStep !== 5 && (
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!canAdvance()}
            >
              {currentStep === 4 ? (
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
        )}
      </Card>
    </div>
  );
};

export default NDAForm;
