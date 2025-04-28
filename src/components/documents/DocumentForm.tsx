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
import { toast } from "@/components/ui/use-toast";
import { jsPDF } from "jspdf";

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

const generatePDF = (documentType: string, formData: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.setTextColor(0, 51, 102);
  doc.text(documentType, 105, 20, { align: "center" });
  
  doc.setDrawColor(0, 51, 102);
  doc.line(20, 25, 190, 25);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  let yPosition = 40;
  const lineHeight = 10;
  
  doc.setFontSize(12);
  doc.text(`Full Name: ${formData.fullName}`, 20, yPosition);
  yPosition += lineHeight;
  
  if (formData.fatherName) {
    doc.text(`Father's Name: ${formData.fatherName}`, 20, yPosition);
    yPosition += lineHeight;
  }
  
  if (formData.dateOfBirth) {
    doc.text(`Date of Birth: ${format(formData.dateOfBirth, "PPP")}`, 20, yPosition);
    yPosition += lineHeight;
  }
  
  if (formData.address) {
    doc.text(`Address: ${formData.address}`, 20, yPosition);
    yPosition += lineHeight;
  }
  
  doc.text(`Email: ${formData.email}`, 20, yPosition);
  yPosition += lineHeight * 1.5;
  
  doc.setFontSize(14);
  doc.text("Document Details", 20, yPosition);
  yPosition += lineHeight;
  
  doc.setFontSize(12);
  switch (documentType) {
    case "Last Will and Testament":
      doc.text("ASSETS:", 20, yPosition);
      yPosition += lineHeight;
      
      const assetLines = doc.splitTextToSize(formData.assets, 170);
      doc.text(assetLines, 20, yPosition);
      yPosition += lineHeight * (assetLines.length + 1);
      
      doc.text("BENEFICIARIES:", 20, yPosition);
      yPosition += lineHeight;
      
      const beneficiaryLines = doc.splitTextToSize(formData.beneficiaries, 170);
      doc.text(beneficiaryLines, 20, yPosition);
      break;
      
    case "Non-Disclosure Agreement":
      doc.text(`Company Name: ${formData.companyName}`, 20, yPosition);
      yPosition += lineHeight;
      
      doc.text(`Date of Agreement: ${format(formData.dateOfAgreement, "PPP")}`, 20, yPosition);
      yPosition += lineHeight;
      
      doc.text(`Duration: ${formData.duration}`, 20, yPosition);
      yPosition += lineHeight * 1.5;
      
      doc.text("CONFIDENTIAL INFORMATION:", 20, yPosition);
      yPosition += lineHeight;
      
      const confidentialLines = doc.splitTextToSize(formData.confidentialInfo, 170);
      doc.text(confidentialLines, 20, yPosition);
      break;
      
    case "Power of Attorney":
      doc.text(`Attorney Name: ${formData.attorneyName}`, 20, yPosition);
      yPosition += lineHeight * 1.5;
      
      doc.text("POWERS GRANTED:", 20, yPosition);
      yPosition += lineHeight;
      
      const powerLines = doc.splitTextToSize(formData.powers, 170);
      doc.text(powerLines, 20, yPosition);
      break;
      
    default:
      if (formData.details) {
        doc.text("ADDITIONAL DETAILS:", 20, yPosition);
        yPosition += lineHeight;
        
        const detailLines = doc.splitTextToSize(formData.details, 170);
        doc.text(detailLines, 20, yPosition);
      }
  }
  
  yPosition = 240;
  doc.line(20, yPosition, 100, yPosition);
  doc.text("Signature", 50, yPosition + 5);
  
  doc.line(120, yPosition, 190, yPosition);
  doc.text("Date", 150, yPosition + 5);
  
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text("Generated with LawConnect - This document is for reference only", 105, 285, { align: "center" });
  
  return doc;
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
    try {
      setIsSubmitting(true);
      
      const pdf = generatePDF(documentTitle, data);
      
      // Save a copy of the PDF
      pdf.save(`${documentTitle.replace(/\s+/g, "_").toLowerCase()}.pdf`);
      
      toast({
        title: "Document created successfully",
        description: "Your document has been generated and downloaded.",
      });
      
      // Pass both success state and PDF object to parent component
      onComplete(true, pdf);
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Error creating document",
        description: "There was an error generating your document. Please try again.",
        variant: "destructive",
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
          documentTitle !== "Non-Disclosure Agreement") && (
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
          documentTitle !== "Non-Disclosure Agreement") && (
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
          documentTitle !== "Non-Disclosure Agreement") && (
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
      case "Last Will and Testament":
        return (
          <>
            {commonFields}
            <FormField
              control={form.control}
              name="assets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of Assets</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List and describe your assets (property, investments, etc.)" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Be as detailed as possible about your assets.
                  </FormDescription>
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
                  <FormControl>
                    <Textarea 
                      placeholder="List the names and relationships of your beneficiaries" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Include full names and relationship to you.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
        
      case "Non-Disclosure Agreement":
        return (
          <>
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
                  <FormLabel>Confidential Information Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the confidential information covered by this agreement" 
                      className="min-h-[100px]" 
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
          </>
        );
        
      case "Power of Attorney":
        return (
          <>
            {commonFields}
            <FormField
              control={form.control}
              name="attorneyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attorney's Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter attorney's full name" {...field} />
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
                  <FormControl>
                    <Textarea 
                      placeholder="List the powers you are granting to your attorney" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific about what your attorney is allowed to do on your behalf.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
        
      default:
        return (
          <>
            {commonFields}
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter any additional information required for this document" 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {renderFormFields()}
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit"
            className="bg-[#F97316] hover:bg-[#D15316] text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Generating Document..." : "Generate Document"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DocumentForm;
