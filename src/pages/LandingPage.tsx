import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, CheckCircle, Fingerprint } from "lucide-react";
import Hero from "@/components/home/Hero";

// Lazy loaded components for performance optimization
const Testimonials = lazy(() => import("@/components/home/Testimonials"));
const CTASection = lazy(() => import("@/components/home/CTASection"));
const Features = lazy(() => import("@/components/home/Features"));
const PracticeAreas = lazy(() => import("@/components/home/PracticeAreas"));
const StatsSection = lazy(() => import("@/components/home/StatsSection"));
const ProcessSection = lazy(() => import("@/components/home/ProcessSection"));
const TrustBadges = lazy(() => import("@/components/home/TrustBadges"));
const LegalConcernsSection = lazy(() => import("@/components/home/LegalConcernsSection"));
const ServicesGallery = lazy(() => import("@/components/home/ServicesGallery"));
const LegalTeamSection = lazy(() => import("@/components/home/LegalTeamSection"));
const WhyChooseUsSection = lazy(() => import("@/components/home/WhyChooseUsSection"));
const GettingStartedSection = lazy(() => import("@/components/home/GettingStartedSection"));

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

  // Popular documents data
  const popularDocuments = useMemo(() => [
    { link: "/documents/1", text: "Last Will and Testament" },
    { link: "/documents/4", text: "Power of Attorney" },
    { link: "/documents/2", text: "Non-Disclosure Agreement" },
    { link: "/documents/3", text: "LLC Operating Agreement" },
    { link: "/documents/5", text: "Residential Lease" },
    { link: "/documents/6", text: "Employment Contract" }
  ], []);

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

        <section className="py-20 md:py-28 relative overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/lovable-uploads/c9d521b5-31e5-47a0-9d04-c2539ddd886e.png" 
              alt="Document signing background" 
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-white/90"></div>
          </div>
          
          <div className="container-custom relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block bg-bright-orange-100 text-bright-orange-600 font-medium px-4 py-1 rounded-full text-sm mb-3">How It Works</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-black">
                Simple, Affordable Legal Solutions
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We make legal matters easy to understand and manage through our streamlined process.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg border border-gray-100 transform transition-transform hover:-translate-y-2 duration-300">
                <div className="bg-rocket-blue-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <FileText className="h-10 w-10 text-[#F18F01]" />
                  <span className="absolute -top-2 -right-2 bg-[#F18F01] text-white h-8 w-8 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                    1
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">Select Your Document</h3>
                <p className="text-gray-600">
                  Choose from hundreds of legal documents designed for personal and business needs.
                </p>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg border border-gray-100 transform transition-transform hover:-translate-y-2 duration-300">
                <div className="bg-rocket-blue-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <CheckCircle className="h-10 w-10 text-[#F18F01]" />
                  <span className="absolute -top-2 -right-2 bg-[#F18F01] text-white h-8 w-8 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                    2
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">Customize It</h3>
                <p className="text-gray-600">
                  Answer simple questions to create your personalized legal document.
                </p>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg border border-gray-100 transform transition-transform hover:-translate-y-2 duration-300">
                <div className="bg-rocket-blue-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <Fingerprint className="h-10 w-10 text-[#F18F01]" />
                  <span className="absolute -top-2 -right-2 bg-[#F18F01] text-white h-8 w-8 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                    3
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">Sign & Share</h3>
                <p className="text-gray-600">
                  Save, print, download, or share your legal document instantly.
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/how-it-works">
                <Button variant="orange" className="hover:bg-[#D17701] shadow-md px-8 py-6 h-auto text-lg">
                  Learn more about our process <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
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
          <ProcessSection />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder />}>
          <Testimonials />
        </Suspense>
        
        <section className="py-20 md:py-28 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <span className="inline-block bg-bright-orange-100 text-bright-orange-600 font-medium px-4 py-1 rounded-full text-sm mb-3">Popular Documents</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-black">
                Most Frequently Used Legal Documents
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Create any of these documents in minutes with our easy-to-use platform.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
              {popularDocuments.map(({ link, text }) => (
                <Link 
                  to={link} 
                  key={link} 
                  className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:border-bright-orange-300 hover:shadow-xl transition-all group"
                >
                  <div className="bg-bright-orange-100 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center group-hover:bg-bright-orange-200 transition-colors">
                    <FileText className="h-8 w-8 text-[#F18F01]" />
                  </div>
                  <span className="font-medium text-black">{text}</span>
                </Link>
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/documents">
                <Button variant="orange" className="hover:bg-[#D17701] shadow-md px-8 py-6 h-auto text-lg">
                  View all documents <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <Suspense fallback={<SectionPlaceholder />}>
          <CTASection />
        </Suspense>
      </div>
    </Layout>
  );
};

export default LandingPage;
