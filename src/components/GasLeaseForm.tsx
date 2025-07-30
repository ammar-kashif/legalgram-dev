import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Fuel, Download, ArrowRight, ArrowLeft } from "lucide-react";
import { Country, State, City } from 'country-state-city';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import UserInfoStep from "@/components/UserInfoStep";

interface FormData {
  // Agreement Date and Parties
  agreementDate: string;
  lessorName: string;
  lessorAddress: string;
  lesseeName: string;
  lesseeAddress: string;

  // Property Details
  county: string;
  state: string;
  propertyAddress: string;
  legalDescription: string;
  acreage: string;

  // Lease Terms
  annualRental: string;
  leaseTerm: string;
  oilRoyaltyPercentage: string;
  gasRoyaltyPercentage: string;
  casingheadGasolinePercentage: string;
  paymentDay: string;
  rentalAmount: string;
  offsetWellDistance: string;
  mineralTaxPercentage: string;

  // Location Selection
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
}

const GasLeaseForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    agreementDate: '',
    lessorName: '',
    lessorAddress: '',
    lesseeName: '',
    lesseeAddress: '',
    county: '',
    state: '',
    propertyAddress: '',
    legalDescription: '',
    acreage: '',
    annualRental: '',
    leaseTerm: '',
    oilRoyaltyPercentage: '',
    gasRoyaltyPercentage: '',
    casingheadGasolinePercentage: '',
    paymentDay: '',
    rentalAmount: '',
    offsetWellDistance: '',
    mineralTaxPercentage: '',
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
    const country = countries.find(c => c.isoCode === countryCode);
    setFormData(prev => ({
      ...prev,
      selectedCountry: countryCode,
      selectedState: '',
      selectedCity: '',
      state: country?.name || ''
    }));
  };

  const handleStateChange = (stateCode: string) => {
    const state = states.find(s => s.isoCode === stateCode);
    setFormData(prev => ({
      ...prev,
      selectedState: stateCode,
      selectedCity: '',
      county: state?.name || ''
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
      addText("GAS LEASE AGREEMENT", 16, true);
      yPosition += 5;

      // Agreement text with substituted values
      const agreementText = `This Gas Lease Agreement ("Agreement") is made and entered into on ${formData.agreementDate || '[Insert Date]'}, by and between 
  ${formData.lessorName || '[Insert Name]'}, residing at ${formData.lessorAddress || '[Insert Address]'} ("Lessor"), 
  And
   ${formData.lesseeName || '[Insert Name]'}, residing at ${formData.lesseeAddress || '[Insert Address]'} ("Lessee"). 
  The Lessor and Lessee shall collectively be referred to as the "Parties."

  1. GRANT OF LEASED PREMISES
  In consideration of the sum of $${formData.annualRental || '0.00'} as annual rental, the receipt of which is acknowledged, and in further consideration of the covenants and obligations contained herein, the Lessor hereby leases exclusively to the Lessee the tract of land situated in the County of ${formData.county || '[Insert County]'}, State of ${formData.state || '[Insert State]'}, located at ${formData.propertyAddress || '[Insert Address]'}, and more fully described as: ${formData.legalDescription || '[Insert Legal Description]'}, comprising approximately ${formData.acreage || '0'} acres (the "Premises"), for the purpose of exploring, drilling, mining, extracting, storing, and removing oil, gas, hydrocarbons, and all associated substances.
  The lease shall remain in force for a term of ${formData.leaseTerm || '0'} years from the date of execution, and shall continue thereafter so long as:
  (a) oil, gas, or other hydrocarbon substances are being produced in paying quantities from the Premises;
  (b) drilling operations are being continuously conducted; or
  (c) the term is extended by mutual written agreement.

  2. RIGHTS GRANTED TO LESSEE
  Lessee is granted the exclusive right to:
  (a) enter and occupy the Premises;
  (b) construct, maintain, operate, and repair any necessary structures, including plants, pipelines, equipment, power and communication lines, employee housing, and roadways;
  (c) inject gas, water, and other substances into the Premises;
  (d) drill for water and use water obtained from the Premises free of charge;
  (e) build and operate processing facilities for extraction of oil and gas from the Premises or nearby lands.

  3. ROYALTY PROVISIONS
  3.1 Oil Royalty

  Lessee shall pay to Lessor a royalty equal to ${formData.oilRoyaltyPercentage || '_'}% of the value of oil produced and removed, adjusted for temperature, water, and sediment. Value shall be based on the prevailing market price on the date of removal. Lessor may elect, with 90 days' written notice, to receive royalty in kind. No royalty shall be owed for oil lost prior to delivery or due to casualty.
  3.2 Gas Royalty

  Lessee shall pay to Lessor a royalty equal to ${formData.gasRoyaltyPercentage || '_'}% of net proceeds received from the sale of gas. Deductions for transportation and processing are permitted. No royalty is due for gas:
  (a) lost or used in plant operations;
  (b) used for repressurization of oil-bearing formations.
  3.3 Casinghead Gasoline

  If sold, Lessee shall pay Lessor ${formData.casingheadGasolinePercentage || '_'}% of net proceeds received from casinghead gasoline. No royalty is due if it is reinjected. Sales must reflect fair market value.
  3.4 Own Use Exemption

  Lessee shall not be required to pay royalty on any hydrocarbons or water used in its operations under this Agreement.

  4. PAYMENT OF ROYALTIES
  All royalties due shall be paid on or before the ${formData.paymentDay || '[Insert Day]'} of each month for production during the preceding month. Payments shall be deemed made when deposited in the United States mail, addressed to Lessor. All unpaid royalties shall be settled at year-end.

  5. DEVELOPMENT CLAUSE
  Lessee has paid all rent due for the primary term. If drilling has not commenced by the end of such term, Lessee shall pay annual rentals of $${formData.rentalAmount || '0.00'} until drilling begins or the lease is terminated.

  6. PAYMENT METHOD
  Rent and royalties shall be considered paid upon mailing via first-class U.S. mail to Lessor's last known address. Lessor may update their address via written notice.

  7. OWNERSHIP INTEREST
  If Lessor owns less than full title to the Premises or mineral rights, royalties shall be reduced proportionally to reflect actual ownership.

  8. OIL AND GAS DEVELOPMENT
  Lessee shall continue to develop the Premises diligently upon discovery of oil or gas. If gas wells do not produce oil in paying quantities, Lessee may either suspend operations and pay rental of $0.00 per acre annually or seek markets to resume production.

  9. OFFSET WELLS
  Lessee shall drill an offset well if an adjacent well within ${formData.offsetWellDistance || '0'} feet of the boundary produces hydrocarbons in paying quantities for over 30 days, and Lessee has not fulfilled its drilling obligations under the Development Clause.

  10. CONDUCT OF OPERATIONS
  Lessee shall bear all costs of operations and perform in a lawful and workmanlike manner. No liens may be placed on the Premises as a result of Lessee's operations.

  11. TAXES
  Lessee shall pay taxes on all improvements and oil stored by it, and ${formData.mineralTaxPercentage || '[Insert %]'} of mineral taxes. Lessor shall pay real estate taxes and the remaining mineral taxes.

  12. SURFACE USE
  Lessor may use the surface of the Premises for agricultural or other non-interfering activities.

  13. DEFAULT
  If Lessee defaults in any obligation and fails to cure such default within 15 days of written notice, Lessor may terminate this Lease. However, Lessee shall retain rights to any actively producing or drilling wells and one acre surrounding such wells, including ingress and egress rights.

  14. TERMINATION AND REMOVAL
  Upon termination, Lessee shall vacate and restore the Premises to its original condition, reasonable wear and tear excepted. Lessee may remove all equipment and improvements.

  15. ASSIGNMENT
  Neither party shall assign its interest without prior written consent of the other, which shall not be unreasonably withheld. Notice of assignment must be given in writing.

  16. NOTICES
  All notices shall be in writing and delivered in person or by certified mail to the addresses stated above. Notices shall be deemed received upon delivery or three days after mailing.

  17. BINDING EFFECT
  This Lease shall be binding upon and inure to the benefit of the Parties and their respective heirs, executors, administrators, successors, and assigns.

  18. ATTORNEYS' FEES
  In the event of any legal action arising out of this Lease, the prevailing party shall be entitled to recover reasonable attorneys' fees and costs as determined by the court.

  19. ENTIRE AGREEMENT
  This Agreement constitutes the entire agreement between the Parties concerning the Premises. No oral statements or prior agreements shall have any force. This Lease may only be amended in writing, signed by both Parties.

  IN WITNESS WHEREOF, the Parties have executed this Gas Lease Agreement as of the date first written above.
  LESSOR
  Signature: ___________________________
  Name: ___________________________
  Date: ___________________________
  LESSEE
  Signature: ___________________________
  Name: ___________________________
  Date: ___________________________




  Make It Legal

  This Agreement should be signed in front of a notary public by both parties.
  Once signed in front of a notary, this document should be delivered to the appropriate court for filing.
  Copies
  The original Agreement should be filed with the Clerk of Court or delivered to the requesting business.
  The Affiant should maintain a copy of the Agreement. Your copy should be kept in a safe place. If you signed a paper copy of your document, you can use Rocket Lawyer to store and share it. Safe and secure in your Rocket Lawyer File Manager, you can access it any time from any computer, as well as share it for future reference.
  Additional Assistance
   If you are unsure or have questions regarding this Agreement or need additional assistance with special situations or circumstances, use Legal Gram. Find A Lawyer search engine to find a lawyer in your area to assist you in this matter`;

      addText(agreementText);

      // Save the PDF
      doc.save('gas-lease-agreement.pdf');
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
                <Label htmlFor="lessorName">Lessor Name</Label>
                <Input
                  id="lessorName"
                  value={formData.lessorName}
                  onChange={(e) => handleInputChange('lessorName', e.target.value)}
                  placeholder="Enter lessor's full name"
                />
              </div>
              <div>
                <Label htmlFor="lesseeName">Lessee Name</Label>
                <Input
                  id="lesseeName"
                  value={formData.lesseeName}
                  onChange={(e) => handleInputChange('lesseeName', e.target.value)}
                  placeholder="Enter lessee's full name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="lessorAddress">Lessor Address</Label>
              <Textarea
                id="lessorAddress"
                value={formData.lessorAddress}
                onChange={(e) => handleInputChange('lessorAddress', e.target.value)}
                placeholder="Enter lessor's complete address"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="lesseeAddress">Lessee Address</Label>
              <Textarea
                id="lesseeAddress"
                value={formData.lesseeAddress}
                onChange={(e) => handleInputChange('lesseeAddress', e.target.value)}
                placeholder="Enter lessee's complete address"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Step 3: Property Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="county">County</Label>
                <Input
                  id="county"
                  value={formData.county}
                  onChange={(e) => handleInputChange('county', e.target.value)}
                  placeholder="Enter county name"
                />
              </div>
              <div>
                <Label htmlFor="acreage">Acreage</Label>
                <Input
                  id="acreage"
                  value={formData.acreage}
                  onChange={(e) => handleInputChange('acreage', e.target.value)}
                  placeholder="Enter total acres"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="propertyAddress">Property Address</Label>
              <Input
                id="propertyAddress"
                value={formData.propertyAddress}
                onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                placeholder="Enter property address"
              />
            </div>

            <div>
              <Label htmlFor="legalDescription">Legal Description</Label>
              <Textarea
                id="legalDescription"
                value={formData.legalDescription}
                onChange={(e) => handleInputChange('legalDescription', e.target.value)}
                placeholder="Enter detailed legal description of the property"
                rows={4}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Step 4: Lease Terms & Financial Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="annualRental">Annual Rental ($)</Label>
                <Input
                  id="annualRental"
                  value={formData.annualRental}
                  onChange={(e) => handleInputChange('annualRental', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="leaseTerm">Lease Term (years)</Label>
                <Input
                  id="leaseTerm"
                  value={formData.leaseTerm}
                  onChange={(e) => handleInputChange('leaseTerm', e.target.value)}
                  placeholder="Enter number of years"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="oilRoyaltyPercentage">Oil Royalty (%)</Label>
                <Input
                  id="oilRoyaltyPercentage"
                  value={formData.oilRoyaltyPercentage}
                  onChange={(e) => handleInputChange('oilRoyaltyPercentage', e.target.value)}
                  placeholder="e.g., 12.5"
                />
              </div>
              <div>
                <Label htmlFor="gasRoyaltyPercentage">Gas Royalty (%)</Label>
                <Input
                  id="gasRoyaltyPercentage"
                  value={formData.gasRoyaltyPercentage}
                  onChange={(e) => handleInputChange('gasRoyaltyPercentage', e.target.value)}
                  placeholder="e.g., 12.5"
                />
              </div>
              <div>
                <Label htmlFor="casingheadGasolinePercentage">Casinghead Gasoline (%)</Label>
                <Input
                  id="casingheadGasolinePercentage"
                  value={formData.casingheadGasolinePercentage}
                  onChange={(e) => handleInputChange('casingheadGasolinePercentage', e.target.value)}
                  placeholder="e.g., 12.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentDay">Payment Day</Label>
                <Input
                  id="paymentDay"
                  value={formData.paymentDay}
                  onChange={(e) => handleInputChange('paymentDay', e.target.value)}
                  placeholder="e.g., 25th"
                />
              </div>
              <div>
                <Label htmlFor="rentalAmount">Annual Rental Amount ($)</Label>
                <Input
                  id="rentalAmount"
                  value={formData.rentalAmount}
                  onChange={(e) => handleInputChange('rentalAmount', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="offsetWellDistance">Offset Well Distance (feet)</Label>
                <Input
                  id="offsetWellDistance"
                  value={formData.offsetWellDistance}
                  onChange={(e) => handleInputChange('offsetWellDistance', e.target.value)}
                  placeholder="e.g., 1000"
                />
              </div>
              <div>
                <Label htmlFor="mineralTaxPercentage">Mineral Tax Percentage (%)</Label>
                <Input
                  id="mineralTaxPercentage"
                  value={formData.mineralTaxPercentage}
                  onChange={(e) => handleInputChange('mineralTaxPercentage', e.target.value)}
                  placeholder="e.g., 50"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (currentStep === 5) {
    return (
      <UserInfoStep
        onBack={() => setCurrentStep(4)}
        onGenerate={generatePDF}
        documentType="Gas Lease Agreement"
        isGenerating={isGeneratingPDF}
      />
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Fuel className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Gas Lease Agreement</h1>
          </div>
          <p className="text-gray-600">
            Create a comprehensive gas lease agreement for mineral rights and energy exploration
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Gas Lease Agreement Form</span>
              <span className="text-sm font-normal text-gray-500">
                Step {currentStep} of {totalSteps}
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

export default GasLeaseForm;
