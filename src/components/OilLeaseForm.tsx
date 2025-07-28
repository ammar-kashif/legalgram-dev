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
  leaseTerm: string;
  oilRoyaltyPercentage: string;
  gasRoyaltyPercentage: string;
  casingheadGasolinePercentage: string;
  paymentDay: string;
  annualRental: string;
  offsetWellDistance: string;

  // Location Selection
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
}

const OilLeaseForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
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
    leaseTerm: '',
    oilRoyaltyPercentage: '',
    gasRoyaltyPercentage: '',
    casingheadGasolinePercentage: '',
    paymentDay: '',
    annualRental: '',
    offsetWellDistance: '',
    selectedCountry: 'US',
    selectedState: '',
    selectedCity: '',
  });

  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(formData.selectedCountry);
  const cities = formData.selectedState ? City.getCitiesOfState(formData.selectedCountry, formData.selectedState) : [];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const lineHeight = 7;
    let currentY = margin;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize = 11, isBold = false, isCenter = false) => {
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont(undefined, 'bold');
      } else {
        doc.setFont(undefined, 'normal');
      }
      
      const textWidth = pageWidth - (2 * margin);
      const lines = doc.splitTextToSize(text, textWidth);
      
      lines.forEach((line: string) => {
        if (currentY > 270) {
          doc.addPage();
          currentY = margin;
        }
        
        if (isCenter) {
          const textWidth = doc.getStringUnitWidth(line) * fontSize / doc.internal.scaleFactor;
          const textX = (pageWidth - textWidth) / 2;
          doc.text(line, textX, currentY);
        } else {
          doc.text(line, margin, currentY);
        }
        currentY += lineHeight;
      });
    };

    // Title
    addText('OIL LEASE AGREEMENT', 16, true, true);
    currentY += 5;

    // Introduction
    addText(`This Oil and Gas Lease Agreement ("Agreement") is made and entered into as of ${formData.agreementDate || '[Insert Date]'}, by and between:`);
    addText(`Lessor: ${formData.lessorName || '[Insert Full Name]'}, having an address at ${formData.lessorAddress || '[Insert Full Address]'} ("Lessor"),`);
    addText('and');
    addText(`Lessee: ${formData.lesseeName || '[Insert Full Name]'}, having an address at ${formData.lesseeAddress || '[Insert Full Address]'} ("Lessee").`);
    addText('The Lessor and Lessee may be collectively referred to as the "Parties."');
    currentY += 5;

    // 1. Grant of Lease
    addText('1. Grant of Lease', 12, true);
    addText(`Lessor, for and in consideration of the sum of $0.00 and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, hereby leases and demises exclusively to Lessee the real property located in the County of ${formData.county || '[Insert County]'}, State of ${formData.state || '[Insert State]'}, with the address of ${formData.propertyAddress || '[Insert Address]'}, more particularly described as follows: ${formData.legalDescription || '[Insert Legal Description]'}, and comprising approximately ${formData.acreage || '0'} acres (the "Premises").`);
    addText('The Premises are leased solely for the purpose of exploring, drilling, mining, operating for, and extracting, storing, and removing oil, gas, hydrocarbons, and all associated substances.');
    addText(`This Lease shall remain in force for an initial term of ${formData.leaseTerm || '0'} years from the Effective Date, and shall continue thereafter so long as:`);
    addText('(a) oil, gas, or other hydrocarbon substances are being produced in paying quantities from the Premises;');
    addText('(b) drilling or reworking operations are being continuously conducted; or');
    addText('(c) the Parties mutually agree in writing to extend the Lease.');
    currentY += 3;

    // 2. Lessee's Rights
    addText('2. Lessee\'s Rights', 12, true);
    addText('Lessee shall have the exclusive right to:');
    addText('(a) Enter and occupy the Premises for oil and gas operations;');
    addText('(b) Construct, operate, maintain, and replace structures, wells, tanks, pipelines, machinery, roads, power and communication lines, and employee facilities as necessary;');
    addText('(c) Inject gas, water, or other substances into the subsurface;');
    addText('(d) Drill for and use water obtained from the Premises without cost;');
    addText('(e) Construct and operate processing plants or facilities for hydrocarbons extracted from the Premises or adjacent properties.');
    currentY += 3;

    // 3. Royalty Provisions
    addText('3. Royalty Provisions', 12, true);
    addText('3.1 Oil Royalty', 11, true);
    addText(`Lessee shall pay to Lessor a royalty of ${formData.oilRoyaltyPercentage || '[Insert Percentage]'}% of the value of all oil produced and removed from the Premises, calculated at the posted market price for oil of similar quality on the date of removal, with adjustments for temperature, water, and sediment.`);
    addText('Upon 90 days\' prior written notice, Lessor may elect to receive oil royalties in kind, delivered at no cost at the wellhead or designated pipeline.');
    addText('No royalty shall be payable on oil lost through evaporation, fire, leakage, or other casualty prior to marketing.');
    addText('3.2 Gas Royalty', 11, true);
    addText(`Lessee shall pay Lessor a royalty of ${formData.gasRoyaltyPercentage || '[Insert Percentage]'}% of the net proceeds from the sale of gas and all gaseous substances produced and sold from the Premises, after deduction of transportation and processing costs.`);
    addText('No royalty shall be payable for gas used in lease operations or for repressurization.');
    addText('3.3 Casinghead Gasoline', 11, true);
    addText(`For casinghead gasoline sold by Lessee, Lessor shall receive a royalty of ${formData.casingheadGasolinePercentage || '[Insert Percentage]'}% of the net proceeds. No royalty shall be due if casinghead gasoline is reinjected into the reservoir.`);
    addText('3.4 Use for Operations', 11, true);
    addText('Lessee shall not be required to pay royalties for oil, gas, or water produced and used for operations conducted on the Premises.');
    currentY += 3;

    // Add new page if needed
    if (currentY > 220) {
      doc.addPage();
      currentY = margin;
    }

    // 4. Royalty and Rental Payments
    addText('4. Royalty and Rental Payments', 12, true);
    addText(`All royalty payments shall be made on or before the ${formData.paymentDay || '[Insert Day]'} of each month for production during the preceding month. Payment shall be deemed made when deposited in the U.S. mail with first-class postage, addressed to the Lessor's address provided herein, or such other address as Lessor may designate in writing.`);
    currentY += 3;

    // 5. Development Clause and Annual Rentals
    addText('5. Development Clause and Annual Rentals', 12, true);
    addText(`Lessee has paid the full rental for the primary term of this Lease. If Lessee has not commenced drilling operations by the expiration of the primary term, the Lease may continue by payment of an annual rental of $${formData.annualRental || '0.00'} until such operations begin or the Lease is terminated.`);
    currentY += 3;

    // 6. Offset Well Obligations
    addText('6. Offset Well Obligations', 12, true);
    addText(`If hydrocarbons are discovered in paying quantities in any well drilled within ${formData.offsetWellDistance || '0'} feet of the boundary of the Premises, Lessee shall, within a reasonable period, commence drilling an offset well on the Premises, provided:`);
    addText('(a) Production from the adjacent well continues beyond a 30-day test period; and');
    addText('(b) Lessee has not fulfilled its development obligations.');
    currentY += 3;

    // Continue with remaining sections...
    const remainingSections = [
      {
        title: '7. Operational Standards',
        content: 'All operations shall be conducted by Lessee at its own expense in a good and workmanlike manner, in compliance with all applicable federal, state, and local laws, rules, and regulations. Lessee shall not allow any liens to be placed on the Premises arising from its operations.'
      },
      {
        title: '8. Taxes',
        content: 'Lessee shall pay all taxes on equipment, improvements, and stored oil or gas installed or produced by it. Lessor shall be responsible for property taxes on the surface and for any portion of mineral taxes not specifically assigned to Lessee.'
      },
      {
        title: '9. Surface Use by Lessor',
        content: 'Lessor retains the right to use the surface of the Premises for agricultural and other lawful purposes, provided such use does not interfere with Lessee\'s rights under this Lease.'
      },
      {
        title: '10. Default and Remedies',
        content: 'If Lessee fails to pay any due rental or royalty, or breaches any material obligation under this Lease, and fails to cure the default within fifteen (15) days after receiving written notice from Lessor, then Lessor may terminate this Lease. However, Lessee shall retain rights to any well in production or under active drilling, including the surrounding one (1) acre and necessary rights-of-way.'
      },
      {
        title: '11. Termination and Surrender',
        content: 'Upon expiration or termination of this Lease, Lessee shall peaceably surrender possession of the Premises and restore the property to a reasonably original condition, accounting for ordinary wear and tear. Lessee shall have the right to remove its equipment and facilities.'
      },
      {
        title: '12. Assignment',
        content: 'Either party may assign its interest under this Lease, provided written notice is given to the other party. No assignment shall increase the burden or obligations of the non-assigning party without its express written consent.'
      },
      {
        title: '13. Notices',
        content: 'All notices under this Lease shall be in writing and shall be deemed properly delivered if personally delivered or sent via certified mail, return receipt requested, to the Parties at the addresses stated above, or any updated address notified in writing.'
      },
      {
        title: '14. Binding Effect',
        content: 'This Lease shall be binding upon and inure to the benefit of the Parties and their respective heirs, personal representatives, successors, and assigns.'
      },
      {
        title: '15. Attorneys\' Fees',
        content: 'If any dispute arises from this Lease, the prevailing party shall be entitled to recover its reasonable attorneys\' fees and court costs as awarded by a court of competent jurisdiction.'
      },
      {
        title: '16. Entire Agreement',
        content: 'This Lease represents the entire agreement between the Parties regarding the subject matter herein and supersedes all prior agreements or representations, whether oral or written. No amendment or modification shall be valid unless made in writing and signed by both Parties.'
      }
    ];

    remainingSections.forEach(section => {
      if (currentY > 250) {
        doc.addPage();
        currentY = margin;
      }
      addText(section.title, 12, true);
      addText(section.content);
      currentY += 3;
    });

    // Add new page for signatures
    if (currentY > 200) {
      doc.addPage();
      currentY = margin;
    }

    // Execution section
    addText('IN WITNESS WHEREOF, the Parties have executed this Lease Agreement as of the date first above written.');
    currentY += 10;

    addText('LESSOR:');
    currentY += 10;
    addText('Signature: ___________________________');
    addText('Name: ______________________________');
    addText('Date: _______________________________');
    currentY += 10;

    addText('LESSEE:');
    currentY += 10;
    addText('Signature: ___________________________');
    addText('Name: ______________________________');
    addText('Date: _______________________________');
    currentY += 15;

    // Legal information section
    doc.addPage();
    currentY = margin;

    addText('Make It Legal', 14, true, true);
    currentY += 10;

    addText('This Agreement should be signed in front of a notary public by both parties.');
    addText('Once signed in front of a notary, this document should be delivered to the appropriate court for filing.');
    currentY += 5;

    addText('Copies', 12, true);
    addText('The original Agreement should be filed with the Clerk of Court or delivered to the requesting business.');
    addText('The parties should maintain a copy of the Agreement. Your copy should be kept in a safe place. If you signed a paper copy of your document, you can use Rocket Lawyer to store and share it. Safe and secure in your Rocket Lawyer File Manager, you can access it any time from any computer, as well as share it for future reference.');
    currentY += 5;

    addText('Additional Assistance', 12, true);
    addText('If you are unsure or have questions regarding this Agreement or need additional assistance with special situations or circumstances, use Legal Gram. Find A Lawyer search engine to find a lawyer in your area to assist you in this matter.');

    // Save the PDF
    doc.save('oil-lease-agreement.pdf');
    toast.success("Oil Lease Agreement PDF generated successfully!");
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error("Failed to generate document");
  } finally {
    setIsGeneratingPDF(false);
  }
};

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="w-5 h-5" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={formData.selectedCountry} onValueChange={(value) => handleInputChange('selectedCountry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
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

              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Select value={formData.selectedState} onValueChange={(value) => {
                  handleInputChange('selectedState', value);
                  const selectedStateObj = states.find(s => s.isoCode === value);
                  if (selectedStateObj) {
                    handleInputChange('state', selectedStateObj.name);
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
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

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select value={formData.selectedCity} onValueChange={(value) => handleInputChange('selectedCity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
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

              <div className="space-y-2">
                <Label htmlFor="county">County</Label>
                <Input
                  id="county"
                  value={formData.county}
                  onChange={(e) => handleInputChange('county', e.target.value)}
                  placeholder="Enter county name"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Agreement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agreementDate">Agreement Date</Label>
                <Input
                  id="agreementDate"
                  type="date"
                  value={formData.agreementDate}
                  onChange={(e) => handleInputChange('agreementDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lessorName">Lessor's Full Name</Label>
                <Input
                  id="lessorName"
                  value={formData.lessorName}
                  onChange={(e) => handleInputChange('lessorName', e.target.value)}
                  placeholder="Enter lessor's full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lessorAddress">Lessor's Address</Label>
                <Textarea
                  id="lessorAddress"
                  value={formData.lessorAddress}
                  onChange={(e) => handleInputChange('lessorAddress', e.target.value)}
                  placeholder="Enter lessor's full address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lesseeName">Lessee's Full Name</Label>
                <Input
                  id="lesseeName"
                  value={formData.lesseeName}
                  onChange={(e) => handleInputChange('lesseeName', e.target.value)}
                  placeholder="Enter lessee's full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lesseeAddress">Lessee's Address</Label>
                <Textarea
                  id="lesseeAddress"
                  value={formData.lesseeAddress}
                  onChange={(e) => handleInputChange('lesseeAddress', e.target.value)}
                  placeholder="Enter lessee's full address"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="propertyAddress">Property Address</Label>
                <Input
                  id="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                  placeholder="Enter property address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalDescription">Legal Description</Label>
                <Textarea
                  id="legalDescription"
                  value={formData.legalDescription}
                  onChange={(e) => handleInputChange('legalDescription', e.target.value)}
                  placeholder="Enter legal description of the property"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="acreage">Acreage</Label>
                  <Input
                    id="acreage"
                    value={formData.acreage}
                    onChange={(e) => handleInputChange('acreage', e.target.value)}
                    placeholder="Enter number of acres"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leaseTerm">Lease Term (years)</Label>
                  <Input
                    id="leaseTerm"
                    value={formData.leaseTerm}
                    onChange={(e) => handleInputChange('leaseTerm', e.target.value)}
                    placeholder="Enter lease term in years"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="offsetWellDistance">Offset Well Distance (feet)</Label>
                <Input
                  id="offsetWellDistance"
                  value={formData.offsetWellDistance}
                  onChange={(e) => handleInputChange('offsetWellDistance', e.target.value)}
                  placeholder="Enter distance in feet"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Royalty & Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="oilRoyaltyPercentage">Oil Royalty (%)</Label>
                  <Input
                    id="oilRoyaltyPercentage"
                    value={formData.oilRoyaltyPercentage}
                    onChange={(e) => handleInputChange('oilRoyaltyPercentage', e.target.value)}
                    placeholder="e.g., 12.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gasRoyaltyPercentage">Gas Royalty (%)</Label>
                  <Input
                    id="gasRoyaltyPercentage"
                    value={formData.gasRoyaltyPercentage}
                    onChange={(e) => handleInputChange('gasRoyaltyPercentage', e.target.value)}
                    placeholder="e.g., 12.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="casingheadGasolinePercentage">Casinghead Gasoline Royalty (%)</Label>
                  <Input
                    id="casingheadGasolinePercentage"
                    value={formData.casingheadGasolinePercentage}
                    onChange={(e) => handleInputChange('casingheadGasolinePercentage', e.target.value)}
                    placeholder="e.g., 12.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentDay">Payment Day of Month</Label>
                  <Input
                    id="paymentDay"
                    value={formData.paymentDay}
                    onChange={(e) => handleInputChange('paymentDay', e.target.value)}
                    placeholder="e.g., 25th"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualRental">Annual Rental Amount ($)</Label>
                  <Input
                    id="annualRental"
                    value={formData.annualRental}
                    onChange={(e) => handleInputChange('annualRental', e.target.value)}
                    placeholder="Enter annual rental amount"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <UserInfoStep
            onBack={prevStep}
            onGenerate={generatePDF}
            documentType="Oil Lease Agreement"
            isGenerating={isGeneratingPDF}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Oil Lease Agreement</h1>
        <p className="text-gray-600">
          Create a comprehensive oil and gas lease agreement for mineral rights and hydrocarbon extraction
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-gray-700">
            Step {currentStep} of 5
          </div>
          <div className="text-sm text-gray-500">
            {currentStep === 1 && "Location Information"}
            {currentStep === 2 && "Agreement Details"}
            {currentStep === 3 && "Property Details"}
            {currentStep === 4 && "Royalty & Payment Terms"}
            {currentStep === 5 && "User Information"}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {renderStep()}

      {currentStep !== 5 && (
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentStep < 4 ? (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OilLeaseForm;
