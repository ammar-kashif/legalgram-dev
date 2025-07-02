import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const AskLegalAdvice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This should come from your auth context/state
  const [formData, setFormData] = useState({
    question: "",
    situation: "",
    city: "",
    state: "",
    planToHire: "",
    timing: ""
  });

  // Check if user is returning from login with preserved form data
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const step = urlParams.get('step');
    const savedData = localStorage.getItem('askLegalAdvice_formData');
    
    if (step === '2' && savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
      setCurrentStep(2);
      setIsLoggedIn(true); // Assume user is logged in if they're on step 2
      // Clear the saved data
      localStorage.removeItem('askLegalAdvice_formData');
    }
  }, [location]);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate step 1 fields
    if (!formData.question || !formData.situation || !formData.city || !formData.state || !formData.planToHire) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Save form data to localStorage before redirecting to login
    localStorage.setItem('askLegalAdvice_formData', JSON.stringify(formData));
    
    // Redirect to login page with return parameters
    navigate('/login?redirect=ask-legal-advice&step=2');
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.timing) {
      toast.error("Please select when you want the advice");
      return;
    }
    
    toast.success("Question submitted successfully!");
    navigate("/dashboard");
  };

  const renderStep1 = () => (
    <form onSubmit={handleStep1Submit} className="space-y-8">
      <div className="space-y-4">
        <Label htmlFor="question">Ask your question</Label>
        <Textarea 
          id="question"
          placeholder="What legal issue can we help you with?"
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          required
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="situation">Explain your situation</Label>
        <Textarea 
          id="situation"
          placeholder="Please provide relevant details about your situation"
          value={formData.situation}
          onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
          required
          className="min-h-[150px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Your city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="state">State</Label>
          <Select 
            value={formData.state} 
            onValueChange={(value) => setFormData({ ...formData, state: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CA">California</SelectItem>
              <SelectItem value="NY">New York</SelectItem>
              <SelectItem value="TX">Texas</SelectItem>
              {/* Add more states as needed */}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Do you plan to hire an attorney?</Label>
        <RadioGroup 
          value={formData.planToHire}
          onValueChange={(value) => setFormData({ ...formData, planToHire: value })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="not-sure" id="not-sure" />
            <Label htmlFor="not-sure">Not Sure</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Login requirement notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-700 text-sm">
          📝 <strong>Next Step:</strong> After clicking Continue, you'll be asked to log in or create an account to complete your legal advice request. This helps us connect you with the right attorney and keep your information secure.
        </p>
      </div>

      <Button type="submit" className="w-full bg-bright-orange-500 hover:bg-bright-orange-600 text-white">
        Continue
      </Button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleFinalSubmit} className="space-y-8">
      {/* Show summary of previous answers */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-3">
        <h3 className="font-semibold text-lg mb-4">Your Information Summary</h3>
        <div>
          <span className="font-medium">Question:</span>
          <p className="text-gray-700">{formData.question}</p>
        </div>
        <div>
          <span className="font-medium">Location:</span>
          <p className="text-gray-700">{formData.city}, {formData.state}</p>
        </div>
        <div>
          <span className="font-medium">Plan to hire attorney:</span>
          <p className="text-gray-700">{formData.planToHire}</p>
        </div>
      </div>

      <div className="space-y-4">
        <Label>When do you want the advice?</Label>
        <RadioGroup 
          value={formData.timing}
          onValueChange={(value) => setFormData({ ...formData, timing: value })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard">More than 4 Days (Free)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="express" id="express" />
            <Label htmlFor="express">Within 2 Days ($100)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="urgent" id="urgent" />
            <Label htmlFor="urgent">Within 24 hours ($200)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setCurrentStep(1)}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-bright-orange-500 hover:bg-bright-orange-600 text-white"
        >
          Submit Question
        </Button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Ask Legal Advice</h1>
        
        {/* Step indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 1 ? 'bg-bright-orange-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-12 h-1 ${currentStep >= 2 ? 'bg-bright-orange-500' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 2 ? 'bg-bright-orange-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === 1 ? renderStep1() : renderStep2()}
        </div>
      </div>
    </Layout>
  );
};

export default AskLegalAdvice;
