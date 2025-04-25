
import { memo, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  FileText,
  Fingerprint,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock,
  Award
} from "lucide-react";

const ProcessCard = memo(({ 
  icon: Icon, 
  title, 
  description, 
  step,
  delay 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  step: number;
  delay: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={cardRef}
      className={`relative bg-gradient-to-br from-white to-gray-50 dark:from-rocket-gray-800 dark:to-rocket-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-rocket-gray-700 p-8 md:p-10 transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      } hover:-translate-y-2 z-10`}
    >
      <div className="absolute top-0 right-0 w-20 h-20 flex items-center justify-center -mt-4 -mr-4">
        <div className="relative">
          <div className="absolute inset-0 bg-bright-orange-400 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-gradient-to-r from-bright-orange-500 to-bright-orange-600 text-white text-2xl font-bold rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
            {step}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className="bg-gradient-to-br from-[#FDE1D3] to-[#FFE6C6] rounded-2xl p-6 mb-6 w-20 h-20 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110">
          <Icon className="h-10 w-10 text-[#F18F01]" />
        </div>
        
        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-black">{title}</h3>
        
        <p className="text-white-600 dark:text-white-300 mb-6 text-lg">{description}</p>
        
        <div className="mt-auto">
          <Link to="/how-it-works" className="inline-flex items-center text-bright-orange-500 hover:text-bright-orange-600 font-medium group">
            Learn more <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
});

ProcessCard.displayName = 'ProcessCard';

const FeaturePoint = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
  <div className="flex items-center gap-3 mb-3 text-black">
    <div className="bg-bright-orange-100 p-1.5 rounded-full">
      <Icon className="h-4 w-4 text-bright-orange-600" />
    </div>
    <span>{text}</span>
  </div>
);

const ProcessSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  const processes = [
    {
      icon: FileText,
      title: "Select Your Document",
      description: "Browse our extensive library of legal documents and select the one that fits your needs.",
      step: 1
    },
    {
      icon: Fingerprint,
      title: "Personalize & Complete",
      description: "Fill in your information and answer simple questions to customize your document.",
      step: 2
    },
    {
      icon: CheckCircle,
      title: "Sign & Download",
      description: "Review your document, sign it electronically, and download the final version instantly.",
      step: 3
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-gradient-to-b from-white to-rocket-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-bright-orange-50 rounded-full opacity-60 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-blue-50 rounded-full opacity-60 blur-3xl"></div>
        <div className="absolute top-10 right-10 rotate-12 opacity-10">
          <FileText className="w-32 h-32 text-bright-orange-300" />
        </div>
        <div className="absolute bottom-10 left-10 -rotate-12 opacity-10">
          <CheckCircle className="w-32 h-32 text-bright-orange-300" />
        </div>
      </div>
      
      <div className="container-custom relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block bg-gradient-to-r from-bright-orange-100 to-amber-100 text-bright-orange-600 font-medium px-4 py-2 rounded-full text-sm mb-4">Our Simple Process</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-5 text-black">
            Create Legal Documents in Three Easy Steps
          </h2>
          <p className="text-lg md:text-xl text-black max-w-3xl mx-auto">
            Get legally binding documents in minutes, not hours. Our streamlined process makes legal paperwork simple and efficient.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-16 md:mb-24"
        >
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl border border-gray-100">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
              <Award className="h-40 w-40 text-bright-orange-500" stroke="1" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <Clock className="h-4 w-4 mr-1" /> Ready in minutes
                </div>
                <h3 className="text-2xl md:text-4xl font-bold mb-5 text-black">Lawyer-Backed Legal Documents</h3>
                <p className="text-lg text-black mb-6">
                  Our platform simplifies the creation of legal documents while maintaining professional quality and legal compliance.
                </p>
                <div className="grid md:grid-cols-2 gap-x-4 gap-y-2 mb-6">
                  <FeaturePoint icon={Shield} text="Attorney reviewed" />
                  <FeaturePoint icon={CheckCircle} text="Court approved forms" />
                  <FeaturePoint icon={Clock} text="Fast completion" />
                  <FeaturePoint icon={Award} text="High quality standards" />
                </div>
                <Link to="/how-it-works">
                  <Button variant="orange" size="lg" className="mt-2 shadow-lg hover:shadow-xl text-base">
                    See how it works
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block">
                <img 
                  src="/lovable-uploads/0a6fd4af-2285-4254-ab3a-2e271df099b6.png" 
                  alt="Legal document process illustration" 
                  className="w-full max-w-md mx-auto rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-bright-orange-300 via-bright-orange-500 to-amber-500 hidden lg:block -translate-y-1/2 z-0 opacity-50"></div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="grid md:grid-cols-3 gap-8 md:gap-12 relative z-10"
          >
            {processes.map((process, index) => (
              <motion.div key={index} variants={itemVariants}>
                <ProcessCard
                  icon={process.icon}
                  title={process.title}
                  description={process.description}
                  step={process.step}
                  delay={index * 200}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center mt-16 md:mt-24"
        >
          <Link to="/signup">
            <Button variant="orange" size="lg" className="px-10 py-7 h-auto text-lg shadow-lg hover:shadow-xl hover:transform hover:scale-105 transition-all bg-gradient-to-r from-bright-orange-500 to-bright-orange-600">
              Get started today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-black">No credit card required</p>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(ProcessSection);
