
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Check, Mail, Phone, Users } from "lucide-react";

const ContactLawyer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    legalArea: "",
    description: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const legalAreas = [
    "Family Law",
    "Business Law",
    "Real Estate",
    "Criminal Defense",
    "Employment Law",
    "Immigration",
    "Intellectual Property",
    "Personal Injury",
    "Estate Planning",
    "Other",
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      legalArea: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, this would send the data to the backend
    setTimeout(() => {
      toast.success("Your request has been submitted. A lawyer will contact you shortly.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        legalArea: "",
        description: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="container-custom py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="heading-xl mb-4">Contact a Lawyer</h1>
            <p className="text-lg text-rocket-gray-600 dark:text-rocket-gray-400 max-w-2xl mx-auto">
              Connect with a qualified attorney specialized in your legal matter. Fill out the form below and we'll match you with the right expert.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <div className="bg-rocket-blue-50 dark:bg-rocket-blue-900/20 p-6 rounded-xl">
                <h3 className="heading-sm mb-4">Why Choose Our Lawyers</h3>
                <ul className="space-y-3">
                  {[
                    "Vetted and experienced attorneys",
                    "Clear, upfront pricing",
                    "Specialization in various legal areas",
                    "Quick response times",
                    "Ongoing support throughout your case"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-rocket-blue-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-rocket-gray-700 dark:text-rocket-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-rocket-gray-50 dark:bg-rocket-gray-800 p-6 rounded-xl">
                <h3 className="heading-sm mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-rocket-blue-500 mr-3" />
                    <span className="text-rocket-gray-700 dark:text-rocket-gray-300">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-rocket-blue-500 mr-3" />
                    <span className="text-rocket-gray-700 dark:text-rocket-gray-300">lawyers@rocketlawyer.com</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-rocket-blue-500 mr-3" />
                    <span className="text-rocket-gray-700 dark:text-rocket-gray-300">100+ lawyers nationwide</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white dark:bg-rocket-gray-800 p-8 rounded-xl shadow-md border border-rocket-gray-200 dark:border-rocket-gray-700">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="legalArea" className="block text-sm font-medium mb-1">Legal Area</label>
                    <Select value={formData.legalArea} onValueChange={handleSelectChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select legal area" />
                      </SelectTrigger>
                      <SelectContent>
                        {legalAreas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">Describe Your Legal Issue</label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Please provide details about your legal situation"
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-rocket-blue-500 hover:bg-rocket-blue-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactLawyer;
