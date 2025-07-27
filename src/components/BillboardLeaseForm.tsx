import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, FileText, Download, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import { toast } from "sonner";
import CountryStateAPI from 'countries-states-cities';
import UserInfoStep from "./UserInfoStep";

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

interface BillboardLeaseData {
  // Location Information
  state: string;
  country: string;
  
  // Basic Information
  agreementDate: string;
  landlordName: string;
  landlordAddress: string;
  billboardOwnerName: string;
  billboardOwnerAddress: string;
  
  // Property Details
  physicalAddress: string;
  legalDescription: string;
  
  // Term Details
  startDate: string;
  endDate: string;
  
  // Payment Details
  yearlyRent: string;
  monthlyRent: string;
  paymentAddress: string;
  
  // Billboard Details
  numberOfBillboards: string;
  
  // Maintenance
  maintenanceDays: string;
  
  // Termination
  curePeriodDays: string;
  billboardOwnerNoticeDays: string;
  
  // Governing Law
  governingState: string;
  
  // Signatures
  landlordSignature: string;
  landlordSignatureDate: string;
  billboardOwnerSignature: string;
  billboardOwnerSignatureDate: string;
  
  // Notary
  notaryName: string;
}

const BillboardLeaseForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formData, setFormData] = useState<BillboardLeaseData>({
    state: "",
    country: "",
    agreementDate: "",
    landlordName: "",
    landlordAddress: "",
    billboardOwnerName: "",
    billboardOwnerAddress: "",
    physicalAddress: "",
    legalDescription: "",
    startDate: "",
    endDate: "",
    yearlyRent: "",
    monthlyRent: "",
    paymentAddress: "",
    numberOfBillboards: "",
    maintenanceDays: "",
    curePeriodDays: "",
    billboardOwnerNoticeDays: "",
    governingState: "",
    landlordSignature: "",
    landlordSignatureDate: "",
    billboardOwnerSignature: "",
    billboardOwnerSignatureDate: "",
    notaryName: ""
  });

  const totalSteps = 7;

  const updateFormData = (field: keyof BillboardLeaseData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset state when country changes
    if (field === 'country') {
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

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let y = 20;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize = 11, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, margin, y);
      y += (lines.length * fontSize * 0.4) + 3;
    };

    const addSpace = (space = 5) => {
      y += space;
    };

    // Title
    addText("BILLBOARD LEASE AGREEMENT", 16, true);
    addSpace();

    // Opening paragraph
    addText(`This Billboard Lease Agreement ("Agreement") is made and entered into as of ${formData.agreementDate}, by and between ${formData.landlordName}, having a principal address at ${formData.landlordAddress} ("Landlord"),`);
    addText("And");
    addText(`${formData.billboardOwnerName}, having a principal address at ${formData.billboardOwnerAddress} ("Billboard Owner").`);
    addText(`Landlord and Billboard Owner may collectively be referred to as the "Parties."`);
    addSpace();

    // Section 1
    addText("1. Lease", 12, true);
    addText("Landlord hereby leases to Billboard Owner a portion of the property described herein (\"Premises\"), on the terms and conditions set forth in this Agreement.");
    addSpace();

    // Section 2
    addText("2. Description of Leased Premises", 12, true);
    addText(`The Premises consists of a designated area located at ${formData.physicalAddress}, legally described as ${formData.legalDescription}, solely for the purpose of erecting, operating, and maintaining a billboard ("Display"). Billboard Owner is granted exclusive use of said area for this purpose. Landlord retains the right to use or lease all other portions of the property.`);
    addSpace();

    // Section 3
    addText("3. Term", 12, true);
    addText(`The term of this Lease shall commence on ${formData.startDate} and shall expire on ${formData.endDate} (the "Term"), unless terminated earlier as provided herein.`);
    addSpace();

    // Section 4
    addText("4. Rent", 12, true);
    addText(`Billboard Owner shall pay to Landlord rent in the amount of $${formData.yearlyRent} per year, payable in equal monthly installments of $${formData.monthlyRent}, in advance on the first day of each month, beginning on ${formData.startDate}. Payments shall be made at ${formData.paymentAddress} or any other address designated in writing by Landlord.`);
    addSpace();

    // Section 5
    addText("5. Use of Premises", 12, true);
    addText(`Billboard Owner shall be entitled to construct and maintain no more than ${formData.numberOfBillboards} billboard(s) on the Premises. No other use of the Premises is permitted.`);
    addSpace();

    // Check if we need a new page
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    // Section 6
    addText("6. Access", 12, true);
    addText("Landlord hereby grants Billboard Owner and its authorized representatives reasonable access to the Premises at all times during the Term for the erection, maintenance, repair, and inspection of the Display.");
    addSpace();

    // Section 7
    addText("7. Electrical Supply", 12, true);
    addText("Billboard Owner shall arrange for and bear the cost of supplying electrical power to the Display and shall be solely responsible for all utility expenses associated with its installation and use.");
    addSpace();

    // Section 8
    addText("8. Maintenance of Display", 12, true);
    addText(`Billboard Owner shall, at its sole cost, maintain the Display and associated structures in a safe, clean, and attractive condition. Billboard Owner shall promptly repair any damage caused by weather, vandalism, graffiti, or other causes. If Billboard Owner fails to perform such maintenance within ${formData.maintenanceDays} days following written notice from Landlord, Landlord may, at its option, perform the necessary repairs and recover the cost from Billboard Owner, or remove the Display entirely at Billboard Owner's expense.`);
    addSpace();

    // Section 9
    addText("9. Compliance with Laws", 12, true);
    addText("Billboard Owner shall, at its own expense, comply with all applicable federal, state, and local laws, ordinances, regulations, and codes in connection with the use and maintenance of the Premises and the Display. A final judgment or admission of non-compliance shall constitute grounds for termination by Landlord.");
    addSpace();

    // Section 10
    addText("10. Taxes", 12, true);
    addText("Billboard Owner shall pay all applicable federal, state, and local taxes, assessments, and fees associated with the Display, including any taxes levied on its personal property.");
    addSpace();

    // Check if we need a new page
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    // Section 11
    addText("11. Condition and Alterations", 12, true);
    addText(`Billboard Owner accepts the Premises in its "as-is" condition and agrees to maintain it in such condition (or better) throughout the Term. No alterations or improvements shall be made without the prior written consent of Landlord.`);
    addSpace();

    // Section 12
    addText("12. Ownership of Display", 12, true);
    addText("The Display shall remain the personal property of Billboard Owner and shall not be considered a fixture or improvement. Upon termination or expiration of this Agreement, Billboard Owner shall remove the Display and restore the Premises to its original condition, free of debris or remnants.");
    addSpace();

    // Section 13
    addText("13. Indemnification and Insurance", 12, true);
    addText("Billboard Owner shall indemnify, defend, and hold Landlord harmless from any and all claims, losses, liabilities, or damages arising from Billboard Owner's use or occupancy of the Premises.");
    addText("Billboard Owner shall, at its sole expense, maintain throughout the Term:");
    addText("(a) Commercial General Liability Insurance naming Landlord as an additional insured, covering personal injury and property damage, in amounts not less than those required by applicable law.");
    addText("(b) Fire and casualty insurance for any damage caused to the Premises or surrounding property by Billboard Owner or the Display.");
    addText("Proof of such coverage shall be furnished to Landlord upon request and prior to occupancy.");
    addSpace();

    // Section 14
    addText("14. Option to Renew", 12, true);
    addText("Billboard Owner shall have the option to renew this Agreement for an additional term upon giving Landlord written notice at least six (6) months prior to the expiration of the initial Term. Renewal shall be on terms mutually agreed upon in writing.");
    addSpace();

    // Check if we need a new page
    if (y > 200) {
      doc.addPage();
      y = 20;
    }

    // Section 15
    addText("15. Termination by Landlord", 12, true);
    addText(`Landlord may terminate this Agreement upon written notice to Billboard Owner if Billboard Owner breaches any covenant, condition, or provision herein and fails to cure such breach within ${formData.curePeriodDays} days of notice. Upon termination, Landlord may re-enter the Premises in accordance with applicable law and recover damages, including unpaid rent and any other losses resulting from Billboard Owner's breach.`);
    addSpace();

    // Section 16
    addText("16. Termination by Billboard Owner", 12, true);
    addText(`Billboard Owner may terminate this Agreement by giving Landlord ${formData.billboardOwnerNoticeDays} days' prior written notice if any law, ordinance, or regulation is enacted or enforced that materially restricts Billboard Owner's ability to use the Premises for billboard purposes as contemplated herein.`);
    addSpace();

    // Section 17
    addText("17. Notices", 12, true);
    addText("All notices required under this Agreement shall be in writing and delivered personally, by certified mail, or by a recognized overnight courier to the addresses of the parties stated above (or such other address as either party may designate in writing). Notices shall be effective upon delivery or attempted delivery.");
    addSpace();

    // Section 18
    addText("18. Time of the Essence", 12, true);
    addText("Time is of the essence with respect to all provisions of this Agreement.");
    addSpace();

    // Section 19
    addText("19. Governing Law", 12, true);
    addText(`This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingState}.`);
    addSpace();

    // Section 20
    addText("20. Attorneys' Fees", 12, true);
    addText("In the event of any dispute or legal action arising out of this Agreement, the prevailing party shall be entitled to recover its reasonable attorneys' fees and costs from the non-prevailing party.");
    addSpace();

    // Check if we need a new page
    if (y > 180) {
      doc.addPage();
      y = 20;
    }

    // Section 21
    addText("21. Entire Agreement", 12, true);
    addText("This Agreement constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior negotiations, discussions, or agreements, whether oral or written.");
    addSpace();

    // Section 22
    addText("22. Severability", 12, true);
    addText("If any provision of this Agreement is held to be invalid or unenforceable, such provision shall be severed, and the remaining provisions shall remain in full force and effect.");
    addSpace();

    // Section 23
    addText("23. Amendment", 12, true);
    addText("This Agreement may only be amended in a written document signed by both Parties.");
    addSpace(15);

    // Signature section
    addText("IN WITNESS WHEREOF, the parties hereto have executed this Billboard Lease Agreement as of the date first written above.", 11, false);
    addSpace(10);

    addText("LANDLORD:", 12, true);
    addText(`Signature: ${formData.landlordSignature}`);
    addText(`Name: ${formData.landlordName}`);
    addText(`Date: ${formData.landlordSignatureDate}`);
    addSpace();

    addText("BILLBOARD OWNER:", 12, true);
    addText(`Signature: ${formData.billboardOwnerSignature}`);
    addText(`Name: ${formData.billboardOwnerName}`);
    addText(`Date: ${formData.billboardOwnerSignatureDate}`);
    addSpace(15);

    // Check if we need a new page for checklist
    if (y > 200) {
      doc.addPage();
      y = 20;
    }

    // Make It Legal section
    addText("Make It Legal", 14, true);
    addSpace();
    addText(`This Agreement should be signed in front of a notary public by ${formData.notaryName}.`);
    addText("Once signed in front of a notary, this document should be delivered to the appropriate court for filing.");
    addSpace();

    addText("Copies", 12, true);
    addText("The original Agreement should be filed with the Clerk of Court or delivered to the requesting business.");
    addText("The Affiant should maintain a copy of the Agreement. Your copy should be kept in a safe place. If you signed a paper copy of your document, you can use Rocket Lawyer to store and share it. Safe and secure in your Rocket Lawyer File Manager, you can access it any time from any computer, as well as share it for future reference.");
    addSpace();

    addText("Additional Assistance", 12, true);
    addText("If you are unsure or have questions regarding this Agreement or need additional assistance with special situations or circumstances, use Legal Gram. Find A Lawyer search engine to find a lawyer in your area to assist you in this matter");

    try {
      doc.save('billboard-lease-agreement.pdf');
      toast.success("Billboard Lease Agreement PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderStep = () => {
    if (currentStep === 7) {
      return (
        <UserInfoStep
          onBack={prevStep}
          onGenerate={generatePDF}
          documentType="Billboard Lease Agreement"
          isGenerating={isGeneratingPDF}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
              <CardDescription>Enter your location details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country || ''}
                    onValueChange={(value) => updateFormData('country', value)}
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
                    onValueChange={(value) => updateFormData('state', value)}
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
                <Label htmlFor="governingState">Governing State (for legal jurisdiction)</Label>
                <Input
                  id="governingState"
                  value={formData.governingState}
                  onChange={(e) => updateFormData('governingState', e.target.value)}
                  placeholder="State whose laws will govern this agreement"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Basic Agreement Information</CardTitle>
              <CardDescription>Enter the basic details for the billboard lease agreement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="agreementDate">Agreement Date</Label>
                <Input
                  id="agreementDate"
                  type="date"
                  value={formData.agreementDate}
                  onChange={(e) => updateFormData('agreementDate', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="landlordName">Landlord's Full Legal Name</Label>
                  <Input
                    id="landlordName"
                    value={formData.landlordName}
                    onChange={(e) => updateFormData('landlordName', e.target.value)}
                    placeholder="Full legal name of the landlord"
                  />
                </div>
                <div>
                  <Label htmlFor="billboardOwnerName">Billboard Owner's Full Legal Name</Label>
                  <Input
                    id="billboardOwnerName"
                    value={formData.billboardOwnerName}
                    onChange={(e) => updateFormData('billboardOwnerName', e.target.value)}
                    placeholder="Full legal name of the billboard owner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="landlordAddress">Landlord's Address</Label>
                  <Textarea
                    id="landlordAddress"
                    value={formData.landlordAddress}
                    onChange={(e) => updateFormData('landlordAddress', e.target.value)}
                    placeholder="Complete address of the landlord"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="billboardOwnerAddress">Billboard Owner's Address</Label>
                  <Textarea
                    id="billboardOwnerAddress"
                    value={formData.billboardOwnerAddress}
                    onChange={(e) => updateFormData('billboardOwnerAddress', e.target.value)}
                    placeholder="Complete address of the billboard owner"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Property & Term Details</CardTitle>
              <CardDescription>Specify the property location and lease term</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="physicalAddress">Physical Address of Property</Label>
                <Input
                  id="physicalAddress"
                  value={formData.physicalAddress}
                  onChange={(e) => updateFormData('physicalAddress', e.target.value)}
                  placeholder="Complete physical address where billboard will be located"
                />
              </div>

              <div>
                <Label htmlFor="legalDescription">Legal Description of Property</Label>
                <Textarea
                  id="legalDescription"
                  value={formData.legalDescription}
                  onChange={(e) => updateFormData('legalDescription', e.target.value)}
                  placeholder="Legal description of the property (lot number, block, subdivision, etc.)"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Lease Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateFormData('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Lease End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateFormData('endDate', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="numberOfBillboards">Number of Billboards Allowed</Label>
                <Input
                  id="numberOfBillboards"
                  value={formData.numberOfBillboards}
                  onChange={(e) => updateFormData('numberOfBillboards', e.target.value)}
                  placeholder="Maximum number of billboards (e.g., one, two, three)"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payment Terms</CardTitle>
              <CardDescription>Set the rental payment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="yearlyRent">Yearly Rent Amount ($)</Label>
                  <Input
                    id="yearlyRent"
                    value={formData.yearlyRent}
                    onChange={(e) => updateFormData('yearlyRent', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyRent">Monthly Rent Amount ($)</Label>
                  <Input
                    id="monthlyRent"
                    value={formData.monthlyRent}
                    onChange={(e) => updateFormData('monthlyRent', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="paymentAddress">Payment Address</Label>
                <Textarea
                  id="paymentAddress"
                  value={formData.paymentAddress}
                  onChange={(e) => updateFormData('paymentAddress', e.target.value)}
                  placeholder="Address where rent payments should be sent"
                  rows={3}
                />
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Payment Terms Included</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Monthly payments due on the first day of each month</li>
                  <li>• Payments must be made in advance</li>
                  <li>• Billboard Owner responsible for all utility costs</li>
                  <li>• Billboard Owner responsible for all taxes and fees</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
              <CardDescription>Set maintenance and termination terms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="maintenanceDays">Maintenance Response Period (days)</Label>
                <Input
                  id="maintenanceDays"
                  value={formData.maintenanceDays}
                  onChange={(e) => updateFormData('maintenanceDays', e.target.value)}
                  placeholder="Number of days billboard owner has to respond to maintenance notice"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="curePeriodDays">Breach Cure Period (days)</Label>
                  <Input
                    id="curePeriodDays"
                    value={formData.curePeriodDays}
                    onChange={(e) => updateFormData('curePeriodDays', e.target.value)}
                    placeholder="Days to cure a breach before termination"
                  />
                </div>
                <div>
                  <Label htmlFor="billboardOwnerNoticeDays">Billboard Owner Notice Period (days)</Label>
                  <Input
                    id="billboardOwnerNoticeDays"
                    value={formData.billboardOwnerNoticeDays}
                    onChange={(e) => updateFormData('billboardOwnerNoticeDays', e.target.value)}
                    placeholder="Days notice required for billboard owner termination"
                  />
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Agreement Terms Included</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Billboard Owner maintains exclusive use of designated area</li>
                  <li>• Reasonable access for maintenance and inspection</li>
                  <li>• Compliance with all applicable laws and regulations</li>
                  <li>• Commercial General Liability Insurance required</li>
                  <li>• Option to renew with 6 months notice</li>
                  <li>• Billboard removal required upon termination</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Signatures & Notarization</CardTitle>
              <CardDescription>Enter signature information and notary details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="landlordSignature">Landlord Signature</Label>
                  <Input
                    id="landlordSignature"
                    value={formData.landlordSignature}
                    onChange={(e) => updateFormData('landlordSignature', e.target.value)}
                    placeholder="Landlord's signature line"
                  />
                </div>
                <div>
                  <Label htmlFor="landlordSignatureDate">Landlord Signature Date</Label>
                  <Input
                    id="landlordSignatureDate"
                    type="date"
                    value={formData.landlordSignatureDate}
                    onChange={(e) => updateFormData('landlordSignatureDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billboardOwnerSignature">Billboard Owner Signature</Label>
                  <Input
                    id="billboardOwnerSignature"
                    value={formData.billboardOwnerSignature}
                    onChange={(e) => updateFormData('billboardOwnerSignature', e.target.value)}
                    placeholder="Billboard owner's signature line"
                  />
                </div>
                <div>
                  <Label htmlFor="billboardOwnerSignatureDate">Billboard Owner Signature Date</Label>
                  <Input
                    id="billboardOwnerSignatureDate"
                    type="date"
                    value={formData.billboardOwnerSignatureDate}
                    onChange={(e) => updateFormData('billboardOwnerSignatureDate', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notaryName">Notary Public Name</Label>
                <Input
                  id="notaryName"
                  value={formData.notaryName}
                  onChange={(e) => updateFormData('notaryName', e.target.value)}
                  placeholder="Name of the notary public who will notarize this agreement"
                />
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notarization Requirements</h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• This agreement must be signed in front of a notary public</li>
                  <li>• The original should be filed with the Clerk of Court</li>
                  <li>• Keep a copy for your records in a safe place</li>
                  <li>• Consider consulting with a lawyer for complex situations</li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Ready to Generate</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  All required information has been collected. You can now generate your Billboard Lease Agreement PDF.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/billboard-lease-info')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Info
          </Button>
          
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Billboard Lease Agreement</h1>
            <p className="text-lg text-gray-600">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          <div className="mb-8">
            <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
          </div>
        </div>

        {renderStep()}

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
            <Button onClick={generatePDF} className="bg-green-600 hover:bg-green-700">
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
      </div>
    </div>
  );
};

export default BillboardLeaseForm;
