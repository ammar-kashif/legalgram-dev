import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { format } from "date-fns";
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

interface BusinessPlanData {
  state: string;
  country: string;
  businessName: string;
  industry: string;
  marketOpportunity: string;
  businessSpecialization: string;
  operatingLocation: string;
  targetCustomers: string;
  newProductType: string;
  productAttributes: string;
  totalInvestment: string;
  marketingFunds: string;
  productDevelopmentFunds: string;
  staffingFunds: string;
  workingCapitalFunds: string;
  businessDescription: string;
  industryRevenue: string;
  segmentRevenue: string;
  demandDrivers: string;
  demandTrends: string;
  marketDifferentiation: string;
  legalStructure: string;
  targetMarketDescription: string;
  customerNeeds: string;
  keyCompetitors: string;
  competitiveAdvantage: string;
  marketingCampaigns: string;
  startupCosts: string;
  monthlyExpenses: string;
  monthlyRevenue: string;
  breakEvenMonths: string;
  yearEndProfit: string;
  netMargin: string;
  unitPrice: string;
  monthlySales: string;
}

const BusinessPlanForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formData, setFormData] = useState<BusinessPlanData>({
    state: '',
    country: '',
    businessName: '',
    industry: '',
    marketOpportunity: '',
    businessSpecialization: '',
    operatingLocation: '',
    targetCustomers: '',
    newProductType: '',
    productAttributes: '',
    totalInvestment: '',
    marketingFunds: '',
    productDevelopmentFunds: '',
    staffingFunds: '',
    workingCapitalFunds: '',
    businessDescription: '',
    industryRevenue: '',
    segmentRevenue: '',
    demandDrivers: '',
    demandTrends: '',
    marketDifferentiation: '',
    legalStructure: '',
    targetMarketDescription: '',
    customerNeeds: '',
    keyCompetitors: '',
    competitiveAdvantage: '',
    marketingCampaigns: '',
    startupCosts: '',
    monthlyExpenses: '',
    monthlyRevenue: '',
    breakEvenMonths: '',
    yearEndProfit: '',
    netMargin: '',
    unitPrice: '',
    monthlySales: ''
  });

  const handleInputChange = (field: keyof BusinessPlanData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset state when country changes
    if (field === 'country') {
      setFormData(prev => ({ ...prev, state: '' }));
    }
  };

  // Helper function to get available states for selected country
  const getStatesForCountry = (countryAnswer: string): string[] => {
    if (!countryAnswer) return [];
    const countryId = parseInt(countryAnswer.split(':')[0]);
    const states = getStatesByCountry(countryId);
    return states.map(state => `${state.id}:${state.name}`);
  };

  const canAdvance = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.state && formData.country);
      case 2:
        return !!(formData.businessName && formData.industry && formData.marketOpportunity);
      case 3:
        return !!(formData.businessSpecialization && formData.operatingLocation && formData.targetCustomers);
      case 4:
        return !!(formData.newProductType && formData.productAttributes && formData.totalInvestment);
      case 5:
        return !!(formData.marketingFunds && formData.productDevelopmentFunds && formData.staffingFunds && formData.workingCapitalFunds);
      case 6:
        return !!(formData.businessDescription && formData.industryRevenue && formData.segmentRevenue);
      case 7:
        return !!(formData.demandDrivers && formData.demandTrends && formData.marketDifferentiation);
      case 8:
        return !!(formData.legalStructure && formData.targetMarketDescription && formData.customerNeeds);
      case 9:
        return !!(formData.keyCompetitors && formData.competitiveAdvantage && formData.marketingCampaigns);
      case 10:
        return !!(formData.startupCosts && formData.monthlyExpenses && formData.monthlyRevenue && formData.breakEvenMonths);
      case 11:
        return !!(formData.yearEndProfit && formData.netMargin && formData.unitPrice && formData.monthlySales);
      case 12:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canAdvance()) return;

  if (currentStep < 12) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
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
      
      // Set up the document
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Business Plan", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Helper function to add sections
      const addSection = (title: string, content: string) => {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = 20;
        }
        
        if (title) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.text(title, 15, y);
          y += lineHeight + 5;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
        }
        
        const lines = doc.splitTextToSize(content, 170);
        lines.forEach((line: string) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 15, y);
          y += lineHeight;
        });
        y += lineHeight + 5;
      };

      // Executive Summary
      addSection("Executive Summary", `${formData.businessName || '[Business Name]'} is scheduled to be launched in the ${formData.industry || '__________'} industry within the United States. The business aims to seize a clear market opportunity by offering ${formData.marketOpportunity || '_____________________________'}. Backed by experienced founders, the venture is positioned to enter and grow within this high-potential sector.`);

      // Business Description
      addSection("Business Description", `The Company will specialize in ${formData.businessSpecialization || '_____________________________'}. Services or products will be offered out of ${formData.operatingLocation || '__________'} and will be targeted to serve ${formData.targetCustomers || '_____________________________'}.`);

      // New Product
      addSection("New Product", `The business has created a new ${formData.newProductType || '__________________'} product, featuring the following attributes:`);
      addSection("", formData.productAttributes || '');

      // Investment Requirement
      addSection("Investment Requirement", `We are seeking a total investment of $${formData.totalInvestment || '__________'} to bring the product to market and establish a strong market presence.`);

      // Use of Funds
      addSection("Use of Funds", "The funds will be allocated across key operational areas, including:");
      addSection("", `$${formData.marketingFunds || '__________'} toward Marketing`);
      addSection("", `$${formData.productDevelopmentFunds || '__________'} toward Product Development`);
      addSection("", `$${formData.staffingFunds || '__________'} toward Staffing`);
      addSection("", `$${formData.workingCapitalFunds || '__________'} toward Working Capital`);

      // Business Summary
      addSection("Business Summary", `The business is a new venture that will provide ${formData.businessDescription || '_____________________________'}.`);

      // Industry Overview
      addSection("Industry Overview", `The ${formData.industry || '__________'} industry in the U.S. currently generates $${formData.industryRevenue || '__________'} in annual revenue. The segment where this business will operate is estimated to contribute $${formData.segmentRevenue || '__________'} of that total, indicating strong potential for market penetration.`);

      // Demand Trends
      addSection("Demand Trends", `The demand for ${formData.demandDrivers || '_____________________________'} is being fueled by ${formData.demandTrends || '_____________________________'}. These trends are expected to continue, creating a favorable environment for new entrants offering differentiated products or services.`);

      // Market Positioning
      addSection("Market Positioning", `This venture will focus on delivering a market-specific solution that stands out for its ${formData.marketDifferentiation || '_____________________________'}.`);

      // Legal Structure
      addSection("Legal Structure", `The business will be formally established as a ${formData.legalStructure || '__________'} and will comply with all local, state, and federal regulations.`);

      // Marketing Summary
      addSection("Marketing Summary", "");
      
      // Target Market
      addSection("Target Market", "The core target market for this business includes:");
      addSection("", formData.targetMarketDescription || '');
      addSection("", "These consumer segments are considered high-value and are most likely to benefit from or adopt the offered product/service.");

      // Customer Needs
      addSection("Customer Needs", `The identified market segments are seeking practical solutions like ${formData.customerNeeds || '_____________________________'}, and our offering is designed to meet those needs efficiently and affordably.`);

      // Competitive Advantage
      addSection("Competitive Advantage", `Key competitors include ${formData.keyCompetitors || '_____________________________'}. Our business differentiates itself through ${formData.competitiveAdvantage || '_____________________________'}, allowing us to capture market share and build brand loyalty.`);

      // Strategy and Implementation Summary
      addSection("Strategy and Implementation Summary", "");
      
      // Business Strategy
      addSection("Business Strategy", "Our strategic focus includes creating a personalized customer experience, maintaining operational efficiency, and positioning the brand as a trusted provider in the market.");

      // Implementation Timeline
      addSection("Implementation Timeline", "The rollout will occur in stages, as outlined below:");
      addSection("", "Product Design and Prototyping");
      addSection("", "Launch and Initial Marketing");
      addSection("", "Customer Acquisition and Feedback");
      addSection("", "Expansion and Scaling");
      addSection("", "In addition, the business will also engage in the following core marketing campaigns:");
      addSection("", formData.marketingCampaigns || '');

      // Financial Plan
      addSection("Financial Plan", "The Financial Plan provides a detailed view of the business's initial capital needs, operational costs, and forecasted revenue.");
      
      addSection("", `Startup Costs: $${formData.startupCosts || '__________'}`);
      addSection("", `Monthly Expenses: $${formData.monthlyExpenses || '__________'}`);
      addSection("", `Monthly Revenue Projections: $${formData.monthlyRevenue || '__________'}`);
      addSection("", `Breakeven Point: Projected within ${formData.breakEvenMonths || '__________'} months`);
      addSection("", `Year-End Profit Projection: $${formData.yearEndProfit || '__________'}`);
      addSection("", `Anticipated Net Margin: ${formData.netMargin || '__________'}%`);
      
      addSection("", `The financial projections assume a unit sale price of $${formData.unitPrice || '__________'}, with expected monthly sales of ${formData.monthlySales || '__________'} units. Other costs, such as marketing, payroll, and administration, are accounted for in the forecast.`);
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `business_plan_${timestamp}.pdf`;
      
      doc.save(filename);
      toast.success("Business Plan generated successfully!");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Business Plan");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Location Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country || ''}
                  onValueChange={(value) => handleInputChange('country', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllCountries().map((country) => (
                      <SelectItem key={country.id} value={`${country.id}:${country.name}`}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Select
                  value={formData.state || ''}
                  onValueChange={(value) => handleInputChange('state', value)}
                  disabled={!formData.country}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state/province..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatesForCountry(formData.country).map((stateOption) => {
                      const [id, name] = stateOption.split(':');
                      return (
                        <SelectItem key={id} value={stateOption}>
                          {name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Business Information</h3>
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="Enter your business name"
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                placeholder="Enter the industry (e.g., technology, healthcare, retail)"
              />
            </div>
            <div>
              <Label htmlFor="marketOpportunity">Market Opportunity</Label>
              <Textarea
                id="marketOpportunity"
                value={formData.marketOpportunity}
                onChange={(e) => handleInputChange('marketOpportunity', e.target.value)}
                placeholder="Describe the market opportunity your business aims to seize"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Operations</h3>
            <div>
              <Label htmlFor="businessSpecialization">Business Specialization</Label>
              <Textarea
                id="businessSpecialization"
                value={formData.businessSpecialization}
                onChange={(e) => handleInputChange('businessSpecialization', e.target.value)}
                placeholder="Describe what your business will specialize in"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="operatingLocation">Operating Location</Label>
              <Input
                id="operatingLocation"
                value={formData.operatingLocation}
                onChange={(e) => handleInputChange('operatingLocation', e.target.value)}
                placeholder="Enter where services/products will be offered from"
              />
            </div>
            <div>
              <Label htmlFor="targetCustomers">Target Customers</Label>
              <Textarea
                id="targetCustomers"
                value={formData.targetCustomers}
                onChange={(e) => handleInputChange('targetCustomers', e.target.value)}
                placeholder="Describe who your business will target to serve"
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Information</h3>
            <div>
              <Label htmlFor="newProductType">New Product Type</Label>
              <Input
                id="newProductType"
                value={formData.newProductType}
                onChange={(e) => handleInputChange('newProductType', e.target.value)}
                placeholder="Enter the type of new product (e.g., software, device, service)"
              />
            </div>
            <div>
              <Label htmlFor="productAttributes">Product Attributes</Label>
              <Textarea
                id="productAttributes"
                value={formData.productAttributes}
                onChange={(e) => handleInputChange('productAttributes', e.target.value)}
                placeholder="List the key features and attributes of your product"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="totalInvestment">Total Investment Required</Label>
              <Input
                id="totalInvestment"
                type="number"
                value={formData.totalInvestment}
                onChange={(e) => handleInputChange('totalInvestment', e.target.value)}
                placeholder="Enter total investment amount (numbers only)"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fund Allocation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="marketingFunds">Marketing Funds</Label>
                <Input
                  id="marketingFunds"
                  type="number"
                  value={formData.marketingFunds}
                  onChange={(e) => handleInputChange('marketingFunds', e.target.value)}
                  placeholder="Amount for marketing"
                />
              </div>
              <div>
                <Label htmlFor="productDevelopmentFunds">Product Development Funds</Label>
                <Input
                  id="productDevelopmentFunds"
                  type="number"
                  value={formData.productDevelopmentFunds}
                  onChange={(e) => handleInputChange('productDevelopmentFunds', e.target.value)}
                  placeholder="Amount for product development"
                />
              </div>
              <div>
                <Label htmlFor="staffingFunds">Staffing Funds</Label>
                <Input
                  id="staffingFunds"
                  type="number"
                  value={formData.staffingFunds}
                  onChange={(e) => handleInputChange('staffingFunds', e.target.value)}
                  placeholder="Amount for staffing"
                />
              </div>
              <div>
                <Label htmlFor="workingCapitalFunds">Working Capital Funds</Label>
                <Input
                  id="workingCapitalFunds"
                  type="number"
                  value={formData.workingCapitalFunds}
                  onChange={(e) => handleInputChange('workingCapitalFunds', e.target.value)}
                  placeholder="Amount for working capital"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Industry Analysis</h3>
            <div>
              <Label htmlFor="businessDescription">Business Description</Label>
              <Textarea
                id="businessDescription"
                value={formData.businessDescription}
                onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                placeholder="Describe what your business venture will provide"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="industryRevenue">Industry Revenue (Annual)</Label>
              <Input
                id="industryRevenue"
                type="number"
                value={formData.industryRevenue}
                onChange={(e) => handleInputChange('industryRevenue', e.target.value)}
                placeholder="Total annual revenue of your industry in the US"
              />
            </div>
            <div>
              <Label htmlFor="segmentRevenue">Your Segment Revenue</Label>
              <Input
                id="segmentRevenue"
                type="number"
                value={formData.segmentRevenue}
                onChange={(e) => handleInputChange('segmentRevenue', e.target.value)}
                placeholder="Annual revenue of your specific market segment"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Market Trends</h3>
            <div>
              <Label htmlFor="demandDrivers">Demand Drivers</Label>
              <Textarea
                id="demandDrivers"
                value={formData.demandDrivers}
                onChange={(e) => handleInputChange('demandDrivers', e.target.value)}
                placeholder="What is driving demand in your market?"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="demandTrends">Demand Trends</Label>
              <Textarea
                id="demandTrends"
                value={formData.demandTrends}
                onChange={(e) => handleInputChange('demandTrends', e.target.value)}
                placeholder="What trends are fueling this demand?"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="marketDifferentiation">Market Differentiation</Label>
              <Textarea
                id="marketDifferentiation"
                value={formData.marketDifferentiation}
                onChange={(e) => handleInputChange('marketDifferentiation', e.target.value)}
                placeholder="What makes your solution stand out in the market?"
                rows={3}
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal & Target Market</h3>
            <div>
              <Label htmlFor="legalStructure">Legal Structure</Label>
              <Input
                id="legalStructure"
                value={formData.legalStructure}
                onChange={(e) => handleInputChange('legalStructure', e.target.value)}
                placeholder="Enter legal structure (e.g., LLC, Corporation, Partnership)"
              />
            </div>
            <div>
              <Label htmlFor="targetMarketDescription">Target Market Description</Label>
              <Textarea
                id="targetMarketDescription"
                value={formData.targetMarketDescription}
                onChange={(e) => handleInputChange('targetMarketDescription', e.target.value)}
                placeholder="Describe your core target market segments"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="customerNeeds">Customer Needs</Label>
              <Textarea
                id="customerNeeds"
                value={formData.customerNeeds}
                onChange={(e) => handleInputChange('customerNeeds', e.target.value)}
                placeholder="What practical solutions are your customers seeking?"
                rows={3}
              />
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Competition & Strategy</h3>
            <div>
              <Label htmlFor="keyCompetitors">Key Competitors</Label>
              <Textarea
                id="keyCompetitors"
                value={formData.keyCompetitors}
                onChange={(e) => handleInputChange('keyCompetitors', e.target.value)}
                placeholder="List your main competitors"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="competitiveAdvantage">Competitive Advantage</Label>
              <Textarea
                id="competitiveAdvantage"
                value={formData.competitiveAdvantage}
                onChange={(e) => handleInputChange('competitiveAdvantage', e.target.value)}
                placeholder="How does your business differentiate itself?"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="marketingCampaigns">Marketing Campaigns</Label>
              <Textarea
                id="marketingCampaigns"
                value={formData.marketingCampaigns}
                onChange={(e) => handleInputChange('marketingCampaigns', e.target.value)}
                placeholder="Describe your core marketing campaigns"
                rows={4}
              />
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Financial Basics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startupCosts">Startup Costs</Label>
                <Input
                  id="startupCosts"
                  type="number"
                  value={formData.startupCosts}
                  onChange={(e) => handleInputChange('startupCosts', e.target.value)}
                  placeholder="Initial startup costs"
                />
              </div>
              <div>
                <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  value={formData.monthlyExpenses}
                  onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
                  placeholder="Expected monthly expenses"
                />
              </div>
              <div>
                <Label htmlFor="monthlyRevenue">Monthly Revenue Projections</Label>
                <Input
                  id="monthlyRevenue"
                  type="number"
                  value={formData.monthlyRevenue}
                  onChange={(e) => handleInputChange('monthlyRevenue', e.target.value)}
                  placeholder="Projected monthly revenue"
                />
              </div>
              <div>
                <Label htmlFor="breakEvenMonths">Break-even Point (Months)</Label>
                <Input
                  id="breakEvenMonths"
                  type="number"
                  value={formData.breakEvenMonths}
                  onChange={(e) => handleInputChange('breakEvenMonths', e.target.value)}
                  placeholder="Months to break even"
                />
              </div>
            </div>
          </div>
        );

      case 11:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Financial Projections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="yearEndProfit">Year-End Profit Projection</Label>
                <Input
                  id="yearEndProfit"
                  type="number"
                  value={formData.yearEndProfit}
                  onChange={(e) => handleInputChange('yearEndProfit', e.target.value)}
                  placeholder="Projected year-end profit"
                />
              </div>
              <div>
                <Label htmlFor="netMargin">Anticipated Net Margin (%)</Label>
                <Input
                  id="netMargin"
                  type="number"
                  value={formData.netMargin}
                  onChange={(e) => handleInputChange('netMargin', e.target.value)}
                  placeholder="Net margin percentage"
                />
              </div>
              <div>
                <Label htmlFor="unitPrice">Unit Sale Price</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                  placeholder="Price per unit"
                />
              </div>
              <div>
                <Label htmlFor="monthlySales">Expected Monthly Sales (Units)</Label>
                <Input
                  id="monthlySales"
                  type="number"
                  value={formData.monthlySales}
                  onChange={(e) => handleInputChange('monthlySales', e.target.value)}
                  placeholder="Units sold per month"
                />
              </div>
            </div>
          </div>
        );

      case 12:
        return (
          <UserInfoStep
            onBack={handleBack}
            onGenerate={generatePDF}
            documentType="Business Plan"
            isGenerating={isGeneratingPDF}
          />
        );

      default:
        return null;
    }
  };

  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-sm">
        <div>
          <strong>Business Overview:</strong><br />
          Name: {formData.businessName}<br />
          Industry: {formData.industry}<br />
          Legal Structure: {formData.legalStructure}
        </div>
        <div>
          <strong>Investment:</strong><br />
          Total Required: ${formData.totalInvestment}<br />
          Marketing: ${formData.marketingFunds}<br />
          Product Development: ${formData.productDevelopmentFunds}<br />
          Staffing: ${formData.staffingFunds}<br />
          Working Capital: ${formData.workingCapitalFunds}
        </div>
        <div>
          <strong>Financial Projections:</strong><br />
          Startup Costs: ${formData.startupCosts}<br />
          Monthly Expenses: ${formData.monthlyExpenses}<br />
          Monthly Revenue: ${formData.monthlyRevenue}<br />
          Break-even: {formData.breakEvenMonths} months<br />
          Year-end Profit: ${formData.yearEndProfit}<br />
          Net Margin: {formData.netMargin}%
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Business Plan.
          </p>
        </div>
      </div>
    );
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Location Information";
      case 2:
        return "Basic Information";
      case 3:
        return "Business Operations";
      case 4:
        return "Product & Investment";
      case 5:
        return "Fund Allocation";
      case 6:
        return "Industry Analysis";
      case 7:
        return "Market Trends";
      case 8:
        return "Legal & Target Market";
      case 9:
        return "Competition & Strategy";
      case 10:
        return "Financial Basics";
      case 11:
        return "Financial Projections";
      case 12:
        return "Contact Information";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Enter your location information";
      case 2:
        return "Enter basic information about your business";
      case 3:
        return "Define your business operations and target customers";
      case 4:
        return "Describe your product and investment requirements";
      case 5:
        return "Allocate funds across key operational areas";
      case 6:
        return "Analyze your industry and market segment";
      case 7:
        return "Identify market trends and differentiation";
      case 8:
        return "Define legal structure and target market";
      case 9:
        return "Analyze competition and marketing strategy";
      case 10:
        return "Establish basic financial requirements";
      case 11:
        return "Complete financial projections and pricing";
      case 12:
        return "Enter your contact information to generate the document";
      default:
        return "";
    }
  };

  if (isComplete) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-600">Business Plan</CardTitle>
            <CardDescription>
              Review your Business Plan details below before generating the final document.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderFormSummary()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => {
                setCurrentStep(1);
                setIsComplete(false);
                setFormData({
                  state: '',
                  country: '',
                  businessName: '',
                  industry: '',
                  marketOpportunity: '',
                  businessSpecialization: '',
                  operatingLocation: '',
                  targetCustomers: '',
                  newProductType: '',
                  productAttributes: '',
                  totalInvestment: '',
                  marketingFunds: '',
                  productDevelopmentFunds: '',
                  staffingFunds: '',
                  workingCapitalFunds: '',
                  businessDescription: '',
                  industryRevenue: '',
                  segmentRevenue: '',
                  demandDrivers: '',
                  demandTrends: '',
                  marketDifferentiation: '',
                  legalStructure: '',
                  targetMarketDescription: '',
                  customerNeeds: '',
                  keyCompetitors: '',
                  competitiveAdvantage: '',
                  marketingCampaigns: '',
                  startupCosts: '',
                  monthlyExpenses: '',
                  monthlyRevenue: '',
                  breakEvenMonths: '',
                  yearEndProfit: '',
                  netMargin: '',
                  unitPrice: '',
                  monthlySales: ''
                });
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
          <CardTitle className="text-xl">{getStepTitle()}</CardTitle>
          <CardDescription>
            {getStepDescription()}
            <div className="mt-2 text-sm">
              Step {currentStep} of 12
            </div>
          </CardDescription>
          {currentStep === 1 && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/business-plan-info')}
                className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Learn More About Business Plans
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="text-black">
          {renderStepContent()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!canAdvance()}
          >
            {currentStep === 11 ? (
              <>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : currentStep === 12 ? (
              <>
                Generate PDF <Send className="w-4 h-4 ml-2" />
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

export default BusinessPlanForm;
