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
    title: "Last Will and Testament",
    category: "Estate Planning",
    description: "Create a legally binding will to distribute your assets and property.",
    popular: true,
  },
  {
    id: 2,
    title: "Non-Disclosure Agreement",
    category: "Business",
    description: "Protect confidential information when working with contractors or partners.",
    popular: true,
  },
  {
    id: 3,
    title: "LLC Operating Agreement",
    category: "Business",
    description: "Define the financial and working relationships between business owners.",
    popular: false,
  },
  {
    id: 4,
    title: "Power of Attorney",
    category: "Estate Planning",
    description: "Authorize someone to act on your behalf for legal, financial, or medical decisions.",
    popular: true,
  },
  {
    id: 5,
    title: "Residential Lease Agreement",
    category: "Real Estate",
    description: "Create a binding agreement between a landlord and tenant for property rental.",
    popular: true,
  },
  {
    id: 6,
    title: "Employment Contract",
    category: "Employment",
    description: "Establish clear terms and conditions for hiring employees.",
    popular: false,
  },
  {
    id: 7,
    title: "Trademark Application",
    category: "Intellectual Property",
    description: "File for protection of your brand names, logos, and slogans.",
    popular: false,
  },
  {
    id: 8,
    title: "Divorce Settlement",
    category: "Family",
    description: "Create a legal agreement to divide assets and resolve other matters during divorce.",
    popular: false,
  },
  {
    id: 9,
    title: "Lease Agreement",
    category: "Real Estate",
    description: "Comprehensive lease agreement with detailed terms for landlords and tenants.",
    popular: true,
  },
];

const DocumentTemplates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const categories = ["all", "Business", "Estate Planning", "Real Estate", "Employment", "Intellectual Property", "Family"];
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // If user is authenticated, redirect to dashboard document section
          navigate("/user-dashboard", { state: { activeTab: "documents" } });
          return;
        }
        
        setIsAuthenticated(false);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleUseTemplate = (id: number) => {
    toast.error("Please log in to use document templates");
    navigate("/login");
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
                Choose from our wide range of professionally crafted legal document templates.
                Please log in to access these templates.
              </p>
              
              <div className="flex justify-start mb-6">
                <Button onClick={() => navigate("/login")} className="bg-primary hover:bg-primary/90">
                  Log in to Create Documents
                </Button>
              </div>
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
              isAuthenticated={false} // Always false since we redirect authenticated users
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
