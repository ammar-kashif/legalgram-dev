import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download, ArrowRight, ArrowLeft } from "lucide-react";
import { Country, State, City } from 'country-state-city';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import LegalDisclaimer from "@/components/LegalDisclaimer";
import UserInfoStep from "@/components/UserInfoStep";

interface FormData {
  // Agreement Information
  agreementDay: string;
  agreementMonth: string;
  agreementYear: string;
  
  // Mortgagee Information
  mortgageeName: string;
  mortgageeAddress: string;
  
  // Tenant Information
  tenantName: string;
  tenantAddress: string;
  
  // Lease Information
  leaseDate: string;
  landlordName: string;
  landlordAddress: string;
  
  // Property Information
  legalDescription: string;
  propertyAddress: string;
  
  // Signature Information
  mortgageeSignerName: string;
  mortgageeSignerTitle: string;
  mortgageeSignatureDate: string;
  tenantSignerName: string;
  tenantSignerTitle: string;
  tenantSignatureDate: string;
  
  // Location Selection
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
}

const NonDisturbanceAgreement = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    agreementDay: '',
    agreementMonth: '',
    agreementYear: '',
    mortgageeName: '',
    mortgageeAddress: '',
    tenantName: '',
    tenantAddress: '',
    leaseDate: '',
    landlordName: '',
    landlordAddress: '',
    legalDescription: '',
    propertyAddress: '',
    mortgageeSignerName: '',
    mortgageeSignerTitle: '',
    mortgageeSignatureDate: '',
    tenantSignerName: '',
    tenantSignerTitle: '',
    tenantSignatureDate: '',
    selectedCountry: '',
    selectedState: '',
    selectedCity: ''
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const totalSteps = 5;

  const countries = Country.getAllCountries();
  const states = formData.selectedCountry ? State.getStatesOfCountry(formData.selectedCountry) : [];
  const cities = formData.selectedState ? City.getCitiesOfState(formData.selectedCountry, formData.selectedState) : [];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCountryChange = (countryCode: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCountry: countryCode,
      selectedState: '',
      selectedCity: ''
    }));
  };

  const handleStateChange = (stateCode: string) => {
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
      addText("NON-DISTURBANCE AGREEMENT", 14, true);
      yPosition += 10;

      // Agreement content with substituted values using the exact legal text
      const agreementText = `This Agreement ("Agreement") is made and entered into on the ${formData.agreementDay || '___'} day of ${formData.agreementMonth || '_______'}, ${formData.agreementYear || '20__'}, by and between

${formData.mortgageeName || '[Insert Mortgagee Name]'}, of ${formData.mortgageeAddress || '[Insert Address]'} (hereinafter referred to as the "Mortgagee"),
And
${formData.tenantName || '[Insert Tenant Name]'}, of ${formData.tenantAddress || '[Insert Address]'} (hereinafter referred to as the "Tenant").

RECITALS

WHEREAS, Tenant entered into a lease agreement (the "Lease") dated ${formData.leaseDate || '__________'}, with ${formData.landlordName || '[Insert Landlord Name]'} (the "Landlord"), of ${formData.landlordAddress || '[Insert Landlord Address]'}, for the lease of a portion of the real property legally described as ${formData.legalDescription || '[Insert Legal Description]'}, commonly known as ${formData.propertyAddress || '[Insert Property Address]'} (the "Real Property");

WHEREAS, Mortgagee has made a loan to Landlord secured, in part, by a mortgage (the "Mortgage") encumbering the Real Property;

WHEREAS, Tenant has agreed to subordinate its leasehold interest to the Mortgage in exchange for the Mortgagee's agreement not to disturb Tenant's possession of the Real Property under the Lease so long as Tenant is not in default under the terms of the Lease.

AGREEMENT

NOW, THEREFORE, in consideration of the mutual covenants herein and intending to be legally bound, the parties agree as follows:

1. Subordination
Tenant agrees that the Lease, and all rights of the Tenant under it, shall be and remain subordinate in all respects to the lien, terms, and conditions of the Mortgage, including any renewals, extensions, modifications, replacements, or consolidations thereof, and to any future mortgage or mortgages placed on the Real Property by or through the Mortgagee.

2. Non-Disturbance
Provided Tenant is not in default under the Lease beyond applicable notice and cure periods, the Mortgagee agrees that:
(a) The Lease shall not be terminated,
(b) Tenant's possession, use, or enjoyment of the Premises shall not be disturbed, and
(c) The leasehold estate shall not otherwise be affected
in the event of foreclosure or any action or proceeding under or related to the Mortgage, or in the event the Mortgagee takes possession of the Real Property.

Notwithstanding the foregoing, any person or entity acquiring the interest of the Landlord as a result of such foreclosure or proceeding, including their successors and assigns (collectively, the "Purchaser"), shall not be:
(a) liable for any act or omission of any prior landlord;
(b) subject to any defenses or offsets Tenant may have against any prior landlord;
(c) bound by any rent prepayment exceeding one month; or
(d) bound by any amendment or modification of the Lease made without the Mortgagee's prior written consent.

3. Attornment
In the event of a transfer of the Landlord's interest by foreclosure, deed in lieu of foreclosure, or otherwise, Tenant agrees to attorn to and recognize the Purchaser (including the Mortgagee, if applicable) as its landlord under the Lease. Such attornment shall be effective automatically and without the execution of any further instrument. Following such attornment, the Lease shall remain in full force and effect between the Purchaser and Tenant, with the same terms, covenants, and conditions as though the Purchaser were the original landlord.

4. Successors and Assigns
This Agreement shall be binding upon and inure to the benefit of the parties hereto, and their respective successors, legal representatives, and assigns.

5. Execution
This Agreement may be executed in counterparts, each of which shall constitute an original, but all of which together shall constitute one and the same instrument. Facsimile or electronic signatures shall be deemed to have the same force and effect as originals.

IN WITNESS WHEREOF, the undersigned have executed this Lease Subordination and Non-Disturbance Agreement as of the date first written above.

MORTGAGEE:

By: ___________________________
Name: ${formData.mortgageeSignerName || '________________________'}
Title: ${formData.mortgageeSignerTitle || '_________________________'}
Date: ${formData.mortgageeSignatureDate || '_________________________'}

TENANT:

By: ___________________________
Name: ${formData.tenantSignerName || '________________________'}
Title: ${formData.tenantSignerTitle || '_________________________'}
Date: ${formData.tenantSignatureDate || '_________________________'}

Make It Legal

This Agreement should be signed in front of a notary public.
Once signed in front of a notary, this document should be delivered to the appropriate court for filing.

Copies
The original Agreement should be filed with the Clerk of Court or delivered to the requesting business.
The Affiant should maintain a copy of the Agreement. Your copy should be kept in a safe place. If you signed a paper copy of your document, you can use Rocket Lawyer to store and share it. Safe and secure in your Rocket Lawyer File Manager, you can access it any time from any computer, as well as share it for future reference.

Additional Assistance
If you are unsure or have questions regarding this Agreement or need additional assistance with special situations or circumstances, use Legal Gram. Find A Lawyer search engine to find a lawyer in your area to assist you in this matter.`;

      addText(agreementText);

      // Save the PDF
      doc.save('non-disturbance-agreement.pdf');
      toast.success("Document generated successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate document");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      setCurrentStep(5); // User info step
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
            <h3 className="text-lg font-semibold mb-4">Step 2: Agreement Date & Basic Information</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="agreementDay">Day</Label>
                <Input
                  id="agreementDay"
                  value={formData.agreementDay}
                  onChange={(e) => handleInputChange('agreementDay', e.target.value)}
                  placeholder="e.g., 15"
                />
              </div>
              <div>
                <Label htmlFor="agreementMonth">Month</Label>
                <Input
                  id="agreementMonth"
                  value={formData.agreementMonth}
                  onChange={(e) => handleInputChange('agreementMonth', e.target.value)}
                  placeholder="e.g., January"
                />
              </div>
              <div>
                <Label htmlFor="agreementYear">Year</Label>
                <Input
                  id="agreementYear"
                  value={formData.agreementYear}
                  onChange={(e) => handleInputChange('agreementYear', e.target.value)}
                  placeholder="e.g., 2025"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mortgageeName">Mortgagee Name</Label>
              <Input
                id="mortgageeName"
                value={formData.mortgageeName}
                onChange={(e) => handleInputChange('mortgageeName', e.target.value)}
                placeholder="Enter mortgagee's full name"
              />
            </div>

            <div>
              <Label htmlFor="mortgageeAddress">Mortgagee Address</Label>
              <Textarea
                id="mortgageeAddress"
                value={formData.mortgageeAddress}
                onChange={(e) => handleInputChange('mortgageeAddress', e.target.value)}
                placeholder="Enter complete mortgagee address"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="tenantName">Tenant Name</Label>
              <Input
                id="tenantName"
                value={formData.tenantName}
                onChange={(e) => handleInputChange('tenantName', e.target.value)}
                placeholder="Enter tenant's full name"
              />
            </div>

            <div>
              <Label htmlFor="tenantAddress">Tenant Address</Label>
              <Textarea
                id="tenantAddress"
                value={formData.tenantAddress}
                onChange={(e) => handleInputChange('tenantAddress', e.target.value)}
                placeholder="Enter complete tenant address"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Step 3: Lease Information</h3>
            
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
              <Label htmlFor="landlordName">Landlord Name</Label>
              <Input
                id="landlordName"
                value={formData.landlordName}
                onChange={(e) => handleInputChange('landlordName', e.target.value)}
                placeholder="Enter landlord's full name"
              />
            </div>

            <div>
              <Label htmlFor="landlordAddress">Landlord Address</Label>
              <Textarea
                id="landlordAddress"
                value={formData.landlordAddress}
                onChange={(e) => handleInputChange('landlordAddress', e.target.value)}
                placeholder="Enter complete landlord address"
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Step 4: Property Information</h3>
            
            <div>
              <Label htmlFor="legalDescription">Legal Description of Property</Label>
              <Textarea
                id="legalDescription"
                value={formData.legalDescription}
                onChange={(e) => handleInputChange('legalDescription', e.target.value)}
                placeholder="Enter the complete legal description of the property"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="propertyAddress">Property Address (commonly known as)</Label>
              <Textarea
                id="propertyAddress"
                value={formData.propertyAddress}
                onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                placeholder="Enter the complete property address"
                rows={3}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <UserInfoStep
            onBack={() => setCurrentStep(4)}
            onGenerate={generatePDF}
            documentType="Non-Disturbance Agreement"
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
            <h1 className="text-3xl font-bold text-gray-900">Non-Disturbance Agreement</h1>
          </div>
          <p className="text-gray-600 mb-4">
            Create a professional non-disturbance agreement between mortgagee and tenant
          </p>
          
          {/* Professional Legal Services Disclaimer */}
          <LegalDisclaimer />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Non-Disturbance Agreement Form</span>
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

                {currentStep < 5 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="button" onClick={generatePDF}>
                    Generate PDF
                    <Download className="w-4 h-4 ml-2" />
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

export default NonDisturbanceAgreement;
