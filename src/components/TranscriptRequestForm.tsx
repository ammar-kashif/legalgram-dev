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

interface TranscriptRequestData {
  country: string;
  state: string;
  authorizedPersonName: string;
  institutionName: string;
  institutionAddress: string;
  studentFullName: string;
  registrationNumber: string;
  enrollmentNumber: string;
  departmentName: string;
  academicYear: string;
  phoneNumber: string;
  emailAddress: string;
  studentAddress: string;
}

const TranscriptRequestForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formData, setFormData] = useState<TranscriptRequestData>({
    country: '',
    state: '',
    authorizedPersonName: '',
    institutionName: '',
    institutionAddress: '',
    studentFullName: '',
    registrationNumber: '',
    enrollmentNumber: '',
    departmentName: '',
    academicYear: '',
    phoneNumber: '',
    emailAddress: '',
    studentAddress: ''
  });

  const handleInputChange = (field: keyof TranscriptRequestData, value: string) => {
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
        return !!(formData.country && formData.state && formData.authorizedPersonName && formData.institutionName && formData.institutionAddress);
      case 2:
        return !!(formData.studentFullName && formData.registrationNumber && formData.enrollmentNumber && formData.departmentName && formData.academicYear);
      case 3:
        return !!(formData.phoneNumber && formData.emailAddress && formData.studentAddress);
      case 4:
        return true; // UserInfoStep handles its own validation
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
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("TRANSCRIPT REQUEST", 105, 30, { align: "center" });
      
      let yPosition = 60;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // To section
    doc.text("To", 20, yPosition);
    yPosition += 15;
    doc.text(`Name of Authorized person: ${formData.authorizedPersonName}`, 20, yPosition);
    yPosition += 15;
    doc.text(`Name of institution: ${formData.institutionName}`, 20, yPosition);
    yPosition += 15;
    const addressLines = doc.splitTextToSize(`Address: ${formData.institutionAddress}`, 170);
    doc.text(addressLines, 20, yPosition);
    yPosition += addressLines.length * 10 + 15;
    
    doc.setFont("helvetica", "bold");
    doc.text("Subject: Transcript Request", 20, yPosition);
    yPosition += 20;
    
    doc.setFont("helvetica", "normal");
    doc.text("Respected Sir/Madam,", 20, yPosition);
    yPosition += 20;
    
    // Main content
    const mainText = `I, ${formData.studentFullName}, bearing Registration Number ${formData.registrationNumber}, was a student of ${formData.institutionName}, enrolled in the ${formData.departmentName} during the academic year ${formData.academicYear}, with Enrollment Number ${formData.enrollmentNumber}.`;
    const mainLines = doc.splitTextToSize(mainText, 170);
    doc.text(mainLines, 20, yPosition);
    yPosition += mainLines.length * 10 + 15;
    
    const requestText = `I respectfully request that my degree be issued to my authorized representative at your earliest convenience. This request is made due to my inability to collect the degree in person, and I would greatly appreciate your cooperation in facilitating the process.`;
    const requestLines = doc.splitTextToSize(requestText, 170);
    doc.text(requestLines, 20, yPosition);
    yPosition += requestLines.length * 10 + 15;
    
    // Check if we need a new page
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 30;
    }
    
    const clarificationText = `Please do not hesitate to contact me at the address provided above should you require any clarification or further information. If there are any specific documents or procedures necessary to authorize this request, kindly inform me. I am fully committed to providing any required details or documentation promptly to ensure a smooth and efficient degree issuance process.`;
    const clarificationLines = doc.splitTextToSize(clarificationText, 170);
    doc.text(clarificationLines, 20, yPosition);
    yPosition += clarificationLines.length * 10 + 15;
    
    const contactText = `Additionally, I can be reached at ${formData.phoneNumber} or via email at ${formData.emailAddress} for any further communication.`;
    const contactLines = doc.splitTextToSize(contactText, 170);
    doc.text(contactLines, 20, yPosition);
    yPosition += contactLines.length * 10 + 15;
    
    const thankText = `Thank you in advance for your support and timely assistance in this matter.`;
    const thankLines = doc.splitTextToSize(thankText, 170);
    doc.text(thankLines, 20, yPosition);
    yPosition += thankLines.length * 10 + 20;
    
    // Check if we need a new page for signatures
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Signature section
    doc.text("Sincerely,", 20, yPosition);
    yPosition += 20;
    doc.text(`Name: ${formData.studentFullName}`, 20, yPosition);
    yPosition += 15;
    doc.text("Signatures: _________________________________", 20, yPosition);
    yPosition += 15;
    doc.text(`Address: ${formData.studentAddress}`, 20, yPosition);
    
      doc.save('transcript-request.pdf');
      toast.success("Transcript Request PDF generated successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate Transcript Request PDF");
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
            <div>
              <Label htmlFor="authorizedPersonName">Name of Authorized Person</Label>
              <Input
                id="authorizedPersonName"
                value={formData.authorizedPersonName}
                onChange={(e) => handleInputChange('authorizedPersonName', e.target.value)}
                placeholder="Enter authorized person's name at the institution"
              />
            </div>
            <div>
              <Label htmlFor="institutionName">Name of Institution</Label>
              <Input
                id="institutionName"
                value={formData.institutionName}
                onChange={(e) => handleInputChange('institutionName', e.target.value)}
                placeholder="Enter institution name"
              />
            </div>
            <div>
              <Label htmlFor="institutionAddress">Institution Address</Label>
              <Textarea
                id="institutionAddress"
                value={formData.institutionAddress}
                onChange={(e) => handleInputChange('institutionAddress', e.target.value)}
                placeholder="Enter complete address of the institution"
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="studentFullName">Student Full Name</Label>
              <Input
                id="studentFullName"
                value={formData.studentFullName}
                onChange={(e) => handleInputChange('studentFullName', e.target.value)}
                placeholder="Enter student's full name"
              />
            </div>
            <div>
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                placeholder="Enter registration number"
              />
            </div>
            <div>
              <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
              <Input
                id="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={(e) => handleInputChange('enrollmentNumber', e.target.value)}
                placeholder="Enter enrollment number"
              />
            </div>
            <div>
              <Label htmlFor="departmentName">Department Name</Label>
              <Input
                id="departmentName"
                value={formData.departmentName}
                onChange={(e) => handleInputChange('departmentName', e.target.value)}
                placeholder="Enter department name"
              />
            </div>
            <div>
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                value={formData.academicYear}
                onChange={(e) => handleInputChange('academicYear', e.target.value)}
                placeholder="Enter academic year (e.g., 2020-2024)"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="emailAddress">Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="studentAddress">Student Address</Label>
              <Textarea
                id="studentAddress"
                value={formData.studentAddress}
                onChange={(e) => handleInputChange('studentAddress', e.target.value)}
                placeholder="Enter student's current address"
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <UserInfoStep
            onBack={handleBack}
            onGenerate={generatePDF}
            documentType="Transcript Request"
            isGenerating={isGeneratingPDF}
          />
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
          <strong>Location:</strong><br />
          Country: {countryName}<br />
          State: {stateName}
        </div>
        <div>
          <strong>Institution Details:</strong><br />
          Authorized Person: {formData.authorizedPersonName}<br />
          Institution: {formData.institutionName}<br />
          Address: {formData.institutionAddress}
        </div>
        <div>
          <strong>Student Information:</strong><br />
          Name: {formData.studentFullName}<br />
          Registration Number: {formData.registrationNumber}<br />
          Enrollment Number: {formData.enrollmentNumber}<br />
          Department: {formData.departmentName}<br />
          Academic Year: {formData.academicYear}
        </div>
        <div>
          <strong>Contact Information:</strong><br />
          Phone: {formData.phoneNumber}<br />
          Email: {formData.emailAddress}<br />
          Address: {formData.studentAddress}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Transcript Request.
          </p>
        </div>
      </div>
    );
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Location & Institution Details";
      case 2:
        return "Student Information";
      case 3:
        return "Contact Information";
      case 4:
        return "Your Details";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Select your location and enter institution details";
      case 2:
        return "Provide student academic information and numbers";
      case 3:
        return "Enter contact details and current address";
      case 4:
        return "Provide your contact information to generate the document";
      default:
        return "";
    }
  };

  if (isComplete) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-600">Transcript Request</CardTitle>
            <CardDescription>
              Review your Transcript Request details below before generating the final document.
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
                  authorizedPersonName: '',
                  institutionName: '',
                  institutionAddress: '',
                  studentFullName: '',
                  registrationNumber: '',
                  enrollmentNumber: '',
                  departmentName: '',
                  academicYear: '',
                  phoneNumber: '',
                  emailAddress: '',
                  studentAddress: ''
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
              Step {currentStep} of 4
            </div>
          </CardDescription>
          {currentStep === 1 && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/transcript-request-info')}
                className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn More About Transcript Requests
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

export default TranscriptRequestForm;
