
import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, UserCheck, FileText, FileCheck } from "lucide-react";

const GettingStartedSection = () => {
  const [inView, setInView] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    const section = document.getElementById("getting-started");
    if (section) observer.observe(section);
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView) {
      let currentStep = 0;
      const interval = setInterval(() => {
        setActiveStep(currentStep);
        currentStep = (currentStep + 1) % 3;
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [inView]);

  const steps = [
    {
      icon: UserCheck,
      title: "Create Your Account",
      description: "Sign up in less than 2 minutes with your email or social accounts",
      linkText: "Sign up now",
      linkTo: "/signup"
    },
    {
      icon: FileText,
      title: "Select Your Document",
      description: "Browse our library of professional legal documents and templates",
      linkText: "Browse documents",
      linkTo: "/documents"
    },
    {
      icon: FileCheck,
      title: "Complete & Download",
      description: "Answer a few questions and your document is ready to use",
      linkText: "See how it works",
      linkTo: "/how-it-works"
    }
  ];

  return (
    <section id="getting-started" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="hidden lg:block absolute top-1/2 left-0 w-[80%] h-0.5 bg-gradient-to-r from-bright-orange-300/0 via-bright-orange-300 to-bright-orange-300/0 transform -translate-y-1/2 z-0"></div>
      <div className="absolute top-40 right-0 w-64 h-64 bg-bright-orange-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
      
      <div className="container-custom">
        <div className="text-center mb-16 relative z-10">
          <motion.span 
            className="inline-block bg-bright-orange-100 text-bright-orange-600 font-medium px-4 py-1 rounded-full text-sm mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Getting Started Is Easy
          </motion.span>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-4 text-black"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-black to-black bg-clip-text text-transparent text-4xl">
              Three Simple Steps
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-black max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Creating your legal documents has never been easier
          </motion.p>
        </div>
        
        <div className="relative z-10">
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`bg-white rounded-xl p-8 shadow-lg border transition-all duration-500 ${
                  activeStep === index 
                    ? 'border-bright-orange-300 shadow-xl transform -translate-y-2' 
                    : 'border-gray-100'
                }`}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
              >
                <div className="mb-6 relative">
                  <div className={`w-20 h-20 rounded-full transition-all duration-300 flex items-center justify-center mx-auto shadow-lg ${
                    activeStep === index 
                      ? 'bg-gradient-to-br from-bright-orange-500 to-bright-orange-600' 
                      : 'bg-gradient-to-br from-rocket-blue-500 to-rocket-blue-600'
                  }`}>
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-4 -right-4 bg-rocket-blue-600 text-white h-8 w-8 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-black">{step.title}</h3>
                <p className="text-black mb-6">{step.description}</p>
                <Link 
                  to={step.linkTo} 
                  className="inline-flex items-center text-black hover:text-black/70 font-medium group"
                >
                  <span>{step.linkText}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
                
                {activeStep === index && (
                  <motion.div 
                    className="h-1 bg-gradient-to-r from-bright-orange-500 to-bright-orange-300 mt-6 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 -m-6 bg-gradient-to-r from-bright-orange-300/20 to-rocket-blue-300/20 rounded-xl blur-xl"></div>
          <div className="relative overflow-hidden rounded-xl shadow-xl bg-white/80 backdrop-blur-sm">
            <div className="md:flex items-center">
              <div className="md:w-1/2 p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-black">
                  Ready to simplify your legal work?
                </h3>
                <p className="text-black/70 mb-8 text-lg">
                  Our platform guides you through each step to create professional, legally-binding documents tailored to your needs.
                </p>
                <Link 
                  to="/documents" 
                  className="inline-flex items-center justify-center bg-gradient-to-r from-bright-orange-500 to-bright-orange-600 hover:from-bright-orange-600 hover:to-bright-orange-700 text-white px-8 py-4 rounded-lg font-medium transition-all shadow-md hover:shadow-xl group"
                >
                  <span>Get started with your document</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="md:w-1/2 h-full">
                <img 
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000&auto=format&fit=crop" 
                  alt="Professional signing documents" 
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(GettingStartedSection);
