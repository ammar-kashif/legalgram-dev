import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, FileText, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Country, State } from 'country-state-city';
import jsPDF from 'jspdf';

interface FormData {
  // Location Information
  country: string;
  state: string;
  
  // Agreement Date
  agreementDate: string;
  
  // Licensor Information
  licensorName: string;
  licensorAddress: string;
  
  // Licensee Information
  licenseeName: string;
  licenseeAddress: string;
  
  // Licensed Property Information
  licensedProperty: string;
  merchandiseItems: string;
  
  // Territory
  territory: string;
  
  // Payment Information
  initialLicensingFee: string;
  royaltyPercentage: string;
  royaltyCalculation: string;
  
  // Governing Law
  governingLaw: string;
  
  // Signature Information
  licensorSignatureName: string;
  licensorSignatureDate: string;
  licenseeSignatureName: string;
  licenseeSignatureDate: string;
}

const MerchandisingAgreementForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    country: "",
    state: "",
    agreementDate: "",
    licensorName: "",
    licensorAddress: "",
    licenseeName: "",
    licenseeAddress: "",
    licensedProperty: "",
    merchandiseItems: "",
    territory: "",
    initialLicensingFee: "",
    royaltyPercentage: "",
    royaltyCalculation: "",
    governingLaw: "",
    licensorSignatureName: "",
    licensorSignatureDate: "",
    licenseeSignatureName: "",
    licenseeSignatureDate: "",
  });

  const countries = Country.getAllCountries();
  const states = formData.country ? State.getStatesOfCountry(formData.country) : [];

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 30;

    // Helper function to add text with line breaks
    const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      
      lines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 30;
        }
        doc.text(line, margin, yPosition);
        yPosition += 6;
      });
      yPosition += 3; // Extra space after paragraphs
    };

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("MERCHANDISING AGREEMENT", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 20;

    // Agreement opening
    addText(`This Merchandising Agreement ("Agreement") is entered into on ${formData.agreementDate || "____________"}, by and between ${formData.licensorName || "___________________________"}, with an address at ${formData.licensorAddress || "___________________________"} ("Licensor"), and ${formData.licenseeName || "___________________________"}, with an address at ${formData.licenseeAddress || "___________________________"} ("Licensee").`);

    addText(`For the purposes of this Agreement, the party granting the rights to the Licensed Property shall be referred to as the "Licensor," and the party receiving the rights to use the Licensed Property shall be referred to as the "Licensee."`);

    addText("The parties agree to the following terms:");

    // Section 1: Grant of License
    addText("1. GRANT OF LICENSE", 12, true);
    addText(`Licensor is the sole owner of the following intellectual property: ${formData.licensedProperty || "___________________________"} ("Licensed Property").`);
    addText(`Subject to the terms of this Agreement, Licensor hereby grants to Licensee a limited, non-exclusive license to use the Licensed Property solely in connection with the design, marketing, manufacture, distribution, and sale of the following merchandise items ("Products"): ${formData.merchandiseItems || "___________________________"}.`);
    addText("Licensor retains all ownership and intellectual property rights to the Licensed Property. Licensee agrees not to use the Licensed Property in any unauthorized way outside the scope of this Agreement.");

    // Section 2: Territory
    addText("2. TERRITORY", 12, true);
    addText(`The rights granted under this Agreement are limited to the following geographical area: ${formData.territory || "___________________________"} ("Territory").`);
    addText("Licensee agrees not to market, sell, or distribute the Products outside the Territory or to any third party that may distribute outside the Territory.");

    // Section 3: Payment
    addText("3. PAYMENT", 12, true);
    addText(`Upon execution of this Agreement, Licensee shall pay Licensor an initial licensing fee of $${formData.initialLicensingFee || "__________"}.`);
    addText(`Additionally, Licensee shall pay Licensor a royalty of ${formData.royaltyPercentage || "__________"}% of gross sales revenue from the sale of Products incorporating the Licensed Property. Royalties shall be calculated as follows: ${formData.royaltyCalculation || "___________________________"}.`);
    addText("With each royalty payment, Licensee shall submit to Licensor a written statement detailing the calculation of the royalty and the quantities sold.");

    // Section 4: Records
    addText("4. RECORDS", 12, true);
    addText("Licensee shall keep accurate and complete records regarding the manufacture, distribution, and sale of Products.");
    addText("Such records shall be made available to Licensor upon reasonable written notice for inspection and audit purposes.");

    // Section 5: Modifications
    addText("5. MODIFICATIONS", 12, true);
    addText("Licensee may not alter, modify, or adapt the Licensed Property or Products in any manner without the Licensor's prior written consent.");

    // Section 6: Copyright and Trademark Notices
    addText("6. COPYRIGHT AND TRADEMARK NOTICES", 12, true);
    addText("(a) Copyright and Trademark Use:");
    addText(`All Products and packaging must clearly display appropriate copyright and trademark notices, including "© [Year] [Licensor's Name]" and any other notices requested by Licensor.`);
    addText("These notices must be placed in a visible location on all promotional, packaging, and distribution materials.");
    addText("(b) Approvals for Use:");
    addText("Prior to production, Licensee must submit to Licensor the following materials for written approval:");
    addText("All proposed artwork, mock-ups, samples, and prototypes of Products.");
    addText("All promotional materials, packaging, and advertisements.");
    addText("Applications for copyright or trademark registrations.");
    addText("No such items may be used or distributed without Licensor's prior written approval.");

    // Continue with remaining sections...
    addText("7. PROTECTION OF RIGHTS AND INTERESTS", 12, true);
    addText("Licensee agrees to protect and maintain the integrity of the Licensed Property.");
    addText("Licensee shall cooperate with Licensor in the enforcement of its intellectual property rights and shall execute all necessary documents to register or defend Licensor's rights, at Licensor's expense.");

    addText("8. GOODWILL AND PROTECTION", 12, true);
    addText("Licensee agrees that all goodwill arising from use of the Licensed Property shall inure solely to the benefit of the Licensor.");
    addText("Licensee shall not contest or challenge the validity of the Licensed Property, or Licensor's ownership of it, at any time.");

    addText("9. INDEMNIFICATION", 12, true);
    addText("Licensee shall indemnify and hold harmless Licensor and its affiliates, officers, directors, agents, and employees from any claims, damages, losses, or liabilities (including reasonable attorney's fees) arising from or related to:");
    addText("Licensee's breach of this Agreement;");
    addText("Manufacture, use, promotion, or sale of the Products;");
    addText("Alleged infringement of third-party rights resulting from use of the Licensed Property.");

    addText("10. CONFIDENTIALITY", 12, true);
    addText("Licensee agrees to maintain the confidentiality of any non-public, proprietary, or trade secret information disclosed by Licensor.");
    addText("This obligation shall survive the termination of this Agreement and remain in effect indefinitely.");

    addText("11. TERMINATION", 12, true);
    addText("This Agreement may be terminated by either party upon thirty (30) days' prior written notice.");
    addText("Upon termination:");
    addText("All rights granted to Licensee under this Agreement shall revert to Licensor;");
    addText("Licensee shall immediately cease using the Licensed Property;");
    addText("Licensee may sell off existing inventory for up to ninety (90) days, provided royalties are paid during this period.");
    addText("All unsold Products or materials bearing the Licensed Property shall be returned or destroyed.");

    addText("12. ENTIRE AGREEMENT", 12, true);
    addText("This Agreement constitutes the entire understanding between the parties regarding the Licensed Property and supersedes all prior discussions or agreements, whether oral or written.");

    addText("13. AMENDMENTS", 12, true);
    addText("This Agreement may only be amended or modified through a written instrument signed by both parties.");

    addText("14. SEVERABILITY", 12, true);
    addText("If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.");

    addText("15. WAIVER OF CONTRACTUAL RIGHT", 12, true);
    addText("A waiver by either party of any provision of this Agreement shall not constitute a waiver of any other provision or subsequent breach.");

    addText("16. FORCE MAJEURE", 12, true);
    addText("Neither party shall be held liable for delays or failure to perform under this Agreement due to causes beyond their reasonable control, including acts of God, natural disasters, pandemics, labor strikes, or government regulations.");

    addText("17. GOVERNING LAW", 12, true);
    addText(`This Agreement shall be governed by and interpreted in accordance with the laws of the State of ${formData.governingLaw || "___________________________"}.`);

    addText("18. HEADINGS", 12, true);
    addText("The section headings in this Agreement are for reference only and shall not affect its interpretation.");

    addText("19. NOTICES", 12, true);
    addText("All notices under this Agreement shall be given in writing and delivered to the addresses set forth above by hand delivery, certified mail, or recognized courier service.");

    addText("20. SIGNATURES", 12, true);
    addText("This Agreement shall be executed by the authorized representatives of both parties:");
    yPosition += 10;

    addText("Licensor:");
    addText("By: ___________________________________");
    addText(`Name: ${formData.licensorSignatureName || "___________________________"}`);
    addText(`Date: ${formData.licensorSignatureDate || "___________________________"}`);
    yPosition += 10;

    addText("Licensee:");
    addText("By: ___________________________________");
    addText(`Name: ${formData.licenseeSignatureName || "___________________________"}`);
    addText(`Date: ${formData.licenseeSignatureDate || "___________________________"}`);

    doc.save('merchandising-agreement.pdf');
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Location & Jurisdiction</CardTitle>
              <CardDescription>Select your country and state for legal jurisdiction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select value={formData.country} onValueChange={(value) => updateFormData('country', value)}>
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
                  <Select value={formData.state} onValueChange={(value) => updateFormData('state', value)}>
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
              </div>
              <div>
                <Label htmlFor="governingLaw">Governing Law State *</Label>
                <Input
                  id="governingLaw"
                  value={formData.governingLaw}
                  onChange={(e) => updateFormData('governingLaw', e.target.value)}
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
              <CardTitle>Agreement Details</CardTitle>
              <CardDescription>Basic agreement information and parties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="agreementDate">Agreement Date *</Label>
                <Input
                  id="agreementDate"
                  type="date"
                  value={formData.agreementDate}
                  onChange={(e) => updateFormData('agreementDate', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="licensorName">Licensor Name *</Label>
                  <Input
                    id="licensorName"
                    value={formData.licensorName}
                    onChange={(e) => updateFormData('licensorName', e.target.value)}
                    placeholder="Name of the property owner"
                  />
                </div>
                <div>
                  <Label htmlFor="licenseeName">Licensee Name *</Label>
                  <Input
                    id="licenseeName"
                    value={formData.licenseeName}
                    onChange={(e) => updateFormData('licenseeName', e.target.value)}
                    placeholder="Name of the merchandiser"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="licensorAddress">Licensor Address *</Label>
                  <Textarea
                    id="licensorAddress"
                    value={formData.licensorAddress}
                    onChange={(e) => updateFormData('licensorAddress', e.target.value)}
                    placeholder="Full address of the licensor"
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <Label htmlFor="licenseeAddress">Licensee Address *</Label>
                  <Textarea
                    id="licenseeAddress"
                    value={formData.licenseeAddress}
                    onChange={(e) => updateFormData('licenseeAddress', e.target.value)}
                    placeholder="Full address of the licensee"
                    className="min-h-[80px]"
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
              <CardTitle>Licensed Property & Products</CardTitle>
              <CardDescription>Define what will be licensed and how it will be used</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="licensedProperty">Licensed Property Description *</Label>
                <Textarea
                  id="licensedProperty"
                  value={formData.licensedProperty}
                  onChange={(e) => updateFormData('licensedProperty', e.target.value)}
                  placeholder="Describe the intellectual property being licensed (e.g., brand name, logo, character, artwork, etc.)"
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="merchandiseItems">Merchandise Items *</Label>
                <Textarea
                  id="merchandiseItems"
                  value={formData.merchandiseItems}
                  onChange={(e) => updateFormData('merchandiseItems', e.target.value)}
                  placeholder="List the specific types of merchandise that will feature the licensed property (e.g., t-shirts, mugs, posters, toys, etc.)"
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="territory">Territory *</Label>
                <Input
                  id="territory"
                  value={formData.territory}
                  onChange={(e) => updateFormData('territory', e.target.value)}
                  placeholder="Geographic area where products can be sold (e.g., United States, North America, Worldwide)"
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
              <CardDescription>Define licensing fees and royalty structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="initialLicensingFee">Initial Licensing Fee *</Label>
                <Input
                  id="initialLicensingFee"
                  value={formData.initialLicensingFee}
                  onChange={(e) => updateFormData('initialLicensingFee', e.target.value)}
                  placeholder="Enter amount (numbers only, e.g., 5000)"
                />
              </div>

              <div>
                <Label htmlFor="royaltyPercentage">Royalty Percentage *</Label>
                <Input
                  id="royaltyPercentage"
                  value={formData.royaltyPercentage}
                  onChange={(e) => updateFormData('royaltyPercentage', e.target.value)}
                  placeholder="Enter percentage (numbers only, e.g., 10)"
                />
              </div>

              <div>
                <Label htmlFor="royaltyCalculation">Royalty Calculation Details *</Label>
                <Textarea
                  id="royaltyCalculation"
                  value={formData.royaltyCalculation}
                  onChange={(e) => updateFormData('royaltyCalculation', e.target.value)}
                  placeholder="Describe how royalties will be calculated (e.g., based on net sales, gross sales, wholesale price, etc.)"
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Signature Information</CardTitle>
              <CardDescription>Provide details for the signature section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="licensorSignatureName">Licensor Signature Name *</Label>
                  <Input
                    id="licensorSignatureName"
                    value={formData.licensorSignatureName}
                    onChange={(e) => updateFormData('licensorSignatureName', e.target.value)}
                    placeholder="Name for licensor signature"
                  />
                </div>
                <div>
                  <Label htmlFor="licensorSignatureDate">Licensor Signature Date</Label>
                  <Input
                    id="licensorSignatureDate"
                    type="date"
                    value={formData.licensorSignatureDate}
                    onChange={(e) => updateFormData('licensorSignatureDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="licenseeSignatureName">Licensee Signature Name *</Label>
                  <Input
                    id="licenseeSignatureName"
                    value={formData.licenseeSignatureName}
                    onChange={(e) => updateFormData('licenseeSignatureName', e.target.value)}
                    placeholder="Name for licensee signature"
                  />
                </div>
                <div>
                  <Label htmlFor="licenseeSignatureDate">Licensee Signature Date</Label>
                  <Input
                    id="licenseeSignatureDate"
                    type="date"
                    value={formData.licenseeSignatureDate}
                    onChange={(e) => updateFormData('licenseeSignatureDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Agreement Summary:</h3>
                <p className="text-sm text-gray-700">
                  <strong>Licensor:</strong> {formData.licensorName}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Licensee:</strong> {formData.licenseeName}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Property:</strong> {formData.licensedProperty}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Products:</strong> {formData.merchandiseItems}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Initial Fee:</strong> ${formData.initialLicensingFee}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Royalty:</strong> {formData.royaltyPercentage}%
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={generatePDF}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate Merchandising Agreement PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Merchandising Agreement</h1>
            <p className="text-lg text-gray-600">
              Step {currentStep} of 5: Create a comprehensive merchandising license agreement
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
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
          
          {currentStep < 5 && (
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

export default MerchandisingAgreementForm;
