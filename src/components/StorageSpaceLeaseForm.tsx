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

interface StorageSpaceLeaseData {
  // Location Information
  state: string;
  country: string;
  
  // Basic Information
  effectiveDate: string;
  lessorName: string;
  lessorAddress: string;
  lesseeName: string;
  lesseeAddress: string;
  
  // Property Details
  storageAddress: string;
  startDate: string;
  
  // Payment Details
  monthlyRent: string;
  paymentDay: string;
  securityDeposit: string;
  
  // Termination
  noticeDays: string;
  
  // Governing Law
  governingState: string;
  
  // Signatures
  lessorSignature: string;
  lessorSignatureDate: string;
  lesseeSignature: string;
  lesseeSignatureDate: string;
}

const StorageSpaceLeaseForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formData, setFormData] = useState<StorageSpaceLeaseData>({
    state: "",
    country: "",
    effectiveDate: "",
    lessorName: "",
    lessorAddress: "",
    lesseeName: "",
    lesseeAddress: "",
    storageAddress: "",
    startDate: "",
    monthlyRent: "",
    paymentDay: "",
    securityDeposit: "",
    noticeDays: "",
    governingState: "",
    lessorSignature: "",
    lessorSignatureDate: "",
    lesseeSignature: "",
    lesseeSignatureDate: ""
  });

  const totalSteps = 6;

  const updateFormData = (field: keyof StorageSpaceLeaseData, value: string) => {
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
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePDF = async (userInfo?: { name: string; email: string; phone: string }) => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let y = 20;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize = 11, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, margin, y);
      y += (lines.length * fontSize * 0.4) + 3;
    };

    const addSpace = (space = 5) => {
      y += space;
    };

    // Title
    addText("STORAGE SPACE LEASE AGREEMENT", 16, true);
    addSpace();

    // Opening paragraph
    addText(`This Storage Space Lease Agreement (the "Agreement") is made and entered into as of ${formData.effectiveDate}, by and between`);
    addText(`${formData.lessorName}, of ${formData.lessorAddress} ("Lessor"),`);
    addText("And");
    addText(`${formData.lesseeName}, of ${formData.lesseeAddress} ("Lessee").`);
    addText(`The Lessor and Lessee may hereinafter be collectively referred to as the "Parties."`);
    addSpace();

    // Section 1
    addText("1. Premises and Term", 12, true);
    addText(`Lessor hereby leases to Lessee the storage unit located at ${formData.storageAddress} (the "Premises"). The term of this Agreement shall commence on ${formData.startDate} and shall continue on a month-to-month basis unless terminated earlier in accordance with this Agreement.`);
    addSpace();

    // Section 2
    addText("2. Rent", 12, true);
    addText(`Lessee shall pay to Lessor monthly rent in the amount of $${formData.monthlyRent}, payable in advance on or before the ${formData.paymentDay} day of each calendar month. Rent shall be paid by mail or in person to the Lessor at the address set forth above, or to such other address as Lessor may from time to time designate in writing. Lessor shall provide a written receipt for any rent paid in cash, identifying the amount paid, the designated storage unit, and the rental period covered.`);
    addSpace();

    // Section 3
    addText("3. Security Deposit", 12, true);
    addText(`Upon execution of this Agreement, Lessee shall pay to Lessor a security deposit in the amount of $${formData.securityDeposit} as security for the full and faithful performance of the terms of this Agreement and to cover any damage caused to the Premises by Lessee or Lessee's agents, invitees, or representatives.`);
    addSpace();

    // Section 4
    addText("4. Termination", 12, true);
    addText(`Either Party may terminate this Agreement at any time by providing ${formData.noticeDays} days' prior written notice to the other Party. Such notice shall be delivered to the address provided in this Agreement, unless updated in writing.`);
    addSpace();

    // Section 5
    addText("5. Use of Premises", 12, true);
    addText("Lessee shall use the Premises exclusively for the storage of personal property. The use of electrical appliances (including refrigerators, freezers, or other powered devices) is strictly prohibited. Lessee shall not store or dispose of any items outside of the designated storage unit. The Premises shall not be used for unlawful purposes or in violation of any applicable laws or ordinances.");
    addSpace();

    // Check if we need a new page
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    // Section 6
    addText("6. Hazardous or Illegal Materials", 12, true);
    addText("Lessee shall not store, bring upon, or use within the Premises any flammable, explosive, toxic, or otherwise hazardous substances or materials. The possession or use of illegal substances or materials is strictly prohibited. Any violation of this provision may result in immediate termination of the Agreement.");
    addSpace();

    // Section 7
    addText("7. Security and Liability", 12, true);
    addText("Lessee acknowledges and agrees that the Premises is not equipped with a security system. Lessee stores property entirely at Lessee's sole risk. Lessor shall not be responsible for, nor shall Lessor provide insurance coverage for, any loss or damage to Lessee's property. Lessee is encouraged to obtain personal insurance coverage for any items stored at the Premises. Lessee hereby releases Lessor and its agents from any and all claims for loss, damage, or injury, whether to person or property, arising from the use of the Premises.");
    addSpace();

    // Section 8
    addText("8. Maintenance", 12, true);
    addText("Lessee shall maintain the Premises in a clean, orderly, and sanitary condition at all times. Lessee shall promptly notify Lessor of any need for repair or maintenance. Lessee shall not cause damage to the Premises, and any damage caused by Lessee shall be promptly repaired at Lessee's expense.");
    addSpace();

    // Section 9
    addText("9. Assignment and Sublease", 12, true);
    addText("Lessee shall not assign this Agreement, sublease the Premises, or permit the use of the Premises by any third party without the prior written consent of Lessor.");
    addSpace();

    // Section 10
    addText("10. Governing Law", 12, true);
    addText(`This Agreement shall be governed by, and construed in accordance with, the laws of the State of ${formData.governingState}.`);
    addSpace();

    // Check if we need a new page
    if (y > 200) {
      doc.addPage();
      y = 20;
    }

    // Section 11
    addText("11. Entire Agreement", 12, true);
    addText("This Agreement constitutes the entire understanding between the Parties and supersedes all prior negotiations, discussions, agreements, or representations, whether written or oral, concerning the subject matter hereof. No amendment or modification shall be effective unless in writing and signed by both Parties.");
    addSpace();

    // Section 12
    addText("12. Severability", 12, true);
    addText("If any provision of this Agreement is determined to be invalid or unenforceable by a court of competent jurisdiction, such provision shall be deemed modified to the extent necessary to make it enforceable, and the remainder of the Agreement shall continue in full force and effect.");
    addSpace(15);

    // Signature section
    addText("IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date first written above.", 11, false);
    addSpace(10);

    addText("LESSOR", 12, true);
    addText(`Signature: ${formData.lessorSignature}`);
    addText(`Name: ${formData.lessorName}`);
    addText(`Date: ${formData.lessorSignatureDate}`);
    addSpace();

    addText("LESSEE", 12, true);
    addText(`Signature: ${formData.lesseeSignature}`);
    addText(`Name: ${formData.lesseeName}`);
    addText(`Date: ${formData.lesseeSignatureDate}`);

    doc.save('storage-space-lease-agreement.pdf');
    toast.success("Storage Space Lease Agreement PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Storage Space Lease Agreement");
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

              <div>
                <Label htmlFor="governingState">Governing State (for legal jurisdiction)</Label>
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

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Basic Agreement Information</CardTitle>
              <CardDescription>Enter the basic details for the storage space lease agreement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => updateFormData('effectiveDate', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lessorName">Lessor's Full Legal Name</Label>
                  <Input
                    id="lessorName"
                    value={formData.lessorName}
                    onChange={(e) => updateFormData('lessorName', e.target.value)}
                    placeholder="Full legal name of the lessor (storage facility owner)"
                  />
                </div>
                <div>
                  <Label htmlFor="lesseeName">Lessee's Full Legal Name</Label>
                  <Input
                    id="lesseeName"
                    value={formData.lesseeName}
                    onChange={(e) => updateFormData('lesseeName', e.target.value)}
                    placeholder="Full legal name of the lessee (storage renter)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lessorAddress">Lessor's Address</Label>
                  <Textarea
                    id="lessorAddress"
                    value={formData.lessorAddress}
                    onChange={(e) => updateFormData('lessorAddress', e.target.value)}
                    placeholder="Complete address of the lessor"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="lesseeAddress">Lessee's Address</Label>
                  <Textarea
                    id="lesseeAddress"
                    value={formData.lesseeAddress}
                    onChange={(e) => updateFormData('lesseeAddress', e.target.value)}
                    placeholder="Complete address of the lessee"
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
              <CardTitle>Storage Unit Details</CardTitle>
              <CardDescription>Specify the storage unit location and term</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="storageAddress">Storage Unit Address</Label>
                <Input
                  id="storageAddress"
                  value={formData.storageAddress}
                  onChange={(e) => updateFormData('storageAddress', e.target.value)}
                  placeholder="Complete address where storage unit is located"
                />
              </div>

              <div>
                <Label htmlFor="startDate">Lease Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateFormData('startDate', e.target.value)}
                />
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Storage Terms Included</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Month-to-month lease arrangement</li>
                  <li>• Exclusive use for storage of personal property only</li>
                  <li>• No electrical appliances permitted</li>
                  <li>• No hazardous or illegal materials allowed</li>
                  <li>• Clean and orderly maintenance required</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payment & Terms</CardTitle>
              <CardDescription>Set the rental payment and termination details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyRent">Monthly Rent Amount ($)</Label>
                  <Input
                    id="monthlyRent"
                    value={formData.monthlyRent}
                    onChange={(e) => updateFormData('monthlyRent', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="paymentDay">Payment Due Day of Month</Label>
                  <Input
                    id="paymentDay"
                    value={formData.paymentDay}
                    onChange={(e) => updateFormData('paymentDay', e.target.value)}
                    placeholder="e.g., 1st, 15th"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="securityDeposit">Security Deposit Amount ($)</Label>
                <Input
                  id="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={(e) => updateFormData('securityDeposit', e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="noticeDays">Termination Notice Period (days)</Label>
                <Input
                  id="noticeDays"
                  value={formData.noticeDays}
                  onChange={(e) => updateFormData('noticeDays', e.target.value)}
                  placeholder="Number of days notice required for termination"
                />
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Payment Terms Included</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Monthly payments due in advance</li>
                  <li>• Written receipt provided for cash payments</li>
                  <li>• Security deposit for damages and performance</li>
                  <li>• Either party can terminate with proper notice</li>
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
                  <Label htmlFor="lessorSignature">Lessor Signature</Label>
                  <Input
                    id="lessorSignature"
                    value={formData.lessorSignature}
                    onChange={(e) => updateFormData('lessorSignature', e.target.value)}
                    placeholder="Lessor's signature line"
                  />
                </div>
                <div>
                  <Label htmlFor="lessorSignatureDate">Lessor Signature Date</Label>
                  <Input
                    id="lessorSignatureDate"
                    type="date"
                    value={formData.lessorSignatureDate}
                    onChange={(e) => updateFormData('lessorSignatureDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lesseeSignature">Lessee Signature</Label>
                  <Input
                    id="lesseeSignature"
                    value={formData.lesseeSignature}
                    onChange={(e) => updateFormData('lesseeSignature', e.target.value)}
                    placeholder="Lessee's signature line"
                  />
                </div>
                <div>
                  <Label htmlFor="lesseeSignatureDate">Lessee Signature Date</Label>
                  <Input
                    id="lesseeSignatureDate"
                    type="date"
                    value={formData.lesseeSignatureDate}
                    onChange={(e) => updateFormData('lesseeSignatureDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Legal Notes</h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• This agreement creates a legal binding relationship</li>
                  <li>• Lessee stores property at their own risk</li>
                  <li>• No insurance coverage provided by lessor</li>
                  <li>• Consider obtaining personal storage insurance</li>
                  <li>• Keep a copy of this agreement in a safe place</li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Ready to Generate</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  All required information has been collected. You can now generate your Storage Space Lease Agreement PDF.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <UserInfoStep
            onBack={prevStep}
            onGenerate={generatePDF}
            isGenerating={isGeneratingPDF}
            documentType="Storage Space Lease Agreement"
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
            onClick={() => navigate('/storage-space-lease-info')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Info
          </Button>
          
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Storage Space Lease Agreement</h1>
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

            {currentStep === totalSteps - 1 ? (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
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

export default StorageSpaceLeaseForm;
