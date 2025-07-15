
import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Clock, 
  BadgeCheck, 
  Scale, 
  Users,
  Award,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WhyChooseUsSection = () => {
  const [inView, setInView] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
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
    
    const section = document.getElementById("why-choose-us");
    if (section) observer.observe(section);
    
    return () => observer.disconnect();
  }, []);

  const reasons = [
    {
      icon: Shield,
      title: "Secure & Confidential",
      description: "Your legal information is protected with enterprise-grade security and encryption.",
      gradient: "from-blue-500/20 via-blue-400/10 to-transparent"
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Create legal documents in minutes instead of hours with our streamlined process.",
      gradient: "from-emerald-500/20 via-emerald-400/10 to-transparent"
    },
    {
      icon: BadgeCheck,
      title: "Attorney-Reviewed",
      description: "All documents and services are created and reviewed by qualified attorneys.",
      gradient: "from-purple-500/20 via-purple-400/10 to-transparent"
    },
    {
      icon: Scale,
      title: "Legal Compliance",
      description: "Our documents are continuously updated to comply with current laws and regulations.",
      gradient: "from-pink-500/20 via-pink-400/10 to-transparent"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Get help from our team of legal professionals whenever you need it.",
      gradient: "from-amber-500/20 via-amber-400/10 to-transparent"
    },
    {
      icon: Award,
      title: "Trusted by Millions",
      description: "Join the millions of individuals and businesses who trust us with their legal needs.",
      gradient: "from-cyan-500/20 via-cyan-400/10 to-transparent"
    }
  ];

  return (
    <section id="why-choose-us" className="py-24 md:py-32 bg-gradient-to-b from-white to-[#F8F9FF] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-bright-orange-100/50 to-rocket-blue 100/30 rounded-full opacity-30 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-40 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/50 to-bright-orange-100/30 rounded-full opacity-30 blur-3xl -translate-x-1/2"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-20">
          <motion.span 
            className="inline-block bg-gradient-to-r from-bright-orange-100 to-bright-orange-200 text-bright-orange-600 font-medium px-6 py-2 rounded-full text-sm mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Why Choose Legal Gram
          </motion.span>
          
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
        
            The Smart Choice
            for Legal Solutions
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl bg-gradient-to-r from-bright-orange-500 to-bright-orange-100 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Ready to simplify your legal work?
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative overflow-hidden bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                <div className={`absolute inset-0 bg-gradient-to-br ${reason.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bright-orange-500 to-bright-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <reason.icon className="h-8 w-8 text-orange" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-black group-hover:text-bright-orange-600 transition-colors">
                    {reason.title}
                  </h3>
                  
                  <p className="text-black text-opacity-80 group-hover:text-opacity-100 transition-colors">
                    {reason.description}
                  </p>
                </div>
                
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-bright-orange-500 to-bright-orange-300 transition-all duration-300 ${hoveredIndex === index ? 'w-full' : 'w-0'}`}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-20 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="bg-gradient-to-r from-rocket-blue-600 to-rocket-blue-800 rounded-2xl p-10 md:p-14 shadow-2xl relative overflow-hidden drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-bright-orange-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rocket-blue-300/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-white/5 rotate-45 blur-2xl"></div>
            
            <div className="relative z-10 text-center md:text-left md:flex items-center justify-between">
              <div className="mb-8 md:mb-0 md:max-w-lg">
                <h3 className="text-3xl md:text-4xl font-bold text-black mb-4">
                  Ready for professional legal help?
                </h3>
                <p className="text-black text-lg">
                  Get started today with our easy-to-use legal services.
                </p>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-bright-orange-500 to-bright-orange-300 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <Link to="/signup">
                  <Button 
                    variant="default" 
                    className="relative px-8 py-6 bg-white text-rocket-blue-600 rounded-xl font-medium hover:bg-bright-orange-50 transition-all duration-300 text-lg shadow-xl group-hover:shadow-2xl"
                  >
                    Create an Account
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(WhyChooseUsSection);
