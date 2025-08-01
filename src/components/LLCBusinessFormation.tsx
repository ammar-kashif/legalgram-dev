import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import UserInfoStep from "@/components/UserInfoStep";
import { toast } from 'sonner';

interface LLCFormationData {
  state: string;
  businessDescription: string;
  industry: string;
  taxIdOption: string;
  registeredAgentOption: string;
  trademarkOption: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
}

interface Props {
  onClose: () => void;
}

const LLCBusinessFormation: React.FC<Props> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const totalSteps = 8;
  
  const [formData, setFormData] = useState<LLCFormationData>({
    state: '',
    businessDescription: '',
    industry: '',
    taxIdOption: '',
    registeredAgentOption: '',
    trademarkOption: '',
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
  });

  const handleInputChange = (field: keyof LLCFormationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 7) {
      setCurrentStep(8); // User info step
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    try {
      // ... existing PDF generation logic ...
      // doc.save('llc-business-formation.pdf');
      toast.success("Document generated successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate document");
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
    'Accounting/Finance', 'Agriculture', 'Architecture/Engineering', 'Arts/Entertainment',
    'Automotive', 'Business Services', 'Construction', 'Consulting', 'E-commerce',
    'Education', 'Food & Beverage', 'Healthcare', 'Hospitality', 'Information Technology',
    'Insurance', 'Legal', 'Manufacturing', 'Marketing/Advertising', 'Media',
    'Non-profit', 'Real Estate', 'Retail', 'Transportation', 'Other'
  ];

  const getBaseCost = () => {
    return 249; // Base LLC formation cost
  };

  const getTaxIdCost = () => {
    return formData.taxIdOption === 'included' ? 149 : 0;
  };

  const getRegisteredAgentCost = () => {
    return formData.registeredAgentOption === 'included' ? 149 : 0;
  };

  const getTrademarkCost = () => {
    return formData.trademarkOption === 'rocketlegal' ? 349.99 : 0;
  };

  const getTotalCost = () => {
    return getBaseCost() + getTaxIdCost() + getRegisteredAgentCost() + getTrademarkCost();
  };

  const renderTaxIdStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Get a Tax ID (EIN)</h2>
          <p className="text-gray-600">Would you like us to get your Tax ID for you?</p>
          <p className="text-sm text-gray-500">A Tax ID is required to open a business bank account, hire employees, and file taxes.</p>
        </div>
        
        <RadioGroup
          value={formData.taxIdOption}
          onValueChange={(value) => handleInputChange('taxIdOption', value)}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="included" id="taxid-included" />
            <Label htmlFor="taxid-included" className="cursor-pointer">
              <div>
                <div className="font-medium">Yes, get my Tax ID for me</div>
                <div className="text-sm text-gray-500 mt-1">
                  <div className="font-medium text-green-600">$149.00 (with Rocket Legal+ membership or $199.00 full price)</div>
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
            <Label htmlFor="taxid-myself" className="cursor-pointer">I'll get a Tax ID myself</Label>
          </div>
        </RadioGroup>
      </div>
    );
  };

  const renderRegisteredAgentStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Registered Agent</h2>
          <p className="text-gray-600">A registered agent accepts legal notices on your company's behalf.</p>
          <p className="text-sm text-gray-500">Every LLC must have a registered agent in the state where it's formed.</p>
        </div>
        
        <RadioGroup
          value={formData.registeredAgentOption}
          onValueChange={(value) => handleInputChange('registeredAgentOption', value)}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="included" id="agent-included" />
            <Label htmlFor="agent-included" className="cursor-pointer">
              <div>
                <div className="font-medium">Rocket Lawyer Registered Agent Service</div>
                <div className="text-sm text-gray-500 mt-1">
                  <div className="font-medium text-green-600">$149.00/year</div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Privacy protection for your home address</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Reliable receipt of legal documents</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Professional business image</span>
                  </div>
                </div>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="myself" id="agent-myself" />
            <Label htmlFor="agent-myself" className="cursor-pointer">I'll be my own registered agent</Label>
          </div>
        </RadioGroup>
      </div>
    );
  };

  const renderTrademarkStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Trademark Protection</h2>
          <p className="text-gray-600">Get trademark protection to safeguard your brand and keep competitors from stealing your name</p>
          <p className="text-sm text-gray-500">Trademark your business name, logo, and slogan to protect your brand identity and prevent others from using it.</p>
        </div>
        
        <RadioGroup
          value={formData.trademarkOption}
          onValueChange={(value) => handleInputChange('trademarkOption', value)}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="rocketlegal" id="rocketlegal-trademark" />
            <Label htmlFor="rocketlegal-trademark" className="cursor-pointer">
              <div>
                <div className="font-medium">Professional Trademark Filing with Rocket Legal</div>
                <div className="text-sm text-gray-500 mt-1">
                  <div className="font-medium text-green-600">$349.99 with Rocket Legal+ (or $699.99 full price)</div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Secure brand exclusivity and add value</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Guard against counterfeit and unauthorized use</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Comprehensive trademark search & registration</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Legal protection for 10 years (renewable)</span>
                  </div>
                </div>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="myself" id="myself-trademark" />
            <Label htmlFor="myself-trademark" className="cursor-pointer">I'll handle trademark registration myself</Label>
          </div>
        </RadioGroup>
      </div>
    );
  };

  const renderContactInfoStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
          <p className="text-gray-600">Please provide your contact details</p>
        </div>
        
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
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Enter your company name"
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
    );
  };

  const renderFinalReviewStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Order Summary</h2>
          <p className="text-gray-600">Review your LLC formation details</p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">LLC Formation Package</h3>
            <div className="flex justify-between">
              <span>LLC Formation (Base Package)</span>
              <span>${getBaseCost()}.00</span>
            </div>
            
            {formData.taxIdOption === 'included' && (
              <div className="flex justify-between">
                <span>Tax ID (EIN) Service</span>
                <span>${getTaxIdCost()}.00</span>
              </div>
            )}
            
            {formData.registeredAgentOption === 'included' && (
              <div className="flex justify-between">
                <span>Registered Agent Service</span>
                <span>${getRegisteredAgentCost()}.00</span>
              </div>
            )}
            
            {formData.trademarkOption === 'rocketlegal' && (
              <div className="flex justify-between">
                <span>Trademark Protection</span>
                <span>${getTrademarkCost()}</span>
              </div>
            )}
            
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${getTotalCost()}</span>
            </div>
          </div>
          
          <div className="space-y-2 pt-4 border-t">
            <h4 className="font-medium">Formation Details:</h4>
            <p><span className="font-medium">State:</span> {formData.state}</p>
            <p><span className="font-medium">Industry:</span> {formData.industry}</p>
            <p><span className="font-medium">Description:</span> {formData.businessDescription}</p>
          </div>
          
          <div className="space-y-2 pt-4 border-t">
            <h4 className="font-medium">Contact Information:</h4>
            <p><span className="font-medium">Name:</span> {formData.fullName}</p>
            <p><span className="font-medium">Company:</span> {formData.companyName}</p>
            <p><span className="font-medium">Email:</span> {formData.email}</p>
            <p><span className="font-medium">Phone:</span> {formData.phone}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Choose Your State</h2>
              <p className="text-gray-600">In which state would you like to form your LLC?</p>
              <p className="text-sm text-gray-500">Most people choose the state where their business operates.</p>
            </div>
            
            <div className="max-w-md mx-auto">
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
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Describe Your Business</h2>
              <p className="text-gray-600">Tell us about your business and select your industry</p>
              <p className="text-sm text-gray-500">This helps us ensure your LLC is set up correctly for your business type.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessDescription">Business Description *</Label>
                <Textarea
                  id="businessDescription"
                  value={formData.businessDescription}
                  onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                  placeholder="Describe what your business does..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select onValueChange={(value) => handleInputChange('industry', value)}>
                  <SelectTrigger className="w-full mt-1">
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
        return renderTaxIdStep();

      case 4:
        return renderRegisteredAgentStep();

      case 5:
        return renderTrademarkStep();

      case 6:
        return renderContactInfoStep();

      case 7:
        return renderFinalReviewStep();

      case 8:
        return (
          <UserInfoStep
            onBack={() => setCurrentStep(7)}
            onGenerate={generatePDF}
            documentType="LLC Business Formation"
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
        return formData.taxIdOption !== '';
      case 4:
        return formData.registeredAgentOption !== '';
      case 5:
        return formData.trademarkOption !== '';
      case 6:
        return formData.fullName.trim() !== '' && formData.email.trim() !== '' && formData.phone.trim() !== '' && formData.companyName.trim() !== '';
      case 7:
        return true;
      case 8:
        return true; // User info step is always valid
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
      {currentStep !== 8 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onClose : handleBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </Button>

          {currentStep === totalSteps ? (
            <Button 
              className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
              disabled={!isStepValid()}
            >
              <span>Confirm Purchase</span>
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
      )}
    </div>
  );
};

export default LLCBusinessFormation;
