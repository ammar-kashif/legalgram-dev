
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DocumentsSection = () => {
  const navigate = useNavigate();
  
  const popularDocuments = useMemo(() => [
    { id: 1, text: "Last Will and Testament" },
    { id: 4, text: "Power of Attorney" },
    { id: 2, text: "Non-Disclosure Agreement" },
    { id: 3, text: "LLC Operating Agreement" },
    { id: 5, text: "Residential Lease" },
    { id: 6, text: "Employment Contract" }
  ], []);

  const handleDocumentClick = async (id: number) => {
    // Check if user is authenticated
    const { data } = await supabase.auth.getSession();
    
    if (data.session) {
      // User is logged in, navigate to the document in the dashboard
      navigate('/user-dashboard', { state: { activeTab: 'documents' } });
    } else {
      // User is not logged in, redirect to login
      toast.info("Please log in to access document templates");
      navigate("/login");
    }
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
            Create any of these documents in minutes with our easy-to-use platform.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {popularDocuments.map(({ id, text }) => (
            <div 
              key={id}
              onClick={() => handleDocumentClick(id)}
              className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:border-bright-orange-300 hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="bg-bright-orange-100 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center group-hover:bg-bright-orange-200 transition-colors">
                <FileText className="h-8 w-8 text-[#F18F01]" />
              </div>
              <span className="font-medium text-black">{text}</span>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            variant="orange" 
            className="hover:bg-[#D17701] shadow-md px-8 py-6 h-auto text-lg"
            onClick={() => navigate("/login")}
          >
            Sign in to create documents <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DocumentsSection;
