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

interface SoftwareLicenseData {
  state: string;
  country: string;
  effectiveDate: string;
  licenseeName: string;
  licenseeAddress: string;
  licensorName: string;
  licensorAddress: string;
  softwareDescription: string;
  licenseFeeAmount: string;
  licenseFeeTerms: string;
  arbitrationState: string;
  governingState: string;
  licenseeSignature: string;
  licenseeSignatureDate: string;
  licensorSignature: string;
  licensorSignatureDate: string;
}

const SoftwareLicenseForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<SoftwareLicenseData>({
    state: '',
    country: '',
    effectiveDate: '',
    licenseeName: '',
    licenseeAddress: '',
    licensorName: '',
    licensorAddress: '',
    softwareDescription: '',
    licenseFeeAmount: '',
    licenseFeeTerms: '',
    arbitrationState: '',
    governingState: '',
    licenseeSignature: '',
    licenseeSignatureDate: '',
    licensorSignature: '',
    licensorSignatureDate: ''
  });

  const handleInputChange = (field: keyof SoftwareLicenseData, value: string) => {
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
        return !!(formData.effectiveDate && formData.licenseeName && formData.licenseeAddress && formData.licensorName && formData.licensorAddress);
      case 3:
        return !!(formData.softwareDescription);
      case 4:
        return !!(formData.licenseFeeAmount && formData.licenseFeeTerms);
      case 5:
        return !!(formData.arbitrationState && formData.governingState);
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
    try {
      const doc = new jsPDF();
      
      // Set up the document
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("SOFTWARE LICENSE AGREEMENT", 105, 20, { align: "center" });
      
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
      const effectiveDate = formData.effectiveDate ? format(new Date(formData.effectiveDate), 'MMMM d, yyyy') : '_______________';
      
      // Introduction
      addSection("", `This Software License Agreement (the "Agreement") is entered into by and between ${formData.licenseeName || '______________________'} (the "Licensee"), whose address is ${formData.licenseeAddress || '___________________________'}, and ${formData.licensorName || '______________________'} (the "Licensor"), having its principal place of business at ${formData.licensorAddress || '___________________________'}.`);

      // Section 1: Definitions
      addSection("1. DEFINITIONS", "");
      addSection("", `(a) "Software" refers to the computer programs and associated documentation as detailed in Schedule A of this Agreement.`);
      addSection("", `${formData.softwareDescription || 'Software description to be detailed in Schedule A'}`);
      addSection("", `(b) "Install" means placing the Software onto a computer's hard disk, CD-ROM, or any other form of storage device.`);
      addSection("", `(c) "Use" means executing or operating the Software on a computer, loading it into memory, and copying it for backup or archival purposes.`);

      // Section 2: Grant of Rights
      addSection("2. GRANT OF RIGHTS", "Licensor grants Licensee a non-exclusive, non-transferable license to install and use the Software on one device for internal business purposes, in accordance with the terms of this Agreement.");

      // Section 3: License Term
      addSection("3. LICENSE TERM", "This license will commence on the effective date and remain valid unless earlier terminated in accordance with this Agreement.");

      // Section 4: License Fee
      addSection("4. LICENSE FEE", `Licensee agrees to pay Licensor the license fees as outlined in Schedule B attached hereto.`);
      addSection("", `License Fee: ${formData.licenseFeeAmount || '$_______'}`);
      addSection("", `Payment Terms: ${formData.licenseFeeTerms || 'Payment terms to be detailed in Schedule B'}`);

      // Section 5: Termination
      addSection("5. TERMINATION", "Licensor may immediately terminate this Agreement if Licensee:");
      addSection("", "Fails to pay any amounts due,");
      addSection("", "Breaches any provision of this Agreement and does not cure within thirty (30) days of written notice, or");
      addSection("", "Becomes insolvent or declares bankruptcy.");

      // Section 6: Return or Destruction Upon Termination
      addSection("6. RETURN OR DESTRUCTION UPON TERMINATION", "Upon termination of this Agreement for any reason, Licensee shall:");
      addSection("", "Stop all use of the Software,");
      addSection("", "Return or destroy all copies of the Software,");
      addSection("", "Certify in writing that such destruction has occurred.");

      // Section 7: Title to Software
      addSection("7. TITLE TO SOFTWARE", "Licensor retains all right, title, and interest in and to the Software, including any updates or modifications.");

      // Section 8: Modifications and Enhancements
      addSection("8. MODIFICATIONS AND ENHANCEMENTS", "Licensee shall not modify, adapt, translate, reverse engineer, decompile, or disassemble the Software without Licensor's prior written consent.");

      // Section 9: Warranty Limitations
      addSection("9. WARRANTY LIMITATIONS", "The Software is provided \"as is.\" Licensor makes no warranties, express or implied, including but not limited to:");
      addSection("", "Merchantability,");
      addSection("", "Fitness for a particular purpose,");
      addSection("", "Non-infringement.");

      // Section 10: Remedy Limitations
      addSection("10. REMEDY LIMITATIONS", "If the Software does not perform according to the warranty (if any), Licensee's exclusive remedy shall be:");
      addSection("", "To return the Software and receive a refund of the license fee for the non-conforming portion, or");
      addSection("", "To have the Software repaired or replaced.");

      // Section 11: Damage Limitations
      addSection("11. DAMAGE LIMITATIONS", "In no event shall either party be liable to the other for any indirect, incidental, consequential, or special damages including lost profits or business interruption, even if advised of such possibility.");

      // Section 12: Confidentiality
      addSection("12. CONFIDENTIALITY", "Licensee agrees to treat the Software and any technical information provided by Licensor as confidential. This obligation shall remain in effect even after the termination of this Agreement.");

      // Section 13: Arbitration
      addSection("13. ARBITRATION", `Any disputes under this Agreement shall be resolved through arbitration under the rules of the American Arbitration Association. The arbitration will take place in the State of ${formData.arbitrationState || '___________'}.`);

      // Section 14: Attorney's Fees
      addSection("14. ATTORNEY'S FEES", "In the event of any legal action under this Agreement, the prevailing party shall be entitled to reasonable attorney's fees and court costs.");

      // Section 15: General Provisions
      addSection("15. GENERAL PROVISIONS", "");
      addSection("(a) Entire Agreement:", "This Agreement contains the full understanding between the parties. All prior agreements are superseded.");
      addSection("(b) Modifications:", "No amendment shall be valid unless in writing and signed by authorized representatives of both parties.");
      addSection("(c) Applicable Law:", `This Agreement shall be governed by the laws of the State of ${formData.governingState || '___________'}.`);
      addSection("(d) Notices:", "Any notice under this Agreement must be sent:");
      addSection("", "By personal delivery,");
      addSection("", "By certified mail, or");
      addSection("", "By overnight courier with confirmation.");
      addSection("", "All notices shall be deemed delivered based on the method chosen.");
      addSection("(e) No Agency:", "Nothing in this Agreement shall be construed to create any partnership or joint venture between the parties.");
      addSection("(f) Assignment:", "Licensee shall not assign this License without Licensor's prior written consent. Licensor may impose reasonable license transfer fees.");

      // Section 16: Signatures
      addSection("16. SIGNATURES", "This Agreement is executed on behalf of:");
      addSection("", `${formData.licenseeName || '_________________________'}, by ${formData.licenseeSignature || '___________________________'}`);
      addSection("", "(Signature)");
      addSection("", `Date: ${formData.licenseeSignatureDate || '_______________'}`);
      addSection("", `${formData.licensorName || '_________________________'}, by ${formData.licensorSignature || '___________________________'}`);
      addSection("", "(Signature)");
      addSection("", `Date: ${formData.licensorSignatureDate || '_______________'}`);

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `Software_License_Agreement_${timestamp}.pdf`;
      
      doc.save(filename);
      toast.success("Software License Agreement generated successfully!");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Software License Agreement");
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
                <Label htmlFor="licenseeName">Licensee Name</Label>
                <Input
                  id="licenseeName"
                  value={formData.licenseeName}
                  onChange={(e) => handleInputChange('licenseeName', e.target.value)}
                  placeholder="Name of party receiving license"
                />
              </div>
              <div>
                <Label htmlFor="licensorName">Licensor Name</Label>
                <Input
                  id="licensorName"
                  value={formData.licensorName}
                  onChange={(e) => handleInputChange('licensorName', e.target.value)}
                  placeholder="Name of party granting license"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="licenseeAddress">Licensee Address</Label>
                <Input
                  id="licenseeAddress"
                  value={formData.licenseeAddress}
                  onChange={(e) => handleInputChange('licenseeAddress', e.target.value)}
                  placeholder="Complete address of licensee"
                />
              </div>
              <div>
                <Label htmlFor="licensorAddress">Licensor Address</Label>
                <Input
                  id="licensorAddress"
                  value={formData.licensorAddress}
                  onChange={(e) => handleInputChange('licensorAddress', e.target.value)}
                  placeholder="Complete address of licensor"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Software Description</h3>
            <div>
              <Label htmlFor="softwareDescription">Software Description (Schedule A)</Label>
              <Textarea
                id="softwareDescription"
                value={formData.softwareDescription}
                onChange={(e) => handleInputChange('softwareDescription', e.target.value)}
                placeholder="Detailed description of the software, including computer programs, documentation, and associated materials being licensed"
                rows={6}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">License Fee & Payment Terms</h3>
            <div>
              <Label htmlFor="licenseFeeAmount">License Fee Amount</Label>
              <Input
                id="licenseFeeAmount"
                value={formData.licenseFeeAmount}
                onChange={(e) => handleInputChange('licenseFeeAmount', e.target.value)}
                placeholder="Enter license fee amount (e.g., $5,000)"
              />
            </div>
            <div>
              <Label htmlFor="licenseFeeTerms">Payment Terms (Schedule B)</Label>
              <Textarea
                id="licenseFeeTerms"
                value={formData.licenseFeeTerms}
                onChange={(e) => handleInputChange('licenseFeeTerms', e.target.value)}
                placeholder="Detailed payment terms including payment schedule, due dates, late fees, and payment methods"
                rows={4}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal Terms</h3>
            <div>
              <Label htmlFor="arbitrationState">Arbitration State</Label>
              <Input
                id="arbitrationState"
                value={formData.arbitrationState}
                onChange={(e) => handleInputChange('arbitrationState', e.target.value)}
                placeholder="Enter the state where arbitration will take place"
              />
            </div>
            <div>
              <Label htmlFor="governingState">Governing Law State</Label>
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
          Arbitration State: {formData.arbitrationState || 'Not provided'}<br />
          Governing Law State: {formData.governingState || 'Not provided'}
        </div>
        <div>
          <strong>Parties:</strong><br />
          Licensee: {formData.licenseeName || 'Not provided'} ({formData.licenseeAddress || 'Address not provided'})<br />
          Licensor: {formData.licensorName || 'Not provided'} ({formData.licensorAddress || 'Address not provided'})
        </div>
        <div>
          <strong>Software & License Terms:</strong><br />
          Software Description: {formData.softwareDescription ? formData.softwareDescription.substring(0, 100) + '...' : 'Not provided'}<br />
          License Fee: {formData.licenseFeeAmount || 'Not provided'}<br />
          Payment Terms: {formData.licenseFeeTerms ? formData.licenseFeeTerms.substring(0, 100) + '...' : 'Not provided'}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Software License Agreement.
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
        return "Software Description";
      case 4:
        return "License Fee & Payment Terms";
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
        return "Describe the software being licensed";
      case 4:
        return "Define license fees and payment terms";
      case 5:
        return "Specify arbitration and governing law provisions";
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

          <CardContent>
            {renderFormSummary()}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsComplete(false)}>
              Edit Details
            </Button>
            <Button onClick={generatePDF}>
              <FileText className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
      <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Step {currentStep} of 5
            </div>
          </div>
          <CardTitle className="text-xl">{getStepTitle()}</CardTitle>
          <CardDescription>
            {getStepDescription()}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {renderStepContent()}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!canAdvance()}
          >
            {currentStep === 5 ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Agreement
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SoftwareLicenseForm;
