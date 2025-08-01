import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Building2 } from 'lucide-react';
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

interface NonprofitFormationData {
  businessStructure: string;
  state: string;
  businessDescription: string;
  industry: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  receiveUpdates: boolean;
  taxIdOption: string;
  registeredAgentOption: string;
  trademarkOption: string;
  filingSpeed: string;
}

interface Props {
  onClose: () => void;
}

const NonprofitFormation: React.FC<Props> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const totalSteps = 11;
  
  const [formData, setFormData] = useState<NonprofitFormationData>({
    businessStructure: 'nonprofit',
    state: '',
    businessDescription: '',
    industry: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    receiveUpdates: false,
    taxIdOption: 'rocketlegal',
    registeredAgentOption: 'rocketlegal',
    trademarkOption: 'rocketlegal',
    filingSpeed: 'standard',
  });

  const handleInputChange = (field: keyof NonprofitFormationData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 10) {
      setCurrentStep(11); // User info step
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
      // doc.save('nonprofit-formation.pdf');
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
    'Arts/Culture', 'Education', 'Environment', 'Health/Medical', 'Human Services',
    'International/Foreign Affairs', 'Public/Society Benefit', 'Religion', 'Research',
    'Youth Development', 'Animal Welfare', 'Community Development', 'Sports/Recreation',
    'Civil Rights/Advocacy', 'Real Estate', 'Other'
  ];

  const calculateTotal = () => {
    let total = 239.88; // Rocket Legal+ Membership
    
    total += 30.00; // State Government Fee
    
    if (formData.registeredAgentOption === 'rocketlegal') {
      total += 124.99; // Registered Agent Service
    }
    
    if (formData.trademarkOption === 'rocketlegal') {
      total += 349.99; // Trademark Filing
    }
    
    if (formData.taxIdOption === 'rocketlegal') {
      total += 69.99; // Tax ID (EIN)
    }
    
    if (formData.filingSpeed === 'express') {
      total += 350.00; // Express Filing Fee
    }
    
    return total;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Choose a Business Structure</h2>
              <p className="text-gray-600">What type of business structure are you planning to file?</p>
              <p className="text-sm text-gray-500">The structure you select will determine how your nonprofit is managed and how taxes are filed.</p>
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
              <div className="flex items-center space-x-2 p-4 border rounded-lg bg-blue-50 border-blue-200">
                <RadioGroupItem value="nonprofit" id="nonprofit" />
                <Label htmlFor="nonprofit" className="flex items-center space-x-2 cursor-pointer">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Nonprofit (Selected)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Business Information</h2>
              <p className="text-gray-600">Select the State of Formation</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Where will your nonprofit be formed?</Label>
                <p className="text-sm text-gray-500 mb-3">It is common practice for nonprofits to be established in the state where they will operate.</p>
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

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Describe Your Nonprofit's Purpose</h2>
              <p className="text-gray-600">What will your nonprofit be doing?</p>
              <p className="text-sm text-gray-500">Provide a brief description of your nonprofit's primary activity.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessDescription">Description</Label>
                <Textarea
                  id="businessDescription"
                  value={formData.businessDescription}
                  onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                  placeholder="Managing real estate"
                  className="mt-1"
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="industry">Industry Category</Label>
                <Select onValueChange={(value) => handleInputChange('industry', value)}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select industry category" />
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

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Enter Your Contact Information</h2>
              <p className="text-gray-600">Who is the main point of contact for your business?</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Abdullah"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="JAVED"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="ababbasi916@gmail.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(033) 163-3362"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Enter your nonprofit name"
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="receiveUpdates"
                  checked={formData.receiveUpdates}
                  onCheckedChange={(checked) => handleInputChange('receiveUpdates', checked as boolean)}
                />
                <Label htmlFor="receiveUpdates" className="text-sm">
                  I would like to receive updates and tips from Rocket Lawyer via text.
                </Label>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Customize Your Filing</h2>
              <h3 className="text-xl font-semibold">Obtain Your Tax ID (EIN)</h3>
              <p className="text-gray-600">How would you like to get your new tax ID number?</p>
              <p className="text-sm text-gray-500">A Tax ID (or EIN) is essential for hiring employees, opening a bank account, or filing taxes.</p>
            </div>
            
            <RadioGroup
              value={formData.taxIdOption}
              onValueChange={(value) => handleInputChange('taxIdOption', value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="rocketlegal" id="taxid-rocketlegal" />
                <Label htmlFor="taxid-rocketlegal" className="cursor-pointer">
                  <div>
                    <div className="font-medium">Get my Tax ID for me (Recommended)</div>
                    <div className="text-sm text-gray-500 mt-1">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Provided by ROCKETLEGAL+</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Ensures IRS registration</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Ready to do business</span>
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
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Assign a Registered Agent</h2>
              <p className="text-gray-600">Appoint a registered agent for your business.</p>
              <p className="text-sm text-gray-500">A registered agent receives legal and official paperwork on your behalf.</p>
            </div>
            
            <RadioGroup
              value={formData.registeredAgentOption}
              onValueChange={(value) => handleInputChange('registeredAgentOption', value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="rocketlegal" id="agent-rocketlegal" />
                <Label htmlFor="agent-rocketlegal" className="cursor-pointer">
                  <div>
                    <div className="font-medium">Use Rocket Lawyer as Registered Agent (Recommended)</div>
                    <div className="text-sm text-gray-500 mt-1">
                      <div className="font-medium text-green-600">$124.99 with ROCKETLEGAL+ ($249.99 full price)</div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Never miss legal correspondence</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Avoid personal delivery of legal documents</span>
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
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Trademark Your Organization</h2>
              <p className="text-gray-600">Protect your company with a registered trademark.</p>
            </div>
            
            <RadioGroup
              value={formData.trademarkOption}
              onValueChange={(value) => handleInputChange('trademarkOption', value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="rocketlegal" id="trademark-rocketlegal" />
                <Label htmlFor="trademark-rocketlegal" className="cursor-pointer">
                  <div>
                    <div className="font-medium">Professional Trademark Filing (Recommended)</div>
                    <div className="text-sm text-gray-500 mt-1">
                      <div className="font-medium text-green-600">$349.99 with ROCKETLEGAL+ ($699.99 full price)</div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Increases brand value</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Prevents unauthorized use or counterfeiting</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Handled by licensed attorneys</span>
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
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Choose Filing Speed</h2>
              <p className="text-gray-600">How quickly do you need to make it official?</p>
            </div>
            
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
                      <div className="font-medium text-orange-600">$380.00</div>
                      <div>5–7 business days</div>
                      <div>Includes $30 state fee + $350 rush fee</div>
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
                      <div className="font-medium text-green-600">$30.00</div>
                      <div>2–4 weeks</div>
                      <div>Includes government and state processing fees</div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Review Your Information</h2>
              <h3 className="text-xl font-semibold">Review Your Nonprofit Registration Summary</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">Business Details:</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Business Name:</span> {formData.businessName || 'NONPROFIT'}</div>
                  <div><span className="font-medium">State:</span> {formData.state || 'California'}</div>
                  <div><span className="font-medium">Business Structure:</span> Nonprofit</div>
                  <div><span className="font-medium">Business Purpose:</span> {formData.businessDescription || formData.industry}</div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">Primary Contact:</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</div>
                  <div><span className="font-medium">Email:</span> {formData.email}</div>
                  <div><span className="font-medium">Phone:</span> {formData.phone}</div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">Order Details:</h4>
                <div className="space-y-2 text-sm">
                  <div>• Business Registration Filing Fee</div>
                  <div>• {formData.filingSpeed === 'express' ? 'Express' : 'Standard'} Filing Fee – California Nonprofit</div>
                  <div>• State Government Fee – California</div>
                  {formData.taxIdOption === 'rocketlegal' && <div>• Tax ID</div>}
                  {formData.trademarkOption === 'rocketlegal' && <div>• Trademark</div>}
                  {formData.registeredAgentOption === 'rocketlegal' && <div>• Registered Agent Service (Billed Annually)</div>}
                </div>
              </div>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Checkout</h2>
              <h3 className="text-xl font-semibold">Finalize Membership & Payment</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-3">1. Choose Your Membership:</h4>
                <RadioGroup defaultValue="rocketlegal-plus" className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rocketlegal-plus" id="membership-plus" />
                    <Label htmlFor="membership-plus" className="cursor-pointer">ROCKETLEGAL+ – $239.88/year (50% off, billed annually)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rocketlegal-monthly" id="membership-monthly" />
                    <Label htmlFor="membership-monthly" className="cursor-pointer">ROCKETLEGAL – $39.99/month (billed monthly)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">2. Review Your Order Summary:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Rocket Legal+ Membership (Annual)</span>
                    <span>$239.88</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>State Government Fee</span>
                    <span>$30.00</span>
                  </div>
                  {formData.registeredAgentOption === 'rocketlegal' && (
                    <div className="flex justify-between text-sm">
                      <span>Registered Agent Service</span>
                      <span>$124.99</span>
                    </div>
                  )}
                  {formData.trademarkOption === 'rocketlegal' && (
                    <div className="flex justify-between text-sm">
                      <span>Trademark Filing</span>
                      <span>$349.99</span>
                    </div>
                  )}
                  {formData.taxIdOption === 'rocketlegal' && (
                    <div className="flex justify-between text-sm">
                      <span>Tax ID (EIN)</span>
                      <span>$69.99</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Business Registration Filing</span>
                    <span>$0.00</span>
                  </div>
                  {formData.filingSpeed === 'express' && (
                    <div className="flex justify-between text-sm">
                      <span>Express Filing Fee</span>
                      <span>$350.00</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Rocket Legal+ Savings:</span>
                      <span>$884.87</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Payable Today:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">3. Payment Information</h4>
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

      case 11:
        return (
          <UserInfoStep
            onBack={() => setCurrentStep(10)}
            onGenerate={generatePDF}
            documentType="Nonprofit Formation"
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
        return formData.businessStructure !== '';
      case 2:
        return formData.state !== '';
      case 3:
        return formData.businessDescription.trim() !== '' && formData.industry !== '';
      case 4:
        return formData.firstName.trim() !== '' && formData.lastName.trim() !== '' && formData.email.trim() !== '' && formData.phone.trim() !== '';
      case 5:
        return formData.taxIdOption !== '';
      case 6:
        return formData.registeredAgentOption !== '';
      case 7:
        return formData.trademarkOption !== '';
      case 8:
        return formData.filingSpeed !== '';
      case 9:
        return true;
      case 10:
        return true;
      case 11:
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
      {currentStep !== 11 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onClose : handleBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </Button>

          {currentStep === 10 ? (
            <Button 
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center space-x-2"
            >
              <span>Accept & Continue</span>
              <ArrowRight className="h-4 w-4" />
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

export default NonprofitFormation;
