
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

const getFormSchema = (documentType: string) => {
  const baseSchema = {
    fullName: z.string().min(2, { message: "Full name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
  };

  switch (documentType) {
    case "Last Will and Testament":
      return z.object({
        ...baseSchema,
        fatherName: z.string().min(2, { message: "Father's name is required" }),
        dateOfBirth: z.date({ required_error: "Date of birth is required" }),
        address: z.string().min(5, { message: "Address is required" }),
        assets: z.string().min(10, { message: "Assets description is required" }),
        beneficiaries: z.string().min(10, { message: "Beneficiaries information is required" }),
      });
      
    case "Non-Disclosure Agreement":
      return z.object({
        ...baseSchema,
        companyName: z.string().min(2, { message: "Company name is required" }),
        dateOfAgreement: z.date({ required_error: "Date of agreement is required" }),
        confidentialInfo: z.string().min(10, { message: "Description of confidential information is required" }),
        duration: z.string().min(1, { message: "Duration is required" }),
      });
      
    case "Power of Attorney":
      return z.object({
        ...baseSchema,
        fatherName: z.string().min(2, { message: "Father's name is required" }),
        dateOfBirth: z.date({ required_error: "Date of birth is required" }),
        address: z.string().min(5, { message: "Address is required" }),
        attorneyName: z.string().min(2, { message: "Attorney's name is required" }),
        powers: z.string().min(10, { message: "Powers description is required" }),
      });
    
    case "Lease Agreement":
      return z.object({
        // 1. Personal Information
        tenantName: z.string().min(2, { message: "Tenant's name is required" }),
        tenantDOB: z.date({ required_error: "Tenant's date of birth is required" }),
        landlordName: z.string().min(2, { message: "Landlord's name is required" }),
        tenantPhone: z.string().min(10, { message: "Valid phone number is required" }),
        tenantEmail: z.string().email({ message: "Valid email is required" }),
        landlordPhone: z.string().min(10, { message: "Valid phone number is required" }),
        landlordEmail: z.string().email({ message: "Valid email is required" }),
        
        // 2. Property Details
        street: z.string().min(5, { message: "Street address is required" }),
        unit: z.string().optional(),
        city: z.string().min(2, { message: "City is required" }),
        state: z.string().min(2, { message: "State is required" }),
        zipCode: z.string().min(5, { message: "ZIP code is required" }),
        
        // 3. Lease Terms
        leaseStart: z.date({ required_error: "Lease start date is required" }),
        leaseEnd: z.date({ required_error: "Lease end date is required" }),
        rentAmount: z.string().min(1, { message: "Rent amount is required" }),
        paymentMethod: z.string().min(1, { message: "Payment method is required" }),
        paymentAddress: z.string().min(5, { message: "Payment address is required" }),
        
        // 4. Financials
        securityDeposit: z.string().min(1, { message: "Security deposit amount is required" }),
        lateFee: z.string().optional(),
        nsfFee: z.string().optional(),
        
        // 5. Utilities
        utilitiesAgreement: z.boolean().default(false),
        
        // 6. Access & Penalties
        houseKeys: z.string().min(1, { message: "Number of keys is required" }),
        mailboxKeys: z.string().min(1, { message: "Number of keys is required" }),
        lockoutFee: z.string().optional(),
        keyReplacementFee: z.string().optional(),
        
        // 7. Occupancy and Guests
        authorizedTenants: z.string().min(1, { message: "Number of tenants is required" }),
        maxGuests: z.string().min(1, { message: "Maximum guests is required" }),
        maxGuestStay: z.string().min(1, { message: "Maximum stay duration is required" }),
        
        // 8. Early Termination
        terminationNoticeDays: z.string().min(1, { message: "Notice period is required" }),
        terminationFee: z.string().optional(),
        
        // 9. Signatures are handled separately
        
        // 10. Inspection Checklist
        inspectionBathrooms: z.string().optional(),
        inspectionCarpeting: z.string().optional(),
        inspectionCeilings: z.string().optional(),
        inspectionClosets: z.string().optional(),
        inspectionCountertops: z.string().optional(),
        inspectionAppliances: z.string().optional(),
        inspectionDoors: z.string().optional(),
        inspectionWalls: z.string().optional(),
        inspectionAdditional: z.string().optional(),
      });
      
    default:
      return z.object({
        ...baseSchema,
        fatherName: z.string().min(2, { message: "Father's name is required" }),
        dateOfBirth: z.date({ required_error: "Date of birth is required" }),
        address: z.string().min(5, { message: "Address is required" }),
        details: z.string().min(10, { message: "Additional details are required" }),
      });
  }
};

const generatePDF = (documentTitle: string, formData: any) => {
  console.log("Generating PDF for:", documentTitle, formData);
  
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });
    
    // Helper function to add multi-page text
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      if (!text) return y;
      
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * lineHeight);
    };
    
    // Set up document styling
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text(documentTitle, 105, 20, { align: "center" });
    
    doc.setDrawColor(44, 62, 80);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    let yPosition = 40;
    const lineHeight = 8;
    const sectionSpacing = 10;
    const maxWidth = 170;
    
    // Current date at the top
    const currentDate = format(new Date(), "PPP");
    doc.text(`Date: ${currentDate}`, 20, yPosition);
    yPosition += lineHeight * 2;
    
    if (documentTitle === "Lease Agreement") {
      // --- LEASE AGREEMENT SPECIFIC FORMATTING ---
      
      // 1. Personal Information
      doc.setFontSize(16);
      doc.text("1. PERSONAL INFORMATION", 20, yPosition);
      yPosition += lineHeight * 1.5;
      doc.setFontSize(12);
      
      doc.text(`Tenant: ${formData.tenantName}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`Date of Birth: ${formData.tenantDOB ? format(formData.tenantDOB, "PPP") : ""}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`Tenant's Phone: ${formData.tenantPhone}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`Tenant's Email: ${formData.tenantEmail}`, 20, yPosition);
      yPosition += lineHeight * 1.5;
      
      doc.text(`Landlord: ${formData.landlordName}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`Landlord's Phone: ${formData.landlordPhone}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`Landlord's Email: ${formData.landlordEmail}`, 20, yPosition);
      yPosition += lineHeight * 2;
      
      // 2. Property Details
      doc.setFontSize(16);
      doc.text("2. PROPERTY DETAILS", 20, yPosition);
      yPosition += lineHeight * 1.5;
      doc.setFontSize(12);
      
      doc.text("Leased Property Address:", 20, yPosition);
      yPosition += lineHeight;
      doc.text(`${formData.street}${formData.unit ? ", Unit " + formData.unit : ""}`, 25, yPosition);
      yPosition += lineHeight;
      doc.text(`${formData.city}, ${formData.state} ${formData.zipCode}`, 25, yPosition);
      yPosition += lineHeight * 2;
      
      // 3. Lease Terms
      doc.setFontSize(16);
      doc.text("3. LEASE TERMS", 20, yPosition);
      yPosition += lineHeight * 1.5;
      doc.setFontSize(12);
      
      doc.text(`Lease Start Date: ${formData.leaseStart ? format(formData.leaseStart, "PPP") : ""}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`Lease End Date: ${formData.leaseEnd ? format(formData.leaseEnd, "PPP") : ""}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`Monthly Rent: $${formData.rentAmount}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`Payment Method: ${formData.paymentMethod}`, 20, yPosition);
      yPosition += lineHeight;
      
      yPosition = addWrappedText(`Payment Address: ${formData.paymentAddress}`, 20, yPosition, maxWidth, lineHeight);
      yPosition += lineHeight * 2;
      
      // 4. Financials
      doc.setFontSize(16);
      doc.text("4. FINANCIALS", 20, yPosition);
      yPosition += lineHeight * 1.5;
      doc.setFontSize(12);
      
      doc.text(`Security Deposit: $${formData.securityDeposit}`, 20, yPosition);
      yPosition += lineHeight;
      if (formData.lateFee) {
        doc.text(`Late Fee: $${formData.lateFee}`, 20, yPosition);
        yPosition += lineHeight;
      }
      if (formData.nsfFee) {
        doc.text(`NSF/Returned Payment Fee: $${formData.nsfFee}`, 20, yPosition);
        yPosition += lineHeight;
      }
      yPosition += lineHeight;
      
      // Check if we need a page break
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // 5. Utilities
      doc.setFontSize(16);
      doc.text("5. UTILITIES", 20, yPosition);
      yPosition += lineHeight * 1.5;
      doc.setFontSize(12);
      
      doc.text(`Tenant agrees to pay for utilities: ${formData.utilitiesAgreement ? "Yes" : "No"}`, 20, yPosition);
      yPosition += lineHeight * 2;
      
      // 6. Access & Penalties
      doc.setFontSize(16);
      doc.text("6. ACCESS & PENALTIES", 20, yPosition);
      yPosition += lineHeight * 1.5;
      doc.setFontSize(12);
      
      doc.text(`Number of House Keys Provided: ${formData.houseKeys}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`Number of Mailbox Keys Provided: ${formData.mailboxKeys}`, 20, yPosition);
      yPosition += lineHeight;
      
      if (formData.lockoutFee) {
        doc.text(`Lockout Fee: $${formData.lockoutFee}`, 20, yPosition);
        yPosition += lineHeight;
      }
      if (formData.keyReplacementFee) {
        doc.text(`Key Replacement Fee: $${formData.keyReplacementFee}`, 20, yPosition);
        yPosition += lineHeight;
      }
      yPosition += lineHeight;
      
      // 7. Occupancy and Guests
      doc.setFontSize(16);
      doc.text("7. OCCUPANCY AND GUESTS", 20, yPosition);
      yPosition += lineHeight * 1.5;
      doc.setFontSize(12);
      
      doc.text(`Number of Authorized Tenants: ${formData.authorizedTenants}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`Maximum Number of Guests Allowed: ${formData.maxGuests}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`Maximum Duration Guests May Stay: ${formData.maxGuestStay}`, 20, yPosition);
      yPosition += lineHeight * 2;
      
      // Check if we need a page break
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // 8. Early Termination
      doc.setFontSize(16);
      doc.text("8. EARLY TERMINATION / MILITARY CLAUSE", 20, yPosition);
      yPosition += lineHeight * 1.5;
      doc.setFontSize(12);
      
      doc.text(`Days' Notice for Early Termination: ${formData.terminationNoticeDays}`, 20, yPosition);
      yPosition += lineHeight;
      if (formData.terminationFee) {
        doc.text(`Termination Fee: $${formData.terminationFee}`, 20, yPosition);
        yPosition += lineHeight;
      }
      yPosition += lineHeight * 2;
      
      // 10. Inspection Checklist (if provided)
      if (formData.inspectionBathrooms || formData.inspectionCarpeting || 
          formData.inspectionCeilings || formData.inspectionClosets || 
          formData.inspectionCountertops || formData.inspectionAppliances || 
          formData.inspectionDoors || formData.inspectionWalls || 
          formData.inspectionAdditional) {
        
        doc.setFontSize(16);
        doc.text("10. INSPECTION CHECKLIST", 20, yPosition);
        yPosition += lineHeight * 1.5;
        doc.setFontSize(12);
        
        if (formData.inspectionBathrooms) {
          yPosition = addWrappedText(`Bathrooms: ${formData.inspectionBathrooms}`, 20, yPosition, maxWidth, lineHeight);
          yPosition += lineHeight;
        }
        if (formData.inspectionCarpeting) {
          yPosition = addWrappedText(`Carpeting: ${formData.inspectionCarpeting}`, 20, yPosition, maxWidth, lineHeight);
          yPosition += lineHeight;
        }
        if (formData.inspectionCeilings) {
          yPosition = addWrappedText(`Ceilings: ${formData.inspectionCeilings}`, 20, yPosition, maxWidth, lineHeight);
          yPosition += lineHeight;
        }
        if (formData.inspectionClosets) {
          yPosition = addWrappedText(`Closets: ${formData.inspectionClosets}`, 20, yPosition, maxWidth, lineHeight);
          yPosition += lineHeight;
        }
        if (formData.inspectionCountertops) {
          yPosition = addWrappedText(`Countertops: ${formData.inspectionCountertops}`, 20, yPosition, maxWidth, lineHeight);
          yPosition += lineHeight;
        }
        if (formData.inspectionAppliances) {
          yPosition = addWrappedText(`Appliances: ${formData.inspectionAppliances}`, 20, yPosition, maxWidth, lineHeight);
          yPosition += lineHeight;
        }
        if (formData.inspectionDoors) {
          yPosition = addWrappedText(`Doors: ${formData.inspectionDoors}`, 20, yPosition, maxWidth, lineHeight);
          yPosition += lineHeight;
        }
        if (formData.inspectionWalls) {
          yPosition = addWrappedText(`Walls/Windows: ${formData.inspectionWalls}`, 20, yPosition, maxWidth, lineHeight);
          yPosition += lineHeight;
        }
        if (formData.inspectionAdditional) {
          yPosition = addWrappedText(`Additional Items: ${formData.inspectionAdditional}`, 20, yPosition, maxWidth, lineHeight);
          yPosition += lineHeight;
        }
        
        yPosition += lineHeight;
      }
      
      // Check if we need a page break
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }
      
      // 9. Signatures
      doc.setFontSize(16);
      doc.text("9. SIGNATURES & ACKNOWLEDGEMENTS", 20, yPosition);
      yPosition += lineHeight * 2;
      doc.setFontSize(12);
      
      doc.line(20, yPosition, 95, yPosition);
      yPosition += lineHeight;
      doc.text("Tenant Signature", 20, yPosition);
      yPosition += lineHeight * 2;
      
      doc.line(20, yPosition, 95, yPosition);
      yPosition += lineHeight;
      doc.text(`Tenant Name: ${formData.tenantName}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`Date: ${currentDate}`, 20, yPosition);
      yPosition += lineHeight * 2;
      
      doc.line(20, yPosition, 95, yPosition);
      yPosition += lineHeight;
      doc.text("Landlord Signature", 20, yPosition);
      yPosition += lineHeight * 2;
      
      doc.line(20, yPosition, 95, yPosition);
      yPosition += lineHeight;
      doc.text(`Landlord Name: ${formData.landlordName}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`Date: ${currentDate}`, 20, yPosition);
    } else {
      Object.entries(formData).forEach(([key, value]) => {
        if (value && typeof value !== 'object') {
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          doc.text(`${label}: ${value}`, 20, yPosition);
          yPosition += lineHeight;
        }
      });
      
      if (formData.dateOfBirth) {
        doc.text(`Date of Birth: ${format(formData.dateOfBirth, "PPP")}`, 20, yPosition);
        yPosition += lineHeight;
      }
      
      if (formData.dateOfAgreement) {
        doc.text(`Date of Agreement: ${format(formData.dateOfAgreement, "PPP")}`, 20, yPosition);
        yPosition += lineHeight;
      }
      
      if (documentTitle === "Last Will and Testament" && formData.assets) {
        yPosition += lineHeight;
        doc.setFontSize(14);
        doc.text("Assets", 20, yPosition);
        yPosition += lineHeight;
        doc.setFontSize(12);
        const assetLines = doc.splitTextToSize(formData.assets, 170);
        doc.text(assetLines, 20, yPosition);
        yPosition += (assetLines.length * lineHeight);
      }
      
      if (documentTitle === "Last Will and Testament" && formData.beneficiaries) {
        yPosition += lineHeight;
        doc.setFontSize(14);
        doc.text("Beneficiaries", 20, yPosition);
        yPosition += lineHeight;
        doc.setFontSize(12);
        const beneficiaryLines = doc.splitTextToSize(formData.beneficiaries, 170);
        doc.text(beneficiaryLines, 20, yPosition);
        yPosition += (beneficiaryLines.length * lineHeight);
      }
      
      if (documentTitle === "Non-Disclosure Agreement" && formData.confidentialInfo) {
        yPosition += lineHeight;
        doc.setFontSize(14);
        doc.text("Confidential Information", 20, yPosition);
        yPosition += lineHeight;
        doc.setFontSize(12);
        const confidentialLines = doc.splitTextToSize(formData.confidentialInfo, 170);
        doc.text(confidentialLines, 20, yPosition);
        yPosition += (confidentialLines.length * lineHeight);
      }
      
      yPosition = 240;
      doc.line(20, yPosition, 90, yPosition);
      doc.text("Signature", 45, yPosition + 10);
      
      doc.line(110, yPosition, 180, yPosition);
      doc.text("Date", 135, yPosition + 10);
    }
    
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text("This document is for reference purposes only.", 105, 280, { align: "center" });
      doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: "center" });
    }
    
    return doc;
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error("Failed to generate PDF");
  }
};

interface DocumentFormProps {
  documentTitle: string;
  onComplete: (success: boolean, pdfDoc?: any) => void;
}

const DocumentForm = ({ documentTitle, onComplete }: DocumentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formSchema = getFormSchema(documentTitle);
  type FormValues = z.infer<typeof formSchema>;
  
  const getDefaultValues = () => {
    const baseValues = {
      fullName: "",
      email: "",
    };
    
    switch (documentTitle) {
      case "Last Will and Testament":
        return {
          ...baseValues,
          fatherName: "",
          dateOfBirth: undefined,
          address: "",
          assets: "",
          beneficiaries: "",
        };
      case "Non-Disclosure Agreement":
        return {
          ...baseValues,
          companyName: "",
          dateOfAgreement: undefined,
          confidentialInfo: "",
          duration: "",
        };
      case "Power of Attorney":
        return {
          ...baseValues,
          fatherName: "",
          dateOfBirth: undefined,
          address: "",
          attorneyName: "",
          powers: "",
        };
      case "Lease Agreement":
        return {
          tenantName: "",
          tenantDOB: undefined,
          landlordName: "",
          tenantPhone: "",
          tenantEmail: "",
          landlordPhone: "",
          landlordEmail: "",
          
          street: "",
          unit: "",
          city: "",
          state: "Arkansas",
          zipCode: "",
          
          leaseStart: undefined,
          leaseEnd: undefined,
          rentAmount: "",
          paymentMethod: "",
          paymentAddress: "",
          
          securityDeposit: "",
          lateFee: "",
          nsfFee: "",
          
          utilitiesAgreement: false,
          
          houseKeys: "1",
          mailboxKeys: "1",
          lockoutFee: "",
          keyReplacementFee: "",
          
          authorizedTenants: "1",
          maxGuests: "",
          maxGuestStay: "",
          
          terminationNoticeDays: "30",
          terminationFee: "",
          
          inspectionBathrooms: "",
          inspectionCarpeting: "",
          inspectionCeilings: "",
          inspectionClosets: "",
          inspectionCountertops: "",
          inspectionAppliances: "",
          inspectionDoors: "",
          inspectionWalls: "",
          inspectionAdditional: "",
        };
      default:
        return {
          ...baseValues,
          fatherName: "",
          dateOfBirth: undefined,
          address: "",
          details: "",
        };
    }
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });
  
  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);
    
    try {
      const pdf = generatePDF(documentTitle, data);
      
      // Generate a unique filename with date stamp
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `${documentTitle.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.pdf`;
      
      console.log("Saving PDF with filename:", filename);
      
      // Save the PDF and trigger download
      pdf.save(filename);
      
      toast.success("Document generated successfully", {
        description: `Your ${documentTitle} has been created and downloaded.`
      });
      
      onComplete(true, pdf);
    } catch (error) {
      console.error("Error generating document:", error);
      toast.error("Error creating document", {
        description: "There was a problem generating your document. Please try again."
      });
      onComplete(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderFormFields = () => {
    const commonFields = (
      <>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {(documentTitle === "Last Will and Testament" || 
          documentTitle === "Power of Attorney" || 
          documentTitle !== "Non-Disclosure Agreement" && documentTitle !== "Lease Agreement") && (
          <FormField
            control={form.control}
            name="fatherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your father's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {(documentTitle === "Last Will and Testament" || 
          documentTitle === "Power of Attorney" || 
          documentTitle !== "Non-Disclosure Agreement" && documentTitle !== "Lease Agreement") && (
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {(documentTitle === "Last Will and Testament" || 
          documentTitle === "Power of Attorney" || 
          documentTitle !== "Non-Disclosure Agreement" && documentTitle !== "Lease Agreement") && (
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter your full address" 
                    className="min-h-[80px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
    
    switch (documentTitle) {
      case "Lease Agreement":
        return (
          <>
            <div className="space-y-6">
              {/* Section 1: Personal Information */}
              <div className="border p-3 rounded-lg bg-white rounded-lg shadow-sm/50">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">1. Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tenantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tenant's Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter tenant's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tenantDOB"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tenant's Date of Birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="landlordName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Landlord's Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter landlord's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tenantPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tenant's Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter tenant's phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tenantEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tenant's Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter tenant's email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="landlordPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Landlord's Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter landlord's phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="landlordEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Landlord's Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter landlord's email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              {/* Section 2: Property Details */}
              <div className="border p-3 rounded-lg bg-white rounded-lg shadow-sm/50">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">2. Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter street address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter unit number if applicable" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select 
                          defaultValue={field.value} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Arkansas">Arkansas</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ZIP code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Section 3: Lease Terms */}
              <div className="border p-3 rounded-lg bg-white rounded-lg shadow-sm/50">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">3. Lease Terms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="leaseStart"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Lease Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="leaseEnd"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Lease End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rentAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Rent ($)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter monthly rent amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., check, bank transfer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="paymentAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter address where rent payment should be sent" 
                              className="min-h-[60px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              {/* Section 4: Financials */}
              <div className="border p-3 rounded-lg bg-white rounded-lg shadow-sm/50">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">4. Financials</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="securityDeposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security Deposit ($)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter security deposit amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lateFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Late Fee ($, Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter late fee amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="nsfFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NSF/Returned Payment Fee ($, Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter NSF fee amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Section 5: Utilities */}
              <div className="border p-3 rounded-lg bg-white rounded-lg shadow-sm/50">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">5. Utilities</h3>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="utilitiesAgreement"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Tenant agrees to pay for utilities (electricity, gas, water, sewer, internet, etc.)
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Section 6: Access & Penalties */}
              <div className="border p-3 rounded-lg bg-white rounded-lg shadow-sm/50">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">6. Access & Penalties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="houseKeys"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of House Keys</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="mailboxKeys"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Mailbox Keys</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lockoutFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lockout Fee ($, Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter fee amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="keyReplacementFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Replacement Fee ($, Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter fee amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Section 7: Occupancy and Guests */}
              <div className="border p-3 rounded-lg bg-white rounded-lg shadow-sm/50">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">7. Occupancy and Guests</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="authorizedTenants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Authorized Tenants</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maxGuests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Guests Allowed</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maxGuestStay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Guest Stay Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., 7 days" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Section 8: Early Termination */}
              <div className="border p-3 rounded-lg bg-white rounded-lg shadow-sm/50">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">8. Early Termination / Military Clause</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="terminationNoticeDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notice Period for Early Termination (days)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter number of days" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="terminationFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Termination Fee ($, Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter fee amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Section 10: Inspection Checklist */}
              <div className="border p-3 rounded-lg bg-white rounded-lg shadow-sm/50">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">10. Inspection Checklist (Optional)</h3>
                <p className="text-gray-600 mb-4">
                  Document the condition of the property at move-in. This can help avoid disputes at move-out.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="inspectionBathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe condition" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="inspectionCarpeting"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carpeting</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe condition" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="inspectionCeilings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ceilings</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe condition" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="inspectionClosets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Closets</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe condition" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="inspectionCountertops"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Countertops</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe condition" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="inspectionAppliances"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appliances</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe condition" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="inspectionDoors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doors</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe condition" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="inspectionWalls"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Walls/Windows</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe condition" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="inspectionAdditional"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Items</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe any additional items or comments" 
                              className="min-h-[80px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      
      case "Last Will and Testament":
        return (
          <>
            <div className="space-y-6">
              {commonFields}
              
              <FormField
                control={form.control}
                name="assets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Assets</FormLabel>
                    <FormDescription>
                      List your assets, properties, investments, or valuables you wish to include in your will.
                    </FormDescription>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your assets" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="beneficiaries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beneficiaries</FormLabel>
                    <FormDescription>
                      List the people to whom you wish to leave your assets, and what each person should receive.
                    </FormDescription>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter beneficiary details and what they will receive" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      
      case "Non-Disclosure Agreement":
        return (
          <>
            <div className="space-y-6">
              {commonFields}
              
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dateOfAgreement"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Agreement</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confidentialInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confidential Information</FormLabel>
                    <FormDescription>
                      Describe the confidential information that will be protected under this agreement.
                    </FormDescription>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the confidential information" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration of Agreement</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., 2 years, 5 years, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      
      case "Power of Attorney":
        return (
          <>
            <div className="space-y-6">
              {commonFields}
              
              <FormField
                control={form.control}
                name="attorneyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attorney-in-Fact Name</FormLabel>
                    <FormDescription>
                      The person you're appointing to act on your behalf.
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="Enter full name of your attorney-in-fact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="powers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Powers Granted</FormLabel>
                    <FormDescription>
                      Describe the powers you're granting to your attorney-in-fact (financial, medical, etc.)
                    </FormDescription>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the powers granted" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      
      default:
        return (
          <>
            <div className="space-y-6">
              {commonFields}
              
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter any additional information" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {renderFormFields()}
        
        <div className="pt-4 border-t">
          <Button 
            type="submit" 
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Generating Document...
              </>
            ) : (
              <>Generate Document</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DocumentForm;
