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

interface PatentAssignmentData {
  state: string;
  country: string;
  effectiveDate: string;
  assignorName: string;
  assigneeName: string;
  patentsList: string;
  governingState: string;
  assignorSignature: string;
  assignorPrintedName: string;
  assignorDate: string;
  assigneeSignature: string;
  assigneePrintedName: string;
  assigneeDate: string;
}

const PatentAssignmentForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formData, setFormData] = useState<PatentAssignmentData>({
    state: '',
    country: '',
    effectiveDate: '',
    assignorName: '',
    assigneeName: '',
    patentsList: '',
    governingState: '',
    assignorSignature: '',
    assignorPrintedName: '',
    assignorDate: '',
    assigneeSignature: '',
    assigneePrintedName: '',
    assigneeDate: ''
  });

  const handleInputChange = (field: keyof PatentAssignmentData, value: string) => {
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
        return !!(formData.effectiveDate && formData.assignorName && formData.assigneeName);
      case 3:
        return !!(formData.patentsList && formData.governingState);
      case 4:
        return !!(formData.assignorPrintedName && formData.assigneePrintedName);
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
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      
      // Set up the document
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("PATENT ASSIGNMENT AGREEMENT", 105, 20, { align: "center" });
      
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
      addSection("", `This Patent Assignment Agreement (referred to herein as the "Assignment") is entered into on ${effectiveDate} (the "Effective Date") by and between:`);
      
      addSection("", `Assignor: ${formData.assignorName || '__________________________'}`);
      addSection("", "And");
      addSection("", `Assignee: ${formData.assigneeName || '__________________________'}`);

      // WHEREAS clauses
      addSection("", `WHEREAS, Assignor is the sole and rightful owner of certain patents, inventions, patent applications, and related intellectual property, as listed in Exhibit A attached to this Assignment (collectively referred to as the "Patents");`);
      
      addSection("", `WHEREAS, Assignee wishes to purchase or otherwise acquire the Assignor's full rights, title, and interest in the Patents;`);
      
      addSection("", `WHEREAS, both Assignor and Assignee represent that they are fully authorized and capable of entering into this Assignment;`);
      
      addSection("", `NOW, THEREFORE, in consideration of the mutual promises, covenants, and terms contained herein and for other good and valuable consideration, the receipt of which is acknowledged, the parties agree as follows:`);

      // Section 1: ASSIGNMENT
      addSection("1. ASSIGNMENT", `Assignor hereby irrevocably sells, assigns, transfers, and conveys to Assignee 100% of its right, title, and interest in and to the Patents and any renewals, reissues, or extensions of those Patents. This includes the right to file, prosecute, and maintain such Patents in all countries and regions worldwide, including but not limited to the United States. The assignment also includes all rights to sue for infringement, collect damages (past, present, or future), and enforce the Patents against any third parties.`);
      
      addSection("", "Assignor further agrees to:");
      addSection("", "(a) assist in the transfer and maintenance of the Patents as required,");
      addSection("", "(b) execute any documents necessary to complete or perfect this transfer, and");
      addSection("", "(c) cooperate in any proceedings or filings before any patent office or court as reasonably requested by the Assignee.");

      // Section 2: WARRANTY
      addSection("2. WARRANTY", `Assignor warrants that it is the lawful owner of the entire right, title, and interest in the Patents and that the Patents are not subject to any liens, encumbrances, pledges, or prior assignments. Assignor also warrants that no third party has any claim or interest in the Patents that would interfere with this Assignment.`);

      // Section 3: GOVERNING LAW
      addSection("3. GOVERNING LAW", `This Assignment shall be governed by and interpreted in accordance with the laws of the State of ${formData.governingState || '__________________________'}, without regard to its conflict of law provisions.`);

      // Section 4: ENTIRE AGREEMENT
      addSection("4. ENTIRE AGREEMENT", `This document constitutes the complete and exclusive understanding between the parties regarding the subject matter herein and supersedes any prior negotiations, communications, or agreements.`);

      // Section 5: SEVERABILITY
      addSection("5. SEVERABILITY", `If any portion of this Assignment is held to be invalid or unenforceable by a court of law, the remaining provisions shall remain in full force and effect. Any invalid provision shall be modified or interpreted to reflect the parties' intent as closely as possible in a valid and enforceable manner.`);

      // Section 6: ADVICE OF COUNSEL
      addSection("6. ADVICE OF COUNSEL", `Each party acknowledges that it has had the opportunity to consult with independent legal counsel before executing this Assignment. Each party understands and accepts all terms and provisions and agrees that this Assignment shall not be interpreted against any party based on authorship or drafting.`);

      // Signature section
      addSection("", "IN WITNESS WHEREOF, the undersigned have executed this Patent Assignment Agreement as of the Effective Date.");
      
      addSection("Assignor:", "");
      addSection("", `Signature: ${formData.assignorSignature || '__________________________'}`);
      addSection("", `Printed Name: ${formData.assignorPrintedName || '_______________________'}`);
      addSection("", `Date: ${formData.assignorDate || '______________________________'}`);
      
      addSection("Assignee:", "");
      addSection("", `Signature: ${formData.assigneeSignature || '__________________________'}`);
      addSection("", `Printed Name: ${formData.assigneePrintedName || '_______________________'}`);
      addSection("", `Date: ${formData.assigneeDate || '______________________________'}`);

      // Exhibit A
      addSection("Exhibit A", "List of Patents:");
      addSection("", formData.patentsList || "To be filled in with specific patent details, including patent numbers, titles, filing dates, and any relevant information identifying the patents being assigned.");

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `Patent_Assignment_Agreement_${timestamp}.pdf`;
      
      doc.save(filename);
      toast.success("Patent Assignment Agreement generated successfully!");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Patent Assignment Agreement");
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
              <Label htmlFor="assignorName">Assignor Name</Label>
              <Input
                id="assignorName"
                value={formData.assignorName}
                onChange={(e) => handleInputChange('assignorName', e.target.value)}
                placeholder="Enter the name of the party transferring the patent rights"
              />
            </div>
            <div>
              <Label htmlFor="assigneeName">Assignee Name</Label>
              <Input
                id="assigneeName"
                value={formData.assigneeName}
                onChange={(e) => handleInputChange('assigneeName', e.target.value)}
                placeholder="Enter the name of the party receiving the patent rights"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Patent Details & Governing Law</h3>
            <div>
              <Label htmlFor="patentsList">List of Patents (Exhibit A)</Label>
              <Textarea
                id="patentsList"
                value={formData.patentsList}
                onChange={(e) => handleInputChange('patentsList', e.target.value)}
                placeholder="List all patents being assigned, including patent numbers, titles, filing dates, and any relevant identifying information"
                rows={6}
              />
              <p className="text-sm text-gray-600 mt-1">
                Include patent numbers, titles, filing dates, and any other relevant details
              </p>
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
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Signature Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assignorPrintedName">Assignor Printed Name</Label>
                <Input
                  id="assignorPrintedName"
                  value={formData.assignorPrintedName}
                  onChange={(e) => handleInputChange('assignorPrintedName', e.target.value)}
                  placeholder="Printed name for assignor signature"
                />
              </div>
              <div>
                <Label htmlFor="assigneePrintedName">Assignee Printed Name</Label>
                <Input
                  id="assigneePrintedName"
                  value={formData.assigneePrintedName}
                  onChange={(e) => handleInputChange('assigneePrintedName', e.target.value)}
                  placeholder="Printed name for assignee signature"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Note: Signature and date fields will be left blank in the generated document for manual signing.
            </p>
          </div>
        );

      case 5:
        return (
          <UserInfoStep
            onBack={() => setCurrentStep(4)}
            onGenerate={generatePDF}
            documentType="Patent Assignment Agreement"
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
          Assignor: {formData.assignorName || 'Not provided'}<br />
          Assignee: {formData.assigneeName || 'Not provided'}
        </div>
        <div>
          <strong>Patents:</strong><br />
          {formData.patentsList || 'Not provided'}
        </div>
        <div>
          <strong>Signatories:</strong><br />
          Assignor: {formData.assignorPrintedName || 'Not provided'}<br />
          Assignee: {formData.assigneePrintedName || 'Not provided'}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Patent Assignment Agreement.
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
        return "Agreement Details";
      case 3:
        return "Patent Details & Governing Law";
      case 4:
        return "Signature Information";
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
        return "List the patents being assigned and specify governing law";
      case 4:
        return "Provide signatory information for the agreement";
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
                  assignorName: '',
                  assigneeName: '',
                  patentsList: '',
                  governingState: '',
                  assignorSignature: '',
                  assignorPrintedName: '',
                  assignorDate: '',
                  assigneeSignature: '',
                  assigneePrintedName: '',
                  assigneeDate: ''
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
              Step {currentStep} of 5
            </div>
          </CardDescription>
          {currentStep === 1 && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/patent-assignment-info')}
                className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn More About Patent Assignment Agreements
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

export default PatentAssignmentForm;
