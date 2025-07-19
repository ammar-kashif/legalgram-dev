
import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const servicesData = [
  {
    title: "Document Creation",
    description: "Professionally drafted legal documents for all your needs",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1600&auto=format&fit=crop",
    link: "/documents"
  },
  {
    title: "Legal Consultation",
    description: "Get expert advice from experienced attorneys",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600&auto=format&fit=crop",
    link: "/ask-a-lawyer"
  },
  {
    title: "Business Formation",
    description: "Start your business with the right legal structure",
    image: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=1600&auto=format&fit=crop",
    link: "/business-formation"
  }
];

const ServicesGallery = () => {
  const [inView, setInView] = useState(false);
  
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
    
    const section = document.getElementById("services-gallery");
    if (section) observer.observe(section);
    
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services-gallery" className="py-20 md:py-28 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="inline-block bg-bright-orange-100 text-bright-orange-600 font-medium px-4 py-1 rounded-full text-sm mb-3">
            Our Legal Services
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-black">
            Expert Legal Solutions for You
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive range of legal services designed to protect your interests
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <Link to={service.link} className="block">
                <div className="relative h-64 mb-6 overflow-hidden rounded-xl">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                  </div>
                </div>
                <p className="text-lg text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center text-bright-orange-500 font-medium group-hover:text-bright-orange-600 transition-colors">
                  <span>Learn more</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16">
          <div className="relative overflow-hidden rounded-xl">
            <img 
              src="https://images.unsplash.com/photo-1593115057322-e94b77572f20?q=80&w=2400&auto=format&fit=crop" 
              alt="Legal team working"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center p-10">
              <div className="max-w-xl">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Comprehensive Legal Services for Every Situation
                </h3>
                <p className="text-white/90 mb-8 text-lg">
                  Our team of expert attorneys provides a wide range of legal services to meet your personal and business needs.
                </p>
                <Link to="">
                  <button className="px-8 py-3 bg-bright-orange-500 text-white rounded-lg font-medium hover:bg-bright-orange-600 transition-colors flex items-center">
                    View all services <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(ServicesGallery);
