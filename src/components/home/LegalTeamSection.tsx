
import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, MessageSquare } from "lucide-react";

const LegalTeamSection = () => {
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
    
    const section = document.getElementById("legal-team-section");
    if (section) observer.observe(section);
    
    return () => observer.disconnect();
  }, []);

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Corporate Law",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
      experience: "12+ years experience",
      rating: 4.9,
      reviews: 142
    },
    {
      name: "Michael Rodriguez",
      role: "Family Law",
      image: "https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?q=80&w=800&auto=format&fit=crop",
      experience: "15+ years experience",
      rating: 4.8,
      reviews: 168
    },
    {
      name: "Jennifer Williams",
      role: "Estate Planning",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
      experience: "9+ years experience",
      rating: 4.9,
      reviews: 127
    },
    {
      name: "David Chang",
      role: "Intellectual Property",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
      experience: "11+ years experience",
      rating: 4.7,
      reviews: 98
    }
  ];

  return (
    <section id="legal-team-section" className="py-20 md:py-28 bg-[#FDE1D3]/30">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="inline-block bg-bright-orange-100 text-bright-orange-600 font-medium px-4 py-1 rounded-full text-sm mb-3">Our Legal Experts</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-black">
            Meet Our Top Legal Professionals
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our network of expert attorneys is ready to provide you with personalized legal advice and solutions
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all group"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {member.experience}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-1">{member.name}</h3>
                <p className="text-bright-orange-600 font-medium mb-3">{member.role}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-medium">{member.rating}</span>
                    <span className="ml-1 text-gray-500">({member.reviews})</span>
                  </div>
                  <Link to="/ask-a-lawyer" className="flex items-center text-bright-orange-500 hover:text-bright-orange-600 transition-colors">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Consult</span>
                  </Link>
                </div>
                <Link to="/attorney-profile" className="block w-full text-center py-2 border border-bright-orange-500 text-bright-orange-500 rounded-lg hover:bg-bright-orange-50 transition-colors mt-2">
                  View Profile
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/our-attorneys">
            <button className="px-8 py-3 bg-white border border-bright-orange-500 text-bright-orange-500 rounded-lg font-medium hover:bg-bright-orange-50 transition-colors inline-flex items-center">
              See all legal experts <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default memo(LegalTeamSection);
