import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useEffect } from "react";
import LandingPage from "./pages/LandingPage"; // Change to static import
import StartABusiness from "./pages/StartABusiness"; // Import the StartABusiness component

// Lazy load other pages for better performance
const DocumentTemplates = lazy(() => import("./pages/DocumentTemplates"));
const DocumentDetail = lazy(() => import("./pages/DocumentDetail")); 
const ContactLawyer = lazy(() => import("./pages/ContactLawyer"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Signup = lazy(() => import("./pages/Signup"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SSOCallback = lazy(() => import("./pages/SSOCallback"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Contact = lazy(() => import("./pages/Contact"));

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
                <Route path="/" element={<LandingPage />} />
                <Route path="/documents" element={<DocumentTemplates />} />
                <Route path="/documents/:id" element={<DocumentDetail />} /> 
                <Route path="/contact-lawyer" element={<ContactLawyer />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/sso-callback" element={<SSOCallback />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/start-a-business" element={<StartABusiness />} />
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
