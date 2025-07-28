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

interface ConfidentialInformationData {
  state: string;
  country: string;
  purpose: string;
  governingState: string;
  disclosingPartyName: string;
  receivingPartyName: string;
  disclosingPartySignatory: string;
  receivingPartySignatory: string;
  effectiveDate: string;
}

const ConfidentialInformationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<ConfidentialInformationData>({
    state: '',
    country: '',
    purpose: '',
    governingState: '',
    disclosingPartyName: '',
    receivingPartyName: '',
    disclosingPartySignatory: '',
    receivingPartySignatory: '',
    effectiveDate: ''
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleInputChange = (field: keyof ConfidentialInformationData, value: string) => {
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
        return !!(formData.effectiveDate && formData.purpose);
      case 3:
        return !!(formData.disclosingPartyName && formData.receivingPartyName);
      case 4:
        return !!(formData.governingState && formData.disclosingPartySignatory && formData.receivingPartySignatory);
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
      
      // Set up the document
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Confidential Information Agreement", 105, 20, { align: "center" });
      
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
      addSection("", `This Confidential Information Agreement ("Agreement") is entered into as of ${effectiveDate}, between ${formData.disclosingPartyName || '______________________________'} ("Disclosing Party") and ${formData.receivingPartyName || '______________________________'} ("Receiving Party") for the purpose of ${formData.purpose || '_______________________________________________'}.`);

      // Section 1: Confidential Information
      addSection("1. Confidential Information", `For the purposes of this Agreement, "Confidential Information" includes all non-public, proprietary, or confidential information disclosed by the Disclosing Party, whether written, oral, electronic, or in any other form.`);
      
      addSection("", "Confidential Information includes, but is not limited to:");
      addSection("", "Business strategies and plans");
      addSection("", "Financial data and projections");
      addSection("", "Customer and supplier lists");
      addSection("", "Technical information, software, formulas, and inventions");
      addSection("", "Any other information marked or designated as confidential");

      // Section 2: Exclusions from Confidential Information
      addSection("2. Exclusions from Confidential Information", "Confidential Information does not include information that:");
      addSection("", "Is or becomes publicly available without breach of this Agreement");
      addSection("", "Was lawfully known to the Receiving Party prior to disclosure");
      addSection("", "Is disclosed to the Receiving Party by a third party legally entitled to do so");
      addSection("", "Is independently developed by the Receiving Party without reference to the Confidential Information");

      // Section 3: Obligation of Confidentiality
      addSection("3. Obligation of Confidentiality", "The Receiving Party agrees to:");
      addSection("", "Maintain the confidentiality of the Confidential Information using at least the same degree of care it uses to protect its own confidential information");
      addSection("", "Not disclose the Confidential Information to any third party without the prior written consent of the Disclosing Party");
      addSection("", "Use the Confidential Information solely for the Purpose stated in this Agreement");

      // Section 4: Return or Destruction of Materials
      addSection("4. Return or Destruction of Materials", "Upon written request by the Disclosing Party, the Receiving Party shall return or destroy all copies of Confidential Information in its possession or control, including any materials prepared based on the Confidential Information.");

      // Section 5: No License or Ownership
      addSection("5. No License or Ownership", "Nothing in this Agreement grants the Receiving Party any license or ownership interest in the Confidential Information.");

      // Section 6: No Obligation to Disclose
      addSection("6. No Obligation to Disclose", "Neither party is obligated under this Agreement to disclose any particular information. The Agreement does not obligate either party to enter into any other agreement, joint venture, or business transaction.");

      // Section 7: No Warranty
      addSection("7. No Warranty", `The Disclosing Party makes no representations or warranties regarding the accuracy or completeness of the Confidential Information. All information is provided "as is."`);

      // Section 8: Limited License to Use
      addSection("8. Limited License to Use", "The Receiving Party may use the Confidential Information solely for the purpose of evaluating the proposed business relationship.");

      // Section 9: Governing Law
      addSection("9. Governing Law", `This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingState || '___________________________'}.`);

      // Section 10: Entire Agreement
      addSection("10. Entire Agreement", "This Agreement constitutes the entire understanding between the parties concerning the subject matter hereof and supersedes all prior agreements or understandings, whether written or oral.");

      // Section 11: Written Waiver
      addSection("11. Written Waiver", "No waiver of any provision of this Agreement shall be valid unless in writing and signed by both parties.");

      // Signature section
      if (y > pageHeight - 120) {
        doc.addPage();
        y = 20;
      }

      y += 15;
      addSection("", "IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.");

      y += 10;

      // Disclosing Party signature
      doc.text(`Disclosing Party: ${formData.disclosingPartyName || '______________________________'}`, 15, y);
      y += lineHeight + 10;
      doc.text("Signature: ______________________________", 15, y);
      y += lineHeight + 5;
      doc.text(`Name: ${formData.disclosingPartySignatory || '____________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text("Date: _______________", 15, y);
      y += lineHeight + 15;

      // Receiving Party signature
      doc.text(`Receiving Party: ${formData.receivingPartyName || '______________________________'}`, 15, y);
      y += lineHeight + 10;
      doc.text("Signature: ______________________________", 15, y);
      y += lineHeight + 5;
      doc.text(`Name: ${formData.receivingPartySignatory || '____________________________'}`, 15, y);
      y += lineHeight + 5;
      doc.text("Date: _______________", 15, y);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `confidential_information_agreement_${timestamp}.pdf`;
      
      doc.save(filename);
      toast.success("Confidential Information Agreement generated successfully!");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Confidential Information Agreement");
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
            <h3 className="text-lg font-semibold">Agreement Details</h3>
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
              <Label htmlFor="purpose">Purpose of Information Disclosure</Label>
              <Textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                placeholder="Describe the purpose for which confidential information will be shared (e.g., evaluating potential business partnership, exploring investment opportunity, etc.)"
                rows={4}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Party Information</h3>
            <div>
              <Label htmlFor="disclosingPartyName">Disclosing Party Name</Label>
              <Input
                id="disclosingPartyName"
                value={formData.disclosingPartyName}
                onChange={(e) => handleInputChange('disclosingPartyName', e.target.value)}
                placeholder="Enter name of party that will disclose confidential information"
              />
            </div>
            <div>
              <Label htmlFor="receivingPartyName">Receiving Party Name</Label>
              <Input
                id="receivingPartyName"
                value={formData.receivingPartyName}
                onChange={(e) => handleInputChange('receivingPartyName', e.target.value)}
                placeholder="Enter name of party that will receive confidential information"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal Terms & Signatories</h3>
            <div>
              <Label htmlFor="governingState">Governing State</Label>
              <Input
                id="governingState"
                value={formData.governingState}
                onChange={(e) => handleInputChange('governingState', e.target.value)}
                placeholder="Enter the state whose laws will govern this agreement"
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
                <Label htmlFor="receivingPartySignatory">Receiving Party Signatory</Label>
                <Input
                  id="receivingPartySignatory"
                  value={formData.receivingPartySignatory}
                  onChange={(e) => handleInputChange('receivingPartySignatory', e.target.value)}
                  placeholder="Name of person signing for receiving party"
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
          Purpose: {formData.purpose}
        </div>
        <div>
          <strong>Disclosing Party:</strong><br />
          Organization: {formData.disclosingPartyName}<br />
          Signatory: {formData.disclosingPartySignatory}
        </div>
        <div>
          <strong>Receiving Party:</strong><br />
          Organization: {formData.receivingPartyName}<br />
          Signatory: {formData.receivingPartySignatory}
        </div>
        <div>
          <strong>Legal Terms:</strong><br />
          Governing State: {formData.governingState}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Confidential Information Agreement.
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
        return "Agreement Purpose & Date";
      case 3:
        return "Party Information";
      case 4:
        return "Legal Terms & Signatories";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Select your country and state/province for this agreement";
      case 2:
        return "Set the effective date and define the purpose of information sharing";
      case 3:
        return "Enter details for both the disclosing and receiving parties";
      case 4:
        return "Specify governing law and signatory information";
      default:
        return "";
    }
  };

  if (isComplete) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-600">Confidential Information Agreement</CardTitle>
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
                  purpose: '',
                  governingState: '',
                  disclosingPartyName: '',
                  receivingPartyName: '',
                  disclosingPartySignatory: '',
                  receivingPartySignatory: '',
                  effectiveDate: ''
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
        documentType="Confidential Information Agreement"
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
                onClick={() => navigate('/confidential-information-info')}
                className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn More About Confidential Information Agreements
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

export default ConfidentialInformationForm;
