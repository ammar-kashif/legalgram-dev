import React from 'react';
import { 
  FileText, 
  User, 
  CreditCard, 
  Home,
  LogOut 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
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
    { icon: Home, label: "Dashboard", onClick: () => setActiveTab("documents") },
    { icon: User, label: "Profile", onClick: () => setActiveTab("profile") },
    { icon: CreditCard, label: "Payment", onClick: () => setActiveTab("payment") },
    { icon: FileText, label: "Documents", onClick: () => setActiveTab("documents") },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="text-sm font-medium">{userName}</div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleLogout}
          className="hover:bg-destructive/10"
          title="Logout"
        >
          <LogOut className="h-5 w-5 text-destructive" />
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton 
                onClick={item.onClick} 
                isActive={activeTab === item.label.toLowerCase()}
                tooltip={item.label}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default UserDashboardSidebar;
