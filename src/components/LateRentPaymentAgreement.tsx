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
  // Agreement Details
  agreementDate: string;
  
  // Landlord Information
  landlordName: string;
  landlordAddress: string;
  
  // Tenant Information
  tenantName: string;
  tenantAddress: string;
  
  // Property Information
  rentalPropertyAddress: string;
  
  // Payment Details
  pastDueAmount: string;
  finalPaymentDate: string;
  initialPaymentAmount: string;
  numberOfInstallments: string;
  installmentAmount: string;
  paymentDates: string;
  vacateWithinDays: string;
  
  // Location Selection
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
}

const LateRentPaymentAgreement = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    agreementDate: '',
    landlordName: '',
    landlordAddress: '',
    tenantName: '',
    tenantAddress: '',
    rentalPropertyAddress: '',
    pastDueAmount: '',
    finalPaymentDate: '',
    initialPaymentAmount: '',
    numberOfInstallments: '',
    installmentAmount: '',
    paymentDates: '',
    vacateWithinDays: '',
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
    addText("LATE RENT PAYMENT AGREEMENT", 16, true);
    yPosition += 10;

    // Agreement content with substituted values
    const agreementText = `This Late Rent Payment Agreement ("Agreement") is entered into on ${formData.agreementDate || '[Insert Date]'} ("Effective Date"), by and between 
${formData.landlordName || '[Insert Landlord\'s Full Name]'}, residing at ${formData.landlordAddress || '[Insert Landlord\'s Address]'} ("Landlord"), 
And
 ${formData.tenantName || '[Insert Tenant\'s Full Name]'}, residing at ${formData.tenantAddress || '[Insert Tenant\'s Address]'} ("Tenant"). 
The Landlord and Tenant may collectively be referred to herein as the "Parties."

WHEREAS, the Tenant is currently leasing the property located at ${formData.rentalPropertyAddress || '[Insert Full Rental Property Address]'} ("Premises") from the Landlord;

WHEREAS, the Tenant is currently in arrears in the amount of $${formData.pastDueAmount || '[Insert Amount]'} in past due rent;

WHEREAS, the Tenant acknowledges the outstanding rent owed and agrees to satisfy the total amount due no later than ${formData.finalPaymentDate || '[Insert Final Payment Date]'} ("Pay Date");

WHEREAS, the Tenant agrees to make a good faith payment of $${formData.initialPaymentAmount || '[Insert Amount]'} upon execution of this Agreement, and further agrees to pay ${formData.numberOfInstallments || '[Insert Number]'} installment(s) of $${formData.installmentAmount || '[Insert Amount]'} until the total past due rent is paid in full;

WHEREAS, the Tenant remains responsible for paying all current and future rent in addition to the scheduled installment payments toward the past due rent;

NOW, THEREFORE, the Parties agree as follows:

Payment Obligations

The Tenant shall remit the outstanding past due rent as follows:
• Initial payment of $${formData.initialPaymentAmount || '[Insert Amount]'} upon signing this Agreement;
• ${formData.numberOfInstallments || '[Insert Number]'} installment(s) of $${formData.installmentAmount || '[Insert Amount]'} payable on ${formData.paymentDates || '[Insert Payment Dates]'};
• Ongoing payment of all current and future rent as it becomes due.

Default and Termination

If the Tenant fails to comply with the payment terms outlined herein, including payment of future rent as due, the Tenant agrees to vacate the Premises immediately and no later than the Pay Date. The Tenant further agrees to remove all personal belongings from the Premises within ${formData.vacateWithinDays || '[Insert Number]'} days following the Pay Date.

Forbearance by Landlord

In consideration of the Tenant's promise to pay the past due rent, the Landlord agrees to refrain from initiating eviction or other legal proceedings for non-payment, provided that the Tenant strictly complies with the terms of this Agreement. Nothing in this Agreement shall be construed as a waiver of the Landlord's rights under applicable landlord-tenant law should the Tenant default.

Acknowledgment of Debt

The Tenant acknowledges and agrees that the amount of rent specified above is accurate and legally due, and that the Landlord is fully entitled to collect such amounts.

Entire Agreement

This Agreement constitutes the full and complete understanding between the Parties with respect to the subject matter herein and supersedes any prior or contemporaneous oral or written agreements or understandings. This Agreement may only be amended in writing, signed by both Parties.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.
 
Landlord:

${formData.landlordName || '[Landlord\'s Full Name]'}

Date: _____________________


Tenant:

${formData.tenantName || '[Tenant\'s Full Name]'}

Date: _____________________`;

    addText(agreementText);

    // Save the PDF
    doc.save('Late_Rent_Payment_Agreement.pdf');
    toast.success("PDF generated successfully!");
  };

  const nextStep = () => {
    if (currentStep < 4) {
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
            <h3 className="text-lg font-semibold mb-4">Step 2: Agreement Details & Parties</h3>
            
            <div>
              <Label htmlFor="agreementDate">Agreement Date</Label>
              <Input
                type="date"
                id="agreementDate"
                value={formData.agreementDate}
                onChange={(e) => handleInputChange('agreementDate', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="landlordName">Landlord's Full Name</Label>
                <Input
                  id="landlordName"
                  value={formData.landlordName}
                  onChange={(e) => handleInputChange('landlordName', e.target.value)}
                  placeholder="Enter landlord's full name"
                />
              </div>
              <div>
                <Label htmlFor="tenantName">Tenant's Full Name</Label>
                <Input
                  id="tenantName"
                  value={formData.tenantName}
                  onChange={(e) => handleInputChange('tenantName', e.target.value)}
                  placeholder="Enter tenant's full name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="landlordAddress">Landlord's Address</Label>
              <Textarea
                id="landlordAddress"
                value={formData.landlordAddress}
                onChange={(e) => handleInputChange('landlordAddress', e.target.value)}
                placeholder="Enter landlord's complete address"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="tenantAddress">Tenant's Address</Label>
              <Textarea
                id="tenantAddress"
                value={formData.tenantAddress}
                onChange={(e) => handleInputChange('tenantAddress', e.target.value)}
                placeholder="Enter tenant's complete address"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="rentalPropertyAddress">Rental Property Address</Label>
              <Textarea
                id="rentalPropertyAddress"
                value={formData.rentalPropertyAddress}
                onChange={(e) => handleInputChange('rentalPropertyAddress', e.target.value)}
                placeholder="Enter complete rental property address"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Step 3: Past Due Rent Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pastDueAmount">Total Past Due Amount ($)</Label>
                <Input
                  id="pastDueAmount"
                  value={formData.pastDueAmount}
                  onChange={(e) => handleInputChange('pastDueAmount', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="finalPaymentDate">Final Payment Date</Label>
                <Input
                  type="date"
                  id="finalPaymentDate"
                  value={formData.finalPaymentDate}
                  onChange={(e) => handleInputChange('finalPaymentDate', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="initialPaymentAmount">Initial Payment Amount ($)</Label>
                <Input
                  id="initialPaymentAmount"
                  value={formData.initialPaymentAmount}
                  onChange={(e) => handleInputChange('initialPaymentAmount', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="numberOfInstallments">Number of Installments</Label>
                <Input
                  id="numberOfInstallments"
                  value={formData.numberOfInstallments}
                  onChange={(e) => handleInputChange('numberOfInstallments', e.target.value)}
                  placeholder="e.g., 3"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="installmentAmount">Installment Payment Amount ($)</Label>
              <Input
                id="installmentAmount"
                value={formData.installmentAmount}
                onChange={(e) => handleInputChange('installmentAmount', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="paymentDates">Payment Dates</Label>
              <Textarea
                id="paymentDates"
                value={formData.paymentDates}
                onChange={(e) => handleInputChange('paymentDates', e.target.value)}
                placeholder="e.g., 1st and 15th of each month, or specific dates"
                rows={2}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Step 4: Additional Terms</h3>
            
            <div>
              <Label htmlFor="vacateWithinDays">Days to Vacate (if in default)</Label>
              <Input
                id="vacateWithinDays"
                value={formData.vacateWithinDays}
                onChange={(e) => handleInputChange('vacateWithinDays', e.target.value)}
                placeholder="e.g., 30"
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Agreement Summary</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Total Past Due:</strong> ${formData.pastDueAmount || '0.00'}</p>
                <p><strong>Initial Payment:</strong> ${formData.initialPaymentAmount || '0.00'}</p>
                <p><strong>Installments:</strong> {formData.numberOfInstallments || '0'} payments of ${formData.installmentAmount || '0.00'}</p>
                <p><strong>Final Payment Date:</strong> {formData.finalPaymentDate || 'Not set'}</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Late Rent Payment Agreement</h1>
          </div>
          <p className="text-gray-600">
            Create a professional agreement for tenants with past due rent to establish payment plans
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Late Rent Payment Agreement Form</span>
              <span className="text-sm font-normal text-gray-500">
                Step {currentStep} of 4
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

              {currentStep < 4 ? (
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

export default LateRentPaymentAgreement;
