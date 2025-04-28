import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { jsPDF } from "jspdf";
import { format } from "date-fns";

const documentTemplates = [
  { id: "nda", name: "Non-Disclosure Agreement", category: "Business" },
  { id: "employment", name: "Employment Contract", category: "Business" },
  { id: "lease", name: "Residential Lease", category: "Real Estate" },
  { id: "will", name: "Last Will and Testament", category: "Estate" },
  { id: "poa", name: "Power of Attorney", category: "Legal" },
  { id: "llc", name: "LLC Formation", category: "Business" }
];

const MakeDocument = () => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [formData, setFormData] = useState({
    partyName1: "",
    partyName2: "",
    details: "",
    date: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleGeneratePDF = () => {
    setIsGenerating(true);
    
    try {
      console.log("Generating PDF document...");
      const doc = new jsPDF();
      
      // Get the template name
      const templateName = documentTemplates.find(t => t.id === selectedTemplate)?.name || "Document";
      
      // Setup document header
      doc.setFontSize(20);
      doc.setTextColor(44, 62, 80);
      doc.text(templateName, 105, 20, { align: "center" });
      
      // Add horizontal line
      doc.setDrawColor(44, 62, 80);
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);
      
      // Reset text settings for body
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      // Start position for content
      let yPosition = 40;
      const lineHeight = 10;
      
      // Add current date
      const currentDate = formData.date || format(new Date(), "yyyy-MM-dd");
      doc.text(`THIS AGREEMENT is made on ${currentDate} between:`, 20, yPosition);
      
      // Add parties
      yPosition += lineHeight * 2;
      doc.text(`${formData.partyName1} ("First Party")`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`${formData.partyName2} ("Second Party")`, 20, yPosition);
      
      // Add agreement intro
      yPosition += lineHeight * 2;
      doc.text("WHEREAS the parties wish to enter into this agreement under the following terms:", 20, yPosition);
      
      // Add details if available
      if (formData.details) {
        yPosition += lineHeight * 2;
        doc.text("Additional Details:", 20, yPosition);
        yPosition += lineHeight;
        
        const detailsLines = doc.splitTextToSize(formData.details, 170);
        doc.text(detailsLines, 20, yPosition);
        yPosition += (detailsLines.length * lineHeight);
      }
      
      // Add signature lines
      yPosition = 240;
      doc.line(20, yPosition, 90, yPosition);
      doc.text(formData.partyName1, 30, yPosition + 15);
      
      doc.line(110, yPosition, 180, yPosition);
      doc.text(formData.partyName2, 120, yPosition + 15);
      
      // Add footer
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text("This document is for reference purposes only.", 105, 280, { align: "center" });
      
      // Generate filename and download
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `${templateName.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.pdf`;
      
      console.log("Saving PDF with filename:", filename);
      doc.save(filename);
      
      toast.success("Document generated successfully!");
      setIsGenerating(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate document");
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h1 className="heading-lg mb-2">Make Documents</h1>
      <p className="text-muted-foreground mb-6">
        Create legal documents from our professionally-drafted templates.
      </p>
      
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Select a document template</h2>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="estate">Estate</TabsTrigger>
              <TabsTrigger value="real-estate">Real Estate</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTemplates.map(template => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        {template.name}
                      </CardTitle>
                      <CardDescription>{template.category}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        Select Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Filter tabs by category */}
            <TabsContent value="business" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTemplates
                  .filter(t => t.category === "Business")
                  .map(template => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          {template.name}
                        </CardTitle>
                        <CardDescription>{template.category}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleTemplateSelect(template.id)}
                        >
                          Select Template
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            
            {/* Other category tabs would follow the same pattern */}
            <TabsContent value="estate" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTemplates
                  .filter(t => t.category === "Estate")
                  .map(template => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          {template.name}
                        </CardTitle>
                        <CardDescription>{template.category}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleTemplateSelect(template.id)}
                        >
                          Select Template
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="real-estate" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTemplates
                  .filter(t => t.category === "Real Estate")
                  .map(template => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          {template.name}
                        </CardTitle>
                        <CardDescription>{template.category}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleTemplateSelect(template.id)}
                        >
                          Select Template
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {step === 2 && (
        <div>
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => setStep(1)}
              className="mr-4"
            >
              ← Back to templates
            </Button>
            <h2 className="text-xl font-semibold">
              {documentTemplates.find(t => t.id === selectedTemplate)?.name}
            </h2>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Enter Document Details</CardTitle>
              <CardDescription>Fill in the required information to generate your document</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="partyName1" className="block text-sm font-medium mb-1">First Party Name</label>
                  <Input
                    id="partyName1"
                    name="partyName1"
                    value={formData.partyName1}
                    onChange={handleInputChange}
                    required
                    className="!text-black"
                  />
                </div>
                
                <div>
                  <label htmlFor="partyName2" className="block text-sm font-medium mb-1">Second Party Name</label>
                  <Input
                    id="partyName2"
                    name="partyName2"
                    value={formData.partyName2}
                    onChange={handleInputChange}
                    required
                    className="!text-black"
                  />
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-1">Effective Date</label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="!text-black"
                  />
                </div>
                
                <div>
                  <label htmlFor="details" className="block text-sm font-medium mb-1">Additional Details</label>
                  <Textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    rows={5}
                    className="!text-black"
                  />
                </div>
                
                <Button type="submit" className="w-full">Continue to Preview</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      
      {step === 3 && (
        <div>
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => setStep(2)}
              className="mr-4"
            >
              ← Back to edit
            </Button>
            <h2 className="text-xl font-semibold">Document Preview</h2>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {documentTemplates.find(t => t.id === selectedTemplate)?.name}
              </CardTitle>
              <CardDescription>Review your document before generating the final PDF</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 border rounded-md p-6 min-h-[400px]">
                <h3 className="text-center text-lg font-bold mb-6">{documentTemplates.find(t => t.id === selectedTemplate)?.name}</h3>
                <p className="mb-4">THIS AGREEMENT is made on {formData.date} between:</p>
                <p className="mb-2"><strong>{formData.partyName1}</strong> ("First Party")</p>
                <p className="mb-6"><strong>{formData.partyName2}</strong> ("Second Party")</p>
                
                <p className="mb-4">WHEREAS the parties wish to enter into this agreement under the following terms:</p>
                
                <p className="text-sm text-muted-foreground italic">[Document content would be generated here based on template and inputs]</p>
                
                {formData.details && (
                  <div className="mt-6 border-t pt-4">
                    <p className="mb-2"><strong>Additional Details:</strong></p>
                    <p>{formData.details}</p>
                  </div>
                )}
                
                <div className="mt-8">
                  <div className="flex justify-between">
                    <div>
                      <p className="mb-8">_______________________</p>
                      <p>{formData.partyName1}</p>
                    </div>
                    <div>
                      <p className="mb-8">_______________________</p>
                      <p>{formData.partyName2}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    Generating...
                    <div className="animate-spin size-4 border-2 border-current border-t-transparent rounded-full" />
                  </>
                ) : (
                  <>
                    Generate PDF
                    <Download className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MakeDocument;
