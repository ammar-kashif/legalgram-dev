import { useEffect, useState, lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HeroBackgroundSlideshow from "@/components/home/HeroBackgroundSlideshow";

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
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log("Landing page loaded, mobile:", isMobile);
  }, [isMobile]);

  return (
    <Layout>
      <div className={cn(
        "w-full transition-all duration-700",
        isLoaded ? 'opacity-100' : 'opacity-0',
        isMobile ? 'min-h-[calc(var(--vh,1vh)*100)]' : 'min-h-screen'
      )}>
        {/* Hero Section */}
        <section className={cn(
          "relative flex items-center justify-center overflow-hidden",
          isMobile ? "min-h-[calc(var(--vh,1vh)*100-4rem)] py-16" : "min-h-screen"
        )}>
          <HeroBackgroundSlideshow />
          
          <div className={cn(
            "container-custom relative z-10 text-center px-4",
            isMobile ? "py-8" : "py-20"
          )}>
            <div className="max-w-3xl mx-auto">
              <h1 className={cn(
                "font-bold mb-4 text-white leading-tight",
                isMobile ? "text-2xl md:text-3xl" : "text-4xl md:text-5xl"
              )}>
                Professional Legal Support When You Need It Most
              </h1>
              <p className={cn(
                "text-white mb-8",
                isMobile ? "text-sm md:text-base" : "text-lg md:text-xl"
              )}>
                Get expert legal advice and document services from our network of qualified attorneys.
              </p>
              <Button 
                size={isMobile ? "default" : "lg"}
                className={cn(
                  "bg-bright-orange-500 hover:bg-bright-orange-600 text-white shadow-lg",
                  isMobile ? "text-sm px-4 py-2" : "px-6 py-3"
                )}
                asChild
              >
                <Link to="/signup">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </section>

        <Suspense {...loadingConfig}><TrustBadges /></Suspense>
        <Suspense {...loadingConfig}><ServicesGallery /></Suspense>
        <Suspense {...loadingConfig}><WhyChooseUsSection /></Suspense>
        <Suspense {...loadingConfig}><LegalSolutionsSection /></Suspense>
        <Suspense {...loadingConfig}><DocumentsSection /></Suspense>
        <Suspense {...loadingConfig}><QASection /></Suspense>
        <Suspense {...loadingConfig}><GettingStartedSection /></Suspense>
        <Suspense {...loadingConfig}><Features /></Suspense>
        <Suspense {...loadingConfig}><LegalTeamSection /></Suspense>
        <Suspense {...loadingConfig}><StatsSection /></Suspense>
        <Suspense {...loadingConfig}><PracticeAreas /></Suspense>
        <Suspense {...loadingConfig}><LegalConcernsSection /></Suspense>
        <Suspense {...loadingConfig}><Testimonials /></Suspense>
        <Suspense {...loadingConfig}><CTASection /></Suspense>
      </div>
    </Layout>
  );
};

export default LandingPage;
