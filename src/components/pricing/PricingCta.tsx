
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const PricingCta = () => {
  return (
    <div className="bg-bright-orange-500">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Not sure which plan is right for you?
            </h2>
            <p className="text-white/90 max-w-xl text-lg">
              Our legal experts can help you choose the perfect plan for your specific legal needs. Schedule a free consultation today.
            </p>
          </div>
          
          <Link to="/signup">
            <Button size="lg" className="bg-white text-bright-orange-600 hover:bg-bright-orange-50 shadow-lg min-w-[200px]">
              Get Free Consultation
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PricingCta;
