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

interface FormData {
  // Tenant and Property Information
  tenantNames: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Lease Details
  terminationDate: string;
  landlordName: string;
  
  // Letter Details
  letterDate: string;
  authorizedAgentName: string;
  titleRole: string;
  
  // Location Selection
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
}

const LeaseTerminationLetter = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    tenantNames: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    terminationDate: '',
    landlordName: '',
    letterDate: '',
    authorizedAgentName: '',
    titleRole: '',
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
      selectedCity: '',
      state: state?.name || ''
    }));
  };

  const handleCityChange = (cityName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCity: cityName,
      city: cityName
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
    addText("LEASE TERMINATION LETTER", 16, true);
    yPosition += 10;

    // Letter content with substituted values
    const letterText = `To: ${formData.tenantNames || 'Tenant(s) and All Others in Possession'}
Premises Address: ${formData.streetAddress || '[Insert Street Address]'}, ${formData.city || '[Insert City]'}, ${formData.state || '[Insert State]'} ${formData.zipCode || '[ZIP Code]'}

PLEASE TAKE NOTICE that the lease agreement under which you currently occupy the above-described premises shall terminate in accordance with its terms on ${formData.terminationDate || '[Insert Termination Date]'}, and will not be renewed or converted into a month-to-month tenancy. Accordingly, you are not authorized to submit any rent payments for any period beyond the stated termination date. Any such payment inadvertently accepted will be returned and shall not be construed as a renewal, extension, or waiver of the termination.

FURTHER TAKE NOTICE that you are required to vacate and surrender possession of the premises to ${formData.landlordName || '[Insert Landlord\'s Name or Property Management Company]'} no later than the termination date above. The premises must be returned in the same condition as received at the time of move-in, reasonable wear and tear excepted. All keys, access cards, and related items must be returned at the time of vacating.

Failure to surrender possession of the premises as required may result in legal proceedings being initiated against you, including but not limited to an action for unlawful detainer, to recover possession of the premises.

The Landlord expressly reserves all rights and remedies provided by the lease agreement and applicable laws of the State of ${formData.state || '[Insert State]'}, including but not limited to claims for unpaid rent, property damage, and any other lawful relief. Nothing in this notice shall be construed as a waiver of any such rights or remedies.

Dated: ${formData.letterDate || '[Insert Date]'}

By: ${formData.authorizedAgentName || '[Insert Landlord or Authorized Agent\'s Name]'}

Title/Role: ${formData.titleRole || '[Insert Title or Company, if applicable]'}`;

    addText(letterText);

    // Save the PDF
    doc.save('Lease_Termination_Letter.pdf');
    toast.success("PDF generated successfully!");
  };

  const nextStep = () => {
    if (currentStep < 3) {
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
            <h3 className="text-lg font-semibold mb-4">Step 2: Property & Tenant Information</h3>
            
            <div>
              <Label htmlFor="tenantNames">Tenant Name(s)</Label>
              <Input
                id="tenantNames"
                value={formData.tenantNames}
                onChange={(e) => handleInputChange('tenantNames', e.target.value)}
                placeholder="Enter tenant name(s) or 'Tenant(s) and All Others in Possession'"
              />
            </div>

            <div>
              <Label htmlFor="streetAddress">Property Street Address</Label>
              <Input
                id="streetAddress"
                value={formData.streetAddress}
                onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                placeholder="Enter street address of the leased property"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cityManual">City</Label>
                <Input
                  id="cityManual"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="stateManual">State</Label>
                <Input
                  id="stateManual"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="terminationDate">Lease Termination Date</Label>
              <Input
                type="date"
                id="terminationDate"
                value={formData.terminationDate}
                onChange={(e) => handleInputChange('terminationDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="landlordName">Landlord or Property Management Company Name</Label>
              <Input
                id="landlordName"
                value={formData.landlordName}
                onChange={(e) => handleInputChange('landlordName', e.target.value)}
                placeholder="Enter landlord or property management company name"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Step 3: Letter Authorization</h3>
            
            <div>
              <Label htmlFor="letterDate">Letter Date</Label>
              <Input
                type="date"
                id="letterDate"
                value={formData.letterDate}
                onChange={(e) => handleInputChange('letterDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="authorizedAgentName">Authorized Agent's Name</Label>
              <Input
                id="authorizedAgentName"
                value={formData.authorizedAgentName}
                onChange={(e) => handleInputChange('authorizedAgentName', e.target.value)}
                placeholder="Enter name of landlord or authorized agent"
              />
            </div>

            <div>
              <Label htmlFor="titleRole">Title or Role (optional)</Label>
              <Input
                id="titleRole"
                value={formData.titleRole}
                onChange={(e) => handleInputChange('titleRole', e.target.value)}
                placeholder="e.g., Property Manager, Owner, Real Estate Agent"
              />
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
            <h1 className="text-3xl font-bold text-gray-900">Lease Termination Letter</h1>
          </div>
          <p className="text-gray-600 mb-4">
            Create a professional letter to notify tenants of lease termination
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lease Termination Letter Form</span>
              <span className="text-sm font-normal text-gray-500">
                Step {currentStep} of 3
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

              {currentStep < 3 ? (
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

export default LeaseTerminationLetter;
