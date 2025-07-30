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

interface CopyrightAssignmentData {
  country: string;
  state: string;
  dayOfMonth: string;
  monthName: string;
  year: string;
  assignorName: string;
  assignorAddress: string;
  assigneeName: string;
  assigneeAddress: string;
  copyrightedWorkTitle: string;
  workDescription: string;
}

const CopyrightAssignmentForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<CopyrightAssignmentData>({
    country: '',
    state: '',
    dayOfMonth: '',
    monthName: '',
    year: '',
    assignorName: '',
    assignorAddress: '',
    assigneeName: '',
    assigneeAddress: '',
    copyrightedWorkTitle: '',
    workDescription: ''
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleInputChange = (field: keyof CopyrightAssignmentData, value: string) => {
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
        return !!(formData.country && formData.state && formData.dayOfMonth && formData.monthName && formData.year);
      case 2:
        return !!(formData.assignorName && formData.assignorAddress && formData.assigneeName && formData.assigneeAddress);
      case 3:
        return !!(formData.copyrightedWorkTitle && formData.workDescription);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canAdvance()) return;

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      setCurrentStep(4); // User info step
    } else if (currentStep === 4) {
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
    const doc = new jsPDF();
    // Get proper names for display
    const countryName = formData.country ? getCountryName(formData.country.split(':')[0]) : '';
    const stateName = formData.state ? getStateName(formData.country?.split(':')[0] || '', formData.state.split(':')[0]) : '';
    try {
    
    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("COPYRIGHT ASSIGNMENT", 105, 30, { align: "center" });
    
    let yPosition = 50;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Introduction
    const introText = `This Copyright Assignment (hereinafter referred to as the "Assignment") is made and entered into on this ${formData.dayOfMonth} day of ${formData.monthName}, ${formData.year}, by and between:`;
    const introLines = doc.splitTextToSize(introText, 170);
    doc.text(introLines, 20, yPosition);
    yPosition += introLines.length * 5 + 10;
    
    // Assignor
    const assignorText = `${formData.assignorName}, residing at ${formData.assignorAddress} (hereinafter referred to as "Assignor"),`;
    const assignorLines = doc.splitTextToSize(assignorText, 170);
    doc.text(assignorLines, 20, yPosition);
    yPosition += assignorLines.length * 5 + 10;
    
    doc.setFont("helvetica", "bold");
    doc.text("AND", 20, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    // Assignee
    const assigneeText = `${formData.assigneeName}, residing at ${formData.assigneeAddress} (hereinafter referred to as "Assignee").`;
    const assigneeLines = doc.splitTextToSize(assigneeText, 170);
    doc.text(assigneeLines, 20, yPosition);
    yPosition += assigneeLines.length * 5 + 15;
    
    // Section 1: Ownership and Representation
    doc.setFont("helvetica", "bold");
    doc.text("1. Ownership and Representation", 20, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    const ownershipText = `The Assignor hereby represents, warrants, and affirms that they are the sole creator and exclusive owner of the copyrighted work entitled "${formData.copyrightedWorkTitle}" (hereinafter referred to as the "Copyrighted Work").`;
    const ownershipLines = doc.splitTextToSize(ownershipText, 170);
    doc.text(ownershipLines, 20, yPosition);
    yPosition += ownershipLines.length * 5 + 15;
    
    // Section 2: Assignment of Rights
    doc.setFont("helvetica", "bold");
    doc.text("2. Assignment of Rights", 20, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    const assignmentText = `For good and valuable consideration, the receipt and sufficiency of which is hereby acknowledged, the Assignor irrevocably assigns, transfers, and conveys to the Assignee all right, title, and interest, including all copyrights and associated rights, in and to the Copyrighted Work, as described in Exhibit A, which is attached hereto and made a part of this Assignment.`;
    const assignmentLines = doc.splitTextToSize(assignmentText, 170);
    doc.text(assignmentLines, 20, yPosition);
    yPosition += assignmentLines.length * 5 + 15;
    
    // Check if we need a new page
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Section 3: Scope of Assigned Rights
    doc.setFont("helvetica", "bold");
    doc.text("3. Scope of Assigned Rights", 20, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    const scopeText = `The rights assigned to the Assignee include, without limitation, the full and exclusive right to exploit, reproduce, publish, distribute, perform, display, license, modify, and otherwise use the Copyrighted Work in any manner and in all forms, media, or technologies now known or hereafter developed. The Assignee shall have the right to take any and all actions necessary or desirable to enforce and protect these rights, including initiating legal proceedings in the name of the Assignor, the Assignee, or both.`;
    const scopeLines = doc.splitTextToSize(scopeText, 170);
    doc.text(scopeLines, 20, yPosition);
    yPosition += scopeLines.length * 5 + 15;
    
    // Section 4: Registrations and Renewals
    doc.setFont("helvetica", "bold");
    doc.text("4. Registrations and Renewals", 20, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    const registrationText = `The Assignor further assigns and conveys all rights necessary for the Assignee to obtain and maintain copyright registrations, renewals, extensions, and reissues in relation to the Copyrighted Work, and agrees to cooperate with and assist the Assignee in executing any documents or taking any action required to perfect or enforce the rights assigned herein.`;
    const registrationLines = doc.splitTextToSize(registrationText, 170);
    doc.text(registrationLines, 20, yPosition);
    yPosition += registrationLines.length * 5 + 15;
    
    // Check if we need a new page
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Section 5: Warranties and Representations
    doc.setFont("helvetica", "bold");
    doc.text("5. Warranties and Representations", 20, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    const warrantiesIntro = "The Assignor hereby covenants, warrants, and represents that:";
    doc.text(warrantiesIntro, 20, yPosition);
    yPosition += 10;
    
    const warrantyA = "(a) The Assignor is the sole and exclusive creator and owner of the Copyrighted Work and has full authority to assign the rights granted herein;";
    const warrantyALines = doc.splitTextToSize(warrantyA, 160);
    doc.text(warrantyALines, 30, yPosition);
    yPosition += warrantyALines.length * 5 + 5;
    
    const warrantyB = "(b) The Copyrighted Work is original, free from any third-party claims, liens, encumbrances, licenses, or obligations, and does not infringe upon the rights of any third party;";
    const warrantyBLines = doc.splitTextToSize(warrantyB, 160);
    doc.text(warrantyBLines, 30, yPosition);
    yPosition += warrantyBLines.length * 5 + 5;
    
    const warrantyC = "(c) There are no existing agreements or understandings that would conflict with or impair the rights transferred under this Assignment.";
    const warrantyCLines = doc.splitTextToSize(warrantyC, 160);
    doc.text(warrantyCLines, 30, yPosition);
    yPosition += warrantyCLines.length * 5 + 15;
    
    // Check if we need a new page
    if (yPosition > 180) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Section 6: Waiver of Moral Rights
    doc.setFont("helvetica", "bold");
    doc.text("6. Waiver of Moral Rights", 20, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    const moralRightsIntro = "To the maximum extent permitted by applicable law, the Assignor hereby irrevocably waives any and all moral rights, including, but not limited to:";
    const moralRightsIntroLines = doc.splitTextToSize(moralRightsIntro, 170);
    doc.text(moralRightsIntroLines, 20, yPosition);
    yPosition += moralRightsIntroLines.length * 5 + 5;
    
    const moralRights = [
      "The right of attribution or the right to be identified as the author of the Copyrighted Work;",
      "The right to object to any modification, alteration, distortion, or mutilation of the Copyrighted Work;",
      "The right to withdraw the work from circulation;",
      "The right to prevent others from being falsely credited or attributed as the author of the Copyrighted Work;",
      "Any other right recognized under applicable moral rights or authorship laws."
    ];
    
    moralRights.forEach(right => {
      const rightLines = doc.splitTextToSize(right, 160);
      doc.text(rightLines, 30, yPosition);
      yPosition += rightLines.length * 5 + 3;
    });
    
    yPosition += 10;
    
    // Section 7: Governing Law
    doc.setFont("helvetica", "bold");
    doc.text("7. Governing Law", 20, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    const governingLawText = `This Assignment shall be governed by and construed in accordance with the laws of the State of ${stateName}, without regard to its conflict of laws provisions.`;
    const governingLawLines = doc.splitTextToSize(governingLawText, 170);
    doc.text(governingLawLines, 20, yPosition);
    yPosition += governingLawLines.length * 5 + 20;
    
    // Check if we need a new page for signatures
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Witness clause
    doc.setFont("helvetica", "normal");
    const witnessText = "IN WITNESS WHEREOF, the Assignor has executed this Assignment voluntarily and with full authority, as of the day and year first above written.";
    const witnessLines = doc.splitTextToSize(witnessText, 170);
    doc.text(witnessLines, 20, yPosition);
    yPosition += witnessLines.length * 5 + 20;
    
    // Signature sections
    doc.setFont("helvetica", "bold");
    doc.text("ASSIGNOR:", 20, yPosition);
    yPosition += 15;
    
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${formData.assignorName}`, 20, yPosition);
    yPosition += 10;
    doc.text("Signature: _________________________________", 20, yPosition);
    yPosition += 10;
    doc.text("Date: _____________________________________", 20, yPosition);
    yPosition += 20;
    
    doc.setFont("helvetica", "bold");
    doc.text("ASSIGNEE:", 20, yPosition);
    yPosition += 15;
    
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${formData.assigneeName}`, 20, yPosition);
    yPosition += 10;
    doc.text("Signature: _________________________________", 20, yPosition);
    yPosition += 10;
    doc.text("Date: _____________________________________", 20, yPosition);
    
    // Add work description as Exhibit A on a new page
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("EXHIBIT A", 105, 30, { align: "center" });
    doc.text("Description of Copyrighted Work", 105, 45, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const descriptionLines = doc.splitTextToSize(formData.workDescription, 170);
    doc.text(descriptionLines, 20, 70);
    
    doc.save('copyright-assignment.pdf');
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
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dayOfMonth">Day</Label>
                <Input
                  id="dayOfMonth"
                  value={formData.dayOfMonth}
                  onChange={(e) => handleInputChange('dayOfMonth', e.target.value)}
                  placeholder="e.g., 15"
                  maxLength={2}
                />
              </div>
              <div>
                <Label htmlFor="monthName">Month</Label>
                <Select
                  value={formData.monthName}
                  onValueChange={(value) => handleInputChange('monthName', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select month..." />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                    ].map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  placeholder="e.g., 2024"
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="assignorName">Assignor Name (Person transferring copyright)</Label>
              <Input
                id="assignorName"
                value={formData.assignorName}
                onChange={(e) => handleInputChange('assignorName', e.target.value)}
                placeholder="Enter full name of person transferring copyright"
              />
            </div>
            <div>
              <Label htmlFor="assignorAddress">Assignor Address</Label>
              <Textarea
                id="assignorAddress"
                value={formData.assignorAddress}
                onChange={(e) => handleInputChange('assignorAddress', e.target.value)}
                placeholder="Enter complete address of assignor"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="assigneeName">Assignee Name (Person receiving copyright)</Label>
              <Input
                id="assigneeName"
                value={formData.assigneeName}
                onChange={(e) => handleInputChange('assigneeName', e.target.value)}
                placeholder="Enter full name of person receiving copyright"
              />
            </div>
            <div>
              <Label htmlFor="assigneeAddress">Assignee Address</Label>
              <Textarea
                id="assigneeAddress"
                value={formData.assigneeAddress}
                onChange={(e) => handleInputChange('assigneeAddress', e.target.value)}
                placeholder="Enter complete address of assignee"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="copyrightedWorkTitle">Title of Copyrighted Work</Label>
              <Input
                id="copyrightedWorkTitle"
                value={formData.copyrightedWorkTitle}
                onChange={(e) => handleInputChange('copyrightedWorkTitle', e.target.value)}
                placeholder="Enter the title of the work being assigned"
              />
            </div>
            <div>
              <Label htmlFor="workDescription">Detailed Description of Work</Label>
              <Textarea
                id="workDescription"
                value={formData.workDescription}
                onChange={(e) => handleInputChange('workDescription', e.target.value)}
                placeholder="Provide a detailed description of the copyrighted work, including type of work (book, song, software, etc.), creation date, and any other relevant details"
                rows={6}
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
          <strong>Assignment Date:</strong><br />
          {formData.dayOfMonth} day of {formData.monthName}, {formData.year}
        </div>
        <div>
          <strong>Assignor (Transferring Copyright):</strong><br />
          Name: {formData.assignorName}<br />
          Address: {formData.assignorAddress}
        </div>
        <div>
          <strong>Assignee (Receiving Copyright):</strong><br />
          Name: {formData.assigneeName}<br />
          Address: {formData.assigneeAddress}
        </div>
        <div>
          <strong>Copyrighted Work:</strong><br />
          Title: {formData.copyrightedWorkTitle}<br />
          Description: {formData.workDescription}
        </div>
        <div>
          <strong>Governing Law:</strong><br />
          Country: {countryName}<br />
          State: {stateName}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Copyright Assignment agreement.
          </p>
        </div>
      </div>
    );
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Location & Date";
      case 2:
        return "Parties Information";
      case 3:
        return "Copyrighted Work Details";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Select your location and assignment date";
      case 2:
        return "Enter information for assignor and assignee";
      case 3:
        return "Provide details about the copyrighted work being assigned";
      default:
        return "";
    }
  };

  if (isComplete) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-600">Copyright Assignment</CardTitle>
            <CardDescription>
              Review your Copyright Assignment details below before generating the final document.
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
                  dayOfMonth: '',
                  monthName: '',
                  year: '',
                  assignorName: '',
                  assignorAddress: '',
                  assigneeName: '',
                  assigneeAddress: '',
                  copyrightedWorkTitle: '',
                  workDescription: ''
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

  if (currentStep === 4) {
    return (
      <UserInfoStep
        onBack={() => setCurrentStep(3)}
        onGenerate={generatePDF}
        documentType="Copyright Assignment"
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
              Step {currentStep} of 3
            </div>
          </CardDescription>
          {currentStep === 1 && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/copyright-assignment-info')}
                className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn More About Copyright Assignments
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="text-black">
          {renderStepContent()}
        </CardContent>
        {currentStep !== 4 && (
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
              {currentStep === 3 ? (
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

export default CopyrightAssignmentForm;
