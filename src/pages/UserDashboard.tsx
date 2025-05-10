
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import UserDashboardSidebar from '@/components/dashboard/UserDashboardSidebar';
import DashboardContent from '@/components/dashboard/DashboardContent';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("documents");
  const [userEmail, setUserEmail] = useState("");
  const [userCreatedAt, setUserCreatedAt] = useState("");
  const [userMetadata, setUserMetadata] = useState<any>(null);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error logging out");
        return;
      }
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const email = data.session.user.email || "";
          
          // Check if the current user is admin
          if (email === "admin@legalgram.com") {
            // Redirect to admin dashboard
            navigate("/admin-dashboard");
            return;
          }
          
          setIsAuthenticated(true);
          setUserEmail(email);
          
          // Format the created_at date to a readable format
          const createdAt = new Date(data.session.user.created_at);
          const createdAtFormatted = createdAt.toLocaleString('default', { 
            month: 'long', 
            year: 'numeric' 
          });
          setUserCreatedAt(createdAtFormatted);
          
          // Store user metadata
          setUserMetadata(data.session.user.user_metadata);
          
          // Set the user name
          const firstName = data.session.user.user_metadata?.first_name;
          setUserName(firstName || email.split('@')[0] || "User");
          
          setIsLoaded(true);
        } else {
          toast.error("Please log in to access your dashboard");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast.error("Authentication error. Please try again.");
        navigate("/login");
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          const email = session.user.email || "";
          
          // Check if the current user is admin
          if (email === "admin@legalgram.com") {
            // Redirect to admin dashboard
            navigate("/admin-dashboard");
            return;
          }
          
          setIsAuthenticated(true);
          setUserEmail(email);
          
          // Format the created_at date to a readable format
          const createdAt = new Date(session.user.created_at);
          const createdAtFormatted = createdAt.toLocaleString('default', { 
            month: 'long', 
            year: 'numeric' 
          });
          setUserCreatedAt(createdAtFormatted);
          
          // Store user metadata
          setUserMetadata(session.user.user_metadata);
          
          // Set the user name
          const firstName = session.user.user_metadata?.first_name;
          setUserName(firstName || email.split('@')[0] || "User");
          
          setIsLoaded(true);
        } else {
          setIsAuthenticated(false);
          toast.error("You have been logged out");
          navigate("/login");
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen w-full">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <UserDashboardSidebar 
            userName={userName}
            handleLogout={handleLogout}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          
          <div className="flex-1 overflow-auto">
            <div className="container-custom p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold">Welcome to Legal Portal</h1>
                <p className="text-muted-foreground mt-2">
                  Manage your legal documents, consultations, and get expert advice.
                </p>
              </div>
              
              <DashboardContent 
                activeTab={activeTab}
                userEmail={userEmail}
                userCreatedAt={userCreatedAt}
                userMetadata={userMetadata}
              />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default UserDashboard;
