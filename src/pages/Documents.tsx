
import React from "react";
import Layout from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const Documents = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is already logged in, redirect to dashboard's document section
        navigate("/user-dashboard", { state: { activeTab: "documents" } });
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleGetStarted = () => {
    toast.info("Please log in to access document templates");
    navigate("/login");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Legal Document Templates</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Create professional legal documents in minutes with our easy-to-use templates. 
            Sign in to access our complete library of templates.
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-bright-orange-500 hover:bg-bright-orange-600 text-white"
          >
            <FileText className="mr-2 h-5 w-5" />
            Get Started
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Documents;
