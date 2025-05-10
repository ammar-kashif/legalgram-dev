
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import HeroSection from "@/components/documents/HeroSection";
import SearchFilter from "@/components/documents/SearchFilter";
import DocumentGrid from "@/components/documents/DocumentGrid";
import LoadingSpinner from "@/components/documents/LoadingSpinner";
import { DocumentItem } from "@/components/documents/DocumentCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const documents: DocumentItem[] = [
  {
    id: 1,
    title: "Residential Lease Agreement",
    category: "Real Estate",
    description: "Create a binding agreement between a landlord and tenant for property rental.",
    popular: true,
  }
];

const DocumentTemplates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const categories = ["all", "Real Estate"];
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );
    
    return () => subscription.unsubscribe();
  }, [navigate]);
  
  const handleUseTemplate = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to use document templates");
      navigate("/login");
      return;
    }
    
    navigate("/documents");
  };

  const resetFilters = () => {
    setSearchTerm("");
    setActiveCategory("all");
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <HeroSection isAuthenticated={isAuthenticated} />
      
      <div className="bg-white">
        <div className="container-custom py-8 md:py-12">
          <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4' : ''}`}>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Available Templates
              </h2>
              <p className="text-gray-600 max-w-2xl mb-6">
                Create your Residential Lease Agreement with our professionally crafted legal document template.
              </p>
              
              {isAuthenticated && (
                <div className="flex justify-start mb-6">
                  <Link to="/user-dashboard">
                    <Button variant="outline" className="flex items-center gap-2">
                      Access Document Creator in Dashboard
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            
            <SearchFilter 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              categories={categories}
            />
            
            <DocumentGrid
              documents={documents}
              isAuthenticated={isAuthenticated}
              onUseTemplate={handleUseTemplate}
              searchTerm={searchTerm}
              activeCategory={activeCategory}
              onReset={resetFilters}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentTemplates;
