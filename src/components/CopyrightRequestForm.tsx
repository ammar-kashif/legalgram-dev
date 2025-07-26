import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import UserInfoStep from '@/components/UserInfoStep';

interface CopyrightRequestData {
  requestType: string;
  workTitle: string;
  authorName: string;
  yearCreated: string;
  workDescription: string;
}

interface CopyrightRequestFormProps {
  onClose: () => void;
}

const CopyrightRequestForm: React.FC<CopyrightRequestFormProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const totalSteps = 3;
  
  const [formData, setFormData] = useState<CopyrightRequestData>({
    requestType: '',
    workTitle: '',
    authorName: '',
    yearCreated: '',
    workDescription: ''
  });

  const handleInputChange = (field: keyof CopyrightRequestData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Copyright Request Form', 20, 30);
      
      // Add content
      doc.setFontSize(12);
      let yPosition = 50;
      
      doc.text(`Request Type: ${formData.requestType}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Work Title: ${formData.workTitle}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Author Name: ${formData.authorName}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Year Created: ${formData.yearCreated}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Work Description: ${formData.workDescription}`, 20, yPosition);
      
      // Save the PDF
      doc.save('copyright-request.pdf');
      toast.success('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const canAdvance = () => {
    switch (currentStep) {
      case 1:
        return formData.requestType && formData.workTitle;
      case 2:
        return formData.authorName && formData.yearCreated && formData.workDescription;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="requestType">Request Type</Label>
              <select
                id="requestType"
                value={formData.requestType}
                onChange={(e) => handleInputChange('requestType', e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="">Select request type</option>
                <option value="registration">Copyright Registration</option>
                <option value="renewal">Copyright Renewal</option>
                <option value="transfer">Copyright Transfer</option>
                <option value="license">License Request</option>
              </select>
            </div>
            <div>
              <Label htmlFor="workTitle">Work Title</Label>
              <Input
                id="workTitle"
                value={formData.workTitle}
                onChange={(e) => handleInputChange('workTitle', e.target.value)}
                placeholder="Enter the title of your work"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="authorName">Author Name</Label>
              <Input
                id="authorName"
                value={formData.authorName}
                onChange={(e) => handleInputChange('authorName', e.target.value)}
                placeholder="Enter the author's name"
              />
            </div>
            <div>
              <Label htmlFor="yearCreated">Year Created</Label>
              <Input
                id="yearCreated"
                type="number"
                value={formData.yearCreated}
                onChange={(e) => handleInputChange('yearCreated', e.target.value)}
                placeholder="Enter the year the work was created"
              />
            </div>
            <div>
              <Label htmlFor="workDescription">Work Description</Label>
              <textarea
                id="workDescription"
                value={formData.workDescription}
                onChange={(e) => handleInputChange('workDescription', e.target.value)}
                placeholder="Describe the work"
                className="w-full mt-1 p-2 border rounded-md"
                rows={4}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <UserInfoStep
            onBack={handleBack}
            onGenerate={generatePDF}
            documentType="Copyright Request"
            isGenerating={isGeneratingPDF}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Copyright Request Form - Step {currentStep} of {totalSteps}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderStep()}
        
        {currentStep !== 3 && (
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 1 ? onClose : handleBack}
              disabled={isGeneratingPDF}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>

            <Button 
              type="button" 
              onClick={handleNext}
              disabled={!canAdvance() || isGeneratingPDF}
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CopyrightRequestForm;