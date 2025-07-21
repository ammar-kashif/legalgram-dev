import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Scale, Building2, ArrowRight } from "lucide-react";
import LegalDisclaimer from "@/components/LegalDisclaimer";

interface LegalConcernsSectionProps {
  onCategorySelect: (category: string) => void;
}

const LegalConcernsSection: React.FC<LegalConcernsSectionProps> = ({ onCategorySelect }) => {
  
  const categories = [
    {
      id: 'family-protection',
      title: 'Family Protection',
      description: 'Secure your family\'s future with wills, trusts, and estate planning documents',
      icon: Shield,
      gradient: 'from-orange-400 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100'
    },
    {
      id: 'business-security',
      title: 'Business Security',
      description: 'Protect your business with contracts, agreements, and legal compliance documents',
      icon: Scale,
      gradient: 'from-purple-400 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    {
      id: 'property-matters',
      title: 'Property Matters',
      description: 'Handle real estate transactions and property disputes with proper legal documentation',
      icon: Building2,
      gradient: 'from-blue-400 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Common Legal Concerns We Address
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
        We provide comprehensive legal solutions for your most important concerns
        </p>
        
        {/* Professional Legal Services Disclaimer */}
        <div className="max-w-4xl mx-auto mb-8">
        <LegalDisclaimer />
        </div>
      </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id}
                className={`relative overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${category.bgGradient} border-0`}
                onClick={() => onCategorySelect(category.id)}
              >
                <CardHeader className="text-center pb-6 relative">
                  <div className={`mx-auto w-20 h-20 bg-gradient-to-r ${category.gradient} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-3">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-gray-700 text-base leading-relaxed">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="text-center pb-8">
                  <Button 
                    className={`bg-gradient-to-r ${category.gradient} hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-white border-0 px-8 py-3 text-lg font-semibold`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onCategorySelect(category.id);
                    }}
                  >
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
                
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <IconComponent className="w-full h-full transform rotate-12" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LegalConcernsSection;
