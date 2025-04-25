
import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import MakeDocuments from '@/components/dashboard/MakeDocuments';
import UserProfile from '@/components/dashboard/UserProfile';
import PaymentInfo from '@/components/dashboard/PaymentInfo';
import StatsVisuals from '@/components/dashboard/StatsVisuals';

interface DashboardContentProps {
  activeTab: string;
  userEmail: string;
  userCreatedAt: string;
  userMetadata: any;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  activeTab,
  userEmail,
  userCreatedAt,
  userMetadata
}) => {
  return (
    <div className="mb-8">
      <SidebarTrigger className="md:hidden mb-4" />
      
      {activeTab === "documents" && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Your Documents</h2>
          <StatsVisuals />
          <div className="mt-8">
            <MakeDocuments />
          </div>
        </div>
      )}
      
      {activeTab === "profile" && (
        <UserProfile 
          userEmail={userEmail}
          userCreatedAt={userCreatedAt}
          userMetadata={userMetadata}
        />
      )}
      
      {activeTab === "payment" && (
        <PaymentInfo />
      )}
    </div>
  );
};

export default DashboardContent;
