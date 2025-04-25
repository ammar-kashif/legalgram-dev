
import { memo } from "react";
import { Shield, Gavel, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LegalConcernsSection = () => {
  const concerns = [
    {
      title: "Family Protection",
      description: "Secure your family's future with wills, trusts, and estate planning documents.",
      image: "/lovable-uploads/bbae67ec-7fdd-49d8-adfd-ca2a1c8a05a1.png",
      icon: Shield,
      link: "/family-law",
      gradient: "from-blue-500/20 to-blue-600/20"
    },
    {
      title: "Business Security",
      description: "Protect your business with contracts, agreements, and legal compliance documents.",
      image: "/lovable-uploads/c9d521b5-31e5-47a0-9d04-c2539ddd886e.png",
      icon: Gavel,
      link: "/business-law",
      gradient: "from-orange-500/20 to-orange-600/20"
    },
    {
      title: "Property Matters",
      description: "Handle real estate transactions and property disputes with proper legal documentation.",
      image: "/lovable-uploads/f71dcb3e-44f6-47f2-a368-b65778dfe4da.png",
      icon: ScrollText,
      link: "/property-law",
      gradient: "from-green-500/20 to-green-600/20"
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="inline-block bg-bright-orange-100 text-bright-orange-600 font-medium px-4 py-1 rounded-full text-sm mb-3">
            Legal Protection
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-black">
            Common Legal Concerns We Address
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive legal solutions for your most important concerns
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {concerns.map((concern, index) => (
            <div 
              key={index}
              className="relative group overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <img
                  src={concern.image}
                  alt={concern.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${concern.gradient} backdrop-blur-[2px] opacity-60 group-hover:opacity-70 transition-opacity duration-300`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="mb-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg inline-block transform group-hover:scale-110 transition-transform duration-300">
                        <concern.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                        {concern.title}
                      </h3>
                      <p className="text-white/90 mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                        {concern.description}
                      </p>
                      <Link to={concern.link}>
                        <Button 
                          variant="orange"
                          className="w-full transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(LegalConcernsSection);
