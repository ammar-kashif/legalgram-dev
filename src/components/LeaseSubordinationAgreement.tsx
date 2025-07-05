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

interface FormData {
  // Agreement Date and Basic Info
  agreementDate: string;
  
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
  premisesAddress: string;
  
  // Signatures
  mortgageeSignature: string;
  mortgageeSignatureName: string;
  mortgageeTitle: string;
  mortgageeSignatureDate: string;
  
  tenantSignature: string;
  tenantSignatureName: string;
  tenantTitle: string;
  tenantSignatureDate: string;
  
  // Location Selection
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
}

const LeaseSubordinationAgreement = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    agreementDate: '',
    mortgageeName: '',
    mortgageeAddress: '',
    tenantName: '',
    tenantAddress: '',
    leaseDate: '',
    landlordName: '',
    landlordAddress: '',
    legalDescription: '',
    premisesAddress: '',
    mortgageeSignature: '',
    mortgageeSignatureName: '',
    mortgageeTitle: '',
    mortgageeSignatureDate: '',
    tenantSignature: '',
    tenantSignatureName: '',
    tenantTitle: '',
    tenantSignatureDate: '',
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
    addText("LEASE SUBORDINATION AGREEMENT", 14, true);
    yPosition += 10;

    // Agreement content with substituted values using the exact legal text
    const agreementText = `LEASE SUBORDINATION AGREEMENT

This Lease Subordination Agreement ("Agreement") is made and entered into as of ${formData.agreementDate || '[INSERT DATE]'}, by and between ${formData.mortgageeName || '[INSERT MORTGAGEE NAME]'}, having an address at ${formData.mortgageeAddress || '[INSERT MORTGAGEE ADDRESS]'} ("Mortgagee"), and ${formData.tenantName || '[INSERT TENANT NAME]'}, having an address at ${formData.tenantAddress || '[INSERT TENANT ADDRESS]'} ("Tenant").

RECITALS

WHEREAS, Tenant entered into a lease agreement (the "Lease") dated ${formData.leaseDate || '[INSERT LEASE DATE]'}, with ${formData.landlordName || '[INSERT LANDLORD NAME]'}, having an address at ${formData.landlordAddress || '[INSERT LANDLORD ADDRESS]'} ("Landlord"), covering certain real property legally described as follows:

${formData.legalDescription || '[INSERT LEGAL DESCRIPTION OF PREMISES]'}

(the "Premises"), commonly known as ${formData.premisesAddress || '[INSERT PREMISES ADDRESS]'};

WHEREAS, Mortgagee has extended a mortgage loan to Landlord, secured, inter alia, by a mortgage ("Mortgage") recorded against the Premises;

WHEREAS, Tenant has agreed to subordinate its leasehold interest in the Premises in consideration of Mortgagee's agreement not to disturb Tenant's possession thereof under the terms of the Lease, so long as Tenant remains in compliance with its obligations thereunder;

NOW, THEREFORE, in consideration of the foregoing and the mutual covenants contained herein, the parties agree as follows:

1. Subordination. Tenant hereby covenants and agrees that the Lease, and all of Tenant's rights, title, and interest thereunder, shall be and remain subject and subordinate in all respects to the lien, terms, and conditions of the Mortgage, including all renewals, extensions, modifications, consolidations, substitutions, or replacements thereof, and to any future mortgage or mortgages encumbering the Premises that are held by Mortgagee or its successors or assigns.

2. Non-Disturbance. So long as Tenant is not in default under the Lease beyond any applicable notice and cure periods, Mortgagee agrees that the Lease shall not be terminated, nor shall Tenant's possession, use, or enjoyment of the Premises be disturbed, nor shall the leasehold interest be otherwise affected in the event of foreclosure, or any proceeding to enforce the Mortgage, or if Mortgagee or any purchaser acquires the Premises.

   Notwithstanding the foregoing, any party succeeding to the interest of Landlord (hereinafter, the "Purchaser") as a result of foreclosure or similar action shall not be:
   (a) liable for any act or omission of any prior landlord;
   (b) subject to any offsets or defenses which Tenant may have against any prior landlord;
   (c) bound by any prepayment of rent for more than one month in advance; or
   (d) bound by any modification or amendment to the Lease not expressly approved in writing by Mortgagee.

3. Attornment. In the event of foreclosure or conveyance in lieu thereof, or if Mortgagee otherwise succeeds to the interest of Landlord under the Lease, Tenant agrees to attorn to and recognize the Purchaser (including Mortgagee, if applicable) as its landlord under the Lease. Such attornment shall be effective automatically and shall not require the execution of any further instrument.

   From and after such attornment, the Lease shall continue in full force and effect as a direct lease between the Purchaser and Tenant for the remainder of the term, including any extensions or renewals pursuant to the Lease, and the Purchaser shall assume the obligations of Landlord thereunder arising from and after the date of such succession.

4. Binding Effect. This Agreement shall be binding upon and inure to the benefit of the parties hereto and their respective heirs, executors, legal representatives, successors, and assigns.

5. Execution and Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original, and all of which together shall constitute one instrument. Electronic or scanned signatures shall be deemed effective as originals.

IN WITNESS WHEREOF, the undersigned have executed this Lease Subordination Agreement as of the date first written above.

MORTGAGEE:

By: ${formData.mortgageeSignature || '_______________________________'}
Name: ${formData.mortgageeSignatureName || '____________________________'}
Title: ${formData.mortgageeTitle || '_____________________________'}
Date: ${formData.mortgageeSignatureDate || '_____________________________'}

TENANT:

By: ${formData.tenantSignature || '_______________________________'}
Name: ${formData.tenantSignatureName || '____________________________'}
Title: ${formData.tenantTitle || '_____________________________'}
Date: ${formData.tenantSignatureDate || '_____________________________'}`;

    addText(agreementText);

    // Save the PDF
    doc.save('Lease_Subordination_Agreement.pdf');
    toast.success("PDF generated successfully!");
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
            <h3 className="text-lg font-semibold mb-4">Step 2: Agreement Date & Mortgagee Information</h3>
            
            <div>
              <Label htmlFor="agreementDate">Agreement Date</Label>
              <Input
                type="date"
                id="agreementDate"
                value={formData.agreementDate}
                onChange={(e) => handleInputChange('agreementDate', e.target.value)}
              />
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
                placeholder="Enter mortgagee's complete address"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Step 3: Tenant & Lease Information</h3>
            
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
                placeholder="Enter tenant's complete address"
                rows={3}
              />
            </div>

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
                placeholder="Enter landlord's complete address"
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
              <Label htmlFor="legalDescription">Legal Description of Premises</Label>
              <Textarea
                id="legalDescription"
                value={formData.legalDescription}
                onChange={(e) => handleInputChange('legalDescription', e.target.value)}
                placeholder="Enter the legal description of the property"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="premisesAddress">Premises Address (Common Address)</Label>
              <Textarea
                id="premisesAddress"
                value={formData.premisesAddress}
                onChange={(e) => handleInputChange('premisesAddress', e.target.value)}
                placeholder="Enter the common/street address of the premises"
                rows={3}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Step 5: Signatures</h3>
            
            <div className="border p-4 rounded-lg bg-gray-50">
              <h4 className="font-semibold mb-3">Mortgagee Signature</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mortgageeSignature">Signature (type name for digital signature)</Label>
                  <Input
                    id="mortgageeSignature"
                    value={formData.mortgageeSignature}
                    onChange={(e) => handleInputChange('mortgageeSignature', e.target.value)}
                    placeholder="Type name for digital signature"
                  />
                </div>
                <div>
                  <Label htmlFor="mortgageeSignatureName">Printed Name</Label>
                  <Input
                    id="mortgageeSignatureName"
                    value={formData.mortgageeSignatureName}
                    onChange={(e) => handleInputChange('mortgageeSignatureName', e.target.value)}
                    placeholder="Enter printed name"
                  />
                </div>
                <div>
                  <Label htmlFor="mortgageeTitle">Title</Label>
                  <Input
                    id="mortgageeTitle"
                    value={formData.mortgageeTitle}
                    onChange={(e) => handleInputChange('mortgageeTitle', e.target.value)}
                    placeholder="Enter title/position"
                  />
                </div>
                <div>
                  <Label htmlFor="mortgageeSignatureDate">Date</Label>
                  <Input
                    type="date"
                    id="mortgageeSignatureDate"
                    value={formData.mortgageeSignatureDate}
                    onChange={(e) => handleInputChange('mortgageeSignatureDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="border p-4 rounded-lg bg-gray-50">
              <h4 className="font-semibold mb-3">Tenant Signature</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tenantSignature">Signature (type name for digital signature)</Label>
                  <Input
                    id="tenantSignature"
                    value={formData.tenantSignature}
                    onChange={(e) => handleInputChange('tenantSignature', e.target.value)}
                    placeholder="Type name for digital signature"
                  />
                </div>
                <div>
                  <Label htmlFor="tenantSignatureName">Printed Name</Label>
                  <Input
                    id="tenantSignatureName"
                    value={formData.tenantSignatureName}
                    onChange={(e) => handleInputChange('tenantSignatureName', e.target.value)}
                    placeholder="Enter printed name"
                  />
                </div>
                <div>
                  <Label htmlFor="tenantTitle">Title (optional)</Label>
                  <Input
                    id="tenantTitle"
                    value={formData.tenantTitle}
                    onChange={(e) => handleInputChange('tenantTitle', e.target.value)}
                    placeholder="Enter title/position (if applicable)"
                  />
                </div>
                <div>
                  <Label htmlFor="tenantSignatureDate">Date</Label>
                  <Input
                    type="date"
                    id="tenantSignatureDate"
                    value={formData.tenantSignatureDate}
                    onChange={(e) => handleInputChange('tenantSignatureDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Lease Subordination Agreement</h1>
          </div>
          <p className="text-gray-600">
            Create a professional lease subordination agreement between mortgagee and tenant
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lease Subordination Agreement Form</span>
              <span className="text-sm font-normal text-gray-500">
                Step {currentStep} of 5
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaseSubordinationAgreement;
