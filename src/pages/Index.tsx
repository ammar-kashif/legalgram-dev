
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LandingPage from "./LandingPage";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if there's a hash in the URL (potential auth callback)
    if (window.location.hash || window.location.search.includes('code=')) {
      navigate("/sso-callback");
      return;
    }
    
    // Check authenticated status
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // User is logged in, redirect to user dashboard
          navigate("/user-dashboard");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  return <LandingPage />;
};

export default Index;
