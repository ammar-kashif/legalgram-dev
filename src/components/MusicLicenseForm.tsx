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

interface MusicLicenseData {
  // Location Information
  state: string;
  country: string;
  
  // Basic Information
  effectiveDate: string;
  copyrightOwnerName: string;
  copyrightOwnerAddress: string;
  licenseeName: string;
  licenseeAddress: string;
  
  // Music Details
  musicTitle: string;
  licenseePurpose: string;
  licensePurposes: string;
  geographicArea: string;
  
  // Payment Terms
  royaltyCalculation: string;
  
  // Terms
  breachCureDays: string;
  arbitrationLocation: string;
  governingState: string;
  
  // Signatures
  copyrightOwnerSignatory: string;
  licenseeSignatory: string;
  copyrightOwnerSignatureDate: string;
  licenseeSignatureDate: string;
}

const MusicLicenseForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MusicLicenseData>({
    state: "",
    country: "",
    effectiveDate: "",
    copyrightOwnerName: "",
    copyrightOwnerAddress: "",
    licenseeName: "",
    licenseeAddress: "",
    musicTitle: "",
    licenseePurpose: "",
    licensePurposes: "",
    geographicArea: "",
    royaltyCalculation: "",
    breachCureDays: "",
    arbitrationLocation: "",
    governingState: "",
    copyrightOwnerSignatory: "",
    licenseeSignatory: "",
    copyrightOwnerSignatureDate: "",
    licenseeSignatureDate: ""
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const totalSteps = 6;

  const updateFormData = (field: keyof MusicLicenseData, value: string) => {
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
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5) {
      setCurrentStep(6); // User info step
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    try {
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
      addText("MUSIC LICENSE AGREEMENT", 16, true);
      y += 5;

      // Main content
      addText(`This Music License Agreement (the "Agreement") is entered into as of ${formData.effectiveDate}, by and between ${formData.copyrightOwnerName}, of ${formData.copyrightOwnerAddress} ("Copyright Owner"), and ${formData.licenseeName}, of ${formData.licenseeAddress} ("Licensee").`);
      addText(`In this Agreement, the party granting the rights to use the licensed property shall be referred to as the "Copyright Owner," and the party receiving the rights shall be referred to as the "Licensee."`);
      addText(`WHEREAS, the Copyright Owner holds the copyrights, publishing rights, and related interests in and to a specific piece of music (the "Music");`);
      addText(`WHEREAS, the Licensee seeks authorization to utilize the Music in connection with ${formData.licenseePurpose};`);
      addText("NOW, THEREFORE, in consideration of the mutual promises, covenants, and conditions contained herein, the parties agree as follows:");
      y += 5;

      addText("1. GRANT OF LICENSE", 14, true);
      addText(`${formData.copyrightOwnerName} owns ${formData.musicTitle} (the "Music"). Pursuant to this Agreement, the Copyright Owner grants to the Licensee, in accordance with the terms and conditions herein, a non-exclusive right, license, and privilege to use the Music for the following purposes: ${formData.licensePurposes}. This license is valid solely within the geographical area of ${formData.geographicArea}.`);
      y += 5;

      addText("2. PAYMENT OF ROYALTY", 14, true);
      addText(`${formData.licenseeName} shall pay to ${formData.copyrightOwnerName} a royalty calculated as follows: ${formData.royaltyCalculation}. Each royalty payment shall be accompanied by a written report outlining the method used to calculate the royalty due.`);
      y += 5;

      addText("3. RIGHTS AND OBLIGATIONS", 14, true);
      addText("Licensee agrees to utilize the Music in a professional and lawful manner and to credit the Copyright Owner as agreed. Licensee shall also be responsible for all financial and technical arrangements related to the recording, use, or synchronization of the Music, unless otherwise stated.");
      y += 5;

      addText("4. MODIFICATIONS", 14, true);
      addText(`Unless written approval is obtained from ${formData.copyrightOwnerName}, Licensee shall not alter, modify, or change the Music in any manner.`);
      y += 5;

      addText("5. DEFAULTS", 14, true);
      addText(`If ${formData.licenseeName} fails to comply with the obligations under this Agreement, including payment of royalties, ${formData.copyrightOwnerName} shall have the right to terminate this Agreement by delivering written notice. The non-defaulting party may exercise its option to cure the breach within ${formData.breachCureDays} days from such notice. If the breach is not remedied, this Agreement shall be terminated immediately.`);
      y += 5;

      // Check if we need a new page
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      addText("6. ARBITRATION", 14, true);
      addText(`Any disputes arising out of this Agreement shall be submitted to binding arbitration under the rules of the American Arbitration Association. Arbitration shall occur in ${formData.arbitrationLocation}, unless another location is mutually agreed. Each party shall bear its own costs, and the decision of the arbitrator shall be final and binding.`);
      y += 5;

      addText("7. WARRANTIES", 14, true);
      addText(`Each party represents and warrants that it has the authority to enter into this Agreement and that execution will not conflict with or violate the rights of any third party. ${formData.copyrightOwnerName} agrees to indemnify and hold harmless the other party from any losses, claims, or liabilities arising from a breach of this representation.`);
      y += 5;

      addText("8. INDEMNIFICATION", 14, true);
      addText("The Copyright Owner shall indemnify, defend, and hold harmless the Licensee, its agents, employees, officers, and directors, from all liabilities, damages, costs, and expenses (including legal fees) arising from any breach of this Agreement or from the use of the Music.");
      y += 5;

      addText("9. TRANSFER OF RIGHTS", 14, true);
      addText("This Agreement shall apply to successors and permitted assigns. Neither party shall assign or transfer any of its rights under this Agreement without prior written consent of the other.");
      y += 5;

      addText("10. EFFECT OF TERMINATION", 14, true);
      addText("Upon termination of this Agreement, all licenses granted hereunder shall immediately terminate, and Licensee shall cease using the Music. Any outstanding obligations as of the date of termination shall remain enforceable.");
      y += 5;

      addText("11. NOTICE", 14, true);
      addText("Any notice or communication required or permitted under this Agreement must be in writing and delivered to the addresses listed below or to such other address as may be later designated in writing.");
      y += 5;

      addText("12. ENTIRE AGREEMENT", 14, true);
      addText("This Agreement represents the entire understanding between the parties and supersedes all prior written or verbal agreements. No changes may be made except in a written amendment signed by both parties.");
      y += 5;

      addText("13. AMENDMENT", 14, true);
      addText("Any amendment to this Agreement shall be valid only if made in writing and signed by both parties.");
      y += 5;

      // Check if we need a new page
      if (y > 200) {
        doc.addPage();
        y = 20;
      }

      addText("14. SEVERABILITY", 14, true);
      addText("If any provision of this Agreement is held invalid or unenforceable, the remainder shall continue in full force and effect. Invalid or unenforceable provisions shall be modified to the extent necessary to become enforceable.");
      y += 5;

      addText("15. SECTION HEADINGS", 14, true);
      addText("Headings used in this Agreement are for convenience only and shall not affect the interpretation of any provision herein.");
      y += 5;

      addText("16. WAIVER OF CONTRACTUAL RIGHT", 14, true);
      addText("The failure of either party to enforce any provision of this Agreement shall not be considered a waiver of any subsequent right to enforce the same or other provisions.");
      y += 5;

      addText("17. CONFIDENTIALITY", 14, true);
      addText("Each party agrees to maintain in strict confidence all financial or proprietary information disclosed in relation to this Agreement, unless disclosure is required by law or with prior written consent.");
      y += 5;

      addText("18. APPLICABLE LAW", 14, true);
      addText(`This Agreement shall be governed by and interpreted under the laws of the State of ${formData.governingState}.`);
      y += 5;

      addText("19. SIGNATORIES", 14, true);
      addText(`This Agreement shall be signed on behalf of ${formData.copyrightOwnerName} by ${formData.copyrightOwnerSignatory} and on behalf of ${formData.licenseeName} by ${formData.licenseeSignatory}, and shall be effective as of the date first above written.`);
      y += 10;

      // Check if we need a new page for signatures
      if (y > 220) {
        doc.addPage();
        y = 20;
      }

      addText("Copyright Owner:", 12, true);
      addText(`By: ${formData.copyrightOwnerSignatory}`);
      addText(`Date: ${formData.copyrightOwnerSignatureDate}`);
      y += 5;

      addText("Licensee:", 12, true);
      addText(`By: ${formData.licenseeSignatory}`);
      addText(`Date: ${formData.licenseeSignatureDate}`);

      doc.save('music-license-agreement.pdf');
      toast.success("Document generated successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate document");
    } finally {
      setIsGeneratingPDF(false);
    }
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
              <CardDescription>Enter the basic details for the music license agreement</CardDescription>
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
                  <Label htmlFor="copyrightOwnerName">Copyright Owner Name</Label>
                  <Input
                    id="copyrightOwnerName"
                    value={formData.copyrightOwnerName}
                    onChange={(e) => updateFormData('copyrightOwnerName', e.target.value)}
                    placeholder="Name of the copyright owner"
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
                  <Label htmlFor="copyrightOwnerAddress">Copyright Owner Address</Label>
                  <Textarea
                    id="copyrightOwnerAddress"
                    value={formData.copyrightOwnerAddress}
                    onChange={(e) => updateFormData('copyrightOwnerAddress', e.target.value)}
                    placeholder="Complete address of the copyright owner"
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
              <CardTitle>Music & License Details</CardTitle>
              <CardDescription>Specify the music being licensed and usage terms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="musicTitle">Music Title</Label>
                <Input
                  id="musicTitle"
                  value={formData.musicTitle}
                  onChange={(e) => updateFormData('musicTitle', e.target.value)}
                  placeholder="Title of the music being licensed"
                />
              </div>

              <div>
                <Label htmlFor="licenseePurpose">Licensee's Project/Purpose</Label>
                <Textarea
                  id="licenseePurpose"
                  value={formData.licenseePurpose}
                  onChange={(e) => updateFormData('licenseePurpose', e.target.value)}
                  placeholder="What the licensee is seeking authorization for (e.g., film production, commercial use, etc.)"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="licensePurposes">Specific License Purposes</Label>
                <Textarea
                  id="licensePurposes"
                  value={formData.licensePurposes}
                  onChange={(e) => updateFormData('licensePurposes', e.target.value)}
                  placeholder="Detailed description of how the music will be used (e.g., background music, synchronization, broadcasting, etc.)"
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
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payment & Terms</CardTitle>
              <CardDescription>Set payment terms and agreement conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="royaltyCalculation">Royalty Calculation</Label>
                <Textarea
                  id="royaltyCalculation"
                  value={formData.royaltyCalculation}
                  onChange={(e) => updateFormData('royaltyCalculation', e.target.value)}
                  placeholder="Detailed explanation of how royalties are calculated (e.g., flat fee, percentage of revenue, per-use fee, etc.)"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="breachCureDays">Breach Cure Period (days)</Label>
                  <Input
                    id="breachCureDays"
                    value={formData.breachCureDays}
                    onChange={(e) => updateFormData('breachCureDays', e.target.value)}
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

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Important Terms Included</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Non-exclusive license grant</li>
                  <li>• Professional and lawful usage requirements</li>
                  <li>• Credit and attribution obligations</li>
                  <li>• No modifications without written approval</li>
                  <li>• Copyright owner indemnification</li>
                  <li>• Confidentiality of financial information</li>
                </ul>
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
                  <Label htmlFor="copyrightOwnerSignatory">Copyright Owner Signatory</Label>
                  <Input
                    id="copyrightOwnerSignatory"
                    value={formData.copyrightOwnerSignatory}
                    onChange={(e) => updateFormData('copyrightOwnerSignatory', e.target.value)}
                    placeholder="Name of person signing for copyright owner"
                  />
                </div>
                <div>
                  <Label htmlFor="copyrightOwnerSignatureDate">Copyright Owner Signature Date</Label>
                  <Input
                    id="copyrightOwnerSignatureDate"
                    type="date"
                    value={formData.copyrightOwnerSignatureDate}
                    onChange={(e) => updateFormData('copyrightOwnerSignatureDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="licenseeSignatory">Licensee Signatory</Label>
                  <Input
                    id="licenseeSignatory"
                    value={formData.licenseeSignatory}
                    onChange={(e) => updateFormData('licenseeSignatory', e.target.value)}
                    placeholder="Name of person signing for licensee"
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
                  All required information has been collected. You can now generate your Music License Agreement PDF.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <UserInfoStep
            onBack={() => setCurrentStep(5)}
            onGenerate={generatePDF}
            documentType="Music License Agreement"
            isGenerating={isGeneratingPDF}
          />
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
            onClick={() => navigate('/music-license-info')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Info
          </Button>
          
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Music License Agreement</h1>
            <p className="text-lg text-gray-600">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          <div className="mb-8">
            <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
          </div>
        </div>

        {renderStep()}

        {currentStep !== 6 && (
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
        )}
      </div>
    </div>
  );
};

export default MusicLicenseForm;
