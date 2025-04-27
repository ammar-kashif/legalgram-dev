
import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import MakeDocuments from '@/components/dashboard/MakeDocuments';
import UserProfile from '@/components/dashboard/UserProfile';
import PaymentInfo from '@/components/dashboard/PaymentInfo';
import StatsVisuals from '@/components/dashboard/StatsVisuals';
import MakeDocument from '@/components/dashboard/MakeDocument';
import StartBusiness from '@/components/dashboard/StartBusiness';
import LegalAdvice from '@/components/dashboard/LegalAdvice';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Building, MessageSquare } from "lucide-react";

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
      
      {activeTab === "dashboard" && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Your Dashboard</h2>
          <StatsVisuals />
          
          <h3 className="text-xl font-medium mt-8 mb-4">Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Make Documents
                </CardTitle>
                <CardDescription>
                  Create legal documents from professional templates
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                Choose from our library of templates and customize for your needs.
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Create Document</Button>
              </CardFooter>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Start Business
                </CardTitle>
                <CardDescription>
                  Form your business entity quickly and easily
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                Get help with LLCs, corporations, and other business formations.
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Start Now</Button>
              </CardFooter>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Ask Legal Advice
                </CardTitle>
                <CardDescription>
                  Get expert answers to your legal questions
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                Submit legal questions and receive guidance from qualified attorneys.
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Ask Question</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8">
            <MakeDocuments />
          </div>
        </div>
      )}
      
      {activeTab === "documents" && (
        <MakeDocument />
      )}
      
      {activeTab === "business" && (
        <StartBusiness />
      )}
      
      {activeTab === "legal-advice" && (
        <LegalAdvice />
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
