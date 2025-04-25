
import { memo } from "react";
import { Shield, Award, CheckCircle, Clock, Star, Link } from "lucide-react";

const TrustBadges = () => {
  return (
    <section className="py-8 bg-white border-b border-rocket-gray-200">
      <div className="container-custom">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} fill="currentColor" className="h-4 w-4 text-yellow-500" />
            ))}
          </div>
          <p className="text-sm text-rocket-gray-600 mt-1">Rated 4.8/5 based on 10,000+ reviews</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="flex flex-col items-center gap-2 p-3 border border-rocket-gray-100 rounded-lg bg-rocket-gray-50">
            <Shield className="w-6 h-6 text-[#F18F01]" />
            <span className="text-xs md:text-sm font-medium text-black text-center">100% Secure & Confidential</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-3 border border-rocket-gray-100 rounded-lg bg-rocket-gray-50">
            <Award className="w-6 h-6 text-[#F18F01]" />
            <span className="text-xs md:text-sm font-medium text-black text-center">Attorney-Reviewed Documents</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-3 border border-rocket-gray-100 rounded-lg bg-rocket-gray-50">
            <CheckCircle className="w-6 h-6 text-[#F18F01]" />
            <span className="text-xs md:text-sm font-medium text-black text-center">Trusted by 20M+ Customers</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-3 border border-rocket-gray-100 rounded-lg bg-rocket-gray-50">
            <Clock className="w-6 h-6 text-[#F18F01]" />
            <span className="text-xs md:text-sm font-medium text-black text-center">15+ Years of Experience</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-3 border border-rocket-gray-100 rounded-lg bg-rocket-gray-50">
            <Link className="w-6 h-6 text-[#F18F01]" />
            <span className="text-xs md:text-sm font-medium text-black text-center">BBB Accredited Business</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-3 border border-rocket-gray-100 rounded-lg bg-rocket-gray-50">
            <Shield className="w-6 h-6 text-[#F18F01]" />
            <span className="text-xs md:text-sm font-medium text-black text-center">Money-Back Guarantee</span>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 mt-8">
          <img src="https://placehold.co/120x40/F0F0F0/333333?text=Norton+Secure" alt="Norton Secure" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
          <img src="https://placehold.co/120x40/F0F0F0/333333?text=McAfee+Secure" alt="McAfee Secure" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
          <img src="https://placehold.co/120x40/F0F0F0/333333?text=TrustE" alt="TrustE Certified" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
          <img src="https://placehold.co/120x40/F0F0F0/333333?text=SSL+Secured" alt="SSL Secured" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </section>
  );
};

export default memo(TrustBadges);
