import { memo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Home, 
  Building, 
  Users, 
  FileText, 
  Briefcase, 
  Scale, 
  ScrollText, 
  HelpingHand,
  GraduationCap,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PracticeAreas = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll('.practice-area-item').forEach(item => {
      observer.observe(item);
    });
    
    return () => observer.disconnect();
  }, []);

  const handleProtectedNavigation = () => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/documents");
      } else {
        navigate("/login");
      }
    });
  };

  const areas = [
    { icon: Home, name: "Real Estate", path: "/documents/real-estate", color: "from-blue-500 to-blue-600" },
    { icon: Building, name: "Business Formation", path: "/documents/business", color: "from-amber-500 to-amber-600" },
    { icon: Users, name: "Family Law", path: "/documents/family", color: "from-green-500 to-green-600" },
    { icon: FileText, name: "Estate Planning", path: "/documents/estate", color: "from-purple-500 to-purple-600" },
    { icon: Briefcase, name: "Employment", path: "/documents/employment", color: "from-rose-500 to-rose-600" },
    { icon: Scale, name: "Civil Litigation", path: "/documents/litigation", color: "from-indigo-500 to-indigo-600" },
    { icon: ScrollText, name: "Contracts", path: "/documents/contracts", color: "from-cyan-500 to-cyan-600" },
    { icon: HelpingHand, name: "Intellectual Property", path: "/documents/ip", color: "from-red-500 to-red-600" },
    { icon: GraduationCap, name: "Education Law", path: "/documents/education", color: "from-emerald-500 to-emerald-600" }
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-rocket-gray-50 to-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="inline-block bg-bright-orange-100 text-bright-orange-600 font-medium px-4 py-1 rounded-full text-sm mb-3">Practice Areas</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-black">
            Legal Solutions for Every Need
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We offer comprehensive legal services across many practice areas to assist with all your legal needs.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8">
          {areas.map((area, index) => {
            const Icon = area.icon;
            const isVisible = visibleItems.includes(index);
            
            return (
              <Link 
                to={area.path} 
                key={index}
                data-index={index}
                className={`practice-area-item flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 text-center group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`bg-gradient-to-r ${area.color} p-4 rounded-xl mb-5 text-white transform group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-black">{area.name}</h3>
              </Link>
            );
          })}
        </div>
        
        <div className="flex justify-center mt-12">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-bright-orange-500 hover:text-bright-orange-600 font-medium bg-transparent border-none outline-none cursor-pointer"
            onClick={handleProtectedNavigation}
          >
            <span>View all legal documents</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default memo(PracticeAreas);
