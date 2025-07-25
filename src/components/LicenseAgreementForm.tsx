import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, FileText, Download, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import { toast } from "sonner";
import CountryStateAPI from 'countries-states-cities';
import UserInfoStep from "./UserInfoStep";

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

interface LicenseAgreementData {
  // Location Information
  state: string;
  country: string;
  
  // Basic Information
  effectiveDate: string;
  licensorName: string;
  licensorAddress: string;
  licenseeName: string;
  licenseeAddress: string;
  
  // License Details
  authoredWork: string;
  geographicArea: string;
  
  // Payment Terms
  royaltyAmount: string;
  royaltyPeriod: string;
  royaltyCalculation: string;
  
  // Terms
  defaultCureDays: string;
  arbitrationLocation: string;
  terminationDate: string;
  terminationNoticeDays: string;
  governingState: string;
  
  // Signatures
  licensorSignature: string;
  licensorSignatureDate: string;
  licenseeSignature: string;
  licenseeSignatureDate: string;
}

const LicenseAgreementForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formData, setFormData] = useState<LicenseAgreementData>({
    state: "",
    country: "",
    effectiveDate: "",
    licensorName: "",
    licensorAddress: "",
    licenseeName: "",
    licenseeAddress: "",
    authoredWork: "",
    geographicArea: "",
    royaltyAmount: "",
    royaltyPeriod: "",
    royaltyCalculation: "",
    defaultCureDays: "",
    arbitrationLocation: "",
    terminationDate: "",
    terminationNoticeDays: "",
    governingState: "",
    licensorSignature: "",
    licensorSignatureDate: "",
    licenseeSignature: "",
    licenseeSignatureDate: ""
  });

  const totalSteps = 5;

  const updateFormData = (field: keyof LicenseAgreementData, value: string) => {
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

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowUserInfo(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let y = 20;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize = 12, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, margin, y);
      y += (lines.length * fontSize * 0.4) + 5;
    };

    // Title
    addText("LICENSE AGREEMENT", 16, true);
    y += 5;

    // Main content
    addText(`This License Agreement ("Agreement") is entered into and made effective as of ${formData.effectiveDate}, by and between`);
    addText(`${formData.licensorName}, of ${formData.licensorAddress}, ("Licensor"),`);
    addText("and");
    addText(`${formData.licenseeName}, of ${formData.licenseeAddress}, ("Licensee").`);
    addText(`For the purposes of this Agreement, the party granting the rights to the licensed property shall be referred to as the "Licensor", and the party receiving such rights shall be referred to as the "Licensee."`);
    y += 5;

    addText("1. Grant of License", 14, true);
    addText(`The Licensor owns the rights to the following work: ${formData.authoredWork} (the "Authored Work"). In accordance with this Agreement, the Licensor hereby grants the Licensee an exclusive license to use, reproduce, and distribute the Authored Work, including any derivatives thereof. This license is limited to the following geographic area: ${formData.geographicArea}.`);
    y += 5;

    addText("2. Payment of Royalty", 14, true);
    addText(`The Licensee agrees to pay the Licensor a royalty of $${formData.royaltyAmount} per ${formData.royaltyPeriod}, calculated as follows: ${formData.royaltyCalculation}.`);
    addText("Each payment shall be accompanied by a written report showing how the royalty was calculated.");
    y += 5;

    addText("3. Modifications", 14, true);
    addText("No changes may be made to the Authored Work unless prior written consent is obtained from the Licensor.");
    y += 5;

    addText("4. Defaults", 14, true);
    addText(`If the Licensee fails to meet the obligations under this Agreement, including royalty payment or usage terms, the Licensor may give written notice. The Licensee shall have ${formData.defaultCureDays} days from receipt of notice to cure the breach. If the breach is not cured, the Licensor may terminate the Agreement immediately and seek any available remedies.`);
    y += 5;

    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    addText("5. Confidential Information", 14, true);
    addText(`"Confidential Information" refers to proprietary, non-public data disclosed by one party to the other during the term of this Agreement. This may include:`);
    addText("Trade secrets");
    addText("Technical data");
    addText("Business strategies");
    addText("Software code");
    addText("Marketing plans");
    addText("Customer lists");
    addText("Research data");
    addText("Each party agrees to maintain the confidentiality of such information and use it solely for purposes of performing under this Agreement.");
    y += 5;

    addText(`a. "Confidential Information" does not include:`);
    addText("Publicly known information not due to breach of this Agreement");
    addText("Information disclosed by a third party lawfully and without confidentiality obligations");
    addText("Information independently developed by the receiving party without reference to the other party's data");
    addText("Any disclosure required by law or court order");
    y += 5;

    addText("6. Protection of Confidential Information", 14, true);
    addText("Both parties agree to take all reasonable precautions to protect Confidential Information from disclosure and not to use or disclose such information without prior written consent of the disclosing party.");
    y += 5;

    addText("a. No Disclosure");
    addText("Neither party shall disclose Confidential Information to third parties without written approval.");
    addText("b. No Copying or Modifying");
    addText("Parties shall not reproduce or alter Confidential Information except as required to fulfill obligations under this Agreement.");
    addText("c. Return of Materials");
    addText("All documents containing Confidential Information shall be returned or destroyed upon termination of this Agreement.");
    y += 5;

    // Check if we need a new page
    if (y > 200) {
      doc.addPage();
      y = 20;
    }

    addText("7. Arbitration", 14, true);
    addText(`Any disputes arising under this Agreement shall be resolved through final and binding arbitration conducted in accordance with the rules of the American Arbitration Association in ${formData.arbitrationLocation}. The arbitrator's decision shall be final and enforceable in any court of competent jurisdiction.`);
    y += 5;

    addText("8. Warranties", 14, true);
    addText("Both parties warrant that they have the right to enter into this Agreement and grant or receive the rights described herein. Neither party makes any other warranties, express or implied, except as expressly stated in this Agreement.");
    y += 5;

    addText("9. No Joint Venture or Partnership", 14, true);
    addText("This Agreement shall not be construed as creating a joint venture, partnership, agency, or employment relationship between the parties.");
    y += 5;

    addText("10. Transfer of Rights", 14, true);
    addText("Neither party may assign or transfer its rights or obligations under this Agreement without prior written consent of the other party.");
    y += 5;

    addText("11. Termination", 14, true);
    addText(`This Agreement shall terminate on ${formData.terminationDate}, unless otherwise terminated by either party with ${formData.terminationNoticeDays} days' written notice.`);
    y += 5;

    addText("12. Entire Agreement", 14, true);
    addText("This document represents the full and complete agreement between the parties. No other prior statements or agreements shall have any effect.");
    y += 5;

    addText("13. Amendments", 14, true);
    addText("This Agreement may only be amended in writing, signed by both parties.");
    y += 5;

    addText("14. Severability", 14, true);
    addText("If any provision of this Agreement is found to be unenforceable, the remaining provisions shall continue in full force and effect.");
    y += 5;

    addText("15. Waiver of Contractual Right", 14, true);
    addText("The failure to enforce any provision of this Agreement shall not be considered a waiver of that provision.");
    y += 5;

    addText("16. Applicable Law", 14, true);
    addText(`This Agreement shall be governed by the laws of the State of ${formData.governingState}.`);
    y += 5;

    addText("17. Acknowledgment", 14, true);
    addText("Both parties acknowledge that they have read, understood, and voluntarily agreed to all terms in this Agreement.");
    y += 10;

    // Check if we need a new page for signatures
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    addText("Licensor:", 12, true);
    addText(`By: ${formData.licensorSignature}`);
    addText(`Date: ${formData.licensorSignatureDate}`);
    y += 5;

    addText("Licensee:", 12, true);
    addText(`By: ${formData.licenseeSignature}`);
    addText(`Date: ${formData.licenseeSignatureDate}`);

    doc.save('license-agreement.pdf');
    toast.success("License Agreement PDF generated successfully!");
    setIsGeneratingPDF(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
              <CardDescription>Enter your location details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country || ''}
                    onValueChange={(value) => updateFormData('country', value)}
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
                    onValueChange={(value) => updateFormData('state', value)}
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
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details for the license agreement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => updateFormData('effectiveDate', e.target.value)}
                  placeholder="Agreement effective date"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="licensorName">Licensor Name</Label>
                  <Input
                    id="licensorName"
                    value={formData.licensorName}
                    onChange={(e) => updateFormData('licensorName', e.target.value)}
                    placeholder="Name of the licensor"
                  />
                </div>
                <div>
                  <Label htmlFor="licenseeName">Licensee Name</Label>
                  <Input
                    id="licenseeName"
                    value={formData.licenseeName}
                    onChange={(e) => updateFormData('licenseeName', e.target.value)}
                    placeholder="Name of the licensee"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="licensorAddress">Licensor Address</Label>
                  <Textarea
                    id="licensorAddress"
                    value={formData.licensorAddress}
                    onChange={(e) => updateFormData('licensorAddress', e.target.value)}
                    placeholder="Complete address of the licensor"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="licenseeAddress">Licensee Address</Label>
                  <Textarea
                    id="licenseeAddress"
                    value={formData.licenseeAddress}
                    onChange={(e) => updateFormData('licenseeAddress', e.target.value)}
                    placeholder="Complete address of the licensee"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>License Details</CardTitle>
              <CardDescription>Specify the work being licensed and terms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="authoredWork">Authored Work Description</Label>
                <Textarea
                  id="authoredWork"
                  value={formData.authoredWork}
                  onChange={(e) => updateFormData('authoredWork', e.target.value)}
                  placeholder="Detailed description of the work being licensed"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="geographicArea">Geographic Area</Label>
                <Input
                  id="geographicArea"
                  value={formData.geographicArea}
                  onChange={(e) => updateFormData('geographicArea', e.target.value)}
                  placeholder="Geographic limitation of the license (e.g., Worldwide, United States, etc.)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="royaltyAmount">Royalty Amount ($)</Label>
                  <Input
                    id="royaltyAmount"
                    value={formData.royaltyAmount}
                    onChange={(e) => updateFormData('royaltyAmount', e.target.value)}
                    placeholder="Dollar amount per period"
                  />
                </div>
                <div>
                  <Label htmlFor="royaltyPeriod">Royalty Period</Label>
                  <Input
                    id="royaltyPeriod"
                    value={formData.royaltyPeriod}
                    onChange={(e) => updateFormData('royaltyPeriod', e.target.value)}
                    placeholder="month, quarter, year, unit sold, etc."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="royaltyCalculation">Royalty Calculation Method</Label>
                <Textarea
                  id="royaltyCalculation"
                  value={formData.royaltyCalculation}
                  onChange={(e) => updateFormData('royaltyCalculation', e.target.value)}
                  placeholder="Detailed explanation of how royalties are calculated"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Agreement Terms</CardTitle>
              <CardDescription>Set the terms and conditions for the agreement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="defaultCureDays">Default Cure Period (days)</Label>
                <Input
                  id="defaultCureDays"
                  value={formData.defaultCureDays}
                  onChange={(e) => updateFormData('defaultCureDays', e.target.value)}
                  placeholder="Number of days to cure a breach"
                />
              </div>

              <div>
                <Label htmlFor="arbitrationLocation">Arbitration Location</Label>
                <Input
                  id="arbitrationLocation"
                  value={formData.arbitrationLocation}
                  onChange={(e) => updateFormData('arbitrationLocation', e.target.value)}
                  placeholder="City and state for arbitration proceedings"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="terminationDate">Termination Date</Label>
                  <Input
                    id="terminationDate"
                    type="date"
                    value={formData.terminationDate}
                    onChange={(e) => updateFormData('terminationDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="terminationNoticeDays">Termination Notice Period (days)</Label>
                  <Input
                    id="terminationNoticeDays"
                    value={formData.terminationNoticeDays}
                    onChange={(e) => updateFormData('terminationNoticeDays', e.target.value)}
                    placeholder="Days of notice required for termination"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="governingState">Governing State</Label>
                <Input
                  id="governingState"
                  value={formData.governingState}
                  onChange={(e) => updateFormData('governingState', e.target.value)}
                  placeholder="State whose laws will govern this agreement"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Signatures</CardTitle>
              <CardDescription>Enter signature information for both parties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="licensorSignature">Licensor Signature</Label>
                  <Input
                    id="licensorSignature"
                    value={formData.licensorSignature}
                    onChange={(e) => updateFormData('licensorSignature', e.target.value)}
                    placeholder="Printed name for licensor signature"
                  />
                </div>
                <div>
                  <Label htmlFor="licensorSignatureDate">Licensor Signature Date</Label>
                  <Input
                    id="licensorSignatureDate"
                    type="date"
                    value={formData.licensorSignatureDate}
                    onChange={(e) => updateFormData('licensorSignatureDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="licenseeSignature">Licensee Signature</Label>
                  <Input
                    id="licenseeSignature"
                    value={formData.licenseeSignature}
                    onChange={(e) => updateFormData('licenseeSignature', e.target.value)}
                    placeholder="Printed name for licensee signature"
                  />
                </div>
                <div>
                  <Label htmlFor="licenseeSignatureDate">Licensee Signature Date</Label>
                  <Input
                    id="licenseeSignatureDate"
                    type="date"
                    value={formData.licenseeSignatureDate}
                    onChange={(e) => updateFormData('licenseeSignatureDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Ready to Generate</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  All required information has been collected. You can now generate your License Agreement PDF.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/license-agreement-info')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Info
          </Button>
          
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">License Agreement</h1>
            <p className="text-lg text-gray-600">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          <div className="mb-8">
            <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
          </div>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === totalSteps ? (
            <Button onClick={generatePDF} className="bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LicenseAgreementForm;
