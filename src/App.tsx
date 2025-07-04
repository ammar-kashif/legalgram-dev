import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useEffect } from "react";
import LandingPage from "./pages/LandingPage"; // Static import
import StartABusiness from "./pages/StartABusiness"; 
import Index from "./pages/Index"; // Import Index component
import Documents from "./pages/Documents"; // Import Documents directly
import UserDashboard from "./pages/UserDashboard"; // Import UserDashboard directly
import WhatsAnLLC from "./pages/WhatsAnLLC"; // Import WhatsAnLLC directly
import WhatsACorporation from "./pages/WhatsACorporation"; // Import WhatsACorporation directly
import WhatsAnSCorp from "./pages/WhatsAnSCorp"; // Import WhatsAnSCorp directly
import AffidavitOfMarriageInfo from "./pages/AffidavitOfMarriageInfo"; // Import AffidavitOfMarriageInfo directly
import AffidavitOfResidenceInfo from "./pages/AffidavitOfResidenceInfo"; // Import AffidavitOfResidenceInfo directly
import LLCOperatingAgreementInfo from "./pages/LLCOperatingAgreementInfo"; // Import LLCOperatingAgreementInfo directly
import SpecialPowerOfAttorneyInfo from "./pages/SpecialPowerOfAttorneyInfo"; // Import SpecialPowerOfAttorneyInfo directly
import GeneralPowerOfAttorneyInfo from "./pages/GeneralPowerOfAttorneyInfo"; // Import GeneralPowerOfAttorneyInfo directly
import LeaseAgreementInfo from "./pages/LeaseAgreementInfo"; // Import LeaseAgreementInfo directly
import LeaseRenewalInfo from "./pages/LeaseRenewalInfo"; // Import LeaseRenewalInfo directly
import LeaseTerminationInfo from "./pages/LeaseTerminationInfo"; // Import LeaseTerminationInfo directly
import CondominiumLeaseInfo from "./pages/CondominiumLeaseInfo"; // Import CondominiumLeaseInfo directly
import RentIncreaseInfo from "./pages/RentIncreaseInfo"; // Import RentIncreaseInfo directly
import SubleaseInfo from "./pages/SubleaseInfo"; // Import SubleaseInfo directly
import LeaseAmendmentInfo from "./pages/LeaseAmendmentInfo"; // Import LeaseAmendmentInfo directly
import CommercialLeaseInfo from "./pages/CommercialLeaseInfo"; // Import CommercialLeaseInfo directly
import TripleNetLeaseInfo from "./pages/TripleNetLeaseInfo"; // Import TripleNetLeaseInfo directly
import CorporateBylawsInfo from "./pages/CorporateBylawsInfo"; // Import CorporateBylawsInfo directly
import BuySellAgreementInfo from "./pages/BuySellAgreementInfo"; // Import BuySellAgreementInfo directly
import MutualNDAInfo from "./pages/MutualNDAInfo"; // Import MutualNDAInfo directly
import BusinessPlanInfo from "./pages/BusinessPlanInfo"; // Import BusinessPlanInfo directly
import ConfidentialInformationInfo from "./pages/ConfidentialInformationInfo"; // Import ConfidentialInformationInfo directly
import NonCircumventionInfo from "./pages/NonCircumventionInfo"; // Import NonCircumventionInfo directly
import CopyrightPermissionInfo from "./pages/CopyrightPermissionInfo"; // Import CopyrightPermissionInfo directly
import MerchandisingAgreementInfo from "./pages/MerchandisingAgreementInfo"; // Import MerchandisingAgreementInfo directly
import LicenseAgreementInfo from "./pages/LicenseAgreementInfo"; // Import LicenseAgreementInfo directly
import ManufacturingLicenseInfo from "./pages/ManufacturingLicenseInfo"; // Import ManufacturingLicenseInfo directly
import MusicLicenseInfo from "./pages/MusicLicenseInfo"; // Import MusicLicenseInfo directly
import ChildCareAuthorizationInfo from "./pages/ChildCareAuthorizationInfo"; // Import ChildCareAuthorizationInfo directly
import DivorceSettlementAgreementInfo from "./pages/DivorceSettlementAgreementInfo"; // Import DivorceSettlementAgreementInfo directly
import GeneralContractInfo from "./pages/GeneralContractInfo"; // Import GeneralContractInfo directly
import LivingWillInfo from "./pages/LivingWillInfo"; // Import LivingWillInfo directly
import SaleAgreementInfo from "./pages/SaleAgreementInfo"; // Import SaleAgreementInfo directly
import IndependentContractorInfo from "./pages/IndependentContractorInfo"; // Import IndependentContractorInfo directly
import LoanAgreementInfo from "./pages/LoanAgreementInfo"; // Import LoanAgreementInfo directly
import GiftAffidavitInfo from "./pages/GiftAffidavitInfo"; // Import GiftAffidavitInfo directly
import FinancialSupportAffidavitInfo from "./pages/FinancialSupportAffidavitInfo"; // Import FinancialSupportAffidavitInfo directly
import ServicesContractInfo from "./pages/ServicesContractInfo"; // Import ServicesContractInfo directly
import BusinessAgreementInfo from "./pages/BusinessAgreementInfo"; // Import BusinessAgreementInfo directly
import EvictionNoticeInfo from "./pages/EvictionNoticeInfo"; // Import EvictionNoticeInfo directly
import TranscriptRequestInfo from "./pages/TranscriptRequestInfo"; // Import TranscriptRequestInfo directly
import NDAInfo from "./pages/NDAInfo"; // Import NDAInfo directly
import CopyrightAssignmentInfo from "./pages/CopyrightAssignmentInfo"; // Import CopyrightAssignmentInfo directly
import AgreementToSellInfo from "./pages/AgreementToSellInfo"; // Import AgreementToSellInfo directly
import CopyrightLicenseInfo from "./pages/CopyrightLicenseInfo"; // Import CopyrightLicenseInfo directly
import PatentAssignmentInfo from "./pages/PatentAssignmentInfo"; // Import PatentAssignmentInfo directly
import RoyaltyAgreementInfo from "./pages/RoyaltyAgreementInfo"; // Import RoyaltyAgreementInfo directly
import SoftwareLicenseInfo from "./pages/SoftwareLicenseInfo"; // Import SoftwareLicenseInfo directly
import CopyrightRequestInfo from "./pages/CopyrightRequestInfo"; // Import CopyrightRequestInfo directly

// Lazy load other pages for better performance
const DocumentTemplates = lazy(() => import("./pages/DocumentTemplates"));
const ContactLawyer = lazy(() => import("./pages/ContactLawyer"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Signup = lazy(() => import("./pages/Signup"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SSOCallback = lazy(() => import("./pages/SSOCallback"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Contact = lazy(() => import("./pages/Contact"));
const AskLegalAdvice = lazy(() => import("./pages/AskLegalAdvice"));
const AskALawyer = lazy(() => import("./pages/AskALawyer"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Form components
const BusinessPlanForm = lazy(() => import("./components/BusinessPlanForm"));
const ConfidentialInformationForm = lazy(() => import("./components/ConfidentialInformationForm"));
const NonCircumventionForm = lazy(() => import("./components/NonCircumventionForm"));
const CopyrightPermissionForm = lazy(() => import("./components/CopyrightPermissionForm"));
const LicenseAgreementForm = lazy(() => import("./components/LicenseAgreementForm"));
const ManufacturingLicenseForm = lazy(() => import("./components/ManufacturingLicenseForm"));
const MusicLicenseForm = lazy(() => import("./components/MusicLicenseForm"));
const PatentAssignmentForm = lazy(() => import("./components/PatentAssignmentForm"));
const RoyaltyAgreementForm = lazy(() => import("./components/RoyaltyAgreementForm"));
const SoftwareLicenseForm = lazy(() => import("./components/SoftwareLicenseForm"));
const MerchandisingAgreementForm = lazy(() => import("./components/MerchandisingAgreementForm"));

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-rocket-blue-300 border-t-rocket-blue-600"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Component to handle scrolling to top when route changes
const ScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [location]);
  
  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<LandingPage />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/documents/:id" element={<Documents />} />
                <Route path="/contact-lawyer" element={<ContactLawyer />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/sso-callback" element={<SSOCallback />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/start-a-business" element={<StartABusiness />} />
                <Route path="/whats-an-llc" element={<WhatsAnLLC />} />
                <Route path="/whats-a-corporation" element={<WhatsACorporation />} />
                <Route path="/whats-an-s-corp" element={<WhatsAnSCorp />} />
                <Route path="/ask-legal-advice" element={<AskLegalAdvice />} />
                <Route path="/ask-lawyer" element={<AskALawyer />} />
                <Route path="/affidavit-of-marriage-info" element={<AffidavitOfMarriageInfo />} />
                <Route path="/affidavit-of-residence-info" element={<AffidavitOfResidenceInfo />} />
                <Route path="/llc-operating-agreement-info" element={<LLCOperatingAgreementInfo />} />
                <Route path="/special-power-of-attorney-info" element={<SpecialPowerOfAttorneyInfo />} />
                <Route path="/general-power-of-attorney-info" element={<GeneralPowerOfAttorneyInfo />} />
                <Route path="/child-care-authorization-info" element={<ChildCareAuthorizationInfo />} />
                <Route path="/divorce-settlement-agreement-info" element={<DivorceSettlementAgreementInfo />} />
                <Route path="/general-contract-info" element={<GeneralContractInfo />} />
                <Route path="/lease-agreement-info" element={<LeaseAgreementInfo />} />
                <Route path="/lease-renewal-info" element={<LeaseRenewalInfo />} />
                <Route path="/lease-termination-info" element={<LeaseTerminationInfo />} />
                <Route path="/condominium-lease-info" element={<CondominiumLeaseInfo />} />
                <Route path="/rent-increase-info" element={<RentIncreaseInfo />} />
                <Route path="/sublease-info" element={<SubleaseInfo />} />
                <Route path="/lease-amendment-info" element={<LeaseAmendmentInfo />} />
                <Route path="/commercial-lease-info" element={<CommercialLeaseInfo />} />
                <Route path="/triple-net-lease-info" element={<TripleNetLeaseInfo />} />
                <Route path="/corporate-bylaws-info" element={<CorporateBylawsInfo />} />
                <Route path="/corporate-bylaws-form" element={<Documents />} />
                <Route path="/buy-sell-agreement-info" element={<BuySellAgreementInfo />} />
                <Route path="/buy-sell-agreement-form" element={<Documents />} />
                <Route path="/mutual-nda-info" element={<MutualNDAInfo />} />
                <Route path="/mutual-nda-form" element={<Documents />} />
                <Route path="/business-plan-info" element={<BusinessPlanInfo />} />
                <Route path="/business-plan-form" element={<BusinessPlanForm />} />
                <Route path="/confidential-information-info" element={<ConfidentialInformationInfo />} />
                <Route path="/confidential-information-form" element={<ConfidentialInformationForm />} />
                <Route path="/non-circumvention-info" element={<NonCircumventionInfo />} />
                <Route path="/non-circumvention-form" element={<NonCircumventionForm />} />
                <Route path="/copyright-permission-info" element={<CopyrightPermissionInfo />} />
                <Route path="/copyright-permission-form" element={<CopyrightPermissionForm />} />
                <Route path="/license-agreement-info" element={<LicenseAgreementInfo />} />
                <Route path="/license-agreement-form" element={<LicenseAgreementForm />} />
                <Route path="/manufacturing-license-info" element={<ManufacturingLicenseInfo />} />
                <Route path="/manufacturing-license-form" element={<ManufacturingLicenseForm />} />
                <Route path="/music-license-info" element={<MusicLicenseInfo />} />
                <Route path="/music-license-form" element={<MusicLicenseForm />} />
                <Route path="/patent-assignment-info" element={<PatentAssignmentInfo />} />
                <Route path="/patent-assignment-form" element={<PatentAssignmentForm />} />
                <Route path="/royalty-agreement-info" element={<RoyaltyAgreementInfo />} />
                <Route path="/royalty-agreement-form" element={<RoyaltyAgreementForm />} />
                <Route path="/software-license-info" element={<SoftwareLicenseInfo />} />
                <Route path="/software-license-form" element={<SoftwareLicenseForm />} />
                <Route path="/merchandising-agreement-info" element={<MerchandisingAgreementInfo />} />
                <Route path="/merchandising-agreement-form" element={<MerchandisingAgreementForm />} />
                <Route path="/living-will-info" element={<LivingWillInfo />} />
                <Route path="/sale-agreement-info" element={<SaleAgreementInfo />} />
                <Route path="/independent-contractor-info" element={<IndependentContractorInfo />} />
                <Route path="/loan-agreement-info" element={<LoanAgreementInfo />} />
                <Route path="/gift-affidavit-info" element={<GiftAffidavitInfo />} />
                <Route path="/financial-support-affidavit-info" element={<FinancialSupportAffidavitInfo />} />
                <Route path="/services-contract-info" element={<ServicesContractInfo />} />
                <Route path="/business-agreement-info" element={<BusinessAgreementInfo />} />
                <Route path="/eviction-notice-info" element={<EvictionNoticeInfo />} />
                <Route path="/transcript-request-info" element={<TranscriptRequestInfo />} />
                <Route path="/nda-info" element={<NDAInfo />} />
                <Route path="/copyright-assignment-info" element={<CopyrightAssignmentInfo />} />
                <Route path="/agreement-to-sell-info" element={<AgreementToSellInfo />} />
                <Route path="/copyright-license-info" element={<CopyrightLicenseInfo />} />
                <Route path="/nda-form" element={<Documents />} />
                <Route path="/make-documents" element={<Documents />} />
                <Route path="/make-documents/:id" element={<Documents />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
