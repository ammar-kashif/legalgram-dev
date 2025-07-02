import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, ShoppingCart, Briefcase, Heart, ArrowLeft, Building2, DollarSign, Home, Scale, UserCheck, MapPin, Gavel, GraduationCap, Shield } from "lucide-react";

const Documents = () => {
  const { id } = useParams();
  const [selectedDocument, setSelectedDocument] = useState<string | null>(id || null);  const documentTypes = [
    {
      id: 'lease-agreement',
      title: 'Lease Agreement',
      description: 'Generate a comprehensive lease agreement for rental properties.',
      icon: FileText,
      component: ConditionalForm
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
    },
    {
      id: 'services-contract',
      title: 'Services Contract',
      description: 'Create a comprehensive services contract for professional service arrangements and staff augmentation',
      icon: Briefcase,
      component: ServicesContractForm
    },
    {
      id: 'business-agreement',
      title: 'Business Agreement',
      description: 'Create a comprehensive business agreement between two parties for joint ventures and partnerships',
      icon: Briefcase,
      component: BusinessAgreementForm
    },
    {
      id: 'child-care-auth',
      title: 'Child Care Authorization Agreement',
      description: 'Create an authorization agreement for child care arrangements',
      icon: Users,
      component: ChildCareAuthForm
    },
    {
      id: 'general-contract',
      title: 'General Contract for Products',
      description: 'Create a comprehensive contract for the sale and purchase of products',
      icon: ShoppingCart,
      component: GeneralContractForm
    },
    {
      id: 'independent-contractor',
      title: 'Independent Contractor Agreement',
      description: 'Create a comprehensive independent contractor agreement defining work relationship',
      icon: Briefcase,
      component: IndependentContractorForm
    },    {
      id: 'living-will',
      title: 'Living Will',
      description: 'Create a Living Will to specify your health care directives and agent appointments',
      icon: Heart,
      component: LivingWillForm
    },    {
      id: 'share-purchase-agreement',
      title: 'Share Purchase Agreement',
      description: 'Create a comprehensive share purchase agreement for transferring company shares',
      icon: Building2,
      component: SharePurchaseAgreementForm
    },    {
      id: 'loan-agreement',
      title: 'Loan Agreement',
      description: 'Create a comprehensive loan agreement for personal or business lending arrangements',
      icon: DollarSign,
      component: LoanAgreementForm
    },    {
      id: 'domestic-service-agreement',
      title: 'Domestic Service Agreement',
      description: 'Create a comprehensive domestic service agreement for household employment arrangements',
      icon: Home,
      component: DomesticServiceAgreementForm
    },    {
      id: 'agreement-to-sell',
      title: 'Agreement to Sell',
      description: 'Create a comprehensive agreement to sell for property transactions',
      icon: FileText,
      component: AgreementToSellForm
    },    {
      id: 'general-power-of-attorney',
      title: 'General Power of Attorney',
      description: 'Create a comprehensive general power of attorney for legal representation',
      icon: FileText,
      component: GeneralPowerOfAttorneyForm
    },    {
      id: 'special-power-of-attorney',
      title: 'Special Power of Attorney',
      description: 'Create a special power of attorney for specific legal matters and court proceedings',
      icon: Scale,
      component: SpecialPowerOfAttorneyForm
    },
    {
      id: 'sale-agreement',
      title: 'Sale Agreement',
      description: 'Create a comprehensive sale agreement for business transactions',
      icon: Briefcase,
      component: SaleAgreementForm
    },
    {
      id: 'llc-operating-agreement',
      title: 'LLC Operating Agreement',
      description: 'Create a comprehensive Limited Liability Company Operating Agreement with member management and governance provisions',
      icon: Building2,
      component: LLCOperatingAgreementForm
    },
    {
      id: 'affidavit-of-marriage',
      title: 'Affidavit of Marriage',
      description: 'Create an affidavit to verify a name change due to marriage, establishing the connection between former and current names',
      icon: UserCheck,
      component: AffidavitOfMarriageForm
    },
    {
      id: 'affidavit-of-residence',
      title: 'Affidavit of Residence',
      description: 'Create an affidavit to verify residence for living or deceased persons, establishing legal domicile and residence history',
      icon: MapPin,
      component: AffidavitOfResidenceForm
    },
    {
      id: 'divorce-settlement-agreement',
      title: 'Divorce Settlement Agreement',
      description: 'Create a comprehensive divorce settlement agreement covering asset division, debts, spousal support, and terms for dissolution of marriage',
      icon: Gavel,
      component: DivorceSettlementAgreementForm
    },
    {
      id: 'eviction-notice',
      title: 'Eviction Notice',
      description: 'Create a formal notice to terminate a tenancy and initiate eviction proceedings',
      icon: FileText,
      component: EvictionNoticeForm
    },
    {
      id: 'transcript-request',
      title: 'Transcript Request',
      description: 'Create a formal request for academic transcripts and degree documents from educational institutions',
      icon: GraduationCap,
      component: TranscriptRequestForm
    },
    {
      id: 'nda',
      title: 'Non-Disclosure Agreement',
      description: 'Create a legally binding confidentiality agreement to protect sensitive information',
      icon: Shield,
      component: NDAForm
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
    }
  ];

  const selectedDocumentType = documentTypes.find(doc => doc.id === selectedDocument);

  if (selectedDocument && selectedDocumentType) {
    const DocumentComponent = selectedDocumentType.component;
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 bg-white min-h-screen">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => setSelectedDocument(null)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Document Selection
            </Button>
            <h1 className="text-3xl font-bold mb-2">{selectedDocumentType.title}</h1>
            <p className="text-muted-foreground">
              {selectedDocumentType.description}
            </p>
          </div>
          <DocumentComponent />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 bg-white min-h-screen">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Legal Document Generator</h1>
          <p className="text-muted-foreground">
            Choose a document type to begin generating your legal documents
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {documentTypes.map((docType) => {
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
                  <CardDescription>{docType.description}</CardDescription>
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
};

export default Documents;
