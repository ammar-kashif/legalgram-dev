
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  FileText, Shield, Clock, Book, CheckCircle, ArrowRight, 
  ChevronRight, Award, Scale, PenTool, BookOpen, Search
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DocumentCategorySection from "./documents/DocumentCategorySection";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const documentTemplates = [
  { 
    id: 1, 
    name: "Last Will and Testament", 
    category: "Estate Planning", 
    complexity: "Medium",
    icon: <FileText className="h-6 w-6 text-bright-orange-500" />,
    badge: "Most Popular",
    badgeColor: "green",
    description: "Create a comprehensive and legally binding will that ensures your wishes are carried out. This document helps you specify beneficiaries, assign executors, and outline your final wishes with clarity and legal precision.",
    features: [
      "Comprehensive asset distribution planning",
      "Executor appointment and responsibilities",
      "Beneficiary designation with specific details",
      "Legal requirements and witnessing guidelines"
    ],
    gradientFrom: "from-bright-orange-50/50",
    gradientTo: "to-bright-orange-100/50"
  },
  { 
    id: 2, 
    name: "Non-Disclosure Agreement", 
    category: "Business", 
    complexity: "Low",
    icon: <Shield className="h-6 w-6 text-deep-blue-500" />,
    badge: "Easy to Complete",
    badgeColor: "blue",
    description: "Protect your confidential information with our professionally drafted NDA template. Perfect for business partnerships, employee agreements, and contractor relationships, ensuring your sensitive information remains secure.",
    features: [
      "Comprehensive confidentiality terms",
      "Trade secrets protection clauses",
      "Clear term and termination details",
      "Non-circumvention provisions"
    ],
    gradientFrom: "from-deep-blue-50/50",
    gradientTo: "to-deep-blue-100/50"
  },
  { 
    id: 3, 
    name: "Power of Attorney", 
    category: "Estate Planning", 
    complexity: "Medium",
    icon: <Scale className="h-6 w-6 text-bright-orange-500" />,
    badge: "Essential Document",
    badgeColor: "bright-orange",
    description: "Designate a trusted individual to make financial and legal decisions on your behalf with our comprehensive Power of Attorney document. Essential for estate planning and emergency situations.",
    features: [
      "Detailed powers specification",
      "Agent responsibilities outline",
      "Duration and revocation terms",
      "Healthcare decisions inclusion"
    ],
    gradientFrom: "from-bright-orange-50/50",
    gradientTo: "to-bright-orange-100/50"
  },
  { 
    id: 4, 
    name: "Residential Lease Agreement", 
    category: "Real Estate", 
    complexity: "Medium",
    icon: <Book className="h-6 w-6 text-bright-orange-500" />,
    badge: "Comprehensive Agreement",
    badgeColor: "deep-blue",
    description: "Create a comprehensive lease agreement that protects both landlord and tenant interests. Includes all necessary clauses and legal requirements.",
    features: [
      "Rent and security deposit terms",
      "Maintenance responsibilities",
      "Property rules and regulations",
      "Notice requirements"
    ],
    gradientFrom: "from-bright-orange-50/50",
    gradientTo: "to-bright-orange-100/50"
  },
  { 
    id: 5, 
    name: "Employment Contract", 
    category: "Business", 
    complexity: "High",
    icon: <PenTool className="h-6 w-6 text-deep-blue-500" />,
    badge: "Comprehensive Contract",
    badgeColor: "deep-blue",
    description: "Draft a detailed employment contract that clearly outlines terms, responsibilities, compensation, and company policies.",
    features: [
      "Compensation details",
      "Benefits specification",
      "Work responsibilities",
      "Termination conditions"
    ],
    gradientFrom: "from-deep-blue-50/50",
    gradientTo: "to-deep-blue-100/50"
  },
  { 
    id: 6, 
    name: "Freelance Contract", 
    category: "Business", 
    complexity: "Medium",
    icon: <PenTool className="h-6 w-6 text-deep-blue-500" />,
    badge: "Comprehensive Contract",
    badgeColor: "deep-blue",
    description: "Establish clear terms and conditions for freelance work. Protect your interests while maintaining professional relationships.",
    features: [
      "Project scope definition",
      "Payment terms",
      "Deliverable specifications",
      "Intellectual property rights"
    ],
    gradientFrom: "from-deep-blue-50/50",
    gradientTo: "to-deep-blue-100/50"
  }
];

const MakeDocuments = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  const handleStartCreating = (documentId: number) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to use this template");
      navigate("/login");
      return;
    }
    
    navigate(`/document-detail/${documentId}`);
    toast.success("Template loaded successfully");
  };
  
  const categories = [...new Set(documentTemplates.map(doc => doc.category))];
  
  const filteredDocuments = selectedCategory 
    ? documentTemplates.filter(doc => doc.category === selectedCategory)
    : documentTemplates.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const features = [
    {
      icon: <Shield className="h-6 w-6 text-bright-orange-500" />,
      title: "Legally Sound",
      description: "All documents are reviewed by legal professionals and regularly updated"
    },
    {
      icon: <Clock className="h-6 w-6 text-bright-orange-500" />,
      title: "Quick Process",
      description: "Create your document in minutes, not hours"
    },
    {
      icon: <BookOpen className="h-6 w-6 text-bright-orange-500" />,
      title: "Clear Instructions",
      description: "Step-by-step guidance through the document creation process"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-bright-orange-500" />,
      title: "Validation Included",
      description: "Built-in checks to ensure your document is complete and accurate"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Search and Filters */}
      <div className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100 p-6",
        isMobile ? "mx-2" : ""
      )}>
        <div className={cn(
          "flex items-center gap-4",
          isMobile ? "flex-col" : "flex-row"
        )}>
          <div className={cn(
            "relative",
            isMobile ? "w-full" : "w-64"
          )}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-gray-50"
            />
          </div>
          
          <div className={cn(
            "flex gap-2 flex-wrap",
            isMobile ? "w-full overflow-x-auto pb-2" : ""
          )}>
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
              className="rounded-full"
            >
              All Documents
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
                className={`rounded-full whitespace-nowrap ${
                  selectedCategory === category ? 'bg-bright-orange-500 hover:bg-bright-orange-600' : ''
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1 mx-2" : "grid-cols-2 md:grid-cols-4"
      )}>
        {features.map((feature, index) => (
          <Card key={index} className="border-border/50 hover:border-bright-orange-500/50 transition-all duration-300 hover:shadow bg-white overflow-hidden">
            <CardContent className="p-5">
              <div className="mb-4 bg-bright-orange-50 p-3 rounded-lg inline-block">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium mb-2 text-deep-blue-900">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Document Sections */}
      <div className="space-y-8">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(null);
              }} 
              variant="outline"
              className="inline-flex items-center"
            >
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredDocuments.map((document, index) => (
            <DocumentCategorySection
              key={document.id}
              document={document}
              onStartCreating={handleStartCreating}
              isAuthenticated={isAuthenticated}
              index={index}
            />
          ))
        )}
      </div>

      {/* How It Works */}
      <div className={cn(
        "bg-white rounded-xl p-8 border border-gray-100 shadow-sm",
        isMobile ? "mx-2" : ""
      )}>
        <h2 className="text-2xl font-semibold mb-8 text-center text-deep-blue-900">How It Works</h2>
        <div className={cn(
          "grid gap-8", 
          isMobile ? "grid-cols-1" : "md:grid-cols-3"
        )}>
          {[
            {
              step: "1",
              title: "Choose Template",
              description: "Select from our extensive library of legal document templates"
            },
            {
              step: "2",
              title: "Fill Details",
              description: "Answer simple questions to customize your document"
            },
            {
              step: "3",
              title: "Download & Sign",
              description: "Get your professional document ready for signing"
            }
          ].map((step, index) => (
            <div key={index} className="relative">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-bright-orange-100 flex items-center justify-center text-bright-orange-500 font-bold text-lg">
                  {step.step}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-lg text-deep-blue-900">{step.title}</h3>
                </div>
              </div>
              <p className="ml-14 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className={cn(
        "bg-white rounded-xl p-8 border border-gray-100 shadow-sm mb-8",
        isMobile ? "mx-2" : ""
      )}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-deep-blue-900">Trusted by Thousands</h2>
          <p className="text-muted-foreground">Join thousands of satisfied users who trust our platform</p>
        </div>
        <div className={cn(
          "grid gap-4", 
          isMobile ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"
        )}>
          {[
            { icon: <Shield className="h-5 w-5" />, text: "256-bit Encryption" },
            { icon: <CheckCircle className="h-5 w-5" />, text: "GDPR Compliant" },
            { icon: <Award className="h-5 w-5" />, text: "Legal Expert Reviewed" },
            { icon: <Clock className="h-5 w-5" />, text: "24/7 Support" }
          ].map((badge, index) => (
            <div key={index} className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-bright-orange-500 mr-2">{badge.icon}</div>
              <span className="font-medium text-sm text-deep-blue-800">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MakeDocuments;
