
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    id: "basic",
    name: "Basic Plan",
    price: "$9.99",
    period: "monthly",
    description: "Essential legal coverage for individuals",
    features: [
      "1 legal consultation per month",
      "Document review (up to 5 pages)",
      "Phone advice for simple legal matters",
      "Access to legal document templates"
    ]
  },
  {
    id: "pro",
    name: "Professional Plan",
    price: "$29.99",
    period: "monthly",
    description: "Comprehensive legal support for families and small businesses",
    features: [
      "3 legal consultations per month",
      "Document review (up to 20 pages)",
      "Phone and video advice",
      "Custom document preparation",
      "Will and testament preparation",
      "Business contract review"
    ],
    recommended: true
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: "$59.99",
    period: "monthly",
    description: "Complete legal coverage for complex needs",
    features: [
      "Unlimited legal consultations",
      "Priority lawyer access",
      "Extensive document review",
      "Court representation (limited hours)",
      "All document templates and preparation",
      "Annual legal checkup",
      "Dedicated lawyer assignment"
    ]
  }
];

const PlanUpgrade = () => {
  const [selectedPlan, setSelectedPlan] = useState("basic");

  const handleUpgrade = () => {
    // In a real app, we would initiate the payment process
    toast.success(`Upgraded to ${plans.find(plan => plan.id === selectedPlan)?.name}!`);
  };

  return (
    <div>
      <h1 className="heading-lg mb-2">Upgrade Your Plan</h1>
      <p className="text-rocket-gray-500 mb-6">
        Choose the plan that best suits your legal needs.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative cursor-pointer transition-all ${
              selectedPlan === plan.id ? 'ring-2 ring-rocket-blue-500' : ''
            } ${plan.recommended ? 'border-rocket-blue-300' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rocket-blue-500 text-white text-xs font-medium py-1 px-3 rounded-full">
                Recommended
              </div>
            )}
            
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-rocket-gray-500">/{plan.period}</span>
              </div>
              
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant={selectedPlan === plan.id ? "default" : "outline"}
                className="w-full"
              >
                {selectedPlan === plan.id ? "Selected" : "Select Plan"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="heading-sm">
              {plans.find(plan => plan.id === selectedPlan)?.name}
            </h2>
            <p className="text-rocket-gray-500">
              {plans.find(plan => plan.id === selectedPlan)?.description}
            </p>
          </div>
          <div className="text-xl font-bold">
            {plans.find(plan => plan.id === selectedPlan)?.price}
            <span className="text-sm text-rocket-gray-500 font-normal">
              /{plans.find(plan => plan.id === selectedPlan)?.period}
            </span>
          </div>
        </div>
        
        <Button onClick={handleUpgrade} className="w-full md:w-auto">
          Upgrade Now
        </Button>
      </div>
    </div>
  );
};

export default PlanUpgrade;
