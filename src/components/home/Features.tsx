
import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  MessageCircle, 
  Scale, 
  ArrowRight, 
  BookOpen, 
  Users, 
  Building, 
  Shield,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";

const FeatureCard = memo(({ 
  icon: Icon, 
  title, 
  description, 
  linkText, 
  linkTo, 
  delay,
  gradient
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  linkText: string;
  linkTo: string;
  delay: number;
  gradient: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300 + (delay * 100));
    
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${delay * 150}ms` }}
    >
      <Card className="h-full overflow-hidden group border border-gray-200 hover:border-bright-orange-300 shadow-sm hover:shadow-xl transition-all duration-500 relative">
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${gradient}`}></div>
        <CardContent className="p-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${gradient} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
            <Icon className="h-8 w-8" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-3 text-black group-hover:text-bright-orange-600 transition-colors duration-300">{title}</h3>
          <p className="text-white-600 mb-4 group-hover:text-orange-800 transition-colors duration-300">{description}</p>
        </CardContent>
        <CardFooter className="px-8 pb-8 pt-0">
          <Link 
            to={linkTo} 
            className="inline-flex items-center font-medium text-bright-orange-500 hover:text-bright-orange-600 group/link"
          >
            <span>{linkText}</span>
            <ArrowRight className="ml-2 h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
});

FeatureCard.displayName = 'FeatureCard';

const Features = () => {
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);
  const [visibleSection, setVisibleSection] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setVisibleSection(true);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    
    setObserver(obs);
    
    return () => {
      if (obs) obs.disconnect();
    };
  }, []);

  useEffect(() => {
    if (observer) {
      const sectionElement = document.getElementById('features-section');
      if (sectionElement) observer.observe(sectionElement);
    }
  }, [observer]);

  const features = [
    {
      icon: FileText,
      title: "Legal Documents",
      description: "Create customized legal documents in minutes with our easy-to-use templates.",
      linkText: "Browse documents",
      linkTo: "/documents",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: MessageCircle,
      title: "Ask a Lawyer",
      description: "Connect with experienced attorneys for personalized legal advice when you need it.",
      linkText: "Get legal advice",
      linkTo: "/ask-a-lawyer",
      gradient: "from-amber-500 to-amber-600"
    },
    {
      icon: Building,
      title: "Business Formation",
      description: "Start your business the right way with our LLC and incorporation services.",
      linkText: "Start a business",
      linkTo: "/business-formation",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: Scale,
      title: "Attorney Services",
      description: "Work with dedicated attorneys for more complex legal matters at affordable rates.",
      linkText: "Find an attorney",
      linkTo: "/attorney-services",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: BookOpen,
      title: "Legal Resources",
      description: "Access free articles and guides covering a wide range of legal topics.",
      linkText: "Explore resources",
      linkTo: "/legal-resources",
      gradient: "from-rose-500 to-rose-600"
    },
    {
      icon: Users,
      title: "Legal Plans",
      description: "Get ongoing legal protection for your family or business with our subscription plans.",
      linkText: "View plans",
      linkTo: "/legal-plans",
      gradient: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <section id="features-section" className="py-24 md:py-32 relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-bright-orange-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <div className={`transform transition-all duration-700 ${visibleSection ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="inline-block bg-gradient-to-r from-bright-orange-500 to-bright-orange-600 text-white font-medium px-4 py-2 rounded-full text-sm mb-4">Our Services</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black">
              Complete Legal Solutions
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your legal matters confidently and affordably.
            </p>
          </div>
        </div>

        {/* Feature highlight */}
        <div className={`mb-16 transform transition-all duration-700 ${visibleSection ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-bright-orange-50 to-amber-50 rounded-3xl p-6 md:p-10 relative overflow-hidden border border-bright-orange-100">
            <div className="absolute top-0 right-0 -mt-10 -mr-10">
              <Sparkles className="h-32 w-32 text-bright-orange-200 opacity-50" />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-bright-orange-500 to-bright-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-black">Protected by Legal Experts</h3>
                <p className="text-lg text-gray-600 mb-4">
                  All our documents and services are reviewed by qualified attorneys to ensure legal compliance and protection.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700">Attorney reviewed</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700">State-specific</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700">Regularly updated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              linkText={feature.linkText}
              linkTo={feature.linkTo}
              delay={index}
              gradient={feature.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(Features);
