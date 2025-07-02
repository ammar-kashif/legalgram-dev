import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, ShoppingCart, Briefcase, Heart, Building2, DollarSign, Home, Scale, UserCheck, MapPin, Gavel, GraduationCap, Shield } from "lucide-react";
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


const MakeDocument = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);    const documentTypes = [
    {
      id: 'lease-agreement',
      title: 'Residential Lease Agreement',
      description: 'Real Estate',
      content: 'Create a customized Lease Agreement for residential rental properties.',
      icon: FileText,
      component: ConditionalForm
    },
    {
      id: 'child-care-auth',
      title: 'Child Care Authorization Agreement',
      description: 'Family Law',
      content: 'Create an authorization agreement for child care arrangements.',
      icon: Users,
      component: ChildCareAuthForm
    },
    {
      id: 'general-contract',
      title: 'General Contract for Products',
      description: 'Business & Commercial',
      content: 'Create a comprehensive contract for the sale and purchase of products.',
      icon: ShoppingCart,
      component: GeneralContractForm
    },
    {
      id: 'independent-contractor',
      title: 'Independent Contractor Agreement',
      description: 'Employment & Contractor',
      content: 'Create a comprehensive independent contractor agreement defining work relationship.',
      icon: Briefcase,
      component: IndependentContractorForm
    },    {
      id: 'living-will',
      title: 'Living Will',
      description: 'Health Care & Estate Planning',
      content: 'Create a Living Will to specify your health care directives and agent appointments.',
      icon: Heart,
      component: LivingWillForm
    },    {
      id: 'share-purchase-agreement',
      title: 'Share Purchase Agreement',
      description: 'Corporate & Investment',
      content: 'Create a comprehensive share purchase agreement for transferring company shares.',
      icon: Building2,
      component: SharePurchaseAgreementForm
    },    {
      id: 'loan-agreement',
      title: 'Loan Agreement',
      description: 'Financial & Lending',
      content: 'Create a comprehensive loan agreement for personal or business lending arrangements.',
      icon: DollarSign,
      component: LoanAgreementForm
    },    {
      id: 'domestic-service-agreement',
      title: 'Domestic Service Agreement',
      description: 'Employment & Labor',
      content: 'Create a domestic service agreement for household employment arrangements.',
      icon: Home,
      component: DomesticServiceAgreementForm
    },    {
      id: 'agreement-to-sell',
      title: 'Agreement to Sell',
      description: 'Real Estate & Property',
      content: 'Create a comprehensive agreement to sell for property transactions.',
      icon: FileText,
      component: AgreementToSellForm
    },    {
      id: 'general-power-of-attorney',
      title: 'General Power of Attorney',
      description: 'Legal Authority & Powers',
      content: 'Create a comprehensive general power of attorney for legal representation.',
      icon: FileText,
      component: GeneralPowerOfAttorneyForm
    },    {
      id: 'special-power-of-attorney',
      title: 'Special Power of Attorney',
      description: 'Legal Authority & Powers',
      content: 'Create a special power of attorney for specific legal matters and court proceedings.',
      icon: Scale,
      component: SpecialPowerOfAttorneyForm
    },
    {
      id: 'sale-agreement',
      title: 'Sale Agreement',
      description: 'Business & Commercial',
      content: 'Create a comprehensive sale agreement for business transactions.',
      icon: Briefcase,
      component: SaleAgreementForm
    },
    {
      id: 'llc-operating-agreement',
      title: 'LLC Operating Agreement',
      description: 'Corporate Formation',
      content: 'Create a comprehensive Limited Liability Company Operating Agreement with member management, ownership structure, and governance provisions.',
      icon: Building2,
      component: LLCOperatingAgreementForm
    },
    {
      id: 'affidavit-of-marriage',
      title: 'Affidavit of Marriage',
      description: 'Family Law & Name Change',
      content: 'Create an affidavit to verify a name change due to marriage, establishing the connection between former and current names.',
      icon: UserCheck,
      component: AffidavitOfMarriageForm
    },
    {
      id: 'affidavit-of-residence',
      title: 'Affidavit of Residence',
      description: 'Residency Verification',
      content: 'Create an affidavit to verify residence for living or deceased persons, establishing legal domicile and residence history.',
      icon: MapPin,
      component: AffidavitOfResidenceForm
    },
    {
      id: 'divorce-settlement-agreement',
      title: 'Divorce Settlement Agreement',
      description: 'Family Law & Divorce',
      content: 'Create a comprehensive divorce settlement agreement covering asset division, debts, spousal support, and all terms for dissolution of marriage.',
      icon: Gavel,
      component: DivorceSettlementAgreementForm
    },
    {
      id: 'gift-affidavit',
      title: 'Gift Affidavit',
      description: 'Financial & Tax Documentation',
      content: 'Create a sworn affidavit declaring that a transfer of money or property is a gift with no expectation of repayment.',
      icon: DollarSign,
      component: GiftAffidavitForm
    },
    {
      id: 'financial-support-affidavit',
      title: 'Affidavit of Financial Support',
      description: 'Financial & Legal Documentation',
      content: 'Create a sworn statement of your financial condition and ability to provide financial support to another party.',
      icon: DollarSign,
      component: FinancialSupportAffidavitForm
    },
    {
      id: 'services-contract',
      title: 'Services Contract',
      description: 'Business & Professional Services',
      content: 'Create a comprehensive services contract for professional service arrangements, software development, and staff augmentation.',
      icon: Briefcase,
      component: ServicesContractForm
    },
    {
      id: 'business-agreement',
      title: 'Business Agreement',
      description: 'Business Partnerships & Joint Ventures',
      content: 'Create a comprehensive business agreement between two parties for joint ventures, partnerships, and collaborative business arrangements.',
      icon: Briefcase,
      component: BusinessAgreementForm
    },
    {
      id: 'eviction-notice',
      title: 'Eviction Notice',
      description: 'Real Estate & Property Management',
      content: 'Create a formal eviction notice for lease violations with legal compliance and tenant notification requirements.',
      icon: Home,
      component: EvictionNoticeForm
    },
    {
      id: 'transcript-request',
      title: 'Transcript Request',
      description: 'Education & Academic Records',
      content: 'Create a formal request for academic transcripts, degree certificates, and educational documents from institutions.',
      icon: GraduationCap,
      component: TranscriptRequestForm
    },
    {
      id: 'nda',
      title: 'Non-Disclosure Agreement',
      description: 'Business & Professional Services',
      content: 'Create a legally binding confidentiality agreement to protect sensitive information and trade secrets.',
      icon: Shield,
      component: NDAForm
    },
    {
      id: 'copyright-assignment',
      title: 'Copyright Assignment',
      description: 'Intellectual Property & Rights Transfer',
      content: 'Create a comprehensive copyright assignment agreement to transfer all intellectual property rights from assignor to assignee.',
      icon: FileText,
      component: CopyrightAssignmentForm
    },
    {
      id: 'copyright-license',
      title: 'Copyright License Agreement',
      description: 'Intellectual Property & Licensing',
      content: 'Grant or obtain rights to use copyrighted material while maintaining ownership with professional licensing agreements.',
      icon: Shield,
      component: CopyrightLicenseForm
    }
  ];
  
  const handleSelectTemplate = (documentId: string) => {
    setSelectedDocument(documentId);
  };
  
  const handleBack = () => {
    setSelectedDocument(null);
  };

  const selectedDocumentType = documentTypes.find(doc => doc.id === selectedDocument);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Make Documents</h1>
      <p className="text-muted-foreground mb-6">
        Create legal documents from our professionally-drafted templates.
      </p>
      
      {!selectedDocument ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documentTypes.map((docType) => {
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
                    onClick={() => handleSelectTemplate(docType.id)}
                  >
                    Select Template
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="mb-4"
            >
              ← Back to templates
            </Button>
            <h2 className="text-xl font-semibold">{selectedDocumentType?.title}</h2>
          </div>
          
          {selectedDocumentType && React.createElement(selectedDocumentType.component)}
        </div>
      )}
    </div>
  );
};

export default MakeDocument;
