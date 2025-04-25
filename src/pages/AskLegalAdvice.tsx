import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const AskLegalAdvice = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    question: "",
    situation: "",
    city: "",
    state: "",
    planToHire: "",
    timing: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Question submitted successfully!");
    navigate("/dashboard");
  };

  return (
    <Layout>
      <div className={cn(
        "container mx-auto px-4 max-w-3xl h-full",
        isMobile ? "pt-16 pb-8 min-h-[calc(var(--vh,1vh)*100)]" : "pt-24 pb-12"
      )}>
        <h1 className={cn(
          "font-bold mb-8 text-center",
          isMobile ? "text-2xl" : "text-4xl"
        )}>
          Ask Legal Advice
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 h-full">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <Label htmlFor="question" className="text-base sm:text-lg font-medium">
                Ask your question
              </Label>
              <Textarea 
                id="question"
                placeholder="What legal issue can we help you with?"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
                className="min-h-[100px] text-sm sm:text-base"
              />
            </div>

            <div className="space-y-3 sm:space-y-4">
              <Label htmlFor="situation" className="text-base sm:text-lg font-medium">
                Explain your situation
              </Label>
              <Textarea 
                id="situation"
                placeholder="Please provide relevant details about your situation"
                value={formData.situation}
                onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
                required
                className="min-h-[150px] text-sm sm:text-base"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <Label htmlFor="city" className="text-base sm:text-lg font-medium">City</Label>
                <Input
                  id="city"
                  placeholder="Your city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="state" className="text-base sm:text-lg font-medium">State</Label>
                <Select 
                  value={formData.state} 
                  onValueChange={(value) => setFormData({ ...formData, state: value })}
                  required
                >
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <Label className="text-base sm:text-lg font-medium">
                Do you plan to hire an attorney?
              </Label>
              <RadioGroup 
                value={formData.planToHire}
                onValueChange={(value) => setFormData({ ...formData, planToHire: value })}
                className="flex flex-col space-y-2 sm:space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes" className="text-sm sm:text-base">Yes</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="not-sure" id="not-sure" />
                  <Label htmlFor="not-sure" className="text-sm sm:text-base">Not Sure</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no" className="text-sm sm:text-base">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <Label className="text-base sm:text-lg font-medium">
                When do you want the advice?
              </Label>
              <RadioGroup 
                value={formData.timing}
                onValueChange={(value) => setFormData({ ...formData, timing: value })}
                className="flex flex-col space-y-2 sm:space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="text-sm sm:text-base">
                    More than 4 Days (Free)
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express" className="text-sm sm:text-base">
                    Within 2 Days ($100)
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="urgent" id="urgent" />
                  <Label htmlFor="urgent" className="text-sm sm:text-base">
                    Within 24 hours ($200)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              type="submit" 
              className={cn(
                "w-full bg-bright-orange-500 hover:bg-bright-orange-600 text-white",
                isMobile ? "text-sm py-5" : "text-base py-6"
              )}
            >
              Submit Question
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AskLegalAdvice;
