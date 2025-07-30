import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Download, ArrowRight, ArrowLeft } from "lucide-react";
import { Country, State, City } from 'country-state-city';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import UserInfoStep from "@/components/UserInfoStep";

interface FormData {
  // Agreement Date and Parties
  agreementDate: string;
  landlordName: string;
  landlordAddress: string;
  tenantName: string;
  tenantAddress: string;

  // Property Details
  legalDescription: string;
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;

  // Lease Terms
  startDate: string;
  endDate: string;
  monthlyRent: string;
  paymentAddress: string;
  securityDeposit: string;

  // Tenant Obligations
  tenantSpecificObligations: string;

  // Default and Late Payment Terms
  financialDefaultDays: string;
  otherBreachDays: string;
  lateFeeGracePeriod: string;
  lateFeeAmount: string;

  // Notices
  landlordNoticeAddress: string;
  tenantNoticeAddress: string;

  // Governing Law
  governingState: string;
}

const WarehouseLeaseForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [formData, setFormData] = useState<FormData>({
    agreementDate: '',
    landlordName: '',
    landlordAddress: '',
    tenantName: '',
    tenantAddress: '',
    legalDescription: '',
    propertyAddress: '',
    city: '',
    state: '',
    zipCode: '',
    startDate: '',
    endDate: '',
    monthlyRent: '',
    paymentAddress: '',
    securityDeposit: '',
    tenantSpecificObligations: '',
    financialDefaultDays: '30',
    otherBreachDays: '30',
    lateFeeGracePeriod: '5',
    lateFeeAmount: '',
    landlordNoticeAddress: '',
    tenantNoticeAddress: '',
    governingState: '',
  });

  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(selectedCountry);
  const cities = selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : [];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePDF = async (userInfo?: { name: string; email: string; phone: string }) => {
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
    addText('WAREHOUSE LEASE AGREEMENT', 16, true, true);
    currentY += 5;

    // Introduction
    addText(`This Warehouse Lease Agreement ("Agreement") is entered into on ${formData.agreementDate || '[Insert Date]'}, by and between`);
    addText(`${formData.landlordName || '[Insert Landlord\'s Full Name and Address]'} ("Landlord"),`);
    addText('And');
    addText(`${formData.tenantName || '[Insert Tenant\'s Full Name and Address]'} ("Tenant").`);
    addText('Collectively, the Landlord and Tenant shall be referred to as the "Parties."');
    currentY += 5;

    // 1. Leased Premises
    addText('1. Leased Premises', 12, true);
    addText(`Landlord hereby leases to Tenant the property described as ${formData.legalDescription || '[Insert Legal Description]'}, located at ${formData.propertyAddress || '[Insert Address]'}, ${formData.city || '[City]'}, ${formData.state || '[State]'} ${formData.zipCode || '[Zip Code]'} (the "Leased Premises" or "Premises"), for the term and under the terms set forth in this Agreement.`);
    currentY += 3;

    // 2. Lease Term
    addText('2. Lease Term', 12, true);
    addText(`The term of this Lease shall commence on ${formData.startDate || '[Insert Start Date]'} and shall expire on ${formData.endDate || '[Insert End Date]'}, unless earlier terminated in accordance with this Agreement.`);
    currentY += 3;

    // 3. Rental Payments
    addText('3. Rental Payments', 12, true);
    addText(`Tenant agrees to pay to Landlord a monthly rent of $${formData.monthlyRent || '[Insert Amount]'}, payable in advance on or before the first day of each calendar month. Payments shall be made to Landlord at ${formData.paymentAddress || '[Insert Payment Address]'}, or such other address as the Landlord may later designate in writing.`);
    currentY += 3;

    // 4. Security Deposit
    addText('4. Security Deposit', 12, true);
    addText(`Upon execution of this Lease, Tenant shall pay to Landlord a security deposit of $${formData.securityDeposit || '[Insert Amount]'}, to be held in trust by Landlord as security for Tenant's performance of all obligations under this Lease and for the cost of remedying any damages caused to the Premises, beyond reasonable wear and tear.`);
    currentY += 3;

    // 5. Possession and Surrender
    addText('5. Possession and Surrender', 12, true);
    addText('Tenant shall be entitled to possession of the Premises on the Lease commencement date and shall surrender possession at the expiration or earlier termination of the Lease. Tenant agrees to return the Premises in good condition, ordinary wear and tear excepted.');
    currentY += 3;

    // 6. Permitted Use
    addText('6. Permitted Use', 12, true);
    addText('Tenant may use the Premises solely for warehousing, distribution, light industrial activities, and other lawful uses incidental thereto, subject to Landlord\'s written approval for any additional uses, which approval shall not be unreasonably withheld.');
    currentY += 3;

    // 7. Condition of Premises
    addText('7. Condition of Premises', 12, true);
    addText('Tenant acknowledges that it has inspected the Premises or had the opportunity to do so and accepts the Premises in its present "as-is" condition. If the condition of the Premises deteriorates during the Lease term in a manner that materially impairs its use or value, Tenant shall promptly notify Landlord in writing.');
    currentY += 3;

    // 8. Insurance Obligations
    addText('8. Insurance Obligations', 12, true);
    addText('Each party shall maintain insurance appropriate to its interest in the Premises and any personal property located therein. Tenant shall not permit any use that would invalidate such coverage. Proof of insurance shall be provided to the other party upon request.');
    currentY += 3;

    // 9. Maintenance and Repairs
    addText('9. Maintenance and Repairs', 12, true);
    addText(`Landlord shall maintain the Premises in a condition suitable for occupancy, including structural elements, roof, and common areas. Tenant shall be responsible for maintaining and repairing any damage caused by its operations or personnel. Tenant shall also be responsible for: ${formData.tenantSpecificObligations || '[Insert specific obligations, e.g., HVAC, lighting fixtures, etc.]'}.`);
    currentY += 3;

    // 10. Utilities and Services
    addText('10. Utilities and Services', 12, true);
    addText('Landlord shall be responsible for the cost of all utilities and services unless otherwise specified in writing. Tenant shall not cause unreasonable usage or burden on such services.');
    currentY += 3;

    // 11. Real Estate Taxes
    addText('11. Real Estate Taxes', 12, true);
    addText('Landlord shall be solely responsible for the payment of all real estate taxes, assessments, and charges levied against the Premises.');
    currentY += 3;

    // 12. Termination Due to Sale
    addText('12. Termination Due to Sale', 12, true);
    addText('Landlord may terminate this Lease by providing sixty (60) days\' written notice in the event the Premises are sold to a third party.');
    currentY += 3;

    // 13. Casualty or Condemnation
    addText('13. Casualty or Condemnation', 12, true);
    addText('In the event the Premises are damaged or destroyed, Landlord may elect to repair the damage or terminate this Lease upon thirty (30) days\' written notice. In the case of condemnation or if repair is not feasible, either party may terminate this Lease by providing twenty (20) days\' written notice.');
    currentY += 3;

    // 14. Tenant Default
    addText('14. Tenant Default', 12, true);
    addText(`Tenant shall be in default if it fails to comply with any material term of this Lease. Tenant shall have ${formData.financialDefaultDays || '[Insert Number]'} days to cure a financial default and ${formData.otherBreachDays || '[Insert Number]'} days to cure any other breach after receipt of written notice. If the default is not cured, Landlord may pursue legal remedies, including recovery of costs and attorney's fees.`);
    currentY += 3;

    // 15. Late Payments
    addText('15. Late Payments', 12, true);
    addText(`For any rental payment not received within ${formData.lateFeeGracePeriod || '[Insert Number]'} days of the due date, Tenant shall pay a late fee of $${formData.lateFeeAmount || '[Insert Amount]'}.`);
    currentY += 3;

    // Continue with remaining sections...
    // 16. Holdover
    addText('16. Holdover', 12, true);
    addText('If Tenant remains in possession after Lease termination without written consent, Tenant shall pay rent at 150% of the prior monthly rent and such occupancy shall convert to a month-to-month tenancy.');
    currentY += 3;

    // Add new page if needed
    if (currentY > 220) {
      doc.addPage();
      currentY = margin;
    }

    // Continue with remaining sections...
    const remainingSections = [
      {
        title: '17. Returned Payments',
        content: 'Tenant shall be charged the maximum amount permitted by law for any payment returned due to insufficient funds.'
      },
      {
        title: '18. Improvements and Alterations',
        content: 'Tenant shall not undertake any alterations, construction, or remodeling without prior written approval of Landlord, which shall not be unreasonably withheld. Any improvements shall be at Tenant\'s expense. Upon termination, Tenant shall remove any such improvements if requested by Landlord and restore the Premises to its prior condition.'
      },
      {
        title: '19. Access by Landlord',
        content: 'Landlord may enter the Premises upon reasonable notice and during business hours for inspections, maintenance, or to show the property. In case of emergency, Landlord may enter without notice. During the final 90 days of the Lease, Landlord may display "For Lease" signs and show the Premises to prospective tenants.'
      },
      {
        title: '20. Prohibited Items and Hazardous Materials',
        content: 'Tenant shall not keep flammable, hazardous, or explosive materials on the Premises without Landlord\'s prior written consent and proof of adequate insurance.'
      },
      {
        title: '21. Mechanics\' Liens',
        content: 'Tenant shall not permit any liens to be filed against the Premises arising from any work performed or materials provided at Tenant\'s request. Tenant shall promptly discharge any lien filed.'
      },
      {
        title: '22. Subordination',
        content: 'This Lease is and shall be subordinate to any current or future mortgage placed on the Premises by Landlord.'
      },
      {
        title: '23. Assignment and Subletting',
        content: 'Tenant shall not assign this Lease, sublet the Premises, or allow third-party use without Landlord\'s prior written consent. Unauthorized transfers shall be voidable at Landlord\'s option.'
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

    // Add new page for remaining sections
    if (currentY > 200) {
      doc.addPage();
      currentY = margin;
    }

    // 24. Notice
    addText('24. Notice', 12, true);
    addText('All notices required under this Lease shall be in writing and delivered via personal service or certified mail to the addresses stated below, or any updated address provided in writing:');
    addText('Landlord:');
    addText(`${formData.landlordNoticeAddress || '[Insert Full Address]'}`);
    addText('Tenant:');
    addText(`${formData.tenantNoticeAddress || '[Insert Full Address]'}`);
    addText('Notices shall be deemed received three (3) business days after mailing.');
    currentY += 3;

    // Remaining sections
    const finalSections = [
      {
        title: '25. Governing Law',
        content: `This Lease shall be governed by and construed in accordance with the laws of the State of ${formData.governingState || '[Insert State]'}.`
      },
      {
        title: '26. Entire Agreement',
        content: 'This document constitutes the entire agreement between the Parties with respect to the subject matter hereof. No oral statements or prior writings shall be binding unless incorporated herein.'
      },
      {
        title: '27. Amendments',
        content: 'Any amendments to this Lease must be in writing and signed by both Parties.'
      },
      {
        title: '28. Severability',
        content: 'If any provision of this Lease is found invalid or unenforceable, the remainder shall remain in full force and effect. If such invalidity can be cured by limiting the clause, it shall be construed accordingly.'
      },
      {
        title: '29. Waiver',
        content: 'Failure by either Party to enforce any provision shall not constitute a waiver of such provision or the right to enforce it in the future.'
      },
      {
        title: '30. Binding Effect',
        content: 'This Lease shall be binding upon and inure to the benefit of the Parties and their respective heirs, successors, and permitted assigns.'
      }
    ];

    finalSections.forEach(section => {
      if (currentY > 250) {
        doc.addPage();
        currentY = margin;
      }
      addText(section.title, 12, true);
      addText(section.content);
      currentY += 3;
    });

    // Add new page for execution section
    if (currentY > 200) {
      doc.addPage();
      currentY = margin;
    }

    // 31. Execution
    addText('31. Execution', 12, true);
    addText('IN WITNESS WHEREOF, the Parties have executed this Warehouse Lease Agreement as of the date first above written.');
    currentY += 10;

    addText('LANDLORD');
    currentY += 10;
    addText('Signature: ___________________________');
    addText('Name: ___________________________');
    addText('Date: ___________________________');
    currentY += 10;

    addText('TENANT');
    currentY += 10;
    addText('Signature: ___________________________');
    addText('Name: ___________________________');
    addText('Date: ___________________________');
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
    doc.save('warehouse-lease-agreement.pdf');
    toast.success("Warehouse Lease Agreement PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Warehouse Lease Agreement");
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
                <Building2 className="w-5 h-5" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
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
                <Select value={selectedState} onValueChange={(value) => {
                  setSelectedState(value);
                  handleInputChange('state', value);
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
                <Select value={selectedCity} onValueChange={(value) => {
                  setSelectedCity(value);
                  handleInputChange('city', value);
                }}>
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
                <Label htmlFor="governingState">Governing State (for legal jurisdiction)</Label>
                <Select value={formData.governingState} onValueChange={(value) => handleInputChange('governingState', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select governing state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.isoCode} value={state.name}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label htmlFor="landlordName">Landlord's Full Name and Address</Label>
                <Textarea
                  id="landlordName"
                  value={formData.landlordName}
                  onChange={(e) => handleInputChange('landlordName', e.target.value)}
                  placeholder="Enter landlord's full name and address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenantName">Tenant's Full Name and Address</Label>
                <Textarea
                  id="tenantName"
                  value={formData.tenantName}
                  onChange={(e) => handleInputChange('tenantName', e.target.value)}
                  placeholder="Enter tenant's full name and address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalDescription">Legal Description of Property</Label>
                <Textarea
                  id="legalDescription"
                  value={formData.legalDescription}
                  onChange={(e) => handleInputChange('legalDescription', e.target.value)}
                  placeholder="Enter legal description of the property"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyAddress">Property Address</Label>
                <Input
                  id="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                  placeholder="Enter property street address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="Enter zip code"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Lease Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Lease Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Lease End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyRent">Monthly Rent Amount ($)</Label>
                  <Input
                    id="monthlyRent"
                    value={formData.monthlyRent}
                    onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                    placeholder="Enter monthly rent amount"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="securityDeposit">Security Deposit Amount ($)</Label>
                  <Input
                    id="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                    placeholder="Enter security deposit amount"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentAddress">Payment Address</Label>
                <Textarea
                  id="paymentAddress"
                  value={formData.paymentAddress}
                  onChange={(e) => handleInputChange('paymentAddress', e.target.value)}
                  placeholder="Enter address where rent payments should be sent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenantSpecificObligations">Tenant's Specific Maintenance Obligations</Label>
                <Textarea
                  id="tenantSpecificObligations"
                  value={formData.tenantSpecificObligations}
                  onChange={(e) => handleInputChange('tenantSpecificObligations', e.target.value)}
                  placeholder="e.g., HVAC maintenance, lighting fixtures, floor cleaning, etc."
                />
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Default Terms & Notice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="financialDefaultDays">Days to Cure Financial Default</Label>
                  <Input
                    id="financialDefaultDays"
                    value={formData.financialDefaultDays}
                    onChange={(e) => handleInputChange('financialDefaultDays', e.target.value)}
                    placeholder="e.g., 30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherBreachDays">Days to Cure Other Breaches</Label>
                  <Input
                    id="otherBreachDays"
                    value={formData.otherBreachDays}
                    onChange={(e) => handleInputChange('otherBreachDays', e.target.value)}
                    placeholder="e.g., 30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lateFeeGracePeriod">Late Fee Grace Period (days)</Label>
                  <Input
                    id="lateFeeGracePeriod"
                    value={formData.lateFeeGracePeriod}
                    onChange={(e) => handleInputChange('lateFeeGracePeriod', e.target.value)}
                    placeholder="e.g., 5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lateFeeAmount">Late Fee Amount ($)</Label>
                  <Input
                    id="lateFeeAmount"
                    value={formData.lateFeeAmount}
                    onChange={(e) => handleInputChange('lateFeeAmount', e.target.value)}
                    placeholder="Enter late fee amount"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landlordNoticeAddress">Landlord's Notice Address</Label>
                <Textarea
                  id="landlordNoticeAddress"
                  value={formData.landlordNoticeAddress}
                  onChange={(e) => handleInputChange('landlordNoticeAddress', e.target.value)}
                  placeholder="Enter full address for sending notices to landlord"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenantNoticeAddress">Tenant's Notice Address</Label>
                <Textarea
                  id="tenantNoticeAddress"
                  value={formData.tenantNoticeAddress}
                  onChange={(e) => handleInputChange('tenantNoticeAddress', e.target.value)}
                  placeholder="Enter full address for sending notices to tenant"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <UserInfoStep
            onGenerate={generatePDF}
            onBack={prevStep}
            isGenerating={isGeneratingPDF}
            documentType="Warehouse Lease Agreement"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Warehouse Lease Agreement</h1>
        <p className="text-gray-600">
          Create a comprehensive warehouse lease agreement for commercial storage and distribution spaces
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
            {currentStep === 3 && "Lease Terms"}
            {currentStep === 4 && "Default Terms & Notices"}
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
            {currentStep < 5 ? (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseLeaseForm;
