import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Send, CheckCircle } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.fullName || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Your message has been sent successfully!");
    }, 1500);
  };

  return (
    <Layout>
      <div className="bg-rocket-blue-500 py-12">
        <div className="container-custom">
          <h1 className="heading-md text-black mb-4">Contact Us</h1>
          <p className="text-black max-w-2xl">
            Have questions or need assistance? Our team is here to help. Fill out the form below, and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>

      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isSuccess ? (
              <div className="bg-white dark:bg-rocket-gray-800 rounded-lg shadow-lg p-8 text-center">
                <div className="w-20 h-20 mx-auto bg-rocket-green-50 dark:bg-rocket-blue-800 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Thank You!</h2>
                <p className="text-black dark:text-rocket-gray-300 mb-6">
                  Your message has been received. A member of our team will contact you shortly.
                </p>
                <Button
                  onClick={() => setIsSuccess(false)}
                  variant="orange"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <div className="bg-white dark:bg-rocket-gray-800 rounded-lg shadow-lg p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 text-black">Get In Touch</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="fullName" className="text-black dark:text-rocket-gray-200">Full Name*</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="mt-1 bg-white dark:bg-rocket-gray-900 text-black dark:text-white border-rocket-gray-300 dark:border-rocket-gray-700"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-black dark:text-rocket-gray-200">Email Address*</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="mt-1 bg-white dark:bg-rocket-gray-900 text-black dark:text-white border-rocket-gray-300 dark:border-rocket-gray-700"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-black dark:text-rocket-gray-200">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="mt-1 bg-white dark:bg-rocket-gray-900 text-black dark:text-white border-rocket-gray-300 dark:border-rocket-gray-700"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-black dark:text-rocket-gray-200">Message*</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="mt-1 min-h-[120px] bg-white dark:bg-rocket-gray-900 text-black dark:text-white border-rocket-gray-300 dark:border-rocket-gray-700"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gap-2"
                    variant="orange"
                    disabled={isSubmitting}
                  >
                    <Send className="h-5 w-5" />
                    {isSubmitting ? "Sending..." : "Submit Message"}
                  </Button>
                </form>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white dark:bg-rocket-gray-800 rounded-lg shadow-lg p-6 md:p-8 mb-6">
              <h2 className="text-xl font-bold mb-6 text-black dark:text-white">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-rocket-blue-50 dark:bg-rocket-blue-900 p-3 rounded-lg">
                    <Phone className="h-5 w-5 text-rocket-blue-500 dark:text-rocket-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black">Phone</h3>
                    <p className="text-black mt-1">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-rocket-blue-50 dark:bg-rocket-blue-900 p-3 rounded-lg">
                    <Mail className="h-5 w-5 text-rocket-blue-500 dark:text-rocket-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black">Email</h3>
                    <p className="text-black mt-1">
                      <a href="mailto:info@rocketlawyer.com" className="text-black hover:text-rocket-blue-500">
                        info@rocketlawyer.com
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-rocket-blue-50 dark:bg-rocket-blue-900 p-3 rounded-lg">
                    <MapPin className="h-5 w-5 text-rocket-blue-500 dark:text-rocket-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black">Office Address</h3>
                    <p className="text-black mt-1">
                      123 Legal Avenue<br />
                      Suite 400<br />
                      San Francisco, CA 94103
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-rocket-blue-50 dark:bg-rocket-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-3 text-black">Office Hours</h3>
              <ul className="space-y-2 text-black">
                <li className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday:</span>
                  <span>10:00 AM - 2:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
