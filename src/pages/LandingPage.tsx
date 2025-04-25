
import { useEffect, useState, lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";

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
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    // Preload critical images
    const preloadImages = [
      "/lovable-uploads/f71dcb3e-44f6-47f2-a368-b65778dfe4da.png",
      "/lovable-uploads/a5f2d63e-9556-45d9-a3cc-f9c6a97852df.png",
      "/lovable-uploads/bbae67ec-7fdd-49d8-adfd-ca2a1c8a05a1.png",
      "/lovable-uploads/c9d521b5-31e5-47a0-9d04-c2539ddd886e.png"
    ];
    
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <div className={`w-full transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Hero />
        <Suspense {...loadingConfig}><TrustBadges /></Suspense>
        <Suspense {...loadingConfig}><ServicesGallery /></Suspense>
        <Suspense {...loadingConfig}><WhyChooseUsSection /></Suspense>
        <Suspense {...loadingConfig}><LegalSolutionsSection /></Suspense>
        <Suspense {...loadingConfig}><QASection /></Suspense>
        <Suspense {...loadingConfig}><GettingStartedSection /></Suspense>
        <Suspense {...loadingConfig}><Features /></Suspense>
        <Suspense {...loadingConfig}><LegalTeamSection /></Suspense>
        <Suspense {...loadingConfig}><StatsSection /></Suspense>
        <Suspense {...loadingConfig}><PracticeAreas /></Suspense>
        <Suspense {...loadingConfig}><LegalConcernsSection /></Suspense>
        <Suspense {...loadingConfig}><DocumentsSection /></Suspense>
        <Suspense {...loadingConfig}><Testimonials /></Suspense>
        <Suspense {...loadingConfig}><CTASection /></Suspense>
      </div>
    </Layout>
  );
};

export default LandingPage;
