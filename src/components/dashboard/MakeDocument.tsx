import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, ShoppingCart, Briefcase, Heart, Building2, DollarSign, Home, Scale, UserCheck, MapPin, Gavel, GraduationCap, Shield, ArrowLeft, TrendingUp, Handshake, Factory, ShoppingBag } from "lucide-react";
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
import DomesticServiceAgreementForm from "@/components/DomesticServiceAgreementForm";
import AgreementToSellForm from "@/components/AgreementToSellForm";
import GeneralPowerOfAttorneyForm from "@/components/GeneralPowerOfAttorneyForm";
import SpecialPowerOfAttorneyForm from "@/components/SpecialPowerOfAttorneyForm";
import SaleAgreementForm from "@/components/SaleAgreementForm";
import BusinessAgreementForm from "@/components/BusinessAgreementForm";
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
import SoftwareLicenseForm from "@/components/SoftwareLicenseForm";
import MerchandisingAgreementForm from "@/components/MerchandisingAgreementForm";


const MakeDocument = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Family Protection documents
  const familyProtectionDocs = [
    {
      id: 'living-will',
      title: 'Living Will',
      description: 'Health Care & Estate Planning',
      content: 'Create a Living Will to specify your health care directives and agent appointments',
      icon: Heart,
      component: LivingWillForm
    },
    {
      id: 'child-care-auth',
      title: 'Child Care Authorization Agreement',
      description: 'Family Law',
      content: 'Create an authorization agreement for child care arrangements',
      icon: Users,
      component: ChildCareAuthForm
    },
    {
      id: 'affidavit-of-marriage',
      title: 'Affidavit of Marriage',
      description: 'Family Law & Name Change',
      content: 'Create an affidavit to verify a name change due to marriage, establishing the connection between former and current names',
      icon: UserCheck,
      component: AffidavitOfMarriageForm
    },
    {
      id: 'divorce-settlement-agreement',
      title: 'Divorce Settlement Agreement',
      description: 'Family Law & Divorce',
      content: 'Create a comprehensive divorce settlement agreement covering asset division, debts, spousal support, and terms for dissolution of marriage',
      icon: Gavel,
      component: DivorceSettlementAgreementForm
    },
    {
      id: 'general-power-of-attorney',
      title: 'General Power of Attorney',
      description: 'Legal Authority & Powers',
      content: 'Create a comprehensive general power of attorney for legal representation',
      icon: FileText,
      component: GeneralPowerOfAttorneyForm
    },
    {
      id: 'special-power-of-attorney',
      title: 'Special Power of Attorney',
      description: 'Legal Authority & Powers',
      content: 'Create a special power of attorney for specific legal matters and court proceedings',
      icon: Scale,
      component: SpecialPowerOfAttorneyForm
    },
    {
      id: 'gift-affidavit',
      title: 'Gift Affidavit',
      description: 'Financial Support',
      content: 'Create a sworn affidavit declaring that a transfer of money or property is a gift with no expectation of repayment',
      icon: DollarSign,
      component: GiftAffidavitForm
    },
    {
      id: 'financial-support-affidavit',
      title: 'Affidavit of Financial Support',
      description: 'Financial Support',
      content: 'Create a sworn statement of your financial condition and ability to provide financial support',
      icon: DollarSign,
      component: FinancialSupportAffidavitForm
    }
  ];

  // Business Security documents  
  const businessSecurityDocs = [
    {
      id: 'business-agreement',
      title: 'Business Agreement',
      description: 'Business Partnership',
      content: 'Create a comprehensive business agreement between two parties for joint ventures and partnerships',
      icon: Briefcase,
      component: BusinessAgreementForm
    },
    {
      id: 'services-contract',
      title: 'Services Contract',
      description: 'Service Arrangements',
      content: 'Create a comprehensive services contract for professional service arrangements and staff augmentation',
      icon: Briefcase,
      component: ServicesContractForm
    },
    {
      id: 'independent-contractor',
      title: 'Independent Contractor Agreement',
      description: 'Employment & Contractor',
      content: 'Create a comprehensive independent contractor agreement defining work relationship',
      icon: Briefcase,
      component: IndependentContractorForm
    },
    {
      id: 'nda',
      title: 'Non-Disclosure Agreement',
      description: 'Confidentiality & Privacy',
      content: 'Create a legally binding confidentiality agreement to protect sensitive information',
      icon: Shield,
      component: NDAForm
    },
    {
      id: 'mutual-nda',
      title: 'Mutual Non-Disclosure Agreement',
      description: 'Bilateral Confidentiality',
      content: 'Create a bilateral confidentiality agreement where both parties protect each other\'s sensitive information',
      icon: Handshake,
      component: MutualNDAForm
    },
    {
      id: 'llc-operating-agreement',
      title: 'LLC Operating Agreement',
      description: 'Corporate Formation',
      content: 'Create a comprehensive Limited Liability Company Operating Agreement with member management and governance provisions',
      icon: Building2,
      component: LLCOperatingAgreementForm
    },
    {
      id: 'sale-agreement',
      title: 'Sale Agreement',
      description: 'Business & Commercial',
      content: 'Create a comprehensive sale agreement for business transactions',
      icon: Briefcase,
      component: SaleAgreementForm
    },
    {
      id: 'general-contract',
      title: 'General Contract for Products',
      description: 'Business & Commercial',
      content: 'Create a comprehensive contract for the sale and purchase of products',
      icon: ShoppingCart,
      component: GeneralContractForm
    },
    {
      id: 'share-purchase-agreement',
      title: 'Share Purchase Agreement',
      description: 'Corporate & Investment',
      content: 'Create a comprehensive share purchase agreement for transferring company shares',
      icon: Building2,
      component: SharePurchaseAgreementForm
    },
    {
      id: 'loan-agreement',
      title: 'Loan Agreement',
      description: 'Financial & Lending',
      content: 'Create a comprehensive loan agreement for personal or business lending arrangements',
      icon: DollarSign,
      component: LoanAgreementForm
    },
    {
      id: 'copyright-assignment',
      title: 'Copyright Assignment',
      description: 'Intellectual Property',
      content: 'Create a comprehensive copyright assignment agreement to transfer intellectual property rights',
      icon: FileText,
      component: CopyrightAssignmentForm
    },
    {
      id: 'copyright-license',
      title: 'Copyright License Agreement',
      description: 'Intellectual Property',
      content: 'Grant or obtain rights to use copyrighted material while maintaining ownership',
      icon: Shield,
      component: CopyrightLicenseForm
    },
    {
      id: 'domestic-service-agreement',
      title: 'Domestic Service Agreement',
      description: 'Employment & Labor',
      content: 'Create a domestic service agreement for household employment arrangements',
      icon: Home,
      component: DomesticServiceAgreementForm
    },
    {
      id: 'corporate-bylaws',
      title: 'Corporate Bylaws',
      description: 'Corporate Governance',
      content: 'Create comprehensive corporate bylaws to establish governance structure and operational procedures',
      icon: Scale,
      component: CorporateBylawsForm
    },
    {
      id: 'buy-sell-agreement',
      title: 'Buy-Sell Agreement',
      description: 'Business Agreements',
      content: 'Create a comprehensive buy-sell agreement to manage ownership transfers and protect business interests',
      icon: TrendingUp,
      component: BuySellAgreementForm
    },
    {
      id: 'business-plan',
      title: 'Business Plan',
      description: 'Business Development',
      content: 'Create a comprehensive business plan for launching and growing your venture',
      icon: Briefcase,
      component: BusinessPlanForm
    },
    {
      id: 'confidential-information',
      title: 'Confidential Information Agreement',
      description: 'Information Protection',
      content: 'Protect sensitive business information with legally binding confidentiality terms',
      icon: Shield,
      component: ConfidentialInformationForm
    },
    {
      id: 'non-circumvention',
      title: 'Non-Circumvention Agreement',
      description: 'Relationship Protection',
      content: 'Protect your business relationships and prevent contact circumvention',
      icon: Handshake,
      component: NonCircumventionForm
    },
    {
      id: 'copyright-permission',
      title: 'Copyright Permission Request',
      description: 'Copyright Compliance',
      content: 'Formally request permission to use copyrighted material in your projects',
      icon: FileText,
      component: CopyrightPermissionForm
    },
    {
      id: 'license-agreement',
      title: 'License Agreement',
      description: 'IP Licensing',
      content: 'Create a comprehensive license agreement for intellectual property rights and royalty management',
      icon: Scale,
      component: LicenseAgreementForm
    },
    {
      id: 'manufacturing-license',
      title: 'Manufacturing License Agreement',
      description: 'Manufacturing Rights',
      content: 'Create a manufacturing license agreement with quality control and legal protection',
      icon: Factory,
      component: ManufacturingLicenseForm
    },
    {
      id: 'music-license',
      title: 'Music License Agreement',
      description: 'Music Licensing',
      content: 'Create a music licensing agreement for copyright protection and royalty management',
      icon: FileText,
      component: MusicLicenseForm
    },
    {
      id: 'patent-assignment',
      title: 'Patent Assignment Agreement',
      description: 'Intellectual Property',
      content: 'Create a comprehensive patent assignment agreement to transfer patent rights and ownership',
      icon: Shield,
      component: PatentAssignmentForm
    },
    {
      id: 'royalty-agreement',
      title: 'Royalty Agreement',
      description: 'IP Licensing & Royalties',
      content: 'Create a royalty agreement for intellectual property licensing with payment terms and territorial rights',
      icon: TrendingUp,
      component: RoyaltyAgreementForm
    },
    {
      id: 'software-license',
      title: 'Software License Agreement',
      description: 'Software Licensing',
      content: 'Create a comprehensive software licensing agreement with usage rights, restrictions, and legal protections',
      icon: Shield,
      component: SoftwareLicenseForm
    },
    {
      id: 'merchandising-agreement',
      title: 'Merchandising Agreement',
      description: 'Merchandise Licensing',
      content: 'Create a merchandising licensing agreement for intellectual property use on products and merchandise',
      icon: ShoppingBag,
      component: MerchandisingAgreementForm
    }
  ];

  // Property Matters documents
  const propertyMattersDocs = [
    {
      id: 'lease-agreement',
      title: 'Residential Lease Agreement',
      description: 'Real Estate',
      content: 'Create a customized Lease Agreement for residential rental properties',
      icon: FileText,
      component: ConditionalForm
    },
    {
      id: 'condominium-lease',
      title: 'Condominium Lease Agreement',
      description: 'Real Estate & Condos',
      content: 'Create a comprehensive lease agreement specifically for condominium units',
      icon: Building2,
      component: CondominiumLeaseForm
    },
    {
      id: 'lease-renewal',
      title: 'Lease Renewal Agreement',
      description: 'Landlord & Tenant',
      content: 'Create a comprehensive lease renewal agreement to extend existing rental terms',
      icon: FileText,
      component: LeaseRenewalForm
    },
    {
      id: 'lease-termination',
      title: 'Agreement to Terminate Lease',
      description: 'Landlord & Tenant',
      content: 'Create a mutual agreement to terminate a lease before its expiration date',
      icon: FileText,
      component: LeaseTerminationForm
    },
    {
      id: 'rent-increase',
      title: 'Rent Increase Agreement',
      description: 'Landlord & Tenant',
      content: 'Create a formal agreement to increase rent between landlord and tenant',
      icon: DollarSign,
      component: RentIncreaseForm
    },
    {
      id: 'sublease',
      title: 'Sublease Agreement',
      description: 'Landlord & Tenant',
      content: 'Create a comprehensive sublease agreement with property inspection checklist',
      icon: Building2,
      component: SubleaseForm
    },
    {
      id: 'lease-amendment',
      title: 'Lease Amendment',
      description: 'Landlord & Tenant',
      content: 'Create a formal amendment to modify existing lease terms and conditions',
      icon: FileText,
      component: LeaseAmendmentForm
    },
    {
      id: 'commercial-lease',
      title: 'Commercial Lease Agreement',
      description: 'Business & Commercial',
      content: 'Create a comprehensive commercial lease agreement for business properties',
      icon: Building2,
      component: CommercialLeaseForm
    },
    {
      id: 'triple-net-lease',
      title: 'Triple Net Lease Agreement',
      description: 'Business & Commercial',
      content: 'Create a triple net lease where tenant pays all property expenses beyond base rent',
      icon: TrendingUp,
      component: TripleNetLeaseForm
    },
    {
      id: 'agreement-to-sell',
      title: 'Agreement to Sell',
      description: 'Real Estate & Property',
      content: 'Create a comprehensive agreement to sell for property transactions',
      icon: FileText,
      component: AgreementToSellForm
    },
    {
      id: 'eviction-notice',
      title: 'Eviction Notice',
      description: 'Landlord & Tenant',
      content: 'Create a formal notice to terminate a tenancy and initiate eviction proceedings',
      icon: FileText,
      component: EvictionNoticeForm
    },
    {
      id: 'affidavit-of-residence',
      title: 'Affidavit of Residence',
      description: 'Residency Verification',
      content: 'Create an affidavit to verify residence for living or deceased persons, establishing legal domicile and residence history',
      icon: MapPin,
      component: AffidavitOfResidenceForm
    },
    {
      id: 'transcript-request',
      title: 'Transcript Request',
      description: 'Educational Documents',
      content: 'Create a formal request for academic transcripts and degree documents from educational institutions',
      icon: GraduationCap,
      component: TranscriptRequestForm
    }
  ];

  // Combine all documents for direct access
  const allDocumentTypes = [...familyProtectionDocs, ...businessSecurityDocs, ...propertyMattersDocs];

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

  // Render specific document form
  if (selectedDocument && selectedDocumentType) {
    const DocumentComponent = selectedDocumentType.component;
    return (
      <div>
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackToDocuments}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Document Selection
          </Button>
          <h1 className="text-3xl font-bold mb-2">{selectedDocumentType.title}</h1>
          <p className="text-muted-foreground">
            {selectedDocumentType.content}
          </p>
        </div>
        <DocumentComponent />
      </div>
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
      <div>
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackToCategories}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          <h1 className="text-3xl font-bold mb-2">{categoryTitles[selectedCategory as keyof typeof categoryTitles]}</h1>
          <p className="text-muted-foreground">
            Choose a document type to begin generating your legal documents
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryDocuments.map((docType) => {
            const IconComponent = docType.icon;
            return (
              <Card key={docType.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    {docType.title}
                  </CardTitle>
                  <CardDescription>{docType.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  {docType.content}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSelectedDocument(docType.id)}
                  >
                    Select Template
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Render category selection (main page)
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Make Documents</h1>
        <p className="text-muted-foreground">
          Create legal documents from our professionally-drafted templates.
        </p>
      </div>
      <LegalConcernsSection onCategorySelect={handleCategorySelect} />
    </div>
  );
};

export default MakeDocument;
