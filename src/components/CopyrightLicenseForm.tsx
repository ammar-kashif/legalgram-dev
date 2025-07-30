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

interface CopyrightLicenseData {
  country: string;
  state: string;
  effectiveDate: string;
  licensorName: string;
  licensorAddress: string;
  licenseeName: string;
  licenseeAddress: string;
  copyrightedWorkDescription: string;
  licenseTerritory: string;
  royaltyStructure: string;
  defaultNoticeDays: string;
  exclusiveOrNonExclusive: string;
}

const CopyrightLicenseForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<CopyrightLicenseData>({
    country: '',
    state: '',
    effectiveDate: '',
    licensorName: '',
    licensorAddress: '',
    licenseeName: '',
    licenseeAddress: '',
    copyrightedWorkDescription: '',
    licenseTerritory: '',
    royaltyStructure: '',
    defaultNoticeDays: '',
    exclusiveOrNonExclusive: 'exclusive'
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleInputChange = (field: keyof CopyrightLicenseData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update state options when country changes
    if (field === 'country') {
      // Reset state selection when country changes
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
        return !!(formData.country && formData.state && formData.effectiveDate && formData.exclusiveOrNonExclusive);
      case 2:
        return !!(formData.licensorName && formData.licensorAddress && formData.licenseeName && formData.licenseeAddress);
      case 3:
        return !!(formData.copyrightedWorkDescription && formData.licenseTerritory);
      case 4:
        return !!(formData.royaltyStructure && formData.defaultNoticeDays);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canAdvance()) return;

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      setCurrentStep(5); // User info step
    } else if (currentStep === 5) {
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
      // Get proper names for display
      const countryName = formData.country ? getCountryName(formData.country.split(':')[0]) : '';
      const stateName = formData.state ? getStateName(formData.country?.split(':')[0] || '', formData.state.split(':')[0]) : '';
      
      // Title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("COPYRIGHT LICENSE AGREEMENT", 105, 30, { align: "center" });
      
      let yPosition = 50;
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      
      // Introduction
      const introText = `This Copyright License Agreement ("Agreement") is made and entered into as of ${formData.effectiveDate} by and between:`;
      const introLines = doc.splitTextToSize(introText, 170);
      doc.text(introLines, 20, yPosition);
      yPosition += introLines.length * 5 + 10;
      
      // Licensor
      const licensorText = `${formData.licensorName}, residing at ${formData.licensorAddress} (hereinafter referred to as the "Licensor"),`;
      const licensorLines = doc.splitTextToSize(licensorText, 170);
      doc.text(licensorLines, 20, yPosition);
      yPosition += licensorLines.length * 5 + 10;
      
      doc.setFont("helvetica", "bold");
      doc.text("AND", 20, yPosition);
      yPosition += 10;
      
      doc.setFont("helvetica", "normal");
      // Licensee
      const licenseeText = `${formData.licenseeName}, residing at ${formData.licenseeAddress} (hereinafter referred to as the "Licensee").`;
      const licenseeLines = doc.splitTextToSize(licenseeText, 170);
      doc.text(licenseeLines, 20, yPosition);
      yPosition += licenseeLines.length * 5 + 15;
      
      // Whereas clauses
      const whereas1 = "WHEREAS, the Licensor is the sole owner of certain copyrighted material as described herein;";
      const whereas1Lines = doc.splitTextToSize(whereas1, 170);
      doc.text(whereas1Lines, 20, yPosition);
      yPosition += whereas1Lines.length * 5 + 5;
      
      const whereas2 = "AND WHEREAS, the Licensee desires to obtain, and the Licensor agrees to grant, a license to use the copyrighted material under the terms and conditions set forth in this Agreement.";
      const whereas2Lines = doc.splitTextToSize(whereas2, 170);
      doc.text(whereas2Lines, 20, yPosition);
      yPosition += whereas2Lines.length * 5 + 10;
      
      doc.text("The parties agree as follows:", 20, yPosition);
      yPosition += 15;
      
      // Check if we need a new page
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 30;
      }
      
      // Section 1: Grant of License
      doc.setFont("helvetica", "bold");
      doc.text("1. GRANT OF LICENSE", 20, yPosition);
      yPosition += 10;
      
      doc.setFont("helvetica", "normal");
      const grantText = `The Licensor hereby grants to the Licensee an ${formData.exclusiveOrNonExclusive} license to use the copyrighted material described as ${formData.copyrightedWorkDescription} (the "Licensed Property") within the following geographical area: ${formData.licenseTerritory}.`;
      const grantLines = doc.splitTextToSize(grantText, 170);
      doc.text(grantLines, 20, yPosition);
      yPosition += grantLines.length * 5 + 10;
      
      const titleText = "Title, ownership, and all rights not expressly granted herein shall remain with the Licensor. The Licensee acknowledges and agrees that the Licensor shall retain all rights, title, and interest in and to the Licensed Property.";
      const titleLines = doc.splitTextToSize(titleText, 170);
      doc.text(titleLines, 20, yPosition);
      yPosition += titleLines.length * 5 + 15;
      
      // Section 2: Rights and Obligations
      doc.setFont("helvetica", "bold");
      doc.text("2. RIGHTS AND OBLIGATIONS", 20, yPosition);
      yPosition += 10;
      
      doc.setFont("helvetica", "normal");
      const rightsText1 = "The Licensee shall bear sole responsibility for providing all funding, technical expertise, development, and marketing of the products or works incorporating the Licensed Property (collectively, the \"Work\").";
      const rightsLines1 = doc.splitTextToSize(rightsText1, 170);
      doc.text(rightsLines1, 20, yPosition);
      yPosition += rightsLines1.length * 5 + 10;
      
      const rightsText2 = "All rights, title, and interest in and to the Work, other than the Licensed Property itself, shall belong exclusively to the Licensee. However, this shall not be construed as transferring ownership of the Licensed Property, or any rights not specifically granted under this Agreement.";
      const rightsLines2 = doc.splitTextToSize(rightsText2, 170);
      doc.text(rightsLines2, 20, yPosition);
      yPosition += rightsLines2.length * 5 + 15;
      
      // Check if we need a new page
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 30;
      }
      
      // Section 3: Royalty Payments
      doc.setFont("helvetica", "bold");
      doc.text("3. ROYALTY PAYMENTS", 20, yPosition);
      yPosition += 10;
      
      doc.setFont("helvetica", "normal");
      const royaltyText1 = `The Licensee agrees to pay the Licensor royalties calculated as follows: ${formData.royaltyStructure}.`;
      const royaltyLines1 = doc.splitTextToSize(royaltyText1, 170);
      doc.text(royaltyLines1, 20, yPosition);
      yPosition += royaltyLines1.length * 5 + 10;
      
      const royaltyText2 = "Each royalty payment shall be accompanied by a written statement detailing the calculation of the amount due.";
      const royaltyLines2 = doc.splitTextToSize(royaltyText2, 170);
      doc.text(royaltyLines2, 20, yPosition);
      yPosition += royaltyLines2.length * 5 + 15;
      
      // Section 4: Modifications
      doc.setFont("helvetica", "bold");
      doc.text("4. MODIFICATIONS", 20, yPosition);
      yPosition += 10;
      
      doc.setFont("helvetica", "normal");
      const modText = "The Licensee shall not modify, alter, or otherwise change the Licensed Property without the prior written consent of the Licensor. Furthermore, the Licensed Property shall not be used for any unlawful or unauthorized purposes.";
      const modLines = doc.splitTextToSize(modText, 170);
      doc.text(modLines, 20, yPosition);
      yPosition += modLines.length * 5 + 15;
      
      // Section 5: Default
      doc.setFont("helvetica", "bold");
      doc.text("5. DEFAULT", 20, yPosition);
      yPosition += 10;
      
      doc.setFont("helvetica", "normal");
      const defaultText1 = `In the event that the Licensee breaches any provision of this Agreement, including failure to remit royalty payments when due, the Licensor may terminate this Agreement by providing written notice to the Licensee at least ${formData.defaultNoticeDays} days in advance.`;
      const defaultLines1 = doc.splitTextToSize(defaultText1, 170);
      doc.text(defaultLines1, 20, yPosition);
      yPosition += defaultLines1.length * 5 + 10;
      
      const defaultText2 = "The Licensee may prevent termination by curing the breach within the notice period, provided no other breaches have occurred during that time.";
      const defaultLines2 = doc.splitTextToSize(defaultText2, 170);
      doc.text(defaultLines2, 20, yPosition);
      yPosition += defaultLines2.length * 5 + 15;
      
      // Check if we need a new page
      if (yPosition > 180) {
        doc.addPage();
        yPosition = 30;
      }
      
      // Section 6: Arbitration
      doc.setFont("helvetica", "bold");
      doc.text("6. ARBITRATION", 20, yPosition);
      yPosition += 10;
      
      doc.setFont("helvetica", "normal");
      const arbText1 = `Any dispute arising under this Agreement which cannot be resolved amicably shall be submitted to arbitration in accordance with the rules of the ${stateName} Arbitration Association.`;
      const arbLines1 = doc.splitTextToSize(arbText1, 170);
      doc.text(arbLines1, 20, yPosition);
      yPosition += arbLines1.length * 5 + 10;
      
      const arbText2 = "Each party shall bear its own costs, and the costs of arbitration shall be shared equally. The decision of the arbitrator shall be final and binding and may be enforced in any court of competent jurisdiction.";
      const arbLines2 = doc.splitTextToSize(arbText2, 170);
      doc.text(arbLines2, 20, yPosition);
      yPosition += arbLines2.length * 5 + 15;
      
      // Continue with remaining sections...
      // Section 7: Warranties
      doc.setFont("helvetica", "bold");
      doc.text("7. WARRANTIES", 20, yPosition);
      yPosition += 10;
      
      doc.setFont("helvetica", "normal");
      const warText = "No warranties, express or implied, are made by either party with respect to the Licensed Property or its use, including warranties of merchantability or fitness for a particular purpose. The Licensed Property is provided \"AS IS,\" and the Licensor shall not be liable for any direct, indirect, special, incidental, or consequential damages arising from its use.";
      const warLines = doc.splitTextToSize(warText, 170);
      doc.text(warLines, 20, yPosition);
      yPosition += warLines.length * 5 + 15;
      
      // Check if we need a new page
      if (yPosition > 160) {
        doc.addPage();
        yPosition = 30;
      }
      
      // Section 16: Governing Law
      doc.setFont("helvetica", "bold");
      doc.text("16. GOVERNING LAW", 20, yPosition);
      yPosition += 10;
      
      doc.setFont("helvetica", "normal");
      const govText = `This Agreement shall be governed by and construed in accordance with the laws of the State of ${stateName}, without regard to its conflict of laws principles.`;
      const govLines = doc.splitTextToSize(govText, 170);
      doc.text(govLines, 20, yPosition);
      yPosition += govLines.length * 5 + 20;
      
      // Signatures section
      doc.setFont("helvetica", "bold");
      doc.text("17. SIGNATURES", 20, yPosition);
      yPosition += 10;
      
      doc.setFont("helvetica", "normal");
      const witnessText = "IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date set forth above.";
      const witnessLines = doc.splitTextToSize(witnessText, 170);
      doc.text(witnessLines, 20, yPosition);
      yPosition += witnessLines.length * 5 + 20;
      
      // Check if we need a new page for signatures
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 30;
      }
      
      // Licensor signature
      doc.setFont("helvetica", "bold");
      doc.text("Licensor:", 20, yPosition);
      yPosition += 15;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${formData.licensorName}`, 20, yPosition);
      yPosition += 10;
      doc.text("Signature: _________________________________", 20, yPosition);
      yPosition += 10;
      doc.text("Date: _____________________________________", 20, yPosition);
      yPosition += 20;
      
      // Licensee signature
      doc.setFont("helvetica", "bold");
      doc.text("Licensee:", 20, yPosition);
      yPosition += 15;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${formData.licenseeName}`, 20, yPosition);
      yPosition += 10;
      doc.text("Signature: _________________________________", 20, yPosition);
      yPosition += 10;
      doc.text("Date: _____________________________________", 20, yPosition);
      yPosition += 20;
      
      // Make It Legal section
      doc.setFont("helvetica", "bold");
      doc.text("Make It Legal", 20, yPosition);
      yPosition += 15;
      
      doc.setFont("helvetica", "normal");
      const legalText = "This Agreement should be signed in front of a notary public. Once signed in front of a notary, this document should be delivered to the appropriate court for filing.";
      const legalLines = doc.splitTextToSize(legalText, 170);
      doc.text(legalLines, 20, yPosition);
      
      doc.save('copyright-license-agreement.pdf');
      toast.success("Document generated successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate document");
    } finally {
      setIsGeneratingPDF(false);
    }
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
              <Label htmlFor="exclusiveOrNonExclusive">License Type</Label>
              <Select
                value={formData.exclusiveOrNonExclusive}
                onValueChange={(value) => handleInputChange('exclusiveOrNonExclusive', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select license type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exclusive">Exclusive License</SelectItem>
                  <SelectItem value="non-exclusive">Non-Exclusive License</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="licensorName">Licensor Name (Copyright Owner)</Label>
              <Input
                id="licensorName"
                value={formData.licensorName}
                onChange={(e) => handleInputChange('licensorName', e.target.value)}
                placeholder="Enter full name of copyright owner"
              />
            </div>
            <div>
              <Label htmlFor="licensorAddress">Licensor Address</Label>
              <Textarea
                id="licensorAddress"
                value={formData.licensorAddress}
                onChange={(e) => handleInputChange('licensorAddress', e.target.value)}
                placeholder="Enter complete address of licensor"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="licenseeName">Licensee Name (Person Receiving License)</Label>
              <Input
                id="licenseeName"
                value={formData.licenseeName}
                onChange={(e) => handleInputChange('licenseeName', e.target.value)}
                placeholder="Enter full name of licensee"
              />
            </div>
            <div>
              <Label htmlFor="licenseeAddress">Licensee Address</Label>
              <Textarea
                id="licenseeAddress"
                value={formData.licenseeAddress}
                onChange={(e) => handleInputChange('licenseeAddress', e.target.value)}
                placeholder="Enter complete address of licensee"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="copyrightedWorkDescription">Description of Copyrighted Work</Label>
              <Textarea
                id="copyrightedWorkDescription"
                value={formData.copyrightedWorkDescription}
                onChange={(e) => handleInputChange('copyrightedWorkDescription', e.target.value)}
                placeholder="Provide detailed description of the copyrighted material being licensed"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="licenseTerritory">License Territory</Label>
              <Textarea
                id="licenseTerritory"
                value={formData.licenseTerritory}
                onChange={(e) => handleInputChange('licenseTerritory', e.target.value)}
                placeholder="Specify the geographical area where the license applies (e.g., United States, North America, Worldwide)"
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="royaltyStructure">Royalty Structure</Label>
              <Textarea
                id="royaltyStructure"
                value={formData.royaltyStructure}
                onChange={(e) => handleInputChange('royaltyStructure', e.target.value)}
                placeholder="Describe how royalties will be calculated (e.g., percentage of net sales, fixed amount per unit, etc.)"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="defaultNoticeDays">Default Notice Days</Label>
              <Input
                id="defaultNoticeDays"
                type="number"
                value={formData.defaultNoticeDays}
                onChange={(e) => handleInputChange('defaultNoticeDays', e.target.value)}
                placeholder="Enter number of days for default notice (e.g., 30)"
              />
            </div>
          </div>
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
          <strong>Agreement Details:</strong><br />
          Effective Date: {formData.effectiveDate}<br />
          License Type: {formData.exclusiveOrNonExclusive}<br />
          Governing Law: {stateName}, {countryName}
        </div>
        <div>
          <strong>Licensor (Copyright Owner):</strong><br />
          Name: {formData.licensorName}<br />
          Address: {formData.licensorAddress}
        </div>
        <div>
          <strong>Licensee (License Recipient):</strong><br />
          Name: {formData.licenseeName}<br />
          Address: {formData.licenseeAddress}
        </div>
        <div>
          <strong>Licensed Work:</strong><br />
          Description: {formData.copyrightedWorkDescription}<br />
          Territory: {formData.licenseTerritory}
        </div>
        <div>
          <strong>Terms:</strong><br />
          Royalty Structure: {formData.royaltyStructure}<br />
          Default Notice Period: {formData.defaultNoticeDays} days
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Copyright License Agreement.
          </p>
        </div>
      </div>
    );
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Agreement Basics";
      case 2:
        return "Parties Information";
      case 3:
        return "Licensed Work Details";
      case 4:
        return "Terms & Conditions";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Select location, effective date, and license type";
      case 2:
        return "Enter licensor and licensee information";
      case 3:
        return "Describe the copyrighted work and license territory";
      case 4:
        return "Define royalty structure and default terms";
      default:
        return "";
    }
  };

  if (isComplete) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-600">Copyright License Agreement</CardTitle>
            <CardDescription>
              Review your Copyright License Agreement details below before generating the final document.
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
                  licensorName: '',
                  licensorAddress: '',
                  licenseeName: '',
                  licenseeAddress: '',
                  copyrightedWorkDescription: '',
                  licenseTerritory: '',
                  royaltyStructure: '',
                  defaultNoticeDays: '',
                  exclusiveOrNonExclusive: 'exclusive'
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

  if (currentStep === 5) {
    return (
      <UserInfoStep
        onBack={() => setCurrentStep(4)}
        onGenerate={generatePDF}
        documentType="Copyright License Agreement"
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
              Step {currentStep} of 4
            </div>
          </CardDescription>
          {currentStep === 1 && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/copyright-license-info')}
                className="text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn More About Copyright Licenses
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

export default CopyrightLicenseForm;
