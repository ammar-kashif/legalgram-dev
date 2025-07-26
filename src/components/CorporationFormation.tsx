import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import UserInfoStep from '@/components/UserInfoStep';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface CorporationFormationData {
  businessStructure: string;
  state: string;
  businessDescription: string;
  industry: string;
  sCorpElection: string;
  taxIdOption: string;
  registeredAgentOption: string;
  trademarkOption: string;
  filingSpeed: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
}

interface Props {
  onClose: () => void;
}

const CorporationFormation: React.FC<Props> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const totalSteps = 9;
  
  const [formData, setFormData] = useState<CorporationFormationData>({
    businessStructure: 'corporation',
    state: '',
    businessDescription: '',
    industry: '',
    sCorpElection: 'yes',
    taxIdOption: 'rocketlegal',
    registeredAgentOption: 'rocketlegal',
    trademarkOption: 'rocketlegal',
    filingSpeed: 'standard',
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
  });

  const handleInputChange = (field: keyof CorporationFormationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
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
      const pdf = new jsPDF();
      
      // Add title
      pdf.setFontSize(20);
      pdf.text('Articles of Incorporation', 20, 30);
      
      // Add content
      pdf.setFontSize(12);
      let yPosition = 50;
      
      pdf.text(`Business Structure: Corporation`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Formation State: ${formData.state}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Business Description: ${formData.businessDescription}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Industry: ${formData.industry}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`S-Corp Election: ${formData.sCorpElection === 'yes' ? 'Yes' : 'No'}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Tax ID Option: ${formData.taxIdOption}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Registered Agent: ${formData.registeredAgentOption}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Trademark Option: ${formData.trademarkOption}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Filing Speed: ${formData.filingSpeed}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Company Name: ${formData.companyName}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Contact: ${formData.fullName}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Email: ${formData.email}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Phone: ${formData.phone}`, 20, yPosition);
      
      // Save the PDF
      pdf.save('articles-of-incorporation.pdf');
      toast.success('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const industries = [
    'Technology/Software', 'Healthcare/Medical', 'Real Estate', 'Consulting/Professional Services',
    'Retail/E-commerce', 'Manufacturing', 'Food & Beverage', 'Media/Entertainment/Publishing',
    'Financial Services', 'Education/Training', 'Construction', 'Transportation/Logistics',
    'Marketing/Advertising', 'Legal Services', 'Automotive', 'Agriculture', 'Energy',
    'Nonprofit/Charity', 'Travel/Hospitality', 'Other'
  ];

  const calculateTotal = () => {
    let total = 239.99; // Rocket Legal+ Membership
    
    if (formData.registeredAgentOption === 'rocketlegal') {
      total += 124.99; // Registered Agent Service
    }
    
    if (formData.trademarkOption === 'rocketlegal') {
      total += 349.99; // Trademark Registration
    }
    
    if (formData.sCorpElection === 'yes') {
      total += 49.99; // S-Corp Election Service
    }
    
    // State filing fee
    total += 100.00; // Corporation State Government Filing Fee
    
    if (formData.filingSpeed === 'express') {
      total += 350.00; // Express Filing Rush Fee (in addition to standard $100)
    }
    
    return total;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Initial Setup – Entity & State Selection</h2>
              <p className="text-gray-600">Business Structure & Formation State</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Business Structure</Label>
                <p className="text-sm text-gray-500 mb-3">What type of business structure are you planning to file?</p>
                <div className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Corporation (C-Corp or S-Corp)</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-base font-medium">Formation State</Label>
                <p className="text-sm text-gray-500 mb-3">Where will your corporation be formed?</p>
                <Select onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
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
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Business Information</h2>
              <p className="text-gray-600">Business Activity Description & Industry Classification</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Business Activity Description</Label>
                <p className="text-sm text-gray-500 mb-3">What will your corporation be doing?</p>
                <Textarea
                  value={formData.businessDescription}
                  onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                  placeholder='A brief description is required to define the business operations. For example: "Providing IT consulting services" or "Managing real estate."'
                  rows={4}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-base font-medium">Industry Classification</Label>
                <p className="text-sm text-gray-500 mb-3">Select the industry category that best describes your corporation.</p>
                <Select onValueChange={(value) => handleInputChange('industry', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">S-Corp Election Assistance</h2>
              <p className="text-gray-600">S-Corporation Filing Support</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Would you like help classifying your corporation as an S-Corp?
              </p>
              <p className="text-sm text-gray-500">
                To be taxed as an S-Corporation, you must file IRS Form 2553, signed by all shareholders. Rocket Lawyer offers assistance for $49.99 with Rocket Legal+ or $99.99 full price.
              </p>
              
              <RadioGroup
                value={formData.sCorpElection}
                onValueChange={(value) => handleInputChange('sCorpElection', value)}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="yes" id="scorp-yes" />
                  <Label htmlFor="scorp-yes" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Yes, help me file S-Corp election</div>
                      <div className="text-sm text-gray-500 mt-1">
                        <div className="font-medium text-green-600">$49.99 with Rocket Legal+ ($99.99 full price)</div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Establish your business with the IRS</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Ensure readiness to operate legally</span>
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="no" id="scorp-no" />
                  <Label htmlFor="scorp-no" className="cursor-pointer">I'll do it myself</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Tax ID Number (EIN)</h2>
              <p className="text-gray-600">EIN Application Method</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                How would you like to get your new tax ID number?
              </p>
              <p className="text-sm text-gray-500">
                A tax ID (EIN) is necessary to hire employees, open a business bank account, or file taxes.
              </p>
              
              <RadioGroup
                value={formData.taxIdOption}
                onValueChange={(value) => handleInputChange('taxIdOption', value)}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="rocketlegal" id="taxid-rocketlegal" />
                  <Label htmlFor="taxid-rocketlegal" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Get my tax ID for me (Recommended)</div>
                      <div className="text-sm text-gray-500 mt-1">
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Establish your business with the IRS</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Ensure readiness to operate legally</span>
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="myself" id="taxid-myself" />
                  <Label htmlFor="taxid-myself" className="cursor-pointer">I'll do it myself</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Registered Agent Appointment</h2>
              <p className="text-gray-600">Choosing a Registered Agent</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Appoint a registered agent for your business.
              </p>
              <p className="text-sm text-gray-500">
                A registered agent is required to receive official legal and government documents on behalf of your corporation.
              </p>
              
              <RadioGroup
                value={formData.registeredAgentOption}
                onValueChange={(value) => handleInputChange('registeredAgentOption', value)}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="rocketlegal" id="agent-rocketlegal" />
                  <Label htmlFor="agent-rocketlegal" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Make Rocket Lawyer my Registered Agent</div>
                      <div className="text-sm text-gray-500 mt-1">
                        <div className="font-medium text-green-600">$124.99 with Rocket Legal+ ($249.99 full price)</div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Ensures you never miss official correspondence</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Avoids being served with legal paperwork at your business location</span>
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="myself" id="agent-myself" />
                  <Label htmlFor="agent-myself" className="cursor-pointer">I'll do it myself</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Trademark Protection</h2>
              <p className="text-gray-600">Trademark Filing</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Protect your business with a registered trademark.
              </p>
              
              <RadioGroup
                value={formData.trademarkOption}
                onValueChange={(value) => handleInputChange('trademarkOption', value)}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="rocketlegal" id="trademark-rocketlegal" />
                  <Label htmlFor="trademark-rocketlegal" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Get professional trademark filing</div>
                      <div className="text-sm text-gray-500 mt-1">
                        <div className="font-medium text-green-600">$349.99 with Rocket Legal+ ($699.99 full price)</div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Secures exclusivity and enhances brand value</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Protects against unauthorized usage or counterfeiting</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>All trademarks are researched and filed by licensed attorneys</span>
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="myself" id="trademark-myself" />
                  <Label htmlFor="trademark-myself" className="cursor-pointer">I'll do it myself</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Filing Speed</h2>
              <p className="text-gray-600">Filing Option Selection</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                How quickly do you need to make it official?
              </p>
              <p className="text-sm text-gray-500">
                Note: Mailing time for documents may affect overall timeline.
              </p>
              
              <RadioGroup
                value={formData.filingSpeed}
                onValueChange={(value) => handleInputChange('filingSpeed', value)}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="express" id="filing-express" />
                  <Label htmlFor="filing-express" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Express Filing</div>
                      <div className="text-sm text-gray-500 mt-1">
                        <div className="font-medium text-orange-600">$450.00</div>
                        <div>Completion in 5–7 business days</div>
                        <div>Includes $100.00 government fees + $350.00 rush fee</div>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="standard" id="filing-standard" />
                  <Label htmlFor="filing-standard" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Standard Filing</div>
                      <div className="text-sm text-gray-500 mt-1">
                        <div className="font-medium text-green-600">$100.00</div>
                        <div>Completion in 2–4 weeks</div>
                        <div>Includes state filing fee and electronic processing</div>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Review Application Summary & Checkout</h2>
              <p className="text-gray-600">Contact Information & Order Summary</p>
            </div>
            
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Primary Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyName">Business Name *</Label>
                    <Input
                      id="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Enter your business name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Business Details Summary */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Business Name:</span> {formData.companyName || 'Not specified'}
                  </div>
                  <div>
                    <span className="font-medium">State of Incorporation:</span> {formData.state || 'Not selected'}
                  </div>
                  <div>
                    <span className="font-medium">Entity Type:</span> Corporation (C-Corp or S-Corp)
                  </div>
                  <div>
                    <span className="font-medium">Industry Category:</span> {formData.industry || 'Not selected'}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Business Purpose:</span> {formData.businessDescription || 'Not provided'}
                  </div>
                </div>
              </div>

              {/* Membership Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Choose Your Membership</h3>
                <RadioGroup defaultValue="rocketlegal-plus" className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rocketlegal-plus" id="membership-plus" />
                    <Label htmlFor="membership-plus" className="cursor-pointer">Rocket Legal+ – $239.99/year</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rocketlegal-premium" id="membership-premium" />
                    <Label htmlFor="membership-premium" className="cursor-pointer">Rocket Legal Premium – $399.99/year</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Order Summary */}
              <div className="bg-blue-50 p-6 rounded-lg space-y-3">
                <h3 className="text-lg font-semibold">Order Summary Total</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Membership: Rocket Legal+</span>
                    <span>$239.99</span>
                  </div>
                  {formData.registeredAgentOption === 'rocketlegal' && (
                    <div className="flex justify-between">
                      <span>Registered Agent Service</span>
                      <span>$124.99</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>EIN</span>
                    <span>$0.00</span>
                  </div>
                  {formData.trademarkOption === 'rocketlegal' && (
                    <div className="flex justify-between">
                      <span>Trademark</span>
                      <span>$349.99</span>
                    </div>
                  )}
                  {formData.sCorpElection === 'yes' && (
                    <div className="flex justify-between">
                      <span>S-Corp Filing</span>
                      <span>$49.99</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Business Registration Filing</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>State Filing Fee ({formData.state || 'Selected State'})</span>
                    <span>$100.00</span>
                  </div>
                  {formData.filingSpeed === 'express' && (
                    <div className="flex justify-between">
                      <span>Express Filing Rush Fee</span>
                      <span>$350.00</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Section</h3>
                <p className="text-sm text-gray-500">Enter your credit card details to complete the purchase and finalize the registration.</p>
                <div className="space-y-3">
                  <Input placeholder="Card Number" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="MM/YY" />
                    <Input placeholder="CVC" />
                  </div>
                  <Input placeholder="ZIP Code" />
                </div>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <UserInfoStep
            onBack={handleBack}
            onGenerate={generatePDF}
            documentType="Articles of Incorporation"
            isGenerating={isGeneratingPDF}
          />
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.state !== '';
      case 2:
        return formData.businessDescription.trim() !== '' && formData.industry !== '';
      case 3:
        return formData.sCorpElection !== '';
      case 4:
        return formData.taxIdOption !== '';
      case 5:
        return formData.registeredAgentOption !== '';
      case 6:
        return formData.trademarkOption !== '';
      case 7:
        return formData.filingSpeed !== '';
      case 8:
        return formData.fullName.trim() !== '' && formData.email.trim() !== '' && formData.phone.trim() !== '' && formData.companyName.trim() !== '';
      case 9:
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-6">
        <CardContent className="p-8">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onClose : handleBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
        </Button>

        {currentStep === 9 ? null : currentStep === 8 ? (
          <Button 
            className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
            disabled={!isStepValid()}
            onClick={handleNext}
          >
            <span>Complete Purchase</span>
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            disabled={!isStepValid()}
            className="flex items-center space-x-2"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CorporationFormation;
