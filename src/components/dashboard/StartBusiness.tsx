
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Building, Check } from "lucide-react";

const businessTypes = [
  { value: "llc", label: "Limited Liability Company (LLC)" },
  { value: "corporation", label: "Corporation" },
  { value: "sole-prop", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "s-corp", label: "S Corporation" }
];

const states = [
  { value: "ca", label: "California" },
  { value: "ny", label: "New York" },
  { value: "tx", label: "Texas" },
  { value: "fl", label: "Florida" },
  { value: "il", label: "Illinois" }
  // Add more states as needed
];

const StartBusiness = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    state: "",
    address: "",
    description: "",
    ownerName: "",
    email: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Business formation request submitted successfully!");
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Submission Successful</h1>
        <p className="text-center text-muted-foreground mb-6 max-w-md">
          Your business formation request has been submitted. Our legal team will review your information and contact you within 1-2 business days.
        </p>
        <Button onClick={() => setIsSubmitted(false)}>Submit Another Request</Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="heading-lg mb-2">Start a Business</h1>
      <p className="text-muted-foreground mb-6">
        Complete the form below to begin the process of forming your business.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Business Formation Form
          </CardTitle>
          <CardDescription>
            Provide the details needed to establish your business entity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium mb-1">Business Name</label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  placeholder="Your Business Name"
                  className="!text-black"
                />
              </div>
              
              <div>
                <label htmlFor="businessType" className="block text-sm font-medium mb-1">Business Type</label>
                <Select 
                  value={formData.businessType} 
                  onValueChange={(value) => handleSelectChange("businessType", value)}
                >
                  <SelectTrigger className="!text-black">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="state" className="block text-sm font-medium mb-1">State of Formation</label>
                <Select 
                  value={formData.state} 
                  onValueChange={(value) => handleSelectChange("state", value)}
                >
                  <SelectTrigger className="!text-black">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map(state => (
                      <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">Business Address</label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Street address, city, zip"
                  className="!text-black"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Business Description</label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Briefly describe your business activities"
                className="!text-black"
              />
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-3">Owner Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ownerName" className="block text-sm font-medium mb-1">Owner Name</label>
                  <Input
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    required
                    className="!text-black"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="!text-black"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="!text-black"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Submitting...</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </>
                ) : (
                  "Submit Business Formation Request"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartBusiness;
