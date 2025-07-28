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

interface ManufacturingLicenseData {
  // Location Information
  state: string;
  country: string;
  
  // Basic Information
  effectiveDate: string;
  licensorName: string;
  licensorAddress: string;
  manufacturerName: string;
  manufacturerAddress: string;
  
  // Product and License Details
  productDescription: string;
  geographicRegion: string;
  
  // Payment Terms
  royaltyAmount: string;
  royaltyCalculation: string;
  
  // Terms and Conditions
  governingState: string;
  
  // Signatures
  licensorSignatory: string;
  manufacturerSignatory: string;
  licensorSignatureDate: string;
  manufacturerSignatureDate: string;
}

const ManufacturingLicenseForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ManufacturingLicenseData>({
    state: "",
    country: "",
    effectiveDate: "",
    licensorName: "",
    licensorAddress: "",
    manufacturerName: "",
    manufacturerAddress: "",
    productDescription: "",
    geographicRegion: "",
    royaltyAmount: "",
    royaltyCalculation: "",
    governingState: "",
    licensorSignatory: "",
    manufacturerSignatory: "",
    licensorSignatureDate: "",
    manufacturerSignatureDate: ""
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const totalSteps = 6;

  const updateFormData = (field: keyof ManufacturingLicenseData, value: string) => {
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
      addText("MANUFACTURING LICENSE AGREEMENT", 16, true);
      y += 5;

      // Main content
      addText(`This Manufacturing License Agreement ("Agreement") is entered into as of ${formData.effectiveDate}, by and between ${formData.licensorName}, of ${formData.licensorAddress}, and ${formData.manufacturerName}, of ${formData.manufacturerAddress}.`);
      addText(`In this Agreement, the party granting the right to use the licensed property will be referred to as "${formData.licensorName}," and the party receiving the license to manufacture, produce, market, and sell the licensed product will be referred to as "${formData.manufacturerName}."`);
      addText("The parties hereby agree to the following:");
      y += 5;

      addText("1. GRANT OF LICENSE", 14, true);
      addText(`${formData.licensorName} owns ${formData.productDescription} (the "Product"). Under the terms of this Agreement, ${formData.licensorName} grants to ${formData.manufacturerName} an exclusive license to manufacture, sell, and distribute the Product. The license includes all associated rights such as copyrights, patents, and related intellectual property required for manufacturing and distribution. This license applies only within the geographic region of ${formData.geographicRegion}.`);
      y += 5;

      addText("2. PAYMENT OF ROYALTY", 14, true);
      addText(`${formData.manufacturerName} shall pay ${formData.licensorName} a royalty of ${formData.royaltyAmount}, calculated as follows: ${formData.royaltyCalculation}.`);
      addText("Each royalty payment shall be accompanied by a written statement detailing how the royalty amount was determined.");
      y += 10;

      addText("3. MODIFICATIONS", 14, true);
      addText(`No changes or modifications may be made to the Product unless prior written approval is obtained from ${formData.licensorName}.`);
      y += 5;

      addText("4. QUALITY CONTROL AND APPROVAL", 14, true);
      addText("(a) The manufactured goods must meet a high-quality standard and conform to a sample agreed upon by both parties.");
      addText(`(b) Prior to full-scale manufacturing, ${formData.manufacturerName} must submit a sample of the Product at no cost to ${formData.licensorName} for review and approval.`);
      addText(`(c) If ${formData.licensorName} fails to respond within thirty (30) days, the sample shall be deemed approved.`);
      addText(`(d) No alterations or modifications to the approved design shall be made without prior written consent from ${formData.licensorName}.`);
      addText(`(e) Any disputes relating to quality standards will be resolved in good faith by both parties. ${formData.licensorName} may allow modifications if approved in writing.`);
      y += 5;

      // Check if we need a new page
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      addText("5. DEFAULTS", 14, true);
      addText(`If ${formData.manufacturerName} fails to meet its obligations, including royalty payments, ${formData.licensorName} shall have the right to cancel the Agreement by providing written notice. If the default is not resolved within the cure period, the Agreement may be terminated.`);
      y += 5;

      addText("6. ARBITRATION", 14, true);
      addText("Any dispute under this Agreement that cannot be resolved amicably shall be submitted to binding arbitration in accordance with the rules of the American Arbitration Association. Each party shall bear its own costs, and the decision shall be final and enforceable.");
      y += 5;

      addText("7. RELATIONSHIP OF THE PARTIES", 14, true);
      addText("This Agreement does not create any partnership, joint venture, or other relationship except that of licensor and licensee. Neither party may bind the other or represent itself as having such authority.");
      y += 5;

      addText("8. WARRANTIES", 14, true);
      addText(`${formData.licensorName} represents and warrants that they are the legal owner of the Product and have the authority to grant the rights contained in this Agreement. ${formData.manufacturerName} agrees to manufacture and sell the Product according to the terms laid out herein and in compliance with all applicable laws.`);
      y += 5;

      addText("9. TRANSFER OF RIGHTS", 14, true);
      addText("This Agreement shall be binding upon and benefit both parties and their successors. Neither party may assign its rights or obligations without prior written consent of the other.");
      y += 5;

      addText("10. INDEMNIFICATION", 14, true);
      addText(`${formData.manufacturerName} agrees to indemnify, defend, and hold harmless ${formData.licensorName}, its officers, employees, and agents from any losses, damages, or claims resulting from the use or sale of the Product, including third-party intellectual property claims.`);
      y += 5;

      // Check if we need a new page
      if (y > 200) {
        doc.addPage();
        y = 20;
      }

      addText("11. TERMINATION", 14, true);
      addText(`This Agreement may be terminated by either party with thirty (30) days' written notice. Either party may also terminate immediately in the event of a material breach if not cured within the notice period. Upon termination, ${formData.manufacturerName} shall cease production and return all materials provided by ${formData.licensorName}.`);
      y += 5;

      addText("12. CONFIDENTIALITY", 14, true);
      addText("Each party shall keep the contents and financial details of this Agreement confidential. Neither party shall disclose confidential information without the other's prior written approval. This obligation survives termination of the Agreement.");
      y += 5;

      addText("13. ENTIRE AGREEMENT", 14, true);
      addText("This Agreement represents the entire agreement between the parties and supersedes all prior understandings, whether oral or written. Any amendments must be made in writing and signed by both parties.");
      y += 5;

      addText("14. SECTION HEADINGS", 14, true);
      addText("Headings used in this Agreement are for convenience only and shall not affect the interpretation of the provisions herein.");
      y += 5;

      addText("15. AMENDMENT", 14, true);
      addText("This Agreement may be changed or amended only by a written instrument signed by both parties.");
      y += 5;

      addText("16. SEVERABILITY", 14, true);
      addText("If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.");
      y += 5;

      addText("17. WAIVER OF CONTRACTUAL RIGHT", 14, true);
      addText("The failure to enforce any provision of this Agreement shall not constitute a waiver of that right or any other provision.");
      y += 5;

      addText("18. APPLICABLE LAW", 14, true);
      addText(`This Agreement shall be governed by the laws of the State of ${formData.governingState}.`);
      y += 5;

      addText("19. SIGNATURES", 14, true);
      addText(`This Agreement shall be signed on behalf of ${formData.licensorName} by ${formData.licensorSignatory} and on behalf of ${formData.manufacturerName} by ${formData.manufacturerSignatory}.`);
      y += 10;

      // Check if we need a new page for signatures
      if (y > 220) {
        doc.addPage();
        y = 20;
      }

      addText("Manufacturer:", 12, true);
      addText(`By: ${formData.manufacturerSignatory}`);
      addText(`Date: ${formData.manufacturerSignatureDate}`);
      y += 5;

      addText("Licensor:", 12, true);
      addText(`By: ${formData.licensorSignatory}`);
      addText(`Date: ${formData.licensorSignatureDate}`);

      doc.save('manufacturing-license-agreement.pdf');
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
              <CardDescription>Enter the basic details for the manufacturing license agreement</CardDescription>
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
                    placeholder="Name of the licensor (product owner)"
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturerName">Manufacturer Name</Label>
                  <Input
                    id="manufacturerName"
                    value={formData.manufacturerName}
                    onChange={(e) => updateFormData('manufacturerName', e.target.value)}
                    placeholder="Name of the manufacturer"
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
                  <Label htmlFor="manufacturerAddress">Manufacturer Address</Label>
                  <Textarea
                    id="manufacturerAddress"
                    value={formData.manufacturerAddress}
                    onChange={(e) => updateFormData('manufacturerAddress', e.target.value)}
                    placeholder="Complete address of the manufacturer"
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
              <CardTitle>Product & License Details</CardTitle>
              <CardDescription>Specify the product being licensed and terms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="productDescription">Product Description</Label>
                <Textarea
                  id="productDescription"
                  value={formData.productDescription}
                  onChange={(e) => updateFormData('productDescription', e.target.value)}
                  placeholder="Detailed description of the product being licensed for manufacturing"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="geographicRegion">Geographic Region</Label>
                <Input
                  id="geographicRegion"
                  value={formData.geographicRegion}
                  onChange={(e) => updateFormData('geographicRegion', e.target.value)}
                  placeholder="Geographic limitation of the license (e.g., United States, North America, Worldwide)"
                />
              </div>

              <div>
                <Label htmlFor="royaltyAmount">Royalty Amount</Label>
                <Input
                  id="royaltyAmount"
                  value={formData.royaltyAmount}
                  onChange={(e) => updateFormData('royaltyAmount', e.target.value)}
                  placeholder="e.g., $5 per unit, 10% of net sales, etc."
                />
              </div>

              <div>
                <Label htmlFor="royaltyCalculation">Royalty Calculation Method</Label>
                <Textarea
                  id="royaltyCalculation"
                  value={formData.royaltyCalculation}
                  onChange={(e) => updateFormData('royaltyCalculation', e.target.value)}
                  placeholder="Detailed explanation of how royalties are calculated (e.g., based on units sold, net revenue, gross sales, etc.)"
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
              <CardDescription>Set the governing terms for the agreement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <li>• Quality control and approval processes</li>
                  <li>• 30-day termination notice requirement</li>
                  <li>• Binding arbitration for dispute resolution</li>
                  <li>• Manufacturer indemnification clause</li>
                  <li>• Confidentiality requirements</li>
                  <li>• No modifications without written approval</li>
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
                  <Label htmlFor="licensorSignatory">Licensor Signatory</Label>
                  <Input
                    id="licensorSignatory"
                    value={formData.licensorSignatory}
                    onChange={(e) => updateFormData('licensorSignatory', e.target.value)}
                    placeholder="Name of person signing for licensor"
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
                  <Label htmlFor="manufacturerSignatory">Manufacturer Signatory</Label>
                  <Input
                    id="manufacturerSignatory"
                    value={formData.manufacturerSignatory}
                    onChange={(e) => updateFormData('manufacturerSignatory', e.target.value)}
                    placeholder="Name of person signing for manufacturer"
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturerSignatureDate">Manufacturer Signature Date</Label>
                  <Input
                    id="manufacturerSignatureDate"
                    type="date"
                    value={formData.manufacturerSignatureDate}
                    onChange={(e) => updateFormData('manufacturerSignatureDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Ready to Generate</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  All required information has been collected. You can now generate your Manufacturing License Agreement PDF.
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
            documentType="Manufacturing License Agreement"
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
            onClick={() => navigate('/manufacturing-license-info')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Info
          </Button>
          
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manufacturing License Agreement</h1>
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

export default ManufacturingLicenseForm;
