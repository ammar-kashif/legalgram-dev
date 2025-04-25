import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, Star } from "lucide-react";
import { memo } from "react";

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 bg-[#FDE1D3]">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Join millions who trust Legal Gram
            </h2>
            <p className="text-lg text-black mb-6">
              Get access to all our legal documents, attorney advice, and more with a monthly membership.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-2">
                <Star className="h-5 w-5 text-[#F18F01] mt-1 flex-shrink-0" fill="#F18F01" />
                <div>
                  <span className="font-medium text-black">Trusted by millions</span>
                  <p className="text-black">Over 20 million people have used our services</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Star className="h-5 w-5 text-[#F18F01] mt-1 flex-shrink-0" fill="#F18F01" />
                <div>
                  <span className="font-medium text-black">Affordable legal help</span>
                  <p className="text-black">Access legal services at a fraction of traditional costs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Star className="h-5 w-5 text-[#F18F01] mt-1 flex-shrink-0" fill="#F18F01" />
                <div>
                  <span className="font-medium text-black">Cancel anytime</span>
                  <p className="text-black">No long-term commitments or hidden fees</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button variant="orange" size="lg" className="px-8 py-6 h-auto text-base">
                  Sign up now
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-[#F18F01] text-[#F18F01] hover:bg-[#F18F01]/10 px-8 py-6 h-auto text-base">
                  See pricing
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-[#020122] rounded-xl p-8 shadow-lg border border-[#F18F01]/20">
            <h3 className="text-2xl font-semibold mb-6 text-white">
              What our customers say
            </h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-[#F18F01] pl-4">
                <p className="text-white italic mb-4">
                  "Legal Gram made creating my LLC so easy. The step-by-step process and customer service were excellent!"
                </p>
                <p className="font-medium text-white">— Michael T., Small Business Owner</p>
              </div>
              
              <div className="border-l-4 border-[#F18F01] pl-4">
                <p className="text-white italic mb-4">
                  "I was able to create my will quickly and easily. The guidance provided made the process stress-free."
                </p>
                <p className="font-medium text-white">— Sarah L., Family Protection</p>
              </div>
              
              <div className="flex items-center justify-between mt-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} fill="#F18F01" className="h-5 w-5 text-[#F18F01]" />
                  ))}
                </div>
                <Link to="/testimonials" className="text-[#F18F01] hover:text-[#D17701] inline-flex items-center group">
                  <span>Read more</span>
                  <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-[#F18F01]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold text-[#F18F01]">4.8/5</div>
                  <div className="text-sm text-white/80">Overall rating</div>
                </div>
                <a
                  href="#"
                  className="text-white/80 hover:text-white inline-flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-sm">Verified reviews</span>
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(CTASection);
