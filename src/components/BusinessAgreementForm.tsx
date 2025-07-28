import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
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

interface BusinessAgreementData {
  agreementDate: string;
  firstPartyName: string;
  firstPartyAddress: string;
  secondPartyName: string;
  secondPartyAddress: string;
  businessName: string;
  deductionAmount: string;
  projectDetails: string;
  commissionAmount: string;
  businessDetails: string;
  penaltyAmount: string;
  deductionPercentage: string;
  constructionTimePeriod: string;
  companyName: string;
  signingDate: string;
  country: string;
  state: string;
}

const BusinessAgreementForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formData, setFormData] = useState<BusinessAgreementData>({
    agreementDate: '',
    firstPartyName: '',
    firstPartyAddress: '',
    secondPartyName: '',
    secondPartyAddress: '',
    businessName: '',
    deductionAmount: '',
    projectDetails: '',
    commissionAmount: '',
    businessDetails: '',
    penaltyAmount: '',
    deductionPercentage: '',
    constructionTimePeriod: '',
    companyName: '',
    signingDate: '',
    country: '',
    state: ''
  });

  const totalSteps = 5;

  const handleInputChange = (field: keyof BusinessAgreementData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update state options when country changes
    if (field === 'country') {
      // Reset state selection when country changes
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

  const canAdvanceStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.country && formData.state && formData.agreementDate && formData.firstPartyName && formData.firstPartyAddress && formData.secondPartyName && formData.secondPartyAddress);
      case 2:
        return !!(formData.businessName && formData.deductionAmount && formData.projectDetails);
      case 3:
        return !!(formData.commissionAmount && formData.businessDetails && formData.penaltyAmount && formData.deductionPercentage);
      case 4:
        return !!(formData.constructionTimePeriod && formData.companyName && formData.signingDate);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps && canAdvanceStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === totalSteps && canAdvanceStep(currentStep)) {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("BUSINESS AGREEMENT", 105, 30, { align: "center" });
    
    let yPosition = 50;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Agreement content
    const content = `THIS BUSINESS AGREEMENT IS MADE on this ${formData.agreementDate}, between:

"${formData.firstPartyName.toUpperCase()}" (hereinafter referred to as the "1st party", which expression shall, where the context so admits, include their respective legal heirs, successors-in-interest, and permitted assigns);

And

"${formData.secondPartyName.toUpperCase()}" (hereinafter referred to as the "2nd party", which expression shall, where the context so admits, include their respective legal heirs, successors-in-interest, and permitted assigns);

WHEREAS both the parties hereby with their own free consent agree to initiate the business through this agreement upon the following terms and conditions:

That the first party is the owner of a project namely ${formData.businessName} and this business agreement is being executed in relation to this aforementioned project.

That all the exclusive rights pertaining to marketing and sales of the subject matter project are exclusively associated with second party, however first party is allowed to sale any part thereof subject to deduction of ${formData.deductionAmount} from the second party's rebate/share.

That the second party during marketing will perform duties such as Digital Marketing, Print Media, Outdoor Marketing, Bill Boards, TVC Ads.

That the second party will develop a complete marketing campaign and will generate revenue for the project from the market.

That the second party is bound to accommodate the investors/clients/parties associated with the first party.

That there shall be a meeting between the Board of Directors (BoD) after every ten days, whereby the development of the project will be discussed.

That all the transactions between the first and the second party shall only be done through banking channel.

That the amount of taxes applicable upon the respected shares in business of both the parties shall be paid to the Government by the respective parties themselves and none of the parties to the current agreement will deduct such taxes from the payable amount of the other party.

That the second party will utilize all the necessary measures to sell ${formData.projectDetails}

That all the mega events will be arranged and executed with the mutual consent of both the parties to the current agreement.

That the sample of the documentation required to sell the project units will be drafted with mutual consent of both the parties.

That the second party will charge an amount ${formData.commissionAmount} of the total amount of units sold and the relevant document to execute/transfer.

That the second party is at its free will to acquire/book/hold any unit of the said project (also in lieu of its due payment, moreover the first party shall have no objection to it).

That for the purposes of Development, Extension in area ${formData.businessDetails} the first party is duly bound to consult the second party and proceed in a manner as arrived with mutual consent.

That both the parties are bound to fulfill their respective commitments with respect to investments, however (in case) if first party ends this business agreement with second party then in that instance the first party is under an obligation that he shall fulfill all the commitments with all the clients/investors of the second party, moreover the first party shall be bound to pay to the second party, a sum of amount equivalent to ${formData.penaltyAmount} of all the sales made by the second party since the date of execution of this agreement to such date of violation. Similarly, if second party puts an end to this business agreement with first party then the first party is empowered to deduct an amount equivalent to ${formData.deductionPercentage} of the pending payments w.r.t to the sale commission of the units sold.

That the second party exclusively has all the rights to delegate 'Sales Rights' to other agents in the market and the second party is empowered to plan strategies/rules for sales of subject property and is bound to produce/achieve good results of sale, however the first party will not advertise any marketing papers etc. in the market on his own as all the rights to advertise the sale of subject units are reserved with the second party.

That the term of this business agreement is agreed to be for such time period till such time the sale (Booking) of all the units of said property is complete, moreover both the parties agree that the terms and conditions of this business agreement are also applicable to the legal heirs of both parties and all the legal heirs of both parties are duly bound to abide by the same.

That the first party is duly bound to ensure that the subject land (shall be free from any kind of lien, mortgage, pledge, loan including any kind of disputes (what-so-ever) and in case any dispute regarding such land arises (in future) then it is expressly declared by both the parties that any such responsibility arising out of any such discrepancy/omission/commission shall be the sole responsibility of the first party and no burden/responsibility shall be imposed on the second party in any manner what-so-ever. Moreover, it is stated for the removal of any doubt that in case of any inquiry/investigation by any government department/authority relating to any such issues of the land, the sole responsibility is on the first party only, and no allegation/burden/penalty or responsibility of and such proceeding shall apply on the second party. First party will provide all the approval documents of all concerning authorities within 4 months of signing of this agreement.

That the first party will provide all the relevant documents of the subject land including the 2D & 3D drawings to the second party, moreover the first party hereby ensures the second party that the development work on the subject matter project will not be stopped/halted. Furthermore, the first party ensures the second party that the size of the subject units (being sold to the clients) will be exact (at the time of possession) as per the drawings provided.

That all the payments of authorities and Government taxes what-so-ever shall be paid by the first party, moreover the development of the subject property is the sole responsibility of the first party who shall complete the construction of subject property within a time period of ${formData.constructionTimePeriod} starting from the date of execution of this agreement.

Second party will ensure that all the payments are being submitted in the bank account.

That the first party hereby ensures the second party that the quality of construction will strictly adhere to the standards as agreed/provided to the second party. Otherwise, second party has a right to takeover the construction contract and proceed the further construction work.

Every transaction will be done via bank account. ${formData.companyName} will transfer the proportional land to the customer's name at the time of possession.

That both the parties have read and understood the above terms and conditions and with their own free consent and will have set their respective hands on this business agreement on ${formData.signingDate} in the presence of witnesses.


Signature & Thumb Impression:

FIRST PARTY                                    SECOND PARTY


...........................                    ......................................

${formData.firstPartyName}                     ${formData.secondPartyName}
${formData.firstPartyAddress}                  ${formData.secondPartyAddress}`;

    // Split content into lines and add to PDF
    const lines = doc.splitTextToSize(content, 170);
    let currentY = yPosition;
    
    for (let i = 0; i < lines.length; i++) {
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
      doc.text(lines[i], 20, currentY);
      currentY += 6;
    }

      doc.save('business-agreement.pdf');
      toast.success("Business Agreement PDF generated successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate document");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderFormSummary = () => {
    const countryName = formData.country ? getCountryName(formData.country.split(':')[0]) : '';
    const stateName = formData.state ? getStateName(formData.country?.split(':')[0] || '', formData.state.split(':')[0]) : '';
    
    return (
      <div className="space-y-4 text-sm">
        <div>
          <strong>Agreement Date:</strong> {formData.agreementDate}
        </div>
        <div>
          <strong>First Party:</strong> {formData.firstPartyName}<br />
          <strong>Address:</strong> {formData.firstPartyAddress}
        </div>
        <div>
          <strong>Second Party:</strong> {formData.secondPartyName}<br />
          <strong>Address:</strong> {formData.secondPartyAddress}
        </div>
        <div>
          <strong>Business Name:</strong> {formData.businessName}<br />
          <strong>Project Details:</strong> {formData.projectDetails}<br />
          <strong>Business Details:</strong> {formData.businessDetails}
        </div>
        <div>
          <strong>Financial Terms:</strong><br />
          Deduction Amount: {formData.deductionAmount}<br />
          Commission Amount: {formData.commissionAmount}<br />
          Penalty Amount: {formData.penaltyAmount}<br />
          Deduction Percentage: {formData.deductionPercentage}
        </div>
        <div>
          <strong>Construction Period:</strong> {formData.constructionTimePeriod}<br />
          <strong>Company Name:</strong> {formData.companyName}<br />
          <strong>Signing Date:</strong> {formData.signingDate}
        </div>
        <div>
          <strong>Location:</strong><br />
          Country: {countryName}<br />
          State: {stateName}
        </div>
      </div>
    );
  };

  if (currentStep === 5) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm p-4">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <UserInfoStep
            onBack={handleBack}
            onGenerate={generatePDF}
            documentType="Business Agreement"
            isGenerating={isGeneratingPDF}
          />
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-600">Business Agreement Complete</CardTitle>
            <CardDescription>
              Review your Business Agreement details below before generating the final document.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderFormSummary()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => {
                setFormData({
                  agreementDate: '',
                  firstPartyName: '',
                  firstPartyAddress: '',
                  secondPartyName: '',
                  secondPartyAddress: '',
                  businessName: '',
                  deductionAmount: '',
                  projectDetails: '',
                  commissionAmount: '',
                  businessDetails: '',
                  penaltyAmount: '',
                  deductionPercentage: '',
                  constructionTimePeriod: '',
                  companyName: '',
                  signingDate: '',
                  country: '',
                  state: ''
                });
                setCurrentStep(1);
                setIsComplete(false);
              }}
            >
              Start Over
            </Button>
            <Button onClick={() => setCurrentStep(5)}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Continue to Generate PDF
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm p-4">
      <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Business Agreement</CardTitle>
          <CardDescription>
            Create a comprehensive business agreement between two parties
            <div className="mt-2 text-sm">
              Step {currentStep} of {totalSteps}
            </div>
          </CardDescription>
          {currentStep === 1 && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/business-agreement-info')}
                className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn More About Business Agreements
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location & Agreement Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
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
                    onValueChange={(value) => handleInputChange('state', value)}
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
                <Label htmlFor="agreementDate">Agreement Date</Label>
                <Input
                  id="agreementDate"
                  placeholder="Enter agreement date"
                  value={formData.agreementDate}
                  onChange={(e) => handleInputChange('agreementDate', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstPartyName">First Party Name</Label>
                  <Input
                    id="firstPartyName"
                    placeholder="Enter first party name"
                    value={formData.firstPartyName}
                    onChange={(e) => handleInputChange('firstPartyName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="secondPartyName">Second Party Name</Label>
                  <Input
                    id="secondPartyName"
                    placeholder="Enter second party name"
                    value={formData.secondPartyName}
                    onChange={(e) => handleInputChange('secondPartyName', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstPartyAddress">First Party Address</Label>
                  <Textarea
                    id="firstPartyAddress"
                    placeholder="Enter first party address"
                    value={formData.firstPartyAddress}
                    onChange={(e) => handleInputChange('firstPartyAddress', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="secondPartyAddress">Second Party Address</Label>
                  <Textarea
                    id="secondPartyAddress"
                    placeholder="Enter second party address"
                    value={formData.secondPartyAddress}
                    onChange={(e) => handleInputChange('secondPartyAddress', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Information</h3>
              <div>
                <Label htmlFor="businessName">Business/Project Name</Label>
                <Input
                  id="businessName"
                  placeholder="Enter business or project name"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="deductionAmount">Deduction Amount</Label>
                <Input
                  id="deductionAmount"
                  placeholder="Enter deduction amount from second party's share"
                  value={formData.deductionAmount}
                  onChange={(e) => handleInputChange('deductionAmount', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="projectDetails">Project Details</Label>
                <Textarea
                  id="projectDetails"
                  placeholder="Enter detailed description of the project"
                  value={formData.projectDetails}
                  onChange={(e) => handleInputChange('projectDetails', e.target.value)}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Financial Terms</h3>
              <div>
                <Label htmlFor="commissionAmount">Commission Amount</Label>
                <Input
                  id="commissionAmount"
                  placeholder="Enter commission amount for second party"
                  value={formData.commissionAmount}
                  onChange={(e) => handleInputChange('commissionAmount', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="businessDetails">Business Details</Label>
                <Textarea
                  id="businessDetails"
                  placeholder="Enter business development and extension details"
                  value={formData.businessDetails}
                  onChange={(e) => handleInputChange('businessDetails', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="penaltyAmount">Penalty Amount</Label>
                  <Input
                    id="penaltyAmount"
                    placeholder="Enter penalty amount for agreement termination"
                    value={formData.penaltyAmount}
                    onChange={(e) => handleInputChange('penaltyAmount', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="deductionPercentage">Deduction Percentage</Label>
                  <Input
                    id="deductionPercentage"
                    placeholder="Enter deduction percentage from pending payments"
                    value={formData.deductionPercentage}
                    onChange={(e) => handleInputChange('deductionPercentage', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Final Details</h3>
              <div>
                <Label htmlFor="constructionTimePeriod">Construction Time Period</Label>
                <Input
                  id="constructionTimePeriod"
                  placeholder="Enter time period for construction completion"
                  value={formData.constructionTimePeriod}
                  onChange={(e) => handleInputChange('constructionTimePeriod', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name for land transfer"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="signingDate">Signing Date</Label>
                <Input
                  id="signingDate"
                  placeholder="Enter date of agreement signing"
                  value={formData.signingDate}
                  onChange={(e) => handleInputChange('signingDate', e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!canAdvanceStep(currentStep)}
          >
            {currentStep === totalSteps ? (
              <>
                Complete <Send className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BusinessAgreementForm;
