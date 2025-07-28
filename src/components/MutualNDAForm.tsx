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

interface MutualNDAData {
  country: string;
  state: string;
  effectiveDate: string;
  party1Name: string;
  party1Address: string;
  party2Name: string;
  party2Address: string;
  purposeOfDisclosure: string;
  governingState: string;
  jurisdictionLocation: string;
  party1SignatoryName: string;
  party1SignatoryTitle: string;
  party2SignatoryName: string;
  party2SignatoryTitle: string;
}

const MutualNDAForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<MutualNDAData>({
    country: '',
    state: '',
    effectiveDate: '',
    party1Name: '',
    party1Address: '',
    party2Name: '',
    party2Address: '',
    purposeOfDisclosure: '',
    governingState: '',
    jurisdictionLocation: '',
    party1SignatoryName: '',
    party1SignatoryTitle: '',
    party2SignatoryName: '',
    party2SignatoryTitle: ''
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const totalSteps = 6;

  const handleInputChange = (field: keyof MutualNDAData, value: string) => {
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
        return !!(formData.country && formData.state && formData.effectiveDate);
      case 2:
        return !!(formData.party1Name && formData.party1Address && formData.party2Name && formData.party2Address);
      case 3:
        return !!(formData.purposeOfDisclosure && formData.governingState && formData.jurisdictionLocation);
      case 4:
        return !!(formData.party1SignatoryName && formData.party1SignatoryTitle && formData.party2SignatoryName && formData.party2SignatoryTitle);
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
      doc.text("Mutual Non-Disclosure Agreement (Mutual NDA)", 105, 20, { align: "center" });
      
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
        y += lineHeight + 5;
      };

      // Get formatted date
      const effectiveDate = formData.effectiveDate ? format(new Date(formData.effectiveDate), 'MMMM d, yyyy') : '____________';
      
      // Introduction
      addSection("", `This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of ${effectiveDate}, by and between`);
      
      addSection("", `${formData.party1Name || '______________________'}, located at ${formData.party1Address || '_________________________'},`);
      
      addSection("", "And");
      
      addSection("", `${formData.party2Name || '__________________'}, located at ${formData.party2Address || '_______________'},`);
      
      addSection("", `for the mutual exchange of confidential and proprietary information. This Agreement shall be effective as of ${effectiveDate}.`);

      // Recital
      addSection("Recital", `The party receiving the confidential information ("Receiving Party") understands that the party disclosing such information ("Disclosing Party") has disclosed or may disclose, either orally, in writing, or by other means, certain information relating to the Disclosing Party's business. This includes, without limitation, internal data, financial and operational plans, marketing strategies, employee information, customer lists, pricing data, product information, prototypes, trade secrets, inventions, drawings, designs, processes, technical data, research, and business opportunities (collectively, the "Proprietary Information").`);
      
      addSection("", "The Proprietary Information shall be protected as follows:");
      addSection("", "It is marked as confidential or proprietary at the time of disclosure;");
      addSection("", "It is disclosed in a manner that clearly communicates its confidential nature; or");
      addSection("", "It is, by its content or context, understood by a reasonable person to be confidential under the circumstances.");

      // Section 1: Confidentiality Obligations
      addSection("1. Confidentiality Obligations", "The Receiving Party agrees to:");
      addSection("", "Maintain all Proprietary Information in strict confidence;");
      addSection("", "Use the same degree of care to protect such information as it uses for its own confidential materials (but in no event less than reasonable care);");
      addSection("", "Not disclose such information to any third party without prior written permission of the Disclosing Party;");
      addSection("", "Use the Proprietary Information only for the purpose of evaluating or pursuing a potential business relationship;");
      addSection("", "Not reverse-engineer, decompile, or derive any benefit from the Proprietary Information beyond what is expressly permitted.");

      // Section 2: Purpose of Disclosure
      addSection("2. Purpose of Disclosure", `The Receiving Party agrees that the Proprietary Information shall be used solely for the following purpose:`);
      addSection("", formData.purposeOfDisclosure || '_____________________________________________________');

      // Section 3: Disclosure to Employees and Agents
      addSection("3. Disclosure to Employees and Agents", "The Receiving Party may disclose Proprietary Information only to its employees, contractors, or agents who:");
      addSection("", "Need to know the information for the stated purpose;");
      addSection("", "Are bound by written confidentiality obligations no less restrictive than those contained in this Agreement.");
      addSection("", "The Receiving Party shall be responsible for any breach of this Agreement by its employees or agents.");

      // Section 4: Exclusions from Confidential Information
      addSection("4. Exclusions from Confidential Information", "This Agreement does not apply to information that:");
      addSection("", "Was in the possession of the Receiving Party before disclosure;");
      addSection("", "Becomes publicly known through no fault of the Receiving Party;");
      addSection("", "Is disclosed to the Receiving Party by a third party legally entitled to disclose such information;");
      addSection("", "Is independently developed by the Receiving Party without reference to the Proprietary Information.");

      // Section 5: Return or Destruction of Materials
      addSection("5. Return or Destruction of Materials", "Upon written request by the Disclosing Party at any time, the Receiving Party agrees to promptly return or destroy all physical and digital materials containing Proprietary Information and to certify, in writing, that such information has been fully and permanently deleted or destroyed.");

      // Section 6: No Adequate Remedy at Law
      addSection("6. No Adequate Remedy at Law", "The Receiving Party acknowledges that monetary damages may not be a sufficient remedy for breach of this Agreement. Therefore, the Disclosing Party shall be entitled to injunctive relief or other equitable remedies, without the necessity of posting bond, to prevent actual or threatened breach.");
      addSection("", "In such cases, the breaching party shall also be liable for all damages, including legal fees and costs, arising from such breach.");

      // Section 7: Limited Use License
      addSection("7. Limited Use License", "Nothing in this Agreement shall be construed as granting any rights, by license or otherwise, in or to any intellectual property or Proprietary Information of the Disclosing Party, except the limited right to use such information for the purposes stated herein.");

      // Section 8: No Warranties
      addSection("8. No Warranties", "ALL INFORMATION IS PROVIDED \"AS IS.\" THE DISCLOSING PARTY MAKES NO WARRANTIES, EXPRESS OR IMPLIED, REGARDING THE COMPLETENESS, ACCURACY, MERCHANTABILITY, OR FITNESS FOR A PARTICULAR PURPOSE OF ANY PROPRIETARY INFORMATION DISCLOSED UNDER THIS AGREEMENT. NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM THIS AGREEMENT.");

      // Section 9: Governing Law and Jurisdiction
      addSection("9. Governing Law and Jurisdiction", `This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingState || '____________'}, without regard to conflict of law principles. Any legal proceedings arising from this Agreement shall be resolved exclusively in the courts located in ${formData.jurisdictionLocation || '__________________________'}.`);

      // Section 10: Execution
      addSection("10. Execution", "This Agreement shall be signed and effective by:");
      addSection("", `${formData.party1SignatoryName || '________________________'}, on behalf of ${formData.party1Name || '________________________'}`);
      addSection("", "and");
      addSection("", `${formData.party2SignatoryName || '________________________'}, on behalf of ${formData.party2Name || '________________________'}`);

      // Signature section
      if (y > pageHeight - 150) {
        doc.addPage();
        y = 20;
      }

      y += 15;

      // Party 1 signature
      doc.text("Signature: _________________________", 15, y);
      y += lineHeight + 5;
      doc.text(`Name: ${formData.party1SignatoryName || '____________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text(`Title: ${formData.party1SignatoryTitle || '_____________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text("Date: _____________________________", 15, y);
      y += lineHeight + 15;

      // Party 2 signature
      doc.text("Signature: _________________________", 15, y);
      y += lineHeight + 5;
      doc.text(`Name: ${formData.party2SignatoryName || '____________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text(`Title: ${formData.party2SignatoryTitle || '_____________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text("Date: _____________________________", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `mutual_nda_${timestamp}.pdf`;
      
      doc.save(filename);
      toast.success("Mutual NDA generated successfully!");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Mutual NDA");
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Party Information</h3>
            <div className="space-y-4">
              <h4 className="font-medium">First Party</h4>
              <div>
                <Label htmlFor="party1Name">Party 1 Name</Label>
                <Input
                  id="party1Name"
                  value={formData.party1Name}
                  onChange={(e) => handleInputChange('party1Name', e.target.value)}
                  placeholder="Enter name of first party"
                />
              </div>
              <div>
                <Label htmlFor="party1Address">Party 1 Address</Label>
                <Textarea
                  id="party1Address"
                  value={formData.party1Address}
                  onChange={(e) => handleInputChange('party1Address', e.target.value)}
                  placeholder="Enter complete address of first party"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Second Party</h4>
              <div>
                <Label htmlFor="party2Name">Party 2 Name</Label>
                <Input
                  id="party2Name"
                  value={formData.party2Name}
                  onChange={(e) => handleInputChange('party2Name', e.target.value)}
                  placeholder="Enter name of second party"
                />
              </div>
              <div>
                <Label htmlFor="party2Address">Party 2 Address</Label>
                <Textarea
                  id="party2Address"
                  value={formData.party2Address}
                  onChange={(e) => handleInputChange('party2Address', e.target.value)}
                  placeholder="Enter complete address of second party"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="purposeOfDisclosure">Purpose of Disclosure</Label>
              <Textarea
                id="purposeOfDisclosure"
                value={formData.purposeOfDisclosure}
                onChange={(e) => handleInputChange('purposeOfDisclosure', e.target.value)}
                placeholder="Describe the purpose for which the proprietary information will be used"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="governingState">Governing State</Label>
              <Input
                id="governingState"
                value={formData.governingState}
                onChange={(e) => handleInputChange('governingState', e.target.value)}
                placeholder="Enter the state whose laws will govern this agreement"
              />
            </div>
            <div>
              <Label htmlFor="jurisdictionLocation">Jurisdiction Location</Label>
              <Input
                id="jurisdictionLocation"
                value={formData.jurisdictionLocation}
                onChange={(e) => handleInputChange('jurisdictionLocation', e.target.value)}
                placeholder="Enter the location where legal proceedings will be resolved"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Signatory Information</h3>
            <div className="space-y-4">
              <h4 className="font-medium">Party 1 Signatory</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="party1SignatoryName">Name</Label>
                  <Input
                    id="party1SignatoryName"
                    value={formData.party1SignatoryName}
                    onChange={(e) => handleInputChange('party1SignatoryName', e.target.value)}
                    placeholder="Enter signatory name"
                  />
                </div>
                <div>
                  <Label htmlFor="party1SignatoryTitle">Title</Label>
                  <Input
                    id="party1SignatoryTitle"
                    value={formData.party1SignatoryTitle}
                    onChange={(e) => handleInputChange('party1SignatoryTitle', e.target.value)}
                    placeholder="Enter signatory title"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Party 2 Signatory</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="party2SignatoryName">Name</Label>
                  <Input
                    id="party2SignatoryName"
                    value={formData.party2SignatoryName}
                    onChange={(e) => handleInputChange('party2SignatoryName', e.target.value)}
                    placeholder="Enter signatory name"
                  />
                </div>
                <div>
                  <Label htmlFor="party2SignatoryTitle">Title</Label>
                  <Input
                    id="party2SignatoryTitle"
                    value={formData.party2SignatoryTitle}
                    onChange={(e) => handleInputChange('party2SignatoryTitle', e.target.value)}
                    placeholder="Enter signatory title"
                  />
                </div>
              </div>
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
          <strong>Location:</strong><br />
          Country: {countryName}<br />
          State: {stateName}
        </div>
        <div>
          <strong>Agreement Details:</strong><br />
          Effective Date: {formData.effectiveDate ? format(new Date(formData.effectiveDate), 'PPP') : 'Not provided'}
        </div>
        <div>
          <strong>First Party:</strong><br />
          Name: {formData.party1Name}<br />
          Address: {formData.party1Address}<br />
          Signatory: {formData.party1SignatoryName} ({formData.party1SignatoryTitle})
        </div>
        <div>
          <strong>Second Party:</strong><br />
          Name: {formData.party2Name}<br />
          Address: {formData.party2Address}<br />
          Signatory: {formData.party2SignatoryName} ({formData.party2SignatoryTitle})
        </div>
        <div>
          <strong>Legal Terms:</strong><br />
          Purpose: {formData.purposeOfDisclosure}<br />
          Governing State: {formData.governingState}<br />
          Jurisdiction: {formData.jurisdictionLocation}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Mutual Non-Disclosure Agreement.
          </p>
        </div>
      </div>
    );
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Agreement Location & Date";
      case 2:
        return "Party Information";
      case 3:
        return "Legal Terms";
      case 4:
        return "Signatories";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Select your location and set the effective date";
      case 2:
        return "Enter information for both parties to the agreement";
      case 3:
        return "Define the purpose and legal terms";
      case 4:
        return "Enter signatory information for both parties";
      default:
        return "";
    }
  };

  if (isComplete) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-600">Mutual Non-Disclosure Agreement</CardTitle>
            <CardDescription>
              Review your Mutual NDA details below before generating the final document.
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
                  party1Name: '',
                  party1Address: '',
                  party2Name: '',
                  party2Address: '',
                  purposeOfDisclosure: '',
                  governingState: '',
                  jurisdictionLocation: '',
                  party1SignatoryName: '',
                  party1SignatoryTitle: '',
                  party2SignatoryName: '',
                  party2SignatoryTitle: ''
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
        documentType="Mutual Non-Disclosure Agreement"
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
                onClick={() => navigate('/mutual-nda-info')}
                className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn More About Mutual NDAs
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

export default MutualNDAForm;
