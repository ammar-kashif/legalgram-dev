
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Scale, ChevronRight, Award } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const HeroSection = ({ isAuthenticated }: HeroSectionProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/97408c62-dad7-4243-bb40-15c826e9ba0a.png" 
          alt="Legal document background" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/80"></div>
      </div>
      
      <div className={cn(
        "container-custom relative z-10",
        isMobile ? "py-6" : "py-8 md:py-28"
      )}>
        <div className="max-w-5xl mx-auto text-center px-4 md:px-0">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-[#F97316]/90 to-[#FFBB66]/90 px-3 py-1.5 rounded-full mb-4 text-white text-xs md:text-sm font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
            <Shield className={cn(
              "text-white",
              isMobile ? "h-3 w-3 mr-1.5" : "h-4 w-4 mr-2"
            )} />
            {isMobile ? "VERIFIED TEMPLATES" : "ATTORNEY-APPROVED TEMPLATES"}
          </div>
          
          <h1 className={cn(
            "font-bold mb-4 text-white leading-tight tracking-tight animate-fade-in",
            isMobile ? "text-2xl" : "text-2xl md:text-5xl lg:text-6xl"
          )}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-200">Professional</span> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] to-[#FFBB66] px-2">Legal</span> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-200">Documents</span>
          </h1>
          
          <div className={cn(
            "bg-gradient-to-r from-[#F97316] to-[#FFBB66] mx-auto rounded-full shadow-glow",
            isMobile ? "h-0.5 w-16 my-3" : "h-1.5 w-32 my-8"
          )}></div>
          
          <p className={cn(
            "leading-relaxed text-white/90 max-w-3xl mx-auto mb-6 animate-fade-in delay-100",
            isMobile 
              ? "text-sm px-2" 
              : "text-sm md:text-xl px-2 md:px-0"
          )}>
            Browse our comprehensive collection of attorney-drafted legal templates designed to protect 
            your interests. Customize, download, and use within minutes.
          </p>
          
          <div className={cn(
            "flex flex-col space-y-3 mb-6",
            isMobile ? "block" : "hidden"
          )}>
            <div className="flex items-center px-3 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white">
              <Award className="h-4 w-4 mr-2 text-[#F97316]" />
              <span className="text-sm font-medium text-white">Attorney-reviewed</span>
            </div>
            <div className="flex items-center px-3 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white">
              <CheckCircle className="h-4 w-4 mr-2 text-[#F97316]" />
              <span className="text-sm font-medium text-white">Easy customization</span>
            </div>
            <div className="flex items-center px-3 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white">
              <Scale className="h-4 w-4 mr-2 text-[#F97316]" />
              <span className="text-sm font-medium text-white">Legal compliance</span>
            </div>
          </div>
          
          {!isAuthenticated && (
            <div className={cn(
              "flex gap-3",
              isMobile 
                ? "flex-col px-4" 
                : "justify-center items-center"
            )}>
              <Link to="/login" className={cn(
                "w-full md:w-auto"
              )}>
                <Button 
                  className={cn(
                    "bg-[#F97316] hover:bg-[#D15316] text-white shadow-md border border-[#F97316] text-sm group",
                    isMobile 
                      ? "w-full py-3 rounded-xl" 
                      : "w-full md:w-auto px-4 py-2 h-10"
                  )}
                >
                  <span className="text-white">{isMobile ? "Get Started" : "Get Started Now"}</span>
                  <ChevronRight className="ml-1 h-4 w-4 text-white transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/signup" className={cn(
                "w-full md:w-auto"
              )}>
                <Button 
                  variant="outline" 
                  className={cn(
                    "border-white/70 text-white hover:bg-white/30 text-sm font-medium shadow-md transition-all duration-300",
                    isMobile 
                      ? "w-full py-3 rounded-xl" 
                      : "w-full md:w-auto px-4 py-2 h-10"
                  )}
                >
                  Sign up for Free
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default HeroSection;
