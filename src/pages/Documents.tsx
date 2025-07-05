import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import LegalConcernsSection from "@/components/LegalConcernsSection";
import ConditionalForm from "@/components/ConditionalForm";
import ChildCareAuthForm from "@/components/ChildCareAuthForm";
import GeneralContractForm from "@/components/GeneralContractForm";
import IndependentContractorForm from "@/components/IndependentContractorForm";
import LivingWillForm from "@/components/LivingWillForm";
import SharePurchaseAgreementForm from "@/components/SharePurchaseAgreementForm";
import LoanAgreementForm from "@/components/LoanAgreementForm";
import GiftAffidavitForm from "@/components/GiftAffidavitForm";
import FinancialSupportAffidavitForm from "@/components/FinancialSupportAffidavitForm";
import ServicesContractForm from "@/components/ServicesContractForm";
import BusinessAgreementForm from "@/components/BusinessAgreementForm";
import DomesticServiceAgreementForm from "@/components/DomesticServiceAgreementForm";
import AgreementToSellForm from "@/components/AgreementToSellForm";
import GeneralPowerOfAttorneyForm from "@/components/GeneralPowerOfAttorneyForm";
import SpecialPowerOfAttorneyForm from "@/components/SpecialPowerOfAttorneyForm";
import SaleAgreementForm from "@/components/SaleAgreementForm";
import LLCOperatingAgreementForm from "@/components/LLCOperatingAgreementForm";
import AffidavitOfMarriageForm from "@/components/AffidavitOfMarriageForm";
import AffidavitOfResidenceForm from "@/components/AffidavitOfResidenceForm";
import DivorceSettlementAgreementForm from "@/components/DivorceSettlementAgreementForm";
import EvictionNoticeForm from "@/components/EvictionNoticeForm";
import TranscriptRequestForm from "@/components/TranscriptRequestForm";
import NDAForm from "@/components/NDAForm";
import CopyrightAssignmentForm from "@/components/CopyrightAssignmentForm";
import CopyrightLicenseForm from "@/components/CopyrightLicenseForm";
import LeaseRenewalForm from "@/components/LeaseRenewalForm";
import LeaseTerminationForm from "@/components/LeaseTerminationForm";
import CondominiumLeaseForm from "@/components/CondominiumLeaseForm";
import RentIncreaseForm from "@/components/RentIncreaseForm";
import SubleaseForm from "@/components/SubleaseForm";
import LeaseAmendmentForm from "@/components/LeaseAmendmentForm";
import CommercialLeaseForm from "@/components/CommercialLeaseForm";
import TripleNetLeaseForm from "@/components/TripleNetLeaseForm";
import CorporateBylawsForm from "@/components/CorporateBylawsForm";
import BuySellAgreementForm from "@/components/BuySellAgreementForm";
import MutualNDAForm from "@/components/MutualNDAForm";
import BusinessPlanForm from "@/components/BusinessPlanForm";
import ConfidentialInformationForm from "@/components/ConfidentialInformationForm";
import NonCircumventionForm from "@/components/NonCircumventionForm";
import CopyrightPermissionForm from "@/components/CopyrightPermissionForm";
import LicenseAgreementForm from "@/components/LicenseAgreementForm";
import ManufacturingLicenseForm from "@/components/ManufacturingLicenseForm";
import MusicLicenseForm from "@/components/MusicLicenseForm";
import PatentAssignmentForm from "@/components/PatentAssignmentForm";
import RoyaltyAgreementForm from "@/components/RoyaltyAgreementForm";
import BillboardLeaseForm from "@/components/BillboardLeaseForm";
import OfficeSpaceLeaseForm from "@/components/OfficeSpaceLeaseForm";
import StorageSpaceLeaseForm from "@/components/StorageSpaceLeaseForm";
import RestaurantLeaseForm from "@/components/RestaurantLeaseForm";
import WarehouseLeaseForm from "@/components/WarehouseLeaseForm";
import OilLeaseForm from "@/components/OilLeaseForm";
import GasLeaseForm from "@/components/GasLeaseForm";
import SecurityDepositReturnLetter from "@/components/SecurityDepositReturnLetter";
import LeaseTerminationLetter from "@/components/LeaseTerminationLetter";
import LateRentPaymentAgreement from "@/components/LateRentPaymentAgreement";
import NonDisturbanceAgreement from "@/components/NonDisturbanceAgreement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import { FileText, Users, ShoppingCart, Briefcase, Heart, ArrowLeft, Building2, DollarSign, Home, Scale, UserCheck, MapPin, Gavel, GraduationCap, Shield, TrendingUp, Handshake, UtensilsCrossed, Fuel, Search, Phone } from "lucide-react";

const Documents = () => {
  const { id } = useParams();
  const [selectedDocument, setSelectedDocument] = useState<string | null>(id || null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  // Family Protection documents
  const familyProtectionDocs = [
    {
      id: 'living-will',
      title: 'Living Will',
      description: 'Create a Living Will to specify your health care directives and agent appointments',
      icon: Heart,
      component: LivingWillForm
    },
    {
      id: 'child-care-auth',
      title: 'Child Care Authorization Agreement',
      description: 'Create an authorization agreement for child care arrangements',
      icon: Users,
      component: ChildCareAuthForm
    },
    {
      id: 'affidavit-of-marriage',
      title: 'Affidavit of Marriage',
      description: 'Create an affidavit to verify a name change due to marriage, establishing the connection between former and current names',
      icon: UserCheck,
      component: AffidavitOfMarriageForm
    },
    {
      id: 'divorce-settlement-agreement',
      title: 'Divorce Settlement Agreement',
      description: 'Create a comprehensive divorce settlement agreement covering asset division, debts, spousal support, and terms for dissolution of marriage',
      icon: Gavel,
      component: DivorceSettlementAgreementForm
    },
    {
      id: 'general-power-of-attorney',
      title: 'General Power of Attorney',
      description: 'Create a comprehensive general power of attorney for legal representation',
      icon: FileText,
      component: GeneralPowerOfAttorneyForm
    },
    {
      id: 'special-power-of-attorney',
      title: 'Special Power of Attorney',
      description: 'Create a special power of attorney for specific legal matters and court proceedings',
      icon: Scale,
      component: SpecialPowerOfAttorneyForm
    },
    {
      id: 'gift-affidavit',
      title: 'Gift Affidavit',
      description: 'Create a sworn affidavit declaring that a transfer of money or property is a gift with no expectation of repayment',
      icon: DollarSign,
      component: GiftAffidavitForm
    },
    {
      id: 'financial-support-affidavit',
      title: 'Affidavit of Financial Support',
      description: 'Create a sworn statement of your financial condition and ability to provide financial support',
      icon: DollarSign,
      component: FinancialSupportAffidavitForm
    }
  ];

  // Business Security documents
  const businessSecurityDocs = [
    {
      id: 'business-agreement',
      title: 'Business Agreement',
      description: 'Create a comprehensive business agreement between two parties for joint ventures and partnerships',
      icon: Briefcase,
      component: BusinessAgreementForm
    },
    {
      id: 'services-contract',
      title: 'Services Contract',
      description: 'Create a comprehensive services contract for professional service arrangements and staff augmentation',
      icon: Briefcase,
      component: ServicesContractForm
    },
    {
      id: 'independent-contractor',
      title: 'Independent Contractor Agreement',
      description: 'Create a comprehensive independent contractor agreement defining work relationship',
      icon: Briefcase,
      component: IndependentContractorForm
    },
    {
      id: 'nda',
      title: 'Non-Disclosure Agreement',
      description: 'Create a legally binding confidentiality agreement to protect sensitive information',
      icon: Shield,
      component: NDAForm
    },
    {
      id: 'mutual-nda',
      title: 'Mutual Non-Disclosure Agreement',
      description: 'Create a bilateral confidentiality agreement where both parties protect each other\'s sensitive information',
      icon: Handshake,
      component: MutualNDAForm
    },
    {
      id: 'llc-operating-agreement',
      title: 'LLC Operating Agreement',
      description: 'Create a comprehensive Limited Liability Company Operating Agreement with member management and governance provisions',
      icon: Building2,
      component: LLCOperatingAgreementForm
    },
    {
      id: 'sale-agreement',
      title: 'Sale Agreement',
      description: 'Create a comprehensive sale agreement for business transactions',
      icon: Briefcase,
      component: SaleAgreementForm
    },
    {
      id: 'general-contract',
      title: 'General Contract for Products',
      description: 'Create a comprehensive contract for the sale and purchase of products',
      icon: ShoppingCart,
      component: GeneralContractForm
    },
    {
      id: 'share-purchase-agreement',
      title: 'Share Purchase Agreement',
      description: 'Create a comprehensive share purchase agreement for transferring company shares',
      icon: Building2,
      component: SharePurchaseAgreementForm
    },
    {
      id: 'loan-agreement',
      title: 'Loan Agreement',
      description: 'Create a comprehensive loan agreement for personal or business lending arrangements',
      icon: DollarSign,
      component: LoanAgreementForm
    },
    {
      id: 'copyright-assignment',
      title: 'Copyright Assignment',
      description: 'Create a comprehensive copyright assignment agreement to transfer intellectual property rights',
      icon: FileText,
      component: CopyrightAssignmentForm
    },
    {
      id: 'copyright-license',
      title: 'Copyright License Agreement',
      description: 'Grant or obtain rights to use copyrighted material while maintaining ownership',
      icon: Shield,
      component: CopyrightLicenseForm
    },
    {
      id: 'domestic-service-agreement',
      title: 'Domestic Service Agreement',
      description: 'Create a comprehensive domestic service agreement for household employment arrangements',
      icon: Home,
      component: DomesticServiceAgreementForm
    },
    {
      id: 'corporate-bylaws',
      title: 'Corporate Bylaws',
      description: 'Create comprehensive corporate bylaws to establish governance structure and operational procedures',
      icon: Scale,
      component: CorporateBylawsForm
    },
    {
      id: 'buy-sell-agreement',
      title: 'Buy-Sell Agreement',
      description: 'Create a comprehensive buy-sell agreement to manage ownership transfers and protect business interests',
      icon: TrendingUp,
      component: BuySellAgreementForm
    },
    {
      id: 'business-plan',
      title: 'Business Plan',
      description: 'Create a comprehensive business plan for launching and growing your venture',
      icon: Briefcase,
      component: BusinessPlanForm
    },
    {
      id: 'confidential-information',
      title: 'Confidential Information Agreement',
      description: 'Protect sensitive business information with legally binding confidentiality terms',
      icon: Shield,
      component: ConfidentialInformationForm
    },
    {
      id: 'non-circumvention',
      title: 'Non-Circumvention Agreement',
      description: 'Protect your business relationships and prevent contact circumvention',
      icon: Handshake,
      component: NonCircumventionForm
    },
    {
      id: 'copyright-permission',
      title: 'Copyright Permission Request',
      description: 'Formally request permission to use copyrighted material in your projects',
      icon: FileText,
      component: CopyrightPermissionForm
    },
    {
      id: 'patent-assignment',
      title: 'Patent Assignment Agreement',
      description: 'Create a comprehensive patent assignment agreement to transfer patent rights and ownership',
      icon: Shield,
      component: PatentAssignmentForm
    },
    {
      id: 'royalty-agreement',
      title: 'Royalty Agreement',
      description: 'Create a professional royalty agreement for intellectual property licensing and compensation',
      icon: TrendingUp,
      component: RoyaltyAgreementForm
    },
    {
      id: 'license-agreement',
      title: 'License Agreement',
      description: 'Create a comprehensive license agreement for intellectual property rights and royalty management',
      icon: Scale,
      component: LicenseAgreementForm
    },
    {
      id: 'manufacturing-license',
      title: 'Manufacturing License Agreement',
      description: 'Create a manufacturing license agreement with quality control and legal protection',
      icon: Scale,
      component: ManufacturingLicenseForm
    },
    {
      id: 'music-license',
      title: 'Music License Agreement',
      description: 'Create a music licensing agreement for copyright protection and royalty management',
      icon: Scale,
      component: MusicLicenseForm
    },
    {
      id: 'office-space-lease',
      title: 'Office Space Lease Agreement',
      description: 'Create a comprehensive lease agreement for renting office space',
      icon: Building2,
      component: OfficeSpaceLeaseForm
    },
  ];

  // Property Matters documents
  const propertyMattersDocs = [
    {
      id: 'lease-agreement',
      title: 'Lease Agreement',
      description: 'Generate a comprehensive lease agreement for rental properties.',
      icon: FileText,
      component: ConditionalForm
    },
    {
      id: 'condominium-lease',
      title: 'Condominium Lease Agreement',
      description: 'Create a comprehensive lease agreement specifically for condominium units',
      icon: Building2,
      component: CondominiumLeaseForm
    },
    {
      id: 'lease-renewal',
      title: 'Lease Renewal Agreement',
      description: 'Create a comprehensive lease renewal agreement to extend existing rental terms',
      icon: FileText,
      component: LeaseRenewalForm
    },
    {
      id: 'lease-termination',
      title: 'Agreement to Terminate Lease',
      description: 'Create a mutual agreement to terminate a lease before its expiration date',
      icon: FileText,
      component: LeaseTerminationForm
    },
    {
      id: 'rent-increase',
      title: 'Rent Increase Agreement',
      description: 'Create a formal agreement to increase rent between landlord and tenant',
      icon: DollarSign,
      component: RentIncreaseForm
    },
    {
      id: 'sublease',
      title: 'Sublease Agreement',
      description: 'Create a comprehensive sublease agreement with property inspection checklist',
      icon: Building2,
      component: SubleaseForm
    },
    {
      id: 'lease-amendment',
      title: 'Lease Amendment',
      description: 'Create a formal amendment to modify existing lease terms and conditions',
      icon: FileText,
      component: LeaseAmendmentForm
    },
    {
      id: 'commercial-lease',
      title: 'Commercial Lease Agreement',
      description: 'Create a comprehensive commercial lease agreement for business properties',
      icon: Building2,
      component: CommercialLeaseForm
    },
    {
      id: 'billboard-lease',
      title: 'Billboard Lease Agreement',
      description: 'Create a comprehensive lease agreement for billboard advertising space on private property',
      icon: Building2,
      component: BillboardLeaseForm
    },
    {
      id: 'agreement-to-sell',
      title: 'Agreement to Sell',
      description: 'Create a comprehensive agreement to sell for property transactions',
      icon: FileText,
      component: AgreementToSellForm
    },
    {
      id: 'eviction-notice',
      title: 'Eviction Notice',
      description: 'Create a formal notice to terminate a tenancy and initiate eviction proceedings',
      icon: FileText,
      component: EvictionNoticeForm
    },
    {
      id: 'affidavit-of-residence',
      title: 'Affidavit of Residence',
      description: 'Create an affidavit to verify residence for living or deceased persons, establishing legal domicile and residence history',
      icon: MapPin,
      component: AffidavitOfResidenceForm
    },
    {
      id: 'transcript-request',
      title: 'Transcript Request',
      description: 'Create a formal request for academic transcripts and degree documents from educational institutions',
      icon: GraduationCap,
      component: TranscriptRequestForm
    },
    {
      id: 'storage-space-lease',
      title: 'Storage Space Lease Agreement',
      description: 'Create a comprehensive lease agreement for renting storage space',
      icon: Building2,
      component: StorageSpaceLeaseForm
    },
    {
      id: 'restaurant-lease',
      title: 'Restaurant Lease Agreement',
      description: 'Create a comprehensive lease agreement for restaurant and food service operations',
      icon: UtensilsCrossed,
      component: RestaurantLeaseForm
    },
    {
      id: 'warehouse-lease',
      title: 'Warehouse Lease Agreement',
      description: 'Create a comprehensive lease agreement for warehouse, storage, and distribution facilities',
      icon: Building2,
      component: WarehouseLeaseForm
    },
    {
      id: 'oil-lease',
      title: 'Oil Lease Agreement',
      description: 'Create a comprehensive oil and gas lease agreement for mineral rights and hydrocarbon extraction',
      icon: Fuel,
      component: OilLeaseForm
    },
    {
      id: 'gas-lease',
      title: 'Gas Lease Agreement',
      description: 'Create a comprehensive gas lease agreement for natural gas exploration and energy development',
      icon: Fuel,
      component: GasLeaseForm
    },
    {
      id: 'security-deposit-return',
      title: 'Security Deposit Return Letter',
      description: 'Create a professional letter for returning security deposits with deduction details',
      icon: FileText,
      component: SecurityDepositReturnLetter
    },
    {
      id: 'lease-termination-letter',
      title: 'Lease Termination Letter',
      description: 'Create a professional letter to notify tenants of lease termination',
      icon: FileText,
      component: LeaseTerminationLetter
    },
    {
      id: 'late-rent-payment-agreement',
      title: 'Late Rent Payment Agreement',
      description: 'Create a professional agreement for tenants with past due rent to establish payment plans',
      icon: DollarSign,
      component: LateRentPaymentAgreement
    },
    {
      id: 'non-disturbance-agreement',
      title: 'Non-Disturbance Agreement',
      description: 'Create a professional non-disturbance agreement between mortgagee and tenant',
      icon: Shield,
      component: NonDisturbanceAgreement
    }
  ];

  // Combine all documents for direct access
  const allDocumentTypes = [...familyProtectionDocs, ...businessSecurityDocs, ...propertyMattersDocs];

  // Filter documents based on search query
  const filteredDocuments = (docs: any[]) => {
    if (!searchQuery.trim()) return docs;
    return docs.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Handle search from main page
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowSearchResults(true);
      setSelectedCategory(null);
    }
    // Don't go back when query is empty - stay on search results page
  };

  // Get documents for selected category
  const getCategoryDocuments = (category: string) => {
    switch (category) {
      case 'family-protection':
        return familyProtectionDocs;
      case 'business-security':
        return businessSecurityDocs;
      case 'property-matters':
        return propertyMattersDocs;
      default:
        return allDocumentTypes;
    }
  };

  const selectedDocumentType = allDocumentTypes.find(doc => doc.id === selectedDocument);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedDocument(null);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedDocument(null);
  };

  const handleBackToDocuments = () => {
    setSelectedDocument(null);
  };

  const handleBackToSearch = () => {
    setShowSearchResults(false);
    setSearchQuery("");
  };

  // Render search results
  if (showSearchResults) {
    const searchResults = filteredDocuments(allDocumentTypes);
    
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 bg-white min-h-screen pt-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Search Results</h1>
            <p className="text-muted-foreground mb-4">
              Found {searchResults.length} documents matching "{searchQuery}"
            </p>
            
            {/* Professional Legal Services Disclaimer */}
            <LegalDisclaimer className="mb-6" />
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button 
            variant="outline" 
            onClick={handleBackToSearch}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {searchResults.map((docType) => {
              const IconComponent = docType.icon;
              return (
                <Card 
                  key={docType.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow bg-white"
                  onClick={() => setSelectedDocument(docType.id)}
                >
                  <CardHeader className="text-center">
                    <IconComponent className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <CardTitle className="text-xl">{docType.title}</CardTitle>
                    <CardDescription className="h-20 flex items-center">
                      {docType.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button className="w-full">
                      Start Creating Document
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {searchResults.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No documents found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // Render specific document form
  if (selectedDocument && selectedDocumentType) {
    const DocumentComponent = selectedDocumentType.component;
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 bg-white min-h-screen">
          <div className="mb-8 pt-16">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{selectedDocumentType.title}</h1>
              <p className="text-muted-foreground">
                {selectedDocumentType.description}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleBackToDocuments}
              className="mb-4 mt-4 pt-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Document Selection
            </Button>
          </div>
          <DocumentComponent />
        </div>
      </Layout>
    );
  }

  // Render documents in selected category
  if (selectedCategory) {
    const categoryDocuments = getCategoryDocuments(selectedCategory);
    const categoryTitles = {
      'family-protection': 'Family Protection Documents',
      'business-security': 'Business Security Documents', 
      'property-matters': 'Property Matters Documents'
    };

    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 bg-white min-h-screen pt-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{categoryTitles[selectedCategory as keyof typeof categoryTitles]}</h1>
            <p className="text-muted-foreground">
              Choose a document type to begin generating your legal documents
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button 
            variant="outline" 
            onClick={handleBackToCategories}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categoryDocuments.map((docType) => {
              const IconComponent = docType.icon;
              return (
                <Card 
                  key={docType.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow bg-white"
                  onClick={() => setSelectedDocument(docType.id)}
                >
                  <CardHeader className="text-center">
                    <IconComponent className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <CardTitle className="text-xl">{docType.title}</CardTitle>
                    <CardDescription className="h-20 flex items-center">
                      {docType.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button className="w-full">
                      Start Creating Document
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </Layout>
    );
  }

  // Render category selection (main page)
  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-8 pt-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Legal Documents</h1>
            <p className="text-muted-foreground mb-6">
              Search and create professional legal documents from our comprehensive library
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        <LegalConcernsSection onCategorySelect={handleCategorySelect} />
      </div>
    </Layout>
  );
};

export default Documents;
