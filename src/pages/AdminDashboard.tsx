
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { redirectIfNotAdmin } from "@/utils/adminAuth";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, 
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, LogOut, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserManagementTable from "@/components/admin/UserManagementTable";
import ConsultationsTable from "@/components/admin/ConsultationsTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<"dashboard" | "consultations" | "users">("dashboard");

  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true);
      const isAdmin = await redirectIfNotAdmin(navigate);
      setIsAuthorized(isAdmin);
      setIsLoading(false);
    };
    
    checkAdminStatus();
  }, [navigate]);

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

  // If loading, show loading screen
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
      </div>
    );
  }
  
  // If not authorized, redirect is handled by the redirectIfNotAdmin function
  if (!isAuthorized) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-rocket-gray-900">
        <Sidebar>
          <SidebarHeader className="py-6 flex justify-between items-center">
            <div className="px-3">
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">Manage your legal platform</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="mr-3 hover:bg-destructive/10"
              title="Logout"
            >
              <LogOut className="h-5 w-5 text-destructive" />
            </Button>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveView("dashboard")}
                    isActive={activeView === "dashboard"}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveView("consultations")}
                    isActive={activeView === "consultations"}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Consultations</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveView("users")}
                    isActive={activeView === "users"}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>Manage Users</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset className="p-6">
          <div className="max-w-7xl mx-auto">
            {activeView === "dashboard" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Welcome back, Admin</h2>
                  <p className="text-muted-foreground">
                    Manage legal documents, user subscriptions, and platform settings.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div 
                    className="bg-rocket-gray-800 p-6 rounded-lg shadow-sm border border-rocket-gray-700 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setActiveView("consultations")}
                  >
                    <Calendar className="h-8 w-8 mb-4 text-primary" />
                    <h3 className="text-lg font-medium mb-1">Consultations</h3>
                    <p className="text-sm text-gray-400">Review and manage consultation requests.</p>
                  </div>
                  
                  <div 
                    className="bg-rocket-gray-800 p-6 rounded-lg shadow-sm border border-rocket-gray-700 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setActiveView("users")}
                  >
                    <Users className="h-8 w-8 mb-4 text-primary" />
                    <h3 className="text-lg font-medium mb-1">User Management</h3>
                    <p className="text-sm text-gray-400">Manage users, subscriptions and permissions.</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeView === "consultations" && <ConsultationsTable />}
            {activeView === "users" && <UserManagementTable />}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;

