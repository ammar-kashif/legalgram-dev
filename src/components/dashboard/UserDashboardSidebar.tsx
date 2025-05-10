
import React from 'react';
import { 
  FileText, 
  User, 
  CreditCard, 
  Home,
  LogOut,
  Building,
  MessageSquare
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface UserDashboardSidebarProps {
  userName: string;
  handleLogout: () => Promise<void>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const UserDashboardSidebar: React.FC<UserDashboardSidebarProps> = ({ 
  userName, 
  handleLogout, 
  activeTab,
  setActiveTab 
}) => {
  const sidebarItems = [
    { icon: Home, label: "Dashboard", onClick: () => setActiveTab("dashboard") },
    { icon: FileText, label: "Member Benefits", onClick: () => setActiveTab("member-benefits") },
    { icon: FileText, label: "Make Documents", onClick: () => setActiveTab("documents") },
    { icon: Building, label: "Start Business", onClick: () => setActiveTab("business") },
    { icon: MessageSquare, label: "Ask Legal Advice", onClick: () => setActiveTab("legal-advice") },
    { icon: User, label: "Profile", onClick: () => setActiveTab("profile") },
    { icon: CreditCard, label: "Payment", onClick: () => setActiveTab("payment") },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="text-base font-medium">{userName}</div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton 
                onClick={item.onClick} 
                isActive={activeTab === item.label.toLowerCase()}
                className="h-11 w-full justify-start gap-3 px-4 hover:bg-muted"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-base">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start gap-3 hover:bg-destructive/10 text-destructive hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default UserDashboardSidebar;
