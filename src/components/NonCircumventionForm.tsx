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
import { format } from "date-fns";
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

interface NonCircumventionData {
  state: string;
  country: string;
  effectiveDate: string;
  disclosingPartyName: string;
  recipientName: string;
  businessOpportunity: string;
  opportunitySubjectMatter: string;
  commissionPercentage: string;
  arbitrationCity: string;
  executionDate: string;
  disclosingPartySignatory: string;
  recipientSignatory: string;
}

const NonCircumventionForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<NonCircumventionData>({
    state: '',
    country: '',
    effectiveDate: '',
    disclosingPartyName: '',
    recipientName: '',
    businessOpportunity: '',
    opportunitySubjectMatter: '',
    commissionPercentage: '',
    arbitrationCity: '',
    executionDate: '',
    disclosingPartySignatory: '',
    recipientSignatory: ''
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const totalSteps = 6;

  const handleInputChange = (field: keyof NonCircumventionData, value: string) => {
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
        return !!(formData.state && formData.country);
      case 2:
        return !!(formData.effectiveDate && formData.disclosingPartyName && formData.recipientName);
      case 3:
        return !!(formData.businessOpportunity && formData.opportunitySubjectMatter);
      case 4:
        return !!(formData.commissionPercentage && formData.arbitrationCity);
      case 5:
        return !!(formData.executionDate && formData.disclosingPartySignatory && formData.recipientSignatory);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canAdvance()) return;
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5) {
      setCurrentStep(6); // User info step
    } else if (currentStep === 6) {
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
    try {
      const doc = new jsPDF();
      
      // Set up the document
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Non-Circumvention Agreement", 105, 20, { align: "center" });
      
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
        
        if (title) {
          doc.setFont("helvetica", "bold");
          doc.text(title, 15, y);
          y += lineHeight + 3;
        }
        
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(content, 170);
        lines.forEach((line: string) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 15, y);
          y += lineHeight;
        });
        y += lineHeight + 3;
      };

      // Get formatted dates
      const effectiveDate = formData.effectiveDate ? format(new Date(formData.effectiveDate), 'MMMM d, yyyy') : '____________';
      const executionDate = formData.executionDate ? format(new Date(formData.executionDate), 'MMMM d, yyyy') : '____________';
      
      // Introduction
      addSection("", `This Non-Circumvention Agreement (this "Agreement") is made effective as of ${effectiveDate} (the "Effective Date"), by and between`);
      
      addSection("", `${formData.disclosingPartyName || '______________________________'}, (the "Disclosing Party"),`);
      
      addSection("", "And");
      
      addSection("", `${formData.recipientName || '______________________________'}, (the "Recipient").`);
      addSection("", `Each individually a "Party" and collectively referred to as the "Parties."`);

      // Recitals
      addSection("Recitals", `WHEREAS, ${formData.disclosingPartyName || '________________________'} has a business opportunity related to ${formData.businessOpportunity || '________________________'}, and may share opportunities connected with such subject matter;`);
      
      addSection("", "WHEREAS, all Parties have valuable and strategic relationships with clients, suppliers, vendors, and contacts that are vital to their business interests;");
      
      addSection("", "WHEREAS, the Parties acknowledge that neither shall attempt to circumvent the other in a way that deprives either of potential business or economic benefits related to the opportunity;");
      
      addSection("", "WHEREAS, the Parties agree that introductions made between contacts, partners, or affiliates are to be honored and not used as a means to bypass or exploit the originating party;");
      
      addSection("", "NOW, THEREFORE, in consideration of the mutual promises and agreements set forth herein, and for other good and valuable consideration, the Parties agree as follows:");

      // Section I: NON-CIRCUMVENTION (Contacts)
      addSection("I. NON-CIRCUMVENTION (Contacts)", "The Recipient agrees not to contact, negotiate, contract with, or otherwise engage in any transaction, directly or indirectly, with any individual, company, affiliate, agent, broker, employee, or contact introduced by the Disclosing Party, without the prior written consent of the Disclosing Party.");
      
      addSection("", "The Recipient shall not interfere with, bypass, or attempt to circumvent the business dealings or opportunities of the Disclosing Party.");
      
      addSection("", "If a transaction is completed in violation of this Agreement, the Disclosing Party shall be entitled to any commissions, profits, or benefits that would have resulted had the Recipient honored the non-circumvention obligations.");

      // Section II: TERM OF AGREEMENT
      addSection("II. TERM OF AGREEMENT", "The obligations under this Agreement shall remain in effect for an indefinite period. Either Party may terminate this Agreement by providing thirty (30) days' prior written notice to the other Party.");
      
      addSection("", "Termination will not affect any confidentiality obligations or business protections regarding information or contacts obtained prior to the termination date.");

      // Section III: COMMISSION OR FEE AGREEMENTS
      addSection("III. COMMISSION OR FEE AGREEMENTS", `If the Recipient violates this Agreement and completes a business transaction, they agree to pay a monetary penalty equal to ${formData.commissionPercentage || '___'}% of the total commission or transaction value that would have been due to the Disclosing Party.`);

      // Section IV: CONFIDENTIAL INFORMATION
      addSection("IV. CONFIDENTIAL INFORMATION", "7. Trade Secrets");
      addSection("", "All shared information shall be considered confidential and proprietary. This includes but is not limited to:");
      addSection("", "Client lists");
      addSection("", "Contact information");
      addSection("", "Business strategies");
      addSection("", "Acquisition details");
      addSection("", "Marketing plans");
      addSection("", "Financial records");
      addSection("", "Contract terms");
      addSection("", "Neither Party shall disclose such information to any third party without the other's prior written consent.");
      
      addSection("", "8. Confidentiality Obligation");
      addSection("", "Each Party agrees to:");
      addSection("", "Protect all confidential information using at least the same level of care as their own proprietary information;");
      addSection("", "Not disclose, duplicate, or distribute such information without written consent;");
      addSection("", "Limit access to employees or agents who are bound by confidentiality obligations.");

      // Section V: UNAUTHORIZED DISCLOSURE – INJUNCTIVE RELIEF
      addSection("V. UNAUTHORIZED DISCLOSURE – INJUNCTIVE RELIEF", "If any Party breaches this Agreement or threatens to breach it by disclosing confidential contacts or information:");
      addSection("", "The harmed Party shall be entitled to injunctive relief to prevent such disclosure;");
      addSection("", "The harmed Party may also recover actual damages, attorney's fees, and all legal expenses related to enforcement.");

      // Section VI: APPLICABILITY OF AGREEMENT
      addSection("VI. APPLICABILITY OF AGREEMENT", "This Agreement shall apply equally to all owners, partners, employees, contractors, affiliates, and representatives of both Parties, including their successors and assigns.");

      // Section VII: RETURN OF CONFIDENTIAL INFORMATION
      addSection("VII. RETURN OF CONFIDENTIAL INFORMATION", "Upon written request by the Disclosing Party, the Recipient agrees to return all documents, data, or materials related to the confidential information, and shall certify in writing within five (5) business days that all such materials have been returned or destroyed.");

      // Section VIII: RELATIONSHIP OF THE PARTIES
      addSection("VIII. RELATIONSHIP OF THE PARTIES", "Nothing in this Agreement shall be construed as establishing a partnership, joint venture, or employment relationship between the Parties. Each Party shall remain independent and responsible for its own operations.");

      // Section IX: NO WARRANTY
      addSection("IX. NO WARRANTY", `All confidential information is provided "as is." The Disclosing Party makes no warranties, express or implied, regarding the accuracy, reliability, or completeness of the information disclosed.`);

      // Section X: ATTORNEYS' FEES
      addSection("X. ATTORNEYS' FEES", "In any legal proceeding arising from this Agreement, the prevailing Party shall be entitled to recover reasonable attorney's fees and court costs.");

      // Section XI: ARBITRATION
      addSection("XI. ARBITRATION", `Any dispute arising from this Agreement shall be resolved by binding arbitration in the city of ${formData.arbitrationCity || '____________________'}, in accordance with the rules of the American Arbitration Association. The decision shall be final and enforceable in any court of competent jurisdiction.`);

      // Section XII: GENERAL PROVISIONS
      addSection("XII. GENERAL PROVISIONS", "This Agreement represents the entire understanding between the Parties.");
      addSection("", "No amendment or modification shall be valid unless in writing and signed by both Parties.");
      addSection("", "The failure to enforce any part of this Agreement shall not be deemed a waiver.");
      addSection("", "If any provision is found to be unenforceable, the remainder shall remain in full force and effect.");

      // Section XIII: FORCE MAJEURE
      addSection("XIII. FORCE MAJEURE", `If performance is prevented by causes beyond either Party's reasonable control ("Force Majeure"), including but not limited to natural disasters, pandemics, strikes, war, or governmental restrictions:`);
      addSection("", "Obligations shall be suspended to the extent impacted;");
      addSection("", "The affected Party shall promptly notify the other and resume performance as soon as practicable.");

      // Section XIV: SIGNATURES
      addSection("XIV. SIGNATURES", `This Agreement shall be executed as of ${executionDate}, and delivered in accordance with applicable law.`);

      // Signature section
      if (y > pageHeight - 100) {
        doc.addPage();
        y = 20;
      }

      y += 10;

      // Disclosing Party signature
      doc.text("Disclosing Party:", 15, y);
      y += lineHeight + 5;
      doc.text(`Name: ${formData.disclosingPartySignatory || '_________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text("Signature: ______________________", 15, y);
      y += lineHeight + 5;
      doc.text("Date: __________________________", 15, y);
      y += lineHeight + 15;

      // Recipient signature
      doc.text("Recipient:", 15, y);
      y += lineHeight + 5;
      doc.text(`Name: ${formData.recipientSignatory || '_________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text("Signature: ______________________", 15, y);
      y += lineHeight + 5;
      doc.text("Date: __________________________", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `non_circumvention_agreement_${timestamp}.pdf`;
      
      doc.save(filename);
      toast.success("Non-Circumvention Agreement generated successfully!");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Non-Circumvention Agreement");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Location Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => handleInputChange('country', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllCountries().map((country) => (
                      <SelectItem key={country.id} value={`${country.id}:${country.name}`}>
                        {country.emoji} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => handleInputChange('state', value)}
                  disabled={!formData.country}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state/province" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatesForCountry(formData.country).map((state) => {
                      const [stateId, stateName] = state.split(':');
                      return (
                        <SelectItem key={stateId} value={state}>
                          {stateName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Agreement Information</h3>
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
                placeholder="Enter name of party sharing business opportunities/contacts"
              />
            </div>
            <div>
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) => handleInputChange('recipientName', e.target.value)}
                placeholder="Enter name of party receiving opportunities/contacts"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Opportunity Details</h3>
            <div>
              <Label htmlFor="businessOpportunity">Business Opportunity Description</Label>
              <Textarea
                id="businessOpportunity"
                value={formData.businessOpportunity}
                onChange={(e) => handleInputChange('businessOpportunity', e.target.value)}
                placeholder="Describe the business opportunity (e.g., real estate investment, technology partnership, etc.)"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="opportunitySubjectMatter">Opportunity Subject Matter</Label>
              <Textarea
                id="opportunitySubjectMatter"
                value={formData.opportunitySubjectMatter}
                onChange={(e) => handleInputChange('opportunitySubjectMatter', e.target.value)}
                placeholder="Describe connected opportunities and subject matter"
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Agreement Terms</h3>
            <div>
              <Label htmlFor="commissionPercentage">Commission/Fee Penalty Percentage</Label>
              <Input
                id="commissionPercentage"
                type="number"
                min="0"
                max="100"
                value={formData.commissionPercentage}
                onChange={(e) => handleInputChange('commissionPercentage', e.target.value)}
                placeholder="Enter percentage (e.g., 10 for 10%)"
              />
              <p className="text-sm text-gray-600 mt-1">
                Monetary penalty percentage for agreement violations
              </p>
            </div>
            <div>
              <Label htmlFor="arbitrationCity">Arbitration City</Label>
              <Input
                id="arbitrationCity"
                value={formData.arbitrationCity}
                onChange={(e) => handleInputChange('arbitrationCity', e.target.value)}
                placeholder="Enter city where disputes will be resolved (e.g., New York, NY)"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Execution & Signatures</h3>
            <div>
              <Label htmlFor="executionDate">Execution Date</Label>
              <Input
                id="executionDate"
                type="date"
                value={formData.executionDate}
                onChange={(e) => handleInputChange('executionDate', e.target.value)}
                placeholder="Select execution date"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="disclosingPartySignatory">Disclosing Party Signatory</Label>
                <Input
                  id="disclosingPartySignatory"
                  value={formData.disclosingPartySignatory}
                  onChange={(e) => handleInputChange('disclosingPartySignatory', e.target.value)}
                  placeholder="Name of person signing for disclosing party"
                />
              </div>
              <div>
                <Label htmlFor="recipientSignatory">Recipient Signatory</Label>
                <Input
                  id="recipientSignatory"
                  value={formData.recipientSignatory}
                  onChange={(e) => handleInputChange('recipientSignatory', e.target.value)}
                  placeholder="Name of person signing for recipient"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderFormSummary = () => {
    const countryName = formData.country ? formData.country.split(':')[1] : 'Not provided';
    const stateName = formData.state ? formData.state.split(':')[1] : 'Not provided';
    
    return (
      <div className="space-y-4 text-sm">
        <div>
          <strong>Location:</strong><br />
          Country: {countryName}<br />
          State/Province: {stateName}
        </div>
        <div>
          <strong>Agreement Details:</strong><br />
          Effective Date: {formData.effectiveDate ? format(new Date(formData.effectiveDate), 'PPP') : 'Not provided'}<br />
          Execution Date: {formData.executionDate ? format(new Date(formData.executionDate), 'PPP') : 'Not provided'}
        </div>
        <div>
          <strong>Parties:</strong><br />
          Disclosing Party: {formData.disclosingPartyName}<br />
          Recipient: {formData.recipientName}
        </div>
        <div>
          <strong>Business Opportunity:</strong><br />
          Description: {formData.businessOpportunity}<br />
          Subject Matter: {formData.opportunitySubjectMatter}
        </div>
        <div>
          <strong>Agreement Terms:</strong><br />
          Commission Penalty: {formData.commissionPercentage}%<br />
          Arbitration City: {formData.arbitrationCity}
        </div>
        <div>
          <strong>Signatories:</strong><br />
          Disclosing Party: {formData.disclosingPartySignatory}<br />
          Recipient: {formData.recipientSignatory}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Non-Circumvention Agreement.
          </p>
        </div>
      </div>
    );
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Location Information";
      case 2:
        return "Agreement Parties & Date";
      case 3:
        return "Business Opportunity Details";
      case 4:
        return "Agreement Terms";
      case 5:
        return "Execution & Signatures";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Select your country and state/province for this agreement";
      case 2:
        return "Identify the parties and set the effective date";
      case 3:
        return "Describe the business opportunity and subject matter";
      case 4:
        return "Define commission penalties and arbitration location";
      case 5:
        return "Set execution date and signatory information";
      default:
        return "";
    }
  };

  if (isComplete) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-600">Non-Circumvention Agreement</CardTitle>
            <CardDescription>
              Review your agreement details below before generating the final document.
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
                  state: '',
                  country: '',
                  effectiveDate: '',
                  disclosingPartyName: '',
                  recipientName: '',
                  businessOpportunity: '',
                  opportunitySubjectMatter: '',
                  commissionPercentage: '',
                  arbitrationCity: '',
                  executionDate: '',
                  disclosingPartySignatory: '',
                  recipientSignatory: ''
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

  if (currentStep === 6) {
    return (
      <UserInfoStep
        onBack={() => setCurrentStep(5)}
        onGenerate={generatePDF}
        documentType="Non-Circumvention Agreement"
        isGenerating={isGeneratingPDF}
      />
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
              Step {currentStep} of {totalSteps}
            </div>
          </CardDescription>
          {currentStep === 1 && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/non-circumvention-info')}
                className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn More About Non-Circumvention Agreements
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="text-black">
          {renderStepContent()}
        </CardContent>
        {currentStep !== 6 && (
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
              {currentStep === 5 ? (
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

export default NonCircumventionForm;
