import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

const DocumentsSection = () => {
  const popularDocuments = useMemo(() => [
    { link: "/documents", text: "Residential Lease Agreement" }
  ], []);

  const navigate = useNavigate();

  const handleProtectedNavigation = () => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/documents");
      } else {
        navigate("/login");
      }
    });
  };

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="inline-block bg-bright-orange-100 text-bright-orange-600 font-medium px-4 py-1 rounded-full text-sm mb-3">Popular Documents</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-black">
            Most Frequently Used Legal Documents
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create a Residential Lease Agreement in minutes with our easy-to-use platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-12">
          {popularDocuments.map(({ link, text }) => (
            <Link 
              to={link} 
              key={text} 
              className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:border-bright-orange-300 hover:shadow-xl transition-all group"
            >
              <div className="bg-bright-orange-100 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center group-hover:bg-bright-orange-200 transition-colors">
                <FileText className="h-8 w-8 text-[#F18F01]" />
              </div>
              <span className="font-medium text-black">{text}</span>
            </Link>
          ))}
        </div>
        
        <div className="text-center">
          <button
            type="button"
            className="inline-flex items-center justify-center bg-bright-orange-500 text-white font-medium rounded-lg shadow-md px-8 py-6 h-auto text-lg hover:bg-[#D17701] transition-colors"
            onClick={handleProtectedNavigation}
          >
            Create Lease Agreement <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DocumentsSection;
