import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, CheckCircle, Building2 } from "lucide-react";

interface BusinessFormationFlowProps {
  onClose?: () => void;
}

interface FormData {
  businessStructure: string;
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

const BusinessFormationFlow: React.FC<BusinessFormationFlowProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    businessStructure: 'llc',
    state: '',
    businessDescription: '',
    industry: '',
    taxIdOption: 'rocketlegal',
    registeredAgentOption: 'rocketlegal',
    trademarkOption: 'rocketlegal',
    fullName: '',
    email: '',
    phone: '',
    companyName: ''
  });

  const totalSteps = 8;

  // US States list
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  // Industry categories
  const industries = [
    'Technology/Software', 'Healthcare/Medical', 'Real Estate', 'Consulting/Professional Services',
    'Retail/E-commerce', 'Manufacturing', 'Food & Beverage', 'Media/Entertainment/Publishing',
    'Financial Services', 'Education/Training', 'Construction', 'Transportation/Logistics',
    'Marketing/Advertising', 'Legal Services', 'Automotive', 'Agriculture', 'Energy',
    'Nonprofit/Charity', 'Travel/Hospitality', 'Other'
  ];

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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = () => {
    let total = 239.88; // RocketLegal+ Membership
    
    if (formData.registeredAgentOption === 'rocketlegal') {
      total += 124.99; // Registered Agent Service
    }
    
    if (formData.trademarkOption === 'rocketlegal') {
      total += 349.99; // Trademark Registration
    }
    
    total += 308.10; // Texas State Government Filing Fee (example)
    total += 69.99; // EIN / Tax ID Filing
    
    return total;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Choose Business Structure</h2>
              <p className="text-gray-600">Which business structure are you registering?</p>
              <p className="text-sm text-gray-500">Your chosen structure will determine how your business is taxed and managed.</p>
            </div>
            
            <RadioGroup
              value={formData.businessStructure}
              onValueChange={(value) => handleInputChange('businessStructure', value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="llc" id="llc" />
                <Label htmlFor="llc" className="flex items-center space-x-2 cursor-pointer">
                  <Building2 className="h-5 w-5" />
                  <span>Limited Liability Company (LLC)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="corp" id="corp" />
                <Label htmlFor="corp" className="flex items-center space-x-2 cursor-pointer">
                  <Building2 className="h-5 w-5" />
                  <span>Corporation (C-Corp or S-Corp)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="nonprofit" id="nonprofit" />
                <Label htmlFor="nonprofit" className="flex items-center space-x-2 cursor-pointer">
                  <Building2 className="h-5 w-5" />
                  <span>Nonprofit</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Business Structure and Formation Location</h2>
              <p className="text-gray-600">Where will your {formData.businessStructure === 'llc' ? 'LLC' : formData.businessStructure === 'corp' ? 'Corporation' : 'Nonprofit'} be established?</p>
              <p className="text-sm text-gray-500">{formData.businessStructure === 'llc' ? 'LLCs are typically formed in the same state where they conduct business.' : 'Corporations and Nonprofits are typically formed in the same state where they conduct business.'}</p>
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="state">Select State:</Label>
              <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your state..." />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, '-')}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Describe Your Business Activity</h2>
              <p className="text-gray-600">What will your {formData.businessStructure === 'llc' ? 'LLC' : formData.businessStructure === 'corp' ? 'Corporation' : 'Nonprofit'} be doing?</p>
              <p className="text-sm text-gray-500">Please provide a brief description of your business operations.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessDescription">Business Description:</Label>
                <Textarea
                  id="businessDescription"
                  placeholder='For example: "Providing IT consulting services" or "Managing real estate investments."'
                  value={formData.businessDescription}
                  onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="industry">Choose the industry category that best represents your {formData.businessStructure === 'llc' ? 'LLC' : formData.businessStructure === 'corp' ? 'Corporation' : 'Nonprofit'}:</Label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select industry..." />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry.toLowerCase().replace(/\s+/g, '-')}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Obtain Your Tax ID (EIN)</h2>
              <p className="text-gray-600">How would you like to obtain your new Tax ID Number?</p>
              <p className="text-sm text-gray-500">An EIN (Employer Identification Number) is like a Social Security number for your business. It's required to hire employees, open a business bank account, or file taxes.</p>
            </div>
            
            <RadioGroup
              value={formData.taxIdOption}
              onValueChange={(value) => handleInputChange('taxIdOption', value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="rocketlegal" id="rocketlegal-ein" />
                <Label htmlFor="rocketlegal-ein" className="cursor-pointer">
                  <div>
                    <div className="font-medium">Let RocketLegal get my Tax ID</div>
                    <div className="text-sm text-gray-500 mt-1">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Register your business with the IRS</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Ensure your business is ready for operations</span>
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="myself" id="myself-ein" />
                <Label htmlFor="myself-ein" className="cursor-pointer">I'll obtain it myself</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Registered Agent Selection</h2>
              <p className="text-gray-600">Assign a Registered Agent for your business</p>
              <p className="text-sm text-gray-500">You must designate a person or service to receive legal and official documents on behalf of your business.</p>
            </div>
            
            <RadioGroup
              value={formData.registeredAgentOption}
              onValueChange={(value) => handleInputChange('registeredAgentOption', value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="rocketlegal" id="rocketlegal-agent" />
                <Label htmlFor="rocketlegal-agent" className="cursor-pointer">
                  <div>
                    <div className="font-medium">Use Rocket Lawyer as my Registered Agent</div>
                    <div className="text-sm text-gray-500 mt-1">
                      <div className="font-medium text-green-600">$124.99 with RocketLegal (or $249.99 at full price)</div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Ensure you never miss important legal correspondence</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Maintain privacy by avoiding service at your business address</span>
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="myself" id="myself-agent" />
                <Label htmlFor="myself-agent" className="cursor-pointer">I'll serve as my own registered agent</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Trademark Protection</h2>
              <p className="text-gray-600">Safeguard your business with a Registered Trademark</p>
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
                    <div className="font-medium">Professional Trademark Filing with RocketLegal</div>
                    <div className="text-sm text-gray-500 mt-1">
                      <div className="font-medium text-green-600">$349.99 with RocketLegal (or $699.99 full price)</div>
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
                        <span>Trademarks prepared and registered by licensed attorneys</span>
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

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
              <p className="text-gray-600">Primary Contact Details</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name:</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter your company name"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="fullName">Full Name:</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email:</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone:</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="mt-2"
                />
              </div>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Business Registration Filing Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>State Government Fee – {formData.state || 'Selected State'} {formData.businessStructure === 'llc' ? 'LLC' : formData.businessStructure === 'corp' ? 'Corporation' : 'Nonprofit'}</span>
                  <span>$308.10</span>
                </div>
                {formData.taxIdOption === 'rocketlegal' && (
                  <div className="flex justify-between">
                    <span>Tax ID (EIN)</span>
                    <span>$69.99</span>
                  </div>
                )}
                {formData.trademarkOption === 'rocketlegal' && (
                  <div className="flex justify-between">
                    <span>Trademark Filing</span>
                    <span>$349.99</span>
                  </div>
                )}
                {formData.registeredAgentOption === 'rocketlegal' && (
                  <div className="flex justify-between">
                    <span>Registered Agent Service (Billed Annually)</span>
                    <span>$124.99</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Final Review</h2>
              <p className="text-gray-600">Review Your {formData.businessStructure === 'llc' ? 'LLC' : formData.businessStructure === 'corp' ? 'Corporation' : 'Nonprofit'} Registration for {formData.companyName}</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Company Name:</span>
                  <span>{formData.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">State of Formation:</span>
                  <span>{formData.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Business Type:</span>
                  <span>{formData.businessStructure === 'llc' ? 'LLC' : formData.businessStructure === 'corp' ? 'Corporation' : 'Nonprofit'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Business Description:</span>
                  <span>{formData.businessDescription}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Industry Category:</span>
                  <span>{formData.industry}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Checkout & Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">1. Select a Membership Plan</h4>
                  <RadioGroup defaultValue="annual" className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="annual" id="annual" />
                      <Label htmlFor="annual">RocketLegal+ Membership – $239.88/year (Billed annually, 50% off)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly">RocketLegal – $39.99/month</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-medium mb-2">2. Order Summary</h4>
                  <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span>RocketLegal+ Membership (Annual)</span>
                      <span>$239.88</span>
                    </div>
                    {formData.registeredAgentOption === 'rocketlegal' && (
                      <div className="flex justify-between">
                        <span>Registered Agent Service (Annual)</span>
                        <span>$124.99</span>
                      </div>
                    )}
                    {formData.trademarkOption === 'rocketlegal' && (
                      <div className="flex justify-between">
                        <span>Trademark Registration</span>
                        <span>$349.99</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>{formData.state} State Government Filing Fee</span>
                      <span>$308.10</span>
                    </div>
                    {formData.taxIdOption === 'rocketlegal' && (
                      <div className="flex justify-between">
                        <span>EIN / Tax ID Filing</span>
                        <span>$69.99</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Business Registration Filing Fee</span>
                      <span>$0.00</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-green-600">
                        <span>RocketLegal+ Savings:</span>
                        <span>$884.47</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total Due Today:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">3. Payment Information</h4>
                  <div className="space-y-3">
                    <Input placeholder="Card Number" />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="MM/YY" />
                      <Input placeholder="CVC" />
                    </div>
                    <Input placeholder="ZIP Code" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.businessStructure !== '';
      case 2:
        return formData.state !== '';
      case 3:
        return formData.businessDescription.trim() !== '' && formData.industry !== '';
      case 4:
        return formData.taxIdOption !== '';
      case 5:
        return formData.registeredAgentOption !== '';
      case 6:
        return formData.trademarkOption !== '';
      case 7:
        return formData.fullName.trim() !== '' && formData.email.trim() !== '' && formData.phone.trim() !== '' && formData.companyName.trim() !== '';
      case 8:
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
    </div>
  );
};

export default BusinessFormationFlow;
