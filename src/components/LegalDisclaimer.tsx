import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone } from "lucide-react";

interface LegalDisclaimerProps {
  className?: string;
}

const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ className = "" }) => {
  return (
    <Alert className={`border-blue-200 bg-blue-50 ${className}`}>
      <Phone className="h-4 w-4" />
      <AlertDescription className="text-sm">
        <strong>For Review of Legal Document or Tailored Drafting By Specialized Lawyer At Affordable Rate</strong>{" "}
        <Button variant="link" className="p-0 h-auto text-blue-600 font-semibold" asChild>
          <a href="/contact">Contact Us</a>
        </Button>
        {" "}for professional legal assistance with your documents.
      </AlertDescription>
    </Alert>
  );
};

export default LegalDisclaimer;
