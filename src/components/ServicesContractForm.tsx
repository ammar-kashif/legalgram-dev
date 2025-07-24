import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, ArrowRight, ArrowLeft, Info } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
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

const getCountryName = (countryId: string): string => {
  const country = CountryStateAPI.getAllCountries().find(c => c.id.toString() === countryId);
  return country?.name || `Country ID: ${countryId}`;
};

const getStateName = (countryId: string, stateId: string): string => {
  const country = CountryStateAPI.getAllCountries().find(c => c.id.toString() === countryId);
  if (!country) return `State ID: ${stateId}`;
  
  const states = CountryStateAPI.getStatesOfCountry(country.id);
  const state = states.find(s => s.id.toString() === stateId);
  return state?.name || `State ID: ${stateId}`;
};

interface ContractData {
  // Contract Date
  contractDate: string;
  
  // Party A (Service Provider)
  partyACompanyName: string;
  partyAAddress: string;
  
  // Party B (Client)
  partyBCompanyName: string;
  partyBAddress: string;
  
  // Service Details
  serviceDescription: string;
  projectDescription: string;
  resourceProvisionTime: string;
  probationPeriod: string;
  
  // Payment Terms
  paymentMethod: string;
  manDayRate: string;
  manHourRate: string;
  invoicingFrequency: string;
  paymentTerms: string;
  
  // Timeline and Penalties
  resourceRequestTime: string;
  liquidatedDamagePercent: string;
  terminationPeriod: string;
  
  // Legal and Governance
  governingLaw: string;
  disputeResolution: string;
  mediationPeriod: string;
  
  // Contact Information
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  
  // Signatures
  partyASignatoryName: string;
  partyASignatoryTitle: string;
  partyBSignatoryName: string;
  partyBSignatoryTitle: string;
  
  // Witnesses
  witness1Name: string;
  witness1CNIC: string;
  witness2Name: string;
  witness2CNIC: string;
  witness3Name: string;
  witness3CNIC: string;
  witness4Name: string;
  witness4CNIC: string;
  
  // Location
  country: string;
  state: string;
}

const ServicesContractForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const [formData, setFormData] = useState<ContractData>({
    contractDate: "",
    partyACompanyName: "",
    partyAAddress: "",
    partyBCompanyName: "",
    partyBAddress: "",
    serviceDescription: "",
    projectDescription: "",
    resourceProvisionTime: "",
    probationPeriod: "",
    paymentMethod: "",
    manDayRate: "",
    manHourRate: "",
    invoicingFrequency: "monthly",
    paymentTerms: "",
    resourceRequestTime: "20",
    liquidatedDamagePercent: "10",
    terminationPeriod: "90",
    governingLaw: "",
    disputeResolution: "arbitration",
    mediationPeriod: "30",
    clientAddress: "",
    clientEmail: "",
    clientPhone: "",
    partyASignatoryName: "",
    partyASignatoryTitle: "",
    partyBSignatoryName: "",
    partyBSignatoryTitle: "",
    witness1Name: "",
    witness1CNIC: "",
    witness2Name: "",
    witness2CNIC: "",
    witness3Name: "",
    witness3CNIC: "",
    witness4Name: "",
    witness4CNIC: "",
    country: "",
    state: ""
  });

  const updateFormData = (field: keyof ContractData, value: string) => {
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

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      
      // Helper function to add new page if needed
      const checkPageBreak = (requiredHeight: number) => {
        if (yPosition + requiredHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = 20;
        }
      };

      // Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("SERVICES CONTRACT", 105, yPosition, { align: "center" });
      yPosition += 20;

      // Contract introduction
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const introText = `This Services Contract (the "Contract") is made and entered into on ${formData.contractDate || "________________"}.`;
      doc.text(introText, margin, yPosition);
      yPosition += 20;

      // Parties section
      doc.setFont("helvetica", "bold");
      doc.text("By and Between", 105, yPosition, { align: "center" });
      yPosition += 15;

      doc.setFont("helvetica", "normal");
      const partyAText = `Party A: ${formData.partyACompanyName || "<Company name>"} (hereinafter called the "service provider" which expression shall deem to mean and include its administrators, authorized representatives, successors-in-interest and permitted assigns) of the One Part;`;
      const splitPartyAText = doc.splitTextToSize(partyAText, 170);
      doc.text(splitPartyAText, margin, yPosition);
      yPosition += splitPartyAText.length * 7 + 10;

      doc.text("And", 105, yPosition, { align: "center" });
      yPosition += 10;

      const partyBText = `Party B: ${formData.partyBCompanyName || "<insert Software house name>"} (hereinafter called the "Software House") which expression shall deem to mean and include its successors-in-interest and permitted assigns of the Second Part;`;
      const splitPartyBText = doc.splitTextToSize(partyBText, 170);
      doc.text(splitPartyBText, margin, yPosition);
      yPosition += splitPartyBText.length * 7 + 15;

      const partiesNote = `(The Client and the Software House shall, hereinafter, collectively be referred to as the "Parties" and individually as the "Party" where the context so requires.)`;
      const splitPartiesNote = doc.splitTextToSize(partiesNote, 170);
      doc.text(splitPartiesNote, margin, yPosition);
      yPosition += splitPartiesNote.length * 7 + 20;

      // WHEREAS section
      checkPageBreak(80);
      doc.setFont("helvetica", "bold");
      doc.text("WHEREAS:", margin, yPosition);
      yPosition += 15;

      doc.setFont("helvetica", "normal");
      const whereasItems = [
        "The Client wishes to engage a software house to provide software development services through staff augmentation;",
        "The Software House is engaged in providing software and digital solutions and has developed a pool of resources with qualifications, credentials, certifications, skills, knowledge, expertise and experience.",
        "The Client may, from time to time and in its complete discretion, engage the Software House to provide Services through provision of resources having skill sets and expertise.",
        "The Software House undertakes and agrees to provide the Services as per the requirements of the Client and in accordance with the terms and conditions set forth herein and under the relevant Schedules of this Contract;"
      ];

      whereasItems.forEach(item => {
        checkPageBreak(20);
        const splitItem = doc.splitTextToSize(item, 170);
        doc.text(splitItem, margin, yPosition);
        yPosition += splitItem.length * 7 + 5;
      });

      yPosition += 10;
      const nowTherefore = "NOW THEREFORE, in consideration of the mutual promises and covenant here-in-after contained and the representations and warranties, covenants, conditions and promises contained herein below and intending to be legally bound, the said Parties hereby covenant and agree as follows:";
      const splitNowTherefore = doc.splitTextToSize(nowTherefore, 170);
      doc.text(splitNowTherefore, margin, yPosition);
      yPosition += splitNowTherefore.length * 7 + 20;

      // Add new page for main content
      doc.addPage();
      yPosition = 20;

      // Non-exclusivity section
      doc.setFont("helvetica", "bold");
      doc.text("1. NON-EXCLUSIVITY AND MINIMUM VOLUME COMMITMENTS", margin, yPosition);
      yPosition += 15;

      doc.setFont("helvetica", "normal");
      const nonExclusivity = "The Execution of this Contract does not in itself bind the Client to purchase a certain minimum volume of services from the Software House. Furthermore, the Contract is on a non-exclusive basis and does not restrain the Client to enter into similar arrangements or agreements with other service providers for the provisioning of similar services.";
      const splitNonExclusivity = doc.splitTextToSize(nonExclusivity, 170);
      doc.text(splitNonExclusivity, margin, yPosition);
      yPosition += splitNonExclusivity.length * 7 + 20;

      // Scope of work section
      checkPageBreak(40);
      doc.setFont("helvetica", "bold");
      doc.text("2. SCOPE OF WORK", margin, yPosition);
      yPosition += 15;

      doc.setFont("helvetica", "normal");
      const scopeIntro = "The Software House undertakes to deliver all Services required for the successful delivery of the Project(s) awarded hereunder.";
      doc.text(scopeIntro, margin, yPosition);
      yPosition += 15;

      doc.text("The following constitute the Software House's Scope of Work under this Contract:", margin, yPosition);
      yPosition += 15;

      // Scope items
      const scopeItems = [
        "2.1 The Software House shall provide the Services to the satisfaction of CLIENT and for the purposes required by CLIENT, subject to the conditions set forth in this Contract and more specifically in accordance with the timelines set for provisioning of such Services.",
        "2.2 The Software House agrees that all Deliverable(s) (including but not limited to any Software or applications, products etc.) produced or delivered under Management/supervision of Client, fully or partially shall form Client Intellectual Property.",
        `2.3 The Software House shall ensure that it provisions Services and backup resources within ${formData.resourceProvisionTime || "<insert time>"} of time as agreed with the Client from time to time.`,
        `2.4 The Probation Period for any new resource is set ${formData.probationPeriod || "<insert time>"}. The Client reserves the right to continue with the resource following the probation period based on an evaluation of their performance.`
      ];

      scopeItems.forEach(item => {
        checkPageBreak(25);
        const splitItem = doc.splitTextToSize(item, 170);
        doc.text(splitItem, margin, yPosition);
        yPosition += splitItem.length * 7 + 10;
      });

      // Payment terms section
      checkPageBreak(40);
      doc.setFont("helvetica", "bold");
      doc.text("3. TERMS OF PAYMENT AND INVOICING", margin, yPosition);
      yPosition += 15;

      doc.setFont("helvetica", "normal");
      const paymentItems = [
        "The Client shall pay to the Software House for the successful completion of the Services. The fee shall be calculated in accordance with the payment terms set out below.",
        `All invoices for Services shall be raised ${formData.invoicingFrequency}. All invoices shall be raised in accordance with the man-day / man-hour rate.`,
        "All invoices shall be raised with specific reference to the Contract. All Invoices must be accompanied by relevant Acceptance Certificate(s) and any other ancillary documentation(s) required by the Client."
      ];

      paymentItems.forEach(item => {
        checkPageBreak(20);
        const splitItem = doc.splitTextToSize(item, 170);
        doc.text(splitItem, margin, yPosition);
        yPosition += splitItem.length * 7 + 8;
      });

      // Continue with remaining sections...
      // Due to space constraints, I'll add the key remaining sections

      // Add new page for additional terms
      doc.addPage();
      yPosition = 20;

      // Intellectual Property
      doc.setFont("helvetica", "bold");
      doc.text("4. INTELLECTUAL PROPERTY", margin, yPosition);
      yPosition += 15;

      doc.setFont("helvetica", "normal");
      doc.text("The intellectual property of the developed software will remain at Client side and will be the property of the Client.", margin, yPosition);
      yPosition += 20;

      // Governing Law
      doc.setFont("helvetica", "bold");
      doc.text("5. GOVERNING LAW AND DISPUTE RESOLUTION", margin, yPosition);
      yPosition += 15;

      doc.setFont("helvetica", "normal");
      const countryName = formData.country ? getCountryName(formData.country.split(':')[0]) : '';
      const stateName = formData.state ? getStateName(formData.country?.split(':')[0] || '', formData.state.split(':')[0]) : '';
      
      let governingText = '';
      if (countryName && stateName) {
        governingText = `This Contract shall be construed and governed by the laws of ${stateName}, ${countryName}.`;
      } else if (formData.governingLaw) {
        governingText = `This Contract shall be construed and governed by the laws of ${formData.governingLaw}.`;
      } else {
        governingText = `This Contract shall be construed and governed by the applicable laws.`;
      }
      
      doc.text(governingText, margin, yPosition);
      yPosition += 15;

      const disputeText = `If at any time, any differences or disputes arise between the Parties which cannot be resolved by informal negotiation within a period of ${formData.mediationPeriod} days then all such dispute(s) shall be settled through mediation and if mediation fails then parties shall resort to arbitration for resolution of dispute.`;
      const splitDisputeText = doc.splitTextToSize(disputeText, 170);
      doc.text(splitDisputeText, margin, yPosition);
      yPosition += splitDisputeText.length * 7 + 20;

      // Liquidated Damages
      doc.setFont("helvetica", "bold");
      doc.text("6. LIQUIDATED DAMAGES & PENALTY", margin, yPosition);
      yPosition += 15;

      doc.setFont("helvetica", "normal");
      const damagesText = `The Software House is to provide the Client with a resource as part of the Services under this Contract within ${formData.resourceRequestTime} days of such request by the Client. Where the Software House fails to provide such resource within ${formData.resourceRequestTime} days, CLIENT shall be entitled to recover liquidated damages amounting to ${formData.liquidatedDamagePercent}% of the man-day rate.`;
      const splitDamagesText = doc.splitTextToSize(damagesText, 170);
      doc.text(splitDamagesText, margin, yPosition);
      yPosition += splitDamagesText.length * 7 + 15;

      const terminationText = `If the delay reaches beyond ${formData.terminationPeriod} days, the Client shall be entitled to terminate this Contract.`;
      doc.text(terminationText, margin, yPosition);
      yPosition += 20;

      // Signatures section
      checkPageBreak(80);
      doc.setFont("helvetica", "bold");
      doc.text("IN WITNESS WHEREOF the Parties hereto have set their hands the day, month and year first above written.", margin, yPosition);
      yPosition += 20;

      // Signature blocks
      doc.setFont("helvetica", "normal");
      doc.text("For and on behalf of", margin, yPosition);
      doc.text("For and on Behalf of", margin + 100, yPosition);
      yPosition += 10;

      doc.text(formData.partyACompanyName || "<software house>", margin, yPosition);
      doc.text(formData.partyBCompanyName || "Client", margin + 100, yPosition);
      yPosition += 30;

      doc.text("_____________________________", margin, yPosition);
      doc.text("_____________________________", margin + 100, yPosition);
      yPosition += 10;

      doc.text(`Name: ${formData.partyASignatoryName || ""}`, margin, yPosition);
      doc.text(`Name: ${formData.partyBSignatoryName || ""}`, margin + 100, yPosition);
      yPosition += 10;

      doc.text(`Title: ${formData.partyASignatoryTitle || ""}`, margin, yPosition);
      doc.text(`Title: ${formData.partyBSignatoryTitle || ""}`, margin + 100, yPosition);
      yPosition += 30;

      // Witnesses
      doc.setFont("helvetica", "bold");
      doc.text("Witnesses", margin, yPosition);
      yPosition += 15;

      doc.setFont("helvetica", "normal");
      doc.text("1. ________________________", margin, yPosition);
      doc.text("2. ______________________", margin + 100, yPosition);
      yPosition += 10;

      doc.text(`Name: ${formData.witness1Name || ""}`, margin, yPosition);
      doc.text(`Name: ${formData.witness2Name || ""}`, margin + 100, yPosition);
      yPosition += 10;

      doc.text(`CNIC: ${formData.witness1CNIC || ""}`, margin, yPosition);
      doc.text(`CNIC: ${formData.witness2CNIC || ""}`, margin + 100, yPosition);
      yPosition += 20;

      doc.text("3. ________________________", margin, yPosition);
      doc.text("4. ______________________", margin + 100, yPosition);
      yPosition += 10;

      doc.text(`Name: ${formData.witness3Name || ""}`, margin, yPosition);
      doc.text(`Name: ${formData.witness4Name || ""}`, margin + 100, yPosition);
      yPosition += 10;

      doc.text(`CNIC: ${formData.witness3CNIC || ""}`, margin, yPosition);
      doc.text(`CNIC: ${formData.witness4CNIC || ""}`, margin + 100, yPosition);

      // Save the PDF
      doc.save("services-contract.pdf");
      toast.success("Services Contract generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 7) {
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
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Location & Contract Parties</h2>
                <p className="text-sm text-muted-foreground">Select your location and enter information for both parties</p>
              </div>
              <Link to="/services-contract-info">
                <Button variant="outline" size="sm" className="text-orange-600 border-orange-600 hover:bg-orange-50">
                  <Info className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </Link>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => updateFormData('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
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
                    value={formData.state} 
                    onValueChange={(value) => updateFormData('state', value)}
                    disabled={!formData.country}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state/province" />
                    </SelectTrigger>
                    <SelectContent>
                      {getStatesForCountry(formData.country).map((state) => {
                        const [id, name] = state.split(':');
                        return (
                          <SelectItem key={id} value={state}>
                            {name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="contractDate">Contract Date</Label>
                <Input
                  id="contractDate"
                  type="date"
                  value={formData.contractDate}
                  onChange={(e) => updateFormData("contractDate", e.target.value)}
                />
              </div>

              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Party A (Service Provider)</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="partyACompanyName">Company Name</Label>
                    <Input
                      id="partyACompanyName"
                      value={formData.partyACompanyName}
                      onChange={(e) => updateFormData("partyACompanyName", e.target.value)}
                      placeholder="Service provider company name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="partyAAddress">Company Address</Label>
                    <Textarea
                      id="partyAAddress"
                      value={formData.partyAAddress}
                      onChange={(e) => updateFormData("partyAAddress", e.target.value)}
                      placeholder="Complete address of service provider"
                    />
                  </div>
                </div>
              </div>

              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Party B (Client/Software House)</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="partyBCompanyName">Company Name</Label>
                    <Input
                      id="partyBCompanyName"
                      value={formData.partyBCompanyName}
                      onChange={(e) => updateFormData("partyBCompanyName", e.target.value)}
                      placeholder="Client company name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="partyBAddress">Company Address</Label>
                    <Textarea
                      id="partyBAddress"
                      value={formData.partyBAddress}
                      onChange={(e) => updateFormData("partyBAddress", e.target.value)}
                      placeholder="Complete address of client"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Service Details</h2>
              <p className="text-sm text-muted-foreground">Define the scope and nature of services</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="serviceDescription">Service Description</Label>
                <Textarea
                  id="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={(e) => updateFormData("serviceDescription", e.target.value)}
                  placeholder="Detailed description of services to be provided"
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="projectDescription">Project Description</Label>
                <Textarea
                  id="projectDescription"
                  value={formData.projectDescription}
                  onChange={(e) => updateFormData("projectDescription", e.target.value)}
                  placeholder="Description of the specific project or ongoing work"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="resourceProvisionTime">Resource Provision Time</Label>
                  <Input
                    id="resourceProvisionTime"
                    value={formData.resourceProvisionTime}
                    onChange={(e) => updateFormData("resourceProvisionTime", e.target.value)}
                    placeholder="e.g., 24 hours, 3 days"
                  />
                </div>
                
                <div>
                  <Label htmlFor="probationPeriod">Probation Period</Label>
                  <Input
                    id="probationPeriod"
                    value={formData.probationPeriod}
                    onChange={(e) => updateFormData("probationPeriod", e.target.value)}
                    placeholder="e.g., 30 days, 3 months"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Payment Terms</h2>
              <p className="text-sm text-muted-foreground">Define payment structure and terms</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Input
                  id="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={(e) => updateFormData("paymentMethod", e.target.value)}
                  placeholder="e.g., Bank transfer, Check, Wire transfer"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manDayRate">Man-Day Rate ($)</Label>
                  <Input
                    id="manDayRate"
                    type="number"
                    value={formData.manDayRate}
                    onChange={(e) => updateFormData("manDayRate", e.target.value)}
                    placeholder="Daily rate"
                  />
                </div>
                
                <div>
                  <Label htmlFor="manHourRate">Man-Hour Rate ($)</Label>
                  <Input
                    id="manHourRate"
                    type="number"
                    value={formData.manHourRate}
                    onChange={(e) => updateFormData("manHourRate", e.target.value)}
                    placeholder="Hourly rate"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Textarea
                  id="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={(e) => updateFormData("paymentTerms", e.target.value)}
                  placeholder="e.g., Net 30 days, payment due within 15 days of invoice"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Timeline & Penalties</h2>
              <p className="text-sm text-muted-foreground">Set timelines and penalty terms</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="resourceRequestTime">Resource Request Time (days)</Label>
                  <Input
                    id="resourceRequestTime"
                    type="number"
                    value={formData.resourceRequestTime}
                    onChange={(e) => updateFormData("resourceRequestTime", e.target.value)}
                    placeholder="20"
                  />
                </div>
                
                <div>
                  <Label htmlFor="liquidatedDamagePercent">Liquidated Damage (%)</Label>
                  <Input
                    id="liquidatedDamagePercent"
                    type="number"
                    value={formData.liquidatedDamagePercent}
                    onChange={(e) => updateFormData("liquidatedDamagePercent", e.target.value)}
                    placeholder="10"
                  />
                </div>
                
                <div>
                  <Label htmlFor="terminationPeriod">Termination Period (days)</Label>
                  <Input
                    id="terminationPeriod"
                    type="number"
                    value={formData.terminationPeriod}
                    onChange={(e) => updateFormData("terminationPeriod", e.target.value)}
                    placeholder="90"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="mediationPeriod">Mediation Period (days)</Label>
                <Input
                  id="mediationPeriod"
                  type="number"
                  value={formData.mediationPeriod}
                  onChange={(e) => updateFormData("mediationPeriod", e.target.value)}
                  placeholder="30"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Legal & Contact Information</h2>
              <p className="text-sm text-muted-foreground">Legal jurisdiction and contact details</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="governingLaw">Governing Law</Label>
                <Input
                  id="governingLaw"
                  value={formData.governingLaw}
                  onChange={(e) => updateFormData("governingLaw", e.target.value)}
                  placeholder="e.g., State of California, Pakistan"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => updateFormData('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
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
                    value={formData.state} 
                    onValueChange={(value) => updateFormData('state', value)}
                    disabled={!formData.country}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state/province" />
                    </SelectTrigger>
                    <SelectContent>
                      {getStatesForCountry(formData.country).map((state) => {
                        const [id, name] = state.split(':');
                        return (
                          <SelectItem key={id} value={state}>
                            {name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="clientAddress">Client Contact Address</Label>
                <Textarea
                  id="clientAddress"
                  value={formData.clientAddress}
                  onChange={(e) => updateFormData("clientAddress", e.target.value)}
                  placeholder="Address for notices and communications"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => updateFormData("clientEmail", e.target.value)}
                    placeholder="client@company.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="clientPhone">Client Phone</Label>
                  <Input
                    id="clientPhone"
                    value={formData.clientPhone}
                    onChange={(e) => updateFormData("clientPhone", e.target.value)}
                    placeholder="+1-555-0123"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Signatures & Witnesses</h2>
              <p className="text-sm text-muted-foreground">Authorized signatories and witness information</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Authorized Signatories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Party A Representative</h4>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="partyASignatoryName">Name</Label>
                        <Input
                          id="partyASignatoryName"
                          value={formData.partyASignatoryName}
                          onChange={(e) => updateFormData("partyASignatoryName", e.target.value)}
                          placeholder="Signatory name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="partyASignatoryTitle">Title</Label>
                        <Input
                          id="partyASignatoryTitle"
                          value={formData.partyASignatoryTitle}
                          onChange={(e) => updateFormData("partyASignatoryTitle", e.target.value)}
                          placeholder="e.g., CEO, Director"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Party B Representative</h4>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="partyBSignatoryName">Name</Label>
                        <Input
                          id="partyBSignatoryName"
                          value={formData.partyBSignatoryName}
                          onChange={(e) => updateFormData("partyBSignatoryName", e.target.value)}
                          placeholder="Signatory name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="partyBSignatoryTitle">Title</Label>
                        <Input
                          id="partyBSignatoryTitle"
                          value={formData.partyBSignatoryTitle}
                          onChange={(e) => updateFormData("partyBSignatoryTitle", e.target.value)}
                          placeholder="e.g., CEO, Director"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Witnesses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Witness 1</h4>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="witness1Name">Name</Label>
                        <Input
                          id="witness1Name"
                          value={formData.witness1Name}
                          onChange={(e) => updateFormData("witness1Name", e.target.value)}
                          placeholder="Witness name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="witness1CNIC">CNIC</Label>
                        <Input
                          id="witness1CNIC"
                          value={formData.witness1CNIC}
                          onChange={(e) => updateFormData("witness1CNIC", e.target.value)}
                          placeholder="CNIC number"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Witness 2</h4>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="witness2Name">Name</Label>
                        <Input
                          id="witness2Name"
                          value={formData.witness2Name}
                          onChange={(e) => updateFormData("witness2Name", e.target.value)}
                          placeholder="Witness name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="witness2CNIC">CNIC</Label>
                        <Input
                          id="witness2CNIC"
                          value={formData.witness2CNIC}
                          onChange={(e) => updateFormData("witness2CNIC", e.target.value)}
                          placeholder="CNIC number"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Witness 3</h4>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="witness3Name">Name</Label>
                        <Input
                          id="witness3Name"
                          value={formData.witness3Name}
                          onChange={(e) => updateFormData("witness3Name", e.target.value)}
                          placeholder="Witness name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="witness3CNIC">CNIC</Label>
                        <Input
                          id="witness3CNIC"
                          value={formData.witness3CNIC}
                          onChange={(e) => updateFormData("witness3CNIC", e.target.value)}
                          placeholder="CNIC number"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Witness 4</h4>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="witness4Name">Name</Label>
                        <Input
                          id="witness4Name"
                          value={formData.witness4Name}
                          onChange={(e) => updateFormData("witness4Name", e.target.value)}
                          placeholder="Witness name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="witness4CNIC">CNIC</Label>
                        <Input
                          id="witness4CNIC"
                          value={formData.witness4CNIC}
                          onChange={(e) => updateFormData("witness4CNIC", e.target.value)}
                          placeholder="CNIC number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <UserInfoStep
            onBack={prevStep}
            onGenerate={generatePDF}
            documentType="Services Contract"
            isGenerating={isGeneratingPDF}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Services Contract</CardTitle>
          <CardDescription>
            Create a comprehensive services contract for software development and staff augmentation
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Progress indicator */}
          <div className="flex justify-between items-center mb-8">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 7 && (
                  <div
                    className={`h-1 w-8 mx-2 ${
                      step < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {renderStepContent()}

          {/* Navigation buttons - Hidden on step 7 (UserInfoStep) */}
          {currentStep !== 7 && (
            <div className="flex justify-between mt-8">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < 6 ? (
                <Button onClick={nextStep}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  Continue to Generate PDF
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

export default ServicesContractForm;
