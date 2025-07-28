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

interface CopyrightPermissionData {
  state: string;
  country: string;
  requesterFullName: string;
  requesterStreetAddress: string;
  requesterCityStateZip: string;
  requesterPhone: string;
  requesterFax: string;
  requesterEmail: string;
  requestDate: string;
  recipientName: string;
  recipientCompany: string;
  recipientStreetAddress: string;
  recipientCityStateZip: string;
  titleOfWork: string;
  authorCreator: string;
  excerptMaterial: string;
  printedName: string;
}

const CopyrightPermissionForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<CopyrightPermissionData>({
    state: '',
    country: '',
    requesterFullName: '',
    requesterStreetAddress: '',
    requesterCityStateZip: '',
    requesterPhone: '',
    requesterFax: '',
    requesterEmail: '',
    requestDate: '',
    recipientName: '',
    recipientCompany: '',
    recipientStreetAddress: '',
    recipientCityStateZip: '',
    titleOfWork: '',
    authorCreator: '',
    excerptMaterial: '',
    printedName: ''
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleInputChange = (field: keyof CopyrightPermissionData, value: string) => {
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
        return !!(formData.requesterFullName && formData.requesterStreetAddress && formData.requesterCityStateZip && formData.requesterEmail && formData.requestDate);
      case 3:
        return !!(formData.recipientName && formData.recipientStreetAddress && formData.recipientCityStateZip);
      case 4:
        return !!(formData.titleOfWork && formData.authorCreator && formData.excerptMaterial && formData.printedName);
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
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 30;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Helper function to add text
      const addText = (text: string, x: number = 15, fontSize: number = 11, fontStyle: string = "normal") => {
        doc.setFont("helvetica", fontStyle);
        doc.setFontSize(fontSize);
        doc.text(text, x, y);
        y += lineHeight;
      };

      // Requester's Information (Header)
      addText(formData.requesterFullName || '[Your Full Name]', 15, 11, "normal");
      addText(formData.requesterStreetAddress || '[Your Street Address]', 15, 11, "normal");
      addText(formData.requesterCityStateZip || '[City, State, ZIP Code]', 15, 11, "normal");
      
      const contactLine = `Phone: ${formData.requesterPhone || '________________'} · Fax: ${formData.requesterFax || '________________'} · Email: ${formData.requesterEmail || '________________'}`;
      addText(contactLine, 15, 11, "normal");
      
      y += lineHeight; // Extra space
      
      // Date
      const requestDate = formData.requestDate ? format(new Date(formData.requestDate), 'MMMM d, yyyy') : '[Date]';
      addText(requestDate, 15, 11, "normal");
      
      y += lineHeight; // Extra space
      
      // Recipient's Information
      addText(formData.recipientName || '[Recipient\'s Name]', 15, 11, "normal");
      addText(formData.recipientCompany || '[Recipient\'s Company or Organization]', 15, 11, "normal");
      addText(formData.recipientStreetAddress || '[Recipient\'s Street Address]', 15, 11, "normal");
      addText(formData.recipientCityStateZip || '[City, State, ZIP Code]', 15, 11, "normal");
      
      y += lineHeight; // Extra space
      
      // Subject Line
      addText("Subject: Request for Copyright Permission", 15, 11, "bold");
      
      y += lineHeight; // Extra space
      
      // Salutation
      addText(`Dear ${formData.recipientName || '[Recipient\'s Name]'},`, 15, 11, "normal");
      
      y += lineHeight; // Extra space
      
      // Body paragraphs
      const bodyText1 = "I am writing to formally request permission to use the following portion of your work:";
      addText(bodyText1, 15, 11, "normal");
      
      y += lineHeight; // Extra space
      
      addText(`Title of Work: ${formData.titleOfWork || '___________________________'}`, 15, 11, "normal");
      addText(`Author/Creator: ${formData.authorCreator || '_________________________'}`, 15, 11, "normal");
      
      y += lineHeight; // Extra space
      
      addText("Excerpt or Material to be Used:", 15, 11, "normal");
      
      // Handle long excerpt text
      if (formData.excerptMaterial) {
        const excerptLines = doc.splitTextToSize(formData.excerptMaterial, 170);
        excerptLines.forEach((line: string) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
          addText(line, 15, 11, "normal");
        });
      } else {
        addText("", 15, 11, "normal");
        addText("", 15, 11, "normal");
        addText("", 15, 11, "normal");
      }
      
      y += lineHeight; // Extra space
      
      // Second paragraph
      const bodyText2 = "If you are willing to grant this permission, I will gladly include a copyright notice or acknowledgment using wording you specify. This notice will be placed alongside the material wherever it is used.";
      const bodyLines2 = doc.splitTextToSize(bodyText2, 170);
      bodyLines2.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        addText(line, 15, 11, "normal");
      });
      
      y += lineHeight; // Extra space
      
      // Closing paragraph
      const bodyText3 = "Thank you for your time and consideration. I look forward to your response.";
      addText(bodyText3, 15, 11, "normal");
      
      y += lineHeight; // Extra space
      
      // Signature section
      addText("Sincerely,", 15, 11, "normal");
      
      y += lineHeight * 2; // Space for signature
      
      addText("[Your Signature]", 15, 11, "normal");
      addText(formData.printedName || '[Your Printed Name]', 15, 11, "normal");
      
      // Check if we need a new page for the checklist
      if (y > pageHeight - 100) {
        doc.addPage();
        y = 30;
      } else {
        y += lineHeight * 3; // Extra space before checklist
      }
      
      // Final Checklist Section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Final Checklist for Copyright Request", 15, y);
      y += lineHeight + 3;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      addText(`Requester: ${formData.requesterFullName || '_________________________'}`, 15, 11, "normal");
      
      y += lineHeight; // Extra space
      
      // Make It Legal section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      addText("Make It Legal", 15, 11, "bold");
      
      doc.setFont("helvetica", "normal");
      const legalText = "Review the Copyright Request Letter to ensure it aligns with your intentions. If changes are needed after the initial draft, you can edit the document in Word or using a document manager. After signing, the completed letter should be sent to the Copyright Owner.";
      const legalLines = doc.splitTextToSize(legalText, 170);
      legalLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        addText(line, 15, 11, "normal");
      });
      
      y += lineHeight; // Extra space
      
      // Copies section
      doc.setFont("helvetica", "bold");
      addText("Copies", 15, 11, "bold");
      
      doc.setFont("helvetica", "normal");
      const copiesText = "Keep a copy of the signed letter for your personal records. You may also upload and store the letter in your secure file storage system for future reference and access.";
      const copiesLines = doc.splitTextToSize(copiesText, 170);
      copiesLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        addText(line, 15, 11, "normal");
      });
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `copyright_permission_request_${timestamp}.pdf`;
      
      doc.save(filename);
      toast.success("Copyright Permission Request generated successfully!");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Copyright Permission Request");
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
            <h3 className="text-lg font-semibold">Your Contact Information</h3>
            <div>
              <Label htmlFor="requesterFullName">Your Full Name</Label>
              <Input
                id="requesterFullName"
                value={formData.requesterFullName}
                onChange={(e) => handleInputChange('requesterFullName', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="requesterStreetAddress">Your Street Address</Label>
              <Input
                id="requesterStreetAddress"
                value={formData.requesterStreetAddress}
                onChange={(e) => handleInputChange('requesterStreetAddress', e.target.value)}
                placeholder="Enter your street address"
              />
            </div>
            <div>
              <Label htmlFor="requesterCityStateZip">City, State, ZIP Code</Label>
              <Input
                id="requesterCityStateZip"
                value={formData.requesterCityStateZip}
                onChange={(e) => handleInputChange('requesterCityStateZip', e.target.value)}
                placeholder="Enter city, state, and ZIP code"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requesterPhone">Phone Number</Label>
                <Input
                  id="requesterPhone"
                  value={formData.requesterPhone}
                  onChange={(e) => handleInputChange('requesterPhone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="requesterFax">Fax Number (Optional)</Label>
                <Input
                  id="requesterFax"
                  value={formData.requesterFax}
                  onChange={(e) => handleInputChange('requesterFax', e.target.value)}
                  placeholder="Enter fax number (optional)"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="requesterEmail">Email Address</Label>
              <Input
                id="requesterEmail"
                type="email"
                value={formData.requesterEmail}
                onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <Label htmlFor="requestDate">Request Date</Label>
              <Input
                id="requestDate"
                type="date"
                value={formData.requestDate}
                onChange={(e) => handleInputChange('requestDate', e.target.value)}
                placeholder="Select request date"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Copyright Owner Information</h3>
            <div>
              <Label htmlFor="recipientName">Recipient's Name</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) => handleInputChange('recipientName', e.target.value)}
                placeholder="Enter the copyright owner's name"
              />
            </div>
            <div>
              <Label htmlFor="recipientCompany">Recipient's Company or Organization</Label>
              <Input
                id="recipientCompany"
                value={formData.recipientCompany}
                onChange={(e) => handleInputChange('recipientCompany', e.target.value)}
                placeholder="Enter company or organization name"
              />
            </div>
            <div>
              <Label htmlFor="recipientStreetAddress">Recipient's Street Address</Label>
              <Input
                id="recipientStreetAddress"
                value={formData.recipientStreetAddress}
                onChange={(e) => handleInputChange('recipientStreetAddress', e.target.value)}
                placeholder="Enter recipient's street address"
              />
            </div>
            <div>
              <Label htmlFor="recipientCityStateZip">Recipient's City, State, ZIP Code</Label>
              <Input
                id="recipientCityStateZip"
                value={formData.recipientCityStateZip}
                onChange={(e) => handleInputChange('recipientCityStateZip', e.target.value)}
                placeholder="Enter recipient's city, state, and ZIP code"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Copyright Work Details</h3>
            <div>
              <Label htmlFor="titleOfWork">Title of Work</Label>
              <Input
                id="titleOfWork"
                value={formData.titleOfWork}
                onChange={(e) => handleInputChange('titleOfWork', e.target.value)}
                placeholder="Enter the title of the copyrighted work"
              />
            </div>
            <div>
              <Label htmlFor="authorCreator">Author/Creator</Label>
              <Input
                id="authorCreator"
                value={formData.authorCreator}
                onChange={(e) => handleInputChange('authorCreator', e.target.value)}
                placeholder="Enter the author or creator's name"
              />
            </div>
            <div>
              <Label htmlFor="excerptMaterial">Excerpt or Material to be Used</Label>
              <Textarea
                id="excerptMaterial"
                value={formData.excerptMaterial}
                onChange={(e) => handleInputChange('excerptMaterial', e.target.value)}
                placeholder="Describe the specific portion, excerpt, or material you wish to use"
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="printedName">Your Printed Name (for signature)</Label>
              <Input
                id="printedName"
                value={formData.printedName}
                onChange={(e) => handleInputChange('printedName', e.target.value)}
                placeholder="Enter your printed name for the signature section"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-sm">
        <div>
          <strong>Requester Information:</strong><br />
          Name: {formData.requesterFullName}<br />
          Address: {formData.requesterStreetAddress}<br />
          City/State/ZIP: {formData.requesterCityStateZip}<br />
          Phone: {formData.requesterPhone}<br />
          {formData.requesterFax && <>Fax: {formData.requesterFax}<br /></>}
          Email: {formData.requesterEmail}<br />
          Date: {formData.requestDate ? format(new Date(formData.requestDate), 'PPP') : 'Not provided'}
        </div>
        <div>
          <strong>Copyright Owner:</strong><br />
          Name: {formData.recipientName}<br />
          Company: {formData.recipientCompany}<br />
          Address: {formData.recipientStreetAddress}<br />
          City/State/ZIP: {formData.recipientCityStateZip}
        </div>
        <div>
          <strong>Work Details:</strong><br />
          Title: {formData.titleOfWork}<br />
          Author/Creator: {formData.authorCreator}<br />
          Material to Use: {formData.excerptMaterial}<br />
          Signatory: {formData.printedName}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your formal Copyright Permission Request letter.
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
        return "Your Contact Information";
      case 3:
        return "Copyright Owner Details";
      case 4:
        return "Work & Usage Details";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Select your country and state/province for this request";
      case 2:
        return "Enter your contact information for the request header";
      case 3:
        return "Provide details about the copyright owner or rights holder";
      case 4:
        return "Specify the work and material you wish to use";
      default:
        return "";
    }
  };

  if (isComplete) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-600">Copyright Permission Request</CardTitle>
            <CardDescription>
              Review your copyright permission request details before generating the final document.
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
                  requesterFullName: '',
                  requesterStreetAddress: '',
                  requesterCityStateZip: '',
                  requesterPhone: '',
                  requesterFax: '',
                  requesterEmail: '',
                  requestDate: '',
                  recipientName: '',
                  recipientCompany: '',
                  recipientStreetAddress: '',
                  recipientCityStateZip: '',
                  titleOfWork: '',
                  authorCreator: '',
                  excerptMaterial: '',
                  printedName: ''
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
        documentType="Copyright Permission Request"
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
                onClick={() => navigate('/copyright-permission-info')}
                className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn More About Copyright Permission Requests
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

export default CopyrightPermissionForm;
