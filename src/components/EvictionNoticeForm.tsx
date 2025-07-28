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

interface EvictionNoticeData {
  dateOfNotice: string;
  tenantName: string;
  addressOfPremises: string;
  leaseDate: string;
  violations: string;
  correctiveActions: string;
  country: string;
  state: string;
  landlordName: string;
}

const EvictionNoticeForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formData, setFormData] = useState<EvictionNoticeData>({
    dateOfNotice: '',
    tenantName: '',
    addressOfPremises: '',
    leaseDate: '',
    violations: '',
    correctiveActions: '',
    country: '',
    state: '',
    landlordName: ''
  });

  const handleInputChange = (field: keyof EvictionNoticeData, value: string) => {
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
        return !!(formData.country && formData.state && formData.dateOfNotice && formData.tenantName && formData.addressOfPremises);
      case 2:
        return !!(formData.leaseDate && formData.violations);
      case 3:
        return !!(formData.correctiveActions && formData.landlordName);
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
      
      // Get proper names for display
      const countryName = formData.country ? getCountryName(formData.country.split(':')[0]) : '';
      const stateName = formData.state ? getStateName(formData.country?.split(':')[0] || '', formData.state.split(':')[0]) : '';
      
      // Title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("EVICTION NOTICE", 105, 30, { align: "center" });
      
      let yPosition = 60;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Notice details
    doc.text(`DATE OF NOTICE: ${formData.dateOfNotice}`, 20, yPosition);
    yPosition += 10;
    doc.text(`TENANT'S NAME: ${formData.tenantName}`, 20, yPosition);
    yPosition += 10;
    doc.text(`ADDRESS OF PREMISES: ${formData.addressOfPremises}`, 20, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "bold");
    doc.text("TAKE NOTICE THAT", 20, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    const introText = `This Notice is being provided to you pursuant to the terms of your written lease agreement (the "Lease"), entered into on or about ${formData.leaseDate}, between you and the undersigned, concerning the leased premises located at: ${formData.addressOfPremises} (hereinafter referred to as the "Premises").`;
    const introLines = doc.splitTextToSize(introText, 170);
    doc.text(introLines, 20, yPosition);
    yPosition += introLines.length + 25;
    
    // Section 1: Lease Violation
    doc.setFont("helvetica", "bold");
    doc.text("1. Lease Violation", 20, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    const violationText = `Please be advised that you are currently in breach of one or more covenants, conditions, or provisions of your Lease. The specific violations are as follows: ${formData.violations}`;
    const violationLines = doc.splitTextToSize(violationText, 170);
    doc.text(violationLines, 20, yPosition);
    yPosition += violationLines.length + 10;
    
    // Section 2: Required Corrective Action
    doc.setFont("helvetica", "bold");
    doc.text("2. Required Corrective Action", 20, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    const actionText = `You are hereby required to take the following corrective action(s) in order to cure the above-described violations: ${formData.correctiveActions}`;
    const actionLines = doc.splitTextToSize(actionText, 170);
    doc.text(actionLines, 20, yPosition);
    yPosition += actionLines.length + 10;
    
    // Check if we need a new page
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Section 3: Timeframe for Compliance
    doc.setFont("helvetica", "bold");
    doc.text("3. Timeframe for Compliance", 20, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    const timeframeText = `Pursuant to applicable law and the terms of your Lease, you are required to correct the above-mentioned violations within thirty (30) days of receipt or delivery of this Notice (the "Deadline"). Failure to comply within this timeframe will be deemed a continuing violation of the Lease and may result in further legal action.`;
    const timeframeLines = doc.splitTextToSize(timeframeText, 170);
    doc.text(timeframeLines, 20, yPosition);
    yPosition += timeframeLines.length + 20;
    
    // Section 4: Landlord's Right to Remedy
    doc.setFont("helvetica", "bold");
    doc.text("4. Landlord's Right to Remedy", 20, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    const remedyText = `Please be advised that if you do not correct the violations within the stated time period, the Landlord or its authorized agents may, but are not obligated to, take necessary steps to rectify the matter at your expense, including but not limited to entering the Premises to cure the default if permitted by law.`;
    const remedyLines = doc.splitTextToSize(remedyText, 170);
    doc.text(remedyLines, 20, yPosition);
    yPosition += remedyLines.length + 20;
    
    // Section 5: Potential Consequences
    doc.setFont("helvetica", "bold");
    doc.text("5. Potential Consequences", 20, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    const consequencesText = `This Notice shall also serve as a formal warning that repeated or continued violations of your Lease may constitute grounds for termination of your tenancy and possible eviction proceedings in accordance with the governing laws of the State of ${stateName}, ${countryName}.`;
    const consequencesLines = doc.splitTextToSize(consequencesText, 170);
    doc.text(consequencesLines, 20, yPosition);
    yPosition += consequencesLines.length + 20;
    
    // Check if we need a new page for signatures
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Signature lines
    doc.text(`TENANT'S NAME: ${formData.tenantName}`, 20, yPosition);
    yPosition += 15;
    doc.text("SIGNATURE: _________________________________", 20, yPosition);
    yPosition += 20;
    
    doc.text(`LANDLORD NAME: ${formData.landlordName}`, 20, yPosition);
    yPosition += 15;
    doc.text("SIGNATURE: _________________________________", 20, yPosition);
    
      doc.save('eviction-notice.pdf');
      toast.success("Eviction Notice PDF generated successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate Eviction Notice PDF");
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
              <Label htmlFor="dateOfNotice">Date of Notice</Label>
              <Input
                id="dateOfNotice"
                type="date"
                value={formData.dateOfNotice}
                onChange={(e) => handleInputChange('dateOfNotice', e.target.value)}
                placeholder="Select date of notice"
              />
            </div>
            <div>
              <Label htmlFor="tenantName">Tenant's Name</Label>
              <Input
                id="tenantName"
                value={formData.tenantName}
                onChange={(e) => handleInputChange('tenantName', e.target.value)}
                placeholder="Enter tenant's full name"
              />
            </div>
            <div>
              <Label htmlFor="addressOfPremises">Address of Premises</Label>
              <Textarea
                id="addressOfPremises"
                value={formData.addressOfPremises}
                onChange={(e) => handleInputChange('addressOfPremises', e.target.value)}
                placeholder="Enter complete address of the rental property"
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="leaseDate">Date of Lease Agreement</Label>
              <Input
                id="leaseDate"
                type="date"
                value={formData.leaseDate}
                onChange={(e) => handleInputChange('leaseDate', e.target.value)}
                placeholder="Select lease agreement date"
              />
            </div>
            <div>
              <Label htmlFor="violations">Lease Violations</Label>
              <Textarea
                id="violations"
                value={formData.violations}
                onChange={(e) => handleInputChange('violations', e.target.value)}
                placeholder="Describe the specific lease violations in detail"
                rows={5}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="correctiveActions">Required Corrective Actions</Label>
              <Textarea
                id="correctiveActions"
                value={formData.correctiveActions}
                onChange={(e) => handleInputChange('correctiveActions', e.target.value)}
                placeholder="Specify the actions tenant must take to remedy the violations"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="landlordName">Landlord's Name</Label>
              <Input
                id="landlordName"
                value={formData.landlordName}
                onChange={(e) => handleInputChange('landlordName', e.target.value)}
                placeholder="Enter landlord's full name"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <UserInfoStep
            onBack={handleBack}
            onGenerate={generatePDF}
            documentType="Eviction Notice"
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
          <strong>Notice Details:</strong><br />
          Date of Notice: {formData.dateOfNotice}<br />
          Tenant: {formData.tenantName}<br />
          Property Address: {formData.addressOfPremises}
        </div>
        <div>
          <strong>Lease Information:</strong><br />
          Lease Date: {formData.leaseDate}<br />
          Violations: {formData.violations}
        </div>
        <div>
          <strong>Corrective Actions:</strong><br />
          {formData.correctiveActions}
        </div>
        <div>
          <strong>Additional Information:</strong><br />
          Country: {countryName}<br />
          State: {stateName}<br />
          Landlord: {formData.landlordName}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Eviction Notice.
          </p>
        </div>
      </div>
    );
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Notice Details";
      case 2:
        return "Lease Information";
      case 3:
        return "Actions & Parties";
      case 4:
        return "Contact Information";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Select your location and enter basic notice information";
      case 2:
        return "Provide lease agreement details and violation specifics";
      case 3:
        return "Specify corrective actions and landlord information";
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
            <CardTitle className="text-xl text-green-600">Eviction Notice</CardTitle>
            <CardDescription>
              Review your Eviction Notice details below before generating the final document.
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
                  dateOfNotice: '',
                  tenantName: '',
                  addressOfPremises: '',
                  leaseDate: '',
                  violations: '',
                  correctiveActions: '',
                  country: '',
                  state: '',
                  landlordName: ''
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
        documentType="Eviction Notice"
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
                onClick={() => navigate('/eviction-notice-info')}
                className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn More About Eviction Notices
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

export default EvictionNoticeForm;
