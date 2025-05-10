
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, Download, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const documentTemplates = [
  { id: "nda", name: "Non-Disclosure Agreement", category: "Business" },
  { id: "employment", name: "Employment Contract", category: "Business" },
  { id: "lease", name: "Residential Lease", category: "Real Estate" },
  { id: "will", name: "Last Will and Testament", category: "Estate" },
  { id: "poa", name: "Power of Attorney", category: "Legal" },
  { id: "llc", name: "LLC Formation", category: "Business" },
  { id: "lease_agreement", name: "Lease Agreement", category: "Real Estate" }
];

// Define form sections for the lease agreement
const leaseAgreementSections = [
  { id: 1, title: "Personal Information" },
  { id: 2, title: "Property Details" },
  { id: 3, title: "Lease Terms" },
  { id: 4, title: "Financials" },
  { id: 5, title: "Utilities" },
  { id: 6, title: "Access & Penalties" },
  { id: 7, title: "Occupancy and Guests" },
  { id: 8, title: "Early Termination" },
  { id: 9, title: "Inspection Checklist" },
  { id: 10, title: "Review & Submit" }
];

const MakeDocument = () => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    // General form data for basic templates
    partyName1: "",
    partyName2: "",
    details: "",
    date: "",
    
    // Lease Agreement specific form data
    tenantName: "",
    tenantDOB: "",
    landlordName: "",
    tenantPhone: "",
    tenantEmail: "",
    landlordPhone: "",
    landlordEmail: "",
    propertyStreet: "",
    propertyUnit: "",
    propertyCity: "",
    propertyState: "Arkansas",
    propertyZip: "",
    leaseStartDate: "",
    leaseEndDate: "",
    monthlyRent: "",
    paymentMethod: "",
    paymentAddress: "",
    securityDeposit: "",
    lateFee: "",
    nsfFee: "",
    payUtilities: false,
    houseKeys: "",
    mailboxKeys: "",
    lockoutFee: "",
    keyReplacementFee: "",
    authorizedTenants: "",
    maxGuests: "",
    maxGuestStay: "",
    terminationDays: "",
    terminationFee: "",
    bathroomsCondition: "",
    carpetingCondition: "",
    ceilingsCondition: "",
    closetsCondition: "",
    countertopsCondition: "",
    appliancesCondition: "",
    doorsCondition: "",
    wallsCondition: "",
    windowsCondition: "",
    additionalItems: ""
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStep(2);
    setCurrentSection(1); // Reset section to first when selecting a template
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const nextSection = () => {
    if (selectedTemplate === 'lease_agreement' && currentSection < leaseAgreementSections.length) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleGeneratePDF = () => {
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
      
      if (selectedTemplate === "lease_agreement") {
        // Lease Agreement PDF Generation
        
        // Personal Information Section
        doc.setFontSize(16);
        doc.text("RESIDENTIAL LEASE AGREEMENT", 105, yPosition, { align: "center" });
        yPosition += lineHeight * 2;
        
        doc.setFontSize(14);
        doc.text("1. PERSONAL INFORMATION", 20, yPosition);
        yPosition += lineHeight * 1.5;
        
        doc.setFontSize(12);
        doc.text(`Tenant: ${formData.tenantName}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Date of Birth: ${formData.tenantDOB}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Phone: ${formData.tenantPhone}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Email: ${formData.tenantEmail}`, 20, yPosition);
        yPosition += lineHeight * 1.5;
        
        doc.text(`Landlord: ${formData.landlordName}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Phone: ${formData.landlordPhone}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Email: ${formData.landlordEmail}`, 20, yPosition);
        yPosition += lineHeight * 2;
        
        // Property Details Section
        doc.setFontSize(14);
        doc.text("2. PROPERTY DETAILS", 20, yPosition);
        yPosition += lineHeight * 1.5;
        
        doc.setFontSize(12);
        doc.text("Leased Property Address:", 20, yPosition);
        yPosition += lineHeight;
        const propertyUnit = formData.propertyUnit ? `, Unit ${formData.propertyUnit}` : "";
        doc.text(`${formData.propertyStreet}${propertyUnit}`, 30, yPosition);
        yPosition += lineHeight;
        doc.text(`${formData.propertyCity}, ${formData.propertyState} ${formData.propertyZip}`, 30, yPosition);
        yPosition += lineHeight * 2;
        
        // Lease Terms Section
        doc.setFontSize(14);
        doc.text("3. LEASE TERMS", 20, yPosition);
        yPosition += lineHeight * 1.5;
        
        doc.setFontSize(12);
        doc.text(`Lease Start Date: ${formData.leaseStartDate}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Lease End Date: ${formData.leaseEndDate}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Monthly Rent: $${formData.monthlyRent}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Payment Method: ${formData.paymentMethod}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Payment Address: ${formData.paymentAddress}`, 20, yPosition);
        yPosition += lineHeight * 2;
        
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 40;
        }
        
        // Financials Section
        doc.setFontSize(14);
        doc.text("4. FINANCIALS", 20, yPosition);
        yPosition += lineHeight * 1.5;
        
        doc.setFontSize(12);
        doc.text(`Security Deposit: $${formData.securityDeposit}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Late Fee: $${formData.lateFee}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`NSF/Returned Payment Fee: $${formData.nsfFee}`, 20, yPosition);
        yPosition += lineHeight * 2;
        
        // Utilities Section
        doc.setFontSize(14);
        doc.text("5. UTILITIES", 20, yPosition);
        yPosition += lineHeight * 1.5;
        
        doc.setFontSize(12);
        doc.text(`Tenant agrees to pay utilities: ${formData.payUtilities ? "Yes" : "No"}`, 20, yPosition);
        yPosition += lineHeight * 2;
        
        // Access & Penalties Section
        doc.setFontSize(14);
        doc.text("6. ACCESS & PENALTIES", 20, yPosition);
        yPosition += lineHeight * 1.5;
        
        doc.setFontSize(12);
        doc.text(`House Keys Provided: ${formData.houseKeys}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Mailbox Keys Provided: ${formData.mailboxKeys}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Lockout Fee: $${formData.lockoutFee}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Key Replacement Fee: $${formData.keyReplacementFee}`, 20, yPosition);
        yPosition += lineHeight * 2;
        
        // Check if we need another new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 40;
        }
        
        // Occupancy and Guests Section
        doc.setFontSize(14);
        doc.text("7. OCCUPANCY AND GUESTS", 20, yPosition);
        yPosition += lineHeight * 1.5;
        
        doc.setFontSize(12);
        doc.text(`Authorized Tenants: ${formData.authorizedTenants}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Maximum Number of Guests Allowed: ${formData.maxGuests}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Maximum Duration Guests May Stay: ${formData.maxGuestStay} days`, 20, yPosition);
        yPosition += lineHeight * 2;
        
        // Early Termination Section
        doc.setFontSize(14);
        doc.text("8. EARLY TERMINATION / MILITARY CLAUSE", 20, yPosition);
        yPosition += lineHeight * 1.5;
        
        doc.setFontSize(12);
        doc.text(`Days' Notice for Early Termination: ${formData.terminationDays}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Termination Fee: $${formData.terminationFee}`, 20, yPosition);
        yPosition += lineHeight * 2;
        
        // Add a new page for signatures and inspection checklist
        doc.addPage();
        yPosition = 40;
        
        // Signatures Section
        doc.setFontSize(14);
        doc.text("9. SIGNATURES AND ACKNOWLEDGEMENTS", 20, yPosition);
        yPosition += lineHeight * 1.5;
        
        doc.setFontSize(12);
        doc.text("This agreement constitutes the entire agreement between the parties and may be", 20, yPosition);
        yPosition += lineHeight;
        doc.text("modified only in writing signed by both parties.", 20, yPosition);
        yPosition += lineHeight * 2;
        
        doc.text("Tenant Signature: _______________________", 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Tenant Name: ${formData.tenantName}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Date: ${format(new Date(), "yyyy-MM-dd")}`, 20, yPosition);
        yPosition += lineHeight * 2;
        
        doc.text("Landlord Signature: _______________________", 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Landlord Name: ${formData.landlordName}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Date: ${format(new Date(), "yyyy-MM-dd")}`, 20, yPosition);
        yPosition += lineHeight * 2;
        
        // Add a new page for inspection checklist
        doc.addPage();
        yPosition = 40;
        
        // Inspection Checklist Section
        doc.setFontSize(14);
        doc.text("10. INSPECTION CHECKLIST", 20, yPosition);
        yPosition += lineHeight * 1.5;
        
        doc.setFontSize(12);
        doc.text("Condition of Property Items:", 20, yPosition);
        yPosition += lineHeight * 1.5;
        
        // List all inspection items
        const inspectionItems = [
          { name: "Bathrooms", condition: formData.bathroomsCondition },
          { name: "Carpeting", condition: formData.carpetingCondition },
          { name: "Ceilings", condition: formData.ceilingsCondition },
          { name: "Closets", condition: formData.closetsCondition },
          { name: "Countertops", condition: formData.countertopsCondition },
          { name: "Appliances", condition: formData.appliancesCondition },
          { name: "Doors", condition: formData.doorsCondition },
          { name: "Walls", condition: formData.wallsCondition },
          { name: "Windows", condition: formData.windowsCondition }
        ];
        
        inspectionItems.forEach(item => {
          doc.text(`${item.name}: ${item.condition || "Not inspected"}`, 30, yPosition);
          yPosition += lineHeight;
        });
        
        yPosition += lineHeight;
        doc.text("Additional Items:", 20, yPosition);
        yPosition += lineHeight;
        
        if (formData.additionalItems) {
          const additionalLines = doc.splitTextToSize(formData.additionalItems, 160);
          doc.text(additionalLines, 30, yPosition);
          yPosition += (additionalLines.length * lineHeight);
        } else {
          doc.text("None", 30, yPosition);
        }
        
      } else {
        // Original general template logic
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
      }
      
      // Add footer
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text("This document is for reference purposes only.", 105, 280, { align: "center" });
      
      // Generate filename and download
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const templateNameFormatted = templateName.toLowerCase().replace(/\s+/g, '_');
      const filename = `${templateNameFormatted}_${timestamp}.pdf`;
      
      console.log("Saving PDF with filename:", filename);
      doc.save(filename);
      
      toast.success("Document generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate document");
    }
  };

  // Render Personal Information section
  const renderPersonalInfoSection = () => {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium">1. Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="tenantName" className="block text-sm font-medium mb-1">Tenant's Full Name</label>
              <Input
                id="tenantName"
                name="tenantName"
                value={formData.tenantName}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="tenantDOB" className="block text-sm font-medium mb-1">Tenant's Date of Birth</label>
              <Input
                id="tenantDOB"
                name="tenantDOB"
                type="date"
                value={formData.tenantDOB}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="tenantPhone" className="block text-sm font-medium mb-1">Tenant's Phone Number</label>
              <Input
                id="tenantPhone"
                name="tenantPhone"
                value={formData.tenantPhone}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="tenantEmail" className="block text-sm font-medium mb-1">Tenant's Email Address</label>
              <Input
                id="tenantEmail"
                name="tenantEmail"
                type="email"
                value={formData.tenantEmail}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="landlordName" className="block text-sm font-medium mb-1">Landlord's Full Name</label>
              <Input
                id="landlordName"
                name="landlordName"
                value={formData.landlordName}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="landlordPhone" className="block text-sm font-medium mb-1">Landlord's Phone Number</label>
              <Input
                id="landlordPhone"
                name="landlordPhone"
                value={formData.landlordPhone}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="landlordEmail" className="block text-sm font-medium mb-1">Landlord's Email Address</label>
              <Input
                id="landlordEmail"
                name="landlordEmail"
                type="email"
                value={formData.landlordEmail}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="button" onClick={nextSection}>
            Next <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // Render Property Details section
  const renderPropertyDetailsSection = () => {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium">2. Property Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="propertyStreet" className="block text-sm font-medium mb-1">Street</label>
              <Input
                id="propertyStreet"
                name="propertyStreet"
                value={formData.propertyStreet}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="propertyUnit" className="block text-sm font-medium mb-1">Unit (if applicable)</label>
              <Input
                id="propertyUnit"
                name="propertyUnit"
                value={formData.propertyUnit}
                onChange={handleInputChange}
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="propertyCity" className="block text-sm font-medium mb-1">City</label>
              <Input
                id="propertyCity"
                name="propertyCity"
                value={formData.propertyCity}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="propertyState" className="block text-sm font-medium mb-1">State</label>
              <Input
                id="propertyState"
                name="propertyState"
                value={formData.propertyState}
                onChange={handleInputChange}
                disabled
                className="!text-black bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="propertyZip" className="block text-sm font-medium mb-1">ZIP Code</label>
              <Input
                id="propertyZip"
                name="propertyZip"
                value={formData.propertyZip}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={prevSection}>
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <Button type="button" onClick={nextSection}>
            Next <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // Render Lease Terms section
  const renderLeaseTermsSection = () => {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium">3. Lease Terms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="leaseStartDate" className="block text-sm font-medium mb-1">Lease Start Date</label>
              <Input
                id="leaseStartDate"
                name="leaseStartDate"
                type="date"
                value={formData.leaseStartDate}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="leaseEndDate" className="block text-sm font-medium mb-1">Lease Termination Date</label>
              <Input
                id="leaseEndDate"
                name="leaseEndDate"
                type="date"
                value={formData.leaseEndDate}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="monthlyRent" className="block text-sm font-medium mb-1">Monthly Rent Amount ($)</label>
              <Input
                id="monthlyRent"
                name="monthlyRent"
                type="number"
                value={formData.monthlyRent}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium mb-1">Rent Payment Method</label>
              <Input
                id="paymentMethod"
                name="paymentMethod"
                placeholder="e.g., cash, check, online"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="paymentAddress" className="block text-sm font-medium mb-1">Landlord's Address for Rent Payment</label>
              <Input
                id="paymentAddress"
                name="paymentAddress"
                value={formData.paymentAddress}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={prevSection}>
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <Button type="button" onClick={nextSection}>
            Next <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // Render Financials section
  const renderFinancialsSection = () => {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium">4. Financials</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label htmlFor="securityDeposit" className="block text-sm font-medium mb-1">Security Deposit Amount ($)</label>
              <Input
                id="securityDeposit"
                name="securityDeposit"
                type="number"
                value={formData.securityDeposit}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="lateFee" className="block text-sm font-medium mb-1">Late Fee (if applicable)</label>
              <Input
                id="lateFee"
                name="lateFee"
                type="number"
                value={formData.lateFee}
                onChange={handleInputChange}
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="nsfFee" className="block text-sm font-medium mb-1">NSF Fee / Returned Payment Fee</label>
              <Input
                id="nsfFee"
                name="nsfFee"
                type="number"
                value={formData.nsfFee}
                onChange={handleInputChange}
                className="!text-black"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={prevSection}>
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <Button type="button" onClick={nextSection}>
            Next <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // Render Utilities section
  const renderUtilitiesSection = () => {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium">5. Utilities</h3>
          <div className="flex items-center mt-4">
            <Input
              id="payUtilities"
              name="payUtilities"
              type="checkbox"
              checked={formData.payUtilities}
              onChange={handleCheckboxChange}
              className="h-4 w-4"
            />
            <label htmlFor="payUtilities" className="ml-2 block text-sm">Tenant agrees to pay utilities</label>
          </div>
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={prevSection}>
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <Button type="button" onClick={nextSection}>
            Next <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // Render Access & Penalties section
  const renderAccessSection = () => {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium">6. Access & Penalties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="houseKeys" className="block text-sm font-medium mb-1">Number of House Keys Provided</label>
              <Input
                id="houseKeys"
                name="houseKeys"
                type="number"
                value={formData.houseKeys}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="mailboxKeys" className="block text-sm font-medium mb-1">Number of Mailbox Keys Provided</label>
              <Input
                id="mailboxKeys"
                name="mailboxKeys"
                type="number"
                value={formData.mailboxKeys}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="lockoutFee" className="block text-sm font-medium mb-1">Lockout Fee ($)</label>
              <Input
                id="lockoutFee"
                name="lockoutFee"
                type="number"
                value={formData.lockoutFee}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="keyReplacementFee" className="block text-sm font-medium mb-1">Key Replacement Fee ($)</label>
              <Input
                id="keyReplacementFee"
                name="keyReplacementFee"
                type="number"
                value={formData.keyReplacementFee}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={prevSection}>
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <Button type="button" onClick={nextSection}>
            Next <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // Render Occupancy and Guests section
  const renderOccupancySection = () => {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium">7. Occupancy and Guests</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="md:col-span-3">
              <label htmlFor="authorizedTenants" className="block text-sm font-medium mb-1">Authorized Tenants (names)</label>
              <Input
                id="authorizedTenants"
                name="authorizedTenants"
                value={formData.authorizedTenants}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="maxGuests" className="block text-sm font-medium mb-1">Maximum Number of Guests Allowed</label>
              <Input
                id="maxGuests"
                name="maxGuests"
                type="number"
                value={formData.maxGuests}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="maxGuestStay" className="block text-sm font-medium mb-1">Maximum Duration Guests May Stay (days)</label>
              <Input
                id="maxGuestStay"
                name="maxGuestStay"
                type="number"
                value={formData.maxGuestStay}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={prevSection}>
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <Button type="button" onClick={nextSection}>
            Next <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // Render Early Termination section
  const renderTerminationSection = () => {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium">8. Early Termination / Military Clause</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="terminationDays" className="block text-sm font-medium mb-1">Days' Notice for Early Termination</label>
              <Input
                id="terminationDays"
                name="terminationDays"
                type="number"
                value={formData.terminationDays}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="terminationFee" className="block text-sm font-medium mb-1">Termination Fee ($)</label>
              <Input
                id="terminationFee"
                name="terminationFee"
                type="number"
                value={formData.terminationFee}
                onChange={handleInputChange}
                required
                className="!text-black"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={prevSection}>
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <Button type="button" onClick={nextSection}>
            Next <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // Render Inspection Checklist section
  const renderInspectionSection = () => {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium">9. Inspection Checklist (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="bathroomsCondition" className="block text-sm font-medium mb-1">Bathrooms Condition</label>
              <Input
                id="bathroomsCondition"
                name="bathroomsCondition"
                value={formData.bathroomsCondition}
                onChange={handleInputChange}
                placeholder="Satisfactory/Not"
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="carpetingCondition" className="block text-sm font-medium mb-1">Carpeting Condition</label>
              <Input
                id="carpetingCondition"
                name="carpetingCondition"
                value={formData.carpetingCondition}
                onChange={handleInputChange}
                placeholder="Satisfactory/Not"
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="ceilingsCondition" className="block text-sm font-medium mb-1">Ceilings Condition</label>
              <Input
                id="ceilingsCondition"
                name="ceilingsCondition"
                value={formData.ceilingsCondition}
                onChange={handleInputChange}
                placeholder="Satisfactory/Not"
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="closetsCondition" className="block text-sm font-medium mb-1">Closets Condition</label>
              <Input
                id="closetsCondition"
                name="closetsCondition"
                value={formData.closetsCondition}
                onChange={handleInputChange}
                placeholder="Satisfactory/Not"
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="countertopsCondition" className="block text-sm font-medium mb-1">Countertops Condition</label>
              <Input
                id="countertopsCondition"
                name="countertopsCondition"
                value={formData.countertopsCondition}
                onChange={handleInputChange}
                placeholder="Satisfactory/Not"
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="appliancesCondition" className="block text-sm font-medium mb-1">Appliances Condition</label>
              <Input
                id="appliancesCondition"
                name="appliancesCondition"
                value={formData.appliancesCondition}
                onChange={handleInputChange}
                placeholder="Satisfactory/Not"
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="doorsCondition" className="block text-sm font-medium mb-1">Doors Condition</label>
              <Input
                id="doorsCondition"
                name="doorsCondition"
                value={formData.doorsCondition}
                onChange={handleInputChange}
                placeholder="Satisfactory/Not"
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="wallsCondition" className="block text-sm font-medium mb-1">Walls Condition</label>
              <Input
                id="wallsCondition"
                name="wallsCondition"
                value={formData.wallsCondition}
                onChange={handleInputChange}
                placeholder="Satisfactory/Not"
                className="!text-black"
              />
            </div>
            <div>
              <label htmlFor="windowsCondition" className="block text-sm font-medium mb-1">Windows Condition</label>
              <Input
                id="windowsCondition"
                name="windowsCondition"
                value={formData.windowsCondition}
                onChange={handleInputChange}
                placeholder="Satisfactory/Not"
                className="!text-black"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="additionalItems" className="block text-sm font-medium mb-1">Additional Items</label>
              <Textarea
                id="additionalItems"
                name="additionalItems"
                value={formData.additionalItems}
                onChange={handleInputChange}
                rows={3}
                className="!text-black"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={prevSection}>
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <Button type="button" onClick={nextSection}>
            Next <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // Render Review & Submit section
  const renderReviewSection = () => {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium">10. Review & Submit</h3>
          <p className="text-sm text-muted-foreground mt-2">Please review your information before submitting</p>
          
          <div className="mt-4 space-y-4">
            <div className="border rounded-md p-4">
              <h4 className="text-sm font-medium">Personal Information</h4>
              <p className="text-sm mt-2">Tenant: {formData.tenantName}</p>
              <p className="text-sm">Landlord: {formData.landlordName}</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="text-sm font-medium">Property</h4>
              <p className="text-sm mt-2">
                {formData.propertyStreet}{formData.propertyUnit ? `, Unit ${formData.propertyUnit}` : ''}, 
                {formData.propertyCity}, {formData.propertyState} {formData.propertyZip}
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="text-sm font-medium">Lease Terms</h4>
              <p className="text-sm mt-2">From {formData.leaseStartDate} to {formData.leaseEndDate}</p>
              <p className="text-sm">Monthly Rent: ${formData.monthlyRent}</p>
              <p className="text-sm">Security Deposit: ${formData.securityDeposit}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={prevSection}>
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </div>
    );
  };

  // Render current section based on currentSection state
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 1:
        return renderPersonalInfoSection();
      case 2:
        return renderPropertyDetailsSection();
      case 3:
        return renderLeaseTermsSection();
      case 4:
        return renderFinancialsSection();
      case 5:
        return renderUtilitiesSection();
      case 6:
        return renderAccessSection();
      case 7:
        return renderOccupancySection();
      case 8:
        return renderTerminationSection();
      case 9:
        return renderInspectionSection();
      case 10:
        return renderReviewSection();
      default:
        return renderPersonalInfoSection();
    }
  };

  // Render the standard template form
  const renderStandardTemplateForm = () => {
    return (
      <div className="space-y-4">
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
      </div>
    );
  };

  // Render a preview of the Lease Agreement
  const renderLeaseAgreementPreview = () => {
    return (
      <div className="bg-muted/30 border rounded-md p-6 min-h-[400px] space-y-6">
        <h3 className="text-center text-lg font-bold mb-6">RESIDENTIAL LEASE AGREEMENT</h3>
        
        <div>
          <h4 className="font-medium">1. PERSONAL INFORMATION</h4>
          <p className="mt-2"><strong>Tenant:</strong> {formData.tenantName}</p>
          <p><strong>Date of Birth:</strong> {formData.tenantDOB}</p>
          <p><strong>Phone:</strong> {formData.tenantPhone}</p>
          <p><strong>Email:</strong> {formData.tenantEmail}</p>
          <p className="mt-2"><strong>Landlord:</strong> {formData.landlordName}</p>
          <p><strong>Phone:</strong> {formData.landlordPhone}</p>
          <p><strong>Email:</strong> {formData.landlordEmail}</p>
        </div>
        
        <div>
          <h4 className="font-medium">2. PROPERTY DETAILS</h4>
          <p className="mt-2"><strong>Leased Property Address:</strong></p>
          <p>{formData.propertyStreet}{formData.propertyUnit ? `, Unit ${formData.propertyUnit}` : ''}</p>
          <p>{formData.propertyCity}, {formData.propertyState} {formData.propertyZip}</p>
        </div>
        
        <div>
          <h4 className="font-medium">3. LEASE TERMS</h4>
          <p className="mt-2"><strong>Lease Start Date:</strong> {formData.leaseStartDate}</p>
          <p><strong>Lease End Date:</strong> {formData.leaseEndDate}</p>
          <p><strong>Monthly Rent:</strong> ${formData.monthlyRent}</p>
          <p><strong>Payment Method:</strong> {formData.paymentMethod}</p>
          <p><strong>Payment Address:</strong> {formData.paymentAddress}</p>
        </div>
        
        <p className="text-sm text-gray-500 italic text-center mt-6">
          [Preview - Full lease agreement will be generated in PDF format]
        </p>
        
        <div className="mt-8">
          <div className="flex justify-between">
            <div>
              <p className="mb-8">_______________________</p>
              <p>{formData.tenantName}</p>
            </div>
            <div>
              <p className="mb-8">_______________________</p>
              <p>{formData.landlordName}</p>
            </div>
          </div>
        </div>
      </div>
    );
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
              {selectedTemplate === "lease_agreement" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {leaseAgreementSections.map((section) => (
                    <Button 
                      key={section.id}
                      variant={currentSection === section.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentSection(section.id)}
                      className="text-xs"
                    >
                      {section.title}
                    </Button>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {selectedTemplate === "lease_agreement" ? (
                  renderCurrentSection()
                ) : (
                  renderStandardTemplateForm()
                )}
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
              {selectedTemplate === "lease_agreement" ? (
                renderLeaseAgreementPreview()
              ) : (
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
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleGeneratePDF}
                className="flex items-center gap-2"
              >
                Generate PDF
                <Download className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MakeDocument;

