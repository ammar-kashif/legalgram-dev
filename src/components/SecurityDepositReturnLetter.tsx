import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download, ArrowRight, ArrowLeft, Phone } from "lucide-react";
import { Country, State, City } from 'country-state-city';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import UserInfoStep from "@/components/UserInfoStep";

interface FormData {
  // Tenant Information
  tenantName: string;
  leaseDate: string;
  propertyAddress: string;
  depositDate: string;
  securityDepositAmount: string;
  
  // Deduction Details
  deductionReason: string;
  deductionAmount: string;
  remainingBalance: string;
  
  // Response Requirements
  responseDays: string;
  
  // Landlord Information
  landlordSignature: string;
  landlordName: string;
  landlordTitle: string;
  letterDate: string;
  
  // Location Selection
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
}

const SecurityDepositReturnLetter = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    tenantName: '',
    leaseDate: '',
    propertyAddress: '',
    depositDate: '',
    securityDepositAmount: '',
    deductionReason: '',
    deductionAmount: '',
    remainingBalance: '',
    responseDays: '',
    landlordSignature: '',
    landlordName: '',
    landlordTitle: '',
    letterDate: '',
    selectedCountry: '',
    selectedState: '',
    selectedCity: ''
  });

  const countries = Country.getAllCountries();
  const states = formData.selectedCountry ? State.getStatesOfCountry(formData.selectedCountry) : [];
  const cities = formData.selectedState ? City.getCitiesOfState(formData.selectedCountry, formData.selectedState) : [];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.isoCode === countryCode);
    setFormData(prev => ({
      ...prev,
      selectedCountry: countryCode,
      selectedState: '',
      selectedCity: ''
    }));
  };

  const handleStateChange = (stateCode: string) => {
    const state = states.find(s => s.isoCode === stateCode);
    setFormData(prev => ({
      ...prev,
      selectedState: stateCode,
      selectedCity: ''
    }));
  };

  const handleCityChange = (cityName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCity: cityName
    }));
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const lineHeight = 6;
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      lines.forEach((line: string) => {
        if (yPosition > doc.internal.pageSize.height - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
    };

    // Title
    addText("Re: Return of Security Deposit", 14, true);
    yPosition += 10;

    // Letter content with substituted values
    const letterText = `Dear ${formData.tenantName || '[Tenant\'s Name]'},

This letter pertains to the lease agreement dated ${formData.leaseDate || '[Insert Date]'}, under which you leased the property located at ${formData.propertyAddress || '[Insert Full Address]'} (the "Premises"). On ${formData.depositDate || '[Insert Date]'}, you paid a security deposit in the amount of $${formData.securityDepositAmount || '[Insert Amount]'}.

Upon inspection of the Premises following the termination of the lease, the following deductions have been made from your security deposit:

Reason for Deduction:
${formData.deductionReason || '[Insert Reason]'}

Amount Deducted: $${formData.deductionAmount || '[Insert Amount]'}

As a result of the above deduction(s), the remaining balance of your security deposit is $${formData.remainingBalance || '0.00'}, which is enclosed with this letter ${formData.remainingBalance === '0.00' || !formData.remainingBalance ? '[or, if nothing is returned: "Accordingly, no balance remains to be returned."]' : ''}.

If you dispute any of the deductions listed above, you must submit your objection in writing to the address listed above within ${formData.responseDays || '[Insert Number]'} days of receipt of this letter. Failure to respond within this time period may be deemed a waiver of any objection.

By my signature below, I certify that this notice has been sent to your last known mailing address.

Sincerely,

${formData.landlordSignature || '[Signature]'}

${formData.landlordName || '[Printed Name]'}

${formData.landlordTitle || '[Title or Role, if applicable]'}

${formData.letterDate || '[Date]'}`;

    addText(letterText);

    // Save the PDF
    doc.save('Security_Deposit_Return_Letter.pdf');
    toast.success("PDF generated successfully!");
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error("Failed to generate document");
  } finally {
    setIsGeneratingPDF(false);
  }
};

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Step 1: Location Selection</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={formData.selectedCountry} onValueChange={handleCountryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Select value={formData.selectedState} onValueChange={handleStateChange} disabled={!formData.selectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Select value={formData.selectedCity} onValueChange={handleCityChange} disabled={!formData.selectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.name} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Step 2: Tenant & Lease Information</h3>
            
            <div>
              <Label htmlFor="tenantName">Tenant's Name</Label>
              <Input
                id="tenantName"
                value={formData.tenantName}
                onChange={(e) => handleInputChange('tenantName', e.target.value)}
                placeholder="Enter tenant's full name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="leaseDate">Lease Agreement Date</Label>
                <Input
                  type="date"
                  id="leaseDate"
                  value={formData.leaseDate}
                  onChange={(e) => handleInputChange('leaseDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="depositDate">Security Deposit Date</Label>
                <Input
                  type="date"
                  id="depositDate"
                  value={formData.depositDate}
                  onChange={(e) => handleInputChange('depositDate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="propertyAddress">Property Address</Label>
              <Textarea
                id="propertyAddress"
                value={formData.propertyAddress}
                onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                placeholder="Enter complete property address"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="securityDepositAmount">Original Security Deposit Amount ($)</Label>
              <Input
                id="securityDepositAmount"
                value={formData.securityDepositAmount}
                onChange={(e) => handleInputChange('securityDepositAmount', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Step 3: Deduction Details</h3>
            
            <div>
              <Label htmlFor="deductionReason">Reason for Deduction</Label>
              <Textarea
                id="deductionReason"
                value={formData.deductionReason}
                onChange={(e) => handleInputChange('deductionReason', e.target.value)}
                placeholder="Describe the reason for the security deposit deduction"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deductionAmount">Amount Deducted ($)</Label>
                <Input
                  id="deductionAmount"
                  value={formData.deductionAmount}
                  onChange={(e) => handleInputChange('deductionAmount', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="remainingBalance">Remaining Balance ($)</Label>
                <Input
                  id="remainingBalance"
                  value={formData.remainingBalance}
                  onChange={(e) => handleInputChange('remainingBalance', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="responseDays">Response Period (days)</Label>
              <Input
                id="responseDays"
                value={formData.responseDays}
                onChange={(e) => handleInputChange('responseDays', e.target.value)}
                placeholder="e.g., 30"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Step 4: Landlord Information</h3>
            
            <div>
              <Label htmlFor="landlordName">Landlord's Printed Name</Label>
              <Input
                id="landlordName"
                value={formData.landlordName}
                onChange={(e) => handleInputChange('landlordName', e.target.value)}
                placeholder="Enter landlord's full name"
              />
            </div>

            <div>
              <Label htmlFor="landlordTitle">Title or Role (optional)</Label>
              <Input
                id="landlordTitle"
                value={formData.landlordTitle}
                onChange={(e) => handleInputChange('landlordTitle', e.target.value)}
                placeholder="e.g., Property Manager, Owner"
              />
            </div>

            <div>
              <Label htmlFor="landlordSignature">Signature (type name for digital signature)</Label>
              <Input
                id="landlordSignature"
                value={formData.landlordSignature}
                onChange={(e) => handleInputChange('landlordSignature', e.target.value)}
                placeholder="Type name for digital signature"
              />
            </div>

            <div>
              <Label htmlFor="letterDate">Letter Date</Label>
              <Input
                type="date"
                id="letterDate"
                value={formData.letterDate}
                onChange={(e) => handleInputChange('letterDate', e.target.value)}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <UserInfoStep
            onBack={prevStep}
            onGenerate={generatePDF}
            documentType="Security Deposit Return Letter"
            isGenerating={isGeneratingPDF}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Security Deposit Return Letter</h1>
          </div>
          <p className="text-gray-600 mb-4">
            Create a professional letter for returning security deposits with deduction details
          </p>
          
          {/* Professional Legal Services Disclaimer */}
          <LegalDisclaimer />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Security Deposit Return Letter Form</span>
              <span className="text-sm font-normal text-gray-500">
                Step {currentStep} of 5
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}

            {currentStep !== 5 && (
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep < 4 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityDepositReturnLetter;
