
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  Calendar, 
  Home, 
  FileText, 
  User, 
  Mail, 
  Phone
} from "lucide-react";
import ScheduleMeeting from "@/components/dashboard/ScheduleMeeting";
import AccountInfo from "@/components/dashboard/AccountInfo";
import { supabase } from "@/integrations/supabase/client";

type TabType = 
  | "dashboard" 
  | "schedule" 
  | "documents" 
  | "contact" 
  | "book-call" 
  | "account";

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        setUser(data.session.user);
      } else {
        navigate("/login");
      }
      setIsLoading(false);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setIsAuthenticated(true);
          setUser(session.user);
        } else {
          setIsAuthenticated(false);
          navigate("/login");
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Welcome, {user?.user_metadata?.first_name || 'User'}!</h1>
                <p className="text-muted-foreground">What would you like to do today?</p>
              </div>
              <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Basic Plan
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800/30 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">Schedule a consultation</h3>
                <p className="text-purple-600 dark:text-purple-400 mt-1 mb-4">Book time with one of our lawyers</p>
                <button 
                  className="text-sm font-medium flex items-center text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
                  onClick={() => setActiveTab("schedule")}
                >
                  Schedule now
                  <svg className="ml-1 h-4 w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800/30 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Document Creation</h3>
                <p className="text-blue-600 dark:text-blue-400 mt-1 mb-4">Create and manage legal documents</p>
                <button 
                  className="text-sm font-medium flex items-center text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                  onClick={() => setActiveTab("documents")}
                >
                  Create documents
                  <svg className="ml-1 h-4 w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-rocket-gray-800 rounded-xl border border-border/40 dark:border-rocket-gray-700 shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="flex items-center justify-center h-32 bg-muted/40 dark:bg-rocket-gray-700/40 rounded-lg border border-dashed">
                <p className="text-muted-foreground">No recent activity yet. As you use our services, your actions will appear here.</p>
              </div>
            </div>
          </div>
        );
      case "schedule":
        return <ScheduleMeeting />;
      case "book-call":
        return (
          <div>
            <h1 className="heading-lg mb-2">Book a Call</h1>
            <p className="text-rocket-gray-500 mb-6">
              Schedule a consultation call with one of our legal experts.
            </p>
            <div className="bg-white dark:bg-rocket-gray-800 rounded-xl border border-border/40 dark:border-rocket-gray-700 shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Available Consultation Types</h2>
            </div>
          </div>
        );
      case "documents":
        return (
          <div>
            <h1 className="heading-lg mb-2">Document Creation</h1>
            <p className="text-rocket-gray-500 mb-6">
              Create and manage your legal documents.
            </p>
            <div className="bg-white dark:bg-rocket-gray-800 rounded-xl border border-border/40 dark:border-rocket-gray-700 shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Create a Document</h2>
            </div>
          </div>
        );
      case "contact":
        return (
          <div>
            <h1 className="heading-lg mb-2">Contact Us</h1>
            <p className="text-rocket-gray-500 mb-6">
              Get in touch with our team for any questions or support.
            </p>
            <div className="bg-white dark:bg-rocket-gray-800 rounded-xl border border-border/40 dark:border-rocket-gray-700 shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            </div>
          </div>
        );
      case "account":
        return <AccountInfo user={user} onSignOut={handleSignOut} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login in useEffect
  }

  return (
    <Layout>
      <SidebarProvider>
        <div className="flex h-full min-h-screen w-full">
          <Sidebar>
            <SidebarContent>
              <div className="px-3 py-4">
                <div className="mb-6 px-2 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-primary">Legal Dashboard</h2>
                  <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
                </div>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "dashboard"}
                      onClick={() => setActiveTab("dashboard")}
                      tooltip="Dashboard"
                      className="w-full group transition-colors duration-200"
                    >
                      <Home className={`h-4 w-4 ${activeTab === "dashboard" ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "contact"}
                      onClick={() => setActiveTab("contact")}
                      tooltip="Contact Us"
                      className="w-full group transition-colors duration-200"
                    >
                      <Mail className={`h-4 w-4 ${activeTab === "contact" ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
                      <span>Contact Us</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "book-call"}
                      onClick={() => setActiveTab("book-call")}
                      tooltip="Book a Call"
                      className="w-full group transition-colors duration-200"
                    >
                      <Phone className={`h-4 w-4 ${activeTab === "book-call" ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
                      <span>Book a Call</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "documents"}
                      onClick={() => setActiveTab("documents")}
                      tooltip="Document Creation"
                      className="w-full group transition-colors duration-200"
                    >
                      <FileText className={`h-4 w-4 ${activeTab === "documents" ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
                      <span>Document Creation</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "account"}
                      onClick={() => setActiveTab("account")}
                      tooltip="Account"
                      className="w-full group transition-colors duration-200"
                    >
                      <User className={`h-4 w-4 ${activeTab === "account" ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
                      <span>Account</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>
            </SidebarContent>
          </Sidebar>
          
          <SidebarInset>
            <div className="container mx-auto max-w-6xl py-6 px-4 md:px-8 md:py-8">
              {renderTabContent()}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </Layout>
  );
};

export default Dashboard;
