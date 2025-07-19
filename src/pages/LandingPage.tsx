import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import ConfidenceSlider from "@/components/home/ConfidenceSlider";

const loadingConfig = {
  fallback: (
    <div className="w-full h-72 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-t-bright-orange-500 border-gray-200 rounded-full animate-spin"></div>
    </div>
  )
};

// Lazy loaded components with descriptive chunk names
const TrustBadges = lazy(() => import("@/components/home/TrustBadges"));
const ServicesGallery = lazy(() => import("@/components/home/ServicesGallery"));
const WhyChooseUsSection = lazy(() => import("@/components/home/WhyChooseUsSection"));
const LegalSolutionsSection = lazy(() => import("@/components/home/LegalSolutionsSection"));
const DocumentsSection = lazy(() => import("@/components/home/DocumentsSection"));
const QASection = lazy(() => import("@/components/documents/QASection"));
const GettingStartedSection = lazy(() => import("@/components/home/GettingStartedSection"));
const Features = lazy(() => import("@/components/home/Features"));
const LegalTeamSection = lazy(() => import("@/components/home/LegalTeamSection"));
const StatsSection = lazy(() => import("@/components/home/StatsSection"));
const PracticeAreas = lazy(() => import("@/components/home/PracticeAreas"));
const LegalConcernsSection = lazy(() => import("@/components/home/LegalConcernsSection"));
const Testimonials = lazy(() => import("@/components/home/Testimonials"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if there's a hash in the URL (potential auth callback)
    if (window.location.hash || window.location.search.includes('code=')) {
      navigate("/sso-callback");
      return;
    }

    // Check authenticated status
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
        if (data.session) {
          navigate("/user-dashboard");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuth();

    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleProtectedNavigation = (path: string) => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate(path);
      } else {
        navigate("/login");
      }
    });
  };

  return (
    <Layout>
      <div className={`w-full transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <ConfidenceSlider />
        <Suspense {...loadingConfig}><TrustBadges /></Suspense>
        <Suspense {...loadingConfig}><ServicesGallery /></Suspense>
        <Suspense {...loadingConfig}><WhyChooseUsSection /></Suspense>
        <Suspense {...loadingConfig}><LegalSolutionsSection /></Suspense>
        <Suspense {...loadingConfig}><QASection /></Suspense>
        <Suspense {...loadingConfig}><GettingStartedSection /></Suspense>
        <Suspense {...loadingConfig}><Features /></Suspense>
        <Suspense {...loadingConfig}><StatsSection /></Suspense>
        <Suspense {...loadingConfig}><PracticeAreas /></Suspense>
        <Suspense {...loadingConfig}><DocumentsSection /></Suspense>
        <Suspense {...loadingConfig}><Testimonials /></Suspense>
        <Suspense {...loadingConfig}><CTASection /></Suspense>
        {/* Add Make Documents and Start a Business buttons with protected navigation */}
        <div className="flex justify-center gap-6 mt-8">
          <button
            className="bg-bright-orange-500 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-bright-orange-600 transition"
            onClick={() => handleProtectedNavigation('/dashboard/make-document')}
          >
            Make Documents
          </button>
          <button
            className="bg-bright-orange-500 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-bright-orange-600 transition"
            onClick={() => handleProtectedNavigation('/start-a-business')}
          >
            Start a Business
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default LandingPage;

