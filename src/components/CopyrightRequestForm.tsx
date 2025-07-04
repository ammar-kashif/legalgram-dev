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

interface CopyrightRequestData {
  state: string;
  country: string;
  requestDate: string;
  requesterFullName: string;
  requesterStreetAddress: string;
  requesterCity: string;
  requesterState: string;
  requesterZipCode: string;
  requesterPhone: string;
  requesterFax: string;
  requesterEmail: string;
  recipientName: string;
  recipientCompany: string;
  recipientStreetAddress: string;
  recipientCity: string;
  recipientStateLocation: string;
  recipientZipCode: string;
  titleOfWork: string;
  authorCreator: string;
  excerptMaterial: string;
  requesterSignature: string;
  requesterPrintedName: string;
}

const CopyrightRequestForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<CopyrightRequestData>({
    state: '',
    country: '',
    requestDate: '',
    requesterFullName: '',
    requesterStreetAddress: '',
    requesterCity: '',
    requesterState: '',
    requesterZipCode: '',
    requesterPhone: '',
    requesterFax: '',
    requesterEmail: '',
    recipientName: '',
    recipientCompany: '',
    recipientStreetAddress: '',
    recipientCity: '',
    recipientStateLocation: '',
    recipientZipCode: '',
    titleOfWork: '',
    authorCreator: '',
    excerptMaterial: '',
    requesterSignature: '',
    requesterPrintedName: ''
  });

  const handleInputChange = (field: keyof CopyrightRequestData, value: string) => {
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
        return !!(formData.requestDate && formData.requesterFullName && formData.requesterStreetAddress && formData.requesterCity && formData.requesterState && formData.requesterZipCode && formData.requesterEmail);
      case 3:
        return !!(formData.recipientName && formData.recipientCompany && formData.recipientStreetAddress && formData.recipientCity && formData.recipientStateLocation && formData.recipientZipCode);
      case 4:
        return !!(formData.titleOfWork && formData.authorCreator && formData.excerptMaterial);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canAdvance()) return;

    if (currentStep < 4) {
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
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 20;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Helper function to add text
      const addText = (text: string, indent: number = 15) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(text, indent, y);
        y += lineHeight;
      };

      // Helper function to add section with spacing
      const addSection = (text: string, spacing: number = 3) => {
        addText(text);
        y += spacing;
      };

      // Get formatted date
      const requestDate = formData.requestDate ? format(new Date(formData.requestDate), 'MMMM d, yyyy') : '[Date]';
      
      // Requester's Information
      addSection(formData.requesterFullName || '[Your Full Name]');
      addSection(formData.requesterStreetAddress || '[Your Street Address]');
      addSection(`${formData.requesterCity || '[City]'}, ${formData.requesterState || '[State]'} ${formData.requesterZipCode || '[ZIP Code]'}`);
      addSection(`Phone: ${formData.requesterPhone || '________________'} · Fax: ${formData.requesterFax || '________________'} · Email: ${formData.requesterEmail || '________________'}`);
      
      y += 6; // Extra spacing
      addSection(requestDate);
      
      y += 6; // Extra spacing
      
      // Recipient's Information
      addSection(formData.recipientName || '[Recipient\'s Name]');
      addSection(formData.recipientCompany || '[Recipient\'s Company or Organization]');
      addSection(formData.recipientStreetAddress || '[Recipient\'s Street Address]');
      addSection(`${formData.recipientCity || '[City]'}, ${formData.recipientStateLocation || '[State]'} ${formData.recipientZipCode || '[ZIP Code]'}`);
      
      y += 6; // Extra spacing
      
      // Subject line
      addSection("Subject: Request for Copyright Permission");
      
      y += 3; // Extra spacing
      
      // Salutation
      addSection(`Dear ${formData.recipientName || '[Recipient\'s Name]'},`);
      
      y += 3; // Extra spacing
      
      // Main body paragraph
      addSection("I am writing to formally request permission to use the following portion of your work:");
      
      y += 3; // Extra spacing
      
      // Work details
      addSection(`Title of Work: ${formData.titleOfWork || '___________________________'}`);
      addSection(`Author/Creator: ${formData.authorCreator || '_________________________'}`);
      addSection("Excerpt or Material to be Used:");
      
      // Add excerpt material with proper wrapping
      if (formData.excerptMaterial) {
        const excerptLines = doc.splitTextToSize(formData.excerptMaterial, 170);
        excerptLines.forEach((line: string) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 15, y);
          y += lineHeight;
        });
      } else {
        y += lineHeight * 3; // Space for manual entry
      }
      
      y += 6; // Extra spacing
      
      // Permission statement
      const permissionText = "If you are willing to grant this permission, I will gladly include a copyright notice or acknowledgment using wording you specify. This notice will be placed alongside the material wherever it is used.";
      const permissionLines = doc.splitTextToSize(permissionText, 170);
      permissionLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });
      
      y += 6; // Extra spacing
      
      // Closing paragraph
      addSection("Thank you for your time and consideration. I look forward to your response.");
      
      y += 6; // Extra spacing
      
      // Signature section
      addSection("Sincerely,");
      
      y += 12; // Space for signature
      
      addSection(formData.requesterSignature || '[Your Signature]');
      addSection(formData.requesterPrintedName || '[Your Printed Name]');
      
      // Check if we need a new page for checklist
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      } else {
        y += 20; // Extra spacing before checklist
      }
      
      // Final Checklist section
      doc.setFont("helvetica", "bold");
      addSection("Final Checklist for Copyright Request");
      doc.setFont("helvetica", "normal");
      
      addSection(`Requester: ${formData.requesterFullName || '_________________________'}`);
      
      y += 6; // Extra spacing
      
      // Make It Legal section
      doc.setFont("helvetica", "bold");
      addSection("Make It Legal");
      doc.setFont("helvetica", "normal");
      
      const legalText = "Review the Copyright Request Letter to ensure it aligns with your intentions.";
      addSection(legalText);
      
      const editText = "If changes are needed after the initial draft, you can edit the document in Word or using a document manager.";
      addSection(editText);
      
      const sendText = "After signing, the completed letter should be sent to the Copyright Owner.";
      addSection(sendText);
      
      y += 6; // Extra spacing
      
      // Copies section
      doc.setFont("helvetica", "bold");
      addSection("Copies");
      doc.setFont("helvetica", "normal");
      
      const copyText1 = "Keep a copy of the signed letter for your personal records.";
      addSection(copyText1);
      
      const copyText2 = "You may also upload and store the letter in your secure file storage system for future reference and access.";
      const copyLines = doc.splitTextToSize(copyText2, 170);
      copyLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `Copyright_Permission_Request_${timestamp}.pdf`;
      
      doc.save(filename);
      toast.success("Copyright Permission Request generated successfully!");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Copyright Permission Request");
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
            <h3 className="text-lg font-semibold">Requester Information</h3>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="requesterCity">City</Label>
                <Input
                  id="requesterCity"
                  value={formData.requesterCity}
                  onChange={(e) => handleInputChange('requesterCity', e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="requesterState">State</Label>
                <Input
                  id="requesterState"
                  value={formData.requesterState}
                  onChange={(e) => handleInputChange('requesterState', e.target.value)}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <Label htmlFor="requesterZipCode">ZIP Code</Label>
                <Input
                  id="requesterZipCode"
                  value={formData.requesterZipCode}
                  onChange={(e) => handleInputChange('requesterZipCode', e.target.value)}
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="requesterPhone">Phone</Label>
                <Input
                  id="requesterPhone"
                  value={formData.requesterPhone}
                  onChange={(e) => handleInputChange('requesterPhone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="requesterFax">Fax (Optional)</Label>
                <Input
                  id="requesterFax"
                  value={formData.requesterFax}
                  onChange={(e) => handleInputChange('requesterFax', e.target.value)}
                  placeholder="Enter fax number"
                />
              </div>
              <div>
                <Label htmlFor="requesterEmail">Email</Label>
                <Input
                  id="requesterEmail"
                  type="email"
                  value={formData.requesterEmail}
                  onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recipient Information</h3>
            <div>
              <Label htmlFor="recipientName">Recipient's Name</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) => handleInputChange('recipientName', e.target.value)}
                placeholder="Enter recipient's full name"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="recipientCity">City</Label>
                <Input
                  id="recipientCity"
                  value={formData.recipientCity}
                  onChange={(e) => handleInputChange('recipientCity', e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="recipientStateLocation">State</Label>
                <Input
                  id="recipientStateLocation"
                  value={formData.recipientStateLocation}
                  onChange={(e) => handleInputChange('recipientStateLocation', e.target.value)}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <Label htmlFor="recipientZipCode">ZIP Code</Label>
                <Input
                  id="recipientZipCode"
                  value={formData.recipientZipCode}
                  onChange={(e) => handleInputChange('recipientZipCode', e.target.value)}
                  placeholder="Enter ZIP code"
                />
              </div>
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
                placeholder="Describe the specific excerpt, portion, or material you wish to use from the copyrighted work"
                rows={6}
              />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Note: Signature and printed name fields will be left blank in the generated document for manual signing.
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
          <strong>Request Details:</strong><br />
          Request Date: {formData.requestDate ? format(new Date(formData.requestDate), 'PPP') : 'Not provided'}
        </div>
        <div>
          <strong>Requester Information:</strong><br />
          Name: {formData.requesterFullName || 'Not provided'}<br />
          Address: {formData.requesterStreetAddress || 'Not provided'}<br />
          City, State ZIP: {`${formData.requesterCity || 'Not provided'}, ${formData.requesterState || 'Not provided'} ${formData.requesterZipCode || 'Not provided'}`}<br />
          Phone: {formData.requesterPhone || 'Not provided'}<br />
          Email: {formData.requesterEmail || 'Not provided'}<br />
          {formData.requesterFax && `Fax: ${formData.requesterFax}`}
        </div>
        <div>
          <strong>Recipient Information:</strong><br />
          Name: {formData.recipientName || 'Not provided'}<br />
          Company: {formData.recipientCompany || 'Not provided'}<br />
          Address: {formData.recipientStreetAddress || 'Not provided'}<br />
          City, State ZIP: {`${formData.recipientCity || 'Not provided'}, ${formData.recipientStateLocation || 'Not provided'} ${formData.recipientZipCode || 'Not provided'}`}
        </div>
        <div>
          <strong>Copyright Work Details:</strong><br />
          Title: {formData.titleOfWork || 'Not provided'}<br />
          Author/Creator: {formData.authorCreator || 'Not provided'}<br />
          Excerpt: {formData.excerptMaterial ? formData.excerptMaterial.substring(0, 100) + '...' : 'Not provided'}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Copyright Permission Request.
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
        return "Requester Information";
      case 3:
        return "Recipient Information";
      case 4:
        return "Copyright Work Details";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Select your country and state/province for this request";
      case 2:
        return "Enter your contact information and details";
      case 3:
        return "Enter the recipient's contact information";
      case 4:
        return "Specify the copyrighted work you want to use";
      default:
        return "";
    }
  };

  if (isComplete) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Request Complete!</CardTitle>
            <CardDescription>
              Review your request details below before generating the final document.
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
            <Button
              variant="outline"
              onClick={() => navigate('/documents')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documents
            </Button>
            <div className="text-sm text-gray-500">
              Step {currentStep} of 4
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
            {currentStep === 4 ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Request
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

export default CopyrightRequestForm;
