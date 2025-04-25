import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, MessageSquare, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ScheduleMeeting = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  useEffect(() => {
    const getUserInfo = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setEmail(session.user.email || "");
        
        const firstName = session.user.user_metadata?.first_name || "";
        const lastName = session.user.user_metadata?.last_name || "";
        
        if (firstName || lastName) {
          setName(`${firstName} ${lastName}`.trim());
        } else {
          setName(session.user.email?.split('@')[0] || "");
        }
        
        const userPhone = session.user.user_metadata?.phone || "";
        if (userPhone) {
          setPhone(userPhone);
        }
      }
    };
    
    getUserInfo();
  }, []);

  const handleSchedule = async () => {
    if (!name || !email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('consultations')
        .insert([
          { name, email, phone, message, status: 'pending' }
        ]);
      
      if (error) throw error;

      console.log("Consultation submitted successfully");
      toast.success("Consultation request submitted successfully!");
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting consultation:", error);
      toast.error("There was a problem submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setMessage("");
  };

  return (
    <div className="space-y-6">
      {!isSubmitted ? (
        <>
          <div>
            <h1 className="text-2xl font-semibold mb-2 text-black">Book a Consultation</h1>
            <p className="text-black mb-6">
              Fill out the form below to schedule a consultation with one of our legal experts.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-medium mb-4 flex items-center text-black">
                  <Users className="mr-2 h-5 w-5" />
                  Your Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1 text-black">Full Name *</label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="John Doe" 
                      required 
                      className="text-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1 text-black">Email Address *</label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="john@example.com" 
                      required 
                      className="text-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1 text-black">Phone Number</label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="(555) 123-4567" 
                      className="text-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1 flex items-center text-black">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Additional Details
                    </label>
                    <Textarea 
                      id="message" 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)} 
                      placeholder="Please describe your legal issue briefly..." 
                      rows={4} 
                      className="text-black"
                    />
                  </div>
                </div>
                <Button 
                  className="w-full mt-6" 
                  size="lg"
                  variant="orange"
                  disabled={!name || !email || isSubmitting}
                  onClick={handleSchedule}
                >
                  {isSubmitting ? "Submitting..." : "Book Consultation"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="mx-auto bg-green-100 dark:bg-green-900/30 h-20 w-20 rounded-full flex items-center justify-center mb-6">
                <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-black">Consultation Request Submitted</h2>
              <p className="text-black mb-4">
                Thank you for scheduling a consultation. Our team will review your request and get back to you shortly.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                <p className="font-medium text-blue-700 dark:text-blue-300 mb-2">What happens next?</p>
                <p className="text-black">
                  You will be notified via both your email ({email}) and phone number ({phone || "Not provided"}) with the details of your consultation.
                </p>
              </div>
              <Button onClick={handleReset} variant="orange">Submit Another Request</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ScheduleMeeting;
