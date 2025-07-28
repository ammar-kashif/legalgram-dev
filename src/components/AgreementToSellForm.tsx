import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, Calendar as CalendarIcon, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import CountryStateAPI from 'countries-states-cities';
import UserInfoStep from "@/components/UserInfoStep";

// Define interfaces for data structures
interface CountryData {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  phone_code: string;
  capital: string;
  currency: string;
  native: string;
  region: string;
  subregion: string;
  emoji: string;
}

interface StateData {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  state_code: string;
}

// Helper functions
const getAllCountries = (): CountryData[] => {
  return CountryStateAPI.getAllCountries();
};

const getStatesByCountry = (countryId: number): StateData[] => {
  return CountryStateAPI.getStatesOfCountry(countryId);
};

const getCountryName = (countryId: string): string => {
  const country = CountryStateAPI.getAllCountries().find(c => c.id.toString() === countryId);
  return country?.name || `Country ID: ${countryId}`;
};

const getStateName = (countryId: string, stateId: string): string => {
  const country = CountryStateAPI.getAllCountries().find(c => c.id.toString() === countryId);
  if (!country) return `State ID: ${stateId}`;
  
  const states = CountryStateAPI.getStatesOfCountry(country.id);
  const state = states.find(s => s.id.toString() === stateId);
  return state?.name || `State ID: ${stateId}`;
};

interface Party {
  name: string;
  address: string;
}

interface PropertyDetails {
  description: string;
  scheduleNumber: string;
}

interface SalePrice {
  numerical: string;
  worded: string;
}

interface NoticeInfo {
  address: string;
  phone: string;
  email: string;
}

interface ArbitrationDetails {
  jurisdiction: string;
  arbitratorName: string;
  umpireName: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  fields: {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    options?: string[];
  }[];
  nextSectionId?: string;
}

const sections: Record<string, Section> = {
  state_selection: {
    id: 'state_selection',
    title: 'State Selection',
    description: 'Select the state where the property is located.',
    fields: [
      {
        id: 'country',
        label: 'Country',
        type: 'select',
        options: getAllCountries().map(country => `${country.id}:${country.name}`),
      },
      {
        id: 'state',
        label: 'State',
        type: 'select',
        options: [], // States will be dynamically populated based on the selected country
      },
    ],
    nextSectionId: 'parties',
  },
  parties: {
    id: 'parties',
    title: 'Parties Involved',
    description: 'Enter information about the seller and the buyer.',
    fields: [
      { id: 'seller_name', label: 'Seller Name', type: 'text', placeholder: 'Full Name' },
      { id: 'seller_address', label: 'Seller Address', type: 'text', placeholder: 'Street Address' },
      { id: 'buyer_name', label: 'Buyer Name', type: 'text', placeholder: 'Full Name' },
      { id: 'buyer_address', label: 'Buyer Address', type: 'text', placeholder: 'Street Address' },
    ],
    nextSectionId: 'property',
  },
  property: {
    id: 'property',
    title: 'Property Details',
    description: 'Describe the property being sold.',
    fields: [
      { id: 'property_description', label: 'Property Description', type: 'textarea', placeholder: 'Detailed description of the property' },
      { id: 'schedule_number', label: 'Schedule Number', type: 'text', placeholder: 'Parcel or schedule number' },
    ],
    nextSectionId: 'sale_price',
  },
  sale_price: {
    id: 'sale_price',
    title: 'Sale Price',
    description: 'Specify the sale price of the property.',
    fields: [
      { id: 'numerical_price', label: 'Numerical Price', type: 'text', placeholder: 'e.g., 150000' },
      { id: 'worded_price', label: 'Price in Words', type: 'text', placeholder: 'e.g., One Hundred Fifty Thousand' },
    ],
    nextSectionId: 'agreement_date',
  },
  agreement_date: {
    id: 'agreement_date',
    title: 'Agreement Date',
    description: 'Enter the date of the agreement.',
    fields: [
      { id: 'agreement_date', label: 'Agreement Date', type: 'date' },
    ],
    nextSectionId: 'signing_date',
  },
  signing_date: {
    id: 'signing_date',
    title: 'Signing Date',
    description: 'Enter the date of signing.',
    fields: [
      { id: 'signing_date', label: 'Signing Date', type: 'date' },
    ],
    nextSectionId: 'investment_end_date',
  },
  investment_end_date: {
    id: 'investment_end_date',
    title: 'Investment End Date',
    description: 'Enter the investment end date.',
    fields: [
      { id: 'investment_end_date', label: 'Investment End Date', type: 'date' },
    ],
    nextSectionId: 'seller_notice',
  },
  seller_notice: {
    id: 'seller_notice',
    title: 'Seller Notice Information',
    description: 'Enter the seller\'s notice information.',
    fields: [
      { id: 'seller_notice_address', label: 'Seller Notice Address', type: 'text', placeholder: 'Street Address' },
      { id: 'seller_notice_phone', label: 'Seller Notice Phone', type: 'text', placeholder: 'Phone Number' },
      { id: 'seller_notice_email', label: 'Seller Notice Email', type: 'text', placeholder: 'Email Address' },
    ],
    nextSectionId: 'buyer_notice',
  },
  buyer_notice: {
    id: 'buyer_notice',
    title: 'Buyer Notice Information',
    description: 'Enter the buyer\'s notice information.',
    fields: [
      { id: 'buyer_notice_address', label: 'Buyer Notice Address', type: 'text', placeholder: 'Street Address' },
      { id: 'buyer_notice_phone', label: 'Buyer Notice Phone', type: 'text', placeholder: 'Phone Number' },
      { id: 'buyer_notice_email', label: 'Buyer Notice Email', type: 'text', placeholder: 'Email Address' },
    ],
    nextSectionId: 'arbitration',
  },
  arbitration: {
    id: 'arbitration',
    title: 'Arbitration Details',
    description: 'Enter details about the arbitration process.',
    fields: [
      { id: 'arbitration_jurisdiction', label: 'Jurisdiction', type: 'text', placeholder: 'e.g., County, State' },
      { id: 'arbitrator_name', label: 'Arbitrator Name', type: 'text', placeholder: 'Name of Arbitrator' },
      { id: 'umpire_name', label: 'Umpire Name', type: 'text', placeholder: 'Name of Umpire' },
    ],
    nextSectionId: 'confirmation',
  },
  confirmation: {
    id: 'confirmation',
    title: 'Confirmation',
    description: 'Review and confirm the information.',
    fields: [],
    nextSectionId: null,
  },
  user_info_step: {
    id: 'user_info_step',
    title: 'User Information',
    description: 'Please provide your contact information to generate the document.',
    fields: [],
    nextSectionId: null,
  },
};

const AgreementToSellForm = () => {
  const navigate = useNavigate();
  const [currentSectionId, setCurrentSectionId] = useState<string>('state_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['state_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [seller, setSeller] = useState<Party>({ name: '', address: '' });
  const [buyer, setBuyer] = useState<Party>({ name: '', address: '' });
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({ description: '', scheduleNumber: '' });
  const [salePrice, setSalePrice] = useState<SalePrice>({ numerical: '', worded: '' });
  const [sellerNotice, setSellerNotice] = useState<NoticeInfo>({ address: '', phone: '', email: '' });
  const [buyerNotice, setBuyerNotice] = useState<NoticeInfo>({ address: '', phone: '', email: '' });
  const [arbitrationDetails, setArbitrationDetails] = useState<ArbitrationDetails>({ 
    jurisdiction: '', 
    arbitratorName: '', 
    umpireName: '' 
  });
  const [agreementDate, setAgreementDate] = useState<Date>();
  const [signingDate, setSigningDate] = useState<Date>();
  const [investmentEndDate, setInvestmentEndDate] = useState<Date>();
  
  const currentSection = sections[currentSectionId];

  const handleNext = () => {
    try {
      const nextSectionId = currentSection?.nextSectionId;
      
      if (!nextSectionId) {
        if (currentSectionId === 'confirmation') {
          // Go to user info step
          setCurrentSectionId('user_info_step');
          setSectionHistory([...sectionHistory, 'user_info_step']);
        } else {
          setIsComplete(true);
        }
        return;
      }
      
      // Validate that the next section exists
      if (sections[nextSectionId]) {
        setSectionHistory([...sectionHistory, nextSectionId]);
        setCurrentSectionId(nextSectionId);
      } else {
        console.error(`Next section ${nextSectionId} does not exist`);
        toast.error("Navigation error. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  
  const handleBack = () => {
    if (sectionHistory.length > 1) {
      const newHistory = [...sectionHistory];
      newHistory.pop();
      setSectionHistory(newHistory);
      setCurrentSectionId(newHistory[newHistory.length - 1]);
    }
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      
      // Set document properties
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      let yPosition = 30;

      // Helper function to add text with line breaks
      const addText = (text: string, x: number, y: number, options: any = {}) => {
        const textLines = doc.splitTextToSize(text, 180);
        doc.text(textLines, x, y, options);
        return textLines.length * 7; // Adjust line height as needed
      };

      // Add title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("AGREEMENT TO SELL", 105, yPosition, { align: "center" });
      yPosition += 20;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      // Add state information
      const countryName = getCountryName(answers['country']?.split(':')[0] || '');
      const stateName = getStateName(answers['country']?.split(':')[0] || '', answers['state']?.split(':')[0] || '');
      yPosition += addText(`This Agreement is made and entered into as of the signing date, between the parties listed below and pertaining to property located in the State of ${stateName}, ${countryName}.`, 20, yPosition);
      yPosition += 15;

      // Add parties information
      doc.setFont("helvetica", "bold");
      doc.text("Parties:", 20, yPosition);
      yPosition += 10;
      doc.setFont("helvetica", "normal");
      yPosition += addText(`Seller: ${seller.name}, residing at ${seller.address}`, 20, yPosition);
      yPosition += addText(`Buyer: ${buyer.name}, residing at ${buyer.address}`, 20, yPosition);
      yPosition += 15;

      // Add property details
      doc.setFont("helvetica", "bold");
      doc.text("Property:", 20, yPosition);
      yPosition += 10;
      doc.setFont("helvetica", "normal");
      yPosition += addText(`Description: ${propertyDetails.description}`, 20, yPosition);
      yPosition += addText(`Schedule Number: ${propertyDetails.scheduleNumber}`, 20, yPosition);
      yPosition += 15;

      // Add sale price
      doc.setFont("helvetica", "bold");
      doc.text("Sale Price:", 20, yPosition);
      yPosition += 10;
      doc.setFont("helvetica", "normal");
      yPosition += addText(`Numerical Price: $${salePrice.numerical}`, 20, yPosition);
      yPosition += addText(`Price in Words: ${salePrice.worded}`, 20, yPosition);
      yPosition += 15;

      // Add agreement date
      doc.setFont("helvetica", "bold");
      doc.text("Agreement Date:", 20, yPosition);
      yPosition += 10;
      doc.setFont("helvetica", "normal");
      yPosition += addText(`Date: ${agreementDate ? format(agreementDate, 'MMMM dd, yyyy') : 'Not specified'}`, 20, yPosition);
      yPosition += 15;

      // Add signing date
      doc.setFont("helvetica", "bold");
      doc.text("Signing Date:", 20, yPosition);
      yPosition += 10;
      doc.setFont("helvetica", "normal");
      yPosition += addText(`Date: ${signingDate ? format(signingDate, 'MMMM dd, yyyy') : 'Not specified'}`, 20, yPosition);
      yPosition += 15;

      // Add investment end date
      doc.setFont("helvetica", "bold");
      doc.text("Investment End Date:", 20, yPosition);
      yPosition += 10;
      doc.setFont("helvetica", "normal");
      yPosition += addText(`Date: ${investmentEndDate ? format(investmentEndDate, 'MMMM dd, yyyy') : 'Not specified'}`, 20, yPosition);
      yPosition += 15;

      // Add seller notice information
      doc.setFont("helvetica", "bold");
      doc.text("Seller Notice Information:", 20, yPosition);
      yPosition += 10;
      doc.setFont("helvetica", "normal");
      yPosition += addText(`Address: ${sellerNotice.address}`, 20, yPosition);
      yPosition += addText(`Phone: ${sellerNotice.phone}`, 20, yPosition);
      yPosition += addText(`Email: ${sellerNotice.email}`, 20, yPosition);
      yPosition += 15;

      // Add buyer notice information
      doc.setFont("helvetica", "bold");
      doc.text("Buyer Notice Information:", 20, yPosition);
      yPosition += 10;
      doc.setFont("helvetica", "normal");
      yPosition += addText(`Address: ${buyerNotice.address}`, 20, yPosition);
      yPosition += addText(`Phone: ${buyerNotice.phone}`, 20, yPosition);
      yPosition += addText(`Email: ${buyerNotice.email}`, 20, yPosition);
      yPosition += 15;

      // Add arbitration details
      doc.setFont("helvetica", "bold");
      doc.text("Arbitration Details:", 20, yPosition);
      yPosition += 10;
      doc.setFont("helvetica", "normal");
      yPosition += addText(`Jurisdiction: ${arbitrationDetails.jurisdiction}`, 20, yPosition);
      yPosition += addText(`Arbitrator Name: ${arbitrationDetails.arbitratorName}`, 20, yPosition);
      yPosition += addText(`Umpire Name: ${arbitrationDetails.umpireName}`, 20, yPosition);
      yPosition += 15;
      
      doc.save('agreement-to-sell.pdf');
      toast.success("Agreement to Sell PDF generated successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate Agreement to Sell PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleAnswerChange = (fieldId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));

    // Update state options when country changes
    if (fieldId === 'country') {
      // Reset state selection when country changes
      setAnswers(prev => ({ ...prev, state: '' }));
    }

    // Update seller, buyer, propertyDetails, salePrice, noticeInfo, arbitrationDetails, agreementDate, signingDate, investmentEndDate
    if (fieldId === 'seller_name' || fieldId === 'seller_address') {
      setSeller(prev => ({ ...prev, [fieldId.replace('seller_', '')]: value }));
    } else if (fieldId === 'buyer_name' || fieldId === 'buyer_address') {
      setBuyer(prev => ({ ...prev, [fieldId.replace('buyer_', '')]: value }));
    } else if (fieldId === 'property_description' || fieldId === 'schedule_number') {
      setPropertyDetails(prev => ({ ...prev, [fieldId.replace('property_', '')]: value }));
    } else if (fieldId === 'numerical_price' || fieldId === 'worded_price') {
      setSalePrice(prev => ({ ...prev, [fieldId.replace('price_', '')]: value }));
    } else if (fieldId === 'seller_notice_address' || fieldId === 'seller_notice_phone' || fieldId === 'seller_notice_email') {
      setSellerNotice(prev => ({ ...prev, [fieldId.replace('seller_notice_', '')]: value }));
    } else if (fieldId === 'buyer_notice_address' || fieldId === 'buyer_notice_phone' || fieldId === 'buyer_notice_email') {
      setBuyerNotice(prev => ({ ...prev, [fieldId.replace('buyer_notice_', '')]: value }));
    } else if (fieldId === 'arbitration_jurisdiction' || fieldId === 'arbitrator_name' || fieldId === 'umpire_name') {
      setArbitrationDetails(prev => ({ ...prev, [fieldId.replace('arbitration_', '')]: value }));
    }
  };

  const getStatesForCountry = (countryAnswer: string): string[] => {
    if (!countryAnswer) return [];
    const countryId = parseInt(countryAnswer.split(':')[0]);
    const states = getStatesByCountry(countryId);
    return states.map(state => `${state.id}:${state.name}`);
  };

  const renderField = (field: Section['fields'][0]) => {
    const value = answers[field.id] || '';

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              type="text"
              id={field.id}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleAnswerChange(field.id, e.target.value)}
            />
          </div>
        );
      case 'textarea':
        return (
          <div key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleAnswerChange(field.id, e.target.value)}
              rows={4}
            />
          </div>
        );
      case 'select':
        // Dynamically populate state options based on selected country
        let options = field.id === 'state' ? getStatesForCountry(answers['country']) : field.options || [];

        return (
          <div key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Select
              onValueChange={(val) => handleAnswerChange(field.id, val)}
              defaultValue={value}
              disabled={field.id === 'state' && !answers['country']}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => {
                  const [id, name] = option.split(':');
                  return (
                    <SelectItem key={id} value={option}>
                      {name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        );
      case 'date':
        const [selectedDate, setSelectedDate] = useState<Date | undefined>(
          field.id === 'agreement_date' ? agreementDate :
          field.id === 'signing_date' ? signingDate :
          field.id === 'investment_end_date' ? investmentEndDate : undefined
        );
      
        const handleDateChange = (date: Date | undefined) => {
          setSelectedDate(date);
          handleAnswerChange(field.id, date ? format(date, 'yyyy-MM-dd') : '');
      
          if (field.id === 'agreement_date') {
            setAgreementDate(date);
          } else if (field.id === 'signing_date') {
            setSigningDate(date);
          } else if (field.id === 'investment_end_date') {
            setInvestmentEndDate(date);
          }
        };
      
        return (
          <div key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      default:
        return null;
    }
  };

  const renderSectionContent = () => {
    if (!currentSection) {
      return <div>Section not found.</div>;
    }

    return (
      <div className="space-y-4">
        {currentSection.fields.map(field => renderField(field))}
      </div>
    );
  };

  const renderFormSummary = () => {
    const countryName = getCountryName(answers['country']?.split(':')[0] || '');
    const stateName = getStateName(answers['country']?.split(':')[0] || '', answers['state']?.split(':')[0] || '');

    return (
      <div className="space-y-4 text-sm">
        <div>
          <strong>Location:</strong><br />
          Country: {countryName}<br />
          State: {stateName}
        </div>
        <div>
          <strong>Parties:</strong><br />
          Seller: {seller.name} ({seller.address})<br />
          Buyer: {buyer.name} ({buyer.address})
        </div>
        <div>
          <strong>Property:</strong><br />
          Description: {propertyDetails.description}<br />
          Schedule Number: {propertyDetails.scheduleNumber}
        </div>
        <div>
          <strong>Sale Price:</strong><br />
          Numerical: {salePrice.numerical}<br />
          Worded: {salePrice.worded}
        </div>
        <div>
          <strong>Agreement Date:</strong><br />
          {agreementDate ? format(agreementDate, 'MMMM dd, yyyy') : 'Not specified'}
        </div>
        <div>
          <strong>Signing Date:</strong><br />
          {signingDate ? format(signingDate, 'MMMM dd, yyyy') : 'Not specified'}
        </div>
        <div>
          <strong>Investment End Date:</strong><br />
          {investmentEndDate ? format(investmentEndDate, 'MMMM dd, yyyy') : 'Not specified'}
        </div>
        <div>
          <strong>Seller Notice:</strong><br />
          Address: {sellerNotice.address}<br />
          Phone: {sellerNotice.phone}<br />
          Email: {sellerNotice.email}
        </div>
        <div>
          <strong>Buyer Notice:</strong><br />
          Address: {buyerNotice.address}<br />
          Phone: {buyerNotice.phone}<br />
          Email: {buyerNotice.email}
        </div>
        <div>
          <strong>Arbitration:</strong><br />
          Jurisdiction: {arbitrationDetails.jurisdiction}<br />
          Arbitrator: {arbitrationDetails.arbitratorName}<br />
          Umpire: {arbitrationDetails.umpireName}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided.
            This document will serve as your official Agreement to Sell.
          </p>
        </div>
      </div>
    );
  };

  if (currentSectionId === 'user_info_step') {
    return (
      <UserInfoStep
        onBack={handleBack}
        onGenerate={generatePDF}
        documentType="Agreement to Sell"
        isGenerating={isGeneratingPDF}
      />
    );
  }

  if (isComplete) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-600">Agreement to Sell</CardTitle>
            <CardDescription>
              Review your Agreement to Sell details below before generating the final document.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderFormSummary()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentSectionId('state_selection');
                setAnswers({});
                setSectionHistory(['state_selection']);
                setIsComplete(false);
                setSeller({ name: '', address: '' });
                setBuyer({ name: '', address: '' });
                setPropertyDetails({ description: '', scheduleNumber: '' });
                setSalePrice({ numerical: '', worded: '' });
                setSellerNotice({ address: '', phone: '', email: '' });
                setBuyerNotice({ address: '', phone: '', email: '' });
                setArbitrationDetails({ jurisdiction: '', arbitratorName: '', umpireName: '' });
                setAgreementDate(undefined);
                setSigningDate(undefined);
                setInvestmentEndDate(undefined);
              }}
            >
              Start Over
            </Button>
            <Button onClick={generatePDF}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm p-4">
      <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">{currentSection?.title}</CardTitle>
          <CardDescription>
            {currentSection?.description}
            <div className="mt-2 text-sm">
              Section {sectionHistory.indexOf(currentSectionId) + 1} of {Object.keys(sections).length - 2}
            </div>
          </CardDescription>
          {currentSectionId === 'state_selection' && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/agreement-to-sell-info')}
                className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn More About Agreements to Sell
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="text-black">
          {renderSectionContent()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={sectionHistory.length <= 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button
            onClick={handleNext}
          >
            {currentSection?.nextSectionId === null ? (
              <>
                Complete <Send className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AgreementToSellForm;
