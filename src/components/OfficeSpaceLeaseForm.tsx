import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import jsPDF from 'jspdf';
import { Country, State, City } from 'country-state-city';
import UserInfoStep from "@/components/UserInfoStep";
import { toast } from 'sonner';

interface FormData {
  // Location
  country: string;
  state: string;
  city: string;
  
  // Date and Parties
  leaseDate: string;
  landlordName: string;
  tenantName: string;
  
  // Premises Details
  spaceDescription: string;
  streetAddress: string;
  zipCode: string;
  legalDescription: string;
  
  // Term Details
  startDate: string;
  endDate: string;
  
  // Financial Terms
  monthlyRent: string;
  paymentAddress: string;
  securityDeposit: string;
  
  // Property Details
  furnishings: string;
  parkingSpaces: string;
  storageLocation: string;
  
  // Insurance
  liabilityAmount: string;
  
  // Renewal Terms
  renewalTerm: string;
  renewalNotice: string;
  renewalRent: string;
  
  // Termination and Other Terms
  saleNotice: string;
  repairCostLimit: string;
  lateFeeDays: string;
  lateFeeAmount: string;
  nsfFee: string;
  
  // Addresses for Notices
  landlordNoticeAddress: string;
  tenantNoticeAddress: string;
}

const OfficeSpaceLeaseForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    country: '',
    state: '',
    city: '',
    leaseDate: '',
    landlordName: '',
    tenantName: '',
    spaceDescription: '',
    streetAddress: '',
    zipCode: '',
    legalDescription: '',
    startDate: '',
    endDate: '',
    monthlyRent: '',
    paymentAddress: '',
    securityDeposit: '',
    furnishings: '',
    parkingSpaces: '',
    storageLocation: '',
    liabilityAmount: '',
    renewalTerm: '',
    renewalNotice: '',
    renewalRent: '',
    saleNotice: '',
    repairCostLimit: '',
    lateFeeDays: '',
    lateFeeAmount: '',
    nsfFee: '',
    landlordNoticeAddress: '',
    tenantNoticeAddress: ''
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const countries = Country.getAllCountries();
  const states = formData.country ? State.getStatesOfCountry(formData.country) : [];
  const cities = formData.state ? City.getCitiesOfState(formData.country, formData.state) : [];

  const totalSteps = 6;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5) {
      setCurrentStep(6); // User info step
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = 30;

      // Helper function to add text with word wrapping
      const addText = (text: string, fontSize = 10, isBold = false) => {
        doc.setFontSize(fontSize);
        if (isBold) {
          doc.setFont(undefined, 'bold');
        } else {
          doc.setFont(undefined, 'normal');
        }
        
        const lines = doc.splitTextToSize(text, maxWidth);
        
        // Check if we need a new page
        if (yPosition + (lines.length * fontSize * 0.5) > doc.internal.pageSize.height - margin) {
          doc.addPage();
          yPosition = margin;
        }
        
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * fontSize * 0.5 + 3;
      };

      // Title
      addText('OFFICE SPACE LEASE AGREEMENT', 16, true);
      yPosition += 10;

      // Generate the legal document text with filled values
      const legalText = `This Lease Agreement ("Lease") is made and entered into as of ${formData.leaseDate || '[Insert Date]'}, by and between ${formData.landlordName || '[Insert Landlord\'s Full Legal Name]'}, hereinafter referred to as the "Landlord," 
And
${formData.tenantName || '[Insert Tenant\'s Full Legal Name]'}, hereinafter referred to as the "Tenant" (collectively, the "Parties").

1. Premises
Landlord hereby leases to Tenant the office space known as ${formData.spaceDescription || '[Insert Description of Space]'} (the "Premises"), located at ${formData.streetAddress || '[Street Address]'}, ${formData.city || '[City]'}, ${formData.state || '[State]'}, ${formData.zipCode || '[Zip Code]'}.

2. Legal Description
The Premises are further legally described as:
${formData.legalDescription || '[Insert Legal Description]'}.

3. Term
The term of this Lease shall commence on ${formData.startDate || '[Insert Start Date]'} and shall terminate on ${formData.endDate || '[Insert End Date]'}, unless earlier terminated in accordance with this Lease.

4. Lease Payments
Tenant agrees to pay to Landlord monthly rent in the amount of $${formData.monthlyRent || '0.00'}, payable in advance on the first (1st) day of each calendar month. All payments shall be made to Landlord at ${formData.paymentAddress || '[Insert Payment Address]'}, or at such other address as Landlord may designate in writing.

5. Security Deposit
Upon execution of this Lease, Tenant shall pay to Landlord a security deposit of $${formData.securityDeposit || '0.00'}, to be held in trust as security for any damage to the Premises or other obligations under this Lease, subject to applicable law.

6. Possession
Tenant shall be entitled to possession of the Premises on the Lease commencement date and shall vacate the Premises on the expiration date. Upon vacating, Tenant shall return the Premises in as good condition as when received, ordinary wear and tear excepted. By taking possession, Tenant affirms the Premises are in satisfactory and acceptable condition.

7. Furnishings
The following furnishings will be provided: ${formData.furnishings || '[List Furnishings]'}. Tenant shall return all such items in good condition, reasonable wear and tear excepted, at the end of the Lease term.

8. Parking
Tenant shall be entitled to use ${formData.parkingSpaces || '0'} designated parking space(s) for the use of its employees, customers, and invitees.

9. Storage
Tenant may store personal property in ${formData.storageLocation || '[Insert Storage Location]'} during the Lease term. Landlord shall not be liable for any loss or damage to stored items.

10. Property Insurance
Both Parties shall maintain appropriate insurance on their respective interests in the Premises. Landlord shall be named as an additional insured on Tenant's policies. Proof of insurance coverage shall be provided to Landlord. Tenant shall also maintain casualty insurance on its own property.

11. Liability Insurance
Tenant shall maintain general liability insurance covering the Premises in an aggregate amount not less than $${formData.liabilityAmount || '0.00'}. Certificates of insurance shall be provided to Landlord, who shall be entitled to advance written notice of policy termination.

12. Renewal Terms
This Lease shall automatically renew for successive terms of ${formData.renewalTerm || '[Insert Renewal Term Duration]'}, unless either party gives written notice of non-renewal at least ${formData.renewalNotice || '[Insert Days]'} days before the end of the current term. During any renewal term, rent shall be ${formData.renewalRent || '[Insert Amount and Frequency]'}.

13. Maintenance
Landlord shall be responsible for maintaining the Premises in a safe and tenantable condition, except where damage results from Tenant's misuse or neglect.

14. Utilities and Services
Tenant shall be solely responsible for all utility and service charges incurred in connection with the Premises during the Lease term.

15. Common Areas
Landlord shall provide access to and maintain common areas (including parking) of the building. Use of these areas shall be non-exclusive and subject to rules and regulations established and amended by Landlord. Tenant shall comply with all such rules.

16. Pest Control
Tenant shall, at its own expense, arrange regular pest and vermin control, especially in areas used for food handling or waste disposal.

17. Janitorial Services
Tenant shall provide regular janitorial service to the Premises at its own expense.

18. Covenant Against Waste
Tenant agrees not to commit or permit any waste or damage to the Premises. Tenant shall be responsible for maintaining cleanliness and ensuring waste and sewerage systems remain unobstructed.

19. Taxes
Landlord shall be responsible for all personal property taxes and any sales or use taxes related to Tenant's use of the Premises.

20. Termination Upon Sale
Notwithstanding any provision to the contrary, Landlord may terminate this Lease upon giving ${formData.saleNotice || '[Insert Days]'} days' written notice if the Premises are sold.

21. Destruction or Condemnation
If the Premises are damaged or condemned such that Tenant cannot reasonably use them, and repairs are not feasible within sixty (60) days, or cost exceeds $${formData.repairCostLimit || '0.00'}, either party may terminate the Lease with written notice.

22. Defaults
Tenant shall be in default if it fails to comply with any Lease obligation and does not cure the default within:
5 days for financial obligations;
10 days for non-financial obligations after written notice.
Landlord may enter and take possession, subject to law, and recover damages. Any costs incurred in enforcing this Lease shall be reimbursed by Tenant, including attorney fees.

23. Late Payments
If any rent or other amount due is not paid within ${formData.lateFeeDays || '[Insert Days]'} days of its due date, a late fee of $${formData.lateFeeAmount || '0.00'} shall be payable by Tenant.

24. Holdover
If Tenant remains in possession beyond the Lease term without Landlord's written consent, Tenant shall pay rent at the same rate as under the last renewal period.

25. Cumulative Rights
All rights and remedies under this Lease shall be cumulative and not exclusive of any rights available at law or in equity.

26. Non-Sufficient Funds
Tenant shall be charged $${formData.nsfFee || '0.00'} for any check returned due to insufficient funds.

27. Governing Law
This Lease shall be governed by and construed in accordance with the laws of the State of ${formData.state || '[Insert State]'}.

28. Entire Agreement & Amendments
This Lease contains the entire agreement between the Parties regarding the Premises. No modifications shall be valid unless in writing and signed by both Parties.

29. Severability
If any provision of this Lease is held unenforceable, the remaining provisions shall continue in full force and effect.

30. Waiver
The failure of either Party to enforce any term of this Lease shall not constitute a waiver of future enforcement of that or any other term.

31. Binding Effect
This Lease shall bind and benefit the Parties and their respective successors, assigns, heirs, and legal representatives.

32. Signatures & Notices
All notices under this Lease must be in writing and delivered personally or by certified mail to the following addresses (or any updated address provided in writing):
Landlord:
${formData.landlordName || '[Insert Name]'}
${formData.landlordNoticeAddress || '[Insert Address]'}
Tenant:
${formData.tenantName || '[Insert Name]'}
${formData.tenantNoticeAddress || '[Insert Address]'}

IN WITNESS WHEREOF, the parties have executed this Lease as of the date first written above.
LANDLORD:
Signature: _________________________
Name: ${formData.landlordName || '[Insert Name]'}
Date: ____________________________
TENANT:
Signature: _________________________
Name: ${formData.tenantName || '[Insert Name]'}
Date: ____________________________

Make It Legal

This Agreement should be signed in front of a notary public.
Once signed in front of a notary, this document should be delivered to the appropriate court for filing.
Copies
The original Agreement should be filed with the Clerk of Court or delivered to the requesting business.
The Affiant should maintain a copy of the Agreement. Your copy should be kept in a safe place.
Additional Assistance
If you are unsure or have questions regarding this Agreement or need additional assistance with special situations or circumstances, use Legal Gram. Find A Lawyer search engine to find a lawyer in your area to assist you in this matter.`;

      addText(legalText);

      // Save the PDF
      doc.save('office-space-lease-agreement.pdf');
      toast.success("Document generated successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate document");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Location Information</h2>
              <p className="text-muted-foreground">Select the country, state, and city for the lease agreement</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
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

              <div>
                <Label htmlFor="state">State/Province *</Label>
                <Select 
                  value={formData.state} 
                  onValueChange={(value) => handleInputChange('state', value)}
                  disabled={!formData.country}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state/province" />
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
                <Label htmlFor="city">City *</Label>
                <Select 
                  value={formData.city} 
                  onValueChange={(value) => handleInputChange('city', value)}
                  disabled={!formData.state}
                >
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
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Agreement Date and Parties</h2>
              <p className="text-muted-foreground">Enter the lease date and party information</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="leaseDate">Lease Agreement Date *</Label>
                <Input
                  id="leaseDate"
                  type="date"
                  value={formData.leaseDate}
                  onChange={(e) => handleInputChange('leaseDate', e.target.value)}
                  placeholder="Select date"
                />
              </div>

              <div>
                <Label htmlFor="landlordName">Landlord's Full Legal Name *</Label>
                <Input
                  id="landlordName"
                  value={formData.landlordName}
                  onChange={(e) => handleInputChange('landlordName', e.target.value)}
                  placeholder="Enter landlord's full legal name"
                />
              </div>

              <div>
                <Label htmlFor="tenantName">Tenant's Full Legal Name *</Label>
                <Input
                  id="tenantName"
                  value={formData.tenantName}
                  onChange={(e) => handleInputChange('tenantName', e.target.value)}
                  placeholder="Enter tenant's full legal name"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Premises Details</h2>
              <p className="text-muted-foreground">Describe the office space being leased</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="spaceDescription">Office Space Description *</Label>
                <Textarea
                  id="spaceDescription"
                  value={formData.spaceDescription}
                  onChange={(e) => handleInputChange('spaceDescription', e.target.value)}
                  placeholder="Describe the office space (e.g., Suite 100, 2nd floor office space)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="streetAddress">Street Address *</Label>
                <Input
                  id="streetAddress"
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  placeholder="Enter street address"
                />
              </div>

              <div>
                <Label htmlFor="zipCode">Zip/Postal Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="Enter zip/postal code"
                />
              </div>

              <div>
                <Label htmlFor="legalDescription">Legal Description</Label>
                <Textarea
                  id="legalDescription"
                  value={formData.legalDescription}
                  onChange={(e) => handleInputChange('legalDescription', e.target.value)}
                  placeholder="Enter legal description of the premises (optional)"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Lease Term and Financial Details</h2>
              <p className="text-muted-foreground">Set the lease duration and payment terms</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Lease Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">Lease End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="monthlyRent">Monthly Rent Amount ($) *</Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                  placeholder="Enter monthly rent amount"
                />
              </div>

              <div>
                <Label htmlFor="paymentAddress">Payment Address *</Label>
                <Textarea
                  id="paymentAddress"
                  value={formData.paymentAddress}
                  onChange={(e) => handleInputChange('paymentAddress', e.target.value)}
                  placeholder="Enter address where rent payments should be sent"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="securityDeposit">Security Deposit ($) *</Label>
                <Input
                  id="securityDeposit"
                  type="number"
                  value={formData.securityDeposit}
                  onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                  placeholder="Enter security deposit amount"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Property Features</h2>
              <p className="text-muted-foreground">Specify furnishings, parking, and storage details</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="furnishings">Furnishings Provided</Label>
                <Textarea
                  id="furnishings"
                  value={formData.furnishings}
                  onChange={(e) => handleInputChange('furnishings', e.target.value)}
                  placeholder="List all furnishings that will be provided (e.g., desks, chairs, filing cabinets)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="parkingSpaces">Number of Parking Spaces</Label>
                <Input
                  id="parkingSpaces"
                  type="number"
                  value={formData.parkingSpaces}
                  onChange={(e) => handleInputChange('parkingSpaces', e.target.value)}
                  placeholder="Number of designated parking spaces"
                />
              </div>

              <div>
                <Label htmlFor="storageLocation">Storage Location</Label>
                <Input
                  id="storageLocation"
                  value={formData.storageLocation}
                  onChange={(e) => handleInputChange('storageLocation', e.target.value)}
                  placeholder="Describe storage areas available (e.g., basement storage unit, closet)"
                />
              </div>

              <div>
                <Label htmlFor="liabilityAmount">Liability Insurance Amount ($) *</Label>
                <Input
                  id="liabilityAmount"
                  type="number"
                  value={formData.liabilityAmount}
                  onChange={(e) => handleInputChange('liabilityAmount', e.target.value)}
                  placeholder="Minimum liability insurance coverage required"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <UserInfoStep
            onBack={() => setCurrentStep(5)}
            onGenerate={generatePDF}
            documentType="Office Space Lease Agreement"
            isGenerating={isGeneratingPDF}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Office Space Lease Agreement</CardTitle>
          <div className="flex justify-center items-center space-x-2 mt-4">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index + 1 === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index + 1 < currentStep
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Step {currentStep} of {totalSteps}
          </p>
        </CardHeader>

        <CardContent>
          {renderStep()}

          {currentStep !== 6 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep === totalSteps ? (
                <Button onClick={generatePDF} className="bg-primary">
                  <Download className="w-4 h-4 mr-2" />
                  Generate PDF
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OfficeSpaceLeaseForm;
