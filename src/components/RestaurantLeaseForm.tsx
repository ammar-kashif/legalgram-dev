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
import UserInfoStep from "@/components/UserInfoStep";

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

interface RestaurantLeaseData {
  // Location Information
  state: string;
  country: string;
  
  // Basic Information
  leaseDate: string;
  landlordName: string;
  landlordAddress: string;
  tenantName: string;
  tenantAddress: string;
  
  // Property Details
  restaurantName: string;
  restaurantAddress: string;
  legalDescription: string;
  
  // Term Details
  startDate: string;
  endDate: string;
  
  // Payment Details
  monthlyRent: string;
  paymentAddress: string;
  securityDeposit: string;
  
  // Insurance
  liabilityInsuranceAmount: string;
  
  // Renewal
  renewalDuration: string;
  renewalNoticeDays: string;
  renewalRent: string;
  renewalPeriod: string;
  
  // Termination
  saleTerminationDays: string;
  
  // Repair/Destruction
  repairCostLimit: string;
  
  // Fees
  lateFeeGraceDays: string;
  lateFeeAmount: string;
  returnedCheckFee: string;
  
  // Storage & Parking
  storageArea: string;
  parkingSpaces: string;
  
  // Furnishings
  furnishingsList: string;
  
  // Governing Law
  governingState: string;
  
  // Signatures
  landlordSignature: string;
  landlordSignatureDate: string;
  tenantSignature: string;
  tenantSignatureDate: string;
  
  // Notary
  notaryName: string;
}

const RestaurantLeaseForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formData, setFormData] = useState<RestaurantLeaseData>({
    state: "",
    country: "",
    leaseDate: "",
    landlordName: "",
    landlordAddress: "",
    tenantName: "",
    tenantAddress: "",
    restaurantName: "",
    restaurantAddress: "",
    legalDescription: "",
    startDate: "",
    endDate: "",
    monthlyRent: "",
    paymentAddress: "",
    securityDeposit: "",
    liabilityInsuranceAmount: "",
    renewalDuration: "",
    renewalNoticeDays: "",
    renewalRent: "",
    renewalPeriod: "",
    saleTerminationDays: "",
    repairCostLimit: "",
    lateFeeGraceDays: "",
    lateFeeAmount: "",
    returnedCheckFee: "",
    storageArea: "",
    parkingSpaces: "",
    furnishingsList: "",
    governingState: "",
    landlordSignature: "",
    landlordSignatureDate: "",
    tenantSignature: "",
    tenantSignatureDate: "",
    notaryName: ""
  });

  const totalSteps = 8;

  const updateFormData = (field: keyof RestaurantLeaseData, value: string) => {
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

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    
    try {
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
    addText("RESTAURANT LEASE AGREEMENT", 16, true);
    addSpace();

    // Opening paragraph
    addText(`This Lease Agreement ("Lease") is entered into on ${formData.leaseDate}, by and between`);
    addText(`${formData.landlordName} ("Landlord"), ${formData.landlordAddress}`);
    addText("And");
    addText(`${formData.tenantName} ("Tenant"), ${formData.tenantAddress}`);
    addText(`Landlord and Tenant may collectively be referred to as the "Parties."`);
    addSpace();

    // Section 1
    addText("1. Leased Premises", 12, true);
    addText(`Landlord hereby leases to Tenant the restaurant space known as ${formData.restaurantName}, located at ${formData.restaurantAddress} (the "Restaurant"), in consideration of the lease payments and covenants set forth herein.`);
    addSpace();

    // Section 2
    addText("2. Legal Description", 12, true);
    addText(`The legal description of the Restaurant is as follows: ${formData.legalDescription}.`);
    addSpace();

    // Section 3
    addText("3. Term", 12, true);
    addText(`The term of this Lease shall commence on ${formData.startDate} and shall expire on ${formData.endDate}, unless extended or terminated earlier in accordance with this Lease.`);
    addSpace();

    // Section 4
    addText("4. Rent", 12, true);
    addText(`Tenant agrees to pay monthly rent in the amount of $${formData.monthlyRent}, payable in advance on or before the first day of each month. All rental payments shall be delivered to Landlord at ${formData.paymentAddress}, or to any other address designated by Landlord in writing.`);
    addSpace();

    // Section 5
    addText("5. Security Deposit", 12, true);
    addText(`Upon execution of this Lease, Tenant shall pay Landlord a security deposit of $${formData.securityDeposit}, to be held in trust for the performance of Tenant's obligations under this Lease and to cover any damage caused to the Restaurant beyond normal wear and tear.`);
    addSpace();

    // Check if we need a new page
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    // Section 6
    addText("6. Possession", 12, true);
    addText("Tenant shall take possession of the Restaurant on the first day of the Lease Term and shall vacate and return possession at the end of the term, unless otherwise agreed in writing. Upon expiration or termination, Tenant shall remove all personal property and surrender the Restaurant in good condition, reasonable wear and tear excepted.");
    addSpace();

    // Section 7
    addText("7. Use of Premises", 12, true);
    addText("Tenant shall use the Restaurant solely for operating a restaurant or coffee shop business, and for related incidental purposes. Sale of alcoholic beverages is prohibited except for beer and wine, and only if properly licensed. Any other use shall require Landlord's prior written consent, not to be unreasonably withheld.");
    addText("Tenant and its employees, agents, and invitees shall have the non-exclusive right to use the common areas and facilities, subject to Landlord's rules and any exclusive use provisions for other tenants.");
    addSpace();

    // Section 8
    addText("8. Furnishings", 12, true);
    addText(`The following furnishings are provided: ${formData.furnishingsList}. Tenant shall return all furnishings in the same condition as received, subject to normal wear and tear.`);
    addSpace();

    // Section 9
    addText("9. Parking", 12, true);
    addText(`Tenant shall be entitled to use ${formData.parkingSpaces} parking spaces for customers and guests. Additionally, Tenant shall have the exclusive use of designated "Carry-Out Spaces" located in the front common area, as assigned by Landlord. Tenant shall be solely responsible for monitoring and enforcing its exclusive parking rights.`);
    addSpace();

    // Section 10
    addText("10. Signage and Awnings", 12, true);
    addText("Tenant shall, at its own expense, install new awnings and signage, subject to Landlord's prior written approval regarding design, location, and aesthetics. Tenant shall maintain all signage and awnings in good condition and hold Landlord harmless from liability related to their installation or maintenance. Upon lease termination, Tenant shall remove all signage and repair any resulting damage.");
    addSpace();

    // Section 11
    addText("11. Quiet Enjoyment", 12, true);
    addText("Landlord warrants that it holds good title to the Restaurant and has the legal right to lease the same. Provided Tenant complies with all terms of this Lease, it shall be entitled to quiet enjoyment of the premises throughout the Lease Term.");
    addSpace();

    // Check if we need a new page
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    // Section 12
    addText("12. Storage", 12, true);
    addText(`Tenant may store personal property in ${formData.storageArea}, at its own risk. Landlord shall not be liable for loss or damage to stored property.`);
    addSpace();

    // Section 13
    addText("13. Insurance", 12, true);
    addText("Property Insurance: Both Parties shall maintain appropriate insurance for their respective property and interests. Tenant shall name Landlord as an additional insured and provide proof of coverage.");
    addText(`Liability Insurance: Tenant shall maintain commercial general liability insurance with a combined single limit of at least $${formData.liabilityInsuranceAmount}, naming Landlord as an additional insured.`);
    addSpace();

    // Section 14
    addText("14. Renewal", 12, true);
    addText(`This Lease shall automatically renew for successive terms of ${formData.renewalDuration}, unless either party provides written notice of non-renewal at least ${formData.renewalNoticeDays} days prior to the expiration of the current term. Rent for any renewal term shall be $${formData.renewalRent} per ${formData.renewalPeriod}, unless otherwise agreed.`);
    addSpace();

    // Section 15
    addText("15. Maintenance", 12, true);
    addText("Landlord shall maintain the Restaurant structure and systems in good repair. Tenant shall be responsible for keeping the leased area clean and sanitary.");
    addSpace();

    // Section 16
    addText("16. Pest Control", 12, true);
    addText("Tenant shall, at its own cost, provide regular pest control services in all areas where food is handled, trash is stored, or deliveries are made.");
    addSpace();

    // Section 17
    addText("17. Janitorial Services", 12, true);
    addText("Tenant shall provide janitorial services for the leased premises at its own expense.");
    addSpace();

    // Section 18
    addText("18. Waste and Grease Management", 12, true);
    addText("Tenant shall not commit waste and must maintain cleanliness of the premises, including ensuring that sewer lines are free of grease or blockages. Grease must be removed professionally and recycled as required.");
    addSpace();

    // Check if we need a new page
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    // Section 19
    addText("19. Utilities and Services", 12, true);
    addText("Tenant shall be responsible for all utility charges and service costs associated with its use of the Restaurant.");
    addSpace();

    // Section 20
    addText("20. Taxes", 12, true);
    addText("Real Estate Taxes: Paid by Landlord.");
    addText("Personal Property & Use Taxes: Paid by Landlord, including any taxes attributable to Tenant's use of the Restaurant.");
    addSpace();

    // Section 21
    addText("21. Termination Upon Sale", 12, true);
    addText(`Landlord may terminate this Lease upon ${formData.saleTerminationDays} days' written notice in the event the Restaurant is sold.`);
    addSpace();

    // Section 22
    addText("22. Destruction or Condemnation", 12, true);
    addText(`If the Restaurant is partially destroyed but repairable within 60 days and at a cost under $${formData.repairCostLimit}, Landlord shall repair and rent shall abate proportionately during the repair. If repair is not feasible, or if condemnation occurs, either party may terminate this Lease by giving twenty (20) days' notice. Tenant shall promptly notify Landlord of any damage.`);
    addSpace();

    // Section 23
    addText("23. Default", 12, true);
    addText("If Tenant fails to comply with its obligations under this Lease, and does not cure a monetary default within five (5) days or any other breach within ten (10) days after written notice from Landlord, Landlord may re-enter the premises and pursue all available legal remedies. Tenant shall be liable for all costs, including attorney's fees.");
    addSpace();

    // Section 24
    addText("24. Late Payments", 12, true);
    addText(`Any payment not made within ${formData.lateFeeGraceDays} days of the due date shall incur a late fee of $${formData.lateFeeAmount}.`);
    addSpace();

    // Check if we need a new page
    if (y > 200) {
      doc.addPage();
      y = 20;
    }

    // Section 25
    addText("25. Holdover", 12, true);
    addText("If Tenant remains in possession after expiration of this Lease, rent during such Holdover Period shall be due at the same rate as under the renewal terms, unless otherwise agreed in writing.");
    addSpace();

    // Section 26
    addText("26. Cumulative Rights", 12, true);
    addText("All rights and remedies under this Lease shall be cumulative and may be exercised concurrently or separately.");
    addSpace();

    // Section 27
    addText("27. Returned Checks", 12, true);
    addText(`Tenant shall be charged $${formData.returnedCheckFee} for each returned check due to insufficient funds.`);
    addSpace();

    // Section 28
    addText("28. Governing Law", 12, true);
    addText(`This Lease shall be governed by and construed in accordance with the laws of the State of ${formData.governingState}.`);
    addSpace();

    // Section 29
    addText("29. Entire Agreement / Amendment", 12, true);
    addText("This Lease represents the full and final agreement between the Parties and supersedes all prior discussions or agreements. Any modifications must be in writing and signed by both Parties.");
    addSpace();

    // Section 30
    addText("30. Severability", 12, true);
    addText("If any provision of this Lease is held to be invalid or unenforceable, the remaining provisions shall remain in full force. A court may limit such provision to make it enforceable, and it shall then be enforced as so limited.");
    addSpace();

    // Section 31
    addText("31. Waiver", 12, true);
    addText("Failure by either party to enforce any term shall not constitute a waiver of that term or any other provision.");
    addSpace();

    // Section 32
    addText("32. Binding Effect", 12, true);
    addText("This Lease shall be binding upon and inure to the benefit of the Parties and their respective heirs, successors, legal representatives, and assigns.");
    addSpace();

    // Check if we need a new page
    if (y > 180) {
      doc.addPage();
      y = 20;
    }

    // Section 33
    addText("33. Notices", 12, true);
    addText("All notices under this Lease shall be in writing and delivered personally or sent by certified mail, return receipt requested, to the Parties at the addresses listed below, or to such other addresses as the Parties may later designate in writing.");
    addSpace(15);

    // Signature section
    addText("IN WITNESS WHEREOF, the Parties have executed this Restaurant Lease Agreement as of the date first written above.", 11, false);
    addSpace(10);

    addText("LANDLORD", 12, true);
    addText(`Signature: ${formData.landlordSignature}`);
    addText(`Name: ${formData.landlordName}`);
    addText(`Date: ${formData.landlordSignatureDate}`);
    addSpace();

    addText("TENANT", 12, true);
    addText(`Signature: ${formData.tenantSignature}`);
    addText(`Name: ${formData.tenantName}`);
    addText(`Date: ${formData.tenantSignatureDate}`);
    addSpace(15);

    // Check if we need a new page for Make It Legal section
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

    doc.save('restaurant-lease-agreement.pdf');
    toast.success("Restaurant Lease Agreement PDF generated successfully!");
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
              <CardDescription>Enter the basic details for the restaurant lease agreement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="leaseDate">Lease Agreement Date</Label>
                <Input
                  id="leaseDate"
                  type="date"
                  value={formData.leaseDate}
                  onChange={(e) => updateFormData('leaseDate', e.target.value)}
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
                  <Label htmlFor="tenantName">Tenant's Full Legal Name</Label>
                  <Input
                    id="tenantName"
                    value={formData.tenantName}
                    onChange={(e) => updateFormData('tenantName', e.target.value)}
                    placeholder="Full legal name of the tenant"
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
                  <Label htmlFor="tenantAddress">Tenant's Address</Label>
                  <Textarea
                    id="tenantAddress"
                    value={formData.tenantAddress}
                    onChange={(e) => updateFormData('tenantAddress', e.target.value)}
                    placeholder="Complete address of the tenant"
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
              <CardTitle>Restaurant Property Details</CardTitle>
              <CardDescription>Specify the restaurant location and lease term</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="restaurantName">Restaurant Name or Unit Number</Label>
                <Input
                  id="restaurantName"
                  value={formData.restaurantName}
                  onChange={(e) => updateFormData('restaurantName', e.target.value)}
                  placeholder="Name or unit number of the restaurant space"
                />
              </div>

              <div>
                <Label htmlFor="restaurantAddress">Restaurant Address</Label>
                <Input
                  id="restaurantAddress"
                  value={formData.restaurantAddress}
                  onChange={(e) => updateFormData('restaurantAddress', e.target.value)}
                  placeholder="Complete address of the restaurant location"
                />
              </div>

              <div>
                <Label htmlFor="legalDescription">Legal Description of Property</Label>
                <Textarea
                  id="legalDescription"
                  value={formData.legalDescription}
                  onChange={(e) => updateFormData('legalDescription', e.target.value)}
                  placeholder="Legal description of the restaurant property"
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
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payment Terms & Security</CardTitle>
              <CardDescription>Set the rental payment and security deposit details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyRent">Monthly Rent Amount ($)</Label>
                  <Input
                    id="monthlyRent"
                    value={formData.monthlyRent}
                    onChange={(e) => updateFormData('monthlyRent', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="securityDeposit">Security Deposit Amount ($)</Label>
                  <Input
                    id="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={(e) => updateFormData('securityDeposit', e.target.value)}
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

              <div>
                <Label htmlFor="liabilityInsuranceAmount">Liability Insurance Amount ($)</Label>
                <Input
                  id="liabilityInsuranceAmount"
                  value={formData.liabilityInsuranceAmount}
                  onChange={(e) => updateFormData('liabilityInsuranceAmount', e.target.value)}
                  placeholder="Minimum liability insurance coverage amount"
                />
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Restaurant Use Terms Included</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Restaurant or coffee shop business only</li>
                  <li>• Beer and wine sales allowed with proper licensing</li>
                  <li>• Common area usage rights included</li>
                  <li>• Signage and awning installation permitted</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Renewal & Termination Terms</CardTitle>
              <CardDescription>Set renewal options and termination conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="renewalDuration">Renewal Term Duration</Label>
                  <Input
                    id="renewalDuration"
                    value={formData.renewalDuration}
                    onChange={(e) => updateFormData('renewalDuration', e.target.value)}
                    placeholder="e.g., one year, six months"
                  />
                </div>
                <div>
                  <Label htmlFor="renewalNoticeDays">Renewal Notice Period (days)</Label>
                  <Input
                    id="renewalNoticeDays"
                    value={formData.renewalNoticeDays}
                    onChange={(e) => updateFormData('renewalNoticeDays', e.target.value)}
                    placeholder="Days notice required for non-renewal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="renewalRent">Renewal Rent Amount ($)</Label>
                  <Input
                    id="renewalRent"
                    value={formData.renewalRent}
                    onChange={(e) => updateFormData('renewalRent', e.target.value)}
                    placeholder="Rent amount for renewal period"
                  />
                </div>
                <div>
                  <Label htmlFor="renewalPeriod">Renewal Payment Period</Label>
                  <Input
                    id="renewalPeriod"
                    value={formData.renewalPeriod}
                    onChange={(e) => updateFormData('renewalPeriod', e.target.value)}
                    placeholder="e.g., month, year"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="saleTerminationDays">Sale Termination Notice (days)</Label>
                <Input
                  id="saleTerminationDays"
                  value={formData.saleTerminationDays}
                  onChange={(e) => updateFormData('saleTerminationDays', e.target.value)}
                  placeholder="Days notice if property is sold"
                />
              </div>

              <div>
                <Label htmlFor="repairCostLimit">Repair Cost Limit ($)</Label>
                <Input
                  id="repairCostLimit"
                  value={formData.repairCostLimit}
                  onChange={(e) => updateFormData('repairCostLimit', e.target.value)}
                  placeholder="Maximum repair cost for partial destruction"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Fees & Additional Terms</CardTitle>
              <CardDescription>Set late fees and specify storage, parking, and furnishings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="lateFeeGraceDays">Late Fee Grace Period (days)</Label>
                  <Input
                    id="lateFeeGraceDays"
                    value={formData.lateFeeGraceDays}
                    onChange={(e) => updateFormData('lateFeeGraceDays', e.target.value)}
                    placeholder="Grace period before late fee"
                  />
                </div>
                <div>
                  <Label htmlFor="lateFeeAmount">Late Fee Amount ($)</Label>
                  <Input
                    id="lateFeeAmount"
                    value={formData.lateFeeAmount}
                    onChange={(e) => updateFormData('lateFeeAmount', e.target.value)}
                    placeholder="Late payment fee"
                  />
                </div>
                <div>
                  <Label htmlFor="returnedCheckFee">Returned Check Fee ($)</Label>
                  <Input
                    id="returnedCheckFee"
                    value={formData.returnedCheckFee}
                    onChange={(e) => updateFormData('returnedCheckFee', e.target.value)}
                    placeholder="Fee for insufficient funds"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parkingSpaces">Number of Parking Spaces</Label>
                  <Input
                    id="parkingSpaces"
                    value={formData.parkingSpaces}
                    onChange={(e) => updateFormData('parkingSpaces', e.target.value)}
                    placeholder="Number of customer parking spaces"
                  />
                </div>
                <div>
                  <Label htmlFor="storageArea">Storage Area Description</Label>
                  <Input
                    id="storageArea"
                    value={formData.storageArea}
                    onChange={(e) => updateFormData('storageArea', e.target.value)}
                    placeholder="Description of storage area"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="furnishingsList">Furnishings Provided</Label>
                <Textarea
                  id="furnishingsList"
                  value={formData.furnishingsList}
                  onChange={(e) => updateFormData('furnishingsList', e.target.value)}
                  placeholder="List of furnishings included with the lease"
                  rows={3}
                />
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Tenant Responsibilities Included</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Pest control in food handling areas</li>
                  <li>• Janitorial services for leased premises</li>
                  <li>• Waste and grease management</li>
                  <li>• All utility charges and service costs</li>
                  <li>• Maintain cleanliness and sanitary conditions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 7:
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
                  <Label htmlFor="tenantSignature">Tenant Signature</Label>
                  <Input
                    id="tenantSignature"
                    value={formData.tenantSignature}
                    onChange={(e) => updateFormData('tenantSignature', e.target.value)}
                    placeholder="Tenant's signature line"
                  />
                </div>
                <div>
                  <Label htmlFor="tenantSignatureDate">Tenant Signature Date</Label>
                  <Input
                    id="tenantSignatureDate"
                    type="date"
                    value={formData.tenantSignatureDate}
                    onChange={(e) => updateFormData('tenantSignatureDate', e.target.value)}
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
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Legal Notes</h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• This agreement must be signed in front of a notary public</li>
                  <li>• The original should be filed with the Clerk of Court</li>
                  <li>• Keep a copy for your records in a safe place</li>
                  <li>• Consider consulting with a lawyer for complex situations</li>
                  <li>• Ensure compliance with local restaurant licensing requirements</li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Ready to Generate</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  All required information has been collected. You can now generate your Restaurant Lease Agreement PDF.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 8:
        return (
          <UserInfoStep
            onBack={prevStep}
            onGenerate={generatePDF}
            documentType="Restaurant Lease Agreement"
            isGenerating={isGeneratingPDF}
          />
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
            onClick={() => navigate('/restaurant-lease-info')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Info
          </Button>
          
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurant Lease Agreement</h1>
            <p className="text-lg text-gray-600">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          <div className="mb-8">
            <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
          </div>
        </div>

        {renderStep()}

        {currentStep !== 8 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep === 7 ? (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantLeaseForm;
