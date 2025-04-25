
import { useEffect, useState, lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";

// Lazy loaded components for performance optimization
const Testimonials = lazy(() => import("@/components/home/Testimonials"));
const CTASection = lazy(() => import("@/components/home/CTASection"));
const Features = lazy(() => import("@/components/home/Features"));
const PracticeAreas = lazy(() => import("@/components/home/PracticeAreas"));
const StatsSection = lazy(() => import("@/components/home/StatsSection"));
const TrustBadges = lazy(() => import("@/components/home/TrustBadges"));
const LegalConcernsSection = lazy(() => import("@/components/home/LegalConcernsSection"));
const ServicesGallery = lazy(() => import("@/components/home/ServicesGallery"));
const LegalTeamSection = lazy(() => import("@/components/home/LegalTeamSection"));
const WhyChooseUsSection = lazy(() => import("@/components/home/WhyChooseUsSection"));
const GettingStartedSection = lazy(() => import("@/components/home/GettingStartedSection"));
const QASection = lazy(() => import("@/components/documents/QASection"));
const LegalSolutionsSection = lazy(() => import("@/components/home/LegalSolutionsSection"));
const DocumentsSection = lazy(() => import("@/components/home/DocumentsSection"));

// Loading placeholder for suspense
const SectionPlaceholder = () => (
  <div className="w-full h-72 flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-t-bright-orange-500 border-gray-200 rounded-full animate-spin"></div>
  </div>
);

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
        
        <Suspense fallback={<SectionPlaceholder />}>
          <TrustBadges />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder />}>
          <ServicesGallery />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder />}>
          <WhyChooseUsSection />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder />}>
          <LegalSolutionsSection />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder />}>
          <QASection />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder />}>
          <GettingStartedSection />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder />}>
          <Features />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder />}>
          <LegalTeamSection />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder />}>
          <StatsSection />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder />}>
          <PracticeAreas />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder />}>
          <LegalConcernsSection />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder />}>
          <DocumentsSection />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder />}>
          <Testimonials />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder />}>
          <CTASection />
        </Suspense>
      </div>
    </Layout>
  );
};

export default LandingPage;
