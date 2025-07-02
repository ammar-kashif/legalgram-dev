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
import ChildCareAuthorizationInfo from "./pages/ChildCareAuthorizationInfo"; // Import ChildCareAuthorizationInfo directly
import DivorceSettlementAgreementInfo from "./pages/DivorceSettlementAgreementInfo"; // Import DivorceSettlementAgreementInfo directly

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
                <Route path="/lease-agreement-info" element={<LeaseAgreementInfo />} />
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
