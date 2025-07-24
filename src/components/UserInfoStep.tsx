import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, User, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UserInfoStepProps {
  onBack: () => void;
  onGenerate: () => void;
  documentType: string;
  isGenerating?: boolean;
}

interface UserInfo {
  fullName: string;
  email: string;
}

const UserInfoStep: React.FC<UserInfoStepProps> = ({ 
  onBack, 
  onGenerate, 
  documentType, 
  isGenerating = false 
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canGenerate = () => {
    return userInfo.fullName.trim().length > 0 && 
           userInfo.email.trim().length > 0 && 
           isValidEmail(userInfo.email.trim());
  };

  const handleGenerate = async () => {
    if (!canGenerate()) {
      toast.error("Please fill in all required fields with valid information.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Store user information in Supabase
      const { error } = await supabase
        .from('document_users')
        .insert({
          full_name: userInfo.fullName.trim(),
          email: userInfo.email.trim().toLowerCase(),
          document_type: documentType,
          ip_address: null, // This would require additional setup to capture
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Error storing user info:', error);
        toast.error("There was an error saving your information. Please try again.");
        return;
      }

      // Call the generate function
      onGenerate();
      toast.success("Document generated successfully!");
      
    } catch (error) {
      console.error('Error in handleGenerate:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Contact Information
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Please provide your contact information to generate and download your document.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Full Name *
          </Label>
          <Input
            id="fullName"
            value={userInfo.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Enter your full name"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={userInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
            className="mt-1"
            required
          />
          {userInfo.email && !isValidEmail(userInfo.email) && (
            <p className="text-sm text-red-500 mt-1">Please enter a valid email address</p>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting || isGenerating}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button 
            type="button" 
            onClick={handleGenerate}
            disabled={!canGenerate() || isSubmitting || isGenerating}
          >
            {isSubmitting || isGenerating ? (
              "Generating..."
            ) : (
              <>
                Generate PDF
                <Download className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoStep;