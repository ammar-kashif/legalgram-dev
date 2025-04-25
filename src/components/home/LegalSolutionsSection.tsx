import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, Fingerprint, ArrowRight } from "lucide-react";

const LegalSolutionsSection = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
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
  );
};

export default LegalSolutionsSection;
