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

interface RoyaltyAgreementData {
  state: string;
  country: string;
  effectiveDate: string;
  grantorName: string;
  grantorAddress: string;
  granteeName: string;
  granteeAddress: string;
  propertyDescription: string;
  territory: string;
  royaltyAmountPerUnit: string;
  royaltyPercentage: string;
  royaltyType: string; // "per_unit" or "percentage"
  paymentFrequency: string; // "monthly" or "quarterly"
  latePaymentDays: string;
  breachCureDays: string;
  governingState: string;
  grantorSignature: string;
  grantorSignatureDate: string;
  granteeSignature: string;
  granteeSignatureDate: string;
}

const RoyaltyAgreementForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formData, setFormData] = useState<RoyaltyAgreementData>({
    state: '',
    country: '',
    effectiveDate: '',
    grantorName: '',
    grantorAddress: '',
    granteeName: '',
    granteeAddress: '',
    propertyDescription: '',
    territory: '',
    royaltyAmountPerUnit: '',
    royaltyPercentage: '',
    royaltyType: 'percentage',
    paymentFrequency: 'quarterly',
    latePaymentDays: '30',
    breachCureDays: '30',
    governingState: '',
    grantorSignature: '',
    grantorSignatureDate: '',
    granteeSignature: '',
    granteeSignatureDate: ''
  });

  const handleInputChange = (field: keyof RoyaltyAgreementData, value: string) => {
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
        return !!(formData.effectiveDate && formData.grantorName && formData.grantorAddress && formData.granteeName && formData.granteeAddress);
      case 3:
        return !!(formData.propertyDescription && formData.territory);
      case 4:
        return !!(
          formData.paymentFrequency && 
          formData.latePaymentDays && 
          formData.breachCureDays && 
          (formData.royaltyType === 'percentage' ? formData.royaltyPercentage : formData.royaltyAmountPerUnit)
        );
      case 5:
        return !!(formData.governingState);
      case 6:
        return false; // Handled by UserInfoStep component
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canAdvance()) return;

    if (currentStep < 6) {
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
    
    try {
      const doc = new jsPDF();
      
      // Set up the document
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Royalty Agreement", 105, 20, { align: "center" });
      
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

      // Get formatted date
      const effectiveDate = formData.effectiveDate ? format(new Date(formData.effectiveDate), 'MMMM d, yyyy') : '____________';
      
      // Introduction
      addSection("", `This Royalty Agreement ("Agreement") is made effective as of ${effectiveDate}, by and between`);
      
      addSection("", `${formData.grantorName || '**_______________________**'}, of ${formData.grantorAddress || '****'} (hereinafter referred to as "Grantor"),`);
      addSection("", "and");
      addSection("", `${formData.granteeName || '**_______________________**'}, of ${formData.granteeAddress || '**____________**'} (hereinafter referred to as "Grantee").`);

      // WHEREAS clauses
      addSection("", `Whereas Grantor owns or controls the rights to certain intellectual property described as:`);
      addSection("", `${formData.propertyDescription || '_________________________________________________________________________'}`);
      addSection("", `(hereinafter referred to as the "Property");`);
      
      addSection("", `And whereas Grantee wishes to obtain rights from Grantor for the purpose of producing, marketing, or selling products/services incorporating said Property in exchange for royalty compensation;`);
      
      addSection("", `Now, therefore, in consideration of the mutual covenants set forth herein, the parties agree as follows:`);

      // Section 1: Grant of Rights
      addSection("1. Grant of Rights", `Grantor hereby grants to Grantee the exclusive right and license to use the Property within the territory of ${formData.territory || '_________________________'} for the purpose of commercial production, promotion, distribution, and sale.`);

      // Section 2: Grantor's Representations and Warranties
      addSection("2. Grantor's Representations and Warranties", "Grantor represents and warrants that:");
      addSection("", "Grantor owns or controls all rights to the Property and has the authority to grant such rights;");
      addSection("", "Grantor has not previously assigned, transferred, or encumbered any rights to the Property that conflict with this Agreement;");
      addSection("", "Grantor will indemnify and hold harmless Grantee from any claims, damages, or liabilities arising from breach of the above representations.");

      // Section 3: Grantee's Representations and Warranties
      addSection("3. Grantee's Representations and Warranties", "Grantee represents and warrants that:");
      addSection("", "Grantee will use the Property solely for the purposes outlined in this Agreement;");
      addSection("", "Grantee shall comply with all laws and regulations regarding commercialization of the Property;");
      addSection("", "Grantee shall maintain the confidentiality of any proprietary information provided by Grantor;");
      addSection("", "Grantee will not infringe or misuse any third-party rights in connection with the Property.");

      // Section 4: Royalty
      const royaltyText = formData.royaltyType === 'per_unit' 
        ? `A royalty of $${formData.royaltyAmountPerUnit || '_________'} per unit of the product sold, or`
        : `${formData.royaltyPercentage || '_______'}% of gross/net sales revenue derived from the use of the Property.`;
      
      addSection("4. Royalty", `As compensation for the rights granted under this Agreement, Grantee agrees to pay Grantor:`);
      addSection("", royaltyText);

      // Section 5: Net Profits
      addSection("5. Net Profits", `"The Profits" shall be defined as total revenue received by Grantee from sales of the Property, less:`);
      addSection("", "Direct manufacturing expenses;");
      addSection("", "Shipping and handling costs;");
      addSection("", "Sales commissions and taxes.");

      // Section 6: Payment of Royalties
      addSection("6. Payment of Royalties", `Royalty payments shall be made to Grantor on a ${formData.paymentFrequency || '_________'} (monthly/quarterly) basis, along with a detailed report outlining:`);
      addSection("", "Units sold or services rendered;");
      addSection("", "Gross revenue received;");
      addSection("", "Royalties owed for the period.");

      // Section 7: Grantee Default
      addSection("7. Grantee Default", "");
      addSection("a. Late Payment", `If Grantee fails to make timely payments, Grantor may issue a written notice. If payment is not made within ${formData.latePaymentDays || '_______'} days of notice, Grantor may terminate the Agreement.`);
      addSection("b. Unauthorized Use", "If Grantee uses the Property in an unapproved manner, Grantor may terminate this Agreement immediately and seek damages.");

      // Section 8: Indemnity
      addSection("8. Indemnity", "Each party agrees to indemnify and hold the other harmless from any and all claims, losses, liabilities, or damages arising out of any breach of this Agreement or from use of the Property inconsistent with this Agreement.");

      // Section 9: Confidentiality
      addSection("9. Confidentiality", "Each party agrees to maintain the confidentiality of all proprietary, technical, and business information received under this Agreement and not to disclose it to third parties without prior written consent, unless required by law.");

      // Section 10: Termination
      addSection("10. Termination", "This Agreement may be terminated by either party with written notice:");
      addSection("", "Upon mutual agreement;");
      addSection("", `If either party breaches the Agreement and fails to cure the breach within ${formData.breachCureDays || '_______'} days of written notice;`);
      addSection("", "Upon insolvency or bankruptcy of either party.");

      // Section 11: Amendment
      addSection("11. Amendment", "No amendment to this Agreement shall be valid unless made in writing and signed by both parties.");

      // Section 12: Severability
      addSection("12. Severability", "If any provision of this Agreement is held invalid, the remaining provisions shall continue in full force and effect.");

      // Section 13: Governing Law
      addSection("13. Governing Law", `This Agreement shall be governed and interpreted under the laws of the State of ${formData.governingState || '_________________________'}.`);

      // Section 14: Notices
      addSection("14. Notices", "All notices shall be delivered in writing to the addresses set forth above via certified mail or courier service.");

      // Section 15: Entire Agreement
      addSection("15. Entire Agreement", "This Agreement constitutes the full and final understanding between the parties and supersedes all prior oral or written agreements relating to the subject matter.");

      // Section 16: Other Rights
      addSection("16. Other Rights", "Nothing in this Agreement shall be construed as limiting or waiving any rights not explicitly granted herein.");

      // Section 17: Acceptance
      addSection("17. Acceptance", "The parties acknowledge and agree to the terms set forth in this Agreement by signing below.");

      // Signature section
      addSection("Grantor:", "");
      addSection("", `By: ${formData.grantorSignature || '____________________________'}`);
      addSection("", `Date: ${formData.grantorSignatureDate || '__________________________'}`);
      
      addSection("Grantee:", "");
      addSection("", `By: ${formData.granteeSignature || '____________________________'}`);
      addSection("", `Date: ${formData.granteeSignatureDate || '__________________________'}`);

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `Royalty_Agreement_${timestamp}.pdf`;
      
      doc.save(filename);
      toast.success("Royalty Agreement generated successfully!");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Royalty Agreement");
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
            <h3 className="text-lg font-semibold">Agreement Details & Parties</h3>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grantorName">Grantor Name</Label>
                <Input
                  id="grantorName"
                  value={formData.grantorName}
                  onChange={(e) => handleInputChange('grantorName', e.target.value)}
                  placeholder="Name of party granting rights"
                />
              </div>
              <div>
                <Label htmlFor="granteeName">Grantee Name</Label>
                <Input
                  id="granteeName"
                  value={formData.granteeName}
                  onChange={(e) => handleInputChange('granteeName', e.target.value)}
                  placeholder="Name of party receiving rights"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grantorAddress">Grantor Address</Label>
                <Input
                  id="grantorAddress"
                  value={formData.grantorAddress}
                  onChange={(e) => handleInputChange('grantorAddress', e.target.value)}
                  placeholder="Complete address of grantor"
                />
              </div>
              <div>
                <Label htmlFor="granteeAddress">Grantee Address</Label>
                <Input
                  id="granteeAddress"
                  value={formData.granteeAddress}
                  onChange={(e) => handleInputChange('granteeAddress', e.target.value)}
                  placeholder="Complete address of grantee"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Property & Territory</h3>
            <div>
              <Label htmlFor="propertyDescription">Property Description</Label>
              <Textarea
                id="propertyDescription"
                value={formData.propertyDescription}
                onChange={(e) => handleInputChange('propertyDescription', e.target.value)}
                placeholder="Detailed description of the intellectual property, including patents, trademarks, copyrights, or other IP being licensed"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="territory">Territory</Label>
              <Input
                id="territory"
                value={formData.territory}
                onChange={(e) => handleInputChange('territory', e.target.value)}
                placeholder="Geographic territory where rights are granted (e.g., United States, North America, Worldwide)"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Royalty & Payment Terms</h3>
            <div>
              <Label htmlFor="royaltyType">Royalty Type</Label>
              <Select
                value={formData.royaltyType}
                onValueChange={(value) => handleInputChange('royaltyType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select royalty type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage of Revenue</SelectItem>
                  <SelectItem value="per_unit">Fixed Amount Per Unit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.royaltyType === 'percentage' ? (
              <div>
                <Label htmlFor="royaltyPercentage">Royalty Percentage (%)</Label>
                <Input
                  id="royaltyPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.royaltyPercentage}
                  onChange={(e) => handleInputChange('royaltyPercentage', e.target.value)}
                  placeholder="Enter percentage (e.g., 5.5 for 5.5%)"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="royaltyAmountPerUnit">Royalty Amount Per Unit ($)</Label>
                <Input
                  id="royaltyAmountPerUnit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.royaltyAmountPerUnit}
                  onChange={(e) => handleInputChange('royaltyAmountPerUnit', e.target.value)}
                  placeholder="Enter amount per unit (e.g., 2.50)"
                />
              </div>
            )}

            <div>
              <Label htmlFor="paymentFrequency">Payment Frequency</Label>
              <Select
                value={formData.paymentFrequency}
                onValueChange={(value) => handleInputChange('paymentFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latePaymentDays">Late Payment Grace Period (Days)</Label>
                <Input
                  id="latePaymentDays"
                  type="number"
                  min="1"
                  value={formData.latePaymentDays}
                  onChange={(e) => handleInputChange('latePaymentDays', e.target.value)}
                  placeholder="Number of days before termination for late payment"
                />
              </div>
              <div>
                <Label htmlFor="breachCureDays">Breach Cure Period (Days)</Label>
                <Input
                  id="breachCureDays"
                  type="number"
                  min="1"
                  value={formData.breachCureDays}
                  onChange={(e) => handleInputChange('breachCureDays', e.target.value)}
                  placeholder="Number of days to cure breach before termination"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal Terms</h3>
            <div>
              <Label htmlFor="governingState">Governing State</Label>
              <Input
                id="governingState"
                value={formData.governingState}
                onChange={(e) => handleInputChange('governingState', e.target.value)}
                placeholder="Enter the state whose laws will govern this agreement"
              />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Note: Signature and date fields will be left blank in the generated document for manual signing.
            </p>
          </div>
        );

      case 6:
        return (
          <UserInfoStep
            onBack={() => setCurrentStep(5)}
            onGenerate={generatePDF}
            documentType="Royalty Agreement"
            isGenerating={isGeneratingPDF}
          />
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
          Governing State: {formData.governingState || 'Not provided'}
        </div>
        <div>
          <strong>Parties:</strong><br />
          Grantor: {formData.grantorName || 'Not provided'} ({formData.grantorAddress || 'Address not provided'})<br />
          Grantee: {formData.granteeName || 'Not provided'} ({formData.granteeAddress || 'Address not provided'})
        </div>
        <div>
          <strong>Property & Territory:</strong><br />
          Property: {formData.propertyDescription || 'Not provided'}<br />
          Territory: {formData.territory || 'Not provided'}
        </div>
        <div>
          <strong>Royalty Terms:</strong><br />
          Type: {formData.royaltyType === 'percentage' ? 'Percentage of Revenue' : 'Fixed Amount Per Unit'}<br />
          Amount: {formData.royaltyType === 'percentage' 
            ? `${formData.royaltyPercentage || 'Not provided'}%` 
            : `$${formData.royaltyAmountPerUnit || 'Not provided'} per unit`}<br />
          Payment Frequency: {formData.paymentFrequency || 'Not provided'}<br />
          Late Payment Grace: {formData.latePaymentDays || 'Not provided'} days<br />
          Breach Cure Period: {formData.breachCureDays || 'Not provided'} days
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Royalty Agreement.
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
        return "Agreement Details & Parties";
      case 3:
        return "Property & Territory";
      case 4:
        return "Royalty & Payment Terms";
      case 5:
        return "Legal Terms";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Select your country and state/province for this agreement";
      case 2:
        return "Enter the effective date and identify the parties involved";
      case 3:
        return "Describe the intellectual property and territory";
      case 4:
        return "Define royalty rates and payment terms";
      case 5:
        return "Specify governing law and legal provisions";
      default:
        return "";
    }
  };

  if (isComplete) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Agreement Complete!</CardTitle>
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
                  grantorName: '',
                  grantorAddress: '',
                  granteeName: '',
                  granteeAddress: '',
                  propertyDescription: '',
                  territory: '',
                  royaltyAmountPerUnit: '',
                  royaltyPercentage: '',
                  royaltyType: 'percentage',
                  paymentFrequency: 'quarterly',
                  latePaymentDays: '30',
                  breachCureDays: '30',
                  governingState: '',
                  grantorSignature: '',
                  grantorSignatureDate: '',
                  granteeSignature: '',
                  granteeSignatureDate: ''
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
              Step {currentStep} of 6
            </div>
          </CardDescription>
          {currentStep === 1 && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/royalty-agreement-info')}
                className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn More About Royalty Agreements
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
                  Next <ArrowRight className="w-4 h-4 ml-2" />
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

export default RoyaltyAgreementForm;
